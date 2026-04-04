// src/components/RelatedCalculators.tsx
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { REGISTRY, calcLink, categoryIcon, type CalculatorEntry } from "@/data/calculatorRegistry";
import { CROSS_LINKS } from "@/data/crossLinks";

interface RelatedCalculatorsProps {
  currentSlug: string;
  category: string;
  subcategory?: string;
  maxItems?: number;
}

/**
 * Shows related calculators.
 * Priority order:
 *   1. Cross-category links from CROSS_LINKS table (max 2)
 *   2. Same subcategory
 *   3. Same category (fills remaining slots)
 * Total capped at maxItems.
 */
export default function RelatedCalculators({
  currentSlug,
  category,
  subcategory,
  maxItems = 4,
}: RelatedCalculatorsProps) {
  const related = buildRelated(currentSlug, category, subcategory, maxItems);

  if (related.length === 0) return null;

  return (
    <section
      aria-label="Related calculators"
      className="mt-10 border-t border-border pt-8"
    >
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <span>{categoryIcon(category)}</span>
        You might also like
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {related.map((entry) => (
          <li key={entry.slug}>
            <Link
              to={calcLink(entry)}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted hover:border-primary/40 transition-colors duration-150 group"
            >
              <span className="line-clamp-2 leading-snug">{entry.title}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function buildRelated(
  currentSlug: string,
  category: string,
  subcategory: string | undefined,
  maxItems: number
): CalculatorEntry[] {
  const slugSet = new Set<string>();
  const merged: CalculatorEntry[] = [];

  const addEntry = (entry: CalculatorEntry) => {
    if (merged.length >= maxItems) return;
    if (slugSet.has(entry.slug)) return;
    slugSet.add(entry.slug);
    merged.push(entry);
  };

  // 1. Cross-category links (up to 2 slots)
  const crossSlugs = CROSS_LINKS[currentSlug] ?? [];
  for (const slug of crossSlugs.slice(0, 2)) {
    const entry = REGISTRY.find((e) => e.slug === slug);
    if (entry) addEntry(entry);
  }

  // 2. Same subcategory
  const sameSub = REGISTRY.filter(
    (e) => e.slug !== currentSlug && e.category === category && e.subcategory === subcategory
  );
  for (const entry of sameSub) addEntry(entry);

  // 3. Same category (fill remaining slots)
  const sameCategory = REGISTRY.filter(
    (e) => e.slug !== currentSlug && e.category === category && e.subcategory !== subcategory
  );
  for (const entry of sameCategory) addEntry(entry);

  return merged;
}
