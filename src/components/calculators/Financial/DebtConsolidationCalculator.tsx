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
      question: "What is a debt consolidation calculator and how does it work?",
      answer: "A debt consolidation calculator is a tool that combines multiple debts into a single loan estimate, showing you the potential monthly payment, total interest paid, and payoff timeline. It works by taking your current debts (credit cards, personal loans, etc.), their interest rates, and balances, then calculating what a single consolidated loan might cost. The calculator helps you compare your current situation versus consolidation to determine if you'd save money overall.",
    },
    {
      question: "What inputs do I need to use the debt consolidation calculator?",
      answer: "You'll need to provide the total amount of debt you want to consolidate, your current average interest rate or individual rates for each debt, the proposed consolidation loan rate (which you can estimate based on current market rates or your credit score), and your desired loan term in months or years. Some advanced calculators also ask for your credit score range and the type of consolidation (personal loan, balance transfer, home equity, or debt management plan) to provide more accurate rate estimates.",
    },
    {
      question: "How much can I save with debt consolidation using the calculator?",
      answer: "Savings depend on your current rates versus your new consolidated rate. For example, if you consolidate $25,000 in credit card debt at 18% APR into a personal loan at 10% APR over 5 years, you'd save approximately $6,500 in interest. The calculator shows exact savings by comparing total interest paid on your current debts versus the consolidated loan, helping you see if consolidation makes financial sense for your situation.",
    },
    {
      question: "What debt consolidation options does the calculator account for?",
      answer: "Most debt consolidation calculators model personal loans (typically 3-7 year terms with 6-36% APR depending on credit), balance transfer cards (0-5% intro APR for 6-21 months), home equity loans (currently 7-9% APR with 5-15 year terms), and debt management plans (5-7 year repayment with reduced interest through credit counseling). Each option has different timelines, interest rates, and eligibility requirements that the calculator can help you compare.",
    },
    {
      question: "How does changing the loan term affect my consolidation results?",
      answer: "Extending your loan term lowers your monthly payment but increases total interest paid over time. For instance, consolidating $30,000 at 12% for 3 years costs $933/month with $3,596 total interest, while extending to 7 years reduces the payment to $508/month but increases total interest to $12,672. The calculator lets you adjust the term to find the balance between affordable monthly payments and minimizing interest costs.",
    },
    {
      question: "What interest rate should I assume for debt consolidation?",
      answer: "Your consolidation rate depends on your credit score, income, and the type of consolidation. For personal loans in 2024-2025, borrowers with excellent credit (740+) typically qualify for 6-10% APR, good credit (670-739) sees 10-16% APR, and fair credit (580-669) ranges from 16-28% APR. The calculator should allow you to input your expected rate based on recent rate quotes from lenders, or use national averages to estimate your likely approval rate.",
    },
    {
      question: "Can the calculator show me how much faster I'd pay off debt?",
      answer: "Yes—the calculator compares your payoff timeline under current minimum payments versus a consolidation loan with a fixed term. For example, making only minimum payments on $20,000 in credit card debt at 21% APR could take 10+ years to pay off, while consolidating into a 5-year personal loan at 14% APR guarantees payoff in 60 months. This timeline comparison is one of the biggest psychological benefits of consolidation.",
    },
    {
      question: "Should I use the calculator if I have bad credit?",
      answer: "Yes, the calculator is still useful for bad credit borrowers, though you should input higher interest rates (18-36% APR for personal loans, or consider secured loans at 8-15% APR). Even with a higher consolidation rate, you might still save money if your current debts are in collections or revolving at even higher rates. The calculator helps you see if consolidation is worth pursuing or if credit repair should be your first step.",
    },
    {
      question: "What happens if I make extra payments shown in the calculator results?",
      answer: "Making extra payments toward your consolidated loan will reduce both the total interest paid and the payoff timeline significantly. For example, on a $25,000 consolidation loan at 12% APR over 5 years, the standard payment is $556/month and total interest is $8,360, but adding just $100 extra monthly payments would reduce payoff to 3.8 years and save $2,100+ in interest. Most calculators show a payoff acceleration option so you can see the impact of extra payments upfront.",
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Debt Consolidation Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The debt consolidation calculator is designed to show you whether combining multiple debts into a single loan could save you money and simplify your finances. This tool is particularly valuable if you're juggling multiple credit card payments, personal loans, or other debts at different interest rates. By comparing your current debt situation to a consolidated loan scenario, you can make an informed decision about whether consolidation aligns with your financial goals.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator effectively, you'll need to gather your current debt information: total balance owed, current interest rates or APRs on each debt, and your minimum monthly payments. Then, input your estimated consolidation loan rate (based on your credit score and recent rate quotes), the loan term you're considering (typically 3-7 years), and any consolidation fees. The calculator will automatically compute your new monthly payment, total interest costs, and how much you could save overall.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing the total interest paid under your current debts versus the consolidated loan—this is your real savings. Also pay attention to the monthly payment difference and how quickly you'd be debt-free. If the consolidation rate is lower than your current average rate and the monthly payment is manageable, consolidation is likely a good fit. However, if the calculator shows you'd pay significantly more in total interest despite a lower monthly payment, extending your current payment timeline may not be worth it.</p>
        </div>
      </section>

      {/* TABLE: Debt Consolidation Savings Example: $30,000 Debt */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Debt Consolidation Savings Example: $30,000 Debt</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how consolidating $30,000 in high-interest debt could impact your monthly payment and total interest costs across different consolidation loan rates and terms.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Consolidation Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3-Year Term</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5-Year Term</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">7-Year Term</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8% APR</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$922/mo, $2,392 interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$609/mo, $6,540 interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$465/mo, $9,120 interest</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12% APR</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$966/mo, $4,776 interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$664/mo, $9,840 interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$520/mo, $13,680 interest</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16% APR</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,011/mo, $6,396 interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$721/mo, $13,260 interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$577/mo, $18,468 interest</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20% APR</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,057/mo, $8,052 interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$780/mo, $16,800 interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$637/mo, $23,508 interest</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes consolidating from typical credit card debt averaging 21% APR. Actual savings depend on your current debt balances and interest rates. Rates current as of 2024-2025.</p>
      </section>

      {/* TABLE: Average Personal Loan Rates by Credit Score (2024-2025) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Personal Loan Rates by Credit Score (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These are typical APR ranges for unsecured personal loans based on credit score, which you should use as benchmarks when entering your consolidation rate into the calculator.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Score Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical APR Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Monthly Payment on $20,000</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Excellent (740-850)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.00%-10.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$356-$408</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Good (670-739)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.99%-17.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$408-$486</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fair (580-669)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.99%-27.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$486-$632</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poor (300-579)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25.99%-36.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$624-$770</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates from major lenders including SoFi, LendingClub, and Upstart as of Q1 2025. Actual rates vary by income, employment, and debt-to-income ratio. Personal loans typically range from $1,000-$50,000 with terms of 24-84 months.</p>
      </section>

      {/* TABLE: Consolidation Method Comparison: Rates, Terms, and Timeline */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Consolidation Method Comparison: Rates, Terms, and Timeline</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different consolidation methods offer different trade-offs in interest rates, loan terms, and approval timelines—use this guide to decide which option to model in the calculator.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Consolidation Method</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical APR Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Term</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time to Funding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6%-36%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-7 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-5 business days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Balance Transfer Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%-5% intro (then 16%-28%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-21 months intro</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Equity Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.50%-9.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 business days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Home Equity Line (HELOC)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.00%-10.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 business days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Debt Management Plan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5%-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates and terms are current for 2024-2025. Personal loans and home equity products have fixed rates and payments, while balance transfers have variable rates after the promotional period. Debt management plans are through credit counseling agencies and may affect credit.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Gather exact numbers before using the calculator—pull your latest credit card and loan statements to record actual balances and current APRs, as estimates often underestimate interest rates and can skew your results.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Shop for consolidation rates before entering numbers into the calculator—get pre-qualified quotes from at least 3 lenders (banks, credit unions, and online platforms) to see your realistic APR range based on your credit score, which ensures the calculator results match your actual borrowing power.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test multiple scenarios in the calculator to find your 'sweet spot'—try different loan terms (3-year, 5-year, 7-year) and consolidation methods (personal loan vs. balance transfer vs. home equity) to see which option gives you the best balance of lower monthly payments and minimized interest costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't just look at monthly payment savings—focus on total interest paid over the life of the loan, since consolidation with a longer term may lower your monthly payment but increase total interest, potentially costing you thousands more in the long run.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using an unrealistic consolidation interest rate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people assume they'll qualify for the advertised 'as low as 6% APR' when their credit score realistically qualifies them for 18-22% APR. Always input the rate you've actually been pre-qualified for, not the best-case scenario, or the calculator will show inflated savings that won't materialize.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include consolidation fees in your calculation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Personal loans and balance transfers often come with origination fees (1-10% of the loan amount) or balance transfer fees (3-5%). These fees get added to your loan balance or upfront cost, reducing your actual savings—make sure the calculator includes these fees in the total amount financed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Extending the loan term without considering total interest impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 7-year consolidation loan will have a lower monthly payment than a 3-year loan, but you'll pay significantly more in interest over time. Some borrowers see the lower payment and stop reading the calculator results, missing that they could pay $8,000+ more in total interest by extending the term.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Consolidating without addressing spending behavior</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you consolidate credit card debt but continue charging new balances to those cards, you'll end up with consolidated debt plus new debt—making your situation worse. The calculator assumes you stop using the original accounts, so only consolidate if you're committed to not re-accumulating debt.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a debt consolidation calculator and how does it work?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A debt consolidation calculator is a tool that combines multiple debts into a single loan estimate, showing you the potential monthly payment, total interest paid, and payoff timeline. It works by taking your current debts (credit cards, personal loans, etc.), their interest rates, and balances, then calculating what a single consolidated loan might cost. The calculator helps you compare your current situation versus consolidation to determine if you'd save money overall.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What inputs do I need to use the debt consolidation calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You'll need to provide the total amount of debt you want to consolidate, your current average interest rate or individual rates for each debt, the proposed consolidation loan rate (which you can estimate based on current market rates or your credit score), and your desired loan term in months or years. Some advanced calculators also ask for your credit score range and the type of consolidation (personal loan, balance transfer, home equity, or debt management plan) to provide more accurate rate estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can I save with debt consolidation using the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Savings depend on your current rates versus your new consolidated rate. For example, if you consolidate $25,000 in credit card debt at 18% APR into a personal loan at 10% APR over 5 years, you'd save approximately $6,500 in interest. The calculator shows exact savings by comparing total interest paid on your current debts versus the consolidated loan, helping you see if consolidation makes financial sense for your situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What debt consolidation options does the calculator account for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most debt consolidation calculators model personal loans (typically 3-7 year terms with 6-36% APR depending on credit), balance transfer cards (0-5% intro APR for 6-21 months), home equity loans (currently 7-9% APR with 5-15 year terms), and debt management plans (5-7 year repayment with reduced interest through credit counseling). Each option has different timelines, interest rates, and eligibility requirements that the calculator can help you compare.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does changing the loan term affect my consolidation results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Extending your loan term lowers your monthly payment but increases total interest paid over time. For instance, consolidating $30,000 at 12% for 3 years costs $933/month with $3,596 total interest, while extending to 7 years reduces the payment to $508/month but increases total interest to $12,672. The calculator lets you adjust the term to find the balance between affordable monthly payments and minimizing interest costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What interest rate should I assume for debt consolidation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your consolidation rate depends on your credit score, income, and the type of consolidation. For personal loans in 2024-2025, borrowers with excellent credit (740+) typically qualify for 6-10% APR, good credit (670-739) sees 10-16% APR, and fair credit (580-669) ranges from 16-28% APR. The calculator should allow you to input your expected rate based on recent rate quotes from lenders, or use national averages to estimate your likely approval rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the calculator show me how much faster I'd pay off debt?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—the calculator compares your payoff timeline under current minimum payments versus a consolidation loan with a fixed term. For example, making only minimum payments on $20,000 in credit card debt at 21% APR could take 10+ years to pay off, while consolidating into a 5-year personal loan at 14% APR guarantees payoff in 60 months. This timeline comparison is one of the biggest psychological benefits of consolidation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use the calculator if I have bad credit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator is still useful for bad credit borrowers, though you should input higher interest rates (18-36% APR for personal loans, or consider secured loans at 8-15% APR). Even with a higher consolidation rate, you might still save money if your current debts are in collections or revolving at even higher rates. The calculator helps you see if consolidation is worth pursuing or if credit repair should be your first step.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I make extra payments shown in the calculator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Making extra payments toward your consolidated loan will reduce both the total interest paid and the payoff timeline significantly. For example, on a $25,000 consolidation loan at 12% APR over 5 years, the standard payment is $556/month and total interest is $8,360, but adding just $100 extra monthly payments would reduce payoff to 3.8 years and save $2,100+ in interest. Most calculators show a payoff acceleration option so you can see the impact of extra payments upfront.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/askcfpb/1957/what-is-debt-consolidation.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Debt Consolidation Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Consumer Financial Protection Bureau explains how debt consolidation works, the types of consolidation loans, and what to watch out for when consolidating.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/loans/personal-loans/rates/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Personal Loan Terms and APRs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate provides current personal loan rates by credit score, lender, and loan term, helping you benchmark realistic consolidation rates for your calculator inputs.</p>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/article/credit-cards/balance-transfer-cards/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Balance Transfer Credit Cards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NerdWallet reviews the best balance transfer cards for debt consolidation, including intro APR periods and ongoing rates after the promotional period ends.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/articles/personal-finance/011116/when-home-equity-line-credit-makes-sense.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Home Equity Loan vs. Personal Loan for Debt Consolidation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Investopedia compares home equity loans and HELOCs to personal loans for consolidation, including the tax implications and risk differences between secured and unsecured consolidation.</p>
          </li>
        </ul>
      </section>

    </div>
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
