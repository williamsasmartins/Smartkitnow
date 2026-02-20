import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Calendar, Percent, HelpCircle, BookOpen, Info, CheckCircle, TrendingUp, Share2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CompoundInterestCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();

  // STATE
  const [inputs, setInputs] = useState({
    principal: searchParams.get("principal") || "",
    rate: searchParams.get("rate") || "",
    time: searchParams.get("time") || "",
    compoundingFrequency: searchParams.get("frequency") || "yearly"
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-calculate on mount if params exist
  useEffect(() => {
    if (searchParams.size > 0 && inputs.principal && inputs.rate && inputs.time) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // FAQ DATA
  const faqs = [
    {
      question: "What is compound interest?",
      answer: "Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. It allows your money to grow faster over time compared to simple interest, as you earn interest on your interest."
    },
    {
      question: "How does compounding frequency affect my investment?",
      answer: "The more frequently interest is compounded, the more interest you earn. For example, interest compounded daily will yield a higher return than interest compounded yearly, because the interest is added to the principal more often, allowing it to start earning interest sooner."
    },
    {
      question: "What is the formula for compound interest?",
      answer: "The formula for compound interest is A = P(1 + r/n)^(nt), where A is the future value of the investment/loan, P is the principal investment amount, r is the annual interest rate (decimal), n is the number of times that interest is compounded per unit t, and t is the time the money is invested or borrowed for."
    },
    {
      question: "Can I lose money with compound interest?",
      answer: "Compound interest itself is a mechanism for growth, but if you are investing in assets that can lose value (like stocks), your principal can decrease. However, in a savings account or CD with a guaranteed rate, compound interest will only increase your balance."
    },
    {
      question: "What is the difference between simple and compound interest?",
      answer: "Simple interest is calculated only on the principal amount, whereas compound interest is calculated on the principal plus any accumulated interest. Over long periods, compound interest results in significantly higher returns."
    },
    {
      question: "How can I maximize my compound interest earnings?",
      answer: "To maximize earnings, start saving early, contribute regularly, choose accounts with higher interest rates, and opt for more frequent compounding intervals (e.g., daily or monthly instead of yearly)."
    },
    {
      question: "Does inflation affect compound interest?",
      answer: "Yes, inflation reduces the purchasing power of your money over time. While compound interest grows your nominal balance, it's important to consider the 'real' rate of return, which is the interest rate minus the inflation rate."
    },
    {
      question: "Is compound interest relevant for loans?",
      answer: "Yes, compound interest works against you when you have debt. Credit cards and loans often use compound interest, meaning you pay interest on the interest charged, which can cause debt to grow rapidly if not paid off."
    }
  ];

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
    const principal = parseFloat(inputs.principal) || 0;
    const rate = parseFloat(inputs.rate) / 100 || 0;
    const time = parseFloat(inputs.time) || 0;
    const n = inputs.compoundingFrequency === "yearly" ? 1 : inputs.compoundingFrequency === "monthly" ? 12 : 365;

    // Validate
    if (principal <= 0 || rate <= 0 || time <= 0) {
      return {
        mainResult: 0,
        totalInterest: 0,
        futureValue: 0,
        scheduleData: []
      };
    }

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const futureValue = principal * Math.pow((1 + rate / n), n * time);
    const totalInterest = futureValue - principal;

    // Generate schedule data if applicable
    const scheduleData: { period: number; accumulated: string; interest: string }[] = [];
    const chartData: { year: number; Principal: number; Interest: number }[] = [];

    for (let i = 0; i < time * n; i++) {
      const period = i + 1;
      const accumulated = principal * Math.pow((1 + rate / n), period);
      const interestAmount = accumulated - principal;

      // Only push to chart data for yearly points or if total points are few, to avoid overcrowding
      // Actually, Recharts handles many points okay, but let's do yearly points for clean chart
      // If n (frequency) is monthly (12), we want periods 12, 24, 36...
      if (period % n === 0) {
        chartData.push({
          year: period / n,
          Principal: principal,
          Interest: parseFloat(interestAmount.toFixed(2)),
        });
      }

      scheduleData.push({
        period,
        accumulated: formatCurrency(accumulated),
        interest: formatCurrency(interestAmount),
      });
    }

    return {
      mainResult: futureValue,
      totalInterest,
      futureValue,
      scheduleData,
      chartData
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
    setInputs({ principal: "", rate: "", time: "", compoundingFrequency: "yearly" });
    setSearchParams({});
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (inputs.principal) params.set("principal", inputs.principal);
    if (inputs.rate) params.set("rate", inputs.rate);
    if (inputs.time) params.set("time", inputs.time);
    params.set("frequency", inputs.compoundingFrequency);

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${params.toString()}`;

    // Update URL without reloading
    window.history.replaceState({}, "", newUrl);

    // Copy to clipboard
    navigator.clipboard.writeText(newUrl);
    toast.success("Link copied to clipboard!");
  };

  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Principal Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.principal}
              onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600" />
              Annual Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.rate}
              onChange={(e) => setInputs({ ...inputs, rate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600" />
              Time (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.time}
              onChange={(e) => setInputs({ ...inputs, time: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600" />
              Compounding Frequency
            </Label>
            <select
              value={inputs.compoundingFrequency}
              onChange={(e) => setInputs({ ...inputs, compoundingFrequency: e.target.value })}
              className="text-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="daily">Daily</option>
            </select>
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
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 px-3"
          title="Share result"
        >
          <Share2 className="h-4 w-4" />
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
                      Future Value
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.futureValue)}
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
                      Total Interest Earned
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalInterest)}
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
                      Principal Amount
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(parseFloat(inputs.principal))}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* VISUALIZATION CHART */}
          {results.chartData && results.chartData.length > 0 && (
            <Card className="mt-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Investment Growth Over Time
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[350px] w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={results.chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="year"
                      label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={12}
                      tickFormatter={(value) => `$${value / 1000}k`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                      itemStyle={{ color: "#111827" }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Principal" stackId="a" fill="#3b82f6" name="Initial Principal" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Interest" stackId="a" fill="#10b981" name="Compound Interest" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* AMORTIZATION/SCHEDULE TABLE (if applicable) */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Accumulation Schedule
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
                        : `Show All ${results.scheduleData.length} Periods`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Period</TableHead>
                        <TableHead className="font-semibold">Accumulated Amount</TableHead>
                        <TableHead className="font-semibold">Interest Earned</TableHead>
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
                            <TableCell className="font-medium">{row.period}</TableCell>
                            <TableCell>{row.accumulated}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {row.interest}
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">

      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Compound Interest Calculator
        </h2>

        <p className="mb-6">
          The Compound Interest Calculator is an essential tool for anyone looking to understand the growth of their investments over time. By calculating compound interest, this tool allows you to see how your initial investment grows as interest is added to the principal amount, and then interest is calculated on the new total. This is a powerful concept in finance, as it can significantly increase the value of your investments over time. Whether you're planning for retirement, saving for a major purchase, or simply looking to grow your wealth, understanding compound interest is crucial.
        </p>

        <p className="mb-6">
          Accurate calculations are vital when it comes to financial planning. The compound interest formula takes into account the principal amount, the interest rate, the time period, and the frequency of compounding. Small errors in any of these inputs can lead to significant discrepancies in the final result. This calculator helps ensure that you have precise and reliable data to base your financial decisions on. For instance, using the <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> alongside this tool can provide a comprehensive view of your financial commitments and growth potential.
        </p>

        <p className="mb-6">
          To use this calculator effectively, gather information about your initial investment (principal), the annual interest rate, the number of years you plan to invest, and how often the interest is compounded (yearly, monthly, or daily). Enter these values into the calculator to see how your investment will grow over time. For more detailed financial planning, consider using the <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> to understand how your investments can impact your mortgage payments.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5" />
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. Even a small mistake in the interest rate or compounding frequency can lead to vastly different outcomes. This calculator is a tool to help guide your decisions, but it should be used in conjunction with professional financial advice for the best results.
          </p>
        </div>

        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs as your financial situation changes. For example, if you receive a windfall or your interest rate changes, update the calculator to see how these changes affect your investment growth. Understanding the impact of different compounding frequencies can also help you choose the best investment strategy. Consider using the <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> to explore how additional contributions can accelerate your investment growth.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Compound Interest Calculator Formula
        </h2>

        <p className="mb-6">
          The compound interest formula is a fundamental concept in finance, used to calculate the future value of an investment based on periodic compounding. The formula is expressed as A = P(1 + r/n)^(nt), where A is the future value of the investment, P is the principal amount, r is the annual interest rate, n is the number of times interest is compounded per year, and t is the time in years. This formula is widely used because it accurately reflects the exponential growth of investments over time.
        </p>

        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          A = P(1 + r/n)^(nt)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>P = Principal amount (initial investment)</li>
              <li>r = Annual interest rate (decimal)</li>
              <li>n = Number of compounding periods per year</li>
              <li>t = Time in years</li>
              <li>A = Future value of the investment</li>
            </ul>
          </div>
        </div>

        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the future value of an investment. The principal amount (P) is the initial sum of money invested, and it serves as the base for calculating interest. The annual interest rate (r) is expressed as a decimal, so a 5% interest rate would be 0.05. The number of compounding periods per year (n) affects how often interest is calculated and added to the principal. Common compounding frequencies include yearly, monthly, and daily. The time (t) is the duration of the investment in years. As these variables change, so does the future value, illustrating the power of compound interest.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>

        <p className="mb-6">
          Understanding the factors that influence compound interest is essential for maximizing your investment returns. These factors include the principal amount, interest rate, compounding frequency, time, and external economic conditions. Each of these elements can significantly impact the growth of your investment, and understanding their interplay can help you make informed financial decisions.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Principal Amount
        </h3>
        <p className="mb-4">
          The principal amount is the initial sum of money invested or borrowed. It serves as the foundation for calculating interest. A larger principal amount will result in more interest earned over time, assuming all other factors remain constant. For example, investing $10,000 at a 5% annual interest rate will yield more interest than investing $5,000 at the same rate.
        </p>
        <p className="mb-6">
          To optimize your investment, consider increasing your principal amount whenever possible. This could involve making additional contributions or reinvesting dividends. Using tools like the <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> can help you understand the impact of different principal amounts on your financial goals.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is the percentage at which your investment grows annually. Higher interest rates lead to faster growth, while lower rates result in slower accumulation. For instance, an investment with a 7% interest rate will grow more quickly than one with a 3% rate, assuming all other factors are equal.
        </p>
        <p className="mb-6">
          Interest rates can vary based on market conditions and the type of investment. It's important to shop around for the best rates and consider the risk associated with higher returns. Comparing different investment options using the <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a> can provide insights into potential savings and growth opportunities.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Compounding Frequency
        </h3>
        <p className="mb-4">
          Compounding frequency refers to how often interest is calculated and added to the principal. Common frequencies include yearly, monthly, and daily. More frequent compounding results in more interest being added to the principal, leading to faster growth. For example, daily compounding will yield more interest than monthly compounding, given the same rate and principal.
        </p>
        <p className="mb-6">
          When selecting an investment, consider the compounding frequency as it can significantly impact your returns. Opt for investments with more frequent compounding to maximize growth. Understanding the effect of compounding frequency can be enhanced by using the <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>, which provides insights into how different compounding frequencies affect loan payments and interest.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Time
        </h3>
        <p className="mb-6">
          Time is one of the most critical factors in compound interest calculations. The longer your money is invested, the more time it has to grow. This is due to the exponential nature of compounding, where interest is calculated on both the initial principal and the accumulated interest from previous periods. For example, an investment held for 20 years will grow significantly more than one held for 10 years, even if the principal and interest rate are the same.
        </p>
        <p className="mb-6">
          To maximize the benefits of compound interest, start investing as early as possible and allow your investments to grow over time. This long-term approach can lead to substantial wealth accumulation. Consider using the <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> to explore how additional contributions can further enhance your investment growth over time.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          External Economic Conditions
        </h3>
        <p className="mb-6">
          External economic conditions, such as inflation, interest rate changes, and market volatility, can also impact your investment's growth. Inflation can erode the purchasing power of your returns, while changes in interest rates can affect the growth rate of your investment. Market volatility can lead to fluctuations in the value of your investment, especially if it's tied to stocks or other market-dependent assets.
        </p>
        <p className="mb-6">
          To mitigate the impact of external conditions, diversify your investments across different asset classes and consider inflation-protected securities. Staying informed about economic trends and adjusting your investment strategy accordingly can help protect your portfolio from adverse conditions. Utilizing tools like the <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> can provide insights into how economic changes might affect your financial obligations and investment growth.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0" />
                {faq.question}
              </h3>
              <div
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 space-y-3 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: REFERENCES WITH DESCRIPTIONS (MANDATORY) */}
      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Official References & Resources
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.federalreserve.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic conditions and regulatory guidelines affecting financial markets.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.consumerfinance.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Consumer Financial Protection Bureau - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources for financial literacy.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.fdic.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                FDIC - Banking Regulations
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Information on banking regulations and deposit insurance to safeguard your investments.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.irs.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Internal Revenue Service - Tax Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information to help you understand your tax obligations.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.investopedia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Investopedia - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained for better financial decision-making.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.nerdwallet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                NerdWallet - Personal Finance
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers to make informed financial choices.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Compound Interest Calculator"
      description="Calculate the power of compound interest. See how your investments grow over time with daily, monthly, or yearly compounding."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Compound Interest Calculator" },
        { id: "formula", label: "Compound Interest Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "A = P(1 + r/n)^(nt)",
        variables: [
          { symbol: "P", description: "Principal amount (initial investment)" },
          { symbol: "r", description: "Annual interest rate (decimal)" },
          { symbol: "n", description: "Number of compounding periods per year" },
          { symbol: "t", description: "Time in years" },
          { symbol: "A", description: "Future value of the investment" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have $10,000 to invest at an annual interest rate of 5%, compounded monthly for 10 years.",
        steps: [
          {
            step: 1,
            calculation: "10,000 × (1 + 0.05/12)^(12×10)",
            description: "Calculate the future value using the compound interest formula."
          },
          {
            step: 2,
            calculation: "10,000 × (1 + 0.004167)^(120)",
            description: "Simplify the interest rate per period and the number of periods."
          },
          {
            step: 3,
            calculation: "10,000 × 1.647009",
            description: "Calculate the compounded amount over the total periods."
          }
        ],
        result: "The final result is approximately $16,470.09, meaning your investment has grown by $6,470.09 over 10 years."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💳" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}