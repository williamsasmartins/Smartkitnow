import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CreditCardInterestCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    balance: "", 
    interestRate: "", 
    months: "" 
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
    const balanceValue = parseFloat(inputs.balance) || 0;
    const interestRateValue = parseFloat(inputs.interestRate) / 100 || 0;
    const monthsValue = parseInt(inputs.months, 10) || 0;

    // Validate
    if (balanceValue <= 0 || interestRateValue <= 0 || monthsValue <= 0) {
      return { 
        mainResult: 0, 
        totalInterest: 0, 
        totalPayment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyRate = interestRateValue / 12;
    const totalInterest = balanceValue * monthlyRate * monthsValue;
    const totalPayment = balanceValue + totalInterest;
    const mainResult = totalInterest;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: monthsValue }, (_, i) => ({
      month: i + 1,
      payment: totalPayment / monthsValue,
      principal: balanceValue / monthsValue,
      interest: totalInterest / monthsValue,
      balance: totalPayment - ((totalPayment / monthsValue) * (i + 1))
    }));

    return { 
      mainResult, 
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
    setInputs({ balance: "", interestRate: "", months: "" });
  };

  const faqs = [
    {
      question: "What is a credit card interest calculator and why is it important?",
      answer: "A credit card interest calculator estimates the total interest you will pay on your credit card balance over a specified period. This tool is crucial for budgeting and financial planning, as it helps you understand the cost of carrying debt and make informed decisions about repayment strategies. By knowing the interest costs, you can prioritize debt repayment and avoid financial pitfalls. For more tools, explore our <a href=\"/financial/interest-only-loan\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Interest-Only Loan Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator provides a reliable estimate based on the inputs you provide. However, actual interest costs may vary due to changes in interest rates, additional fees, or variations in your payment schedule. It's essential to use the most accurate and up-to-date information available. For precise financial planning, consider consulting with a financial advisor, especially for complex scenarios."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need your current credit card balance, the annual interest rate, and the repayment period in months. You can find this information on your latest credit card statement or by contacting your card issuer. Ensure the accuracy of these inputs for the most reliable results. If you're unsure about any details, reach out to your credit card provider for clarification."
    },
    {
      question: "Can I use this calculator for specific scenarios like balance transfers?",
      answer: "Yes, this calculator can be used for scenarios like balance transfers, provided you know the new interest rate and any applicable fees. However, keep in mind that balance transfers often come with promotional rates that may change after a certain period. Always read the terms of the balance transfer offer carefully to understand all conditions and potential costs."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include using outdated interest rates, not accounting for additional fees, and underestimating the repayment period. These errors can lead to inaccurate estimates and financial mismanagement. To avoid these mistakes, double-check your inputs and consider potential changes in your financial situation."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculate whenever there are significant changes in your balance, interest rate, or repayment plan. Regular recalculations help you stay informed and adjust your strategy as needed. As a general rule, review your calculations at least quarterly or whenever you receive a new credit card statement."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to plan your repayment strategy. Consider increasing your monthly payments to reduce the total interest paid. If the interest costs are high, explore options like balance transfers or consolidating debt. For more strategies, visit our <a href=\"/financial/refinance-savings\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Refinance Savings Calculator</a>."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives include using financial software or consulting with a financial advisor for personalized advice. These methods may offer more detailed insights but can be more complex or costly. Choose the method that best fits your needs and financial situation. For a quick estimate, this calculator is a convenient and effective tool."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600"/>
              Credit Card Balance
            </Label>
            <Input
              type="number"
              placeholder="e.g., 5000"
              value={inputs.balance}
              onChange={(e) => setInputs({ ...inputs, balance: e.target.value })}
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
              placeholder="e.g., 18"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Repayment Period (Months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 12"
              value={inputs.months}
              onChange={(e) => setInputs({ ...inputs, months: e.target.value })}
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
                      Total Interest Paid
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
                      Total Payment
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalPayment)}
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
                      Monthly Payment
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalPayment / parseInt(inputs.months, 10))}
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
          Understanding Credit Card Interest Calculator
        </h2>
        
        <p className="mb-6">
          Credit card interest can be a significant financial burden if not managed properly. This calculator helps you estimate the total interest you will pay on your credit card balance over a specified period. By inputting your current balance, the annual interest rate, and the repayment period, you can see how much carrying debt will cost you in the long run. This tool is essential for anyone looking to manage their credit card debt effectively and avoid unnecessary financial strain.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial when dealing with credit card interest. An incorrect estimate can lead to unexpected expenses and financial stress. According to recent studies, the average American household carries a credit card balance of over $6,000, with interest rates often exceeding 15%. By using this calculator, you can make informed decisions about your repayment strategy and potentially save hundreds or even thousands of dollars in interest. For more insights, check out our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather your latest credit card statement to find your current balance and interest rate. Enter these values along with your desired repayment period in months. The calculator will then provide you with the total interest you will pay and your monthly payment amount. For additional guidance, refer to our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always aim to pay more than the minimum payment on your credit card. This reduces the principal balance faster, thereby decreasing the total interest paid over time. Consider setting up automatic payments to ensure you never miss a due date.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include regularly reviewing your credit card statements and adjusting your repayment plan as needed. Factors such as changes in interest rates or unexpected expenses can affect your repayment strategy. Stay informed and proactive to minimize your interest payments and maintain financial health.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Credit Card Interest Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is based on the standard method for calculating credit card interest. It takes into account the principal balance, the annual interest rate, and the repayment period. This approach is widely accepted and provides a reliable estimate of the total interest you will pay. Variations of this formula may exist, but they typically involve more complex calculations that are unnecessary for most users.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Total Interest = Principal × (Annual Interest Rate / 12) × Number of Months
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Principal = Current credit card balance</li>
              <li>Annual Interest Rate = Yearly interest rate expressed as a decimal</li>
              <li>Number of Months = Total repayment period in months</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable plays a crucial role in determining the total interest paid. The principal is the amount of debt you currently owe. The annual interest rate is the percentage charged by your credit card issuer for borrowing money. The number of months represents how long you plan to take to repay the balance. Adjusting any of these variables will directly impact the total interest calculated.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your credit card interest calculations is essential for managing your debt effectively. These factors interact in complex ways, and being aware of them can help you make better financial decisions.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is the most significant factor affecting your total interest payments. Higher rates result in more interest paid over time. For example, a 20% interest rate will accrue more interest than a 15% rate on the same balance.
        </p>
        <p className="mb-6">
          To optimize this factor, consider negotiating a lower rate with your credit card issuer or transferring your balance to a card with a lower rate. Check out our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a> for more strategies.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Principal Balance
        </h3>
        <p className="mb-4">
          The principal balance is the amount you owe on your credit card. A higher balance means more interest will accrue. For instance, a $10,000 balance will accumulate more interest than a $5,000 balance at the same interest rate.
        </p>
        <p className="mb-6">
          Reducing your principal balance by making larger payments can significantly decrease the total interest paid. Aim to pay more than the minimum payment each month to lower your balance faster.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Repayment Period
        </h3>
        <p className="mb-4">
          The repayment period is the time you plan to take to pay off your balance. A longer period results in more interest paid, as interest accumulates over time. For example, paying off a balance over 24 months will incur more interest than over 12 months.
        </p>
        <p className="mb-6">
          To minimize interest, aim to shorten your repayment period by increasing your monthly payments. This reduces the time interest has to accrue, saving you money in the long run.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Payment Frequency
        </h3>
        <p className="mb-6">
          Making payments more frequently can reduce the total interest paid. For example, making bi-weekly payments instead of monthly can decrease the principal balance faster, reducing the amount of interest accrued. This strategy effectively shortens the repayment period without increasing the total amount paid each month.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Additional Fees
        </h3>
        <p className="mb-6">
          Be aware of additional fees that may affect your balance, such as late payment fees or annual fees. These can increase your principal balance, leading to more interest paid. Always read the terms and conditions of your credit card agreement to understand all potential fees.
        </p>
      </section>

      {/* SECTION 4: FAQ (1000-1200 words with 8 questions) */}
      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 flex items-start gap-2">
                <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
                {faq.question}
              </h3>
              <div 
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8 space-y-3 prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            </div>
          ))}
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
                Federal Reserve - Credit Card Interest Rates
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on credit card interest rates and regulatory guidelines.
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
                Consumer Financial Protection Bureau - Credit Card Tips
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on credit cards.
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
                FDIC - Managing Credit Card Debt
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and strategies for managing credit card debt effectively.
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
                Internal Revenue Service - Interest Deduction Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information related to interest payments.
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
                Investopedia - Understanding Credit Card Interest
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained, including credit card interest.
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
                NerdWallet - Credit Card Comparison Tools
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers looking to optimize credit card usage.
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
      title="Credit Card Interest Calculator"
      description="Estimate how much interest you will pay on your credit card balance over time. See the cost of carrying debt."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Credit Card Interest Calculator" },
        { id: "formula", label: "Credit Card Interest Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Interest = Principal × (Annual Interest Rate / 12) × Number of Months",
        variables: [
          { symbol: "Principal", description: "Current credit card balance" },
          { symbol: "Annual Interest Rate", description: "Yearly interest rate expressed as a decimal" },
          { symbol: "Number of Months", description: "Total repayment period in months" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $5,000 balance with an 18% annual interest rate, planning to pay it off over 12 months.",
        steps: [
          { 
            step: 1, 
            calculation: "5000 × (0.18 / 12) × 12 = 900", 
            description: "Calculate the total interest paid over the period." 
          },
          { 
            step: 2, 
            calculation: "5000 + 900 = 5900", 
            description: "Determine the total payment including interest." 
          },
          { 
            step: 3, 
            calculation: "5900 / 12 = 491.67", 
            description: "Calculate the monthly payment required." 
          }
        ],
        result: "The total interest paid is $900, and the monthly payment required is approximately $491.67."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💰"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💸"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}