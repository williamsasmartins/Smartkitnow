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
      question: "How does the Student Loan Repayment Calculator determine my monthly payment?",
      answer: "The calculator uses your loan balance, interest rate, and repayment term to compute your monthly payment using the standard amortization formula. For example, a $30,000 loan at 6.5% interest over 10 years results in approximately $318 per month. The calculation accounts for both principal and interest portions of each payment.",
    },
    {
      question: "What's the difference between Standard, Graduated, and Income-Driven repayment plans?",
      answer: "The Standard plan requires equal monthly payments over 10 years (typically $300–$400 for $30,000 in loans). Graduated plans start lower and increase every 2 years, also lasting 10 years. Income-Driven plans (PAYE, REPAYE, IBR, ICR) cap payments at 10–20% of discretionary income and extend repayment to 20–25 years, potentially resulting in forgiveness of remaining balances.",
    },
    {
      question: "How much total interest will I pay over the life of my loan?",
      answer: "Total interest depends on your loan balance, interest rate, and repayment term. A $25,000 loan at 5.5% over 10 years costs approximately $7,128 in interest, while stretching it to 20 years increases total interest to roughly $15,500. The calculator shows your total interest paid in the results breakdown.",
    },
    {
      question: "Can this calculator help me compare Federal Direct Loans versus Parent PLUS loans?",
      answer: "Yes, you can use separate calculations to compare repayment scenarios. Federal Direct Loans for 2024–2025 have a maximum interest rate of 8.5%, while Parent PLUS loans carry an 8.25% rate. The calculator allows you to input different rates and terms to see which loan type results in lower monthly payments for your situation.",
    },
    {
      question: "How does extra principal payments affect my repayment timeline?",
      answer: "Additional principal payments reduce your loan balance faster, decreasing the total interest paid and shortening your repayment term. For example, paying an extra $100 monthly on a $30,000 loan at 6.5% over 10 years could save you approximately $3,500 in interest and eliminate your debt 2–3 years earlier. Most calculators show the impact of lump-sum or recurring extra payments.",
    },
    {
      question: "What is the Federal Student Loan interest rate for 2024–2025?",
      answer: "Federal Direct Subsidized and Unsubsidized Loans for the 2024–2025 academic year carry a fixed interest rate of 8.5%, while Federal Direct PLUS loans are set at 8.25%. These rates are fixed for the life of the loan and are determined annually by Congress based on the 10-year Treasury note.",
    },
    {
      question: "How do I know which income-driven repayment plan is best for my calculator inputs?",
      answer: "Use the calculator to model PAYE (Pay As You Earn), REPAYE (Revised Pay As You Earn), IBR (Income-Based Repayment), and ICR (Income-Contingent Repayment) side by side. PAYE and REPAYE typically offer the lowest payments for recent borrowers (10% of discretionary income), while REPAYE includes interest subsidy during forbearance. Your income level and loan amount determine which plan provides the most savings.",
    },
    {
      question: "What happens if I stop making payments—will the calculator show capitalized interest?",
      answer: "Capitalized interest occurs when unpaid interest is added to your principal balance, increasing the total amount you owe. For example, if interest capitalizes on a $25,000 loan at 6% during a 6-month forbearance period, approximately $750 is added to your principal. The calculator can show capitalization scenarios if you include a deferment or forbearance period in your inputs.",
    },
    {
      question: "Can the calculator factor in Public Service Loan Forgiveness (PSLF) eligibility?",
      answer: "While a basic repayment calculator doesn't automatically calculate PSLF forgiveness, you can use it to project 10 years of payments under an income-driven plan (the required plan type for PSLF). If your employer is PSLF-eligible and you make 120 qualifying payments, the remaining balance is forgiven tax-free. The calculator helps you see your payment timeline and estimate the forgiven amount.",
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Student Loan Repayment Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Student Loan Repayment Calculator helps you estimate your monthly loan payment, total interest costs, and repayment timeline. Whether you're managing federal Direct Loans, PLUS loans, or private student debt, this tool lets you model different scenarios to understand your true cost of borrowing and find the most affordable repayment strategy for your financial situation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your current loan balance (the amount you still owe), your interest rate (found on your loan documents or STUDENTAID.GOV for federal loans), and your desired repayment term or plan type. If you're eligible for income-driven repayment, you'll also input your gross annual income and family size to calculate payments as a percentage of your discretionary income. You can enter extra payment amounts to see how accelerated repayment reduces your timeline and interest burden.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculator results to compare your total monthly payment, total interest paid, and payoff date across different scenarios. The amortization schedule shows how much of each payment goes toward principal versus interest over time. Use these insights to decide whether to pursue Standard repayment, an income-driven plan, loan consolidation, or an aggressive extra-payment strategy that aligns with your budget and long-term financial goals.</p>
        </div>
      </section>

      {/* TABLE: Monthly Payment Estimates by Loan Amount and Interest Rate (10-Year Standard Repayment) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Payment Estimates by Loan Amount and Interest Rate (10-Year Standard Repayment)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated monthly payments for federal student loans under the Standard 10-year repayment plan at various loan amounts and current interest rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Balance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5.5% Interest Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">6.5% Interest Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">8.5% Interest Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$283</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$299</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$331</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$472</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$498</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$552</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$35,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$661</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$697</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$773</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$944</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$996</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,104</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$75,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,416</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,494</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,656</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations based on 2024–2025 Federal Direct Loan interest rates. Actual payments may vary based on loan type and accrued interest.</p>
      </section>

      {/* TABLE: Income-Driven Repayment Plan Comparison (Annual Discretionary Income: $35,000) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Income-Driven Repayment Plan Comparison (Annual Discretionary Income: $35,000)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares estimated monthly payments under four income-driven repayment plans for a borrower with $40,000 in student loans and $35,000 in discretionary income.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Repayment Plan</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Forgiveness Timeline</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Subsidy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">PAYE (Pay As You Earn)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$292</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes, during in-school and deferment</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">REPAYE (Revised PAYE)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$292</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes, during forbearance and non-repayment</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">IBR (Income-Based Repayment)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$325</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Partial, if new borrower</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">ICR (Income-Contingent Repayment)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No interest subsidy</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates assume 6.5% average loan interest rate. Actual payments are capped at 10–20% of discretionary income depending on plan type and borrower status.</p>
      </section>

      {/* TABLE: Total Interest Paid Over Loan Lifetime ($30,000 Balance at 6.5%) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Total Interest Paid Over Loan Lifetime ($30,000 Balance at 6.5%)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how different repayment terms and extra payments affect the total interest paid on a $30,000 student loan at 6.5% interest.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Repayment Term</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Amount Repaid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Extra $100/Month Payment Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 years (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$39,450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$3,200 interest (7–8 years total)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$14,850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$44,850</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$5,100 interest (10–11 years total)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$7,200 interest (13–14 years total)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Income-Driven (25 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$58,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−$10,300 interest (17–18 years total)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume fixed 6.5% interest rate and monthly payments based on selected repayment plan. Extra payment savings show potential interest reduction if applied consistently.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Input your actual interest rate from STUDENTAID.GOV or your loan servicer's website—federal rates change annually (currently 8.5% for 2024–2025), and using the correct rate ensures accurate payment estimates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Model both the 10-year Standard plan and at least one income-driven plan side by side to compare total interest paid; for example, PAYE may result in $8,000 less interest than standard repayment if your income is lower than your loan balance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add extra principal payments (even $50–$100 monthly) into the calculator to see the cumulative savings; on a $35,000 loan at 6.5%, an extra $75 per month saves approximately $4,200 in interest and shortens repayment by 2–3 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If you're pursuing Public Service Loan Forgiveness (PSLF), use the calculator to project 10 years of payments under PAYE or REPAYE and estimate your potential forgiven balance; for example, 120 payments of $300 leaves a $12,000+ balance eligible for tax-free forgiveness.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for capitalized interest</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Unpaid interest added to your principal balance increases your total debt during deferment or forbearance periods. Not including capitalization in your calculator input can underestimate your final payoff amount by hundreds of dollars.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using an incorrect interest rate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Federal loan rates vary by year and loan type (Subsidized vs. Unsubsidized vs. PLUS); using a generic 6% rate when your actual rate is 8.5% can skew payment estimates by $30–$50+ per month. Always verify your rate on STUDENTAID.GOV or your promissory note.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring income-driven repayment plans if your income is low</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you're earning under $50,000 annually with $30,000+ in loans, an income-driven plan often results in 30–50% lower monthly payments than Standard repayment. Neglecting to calculate PAYE or REPAYE scenarios may leave you overpaying by thousands.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all extra payments reduce principal immediately</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some loan servicers apply extra payments to the next scheduled payment rather than principal unless you explicitly designate them for principal reduction. Verify your servicer's policy or your calculator results may not reflect the actual interest savings from extra payments.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the Student Loan Repayment Calculator determine my monthly payment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your loan balance, interest rate, and repayment term to compute your monthly payment using the standard amortization formula. For example, a $30,000 loan at 6.5% interest over 10 years results in approximately $318 per month. The calculation accounts for both principal and interest portions of each payment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between Standard, Graduated, and Income-Driven repayment plans?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Standard plan requires equal monthly payments over 10 years (typically $300–$400 for $30,000 in loans). Graduated plans start lower and increase every 2 years, also lasting 10 years. Income-Driven plans (PAYE, REPAYE, IBR, ICR) cap payments at 10–20% of discretionary income and extend repayment to 20–25 years, potentially resulting in forgiveness of remaining balances.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much total interest will I pay over the life of my loan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Total interest depends on your loan balance, interest rate, and repayment term. A $25,000 loan at 5.5% over 10 years costs approximately $7,128 in interest, while stretching it to 20 years increases total interest to roughly $15,500. The calculator shows your total interest paid in the results breakdown.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me compare Federal Direct Loans versus Parent PLUS loans?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can use separate calculations to compare repayment scenarios. Federal Direct Loans for 2024–2025 have a maximum interest rate of 8.5%, while Parent PLUS loans carry an 8.25% rate. The calculator allows you to input different rates and terms to see which loan type results in lower monthly payments for your situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does extra principal payments affect my repayment timeline?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Additional principal payments reduce your loan balance faster, decreasing the total interest paid and shortening your repayment term. For example, paying an extra $100 monthly on a $30,000 loan at 6.5% over 10 years could save you approximately $3,500 in interest and eliminate your debt 2–3 years earlier. Most calculators show the impact of lump-sum or recurring extra payments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Federal Student Loan interest rate for 2024–2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Federal Direct Subsidized and Unsubsidized Loans for the 2024–2025 academic year carry a fixed interest rate of 8.5%, while Federal Direct PLUS loans are set at 8.25%. These rates are fixed for the life of the loan and are determined annually by Congress based on the 10-year Treasury note.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know which income-driven repayment plan is best for my calculator inputs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the calculator to model PAYE (Pay As You Earn), REPAYE (Revised Pay As You Earn), IBR (Income-Based Repayment), and ICR (Income-Contingent Repayment) side by side. PAYE and REPAYE typically offer the lowest payments for recent borrowers (10% of discretionary income), while REPAYE includes interest subsidy during forbearance. Your income level and loan amount determine which plan provides the most savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I stop making payments—will the calculator show capitalized interest?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Capitalized interest occurs when unpaid interest is added to your principal balance, increasing the total amount you owe. For example, if interest capitalizes on a $25,000 loan at 6% during a 6-month forbearance period, approximately $750 is added to your principal. The calculator can show capitalization scenarios if you include a deferment or forbearance period in your inputs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the calculator factor in Public Service Loan Forgiveness (PSLF) eligibility?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While a basic repayment calculator doesn't automatically calculate PSLF forgiveness, you can use it to project 10 years of payments under an income-driven plan (the required plan type for PSLF). If your employer is PSLF-eligible and you make 120 qualifying payments, the remaining balance is forgiven tax-free. The calculator helps you see your payment timeline and estimate the forgiven amount.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://studentaid.gov/understand-aid/types/loans/interest-rates" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Student Aid – STUDENTAID.GOV</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. Department of Education resource for current federal loan interest rates, repayment plan options, and loan servicer information.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/student-loans/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau – Student Loan Repayment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB guidance on student loan repayment plans, borrower rights, and tools to manage federal and private loans.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p970" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 970 – Tax Benefits for Education</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Internal Revenue Service documentation on student loan interest deductions, tax credits, and forgiveness tax implications.</p>
          </li>
          <li>
            <a href="https://studentaid.gov/manage-loans/repayment/plans/income-driven" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Student Aid – Income-Driven Repayment Plans</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed comparison of PAYE, REPAYE, IBR, and ICR plans, including eligibility, payment calculations, and forgiveness timelines.</p>
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
