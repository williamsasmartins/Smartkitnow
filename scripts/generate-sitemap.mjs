import { readFileSync, writeFileSync } from "fs";
import path from "path";

// Host canonical
const HOST = "https://www.smartkitnow.com";
// Fonte: arquivo TS com o registro das calculadoras
const SRC = path.resolve("src/data/calculatorRegistry.ts");

const buf = readFileSync(SRC, "utf8");

// Extrai blocos com slug, category, subcategory e title
// Observação: usamos regex não-gulosa para cobrir variações na ordem dos campos.
const re = /\{[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"[\s\S]*?subcategory:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?\}/g;

const urls = new Set();
let m;
while ((m = re.exec(buf)) !== null) {
  const [_, slug, category, subcategory, title] = m;
  // Pula placeholders
  if (/Coming\s+Soon/i.test(title)) continue;
  const pathSegs = `/${category}/${slug}`;
  urls.add(`${HOST}${pathSegs}`);
}

// Monta XML básico
const body = Array.from(urls)
  .sort()
  .map((u) => `<url><loc>${u}</loc></url>`) 
  .join("");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

// Grava em public/sitemap.xml
writeFileSync(path.resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml gerado com ${urls.size} URLs`);