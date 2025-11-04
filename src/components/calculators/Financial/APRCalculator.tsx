import React, { useMemo, useState } from "react";

function formatCurrency(v: number) {
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function APRCalculator() {
  const [principal, setPrincipal] = useState<string>("25000");
  const [nominalRate, setNominalRate] = useState<string>("7.5"); // % annual
  const [termYears, setTermYears] = useState<string>("5");
  const [fees, setFees] = useState<string>("500"); // prepaid finance charges

  const inputs = useMemo(() => {
    const P = Number(principal);
    const rNomPct = Number(nominalRate);
    const years = Number(termYears);
    const F = Number(fees);
    if (![P, rNomPct, years, F].every((x) => isFinite(x) && x >= 0)) return null;
    const n = Math.round(years * 12);
    const r_m = rNomPct / 100 / 12;
    return { P, rNomPct, years, F, n, r_m };
  }, [principal, nominalRate, termYears, fees]);

  const monthlyPayment = useMemo(() => {
    if (!inputs) return null;
    const { P, n, r_m } = inputs;
    if (n <= 0) return null;
    if (r_m === 0) return P / n;
    return (P * r_m) / (1 - Math.pow(1 + r_m, -n));
  }, [inputs]);

  function pvOfPayments(M: number, i: number, n: number) {
    if (i === 0) return M * n; // zero rate PV
    return M * (1 - Math.pow(1 + i, -n)) / i;
  }

  const aprMonthly = useMemo(() => {
    if (!inputs || monthlyPayment == null) return null;
    const { P, F, n } = inputs;
    const targetPV = P - F; // net amount financed
    if (targetPV <= 0 || n <= 0) return null;
    const M = monthlyPayment;
    // Bisection on i in [0, 1] (0%..100% per month)
    let lo = 0;
    let hi = 1;
    for (let k = 0; k < 60; k++) {
      const mid = (lo + hi) / 2;
      const pv = pvOfPayments(M, mid, n);
      if (pv > targetPV) {
        // rate too low (PV too high) => increase rate
        lo = mid;
      } else {
        hi = mid;
      }
    }
    const i = (lo + hi) / 2;
    if (!isFinite(i) || i < 0) return null;
    return i;
  }, [inputs, monthlyPayment]);

  const summary = useMemo(() => {
    if (!inputs || monthlyPayment == null) return null;
    const { P, F, n, r_m } = inputs;
    const totalPaid = monthlyPayment * n;
    const interestTotal = totalPaid - P;
    const financeCharge = interestTotal + F;
    const aprAnnual = aprMonthly != null ? aprMonthly * 12 : null;
    const aprEffective = aprMonthly != null ? Math.pow(1 + aprMonthly, 12) - 1 : null;
    const earNominal = Math.pow(1 + r_m, 12) - 1;
    return { totalPaid, interestTotal, financeCharge, aprAnnual, aprEffective, earNominal };
  }, [inputs, monthlyPayment, aprMonthly]);

  return (
    <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">APR Calculator</h1>
      <p className="text-sm opacity-80">Category: financial · Subcategory: debt-management-credit</p>

      <div className="mt-6 p-4 border rounded-xl">
        <h2>Taxa anual equivalente (APR) com taxas</h2>
        <p>Calcula a APR efetiva considerando taxas pré‑pagas e pagamentos mensais fixos.</p>

        <form className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Valor do empréstimo (principal)</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Taxa nominal anual (%)</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={nominalRate} onChange={(e) => setNominalRate(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Prazo (anos)</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={termYears} onChange={(e) => setTermYears(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Taxas pré‑pagas (finance charges)</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={fees} onChange={(e) => setFees(e.target.value)} />
          </label>
        </form>

        <div className="mt-4 grid gap-2 text-sm">
          {inputs && monthlyPayment != null ? (
            <>
              <div><strong>Parcela mensal:</strong> {formatCurrency(monthlyPayment)}</div>
              <div><strong>Montante líquido financiado:</strong> {formatCurrency(inputs.P - inputs.F)}</div>
              <div><strong>Total pago:</strong> {formatCurrency((monthlyPayment ?? 0) * (inputs.n ?? 0))}</div>
              <div><strong>Encargos totais (juros + taxas):</strong> {summary ? formatCurrency(summary.financeCharge) : "—"}</div>
              <div><strong>APR anual (com taxas):</strong> {summary?.aprAnnual != null ? `${(summary.aprAnnual * 100).toFixed(2)}%` : "—"}</div>
              <div><strong>APR efetiva (composta, 12x):</strong> {summary?.aprEffective != null ? `${(summary.aprEffective * 100).toFixed(2)}%` : "—"}</div>
              <div><strong>EAR da taxa nominal:</strong> {summary ? `${(summary.earNominal * 100).toFixed(2)}%` : "—"}</div>
            </>
          ) : (
            <span className="opacity-70">Preencha valores válidos para calcular.</span>
          )}
        </div>

        <p className="mt-3 text-xs opacity-70">Observação: APR regulamentar equaciona o valor líquido financiado (principal − taxas pré‑pagas) à soma presente das parcelas. Este cálculo assume pagamentos mensais nível.</p>
      </div>
    </div>
  );
}