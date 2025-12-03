import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({
    loanAmount: "",
    interestRate: "",
    loanTerm: "",
  });
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
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
    const loanTerm = parseInt(inputs.loanTerm) || 0;

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) return { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, scheduleData: [] };

    const monthlyRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    const scheduleData = Array.from({ length: numberOfPayments }, (_, i) => {
      const interestPayment = loanAmount * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      loanAmount -= principalPayment;
      return { month: i + 1, principal: principalPayment, interest: interestPayment, balance: loanAmount };
    });

    return { monthlyPayment, totalInterest, totalPayment, scheduleData };
  }, [inputs]);

  const handleCalculate = () => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleReset = () => setInputs({ loanAmount: "", interestRate: "", loanTerm: "" });

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
        title: "Formula for Calculating Monthly Mortgage Payment"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $200,000 loan with a 5% annual interest rate over 30 years.",
        steps: [
          { label: "Step 1", calculation: "5% annual interest = 0.004167 monthly interest", explanation: "Convert annual rate to monthly" },
          { label: "Step 2", calculation: "30 years = 360 payments", explanation: "Convert years to number of monthly payments" },
          { label: "Step 3", calculation: "M = 200,000[0.004167(1+0.004167)^360]/[(1+0.004167)^360 – 1]", explanation: "Apply the formula" },
        ],
        result: "The monthly payment is approximately $1,073.64"
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator", url: "/financial/loan-payment", icon: "📊" },
        { title: "Interest Rate Calculator", url: "/financial/interest-rate", icon: "💰" },
        { title: "Home Equity Calculator", url: "/financial/home-equity", icon: "🏦" },
        { title: "Refinance Calculator", url: "/financial/refinance", icon: "📈" },
        { title: "Affordability Calculator", url: "/financial/affordability", icon: "💵" },
        { title: "APR Calculator", url: "/financial/apr", icon: "🔢" },
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
                value={inputs.loanAmount}
                onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Interest Rate (%)
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
                value={inputs.loanTerm}
                onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Interest</p>
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
                  <th className="p-3 text-left">Principal</th>
                  <th className="p-3 text-left">Interest</th>
                  <th className="p-3 text-left">Balance</th>
                </tr>
              </thead>
              <tbody>
                {calculations.scheduleData
                  .slice(0, showFullSchedule ? undefined : 12)
                  .map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3">{row.month}</td>
                      <td className="p-3">{formatCurrency(row.principal)}</td>
                      <td className="p-3">{formatCurrency(row.interest)}</td>
                      <td className="p-3">{formatCurrency(row.balance)}</td>
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