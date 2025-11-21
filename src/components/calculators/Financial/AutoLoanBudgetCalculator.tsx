import { useState, useMemo } from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AutoLoanBudgetCalculator() {
  const [inputs, setInputs] = useState({
    monthlyIncome: 5000,
    existingDebt: 500,
    downPayment: 3000,
  });

  const results = useMemo(() => {
    const { monthlyIncome, existingDebt, downPayment } = inputs;
    if (!isFinite(monthlyIncome) || !isFinite(existingDebt) || !isFinite(downPayment) || monthlyIncome <= 0) {
      return { maxPayment: null, maxCarPrice: null };
    }
    const maxPayment = (monthlyIncome * 0.20) - existingDebt;
    const maxCarPrice = (maxPayment * 60) + downPayment; // Assuming a 5-year loan term
    return { maxPayment, maxCarPrice };
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
      title="Auto Loan Budget Calculator"
      stickyTopPx={120}
      maxWidth={1200}
      gap={32}
      showTopBanner
      editorial={
        <div className="skn-editorial">
          <section className="mb-6">
            <p className="text-base leading-relaxed mb-4">
              Are you planning to buy a car but unsure how much you can afford? This Auto Loan Budget Calculator helps you determine your maximum car price based on your income and existing debts.
            </p>
            <p className="mb-3">In this calculator and guide, we will explain:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>How to calculate your auto loan budget</li>
              <li>The 20/4/10 rule for car buying</li>
              <li>How to use this calculator effectively</li>
              <li>Hidden costs of car ownership</li>
            </ul>
            <p className="text-base leading-relaxed">
              If you need to calculate monthly payments, try our <a href="/financial/auto-loan-calculator" className="text-blue-600 hover:underline">Auto Loan Calculator</a> or explore our <a href="/financial/car-affordability-calculator" className="text-blue-600 hover:underline">Car Affordability Calculator</a> for more insights.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How much car can I afford?</h2>
            <p className="text-base leading-relaxed mb-4">
              When buying a car, setting a proper budget is crucial. The correct answer is based on precise calculations that take into account your monthly income, existing debt obligations, and the desired loan terms.
            </p>
            <p className="text-base leading-relaxed mb-4">
              Most financial advisors agree that total debt repayments shouldn't exceed 36% of your gross income. For example, if your monthly income is $5,000, your mortgage is $900, and credit cards are $100, you can reasonably spend $450 monthly on a car payment.
            </p>
            <p className="text-base leading-relaxed mb-4">
              Another rule of thumb: the car value shouldn't exceed 40% of your annual income. If you earn $60,000/year, aim for a car under $24,000.
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
              <div>
                <h3 className="text-lg font-semibold mb-2">Maximum Car Price</h3>
                <pre className="rounded-md bg-black/20 p-3 text-sm overflow-x-auto">
{`Max Car Price = (Max Payment × Loan Term) + Down Payment

Example:
Max Payment: $500
Loan Term: 5 years (60 months)
Down Payment: $3,000
Max Car Price = ($500 × 60) + $3,000 = $33,000`}
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
                  <li>Down payment: $2,000</li>
                </ul>
                <p className="text-sm">
                  <strong>Result:</strong> Maximum affordable car: ~$12,000. Monthly payment: $300.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold mb-2">Example 2: Mid-level buyer</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                  <li>Monthly income: $6,000</li>
                  <li>Existing debt: $800</li>
                  <li>Down payment: $5,000</li>
                </ul>
                <p className="text-sm">
                  <strong>Result:</strong> Maximum affordable car: ~$35,000. Monthly payment: $1,200.
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
                  This rule suggests that you should put down 20%, finance for a maximum of 4 years, and keep total expenses under 10% of your income.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">How do I calculate my monthly payment?</h3>
                <p className="text-base leading-relaxed">
                  Use the formula: Monthly Payment = (Loan Amount × Interest Rate) / (1 - (1 + Interest Rate) ^ -Number of Payments). Make sure to convert the annual interest rate to a monthly rate.
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
              <Label htmlFor="monthlyIncome">Monthly Income</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={inputs.monthlyIncome}
                onChange={(e) => setInputs(prev => ({ ...prev, monthlyIncome: parseFloat(e.target.value) || 0 }))}
                placeholder="5000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="existingDebt">Existing Debt</Label>
              <Input
                id="existingDebt"
                type="number"
                value={inputs.existingDebt}
                onChange={(e) => setInputs(prev => ({ ...prev, existingDebt: parseFloat(e.target.value) || 0 }))}
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment</Label>
              <Input
                id="downPayment"
                type="number"
                value={inputs.downPayment}
                onChange={(e) => setInputs(prev => ({ ...prev, downPayment: parseFloat(e.target.value) || 0 }))}
                placeholder="3000"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="calculate">Calculate</Button>
              <Button variant="reset" onClick={() => setInputs({ monthlyIncome: 5000, existingDebt: 500, downPayment: 3000 })}>Reset</Button>
            </div>
            <div className="space-y-3 pt-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Maximum Monthly Payment</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.maxPayment)}</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Maximum Car Price</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.maxCarPrice)}</p>
              </div>
            </div>
          </div>
        </div>
      }
      railRight={null}
    />
  );
}