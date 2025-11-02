import React, { useState } from "react";
import CalculatorLayoutStrict from "@/components/templates/CalculatorLayoutStrict";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";
export default function CreditCardInterestCalculator() {
  // Demo state — substitua por seus campos reais
  const [balance, setBalance] = useState<number | "">("");
  const [apr, setApr] = useState<number | "">("");
  const [days, setDays] = useState<number | "">("");
  const [result, setResult] = useState<number | null>(null);

  function onCalculate() {
    // EXEMPLO: interesse simples diário (substitua pela sua lógica real)
    if (typeof balance === "number" && typeof apr === "number" && typeof days === "number") {
      const dailyRate = apr / 100 / 365;
      setResult(balance * dailyRate * days);
    } else {
      setResult(null);
    }
  }
  function onReset() {
    setBalance("");
    setApr("");
    setDays("");
    setResult(null);
  }

  return (
    <CalculatorLayoutStrict
      title="Credit Card Interest Calculator"
      editorial={
        <>
          {/* INTRO */}
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            {/* O agente preencherá: resumo do que a calculadora faz e limitações. */}
          </p>

          {/* HOW TO USE */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold">How to use this calculator</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-gray-700 dark:text-gray-300">
              <li>Enter your current balance, APR, and number of days.</li>
              <li>Click <strong>Calculate</strong> to estimate accrued interest.</li>
              <li>Adjust values to test different scenarios.</li>
            </ol>
          </section>

          {/* FORMULA */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold">Formula</h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Daily interest ≈ <em>Balance × (APR / 365) × Days</em>. This is a simplified estimate; real issuers may use daily compounding and different billing cycles.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg border border-gray-200 bg-white p-3 text-sm dark:border-gray-800 dark:bg-gray-900">
              <code>{`/* interest = balance * (apr/100/365) * days */`}</code>
            </pre>
            <p className="mt-2 text-xs text-gray-500">
              <Info className="mr-1 inline h-4 w-4" />
              Issuers may compound daily and apply minimum finance charges or grace periods.
            </p>
          </section>

          {/* EXAMPLES */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold">Examples</h2>
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
                    <td className="py-2">$1,000, 20% APR, 30 days</td>
                    <td className="py-2">≈ $16.44</td>
                  </tr>
                  <tr>
                    <td className="py-2">Example 2</td>
                    <td className="py-2">$2,500, 18% APR, 20 days</td>
                    <td className="py-2">≈ $24.66</td>
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
                <h3 className="font-medium">Is this exact?</h3>
                <p className="text-gray-700 dark:text-gray-300">No. It’s an estimate. Issuers often compound daily and may have fees or grace periods.</p>
              </div>
              <div>
                <h3 className="font-medium">How do I lower interest?</h3>
                <p className="text-gray-700 dark:text-gray-300">Pay more than the minimum, make mid-cycle payments, or consider a lower APR balance transfer.</p>
              </div>
            </div>
          </section>

          {/* REFERENCES */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold">References</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
              <li>Cardholder agreements and issuer documentation.</li>
              <li>Consumer financial education resources.</li>
            </ul>
          </section>

          {/* RELATED */}
          <section className="mt-8">
            <h2 className="text-xl font-semibold">Related tools</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><a className="underline" href="/financial/credit-card-payoff">Credit Card Payoff</a></li>
              <li><a className="underline" href="/financial/apr">APR Calculator</a></li>
            </ul>
          </section>

          {/* DISCLAIMER + BOXES */}
          <LegalDisclaimer
            kind="financial"
            locale="en"
            note="Smart Kit Now is not responsible for actions taken based on these estimates."
            className="mt-10"
          />
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ShareThisPageBox />
            <SuggestionBox />
          </div>
        </>
      }
      widget={
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-3">
            <label className="block text-sm font-medium">Balance ($)</label>
            <input
              type="number"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-950"
              value={balance}
              onChange={(e) => setBalance(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <label className="block text-sm font-medium">APR (%)</label>
            <input
              type="number"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-950"
              value={apr}
              onChange={(e) => setApr(e.target.value === "" ? "" : Number(e.target.value))}
            />
            <label className="block text-sm font-medium">Days</label>
            <input
              type="number"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-950"
              value={days}
              onChange={(e) => setDays(e.target.value === "" ? "" : Number(e.target.value))}
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
              {result === null ? "—" : `$${result.toFixed(2)}`}
            </p>
          </div>
        </div>
      }
      adSlot={
        <div>
          <p className="font-medium mb-2">Sponsored</p>
          {/* Depois: insira o <ins> do AdSense aqui */}
          <div style={{ background: '#e5e7eb', height: '250px', borderRadius: '8px' }} />
        </div>
      }
    />
  );
}