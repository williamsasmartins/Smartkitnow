import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen } from "lucide-react";

interface CalculationResult {
  maxVehiclePrice: number;
  monthlyPayment: number;
  loanAmount: number;
  totalInterest: number;
}

export default function CarLoanAffordabilityCalculator() {
  const [inputs, setInputs] = useState({ monthlyBudget: "", downPayment: "", loanTerm: "", interestRate: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo<CalculationResult | null>(() => {
    const monthlyBudget = parseFloat(inputs.monthlyBudget) || 0;
    const downPayment = parseFloat(inputs.downPayment) || 0;
    const loanTerm = parseFloat(inputs.loanTerm) || 0;
    const interestRate = parseFloat(inputs.interestRate) || 0;

    if (monthlyBudget <= 0 || loanTerm <= 0 || interestRate < 0) return null;

    const monthlyInterestRate = interestRate / 100 / 12;
    const loanAmount = (monthlyBudget / monthlyInterestRate) * (1 - Math.pow(1 + monthlyInterestRate, -loanTerm * 12));
    const maxVehiclePrice = loanAmount + downPayment;
    const totalInterest = loanAmount * monthlyInterestRate * loanTerm * 12 - loanAmount;

    return {
      maxVehiclePrice,
      monthlyPayment: monthlyBudget,
      loanAmount,
      totalInterest,
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
          <Label htmlFor="monthlyBudget">Monthly Budget ($)</Label>
          <Input
            id="monthlyBudget"
            type="number"
            value={inputs.monthlyBudget}
            onChange={(e) => setInputs({ ...inputs, monthlyBudget: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="downPayment">Down Payment ($)</Label>
          <Input
            id="downPayment"
            type="number"
            value={inputs.downPayment}
            onChange={(e) => setInputs({ ...inputs, downPayment: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="loanTerm">Loan Term (Years)</Label>
          <Input
            id="loanTerm"
            type="number"
            value={inputs.loanTerm}
            onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
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
              <p>Maximum Vehicle Price: ${results.maxVehiclePrice.toFixed(2)}</p>
              <p>Loan Amount: ${results.loanAmount.toFixed(2)}</p>
              <p>Total Interest: ${results.totalInterest.toFixed(2)}</p>
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
                <TableCell>Loan Amount</TableCell>
                <TableCell>${results.loanAmount.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Interest</TableCell>
                <TableCell>${results.totalInterest.toFixed(2)}</TableCell>
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
        <h2 className="text-3xl font-bold mb-6">Understanding Car Loan Affordability</h2>
        <p>Determining how much car you can afford is crucial for financial planning. Our calculator helps you estimate the maximum vehicle price based on your monthly budget and down payment.</p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-semibold mb-4">Formula for Calculating Maximum Vehicle Price</h3>
        <p>The formula used is:</p>
        <p className="font-mono text-lg">Max Vehicle Price = Loan Amount + Down Payment</p>
        <p>Where Loan Amount is calculated based on your monthly budget, interest rate, and loan term.</p>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-semibold mb-4">Step-by-Step Calculation Example</h3>
        <p>Let's assume you have a monthly budget of $500, a down payment of $2,000, a loan term of 5 years, and an interest rate of 3%.</p>
        <ol className="list-decimal list-inside">
          <li>Calculate the monthly interest rate: 3% / 12 = 0.0025</li>
          <li>Determine the loan amount using the formula: Loan Amount = $500 / 0.0025 * (1 - (1 + 0.0025)^(-60))</li>
          <li>Calculate the max vehicle price: Max Vehicle Price = Loan Amount + $2,000</li>
        </ol>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <ul className="space-y-4">
          <li><strong>What factors affect car loan affordability?</strong> Your monthly budget, down payment, loan term, and interest rate all play a role.</li>
          <li><strong>Can I afford a car with a low credit score?</strong> A lower credit score might result in higher interest rates, affecting your affordability.</li>
          <li><strong>How does the loan term impact my payments?</strong> Longer terms reduce monthly payments but increase total interest paid.</li>
          <li><strong>Should I make a larger down payment?</strong> A larger down payment reduces the loan amount, potentially lowering interest costs.</li>
          <li><strong>What is a good interest rate for a car loan?</strong> Rates vary based on credit score and market conditions; shop around for the best rate.</li>
          <li><strong>How can I improve my car loan terms?</strong> Improving your credit score and shopping around for better rates can help.</li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Car Loan Affordability Calculator"
      description="Find out how much car you can afford. Input your monthly budget and down payment to determine your maximum vehicle price."
      widget={widget}
      editorial={editorial}
    />
  );
}