import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function StudentLoanRepaymentCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    loanAmount: "", 
    interestRate: "", 
    repaymentTerm: "" 
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
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const repaymentTerm = parseInt(inputs.repaymentTerm) * 12 || 0;

    // Validate
    if (loanAmount <= 0 || interestRate <= 0 || repaymentTerm <= 0) {
      return { 
        monthlyPayment: 0, 
        totalInterest: 0, 
        totalPayment: 0, 
        scheduleData: [] 
      };
    }

    // Calculate monthly payment using the formula for an amortizing loan
    const monthlyPayment = loanAmount * interestRate / (1 - Math.pow(1 + interestRate, -repaymentTerm));
    const totalPayment = monthlyPayment * repaymentTerm;
    const totalInterest = totalPayment - loanAmount;

    // Generate amortization schedule data
    let balance = loanAmount;
    const scheduleData = Array.from({ length: repaymentTerm }, (_, i) => {
      const interestPayment = balance * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      return {
        month: i + 1,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(balance, 0)
      };
    });

    return { 
      monthlyPayment, 
      totalInterest, 
      totalPayment, 
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
    setInputs({ loanAmount: "", interestRate: "", repaymentTerm: "" });
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
              placeholder="e.g., 30000"
              value={inputs.loanAmount}
              onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Annual Interest Rate (%)
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
              Repayment Term (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.repaymentTerm}
              onChange={(e) => setInputs({ ...inputs, repaymentTerm: e.target.value })}
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
      {results.monthlyPayment > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Monthly Payment
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.monthlyPayment)}
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
                      Total Interest
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalInterest)}
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
                      Total Payment
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalPayment)}
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
          Understanding Student Loan Repayment Calculator
        </h2>
        
        <p className="mb-6">
          The Student Loan Repayment Calculator is a powerful tool designed to help you plan your student loan repayment strategy effectively. By inputting your loan amount, interest rate, and repayment term, you can estimate your monthly payments and total interest costs. This calculator is particularly useful for students and graduates who are looking to manage their finances better and make informed decisions about their loan repayments. Whether you're considering different repayment plans or simply want to understand the financial impact of your current loan, this tool provides valuable insights.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial when it comes to managing student loans. Incorrect estimations can lead to financial strain and missed opportunities for savings. According to recent studies, a significant percentage of borrowers underestimate the total cost of their loans, leading to financial challenges down the line. This calculator helps you avoid such pitfalls by providing precise calculations based on your inputs. By understanding your financial obligations, you can make better decisions and potentially save money in the long run. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather all necessary information beforehand. You'll need to know your total loan amount, the annual interest rate, and the repayment term in years. Enter these values into the respective fields to get started. The calculator will then compute your monthly payment, total interest, and total payment over the life of the loan. For best results, ensure that the data you enter is accurate and up-to-date. If you're exploring different repayment options, consider using our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> for comparison.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check the interest rate and repayment term before finalizing your calculations. Small errors in these inputs can lead to significant discrepancies in your results. Use the calculator to explore different scenarios and find the best repayment strategy for your financial situation.
          </p>
        </div>
        
        <p className="mb-6">
          As you plan your repayment strategy, consider factors such as potential changes in income, additional payments, and refinancing options. Making extra payments can significantly reduce the total interest paid over the life of the loan. For more detailed analysis, our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> can provide insights into how additional payments impact your loan.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Student Loan Repayment Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is based on the standard amortizing loan formula, which is widely accepted in the financial industry. This formula calculates the monthly payment required to pay off a loan over a specified term, taking into account the principal amount, interest rate, and number of payments. The formula is designed to ensure that each payment covers both the interest and a portion of the principal, gradually reducing the loan balance to zero by the end of the term.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          M = P[r(1+r)^n] / [(1+r)^n – 1]
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>M = Monthly payment</li>
              <li>P = Principal loan amount</li>
              <li>r = Monthly interest rate (annual rate / 12)</li>
              <li>n = Number of payments (loan term in years × 12)</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining the monthly payment. The principal (P) is the initial amount borrowed, while the interest rate (r) reflects the cost of borrowing. The number of payments (n) determines how long it will take to repay the loan. By adjusting these variables, borrowers can explore different repayment scenarios and choose the option that best fits their financial goals. For example, increasing the number of payments can lower the monthly payment but increase the total interest paid.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your loan repayment results is crucial for effective financial planning. These factors interact in complex ways, and small changes can have significant impacts on your overall repayment strategy. By considering each factor carefully, you can optimize your repayment plan and potentially save money.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Amount
        </h3>
        <p className="mb-4">
          The loan amount is the total sum borrowed from the lender. It is a primary determinant of your monthly payment and total interest cost. Larger loans result in higher monthly payments and more interest paid over time. It's important to borrow only what you need to minimize your financial burden.
        </p>
        <p className="mb-6">
          To optimize your loan amount, consider your educational expenses and potential future earnings. Borrowing less can reduce your financial stress and allow you to allocate funds to other financial goals. For more insights, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is the cost of borrowing expressed as a percentage of the loan amount. It significantly affects the total interest paid over the life of the loan. Even a small change in the interest rate can lead to substantial differences in your total repayment amount.
        </p>
        <p className="mb-6">
          Interest rates can vary based on your credit score, loan type, and market conditions. It's advisable to shop around for the best rates and consider refinancing if rates drop. Understanding how interest rates work can help you make informed decisions about your loans.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Repayment Term
        </h3>
        <p className="mb-4">
          The repayment term is the length of time over which you agree to repay the loan. Longer terms result in lower monthly payments but higher total interest costs. Conversely, shorter terms increase monthly payments but reduce the overall interest paid.
        </p>
        <p className="mb-6">
          Choosing the right repayment term depends on your financial situation and goals. If you can afford higher monthly payments, a shorter term can save you money in the long run. However, if cash flow is a concern, a longer term may be more manageable.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Extra Payments
        </h3>
        <p className="mb-6">
          Making extra payments on your loan can significantly reduce the total interest paid and shorten the repayment term. Extra payments go directly towards the principal, reducing the balance faster than scheduled payments alone. This strategy can save you money and help you become debt-free sooner.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Type
        </h3>
        <p className="mb-6">
          Different types of loans have varying terms, interest rates, and repayment options. Federal student loans often offer more flexible repayment options compared to private loans. Understanding the differences can help you choose the best loan for your needs and maximize your repayment strategy.
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
              What is a student loan repayment calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              A student loan repayment calculator is a tool that helps borrowers estimate their monthly payments, total interest, and overall cost of a student loan. It is important because it provides a clear picture of the financial commitment involved in repaying a loan, allowing borrowers to plan and budget effectively.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              By understanding the repayment terms, borrowers can make informed decisions about their loans and explore options to reduce costs. For more detailed analysis, check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator is designed to provide accurate estimates based on the inputs provided. However, the accuracy depends on the precision of the data entered, such as the interest rate and loan term. It is important to use up-to-date and correct information to ensure reliable results.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For complex financial situations, consulting a financial advisor is recommended to complement the calculator's insights.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you need to know your total loan amount, the annual interest rate, and the repayment term in years. This information is typically available on your loan agreement or from your lender. Accurate data ensures that the calculator provides reliable estimates.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Gathering this information beforehand will help you make the most of the calculator and explore different repayment scenarios.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for refinancing scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator can be used to explore refinancing scenarios by adjusting the interest rate and repayment term. Refinancing can potentially lower your monthly payments or reduce the total interest paid. However, it's important to consider any fees or costs associated with refinancing.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For a more detailed analysis, our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a> can help you evaluate the potential savings from refinancing.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include entering incorrect interest rates, not accounting for fees, and misunderstanding the repayment term. These errors can lead to inaccurate results and poor financial planning. It's crucial to double-check all inputs and understand the terms of your loan.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Always verify your loan details with your lender and consider professional advice for complex financial situations.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculation is recommended whenever there are changes in interest rates, loan terms, or financial circumstances. Regularly reviewing your repayment plan ensures that you stay on track and can adjust your strategy as needed.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider recalculating annually or whenever you make significant financial decisions, such as refinancing or making extra payments.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to plan your budget and repayment strategy. Understanding your monthly payment and total interest can help you make informed financial decisions. Consider setting up automatic payments to ensure timely repayments and avoid late fees.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If you're exploring different repayment options, our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a> can provide additional insights.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives include using financial software, consulting with a financial advisor, or using spreadsheets to model different scenarios. Each method has its pros and cons, and the best choice depends on your comfort level and financial complexity.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For those who prefer a hands-on approach, spreadsheets offer flexibility, while professional advice provides personalized insights.
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
                Federal Reserve - Student Loan Data
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on student loans and interest rates, providing insights into national trends and policies.
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
                Consumer Financial Protection Bureau - Student Loans
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on student loans.
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
                Banking regulations and financial education resources to help consumers make informed decisions.
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
                Official tax guidelines and deduction information related to education expenses and student loans.
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
                Investopedia - Student Loans
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained, focusing on student loans and repayment strategies.
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
                NerdWallet - Student Loan Guides
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers, with a focus on student loans and repayment options.
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
      title="Student Loan Repayment Calculator"
      description="Plan your student loan repayment strategy. Estimate monthly payments and total interest costs under different repayment plans."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Student Loan Repayment Calculator" },
        { id: "formula", label: "Student Loan Repayment Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "M = P[r(1+r)^n] / [(1+r)^n – 1]",
        variables: [
          { symbol: "M", description: "Monthly payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "r", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Number of payments (loan term in years × 12)" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $30,000 student loan with a 5% annual interest rate, to be repaid over 10 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Convert annual rate to monthly: 5% / 12 = 0.004167", 
            explanation: "Calculate the monthly interest rate." 
          },
          { 
            label: "Step 2", 
            calculation: "Calculate monthly payment: $30,000 × 0.004167 / (1 - (1 + 0.004167)^-120) = $318.20", 
            explanation: "Determine the monthly payment using the formula." 
          },
          { 
            label: "Step 3", 
            calculation: "Total payment over 10 years: $318.20 × 120 = $38,184", 
            explanation: "Calculate the total payment made over the loan term." 
          }
        ],
        result: "The final result is $38,184, meaning you will pay $8,184 in interest over the life of the loan."
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