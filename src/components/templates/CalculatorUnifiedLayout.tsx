import { ReactNode, useEffect, useRef, useState } from "react";
import ShareBox from "@/components/share/ShareBox";
import SuggestBoxInline from "@/components/contact/SuggestBoxInline";
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
      {(() => {
        console.log("[SKN] CalculatorUnifiedLayout LIVE");
        return null;
      })()}

      <style>{`
        .skn-no-overflow { overflow: visible !important; }

        @media (max-width: 767.98px){
          [aria-label="Calculator widget"] {
            position: static !important;
            top: auto !important;
          }
        }

        /* Evita pais com overflow/transform quebrarem o sticky */
        [aria-label="Calculator content"],
        [aria-label="Calculator widget"] {
          overflow: visible !important;
          transform: none !important;
        }

        .skn-fixed-container {
          transition:
            box-shadow 220ms ease,
            border-color 220ms ease,
            background-color 220ms ease,
            transform 220ms ease;
        }

        .skn-fixed-active .rounded-2xl.p-4 {
          border-color: #5c82ee !important;
        }

        .skn-top-bound,
        .skn-bottom-bound {
          height: 0;
          border: 0;
        }
      `}</style>

      {jsonLd ? (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(jsonLd)}
        </script>
      ) : null}

      {/* Root grid centralizado */}
      <div
        className="grid grid-cols-12 pb-10 items-start"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth,
          width: "100%",
          paddingTop: showTopBanner ? 96 : 32,
          columnGap: gap,
          rowGap: gap,
        }}
      >
        {/* MAIN (9 colunas) */}
        <section className="col-span-12 lg:col-span-9 pl-4 sm:pl-6 skn-no-overflow">
          {/* Banner superior opcional */}
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

          {/* Título da calculadora */}
          {showTitle && (
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: "#5c82ee" }}
            >
              {title}
            </h1>
          )}

          {/* GRID INTERNO: editorial + widget + disclaimer + boxes */}
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
            {/* sentinela superior para sticky */}
            <div className="col-span-12 skn-top-bound" aria-hidden />

            {/* Coluna editorial (onde estão as suas linhas de referência) */}
            <section
              className="col-span-12 lg:col-span-7"
              aria-label="Calculator content"
            >
              {editorial}
            </section>

            {/* Coluna do widget (sticky) */}
            <FixedViewportPreserver maxWidth={420} stickyTopPx={stickyTopPx}>
              {widget}
            </FixedViewportPreserver>

            {/* DISCLAIMER — mesma largura da coluna editorial (até a linha amarela) */}
            <div className="col-span-12 lg:col-span-7">
              <LegalDisclaimer
                kind="financial"
                locale="en"
                note="Smart Kit Now is not responsible for actions taken based on these estimates."
                className="w-full max-w-none rounded-2xl border border-gray-200 bg-white/5 p-4 dark:border-gray-800"
              />
            </div>

            {/* BOXES Share + Suggestion — também presos à mesma coluna */}
            <div className="col-span-12 lg:col-span-7">
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <ShareBox />
                <SuggestBoxInline />
              </div>
            </div>

            {/* sentinela inferior para o sticky parar na base das boxes verdes */}
            <div className="col-span-12 skn-bottom-bound" aria-hidden />
          </div>
        </section>

        {/* RIGHT RAIL (3 colunas) */}
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

        {/* Banner inferior 728x90 */}
        <div className="col-span-12 mt-12 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl h-24 flex items-center justify-center text-gray-500 text-xs">
          ADSENSE - 728x90
        </div>
      </div>
    </div>
  );
}

type FixedViewportProps = {
  children: ReactNode;
  maxWidth?: number;
  stickyTopPx?: number;
};

/**
 * FixedViewportPreserver — mantém a calculadora fixa na viewport em telas grandes,
 * e respeita os limites definidos pelas sentinelas .skn-top-bound e .skn-bottom-bound.
 */
function FixedViewportPreserver({
  children,
  maxWidth = 420,
  stickyTopPx = 20,
}: FixedViewportProps) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fixed, setFixed] = useState(false);
  const [metrics, setMetrics] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  }>({
    top: 0,
    left: 0,
    width: maxWidth,
    height: 0,
  });

  useEffect(() => {
    const mm = window.matchMedia("(min-width: 1024px)"); // lg breakpoint
    const enable = mm.matches;

    const unfix = () => setFixed(false);

    const recalc = () => {
      if (!anchorRef.current) return;

      const anchorRect = anchorRef.current.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      const contentHeight = containerRect?.height ?? anchorRect.height;

      const topEl = document.querySelector(".skn-top-bound");
      const bottomEl = document.querySelector(".skn-bottom-bound");

      const topRect = topEl
        ? (topEl as HTMLElement).getBoundingClientRect()
        : null;
      const stopRect = bottomEl
        ? (bottomEl as HTMLElement).getBoundingClientRect()
        : null;

      const margin = 16;
      let minTop = typeof stickyTopPx === "number" ? stickyTopPx : 20;
      if (topRect) {
        minTop = Math.max(minTop, topRect.top + margin);
      }

      let top = minTop;
      if (stopRect) {
        const maxTop = Math.max(0, stopRect.top - contentHeight - margin);

        if (minTop > maxTop) {
          // Sem espaço suficiente: desativa modo fixo
          setFixed(false);
          setMetrics({
            top: 0,
            left: anchorRect.left,
            width: Math.min(anchorRect.width, maxWidth),
            height: contentHeight,
          });
          return;
        }

        top = Math.min(Math.max(minTop, stickyTopPx), maxTop);
      }

      setMetrics({
        top,
        left: anchorRect.left,
        width: Math.min(anchorRect.width, maxWidth),
        height: contentHeight,
      });
      setFixed(true);
    };

    if (enable) {
      requestAnimationFrame(() => recalc());
      window.addEventListener("scroll", recalc, { passive: true });
      window.addEventListener("resize", recalc);
    } else {
      unfix();
    }

    return () => {
      window.removeEventListener("scroll", recalc as any);
      window.removeEventListener("resize", recalc as any);
    };
  }, [maxWidth, stickyTopPx]);

  return (
    <aside
      aria-label="Calculator widget"
      className="col-span-12 lg:col-span-5 justify-self-start"
      style={{ maxWidth, width: "100%" }}
    >
      {/* Placeholder para manter o fluxo quando o widget está fixo */}
      <div
        ref={anchorRef}
        style={{ minHeight: fixed ? Math.max(metrics.height, 0) : "auto" }}
      />

      <div
        className={`skn-fixed-container ${fixed ? "skn-fixed-active" : ""}`}
        ref={containerRef}
        style={
          fixed
            ? {
                position: "fixed",
                top: metrics.top,
                left: metrics.left,
                width: metrics.width,
                zIndex: 30,
              }
            : { position: "static", width: "100%" }
        }
      >
        {children}
      </div>
    </aside>
  );
}
