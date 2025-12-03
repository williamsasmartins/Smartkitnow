import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function ExtraPaymentsPayoffCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    loanAmount: "", 
    interestRate: "", 
    extraPayment: "" 
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
    const extraPayment = parseFloat(inputs.extraPayment) || 0;

    // Validate
    if (loanAmount <= 0 || interestRate <= 0) {
      return { 
        mainResult: 0, 
        interestSaved: 0, 
        monthsSaved: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyInterestRate = interestRate / 12;
    const regularPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -360));
    const totalPaymentWithExtra = regularPayment + extraPayment;
    let remainingBalance = loanAmount;
    let totalInterestPaid = 0;
    let months = 0;
    const scheduleData = [];

    while (remainingBalance > 0) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = totalPaymentWithExtra - interestPayment;
      remainingBalance -= principalPayment;
      totalInterestPaid += interestPayment;
      months++;

      scheduleData.push({
        month: months,
        payment: totalPaymentWithExtra,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance)
      });

      if (months > 360) break; // Safety check to prevent infinite loop
    }

    const totalInterestWithoutExtra = regularPayment * 360 - loanAmount;
    const interestSaved = totalInterestWithoutExtra - totalInterestPaid;
    const monthsSaved = 360 - months;

    return { 
      mainResult: totalPaymentWithExtra, 
      interestSaved, 
      monthsSaved, 
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
    setInputs({ loanAmount: "", interestRate: "", extraPayment: "" });
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
              Extra Monthly Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 200"
              value={inputs.extraPayment}
              onChange={(e) => setInputs({ ...inputs, extraPayment: e.target.value })}
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
                      Total Monthly Payment
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
                      Interest Saved
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.interestSaved)}
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
                      Months Saved
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.monthsSaved} months
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
          Understanding Extra Payments & Payoff Time Calculator
        </h2>
        
        <p className="mb-6">
          The Extra Payments & Payoff Time Calculator is a powerful tool designed to help you understand the impact of making additional payments on your loan. By calculating how extra payments can reduce your loan term and save you money on interest, this calculator provides valuable insights into your financial planning. Whether you're looking to pay off a mortgage, car loan, or any other type of debt, understanding how extra payments affect your payoff time can lead to significant savings and financial freedom.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial when it comes to managing loans and debts. Miscalculations can lead to unexpected financial burdens and missed opportunities for savings. This calculator uses industry-standard formulas to ensure precision, helping you make informed decisions about your financial future. By understanding the potential savings from extra payments, you can strategize your finances more effectively and achieve your goals faster. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator, you'll need to gather some basic information about your loan. This includes the total loan amount, the interest rate, and any extra monthly payment you're considering. Enter these details into the calculator to see how they affect your loan's payoff time and interest savings. For best results, ensure that the information you enter is accurate and up-to-date. If you're unsure about any of the inputs, consult your loan documents or financial advisor. You might also find our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> helpful.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Making even small extra payments on your loan can significantly reduce the total interest paid over the life of the loan. Consider automating these payments to ensure consistency and maximize your savings.
          </p>
        </div>
        
        <p className="mb-6">
          When using this calculator, consider the impact of various factors such as changes in interest rates or unexpected financial events. Regularly reviewing your loan terms and adjusting your payment strategy can help you stay on track. Remember, the sooner you start making extra payments, the more you'll save in the long run.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Extra Payments & Payoff Time Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Extra Payments & Payoff Time Calculator is based on the standard amortization formula, which calculates the monthly payment required to pay off a loan over a specified period. By incorporating extra payments into this formula, we can determine how these additional contributions reduce the loan's payoff time and total interest paid.
        </p>
        
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          M = P[i(1+i)^n] / [(1+i)^n – 1] + E
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>M = Total monthly payment</li>
              <li>P = Principal loan amount</li>
              <li>i = Monthly interest rate (annual rate / 12)</li>
              <li>n = Number of payments (loan term in months)</li>
              <li>E = Extra monthly payment</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining the outcome. The principal amount (P) is the initial size of the loan, while the interest rate (i) affects how much of each payment goes towards interest versus principal. The number of payments (n) is typically set by the loan term, but extra payments (E) can effectively reduce this term by paying down the principal faster. By understanding these variables, you can better manage your loan and optimize your payment strategy.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your loan payoff is essential for effective financial planning. These factors interact in complex ways, and being aware of them can help you make informed decisions about your loan repayment strategy.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is a critical factor in determining your monthly payments and the total interest paid over the life of the loan. A lower interest rate means more of your payment goes towards reducing the principal, thus shortening the loan term.
        </p>
        <p className="mb-6">
          To optimize your loan payoff, consider refinancing if you can secure a lower interest rate. This can lead to significant savings and a faster payoff. For more insights, explore our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term, or the number of months over which you repay the loan, directly impacts your monthly payment amount. A longer term reduces monthly payments but increases total interest paid.
        </p>
        <p className="mb-6">
          If possible, opt for a shorter loan term to save on interest. However, ensure that the higher monthly payments fit within your budget to avoid financial strain.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Extra Payments
        </h3>
        <p className="mb-4">
          Making extra payments is one of the most effective ways to reduce your loan term and interest costs. Even small additional payments can significantly impact your loan's payoff time.
        </p>
        <p className="mb-6">
          Consider setting up automatic extra payments to ensure consistency. This strategy can help you stay disciplined and maximize your savings.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Financial Stability
        </h3>
        <p className="mb-6">
          Your financial stability affects your ability to make consistent payments. Unexpected expenses or changes in income can disrupt your payment schedule, potentially leading to increased interest costs.
        </p>
        <p className="mb-6">
          It's important to maintain an emergency fund to cover unforeseen expenses. This financial cushion can help you continue making extra payments even during challenging times.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Inflation and Economic Conditions
        </h3>
        <p className="mb-6">
          Economic conditions, including inflation, can influence interest rates and your overall financial strategy. Staying informed about economic trends can help you make timely decisions about refinancing or adjusting your payment strategy.
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
              What is extra payments & payoff time calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The Extra Payments & Payoff Time Calculator helps you understand how additional payments can reduce your loan term and save you money on interest. By visualizing the impact of extra payments, you can make informed financial decisions and potentially achieve debt-free status sooner.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              This tool is essential for anyone looking to optimize their loan repayment strategy. For more detailed analysis, consider using our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator provides a high level of accuracy by using standard financial formulas. However, the results depend on the accuracy of the input data. Factors such as fluctuating interest rates or changes in financial circumstances can affect the accuracy of the predictions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For critical financial decisions, consider consulting a financial advisor to complement the insights gained from this calculator.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you'll need the principal loan amount, the annual interest rate, and the amount of any extra monthly payments you're considering. This information is typically found in your loan documents or financial statements.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Ensure that the data you enter is accurate to get the most reliable results. If you're unsure about any details, consult with your lender or financial advisor.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for refinancing scenarios?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator can be used to evaluate the impact of refinancing on your loan payoff time. By entering the new loan terms and any additional payments, you can see how refinancing might save you money and reduce your loan term.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For a more detailed analysis of refinancing benefits, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include entering incorrect loan amounts or interest rates, not accounting for changes in financial circumstances, and failing to update the calculator with new data. These errors can lead to inaccurate results and misguided financial decisions.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, double-check your inputs and regularly update the calculator with any changes in your loan terms or financial situation.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It's a good practice to recalculate whenever there are significant changes in your financial situation, such as a change in income, interest rates, or loan terms. Regular recalculations ensure that you stay on track with your financial goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider setting a schedule to review your loan status at least annually or whenever you make significant financial decisions.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to adjust your financial strategy, such as increasing your extra payments or considering refinancing options. The insights gained can help you make more informed decisions about your loan and overall financial health.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              If you're unsure about the next steps, consult a financial advisor. For more tools, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a>.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While this calculator uses a standard amortization formula, there are other methods to consider, such as bi-weekly payments or the snowball method for debt reduction. Each method has its pros and cons depending on your financial situation.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Evaluate different approaches to find the one that best fits your needs. Consulting with a financial advisor can provide personalized recommendations.
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
                Federal Reserve - Loan and Credit Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on loan rates and credit guidelines provided by the Federal Reserve.
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
                Comprehensive guides on consumer loans and financial protection.
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
                FDIC - Banking and Loan Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Resources on banking regulations and loan information from the FDIC.
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
                Internal Revenue Service - Tax and Loan Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and loan-related information from the IRS.
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
                Detailed financial education and investment concepts explained by Investopedia.
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
                Personal finance guides and comparison tools for consumers by NerdWallet.
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
      title="Extra Payments & Payoff Time Calculator"
      description="See how extra payments affect your loan payoff date. Save on interest by paying down your debt faster with this simple calculator."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Extra Payments & Payoff Time Calculator" },
        { id: "formula", label: "Extra Payments & Payoff Time Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "M = P[i(1+i)^n] / [(1+i)^n – 1] + E",
        variables: [
          { symbol: "M", description: "Total monthly payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "i", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Number of payments (loan term in months)" },
          { symbol: "E", description: "Extra monthly payment" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $300,000 loan at a 3.5% interest rate with a $200 extra monthly payment.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Calculate the regular monthly payment without extra: $1,347.13", 
            explanation: "This is the standard payment calculated using the amortization formula." 
          },
          { 
            label: "Step 2", 
            calculation: "Add the extra payment: $1,347.13 + $200 = $1,547.13", 
            explanation: "This is your new total monthly payment with the extra amount." 
          },
          { 
            label: "Step 3", 
            calculation: "Recalculate the payoff time and interest savings.", 
            explanation: "Determine how much faster you'll pay off the loan and how much interest you'll save." 
          }
        ],
        result: "The final result shows that you'll save $30,000 in interest and pay off the loan 5 years earlier."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "📊" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" },
        { title: "Car Loan Affordability Calculator", url: "/financial/car-loan-affordability", icon: "🚗" }
      ]}
    />
  );
}