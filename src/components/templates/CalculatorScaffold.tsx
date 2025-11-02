import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";

/**
 * CalculatorScaffold v3 — aligned with /financial page:
 * - Outer 12-col grid with SAME max-width and gap as category pages.
 * - Main (col-span-9) + Right rail (col-span-3).
 * - Inside Main: inner 12-col grid -> Editorial (7) + Sticky Widget (5).
 * - Only the widget is sticky; editorial and right rail scroll normally.
 */
export default function CalculatorScaffold({
  title,
  category = "financial",
  locale = "en",
  stickyTopPx = 112, // adjust to your header height (try 104–128)
  showTitle = true, // set false if CalculatorPage renders H1
  maxWidth = 1200, // match your /financial container
  useGap = 6, // 6 => gap-6 (24px). Match your category page gap.
  boundarySafePx = 0, // encostar exatamente na borda direita da coluna
  refMarginX = 0,
}: {
  title: string;
  category?: "financial" | "health" | "construction" | "generic";
  locale?: "en" | "pt" | "es";
  stickyTopPx?: number;
  showTitle?: boolean;
  maxWidth?: number;
  useGap?: 4 | 6 | 8;
  boundarySafePx?: number;
  refMarginX?: number;
}) {
  // demo state — agent will replace with real inputs & logic
  const [inputA, setInputA] = useState<number | "">("");
  const [result, setResult] = useState<number | null>(null);

  function onCalculate() {
    const value = typeof inputA === "number" ? inputA * 2 : null;
    setResult(value);
  }
  function onReset() {
    setInputA("");
    setResult(null);
  }

  const gapClass = useGap === 8 ? "lg:gap-8" : useGap === 4 ? "lg:gap-4" : "lg:gap-6";

  return (
    <>
      <style>{`
        :root {
          --ref-margin-x: 0px; /* por padrão sem margem para encostar na linha */
          --box-gap: 24px;      /* S pixels: gap between boxes */
          --disclaimer-fs: 14px;/* Y pixels: disclaimer font size */
          --disclaimer-lh: 22px;/* Z pixels: disclaimer line height */
        }
        .editorial-wrap { position: relative; }
        .editorial-inner { max-width: 100%; padding-right: var(--ref-margin-x); box-sizing: border-box; }
        /* Dev guides removed per request */
        .editorial-inner [role="note"] { width: 100%; max-width: 100%; }
        .editorial-inner [role="note"] p { font-size: var(--disclaimer-fs); line-height: var(--disclaimer-lh); }
        .dev-box-grid { display: grid; grid-template-columns: 1fr; gap: var(--box-gap); }
        @media (min-width: 1025px) { .dev-box-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
      <div
      className={`calculator-safe-zone mx-auto px-4 pb-10 pt-24 ${gapClass} lg:grid lg:grid-cols-12`}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      {/* MAIN (9 cols) — aligns with the left side of /financial */}
      <div
        className="lg:col-span-9 min-w-0"
        style={{ paddingRight: `${boundarySafePx}px` }}
      >
        {/* Inner grid: Editorial (7) + Widget (5) */}
        <div className={`md:grid md:grid-cols-12 ${gapClass}`}>
          {/* EDITORIAL (7 cols) — scrolls normally */}
          <article className="md:col-span-7 min-w-0 editorial-wrap">
            {/* Visual dev guides removed */}
            <div className="editorial-inner" style={{ ['--ref-margin-x' as any]: `${refMarginX}px` }}>
            {showTitle && <h1 className="text-3xl font-bold text-[#5c82ee]">{title}</h1>}

            {/* INTRO */}
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              {/* Agent fills: concise intro explaining purpose, audience, and key points. */}
            </p>

            {/* HOW TO USE */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold">How to use this calculator</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-700 dark:text-gray-300">
                <li>Step 1: …</li>
                <li>Step 2: …</li>
                <li>Step 3: …</li>
              </ol>
            </section>

            {/* FORMULA */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Formula</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {/* Define variables and assumptions (APR vs nominal, compounding, etc.). */}
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-800 dark:bg-gray-900">
                <code>{`/* e.g., Payment = P · r / (1 - (1 + r)^-n) */`}</code>
              </pre>
              <p className="mt-2 text-xs text-gray-500">
                <Info className="mr-1 inline h-4 w-4" />
                {/* Notes about limitations/edge cases. */}
              </p>
            </section>

            {/* EXAMPLES */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Examples</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {/* 2–3 worked examples with the same units used in the form. */}
              </p>
              <div className="mt-4">
                <table className="w-full table-fixed border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="py-2 text-left font-medium text-gray-600 dark:text-gray-300">Scenario</th>
                      <th className="py-2 text-left font-medium text-gray-600 dark:text-gray-300">Inputs</th>
                      <th className="py-2 text-left font-medium text-gray-600 dark:text-gray-300">Output</th>
                    </tr>
                  </thead>
                  <tbody className="[&>tr:nth-child(even)]:bg-gray-50/40 dark:[&>tr:nth-child(even)]:bg-gray-800/20">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2">Example 1</td>
                      <td className="py-2">…</td>
                      <td className="py-2">…</td>
                    </tr>
                    <tr>
                      <td className="py-2">Example 2</td>
                      <td className="py-2">…</td>
                      <td className="py-2">…</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold">FAQ</h2>
              <div className="mt-3 space-y-4">
                <div>
                  <h3 className="font-medium">Question A?</h3>
                  <p className="text-gray-700 dark:text-gray-300">Answer…</p>
                </div>
                <div>
                  <h3 className="font-medium">Question B?</h3>
                  <p className="text-gray-700 dark:text-gray-300">Answer…</p>
                </div>
              </div>
            </section>

            {/* REFERENCES */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold">References</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
                <li>Source 1 …</li>
                <li>Source 2 …</li>
              </ul>
            </section>

            {/* RELATED */}
            <section className="mt-8">
              <h2 className="text-xl font-semibold">Related tools</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li><a className="underline" href="/financial/mortgage-amortization">Mortgage Amortization</a></li>
                <li><a className="underline" href="/financial/loan-comparison">Loan Comparison</a></li>
              </ul>
            </section>

            {/* DISCLAIMER + ENGAGEMENT BOXES */}
            <LegalDisclaimer
              kind={category}
              locale={locale}
              note="Smart Kit Now is not responsible for actions taken based on these estimates."
              className="mt-10"
            />
            <div className="mt-6 dev-box-grid">
              <div className="w-full max-w-full h-full overflow-hidden">
                <ShareThisPageBox />
              </div>
              <div className="w-full max-w-full h-full overflow-hidden">
                <SuggestionBox />
              </div>
            </div>
            </div>
          </article>

          {/* WIDGET (5 cols) — the only sticky piece */}
          <aside className="mt-8 lg:mt-0 md:col-span-5 min-w-0" aria-label="Calculator widget">
            <div className="sticky" style={{ top: `${stickyTopPx}px` }}>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 w-full max-w-full overflow-hidden">
                {/* FORM — agent will replace */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Input A</label>
                  <input
                    type="number"
                    className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-950"
                    value={inputA}
                    onChange={(e) => setInputA(e.target.value === "" ? "" : Number(e.target.value))}
                  />
                  <div className="flex items-center gap-2">
                    <Button variant="calculate" onClick={onCalculate}>Calculate</Button>
                    <Button variant="reset" type="button" onClick={onReset}>Reset</Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="text-sm font-semibold">Result</h3>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">
                    {result === null ? "—" : result}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* RIGHT RAIL (3 cols) — scrolls normally (no sticky) */}
      <aside className="mt-8 lg:mt-0 lg:col-span-3 min-w-0" aria-label="Right rail">
        {/* Optional: ad placeholders here */}
      </aside>
    </div>
    </>
  );
}
