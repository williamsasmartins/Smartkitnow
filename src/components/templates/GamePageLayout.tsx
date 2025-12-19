import React, { ReactNode } from "react";
import AdUnit from "../AdUnit";
import ShareThisPageBox from "../ShareThisPageBox";
import SuggestionBox from "../SuggestionBox";
import LegalDisclaimer from "../LegalDisclaimer";

// ================================================================
// AD SLOTS CONFIGURATION (same safe pattern as CalculatorVerticalLayout)
// ================================================================
const ENV: any = (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
const SLOT_TOP_BANNER = ENV.VITE_ADSENSE_SLOT_TOP_BANNER ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER ?? "pending";
const SLOT_SIDEBAR = ENV.VITE_ADSENSE_SLOT_SIDEBAR ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "pending";
const SLOT_BOTTOM_BANNER =
  ENV.VITE_ADSENSE_SLOT_BOTTOM_BANNER ?? ENV.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM_BANNER ?? "pending";

// ================================================================
// "ON THIS PAGE" NAVIGATION
// ================================================================
export interface OnThisPageSection {
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
      window.history.pushState(null, "", `#${id}`);
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
// PROPS
// ================================================================
export interface GamePageLayoutProps {
  title: string;
  description?: string;

  /** If you don't pass it, defaults to [{ id: "how-to-play", label: "How to play" }] */
  onThisPage?: OnThisPageSection[];

  /** Main game content (board, panels, etc.) */
  children: ReactNode;

  /** Content for "How to play" section */
  howToPlay?: ReactNode;

  /** Optional: future SEO or structured data */
  jsonLd?: object | object[] | null | undefined;

  /** Ads toggles (keep false for now; enable later if you want) */
  showTopBanner?: boolean;
  showSidebar?: boolean;
  showBottomBanner?: boolean;

  /**
   * Optional switches:
   * - showFooterBlocks: disclaimer/share/suggestion (default true to match site behavior)
   */
  showFooterBlocks?: boolean;
}

// ================================================================
// MAIN LAYOUT (aligned with CalculatorVerticalLayout width/padding/grid)
// ================================================================
export default function GamePageLayout({
  title,
  description,
  onThisPage,
  children,
  howToPlay,
  jsonLd,
  showTopBanner = false,
  showSidebar = false,
  showBottomBanner = false,
  showFooterBlocks = true,
}: GamePageLayoutProps) {
  const sections: OnThisPageSection[] =
    onThisPage && onThisPage.length > 0 ? onThisPage : [{ id: "how-to-play", label: "How to play" }];

  return (
    <div className="skn-game-layout min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {jsonLd ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      {/* MAIN CONTAINER (Max 1200px, Centered) */}
      <div className="mx-auto pb-10 pt-32 lg:pt-40" style={{ maxWidth: 1200 }}>
        {/* TOP BANNER AD (optional) */}
        {showTopBanner && <AdUnit slot={SLOT_TOP_BANNER} type="top-banner" className="mb-8" />}

        {/* LAYOUT WITH OPTIONAL SIDEBAR */}
        <div className="relative xl:flex xl:justify-center xl:gap-12">
          {/* CENTER CONTENT (same as calculators) */}
          <div className="w-full max-w-3xl mx-auto xl:mx-0 px-4 sm:px-6 min-w-0">
            {/* TITLE SECTION */}
            <header className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
                {title}
              </h1>
              {description ? (
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              ) : null}
            </header>

            {/* ON THIS PAGE */}
            {sections.length > 0 ? <OnThisPageNav sections={sections} /> : null}

            {/* GAME CONTENT */}
            <section className="mb-10">
              {children}
            </section>

            {/* HOW TO PLAY */}
            <section id="how-to-play" className="mb-10 scroll-mt-[120px]">
              <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
                  How to play
                </h2>

                {howToPlay ? (
                  <div className="prose prose-slate max-w-none dark:prose-invert">
                    {howToPlay}
                  </div>
                ) : (
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Instructions will appear here.
                  </p>
                )}
              </div>
            </section>

            {/* BOTTOM B
::contentReference[oaicite:2]{index=2}
