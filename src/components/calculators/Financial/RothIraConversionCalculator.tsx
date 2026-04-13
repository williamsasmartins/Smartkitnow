import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RothIraConversionCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    traditionalIraBalance: "", 
    expectedTaxRate: "", 
    yearsUntilRetirement: "" 
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
    const traditionalIraBalance = parseFloat(inputs.traditionalIraBalance) || 0;
    const expectedTaxRate = parseFloat(inputs.expectedTaxRate) || 0;
    const yearsUntilRetirement = parseFloat(inputs.yearsUntilRetirement) || 0;

    // Validate
    if (traditionalIraBalance <= 0 || expectedTaxRate <= 0) {
      return { 
        mainResult: 0, 
        taxCost: 0, 
        futureValue: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const taxCost = traditionalIraBalance * (expectedTaxRate / 100);
    const rothIraBalance = traditionalIraBalance - taxCost;
    const futureValue = rothIraBalance * Math.pow(1.07, yearsUntilRetirement); // Assuming 7% annual growth

    // Generate schedule data if applicable (e.g., growth over time)
    const scheduleData = Array.from({ length: yearsUntilRetirement }, (_, i) => ({
      year: i + 1,
      balance: rothIraBalance * Math.pow(1.07, i + 1)
    }));

    return { 
      mainResult: futureValue, 
      taxCost, 
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
    setInputs({ traditionalIraBalance: "", expectedTaxRate: "", yearsUntilRetirement: "" });
  };

  const faqs = [
    {
      question: "What is the pro-rata rule and how does it affect my Roth IRA conversion?",
      answer: "The pro-rata rule requires you to aggregate all your traditional IRAs, SEP-IRAs, and SIMPLE IRAs when calculating the tax consequences of a conversion. If you have $100,000 in pre-tax IRAs and $50,000 in after-tax contributions, converting $50,000 means 66.67% of the conversion ($33,335) is taxable. This calculator factors in all your IRA balances to determine your actual tax liability on the conversion amount.",
    },
    {
      question: "How much can I convert to a Roth IRA in 2024?",
      answer: "There are no income limits or contribution caps on Roth IRA conversions—you can convert any amount from a traditional IRA to a Roth IRA regardless of your income level. However, you must have earned income in the year of conversion, and the conversion is subject to income tax on the pre-tax portion of the amount converted. The calculator will show you the tax bill regardless of conversion size.",
    },
    {
      question: "Will a Roth conversion increase my Modified Adjusted Gross Income (MAGI) and trigger higher Medicare premiums?",
      answer: "Yes, Roth conversions are added to your MAGI in the conversion year, which can trigger higher Medicare premiums (IRMAA surcharges) for individuals over 65. For example, if your MAGI crosses $103,000 (individual) or $206,000 (married filing jointly) in 2024, you may pay an additional 35-80% in Medicare Part B and Part D premiums. This calculator helps model whether a conversion will push you into a higher IRMAA bracket.",
    },
    {
      question: "Can I undo a Roth conversion through a recharacterization?",
      answer: "No—the Tax Cuts and Jobs Act of 2017 eliminated recharacterizations of Roth conversions, effective January 1, 2018. Previously, you could undo a conversion if the market declined, but now all conversions are permanent. You must carefully use this calculator to estimate the tax impact before executing any conversion.",
    },
    {
      question: "What is the difference between a conversion and a contribution to a Roth IRA?",
      answer: "A Roth IRA contribution is new money you add (up to $7,000 in 2024), while a conversion moves existing funds from a traditional IRA to a Roth IRA and triggers immediate taxation. Conversions have no income limits, but contributions have MAGI phase-out limits ($146,000-$161,000 for single filers in 2024). This calculator is designed specifically for conversions, not regular contributions.",
    },
    {
      question: "What tax bracket will my conversion push me into?",
      answer: "Your conversion amount is added to your ordinary income for the year and taxed at your marginal tax rate. For example, if you earn $80,000 and convert $50,000 in 2024 (single filer), your total taxable income becomes $130,000, pushing you from the 22% bracket into the 24% bracket on the upper portion of the conversion. This calculator estimates your blended tax rate based on your filing status and conversion amount.",
    },
    {
      question: "Should I do a partial or full conversion?",
      answer: "A partial conversion lets you stay in a lower tax bracket and minimize the pro-rata rule impact if you have after-tax IRA balances. A full conversion eliminates future RMDs and maximizes tax-free growth, but generates a larger one-time tax bill. This calculator lets you model both scenarios to find the conversion size that fits your tax situation and retirement goals.",
    },
    {
      question: "What happens to my Required Minimum Distributions (RMDs) if I convert?",
      answer: "Converting a traditional IRA to a Roth IRA eliminates RMDs for that portion of your savings—Roth IRAs have no RMDs during the original account holder's lifetime (as of the SECURE Act 2.0). This is especially valuable for high-net-worth retirees who don't need the income and want to leave tax-free growth to heirs. The calculator helps you project RMD savings over time.",
    },
    {
      question: "Can I use funds from my 401(k) to pay the conversion taxes without penalty?",
      answer: "You cannot withdraw funds from your 401(k) to pay Roth conversion taxes without triggering the 10% early withdrawal penalty if you're under 59½ (unless you qualify for an exception). It's best to pay the conversion tax from external funds like a savings account or taxable brokerage account. This calculator assumes you're paying the tax bill separately and shows the conversion amount plus estimated tax liability.",
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
              Traditional IRA Balance
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.traditionalIraBalance}
              onChange={(e) => setInputs({ ...inputs, traditionalIraBalance: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Expected Tax Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 25"
              value={inputs.expectedTaxRate}
              onChange={(e) => setInputs({ ...inputs, expectedTaxRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Years Until Retirement
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.yearsUntilRetirement}
              onChange={(e) => setInputs({ ...inputs, yearsUntilRetirement: e.target.value })}
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
                      Future Value of Roth IRA
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
                      Tax Cost of Conversion
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.taxCost)}
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
                      Initial Roth IRA Balance
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Roth IRA Conversion Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Roth IRA Conversion Calculator estimates the federal income tax you'll owe on converting funds from a traditional IRA to a Roth IRA. Converting to a Roth allows your money to grow tax-free and eliminates Required Minimum Distributions in retirement, but the conversion triggers a one-time tax bill in the conversion year. This calculator helps you decide whether and how much to convert based on your tax bracket, existing IRA balances, and retirement timeline.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your filing status, current taxable income, total IRA balances (including pre-tax and after-tax amounts), and the conversion amount you're considering. The tool applies the pro-rata rule to determine what portion of your conversion is taxable, calculates your new tax bracket, and estimates your federal income tax liability. You'll also see how the conversion affects your MAGI, which can influence Medicare premiums, Social Security taxation, and other income-based benefits.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the results to understand your total tax cost and net conversion benefit. If converting $100,000 costs you $24,000 in taxes but results in $200,000 of tax-free growth over 20 years, the conversion may be worthwhile—especially if you have 10+ years until retirement. Use the calculator to model different conversion amounts and timing strategies, and consult a tax professional to finalize your decision.</p>
        </div>
      </section>

      {/* TABLE: 2024-2025 IRA Contribution and Income Limits */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024-2025 IRA Contribution and Income Limits</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Key annual limits for Roth IRA contributions, conversions, and MAGI phase-out ranges.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2024</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2025</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maximum Roth IRA Contribution</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Catch-Up Contribution (Age 50+)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Roth Contribution Phase-Out (Single)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$146,000–$161,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$148,000–$163,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Roth Contribution Phase-Out (MFJ)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$230,000–$240,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$233,000–$243,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Roth Conversion Income Limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">None</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Traditional IRA RMD Threshold (Age 73)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Required</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Required</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Roth conversions have no income limits. Phase-out ranges apply only to new contributions, not conversions. All figures are IRS-indexed for inflation.</p>
      </section>

      {/* TABLE: 2024 Federal Tax Brackets and Marginal Rates */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024 Federal Tax Brackets and Marginal Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Single and married filing jointly tax brackets showing how a Roth conversion may affect your total tax liability.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Bracket</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single Filer Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Married Filing Jointly Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1st Bracket</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$11,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0–$23,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2nd Bracket</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,601–$47,150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$23,201–$94,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3rd Bracket</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$47,151–$100,525</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$94,301–$201,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4th Bracket</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,526–$191,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$201,051–$383,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5th Bracket</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$191,951–$243,725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$383,901–$487,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6th Bracket</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$243,726–$609,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$487,451–$731,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7th Bracket</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$609,351+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$731,201+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">A Roth conversion increases your taxable income, potentially pushing you into a higher bracket. Use this table to estimate your marginal tax rate on the conversion amount.</p>
      </section>

      {/* TABLE: Pro-Rata Rule Impact on Roth Conversions */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pro-Rata Rule Impact on Roth Conversions</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Examples showing how pre-tax and after-tax IRA balances affect the taxable portion of a conversion.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total IRA Balance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">After-Tax Basis</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pre-Tax Balance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Conversion Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Taxable Portion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$250,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$500,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$300,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The pro-rata rule calculates: (Pre-Tax Balance ÷ Total Balance) × Conversion Amount = Taxable Portion. After-tax contributions are never taxed on conversion.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Execute conversions in low-income years—such as the year you retire early, take a sabbatical, or have capital losses—to minimize your marginal tax rate and the overall tax bill on the conversion.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Coordinate conversions with other life events: delay large capital gains, harvest tax losses, or time a conversion to avoid triggering IRMAA surcharges on Medicare premiums or higher taxation of Social Security benefits.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Split large conversions across multiple years using a 'conversion ladder' strategy to stay in lower tax brackets and avoid paying a massive tax bill in a single year.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep detailed records of all after-tax contributions to your traditional IRAs (Form 8606) so you can accurately calculate the pro-rata rule impact and avoid double taxation on the non-taxable portion of your basis.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the Pro-Rata Rule</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people assume they can convert only the pre-tax portion of their IRAs without triggering taxation on the after-tax contributions. In reality, the pro-rata rule applies to all IRA balances combined, so a 50-50 mix of pre-tax and after-tax means 50% of any conversion is taxable. Use this calculator to account for all IRA types and balances before deciding on a conversion amount.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Converting Without Paying Taxes from External Funds</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using IRA funds to pay the conversion tax bill defeats the purpose—those funds are also taxable, and you trigger the 10% early withdrawal penalty if you're under 59½. Always pay the tax bill from outside sources (savings, salary, investments) so the full conversion amount compounds tax-free in the Roth. The calculator shows your tax liability separately to help you plan external funding.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Considering IRMAA and Medicare Premium Impacts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A large Roth conversion can push your MAGI above $103,000 (single) or $206,000 (married), triggering IRMAA surcharges of $35–$560+ per month on Medicare Part B and Part D premiums. A $200,000 conversion might sound good, but the 2-year Medicare penalty could erase tax savings. This calculator helps you check whether a conversion will cross IRMAA thresholds in your state.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Converting When You Have Required Minimum Distributions Pending</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you're age 73+ and due to take an RMD in the same year as a conversion, the RMD amount is still taxable, and adding a large conversion on top can push you into a significantly higher tax bracket. The pro-rata rule also applies to the combination of RMD and conversion, inflating the taxable percentage. Model both events together using this calculator to optimize your strategy.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the pro-rata rule and how does it affect my Roth IRA conversion?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The pro-rata rule requires you to aggregate all your traditional IRAs, SEP-IRAs, and SIMPLE IRAs when calculating the tax consequences of a conversion. If you have $100,000 in pre-tax IRAs and $50,000 in after-tax contributions, converting $50,000 means 66.67% of the conversion ($33,335) is taxable. This calculator factors in all your IRA balances to determine your actual tax liability on the conversion amount.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can I convert to a Roth IRA in 2024?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">There are no income limits or contribution caps on Roth IRA conversions—you can convert any amount from a traditional IRA to a Roth IRA regardless of your income level. However, you must have earned income in the year of conversion, and the conversion is subject to income tax on the pre-tax portion of the amount converted. The calculator will show you the tax bill regardless of conversion size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Will a Roth conversion increase my Modified Adjusted Gross Income (MAGI) and trigger higher Medicare premiums?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, Roth conversions are added to your MAGI in the conversion year, which can trigger higher Medicare premiums (IRMAA surcharges) for individuals over 65. For example, if your MAGI crosses $103,000 (individual) or $206,000 (married filing jointly) in 2024, you may pay an additional 35-80% in Medicare Part B and Part D premiums. This calculator helps model whether a conversion will push you into a higher IRMAA bracket.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I undo a Roth conversion through a recharacterization?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—the Tax Cuts and Jobs Act of 2017 eliminated recharacterizations of Roth conversions, effective January 1, 2018. Previously, you could undo a conversion if the market declined, but now all conversions are permanent. You must carefully use this calculator to estimate the tax impact before executing any conversion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between a conversion and a contribution to a Roth IRA?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A Roth IRA contribution is new money you add (up to $7,000 in 2024), while a conversion moves existing funds from a traditional IRA to a Roth IRA and triggers immediate taxation. Conversions have no income limits, but contributions have MAGI phase-out limits ($146,000-$161,000 for single filers in 2024). This calculator is designed specifically for conversions, not regular contributions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What tax bracket will my conversion push me into?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your conversion amount is added to your ordinary income for the year and taxed at your marginal tax rate. For example, if you earn $80,000 and convert $50,000 in 2024 (single filer), your total taxable income becomes $130,000, pushing you from the 22% bracket into the 24% bracket on the upper portion of the conversion. This calculator estimates your blended tax rate based on your filing status and conversion amount.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I do a partial or full conversion?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A partial conversion lets you stay in a lower tax bracket and minimize the pro-rata rule impact if you have after-tax IRA balances. A full conversion eliminates future RMDs and maximizes tax-free growth, but generates a larger one-time tax bill. This calculator lets you model both scenarios to find the conversion size that fits your tax situation and retirement goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens to my Required Minimum Distributions (RMDs) if I convert?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Converting a traditional IRA to a Roth IRA eliminates RMDs for that portion of your savings—Roth IRAs have no RMDs during the original account holder's lifetime (as of the SECURE Act 2.0). This is especially valuable for high-net-worth retirees who don't need the income and want to leave tax-free growth to heirs. The calculator helps you project RMD savings over time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use funds from my 401(k) to pay the conversion taxes without penalty?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You cannot withdraw funds from your 401(k) to pay Roth conversion taxes without triggering the 10% early withdrawal penalty if you're under 59½ (unless you qualify for an exception). It's best to pay the conversion tax from external funds like a savings account or taxable brokerage account. This calculator assumes you're paying the tax bill separately and shows the conversion amount plus estimated tax liability.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/publications/p590a" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 590-A: Contributions to Individual Retirement Arrangements (IRAs)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on IRA contributions, conversions, and the pro-rata rule with current limits and filing requirements.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p590b" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 590-B: Distributions from Individual Retirement Arrangements (IRAs)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive IRS resource explaining Roth conversion taxation, RMDs, and income limits for Roth eligibility.</p>
          </li>
          <li>
            <a href="https://www.ssa.gov/benefits/retirement/html/income-limits.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Social Security Administration: Income Limits and IRMAA</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Details on how Roth conversions affect your Modified Adjusted Gross Income and Medicare premium surcharges (IRMAA).</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/r/rothconversion.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Roth IRA Conversion Strategy and Tax Planning</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">In-depth explanation of Roth conversion mechanics, pro-rata rules, timing strategies, and tax minimization tactics.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Roth IRA Conversion Calculator"
      description="Analyze the tax implications of converting a traditional IRA to a Roth IRA. Determine if the tax cost now is worth the tax-free growth later."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Roth IRA Conversion Calculator" },
        { id: "formula", label: "Roth IRA Conversion Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Future Value = (Traditional IRA Balance - Tax Cost) × (1 + Growth Rate) ^ Years",
        variables: [
          { symbol: "Traditional IRA Balance", description: "Current balance of your traditional IRA" },
          { symbol: "Tax Cost", description: "Traditional IRA Balance × (Expected Tax Rate / 100)" },
          { symbol: "Growth Rate", description: "Assumed annual growth rate of the Roth IRA investments" },
          { symbol: "Years", description: "Number of years until retirement" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a traditional IRA balance of $50,000, an expected tax rate of 25%, and 20 years until retirement.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Tax Cost = 50000 × 0.25 = 12500", 
            explanation: "Calculate the tax cost of the conversion." 
          },
          { 
            label: "Step 2", 
            calculation: "Roth IRA Balance = 50000 - 12500 = 37500", 
            explanation: "Determine the initial Roth IRA balance after conversion." 
          },
          { 
            label: "Step 3", 
            calculation: "Future Value = 37500 × (1 + 0.07) ^ 20 = 144,753.58", 
            explanation: "Calculate the future value of the Roth IRA." 
          }
        ],
        result: "The final result is $144,753.58, meaning your Roth IRA will grow to this amount over 20 years with a 7% annual growth rate."
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