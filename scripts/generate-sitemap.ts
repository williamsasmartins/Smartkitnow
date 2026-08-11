import fs from "node:fs";
import path from "node:path";

import { REGISTRY, calcLink } from "../src/data/calculatorRegistry";
// Use gameSlugs.ts (pure TS, no React/JSX) which mirrors RAW_GAMES from gameRegistry.tsx.
// gameRegistry.tsx cannot be imported here because it contains React component imports.
import { GAME_SLUGS } from "../src/data/gameSlugs";
import { smartTipsCategories } from "../src/data/smartTipsData";
import { blogPosts } from "../src/data/blogData";

const ORIGIN = "https://www.smartkitnow.com";

const STATIC_URLS = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  // /cookie-settings and /search excluded: utility pages with no indexable content
  // Base Categories
  "/financial", "/health", "/cooking", "/conversion", "/math",
  "/science", "/time", "/pets", "/automotive", "/construction",
  "/electrical", "/everyday", "/sports", "/video", "/marketing",
  // Features
  "/smart-tips",
  "/games",
  "/blog",
  "/daily-quotes",
  "/daily-quotes/horoscopo"
];

function xmlEscape(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c] as string));
}

// Route prefixes that no longer exist on the site — must never re-enter the sitemap.
// Language dirs return 410 via /api/404; /culinary and /recipes return 410 via /api/gone.
const DEPRECATED_PREFIXES = [
  "/culinary", "/recipes", "/funny",
  "/sv", "/it", "/es", "/pt", "/nl", "/pl", "/de", "/fr",
  "/en", "/zh", "/ja", "/ko", "/ru", "/ar", "/tr", "/tv",
];

function isDeprecated(loc: string): boolean {
  return DEPRECATED_PREFIXES.some((p) => loc === p || loc.startsWith(`${p}/`));
}

// No fake <lastmod>: stamping every URL with the build date on each deploy is a
// known trust-eroding signal for Google (it learns to ignore lastmod entirely).
// Omit it and let changefreq/priority carry the crawl hints.
function toUrl(loc: string, priority = "0.5", changefreq = "monthly") {
  const cleanLoc = loc.replace(/\/+$/, "");
  const full = `${ORIGIN}${cleanLoc}`;
  return `  <url>\n    <loc>${xmlEscape(full)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

/**
 * Sitemap priority tiers — based on user intent, traffic potential, and content depth.
 * Higher priority = Googlebot crawls sooner within its daily crawl budget.
 *
 * Tier 1 (0.82): Highest commercial/user-intent value
 * Tier 2 (0.75): Strong utility, high search volume categories
 * Tier 3 (0.68): Medium traffic categories with solid content
 * Tier 4 (0.60): Lower-priority utility or niche categories
 */
function priorityForCategory(cat: string): string {
  // Tier 1 — high commercial intent, proven traffic
  if (["financial", "health"].includes(cat)) return "0.82";
  // Tier 2 — strong utility, high search volume
  if (["automotive", "cooking", "math", "pets", "conversion"].includes(cat)) return "0.75";
  // Tier 3 — solid content, medium traffic
  if (["construction", "electrical", "science", "sports", "everyday"].includes(cat)) return "0.68";
  // Tier 4 — niche or lower-priority
  if (["video", "funny", "time", "marketing", "games", "smart-tips"].includes(cat)) return "0.60";
  return "0.60";
}

function main() {
  const parts: string[] = [];
  parts.push(`<?xml version="1.0" encoding="UTF-8"?>`);
  parts.push(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`);

  let count = 0;
  const seen = new Set<string>();
  const skipped: string[] = [];

  const pushUrl = (loc: string, priority: string, changefreq: string) => {
    const clean = loc.replace(/\/+$/, "") || "/";
    if (isDeprecated(clean)) {
      skipped.push(`deprecated: ${clean}`);
      return;
    }
    if (seen.has(clean)) {
      skipped.push(`duplicate: ${clean}`);
      return;
    }
    seen.add(clean);
    parts.push(toUrl(clean, priority, changefreq));
    count++;
  };

  // Static
  // Category priorities match their calculator priorities + 0.08 (hubs outrank leaf pages)
  const CATEGORY_PRIORITY: Record<string, string> = {
    "/financial": "0.90", "/health": "0.90",
    "/automotive": "0.83", "/cooking": "0.83", "/math": "0.83", "/pets": "0.83", "/conversion": "0.83",
    "/construction": "0.76", "/electrical": "0.76", "/science": "0.76", "/sports": "0.76", "/everyday": "0.76",
    "/video": "0.68", "/funny": "0.68", "/time": "0.68", "/marketing": "0.68",
    "/smart-tips": "0.68", "/games": "0.68",
  };
  for (const p of STATIC_URLS) {
    const isHome = p === "/";
    const catPriority = CATEGORY_PRIORITY[p];
    const priority = isHome ? "1.0" : catPriority ?? "0.55";
    const changefreq = isHome ? "daily" : catPriority ? "weekly" : "monthly";
    pushUrl(p, priority, changefreq);
  }

  // Calculators from registry
  for (const e of REGISTRY) {
    pushUrl(calcLink(e), priorityForCategory(e.category), "monthly");
  }

  // Games — sourced from gameSlugs.ts (mirrors gameRegistry.tsx RAW_GAMES, no JSX deps)
  for (const slug of GAME_SLUGS) {
    pushUrl(`/games/${slug}`, priorityForCategory("games"), "monthly");
  }

  // Smart Tips
  for (const cat of smartTipsCategories) {
    pushUrl(`/smart-tips/${cat.slug}`, priorityForCategory("smart-tips"), "weekly");
    for (const tip of cat.tips) {
      pushUrl(`/smart-tip/${tip.slug}`, "0.4", "monthly");
    }
  }

  // Blog
  for (const post of blogPosts) {
    pushUrl(`/blog/${post.slug}`, "0.6", "monthly");
  }

  parts.push(`</urlset>`);
  const xml = parts.join("\n");

  const outDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");

  console.log(`✅ Sitemap generated: ${count} unique routes.`);
  if (skipped.length > 0) {
    console.warn(`⚠️ Skipped ${skipped.length} URLs:`);
    for (const s of skipped) console.warn(`   ${s}`);
  }
}

main();
