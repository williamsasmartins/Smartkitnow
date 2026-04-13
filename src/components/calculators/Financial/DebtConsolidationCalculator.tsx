import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DebtConsolidationCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    totalDebt: "", 
    interestRate: "", 
    term: "" 
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
      question: "When does debt consolidation actually save money vs. just extending your payment period?",
      answer: "Consolidation saves money when: new interest rate is meaningfully lower than weighted average rate of existing debts, and you do not extend the term significantly. Formula: savings = (old monthly interest) − (new monthly interest) × months. Example: $20,000 across three credit cards at 24% average ($400/month interest), consolidated to a personal loan at 12% ($200/month interest) = $200/month savings. If the loan term is the same 5 years: total interest savings ≈ $12,000. But if consolidation extends payoff from 3 years to 7 years at the lower rate, you may pay more total interest despite the lower rate. Always calculate total interest cost (monthly payment × months − principal), not just the monthly payment reduction."
    },
    {
      question: "What are the different types of debt consolidation and when should I use each?",
      answer: "Balance transfer card (0% APR intro period, 12–21 months): best for credit card debt under $15,000 you can pay off within the intro period. Transfer fee: 3–5%. Risk: revert to 20%+ APR if not paid off. Personal consolidation loan (7–36% APR, 2–7 years): best for larger balances needing structured repayment. Requires good credit (660+) for rates that beat credit cards. Home equity loan/HELOC (6–9% APR, 2024): best rate, but your home is collateral -- default = foreclosure. Debt management plan (DMP) via nonprofit credit counseling: reduces interest rates to 6–9% through creditor agreements; no new credit during payoff. 401k loan: 'repay yourself' but loses compound growth and has tax consequences on default."
    },
    {
      question: "How does debt consolidation affect your credit score?",
      answer: "Short-term effects: applying for a new loan/card creates a hard inquiry (−5 to −10 points, recovers in 12 months). Closing old accounts reduces average account age and available credit (may lower score temporarily). Long-term effects: lower credit utilization (if cards are paid off and kept open) improves score significantly (utilization is 30% of score). Consistent on-time payments on the new loan build positive history. Net result: most borrowers see a slight dip for 3–6 months, then score improvement over 12–24 months as utilization drops. Key rule: do not close the paid-off credit cards -- keep them open (with $0 balance) to maintain credit limit and age."
    },
    {
      question: "What is the difference between debt consolidation and debt settlement?",
      answer: "Debt consolidation: takes existing debts and combines them into one new debt, usually at better terms. You repay 100% of what you owe. Credit impact: neutral to positive. Debt settlement: negotiates with creditors to accept less than the full balance (typically 40–60 cents on the dollar). You stop paying while funds accumulate in an escrow account, then lenders settle. Credit impact: severe (accounts marked 'settled for less than full amount' stay 7 years). Tax impact: forgiven debt over $600 is taxable income (IRS Form 1099-C). Debt settlement firms charge 15–25% of enrolled debt as fees. Settlement is a last resort before bankruptcy -- it severely damages credit and has tax consequences consolidation does not."
    },
    {
      question: "How do I calculate whether consolidating my debts will actually lower my monthly payment and total interest?",
      answer: "Step 1: Calculate your current monthly payment and total remaining interest. For each debt: remaining interest = (monthly payment × remaining months) − remaining balance. Sum across all debts. Step 2: Calculate the consolidation loan total interest = (monthly payment × term months) − loan principal. Step 3: Compare. Example: two cards totaling $15,000 at average 22% APR, paying $500/month: payoff in 39 months, total interest $4,464. Consolidation loan: $15,000 at 12% for 36 months, payment $498/month, total interest $2,928. Savings: $1,536. Always include the origination fee (typically 1–8%) in the consolidation loan cost: $15,000 loan with 3% fee = $450 added cost, net savings = $1,086. Still worth it -- but always check the math."
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // CALCULATIONS
  const results = useMemo(() => {
    // Parse inputs (use 'let' for mutable variables)
    const totalDebtValue = parseFloat(inputs.totalDebt) || 0;
    const interestRateValue = parseFloat(inputs.interestRate) || 0;
    const termValue = parseFloat(inputs.term) || 0;

    // Validate
    if (totalDebtValue <= 0 || interestRateValue <= 0 || termValue <= 0) {
      return { 
        mainResult: 0, 
        monthlyPayment: 0, 
        totalInterest: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyInterestRate = interestRateValue / 100 / 12;
    const numberOfPayments = termValue * 12;
    const monthlyPayment = totalDebtValue * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - totalDebtValue;

    // Generate table data
    const scheduleData: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    let remainingBalance = totalDebtValue;
    for (let i = 1; i <= numberOfPayments; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      if (i <= 12 || i % 12 === 0 || i === numberOfPayments) {
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
      mainResult: monthlyPayment,
      monthlyPayment,
      totalInterest,
      scheduleData
    };
  }, [inputs]);

  const editorial = (
    <div className="space-y-12" />
  );

  return (
    <CalculatorVerticalLayout 
      title="Debt Consolidation Calculator"
      description="Calculate your potential savings and new monthly payment by consolidating your debts."
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: 'calculator', label: 'Calculator' },
        { id: 'editorial', label: 'Editorial' },
        { id: 'faq', label: 'Frequently Asked Questions' },
        { id: 'references', label: 'References' }
      ]}
      formula={{
        formula: "M = P * r * (1 + r)^n / ((1 + r)^n - 1)",
        variables: [
          { symbol: "M", description: "Total monthly payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "r", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Number of payments (months)" }
        ],
        title: "Debt Consolidation Formula"
      }}
    >
      {/* CALCULATOR WIDGET */}
      <div id="calculator" className="scroll-mt-24">
        <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Calculator className="h-5 w-5 text-blue-500" />
              Debt Consolidation Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid gap-6 md:grid-cols-2">
            {/* INPUTS */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalDebt">Total Debt Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="totalDebt"
                    type="number"
                    placeholder="0"
                    className="pl-9"
                    value={inputs.totalDebt}
                    onChange={(e) => setInputs({ ...inputs, totalDebt: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interestRate">New Interest Rate (%)</Label>
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
                <Label htmlFor="term">Loan Term (Years)</Label>
                <Input
                  id="term"
                  type="number"
                  placeholder="0"
                  value={inputs.term}
                  onChange={(e) => setInputs({ ...inputs, term: e.target.value })}
                />
              </div>
            </div>

            {/* RESULTS */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 flex flex-col justify-center space-y-4 border border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">New Monthly Payment</p>
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
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Total Cost</p>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(results.monthlyPayment * (parseFloat(inputs.term) * 12 || 0))}
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

      {/* EDITORIAL CONTENT */}
      <section id="editorial" className="space-y-8 mt-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Understanding Debt Consolidation
        </h2>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Debt consolidation is a financial strategy that involves taking out a new loan to pay off multiple existing debts. This can simplify your finances by combining multiple payments into one and potentially lowering your interest rate. However, it's important to carefully consider the terms of the new loan and ensure that it aligns with your long-term financial goals.
          </p>
        </div>
      </section>

      {/* SECTION 4: FAQ */}
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
                Federal Reserve - Interest Rates
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Official data on interest rates and economic conditions affecting loans and credit.
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
                Consumer Financial Protection Bureau - Debt Consolidation
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Guides and tools for understanding debt consolidation and managing debt.
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
                FDIC - Consumer News
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Articles and tips on managing debt and improving financial health.
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
                IRS - Tax Information
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Information on tax implications of debt consolidation and loan forgiveness.
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
                Investopedia - Debt Consolidation
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Educational articles and definitions related to debt consolidation and personal finance.
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
                NerdWallet - Debt Management
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Tools and advice for managing debt and choosing the right consolidation option.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}
