import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function NetWorthCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    assets: "", 
    liabilities: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What counts as an asset in the net worth calculator?",
      answer: "Assets include anything of monetary value you own, such as cash, savings accounts, checking accounts, investment accounts (stocks, bonds, mutual funds), retirement accounts (401k, IRA), real estate property values, vehicles, and personal property like jewelry or collectibles. The calculator totals all these to give you a comprehensive picture of what you own. Be sure to use current market values rather than purchase prices for accurate results.",
    },
    {
      question: "Should I include my primary home's value in net worth calculations?",
      answer: "Yes, your primary residence should be included as an asset at its current fair market value (assessed value or recent appraisal). However, you must also subtract your mortgage balance as a liability. For example, if your home is worth $400,000 and you owe $250,000 on the mortgage, your home equity is $150,000—only that equity adds to your net worth.",
    },
    {
      question: "How do I value my retirement accounts for this calculator?",
      answer: "Use the current balance shown on your most recent account statement for 401(k)s, traditional IRAs, Roth IRAs, and SEP-IRAs. The calculator treats these at face value without adjusting for early withdrawal penalties or future taxes owed. For accuracy, log into your retirement provider's website and record the exact balance as of today's date.",
    },
    {
      question: "What liabilities should I include when calculating net worth?",
      answer: "Include all outstanding debts: mortgage balance, car loans, student loans, credit card balances, personal loans, and lines of credit. The calculator subtracts total liabilities from total assets to show your true net worth position. For example, someone with $500,000 in assets and $150,000 in debt has a net worth of $350,000.",
    },
    {
      question: "How often should I recalculate my net worth?",
      answer: "Financial experts recommend calculating net worth at least annually, typically at the start of the year or on your birthday, to track progress toward financial goals. High-net-worth individuals or those with volatile investments may want to check quarterly. The calculator makes it easy to see whether you're building wealth or if adjustments are needed.",
    },
    {
      question: "Does the net worth calculator account for investment growth or inflation?",
      answer: "No, the calculator provides a snapshot of your net worth at a single point in time using current values. It does not project future growth, account for inflation, or estimate tax implications. To understand long-term wealth building, compare your snapshots over months or years to see real growth trends.",
    },
    {
      question: "Should I include the cash value of life insurance in my net worth?",
      answer: "Only include the cash surrender value of permanent life insurance policies (whole life, universal life) if you have access to it. Term life insurance has no cash value and should not be included. If your permanent policy has a $50,000 cash value, add that as an asset, but understand it may be reduced by surrender charges.",
    },
    {
      question: "How does net worth differ from income or credit score?",
      answer: "Net worth measures total wealth (assets minus liabilities) at a specific moment, while income is money earned over time and credit score reflects borrowing history and payment reliability. You can have high income but low net worth if you spend everything, or low income but high net worth if you've saved for decades. The net worth calculator focuses only on accumulated assets and debts.",
    },
    {
      question: "What is a healthy net worth target for my age?",
      answer: "Fidelity recommends having net worth equal to 1x your annual salary by age 30, 3x by age 40, 6x by age 50, 8x by age 60, and 10x by age 67. For someone earning $60,000 annually, targets would be $60,000 at 30 and $600,000 at 67. Your actual target depends on retirement goals, expenses, and life circumstances—use the calculator to track progress against your personal benchmarks.",
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
    const assetsValue = parseFloat(inputs.assets) || 0;
    const liabilitiesValue = parseFloat(inputs.liabilities) || 0;

    // Validate
    if (assetsValue < 0 || liabilitiesValue < 0) {
      return { 
        netWorth: 0, 
        assetToLiabilityRatio: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const netWorth = assetsValue - liabilitiesValue;
    const assetToLiabilityRatio = liabilitiesValue > 0 ? assetsValue / liabilitiesValue : 0;

    // Generate schedule data if applicable (e.g., asset growth over time)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      projectedAssets: assetsValue * Math.pow(1.02, i + 1),
      projectedLiabilities: liabilitiesValue * Math.pow(1.01, i + 1),
      projectedNetWorth: (assetsValue * Math.pow(1.02, i + 1)) - (liabilitiesValue * Math.pow(1.01, i + 1))
    }));

    return { 
      netWorth, 
      assetToLiabilityRatio, 
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
    setInputs({ assets: "", liabilities: "" });
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
              Total Assets
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500000"
              value={inputs.assets}
              onChange={(e) => setInputs({ ...inputs, assets: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Total Liabilities
            </Label>
            <Input
              type="number"
              placeholder="e.g., 200000"
              value={inputs.liabilities}
              onChange={(e) => setInputs({ ...inputs, liabilities: e.target.value })}
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
      {results.netWorth !== 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Net Worth
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.netWorth)}
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
                      Asset to Liability Ratio
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.assetToLiabilityRatio.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-gray-400" />
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
                    Projected Net Worth Schedule
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
                        <TableHead className="font-semibold">Projected Assets</TableHead>
                        <TableHead className="font-semibold">Projected Liabilities</TableHead>
                        <TableHead className="font-semibold">Projected Net Worth</TableHead>
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
                            <TableCell>{formatCurrency(row.projectedAssets)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.projectedLiabilities)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.projectedNetWorth)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Net Worth Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The net worth calculator is a powerful tool that measures your total financial position by subtracting all debts from all assets you own. Understanding your net worth helps you track wealth accumulation, set financial goals, and make informed decisions about spending, saving, and investing. Whether you're planning for retirement or monitoring progress toward financial independence, this calculator provides a clear snapshot of where you stand.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, gather statements for all your assets (bank accounts, investments, retirement accounts, real estate, vehicles) and liabilities (mortgages, loans, credit cards). Enter current values and outstanding balances—use market prices for investments, assessed or appraised values for property, and exact loan balances from creditors. The calculator handles the math, adding all assets and subtracting all debts in seconds.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your result shows your net worth at this moment in time. A positive net worth means your assets exceed your debts; a negative net worth means you owe more than you own. Compare results year-over-year to see whether your net worth is growing, staying flat, or declining. This trend is more meaningful than any single number, as it reveals whether your financial habits are building long-term wealth.</p>
        </div>
      </section>

      {/* TABLE: Average Net Worth by Age Group (2024) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Net Worth by Age Group (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows median and average net worth across age groups in the United States for context and benchmarking.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Median Net Worth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Net Worth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Wealth Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Under 35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$76,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Savings & Early Investments</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35–44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$91,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$436,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Real Estate & Retirement Accounts</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45–54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$168,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$833,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Home Equity & Investments</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55–64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$212,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,175,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Retirement Accounts & Property</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">65+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$266,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,417,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Social Security & Pensions</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Source: Federal Reserve Survey of Consumer Finances (2023 data). Figures represent all households; averages are skewed by high-net-worth individuals.</p>
      </section>

      {/* TABLE: Common Asset Values for Net Worth Calculation (2025) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Asset Values for Net Worth Calculation (2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use current market values when entering assets into the calculator; this table shows how to value common holdings.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Asset Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">How to Determine Current Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Update Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stocks & ETFs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Closing price × shares owned (from brokerage statement)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 shares @ $150 = $15,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Real Estate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">County assessed value, Zillow estimate, or recent appraisal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Annually or after appraisal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400,000 home = $400,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">401(k) / IRA</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Current balance from plan statement or provider website</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly/Quarterly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">401(k) balance of $287,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vehicle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Current market value via Kelley Blue Book or NADA Guides</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Annually</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2020 Honda Civic = $18,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Savings Account</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Balance shown on bank statement</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Real-time</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-yield savings: $42,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Business Ownership</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Professional valuation or revenue multiple</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Annually</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small business valued at $250,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always use current fair market value, not purchase price or depreciated cost basis.</p>
      </section>

      {/* TABLE: Debt Types to Include in Liabilities (2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Debt Types to Include in Liabilities (2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Include all outstanding debts in the calculator's liability section to calculate net worth accurately.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Debt Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Outstanding Balance to Enter</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Rate Impact</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mortgage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Remaining principal owed (from loan statement)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Does not affect net worth calculation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Owe $225,000 on $350,000 home</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Credit Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Total current balance across all cards</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High rates (18–24% APR typical)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Total balance: $8,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Student Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Total federal and private student loan balance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Federal rates 5.5–8.5%, private variable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Federal loans: $35,000, Private: $12,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Car Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Remaining balance owed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Typical 4–8% APR</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Owe $18,000 on $22,000 vehicle</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Outstanding principal remaining</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Typical 6–36% APR</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Personal loan balance: $5,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Equity Line of Credit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Current drawn balance, not credit limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable rates 8–12% (2025)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">HELOC balance: $50,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Use exact balances from creditor statements. The calculator focuses on total liabilities; interest rates affect future payments but not current net worth.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Update your net worth calculation at least annually (ideally on the same date each year) to track consistent progress and identify trends in your wealth accumulation or spending patterns.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the most recent account statements and market prices when entering data—stale or estimated values reduce the calculator's accuracy and can mask problems or opportunities.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Break your net worth into categories (liquid assets, real estate, retirement, debts) to identify where most of your wealth is concentrated and whether your portfolio is properly diversified.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Set net worth milestones aligned with your age and income—Fidelity's benchmarks (1x salary by 30, 10x by 67) provide targets to work toward and help keep financial goals realistic.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using purchase price instead of current market value</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering what you paid for a home or investment years ago inflates net worth artificially. Always use current fair market value from a recent appraisal, Zillow estimate, or brokerage statement to ensure accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include mortgage principal owed as a liability</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some people count home value as an asset but forget to subtract the mortgage balance, overstating net worth significantly. Remember that home equity (value minus mortgage) is what truly adds to net worth.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including term life insurance as an asset</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Term life insurance provides no cash value and should never appear as an asset in your calculation. Only permanent policies (whole life, universal life) with surrenderable cash value should be counted.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring small debts or scattered credit card balances</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Forgetting to include every credit card balance, medical debt, or personal loan understates total liabilities and overstates net worth. Consolidate all debt balances from recent statements before calculating.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What counts as an asset in the net worth calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Assets include anything of monetary value you own, such as cash, savings accounts, checking accounts, investment accounts (stocks, bonds, mutual funds), retirement accounts (401k, IRA), real estate property values, vehicles, and personal property like jewelry or collectibles. The calculator totals all these to give you a comprehensive picture of what you own. Be sure to use current market values rather than purchase prices for accurate results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include my primary home's value in net worth calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, your primary residence should be included as an asset at its current fair market value (assessed value or recent appraisal). However, you must also subtract your mortgage balance as a liability. For example, if your home is worth $400,000 and you owe $250,000 on the mortgage, your home equity is $150,000—only that equity adds to your net worth.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I value my retirement accounts for this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the current balance shown on your most recent account statement for 401(k)s, traditional IRAs, Roth IRAs, and SEP-IRAs. The calculator treats these at face value without adjusting for early withdrawal penalties or future taxes owed. For accuracy, log into your retirement provider's website and record the exact balance as of today's date.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What liabilities should I include when calculating net worth?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Include all outstanding debts: mortgage balance, car loans, student loans, credit card balances, personal loans, and lines of credit. The calculator subtracts total liabilities from total assets to show your true net worth position. For example, someone with $500,000 in assets and $150,000 in debt has a net worth of $350,000.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my net worth?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Financial experts recommend calculating net worth at least annually, typically at the start of the year or on your birthday, to track progress toward financial goals. High-net-worth individuals or those with volatile investments may want to check quarterly. The calculator makes it easy to see whether you're building wealth or if adjustments are needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the net worth calculator account for investment growth or inflation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, the calculator provides a snapshot of your net worth at a single point in time using current values. It does not project future growth, account for inflation, or estimate tax implications. To understand long-term wealth building, compare your snapshots over months or years to see real growth trends.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include the cash value of life insurance in my net worth?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Only include the cash surrender value of permanent life insurance policies (whole life, universal life) if you have access to it. Term life insurance has no cash value and should not be included. If your permanent policy has a $50,000 cash value, add that as an asset, but understand it may be reduced by surrender charges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does net worth differ from income or credit score?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Net worth measures total wealth (assets minus liabilities) at a specific moment, while income is money earned over time and credit score reflects borrowing history and payment reliability. You can have high income but low net worth if you spend everything, or low income but high net worth if you've saved for decades. The net worth calculator focuses only on accumulated assets and debts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a healthy net worth target for my age?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fidelity recommends having net worth equal to 1x your annual salary by age 30, 3x by age 40, 6x by age 50, 8x by age 60, and 10x by age 67. For someone earning $60,000 annually, targets would be $60,000 at 30 and $600,000 at 67. Your actual target depends on retirement goals, expenses, and life circumstances—use the calculator to track progress against your personal benchmarks.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.federalreserve.gov/econres/files/scf2023.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Survey of Consumer Finances – Federal Reserve</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Federal Reserve data on household net worth, assets, and liabilities broken down by age and income.</p>
          </li>
          <li>
            <a href="https://www.fidelity.com/calculators-tools/overview" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">How Much Should You Have Saved by Age – Fidelity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fidelity's savings milestones and benchmarks to help you evaluate whether your net worth is on track for your age and retirement goals.</p>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/article/finance/net-worth" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Net Worth and Financial Goals – NerdWallet</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to understanding net worth, why it matters, and how to build wealth over time.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/about-us/newsroom/cfpb-report-financial-well-being-united-states/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Personal Finance: Building and Maintaining Wealth – Consumer Financial Protection Bureau</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB resources and research on financial well-being, wealth building strategies, and consumer financial health benchmarks.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Net Worth Calculator"
      description="Calculate your total net worth. Subtract liabilities from assets to understand your overall financial position and track wealth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Net Worth Calculator" },
        { id: "formula", label: "Net Worth Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Worth = Total Assets - Total Liabilities",
        variables: [
          { symbol: "Total Assets", description: "Sum of all owned assets" },
          { symbol: "Total Liabilities", description: "Sum of all debts and obligations" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have $500,000 in assets and $200,000 in liabilities.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Assets = $500,000", 
            explanation: "Determine the total value of all assets." 
          },
          { 
            label: "Step 2", 
            calculation: "Liabilities = $200,000", 
            explanation: "Determine the total value of all liabilities." 
          },
          { 
            label: "Step 3", 
            calculation: "Net Worth = $500,000 - $200,000 = $300,000", 
            explanation: "Subtract liabilities from assets to find net worth." 
          }
        ],
        result: "The final result is $300,000, indicating your net worth."
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
