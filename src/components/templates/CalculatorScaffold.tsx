import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";

/**
 * CalculatorScaffold
 * - Left column: full editorial content (intro, how to use, formula, examples, table, FAQ, references, internal links, disclaimer)
 * - Center/right column: sticky calculator widget (form + results + optional quick table)
 * - This is a skeleton the agent will FILL with content when generating each calculator.
 */
export default function CalculatorScaffold({
  title,
  category = "financial",
  locale = "en",
  showTitle = true,
  showTopBannerSpacer = false,
  stickyTopPx = 96,
}: {
  title: string;
  category?: "financial" | "health" | "construction" | "generic";
  locale?: "en" | "pt" | "es";
  showTitle?: boolean;
  showTopBannerSpacer?: boolean;
  stickyTopPx?: number;
}) {
  // Demo state just to compile; the agent will replace these with real fields and formulas
  const [inputA, setInputA] = useState<number | "">("");
  const [result, setResult] = useState<number | null>(null);

  function onCalculate() {
    // Replace with real formula
    const value = typeof inputA === "number" ? inputA * 2 : null;
    setResult(value);
  }

  function onReset() {
    setInputA("");
    setResult(null);
  }

  return (
    <>
      <div
        className="mx-auto max-w-[1200px] px-4 pb-10 pt-24 lg:pt-[120px] lg:grid lg:grid-cols-12 lg:gap-8"
      >
        {/* MAIN AREA (9 cols) */}
        <div className="lg:col-span-9">
          {/* INNER GRID: Editorial (7) + Sticky Widget (5) */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* EDITORIAL — (7 cols) */}
            <article className="lg:col-span-7">
              {showTitle && (
                <h1 className="text-3xl font-bold text-[#5c82ee]">{title}</h1>
              )}
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {/* INTRO: The agent will generate 2–3 paragraphs explaining what the calculator does, who it’s for, and key takeaways. */}
              </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">How to use this calculator</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-700 dark:text-gray-300">
            <li>Step 1: …</li>
            <li>Step 2: …</li>
            <li>Step 3: …</li>
          </ol>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Formula</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {/* Show the equation, define variables, note assumptions (APR vs nominal, compounding, etc.). */}
          </p>
          <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-800 dark:bg-gray-900">
            <code>/* e.g., Payment = P · r / (1 - (1 + r)^-n) */</code>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            <Info className="mr-1 inline h-4 w-4" />
            {/* Add disclaimers about simplifications/edge cases here. */}
          </p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Examples</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {/* Provide 2–3 numeric examples with worked calculations and the same units used in the form. */}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="py-2 text-left">Scenario</th>
                  <th className="py-2 text-left">Inputs</th>
                  <th className="py-2 text-left">Output</th>
                </tr>
              </thead>
              <tbody>
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

        <section className="mt-8">
          <h2 className="text-xl font-semibold">References</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
            <li>Source 1 …</li>
            <li>Source 2 …</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Related tools</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li><a className="underline" href="/financial/mortgage-amortization">Mortgage Amortization</a></li>
            <li><a className="underline" href="/financial/loan-comparison">Loan Comparison</a></li>
          </ul>
        </section>

              {/* DISCLAIMER — always before Share / Suggestion */}
              <LegalDisclaimer
                kind={category}
                locale={locale}
                note="Smart Kit Now is not responsible for actions taken based on these estimates."
                className="mt-10"
              />
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ShareThisPageBox />
                <SuggestionBox />
              </div>
            </article>

            {/* STICKY WIDGET — (5 cols) visually centered within the main area */}
            <aside className="mt-8 lg:mt-0 lg:col-span-5" aria-label="Calculator widget">
              <div className="sticky" style={{ top: `${stickyTopPx}px` }}>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  {/* FORM (agent will replace) */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium">Input A</label>
                    <input
                      type="number"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-950"
                      value={inputA}
                      onChange={(e) => setInputA(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                    <div className="flex items-center gap-2">
                      <Button variant="calculate" onClick={onCalculate}>Calculate</Button>
                      <Button variant="reset" type="button" onClick={onReset}>Reset</Button>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* RESULTS */}
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

        {/* RIGHT RAIL (3 cols) — keep empty or mount your ad placeholders here */}
        <aside className="mt-8 lg:mt-0 lg:col-span-3" aria-label="Right rail">
          {/* Example placeholders (comment out if you don't want visible boxes yet)
          <div className="sticky" style={{ top: `${stickyTopPx}px` }}>
            <div className="mb-6 h-[600px] rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900/40" />
            <div className="h-[250px] rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900/40" />
          </div>
          */}
        </aside>
      </div>
    </>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Info } from "lucide-react";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";

/**
 * CalculatorScaffold v3 — aligned with /financial page:
 * - Outer 12-col grid with the SAME gap/max-width used in category pages.
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
  maxWidth = 1200, // keep consistent with your /financial container
  useGap = 6, // 6 => gap-6 (24px). Match your category page gap.
}: {
  title: string;
  category?: "financial" | "health" | "construction" | "generic";
  locale?: "en" | "pt" | "es";
  stickyTopPx?: number;
  showTitle?: boolean;
  maxWidth?: number;
  useGap?: 4 | 6 | 8;
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

  // map numeric gap to class
  const gapClass = useGap === 8 ? "lg:gap-8" : useGap === 4 ? "lg:gap-4" : "lg:gap-6";

  return (
    <div
      className={`mx-auto px-4 pb-10 pt-24 ${gapClass} lg:grid lg:grid-cols-12`}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      {/* MAIN (9 cols) — matches left side of /financial */}
      <div className="lg:col-span-9">
        {/* Inner grid: Editorial (7) + Widget (5) with the SAME gap as category pages */}
        <div className={`lg:grid lg:grid-cols-12 ${gapClass}`}>
          {/* EDITORIAL (7 cols) — scrolls normally */}
          <article className="lg:col-span-7">
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
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
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
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <ShareThisPageBox />
              <SuggestionBox />
            </div>
          </article>

          {/* WIDGET (5 cols) — the only sticky piece */}
          <aside className="mt-8 lg:mt-0 lg:col-span-5" aria-label="Calculator widget">
            <div className="sticky" style={{ top: `${stickyTopPx}px` }}>
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                {/* FORM — agent will replace */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium">Input A</label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-950"
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
      <aside className="mt-8 lg:mt-0 lg:col-span-3" aria-label="Right rail">
        {/* Keep empty or put ad placeholders; DO NOT make it sticky if you want it to scroll */}
        {/* <div className="mb-6 h-[600px] rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900/40" /> */}
        {/* <div className="h-[250px] rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900/40" /> */}
      </aside>
    </div>
  );
}