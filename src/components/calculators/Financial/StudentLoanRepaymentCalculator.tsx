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
      question: "What are the federal student loan repayment plan options and how do I choose?",
      answer: "Federal student loans have several repayment plans: (1) Standard (10 years) — fixed payments, least total interest, $33,000 at 5% = $350/month. (2) Graduated — payments start low, increase every 2 years, more total interest than Standard. (3) Extended (up to 25 years) — lower monthly payments, significantly more interest. (4) Income-Driven Repayment (IDR) plans — payments capped at 5-20% of discretionary income depending on the plan (SAVE, IBR, PAYE, ICR). IDR is best if you have high debt relative to income or plan to pursue Public Service Loan Forgiveness. Standard is best if you can afford the payments and want to minimize total interest paid."
    },
    {
      question: "How does the SAVE income-driven repayment plan work, and who benefits most?",
      answer: "The SAVE (Saving on a Valuable Education) plan, introduced in 2023, is the most generous IDR plan. It caps payments at 5% of discretionary income for undergraduate loans (10% for graduate) and defines discretionary income as income above 225% of the federal poverty guideline. For borrowers earning under ~$32,800 (single, 2024), payments are $0/month — and $0 payments still count toward forgiveness. SAVE also prevents interest from capitalizing as long as you make your required payment. Borrowers with income < $60,000 and balances > $30,000 typically benefit most from SAVE vs. Standard repayment."
    },
    {
      question: "What is Public Service Loan Forgiveness (PSLF) and what are the requirements?",
      answer: "PSLF forgives the remaining balance on Direct federal loans after 120 qualifying payments (10 years) while working full-time for a qualifying employer — government agencies, 501(c)(3) nonprofits, public schools, and public hospitals all qualify. Requirements: (1) Direct Loans only (FFEL and Perkins must be consolidated), (2) enrolled in an IDR or Standard plan, (3) working full-time (30+ hours/week) for a qualifying employer for each of the 120 payments. Payments do not need to be consecutive. Example: $80,000 in loans, earning $50,000 with SAVE plan = ~$167/month for 10 years = ~$20,000 total paid, with $60,000+ forgiven tax-free."
    },
    {
      question: "Should I pay off student loans early or invest the extra money?",
      answer: "The math favors investing over early payoff when your expected investment return exceeds your loan interest rate. With federal loans at 5-7% and a diversified index fund historically returning 7-10% annually, investing the extra money often comes out ahead over a 10+ year horizon. However, paying down debt is a guaranteed risk-free return equal to your interest rate — no investment guarantees 7%. General guidance: (1) If loan rate < 5%, invest first after building a 3-6 month emergency fund. (2) If loan rate 5-7%, split the difference — do both. (3) If loan rate > 7%, pay aggressively. Also consider: if pursuing PSLF, do NOT pay extra — it reduces your forgiveness benefit."
    },
    {
      question: "What happens if I refinance federal student loans into a private loan?",
      answer: "Refinancing converts your federal loans into a private loan at (hopefully) a lower interest rate. The tradeoff: you permanently lose all federal protections. You lose access to IDR plans, which means no income-based payment caps during financial hardship. You lose PSLF eligibility — this is irreversible and catastrophic if you were on track for forgiveness. You lose federal deferment and forbearance options. Refinancing makes sense only if: (1) you have a stable, high income and will never pursue PSLF, (2) your credit qualifies you for a rate meaningfully lower than your current rate (1.5%+ improvement), and (3) you have an emergency fund to cover payments without income-based repayment options."
    },
    {
      question: "What is the student loan interest tax deduction?",
      answer: "The student loan interest deduction allows you to deduct up to $2,500 of student loan interest paid annually from your taxable income — it's an above-the-line deduction, so you don't need to itemize. For 2024, the deduction phases out between $75,000-$90,000 MAGI (single filers) and $155,000-$185,000 (married filing jointly). At a 22% tax bracket, deducting $2,500 saves $550/year. Note: you can only deduct interest actually paid — if you are on an IDR plan with $0 payments, you deduct $0 even if interest is accruing. Interest that capitalizes (is added to your principal balance) is not deductible when capitalized, only when paid."
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
