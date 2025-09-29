import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Row = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

const currency = (n: number) => (Number.isFinite(n) ? n.toLocaleString(undefined, { style: "currency", currency: "USD" }) : "-");

const AmortizationCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(4);
  const [loanTerm, setLoanTerm] = useState<number>(30);

  const monthlyRate = interestRate / 100 / 12;
  const months = loanTerm * 12;

  const monthlyPayment = useMemo(() => {
    if (!loanAmount || !interestRate || !loanTerm) return 0;
    const r = monthlyRate;
    const n = months;
    if (r === 0) return loanAmount / n;
    return (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  }, [loanAmount, interestRate, loanTerm, monthlyRate, months]);

  const schedule: Row[] = useMemo(() => {
    const rows: Row[] = [];
    let balance = loanAmount;
    const pay = monthlyPayment || 0;
    for (let i = 1; i <= months; i++) {
      const interest = balance * monthlyRate;
      const principal = Math.max(0, pay - interest);
      balance = Math.max(0, balance - principal);
      rows.push({ month: i, payment: pay, principal, interest, balance });
      if (balance <= 0) break;
    }
    return rows;
  }, [loanAmount, months, monthlyPayment, monthlyRate]);

  const totalInterest = useMemo(
    () => schedule.reduce((sum, r) => sum + r.interest, 0),
    [schedule]
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Ad Top Center */}
      <div className="rounded-xl bg-muted/20 border border-border/50 text-muted-foreground text-sm h-12 flex items-center justify-center">
        Ad Space – Top Center (Google AdSense)
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Amortization Calculator</CardTitle>
          <CardDescription>Calculate your loan payment and see the amortization schedule.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Loan Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="rate">Annual Interest Rate (%)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="term">Loan Term (Years)</Label>
              <Input
                id="term"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(parseFloat(e.target.value) || 0)}
                min={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border p-3">
              <div className="text-sm text-muted-foreground">Monthly Payment</div>
              <div className="text-xl font-semibold">{currency(monthlyPayment)}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-sm text-muted-foreground">Total Interest</div>
              <div className="text-xl font-semibold">{currency(totalInterest)}</div>
            </div>
            <div className="rounded-xl border p-3">
              <div className="text-sm text-muted-foreground">Total Paid</div>
              <div className="text-xl font-semibold">{currency(loanAmount + totalInterest)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>How to Use the Calculator</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ol className="list-decimal ml-5 space-y-1">
            <li>Enter the loan amount.</li>
            <li>Input the annual interest rate (APR).</li>
            <li>Specify the loan term in years.</li>
            <li>Review the monthly payment and the first months of the schedule below.</li>
          </ol>
        </CardContent>
      </Card>

      {/* Ad Mid Page 1 */}
      <div className="rounded-xl bg-muted/20 border border-border/50 text-muted-foreground text-sm h-12 flex items-center justify-center">
        Ad Space – Mid Page (Google AdSense)
      </div>

      {/* Formula & Explanation */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Amortization Formula</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Monthly Payment = <code>P × ( r(1+r)<sup>n</sup> / ((1+r)<sup>n</sup> - 1) )</code>, where:
          <ul className="list-disc ml-5 mt-2">
            <li><b>P</b> = Principal (loan amount)</li>
            <li><b>r</b> = Monthly interest rate (APR / 12)</li>
            <li><b>n</b> = Number of months (years × 12)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Amortization Table (primeiro ano) */}
      <Card className="bg-card border-border/50 overflow-x-auto">
        <CardHeader>
          <CardTitle>Amortization Schedule (First 12 Months)</CardTitle>
          <CardDescription>See how each payment splits between principal and interest.</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-3">Month</th>
                <th className="py-2 pr-3">Payment</th>
                <th className="py-2 pr-3">Principal</th>
                <th className="py-2 pr-3">Interest</th>
                <th className="py-2 pr-3">Balance</th>
              </tr>
            </thead>
            <tbody>
              {schedule.slice(0, 12).map((row) => (
                <tr key={row.month} className="border-b last:border-b-0">
                  <td className="py-2 pr-3">{row.month}</td>
                  <td className="py-2 pr-3">{currency(row.payment)}</td>
                  <td className="py-2 pr-3">{currency(row.principal)}</td>
                  <td className="py-2 pr-3">{currency(row.interest)}</td>
                  <td className="py-2 pr-3">{currency(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Three Column Ads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-muted/20 border border-border/50 text-muted-foreground text-sm h-24 flex items-center justify-center">
          Ad Space – Left
        </div>
        <div className="rounded-xl bg-muted/20 border border-border/50 text-muted-foreground text-sm h-24 flex items-center justify-center">
          Ad Space – Center
        </div>
        <div className="rounded-xl bg-muted/20 border border-border/50 text-muted-foreground text-sm h-24 flex items-center justify-center">
          Ad Space – Right
        </div>
      </div>

      {/* References */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>References</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <ul className="list-disc ml-5">
            <li>
              Investopedia — <a className="underline" href="https://www.investopedia.com/terms/a/amortization.asp" target="_blank" rel="noreferrer">Amortization</a>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Bottom Ad */}
      <div className="rounded-xl bg-muted/20 border border-border/50 text-muted-foreground text-sm h-12 flex items-center justify-center">
        Ad Space – Bottom (Google AdSense)
      </div>

      {/* Simple Feedback */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Send Us Your Feedback</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Name (Optional)" />
          <Input placeholder="Email (Optional)" />
          <Input className="md:col-span-3" placeholder="Suggestions" />
          <Button className="md:col-span-3 w-full md:w-auto">Submit Feedback</Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Note: This calculator is provided for educational purposes only.
      </p>
    </div>
  );
};

export default AmortizationCalculator;
