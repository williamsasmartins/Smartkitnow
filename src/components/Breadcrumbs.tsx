// src/components/Breadcrumbs.tsx
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import JsonLd from "@/components/seo/JsonLd";

// ─── Static data imports (no JSX/component deps) ────────────────────────────
import { CATEGORIES, getCategoryMeta } from "@/data/categoryMeta";
import { getEntry, FRIENDLY_TITLES, SUBCATEGORY_TITLES } from "@/data/calculatorRegistry";
import { smartTipsCategories } from "@/data/smartTipsData";
import { GAME_SLUGS } from "@/data/gameSlugs";

// ─── Constants ───────────────────────────────────────────────────────────────
const ORIGIN = "https://www.smartkitnow.com";

/**
 * Pages where breadcrumbs should be completely hidden.
 * We also hide on "/" by default (length check below).
 */
const HIDDEN_PATHS = new Set(["/", "/search", "/not-found"]);

/**
 * Top-level segment → human-readable label.
 * Merged from CATEGORIES + extra static routes.
 */
const SEGMENT_LABELS: Record<string, string> = {
  // From categoryMeta.ts
  ...Object.fromEntries(
    Object.values(CATEGORIES).map((c) => [c.path, c.display])
  ),
  // Extra routes not in CATEGORIES
  "games":        "Games Zone",
  "smart-tips":   "Smart Tips",
  "smart-tip":    "Smart Tips",
  "daily-quotes": "Daily Quotes",
  "everyday":     "Everyday Life",
  "about":        "About Us",
  "contact":      "Contact",
  "privacy":      "Privacy Policy",
  "terms":        "Terms of Use",
  "cookies":      "Cookies",
  "cookie-settings": "Cookie Settings",
  "horoscopo":    "Daily Horoscope",
};

// ─── Helper: slugify → Title Case ────────────────────────────────────────────
function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Helper: resolve a game slug title ───────────────────────────────────────
function resolveGameTitle(slug: string): string {
  // We don't import gameRegistry.tsx (JSX), so we derive from gameSlugs.
  // Best effort: fallback to slugToTitle. If you want the real title, a
  // lightweight gameTitles.ts can be created separately.
  return slugToTitle(slug);
}

// ─── Helper: resolve a SmartTip detail title ─────────────────────────────────
function resolveSmartTipTitle(slug: string): string {
  for (const cat of smartTipsCategories) {
    const tip = cat.tips.find((t) => t.slug === slug);
    if (tip) return tip.title;
  }
  return slugToTitle(slug);
}

// ─── Helper: resolve a SmartTips subcategory title ───────────────────────────
function resolveSmartTipsSubcategory(slug: string): string {
  const cat = smartTipsCategories.find((c) => c.slug === slug);
  return cat ? cat.title : slugToTitle(slug);
}

// ─── Breadcrumb item type ─────────────────────────────────────────────────────
interface BreadcrumbItem {
  label: string;
  href: string;
}

