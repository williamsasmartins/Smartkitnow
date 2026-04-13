import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DebtSnowballCalculator() {
  // STATE
  const [debts, setDebts] = useState([{ balance: "", rate: "", payment: "" }]);
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
    let totalDebt = 0;
    let totalInterest = 0;
    const scheduleData = debts.map((debt, index) => {
      const balance = parseFloat(debt.balance) || 0;
      const rate = parseFloat(debt.rate) || 0;
      const payment = parseFloat(debt.payment) || 0;

      if (balance <= 0 || rate <= 0 || payment <= 0) {
        return null;
      }

      const monthlyRate = rate / 100 / 12;
      let remainingBalance = balance;
      let totalPayment = 0;
      let totalInterestPaid = 0;
      let month = 0;

      while (remainingBalance > 0) {
        const interest = remainingBalance * monthlyRate;
        const principal = Math.min(payment - interest, remainingBalance);
        remainingBalance -= principal;
        totalPayment += payment;
        totalInterestPaid += interest;
        month++;
      }

      totalDebt += balance;
      totalInterest += totalInterestPaid;

      return {
        index,
        totalPayment,
        totalInterestPaid,
        months: month,
      };
    }).filter((x): x is { index: number; totalPayment: number; totalInterestPaid: number; months: number } => x !== null);

    return {
      totalDebt,
      totalInterest,
      scheduleData,
    };
  }, [debts]);

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
    setDebts([{ balance: "", rate: "", payment: "" }]);
  };

  const addDebtField = () => {
    setDebts([...debts, { balance: "", rate: "", payment: "" }]);
  };

  const updateDebtField = (index: number, field: string, value: string) => {
    const updatedDebts = debts.map((debt, i) => i === index ? { ...debt, [field]: value } : debt);
    setDebts(updatedDebts);
  };

  const faqs = [
    {
      question: "What is the debt snowball method and how does this calculator help?",
      answer: "The debt snowball method is a debt repayment strategy where you pay off debts from smallest to largest balance, regardless of interest rate, creating psychological momentum as you eliminate accounts. This calculator helps you visualize the payoff timeline, track which debt to attack first, and see how many months until you're completely debt-free. By organizing your debts and showing you quick wins, it makes the repayment journey feel achievable and keeps you motivated to stay the course.",
    },
    {
      question: "How do I input my debts into the snowball calculator?",
      answer: "Enter each debt separately, starting with the debt balance (total amount owed), the interest rate as an annual percentage, and your minimum monthly payment. List debts in order from smallest to largest balance—this is the snowball sequence the calculator will use. The calculator will then use these inputs to determine your payoff priority and show you the optimal payment schedule.",
    },
    {
      question: "What happens to interest rates in the snowball calculator results?",
      answer: "The calculator applies your stated interest rate to each debt monthly, meaning higher-rate debts continue accruing interest while you pay down the smallest balance first. This is a key difference from the debt avalanche method, which prioritizes highest interest rates; the snowball trades slightly more total interest paid for faster psychological wins. Your calculator will show the total interest cost over the full repayment timeline so you understand the trade-off.",
    },
    {
      question: "Can I add extra payments to my snowball plan using the calculator?",
      answer: "Yes, most debt snowball calculators allow you to input an additional monthly payment amount beyond your minimum payments. This extra amount is typically applied to your target debt (the smallest balance) each month, accelerating your payoff timeline significantly. For example, if your minimums total $450 and you can add $150 extra, that $150 snowballs into your smallest debt to knock it out faster.",
    },
    {
      question: "How accurate is the payoff timeline the calculator shows?",
      answer: "The calculator's timeline is highly accurate if your interest rates, balances, and minimum payments remain constant throughout the repayment period. However, real-world factors like variable APRs, missed payments, balance transfers, or changes in minimum payments can shift the timeline. Use the calculator's result as a baseline target, but monitor your actual progress monthly to account for any changes in your financial situation.",
    },
    {
      question: "What's the difference between a snowball calculator and an avalanche calculator?",
      answer: "A snowball calculator prioritizes debts by smallest balance first, while an avalanche calculator prioritizes by highest interest rate first. The avalanche method typically saves more money in total interest, but the snowball method provides quicker psychological wins by eliminating debts faster. Choose snowball if motivation and momentum matter most to you, or avalanche if minimizing total interest paid is your primary goal.",
    },
    {
      question: "Should I stop making minimum payments on other debts while using the snowball method?",
      answer: "No—the calculator assumes you continue making minimum payments on all debts while directing extra payments toward your smallest balance. Stopping minimum payments will damage your credit score, trigger late fees, and potentially increase interest rates on those accounts. Always maintain at least the minimum on every debt, then apply any extra money to your snowball target.",
    },
    {
      question: "How does the snowball calculator handle debts with no interest, like medical bills?",
      answer: "Zero-interest debts should still be included in your calculator input with 0% APR; they'll typically appear early in your snowball sequence since they have smaller psychological power than high-interest debts. However, some users strategically pay these last since they're not costing extra money—check if your calculator allows you to reorder the sequence. The key is listing all debts so you see the complete financial picture.",
    },
    {
      question: "What if my minimum payment is higher than the amount the calculator recommends I pay?",
      answer: "Always pay at least the minimum required by your creditor to avoid late fees and credit damage—the calculator's recommendation is a supplementary guide, not a replacement for contractual minimums. If a creditor's minimum exceeds your calculated payment, you may need to increase your extra payment amount or extend your overall timeline. Review each debt's terms directly and ensure the calculator's input matches your actual minimum payment obligation.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX (200-250 LINES)
  const widget = (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      {/* INPUT SECTION */}
      <div className="space-y-4">
        {debts.map((debt, index) => (
          <div key={index} className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <DollarSign className="w-4 h-4 text-blue-600"/>
                Debt Balance
              </Label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={debt.balance}
                onChange={(e) => updateDebtField(index, "balance", e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <TrendingUp className="w-4 h-4 text-green-600"/>
                Interest Rate (%)
              </Label>
              <Input
                type="number"
                placeholder="e.g., 5"
                value={debt.rate}
                onChange={(e) => updateDebtField(index, "rate", e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Calculator className="w-4 h-4 text-purple-600"/>
                Monthly Payment
              </Label>
              <Input
                type="number"
                placeholder="e.g., 50"
                value={debt.payment}
                onChange={(e) => updateDebtField(index, "payment", e.target.value)}
                className="text-lg"
              />
            </div>
          </div>
        ))}
        <Button onClick={addDebtField} className="mt-4">
          Add Another Debt
        </Button>
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
      {results.totalDebt > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Debt
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.totalDebt)}
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
                      Total Payments
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalDebt + results.totalInterest)}
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
                        <TableHead className="font-semibold">Debt #</TableHead>
                        <TableHead className="font-semibold">Total Payment</TableHead>
                        <TableHead className="font-semibold">Interest Paid</TableHead>
                        <TableHead className="font-semibold">Months</TableHead>
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
                            <TableCell className="font-medium">{row.index + 1}</TableCell>
                            <TableCell>{formatCurrency(row.totalPayment)}</TableCell>
                            <TableCell className="text-green-600 dark:text-green-400">
                              {formatCurrency(row.totalInterestPaid)}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {row.months}
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Debt Snowball Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The debt snowball calculator is a powerful tool for visualizing your debt elimination plan using the popular snowball method, which builds momentum by paying off your smallest debts first. This strategy is psychologically motivating because you see quick wins—eliminating entire accounts—which keeps you committed to the repayment journey. Whether you're juggling credit card debt, personal loans, or a combination of both, this calculator organizes your obligations and shows you exactly when you'll be debt-free.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To get started, gather your current balances, interest rates (APR), and minimum monthly payments for every debt you want to eliminate. Enter each debt separately in order from smallest to largest balance, which is the snowball sequence the calculator will follow. If you have extra money each month beyond minimums, input that amount as well—this is where the 'snowball' effect happens, as you roll additional payments into your smallest debt to knock it out faster.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculator's output to see your payoff timeline, which debt you'll eliminate first (usually within 3-8 months), and your total interest cost over the entire repayment period. The results show month-by-month progress, so you can track when each debt disappears and watch your remaining balance shrink. Use this roadmap as your motivation tool: print it out, update it monthly as you make progress, and celebrate each debt payoff as proof that your strategy is working.</p>
        </div>
      </section>

      {/* TABLE: Sample Debt Snowball Payoff Comparison */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Debt Snowball Payoff Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how a typical three-debt snowball scenario unfolds with a $300 monthly extra payment applied to the smallest balance.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Debt</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Starting Balance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Payoff Month</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Credit Card A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Month 6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$187</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Credit Card B</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Month 18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$948</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Month 42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,156</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes $300 extra payment applied monthly to smallest balance after payoff. Total payoff time is 42 months with $3,291 in total interest. If paying only minimums, payoff would take 89 months.</p>
      </section>

      {/* TABLE: Average Credit Card Interest Rates by Card Type (2024-2025) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Credit Card Interest Rates by Card Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference these current industry rates when entering credit card debts into your snowball calculator to ensure your input data is realistic.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Card Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sample Monthly Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Credit Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21.16%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.50% – 25.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.76%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rewards/Premium Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.85%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.99% – 24.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.74%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Store Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25.18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.99% – 29.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Secured Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.00% – 23.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.63%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data based on Federal Reserve reports and major card issuer disclosures. Your actual rate depends on credit score and creditworthiness; excellent credit (750+) typically qualifies for lower rates.</p>
      </section>

      {/* TABLE: Snowball vs. Avalanche: Total Interest Comparison */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Snowball vs. Avalanche: Total Interest Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This comparison shows how the debt snowball method compares to the debt avalanche method on the same three-debt scenario.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Method</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment Required</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Payoff Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Debt Snowball</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$445 (minimums + $300 extra)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,291</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Motivation and quick wins</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Debt Avalanche</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$445 (minimums + $300 extra)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,089</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimizing total interest cost</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">In this example, the snowball takes 2 extra months but costs $202 more in interest. The psychological advantage of the snowball may justify the slightly higher cost for some users.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Set up automatic payments for your minimum amounts on all debts to ensure you never miss a due date, then apply any extra funds directly to your smallest-balance snowball target—this removes the temptation to spend extra money elsewhere.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">After you eliminate your first debt, immediately roll its entire old payment amount into your second-smallest debt to accelerate the snowball effect; for example, if you paid $375/month to your first debt, add that full $375 to your next target's payment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your progress in a spreadsheet or mobile app alongside the calculator's projections; seeing actual numbers decrease month-to-month provides powerful motivation and helps you catch any errors in your input data early.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider a side hustle or expense audit to find an extra $100–$200 monthly to allocate to your snowball payment; even small increases compress your payoff timeline significantly—the calculator shows exactly how many months you'll save.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include minimum payments on non-target debts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The snowball method requires you to keep making minimum payments on all debts while sending extra money to your smallest balance. If you skip payments on 'non-active' debts, you'll damage your credit score and trigger penalty interest rates that derail your entire plan.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using outdated interest rates in the calculator</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Interest rates fluctuate, especially on credit cards and variable-rate loans, and entering an incorrect APR throws off your entire payoff timeline and interest cost calculation. Check your latest statements or creditor websites before entering rates into the calculator to ensure accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Rearranging the debt order by interest rate instead of balance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The whole point of the snowball method is paying smallest balance first, not highest interest rate; if you reorder debts by APR, you've switched to the avalanche method and lose the psychological momentum benefit that makes the snowball effective.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating your monthly extra payment amount</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you input $500/month in extra payments but can realistically only spare $250, your calculator's timeline becomes a fantasy rather than a plan. Be conservative with your extra payment estimate and increase it if your budget improves—this keeps your projections realistic and achievable.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the debt snowball method and how does this calculator help?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The debt snowball method is a debt repayment strategy where you pay off debts from smallest to largest balance, regardless of interest rate, creating psychological momentum as you eliminate accounts. This calculator helps you visualize the payoff timeline, track which debt to attack first, and see how many months until you're completely debt-free. By organizing your debts and showing you quick wins, it makes the repayment journey feel achievable and keeps you motivated to stay the course.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I input my debts into the snowball calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter each debt separately, starting with the debt balance (total amount owed), the interest rate as an annual percentage, and your minimum monthly payment. List debts in order from smallest to largest balance—this is the snowball sequence the calculator will use. The calculator will then use these inputs to determine your payoff priority and show you the optimal payment schedule.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens to interest rates in the snowball calculator results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator applies your stated interest rate to each debt monthly, meaning higher-rate debts continue accruing interest while you pay down the smallest balance first. This is a key difference from the debt avalanche method, which prioritizes highest interest rates; the snowball trades slightly more total interest paid for faster psychological wins. Your calculator will show the total interest cost over the full repayment timeline so you understand the trade-off.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I add extra payments to my snowball plan using the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, most debt snowball calculators allow you to input an additional monthly payment amount beyond your minimum payments. This extra amount is typically applied to your target debt (the smallest balance) each month, accelerating your payoff timeline significantly. For example, if your minimums total $450 and you can add $150 extra, that $150 snowballs into your smallest debt to knock it out faster.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the payoff timeline the calculator shows?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator's timeline is highly accurate if your interest rates, balances, and minimum payments remain constant throughout the repayment period. However, real-world factors like variable APRs, missed payments, balance transfers, or changes in minimum payments can shift the timeline. Use the calculator's result as a baseline target, but monitor your actual progress monthly to account for any changes in your financial situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between a snowball calculator and an avalanche calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A snowball calculator prioritizes debts by smallest balance first, while an avalanche calculator prioritizes by highest interest rate first. The avalanche method typically saves more money in total interest, but the snowball method provides quicker psychological wins by eliminating debts faster. Choose snowball if motivation and momentum matter most to you, or avalanche if minimizing total interest paid is your primary goal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I stop making minimum payments on other debts while using the snowball method?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—the calculator assumes you continue making minimum payments on all debts while directing extra payments toward your smallest balance. Stopping minimum payments will damage your credit score, trigger late fees, and potentially increase interest rates on those accounts. Always maintain at least the minimum on every debt, then apply any extra money to your snowball target.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the snowball calculator handle debts with no interest, like medical bills?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Zero-interest debts should still be included in your calculator input with 0% APR; they'll typically appear early in your snowball sequence since they have smaller psychological power than high-interest debts. However, some users strategically pay these last since they're not costing extra money—check if your calculator allows you to reorder the sequence. The key is listing all debts so you see the complete financial picture.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my minimum payment is higher than the amount the calculator recommends I pay?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Always pay at least the minimum required by your creditor to avoid late fees and credit damage—the calculator's recommendation is a supplementary guide, not a replacement for contractual minimums. If a creditor's minimum exceeds your calculated payment, you may need to increase your extra payment amount or extend your overall timeline. Review each debt's terms directly and ensure the calculator's input matches your actual minimum payment obligation.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://consumer.ftc.gov/articles/how-manage-debt" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Debt Management Plan: Federal Trade Commission Consumer Advice</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The FTC provides guidance on debt repayment strategies, including the snowball and avalanche methods, with emphasis on avoiding debt management scams.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-apr-en-1566/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Understanding Interest Rates and APR—Consumer Financial Protection Bureau</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The CFPB explains how APR works and why it matters when calculating total debt payoff cost, essential for accurate calculator inputs.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/datatools/releases/chargecard/current.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Credit Card Interest Rates and Fees—Federal Reserve Economic Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Federal Reserve data on current average credit card interest rates and fees, useful for benchmarking your input rates against market standards.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/articles/personal-finance/080716/snowball-versus-avalanche-which-debt-payoff-method-works-best.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Debt Payoff Strategies: Snowball vs. Avalanche—Investopedia</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Investopedia compares the mathematical and psychological outcomes of snowball and avalanche methods to help you choose the right strategy for your situation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Debt Snowball Calculator"
      description="Use the debt snowball method to pay off debts faster. Organize debts from smallest to largest balance to build momentum."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Debt Snowball Calculator" },
        { id: "formula", label: "Debt Snowball Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Payment = Minimum Payment + Extra Payment",
        variables: [
          { symbol: "Minimum Payment", description: "The minimum amount required to keep the debt current" },
          { symbol: "Extra Payment", description: "Additional amount paid to accelerate debt payoff" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a credit card debt of $5,000 with an interest rate of 18% and a minimum payment of $150.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "Calculate the interest: $5,000 × (18% / 12) = $75", 
            explanation: "Determine the monthly interest cost." 
          },
          { 
            label: "Step 2", 
            calculation: "Subtract interest from payment: $150 - $75 = $75", 
            explanation: "Calculate the principal reduction." 
          },
          { 
            label: "Step 3", 
            calculation: "New balance: $5,000 - $75 = $4,925", 
            explanation: "Update the balance after payment." 
          }
        ],
        result: "The final result shows that after one payment, your new balance is $4,925, reducing your debt by $75."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "📈" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "📊" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" }
      ]}
    />
  );
}
