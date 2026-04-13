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
      question: "What is the compound interest formula used in this calculator?",
      answer: "This calculator uses the formula A = P(1 + r/n)^(nt), where A is the final amount, P is the principal, r is the annual interest rate, n is the number of times interest compounds per year, and t is time in years. For continuous compounding, it uses A = Pe^(rt). Understanding this formula helps you verify the calculator's outputs and adjust inputs based on your financial goals.",
    },
    {
      question: "How much will $10,000 grow in 10 years at 7% annual interest compounded monthly?",
      answer: "With $10,000 invested at 7% annual interest compounded monthly, your investment will grow to approximately $20,068 after 10 years, earning $10,068 in compound interest. This assumes no additional deposits or withdrawals. The monthly compounding (12 times per year) accelerates growth compared to annual compounding, which would yield $19,672.",
    },
    {
      question: "What's the difference between annual and daily compounding on a savings account?",
      answer: "Daily compounding accrues interest 365 times per year versus 12 times for monthly or 1 time for annual compounding. On a $25,000 deposit at 4.5% for 5 years, daily compounding yields approximately $31,307 versus $31,262 with annual compounding—a difference of $45. While the gap narrows with lower interest rates, daily compounding is most beneficial for high-yield savings accounts and certificates of deposit.",
    },
    {
      question: "How does starting early impact compound interest growth?",
      answer: "Starting 10 years earlier with a $5,000 initial investment at 8% compounded annually results in approximately $108,627 over 40 years, compared to $58,955 if you start 10 years later with the same parameters. This demonstrates the power of time: the extra decade generates an additional $49,672 with no additional contributions, illustrating why early investment is critical for retirement planning.",
    },
    {
      question: "Can I use this calculator for loan interest calculations?",
      answer: "This calculator is designed for investment growth scenarios where compound interest works in your favor. For loan calculations, interest typically compounds against you, and most loans use different formulas (amortization schedules). Use this calculator for savings accounts, CDs, investment portfolios, and retirement accounts, but use a loan calculator for mortgages, personal loans, or credit card debt.",
    },
    {
      question: "What annual interest rate do I need to double my money in 10 years?",
      answer: "Using the Rule of 72 or this calculator, you need approximately 7.2% annual interest compounded annually to double your principal in 10 years. For example, $50,000 at 7.2% grows to approximately $100,350 over 10 years. The required rate decreases with more frequent compounding; daily compounding requires roughly 6.93% to achieve the same result.",
    },
    {
      question: "How should I account for inflation when using this calculator?",
      answer: "Calculate your nominal return (what the calculator shows) separately from your real return (adjusted for inflation). If your investment grows to $15,000 but inflation averages 2.5% annually over the period, your real purchasing power gain is lower. Subtract the average inflation rate from your interest rate to estimate real returns: a 6% return minus 2.5% inflation equals roughly 3.5% real growth.",
    },
    {
      question: "What compounding frequency should I use for my investment scenario?",
      answer: "Check your account or investment documentation: savings accounts often compound daily (365 times/year), CDs may compound monthly or quarterly, bonds typically compound semi-annually (2 times/year), and Treasury securities usually compound semi-annually. Using the correct frequency is crucial for accuracy; daily compounding on a $20,000 deposit at 5% over 5 years yields $25,664 versus $25,526 with annual compounding.",
    },
    {
      question: "Can I add regular deposits to this calculator, or just use a lump sum?",
      answer: "This calculator typically uses a starting principal amount (lump sum), though many versions allow you to add additional regular deposits or contributions. If your calculator has a monthly or annual contribution field, use it for retirement savings scenarios; if not, you can run separate calculations for your lump sum and recurring deposits using a future value of annuity calculator. Combining both methods gives the complete picture of your savings growth.",
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Compound Interest Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Compound Interest Calculator helps you project how your investments or savings will grow over time by showing the effect of compound interest—earning interest on your interest. This tool is essential for financial planning, whether you're saving for retirement, a down payment, or any long-term goal. By understanding potential growth, you can set realistic targets and make informed decisions about where to invest your money.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, input four key values: your initial principal (starting amount), the annual interest rate your investment earns, the time period (in years), and the compounding frequency (daily, monthly, quarterly, annually, or continuously). The principal is what you deposit upfront; the interest rate depends on your account type (savings accounts typically offer 4-5% in 2024-2025, while stock market averages hover around 10%); and compounding frequency determines how often interest is added to your balance—check your account terms for this detail.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays two critical results: your final amount (principal plus all compound interest earned) and the total interest generated. Use these results to compare different scenarios: try adjusting the interest rate or time period to see how small changes impact your long-term wealth. If the projected balance doesn't meet your goals, you can experiment with higher rates or longer timeframes, helping you identify realistic strategies for reaching your financial objectives.</p>
        </div>
      </section>

      {/* TABLE: Compound Interest Growth Comparison by Frequency */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Compound Interest Growth Comparison by Frequency</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how $25,000 grows over 20 years at 5% annual interest using different compounding frequencies.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Compounding Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Earned</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Difference vs. Annual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Annual (1x/year)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$66,332</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,332</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Semi-Annual (2x/year)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$66,505</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,505</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$173</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Quarterly (4x/year)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$66,593</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,593</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$261</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Monthly (12x/year)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$66,688</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,688</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$356</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Daily (365x/year)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$66,717</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,717</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$385</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Continuous</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$66,721</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,721</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$389</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">More frequent compounding generates slightly higher returns, with daily and continuous compounding showing minimal but measurable differences. Most savings accounts use daily compounding.</p>
      </section>

      {/* TABLE: Time to Double Your Investment at Various Interest Rates */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Time to Double Your Investment at Various Interest Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how long it takes to double a principal investment at different annual interest rates with annual compounding.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Interest Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years to Double</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: $10,000 Becomes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.4 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.9 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.0 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.3 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Use the Rule of 72 as a quick approximation: divide 72 by the interest rate to estimate doubling time. Higher rates significantly reduce the time needed to achieve your financial goals.</p>
      </section>

      {/* TABLE: Compound Interest Impact: Early vs. Late Starting */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Compound Interest Impact: Early vs. Late Starting</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares three investors who each invest $5,000 annually with 8% annual returns, demonstrating the advantage of starting early.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Investor Profile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Investment Period</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Contributions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Balance at Age 65</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Compound Interest Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Early Bird</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Age 25-65 (40 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,395,580</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,195,580</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Middle Starter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Age 35-65 (30 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$703,440</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$553,440</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Late Starter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Age 45-65 (20 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$293,253</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$193,253</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The early bird invests $100,000 more but earns $642,327 more in compound interest than the late starter, demonstrating the exponential power of time in wealth building.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare your current savings account's interest rate against high-yield savings accounts (currently offering 4.5-5.2% in 2024-2025) using this calculator—moving $50,000 from 0.5% to 5% can generate an extra $22,500+ over 10 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test multiple scenarios by adjusting the compounding frequency: switching from annual to daily compounding can add hundreds of dollars over time on larger balances, so always select the most frequent option available for your account.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator backward to determine the interest rate you need: if you want to grow $20,000 to $40,000 in 15 years, adjust the rate until you hit your target—this reveals whether your current investment choice will actually meet your goal.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in inflation by subtracting average inflation (historically 2-3%) from your interest rate to see your real purchasing power growth; a 6% return in an inflationary environment may only represent 3-4% real value growth.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run annual checks using this calculator with your actual account balances and current interest rates to verify you're on track toward your long-term goals and to spot opportunities to shift money to better-performing investments.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Match Compounding Frequency to Your Account</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using annual compounding when your account compounds daily will underestimate your returns. A $15,000 deposit at 5% over 10 years shows $24,432 with annual compounding but $24,555 with daily compounding—always check your bank statement or account terms for the correct frequency.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Inflation's Impact on Real Returns</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 4% interest rate sounds good, but if inflation averages 3%, your real return is only 1%. This mistake leads to overestimating your purchasing power growth and setting unrealistic financial goals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Savings Account Rates Stay Constant</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Interest rates fluctuate with Federal Reserve changes; the 5% rate you lock in today may drop to 2% in 18 months. Use conservative rate estimates in the calculator rather than peak rates to build a more realistic retirement plan.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Entering Incorrect Time Periods or Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering 10 instead of 0.10 for a 10% rate, or confusing months with years, will produce completely wrong results. Double-check that interest rates are in decimal form (5% = 0.05) and time periods match your compounding frequency selection.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using This Calculator for Loan Interest Scenarios</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Compound interest calculators assume growth (positive interest), but loans work oppositely with amortization schedules. Using this for mortgage or credit card calculations will give misleading results; use loan-specific calculators instead.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the compound interest formula used in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator uses the formula A = P(1 + r/n)^(nt), where A is the final amount, P is the principal, r is the annual interest rate, n is the number of times interest compounds per year, and t is time in years. For continuous compounding, it uses A = Pe^(rt). Understanding this formula helps you verify the calculator's outputs and adjust inputs based on your financial goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much will $10,000 grow in 10 years at 7% annual interest compounded monthly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">With $10,000 invested at 7% annual interest compounded monthly, your investment will grow to approximately $20,068 after 10 years, earning $10,068 in compound interest. This assumes no additional deposits or withdrawals. The monthly compounding (12 times per year) accelerates growth compared to annual compounding, which would yield $19,672.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between annual and daily compounding on a savings account?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Daily compounding accrues interest 365 times per year versus 12 times for monthly or 1 time for annual compounding. On a $25,000 deposit at 4.5% for 5 years, daily compounding yields approximately $31,307 versus $31,262 with annual compounding—a difference of $45. While the gap narrows with lower interest rates, daily compounding is most beneficial for high-yield savings accounts and certificates of deposit.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does starting early impact compound interest growth?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Starting 10 years earlier with a $5,000 initial investment at 8% compounded annually results in approximately $108,627 over 40 years, compared to $58,955 if you start 10 years later with the same parameters. This demonstrates the power of time: the extra decade generates an additional $49,672 with no additional contributions, illustrating why early investment is critical for retirement planning.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for loan interest calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is designed for investment growth scenarios where compound interest works in your favor. For loan calculations, interest typically compounds against you, and most loans use different formulas (amortization schedules). Use this calculator for savings accounts, CDs, investment portfolios, and retirement accounts, but use a loan calculator for mortgages, personal loans, or credit card debt.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What annual interest rate do I need to double my money in 10 years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Using the Rule of 72 or this calculator, you need approximately 7.2% annual interest compounded annually to double your principal in 10 years. For example, $50,000 at 7.2% grows to approximately $100,350 over 10 years. The required rate decreases with more frequent compounding; daily compounding requires roughly 6.93% to achieve the same result.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I account for inflation when using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calculate your nominal return (what the calculator shows) separately from your real return (adjusted for inflation). If your investment grows to $15,000 but inflation averages 2.5% annually over the period, your real purchasing power gain is lower. Subtract the average inflation rate from your interest rate to estimate real returns: a 6% return minus 2.5% inflation equals roughly 3.5% real growth.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What compounding frequency should I use for my investment scenario?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check your account or investment documentation: savings accounts often compound daily (365 times/year), CDs may compound monthly or quarterly, bonds typically compound semi-annually (2 times/year), and Treasury securities usually compound semi-annually. Using the correct frequency is crucial for accuracy; daily compounding on a $20,000 deposit at 5% over 5 years yields $25,664 versus $25,526 with annual compounding.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I add regular deposits to this calculator, or just use a lump sum?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator typically uses a starting principal amount (lump sum), though many versions allow you to add additional regular deposits or contributions. If your calculator has a monthly or annual contribution field, use it for retirement savings scenarios; if not, you can run separate calculations for your lump sum and recurring deposits using a future value of annuity calculator. Combining both methods gives the complete picture of your savings growth.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sec.gov/investor/pubs/growofmoneytaxes.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Securities and Exchange Commission (SEC) — Investor Education</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SEC resource explaining compound interest, the power of long-term investing, and how to calculate investment growth.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/econres/notes/feds-notes/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve — Economic Research on Savings Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Reserve research on current savings rates, historical interest rate trends, and monetary policy impacts on consumer savings.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/banking/savings/savings-accounts/best-high-yield-savings-accounts/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate — High-Yield Savings Account Rates and Comparisons</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current market rates for savings accounts and certificates of deposit, updated daily to help you find the best returns on your investments.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/consumer-tools/money-as-you-grow/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau (CFPB) — Savings and Investing Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB resources on understanding compound interest, investment basics, and strategies for building wealth over time.</p>
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