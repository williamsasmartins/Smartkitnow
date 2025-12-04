import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function DebtConsolidationCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    totalDebt: "", 
    interestRate: "", 
    term: "" 
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
    let totalDebtValue = parseFloat(inputs.totalDebt) || 0;
    const interestRateValue = parseFloat(inputs.interestRate) || 0;
    const termValue = parseFloat(inputs.term) || 0;

    // Validate
    if (totalDebtValue <= 0 || interestRateValue <= 0 || termValue <= 0) {
      return { 
        mainResult: 0, 
        monthlyPayment: 0, 
        totalInterest: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyInterestRate = interestRateValue / 100 / 12;
    const numberOfPayments = termValue * 12;
    const monthlyPayment = totalDebtValue * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - totalDebtValue;

    // Generate schedule data
    const scheduleData = Array.from({ length: numberOfPayments }, (_, i) => {
      const interestPayment = totalDebtValue * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      totalDebtValue -= principalPayment;
      return {
        month: i + 1,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(totalDebtValue, 0)
      };
    });

    return { 
      mainResult: totalPayment, 
      monthlyPayment, 
      totalInterest, 
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
    setInputs({ totalDebt: "", interestRate: "", term: "" });
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
              Total Debt
            </Label>
            <Input
              type="number"
              placeholder="e.g., 15000"
              value={inputs.totalDebt}
              onChange={(e) => setInputs({ ...inputs, totalDebt: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5.5"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Loan Term (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
              value={inputs.term}
              onChange={(e) => setInputs({ ...inputs, term: e.target.value })}
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
                      Total Payment
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
                      Monthly Payment
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.monthlyPayment)}
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
                      Total Interest
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
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
          Understanding Debt Consolidation Calculator
        </h2>
        
        <p className="mb-6">
          Debt consolidation is a financial strategy that involves combining multiple debts into a single loan, often with a lower interest rate or more favorable terms. This approach can simplify your financial management by reducing the number of payments you need to make each month. Our Debt Consolidation Calculator is designed to help you evaluate whether consolidating your debts is a viable option. By inputting your total debt, interest rate, and loan term, you can see how much you would pay monthly and the total interest over the life of the loan. This tool is particularly useful for individuals juggling multiple high-interest debts, such as credit cards or personal loans.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial when considering debt consolidation, as they can significantly impact your financial health. Miscalculating your potential savings or monthly payments could lead to financial strain or missed opportunities for savings. According to recent studies, many consumers underestimate the total cost of their debts due to compounding interest and fees. Our calculator helps you avoid these pitfalls by providing precise estimates, allowing you to make informed decisions. For more insights on managing loans, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather all relevant information about your current debts, including the total amount owed, the interest rates, and the terms of each loan. Enter these details into the calculator to see a breakdown of your potential new monthly payment and total interest. This step-by-step process ensures you have a clear picture of your financial situation. For additional resources, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider the total cost of a consolidated loan, not just the monthly savings. While lower monthly payments can ease immediate financial pressure, they might result in higher overall costs if the loan term is significantly extended. Use our calculator to balance short-term relief with long-term financial health.
          </p>
        </div>
        
        <p className="mb-6">
          When optimizing your debt consolidation strategy, consider factors such as your credit score, current interest rates, and potential fees associated with new loans. These elements can affect the terms you're offered and your overall savings. Understanding these variables will help you choose the best consolidation option. For more strategies, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Debt Consolidation Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in our Debt Consolidation Calculator is based on the standard loan amortization formula, which calculates the monthly payment required to pay off a loan over a specified term at a fixed interest rate. This formula is widely used in the financial industry due to its accuracy and reliability in predicting loan payments. The formula considers the principal amount, the interest rate, and the number of payments to provide a comprehensive view of your financial obligations.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          M = P[r(1+r)^n] / [(1+r)^n – 1]
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>M = Monthly payment</li>
              <li>P = Principal loan amount</li>
              <li>r = Monthly interest rate (annual rate / 12 months)</li>
              <li>n = Number of payments (loan term in years × 12)</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining your monthly payment. The principal (P) is the total amount of debt you wish to consolidate. The interest rate (r) is divided by 12 to convert it into a monthly rate, which reflects the cost of borrowing. The number of payments (n) is the total number of monthly payments you'll make over the loan term. By adjusting these variables, you can see how different scenarios affect your monthly payment and total interest paid. For example, a higher interest rate or longer loan term will increase the total cost of the loan.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your debt consolidation results is essential for making informed financial decisions. These factors can significantly impact the effectiveness of your consolidation strategy and your overall financial health.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is one of the most critical factors in debt consolidation. It determines the cost of borrowing and directly affects your monthly payments and total interest paid. A lower interest rate can lead to significant savings over the life of the loan, making it a key consideration when evaluating consolidation options.
        </p>
        <p className="mb-6">
          To optimize your interest rate, consider improving your credit score or shopping around for the best rates. Many lenders offer competitive rates to attract borrowers with good credit. For more tips on managing interest rates, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term, or the length of time you have to repay the loan, affects both your monthly payments and the total interest paid. A longer loan term can lower your monthly payments, making them more manageable, but it may also increase the total interest you pay over time.
        </p>
        <p className="mb-6">
          When choosing a loan term, balance the need for affordable monthly payments with the desire to minimize total interest. Shorter terms typically result in higher monthly payments but lower overall costs. For more insights, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Fees and Charges
        </h3>
        <p className="mb-4">
          Fees and charges associated with debt consolidation can add up quickly, impacting your overall savings. These may include origination fees, prepayment penalties, or other administrative costs. Understanding these fees is crucial for accurately assessing the cost of consolidation.
        </p>
        <p className="mb-6">
          To minimize fees, compare offers from multiple lenders and read the fine print carefully. Some lenders may offer fee waivers or discounts for certain conditions. Always factor in these costs when calculating your potential savings.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Credit Score
        </h3>
        <p className="mb-6">
          Your credit score plays a significant role in determining the interest rate and terms you're offered for a consolidation loan. A higher credit score can lead to better rates and terms, while a lower score may limit your options. Improving your credit score before applying for a consolidation loan can result in substantial savings.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Economic conditions, such as changes in interest rates or inflation, can affect the cost of borrowing. Staying informed about economic trends can help you time your consolidation efforts to take advantage of favorable conditions. Consider consulting with a financial advisor to understand how these factors might impact your decision.
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
              What is a debt consolidation calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              A debt consolidation calculator is a tool that helps you evaluate the potential benefits of consolidating your debts into a single loan. It calculates your new monthly payment, total interest, and overall savings compared to your current debt situation. This calculator is important because it provides a clear picture of your financial options, helping you make informed decisions about managing your debts.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              By understanding the potential savings and costs, you can determine whether consolidation is the right choice for your financial situation. For more tools, visit our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator is designed to provide accurate estimates based on the information you input. However, the accuracy depends on the precision of your data and assumptions about interest rates and loan terms. It's important to use realistic figures and consider consulting a financial advisor for personalized advice.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Always double-check your inputs and consider potential changes in economic conditions that might affect your results.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you'll need to know your total debt amount, the interest rate you expect for the consolidated loan, and the loan term in years. Additionally, gather information about any fees or charges associated with the loan. This data will help you get the most accurate results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Ensure that the information is up-to-date and reflects your current financial situation. Accurate inputs lead to more reliable estimates.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for specific scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator can be used for various scenarios, such as consolidating credit card debts, personal loans, or medical bills. However, it's important to adjust the inputs to reflect the specific terms and conditions of your situation. Consider any unique factors, such as variable interest rates or special fees, that might affect the outcome.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If your scenario involves complex financial products, consulting a financial advisor might provide additional insights.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include underestimating the total debt amount, overlooking additional fees, and using incorrect interest rates. These errors can lead to inaccurate results and misguided financial decisions. Always verify your data and consider potential changes in economic conditions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Double-check your inputs and consult with a financial advisor if you're unsure about any aspect of the calculation.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculate whenever there are significant changes in your financial situation, such as a change in income, interest rates, or loan terms. Regular recalculations help you stay informed and adjust your strategy as needed. Consider setting a schedule to review your finances quarterly or annually.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Staying proactive with your calculations ensures you make the most of your financial opportunities.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to evaluate your debt consolidation options and make informed decisions. Consider how the new loan terms compare to your current situation and whether the potential savings justify the consolidation. If the results are favorable, proceed with applying for a consolidation loan.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If you're uncertain about the results, consult a financial advisor for personalized advice. For more guidance, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives to debt consolidation include debt management plans, balance transfer credit cards, and negotiating directly with creditors for better terms. Each method has its pros and cons, depending on your financial situation and goals. For instance, balance transfer cards may offer 0% interest for a limited time but often come with fees.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Evaluate each option carefully and consider consulting a financial advisor to determine the best approach for your needs.
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
                Federal Reserve - Interest Rates
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on interest rates and economic conditions affecting loans and credit.
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
                Consumer Financial Protection Bureau - Debt Consolidation
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive guide on debt consolidation and consumer protection resources.
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
                Educational resources on banking, loans, and financial management.
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
                Internal Revenue Service - Tax Implications
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Information on tax implications of debt consolidation and related deductions.
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
                Investopedia - Debt Management
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed articles on debt management strategies and financial planning.
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
                NerdWallet - Loan Comparison
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tools and guides for comparing loans and finding the best rates.
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
      title="Debt Consolidation Calculator"
      description="Determine if debt consolidation is right for you. Compare current payments versus a consolidated loan to see potential interest savings."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Debt Consolidation Calculator" },
        { id: "formula", label: "Debt Consolidation Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "M = P[r(1+r)^n] / [(1+r)^n – 1]",
        variables: [
          { symbol: "M", description: "Monthly payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "r", description: "Monthly interest rate (annual rate / 12 months)" },
          { symbol: "n", description: "Number of payments (loan term in years × 12)" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a total debt of $15,000 with an interest rate of 5% and a loan term of 5 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Convert annual interest rate to monthly: 5% / 12 = 0.004167", 
            explanation: "Calculate the monthly interest rate." 
          },
          { 
            label: "Step 2", 
            calculation: "Calculate monthly payment: M = 15000[0.004167(1+0.004167)^60] / [(1+0.004167)^60 – 1]", 
            explanation: "Determine the monthly payment using the formula." 
          },
          { 
            label: "Step 3", 
            calculation: "Calculate total payment: Monthly payment × 60 months", 
            explanation: "Find the total amount paid over the loan term." 
          }
        ],
        result: "The final result is a monthly payment of approximately $283.07, with a total payment of $16,984.20 over 5 years."
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