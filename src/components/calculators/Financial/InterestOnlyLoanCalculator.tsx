import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function InterestOnlyLoanCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    loanAmount: "", 
    interestRate: "", 
    loanTerm: "" 
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
    let loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
    const loanTerm = parseFloat(inputs.loanTerm) || 0;

    // Validate
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return { 
        monthlyInterestOnlyPayment: 0, 
        totalInterestOnlyPayments: 0, 
        totalPaymentWithPrincipal: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyInterestOnlyPayment = loanAmount * interestRate / 12;
    const totalInterestOnlyPayments = monthlyInterestOnlyPayment * loanTerm * 12;
    const totalPaymentWithPrincipal = loanAmount + totalInterestOnlyPayments;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: loanTerm * 12 }, (_, i) => ({
      month: i + 1,
      payment: monthlyInterestOnlyPayment,
      principal: 0,
      interest: monthlyInterestOnlyPayment,
      balance: loanAmount
    }));

    return { 
      monthlyInterestOnlyPayment, 
      totalInterestOnlyPayments, 
      totalPaymentWithPrincipal, 
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
    setInputs({ loanAmount: "", interestRate: "", loanTerm: "" });
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
              Loan Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 300000"
              value={inputs.loanAmount}
              onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
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
              placeholder="e.g., 3.5"
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
              placeholder="e.g., 30"
              value={inputs.loanTerm}
              onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
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
      {results.monthlyInterestOnlyPayment > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Monthly Interest-Only Payment
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.monthlyInterestOnlyPayment)}
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
                      Total Interest-Only Payments
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalInterestOnlyPayments)}
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
                      Total Payment with Principal
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalPaymentWithPrincipal)}
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
          Understanding Interest-Only Loan Calculator
        </h2>
        
        <p className="mb-6">
          The Interest-Only Loan Calculator is a powerful tool designed to help you understand the financial implications of an interest-only loan. This type of loan allows borrowers to pay only the interest for a specified period, typically the first few years of the loan term. During this time, the principal balance remains unchanged. This calculator is essential for anyone considering an interest-only loan, as it provides insights into the monthly payments required during the interest-only period and the total cost of the loan over its lifetime.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial when dealing with interest-only loans because they can significantly impact your financial planning. Miscalculations can lead to unexpected financial burdens, especially when the loan transitions to a phase where both principal and interest payments are required. This tool helps you make informed decisions by providing precise calculations, allowing you to compare different loan scenarios and choose the best option for your financial situation. For more detailed loan calculations, you might also want to explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          Using the Interest-Only Loan Calculator is straightforward. You need to input the loan amount, the interest rate, and the loan term. The calculator will then compute the monthly interest-only payments, the total interest paid during the interest-only period, and the total payment including the principal. To get the most accurate results, ensure that you have the correct loan details at hand. For additional insights on mortgage planning, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            When considering an interest-only loan, it's crucial to plan for the future. Once the interest-only period ends, your monthly payments will increase as you begin to pay down the principal. Ensure you have a strategy in place to manage these higher payments to avoid financial strain.
          </p>
        </div>
        
        <p className="mb-6">
          To optimize your use of this calculator, consider various scenarios and how changes in interest rates or loan terms might affect your payments. Keep in mind that external factors such as economic conditions and changes in your personal financial situation can also impact your loan. Regularly revisiting your calculations can help you stay on top of your financial planning.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Interest-Only Loan Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Interest-Only Loan Calculator is straightforward yet effective. It calculates the monthly interest-only payment by multiplying the loan amount by the annual interest rate, then dividing by 12 to convert it to a monthly figure. This formula is widely used in the financial industry because it provides a clear picture of the cost of borrowing when only interest payments are made.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Monthly Interest-Only Payment = (Loan Amount × Interest Rate) / 12
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Loan Amount = Total amount borrowed</li>
              <li>Interest Rate = Annual interest rate (as a decimal)</li>
              <li>12 = Number of months in a year</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role. The loan amount is the total sum borrowed, which directly affects the size of your monthly payments. The interest rate, expressed as a decimal, determines the cost of borrowing. A higher interest rate results in higher payments. Understanding these variables helps you make informed decisions about your loan. For example, if you borrow $300,000 at a 3.5% interest rate, your monthly interest-only payment would be $875.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Several factors can influence the results of your interest-only loan calculations. Understanding these factors is crucial for accurate financial planning. They interact in complex ways, affecting both your monthly payments and the overall cost of the loan.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Amount
        </h3>
        <p className="mb-4">
          The loan amount is the principal sum you borrow. It directly impacts the size of your monthly interest payments. Larger loans result in higher payments, which can strain your budget. For instance, a $500,000 loan will have significantly higher interest payments than a $300,000 loan.
        </p>
        <p className="mb-6">
          To manage this factor, consider borrowing only what you need and can afford to repay. Use our <a href="/financial/car-loan-affordability" className="text-blue-600 dark:text-blue-400 hover:underline">Car Loan Affordability Calculator</a> to explore how different loan amounts affect your payments.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is a critical factor that determines the cost of borrowing. Even small changes in the interest rate can significantly affect your monthly payments. For example, a 0.5% increase in the rate can add hundreds of dollars to your annual payments.
        </p>
        <p className="mb-6">
          Interest rates vary based on market conditions and your creditworthiness. To secure the best rate, maintain a good credit score and shop around for competitive offers. Understanding how rates affect your loan can help you make better financial decisions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term is the period over which you repay the loan. It affects both the monthly payments and the total interest paid over the life of the loan. Longer terms result in lower monthly payments but higher total interest costs.
        </p>
        <p className="mb-6">
          Consider the trade-offs between lower monthly payments and higher overall costs. Shorter terms can save you money in the long run but require higher monthly payments. Evaluate your financial situation to choose the best term for your needs.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Economic factors such as inflation and monetary policy can influence interest rates and loan terms. During periods of economic growth, interest rates may rise, increasing your borrowing costs. Conversely, during recessions, rates may fall, making loans more affordable.
        </p>
        <p className="mb-6">
          Stay informed about economic trends and how they might affect your loan. Adjust your financial plans accordingly to take advantage of favorable conditions or mitigate the impact of adverse changes.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Personal Financial Situation
        </h3>
        <p className="mb-6">
          Your personal financial situation, including income, expenses, and credit score, plays a significant role in determining your loan terms. A stable income and good credit can help you secure better rates and terms, reducing your overall borrowing costs.
        </p>
        <p className="mb-6">
          Regularly review your financial situation and make adjustments as needed. Consider strategies to improve your credit score and manage your debt effectively. For more tips on managing your finances, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
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
              What is an interest-only loan calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              An interest-only loan calculator is a tool that helps you determine the monthly payments required during the interest-only period of a loan. It's crucial because it provides insights into the financial commitment involved and helps you plan your budget accordingly. For example, if you're considering a $300,000 loan with a 3.5% interest rate, the calculator will show you that your monthly payment would be $875.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Understanding these payments is vital for financial planning, as it allows you to assess whether an interest-only loan fits your budget. For more detailed loan planning, you might also consider our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator provides highly accurate results based on the inputs you provide. However, its accuracy depends on the correctness of the data entered. Factors such as fluctuating interest rates or changes in loan terms can affect the results. It's always a good idea to consult with a financial advisor for personalized advice.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For best results, ensure that all input values are accurate and up-to-date. Regularly revisiting your calculations can help you stay on track with your financial goals.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you'll need the loan amount, the annual interest rate, and the loan term in years. The loan amount is the total sum you intend to borrow. The interest rate should be entered as a percentage, and the loan term is the duration over which you plan to repay the loan.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              You can find this information in your loan agreement or by consulting with your lender. Accurate data ensures precise calculations, helping you make informed financial decisions.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for refinancing scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator can be used to evaluate refinancing scenarios. By inputting the new loan amount, interest rate, and term, you can compare the interest-only payments of the new loan against your current loan. This comparison helps you determine if refinancing is a financially beneficial option.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              However, keep in mind that refinancing involves additional costs such as closing fees. Consider these factors when evaluating the overall benefits of refinancing. For a more detailed analysis, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              One common mistake is underestimating the impact of interest rate changes. Even small fluctuations can significantly affect your payments. Another mistake is not accounting for the end of the interest-only period, which can lead to a sudden increase in monthly payments.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these errors, regularly update your calculations and plan for the transition to principal and interest payments. Staying informed about market trends can also help you anticipate changes in your loan terms.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It's advisable to recalculate whenever there are changes in your financial situation, such as a change in income, interest rates, or loan terms. Regular recalculations help you stay on top of your financial commitments and adjust your budget as needed.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              A good rule of thumb is to review your calculations annually or whenever you consider making significant financial decisions. This proactive approach ensures that your financial plans remain aligned with your goals.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to inform your financial planning. The monthly payment figure helps you budget for the interest-only period, while the total payment with principal provides a long-term view of your financial commitment. If the results indicate that the loan may strain your budget, consider adjusting the loan amount, term, or exploring other loan options.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              It's also wise to consult with a financial advisor to interpret the results in the context of your overall financial strategy. For more insights on managing loans, visit our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While this calculator provides a straightforward method for calculating interest-only payments, other methods include using financial software or consulting with a financial advisor. These alternatives can offer more personalized insights and account for complex financial scenarios.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Each method has its pros and cons. For example, financial software can automate calculations but may require a subscription. Consulting with an advisor provides tailored advice but can be costly. Choose the method that best fits your needs and budget.
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
                Official data on interest rates and monetary policy, crucial for understanding loan costs.
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
                Consumer Financial Protection Bureau - Loan Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on loans.
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
                Banking regulations and deposit insurance information, important for loan security.
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
                Internal Revenue Service - Tax Deductions
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information, useful for understanding loan-related tax benefits.
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
                Investopedia - Loan Concepts
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained, including loans.
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
                Personal finance guides and comparison tools for consumers, including loan calculators.
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
      title="Interest-Only Loan Calculator"
      description="Calculate payments for interest-only loans. Compare the interest-only period versus the full amortization phase to plan your budget."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Interest-Only Loan Calculator" },
        { id: "formula", label: "Interest-Only Loan Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Monthly Interest-Only Payment = (Loan Amount × Interest Rate) / 12",
        variables: [
          { symbol: "Loan Amount", description: "Total amount borrowed" },
          { symbol: "Interest Rate", description: "Annual interest rate (as a decimal)" },
          { symbol: "12", description: "Number of months in a year" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $300,000 loan with a 3.5% interest rate over a 30-year term.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "300000 × 0.035 = 10500", 
            explanation: "Calculate the annual interest payment." 
          },
          { 
            label: "Step 2", 
            calculation: "10500 / 12 = 875", 
            explanation: "Divide the annual interest by 12 to find the monthly interest-only payment." 
          },
          { 
            label: "Step 3", 
            calculation: "875 × 360 = 315000", 
            explanation: "Calculate the total interest paid over the 30-year term." 
          }
        ],
        result: "The final result is $315,000, meaning you will pay this amount in interest over the life of the loan."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💰"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"},
        {"title":"Car Loan Affordability Calculator","url":"/financial/car-loan-affordability","icon":"🚗"}
      ]}
    />
  );
}