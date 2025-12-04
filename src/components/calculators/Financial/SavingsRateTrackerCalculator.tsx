import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function SavingsRateTrackerCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    income: "", 
    expenses: "", 
    savings: "" 
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
    let incomeValue = parseFloat(inputs.income) || 0;
    const expensesValue = parseFloat(inputs.expenses) || 0;
    const savingsValue = parseFloat(inputs.savings) || 0;

    // Validate
    if (incomeValue <= 0) {
      return { 
        savingsRate: 0, 
        totalSavings: 0, 
        totalExpenses: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const totalSavings = savingsValue;
    const totalExpenses = expensesValue;
    const savingsRate = (totalSavings / incomeValue) * 100;

    // Generate schedule data if applicable
    const scheduleData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      savings: totalSavings / 12,
      expenses: totalExpenses / 12,
      balance: incomeValue - ((totalSavings + totalExpenses) / 12) * (i + 1)
    }));

    return { 
      savingsRate, 
      totalSavings, 
      totalExpenses, 
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
    setInputs({ income: "", expenses: "", savings: "" });
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
              Monthly Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={inputs.income}
              onChange={(e) => setInputs({ ...inputs, income: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Monthly Expenses
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3000"
              value={inputs.expenses}
              onChange={(e) => setInputs({ ...inputs, expenses: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Monthly Savings
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={inputs.savings}
              onChange={(e) => setInputs({ ...inputs, savings: e.target.value })}
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
      {results.savingsRate > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Savings Rate
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.savingsRate.toFixed(2)}%
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
                      Total Savings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalSavings)}
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
                      Total Expenses
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalExpenses)}
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
                        <TableHead className="font-semibold">Savings</TableHead>
                        <TableHead className="font-semibold">Expenses</TableHead>
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
                            <TableCell>{formatCurrency(row.savings)}</TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.expenses)}
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Savings Rate Tracker
        </h2>
        
        <p className="mb-6">
          The Savings Rate Tracker is an essential tool for anyone looking to gain a clearer understanding of their financial health. By calculating the percentage of your income that is saved versus spent, you can make informed decisions about your financial future. This tool is particularly useful for individuals aiming to improve their savings habits, plan for retirement, or simply gain better control over their finances. Whether you're saving for a specific goal or just trying to build a safety net, knowing your savings rate is crucial.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in financial planning. A miscalculation could lead to overspending or under-saving, both of which can have significant long-term effects. For instance, underestimating your expenses might leave you without enough funds for emergencies, while overestimating your savings could result in missed investment opportunities. This calculator helps ensure that you have a realistic view of your financial situation, allowing you to make adjustments as needed. For more insights on financial planning, you might find our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> useful.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather all necessary information beforehand. You'll need your total monthly income, monthly expenses, and the amount you save each month. Enter these values into the respective fields to calculate your savings rate. This tool will provide you with a percentage that represents how much of your income is being saved. For additional guidance, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Regularly tracking your savings rate can help you identify spending patterns and areas where you can cut back. This insight is invaluable for setting realistic financial goals and ensuring long-term financial stability.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs to reflect changes in income or expenses. It's also beneficial to compare your current savings rate with past rates to track your progress over time. Keep in mind that factors such as unexpected expenses or income changes can affect your results.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Savings Rate Tracker Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Savings Rate Tracker is straightforward yet powerful. It calculates your savings rate by dividing your total savings by your total income, then multiplying by 100 to convert it into a percentage. This formula is widely accepted in financial planning due to its simplicity and effectiveness in providing a clear picture of one's financial health.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Savings Rate (%) = (Total Savings / Total Income) × 100
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Total Savings = Amount saved each month</li>
              <li>Total Income = Total monthly income</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in this formula plays a crucial role. Total Savings represents the amount you set aside each month, which directly impacts your financial security. Total Income is the sum of all earnings, which provides the context for your savings rate. A higher savings rate indicates a stronger financial position, while a lower rate may suggest the need for adjustments in spending or saving habits.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your savings rate is essential for accurate financial planning. These factors can vary widely and may interact with each other in complex ways, affecting your overall financial health.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Income Stability
        </h3>
        <p className="mb-4">
          Income stability is a critical factor in determining your savings rate. A steady income allows for consistent savings, while fluctuations can make it challenging to maintain a regular savings habit. For example, freelancers or those with variable income may find it harder to predict their savings rate accurately.
        </p>
        <p className="mb-6">
          To optimize this factor, consider setting a baseline savings amount that you can achieve even during low-income months. This approach ensures that you continue to save regardless of income fluctuations. For more strategies, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Expense Management
        </h3>
        <p className="mb-4">
          Effective expense management is crucial for maintaining a healthy savings rate. High expenses can significantly reduce the amount available for savings, impacting your financial goals. Tracking and categorizing expenses can help identify areas where you can cut back.
        </p>
        <p className="mb-6">
          Consider using budgeting tools to monitor your spending and adjust as necessary. Reducing discretionary spending can free up more funds for savings, enhancing your financial security.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Savings Goals
        </h3>
        <p className="mb-4">
          Having clear savings goals can motivate you to maintain or increase your savings rate. Whether saving for a vacation, a new home, or retirement, specific goals provide direction and purpose for your savings efforts.
        </p>
        <p className="mb-6">
          To manage this factor effectively, set realistic and achievable goals. Break larger goals into smaller, manageable milestones to track your progress and stay motivated.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Inflation and Economic Conditions
        </h3>
        <p className="mb-6">
          Inflation and economic conditions can affect your savings rate by influencing both income and expenses. Rising inflation may increase living costs, reducing the amount available for savings. Conversely, a strong economy might lead to higher income and increased savings potential.
        </p>
        <p className="mb-6">
          Staying informed about economic trends can help you anticipate changes and adjust your savings strategy accordingly. Consider consulting financial advisors for personalized advice.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Lifestyle Choices
        </h3>
        <p className="mb-6">
          Lifestyle choices, such as living arrangements and spending habits, can significantly impact your savings rate. Opting for a modest lifestyle can increase the amount available for savings, while extravagant spending may hinder your financial goals.
        </p>
        <p className="mb-6">
          Evaluate your lifestyle choices and consider adjustments that align with your financial objectives. Simple changes, like dining out less frequently or choosing more affordable housing, can make a substantial difference in your savings rate.
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
              What is savings rate tracker and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              A savings rate tracker is a tool that calculates the percentage of your income that you save. It is important because it provides insight into your financial habits and helps you understand how much of your income is being set aside for future needs. By knowing your savings rate, you can make informed decisions about spending, saving, and investing.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Understanding your savings rate is crucial for financial planning and achieving long-term goals. For more information, check out our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator is designed to provide accurate results based on the inputs you provide. However, its accuracy depends on the accuracy of the data entered. Factors such as unreported income or expenses can affect the results. It is recommended to use this calculator as a guide and consult a financial advisor for personalized advice.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For best results, ensure that all inputs are up-to-date and reflect your current financial situation.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you need to know your total monthly income, monthly expenses, and the amount you save each month. Income includes all sources such as salary, bonuses, and any additional earnings. Expenses cover all monthly outgoings like rent, utilities, groceries, and other bills. Savings refer to the amount you set aside each month for future use.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Gathering accurate data ensures that the calculator provides a reliable savings rate. Consider using financial statements or budgeting apps to track your finances.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for [specific scenario]?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator can be used for various scenarios, such as planning for retirement, saving for a large purchase, or simply understanding your current financial standing. However, it is important to consider any unique circumstances that may affect your savings rate, such as irregular income or unexpected expenses.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For specific scenarios, it may be beneficial to consult with a financial advisor who can provide tailored advice and strategies.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include underestimating expenses, overestimating income, and not accounting for irregular expenses. These errors can lead to an inaccurate savings rate, which may affect financial planning. It is important to be thorough and honest when entering data into the calculator.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, regularly review and update your financial information, and consider using budgeting tools to track your spending habits.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It is advisable to recalculate your savings rate whenever there are significant changes in your income or expenses. Regular recalculations, such as quarterly or bi-annually, can help you stay on track with your financial goals and make necessary adjustments.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Keeping your calculations up-to-date ensures that you have an accurate picture of your financial health and can make informed decisions.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to assess your current financial situation and make informed decisions about your spending and saving habits. A high savings rate indicates good financial health, while a low rate may suggest the need for adjustments. Consider setting new financial goals or revisiting existing ones based on your savings rate.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For further guidance, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a> to see how refinancing could impact your savings.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While the savings rate calculation is a straightforward method, there are alternative approaches such as zero-based budgeting or the 50/30/20 rule. Each method has its pros and cons, and the best choice depends on your personal financial situation and goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider experimenting with different methods to find the one that best suits your needs. Consulting with a financial advisor can also provide personalized recommendations.
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
                Official data on economic conditions and regulatory guidelines.
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
                Consumer Financial Protection Bureau - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources.
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
                FDIC - Banking Regulations
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information.
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
                Internal Revenue Service - Tax Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information.
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
                Investopedia - Financial Concepts
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained.
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
                NerdWallet - Personal Finance Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers.
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
      title="Savings Rate Tracker"
      description="Track your personal savings rate. Determine exactly what percentage of your income you are saving for the future versus spending."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Savings Rate Tracker" },
        { id: "formula", label: "Savings Rate Tracker Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Savings Rate (%) = (Total Savings / Total Income) × 100",
        variables: [
          { symbol: "Total Savings", description: "Amount saved each month" },
          { symbol: "Total Income", description: "Total monthly income" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a monthly income of $5,000, expenses of $3,000, and savings of $1,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Savings Rate = (1000 / 5000) × 100", 
            explanation: "Calculate the percentage of income saved." 
          },
          { 
            label: "Step 2", 
            calculation: "Savings Rate = 20%", 
            explanation: "The result shows that 20% of your income is saved." 
          }
        ],
        result: "The final result is 20%, meaning you save 20% of your income."
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