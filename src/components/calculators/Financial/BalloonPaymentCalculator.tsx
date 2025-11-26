import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen } from "lucide-react";

interface CalculationResult {
  monthlyPayment: number;
  balloonPayment: number;
  totalInterest: number;
}

export default function BalloonPaymentCalculator() {
  const [inputs, setInputs] = useState({ loanAmount: "", interestRate: "", termYears: "", balloonPercent: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const termMonths = (parseFloat(inputs.termYears) || 0) * 12;
    const balloonPercent = parseFloat(inputs.balloonPercent) / 100 || 0;

    if (loanAmount <= 0 || interestRate <= 0 || termMonths <= 0 || balloonPercent < 0 || balloonPercent >= 1) {
      return null;
    }

    const balloonPayment = loanAmount * balloonPercent;
    const monthlyPayment = (loanAmount - balloonPayment) * (interestRate * Math.pow(1 + interestRate, termMonths)) / (Math.pow(1 + interestRate, termMonths) - 1);
    const totalInterest = (monthlyPayment * termMonths + balloonPayment) - loanAmount;

    return {
      monthlyPayment,
      balloonPayment,
      totalInterest
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
          <Input id="loanAmount" type="number" value={inputs.loanAmount} onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
          <Input id="interestRate" type="number" value={inputs.interestRate} onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="termYears">Term (Years)</Label>
          <Input id="termYears" type="number" value={inputs.termYears} onChange={(e) => setInputs({ ...inputs, termYears: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="balloonPercent">Balloon Payment (%)</Label>
          <Input id="balloonPercent" type="number" value={inputs.balloonPercent} onChange={(e) => setInputs({ ...inputs, balloonPercent: e.target.value })} />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg text-lg">Calculate</Button>

      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>Monthly Payment:</div>
                <div>${results.monthlyPayment.toFixed(2)}</div>
              </div>
              <div className="flex justify-between">
                <div>Balloon Payment:</div>
                <div>${results.balloonPayment.toFixed(2)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total Interest:</div>
                <div>${results.totalInterest.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Amortization schedule logic here */}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6">Understanding Balloon Payments</h2>
        <p>Balloon payments are a unique financial tool often used in loans where a large payment is due at the end of the term. This calculator helps you understand the monthly payments and the final balloon payment amount, ensuring you are prepared for the financial commitment.</p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-4">Balloon Payment Formula</h3>
        <p>The formula to calculate the monthly payment is:</p>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p>Monthly Payment = (P - B) * (r * (1 + r)^n) / ((1 + r)^n - 1)</p>
          <p>Where:</p>
          <ul className="list-disc ml-6">
            <li>P = Loan Amount</li>
            <li>B = Balloon Payment</li>
            <li>r = Monthly Interest Rate</li>
            <li>n = Number of Payments</li>
          </ul>
        </div>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-bold mb-4">Step-by-Step Example</h3>
        <p>Consider a loan of $100,000 with an annual interest rate of 5%, a term of 5 years, and a balloon payment of 20%.</p>
        <ol className="list-decimal ml-6">
          <li>Calculate the monthly interest rate: 5% / 12 = 0.4167%</li>
          <li>Calculate the balloon payment: $100,000 * 20% = $20,000</li>
          <li>Calculate the monthly payment using the formula.</li>
        </ol>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
        <ul className="list-disc ml-6">
          <li>What is a balloon payment?</li>
          <li>How does a balloon payment affect my loan?</li>
          <li>Can I refinance a balloon payment?</li>
          <li>What are the risks of balloon payments?</li>
          <li>How do I prepare for a balloon payment?</li>
          <li>Are balloon payments common in car loans?</li>
        </ul>
      </section>

      <section id="references">
        <h3 className="text-2xl font-bold mb-4">References</h3>
        <ul className="list-disc ml-6">
          <li><a href="https://www.federalreserve.gov" className="text-blue-600">Federal Reserve</a></li>
          <li><a href="https://www.consumerfinance.gov" className="text-blue-600">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.investopedia.com" className="text-blue-600">Investopedia</a></li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Balloon Payment Calculator"
      description="Calculate monthly payments and the final balloon payment amount. Essential for loans with a large lump-sum payoff at the end of the term."
      widget={widget}
      editorial={editorial}
    />
  );
}