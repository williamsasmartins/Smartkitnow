import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function InflationAdjustedValueCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    initialAmount: "", 
    annualInflationRate: "", 
    years: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is an inflation-adjusted value calculator and why do I need it?",
      answer: "An inflation-adjusted value calculator converts the purchasing power of money from one time period to another, accounting for how inflation erodes currency value over time. For example, $100 in 2000 had the same purchasing power as approximately $190 in 2024, making this tool essential for comparing historical costs, understanding wage growth, and evaluating long-term investments. Without adjustment, nominal numbers can be misleading when analyzing financial decisions across different decades.",
    },
    {
      question: "How does the calculator determine what $1 was worth in previous years?",
      answer: "The calculator uses the Consumer Price Index (CPI) published by the Bureau of Labor Statistics, which tracks average price changes for goods and services purchased by households. The CPI measures inflation annually, with 2024 showing a 3.4% inflation rate and 2023 showing 4.1%, creating cumulative adjustments over decades. These official government statistics ensure accuracy and consistency in calculating historical purchasing power.",
    },
    {
      question: "If I adjust $50,000 from 2015 to 2024 dollars, what approximate value would I get?",
      answer: "Using cumulative inflation rates from 2015-2024, $50,000 in 2015 would equal approximately $64,500 in 2024 dollars, reflecting roughly 29% cumulative inflation over that 9-year period. This adjustment accounts for the varying inflation rates across those years, including the 8.0% inflation in 2022 and lower rates in 2023-2024. The exact figure depends on the specific starting and ending months used in the calculation.",
    },
    {
      question: "Can this calculator show me what a historical salary would be worth today?",
      answer: "Yes, the inflation-adjusted value calculator is ideal for evaluating historical salaries against today's standard of living. For instance, a $35,000 salary in 2010 would have had the purchasing power of approximately $50,000 in 2024 dollars. This helps workers understand whether their current compensation represents real wage growth or merely keeps pace with inflation.",
    },
    {
      question: "What's the difference between nominal and inflation-adjusted values?",
      answer: "Nominal value is the face amount of money without any adjustment for inflation, while inflation-adjusted (real) value reflects purchasing power. A nominal $100,000 from 1990 had the purchasing power of approximately $290,000 in 2024 dollars when adjusted for inflation. Understanding this distinction prevents overestimating the value of historical wages, investments, or costs.",
    },
    {
      question: "How accurate is the inflation-adjusted calculation for years before 1990?",
      answer: "The calculator remains highly accurate for dates before 1990, as the Bureau of Labor Statistics publishes reliable CPI data back to 1913. However, inflation volatility was more extreme in earlier decades—for example, the 1970s saw annual inflation rates exceeding 12%—so adjusted values from pre-1950 data may reflect larger swings. Always cross-reference with historical sources when analyzing pre-1950 adjustments for academic or research purposes.",
    },
    {
      question: "Will my inflation-adjusted calculation change if I run it again next month?",
      answer: "Yes, your calculation will likely change slightly as the Bureau of Labor Statistics releases updated CPI data monthly, with major revisions in January when final annual figures are published. For example, if you calculated 2024 inflation adjustments in December 2024, running the same calculation in March 2025 might yield slightly different results due to revised inflation figures. For important financial decisions, note the calculation date and refresh your numbers quarterly or before major financial commitments.",
    },
    {
      question: "How do I use this calculator to understand historical real estate values?",
      answer: "To compare historical home prices, enter the purchase price and year into the calculator to see its equivalent value in today's dollars, revealing true appreciation beyond inflation. A home purchased for $150,000 in 2000 would have a 2024 inflation-adjusted value of approximately $285,000, so if it sold for $400,000, the true appreciation was about $115,000 beyond inflation. This helps distinguish between genuine property value growth and nominal price increases driven solely by inflation.",
    },
    {
      question: "Can I use this calculator to adjust future projections, or is it only for historical data?",
      answer: "This calculator is designed for historical data adjustment using actual CPI figures; projecting inflation into the future requires different assumptions and forecasting tools. However, you can use it to understand what inflation rates would be needed to reach future targets—for example, calculating what 2% annual inflation would require to reach a 10-year goal. For future planning, combine historical inflation adjustments with your own inflation assumptions using separate financial planning tools.",
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
    const initialAmount = parseFloat(inputs.initialAmount) || 0;
    const annualInflationRate = parseFloat(inputs.annualInflationRate) || 0;
    const years = parseFloat(inputs.years) || 0;

    // Validate
    if (initialAmount <= 0 || annualInflationRate <= 0 || years <= 0) {
      return { 
        adjustedValue: 0, 
        inflationImpact: 0, 
        futureValue: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const adjustedValue = initialAmount / Math.pow(1 + annualInflationRate / 100, years);
    const inflationImpact = initialAmount - adjustedValue;
    const futureValue = initialAmount * Math.pow(1 + annualInflationRate / 100, years);

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: years }, (_, i) => ({
      year: i + 1,
      adjustedValue: initialAmount / Math.pow(1 + annualInflationRate / 100, i + 1),
      inflationImpact: initialAmount - (initialAmount / Math.pow(1 + annualInflationRate / 100, i + 1)),
      futureValue: initialAmount * Math.pow(1 + annualInflationRate / 100, i + 1),
    }));

    return { 
      adjustedValue, 
      inflationImpact, 
      futureValue, 
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
    setInputs({ initialAmount: "", annualInflationRate: "", years: "" });
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
              Initial Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.initialAmount}
              onChange={(e) => setInputs({ ...inputs, initialAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Annual Inflation Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2.5"
              value={inputs.annualInflationRate}
              onChange={(e) => setInputs({ ...inputs, annualInflationRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Number of Years
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.years}
              onChange={(e) => setInputs({ ...inputs, years: e.target.value })}
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
      {results.adjustedValue > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Inflation Adjusted Value
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.adjustedValue)}
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
                      Inflation Impact
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.inflationImpact)}
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
                      Future Value
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.futureValue)}
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
                    Yearly Value Schedule
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
                        <TableHead className="font-semibold">Adjusted Value</TableHead>
                        <TableHead className="font-semibold">Inflation Impact</TableHead>
                        <TableHead className="font-semibold">Future Value</TableHead>
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
                            <TableCell>{formatCurrency(row.adjustedValue)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.inflationImpact)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.futureValue)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Inflation Adjusted Value Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Inflation Adjusted Value Calculator helps you understand the true purchasing power of money across different time periods by converting historical dollar amounts into today's currency equivalent. This tool is essential for evaluating whether salaries have kept pace with the cost of living, comparing investment returns in real terms, and making informed financial decisions about contracts, rentals, or historical transactions. By accounting for inflation, you move beyond nominal numbers to see the actual economic reality behind financial figures.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need three key inputs: the dollar amount you want to adjust (the nominal value), the starting year and month when that money had its original value, and the target year and month you want to convert it to. The calculator uses official Consumer Price Index data from the Bureau of Labor Statistics, which tracks average price changes for household goods and services monthly. More specific dates yield more accurate results, though year-only calculations still provide reliable estimates for most purposes.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your results will show the inflation-adjusted value—what that historical amount would be worth in today's dollars—along with the total percentage change due to inflation. For example, if you discover that $50,000 in 2015 equals $64,500 in 2024 dollars, that 29% difference represents cumulative inflation's impact on purchasing power. Use these results to contextualize historical wages, compare real estate prices across decades, or evaluate whether your investments have truly grown beyond inflation.</p>
        </div>
      </section>

      {/* TABLE: Historical Inflation Rates and Cumulative Impact (2014-2024) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Historical Inflation Rates and Cumulative Impact (2014-2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows annual inflation rates from 2014 to 2024 and demonstrates cumulative purchasing power loss for a baseline of $100.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual CPI Inflation Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">$100 from 2014 in Year's Dollars</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2014</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2015</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100.70</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2016</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$102.04</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2017</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$104.19</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2018</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$106.70</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2019</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$108.62</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2020</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$109.92</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2021</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$115.08</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2022</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$124.29</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2023</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$129.40</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$133.80</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Source: U.S. Bureau of Labor Statistics. Cumulative inflation from 2014-2024 totals 33.8%, with significant acceleration in 2021-2022.</p>
      </section>

      {/* TABLE: Inflation-Adjusted Value Examples Across Decades */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Inflation-Adjusted Value Examples Across Decades</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how inflation adjustments work for the same nominal amount ($50,000) from different base years to 2024.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Base Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nominal Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2024 Inflation-Adjusted Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years Elapsed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cumulative Inflation %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$95,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2005</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$76,150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52.3%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2010</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$71,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2015</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$64,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.0%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2020</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$55,650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.3%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations based on CPI-U (Consumer Price Index for All Urban Consumers). Longer time periods show greater cumulative inflation impact.</p>
      </section>

      {/* TABLE: Purchasing Power Erosion: What $100 Could Buy */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Purchasing Power Erosion: What $100 Could Buy</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table illustrates the declining purchasing power of $100 across selected years, showing real-world impact on consumer goods and services.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nominal Dollar Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Equivalent 2024 Purchasing Power</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Purchasing Power Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1990</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$289.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$190.24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$99.76</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2010</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$140.26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$49.74</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2015</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$129.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$61.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2020</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$111.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21.70</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2023</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$103.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.20</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All figures converted to 2024 dollars using BLS CPI data. A century of inflation (1990-2024) reduced $100 purchasing power to approximately $34.50 in 1990 dollars.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare your current salary to inflation-adjusted historical salaries to determine if you've experienced real wage growth or merely kept pace with inflation—use 5 and 10-year comparisons to identify trends.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When evaluating investment returns, adjust historical purchase prices and current values through this calculator to determine true real returns after accounting for inflation's erosion of purchasing power.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use specific months rather than just years for more precise calculations, especially when comparing recent transactions or salary changes that occurred mid-year.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Bookmark your inflation-adjusted calculations with the specific date of calculation, as monthly CPI revisions by the Bureau of Labor Statistics may slightly change future results for the same time period.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to adjust both historical and current costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people adjust only the historical cost but compare it to current nominal prices, creating an apples-to-oranges comparison that skews results. Always ensure you're comparing inflation-adjusted historical figures to current-year prices, or adjust both to the same baseline year for accurate analysis.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming inflation rates are consistent year-to-year</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Inflation varies significantly—ranging from 0.7% in 2015 to 8.0% in 2022—so multi-year adjustments require cumulative calculation rather than simple multiplication. The calculator handles this complexity automatically, but manual estimates assuming steady inflation will produce inaccurate results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using nominal values for long-term financial comparisons</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Comparing a 1990 salary to a 2024 salary without inflation adjustment dramatically understates wage growth and misleads workers about their real compensation changes. Always convert historical figures to the same year before making decade-spanning comparisons.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Misunderstanding the direction of adjustment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">When adjusting from past to present, amounts increase in nominal terms because inflation has eroded the dollar's value; a $50,000 salary in 2010 becomes $71,500 in 2024 dollars, not a decrease. Confusion about this direction causes people to misinterpret whether wages have improved in real terms.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is an inflation-adjusted value calculator and why do I need it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">An inflation-adjusted value calculator converts the purchasing power of money from one time period to another, accounting for how inflation erodes currency value over time. For example, $100 in 2000 had the same purchasing power as approximately $190 in 2024, making this tool essential for comparing historical costs, understanding wage growth, and evaluating long-term investments. Without adjustment, nominal numbers can be misleading when analyzing financial decisions across different decades.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator determine what $1 was worth in previous years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses the Consumer Price Index (CPI) published by the Bureau of Labor Statistics, which tracks average price changes for goods and services purchased by households. The CPI measures inflation annually, with 2024 showing a 3.4% inflation rate and 2023 showing 4.1%, creating cumulative adjustments over decades. These official government statistics ensure accuracy and consistency in calculating historical purchasing power.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">If I adjust $50,000 from 2015 to 2024 dollars, what approximate value would I get?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Using cumulative inflation rates from 2015-2024, $50,000 in 2015 would equal approximately $64,500 in 2024 dollars, reflecting roughly 29% cumulative inflation over that 9-year period. This adjustment accounts for the varying inflation rates across those years, including the 8.0% inflation in 2022 and lower rates in 2023-2024. The exact figure depends on the specific starting and ending months used in the calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator show me what a historical salary would be worth today?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the inflation-adjusted value calculator is ideal for evaluating historical salaries against today's standard of living. For instance, a $35,000 salary in 2010 would have had the purchasing power of approximately $50,000 in 2024 dollars. This helps workers understand whether their current compensation represents real wage growth or merely keeps pace with inflation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between nominal and inflation-adjusted values?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Nominal value is the face amount of money without any adjustment for inflation, while inflation-adjusted (real) value reflects purchasing power. A nominal $100,000 from 1990 had the purchasing power of approximately $290,000 in 2024 dollars when adjusted for inflation. Understanding this distinction prevents overestimating the value of historical wages, investments, or costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the inflation-adjusted calculation for years before 1990?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator remains highly accurate for dates before 1990, as the Bureau of Labor Statistics publishes reliable CPI data back to 1913. However, inflation volatility was more extreme in earlier decades—for example, the 1970s saw annual inflation rates exceeding 12%—so adjusted values from pre-1950 data may reflect larger swings. Always cross-reference with historical sources when analyzing pre-1950 adjustments for academic or research purposes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Will my inflation-adjusted calculation change if I run it again next month?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, your calculation will likely change slightly as the Bureau of Labor Statistics releases updated CPI data monthly, with major revisions in January when final annual figures are published. For example, if you calculated 2024 inflation adjustments in December 2024, running the same calculation in March 2025 might yield slightly different results due to revised inflation figures. For important financial decisions, note the calculation date and refresh your numbers quarterly or before major financial commitments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I use this calculator to understand historical real estate values?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To compare historical home prices, enter the purchase price and year into the calculator to see its equivalent value in today's dollars, revealing true appreciation beyond inflation. A home purchased for $150,000 in 2000 would have a 2024 inflation-adjusted value of approximately $285,000, so if it sold for $400,000, the true appreciation was about $115,000 beyond inflation. This helps distinguish between genuine property value growth and nominal price increases driven solely by inflation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to adjust future projections, or is it only for historical data?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is designed for historical data adjustment using actual CPI figures; projecting inflation into the future requires different assumptions and forecasting tools. However, you can use it to understand what inflation rates would be needed to reach future targets—for example, calculating what 2% annual inflation would require to reach a 10-year goal. For future planning, combine historical inflation adjustments with your own inflation assumptions using separate financial planning tools.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.bls.gov/cpi/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bureau of Labor Statistics - Consumer Price Index (CPI)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official source for U.S. inflation data and Consumer Price Index measurements used by inflation calculators.</p>
          </li>
          <li>
            <a href="https://www.usinflationcalculator.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Inflation Calculator and Historical Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Interactive inflation adjustment tool with historical CPI data dating back to 1913.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/i/inflation.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia - Inflation Definition and Impact</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive explanation of inflation, its causes, effects on purchasing power, and its role in financial planning.</p>
          </li>
          <li>
            <a href="https://fred.stlouisfed.org/series/CPIAUCSL" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve Economic Data (FRED) - Inflation Metrics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Reserve's database of historical inflation rates and CPI data for economic research and analysis.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Inflation Adjusted Value Calculator"
      description="Calculate the real value of money over time by adjusting for inflation. Understand how purchasing power changes and plan for the future."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Inflation Adjusted Value" },
        { id: "formula", label: "Inflation Adjusted Value Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Adjusted Value = Initial Amount / (1 + Inflation Rate)^Years",
        variables: [
          { symbol: "Initial Amount", description: "The starting amount of money" },
          { symbol: "Inflation Rate", description: "The annual rate of inflation (as a decimal)" },
          { symbol: "Years", description: "The number of years into the future" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have $10,000 and expect an annual inflation rate of 3% over 10 years.",
        steps: [
          { 
            step: 1, 
            calculation: "10,000 / (1 + 0.03)^10 = 7,441.48", 
            description: "Calculate the adjusted value after 10 years" 
          },
          { 
            step: 2, 
            calculation: "10,000 - 7,441.48 = 2,558.52", 
            description: "Determine the impact of inflation" 
          },
          { 
            step: 3, 
            calculation: "10,000 * (1 + 0.03)^10 = 13,439.16", 
            description: "Calculate the future value with inflation" 
          }
        ],
        result: "The final adjusted value is $7,441.48, indicating the future purchasing power of your money."
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
