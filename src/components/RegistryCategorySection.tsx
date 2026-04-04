/**
 * RegistryCategorySection
 *
 * Renders ALL calculators from a given category (and optional subcategory)
 * directly from the REGISTRY. This ensures every calculator gets at least
 * one editorial internal link from its category hub page, which is critical
 * for crawl budget and GSC indexing.
 *
 * Usage:
 *   <RegistryCategorySection
 *     category="health"
 *     title="All Health Calculators"
 *     exclude={["bmi-calculator"]}   // optional: slugs already listed above
 *   />
 */
import { Link } from "react-router-dom";
import { REGISTRY, calcLink } from "@/data/calculatorRegistry";
import { ChevronRight } from "lucide-react";

interface Props {
  category: string;
  subcategory?: string;
  title?: string;
  /** Slugs already shown elsewhere on the page — skip them here */
  exclude?: string[];
  /** Max items to show (default: all) */
  maxItems?: number;
  className?: string;
}

export default function RegistryCategorySection({
  category,
  subcategory,
  title,
  exclude = [],
  maxItems,
  className = "",
}: Props) {
  const excludeSet = new Set(exclude);

  const items = REGISTRY.filter(
    (e) =>
      e.category === category &&
      (subcategory === undefined || e.subcategory === subcategory) &&
      !excludeSet.has(e.slug)
  ).slice(0, maxItems);

  if (items.length === 0) return null;

  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <section className={`mb-10 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
          {title}
        </h2>
      )}
      <div className="grid gap-x-10 gap-y-2 md:grid-cols-2">
        <ul className="list-disc ml-6 space-y-2.5">
          {left.map((e) => (
            <li key={e.slug} className="leading-relaxed">
              <Link
                to={calcLink(e)}
                className="text-primary hover:underline text-base font-medium"
              >
                {e.title}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="list-disc ml-6 space-y-2.5">
          {right.map((e) => (
            <li key={e.slug} className="leading-relaxed">
              <Link
                to={calcLink(e)}
                className="text-primary hover:underline text-base font-medium"
              >
                {e.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
