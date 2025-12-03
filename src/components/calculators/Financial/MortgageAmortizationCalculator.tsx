import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({ principal: "", interestRate: "", term: "" });
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showFullTable, setShowFullTable] = useState(false);

  const results = useMemo(() => {
    const principal = parseFloat(inputs.principal) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const term = parseInt(inputs.term) * 12 || 0;

    if (principal <= 0 || interestRate <= 0 || term <= 0) return { main: 0, schedule: [] };

    const monthlyPayment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -term));
    const schedule = Array.from({ length: term }, (_, i) => {
      const interestPayment = principal * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      principal -= principalPayment;
      return {
        month: i + 1,
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        balance: principal.toFixed(2),
      };
    });

    return { main: monthlyPayment.toFixed(2), schedule };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const widget = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="principal">Loan Principal ($)</Label>
          <Input
            id="principal"
            value={inputs.principal}
            onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
            placeholder="e.g., 200000"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
          <Input
            id="interestRate"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
            placeholder="e.g., 5"
          />
        </div>
        <div>
          <Label htmlFor="term">Loan Term (Years)</Label>
          <Input
            id="term"
            value={inputs.term}
            onChange={(e) => setInputs({ ...inputs, term: e.target.value })}
            placeholder="e.g., 30"
          />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg">Calculate</Button>

      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-blue-600">${results.main}</div>
              <p className="text-lg text-gray-700">Estimated Monthly Payment</p>
            </CardContent>
          </Card>
          {showFullTable && (
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
                {results.schedule.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>${row.principalPayment}</TableCell>
                    <TableCell>${row.interestPayment}</TableCell>
                    <TableCell>${row.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Button onClick={() => setShowFullTable(!showFullTable)} className="w-full size-lg">
            {showFullTable ? "Hide" : "Show"} Full Amortization Schedule
          </Button>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="how-to-calculate">
        <h2 className="text-3xl font-bold mb-6">How to Calculate Mortgage Payment & Amortization Calculator</h2>
        <p className="text-lg leading-relaxed mb-4">
          Calculating mortgage payments is crucial for anyone looking to purchase a home. It helps you understand how much you will pay monthly and over the life of the loan. The mortgage payment includes both principal and interest, and understanding this breakdown can help you manage your finances effectively.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          According to the <a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Federal Reserve</a>, the average mortgage interest rate can vary, affecting how much you pay over time. Knowing your mortgage payments can also help you compare different loan offers.
        </p>
      </section>

      <section id="formula">
        <h2 className="text-3xl font-bold mb-6">The Formula</h2>
        <p className="text-lg leading-relaxed mb-4">
          The formula for calculating monthly mortgage payments is derived from the annuity formula. It considers the principal amount, the interest rate, and the loan term to compute the monthly payment.
        </p>
        <div className="bg-slate-100 p-6 rounded-lg font-mono text-center my-6 border border-slate-200">
          M = P[r(1+r)^n]/[(1+r)^n – 1]
        </div>
        <p>Where:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>M:</strong> Monthly payment</li>
          <li><strong>P:</strong> Loan principal</li>
          <li><strong>r:</strong> Monthly interest rate (annual rate divided by 12 months)</li>
          <li><strong>n:</strong> Number of payments (loan term in years multiplied by 12 months)</li>
        </ul>
      </section>

      <section id="factors">
        <h2 className="text-3xl font-bold mb-6">What Affects the Results?</h2>
        <h3 className="text-2xl font-semibold mb-3">Interest Rate</h3>
        <p className="text-lg leading-relaxed mb-4">
          The interest rate is a significant factor in determining your monthly mortgage payment. A higher interest rate increases the cost of borrowing, resulting in higher monthly payments. It's essential to shop around for the best rates.
        </p>
        
        <h3 className="text-2xl font-semibold mb-3">Loan Term</h3>
        <p className="text-lg leading-relaxed mb-4">
          The length of your loan term affects how much you pay each month. A longer term means lower monthly payments but more interest paid over time. Conversely, a shorter term increases monthly payments but reduces total interest paid.
        </p>
        
        <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 my-6">
          <h4 className="font-bold flex items-center gap-2"><Info className="h-5 w-5"/> Pro Tip</h4>
          <p>Consider refinancing your mortgage if interest rates drop significantly. This can lower your monthly payments and reduce the total interest paid over the life of the loan.</p>
        </div>
      </section>

      <section id="types">
        <h2 className="text-3xl font-bold mb-6">Common Types/Scenarios</h2>
        <p className="text-lg leading-relaxed mb-4">
          Mortgages can vary significantly in terms of interest rates and loan terms. Fixed-rate mortgages offer stability with a consistent interest rate, while adjustable-rate mortgages may start with lower rates that can increase over time. Additionally, government-backed loans like FHA or VA loans have different requirements and benefits.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">What is a mortgage amortization schedule?</h3>
            <p className="text-gray-700 leading-relaxed">
              A mortgage amortization schedule is a detailed table showing each periodic payment on a mortgage loan. It breaks down each payment into principal and interest components, illustrating how the loan balance decreases over time. This schedule helps borrowers understand how much of their payment goes towards reducing the principal versus paying interest.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How does the interest rate impact my mortgage payment?</h3>
            <p className="text-gray-700 leading-relaxed">
              The interest rate directly affects the cost of borrowing. A higher interest rate increases the monthly payment and the total interest paid over the loan's life. Conversely, a lower rate reduces monthly payments and overall interest, making the loan more affordable.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Can I pay off my mortgage early?</h3>
            <p className="text-gray-700 leading-relaxed">
              Yes, you can pay off your mortgage early by making extra payments towards the principal. This reduces the loan balance faster, saving you money on interest. However, check with your lender for any prepayment penalties that might apply.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What is the difference between fixed-rate and adjustable-rate mortgages?</h3>
            <p className="text-gray-700 leading-relaxed">
              A fixed-rate mortgage has a constant interest rate throughout the loan term, offering predictable monthly payments. An adjustable-rate mortgage (ARM) starts with a lower rate that may change periodically based on market conditions, potentially leading to higher payments in the future.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">How do taxes and insurance affect my mortgage payment?</h3>
            <p className="text-gray-700 leading-relaxed">
              Taxes and insurance are typically included in your monthly mortgage payment through an escrow account. Property taxes and homeowners insurance can vary based on location and property value, impacting the overall cost of your mortgage payment.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">What is private mortgage insurance (PMI)?</h3>
            <p className="text-gray-700 leading-relaxed">
              Private mortgage insurance (PMI) is required for conventional loans when the down payment is less than 20% of the home's value. It protects the lender in case of default. PMI increases the monthly mortgage payment but can be canceled once sufficient equity is built.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="border-t pt-8 mt-12">
        <h2 className="text-2xl font-bold mb-6">References & Additional Resources</h2>
        <ul className="space-y-3">
          <li className="leading-relaxed">
            <a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              Federal Reserve
            </a>
            <p className="text-sm text-gray-600">Official economic data and rates.</p>
          </li>
          <li className="leading-relaxed">
            <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              Consumer Financial Protection Bureau
            </a>
            <p className="text-sm text-gray-600">Resources for understanding mortgages and financial products.</p>
          </li>
          <li className="leading-relaxed">
            <a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              U.S. Department of Housing and Urban Development
            </a>
            <p className="text-sm text-gray-600">Information on housing policies and assistance programs.</p>
          </li>
          <li className="leading-relaxed">
            <a href="https://www.freddiemac.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              Freddie Mac
            </a>
            <p className="text-sm text-gray-600">Insights and data on the housing market.</p>
          </li>
          <li className="leading-relaxed">
            <a href="https://www.mba.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
              Mortgage Bankers Association
            </a>
            <p className="text-sm text-gray-600">Industry news and mortgage market analysis.</p>
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
        { id: "how-to-calculate", label: "How to Calculate" },
        { id: "formula", label: "The Formula" },
        { id: "factors", label: "Key Factors" },
        { id: "types", label: "Common Types" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      formula={{
        formula: "M = P[r(1+r)^n]/[(1+r)^n – 1]",
        variables: [
          { symbol: "M", description: "Monthly payment" },
          { symbol: "P", description: "Loan principal" },
          { symbol: "r", description: "Monthly interest rate" },
          { symbol: "n", description: "Number of payments" }
        ],
        title: "Formula"
      }}
      example={{
        title: "Real World Example",
        steps: [
          { step: 1, description: "Identify inputs", calculation: "P = $200,000, r = 0.05/12, n = 30*12" },
          { step: 2, description: "Apply formula", calculation: "M = 200000[0.004167(1+0.004167)^360]/[(1+0.004167)^360 – 1]" },
          { step: 3, description: "Result", calculation: "M = $1,073.64" }
        ],
        result: "The final result is a monthly payment of $1,073.64."
      }}
      relatedCalculators={[
        { title: "Loan Interest Calculator", url: "/financial/loan-interest", icon: "📊" },
        { title: "Home Affordability Calculator", url: "/financial/home-affordability", icon: "💰" },
        { title: "Refinance Calculator", url: "/financial/refinance", icon: "📈" },
        { title: "Debt-to-Income Ratio Calculator", url: "/financial/debt-to-income", icon: "📉" }
      ]}
    />
  );
}