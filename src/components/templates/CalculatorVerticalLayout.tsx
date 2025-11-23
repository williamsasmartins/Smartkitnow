import { ReactNode } from "react";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
import LegalDisclaimer from "@/components/LegalDisclaimer";

type Props = {
  title: string;
  description?: string;
  editorial: ReactNode;
  widget: ReactNode;
  railRight?: ReactNode | null;
  showTitle?: boolean;
  maxWidth?: number;
  gap?: number;
  jsonLd?: object | object[];
};

export default function CalculatorVerticalLayout({
  title,
  description,
  editorial,
  widget,
  railRight = null,
  showTitle = true,
  maxWidth = 768,
  gap = 32,
  jsonLd,
}: Props) {
  return (
    <div className="w-full">
      <style>{`
        /* Visual redesign: consistent card styling */
        .skn-vertical-layout .skn-card {
          background-color: rgba(255, 255, 255, 0.92);
          border-color: #e5e7eb;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.06), 0 1px 1px rgb(0 0 0 / 0.04);
          color: #111827;
          transition: background-color 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
        }

        :where(html.dark) .skn-vertical-layout .skn-card {
          background-color: rgba(31, 41, 55, 0.88);
          border-color: #111827;
          color: #f9fafb;
        }

        .skn-vertical-layout .skn-card:hover {
          background-color: rgba(248, 250, 252, 0.96);
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.08), 0 1px 2px rgb(0 0 0 / 0.06);
          border-color: #d1d5db;
        }

        :where(html.dark) .skn-vertical-layout .skn-card:hover {
          background-color: rgba(31, 41, 55, 0.95);
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.35);
          border-color: #1f2937;
        }

        /* Light mode: content cards #c6c8ca */
        :where(html:not(.dark)) .skn-vertical-layout .skn-content-card {
          background-color: #c6c8ca !important;
          color: #111827;
          border-color: #9ca3af;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }

        :where(html:not(.dark)) .skn-vertical-layout .skn-content-card:hover {
          background-color: #c6c8ca !important;
          border-color: #89919a;
          box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
        }

        /* Light mode: Share box #9ea7a8 */
        :where(html:not(.dark)) .skn-vertical-layout .skn-share-card {
          background-color: #9ea7a8 !important;
          color: #111827;
          border-color: #8b9496;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }

        /* Light mode: Suggestion box #c6c8ca */
        :where(html:not(.dark)) .skn-vertical-layout .skn-suggestion-card {
          background-color: #c6c8ca !important;
          color: #111827;
          border-color: #89919a;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
        }

        /* Dark mode: Share & Suggestion boxes #18202b */
        :where(html.dark) .skn-vertical-layout .skn-share-card,
        :where(html.dark) .skn-vertical-layout .skn-suggestion-card {
          background-color: #18202b !important;
          color: #e5e7eb;
          border-color: #0f1924;
          box-shadow: 0 1px 2px rgb(0 0 0 / 0.35);
        }

        /* Calculator widget: blue border #5c82ee, no shadow */
        .skn-vertical-layout .skn-widget-card {
          box-shadow: none !important;
          border-color: #5c82ee !important;
        }

        .skn-vertical-layout .skn-widget-card:hover,
        .skn-vertical-layout .skn-widget-card:active,
        .skn-vertical-layout .skn-widget-card:focus {
          box-shadow: none !important;
          border-color: #5c82ee !important;
        }

        :where(html:not(.dark)) .skn-vertical-layout .skn-widget-card {
          background-color: rgba(255, 255, 255, 0.92) !important;
        }

        :where(html.dark) .skn-vertical-layout .skn-widget-card {
          background-color: rgba(31, 41, 55, 0.88) !important;
        }

        /* Typography: enforce <p> color per theme */
        :where(html:not(.dark)) .skn-vertical-layout p {
          color: #000000 !important;
        }

        :where(html.dark) .skn-vertical-layout p {
          color: #ffffff !important;
        }

        /* CRITICAL: Prevent content overflow */
        .skn-vertical-layout .skn-content-wrapper {
          max-width: 100%;
          overflow-wrap: break-word;
          word-wrap: break-word;
          word-break: break-word;
        }

        .skn-vertical-layout .prose {
          max-width: 100% !important;
        }

        .skn-vertical-layout .prose * {
          max-width: 100%;
        }

        /* Sidebar sticky */
        @media (min-width: 1024px) {
          .skn-sidebar-sticky {
            position: sticky;
            top: 100px;
          }
        }
      `}</style>

      {jsonLd ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      <div className="skn-vertical-layout">
        {/* TOP BANNER AD - 728x90 - CENTRALIZADO */}
        <div className="w-full pt-24 pb-6">
          <div 
            className="mx-auto"
            style={{
              maxWidth: 728,
              height: 90,
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              fontSize: "0.75rem",
            }}
          >
            ADSENSE - 728×90 (Top Banner)
          </div>
        </div>

        {/* LAYOUT: Conteúdo (768px) + Sidebar (300px) */}
        <div className="w-full max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* CONTEÚDO PRINCIPAL - 768px (max-w-3xl) */}
            <div className="w-full lg:w-auto" style={{ maxWidth: 768 }}>
              
              {/* TÍTULO + DESCRIÇÃO SEO */}
              {showTitle && (
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-3" style={{ color: "#5c82ee" }}>
                    {title}
                  </h1>
                  {description && (
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              )}

              {/* WIDGET DA CALCULADORA */}
              <section 
                className="mb-6"
                aria-label="Calculator widget"
              >
                <div className="skn-widget-card rounded-2xl border p-4">
                  {widget}
                </div>
              </section>

              {/* CONTEÚDO EDITORIAL */}
              <section 
                className="mb-6"
                aria-label="Calculator content"
              >
                <div className="skn-content-card rounded-2xl border p-6">
                  <div className="skn-content-wrapper">
                    {editorial}
                  </div>
                </div>
              </section>

              {/* LEGAL DISCLAIMER */}
              <div className="mb-6" role="note" aria-label="Important notice">
                <LegalDisclaimer
                  kind="financial"
                  locale="en"
                  note="Smart Kit Now is not responsible for actions taken based on these estimates."
                  className="rounded-2xl border border-gray-200 bg-white/5 p-4 dark:border-gray-800"
                />
              </div>

              {/* SHARE & SUGGESTION - GRID 2 COLUNAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* SHARE BOX */}
                <div className="skn-share-card rounded-2xl border p-4">
                  <ShareThisPageBox />
                </div>

                {/* SUGGESTION BOX */}
                <div className="skn-suggestion-card rounded-2xl border p-4">
                  <SuggestionBox />
                </div>
              </div>

              {/* RIGHT RAIL CONTENT (if provided) */}
              {railRight && (
                <aside 
                  className="mb-6"
                  aria-label="Additional content"
                >
                  {railRight}
                </aside>
              )}

            </div>

            {/* SIDEBAR DIREITA - 300px (hidden no mobile, visible no desktop) */}
            <aside className="hidden lg:block w-[300px] flex-shrink-0">
              <div className="skn-sidebar-sticky">
                {/* SIDEBAR AD - 300x600 (sticky quando aprovado) */}
                <div
                  style={{
                    width: 300,
                    height: 600,
                    borderRadius: 12,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    textAlign: "center",
                    padding: 16,
                  }}
                >
                  <div>ADSENSE - 300×600</div>
                  <div className="mt-2">(Sticky Sidebar)</div>
                  <div className="mt-1">Will be sticky when approved</div>
                </div>
              </div>
            </aside>

          </div>
        </div>

        {/* BOTTOM AD - 728x90 - CENTRALIZADO - ANTES DO RODAPÉ */}
        <div className="w-full py-10">
          <div 
            className="mx-auto"
            style={{
              maxWidth: 728,
              height: 90,
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              fontSize: "0.75rem",
            }}
          >
            ADSENSE - 728×90 (Bottom - Before Footer)
          </div>
        </div>

      </div>
    </div>
  );
}
