import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Calendar, Info, TrendingUp, DollarSign, BookOpen, Lightbulb, CheckCircle, XCircle } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({ principal: "", interestRate: "", termYears: "" });
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showFullTable, setShowFullTable] = useState(false);

  const results = useMemo(() => {
    const principal = parseFloat(inputs.principal) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const termMonths = (parseFloat(inputs.termYears) || 0) * 12;

    if (principal === 0 || interestRate === 0 || termMonths === 0) return null;

    const monthlyPayment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -termMonths));
    const tableData = Array.from({ length: termMonths }, (_, i) => {
      const interestPayment = principal * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      principal -= principalPayment;
      return { month: i + 1, interestPayment, principalPayment, remainingBalance: principal };
    });

    return { main: monthlyPayment.toFixed(2), tableData };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const widget = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Principal Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              className="pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
              value={inputs.principal}
              onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Annual Interest Rate (%)</Label>
          <Input
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-gray-700 dark:text-gray-300">Term (Years)</Label>
          <Input
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            value={inputs.termYears}
            onChange={(e) => setInputs({ ...inputs, termYears: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg font-bold">
        <Calculator className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-400 border-none shadow-lg">
            <CardContent className="pt-6 text-center">
              <div className="text-lg font-medium text-blue-100 mb-2">Monthly Payment</div>
              <div className="text-5xl font-bold text-white">${results.main}</div>
            </CardContent>
          </Card>

          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">Month</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Interest Payment</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Principal Payment</TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-900">
                {results.tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-gray-700 dark:text-gray-300">{row.month}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">${row.interestPayment.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">${row.principalPayment.toFixed(2)}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">${row.remainingBalance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12 text-gray-800 dark:text-gray-200">
      <section id="how-to-calculate">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Introduction</h2>
        <p className="leading-relaxed text-gray-700 dark:text-gray-300">
          Understanding your mortgage payments and how they contribute to your home equity over time is crucial for financial planning. This calculator helps you estimate your monthly payments and view the full amortization schedule.
        </p>
      </section>

      <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border-l-4 border-blue-500 my-6">
        <h4 className="font-bold flex items-center gap-2 text-blue-800 dark:text-blue-100">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-300" /> Pro Tip
        </h4>
        <p className="text-blue-700 dark:text-blue-200 mt-2">
          Consider making extra payments towards your principal to reduce the total interest paid over the life of the loan.
        </p>
      </div>

      <section id="formula">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Formula</h2>
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-center my-6 text-slate-900 dark:text-slate-100 overflow-x-auto">
          M = P[r(1+r)^n]/[(1+r)^n – 1]
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mortgage Payment & Amortization Calculator"
      description="Estimate your monthly mortgage payments including interest. View the full amortization schedule to track your home equity growth over time."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "how-to-calculate", label: "How to Calculate" },
        { id: "formula", label: "Formula" },
      ]}
      formula={{
        formula: "M = P[r(1+r)^n]/[(1+r)^n – 1]",
        variables: [
          { symbol: "M", description: "Monthly payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "r", description: "Monthly interest rate" },
          { symbol: "n", description: "Number of payments" },
        ],
        title: "Formula",
      }}
      example={{
        title: "Example",
        steps: [
          "Calculate the monthly interest rate by dividing the annual rate by 12.",
          "Determine the total number of payments (months) by multiplying the term in years by 12.",
          "Apply the formula to find the monthly payment.",
        ],
        result: "For a $200,000 loan at 5% interest over 30 years, the monthly payment is approximately $1,073.64.",
      }}
      relatedCalculators={[
        { title: "Loan Calculator", url: "/loan-calculator", icon: "📊" },
        { title: "Interest Rate Calculator", url: "/interest-rate-calculator", icon: "📈" },
        { title: "Home Equity Calculator", url: "/home-equity-calculator", icon: "🏠" },
        { title: "Refinance Calculator", url: "/refinance-calculator", icon: "🔄" },
        { title: "Debt-to-Income Ratio Calculator", url: "/dti-calculator", icon: "📉" },
        { title: "Savings Goal Calculator", url: "/savings-goal-calculator", icon: "💰" },
      ]}
    />
  );
}