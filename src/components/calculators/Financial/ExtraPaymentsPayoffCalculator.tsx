import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen } from "lucide-react";

interface CalculationResult {
  newPayoffDate: string;
  totalInterestSaved: number;
  monthsSaved: number;
}

export default function ExtraPaymentsPayoffCalculator() {
  const [inputs, setInputs] = useState({ loanAmount: "", interestRate: "", loanTerm: "", extraPayment: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const loanTerm = parseInt(inputs.loanTerm) || 0;
    const extraPayment = parseFloat(inputs.extraPayment) || 0;

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return null;
    }

    const monthlyPayment = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTerm));
    let balance = loanAmount;
    let totalInterestPaid = 0;
    let months = 0;

    while (balance > 0) {
      const interestForMonth = balance * interestRate;
      const principalForMonth = Math.min(monthlyPayment + extraPayment - interestForMonth, balance);
      balance -= principalForMonth;
      totalInterestPaid += interestForMonth;
      months++;
    }

    const originalTotalInterest = (monthlyPayment * loanTerm) - loanAmount;
    const totalInterestSaved = originalTotalInterest - totalInterestPaid;
    const monthsSaved = loanTerm - months;

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);
    const newPayoffDate = payoffDate.toLocaleDateString();

    return { newPayoffDate, totalInterestSaved, monthsSaved };
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
            placeholder="Enter annual interest rate"
          />
        </div>
        <div>
          <Label htmlFor="loanTerm">Loan Term (months)</Label>
          <Input
            id="loanTerm"
            value={inputs.loanTerm}
            onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
            placeholder="Enter loan term in months"
          />
        </div>
        <div>
          <Label htmlFor="extraPayment">Extra Payment</Label>
          <Input
            id="extraPayment"
            value={inputs.extraPayment}
            onChange={(e) => setInputs({ ...inputs, extraPayment: e.target.value })}
            placeholder="Enter extra payment amount"
          />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg text-lg">Calculate</Button>
      
      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card>
            <CardHeader>
              <CardTitle>Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>New Payoff Date: {results.newPayoffDate}</p>
              <p>Total Interest Saved: ${results.totalInterestSaved.toFixed(2)}</p>
              <p>Months Saved: {results.monthsSaved}</p>
            </CardContent>
          </Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detail</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>New Payoff Date</TableCell>
                <TableCell>{results.newPayoffDate}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Interest Saved</TableCell>
                <TableCell>${results.totalInterestSaved.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Months Saved</TableCell>
                <TableCell>{results.monthsSaved}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6">Understanding Extra Payments on Loans</h2>
        <p>Extra payments can significantly reduce the time it takes to pay off a loan and the total interest paid over the life of the loan. This calculator helps you visualize the impact of making additional payments on your loan.</p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-semibold mb-4">Formula for Calculating New Payoff</h3>
        <p>The formula to calculate the monthly payment is:</p>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <p>Monthly Payment = (Loan Amount × Interest Rate) / (1 - (1 + Interest Rate)<sup>-Loan Term</sup>)</p>
        </div>
        <p>With extra payments, the balance reduces faster, leading to a new payoff date and total interest savings.</p>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-semibold mb-4">Step-by-Step Example</h3>
        <p>Imagine you have a $200,000 loan at a 5% annual interest rate with a 30-year term. By making an extra $200 payment each month, you can save thousands in interest and pay off your loan years earlier.</p>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>How do extra payments affect my loan?</li>
          <li>Is it better to pay extra monthly or make a lump sum payment?</li>
          <li>Can I apply extra payments to the principal?</li>
          <li>How can I calculate the impact of extra payments?</li>
          <li>What are the benefits of paying off a loan early?</li>
          <li>Are there penalties for paying off a loan early?</li>
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