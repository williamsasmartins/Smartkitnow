import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, TrendingUp, DollarSign, BookOpen, Lightbulb, CheckCircle, HelpCircle } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({ principal: "", interestRate: "", term: "" });
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showFullTable, setShowFullTable] = useState(false);

  // Logic to calculate the mortgage payment and amortization schedule
  const results = useMemo(() => {
    let monthlyPayment = 0;
    let schedule = [];
    const principal = parseFloat(inputs.principal);
    const interestRate = parseFloat(inputs.interestRate) / 100 / 12;
    const term = parseInt(inputs.term) * 12;

    if (!isNaN(principal) && !isNaN(interestRate) && !isNaN(term) && term > 0 && interestRate > 0) {
      monthlyPayment = (principal * interestRate) / (1 - Math.pow(1 + interestRate, -term));
      let balance = principal;
      for (let i = 0; i < term; i++) {
        const interestPayment = balance * interestRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        schedule.push({ month: i + 1, principalPayment, interestPayment, balance });
      }
    }

    return { main: monthlyPayment.toFixed(2), schedule };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => { resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 100);
  };

  const widget = (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="principal">Loan Principal</Label>
          <Input id="principal" type="number" value={inputs.principal} onChange={(e) => setInputs({ ...inputs, principal: e.target.value })} placeholder="Enter principal amount" />
        </div>
        <div>
          <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
          <Input id="interestRate" type="number" value={inputs.interestRate} onChange={(e) => setInputs({ ...inputs, interestRate: e.target.value })} placeholder="Enter interest rate" />
        </div>
        <div>
          <Label htmlFor="term">Loan Term (Years)</Label>
          <Input id="term" type="number" value={inputs.term} onChange={(e) => setInputs({ ...inputs, term: e.target.value })} placeholder="Enter loan term in years" />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg">Calculate</Button>
      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-500 border-none text-white shadow-xl">
            <CardContent className="pt-8 text-center">
              <div className="text-5xl font-bold">${results.main}</div>
              <p className="mt-2">Estimated Monthly Payment</p>
            </CardContent>
          </Card>
          {showFullTable && (
            <Card className="overflow-x-auto">
              <CardHeader>
                <CardTitle>Amortization Schedule</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Principal Payment</TableHead>
                    <TableHead>Interest Payment</TableHead>
                    <TableHead>Remaining Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.schedule.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.month}</TableCell>
                      <TableCell>${entry.principalPayment.toFixed(2)}</TableCell>
                      <TableCell>${entry.interestPayment.toFixed(2)}</TableCell>
                      <TableCell>${entry.balance.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
          <Button onClick={() => setShowFullTable(!showFullTable)} className="w-full">
            {showFullTable ? "Hide Amortization Schedule" : "Show Full Amortization Schedule"}
          </Button>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Understanding Mortgage Payment & Amortization Calculator</h2>
        <p className="mb-6">A mortgage payment and amortization calculator is a crucial tool for homeowners and potential buyers. It helps estimate monthly payments and provides a detailed breakdown of how each payment affects the principal and interest over time.</p>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 dark:text-blue-100 mb-2">
            <Info className="h-5 w-5"/> Key Insight
          </h4>
          <p className="text-blue-800 dark:text-blue-200">Understanding your mortgage amortization schedule can help you plan better for the future and make informed financial decisions.</p>
        </div>
      </section>

      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Mortgage Payment & Amortization Calculator Formula</h2>
        <p className="mb-6">The formula used to calculate the monthly mortgage payment is based on the principal amount, interest rate, and the loan term.</p>
        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 dark:border-slate-700 text-xl text-slate-900 dark:text-slate-100 overflow-x-auto shadow-sm">
          M = P[r(1+r)^n]/[(1+r)^n – 1]
        </div>
      </section>

      <section id="factors">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Key Factors Affecting Results</h2>
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">Interest Rate</h3>
        <p className="mb-4">The interest rate significantly impacts the total cost of the loan. A lower interest rate means lower monthly payments and less total interest paid over the life of the loan.</p>
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">Loan Term</h3>
        <p className="mb-4">The length of the loan term affects the monthly payment and the total interest paid. Longer terms usually mean lower monthly payments but more interest paid over time.</p>
      </section>

      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              What is amortization?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              Amortization is the process of paying off a debt over time through regular payments. Each payment covers both principal and interest, with the interest portion decreasing over time.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-start gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500 mt-0.5 shrink-0"/>
              How can I reduce my mortgage payments?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
              You can reduce your mortgage payments by refinancing at a lower interest rate, extending the loan term, or making a larger down payment.
            </p>
          </div>
          {/* Add more questions as needed */}
        </div>
      </section>

      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Official References</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Federal Reserve</a>
          </li>
          {/* Add more references as needed */}
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
      onThisPage={[
        { id: "introduction", label: "Understanding Mortgage Payment & Amortization Calculator" },
        { id: "formula", label: "Mortgage Payment & Amortization Calculator Formula" },
        { id: "factors", label: "Key Factors" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" }
      ]}
      formula={{ formula: "M = P[r(1+r)^n]/[(1+r)^n – 1]", variables: [], title: "Formula" }}
      example={{ title: "Example", steps: [], result: "..." }}
      relatedCalculators={[
        { title: "Loan Payment Calculator (Principal, Rate, Term)", url: "/financial/loan-payment", icon: "Calculator" },
        { title: "Extra Payments & Payoff Time Calculator", url: "/financial/extra-payments-payoff", icon: "Calculator" },
        { title: "Interest-Only Loan Calculator", url: "/financial/interest-only-loan", icon: "Calculator" },
        { title: "Refinance Savings Calculator", url: "/financial/refinance-savings", icon: "Calculator" },
        { title: "HELOC Payment Estimator", url: "/financial/heloc-payment-estimator", icon: "Calculator" },
        { title: "Car Loan Affordability Calculator", url: "/financial/car-loan-affordability", icon: "Calculator" }
      ]}
    />
  );
}