import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

    // Generate amortization schedule (first 12 months)
    const schedule: AmortizationRow[] = [];
    let balance = p;
    
    for (let i = 1; i <= Math.min(12, n); i++) {
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
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <CalculatorVerticalLayout
      title="Loan Payment Calculator"
      description="Calculate the monthly payment for a loan using our simple loan calculator by entering the principal, interest rate, and term below."
      showTopBanner
      widget={
        <div className="space-y-6">
          {/* ==================== INPUT SECTION ==================== */}
          <Card className="border-0 shadow-none">
            <CardContent className="p-0 space-y-4">
              <div>
                <Label htmlFor="principal" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Loan Amount ($)
                </Label>
                <Input
                  id="principal"
                  type="number"
                  placeholder="e.g., 5000"
                  value={inputs.principal}
                  onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
                  className="h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="interestRate" className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">
                  Annual Interest Rate (%)
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 6.5"
                  value={inputs.interestRate}
                  onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
                  className="h-12 text-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
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
                  Common: 360 (30yr), 180 (15yr), 60 (5yr)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ==================== ACTION BUTTONS ==================== */}
          <div className="flex gap-3">
            <Button
              onClick={handleCalculate}
              className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Calculate
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
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 border-blue-200 dark:border-blue-800 col-span-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-300">
                      Monthly Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      ${formatCurrency(results.monthlyPayment)}
                    </p>
                  </CardContent>
                </Card>

                {/* Total Interest */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      Total Interest
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${formatCurrency(results.totalInterest)}
                    </p>
                  </CardContent>
                </Card>

                {/* Total Payments */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      Total Payments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      ${formatCurrency(results.totalPaid)}
                    </p>
                  </CardContent>
                </Card>

                {/* Payoff Date */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 col-span-full md:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-gray-700 dark:text-gray-300">
                      Payoff Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {results.payoffDate}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* AMORTIZATION SCHEDULE */}
              {results.amortizationSchedule.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                      Amortization Schedule (First {Math.min(12, results.amortizationSchedule.length)} Months)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                          <tr>
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
                          {results.amortizationSchedule.map((row, idx) => (
                            <tr 
                              key={idx} 
                              className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            >
                              <td className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                {row.date}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                                ${formatCurrency(row.payment)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
                                ${formatCurrency(row.principal)}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900 dark:text-gray-100">
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
                    {parseFloat(inputs.loanTerm) > 12 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center p-4 bg-gray-50 dark:bg-gray-900">
                        Showing first 12 months of {inputs.loanTerm} total payments
                      </p>
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
          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              How to Calculate a Loan Payment
            </h2>
            
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Calculating the amount of a loan payment is an important first step for anyone considering taking out a loan. Whether you're financing a home, purchasing a vehicle, or consolidating debt, understanding your monthly payment obligations is crucial for sound financial planning.
            </p>

            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              You need to make sure that you will be able to pay back the loan comfortably within your budget. If the loan payments take up too much of an individual's income, it could become a major financial burden and potentially lead to default. Financial advisors typically recommend that your total monthly debt payments should not exceed 36% of your gross monthly income.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Loan Payment Formula
            </h3>
            
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The loan payment formula uses a mathematical calculation to determine your exact monthly payment based on three key variables: the loan amount (principal), the annual interest rate (APR), and the total number of payments.
            </p>

            <div className="my-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800">
              <p className="text-center text-lg font-mono font-bold text-gray-900 dark:text-gray-100">
                M = P × [r(1 + r)ⁿ] / [(1 + r)ⁿ - 1]
              </p>
              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p><strong>M</strong> = Monthly Payment</p>
                <p><strong>P</strong> = Principal (Loan Amount)</p>
                <p><strong>r</strong> = Monthly Interest Rate (Annual Rate ÷ 12)</p>
                <p><strong>n</strong> = Number of Payments</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Understanding the Variables
            </h3>

            <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Principal (Loan Amount)
            </h4>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The principal is the total amount borrowed. This directly affects your monthly payment—the larger the loan, the higher your monthly payment will be. For example, a $10,000 loan at 5% interest over 5 years results in a monthly payment of approximately $188.71, while a $20,000 loan under the same terms would require $377.42 per month.
            </p>

            <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Interest Rate
            </h4>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The interest rate represents the cost of borrowing money. Your credit score is the most significant determinant—borrowers with excellent credit typically qualify for the lowest rates, while those with poor credit may face rates several percentage points higher.
            </p>

            <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Loan Term
            </h4>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              The term is the total number of payments on the loan. The relationship is inverse: the longer the loan period, the lower the monthly payment will be. However, longer terms result in paying significantly more interest over the life of the loan.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Types of Loans
            </h2>

            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Real Estate Loans
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Real estate loans include mortgages and home equity loans (HELOCs). These typically offer the lowest interest rates because they're secured by valuable collateral—your home.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Consumer Loans
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Consumer loans include credit cards, auto loans, student loans, and personal loans. Interest rates vary widely based on the type of loan and your creditworthiness.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Business Loans
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Business loans are used to start or grow a business. Interest rates vary based on the business's financial health and time in operation.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>

            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Why is understanding the loan payment amount important?
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Understanding your loan payment is critical to ensure you can afford it without stretching your budget too thin. Financial experts recommend that total monthly debt obligations should not exceed 36% of your gross monthly income.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Can I pay off my loan early to save on interest?
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              In most cases, yes—paying off your loan early can save you substantial money in interest charges. However, some loans include prepayment penalties. Check your loan agreement before making extra payments.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              How does my credit score affect my loan payment?
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              Your credit score has a profound impact on your loan payment through its effect on the interest rate. Borrowers with higher scores (740+) qualify for the lowest rates, while those with lower scores face significantly higher rates.
            </p>
          </section>
        </div>
      }
    />
  );
}
