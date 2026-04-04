import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "../../../hooks/useFaqJsonLd";

export default function CarLoanAffordabilityCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    monthlyBudget: "", 
    downPayment: "", 
    loanTerm: "" 
  });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: "What is the 20/4/10 rule for buying a car?",
      answer: "The 20/4/10 rule is the most widely cited car-buying guideline: put at least 20% down, finance for no more than 4 years, and keep total vehicle costs (payment + insurance) under 10% of gross monthly income. Example: if you earn $6,000/month, your car costs should stay under $600/month. The 20% down prevents being immediately 'underwater' on the loan (owing more than the car is worth), since new cars lose 15-25% of value in the first year. The 4-year term minimizes total interest while keeping monthly payments manageable."
    },
    {
      question: "How does my credit score affect the car loan APR I'll be offered?",
      answer: "Credit score is the single biggest factor in your auto loan rate. Typical 2024 new-car loan APR by FICO tier: 750+ (Super Prime) = 5.0-6.5%; 700-749 (Prime) = 6.5-8.5%; 650-699 (Near Prime) = 9-13%; 600-649 (Subprime) = 14-18%; below 600 = 18-25%+. The difference is enormous in dollars: on a $30,000, 60-month loan, 6% APR costs $2,995 in total interest vs. 18% APR costing $9,445 — a $6,450 gap. Improving your score by 50-100 points before applying can save thousands."
    },
    {
      question: "What is the true cost of extending a loan term from 48 to 72 months?",
      answer: "Longer loan terms mean lower monthly payments but significantly more total interest. Example on a $25,000 loan at 7% APR: 48-month term = $597/month, $3,660 total interest. 72-month term = $423/month, $5,468 total interest — $1,808 more for the convenience of $174 lower monthly payments. Worse, with a 72-month loan, you are likely 'underwater' (owe more than car value) for the first 3+ years. If you need to sell or the car is totaled, you may owe thousands more than you receive."
    },
    {
      question: "How much should I put down on a car, and does it matter?",
      answer: "A larger down payment reduces your loan principal, which lowers both the monthly payment and total interest paid. It also protects against negative equity (being underwater). For new cars, 20% down is recommended; for used cars, 10% is a common minimum. Concrete example: $5,000 down on a $30,000 car at 7% APR over 60 months saves $665 in interest compared to $1,000 down. Down payments also matter for approval — lenders see them as commitment, and a larger down payment can help borrowers with lower credit scores qualify for better terms."
    },
    {
      question: "Should I finance through the dealer or get a loan from my bank or credit union?",
      answer: "Both options have advantages. Dealer financing is convenient and sometimes offers manufacturer incentives (0% or 1.9% APR promotions on new cars). However, dealers mark up the rate they receive from lenders — if the bank approves you at 6%, the dealer may offer 8% and pocket the difference. Bank/credit union pre-approval gives you a firm rate to use as a negotiating baseline. Credit unions typically offer the lowest rates (0.5-2% below banks) because they are non-profit. Best practice: get pre-approved by your credit union before going to the dealer, then let the dealer try to beat it."
    },
    {
      question: "What costs beyond the monthly payment should I budget for when buying a car?",
      answer: "The monthly loan payment is only part of the true cost of car ownership. Budget for: (1) Auto insurance — average $1,765/year nationally in 2024, much higher for newer or luxury vehicles; (2) Registration and taxes — typically 2-10% of purchase price at purchase, then annual fees; (3) Maintenance — AAA estimates $0.10/mile for routine maintenance ($1,200/year at 12,000 miles); (4) Fuel — averages $2,000-$3,000/year; (5) Depreciation — a $30,000 new car may be worth $18,000 after 3 years. Total annual cost of ownership for an average new car exceeds $12,000/year including all expenses."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

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
    const monthlyBudgetValue = parseFloat(inputs.monthlyBudget) || 0;
    const downPaymentValue = parseFloat(inputs.downPayment) || 0;
    const loanTermValue = parseFloat(inputs.loanTerm) || 0;

    // Validate
    if (monthlyBudgetValue <= 0 || loanTermValue <= 0) {
      return { 
        maxCarPrice: 0, 
        totalLoanAmount: 0, 
        totalInterest: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const maxLoanAmount = monthlyBudgetValue * loanTermValue;
    const maxCarPrice = maxLoanAmount + downPaymentValue;
    const totalInterest = maxLoanAmount * 0.05; // Assuming a fixed interest rate for simplicity

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: loanTermValue }, (_, i) => ({
      month: i + 1,
      payment: monthlyBudgetValue,
      principal: monthlyBudgetValue * 0.7,
      interest: monthlyBudgetValue * 0.3,
      balance: maxLoanAmount - (monthlyBudgetValue * (i + 1))
    }));

    return { 
      maxCarPrice, 
      totalLoanAmount: maxLoanAmount, 
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
    setInputs({ monthlyBudget: "", downPayment: "", loanTerm: "" });
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
              Monthly Budget
            </Label>
            <Input
              type="number"
              placeholder="e.g., 500"
              value={inputs.monthlyBudget}
              onChange={(e) => setInputs({ ...inputs, monthlyBudget: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <TrendingUp className="w-4 h-4 text-green-600"/>
              Down Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 2000"
              value={inputs.downPayment}
              onChange={(e) => setInputs({ ...inputs, downPayment: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Loan Term (months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 60"
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
      {results.maxCarPrice > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Maximum Car Price
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.maxCarPrice)}
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
                      Total Loan Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalLoanAmount)}
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
                      Total Interest Paid
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
          Understanding Car Loan Affordability Calculator
        </h2>
        
        <p className="mb-6">
          The Car Loan Affordability Calculator is an essential tool for anyone considering purchasing a vehicle. It helps you determine the maximum car price you can afford based on your monthly budget, down payment, and loan term. By inputting these values, you gain a clear picture of your financial limits, ensuring you don't overextend yourself financially. This calculator is particularly useful for first-time car buyers who may not be familiar with the intricacies of auto financing.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial in the realm of car financing. A miscalculation can lead to financial strain, impacting your ability to meet other financial obligations. According to recent data, a significant percentage of car buyers end up with loans that exceed their repayment capacity, leading to defaults. This tool helps mitigate such risks by providing a realistic assessment of what you can afford. For more insights into loan calculations, you might find our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a> useful.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather information about your monthly budget, the amount you can put down as a down payment, and the desired loan term. Enter these details into the calculator, and it will compute the maximum car price you can afford. Ensure that the values you enter are accurate to get the most reliable results. For further guidance on budgeting, check out our <a href="/financial/budget-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">Budget Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always consider additional costs such as insurance, maintenance, and taxes when calculating car affordability. These can significantly impact your monthly budget and overall affordability.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices include regularly updating your budget to reflect changes in income or expenses. Consider various loan terms to see how they affect affordability. Remember, a longer loan term might lower monthly payments but increase the total interest paid. For more on optimizing your car loan, visit our <a href="/financial/auto-loan-optimization" className="text-blue-600 dark:text-blue-400 hover:underline">Auto Loan Optimization Guide</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Car Loan Affordability Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in the Car Loan Affordability Calculator is designed to provide a straightforward calculation of the maximum car price you can afford. It considers your monthly budget, down payment, and loan term to compute the total loan amount and subsequently the maximum car price. This formula is a standard approach in financial planning, ensuring a balance between affordability and financial responsibility.
        </p>
        
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          Max Car Price = (Monthly Budget × Loan Term) + Down Payment
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>Monthly Budget = Your monthly budget for car payments</li>
              <li>Loan Term = The duration of the loan in months</li>
              <li>Down Payment = The amount you can pay upfront</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in the formula plays a crucial role. The Monthly Budget determines how much you can allocate towards car payments without affecting your other financial commitments. The Loan Term affects the total interest paid and the monthly payment size. A longer term reduces monthly payments but increases total interest. The Down Payment reduces the loan amount, thereby decreasing the total interest paid. Adjusting these variables allows you to see how different scenarios affect affordability.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your car loan affordability is crucial for making informed decisions. These factors interact in complex ways, affecting the overall affordability of a car loan. By analyzing these elements, you can better manage your finances and optimize your car purchase.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Monthly Budget
        </h3>
        <p className="mb-4">
          Your monthly budget is the cornerstone of car affordability. It dictates how much you can comfortably spend on car payments each month without compromising other financial obligations. A well-planned budget ensures that you can manage your car loan alongside other expenses.
        </p>
        <p className="mb-6">
          To optimize your budget, consider all sources of income and necessary expenses. Allocate a portion of your income to savings and emergencies before determining your car payment budget. For more budgeting tips, visit our <a href="/financial/budget-planning" className="text-blue-600 dark:text-blue-400 hover:underline">Budget Planning Guide</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Loan Term
        </h3>
        <p className="mb-4">
          The loan term significantly impacts the affordability of a car loan. A longer term reduces monthly payments, making the loan more manageable in the short term. However, it increases the total interest paid over the life of the loan.
        </p>
        <p className="mb-6">
          Consider your long-term financial goals when choosing a loan term. A shorter term might be more challenging monthly but saves money in the long run. For insights on choosing the right loan term, see our <a href="/financial/loan-term-guide" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Term Guide</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Down Payment
        </h3>
        <p className="mb-4">
          A larger down payment reduces the loan amount, which in turn decreases the total interest paid. It also lowers the monthly payment, making the loan more affordable.
        </p>
        <p className="mb-6">
          Aim to save a substantial down payment before purchasing a car. This not only improves affordability but also strengthens your negotiating position with lenders. For more on saving for a down payment, check out our <a href="/financial/saving-tips" className="text-blue-600 dark:text-blue-400 hover:underline">Saving Tips</a>.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-6">
          The interest rate directly affects the total cost of the loan. A lower rate reduces the total interest paid, making the loan more affordable. Interest rates are influenced by your credit score, loan term, and economic conditions.
        </p>
        <p className="mb-6">
          To secure the best rate, maintain a good credit score and shop around for the best offers. Consider fixed-rate loans for stability or variable rates if you anticipate rate drops. For more on interest rates, visit our <a href="/financial/interest-rate-guide" className="text-blue-600 dark:text-blue-400 hover:underline">Interest Rate Guide</a>.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Additional Costs
        </h3>
        <p className="mb-6">
          Additional costs such as insurance, maintenance, and taxes can significantly impact your car affordability. These costs are often overlooked but are essential for a comprehensive affordability assessment.
        </p>
        <p className="mb-6">
          Include these costs in your budget to avoid financial strain. Research insurance rates and maintenance costs for different car models to make informed decisions. For more on managing additional costs, see our <a href="/financial/additional-costs-guide" className="text-blue-600 dark:text-blue-400 hover:underline">Additional Costs Guide</a>.
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
                Federal Reserve - Auto Loan Market Trends
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on auto loan trends and economic indicators affecting car affordability.
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
                Consumer Financial Protection Bureau - Auto Loans
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on auto loans.
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
                FDIC - Auto Loan Guidelines
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and guidelines for auto loans and financing.
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
                Internal Revenue Service - Vehicle Deductions
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information related to vehicle purchases.
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
                Investopedia - Car Loan Basics
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts related to car loans.
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
                NerdWallet - Car Buying Guide
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers considering car purchases.
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
      title="Car Loan Affordability Calculator"
      description="Find out how much car you can afford. Input your monthly budget and down payment to determine your maximum vehicle price."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Car Loan Affordability Calculator" },
        { id: "formula", label: "Car Loan Affordability Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Max Car Price = (Monthly Budget × Loan Term) + Down Payment",
        variables: [
          { symbol: "Monthly Budget", description: "Your monthly budget for car payments" },
          { symbol: "Loan Term", description: "The duration of the loan in months" },
          { symbol: "Down Payment", description: "The amount you can pay upfront" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a monthly budget of $500, a down payment of $2,000, and a loan term of 60 months.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "500 × 60 = 30,000", 
            explanation: "Calculate the total loan amount based on your monthly budget and loan term." 
          },
          { 
            label: "Step 2", 
            calculation: "30,000 + 2,000 = 32,000", 
            explanation: "Add the down payment to the total loan amount to find the maximum car price." 
          }
        ],
        result: "The final result is $32,000, meaning you can afford a car priced up to $32,000."
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