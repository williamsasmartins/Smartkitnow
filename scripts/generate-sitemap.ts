import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { REGISTRY, calcLink } from "../src/data/calculatorRegistry";
// Use gameSlugs.ts (pure TS, no React/JSX) which mirrors RAW_GAMES from gameRegistry.tsx.
// gameRegistry.tsx cannot be imported here because it contains React component imports.
import { GAME_SLUGS } from "../src/data/gameSlugs";
import { smartTipsCategories } from "../src/data/smartTipsData";
import { blogPosts } from "../src/data/blogData";

const ORIGIN = "https://www.smartkitnow.com";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");

const STATIC_URLS = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
  "/editorial-policy",
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

/* -------------------------------------------------------------------------- */
/* Thin-content exclusions (AdSense "Low value content" remediation)          */
/* -------------------------------------------------------------------------- */

/**
 * THIN_PREFIXES — route families withheld from the sitemap because their
 * individual pages do not carry enough unique body copy to justify indexing.
 * They remain fully reachable and crawlable on the site; we simply stop
 * *advertising* them, so the index reflects our substantive pages only.
 *
 * Why each family is here:
 *
 *  - "/smart-tip"  (SINGULAR — the per-tip detail pages, `/smart-tip/:slug`)
 *      ~120 pages sourced from src/data/smartTipsData.ts, median ~80 words of
 *      body copy each. Far below the threshold at which a page stands on its
 *      own in search.
 *
 *  - "/games/"     (the individual game players, `/games/:slug`)
 *      ~73 pages with ~40 unique words each. Their "controls" / "strategy" /
 *      "tip" prose comes from CATEGORY_COPY in src/data/gameContent.ts and is
 *      therefore duplicated verbatim across 4-10 sibling games.
 *
 * IMPORTANT — the hubs deliberately STAY in the sitemap:
 *      /smart-tips              (plural: the Smart Tips hub)
 *      /smart-tips/:subcategory (plural: the 13 subcategory hubs)
 *      /games                   (the games hub)
 * These aggregate real content and are the correct entry points for crawlers.
 * Note that "/smart-tip" (singular) and "/smart-tips" (plural) are DIFFERENT
 * route families in src/App.tsx — matching is exact-or-slash-delimited below
 * precisely so the plural hubs are never caught by the singular prefix.
 *
 * TO RE-ENABLE: once a family's pages carry substantial unique copy (target:
 * 300+ words of non-templated content per page), delete its entry from this
 * list. No other change is required — the URLs are still generated below and
 * are only filtered at push time.
 */
const THIN_PREFIXES = [
  "/smart-tip", // singular detail pages only; "/smart-tips" (plural) is unaffected
  "/games",     // "/games/:slug" players; the bare "/games" hub is exempted below
];

/** Hub URLs that must survive the THIN_PREFIXES filter even though they sit at
 *  the root of a thin family. Only the *children* of these are excluded.
 *  (The Smart Tips hubs need no entry here: they live under the *plural*
 *  "/smart-tips" path, which "/smart-tip" never matches.) */
const THIN_PREFIX_HUB_EXEMPTIONS = new Set(["/games"]);

function isThin(loc: string): boolean {
  if (THIN_PREFIX_HUB_EXEMPTIONS.has(loc)) return false;
  return THIN_PREFIXES.some((p) => loc === p || loc.startsWith(`${p}/`));
}

/* -------------------------------------------------------------------------- */
/* vercel.json redirect exclusions                                            */
/* -------------------------------------------------------------------------- */

/**
 * A sitemap that lists URLs the edge answers with a 301 reads as a broken site
 * to Search Console and to an AdSense reviewer. vercel.json owns the redirect
 * table, so we parse it at build time rather than duplicating a hand-written
 * list here — the two files can then never drift apart.
 *
 * Supported source syntax (this is everything that actually appears in
 * vercel.json; anything else is deliberately IGNORED so we err toward keeping
 * a URL rather than wrongly dropping a good one):
 *   - plain literal paths, with or without a trailing slash
 *   - ":param"  — exactly one path segment
 *   - ":param*" — zero or more segments  (so "/tv/:path*" also matches "/tv")
 *   - ":param+" — one or more segments
 *   - ":param?" — zero or one segment
 */
