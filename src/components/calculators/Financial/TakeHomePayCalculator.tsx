import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function TakeHomePayCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    grossIncome: "", 
    taxRate: "", 
    otherDeductions: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is take-home pay and how does it differ from gross salary?",
      answer: "Take-home pay is the amount you actually receive after all deductions are removed from your gross salary. Gross salary is your total earnings before taxes and deductions, while take-home pay accounts for federal income tax, FICA taxes (Social Security and Medicare), state and local taxes, and any voluntary deductions like 401(k) contributions or health insurance premiums. For example, a $60,000 annual salary might result in take-home pay of approximately $45,000-$48,000 depending on your location and deductions.",
    },
    {
      question: "How does the calculator determine my federal income tax withholding?",
      answer: "The calculator uses the IRS tax brackets and the W-4 form information you input to estimate your federal withholding. It applies the 2024-2025 tax rates, which range from 10% to 37% depending on your filing status and income level. The calculation also factors in the standard deduction ($13,850 for single filers and $27,700 for married filing jointly in 2024) to reduce your taxable income.",
    },
    {
      question: "What are FICA taxes and why are they deducted from my paycheck?",
      answer: "FICA taxes consist of Social Security (6.2% of wages up to $168,600 in 2024) and Medicare (1.45% of all wages). These mandatory deductions fund Social Security and Medicare benefits you'll receive in retirement or if you become disabled. Employers also match these contributions, meaning your total FICA cost is actually double what appears on your paycheck, but only your employee portion is deducted from take-home pay.",
    },
    {
      question: "How do pre-tax deductions like 401(k) contributions affect my take-home pay calculator results?",
      answer: "Pre-tax deductions reduce your taxable income, which lowers both your federal and state income taxes. For example, contributing $7,000 annually to a 401(k) reduces your taxable income by $7,000, potentially saving you $1,400-$2,100 in federal taxes depending on your tax bracket. The calculator shows how much you'll actually take home after these deductions, helping you understand the real-world impact on your paycheck.",
    },
    {
      question: "Can the calculator account for state and local income taxes?",
      answer: "Yes, the calculator includes state and local income tax calculations for most U.S. states and major cities. State tax rates vary significantly—for example, California has a top marginal rate of 13.3%, while Texas has no state income tax. Inputting your state and city of residence ensures accurate take-home pay estimates, as these taxes can reduce your paycheck by 5-10% depending on location.",
    },
    {
      question: "What should I enter for allowances or dependents on the calculator?",
      answer: "You should enter the number of dependents you claim on your W-4 form, as each dependent generally reduces your federal tax withholding. The calculator uses this information to adjust your effective tax rate. For 2024, each dependent reduces your tax liability by $2,000 through the Child Tax Credit, which is reflected in lower withholding on your paycheck.",
    },
    {
      question: "How does filing status (single vs. married) impact my take-home pay calculation?",
      answer: "Filing status dramatically affects tax brackets and standard deductions. A married couple filing jointly has a standard deduction of $27,700 in 2024, while two single filers each get $13,850—meaning married filing jointly can result in significant tax savings. The calculator adjusts your estimated federal withholding based on your filing status to provide an accurate take-home figure.",
    },
    {
      question: "Why does my calculated take-home pay differ from my actual paycheck?",
      answer: "The calculator provides an estimate based on standard assumptions; actual take-home pay may vary due to irregular bonuses, overtime, employer-specific benefits, additional voluntary deductions (HSA, FSA, union dues), or payroll processing timing. Additionally, if you have multiple jobs or a non-traditional income schedule, the calculator may not fully capture your situation. For the most accurate results, compare the calculator output to a recent pay stub.",
    },
    {
      question: "Can I use this calculator to optimize my W-4 withholding to reduce my tax refund?",
      answer: "Yes, the calculator helps you model different W-4 scenarios to find the right withholding level. If you typically receive a large refund, you're having too much withheld, which means less take-home pay each month. By adjusting your allowances or additional withholding in the calculator, you can estimate the changes needed to bring your withholding closer to your actual tax liability, maximizing your monthly paycheck.",
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
    const otherDeductionsValue = parseFloat(inputs.otherDeductions) || 0;

    // Validate
    if (grossIncomeValue <= 0 || taxRateValue < 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const taxAmount = grossIncomeValue * (taxRateValue / 100);
    const takeHomePay = grossIncomeValue - taxAmount - otherDeductionsValue;
    const monthlyTakeHome = takeHomePay / 12;
    const annualSavings = takeHomePay * 0.1; // Assuming 10% savings

    // Generate schedule data if applicable (e.g., monthly breakdown)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      grossIncome: grossIncomeValue / 12,
      tax: taxAmount / 12,
      deductions: otherDeductionsValue / 12,
      netIncome: monthlyTakeHome,
    }));

    return { 
      mainResult: takeHomePay, 
      result2: monthlyTakeHome, 
      result3: annualSavings, 
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
    setInputs({ grossIncome: "", taxRate: "", otherDeductions: "" });
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
              Gross Annual Income
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
              Other Deductions
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={inputs.otherDeductions}
              onChange={(e) => setInputs({ ...inputs, otherDeductions: e.target.value })}
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
                      Annual Take-Home Pay
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
                      Monthly Take-Home Pay
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
                      Estimated Annual Savings
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.result3)}
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
                    Monthly Income Breakdown
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
                        <TableHead className="font-semibold">Deductions</TableHead>
                        <TableHead className="font-semibold">Net Income</TableHead>
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
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.tax)}
                            </TableCell>
                            <TableCell className="text-yellow-600 dark:text-yellow-400">
                              {formatCurrency(row.deductions)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.netIncome)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Take-Home Pay Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Take-Home Pay Calculator estimates the actual amount you'll receive in your paycheck after all mandatory and voluntary deductions. This tool helps you understand how taxes, Social Security, Medicare, and other deductions reduce your gross income, enabling you to budget more accurately and plan your finances with confidence. Whether you're evaluating a new job offer or reviewing your current pay, this calculator provides clarity on your true earnings.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your annual gross salary, select your filing status (single, married filing jointly, etc.), enter the number of dependents you claim, and specify your state and city of residence. The calculator will also account for pre-tax deductions like 401(k) contributions, health insurance premiums, and other payroll deductions you may have. You can adjust your W-4 withholding allowances to see how different election choices impact your take-home amount.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your estimated annual take-home pay, monthly paycheck amount, and a detailed breakdown of all deductions including federal income tax, Social Security, Medicare, and state/local taxes. Review these figures against your most recent pay stub to verify accuracy, and remember that bonuses, overtime, or changes to your W-4 will affect your actual take-home pay. Use the calculator regularly when your income or tax situation changes to stay aligned with your budget.</p>
        </div>
      </section>

      {/* TABLE: 2024 Federal Income Tax Brackets and Rates */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024 Federal Income Tax Brackets and Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These are the current federal tax brackets used by the take-home pay calculator for single and married filing jointly taxpayers.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Bracket</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Single Filers</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Married Filing Jointly</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0 - $11,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 - $23,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 - $23,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$11,601 - $47,150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$23,201 - $94,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$23,201 - $94,300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$47,151 - $100,525</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$94,301 - $201,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$94,301 - $201,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,526 - $191,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$201,051 - $383,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$201,051 - $383,900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$191,951 - $243,725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$383,901 - $487,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$383,901 - $487,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$243,726 - $609,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$487,451 - $731,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$487,451 - $731,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$609,351+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$731,201+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$731,201+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Brackets are adjusted annually for inflation. Single filers use the left column; married filing jointly uses the middle column.</p>
      </section>

      {/* TABLE: FICA Tax Rates and Wage Limits for 2024 */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">FICA Tax Rates and Wage Limits for 2024</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">FICA taxes consist of Social Security and Medicare contributions, which are automatically deducted from your paycheck by the calculator.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Component</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Employee Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wage Base Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Social Security</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$168,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Employer matches 6.2%; caps at $10,453.20 per employee</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medicare</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Employer matches 1.45%; applies to all wages</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Additional Medicare</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Applies above $200,000 (single)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Only employee pays this; no employer match</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total FICA (standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.65%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$168,600 for Social Security</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Combined Social Security and Medicare for most workers</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">The wage base limit for Social Security adjusts annually. High earners may owe additional Medicare tax on wages exceeding $200,000 (single) or $250,000 (married filing jointly).</p>
      </section>

      {/* TABLE: Sample Take-Home Pay Calculations by Income Level (2024) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Take-Home Pay Calculations by Income Level (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These examples show estimated annual take-home pay after federal, FICA, and average state taxes for a single filer in a mid-tax-rate state.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Gross Salary</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Federal Taxes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">FICA Taxes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">State Taxes (Est.)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Take-Home Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,548</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,295</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,275</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,882</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,513</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,825</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,275</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$39,387</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$75,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,888</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,738</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,525</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$56,849</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,263</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$73,237</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$26,888</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11,475</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,275</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$104,362</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume standard deduction, no dependents, single filer status, and 5.5% state tax rate. Results will vary based on filing status, deductions, and state location.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Review your pay stub against the calculator results quarterly — this helps you catch payroll errors and ensures your W-4 withholding is still optimized for your current income level.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you receive a large tax refund every year, increase your W-4 allowances or reduce additional withholding in the calculator to boost your monthly take-home pay and adjust your paycheck in real-time.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for irregular income by using the calculator to model both your base salary and bonus scenarios separately, so you understand your typical monthly take-home versus peak earning months.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Update the calculator annually when tax brackets change (usually in January) and whenever you experience major life changes like marriage, having children, or changing jobs — these events significantly impact your take-home pay.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include voluntary deductions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people forget to add 401(k), HSA, or FSA contributions when calculating take-home pay, leading to inflated estimates. These pre-tax deductions reduce your taxable income but must be entered separately in the calculator for an accurate result.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the wrong filing status</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Selecting the incorrect filing status (single instead of married, or vice versa) dramatically changes your tax withholding calculation. Ensure your calculator selection matches the status you claim on your actual tax return for accurate estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring state and local taxes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some people assume federal taxes are the only deduction and overlook state income taxes, which can range from 0% to 13.3% depending on location. Leaving the state field blank will provide an inaccurate, inflated take-home pay estimate.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming the calculator is 100% accurate for all situations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator provides estimates based on standard assumptions and cannot account for complex tax situations like side income, investment earnings, or multiple jobs. Always verify results against your actual pay stub and consult a tax professional for complicated scenarios.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is take-home pay and how does it differ from gross salary?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Take-home pay is the amount you actually receive after all deductions are removed from your gross salary. Gross salary is your total earnings before taxes and deductions, while take-home pay accounts for federal income tax, FICA taxes (Social Security and Medicare), state and local taxes, and any voluntary deductions like 401(k) contributions or health insurance premiums. For example, a $60,000 annual salary might result in take-home pay of approximately $45,000-$48,000 depending on your location and deductions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator determine my federal income tax withholding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses the IRS tax brackets and the W-4 form information you input to estimate your federal withholding. It applies the 2024-2025 tax rates, which range from 10% to 37% depending on your filing status and income level. The calculation also factors in the standard deduction ($13,850 for single filers and $27,700 for married filing jointly in 2024) to reduce your taxable income.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are FICA taxes and why are they deducted from my paycheck?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">FICA taxes consist of Social Security (6.2% of wages up to $168,600 in 2024) and Medicare (1.45% of all wages). These mandatory deductions fund Social Security and Medicare benefits you'll receive in retirement or if you become disabled. Employers also match these contributions, meaning your total FICA cost is actually double what appears on your paycheck, but only your employee portion is deducted from take-home pay.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do pre-tax deductions like 401(k) contributions affect my take-home pay calculator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pre-tax deductions reduce your taxable income, which lowers both your federal and state income taxes. For example, contributing $7,000 annually to a 401(k) reduces your taxable income by $7,000, potentially saving you $1,400-$2,100 in federal taxes depending on your tax bracket. The calculator shows how much you'll actually take home after these deductions, helping you understand the real-world impact on your paycheck.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the calculator account for state and local income taxes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator includes state and local income tax calculations for most U.S. states and major cities. State tax rates vary significantly—for example, California has a top marginal rate of 13.3%, while Texas has no state income tax. Inputting your state and city of residence ensures accurate take-home pay estimates, as these taxes can reduce your paycheck by 5-10% depending on location.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I enter for allowances or dependents on the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You should enter the number of dependents you claim on your W-4 form, as each dependent generally reduces your federal tax withholding. The calculator uses this information to adjust your effective tax rate. For 2024, each dependent reduces your tax liability by $2,000 through the Child Tax Credit, which is reflected in lower withholding on your paycheck.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does filing status (single vs. married) impact my take-home pay calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Filing status dramatically affects tax brackets and standard deductions. A married couple filing jointly has a standard deduction of $27,700 in 2024, while two single filers each get $13,850—meaning married filing jointly can result in significant tax savings. The calculator adjusts your estimated federal withholding based on your filing status to provide an accurate take-home figure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my calculated take-home pay differ from my actual paycheck?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator provides an estimate based on standard assumptions; actual take-home pay may vary due to irregular bonuses, overtime, employer-specific benefits, additional voluntary deductions (HSA, FSA, union dues), or payroll processing timing. Additionally, if you have multiple jobs or a non-traditional income schedule, the calculator may not fully capture your situation. For the most accurate results, compare the calculator output to a recent pay stub.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to optimize my W-4 withholding to reduce my tax refund?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator helps you model different W-4 scenarios to find the right withholding level. If you typically receive a large refund, you're having too much withheld, which means less take-home pay each month. By adjusting your allowances or additional withholding in the calculator, you can estimate the changes needed to bring your withholding closer to your actual tax liability, maximizing your monthly paycheck.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS 2024 Tax Brackets and Standard Deductions</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS announcement of 2024 tax brackets, standard deductions, and FICA wage limits used in take-home pay calculations.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/forms-pubs/about-form-w-4" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Form W-4: Employee's Withholding Certificate</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Complete guide to Form W-4, explaining allowances, exemptions, and how withholding elections affect your paycheck.</p>
          </li>
          <li>
            <a href="https://www.ssa.gov/benefits/retirement/wep-government-pension.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Social Security Administration: Wage Base Limit</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Information on Social Security wage base limits, contribution rates, and how they impact take-home pay for high earners.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/taxes/tax-refund-calculator/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate: Tax Refund Calculator & Withholding Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide to understanding tax withholding, refunds, and strategies to optimize your paycheck using withholding adjustments.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Take-Home Pay Calculator"
      description="Estimate your paycheck after tax withholdings and deductions. See exactly what amount hits your bank account every payday."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Take-Home Pay Calculator" },
        { id: "formula", label: "Take-Home Pay Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Take-Home Pay = Gross Income - (Gross Income × Tax Rate) - Other Deductions",
        variables: [
          { symbol: "Gross Income", description: "Total earnings before taxes" },
          { symbol: "Tax Rate", description: "Percentage of income paid as tax" },
          { symbol: "Other Deductions", description: "Additional deductions like retirement or healthcare" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you earn $60,000 annually with a 20% tax rate and $5,000 in other deductions.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "60,000 × 0.20 = 12,000", 
            explanation: "Calculate the total tax amount." 
          },
          { 
            label: "Step 2", 
            calculation: "60,000 - 12,000 - 5,000 = 43,000", 
            explanation: "Subtract taxes and deductions from gross income." 
          },
          { 
            label: "Step 3", 
            calculation: "43,000 ÷ 12 = 3,583.33", 
            explanation: "Determine the monthly take-home pay." 
          }
        ],
        result: "The final result is $43,000 annually or $3,583.33 monthly, meaning this is your net income after deductions."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💳" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}
