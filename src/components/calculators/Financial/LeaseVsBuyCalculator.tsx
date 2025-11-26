import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen } from "lucide-react";

interface CalculationResult {
  totalLeaseCost: number;
  totalBuyCost: number;
  monthlyLeasePayment: number;
  monthlyBuyPayment: number;
}

export default function LeaseVsBuyCalculator() {
  const [inputs, setInputs] = useState({
    leaseTerm: "",
    leaseMonthlyPayment: "",
    buyPrice: "",
    loanTerm: "",
    loanInterestRate: "",
    downPayment: "",
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo<CalculationResult | null>(() => {
    const leaseTerm = parseInt(inputs.leaseTerm) || 0;
    const leaseMonthlyPayment = parseFloat(inputs.leaseMonthlyPayment) || 0;
    const buyPrice = parseFloat(inputs.buyPrice) || 0;
    const loanTerm = parseInt(inputs.loanTerm) || 0;
    const loanInterestRate = parseFloat(inputs.loanInterestRate) || 0;
    const downPayment = parseFloat(inputs.downPayment) || 0;

    if (leaseTerm <= 0 || leaseMonthlyPayment <= 0 || buyPrice <= 0 || loanTerm <= 0 || loanInterestRate < 0 || downPayment < 0) {
      return null;
    }

    const totalLeaseCost = leaseMonthlyPayment * leaseTerm;
    const monthlyInterestRate = loanInterestRate / 100 / 12;
    const loanAmount = buyPrice - downPayment;
    const monthlyBuyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
    const totalBuyCost = monthlyBuyPayment * loanTerm + downPayment;

    return {
      totalLeaseCost,
      totalBuyCost,
      monthlyLeasePayment: leaseMonthlyPayment,
      monthlyBuyPayment,
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
          <Label htmlFor="leaseTerm">Lease Term (months)</Label>
          <Input id="leaseTerm" value={inputs.leaseTerm} onChange={(e) => setInputs({ ...inputs, leaseTerm: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="leaseMonthlyPayment">Monthly Lease Payment ($)</Label>
          <Input id="leaseMonthlyPayment" value={inputs.leaseMonthlyPayment} onChange={(e) => setInputs({ ...inputs, leaseMonthlyPayment: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="buyPrice">Buy Price ($)</Label>
          <Input id="buyPrice" value={inputs.buyPrice} onChange={(e) => setInputs({ ...inputs, buyPrice: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="loanTerm">Loan Term (months)</Label>
          <Input id="loanTerm" value={inputs.loanTerm} onChange={(e) => setInputs({ ...inputs, loanTerm: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="loanInterestRate">Loan Interest Rate (%)</Label>
          <Input id="loanInterestRate" value={inputs.loanInterestRate} onChange={(e) => setInputs({ ...inputs, loanInterestRate: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="downPayment">Down Payment ($)</Label>
          <Input id="downPayment" value={inputs.downPayment} onChange={(e) => setInputs({ ...inputs, downPayment: e.target.value })} />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg text-lg">Calculate</Button>
      
      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card>
            <CardHeader>
              <CardTitle>Lease vs Buy Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Option</TableHead>
                    <TableHead>Monthly Payment</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Lease</TableCell>
                    <TableCell>${results.monthlyLeasePayment.toFixed(2)}</TableCell>
                    <TableCell>${results.totalLeaseCost.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Buy</TableCell>
                    <TableCell>${results.monthlyBuyPayment.toFixed(2)}</TableCell>
                    <TableCell>${results.totalBuyCost.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6">Lease vs Buy: Making the Right Decision</h2>
        <p>Deciding whether to lease or buy a car is a significant financial decision. This calculator helps you compare the costs associated with each option, allowing you to make an informed choice based on your financial situation and preferences.</p>
      </section>

      <section id="formula" className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-2xl font-bold mb-4">Formula for Calculations</h3>
        <p><strong>Total Lease Cost:</strong> Lease Monthly Payment × Lease Term</p>
        <p><strong>Total Buy Cost:</strong> Monthly Buy Payment × Loan Term + Down Payment</p>
        <p><strong>Monthly Buy Payment:</strong> Calculated using the loan amortization formula.</p>
      </section>

      <section id="examples">
        <h3 className="text-2xl font-bold mb-4">Step-by-Step Example</h3>
        <p>Consider a scenario where you are deciding between leasing a car for $300 a month for 36 months, or buying the same car for $20,000 with a 5-year loan at 3% interest and a $2,000 down payment.</p>
        <ol className="list-decimal list-inside">
          <li>Calculate the total lease cost: $300 × 36 = $10,800.</li>
          <li>Calculate the loan amount: $20,000 - $2,000 = $18,000.</li>
          <li>Calculate the monthly buy payment using the amortization formula.</li>
          <li>Calculate the total buy cost: Monthly Buy Payment × 60 + $2,000.</li>
        </ol>
      </section>

      <section id="real-world-scenarios">
        <h3 className="text-2xl font-bold mb-4">Real-World Scenarios</h3>
        <p>Explore how different individuals might approach the lease vs buy decision:</p>
        <ul className="list-disc list-inside">
          <li><strong>Young Professional:</strong> Prefers leasing for lower monthly payments and the ability to drive a new car every few years.</li>
          <li><strong>Family with Kids:</strong> Chooses buying to eventually own the car and avoid mileage restrictions.</li>
          <li><strong>Retiree:</strong> Opts for buying to have a reliable vehicle without the hassle of returning a lease.</li>
        </ul>
      </section>

      <section id="faq">
        <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
        <ul className="list-none space-y-4">
          <li><strong>What are the benefits of leasing a car?</strong> Leasing offers lower monthly payments and the ability to drive a new car every few years.</li>
          <li><strong>What are the downsides of buying a car?</strong> Buying typically involves higher monthly payments and the risk of depreciation.</li>
          <li><strong>How does mileage affect leasing?</strong> Exceeding mileage limits on a lease can result in additional fees.</li>
          <li><strong>Can I negotiate a lease?</strong> Yes, many aspects of a lease can be negotiated, including the monthly payment and mileage limits.</li>
          <li><strong>What happens at the end of a lease?</strong> You can return the car, buy it, or lease a new one.</li>
          <li><strong>Is buying always cheaper in the long run?</strong> Not necessarily; it depends on factors like depreciation, interest rates, and how long you keep the car.</li>
        </ul>
      </section>

      <section id="references">
        <h3 className="text-2xl font-bold mb-4">References</h3>
        <ul className="list-disc list-inside">
          <li><a href="https://www.consumerfinance.gov" className="text-blue-600">Consumer Financial Protection Bureau</a></li>
          <li><a href="https://www.federalreserve.gov" className="text-blue-600">Federal Reserve</a></li>
          <li><a href="https://www.nada.org" className="text-blue-600">National Automobile Dealers Association</a></li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Lease vs Buy Calculator"
      description="Compare the costs of leasing versus buying a car. Analyze monthly payments and long-term value to make the smartest financial decision."
      widget={widget}
      editorial={editorial}
    />
  );
}