#!/usr/bin/env node
// scripts/generate-calc-seo.cjs
//
// Phase 1 of the calculator-SEO project. For every calculator entry in the
// per-category registries that is MISSING seoTitle/seoDescription/aliases, this
// derives long-tail-friendly metadata from the entry's existing title, category,
// subcategory, and description — then writes it back into the registry file.
//
// It does NOT touch entries that already have a seoTitle (the hand-curated ones).
// It is idempotent: re-running only fills gaps.
//
// Usage:
//   node scripts/generate-calc-seo.cjs            # write changes
//   node scripts/generate-calc-seo.cjs --dry      # print a sample, write nothing
//   node scripts/generate-calc-seo.cjs --only Financial,Health   # limit categories
//
// SAFETY: this edits the per-category registry.ts files, which are the runtime
// source of truth. It parses each entry's fields with regex (the registries are
// uniformly formatted) and inserts the three fields right after `description:`.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const CALC_DIR = path.join(ROOT, "src", "components", "calculators");

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const onlyArg = args.find((a) => a.startsWith("--only"));
const ONLY = onlyArg ? (args[args.indexOf(onlyArg) + 1] || "").split(",").map((s) => s.trim()).filter(Boolean) : null;

const MAX_TITLE = 60;
const DESC_MIN = 150;
const DESC_MAX = 160;

// Friendly category labels for descriptions.
const CATEGORY_LABEL = {
  financial: "finance", health: "health", cooking: "cooking", conversion: "unit",
  math: "math", science: "science", time: "time", pets: "pet", automotive: "auto",
  construction: "construction", electrical: "electrical", everyday: "everyday",
  sports: "sports", funny: "fun", video: "video", marketing: "marketing",
};

