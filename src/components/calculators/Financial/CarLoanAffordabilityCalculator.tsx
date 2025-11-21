import { useState, useMemo } from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    loanAmount: 20000,
    interestRate: 6.5,
    loanTermYears: 5,
  });

  const results = useMemo(() => {
    const { loanAmount, interestRate, loanTermYears } = inputs;
    if (!isFinite(loanAmount) || !isFinite(interestRate) || !isFinite(loanTermYears) || loanAmount <= 0 || loanTermYears <= 0) {
      return { monthlyPayment: null, totalInterest: null, totalPaid: null };
    }
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTermYears * 12;
    const monthlyPayment = monthlyRate > 0
      ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments))
      : loanAmount / numPayments;
    const totalPaid = monthlyPayment * numPayments;
    const totalInterest = totalPaid - loanAmount;
    return { monthlyPayment, totalInterest, totalPaid };
  }, [inputs]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <CalculatorUnifiedLayout
      title="Car Loan Affordability Calculator"
      stickyTopPx={120}
      maxWidth={1200}
      gap={32}
      showTopBanner
      editorial={
        <div className="skn-editorial">
          <section className="mb-6">
            <p className="text-base leading-relaxed mb-4">
              Are you planning to buy a car but unsure how much you can afford? This car loan affordability calculator helps you determine the maximum car price you should consider based on your income, existing debts, and desired loan terms.
            </p>
            <p className="mb-3">In this calculator and guide, we will explain:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>How to calculate how much car you can afford</li>
              <li>The 20/4/10 rule for car buying</li>
              <li>How to use this calculator effectively</li>
              <li>Hidden costs of car ownership</li>
            </ul>
            <p className="text-base leading-relaxed">
              If you need to calculate monthly payments, try our <a href="/financial/auto-loan-calculator" className="text-blue-600 hover:underline">Auto Loan Calculator</a>.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How much car can I afford?</h2>
            <p className="text-base leading-relaxed mb-4">
              When buying a car, setting a proper budget is crucial. The correct answer is based on precise calculations that take into account your trade-in value, down payment, sales tax, and most importantly, your monthly income and existing debt obligations.
            </p>
            <p className="text-base leading-relaxed mb-4">
              Most financial advisors agree that total debt repayments shouldn't exceed 36% of gross income. For example, if your monthly income is $5,000, your mortgage is $900, and credit cards are $100, you can reasonably spend $450 monthly on a car payment.
            </p>
            <p className="text-base leading-relaxed mb-4">
              Another rule: car value shouldn't exceed 40% of annual income. If you earn $40,000/year, aim for a car under $16,000.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How is affordability calculated?</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Maximum Monthly Payment</h3>
                <pre className="rounded-md bg-black/20 p-3 text-sm overflow-x-auto">
{`Max Payment = (Monthly Income × 0.20) - Existing Debt

Example:
Monthly Income: $5,000
Existing Debt: $500
Max Payment = ($5,000 × 0.20) - $500 = $500`}
                </pre>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Real-world examples</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold mb-2">Example 1: Entry-level buyer</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Monthly income: $3,500</li>
                  <li>Existing debt: $400</li>
                  <li>Down payment: $3,000</li>
                </ul>
                <p className="text-sm">
                  <strong>Result:</strong> Maximum affordable car: ~$15,000. Monthly payment: $300.
                </p>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Frequently asked questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is the 20/4/10 rule?</h3>
                <p className="text-base leading-relaxed">
                  Put down 20%, finance for max 4 years, keep expenses under 10% of income.
                </p>
              </div>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">References and sources</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Consumer Financial Protection Bureau (CFPB) - Auto Loans Guidelines</li>
              <li>Federal Reserve - Consumer Credit Statistics 2024</li>
              <li>American Automobile Association (AAA) - Cost of Vehicle Ownership</li>
            </ul>
          </section>
        </div>
      }
      widget={
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <Input
                id="loanAmount"
                type="number"
                value={inputs.loanAmount}
                onChange={(e) => setInputs(prev => ({ ...prev, loanAmount: parseFloat(e.target.value) || 0 }))}
                placeholder="20000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                value={inputs.interestRate}
                onChange={(e) => setInputs(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
                placeholder="6.5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanTermYears">Loan Term (Years)</Label>
              <Input
                id="loanTermYears"
                type="number"
                value={inputs.loanTermYears}
                onChange={(e) => setInputs(prev => ({ ...prev, loanTermYears: parseFloat(e.target.value) || 0 }))}
                placeholder="5"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="calculate">Calculate</Button>
              <Button variant="reset" onClick={() => setInputs({ loanAmount: 20000, interestRate: 6.5, loanTermYears: 5 })}>Reset</Button>
            </div>
            <div className="space-y-3 pt-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.monthlyPayment)}</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.totalInterest)}</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.totalPaid)}</p>
              </div>
            </div>
          </div>
        </div>
      }
      railRight={null}
    />
  );
}