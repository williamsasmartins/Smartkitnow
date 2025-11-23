import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      if (resultsRef.current) {
        const rect = resultsRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        
        window.scrollTo({
          top: elementTop - 100,
          behavior: "smooth"
        });
      }
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
      maxWidth={1200}
      gap={32}
      showTopBanner
      widget={
        <div className="space-y-6">
          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="principal" className="text-sm font-medium mb-1.5 block">
                Loan Amount ($)
              </Label>
              <Input
                id="principal"
                type="number"
                placeholder="e.g., 5000"
                value={inputs.principal}
                onChange={(e) =>
                  setInputs({ ...inputs, principal: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="interestRate" className="text-sm font-medium mb-1.5 block">
                Annual Interest Rate (%)
              </Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                placeholder="e.g., 6.5"
                value={inputs.interestRate}
                onChange={(e) =>
                  setInputs({ ...inputs, interestRate: e.target.value })
                }
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="loanTerm" className="text-sm font-medium mb-1.5 block">
                Loan Term (months)
              </Label>
              <Input
                id="loanTerm"
                type="number"
                placeholder="e.g., 60"
                value={inputs.loanTerm}
                onChange={(e) =>
                  setInputs({ ...inputs, loanTerm: e.target.value })
                }
                className="h-11"
              />
              <p className="text-xs text-gray-500 mt-1">
                Common: 360 (30yr), 180 (15yr), 60 (5yr)
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCalculate}
                className="flex-1 h-11 text-base font-semibold"
              >
                Calculate
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-11 px-6 text-base font-semibold"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Results Table */}
          <div ref={resultsRef}>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr className="bg-blue-50 dark:bg-blue-950">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      Monthly Payment:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-blue-600 dark:text-blue-400 text-lg">
                      ${formatCurrency(results.monthlyPayment)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      Total Interest:
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                      ${formatCurrency(results.totalInterest)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      Total Payments:
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                      ${formatCurrency(results.totalPaid)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      Payoff Date:
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-gray-100">
                      {results.payoffDate || "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Amortization Schedule */}
          {results.amortizationSchedule.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
                Amortization Schedule:
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
                        Date
                      </th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
                        Payment
                      </th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
                        Principal
                      </th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
                        Interest
                      </th>
                      <th className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {results.amortizationSchedule.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-3 py-2 text-gray-900 dark:text-gray-100">
                          {row.date}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-900 dark:text-gray-100">
                          ${formatCurrency(row.payment)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-900 dark:text-gray-100">
                          ${formatCurrency(row.principal)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-900 dark:text-gray-100">
                          ${formatCurrency(row.interest)}
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
                          ${formatCurrency(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parseFloat(inputs.loanTerm) > 12 && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Showing first 12 months of {inputs.loanTerm} total payments
                </p>
              )}
            </div>
          )}
        </div>
      }
      editorial={
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* H2 MAIOR + ESPAÇAMENTO */}
          <h2 className="text-3xl font-bold mb-6 mt-8">How to Calculate a Loan Payment</h2>
          
          <p className="mb-6 leading-relaxed">
            Calculating the amount of a loan payment is an important first step for anyone considering taking out a loan. Whether you're financing a home, purchasing a vehicle, or consolidating debt, understanding your monthly payment obligations is crucial for sound financial planning. According to the Federal Reserve's latest Consumer Credit report, the average American household carries over $104,000 in debt across mortgages, auto loans, credit cards, and student loans, making payment planning more essential than ever.
          </p>

          <p className="mb-8 leading-relaxed">
            You need to make sure that you will be able to pay back the loan comfortably within your budget. If the loan payments take up too much of an individual's income, it could become a major financial burden and potentially lead to default. Financial advisors typically recommend that your total monthly debt payments should not exceed 36% of your gross monthly income, with housing costs specifically staying under 28%.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Loan Payment Formula</h3>
          
          <p className="mb-6 leading-relaxed">
            The loan payment formula uses a mathematical calculation to determine your exact monthly payment based on three key variables: the loan amount (principal), the annual interest rate (APR), and the total number of payments.
          </p>

          {/* FÓRMULA GRANDE E VISÍVEL - ESTILO IMAGEM */}
          <div className="my-10 p-8 rounded-xl border-4 border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <div className="text-center mb-6">
              <div className="inline-block bg-white dark:bg-gray-900 rounded-lg px-8 py-6 shadow-lg">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Loan Payment Formula
                </div>
                <div className="h-1 w-32 bg-blue-500 mx-auto mb-6"></div>
                <div className="text-2xl font-mono text-gray-900 dark:text-gray-100 leading-relaxed">
                  PMT = PV × [r(1 + r)ⁿ] / [(1 + r)ⁿ - 1]
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
              <p className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Where:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-base">
                <div className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">PMT =</span>
                  <span className="text-gray-900 dark:text-gray-100">monthly payment amount</span>
                </div>
                <div className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">PV =</span>
                  <span className="text-gray-900 dark:text-gray-100">present value (loan amount)</span>
                </div>
                <div className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">r =</span>
                  <span className="text-gray-900 dark:text-gray-100">periodic interest rate (annual rate ÷ 12)</span>
                </div>
                <div className="flex items-start">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mr-2">n =</span>
                  <span className="text-gray-900 dark:text-gray-100">total number of monthly payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* EXEMPLO PASSO A PASSO BEM FORMATADO */}
          <div className="my-10 p-6 rounded-xl border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-950">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">💡</span>
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">Example Calculation</h4>
            </div>
            
            <p className="mb-4 text-gray-900 dark:text-gray-100 leading-relaxed">
              For example, let's say someone is considering getting an auto loan with the following terms: <strong>$25,000 loan at 4% interest for 5 years</strong>.
            </p>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-5 mb-4">
              <p className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Step 1: Convert annual rate to monthly rate</p>
              <p className="text-gray-900 dark:text-gray-100 mb-2">
                The formula requires a periodic (monthly) <strong>interest rate</strong>, so we need to divide the 4% interest rate by 12 months:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-center text-gray-900 dark:text-gray-100">
                4% ÷ 12 = 0.3333% per month (or 0.003333 in decimal)
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-5 mb-4">
              <p className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Step 2: Calculate total number of payments</p>
              <p className="text-gray-900 dark:text-gray-100 mb-2">
                Number of payments = 5 years × 12 months per year:
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-center text-gray-900 dark:text-gray-100">
                5 × 12 = 60 payments
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg p-5 mb-4">
              <p className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Step 3: Plug into the formula</p>
              <div className="space-y-2 text-gray-900 dark:text-gray-100">
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
                  PMT = $25,000 × [0.003333(1 + 0.003333)⁶⁰] / [(1 + 0.003333)⁶⁰ - 1]
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
                  PMT = $25,000 × [0.003333(1.221964)] / [1.221964 - 1]
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
                  PMT = $25,000 × 0.004074 / 0.221964
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm">
                  PMT = $101.85 / 0.221964
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg p-5 text-white">
              <p className="font-semibold mb-2 text-lg">Result:</p>
              <p className="text-2xl font-bold">
                Monthly Payment = $460.41
              </p>
              <p className="mt-3 text-sm opacity-90">
                Total repayment: $27,624.60 (you'll pay $2,624.60 in interest)
              </p>
            </div>
          </div>

          <p className="mb-8 leading-relaxed">
            You can also use an <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">amortization calculator</a> to find the monthly payment and see how much of each monthly payment goes toward principal and how much goes toward interest.
          </p>

          {/* H2 MAIOR + ESPAÇAMENTO */}
          <h2 className="text-3xl font-bold mb-6 mt-12">What Factors Affect Loan Payments</h2>
          
          <p className="mb-8 leading-relaxed">
            The three primary factors that affect loan payments are the loan balance, interest rate, and term of the loan. Understanding how each of these variables impacts your monthly payment allows you to make strategic decisions that can save you thousands of dollars over the life of your loan.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Loan Balance (Principal Amount)</h3>
          
          <p className="mb-6 leading-relaxed">
            The remaining principal of a loan, also known as the loan balance, is the foundation of your payment calculation. The higher the loan balance, the higher the monthly payment will be, assuming all other factors remain constant. For instance, a $200,000 mortgage at 6% for 30 years results in a monthly payment of approximately $1,199, while a $300,000 mortgage under the same terms would cost around $1,799 per month—a $600 difference solely due to the larger principal.
          </p>

          <p className="mb-8 leading-relaxed">
            You should pay the largest down payment that you can reasonably afford on a loan in order to reduce both the monthly payment and the total interest paid over the life of the loan. Financial experts typically recommend a 20% down payment on homes to avoid private mortgage insurance (PMI) and secure better interest rates.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Interest Rate</h3>
          
          <p className="mb-6 leading-relaxed">
            The interest rate is another critical factor for determining your loan payment. Similar to the loan balance, the higher the interest rate, the higher the payment will be. Even seemingly small differences in interest rates can have substantial impacts on your total cost of borrowing. For example, on a $250,000 30-year mortgage, the difference between a 6% rate ($1,499/month) and a 7% rate ($1,663/month) is $164 per month, or nearly $59,000 over the life of the loan.
          </p>

          <p className="mb-8 leading-relaxed">
            Your credit score is perhaps the most significant determinant—borrowers with excellent credit (scores above 740) typically qualify for the lowest rates, while those with poor credit may face rates several percentage points higher. The broader economic environment and Federal Reserve policies also influence baseline interest rates across all loan types.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Loan Term (Number of Payments)</h3>
          
          <p className="mb-6 leading-relaxed">
            The term, or total number of payments on the loan, is the final major factor affecting your monthly payment amount. The relationship is inverse: the longer the loan period, the lower the monthly payment will be. For example, a $30,000 auto loan at 5% interest would have a monthly payment of $566 over 5 years (60 months), but only $472 over 6 years (72 months)—a difference of $94 per month.
          </p>

          <p className="mb-8 leading-relaxed">
            However, the longer term costs significantly more in total: $33,960 versus $33,936, with the 6-year loan accumulating an additional $1,224 in interest charges despite the lower monthly payment. You can use our <a href="/financial/loan-payoff" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">loan payoff calculator</a> to see how long it would take to pay off a loan at different payment amounts.
          </p>

          {/* H2 MAIOR + ESPAÇAMENTO */}
          <h2 className="text-3xl font-bold mb-6 mt-12">Types of Loans</h2>
          
          <p className="mb-8 leading-relaxed">
            Understanding the different types of loans available helps you choose the right financing option for your specific needs. There are three main categories of loans: real estate loans, consumer loans, and business loans.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Real Estate Loans</h3>
          
          <p className="mb-6 leading-relaxed">
            Real estate loans consist primarily of first mortgages and second mortgages (also called home equity loans or HELOCs). A first mortgage is the initial loan you obtain when purchasing a home, typically representing 80% or more of the property's value if you make a 20% down payment.
          </p>

          <p className="mb-8 leading-relaxed">
            A second mortgage or home equity line of credit (HELOC) is an additional loan secured against your house after you've built up equity. Homeowners often use these by tapping into the equity of their home to make improvements, consolidate higher-interest debt, or fund major expenses. Our <a href="/financial/heloc-payment" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">HELOC payment calculator</a> can help you estimate costs for home equity borrowing.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Consumer Loans</h3>
          
          <p className="mb-6 leading-relaxed">
            Consumer loans encompass a wide variety of borrowing for personal use, including credit cards (revolving credit with variable rates typically between 15-25%), auto loans (secured loans with terms of 3-7 years and rates from 4-10%), student loans (education financing with terms up to 25 years), and personal loans (unsecured loans for any purpose with terms of 2-7 years and rates from 6-36%).
          </p>

          <p className="mb-8 leading-relaxed">
            Our <a href="/financial/auto-loan" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">auto loan calculator</a> and <a href="/financial/student-loan" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">student loan calculator</a> can help you plan for these specific types of consumer debt.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Business Loans</h3>
          
          <p className="mb-8 leading-relaxed">
            Business or commercial loans are loans that an individual or company uses to start or grow a business, purchase equipment, finance inventory, or manage cash flow. Interest rates vary widely based on the business's financial health, time in operation, and creditworthiness. Established businesses with strong financials might secure rates as low as 5-7%, while startups or higher-risk ventures could face rates of 10-20% or more.
          </p>

          {/* H2 MAIOR + ESPAÇAMENTO */}
          <h2 className="text-3xl font-bold mb-6 mt-12">Frequently Asked Questions</h2>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Why is understanding the loan payment amount important?</h3>
          
          <p className="mb-8 leading-relaxed">
            Understanding what a loan payment will be is critical to ensure you are able to afford the loan without stretching your budget too thin. Financial experts recommend that your total monthly debt obligations should not exceed 36% of your gross monthly income to maintain financial stability. Knowing your exact payment amount allows you to plan your budget accordingly and avoid overextending yourself financially.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">What should you not do during the process of taking out a loan?</h3>
          
          <p className="mb-8 leading-relaxed">
            If you are currently awaiting approval on any type of loan, avoid making large purchases, switching jobs, or opening new credit accounts. Anything that can change your credit score or debt-to-income ratio is cautioned against during the approval process because lenders verify your financial information right up until closing. Late payments during this period can also cause lenders to withdraw their offer or increase your interest rate substantially.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Are all types of loans equal?</h3>
          
          <p className="mb-8 leading-relaxed">
            All types of loans are definitely not equal. Mortgage loans typically have the lowest interest rates (6-8% range) because they have substantial collateral backing them. Consumer loans tend to have higher interest rates because they have less collateral, ranging from 4% for prime auto loans to 25%+ for credit cards. Business loans' interest rates vary significantly based on the business's financial strength and risk profile.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">Can I pay off my loan early to save on interest?</h3>
          
          <p className="mb-8 leading-relaxed">
            In most cases, yes—paying off your loan early can save you substantial money in interest charges. However, some loans include prepayment penalties that charge fees if you pay off the loan before the scheduled term ends. Before making extra payments, check your loan agreement for prepayment penalty clauses. Many mortgages originated after 2014 don't have prepayment penalties due to consumer protection regulations.
          </p>

          {/* H3 MAIOR + ESPAÇAMENTO */}
          <h3 className="text-xl font-bold mb-4 mt-8">How does my credit score affect my loan payment?</h3>
          
          <p className="mb-8 leading-relaxed">
            Your credit score has a profound impact on your loan payment through its effect on the interest rate you're offered. Borrowers with higher scores (740+) qualify for the lowest interest rates, while those with lower scores (below 640) face significantly higher rates, sometimes 2-4 percentage points higher. On a $250,000 30-year mortgage, the difference between a 6% rate (excellent credit) and an 8% rate (fair credit) is $331 per month, or nearly $119,000 over the loan's lifetime.
          </p>

          {/* REFERÊNCIAS */}
          <h2 className="text-3xl font-bold mb-6 mt-12">References</h2>
          
          <ul className="space-y-3 mb-8">
            <li className="leading-relaxed">
              <a href="https://www.federalreserve.gov/releases/g19/current/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Federal Reserve - Consumer Credit Statistics
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.consumerfinance.gov/owning-a-home/loan-options/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Consumer Financial Protection Bureau - Loan Options
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.fdic.gov/consumers/consumer/moneysmart/pubs/borrowing/borrowing.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                FDIC - Money Smart Guide to Borrowing
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.irs.gov/publications/p936" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                IRS Publication 936 - Home Mortgage Interest Deduction
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.sba.gov/funding-programs/loans" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                U.S. Small Business Administration - Loan Programs
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://studentaid.gov/understand-aid/types/loans" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Federal Student Aid - Types of Loans
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.occ.treas.gov/topics/consumers-and-communities/consumer-protection/index-consumer-protection.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Office of the Comptroller of the Currency - Consumer Protection
              </a>
            </li>
            <li className="leading-relaxed">
              <a href="https://www.bankrate.com/calculators/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Bankrate - Financial Calculators and Tools
              </a>
            </li>
          </ul>
        </div>
      }
    />
  );
}
