import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

interface AmortizationRow {
  month: number;
  date: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export default function LoanPaymentCalculator() {
  const [inputs, setInputs] = useState({
    principal: "5000",
    interestRate: "6.5",
    loanTerm: "60",
  });

  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const p = parseFloat(inputs.principal) || 0;
    const annualRate = parseFloat(inputs.interestRate) || 0;
    const n = parseFloat(inputs.loanTerm) || 0;
    const r = annualRate / 100 / 12;

    if (p <= 0 || annualRate <= 0 || n <= 0) {
      return {
        monthlyPayment: 0,
        totalPaid: 0,
        totalInterest: 0,
        payoffDate: "",
        amortizationSchedule: [],
      };
    }

    const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = monthlyPayment * n;
    const totalInterest = totalPaid - p;

    // Calculate payoff date
    const today = new Date();
    const payoffDate = new Date(today);
    payoffDate.setMonth(payoffDate.getMonth() + n);
    const payoffDateStr = payoffDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    // Generate FULL amortization schedule (ALL months, not just 12!)
    const schedule: AmortizationRow[] = [];
    let balance = p;
    
    for (let i = 1; i <= n; i++) {
      const interestPayment = balance * r;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      const paymentDate = new Date(today);
      paymentDate.setMonth(paymentDate.getMonth() + i);

      schedule.push({
        month: i,
        date: paymentDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalPaid: isNaN(totalPaid) ? 0 : totalPaid,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      payoffDate: `${payoffDateStr} (${n} payments)`,
      amortizationSchedule: schedule,
    };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ principal: "", interestRate: "", loanTerm: "" });
    setShowFullSchedule(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Determinar quantas linhas mostrar na tabela
  const displaySchedule = showFullSchedule 
    ? results.amortizationSchedule 
    : results.amortizationSchedule.slice(0, 12);

  return (
    <CalculatorVerticalLayout
      title="Loan Payment Calculator"
      description="Calculate your monthly loan payments instantly. Enter the principal, interest rate, and term below to see your exact payment schedule."
      
      // ON THIS PAGE NAVIGATION
      onThisPage={[
        { id: "how-to-calculate", label: "How to Calculate a Loan Payment" },
        { id: "formula", label: "Loan Payment Formula" },
        { id: "factors", label: "What Affects Loan Payments" },
        { id: "types", label: "Types of Loans" },
        { id: "faq", label: "Frequently Asked Questions" },
      ]}

      // FORMULA BOX
      formula={{
        formula: "M = P × [r(1 + r)ⁿ] / [(1 + r)ⁿ - 1]",
        variables: [
          { symbol: "M", description: "Monthly Payment" },
          { symbol: "P", description: "Principal (Loan Amount)" },
          { symbol: "r", description: "Monthly Interest Rate (Annual Rate ÷ 12)" },
          { symbol: "n", description: "Total Number of Payments" },
        ],
        title: "Loan Payment Formula"
      }}

      // EXAMPLE CALCULATION
      example={{
        title: "Example: $25,000 Auto Loan Calculation",
        scenario: "Let's calculate the monthly payment for a $25,000 auto loan at 4% annual interest for 5 years:",
        steps: [
          {
            step: 1,
            description: "Convert annual interest rate to monthly rate",
            calculation: "4% ÷ 12 = 0.3333% per month (or 0.003333 as decimal)"
          },
          {
            step: 2,
            description: "Calculate total number of payments",
            calculation: "5 years × 12 months = 60 payments"
          },
          {
            step: 3,
            description: "Apply the formula",
            calculation: "M = 25,000 × [0.003333(1.003333)⁶⁰] / [(1.003333)⁶⁰ - 1]"
          },
          {
            step: 4,
            description: "Calculate the monthly payment",
            calculation: "M = $460.41"
          }
        ],
        result: "$460.41 per month for 60 months, totaling $27,624.60 (with $2,624.60 in interest)"
      }}

      // RELATED CALCULATORS
      relatedCalculators={[
        { title: "Amortization Calculator", url: "/financial/amortization", icon: "📊" },
        { title: "Auto Loan Calculator", url: "/financial/auto-loan", icon: "🚗" },
        { title: "Mortgage Calculator", url: "/financial/mortgage", icon: "🏠" },
        { title: "Loan Payoff Calculator", url: "/financial/loan-payoff", icon: "💰" },
        { title: "Debt Consolidation Calculator", url: "/financial/debt-consolidation", icon: "📉" },
        { title: "Interest Calculator", url: "/financial/interest", icon: "💹" },
      ]}

      showTopBanner
      showSidebar
      showBottomBanner

      widget={
        <div className="space-y-6">
          {/* ==================== INPUT SECTION ==================== */}
          <Card className="border-0 shadow-none">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <Label htmlFor="principal" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Loan Amount ($)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="principal"
                    type="number"
                    placeholder="e.g., 5000"
                    value={inputs.principal}
                    onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
                    className="h-12 text-lg pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="interestRate" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Annual Interest Rate (%)
                </Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 6.5"
                    value={inputs.interestRate}
                    onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
                    className="h-12 text-lg pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="loanTerm" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Loan Term (months)
                </Label>
                <Input
                  id="loanTerm"
                  type="number"
                  placeholder="e.g., 60"
                  value={inputs.loanTerm}
                  onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
                  className="h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Common terms: 360 months (30 years), 180 months (15 years), 60 months (5 years)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ==================== ACTION BUTTONS ==================== */}
          <div className="flex gap-3">
            <Button
              onClick={handleCalculate}
              className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Payment
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-12 px-6 text-base font-semibold border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Reset
            </Button>
          </div>

          {/* ==================== RESULTS SECTION ==================== */}
          {results.monthlyPayment > 0 && (
            <div ref={resultsRef} className="space-y-6 pt-4">
              {/* MAIN RESULTS - GRID 2x2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Monthly Payment - DESTAQUE */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 border-blue-200 dark:border-blue-800 col-span-full shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-300">
                      💰 Monthly Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      ${formatCurrency(results.monthlyPayment)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Fixed payment for {inputs.loanTerm} months
                    </p>
                  </CardContent>
                </Card>

                {/* Total Interest */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      💸 Total Interest Paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      ${formatCurrency(results.totalInterest)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Cost of borrowing
                    </p>
                  </CardContent>
                </Card>

                {/* Total Payments */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      📊 Total Amount Paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${formatCurrency(results.totalPaid)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Principal + Interest
                    </p>
                  </CardContent>
                </Card>

                {/* Payoff Date */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 col-span-full shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      📅 Loan Payoff Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                      {results.payoffDate}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* AMORTIZATION SCHEDULE - COMPLETE TABLE */}
              {results.amortizationSchedule.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100 flex items-center justify-between">
                      <span>📋 Amortization Schedule</span>
                      {results.amortizationSchedule.length > 12 && (
                        <Button
                          onClick={() => setShowFullSchedule(!showFullSchedule)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          {showFullSchedule 
                            ? `Show First 12 Months` 
                            : `Show All ${results.amortizationSchedule.length} Months`
                          }
                        </Button>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {showFullSchedule 
                        ? `Complete payment breakdown for all ${results.amortizationSchedule.length} months`
                        : `Showing first ${displaySchedule.length} of ${results.amortizationSchedule.length} payments`
                      }
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                              #
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                              Date
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                              Payment
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                              Principal
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                              Interest
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                              Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {displaySchedule.map((row, idx) => (
                            <tr 
                              key={idx} 
                              className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            >
                              <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-medium">
                                {row.month}
                              </td>
                              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                {row.date}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100 font-medium">
                                ${formatCurrency(row.payment)}
                              </td>
                              <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">
                                ${formatCurrency(row.principal)}
                              </td>
                              <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">
                                ${formatCurrency(row.interest)}
                              </td>
                              <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                                ${formatCurrency(row.balance)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {!showFullSchedule && results.amortizationSchedule.length > 12 && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                          💡 Click "Show All {results.amortizationSchedule.length} Months" above to see the complete payment schedule
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      }

      editorial={
        <div className="space-y-8">
          {/* ==================== SECTION 1 ==================== */}
          <section id="how-to-calculate">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              How to Calculate a Loan Payment
            </h2>
            
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Calculating the amount of a loan payment is an important first step for anyone considering taking out a loan. Whether you're financing a home, purchasing a vehicle, or consolidating debt, understanding your monthly payment obligations is crucial for sound financial planning. According to the Federal Reserve's latest Consumer Credit report, the average American household carries over $104,000 in debt across mortgages, auto loans, credit cards, and student loans, making payment planning more essential than ever.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              You need to make sure that you will be able to pay back the loan comfortably within your budget. If the loan payments take up too much of an individual's income, it could become a major financial burden and potentially lead to default. Financial advisors typically recommend that your total monthly debt payments should not exceed 36% of your gross monthly income, with housing costs specifically staying under 28%. This is known as the "28/36 rule" and helps ensure you maintain financial stability while managing debt.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Before taking out any loan, it's essential to understand not just your monthly payment, but also the total cost of borrowing over the life of the loan. The loan payment formula helps you calculate both of these critical numbers, allowing you to make informed decisions about your financial future. You can also use our <a href="/financial/amortization" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">amortization calculator</a> to see a detailed breakdown of how much of each payment goes toward principal and interest over time.
            </p>
          </section>

          {/* ==================== SECTION 2 ==================== */}
          <section id="factors">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              What Factors Affect Loan Payments
            </h2>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The three factors that affect loan payments are the loan balance (principal), interest rate, and term of the loan. Understanding how each of these variables impacts your monthly payment can help you make strategic decisions about borrowing.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Principal (Loan Amount)
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The remaining principal of a loan, also known as the loan balance, directly affects your monthly payment amount. The higher the loan balance, the higher the monthly payment will be. For example, a $10,000 loan at 5% interest over 5 years results in a monthly payment of approximately $188.71, while a $20,000 loan under the same terms would require $377.42 per month—exactly double the payment for double the principal.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              This is why making the largest down payment you can afford is one of the most effective strategies for reducing your monthly obligations. On a home purchase, for instance, putting down 20% instead of 10% on a $300,000 home would reduce your loan amount from $270,000 to $240,000, saving you approximately $150 per month on a 30-year mortgage at 6.5% interest—that's $54,000 saved over the life of the loan. You can use our <a href="/financial/mortgage" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">mortgage calculator</a> to see how different down payment amounts affect your monthly payment.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Interest Rate
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The interest rate is another critical factor for determining your loan payment. Similar to the loan balance, the higher the interest rate, the higher the payment will be. Even seemingly small differences in interest rates can have substantial impacts on your total cost of borrowing. For example, on a $250,000 30-year mortgage, the difference between a 6% rate ($1,499/month) and a 7% rate ($1,663/month) is $164 per month, or nearly $59,000 over the life of the loan.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Several factors influence the interest rate you'll be offered. Your credit score is perhaps the most significant determinant—borrowers with excellent credit (scores above 740) typically qualify for the lowest rates, while those with poor credit (below 640) may face rates several percentage points higher. For instance, according to Experian's 2024 State of the Automotive Finance Market report, borrowers with excellent credit secured average auto loan rates of 5.18%, while those with subprime credit (scores below 620) faced rates averaging 14.08%—a difference of nearly 9 percentage points.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The broader economic environment and Federal Reserve policies also influence baseline interest rates across all loan types. When the Fed raises rates to combat inflation, consumer loan rates typically increase as well. Additionally, the type of loan and its term length affect rates—shorter-term loans generally have lower rates than longer-term loans because the lender assumes less risk. You can explore different interest rate scenarios using our <a href="/financial/interest" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">interest calculator</a> to understand how rate changes impact your total borrowing costs.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Loan Term (Number of Payments)
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The term, or total number of payments on the loan, is the final major factor affecting your monthly payment amount. The relationship is inverse: the longer the loan period, the lower the monthly payment will be. For example, a $30,000 auto loan at 5% interest would have a monthly payment of $566 over 5 years (60 months), but only $472 over 6 years (72 months)—a difference of $94 per month that could make the loan more affordable in the short term.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              However, the longer term costs significantly more in total: $33,960 versus $34,032 respectively, with the 6-year loan accumulating an additional $72 in interest charges despite the lower monthly payment. This happens because you're paying interest for a longer period of time, even though the rate stays the same. The total interest difference becomes even more dramatic with larger loans—on a $300,000 mortgage at 6.5%, extending from a 15-year term to a 30-year term reduces the monthly payment from $2,613 to $1,896 (a savings of $717 per month), but increases the total interest paid from $170,400 to $382,560—an additional $212,160 in interest costs.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The decision between a shorter or longer loan term depends on your financial situation and goals. Shorter terms mean higher monthly payments but substantially less interest paid over the loan's lifetime, while longer terms offer more affordable monthly payments but at a higher total cost. Many borrowers opt for longer terms initially but make extra payments when possible to pay off the loan early, combining affordability with savings. Our <a href="/financial/loan-payoff" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">loan payoff calculator</a> can show you how extra payments can help you pay off your loan faster and save on interest.
            </p>
          </section>

          {/* ==================== SECTION 3 ==================== */}
          <section id="types">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Types of Loans
            </h2>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Understanding the different types of loans available helps you choose the right financing option for your specific needs. There are three main categories of loans: real estate loans, consumer loans, and business loans. Each category has distinct characteristics, typical interest rates, and use cases.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Real Estate Loans
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Real estate loans consist primarily of first mortgages and second mortgages (also called home equity loans or HELOCs). A first mortgage is the initial loan you obtain when purchasing a home, typically representing 80% or more of the property's value if you make a 20% down payment. These loans usually have the lowest interest rates of any consumer loan type because they're secured by valuable collateral—the property itself. According to Freddie Mac's Primary Mortgage Market Survey, the average 30-year fixed mortgage rate in 2024 has ranged from 6.5% to 7.5%, significantly lower than rates for unsecured consumer loans.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              A second mortgage or home equity line of credit (HELOC) is an additional loan secured against your house after you've built up equity. Homeowners often use these by tapping into the equity of their home to make improvements on the house, consolidate higher-interest debt, or fund major expenses like college tuition. HELOCs typically function as revolving credit lines with variable interest rates, while home equity loans provide a lump sum with a fixed rate. Current HELOC rates typically range from 8% to 10%, higher than first mortgages but still competitive compared to other loan types. Our <a href="/financial/heloc-payment" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">HELOC payment calculator</a> can help you estimate costs for home equity borrowing.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Consumer Loans
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Consumer loans encompass a wide variety of borrowing for personal use. Credit cards represent the most common form of consumer credit, offering revolving credit with variable rates typically between 15-25% APR depending on creditworthiness. Because credit cards are unsecured and allow indefinite borrowing up to the credit limit, they carry the highest interest rates among mainstream consumer loans.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Auto loans are secured loans with terms typically ranging from 3 to 7 years and interest rates from 4% to 10%, depending on credit score and whether the vehicle is new or used. New cars generally qualify for lower rates than used cars. According to Experian's Q1 2024 data, the average new car loan carried an interest rate of 7.2%, while used car loans averaged 11.2%. Our <a href="/financial/auto-loan" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">auto loan calculator</a> can help you plan for vehicle financing.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Student loans include both federal loans (with fixed rates set by Congress, currently ranging from 5.5% to 8.0% depending on the loan type) and private loans (with rates from 4% to 14% based on creditworthiness). Federal student loans offer unique benefits like income-driven repayment plans and potential loan forgiveness programs. Personal loans, used for debt consolidation, home improvements, or other purposes, are typically unsecured with terms of 2-7 years and rates from 6% to 36% depending on credit score. You can estimate student loan payments using our <a href="/financial/student-loan" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">student loan calculator</a>.
            </p>

            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Business Loans
            </h3>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Business or commercial loans are loans that an individual or company uses to start or grow a business, purchase equipment, finance inventory, or manage cash flow. Interest rates vary widely based on the business's financial health, time in operation, and creditworthiness. Established businesses with strong financials might secure SBA (Small Business Administration) loans with rates as low as 5-7%, while startups or higher-risk ventures could face rates of 10-20% or more from alternative lenders.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Business loans come in many forms: term loans (lump sum repaid over a set period), lines of credit (revolving access to funds), equipment financing (secured by the equipment purchased), and commercial real estate loans. The SBA 7(a) loan program, which guarantees loans made by approved lenders, is one of the most popular options for small businesses, offering competitive rates and terms up to 25 years for real estate. According to the National Federation of Independent Business, small business loan interest rates in 2024 have ranged from 6% to 13% for conventional bank loans, depending on the borrower's creditworthiness and the loan's purpose.
            </p>
          </section>

          {/* ==================== SECTION 4: FAQ ==================== */}
          <section id="faq">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Why is understanding the loan payment amount important?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Understanding what a loan payment will be is critical to ensure you are able to afford the loan without stretching your budget too thin. Financial experts recommend that your total monthly debt obligations should not exceed 36% of your gross monthly income to maintain financial stability. Knowing your exact payment amount allows you to plan your budget accordingly and avoid overextending yourself financially. Additionally, understanding the total cost of the loan (principal plus interest) helps you make informed decisions about whether borrowing makes sense for your situation, or if you should save up and pay cash instead.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  What should you not do during the process of taking out a loan?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you are currently awaiting approval on any type of loan, avoid making large purchases, switching jobs, or opening new credit accounts. Anything that can change your credit score or debt-to-income ratio is cautioned against during the approval process because lenders verify your financial information right up until closing. Late payments during this period can also cause lenders to withdraw their offer or increase your interest rate substantially. Additionally, avoid taking on any new debt, even small amounts, as lenders may re-check your credit just before finalizing the loan, and any changes could jeopardize your approval or result in less favorable terms.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Are all types of loans equal?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  All types of loans are definitely not equal. Mortgage loans typically have the lowest interest rates (currently 6-8% range) because they have substantial collateral backing them—if you default, the lender can foreclose on the property and recoup their money. Consumer loans tend to have higher interest rates because they have less collateral or none at all, ranging from 4% for prime auto loans to 25%+ for credit cards. Business loans' interest rates vary significantly based on the business's financial strength and risk profile, typically ranging from 5% for established businesses to 20% for startups. The key factors affecting loan rates include the presence and value of collateral, the borrower's creditworthiness, the loan term length, and current economic conditions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Can I pay off my loan early to save on interest?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  In most cases, yes—paying off your loan early can save you substantial money in interest charges. However, some loans include prepayment penalties that charge fees (typically 2-5% of the loan balance) if you pay off the loan before the scheduled term ends. Before making extra payments, check your loan agreement for prepayment penalty clauses. Many mortgages originated after 2014 don't have prepayment penalties due to consumer protection regulations under the Dodd-Frank Act. For loans without penalties, even small extra payments can significantly reduce the total interest paid and shorten the loan term. For example, adding just $100 extra per month to a $200,000 30-year mortgage at 6.5% would save over $60,000 in interest and pay off the loan 7 years early.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  How does my credit score affect my loan payment?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Your credit score has a profound impact on your loan payment through its effect on the interest rate you're offered. Borrowers with higher scores (740+) qualify for the lowest interest rates, while those with lower scores (below 640) face significantly higher rates, sometimes 2-4 percentage points higher. On a $250,000 30-year mortgage, the difference between a 6% rate (excellent credit) and an 8% rate (fair credit) is $331 per month, or nearly $119,000 over the loan's lifetime. This is why improving your credit score before applying for a loan can be one of the most financially rewarding actions you can take. Even moving from "good" credit (700) to "excellent" credit (750+) can save you thousands of dollars over the life of a large loan.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  What's the difference between fixed-rate and variable-rate loans?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  A fixed-rate loan maintains the same interest rate for the entire loan term, meaning your monthly payment stays constant and predictable. This makes budgeting easier and protects you from rising interest rates in the future. A variable-rate (or adjustable-rate) loan has an interest rate that can change periodically based on an index rate, such as the prime rate or LIBOR. Variable-rate loans often start with lower rates than fixed-rate loans, making them attractive initially, but your payment can increase if rates rise. For example, an adjustable-rate mortgage (ARM) might offer 5.5% for the first 5 years, then adjust annually based on market conditions. If rates increase significantly, your payment could jump substantially. Generally, fixed-rate loans are better for long-term borrowing when you value payment stability, while variable-rate loans can be advantageous for short-term borrowing or when you expect to pay off or refinance the loan before rates adjust significantly.
                </p>
              </div>
            </div>
          </section>

          {/* ==================== REFERENCES ==================== */}
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              References & Additional Resources
            </h2>
            
            <ul className="space-y-3">
              <li className="leading-relaxed">
                <a href="https://www.federalreserve.gov/releases/g19/current/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Federal Reserve - Consumer Credit Statistics
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Official data on consumer borrowing trends and interest rates</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.consumerfinance.gov/owning-a-home/loan-options/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Consumer Financial Protection Bureau - Loan Options
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comprehensive guide to different types of consumer loans</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.fdic.gov/consumers/consumer/moneysmart/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  FDIC - Money Smart Financial Education
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Free financial education resources on borrowing and credit</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.experian.com/blogs/ask-experian/state-of-automotive-finance-market/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Experian - State of Automotive Finance Market
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Quarterly report on auto loan rates and trends</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.freddiemac.com/pmms" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Freddie Mac - Primary Mortgage Market Survey
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Weekly mortgage rate data and historical trends</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://www.sba.gov/funding-programs/loans" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  U.S. Small Business Administration - Loan Programs
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Information on SBA-backed business loans</p>
              </li>
              <li className="leading-relaxed">
                <a href="https://studentaid.gov/understand-aid/types/loans" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Federal Student Aid - Types of Loans
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Official guide to federal student loan programs</p>
              </li>
            </ul>
          </section>
        </div>
      }
    />
  );
}
