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

const formatDate = (d = new Date()) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const priorityByCategory = {
  pets: 0.85,
  health: 0.6,
  financial: 0.6,
  construction: 0.5,
  math: 0.5,
};

// URLs estáticas (núcleo e hubs principais)
const STATIC_ENTRIES = [
  { loc: `${HOST}/`, lastmod: formatDate(), priority: 1.0 },
  { loc: `${HOST}/about`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/contact`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/privacy`, lastmod: formatDate(), priority: 0.2 },
  { loc: `${HOST}/terms`, lastmod: formatDate(), priority: 0.2 },
  { loc: `${HOST}/cookies`, lastmod: formatDate(), priority: 0.2 },
  { loc: `${HOST}/cookie-settings`, lastmod: formatDate(), priority: 0.2 },
  // Categorias raiz (existentes no sitemap atual)
  { loc: `${HOST}/construction`, lastmod: formatDate(), priority: 0.6 },
  { loc: `${HOST}/financial`, lastmod: formatDate(), priority: 0.6 },
  { loc: `${HOST}/health`, lastmod: formatDate(), priority: 0.6 },
  { loc: `${HOST}/cooking`, lastmod: formatDate(), priority: 0.6 },
  { loc: `${HOST}/conversion`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/electrical`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/science`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/time`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/tv`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/pets`, lastmod: formatDate(), priority: 0.9 },
  { loc: `${HOST}/automotive`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/math`, lastmod: formatDate(), priority: 0.6 },
  // Hubs adicionais
  { loc: `${HOST}/smart-tips`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/recipes`, lastmod: formatDate(), priority: 0.4 },
  // Subcategorias exemplares
  { loc: `${HOST}/construction/wall-ceiling-calculators`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/financial/mortgage-and-home-loan-calculators`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/health/fitness-calculators`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/cooking/cooking-baking-calculators`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/conversion/common`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/conversion/popular`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/conversion/cooking-baking`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/math/everyday-math`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/math/everyday-math/percentages`, lastmod: formatDate(), priority: 0.5 },
  { loc: `${HOST}/math/fractions`, lastmod: formatDate(), priority: 0.5 },
];

// Coleta calculadoras do registry
const dynamicEntries = [];
let m;
while ((m = re.exec(buf)) !== null) {
  const [_, slug, category, subcategory, title] = m;
  if (/Coming\s+Soon/i.test(title)) continue;
  const pathSegs = `/${category}/${subcategory}/${slug}`.replace(/\/undefined/g, "");
  const loc = `${HOST}${pathSegs}`;
  const priority = priorityByCategory[category] ?? 0.5;
  dynamicEntries.push({ loc, lastmod: formatDate(), priority });
}

// Mescla estáticos e dinâmicos, removendo duplicados
const byLoc = new Map();
for (const e of [...STATIC_ENTRIES, ...dynamicEntries]) {
  byLoc.set(e.loc, e);
}

const entries = Array.from(byLoc.values()).sort((a, b) => a.loc.localeCompare(b.loc));

// Monta XML com lastmod/priority
const body = entries
  .map((e) => `<url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><priority>${e.priority}</priority></url>`)
  .join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

writeFileSync(path.resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml gerado com ${entries.length} URLs`);