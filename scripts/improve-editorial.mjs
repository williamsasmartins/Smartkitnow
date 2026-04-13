/**
 * improve-editorial.mjs
 * Improves editorial content in calculator TSX files using Claude API.
 * Adds real data tables, expands FAQs, and enriches guide sections.
 *
 * Usage:
 *   node scripts/improve-editorial.mjs --category Financial --dry-run
 *   node scripts/improve-editorial.mjs --category Financial
 *   node scripts/improve-editorial.mjs --file src/components/calculators/Financial/AprCalculator.tsx
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 4096;
const DELAY_MS = 2500; // between API calls
const MIN_FAQS_THRESHOLD = 8; // skip if already has 8+ FAQs AND tables
const PROGRESS_FILE = path.join(ROOT, "scripts", ".improve-progress.json");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── ARGS ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const categoryArg = args.find((a) => a.startsWith("--category="))?.split("=")[1]
  || (args.indexOf("--category") !== -1 ? args[args.indexOf("--category") + 1] : null);
const fileArg = args.find((a) => a.startsWith("--file="))?.split("=")[1]
  || (args.indexOf("--file") !== -1 ? args[args.indexOf("--file") + 1] : null);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
  } catch {
    return { done: [] };
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

/** Extract the calculator title from the TSX file */
function extractTitle(content) {
  // Look for title= on a CalculatorVerticalLayout or CalculatorShell component
  // These appear near "return (" and are the real page titles
  const layoutMatch = content.match(/<Calculator(?:VerticalLayout|Shell|Layout)[^>]*\n?\s*title=["']([^"']+)["']/);
  if (layoutMatch) return layoutMatch[1];
  // Fallback: find last title= that is not "Share result" or "Copy link"
  const all = [...content.matchAll(/title=["']([^"']+)["']/g)];
  const real = all.filter(m => !["Share result", "Copy link", "Copy", "Share"].includes(m[1]));
  return real.length > 0 ? real[0][1] : null;
}

/** Count existing FAQs */
function countFaqs(content) {
  return (content.match(/question:/g) || []).length;
}

/** Check if already has editorial data tables (not-prose wrapper) */
function hasEditorialTables(content) {
  return content.includes("not-prose");
}

/** Find the editorial section boundaries */
function findEditorialBounds(content) {
  const start = content.indexOf("const editorial = (");
  if (start === -1) return null;

  let depth = 0;
  let i = start + "const editorial = ".length;
  // Only track double-quoted strings and template literals.
  // Single quotes are NOT tracked because JSX text content freely contains
  // apostrophes (e.g. "you're", "it's") that are not string delimiters.
  let inString = false;
  let stringChar = "";

  while (i < content.length) {
    const ch = content[i];
    const prev = i > 0 ? content[i - 1] : "";

    if (!inString && (ch === '"' || ch === "`")) {
      inString = true;
      stringChar = ch;
    } else if (inString && ch === stringChar && prev !== "\\") {
      inString = false;
    } else if (!inString) {
      if (ch === "(") depth++;
      else if (ch === ")") {
        depth--;
        if (depth === 0) return { start, end: i + 1 };
      }
    }
    i++;
  }
  return null;
}

