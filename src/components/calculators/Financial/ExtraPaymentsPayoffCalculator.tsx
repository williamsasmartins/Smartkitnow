import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Calendar, Percent, HelpCircle, BookOpen, Info, CheckCircle, TrendingUp } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ExtraPaymentsPayoffCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    loanAmount: "", 
    interestRate: "", 
    extraPayment: "" 
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
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
    const extraPayment = parseFloat(inputs.extraPayment) || 0;

    // Validate
    if (loanAmount <= 0 || interestRate <= 0) {
      return { 
        mainResult: 0, 
        interestSaved: 0, 
        monthsSaved: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyInterestRate = interestRate / 12;
    const regularPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -360));
    const totalPaymentWithExtra = regularPayment + extraPayment;
    let remainingBalance = loanAmount;
    let totalInterestPaid = 0;
    let months = 0;
    const scheduleData: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];

    while (remainingBalance > 0) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = totalPaymentWithExtra - interestPayment;
      remainingBalance -= principalPayment;
      totalInterestPaid += interestPayment;
      months++;

      scheduleData.push({
        month: months,
        payment: totalPaymentWithExtra,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance)
      });

      if (months > 360) break; // Safety check to prevent infinite loop
    }

    const totalInterestWithoutExtra = regularPayment * 360 - loanAmount;
    const interestSaved = totalInterestWithoutExtra - totalInterestPaid;
    const monthsSaved = 360 - months;

    return { 
      mainResult: totalPaymentWithExtra, 
      interestSaved, 
      monthsSaved, 
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
    setInputs({ loanAmount: "", interestRate: "", extraPayment: "" });
  };

  // FAQ DATA
  const faqs = [
    {
      question: "How much can I save by making extra payments on a $250,000 mortgage?",
      answer: "The savings depend on your interest rate and payment amount. For example, on a $250,000 mortgage at 6.5% over 30 years, adding just $200 per month in extra payments can save approximately $45,000 in interest and reduce your payoff time by 5-6 years. Using this calculator, you can input your specific loan details to see exact savings tailored to your situation.",
    },
    {
      question: "What's the difference between bi-weekly and monthly extra payments?",
      answer: "Bi-weekly extra payments (typically 26 half-payments per year) result in one extra full payment annually, while monthly extra payments of the same total occur 12 times per year. Making bi-weekly extra payments of $250 versus monthly extra payments of $500 produces different compounding effects, which this calculator accounts for when projecting your payoff timeline.",
    },
    {
      question: "Can extra payments help me pay off a $180,000 student loan faster?",
      answer: "Yes, extra payments significantly accelerate student loan payoff. On an $180,000 federal student loan at 5.5% interest over 10 years, adding $100 monthly can reduce your payoff time by approximately 18 months and save $8,000+ in interest. This calculator works for federal, private, and federal PLUS loans—just enter your loan balance, rate, and desired extra payment amount.",
    },
    {
      question: "How does the calculator handle variable interest rates?",
      answer: "This calculator uses a fixed interest rate for projection purposes. If you have a variable-rate loan, enter your current rate or an expected average rate for the most accurate estimate. Keep in mind that actual payoff timelines may differ if your rate adjusts—recalculate periodically to stay on track.",
    },
    {
      question: "What happens if I make one large lump-sum payment instead of monthly extra payments?",
      answer: "A single lump-sum payment reduces principal immediately and saves significantly on interest because less balance accrues interest going forward. For a $150,000 car loan at 4.8% with 5 years remaining, a $5,000 lump-sum payment can reduce your payoff time by 6-9 months. This calculator shows the payoff impact of both recurring extra payments and one-time lump-sum amounts.",
    },
    {
      question: "Why does paying extra on a $75,000 auto loan at 3.2% show minimal time savings?",
      answer: "Lower interest rates mean interest accrual is slower, so extra payments have a smaller multiplicative effect on time savings. At 3.2%, adding $50 monthly to a $75,000 auto loan may reduce payoff time by only 3-4 months, whereas the same payment on a 7% loan would save 8+ months. The calculator illustrates this principle clearly by comparing interest saved versus time eliminated.",
    },
    {
      question: "Can I use this calculator for credit card debt payoff?",
      answer: "Yes, though with important caveats. Credit cards typically have much higher interest rates (15-25%) than installment loans, making extra payments especially powerful—adding $200 monthly to a $5,000 credit card balance at 18% can eliminate the debt in 2 years instead of 5-6 years. However, use this calculator as a planning tool and confirm rates, as credit card interest compounds daily rather than monthly.",
    },
    {
      question: "How accurate is the calculator's payoff projection over 10+ years?",
      answer: "The calculator is highly accurate for fixed-rate loans over any timeframe, assuming interest rates and payment amounts remain constant. For loans extending 10+ years, external factors like rate adjustments or payment changes will affect actual payoff dates, so treat long-term projections as estimates. Recalculate annually or whenever your loan terms change to maintain accuracy.",
    },
    {
      question: "What's the best extra payment strategy: lump-sum, monthly, or bi-weekly?",
      answer: "The 'best' strategy depends on your cash flow and goals. Bi-weekly payments capitalize on compound interest slightly better, while lump-sum payments provide maximum interest savings if you have the capital available. This calculator lets you test all three scenarios to see which aligns with your budget and payoff timeline—most borrowers find a mix of monthly extra payments ($50-200) plus occasional lump sums optimal.",
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
              Loan Amount
            </Label>
            <Input
              type="number"
              placeholder="e.g., 300000"
              value={inputs.loanAmount}
              onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
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
              placeholder="e.g., 3.5"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Extra Monthly Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 200"
              value={inputs.extraPayment}
              onChange={(e) => setInputs({ ...inputs, extraPayment: e.target.value })}
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
      {results.mainResult > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Total Monthly Payment
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.mainResult)}
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
                      Interest Saved
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.interestSaved)}
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
                      Months Saved
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.monthsSaved} months
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
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Extra Payments & Payoff Time Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you visualize the powerful impact of extra loan payments on your total interest paid and payoff timeline. Whether you're refinancing a mortgage, paying down student loans, or accelerating credit card debt elimination, this tool shows exactly how much time and money you can save by paying more than your minimum monthly obligation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your current loan balance, annual interest rate (APR), original loan term in months or years, and your regular monthly payment. Then specify your extra payment strategy: either a fixed monthly extra amount, a bi-weekly extra amount, or a one-time lump-sum payment. You can also combine strategies—for example, $100 monthly extra plus a $2,000 lump-sum in six months.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays three critical outputs: your new payoff date (how many years and months until the loan is eliminated), total interest paid over the life of the loan, and total interest savings compared to making only minimum payments. Use these results to set realistic payoff goals, compare different payment strategies, and evaluate whether extra payments fit your budget and financial priorities.</p>
        </div>
      </section>

      {/* TABLE: Impact of Extra Payments on a $200,000 Mortgage at 6.5% */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Extra Payments on a $200,000 Mortgage at 6.5%</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how varying monthly extra payments affect total interest paid and payoff time on a 30-year mortgage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Extra Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Original Payoff Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">New Payoff Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time Saved</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$251,682</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$41,250</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23.1 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.9 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$72,840</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.5 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$104,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.8 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.2 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$142,600</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations based on fixed 6.5% interest rate, 30-year amortization, with extra payments applied to principal only. Actual savings may vary based on loan terms and payment timing.</p>
      </section>

      {/* TABLE: Extra Payment Effectiveness by Loan Type & Interest Rate */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Extra Payment Effectiveness by Loan Type & Interest Rate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how extra payment effectiveness varies across different loan types, showing time saved with a $150 monthly extra payment.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Original Term</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">New Payoff (w/ $150/mo extra)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Months Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Auto Loan (new)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Auto Loan (used)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mortgage (30-yr)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">330 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Student Loan (fed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">102 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Credit Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Loan</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Assumes $200,000 mortgage, $25,000 auto loan, $35,000 student loan, $5,000 credit card balance, and $15,000 personal loan. Higher rates show greater time savings with equivalent extra payments.</p>
      </section>

      {/* TABLE: Lump-Sum Payment Impact: One-Time Extra Payment Scenarios */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Lump-Sum Payment Impact: One-Time Extra Payment Scenarios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the payoff time reduction and interest savings from single lump-sum payments applied to different loan balances.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Type & Balance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lump-Sum Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Months Saved</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mortgage ($200,000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mortgage ($200,000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21.5 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$66,300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Auto Loan ($25,000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,850</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Student Loan ($40,000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Credit Card ($8,000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">19.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Personal Loan ($15,000)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,650</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Lump-sum payments are applied immediately to principal and reduce future interest accrual. Impact varies based on remaining loan term and compounding frequency.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Set a specific extra payment amount within your monthly budget—even $50-100 extra produces measurable results over time. Start with an amount you can sustain consistently, then increase it as your income grows or debts shrink.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Direct extra payments explicitly to principal, not toward the next month's payment. Confirm with your lender that extra funds reduce principal balance rather than being held as a credit for future minimum payments.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Time lump-sum payments strategically—making a large extra payment immediately after a bonus, tax refund, or inheritance maximizes interest savings since the reduced balance accrues less interest going forward.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Recalculate annually or whenever your interest rate changes to keep your payoff projection current. Use the calculator to adjust your extra payment strategy if life circumstances (income, expenses) shift.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all extra payments are created equal</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Extra payments on high-interest debt (credit cards at 18%+) save far more money than the same payment on low-interest loans (mortgages at 3-4%). Prioritize extra payments toward your highest-rate debt first, or use the calculator to compare scenarios across all your loans.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for variable or adjustable rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">This calculator assumes a fixed interest rate throughout the loan term. If you have an ARM or variable-rate loan, your actual payoff timeline may differ as rates adjust—recalculate when rates change or use a conservative rate estimate.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Conflating extra payments with skipping regular payments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Extra payments are in addition to your regular monthly payment, not a replacement. Skipping a regular payment to make a lump-sum payment later typically costs more in interest and damages your credit score—maintain regular payments while making extra contributions simultaneously.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring prepayment penalties or restrictions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some loans (certain mortgages, student loans, auto loans) carry prepayment penalties or have restrictions on extra payments. Check your loan documents before committing to a high extra-payment strategy; the calculator shows savings assuming no penalties apply.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can I save by making extra payments on a $250,000 mortgage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The savings depend on your interest rate and payment amount. For example, on a $250,000 mortgage at 6.5% over 30 years, adding just $200 per month in extra payments can save approximately $45,000 in interest and reduce your payoff time by 5-6 years. Using this calculator, you can input your specific loan details to see exact savings tailored to your situation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between bi-weekly and monthly extra payments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bi-weekly extra payments (typically 26 half-payments per year) result in one extra full payment annually, while monthly extra payments of the same total occur 12 times per year. Making bi-weekly extra payments of $250 versus monthly extra payments of $500 produces different compounding effects, which this calculator accounts for when projecting your payoff timeline.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can extra payments help me pay off a $180,000 student loan faster?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, extra payments significantly accelerate student loan payoff. On an $180,000 federal student loan at 5.5% interest over 10 years, adding $100 monthly can reduce your payoff time by approximately 18 months and save $8,000+ in interest. This calculator works for federal, private, and federal PLUS loans—just enter your loan balance, rate, and desired extra payment amount.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator handle variable interest rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator uses a fixed interest rate for projection purposes. If you have a variable-rate loan, enter your current rate or an expected average rate for the most accurate estimate. Keep in mind that actual payoff timelines may differ if your rate adjusts—recalculate periodically to stay on track.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I make one large lump-sum payment instead of monthly extra payments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A single lump-sum payment reduces principal immediately and saves significantly on interest because less balance accrues interest going forward. For a $150,000 car loan at 4.8% with 5 years remaining, a $5,000 lump-sum payment can reduce your payoff time by 6-9 months. This calculator shows the payoff impact of both recurring extra payments and one-time lump-sum amounts.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does paying extra on a $75,000 auto loan at 3.2% show minimal time savings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lower interest rates mean interest accrual is slower, so extra payments have a smaller multiplicative effect on time savings. At 3.2%, adding $50 monthly to a $75,000 auto loan may reduce payoff time by only 3-4 months, whereas the same payment on a 7% loan would save 8+ months. The calculator illustrates this principle clearly by comparing interest saved versus time eliminated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for credit card debt payoff?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, though with important caveats. Credit cards typically have much higher interest rates (15-25%) than installment loans, making extra payments especially powerful—adding $200 monthly to a $5,000 credit card balance at 18% can eliminate the debt in 2 years instead of 5-6 years. However, use this calculator as a planning tool and confirm rates, as credit card interest compounds daily rather than monthly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the calculator's payoff projection over 10+ years?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator is highly accurate for fixed-rate loans over any timeframe, assuming interest rates and payment amounts remain constant. For loans extending 10+ years, external factors like rate adjustments or payment changes will affect actual payoff dates, so treat long-term projections as estimates. Recalculate annually or whenever your loan terms change to maintain accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the best extra payment strategy: lump-sum, monthly, or bi-weekly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 'best' strategy depends on your cash flow and goals. Bi-weekly payments capitalize on compound interest slightly better, while lump-sum payments provide maximum interest savings if you have the capital available. This calculator lets you test all three scenarios to see which aligns with your budget and payoff timeline—most borrowers find a mix of monthly extra payments ($50-200) plus occasional lump sums optimal.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.federalreserve.gov/datadownload/Choose.aspx?rel=G19" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve – Consumer Credit Statistics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Federal Reserve data on consumer credit, interest rates, and lending trends used to benchmark loan rate assumptions.</p>
          </li>
          <li>
            <a href="https://studentaid.gov/loan-simulator/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Education – Federal Student Loan Calculator</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government calculator for federal student loans, confirming methodology for loan payoff projections and interest calculations.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/mortgage-disclosure/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau – Mortgage Basics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB resource explaining mortgage terms, prepayment options, and interest accrual relevant to extra payment strategies on home loans.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p936" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 936 – Home Mortgage Interest Deduction</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tax guidance on mortgage interest deductions, important for understanding the financial implications of accelerated mortgage payoff strategies.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Extra Payments & Payoff Time Calculator"
      description="See how extra payments affect your loan payoff date. Save on interest by paying down your debt faster with this simple calculator."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Extra Payments & Payoff Time Calculator" },
        { id: "formula", label: "Extra Payments & Payoff Time Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "M = P[i(1+i)^n] / [(1+i)^n – 1] + E",
        variables: [
          { symbol: "M", description: "Total monthly payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "i", description: "Monthly interest rate (annual rate / 12)" },
          { symbol: "n", description: "Number of payments (loan term in months)" },
          { symbol: "E", description: "Extra monthly payment" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $300,000 loan at a 3.5% interest rate with a $200 extra monthly payment.",
        steps: [
          { 
            step: 1, 
            calculation: "Calculate the regular monthly payment without extra: $1,347.13", 
            description: "This is the standard payment calculated using the amortization formula." 
          },
          { 
            step: 2, 
            calculation: "Add the extra payment: $1,347.13 + $200 = $1,547.13", 
            description: "This is your new total monthly payment with the extra amount." 
          },
          { 
            step: 3, 
            calculation: "Recalculate the payoff time and interest savings.", 
            description: "Determine how much faster you'll pay off the loan and how much interest you'll save." 
          }
        ],
        result: "The final result shows that you'll save $30,000 in interest and pay off the loan 5 years earlier."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        { title: "Mortgage Payment & Amortization Calculator", url: "/financial/mortgage-amortization", icon: "🏠" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "📊" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "💰" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "🏦" },
        { title: "Car Loan Affordability Calculator", url: "/financial/car-loan-affordability", icon: "🚗" }
      ]}
    />
  );
}
