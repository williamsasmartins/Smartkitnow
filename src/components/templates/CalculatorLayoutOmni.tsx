import { ReactNode } from "react";

export default function CalculatorLayoutOmni({
  title,
  maxWidth = 1200,
  gap = 6,
  stickyTopPx = 112,
  editorial,
  widget,
  railRight = null,
  showTitle = true,
}: {
  title: string;
  maxWidth?: number;
  gap?: 4 | 6 | 8;
  stickyTopPx?: number;
  editorial: ReactNode;
  widget: ReactNode;
  railRight?: ReactNode | null;
  showTitle?: boolean;
}) {
  const gapClass = gap === 8 ? "lg:gap-8" : gap === 4 ? "lg:gap-4" : "lg:gap-6";

  return (
    <div
      className={`calculator-safe-zone mx-auto px-4 pb-10 pt-24 ${gapClass} lg:grid lg:grid-cols-12`}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      {/* MAIN (9 cols) */}
      <div className="lg:col-span-9 min-w-0" style={{ paddingRight: "5px" }}>
        {/* Inner grid: Editorial (7) + Widget (5) */}
        <div className={`md:grid md:grid-cols-12 ${gapClass}`}>
          {/* EDITORIAL (7 cols) */}
          <article className="md:col-span-7 min-w-0">
            {showTitle && <h1 className="text-3xl font-bold text-[#5c82ee]">{title}</h1>}
            {editorial}
          </article>

          {/* WIDGET (5 cols) */}
          <aside className="mt-8 lg:mt-0 md:col-span-5 min-w-0" aria-label="Calculator widget">
            <div className="sticky" style={{ top: `${stickyTopPx}px` }}>
              <div className="w-full max-w-full overflow-hidden">
                {widget}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* RIGHT RAIL (3 cols) */}
      <aside className="mt-8 lg:mt-0 lg:col-span-3 min-w-0" aria-label="Right rail">
        {railRight}
      </aside>
    </div>
  );
}