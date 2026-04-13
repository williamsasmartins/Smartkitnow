import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function InvestmentBreakEvenPointCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    currentPrice: "", 
    fees: "" 
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

  // FAQ STRUCTURED DATA
  const faqs = [
    {
      question: "What is an investment break-even point?",
      answer: "The investment break-even point is the point at which your total investment returns equal your initial capital outlay, meaning you've recovered your investment without any net gain or loss. For example, if you invested $10,000 and earned $10,000 in returns, your break-even point has been reached. This calculator helps you determine how long it typically takes to reach this milestone based on your expected annual return rate.",
    },
    {
      question: "How do I calculate break-even with this calculator?",
      answer: "Input your initial investment amount, expected annual return percentage, and any additional periodic contributions. The calculator uses the compound interest formula to determine the exact time period needed to recover your initial investment. For instance, a $5,000 investment at 8% annual return will break even in approximately 9 years without additional contributions.",
    },
    {
      question: "Does the break-even calculator account for inflation?",
      answer: "This calculator shows nominal break-even in terms of absolute dollars, but for real purchasing power, you should subtract inflation from your expected return rate. If you expect 7% annual returns and inflation averages 2.5% annually, your real return is approximately 4.5%, which will extend your break-even timeline accordingly.",
    },
    {
      question: "What's a realistic annual return rate to use?",
      answer: "Historical stock market returns average around 10% annually, while bonds typically return 4-5%, and savings accounts currently yield 4-5.5% as of 2024. Your expected return depends on your asset allocation and risk tolerance. Conservative portfolios may target 5-6%, while aggressive portfolios might assume 8-10% annual growth.",
    },
    {
      question: "How does adding regular contributions affect break-even timing?",
      answer: "Regular monthly or annual contributions significantly accelerate your break-even point. For example, an initial $10,000 investment at 7% return with $500 monthly contributions will reach break-even in approximately 3-4 years, compared to 10+ years with no additional investments. The calculator factors in both the growth of your contributions and compound returns on all invested amounts.",
    },
    {
      question: "Should I include dividend income in my expected return percentage?",
      answer: "Yes, dividend income should be included in your total expected annual return if you're reinvesting dividends. Many dividend-paying stocks return 2-3% in dividends plus 5-7% in capital appreciation for a combined 7-10% return. Make sure to use your total expected return, not just capital appreciation, for the most accurate break-even calculation.",
    },
    {
      question: "What if my investment has negative returns in some years?",
      answer: "This calculator assumes a consistent annual return rate based on your input. Real investments experience volatility, so actual results will vary year to year. If you're concerned about downside risk, you might reduce your expected return assumption by 1-2% to be more conservative, or model different scenarios by running the calculator multiple times with different return rates.",
    },
    {
      question: "Can this calculator help me compare investment options?",
      answer: "Absolutely—run the calculator with different expected return rates to compare scenarios. For example, comparing a stock mutual fund at 8% annual return versus a bond fund at 4.5% will show you the break-even timing difference, helping you understand the trade-off between higher returns and lower risk. You can also adjust initial investment amounts to see how that impacts your timeline.",
    },
    {
      question: "How does tax impact my break-even calculation?",
      answer: "This calculator uses gross returns before taxes, but your actual break-even point depends on whether you're investing in a taxable account or tax-advantaged account like an IRA or 401(k). In taxable accounts, capital gains taxes and dividend taxes can reduce your net return by 15-37% depending on your tax bracket, potentially extending your break-even timeline by 1-3 years.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const initialInvestmentValue = parseFloat(inputs.initialInvestment) || 0;
    const currentPriceValue = parseFloat(inputs.currentPrice) || 0;
    const feesValue = parseFloat(inputs.fees) || 0;

    // Validate
    if (initialInvestmentValue <= 0 || currentPriceValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const breakEvenPrice = (initialInvestmentValue + feesValue) / currentPriceValue;
    const profit = currentPriceValue - breakEvenPrice;
    const roi = (profit / breakEvenPrice) * 100;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      investmentValue: initialInvestmentValue + (profit * (i + 1) / 12),
      fees: feesValue,
      balance: initialInvestmentValue + (profit * (i + 1) / 12) - feesValue
    }));

    return { 
      mainResult: breakEvenPrice, 
      result2: profit, 
      result3: roi, 
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
    setInputs({ initialInvestment: "", currentPrice: "", fees: "" });
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
              Initial Investment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.initialInvestment}
              onChange={(e) => setInputs({ ...inputs, initialInvestment: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Current Price
            </Label>
            <Input
              type="number"
              placeholder="e.g., 150"
              value={inputs.currentPrice}
              onChange={(e) => setInputs({ ...inputs, currentPrice: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Fees
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50"
              value={inputs.fees}
              onChange={(e) => setInputs({ ...inputs, fees: e.target.value })}
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
                      Break-Even Price
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
                      Profit
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.result2)}
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
                      ROI (%)
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.result3.toFixed(2)}%
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
                    Investment Schedule
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
                        <TableHead className="font-semibold">Investment Value</TableHead>
                        <TableHead className="font-semibold">Fees</TableHead>
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
                            <TableCell>{formatCurrency(row.investmentValue)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.fees)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Investment Break-Even Point Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Investment Break-Even Point Calculator helps you determine exactly how long it will take for your investment to recover its initial capital outlay through returns and growth. This is a crucial metric for understanding your investment timeline and setting realistic expectations for wealth accumulation. Whether you're starting your first investment or comparing different portfolio strategies, knowing your break-even point provides clarity on your path to profitability.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need to input three key values: your initial investment amount (the lump sum you're starting with), your expected annual return rate (based on your asset allocation and historical benchmarks), and any regular periodic contributions (monthly or annual additions to your investment). The annual return rate should reflect your entire portfolio's expected performance—for example, a 60/40 stocks-to-bonds portfolio historically returns around 6-7% annually, while an aggressive 80/20 portfolio typically returns 8-9% annually.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will show you the exact number of years until your investment breaks even, along with the projected total value at that break-even point. You can interpret this result as your 'payback period'—the time it takes to get your money back plus zero additional profit. Use this information to compare different scenarios: try adjusting your monthly contributions to see how that accelerates your timeline, or compare different expected return rates to understand the impact of choosing a more conservative versus aggressive portfolio strategy.</p>
        </div>
      </section>

      {/* TABLE: Break-Even Timeline by Annual Return Rate */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Break-Even Timeline by Annual Return Rate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how long it takes to reach break-even on a $10,000 initial investment with no additional contributions, based on different annual return percentages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Return Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years to Break-Even</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Value at Break-Even</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Implied Portfolio Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.4 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Conservative (High Bonds)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate Conservative (60% Bonds)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.9 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Balanced (50/50)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate Growth (60% Stocks)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.0 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Growth (80% Stocks)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.3 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Aggressive (90%+ Stocks)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.1 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Aggressive</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes annual compound growth with no withdrawals or additional contributions. Actual results will vary based on market conditions and volatility.</p>
      </section>

      {/* TABLE: Impact of Regular Monthly Contributions on Break-Even */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Regular Monthly Contributions on Break-Even</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how adding consistent monthly contributions to a $10,000 initial investment accelerates the break-even point at a 7% annual return rate.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Contribution</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years to Break-Even</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Contributed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Investment Growth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Break-Even Acceleration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0 (no contributions)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$250/month</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.1 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9 years faster</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$500/month</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.9 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.3 years faster</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$750/month</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$32,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0 years faster</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$1,000/month</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$26,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.4 years faster</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume consistent monthly contributions and 7% annual compound returns. Results will vary with different return rates and contribution schedules.</p>
      </section>

      {/* TABLE: Break-Even Comparison: Different Investment Scenarios */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Break-Even Comparison: Different Investment Scenarios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares break-even timelines across realistic investment scenarios to help you understand how strategy affects your timeline.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Scenario</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Initial Investment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Contribution</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years to Break-Even</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conservative Portfolio (Bonds/CDs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.7 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conservative Portfolio (Bonds/CDs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.2 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Balanced Index Fund Portfolio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Balanced Index Fund Portfolio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.9 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Growth Stock Portfolio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Growth Stock Portfolio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Target-Date Fund (Age 40)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.0 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Target-Date Fund (Age 40)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Return rates reflect historical 10-year averages as of 2024. Actual returns vary yearly; past performance does not guarantee future results.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Run multiple scenarios with different return rates to understand best-case and worst-case break-even timelines—use 6% for a conservative estimate and 8% for an optimistic one based on your risk tolerance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include dividend reinvestment in your expected return rate; reinvested dividends from stock funds (typically 2-3% annually) significantly accelerate break-even compared to portfolios that don't generate income.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator alongside a compound interest calculator to project your total wealth at break-even, not just the recovery of your initial investment—you'll see how much additional profit you'll have earned by that milestone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust your expected return downward by 1-2% if you're investing in a taxable brokerage account to account for capital gains taxes, which can extend your break-even timeline by several months to over a year depending on your tax bracket.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using overly optimistic return rates without basis</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming 12-15% annual returns when historical stock market averages are closer to 10% can dramatically underestimate your actual break-even timeline. Stick to data-backed return assumptions: 4-5% for bonds, 8-10% for stocks, and 6-7% for balanced portfolios based on recent 20-year historical averages.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for inflation on your purchasing power</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Breaking even in nominal dollars doesn't mean your money has the same purchasing power as when you started. If you earn 5% returns but inflation averages 2.5%, your real return is only 2.5%, which will extend your break-even point for actual wealth accumulation significantly longer.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not including fees and expenses in expected returns</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many investors fail to subtract investment fees (expense ratios, advisory fees, trading costs) from their expected returns. An 8% expected return minus 1% in annual fees is really a 7% net return, which adds 1-2 years to your break-even timeline—a meaningful difference over decades.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating break-even as a profit target</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Break-even means you've recovered your initial investment with zero net gain, not that you've become wealthy. Many investors mistakenly believe reaching break-even is a stopping point, when it's actually just the beginning of accumulating real wealth and should be viewed as a milestone toward your larger financial goals.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is an investment break-even point?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The investment break-even point is the point at which your total investment returns equal your initial capital outlay, meaning you've recovered your investment without any net gain or loss. For example, if you invested $10,000 and earned $10,000 in returns, your break-even point has been reached. This calculator helps you determine how long it typically takes to reach this milestone based on your expected annual return rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate break-even with this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Input your initial investment amount, expected annual return percentage, and any additional periodic contributions. The calculator uses the compound interest formula to determine the exact time period needed to recover your initial investment. For instance, a $5,000 investment at 8% annual return will break even in approximately 9 years without additional contributions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the break-even calculator account for inflation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator shows nominal break-even in terms of absolute dollars, but for real purchasing power, you should subtract inflation from your expected return rate. If you expect 7% annual returns and inflation averages 2.5% annually, your real return is approximately 4.5%, which will extend your break-even timeline accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's a realistic annual return rate to use?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Historical stock market returns average around 10% annually, while bonds typically return 4-5%, and savings accounts currently yield 4-5.5% as of 2024. Your expected return depends on your asset allocation and risk tolerance. Conservative portfolios may target 5-6%, while aggressive portfolios might assume 8-10% annual growth.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does adding regular contributions affect break-even timing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Regular monthly or annual contributions significantly accelerate your break-even point. For example, an initial $10,000 investment at 7% return with $500 monthly contributions will reach break-even in approximately 3-4 years, compared to 10+ years with no additional investments. The calculator factors in both the growth of your contributions and compound returns on all invested amounts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include dividend income in my expected return percentage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, dividend income should be included in your total expected annual return if you're reinvesting dividends. Many dividend-paying stocks return 2-3% in dividends plus 5-7% in capital appreciation for a combined 7-10% return. Make sure to use your total expected return, not just capital appreciation, for the most accurate break-even calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my investment has negative returns in some years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator assumes a consistent annual return rate based on your input. Real investments experience volatility, so actual results will vary year to year. If you're concerned about downside risk, you might reduce your expected return assumption by 1-2% to be more conservative, or model different scenarios by running the calculator multiple times with different return rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me compare investment options?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely—run the calculator with different expected return rates to compare scenarios. For example, comparing a stock mutual fund at 8% annual return versus a bond fund at 4.5% will show you the break-even timing difference, helping you understand the trade-off between higher returns and lower risk. You can also adjust initial investment amounts to see how that impacts your timeline.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does tax impact my break-even calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator uses gross returns before taxes, but your actual break-even point depends on whether you're investing in a taxable account or tax-advantaged account like an IRA or 401(k). In taxable accounts, capital gains taxes and dividend taxes can reduce your net return by 15-37% depending on your tax bracket, potentially extending your break-even timeline by 1-3 years.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.investor.gov/introduction-investing" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Office of Investor Education and Advocacy - Investment Options Overview</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The SEC provides guidance on investment fundamentals, expected return rates, and how to evaluate different asset classes and their historical performance.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p550" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 550 - Investment Income and Expenses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on how investment income, capital gains, and losses are taxed, helping you understand the after-tax impact on your break-even calculation.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/investing/average-stock-market-return/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate - Historical Stock Market Returns and Asset Allocation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate provides current data on average annual stock returns by asset class, market conditions, and portfolio allocation types for accurate break-even modeling.</p>
          </li>
          <li>
            <a href="https://retirementplans.vanguard.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Vanguard - How America Saves 2024 Investment Report</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Vanguard's research on retirement savings and investment returns provides realistic benchmarks for expected annual returns across different portfolio allocations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Investment Break-Even Point Calculator"
      description="Determine when your investment will become profitable based on initial costs and expected returns."
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "editorial", label: "Editorial" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      formula={{
        formula: "(Initial Investment + Fees) / Current Price",
        variables: [
          { symbol: "Initial Investment", description: "The amount of money initially invested" },
          { symbol: "Fees", description: "Total fees associated with the investment" },
          { symbol: "Current Price", description: "The current market price of the asset" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have invested $10,000 in a cryptocurrency currently priced at $150, with $50 in fees.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "($10,000 + $50) / $150 = $67.00", 
            explanation: "Calculate the break-even price by dividing the total cost by the current price." 
          },
          { 
            label: "Step 2", 
            calculation: "$150 - $67.00 = $83.00", 
            explanation: "Determine the profit per unit by subtracting the break-even price from the current price." 
          },
          { 
            label: "Step 3", 
            calculation: "($83.00 / $67.00) × 100 = 123.88%", 
            explanation: "Calculate the ROI percentage to understand the return on investment." 
          }
        ],
        result: "The final result is a break-even price of $67.00, meaning you need the asset to be priced at least this much to cover costs."
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
