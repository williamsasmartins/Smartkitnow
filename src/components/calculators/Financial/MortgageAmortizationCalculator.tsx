import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/CalculatorVerticalLayout/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({ principal: "", interestRate: "", term: "" });
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
    const principalValue = parseFloat(inputs.principal) || 0;
    const interestRateValue = parseFloat(inputs.interestRate) || 0;
    const termValue = parseFloat(inputs.term) || 0;

    if (principalValue <= 0 || interestRateValue <= 0 || termValue <= 0) return { mainResult: 0, result2: 0, result3: 0, scheduleData: [] };

    const monthlyInterestRate = interestRateValue / 100 / 12;
    const numberOfPayments = termValue * 12;
    const mainResult = (principalValue * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    const totalPayment = mainResult * numberOfPayments;
    const totalInterest = totalPayment - principalValue;

    const scheduleData = Array.from({ length: numberOfPayments }, (_, i) => {
      const interestPayment = principalValue * monthlyInterestRate;
      const principalPayment = mainResult - interestPayment;
      principalValue -= principalPayment;
      return { col1: `Month ${i + 1}`, col2: principalPayment };
    });

    return { mainResult, result2: totalPayment, result3: totalInterest, scheduleData };
  }, [inputs]);

  const handleCalculate = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReset = () => setInputs({ principal: "", interestRate: "", term: "" });

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
          { symbol: "M", description: "Monthly payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "r", description: "Monthly interest rate" },
          { symbol: "n", description: "Number of payments" },
        ],
        title: "Formula for Calculating Mortgage Payments"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $200,000 mortgage with a 5% annual interest rate over 30 years.",
        steps: [
          { label: "Step 1", calculation: "5% annual interest = 0.004167 monthly interest", explanation: "Convert annual interest rate to monthly." },
          { label: "Step 2", calculation: "30 years × 12 months = 360 payments", explanation: "Calculate the number of payments." },
          { label: "Step 3", calculation: "M = 200,000[0.004167(1+0.004167)^360]/[(1+0.004167)^360 – 1]", explanation: "Apply the formula." },
        ],
        result: "The monthly payment is approximately $1,073.64"
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator", url: "/financial/loan-payment", icon: "📊" },
        { title: "Interest Rate Calculator", url: "/financial/interest-rate", icon: "💰" },
        { title: "Amortization Schedule Calculator", url: "/financial/amortization-schedule", icon: "🏦" },
        { title: "Refinance Calculator", url: "/financial/refinance", icon: "📈" },
        { title: "Home Equity Calculator", url: "/financial/home-equity", icon: "💵" },
        { title: "Debt-to-Income Ratio Calculator", url: "/financial/dti-ratio", icon: "🔢" },
      ]}
    >
      <Card className="p-6 bg-gray-800/50 border-gray-700">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Loan Amount
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
                value={inputs.term}
                onChange={(e) => setInputs({ ...inputs, term: e.target.value })}
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

      {calculations.mainResult > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8">
          <h3 className="text-2xl font-bold">Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Monthly Payment</p>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {formatCurrency(calculations.mainResult)}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-50" />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Payment</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {formatCurrency(calculations.result2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
            </Card>

            <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Interest</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                    {formatCurrency(calculations.result3)}
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
                  <th className="p-3 text-left">Principal Payment</th>
                </tr>
              </thead>
              <tbody>
                {calculations.scheduleData
                  .slice(0, showFullSchedule ? undefined : 12)
                  .map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3">{row.col1}</td>
                      <td className="p-3">{formatCurrency(row.col2)}</td>
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