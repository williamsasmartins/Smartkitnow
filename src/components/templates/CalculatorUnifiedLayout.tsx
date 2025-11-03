import { ReactNode } from "react";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import LegalDisclaimer from "@/components/LegalDisclaimer";

type Props = {
  title: string;
  editorial: ReactNode; // conteúdo principal (artigo, fórmula, exemplos)
  widget: ReactNode; // calculadora (sticky)
  railRight?: ReactNode | null; // opcional: anúncios / conteúdo lateral
  showTitle?: boolean;
  stickyTopPx?: number;
  maxWidth?: number;
  gap?: number; // px spacing entre colunas/linhas
  jsonLd?: object | object[];
  showTopBanner?: boolean;
  topBannerHeight?: number; // altura do slot superior (ex.: 90)
};

/**
 * CalculatorUnifiedLayout — layout padrão único para todas as páginas de calculadora.
 * Objetivos:
 *  - Design limpo e organizado
 *  - Espaçamento adequado e consistente
 *  - Tipografia e cores padronizadas
 *  - Sticky estável com fallback seguro
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
  // Sticky nativo; sem fallback fixed.

  return (
    <div className="w-full skn-no-overflow">
      {(() => { console.log("[SKN] CalculatorUnifiedLayout LIVE"); return null; })()}
      <style>{`
        .skn-no-overflow { overflow: visible !important; }
        @media (max-width: 767.98px){
          [aria-label="Calculator widget"] { position: static !important; top: auto !important; }
        }
        /* Evita pais com overflow/transform quebrarem o sticky */
        [aria-label="Calculator content"], [aria-label="Calculator widget"] {
          overflow: visible !important;
          transform: none !important;
        }
        .skn-eqgrid { align-items: stretch; }
        .skn-eqcard { display: flex; flex-direction: column; height: 100%; }
        .skn-eqcard > * { height: 100%; }

        /* Visual redesign: consistent, accessible card styling across content and widget */
        :where([aria-label="Calculator content"], [aria-label="Calculator widget"]) .rounded-2xl.p-4 {
          background-color: rgba(255, 255, 255, 0.92);
          border-color: #e5e7eb; /* gray-200 */
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.06), 0 1px 1px rgb(0 0 0 / 0.04);
          color: #111827; /* gray-900 */
          transition: background-color 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
        }

        :where(html.dark) :where([aria-label="Calculator content"], [aria-label="Calculator widget"]) .rounded-2xl.p-4 {
          background-color: rgba(31, 41, 55, 0.88); /* gray-800 */
          border-color: #111827; /* gray-900 */
          color: #f9fafb; /* gray-50 */
        }

        :where([aria-label="Calculator content"], [aria-label="Calculator widget"]) .rounded-2xl.p-4:hover {
          background-color: rgba(248, 250, 252, 0.96); /* gray-50 */
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.08), 0 1px 2px rgb(0 0 0 / 0.06);
          border-color: #d1d5db; /* gray-300 */
        }

        :where(html.dark) :where([aria-label="Calculator content"], [aria-label="Calculator widget"]) .rounded-2xl.p-4:hover {
          background-color: rgba(31, 41, 55, 0.95); /* gray-800 darker */
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.35);
          border-color: #1f2937; /* gray-800 */
        }

        /* Light mode: apply #c6c8ca background consistently to the two content cards */
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4 {
          background-color: #c6c8ca !important;
          color: #111827; /* ensure readable dark text on light bg */
          border-color: #9ca3af; /* clearer edge */
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:hover,
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:active,
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:focus,
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:focus-visible,
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:focus-within {
          background-color: #c6c8ca !important; /* keep same bg across states */
          border-color: #89919a;
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
        }

        /* Light mode: override first content card (Share this page) to #9ea7a8 */
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:first-of-type {
          background-color: #9ea7a8 !important;
          color: #111827; /* readable text */
          border-color: #8b9496;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:first-of-type:hover,
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:first-of-type:active,
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:first-of-type:focus,
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:first-of-type:focus-visible,
        :where(html:not(.dark)) :where([aria-label="Calculator content"]) .rounded-2xl.p-4:first-of-type:focus-within {
          background-color: #9ea7a8 !important; /* keep same bg across states */
          border-color: #7e888a;
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
        }

        /* Light mode: Share & Suggestion boxes inside .skn-eqgrid */
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:hover,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:active,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:focus,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:focus-visible,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:focus-within {
          background-color: #9ea7a8 !important;
          color: #111827;
          border-color: #8b9496;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }

        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:hover,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:active,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:focus,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:focus-visible,
        :where(html:not(.dark)) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:focus-within {
          background-color: #c6c8ca !important;
          color: #111827;
          border-color: #89919a;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }

        /* Dark mode: Share & Suggestion boxes use #18202b across states */
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:hover,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:active,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:focus,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:focus-visible,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:first-of-type) .rounded-2xl.p-4:focus-within {
          background-color: #18202b !important;
          color: #e5e7eb;
          border-color: #0f1924;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
        }

        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:hover,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:active,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:focus,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:focus-visible,
        :where(html.dark) :where(.skn-eqgrid) :where(.skn-eqcard:nth-of-type(2)) .rounded-2xl.p-4:focus-within {
          background-color: #18202b !important;
          color: #e5e7eb;
          border-color: #0f1924;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
        }

        /* Typography: enforce <p> color per theme within this layout */
        :where(html:not(.dark)) :where(.skn-no-overflow) p {
          color: #000000 !important;
        }
        :where(html.dark) :where(.skn-no-overflow) p {
          color: #ffffff !important;
        }
      `}
    </style>

      {jsonLd ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      {/* Root grid alinhado e ancorado à esquerda */}
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
            <section className="col-span-12 lg:col-span-7 pl-4 sm:pl-6" aria-label="Calculator content">
              {editorial}
            </section>

            <aside
              aria-label="Calculator widget"
              className="col-span-12 lg:col-span-5 lg:sticky lg:self-start justify-self-start"
              style={{ top: stickyTopPx, maxWidth: 420, width: "100%" }}
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
              <div className="skn-eqcard h-full"><ShareThisPageBox /></div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="skn-eqcard h-full"><SuggestionBox /></div>
            </div>
          </div>
        </section>

        {/* RIGHT RAIL (3 col) */}
        <aside className="col-span-12 mt-8 lg:col-span-3 lg:mt-0 pr-4 sm:pr-6 skn-no-overflow" aria-label="Right rail">
          {railRight}
        </aside>
      </div>
    </div>
  );
}

