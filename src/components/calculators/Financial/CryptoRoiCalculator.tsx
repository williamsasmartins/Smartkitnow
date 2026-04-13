import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CryptoRoiCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialInvestment: "", 
    finalValue: "", 
    timePeriod: "" 
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
    const initialInvestmentValue = parseFloat(inputs.initialInvestment) || 0;
    const finalValueValue = parseFloat(inputs.finalValue) || 0;
    const timePeriodValue = parseFloat(inputs.timePeriod) || 0;

    if (initialInvestmentValue <= 0 || finalValueValue <= 0 || timePeriodValue <= 0) {
      return { 
        roi: 0, 
        annualizedRoi: 0, 
        totalGain: 0, 
        scheduleData: [] 
      };
    }

    const totalGain = finalValueValue - initialInvestmentValue;
    const roi = (totalGain / initialInvestmentValue) * 100;
    const annualizedRoi = ((Math.pow(finalValueValue / initialInvestmentValue, 1 / timePeriodValue) - 1) * 100);

    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      value: initialInvestmentValue * Math.pow(1 + annualizedRoi / 100, (i + 1) / 12),
    }));

    return { 
      roi, 
      annualizedRoi, 
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
    setInputs({ initialInvestment: "", finalValue: "", timePeriod: "" });
  };

  const faqs = [
    {
      question: "What is the formula used in the ROI Calculator?",
      answer: "The ROI Calculator uses the formula: ROI = ((Final Value - Initial Investment) / Initial Investment) × 100. This gives you a percentage return on your investment. For example, if you invest $10,000 and it grows to $12,500, your ROI would be 25%. The calculator automates this computation to save time and reduce manual calculation errors.",
    },
    {
      question: "How do I calculate ROI for a stock investment?",
      answer: "To calculate stock ROI, enter your initial purchase price (including commissions), the current or sale price, and any dividends received. The calculator will show your total return as a percentage. For instance, if you bought 100 shares at $50 per share ($5,000 total) and sold them at $65 per share ($6,500 total) plus $200 in dividends, your ROI would be 34%. This method accounts for both capital gains and income received.",
    },
    {
      question: "Can I use this calculator for real estate investments?",
      answer: "Yes, the ROI Calculator works well for real estate investments. Enter your total initial investment (down payment plus closing costs and improvements) and your current property value or sale price plus rental income received. For example, a $400,000 property purchased with a $80,000 down payment and $50,000 in improvements, now worth $500,000 with $30,000 in net rental income, would show an ROI of approximately 37.5% over your invested capital. Remember to account for mortgage payments, taxes, insurance, and maintenance as expenses against rental income.",
    },
    {
      question: "What's the difference between ROI and annualized ROI?",
      answer: "ROI shows the total percentage return regardless of time period, while annualized ROI spreads that return across a yearly basis. For example, a 20% return over 2 years equals roughly 9.54% annualized ROI. The ROI Calculator can help you compute both to understand whether an investment's performance is strong on an annual basis. Annualized returns make it easier to compare investments held for different time periods.",
    },
    {
      question: "How should I handle negative ROI in the calculator?",
      answer: "Negative ROI occurs when your current value is less than your initial investment, indicating a loss. For example, if you invested $5,000 and it's now worth $4,200, your ROI would be -16%. The calculator will display this as a negative percentage, helping you identify underperforming investments. Use negative ROI results to evaluate whether to hold, sell, or rebalance your portfolio.",
    },
    {
      question: "Does the ROI Calculator account for taxes and fees?",
      answer: "The basic ROI Calculator shows gross returns without automatic tax and fee deductions. However, you should manually adjust your final value to reflect capital gains taxes, investment fees, and trading commissions for an accurate after-tax ROI. For example, if you owe 15% capital gains tax on a $10,000 gain, subtract $1,500 from your final value before calculating. Including these factors provides a more realistic picture of your actual net return.",
    },
    {
      question: "What is a good ROI benchmark?",
      answer: "Historical S&P 500 returns average approximately 10% annually, though past performance doesn't guarantee future results. Real estate typically targets 8-12% annual ROI, while bonds averaged around 4-5% in recent years. A good ROI depends on your investment type, risk tolerance, and time horizon—higher-risk investments should target higher returns. Compare your calculated ROI against appropriate benchmarks for your asset class and market conditions.",
    },
    {
      question: "Can I compare multiple investments using this calculator?",
      answer: "Yes, you can run the ROI Calculator multiple times for different investments and compare the results side-by-side. For instance, compare a stock investment with 18% ROI against a bond investment with 5% ROI over the same period. This helps identify which investments performed best relative to your capital deployed. However, also consider risk, liquidity, and time period when comparing investments with significantly different ROIs.",
    },
    {
      question: "How do I calculate ROI for a business venture or startup?",
      answer: "For business investments, enter your total initial capital investment and your current business valuation or net profits. If you invested $50,000 in a startup that's now valued at $200,000, your ROI would be 300%. For operating businesses, you might use annual net profit divided by initial investment, though the calculator's basic approach works for one-time valuations. Factor in time invested and opportunity cost for a complete picture.",
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
              Time Period (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.timePeriod}
              onChange={(e) => setInputs({ ...inputs, timePeriod: e.target.value })}
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
      {results.roi > 0 && (
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
                      {results.roi.toFixed(2)}%
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
                      Annualized ROI
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.annualizedRoi.toFixed(2)}%
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
                    Investment Growth Over Time
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
                        <TableHead className="font-semibold">Value</TableHead>
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
                            <TableCell>{formatCurrency(row.value)}</TableCell>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the ROI (Return on Investment) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The ROI Calculator is a financial tool designed to measure the profitability of your investments by calculating the percentage return on capital deployed. Whether you're analyzing stocks, real estate, bonds, or business ventures, this calculator provides a clear metric for comparing investment performance and making informed financial decisions. Understanding ROI is essential for evaluating whether an investment is worth your time and money.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need three key inputs: your initial investment amount (the total capital you deployed), your final value or current value (what your investment is worth now or when you sold it), and optionally the time period if you want to calculate annualized returns. Some variations may ask for additional income generated, such as dividends or rental income, which should be added to your final value. Enter these figures accurately to ensure the calculator produces reliable results for your analysis.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once calculated, your ROI appears as a percentage that shows your profit or loss relative to your initial investment. A positive ROI indicates profit, while negative ROI indicates a loss. Compare your result against relevant benchmarks—such as the 10% average S&P 500 return or your specific asset class's typical performance—to determine if your investment performed well. Use these insights to identify top-performing investments, cut underperformers, and rebalance your portfolio strategically.</p>
        </div>
      </section>

      {/* TABLE: ROI Comparison: Common Investment Types (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">ROI Comparison: Common Investment Types (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical ROI ranges and historical performance benchmarks for various investment vehicles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Investment Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Historical Average ROI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time Horizon</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">S&P 500 Index Funds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-10% annually</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Individual Stocks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20% (above average)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Real Estate (Residential)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12% annually</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corporate Bonds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5% annually</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-10 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low-Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Treasury Securities</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4% annually</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Money Market Funds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-5.5% annually</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Short-term</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dividend-Paying Stocks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3% dividend yield + growth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peer-to-Peer Lending</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7% annually</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate-High</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Past performance does not guarantee future results. ROI varies based on economic conditions, market volatility, and individual investment selection.</p>
      </section>

      {/* TABLE: ROI Calculation Examples with Different Time Periods */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">ROI Calculation Examples with Different Time Periods</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Real-world examples showing how the same investment generates different annualized returns depending on the holding period.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Initial Investment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total ROI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time Period</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annualized ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 year</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20% avg/year</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.9% avg/year</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.5% avg/year</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.4% avg/year</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.3% annualized</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30.4% avg/year</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Annualized ROI uses compound annual growth rate (CAGR) calculations. Longer time periods typically show more moderate annualized returns even with higher total ROI.</p>
      </section>

      {/* TABLE: ROI Thresholds and Performance Ratings */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">ROI Thresholds and Performance Ratings</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">A guide to interpreting your calculated ROI results and understanding investment performance tiers.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">ROI Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Performance Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interpretation</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Investment Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Negative ROI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Investment decreased in value</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any asset class</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Underperforming; consider alternatives</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Conservative bonds</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Average</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Meets inflation-adjusted returns</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mixed portfolio</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Outperforming many benchmarks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Diversified stocks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">13-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Strong performance relative to market</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Growth stocks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">21%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exceptional returns; consider risk factors</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Speculative investments</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These ratings are relative to historical averages. Always consider risk, time period, and economic context when evaluating performance.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always include all costs associated with your investment in the initial investment amount, such as brokerage fees, closing costs on real estate, or startup expenses for businesses, to calculate a true ROI.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When comparing multiple investments, calculate annualized ROI to normalize returns across different time periods—a 50% return over 5 years isn't the same as 50% over 1 year.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your ROI quarterly or annually to monitor investment performance trends and identify when it's time to rebalance or exit underperforming positions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't ignore tax implications when calculating final value—subtract estimated capital gains taxes, dividend taxes, and investment fees to determine your actual after-tax ROI for accurate decision-making.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include All Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many investors only count the asset price and forget broker commissions, trading fees, and closing costs, which artificially inflates ROI. A $10,000 stock purchase with $150 in commissions is really a $10,150 investment, reducing your calculated ROI by about 1-2%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Inflation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 7% nominal ROI might look good, but if inflation is 3%, your real ROI is only about 4%, which is below historical market averages. Always consider the inflation rate during your investment period for meaningful long-term comparisons.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Comparing ROI Without Time Context</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 30% ROI over 5 years (about 5.4% annualized) is very different from 30% in one year, but many investors compare them equally. Always annualize returns when comparing investments held for different periods.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Taxes in Final Valuation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many calculators show gross ROI before taxes, but capital gains taxes, dividend taxes, and state taxes can reduce your net return by 20-40% depending on your bracket. Use after-tax values in the calculator for realistic performance assessment.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the formula used in the ROI Calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The ROI Calculator uses the formula: ROI = ((Final Value - Initial Investment) / Initial Investment) × 100. This gives you a percentage return on your investment. For example, if you invest $10,000 and it grows to $12,500, your ROI would be 25%. The calculator automates this computation to save time and reduce manual calculation errors.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate ROI for a stock investment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate stock ROI, enter your initial purchase price (including commissions), the current or sale price, and any dividends received. The calculator will show your total return as a percentage. For instance, if you bought 100 shares at $50 per share ($5,000 total) and sold them at $65 per share ($6,500 total) plus $200 in dividends, your ROI would be 34%. This method accounts for both capital gains and income received.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for real estate investments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the ROI Calculator works well for real estate investments. Enter your total initial investment (down payment plus closing costs and improvements) and your current property value or sale price plus rental income received. For example, a $400,000 property purchased with a $80,000 down payment and $50,000 in improvements, now worth $500,000 with $30,000 in net rental income, would show an ROI of approximately 37.5% over your invested capital. Remember to account for mortgage payments, taxes, insurance, and maintenance as expenses against rental income.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between ROI and annualized ROI?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">ROI shows the total percentage return regardless of time period, while annualized ROI spreads that return across a yearly basis. For example, a 20% return over 2 years equals roughly 9.54% annualized ROI. The ROI Calculator can help you compute both to understand whether an investment's performance is strong on an annual basis. Annualized returns make it easier to compare investments held for different time periods.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I handle negative ROI in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Negative ROI occurs when your current value is less than your initial investment, indicating a loss. For example, if you invested $5,000 and it's now worth $4,200, your ROI would be -16%. The calculator will display this as a negative percentage, helping you identify underperforming investments. Use negative ROI results to evaluate whether to hold, sell, or rebalance your portfolio.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the ROI Calculator account for taxes and fees?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The basic ROI Calculator shows gross returns without automatic tax and fee deductions. However, you should manually adjust your final value to reflect capital gains taxes, investment fees, and trading commissions for an accurate after-tax ROI. For example, if you owe 15% capital gains tax on a $10,000 gain, subtract $1,500 from your final value before calculating. Including these factors provides a more realistic picture of your actual net return.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a good ROI benchmark?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Historical S&P 500 returns average approximately 10% annually, though past performance doesn't guarantee future results. Real estate typically targets 8-12% annual ROI, while bonds averaged around 4-5% in recent years. A good ROI depends on your investment type, risk tolerance, and time horizon—higher-risk investments should target higher returns. Compare your calculated ROI against appropriate benchmarks for your asset class and market conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I compare multiple investments using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can run the ROI Calculator multiple times for different investments and compare the results side-by-side. For instance, compare a stock investment with 18% ROI against a bond investment with 5% ROI over the same period. This helps identify which investments performed best relative to your capital deployed. However, also consider risk, liquidity, and time period when comparing investments with significantly different ROIs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate ROI for a business venture or startup?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For business investments, enter your total initial capital investment and your current business valuation or net profits. If you invested $50,000 in a startup that's now valued at $200,000, your ROI would be 300%. For operating businesses, you might use annual net profit divided by initial investment, though the calculator's basic approach works for one-time valuations. Factor in time invested and opportunity cost for a complete picture.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sec.gov/investor/alerts-and-bulletins" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC: Investor Information on Return on Investment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Securities and Exchange Commission provides official guidance on calculating and understanding investment returns.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/r/returnoninvestment.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Return on Investment (ROI) Definition and Examples</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive explanation of ROI calculations, formulas, and real-world applications across different investment types.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p550" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS: Publication 550 - Investment Income and Expenses</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on how investment income, capital gains, and related expenses affect your tax calculations and net ROI.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/investing/how-to-calculate-roi/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate: How to Calculate ROI and Compare Investments</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate's detailed guide on ROI calculations, annualized returns, and comparing investment performance metrics.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="ROI (Return on Investment) Calculator"
      description="Calculate crypto Return on Investment. Measure the performance of your digital asset investments over specific timeframes."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding ROI (Return on Investment) Calculator" },
        { id: "formula", label: "ROI (Return on Investment) Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "ROI = [(Final Value - Initial Investment) / Initial Investment] × 100",
        variables: [
          { symbol: "Final Value", description: "The value of the investment at the end of the period" },
          { symbol: "Initial Investment", description: "The amount of money initially invested" },
          { symbol: "ROI", description: "Return on Investment, expressed as a percentage" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you invested $10,000 in a cryptocurrency, and after 5 years, the value increased to $15,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "15000 - 10000 = 5000", 
            explanation: "Calculate the total gain by subtracting the initial investment from the final value." 
          },
          { 
            label: "Step 2", 
            calculation: "(5000 / 10000) × 100 = 50%", 
            explanation: "Divide the total gain by the initial investment and multiply by 100 to get the ROI." 
          },
          { 
            label: "Step 3", 
            calculation: "[(1 + 0.50)^(1/5) - 1] × 100 = 8.45%", 
            explanation: "Calculate the annualized ROI using the formula for compound annual growth rate." 
          }
        ],
        result: "The final result is a 50% ROI over 5 years, with an annualized ROI of 8.45%."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💳" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}