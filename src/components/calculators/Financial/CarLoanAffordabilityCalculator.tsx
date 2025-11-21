import { useState, useMemo } from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    monthlyIncome: 0,
    existingDebt: 0,
    loanTerm: 0,
    interestRate: 0,
  });

  const results = useMemo(() => {
    const { monthlyIncome, existingDebt, loanTerm, interestRate } = inputs;
    const maxDebtToIncomeRatio = 0.36; // Recommended maximum DTI ratio
    const disposableIncome = monthlyIncome - existingDebt;
    const maxMonthlyPayment = disposableIncome * maxDebtToIncomeRatio;

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const loanAmount = (maxMonthlyPayment / monthlyInterestRate) * (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    return {
      maxMonthlyPayment,
      loanAmount,
    };
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
              Are you wondering how much car you can afford based on your income and existing debts? Understanding your car loan affordability is crucial to avoid financial strain and ensure you make a sound investment. With rising vehicle prices, knowing your limits can save you from future financial headaches. 
              According to a recent survey, nearly 30% of car buyers regret their purchase due to financial overreach. 
            </p>
            <p className="mb-3">In this calculator and comprehensive guide, we will explain:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>How to determine your maximum car loan amount</li>
              <li>The impact of your income and debts on affordability</li>
              <li>How loan terms and interest rates affect your payments</li>
              <li>Best practices for budgeting for a car loan</li>
              <li>Hidden costs associated with car ownership</li>
              <li>Real-world examples to illustrate different scenarios</li>
            </ul>
            <p className="text-base leading-relaxed">
              If you are considering a new car purchase, try our <a href="/financial/car-loan-calculator" className="text-blue-600 hover:underline">Car Loan Calculator</a>. You can also use our <a href="/financial/auto-insurance-calculator" className="text-blue-600 hover:underline">Auto Insurance Calculator</a> to estimate your insurance costs. For budgeting help, check out our <a href="/financial/car-budget-calculator" className="text-blue-600 hover:underline">Car Budget Calculator</a>.
            </p>
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
                placeholder="e.g., 5000"
              />
              <p className="text-xs text-muted-foreground">Your total monthly income before taxes.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="existingDebt">Existing Monthly Debt Payments</Label>
              <Input
                id="existingDebt"
                type="number"
                value={inputs.existingDebt}
                onChange={(e) => setInputs(prev => ({ ...prev, existingDebt: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g., 1000"
              />
              <p className="text-xs text-muted-foreground">Total of all your monthly debt payments (e.g., rent, credit cards).</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanTerm">Loan Term (in years)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={inputs.loanTerm}
                onChange={(e) => setInputs(prev => ({ ...prev, loanTerm: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g., 5"
              />
              <p className="text-xs text-muted-foreground">Typical loan terms range from 3 to 7 years.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                value={inputs.interestRate}
                onChange={(e) => setInputs(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g., 3.5"
              />
              <p className="text-xs text-muted-foreground">Current average rates range from 2% to 6% depending on credit score.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="calculate">Calculate</Button>
              <Button variant="reset" onClick={() => setInputs({ monthlyIncome: 0, existingDebt: 0, loanTerm: 0, interestRate: 0 })}>Reset</Button>
            </div>
            <div className="space-y-3 pt-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Maximum Monthly Payment</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.maxMonthlyPayment)}</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Estimated Loan Amount</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.loanAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      }
      railRight={null}
    />
  );
}