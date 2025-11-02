import React, { useState } from "react";
import CalculatorLayoutLocked from "@/components/templates/CalculatorLayoutLocked";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import ShareThisPageBox from "@/components/ShareThisPageBox";
import SuggestionBox from "@/components/SuggestionBox";

export default function LoanPaymentCalculator() {
  const [p, setP] = useState<number | "">("");

  return (
    <CalculatorLayoutLocked
      title="Loan Payment Calculator"
      stickyTopPx={120}  // igual ou maior que header + barra de busca
      editorial={
        <>
          {/* Conteúdo editorial TODO — SEM overflow */}
          <section className="mt-6">
            <h2 className="text-xl font-semibold">How to use this calculator</h2>
            <ol className="mt-3 list-decimal pl-5 space-y-2">
              <li>…</li><li>…</li><li>…</li>
            </ol>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold">Formula</h2>
            <div className="locked__tableWrap mt-3">
              <pre className="locked__card overflow-x-auto text-sm p-3">
{`/* Payment = P·r / (1 - (1+r)^-n) */`}
              </pre>
            </div>
          </section>

          {/* ... Examples / FAQ / References ... */}

          <LegalDisclaimer
            kind="financial"
            locale="en"
            note="Smart Kit Now is not responsible for actions taken based on these estimates."
            className="mt-10"
          />

          {/* Boxes lado a lado — NUNCA ultrapassam a linha vermelha */}
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="locked__card"><ShareThisPageBox /></div>
            <div className="locked__card"><SuggestionBox /></div>
          </div>
        </>
      }
      widget={
        <div className="locked__card">
          <label className="block text-sm font-medium">Principal</label>
          <input
            type="number"
            value={p}
            onChange={(e) => setP(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          {/* … botões e resultado … */}
        </div>
      }
      railRight={
        // opcional: placeholders de anúncio (rolam junto)
        null
      }
    />
  );
}