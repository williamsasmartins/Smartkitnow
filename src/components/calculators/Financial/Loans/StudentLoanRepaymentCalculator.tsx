import React, { useMemo, useState } from "react";

function currency(v: number) {
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function StudentLoanRepaymentCalculator() {
  const [balance, setBalance] = useState<string>("35000");
  const [annualRate, setAnnualRate] = useState<string>("5.8");
  const [termYears, setTermYears] = useState<string>("10");
  const [extra, setExtra] = useState<string>("50");

  const parsed = useMemo(() => {
    const P = Number(balance);
    const rPct = Number(annualRate);
    const years = Number(termYears);
    const extraPay = Number(extra);
    if (![P, rPct, years, extraPay].every((x) => isFinite(x) && x >= 0)) return null;
    const n = Math.round(years * 12);
    const r_m = rPct / 100 / 12;
    return { P, r_m, n, years, extraPay };
  }, [balance, annualRate, termYears, extra]);

  const basePayment = useMemo(() => {
    if (!parsed) return null;
    const { P, r_m, n } = parsed;
    if (n <= 0) return null;
    if (r_m === 0) return P / n;
    return (P * r_m) / (1 - Math.pow(1 + r_m, -n));
  }, [parsed]);

  const amortizationWithExtra = useMemo(() => {
    if (!parsed || basePayment == null) return null;
    const { P, r_m, n, extraPay } = parsed;
    let bal = P;
    let month = 0;
    let interestAcc = 0;
    const payment = basePayment + (extraPay || 0);
    while (bal > 0 && month < n + 600) {
      const interest = bal * r_m;
      const principal = Math.max(0, payment - interest);
      interestAcc += interest;
      bal = bal - principal;
      month++;
      if (payment <= interest + 1e-9) {
        // Extra payment too small to cover interest -> avoid infinite loop
        break;
      }
    }
    const monthsToPayoff = month;
    const totalPaid = Math.min(payment * monthsToPayoff, P + interestAcc);
    return { monthsToPayoff, interestAcc, totalPaid };
  }, [parsed, basePayment]);

  const baselineTotals = useMemo(() => {
    if (!parsed || basePayment == null) return null;
    const { P, n, r_m } = parsed;
    if (r_m === 0) {
      return { months: n, interest: 0, total: P };
    }
    const totalPaid = basePayment * n;
    const interest = totalPaid - P;
    return { months: n, interest, total: totalPaid };
  }, [parsed, basePayment]);

  const savings = useMemo(() => {
    if (!baselineTotals || !amortizationWithExtra) return null;
    const interestSaved = baselineTotals.interest - amortizationWithExtra.interestAcc;
    const timeSavedMonths = baselineTotals.months - amortizationWithExtra.monthsToPayoff;
    return { interestSaved, timeSavedMonths };
  }, [baselineTotals, amortizationWithExtra]);

  return (
    <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">Student Loan Repayment Calculator</h1>
      <p className="text-sm opacity-80">Category: financial · Subcategory: loans-mortgages-payments</p>

      <div className="mt-6 p-4 border rounded-xl">
        <h2>Amortização e pagamento com extra</h2>
        <p>Estime a parcela mensal e quanto tempo/juros você economiza com pagamentos extras.</p>

        <form className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium">Saldo do empréstimo</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={balance} onChange={(e) => setBalance(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Taxa anual de juros (%)</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Prazo (anos)</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={termYears} onChange={(e) => setTermYears(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Pagamento extra mensal</span>
            <input className="mt-1 w-full border rounded-md px-3 py-2" inputMode="decimal" value={extra} onChange={(e) => setExtra(e.target.value)} />
          </label>
        </form>

        <div className="mt-4 grid gap-2 text-sm">
          {parsed && basePayment != null ? (
            <>
              <div><strong>Parcela mensal (sem extra):</strong> {currency(basePayment)}</div>
              {amortizationWithExtra ? (
                <>
                  <div><strong>Meses até quitar (com extra):</strong> {amortizationWithExtra.monthsToPayoff}</div>
                  <div><strong>Juros totais (com extra):</strong> {currency(amortizationWithExtra.interestAcc)}</div>
                </>
              ) : null}
              {baselineTotals ? (
                <>
                  <div><strong>Juros totais (sem extra):</strong> {currency(baselineTotals.interest)}</div>
                </>
              ) : null}
              {savings ? (
                <>
                  <div><strong>Economia de juros:</strong> {currency(Math.max(0, savings.interestSaved))}</div>
                  <div><strong>Tempo economizado:</strong> {Math.max(0, savings.timeSavedMonths)} meses</div>
                </>
              ) : null}
            </>
          ) : (
            <span className="opacity-70">Preencha valores válidos para calcular.</span>
          )}
        </div>

        <p className="mt-3 text-xs opacity-70">Observação: cálculo assume amortização padrão com pagamentos mensais fixos. Programas específicos (IDR, subsídios, capitalização de juros) podem alterar os resultados.</p>
      </div>
    </div>
  );
}