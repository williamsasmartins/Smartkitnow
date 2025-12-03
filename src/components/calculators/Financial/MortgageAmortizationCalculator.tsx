import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  // 1. STATE
  const [inputs, setInputs] = useState({ principal: "", interestRate: "", termYears: "" });
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showFullTable, setShowFullTable] = useState(false);

  // 2. CALCULATION LOGIC
  const results = useMemo(() => {
    const principal = parseFloat(inputs.principal);
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12;
    const termMonths = parseFloat(inputs.termYears) * 12;

    if (isNaN(principal) || isNaN(interestRate) || isNaN(termMonths) || termMonths <= 0) {
      return { main: 0, breakdown: [] };
    }

    const monthlyPayment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -termMonths));
    const breakdown = Array.from({ length: termMonths }, (_, i) => {
      const interestPayment = principal * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      principal -= principalPayment;
      return {
        month: i + 1,
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        remainingBalance: principal.toFixed(2)
      };
    });

    return { main: monthlyPayment.toFixed(2), breakdown };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // 3. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="principal" className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" /> Loan Principal
          </Label>
          <Input
            id="principal"
            type="number"
            value={inputs.principal}
            onChange={(e) => setInputs((prev) => ({ ...prev, principal: e.target.value }))}
            placeholder="Enter loan amount"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interestRate" className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Annual Interest Rate (%)
          </Label>
          <Input
            id="interestRate"
            type="number"
            value={inputs.interestRate}
            onChange={(e) => setInputs((prev) => ({ ...prev, interestRate: e.target.value }))}
            placeholder="Enter interest rate"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="termYears" className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Loan Term (Years)
          </Label>
          <Input
            id="termYears"
            type="number"
            value={inputs.termYears}
            onChange={(e) => setInputs((prev) => ({ ...prev, termYears: e.target.value }))}
            placeholder="Enter loan term in years"
          />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg text-lg font-bold shadow-md">Calculate</Button>
      
      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-500 border-none text-white shadow-xl">
            <CardContent className="pt-8 text-center">
              <p className="text-blue-100 font-medium mb-2">Estimated Monthly Payment</p>
              <div className="text-5xl font-bold">${results.main}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Detailed Breakdown</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Principal Payment</TableHead>
                    <TableHead>Interest Payment</TableHead>
                    <TableHead>Remaining Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.breakdown.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>${row.principalPayment}</TableCell>
                      <TableCell>${row.interestPayment}</TableCell>
                      <TableCell>${row.remainingBalance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // 4. EDITORIAL CONTENT (THE SEO GOLD MINE)
  const editorial = (
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      
      {/* SECTION 1: DEEP DIVE INTRO */}
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Understanding Mortgage Payment & Amortization Calculator</h2>
        <p className="mb-6">
          A mortgage payment and amortization calculator is an essential tool for anyone considering purchasing a home or refinancing an existing mortgage. It helps you estimate your monthly payments, taking into account the interest rate, loan amount, and term of the loan. Understanding how these factors interact can save you thousands of dollars over the life of the loan. This calculator not only provides an estimate of your monthly payment but also offers a detailed breakdown of how much you'll pay towards principal and interest each month.
        </p>
        <p className="mb-6">
          The concept of amortization is crucial in understanding how mortgages work. Amortization refers to the process of paying off a debt over time through regular payments. With each payment, a portion goes towards the loan's interest, while the remainder reduces the principal balance. Over time, the interest portion decreases while the principal portion increases, allowing you to build equity in your home.
        </p>
        <p className="mb-6">
          Financial institutions, including the Federal Reserve, emphasize the importance of understanding mortgage amortization. By using a mortgage payment calculator, you can plan your finances better, ensuring that you are prepared for the financial commitment of homeownership. This tool is invaluable for comparing different loan scenarios and making informed decisions.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-2">
            <Info className="h-5 w-5"/> Why This Matters
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            According to the Federal Reserve, understanding the amortization schedule of your mortgage can help you save thousands in interest payments over the life of the loan. This knowledge empowers you to make strategic decisions about extra payments or refinancing.
          </p>
        </div>
      </section>

      {/* SECTION 2: THE MATH */}
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">The Mathematical Formula</h2>
        <p className="mb-6">
          The formula for calculating the monthly mortgage payment is derived from the annuity formula. It considers the principal amount, the interest rate, and the term of the loan. The monthly mortgage payment (M) is calculated using the formula:
        </p>
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl">
          M = P[r(1+r)^n] / [(1+r)^n – 1]
        </div>
        <p className="mb-6">
          Where:
          <ul className="list-disc pl-6">
            <li><strong>M</strong> is the total monthly mortgage payment.</li>
            <li><strong>P</strong> is the principal loan amount.</li>
            <li><strong>r</strong> is the monthly interest rate. The annual rate divided by 12 months.</li>
            <li><strong>n</strong> is the number of payments (loan term in months).</li>
          </ul>
        </p>
      </section>

      {/* SECTION 3: STEP-BY-STEP GUIDE */}
      <section id="how-to-use">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li className="pl-2"><strong>Step 1:</strong> Begin by entering the total loan amount in the 'Loan Principal' field. This is the amount you plan to borrow from the lender.</li>
          <li className="pl-2"><strong>Step 2:</strong> Enter the annual interest rate in the 'Annual Interest Rate' field. Ensure this is the rate provided by your lender.</li>
          <li className="pl-2"><strong>Step 3:</strong> Specify the loan term in years in the 'Loan Term' field. This is the duration over which you will repay the loan.</li>
          <li className="pl-2"><strong>Step 4:</strong> Click the 'Calculate' button to view your estimated monthly payment and the detailed amortization schedule.</li>
        </ol>
      </section>

      {/* SECTION 4: FACTORS & NUANCES (WRITE A LOT HERE) */}
      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Key Factors Affecting Results</h2>
        <h3 className="text-2xl font-semibold mb-4 mt-8">Interest Rate Fluctuations</h3>
        <p className="mb-4">
          Interest rates significantly impact the total cost of a mortgage. Even a slight increase in the interest rate can lead to substantial differences in the total interest paid over the life of the loan. It's crucial to shop around for the best rates and consider locking in a rate if you anticipate increases in the near future.
        </p>
        <p className="mb-4">
          The Federal Reserve's policies often influence interest rates. Monitoring economic indicators and Federal Reserve announcements can provide insights into potential rate changes. Understanding these dynamics can help you make informed decisions about when to secure a mortgage.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8">Loan Term Length</h3>
        <p className="mb-4">
          The length of the loan term affects both the monthly payment and the total interest paid. Shorter terms typically result in higher monthly payments but lower total interest costs. Conversely, longer terms reduce monthly payments but increase the total interest paid over time.
        </p>
        <p className="mb-4">
          Choosing the right loan term requires balancing your monthly budget constraints with your long-term financial goals. Consider how changes in loan term can affect your overall financial health and equity growth in your home.
        </p>

        <h3 className="text-2xl font-semibold mb-4 mt-8">Prepayment and Additional Payments</h3>
        <p className="mb-4">
          Making additional payments toward your mortgage principal can significantly reduce the total interest paid and shorten the loan term. Many lenders allow for extra payments without penalties, which can be a strategic way to save money in the long run.
        </p>
        <p className="mb-4">
          It's important to understand your lender's policies regarding prepayments. Some loans may have prepayment penalties, which could offset the benefits of paying extra. Always read the fine print and consult with your lender before making additional payments.
        </p>
      </section>

      {/* SECTION 5: FAQ (MINIMUM 6 QUESTIONS) */}
      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-2">What is a mortgage amortization schedule?</h3>
            <p>
              A mortgage amortization schedule is a table that details each periodic payment on a mortgage loan. It shows how much of each payment goes toward interest and how much applies to the principal balance. Over time, the interest portion decreases while the principal portion increases, allowing you to see the exact path of your loan's repayment.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">How does interest rate affect my mortgage payment?</h3>
            <p>
              The interest rate on your mortgage directly affects your monthly payment and the total cost of the loan. A higher interest rate increases both the monthly payment and the total interest paid over the life of the loan. Conversely, a lower rate reduces these costs, making it crucial to secure the lowest rate possible.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Can I make extra payments on my mortgage?</h3>
            <p>
              Yes, most lenders allow you to make extra payments toward your mortgage principal. Doing so can reduce the total interest paid and shorten the loan term. However, check your loan agreement for any prepayment penalties before making additional payments.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">What is the difference between a fixed-rate and an adjustable-rate mortgage?</h3>
            <p>
              A fixed-rate mortgage has an interest rate that remains constant throughout the loan term, providing predictable monthly payments. An adjustable-rate mortgage (ARM) has an interest rate that can change periodically, often resulting in lower initial payments but potential increases in the future.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">How can I reduce my mortgage interest costs?</h3>
            <p>
              You can reduce mortgage interest costs by securing a lower interest rate, opting for a shorter loan term, or making additional payments toward the principal. Refinancing to a lower rate or different loan type can also help reduce interest costs.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">What happens if I miss a mortgage payment?</h3>
            <p>
              Missing a mortgage payment can result in late fees and negatively impact your credit score. If you anticipate difficulty making a payment, contact your lender immediately to discuss possible solutions. Prolonged missed payments can lead to foreclosure.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: REFERENCES (REAL LINKS) */}
      <section id="references" className="border-t pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">References & Official Sources</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Federal Reserve System</a>
              <p className="text-sm text-slate-500">Official economic data and reporting.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Consumer Financial Protection Bureau</a>
              <p className="text-sm text-slate-500">Resources on understanding mortgages and financial products.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.fdic.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Federal Deposit Insurance Corporation</a>
              <p className="text-sm text-slate-500">Information on banking and insurance.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">U.S. Department of Housing and Urban Development</a>
              <p className="text-sm text-slate-500">Housing information and resources.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.nar.realtor" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">National Association of Realtors</a>
              <p className="text-sm text-slate-500">Real estate market insights and data.</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mortgage Payment & Amortization Calculator"
      description="Estimate your monthly mortgage payments including interest. View the full amortization schedule to track your home equity growth over time."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "introduction", label: "Overview" },
        { id: "formula", label: "Formula" },
        { id: "how-to-use", label: "How to Use" },
        { id: "factors", label: "Key Factors" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      formula={{
        formula: "M = P[r(1+r)^n] / [(1+r)^n – 1]",
        variables: [
          { symbol: "M", description: "Total monthly mortgage payment" },
          { symbol: "P", description: "Principal loan amount" },
          { symbol: "r", description: "Monthly interest rate" },
          { symbol: "n", description: "Number of payments (loan term in months)" }
        ],
        title: "Mathematical Basis"
      }}
      example={{
        title: "Real-World Scenario",
        steps: [
          { step: 1, description: "Start with a principal of $200,000", calculation: "P = $200,000" },
          { step: 2, description: "Annual interest rate of 4%", calculation: "r = 4% / 12 months = 0.0033" },
          { step: 3, description: "Loan term of 30 years", calculation: "n = 30 * 12 = 360" }
        ],
        result: "Final Value: Monthly Payment = $954.83"
      }}
      relatedCalculators={[
        { title: "Home Affordability Calculator", url: "/financial/home-affordability", icon: "🏠" },
        { title: "Refinance Calculator", url: "/financial/refinance", icon: "🔄" }
      ]}
    />
  );
}