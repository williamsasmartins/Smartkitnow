import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({ principal: "", interestRate: "", term: "" });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const principal = parseFloat(inputs.principal) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const term = parseInt(inputs.term) * 12 || 0;

    const monthlyPayment = term > 0 ? (principal * interestRate) / (1 - Math.pow(1 + interestRate, -term)) : 0;
    const schedule = Array.from({ length: term }, (_, i) => ({
      month: i + 1,
      principalPayment: monthlyPayment * Math.pow(1 + interestRate, -(term - i)),
      interestPayment: monthlyPayment - (monthlyPayment * Math.pow(1 + interestRate, -(term - i))),
      balance: principal - monthlyPayment * i
    }));

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
          <Label htmlFor="principal">Principal Amount</Label>
          <Input id="principal" value={inputs.principal} onChange={(e) => setInputs({ ...inputs, principal: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
          <Input id="interestRate" value={inputs.interestRate} onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="term">Term (Years)</Label>
          <Input id="term" value={inputs.term} onChange={(e) => setInputs({ ...inputs, term: e.target.value })} />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg">Calculate</Button>
      
      {results && (
        <div ref={resultsRef} className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-blue-600">${results.main}</div>
            </CardContent>
          </Card>
          
          {results.schedule.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  Amortization Schedule
                  {results.schedule.length > 12 && <Button onClick={() => setShowFullTable(!showFullTable)}>Show All</Button>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(showFullTable ? results.schedule : results.schedule.slice(0, 12)).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>${row.principalPayment.toFixed(2)}</TableCell>
                        <TableCell>${row.interestPayment.toFixed(2)}</TableCell>
                        <TableCell>${row.balance.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-2xl font-bold mb-6">Introduction</h2>
        <p>Understanding your mortgage payments and how they contribute to your home equity is crucial for financial planning. This calculator helps you estimate your monthly mortgage payments and provides a detailed amortization schedule.</p>
      </section>
      <section id="how-it-works">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <p>The calculator uses the principal amount, annual interest rate, and loan term to calculate your monthly payment and generate an amortization schedule. This schedule shows how much of each payment goes towards principal and interest, and how your balance decreases over time.</p>
      </section>
      <section id="factors">
        <h2 className="text-2xl font-bold mb-6">Factors Affecting Mortgage Payments</h2>
        <p>Several factors influence your mortgage payments, including the loan amount, interest rate, loan term, and any additional fees or insurance. Understanding these factors can help you make informed decisions when choosing a mortgage.</p>
      </section>
      <section id="types">
        <h2 className="text-2xl font-bold mb-6">Types of Mortgages</h2>
        <p>There are various types of mortgages available, such as fixed-rate, adjustable-rate, and interest-only mortgages. Each type has its own advantages and disadvantages, depending on your financial situation and goals.</p>
      </section>
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <p>Here are some common questions about mortgage payments and amortization schedules:</p>
        <ul>
          <li>What is amortization?</li>
          <li>How does the interest rate affect my payments?</li>
          <li>Can I pay off my mortgage early?</li>
        </ul>
      </section>
      <section id="references">
        <h2 className="text-2xl font-bold mb-6">References</h2>
        <ul className="space-y-3">
          <li><a href="https://www.consumerfinance.gov/owning-a-home/loan-estimate/" target="_blank" rel="noopener">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.federalreserve.gov/consumerscommunities/mortgage-loans.htm" target="_blank" rel="noopener">Federal Reserve</a></li>
          <li><a href="https://www.hud.gov/topics/buying_a_home" target="_blank" rel="noopener">U.S. Department of Housing and Urban Development</a></li>
          <li><a href="https://www.fanniemae.com/" target="_blank" rel="noopener">Fannie Mae</a></li>
          <li><a href="https://www.freddiemac.com/" target="_blank" rel="noopener">Freddie Mac</a></li>
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
        { id: "introduction", label: "Introduction" },
        { id: "how-it-works", label: "How It Works" },
        { id: "factors", label: "Factors" },
        { id: "types", label: "Types" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      formula={{
        formula: "M = P[r(1+r)^n]/[(1+r)^n – 1]",
        variables: [
          { symbol: "M", description: "Monthly payment" },
          { symbol: "P", description: "Principal amount" },
          { symbol: "r", description: "Monthly interest rate" },
          { symbol: "n", description: "Number of payments" }
        ],
        title: "Mortgage Payment Formula"
      }}
      example={{
        title: "Example Calculation",
        steps: [
          "Determine the principal amount (P) = $200,000.",
          "Annual interest rate = 5%, so monthly rate (r) = 0.05/12.",
          "Loan term = 30 years, so number of payments (n) = 30*12.",
          "Calculate M using the formula."
        ],
        result: "The monthly payment (M) is approximately $1,073.64."
      }}
      relatedCalculators={[
        { title: "Home Affordability Calculator", url: "/home-affordability", icon: "🏠" },
        { title: "Refinance Calculator", url: "/refinance", icon: "🔄" },
        { title: "Loan Comparison Calculator", url: "/loan-comparison", icon: "📊" },
        { title: "Interest-Only Mortgage Calculator", url: "/interest-only", icon: "📈" },
        { title: "ARM Calculator", url: "/arm", icon: "🔀" },
        { title: "Bi-Weekly Payment Calculator", url: "/bi-weekly", icon: "🗓️" }
      ]}
    />
  );
}