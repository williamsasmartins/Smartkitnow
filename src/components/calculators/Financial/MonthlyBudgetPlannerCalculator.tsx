import { useState, useMemo, useRef } from "react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function MonthlyBudgetPlannerCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    income: "", 
    expenses: "", 
    savingsGoal: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is Monthly Budget Planner Calculator and why is it important?",
      answer: "The Monthly Budget Planner Calculator is a financial tool designed to help individuals and families manage their finances by tracking income and expenses. It allows users to create a comprehensive budget, ensuring that spending aligns with financial goals. This calculator is important because it promotes financial discipline, helps identify areas for potential savings, and facilitates better financial decision-making. By providing a clear overview of financial health, it empowers users to take control of their money and plan for the future."
    },
    {
      question: "How accurate is this calculator?",
      answer: "The accuracy of the Monthly Budget Planner Calculator depends on the precision of the data entered. Users must provide accurate income and expense figures to obtain reliable results. While the calculator offers a detailed analysis, it is essential to regularly update the information to reflect changes in financial circumstances. For complex financial situations, consulting a financial advisor is recommended to ensure the budget plan is robust and effective."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use the Monthly Budget Planner Calculator effectively, you need detailed information about your monthly income sources and all expenses. This includes fixed costs like rent or mortgage, utilities, and insurance, as well as variable expenses such as groceries, entertainment, and transportation. having recent bank statements and bills on hand can help ensure that the data entered is accurate and comprehensive."
    },
    {
      question: "Can I use this calculator for specific scenarios?",
      answer: "Yes, the Monthly Budget Planner Calculator is versatile and can be adapted for various scenarios, such as planning for a major purchase, saving for a vacation, or managing debt repayment. By adjusting the income and expense inputs, users can simulate different financial situations and see how changes impact their overall budget. This flexibility makes it a valuable tool for both short-term and long-term financial planning."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include underestimating variable expenses, forgetting to account for irregular or annual costs, and not updating the budget regularly. These errors can lead to an unrealistic budget that is difficult to stick to. To avoid these pitfalls, users should be thorough in their expense tracking and review their budget frequently to ensure it remains relevant and achievable."
    },
    {
      question: "How often should I recalculate?",
      answer: "It is advisable to recalculate your budget monthly or whenever there is a significant change in income or expenses. Regular reviews help track progress towards financial goals and allow for adjustments to be made as needed. This proactive approach ensures that the budget remains a useful tool for financial management and adapts to evolving life circumstances."
    },
    {
      question: "What should I do with these results?",
      answer: "The results from the Monthly Budget Planner Calculator should be used to inform financial decisions and adjust spending habits. If the calculator shows a surplus, consider allocating funds to savings or investments. If there is a deficit, look for areas to cut costs or increase income. The insights gained should serve as a roadmap for achieving financial stability and growth."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "While the Monthly Budget Planner Calculator is a powerful tool, alternatives include the 50/30/20 rule, zero-based budgeting, and envelope budgeting. Each method offers a different approach to managing finances, and the best choice depends on individual preferences and financial goals. Exploring different methods can help users find the budgeting style that works best for them."
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
    const expensesValue = parseFloat(inputs.expenses) || 0;
    const savingsGoalValue = parseFloat(inputs.savingsGoal) || 0;

    // Validate
    if (incomeValue <= 0 || expensesValue < 0) {
      return { 
        mainResult: 0, 
        result2: 0, 
        result3: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const netIncome = incomeValue - expensesValue;
    const savingsRate = (netIncome / incomeValue) * 100;
    const monthsToGoal = savingsGoalValue > 0 ? Math.ceil(savingsGoalValue / netIncome) : 0;

    // Generate schedule data if applicable (e.g., savings plan)
    const scheduleData = Array.from({ length: monthsToGoal }, (_, i) => ({
      month: i + 1,
      savings: netIncome,
      cumulativeSavings: netIncome * (i + 1),
      goalReached: netIncome * (i + 1) >= savingsGoalValue
    }));

    return { 
      mainResult: netIncome, 
      result2: savingsRate, 
      result3: monthsToGoal, 
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
    setInputs({ income: "", expenses: "", savingsGoal: "" });
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
              Savings Goal
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20000"
              value={inputs.savingsGoal}
              onChange={(e) => setInputs({ ...inputs, savingsGoal: e.target.value })}
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
                      Net Monthly Income
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
                      Savings Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {results.result2.toFixed(2)}%
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
                      Months to Savings Goal
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.result3}
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
                        <TableHead className="font-semibold">Savings</TableHead>
                        <TableHead className="font-semibold">Cumulative Savings</TableHead>
                        <TableHead className="font-semibold">Goal Reached</TableHead>
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
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.cumulativeSavings)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {row.goalReached ? <CheckCircle className="text-green-600 dark:text-green-400"/> : "No"}
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
          Understanding Monthly Budget Planner
        </h2>
        
        <p className="mb-6">
          A monthly budget planner is an essential tool for anyone looking to manage their finances effectively. It allows you to track your income and expenses, ensuring you stay on target with your financial goals. By understanding where your money goes each month, you can make informed decisions about saving and spending. This planner is particularly useful for individuals who want to save for a specific goal, such as a vacation, a new car, or even retirement. By using this tool, you can visualize your financial situation and make adjustments as needed to achieve your objectives.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial when it comes to budgeting. Incorrect estimations can lead to overspending or insufficient savings, which can have significant financial implications. For instance, failing to account for all expenses might leave you short at the end of the month, forcing you to dip into savings or incur debt. This planner helps you avoid such pitfalls by providing a clear picture of your financial health. By using this tool, you can ensure that your budget aligns with your financial goals, helping you make informed decisions about your money. For more insights on financial planning, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this monthly budget planner effectively, gather all necessary information before starting. You'll need details about your monthly income, regular expenses, and any savings goals you have in mind. Enter these values into the calculator to get a comprehensive overview of your financial situation. The tool will help you identify areas where you can cut back on spending or increase savings. For additional guidance on managing your finances, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Consistency is key when it comes to budgeting. Regularly updating your budget planner with accurate data ensures that you stay on track with your financial goals. Avoid common mistakes such as underestimating expenses or overestimating income by reviewing your budget monthly.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this planner include regularly reviewing your budget and making adjustments as needed. Consider factors such as changes in income, unexpected expenses, and evolving financial goals. By staying proactive and flexible, you can ensure that your budget remains aligned with your financial objectives.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Monthly Budget Planner Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this monthly budget planner is straightforward yet effective. It calculates your net income by subtracting total expenses from your total income. This net income is then used to determine your savings rate and the time required to reach your savings goal. This approach is widely accepted as it provides a clear picture of your financial health, allowing you to make informed decisions about your spending and saving habits.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Net Income = Total Income - Total Expenses
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Total Income = Sum of all income sources</li>
              <li>Total Expenses = Sum of all monthly expenses</li>
              <li>Net Income = Amount available for savings and discretionary spending</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in this formula plays a crucial role in determining your financial health. Total income includes all sources of revenue, such as salary, bonuses, and any side income. Total expenses encompass all monthly outgoings, including rent, utilities, groceries, and other regular payments. Net income is what remains after expenses, and it's essential for savings and discretionary spending. Understanding these variables helps you manage your finances effectively and achieve your savings goals.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that affect your budget is crucial for effective financial planning. These factors interact in complex ways, influencing your ability to save and spend wisely. By recognizing these elements, you can make informed decisions and optimize your budget for better financial outcomes.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Income Stability
        </h3>
        <p className="mb-4">
          Income stability is a significant factor in budgeting. A steady income allows for consistent savings and predictable spending patterns. On the other hand, irregular income can make budgeting challenging, requiring more frequent adjustments and careful planning.
        </p>
        <p className="mb-6">
          To manage income fluctuations, consider setting aside a portion of your earnings during high-income months to cover potential shortfalls in leaner times. This approach ensures that your budget remains balanced, even when income varies. For more strategies, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Expense Management
        </h3>
        <p className="mb-4">
          Effective expense management is key to successful budgeting. Regularly reviewing and categorizing expenses helps identify areas where you can cut back. This practice not only frees up funds for savings but also ensures that your spending aligns with your financial goals.
        </p>
        <p className="mb-6">
          Consider using budgeting apps or tools to track expenses and set spending limits. These tools provide insights into your spending habits, helping you make informed decisions about where to allocate your funds.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Savings Goals
        </h3>
        <p className="mb-4">
          Setting clear savings goals is essential for motivation and direction. Whether you're saving for a short-term purchase or a long-term objective, having a target amount and timeline helps you stay focused and disciplined.
        </p>
        <p className="mb-6">
          Break down your savings goal into manageable monthly targets. This approach makes the goal seem more achievable and provides a clear roadmap for reaching it. Regularly review your progress and adjust your budget as needed to stay on track.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Unexpected Expenses
        </h3>
        <p className="mb-6">
          Unexpected expenses can derail even the most carefully planned budget. Medical emergencies, car repairs, or home maintenance can arise without warning, requiring immediate financial attention. To mitigate the impact of these events, maintain an emergency fund that covers at least three to six months of living expenses. This fund acts as a financial buffer, allowing you to handle unforeseen costs without disrupting your budget.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Inflation and Economic Conditions
        </h3>
        <p className="mb-6">
          Economic conditions, including inflation, can affect your purchasing power and budget. As prices rise, your expenses may increase, requiring adjustments to your budget. Stay informed about economic trends and adjust your budget to account for changes in the cost of living. Consider consulting financial experts or resources to better understand how to navigate these challenges.
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
              What is a monthly budget planner and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              A monthly budget planner is a tool that helps you track your income and expenses over a month. It provides a clear picture of your financial situation, allowing you to make informed decisions about spending and saving. By using a budget planner, you can identify areas where you can cut back on expenses and allocate more funds towards savings or debt repayment.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Budgeting is crucial for financial stability and achieving your financial goals. It helps prevent overspending and ensures that you have enough funds to cover essential expenses. For more insights, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator provides a high level of accuracy based on the data you input. However, its accuracy depends on the precision of the information you provide. Factors such as unexpected expenses or changes in income can affect the results. It's important to regularly update your inputs to maintain accuracy.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For the most accurate results, ensure that all income and expenses are accounted for. Regularly review and adjust your budget to reflect any changes in your financial situation.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you'll need to gather information about your monthly income, including salary, bonuses, and any additional sources of revenue. You'll also need to list all your monthly expenses, such as rent, utilities, groceries, and other regular payments. Finally, if you have a specific savings goal, include that as well.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Having accurate and up-to-date information is crucial for obtaining reliable results. Consider using financial statements or budgeting apps to track your income and expenses effectively.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for specific scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator is versatile and can be used for various scenarios, such as planning for a vacation, saving for a down payment on a house, or managing monthly expenses. However, it's important to tailor the inputs to your specific situation to get the most accurate results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For scenarios with irregular income or expenses, consider adjusting the inputs to reflect average values over a period. This approach provides a more realistic view of your financial situation.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include underestimating expenses, overestimating income, and failing to account for irregular expenses. These errors can lead to inaccurate results and potential financial shortfalls. It's important to be realistic and thorough when entering data into the calculator.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Regularly reviewing and adjusting your budget helps prevent these mistakes. Consider setting aside a contingency fund for unexpected expenses to ensure your budget remains balanced.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It's advisable to recalculate your budget monthly or whenever there are significant changes in your financial situation, such as a change in income or unexpected expenses. Regular recalculations ensure that your budget remains accurate and aligned with your financial goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Establishing a routine for reviewing your budget, such as at the end of each month, helps maintain financial discipline and ensures you stay on track with your goals.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to make informed decisions about your spending and saving habits. If your net income is lower than expected, consider cutting back on discretionary expenses or finding ways to increase your income. If you're on track to meet your savings goal, continue with your current budget and look for opportunities to optimize further.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider consulting a financial advisor for personalized advice, especially if you're planning significant financial changes. For more tools, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives to this method include zero-based budgeting, where every dollar is assigned a specific purpose, and envelope budgeting, which involves allocating cash for different spending categories. Each method has its pros and cons, and the best choice depends on your financial habits and goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Experiment with different budgeting methods to find the one that works best for you. Consider combining elements from multiple methods to create a personalized budgeting strategy that suits your needs.
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
                Federal Reserve - Financial Stability
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic conditions and financial stability, providing insights into national financial trends.
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
                Consumer Financial Protection Bureau - Budgeting Guide
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on budgeting and financial planning.
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
                FDIC - Financial Education
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information, along with educational resources for consumers.
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
                Internal Revenue Service - Tax Planning
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information, essential for effective financial and tax planning.
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
                Investopedia - Budgeting Basics
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained, including budgeting basics and strategies.
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
                NerdWallet - Personal Finance
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers, helping you make informed financial decisions.
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
      title="Monthly Budget Planner"
      description="Manage your finances with this monthly budget planner. Track income and expenses to stay on target and reach your financial goals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd ?? undefined}
      onThisPage={[
        { id: "introduction", label: "Understanding Monthly Budget Planner" },
        { id: "formula", label: "Monthly Budget Planner Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Net Income = Total Income - Total Expenses",
        variables: [
          { symbol: "Total Income", description: "Sum of all income sources" },
          { symbol: "Total Expenses", description: "Sum of all monthly expenses" },
          { symbol: "Net Income", description: "Amount available for savings and discretionary spending" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a monthly income of $5,000, expenses totaling $3,000, and a savings goal of $20,000.",
        steps: [
          { 
            step: 1, 
            calculation: "Net Income = $5,000 - $3,000 = $2,000", 
            description: "Calculate net income by subtracting expenses from income." 
          },
          { 
            step: 2, 
            calculation: "Savings Rate = ($2,000 / $5,000) × 100 = 40%", 
            description: "Determine the savings rate as a percentage of income." 
          },
          { 
            step: 3, 
            calculation: "Months to Goal = $20,000 / $2,000 = 10", 
            description: "Calculate the number of months needed to reach the savings goal." 
          }
        ],
        result: "The final result is 10 months, meaning you can reach your savings goal in 10 months if you maintain this budget."
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
