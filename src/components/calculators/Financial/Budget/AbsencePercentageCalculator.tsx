import React, { useMemo, useState } from "react";

export default function AbsencePercentageCalculator() {
  const [mode, setMode] = useState<"days" | "hours">("days");
  const [total, setTotal] = useState<string>("22");
  const [absent, setAbsent] = useState<string>("2");
  const [decimals, setDecimals] = useState<string>("2");

  const parsed = useMemo(() => {
    const t = Number(total);
    const a = Number(absent);
    const d = Math.max(0, Math.min(6, Math.floor(Number(decimals)) || 0));
    if (![t, a].every((x) => isFinite(x) && x >= 0)) return null;
    if (t === 0) return { t, a, d };
    return { t, a: Math.min(a, t), d };
  }, [total, absent, decimals]);

  const result = useMemo(() => {
    if (!parsed) return null;
    const { t, a, d } = parsed;
    const absencePct = t > 0 ? (a / t) * 100 : 0;
    const presencePct = 100 - absencePct;
    const formatter = (x: number) => x.toFixed(d);
    return {
      absencePct: formatter(absencePct),
      presencePct: formatter(presencePct),
      absentCount: a,
      totalCount: t,
    };
  }, [parsed]);

  return (
    <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">Absence Percentage Calculator</h1>
      <p className="text-sm opacity-80">Category: financial · Subcategory: income-budget-expenses</p>

      <div className="mt-6 p-4 border rounded-xl">
        <h2>Cálculo de ausência por período</h2>
        <p>Estime a porcentagem de ausência em um período usando dias ou horas.</p>

        <div className="mt-4 flex gap-2">
          <button type="button" className={`px-3 py-2 rounded-md border ${mode === "days" ? "bg-gray-100 dark:bg-gray-800" : ""}`} onClick={() => setMode("days")}>Por dias</button>
          <button type="button" className={`px-3 py-2 rounded-md border ${mode === "hours" ? "bg-gray-100 dark:bg-gray-800" : ""}`} onClick={() => setMode("hours")}>Por horas</button>
        </div>

        <form className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Total {mode === "days" ? "de dias" : "de horas"} no período</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Ausências {mode === "days" ? "(dias)" : "(horas)"}</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={absent} onChange={(e) => setAbsent(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Casas decimais</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="numeric" value={decimals} onChange={(e) => setDecimals(e.target.value)} />
          </label>
        </form>

        <div className="mt-4 grid gap-2 text-sm">
          {parsed && result ? (
            <>
              <div><strong>Total:</strong> {result.totalCount}</div>
              <div><strong>Ausente:</strong> {result.absentCount}</div>
              <div><strong>% de ausência:</strong> {result.absencePct}%</div>
              <div><strong>% de presença:</strong> {result.presencePct}%</div>
            </>
          ) : (
            <span className="opacity-70">Informe valores válidos (não negativos).</span>
          )}
        </div>

        <p className="mt-3 text-xs opacity-70">Dica: se a ausência for maior que o total, ela é limitada ao total para evitar porcentagem acima de 100%.</p>
      </div>

      <div className="mt-8">
        <h3>Fórmula</h3>
        <pre><code>absence% = (absent / total) × 100\npresence% = 100 − absence%</code></pre>
        <p>Use dias ou horas conforme seu controle de frequência. A calculadora apenas normaliza os valores.</p>
      </div>
    </div>
  );
}