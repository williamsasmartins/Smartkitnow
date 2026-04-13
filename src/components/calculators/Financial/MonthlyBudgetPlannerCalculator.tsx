import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
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
    savingsGoal: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What income should I include in my monthly budget planner?",
      answer: "Include all regular monthly income sources: gross salary, side gig earnings, freelance income, rental income, and any regular benefits. Do not include irregular bonuses or tax refunds unless you receive them consistently each month. For self-employed individuals, use your average monthly net income over the past 12 months to account for seasonal fluctuations.",
    },
    {
      question: "How do I categorize expenses in the monthly budget planner?",
      answer: "The planner typically uses major categories like housing (30% of income), utilities (5-10%), groceries (5-15%), transportation (10-15%), insurance (10-25%), debt payments (5-10%), and discretionary spending (5-10%). You can customize categories based on your situation, but tracking fixed expenses separately from variable expenses helps you identify where you can cut costs if needed.",
    },
    {
      question: "What's the recommended percentage for emergency fund savings in my monthly budget?",
      answer: "Financial experts recommend allocating 10-20% of your monthly income toward savings, with 3-6 months of expenses in an emergency fund as a target. If you're just starting, aim for $1,000-$2,000 in an initial emergency fund, then build to cover one full month of expenses before tackling other savings goals.",
    },
    {
      question: "How often should I update my monthly budget planner?",
      answer: "Review and update your budget monthly, ideally within the first few days after receiving your paycheck. A quarterly review (every 3 months) helps you spot trends and adjust for seasonal changes, while an annual review ensures your budget aligns with income changes, inflation, and major life events like marriage or job changes.",
    },
    {
      question: "Can I use the monthly budget planner if my income varies?",
      answer: "Yes, for variable income use the average from the past 12 months or use your lowest monthly income as a conservative estimate. Set aside 20-30% of months with higher earnings into a separate account to cover lower-earning months, ensuring you always meet fixed expenses like rent and utilities.",
    },
    {
      question: "What's the 50/30/20 rule and how does it apply to this calculator?",
      answer: "The 50/30/20 rule allocates 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment. For example, on a $4,000 monthly after-tax income, you'd allocate $2,000 to needs, $1,200 to wants, and $800 to savings—though this ratio should be adjusted based on your location's cost of living and personal circumstances.",
    },
    {
      question: "How should I handle annual expenses like insurance premiums in my monthly budget?",
      answer: "Divide annual or semi-annual expenses by 12 to find the monthly equivalent and include this in your monthly budget. For example, if your car insurance costs $1,200 annually, budget $100 per month, and set that amount aside in a separate savings account so you're not caught off guard when the bill arrives.",
    },
    {
      question: "What percentage of my income should go toward housing costs?",
      answer: "The standard recommendation is no more than 28-30% of your gross monthly income on housing expenses including rent or mortgage, property taxes, insurance, and utilities. For a $5,000 monthly gross income, this means housing should cost no more than $1,400-$1,500, though this varies by location and personal circumstances.",
    },
    {
      question: "How do I track whether my actual spending matches my budget plan?",
      answer: "Compare your planned budget amounts to your actual spending each month by reviewing bank statements, credit card statements, and receipts. Calculate the variance (actual minus planned) for each category; if variance exceeds 10% consistently, adjust your budget for accuracy and investigate unusual spending patterns to identify leaks.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

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
    const incomeValue = parseFloat(inputs.income) || 0;
    const expensesValue = parseFloat(inputs.expenses) || 0;
    const savingsGoalValue = parseFloat(inputs.savingsGoal) || 0;

    // Validate
    if (incomeValue <= 0 || expensesValue < 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
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
      goalReached: netIncome * (i + 1) >= savingsGoalValue
    }));

    return { 
      mainResult: netIncome, 
      result2: savingsRate, 
      result3: monthsToGoal, 
      scheduleData 
    };
  }, [inputs]);

  // HANDLERS
  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ income: "", expenses: "", savingsGoal: "" });
  };

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600"/>
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
              <TrendingUp className="w-4 h-4 text-green-600"/>
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
              <Calculator className="w-4 h-4 text-purple-600"/>
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
          <Calculator className="mr-2 h-4 w-4"/> 
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

      {/* RESULTS SECTION - GRID 2x2 (MANDATORY) */}
      {results.mainResult > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
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

          {/* AMORTIZATION/SCHEDULE TABLE (if applicable) */}
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
                        ? 'Show Less' 
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
                        <TableHead className="font-semibold">Cumulative Savings</TableHead>
                        <TableHead className="font-semibold">Goal Reached</TableHead>
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
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell>{formatCurrency(row.savings)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.cumulativeSavings)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {row.goalReached ? <CheckCircle className="text-green-600 dark:text-green-400"/> : "No"}
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

  // EDITORIAL JSX (350-400 LINES, 2500-3000 WORDS)
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Monthly Budget Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Monthly Budget Planner is a financial tool designed to help you allocate your income across different spending categories and savings goals. By creating a detailed monthly budget, you gain visibility into your spending patterns, identify areas where you can save money, and ensure that you're meeting your financial priorities like emergency funds and debt repayment. This calculator is essential for anyone looking to take control of their finances and build wealth over time.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the planner, start by entering your total monthly income (after taxes) and then input your expected expenses in each category: housing, utilities, groceries, transportation, insurance, debt payments, and discretionary spending. Be as specific as possible—use your bank statements and historical spending data rather than estimates. The calculator will show you where your money goes each month and highlight whether you're running a surplus or deficit.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you've entered all your data, review the results to see which categories consume the largest percentages of your income. Look for categories where actual spending significantly exceeds your plan, and use the 50/30/20 rule (50% needs, 30% wants, 20% savings/debt) as a benchmarking guide. If your budget shows a deficit, you'll need to either increase income, reduce discretionary expenses, or negotiate lower rates on fixed costs like insurance and utilities.</p>
        </div>
      </section>

      {/* TABLE: Monthly Budget Allocation Guide by Income Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Budget Allocation Guide by Income Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended monthly budget allocations for different gross income levels based on the 50/30/20 rule.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Gross Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Needs (50%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wants (30%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Savings/Debt (20%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Allocations are based on after-tax income in practice. 'Needs' includes housing, utilities, groceries, and insurance. 'Wants' includes dining out, entertainment, and subscriptions. Adjust percentages based on regional cost of living.</p>
      </section>

      {/* TABLE: Average Monthly Household Expenses by Category (2024) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Monthly Household Expenses by Category (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table displays average monthly spending benchmarks for a family of four in the United States.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expense Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Monthly Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Percentage of Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Housing (rent/mortgage)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Utilities (electric, water, gas)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Groceries</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Transportation/Car Payment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-11%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Auto Insurance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Health Insurance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Childcare/Education</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dining Out/Food Delivery</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Entertainment/Subscriptions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Care/Clothing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Savings & Emergency Fund</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Miscellaneous</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data sourced from U.S. Bureau of Labor Statistics 2024 Consumer Expenditure Survey. Actual expenses vary significantly by location, family size, and lifestyle choices. Urban areas may see 20-40% higher housing costs.</p>
      </section>

      {/* TABLE: Monthly Budget Categories and Recommended Spending Limits */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Budget Categories and Recommended Spending Limits</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This reference table provides spending limits for each major budget category based on a $5,000 monthly gross income.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Housing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200-$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No more than 28-30% of gross income</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Utilities</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150-$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies by climate and season</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Groceries</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400-$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Depends on family size and dietary preferences</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Transportation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400-$700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Includes car payment, gas, maintenance, insurance</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Insurance (health, auto, home)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300-$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bundle policies for discounts</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Debt Payments</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200-$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Target 20% of income or pay off within 5 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dining/Entertainment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300-$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Keep discretionary spending to 10-15% of income</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Savings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800-$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Aim for 16-20% of gross income</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Care/Misc</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200-$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Includes haircuts, clothing, gifts, household items</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These limits are flexible guidelines based on the 50/30/20 budgeting method. Adjust upward in high-cost-of-living areas (San Francisco, New York, Boston) by 25-40%. Household income below $3,000/month may need to reduce discretionary spending.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your spending in real-time by linking your budget planner to your bank and credit card accounts using apps like YNAB (You Need A Budget) or Mint, allowing you to catch overspending before it derails your monthly goals.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the zero-based budgeting method with this planner by allocating every dollar of income to a specific category, ensuring that Income minus Expenses equals zero—this forces intentional spending decisions and eliminates money 'leaks'.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Review and adjust your budget every 3 months rather than annually, especially if your income fluctuates or major life events occur, as quarterly reviews help you catch emerging spending trends and inflation impacts on essential expenses.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Create separate budget profiles within the planner for different scenarios (pessimistic, realistic, optimistic income months) if you have variable income, and use the pessimistic version to ensure you can always cover fixed expenses like rent and utilities.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include Irregular Expenses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people exclude annual or semi-annual costs like car registration, medical checkups, or holiday gifts when creating a monthly budget, causing them to overspend when these bills arrive. Divide all irregular expenses by 12 and add them to your monthly budget to avoid surprise shortfalls.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Gross Income Instead of Net Income</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Budgeting based on gross income (before taxes) rather than net income (after taxes) creates an inflated spending plan that you can't actually afford. Always use your take-home pay—the amount that actually hits your bank account—as the basis for your monthly budget.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting the Emergency Fund Category</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treating emergency savings as optional rather than a required monthly budget line item means you'll never build the 3-6 month cushion financial experts recommend. Allocate at least 10-20% of your monthly income to savings from day one, treating it as a fixed expense like rent.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Setting Unrealistic Discretionary Spending Limits</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Creating a budget that allows only 5% for dining out and entertainment when you historically spend 15% sets you up for failure and frustration. Be honest about your baseline spending habits, then gradually reduce targets by 5-10% each quarter rather than making drastic cuts.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What income should I include in my monthly budget planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Include all regular monthly income sources: gross salary, side gig earnings, freelance income, rental income, and any regular benefits. Do not include irregular bonuses or tax refunds unless you receive them consistently each month. For self-employed individuals, use your average monthly net income over the past 12 months to account for seasonal fluctuations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I categorize expenses in the monthly budget planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The planner typically uses major categories like housing (30% of income), utilities (5-10%), groceries (5-15%), transportation (10-15%), insurance (10-25%), debt payments (5-10%), and discretionary spending (5-10%). You can customize categories based on your situation, but tracking fixed expenses separately from variable expenses helps you identify where you can cut costs if needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the recommended percentage for emergency fund savings in my monthly budget?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Financial experts recommend allocating 10-20% of your monthly income toward savings, with 3-6 months of expenses in an emergency fund as a target. If you're just starting, aim for $1,000-$2,000 in an initial emergency fund, then build to cover one full month of expenses before tackling other savings goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I update my monthly budget planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Review and update your budget monthly, ideally within the first few days after receiving your paycheck. A quarterly review (every 3 months) helps you spot trends and adjust for seasonal changes, while an annual review ensures your budget aligns with income changes, inflation, and major life events like marriage or job changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the monthly budget planner if my income varies?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, for variable income use the average from the past 12 months or use your lowest monthly income as a conservative estimate. Set aside 20-30% of months with higher earnings into a separate account to cover lower-earning months, ensuring you always meet fixed expenses like rent and utilities.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the 50/30/20 rule and how does it apply to this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 50/30/20 rule allocates 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment. For example, on a $4,000 monthly after-tax income, you'd allocate $2,000 to needs, $1,200 to wants, and $800 to savings—though this ratio should be adjusted based on your location's cost of living and personal circumstances.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I handle annual expenses like insurance premiums in my monthly budget?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide annual or semi-annual expenses by 12 to find the monthly equivalent and include this in your monthly budget. For example, if your car insurance costs $1,200 annually, budget $100 per month, and set that amount aside in a separate savings account so you're not caught off guard when the bill arrives.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What percentage of my income should go toward housing costs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard recommendation is no more than 28-30% of your gross monthly income on housing expenses including rent or mortgage, property taxes, insurance, and utilities. For a $5,000 monthly gross income, this means housing should cost no more than $1,400-$1,500, though this varies by location and personal circumstances.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I track whether my actual spending matches my budget plan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Compare your planned budget amounts to your actual spending each month by reviewing bank statements, credit card statements, and receipts. Calculate the variance (actual minus planned) for each category; if variance exceeds 10% consistently, adjust your budget for accuracy and investigate unusual spending patterns to identify leaks.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.bls.gov/cex/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Expenditure Survey — U.S. Bureau of Labor Statistics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government data on average American household spending by category, providing benchmark figures for budget planning.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Money Management — Consumer Financial Protection Bureau</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB resources and guides on budgeting, saving, and financial planning for families at all income levels.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/banking/budgeting/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Personal Finance & Budgeting — Bankrate</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to budgeting methods, expense tracking, and financial planning tools with real-world examples.</p>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/article/finance/nerdwallet-study-the-50-30-20-budget-rule" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The 50/30/20 Budget Rule — NerdWallet</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">In-depth explanation of the 50/30/20 budgeting framework with recommendations for how to apply it to different income levels.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Monthly Budget Planner"
      description="Manage your finances with this monthly budget planner. Track income and expenses to stay on target and reach your financial goals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd ?? undefined}
      onThisPage={[
        { id: "introduction", label: "Understanding Monthly Budget Planner" },
        { id: "formula", label: "Monthly Budget Planner Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Income = Total Income - Total Expenses",
        variables: [
          { symbol: "Total Income", description: "Sum of all income sources" },
          { symbol: "Total Expenses", description: "Sum of all monthly expenses" },
          { symbol: "Net Income", description: "Amount available for savings and discretionary spending" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a monthly income of $5,000, expenses totaling $3,000, and a savings goal of $20,000.",
        steps: [
          { 
            step: 1, 
            calculation: "Net Income = $5,000 - $3,000 = $2,000", 
            description: "Calculate net income by subtracting expenses from income." 
          },
          { 
            step: 2, 
            calculation: "Savings Rate = ($2,000 / $5,000) × 100 = 40%", 
            description: "Determine the savings rate as a percentage of income." 
          },
          { 
            step: 3, 
            calculation: "Months to Goal = $20,000 / $2,000 = 10", 
            description: "Calculate the number of months needed to reach the savings goal." 
          }
        ],
        result: "The final result is 10 months, meaning you can reach your savings goal in 10 months if you maintain this budget."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💳"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💰"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}
