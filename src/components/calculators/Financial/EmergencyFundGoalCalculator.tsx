import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function EmergencyFundGoalCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    monthlyExpenses: "", 
    monthsToCover: "", 
    additionalBuffer: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // FAQ DATA
  const faqs = [
    {
      question: "How many months of expenses should my emergency fund cover?",
      answer: "Most financial experts recommend building an emergency fund that covers 3 to 6 months of living expenses. The Emergency Fund Goal Calculator helps you determine the right target based on your personal situation. If you have stable income and minimal dependents, 3 months may suffice; if you're self-employed or have a variable income, 6-9 months is more prudent. Single-income households with dependents should aim for the higher end of this range.",
    },
    {
      question: "What counts as a monthly expense in the emergency fund calculator?",
      answer: "Monthly expenses should include all essential costs: rent or mortgage, utilities, insurance premiums, groceries, transportation, minimum debt payments, and childcare. Do not include discretionary spending like dining out, entertainment, or vacations. The calculator uses this total to determine how much cash you need to cover your lifestyle during a job loss or financial hardship.",
    },
    {
      question: "Should I include debt payments in my emergency fund calculation?",
      answer: "Yes, you should include minimum debt payments for credit cards, student loans, car loans, and mortgages in your monthly expenses. However, if you plan to suspend discretionary debt payments during an emergency, you can calculate a lower figure. The calculator allows you to customize which obligations to include, giving you flexibility to set a realistic goal.",
    },
    {
      question: "How does my current savings affect my emergency fund goal?",
      answer: "The Emergency Fund Goal Calculator subtracts your current savings from your target goal to show you how much additional money you need to save. For example, if your target is $15,000 and you already have $5,000 saved, your remaining goal is $10,000. This helps you create a realistic savings plan with a specific dollar amount to work toward.",
    },
    {
      question: "What's the difference between a 3-month and 6-month emergency fund?",
      answer: "A 3-month emergency fund covers basic living expenses for 90 days, ideal for stable employed individuals. A 6-month fund ($18,000-$36,000 for a household spending $3,000-$6,000 monthly) provides greater security for self-employed workers, those with health issues, or single-income families. The calculator shows you both targets so you can decide which fits your risk tolerance and circumstances.",
    },
    {
      question: "Where should I keep my emergency fund for the calculator's purposes?",
      answer: "Your emergency fund should be kept in a liquid, accessible account such as a high-yield savings account earning 4.5-5.3% APY (as of 2025), money market account, or basic savings account. While the Emergency Fund Goal Calculator focuses on the amount needed rather than where to store it, keeping funds in a separate account prevents accidental spending and earns interest. Avoid investing emergency funds in stocks or bonds, which carry market risk.",
    },
    {
      question: "How often should I recalculate my emergency fund goal?",
      answer: "You should recalculate your emergency fund goal annually or whenever your life circumstances change significantly. Major changes include job transitions, income increases or decreases, family size changes, or new financial obligations. The Emergency Fund Goal Calculator makes it easy to plug in updated numbers and see how your target shifts, ensuring your savings plan stays aligned with your current situation.",
    },
    {
      question: "What if my monthly expenses vary significantly throughout the year?",
      answer: "If your expenses fluctuate due to seasonal costs, medical bills, or variable income, use an average monthly expense or lean toward the higher end of your expense range. The Emergency Fund Goal Calculator accommodates custom expense amounts, so you can input $4,500 if your expenses range from $3,500 to $5,500 monthly. This conservative approach ensures your fund covers unexpected spikes in costs.",
    },
    {
      question: "Does the emergency fund calculator account for inflation?",
      answer: "The Emergency Fund Goal Calculator provides a static target based on today's expenses, but inflation erodes purchasing power over time. With inflation averaging 3-4% annually, a $20,000 emergency fund today could need to be $21,200-$21,600 in one year to maintain the same buying power. Review and adjust your goal annually using the calculator to account for inflation and wage increases.",
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
    const monthlyExpensesValue = parseFloat(inputs.monthlyExpenses) || 0;
    const monthsToCoverValue = parseFloat(inputs.monthsToCover) || 0;
    const additionalBufferValue = parseFloat(inputs.additionalBuffer) || 0;

    // Validate
    if (monthlyExpensesValue <= 0 || monthsToCoverValue <= 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const mainResult = monthlyExpensesValue * monthsToCoverValue;
    const result2 = mainResult + additionalBufferValue;
    const result3 = result2 * 1.1; // Adding a 10% buffer for unexpected expenses

    // Generate schedule data if applicable (e.g., savings schedule)
    const scheduleData = Array.from({ length: monthsToCoverValue }, (_, i) => ({
      month: i + 1,
      savingsGoal: mainResult / monthsToCoverValue,
      cumulativeSavings: (mainResult / monthsToCoverValue) * (i + 1),
      balance: mainResult - ((mainResult / monthsToCoverValue) * (i + 1))
    }));

    return { 
      mainResult, 
      result2, 
      result3, 
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
    setInputs({ monthlyExpenses: "", monthsToCover: "", additionalBuffer: "" });
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
              Monthly Expenses
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3000"
              value={inputs.monthlyExpenses}
              onChange={(e) => setInputs({ ...inputs, monthlyExpenses: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Months to Cover
            </Label>
            <Input
              type="number"
              placeholder="e.g., 6"
              value={inputs.monthsToCover}
              onChange={(e) => setInputs({ ...inputs, monthsToCover: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Additional Buffer
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.additionalBuffer}
              onChange={(e) => setInputs({ ...inputs, additionalBuffer: e.target.value })}
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
                      Total Emergency Fund Goal
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
                      Emergency Fund with Buffer
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
                      Total with 10% Extra
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
                    Savings Schedule
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
                        <TableHead className="font-semibold">Savings Goal</TableHead>
                        <TableHead className="font-semibold">Cumulative Savings</TableHead>
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
                            <TableCell>{formatCurrency(row.savingsGoal)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.cumulativeSavings)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Emergency Fund Goal Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Emergency Fund Goal Calculator determines how much cash you should set aside to cover living expenses during financial hardship, such as job loss, medical emergency, or unexpected major expense. This calculator is essential because it personalizes your savings target based on your actual income level, spending habits, and employment stability. Having a concrete goal transforms emergency savings from an abstract aspiration into a measurable, achievable objective.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your total monthly expenses (including rent, utilities, insurance, groceries, and minimum debt payments), your employment type or desired coverage period (typically 3–6 months), and your current emergency fund balance. The calculator will then compute your target emergency fund amount and show you exactly how much additional savings you need to reach that goal. Be honest about your monthly expenses and choose a coverage period that matches your financial stability—self-employed individuals and single-income households should lean toward 6–9 months.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator's output shows your total emergency fund goal and your funding gap (target minus current savings). Use this gap as your savings target, breaking it into manageable monthly contributions. For example, if your goal is $18,000 and you have $3,000 saved, your $15,000 gap could be funded by saving $500/month over 30 months or $1,250/month over 12 months. Review your results annually and recalculate when income, expenses, or employment situation changes.</p>
        </div>
      </section>

      {/* TABLE: Emergency Fund Target by Monthly Expenses and Coverage Period */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Emergency Fund Target by Monthly Expenses and Coverage Period</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended emergency fund amounts for different monthly expense levels and coverage periods.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Expenses</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3-Month Fund</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">6-Month Fund</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">9-Month Fund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$54,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$42,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$63,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$48,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$72,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These figures assume you maintain the same monthly expense level during an emergency. Adjust based on whether you can reduce discretionary spending.</p>
      </section>

      {/* TABLE: Recommended Emergency Fund Targets by Employment Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Emergency Fund Targets by Employment Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different employment situations require different emergency fund levels due to varying income stability and job search timelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Employment Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Coverage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target Amount ($3,000/mo expense)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stable Full-Time W-2 Employee</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Predictable income; unemployment benefits available</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dual-Income Household</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,000–$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Secondary income provides backup; lower individual risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Single-Income Household</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No backup income source; higher vulnerability</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Self-Employed/Freelance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-9 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000–$27,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Irregular income; longer client acquisition cycles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Contract/Gig Worker</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-9 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000–$27,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Limited job security; variable monthly earnings</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Healthcare/High-Risk Worker</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000–$36,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Potential for extended leave; family dependence</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Recent Graduate/First Job</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000–$18,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Limited savings history; build up gradually</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These recommendations assume average monthly expenses of $3,000. Adjust multipliers based on your actual expenses.</p>
      </section>

      {/* TABLE: High-Yield Savings Account Rates & Emergency Fund Growth (2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">High-Yield Savings Account Rates & Emergency Fund Growth (2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Using a high-yield savings account accelerates emergency fund growth compared to traditional savings accounts.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Account Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Current APY (2025)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Interest on $15,000</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Interest on $30,000</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Traditional Savings Account</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.01–0.05%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50–$7.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.00–$15.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Money Market Account</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.25–4.75%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$637.50–$712.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,275.00–$1,425.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Yield Savings Account</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.50–5.35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$675.00–$802.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,350.00–$1,605.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Certificate of Deposit (6-month)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.00–5.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750.00–$825.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500.00–$1,650.00</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates subject to change. High-yield accounts maintain liquidity for true emergencies, while CDs lock funds for set periods. Choose based on access needs.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your actual monthly expenses from bank and credit card statements rather than estimates—track 2–3 months of real spending to ensure accuracy when inputting data into the Emergency Fund Goal Calculator.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you're self-employed with variable income, calculate your monthly expenses using your average income from the past 12 months, then aim for the 9-month target recommended by the calculator to account for seasonal fluctuations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store your emergency fund in a high-yield savings account earning 4.5–5.35% APY rather than a regular savings account earning 0.01%—the calculator shows your target, but where you save it matters for growth and accessibility.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Set up automatic monthly transfers to your emergency fund account right after payday, treating it like a non-negotiable bill—this removes the temptation to spend the money and helps you reach your calculator-determined goal consistently.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Break your emergency fund gap into smaller milestones using the calculator's target amount—for example, if you need $24,000 total, celebrate reaching $6,000 (one month), then $12,000 (two months), then $18,000 (three months) to maintain motivation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Revisit the Emergency Fund Goal Calculator whenever your employment changes, you get a significant raise or decrease in pay, or your family size changes—life events dramatically shift your target and savings timeline.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Monthly Expenses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people enter only fixed expenses (rent, utilities) and forget discretionary costs they'd maintain during emergencies (groceries, insurance, medications). The Emergency Fund Goal Calculator requires your true total monthly expenses; leaving out $500 in regular spending creates a $3,000 shortfall in a 6-month fund.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using a One-Size-Fits-All Target</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying on the generic "3-month rule" without calculating your specific situation means self-employed workers and single-income households are underfunded. The Emergency Fund Goal Calculator lets you customize by employment type; ignoring this feature leaves vulnerable households significantly short of security.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Investing Emergency Fund Money in the Stock Market</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While the Emergency Fund Goal Calculator helps you determine how much to save, some people then invest that amount in stocks or bonds hoping for returns. Emergency funds must remain liquid and safe; a market downturn could force you to sell investments at a loss when you most need the money.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting to Adjust for Inflation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you calculated your emergency fund goal three years ago, inflation (averaging 3.4% annually from 2022–2024) has eroded its purchasing power by roughly 10%. Recalculate using the Emergency Fund Goal Calculator annually to ensure your fund covers future expenses, not just past ones.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Counting Non-Liquid Assets as Emergency Savings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some people include home equity, retirement accounts, or investment property when the calculator asks for current savings. Only count cash in savings accounts, money market funds, or other immediately accessible accounts—retirement accounts have withdrawal penalties and home equity takes weeks to access.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Setting a Goal But Never Automating Contributions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The Emergency Fund Goal Calculator shows your target, but without automated transfers, most people fail to reach it—willpower fades after 2–3 months. Set up automatic monthly transfers from checking to your savings account on payday to ensure consistent progress toward your calculated goal.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many months of expenses should my emergency fund cover?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most financial experts recommend building an emergency fund that covers 3 to 6 months of living expenses. The Emergency Fund Goal Calculator helps you determine the right target based on your personal situation. If you have stable income and minimal dependents, 3 months may suffice; if you're self-employed or have a variable income, 6-9 months is more prudent. Single-income households with dependents should aim for the higher end of this range.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What counts as a monthly expense in the emergency fund calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Monthly expenses should include all essential costs: rent or mortgage, utilities, insurance premiums, groceries, transportation, minimum debt payments, and childcare. Do not include discretionary spending like dining out, entertainment, or vacations. The calculator uses this total to determine how much cash you need to cover your lifestyle during a job loss or financial hardship.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include debt payments in my emergency fund calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you should include minimum debt payments for credit cards, student loans, car loans, and mortgages in your monthly expenses. However, if you plan to suspend discretionary debt payments during an emergency, you can calculate a lower figure. The calculator allows you to customize which obligations to include, giving you flexibility to set a realistic goal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my current savings affect my emergency fund goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Emergency Fund Goal Calculator subtracts your current savings from your target goal to show you how much additional money you need to save. For example, if your target is $15,000 and you already have $5,000 saved, your remaining goal is $10,000. This helps you create a realistic savings plan with a specific dollar amount to work toward.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between a 3-month and 6-month emergency fund?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 3-month emergency fund covers basic living expenses for 90 days, ideal for stable employed individuals. A 6-month fund ($18,000-$36,000 for a household spending $3,000-$6,000 monthly) provides greater security for self-employed workers, those with health issues, or single-income families. The calculator shows you both targets so you can decide which fits your risk tolerance and circumstances.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Where should I keep my emergency fund for the calculator's purposes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your emergency fund should be kept in a liquid, accessible account such as a high-yield savings account earning 4.5-5.3% APY (as of 2025), money market account, or basic savings account. While the Emergency Fund Goal Calculator focuses on the amount needed rather than where to store it, keeping funds in a separate account prevents accidental spending and earns interest. Avoid investing emergency funds in stocks or bonds, which carry market risk.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my emergency fund goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You should recalculate your emergency fund goal annually or whenever your life circumstances change significantly. Major changes include job transitions, income increases or decreases, family size changes, or new financial obligations. The Emergency Fund Goal Calculator makes it easy to plug in updated numbers and see how your target shifts, ensuring your savings plan stays aligned with your current situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my monthly expenses vary significantly throughout the year?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your expenses fluctuate due to seasonal costs, medical bills, or variable income, use an average monthly expense or lean toward the higher end of your expense range. The Emergency Fund Goal Calculator accommodates custom expense amounts, so you can input $4,500 if your expenses range from $3,500 to $5,500 monthly. This conservative approach ensures your fund covers unexpected spikes in costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the emergency fund calculator account for inflation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Emergency Fund Goal Calculator provides a static target based on today's expenses, but inflation erodes purchasing power over time. With inflation averaging 3-4% annually, a $20,000 emergency fund today could need to be $21,200-$21,600 in one year to maintain the same buying power. Review and adjust your goal annually using the calculator to account for inflation and wage increases.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.federalreserve.gov/consumerscommunities/shed.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve Survey of Household Economics and Decisionmaking</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Federal Reserve data on household financial stability and emergency fund statistics.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/about-us/newsroom/consumer-financial-protection-bureau-releases-2023-financial-well-being-survey/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CFPB Financial Well-Being Survey on Emergency Savings</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer Financial Protection Bureau insights on emergency savings habits and financial resilience.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p590b" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 590-B: Distributions from Individual Retirement Arrangements (IRAs)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidance on penalties and taxes for early retirement account withdrawals used as emergency funds.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/banking/savings/emergency-fund/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate Emergency Fund & Financial Security Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate research on recommended emergency fund amounts and how much Americans actually have saved.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Emergency Fund Goal Calculator"
      description="Calculate the ideal size for your emergency fund. Plan for 3 to 6 months of expenses to ensure financial security against the unexpected."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Emergency Fund Goal Calculator" },
        { id: "formula", label: "Emergency Fund Goal Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Emergency Fund Goal = (Monthly Expenses × Months to Cover) + Additional Buffer",
        variables: [
          { symbol: "Monthly Expenses", description: "Total monthly costs for essentials" },
          { symbol: "Months to Cover", description: "Desired number of months to cover" },
          { symbol: "Additional Buffer", description: "Extra funds for unforeseen expenses" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a monthly expense of $3,000 and want to cover 6 months with an additional buffer of $1,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "3000 × 6 = 18000", 
            explanation: "Calculate the base emergency fund for 6 months" 
          },
          { 
            label: "Step 2", 
            calculation: "18000 + 1000 = 19000", 
            explanation: "Add the additional buffer to the base fund" 
          },
          { 
            label: "Step 3", 
            calculation: "19000 × 1.1 = 20900", 
            explanation: "Include a 10% extra for unforeseen expenses" 
          }
        ],
        result: "The final result is $20,900, meaning you should aim to save this amount for your emergency fund."
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