import { useState, useMemo } from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    monthlyIncome: 0,
    monthlyDebtPayments: 0,
    interestRate: 0,
    loanTerm: 0,
  });
  
  const results = useMemo(() => {
    const { monthlyIncome, monthlyDebtPayments, interestRate, loanTerm } = inputs;
    const monthlyPaymentCapacity = monthlyIncome * 0.15 - monthlyDebtPayments; // 15% of income minus debts
    const loanAmount = (monthlyPaymentCapacity / (interestRate / 1200)) * (1 - Math.pow(1 + (interestRate / 1200), -loanTerm * 12));
    return { monthlyPaymentCapacity, loanAmount };
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
      editorial={<div className="skn-editorial">
        <section className="mb-6">
          <p className="text-base leading-relaxed mb-4">
            Understanding how much you can afford to spend on a car loan is crucial for your financial health. Many people underestimate the total costs associated with car ownership, leading to financial strain. This calculator helps you determine a realistic car loan amount based on your income and existing debts.
          </p>
          <p className="mb-3">In this calculator and comprehensive guide, we will explain:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>How car loan affordability is calculated</li>
            <li>Key factors influencing your loan amount</li>
            <li>Best practices for managing car loans</li>
            <li>Common mistakes to avoid</li>
            <li>Real-world examples of car loan scenarios</li>
            <li>Frequently asked questions about car loans</li>
          </ul>
          <p className="text-base leading-relaxed">
            If you want to explore other financial calculators, try our <a href="/financial/auto-loan-calculator" className="text-blue-600 hover:underline">Auto Loan Calculator</a>. You can also use our <a href="/financial/loan-compare-calculator" className="text-blue-600 hover:underline">Loan Comparison Calculator</a> to compare different loan options. For budgeting, check out our <a href="/financial/budget-calculator" className="text-blue-600 hover:underline">Budget Calculator</a>.
          </p>
        </section>
      </div>}
      widget={<div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Income</Label>
            <Input
              id="monthlyIncome"
              type="number"
              value={inputs.monthlyIncome}
              onChange={(e) => setInputs(prev => ({ ...prev, monthlyIncome: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 5000"
            />
            <p className="text-xs text-muted-foreground">Your total monthly income before taxes.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyDebtPayments">Monthly Debt Payments</Label>
            <Input
              id="monthlyDebtPayments"
              type="number"
              value={inputs.monthlyDebtPayments}
              onChange={(e) => setInputs(prev => ({ ...prev, monthlyDebtPayments: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 1000"
            />
            <p className="text-xs text-muted-foreground">Total of all monthly debt payments (e.g., credit cards, loans).</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={inputs.interestRate}
              onChange={(e) => setInputs(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 5"
            />
            <p className="text-xs text-muted-foreground">Annual interest rate on the car loan.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term (Years)</Label>
            <Input
              id="loanTerm"
              type="number"
              value={inputs.loanTerm}
              onChange={(e) => setInputs(prev => ({ ...prev, loanTerm: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 5"
            />
            <p className="text-xs text-muted-foreground">Length of the loan in years.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="calculate">Calculate</Button>
            <Button variant="reset" onClick={() => setInputs({ monthlyIncome: 0, monthlyDebtPayments: 0, interestRate: 0, loanTerm: 0 })}>Reset</Button>
          </div>
          <div className="space-y-3 pt-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Monthly Payment Capacity</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(results.monthlyPaymentCapacity)}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(results.loanAmount)}</p>
            </div>
          </div>
        </div>
      </div>}
      railRight={null}
    />
  );
}