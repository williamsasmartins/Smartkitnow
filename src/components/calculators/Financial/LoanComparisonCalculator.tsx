import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const faqs = [
  {
    question: "What should I compare beyond the monthly payment when evaluating two loans?",
    answer: `Monthly payment is the least important metric when comparing loans — it only tells you cash flow, not true cost. The critical numbers to compare: (1) Total interest paid over the life of each loan — this is the real cost. A 72-month loan at 5% on $20,000 costs $3,200 in interest; a 48-month loan at 6% costs $2,550 — the shorter loan is cheaper despite the higher rate. (2) APR (not just the stated rate) — APR includes origination fees, points, and other charges, making it the true apples-to-apples comparison number. (3) Prepayment penalties — a loan with a lower rate but prepayment penalty can cost more if you plan to pay it off early.`
  },
  {
    question: "What is the difference between APR and interest rate, and which matters for loan comparison?",
    answer: `The interest rate is the annual cost of borrowing the principal. APR (Annual Percentage Rate) includes the interest rate plus all mandatory fees — origination fees, discount points, broker fees — expressed as a single annual rate. TILA (Truth in Lending Act) requires lenders to disclose APR. For comparison purposes, APR is always the correct metric because it captures the true cost. Example: Loan A = 6.5% rate, no fees vs. Loan B = 6.0% rate, 1% origination fee on a $30,000 loan. Loan B's APR ≈ 6.5% once the $300 fee is factored in — they are actually equivalent despite Loan B's lower stated rate.`
  },
  {
    question: "How do I calculate the breakeven point when a lower-rate loan has higher fees?",
    answer: `The breakeven point is how long you need to keep the loan to recover the extra upfront costs. Formula: Breakeven months = Fees paid ÷ Monthly savings. Example: Loan A = $20,000 at 7.5% for 60 months = $400.76/month. Loan B = $20,000 at 6.5% for 60 months, but with a $500 origination fee = $391.32/month. Monthly savings = $9.44. Breakeven = $500 ÷ $9.44 ≈ 53 months. If you plan to keep the loan for at least 53 months, Loan B wins. If you'll pay it off early, Loan A is better despite the higher rate.`
  },
  {
    question: "When does a fixed-rate loan make more sense than a variable-rate loan?",
    answer: `Fixed-rate loans lock your rate for the entire term — predictable and safe. Variable-rate loans (often called adjustable-rate) start lower but can rise with market rates. Fixed-rate is better when: (1) Current rates are historically low and likely to rise, (2) You plan to hold the loan for its full term, (3) You want payment certainty for budgeting. Variable-rate can be better when: (1) You plan to pay off the loan quickly (within the initial fixed-period), (2) Rates are high and expected to fall, (3) The initial rate discount is significant (1.5%+ lower than fixed). For most 5+ year loans, fixed-rate provides more protection against rate volatility.`
  },
  {
    question: "How much does loan term affect total cost? Is a shorter term always better?",
    answer: `Shorter terms pay significantly less total interest but require higher monthly payments. On a $25,000 loan at 7% APR: 36-month term = $772/month, $2,779 total interest. 60-month term = $495/month, $4,712 total interest. 84-month term = $376/month, $6,574 total interest. A shorter term is better if: your cash flow can handle the higher payment, and you want to minimize total cost. A longer term is better if: cash flow is tight, or the difference in monthly payment could be invested at a higher return than the loan rate (opportunity cost). If your loan rate is 5% but you can earn 8% investing the difference, the math may favor the longer term.`
  },
  {
    question: "What is the impact of making extra principal payments, and should I compare loans based on this?",
    answer: `Extra payments directly reduce the principal, which reduces the interest accruing on every future payment — the effect compounds over time. On a $30,000, 60-month loan at 7% APR: adding just $100/month extra reduces the payoff from 60 to 45 months and saves $1,240 in interest. When comparing two loans, factor in whether you plan to make extra payments: a loan with no prepayment penalty is worth a small rate premium over one that charges 2-3% of remaining balance for early payoff. Always confirm prepayment policy before signing — it can make a lower-rate loan more expensive than it appears.`
  }
];

