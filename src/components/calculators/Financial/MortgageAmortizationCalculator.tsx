import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    principal: "", 
    annualInterestRate: "", 
    loanTermYears: "" 
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
    let principal = parseFloat(inputs.principal) || 0;
    const annualInterestRate = parseFloat(inputs.annualInterestRate) || 0;
    const loanTermYears = parseFloat(inputs.loanTermYears) || 0;

    // Validate
    if (principal <= 0 || annualInterestRate <= 0 || loanTermYears <= 0) {
      return { 
        monthlyPayment: 0, 
        totalInterest: 0, 
        totalPayment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    const monthlyPayment = principal * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Generate schedule data for amortization
    let balance = principal;
    const scheduleData = Array.from({ length: numberOfPayments }, (_, i) => {
      const interestPayment = balance * monthlyInterestRate;
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
    setInputs({ principal: "", annualInterestRate: "", loanTermYears: "" });
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
              value={inputs.principal}
              onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
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
              placeholder="e.g., 3.5"
              value={inputs.annualInterestRate}
              onChange={(e) => setInputs({ ...inputs, annualInterestRate: e.target.value })}
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
              value={inputs.loanTermYears}
              onChange={(e) => setInputs({ ...inputs, loanTermYears: e.target.value })}
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
          Understanding Mortgage Payment & Amortization Calculator
        </h2>
        
        <p className="mb-6">
          The Mortgage Payment & Amortization Calculator is an essential tool for homeowners and prospective buyers alike. It allows users to estimate their monthly mortgage payments, including interest, over the life of the loan. This calculator is invaluable for budgeting and financial planning, as it provides a clear picture of the long-term financial commitment involved in purchasing a home. By understanding your monthly obligations, you can make informed decisions about how much house you can afford and plan your finances accordingly.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the realm of mortgages. Even small errors can lead to significant financial discrepancies over the years. For instance, underestimating your monthly payment by just a few dollars could result in thousands of dollars in unexpected expenses over the life of the loan. This calculator helps mitigate such risks by providing precise estimates based on your input data. It's a powerful tool for anyone looking to understand the financial implications of their mortgage. For more detailed insights, you might also want to explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather the necessary information beforehand. You'll need the total loan amount, the annual interest rate, and the loan term in years. Enter these values into the respective fields to calculate your monthly payment, total interest, and total payment over the loan term. For the most accurate results, ensure that the interest rate is expressed as a percentage and the loan term is in years. This tool is designed to be user-friendly, but if you need further assistance, our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> can provide additional guidance.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. A small error in the interest rate or loan term can significantly alter your results. Use this calculator in conjunction with professional financial advice to ensure you're making the best decisions for your financial future.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include regularly updating your calculations as interest rates fluctuate or if you consider refinancing. This calculator can also help you evaluate the impact of making extra payments, which can significantly reduce the total interest paid over the life of the loan. By understanding these dynamics, you can optimize your mortgage strategy and potentially save thousands of dollars.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Mortgage Payment & Amortization Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is derived from the standard mortgage amortization equation. This formula calculates the fixed monthly payment required to pay off a loan over a specified term at a given interest rate. It is a widely accepted method used by financial institutions to determine mortgage payments. The formula takes into account the principal amount, the annual interest rate, and the loan term in years, converting these into a monthly payment schedule.
        </p>
        
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
          Each variable in the formula plays a crucial role. The principal (P) is the initial amount of the loan. The monthly interest rate (r) is the annual rate divided by 12 months. The number of payments (n) is the total number of monthly payments over the loan term. Understanding how these variables interact can help you see how changes in the loan amount, interest rate, or loan term affect your monthly payment and total interest paid. For example, a lower interest rate or a shorter loan term will reduce the total interest paid over the life of the loan.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your mortgage calculations is essential for making informed financial decisions. These factors can significantly impact your monthly payments and the total cost of your mortgage over time. By analyzing these elements, you can better manage your mortgage and potentially save money.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is perhaps the most critical factor affecting your mortgage payment. It determines how much you will pay in interest over the life of the loan. Even a small change in the interest rate can lead to significant differences in your monthly payment and total interest paid. For instance, a 1% increase in the interest rate on a $300,000 loan can add over $50,000 in interest over a 30-year term.
        </p>
        <p className="mb-6">
          To optimize your mortgage, aim for the lowest possible interest rate. This might involve improving your credit score, shopping around for lenders, or considering different loan types. For more strategies on managing your interest rate, visit our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term, or the length of time you have to repay the loan, directly affects your monthly payments and total interest. A longer loan term means lower monthly payments but more interest paid over time. Conversely, a shorter term increases monthly payments but reduces total interest.
        </p>
        <p className="mb-6">
          Consider your financial situation and long-term goals when choosing a loan term. If you can afford higher monthly payments, a shorter term might save you money in the long run. For more insights, our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a> can help evaluate different scenarios.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Principal Amount
        </h3>
        <p className="mb-4">
          The principal amount is the original sum borrowed and forms the basis of your mortgage. The size of your principal affects both your monthly payments and the total interest paid. Larger loans result in higher monthly payments and more interest over the life of the loan.
        </p>
        <p className="mb-6">
          To manage your principal effectively, consider making a larger down payment or opting for a less expensive property. This reduces the amount you need to borrow and can significantly lower your overall costs. Our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a> can provide additional strategies for managing your principal.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Extra Payments
        </h3>
        <p className="mb-6">
          Making extra payments on your mortgage can reduce the total interest paid and shorten the loan term. Even small additional payments can have a significant impact over time. For example, adding $100 to your monthly payment on a $300,000 loan could save you tens of thousands in interest and cut years off your loan term.
        </p>
        <p className="mb-6">
          Consider setting up bi-weekly payments or making lump-sum payments when possible. These strategies can accelerate your mortgage payoff and improve your financial flexibility. For more tips, explore our <a href="/financial/car-loan-affordability" className="text-blue-600 dark:text-blue-400 hover:underline">Car Loan Affordability Calculator</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Broader economic conditions, such as inflation and changes in the federal funds rate, can influence mortgage rates and availability. Staying informed about economic trends can help you anticipate changes in interest rates and make timely decisions about refinancing or locking in a rate.
        </p>
        <p className="mb-6">
          Keep an eye on economic reports and forecasts to better understand how these factors might affect your mortgage. Consulting with a financial advisor can also provide personalized insights and strategies.
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
              What is mortgage payment & amortization calculator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              A mortgage payment & amortization calculator is a tool that helps you estimate your monthly mortgage payments, including interest, over the life of the loan. It provides a detailed breakdown of how much of each payment goes towards the principal and interest, helping you understand the cost of borrowing. This calculator is crucial for budgeting and financial planning, as it allows you to see the long-term financial commitment of a mortgage.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Understanding your mortgage payments can help you make informed decisions about buying a home, refinancing, or making extra payments. For more insights, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              This calculator provides highly accurate estimates based on the inputs you provide. However, it assumes a fixed interest rate and does not account for changes in taxes, insurance, or other fees that may affect your actual payments. For the most accurate results, ensure your inputs are as precise as possible and consider consulting a financial advisor for personalized advice.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Use this calculator as a guide, and remember that actual payments may vary due to changes in interest rates or other factors.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use this calculator, you'll need the principal loan amount, the annual interest rate, and the loan term in years. The principal is the total amount borrowed, while the interest rate is the annual rate charged by the lender. The loan term is the length of time over which the loan will be repaid. These inputs will allow the calculator to estimate your monthly payment, total interest, and total payment over the loan term.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Ensure that the interest rate is expressed as a percentage and the loan term is in years for accurate results. This information is typically found in your loan documents or can be provided by your lender.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for specific scenarios like refinancing?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, this calculator can be used for various scenarios, including refinancing. When refinancing, you can input the new loan amount, interest rate, and term to see how your payments and total interest will change. This can help you determine if refinancing is a financially beneficial decision. However, remember to consider additional costs associated with refinancing, such as closing costs and fees.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For a more detailed analysis of refinancing options, you might want to use our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include entering incorrect interest rates or loan terms, forgetting to account for additional costs like taxes and insurance, and not considering the impact of variable interest rates. These errors can lead to inaccurate estimates and potentially costly financial decisions. Always double-check your inputs and consider consulting a financial advisor for complex scenarios.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, ensure your inputs are accurate and consider using additional tools like our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> for more comprehensive planning.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It's a good idea to recalculate your mortgage payments whenever there's a change in interest rates, if you're considering refinancing, or if you're planning to make extra payments. Regular recalculations can help you stay on top of your financial situation and make informed decisions about your mortgage.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider setting a schedule to review your mortgage annually or whenever your financial situation changes significantly. This proactive approach can help you manage your mortgage more effectively.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results to plan your budget and financial strategy. Understanding your monthly payments and total interest can help you make informed decisions about buying a home, refinancing, or making extra payments. If the results show that your payments are higher than expected, consider adjusting your budget or exploring refinancing options.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For further guidance, consult a financial advisor or use our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a> to explore additional strategies.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While this calculator uses a standard amortization formula, there are alternative methods for calculating mortgage payments, such as interest-only loans or adjustable-rate mortgages. Each method has its pros and cons, depending on your financial situation and goals.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider consulting a financial advisor to explore these alternatives and determine the best approach for your needs. Our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> can provide additional insights into alternative loan structures.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: REFERENCES */}
      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Official References & Resources
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5 shrink-0"/>
            <a 
              href="https://www.federalreserve.gov" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Federal Reserve - Mortgage Rates
            </a>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5 shrink-0"/>
            <a 
              href="https://www.consumerfinance.gov" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Consumer Financial Protection Bureau - Mortgage Basics
            </a>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5 shrink-0"/>
            <a 
              href="https://www.fdic.gov" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              FDIC - Home Loan Information
            </a>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5 shrink-0"/>
            <a 
              href="https://www.irs.gov" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Internal Revenue Service - Tax Information for Homeowners
            </a>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5 shrink-0"/>
            <a 
              href="https://www.investopedia.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Investopedia - Mortgage Guide
            </a>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5 shrink-0"/>
            <a 
              href="https://www.nerdwallet.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              NerdWallet - Home Buying Tips
            </a>
          </li>
        </ul>
      </section>
    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Mortgage Payment & Amortization Calculator"
      description="Estimate your monthly mortgage payments including interest. View the full amortization schedule to track your home equity growth over time."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Mortgage Payment & Amortization Calculator" },
        { id: "formula", label: "Mortgage Payment & Amortization Calculator Formula" },
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
        scenario: "Imagine you have a $300,000 loan with a 3.5% annual interest rate over a 30-year term.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Monthly Interest Rate = 3.5% / 12 = 0.002916", 
            explanation: "Calculate the monthly interest rate by dividing the annual rate by 12." 
          },
          { 
            label: "Step 2", 
            calculation: "Number of Payments = 30 × 12 = 360", 
            explanation: "Determine the total number of payments over the loan term." 
          },
          { 
            label: "Step 3", 
            calculation: "Monthly Payment = $300,000 × 0.002916 / (1 - (1 + 0.002916)^-360)", 
            explanation: "Use the formula to calculate the monthly payment." 
          }
        ],
        result: "The final result is approximately $1,347.13, meaning you will pay this amount monthly over the 30-year term."
      }}
      relatedCalculators={[{"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"Calculator"},{"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"Calculator"},{"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"Calculator"},{"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"Calculator"},{"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"Calculator"},{"title":"Car Loan Affordability Calculator","url":"/financial/car-loan-affordability","icon":"Calculator"}]}
    />
  );
}