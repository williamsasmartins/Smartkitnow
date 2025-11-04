import * as React from "react";
import { Link } from "react-router-dom";
import RightRailAds from "@/components/ads/RightRailAds";
import ShareBox from "@/components/ui/ShareBox";
import SuggestionBox from "@/components/ui/SuggestionBox";
import { listByCategory } from "@/data/calculatorRegistry";

/** Fallback: transforma "loan-payment" -> "Loan Payment" */
function titleFromSlug(slug: string) {
  return slug
    .replaceAll("-", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

/** Garante nome visível mesmo se o registry não tiver `name` */
function visibleName(entry: any) {
  if (entry?.name && String(entry.name).trim().length > 0) return entry.name;
  if (entry?.slug) return titleFromSlug(entry.slug);
  return "Calculator";
}

export default function FinancialIndexPage() {
  const calculators = React.useMemo(() => {
    try {
      const list = listByCategory("financial") ?? [];
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,160px] gap-6">
        {/* Coluna principal */}
        <main>
          {/* Top banner */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 h-[120px] flex items-center justify-center text-white/60 text-sm">
            Top Banner Ad (970×90 / 728×90 / 320×100)
          </div>

          <header className="mb-4">
            <h1 className="text-4xl font-bold text-[#5c82ee]">
              Financial Calculators
            </h1>
            <p className="mt-2 text-[#747886] max-w-3xl">
              Make confident money decisions with expert-built calculators. Loans,
              payments, interest-only and balloon options, refinance savings,
              compound interest, ROI, after-tax income, salary ↔ hourly, currency,
              tips, VAT/GST and more — with clear formulas and worked examples.
            </p>
          </header>

          {/* Lista de calculadoras — SEM placeholder; texto forçado visível */}
          <section className="mt-6">
            <ul className="space-y-2 marker:text-white/40">
              {calculators.map((c: any) => {
                const label = visibleName(c);
                const to = `/financial/${c?.slug ?? ""}`;
                return (
                  <li key={c?.slug ?? label} className="list-disc list-inside">
                    <Link
                      to={to}
                      className="inline-block text-white/90 hover:text-white underline underline-offset-2"
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
              {calculators.length === 0 && (
                <li className="text-white/70">No calculators found in registry.</li>
              )}
            </ul>
          </section>

          {/* Share + Suggestion */}
          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <ShareBox />
            <SuggestionBox />
          </section>
        </main>

        {/* Right rail – alinhado ao título */}
        <RightRailAds className="pt-[2.25rem]" />
      </div>
    </div>
  );
}