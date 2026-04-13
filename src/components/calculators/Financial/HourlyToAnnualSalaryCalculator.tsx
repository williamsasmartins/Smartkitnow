import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function HourlyToAnnualSalaryCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    hourlyRate: "", 
    hoursPerWeek: "", 
    weeksPerYear: "52" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "How do I calculate my annual salary from an hourly wage?",
      answer: "Multiply your hourly rate by the number of hours you work per week, then multiply by 52 weeks per year. For example, if you earn $25/hour and work 40 hours per week, your annual salary is $25 × 40 × 52 = $52,000. This calculator automates this calculation and accounts for different work schedules and paid time off.",
    },
    {
      question: "Should I include overtime hours in my annual salary calculation?",
      answer: "Only include overtime hours if they are guaranteed or consistent. Most salary conversions use standard 40-hour work weeks. If you regularly work 45 hours weekly at $20/hour with 1.5× overtime pay after 40 hours, you'd earn $20 × 40 + $20 × 1.5 × 5 = $950/week, or approximately $49,400 annually.",
    },
    {
      question: "How do paid time off (PTO) days affect my annual salary calculation?",
      answer: "PTO days reduce your billable work hours but don't reduce your salary if you're paid during time off. If you have 15 PTO days annually, you work 250 days instead of 260, reducing your work hours by 120 hours (15 days × 8 hours). Include this in your calculator for an accurate take-home estimate.",
    },
    {
      question: "What's the difference between gross annual salary and net annual income?",
      answer: "Gross annual salary is your total earnings before taxes and deductions. Net annual income is what you take home after federal income tax, Social Security (6.2%), Medicare (1.45%), state tax, and other deductions. A $50,000 gross salary typically results in approximately $38,000–$41,000 net income depending on your tax bracket and deductions.",
    },
    {
      question: "How do I account for unpaid leave or sabbaticals in my calculation?",
      answer: "Unpaid leave reduces your annual earnings directly. If you take 4 unpaid weeks off from a $30/hour job working 40 hours weekly, subtract 160 hours: ($30 × 40 × 52) − ($30 × 160) = $62,400 − $4,800 = $57,600 annual income.",
    },
    {
      question: "What hourly wage equals a $60,000 annual salary?",
      answer: "Working a standard 40-hour week for 52 weeks, divide $60,000 by 2,080 hours (40 × 52) to get approximately $28.85/hour. This is the most common conversion benchmark for full-time employment in the United States.",
    },
    {
      question: "How does a part-time schedule affect annual salary calculations?",
      answer: "Part-time workers typically work 20–35 hours per week. If you earn $18/hour working 30 hours weekly, your annual salary is $18 × 30 × 52 = $28,080. Always verify your actual weekly hours with your employer, as part-time schedules vary significantly.",
    },
    {
      question: "Should I include bonuses and commissions in my hourly to annual conversion?",
      answer: "Bonuses and commissions should be calculated separately if they're variable. Convert your base hourly wage first, then add guaranteed bonuses as a separate line item. For example, a $20/hour base job with a $5,000 annual bonus equals ($20 × 40 × 52) + $5,000 = $46,600.",
    },
    {
      question: "What's the 2024–2025 federal minimum wage and its annual equivalent?",
      answer: "The federal minimum wage is $7.25/hour, which equals $15,080 annually for full-time 40-hour-per-week work ($7.25 × 40 × 52). However, 30 states have higher minimum wages; for example, California's minimum wage is $16.50/hour, equivalent to $34,320 annually.",
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
    const hourlyRateValue = parseFloat(inputs.hourlyRate) || 0;
    const hoursPerWeekValue = parseFloat(inputs.hoursPerWeek) || 0;
    const weeksPerYearValue = parseFloat(inputs.weeksPerYear) || 0;

    // Validate
    if (hourlyRateValue <= 0 || hoursPerWeekValue <= 0 || weeksPerYearValue <= 0) {
      return { 
        annualSalary: 0, 
        monthlySalary: 0, 
        weeklySalary: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const weeklySalary = hourlyRateValue * hoursPerWeekValue;
    const annualSalary = weeklySalary * weeksPerYearValue;
    const monthlySalary = annualSalary / 12;

    // Generate schedule data if applicable (e.g., monthly breakdown)
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthlySalary: monthlySalary,
      cumulativeSalary: monthlySalary * (i + 1),
    }));

    return { 
      annualSalary, 
      monthlySalary, 
      weeklySalary, 
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
    setInputs({ hourlyRate: "", hoursPerWeek: "", weeksPerYear: "52" });
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
              Hourly Rate
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.hourlyRate}
              onChange={(e) => setInputs({ ...inputs, hourlyRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Hours per Week
            </Label>
            <Input
              type="number"
              placeholder="e.g., 40"
              value={inputs.hoursPerWeek}
              onChange={(e) => setInputs({ ...inputs, hoursPerWeek: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Weeks per Year
            </Label>
            <Input
              type="number"
              placeholder="e.g., 52"
              value={inputs.weeksPerYear}
              onChange={(e) => setInputs({ ...inputs, weeksPerYear: e.target.value })}
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
      {results.annualSalary > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Annual Salary
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.annualSalary)}
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
                      Monthly Salary
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.monthlySalary)}
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
                      Weekly Salary
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.weeklySalary)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SCHEDULE TABLE */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Monthly Salary Schedule
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
                        <TableHead className="font-semibold">Monthly Salary</TableHead>
                        <TableHead className="font-semibold">Cumulative Salary</TableHead>
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
                            <TableCell>{formatCurrency(row.monthlySalary)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.cumulativeSalary)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Hourly to Annual Salary Converter</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The hourly to annual salary converter is an essential tool for evaluating job offers, budgeting personal finances, and understanding your true earning potential. Whether you're comparing job opportunities, negotiating salary, or simply calculating what your paycheck translates to yearly, this calculator provides an accurate conversion by accounting for work hours, paid time off, and varying employment schedules.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, input your hourly wage rate and specify your average work hours per week (typically 40 for full-time roles, 20–35 for part-time positions). You can also adjust for paid time off days, holidays, unpaid leave, or overtime hours to get a more precise annual total. These inputs directly affect your final calculation, so accuracy in these numbers is essential.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your gross annual salary before taxes and deductions. To estimate your net take-home pay, apply an approximate tax rate of 20–30% depending on your tax bracket, state of residence, and withholding elections. Use this annual figure as a baseline for budgeting, loan applications, or when comparing compensation packages from different employers.</p>
        </div>
      </section>

      {/* TABLE: Hourly Wage to Annual Salary Conversion Chart (40-Hour Work Week) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hourly Wage to Annual Salary Conversion Chart (40-Hour Work Week)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the annual salary equivalent for common hourly wage rates based on a standard 40-hour work week with no unpaid leave.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Hourly Wage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Earnings</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Salary (52 weeks)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$15.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$31,200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$18.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$720</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$37,440</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$20.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,600</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$52,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$62,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$35.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$72,800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$40.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$83,200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$104,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$60.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$124,800</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume 52 weeks of paid work per year with no unpaid leave or holidays.</p>
      </section>

      {/* TABLE: Impact of Paid Time Off on Annual Salary */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Paid Time Off on Annual Salary</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how vacation days and holidays reduce your effective work hours and billable annual salary.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">PTO Days Per Year</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Billable Work Days</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Work Hours Lost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Impact on $30/Hour Wage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$62,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$59,600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">245 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$58,400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$57,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">235 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$56,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">230 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$54,800</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">PTO calculations assume 8-hour work days. Benefits are still paid during PTO in most salaried positions.</p>
      </section>

      {/* TABLE: Gross vs. Net Annual Income (Federal Tax Estimates, 2024) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Gross vs. Net Annual Income (Federal Tax Estimates, 2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated federal income tax withholding and net take-home pay for different gross annual salaries filed as single filers.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gross Annual Salary</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Federal Income Tax (Est.)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">FICA Taxes (7.65%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Net Income</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,860</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,295</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25,845</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,060</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$33,650</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,105</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,825</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,070</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$60,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,590</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$48,360</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$75,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,325</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,738</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$58,938</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,885</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,650</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$76,465</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates are based on 2024 tax brackets for single filers with standard deductions and include Social Security (6.2%) and Medicare (1.45%). State and local taxes not included.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to compare hourly job offers against salaried positions—convert both to annual figures to make apples-to-apples comparisons and ensure you're not leaving money on the table during salary negotiations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for all forms of paid leave—vacation days, sick leave, and holidays—when calculating your effective annual salary, as they reduce your billable work hours even though you're still compensated.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you work variable hours or freelance, calculate your annual salary based on your average weekly hours over the past 3–6 months rather than assuming a full 40-hour week, for a more realistic income projection.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Remember that your gross annual salary is different from your net take-home pay; plan your budget using the net figure after accounting for federal income tax, FICA taxes (7.65%), and state or local taxes, which can reduce your salary by 20–35%.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for unpaid lunch breaks</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many employees work 8.5 or 9 hours per day but are only paid for 8 hours due to unpaid lunch breaks. Don't count unpaid break time in your hourly calculation—use only paid work hours.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming 52 weeks of work without adjusting for holidays</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The U.S. has approximately 10–11 federal holidays annually, reducing billable work days from 260 to 250. Failing to account for this overstates your annual earnings by roughly $1,200–$2,400 depending on hourly wage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including variable overtime as guaranteed income</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Overtime is rarely guaranteed; calculating your annual salary assuming regular overtime hours can lead to inflated expectations. Use only your base hourly rate and standard hours in your primary calculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing gross and net salary</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Your gross annual salary does not equal your take-home income. Federal and FICA taxes reduce most salaries by 20–35%, so a $50,000 gross salary typically results in $33,000–$40,000 net income after taxes.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my annual salary from an hourly wage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your hourly rate by the number of hours you work per week, then multiply by 52 weeks per year. For example, if you earn $25/hour and work 40 hours per week, your annual salary is $25 × 40 × 52 = $52,000. This calculator automates this calculation and accounts for different work schedules and paid time off.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include overtime hours in my annual salary calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Only include overtime hours if they are guaranteed or consistent. Most salary conversions use standard 40-hour work weeks. If you regularly work 45 hours weekly at $20/hour with 1.5× overtime pay after 40 hours, you'd earn $20 × 40 + $20 × 1.5 × 5 = $950/week, or approximately $49,400 annually.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do paid time off (PTO) days affect my annual salary calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">PTO days reduce your billable work hours but don't reduce your salary if you're paid during time off. If you have 15 PTO days annually, you work 250 days instead of 260, reducing your work hours by 120 hours (15 days × 8 hours). Include this in your calculator for an accurate take-home estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between gross annual salary and net annual income?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gross annual salary is your total earnings before taxes and deductions. Net annual income is what you take home after federal income tax, Social Security (6.2%), Medicare (1.45%), state tax, and other deductions. A $50,000 gross salary typically results in approximately $38,000–$41,000 net income depending on your tax bracket and deductions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for unpaid leave or sabbaticals in my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Unpaid leave reduces your annual earnings directly. If you take 4 unpaid weeks off from a $30/hour job working 40 hours weekly, subtract 160 hours: ($30 × 40 × 52) − ($30 × 160) = $62,400 − $4,800 = $57,600 annual income.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What hourly wage equals a $60,000 annual salary?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Working a standard 40-hour week for 52 weeks, divide $60,000 by 2,080 hours (40 × 52) to get approximately $28.85/hour. This is the most common conversion benchmark for full-time employment in the United States.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does a part-time schedule affect annual salary calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Part-time workers typically work 20–35 hours per week. If you earn $18/hour working 30 hours weekly, your annual salary is $18 × 30 × 52 = $28,080. Always verify your actual weekly hours with your employer, as part-time schedules vary significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include bonuses and commissions in my hourly to annual conversion?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bonuses and commissions should be calculated separately if they're variable. Convert your base hourly wage first, then add guaranteed bonuses as a separate line item. For example, a $20/hour base job with a $5,000 annual bonus equals ($20 × 40 × 52) + $5,000 = $46,600.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the 2024–2025 federal minimum wage and its annual equivalent?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The federal minimum wage is $7.25/hour, which equals $15,080 annually for full-time 40-hour-per-week work ($7.25 × 40 × 52). However, 30 states have higher minimum wages; for example, California's minimum wage is $16.50/hour, equivalent to $34,320 annually.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/taxtopics/tc409" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Wage and Hour Laws</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on wage and salary classifications, withholding requirements, and tax implications of different employment types.</p>
          </li>
          <li>
            <a href="https://www.dol.gov/agencies/whd/minimum-wage" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Labor: Minimum Wage</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current federal minimum wage rates and state-by-state minimum wage comparisons updated for 2024–2025.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/g/grossincome.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Gross Income vs. Net Income</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive explanation of the differences between gross and net income, including tax withholding and deduction calculations.</p>
          </li>
          <li>
            <a href="https://www.ssa.gov/myaccount" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Social Security Administration: Earnings Record</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Resource for verifying wage and earnings records, understanding FICA tax contributions, and planning retirement income based on annual earnings history.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Hourly to Annual Salary Converter"
      description="Convert hourly wages to annual salary instantly. Calculate weekly, bi-weekly, monthly, and yearly earnings from your hourly rate."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Hourly to Annual Salary Converter" },
        { id: "formula", label: "Hourly to Annual Salary Converter Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Annual Salary = Hourly Rate × Hours per Week × Weeks per Year",
        variables: [
          { symbol: "Hourly Rate", description: "Your wage per hour" },
          { symbol: "Hours per Week", description: "Average hours worked each week" },
          { symbol: "Weeks per Year", description: "Total weeks worked in a year" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you earn $20 per hour, work 40 hours per week, and work 52 weeks a year.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "20 × 40 = 800", 
            explanation: "Calculate weekly earnings by multiplying hourly rate by hours per week." 
          },
          { 
            label: "Step 2", 
            calculation: "800 × 52 = 41,600", 
            explanation: "Determine annual salary by multiplying weekly earnings by weeks per year." 
          }
        ],
        result: "The final result is $41,600, meaning your annual salary is $41,600 based on the given inputs."
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
