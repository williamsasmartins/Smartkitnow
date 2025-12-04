import { useState, useMemo, useRef } from "react";
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
    let grossIncomeValue = parseFloat(inputs.grossIncome) || 0;
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
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: INTRODUCTION (400-500 words) */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Understanding Net Income after Tax Calculator
        </h2>
        
        <p className="mb-6">
          Calculating your net income after taxes is crucial for effective financial planning. This calculator helps you determine your take-home pay after accounting for taxes and deductions. Whether you're budgeting for monthly expenses or planning for future investments, knowing your net income is essential. This tool is particularly useful for employees, freelancers, and business owners who need to understand their actual earnings after tax obligations are met.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in financial planning to avoid overestimating your disposable income. Misjudging your net income can lead to budget shortfalls and financial stress. According to recent studies, many individuals underestimate their tax liabilities, which can result in unexpected financial burdens. This calculator provides a reliable estimate, helping you make informed decisions about savings, investments, and expenditures. For more insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator, gather your gross income details, applicable tax rates, and any deductions you qualify for. Enter these values into the respective fields to get an accurate calculation of your net income. Ensure that the tax rate reflects your current tax bracket, and include all eligible deductions to optimize your results. For additional guidance, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. Small errors in tax rate or deduction entries can significantly impact your net income calculation. Use this tool regularly to stay updated with any changes in your financial situation or tax laws.
          </p>
        </div>
        
        <p className="mb-6">
          Regularly updating your calculations with current data ensures you remain on top of your financial health. Consider factors like changes in salary, tax laws, or personal deductions that might affect your net income. Staying informed and proactive helps you avoid financial pitfalls and capitalize on opportunities for savings and investments.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Net Income after Tax Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is straightforward yet comprehensive, ensuring accurate results. It calculates net income by subtracting total taxes and deductions from your gross income. This approach is widely accepted in financial planning and provides a clear picture of your take-home pay.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Net Income = (Gross Income - Deductions) - (Gross Income × Tax Rate)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Gross Income = Total earnings before taxes</li>
              <li>Deductions = Total allowable deductions</li>
              <li>Tax Rate = Applicable tax percentage</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each component of the formula plays a critical role. Gross Income is your total earnings before any deductions or taxes. Deductions reduce your taxable income, leading to lower tax liabilities. The Tax Rate is the percentage of your income that goes to taxes, determined by your tax bracket. Adjusting any of these variables will directly affect your net income, providing flexibility in financial planning.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your net income is essential for accurate financial planning. These factors interact in complex ways, affecting your overall financial health. By analyzing each factor, you can optimize your income and make informed decisions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Gross Income
        </h3>
        <p className="mb-4">
          Gross income is the starting point for calculating net income. It includes all earnings before taxes and deductions. A higher gross income generally leads to higher net income, but it can also push you into a higher tax bracket, increasing your tax rate.
        </p>
        <p className="mb-6">
          To optimize, consider ways to increase your gross income through salary negotiations or additional income streams. For more strategies, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Tax Rate
        </h3>
        <p className="mb-4">
          The tax rate significantly impacts your net income. It is determined by your income level and filing status. Higher income typically results in a higher tax rate, reducing your net income.
        </p>
        <p className="mb-6">
          Understanding your tax bracket and potential deductions can help manage your tax liabilities. Consider consulting a tax professional for personalized advice.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Deductions
        </h3>
        <p className="mb-4">
          Deductions lower your taxable income, thereby reducing your tax liability. Common deductions include mortgage interest, student loan interest, and retirement contributions.
        </p>
        <p className="mb-6">
          Maximizing deductions can significantly increase your net income. Keep detailed records of all deductible expenses and consult tax guidelines to ensure compliance.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Filing Status
        </h3>
        <p className="mb-6">
          Your filing status affects your tax rate and eligibility for certain deductions. Common statuses include single, married filing jointly, and head of household. Each status has different tax implications and thresholds.
        </p>
        <p className="mb-6">
          Choosing the correct filing status can optimize your tax liabilities. Evaluate your options annually to ensure you're taking advantage of the best status for your situation.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          State and Local Taxes
        </h3>
        <p className="mb-6">
          In addition to federal taxes, state and local taxes can impact your net income. These vary widely by location and can include income, sales, and property taxes. Understanding these additional taxes is crucial for accurate net income calculations.
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
              What is net income after tax calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The net income after tax calculator helps you determine your actual take-home pay after accounting for taxes and deductions. It's crucial for budgeting, saving, and financial planning, ensuring you have a clear understanding of your disposable income.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              By knowing your net income, you can make informed decisions about spending, saving, and investing. For more insights, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator provides a high level of accuracy by using standard formulas and current tax rates. However, the accuracy depends on the accuracy of the input data, such as income, tax rates, and deductions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For precise results, ensure all inputs are up-to-date and reflect your current financial situation.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you need your gross income, applicable tax rate, and any deductions you qualify for. Gross income includes all earnings before taxes, while deductions reduce your taxable income.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Ensure you have accurate and up-to-date information for each input to get the most reliable results.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for specific scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator can be used for various scenarios, such as estimating net income for a new job offer or planning for retirement. However, it may not account for complex tax situations or unique deductions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For complex scenarios, consider consulting a financial advisor or tax professional.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include using outdated tax rates, neglecting to include all deductions, and misreporting gross income. These errors can lead to inaccurate net income calculations.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Double-check all inputs for accuracy and consult tax guidelines to avoid these pitfalls.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculate whenever there are changes in your income, tax rates, or deductions. Regular updates ensure your financial plans remain accurate and relevant.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              A good practice is to update your calculations annually or whenever significant financial changes occur.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to inform your budgeting, savings, and investment strategies. Understanding your net income helps you allocate resources effectively and plan for future financial goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If needed, consult a financial advisor for personalized advice. For more tools, check our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives include manual calculations using tax tables or consulting with a tax professional. Each method has its pros and cons, with manual calculations being more time-consuming but potentially more tailored to specific situations.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider your needs and resources when choosing a method. For complex financial situations, professional advice may be beneficial.
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
                Federal Reserve - Economic Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on economic indicators and regulatory guidelines.
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
                Consumer Financial Protection Bureau - Financial Guides
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
                FDIC - Banking Resources
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
                Investopedia - Financial Education
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
                NerdWallet - Personal Finance
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
      title="Net Income after Tax Calculator"
      description="Calculate your net income after taxes. Estimate your actual take-home pay based on your gross salary and location."
      widget={widget}
      editorial={editorial}
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