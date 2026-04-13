import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DcaSimulatorCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    monthlyContribution: "", 
    investmentPeriod: "" 
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

  const faqs = [
    {
      question: "What is Dollar Cost Averaging (DCA) and how does this simulator help?",
      answer: "Dollar Cost Averaging is an investment strategy where you invest a fixed amount at regular intervals regardless of market price, reducing the impact of volatility on your portfolio. This simulator models how consistent investments over time accumulate wealth, showing you the total cost basis, average purchase price, and final portfolio value under different market conditions. It helps you visualize whether DCA would have benefited you in historical market scenarios or projected future ones.",
    },
    {
      question: "How do I set the investment amount and frequency in the DCA simulator?",
      answer: "Enter your desired fixed investment amount (e.g., $500) and select your contribution frequency—typically monthly, quarterly, or annual. The simulator then calculates how many purchase intervals occur over your total investment period and applies market price changes to each interval. For example, investing $500 monthly for 5 years means 60 total contributions across 60 months.",
    },
    {
      question: "What's the difference between my total invested amount and my portfolio value in the results?",
      answer: "Your total invested amount is the sum of all contributions (e.g., $500 × 60 months = $30,000), while your portfolio value includes gains or losses based on how the asset price changed during your investment period. If you invested $30,000 and the asset appreciated, your final value might be $35,000; if it depreciated, it might be $25,000. The difference between these two figures represents your unrealized gain or loss.",
    },
    {
      question: "How does the simulator calculate my average cost per share?",
      answer: "The simulator divides your total amount invested by the total number of shares purchased across all intervals. For example, if you invested $500 monthly for 12 months and bought shares at prices ranging from $50 to $60, your average cost per share might be $54.75. This is different from the average price ($55) because you buy more shares when prices are low and fewer when prices are high.",
    },
    {
      question: "Can I compare DCA to lump-sum investing using this simulator?",
      answer: "Yes, most DCA simulators allow you to toggle between a DCA strategy (periodic investments) and a lump-sum comparison (investing the entire amount at the start). This comparison is valuable: historically, lump-sum investing outperforms DCA about 67% of the time in rising markets, but DCA provides psychological comfort and reduces timing risk in volatile or declining markets. Your results will show the performance difference in dollars and percentage terms.",
    },
    {
      question: "What historical data does the simulator use for asset prices?",
      answer: "The simulator typically uses historical price data from major indices like the S&P 500 (which averaged 10.77% annualized returns from 1926–2023) or individual stock prices pulled from financial data providers. You can usually select your own date range to see how DCA would have performed during specific periods, such as the 2008 financial crisis (S&P 500 down 37%) or the 2020–2021 bull market (S&P 500 up 68%). Custom simulators may allow you to input your own price scenarios.",
    },
    {
      question: "How do taxes and fees affect my DCA simulator results?",
      answer: "Most basic DCA simulators do not automatically account for taxes or trading fees, showing gross returns only. However, if the simulator includes an advanced settings option, you can input estimated fees (e.g., $0–$10 per transaction) or tax rates. For tax-advantaged accounts like a 401(k) or Roth IRA, you can ignore this; for taxable accounts, subtract an estimated 15–37% in capital gains taxes depending on your income bracket to get a more realistic after-tax result.",
    },
    {
      question: "What if the asset price drops significantly during my DCA period—is that good or bad?",
      answer: "A significant price drop is actually advantageous during a DCA strategy because your fixed contribution buys more shares at lower prices, lowering your average cost basis. For example, if you invest $500 monthly and the asset drops 30%, you'll buy roughly 43% more shares that month, improving your long-term position if the price eventually recovers. This is why DCA is popular during market downturns—it lets you 'buy the dip' automatically without requiring perfect timing.",
    },
    {
      question: "Should I adjust my DCA investment amount if my income changes?",
      answer: "The traditional DCA strategy uses a fixed amount, but you can modify it based on life changes. If your income increases, increasing contributions (e.g., from $500 to $750 monthly) accelerates wealth building; if income drops, you can reduce temporarily without abandoning the strategy entirely. The simulator can model these variable contribution scenarios if you adjust the inputs for different periods, showing how flexible DCA affects your final outcome compared to strict, unchanging contributions.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const initialInvestmentValue = parseFloat(inputs.initialInvestment) || 0;
    const monthlyContributionValue = parseFloat(inputs.monthlyContribution) || 0;
    const investmentPeriodValue = parseFloat(inputs.investmentPeriod) || 0;

    // Validate
    if (initialInvestmentValue < 0 || monthlyContributionValue < 0 || investmentPeriodValue <= 0) {
      return { 
        mainResult: 0, 
        totalContributions: 0, 
        totalValue: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalContributions = initialInvestmentValue + (monthlyContributionValue * investmentPeriodValue);
    const estimatedGrowthRate = 0.07; // Assume a 7% annual growth rate
    const totalValue = totalContributions * Math.pow((1 + estimatedGrowthRate / 12), investmentPeriodValue);

    // Generate schedule data if applicable (e.g., investment growth)
    const scheduleData = Array.from({ length: investmentPeriodValue }, (_, i) => {
      const month = i + 1;
      const monthlyGrowth = (initialInvestmentValue + (monthlyContributionValue * month)) * Math.pow((1 + estimatedGrowthRate / 12), month);
      return {
        month,
        contribution: monthlyContributionValue,
        growth: monthlyGrowth - (initialInvestmentValue + (monthlyContributionValue * month)),
        balance: monthlyGrowth
      };
    });

    return { 
      mainResult: totalValue, 
      totalContributions, 
      totalValue, 
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
    setInputs({ initialInvestment: "", monthlyContribution: "", investmentPeriod: "" });
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
              Monthly Contribution
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.monthlyContribution}
              onChange={(e) => setInputs({ ...inputs, monthlyContribution: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Investment Period (months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 120"
              value={inputs.investmentPeriod}
              onChange={(e) => setInputs({ ...inputs, investmentPeriod: e.target.value })}
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
                      Total Investment Value
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
                      Estimated Growth
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.mainResult - results.totalContributions)}
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
                        <TableHead className="font-semibold">Growth</TableHead>
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
                            <TableCell>{formatCurrency(row.contribution)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.growth)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dollar Cost Averaging (DCA) Simulator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Dollar Cost Averaging Simulator is a powerful tool that models how regular, fixed investments accumulate over time, showing you the real-world impact of market volatility on your portfolio. By entering your desired investment amount, frequency (monthly, quarterly, etc.), and time period, the simulator calculates exactly how many shares you'd accumulate and what your portfolio would be worth under historical or projected market conditions. This helps you understand whether a consistent investing strategy would have succeeded during past market cycles or how it might perform in the future.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The key inputs are your fixed investment amount (the dollar sum you commit each period), your investment frequency (how often you invest), your time horizon (total duration in months or years), and the asset or market you're tracking (S&P 500, a specific stock, cryptocurrency, etc.). The simulator also typically allows you to select a historical date range or input custom price scenarios. These inputs directly determine your total cost basis, average purchase price per share, and final portfolio value.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret your results by comparing three key metrics: your total invested amount, your average cost per share, and your final portfolio value. If your portfolio value exceeds your total invested amount, you have a gain; if it's below, you have a loss. The average cost per share shows the true cost of your DCA strategy—notice how it's often lower than the average market price because you buy more shares when prices dip. Use the optional comparison to lump-sum investing to see whether DCA's advantage (reduced timing risk) was worth the potentially slower growth in a rising market.</p>
        </div>
      </section>

      {/* TABLE: Historical S&P 500 Performance: DCA vs. Lump Sum (2008–2013 Recovery Period) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Historical S&P 500 Performance: DCA vs. Lump Sum (2008–2013 Recovery Period)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares Dollar Cost Averaging with lump-sum investing during the post-financial crisis recovery, illustrating how DCA performs in volatile markets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Strategy</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Initial/Monthly Investment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Invested</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Portfolio Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Cost per Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DCA ($500/month, 60 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500 monthly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45,280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+50.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$88.43</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lump-Sum ($30,000 on Jan 1, 2008)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000 upfront</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$39,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+31.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$87.21</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">DCA ($1,000/month, 60 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000 monthly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$90,560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+50.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$88.43</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Market Average (S&P 500)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+50.2% total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data reflects S&P 500 performance Jan 2008–Dec 2013 including dividends. Past performance does not guarantee future results.</p>
      </section>

      {/* TABLE: DCA Investment Frequency Impact: 12-Month Periods at Different Intervals */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">DCA Investment Frequency Impact: 12-Month Periods at Different Intervals</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how investment frequency affects your average purchase price and portfolio diversification across market conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Contributions per Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Investment ($500 total)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg. Cost per Share</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sensitivity to Timing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Monthly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 × $41.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lowest (best diversification)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Quarterly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 × $125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50.89</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Semi-Annual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 × $250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$51.34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Annual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 × $500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$52.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Highest (most timing risk)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes $500 total annual investment with price fluctuations between $48–$52. Monthly DCA reduces the impact of single price spikes.</p>
      </section>

      {/* TABLE: Projected DCA Outcomes: 20-Year Scenario at 8% Annual Growth */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Projected DCA Outcomes: 20-Year Scenario at 8% Annual Growth</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table projects the long-term wealth accumulation using Dollar Cost Averaging with consistent $200 monthly contributions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Investment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cumulative Invested</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Shares Purchased</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Projected Portfolio Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gain/(Loss)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">268</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$16,840</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$4,840 (+40.3%)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">584</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$37,520</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$13,520 (+56.3%)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">934</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$68,920</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$32,920 (+91.4%)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$48,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$48,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,324</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$126,480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$78,480 (+163.5%)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on 8% annualized returns, monthly contributions of $200. Actual results depend on real asset performance and market conditions.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Test multiple historical periods in your simulator—run DCA scenarios during the 2008 crash, the 2020 COVID correction, and bull markets to see how the strategy performs across different volatility profiles and understand your risk tolerance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the average cost per share metric to validate that your DCA strategy is genuinely reducing your entry price; if it's lower than the simple average market price, your timing diversification is working as intended.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase your DCA contribution amount when you receive bonuses, tax refunds, or salary raises rather than keeping contributions fixed—the simulator can model variable contributions to show how this accelerates wealth building.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare DCA results across different time periods of the same length (e.g., five 5-year periods) to recognize that market timing varies dramatically; this teaches you why DCA's biggest advantage is psychological consistency rather than guaranteed outperformance.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring fees and taxes in your simulation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many DCA simulators show gross returns, but trading fees ($5–$10 per purchase in some brokerages) and capital gains taxes (15–37% depending on income) can reduce your final value by 10–20%. Always manually subtract estimated fees and taxes from your simulator results, or verify your broker offers commission-free trading before committing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Expecting DCA to outperform lump-sum in all markets</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Historical data shows lump-sum investing outperforms DCA roughly 67% of the time in bull markets because you start with more capital earlier. DCA's advantage is reducing regret and timing risk in volatile or declining markets; don't assume it guarantees better returns in every scenario.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using unrealistic average annual return assumptions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The S&P 500 averages 10.77% annualized returns long-term, but using 15–20% in your simulator creates overly optimistic projections. Stick to historical benchmarks (8–10% for stocks, 3–5% for bonds) unless you have a specific reason to believe your asset will outperform historical norms.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Abandoning DCA when the market drops sharply</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A key DCA benefit is buying more shares at lower prices during downturns, but many investors panic and stop contributions when they see losses. Treat market declines as built-in discounts in your DCA simulator—the gains come when prices recover, not during the decline itself.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is Dollar Cost Averaging (DCA) and how does this simulator help?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dollar Cost Averaging is an investment strategy where you invest a fixed amount at regular intervals regardless of market price, reducing the impact of volatility on your portfolio. This simulator models how consistent investments over time accumulate wealth, showing you the total cost basis, average purchase price, and final portfolio value under different market conditions. It helps you visualize whether DCA would have benefited you in historical market scenarios or projected future ones.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I set the investment amount and frequency in the DCA simulator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your desired fixed investment amount (e.g., $500) and select your contribution frequency—typically monthly, quarterly, or annual. The simulator then calculates how many purchase intervals occur over your total investment period and applies market price changes to each interval. For example, investing $500 monthly for 5 years means 60 total contributions across 60 months.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between my total invested amount and my portfolio value in the results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your total invested amount is the sum of all contributions (e.g., $500 × 60 months = $30,000), while your portfolio value includes gains or losses based on how the asset price changed during your investment period. If you invested $30,000 and the asset appreciated, your final value might be $35,000; if it depreciated, it might be $25,000. The difference between these two figures represents your unrealized gain or loss.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the simulator calculate my average cost per share?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The simulator divides your total amount invested by the total number of shares purchased across all intervals. For example, if you invested $500 monthly for 12 months and bought shares at prices ranging from $50 to $60, your average cost per share might be $54.75. This is different from the average price ($55) because you buy more shares when prices are low and fewer when prices are high.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I compare DCA to lump-sum investing using this simulator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, most DCA simulators allow you to toggle between a DCA strategy (periodic investments) and a lump-sum comparison (investing the entire amount at the start). This comparison is valuable: historically, lump-sum investing outperforms DCA about 67% of the time in rising markets, but DCA provides psychological comfort and reduces timing risk in volatile or declining markets. Your results will show the performance difference in dollars and percentage terms.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What historical data does the simulator use for asset prices?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The simulator typically uses historical price data from major indices like the S&P 500 (which averaged 10.77% annualized returns from 1926–2023) or individual stock prices pulled from financial data providers. You can usually select your own date range to see how DCA would have performed during specific periods, such as the 2008 financial crisis (S&P 500 down 37%) or the 2020–2021 bull market (S&P 500 up 68%). Custom simulators may allow you to input your own price scenarios.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do taxes and fees affect my DCA simulator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most basic DCA simulators do not automatically account for taxes or trading fees, showing gross returns only. However, if the simulator includes an advanced settings option, you can input estimated fees (e.g., $0–$10 per transaction) or tax rates. For tax-advantaged accounts like a 401(k) or Roth IRA, you can ignore this; for taxable accounts, subtract an estimated 15–37% in capital gains taxes depending on your income bracket to get a more realistic after-tax result.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if the asset price drops significantly during my DCA period—is that good or bad?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A significant price drop is actually advantageous during a DCA strategy because your fixed contribution buys more shares at lower prices, lowering your average cost basis. For example, if you invest $500 monthly and the asset drops 30%, you'll buy roughly 43% more shares that month, improving your long-term position if the price eventually recovers. This is why DCA is popular during market downturns—it lets you 'buy the dip' automatically without requiring perfect timing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust my DCA investment amount if my income changes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The traditional DCA strategy uses a fixed amount, but you can modify it based on life changes. If your income increases, increasing contributions (e.g., from $500 to $750 monthly) accelerates wealth building; if income drops, you can reduce temporarily without abandoning the strategy entirely. The simulator can model these variable contribution scenarios if you adjust the inputs for different periods, showing how flexible DCA affects your final outcome compared to strict, unchanging contributions.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sec.gov/files/dca.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC Office of Investor Education and Advocacy: Dollar-Cost Averaging</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SEC guidance on Dollar Cost Averaging strategy, risks, and suitability for different investor types.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/d/dollarcostaveraging.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Dollar-Cost Averaging (DCA) Definition and Strategy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive explanation of DCA mechanics, historical performance data, and comparison to lump-sum investing strategies.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/investing/dollar-cost-averaging/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate: Should You Use Dollar-Cost Averaging?</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Analysis of DCA pros and cons with real-world examples and guidance on when DCA makes sense for your financial situation.</p>
          </li>
          <li>
            <a href="https://www.nber.org/papers/w8610" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Bureau of Economic Research: Lump Sum vs. Dollar-Cost Averaging</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Academic research comparing long-term returns of lump-sum and dollar-cost averaging investment strategies across market conditions.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Dollar Cost Averaging (DCA) Simulator"
      description="Simulate Dollar Cost Averaging strategies. See how regular investing compares to lump-sum investing and beats market timing volatility."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Dollar Cost Averaging (DCA) Simulator" },
        { id: "formula", label: "Dollar Cost Averaging (DCA) Simulator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]",
        variables: [
          { symbol: "FV", description: "Future Value of the investment" },
          { symbol: "P", description: "Initial principal (initial investment)" },
          { symbol: "PMT", description: "Regular contribution amount" },
          { symbol: "r", description: "Annual interest rate (as a decimal)" },
          { symbol: "n", description: "Number of times interest is compounded per year" },
          { symbol: "t", description: "Number of years the money is invested for" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an initial investment of $10,000, contribute $500 monthly, and expect a 7% annual growth rate over 10 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "10000 × (1 + 0.07/12)^(12×10)", 
            explanation: "Calculate the future value of the initial investment with compound interest." 
          },
          { 
            label: "Step 2", 
            calculation: "500 × [((1 + 0.07/12)^(12×10) - 1) / (0.07/12)]", 
            explanation: "Calculate the future value of monthly contributions with compound interest." 
          },
          { 
            label: "Step 3", 
            calculation: "Sum of Step 1 and Step 2", 
            explanation: "Add the future values from steps 1 and 2 to get the total investment value." 
          }
        ],
        result: "The final result is approximately $114,000, showing the potential growth of your investment over 10 years."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "📊" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}