import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

// Origem canônica do site (sem crases)
const ORIGIN = "https://www.smartkitnow.com";

// Import dinâmico do registry TS via parse simples
const registryPath = path.join(ROOT, "src", "data", "calculatorRegistry.ts");

// Carrega arquivo como texto e extrai o array REGISTRY
const src = fs.readFileSync(registryPath, "utf-8");
const match = src.match(/export\s+const\s+REGISTRY[\s\S]*?=\s*\[([\s\S]*?)\];/);
if (!match) {
  console.error("❌ Não foi possível localizar REGISTRY em src/data/calculatorRegistry.ts");
  process.exit(1);
}

// Transforma em JSON válido (sem eval)
let arrText = "[" + match[1] + "]";
arrText = arrText
  .replace(/loader:\s*\(\)\s*=>\s*import\(([^)]+)\)/g, "loader: null")
  .replace(/\/\/.*$/gm, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/(\w+):/g, '"$1":')
  .replace(/'([^']*)'/g, '"$1"')
  .replace(/,(\s*[\]}])/g, "$1");

let REGISTRY = [];
try {
  REGISTRY = JSON.parse(arrText);
} catch (e) {
  console.error("❌ Falha ao parsear REGISTRY:", e.message);
  process.exit(1);
}

// URLs estáticas
const STATIC_URLS = [
  "/", "/about", "/contact", "/privacy", "/terms",
  "/pets", "/health", "/financial", "/cooking", "/math",
  "/conversion", "/science", "/time", "/tv", "/smart-tips", "/recipes",
];

const TODAY = new Date().toISOString().slice(0, 10);
const fmtPriority = (n) => Number(n).toFixed(2);

function priorityForCategory(cat) {
  if (cat === "pets") return fmtPriority(0.85);
  if (["health", "financial", "cooking", "math"].includes(cat)) return fmtPriority(0.60);
  return fmtPriority(0.50);
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

// Heurística para pular “Coming Soon”
const isComingSoon = (entry) => /coming soon/i.test(entry.title || "") || /placeholder/i.test(entry.description || "");

// Rota canônica consistente com o site: /:category/:subcategory/:slug (removendo undefined)
function canonicalPath(e) {
  return `/${e.category}/${e.slug}`;
}

// Monta XML
const parts = [];
parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
parts.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

// Estáticos
for (const p of STATIC_URLS) {
  parts.push(urlTag(p, p === "/" ? fmtPriority(1.00) : fmtPriority(0.40)));
}

// Registry (filtrando coming soon)
for (const e of REGISTRY) {
  if (!e || !e.slug || !e.category) continue;
  if (isComingSoon(e)) continue;
  const loc = canonicalPath(e);
  const prio = e.category === "pets" ? fmtPriority(0.85) : priorityForCategory(e.category);
  parts.push(urlTag(loc, prio));
}

parts.push(`</urlset>`);
const xml = parts.join("\n");

// Grava em public/sitemap.xml
const outDir = path.join(ROOT, "public");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");
console.log("✅ sitemap.xml gerado via JS em /public/sitemap.xml");