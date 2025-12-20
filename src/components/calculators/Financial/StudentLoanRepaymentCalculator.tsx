import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

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

  // FAQ STRUCTURED DATA
  const faqs = [
    {
      question: "What is a student loan repayment calculator and why is it important?",
      answer: "A student loan repayment calculator is a tool that helps borrowers estimate their monthly payments, total interest, and overall cost of a student loan. It is important because it provides a clear picture of the financial commitment involved in repaying a loan, allowing borrowers to plan and budget effectively. By understanding the repayment terms, borrowers can make informed decisions about their loans and explore options to reduce costs. For more detailed analysis, check out our <a href='/financial/extra-payments-payoff'>Extra Payments & Payoff Time Calculator</a>."
    },
    {
      question: "How accurate is this calculator?",
      answer: "This calculator is designed to provide accurate estimates based on the inputs provided. However, the accuracy depends on the precision of the data entered, such as the interest rate and loan term. It is important to use up-to-date and correct information to ensure reliable results. For complex financial situations, consulting a financial advisor is recommended to complement the calculator's insights."
    },
    {
      question: "What information do I need to use this calculator?",
      answer: "To use this calculator, you need to know your total loan amount, the annual interest rate, and the repayment term in years. This information is typically available on your loan agreement or from your lender. Accurate data ensures that the calculator provides reliable estimates. Gathering this information beforehand will help you make the most of the calculator and explore different repayment scenarios."
    },
    {
      question: "Can I use this calculator for refinancing scenarios?",
      answer: "Yes, this calculator can be used to explore refinancing scenarios by adjusting the interest rate and repayment term. Refinancing can potentially lower your monthly payments or reduce the total interest paid. However, it's important to consider any fees or costs associated with refinancing. For a more detailed analysis, our <a href='/financial/refinance-savings'>Refinance Savings Calculator</a> can help you evaluate the potential savings from refinancing."
    },
    {
      question: "What are common mistakes people make with this calculation?",
      answer: "Common mistakes include entering incorrect interest rates, not accounting for fees, and misunderstanding the repayment term. These errors can lead to inaccurate results and poor financial planning. It's crucial to double-check all inputs and understand the terms of your loan. Always verify your loan details with your lender and consider professional advice for complex financial situations."
    },
    {
      question: "How often should I recalculate?",
      answer: "Recalculation is recommended whenever there are changes in interest rates, loan terms, or financial circumstances. Regularly reviewing your repayment plan ensures that you stay on track and can adjust your strategy as needed. Consider recalculating annually or whenever you make significant financial decisions, such as refinancing or making extra payments."
    },
    {
      question: "What should I do with these results?",
      answer: "Use the results to plan your budget and repayment strategy. Understanding your monthly payment and total interest can help you make informed financial decisions. Consider setting up automatic payments to ensure timely repayments and avoid late fees. If you're exploring different repayment options, our <a href='/financial/heloc-payment-estimator'>HELOC Payment Estimator</a> can provide additional insights."
    },
    {
      question: "Are there alternatives to this calculation method?",
      answer: "Alternatives include using financial software, consulting with a financial advisor, or using spreadsheets to model different scenarios. Each method has its pros and cons, and the best choice depends on your comfort level and financial complexity. For those who prefer a hands-on approach, spreadsheets offer flexibility, while professional advice provides personalized insights."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
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

    // Generate schedule data
    const scheduleData: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    let remainingBalance = loanAmount;
    
    for (let i = 1; i <= repaymentTerm; i++) {
      const interestPayment = remainingBalance * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      if (i <= 12 || i % 12 === 0 || i === repaymentTerm) {
        scheduleData.push({
          month: i,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, remainingBalance)
        });
      }
    }

    return { 
      monthlyPayment, 
      totalInterest, 
      totalPayment, 
      scheduleData 
    };
  }, [inputs]);

  const widget = (
    <div id="calculator" className="scroll-mt-24">
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Calculator className="h-5 w-5 text-blue-500" />
            Student Loan Repayment Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid gap-6 md:grid-cols-2">
          {/* INPUTS */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="0"
                  className="pl-9"
                  value={inputs.loanAmount}
                  onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="interestRate"
                  type="number"
                  placeholder="0"
                  className="pl-9"
                  value={inputs.interestRate}
                  onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="repaymentTerm">Repayment Term (Years)</Label>
              <Input
                id="repaymentTerm"
                type="number"
                placeholder="0"
                value={inputs.repaymentTerm}
                onChange={(e) => setInputs({ ...inputs, repaymentTerm: e.target.value })}
              />
            </div>
          </div>

          {/* RESULTS */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 flex flex-col justify-center space-y-4 border border-slate-100 dark:border-slate-800">
            <div className="text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">Monthly Payment</p>
              <div ref={resultsRef} className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(results.monthlyPayment)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Interest</p>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  {formatCurrency(results.totalInterest)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Repayment</p>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                  {formatCurrency(results.totalPayment)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RESULTS TABLE */}
      {results.scheduleData.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Amortization Schedule</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFullTable(!showFullTable)}
            >
              {showFullTable ? "Show Less" : "Show Full Schedule"}
            </Button>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Principal</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.scheduleData
                  .slice(0, showFullTable ? undefined : 12)
                  .map((row) => (
                    <TableRow key={row.month}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{formatCurrency(row.payment)}</TableCell>
                      <TableCell>{formatCurrency(row.principal)}</TableCell>
                      <TableCell>{formatCurrency(row.interest)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.balance)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {!showFullTable && results.scheduleData.length > 12 && (
              <div className="p-4 text-center bg-slate-50 dark:bg-slate-800/50 border-t text-sm text-slate-500">
                Showing first 12 months. Click "Show Full Schedule" to see all payments.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div>
      {/* EDITORIAL CONTENT */}
      <section id="editorial" className="space-y-8 mt-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Understanding Student Loan Repayment
        </h2>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Repaying student loans is a significant financial milestone for many graduates. Understanding the terms of your loan, including the interest rate and repayment period, is crucial for effective financial planning. By making informed decisions, you can manage your debt more efficiently and potentially save money over the life of the loan.
          </p>
        </div>
      </section>

      {/* SECTION 4: FAQ */}
      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
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
              <p 
                className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8"
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
                Comprehensive guide on student loans, repayment options, and borrower rights.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://studentaid.gov" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Federal Student Aid
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                The official portal for federal student aid, offering resources on loans, grants, and repayment plans.
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
                Investopedia - Student Loan Repayment
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Educational articles explaining repayment strategies, loan forgiveness, and consolidation.
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
                NerdWallet - Student Loans
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tools and advice for managing student loans, refinancing, and finding the best rates.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0"/>
            <div>
              <a 
                href="https://www.bankrate.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
              >
                Bankrate - Student Loan Calculator
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Calculators and articles to help you understand your loan payments and options.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout 
      title="Student Loan Repayment Calculator"
      description="Estimate your monthly student loan payments and total interest cost."
      jsonLd={faqJsonLd}
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: 'calculator', label: 'Calculator' },
        { id: 'editorial', label: 'Editorial' },
        { id: 'faq', label: 'Frequently Asked Questions' },
        { id: 'references', label: 'References' }
      ]}
      formula={{
        title: "Student Loan Repayment Formula",
        formula: "M = P * (r * (1 + r)^n) / ((1 + r)^n - 1)",
        variables: [
          { symbol: "M", description: "Total monthly payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "r", description: "Monthly interest rate (annual rate divided by 12)" },
          { symbol: "n", description: "Number of payments (months)" }
        ]
      }}
    />
  );
}