interface VercelRedirect {
  source: string;
  destination: string;
  permanent?: boolean;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePath(p: string): string {
  return p.replace(/\/+$/, "") || "/";
}

/** Compile a vercel `source` pattern into an anchored RegExp, or null if the
 *  pattern uses syntax we do not confidently understand. */
function compileRedirectSource(source: string): RegExp | null {
  const pathOnly = source.split("?")[0];
  if (!pathOnly.startsWith("/")) return null;

  const normalized = normalizePath(pathOnly);
  // Never let a bare "/" rule take the homepage out of the sitemap.
  if (normalized === "/") return null;

  let pattern = "";
  for (const segment of normalized.slice(1).split("/")) {
    const param = /^:([A-Za-z0-9_]+)([*+?])?$/.exec(segment);
    if (param) {
      const modifier = param[2];
      if (modifier === "*") pattern += "(?:/[^/]+)*";
      else if (modifier === "+") pattern += "(?:/[^/]+)+";
      else if (modifier === "?") pattern += "(?:/[^/]+)?";
      else pattern += "/[^/]+";
      continue;
    }
    // Plain literal segment. Anything with regex/glob metacharacters is
    // unsupported — bail out and keep the URL.
    if (/^[A-Za-z0-9._~-]+$/.test(segment)) {
      pattern += `/${escapeRegExp(segment)}`;
      continue;
    }
    return null;
  }

  return new RegExp(`^${pattern}$`);
}

function loadRedirectMatchers(): { matchers: RegExp[]; unsupported: string[] } {
  const vercelPath = path.join(REPO_ROOT, "vercel.json");
  if (!fs.existsSync(vercelPath)) {
    console.warn("⚠️ vercel.json not found — redirect exclusions disabled.");
    return { matchers: [], unsupported: [] };
  }

  let redirects: VercelRedirect[] = [];
  try {
    const parsed = JSON.parse(fs.readFileSync(vercelPath, "utf-8")) as { redirects?: VercelRedirect[] };
    redirects = Array.isArray(parsed.redirects) ? parsed.redirects : [];
  } catch (e) {
    // Never fail the build on a malformed vercel.json — just skip the filter.
    console.warn(`⚠️ Could not parse vercel.json (${(e as Error).message}) — redirect exclusions disabled.`);
    return { matchers: [], unsupported: [] };
  }

  const matchers: RegExp[] = [];
  const unsupported: string[] = [];

  for (const r of redirects) {
    if (!r || typeof r.source !== "string") continue;

    // Trailing-slash canonicalization ("/cooking/" -> "/cooking") redirects a
    // URL onto the very path we want indexed. Skip these, or we would delete
    // the canonical destination from the sitemap.
    if (typeof r.destination === "string" && normalizePath(r.source.split("?")[0]) === normalizePath(r.destination.split("?")[0])) {
      continue;
    }

    const re = compileRedirectSource(r.source);
    if (re) matchers.push(re);
    else unsupported.push(r.source);
  }

  return { matchers, unsupported };
}

const { matchers: REDIRECT_MATCHERS, unsupported: UNSUPPORTED_REDIRECT_SOURCES } = loadRedirectMatchers();

function isRedirected(loc: string): boolean {
  return REDIRECT_MATCHERS.some((re) => re.test(loc));
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

  // Every route that should be PRERENDERED, which is a strict superset of the
  // sitemap. Thin routes (/games/*, /smart-tip/*) are withheld from the sitemap
  // and carry an X-Robots-Tag: noindex header from vercel.json, but they are
  // still real pages users visit, so they must ship real HTML rather than an
  // empty SPA shell. Deprecated and 301-redirected routes are correctly absent
  // from both lists — nothing should render a page the server redirects away.
  const renderable = new Set<string>();

  const pushUrl = (loc: string, priority: string, changefreq: string) => {
    const clean = loc.replace(/\/+$/, "") || "/";
    if (isDeprecated(clean)) {
      skipped.push(`deprecated: ${clean}`);
      return;
    }
    if (isThin(clean)) {
      skipped.push(`thin-content: ${clean}`);
      renderable.add(clean); // noindex, but still prerendered
      return;
    }
    if (isRedirected(clean)) {
      skipped.push(`301-redirected (vercel.json): ${clean}`);
      return;
    }
    if (seen.has(clean)) {
      skipped.push(`duplicate: ${clean}`);
      return;
    }
    seen.add(clean);
    renderable.add(clean);
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

  // Route manifest for scripts/prerender.mjs. Deliberately NOT written into
  // public/ — it is a build artifact, not something to serve. Utility routes
  // are appended here because they need real HTML too even though they are
  // intentionally kept out of the sitemap.
  const UTILITY_ROUTES = ["/search", "/cookie-settings"];
  for (const r of UTILITY_ROUTES) renderable.add(r);
  const routeList = [...renderable].sort();
  fs.writeFileSync(
    path.join(process.cwd(), ".prerender-routes.json"),
    JSON.stringify(routeList, null, 2),
    "utf-8"
  );

  console.log(`✅ Sitemap generated: ${count} unique routes.`);
  console.log(`✅ Prerender manifest: ${routeList.length} routes (sitemap + noindexed + utility).`);

  if (skipped.length > 0) {
    const byReason = new Map<string, string[]>();
    for (const s of skipped) {
      const [reason, loc] = s.split(": ");
      if (!byReason.has(reason)) byReason.set(reason, []);
      byReason.get(reason)!.push(loc);
    }
    console.warn(`⚠️ Skipped ${skipped.length} URLs:`);
    for (const [reason, locs] of byReason) {
      console.warn(`   ${reason}: ${locs.length}`);
      // Only enumerate the small buckets; thin families are large by design.
      if (locs.length <= 40) for (const l of locs) console.warn(`      ${l}`);
    }
  }

  if (UNSUPPORTED_REDIRECT_SOURCES.length > 0) {
    console.warn(
      `ℹ️ ${UNSUPPORTED_REDIRECT_SOURCES.length} vercel.json redirect source(s) use syntax this generator does not parse; ` +
        `matching URLs were kept (conservative):`
    );
    for (const s of UNSUPPORTED_REDIRECT_SOURCES) console.warn(`      ${s}`);
  }
}

main();
