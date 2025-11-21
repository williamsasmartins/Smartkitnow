import { useState, useMemo } from "react";
import CalculatorUnifiedLayout from "@/components/templates/CalculatorUnifiedLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CarLoanAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    monthlyIncome: "",
    existingDebts: "",
    downPayment: "",
    loanTerm: "",
    interestRate: "",
  });
  
  const results = useMemo(() => {
    const monthlyIncome = parseFloat(inputs.monthlyIncome) || 0;
    const existingDebts = parseFloat(inputs.existingDebts) || 0;
    const downPayment = parseFloat(inputs.downPayment) || 0;
    const loanTerm = parseFloat(inputs.loanTerm) || 48;
    const interestRate = parseFloat(inputs.interestRate) || 0;

    const maxDebtPayment = monthlyIncome * 0.36 - existingDebts;
    const monthlyInterestRate = interestRate / 100 / 12;

    const maxLoanAmount = (maxDebtPayment * ((1 - Math.pow(1 + monthlyInterestRate, -loanTerm)) / monthlyInterestRate));
    const maxCarPrice = maxLoanAmount + downPayment;

    const monthlyPayment = (maxLoanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));
    const totalInterest = (monthlyPayment * loanTerm) - maxLoanAmount;

    const dtiRatio = ((existingDebts + monthlyPayment) / monthlyIncome) * 100;

    return {
      maxCarPrice,
      monthlyPayment,
      maxLoanAmount,
      totalInterest,
      dtiRatio,
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
            According to Experian's Q4 2024 report, the average new car loan is $40,855 with a monthly payment of $738. With 72-month terms becoming standard, many buyers find themselves paying more in interest than necessary. This trend is concerning, especially as nearly 35% of Americans have car payments exceeding $500/month, straining budgets and limiting savings. The financial burden of car loans can lead to significant stress, especially when unexpected expenses arise. Understanding how much you can afford to spend on a vehicle is crucial to maintaining financial stability and ensuring you do not overextend yourself financially.
          </p>
          
          <p className="text-base leading-relaxed mb-4">
            Our calculator goes beyond simple payment estimates by analyzing your complete financial picture. It considers your gross monthly income, existing debt obligations (mortgage, student loans, credit cards), down payment capacity, and trade-in value to determine a realistic vehicle price range. Financial experts universally recommend keeping total debt payments below 36% of gross income, with transportation costs (car payment, insurance, fuel, maintenance) not exceeding 20% of take-home pay. This comprehensive approach helps you make informed decisions about your car purchase, ensuring you remain within your financial means while still obtaining a vehicle that meets your needs.
          </p>
          
          <p className="mb-3">In this calculator and comprehensive guide, we will explain:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>How to calculate your maximum affordable car price based on income</li>
            <li>The 20/4/10 rule and how to apply it to your situation</li>
            <li>How existing debts reduce your car-buying capacity</li>
            <li>The true cost of longer loan terms (60, 72, 84 months)</li>
            <li>Hidden ownership costs that add $3,000-$5,000 annually</li>
            <li>How credit scores affect your interest rate and total cost</li>
            <li>Real-world examples across different income levels</li>
          </ul>
          
          <p className="text-base leading-relaxed">
            If you need to calculate monthly payments for a specific vehicle, try our <a href="/financial/loan-payment" className="text-blue-600 hover:underline">Car Loan Calculator</a>. You can also use our <a href="/financial/debt-to-income" className="text-blue-600 hover:underline">Debt-to-Income Calculator</a> to assess your overall debt load. For comparing lease vs buy, check out our <a href="/financial/lease-vs-buy" className="text-blue-600 hover:underline">Lease vs Buy Calculator</a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How much car can I afford based on my income?</h2>
          
          <p className="text-base leading-relaxed mb-4">
            The foundation of car affordability is your gross monthly income. Lenders typically use a debt-to-income (DTI) ratio to determine loan approval, but responsible budgeting requires a more nuanced approach. Your DTI ratio is calculated by dividing your total monthly debt payments by your gross monthly income. Most lenders prefer to see a DTI below 36%, with no more than 28% allocated to housing costs. For example, if you earn $5,000 per month gross ($60,000 annually), your maximum total debt payments should be $1,800 (36%). If you already have a $1,200 mortgage and $200 in credit card payments, that leaves only $400 for a car payment. This is why understanding your existing obligations is critical before shopping for vehicles.
          </p>
          
          <p className="text-base leading-relaxed mb-4">
            The 20/4/10 rule provides a practical framework: put down at least 20%, finance for no more than 4 years (48 months), and keep total transportation costs under 10% of gross income. Using our $5,000/month income example, 10% equals $500. This $500 must cover not just your car payment but also insurance, fuel, maintenance, and registration fees. If insurance costs $150/month and fuel/maintenance average $150/month, you have only $200 remaining for the loan payment itself. At a 6% interest rate over 48 months, this $200 payment supports a loan of approximately $8,600. Add a 20% down payment ($2,150), and your affordable vehicle price is roughly $10,750—significantly less than many buyers expect.
          </p>
          
          <p className="text-base leading-relaxed mb-4">
            Alternative approaches exist for different circumstances. The 40% rule suggests that your vehicle purchase price should not exceed 40% of your annual gross income. For a $60,000 salary, this yields a $24,000 maximum vehicle price. This rule works well for cash buyers or those with minimal other debts. However, it can be dangerous for buyers who finance the full amount over extended terms, as interest charges can add $5,000-$10,000 to the total cost. Understanding your financial limits is essential to avoid falling into a cycle of debt that can be difficult to escape.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How to use the car loan affordability calculator</h2>
          
          <p className="text-base leading-relaxed mb-4">
            Our calculator requires five key inputs to determine your affordable car price range. Accuracy is important—use actual figures rather than estimates. Gather your latest pay stub for income verification, list all monthly debt obligations (minimum payments on credit cards, student loans, personal loans), and check current auto loan rates for your credit tier. The entire process takes about 3 minutes. By entering these values, you can quickly assess your financial capacity and make informed decisions about your vehicle purchase.
          </p>
          
          <p className="text-base leading-relaxed mb-3">Here's what each input means and how to determine it accurately:</p>
          
          <ul className="list-disc pl-6 space-y-3 mb-4">
            <li><strong>Monthly Gross Income:</strong> Your total income before taxes and deductions. Include salary, bonuses, commissions, and any regular side income. For hourly workers, multiply your hourly rate by hours per week, then by 4.33. For example, $25/hour × 40 hours × 4.33 = $4,330 monthly. Salaried workers divide annual salary by 12. Don't use take-home pay—lenders evaluate based on gross income.</li>
            
            <li><strong>Existing Monthly Debts:</strong> Sum all minimum required payments: mortgage/rent ($1,200), student loans ($350), credit cards ($150), personal loans ($200), etc. Include only obligations that appear on your credit report. Exclude utilities, groceries, and discretionary spending. This figure directly reduces your available car budget.</li>
            
            <li><strong>Down Payment Available:</strong> Cash you can apply immediately to the purchase. Ideally 20% of the vehicle price. For a $25,000 car, that's $5,000. Larger down payments reduce monthly payments and interest costs. If you're trading in a vehicle, add its estimated value here. Use Kelley Blue Book or Edmunds for accurate trade-in values.</li>
            
            <li><strong>Loan Term (months):</strong> The repayment period. Common terms are 36, 48, 60, and 72 months. Longer terms mean lower monthly payments but higher total interest. A $20,000 loan at 6% costs $3,199 in interest over 72 months versus $1,275 over 36 months—a $1,924 difference. We recommend 48 months maximum.</li>
            
            <li><strong>Interest Rate (APR):</strong> Your annual percentage rate depends on credit score. Excellent credit (750+): 4-5%. Good credit (700-749): 5-7%. Fair credit (650-699): 7-12%. Poor credit (below 650): 12-18% or higher. Check Bankrate or your bank for current rates. A 2% rate difference on a $25,000 loan costs $1,500 extra over 60 months.</li>
          </ul>
          
          <p className="text-base leading-relaxed mb-4">
            After entering these values, the calculator instantly displays your maximum affordable car price, recommended monthly payment, total loan amount, and total interest paid over the loan term. It also shows your debt-to-income ratio and whether it falls within recommended guidelines. Use these results as a starting point for negotiation—dealers often try to focus on monthly payments alone, obscuring the total cost. Armed with this information, you can confidently reject deals that exceed your calculated affordability range.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are the best practices for car loan affordability?</h2>
          
          <p className="text-base leading-relaxed mb-4">
            Financial advisors nearly universally recommend the 20/4/10 rule as the gold standard for car buying. This framework emerged from decades of consumer lending data showing that buyers who follow it rarely experience payment distress or default. The 20% down payment requirement serves multiple purposes: it demonstrates financial discipline, reduces the loan-to-value ratio (protecting you from being underwater), and lowers monthly payments by $50-$75 per $5,000 down. For example, if you purchase a $30,000 vehicle with a 20% down payment, your loan amount drops to $24,000, significantly reducing your financial burden.
          </p>
          
          <p className="text-base leading-relaxed mb-4">
            The 4-year (48-month) maximum term might seem restrictive when dealerships routinely offer 72 or even 84-month loans. However, longer terms create significant risks. First, you'll likely owe more than the car is worth for most of the loan period due to rapid depreciation—new cars lose 20% of value in year one and 15% in year two. Second, interest charges accumulate substantially. A $30,000 loan at 6% APR costs $2,000 in interest over 48 months but $4,000 over 72 months. Third, you're locked into an aging vehicle with increasing maintenance costs while still making payments. Cars typically need major repairs (timing belts, transmissions, suspensions) around 100,000 miles—often before a 72-month loan ends.
          </p>
          
          <p className="text-base leading-relaxed mb-4">
            The 10% rule for total transportation costs is where many buyers miscalculate. They focus solely on the monthly payment, forgetting that insurance averages $150-$200/month, fuel costs $150-$250/month (depending on commute and vehicle efficiency), and maintenance/repairs average $100/month according to AAA's 2024 study. That's $400-$550 in additional costs beyond the payment. For someone earning $5,000/month gross, 10% is $500 total—leaving just $50-$150 for the actual car payment, which supports a minimal loan amount. Understanding these costs is crucial to avoid financial strain.
          </p>
          
          <p className="text-base leading-relaxed mb-4">
            Many financial experts suggest even more conservative approaches for long-term wealth building. The 40% rule (car price ≤ 40% of annual income) works well for cash purchases but can mislead financed buyers. A more holistic approach considers your complete financial picture: emergency fund status (do you have 3-6 months of expenses saved?), retirement contribution rate (are you meeting employer match?), and other financial goals. If you're not saving at least 15% of income for retirement, a cheaper car frees up cash for this critical need. Always prioritize your long-term financial health over short-term desires.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">What are the hidden costs of car ownership?</h2>
          
          <p className="text-base leading-relaxed mb-4">
            The sticker price and monthly payment represent only a fraction of a vehicle's true cost. According to AAA's 2024 'Your Driving Costs' study, the average cost to own and operate a new vehicle is $10,728 per year, or $894 per month. This figure shocked even financial professionals when published. For buyers focusing solely on a $400 car payment, the reality of an additional $494 in monthly costs creates significant budget strain. Understanding these hidden costs is essential to avoid financial pitfalls that can arise from car ownership.
          </p>
          
          <p className="text-base leading-relaxed mb-3">Here are the major categories that inflate total ownership costs:</p>
          
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Insurance:</strong> Averages $1,895 annually ($158/month) nationally, but varies dramatically by location, vehicle type, age, and driving record. Urban areas and states like Michigan, Louisiana, and Florida see premiums of $2,500-$3,500/year. Sports cars and luxury vehicles cost 40-70% more to insure than sedans. Young drivers (under 25) pay double or triple these amounts.</li>
            
            <li><strong>Fuel Costs:</strong> At $3.50/gallon and 15,000 miles driven annually, a 25-MPG vehicle consumes 600 gallons ($2,100/year or $175/month). A 15-MPG truck or SUV costs $3,500 annually ($292/month). Electric vehicles average $600-$800/year in electricity, saving $1,300-$2,700 annually but requiring higher upfront costs.</li>
            
            <li><strong>Maintenance and Repairs:</strong> Routine maintenance (oil changes, tire rotations, filter replacements) costs $800-$1,200 annually. Factor in occasional tire replacements ($600-$1,000 every 4-5 years), brake service ($300-$800 every 2-3 years), and unexpected repairs. AAA estimates $1,186/year average, or $99/month.</li>
            
            <li><strong>Registration and Fees:</strong> Annual registration fees vary by state from $30 (Alaska) to $700+ (California for expensive vehicles). Many states charge based on vehicle value or weight. Add inspection fees ($15-$50) and personal property taxes in some states ($100-$600 annually).</li>
            
            <li><strong>Depreciation:</strong> The single largest cost of vehicle ownership. New cars lose 20-30% of value in year one, 15% in year two, and 10-12% annually thereafter. A $35,000 new car is worth $24,500 after one year—a $10,500 loss ($875/month) even if you never drove it. This hidden cost doesn't affect your monthly cash flow but destroys wealth.</li>
          </ul>
          
          <p className="text-base leading-relaxed mb-4">
            The U.S. Bureau of Labor Statistics' Consumer Expenditure Survey reports that American households spent an average of $10,961 on transportation in 2023, making it the second-largest expense category after housing ($23,013). When you add depreciation—which the BLS doesn't fully capture—the true cost exceeds $12,000-$15,000 annually for many households. This is why financial planners emphasize buying used vehicles (3-5 years old) that have already absorbed the steepest depreciation, choosing fuel-efficient models, and driving vehicles longer (10-15 years) to amortize fixed costs across more years of use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How is car loan affordability calculated?</h2>
          
          <p className="text-base leading-relaxed mb-4">
            Our calculator uses several interconnected formulas to determine your affordable car price. Understanding these calculations empowers you to manually verify results and adjust assumptions. The math is straightforward, relying on fundamental financial principles taught in undergraduate finance courses. By grasping these formulas, you can make informed decisions about your car purchase and understand how different variables impact your overall affordability.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Debt-to-Income Ratio Calculation</h3>
              <pre className="rounded-md bg-black/20 p-3 text-sm overflow-x-auto">
{`DTI = (Total Monthly Debts / Gross Monthly Income) × 100

Where:
  Total Monthly Debts = Existing debts + Proposed car payment
  Gross Monthly Income = Pre-tax monthly earnings
  Target DTI = ≤ 36% (max)

Example:
  Gross Income: $5,500/month
  Existing Debts: $1,400/month
  Target DTI: 36%
  
  Maximum Total Debts = $5,500 × 0.36 = $1,980
  Available for Car = $1,980 - $1,400 = $580/month`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Monthly Payment Calculation (Loan Amortization)</h3>
              <pre className="rounded-md bg-black/20 p-3 text-sm overflow-x-auto">
{`Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]

Where:
  P = Loan principal (vehicle price - down payment)
  r = Monthly interest rate (APR / 12 / 100)
  n = Number of months (loan term)

Example:
  Vehicle Price: $25,000
  Down Payment: $5,000 (20%)
  Loan Principal (P): $20,000
  APR: 6% (r = 0.06/12 = 0.005)
  Term: 48 months (n = 48)
  
  Payment = $20,000 × [0.005(1.005)^48] / [(1.005)^48 - 1]
  Payment = $20,000 × 0.0235 = $470/month
  
  Total Paid = $470 × 48 = $22,560
  Total Interest = $22,560 - $20,000 = $2,560`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Maximum Affordable Car Price</h3>
              <pre className="rounded-md bg-black/20 p-3 text-sm overflow-x-auto">
{`Max Car Price = (Max Payment × Present Value Factor) + Down Payment

Where:
  Max Payment = (Target DTI × Income) - Existing Debts
  PV Factor = [(1+r)^n - 1] / [r(1+r)^n]
  
Example:
  Income: $6,000/month
  Target DTI: 36% → Max Debts = $2,160
  Existing Debts: $1,500
  Max Car Payment: $2,160 - $1,500 = $660/month
  
  APR: 6%, Term: 48 months
  PV Factor = 42.58
  Max Loan = $660 × 42.58 = $28,103
  Down Payment: $7,000
  Max Car Price = $28,103 + $7,000 = $35,103`}
              </pre>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Real-world car affordability examples</h2>
          
          <p className="text-base leading-relaxed mb-4">
            Let's examine five realistic scenarios spanning different income levels and debt situations. These examples illustrate how the same vehicle can be affordable for one buyer but financially dangerous for another. Understanding these scenarios can help you gauge your own financial situation and make informed decisions about your car purchase.
          </p>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 1: Entry-level buyer</h3>
              <p className="text-sm mb-2">Profile:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Age: 25, Income: $3,500/month ($42,000/year)</li>
                <li>Existing debts: $280 student loans, $150 credit card</li>
                <li>Down payment: $2,500 saved</li>
                <li>Credit score: 680 (good) → 7.5% APR</li>
                <li>Desired term: 60 months</li>
              </ul>
              <p className="text-sm mb-2"><strong>Calculation:</strong> Target DTI = 36% × $3,500 = $1,260 max debts. Existing = $430. Available for car = $830/month. At 7.5% over 60 months, this supports a $42,000 loan. Add $2,500 down = $44,500 max price.</p>
              <p className="text-sm">
                <strong>Reality Check:</strong> This violates the 20/4/10 rule. Insurance for a 25-year-old costs $250/month. Fuel/maintenance: $200/month. Total transportation: $1,280/month (37% of income). Recommendation: Target $25,000 vehicle with $5,000 down, 48-month term, $450 payment.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 2: Mid-career buyer</h3>
              <p className="text-sm mb-2">Profile:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Age: 38, Income: $7,200/month ($86,400/year)</li>
                <li>Existing debts: $1,850 mortgage, $200 student loans</li>
                <li>Down payment: $10,000 cash + $8,000 trade-in = $18,000</li>
                <li>Credit score: 760 (excellent) → 5% APR</li>
                <li>Desired term: 48 months</li>
              </ul>
              <p className="text-sm mb-2"><strong>Calculation:</strong> Max debts = 36% × $7,200 = $2,592. Existing = $2,050. Available = $542/month. At 5% over 48 months, supports $23,400 loan. Add $18,000 down = $41,400 max price.</p>
              <p className="text-sm">
                <strong>Analysis:</strong> Follows 20/4/10 perfectly. Payment + insurance ($180) + fuel ($175) = $897 total (12.5% of income). Has room for financial goals. This buyer could afford up to $42,000 but chooses $38,000 vehicle, staying conservative. Smart move that preserves emergency fund and retirement contributions.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 3: High-income buyer with debt</h3>
              <p className="text-sm mb-2">Profile:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Age: 45, Income: $12,000/month ($144,000/year)</li>
                <li>Existing debts: $2,800 mortgage, $900 student loans, $400 credit cards, $600 second mortgage</li>
                <li>Down payment: $15,000 available</li>
                <li>Credit score: 720 → 6% APR</li>
              </ul>
              <p className="text-sm mb-2"><strong>Calculation:</strong> Max debts = 36% × $12,000 = $4,320. Existing = $4,700. DTI = 39.2% (already over!). Cannot afford additional car payment without reducing other debts.</p>
              <p className="text-sm">
                <strong>Lesson:</strong> High income doesn't guarantee affordability. This buyer must either pay off smaller debts ($400 credit cards) or refinance/consolidate before adding a car payment. Alternatively, paying cash from savings (if available) avoids increasing DTI.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 4: Retired buyer, fixed income</h3>
              <p className="text-sm mb-2">Profile:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Age: 68, Fixed income: $3,200/month (Social Security + pension)</li>
                <li>Existing debts: None (paid-off house)</li>
                <li>Savings: $75,000 available for cash purchase</li>
              </ul>
              <p className="text-sm mb-2"><strong>Calculation:</strong> With no debts, DTI allows up to $1,152/month (36%). But 10% rule suggests max $320/month for total transportation costs.</p>
              <p className="text-sm">
                <strong>Recommendation:</strong> Pay cash with $25,000 from savings, keeping $50,000 emergency fund. Eliminates payment, reduces insurance (no lender requirements), and preserves fixed income for living expenses. Many retirees over-purchase vehicles, depleting liquid savings.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-semibold mb-2">Example 5: Common mistake scenario</h3>
              <p className="text-sm text-red-600 font-medium mb-2">What NOT to Do:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
                <li>Income: $4,000/month, wants $35,000 vehicle</li>
                <li>Zero down payment, 84-month term, 12% APR (subprime credit)</li>
                <li>Monthly payment: $589</li>
              </ul>
              <p className="text-sm">
                <strong>Why This Fails:</strong> DTI jumps to 50%+ with existing debts. Total interest over 84 months: $14,476 (41% of vehicle price!). Will be underwater for 6+ years. Insurance costs extra due to higher coverage requirements. This scenario leads to default, repossession, and credit damage affecting future loan rates. Never accept 84-month terms.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Loan term comparison: True cost analysis</h2>
          
          <p className="text-base leading-relaxed mb-4">
            Many buyers focus exclusively on monthly payment amounts, making longer loan terms attractive. This table reveals the dramatic cost difference across loan terms for a $25,000 loan at various interest rates. Understanding these differences can help you make informed decisions about your financing options and avoid costly mistakes.
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Loan Term</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Monthly @ 5%</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Total Interest @ 5%</th>
                  <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">36 months</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$749</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-green-600 font-semibold">$1,954</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$26,954</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">48 months ✓</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$575</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-green-600 font-semibold">$2,625</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$27,625</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">60 months</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$472</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-yellow-600 font-semibold">$3,307</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$28,307</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">72 months</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$402</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-orange-600 font-semibold">$3,992</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$28,992</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-semibold">84 months ⚠️</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$351</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-red-600 font-semibold">$4,680</td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">$29,680</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-base leading-relaxed mt-4">
            Notice that stretching from 48 to 84 months saves only $224/month but costs an additional $2,055 in interest—nearly two extra months of payments. The 48-month term (marked ✓) offers the best balance of manageable payments and reasonable total cost. Terms beyond 60 months put buyers at high risk of negative equity.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently asked questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What is the 20/4/10 rule for car buying?</h3>
              <p className="text-base leading-relaxed">
                The 20/4/10 rule is a financial guideline recommending a 20% minimum down payment, maximum 4-year (48-month) loan term, and keeping total transportation costs under 10% of gross monthly income. For example, with $5,000 monthly income, your car payment, insurance, fuel, and maintenance combined shouldn't exceed $500/month. This conservative approach prevents buyers from becoming "car poor"—having expensive vehicles but insufficient funds for other financial goals like retirement savings or emergency funds.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How does my credit score affect car loan affordability?</h3>
              <p className="text-base leading-relaxed">
                Your credit score directly determines your interest rate, dramatically affecting affordability. Excellent credit (750+) qualifies for 4-6% APR, while fair credit (650-699) sees 8-12%, and poor credit (below 620) faces 15-20% or higher. On a $25,000 loan over 60 months, the difference between 5% and 15% APR is $164/month ($9,840 total over the life of the loan). Before car shopping, check your credit reports for errors, pay down credit card balances to below 30% utilization, and avoid new credit inquiries. Even a 50-point score increase can save thousands.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Should I buy new or used to maximize affordability?</h3>
              <p className="text-base leading-relaxed">
                Used vehicles 3-5 years old offer the best value, having absorbed 40-50% depreciation while retaining most useful life. A $35,000 new car becomes a $20,000 used car after 4 years, saving $15,000. Interest rates on used cars run 1-2% higher than new, but the lower principal more than compensates. Certified pre-owned (CPO) programs provide warranties similar to new cars while maintaining used-car pricing. However, heavily used vehicles (100,000+ miles) may require immediate repairs offsetting the purchase savings.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What if I'm offered 0% APR financing?</h3>
              <p className="text-base leading-relaxed">
                Zero-percent financing sounds attractive but often comes with tradeoffs. Manufacturers typically offer 0% APR OR cash rebates (e.g., $3,000 off), not both. Run the math: if the cash rebate exceeds the interest you'd pay at market rates, take the rebate and finance elsewhere. For example, a $3,000 rebate on a $30,000 purchase ($27,000 financed at 5% for 48 months) costs $2,829 in interest—you're $171 ahead taking the rebate. Additionally, 0% offers usually require excellent credit and may restrict loan terms to 36-48 months, limiting monthly payment reduction.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much should I put down on a car?</h3>
              <p className="text-base leading-relaxed">
                Aim for 20% minimum on new vehicles and 10% on used vehicles. Larger down payments reduce monthly obligations, lower interest charges, and prevent negative equity (owing more than the car's worth). For new cars depreciating 20% in year one, a 20% down payment keeps you above water if you need to sell or trade early. If you can't afford 20% down, either save longer or purchase a less expensive vehicle. Never drain your emergency fund for a down payment—maintain 3-6 months of expenses in liquid savings.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What is negative equity and how do I avoid it?</h3>
              <p className="text-base leading-relaxed">
                Negative equity (being "upside down" or "underwater") occurs when your loan balance exceeds your vehicle's market value. This happens through inadequate down payments, long loan terms, and rapid depreciation. If you owe $22,000 but your car is worth $18,000, you have $4,000 negative equity. This becomes problematic if the car is totaled (insurance pays only market value, leaving you $4,000 short), or if you need to trade it in (the negative equity rolls into your new loan, starting the cycle again). Avoid it with 20% down, 48-month terms, and gap insurance for the first 2-3 years.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Should I lease instead of buy?</h3>
              <p className="text-base leading-relaxed">
                Leasing offers lower monthly payments (typically 30-40% less than buying) but leaves you with no asset at term end. It makes financial sense if you drive under 12,000 miles annually, want a new car every 3 years, and can deduct the expense for business use. However, over 10 years, leasing costs significantly more than buying and keeping a vehicle long-term. Calculate your total 10-year transportation costs under both scenarios. Most financial advisors recommend buying used and driving vehicles 10-15 years for maximum financial efficiency.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Can I afford a car if I have student loans?</h3>
              <p className="text-base leading-relaxed">
                Yes, but with caution. Student loans count toward your debt-to-income ratio, reducing your available car loan capacity. With $400/month student loan payments and $5,000 income, you've already used 8% of your DTI (target 36% total). This leaves room for a $1,400 monthly housing payment plus $400 car payment—tight but manageable. Prioritize paying down student loans aggressively before upgrading vehicles. Consider income-driven repayment plans to lower monthly obligations temporarily, freeing cash for a modest car purchase.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What's the difference between APR and interest rate?</h3>
              <p className="text-base leading-relaxed">
                The interest rate is the cost of borrowing the principal. APR (Annual Percentage Rate) includes the interest rate PLUS loan fees, dealer fees, and other costs, expressed as a yearly rate. A loan might have a 5.5% interest rate but a 6.1% APR once $500 in fees are factored in. Always compare APRs when shopping loans, as they reveal the true cost. Federal law requires lenders to disclose APR, making it the standard comparison metric.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Is a co-signer a good idea?</h3>
              <p className="text-base leading-relaxed">
                A co-signer with strong credit can help you qualify for lower rates or larger loan amounts, but it comes with significant risks for the co-signer. They become equally responsible for the debt—if you miss payments, it damages their credit and lenders can pursue them for the full balance. Many family relationships have been destroyed over co-signed loans. If you need a co-signer, it signals you're stretching beyond your affordability. Consider a less expensive vehicle you can qualify for independently.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How do I negotiate the best car price?</h3>
              <p className="text-base leading-relaxed">
                Research fair market value using Kelley Blue Book, Edmunds, and TrueCar before visiting dealerships. Get quotes from at least three dealers. Focus negotiations on the total purchase price (out-the-door price), not monthly payments—dealers manipulate terms and down payments to hit monthly targets while inflating total cost. Be prepared to walk away if numbers don't align with your calculated affordability. Shop for financing separately through banks or credit unions to compare against dealer financing. Never mention your trade-in until the new vehicle price is negotiated.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">What are dealer add-ons and should I buy them?</h3>
              <p className="text-base leading-relaxed">
                Common dealer add-ons include extended warranties ($1,500-$3,000), gap insurance ($500-$700), paint protection ($500-$1,500), and fabric protection ($200-$500). Most are high-profit items for dealers. Extended warranties rarely pay for themselves—Consumer Reports found only 55% of buyers use them, recovering an average of $837 on a $1,200 warranty. Gap insurance is valuable only if you put less than 20% down. Buy it from your auto insurer for $20-$40/year instead of $500-$700 from the dealer. Decline most dealer add-ons and negotiate them out of the price.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">When is the best time to buy a car?</h3>
              <p className="text-base leading-relaxed">
                Month-end and quarter-end periods see aggressive sales as dealers chase quotas. December is traditionally the best month, particularly the last week, as dealers clear inventory for new model years. Labor Day weekend, Memorial Day, and Black Friday also feature promotions. However, chasing seasonal deals shouldn't override the fundamental question: can you afford this vehicle given your financial picture? A $3,000 discount on a $35,000 car you can't afford is still a poor financial decision. Prioritize affordability over timing.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Should I pay off my car loan early?</h3>
              <p className="text-base leading-relaxed">
                If your interest rate exceeds 6%, prioritize paying off the car loan early to save on interest charges. However, if you have a low rate (3-4%), you may benefit more from investing extra payments in retirement accounts earning 7-10% average annual returns. Check for prepayment penalties (rare but existent) in your loan agreement. An optimal strategy: pay an extra half-payment monthly (13 payments annually instead of 12), shaving 1-2 years off the term without significantly impacting monthly cash flow.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">How much will insurance cost for my new car?</h3>
              <p className="text-base leading-relaxed">
                Insurance costs vary by vehicle make/model, location, age, driving record, and coverage levels. Sports cars and luxury vehicles cost 40-60% more to insure than sedans. Get insurance quotes BEFORE finalizing a purchase—some vehicles that fit your budget have prohibitively expensive insurance. National averages: $1,771/year for full coverage ($148/month), but urban areas and high-risk zip codes see $2,500-$3,500/year. Young drivers under 25 pay double or triple. Maintain good credit, bundle with home insurance, and increase deductibles to lower premiums.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">References and sources</h2>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Consumer Financial Protection Bureau (CFPB) - Auto Loans: Consumer Guide, 2024</li>
            <li>Experian - State of the Automotive Finance Market Report, Q4 2024</li>
            <li>American Automobile Association (AAA) - Your Driving Costs Study, 2024</li>
            <li>U.S. Bureau of Labor Statistics - Consumer Expenditure Survey, 2023</li>
            <li>Federal Reserve - Survey of Consumer Finances, 2024</li>
            <li>Kelley Blue Book - Fair Market Value Guidelines, 2025</li>
            <li>Edmunds.com - True Cost to Own Methodology, 2024</li>
            <li>Consumer Reports - Extended Warranty Study, 2023</li>
          </ul>
        </section>
      </div>}
      widget={<div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Gross Income</Label>
            <Input
              id="monthlyIncome"
              type="number"
              value={inputs.monthlyIncome}
              onChange={(e) => setInputs(prev => ({ ...prev, monthlyIncome: e.target.value }))}
              placeholder="5000"
            />
            <p className="text-xs text-muted-foreground">Your pre-tax monthly income</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="existingDebts">Existing Monthly Debts</Label>
            <Input
              id="existingDebts"
              type="number"
              value={inputs.existingDebts}
              onChange={(e) => setInputs(prev => ({ ...prev, existingDebts: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 1200"
            />
            <p className="text-xs text-muted-foreground">Mortgage, student loans, credit cards, etc.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="downPayment">Down Payment Available</Label>
            <Input
              id="downPayment"
              type="number"
              value={inputs.downPayment}
              onChange={(e) => setInputs(prev => ({ ...prev, downPayment: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 5000"
            />
            <p className="text-xs text-muted-foreground">Cash + trade-in value</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="loanTerm">Loan Term (months)</Label>
            <Input
              id="loanTerm"
              type="number"
              value={inputs.loanTerm}
              onChange={(e) => setInputs(prev => ({ ...prev, loanTerm: parseFloat(e.target.value) || 48 }))}
              placeholder="e.g., 48"
            />
            <p className="text-xs text-muted-foreground">Recommended: 48 months or less</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              value={inputs.interestRate}
              onChange={(e) => setInputs(prev => ({ ...prev, interestRate: parseFloat(e.target.value) || 0 }))}
              placeholder="e.g., 6.5"
            />
            <p className="text-xs text-muted-foreground">Based on your credit score</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="calculate" className="flex-1">Calculate</Button>
            <Button variant="reset" onClick={() => setInputs({ monthlyIncome: "", existingDebts: "", downPayment: "", loanTerm: "", interestRate: "" })}>Reset</Button>
          </div>
          
          <div className="space-y-3 pt-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Maximum Affordable Car Price</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(results.maxCarPrice)}</p>
            </div>
            
            <div className="p-3 bg-secondary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Recommended Monthly Payment</p>
              <p className="text-2xl font-semibold">{formatCurrency(results.monthlyPayment)}</p>
            </div>
            
            <div className="p-3 bg-secondary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Maximum Loan Amount</p>
              <p className="text-xl font-semibold">{formatCurrency(results.maxLoanAmount)}</p>
            </div>
            
            <div className="p-3 bg-secondary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Interest Paid</p>
              <p className="text-xl font-semibold">{formatCurrency(results.totalInterest)}</p>
            </div>
            
            <div className="p-3 bg-secondary/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Debt-to-Income Ratio</p>
              <p className="text-xl font-semibold">{results.dtiRatio}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {results.dtiRatio <= 36 ? "✓ Within recommended range" : "⚠ Above recommended 36%"}
              </p>
            </div>
          </div>
        </div>
      </div>}
      railRight={null}
    />
  );
}