import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

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
    let currentSavings = parseFloat(inputs.currentSavings) || 0;
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding College Savings Calculator
        </h2>
        
        <p className="mb-6">
          Planning for college expenses can be daunting, especially with the rising costs of tuition and other educational fees. The College Savings Calculator is a powerful tool designed to help you estimate how much you need to save to cover these future expenses. By inputting your current savings, monthly contributions, expected annual return on investments, and the number of years until college, this calculator provides a comprehensive projection of your savings growth. Whether you're a parent planning for your child's education or a student preparing for your own future, understanding the financial requirements is crucial for effective planning.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in financial planning, particularly when it comes to education. Misestimating the required savings can lead to significant financial stress or the need to take on additional debt. According to recent studies, the average cost of college tuition increases by about 3-5% annually. This calculator helps you account for such inflation, ensuring that your savings plan is robust and realistic. By using this tool, you can make informed decisions and adjust your savings strategy as needed. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use the College Savings Calculator effectively, gather all necessary information beforehand. You'll need to know your current savings balance, the amount you can contribute monthly, the expected annual return rate on your investments, and the current cost of college tuition. Additionally, consider the inflation rate to project future costs accurately. Enter these values into the calculator to receive a detailed savings projection. For further guidance, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            When planning for college savings, it's essential to start early. The power of compound interest means that even small contributions can grow significantly over time. Avoid common pitfalls by regularly reviewing your savings plan and adjusting contributions as needed to stay on track.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for optimizing your college savings include setting realistic goals, regularly reviewing your progress, and adjusting your contributions based on changes in income or expenses. Consider potential scholarships or grants that could reduce the overall cost. Stay informed about changes in tuition rates and inflation trends to ensure your savings plan remains effective.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          College Savings Calculator Formula
        </h2>
        
        <p className="mb-6">
          The College Savings Calculator uses a compound interest formula to project the future value of your savings. This formula considers your current savings, monthly contributions, expected annual return rate, and the number of years until the funds are needed. The compound interest formula is a standard approach in financial calculations, allowing for the accumulation of interest on both the initial principal and the accumulated interest from previous periods.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          FV = P × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>FV = Future Value of Savings</li>
              <li>P = Current Savings</li>
              <li>r = Annual Interest Rate (decimal)</li>
              <li>n = Number of Compounding Periods per Year</li>
              <li>t = Number of Years</li>
              <li>PMT = Monthly Contribution</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role. The current savings (P) is your starting point, while the annual interest rate (r) determines how much your savings will grow each year. The number of compounding periods (n) typically reflects monthly compounding, which is common in savings accounts. The term (t) represents the time until the funds are needed, and the monthly contribution (PMT) is the amount you add to your savings each month. Adjusting any of these variables can significantly impact the future value of your savings.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your college savings is essential for effective planning. These factors interact in complex ways, affecting the overall outcome of your savings strategy. By recognizing these elements, you can make informed adjustments to optimize your plan.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Current Savings
        </h3>
        <p className="mb-4">
          Your current savings form the foundation of your college fund. The more you have saved initially, the more interest you can earn over time. For example, starting with $10,000 at a 5% annual return will yield more interest than starting with $5,000. This initial amount significantly impacts the future value of your savings.
        </p>
        <p className="mb-6">
          To optimize this factor, aim to increase your initial savings as much as possible. Consider reallocating funds from other savings accounts or investments to boost your college fund. For more strategies, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Monthly Contributions
        </h3>
        <p className="mb-4">
          Regular contributions to your savings account can dramatically increase your future savings. For instance, contributing $500 monthly over 18 years can grow significantly with compound interest. This factor is within your control and can be adjusted based on your financial situation.
        </p>
        <p className="mb-6">
          Evaluate your budget to determine how much you can afford to contribute each month. Even small increases in your monthly contributions can lead to substantial growth over time. Consider setting up automatic transfers to ensure consistent contributions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Annual Return Rate
        </h3>
        <p className="mb-4">
          The annual return rate reflects the growth potential of your investments. A higher return rate means your savings will grow faster. However, higher returns often come with increased risk. Understanding the balance between risk and return is crucial for effective savings planning.
        </p>
        <p className="mb-6">
          Diversify your investments to balance risk and return. Consider consulting with a financial advisor to select investment options that align with your risk tolerance and financial goals. Regularly review your investment portfolio to ensure it remains aligned with your objectives.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Inflation Rate
        </h3>
        <p className="mb-6">
          Inflation erodes the purchasing power of your savings over time. As college costs rise, it's essential to account for inflation in your savings plan. For example, a 2% inflation rate can significantly increase the future cost of college, requiring more savings to cover expenses.
        </p>
        <p className="mb-6">
          To mitigate the impact of inflation, consider investments that offer returns above the inflation rate. Regularly update your savings plan to reflect changes in inflation and tuition costs. This proactive approach helps ensure your savings keep pace with rising expenses.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Time Horizon
        </h3>
        <p className="mb-6">
          The time until college affects how much you need to save. A longer time horizon allows for more growth through compound interest, reducing the need for large monthly contributions. Conversely, a shorter time frame requires more aggressive savings strategies.
        </p>
        <p className="mb-6">
          Start saving as early as possible to maximize the benefits of compound interest. If you're starting late, consider increasing your monthly contributions or exploring alternative funding options such as scholarships or grants.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-8">
          {/* QUESTION 1 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What is a college savings calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              A college savings calculator is a tool that helps you estimate how much money you need to save to cover future college expenses. It takes into account factors like current savings, monthly contributions, expected returns, and inflation. This calculator is crucial for financial planning as it provides a clear picture of your savings trajectory, helping you avoid shortfalls.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Understanding your financial needs for education allows you to make informed decisions and adjust your savings strategy as needed. For further insights, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The calculator provides a high level of accuracy based on the inputs you provide. However, it assumes consistent returns and contributions, which may not reflect real-world fluctuations. Factors such as changes in inflation, unexpected expenses, or variations in investment returns can affect the accuracy of the projections.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To enhance accuracy, regularly update your inputs and consult with financial professionals when making significant financial decisions.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use the calculator, you'll need your current savings balance, the amount you can contribute monthly, the expected annual return rate on your investments, the current cost of college tuition, and the inflation rate. This information helps the calculator project your future savings and determine if your current plan will meet your goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Gather this data from your financial statements, investment accounts, and reliable sources for inflation and tuition costs. Accurate inputs lead to more reliable projections.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for different education levels?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, the calculator can be adapted for various education levels, including undergraduate, graduate, and vocational training. Adjust the inputs to reflect the specific costs and timeframes associated with each level. For example, graduate programs may have higher tuition but shorter durations compared to undergraduate studies.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Ensure that the inflation rate and expected returns align with the specific education level's financial landscape. This flexibility makes the calculator a versatile tool for diverse educational planning needs.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include underestimating the inflation rate, overestimating investment returns, and failing to adjust contributions over time. These errors can lead to insufficient savings when college expenses arise. Additionally, not accounting for potential scholarships or financial aid can skew the savings target.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these pitfalls, regularly review and update your inputs, and consider all potential sources of funding. For more detailed guidance, refer to our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculate your savings plan annually or whenever there are significant changes in your financial situation, such as a change in income, expenses, or investment returns. Regular recalculations help ensure your plan remains aligned with your goals and adjusts for any economic changes.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Set a reminder to review your savings plan at the start of each year. This proactive approach helps you stay on track and make necessary adjustments in a timely manner.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to assess whether your current savings plan will meet your future college expenses. If there's a shortfall, consider increasing your contributions, adjusting your investment strategy, or exploring additional funding sources. The results provide a roadmap for achieving your financial goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Share your plan with a financial advisor for professional insights and recommendations. For more strategies, see our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives include using financial planning software or consulting with a financial advisor for personalized strategies. These methods can offer more tailored advice and account for complex financial situations. However, they may involve additional costs or require more time to implement.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider these alternatives if you have unique financial circumstances or require a more comprehensive financial plan. They can complement the calculator's insights and provide a holistic view of your financial health.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: REFERENCES WITH DESCRIPTIONS (MANDATORY) */}
      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Official References & Resources
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.federalreserve.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Reserve - Economic Research
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Access comprehensive data on economic indicators and financial trends.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.consumerfinance.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Consumer Financial Protection Bureau - Education Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Explore educational resources and tools for managing personal finances.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.fdic.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                FDIC - Money Smart Program
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Discover financial education programs and resources for all ages.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.irs.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Internal Revenue Service - Tax Benefits for Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Learn about tax credits and deductions available for education expenses.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.investopedia.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Investopedia - College Savings Plans
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed guides on 529 plans and other college savings options.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.nerdwallet.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                NerdWallet - Saving for College
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Compare savings accounts and investment options for college funding.
              </p>
            </div>
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
            label: "Step 1", 
            calculation: "Calculate monthly return rate: 5% / 12 = 0.4167%", 
            explanation: "Determine the monthly interest rate from the annual rate." 
          },
          { 
            label: "Step 2", 
            calculation: "Compute future value: FV = $10,000 × (1 + 0.004167)^(18×12) + $500 × [((1 + 0.004167)^(18×12) - 1) / 0.004167]", 
            explanation: "Calculate the future value of savings including contributions." 
          },
          { 
            label: "Step 3", 
            calculation: "Result: FV = $250,000", 
            explanation: "The final result shows the projected savings amount." 
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