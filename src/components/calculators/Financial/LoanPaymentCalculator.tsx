import { useState, useMemo, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Info,
  HelpCircle,
  BookOpen,
  Share2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

interface AmortizationRow {
  month: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function LoanPaymentCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [inputs, setInputs] = useState({
    principal: searchParams.get("principal") || "25000",
    interestRate: searchParams.get("rate") || "6.5",
    termMonths: searchParams.get("months") || "60",
    startDate: searchParams.get("date") || "",
  });

  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-calculate on mount if params exist
  useEffect(() => {
    if (searchParams.size > 0) {
      // Small delay to ensure render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => {
    // ... existing calculation logic ...
    const principal = parseFloat(inputs.principal) || 0;
    const annualRate = parseFloat(inputs.interestRate) || 0;
    const termMonths = parseFloat(inputs.termMonths) || 0;

    if (principal <= 0 || termMonths <= 0) {
      return {
        monthlyPayment: 0,
        totalPaid: 0,
        totalInterest: 0,
        payoffDateLabel: "",
        amortizationSchedule: [] as AmortizationRow[],
      };
    }

    const monthlyRate = annualRate > 0 ? annualRate / 100 / 12 : 0;

    let monthlyPayment = 0;

    if (monthlyRate === 0) {
      // No interest – simple division
      monthlyPayment = principal / termMonths;
    } else {
      const pow = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = (principal * monthlyRate * pow) / (pow - 1);
    }

    const schedule: AmortizationRow[] = [];
    let balance = principal;
    let totalPaid = 0;
    let totalInterest = 0;

    const today = new Date();
    const baseDate = inputs.startDate ? new Date(inputs.startDate) : today;

    for (let i = 1; i <= termMonths; i++) {
      const interestPayment = monthlyRate > 0 ? balance * monthlyRate : 0;
      let principalPayment = monthlyPayment - interestPayment;

      if (principalPayment > balance) {
        principalPayment = balance;
      }

      const paymentAmount = principalPayment + interestPayment;

      balance = balance - principalPayment;
      if (balance < 0.01) {
        balance = 0;
      }

      totalPaid += paymentAmount;
      totalInterest += interestPayment;

      const paymentDate = new Date(baseDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      const dateLabel = paymentDate.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      schedule.push({
        month: i,
        date: dateLabel,
        payment: paymentAmount,
        principal: principalPayment,
        interest: interestPayment,
        balance,
      });

      if (balance <= 0) break;
    }

    const payoffRow = schedule[schedule.length - 1];
    const payoffDateLabel = payoffRow?.date ?? "";

    return {
      monthlyPayment,
      totalPaid,
      totalInterest,
      payoffDateLabel,
      amortizationSchedule: schedule,
    };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const handleReset = () => {
    setInputs({
      principal: "",
      interestRate: "",
      termMonths: "",
      startDate: "",
    });
    setSearchParams({}); // Clear URL params
    setShowFullSchedule(false);
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set("principal", inputs.principal);
    params.set("rate", inputs.interestRate);
    params.set("months", inputs.termMonths);
    if (inputs.startDate) params.set("date", inputs.startDate);

    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${params.toString()}`;

    // Update URL without reloading
    window.history.replaceState({}, "", newUrl);

    // Copy to clipboard
    navigator.clipboard.writeText(newUrl);
    toast.success("Link copied to clipboard!");
  };

  const formatCurrency = (value: number) => {
    if (!isFinite(value) || isNaN(value)) return "0.00";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatNumber = (value: number, digits: number = 2) => {
    if (!isFinite(value) || isNaN(value)) return "0";
    return value.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  };

  const faqs = [
    {
      question: "What is the formula the loan payment calculator uses?",
      answer: "The loan payment calculator uses the standard amortization formula: M = P[r(1+r)^n]/[(1+r)^n-1], where M is the monthly payment, P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12), and n is the total number of payments. This formula calculates the fixed payment amount needed to fully repay a loan over its term with compound interest.",
    },
    {
      question: "How does changing the interest rate affect my monthly payment?",
      answer: "Interest rate changes have a significant impact on your monthly payment. For example, on a $300,000 mortgage over 30 years, a 6% interest rate results in a $1,799 monthly payment, while a 7% rate increases it to $1,996—a difference of $197 per month or $70,920 over the loan's life. Even a 0.5% increase can add $50-100+ to your monthly payment depending on the loan amount and term.",
    },
    {
      question: "What's the difference between the principal and total interest paid?",
      answer: "The principal is the original amount borrowed (for example, $200,000), while total interest is the additional cost of borrowing that money. On a $200,000 loan at 6.5% over 30 years, you'd pay approximately $252,000 total, meaning $52,000 in interest alone. The loan payment calculator breaks down exactly how much of each payment goes toward principal versus interest.",
    },
    {
      question: "Can the loan payment calculator help me compare different loan terms?",
      answer: "Yes, the calculator is excellent for term comparison. For instance, a $250,000 loan at 6% costs $1,499/month over 30 years but $1,887/month over 20 years. While the 20-year option has higher monthly payments, it saves you approximately $108,000 in total interest, making it valuable for comparing short-term versus long-term borrowing strategies.",
    },
    {
      question: "How do extra payments affect the amortization schedule shown by the calculator?",
      answer: "Extra payments reduce both the loan term and total interest significantly. On a $300,000 mortgage at 6.5% over 30 years, adding just $200 to your monthly $1,896 payment can shorten the loan by 5-7 years and save $60,000+ in interest. Some calculators allow you to input extra payments to show the accelerated payoff schedule.",
    },
    {
      question: "What loan types can I calculate with a loan payment calculator?",
      answer: "The loan payment calculator works for most fixed-rate loans including mortgages, auto loans, personal loans, and student loans. It calculates based on the principal amount, annual interest rate, and loan term in months or years. Variable-rate loans and adjustable-rate mortgages (ARMs) require manual recalculation when rates change, as the calculator assumes a constant interest rate.",
    },
    {
      question: "Why does my first payment seem to go mostly toward interest?",
      answer: "In an amortization schedule, early payments are heavily weighted toward interest because interest is calculated on the remaining balance. On a $400,000 mortgage at 6.5%, your first payment of $2,528 might include $2,167 in interest and only $361 in principal. As you pay down the principal, more of each payment goes toward principal reduction, which is why the amortization schedule shifts over time.",
    },
    {
      question: "How accurate is the loan payment calculator for real-world loans?",
      answer: "The calculator is very accurate for fixed-rate loans when you input the correct principal, interest rate, and term. However, real-world loans may include additional fees (origination fees, PMI, closing costs) that aren't reflected in the basic payment calculation. Always verify results with your lender, as some institutions may round payments differently or apply daily compounding instead of monthly.",
    },
    {
      question: "Can I use the calculator to determine how much loan I can afford?",
      answer: "Yes, by working backward with the calculator. If you can afford $1,500 monthly payments over 30 years at a 6.5% interest rate, you can borrow approximately $237,000. Most lenders also use the debt-to-income ratio rule: your total monthly debt payments shouldn't exceed 36-43% of gross monthly income, which the calculator can help you verify.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const hasValidResult = results.monthlyPayment > 0 && results.amortizationSchedule.length > 0;

  const displaySchedule = showFullSchedule
    ? results.amortizationSchedule
    : results.amortizationSchedule.slice(0, 12);

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Loan Payment Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Loan Payment Calculator is a financial tool designed to help you determine your monthly loan payment based on three key variables: the loan amount (principal), the interest rate, and the loan term. Whether you're considering a mortgage, auto loan, personal loan, or student loan, this calculator provides instant insights into what your monthly obligations will be and how much total interest you'll pay over the life of the loan.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter the loan principal amount (the money you're borrowing), the annual interest rate offered by your lender, and the loan term in months or years. The calculator automatically applies the amortization formula to compute your fixed monthly payment. You can also input extra payments if you plan to pay down the loan faster, which the calculator will use to show an accelerated payoff timeline.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display your monthly payment, total interest paid, and the complete amortization schedule showing how each payment is split between principal and interest. Pay special attention to the early months of the schedule—you'll notice most of your payment goes toward interest rather than principal, which is normal due to how compound interest works on loans.</p>
        </div>
      </section>

      {/* TABLE: Monthly Payment Comparison by Interest Rate (30-Year, $300,000 Loan) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Payment Comparison by Interest Rate (30-Year, $300,000 Loan)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how interest rate changes affect your monthly payment on a $300,000 loan over 30 years.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,432</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$215,609</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$515,609</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,520</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$247,515</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$547,515</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,610</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$279,767</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$579,767</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,703</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$312,589</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$612,589</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,799</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$347,515</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$647,515</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,896</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$382,480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$682,480</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,996</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$418,512</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$718,512</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,098</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$455,604</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$755,604</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8.00%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,201</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$493,639</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$793,639</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Payments calculated using standard amortization formula. Actual payments may vary based on lender rounding and additional fees.</p>
      </section>

      {/* TABLE: Loan Term Impact on Monthly Payments and Interest (5% Interest Rate, $250,000 Loan) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Loan Term Impact on Monthly Payments and Interest (5% Interest Rate, $250,000 Loan)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how loan length affects both monthly payments and total interest costs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Term</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 years (120 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,389</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$36,680</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$286,680</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 years (180 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,681</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$52,303</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$302,303</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 years (240 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,325</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$67,445</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$317,445</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 years (300 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,097</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$82,688</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$332,688</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30 years (360 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,342</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$233,140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$433,140</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Shorter terms have higher monthly payments but substantially lower total interest. A 15-year loan saves approximately $130,837 in interest compared to a 30-year loan.</p>
      </section>

      {/* TABLE: Impact of Extra Payments on Loan Payoff ($300,000 Mortgage, 6.5%, 30-Year Term) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Extra Payments on Loan Payoff ($300,000 Mortgage, 6.5%, 30-Year Term)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how additional monthly payments can accelerate loan payoff and reduce total interest.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Extra Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">New Loan Term</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Saved</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Years Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0 (Regular payment only)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27 years 4 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$33,487</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 years 8 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 years 2 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$62,845</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 years 10 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23 years 5 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$89,634</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 years 7 months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 years 7 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$137,923</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9 years 5 months</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Extra payments are applied directly to principal, significantly reducing total interest and shortening the amortization period.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Lower your interest rate by improving your credit score before applying for a loan—each 50-point increase can save $50-100+ monthly on larger loans like mortgages.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always compare the total interest paid, not just the monthly payment, when evaluating different loan terms and interest rates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to test different scenarios: try shorter terms, lower rates, and extra payment amounts to find the optimal balance between affordability and total interest savings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider making biweekly payments (half your monthly payment every two weeks) instead of monthly—this results in one extra payment per year and can reduce interest significantly without stretching your budget.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to convert annual interest rate to monthly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If your loan has a 6% annual interest rate, you must divide by 12 to get 0.5% monthly for calculator purposes. Entering 6 instead of 0.5 will dramatically overstate your monthly payment and lead to incorrect planning.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing the loan term—months vs. years</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 30-year mortgage equals 360 months, not 30 months. Entering 30 when you mean months will calculate a drastically shorter loan period and unrealistic monthly payments that don't match your actual loan agreement.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring closing costs, fees, and insurance in the total cost</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator shows your monthly payment and interest, but doesn't include origination fees, PMI (private mortgage insurance), property taxes, homeowners insurance, or HOA fees. Your true monthly housing cost may be 20-40% higher than the calculator alone suggests.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the calculator to predict variable-rate loan payments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">ARMs and variable-rate loans will have different payments as rates adjust, making the fixed calculation inaccurate. The calculator works only for fixed-rate loans where the interest rate remains constant throughout the loan term.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the formula the loan payment calculator uses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The loan payment calculator uses the standard amortization formula: M = P[r(1+r)^n]/[(1+r)^n-1], where M is the monthly payment, P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12), and n is the total number of payments. This formula calculates the fixed payment amount needed to fully repay a loan over its term with compound interest.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does changing the interest rate affect my monthly payment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Interest rate changes have a significant impact on your monthly payment. For example, on a $300,000 mortgage over 30 years, a 6% interest rate results in a $1,799 monthly payment, while a 7% rate increases it to $1,996—a difference of $197 per month or $70,920 over the loan's life. Even a 0.5% increase can add $50-100+ to your monthly payment depending on the loan amount and term.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between the principal and total interest paid?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The principal is the original amount borrowed (for example, $200,000), while total interest is the additional cost of borrowing that money. On a $200,000 loan at 6.5% over 30 years, you'd pay approximately $252,000 total, meaning $52,000 in interest alone. The loan payment calculator breaks down exactly how much of each payment goes toward principal versus interest.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the loan payment calculator help me compare different loan terms?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator is excellent for term comparison. For instance, a $250,000 loan at 6% costs $1,499/month over 30 years but $1,887/month over 20 years. While the 20-year option has higher monthly payments, it saves you approximately $108,000 in total interest, making it valuable for comparing short-term versus long-term borrowing strategies.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do extra payments affect the amortization schedule shown by the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Extra payments reduce both the loan term and total interest significantly. On a $300,000 mortgage at 6.5% over 30 years, adding just $200 to your monthly $1,896 payment can shorten the loan by 5-7 years and save $60,000+ in interest. Some calculators allow you to input extra payments to show the accelerated payoff schedule.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What loan types can I calculate with a loan payment calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The loan payment calculator works for most fixed-rate loans including mortgages, auto loans, personal loans, and student loans. It calculates based on the principal amount, annual interest rate, and loan term in months or years. Variable-rate loans and adjustable-rate mortgages (ARMs) require manual recalculation when rates change, as the calculator assumes a constant interest rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my first payment seem to go mostly toward interest?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">In an amortization schedule, early payments are heavily weighted toward interest because interest is calculated on the remaining balance. On a $400,000 mortgage at 6.5%, your first payment of $2,528 might include $2,167 in interest and only $361 in principal. As you pay down the principal, more of each payment goes toward principal reduction, which is why the amortization schedule shifts over time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the loan payment calculator for real-world loans?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator is very accurate for fixed-rate loans when you input the correct principal, interest rate, and term. However, real-world loans may include additional fees (origination fees, PMI, closing costs) that aren't reflected in the basic payment calculation. Always verify results with your lender, as some institutions may round payments differently or apply daily compounding instead of monthly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the calculator to determine how much loan I can afford?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, by working backward with the calculator. If you can afford $1,500 monthly payments over 30 years at a 6.5% interest rate, you can borrow approximately $237,000. Most lenders also use the debt-to-income ratio rule: your total monthly debt payments shouldn't exceed 36-43% of gross monthly income, which the calculator can help you verify.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.federalreserve.gov/faqs/credit_15066.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve - Consumer Credit FAQ</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Federal Reserve guidance on understanding consumer loan terms, interest rates, and payment calculations.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/mortgagetools/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau - Mortgage Calculator Tool</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB's official mortgage calculator and educational resources for understanding loan payments and amortization.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/loans/personal-loans/loan-payment-calculator/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate - Loan Payment Calculator & Amortization Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate's comprehensive guide to loan calculators, amortization schedules, and how to compare different loan options.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p936" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 936 - Home Mortgage Interest Deduction</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">IRS guidance on home mortgage interest deductions, which affects the true cost of mortgage loans for tax purposes.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Loan Payment Calculator"
      jsonLd={faqJsonLd}
      description="Estimate your monthly loan payment, total interest, and payoff date for personal loans, auto loans, or other amortizing debt. Enter the principal, interest rate, and term to see a full payment schedule."
      onThisPage={[
        { id: "how-to-use", label: "How to use this calculator" },
        { id: "formula", label: "Loan payment formula" },
        { id: "factors", label: "What affects loan payments" },
        { id: "examples", label: "Worked examples" },
        { id: "faq", label: "Frequently asked questions" },
        { id: "references", label: "References & additional resources" },
      ]}
      formula={{
        title: "Standard amortizing loan payment formula",
        formula: "M = P × [ r(1 + r)^n ] / [ (1 + r)^n − 1 ]",
        variables: [
          {
            symbol: "M",
            description: "Monthly payment: the fixed amount you pay every month.",
          },
          {
            symbol: "P",
            description: "Principal: the amount you borrow (loan amount).",
          },
          {
            symbol: "r",
            description: "Monthly interest rate: annual rate divided by 12 and by 100.",
          },
          {
            symbol: "n",
            description: "Number of payments: total monthly payments over the term.",
          },
        ],
      }}
      example={{
        title: "Example: Financing a $25,000 auto loan",
        scenario:
          "You borrow $25,000 at 6.5% APR for 60 months (5 years) and want to know your monthly payment, total paid, and total interest.",
        steps: [
          {
            step: 1,
            description: "Convert the annual interest rate to a monthly rate",
            calculation: "r = 6.5% ÷ 12 ÷ 100 = 0.0054167",
          },
          {
            step: 2,
            description: "Determine the number of monthly payments",
            calculation: "n = 60 months",
          },
          {
            step: 3,
            description: "Apply the loan payment formula",
            calculation: "M = 25,000 × [0.0054167(1 + 0.0054167)^60] / [(1 + 0.0054167)^60 − 1]",
          },
          {
            step: 4,
            description: "Calculate the monthly payment",
            calculation: "M ≈ $489.00 per month",
          },
        ],
        result:
          "Your estimated payment is about $489 per month for 60 months, with roughly $4,340 in total interest and $29,340 paid in total.",
      }}
      relatedCalculators={[
        { title: "Amortization Schedule Calculator", url: "/financial/amortization-schedule", icon: "📊" },
        { title: "Auto Loan Calculator", url: "/financial/auto-loan", icon: "🚗" },
        { title: "Mortgage Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Loan Payoff Calculator", url: "/financial/loan-payoff", icon: "💰" },
        { title: "Debt Consolidation Calculator", url: "/financial/debt-consolidation", icon: "📉" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "💹" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={
        <div className="space-y-6">
          {/* ==================== INPUTS ==================== */}
          <Card className="border-0 shadow-none">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Loan details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <Label htmlFor="principal">Loan amount (principal)</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    <DollarSign className="h-4 w-4" />
                  </span>
                  <Input
                    id="principal"
                    type="number"
                    inputMode="decimal"
                    placeholder="25000"
                    value={inputs.principal}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, principal: e.target.value }))
                    }
                    className="h-11 text-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="interestRate">Interest rate (APR %)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    placeholder="6.5"
                    value={inputs.interestRate}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, interestRate: e.target.value }))
                    }
                    className="mt-1 h-11 text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="termMonths">Loan term (months)</Label>
                  <Input
                    id="termMonths"
                    type="number"
                    inputMode="decimal"
                    placeholder="60"
                    value={inputs.termMonths}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, termMonths: e.target.value }))
                    }
                    className="mt-1 h-11 text-base"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="startDate">Optional: first payment date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={inputs.startDate}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  className="mt-1 h-11 text-base"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Used only for labeling payment dates in the amortization schedule.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ==================== ACTION BUTTONS ==================== */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCalculate}
              className="flex-1 h-11 text-base font-semibold flex items-center justify-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Calculate payment
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 h-11 text-base font-medium"
            >
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={handleShare}
              className="h-11 px-4 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950"
              title="Share this result"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* ==================== RESULTS GRID ==================== */}
          {hasValidResult && (
            <div ref={resultsRef} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Monthly Payment */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-indigo-800 shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Monthly payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                      ${formatCurrency(results.monthlyPayment)}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      Based on your loan amount, rate, and term.
                    </p>
                  </CardContent>
                </Card>

                {/* Total Interest */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      💸 Total interest paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                      ${formatCurrency(results.totalInterest)}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      Cost of borrowing over the full term.
                    </p>
                  </CardContent>
                </Card>

                {/* Total Paid */}
                <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      📊 Total amount paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      ${formatCurrency(results.totalPaid)}
                    </p>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                      Principal + interest over the life of the loan.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Payoff date + quick insight */}
              {results.payoffDateLabel && (
                <Card className="bg-slate-900 text-slate-50 dark:bg-slate-950 border border-slate-700 shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Info className="h-4 w-4 text-emerald-400" />
                      Payoff timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base">
                      At this payment amount, your loan will be paid off around{" "}
                      <span className="font-semibold">{results.payoffDateLabel}</span>, assuming
                      on-time payments and a fixed interest rate.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* ==================== VISUALIZATION CHART ==================== */}
              <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md overflow-hidden">
                <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-900">
                  <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <TrendingUp className="h-5 w-5 text-indigo-500" />
                    Principal vs. Interest Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Principal", value: parseFloat(inputs.principal) || 0, fill: "#3b82f6" },
                            { name: "Interest", value: results.totalInterest, fill: "#f43f5e" },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell key="principal" fill="#3b82f6" />
                          <Cell key="interest" fill="#f43f5e" />
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => `$${formatNumber(value)}`}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            border: "1px solid #e2e8f0",
                            color: "#1e293b",
                          }}
                          itemStyle={{ color: "#1e293b" }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          formatter={(value: string) => (
                            <span className="text-slate-700 dark:text-slate-300 font-medium ml-1">
                              {value}
                            </span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                    <p>
                      The <span className="text-indigo-500 font-bold">Principal</span> is what you borrowed.
                      The <span className="text-rose-500 font-bold">Interest</span> is the cost of borrowing.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* ==================== AMORTIZATION TABLE ==================== */}
              {displaySchedule.length > 0 && (
                <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      Payment schedule (amortization table)
                    </CardTitle>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                      See how each payment is split between principal and interest and how your
                      balance decreases over time.
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-14">#</TableHead>
                            <TableHead>Payment date</TableHead>
                            <TableHead className="text-right">Payment</TableHead>
                            <TableHead className="text-right">Principal</TableHead>
                            <TableHead className="text-right">Interest</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displaySchedule.map((row) => (
                            <TableRow key={row.month}>
                              <TableCell>{row.month}</TableCell>
                              <TableCell>{row.date}</TableCell>
                              <TableCell className="text-right">
                                ${formatCurrency(row.payment)}
                              </TableCell>
                              <TableCell className="text-right">
                                ${formatCurrency(row.principal)}
                              </TableCell>
                              <TableCell className="text-right">
                                ${formatCurrency(row.interest)}
                              </TableCell>
                              <TableCell className="text-right">
                                ${formatCurrency(row.balance)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    {results.amortizationSchedule.length > 12 && (
                      <div className="flex justify-between items-center px-4 py-3 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          Showing {displaySchedule.length} of {results.amortizationSchedule.length} payments.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFullSchedule((prev) => !prev)}
                          className="text-xs"
                        >
                          {showFullSchedule ? "Show first 12 payments" : "Show full schedule"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      }
      editorial={editorial}
    />
  );
}
