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
  showTopBanner?: boolean;
  topBannerHeight?: number;
};

export default function CalculatorVerticalLayout({
  title,
  description,
  editorial,
  widget,
  railRight = null,
  showTitle = true,
  maxWidth = 1200,
  gap = 32,
  jsonLd,
  showTopBanner = true,
  topBannerHeight = 90,
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

        /* Equal height cards */
        .skn-eqgrid { align-items: stretch; }
        .skn-eqcard { display: flex; flex-direction: column; height: 100%; }
        .skn-eqcard > * { height: 100%; }

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

        /* Sticky sidebar */
        .skn-sticky-sidebar {
          position: sticky;
          top: 120px;
          height: fit-content;
        }

        /* Hide sidebar on mobile */
        @media (max-width: 1024px) {
          .skn-sidebar {
            display: none;
          }
        }
      `}</style>

      {jsonLd ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      <div className="skn-vertical-layout">
        {/* CONTAINER PRINCIPAL */}
        <div
          className="mx-auto pb-10"
          style={{
            maxWidth,
            width: '100%',
            paddingTop: showTopBanner ? 96 : 32,
          }}
        >
          {/* TOP BANNER */}
          {showTopBanner && (
            <div
              aria-hidden
              className="mx-4 sm:mx-6"
              style={{
                height: topBannerHeight,
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                marginBottom: 24,
              }}
            />
          )}

          {/* LAYOUT COM SIDEBAR */}
          <div className="mx-4 sm:mx-6">
            <div className="flex gap-8">
              {/* COLUNA PRINCIPAL (Esquerda) */}
              <div className="flex-1 max-w-3xl">
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

                {/* WIDGET NO TOPO */}
                <section className="mb-8" aria-label="Calculator widget">
                  <div className="skn-widget-card rounded-2xl border p-4">
                    {widget}
                  </div>
                </section>

                {/* AD #1 - LOGO APÓS O WIDGET (728x90) */}
                <div className="mb-8">
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl h-24 flex items-center justify-center text-gray-500 text-xs">
                    ADSENSE - 728x90 (After Widget)
                  </div>
                </div>

                {/* CONTEÚDO EDITORIAL */}
                <section className="mb-8" aria-label="Calculator content">
                  <div className="skn-content-card rounded-2xl border p-6">
                    <div className="skn-content-wrapper">
                      {editorial}
                    </div>
                  </div>
                </section>

                {/* LEGAL DISCLAIMER */}
                <div className="mb-4" role="note" aria-label="Important notice">
                  <LegalDisclaimer
                    kind="financial"
                    locale="en"
                    note="Smart Kit Now is not responsible for actions taken based on these estimates."
                    className="rounded-2xl border border-gray-200 bg-white/5 p-4 dark:border-gray-800"
                  />
                </div>

                {/* SHARE & SUGGESTION BOXES */}
                <div className="mb-8">
                  <div className="grid grid-cols-12 gap-4 skn-eqgrid">
                    <div className="col-span-12 md:col-span-6">
                      <div className="skn-eqcard h-full">
                        <div className="skn-share-card rounded-2xl border p-4">
                          <ShareThisPageBox />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="skn-eqcard h-full">
                        <div className="skn-suggestion-card rounded-2xl border p-4">
                          <SuggestionBox />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AD #2 - FINAL DA PÁGINA (728x90) */}
                <div className="mb-8">
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl h-24 flex items-center justify-center text-gray-500 text-xs">
                    ADSENSE - 728x90 (Bottom)
                  </div>
                </div>

                {/* RIGHT RAIL (if provided) */}
                {railRight && (
                  <aside className="mb-8" aria-label="Additional content">
                    {railRight}
                  </aside>
                )}
              </div>

              {/* SIDEBAR DIREITA (Sticky Ad) */}
              <aside className="skn-sidebar hidden lg:block w-80 flex-shrink-0">
                <div className="skn-sticky-sidebar">
                  {/* AD #3 - SIDEBAR STICKY (300x600) */}
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500 text-xs" style={{ width: '300px', height: '600px' }}>
                    <div className="text-center p-4">
                      <div className="font-bold mb-2">ADSENSE - 300x600</div>
                      <div className="text-xs">(Sticky Sidebar)</div>
                      <div className="text-xs mt-2 opacity-70">Placeholder para aprovação</div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
