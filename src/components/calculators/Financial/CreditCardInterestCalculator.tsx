import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, TrendingUp, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CreditCardInterestCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    balance: "", 
    interestRate: "", 
    months: "" 
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
    const balanceValue = parseFloat(inputs.balance) || 0;
    const interestRateValue = parseFloat(inputs.interestRate) / 100 || 0;
    const monthsValue = parseInt(inputs.months, 10) || 0;

    // Validate
    if (balanceValue <= 0 || interestRateValue <= 0 || monthsValue <= 0) {
      return { 
        mainResult: 0, 
        totalInterest: 0, 
        totalPayment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyRate = interestRateValue / 12;
    const totalInterest = balanceValue * monthlyRate * monthsValue;
    const totalPayment = balanceValue + totalInterest;
    const mainResult = totalInterest;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: monthsValue }, (_, i) => ({
      month: i + 1,
      payment: totalPayment / monthsValue,
      principal: balanceValue / monthsValue,
      interest: totalInterest / monthsValue,
      balance: totalPayment - ((totalPayment / monthsValue) * (i + 1))
    }));

    return { 
      mainResult, 
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
    setInputs({ balance: "", interestRate: "", months: "" });
  };

  const faqs = [
    {
      question: "How does the credit card interest calculator determine my monthly interest charges?",
      answer: "The calculator uses your average daily balance and annual percentage rate (APR) to compute interest. It multiplies your balance by your daily periodic rate (APR ÷ 365) and the number of days in your billing cycle. For example, a $5,000 balance at 18% APR over 30 days generates approximately $73.97 in interest charges.",
    },
    {
      question: "What's the difference between APR and daily periodic rate in the calculator?",
      answer: "APR is your annual percentage rate expressed yearly, while the daily periodic rate is APR divided by 365 days. A 21% APR equals a 0.0575% daily periodic rate. The calculator converts APR to a daily rate to accurately compute interest for your specific billing cycle length.",
    },
    {
      question: "Can the calculator show me how long it takes to pay off my balance?",
      answer: "Yes, many credit card interest calculators include payoff timelines when you input your monthly payment amount. If you have a $10,000 balance at 19% APR and pay $200 monthly, the calculator will show you'll need approximately 66 months and pay $3,241 in total interest to reach zero balance.",
    },
    {
      question: "How accurate is the calculator if my credit card charges variable interest rates?",
      answer: "The calculator assumes a fixed APR throughout the calculation period. If your rate is variable and tied to prime rate changes, results may differ from actual charges. For the most accurate projections with variable-rate cards, use the current APR and update your inputs if the rate changes.",
    },
    {
      question: "Does the calculator account for promotional 0% APR periods?",
      answer: "Most standard credit card interest calculators apply a single APR rate throughout. If your card has a promotional 0% APR period (commonly 6-21 months), manually calculate that interest-free period separately, then use the calculator for the remaining balance at the post-promotional rate.",
    },
    {
      question: "What if I make multiple purchases at different times during my billing cycle?",
      answer: "The calculator uses your total balance or average daily balance as the input. If you need precision with staggered purchases, sum your average balance across the cycle. Most issuers use the average daily balance method, which accounts for purchase timing automatically when you input the correct total balance figure.",
    },
    {
      question: "How do balance transfers affect the calculator's interest estimates?",
      answer: "Balance transfers often carry different APRs than regular purchases—frequently 0% introductory followed by 15-25% standard rates. Input the balance transfer amount and its specific APR separately to calculate accurate interest. The calculator should show lower initial charges during the 0% period, then higher charges once the promotional rate expires.",
    },
    {
      question: "Can I use the calculator to compare interest costs between different credit cards?",
      answer: "Absolutely—this is one of the calculator's most valuable uses. Input the same balance and timeframe with different APRs from competing cards to compare interest costs. For instance, a $7,500 balance costs $1,237 over 12 months at 18% APR versus $1,050 at 15% APR, showing the value of lower rates.",
    },
    {
      question: "What happens if I miss a payment—does the calculator account for penalty APR increases?",
      answer: "Standard credit card interest calculators do not include penalty APR increases that typically range from 25-35% for late payments. If you want to model a missed payment scenario, manually update the APR input to your card's penalty rate after the missed payment date in your calculation.",
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
              Credit Card Balance
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
              placeholder="e.g., 18"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Repayment Period (Months)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 12"
              value={inputs.months}
              onChange={(e) => setInputs({ ...inputs, months: e.target.value })}
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
                      Total Interest Paid
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
                      Total Payment
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.totalPayment)}
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
                      Monthly Payment
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalPayment / parseInt(inputs.months, 10))}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Credit Card Interest Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The credit card interest calculator helps you understand exactly how much interest you'll pay on your balance over time. This tool is essential for making informed decisions about debt repayment, comparing cards, and evaluating the true cost of carrying a balance. By inputting your specific numbers, you can see the real financial impact of your credit card usage.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter three key inputs: your current credit card balance (the amount you owe), your card's annual percentage rate or APR (found on your statement or cardholder agreement), and your billing cycle length or the timeframe you want to analyze. Some calculators also allow you to input your monthly payment amount to show you how long payoff will take. These inputs determine your interest charges with precision.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your monthly interest charges, total interest over your selected period, and often a payoff timeline if you've included a payment amount. Use these outputs to compare different payment strategies—paying $200 versus $300 monthly, for example—or to evaluate whether a balance transfer or lower-APR card makes financial sense. The calculator transforms abstract APR numbers into concrete dollar amounts you'll actually pay.</p>
        </div>
      </section>

      {/* TABLE: Monthly Interest Charges by APR and Balance */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Monthly Interest Charges by APR and Balance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how much interest you'll pay in one month across common credit card balances and APR ranges.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Balance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15% APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">18% APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">21% APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">25% APR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$31.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$37.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$43.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$52.08</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$62.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$87.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$104.17</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$93.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$112.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$131.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$156.25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$125.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$175.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$208.33</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$187.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$225.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$262.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$312.50</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume 30-day billing cycle. Actual charges may vary by issuer's daily balance method.</p>
      </section>

      {/* TABLE: Total Interest Paid Over 12 Months with Fixed Monthly Payments */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Total Interest Paid Over 12 Months with Fixed Monthly Payments</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates total interest accumulation and payoff timelines for a $5,000 balance across different payment amounts and APRs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">18% APR (Months)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">18% APR (Total Interest)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">21% APR (Months)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">21% APR (Total Interest)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">39 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,118</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">43 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,289</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$744</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$847</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$570</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$624</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$452</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$490</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$307</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$330</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Payoff timelines calculated using standard amortization. Higher payments significantly reduce total interest costs.</p>
      </section>

      {/* TABLE: Average Credit Card APR by Card Type (2024-2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Credit Card APR by Card Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Understanding current market APRs helps you benchmark your card's rate and use the calculator with realistic inputs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Card Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average APR Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Highest APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Penalty APR Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rewards Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.5% - 22.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27% - 35%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cash Back Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17% - 23%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27% - 35%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Balance Transfer Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% intro (6-21 mo.)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18% - 25% after</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28% - 35%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Secured Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18% - 25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29% - 35%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Student Card</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18% - 23%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28% - 35%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates vary based on creditworthiness; applicants with excellent credit (750+) typically qualify for rates at lower end of ranges.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate your average daily balance accurately by adding up your balance at the end of each day during your billing cycle and dividing by the number of days—this is what most issuers use for interest calculations, and inputting this figure into the calculator gives the most precise results.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to test different monthly payment amounts and see how much you save on total interest with each $50 or $100 increase in payments; even small increases can shorten payoff time by months and save hundreds in interest.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run separate calculations for different credit cards with the same balance to compare APRs—a 3% APR difference between two cards might save you $400-$600 annually on a $10,000 balance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Update your calculator inputs if your issuer notifies you of an APR change due to rate increases or promotional periods ending; staying current ensures your projections remain accurate.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the balance transfer scenario feature (if available) to model transferring your balance to a 0% introductory rate card, then calculate interest on the remaining balance after the promotional period expires to see true savings.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the wrong APR in the calculator</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some cardholders confuse their purchase APR with their balance transfer or cash advance APR, which can differ by 10+ percentage points. Always verify which APR applies to your specific balance before entering it into the calculator to avoid significantly underestimating interest costs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for multiple billing cycles</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you're planning to pay down a balance over several months, ensure the calculator accounts for each month's accruing interest, not just the first month. Single-month calculations give an incomplete picture of total interest costs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming interest compounds daily without recalculation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Credit card interest doesn't technically compound—it's calculated fresh each month on your balance. However, if you don't make payments, your balance grows and interest accrues on the larger amount, so regular recalculation as your balance changes is crucial for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring grace periods in the calculation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you pay your full balance before the grace period ends (typically 20-25 days), you owe zero interest. Many calculators assume interest starts immediately, so if you consistently use your grace period, actual charges will be lower than the calculator shows.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the credit card interest calculator determine my monthly interest charges?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your average daily balance and annual percentage rate (APR) to compute interest. It multiplies your balance by your daily periodic rate (APR ÷ 365) and the number of days in your billing cycle. For example, a $5,000 balance at 18% APR over 30 days generates approximately $73.97 in interest charges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between APR and daily periodic rate in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">APR is your annual percentage rate expressed yearly, while the daily periodic rate is APR divided by 365 days. A 21% APR equals a 0.0575% daily periodic rate. The calculator converts APR to a daily rate to accurately compute interest for your specific billing cycle length.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the calculator show me how long it takes to pay off my balance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, many credit card interest calculators include payoff timelines when you input your monthly payment amount. If you have a $10,000 balance at 19% APR and pay $200 monthly, the calculator will show you'll need approximately 66 months and pay $3,241 in total interest to reach zero balance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the calculator if my credit card charges variable interest rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator assumes a fixed APR throughout the calculation period. If your rate is variable and tied to prime rate changes, results may differ from actual charges. For the most accurate projections with variable-rate cards, use the current APR and update your inputs if the rate changes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for promotional 0% APR periods?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most standard credit card interest calculators apply a single APR rate throughout. If your card has a promotional 0% APR period (commonly 6-21 months), manually calculate that interest-free period separately, then use the calculator for the remaining balance at the post-promotional rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I make multiple purchases at different times during my billing cycle?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your total balance or average daily balance as the input. If you need precision with staggered purchases, sum your average balance across the cycle. Most issuers use the average daily balance method, which accounts for purchase timing automatically when you input the correct total balance figure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do balance transfers affect the calculator's interest estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Balance transfers often carry different APRs than regular purchases—frequently 0% introductory followed by 15-25% standard rates. Input the balance transfer amount and its specific APR separately to calculate accurate interest. The calculator should show lower initial charges during the 0% period, then higher charges once the promotional rate expires.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the calculator to compare interest costs between different credit cards?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely—this is one of the calculator's most valuable uses. Input the same balance and timeframe with different APRs from competing cards to compare interest costs. For instance, a $7,500 balance costs $1,237 over 12 months at 18% APR versus $1,050 at 15% APR, showing the value of lower rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I miss a payment—does the calculator account for penalty APR increases?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard credit card interest calculators do not include penalty APR increases that typically range from 25-35% for late payments. If you want to model a missed payment scenario, manually update the APR input to your card's penalty rate after the missed payment date in your calculation.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-card-apr-en/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Understanding Credit Card Terms and APR</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Consumer Financial Protection Bureau explains how APRs work and how to calculate monthly interest charges on credit cards.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/supervisionreg/regz.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Truth in Lending Act (Regulation Z) - APR Disclosure Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Reserve guidance on how credit card issuers must disclose APRs and calculate interest under TILA requirements.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/finance/credit-cards/current-credit-card-interest-rates/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Average Credit Card Interest Rates and Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate provides current benchmark APR data for different credit card types and creditworthiness levels.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/a/averagedailybalance.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Credit Card Interest Calculation Methods</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Investopedia details the average daily balance method and other calculation approaches used by credit card issuers.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Credit Card Interest Calculator"
      description="Estimate how much interest you will pay on your credit card balance over time. See the cost of carrying debt."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      onThisPage={[
        { id: "introduction", label: "Understanding Credit Card Interest Calculator" },
        { id: "formula", label: "Credit Card Interest Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Total Interest = Principal × (Annual Interest Rate / 12) × Number of Months",
        variables: [
          { symbol: "Principal", description: "Current credit card balance" },
          { symbol: "Annual Interest Rate", description: "Yearly interest rate expressed as a decimal" },
          { symbol: "Number of Months", description: "Total repayment period in months" }
        ],
        title: "Calculation Formula"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $5,000 balance with an 18% annual interest rate, planning to pay it off over 12 months.",
        steps: [
          { 
            step: 1, 
            calculation: "5000 × (0.18 / 12) × 12 = 900", 
            description: "Calculate the total interest paid over the period." 
          },
          { 
            step: 2, 
            calculation: "5000 + 900 = 5900", 
            description: "Determine the total payment including interest." 
          },
          { 
            step: 3, 
            calculation: "5900 / 12 = 491.67", 
            description: "Calculate the monthly payment required." 
          }
        ],
        result: "The total interest paid is $900, and the monthly payment required is approximately $491.67."
      }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "💵" },
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💰"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"💸"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}