/** Find the faqs array boundaries */
function findFaqsBounds(content) {
  // Match both `const faqs = [` and `  const faqs = [`
  const idx = content.search(/const faqs\s*=\s*\[/);
  if (idx === -1) return null;

  let depth = 0;
  let i = idx;
  // advance to the [
  while (i < content.length && content[i] !== "[") i++;

  let inString = false;
  let stringChar = "";

  while (i < content.length) {
    const ch = content[i];
    const prev = i > 0 ? content[i - 1] : "";

    if (!inString && (ch === '"' || ch === "'" || ch === "`")) {
      inString = true;
      stringChar = ch;
    } else if (inString && ch === stringChar && prev !== "\\") {
      inString = false;
    } else if (!inString) {
      if (ch === "[") depth++;
      else if (ch === "]") {
        depth--;
        if (depth === 0) {
          // include the trailing semicolon if present
          let end = i + 1;
          while (end < content.length && content[end] === ";") end++;
          return { start: idx, end };
        }
      }
    }
    i++;
  }
  return null;
}

// ─── PROMPT ──────────────────────────────────────────────────────────────────
function buildPrompt(title, category) {
  return `You are a financial content expert creating SEO-optimized editorial content for a calculator page.

Calculator: "${title}"
Category: ${category}

Generate editorial content in JSON format. Return ONLY valid JSON, no markdown, no explanation.

{
  "faqs": [
    {"question": "...", "answer": "..."},
    ... (exactly 9 FAQs, specific to this calculator, with real numbers and benchmarks)
  ],
  "tables": [
    {
      "id": "table-1",
      "heading": "Table heading",
      "intro": "One sentence explaining the table.",
      "headers": ["Column 1", "Column 2", "Column 3"],
      "rows": [
        ["value", "value", "value"],
        ...
      ],
      "note": "Optional footnote (or empty string)"
    },
    ... (2 to 3 tables with REAL, ACCURATE data relevant to this calculator)
  ],
  "guide": {
    "heading": "How to Use the ${title}",
    "paragraphs": [
      "Paragraph 1 (2-3 sentences explaining what this calculator does and why it matters).",
      "Paragraph 2 (2-3 sentences on the key inputs and what they mean).",
      "Paragraph 3 (2-3 sentences on how to interpret the results)."
    ]
  },
  "tips": [
    "Tip 1 — specific actionable advice for this calculator topic.",
    "Tip 2 — ...",
    "Tip 3 — ...",
    "Tip 4 — ..."
  ],
  "mistakes": [
    {"title": "Mistake name", "body": "1-2 sentence explanation."},
    {"title": "Mistake name", "body": "..."},
    {"title": "Mistake name", "body": "..."},
    {"title": "Mistake name", "body": "..."}
  ],
  "references": [
    {
      "title": "Reference name",
      "url": "https://real-authoritative-url.gov-or-org",
      "description": "One sentence description."
    },
    ... (exactly 4 references, REAL URLs from IRS, SEC, Investopedia, Bankrate, NerdWallet, Consumer Financial Protection Bureau, etc.)
  ],
  "lastUpdated": "April 2026"
}

Rules:
- All FAQs must be SPECIFIC to "${title}" — no generic finance questions
- Every table must have REAL data (actual rates, actual benchmarks, actual limits for 2024-2025)
- Every reference URL must be a REAL URL that exists on an authoritative site
- Tips and mistakes must be specific to this calculator, not generic financial advice
- Answers should be 2-4 sentences with specific numbers where applicable
- CRITICAL: In all text values, never use raw < or > as comparison operators. Use &lt; and &gt; instead. Example: "held &lt;1 year", "Beta &gt; 1.0", "&lt;$50M daily volume"`;
}

// ─── JSX GENERATION ──────────────────────────────────────────────────────────
function buildFaqsJsx(faqs) {
  const items = faqs
    .map(
      (f) =>
        `    {\n      question: ${JSON.stringify(f.question)},\n      answer: ${JSON.stringify(f.answer)},\n    }`
    )
    .join(",\n");
  return `const faqs = [\n${items}\n  ];`;
}

function buildEditorialJsx(data, title) {
  const { guide, tables, tips, mistakes, faqs, references, lastUpdated } = data;

  // Tables JSX
  const tablesJsx = tables
    .map((t) => {
      const headerCells = t.headers
        .map((h) => `                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">${h}</th>`)
        .join("\n");

      const rows = t.rows
        .map((row, ri) => {
          const cells = row
            .map((cell, ci) =>
              ci === 0
                ? `                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">${cell}</td>`
                : `                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">${cell}</td>`
            )
            .join("\n");
          const bg =
            ri % 2 === 0
              ? "bg-white dark:bg-slate-900"
              : "bg-slate-50 dark:bg-slate-800/50";
          return `                <tr className="${bg}">\n${cells}\n                </tr>`;
        })
        .join("\n");

      const noteJsx = t.note
        ? `\n        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">${t.note}</p>`
        : "";

      return `
      {/* TABLE: ${t.heading} */}
      <section id="${t.id}" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">${t.heading}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">${t.intro}</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
${headerCells}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
${rows}
            </tbody>
          </table>
        </div>${noteJsx}
      </section>`;
    })
    .join("\n");

  // Tips JSX
  const tipsJsx = tips
    .map((tip) => `          <li className="text-sm text-slate-700 dark:text-slate-300">${tip}</li>`)
    .join("\n");

  // Mistakes JSX
  const mistakesJsx = mistakes
    .map(
      (m) =>
        `          <div>\n            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">${m.title}</p>\n            <p className="text-sm text-slate-600 dark:text-slate-400">${m.body}</p>\n          </div>`
    )
    .join("\n");

  // References JSX
  const refsJsx = references
    .map(
      (r) =>
        `          <li>\n            <a href="${r.url}" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">${r.title}</a>\n            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">${r.description}</p>\n          </li>`
    )
    .join("\n");

  // Paragraphs JSX
  const parasJsx = guide.paragraphs
    .map((p) => `          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">${p}</p>`)
    .join("\n");

  // FAQ JSX
  const faqItemsJsx = faqs
    .map(
      (f) =>
        `          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">\n            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">${f.question}</h3>\n            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">${f.answer}</p>\n          </div>`
    )
    .join("\n");

  return `const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">${guide.heading}</h2>
        <div className="space-y-3">
${parasJsx}
        </div>
      </section>
${tablesJsx}

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
${tipsJsx}
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
${mistakesJsx}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
${faqItemsJsx}
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: ${lastUpdated}</p>
        <ul className="space-y-4">
${refsJsx}
        </ul>
      </section>

    </div>
  )`;
}

// ─── PROCESS ONE FILE ─────────────────────────────────────────────────────────
async function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const title = extractTitle(content);
  const faqCount = countFaqs(content);
  const hasTables = hasEditorialTables(content);

  if (!title) {
    console.log(`  ⚠️  No title found — skipping`);
    return "skipped";
  }

  if (faqCount >= MIN_FAQS_THRESHOLD && hasTables) {
    console.log(`  ✓  Already good (${faqCount} FAQs + tables) — skipping`);
    return "skipped";
  }

  console.log(`  📝 Generating content (${faqCount} FAQs, tables: ${hasTables})...`);

  if (isDryRun) {
    console.log(`  🔍 DRY RUN — would call API for: "${title}"`);
    return "dry-run";
  }

  // Call Claude API
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: "user",
        content: buildPrompt(title, path.basename(path.dirname(filePath))),
      },
    ],
  });

  const raw = response.content[0].text.trim();

  // Parse JSON — strip any accidental markdown fences
  let data;
  try {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    data = JSON.parse(cleaned);
  } catch (err) {
    console.error(`  ❌ JSON parse error: ${err.message}`);
    console.error(`  Raw response (first 300 chars): ${raw.slice(0, 300)}`);
    return "error";
  }

  // Validate minimum structure
  if (!data.faqs || !data.tables || !data.guide) {
    console.error(`  ❌ Missing required fields in API response`);
    return "error";
  }

  // Build new JSX sections
  const newFaqsJsx = buildFaqsJsx(data.faqs);
  const newEditorialJsx = buildEditorialJsx(data, title);

  // Replace faqs section
  let updated = content;
  const faqsBounds = findFaqsBounds(updated);
  if (faqsBounds) {
    updated =
      updated.slice(0, faqsBounds.start) +
      newFaqsJsx +
      updated.slice(faqsBounds.end);
  }

  // Replace editorial section
  const editorialBounds = findEditorialBounds(updated);
  if (editorialBounds) {
    updated =
      updated.slice(0, editorialBounds.start) +
      newEditorialJsx +
      updated.slice(editorialBounds.end);
  } else {
    console.error(`  ❌ Could not find editorial section`);
    return "error";
  }

  // Write file
  fs.writeFileSync(filePath, updated, "utf8");
  console.log(`  ✅ Updated (${data.faqs.length} FAQs, ${data.tables.length} tables)`);
  return "updated";
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  // Collect files to process
  let files = [];

  if (fileArg) {
    files = [path.resolve(ROOT, fileArg)];
  } else if (categoryArg) {
    const dir = path.join(ROOT, "src", "components", "calculators", categoryArg);
    if (!fs.existsSync(dir)) {
      console.error(`Directory not found: ${dir}`);
      process.exit(1);
    }
    files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => path.join(dir, f));
  } else {
    console.error("Usage: node scripts/improve-editorial.mjs --category=Financial [--dry-run]");
    console.error("       node scripts/improve-editorial.mjs --file=src/components/calculators/Financial/AprCalculator.tsx");
    process.exit(1);
  }

  const progress = loadProgress();
  const results = { updated: 0, skipped: 0, errors: 0 };

  console.log(`\n🚀 Processing ${files.length} files${isDryRun ? " (DRY RUN)" : ""}...\n`);

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const name = path.basename(filePath);

    if (progress.done.includes(filePath)) {
      console.log(`[${i + 1}/${files.length}] ⏭️  ${name} — already done`);
      results.skipped++;
      continue;
    }

    console.log(`[${i + 1}/${files.length}] ${name}`);

    try {
      const result = await processFile(filePath);
      if (result === "updated") {
        results.updated++;
        progress.done.push(filePath);
        saveProgress(progress);
      } else if (result === "skipped" || result === "dry-run") {
        results.skipped++;
      } else {
        results.errors++;
      }
    } catch (err) {
      console.error(`  ❌ Unexpected error: ${err.message}`);
      results.errors++;
    }

    // Rate limiting — wait between calls
    if (i < files.length - 1 && !isDryRun) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n📊 Done — Updated: ${results.updated} | Skipped: ${results.skipped} | Errors: ${results.errors}`);

  if (results.updated > 0 && !isDryRun) {
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Review a few updated files to check quality`);
    console.log(`   2. Run: npm run build`);
    console.log(`   3. Commit and push to deploy`);
  }
}

main().catch(console.error);
