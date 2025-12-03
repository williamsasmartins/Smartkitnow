import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, BookOpen } from "lucide-react";

export default function MortgageAmortizationCalculator() {
  const [inputs, setInputs] = useState({ principal: "", rate: "", term: "" });
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showFullTable, setShowFullTable] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const results = useMemo(() => {
    let principal = parseFloat(inputs.principal);
    let rate = parseFloat(inputs.rate) / 100 / 12;
    let term = parseInt(inputs.term) * 12;
    
    if (isNaN(principal) || isNaN(rate) || isNaN(term) || principal <= 0 || rate <= 0 || term <= 0) {
      return { main: 0, schedule: [] };
    }

    let monthlyPayment = (principal * rate) / (1 - Math.pow(1 + rate, -term));
    let schedule = [];
    let balance = principal;

    for (let i = 0; i < term; i++) {
      let interestPayment = balance * rate;
      let principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;
      schedule.push({
        month: i + 1,
        payment: monthlyPayment.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        balance: balance.toFixed(2),
      });
    }

    return { main: monthlyPayment.toFixed(2), schedule };
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
          <Label htmlFor="principal">Principal Amount</Label>
          <Input type="number" id="principal" name="principal" value={inputs.principal} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="rate">Annual Interest Rate (%)</Label>
          <Input type="number" id="rate" name="rate" value={inputs.rate} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="term">Loan Term (Years)</Label>
          <Input type="number" id="term" name="term" value={inputs.term} onChange={handleInputChange} />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full size-lg">Calculate</Button>
      {results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-500 border-none text-white shadow-xl">
            <CardContent className="pt-8 text-center">
              <div className="text-5xl font-bold">${results.main}</div>
              <div className="text-xl">Estimated Monthly Payment</div>
            </CardContent>
          </Card>
          {showFullTable && (
            <Card>
              <CardHeader>
                <CardTitle>Amortization Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.schedule.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>${row.payment}</TableCell>
                        <TableCell>${row.principalPayment}</TableCell>
                        <TableCell>${row.interestPayment}</TableCell>
                        <TableCell>${row.balance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          <Button onClick={() => setShowFullTable(!showFullTable)} className="w-full">
            {showFullTable ? "Hide" : "Show"} Full Amortization Schedule
          </Button>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="skn-editorial space-y-12 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
      <section id="introduction">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Understanding Mortgage Payment & Amortization Calculator</h2>
        <p className="mb-6">
          A mortgage payment and amortization calculator is an essential tool for anyone considering buying a home or refinancing an existing mortgage. It helps you understand how much your monthly payments will be, taking into account the principal, interest rate, and loan term. By providing these details, you can estimate your monthly obligations and plan your finances accordingly. Additionally, the amortization schedule offers a detailed breakdown of each payment, showing how much goes towards the principal and how much towards interest, helping you track the growth of your home equity over time.
        </p>
        <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500 my-8">
          <h4 className="font-bold flex items-center gap-2 text-blue-900 mb-2"><Info className="h-5 w-5"/> Key Insight</h4>
          <p className="text-blue-800">
            Understanding your mortgage payments is crucial for financial planning. The Consumer Financial Protection Bureau (CFPB) emphasizes the importance of knowing your loan's total cost over time, including how much you will pay in interest.
          </p>
        </div>
        <p>
          For more comprehensive financial planning, you might also want to check our <a href="/financial/loan-payment" className="text-blue-600 hover:underline">Loan Payment Calculator (Principal, Rate, Term)</a> or the <a href="/financial/extra-payments-payoff" className="text-blue-600 hover:underline">Extra Payments & Payoff Time Calculator</a> to see how additional payments can reduce your loan term and interest paid.
        </p>
      </section>
      
      <section id="formula">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">The Math Behind the Calculation</h2>
        <p className="mb-6">
          The calculation of mortgage payments involves a specific formula that considers the principal amount, the interest rate, and the number of payments. The formula is:
        </p>
        <div className="bg-slate-100 p-8 rounded-xl font-mono text-center my-8 border border-slate-200 text-xl">
          M = P[r(1+r)^n] / [(1+r)^n – 1]
        </div>
        <p>
          Where M is the total monthly mortgage payment, P is the principal loan amount, r is the monthly interest rate (annual rate divided by 12), and n is the number of payments (loan term in years multiplied by 12). This formula helps you determine the fixed monthly payment required to pay off the loan over the specified term.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">1. What is amortization?</h3>
            <p>
              Amortization is the process of spreading out a loan into a series of fixed payments over time. Each payment covers both interest and a portion of the principal balance. Over time, the interest portion decreases while the principal portion increases, allowing you to gradually pay off the loan. This process is essential for understanding how your loan balance decreases over time and how much of each payment goes towards reducing the principal.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">2. How does an increase in interest rates affect my mortgage payment?</h3>
            <p>
              An increase in interest rates will lead to higher monthly mortgage payments. This is because the interest component of your payment is calculated as a percentage of your remaining loan balance. If the interest rate increases, the amount you pay in interest each month will also increase, which in turn raises your total monthly payment. It's important to factor in potential rate changes, especially if you have an adjustable-rate mortgage.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">3. Can I pay off my mortgage early?</h3>
            <p>
              Yes, you can pay off your mortgage early by making extra payments towards the principal. This reduces the loan balance faster and decreases the total interest paid over the life of the loan. However, some lenders may charge prepayment penalties, so it's important to review your loan agreement. You can use our <a href="/financial/extra-payments-payoff" className="text-blue-600 hover:underline">Extra Payments & Payoff Time Calculator</a> to see the impact of additional payments.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">4. What is an amortization schedule?</h3>
            <p>
              An amortization schedule is a table that details each periodic payment on a loan over time. It breaks down the amount of each payment that goes towards principal and interest, as well as the remaining balance after each payment. This schedule helps borrowers understand how their payments are applied and how their loan balance decreases over time.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">5. How can I reduce my mortgage payments?</h3>
            <p>
              You can reduce your mortgage payments by refinancing to a lower interest rate, extending the loan term, or making a larger down payment to decrease the principal. Each option has its pros and cons, and it's important to consider how they align with your financial goals. Our <a href="/financial/refinance-savings" className="text-blue-600 hover:underline">Refinance Savings Calculator</a> can help you determine potential savings from refinancing.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">6. What is the difference between a fixed-rate and an adjustable-rate mortgage?</h3>
            <p>
              A fixed-rate mortgage has an interest rate that remains constant throughout the life of the loan, providing predictable monthly payments. In contrast, an adjustable-rate mortgage (ARM) has an interest rate that can change periodically, usually in relation to an index. This means your monthly payments can fluctuate, which can be beneficial if rates decrease but risky if they increase.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">7. Is it better to have a shorter loan term?</h3>
            <p>
              A shorter loan term typically means higher monthly payments, but it also results in less interest paid over the life of the loan and faster equity buildup. If you can afford the higher payments, a shorter term can be more cost-effective in the long run. However, it's important to ensure that the higher payments fit within your budget.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">8. How does refinancing affect my amortization schedule?</h3>
            <p>
              Refinancing replaces your existing mortgage with a new one, potentially with a different interest rate and term. This resets your amortization schedule based on the new terms. If you refinance to a lower rate or shorter term, you can save on interest payments and pay off your mortgage faster. Use our <a href="/financial/refinance-savings" className="text-blue-600 hover:underline">Refinance Savings Calculator</a> to explore potential benefits.
            </p>
          </div>
        </div>
      </section>
      
      <section id="references" className="border-t pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <a href="https://www.federalreserve.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Federal Reserve</a>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <a href="https://www.consumerfinance.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Consumer Financial Protection Bureau</a>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-0.5"/>
            <a href="https://www.fdic.gov" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Federal Deposit Insurance Corporation</a>
          </li>
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
        { id: "introduction", label: "Overview" }, 
        { id: "formula", label: "Formula" }, 
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      formula={{ formula: "M = P[r(1+r)^n] / [(1+r)^n – 1]", variables: [], title: "Formula" }}
      example={{ title: "Example", steps: [], result: "..." }}
      relatedCalculators={[
        {
          "title": "Loan Payment Calculator (Principal, Rate, Term)",
          "url": "/financial/loan-payment",
          "icon": "Calculator"
        },
        {
          "title": "Extra Payments & Payoff Time Calculator",
          "url": "/financial/extra-payments-payoff",
          "icon": "Calculator"
        },
        {
          "title": "Interest-Only Loan Calculator",
          "url": "/financial/interest-only-loan",
          "icon": "Calculator"
        },
        {
          "title": "Refinance Savings Calculator",
          "url": "/financial/refinance-savings",
          "icon": "Calculator"
        },
        {
          "title": "HELOC Payment Estimator",
          "url": "/financial/heloc-payment-estimator",
          "icon": "Calculator"
        },
        {
          "title": "Car Loan Affordability Calculator",
          "url": "/financial/car-loan-affordability",
          "icon": "Calculator"
        }
      ]}
    />
  );
}