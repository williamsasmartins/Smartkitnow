import React, { ReactNode, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdUnit from "../AdUnit";
import ShareThisPageBox from "../ShareThisPageBox";
import SuggestionBox from "../SuggestionBox";
import LegalDisclaimer from "../LegalDisclaimer";
import { getEntry } from "@/data/calculatorRegistry";
import SEOHead from "@/components/SEOHead";

// ================================================================
// AD SLOTS CONFIGURATION
// ================================================================
// Suporte seguro para Vite (import.meta.env) e compatibilidade com NEXT_PUBLIC_*
const ENV: any = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
const SLOT_TOP_BANNER = ENV.VITE_ADSENSE_SLOT_TOP_BANNER ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER ?? "pending";
const SLOT_SIDEBAR = ENV.VITE_ADSENSE_SLOT_SIDEBAR ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "pending";
const SLOT_BOTTOM_BANNER = ENV.VITE_ADSENSE_SLOT_BOTTOM_BANNER ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM_BANNER ?? "pending";

// ================================================================
// "ON THIS PAGE" NAVIGATION - FINTECH STYLE
// ================================================================
interface OnThisPageSection {
  id: string;
  label: string;
}

function OnThisPageNav({ sections }: { sections: OnThisPageSection[] }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-l-4 border-indigo-500 dark:border-indigo-400 p-6 rounded-xl mb-8 shadow-lg shadow-indigo-500/10">
      <p className="font-extrabold text-slate-900 dark:text-slate-100 mb-4 text-base tracking-tight">
        On this page:
      </p>
      <ul className="space-y-2.5">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              onClick={(e) => handleClick(e, section.id)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline text-sm font-semibold transition-all duration-200 cursor-pointer block"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ================================================================
// FORMULA BOX - FINTECH STYLE
// ================================================================
interface FormulaVariable {
  symbol: string;
  description: string;
}

function FormulaBox({
  formula,
  variables = [],
  title = "Formula",
}: {
  formula: string;
  variables?: FormulaVariable[];
  title?: string;
}) {
  return (
    <div className="my-12 p-4 md:p-8 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-violet-950 shadow-xl shadow-indigo-500/10">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-block bg-white dark:bg-slate-900 rounded-xl px-8 py-4 shadow-lg shadow-indigo-500/10 border border-indigo-100 dark:border-indigo-900">
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h3>
        </div>
      </div>

      {/* Formula */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-8 mb-8 shadow-lg border border-indigo-100 dark:border-indigo-900">
        <p className="text-center text-3xl font-mono font-bold text-slate-900 dark:text-slate-100 break-words">
          {formula}
        </p>
      </div>

      {/* Variables */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-indigo-100 dark:border-indigo-900">
        <p className="font-extrabold text-slate-900 dark:text-slate-100 mb-5 text-lg tracking-tight">
          Where:
        </p>
        <div className="space-y-3">
          {variables.map((variable) => (
            <div key={variable.symbol} className="flex items-start gap-4">
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg min-w-[3rem]">
                {variable.symbol}
              </span>
              <span className="text-slate-700 dark:text-slate-300">
                = {variable.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ================================================================
// EXAMPLE CALCULATION - FINTECH STYLE
// ================================================================
interface ExampleStep {
  // Preferred modern shape
  step?: number;
  description?: string;
  calculation?: string;
  // Legacy shape fallback
  label?: string;
  explanation?: string;
}

function ExampleSection({
  title,
  scenario,
  steps = [],
  result,
}: {
  title: string;
  scenario: string;
  steps?: ExampleStep[];
  result: string;
}) {
  const hasResult = typeof result === "string" && result.trim().length > 0;

  return (
    <div className="my-10 p-4 md:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl">
      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-5 tracking-tight">
        {title}
      </h3>

      <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
        {scenario}
      </p>

      <div className="space-y-5 mb-8">
        {steps.map((step) => (
          <div
            key={(step.step ?? step.label ?? Math.random()).toString()}
            className="bg-slate-50 dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-all duration-200 hover:shadow-md"
          >
            <p className="font-bold text-slate-900 dark:text-slate-100 mb-3">
              {step.step != null
                ? `Step ${step.step}: ${step.description ?? ""}`
                : `${step.label ?? "Step"}${step.explanation ? `: ${step.explanation}` : ""
                }`}
            </p>
            {step.calculation && (
              <p className="font-mono text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
                {step.calculation}
              </p>
            )}
          </div>
        ))}
      </div>

      {hasResult && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-l-4 border-emerald-500 p-6 rounded-xl shadow-lg">
          <p className="font-bold text-lg text-slate-900 dark:text-slate-100">
            Result: {result}
          </p>
        </div>
      )}
    </div>
  );
}

// ================================================================
// RELATED CALCULATORS - FINTECH STYLE
// ================================================================
interface RelatedCalc {
  title: string;
  url: string;
  icon?: string;
}

function RelatedCalculators({ calculators }: { calculators: RelatedCalc[] }) {
  if (!calculators || calculators.length === 0) return null;

  return (
    <div className="my-10 p-4 md:p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-slate-900 dark:to-violet-950 border-2 border-violet-200 dark:border-violet-800 shadow-xl">
      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-3 tracking-tight">
        <span>🔗</span> Related Calculators
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calculators.map((calc) => {
          const icon = calc.icon && calc.icon.trim().length > 0 ? calc.icon : "🧮";
          return (
            <a
              key={calc.url}
              href={calc.url}
              className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-violet-200 dark:border-violet-800 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 group"
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 font-semibold">
                {calc.title}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ================================================================
// PROPS INTERFACE
// ================================================================
interface CalculatorVerticalLayoutProps {
  title: string;
  description?: string;
  widget?: ReactNode;
  editorial?: ReactNode;
  onThisPage?: OnThisPageSection[];
  formula?: {
    formula: string;
    variables: FormulaVariable[];
    title?: string;
  };
  example?: {
    title: string;
    scenario: string;
    steps: ExampleStep[];
    result: string;
  };
  relatedCalculators?: RelatedCalc[];
  showTopBanner?: boolean;
  showSidebar?: boolean;
  showBottomBanner?: boolean;
  hideLegalDisclaimer?: boolean; // Nova prop opcional
  jsonLd?: object | object[] | null | undefined;
  canonical?: string;
  contentMaxWidth?: string; // e.g. 'max-w-5xl' or 'max-w-full'
  children?: ReactNode;
}

// ================================================================
// MAIN LAYOUT - HIGH-END FINTECH SAAS DESIGN
// ================================================================
export default function CalculatorVerticalLayout({
  title,
  description,
  widget,
  editorial,
  onThisPage,
  formula,
  example,
  relatedCalculators,
  showTopBanner = true,
  showSidebar = true,
  showBottomBanner = true,
  hideLegalDisclaimer = false, // Padrão é false (mostrar)
  jsonLd,
  canonical,
  contentMaxWidth = "max-w-3xl",
  children,
}: CalculatorVerticalLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const resolvedDescription = useMemo(() => {
    return description;
  }, [description]);

  return (
    <div className="skn-vertical-layout min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <SEOHead
        title={title}
        description={resolvedDescription}
        canonical={canonical}
      />

      {jsonLd ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      {/* MAIN CONTAINER (Max 1200px, Centered) */}
      <div className="mx-auto pb-10 pt-32 lg:pt-40" style={{ maxWidth: 1200 }}>
        {/* TOP BANNER AD */}
        {showTopBanner && (
          <AdUnit slot={SLOT_TOP_BANNER} type="top-banner" className="mb-8" />
        )}

        {/* LAYOUT WITH SIDEBAR + CONTENT */}
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          {/* CENTERED CONTENT (Dynamic Max Width) */}
          <div className={`w-full ${contentMaxWidth} mx-auto xl:mx-0 px-4 sm:px-6 min-w-0`}>
            {/* TITLE SECTION */}
            <header className="mb-8">
              <div className="mb-6">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                  Back to Home
                </button>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
                {title}
              </h1>
              {resolvedDescription && (
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  {resolvedDescription}
                </p>
              )}
            </header>

            {/* ON THIS PAGE NAVIGATION */}
            {onThisPage && onThisPage.length > 0 && (
              <OnThisPageNav sections={onThisPage} />
            )}

            {/* CALCULATOR WIDGET or Children */}
            {children ? (
              <div className="mb-10">{children}</div>
            ) : (
              <section className="mb-10 rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 shadow-2xl shadow-indigo-500/10 transition-all duration-200">
                <div className="p-4 md:p-8">{widget}</div>
              </section>
            )}

            {/* FORMULA BOX */}
            {formula && (
              <FormulaBox
                formula={formula.formula}
                variables={formula.variables ?? []}
                title={formula.title}
              />
            )}

            {/* EXAMPLE CALCULATION */}
            {example && (
              <ExampleSection
                title={example.title}
                scenario={example.scenario}
                steps={example.steps ?? []}
                result={example.result}
              />
            )}

            {/* EDITORIAL CONTENT (hidden if children provided) */}
            {!children && (
              <article
                id="content"
                className="mb-10 prose prose-lg prose-slate max-w-none dark:prose-invert"
              >
                <div className="text-slate-900 dark:text-slate-100 leading-relaxed skn-editorial-sections">
                  {editorial}
                </div>
              </article>
            )}

            {/* RELATED CALCULATORS */}
            {relatedCalculators && relatedCalculators.length > 0 && (
              <RelatedCalculators calculators={relatedCalculators} />
            )}

            {/* BOTTOM BANNER AD */}
            {showBottomBanner && (
              <AdUnit slot={SLOT_BOTTOM_BANNER} type="bottom-banner" className="mb-10" />
            )}

            {/* LEGAL DISCLAIMER */}
            {!hideLegalDisclaimer && <LegalDisclaimer />}

            {/* SHARE THIS PAGE */}
            <ShareThisPageBox />

            {/* SUGGESTION BOX */}
            <SuggestionBox />
          </div>

          {/* FLOATING SIDEBAR (Desktop Only, STICKY) */}
          {showSidebar && (
            <aside className="hidden xl:block w-[300px] flex-shrink-0">
              <div className="sticky top-[120px]">
                <AdUnit slot={SLOT_SIDEBAR} type="sidebar" />
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* CUSTOM CSS */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .skn-editorial-sections section {
          scroll-margin-top: 120px;
        }

        .skn-vertical-layout {
          position: relative;
        }
      `}</style>
    </div>
  );
}
