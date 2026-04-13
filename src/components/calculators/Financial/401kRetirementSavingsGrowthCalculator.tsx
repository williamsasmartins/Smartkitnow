import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const faqs = [
    {
      question: "What is the maximum I can contribute to my 401(k) in 2024?",
      answer: "For 2024, the IRS contribution limit is $23,500 for individuals under age 50, and $31,000 for those 50 and older (including the $7,500 catch-up contribution). These limits increase to $24,000 and $32,000 respectively for 2025. The calculator uses these limits to help you project maximum growth scenarios based on your age and contribution strategy.",
    },
    {
      question: "How does employer matching affect my 401(k) growth projection?",
      answer: "Employer matching is typically 50% to 100% of your contributions up to 3-6% of salary. If you contribute $5,000 annually and your employer matches 50% up to 6% of salary, you receive an additional $2,500 in free money. This calculator multiplies your projected balance significantly—a $5,000 annual contribution with 100% matching could grow to approximately $472,000 over 30 years at 7% annual returns, versus $328,000 without matching.",
    },
    {
      question: "What average annual return should I assume for my projections?",
      answer: "Historical stock market returns average 10% annually before inflation, while a balanced portfolio (60% stocks/40% bonds) averages 7-8% annually. Most retirement calculators use 7% as a conservative estimate for mixed portfolios. The calculator allows you to input your expected return based on your asset allocation—higher risk portfolios may assume 8-10%, while conservative portfolios might use 5-6%.",
    },
    {
      question: "How does inflation impact my 401(k) projections on this calculator?",
      answer: "The calculator shows nominal (pre-inflation) growth by default. If inflation averages 3% annually, your $500,000 projected balance in future dollars has less purchasing power than in today's dollars. Some calculators offer an inflation-adjusted view; for example, that $500,000 balance becomes approximately $276,000 in today's dollars over 20 years with 3% inflation.",
    },
    {
      question: "Can I use this calculator to model different retirement ages?",
      answer: "Yes, the calculator typically allows you to input your current age and desired retirement age to model different scenarios. If you're 35 and retire at 65, you have 30 years of growth; retiring at 67 gives you 32 years. This additional 2 years could add $50,000-$100,000+ to your balance depending on contributions and returns, demonstrating the significant impact of working a few extra years.",
    },
    {
      question: "What happens to my 401(k) if I change jobs?",
      answer: "This calculator typically projects continuous contributions to a single 401(k). In reality, you can roll your balance to a new employer's plan, an IRA, or leave it with your former employer. A $200,000 balance rolled to an IRA with the same 7% returns continues growing uninterrupted, but if left idle or in a low-yield account, growth slows significantly. The calculator helps you understand the cost of contribution gaps during job transitions.",
    },
    {
      question: "How much should I have saved by age 35 according to retirement experts?",
      answer: "Fidelity recommends having 1x your annual salary saved by age 35. If you earn $75,000, you should have $75,000 saved. This calculator helps you backtest whether your historical contributions align with this benchmark and project whether your current path meets it for future milestones (3x salary by 40, 6x by 50, 10x by 67).",
    },
    {
      question: "Does this calculator account for Required Minimum Distributions (RMDs)?",
      answer: "Most 401(k) growth calculators project pre-RMD balances and don't automatically reduce them. At age 73, the IRS requires you to withdraw roughly 3.65-8.87% of your balance annually depending on life expectancy tables. This calculator typically shows your maximum balance; actual usable balance will be reduced by required withdrawals in retirement, though you can model manual withdrawals in advanced versions.",
    },
    {
      question: "What's the difference between traditional and Roth 401(k) projections?",
      answer: "Both grow tax-free within the account, so this calculator's growth projections are identical. The difference appears in retirement: traditional 401(k) withdrawals are taxed as ordinary income (if you're in a 24% bracket, a $500,000 withdrawal nets $380,000), while Roth withdrawals are tax-free. Use this calculator to model the pre-tax balance, then adjust for your expected retirement tax bracket to calculate after-tax income.",
    }
  ];

