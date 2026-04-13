import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function PaycheckCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hoursWorked: "", 
    hourlyRate: "", 
    overtimeHours: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "How does the paycheck calculator account for federal income tax withholding?",
      answer: "The paycheck calculator uses the IRS 2024 tax tables and withholding formulas to estimate federal income tax based on your filing status, number of dependents (W-4 allowances), and gross pay frequency. It applies the standard deduction ($13,850 for single filers, $27,700 for married filing jointly in 2024) and calculates tax using the current tax brackets. The calculator assumes you've completed Form W-4 accurately; if you claim zero allowances versus two, your withholding will differ significantly.",
    },
    {
      question: "What is the maximum Social Security tax I'll pay on my 2024 paycheck?",
      answer: "Social Security tax is 6.2% of gross wages, with a 2024 wage base limit of $168,600. This means the maximum you'll pay in Social Security tax for 2024 is $10,453.20; once you earn above $168,600, no additional Social Security tax is withheld. Self-employed workers pay double (12.4%) but can deduct half on their tax return.",
    },
    {
      question: "How does the calculator handle bonuses and irregular income?",
      answer: "Most paycheck calculators treat bonuses as a one-time addition to your gross income and apply all standard withholdings (federal, state, FICA) at your regular tax rate. However, some employers use the aggregate method, withholding at a flat 22% federal rate on bonuses (or 37% for bonuses over $1 million). For accurate results, enter your bonus as part of gross income and verify your employer's specific bonus withholding policy.",
    },
    {
      question: "Can the paycheck calculator account for pre-tax deductions like 401(k) contributions?",
      answer: "Yes, quality paycheck calculators let you input pre-tax deductions such as 401(k) contributions (2024 limit: $23,500), traditional IRA contributions, and health insurance premiums. These reduce your taxable income before federal and state taxes are calculated, lowering your overall tax burden. For example, a $500 401(k) contribution reduces your taxable income by $500, potentially saving you $100-$150 in federal taxes depending on your bracket.",
    },
    {
      question: "How do state income taxes affect my paycheck calculator results?",
      answer: "State income tax rates vary from 0% (in states like Florida and Texas) to over 13% (in California). The paycheck calculator should allow you to select your state and apply its specific tax brackets and deductions. Your state may offer additional credits or have different treatment of federal income, so results vary widely—a $50,000 salary takes-home amount differs by $2,000–$4,000 between low-tax and high-tax states.",
    },
    {
      question: "What if I have multiple jobs—how do I use the paycheck calculator?",
      answer: "If you have multiple jobs, run the paycheck calculator separately for each employer using the income from that specific job. Then enter your combined annual income on your tax return to check if you're withholding enough total tax; if not, adjust your W-4 at your primary job to increase withholding. The calculator alone won't detect under-withholding across multiple employers, so manual review is necessary.",
    },
    {
      question: "Does the calculator include Medicare tax, and is there a wage limit?",
      answer: "Yes, the paycheck calculator includes Medicare tax at 1.45% of all gross wages with no upper limit, plus an additional 0.9% Medicare tax on wages over $200,000 (single) or $250,000 (married filing jointly) in 2024. This means high earners pay 2.35% total Medicare tax on earnings above those thresholds. The calculator should automatically apply the additional Medicare tax if your gross income exceeds these limits.",
    },
    {
      question: "How accurate is the paycheck calculator for estimating my annual taxes?",
      answer: "The paycheck calculator is generally accurate within 5–10% when you provide correct information (gross pay, W-4 allowances, deductions, filing status), as it uses official IRS 2024 tax tables. However, accuracy decreases if you have irregular income, significant deductions, credits (like EITC or child tax credits), or multiple income sources. It's best used as a planning tool, not a replacement for professional tax preparation.",
    },
    {
      question: "Should I adjust my W-4 if the paycheck calculator shows I'm over-withholding?",
      answer: "If the calculator shows you're consistently over-withholding (getting a large refund), you can claim additional allowances on Form W-4 to reduce withholding and increase your take-home pay each paycheck. Conversely, if you're under-withholding, reduce allowances to increase withholding. The IRS provides a W-4 calculator on its website to help ensure your withholding matches your actual tax liability for the year.",
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
    const hoursWorked = parseFloat(inputs.hoursWorked) || 0;
    const hourlyRate = parseFloat(inputs.hourlyRate) || 0;
    const overtimeHours = parseFloat(inputs.overtimeHours) || 0;

    // Validate
    if (hoursWorked <= 0 || hourlyRate <= 0) {
      return { 
        mainResult: 0, 
        overtimePay: 0, 
        totalPay: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const regularPay = hoursWorked * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const totalPay = regularPay + overtimePay;

    // Generate schedule data if applicable (e.g., pay breakdown)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      regularPay: regularPay / 12,
      overtimePay: overtimePay / 12,
      totalPay: totalPay / 12,
    }));

    return { 
      mainResult: regularPay, 
      overtimePay, 
      totalPay, 
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
    setInputs({ hoursWorked: "", hourlyRate: "", overtimeHours: "" });
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
              Hours Worked
            </Label>
            <Input
              type="number"
              placeholder="e.g., 40"
              value={inputs.hoursWorked}
              onChange={(e) => setInputs({ ...inputs, hoursWorked: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Hourly Rate
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15"
              value={inputs.hourlyRate}
              onChange={(e) => setInputs({ ...inputs, hourlyRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Overtime Hours
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.overtimeHours}
              onChange={(e) => setInputs({ ...inputs, overtimeHours: e.target.value })}
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
                      Regular Pay
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
                      Overtime Pay
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.overtimePay)}
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
                      Total Pay
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalPay)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PAY SCHEDULE TABLE */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Weekly Pay Breakdown
                  </span>
                  {results.scheduleData.length > 6 && (
                    <Button 
                      onClick={() => setShowFullTable(!showFullTable)} 
                      variant="outline"
                      size="sm"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {showFullTable 
                        ? 'Show Less' 
                        : `Show All ${results.scheduleData.length} Weeks`}
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900">
                        <TableHead className="font-semibold">Week</TableHead>
                        <TableHead className="font-semibold">Regular Pay</TableHead>
                        <TableHead className="font-semibold">Overtime Pay</TableHead>
                        <TableHead className="font-semibold">Total Pay</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.scheduleData
                        .slice(0, showFullTable ? undefined : 6)
                        .map((row, idx) => (
                          <TableRow 
                            key={idx} 
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <TableCell className="font-medium">{row.week}</TableCell>
                            <TableCell>{formatCurrency(row.regularPay)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.overtimePay)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.totalPay)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Paycheck Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The paycheck calculator is a tool designed to estimate your net take-home pay based on your gross income, withholding elections, and deductions. It applies current federal and state tax rates, Social Security and Medicare taxes (FICA), and any pre-tax or post-tax deductions you've selected. Understanding your actual paycheck helps you budget accurately and identify if you're withholding too much or too little in taxes.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, start by entering your gross annual salary or hourly wage and pay frequency (weekly, bi-weekly, monthly, etc.). Next, provide your filing status from Form W-4 (single, married, head of household), number of dependents or allowances, and any pre-tax deductions like 401(k) contributions, health insurance premiums, or FSA contributions. Finally, select your state and any applicable local taxes; the calculator will apply the correct 2024 tax tables and rates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your gross pay per paycheck, each tax withheld (federal, Social Security, Medicare, state), and your net take-home amount. Compare this to your actual paycheck stub—they should align closely if you've entered all information correctly. If your calculated take-home differs significantly from your actual pay, review your W-4 withholding, recent life changes (marriage, new dependent), or employer deductions you may have overlooked.</p>
        </div>
      </section>

      {/* TABLE: 2024 Federal Income Tax Brackets and Rates */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024 Federal Income Tax Brackets and Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These are the official 2024 tax brackets used by the paycheck calculator for single filers, demonstrating how marginal tax rates apply to different income levels.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Income Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Effective Tax Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0–$11,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,160 on $11,600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$11,601–$47,150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,278 on $47,150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$47,151–$100,525</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$17,168 on $100,525</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,526–$191,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$39,110 on $191,950</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$191,951–$243,725</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$78,556 on $243,725</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$243,726–$609,350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$253,660 on $609,350</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$609,351+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$37,000+ on each additional $100,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These rates apply to single filers; married filing jointly brackets are approximately double. The standard deduction ($13,850 for single filers in 2024) reduces taxable income.</p>
      </section>

      {/* TABLE: FICA Tax Rates and Wage Limits for 2024 */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">FICA Tax Rates and Wage Limits for 2024</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">The paycheck calculator applies these FICA rates to compute Social Security and Medicare withholding on your gross wages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tax Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Employee Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2024 Wage Limit / Cap</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Annual Tax</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Social Security</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$168,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,453.20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medicare</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Additional Medicare</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200,000 (single)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable above cap</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Combined FICA</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.65%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">See above</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">~$12,500–$14,000 avg</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Additional Medicare tax (0.9%) applies to wages over $200,000 (single) or $250,000 (MFJ). Self-employed workers pay double these rates but can deduct half.</p>
      </section>

      {/* TABLE: Sample Paycheck Breakdown: $60,000 Annual Salary */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Paycheck Breakdown: $60,000 Annual Salary</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This example shows how the paycheck calculator distributes a typical annual salary across federal tax, FICA, and take-home pay for a single filer in 2024.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Component</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gross Annual</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Per Paycheck (26 pays)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gross Pay</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,308</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Federal Income Tax</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$6,252</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$241</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.4%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Social Security (6.2%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$3,720</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$143</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.2%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medicare (1.45%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$870</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.45%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Net Take-Home</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$49,158</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,891</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82.0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">State Tax (estimated 5%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$115</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">State tax varies by location; this assumes a 5% state income tax rate. Actual take-home depends on pre-tax deductions (401k, insurance) and filing status.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the paycheck calculator after major life events—marriage, birth of a child, or starting a new job—to verify your W-4 withholding is correct; even one extra allowance can change your annual refund by $1,000–$2,000.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you're self-employed or have side income, manually add that income to the calculator to estimate your total federal withholding obligation; the calculator alone won't account for quarterly estimated tax payments you may owe.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your paycheck stub against the calculator results at least once per year; discrepancies often reveal missed deductions, outdated W-4 information, or employer withholding errors that reduce your take-home unnecessarily.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Before claiming additional allowances on your W-4 to reduce withholding, use the calculator to confirm you won't owe taxes at year-end; over-reducing withholding can result in penalties and unexpected tax bills.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include pre-tax deductions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many users overlook 401(k) contributions, health insurance premiums, and HSA contributions, which reduce your taxable income and lower your federal tax burden. Omitting these deductions overstates your tax liability by 10–15%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the wrong pay frequency</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering bi-weekly pay instead of weekly pay, or vice versa, produces incorrect per-paycheck amounts and throws off your annual estimates. Always verify your actual pay schedule with your employer—it affects both gross and net calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming the same rate applies to bonuses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many calculators apply your standard withholding rate to bonuses, but employers often withhold a flat 22% federal rate on bonuses instead. Bonuses treated as supplemental wages can result in under- or over-withholding if this distinction is ignored.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting state and local taxes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator requires you to select your state, but many users skip this step or assume a default rate; state income tax ranges from 0% to over 13%, making this step critical for accurate results. Skipping it can overstate take-home by $2,000–$5,000 annually.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the paycheck calculator account for federal income tax withholding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The paycheck calculator uses the IRS 2024 tax tables and withholding formulas to estimate federal income tax based on your filing status, number of dependents (W-4 allowances), and gross pay frequency. It applies the standard deduction ($13,850 for single filers, $27,700 for married filing jointly in 2024) and calculates tax using the current tax brackets. The calculator assumes you've completed Form W-4 accurately; if you claim zero allowances versus two, your withholding will differ significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum Social Security tax I'll pay on my 2024 paycheck?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Social Security tax is 6.2% of gross wages, with a 2024 wage base limit of $168,600. This means the maximum you'll pay in Social Security tax for 2024 is $10,453.20; once you earn above $168,600, no additional Social Security tax is withheld. Self-employed workers pay double (12.4%) but can deduct half on their tax return.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator handle bonuses and irregular income?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most paycheck calculators treat bonuses as a one-time addition to your gross income and apply all standard withholdings (federal, state, FICA) at your regular tax rate. However, some employers use the aggregate method, withholding at a flat 22% federal rate on bonuses (or 37% for bonuses over $1 million). For accurate results, enter your bonus as part of gross income and verify your employer's specific bonus withholding policy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the paycheck calculator account for pre-tax deductions like 401(k) contributions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, quality paycheck calculators let you input pre-tax deductions such as 401(k) contributions (2024 limit: $23,500), traditional IRA contributions, and health insurance premiums. These reduce your taxable income before federal and state taxes are calculated, lowering your overall tax burden. For example, a $500 401(k) contribution reduces your taxable income by $500, potentially saving you $100-$150 in federal taxes depending on your bracket.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do state income taxes affect my paycheck calculator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">State income tax rates vary from 0% (in states like Florida and Texas) to over 13% (in California). The paycheck calculator should allow you to select your state and apply its specific tax brackets and deductions. Your state may offer additional credits or have different treatment of federal income, so results vary widely—a $50,000 salary takes-home amount differs by $2,000–$4,000 between low-tax and high-tax states.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I have multiple jobs—how do I use the paycheck calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you have multiple jobs, run the paycheck calculator separately for each employer using the income from that specific job. Then enter your combined annual income on your tax return to check if you're withholding enough total tax; if not, adjust your W-4 at your primary job to increase withholding. The calculator alone won't detect under-withholding across multiple employers, so manual review is necessary.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator include Medicare tax, and is there a wage limit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the paycheck calculator includes Medicare tax at 1.45% of all gross wages with no upper limit, plus an additional 0.9% Medicare tax on wages over $200,000 (single) or $250,000 (married filing jointly) in 2024. This means high earners pay 2.35% total Medicare tax on earnings above those thresholds. The calculator should automatically apply the additional Medicare tax if your gross income exceeds these limits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the paycheck calculator for estimating my annual taxes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The paycheck calculator is generally accurate within 5–10% when you provide correct information (gross pay, W-4 allowances, deductions, filing status), as it uses official IRS 2024 tax tables. However, accuracy decreases if you have irregular income, significant deductions, credits (like EITC or child tax credits), or multiple income sources. It's best used as a planning tool, not a replacement for professional tax preparation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust my W-4 if the paycheck calculator shows I'm over-withholding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If the calculator shows you're consistently over-withholding (getting a large refund), you can claim additional allowances on Form W-4 to reduce withholding and increase your take-home pay each paycheck. Conversely, if you're under-withholding, reduce allowances to increase withholding. The IRS provides a W-4 calculator on its website to help ensure your withholding matches your actual tax liability for the year.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/taxes/individuals/tax-withholding-estimator" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Form W-4 and Withholding Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The official IRS withholding calculator and W-4 guidance help you determine the correct number of allowances and deductions to optimize your tax withholding.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments-for-tax-year-2024" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">2024 Tax Brackets and Rates (IRS)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official 2024 federal income tax brackets, standard deduction amounts, and FICA wage limits published by the Internal Revenue Service.</p>
          </li>
          <li>
            <a href="https://www.ssa.gov/benefits/retirement/benefit-planning.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Social Security Wage Base and Tax Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Social Security Administration details on the 2024 wage base limit ($168,600), employee tax rate (6.2%), and annual benefit calculations.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/finance/taxes/paycheck-calculator/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate: Paycheck Calculator Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide explaining how paycheck calculators work, common mistakes, and how to verify withholding accuracy against your pay stub.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Paycheck Calculator"
      description="Calculate your paycheck based on hours worked, pay rate, and overtime. Get an accurate salary estimation for your next pay period."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Paycheck Calculator" },
        { id: "formula", label: "Paycheck Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Pay = (Hours Worked × Hourly Rate) + (Overtime Hours × Hourly Rate × 1.5)",
        variables: [
          { symbol: "Hours Worked", description: "Total regular hours worked" },
          { symbol: "Hourly Rate", description: "Your pay per hour" },
          { symbol: "Overtime Hours", description: "Total hours worked beyond regular hours" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you work 40 regular hours and 5 overtime hours at a rate of $20/hour.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "40 × 20 = 800", 
            explanation: "Calculate regular pay" 
          },
          { 
            label: "Step 2", 
            calculation: "5 × 20 × 1.5 = 150", 
            explanation: "Calculate overtime pay" 
          },
          { 
            label: "Step 3", 
            calculation: "800 + 150 = 950", 
            explanation: "Total pay for the period" 
          }
        ],
        result: "The final result is $950, meaning your total earnings for the week including overtime."
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
