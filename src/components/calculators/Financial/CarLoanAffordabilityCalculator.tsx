import { useState, useMemo, useRef } from "react";
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

  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const income = parseFloat(inputs.monthlyIncome) || 0;
    const debts = parseFloat(inputs.existingDebts) || 0;
    const down = parseFloat(inputs.downPayment) || 0;
    const term = parseFloat(inputs.loanTerm) || 48;
    const rate = parseFloat(inputs.interestRate) || 0;

    if (income === 0 || rate === 0 || term === 0) {
      return {
        maxCarPrice: null,
        monthlyPayment: null,
        maxLoanAmount: null,
        totalInterest: null,
        dtiRatio: "NaN",
      };
    }

    const maxDebts = income * 0.36;
    const availableForCar = maxDebts - debts;

    if (availableForCar <= 0) {
      return {
        maxCarPrice: 0,
        monthlyPayment: 0,
        maxLoanAmount: 0,
        totalInterest: 0,
        dtiRatio: ((debts / income) * 100).toFixed(1),
      };
    }

    const monthlyRate = rate / 100 / 12;
    const numPayments = term;

    const pvFactor =
      (Math.pow(1 + monthlyRate, numPayments) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

    const maxLoan = availableForCar * pvFactor;
    const maxPrice = maxLoan + down;
    const totalPaid = availableForCar * numPayments;
    const totalInterest = totalPaid - maxLoan;
    const dti = (((debts + availableForCar) / income) * 100).toFixed(1);

    return {
      maxCarPrice: maxPrice,
      monthlyPayment: availableForCar,
      maxLoanAmount: maxLoan,
      totalInterest: totalInterest > 0 ? totalInterest : 0,
      dtiRatio: dti,
    };
  }, [inputs]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return "$NaN";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleCalculate = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        const rect = resultsRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = rect.top + scrollTop - 100;
        
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  const handleReset = () => {
    setInputs({
      monthlyIncome: "",
      existingDebts: "",
      downPayment: "",
      loanTerm: "",
      interestRate: "",
    });
  };

  return (
    <CalculatorUnifiedLayout
      title="Car Loan Affordability Calculator"
      stickyTopPx={120}
      maxWidth={1200}
      gap={32}
      showTopBanner
      editorial={
        <div className="skn-editorial">
          <section className="mb-6">
            <p className="text-base leading-relaxed mb-4">
              Are you wondering how much car you can afford based on your income and existing debts? Understanding your car loan affordability is crucial to avoid financial strain and ensure you make a sound investment. With rising vehicle prices, knowing your limits can save you from future financial headaches. According to Experian's Q4 2024 report, the average new car loan is $40,855 with a monthly payment of $738, and nearly 30% of car buyers regret their purchase due to financial overreach.
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              Our calculator goes beyond simple payment estimates by analyzing your complete financial picture. It considers your gross monthly income, existing debt obligations including mortgage, student loans and credit cards, down payment capacity, and trade-in value to determine a realistic vehicle price range. Financial experts universally recommend keeping total debt payments below 36% of gross income, with transportation costs not exceeding 20% of take-home pay.
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
              Alternative approaches exist for different circumstances. The 40% rule suggests that your vehicle purchase price should not exceed 40% of your annual gross income. For a $60,000 salary, this yields a $24,000 maximum vehicle price. This rule works well for cash buyers or those with minimal other debts. However, it can be dangerous for buyers who finance the full amount over extended terms, as interest charges can add $5,000-$10,000 to the total cost.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to use the car loan affordability calculator</h2>
            
            <p className="text-base leading-relaxed mb-4">
              Our calculator requires five key inputs to determine your affordable car price range. Accuracy is important—use actual figures rather than estimates. Gather your latest pay stub for income verification, list all monthly debt obligations (minimum payments on credit cards, student loans, personal loans), and check current auto loan rates for your credit tier. The entire process takes about 3 minutes.
            </p>
            
            <p className="text-base leading-relaxed mb-3">Here's what each input means and how to determine it accurately:</p>
            
            <div className="space-y-4 mb-4">
              <p className="text-base leading-relaxed">
                <strong>Monthly Gross Income:</strong> Your total income before taxes and deductions. Include salary, bonuses, commissions, and any regular side income. For hourly workers, multiply your hourly rate by hours per week, then by 4.33. For example, $25/hour × 40 hours × 4.33 = $4,330 monthly. Salaried workers divide annual salary by 12. Don't use take-home pay—lenders evaluate based on gross income.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Existing Monthly Debts:</strong> Sum all minimum required payments: mortgage/rent ($1,200), student loans ($350), credit cards ($150), personal loans ($200), etc. Include only obligations that appear on your credit report. Exclude utilities, groceries, and discretionary spending. This figure directly reduces your available car budget.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Down Payment Available:</strong> Cash you can apply immediately to the purchase. Ideally 20% of the vehicle price. For a $25,000 car, that's $5,000. Larger down payments reduce monthly payments and interest costs. If you're trading in a vehicle, add its estimated value here. Use Kelley Blue Book or Edmunds for accurate trade-in values.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Loan Term (months):</strong> The repayment period. Common terms are 36, 48, 60, and 72 months. Longer terms mean lower monthly payments but higher total interest. A $20,000 loan at 6% costs $3,199 in interest over 72 months versus $1,275 over 36 months—a $1,924 difference. We recommend 48 months maximum.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Interest Rate (APR):</strong> Your annual percentage rate depends on credit score. Excellent credit (750+): 4-5%. Good credit (700-749): 5-7%. Fair credit (650-699): 7-12%. Poor credit (below 650): 12-18% or higher. Check Bankrate or your bank for current rates. A 2% rate difference on a $25,000 loan costs $1,500 extra over 60 months.
              </p>
            </div>
            
            <p className="text-base leading-relaxed mb-4">
              After entering these values, the calculator instantly displays your maximum affordable car price, recommended monthly payment, total loan amount, and total interest paid over the loan term. It also shows your debt-to-income ratio and whether it falls within recommended guidelines. Use these results as a starting point for negotiation—dealers often try to focus on monthly payments alone, obscuring the total cost. Armed with this information, you can confidently reject deals that exceed your calculated affordability range.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What are the best practices for car loan affordability?</h2>
            
            <p className="text-base leading-relaxed mb-4">
              Financial advisors nearly universally recommend the 20/4/10 rule as the gold standard for car buying. This framework emerged from decades of consumer lending data showing that buyers who follow it rarely experience payment distress or default. The 20% down payment requirement serves multiple purposes: it demonstrates financial discipline, reduces the loan-to-value ratio (protecting you from being underwater), and lowers monthly payments by $50-$75 per $5,000 down.
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              The 4-year (48-month) maximum term might seem restrictive when dealerships routinely offer 72 or even 84-month loans. However, longer terms create significant risks. First, you'll likely owe more than the car is worth for most of the loan period due to rapid depreciation—new cars lose 20% of value in year one and 15% in year two. Second, interest charges accumulate substantially. A $30,000 loan at 6% APR costs $2,000 in interest over 48 months but $4,000 over 72 months. Third, you're locked into an aging vehicle with increasing maintenance costs while still making payments. Cars typically need major repairs (timing belts, transmissions, suspensions) around 100,000 miles—often before a 72-month loan ends.
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              The 10% rule for total transportation costs is where many buyers miscalculate. They focus solely on the monthly payment, forgetting that insurance averages $150-$200/month, fuel costs $150-$250/month (depending on commute and vehicle efficiency), and maintenance/repairs average $100/month according to AAA's 2024 study. That's $400-$550 in additional costs beyond the payment. For someone earning $5,000/month gross, 10% is $500 total—leaving just $50-$150 for the actual car payment, which supports a minimal loan amount.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What are the hidden costs of car ownership?</h2>
            
            <p className="text-base leading-relaxed mb-4">
              The sticker price and monthly payment represent only a fraction of a vehicle's true cost. According to AAA's 2024 'Your Driving Costs' study, the average cost to own and operate a new vehicle is $10,728 per year, or $894 per month. This figure shocked even financial professionals when published. For buyers focusing solely on a $400 car payment, the reality of an additional $494 in monthly costs creates significant budget strain.
            </p>
            
            <p className="text-base leading-relaxed mb-3">Here are the major categories that inflate total ownership costs:</p>
            
            <div className="space-y-3 mb-4">
              <p className="text-base leading-relaxed">
                <strong>Insurance:</strong> Averages $1,895 annually ($158/month) nationally, but varies dramatically by location, vehicle type, age, and driving record. Urban areas and states like Michigan, Louisiana, and Florida see premiums of $2,500-$3,500/year. Sports cars and luxury vehicles cost 40-70% more to insure than sedans. Young drivers (under 25) pay double or triple these amounts.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Fuel Costs:</strong> At $3.50/gallon and 15,000 miles driven annually, a 25-MPG vehicle consumes 600 gallons ($2,100/year or $175/month). A 15-MPG truck or SUV costs $3,500 annually ($292/month). Electric vehicles average $600-$800/year in electricity, saving $1,300-$2,700 annually but requiring higher upfront costs.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Maintenance and Repairs:</strong> Routine maintenance (oil changes, tire rotations, filter replacements) costs $800-$1,200 annually. Factor in occasional tire replacements ($600-$1,000 every 4-5 years), brake service ($300-$800 every 2-3 years), and unexpected repairs. AAA estimates $1,186/year average, or $99/month.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Registration and Fees:</strong> Annual registration fees vary by state from $30 (Alaska) to $700+ (California for expensive vehicles). Many states charge based on vehicle value or weight. Add inspection fees ($15-$50) and personal property taxes in some states ($100-$600 annually).
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Depreciation:</strong> The single largest cost of vehicle ownership. New cars lose 20-30% of value in year one, 15% in year two, and 10-12% annually thereafter. A $35,000 new car is worth $24,500 after one year—a $10,500 loss ($875/month) even if you never drove it. This hidden cost doesn't affect your monthly cash flow but destroys wealth.
              </p>
            </div>
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
        </div>
      }
      widget={
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Gross Income</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={inputs.monthlyIncome}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, monthlyIncome: e.target.value }))
                }
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
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, existingDebts: e.target.value }))
                }
                placeholder="e.g., 1200"
              />
              <p className="text-xs text-muted-foreground">
                Mortgage, student loans, credit cards, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment Available</Label>
              <Input
                id="downPayment"
                type="number"
                value={inputs.downPayment}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, downPayment: e.target.value }))
                }
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
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, loanTerm: e.target.value }))
                }
                placeholder="e.g., 48"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 48 months or less
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={inputs.interestRate}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, interestRate: e.target.value }))
                }
                placeholder="e.g., 6.5"
              />
              <p className="text-xs text-muted-foreground">Based on your credit score</p>
            </div>

            <div className="flex gap-2">
              <Button variant="calculate" className="flex-1" onClick={handleCalculate}>
                Calculate
              </Button>
              <Button variant="reset" onClick={handleReset}>
                Reset
              </Button>
            </div>

            <div ref={resultsRef} className="space-y-3 pt-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Maximum Affordable Car Price
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(results.maxCarPrice)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Recommended Monthly Payment
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(results.monthlyPayment)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Maximum Loan Amount</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(results.maxLoanAmount)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Interest Paid</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(results.totalInterest)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Debt-to-Income Ratio</p>
                <p className="text-xl font-semibold">{results.dtiRatio}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {parseFloat(results.dtiRatio) <= 36
                    ? "✓ Within recommended range"
                    : "⚠ Above recommended 36%"}
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      railRight={null}
    />
  );
}
