import fs from "node:fs";
import path from "node:path";

// Ajuste este import se necessário (ts-node/tsx para executar TS diretamente)
import { REGISTRY } from "../src/data/calculatorRegistry.ts";

const ORIGIN = "https://www.smartkitnow.com";

const STATIC_URLS = [
  "/", "/about", "/contact", "/privacy", "/terms",
  "/pets", "/health", "/financial", "/cooking", "/math",
  "/conversion", "/science", "/time", "/tv", "/smart-tips", "/recipes",
];

function today(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function toUrl(loc: string, priority = "0.5") {
  return `  <url>\n    <loc>${ORIGIN}${loc}</loc>\n    <lastmod>${today()}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
}

function priorityForCategory(cat: string): string {
  if (cat === "pets") return "0.85";
  if (cat === "health" || cat === "financial" || cat === "cooking" || cat === "math") return "0.6";
  return "0.5";
}

function main() {
  const parts: string[] = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  parts.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

  // estáticos
  for (const p of STATIC_URLS) parts.push(toUrl(p, p === "/" ? "1.0" : "0.4"));

  // calculadoras do registry
  for (const e of REGISTRY) {
    const pathSegs = `/${e.category}/${e.subcategory}/${e.slug}`.replace(/\/undefined/g, "");
    parts.push(toUrl(pathSegs, priorityForCategory(e.category)));
  }

  parts.push(`</urlset>`);
  const xml = parts.join("\n");

  const outDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");

  console.log("✅ sitemap.xml gerado em /public/sitemap.xml");
}

main();