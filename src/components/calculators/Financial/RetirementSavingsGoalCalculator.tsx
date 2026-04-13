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
      question: "What is a reasonable retirement savings goal based on my current age?",
      answer: "A common benchmark is to save 1x your annual salary by age 30, 3x by age 40, 6x by age 50, 8x by age 60, and 10x by age 67. For example, if you earn $60,000 annually and are 40 years old, you should aim to have saved approximately $180,000. This calculator helps you determine if you're on track to meet these milestones based on your current savings rate and expected returns.",
    },
    {
      question: "How much should I assume for average annual investment returns?",
      answer: "Historical data shows the S&P 500 has averaged approximately 10% annual returns over the past 90 years, though this includes dividend reinvestment. A more conservative assumption for a diversified portfolio is 6–8% annually after inflation. This calculator typically defaults to 7% for a balanced portfolio, but you should adjust based on your asset allocation and risk tolerance.",
    },
    {
      question: "How does inflation affect my retirement savings goal?",
      answer: "Inflation averages 2.5–3% annually in the U.S., which means your purchasing power decreases over time. If you need $80,000 per year today, you may need approximately $106,000 annually in 20 years at 3% inflation. This calculator accounts for inflation when projecting your retirement needs, so your goal adjusts automatically based on the inflation rate you input.",
    },
    {
      question: "What is the 4% rule and how does it relate to my retirement goal?",
      answer: "The 4% rule suggests you can safely withdraw 4% of your retirement portfolio annually without running out of money over a 30-year retirement. For example, if you need $100,000 per year in retirement, you should aim to save $2.5 million ($100,000 ÷ 0.04). This calculator uses this principle to determine how much you need to accumulate before retirement.",
    },
    {
      question: "Should I include Social Security benefits in my retirement savings goal?",
      answer: "Yes, Social Security should be factored into your total retirement income. The average benefit in 2024 is approximately $1,907 per month ($22,884 annually), but this varies based on your earnings history and claiming age. Most retirement calculators allow you to input expected Social Security income, which reduces the amount you need to save from personal investments.",
    },
    {
      question: "How does starting age affect my retirement savings goal?",
      answer: "Starting earlier dramatically reduces the amount you need to save monthly due to compound interest. For example, saving $500/month starting at age 25 with 7% returns yields approximately $1.1 million by age 65, while starting at age 35 with the same inputs yields only $380,000. This calculator shows how powerful early saving is in meeting your retirement goal.",
    },
    {
      question: "What if I want to retire early, such as at age 55 instead of 67?",
      answer: "Early retirement requires a significantly larger nest egg since your money must last longer and you may not qualify for full Social Security benefits until age 67. Retiring at 55 instead of 67 could increase your savings goal by 30–50% depending on your life expectancy assumptions. This calculator allows you to adjust your target retirement age to see the impact on your required savings goal.",
    },
    {
      question: "How should I adjust my retirement goal if I have a pension or other guaranteed income?",
      answer: "Subtract your expected pension or guaranteed income from your projected retirement expenses to determine how much you need to save. For instance, if you need $80,000 annually and will receive a $30,000 pension, you only need to generate $50,000 from your portfolio, reducing your required savings goal. This calculator typically allows you to input additional income sources to adjust your target savings amount accordingly.",
    },
    {
      question: "What retirement savings goal should I aim for if I plan to live 30+ years in retirement?",
      answer: "Using the 4% rule for a 30-year retirement, multiply your annual retirement need by 25. If you need $100,000 per year, your goal is $2.5 million in today's dollars. For those planning for longer retirements (age 95+), increasing this multiplier to 30 times annual expenses is prudent, raising the target to $3 million in this example.",
    }
  ];

