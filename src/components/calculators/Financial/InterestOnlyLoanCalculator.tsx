import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen } from "lucide-react";

interface CalculationResult {
  monthlyInterestPayment: number;
  totalInterestOnlyPayments: number;
  monthlyAmortizedPayment: number;
  totalAmortizedPayments: number;
}

export default function InterestOnlyLoanCalculator() {
  const [inputs, setInputs] = useState({ loanAmount: "", interestRate: "", interestOnlyPeriod: "", loanTerm: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo<CalculationResult | null>(() => {
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
    const interestOnlyPeriod = parseInt(inputs.interestOnlyPeriod, 10) || 0;
    const loanTerm = parseInt(inputs.loanTerm, 10) || 0;

    if (loanAmount <= 0 || interestRate <= 0 || interestOnlyPeriod <= 0 || loanTerm <= 0) {
      return null;
    }

    const monthlyInterestRate = interestRate / 12;
    const monthlyInterestPayment = loanAmount * monthlyInterestRate;
    const totalInterestOnlyPayments = monthlyInterestPayment * interestOnlyPeriod;

    const principalAfterInterestOnly = loanAmount;
    const amortizationPeriod = loanTerm - interestOnlyPeriod;
    const monthlyAmortizedPayment = (principalAfterInterestOnly * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -amortizationPeriod * 12));
    const totalAmortizedPayments = monthlyAmortizedPayment * amortizationPeriod * 12;

    return {
      monthlyInterestPayment,
      totalInterestOnlyPayments,
      monthlyAmortizedPayment,
      totalAmortizedPayments,
    };
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
          <Label htmlFor="loanAmount">Loan Amount</Label>
          <Input id="loanAmount" value={inputs.loanAmount} onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
          <Input id="interestRate" value={inputs.interestRate} onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="interestOnlyPeriod">Interest-Only Period (Years)</Label>
          <Input id="interestOnlyPeriod" value={inputs.interestOnlyPeriod} onChange={(e) => setInputs({ ...inputs, interestOnlyPeriod: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="loanTerm">Total Loan Term (Years)</Label>
          <Input id="loanTerm" value={inputs.loanTerm} onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })} />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg text-lg">Calculate</Button>
      
      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card>
            <CardHeader>
              <CardTitle>Interest-Only Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Monthly Interest Payment</TableCell>
                    <TableCell>${results.monthlyInterestPayment.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Interest-Only Payments</TableCell>
                    <TableCell>${results.totalInterestOnlyPayments.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Monthly Amortized Payment</TableCell>
                    <TableCell>${results.monthlyAmortizedPayment.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Amortized Payments</TableCell>
                    <TableCell>${results.totalAmortizedPayments.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6">Understanding Interest-Only Loans</h2>
        <p>Interest-only loans allow borrowers to pay only the interest for a certain period, reducing initial payments. However, understanding the transition to full amortization is crucial for financial planning.</p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-semibold mb-4">Interest-Only Loan Formula</h3>
        <p>The monthly interest payment is calculated as:</p>
        <p className="font-mono bg-blue-50 p-4 rounded-lg">Monthly Interest Payment = Loan Amount × (Annual Interest Rate / 12)</p>
        <p>After the interest-only period, the loan transitions to full amortization:</p>
        <p className="font-mono bg-blue-50 p-4 rounded-lg">Amortized Payment = Principal × (Monthly Interest Rate) / (1 - (1 + Monthly Interest Rate)<sup>-Number of Payments</sup>)</p>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-semibold mb-4">Step-by-Step Calculation Example</h3>
        <p>Consider a $500,000 loan with a 4% annual interest rate, a 5-year interest-only period, and a total term of 30 years.</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Calculate the monthly interest payment: $500,000 × (0.04 / 12) = $1,666.67</li>
          <li>Total interest-only payments over 5 years: $1,666.67 × 60 = $100,000</li>
          <li>Calculate the amortized payment for the remaining 25 years:</li>
          <li>Monthly interest rate: 0.04 / 12 = 0.003333</li>
          <li>Amortized payment: $500,000 × 0.003333 / (1 - (1 + 0.003333)<sup>-300</sup>) = $2,633.46</li>
        </ol>
      </section>

      <section id="real-world-scenarios">
        <h3 className="text-2xl font-semibold mb-4">Real-World Scenarios</h3>
        <p>Interest-only loans can be beneficial for various financial strategies. Here are three scenarios:</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Investor Strategy:</strong> An investor might use an interest-only loan to maximize cash flow on a rental property.</li>
          <li><strong>Career Growth:</strong> A professional expecting significant salary increases might opt for lower payments initially.</li>
          <li><strong>Short-Term Ownership:</strong> A buyer planning to sell before the amortization phase can benefit from lower initial payments.</li>
        </ul>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <ul className="space-y-4">
          <li><strong>What is an interest-only loan?</strong> An interest-only loan allows you to pay only the interest for a set period, reducing initial payments.</li>
          <li><strong>How does the transition to full amortization work?</strong> After the interest-only period, you begin paying both principal and interest, increasing monthly payments.</li>
          <li><strong>Are interest-only loans risky?</strong> They can be if you aren't prepared for higher payments after the interest-only period.</li>
          <li><strong>Who benefits from interest-only loans?</strong> Investors, professionals expecting income growth, and short-term property owners.</li>
          <li><strong>Can I pay principal during the interest-only period?</strong> Yes, paying principal can reduce the total interest paid over the loan's life.</li>
          <li><strong>What happens if I sell the property during the interest-only period?</strong> You can pay off the loan with the sale proceeds, potentially avoiding higher payments.</li>
        </ul>
      </section>

      <section id="references">
        <h3 className="text-2xl font-semibold mb-4">References</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><a href="https://www.federalreserve.gov/" className="text-blue-600 underline">Federal Reserve</a></li>
          <li><a href="https://www.consumerfinance.gov/" className="text-blue-600 underline">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.investopedia.com/" className="text-blue-600 underline">Investopedia</a></li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Interest-Only Loan Calculator"
      description="Calculate payments for interest-only loans. Compare the interest-only period versus the full amortization phase to plan your budget."
      widget={widget}
      editorial={editorial}
    />
  );
}