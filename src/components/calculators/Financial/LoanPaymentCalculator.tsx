import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoanPaymentCalculator() {
  const [inputs, setInputs] = useState({
    loanAmount: "",
    interestRate: "",
    loanTerm: "",
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const principal = parseFloat(inputs.loanAmount) || 0;
    const annualRate = parseFloat(inputs.interestRate) || 0;
    const months = parseFloat(inputs.loanTerm) || 0;

    if (principal === 0 || annualRate === 0 || months === 0) {
      return {
        monthlyPayment: null,
        totalPayment: null,
        totalInterest: null,
        principalPercent: 0,
        interestPercent: 0,
      };
    }

    const monthlyRate = annualRate / 100 / 12;
    
    // Monthly payment formula: P * [r(1+r)^n] / [(1+r)^n - 1]
    const monthlyPayment = 
      principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;
    const principalPercent = (principal / totalPayment) * 100;
    const interestPercent = (totalInterest / totalPayment) * 100;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      principalPercent,
      interestPercent,
    };
  }, [inputs]);

  const formatCurrency = (value: number | null) => {
    if (value === null) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleCalculate = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        const resultsElement = resultsRef.current;
        const rect = resultsElement.getBoundingClientRect();
        const resultsHeight = resultsElement.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        
        let targetScroll;
        if (resultsHeight > viewportHeight - 200) {
          targetScroll = elementTop - 120;
        } else {
          targetScroll = elementTop - ((viewportHeight - resultsHeight) / 3);
        }
        
        window.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: "smooth"
        });
      }
    }, 100);
  };

  const handleReset = () => {
    setInputs({
      loanAmount: "",
      interestRate: "",
      loanTerm: "",
    });
  };

  return (
    <CalculatorVerticalLayout
      title="Loan Payment Calculator"
      maxWidth={1200}
      gap={32}
      showTopBanner
      editorial={
        <div className="skn-editorial">
          <section className="mb-6">
            <p className="text-base leading-relaxed mb-4">
              Need to calculate your monthly loan payment? Whether you're considering a mortgage, auto loan, personal loan, or student loan, understanding your monthly payment obligations is crucial for financial planning. Our loan payment calculator provides instant, accurate calculations to help you make informed borrowing decisions. According to the Federal Reserve's 2024 Consumer Credit report, the average American carries $104,215 in debt across mortgages, auto loans, credit cards, and student loans, making payment planning essential.
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              This calculator uses the standard amortization formula to determine your exact monthly payment based on loan amount (principal), annual interest rate (APR), and loan term in months. Beyond the basic monthly payment, we show you the total amount you'll pay over the life of the loan, total interest charges, and the percentage split between principal and interest. This comprehensive view helps you understand the true cost of borrowing and identify opportunities to save thousands in interest charges.
            </p>
            
            <p className="mb-3">In this calculator and comprehensive guide, we will explain:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>How loan payment calculations work using the amortization formula</li>
              <li>The impact of interest rates on your total loan cost</li>
              <li>How loan term length affects monthly payments and total interest</li>
              <li>Strategies to reduce interest charges and pay off loans faster</li>
              <li>The difference between fixed and variable rate loans</li>
              <li>How to compare loan offers effectively</li>
              <li>Real-world examples across different loan amounts and terms</li>
            </ul>
            
            <p className="text-base leading-relaxed">
              For mortgage-specific calculations including property taxes and insurance, try our <a href="/financial/mortgage-calculator" className="text-blue-600 hover:underline">Mortgage Calculator</a>. If you're buying a car, use our <a href="/financial/car-loan-affordability" className="text-blue-600 hover:underline">Car Loan Affordability Calculator</a>. To understand how much you can borrow, check our <a href="/financial/debt-to-income" className="text-blue-600 hover:underline">Debt-to-Income Calculator</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How does the loan payment calculation work?</h2>
            
            <p className="text-base leading-relaxed mb-4">
              Loan payments are calculated using an amortization formula that ensures you pay off both principal and interest over a fixed period through equal monthly installments. The formula accounts for compound interest, meaning interest accrues on the remaining balance each month. Early in the loan term, a larger portion of your payment goes toward interest; as the principal decreases, more of each payment reduces the loan balance.
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              The mathematical formula is: M = P × [r(1+r)^n] / [(1+r)^n - 1], where M is the monthly payment, P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12), and n is the number of monthly payments. For example, a $200,000 loan at 6.5% APR for 30 years (360 months) calculates as: Monthly rate = 6.5% / 12 = 0.00541667. The formula yields a monthly payment of $1,264.14.
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              Understanding this calculation is crucial because small changes in any variable create significant long-term impacts. Reducing the interest rate by just 0.5% on that $200,000 mortgage (from 6.5% to 6.0%) saves $40 per month and $14,400 over 30 years. Similarly, choosing a 15-year term instead of 30 years increases the monthly payment to $1,743.81 but saves $142,745 in total interest—the loan costs $313,886 over 30 years versus $171,141 over 15 years.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to use the loan payment calculator</h2>
            
            <p className="text-base leading-relaxed mb-4">
              Our calculator requires three essential inputs to compute your loan payment. Gather your loan documentation or offer letter for accurate figures. The calculation takes seconds once you input these values, providing instant insight into your payment obligations and total loan cost.
            </p>
            
            <p className="text-base leading-relaxed mb-3">Here's what each input means and how to determine it:</p>
            
            <div className="space-y-4 mb-4">
              <p className="text-base leading-relaxed">
                <strong>Loan Amount (Principal):</strong> The total amount you're borrowing before interest. For mortgages, this is the home price minus your down payment. For a $300,000 house with a 20% down payment ($60,000), your loan amount is $240,000. For auto loans, it's the vehicle price minus down payment and trade-in value. For personal loans, it's the amount the lender disburses to you.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Annual Interest Rate (APR):</strong> Your yearly interest rate as a percentage. This appears prominently in loan offers and disclosure documents. Do not confuse APR with APY (Annual Percentage Yield)—use APR for this calculator. Mortgage rates in late 2024 range from 6.0% to 7.5% depending on credit score and loan type. Auto loans range from 4% (excellent credit) to 12% (fair credit). Personal loans span 6% to 36% based on creditworthiness.
              </p>
              
              <p className="text-base leading-relaxed">
                <strong>Loan Term (months):</strong> The repayment period in months. Common mortgage terms are 360 months (30 years) or 180 months (15 years). Auto loans typically run 36, 48, 60, or 72 months. Personal loans range from 12 to 84 months. Longer terms mean lower monthly payments but significantly higher total interest charges. A $25,000 auto loan at 6% costs $2,625 in interest over 36 months versus $4,906 over 72 months—nearly double.
              </p>
            </div>
            
            <p className="text-base leading-relaxed mb-4">
              After entering these values, click Calculate and the page will scroll to display your results. You'll see your monthly payment amount, total amount paid over the loan life, total interest charges, and the percentage breakdown of principal versus interest. Use these figures to compare different loan scenarios—try adjusting the term length or interest rate to see how your payment and total cost change.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How can I reduce my loan interest charges?</h2>
            
            <p className="text-base leading-relaxed mb-4">
              The single most effective strategy is making extra principal payments. Every dollar paid beyond your required monthly payment directly reduces the loan balance, which decreases future interest charges since interest is calculated on the remaining balance. On a $200,000 mortgage at 6.5% for 30 years, adding just $100 to each monthly payment saves $39,760 in interest and shortens the loan by 4 years and 11 months.
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              Refinancing to a lower interest rate can yield substantial savings if rates have dropped since you borrowed or your credit score has improved significantly. Refinancing that same $200,000 mortgage from 6.5% to 5.5% after 5 years saves approximately $180 per month and $64,800 over the remaining 25 years. However, factor in refinancing costs (typically 2-5% of the loan amount or $4,000-$10,000 on a $200,000 loan). The savings must exceed these costs to make refinancing worthwhile.
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              Bi-weekly payment strategies effectively add one extra monthly payment per year. Instead of 12 monthly payments, you make 26 half-payments (52 weeks / 2). This approach pays off a 30-year mortgage in about 25-26 years and saves significant interest. The same $200,000 mortgage paid bi-weekly saves approximately $34,000 in interest and retires the loan 4-5 years early. Some lenders charge fees for bi-weekly payment plans; alternatively, manually add 1/12 of your monthly payment to each regular payment to achieve similar results without fees.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What is the difference between fixed and variable rate loans?</h2>
            
            <p className="text-base leading-relaxed mb-4">
              Fixed-rate loans maintain the same interest rate for the entire loan term, providing payment predictability and protection against rate increases. Your monthly payment never changes, making budgeting straightforward. This stability is valuable in rising interest rate environments. Most conventional mortgages, many auto loans, and some personal loans offer fixed rates. The downside is that if market rates drop, you're locked into the higher rate unless you refinance.
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              Variable-rate loans (also called adjustable-rate or floating-rate loans) have interest rates that fluctuate based on a benchmark index like the Prime Rate or LIBOR. Initial rates on adjustable-rate mortgages (ARMs) are typically 0.5-1.5% lower than comparable fixed-rate mortgages, offering lower initial payments. However, after the initial fixed period (commonly 5, 7, or 10 years), the rate adjusts periodically—usually annually—based on market conditions plus a margin (typically 2-3%).
            </p>
            
            <p className="text-base leading-relaxed mb-4">
              ARMs include caps limiting how much the rate can increase: per-adjustment caps (typically 2%), lifetime caps (typically 5-6% above the initial rate), and sometimes initial adjustment caps. A 5/1 ARM starting at 5.5% with a 2/2/6 cap structure means: 5 years at the initial rate, annual adjustments thereafter, maximum 2% increase per adjustment, maximum 2% decrease per adjustment, maximum lifetime rate of 11.5% (5.5% + 6%). In a rising rate environment, this loan could reach 9.5% in year 7, dramatically increasing payments. Choose fixed rates for long-term holdings and payment certainty; consider ARMs only if you plan to sell or refinance before the adjustment period or if you're confident rates will remain stable or decline.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Frequently asked questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">What is an amortization schedule?</h3>
                <p className="text-base leading-relaxed">
                  An amortization schedule is a detailed table showing every payment over the loan's life, breaking down how much goes toward principal versus interest each month. Early payments consist mostly of interest; the principal portion gradually increases over time. For a $200,000 30-year mortgage at 6.5%, the first payment includes $1,083.33 interest and just $180.81 principal. The final payment is nearly reversed: $6.84 interest and $1,257.30 principal.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Should I choose a 15-year or 30-year mortgage?</h3>
                <p className="text-base leading-relaxed">
                  The decision depends on your financial situation and goals. A 15-year mortgage has higher monthly payments but saves massive amounts in interest and builds equity faster. On $200,000 at 6.0%, the 30-year payment is $1,199 versus $1,688 for 15 years—a $489 monthly difference. However, the 30-year loan costs $431,640 total versus $303,840 for 15 years, a $127,800 difference in interest. Choose 15 years if you can comfortably afford the higher payment and want to own your home faster. Choose 30 years if you need lower monthly obligations or want flexibility to invest the payment difference elsewhere.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How does my credit score affect my loan payment?</h3>
                <p className="text-base leading-relaxed">
                  Credit scores directly determine your interest rate, which dramatically impacts your payment and total cost. On a $250,000 30-year mortgage, excellent credit (760+) might qualify for 6.0% ($1,499/month), while fair credit (650-679) faces 7.2% ($1,700/month)—a $201 monthly difference or $72,360 over 30 years. Before applying for major loans, check your credit reports for errors, pay down credit card balances below 30% utilization, and avoid new credit inquiries. Even a 50-point score improvement can save tens of thousands.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">What happens if I pay off my loan early?</h3>
                <p className="text-base leading-relaxed">
                  Paying off loans early saves substantial interest, especially on long-term loans where interest comprises the majority of early payments. A $200,000 30-year mortgage at 6.5% costs $255,094 in interest. Paying it off in 20 years instead (via extra payments) saves $84,682 in interest. However, check for prepayment penalties—some lenders charge fees (typically 2-5% of the remaining balance) if you pay off within the first 3-5 years. Most mortgages and auto loans today don't have prepayment penalties, but personal loans sometimes do. Review your loan documents or ask your lender before making large extra payments.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Can I deduct loan interest on my taxes?</h3>
                <p className="text-base leading-relaxed">
                  Mortgage interest is deductible on your primary residence and one second home for loans up to $750,000 ($375,000 if married filing separately) taken out after December 15, 2017. For loans originated before this date, the limit is $1 million ($500,000 married filing separately). Student loan interest up to $2,500 is deductible if you meet income requirements. Auto loan and personal loan interest are generally not tax-deductible unless used for business purposes. Home equity loan interest is deductible only if used to buy, build, or substantially improve your home. Consult a tax professional for your specific situation.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">What is the difference between APR and interest rate?</h3>
                <p className="text-base leading-relaxed">
                  The interest rate is the cost of borrowing expressed as a yearly percentage of the loan amount. APR (Annual Percentage Rate) includes the interest rate plus additional costs like origination fees, discount points, and mortgage insurance, expressed as a yearly rate. APR is always higher than the interest rate and provides a more accurate picture of the loan's true cost. For example, a mortgage might have a 6.0% interest rate but a 6.25% APR once fees are factored in. Use APR to compare loan offers—a lower interest rate with high fees might have a higher APR than a slightly higher interest rate with minimal fees.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Should I consolidate multiple loans?</h3>
                <p className="text-base leading-relaxed">
                  Consolidation can simplify payments and potentially reduce interest costs, but requires careful analysis. Federal student loan consolidation maintains government protections and doesn't reduce your interest rate (it's the weighted average of your current loans). Private consolidation (refinancing) can lower your rate if your credit has improved but eliminates federal benefits like income-driven repayment and forgiveness options. Credit card consolidation via personal loan typically saves money if you qualify for rates below 12-15%. Avoid consolidating secured debt (mortgage, auto) with unsecured debt (credit cards) as you risk losing your home or car if unable to repay.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">What is a good debt-to-income ratio?</h3>
                <p className="text-base leading-relaxed">
                  Lenders use your debt-to-income (DTI) ratio to assess loan approval and terms. DTI is your total monthly debt payments divided by gross monthly income. Mortgage lenders prefer DTI below 43%, with 36% or lower qualifying for best rates. Front-end ratio (housing costs only) should stay below 28%. For example, with $6,000 monthly gross income, total debts shouldn't exceed $2,580 (43%) and housing costs should stay under $1,680 (28%). To improve DTI, increase income, pay down debts, or reduce housing cost targets.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">When should I consider refinancing?</h3>
                <p className="text-base leading-relaxed">
                  Refinance when you can reduce your interest rate by at least 0.5-1.0%, your credit score has improved by 50+ points, you want to switch from adjustable to fixed rate, or you need to change the loan term. Calculate the break-even point: divide refinancing costs by monthly savings. If costs are $4,000 and you save $200/month, you break even in 20 months. Refinancing makes sense if you plan to keep the loan beyond this point. Also consider cash-out refinancing to access home equity at lower rates than credit cards or personal loans, but avoid using it for consumables or vacations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">How does loan term affect total cost?</h3>
                <p className="text-base leading-relaxed">
                  Longer terms mean lower monthly payments but significantly higher total interest charges. A $25,000 auto loan at 6% costs $483/month for 60 months with $3,980 total interest. The same loan over 36 months costs $761/month but only $2,396 total interest—saving $1,584 despite the $278 higher payment. Similarly, a $200,000 mortgage at 6% for 30 years costs $1,199/month and $231,676 in interest. At 15 years, it's $1,688/month but only $103,788 in interest—saving $127,888. Choose shorter terms if you can afford higher payments and want to minimize interest costs and build equity faster.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">References and sources</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Federal Reserve - Consumer Credit Report, 2024</li>
              <li>Consumer Financial Protection Bureau (CFPB) - Loan Estimate Explainer, 2024</li>
              <li>Freddie Mac - Primary Mortgage Market Survey, 2024</li>
              <li>U.S. Department of Housing and Urban Development - Mortgage Insurance Guide, 2024</li>
              <li>Internal Revenue Service (IRS) - Publication 936: Home Mortgage Interest Deduction, 2024</li>
              <li>Experian - State of the Automotive Finance Market Report, Q4 2024</li>
              <li>Federal Student Aid - Loan Consolidation Information, 2024</li>
              <li>National Foundation for Credit Counseling - Debt Management Guidelines, 2024</li>
            </ul>
          </section>
        </div>
      }
      widget={
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount (Principal)</Label>
              <Input
                id="loanAmount"
                type="number"
                value={inputs.loanAmount}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, loanAmount: e.target.value }))
                }
                placeholder="e.g., 200000"
              />
              <p className="text-xs text-muted-foreground">Total amount you're borrowing</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                value={inputs.interestRate}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, interestRate: e.target.value }))
                }
                placeholder="e.g., 6.5"
              />
              <p className="text-xs text-muted-foreground">APR from your loan offer</p>
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
                placeholder="e.g., 360 (30 years)"
              />
              <p className="text-xs text-muted-foreground">
                Common: 360 (30yr), 180 (15yr), 60 (5yr)
              </p>
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
                  Monthly Payment
                </p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(results.monthlyPayment)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Amount Paid
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(results.totalPayment)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(results.totalInterest)}
                </p>
              </div>

              <div className="p-3 bg-secondary/5 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Payment Breakdown</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Principal:</span>
                    <span className="font-semibold">{results.principalPercent.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interest:</span>
                    <span className="font-semibold">{results.interestPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
