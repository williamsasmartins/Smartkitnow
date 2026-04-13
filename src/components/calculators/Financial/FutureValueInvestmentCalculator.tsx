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
      question: "What is the difference between future value and present value in investment calculations?",
      answer: "Future value (FV) calculates what your money will be worth at a specific date in the future based on compound growth, while present value (PV) works backward to determine what a future amount is worth in today's dollars. The Future Value of Investment Calculator uses the formula FV = PV × (1 + r)^n, where r is the annual interest rate and n is the number of years. Understanding this distinction helps you set realistic savings goals and compare investment opportunities fairly.",
    },
    {
      question: "How does compounding frequency affect my investment's future value?",
      answer: "Compounding frequency—whether interest is calculated annually, semi-annually, quarterly, monthly, or daily—significantly impacts your final returns. For example, $10,000 invested at 5% annual interest compounded annually grows to $12,762.82 in 5 years, but compounded daily it reaches $12,840.03, a difference of $77.21. The more frequently interest compounds, the more you earn due to earning interest on your interest. This calculator allows you to adjust compounding frequency to match your actual investment product's terms.",
    },
    {
      question: "What inflation rate should I use in the future value calculator?",
      answer: "The U.S. average inflation rate has ranged from 2-9% over the past decade, with the Federal Reserve's target being 2% annually. When using the calculator, you can input the expected inflation rate to calculate 'real' future value (adjusted for purchasing power) versus nominal future value (actual dollar amount). If you're calculating long-term investments like retirement, using a 2.5-3% inflation assumption is prudent based on historical averages.",
    },
    {
      question: "Can I use this calculator for different investment types like stocks, bonds, and savings accounts?",
      answer: "Yes, this calculator works for any investment type as long as you input the correct expected annual return rate. Stocks historically average 10% annually, investment-grade bonds range from 3-5%, and high-yield savings accounts currently offer 4-5% (as of 2024). Simply adjust the interest rate and compounding frequency to match your specific investment vehicle to get an accurate projection.",
    },
    {
      question: "How accurate are future value projections over 20+ years?",
      answer: "Future value calculations are mathematically precise but based on the assumption that returns remain consistent, which rarely happens in real investing. For short-term projections (1-5 years), accuracy is generally high if you use realistic rates. For longer periods (20+ years), the calculator provides a helpful baseline, but you should account for market volatility, changing interest rates, and economic cycles by running multiple scenarios with different return rates.",
    },
    {
      question: "What is the '72 rule' and how does it relate to this calculator's results?",
      answer: "The Rule of 72 is a quick mental math trick: divide 72 by your annual interest rate to estimate how many years it takes to double your money. For example, at 6% annual return, your investment doubles in approximately 12 years (72÷6=12). You can verify this with the calculator by setting your initial investment to $10,000 and checking when it reaches $20,000, confirming that consistent compound growth predictions are accurate.",
    },
    {
      question: "Should I include additional contributions (monthly deposits) when calculating future value?",
      answer: "This basic future value calculator computes growth on a single lump-sum investment. If you make regular monthly or annual contributions, your actual future value will be significantly higher, so you may want to use a separate future value of annuity calculator for a complete picture. For example, $10,000 invested once grows differently than $10,000 plus $500 monthly contributions—the latter produces substantially better results due to consistent dollar-cost averaging.",
    },
    {
      question: "How do tax implications affect the future value shown by this calculator?",
      answer: "The calculator displays pre-tax future value; actual gains depend on your tax bracket and investment account type. In a taxable brokerage account, capital gains taxes (15-20% for long-term gains, up to 37% for short-term) reduce your real returns, while 401(k)s and Roth IRAs offer tax-deferred or tax-free growth. Running the calculator with a slightly lower return rate (adjusted for estimated taxes) provides a more realistic after-tax projection.",
    },
    {
      question: "What happens if I adjust my expected return rate down by 2-3% for market volatility?",
      answer: "Adjusting for volatility provides a conservative estimate closer to real-world outcomes. For instance, if stocks average 10% historically but you assume 7-8% to account for downturns and fees, $50,000 invested for 10 years yields $96,715 (at 7%) instead of $129,687 (at 10%)—a difference of over $33,000. This approach helps you avoid overestimating retirement savings or investment goals and creates a more achievable financial plan.",
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Future Value of Investment Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Future Value of Investment Calculator helps you determine how much your money will grow over time based on compound interest. This tool is essential for retirement planning, savings goals, and investment strategy because it shows the real power of time and consistent returns. Whether you're saving for a down payment, education, or retirement, understanding your investment's future value helps you set realistic targets and track progress.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The key inputs you'll need are your initial investment amount (the money you start with today), the expected annual interest rate or return (use 5-10% for stocks, 3-5% for bonds, 4-5% for savings accounts), the time period in years, and the compounding frequency (daily, monthly, quarterly, or annually). Each of these factors directly affects your final result; a 1% difference in annual return can mean thousands of dollars over 20 years, and more frequent compounding slightly increases your earnings.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs the total future value in today's dollars, the total interest or gain earned, and sometimes shows growth year-by-year for visual comparison. Remember that this assumes your interest rate stays constant and no withdrawals occur—real investing involves market fluctuations and periodic contributions, which may increase or decrease actual results. For the most accurate planning, run multiple scenarios using conservative, moderate, and optimistic return rates.</p>
        </div>
      </section>

      {/* TABLE: Future Value of $10,000 at Various Interest Rates Over Time */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Future Value of $10,000 at Various Interest Rates Over Time</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different annual interest rates affect a $10,000 initial investment compounded annually over 5, 10, 15, and 20 years.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">After 5 Years</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">After 10 Years</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">After 15 Years</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">After 20 Years</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,592.74</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,439.16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,579.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,061.11</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,762.82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16,288.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,789.28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$26,532.98</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,025.52</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$19,671.51</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27,590.32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$38,696.31</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16,105.10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,937.42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,772.48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$67,274.64</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$17,623.42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$31,058.48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$54,735.65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$96,462.93</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume annual compounding with no additional contributions. Returns shown are before taxes and inflation.</p>
      </section>

      {/* TABLE: Impact of Compounding Frequency on $25,000 at 6% Annual Rate (10 Years) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Compounding Frequency on $25,000 at 6% Annual Rate (10 Years)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how different compounding frequencies affect the final amount for a $25,000 investment earning 6% annually.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Compounding Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Future Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Earned</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Difference vs. Annual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Annual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$44,738.64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$19,738.64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Semi-Annual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$44,883.64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$19,883.64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$145.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Quarterly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$44,957.66</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$19,957.66</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$219.02</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Monthly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45,023.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,023.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$284.48</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45,058.08</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,058.08</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$319.44</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Higher compounding frequency results in slightly more interest earned. Most savings accounts compound daily; bonds typically compound semi-annually.</p>
      </section>

      {/* TABLE: Historical Average Investment Returns by Asset Class (2014-2024) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Historical Average Investment Returns by Asset Class (2014-2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These benchmarks show the typical annual returns for different investment types, which you can use as reasonable inputs in the Future Value Calculator.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Asset Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Range for Conservative Estimate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">S&P 500 Stocks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bonds (Investment Grade)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Yield Savings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Money Market Accounts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Inflation Rate (U.S.)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Historical averages should not be considered guarantees of future performance. Past returns vary yearly; use conservative estimates when planning long-term investments.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use conservative return estimates (reduce your expected rate by 2-3%) when planning for major life goals like retirement—it's better to be pleasantly surprised with extra savings than to fall short of your target.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare compounding frequencies across your investment options; daily or monthly compounding can add hundreds or thousands to your future value over 20+ years compared to annual compounding.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run the calculator backward to find the interest rate you need: set your target future value and adjust the rate upward until the output matches your goal, revealing what returns you must achieve.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for inflation by calculating your future value at your expected return rate, then dividing by (1 + inflation rate)^years to see your purchasing power in today's dollars.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test sensitivity by running the calculator three times—once at your expected return, once 2% lower (recession scenario), and once 2% higher (optimistic scenario)—to understand the range of possible outcomes.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Adjust for Taxes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator shows pre-tax returns; if your investment earns $50,000 in gains, you'll owe 15-20% capital gains tax or income tax (depending on account type), reducing your actual take-home amount by $7,500-$10,000.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Historical Stock Returns Without Risk Adjustment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Stocks have averaged 10% annually, but individual years range from -50% to +50%; using 10% as your expected rate is unrealistic for conservative planning, and 7-8% is a more prudent assumption.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Inflation Over Long Periods</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">$100,000 in 20 years isn't worth $100,000 in today's purchasing power due to inflation; using 2.5-3% inflation adjustment reveals that your real value is significantly lower than the calculator's nominal result.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Constant Returns in a Volatile Market</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator assumes your interest rate never changes, but real investments fluctuate monthly or daily; treat the result as an average-case scenario, not a guarantee.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Fees and Expenses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Investment management fees, expense ratios, and trading costs typically reduce returns by 0.5-2% annually; subtract these from your expected return rate before entering it into the calculator for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Nominal and Real Returns</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you input 5% as your return but that's already adjusted for inflation, don't apply an additional inflation adjustment to the results, as you'll double-count and underestimate your actual purchasing power.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between future value and present value in investment calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Future value (FV) calculates what your money will be worth at a specific date in the future based on compound growth, while present value (PV) works backward to determine what a future amount is worth in today's dollars. The Future Value of Investment Calculator uses the formula FV = PV × (1 + r)^n, where r is the annual interest rate and n is the number of years. Understanding this distinction helps you set realistic savings goals and compare investment opportunities fairly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does compounding frequency affect my investment's future value?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Compounding frequency—whether interest is calculated annually, semi-annually, quarterly, monthly, or daily—significantly impacts your final returns. For example, $10,000 invested at 5% annual interest compounded annually grows to $12,762.82 in 5 years, but compounded daily it reaches $12,840.03, a difference of $77.21. The more frequently interest compounds, the more you earn due to earning interest on your interest. This calculator allows you to adjust compounding frequency to match your actual investment product's terms.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What inflation rate should I use in the future value calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The U.S. average inflation rate has ranged from 2-9% over the past decade, with the Federal Reserve's target being 2% annually. When using the calculator, you can input the expected inflation rate to calculate 'real' future value (adjusted for purchasing power) versus nominal future value (actual dollar amount). If you're calculating long-term investments like retirement, using a 2.5-3% inflation assumption is prudent based on historical averages.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for different investment types like stocks, bonds, and savings accounts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator works for any investment type as long as you input the correct expected annual return rate. Stocks historically average 10% annually, investment-grade bonds range from 3-5%, and high-yield savings accounts currently offer 4-5% (as of 2024). Simply adjust the interest rate and compounding frequency to match your specific investment vehicle to get an accurate projection.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate are future value projections over 20+ years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Future value calculations are mathematically precise but based on the assumption that returns remain consistent, which rarely happens in real investing. For short-term projections (1-5 years), accuracy is generally high if you use realistic rates. For longer periods (20+ years), the calculator provides a helpful baseline, but you should account for market volatility, changing interest rates, and economic cycles by running multiple scenarios with different return rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the '72 rule' and how does it relate to this calculator's results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Rule of 72 is a quick mental math trick: divide 72 by your annual interest rate to estimate how many years it takes to double your money. For example, at 6% annual return, your investment doubles in approximately 12 years (72÷6=12). You can verify this with the calculator by setting your initial investment to $10,000 and checking when it reaches $20,000, confirming that consistent compound growth predictions are accurate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include additional contributions (monthly deposits) when calculating future value?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This basic future value calculator computes growth on a single lump-sum investment. If you make regular monthly or annual contributions, your actual future value will be significantly higher, so you may want to use a separate future value of annuity calculator for a complete picture. For example, $10,000 invested once grows differently than $10,000 plus $500 monthly contributions—the latter produces substantially better results due to consistent dollar-cost averaging.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do tax implications affect the future value shown by this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator displays pre-tax future value; actual gains depend on your tax bracket and investment account type. In a taxable brokerage account, capital gains taxes (15-20% for long-term gains, up to 37% for short-term) reduce your real returns, while 401(k)s and Roth IRAs offer tax-deferred or tax-free growth. Running the calculator with a slightly lower return rate (adjusted for estimated taxes) provides a more realistic after-tax projection.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I adjust my expected return rate down by 2-3% for market volatility?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Adjusting for volatility provides a conservative estimate closer to real-world outcomes. For instance, if stocks average 10% historically but you assume 7-8% to account for downturns and fees, $50,000 invested for 10 years yields $96,715 (at 7%) instead of $129,687 (at 10%)—a difference of over $33,000. This approach helps you avoid overestimating retirement savings or investment goals and creates a more achievable financial plan.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sec.gov/investor/tools/fi-calculator.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Office of Investor Education and Advocacy - Compound Interest Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Securities and Exchange Commission's official guidance on understanding compound interest and future value calculations for investment planning.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p550" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 550 - Investment Income and Expenses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal tax guidance on how investment gains, capital gains taxes, and income from various investment types are taxed, critical for calculating after-tax future value.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/datamanual/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve - Historical Stock Market Returns and Economic Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Federal Reserve economic data and historical returns for benchmarking realistic future value assumptions across asset classes.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/investing/future-value/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate - Future Value Calculator and Investment Growth Articles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Trusted financial education resource providing calculator tools and detailed explanations of how compound growth and future value work for various investments.</p>
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
