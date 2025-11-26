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

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({ principal: "", annualInterestRate: "", years: "" });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo<CalculationResult | null>(() => {
    const principal = parseFloat(inputs.principal) || 0;
    const annualInterestRate = parseFloat(inputs.annualInterestRate) || 0;
    const years = parseInt(inputs.years) || 0;

    if (principal <= 0 || annualInterestRate <= 0 || years <= 0) return null;

    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const numberOfPayments = years * 12;
    const monthlyPayment = 
      (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    const amortizationSchedule = Array.from({ length: numberOfPayments }, (_, i) => {
      const interestForMonth = principal * monthlyInterestRate;
      const principalForMonth = monthlyPayment - interestForMonth;
      principal -= principalForMonth;
      return {
        month: i + 1,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: principal,
      };
    });

    return {
      monthlyPayment,
      totalInterest,
      totalPayment,
      amortizationSchedule,
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
          <Label htmlFor="principal">Loan Amount ($)</Label>
          <Input
            id="principal"
            value={inputs.principal}
            onChange={(e) => setInputs({ ...inputs, principal: e.target.value })}
            type="number"
            min="0"
            placeholder="e.g., 300000"
          />
        </div>
        <div>
          <Label htmlFor="annualInterestRate">Annual Interest Rate (%)</Label>
          <Input
            id="annualInterestRate"
            value={inputs.annualInterestRate}
            onChange={(e) => setInputs({ ...inputs, annualInterestRate: e.target.value })}
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 3.5"
          />
        </div>
        <div>
          <Label htmlFor="years">Loan Term (Years)</Label>
          <Input
            id="years"
            value={inputs.years}
            onChange={(e) => setInputs({ ...inputs, years: e.target.value })}
            type="number"
            min="0"
            placeholder="e.g., 30"
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

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6">Understanding Your Mortgage Payments</h2>
        <p>
          Navigating the world of mortgages can be daunting. Our Mortgage Payment & Amortization Calculator simplifies this process by providing clear insights into your monthly payments, interest costs, and the overall amortization schedule. Whether you're a first-time homebuyer or looking to refinance, understanding these elements is crucial for making informed financial decisions.
        </p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-semibold mb-4">The Mortgage Payment Formula</h3>
        <p>
          The formula to calculate your monthly mortgage payment is:
        </p>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mt-4">
          <p className="text-lg font-mono">
            M = P[r(1+r)^n] / [(1+r)^n – 1]
          </p>
        </div>
        <p className="mt-4">
          Where:
          <ul className="list-disc ml-6">
            <li><strong>M</strong> is your monthly payment.</li>
            <li><strong>P</strong> is the principal loan amount.</li>
            <li><strong>r</strong> is your monthly interest rate. This is your annual interest rate divided by 12.</li>
            <li><strong>n</strong> is your number of payments (the number of months you will be paying the loan).</li>
          </ul>
        </p>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-semibold mb-4">Step-by-Step Example</h3>
        <p>
          Let's say you have a loan amount of $300,000 with an annual interest rate of 3.5% over 30 years. Here's how you can calculate your monthly payment:
        </p>
        <ol className="list-decimal ml-6 mt-4">
          <li>Convert the annual interest rate to a monthly rate: 3.5% / 12 = 0.00291667</li>
          <li>Calculate the number of payments: 30 years * 12 months/year = 360 payments</li>
          <li>Apply the formula: M = 300,000[0.00291667(1+0.00291667)^360] / [(1+0.00291667)^360 – 1]</li>
          <li>Result: Your monthly payment is approximately $1,347.13</li>
        </ol>
      </section>

      <section id="real-world-scenarios">
        <h3 className="text-2xl font-semibold mb-4">Real-World Scenarios</h3>
        <p>
          Understanding how different scenarios affect your mortgage can help you make better financial decisions. Here are three distinct personas:
        </p>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold">First-Time Homebuyer</h4>
            <p>
              Jane is buying her first home and wants to understand how a 30-year mortgage with a 4% interest rate will impact her finances.
            </p>
          </div>
          <div>
            <h4 className="font-bold">Refinancer</h4>
            <p>
              John is considering refinancing his current mortgage to take advantage of lower interest rates. He wants to see how this will affect his monthly payments and total interest paid.
            </p>
          </div>
          <div>
            <h4 className="font-bold">Investor</h4>
            <p>
              Sarah is investing in rental properties and needs to calculate the mortgage payments to ensure her rental income covers her expenses.
            </p>
          </div>
        </div>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold">What is amortization?</h4>
            <p>
              Amortization is the process of spreading out a loan into a series of fixed payments over time.
            </p>
          </div>
          <div>
            <h4 className="font-bold">How does interest affect my mortgage?</h4>
            <p>
              Interest is the cost of borrowing money. The higher the interest rate, the more you will pay over the life of the loan.
            </p>
          </div>
          <div>
            <h4 className="font-bold">Can I pay off my mortgage early?</h4>
            <p>
              Yes, many lenders allow you to pay off your mortgage early, but it's important to check if there are any prepayment penalties.
            </p>
          </div>
          <div>
            <h4 className="font-bold">What is a fixed-rate mortgage?</h4>
            <p>
              A fixed-rate mortgage has an interest rate that remains the same for the entire term of the loan.
            </p>
          </div>
          <div>
            <h4 className="font-bold">What is an adjustable-rate mortgage?</h4>
            <p>
              An adjustable-rate mortgage (ARM) has an interest rate that may change periodically depending on changes in a corresponding financial index.
            </p>
          </div>
          <div>
            <h4 className="font-bold">How do I choose the right mortgage term?</h4>
            <p>
              The right mortgage term depends on your financial situation and goals. Shorter terms typically have higher monthly payments but lower total interest costs.
            </p>
          </div>
        </div>
      </section>

      <section id="references">
        <h3 className="text-2xl font-semibold mb-4">References</h3>
        <ul className="list-disc ml-6">
          <li><a href="https://www.federalreserve.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600">Federal Reserve</a></li>
          <li><a href="https://www.consumerfinance.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.hud.gov/" target="_blank" rel="noopener noreferrer" className="text-blue-600">U.S. Department of Housing and Urban Development (HUD)</a></li>
        </ul>
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