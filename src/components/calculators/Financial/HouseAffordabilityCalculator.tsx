import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen } from "lucide-react";

interface CalculationResult {
  maxAffordableHousePrice: number;
  monthlyPayment: number;
  totalLoanAmount: number;
  downPayment: number;
}

export default function HouseAffordabilityCalculator() {
  const [inputs, setInputs] = useState({
    annualIncome: "",
    monthlyDebts: "",
    downPayment: "",
    interestRate: "",
    loanTerm: ""
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo<CalculationResult | null>(() => {
    const annualIncome = parseFloat(inputs.annualIncome) || 0;
    const monthlyDebts = parseFloat(inputs.monthlyDebts) || 0;
    const downPayment = parseFloat(inputs.downPayment) || 0;
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12 || 0;
    const loanTerm = parseInt(inputs.loanTerm) * 12 || 0;

    if (annualIncome <= 0 || interestRate <= 0 || loanTerm <= 0) return null;

    const monthlyIncome = annualIncome / 12;
    const maxMonthlyPayment = monthlyIncome * 0.28 - monthlyDebts;
    const maxLoanAmount = (maxMonthlyPayment / interestRate) * (1 - Math.pow(1 + interestRate, -loanTerm));
    const maxAffordableHousePrice = maxLoanAmount + downPayment;

    return {
      maxAffordableHousePrice: Math.max(0, maxAffordableHousePrice),
      monthlyPayment: Math.max(0, maxMonthlyPayment),
      totalLoanAmount: Math.max(0, maxLoanAmount),
      downPayment: Math.max(0, downPayment)
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
          <Label htmlFor="annualIncome">Annual Income ($)</Label>
          <Input
            id="annualIncome"
            type="number"
            value={inputs.annualIncome}
            onChange={(e) => setInputs({ ...inputs, annualIncome: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="monthlyDebts">Monthly Debts ($)</Label>
          <Input
            id="monthlyDebts"
            type="number"
            value={inputs.monthlyDebts}
            onChange={(e) => setInputs({ ...inputs, monthlyDebts: e.target.value })}
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
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.01"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })}
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
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg text-lg">Calculate</Button>

      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Max Affordable House Price: ${results.maxAffordableHousePrice.toFixed(2)}</p>
              <p>Estimated Monthly Payment: ${results.monthlyPayment.toFixed(2)}</p>
              <p>Total Loan Amount: ${results.totalLoanAmount.toFixed(2)}</p>
              <p>Down Payment: ${results.downPayment.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6">Understanding Your Home Buying Power</h2>
        <p>Buying a home is one of the most significant financial decisions you'll make. This calculator helps you understand how much house you can afford based on your income, debts, and down payment.</p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-semibold mb-4">The Affordability Formula</h3>
        <p>The formula to determine your maximum affordable house price is:</p>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p><strong>Max Affordable House Price = (Max Loan Amount + Down Payment)</strong></p>
          <p>Where:</p>
          <ul className="list-disc pl-5">
            <li>Max Loan Amount = (Max Monthly Payment / Interest Rate) * (1 - (1 + Interest Rate)<sup>-Loan Term</sup>)</li>
            <li>Max Monthly Payment = (Annual Income / 12) * 0.28 - Monthly Debts</li>
          </ul>
        </div>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-semibold mb-4">Step-by-Step Example</h3>
        <p>Let's walk through an example. Suppose you have an annual income of $100,000, monthly debts of $500, a down payment of $20,000, an interest rate of 3.5%, and a loan term of 30 years.</p>
        <ol className="list-decimal pl-5">
          <li>Calculate monthly income: $100,000 / 12 = $8,333.33</li>
          <li>Determine max monthly payment: $8,333.33 * 0.28 - $500 = $1,833.33</li>
          <li>Calculate max loan amount using the formula: (1,833.33 / (0.035 / 12)) * (1 - (1 + 0.035 / 12)<sup>-360</sup>) = $379,475.44</li>
          <li>Determine max affordable house price: $379,475.44 + $20,000 = $399,475.44</li>
        </ol>
      </section>

      <section id="real-world-scenarios">
        <h3 className="text-2xl font-semibold mb-4">Real-World Scenarios</h3>
        <p>Consider these scenarios to better understand how different factors influence affordability:</p>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold">Scenario 1: Young Professional</h4>
            <p>A young professional with a stable job and minimal debt might afford a higher-priced home due to a higher income-to-debt ratio.</p>
          </div>
          <div>
            <h4 className="font-bold">Scenario 2: Growing Family</h4>
            <p>A family with children might have higher monthly expenses, reducing the amount available for a mortgage payment.</p>
          </div>
          <div>
            <h4 className="font-bold">Scenario 3: Retiree</h4>
            <p>A retiree with a fixed income may need to consider a smaller home or a larger down payment to keep monthly payments manageable.</p>
          </div>
        </div>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h3>
        <ul className="space-y-4">
          <li>
            <h4 className="font-bold">What is the 28/36 rule?</h4>
            <p>The 28/36 rule is a guideline for determining how much of your income should go toward housing and debt. It suggests spending no more than 28% of your gross monthly income on housing expenses and no more than 36% on total debt.</p>
          </li>
          <li>
            <h4 className="font-bold">How does my credit score affect affordability?</h4>
            <p>A higher credit score can qualify you for better interest rates, reducing monthly payments and increasing the amount you can afford.</p>
          </li>
          <li>
            <h4 className="font-bold">Can I afford a house with a low down payment?</h4>
            <p>While it's possible to buy a house with a low down payment, it may result in higher monthly payments and additional costs like private mortgage insurance (PMI).</p>
          </li>
          <li>
            <h4 className="font-bold">What other costs should I consider?</h4>
            <p>In addition to the mortgage, consider property taxes, insurance, maintenance, and potential homeowners association fees.</p>
          </li>
          <li>
            <h4 className="font-bold">Should I get pre-approved for a mortgage?</h4>
            <p>Getting pre-approved can give you a better idea of your budget and make you a more attractive buyer to sellers.</p>
          </li>
          <li>
            <h4 className="font-bold">How can I improve my affordability?</h4>
            <p>Increasing your income, reducing debt, and saving for a larger down payment can all improve your affordability.</p>
          </li>
        </ul>
      </section>

      <section id="references">
        <h3 className="text-2xl font-semibold mb-4">References</h3>
        <ul className="list-disc pl-5">
          <li><a href="https://www.federalreserve.gov" className="text-blue-600 hover:underline">Federal Reserve</a></li>
          <li><a href="https://www.consumerfinance.gov" className="text-blue-600 hover:underline">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.hud.gov" className="text-blue-600 hover:underline">U.S. Department of Housing and Urban Development</a></li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="How Much House Can I Afford? Calculator"
      description="Determine your home buying budget based on income, debt, and down payment using this comprehensive affordability calculator."
      widget={widget}
      editorial={editorial}
    />
  );
}