import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryMeta, getDisplaySubcategory } from "@/data/categoryMeta";
import EmojiIcon from "@/components/ui/EmojiIcon";

type Props = {
  category: string;       // canonical key (e.g., "construction")
  subcategory: string;    // canonical sub key (e.g., "concrete-masonry-foundations")
  slug: string;           // calculator slug (e.g., "board-foot")
  name: string;           // calculator name
  // optional custom description; if missing we auto-generate a short one
  description?: string;
};

export default function CalculatorCard({
  category,
  subcategory,
  slug,
  name,
  description,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const meta = getCategoryMeta(category);
  const iconName = meta?.icon ?? "Sparkles";
  const displaySub = getDisplaySubcategory(category, subcategory);

  const autoDescription = useMemo(() => {
    // fallback copy if none provided; short, SEO-friendly
    return `${name} — quick and accurate results with step-by-step formulas and examples. Part of ${meta?.display ?? "our calculators"} in ${displaySub}.`;
  }, [name, meta?.display, displaySub]);

  const text = description?.trim() || autoDescription;
  const shouldClamp = text.length > 140; // simples: se maior, mostra READ MORE

  const href = `/${category}/${subcategory}/${slug}`;

  return (
    <article className="border rounded-xl p-4 bg-card hover:shadow-md transition-shadow">
      <header className="flex items-center gap-2 mb-2">
        {/* icon placeholder; hook into your icon map if you want */}
        <span aria-hidden className="inline-grid place-items-center h-8 w-8 rounded-lg border bg-card">
          {meta?.emoji ? (
            <EmojiIcon symbol={meta.emoji} size={20} />
          ) : (
            <span className="text-xs">🧮</span>
          )}
        </span>
        <h3 className="text-lg font-semibold leading-tight">
          <Link to={href} className="hover:underline">
            {name}
          </Link>
        </h3>
      </header>

      <p className={`${expanded ? "" : "line-clamp-3"} text-sm text-muted-foreground`}>
        {text}
      </p>

      {shouldClamp && (
        <button
          type="button"
          className="mt-2 text-xs font-semibold underline underline-offset-4"
          onClick={() => setExpanded(v => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "READ LESS" : "READ MORE"}
        </button>
      )}

      <footer className="mt-3 text-xs opacity-70">
        {meta?.display ?? category} · {displaySub}
      </footer>
    </article>
  );
}