import fs from "node:fs";
import path from "node:path";

import { REGISTRY, calcLink } from "../src/data/calculatorRegistry";
// Use gameSlugs.ts (pure TS, no React/JSX) which mirrors RAW_GAMES from gameRegistry.tsx.
// gameRegistry.tsx cannot be imported here because it contains React component imports.
import { GAME_SLUGS } from "../src/data/gameSlugs";
import { smartTipsCategories } from "../src/data/smartTipsData";

const ORIGIN = "https://www.smartkitnow.com";

const STATIC_URLS = [
  "/", 
  "/about", 
  "/contact", 
  "/privacy", 
  "/terms", 
  "/cookies", 
  "/cookie-settings",
  "/search",
  // Base Categories
  "/financial", "/health", "/cooking", "/conversion", "/math",
  "/science", "/time", "/pets", "/automotive", "/construction",
  "/electrical", "/everyday", "/sports", "/funny", "/video",
  // Features
  "/smart-tips",
  "/games",
  "/daily-quotes",
  "/daily-quotes/horoscopo"
];

function today(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function xmlEscape(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string));
}

function toUrl(loc: string, priority = "0.5") {
  const cleanLoc = loc.replace(/\/+$/, "");
  const full = `${ORIGIN}${cleanLoc}`;
  return `  <url>\n    <loc>${xmlEscape(full)}</loc>\n    <lastmod>${today()}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
}

function priorityForCategory(cat: string): string {
  if (cat === "pets" || cat === "games") return "0.85";
  if (["health", "financial", "cooking", "math", "smart-tips"].includes(cat)) return "0.6";
  return "0.5";
}

function main() {
  const parts: string[] = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  parts.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

  let count = 0;

  // Static
  for (const p of STATIC_URLS) {
    parts.push(toUrl(p, p === "/" ? "1.0" : "0.5"));
    count++;
  }

  // Calculators from registry
  for (const e of REGISTRY) {
    const shortPath = calcLink(e);
    parts.push(toUrl(shortPath, priorityForCategory(e.category)));
    count++;
  }

  // Games — sourced from gameSlugs.ts (mirrors gameRegistry.tsx RAW_GAMES, no JSX deps)
  for (const slug of GAME_SLUGS) {
    parts.push(toUrl(`/games/${slug}`, priorityForCategory("games")));
    count++;
  }

  // Smart Tips
  for (const cat of smartTipsCategories) {
    parts.push(toUrl(`/smart-tips/${cat.slug}`, priorityForCategory("smart-tips")));
    count++;
    for (const tip of cat.tips) {
      parts.push(toUrl(`/smart-tip/${tip.slug}`, "0.4"));
      count++;
    }
  }

  parts.push(`</urlset>`);
  const xml = parts.join("\n");

  const outDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");

  console.log(`✅ Sitemap generated: ${count} routes found.`);
  console.log(`Sitemap atualizado com ${count} URLs`);
}

main();
