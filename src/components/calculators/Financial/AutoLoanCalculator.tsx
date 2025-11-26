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
  amortizationSchedule: Array<{ month: number; principal: number; interest: number; balance: number }>;
}

export default function AutoLoanCalculator() {
  const [inputs, setInputs] = useState({
    loanAmount: "",
    interestRate: "",
    loanTerm: "",
    tradeInValue: "",
    salesTax: "",
    fees: ""
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo<CalculationResult | null>(() => {
    const loanAmount = parseFloat(inputs.loanAmount) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const loanTerm = parseInt(inputs.loanTerm) || 0;
    const tradeInValue = parseFloat(inputs.tradeInValue) || 0;
    const salesTax = parseFloat(inputs.salesTax) / 100 || 0;
    const fees = parseFloat(inputs.fees) || 0;

    if (loanAmount <= 0 || interestRate < 0 || loanTerm <= 0) {
      return null;
    }

    const totalLoanAmount = loanAmount - tradeInValue + fees + (loanAmount * salesTax);
    const monthlyPayment = (totalLoanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTerm));
    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - totalLoanAmount;

    const amortizationSchedule = Array.from({ length: loanTerm }, (_, month) => {
      const interestPayment = totalLoanAmount * interestRate;
      const principalPayment = monthlyPayment - interestPayment;
      const balance = totalLoanAmount - principalPayment;
      return { month: month + 1, principal: principalPayment, interest: interestPayment, balance };
    });

    return { monthlyPayment, totalInterest, totalPayment, amortizationSchedule };
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
            placeholder="e.g., 25000"
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
            placeholder="e.g., 3.5"
          />
        </div>
        <div>
          <Label htmlFor="loanTerm">Loan Term (months)</Label>
          <Input
            id="loanTerm"
            type="number"
            value={inputs.loanTerm}
            onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
            placeholder="e.g., 60"
          />
        </div>
        <div>
          <Label htmlFor="tradeInValue">Trade-In Value</Label>
          <Input
            id="tradeInValue"
            type="number"
            value={inputs.tradeInValue}
            onChange={(e) => setInputs({ ...inputs, tradeInValue: e.target.value })}
            placeholder="e.g., 5000"
          />
        </div>
        <div>
          <Label htmlFor="salesTax">Sales Tax (%)</Label>
          <Input
            id="salesTax"
            type="number"
            value={inputs.salesTax}
            onChange={(e) => setInputs({ ...inputs, salesTax: e.target.value })}
            placeholder="e.g., 7"
          />
        </div>
        <div>
          <Label htmlFor="fees">Fees</Label>
          <Input
            id="fees"
            type="number"
            value={inputs.fees}
            onChange={(e) => setInputs({ ...inputs, fees: e.target.value })}
            placeholder="e.g., 300"
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
              {results.amortizationSchedule.map((row) => (
                <TableRow key={row.month}>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>${row.principal.toFixed(2)}</TableCell>
                  <TableCell>${row.interest.toFixed(2)}</TableCell>
                  <TableCell>${row.balance.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6">Understanding Auto Loans</h2>
        <p>Auto loans can be complex, but with the right tools, you can easily calculate your monthly payments and understand the total cost of your car purchase. This calculator helps you factor in trade-in values, sales tax, and additional fees to give you a comprehensive view of your auto loan.</p>
      </section>

      <section id="formula" className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
        <h3 className="text-2xl font-semibold mb-4">The Auto Loan Formula</h3>
        <p>The formula to calculate your monthly auto loan payment is:</p>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-lg font-mono">M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]</p>
          <ul className="list-disc pl-6 mt-4">
            <li><strong>M</strong> = Total monthly payment</li>
            <li><strong>P</strong> = Principal loan amount</li>
            <li><strong>i</strong> = Monthly interest rate (annual rate divided by 12 months)</li>
            <li><strong>n</strong> = Number of payments (loan term in months)</li>
          </ul>
        </div>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-semibold mb-4">Step-by-Step Calculation Example</h3>
        <p>Let's say you want to purchase a car with a loan amount of $25,000, an interest rate of 3.5% per annum, and a loan term of 60 months. You have a trade-in value of $5,000, sales tax of 7%, and additional fees of $300.</p>
        <ol className="list-decimal pl-6 mt-4">
          <li>Calculate the total loan amount: $25,000 - $5,000 + $300 + ($25,000 * 0.07) = $22,050</li>
          <li>Calculate the monthly interest rate: 3.5% / 12 = 0.002916</li>
          <li>Use the formula to find the monthly payment: M = 22050 [0.002916(1 + 0.002916)^60] / [(1 + 0.002916)^60 – 1]</li>
          <li>The monthly payment is approximately $399.48</li>
        </ol>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <ul className="space-y-4">
          <li><strong>What is an auto loan?</strong> An auto loan is a sum of money borrowed to purchase a car, which is paid back with interest over a set period.</li>
          <li><strong>How is the interest rate determined?</strong> The interest rate is determined by the lender based on factors such as credit score, loan amount, and loan term.</li>
          <li><strong>Can I pay off my auto loan early?</strong> Yes, most lenders allow early repayment, but some may charge a prepayment penalty.</li>
          <li><strong>What is a trade-in value?</strong> Trade-in value is the amount a dealer credits you for your old car when purchasing a new one.</li>
          <li><strong>How does sales tax affect my loan?</strong> Sales tax increases the total loan amount, as it is added to the purchase price of the car.</li>
          <li><strong>What are additional fees?</strong> Additional fees may include documentation fees, registration fees, and any other charges associated with the loan.</li>
        </ul>
      </section>

      <section id="references">
        <h3 className="text-2xl font-semibold mb-4">References</h3>
        <ul className="list-disc pl-6">
          <li><a href="https://www.consumerfinance.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.federalreserve.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Federal Reserve</a></li>
          <li><a href="https://www.irs.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Internal Revenue Service</a></li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Auto Loan Calculator"
      description="Calculate your auto loan payments accurately. Factor in trade-in value, sales tax, and fees to get a clear picture of your car purchase."
      widget={widget}
      editorial={editorial}
    />
  );
}