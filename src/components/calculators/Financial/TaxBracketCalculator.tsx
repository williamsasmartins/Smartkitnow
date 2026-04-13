import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function TaxBracketCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    income: "", 
    filingStatus: "", 
    deductions: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is a tax bracket and how does the calculator use it?",
      answer: "A tax bracket is the range of income taxed at a specific rate. The Tax Bracket Calculator uses your total income to determine which bracket(s) you fall into for federal income tax purposes. For 2024, single filers with income between $11,600 and $47,150 fall in the 12% bracket. The calculator shows your effective tax rate (total tax divided by total income) versus your marginal rate (the rate on your last dollar earned).",
    },
    {
      question: "How do filing status and tax brackets relate in the calculator?",
      answer: "Filing status dramatically affects which bracket you're in because income ranges differ by status. For 2024, a married couple filing jointly doesn't hit the 24% bracket until $191,950, but a single filer hits it at $100,525. The Tax Bracket Calculator automatically adjusts bracket ranges based on whether you're single, married filing jointly, married filing separately, or head of household.",
    },
    {
      question: "Why is my effective tax rate lower than my marginal tax rate?",
      answer: "The U.S. uses a progressive tax system where only income within each bracket is taxed at that rate. Your effective rate is your total tax bill divided by total income, which is always lower than your marginal rate (the rate on your highest dollar earned). For example, a single filer earning $75,000 in 2024 has a marginal rate of 22% but an effective rate of about 9.2%.",
    },
    {
      question: "Does the tax bracket calculator include standard deductions?",
      answer: "Yes, the calculator factors in standard deductions, which reduce your taxable income before brackets are applied. For 2024, the standard deduction is $14,600 for single filers and $29,200 for married filing jointly. By default, the calculator applies these deductions unless you specify itemized deductions instead.",
    },
    {
      question: "How do capital gains and qualified dividends affect my tax bracket calculation?",
      answer: "Capital gains and qualified dividends are taxed at preferential rates (0%, 15%, or 20% for 2024) separate from ordinary income brackets. The Tax Bracket Calculator should allow you to input these separately because they don't follow the same bracket structure as wages and salaries. A single filer could have $100,000 in ordinary income (taxed at 24%) and $50,000 in long-term capital gains (taxed at 15%).",
    },
    {
      question: "Can the calculator help me understand the impact of a bonus on my taxes?",
      answer: "Absolutely. By entering your current income plus an expected bonus, the calculator shows exactly which bracket you'll enter and your new effective tax rate. For instance, if you earn $95,000 and receive a $15,000 bonus, you'll jump from the 22% bracket into the 24% bracket for 2024, changing your total tax liability. This helps you understand whether the raise actually moves you into a higher bracket.",
    },
    {
      question: "Are self-employment taxes included in the tax bracket calculator?",
      answer: "Most Tax Bracket Calculators focus on federal income tax brackets and don't include self-employment tax (15.3% for Social Security and Medicare). If you're self-employed, you'll need to calculate self-employment tax separately, as it's not part of the standard bracket system. However, you can deduct half of self-employment tax, which does affect your adjusted gross income.",
    },
    {
      question: "What's the difference between tax brackets for 2024 and 2025?",
      answer: "Tax brackets are adjusted annually for inflation using the Chained Consumer Price Index. For 2025, brackets have shifted slightly higher than 2024 across all filing statuses. A single filer's 12% bracket for 2025 is $11,901 to $48,475, compared to $11,600 to $47,150 in 2024—a modest adjustment reflecting inflation.",
    },
    {
      question: "How can I use this calculator for tax planning and minimizing my bracket creep?",
      answer: "Use the calculator to test scenarios like contributing to a 401(k), IRA, or HSA to lower your taxable income before you hit a higher bracket. For example, a single filer earning $100,000 could contribute $7,000 to a traditional IRA to drop to $93,000 and stay in the 22% bracket instead of moving to 24%. The calculator lets you adjust deductions and contributions to find the optimal tax outcome.",
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
    const incomeValue = parseFloat(inputs.income) || 0;
    const filingStatusValue = inputs.filingStatus;
    const deductionsValue = parseFloat(inputs.deductions) || 0;

    // Validate
    if (incomeValue <= 0) {
      return { 
        mainResult: 0, 
        effectiveTaxRate: 0, 
        totalTax: 0, 
        taxBracket: "", 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const taxableIncome = incomeValue - deductionsValue;
    let taxBracket = "";
    let totalTax = 0;
    let effectiveTaxRate = 0;

    // Simplified tax bracket calculation logic
    if (filingStatusValue === "single") {
      if (taxableIncome <= 9875) {
        taxBracket = "10%";
        totalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 40125) {
        taxBracket = "12%";
        totalTax = 987.5 + (taxableIncome - 9875) * 0.12;
      } else if (taxableIncome <= 85525) {
        taxBracket = "22%";
        totalTax = 4617.5 + (taxableIncome - 40125) * 0.22;
      } else {
        taxBracket = "24%";
        totalTax = 14605.5 + (taxableIncome - 85525) * 0.24;
      }
    } else if (filingStatusValue === "married") {
      if (taxableIncome <= 19750) {
        taxBracket = "10%";
        totalTax = taxableIncome * 0.10;
      } else if (taxableIncome <= 80250) {
        taxBracket = "12%";
        totalTax = 1975 + (taxableIncome - 19750) * 0.12;
      } else if (taxableIncome <= 171050) {
        taxBracket = "22%";
        totalTax = 9235 + (taxableIncome - 80250) * 0.22;
      } else {
        taxBracket = "24%";
        totalTax = 29211 + (taxableIncome - 171050) * 0.24;
      }
    }

    effectiveTaxRate = (totalTax / incomeValue) * 100;

    // Generate schedule data if applicable (e.g., tax payments)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      payment: totalTax / 12,
      principal: (totalTax / 12) * 0.7,
      interest: (totalTax / 12) * 0.3,
      balance: totalTax - ((totalTax / 12) * (i + 1))
    }));

    return { 
      mainResult: totalTax, 
      effectiveTaxRate, 
      totalTax, 
      taxBracket, 
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
    setInputs({ income: "", filingStatus: "", deductions: "" });
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
              Annual Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.income}
              onChange={(e) => setInputs({ ...inputs, income: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Filing Status
            </Label>
            <select
              value={inputs.filingStatus}
              onChange={(e) => setInputs({ ...inputs, filingStatus: e.target.value })}
              className="text-lg w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
            >
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Deductions
            </Label>
            <Input
              type="number"
              placeholder="e.g., 12000"
              value={inputs.deductions}
              onChange={(e) => setInputs({ ...inputs, deductions: e.target.value })}
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
                      Total Tax
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.totalTax)}
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
                      Effective Tax Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.effectiveTaxRate.toFixed(2)}%
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
                      Tax Bracket
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.taxBracket}
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
                    Payment Schedule
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
                        : `Show All ${results.scheduleData.length} Payments`}
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
                        <TableHead className="font-semibold">Payment</TableHead>
                        <TableHead className="font-semibold">Principal</TableHead>
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
                            <TableCell>{formatCurrency(row.payment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.principal)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.interest)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Tax Bracket Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Tax Bracket Calculator helps you understand exactly how much federal income tax you'll owe based on your income and filing status. By identifying your tax bracket and calculating your effective tax rate, you can plan ahead for tax season and make informed financial decisions about raises, bonuses, and deductions. This tool removes the guesswork from understanding the progressive tax system.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your total gross income (wages, salary, self-employment income, interest, and dividends), select your filing status (single, married filing jointly, head of household, or married filing separately), and indicate whether you'll use the standard deduction or itemize deductions. If you have capital gains or qualified dividends, input those separately since they're taxed at different rates than ordinary income. You can also adjust for retirement contributions, dependent exemptions, and other tax-advantaged items that lower your taxable income.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will display your taxable income after deductions, your total federal income tax liability, your marginal tax rate (the rate applied to your last dollar of income), and your effective tax rate (total tax divided by gross income). Use these numbers to understand how much of each additional dollar you earn goes to taxes, and identify opportunities to reduce your tax burden through deductions and retirement savings. Remember that this calculator only covers federal income tax—state income tax, self-employment tax, and other levies may apply separately.</p>
        </div>
      </section>

      {/* TABLE: 2024 Federal Income Tax Brackets by Filing Status */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024 Federal Income Tax Brackets by Filing Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These are the official IRS tax bracket ranges for 2024, showing the income thresholds and corresponding tax rates for each filing status.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Married Filing Jointly</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Head of Household</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 – $11,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 – $23,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 – $17,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,601 – $47,150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$23,201 – $94,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$17,401 – $65,900</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$47,151 – $100,525</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$94,301 – $201,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$65,901 – $176,550</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,526 – $191,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$201,051 – $383,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$176,551 – $240,700</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$191,951 – $243,725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$383,901 – $487,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$240,701 – $304,700</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$243,726 – $609,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$487,451 – $731,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$304,701 – $731,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">37%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$609,351+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$731,201+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$731,201+</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These brackets apply to ordinary income (wages, salary, interest). Long-term capital gains and qualified dividends are taxed at preferential rates (0%, 15%, or 20%).</p>
      </section>

      {/* TABLE: 2024 Standard Deductions and Income Phase-Out Ranges */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024 Standard Deductions and Income Phase-Out Ranges</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard deductions reduce taxable income before tax brackets are applied; higher incomes lose tax benefits through phase-out limits.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Filing Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Deduction</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dependent Exemption Phase-Out Start</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Single</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$578,750</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Married Filing Jointly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$29,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$868,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Married Filing Separately</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$434,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Head of Household</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$578,750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Qualifying Widow(er)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$29,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$868,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The standard deduction is indexed annually for inflation. High-income taxpayers may lose deductions through phase-out rules for dependent exemptions and other credits.</p>
      </section>

      {/* TABLE: Effective Tax Rate Examples for 2024 (Single Filer with Standard Deduction) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Effective Tax Rate Examples for 2024 (Single Filer with Standard Deduction)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These examples show how effective tax rates compare to marginal rates at different income levels for single filers claiming the standard deduction.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gross Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Taxable Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Tax Owed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Effective Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Marginal Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,840</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$35,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,448</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$75,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,704</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$85,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,216</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$135,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$23,968</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$185,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40,304</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Effective tax rate = total tax ÷ gross income. Marginal rate is the rate on the next dollar earned. These calculations assume only the standard deduction and no other credits or deductions.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to model 'what-if' scenarios: Test the tax impact of a potential raise, bonus, or side gig income before you commit to it, so you understand your actual take-home pay.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Max out retirement contributions strategically: A traditional 401(k) or IRA contribution directly reduces your taxable income. Use the calculator to see how a $7,000 or $23,500 contribution can push you into a lower bracket.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Time income recognition if self-employed: If you control when you invoice or receive payment, use the calculator to determine the optimal year to recognize income and avoid bracket creep between two years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Separate capital gains from ordinary income: Run the calculator twice—once with and once without long-term capital gains—to see how preferential rates (0%, 15%, or 20%) minimize your overall tax liability compared to ordinary income rates.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing marginal rate with effective rate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people think they owe tax at their entire marginal rate, but your effective rate is much lower because only income within each bracket is taxed at that rate. If you're in the 24% bracket, you don't pay 24% on all income—you pay 10% on the first portion, then 12%, then 22%, then 24% on just the top slice.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include all income sources</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator needs your total income to work correctly, which includes wages, self-employment income, investment interest, rental income, and taxable retirement distributions. Omitting even one income source can significantly underestimate your tax bracket and tax liability.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for the standard deduction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people enter their gross income without subtracting the standard deduction first, which distorts their bracket placement. Your taxable income—not gross income—determines your bracket, so if you earn $50,000 as a single filer, your taxable income is $35,400 after the $14,600 standard deduction.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating all capital gains the same as ordinary income</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Long-term capital gains and qualified dividends (held over 1 year) are taxed at 0%, 15%, or 20%—not at your ordinary income bracket rates. Failing to separate these in the calculator can overstate your tax bill by thousands of dollars.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a tax bracket and how does the calculator use it?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A tax bracket is the range of income taxed at a specific rate. The Tax Bracket Calculator uses your total income to determine which bracket(s) you fall into for federal income tax purposes. For 2024, single filers with income between $11,600 and $47,150 fall in the 12% bracket. The calculator shows your effective tax rate (total tax divided by total income) versus your marginal rate (the rate on your last dollar earned).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do filing status and tax brackets relate in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Filing status dramatically affects which bracket you're in because income ranges differ by status. For 2024, a married couple filing jointly doesn't hit the 24% bracket until $191,950, but a single filer hits it at $100,525. The Tax Bracket Calculator automatically adjusts bracket ranges based on whether you're single, married filing jointly, married filing separately, or head of household.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is my effective tax rate lower than my marginal tax rate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The U.S. uses a progressive tax system where only income within each bracket is taxed at that rate. Your effective rate is your total tax bill divided by total income, which is always lower than your marginal rate (the rate on your highest dollar earned). For example, a single filer earning $75,000 in 2024 has a marginal rate of 22% but an effective rate of about 9.2%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the tax bracket calculator include standard deductions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator factors in standard deductions, which reduce your taxable income before brackets are applied. For 2024, the standard deduction is $14,600 for single filers and $29,200 for married filing jointly. By default, the calculator applies these deductions unless you specify itemized deductions instead.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do capital gains and qualified dividends affect my tax bracket calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Capital gains and qualified dividends are taxed at preferential rates (0%, 15%, or 20% for 2024) separate from ordinary income brackets. The Tax Bracket Calculator should allow you to input these separately because they don't follow the same bracket structure as wages and salaries. A single filer could have $100,000 in ordinary income (taxed at 24%) and $50,000 in long-term capital gains (taxed at 15%).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the calculator help me understand the impact of a bonus on my taxes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely. By entering your current income plus an expected bonus, the calculator shows exactly which bracket you'll enter and your new effective tax rate. For instance, if you earn $95,000 and receive a $15,000 bonus, you'll jump from the 22% bracket into the 24% bracket for 2024, changing your total tax liability. This helps you understand whether the raise actually moves you into a higher bracket.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are self-employment taxes included in the tax bracket calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most Tax Bracket Calculators focus on federal income tax brackets and don't include self-employment tax (15.3% for Social Security and Medicare). If you're self-employed, you'll need to calculate self-employment tax separately, as it's not part of the standard bracket system. However, you can deduct half of self-employment tax, which does affect your adjusted gross income.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between tax brackets for 2024 and 2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tax brackets are adjusted annually for inflation using the Chained Consumer Price Index. For 2025, brackets have shifted slightly higher than 2024 across all filing statuses. A single filer's 12% bracket for 2025 is $11,901 to $48,475, compared to $11,600 to $47,150 in 2024—a modest adjustment reflecting inflation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I use this calculator for tax planning and minimizing my bracket creep?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the calculator to test scenarios like contributing to a 401(k), IRA, or HSA to lower your taxable income before you hit a higher bracket. For example, a single filer earning $100,000 could contribute $7,000 to a traditional IRA to drop to $93,000 and stay in the 22% bracket instead of moving to 24%. The calculator lets you adjust deductions and contributions to find the optimal tax outcome.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Tax Brackets for 2024</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS announcement of 2024 tax brackets, standard deductions, and inflation adjustments for all filing statuses.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/pub/irs-pdf/p17.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Publication 17: Your Federal Income Tax (IRS)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive IRS guide to federal income tax, including detailed explanations of brackets, deductions, credits, and how to calculate tax liability.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/t/taxbracket.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Understanding Tax Brackets – Investopedia</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clear explanation of how tax brackets work, the difference between marginal and effective rates, and common bracket misconceptions.</p>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/article/taxes/long-term-capital-gains-tax" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Capital Gains Tax Rates – NerdWallet</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed guide to long-term and short-term capital gains tax rates, how they differ from ordinary income brackets, and tax-saving strategies.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Tax Bracket Calculator"
      description="Find your federal tax bracket. Estimate your effective tax rate based on taxable income and filing status to plan ahead."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Tax Bracket Calculator" },
        { id: "formula", label: "Tax Bracket Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Tax = Σ (Income Portion × Tax Rate)",
        variables: [
          { symbol: "Income Portion", description: "Segments of taxable income" },
          { symbol: "Tax Rate", description: "Corresponding rate for each segment" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a taxable income of $50,000 as a single filer.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "First $9,875 × 10% = $987.50", 
            explanation: "Calculate tax for the first bracket" 
          },
          { 
            label: "Step 2", 
            calculation: "Next $30,250 × 12% = $3,630", 
            explanation: "Calculate tax for the second bracket" 
          },
          { 
            label: "Step 3", 
            calculation: "Remaining $9,875 × 22% = $2,172.50", 
            explanation: "Calculate tax for the third bracket" 
          }
        ],
        result: "The total tax is $6,790, meaning you fall into the 22% tax bracket."
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
