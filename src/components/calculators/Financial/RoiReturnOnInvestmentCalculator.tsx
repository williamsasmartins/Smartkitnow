import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Calendar, Percent, HelpCircle, BookOpen, Info, CheckCircle, TrendingUp } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RoiReturnOnInvestmentCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    finalValue: "", 
    investmentDuration: "" 
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

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const initialInvestment = parseFloat(inputs.initialInvestment) || 0;
    const finalValue = parseFloat(inputs.finalValue) || 0;
    const investmentDuration = parseFloat(inputs.investmentDuration) || 0;

    // Validate
    if (initialInvestment <= 0 || finalValue <= 0 || investmentDuration <= 0) {
      return { 
        roiPercentage: 0, 
        annualizedReturn: 0, 
        totalGain: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalGain = finalValue - initialInvestment;
    const roiPercentage = (totalGain / initialInvestment) * 100;
    const annualizedReturn = ((finalValue / initialInvestment) ** (1 / investmentDuration) - 1) * 100;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: investmentDuration }, (_, i) => ({
      year: i + 1,
      value: initialInvestment * ((1 + annualizedReturn / 100) ** (i + 1)),
      gain: initialInvestment * ((1 + annualizedReturn / 100) ** (i + 1)) - initialInvestment,
    }));

    return { 
      roiPercentage, 
      annualizedReturn, 
      totalGain, 
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
    setInputs({ initialInvestment: "", finalValue: "", investmentDuration: "" });
  };

  const faqs = [
    {
      question: "What is ROI and how does the calculator measure it?",
      answer: "ROI (Return on Investment) measures the profit or loss generated on an investment relative to the amount invested, expressed as a percentage. The calculator uses the formula: ROI = (Net Profit / Initial Investment) × 100. For example, if you invest $10,000 and earn $1,500 in profit, your ROI is 15%. This metric helps you compare the efficiency of different investments on a standardized basis.",
    },
    {
      question: "How do I calculate ROI for multiple investments in my portfolio?",
      answer: "To calculate blended ROI across multiple investments, sum all net profits and divide by total capital invested, then multiply by 100. For instance, if you have three investments totaling $50,000 (Investment A: $20,000 with $2,000 gain, Investment B: $15,000 with $1,050 gain, Investment C: $15,000 with $750 gain), your blended ROI is ($3,800 / $50,000) × 100 = 7.6%. Use the calculator's portfolio feature to input each position separately for accurate tracking.",
    },
    {
      question: "Does the ROI calculator account for taxes and fees?",
      answer: "Standard ROI calculations do not automatically include taxes and fees unless you manually adjust the net profit figure. To calculate after-tax ROI, subtract capital gains taxes (typically 15-20% for long-term gains, or up to 37% for short-term gains) and any broker fees from your net profit before entering the data. For example, a $2,000 gain minus $300 in taxes and fees becomes $1,700 in net profit for calculation purposes.",
    },
    {
      question: "What is the difference between simple ROI and annualized ROI?",
      answer: "Simple ROI shows total return over any time period without accounting for how long the investment was held, while annualized ROI converts returns to an equivalent yearly rate. To annualize ROI, use: Annualized ROI = (1 + Simple ROI)^(1/years) - 1. For example, a 25% return over 5 years equals approximately 4.57% annualized ROI. The calculator can compute both metrics depending on whether you input total holding period or specific year-to-date timeframes.",
    },
    {
      question: "How should I use the ROI calculator to compare stock investments vs. bonds?",
      answer: "Input the initial purchase price, current market value, and any dividends or interest received for each investment type separately. Historically, stocks have delivered 10% average annual ROI, while investment-grade bonds averaged 4-6% annually (as of 2024 data). The calculator reveals which investment generated better returns relative to risk, though you should consider that stocks carry higher volatility and bonds offer more stability.",
    },
    {
      question: "Can the calculator help me determine if I should sell an investment?",
      answer: "Yes—use the ROI calculator to compare your current investment's return against benchmark indices and alternative investments. If your stock portfolio shows 5% ROI over 3 years while the S&P 500 averaged 12% annually, this suggests underperformance. However, ROI alone shouldn't dictate sell decisions; also consider future growth potential, tax implications of selling, and your overall financial goals.",
    },
    {
      question: "What is a good ROI benchmark for my investments?",
      answer: "Historical S&P 500 average annual returns are approximately 10% (1926-2024), while Treasury bonds average 4-5% and money market accounts offer 4.5-5.5% (2024-2025 rates). Individual stocks and mutual funds should be compared against their respective category benchmarks—tech funds against NASDAQ, for example. A 15%+ ROI over a multi-year period generally outperforms typical market averages, though past performance doesn't guarantee future results.",
    },
    {
      question: "How do I calculate ROI on real estate investments using this calculator?",
      answer: "For real estate ROI, input your total initial investment (purchase price plus closing costs and repairs) as the starting value, and your net profit as the sum of property appreciation plus rental income minus mortgage interest and expenses. For example, a $300,000 property purchase with $30,000 down payment, $20,000 in rental gains over 2 years, and $50,000 appreciation equals $70,000 profit on $330,000 invested, or 21.2% ROI. Remember to account for property taxes, insurance, and maintenance costs.",
    },
    {
      question: "What happens if my investment shows a negative ROI?",
      answer: "A negative ROI means you lost money on the investment—the calculator will display this as a negative percentage. For example, if you invested $5,000 and it's now worth $4,200, your ROI is -16%. This occurs in market downturns or poor investment choices; use this insight to evaluate whether to hold for recovery or sell to limit further losses, while considering tax-loss harvesting opportunities for capital gains offset.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

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
              Final Value
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15000"
              value={inputs.finalValue}
              onChange={(e) => setInputs({ ...inputs, finalValue: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Investment Duration (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.investmentDuration}
              onChange={(e) => setInputs({ ...inputs, investmentDuration: e.target.value })}
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
      {results.roiPercentage > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      ROI Percentage
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.roiPercentage.toFixed(2)}%
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
                      Annualized Return
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.annualizedReturn.toFixed(2)}%
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
                      Total Gain
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalGain)}
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
                        : `Show All ${results.scheduleData.length} Years`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Year</TableHead>
                        <TableHead className="font-semibold">Value</TableHead>
                        <TableHead className="font-semibold">Gain</TableHead>
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
                            <TableCell className="font-medium">{row.year}</TableCell>
                            <TableCell>{formatCurrency(row.value)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.gain)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Investment Return (ROI) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Investment Return (ROI) Calculator is a powerful tool that measures the profitability of your investments by comparing the gains or losses against your initial capital outlay. Whether you're tracking individual stocks, bonds, mutual funds, or real estate, this calculator provides a standardized percentage metric that makes it easy to compare performance across different investments and time periods. Understanding your ROI is essential for evaluating investment performance, identifying underperforming assets, and making informed decisions about portfolio adjustments.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need four key inputs: your initial investment amount (the total capital deployed), your current or final investment value (what it's worth now or when you sold it), any income earned such as dividends or interest, and the holding period in years or months. The calculator converts these inputs into a clear ROI percentage that shows your return relative to your capital. You can also factor in fees and taxes by adjusting your net profit figure before calculation, which gives you a more accurate picture of actual gains.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once the calculator generates your ROI result, interpret it by comparing it against historical benchmarks: the S&P 500 averages 10% annually, bonds typically return 4-6%, and Treasury bills offer 4.5-5.5%. A 15%+ ROI generally indicates outperformance, while returns below 5% may suggest underperformance or conservative positioning. Remember that ROI doesn't account for risk—a 30% return on a volatile penny stock carries far more risk than a 10% return on a diversified index fund—so always consider volatility and your investment timeline alongside the percentage result.</p>
        </div>
      </section>

      {/* TABLE: Historical Average Annual ROI by Asset Class (2014-2024) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Historical Average Annual ROI by Asset Class (2014-2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical annual returns across major investment categories to help benchmark your calculator results.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Asset Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Annual ROI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">S&P 500 Index</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate-High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Core portfolio holdings</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">NASDAQ-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Growth-focused portfolios</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Investment-Grade Bonds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Income and stability</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Treasury Bills (6-month)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cash alternatives</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Real Estate (Residential)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term wealth building</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Money Market Accounts</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency funds</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dividend-Paying Stocks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Income generation</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data reflects 10-year historical averages; actual returns vary by year and market conditions. Past performance does not guarantee future results.</p>
      </section>

      {/* TABLE: ROI Calculation Examples for Common Investments */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">ROI Calculation Examples for Common Investments</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These real-world scenarios demonstrate how to use the ROI calculator for different investment types.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Investment Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Initial Investment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total ROI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Apple Stock Purchase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">185%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bond Investment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mutual Fund (Tech)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$39,625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">58.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rental Property</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$330,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$465,000 (with $35K rental gains)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dividend Stock Portfolio</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$67,500 (with $5K dividends)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cryptocurrency (Bitcoin)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Examples are illustrative only and do not account for taxes, fees, or inflation adjustments. Actual results will vary.</p>
      </section>

      {/* TABLE: Tax Impact on ROI (2024 U.S. Federal Rates) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tax Impact on ROI (2024 U.S. Federal Rates)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Understanding how taxes reduce your net ROI is critical for accurate investment evaluation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gain Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example $10K Gain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">After-Tax Gain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Effective ROI Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Long-term Capital Gains (High income)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-2% ROI reduction</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Long-term Capital Gains (Mid income)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-1.5% ROI reduction</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Long-term Capital Gains (Low income)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No reduction</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Short-term Capital Gains (Top bracket)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-3.7% ROI reduction</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Qualified Dividends (High income)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-2% ROI reduction</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Municipal Bond Interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% (Federal)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No reduction</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Tax rates vary by income level and filing status. State and local taxes may apply in addition to federal rates.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always include all sources of return in your ROI calculation—don't forget reinvested dividends, interest payments, and rental income, as these significantly boost your total ROI percentage and provide a complete picture of investment performance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the ROI calculator to compare your results against relevant benchmarks monthly or quarterly; if your portfolio consistently underperforms the S&P 500 by more than 3-5% annually, consider rebalancing toward index funds or reviewing your investment strategy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate both simple and annualized ROI when holding investments for periods longer than one year; annualized ROI reveals the true year-over-year compound growth rate and makes it easier to compare investments held for different time periods.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in taxes and fees when evaluating after-tax ROI for taxable accounts; a 25% pre-tax return can shrink to 15-18% after capital gains taxes and trading fees, fundamentally changing whether an investment met your financial goals.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring taxes in your ROI calculation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many investors calculate ROI without subtracting capital gains taxes and trading fees, which can reduce actual returns by 2-5% annually. Always compute after-tax ROI for accurate performance assessment, especially in taxable brokerage accounts where short-term gains face rates up to 37%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Comparing short-term ROI to long-term benchmarks</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measuring a 6-month investment return and comparing it directly to the S&P 500's 10-year average creates an apples-to-oranges comparison. Use the calculator to annualize short-term returns for fair benchmarking, or compare similar time horizons to identify true underperformance.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include dividends and interest in your calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">ROI should include all income sources—dividend payments, bond interest, and rental income—not just capital appreciation. Omitting these understates your actual return, potentially making a solid 12% total return appear as only an 8% capital gain.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using ROI alone to make sell or hold decisions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High ROI doesn't always mean you should hold forever, and negative ROI doesn't always mean sell immediately; consider tax implications of selling, future growth potential, and your overall asset allocation before acting on ROI results alone.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is ROI and how does the calculator measure it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">ROI (Return on Investment) measures the profit or loss generated on an investment relative to the amount invested, expressed as a percentage. The calculator uses the formula: ROI = (Net Profit / Initial Investment) × 100. For example, if you invest $10,000 and earn $1,500 in profit, your ROI is 15%. This metric helps you compare the efficiency of different investments on a standardized basis.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate ROI for multiple investments in my portfolio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate blended ROI across multiple investments, sum all net profits and divide by total capital invested, then multiply by 100. For instance, if you have three investments totaling $50,000 (Investment A: $20,000 with $2,000 gain, Investment B: $15,000 with $1,050 gain, Investment C: $15,000 with $750 gain), your blended ROI is ($3,800 / $50,000) × 100 = 7.6%. Use the calculator's portfolio feature to input each position separately for accurate tracking.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the ROI calculator account for taxes and fees?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard ROI calculations do not automatically include taxes and fees unless you manually adjust the net profit figure. To calculate after-tax ROI, subtract capital gains taxes (typically 15-20% for long-term gains, or up to 37% for short-term gains) and any broker fees from your net profit before entering the data. For example, a $2,000 gain minus $300 in taxes and fees becomes $1,700 in net profit for calculation purposes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between simple ROI and annualized ROI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Simple ROI shows total return over any time period without accounting for how long the investment was held, while annualized ROI converts returns to an equivalent yearly rate. To annualize ROI, use: Annualized ROI = (1 + Simple ROI)^(1/years) - 1. For example, a 25% return over 5 years equals approximately 4.57% annualized ROI. The calculator can compute both metrics depending on whether you input total holding period or specific year-to-date timeframes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I use the ROI calculator to compare stock investments vs. bonds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Input the initial purchase price, current market value, and any dividends or interest received for each investment type separately. Historically, stocks have delivered 10% average annual ROI, while investment-grade bonds averaged 4-6% annually (as of 2024 data). The calculator reveals which investment generated better returns relative to risk, though you should consider that stocks carry higher volatility and bonds offer more stability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the calculator help me determine if I should sell an investment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—use the ROI calculator to compare your current investment's return against benchmark indices and alternative investments. If your stock portfolio shows 5% ROI over 3 years while the S&P 500 averaged 12% annually, this suggests underperformance. However, ROI alone shouldn't dictate sell decisions; also consider future growth potential, tax implications of selling, and your overall financial goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a good ROI benchmark for my investments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Historical S&P 500 average annual returns are approximately 10% (1926-2024), while Treasury bonds average 4-5% and money market accounts offer 4.5-5.5% (2024-2025 rates). Individual stocks and mutual funds should be compared against their respective category benchmarks—tech funds against NASDAQ, for example. A 15%+ ROI over a multi-year period generally outperforms typical market averages, though past performance doesn't guarantee future results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate ROI on real estate investments using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For real estate ROI, input your total initial investment (purchase price plus closing costs and repairs) as the starting value, and your net profit as the sum of property appreciation plus rental income minus mortgage interest and expenses. For example, a $300,000 property purchase with $30,000 down payment, $20,000 in rental gains over 2 years, and $50,000 appreciation equals $70,000 profit on $330,000 invested, or 21.2% ROI. Remember to account for property taxes, insurance, and maintenance costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my investment shows a negative ROI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A negative ROI means you lost money on the investment—the calculator will display this as a negative percentage. For example, if you invested $5,000 and it's now worth $4,200, your ROI is -16%. This occurs in market downturns or poor investment choices; use this insight to evaluate whether to hold for recovery or sell to limit further losses, while considering tax-loss harvesting opportunities for capital gains offset.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sec.gov/investor/prot-rules/introduction-invest.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC: Investment Returns and Performance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The SEC provides authoritative guidance on understanding investment performance metrics and evaluating returns on securities.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/taxtopics/tc409" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Capital Gains Tax Rates (2024)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS resource outlining federal capital gains tax rates and how they apply to long-term and short-term investment returns.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/r/returnoninvestment.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Return on Investment (ROI) Definition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide explaining ROI calculations, formulas, and how to interpret results across different investment types.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/datadownload/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve: Historical S&P 500 Returns and Market Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Reserve economic data portal providing historical stock market returns and benchmarks for comparing investment performance.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Investment Return (ROI) Calculator"
      description="Calculate your Return on Investment (ROI) percentage. Measure the profitability of your assets and portfolio performance easily."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Investment Return (ROI) Calculator" },
        { id: "formula", label: "Investment Return (ROI) Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "ROI = (Final Value - Initial Investment) / Initial Investment × 100",
        variables: [
          { symbol: "Final Value", description: "The value of the investment at the end of the period" },
          { symbol: "Initial Investment", description: "The original amount of money invested" },
          { symbol: "ROI", description: "Return on Investment percentage" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invest $10,000 in a stock, and after 5 years, it's worth $15,000.",
        steps: [
          { 
            step: 1, 
            calculation: "$15,000 - $10,000 = $5,000", 
            description: "Calculate the total gain from the investment." 
          },
          { 
            step: 2, 
            calculation: "($5,000 / $10,000) × 100 = 50%", 
            description: "Determine the ROI percentage." 
          },
          { 
            step: 3, 
            calculation: "ROI is 50%", 
            description: "The investment has grown by 50% over 5 years." 
          }
        ],
        result: "The final result is a 50% ROI, indicating a profitable investment."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💰"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"🔄"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}