// Strip the word "Calculator"/"Estimator"/etc. and parentheticals to get a clean base.
function baseName(title) {
  return title
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\b(Calculator|Estimator|Converter|Planner|Tool|Helper|Checker)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build a <=60-char seoTitle: "<Title>" trimmed, keyword near the front.
function makeSeoTitle(title) {
  let t = title.trim();
  if (t.length <= MAX_TITLE) return t;
  // Drop parentheticals first.
  t = t.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
  if (t.length <= MAX_TITLE) return t;
  // Hard trim on a word boundary.
  return t.slice(0, MAX_TITLE).replace(/\s+\S*$/, "").trim();
}

// Build a 150-160 char description. Prefer the existing description, padded/trimmed
// with a consistent free/instant tail so it lands in range and reads naturally.
function makeSeoDescription(title, description, category) {
  const base = baseName(title);
  const catWord = CATEGORY_LABEL[category] || "online";

  // Graded tails, longest first, so we can pick the one that lands the total
  // string inside 150-160 without ever cutting a tail mid-word.
  const tails = [
    ` Free ${catWord} tool with instant, accurate results — no signup required.`,
    ` Free ${catWord} tool — get instant, accurate results with no signup needed.`,
    " Free, fast, and mobile-friendly with instant, accurate results — no signup.",
    " Free and instant — accurate results on any device, no signup required.",
    " Free, fast, and mobile-friendly — no signup needed.",
    " Free and instant, no signup required.",
    " Free and instant.",
  ];

  // Normalize the human core sentence (no trailing period, single spaces).
  let core = (description || "").trim().replace(/\s+/g, " ").replace(/[.\s]+$/, "");
  if (!core) core = `Calculate ${base.toLowerCase()} fast and accurately`;

  // If the core alone is already in range, use it as a clean sentence.
  if (core.length + 1 >= DESC_MIN && core.length + 1 <= DESC_MAX) {
    return core + ".";
  }
  // If the core alone overflows, trim to a clean sentence inside the window.
  if (core.length + 1 > DESC_MAX) {
    const d = core.slice(0, DESC_MAX - 1).replace(/\s+\S*$/, "");
    return d.replace(/[.\s]+$/, "") + ".";
  }

  // Core is short: append the longest tail that keeps the TOTAL in [DESC_MIN, DESC_MAX].
  // Only append a tail if the full tail fits (never truncate a tail mid-phrase).
  for (const tail of tails) {
    const candidate = core + "." + tail;
    if (candidate.length >= DESC_MIN && candidate.length <= DESC_MAX) return candidate;
  }
  // No tail lands in range (core is in the awkward 135-150 zone where any tail
  // overflows). Return the clean core sentence alone — slightly under 150 is fine
  // and far better than a truncated "Free and." fragment. The calc-seo-reviewer
  // agent expands these afterward with real specifics.
  return core + ".";
}

// Derive up to 4 long-tail aliases from the title. These become alternate URLs +
// search terms getEntry() matches. We generate natural query variants.
function makeAliases(slug, title, category) {
  const base = baseName(title).toLowerCase();
  const baseSlug = slugify(base);
  const cands = new Set();

  // "<thing>-calculator" if slug doesn't already end that way
  if (!slug.endsWith("-calculator")) cands.add(`${baseSlug}-calculator`);
  // question-style long-tail
  cands.add(`how-to-calculate-${baseSlug}`);
  // "<thing>-online" / "free-<thing>"
  cands.add(`${baseSlug}-online`);
  cands.add(`free-${baseSlug}-calculator`);

  // Clean: drop empties, the slug itself, overly long (>60), and duplicates.
  return [...cands]
    .filter((a) => a && a !== slug && a.length <= 60 && a.length >= 6)
    .slice(0, 4);
}

// --- File processing ---------------------------------------------------------

function processFile(file, categoryName) {
  let src = fs.readFileSync(file, "utf8");
  const original = src;

  // Split into entries by the `{ ... }` object boundaries is fragile; instead we
  // work on each `slug:` occurrence and insert after its `description:` line if
  // the entry has no `seoTitle:` before the next `loader:`.
  // We iterate over entries delimited by "  {" ... "loader:".
  const entryRe = /\{\s*\n\s*slug:\s*"([^"]+)",[\s\S]*?loader:/g;
  let match;
  const inserts = []; // {index, text}
  const samples = [];

  while ((match = entryRe.exec(src)) !== null) {
    const block = match[0];
    const slug = match[1];
    if (/seoTitle:/.test(block)) continue; // already has SEO — skip

    // Pull title / category / description from the block.
    const title = (block.match(/title:\s*"([^"]*)"/) || [])[1] || slug;
    const category = (block.match(/category:\s*"([^"]*)"/) || [])[1] || categoryName.toLowerCase();
    const description = (block.match(/description:\s*"([^"]*)"/) || [])[1] || "";

    const seoTitle = makeSeoTitle(title).replace(/"/g, '\\"');
    const seoDescription = makeSeoDescription(title, description, category).replace(/"/g, '\\"');
    const aliases = makeAliases(slug, title, category);

    // Find the description line inside this block to insert after it.
    const descLineMatch = block.match(/(\n(\s*)description:\s*"[^"]*",)/);
    // Some entries may lack a description; fall back to inserting after category.
    const anchorMatch = descLineMatch || block.match(/(\n(\s*)category:\s*"[^"]*",)/);
    if (!anchorMatch) continue;

    const indent = anchorMatch[2];
    const aliasLine = aliases.length
      ? `\n${indent}aliases: [${aliases.map((a) => `"${a}"`).join(", ")}],`
      : "";
    const insertText =
      aliasLine +
      `\n${indent}seoTitle: "${seoTitle}",` +
      `\n${indent}seoDescription: "${seoDescription}",`;

    // Absolute index in src where the anchor line ends.
    const blockStart = match.index;
    const anchorInBlock = block.indexOf(anchorMatch[1]) + anchorMatch[1].length;
    const absIndex = blockStart + anchorInBlock;
    inserts.push({ index: absIndex, text: insertText });

    if (samples.length < 3) {
      samples.push({ slug, seoTitle, seoDescription, aliases });
    }
  }

  // Apply inserts back-to-front so indices stay valid.
  inserts.sort((a, b) => b.index - a.index);
  for (const ins of inserts) {
    src = src.slice(0, ins.index) + ins.text + src.slice(ins.index);
  }

  return { changed: inserts.length, src, original, samples };
}

// --- Main --------------------------------------------------------------------

const files = fs
  .readdirSync(CALC_DIR)
  .map((d) => path.join(CALC_DIR, d, "registry.ts"))
  .filter((f) => fs.existsSync(f));

let totalChanged = 0;
const allSamples = [];

for (const file of files) {
  const categoryName = path.basename(path.dirname(file));
  if (ONLY && !ONLY.includes(categoryName)) continue;

  const { changed, src, samples } = processFile(file, categoryName);
  totalChanged += changed;
  if (changed && samples.length) allSamples.push({ category: categoryName, samples });

  if (changed && !DRY) {
    fs.writeFileSync(file, src, "utf8");
    console.log(`✓ ${categoryName}: filled SEO for ${changed} calculators`);
  } else if (changed) {
    console.log(`(dry) ${categoryName}: would fill ${changed} calculators`);
  }
}

console.log(`\n${DRY ? "Would fill" : "Filled"} SEO for ${totalChanged} calculators total.`);

if (DRY || process.env.SHOW_SAMPLES) {
  console.log("\n=== SAMPLES ===");
  for (const { category, samples } of allSamples.slice(0, 6)) {
    console.log(`\n--- ${category} ---`);
    for (const s of samples) {
      console.log(`  slug:  ${s.slug}`);
      console.log(`  title: ${s.seoTitle} (${s.seoTitle.length})`);
      console.log(`  desc:  ${s.seoDescription} (${s.seoDescription.length})`);
      console.log(`  alias: ${s.aliases.join(", ")}`);
    }
  }
}
