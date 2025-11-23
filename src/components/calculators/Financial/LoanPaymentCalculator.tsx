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
      maxWidth={1200}
      gap={32}
      showTopBanner
      widget={
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Calculate the monthly payment for a loan using our simple loan calculator by entering the principal, interest rate, and term below.
          </p>

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
          <h2>How to Calculate a Loan Payment</h2>
          <p>
            Calculating the amount of a loan payment is an important first step for anyone considering taking out a loan. Whether you're financing a home, purchasing a vehicle, or consolidating debt, understanding your monthly payment obligations is crucial for sound financial planning. According to the Federal Reserve's latest Consumer Credit report, the average American household carries over $104,000 in debt across mortgages, auto loans, credit cards, and student loans, making payment planning more essential than ever.
          </p>

          <p>
            You need to make sure that you will be able to pay back the loan comfortably within your budget. If the loan payments take up too much of an individual's income, it could become a major financial burden and potentially lead to default. Financial advisors typically recommend that your total monthly debt payments should not exceed 36% of your gross monthly income, with housing costs specifically staying under 28%. Our loan payment calculator helps you determine exactly what you can afford before making a commitment.
          </p>

          <h3>Loan Payment Formula</h3>
          <p>
            The loan payment formula uses a mathematical calculation to determine your exact monthly payment based on three key variables: the loan amount (principal), the annual interest rate (APR), and the total number of payments. This formula is derived from the amortization concept, which ensures that each payment includes both principal repayment and interest charges, with the loan fully paid off by the end of the term.
          </p>

          <div className="my-8 rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-6">
            <div className="bg-white dark:bg-gray-900 rounded p-4 font-mono text-center">
              <div className="text-xl font-semibold">
                PMT = PV × [r(1 + r)ⁿ] / [(1 + r)ⁿ - 1]
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="font-semibold">Where:</p>
              <ul className="space-y-1 ml-4">
                <li><strong>PMT</strong> = monthly payment amount</li>
                <li><strong>PV</strong> = present value (remaining principal or loan amount)</li>
                <li><strong>r</strong> = periodic interest rate (annual rate ÷ 12 months)</li>
                <li><strong>n</strong> = total number of monthly payments</li>
              </ul>
            </div>
          </div>

          <p>
            For example, let's say you're considering getting an auto loan with the following terms: $25,000 loan amount at 4% annual interest for 5 years. First, we need to adjust the numbers so they will work with the loan payment formula. The formula requires a periodic (monthly) interest rate, so we need to divide the 4% annual interest rate by 12 months to arrive at a periodic interest rate of 0.3333% (or 0.003333 in decimal form). Additionally, the number of payments is found by multiplying 5 years by 12 months, which equals 60 total monthly payments.
          </p>

          <p>
            Let's plug these numbers into the loan payment formula: PMT = 25,000 × [0.003333(1 + 0.003333)⁶⁰] / [(1 + 0.003333)⁶⁰ - 1]. Working through the calculation, we get: PMT = 25,000 × [0.003333(1.221964)] / [1.221964 - 1] = 25,000 × 0.004074 / 0.221964 = $460.41. Under these circumstances, the monthly loan payment will be $460.41, with a total repayment of $27,624.60 over the life of the loan, meaning you'll pay $2,624.60 in interest charges.
          </p>

          <p>
            You can also use an <a href="/financial/mortgage-amortization" className="text-blue-600 dark:text-blue-400 hover:underline">amortization calculator</a> to find the monthly payment and see how much of each monthly payment goes toward principal and how much goes toward interest. Early in the loan term, a larger portion of your payment goes toward interest, while later payments contribute more to principal reduction. This is why making extra payments early in your loan can save you significant money in interest charges over time.
          </p>

          <h2>What Factors Affect Loan Payments</h2>
          <p>
            The three primary factors that affect loan payments are the loan balance, interest rate, and term of the loan. Understanding how each of these variables impacts your monthly payment allows you to make strategic decisions that can save you thousands of dollars over the life of your loan. Let's examine each of these factors in detail and explore how they interact to determine your total borrowing costs.
          </p>

          <h3>Loan Balance (Principal Amount)</h3>
          <p>
            The remaining principal of a loan, also known as the loan balance, is the foundation of your payment calculation. The higher the loan balance, the higher the monthly payment will be, assuming all other factors remain constant. For instance, a $200,000 mortgage at 6% for 30 years results in a monthly payment of approximately $1,199, while a $300,000 mortgage under the same terms would cost around $1,799 per month—a $600 difference solely due to the larger principal.
          </p>

          <p>
            The reverse holds true for a lower principal amount. You should pay the largest down payment that you can reasonably afford on a loan in order to reduce both the monthly payment and the total interest paid over the life of the loan. Financial experts typically recommend a 20% down payment on homes to avoid private mortgage insurance (PMI) and secure better interest rates. For auto loans, putting down at least 20% can help ensure you don't end up owing more than the vehicle is worth due to depreciation.
          </p>

          <h3>Interest Rate</h3>
          <p>
            The interest rate is another critical factor for determining your loan payment. Similar to the loan balance, the higher the interest rate, the higher the payment will be. Even seemingly small differences in interest rates can have substantial impacts on your total cost of borrowing. For example, on a $250,000 30-year mortgage, the difference between a 6% rate ($1,499/month) and a 7% rate ($1,663/month) is $164 per month, or nearly $59,000 over the life of the loan.
          </p>

          <p>
            Several factors affect the interest rate you'll be offered by lenders. Your credit score is perhaps the most significant determinant—borrowers with excellent credit (scores above 740) typically qualify for the lowest rates, while those with poor credit may face rates several percentage points higher. Your income and employment stability also play crucial roles, as lenders want assurance you can repay the loan. The loan term affects your rate as well, with shorter-term loans generally offering lower rates because the lender's money is at risk for less time. Finally, the broader economic environment and Federal Reserve policies influence baseline interest rates across all loan types.
          </p>

          <h3>Loan Term (Number of Payments)</h3>
          <p>
            The term, or total number of payments on the loan, is the final major factor affecting your monthly payment amount. In this case, the relationship is inverse: the higher the term (longer loan period), the lower the monthly payment will be. Conversely, the lower the term (shorter loan period), the higher the monthly payment. This might seem counterintuitive at first, but it makes sense when you consider that you're spreading the same loan amount over more or fewer payments.
          </p>

          <p>
            For example, a $30,000 auto loan at 5% interest would have a monthly payment of $566 over 5 years (60 months), but only $472 over 6 years (72 months)—a difference of $94 per month. However, the longer term costs significantly more in total: $33,960 versus $33,936, with the 6-year loan accumulating an additional $1,224 in interest charges despite the lower monthly payment. This illustrates why shorter loan terms, while requiring higher monthly payments, save substantial money over time by reducing total interest paid.
          </p>

          <p>
            With a lower term, more money will need to be paid each month to pay off the loan in a shorter amount of time, but you'll build equity faster and pay significantly less in total interest. The interest rate itself is also usually lower with a shorter-term loan because the lender is getting their money back sooner, reducing their risk exposure. For instance, 15-year mortgages typically have interest rates 0.5% to 0.75% lower than comparable 30-year mortgages. You can use our <a href="/financial/loan-payoff" className="text-blue-600 dark:text-blue-400 hover:underline">loan payoff calculator</a> to see how long it would take to pay off a loan at different payment amounts and explore various payoff strategies.
          </p>

          <h2>Types of Loans</h2>
          <p>
            Understanding the different types of loans available helps you choose the right financing option for your specific needs. There are three main categories of loans: real estate loans, consumer loans, and business loans. Each category has distinct characteristics, typical terms, and interest rate ranges that reflect their purpose and risk profile.
          </p>

          <h3>Real Estate Loans</h3>
          <p>
            Real estate loans consist primarily of first mortgages and second mortgages (also called home equity loans or HELOCs). A first mortgage is the initial loan you obtain when purchasing a home, typically representing 80% or more of the property's value if you make a 20% down payment. These are usually the largest loans most people will ever take out, with terms commonly ranging from 15 to 30 years and current interest rates between 6% and 8% depending on creditworthiness and market conditions.
          </p>

          <p>
            A second mortgage, home equity loan, or home equity line of credit (HELOC) is an additional loan secured against your house at a later point in time, after you've built up equity. Homeowners often use second mortgages by tapping into the equity of their home to make improvements on the property, consolidate higher-interest debt, or fund major expenses like college tuition. These typically have higher interest rates than first mortgages because they're in a subordinate position—if you default, the first mortgage lender gets paid before the second mortgage lender. Our <a href="/financial/heloc-payment" className="text-blue-600 dark:text-blue-400 hover:underline">HELOC payment calculator</a> can help you estimate costs for home equity borrowing.
          </p>

          <h3>Consumer Loans</h3>
          <p>
            The second loan category is consumer loans, which encompass a wide variety of borrowing for personal use. Consumer loans may consist of credit cards (revolving credit with variable rates typically between 15% and 25%), auto loans (secured loans with terms of 3-7 years and rates from 4% to 10%), student loans (education financing with terms up to 25 years and rates from 4% to 12% depending on federal vs. private), and personal loans (unsecured loans for any purpose with terms of 2-7 years and rates from 6% to 36%).
          </p>

          <p>
            Each type of consumer loan serves different purposes and has distinct features. Auto loans are secured by the vehicle itself, resulting in lower rates than unsecured personal loans. Federal student loans offer borrower protections and income-driven repayment options not available with private loans. Credit cards provide flexibility but charge the highest interest rates, making them expensive for long-term borrowing. Our <a href="/financial/auto-loan" className="text-blue-600 dark:text-blue-400 hover:underline">auto loan calculator</a> and <a href="/financial/student-loan" className="text-blue-600 dark:text-blue-400 hover:underline">student loan calculator</a> can help you plan for these specific types of consumer debt.
          </p>

          <h3>Business Loans</h3>
          <p>
            The final type of loan is a business or commercial loan. These are loans that an individual or company uses to start or grow a business, purchase equipment, finance inventory, or manage cash flow. Business loans come in many forms including term loans (lump sum repaid over set period), lines of credit (revolving access to funds), SBA loans (government-backed loans with favorable terms), and equipment financing (secured by the equipment purchased).
          </p>

          <p>
            Interest rates on business loans vary widely based on the business's financial health, time in operation, creditworthiness, and the specific loan type. Established businesses with strong financials might secure rates as low as 5-7%, while startups or higher-risk ventures could face rates of 10-20% or more. The loan term also varies significantly, from short-term working capital loans of 6-18 months to long-term equipment or real estate loans extending 10-25 years. Understanding these loan types ensures you can select the right financing vehicle for your specific situation and negotiate the best possible terms.
          </p>

          <p>
            Overall, it's important to understand how to calculate a loan payment and the different types of loans available to ensure you understand what type of loan is right for you and whether you can afford the monthly obligations. Taking time to shop around for the best rates and terms can save you tens of thousands of dollars over the life of your loan.
          </p>

          <h2>Frequently Asked Questions</h2>

          <h3>Why is understanding the loan payment amount important?</h3>
          <p>
            Understanding what a loan payment will be is critical to ensure you are able to afford the loan without stretching your budget too thin. It's also important to understand any hidden costs or fees that factor into a loan payment, such as origination fees, closing costs, or mortgage insurance, so you understand the true cost of borrowing and whether it is worth it to you or not. Financial experts recommend that your total monthly debt obligations should not exceed 36% of your gross monthly income to maintain financial stability. Knowing your exact payment amount allows you to plan your budget accordingly, avoid overextending yourself financially, and make informed decisions about whether to proceed with the loan or look for alternatives.
          </p>

          <h3>What should you not do during the process of taking out a loan?</h3>
          <p>
            If you are currently awaiting approval on any type of loan, it's generally a good idea not to make any large purchases, not to switch jobs, and be sure to pay any current loan payments on time. Anything that can change your credit score or debt-to-income ratio is cautioned against during the process of obtaining a loan because lenders verify your financial information right up until closing. Opening new credit cards, financing furniture or appliances, or taking on any additional debt can jeopardize your loan approval even after you've received initial approval. Similarly, changing employers—especially if moving to a new field or starting your own business—can raise red flags for lenders concerned about income stability. Late payments during the approval process can also cause lenders to withdraw their offer or increase your interest rate substantially.
          </p>

          <h3>Are all types of loans equal?</h3>
          <p>
            All types of loans are definitely not equal, and understanding these differences can save you significant money. Mortgage loans typically have the lowest interest rates because they have substantial collateral backing them—if a borrower does not pay, the lender can take back the home and sell it to recover their funds. This security allows lenders to offer rates in the 6-8% range for qualified borrowers. Consumer loans tend to have higher interest rates because they have no collateral (like personal loans) or less valuable collateral (like auto loans where vehicles depreciate rapidly). These loans can range from 4% for prime auto loans to 25%+ for credit cards. Finally, business or commercial loans' interest rates tend to also be higher than mortgage loans due to greater risk, but the viability and financial strength of the business can significantly impact the interest rate offered. A well-established business with strong cash flow might secure rates comparable to consumer loans, while a startup might face double-digit rates reflecting the higher risk of business failure.
          </p>

          <h3>Can I pay off my loan early to save on interest?</h3>
          <p>
            In most cases, yes—paying off your loan early can save you substantial money in interest charges because interest accrues on the outstanding balance. However, some loans include prepayment penalties that charge fees if you pay off the loan before the scheduled term ends. These penalties are designed to compensate lenders for the interest income they'll lose. Before making extra payments or paying off a loan entirely, check your loan agreement for prepayment penalty clauses. Many mortgages originated after 2014 don't have prepayment penalties due to consumer protection regulations, but some commercial loans, auto loans, and personal loans may still include them. Even a small prepayment penalty might be worthwhile if you'll save significantly more in interest, but it's essential to do the math first.
          </p>

          <h3>How does my credit score affect my loan payment?</h3>
          <p>
            Your credit score has a profound impact on your loan payment through its effect on the interest rate you're offered. Lenders use credit scores to assess risk—borrowers with higher scores (740+) demonstrate a history of responsible credit management and qualify for the lowest interest rates available. Those with lower scores (below 640) are considered higher risk and face significantly higher rates, sometimes 2-4 percentage points higher than prime borrowers. On a $250,000 30-year mortgage, the difference between a 6% rate (excellent credit) and an 8% rate (fair credit) is $331 per month, or nearly $119,000 over the loan's lifetime. This demonstrates why improving your credit score before applying for a loan is one of the most valuable financial moves you can make. Even a 20-30 point improvement in your score can result in a better rate tier and substantial savings.
          </p>

          <h2>References</h2>
          <ul className="space-y-2">
            <li>
              <a href="https://www.federalreserve.gov/releases/g19/current/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Federal Reserve - Consumer Credit Statistics
              </a>
            </li>
            <li>
              <a href="https://www.consumerfinance.gov/owning-a-home/loan-options/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Consumer Financial Protection Bureau - Loan Options
              </a>
            </li>
            <li>
              <a href="https://www.fdic.gov/consumers/consumer/moneysmart/pubs/borrowing/borrowing.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                FDIC - Money Smart Guide to Borrowing
              </a>
            </li>
            <li>
              <a href="https://www.irs.gov/publications/p936" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                IRS Publication 936 - Home Mortgage Interest Deduction
              </a>
            </li>
            <li>
              <a href="https://www.sba.gov/funding-programs/loans" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                U.S. Small Business Administration - Loan Programs
              </a>
            </li>
            <li>
              <a href="https://studentaid.gov/understand-aid/types/loans" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Federal Student Aid - Types of Loans
              </a>
            </li>
            <li>
              <a href="https://www.occ.treas.gov/topics/consumers-and-communities/consumer-protection/index-consumer-protection.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Office of the Comptroller of the Currency - Consumer Protection
              </a>
            </li>
            <li>
              <a href="https://www.bankrate.com/calculators/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                Bankrate - Financial Calculators and Tools
              </a>
            </li>
          </ul>
        </div>
      }
    />
  );
}
