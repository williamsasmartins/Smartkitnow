import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Calendar, Percent, HelpCircle, BookOpen, Info, CheckCircle, TrendingUp } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RefinanceSavingsCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    currentLoanAmount: "", 
    currentInterestRate: "", 
    newInterestRate: "", 
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
    const currentLoanAmount = parseFloat(inputs.currentLoanAmount) || 0;
    const currentInterestRate = parseFloat(inputs.currentInterestRate) / 100 || 0;
    const newInterestRate = parseFloat(inputs.newInterestRate) / 100 || 0;
    const loanTerm = parseInt(inputs.loanTerm) || 0;

    // Validate
    if (currentLoanAmount <= 0 || currentInterestRate <= 0 || newInterestRate <= 0 || loanTerm <= 0) {
      return { 
        monthlySavings: 0, 
        totalSavings: 0, 
        newMonthlyPayment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const currentMonthlyPayment = (currentLoanAmount * currentInterestRate / 12) / 
      (1 - Math.pow(1 + currentInterestRate / 12, -loanTerm * 12));
    const newMonthlyPayment = (currentLoanAmount * newInterestRate / 12) / 
      (1 - Math.pow(1 + newInterestRate / 12, -loanTerm * 12));
    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    const totalSavings = monthlySavings * loanTerm * 12;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: loanTerm * 12 }, (_, i) => ({
      month: i + 1,
      payment: newMonthlyPayment,
      principal: newMonthlyPayment * 0.7,
      interest: newMonthlyPayment * 0.3,
      balance: currentLoanAmount - (newMonthlyPayment * (i + 1))
    }));

    return { 
      monthlySavings, 
      totalSavings, 
      newMonthlyPayment, 
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
    setInputs({ currentLoanAmount: "", currentInterestRate: "", newInterestRate: "", loanTerm: "" });
  };

  const faqs = [
    {
      question: "How do I calculate the break-even point for a mortgage refinance?",
      answer: "Break-even months = Closing costs ÷ Monthly payment savings. Example: current payment $2,100 (6.5% rate), new payment $1,950 (5.8% rate), closing costs $4,500. Monthly savings = $150. Break-even = $4,500 / $150 = 30 months (2.5 years). If you plan to stay in the home more than 30 months, the refinance makes financial sense. Complication: if you reset to a new 30-year term, you extend your payoff date and pay more total interest even at a lower rate. Example: 8 years into a 30-year mortgage, refinancing to a new 30-year adds 8 years of payments. Calculate total interest remaining under both scenarios, not just monthly payment."
    },
    {
      question: "What are the typical closing costs for a mortgage refinance?",
      answer: "2024 average refinance closing costs: $2,000–$5,000 (0.5–2% of loan amount). Major components: origination/lender fee ($500–$1,500), appraisal ($300–$600), title search and insurance ($500–$1,500), recording fees ($25–$250), prepaid interest (daily rate × days until first payment), escrow setup (property taxes + insurance months). Some lenders offer 'no-closing-cost' refinances -- they add the costs to the loan balance or increase the interest rate by 0.125–0.25%. No-closing-cost makes sense if you plan to refinance or sell again within 3–4 years (before the rate penalty costs you more than the avoided fees). Always compare the APR, not just the rate, for the true cost comparison."
    },
    {
      question: "When does it make sense to refinance even if the interest rate difference is small?",
      answer: "The 1% rule (only refinance if rate drops 1%+) is outdated. The actual threshold depends on loan balance and remaining term. A 0.5% rate drop on a $500,000 balance = $2,500/year in interest savings -- a meaningful amount even with $5,000 in closing costs (2-year payback). A 0.5% drop on a $100,000 balance = $500/year -- 10-year payback with $5,000 in costs (not worth it). Also consider: removing PMI via refinance (if equity crossed 20%), switching ARM to fixed-rate (risk management, not savings), or cash-out refinance for home improvements that add value. Refinancing from a 30-year to a 15-year at the same rate increases payment but dramatically reduces total interest."
    },
    {
      question: "How does refinancing affect the total amount of interest paid over the life of the loan?",
      answer: "Monthly payment savings often obscure total interest cost increases when the term resets. Example: $350,000 mortgage at 7%, 20 years remaining, payment $2,716/month. Total remaining interest = $302,640. Refinance to 5.5%, new 30-year, payment $1,988/month. Total interest on new loan = $365,680. Despite $728/month savings, you will pay $63,040 more total interest -- and extend your mortgage by 10 years. Solution: refinance to a 20-year term at 5.5% (payment $2,399/month, $276,000 total interest). You save $26,640 total AND $317/month. For accurate refinance analysis, always calculate (payment × remaining months − remaining balance) for both scenarios."
    },
    {
      question: "Is a cash-out refinance a good idea and what should the funds be used for?",
      answer: "A cash-out refinance replaces your mortgage with a larger loan, extracting equity as cash. You can borrow up to 80% LTV (loan-to-value) in most cases. 2024 rate context: cash-out refinance rates are 6.5–7.5%; credit card rates are 20–24%. The math for debt consolidation: borrowing at 7% to eliminate 22% credit card debt is mathematically compelling. Good uses: high-interest debt payoff, home improvements that increase value (kitchen/bath renovations typically return 60–80%), education, or investing when return exceeds mortgage rate. Bad uses: depreciating assets (cars, vacations), consumer goods. Risk: you are converting unsecured debt to secured debt -- credit card default is bad; mortgage default is foreclosure. Only do this if you address the spending habits that created the high-interest debt."
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
              Current Loan Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 300000"
              value={inputs.currentLoanAmount}
              onChange={(e) => setInputs({ ...inputs, currentLoanAmount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Current Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3.5"
              value={inputs.currentInterestRate}
              onChange={(e) => setInputs({ ...inputs, currentInterestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              New Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2.8"
              value={inputs.newInterestRate}
              onChange={(e) => setInputs({ ...inputs, newInterestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
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
      {results.monthlySavings > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Monthly Savings
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.monthlySavings)}
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
                      Total Savings Over Loan Term
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalSavings)}
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
                      New Monthly Payment
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.newMonthlyPayment)}
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
          Understanding Refinance Savings Calculator
        </h2>
        
        <p className="mb-6">
          The Refinance Savings Calculator is an essential tool for homeowners considering refinancing their mortgage. It allows you to compare your current loan terms with potential new offers, helping you determine if refinancing is financially beneficial. By inputting details such as your current loan amount, interest rate, and the terms of a new loan, you can calculate potential monthly and lifetime savings. This tool is invaluable for making informed decisions about refinancing, ensuring that you understand the financial implications before proceeding.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the refinancing process. Misjudging the potential savings or costs can lead to significant financial consequences. For instance, refinancing might seem appealing due to a lower interest rate, but factors like closing costs and the length of time you plan to stay in your home can affect the overall benefit. The Refinance Savings Calculator helps you account for these variables, providing a clearer picture of the potential savings. This tool is particularly useful when comparing multiple refinancing offers, allowing you to choose the most advantageous option.
        </p>
        
        <p className="mb-6">
          To use the Refinance Savings Calculator effectively, gather all necessary information beforehand. This includes your current loan amount, interest rate, and remaining loan term. Additionally, obtain details about the new loan offer, such as the interest rate and loan term. Enter these values into the calculator to receive an estimate of your monthly savings and total savings over the loan term. For the most accurate results, ensure that all input values are precise and reflect your current financial situation. For more insights, you might want to explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider the break-even point when refinancing. This is the time it takes for the savings from the lower interest rate to cover the costs of refinancing. If you plan to move before reaching this point, refinancing may not be beneficial.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using the Refinance Savings Calculator include regularly updating your inputs as your financial situation changes. Keep an eye on market interest rates, as fluctuations can impact your decision to refinance. Additionally, consider consulting with a financial advisor to interpret the results and explore other financial tools, such as our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>, for a comprehensive view of your mortgage options.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Refinance Savings Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Refinance Savings Calculator uses a standard formula to determine potential savings. This formula calculates the difference between your current monthly payment and the new monthly payment, then multiplies that difference by the number of months in the loan term to find the total savings. This approach is widely accepted in the financial industry for its accuracy and reliability.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Monthly Savings = Current Monthly Payment - New Monthly Payment
          <br />
          Total Savings = Monthly Savings × Loan Term (in months)
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Current Monthly Payment = (Loan Amount × Current Interest Rate / 12) / (1 - (1 + Current Interest Rate / 12)^(-Loan Term × 12))</li>
              <li>New Monthly Payment = (Loan Amount × New Interest Rate / 12) / (1 - (1 + New Interest Rate / 12)^(-Loan Term × 12))</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a critical role in determining your savings. The current monthly payment reflects your existing financial obligation, while the new monthly payment represents the potential reduced cost after refinancing. The difference between these payments indicates your monthly savings, which, when multiplied by the loan term, provides the total savings. Adjusting any of these variables, such as the interest rate or loan term, can significantly impact your results, highlighting the importance of accurate inputs.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your refinancing savings is crucial for making informed decisions. These factors not only affect the calculations but also determine the overall benefit of refinancing. By considering each factor carefully, you can optimize your refinancing strategy and maximize your savings.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rates
        </h3>
        <p className="mb-4">
          Interest rates are perhaps the most significant factor in refinancing decisions. A lower interest rate can lead to substantial savings over the life of the loan. However, it's essential to consider the rate in the context of the broader market and your financial goals. For instance, a small reduction in the interest rate might not justify refinancing if the closing costs are high.
        </p>
        <p className="mb-6">
          To optimize this factor, monitor market trends and consult with lenders to secure the best possible rate. Consider using our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> to explore different loan structures that might offer more favorable rates.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term affects both the monthly payment and the total interest paid over the life of the loan. A longer term typically results in lower monthly payments but higher total interest costs. Conversely, a shorter term increases monthly payments but reduces the total interest paid.
        </p>
        <p className="mb-6">
          When considering refinancing, evaluate how the loan term aligns with your financial goals. For instance, if you plan to stay in your home for a long time, a longer term might be more manageable. However, if you're aiming to pay off the loan quickly, a shorter term could be more beneficial.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Closing Costs
        </h3>
        <p className="mb-4">
          Closing costs are the fees associated with refinancing a mortgage. These can include appraisal fees, title insurance, and origination fees. High closing costs can offset the savings from a lower interest rate, making it crucial to factor them into your decision.
        </p>
        <p className="mb-6">
          To manage closing costs effectively, shop around for lenders and negotiate fees where possible. Some lenders may offer no-closing-cost refinancing options, which can be beneficial if you plan to move or refinance again in the near future.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Break-Even Point
        </h3>
        <p className="mb-6">
          The break-even point is the time it takes for the savings from refinancing to cover the closing costs. Understanding this point is critical, especially if you plan to sell your home or refinance again. If the break-even point is longer than the time you plan to stay in the home, refinancing may not be worthwhile.
        </p>
        <p className="mb-6">
          Calculate the break-even point by dividing the total closing costs by the monthly savings. This will give you the number of months it will take to recoup the costs. Use this information to assess whether refinancing aligns with your financial plans.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Personal Financial Goals
        </h3>
        <p className="mb-6">
          Your personal financial goals should guide your refinancing decision. Whether you're looking to reduce monthly expenses, pay off your mortgage faster, or free up cash for other investments, ensure that refinancing supports these objectives. Consider consulting with a financial advisor to align your refinancing strategy with your broader financial plan.
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
                Federal Reserve - Mortgage Refinancing
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on mortgage refinancing and interest rate trends.
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
                Consumer Financial Protection Bureau - Refinancing Guide
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive guide on refinancing options and consumer rights.
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
                FDIC - Mortgage Loan Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Information on mortgage loans and refinancing from the FDIC.
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
                Internal Revenue Service - Tax Implications of Refinancing
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and implications of refinancing your mortgage.
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
                Investopedia - Refinancing Explained
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed explanations of refinancing processes and strategies.
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
                NerdWallet - Mortgage Refinancing Tips
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and tips for refinancing your mortgage.
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
      title="Refinance Savings Calculator"
      description="Calculate potential savings from refinancing your loan."
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: 'calculator', label: 'Calculator' },
        { id: 'results', label: 'Results' },
        { id: 'how-it-works', label: 'How It Works' },
        { id: 'benefits', label: 'Benefits' },
        { id: 'faq', label: 'FAQ' }
      ]}
    >
      <div className="space-y-6">
        {results.monthlySavings > 0 && (
          <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
              <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        Monthly Savings
                      </p>
                      <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(results.monthlySavings)}
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
                        Total Savings Over Loan Term
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {formatCurrency(results.totalSavings)}
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
                        New Monthly Payment
                      </p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(results.newMonthlyPayment)}
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
      </div>
    </CalculatorVerticalLayout>
  );
}
