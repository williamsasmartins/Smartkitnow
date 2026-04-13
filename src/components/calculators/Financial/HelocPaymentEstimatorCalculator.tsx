import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, DollarSign, Calendar, Percent, HelpCircle, BookOpen, Info, CheckCircle, TrendingUp } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HelocPaymentEstimatorCalculator() {
  // STATE
  const [inputs, setInputs] = useState({ 
    loanAmount: "", 
    interestRate: "", 
    drawPeriod: "", 
    repaymentPeriod: "" 
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
    // Parse inputs
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
    const drawPeriod = parseInt(inputs.drawPeriod) || 0;
    const repaymentPeriod = parseInt(inputs.repaymentPeriod) || 0;

    // Validate
    if (loanAmount <= 0 || interestRate <= 0 || drawPeriod <= 0 || repaymentPeriod <= 0) {
      return { 
        mainResult: 0, 
        drawPeriodPayment: 0, 
        repaymentPeriodPayment: 0, 
        scheduleData: [] 
      };
    }

    // Perform calculations
    const drawPeriodPayment = loanAmount * interestRate / 12;
    const repaymentPeriodPayment = (loanAmount * interestRate / 12) / (1 - Math.pow(1 + interestRate / 12, -repaymentPeriod * 12));
    const mainResult = drawPeriodPayment + repaymentPeriodPayment;

    // Generate schedule data
    const scheduleData = Array.from({ length: drawPeriod + repaymentPeriod }, (_, i) => ({
      month: i + 1,
      payment: i < drawPeriod ? drawPeriodPayment : repaymentPeriodPayment,
      principal: i < drawPeriod ? 0 : repaymentPeriodPayment - (loanAmount * interestRate / 12),
      interest: i < drawPeriod ? drawPeriodPayment : (loanAmount * interestRate / 12),
      balance: loanAmount - (i < drawPeriod ? 0 : (repaymentPeriodPayment - (loanAmount * interestRate / 12)) * (i - drawPeriod + 1))
    }));

    return { 
      mainResult, 
      drawPeriodPayment, 
      repaymentPeriodPayment, 
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
    setInputs({ loanAmount: "", interestRate: "", drawPeriod: "", repaymentPeriod: "" });
  };

  const faqs = [
    {
      question: "What is the difference between a HELOC draw period and repayment period?",
      answer: "The draw period, typically 5-10 years, is when you can borrow and make interest-only payments on your HELOC. The repayment period, usually 10-20 years, begins after the draw period ends and requires you to pay down both principal and interest, often at a higher payment amount. This calculator helps you estimate payments for both phases.",
    },
    {
      question: "How does the variable interest rate affect my HELOC payment estimate?",
      answer: "Most HELOCs use variable rates tied to the prime rate plus a margin (typically 0.5-2%). When rates rise, your monthly payments increase; when they fall, your payments decrease. The HELOC Payment Estimator allows you to input different rate scenarios to see how a potential 1-3% rate increase could impact your payments over time.",
    },
    {
      question: "What home equity do I need to qualify for a HELOC?",
      answer: "Most lenders require at least 15-20% equity in your home to open a HELOC, with some allowing up to 80-90% loan-to-value (LTV) ratios. For example, on a $300,000 home, you'd typically need $45,000-$60,000 in equity to qualify. Use this calculator to determine manageable payment amounts based on your expected credit line.",
    },
    {
      question: "Can this calculator show me interest-only versus principal-and-interest payments?",
      answer: "Yes, the HELOC Payment Estimator distinguishes between draw period payments (usually interest-only) and repayment period payments (principal and interest combined). For a $100,000 HELOC at 8% interest, your draw period payment might be $667/month, but your repayment period payment could jump to $1,200+/month depending on the term length.",
    },
    {
      question: "What happens to my HELOC payment if interest rates spike?",
      answer: "If rates jump 2-3%, your monthly payment can increase significantly during variable-rate periods. For instance, a $150,000 HELOC at 7% ($875/month) could rise to $1,050+ if rates hit 9%. This calculator lets you model rate-shock scenarios to ensure you can afford payments if the prime rate climbs.",
    },
    {
      question: "How much can I typically borrow with a HELOC?",
      answer: "HELOC credit limits typically range from $25,000 to $500,000, with most lenders capping borrowing at 80-85% of your home's value minus your mortgage balance. On a $400,000 home with a $250,000 mortgage, you might qualify for a $70,000-$120,000 HELOC depending on credit score and debt-to-income ratio.",
    },
    {
      question: "Should I use the draw period to pay down other debts with a HELOC?",
      answer: "Many borrowers use HELOCs to consolidate high-interest debt (credit cards at 18-24%) into lower-rate borrowing (current HELOC rates around 8-9%). However, this calculator shows that your payments balloon during the repayment period, so ensure you can afford the full principal-and-interest phase before borrowing heavily during the draw period.",
    },
    {
      question: "What closing costs should I expect when opening a HELOC?",
      answer: "HELOC closing costs typically range from $2,000-$5,000 (0.5-1.5% of the credit line), including appraisal, title search, and underwriting fees. Unlike mortgages, many HELOCs offer waived closing costs if you maintain a minimum balance or use the line regularly, so factor this into your total borrowing cost.",
    },
    {
      question: "How does my credit score affect HELOC rates and payments?",
      answer: "Borrowers with credit scores of 740+ typically qualify for rates 0.5-1.5% lower than those with 650-700 scores. A $200,000 HELOC at 7% costs $1,167/month in interest-only, but at 8.5% it costs $1,417/month—a $250 monthly difference. This calculator helps you understand how rate variations based on creditworthiness impact affordability.",
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
              placeholder="e.g., 100000"
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
              placeholder="e.g., 4.5"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Draw Period (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10"
              value={inputs.drawPeriod}
              onChange={(e) => setInputs({ ...inputs, drawPeriod: e.target.value })}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calculator className="w-4 h-4 text-purple-600"/>
              Repayment Period (Years)
            </Label>
            <Input
              type="number"
              placeholder="e.g., 20"
              value={inputs.repaymentPeriod}
              onChange={(e) => setInputs({ ...inputs, repaymentPeriod: e.target.value })}
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
                      Draw Period Payment
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(results.drawPeriodPayment)}
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
                      Repayment Period Payment
                    </p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(results.repaymentPeriodPayment)}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the HELOC Payment Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The HELOC Payment Estimator is designed to help you project monthly payments on a home equity line of credit, accounting for both the interest-only draw period and the principal-and-interest repayment period. Understanding these two phases is critical because payments can more than double when you transition from the draw phase to repayment, making advance planning essential for your household budget.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll input three key variables: the total credit line amount you plan to borrow (or expect to qualify for), the interest rate (either current market rates or a scenario you want to test), and the duration of both your draw period and repayment period. These inputs directly determine whether your HELOC remains affordable throughout its full lifecycle and help you decide if consolidating debt or funding home improvements makes financial sense.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">After calculating, review both your draw-period and repayment-period payment amounts side by side. Pay special attention to the payment jump when the repayment phase begins—this is where many borrowers encounter affordability challenges. Use this estimate to compare with other lenders' terms, stress-test for potential rate increases, and ensure you can manage payments even if the prime rate climbs 1-2% above current levels.</p>
        </div>
      </section>

      {/* TABLE: Sample HELOC Payment Estimates by Credit Line and Rate */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Sample HELOC Payment Estimates by Credit Line and Rate</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated monthly payments during the draw period (interest-only) for various HELOC amounts and interest rates as of 2025.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Line Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 7% APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 8% APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 9% APR</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">At 10% APR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$50,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$292</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$333</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$417</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$100,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$583</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$667</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$833</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,167</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,333</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,667</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$250,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,458</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,667</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,083</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Payments shown are interest-only during typical 5-10 year draw periods. Actual rates vary by lender, creditworthiness, and market conditions. Repayment period payments will be significantly higher.</p>
      </section>

      {/* TABLE: HELOC Repayment Period Payment Comparison (10-Year Repayment) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">HELOC Repayment Period Payment Comparison (10-Year Repayment)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how monthly payments increase when transitioning from draw period to repayment period for a $150,000 HELOC at 8% interest.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Period</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Payment Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest (Period)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Principal Paid Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Years 1-5 (Draw)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Interest-Only</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Years 6-15 (Repayment)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Principal + Interest</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,823</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$73,815</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Years 1-15 Combined</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mixed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Avg: $1,412</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$133,815</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This example assumes the HELOC rate remains constant at 8% throughout all periods. Variable rates may increase or decrease actual payments. Total interest paid would be higher if rates rise during the repayment phase.</p>
      </section>

      {/* TABLE: Home Equity Requirements by Loan-to-Value (LTV) Ratio */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Home Equity Requirements by Loan-to-Value (LTV) Ratio</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows minimum home equity needed to qualify for a HELOC based on common lender LTV maximums.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Home Value</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">80% LTV Max Borrow</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">85% LTV Max Borrow</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mortgage Balance Example</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Available HELOC Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$250,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$200,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$212,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50,000–$62,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$350,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$280,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$297,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$210,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$70,000–$87,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$400,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$320,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$340,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$250,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$70,000–$90,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$500,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$400,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$425,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100,000–$125,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual HELOC amounts depend on credit score, income, debt-to-income ratio, and individual lender policies. Most major lenders cap LTV at 85%, with some premium borrowers accessing up to 90%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Model rate-shock scenarios by increasing your assumed interest rate by 2-3% to prepare for potential payment increases. If a $150,000 HELOC is unaffordable at 10% interest, it may not be wise to borrow at today's 8% rates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the draw period strategically to pay down high-interest debt (credit cards, personal loans) before the repayment phase begins, reducing the principal balance you'll need to repay with interest and principal combined.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare the total interest paid across different repayment periods (10, 15, or 20 years)—a longer repayment period lowers monthly payments but increases total interest cost significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in closing costs (typically $2,000-$5,000) when deciding whether to open a HELOC for debt consolidation; the interest savings must outweigh upfront fees to make the strategy worthwhile.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Repayment Period Payments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many borrowers focus only on low draw-period payments and ignore the payment shock when the repayment phase begins. A $100,000 HELOC might cost $667/month during the draw phase but $1,200+/month during repayment, creating budget strain if not anticipated in advance.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Borrowing More Than You Need</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Just because you qualify for a $200,000 HELOC doesn't mean you should draw the full amount. Each additional $50,000 borrowed increases your repayment phase payment by $600-$800/month depending on rates and terms, so only borrow what you actually need.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Variable Rate Risk</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming your HELOC rate will stay flat at today's 8% over 15+ years is unrealistic. A 3% rate increase can jump your monthly payment from $1,000 to $1,250+, so use this calculator to stress-test what happens if rates rise.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using a HELOC as Emergency Savings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some borrowers open a HELOC as a backup emergency fund but neglect to plan for repayment obligations. If you hit a financial hardship (job loss, medical bills) and have drawn on the HELOC, you'll still owe principal-and-interest payments during the repayment phase, which could worsen your situation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between a HELOC draw period and repayment period?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The draw period, typically 5-10 years, is when you can borrow and make interest-only payments on your HELOC. The repayment period, usually 10-20 years, begins after the draw period ends and requires you to pay down both principal and interest, often at a higher payment amount. This calculator helps you estimate payments for both phases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the variable interest rate affect my HELOC payment estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most HELOCs use variable rates tied to the prime rate plus a margin (typically 0.5-2%). When rates rise, your monthly payments increase; when they fall, your payments decrease. The HELOC Payment Estimator allows you to input different rate scenarios to see how a potential 1-3% rate increase could impact your payments over time.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What home equity do I need to qualify for a HELOC?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most lenders require at least 15-20% equity in your home to open a HELOC, with some allowing up to 80-90% loan-to-value (LTV) ratios. For example, on a $300,000 home, you'd typically need $45,000-$60,000 in equity to qualify. Use this calculator to determine manageable payment amounts based on your expected credit line.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator show me interest-only versus principal-and-interest payments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the HELOC Payment Estimator distinguishes between draw period payments (usually interest-only) and repayment period payments (principal and interest combined). For a $100,000 HELOC at 8% interest, your draw period payment might be $667/month, but your repayment period payment could jump to $1,200+/month depending on the term length.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens to my HELOC payment if interest rates spike?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If rates jump 2-3%, your monthly payment can increase significantly during variable-rate periods. For instance, a $150,000 HELOC at 7% ($875/month) could rise to $1,050+ if rates hit 9%. This calculator lets you model rate-shock scenarios to ensure you can afford payments if the prime rate climbs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much can I typically borrow with a HELOC?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">HELOC credit limits typically range from $25,000 to $500,000, with most lenders capping borrowing at 80-85% of your home's value minus your mortgage balance. On a $400,000 home with a $250,000 mortgage, you might qualify for a $70,000-$120,000 HELOC depending on credit score and debt-to-income ratio.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I use the draw period to pay down other debts with a HELOC?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Many borrowers use HELOCs to consolidate high-interest debt (credit cards at 18-24%) into lower-rate borrowing (current HELOC rates around 8-9%). However, this calculator shows that your payments balloon during the repayment period, so ensure you can afford the full principal-and-interest phase before borrowing heavily during the draw period.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What closing costs should I expect when opening a HELOC?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">HELOC closing costs typically range from $2,000-$5,000 (0.5-1.5% of the credit line), including appraisal, title search, and underwriting fees. Unlike mortgages, many HELOCs offer waived closing costs if you maintain a minimum balance or use the line regularly, so factor this into your total borrowing cost.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my credit score affect HELOC rates and payments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Borrowers with credit scores of 740+ typically qualify for rates 0.5-1.5% lower than those with 650-700 scores. A $200,000 HELOC at 7% costs $1,167/month in interest-only, but at 8.5% it costs $1,417/month—a $250 monthly difference. This calculator helps you understand how rate variations based on creditworthiness impact affordability.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/about-us/blog/home-equity-lines-of-credit-how-they-work/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau – Home Equity Lines of Credit</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official CFPB guidance on how HELOCs work, including draw and repayment periods, variable rates, and borrower protections.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/datadownload/Choose.aspx?rel=H.15" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve – Historical Prime Rate Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Historical and current prime rate data from the Federal Reserve, essential for understanding HELOC rate benchmarks tied to prime plus margin.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/loans/home-equity/heloc-rates/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate – HELOC Rates and Terms Comparison</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current HELOC interest rates, lender offers, and comparison tools to validate rate assumptions in your payment estimate.</p>
          </li>
          <li>
            <a href="https://www.irs.gov/publications/p936" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IRS Publication 936 – Home Mortgage Interest Deduction</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">IRS guidelines on tax deductibility of HELOC interest when funds are used to buy, build, or improve your home.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // RETURN STATEMENT
  return (
    <CalculatorVerticalLayout
      title="HELOC Payment Estimator"
      description="Estimate monthly payments for a Home Equity Line of Credit (HELOC). Calculate costs during both the draw period and the repayment period."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Understanding HELOC Payment Estimator" },
        { id: "formula", label: "HELOC Payment Estimator Formula" },
        { id: "factors", label: "Key Factors That Affect Results" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" }
      ]}
      formula={{
        formula: "Monthly Payment = (Loan Amount × Interest Rate / 12) / (1 - (1 + Interest Rate / 12)^(-Repayment Period × 12))",
        variables: [
          { symbol: "Loan Amount", description: "Total amount borrowed" },
          { symbol: "Interest Rate", description: "Annual interest rate (as a decimal)" },
          { symbol: "Repayment Period", description: "Number of years for repayment" }
        ],
        title: "Calculation Formula"
      }}
      jsonLd={faqJsonLd}
      example={{
        title: "Example Calculation",
        scenario: "Imagine you have a $100,000 HELOC with a 4.5% interest rate, a 10-year draw period, and a 20-year repayment period.",
        steps: [
          { 
            label: "Step 1", 
            calculation: "100000 × 0.045 / 12 = 375", 
            explanation: "Calculate the monthly interest payment during the draw period." 
          },
          { 
            label: "Step 2", 
            calculation: "375 / (1 - (1 + 0.045 / 12)^(-240)) = 632.65", 
            explanation: "Determine the monthly payment during the repayment period." 
          },
          { 
            label: "Step 3", 
            calculation: "375 + 632.65 = 1007.65", 
            explanation: "Total monthly payment combining both periods." 
          }
        ],
        result: "The final result is $1,007.65, meaning this is your estimated monthly payment during the repayment period."
      }}
      relatedCalculators={[
        { "title": "Loan Payment Calculator (Principal, Rate, Term)", "url": "/financial/loan-payment", "icon": "💵" },
        { "title": "Mortgage Payment & Amortization Calculator", "url": "/financial/mortgage-amortization", "icon": "🏠" },
        { "title": "Extra Payments & Payoff Time Calculator", "url": "/financial/extra-payments-payoff", "icon": "📈" },
        { "title": "Interest-Only Loan Calculator", "url": "/financial/interest-only-loan", "icon": "💳" },
        { "title": "Refinance Savings Calculator", "url": "/financial/refinance-savings", "icon": "💰" },
        { "title": "Car Loan Affordability Calculator", "url": "/financial/car-loan-affordability", "icon": "🚗" }
      ]}
    />
  );
}
