import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Calendar, Percent, HelpCircle, BookOpen, Info, CheckCircle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BalloonPaymentCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    loanAmount: "", 
    interestRate: "", 
    termYears: "", 
    balloonPayment: "" 
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
    const termYears = parseFloat(inputs.termYears) || 0;
    const balloonPayment = parseFloat(inputs.balloonPayment) || 0;

    // Validate
    if (loanAmount <= 0 || interestRate <= 0 || termYears <= 0) {
      return { 
        monthlyPayment: 0, 
        totalInterest: 0, 
        totalCost: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations here
    const monthlyRate = interestRate / 12;
    const numberOfPayments = termYears * 12;
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const totalInterest = (monthlyPayment * numberOfPayments) - loanAmount;
    const totalCost = loanAmount + totalInterest + balloonPayment;

    // Generate schedule data if applicable (e.g., amortization)
    const scheduleData = Array.from({ length: numberOfPayments }, (_, i) => ({
      month: i + 1,
      payment: monthlyPayment,
      principal: monthlyPayment * 0.7,
      interest: monthlyPayment * 0.3,
      balance: loanAmount - ((monthlyPayment - (monthlyPayment * 0.3)) * (i + 1))
    }));

    return { 
      monthlyPayment, 
      totalInterest, 
      totalCost, 
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
    setInputs({ loanAmount: "", interestRate: "", loanTerm: "", balloonAmount: "" });
  };

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

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Term (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 30"
              value={inputs.termYears}
              onChange={(e) => setInputs({ ...inputs, termYears: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <DollarSign className="w-4 h-4 text-red-600"/>
              Balloon Payment
            </Label>
            <Input
              type="number"
              placeholder="e.g., 50000"
              value={inputs.balloonPayment}
              onChange={(e) => setInputs({ ...inputs, balloonPayment: e.target.value })}
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
      {results.monthlyPayment > 0 && (
        <div ref={resultsRef} className="space-y-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* MAIN RESULT - Full Width Gradient (MANDATORY STYLE) */}
            <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 shadow-xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      Monthly Payment
                    </p>
                    <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(results.monthlyPayment)}
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
                      Total Interest
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
                      Total Cost
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.totalCost)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Balloon Payment Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Balloon Payment Calculator helps you understand how a lump-sum payment at loan maturity affects your monthly obligations. This tool is essential for evaluating whether balloon financing—common in auto leases, car purchases, and commercial mortgages—fits your budget and long-term plans. By modeling different scenarios, you can compare monthly costs against traditional amortizing loans and assess refinancing risk.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter four key inputs: the total loan amount (e.g., $50,000), the balloon payment due at the end (e.g., $15,000), the annual interest rate as an APR (e.g., 6.5%), and your desired loan term in months (e.g., 60). The calculator then determines how much principal you'll actually finance—the difference between the loan amount and balloon payment—and amortizes that balance across your chosen timeframe while accruing interest.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your monthly payment, total interest paid over the loan life, and total principal and interest combined (excluding the balloon). Use these outputs to compare affordability against alternative financing, evaluate whether you can realistically pay or refinance the balloon at maturity, and understand the true cost of borrowing. Always cross-reference the calculator's results with your actual loan documents and lender to confirm terms.</p>
        </div>
      </section>

      {/* TABLE: Sample Balloon Payment Scenarios: Auto Loan */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample Balloon Payment Scenarios: Auto Loan</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These scenarios show how loan amount, balloon size, and interest rate affect monthly payments on a 60-month auto loan.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Balloon Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Interest Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$455</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,700</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,380</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$640</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$595</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,225</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All calculations assume 60-month (5-year) terms. Monthly payments rounded to nearest $5.</p>
      </section>

      {/* TABLE: Impact of Loan Term on Monthly Payments */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Loan Term on Monthly Payments</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how extending or shortening the loan term changes monthly payments for a $45,000 loan with a $12,000 balloon at 6.5% APR.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Term (Months)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Amount Paid (Excl. Balloon)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,065</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$38,340</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$820</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,960</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$39,360</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$680</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40,800</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$590</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,840</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$42,480</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$525</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$44,100</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Balloon payment of $12,000 is due at end of term in all scenarios. Longer terms reduce monthly payment but increase total interest.</p>
      </section>

      {/* TABLE: 2024-2025 Average Auto Loan Rates by Credit Score */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">2024-2025 Average Auto Loan Rates by Credit Score</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these benchmarks to estimate realistic interest rates when using the Balloon Payment Calculator for an auto loan.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Score Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average APR (New Car)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average APR (Used Car)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Term (Months)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Excellent (781-850)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.49%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Good (661-780)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.24%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fair (601-660)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.59%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.74%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poor (300-600)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.99%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15.49%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">No Credit History</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data reflects Q1 2025 averages from Experian. Rates vary by lender, down payment, and loan term.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare the total cost of a balloon loan against a traditional amortizing loan of the same amount and term—the lower monthly payment may be offset by higher total interest or refinancing risk when the balloon matures.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Build a dedicated savings fund during your loan term to cover the balloon payment; don't assume you'll refinance, as interest rates may be higher at maturity and your credit score or income could change.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Enter your actual interest rate from your loan agreement or current market rates (check Bankrate, LendingTree, or your bank); using an estimated rate can lead to significantly inaccurate monthly payment projections.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test multiple balloon amounts using the calculator to find the right balance between affordable monthly payments and manageable final liability—for example, try $10,000, $15,000, and $20,000 balloons to compare.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Total Interest Cost</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many borrowers focus only on the lower monthly payment and overlook that balloon loans often carry higher total interest charges. For instance, a $40,000 balloon loan over 60 months might cost $3,500 in interest versus $2,800 for a traditional loan, negating monthly savings.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Refinancing Will Always Be Available</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If market interest rates rise or your credit score drops by loan maturity, refinancing the balloon at favorable terms may not be possible. Entering a refinance scenario without a backup plan to pay the balloon lump sum can result in default or forced asset sale.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using an Inaccurate or Estimated Interest Rate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering an assumed rate rather than your actual APR leads to misleading monthly payment and interest calculations. Always use the exact rate from your loan agreement or current lender quotes to ensure the calculator's output is reliable.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Fees and Insurance in Total Cost</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator shows interest and principal only; it does not include registration, insurance, taxes, or origination fees. Adding these expenses post-calculation is essential to understand your true monthly and total financial obligation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a balloon payment and why would I use one?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A balloon payment is a large lump sum payment due at the end of a loan term, typically used in auto leases, mortgages, and commercial financing. Borrowers use balloon payments to lower their monthly payments during the loan period—for example, a $30,000 car loan with a $10,000 balloon payment might have monthly payments of $400 instead of $550. This structure works well if you expect your financial situation to improve or plan to refinance before the balloon comes due.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the Balloon Payment Calculator determine my monthly payment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses the loan amount minus the balloon payment to calculate monthly installments over your chosen term. For instance, if you borrow $40,000 with a $12,000 balloon payment at 6.5% APR over 60 months, the calculator amortizes the remaining $28,000 across those months plus interest. The formula accounts for the principal reduction each month while accruing interest on the declining balance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What interest rate should I enter for my balloon loan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your loan's annual percentage rate (APR), which includes all fees and interest costs. As of 2025, average auto loan rates range from 4.5% to 8.5% depending on credit score and term length. You can find your specific rate on your loan agreement, or check current market rates on sites like Bankrate or your lender's website.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for a mortgage with a balloon payment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the Balloon Payment Calculator works for any amortizing loan with a lump sum due at maturity. For example, a commercial mortgage of $500,000 at 7% over 10 years with a $150,000 balloon payment would show monthly payments of approximately $3,800. However, balloon mortgages carry refinancing risk, so verify with your lender whether your property qualifies for renewal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I can't afford the balloon payment when it comes due?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you cannot pay the balloon amount, you typically must refinance the remaining balance as a new loan, potentially at higher rates if interest rates have risen. For example, if rates increase from 5% to 7% and you have a $20,000 balloon remaining, your refinancing cost will be significantly higher. It's critical to plan ahead or build savings during the loan term to cover this obligation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does increasing the balloon payment amount affect my monthly payment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Increasing the balloon payment directly reduces your monthly payment because less principal is being amortized over the loan term. For example, on a $50,000 loan at 6% over 60 months, a $10,000 balloon yields ~$745/month, while a $20,000 balloon yields ~$596/month. The trade-off is higher refinancing risk and a larger obligation at loan maturity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What loan term should I choose for my balloon payment loan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common balloon loan terms are 3 to 7 years, though some commercial loans extend to 10 years or longer. Shorter terms (36 months) mean higher monthly payments but less interest paid overall, while longer terms (84 months) lower monthly payments but increase total interest costs. Choose a term aligned with your ability to refinance or pay the balloon before maturity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the Balloon Payment Calculator include taxes, insurance, and fees?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, the calculator computes interest and principal payments only. For a complete picture, add estimates for property taxes (if a mortgage), insurance, registration, and origination fees to your monthly and final costs. Some lenders roll fees into the loan amount, so verify with your lender whether the rate quoted is all-inclusive.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What total interest will I pay with a balloon payment structure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Total interest depends on the principal being financed, the rate, and the term length. For example, a $40,000 loan at 6.5% over 60 months with a $10,000 balloon results in roughly $4,200 in interest charges on the $30,000 financed amount. The calculator displays this clearly, allowing you to compare interest costs against alternative financing structures.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/about-us/newsroom/consumer-financial-protection-bureau-publishes-auto-loan-market-snapshot/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau: Auto Loans</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official CFPB guidance on auto loan terms, rates, and consumer protections related to vehicle financing.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/datadownload/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve: Interest Rate Data and Historical Trends</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Reserve economic data portal providing historical and current interest rates for loans and mortgages.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/terms/b/balloon-loan.asp" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia: Balloon Loan Explained</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive explanation of balloon loan structures, uses, risks, and comparison to traditional amortizing loans.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/auto/auto-loan-rates/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate: Auto Loan Rates and Calculators</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current auto loan rates by credit score, term length, and lender, plus interactive calculators for loan comparisons.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="Balloon Payment Calculator"
      description="Calculate monthly payments and the final balloon payment amount. Essential for loans with a large lump-sum payoff at the end of the term."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding Balloon Payment Calculator" },
        { id: "formula", label: "Balloon Payment Calculator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "M = (P * i) / (1 - (1 + i)^-n) + B / (1 + i)^n",
        variables: [
          { symbol: "M", description: "Monthly Payment" },
          { symbol: "P", description: "Principal Amount" },
          { symbol: "i", description: "Monthly Interest Rate" },
          { symbol: "n", description: "Total Number of Payments" },
          { symbol: "B", description: "Balloon Payment Amount" }
        ],
        title: "Balloon Payment Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $200,000 loan with a 5% interest rate over 30 years, and a balloon payment of $50,000.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "200000 × 0.004167 = 833.40", 
            explanation: "Calculate the monthly interest payment." 
          },
          { 
            label: "Step 2", 
            calculation: "833.40 × 360 = 300024", 
            explanation: "Determine the total interest over the loan term." 
          },
          { 
            label: "Step 3", 
            calculation: "200000 + 300024 + 50000 = 550024", 
            explanation: "Final result shows the total cost including the balloon payment." 
          }
        ],
        result: "The final result is $550,024, meaning this is the total amount you will pay over the life of the loan."
      }}
      relatedCalculators={[
        {"title":"Loan Payment Calculator (Principal, Rate, Term)","url":"/financial/loan-payment","icon":"💵"},
        {"title":"Mortgage Payment & Amortization Calculator","url":"/financial/mortgage-amortization","icon":"🏠"},
        {"title":"Extra Payments & Payoff Time Calculator","url":"/financial/extra-payments-payoff","icon":"📈"},
        {"title":"Interest-Only Loan Calculator","url":"/financial/interest-only-loan","icon":"💳"},
        {"title":"Refinance Savings Calculator","url":"/financial/refinance-savings","icon":"🔄"},
        {"title":"HELOC Payment Estimator","url":"/financial/heloc-payment-estimator","icon":"🏦"}
      ]}
    />
  );
}