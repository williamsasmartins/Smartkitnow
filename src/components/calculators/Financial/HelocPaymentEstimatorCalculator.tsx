import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";

export default function HelocPaymentEstimatorCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    loanAmount: "", 
    interestRate: "", 
    drawPeriod: "", 
    repaymentPeriod: "" 
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
    // Parse inputs
    let loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
    const drawPeriod = parseInt(inputs.drawPeriod) || 0;
    const repaymentPeriod = parseInt(inputs.repaymentPeriod) || 0;

    // Validate
    if (loanAmount <= 0 || interestRate <= 0 || drawPeriod <= 0 || repaymentPeriod <= 0) {
      return { 
        mainResult: 0, 
        drawPeriodPayment: 0, 
        repaymentPeriodPayment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const drawPeriodPayment = loanAmount * interestRate / 12;
    const repaymentPeriodPayment = (loanAmount * interestRate / 12) / (1 - Math.pow(1 + interestRate / 12, -repaymentPeriod * 12));
    const mainResult = drawPeriodPayment + repaymentPeriodPayment;

    // Generate schedule data
    const scheduleData = Array.from({ length: drawPeriod + repaymentPeriod }, (_, i) => ({
      month: i + 1,
      payment: i < drawPeriod ? drawPeriodPayment : repaymentPeriodPayment,
      principal: i < drawPeriod ? 0 : repaymentPeriodPayment - (loanAmount * interestRate / 12),
      interest: i < drawPeriod ? drawPeriodPayment : (loanAmount * interestRate / 12),
      balance: loanAmount - (i < drawPeriod ? 0 : (repaymentPeriodPayment - (loanAmount * interestRate / 12)) * (i - drawPeriod + 1))
    }));

    return { 
      mainResult, 
      drawPeriodPayment, 
      repaymentPeriodPayment, 
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
    setInputs({ loanAmount: "", interestRate: "", drawPeriod: "", repaymentPeriod: "" });
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
              placeholder="e.g., 100000"
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
              placeholder="e.g., 4.5"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Draw Period (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.drawPeriod}
              onChange={(e) => setInputs({ ...inputs, drawPeriod: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Repayment Period (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.repaymentPeriod}
              onChange={(e) => setInputs({ ...inputs, repaymentPeriod: e.target.value })}
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
                      Draw Period Payment
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.drawPeriodPayment)}
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
                      Repayment Period Payment
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.repaymentPeriodPayment)}
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
          Understanding HELOC Payment Estimator
        </h2>
        
        <p className="mb-6">
          A Home Equity Line of Credit (HELOC) is a flexible loan option for homeowners that allows them to borrow against the equity in their home. The HELOC Payment Estimator is a valuable tool that helps you calculate the monthly payments required during both the draw period and the repayment period of a HELOC. This tool is essential for homeowners considering a HELOC, as it provides a clear picture of the financial commitment involved. Whether you're planning home improvements, consolidating debt, or covering unexpected expenses, understanding your payment obligations is crucial for financial planning.
        </p>
        
        <p className="mb-6">
          Accurate calculations are vital when dealing with HELOCs because they directly impact your financial stability. Miscalculations can lead to unexpected financial strain, affecting your ability to meet other financial obligations. According to recent studies, a significant percentage of homeowners underestimate their HELOC payments, leading to financial stress. By using this estimator, you can avoid such pitfalls and make informed decisions about your borrowing needs. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your loan amount, interest rate, draw period, and repayment period. Enter these details into the respective fields to calculate your monthly payments. This tool provides an easy-to-understand breakdown of your payment obligations, helping you plan your finances better. For additional guidance, visit our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always double-check your inputs for accuracy. Small errors in the loan amount or interest rate can lead to significant differences in your estimated payments. Ensure that all values are current and reflect your financial situation accurately.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this estimator include regularly updating your inputs as your financial situation changes. Consider how fluctuations in interest rates might affect your payments. Staying informed about market trends can help you optimize your HELOC strategy and minimize costs.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          HELOC Payment Estimator Formula
        </h2>
        
        <p className="mb-6">
          The HELOC Payment Estimator uses a standard formula to calculate your monthly payments during both the draw and repayment periods. This formula considers the loan amount, interest rate, and the duration of each period. The draw period payments are typically interest-only, while the repayment period includes both principal and interest.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Monthly Payment = (Loan Amount × Interest Rate / 12) / (1 - (1 + Interest Rate / 12)^(-Repayment Period × 12))
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Loan Amount = Total amount borrowed</li>
              <li>Interest Rate = Annual interest rate (as a decimal)</li>
              <li>Repayment Period = Number of years for repayment</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role in determining your monthly payment. The loan amount is the total credit line available, while the interest rate affects how much you'll pay in interest each month. The repayment period determines how long you'll be making payments, influencing the size of each installment. Adjusting any of these variables can significantly impact your financial planning.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your HELOC payments is essential for effective financial planning. These factors are interconnected and can vary based on your personal financial situation and market conditions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is a critical factor in determining your monthly payments. A higher rate increases the cost of borrowing, while a lower rate reduces it. Interest rates can fluctuate based on economic conditions, so it's important to stay informed about market trends.
        </p>
        <p className="mb-6">
          To optimize your HELOC, consider locking in a fixed rate if you anticipate rising interest rates. This can provide stability and predictability in your monthly payments. For more strategies, explore our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Amount
        </h3>
        <p className="mb-4">
          The loan amount is the total credit line available to you. It's determined by the equity in your home and the lender's policies. A larger loan amount results in higher monthly payments, while a smaller amount reduces your financial obligation.
        </p>
        <p className="mb-6">
          Consider borrowing only what you need to minimize your debt and interest payments. Evaluate your financial goals and ensure that the loan amount aligns with your long-term plans.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Draw Period
        </h3>
        <p className="mb-4">
          The draw period is the initial phase of a HELOC, during which you can borrow against your credit line. Payments during this period are typically interest-only, which can make them more affordable.
        </p>
        <p className="mb-6">
          It's important to plan for the transition from the draw period to the repayment period, as payments will increase when you begin repaying the principal. Consider setting aside funds during the draw period to ease this transition.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Repayment Period
        </h3>
        <p className="mb-6">
          The repayment period follows the draw period and requires you to repay both principal and interest. This period typically lasts 10 to 20 years, depending on your agreement with the lender. Planning for this phase is crucial, as payments will be higher than during the draw period.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Economic Conditions
        </h3>
        <p className="mb-6">
          Economic conditions, such as inflation and changes in the housing market, can affect your HELOC payments. It's important to stay informed about these factors and adjust your financial strategy accordingly. For instance, rising inflation may lead to higher interest rates, impacting your monthly payments.
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
              What is a HELOC Payment Estimator and why is it important?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              A HELOC Payment Estimator is a tool designed to calculate the monthly payments required for a Home Equity Line of Credit. It helps you understand the financial commitment involved in a HELOC by providing a detailed breakdown of payments during both the draw and repayment periods. This estimator is crucial for homeowners who want to manage their finances effectively and avoid unexpected financial burdens.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Using this estimator allows you to plan your budget accurately and make informed decisions about borrowing. For more information, check out our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a>.
            </p>
          </div>

          {/* QUESTION 2 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              The HELOC Payment Estimator is highly accurate, provided that you input correct and up-to-date information. However, it's important to note that the calculator's results are estimates and may not account for all variables, such as changes in interest rates or additional fees imposed by lenders. For precise financial planning, consider consulting with a financial advisor.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To ensure accuracy, double-check your inputs and update them regularly as your financial situation changes.
            </p>
          </div>

          {/* QUESTION 3 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What information do I need to use this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              To use the HELOC Payment Estimator, you'll need the following information: the total loan amount, the annual interest rate, the length of the draw period, and the length of the repayment period. You can find these details in your loan agreement or by contacting your lender. Ensure that the interest rate is expressed as a percentage and the periods are in years.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Accurate data entry is crucial for obtaining reliable results, so take the time to gather and verify this information before using the calculator.
            </p>
          </div>

          {/* QUESTION 4 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Can I use this calculator for refinancing my HELOC?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Yes, the HELOC Payment Estimator can be used to evaluate the potential impact of refinancing your HELOC. By adjusting the loan amount, interest rate, and repayment terms, you can compare different refinancing options and determine which one best suits your financial goals. Keep in mind that refinancing may involve additional costs, such as closing fees, which should be considered in your calculations.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For more detailed analysis, consider using our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a>.
            </p>
          </div>

          {/* QUESTION 5 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What are common mistakes people make with this calculation?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Common mistakes include entering incorrect loan amounts or interest rates, failing to account for changes in interest rates, and not considering additional fees or charges. These errors can lead to inaccurate payment estimates and financial planning challenges. It's also important to update your inputs regularly to reflect any changes in your financial situation.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              To avoid these mistakes, double-check your inputs and consult with a financial advisor if you're unsure about any aspect of the calculation.
            </p>
          </div>

          {/* QUESTION 6 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How often should I recalculate?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              It's advisable to recalculate your HELOC payments whenever there are significant changes in your financial situation, such as changes in interest rates, loan amounts, or repayment terms. Regular recalculation helps ensure that your financial planning remains accurate and up-to-date.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              As a general rule, consider recalculating at least once a year or whenever you receive new financial information from your lender.
            </p>
          </div>

          {/* QUESTION 7 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What should I do with these results?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              Use the results from the HELOC Payment Estimator to plan your monthly budget and ensure that you can comfortably meet your payment obligations. Consider setting aside additional funds to cover any unexpected expenses or changes in interest rates. If the estimated payments are higher than anticipated, explore options for reducing your loan amount or refinancing.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              For further guidance, consult with a financial advisor or explore our <a href="/financial/car-loan-affordability" className="text-blue-600 dark:text-blue-400 hover:underline">Car Loan Affordability Calculator</a> for additional budgeting tools.
            </p>
          </div>

          {/* QUESTION 8 */}
          <div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              Are there alternatives to this calculation method?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 mb-3">
              While the HELOC Payment Estimator provides a reliable method for calculating payments, there are alternative approaches, such as consulting with a financial advisor or using spreadsheet software to create custom calculations. These alternatives can offer more personalized insights and account for unique financial situations.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Consider exploring these options if you have complex financial needs or require a more detailed analysis of your HELOC payments.
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
                Federal Reserve - Home Equity Lines of Credit
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on HELOCs, including interest rates and regulatory guidelines.
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
                Consumer Financial Protection Bureau - HELOC Guide
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on HELOCs.
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
                FDIC - HELOC Resources
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and deposit insurance information related to HELOCs.
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
                Internal Revenue Service - Home Equity Loan Interest Deduction
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information for home equity loans.
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
                Investopedia - Understanding HELOCs
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts related to HELOCs.
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
                NerdWallet - HELOC vs. Home Equity Loan
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for HELOCs and home equity loans.
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
      title="HELOC Payment Estimator"
      description="Estimate monthly payments for a Home Equity Line of Credit (HELOC). Calculate costs during both the draw period and the repayment period."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding HELOC Payment Estimator" },
        { id: "formula", label: "HELOC Payment Estimator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Monthly Payment = (Loan Amount × Interest Rate / 12) / (1 - (1 + Interest Rate / 12)^(-Repayment Period × 12))",
        variables: [
          { symbol: "Loan Amount", description: "Total amount borrowed" },
          { symbol: "Interest Rate", description: "Annual interest rate (as a decimal)" },
          { symbol: "Repayment Period", description: "Number of years for repayment" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $100,000 HELOC with a 4.5% interest rate, a 10-year draw period, and a 20-year repayment period.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100000 × 0.045 / 12 = 375", 
            explanation: "Calculate the monthly interest payment during the draw period." 
          },
          { 
            label: "Step 2", 
            calculation: "375 / (1 - (1 + 0.045 / 12)^(-240)) = 632.65", 
            explanation: "Determine the monthly payment during the repayment period." 
          },
          { 
            label: "Step 3", 
            calculation: "375 + 632.65 = 1007.65", 
            explanation: "Total monthly payment combining both periods." 
          }
        ],
        result: "The final result is $1,007.65, meaning this is your estimated monthly payment during the repayment period."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💳" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "Car Loan Affordability Calculator", "url": "/financial/car-loan-affordability", "icon": "🚗" }
      ]}
    />
  );
}