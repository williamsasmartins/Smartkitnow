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
  totalInterest: number;
  totalPayment: number;
}

export default function StudentLoanRepaymentCalculator() {
  const [inputs, setInputs] = useState({ loanAmount: "", interestRate: "", loanTerm: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo<CalculationResult | null>(() => {
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const loanTerm = parseFloat(inputs.loanTerm) || 0;

    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      return null;
    }

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyPayment,
      totalInterest,
      totalPayment
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
          <Input
            id="loanAmount"
            type="number"
            value={inputs.loanAmount}
            onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
            placeholder="e.g., 20000"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
            placeholder="e.g., 5"
          />
        </div>
        <div>
          <Label htmlFor="loanTerm">Loan Term (years)</Label>
          <Input
            id="loanTerm"
            type="number"
            value={inputs.loanTerm}
            onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
            placeholder="e.g., 10"
          />
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
              <p>Monthly Payment: ${results.monthlyPayment.toFixed(2)}</p>
              <p>Total Interest: ${results.totalInterest.toFixed(2)}</p>
              <p>Total Payment: ${results.totalPayment.toFixed(2)}</p>
            </CardContent>
          </Card>
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
              {/* Amortization schedule logic can be added here */}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6">Understanding Your Student Loan Repayment</h2>
        <p>Student loans can be a significant financial burden, but with the right repayment strategy, you can manage your debt effectively. This calculator helps you estimate monthly payments and total interest costs under different repayment plans.</p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-semibold mb-4">The Math Behind the Calculation</h3>
        <p>The formula used to calculate the monthly payment is:</p>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-lg"><strong>Monthly Payment =</strong> <em>P</em> × <em>r</em> / (1 - (1 + <em>r</em>)<sup>-<em>n</em></sup>)</p>
          <ul className="list-disc pl-5">
            <li><em>P</em> = Loan Amount</li>
            <li><em>r</em> = Monthly Interest Rate</li>
            <li><em>n</em> = Number of Payments</li>
          </ul>
        </div>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-semibold mb-4">Step-by-Step Example</h3>
        <p>Let's say you have a student loan of $20,000 with an interest rate of 5% over a term of 10 years. Using the formula, your monthly payment would be calculated as follows:</p>
        <p className="bg-white p-4 rounded-lg shadow-md">Monthly Payment = $20,000 × 0.004167 / (1 - (1 + 0.004167)<sup>-120</sup>) = $212.13</p>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">What is the best repayment plan for student loans?</h4>
            <p>The best repayment plan depends on your financial situation. Options include standard, graduated, and income-driven repayment plans.</p>
          </div>
          <div>
            <h4 className="font-semibold">Can I pay off my student loans early?</h4>
            <p>Yes, paying off your loans early can save you money on interest, but check if there are any prepayment penalties.</p>
          </div>
          <div>
            <h4 className="font-semibold">How does interest accrue on student loans?</h4>
            <p>Interest on student loans accrues daily, and the amount you pay each month is applied first to interest and then to the principal.</p>
          </div>
          <div>
            <h4 className="font-semibold">What happens if I miss a student loan payment?</h4>
            <p>Missing a payment can result in late fees and damage to your credit score. It's important to contact your loan servicer if you anticipate difficulty making payments.</p>
          </div>
          <div>
            <h4 className="font-semibold">Are student loans forgiven after a certain period?</h4>
            <p>Some federal student loans may be forgiven after 20-25 years of qualifying payments under income-driven repayment plans.</p>
          </div>
          <div>
            <h4 className="font-semibold">How can I lower my student loan interest rate?</h4>
            <p>Refinancing or consolidating your loans may help you secure a lower interest rate, but this may affect your eligibility for certain repayment plans.</p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Student Loan Repayment Calculator"
      description="Plan your student loan repayment strategy. Estimate monthly payments and total interest costs under different repayment plans."
      widget={widget}
      editorial={editorial}
    />
  );
}