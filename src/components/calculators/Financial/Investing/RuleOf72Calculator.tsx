import React, { useMemo, useState } from "react";

export default function RuleOf72Calculator() {
  const [mode, setMode] = useState<"years" | "rate">("years");
  const [ratePct, setRatePct] = useState<string>("8");
  const [years, setYears] = useState<string>("9");

  const yearsToDouble = useMemo(() => {
    const r = Number(ratePct);
    if (!isFinite(r) || r <= 0) return null;
    return 72 / r;
  }, [ratePct]);

  const requiredRate = useMemo(() => {
    const y = Number(years);
    if (!isFinite(y) || y <= 0) return null;
    return 72 / y;
  }, [years]);

  return (
    <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">Rule of 72 Calculator</h1>
      <p className="text-sm opacity-80">Category: financial · Subcategory: investments-savings</p>

      <div className="mt-6 p-4 border rounded-xl">
        <h2>Quick Estimator</h2>
        <p>Aproxima tempo ou taxa para duplicar um investimento usando a regra de 72.</p>

        <div className="mt-4 flex gap-2">
          <button type="button" className={`px-3 py-2 rounded-md border ${mode === "years" ? "bg-gray-100 dark:bg-gray-800" : ""}`} onClick={() => setMode("years")}>Calcular anos</button>
          <button type="button" className={`px-3 py-2 rounded-md border ${mode === "rate" ? "bg-gray-100 dark:bg-gray-800" : ""}`} onClick={() => setMode("rate")}>Calcular taxa</button>
        </div>

        {mode === "years" ? (
          <form className="mt-4 grid gap-3">
            <label className="block">
              <span className="text-sm font-medium">Taxa anual (% ao ano)</span>
              <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={ratePct} onChange={(e) => setRatePct(e.target.value)} />
            </label>
            <div className="text-sm">
              {yearsToDouble != null ? (
                <>
                  <strong>Anos para duplicar:</strong> {yearsToDouble.toFixed(2)} anos
                </>
              ) : (
                <span className="opacity-70">Informe uma taxa válida maior que 0.</span>
              )}
            </div>
          </form>
        ) : (
          <form className="mt-4 grid gap-3">
            <label className="block">
              <span className="text-sm font-medium">Anos desejados para duplicar</span>
              <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} />
            </label>
            <div className="text-sm">
              {requiredRate != null ? (
                <>
                  <strong>Taxa anual requerida:</strong> {requiredRate.toFixed(2)}%
                </>
              ) : (
                <span className="opacity-70">Informe anos válidos maiores que 0.</span>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="mt-8">
        <h3>Fórmula</h3>
        <pre><code>years ≈ 72 / rate%\nrate% ≈ 72 / years</code></pre>
        <p>É uma aproximação prática; para precisão, use crescimento composto: FV = PV × (1 + r)^n.</p>
      </div>
    </div>
  );
}