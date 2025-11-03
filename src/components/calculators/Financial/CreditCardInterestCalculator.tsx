import { useMemo, useState } from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CreditCardInterestCalculator() {
  const [balance, setBalance] = useState<string>("");
  const [apr, setApr] = useState<string>("");
  const [months, setMonths] = useState<string>("");

  // Cálculo simples: pagamento fixo para quitar em N meses + juros total
  const { payment, totalInterest, totalPaid } = useMemo(() => {
    const B = parseFloat(balance);
    const rAnnual = parseFloat(apr);
    const n = Math.round(parseFloat(months));

    if (!isFinite(B) || !isFinite(rAnnual) || !isFinite(n) || B <= 0 || n <= 0) {
      return { payment: null as number | null, totalInterest: null as number | null, totalPaid: null as number | null };
    }

    const i = (rAnnual || 0) / 100 / 12; // taxa mensal
    if (i === 0) {
      const p0 = B / n;
      return { payment: p0, totalInterest: 0, totalPaid: B };
    }

    const p = (B * i) / (1 - Math.pow(1 + i, -n)); // fórmula de anuidade
    const paid = p * n;
    return { payment: p, totalInterest: paid - B, totalPaid: paid };
  }, [balance, apr, months]);

  return (
    <CalculatorUnifiedLayout
      title="Credit Card Interest Calculator"
      stickyTopPx={120}
      maxWidth={1200}
      gap={32}
      showTopBanner
      editorial={
        <div className="skn-editorial">
          <section>
            <h2 className="text-xl font-semibold mb-2">How to use this calculator</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Enter your current card <strong>balance</strong>.</li>
              <li>Enter the card’s annual interest rate (<strong>APR</strong>).</li>
              <li>Choose how many <strong>months</strong> you plan to pay.</li>
              <li>Click <strong>Calculate</strong> to see monthly payment and total interest.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Formula</h2>
            <pre className="rounded-md bg-black/20 p-3 text-sm overflow-x-auto">
{`payment = B  i / (1 - (1 + i)^(-n))
where:
  B = current balance
  i = monthly interest rate (APR/12)
  n = number of months`}
            </pre>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Example</h2>
            <p className="text-sm">
              For B = $3,000, APR = 22%, n = 18 months: i = 0.22/12. The monthly payment is computed from the annuity formula.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">FAQ</h2>
            <p className="text-sm">
              <strong>What if APR is 0%?</strong> Then payment is just balance / months and total interest is $0.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">References</h2>
            <ul className="list-disc pl-5 text-sm">
              <li>Standard annuity/loan payment formula adapted for revolving credit payoff.</li>
            </ul>
          </section>
        </div>
      }
      widget={
        <div className="rounded-2xl border border-gray-200/20 bg-white/5 p-4 shadow-sm dark:border-gray-800">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                inputMode="decimal"
                placeholder="e.g., 3000"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="apr">APR (%)</Label>
              <Input
                id="apr"
                inputMode="decimal"
                placeholder="e.g., 22"
                value={apr}
                onChange={(e) => setApr(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="months">Months</Label>
              <Input
                id="months"
                inputMode="numeric"
                placeholder="e.g., 18"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="calculate">Calculate</Button>
              <Button
                variant="reset"
                onClick={() => {
                  setBalance("");
                  setApr("");
                  setMonths("");
                }}
              >
                Reset
              </Button>
            </div>

            <div className="mt-3 rounded-lg bg-black/20 p-3 text-sm">
              <div><strong>Monthly payment:</strong> {payment != null ? `$${payment.toFixed(2)}` : "—"}</div>
              <div><strong>Total interest:</strong> {totalInterest != null ? `$${totalInterest.toFixed(2)}` : "—"}</div>
              <div><strong>Total paid:</strong> {totalPaid != null ? `$${totalPaid.toFixed(2)}` : "—"}</div>
            </div>
          </div>
        </div>
      }
      railRight={null} // sem anúncio lateral por enquanto
    />
  );
}

