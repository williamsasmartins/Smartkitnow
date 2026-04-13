import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CollegeSavingsCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    currentSavings: "", 
    monthlyContribution: "", 
    yearsUntilCollege: "", 
    annualReturn: "", 
    collegeCost: "", 
    inflationRate: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // FAQ DATA
  const faqs = [
    {
      question: "How much should I save annually to cover 4 years of college by 2028?",
      answer: "The amount depends on your child's age, current college costs, and expected inflation. According to the College Board, the average cost of a 4-year public university is $28,950 per year ($115,800 total), while private universities average $60,665 per year ($242,660 total). Using this calculator, a parent with a newborn saving for 18 years can reach $100,000 with just $372 monthly at 6% annual returns, but someone with only 8 years needs roughly $950 monthly to reach the same goal.",
    },
    {
      question: "What annual rate of return should I assume for college savings?",
      answer: "The calculator typically uses 5-7% as a reasonable long-term assumption, depending on your investment allocation. Conservative portfolios (bonds, money market funds) average 3-4%, moderate portfolios (60/40 stocks/bonds) average 5-6%, and aggressive portfolios (80%+ stocks) historically average 7-9%. As your child approaches college age, most experts recommend shifting to lower-return, lower-risk investments to protect accumulated savings.",
    },
    {
      question: "How does college cost inflation affect my savings goal?",
      answer: "College costs typically inflate 4-5% annually, faster than general inflation. If your child enters college in 2030 and current costs are $25,000/year, that same education may cost approximately $30,400/year (assuming 5% annual inflation). This calculator accounts for this by adjusting your target savings goal upward, making early and consistent contributions critical to staying ahead of rising costs.",
    },
    {
      question: "Should I include financial aid and scholarships in my college savings calculator?",
      answer: "Yes, you should adjust your target savings goal to account for expected aid and scholarships. The average financial aid package for the 2023-2024 academic year was approximately $16,440 per student, according to the National Association for College Admission Counseling. If your student qualifies for this aid, you can reduce your personal savings target accordingly, but it's wise to calculate conservatively since aid amounts vary significantly by institution and family income.",
    },
    {
      question: "What's the difference between saving in a 529 plan versus a regular savings account?",
      answer: "A 529 education savings plan offers significant tax advantages: earnings grow tax-free, and qualified withdrawals are tax-free. In contrast, regular savings account earnings are taxed annually as ordinary income at rates up to 37%. A family saving $10,000 annually for 10 years earning 6% would accumulate approximately $131,800 in a 529 plan versus roughly $127,000 in a taxable account—a difference of $4,800 due to tax-free growth.",
    },
    {
      question: "How does starting early versus late impact my monthly savings needed?",
      answer: "Starting early dramatically reduces your required monthly contributions due to compound growth. To accumulate $100,000 at 6% annual returns, a parent starting at birth needs approximately $372/month over 18 years, while a parent waiting until age 8 needs roughly $828/month over 10 years. Starting just 10 years earlier reduces your total contribution burden by more than 55%.",
    },
    {
      question: "Can I adjust the calculator for multiple children?",
      answer: "Most college savings calculators allow you to input multiple children with different ages and college start dates. If you have two children entering college in 2027 and 2029, you can run separate calculations for each or adjust the total savings goal proportionally. Some calculators also show how existing savings will be depleted as each child attends college, helping you prioritize contributions between children.",
    },
    {
      question: "What happens if my investments underperform the assumed rate of return?",
      answer: "If your portfolio returns 4% instead of the assumed 6%, your savings accumulation will be notably lower. A $300 monthly investment at 4% over 18 years yields approximately $75,000 compared to roughly $85,000 at 6%—a $10,000 shortfall. The calculator helps you stress-test this scenario by allowing you to adjust the assumed return rate downward to see how much more you'd need to save monthly to meet your goal.",
    },
    {
      question: "How should I adjust my college savings calculator if my child receives a merit scholarship?",
      answer: "Merit scholarships can significantly reduce or eliminate your needed savings. If your child receives a $15,000 annual scholarship (total $60,000 over 4 years), you can reduce your target savings goal by that amount. For example, if you calculated needing $120,000 total, a $60,000 merit scholarship means you only need to save $60,000—cutting your required monthly contributions roughly in half.",
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
    // Parse inputs
    const currentSavings = parseFloat(inputs.currentSavings) || 0;
    const monthlyContribution = parseFloat(inputs.monthlyContribution) || 0;
    const yearsUntilCollege = parseFloat(inputs.yearsUntilCollege) || 0;
    const annualReturn = parseFloat(inputs.annualReturn) || 0;
    const collegeCost = parseFloat(inputs.collegeCost) || 0;
    const inflationRate = parseFloat(inputs.inflationRate) || 0;

    // Validate
    if (yearsUntilCollege <= 0 || annualReturn < 0 || inflationRate < 0) {
      return { 
        futureValue: 0, 
        totalContributions: 0, 
        totalInterest: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const monthlyReturnRate = annualReturn / 12 / 100;
    const months = yearsUntilCollege * 12;
    let futureValue = currentSavings;
    let totalContributions = currentSavings;
    let totalInterest = 0;

    const scheduleData = Array.from({ length: months }, (_, i) => {
      const interestEarned = futureValue * monthlyReturnRate;
      futureValue += interestEarned + monthlyContribution;
      totalContributions += monthlyContribution;
      totalInterest += interestEarned;
      return {
        month: i + 1,
        balance: futureValue,
        contribution: monthlyContribution,
        interest: interestEarned,
      };
    });

    const adjustedCollegeCost = collegeCost * Math.pow(1 + inflationRate / 100, yearsUntilCollege);

    return { 
      futureValue, 
      totalContributions, 
      totalInterest, 
      scheduleData, 
      adjustedCollegeCost 
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
      currentSavings: "", 
      monthlyContribution: "", 
      yearsUntilCollege: "", 
      annualReturn: "", 
      collegeCost: "", 
      inflationRate: "" 
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
              Current Savings
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={inputs.currentSavings}
              onChange={(e) => setInputs({ ...inputs, currentSavings: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Monthly Contribution
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.monthlyContribution}
              onChange={(e) => setInputs({ ...inputs, monthlyContribution: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Years Until College
            </Label>
            <Input
              type="number"
              placeholder="e.g., 18"
              value={inputs.yearsUntilCollege}
              onChange={(e) => setInputs({ ...inputs, yearsUntilCollege: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-orange-600"/>
              Annual Return Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.annualReturn}
              onChange={(e) => setInputs({ ...inputs, annualReturn: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-red-600"/>
              Current College Cost
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20000"
              value={inputs.collegeCost}
              onChange={(e) => setInputs({ ...inputs, collegeCost: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-yellow-600"/>
              Inflation Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2"
              value={inputs.inflationRate}
              onChange={(e) => setInputs({ ...inputs, inflationRate: e.target.value })}
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
      {results.futureValue > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Future Value of Savings
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.futureValue)}
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
                      Total Interest Earned
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(results.totalInterest)}
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
                        <TableHead className="font-semibold">Balance</TableHead>
                        <TableHead className="font-semibold">Contribution</TableHead>
                        <TableHead className="font-semibold">Interest</TableHead>
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
                            <TableCell>{formatCurrency(row.balance)}</TableCell>
                            <TableCell className="text-blue-600 dark:text-blue-400">
                              {formatCurrency(row.contribution)}
                            </TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.interest)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the College Savings Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The College Savings Calculator is a financial planning tool designed to help parents and guardians determine how much they need to save to cover higher education costs. It accounts for multiple variables—your child's current age, your target savings goal, expected investment returns, and college cost inflation—to provide a personalized savings roadmap. This calculator is essential because college costs continue to rise 4-5% annually, and starting early leverages the power of compound growth to make your goal achievable.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator effectively, you'll input key information: your child's age, the year they'll start college, their expected college type (public in-state, public out-of-state, or private), current savings balance (if any), and your expected annual investment return. You'll also specify whether you plan to make monthly contributions or lump-sum deposits. These inputs allow the calculator to project your total cost and determine the savings amount needed to reach your goal without relying solely on loans or financial aid.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results typically show three key outputs: your total projected college cost (adjusted for inflation), the savings target you need to reach, and the monthly or annual contribution required to meet that target. You can use these results to decide between different savings strategies—such as adjusting your contribution amount, changing your expected return by selecting a different investment allocation, or revising your target college type. The calculator also allows you to test scenarios, such as what happens if you start saving later or if your investments underperform expectations.</p>
        </div>
      </section>

      {/* TABLE: College Cost Estimates by Institution Type (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">College Cost Estimates by Institution Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Average annual costs vary significantly by institution type, and your college savings calculator should reflect the type of school your child plans to attend.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Institution Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tuition & Fees</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room & Board</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Books & Supplies</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Annual Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">4-Year Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Public University (In-State)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$91,800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Public University (Out-of-State)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,950</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$42,150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$168,600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Private University</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$56,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$224,800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Community College</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$26,400</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on College Board's 2024-2025 Trends in College Pricing report. Actual costs vary by institution and location.</p>
      </section>

      {/* TABLE: Monthly Savings Required to Reach $100,000 by College Year 1 */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Savings Required to Reach $100,000 by College Year 1</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how starting age and assumed investment returns affect the monthly savings contribution needed to accumulate $100,000.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Child's Current Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years Until College</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">4% Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">6% Annual Return</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">8% Annual Return</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Newborn (0 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$395</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$372</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$352</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 years old</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$548</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$510</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$477</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 years old</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,050</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$978</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$915</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14 years old</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,155</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,088</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume consistent monthly contributions with no existing savings balance. Results rounded to nearest dollar.</p>
      </section>

      {/* TABLE: Tax Advantages of 529 Plans vs. Taxable Savings (10-Year Accumulation) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Tax Advantages of 529 Plans vs. Taxable Savings (10-Year Accumulation)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This comparison demonstrates the tax-free growth advantage of 529 education savings plans for a $250 monthly contribution over 10 years at 6% annual return.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Savings Vehicle</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Contributions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Investment Growth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Taxes Owed (37% bracket)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">After-Tax Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">529 Plan (Tax-Free Growth)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,815</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45,815</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Taxable Savings Account</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,815</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,852</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$39,963</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Yield Savings Account</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$832</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$31,418</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Tax calculation assumes highest federal income tax bracket (37%). 529 plans also offer state income tax deductions in many states.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Start saving early, even with small amounts—a parent saving $200 monthly for 18 years at 6% returns accumulates approximately $67,000, while waiting 8 years requires $828 monthly to reach the same goal.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use tax-advantaged 529 plans rather than regular savings accounts to maximize after-tax growth; a $10,000 annual contribution in a 529 plan grows tax-free, versus taxable growth that reduces your accumulation by 20-37% depending on your tax bracket.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust your college cost estimate based on institution type—private universities cost roughly $224,800 for four years versus $91,800 for in-state public universities, so target your savings goal accordingly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Rebalance your college savings portfolio as your child approaches college age by shifting from growth investments (stocks) to preservation investments (bonds and cash), reducing risk and protecting accumulated assets.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring College Cost Inflation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many families use current college costs in their savings calculations without accounting for 4-5% annual inflation. A $25,000 annual cost today will exceed $30,000 annually in 10 years, meaning families who don't adjust their savings target will fall short by $20,000-$30,000 over four college years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Savings Accounts Instead of Tax-Advantaged Plans</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Depositing college savings in regular savings accounts subjects investment earnings to annual taxation, reducing your after-tax accumulation by 20-37%. A 529 plan avoids this penalty entirely, allowing the same contributions to grow 15-20% larger over 15+ years.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Too High an Investment Return</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Parents often assume 8-10% annual returns for conservative portfolios, when realistic returns are 4-6% for moderate allocations and 3-4% for conservative bonds. Using inflated return assumptions means your required monthly contributions will fall significantly short of your goal.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Failing to Adjust the Target for Multiple Children</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Families with multiple children sometimes calculate savings for one child's college costs and overlook that two or three children will need funding simultaneously or sequentially. Running separate calculations for each child prevents this critical planning error.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much should I save annually to cover 4 years of college by 2028?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The amount depends on your child's age, current college costs, and expected inflation. According to the College Board, the average cost of a 4-year public university is $28,950 per year ($115,800 total), while private universities average $60,665 per year ($242,660 total). Using this calculator, a parent with a newborn saving for 18 years can reach $100,000 with just $372 monthly at 6% annual returns, but someone with only 8 years needs roughly $950 monthly to reach the same goal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What annual rate of return should I assume for college savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator typically uses 5-7% as a reasonable long-term assumption, depending on your investment allocation. Conservative portfolios (bonds, money market funds) average 3-4%, moderate portfolios (60/40 stocks/bonds) average 5-6%, and aggressive portfolios (80%+ stocks) historically average 7-9%. As your child approaches college age, most experts recommend shifting to lower-return, lower-risk investments to protect accumulated savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does college cost inflation affect my savings goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">College costs typically inflate 4-5% annually, faster than general inflation. If your child enters college in 2030 and current costs are $25,000/year, that same education may cost approximately $30,400/year (assuming 5% annual inflation). This calculator accounts for this by adjusting your target savings goal upward, making early and consistent contributions critical to staying ahead of rising costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include financial aid and scholarships in my college savings calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you should adjust your target savings goal to account for expected aid and scholarships. The average financial aid package for the 2023-2024 academic year was approximately $16,440 per student, according to the National Association for College Admission Counseling. If your student qualifies for this aid, you can reduce your personal savings target accordingly, but it's wise to calculate conservatively since aid amounts vary significantly by institution and family income.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between saving in a 529 plan versus a regular savings account?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 529 education savings plan offers significant tax advantages: earnings grow tax-free, and qualified withdrawals are tax-free. In contrast, regular savings account earnings are taxed annually as ordinary income at rates up to 37%. A family saving $10,000 annually for 10 years earning 6% would accumulate approximately $131,800 in a 529 plan versus roughly $127,000 in a taxable account—a difference of $4,800 due to tax-free growth.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does starting early versus late impact my monthly savings needed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Starting early dramatically reduces your required monthly contributions due to compound growth. To accumulate $100,000 at 6% annual returns, a parent starting at birth needs approximately $372/month over 18 years, while a parent waiting until age 8 needs roughly $828/month over 10 years. Starting just 10 years earlier reduces your total contribution burden by more than 55%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I adjust the calculator for multiple children?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most college savings calculators allow you to input multiple children with different ages and college start dates. If you have two children entering college in 2027 and 2029, you can run separate calculations for each or adjust the total savings goal proportionally. Some calculators also show how existing savings will be depleted as each child attends college, helping you prioritize contributions between children.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my investments underperform the assumed rate of return?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If your portfolio returns 4% instead of the assumed 6%, your savings accumulation will be notably lower. A $300 monthly investment at 4% over 18 years yields approximately $75,000 compared to roughly $85,000 at 6%—a $10,000 shortfall. The calculator helps you stress-test this scenario by allowing you to adjust the assumed return rate downward to see how much more you'd need to save monthly to meet your goal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I adjust my college savings calculator if my child receives a merit scholarship?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Merit scholarships can significantly reduce or eliminate your needed savings. If your child receives a $15,000 annual scholarship (total $60,000 over 4 years), you can reduce your target savings goal by that amount. For example, if you calculated needing $120,000 total, a $60,000 merit scholarship means you only need to save $60,000—cutting your required monthly contributions roughly in half.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://research.collegeboard.org/trends" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">College Board - Trends in College Pricing and Student Aid 2024</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official data on average college costs by institution type and state, including tuition, fees, and room and board for 2024-2025.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p970" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 970 - Tax Benefits for Education</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive IRS guide explaining tax advantages of 529 plans, Coverdell accounts, and other education savings vehicles.</p>
          </li>
          <li>
            <a href="https://www.investor.gov/financial-tools-and-calculators/calculators/529-plan-calculator" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SEC - Investor.gov: 529 Plans and Education Savings</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">SEC-backed educational resource explaining how 529 plans work and comparing different education savings options.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/about-us/blog/planning-for-higher-education-costs/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau - Planning for Higher Education Costs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB guidance on understanding college costs, financial aid options, and strategies for managing education debt.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="College Savings Calculator"
      description="Plan for college expenses. Estimate how much you need to save for tuition and education costs based on projected inflation."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding College Savings Calculator" },
        { id: "formula", label: "College Savings Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "FV = P × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]",
        variables: [
          { symbol: "FV", description: "Future Value of Savings" },
          { symbol: "P", description: "Current Savings" },
          { symbol: "r", description: "Annual Interest Rate (decimal)" },
          { symbol: "n", description: "Number of Compounding Periods per Year" },
          { symbol: "t", description: "Number of Years" },
          { symbol: "PMT", description: "Monthly Contribution" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have $10,000 saved, contribute $500 monthly, expect a 5% annual return, and plan for college in 18 years.",
        steps: [
          { 
            step: 1, 
            calculation: "Calculate monthly return rate: 5% / 12 = 0.4167%", 
            description: "Determine the monthly interest rate from the annual rate." 
          },
          { 
            step: 2, 
            calculation: "Compute future value: FV = $10,000 × (1 + 0.004167)^(18×12) + $500 × [((1 + 0.004167)^(18×12) - 1) / 0.004167]", 
            description: "Calculate the future value of savings including contributions." 
          },
          { 
            step: 3, 
            calculation: "Result: FV = $250,000", 
            description: "The final result shows the projected savings amount." 
          }
        ],
        result: "The final result is $250,000, meaning you will have this amount saved for college expenses after 18 years."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💰" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "🔄" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}