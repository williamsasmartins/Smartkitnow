// scripts/build-sitemap.ts
// Executa: npx ts-node --esm scripts/build-sitemap.ts
import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { REGISTRY } from "../src/data/calculatorRegistry";

const SITE = "https://www.smartkitnow.com"; // ajuste se necessário

type UrlItem = {
  loc: string;        // URL absoluta
  priority?: number;  // 0.0 - 1.0
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
};

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function toUrl(u: string): string {
  return u.startsWith("http") ? u : `${SITE}${u}`;
}

function xmlEscape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

(function main() {
  const urls: UrlItem[] = [];

  // Home
  urls.push({ loc: toUrl("/"), priority: 1.0, changefreq: "weekly" });

  // Categorias (a partir do registry)
  const categories = uniq(REGISTRY.map((r) => r.category));
  for (const cat of categories) {
    urls.push({
      loc: toUrl(`/${cat}`),
      priority: 0.9,
      changefreq: "weekly",
    });
  }

  // Subcategorias por categoria
  type Group = { [sub: string]: true };
  const subsByCat = new Map<string, Group>();
  for (const e of REGISTRY) {
    if (!e.subcategory) continue;
    const g = subsByCat.get(e.category) ?? {};
    g[e.subcategory] = true;
    subsByCat.set(e.category, g);
  }
  for (const [cat, g] of subsByCat) {
    for (const sub of Object.keys(g)) {
      urls.push({
        loc: toUrl(`/${cat}/${sub}`),
        priority: 0.8,
        changefreq: "weekly",
      });
    }
  }

  // Cada calculadora + aliases
  for (const e of REGISTRY) {
    const sub = e.subcategory ?? "";
    urls.push({
      loc: toUrl(`/${e.category}/${sub}/${e.slug}`.replace(/\/+/g, "/").replace(/\/$/, "")),
      priority: 0.7,
      changefreq: "monthly",
    });
    if (e.aliases?.length) {
      for (const a of e.aliases) {
        urls.push({
          loc: toUrl(`/${e.category}/${sub}/${a}`.replace(/\/+/g, "/").replace(/\/$/, "")),
          priority: 0.5,
          changefreq: "monthly",
        });
      }
    }
  }

  // Remove duplicadas
  const uniqueByLoc = new Map<string, UrlItem>();
  for (const u of urls) uniqueByLoc.set(u.loc, u);
  const finalUrls = Array.from(uniqueByLoc.values());

  // Monta XML
  const body = finalUrls
    .map(
      (u) => `
  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    ${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ""}
    ${u.priority != null ? `<priority>${u.priority.toFixed(1)}</priority>` : ""}
  </url>`.trim()
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${body}
</urlset>
`;

  // Escreve em public/sitemap.xml
  const outDir = path.resolve(process.cwd(), "public");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "sitemap.xml");
  writeFileSync(outPath, xml, "utf8");
  console.log(`✅ sitemap.xml gerado em: ${outPath} (${finalUrls.length} URLs)`);
})();
