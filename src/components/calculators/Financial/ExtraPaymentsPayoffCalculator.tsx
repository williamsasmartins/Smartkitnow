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
  totalInterestSaved: number;
  newPayoffDate: string;
  originalPayoffDate: string;
  originalInterest: number;
  newInterest: number;
}

export default function ExtraPaymentsPayoffCalculator() {
  // 2. State
  const [inputs, setInputs] = useState({
    loanAmount: "",
    interestRate: "",
    loanTerm: "",
    extraPayment: "",
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  // 3. Calculations
  const results = useMemo<CalculationResult | null>(() => {
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) || 0;
    const loanTerm = parseFloat(inputs.loanTerm) || 0;
    const extraPayment = parseFloat(inputs.extraPayment) || 0;
    
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) return null;

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    const monthlyPayment = loanAmount * monthlyInterestRate / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    const originalInterest = monthlyPayment * numberOfPayments - loanAmount;

    let remainingBalance = loanAmount;
    let newInterest = 0;
    let months = 0;

    while (remainingBalance > 0) {
      const interestForMonth = remainingBalance * monthlyInterestRate;
      newInterest += interestForMonth;
      const principalPayment = Math.min(monthlyPayment + extraPayment - interestForMonth, remainingBalance);
      remainingBalance -= principalPayment;
      months++;
    }

    const totalInterestSaved = originalInterest - newInterest;
    const newPayoffDate = new Date();
    newPayoffDate.setMonth(newPayoffDate.getMonth() + months);

    const originalPayoffDate = new Date();
    originalPayoffDate.setMonth(originalPayoffDate.getMonth() + numberOfPayments);

    return {
      totalInterestSaved,
      newPayoffDate: newPayoffDate.toLocaleDateString(),
      originalPayoffDate: originalPayoffDate.toLocaleDateString(),
      originalInterest,
      newInterest,
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
            type="number"
            placeholder="e.g. 250000"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
          <Input
            id="interestRate"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
            type="number"
            placeholder="e.g. 3.5"
          />
        </div>
        <div>
          <Label htmlFor="loanTerm">Loan Term (years)</Label>
          <Input
            id="loanTerm"
            value={inputs.loanTerm}
            onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
            type="number"
            placeholder="e.g. 30"
          />
        </div>
        <div>
          <Label htmlFor="extraPayment">Extra Payment per Month</Label>
          <Input
            id="extraPayment"
            value={inputs.extraPayment}
            onChange={(e) => setInputs({ ...inputs, extraPayment: e.target.value })}
            type="number"
            placeholder="e.g. 100"
          />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg text-lg">Calculate</Button>
      
      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Total Interest Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-green-600">${results.totalInterestSaved.toFixed(2)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>New Payoff Date</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-blue-600">{results.newPayoffDate}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Original Payoff Date</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-gray-600">{results.originalPayoffDate}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>New Interest Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-bold text-red-600">${results.newInterest.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detail</TableHead>
                <TableHead>Original</TableHead>
                <TableHead>With Extra Payments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Total Interest</TableCell>
                <TableCell>${results.originalInterest.toFixed(2)}</TableCell>
                <TableCell>${results.newInterest.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payoff Date</TableCell>
                <TableCell>{results.originalPayoffDate}</TableCell>
                <TableCell>{results.newPayoffDate}</TableCell>
              </TableRow>
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
          Discover how making extra payments on your loan can significantly reduce your payoff time and save you money on interest. This calculator helps you visualize the impact of additional monthly payments on your loan's payoff date and total interest paid.
        </p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-4">Formula</h3>
        <p className="text-lg">
          The formula to calculate the new payoff time with extra payments involves recalculating the monthly amortization schedule with the additional payment amount. The key is to apply the extra payment directly to the loan principal, thus reducing the balance faster.
        </p>
        <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
          <p className="text-lg font-mono">
            M = P[i(1+i)^n] / [(1+i)^n – 1]
          </p>
          <p className="text-sm mt-2">
            Where M is the total monthly mortgage payment, P is the principal loan amount, i is the monthly interest rate, and n is the number of payments.
          </p>
        </div>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-bold mb-4">Example Calculation</h3>
        <p className="text-lg">
          Suppose you have a $250,000 loan at a 3.5% interest rate for 30 years. By paying an extra $100 monthly, you can see how the payoff date changes and how much interest you save.
        </p>
        <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
          <p className="text-lg">
            Original Payoff Date: 30 years from now
          </p>
          <p className="text-lg">
            New Payoff Date with Extra $100: Approximately 27 years and 3 months
          </p>
          <p className="text-lg">
            Total Interest Saved: $15,000
          </p>
        </div>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold">How do extra payments affect my loan?</h4>
            <p className="text-lg">
              Extra payments reduce the principal balance faster, leading to less interest accrued over time and an earlier payoff date.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Can I make extra payments on any loan?</h4>
            <p className="text-lg">
              Most loans allow extra payments, but it's important to check with your lender for any restrictions or prepayment penalties.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold">Is it better to make extra payments or save the money?</h4>
            <p className="text-lg">
              This depends on your financial goals. Extra payments reduce debt and interest, while saving can provide liquidity and growth potential.
            </p>
          </div>
        </div>
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