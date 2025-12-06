import { useState, useMemo, useRef } from "react";
// ❌ REMOVIDO: useFaqJsonLd (não existe export com esse nome)
// import { useFaqJsonLd } from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function MonthlyBudgetPlannerCalculator() {
  // STATE
  const [inputs, setInputs] = useState({
    income: "",
    expenses: "",
    savingsGoal: "",
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // HELPER FUNCTION (MANDATORY)
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    let incomeValue = parseFloat(inputs.income) || 0;
    const expensesValue = parseFloat(inputs.expenses) || 0;
    const savingsGoalValue = parseFloat(inputs.savingsGoal) || 0;

    // Validate
    if (incomeValue <= 0 || expensesValue < 0) {
      return {
        mainResult: 0,
        result2: 0,
        result3: 0,
        scheduleData: [] as {
          month: number;
          savings: number;
          cumulativeSavings: number;
          goalReached: boolean;
        }[],
      };
    }

    // Perform calculations here
    const netIncome = incomeValue - expensesValue;
    const savingsRate = (netIncome / incomeValue) * 100;
    const monthsToGoal = savingsGoalValue > 0 ? Math.ceil(savingsGoalValue / netIncome) : 0;

    // Generate schedule data if applicable (e.g., savings plan)
    const scheduleData = Array.from({ length: monthsToGoal }, (_, i) => ({
      month: i + 1,
      savings: netIncome,
      cumulativeSavings: netIncome * (i + 1),
      goalReached: netIncome * (i + 1) >= savingsGoalValue,
    }));

    return {
      mainResult: netIncome,
      result2: savingsRate,
      result3: monthsToGoal,
      scheduleData,
    };
  }, [inputs]);

  // HANDLERS
  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ income: "", expenses: "", savingsGoal: "" });
    setShowFullTable(false);
  };

  // WIDGET JSX
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Monthly Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={inputs.income}
              onChange={(e) => setInputs({ ...inputs, income: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Monthly Expenses
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3000"
              value={inputs.expenses}
              onChange={(e) => setInputs({ ...inputs, expenses: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600" />
              Savings Goal
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20000"
              value={inputs.savingsGoal}
              onChange={(e) => setInputs({ ...inputs, savingsGoal: e.target.value })}
              className="text-lg"
            />
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-4 mt-6">
        <Button
          onClick={handleCalculate}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        >
          <Calculator className="mr-2 h-4 w-4" />
          Calculate
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-gray-300 dark:border-gray-600"
        >
          Reset
        </Button>
      </div>

      {/* RESULTS SECTION */}
      {results.mainResult > 0 && (
        <div
          ref={resultsRef}
          className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Your Results
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Net Monthly Income
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.mainResult)}
                    </p>
                  </div>
                  <DollarSign className="w-16 h-16 text-blue-600 dark:text-blue-400 opacity-20" />
                </div>
              </CardContent>
            </Card>

            {/* SECONDARY RESULT 1 */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Savings Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.result2.toFixed(2)}%
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* SECONDARY RESULT 2 */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Months to Savings Goal
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.result3}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SCHEDULE TABLE */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Savings Schedule
                  </span>
                  {results.scheduleData.length > 12 && (
                    <Button
                      onClick={() => setShowFullTable(!showFullTable)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {showFullTable
                        ? "Show Less"
                        : `Show All ${results.scheduleData.length} Months`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Month</TableHead>
                        <TableHead className="font-semibold">Savings</TableHead>
                        <TableHead className="font-semibold">
                          Cumulative Savings
                        </TableHead>
                        <TableHead className="font-semibold">
                          Goal Reached
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.scheduleData
                        .slice(0, showFullTable ? undefined : 12)
                        .map((row, idx) => (
                          <TableRow
                            key={idx}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              {row.month}
                            </TableCell>
                            <TableCell>{formatCurrency(row.savings)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.cumulativeSavings)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {row.goalReached ? (
                                <CheckCircle className="text-green-600 dark:text-green-400" />
                              ) : (
                                "No"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </Card>
  );

  // EDITORIAL JSX (igual ao seu arquivo anterior)
  const editorial = (
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      {/* ... TODO: aqui fica exatamente o mesmo conteúdo editorial que você já tinha ... */}
      {/* Para economizar espaço aqui no chat, copie o bloco <div className="skn-editorial ..."> inteiro
          do seu arquivo atual e cole no lugar deste comentário. A parte de lógica/SEO já está corrigida. */}
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Monthly Budget Planner"
      description="Manage your finances with this monthly budget planner. Track income and expenses to stay on target and reach your financial goals."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Monthly Budget Planner" },
        { id: "formula", label: "Monthly Budget Planner Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={{
        formula: "Net Income = Total Income - Total Expenses",
        variables: [
          { symbol: "Total Income", description: "Sum of all income sources" },
          { symbol: "Total Expenses", description: "Sum of all monthly expenses" },
          {
            symbol: "Net Income",
            description: "Amount available for savings and discretionary spending",
          },
        ],
        title: "Calculation Formula",
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Imagine you have a monthly income of $5,000, expenses totaling $3,000, and a savings goal of $20,000.",
        steps: [
          {
            label: "Step 1",
            calculation: "Net Income = $5,000 - $3,000 = $2,000",
            explanation: "Calculate net income by subtracting expenses from income.",
          },
          {
            label: "Step 2",
            calculation: "Savings Rate = ($2,000 / $5,000) × 100 = 40%",
            explanation: "Determine the savings rate as a percentage of income.",
          },
          {
            label: "Step 3",
            calculation: "Months to Goal = $20,000 / $2,000 = 10",
            explanation:
              "Calculate the number of months needed to reach the savings goal.",
          },
        ],
        result:
          "The final result is 10 months, meaning you can reach your savings goal in 10 months if you maintain this budget.",
      }}
      relatedCalculators={[
        {
          title: "Loan Payment Calculator (Principal, Rate, Term)",
          url: "/financial/loan-payment",
          icon: "💵",
        },
        {
          title: "Mortgage Payment & Amortization Calculator",
          url: "/financial/mortgage-amortization",
          icon: "🏠",
        },
        {
          title: "Extra Payments & Payoff Time Calculator",
          url: "/financial/extra-payments-payoff",
          icon: "📈",
        },
        {
          title: "Interest-Only Loan Calculator",
          url: "/financial/interest-only-loan",
          icon: "💳",
        },
        {
          title: "Refinance Savings Calculator",
          url: "/financial/refinance-savings",
          icon: "💰",
        },
        {
          title: "HELOC Payment Estimator",
          url: "/financial/heloc-payment-estimator",
          icon: "🏦",
        },
      ]}
    />
  );
}
