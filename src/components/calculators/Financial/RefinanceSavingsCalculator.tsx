import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen } from "lucide-react";

interface CalculationResult {
  monthlySavings: number;
  lifetimeSavings: number;
  newMonthlyPayment: number;
  totalInterestPaid: number;
}

export default function RefinanceSavingsCalculator() {
  const [inputs, setInputs] = useState({
    currentLoanAmount: "",
    currentInterestRate: "",
    currentLoanTerm: "",
    newInterestRate: "",
    newLoanTerm: ""
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo<CalculationResult | null>(() => {
    const currentLoanAmount = parseFloat(inputs.currentLoanAmount) || 0;
    const currentInterestRate = parseFloat(inputs.currentInterestRate) / 100 || 0;
    const currentLoanTerm = parseInt(inputs.currentLoanTerm) || 0;
    const newInterestRate = parseFloat(inputs.newInterestRate) / 100 || 0;
    const newLoanTerm = parseInt(inputs.newLoanTerm) || 0;

    if (currentLoanAmount <= 0 || currentInterestRate <= 0 || currentLoanTerm <= 0 || newInterestRate <= 0 || newLoanTerm <= 0) {
      return null;
    }

    const currentMonthlyRate = currentInterestRate / 12;
    const newMonthlyRate = newInterestRate / 12;

    const currentMonthlyPayment = (currentLoanAmount * currentMonthlyRate) / (1 - Math.pow(1 + currentMonthlyRate, -currentLoanTerm * 12));
    const newMonthlyPayment = (currentLoanAmount * newMonthlyRate) / (1 - Math.pow(1 + newMonthlyRate, -newLoanTerm * 12));

    const totalInterestPaidCurrent = (currentMonthlyPayment * currentLoanTerm * 12) - currentLoanAmount;
    const totalInterestPaidNew = (newMonthlyPayment * newLoanTerm * 12) - currentLoanAmount;

    const monthlySavings = currentMonthlyPayment - newMonthlyPayment;
    const lifetimeSavings = totalInterestPaidCurrent - totalInterestPaidNew;

    return {
      monthlySavings,
      lifetimeSavings,
      newMonthlyPayment,
      totalInterestPaid: totalInterestPaidNew
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
          <Label htmlFor="currentLoanAmount">Current Loan Amount ($)</Label>
          <Input
            id="currentLoanAmount"
            value={inputs.currentLoanAmount}
            onChange={(e) => setInputs({ ...inputs, currentLoanAmount: e.target.value })}
            type="number"
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="currentInterestRate">Current Interest Rate (%)</Label>
          <Input
            id="currentInterestRate"
            value={inputs.currentInterestRate}
            onChange={(e) => setInputs({ ...inputs, currentInterestRate: e.target.value })}
            type="number"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="currentLoanTerm">Current Loan Term (years)</Label>
          <Input
            id="currentLoanTerm"
            value={inputs.currentLoanTerm}
            onChange={(e) => setInputs({ ...inputs, currentLoanTerm: e.target.value })}
            type="number"
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="newInterestRate">New Interest Rate (%)</Label>
          <Input
            id="newInterestRate"
            value={inputs.newInterestRate}
            onChange={(e) => setInputs({ ...inputs, newInterestRate: e.target.value })}
            type="number"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="newLoanTerm">New Loan Term (years)</Label>
          <Input
            id="newLoanTerm"
            value={inputs.newLoanTerm}
            onChange={(e) => setInputs({ ...inputs, newLoanTerm: e.target.value })}
            type="number"
            min="0"
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
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>New Monthly Payment:</span>
                <span>${results.newMonthlyPayment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Savings:</span>
                <span>${results.monthlySavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Lifetime Savings:</span>
                <span>${results.lifetimeSavings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Interest Paid:</span>
                <span>${results.totalInterestPaid.toFixed(2)}</span>
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
                <TableCell>New Monthly Payment</TableCell>
                <TableCell>${results.newMonthlyPayment.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Monthly Savings</TableCell>
                <TableCell>${results.monthlySavings.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lifetime Savings</TableCell>
                <TableCell>${results.lifetimeSavings.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Interest Paid</TableCell>
                <TableCell>${results.totalInterestPaid.toFixed(2)}</TableCell>
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
        <h2 className="text-3xl font-bold mb-6">Understanding Refinancing</h2>
        <p>Refinancing your mortgage can be a strategic financial decision. By securing a lower interest rate or adjusting your loan term, you can potentially save thousands of dollars over the life of your loan. This calculator helps you compare your current loan with new offers to determine if refinancing is right for you.</p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-semibold mb-4">Refinance Savings Formula</h3>
        <p>The formula to calculate your new monthly payment is:</p>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
          <p className="text-lg font-mono">M = P[r(1+r)^n] / [(1+r)^n – 1]</p>
          <p className="mt-2">Where:</p>
          <ul className="list-disc pl-6">
            <li><strong>M</strong> is the total monthly mortgage payment.</li>
            <li><strong>P</strong> is the principal loan amount.</li>
            <li><strong>r</strong> is the monthly interest rate (annual rate divided by 12 months).</li>
            <li><strong>n</strong> is the number of payments (loan term in years multiplied by 12 months).</li>
          </ul>
        </div>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-semibold mb-4">Step-by-Step Example</h3>
        <p>Let's assume you have a current loan of $200,000 at a 5% interest rate for 30 years. You are considering refinancing to a 3.5% interest rate for 30 years.</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Calculate the current monthly payment using the formula.</li>
          <li>Calculate the new monthly payment with the proposed interest rate.</li>
          <li>Determine the monthly savings by subtracting the new payment from the current payment.</li>
          <li>Calculate the total interest paid over the life of both loans to find lifetime savings.</li>
        </ol>
      </section>

      <section id="real-world-scenarios">
        <h3 className="text-2xl font-semibold mb-4">Real-World Scenarios</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-xl font-medium">Scenario 1: The Budget-Conscious Homeowner</h4>
            <p>John is looking to reduce his monthly expenses. By refinancing his mortgage, he can lower his monthly payments and free up cash for other needs.</p>
          </div>
          <div>
            <h4 className="text-xl font-medium">Scenario 2: The Long-Term Planner</h4>
            <p>Sarah plans to stay in her home for many years. Refinancing to a lower interest rate allows her to save significantly on interest over the life of the loan.</p>
          </div>
          <div>
            <h4 className="text-xl font-medium">Scenario 3: The Strategic Investor</h4>
            <p>Michael wants to leverage his home equity for investment opportunities. Refinancing provides him with the capital needed to diversify his investment portfolio.</p>
          </div>
        </div>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <ul className="space-y-4">
          <li>
            <h4 className="font-medium">What is refinancing?</h4>
            <p>Refinancing involves replacing your existing mortgage with a new one, typically to secure a lower interest rate or adjust the loan term.</p>
          </li>
          <li>
            <h4 className="font-medium">When should I consider refinancing?</h4>
            <p>Consider refinancing if you can lower your interest rate by at least 1%, or if you need to change your loan term to better fit your financial goals.</p>
          </li>
          <li>
            <h4 className="font-medium">Are there costs associated with refinancing?</h4>
            <p>Yes, refinancing usually involves closing costs similar to those incurred during the original mortgage process. These can include appraisal fees, origination fees, and more.</p>
          </li>
          <li>
            <h4 className="font-medium">How does refinancing affect my credit score?</h4>
            <p>Refinancing can temporarily lower your credit score due to the hard inquiry and the new credit account, but the impact is usually minor and short-lived.</p>
          </li>
          <li>
            <h4 className="font-medium">Can I refinance with bad credit?</h4>
            <p>It may be more challenging, but not impossible. Some lenders offer refinancing options for those with less-than-perfect credit, though the terms may not be as favorable.</p>
          </li>
          <li>
            <h4 className="font-medium">What are the benefits of refinancing?</h4>
            <p>Benefits include lower monthly payments, reduced interest costs, shorter loan terms, and the ability to tap into home equity for other financial needs.</p>
          </li>
        </ul>
      </section>

      <section id="references">
        <h3 className="text-2xl font-semibold mb-4">References</h3>
        <ul className="list-disc pl-6">
          <li><a href="https://www.federalreserve.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Federal Reserve</a></li>
          <li><a href="https://www.consumerfinance.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.hud.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">U.S. Department of Housing and Urban Development</a></li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Refinance Savings Calculator"
      description="Determine if refinancing is right for you. Compare current loan terms with new offers to calculate potential monthly and lifetime savings."
      widget={widget}
      editorial={editorial}
    />
  );
}