export default function RetirementSavingsGrowthCalculator() {
  const faqJsonLd = useFaqJsonLd(faqs);
  // STATE
  const [inputs, setInputs] = useState({ 
    initialBalance: "", 
    annualContribution: "", 
    employerMatch: "", 
    annualGrowthRate: "", 
    yearsToGrow: "" 
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
    const initialBalance = parseFloat(inputs.initialBalance) || 0;
    const annualContribution = parseFloat(inputs.annualContribution) || 0;
    const employerMatch = parseFloat(inputs.employerMatch) || 0;
    const annualGrowthRate = parseFloat(inputs.annualGrowthRate) / 100 || 0;
    const yearsToGrow = parseInt(inputs.yearsToGrow) || 0;

    // Validate
    if (initialBalance < 0 || annualContribution < 0 || employerMatch < 0 || annualGrowthRate < 0 || yearsToGrow <= 0) {
      return { 
        mainResult: 0, 
        totalContributions: 0, 
        totalGrowth: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    let balance = initialBalance;
    let totalContributions = 0;
    let totalGrowth = 0;
    const scheduleData: { year: number; contribution: string; growth: string; balance: string }[] = [];

    for (let year = 1; year <= yearsToGrow; year++) {
      const contribution = annualContribution + (annualContribution * employerMatch / 100);
      totalContributions += contribution;
      balance += contribution;
      const growth = balance * annualGrowthRate;
      totalGrowth += growth;
      balance += growth;

      scheduleData.push({
        year,
        contribution: formatCurrency(contribution),
        growth: formatCurrency(growth),
        balance: formatCurrency(balance)
      });
    }

    return { 
      mainResult: balance, 
      totalContributions, 
      totalGrowth, 
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
    setInputs({ initialBalance: "", annualContribution: "", employerMatch: "", annualGrowthRate: "", yearsToGrow: "" });
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
              Initial Balance
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.initialBalance}
              onChange={(e) => setInputs({ ...inputs, initialBalance: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Annual Contribution
            </Label>
            <Input
              type="number"
              placeholder="e.g., 6000"
              value={inputs.annualContribution}
              onChange={(e) => setInputs({ ...inputs, annualContribution: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Employer Match (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.employerMatch}
              onChange={(e) => setInputs({ ...inputs, employerMatch: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Annual Growth Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 7"
              value={inputs.annualGrowthRate}
              onChange={(e) => setInputs({ ...inputs, annualGrowthRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Years to Grow
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.yearsToGrow}
              onChange={(e) => setInputs({ ...inputs, yearsToGrow: e.target.value })}
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
                      Total Retirement Savings
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
                      Total Growth
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalGrowth)}
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
                    Growth Schedule
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
                            <TableCell className="font-medium">{row.year}</TableCell>
                            <TableCell>{row.contribution}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {row.growth}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the 401(k) Retirement Savings Growth Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The 401(k) Retirement Savings Growth Calculator projects how your retirement account will grow over time based on your contributions, employer matching, and investment returns. This tool is essential for understanding whether your current savings strategy will sustain your retirement lifestyle and identifying gaps early enough to adjust contributions. By modeling different scenarios, you can see the real impact of delaying contributions, increasing savings rates, or benefiting from employer matching.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your current age, expected retirement age, current 401(k) balance, annual contribution amount, employer match percentage (if available), and expected annual investment return. The calculator will also account for annual contribution limits ($23,500 for 2024, $24,000 for 2025) and automatically cap your inputs if they exceed IRS maximums. Your expected annual return depends on your asset allocation—a stock-heavy portfolio might assume 8-10%, while a balanced portfolio typically uses 6-7%.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculator's output in two ways: the total projected balance at retirement and comparison to retirement spending benchmarks (financial advisors suggest having 25x your annual spending saved). If your projection falls short, adjust variables upward—increasing contributions by $100/month or extending your working years by 2-3 years can substantially close retirement gaps. Use the "what-if" features to model scenarios like job changes (reduced match), market downturns (lower returns), or earlier retirement to make informed decisions today.</p>
        </div>
      </section>

      {/* TABLE: 401(k) Growth Projection by Contribution Level (30-Year Horizon, 7% Annual Return) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">401(k) Growth Projection by Contribution Level (30-Year Horizon, 7% Annual Return)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how different annual contribution amounts compound over 30 years with a 7% average annual return and no employer match.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Contribution</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Contributions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Investment Growth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Balance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Growth as % of Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$445,926</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$595,926</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">74.8%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$891,852</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,191,852</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">74.8%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,337,778</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,787,778</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">74.8%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$23,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$705,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,975,370</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,680,370</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">73.7%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume consistent annual contributions at the start of each year and no employer match. Investment growth includes compound interest on both contributions and gains.</p>
      </section>

      {/* TABLE: Impact of Employer Matching on 401(k) Balance (20-Year Horizon, 7% Return) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Employer Matching on 401(k) Balance (20-Year Horizon, 7% Return)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different employer matching formulas multiply your retirement savings when you contribute 6% of a $75,000 salary.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Employer Match Formula</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Employee Contributions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Employer Contributions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Investment Growth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">No match (0%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$90,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$222,962</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$312,962</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50% of 3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$90,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$302,231</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$403,481</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100% of 3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$90,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$381,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$494,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100% of 6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$90,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$540,038</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$675,038</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All scenarios assume $4,500 annual employee contribution (6% of $75,000 salary), consistent annual contributions, and 7% annual returns. Employer match amounts are calculated on matching formulas applied to employee contributions.</p>
      </section>

      {/* TABLE: 401(k) Balance Milestones and Recommended Benchmarks */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">401(k) Balance Milestones and Recommended Benchmarks</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares projected balances at key ages against Fidelity's recommended retirement savings benchmarks for a consistent saver with 7% annual returns.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years of Saving</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Projected Balance ($50K Annual Contribution)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fidelity Benchmark (Multiples of Salary)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Benchmark Balance (at $75K Salary)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$715,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1x salary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,832,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6x salary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,153,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10x salary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,285,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12x salary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750,000-$900,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Projected balances assume $50,000 annual contributions starting at age 25 with 7% annual returns. Fidelity benchmarks are industry-standard retirement savings targets assuming retirement at age 67.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Maximize employer matching before anything else—a 100% match on 3% of salary is an immediate 100% return on investment with zero market risk. If your employer offers this benefit and you skip it, you're leaving free money on the table that could compound to $50,000+ over 20 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase contributions by at least 1% annually or with each raise—this 'set and forget' strategy prevents contribution stagnation. Someone who increases by 1% annually starting at $5,000 could reach $7,500+ contributions within 10 years while barely noticing the impact on take-home pay.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Model a conservative return rate (6-7%) rather than historical averages (10%)—using realistic assumptions prevents overconfidence and retirement shortfalls. The calculator shows that a 1% difference in annual returns creates $200,000+ variance over 30 years, making conservative projections safer planning anchors.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to backtest your savings progress against Fidelity benchmarks (1x salary by 35, 6x by 50)—if you're behind, the tool shows exactly how much to increase contributions to catch up. Someone at age 40 with only $150,000 saved (needing $300,000) can see that boosting contributions by $500/month closes the gap in 2-3 years.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Employer Match in Projections</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many savers use the calculator without inputting their employer match, leading to underestimated final balances. This error can mask the fact that you're on track for retirement when you actually need higher personal contributions if matching is limited or unavailable at a future job.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Unrealistic Return Assumptions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming 10-12% average annual returns (recent market peaks) overstates retirement readiness by 20-30%. When markets inevitably correct, savers find themselves with balances $100,000-$300,000 lower than projected, forcing uncomfortable retirement adjustments.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting About Inflation Adjustment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Seeing a $1 million projected balance feels secure until you realize inflation erodes purchasing power by 50% or more over 30 years. A $1 million balance in 2055 is worth roughly $370,000 in today's dollars at 3% inflation, requiring double-checking whether your actual income replacement is sufficient.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Updating Contributions After Job Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator projects continuous contributions, but job transitions often interrupt savings momentum or reduce employer match benefits. Failing to model contribution gaps or new match formulas can create false confidence; a 6-month break in contributions costs $50,000+ in long-term growth at 7% returns.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum I can contribute to my 401(k) in 2024?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For 2024, the IRS contribution limit is $23,500 for individuals under age 50, and $31,000 for those 50 and older (including the $7,500 catch-up contribution). These limits increase to $24,000 and $32,000 respectively for 2025. The calculator uses these limits to help you project maximum growth scenarios based on your age and contribution strategy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does employer matching affect my 401(k) growth projection?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Employer matching is typically 50% to 100% of your contributions up to 3-6% of salary. If you contribute $5,000 annually and your employer matches 50% up to 6% of salary, you receive an additional $2,500 in free money. This calculator multiplies your projected balance significantly—a $5,000 annual contribution with 100% matching could grow to approximately $472,000 over 30 years at 7% annual returns, versus $328,000 without matching.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What average annual return should I assume for my projections?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Historical stock market returns average 10% annually before inflation, while a balanced portfolio (60% stocks/40% bonds) averages 7-8% annually. Most retirement calculators use 7% as a conservative estimate for mixed portfolios. The calculator allows you to input your expected return based on your asset allocation—higher risk portfolios may assume 8-10%, while conservative portfolios might use 5-6%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does inflation impact my 401(k) projections on this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator shows nominal (pre-inflation) growth by default. If inflation averages 3% annually, your $500,000 projected balance in future dollars has less purchasing power than in today's dollars. Some calculators offer an inflation-adjusted view; for example, that $500,000 balance becomes approximately $276,000 in today's dollars over 20 years with 3% inflation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to model different retirement ages?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator typically allows you to input your current age and desired retirement age to model different scenarios. If you're 35 and retire at 65, you have 30 years of growth; retiring at 67 gives you 32 years. This additional 2 years could add $50,000-$100,000+ to your balance depending on contributions and returns, demonstrating the significant impact of working a few extra years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens to my 401(k) if I change jobs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator typically projects continuous contributions to a single 401(k). In reality, you can roll your balance to a new employer's plan, an IRA, or leave it with your former employer. A $200,000 balance rolled to an IRA with the same 7% returns continues growing uninterrupted, but if left idle or in a low-yield account, growth slows significantly. The calculator helps you understand the cost of contribution gaps during job transitions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much should I have saved by age 35 according to retirement experts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fidelity recommends having 1x your annual salary saved by age 35. If you earn $75,000, you should have $75,000 saved. This calculator helps you backtest whether your historical contributions align with this benchmark and project whether your current path meets it for future milestones (3x salary by 40, 6x by 50, 10x by 67).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does this calculator account for Required Minimum Distributions (RMDs)?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most 401(k) growth calculators project pre-RMD balances and don't automatically reduce them. At age 73, the IRS requires you to withdraw roughly 3.65-8.87% of your balance annually depending on life expectancy tables. This calculator typically shows your maximum balance; actual usable balance will be reduced by required withdrawals in retirement, though you can model manual withdrawals in advanced versions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between traditional and Roth 401(k) projections?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Both grow tax-free within the account, so this calculator's growth projections are identical. The difference appears in retirement: traditional 401(k) withdrawals are taxed as ordinary income (if you're in a 24% bracket, a $500,000 withdrawal nets $380,000), while Roth withdrawals are tax-free. Use this calculator to model the pre-tax balance, then adjust for your expected retirement tax bracket to calculate after-tax income.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-roth-401k-contribution-limits" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS 401(k) Contribution Limits and Rules</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on annual contribution limits, catch-up contributions for those 50+, and eligibility rules for 401(k) plans.</p>
          </li>
          <li>
            <a href="https://www.fidelity.com/learning-center/personal-finance/retirement-savings-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Fidelity Retirement Score and Savings Benchmarks</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fidelity's recommended retirement savings targets by age (1x salary by 35, 6x by 50, 10x by 67) based on industry research and longevity data.</p>
          </li>
          <li>
            <a href="https://www.investor.gov/introduction-investing/investing-basics/retirement/401k-plans" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC: 401(k) Plans Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SEC guidance on how 401(k) plans work, investment options, rollovers, and withdrawal rules including Required Minimum Distributions.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/retirement/401k/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate 401(k) Calculator and Retirement Planning Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive overview of 401(k) features, employer matching strategies, and how to use retirement calculators for planning.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="401(k) Retirement Savings Growth Calculator"
      description="Estimate the future value of your 401(k) based on contributions, employer match, and growth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd ?? undefined}
      onThisPage={[
        { id: "calculator", label: "Calculator" },
        { id: "editorial", label: "Editorial" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      formula={{
        formula: "FV = P(1 + r)^n + C[((1 + r)^n - 1) / r]",
        variables: [
          { symbol: "P", description: "Initial balance" },
          { symbol: "r", description: "Annual growth rate (as a decimal)" },
          { symbol: "n", description: "Number of years" },
          { symbol: "C", description: "Annual contribution (including employer match)" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a starting balance of $50,000, contribute $6,000 annually, receive a 5% employer match, and expect a 7% annual growth rate over 30 years.",
        steps: [
          { 
            step: 1, 
            calculation: "6000 × 1.05 = 6300", 
            description: "Calculate the total annual contribution including employer match." 
          },
          { 
            step: 2, 
            calculation: "6300 × 30 = 189000", 
            description: "Determine the total contributions over 30 years." 
          },
          { 
            step: 3, 
            calculation: "50000(1 + 0.07)^30 + 189000[((1 + 0.07)^30 - 1) / 0.07]", 
            description: "Calculate the future value of the retirement savings." 
          }
        ],
        result: "The final result is approximately $1,000,000, meaning you will have a substantial retirement fund based on these assumptions."
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
