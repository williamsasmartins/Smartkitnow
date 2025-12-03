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
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
    const repaymentTerm = parseFloat(inputs.repaymentTerm) || 0;

    // Validate
    if (loanAmount <= 0 || interestRate <= 0 || repaymentTerm <= 0) {
      return { 
        monthlyPayment: 0, 
        totalInterest: 0, 
        totalPayment: 0, 
        scheduleData: [] 
      };
    }

    // Calculate monthly interest rate
    const monthlyRate = interestRate / 12;
    const numberOfPayments = repaymentTerm * 12;

    // Calculate monthly payment using the formula for an annuity
    const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    // Generate amortization schedule
    let balance = loanAmount;
    const scheduleData = Array.from({ length: numberOfPayments }, (_, i) => {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      return {
        month: i + 1,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: balance > 0 ? balance : 0
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
              Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5"
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
          The Student Loan Repayment Calculator is a powerful tool designed to help you plan your student loan repayment strategy effectively. By inputting your loan amount, interest rate, and repayment term, you can estimate your monthly payments and total interest costs under different repayment plans. This calculator is invaluable for students and graduates who are navigating the complexities of student loans, providing clarity and helping to make informed financial decisions.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in managing student loans, as they directly impact your financial health. Miscalculations can lead to unexpected financial burdens, affecting your ability to budget effectively. This tool helps you avoid such pitfalls by providing precise estimates, allowing you to plan your finances with confidence. According to recent studies, understanding your loan repayment can significantly reduce financial stress and improve overall financial well-being. For more insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator, gather your loan details, including the total amount borrowed, the annual interest rate, and the intended repayment term in years. Enter these values into the respective fields to calculate your monthly payment and total interest. For the most accurate results, ensure that the information you provide is up-to-date and reflects any recent changes in your loan terms. For additional guidance, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your loan details before entering them into the calculator. Small errors in input can lead to significant discrepancies in your results. It's advisable to review your loan documents or consult with your loan provider for the most accurate information.
          </p>
        </div>
        
        <p className="mb-6">
          When using this calculator, consider factors such as potential changes in interest rates and your ability to make extra payments. These can affect your repayment timeline and total interest paid. By understanding these variables, you can optimize your repayment strategy and potentially save money over the life of your loan.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Student Loan Repayment Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Student Loan Repayment Calculator uses the standard formula for calculating loan payments, which is derived from the annuity formula. This formula is widely used in financial calculations to determine the periodic payment amount for loans. It considers the principal amount, the interest rate, and the number of payments to provide an accurate monthly payment estimate.
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
          Each variable in the formula plays a crucial role in determining the monthly payment. The principal amount (P) is the total loan amount you owe. The interest rate (r) is the annual rate divided by 12 to get the monthly rate. The number of payments (n) is the total number of monthly payments over the loan term. Adjusting any of these variables will affect your monthly payment and total interest paid. For example, increasing the loan term reduces the monthly payment but increases the total interest paid over time.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your loan repayment is essential for effective financial planning. These factors can significantly impact your monthly payments and the total cost of your loan. By recognizing how these elements interact, you can make informed decisions to optimize your repayment strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is a critical factor in determining your loan repayment. It represents the cost of borrowing and is usually expressed as an annual percentage. A higher interest rate increases your monthly payments and the total interest paid over the life of the loan. For example, a 1% increase in interest rate can significantly raise your monthly payment and total interest.
        </p>
        <p className="mb-6">
          To optimize your loan repayment, consider refinancing options if your current interest rate is high. Refinancing can lower your interest rate, reducing your monthly payments and total interest. For more information, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term is the duration over which you agree to repay the loan, typically expressed in years. A longer loan term reduces your monthly payments but increases the total interest paid. Conversely, a shorter term increases monthly payments but reduces total interest.
        </p>
        <p className="mb-6">
          When choosing a loan term, balance your monthly budget with the total cost of the loan. A shorter term can save you money in the long run if you can afford higher monthly payments. Consider your financial goals and consult with a financial advisor if needed.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Principal Amount
        </h3>
        <p className="mb-4">
          The principal amount is the total sum borrowed. It directly affects your monthly payments and total interest. A larger principal results in higher monthly payments and more interest over time.
        </p>
        <p className="mb-6">
          To manage your principal effectively, consider making extra payments when possible. Extra payments reduce the principal faster, lowering the interest accrued and shortening the loan term. This strategy can lead to significant savings.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Repayment Frequency
        </h3>
        <p className="mb-6">
          The frequency of your repayments can also impact the total cost of your loan. Most student loans require monthly payments, but some lenders offer bi-weekly or weekly options. More frequent payments can reduce the principal faster, decreasing the total interest paid.
        </p>
        <p className="mb-6">
          If your lender allows, consider increasing your repayment frequency to save on interest. This approach can be particularly beneficial if you receive income more frequently than monthly.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Type
        </h3>
        <p className="mb-6">
          Different types of student loans come with varying terms and conditions. Federal loans often have fixed interest rates and flexible repayment plans, while private loans may offer variable rates and less flexibility. Understanding the specifics of your loan type is crucial for effective repayment planning.
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
              A student loan repayment calculator is a tool that helps you estimate your monthly payments and total interest costs based on your loan amount, interest rate, and repayment term. It is important because it provides clarity on your financial obligations, helping you plan and manage your budget effectively.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              By understanding your repayment schedule, you can make informed decisions about refinancing, extra payments, and budgeting. For more insights, explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator provides a high level of accuracy based on the inputs you provide. However, it assumes a fixed interest rate and does not account for changes in your financial situation or additional fees. For precise calculations, ensure your input data is accurate and up-to-date.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consult with a financial advisor for personalized advice, especially if you have variable rate loans or complex financial circumstances.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you need the following information: the total loan amount, the annual interest rate, and the repayment term in years. You can find these details in your loan agreement or by contacting your loan provider.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Ensure that the information you provide is accurate to get the most reliable results. If you have multiple loans, consider calculating each one separately for a comprehensive view.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for refinancing scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator can be used to evaluate refinancing scenarios. By inputting the new loan amount, interest rate, and term, you can compare the new monthly payments and total interest with your current loan. This comparison can help you decide if refinancing is beneficial.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Keep in mind that refinancing may involve fees and other considerations. It's advisable to consult with a financial advisor before proceeding. For more details, visit our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include entering incorrect loan details, not accounting for variable interest rates, and ignoring additional fees or penalties. These errors can lead to inaccurate results and financial misplanning.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, double-check your inputs and consider all aspects of your loan agreement. If in doubt, seek professional advice to ensure your calculations are accurate.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Recalculate your loan repayment whenever there is a change in your loan terms, such as a new interest rate or additional payments. Regular recalculations help you stay on top of your financial obligations and adjust your budget accordingly.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              As a general rule, review your loan details at least annually or whenever you experience significant financial changes.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to plan your budget and repayment strategy. Understanding your monthly payment and total interest can help you make informed decisions about refinancing, extra payments, or adjusting your repayment term.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If the results indicate financial strain, consider consulting a financial advisor for personalized advice. For more tools, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Alternatives include consulting with a financial advisor or using specialized software for complex financial scenarios. These methods may provide more personalized insights, especially for variable rate loans or loans with unique terms.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              While this calculator is a great starting point, professional advice can offer tailored strategies and ensure comprehensive financial planning.
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
                Federal Reserve - Student Loan Insights
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on student loan trends and regulatory guidelines.
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
                Internal Revenue Service - Tax Guidelines
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
        scenario: "Imagine you have a student loan of $30,000 with an interest rate of 5% over a 10-year term.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Calculate the monthly interest rate: 5% / 12 = 0.004167", 
            explanation: "Convert the annual rate to a monthly rate." 
          },
          { 
            label: "Step 2", 
            calculation: "Calculate the number of payments: 10 years × 12 months = 120", 
            explanation: "Determine the total number of monthly payments." 
          },
          { 
            label: "Step 3", 
            calculation: "Calculate the monthly payment using the formula.", 
            explanation: "Apply the formula to find the monthly payment." 
          }
        ],
        result: "The final result is approximately $318.20 per month, meaning you will pay this amount monthly to repay your loan over 10 years."
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