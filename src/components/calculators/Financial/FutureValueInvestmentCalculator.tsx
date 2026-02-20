import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle, Share2, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

export default function FutureValueInvestmentCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();

  // STATE
  const [inputs, setInputs] = useState({
    principal: searchParams.get("principal") || "",
    rate: searchParams.get("rate") || "",
    years: searchParams.get("years") || "",
    contribution: searchParams.get("contribution") || ""
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-calculate
  useEffect(() => {
    if (searchParams.size > 0 && inputs.principal && inputs.rate && inputs.years) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const faqs = [
    {
      question: "What is the future value of investment calculator and why is it important?",
      answer: "The future value of investment calculator is a tool that estimates the growth of your investments over time, considering factors like initial principal, interest rate, and contributions. It's important because it helps you understand the potential outcomes of your investment strategies, allowing you to make informed financial decisions. By projecting future value, you can set realistic financial goals and adjust your strategies to achieve them. For more insights, explore our <a href=\"/financial/extra-payments-payoff\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Extra Payments & Payoff Time Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides accurate estimates based on the inputs you provide. However, it's important to note that actual investment performance can vary due to market conditions and other factors. For precise financial planning, consider consulting with a financial advisor. To enhance accuracy, use realistic inputs and update them regularly to reflect changes in your financial situation or market conditions."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you'll need your initial investment amount, expected annual interest rate, investment duration in years, and any regular monthly contributions. Accurate data ensures reliable projections, so gather information from your financial statements or consult with your financial advisor. If you're unsure about the interest rate, consider using historical averages or consult with a financial expert to determine a realistic estimate."
    },
    {
      question: "Can I use this calculator for retirement planning?",
      answer: "Yes, this calculator is a valuable tool for retirement planning. By estimating the future value of your investments, you can determine if your current savings strategy will meet your retirement goals. Adjusting your contributions or investment duration can help you achieve the desired retirement fund. For more comprehensive retirement planning, consider using our <a href=\"/financial/related-calculator-7\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">related retirement calculator</a> to explore additional strategies and scenarios."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using unrealistic interest rates, neglecting to account for inflation, and not updating inputs regularly. These errors can lead to inaccurate projections and misguided financial decisions. It's crucial to use realistic figures and review your inputs periodically. Avoid these pitfalls by consulting with financial experts and using historical data to inform your inputs. For more tips, explore our <a href=\"/financial/related-calculator-8\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">related calculator</a>."
    },
    {
      question: "How often should I recalculate?",
      answer: "It's advisable to recalculate your investment's future value at least annually or whenever there are significant changes in your financial situation or market conditions. Regular recalculations ensure your projections remain accurate and aligned with your financial goals. Consider setting a reminder to review your investment strategy and update your inputs regularly. This proactive approach helps you stay on track to achieve your financial objectives."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to assess whether your current investment strategy aligns with your financial goals. If the projected future value falls short, consider increasing your contributions or extending the investment duration. Alternatively, explore higher-yielding investment options. For personalized advice, consult with a financial advisor who can help you interpret the results and make informed decisions. For more guidance, visit our <a href=\"/financial/related-calculator-9\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">related calculator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives to this calculation method include using financial software or consulting with a financial advisor for personalized projections. These alternatives may offer more detailed analysis and consider additional factors like taxes and fees. While this calculator provides a solid estimate, exploring alternative methods can enhance your financial planning and provide a more comprehensive understanding of your investment's potential."
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
    const principalValue = parseFloat(inputs.principal) || 0;
    const rateValue = parseFloat(inputs.rate) / 100 || 0;
    const yearsValue = parseFloat(inputs.years) || 0;
    const contributionValue = parseFloat(inputs.contribution) || 0;

    // Validate
    if (principalValue < 0 || rateValue < 0 || yearsValue <= 0) {
      return {
        futureValue: 0,
        totalContributions: 0,
        totalInterest: 0,
        scheduleData: []
      };
    }

    // Perform calculations here
    const periods = yearsValue * 12;
    const monthlyRate = rateValue / 12;
    let futureValue = principalValue;
    let totalContributions = 0;
    let totalInterest = 0;

    // Explicitly type arrays to avoid 'never[]' errors
    const scheduleData: { month: number; contribution: string; interest: string; balance: string }[] = [];
    const chartData: { year: number; Principal: number; Contributions: number; Interest: number }[] = [];

    // Push initial state
    chartData.push({
      year: 0,
      Principal: principalValue,
      Contributions: 0,
      Interest: 0
    });

    for (let i = 0; i < periods; i++) {
      futureValue = futureValue * (1 + monthlyRate) + contributionValue;
      totalContributions += contributionValue;
      totalInterest = futureValue - principalValue - totalContributions;

      const currentMonth = i + 1;

      scheduleData.push({
        month: currentMonth,
        contribution: formatCurrency(contributionValue),
        interest: formatCurrency(futureValue - principalValue - totalContributions),
        balance: formatCurrency(futureValue)
      });

      // Add to chart data yearly
      if (currentMonth % 12 === 0) {
        chartData.push({
          year: currentMonth / 12,
          Principal: principalValue,
          Contributions: parseFloat(totalContributions.toFixed(2)),
          Interest: parseFloat(totalInterest.toFixed(2))
        });
      }
    }

    return {
      futureValue,
      totalContributions,
      totalInterest,
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
    setInputs({ principal: "", rate: "", years: "", contribution: "" });
    setSearchParams({});
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    if (inputs.principal) params.set("principal", inputs.principal);
    if (inputs.rate) params.set("rate", inputs.rate);
    if (inputs.years) params.set("years", inputs.years);
    if (inputs.contribution) params.set("contribution", inputs.contribution);

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
    navigator.clipboard.writeText(newUrl);
    toast.success("Link copied to clipboard!");
  };

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Initial Principal
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
              Number of Years
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.years}
              onChange={(e) => setInputs({ ...inputs, years: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-orange-600" />
              Monthly Contribution
            </Label>
            <Input
              type="number"
              placeholder="e.g., 200"
              value={inputs.contribution}
              onChange={(e) => setInputs({ ...inputs, contribution: e.target.value })}
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
      {results.futureValue > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>

          {/* VISUAL CHART */}
          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <BarChart2 className="h-5 w-5 text-blue-600" />
                Investment Growth Over Time
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                  <Bar dataKey="Principal" stackId="a" fill="#3b82f6" name="Initial Principal" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Contributions" stackId="a" fill="#8b5cf6" name="Contributions" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Interest" stackId="a" fill="#10b981" name="Interest Earned" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Future Value of Investment
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
                      Total Contributions
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalContributions)}
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
                      Total Interest Earned
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalInterest)}
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
                    Investment Growth Schedule
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
                        <TableHead className="font-semibold">Contribution</TableHead>
                        <TableHead className="font-semibold">Interest</TableHead>
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
                            <TableCell>{row.contribution}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {row.interest}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {row.balance}
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
          Understanding Future Value of Investment Calculator
        </h2>

        <p className="mb-6">
          The Future Value of Investment Calculator is a powerful tool designed to help you estimate the growth of your investments over time. By inputting your initial principal, expected annual interest rate, the number of years you plan to invest, and any regular contributions you intend to make, this calculator provides a comprehensive projection of your investment's future value. Whether you're planning for retirement, saving for a major purchase, or simply looking to grow your wealth, understanding the potential future value of your investments is crucial for making informed financial decisions.
        </p>

        <p className="mb-6">
          Accurate calculations are vital in the realm of investments. Even small errors can lead to significant financial discrepancies over time. For instance, underestimating the impact of compound interest can result in missed opportunities for growth. This calculator uses a standard formula to ensure precise calculations, helping you avoid costly mistakes. By understanding the potential outcomes of your investment strategies, you can better align your financial goals with realistic expectations. For more insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> to see how different interest rates affect loan repayments.
        </p>

        <p className="mb-6">
          To use this calculator effectively, gather information such as your initial investment amount, the expected annual interest rate, the duration of your investment, and any additional monthly contributions. Enter these values into the respective fields to calculate the future value. It's important to use realistic figures to ensure the accuracy of your projections. For instance, if you're unsure about the interest rate, consider using historical averages or consult with a financial advisor. For a deeper understanding of how contributions affect growth, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5" />
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Remember, the power of compound interest means that even small regular contributions can significantly increase the future value of your investment. Consistency is key, and starting early can provide a substantial advantage over time.
          </p>
        </div>

        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs to reflect changes in your financial situation or market conditions. Consider factors such as inflation, which can erode the real value of your returns. Additionally, review your investment strategy periodically to ensure it aligns with your evolving financial goals. By staying informed and proactive, you can optimize your investment outcomes and achieve greater financial security.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Future Value of Investment Calculator Formula
        </h2>

        <p className="mb-6">
          The formula used in this calculator is based on the future value of a series formula, which calculates the future value of an investment with regular contributions. This formula is widely recognized in financial planning and investment analysis due to its ability to account for compound interest over time. The standard formula is:
        </p>

        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          FV = P × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>FV = Future Value of the investment</li>
              <li>P = Principal investment amount</li>
              <li>r = Annual interest rate (decimal)</li>
              <li>n = Number of times interest is compounded per year</li>
              <li>t = Number of years the money is invested for</li>
              <li>PMT = Monthly contribution</li>
            </ul>
          </div>
        </div>

        <p className="mb-4">
          Each component of the formula plays a crucial role in determining the future value. The principal amount (P) is the initial sum invested, which grows over time through compound interest. The annual interest rate (r) is divided by the number of compounding periods per year (n) to determine the periodic interest rate. The number of years (t) represents the investment duration, while the monthly contribution (PMT) accounts for additional funds added regularly. Variations of this formula may be used for different compounding frequencies, such as quarterly or annually, depending on the investment terms.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>

        <p className="mb-6">
          Understanding the factors that influence your investment's future value is essential for making informed decisions. These factors interact in complex ways, affecting the growth trajectory of your investments. By analyzing each component, you can optimize your strategy to achieve your financial goals.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Initial Principal
        </h3>
        <p className="mb-4">
          The initial principal is the starting point of your investment. A larger principal provides a greater base for compound interest to act upon, leading to more significant growth over time. For example, an initial investment of $10,000 will grow more substantially than a $5,000 investment, assuming the same interest rate and duration.
        </p>
        <p className="mb-6">
          To maximize the impact of your principal, consider strategies to increase your initial investment, such as reallocating funds from lower-yielding accounts. For more insights on maximizing your principal, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate significantly impacts your investment's growth. Higher rates result in more substantial returns due to the compounding effect. For instance, an investment with a 7% annual interest rate will grow faster than one with a 5% rate over the same period.
        </p>
        <p className="mb-6">
          Interest rates can vary based on market conditions and investment types. It's crucial to research and compare rates across different financial products to ensure you're getting the best return. For a detailed comparison of interest rates, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Investment Duration
        </h3>
        <p className="mb-4">
          The duration of your investment plays a critical role in determining its future value. Longer investment periods allow more time for compound interest to accumulate, resulting in exponential growth. For example, investing for 30 years will yield significantly higher returns than investing for 10 years.
        </p>
        <p className="mb-6">
          To take full advantage of time, start investing as early as possible and maintain a long-term perspective. This approach minimizes the impact of short-term market fluctuations and maximizes growth potential. For strategies on optimizing investment duration, consult our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Regular Contributions
        </h3>
        <p className="mb-6">
          Regular contributions enhance the growth of your investment by adding more funds for compounding. Even small monthly contributions can significantly increase the future value over time. For instance, contributing an additional $200 monthly can lead to substantial growth over a 20-year period.
        </p>
        <p className="mb-6">
          To optimize contributions, set up automatic transfers from your checking account to your investment account. This strategy ensures consistency and helps you stay committed to your financial goals. For more tips on managing contributions, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Inflation
        </h3>
        <p className="mb-6">
          Inflation erodes the purchasing power of your returns, affecting the real value of your investment. It's essential to consider inflation when projecting future value, as it can significantly impact your financial goals. For example, an investment that grows by 5% annually may only yield a real return of 2% if inflation is 3%.
        </p>
        <p className="mb-6">
          To mitigate the effects of inflation, aim for investments that offer returns exceeding the inflation rate. Diversifying your portfolio across different asset classes can also help protect against inflationary pressures. For more information on inflation's impact, visit our <a href="/financial/related-calculator-6" className="text-blue-600 dark:text-blue-400 hover:underline">related calculator</a>.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
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
              <p
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3"
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
                Official data on economic indicators and financial market trends.
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
                Consumer Financial Protection Bureau - Financial Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources.
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
                Banking regulations and deposit insurance information.
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
                Official tax guidelines and deduction information.
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
                Investopedia - Investment Strategies
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained.
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
                Personal finance guides and comparison tools for consumers.
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
      title="Future Value of Investment Calculator"
      description="Estimate the future value of your investments. Calculate growth based on initial principal, periodic contributions, and expected interest rate."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Future Value of Investment Calculator" },
        { id: "formula", label: "Future Value of Investment Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]",
        variables: [
          { symbol: "FV", description: "Future Value of the investment" },
          { symbol: "P", description: "Principal investment amount" },
          { symbol: "r", description: "Annual interest rate (decimal)" },
          { symbol: "n", description: "Number of times interest is compounded per year" },
          { symbol: "t", description: "Number of years the money is invested for" },
          { symbol: "PMT", description: "Monthly contribution" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an initial investment of $10,000 with a 5% annual interest rate, compounded monthly, over 20 years with a $200 monthly contribution.",
        steps: [
          {
            label: "Step 1",
            calculation: "Calculate the future value of the principal: $10,000 × (1 + 0.05/12)^(12×20)",
            explanation: "Determine the growth of the initial investment over 20 years."
          },
          {
            label: "Step 2",
            calculation: "Calculate the future value of the contributions: $200 × [((1 + 0.05/12)^(12×20) - 1) / (0.05/12)]",
            explanation: "Determine the growth of the monthly contributions over 20 years."
          },
          {
            label: "Step 3",
            calculation: "Add the future values from Step 1 and Step 2 to get the total future value.",
            explanation: "Combine the growth of the principal and contributions for the final result."
          }
        ],
        result: "The final result is $132,000, meaning your investment will grow to this amount over 20 years."
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
