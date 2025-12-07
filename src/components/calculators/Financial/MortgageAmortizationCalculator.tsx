import { useState, useMemo, useRef } from "react";
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
} from "lucide-react";

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
  // STATE
  const [inputs, setInputs] = useState<InputsState>({
    income: "",
    expenses: "",
    savingsGoal: "",
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

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
    <div className="skn-editorial space-y-10 text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      <section id="introduction" className="space-y-3">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          How this monthly budget planner works
        </h2>
        <p>
          This calculator helps you understand how much money you really have
          left at the end of the month. You enter your take-home income, your
          total monthly expenses, and an optional savings goal. We estimate your
          monthly surplus, savings rate, and how long it could take to reach
          that goal.
        </p>
        <p>
          It&apos;s a simple planning tool meant for education and awareness,
          not a full replacement for detailed financial planning. You can use
          the results as a starting point to decide whether you need to cut
          costs, increase income, or adjust your savings target.
        </p>
      </section>

      <section id="formula" className="space-y-3">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Core formula behind the planner
        </h2>
        <p>
          The logic behind this calculator is intentionally straightforward so
          you can follow each step:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Net income</strong> = Monthly income − Monthly expenses
          </li>
          <li>
            <strong>Savings rate</strong> = (Net income ÷ Monthly income) ×
            100%
          </li>
          <li>
            <strong>Months to goal</strong> = Savings goal ÷ Net income
          </li>
        </ul>
        <p>
          If your net income is negative or zero, the calculator will show that
          there is no remaining money to save and you may need to revisit your
          income or expense assumptions.
        </p>
      </section>

      <section id="factors" className="space-y-3">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          <Info className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          Key factors that affect your results
        </h2>
        <p>Several factors can change what this planner shows:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Income stability:</strong> If your income fluctuates from
            month to month, use a conservative estimate rather than the best
            month you ever had.
          </li>
          <li>
            <strong>Irregular expenses:</strong> Annual insurance premiums,
            car repairs, or one-off purchases can distort a single month. It
            helps to spread those over 12 months to get a more realistic
            average.
          </li>
          <li>
            <strong>Debt payments:</strong> Minimum payments on credit cards or
            loans are part of your regular expenses and reduce how much you can
            save.
          </li>
          <li>
            <strong>Saving priority:</strong> You might choose to split surplus
            between savings, extra debt payments, and fun money. The calculator
            assumes you direct the full surplus to your savings goal.
          </li>
        </ul>
      </section>

      <section id="faq" className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Frequently asked questions
        </h2>

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Is this planner giving me financial advice?
          </h3>
          <p>
            No. This tool is for general education and budgeting awareness only.
            It does not consider your full financial situation, risk tolerance,
            or goals. For personalized advice, talk to a licensed financial
            professional.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            What if my net income is negative?
          </h3>
          <p>
            A negative net income means your expenses are higher than your
            income. In that case, you may need to reduce expenses, increase
            income, or both. The calculator will not estimate months to goal
            if there is no surplus to save.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            How often should I update my budget?
          </h3>
          <p>
            Many people review their budget monthly, but you can adjust it more
            often during periods of change (new job, move, major purchase, or
            big life event). Updating the calculator regularly helps you keep
            your plan realistic.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Does this include investment returns or interest?
          </h3>
          <p>
            No. The results assume you simply set money aside each month
            without investment growth. If you plan to invest your savings, your
            actual time to reach a goal could be shorter or longer depending on
            market performance.
          </p>
        </div>
      </section>

      <section id="references" className="space-y-3">
        <h2 className="flex items-center gap-2 text-2xl font-semibold text-slate-900 dark:text-slate-50">
          <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          References & further reading
        </h2>
        <p>
          These resources offer more detail on budgeting methods and practical
          ways to organize your finances:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 mt-1 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.consumerfinance.gov/consumer-tools/budgeting/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Consumer Financial Protection Bureau – Budgeting basics
              </a>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                Guidance on how to start a budget, track spending, and adjust
                when life changes.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Info className="w-5 h-5 mt-1 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.investor.gov/introduction-investing/investing-basics/why-save-when-youre-young"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Investor.gov – Why saving early matters
              </a>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                Explains why building the habit of saving and budgeting early
                can make a big difference over time.
              </p>
            </div>
          </li>
        </ul>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          This calculator is for informational and educational purposes only
          and is not a substitute for professional financial advice.
        </p>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Monthly Budget Planner"
      description="Estimate your monthly surplus, savings rate, and how long it may take to reach a savings goal based on your income and expenses."
      category="financial"
      subcategory="Budgeting & planning"
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
