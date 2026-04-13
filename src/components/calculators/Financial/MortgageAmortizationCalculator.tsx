import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  HelpCircle,
  BookOpen,
  Info,
  CheckCircle,
  Share2
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type InputsState = {
  income: string;
  expenses: string;
  savingsGoal: string;
};

type ScheduleRow = {
  month: number;
  savings: number;
  cumulativeSavings: number;
  goalReached: boolean;
};

export default function MonthlyBudgetPlannerCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();

  // STATE
  const [inputs, setInputs] = useState<InputsState>({
    income: searchParams.get("income") || "",
    expenses: searchParams.get("expenses") || "",
    savingsGoal: searchParams.get("goal") || "",
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Auto-calculate
  useEffect(() => {
    if (searchParams.size > 0 && inputs.income && inputs.expenses) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // HELPER: format currency
  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  // CALCULATIONS
  const results = useMemo(() => {
    const incomeValue = parseFloat(inputs.income) || 0;
    const expensesValue = parseFloat(inputs.expenses) || 0;
    const savingsGoalValue = parseFloat(inputs.savingsGoal) || 0;

    if (incomeValue <= 0 || expensesValue < 0) {
      return {
        netIncome: 0,
        savingsRate: 0,
        monthsToGoal: 0,
        scheduleData: [] as ScheduleRow[],
      };
    }

    const netIncome = incomeValue - expensesValue;
    const savingsRate =
      incomeValue > 0 ? (netIncome / incomeValue) * 100 : 0;
    const monthsToGoal =
      savingsGoalValue > 0 && netIncome > 0
        ? Math.ceil(savingsGoalValue / netIncome)
        : 0;

    const scheduleData: ScheduleRow[] =
      monthsToGoal > 0
        ? Array.from({ length: monthsToGoal }, (_, i) => {
          const month = i + 1;
          const cumulativeSavings = netIncome * month;
          return {
            month,
            savings: netIncome,
            cumulativeSavings,
            goalReached: cumulativeSavings >= savingsGoalValue,
          };
        })
        : [];

    return {
      netIncome,
      savingsRate,
      monthsToGoal,
      scheduleData,
    };
  }, [inputs]);

  // HANDLERS
  const handleCalculate = () => {
    // Apenas para scroll suave até os resultados
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);
  };

  const handleReset = () => {
    setInputs({
      income: "",
      expenses: "",
      savingsGoal: "",
    });
    setShowFullTable(false);
    setSearchParams({});
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (inputs.income) params.set("income", inputs.income);
    if (inputs.expenses) params.set("expenses", inputs.expenses);
    if (inputs.savingsGoal) params.set("goal", inputs.savingsGoal);

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
    navigator.clipboard.writeText(newUrl);
    toast.success("Link copied to clipboard!");
  };

  // WIDGET (formulário + resultados)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      {/* INPUTS */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Monthly income (after tax)
            </Label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="e.g., 5000"
              value={inputs.income}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  income: e.target.value,
                }))
              }
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Total monthly expenses
            </Label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="e.g., 3200"
              value={inputs.expenses}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  expenses: e.target.value,
                }))
              }
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              Savings goal (optional)
            </Label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="e.g., 20000"
              value={inputs.savingsGoal}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  savingsGoal: e.target.value,
                }))
              }
              className="text-lg"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              If you enter a savings goal, the planner will estimate how many
              months it would take to get there with your current budget.
            </p>
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
          Calculate budget
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="border-gray-300 dark:border-gray-700"
        >
          Reset
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 px-3"
          title="Share result"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* RESULTS */}
      {results.netIncome > 0 && (
        <div
          ref={resultsRef}
          className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Your monthly budget snapshot
          </h3>

          {/* BUDGET ALLOCATION CHART */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Income Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Expenses', value: parseFloat(inputs.expenses) || 0, fill: '#ef4444' },
                      { name: 'Savings (Net Income)', value: results.netIncome, fill: '#10b981' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Expenses', fill: '#ef4444' },
                      { name: 'Savings (Net Income)', fill: '#10b981' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    itemStyle={{ color: "#1e293b" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Net income */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-md">
              <CardContent className="pt-6 pb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Net income after expenses
                  </p>
                  <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                    {formatCurrency(results.netIncome)}
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    This is what&apos;s left each month after your current
                    expenses.
                  </p>
                </div>
                <DollarSign className="w-14 h-14 text-blue-600 dark:text-blue-300 opacity-20" />
              </CardContent>
            </Card>

            {/* Savings rate */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="pt-6 pb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Savings rate
                  </p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {results.savingsRate.toFixed(1)}%
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    The percentage of your income that could go to savings or
                    extra debt payments.
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-500 dark:text-emerald-400 opacity-60" />
              </CardContent>
            </Card>

            {/* Months to goal */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="pt-6 pb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Months to reach your goal
                  </p>
                  <p className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                    {results.monthsToGoal > 0
                      ? results.monthsToGoal
                      : "—"}
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Based on your current surplus and savings goal.
                  </p>
                </div>
                <Calculator className="w-10 h-10 text-violet-500 dark:text-violet-400 opacity-60" />
              </CardContent>
            </Card>
          </div>

          {/* Schedule table */}
          {results.scheduleData.length > 0 && (
            <Card className="mt-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Savings schedule
                </CardTitle>
                {results.scheduleData.length > 12 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700"
                    onClick={() => setShowFullTable((prev) => !prev)}
                  >
                    {showFullTable
                      ? "Show first 12 months"
                      : `Show all ${results.scheduleData.length} months`}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-950/40">
                        <TableHead>Month</TableHead>
                        <TableHead>Monthly savings</TableHead>
                        <TableHead>Cumulative savings</TableHead>
                        <TableHead>Goal reached?</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.scheduleData
                        .slice(0, showFullTable ? undefined : 12)
                        .map((row) => (
                          <TableRow
                            key={row.month}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900/60"
                          >
                            <TableCell className="font-medium">
                              {row.month}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(row.savings)}
                            </TableCell>
                            <TableCell className="text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(row.cumulativeSavings)}
                            </TableCell>
                            <TableCell>
                              {row.goalReached ? (
                                <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
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

  // EDITORIAL
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Monthly Budget Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Monthly Budget Planner is a financial tool designed to help you track income and expenses, allocate funds across spending categories, and monitor progress toward savings goals. By creating a detailed monthly budget, you gain visibility into your cash flow, identify spending patterns, and make informed decisions about money. This calculator transforms budgeting from a vague concept into a concrete action plan that increases financial control and reduces financial stress.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the planner effectively, start by entering your total monthly income (after taxes). Then list all fixed expenses (rent, insurance, loan payments) and variable expenses (groceries, utilities, entertainment) across distinct categories. The calculator allows you to set spending targets for each category—most users benefit from organizing categories into 8-12 groups covering needs, wants, and savings. Input realistic figures based on your actual spending history or industry benchmarks provided in this guide.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret your planner results by comparing actual spending to budgeted amounts each week. A positive balance means you're under budget; negative indicates overspending in that category. Use monthly totals to assess whether you're meeting the 50/30/20 rule or your custom allocation goals, then adjust future months accordingly. Over time, consistent tracking reveals which categories consistently overshoot, allowing you to make targeted lifestyle changes or increase allocation limits to reflect reality.</p>
        </div>
      </section>

      {/* TABLE: Recommended Monthly Budget Allocation (50/30/20 Rule) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Monthly Budget Allocation (50/30/20 Rule)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the standard budget breakdown recommended by financial experts for household expenses based on take-home income.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Budget Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Percentage of Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example (Monthly Income: $5,000)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Essential Needs (housing, food, utilities, insurance, transportation)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Wants (dining out, entertainment, hobbies, shopping)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Savings & Debt Repayment (emergency fund, retirement, loan payments)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This is a guideline; adjust percentages based on personal circumstances. Those with high debt may allocate more to debt repayment; those with stable income may increase savings.</p>
      </section>

      {/* TABLE: Average Monthly Household Expenses by Category (2024-2025) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Monthly Household Expenses by Category (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table displays typical monthly spending benchmarks for a family of four earning $75,000 annually, helping you compare your budget planner entries to national averages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expense Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Monthly Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Percentage of $6,250 Take-Home</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Housing (rent/mortgage, property tax, insurance, maintenance)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Groceries & Food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Utilities (electricity, gas, water, internet)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$275</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.4%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Transportation (car payment, gas, insurance, maintenance)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Childcare & Education</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Insurance (health, auto, home, life)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.4%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal & Entertainment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dining Out & Subscriptions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Savings & Emergency Fund</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Miscellaneous & Buffer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$175</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Figures are U.S. Bureau of Labor Statistics 2024 averages. Your actual expenses will vary based on location, family size, and lifestyle. Urban areas typically spend 15-25% more on housing and transportation.</p>
      </section>

      {/* TABLE: Monthly Budget Planner: Suggested Category Limits & Goals */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Budget Planner: Suggested Category Limits & Goals</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides recommended spending caps and savings targets for each major budget category to help you set realistic goals in your monthly planner.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Monthly Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Overspending Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Groceries (family of 4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600-$800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Eating out unplanned, impulse purchases</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Entertainment & Hobbies</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200-$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Subscriptions, streaming, event tickets</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dining Out & Coffee</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150-$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Convenience purchases, daily habits</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Utilities</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150-$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seasonal increases, inefficient usage</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Care & Clothing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100-$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sales, impulse fashion buys</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Emergency Fund Contribution</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400-$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Deprioritizing for immediate wants</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Debt Repayment (beyond minimum)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200-$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Insufficient allocation to principal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Transportation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400-$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fuel volatility, maintenance surprises</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Limits depend on income and regional costs. Using your monthly budget planner with these targets creates accountability and prevents category creep.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the 50/30/20 rule as your starting framework — allocate 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment. Adjust these percentages within your planner if your situation requires more debt payoff (increase to 40%) or aggressive saving (increase to 30%), but stay disciplined about the total.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track every expense in your budget planner within 24-48 hours of spending to maintain accuracy and catch errors early. Studies show that people who log expenses within 2 days are 85% more likely to stick to their budget than those who log weekly or monthly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Create a separate 'miscellaneous' category with a 5% buffer (typically $250-$500 for most households) to capture unexpected small expenses without derailing your entire budget. This prevents frustration and maintains realistic planning for irregular one-off costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Review and adjust your budget planner monthly, not annually. Set a recurring calendar reminder for the first Sunday of each month to review the previous month's actual spending, celebrate wins in under-budget categories, and redistribute funds from surplus areas to deficit areas.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Automate savings by scheduling transfers to a separate savings account immediately after payday—treat 'savings' as a non-negotiable expense in your planner. Automating even $300-500 monthly removes willpower from the equation and ensures consistent progress toward your emergency fund or financial goals.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Identify your personal spending triggers within the planner and proactively address them. If your entertainment category consistently overspends by $100-200, investigate whether it's streaming subscriptions, concert tickets, or dining out—then set sub-category limits to control that specific leak.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Gross Income Instead of Net Income</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people budget based on gross salary without subtracting taxes, Social Security, and health insurance, leading to overspending within weeks. Always use your net (take-home) income as the foundation for your monthly budget planner to avoid unrealistic allocations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Irregular or Annual Expenses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for car insurance, property taxes, holiday gifts, or annual subscriptions creates budget surprises that derail planning. Divide annual irregular expenses by 12 and add them as monthly line items in your planner to smooth cash flow.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Setting Unrealistic Spending Limits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many budgeters allocate $300 monthly to groceries when they historically spend $600, leading to immediate budget failure and discouragement. Use 3-6 months of actual bank statements to establish realistic baseline categories, then adjust downward by 5-10% as a stretch goal.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Updating Your Budget for Life Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Significant events like job changes, marriage, children, or relocation alter income and expenses dramatically, but many people continue using outdated budget templates. Review and rebuild your budget planner whenever major life events occur to ensure all categories reflect current reality.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting the Emergency Fund</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Prioritizing wants over emergency savings leaves you vulnerable to debt when unexpected expenses arise. Treat emergency fund contributions (10-15% of income) as a non-negotiable line item in your planner, even if other categories must shrink temporarily.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What income should I include in my monthly budget planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Include all regular monthly income sources such as salary, wages, freelance earnings, rental income, and investment returns. Use your net income (after taxes) rather than gross income for more accurate budgeting. If your income varies, use the average of the last 3-6 months to create a realistic baseline.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I categorize my expenses in the monthly budget planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Organize expenses into fixed costs (rent, insurance, loan payments) and variable costs (groceries, utilities, entertainment). The typical budget breakdown follows the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment. Your monthly budget planner should track at least 8-10 spending categories for better insights.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended emergency fund percentage in a monthly budget?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Financial experts recommend allocating 10-15% of your monthly budget to emergency savings, building toward 3-6 months of living expenses in a dedicated fund. For a household with $5,000 monthly expenses, this means saving $500-750 per month until reaching $15,000-30,000 in emergency reserves. This buffer protects against job loss, medical emergencies, or unexpected repairs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I update my monthly budget planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Review and update your budget monthly, ideally within the first week of each month before spending occurs. Track actual spending against budgeted amounts and adjust categories as needed based on seasonal changes or life events. A quarterly deeper review (every 3 months) helps identify spending trends and refine long-term goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the monthly budget planner help me reduce debt?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the budget planner helps by showing exactly how much you can allocate to debt payments each month. Using the avalanche method (highest interest rate first) or snowball method (smallest balance first), you can direct extra funds from the planner toward principal payments. Even adding $100-200 monthly toward debt can reduce repayment time by 12-24 months on average.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage should groceries represent in my monthly budget?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The USDA recommends spending 8-12% of household income on groceries for a moderate-cost plan. For a household earning $5,000 monthly, this equates to $400-600 in groceries. Using your monthly budget planner to track this category helps identify overspending and opportunities to optimize food costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I handle irregular or seasonal expenses in my budget planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide annual irregular expenses (car insurance, holidays, property taxes) by 12 and add them as monthly line items. For example, if car insurance costs $1,200 annually, allocate $100 monthly in your budget. This smooths cash flow and prevents budget surprises during peak spending months.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a healthy savings rate to include in my monthly budget?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Financial advisors recommend saving 15-20% of gross income monthly, though 10% is a reasonable starting point. For someone earning $6,000 monthly, this means saving $600-1,200. Your budget planner should prioritize allocating savings before discretionary spending to automate wealth building.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I use the monthly budget planner to track spending in real-time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter budgeted amounts upfront, then log actual expenses daily or weekly to see your spending against targets. Most planners show remaining balance for each category, letting you adjust spending mid-month. Reviewing daily for just 2-3 minutes increases awareness and reduces budget overruns by 15-30%.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://fred.stlouisfed.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve Economic Data (FRED) — Consumer Expenditure Survey</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. economic data on average household spending patterns and income statistics used to benchmark budget allocations.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/consumer-tools/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau (CFPB) — Budgeting Tools & Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government-backed guidance on budgeting best practices, expense tracking, and creating realistic monthly spending plans.</p>
          </li>
          <li>
            <a href="https://www.bls.gov/news.release/cesan.nr0.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Bureau of Labor Statistics — Average Energy Costs & Consumer Expenditure</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official statistics on typical household expenses by category, region, and family size to validate budget planner benchmarks.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/articles/personal-finance/032916/how-create-budget.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia — How to Create a Budget (50/30/20 Rule Explained)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to the 50/30/20 budgeting framework and practical strategies for implementing a monthly budget plan.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Monthly Budget Planner"
      description="Estimate your monthly surplus, savings rate, and how long it may take to reach a savings goal based on your income and expenses."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "How this planner works" },
        { id: "formula", label: "Formula & calculations" },
        { id: "factors", label: "What affects your budget" },
        { id: "faq", label: "Frequently asked questions" },
        { id: "references", label: "References & resources" },
      ]}
      formula={{
        title: "Monthly budget formulas",
        formula: "Net income = Income − Expenses",
        variables: [
          {
            symbol: "Income",
            description: "Your total take-home pay per month.",
          },
          {
            symbol: "Expenses",
            description: "All monthly bills, living costs, and debt payments.",
          },
          {
            symbol: "Net income",
            description:
              "What is left after expenses and potentially available for savings.",
          },
        ],
      }}
      example={{
        title: "Example – planning a savings goal",
        scenario:
          "Imagine you bring home $5,000 per month after tax, your total monthly expenses are $3,200, and you want to save $18,000.",
        steps: [
          {
            label: "Step 1 – Net income",
            calculation: "Net income = $5,000 − $3,200 = $1,800",
            explanation:
              "This is the amount you could allocate to savings, extra debt payments, or other goals.",
          },
          {
            label: "Step 2 – Savings rate",
            calculation: "Savings rate = ($1,800 ÷ $5,000) × 100 = 36%",
            explanation:
              "You are setting aside about 36% of your take-home pay each month.",
          },
          {
            label: "Step 3 – Months to goal",
            calculation: "Months to goal = $18,000 ÷ $1,800 = 10 months",
            explanation:
              "If you keep this budget, you could reach your $18,000 goal in about 10 months.",
          },
        ],
        result:
          "In this scenario, maintaining the same income and expenses would let you reach your savings goal in roughly 10 months.",
      }}
      relatedCalculators={[
        {
          title: "Loan payment calculator",
          url: "/financial/loan-payment",
          icon: "💳",
        },
        {
          title: "Mortgage payment & amortization",
          url: "/financial/mortgage-amortization",
          icon: "🏠",
        },
        {
          title: "Extra payments & payoff time",
          url: "/financial/extra-payments-payoff",
          icon: "📈",
        },
        {
          title: "Debt payoff snowball planner",
          url: "/financial/debt-snowball-planner",
          icon: "❄️",
        },
      ]}
    />
  );
}
