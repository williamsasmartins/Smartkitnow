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

export default function HelocPaymentEstimatorCalculator() {
  const [inputs, setInputs] = useState({ loanAmount: "", interestRate: "", drawPeriod: "", repaymentPeriod: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 || 0;
    const drawPeriod = parseInt(inputs.drawPeriod) || 0;
    const repaymentPeriod = parseInt(inputs.repaymentPeriod) || 0;

    if (loanAmount <= 0 || interestRate <= 0 || drawPeriod <= 0 || repaymentPeriod <= 0) {
      return null;
    }

    const monthlyInterestRate = interestRate / 12;
    const drawPeriodPayment = loanAmount * monthlyInterestRate;
    const repaymentPeriodMonths = repaymentPeriod * 12;
    const repaymentPeriodPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -repaymentPeriodMonths));
    const totalInterest = (drawPeriodPayment * drawPeriod * 12) + (repaymentPeriodPayment * repaymentPeriodMonths) - loanAmount;
    const totalPayment = loanAmount + totalInterest;

    return {
      monthlyPayment: repaymentPeriodPayment,
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
          <Label htmlFor="loanAmount">Loan Amount ($)</Label>
          <Input
            id="loanAmount"
            value={inputs.loanAmount}
            onChange={(e) => setInputs({ ...inputs, loanAmount: e.target.value })}
            type="number"
            min="0"
            placeholder="e.g., 50000"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 5.5"
          />
        </div>
        <div>
          <Label htmlFor="drawPeriod">Draw Period (years)</Label>
          <Input
            id="drawPeriod"
            value={inputs.drawPeriod}
            onChange={(e) => setInputs({ ...inputs, drawPeriod: e.target.value })}
            type="number"
            min="0"
            placeholder="e.g., 10"
          />
        </div>
        <div>
          <Label htmlFor="repaymentPeriod">Repayment Period (years)</Label>
          <Input
            id="repaymentPeriod"
            value={inputs.repaymentPeriod}
            onChange={(e) => setInputs({ ...inputs, repaymentPeriod: e.target.value })}
            type="number"
            min="0"
            placeholder="e.g., 20"
          />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg text-lg">Calculate</Button>
      
      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card>
            <CardHeader>
              <CardTitle>HELOC Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-semibold">Monthly Payment:</p>
                  <p className="text-2xl">${results.monthlyPayment.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Total Interest:</p>
                  <p className="text-2xl">${results.totalInterest.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">Total Payment:</p>
                  <p className="text-2xl">${results.totalPayment.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Detail</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Monthly Payment</TableCell>
                <TableCell>${results.monthlyPayment.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Interest Paid</TableCell>
                <TableCell>${results.totalInterest.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Payment</TableCell>
                <TableCell>${results.totalPayment.toFixed(2)}</TableCell>
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
        <h2 className="text-3xl font-bold mb-6">Understanding HELOC Payments</h2>
        <p>
          A Home Equity Line of Credit (HELOC) is a flexible loan option for homeowners that allows you to borrow against the equity of your home. 
          Understanding the payment structure of a HELOC is crucial for financial planning. This calculator helps you estimate your monthly payments 
          during both the draw and repayment periods.
        </p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-4">HELOC Payment Formula</h3>
        <p className="mb-2">The monthly payment during the repayment period is calculated using the formula:</p>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-lg">
            <strong>Monthly Payment = </strong>
            <span>(Loan Amount × Monthly Interest Rate) / (1 - (1 + Monthly Interest Rate)<sup>-Repayment Period Months</sup>)</span>
          </p>
        </div>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-bold mb-4">Step-by-Step Example</h3>
        <p>
          Let's say you have a HELOC with a loan amount of $50,000, an interest rate of 5%, a draw period of 10 years, and a repayment period of 20 years.
          During the draw period, you only pay interest, which would be approximately $208.33 per month. Once you enter the repayment period, your monthly 
          payment will be calculated to cover both principal and interest, resulting in a monthly payment of approximately $329.98.
        </p>
      </section>

      <section id="real-world-scenarios">
        <h3 className="text-2xl font-bold mb-4">Real-World Scenarios</h3>
        <p>
          <strong>Scenario 1:</strong> A young couple looking to renovate their home uses a HELOC to finance the project. They plan to pay off the loan 
          within 15 years, aligning with their financial goals.
        </p>
        <p>
          <strong>Scenario 2:</strong> A retiree uses a HELOC to supplement their income, ensuring they only draw what they need during the draw period 
          to minimize future payments.
        </p>
        <p>
          <strong>Scenario 3:</strong> An investor uses a HELOC to purchase additional properties, leveraging the equity in their primary residence to 
          expand their portfolio.
        </p>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>What is a HELOC?</strong> A HELOC is a line of credit secured by your home that gives you a revolving credit line to use for large expenses or to consolidate higher-interest rate debt.</li>
          <li><strong>How is the interest rate determined?</strong> The interest rate on a HELOC is typically variable and can change based on the prime rate or other index.</li>
          <li><strong>Can I pay off my HELOC early?</strong> Yes, you can pay off your HELOC early, but check with your lender for any prepayment penalties.</li>
          <li><strong>What happens at the end of the draw period?</strong> At the end of the draw period, you enter the repayment phase, where you must pay both principal and interest.</li>
          <li><strong>Is the interest on a HELOC tax-deductible?</strong> Interest on a HELOC may be tax-deductible if used for home improvements, but consult a tax advisor for specifics.</li>
          <li><strong>How do I qualify for a HELOC?</strong> Qualification typically requires sufficient home equity, a good credit score, and proof of income.</li>
        </ul>
      </section>

      <section id="references">
        <h3 className="text-2xl font-bold mb-4">References</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li><a href="https://www.federalreserve.gov/" className="text-blue-600 hover:underline">Federal Reserve</a></li>
          <li><a href="https://www.consumerfinance.gov/" className="text-blue-600 hover:underline">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.irs.gov/" className="text-blue-600 hover:underline">Internal Revenue Service</a></li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="HELOC Payment Estimator"
      description="Estimate monthly payments for a Home Equity Line of Credit (HELOC). Calculate costs during both the draw period and the repayment period."
      widget={widget}
      editorial={editorial}
    />
  );
}