export default function LoanComparisonCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    loan1Amount: "", 
    loan1Rate: "", 
    loan1Term: "", 
    loan2Amount: "", 
    loan2Rate: "", 
    loan2Term: "" 
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
    const loan1Amount = parseFloat(inputs.loan1Amount) || 0;
    const loan1Rate = parseFloat(inputs.loan1Rate) / 100 / 12 || 0;
    const loan1Term = parseFloat(inputs.loan1Term) * 12 || 0;

    const loan2Amount = parseFloat(inputs.loan2Amount) || 0;
    const loan2Rate = parseFloat(inputs.loan2Rate) / 100 / 12 || 0;
    const loan2Term = parseFloat(inputs.loan2Term) * 12 || 0;

    // Validate
    if (loan1Amount <= 0 || loan1Rate <= 0 || loan1Term <= 0 || loan2Amount <= 0 || loan2Rate <= 0 || loan2Term <= 0) {
      return { 
        loan1MonthlyPayment: 0, 
        loan2MonthlyPayment: 0, 
        loan1TotalCost: 0, 
        loan2TotalCost: 0, 
        scheduleData: [] 
      };
    }

    // Calculate monthly payments
    const loan1MonthlyPayment = loan1Amount * loan1Rate / (1 - Math.pow(1 + loan1Rate, -loan1Term));
    const loan2MonthlyPayment = loan2Amount * loan2Rate / (1 - Math.pow(1 + loan2Rate, -loan2Term));

    // Calculate total costs
    const loan1TotalCost = loan1MonthlyPayment * loan1Term;
    const loan2TotalCost = loan2MonthlyPayment * loan2Term;

    // Generate schedule data
    const scheduleData = Array.from({ length: Math.max(loan1Term, loan2Term) }, (_, i) => ({
      month: i + 1,
      loan1Payment: i < loan1Term ? loan1MonthlyPayment : 0,
      loan2Payment: i < loan2Term ? loan2MonthlyPayment : 0,
      loan1Balance: i < loan1Term ? loan1Amount - (loan1MonthlyPayment * (i + 1)) : 0,
      loan2Balance: i < loan2Term ? loan2Amount - (loan2MonthlyPayment * (i + 1)) : 0
    }));

    return { 
      loan1MonthlyPayment, 
      loan2MonthlyPayment, 
      loan1TotalCost, 
      loan2TotalCost, 
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
    setInputs({ loan1Amount: "", loan1Rate: "", loan1Term: "", loan2Amount: "", loan2Rate: "", loan2Term: "" });
  };

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
              Loan 1 Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 300000"
              value={inputs.loan1Amount}
              onChange={(e) => setInputs({ ...inputs, loan1Amount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Loan 1 Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3.5"
              value={inputs.loan1Rate}
              onChange={(e) => setInputs({ ...inputs, loan1Rate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Loan 1 Term (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.loan1Term}
              onChange={(e) => setInputs({ ...inputs, loan1Term: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-blue-600"/>
              Loan 2 Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 300000"
              value={inputs.loan2Amount}
              onChange={(e) => setInputs({ ...inputs, loan2Amount: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Loan 2 Interest Rate (%)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 3.5"
              value={inputs.loan2Rate}
              onChange={(e) => setInputs({ ...inputs, loan2Rate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Loan 2 Term (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.loan2Term}
              onChange={(e) => setInputs({ ...inputs, loan2Term: e.target.value })}
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
      {results.loan1MonthlyPayment > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Loan 1 Monthly Payment
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.loan1MonthlyPayment)}
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
                      Loan 2 Monthly Payment
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.loan2MonthlyPayment)}
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
                      Loan 1 Total Cost
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.loan1TotalCost)}
                    </p>
                  </div>
                  <Calculator className="w-10 h-10 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            {/* SECONDARY RESULT 3 */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Loan 2 Total Cost
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.loan2TotalCost)}
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
                        <TableHead className="font-semibold">Loan 1 Payment</TableHead>
                        <TableHead className="font-semibold">Loan 2 Payment</TableHead>
                        <TableHead className="font-semibold">Loan 1 Balance</TableHead>
                        <TableHead className="font-semibold">Loan 2 Balance</TableHead>
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
                            <TableCell>{formatCurrency(row.loan1Payment)}</TableCell>
                            <TableCell>{formatCurrency(row.loan2Payment)}</TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.loan1Balance)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {formatCurrency(row.loan2Balance)}
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
          Understanding Loan Comparison Calculator
        </h2>
        
        <p className="mb-6">
          The Loan Comparison Calculator is a powerful tool designed to help you evaluate two different loan options side-by-side. Whether you're considering a mortgage, auto loan, or personal loan, this calculator provides a clear picture of the financial implications of each option. By inputting the loan amount, interest rate, and term for each loan, you can quickly see how the monthly payments and total costs compare. This is particularly useful when you're trying to decide between loans with different interest rates or terms, as it allows you to make an informed decision based on your financial goals and budget.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial when comparing loans, as even small differences in interest rates or terms can lead to significant variations in total cost over time. For instance, a 0.5% difference in interest rate on a $300,000 mortgage can result in thousands of dollars in additional interest payments over the life of the loan. This calculator helps you avoid costly mistakes by providing precise calculations, enabling you to choose the most cost-effective loan. It's an essential tool for anyone looking to optimize their financial decisions and save money in the long run.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather all necessary information about the loans you're considering. This includes the loan amount, interest rate, and term for each loan. Enter these details into the calculator, and it will compute the monthly payments and total costs for each loan. This step-by-step approach ensures you have a clear understanding of each loan's financial impact. For more detailed insights, you can also explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> to understand how principal, rate, and term affect your payments.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            When comparing loans, always consider the total cost over the life of the loan, not just the monthly payment. A lower monthly payment might seem attractive, but it could mean paying more in interest over time. Use this calculator to balance monthly affordability with long-term savings.
          </p>
        </div>
        
        <p className="mb-6">
          For best results, ensure the data you enter is accurate and up-to-date. Consider factors such as potential changes in interest rates or your financial situation that could affect your ability to repay the loan. By regularly reviewing your loan options with this calculator, you can stay informed and make adjustments as needed. Additionally, explore our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a> for a deeper dive into how amortization schedules impact your payments.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Loan Comparison Calculator Formula
        </h2>
        
        <p className="mb-6">
          The Loan Comparison Calculator uses a standard formula to calculate the monthly payment for each loan option. This formula is derived from the annuity formula used to calculate the present value of a series of future payments. It takes into account the loan amount, interest rate, and term to provide an accurate monthly payment figure. This approach is widely used in the financial industry because it provides a consistent method for comparing different loan options.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          M = P[r(1 + r)^n] / [(1 + r)^n – 1]
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>P = Loan principal (amount borrowed)</li>
              <li>r = Monthly interest rate (annual rate / 12)</li>
              <li>n = Number of payments (loan term in months)</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          In this formula, P represents the principal amount of the loan, r is the monthly interest rate (calculated by dividing the annual rate by 12), and n is the total number of payments (the loan term in months). The formula calculates the monthly payment (M) by considering both the principal and the interest that will accrue over the life of the loan. This ensures that each payment covers both the interest and a portion of the principal, gradually reducing the balance to zero by the end of the term.
        </p>
        <p className="mb-4">
          Understanding how each variable affects the calculation is crucial. For example, a higher interest rate (r) will increase the monthly payment, while a longer term (n) will decrease it. However, extending the term also increases the total interest paid over the life of the loan. By adjusting these variables, you can see how different loan structures impact your monthly budget and overall financial health.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your loan comparison results is essential for making informed financial decisions. These factors interact in complex ways, affecting both the monthly payments and the total cost of each loan option. By considering these elements, you can better assess which loan aligns with your financial goals.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is one of the most significant factors affecting your loan's cost. It determines how much you'll pay in interest over the life of the loan. A lower interest rate reduces both your monthly payment and the total interest paid. For example, a 1% decrease in interest rate on a $200,000 loan can save you thousands in interest payments.
        </p>
        <p className="mb-6">
          When comparing loans, look for the lowest interest rate available, but also consider other terms and conditions. Sometimes, a slightly higher rate might come with more favorable terms, such as no prepayment penalties. Use our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> to explore how different interest structures affect your payments.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term, or the length of time you have to repay the loan, directly impacts your monthly payment and total interest cost. A longer term results in lower monthly payments but increases the total interest paid. Conversely, a shorter term increases monthly payments but reduces total interest.
        </p>
        <p className="mb-6">
          Consider your financial situation and goals when choosing a loan term. If you can afford higher monthly payments, a shorter term can save you money in the long run. However, if cash flow is a concern, a longer term might be more manageable. Evaluate your options with our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Amount
        </h3>
        <p className="mb-4">
          The principal amount of the loan is the starting point for all calculations. Larger loans result in higher monthly payments and total interest costs. It's important to borrow only what you need to minimize these expenses.
        </p>
        <p className="mb-6">
          Before deciding on a loan amount, assess your financial needs and repayment ability. Consider other financial goals and obligations to ensure you can comfortably manage the loan payments. For more insights, check out our <a href="/financial/refinance-savings" className="text-blue-600 dark:text-blue-400 hover:underline">Refinance Savings Calculator</a> to see how refinancing might affect your loan amount and terms.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Fees and Additional Costs
        </h3>
        <p className="mb-6">
          Many loans come with additional fees, such as origination fees, closing costs, and prepayment penalties. These costs can significantly impact the total cost of the loan. It's crucial to factor these into your comparison to get a true picture of each loan's cost.
        </p>
        <p className="mb-6">
          Always read the fine print and ask lenders about any fees associated with the loan. Sometimes, a loan with a slightly higher interest rate but lower fees can be more cost-effective. Consider these factors carefully when comparing loans.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Credit Score
        </h3>
        <p className="mb-6">
          Your credit score plays a crucial role in determining the interest rate and terms you're offered. A higher credit score typically results in lower interest rates and better loan terms. It's essential to maintain a good credit score to access the most favorable loan options.
        </p>
        <p className="mb-6">
          Before applying for a loan, check your credit report and address any issues that might negatively affect your score. Improving your credit score can save you money by qualifying you for lower interest rates. For more guidance, explore our <a href="/financial/heloc-payment-estimator" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC Payment Estimator</a> to see how credit impacts home equity lines of credit.
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
                Federal Reserve - Interest Rates
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on interest rates and economic indicators from the Federal Reserve.
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
                Banking regulations and deposit insurance information from the FDIC.
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
                Internal Revenue Service - Tax Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information from the IRS.
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
                Detailed financial education and investment concepts explained on Investopedia.
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
                Personal finance guides and comparison tools for consumers on NerdWallet.
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
      title="Loan Comparison Calculator"
      description="Compare two different loans side-by-side. Analyze interest rates, terms, and total costs to choose the best financing option."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Loan Comparison Calculator" },
        { id: "formula", label: "Loan Comparison Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "M = P[r(1 + r)^n] / [(1 + r)^n – 1]",
        variables: [
          { symbol: "P", description: "Loan principal (amount borrowed)" },
          { symbol: "r", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Number of payments (loan term in months)" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have two loan options: Loan 1 with a principal of $200,000, an interest rate of 3.5%, and a term of 30 years; Loan 2 with a principal of $200,000, an interest rate of 3.0%, and a term of 30 years.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Loan 1: $200,000 × 0.035 / 12 = $583.33", 
            explanation: "Calculate the monthly interest for Loan 1." 
          },
          { 
            label: "Step 2", 
            calculation: "Loan 2: $200,000 × 0.03 / 12 = $500.00", 
            explanation: "Calculate the monthly interest for Loan 2." 
          },
          { 
            label: "Step 3", 
            calculation: "Compare the monthly payments and total costs.", 
            explanation: "Determine which loan offers better terms based on your financial situation." 
          }
        ],
        result: "The final result shows that Loan 2 offers a lower monthly payment and total cost, making it the more cost-effective option."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💳" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "HELOC Payment Estimator", "url": "/financial/heloc-payment-estimator", "icon": "🏦" }
      ]}
    />
  );
}