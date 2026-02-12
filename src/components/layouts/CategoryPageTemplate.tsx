import { useMemo, useState, ReactNode } from "react";
import { getCategoryIcon } from "@/lib/navigation";
import { BadgeDollarSign, LineChart, PiggyBank, Percent, BriefcaseBusiness, CreditCard, Banknote } from "lucide-react";

const KIND_TITLES: Record<string, string> = {
  financial: "Financial Calculators",
  health: "Health & Fitness Calculators",
  cooking: "Cooking Calculators",
  conversion: "Conversion Calculators",
  math: "Math & Algebra Calculators",
  pet: "Pet Care Calculators",
  science: "Science Calculators",
  time: "Time & Date Calculators",
  video: "Video Calculators",

  tips: "Smart Tips",
  quotes: "Daily Quotes",
  everyday: "Every day Life Calculators",
  sports: "Sports",
  funny: "Funny Calculators",
  automotive: "Automotive Calculators",
  construction: "Construction Calculators",
  electrical: "Electrical Calculators",
};

export type CategorySection = {
  heading: string;
  items: { title: string; to: string }[];
};

export type CategoryPageTemplateProps = {
  title?: string;
  description?: string;
  sections: CategorySection[];
  headerSlot?: ReactNode;  // optional custom content AFTER the default H1
  railSlot?: ReactNode;
  minContentScore?: number;
  kind?: string;           // same key used in the top menu, e.g. "financial"
};

// Keep page meta export for compatibility with existing pages
export const defaultPageMeta = { allowAds: true, minContentScore: 3 };

export default function CategoryPageTemplate({
  title,
  description,
  sections,
  headerSlot,
  railSlot,
  minContentScore = 3,
  kind = "financial",
}: CategoryPageTemplateProps) {
  const [expanded, setExpanded] = useState(false);
  const calculatorsCount = useMemo(
    () => sections.reduce((acc, s) => acc + s.items.length, 0),
    [sections]
  );
  const resolvedTitle = title || KIND_TITLES[kind] || "Calculators";
  const emoji = getCategoryIcon(kind);

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 pb-16 md:pb-24 pt-6 md:pt-8">
      {/* H1 SEMPRE renderizado quando houver título (ou fallback) */}
      {resolvedTitle ? (
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-sm text-[20px] leading-none select-none"
              style={{ backgroundColor: "#3c83f6", color: "#fff" }}
              aria-hidden="true"
            >
              {emoji}
            </div>
            <h1 className="block text-[28px] md:text-[32px] font-bold tracking-[-0.01em]">
              {resolvedTitle}
            </h1>
          </div>

          <div className="mt-2 text-sm skn-text-muted">
            {calculatorsCount} calculators
          </div>

          {description && (
            <div className="mt-3">
              {/* NARROW DESCRIPTION FOR RIGHT-RAIL AD COMPAT */}
              <div className="max-w-[740px]">
                <p className={expanded ? "text-[15px] md:text-[16px] leading-[1.8]" : "text-[15px] md:text-[16px] leading-[1.8] skn-line-clamp-3"}>
                  {description}
                </p>
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-1 text-[var(--skn-brand)] underline underline-offset-2"
                >
                  {expanded ? "Read less" : "Read more"}
                </button>
              </div>
            </div>
          )}
        </header>
      ) : null}

      {/* If you still want custom content, it will render AFTER the default H1 */}
      {headerSlot ? <div className="mb-6">{headerSlot}</div> : null}

      {/* Seções com ícones coloridos e duas colunas */}
      <div className="space-y-10">
        {sections.map((sec) => {
          const s = sectionIcon(sec.heading);
          return (
            <section key={sec.heading} className="mt-10">
              <h2 className="text-[22px] md:text-[24px] font-semibold leading-snug tracking-[-0.005em] mb-6 flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: s.color, color: "#fff" }}>
                  {s.el}
                </span>
                <span style={{ color: "#224691" }}>{sec.heading}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                <ul className="list-disc pl-5 space-y-3 leading-7">
                  {sec.items.filter((_, i) => i % 2 === 0).map((it) => (
                    <li key={it.to} className="marker:text-[var(--skn-brand)]">
                      <a href={it.to} className="inline-block text-[var(--skn-brand)] underline decoration-[var(--skn-brand)] underline-offset-2 hover:decoration-2">
                        {it.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <ul className="list-disc pl-5 space-y-3 leading-7">
                  {sec.items.filter((_, i) => i % 2 === 1).map((it) => (
                    <li key={it.to} className="marker:text-[var(--skn-brand)]">
                      <a href={it.to} className="inline-block text-[var(--skn-brand)] underline decoration-[var(--skn-brand)] underline-offset-2 hover:decoration-2">
                        {it.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* helper de ícones por heading (coloridos) */
const sectionIcon = (heading: string) => {
  const base = "w-5 h-5";
  const norm = heading.toLowerCase();
  if (norm.includes("interest") || norm.includes("loan")) return { el: <BadgeDollarSign className={base} />, color: "#3b82f6" }; // blue
  if (norm.includes("investment")) return { el: <LineChart className={base} />, color: "#16a34a" }; // green
  if (norm.startsWith("loan")) return { el: <PiggyBank className={base} />, color: "#8b5cf6" }; // violet
  if (norm.includes("tax") || norm.includes("income")) return { el: <Percent className={base} />, color: "#f59e0b" }; // amber
  if (norm.includes("business") || norm.includes("profit")) return { el: <BriefcaseBusiness className={base} />, color: "#6366f1" }; // indigo
  if (norm.includes("debt") || norm.includes("credit")) return { el: <CreditCard className={base} />, color: "#ef4444" }; // red
  if (norm.includes("currency") || norm.includes("inflation")) return { el: <Banknote className={base} />, color: "#14b8a6" }; // teal
  return { el: <BadgeDollarSign className={base} />, color: "#3c83f6" };
};