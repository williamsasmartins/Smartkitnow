import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Site canonical origin (no trailing slash)
const ORIGIN = "https://www.smartkitnow.com";

// Import dynamic registry TS via simple text parse
const registryPath = path.join(ROOT, "src", "data", "calculatorRegistry.ts");

// Load file as text and extract the calculatorRegistry array
const src = fs.readFileSync(registryPath, "utf-8");
const match = src.match(/export\s+const\s+calculatorRegistry[:\s\S]*?=\s*\[([​\s\S]*?)\/\/\s*SKN-AUTO-REGISTER/);

// Fallback: try matching REGISTRY export alias
const matchFallback = src.match(/export\s+const\s+calculatorRegistry[^\[]*\[([​\s\S]*?)\];/);

let arrText;
if (match) {
  arrText = "[" + match[1] + "]";
} else if (matchFallback) {
  arrText = "[" + matchFallback[1] + "]";
} else {
  // Last resort: try REGISTRY const
  const matchRegistry = src.match(/export\s+const\s+REGISTRY[\s\S]*?=\s*\[([​\s\S]*?)\];/);
  if (!matchRegistry) {
    console.error("❌ Cannot locate calculatorRegistry or REGISTRY in src/data/calculatorRegistry.ts");
    process.exit(1);
  }
  arrText = "[" + matchRegistry[1] + "]";
}

// Transform to valid JSON (no eval)
arrText = arrText
  .replace(/loader:\s*\(\)\s*=>\s*import\([^)]+\)/g, "loader: null")
  .replace(/\/\/.*$/gm, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/(\w+):/g, '"$1":')
  .replace(/'([^']*)'/g, '"$1"')
  .replace(/,(\s*[\]}])/g, "$1");

let REGISTRY = [];
try {
  REGISTRY = JSON.parse(arrText);
} catch (e) {
  console.error("❌ Failed to parse registry:", e.message);
  // Attempt to use grep-based fallback
  console.log("⚠️  Attempting grep-based fallback…");
  // Extract slug + category pairs via regex
  const entryPattern = /\{\s*slug:\s*["']([^"']+)["'][\s\S]*?category:\s*["']([^"']+)["'][^}]*\}/g;
  let m;
  while ((m = entryPattern.exec(src)) !== null) {
    REGISTRY.push({ slug: m[1], category: m[2] });
  }
  if (REGISTRY.length === 0) {
    console.error("❌ Fallback also failed. Exiting.");
    process.exit(1);
  }
  console.log(`✅ Fallback extracted ${REGISTRY.length} entries`);
}

// =============================================================
// STATIC URLs — must match actual live routes in App.tsx
// =============================================================
const STATIC_URLS = [
  // Core pages
  { path: "/",              priority: "1.00" },
  { path: "/about",         priority: "0.40" },
  { path: "/contact",       priority: "0.40" },
  { path: "/privacy",       priority: "0.30" },
  { path: "/terms",         priority: "0.30" },
  { path: "/cookies",       priority: "0.20" },
  { path: "/cookie-settings", priority: "0.20" },
  { path: "/search",        priority: "0.60" },

  // Category hub pages — high signal for crawlers
  { path: "/everyday",      priority: "0.80" },
  { path: "/financial",     priority: "0.85" },
  { path: "/health",        priority: "0.80" },
  { path: "/cooking",       priority: "0.75" },
  { path: "/pets",          priority: "0.80" },
  { path: "/math",          priority: "0.70" },
  { path: "/conversion",    priority: "0.70" },
  { path: "/science",       priority: "0.70" },
  { path: "/time",          priority: "0.70" },
  { path: "/sports",        priority: "0.70" },
  { path: "/funny",         priority: "0.65" },
  { path: "/automotive",    priority: "0.70" },
  { path: "/construction",  priority: "0.70" },
  { path: "/electrical",    priority: "0.70" },
  { path: "/daily-quotes",  priority: "0.60" },
  { path: "/games",         priority: "0.55" },
];

const TODAY = new Date().toISOString().slice(0, 10);
const fmtPriority = (n) => Number(n).toFixed(2);

function priorityForCategory(cat) {
  if (cat === "financial") return fmtPriority(0.75);
  if (cat === "health")    return fmtPriority(0.70);
  if (cat === "pets")      return fmtPriority(0.75);
  if (["cooking", "math", "conversion", "science", "sports", "everyday", "automotive", "construction", "electrical"].includes(cat))
    return fmtPriority(0.65);
  return fmtPriority(0.55);
}

function urlTag(loc, priority = "0.50", lastmod = TODAY) {
  return [
    "  <url>",
    `    <loc>${ORIGIN}${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <priority>${priority}</priority>`,
    "  </url>"
  ].join("\n");
}

// Heuristic to skip "Coming Soon"
const isComingSoon = (entry) =>
  /coming soon/i.test(entry.title || "") ||
  /placeholder/i.test(entry.description || "");

// Canonical path — consistent with calcLink() in calculatorRegistry.ts
// All entries use urlStyle: "flat" → /{category}/{slug}
function canonicalPath(e) {
  const cat = (e.category || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  const slug = (e.slug || "").trim().toLowerCase();
  return `/${cat}/${slug}`;
}

// Build XML
const parts = [];
parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
parts.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

// Static pages
for (const s of STATIC_URLS) {
  parts.push(urlTag(s.path, s.priority));
}

// Registry entries (excluding coming soon)
const seenPaths = new Set();
for (const e of REGISTRY) {
  if (!e || !e.slug || !e.category) continue;
  if (isComingSoon(e)) continue;
  const loc = canonicalPath(e);
  // Deduplicate — some entries share the same component but have different slugs (aliases)
  if (seenPaths.has(loc)) continue;
  seenPaths.add(loc);
  const prio = priorityForCategory(e.category);
  parts.push(urlTag(loc, prio));
}

parts.push(`</urlset>`);
const xml = parts.join("\n");

// Write to public/sitemap.xml
const outDir = path.join(ROOT, "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");
console.log(`✅ sitemap.xml generated → public/sitemap.xml  (${REGISTRY.length} registry entries, ${STATIC_URLS.length} static URLs)`);