// ─── Core resolution logic ────────────────────────────────────────────────────
function resolveBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  // Strip trailing slash for consistency
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean === "/") return crumbs;

  const segments = clean.split("/").filter(Boolean); // e.g. ["games", "neon-snake"]

  // ── /games/:slug ──────────────────────────────────────────────────────────
  if (segments[0] === "games") {
    crumbs.push({ label: "Games Zone", href: "/games" });
    if (segments[1]) {
      crumbs.push({
        label: resolveGameTitle(segments[1]),
        href: `/games/${segments[1]}`,
      });
    }
    return crumbs;
  }

  // ── /smart-tip/:slug (individual tip detail) ──────────────────────────────
  if (segments[0] === "smart-tip" && segments[1]) {
    crumbs.push({ label: "Smart Tips", href: "/smart-tips" });
    crumbs.push({
      label: resolveSmartTipTitle(segments[1]),
      href: `/smart-tip/${segments[1]}`,
    });
    return crumbs;
  }

  // ── /smart-tips/:subcategory ──────────────────────────────────────────────
  if (segments[0] === "smart-tips") {
    crumbs.push({ label: "Smart Tips", href: "/smart-tips" });
    if (segments[1]) {
      crumbs.push({
        label: resolveSmartTipsSubcategory(segments[1]),
        href: `/smart-tips/${segments[1]}`,
      });
    }
    return crumbs;
  }

  // ── /daily-quotes/:category ───────────────────────────────────────────────
  if (segments[0] === "daily-quotes") {
    crumbs.push({ label: "Daily Quotes", href: "/daily-quotes" });
    if (segments[1]) {
      const subLabel =
        segments[1] === "horoscopo"
          ? "Daily Horoscope"
          : slugToTitle(segments[1]);
      crumbs.push({
        label: subLabel,
        href: `/daily-quotes/${segments[1]}`,
      });
    }
    return crumbs;
  }

  // ── Calculator routes — dynamic resolution via registry ──────────────────
  // Pattern A: /:category/:slug  (flat)
  // Pattern B: /:category/:subcategory/:slug  (nested)
  if (segments.length >= 2) {
    const [cat, sub, deepSlug] = segments;
    const catMeta = getCategoryMeta(cat);
    const catLabel = catMeta?.display ?? FRIENDLY_TITLES[cat] ?? SEGMENT_LABELS[cat] ?? slugToTitle(cat);
    const catHref = `/${catMeta?.path ?? cat}`;

    crumbs.push({ label: catLabel, href: catHref });

    // Try 3-segment first: /:category/:subcategory/:slug
    if (deepSlug) {
      // sub is a subcategory segment
      const subLabel =
        (SUBCATEGORY_TITLES[cat]?.[sub]) ??
        slugToTitle(sub);
      crumbs.push({ label: subLabel, href: `${catHref}/${sub}` });

      // deepSlug is the calculator
      const entry = getEntry(deepSlug);
      crumbs.push({
        label: entry?.title ?? slugToTitle(deepSlug),
        href: `${catHref}/${sub}/${deepSlug}`,
      });
      return crumbs;
    }

    // 2-segment: /:category/:slug
    const entry = getEntry(sub);
    crumbs.push({
      label: entry?.title ?? slugToTitle(sub),
      href: `${catHref}/${sub}`,
    });
    return crumbs;
  }

  // ── Single segment: /:category  ───────────────────────────────────────────
  if (segments.length === 1) {
    const seg = segments[0];
    const catMeta = getCategoryMeta(seg);
    const label = catMeta?.display ?? SEGMENT_LABELS[seg] ?? slugToTitle(seg);
    crumbs.push({ label, href: `/${seg}` });
    return crumbs;
  }

  return crumbs;
}

// ─── JSON-LD BreadcrumbList builder ──────────────────────────────────────────
function buildJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${ORIGIN}${item.href}`,
    })),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Breadcrumbs() {
  const { pathname } = useLocation();

  const breadcrumbs = useMemo(() => resolveBreadcrumbs(pathname), [pathname]);

  // Hide on home, search, and other excluded paths, or if only "Home" remains
  if (HIDDEN_PATHS.has(pathname) || breadcrumbs.length <= 1) return null;

  const jsonLd = buildJsonLd(breadcrumbs);

  return (
    <>
      {/* JSON-LD injected in <head> via React portals inside JsonLd */}
      <JsonLd data={jsonLd} />

      <nav
        aria-label="Breadcrumb"
        className="w-full bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700"
      >
        <ol
          className="flex flex-wrap items-center gap-1 text-sm text-slate-500 dark:text-slate-400 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10 py-2"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;

            return (
              <li
                key={crumb.href}
                className="flex items-center gap-1"
                itemScope
                itemType="https://schema.org/ListItem"
                itemProp="itemListElement"
              >
                {/* Separator (before every item except first) */}
                {!isFirst && (
                  <ChevronRight
                    className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/50"
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  // Current page — non-clickable, visually distinct
                  <span
                    className="font-medium text-slate-800 dark:text-slate-100 truncate max-w-[200px]"
                    aria-current="page"
                    itemProp="name"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.href}
                    className={cn(
                      "hover:text-slate-800 dark:hover:text-slate-100 transition-colors duration-150",
                      "flex items-center gap-1",
                      isFirst && "text-slate-500 dark:text-slate-400 hover:text-primary"
                    )}
                    itemProp="item"
                  >
                    {isFirst && (
                      <Home
                        className="h-3.5 w-3.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span itemProp="name">{crumb.label}</span>
                  </Link>
                )}

                {/* Microdata position */}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