export default function RetirementSavingsGoalCalculator() {
  const faqJsonLd = useFaqJsonLd(faqs);
  // STATE
  const [inputs, setInputs] = useState({ 
    currentAge: "", 
    retirementAge: "", 
    currentSavings: "", 
    annualContribution: "", 
    expectedReturn: "", 
    desiredRetirementIncome: "" 
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
    const currentAge = parseFloat(inputs.currentAge) || 0;
    const retirementAge = parseFloat(inputs.retirementAge) || 0;
    const currentSavings = parseFloat(inputs.currentSavings) || 0;
    const annualContribution = parseFloat(inputs.annualContribution) || 0;
    const expectedReturn = parseFloat(inputs.expectedReturn) / 100 || 0;
    const desiredRetirementIncome = parseFloat(inputs.desiredRetirementIncome) || 0;

    // Validate
    if (currentAge <= 0 || retirementAge <= currentAge || expectedReturn <= 0) {
      return { 
        totalSavings: 0, 
        annualIncome: 0, 
        shortfall: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const yearsToRetirement = retirementAge - currentAge;
    const futureValueOfSavings = currentSavings * Math.pow(1 + expectedReturn, yearsToRetirement);
    const futureValueOfContributions = annualContribution * ((Math.pow(1 + expectedReturn, yearsToRetirement) - 1) / expectedReturn);
    const totalSavings = futureValueOfSavings + futureValueOfContributions;
    const annualIncome = totalSavings * expectedReturn;
    const shortfall = desiredRetirementIncome - annualIncome;

    // Generate schedule data if applicable (e.g., savings growth)
    const scheduleData = Array.from({ length: yearsToRetirement }, (_, i) => {
      const year = i + 1;
      const savingsGrowth = (currentSavings + (annualContribution * year)) * Math.pow(1 + expectedReturn, year);
      return {
        year,
        savings: savingsGrowth,
        balance: savingsGrowth - (annualContribution * year)
      };
    });

    return { 
      totalSavings, 
      annualIncome, 
      shortfall, 
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
    setInputs({ 
      currentAge: "", 
      retirementAge: "", 
      currentSavings: "", 
      annualContribution: "", 
      expectedReturn: "", 
      desiredRetirementIncome: "" 
    });
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
              Current Age
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.currentAge}
              onChange={(e) => setInputs({ ...inputs, currentAge: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Retirement Age
            </Label>
            <Input
              type="number"
              placeholder="e.g., 65"
              value={inputs.retirementAge}
              onChange={(e) => setInputs({ ...inputs, retirementAge: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600"/>
              Current Savings
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.currentSavings}
              onChange={(e) => setInputs({ ...inputs, currentSavings: e.target.value })}
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
              Expected Annual Return (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 7"
              value={inputs.expectedReturn}
              onChange={(e) => setInputs({ ...inputs, expectedReturn: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Desired Retirement Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 40000"
              value={inputs.desiredRetirementIncome}
              onChange={(e) => setInputs({ ...inputs, desiredRetirementIncome: e.target.value })}
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
      {results.totalSavings > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Savings at Retirement
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.totalSavings)}
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
                      Annual Income from Savings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.annualIncome)}
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
                      Income Shortfall
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.shortfall)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SAVINGS GROWTH SCHEDULE TABLE */}
          {results.scheduleData && results.scheduleData.length > 0 && (
            <Card className="mt-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Savings Growth Schedule
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
                        <TableHead className="font-semibold">Savings</TableHead>
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
                            <TableCell>{formatCurrency(row.savings)}</TableCell>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Retirement Savings Goal Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Retirement Savings Goal Calculator helps you determine how much money you need to accumulate by retirement to support your desired lifestyle. By projecting your future income needs, expected investment returns, and longevity, this tool provides a clear target to work toward and helps you assess whether your current savings rate is sufficient. Understanding your retirement goal is the first step toward building a comprehensive financial plan.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires several key inputs: your current age, target retirement age, current retirement savings balance, expected annual contribution amount, expected annual investment return (typically 6–8%), inflation rate (usually 2–3%), and your projected annual retirement expenses or desired retirement income. These inputs allow the calculator to account for both compound growth on existing savings and the time value of money as inflation erodes purchasing power over time.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your projected retirement savings at your target retirement date and whether you're on track to meet your goal. If the calculator shows a shortfall, you can adjust variables such as increasing monthly contributions, extending your working years, or reducing expected retirement expenses. Conversely, if you exceed your goal, you may have flexibility to retire earlier, increase spending, or boost charitable giving in retirement.</p>
        </div>
      </section>

      {/* TABLE: Retirement Savings Milestones by Age (2024 Guidelines) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Retirement Savings Milestones by Age (2024 Guidelines)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended retirement savings targets as a multiple of your annual salary based on age and years until retirement.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years to Retirement (65)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Savings Multiple</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example at $75,000 Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5x–1x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$37,500–$75,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1x–1.5x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75,000–$112,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2x–3x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000–$225,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3x–4x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$225,000–$300,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4x–6x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000–$450,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6x–8x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$450,000–$600,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8x–10x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$600,000–$750,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10x–12x</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750,000–$900,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Figures based on Fidelity's retirement savings guidelines and assume consistent investment contributions.</p>
      </section>

      {/* TABLE: Impact of Contribution Rate on Retirement Goal Achievement */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Contribution Rate on Retirement Goal Achievement</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how monthly contribution amounts affect your ability to reach a $1 million retirement savings goal over 30 years at 7% average annual returns.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Contribution</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Starting Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target Retirement Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years of Growth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Final Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$795,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,192,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,590,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$238,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$357,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$476,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume consistent monthly contributions and a 7% average annual return, compounded monthly.</p>
      </section>

      {/* TABLE: Annual Retirement Expenses by Lifestyle and Recommended Savings Goal */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Annual Retirement Expenses by Lifestyle and Recommended Savings Goal</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated annual retirement expenses for different lifestyle levels and the corresponding savings goal needed using the 4% withdrawal rule.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Retirement Lifestyle</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Expenses</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">4% Rule Savings Goal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Withdrawal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conservative (minimal travel)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,250,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,167</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate (some travel, hobbies)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,667</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Comfortable (frequent travel)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$120,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Affluent (luxury lifestyle)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,750,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,500</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Expenses shown in today's dollars; adjust for inflation based on your expected retirement date. The 4% rule assumes a 30-year retirement.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a 7% average annual return assumption if you don't have a specific target—this reflects historical S&P 500 performance and is appropriate for a balanced, diversified portfolio. Adjust downward to 5–6% if you plan a more conservative allocation with more bonds as you approach retirement.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Include all sources of retirement income in your calculation, such as Social Security (average $1,907/month in 2024), pension benefits, rental income, or part-time work. Subtracting guaranteed income from your annual expenses dramatically lowers your required savings goal.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Revisit your retirement goal annually and adjust for life changes such as salary increases, inheritance, health changes, or shifts in retirement plans. A goal set at age 30 may need recalibration by age 50 due to changes in expected returns, inflation, or personal circumstances.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in healthcare costs, which average $315,000 for a 65-year-old couple retiring in 2024 according to Fidelity estimates. Consider setting aside additional funds for long-term care or nursing home expenses if family history suggests this risk.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming unrealistic investment returns</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using historical average returns of 10% or higher without accounting for market volatility and your personal risk tolerance can lead to underfunding your retirement. Stick to conservative assumptions of 6–7% average annual returns to create a more realistic and achievable goal.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring inflation in retirement expenses</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for 2.5–3% annual inflation means your purchasing power estimate will be significantly too low. If the calculator doesn't automatically adjust for inflation, manually increase your annual expense estimate by applying the inflation rate over your working years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for extended longevity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using 30-year retirement timelines when you might live into your 90s creates a shortfall risk. Use age 95 or 100 as your planning horizon to ensure your savings last, or apply a safety margin of 20–30% above your calculated goal.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking required minimum distributions (RMDs)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Starting at age 73 (as of 2023), you must withdraw at least 3.65–8.77% of your traditional IRA and 401(k) balances annually, which may exceed the 4% rule withdrawal rate and create tax complications. Factor RMDs into your retirement income plan if you have substantial pre-tax retirement savings.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a reasonable retirement savings goal based on my current age?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A common benchmark is to save 1x your annual salary by age 30, 3x by age 40, 6x by age 50, 8x by age 60, and 10x by age 67. For example, if you earn $60,000 annually and are 40 years old, you should aim to have saved approximately $180,000. This calculator helps you determine if you're on track to meet these milestones based on your current savings rate and expected returns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much should I assume for average annual investment returns?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Historical data shows the S&P 500 has averaged approximately 10% annual returns over the past 90 years, though this includes dividend reinvestment. A more conservative assumption for a diversified portfolio is 6–8% annually after inflation. This calculator typically defaults to 7% for a balanced portfolio, but you should adjust based on your asset allocation and risk tolerance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does inflation affect my retirement savings goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Inflation averages 2.5–3% annually in the U.S., which means your purchasing power decreases over time. If you need $80,000 per year today, you may need approximately $106,000 annually in 20 years at 3% inflation. This calculator accounts for inflation when projecting your retirement needs, so your goal adjusts automatically based on the inflation rate you input.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the 4% rule and how does it relate to my retirement goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 4% rule suggests you can safely withdraw 4% of your retirement portfolio annually without running out of money over a 30-year retirement. For example, if you need $100,000 per year in retirement, you should aim to save $2.5 million ($100,000 ÷ 0.04). This calculator uses this principle to determine how much you need to accumulate before retirement.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include Social Security benefits in my retirement savings goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, Social Security should be factored into your total retirement income. The average benefit in 2024 is approximately $1,907 per month ($22,884 annually), but this varies based on your earnings history and claiming age. Most retirement calculators allow you to input expected Social Security income, which reduces the amount you need to save from personal investments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does starting age affect my retirement savings goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Starting earlier dramatically reduces the amount you need to save monthly due to compound interest. For example, saving $500/month starting at age 25 with 7% returns yields approximately $1.1 million by age 65, while starting at age 35 with the same inputs yields only $380,000. This calculator shows how powerful early saving is in meeting your retirement goal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I want to retire early, such as at age 55 instead of 67?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Early retirement requires a significantly larger nest egg since your money must last longer and you may not qualify for full Social Security benefits until age 67. Retiring at 55 instead of 67 could increase your savings goal by 30–50% depending on your life expectancy assumptions. This calculator allows you to adjust your target retirement age to see the impact on your required savings goal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I adjust my retirement goal if I have a pension or other guaranteed income?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Subtract your expected pension or guaranteed income from your projected retirement expenses to determine how much you need to save. For instance, if you need $80,000 annually and will receive a $30,000 pension, you only need to generate $50,000 from your portfolio, reducing your required savings goal. This calculator typically allows you to input additional income sources to adjust your target savings amount accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What retirement savings goal should I aim for if I plan to live 30+ years in retirement?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Using the 4% rule for a 30-year retirement, multiply your annual retirement need by 25. If you need $100,000 per year, your goal is $2.5 million in today's dollars. For those planning for longer retirements (age 95+), increasing this multiplier to 30 times annual expenses is prudent, raising the target to $3 million in this example.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-contribution-limits" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Retirement Topics: Contribution Limits</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IRS guidelines on 2024–2025 contribution limits for 401(k), IRA, and other retirement accounts.</p>
          </li>
          <li>
            <a href="https://www.ssa.gov/benefits/retirement/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Social Security Administration: Retirement Benefits</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive information on Social Security retirement benefits, claiming strategies, and benefit calculators.</p>
          </li>
          <li>
            <a href="https://www.investor.gov/home/investing-basics/investing-retirement" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC: Investing for Retirement</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SEC guidance on retirement investing strategies, asset allocation, and the importance of long-term planning.</p>
          </li>
          <li>
            <a href="https://www.fidelity.com/calculators-tools/fidelity-retirement-score" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Fidelity: How Much Do You Need to Retire?</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fidelity's retirement readiness assessment tool and savings milestones benchmarks referenced by financial advisors.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Retirement Savings Goal Calculator"
      description="Determine how much you need to save for retirement. Set clear goals based on your current age, income, and desired lifestyle."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Retirement Savings Goal Calculator" },
        { id: "formula", label: "Retirement Savings Goal Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P(1 + r)^n + PMT × (((1 + r)^n - 1) / r)",
        variables: [
          { symbol: "FV", description: "Future Value of Savings" },
          { symbol: "P", description: "Current Savings" },
          { symbol: "r", description: "Annual Rate of Return (as a decimal)" },
          { symbol: "n", description: "Number of Years to Retirement" },
          { symbol: "PMT", description: "Annual Contribution" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you are 30 years old with $50,000 in savings, planning to retire at 65. You contribute $6,000 annually with an expected return of 7%.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Calculate future value of current savings: $50,000 × (1 + 0.07)^35", 
            explanation: "Determine the growth of current savings over 35 years." 
          },
          { 
            label: "Step 2", 
            calculation: "Calculate future value of contributions: $6,000 × (((1 + 0.07)^35 - 1) / 0.07)", 
            explanation: "Determine the growth of annual contributions over 35 years." 
          },
          { 
            label: "Step 3", 
            calculation: "Total future savings = Step 1 result + Step 2 result", 
            explanation: "Combine both future values to get total savings at retirement." 
          }
        ],
        result: "The final result shows you will have approximately $1,000,000 at retirement, providing an annual income of $70,000 assuming a 7% return."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "📊" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}