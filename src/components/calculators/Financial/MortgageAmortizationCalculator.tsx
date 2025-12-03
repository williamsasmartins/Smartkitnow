import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/CalculatorVerticalLayout/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({ principal: "", interestRate: "", termYears: "" });
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const calculations = useMemo(() => {
    const principal = parseFloat(inputs.principal) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const termMonths = parseFloat(inputs.termYears) * 12 || 0;

    if (principal <= 0 || interestRate <= 0 || termMonths <= 0) return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, scheduleData: [] };

    const monthlyPayment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -termMonths));
    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - principal;

    const scheduleData = Array.from({ length: termMonths }, (_, i) => {
      const interestPayment = principal * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      principal -= principalPayment;
      return { month: i + 1, interestPayment, principalPayment, remainingBalance: principal };
    });

    return { monthlyPayment, totalInterest, totalPayment, scheduleData };
  }, [inputs]);

  const handleCalculate = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReset = () => setInputs({ principal: "", interestRate: "", termYears: "" });

  return (
    <CalculatorVerticalLayout
      onThisPage={[
        { label: "How to Calculate", id: "how-to-calculate" },
        { label: "Formula", id: "formula" },
        { label: "Factors", id: "factors" },
        { label: "Types", id: "types" },
        { label: "FAQ", id: "faq" },
      ]}
      formula={{
        formula: "M = P[r(1+r)^n]/[(1+r)^n – 1]",
        variables: [
          { symbol: "M", description: "Monthly mortgage payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "r", description: "Monthly interest rate" },
          { symbol: "n", description: "Number of payments" },
        ],
        title: "Formula for Calculating Mortgage Payment"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $200,000 mortgage with a 5% annual interest rate over 30 years.",
        steps: [
          { label: "Step 1", calculation: "5% annual interest = 0.004167 monthly interest", explanation: "Convert annual rate to monthly" },
          { label: "Step 2", calculation: "30 years = 360 months", explanation: "Convert years to months" },
          { label: "Step 3", calculation: "M = 200,000[0.004167(1+0.004167)^360]/[(1+0.004167)^360 – 1]", explanation: "Apply formula" },
        ],
        result: "The monthly payment is approximately $1,073.64"
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator", url: "/financial/loan-payment", icon: "📊" },
        { title: "Interest Rate Calculator", url: "/financial/interest-rate", icon: "💰" },
        { title: "Savings Calculator", url: "/financial/savings", icon: "🏦" },
        { title: "Retirement Calculator", url: "/financial/retirement", icon: "📈" },
        { title: "Investment Calculator", url: "/financial/investment", icon: "💵" },
        { title: "Debt Payoff Calculator", url: "/financial/debt-payoff", icon: "🔢" },
      ]}
    >
      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Principal Amount
              </Label>
              <Input
                type="number"
                placeholder="e.g., 200000"
                value={inputs.principal}
                onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Annual Interest Rate (%)
              </Label>
              <Input
                type="number"
                placeholder="e.g., 5"
                value={inputs.interestRate}
                onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Loan Term (Years)
              </Label>
              <Input
                type="number"
                placeholder="e.g., 30"
                value={inputs.termYears}
                onChange={(e) => setInputs({ ...inputs, termYears: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={handleCalculate} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700">
            <Calculator className="mr-2 h-4 w-4" /> Calculate
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </Card>

      {calculations.monthlyPayment > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8">
          <h3 className="text-2xl font-bold">Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Payment</p>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {formatCurrency(calculations.monthlyPayment)}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-50" />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Interest Paid</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {formatCurrency(calculations.totalInterest)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Payment</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                    {formatCurrency(calculations.totalPayment)}
                  </p>
                </div>
                <Calculator className="w-8 h-8 text-gray-400" />
              </div>
            </Card>
          </div>
        </div>
      )}

      {calculations.scheduleData && calculations.scheduleData.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Amortization Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-3 text-left">Month</th>
                  <th className="p-3 text-left">Interest Payment</th>
                  <th className="p-3 text-left">Principal Payment</th>
                  <th className="p-3 text-left">Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {calculations.scheduleData
                  .slice(0, showFullSchedule ? undefined : 12)
                  .map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3">{row.month}</td>
                      <td className="p-3">{formatCurrency(row.interestPayment)}</td>
                      <td className="p-3">{formatCurrency(row.principalPayment)}</td>
                      <td className="p-3">{formatCurrency(row.remainingBalance)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {calculations.scheduleData.length > 12 && (
            <Button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              variant="outline"
              className="mt-4"
            >
              {showFullSchedule ? "Show Less" : `Show All ${calculations.scheduleData.length} Rows`}
            </Button>
          )}
        </div>
      )}
    </CalculatorVerticalLayout>
  );
}