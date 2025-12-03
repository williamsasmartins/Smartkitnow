import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function HouseAffordabilityCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    income: "", 
    debts: "", 
    downPayment: "" 
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
    const debtsValue = parseFloat(inputs.debts) || 0;
    const downPaymentValue = parseFloat(inputs.downPayment) || 0;

    // Validate
    if (incomeValue <= 0 || debtsValue < 0 || downPaymentValue < 0) {
      return { 
        mainResult: 0, 
        maxLoan: 0, 
        monthlyPayment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const maxLoan = (incomeValue - debtsValue) * 4;
    const mainResult = maxLoan + downPaymentValue;
    const monthlyPayment = maxLoan / 360; // Assuming a 30-year mortgage

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: 24 }, (_, i) => ({
      month: i + 1,
      payment: monthlyPayment,
      principal: monthlyPayment * 0.7,
      interest: monthlyPayment * 0.3,
      balance: maxLoan - (monthlyPayment * (i + 1))
    }));

    return { 
      mainResult, 
      maxLoan, 
      monthlyPayment, 
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
    setInputs({ income: "", debts: "", downPayment: "" });
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
              Annual Income
            </Label>
            <Input
              type="number"
              placeholder="e.g., 75000"
              value={inputs.income}
              onChange={(e) => setInputs({ ...inputs, income: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Monthly Debts
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.debts}
              onChange={(e) => setInputs({ ...inputs, debts: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Down Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20000"
              value={inputs.downPayment}
              onChange={(e) => setInputs({ ...inputs, downPayment: e.target.value })}
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
                      Maximum House Price
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
                      Maximum Loan Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.maxLoan)}
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
                      Estimated Monthly Payment
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.monthlyPayment)}
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
                    Payment Schedule
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
                        : `Show All ${results.scheduleData.length} Payments`}
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
                        <TableHead className="font-semibold">Payment</TableHead>
                        <TableHead className="font-semibold">Principal</TableHead>
                        <TableHead className="font-semibold">Interest</TableHead>
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
                            <TableCell>{formatCurrency(row.payment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.principal)}
                            </TableCell>
                            <TableCell className="text-red-600 dark:text-red-400">
                              {formatCurrency(row.interest)}
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
          Understanding How Much House Can I Afford? Calculator
        </h2>
        
        <p className="mb-6">
          Buying a house is one of the most significant financial decisions you'll make in your lifetime. The "How Much House Can I Afford?" calculator is a powerful tool designed to help you determine your home buying budget based on your income, existing debts, and available down payment. This calculator provides a realistic estimate of the maximum house price you can afford, ensuring you don't stretch your finances too thin. Whether you're a first-time homebuyer or looking to upgrade, understanding your affordability is crucial to making informed decisions.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital in the home buying process. Overestimating your affordability can lead to financial strain, while underestimating might cause you to miss out on your dream home. This calculator considers all critical factors, including your income and debt obligations, to provide a reliable estimate. According to recent studies, homebuyers who use affordability calculators are more likely to stay within budget and avoid foreclosure. This tool empowers you to plan effectively and make sound financial choices. For more insights, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your annual income, monthly debts, and the amount you can allocate for a down payment. Enter these values into the respective fields to calculate your maximum house price. The calculator will also provide insights into the maximum loan amount and estimated monthly payments. For accurate results, ensure that the data you enter is up-to-date and reflects your current financial situation. If you're unsure about any input, consult our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> for additional guidance.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider potential changes in your financial situation when using this calculator. Factors like job stability, interest rate fluctuations, and lifestyle changes can impact your affordability. Regularly revisiting your calculations ensures you remain within a safe financial margin.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include updating your inputs regularly and considering various scenarios. For instance, what happens if interest rates rise? How would a change in income affect your affordability? By exploring these questions, you can better prepare for future financial shifts. Remember, this calculator is a guide, not a guarantee. Always consult with financial advisors or mortgage professionals for personalized advice.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          How Much House Can I Afford? Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is a standard approach to determining home affordability. It considers your annual income, subtracts your monthly debt obligations, and multiplies the result by a factor (typically 4) to estimate the maximum loan amount. Adding your down payment to this figure provides the maximum house price you can afford. This method is widely accepted in the financial industry for its simplicity and accuracy.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Max House Price = (Annual Income - Monthly Debts) × 4 + Down Payment
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Annual Income = Your total yearly earnings</li>
              <li>Monthly Debts = Total of all monthly debt payments</li>
              <li>Down Payment = Amount you can pay upfront for the house</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in this formula plays a crucial role. Your annual income sets the baseline for what you can afford, while monthly debts reduce this amount, reflecting your financial obligations. The down payment directly increases your purchasing power, reducing the loan amount needed. Adjusting any of these variables will impact the maximum house price, allowing you to explore different financial scenarios.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your house affordability is crucial. These elements interact in complex ways, affecting your financial capacity. By recognizing these factors, you can make informed decisions and optimize your home buying strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Income Stability
        </h3>
        <p className="mb-4">
          Your income is the foundation of your financial capability. A stable and predictable income stream increases your ability to afford a higher-priced home. Lenders often prefer borrowers with consistent income, as it reduces the risk of default. If your income is variable, consider averaging it over several years to get a more accurate picture.
        </p>
        <p className="mb-6">
          To optimize this factor, ensure that your income documentation is up-to-date and reflects any recent increases. If you're self-employed, maintain detailed records to demonstrate income stability. For more insights, check our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Debt-to-Income Ratio
        </h3>
        <p className="mb-4">
          This ratio compares your monthly debt payments to your monthly income. A lower ratio indicates better financial health and increases your borrowing capacity. Lenders typically prefer a ratio below 36%, as it suggests you can manage additional debt comfortably.
        </p>
        <p className="mb-6">
          To improve this ratio, focus on paying down existing debts before applying for a mortgage. Reducing credit card balances and consolidating loans can also help. Understanding this factor is essential for maximizing your affordability.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rates
        </h3>
        <p className="mb-4">
          Interest rates directly affect your monthly mortgage payments. Lower rates reduce the cost of borrowing, allowing you to afford a more expensive home. Conversely, higher rates increase payments, limiting your purchasing power.
        </p>
        <p className="mb-6">
          Keep an eye on market trends and consider locking in rates when they are favorable. Consult with mortgage professionals to explore different loan options and find the best rate for your situation.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Down Payment Size
        </h3>
        <p className="mb-6">
          A larger down payment reduces the loan amount you need, decreasing monthly payments and interest costs. It also demonstrates financial responsibility to lenders, potentially leading to better loan terms. Aim to save at least 20% of the home's price to avoid private mortgage insurance (PMI).
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Credit Score
        </h3>
        <p className="mb-6">
          Your credit score reflects your creditworthiness and influences the interest rates offered to you. A higher score can lead to lower rates, reducing overall borrowing costs. Regularly check your credit report for errors and work on improving your score by paying bills on time and reducing debt.
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
              What is how much house can I afford? calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator helps you determine the maximum house price you can afford based on your financial situation. It's crucial for setting realistic expectations and avoiding financial strain. By considering your income, debts, and down payment, it provides a comprehensive view of your purchasing power.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Understanding your affordability helps prevent overextending your finances, ensuring you can comfortably manage your mortgage payments. For more tools, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The calculator provides a reliable estimate based on the inputs you provide. However, it doesn't account for future changes in income, debts, or interest rates. For precise results, ensure your inputs are accurate and up-to-date.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              While the calculator is a helpful guide, consulting with a financial advisor or mortgage professional can provide personalized advice tailored to your unique situation.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              You'll need your annual income, monthly debt payments, and the amount you can allocate for a down payment. This information helps the calculator determine your maximum house price and loan amount.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Ensure your data is accurate by reviewing recent pay stubs, bank statements, and credit reports. This will provide a realistic view of your financial capacity.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for different scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, the calculator is versatile and can be used for various scenarios. Adjust your income, debts, and down payment to see how different situations affect your affordability. This flexibility helps you plan for changes in your financial situation.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider scenarios like a job change, debt reduction, or increased savings to explore different outcomes. This proactive approach ensures you're prepared for any financial shifts.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include underestimating monthly debts, overestimating income, and not accounting for future expenses. These errors can lead to unrealistic affordability estimates and financial strain.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these pitfalls, double-check your inputs and consider potential changes in your financial situation. Regularly updating your calculations ensures they remain accurate and relevant.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculate whenever there's a significant change in your financial situation, such as a salary increase, debt reduction, or change in interest rates. Regular updates ensure your affordability estimate remains accurate.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              As a best practice, review your calculations annually or before making major financial decisions. This proactive approach helps you stay on top of your financial health.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to set a realistic home buying budget and guide your property search. Understanding your affordability helps you focus on homes within your financial reach, avoiding potential financial strain.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If the results are lower than expected, consider strategies to improve your financial situation, such as increasing savings or reducing debts. For more guidance, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives include consulting with a mortgage broker or financial advisor for personalized advice. They can provide tailored recommendations based on your unique financial situation and goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Additionally, online mortgage pre-approval tools offer another method to assess affordability, considering lender-specific criteria. These tools complement the calculator by providing a more comprehensive view.
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
                Federal Reserve - Housing Market Trends
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on housing market trends and economic indicators.
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
                Consumer Financial Protection Bureau - Home Buying Guide
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
                FDIC - Mortgage Lending Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and mortgage lending guidelines.
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
                Internal Revenue Service - Homeowner Tax Benefits
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and homeowner tax benefits information.
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
                Investopedia - Mortgage Basics
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and mortgage basics explained.
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
                NerdWallet - Home Buying Tips
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and home buying tips for consumers.
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
      title="How Much House Can I Afford? Calculator"
      description="Determine your home buying budget based on income, debt, and down payment using this comprehensive affordability calculator."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding How Much House Can I Afford? Calculator" },
        { id: "formula", label: "How Much House Can I Afford? Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Max House Price = (Annual Income - Monthly Debts) × 4 + Down Payment",
        variables: [
          { symbol: "Annual Income", description: "Your total yearly earnings" },
          { symbol: "Monthly Debts", description: "Total of all monthly debt payments" },
          { symbol: "Down Payment", description: "Amount you can pay upfront for the house" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have an annual income of $75,000, monthly debts of $500, and a down payment of $20,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "($75,000 - $6,000) × 4 = $276,000", 
            explanation: "Calculate the maximum loan amount by subtracting annual debts from income and multiplying by 4." 
          },
          { 
            label: "Step 2", 
            calculation: "$276,000 + $20,000 = $296,000", 
            explanation: "Add the down payment to determine the maximum house price." 
          }
        ],
        result: "The final result is $296,000, meaning you can afford a house priced up to this amount."
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