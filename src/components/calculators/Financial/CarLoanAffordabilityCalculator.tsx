import { useState, useMemo } from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    monthlyIncome: 0,
    monthlyDebt: 0,
    interestRate: 0,
    loanTerm: 0,
  });

  const results = useMemo(() => {
    const { monthlyIncome, monthlyDebt, interestRate, loanTerm } = inputs;
    const disposableIncome = monthlyIncome - monthlyDebt;
    const maxLoanPayment = disposableIncome * 0.15; // 15% of disposable income
    const loanAmount = (maxLoanPayment * (1 - Math.pow(1 + interestRate / 1200, -loanTerm))) / (interestRate / 1200);
    return {
      maxLoanPayment,
      loanAmount,
    };
  }, [inputs]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <CalculatorUnifiedLayout
      title="Car Loan Affordability Calculator"
      stickyTopPx={120}
      maxWidth={1200}
      gap={32}
      showTopBanner
      editorial={<div className="skn-editorial">
        <section className="mb-6">
          <p className="text-base leading-relaxed mb-4">
            Understanding how much you can afford for a car loan is crucial in making a sound financial decision. Many individuals find themselves overwhelmed by the complexities of loan terms, interest rates, and their own financial situations. This calculator matters because it provides a clear picture of your borrowing capacity, helping you avoid financial strain. According to the Consumer Financial Protection Bureau, nearly 40% of Americans struggle with debt, making it essential to understand your limits before committing to a loan.
          </p>
          <p className="mb-3">In this calculator and comprehensive guide, we will explain:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>How to determine your maximum car loan payment</li>
            <li>The impact of interest rates on your loan</li>
            <li>How loan terms affect your affordability</li>
            <li>Best practices for managing car loans</li>
            <li>Common pitfalls to avoid when financing a car</li>
            <li>Real-world examples of car loan scenarios</li>
          </ul>
          <p className="text-base leading-relaxed">
            If you are considering purchasing a vehicle, try our <a href="/financial/car-loan-calculator" className="text-blue-600 hover:underline">Car Loan Calculator</a>. You can also use our <a href="/financial/auto-loan-payment" className="text-blue-600 hover:underline">Auto Loan Payment Calculator</a> to estimate your monthly payments. For budgeting purposes, check out our <a href="/financial/budget-calculator" className="text-blue-600 hover:underline">Budget Calculator</a>.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How much car loan can I afford?</h2>
          <p className="text-base leading-relaxed mb-4">
            Determining how much car loan you can afford is essential for making informed financial decisions. The general rule of thumb is that your total monthly car payment should not exceed 15% of your disposable income, which is your income after taxes and other mandatory expenses. This approach ensures that you maintain a healthy budget while enjoying your new vehicle.
          </p>
          <p className="text-base leading-relaxed mb-4">
            The calculation for your maximum car loan payment considers your monthly income, existing debts, and the loan's interest rate and term. By understanding these variables, you can make better choices about the type of vehicle you can afford without overextending your finances.
          </p>
          <p className="text-base leading-relaxed mb-4">
            Most financial experts agree that keeping your car payment below 15% of your disposable income is a safe guideline. For example, if your monthly income is $5,000, and your monthly debt payments are $1,000, your disposable income is $4,000. Therefore, your maximum car payment should be $600, which keeps your debt-to-income ratio manageable.
          </p>
          <p className="text-base leading-relaxed mb-4">
            Another widely accepted rule suggests that your total vehicle expenses (including insurance, maintenance, and fuel) should not exceed 20% of your monthly income. For instance, with an annual salary of $60,000, you should aim for total vehicle expenses of about $1,000 per month. This conservative approach ensures you can comfortably afford your vehicle without compromising other financial goals.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to use this Car Loan Affordability Calculator?</h2>
          <p className="text-base leading-relaxed mb-4">
            Using this calculator is straightforward and user-friendly. Simply input your financial details, and the calculator will provide you with an estimate of how much you can afford to borrow for a car loan.
          </p>
          <p className="text-base leading-relaxed mb-3">To get accurate results, you'll need to provide:</p>
          <ul className="list-disc pl-6 space-y-3 mb-4">
            <li><strong>Monthly Income:</strong> This is your total income before taxes and deductions. It’s essential to use your net income to get a realistic picture of your financial situation. Typical ranges vary widely based on location and occupation.</li>
            <li><strong>Monthly Debt:</strong> Include all your existing debt obligations, such as credit card payments, student loans, and mortgage payments. This figure helps determine your disposable income and ensures you don’t overextend your finances.</li>
            <li><strong>Interest Rate:</strong> This is the annual percentage rate (APR) offered by lenders for your car loan. Rates can vary based on your credit score, loan term, and market conditions. Knowing your expected rate is crucial for accurate calculations.</li>
            <li><strong>Loan Term:</strong> This is the duration over which you plan to repay the loan, typically ranging from 36 to 72 months. A longer term may lower your monthly payments but can increase the total interest paid over the life of the loan.</li>
          </ul>
          <p className="text-base leading-relaxed mb-4">
            After entering your data, the calculator will display your maximum affordable car payment and the total loan amount you can borrow. This information is vital for making informed decisions about your vehicle purchase and ensuring you stay within your budget.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are the best practices for car loans?</h2>
          <p className="text-base leading-relaxed mb-4">
            Navigating the world of car loans can be complex, and understanding best practices is essential for financial health. One of the main guidelines is to ensure that your total car expenses do not exceed 20% of your monthly income. This approach helps you maintain a balanced budget while enjoying your vehicle.
          </p>
          <p className="text-base leading-relaxed mb-4">
            We believe that a practical guideline is to keep your car payment below 15% of your disposable income. This range accounts for your existing debt obligations and ensures that you have enough room in your budget for other expenses. Where you fall within this range depends on your overall financial situation and goals.
          </p>
          <p className="text-base leading-relaxed mb-4">
            However, if you have significant savings or a high income, you might reasonably consider a higher percentage for your car payment. In this case, you would treat your vehicle as a necessary expense rather than a luxury, allowing for a more flexible budget.
          </p>
          <p className="text-base leading-relaxed mb-4">
            In summary, a good approximation is to keep your car payment around 15% of your disposable income. For example, if your monthly income is $4,000, you should target a car payment of about $600. This ensures you can afford your vehicle without compromising your financial stability.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are the hidden costs of car loans?</h2>
          <p className="text-base leading-relaxed mb-4">
            When considering a car loan, it's essential to account for hidden costs that can significantly impact your budget. Beyond the monthly payment, you should budget for:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Insurance:</strong> Car insurance is a mandatory expense that varies based on your vehicle, location, and driving history. Expect to pay anywhere from $100 to $300 per month.</li>
            <li><strong>Maintenance:</strong> Regular maintenance costs, including oil changes and tire rotations, can add up. Budget around $50 to $100 monthly for upkeep.</li>
            <li><strong>Fuel:</strong> Fuel costs depend on your vehicle's efficiency and your driving habits. Average monthly fuel expenses can range from $100 to $300.</li>
            <li><strong>Registration and Taxes:</strong> Vehicle registration fees and taxes vary by state but can range from $50 to $200 annually.</li>
            <li><strong>Depreciation:</strong> Cars lose value over time, which is an important consideration if you plan to sell or trade in your vehicle in the future.</li>
          </ul>
          <p className="text-base leading-relaxed mb-4">
            According to the AAA, the average cost of owning a vehicle in the U.S. is approximately $9,282 per year, which breaks down to about $773 per month. This figure includes all expenses, such as fuel, maintenance, insurance, and depreciation. Understanding these costs helps you make informed decisions and avoid financial strain.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How is car loan affordability calculated?</h2>
          <p className="text-base leading-relaxed mb-4">
            The calculator uses several interconnected formulas to provide accurate results. Understanding these calculations helps you see how changes in one variable affect your overall affordability.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Maximum Loan Payment Calculation</h3>
              <pre className="rounded-md bg-black/20 p-3 text-sm overflow-x-auto">
{`Max Loan Payment = Disposable Income * 0.15

Where:
  Disposable Income = Monthly Income - Monthly Debt
`}
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Loan Amount Calculation</h3>
              <pre className="rounded-md bg-black/20 p-3 text-sm overflow-x-auto">
{`Loan Amount = (Max Loan Payment * (1 - (1 + (Interest Rate / 1200))^(-Loan Term))) / (Interest Rate / 1200)

Where:
  Max Loan Payment = Maximum monthly payment you can afford
  Interest Rate = Annual interest rate (APR)
  Loan Term = Total number of months for repayment
`}
              </pre>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Real-world car loan examples</h2>
          <p className="text-base leading-relaxed mb-4">
            Let's examine several realistic scenarios to see how different financial situations affect car loan affordability.
          </p>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 1: Moderate Income</h3>
              <p className="text-sm mb-2">Profile:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Monthly Income: $5,000</li>
                <li>Monthly Debt: $1,000</li>
                <li>Interest Rate: 5%</li>
                <li>Loan Term: 60 months</li>
              </ul>
              <p className="text-sm mb-2"><strong>Calculation:</strong> Disposable Income = $5,000 - $1,000 = $4,000; Max Loan Payment = $4,000 * 0.15 = $600; Loan Amount = ($600 * (1 - (1 + (5 / 1200))^(-60))) / (5 / 1200) = $32,000.</p>
              <p className="text-sm">
                <strong>Result:</strong> You can afford a loan of $32,000. This amount allows you to purchase a reliable vehicle without exceeding your budget.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 2: Higher Income</h3>
              <p className="text-sm mb-2">Profile:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Monthly Income: $8,000</li>
                <li>Monthly Debt: $1,500</li>
                <li>Interest Rate: 4%</li>
                <li>Loan Term: 72 months</li>
              </ul>
              <p className="text-sm mb-2"><strong>Calculation:</strong> Disposable Income = $8,000 - $1,500 = $6,500; Max Loan Payment = $6,500 * 0.15 = $975; Loan Amount = ($975 * (1 - (1 + (4 / 1200))^(-72))) / (4 / 1200) = $56,000.</p>
              <p className="text-sm">
                <strong>Result:</strong> You can afford a loan of $56,000. This flexibility allows you to consider a wider range of vehicles, including higher-end models.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 3: Low Income</h3>
              <p className="text-sm mb-2">Profile:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Monthly Income: $3,000</li>
                <li>Monthly Debt: $800</li>
                <li>Interest Rate: 6%</li>
                <li>Loan Term: 36 months</li>
              </ul>
              <p className="text-sm mb-2"><strong>Calculation:</strong> Disposable Income = $3,000 - $800 = $2,200; Max Loan Payment = $2,200 * 0.15 = $330; Loan Amount = ($330 * (1 - (1 + (6 / 1200))^(-36))) / (6 / 1200) = $10,000.</p>
              <p className="text-sm">
                <strong>Result:</strong> You can afford a loan of $10,000. This scenario emphasizes the importance of budgeting and understanding your limits.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 4: Edge Case</h3>
              <p className="text-sm mb-2">Profile:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Monthly Income: $4,500</li>
                <li>Monthly Debt: $3,000</li></ul>
              <p className="text-sm mb-2"><strong>Calculation:</strong> Disposable Income = $4,500 - $3,000 = $1,500; Max Loan Payment = $1,500 * 0.15 = $225; Loan Amount = ($225 * (1 - (1 + (5 / 1200))^(-60))) / (5 / 1200) = $11,000.</p>
              <p className="text-sm">
                <strong>Result:</strong> You can afford a loan of $11,000. This scenario highlights the importance of managing existing debt before taking on new loans.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 5: Common Mistake</h3>
              <p className="text-sm text-red-600 font-medium mb-2">What NOT to Do:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Monthly Income: $5,000</li>
                <li>Monthly Debt: $4,500</li>
                <li>Interest Rate: 7%</li>
                <li>Loan Term: 60 months</li>
              </ul>
              <p className="text-sm">
                <strong>Why This Fails:</strong> This violates the guideline of keeping your car payment below 15% of disposable income and creates significant financial strain. Always assess your total debt obligations before committing to a new loan.
              </p>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Car Loan Comparison</h2>
          <p className="text-base leading-relaxed mb-4">
            Understanding different loan options is crucial for making an informed decision. Below is a comparison of various loan scenarios based on different interest rates and terms.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Loan Amount</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Interest Rate</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Loan Term</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Monthly Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$20,000</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">4%</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">60 months</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$368.33</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$25,000</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">5%</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">72 months</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$415.46</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$30,000</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">6%</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">60 months</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$644.31</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$15,000</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">3.5%</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">48 months</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$339.34</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-base leading-relaxed mt-4">
            Key takeaways from this table include the impact of interest rates and loan terms on monthly payments. A lower interest rate or shorter loan term can significantly reduce your monthly payment, making it easier to stay within your budget.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently asked questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is the ideal debt-to-income ratio for a car loan?</h3>
              <p className="text-base leading-relaxed">
                The ideal debt-to-income ratio for a car loan is typically below 36%. This means that your total monthly debt payments, including your car loan, should not exceed 36% of your gross monthly income. Keeping your ratio below this threshold helps ensure you can manage your payments comfortably.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How can I improve my credit score before applying for a loan?</h3>
              <p className="text-base leading-relaxed">
                To improve your credit score, pay down existing debts, make all payments on time, and avoid opening new credit accounts shortly before applying for a loan. Additionally, check your credit report for errors and dispute any inaccuracies to boost your score.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What should I do if I can't afford my car payments?</h3>
              <p className="text-base leading-relaxed">
                If you can't afford your car payments, consider contacting your lender to discuss options such as refinancing, loan modification, or deferment. Additionally, evaluate your budget to identify areas where you can cut expenses to accommodate your payments.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is it better to lease or buy a car?</h3>
              <p className="text-base leading-relaxed">
                The decision to lease or buy a car depends on your financial situation and preferences. Leasing typically offers lower monthly payments and the ability to drive a new car every few years, while buying allows you to own the vehicle outright and build equity.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How does the loan term affect my monthly payment?</h3>
              <p className="text-base leading-relaxed">
                A longer loan term generally results in lower monthly payments but may increase the total interest paid over the life of the loan. Conversely, a shorter loan term leads to higher monthly payments but reduces the total interest cost.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What happens if I miss a car payment?</h3>
              <p className="text-base leading-relaxed">
                Missing a car payment can result in late fees, a negative impact on your credit score, and potential repossession of the vehicle. It's crucial to communicate with your lender if you anticipate missing a payment to explore options.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I pay off my car loan early?</h3>
              <p className="text-base leading-relaxed">
                Yes, many lenders allow you to pay off your car loan early without penalties. However, check your loan agreement for any prepayment penalties that may apply. Paying off your loan early can save you money on interest.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What is a good interest rate for a car loan?</h3>
              <p className="text-base leading-relaxed">
                A good interest rate for a car loan varies based on your credit score and market conditions. Generally, rates below 5% are considered favorable for borrowers with good credit. Always shop around to find the best rate available.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How can I lower my car loan interest rate?</h3>
              <p className="text-base leading-relaxed">
                To lower your car loan interest rate, improve your credit score, shop around for competitive rates, and consider making a larger down payment. Additionally, opting for a shorter loan term can also help secure a lower rate.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What should I consider when choosing a lender?</h3>
              <p className="text-base leading-relaxed">
                When choosing a lender, consider factors such as interest rates, loan terms, fees, customer service, and the lender's reputation. It's essential to compare multiple lenders to find the best deal for your financial situation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What if I have bad credit?</h3>
              <p className="text-base leading-relaxed">
                If you have bad credit, you may still qualify for a car loan, but expect higher interest rates. Consider working to improve your credit before applying, or explore lenders that specialize in loans for individuals with lower credit scores.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What if I have no credit history?</h3>
              <p className="text-base leading-relaxed">
                If you have no credit history, consider applying for a secured credit card or a small personal loan to establish credit. Additionally, some lenders may consider alternative data, such as rental payment history, when evaluating your application.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What if I have a trade-in vehicle?</h3>
              <p className="text-base leading-relaxed">
                If you have a trade-in vehicle, its value can be applied toward your new car purchase, reducing the loan amount needed. Ensure you research your trade-in's value to negotiate effectively with the dealer.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What if I want to buy a used car?</h3>
              <p className="text-base leading-relaxed">
                Buying a used car can be a cost-effective option. Ensure you research the vehicle's history, have it inspected, and consider financing options that may differ from new car loans. Used car loans may have different terms and rates.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What if I have a specific edge case?</h3>
              <p className="text-base leading-relaxed">
                If you have unique financial circumstances, such as being self-employed or having irregular income, consider consulting with a financial advisor. They can help you navigate your options and find a loan that suits your situation.
              </p>
            </div>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">References and sources</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Consumer Financial Protection Bureau (CFPB) - "Understanding Car Loans"</li>
            <li>Federal Reserve - "Report on the Economic Well-Being of U.S. Households"</li>
            <li>U.S. Department of Transportation - "Vehicle Ownership Costs"</li>
            <li>American Automobile Association (AAA) - "Your Driving Costs 2022"</li>
            <li>Experian - "State of the Automotive Finance Market"</li>
          </ul>
        </section>
      </div>}
      widget={<div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Income</Label>
            <Input
              id="monthlyIncome"
              type="number"
              value={inputs.monthlyIncome}
              onChange={(e) => setInputs(prev => ({ ...prev, monthlyIncome: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 5000"
            />
            <p className="text-xs text-muted-foreground">Your total monthly income before taxes.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthlyDebt">Monthly Debt</Label>
            <Input
              id="monthlyDebt"
              type="number"
              value={inputs.monthlyDebt}
              onChange={(e) => setInputs(prev => ({ ...prev, monthlyDebt: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 1000"
            />
            <p className="text-xs text-muted-foreground">Total monthly debt payments.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              value={inputs.interestRate}
              onChange={(e) => setInputs(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 5"
            />
            <p className="text-xs text-muted-foreground">Annual interest rate for your loan.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term (months)</Label>
            <Input
              id="loanTerm"
              type="number"
              value={inputs.loanTerm}
              onChange={(e) => setInputs(prev => ({ ...prev, loanTerm: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 60"
            />
            <p className="text-xs text-muted-foreground">Duration of the loan in months.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="calculate">Calculate</Button>
            <Button variant="reset" onClick={() => setInputs({ monthlyIncome: 0, monthlyDebt: 0, interestRate: 0, loanTerm: 0 })}>Reset</Button>
          </div>
          <div className="space-y-3 pt-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Maximum Affordable Payment</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(results.maxLoanPayment)}</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Loan Amount</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(results.loanAmount)}</p>
            </div>
          </div>
        </div>
      </div>}
      railRight={null}
    />
  );
}