import { useMemo, useState } from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoanPaymentCalculator() {
  const [principal, setPrincipal] = useState<string>("");
  const [apr, setApr] = useState<string>(""); // Annual % rate
  const [years, setYears] = useState<string>("");

  const { monthly, totalInterest, totalPaid } = useMemo(() => {
    const P = parseFloat(principal);
    const r = parseFloat(apr);
    const y = parseFloat(years);
    if (!isFinite(P) || !isFinite(r) || !isFinite(y) || P <= 0 || y <= 0) {
      return { monthly: null as number | null, totalInterest: null as number | null, totalPaid: null as number | null };
    }
    const n = Math.round(y * 12);
    const i = (r || 0) / 100 / 12;
    if (i === 0) {
      const m = P / n;
      return { monthly: m, totalInterest: 0, totalPaid: P };
    }
    const m = (P * i) / (1 - Math.pow(1 + i, -n));
    const paid = m * n;
    return { monthly: m, totalInterest: paid - P, totalPaid: paid };
  }, [principal, apr, years]);

  return (
    <CalculatorUnifiedLayout
      title="Loan Payment Calculator"
      stickyTopPx={120}
      maxWidth={1200}
      gap={32}
            showTopBanner
      editorial={
        <div className="skn-editorial">
          <section>
            <h2 className="text-xl font-semibold mb-2">How to use this calculator</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Enter the loan <strong>principal</strong> (amount borrowed).</li>
              <li>Enter the annual interest rate (<strong>APR</strong>).</li>
              <li>Enter the <strong>term</strong> in years.</li>
              <li>Click <strong>Calculate</strong> to see the monthly payment.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Formula</h2>
            <pre className="rounded-md bg-black/20 p-3 text-sm overflow-x-auto">
{`Payment = P Â· i / (1 - (1 + i)^(-n))
where:
  P = principal
  i = periodic interest rate (APR/12)
  n = total number of payments (months)`}
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Example</h2>
            <p className="text-sm">
              For P = $20,000, APR = 7%, term = 5 years (60 months): i = 0.07/12. Payment â‰ˆ $396.02.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">FAQ</h2>
            <p className="text-sm"><strong>What if APR is 0%?</strong> We divide the principal evenly across all months.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">References</h2>
            <ul className="list-disc pl-5 text-sm">
              <li>Amortization formula basics (standard annuity payment).</li>
            </ul>
          </section>
        </div>
      }
      widget={
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg transition-all duration-200 dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="principal">Principal</Label>
              <Input
                id="principal"
                inputMode="decimal"
                placeholder="e.g., 20000"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="apr">APR (%)</Label>
              <Input
                id="apr"
                inputMode="decimal"
                placeholder="e.g., 7"
                value={apr}
                onChange={(e) => setApr(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="years">Term (years)</Label>
              <Input
                id="years"
                inputMode="decimal"
                placeholder="e.g., 5"
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                variant="calculate"
                onClick={() => {
                  // apenas forÃ§a re-render; cÃ¡lculo jÃ¡ Ã© reativo via useMemo
                  // mantido por compatibilidade com seu padrÃ£o visual
                }}
              >
                Calculate
              </Button>
              <Button
                variant="reset"
                onClick={() => {
                  setPrincipal("");
                  setApr("");
                  setYears("");
                }}
              >
                Reset
              </Button>
            </div>

            <div className="mt-3 rounded-lg bg-black/20 p-3 text-sm">
              <div><strong>Monthly payment:</strong> {monthly != null ? `$${monthly.toFixed(2)}` : "â€”"}</div>
              <div><strong>Total interest:</strong> {totalInterest != null ? `$${totalInterest.toFixed(2)}` : "â€”"}</div>
              <div><strong>Total paid:</strong> {totalPaid != null ? `$${totalPaid.toFixed(2)}` : "â€”"}</div>
            </div>
          </div>
        </div>
      }
      railRight={null}
    />
  );
}

