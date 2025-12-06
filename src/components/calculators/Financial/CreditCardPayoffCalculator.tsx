import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Calendar, Percent, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CreditCardPayoffCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    balance: "", 
    interestRate: "", 
    monthlyPayment: "" 
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
    let balance = parseFloat(inputs.balance) || 0;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const monthlyPayment = parseFloat(inputs.monthlyPayment) || 0;

    // Validate
    if (balance <= 0 || interestRate <= 0 || monthlyPayment <= 0) {
      return { 
        monthsToPayoff: 0, 
        totalInterest: 0, 
        totalPayment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    let monthsToPayoff = 0;
    let totalInterest = 0;
    let totalPayment = 0;
    let currentBalance = balance;
    const monthlyInterestRate = interestRate / 100 / 12;
    const scheduleData = [];

    while (currentBalance > 0) {
      const interestForMonth = currentBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestForMonth;
      currentBalance -= principalPayment;
      totalInterest += interestForMonth;
      totalPayment += monthlyPayment;
      monthsToPayoff++;
      scheduleData.push({
        month: monthsToPayoff,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestForMonth,
        balance: Math.max(currentBalance, 0)
      });
    }

    return { 
      monthsToPayoff, 
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
    setInputs({ balance: "", interestRate: "", monthlyPayment: "" });
  };

  const faqs = [
    {
      question: "How does the credit card payoff calculator work?",
      answer: "The credit card payoff calculator uses your current balance, interest rate, and monthly payment amount to estimate how long it will take to become debt-free. It also calculates the total interest you will pay over that period. This helps you visualize the impact of increasing your monthly payments. For more detailed planning, try our <a href=\"/financial/budget-planner\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Budget Planner</a>."
    },
    {
      question: "Why should I pay more than the minimum monthly payment?",
      answer: "Paying only the minimum monthly payment mainly covers the interest charges, with very little going towards the principal balance. This results in a much longer payoff time and significantly higher total interest costs. By paying more than the minimum, you reduce the principal faster, saving money and time. Even a small increase can make a big difference."
    },
    {
      question: "How does interest affect my payoff time?",
      answer: "Interest is the cost of borrowing money. A higher interest rate means more of your monthly payment goes towards interest rather than reducing the principal. This prolongs the time it takes to pay off the debt. Lowering your interest rate, if possible, can accelerate your payoff timeline."
    },
    {
      question: "Can I use this calculator for multiple credit cards?",
      answer: "This calculator is designed for a single credit card. However, you can use it for each card individually to see the payoff time for each. For managing multiple debts, consider using our <a href=\"/financial/debt-snowball\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Debt Snowball Calculator</a> which is specifically designed for multiple debts."
    },
    {
      question: "What is the debt snowball method?",
      answer: "The debt snowball method is a strategy where you pay off your debts in order from smallest to largest balance, regardless of interest rate. This creates a psychological win early on, motivating you to stick to the plan. As you pay off each debt, you roll the payment amount into the next debt, creating a 'snowball' effect."
    },
    {
      question: "How can I lower my interest rate?",
      answer: "You can try negotiating with your credit card issuer for a lower rate, especially if you have a good payment history. Alternatively, you might qualify for a balance transfer credit card with a 0% introductory APR period. This can temporarily stop interest accumulation, allowing your payments to go entirely towards the principal."
    },
    {
      question: "What happens if I miss a payment?",
      answer: "Missing a payment can result in late fees, a penalty APR (which is significantly higher than your regular rate), and damage to your credit score. It's crucial to make at least the minimum payment on time every month. setting up automatic payments can help ensure you never miss a due date."
    },
    {
      question: "Is it better to consolidate my credit card debt?",
      answer: "Debt consolidation involves taking out a new loan to pay off multiple credit cards. This can be beneficial if the new loan has a lower interest rate than your credit cards. It simplifies your finances by combining multiple payments into one. Use our <a href=\"/financial/debt-consolidation\" className=\"text-blue-600 dark:text-blue-400 hover:underline\">Debt Consolidation Calculator</a> to see if this option saves you money."
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
              Current Balance
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
              placeholder="e.g., 18.5"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Monthly Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 200"
              value={inputs.monthlyPayment}
              onChange={(e) => setInputs({ ...inputs, monthlyPayment: e.target.value })}
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
      {results.monthsToPayoff > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Months to Payoff
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {results.monthsToPayoff}
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
                      Total Interest Paid
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
          Understanding Credit Card Payoff Calculator
        </h2>
        
        <p className="mb-6">
          Managing credit card debt can be a daunting task, especially when interest rates are high and balances seem insurmountable. The Credit Card Payoff Calculator is designed to help you create a realistic plan to become debt-free. By inputting your current balance, interest rate, and desired monthly payment, this tool provides a clear timeline for when you can expect to pay off your debt. Whether you're aiming to reduce interest payments or simply want to see how long it will take to clear your balance, this calculator is an invaluable resource.
        </p>
        
        <p className="mb-6">
          Accurate calculations are crucial when dealing with credit card debt. Incorrect estimations can lead to longer payoff periods and increased interest payments. According to recent studies, the average American household carries over $6,000 in credit card debt. Using a tool like this calculator can help you understand the financial implications of your debt and make informed decisions about your repayment strategy. For more insights, explore our <a href="/financial/loan-payment" className="text-blue-600 dark:text-blue-400 hover:underline">Loan Payment Calculator</a>.
        </p>
        
        <p className="mb-6">
          To use this calculator effectively, gather your credit card statements to find your current balance and interest rate. Enter these values along with your planned monthly payment. The calculator will then provide a detailed schedule of payments, showing how much of each payment goes towards interest and principal. For additional guidance, check out our <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">Mortgage Payment & Amortization Calculator</a>.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-3">
            <Info className="h-5 w-5"/> 
            Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Always aim to pay more than the minimum payment on your credit card. This not only reduces your payoff time but also saves you a significant amount in interest payments over the life of the debt.
          </p>
        </div>
        
        <p className="mb-6">
          Best practices for using this calculator include regularly updating your inputs as your balance and interest rates change. Consider scenarios where you can increase your monthly payment to expedite the payoff process. Be mindful of any fees or penalties associated with your credit card, as these can affect your calculations. For more strategies, visit our <a href="/financial/extra-payments-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">Extra Payments & Payoff Time Calculator</a>.
        </p>
      </section>

      {/* SECTION 2: FORMULA (300-400 words) */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Credit Card Payoff Calculator Formula
        </h2>
        
        <p className="mb-6">
          The formula used in this calculator is based on the standard amortization formula, which calculates the monthly payment required to pay off a debt over a specified period. This formula takes into account the principal balance, the interest rate, and the number of payments. It is widely used in financial calculations due to its accuracy and reliability. Variations of this formula can be applied depending on whether you are making additional payments or dealing with fluctuating interest rates.
        </p>
        
        {/* FORMULA BOX - MANDATORY STYLING */}
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          M = P [i(1 + i)^n] / [(1 + i)^n – 1]
          <div className="mt-4 text-base font-sans text-left">
            <p className="mb-2"><strong>Where:</strong></p>
            <ul className="space-y-1 pl-4">
              <li>M = Monthly payment</li>
              <li>P = Principal balance (current balance)</li>
              <li>i = Monthly interest rate (annual rate / 12)</li>
              <li>n = Number of payments (months)</li>
            </ul>
          </div>
        </div>
        
        <p className="mb-4">
          Each variable in this formula plays a critical role. The principal balance (P) is the amount you owe, while the monthly interest rate (i) is derived from your annual interest rate divided by 12. The number of payments (n) represents the total months needed to pay off the debt. Adjusting any of these variables will impact the monthly payment (M) and the total interest paid over time. For example, increasing your monthly payment reduces the number of payments and total interest.
        </p>
      </section>

      {/* SECTION 3: FACTORS (600-800 words) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Key Factors That Affect Your Results
        </h2>
        
        <p className="mb-6">
          Understanding the factors that influence your credit card payoff is essential for effective debt management. These factors interact in complex ways, affecting both the time it takes to pay off your debt and the total interest paid. By recognizing these elements, you can make strategic decisions to optimize your repayment plan.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Interest Rate
        </h3>
        <p className="mb-4">
          The interest rate is arguably the most significant factor affecting your credit card payoff. A higher rate means more of your monthly payment goes towards interest rather than reducing the principal balance. For example, a 20% interest rate on a $5,000 balance can result in over $1,000 in interest payments annually if only minimum payments are made.
        </p>
        <p className="mb-6">
          To mitigate the impact of high interest rates, consider transferring your balance to a card with a lower rate or negotiating a lower rate with your current issuer. Additionally, increasing your monthly payment can significantly reduce the interest paid over time. Explore our <a href="/financial/interest-only-loan" className="text-blue-600 dark:text-blue-400 hover:underline">Interest-Only Loan Calculator</a> for more insights.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Monthly Payment Amount
        </h3>
        <p className="mb-4">
          The amount you choose to pay each month directly affects how quickly you can pay off your debt. Larger payments reduce the principal balance faster, decreasing the total interest paid. Conversely, paying only the minimum can extend your payoff period by years and increase the total cost significantly.
        </p>
        <p className="mb-6">
          Consider setting up automatic payments to ensure consistency and avoid late fees. If possible, allocate extra funds towards your credit card debt, especially if you receive a bonus or tax refund. This proactive approach can expedite your path to being debt-free.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Fees and Penalties
        </h3>
        <p className="mb-4">
          Credit card fees, such as annual fees, late payment penalties, and over-limit charges, can add to your debt burden. These fees not only increase your balance but can also lead to higher interest charges if not paid promptly.
        </p>
        <p className="mb-6">
          To minimize these costs, always pay on time and stay within your credit limit. Consider switching to a card with no annual fee or one that offers rewards that offset the fee. Understanding your card's terms and conditions can help you avoid unnecessary charges.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Credit Limit Utilization
        </h3>
        <p className="mb-6">
          Your credit utilization ratio, which is the percentage of your credit limit that you are using, can impact your credit score and your ability to secure better interest rates. A high utilization ratio can signal to lenders that you are overextended, potentially leading to higher rates or reduced credit limits.
        </p>
        <p className="mb-6">
          Aim to keep your utilization below 30% of your total credit limit. This strategy not only helps improve your credit score but also reduces the interest you pay. Regularly monitor your credit reports to ensure accuracy and identify opportunities for improvement.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">
          Changes in Financial Situation
        </h3>
        <p className="mb-6">
          Life events such as job loss, medical emergencies, or unexpected expenses can affect your ability to make consistent payments. These changes can lead to increased debt if not managed carefully. It's important to have a financial cushion or emergency fund to handle such situations without derailing your payoff plan.
        </p>
        <p className="mb-6">
          If you anticipate a change in your financial situation, consider adjusting your payment plan accordingly. Communicate with your creditors to explore options such as temporary payment reductions or hardship programs. Being proactive can prevent long-term financial setbacks.
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
                Consumer Financial Protection Bureau - Credit Card Management
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive consumer protection information and educational resources on credit card management.
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
                FDIC - Managing Debt
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Banking regulations and strategies for managing debt effectively.
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
                Internal Revenue Service - Tax Implications of Debt
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official tax guidelines and deduction information related to debt repayment.
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
                Investopedia - Understanding Credit Card Debt
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Detailed financial education and investment concepts explained, focusing on credit card debt.
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
                NerdWallet - Credit Card Payoff Strategies
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Personal finance guides and comparison tools for consumers focusing on credit card payoff strategies.
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
      title="Credit Card Payoff Calculator"
      description="Create a plan to pay off credit card debt. See how long it takes to become debt-free with different monthly payment amounts."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Credit Card Payoff Calculator" },
        { id: "formula", label: "Credit Card Payoff Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "M = P [i(1 + i)^n] / [(1 + i)^n – 1]",
        variables: [
          { symbol: "M", description: "Monthly payment" },
          { symbol: "P", description: "Principal balance (current balance)" },
          { symbol: "i", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Number of payments (months)" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a credit card balance of $5,000 with an annual interest rate of 18% and you plan to pay $200 monthly.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Monthly interest rate = 18% / 12 = 1.5%", 
            explanation: "Calculate the monthly interest rate from the annual rate." 
          },
          { 
            label: "Step 2", 
            calculation: "Use the formula to find the monthly payment.", 
            explanation: "Apply the formula to determine the monthly payment needed." 
          },
          { 
            label: "Step 3", 
            calculation: "Calculate total interest and payoff time.", 
            explanation: "Determine the total interest paid and the number of months to payoff." 
          }
        ],
        result: "The final result shows the total interest paid and the number of months required to pay off the debt."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"💰"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"📊"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💹"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}