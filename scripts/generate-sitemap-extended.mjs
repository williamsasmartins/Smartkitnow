import { readFileSync, writeFileSync } from "fs";
import path from "path";

// Host canonical
const HOST = "https://www.smartkitnow.com";
// Fonte: arquivo TS com o registro das calculadoras
const SRC = path.resolve("src/data/calculatorRegistry.ts");
const CUISINES_SRC = path.resolve("src/data/recipes/cuisines.ts");

const buf = readFileSync(SRC, "utf8");
const cuisinesBuf = readFileSync(CUISINES_SRC, "utf8");
// Extrai blocos de arrays de RegistryEntry e objetos individuais dentro deles
const blocksRe = /const\s+\w+\s*:\s*RegistryEntry\[\]\s*=\s*\[\s*([\s\S]*?)\s*\];/g;
const objRe = /\{[\s\S]*?\}/g;

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
  { loc: `${HOST}/video`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/pets`, lastmod: formatDate(), priority: 0.9 },
  { loc: `${HOST}/automotive`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/math`, lastmod: formatDate(), priority: 0.6 },
  // Hubs adicionais
  { loc: `${HOST}/smart-tips`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/recipes`, lastmod: formatDate(), priority: 0.4 },
  { loc: `${HOST}/recipes/mexican`, lastmod: formatDate(), priority: 0.45 },
];

// Coleta calculadoras do registry
const dynamicEntries = [];
let bm;
while ((bm = blocksRe.exec(buf)) !== null) {
  const block = bm[1];
  let om;
  while ((om = objRe.exec(block)) !== null) {
    const obj = om[0];
    const slug = (obj.match(/slug:\s*"([^"]+)"/) || [])[1];
    const category = (obj.match(/category:\s*"([^"]+)"/) || [])[1];
    const subcategory = (obj.match(/subcategory:\s*"([^"]+)"/) || [])[1];
    const title = (obj.match(/title:\s*"([^"]+)"/) || [])[1];

    if (!slug || !category) continue;
    if (/Coming\s+Soon/i.test(title || "")) continue;

    const seg = category; // canonical short segment
    const pathSegs = subcategory && subcategory.trim().length > 0
      ? `/${seg}/${subcategory}/${slug}`
      : `/${seg}/${slug}`;
    const loc = `${HOST}${pathSegs}`;
    const priority = priorityByCategory[category] ?? 0.5;
    dynamicEntries.push({ loc, lastmod: formatDate(), priority });
  }
}

// Mescla estáticos e dinâmicos, removendo duplicados
const byLoc = new Map();
for (const e of [...STATIC_ENTRIES, ...dynamicEntries]) {
  byLoc.set(e.loc, e);
}

const entries = Array.from(byLoc.values()).sort((a, b) => a.loc.localeCompare(b.loc));

const mexicanMatch = cuisinesBuf.match(/key:\s*"mexican"[\s\S]*?recipes:\s*R\(\[([\s\S]*?)\]\)/);
if (mexicanMatch) {
  const titles = mexicanMatch[1]
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/,$/, ""))
    .filter((l) => l.startsWith('"') && l.endsWith('"'))
    .map((l) => l.slice(1, -1));

  const slugify = (title) =>
    title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

  for (const title of titles) {
    const loc = `${HOST}/recipes/mexican/${slugify(title)}`;
    byLoc.set(loc, { loc, lastmod: formatDate(), priority: 0.35 });
  }
}

// Monta XML com lastmod/priority
const body = entries
  .map((e) => `<url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod><priority>${e.priority}</priority></url>`)
  .join("\n");
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;

writeFileSync(path.resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml gerado com ${entries.length} URLs`);
