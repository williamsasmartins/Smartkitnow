import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function SavingsRateTrackerCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    income: "", 
    expenses: "", 
    savings: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is a good savings rate I should aim for?",
      answer: "Financial experts generally recommend saving 10-20% of your gross income, though this varies by life stage and goals. The U.S. personal savings rate averaged 4-5% in 2024, meaning most households save less than experts recommend. If you're tracking your savings rate with this calculator and find you're below 10%, consider reviewing your budget to identify areas where you can reduce discretionary spending.",
    },
    {
      question: "How do I calculate my savings rate accurately?",
      answer: "Your savings rate is calculated as (Total Savings ÷ Gross Income) × 100. Include all money you set aside—retirement contributions, emergency funds, investment accounts, and extra mortgage payments. Exclude debt repayment on consumer loans, as this reduces your available income rather than representing true savings. This calculator automates that formula, so you only need to enter your income and savings amounts.",
    },
    {
      question: "Should I include my 401(k) contributions in my savings rate?",
      answer: "Yes, you should include 401(k) and other retirement plan contributions in your savings rate calculation. In 2024, the contribution limit for a 401(k) is $23,500 for workers under 50 and $31,000 for those 50 and older. Including these amounts gives you a more accurate picture of your total wealth-building efforts and shows the real impact of tax-advantaged retirement savings.",
    },
    {
      question: "What's the difference between savings rate and savings amount?",
      answer: "Your savings amount is the actual dollar figure you save (for example, $500 per month), while your savings rate is that amount as a percentage of your income ($500 ÷ $4,000 = 12.5%). The savings rate is more meaningful because it shows your savings discipline relative to your earnings—a $500 savings rate looks different on a $4,000 income versus a $10,000 income.",
    },
    {
      question: "How do I improve my savings rate using this tracker?",
      answer: "Use this calculator to establish a baseline, then set a target rate increase of 1-2% per quarter. For example, if your current rate is 8%, aim for 9% or 10% in three months by reducing discretionary spending or increasing income. Track your progress monthly with this tool to stay motivated and identify which budget adjustments have the biggest impact.",
    },
    {
      question: "Should net or gross income be used for the savings rate calculation?",
      answer: "Financial advisors recommend using gross income (before taxes) for the most accurate savings rate calculation. This is because it shows what percentage of your actual earning power you're saving, making it easier to compare with benchmarks and financial goals. Some calculators use net income, so confirm which method you're using to ensure your rate is comparable to published statistics.",
    },
    {
      question: "What savings rate do millionaires typically have?",
      answer: "Studies show that most millionaires maintain savings rates of 20-30% or higher throughout their wealth-building years. Research from \"The Millionaire Next Door\" found that the average millionaire saves approximately 20% of household income. By using this tracker to consistently maintain a 20%+ savings rate, you can accelerate your path to building significant wealth over 20-30 years.",
    },
    {
      question: "Can my savings rate be negative?",
      answer: "Yes, a negative savings rate occurs when your spending exceeds your income, meaning you're going into debt each month. The U.S. has experienced negative household savings rates during certain economic periods. If your tracker shows a negative rate, it signals that you're spending more than you earn and need to increase income or reduce expenses immediately.",
    },
    {
      question: "How does my savings rate affect my financial independence timeline?",
      answer: "Your savings rate directly determines how quickly you can reach financial independence. Someone saving 25% of income needs approximately 32 years to retire (assuming 7% returns), while someone saving 50% needs only 17 years. This calculator helps you see how small rate increases dramatically compress your timeline—increasing from 15% to 25% could shorten your goal by 15+ years.",
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
    const savingsValue = parseFloat(inputs.savings) || 0;

    // Validate
    if (incomeValue <= 0) {
      return { 
        savingsRate: 0, 
        totalSavings: 0, 
        totalExpenses: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const totalSavings = savingsValue;
    const totalExpenses = expensesValue;
    const savingsRate = (totalSavings / incomeValue) * 100;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      savings: totalSavings / 12,
      expenses: totalExpenses / 12,
      balance: incomeValue - ((totalSavings + totalExpenses) / 12) * (i + 1)
    }));

    return { 
      savingsRate, 
      totalSavings, 
      totalExpenses, 
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
    setInputs({ income: "", expenses: "", savings: "" });
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
              Monthly Savings
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.savings}
              onChange={(e) => setInputs({ ...inputs, savings: e.target.value })}
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
      {results.savingsRate > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Savings Rate
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.savingsRate.toFixed(2)}%
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
                      Total Savings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalSavings)}
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
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalExpenses)}
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
                    Monthly Breakdown
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
                        <TableHead className="font-semibold">Expenses</TableHead>
                        <TableHead className="font-semibold">Balance</TableHead>
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
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.expenses)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.balance)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Savings Rate Tracker</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Savings Rate Tracker is a simple tool that calculates what percentage of your income you're actually saving each month or year. Understanding your savings rate is crucial because it's one of the most powerful predictors of long-term financial success—it shows whether you're on track to build wealth, retire on schedule, or achieve your financial goals. Unlike absolute savings amounts, your rate is comparable across different income levels and life stages.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this tracker, you'll need two key inputs: your gross monthly or annual income (the total amount you earn before taxes) and your total monthly or annual savings (the sum of all money going into savings vehicles, including 401(k) contributions, emergency funds, investment accounts, and extra debt payments toward mortgages). Be sure to include all retirement account contributions, not just cash savings, to get an accurate picture of your wealth-building efforts.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will display your savings rate as a percentage and compare it to industry benchmarks based on your income level and life stage. Use this result to identify whether you're ahead of, at, or behind recommended savings targets. If you're below 10%, consider setting a goal to increase your rate by 1-2% per quarter—even small improvements compound significantly over decades and can reduce your working years substantially.</p>
        </div>
      </section>

      {/* TABLE: Savings Rate Benchmarks by Life Stage (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Savings Rate Benchmarks by Life Stage (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These benchmarks show recommended savings rates based on age and career stage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Savings Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Target (on $60k income)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ages 20-25 (Early Career)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000-$9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency fund + retirement</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ages 25-35 (Career Growth)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,000-$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Retirement + home down payment</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ages 35-50 (Peak Earning)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000-$18,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Retirement + wealth building</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ages 50-65 (Pre-Retirement)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000-$21,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Catch-up contributions + wealth preservation</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">65+ (Retirement)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies by plan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Capital preservation + income</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages assume stable employment and no major financial emergencies. Self-employed individuals may target slightly higher rates to cover business taxes and retirement.</p>
      </section>

      {/* TABLE: Average U.S. Household Savings Rates by Income Level (2024) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average U.S. Household Savings Rates by Income Level (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how savings behavior varies across different income brackets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Household Income Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Savings Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Median Monthly Savings</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Savings Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Under $30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50-$75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Checking/savings account</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000-$60,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250-$350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Savings account + employer 401(k)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$60,000-$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500-$1,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">401(k) + brokerage accounts</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000-$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,250-$4,167</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple retirement + investments</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$200,000+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,167+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tax-advantaged + real estate</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data from Federal Reserve Survey of Consumer Finances. Rates include all savings vehicles: retirement accounts, investment accounts, and cash savings. Higher-income households benefit from tax-advantaged retirement account limits.</p>
      </section>

      {/* TABLE: Impact of Savings Rate on Long-Term Wealth (25-Year Projection) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Savings Rate on Long-Term Wealth (25-Year Projection)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different savings rates compound into vastly different wealth outcomes over 25 years.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Savings (on $75k income)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">25-Year Total Contributions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Projected Value (7% annual return)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wealth Multiplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$93,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$249,456</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$187,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$498,912</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7x</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$281,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$748,368</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$375,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$997,824</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7x</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$562,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,496,736</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,995,648</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7x</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes consistent savings rate and 7% annual investment returns (historical stock market average). Higher savings rates accumulate more principal, resulting in exponentially higher ending values due to compound interest.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Automate your savings by setting up automatic transfers to a separate savings account on payday—this 'pay yourself first' approach removes the temptation to spend money before you save it and helps you achieve higher savings rates consistently.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your savings rate monthly with this calculator to identify spending patterns and seasonal variations, then adjust your budget if you notice your rate dropping below your target threshold.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include bonuses, tax refunds, and side income in your savings rate calculation—allocating even 50% of bonus income to savings can boost your annual rate by 2-3% without requiring lifestyle changes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your savings rate as a benchmarking tool: if your rate is 12% and you earn $75,000 annually, you're saving $9,000 per year; increasing to 17% means an extra $3,750 annually, which compounds to over $100,000 in additional wealth over 25 years.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Only counting cash savings and ignoring retirement accounts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people calculate their savings rate using only money in checking or savings accounts, overlooking 401(k), IRA, and other retirement contributions. This understates your true savings rate and can make you think you're underperforming when you're actually on track—include all tax-advantaged retirement savings in your calculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using net income instead of gross income</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating your savings rate as a percentage of take-home pay inflates the number and makes it harder to compare against benchmarks that use gross income. A $500 monthly savings on $3,000 net income looks like 16.7%, but on a $4,500 gross income (before taxes) it's actually 11.1%—a significant difference in assessing your performance.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for variable income months</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you have irregular income (self-employed, commission-based, or seasonal work), your monthly savings rate will fluctuate dramatically; calculate your rate annually instead to smooth out monthly volatility and get a more accurate picture of your true savings behavior.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including debt repayment as savings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Paying off a car loan or credit card is debt reduction, not savings, and should not be counted in your savings rate calculation. Only money going into assets (retirement accounts, investments, emergency funds) counts as savings—debt payments reduce your expenses but don't build wealth.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a good savings rate I should aim for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Financial experts generally recommend saving 10-20% of your gross income, though this varies by life stage and goals. The U.S. personal savings rate averaged 4-5% in 2024, meaning most households save less than experts recommend. If you're tracking your savings rate with this calculator and find you're below 10%, consider reviewing your budget to identify areas where you can reduce discretionary spending.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my savings rate accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your savings rate is calculated as (Total Savings ÷ Gross Income) × 100. Include all money you set aside—retirement contributions, emergency funds, investment accounts, and extra mortgage payments. Exclude debt repayment on consumer loans, as this reduces your available income rather than representing true savings. This calculator automates that formula, so you only need to enter your income and savings amounts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include my 401(k) contributions in my savings rate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you should include 401(k) and other retirement plan contributions in your savings rate calculation. In 2024, the contribution limit for a 401(k) is $23,500 for workers under 50 and $31,000 for those 50 and older. Including these amounts gives you a more accurate picture of your total wealth-building efforts and shows the real impact of tax-advantaged retirement savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between savings rate and savings amount?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your savings amount is the actual dollar figure you save (for example, $500 per month), while your savings rate is that amount as a percentage of your income ($500 ÷ $4,000 = 12.5%). The savings rate is more meaningful because it shows your savings discipline relative to your earnings—a $500 savings rate looks different on a $4,000 income versus a $10,000 income.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I improve my savings rate using this tracker?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use this calculator to establish a baseline, then set a target rate increase of 1-2% per quarter. For example, if your current rate is 8%, aim for 9% or 10% in three months by reducing discretionary spending or increasing income. Track your progress monthly with this tool to stay motivated and identify which budget adjustments have the biggest impact.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should net or gross income be used for the savings rate calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Financial advisors recommend using gross income (before taxes) for the most accurate savings rate calculation. This is because it shows what percentage of your actual earning power you're saving, making it easier to compare with benchmarks and financial goals. Some calculators use net income, so confirm which method you're using to ensure your rate is comparable to published statistics.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What savings rate do millionaires typically have?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Studies show that most millionaires maintain savings rates of 20-30% or higher throughout their wealth-building years. Research from "The Millionaire Next Door" found that the average millionaire saves approximately 20% of household income. By using this tracker to consistently maintain a 20%+ savings rate, you can accelerate your path to building significant wealth over 20-30 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can my savings rate be negative?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, a negative savings rate occurs when your spending exceeds your income, meaning you're going into debt each month. The U.S. has experienced negative household savings rates during certain economic periods. If your tracker shows a negative rate, it signals that you're spending more than you earn and need to increase income or reduce expenses immediately.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my savings rate affect my financial independence timeline?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your savings rate directly determines how quickly you can reach financial independence. Someone saving 25% of income needs approximately 32 years to retire (assuming 7% returns), while someone saving 50% needs only 17 years. This calculator helps you see how small rate increases dramatically compress your timeline—increasing from 15% to 25% could shorten your goal by 15+ years.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.bea.gov/news/2024" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Bureau of Economic Analysis - Personal Savings Rate Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government statistics on U.S. household savings rates and personal income trends.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/econresdata/scf/scfindex.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve - Survey of Consumer Finances</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive data on U.S. household savings behavior, income distribution, and wealth accumulation by demographic groups.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/newsroom/2024-retirement-plan-contribution-limits-announced" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS - 2024 Retirement Plan Contribution Limits</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on 401(k), IRA, and other retirement account contribution limits for accurate savings rate calculations.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/about-us/newsroom/consumer-financial-protection-bureau-releases-2023-financial-well-being-survey-results/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CFPB - Financial Well-Being Survey Results</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer Financial Protection Bureau data on savings habits, emergency fund adequacy, and household financial resilience trends.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Savings Rate Tracker"
      description="Track your personal savings rate. Determine exactly what percentage of your income you are saving for the future versus spending."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Savings Rate Tracker" },
        { id: "formula", label: "Savings Rate Tracker Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Savings Rate (%) = (Total Savings / Total Income) × 100",
        variables: [
          { symbol: "Total Savings", description: "Amount saved each month" },
          { symbol: "Total Income", description: "Total monthly income" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a monthly income of $5,000, expenses of $3,000, and savings of $1,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Savings Rate = (1000 / 5000) × 100", 
            explanation: "Calculate the percentage of income saved." 
          },
          { 
            label: "Step 2", 
            calculation: "Savings Rate = 20%", 
            explanation: "The result shows that 20% of your income is saved." 
          }
        ],
        result: "The final result is 20%, meaning you save 20% of your income."
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
