// src/components/RelatedCalculators.tsx
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { REGISTRY, calcLink, categoryIcon, type CalculatorEntry } from "@/data/calculatorRegistry";

interface RelatedCalculatorsProps {
  currentSlug: string;
  category: string;
  subcategory?: string;
  maxItems?: number;
}

/**
 * Shows related calculators from the same category/subcategory.
 * Priority: same subcategory first, then same category, capped at maxItems.
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
  const others = REGISTRY.filter((e) => e.slug !== currentSlug && e.category === category);

  // Same subcategory first (most relevant)
  const sameSub = subcategory
    ? others.filter((e) => e.subcategory === subcategory)
    : [];

  // Fill remaining slots with rest of same category
  const rest = others.filter((e) => e.subcategory !== subcategory);

  // Merge without duplicates, capped at maxItems
  const merged: CalculatorEntry[] = [];
  for (const entry of [...sameSub, ...rest]) {
    if (merged.length >= maxItems) break;
    merged.push(entry);
  }

  return merged;
}
