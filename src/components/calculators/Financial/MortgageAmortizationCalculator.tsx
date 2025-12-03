import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen, Lightbulb } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({ principal: "", interestRate: "", years: "" });
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showFullTable, setShowFullTable] = useState(false);

  const results = useMemo(() => {
    const principal = parseFloat(inputs.principal) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const numberOfPayments = (parseInt(inputs.years) || 0) * 12;

    const monthlyPayment = principal * interestRate / (1 - Math.pow(1 + interestRate, -numberOfPayments));
    const schedule = [];

    for (let i = 0; i < numberOfPayments; i++) {
      const interestPayment = principal * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      principal -= principalPayment;
      schedule.push({
        month: i + 1,
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        remainingBalance: principal.toFixed(2)
      });
    }

    return { main: monthlyPayment.toFixed(2), schedule };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="principal">Principal Amount</Label>
          <Input
            id="principal"
            value={inputs.principal}
            onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
            placeholder="e.g., 300000"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
          <Input
            id="interestRate"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
            placeholder="e.g., 3.5"
          />
        </div>
        <div>
          <Label htmlFor="years">Loan Term (Years)</Label>
          <Input
            id="years"
            value={inputs.years}
            onChange={(e) => setInputs({ ...inputs, years: e.target.value })}
            placeholder="e.g., 30"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleCalculate} className="w-full">Calculate</Button>
        </div>
      </div>
      <div ref={resultsRef}>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${results.main}</p>
          </CardContent>
        </Card>
        <Button onClick={() => setShowFullTable(!showFullTable)} className="mt-4">
          {showFullTable ? "Hide" : "Show"} Full Amortization Schedule
        </Button>
        {showFullTable && (
          <Table className="mt-4">
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
                  <TableCell>${row.remainingBalance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Understanding Mortgage Payment & Amortization Calculator</h2>
        <p className="mb-6">
          A mortgage payment and amortization calculator is an essential tool for anyone considering purchasing a home. It helps potential homeowners estimate their monthly mortgage payments, including interest, and provides a detailed amortization schedule to track how much of each payment goes toward principal versus interest. According to the Federal Reserve, the average mortgage interest rate in 2023 was approximately 6.5% for a 30-year fixed loan. Understanding these payments is crucial because even a small difference in interest rates can significantly impact the total cost of a mortgage over time.
        </p>
        <p className="mb-6">
          The financial impact of understanding your mortgage payments cannot be overstated. For instance, on a $300,000 mortgage, a 1% increase in the interest rate could increase your monthly payment by over $180, which translates to an additional $65,000 over the life of a 30-year loan. This calculator helps you make informed decisions by showing the potential long-term financial impact of different loan scenarios.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-2">
            <Lightbulb className="h-5 w-5"/> Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">
            Utilizing a mortgage calculator can help you compare different loan offers and choose the one that best fits your budget and long-term financial goals. It’s a crucial step in securing a mortgage that aligns with your financial strategy.
          </p>
        </div>
      </section>

      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">The Math Behind the Calculation</h2>
        <p className="mb-6">
          The mortgage payment calculation involves several variables, including the loan principal, interest rate, and loan term. The formula used is the standard amortization formula, which calculates the fixed monthly payment required to pay off an amortizing loan over its term. The formula considers the principal amount, the interest rate per period, and the total number of payments.
        </p>
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl overflow-x-auto">
          M = P[r(1+r)^n]/[(1+r)^n – 1]
        </div>
      </section>

      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Key Factors Affecting Your Results</h2>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8">Factor 1: Interest Rate</h3>
        <p className="mb-4">
          The interest rate is a critical factor in determining your monthly mortgage payment. A lower interest rate means a lower monthly payment, and vice versa. For example, a 1% difference in interest rate on a $300,000 loan can result in a monthly payment difference of approximately $180. This underscores the importance of shopping around for the best interest rate. Check our <a href="/financial/amortization" className="text-blue-600 hover:underline">amortization calculator</a> to see how rates affect your payments.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8">Factor 2: Loan Term</h3>
        <p className="mb-4">
          The length of your loan term also significantly impacts your monthly payment. A longer loan term will generally result in smaller monthly payments, but you'll pay more interest over the life of the loan. Conversely, a shorter loan term increases monthly payments but reduces the total interest paid. For instance, switching from a 30-year to a 15-year mortgage can save you tens of thousands of dollars in interest, though your monthly payments may increase.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-2">What is an amortization schedule?</h3>
            <p>
              An amortization schedule is a table detailing each periodic payment on a loan (typically a mortgage), as generated by an amortization calculator. It provides a breakdown of each payment between interest and principal, as well as the remaining balance after each payment. This schedule helps borrowers understand how their payments are applied over time.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">How does the interest rate affect my mortgage payment?</h3>
            <p>
              The interest rate directly affects the size of your monthly mortgage payment. A higher interest rate increases your payment, while a lower rate decreases it. Even a small change in interest rates can have a significant impact on the total cost of your mortgage over time.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Can I pay off my mortgage early?</h3>
            <p>
              Yes, you can pay off your mortgage early by making additional payments towards the principal. This reduces the amount of interest you will pay over the life of the loan and can shorten the loan term. However, check your mortgage agreement for any prepayment penalties.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">What is PMI and how does it affect my mortgage?</h3>
            <p>
              Private Mortgage Insurance (PMI) is a type of insurance required by lenders when your down payment is less than 20% of the home's value. PMI protects the lender in case of default. It increases your monthly mortgage payment but can be removed once you have sufficient equity in your home.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">How can I lower my monthly mortgage payment?</h3>
            <p>
              You can lower your monthly mortgage payment by refinancing to a lower interest rate, extending your loan term, or eliminating PMI. Additionally, increasing your down payment can reduce your loan amount and thus your monthly payment.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">What is the difference between fixed-rate and adjustable-rate mortgages?</h3>
            <p>
              A fixed-rate mortgage has a constant interest rate and monthly payment throughout the life of the loan. An adjustable-rate mortgage (ARM) has an interest rate that can change periodically based on market conditions, which can affect your monthly payment.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">How do taxes and insurance affect my mortgage payment?</h3>
            <p>
              Taxes and insurance can be included in your monthly mortgage payment through an escrow account. This ensures that property taxes and homeowners insurance are paid on time. These costs can fluctuate annually, affecting your total monthly payment.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">What is a balloon payment?</h3>
            <p>
              A balloon payment is a large, lump-sum payment due at the end of a balloon mortgage. These loans typically have lower monthly payments but require the borrower to pay off the remaining balance in full at the end of the term.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="border-t pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">References & Official Sources</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Federal Reserve System</a>
              <p className="text-sm text-slate-500">Official economic data.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Consumer Financial Protection Bureau</a>
              <p className="text-sm text-slate-500">Guidance on mortgages and home buying.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.hud.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">U.S. Department of Housing and Urban Development</a>
              <p className="text-sm text-slate-500">Resources for homebuyers.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.freddiemac.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Freddie Mac</a>
              <p className="text-sm text-slate-500">Mortgage market insights.</p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <div>
              <a href="https://www.fanniemae.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Fannie Mae</a>
              <p className="text-sm text-slate-500">Home buying resources and programs.</p>
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
        { id: "factors", label: "Key Factors" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      formula={{ formula: "M = P[r(1+r)^n]/[(1+r)^n – 1]", variables: [], title: "Formula" }}
      example={{ title: "Example", steps: [], result: "..." }}
      relatedCalculators={[ { title: "Related", url: "...", icon: "📊" } ]}
    />
  );
}