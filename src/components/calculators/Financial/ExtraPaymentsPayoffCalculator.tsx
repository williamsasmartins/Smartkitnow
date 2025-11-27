import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen, CheckCircle2 } from "lucide-react";

// 1. Interfaces (Strict Types)
interface CalculationResult {
  mainValue: number;
  breakdown: Array<{ year: number; remainingBalance: number; totalInterestPaid: number }>;
}

export default function ExtraPaymentsPayoffCalculator() {
  // 2. State
  const [inputs, setInputs] = useState({ loanAmount: "", interestRate: "", monthlyPayment: "", extraPayment: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  // 3. Logic (Robust)
  const results = useMemo(() => {
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const monthlyPayment = parseFloat(inputs.monthlyPayment) || 0;
    const extraPayment = parseFloat(inputs.extraPayment) || 0;

    if (loanAmount === 0 || interestRate === 0 || monthlyPayment === 0) return null;

    let balance = loanAmount;
    let totalInterestPaid = 0;
    const breakdown = [];
    let year = 1;

    while (balance > 0) {
      let yearlyInterest = 0;
      for (let month = 0; month < 12; month++) {
        const interestForMonth = balance * interestRate;
        const principalPayment = monthlyPayment + extraPayment - interestForMonth;
        balance -= principalPayment;
        yearlyInterest += interestForMonth;
        totalInterestPaid += interestForMonth;

        if (balance <= 0) {
          balance = 0;
          break;
        }
      }
      breakdown.push({ year, remainingBalance: balance, totalInterestPaid });
      year++;
    }

    return { mainValue: year - 1, breakdown };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // 4. Widget (Interactive)
  const widget = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Loan Amount */}
        <div className="space-y-2">
          <Label>Loan Amount</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10"
              value={inputs.loanAmount}
              onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
            />
          </div>
        </div>
        {/* Interest Rate */}
        <div className="space-y-2">
          <Label>Annual Interest Rate (%)</Label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10"
              value={inputs.interestRate}
              onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
            />
          </div>
        </div>
        {/* Monthly Payment */}
        <div className="space-y-2">
          <Label>Monthly Payment</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10"
              value={inputs.monthlyPayment}
              onChange={(e) => setInputs({ ...inputs, monthlyPayment: e.target.value })}
            />
          </div>
        </div>
        {/* Extra Payment */}
        <div className="space-y-2">
          <Label>Extra Monthly Payment</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10"
              value={inputs.extraPayment}
              onChange={(e) => setInputs({ ...inputs, extraPayment: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleCalculate} size="lg" className="w-full font-bold text-lg">
        Calculate
      </Button>

      {/* Results Display */}
      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Primary Result Card (Gradient) */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6 text-center">
              <div className="text-4xl font-bold text-primary">{results.mainValue} Years</div>
              <p className="text-muted-foreground">Time to pay off the loan with extra payments</p>
            </CardContent>
          </Card>

          {/* Data Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead>Remaining Balance</TableHead>
                  <TableHead>Total Interest Paid</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.breakdown.map((entry) => (
                  <TableRow key={entry.year}>
                    <TableCell>{entry.year}</TableCell>
                    <TableCell>${entry.remainingBalance.toFixed(2)}</TableCell>
                    <TableCell>${entry.totalInterestPaid.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );

  // 5. Editorial (SEO Gold Mine)
  const editorial = (
    <div className="skn-editorial space-y-12">
      {/* Introduction */}
      <section id="intro">
        <h2 className="text-3xl font-bold mb-6">Understanding Extra Payments on Loans</h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Making extra payments on a loan can significantly reduce the total interest paid over the life of the loan and shorten the payoff time. This calculator helps you visualize how additional payments can impact your financial future.
        </p>
      </section>

      {/* Visual Callout */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
        <h4 className="font-bold flex items-center gap-2 mb-2"><Info className="h-5 w-5"/> Key Insight</h4>
        <p>By making consistent extra payments, you not only reduce the principal balance faster but also decrease the interest charged each month.</p>
      </div>

      {/* Formula Section */}
      <section id="formula">
        <h2 className="text-2xl font-bold mb-4">The Formula</h2>
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg font-mono text-center my-6 overflow-x-auto">
          <p>Monthly Interest = Principal Balance × (Annual Interest Rate / 12)</p>
          <p>Principal Payment = Monthly Payment + Extra Payment - Monthly Interest</p>
        </div>
        <p className="text-lg leading-relaxed text-muted-foreground">
          These formulas help calculate how much of your payment goes towards interest versus reducing the principal balance each month.
        </p>
      </section>

      {/* Detailed Examples */}
      <section id="examples">
        <h2 className="text-2xl font-bold mb-4">Step-by-Step Example</h2>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Suppose you have a $200,000 loan with a 5% annual interest rate, and you make an extra $200 monthly payment. Over time, this reduces the interest paid and the loan term significantly. Use this calculator to see the exact impact.
        </p>
      </section>

      {/* FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">How do extra payments affect my loan?</h3>
            <p>Extra payments reduce the principal balance faster, leading to lower interest charges and a shorter loan term.</p>
          </div>
          <div>
            <h3 className="font-bold">Can I make extra payments on any type of loan?</h3>
            <p>Most loans allow extra payments, but it's important to check with your lender for any restrictions or penalties.</p>
          </div>
          <div>
            <h3 className="font-bold">Is it better to make a lump sum payment or regular extra payments?</h3>
            <p>Both methods reduce interest and loan term, but regular extra payments provide consistent benefits over time.</p>
          </div>
          <div>
            <h3 className="font-bold">How can I calculate the impact of extra payments?</h3>
            <p>Use this calculator to input your loan details and see how extra payments affect your payoff timeline and interest savings.</p>
          </div>
          <div>
            <h3 className="font-bold">Do extra payments affect my credit score?</h3>
            <p>Extra payments can positively impact your credit score by reducing your debt-to-income ratio and showing responsible credit management.</p>
          </div>
          <div>
            <h3 className="font-bold">What if I can't make extra payments every month?</h3>
            <p>Even occasional extra payments can help reduce interest and shorten the loan term. Consistency is key, but any extra payment helps.</p>
          </div>
          <div>
            <h3 className="font-bold">Should I prioritize extra payments on high-interest loans?</h3>
            <p>Yes, focusing on high-interest loans first can maximize interest savings and reduce financial stress.</p>
          </div>
          <div>
            <h3 className="font-bold">Can I stop making extra payments if needed?</h3>
            <p>Yes, you can adjust your payment strategy as needed, but maintaining extra payments when possible is beneficial.</p>
          </div>
        </div>
      </section>

      {/* Authoritative References */}
      <section id="references" className="border-t pt-8 mt-12">
        <h3 className="font-bold mb-4">Sources & References</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="https://www.consumerfinance.gov" target="_blank" rel="noopener" className="hover:underline">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.federalreserve.gov" target="_blank" rel="noopener" className="hover:underline">Federal Reserve</a></li>
          <li><a href="https://www.investopedia.com" target="_blank" rel="noopener" className="hover:underline">Investopedia - Extra Payments</a></li>
          <li><a href="https://www.bankrate.com" target="_blank" rel="noopener" className="hover:underline">Bankrate - Loan Payoff</a></li>
          <li><a href="https://www.nerdwallet.com" target="_blank" rel="noopener" className="hover:underline">NerdWallet - Loan Management</a></li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Extra Payments & Payoff Time Calculator"
      description="See how extra payments affect your loan payoff date. Save on interest by paying down your debt faster with this simple calculator."
      widget={widget}
      editorial={editorial}
    />
  );
}