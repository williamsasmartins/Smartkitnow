import { ReactNode } from "react";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import LegalDisclaimer from "@/components/LegalDisclaimer";

type Props = {
  title: string;
  editorial: ReactNode;
  widget: ReactNode;
  railRight?: ReactNode | null;
  showTitle?: boolean;
  stickyTopPx?: number;
  maxWidth?: number;
  gap?: number;
  jsonLd?: object | object[];
  showTopBanner?: boolean;
  topBannerHeight?: number;
};

/**
 * CalculatorUnifiedLayout — layout padrão único para todas as páginas de calculadora.
 * Objetivos:
 *  - Design limpo e organizado
 *  - Espaçamento adequado e consistente
 *  - Tipografia e cores padronizadas
 *  - Sticky NATIVO CSS (sem JavaScript)
 *  - BOXes auxiliares: disclaimer + share + suggestion
 */
export default function CalculatorUnifiedLayout({
  title,
  editorial,
  widget,
  railRight = null,
  showTitle = true,
  stickyTopPx = 20,
  maxWidth = 1200,
  gap = 32,
  jsonLd,
  showTopBanner = true,
  topBannerHeight = 90,
}: Props) {
  return (
    <div className="w-full skn-no-overflow">
      <style>{`
        .skn-no-overflow { overflow: visible !important; }
        
        /* CRITICAL: Override root overflow-x-hidden that breaks sticky */
        body,
        #root,
        #root > div,
        .min-h-screen {
          overflow-x: visible !important;
          overflow-y: visible !important;
        }
        
        /* Mobile: disable sticky */
        @media (max-width: 1023px) {
          [aria-label="Calculator widget"] { 
            position: static !important; 
          }
        }
        
        /* Desktop: enable native CSS sticky - FORCE with !important */
        @media (min-width: 1024px) {
          [aria-label="Calculator widget"] {
            position: sticky !important;
            top: ${stickyTopPx}px !important;
            align-self: start !important;
            z-index: 10 !important;
          }
        }

        /* Prevent parent overflow/transform from breaking sticky - CRITICAL! */
        [aria-label="Calculator content"], 
        [aria-label="Calculator widget"],
        [data-role="calc-grid"] {
          overflow: visible !important;
          transform: none !important;
          contain: none !important;
        }
        
        /* Force parent containers to allow sticky */
        .skn-no-overflow,
        .skn-no-overflow > *,
        .grid.skn-no-overflow {
          overflow: visible !important;
          transform: none !important;
        }

        .skn-eqgrid { align-items: stretch; }
        .skn-eqcard { display: flex; flex-direction: column; height: 100%; }
        .skn-eqcard > * { height: 100%; }

        /* Visual redesign: consistent card styling */
        :where([aria-label="Calculator content"], [aria-label="Calculator widget"]) .rounded-2xl.p-4 {
          background-color: rgba(255, 255, 255, 0.92);
          border-color: #e5e7eb;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.06), 0 1px 1px rgb(0 0 0 / 0.04);
          color: #111827;
          transition: background-color 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
        }

        :where(html.dark) :where([aria-label="Calculator content"], [aria-label="Calculator widget"]) .rounded-2xl.p-4 {
          background-color: rgba(31, 41, 55, 0.88);
          border-color: #111827;
          color: #f9fafb;
        }

        :where([aria-label="Calculator content"], [aria-label="Calculator widget"]) .rounded-2xl.p-4:hover {
          background-color: rgba(248, 250, 252, 0.96);
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.08), 0 1px 2px rgb(0 0 0 / 0.06);
          border-color: #d1d5db;
        }

        :where(html.dark) :where([aria-label="Calculator content"], [aria-label="Calculator widget"]) .rounded-2xl.p-4:hover {
          background-color: rgba(31, 41, 55, 0.95);
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.35);
          border-color: #1f2937;
        }

        /* Light mode: content cards #c6c8ca */
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4 {
          background-color: #c6c8ca !important;
          color: #111827;
          border-color: #9ca3af;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }

        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:hover {
          background-color: #c6c8ca !important;
          border-color: #89919a;
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
        }

        /* Light mode: Share box #9ea7a8 */
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4 {
          background-color: #9ea7a8 !important;
          color: #111827;
          border-color: #8b9496;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }

        /* Light mode: Suggestion box #c6c8ca */
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4 {
          background-color: #c6c8ca !important;
          color: #111827;
          border-color: #89919a;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }

        /* Dark mode: Share & Suggestion boxes #18202b */
        :where(html.dark) :where(.skn-eqgrid) .skn-eqcard .rounded-2xl.p-4 {
          background-color: #18202b !important;
          color: #e5e7eb;
          border-color: #0f1924;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
        }

        /* Calculator widget: blue border #5c82ee, no shadow */
        :where([aria-label="Calculator widget"]) .rounded-2xl.p-4 {
          box-shadow: none !important;
          border-color: #5c82ee !important;
        }

        :where([aria-label="Calculator widget"]) .rounded-2xl.p-4:hover,
        :where([aria-label="Calculator widget"]) .rounded-2xl.p-4:active,
        :where([aria-label="Calculator widget"]) .rounded-2xl.p-4:focus {
          box-shadow: none !important;
          border-color: #5c82ee !important;
        }

        :where(html:not(.dark)) :where([aria-label="Calculator widget"]) .rounded-2xl.p-4 {
          background-color: rgba(255, 255, 255, 0.92) !important;
        }

        :where(html.dark) :where([aria-label="Calculator widget"]) .rounded-2xl.p-4 {
          background-color: rgba(31, 41, 55, 0.88) !important;
        }

        /* Typography: enforce <p> color per theme */
        :where(html:not(.dark)) :where(.skn-no-overflow) p {
          color: #000000 !important;
        }

        :where(html.dark) :where(.skn-no-overflow) p {
          color: #ffffff !important;
        }
      `}</style>

      {jsonLd ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      {/* Root grid */}
      <div
        className="grid grid-cols-12 pb-10 items-start"
        style={{
          marginLeft: 0,
          marginRight: 0,
          maxWidth,
          width: maxWidth,
          paddingTop: showTopBanner ? 96 : 32,
          columnGap: gap,
          rowGap: gap,
        }}
      >
        {/* MAIN (9 col) */}
        <section className="col-span-12 lg:col-span-9 pl-4 sm:pl-6 skn-no-overflow">
          {showTopBanner && (
            <div
              aria-hidden
              style={{
                height: topBannerHeight,
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                marginBottom: 24,
              }}
            />
          )}

          {showTitle && (
            <h1 className="text-3xl font-bold mb-4" style={{ color: "#5c82ee" }}>
              {title}
            </h1>
          )}

          {/* Editorial (7) + Widget (5 sticky) */}
          <div
            data-role="calc-grid"
            className="grid skn-no-overflow"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0,1fr))",
              columnGap: gap,
              rowGap: gap,
            }}
          >
            <section 
              className="col-span-12 lg:col-span-7" 
              aria-label="Calculator content"
            >
              {editorial}
            </section>

            <aside
              aria-label="Calculator widget"
              className="col-span-12 lg:col-span-5"
              style={{ maxWidth: 420 }}
            >
              {widget}
            </aside>
          </div>

          {/* Disclaimer + Share + Suggestion */}
          <div className="mt-8" role="note" aria-label="Important notice">
            <LegalDisclaimer
              kind="financial"
              locale="en"
              note="Smart Kit Now is not responsible for actions taken based on these estimates."
              className="rounded-2xl border border-gray-200 bg-white/5 p-4 dark:border-gray-800"
            />
          </div>

          <div className="mt-4 grid grid-cols-12 gap-4 skn-eqgrid">
            <div className="col-span-12 md:col-span-6">
              <div className="skn-eqcard h-full">
                <ShareThisPageBox />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="skn-eqcard h-full">
                <SuggestionBox />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Banner - AdSense 728x90 */}
        <div className="col-span-12 lg:col-span-9 mt-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl h-24 flex items-center justify-center text-gray-500 text-xs">
          ADSENSE - 728x90
        </div>

        {/* RIGHT RAIL (3 col) */}
        <aside 
          className="col-span-12 mt-8 lg:col-span-3 lg:mt-0 pr-4 sm:pr-6 skn-no-overflow" 
          aria-label="Right rail"
        >
          {/* AdSense 300x600 */}
          <div className="mb-6 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl h-64 flex items-center justify-center text-gray-500 text-xs">
            ADSENSE - 300x600
          </div>

          {railRight}
        </aside>
      </div>
    </div>
  );
}
