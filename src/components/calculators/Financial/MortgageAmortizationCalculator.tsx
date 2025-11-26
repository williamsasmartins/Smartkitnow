import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen } from "lucide-react";

// 1. Interfaces
interface CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: Array<{ month: number; principal: number; interest: number; balance: number }>;
}

export default function MortgageAmortizationCalculator() {
  // 2. State
  const [inputs, setInputs] = useState({ loanAmount: "", interestRate: "", loanTerm: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  // 3. Calculations
  const results = useMemo<CalculationResult | null>(() => {
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const loanTerm = parseFloat(inputs.loanTerm) * 12 || 0;

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) return null;

    const monthlyPayment = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTerm));
    let balance = loanAmount;
    let totalInterest = 0;
    const amortizationSchedule = [];

    for (let month = 1; month <= loanTerm; month++) {
      const interestPayment = balance * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      totalInterest += interestPayment;
      amortizationSchedule.push({ month, principal: principalPayment, interest: interestPayment, balance: Math.max(balance, 0) });
    }

    return {
      monthlyPayment,
      totalInterest,
      totalPayment: monthlyPayment * loanTerm,
      amortizationSchedule,
    };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // 4. Widget JSX
  const widget = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="loanAmount">Loan Amount</Label>
          <Input
            id="loanAmount"
            value={inputs.loanAmount}
            onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
            placeholder="Enter loan amount"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
            placeholder="Enter interest rate"
          />
        </div>
        <div>
          <Label htmlFor="loanTerm">Loan Term (years)</Label>
          <Input
            id="loanTerm"
            value={inputs.loanTerm}
            onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
            placeholder="Enter loan term"
          />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg text-lg">Calculate</Button>

      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${results.monthlyPayment.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Interest</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${results.totalInterest.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${results.totalPayment.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

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
              {results.amortizationSchedule.map((entry) => (
                <TableRow key={entry.month}>
                  <TableCell>{entry.month}</TableCell>
                  <TableCell>${entry.principal.toFixed(2)}</TableCell>
                  <TableCell>${entry.interest.toFixed(2)}</TableCell>
                  <TableCell>${entry.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  // 5. Editorial JSX
  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6">Introduction</h2>
        <p className="text-lg">
          Understanding your mortgage payment and how it contributes to your home equity is crucial for financial planning. This calculator helps you estimate your monthly mortgage payments, including interest, and provides a detailed amortization schedule.
        </p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-4">Formula</h3>
        <p className="text-lg">
          The formula to calculate the monthly mortgage payment is:
        </p>
        <p className="text-lg font-mono">
          M = P[r(1+r)^n] / [(1+r)^n – 1]
        </p>
        <ul className="list-disc ml-6">
          <li><strong>M</strong> = monthly payment</li>
          <li><strong>P</strong> = loan amount</li>
          <li><strong>r</strong> = monthly interest rate</li>
          <li><strong>n</strong> = number of payments (loan term in months)</li>
        </ul>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-bold mb-4">Example Calculation</h3>
        <p className="text-lg">
          Suppose you have a loan amount of $300,000 with an annual interest rate of 4% for a term of 30 years. Your monthly payment would be calculated as follows:
        </p>
        <p className="text-lg font-mono">
          M = 300,000[0.00333(1+0.00333)^360] / [(1+0.00333)^360 – 1] = $1,432.25
        </p>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold">What is an amortization schedule?</h4>
            <p className="text-lg">
              An amortization schedule is a table detailing each periodic payment on a loan, showing the amount going toward principal and interest, and the remaining balance after each payment.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">How does the interest rate affect my mortgage?</h4>
            <p className="text-lg">
              A higher interest rate increases the monthly payment and the total interest paid over the life of the loan. Conversely, a lower rate reduces both.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mortgage Payment & Amortization Calculator"
      description="Estimate your monthly mortgage payments including interest. View the full amortization schedule to track your home equity growth over time."
      widget={widget}
      editorial={editorial}
    />
  );
}