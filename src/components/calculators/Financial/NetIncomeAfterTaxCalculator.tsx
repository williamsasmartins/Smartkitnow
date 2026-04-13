import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function NetIncomeAfterTaxCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    grossIncome: "", 
    taxRate: "", 
    deductions: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is the difference between gross income and net income after tax?",
      answer: "Gross income is your total earnings before any deductions, while net income after tax is what remains after federal, state, and local taxes are subtracted. For example, if you earn $75,000 gross and owe $15,000 in taxes, your net income after tax is $60,000. This calculator helps you quickly determine that take-home figure based on your specific tax situation.",
    },
    {
      question: "How does the Net Income after Tax Calculator account for federal tax brackets in 2025?",
      answer: "The calculator applies the 2025 federal tax brackets, which include rates of 10%, 12%, 22%, 24%, 32%, 35%, and 37% depending on your income level and filing status. For single filers in 2025, the 22% bracket applies to income between $47,150 and $100,525. The calculator automatically applies the correct marginal and effective tax rates to your income.",
    },
    {
      question: "Should I include bonuses and overtime in my gross income for this calculator?",
      answer: "Yes, all forms of taxable income—including bonuses, overtime, freelance income, and investment gains—should be included in your gross income input. These earnings are subject to the same tax treatment as your regular salary, so including them ensures your net income calculation is accurate. Excluding bonuses or overtime will underestimate your actual tax liability.",
    },
    {
      question: "How do standard deductions affect the net income after tax calculation?",
      answer: "The standard deduction reduces your taxable income before taxes are calculated. For 2025, the standard deduction is $14,600 for single filers and $29,200 for married filing jointly. The calculator applies this deduction automatically, so if you earn $60,000 as a single filer, only $45,400 is subject to federal income tax, resulting in a higher net income after tax.",
    },
    {
      question: "Does this calculator include state and local income taxes?",
      answer: "Most Net Income after Tax Calculators allow you to input your state and local tax rates to provide a complete picture of your after-tax income. State income tax rates vary from 0% in states like Texas and Florida to 13.3% in California. If your calculator has this feature, entering your state rate ensures you see your true take-home pay.",
    },
    {
      question: "How does self-employment tax factor into net income after tax?",
      answer: "Self-employed individuals owe both income tax and self-employment tax (Social Security and Medicare), which totals 15.3% on net earnings. This calculator may account for self-employment tax if you select that option, significantly reducing net income compared to W-2 employees. For example, a self-employed person earning $80,000 gross might owe approximately $11,304 in self-employment and income taxes combined.",
    },
    {
      question: "Can I use this calculator to estimate my quarterly estimated tax payments?",
      answer: "Yes, you can use the net income after tax calculation to estimate your total annual tax liability, then divide by four to determine quarterly payments. However, self-employed individuals and high-income earners should also consider prior-year income, credits, and deductions when calculating estimated taxes. The IRS typically requires estimated tax payments when you expect to owe $1,000 or more in taxes.",
    },
    {
      question: "What tax credits should I factor into this calculator for a more accurate result?",
      answer: "Common tax credits that reduce your tax liability include the Earned Income Credit (up to $3,995 for 2025), Child Tax Credit ($2,000 per child), and Dependent Care Credit. These credits are applied after calculating your tax, dollar-for-dollar reducing what you owe. If your calculator has a credits section, entering eligible credits will increase your net income after tax.",
    },
    {
      question: "How does filing status (single vs. married) change the net income after tax calculation?",
      answer: "Filing status determines which tax brackets and standard deduction apply to your income. Married filing jointly has wider tax brackets and a higher standard deduction ($29,200 vs. $14,600 for single in 2025), typically resulting in lower taxes on the same household income. Using the correct filing status in this calculator is essential for an accurate net income estimate.",
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
    const grossIncomeValue = parseFloat(inputs.grossIncome) || 0;
    const taxRateValue = parseFloat(inputs.taxRate) || 0;
    const deductionsValue = parseFloat(inputs.deductions) || 0;

    // Validate
    if (grossIncomeValue <= 0 || taxRateValue < 0) {
      return { 
        netIncome: 0, 
        totalTax: 0, 
        incomeAfterDeductions: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const totalTax = grossIncomeValue * (taxRateValue / 100);
    const incomeAfterDeductions = grossIncomeValue - deductionsValue;
    const netIncome = incomeAfterDeductions - totalTax;

    // Generate schedule data if applicable (e.g., monthly breakdown)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      grossIncome: grossIncomeValue / 12,
      tax: totalTax / 12,
      netIncome: netIncome / 12,
      balance: incomeAfterDeductions - ((grossIncomeValue / 12) * (i + 1))
    }));

    return { 
      netIncome, 
      totalTax, 
      incomeAfterDeductions, 
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
    setInputs({ grossIncome: "", taxRate: "", deductions: "" });
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
              Gross Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.grossIncome}
              onChange={(e) => setInputs({ ...inputs, grossIncome: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Tax Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.taxRate}
              onChange={(e) => setInputs({ ...inputs, taxRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Deductions
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
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
      {results.netIncome > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Net Income
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.netIncome)}
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
                      Total Tax
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalTax)}
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
                      Income After Deductions
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.incomeAfterDeductions)}
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
                    Monthly Breakdown
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
                        <TableHead className="font-semibold">Gross Income</TableHead>
                        <TableHead className="font-semibold">Tax</TableHead>
                        <TableHead className="font-semibold">Net Income</TableHead>
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
                            <TableCell>{formatCurrency(row.grossIncome)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.tax)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.netIncome)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Net Income after Tax Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Net Income after Tax Calculator is a tool designed to determine how much money you'll actually take home after federal, state, and local taxes are deducted from your gross income. This is essential for budgeting, financial planning, and understanding your true earning power. Whether you're evaluating a job offer, planning for retirement, or simply want to understand your paycheck, this calculator provides a clear picture of your after-tax income.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, start by entering your gross annual income (salary, wages, bonuses, and self-employment earnings). Next, select your filing status (single, married filing jointly, head of household, etc.) and provide any applicable state or local tax rates. You can also add adjustments for tax credits, deductions beyond the standard deduction, and self-employment taxes if applicable. The calculator will automatically apply 2025 federal tax brackets and calculate your tax liability.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once the calculation is complete, review your estimated net income after tax—this is your projected take-home pay for the year. Compare this figure to your gross income to see your effective tax rate (total tax divided by gross income). Use this information to adjust your budget, evaluate salary negotiations, or plan quarterly estimated tax payments if you're self-employed. Remember that this calculator provides an estimate; actual taxes may vary based on life changes, credits claimed, or adjustments made during tax season.</p>
        </div>
      </section>

      {/* TABLE: 2025 Federal Income Tax Brackets by Filing Status */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2025 Federal Income Tax Brackets by Filing Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These are the official federal tax brackets for 2025, used to calculate your taxable income and determine net income after tax.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single Filers</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Married Filing Jointly</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Head of Household</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 – $14,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 – $29,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 – $21,900</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,601 – $59,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$29,201 – $119,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21,901 – $83,550</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$59,751 – $95,375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$119,501 – $182,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$83,551 – $127,550</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$95,376 – $182,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$182,101 – $231,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$127,551 – $206,335</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">32%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$182,101 – $231,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$231,251 – $578,125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$206,336 – $578,125</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$231,251 – $578,125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$578,126 – $693,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$578,126 – $693,750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">37%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$578,126+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$693,751+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$693,751+</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Brackets are adjusted annually for inflation. Self-employed individuals should also account for self-employment tax when calculating net income.</p>
      </section>

      {/* TABLE: Standard Deductions and Personal Exemptions for 2025 */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Deductions and Personal Exemptions for 2025</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard deductions reduce your taxable income and directly impact your net income after tax calculation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Filing Status</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Deduction</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Additional Deduction (Age 65+)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Single</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Married Filing Jointly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$29,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000 per spouse</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Married Filing Separately</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Head of Household</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Qualifying Widow(er)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$29,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These deductions are subtracted from gross income before applying tax rates. Higher deductions result in lower taxable income and higher net income after tax.</p>
      </section>

      {/* TABLE: Average Effective Tax Rates by Income Level (2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Effective Tax Rates by Income Level (2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate effective tax rates (total tax divided by gross income) at different income levels for single filers, helping you benchmark your net income calculation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gross Income</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Federal Tax (Approx.)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Effective Tax Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Net Income After Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,502</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36,498</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$60,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,070</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$52,930</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$80,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,006</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$68,994</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,506</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$84,494</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,106</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$119,894</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$46,606</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$153,394</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These estimates assume standard deduction only and no credits or additional deductions. State and local taxes are not included. Actual results vary based on individual circumstances.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for all income sources when using this calculator—include W-2 wages, bonuses, freelance income, rental income, investment gains, and side hustles to get an accurate net income estimate.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Update your filing status immediately if your circumstances change (marriage, divorce, or claiming dependents), as this significantly impacts your tax brackets and standard deduction, directly affecting your net income after tax.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you expect major life changes (new child, significant investment income, or job loss), recalculate your net income to determine if you need to adjust your withholding or make quarterly estimated tax payments.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator alongside the IRS Tax Withholding Estimator to ensure your employer is withholding the correct amount from each paycheck, preventing surprise tax bills and maximizing your actual net income.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include All Income</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people only input their salary and forget side income, freelance earnings, or investment gains, resulting in an underestimated tax liability and overstated net income. The IRS taxes all income sources, so every dollar earned must be included in your gross income calculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Net Income with Take-Home Pay</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Net income after tax is your income after federal, state, and local taxes, but you may still have additional deductions from your paycheck like health insurance premiums, retirement contributions, or student loan payments. Your actual take-home pay may be lower than the net income this calculator shows.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated Tax Brackets or Deduction Amounts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tax brackets and standard deductions change annually for inflation. Using 2024 rates when calculating 2025 income will produce inaccurate results; always ensure your calculator uses the current tax year's brackets and deductions.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Self-Employment Tax</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Self-employed individuals owe 15.3% in self-employment taxes (Social Security and Medicare) in addition to income tax, which can reduce net income by 10-20% compared to W-2 employees earning the same gross income. Failing to include this results in a significantly inflated net income estimate.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between gross income and net income after tax?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gross income is your total earnings before any deductions, while net income after tax is what remains after federal, state, and local taxes are subtracted. For example, if you earn $75,000 gross and owe $15,000 in taxes, your net income after tax is $60,000. This calculator helps you quickly determine that take-home figure based on your specific tax situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the Net Income after Tax Calculator account for federal tax brackets in 2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator applies the 2025 federal tax brackets, which include rates of 10%, 12%, 22%, 24%, 32%, 35%, and 37% depending on your income level and filing status. For single filers in 2025, the 22% bracket applies to income between $47,150 and $100,525. The calculator automatically applies the correct marginal and effective tax rates to your income.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include bonuses and overtime in my gross income for this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, all forms of taxable income—including bonuses, overtime, freelance income, and investment gains—should be included in your gross income input. These earnings are subject to the same tax treatment as your regular salary, so including them ensures your net income calculation is accurate. Excluding bonuses or overtime will underestimate your actual tax liability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do standard deductions affect the net income after tax calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard deduction reduces your taxable income before taxes are calculated. For 2025, the standard deduction is $14,600 for single filers and $29,200 for married filing jointly. The calculator applies this deduction automatically, so if you earn $60,000 as a single filer, only $45,400 is subject to federal income tax, resulting in a higher net income after tax.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does this calculator include state and local income taxes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most Net Income after Tax Calculators allow you to input your state and local tax rates to provide a complete picture of your after-tax income. State income tax rates vary from 0% in states like Texas and Florida to 13.3% in California. If your calculator has this feature, entering your state rate ensures you see your true take-home pay.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does self-employment tax factor into net income after tax?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Self-employed individuals owe both income tax and self-employment tax (Social Security and Medicare), which totals 15.3% on net earnings. This calculator may account for self-employment tax if you select that option, significantly reducing net income compared to W-2 employees. For example, a self-employed person earning $80,000 gross might owe approximately $11,304 in self-employment and income taxes combined.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to estimate my quarterly estimated tax payments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can use the net income after tax calculation to estimate your total annual tax liability, then divide by four to determine quarterly payments. However, self-employed individuals and high-income earners should also consider prior-year income, credits, and deductions when calculating estimated taxes. The IRS typically requires estimated tax payments when you expect to owe $1,000 or more in taxes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What tax credits should I factor into this calculator for a more accurate result?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common tax credits that reduce your tax liability include the Earned Income Credit (up to $3,995 for 2025), Child Tax Credit ($2,000 per child), and Dependent Care Credit. These credits are applied after calculating your tax, dollar-for-dollar reducing what you owe. If your calculator has a credits section, entering eligible credits will increase your net income after tax.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does filing status (single vs. married) change the net income after tax calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Filing status determines which tax brackets and standard deduction apply to your income. Married filing jointly has wider tax brackets and a higher standard deduction ($29,200 vs. $14,600 for single in 2025), typically resulting in lower taxes on the same household income. Using the correct filing status in this calculator is essential for an accurate net income estimate.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2025" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Tax Brackets and Standard Deduction Information</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on 2025 tax brackets, standard deductions, and inflation adjustments for income calculations.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/forms/about-form-1040" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Form 1040 Instructions and Net Income Calculation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">IRS publication explaining how to calculate taxable income and net income on the federal tax return.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/credits-deductions-for-individuals" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tax Credits and Deductions Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive IRS resource on tax credits and deductions that affect your net income after tax calculation.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-medicare-tax-for-self-employed" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Self-Employment Tax Calculator and Guidance</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS explanation of self-employment tax calculations for freelancers and business owners determining net income.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Net Income after Tax Calculator"
      description="Calculate your net income after taxes. Estimate your actual take-home pay based on your gross salary and location."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Net Income after Tax Calculator" },
        { id: "formula", label: "Net Income after Tax Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Income = (Gross Income - Deductions) - (Gross Income × Tax Rate)",
        variables: [
          { symbol: "Gross Income", description: "Total earnings before taxes" },
          { symbol: "Deductions", description: "Total allowable deductions" },
          { symbol: "Tax Rate", description: "Applicable tax percentage" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a gross income of $60,000, a tax rate of 20%, and deductions totaling $5,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "60,000 - 5,000 = 55,000", 
            explanation: "Calculate income after deductions." 
          },
          { 
            label: "Step 2", 
            calculation: "55,000 × 0.20 = 11,000", 
            explanation: "Calculate total tax." 
          },
          { 
            label: "Step 3", 
            calculation: "55,000 - 11,000 = 44,000", 
            explanation: "Determine net income after tax." 
          }
        ],
        result: "The final result is $44,000, meaning your take-home pay after taxes and deductions."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💰" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "🔄" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}
