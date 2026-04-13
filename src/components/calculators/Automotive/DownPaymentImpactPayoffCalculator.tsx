import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Car, Fuel, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, Settings, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DownPaymentImpactPayoffCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    price: "",
    downPayment: "",
    rate: "",
    term: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: Calculate monthly payment using amortization formula
  // P = principal loan amount
  // r = monthly interest rate (annual rate / 12 / 100)
  // n = total number of payments (term in months)
  // Formula: M = P * r * (1 + r)^n / ((1 + r)^n - 1)
  function calculateMonthlyPayment(P: number, annualRate: number, termMonths: number) {
    if (annualRate === 0) return P / termMonths;
    const r = annualRate / 12 / 100;
    const numerator = P * r * Math.pow(1 + r, termMonths);
    const denominator = Math.pow(1 + r, termMonths) - 1;
    return numerator / denominator;
  }

  // Calculate payoff time given monthly payment and loan parameters
  // If monthly payment is fixed, payoff time can be found by solving for n:
  // n = -log(1 - r*P/M) / log(1 + r)
  // Returns months needed to pay off loan
  function calculatePayoffTime(P: number, annualRate: number, monthlyPayment: number) {
    if (monthlyPayment <= 0) return 0;
    if (annualRate === 0) return P / monthlyPayment;
    const r = annualRate / 12 / 100;
    const val = 1 - (r * P) / monthlyPayment;
    if (val <= 0) return 0; // Payment too low to cover interest
    const n = -Math.log(val) / Math.log(1 + r);
    return n;
  }

  const results = useMemo(() => {
    const price = parseFloat(inputs.price);
    const downPayment = parseFloat(inputs.downPayment);
    const rate = parseFloat(inputs.rate);
    const term = parseInt(inputs.term, 10);

    if (
      isNaN(price) ||
      isNaN(downPayment) ||
      isNaN(rate) ||
      isNaN(term) ||
      price <= 0 ||
      term <= 0 ||
      downPayment < 0 ||
      downPayment > price
    ) {
      return {
        primary: "—",
        secondary: "$0.00",
        details: "Please enter valid inputs.",
        feedback: "Invalid input values",
      };
    }

    const loanAmount = price - downPayment;

    // Monthly payment for full loan (0 down)
    const monthlyPaymentFullLoan = calculateMonthlyPayment(price, rate, term);

    // Monthly payment with down payment
    const monthlyPaymentWithDown = calculateMonthlyPayment(loanAmount, rate, term);

    // Calculate payoff time if monthly payment is fixed at monthlyPaymentFullLoan but down payment is made
    // This shows how payoff time shortens if you keep monthly payment same but reduce principal by down payment
    const payoffMonths = calculatePayoffTime(loanAmount, rate, monthlyPaymentFullLoan);

    // Format results
    const payoffYears = payoffMonths / 12;
    const payoffYearsRounded = payoffYears.toFixed(1);

    return {
      primary: `${payoffYearsRounded} years`,
      secondary: `$${monthlyPaymentWithDown.toFixed(2)} / month`,
      details: `Loan amount after down payment: $${loanAmount.toFixed(
        2
      )}. Monthly payment if no down payment: $${monthlyPaymentFullLoan.toFixed(
        2
      )}. Estimated payoff time if monthly payment stays at $${monthlyPaymentFullLoan.toFixed(
        2
      )}: ${payoffYearsRounded} years.`,
      feedback:
        payoffMonths < term
          ? "Down payment reduces payoff time."
          : "Payoff time unchanged or longer.",
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How does a larger down payment reduce my total payoff time?",
      answer: "A larger down payment reduces the loan principal, which means you're financing less of the vehicle's purchase price. For example, putting down $8,000 instead of $3,000 on a $25,000 car reduces your financed amount from $22,000 to $17,000. With a 6% APR over 60 months, this $5,000 increase in down payment can shorten your loan by 12–18 months and save you over $1,200 in interest charges.",
    },
    {
      question: "What is considered a good down payment percentage for a car?",
      answer: "Financial experts recommend putting down at least 10–20% of the vehicle's purchase price to secure better interest rates and avoid being underwater on your loan. For a $30,000 vehicle, that means $3,000–$6,000. A 20% down payment ($6,000) typically qualifies you for the best APR rates from lenders, while anything below 10% may result in subprime rates exceeding 8–10% APR.",
    },
    {
      question: "Can a 0% down payment car loan ever make financial sense?",
      answer: "A 0% down payment is rarely advisable because you immediately owe the full purchase price with no equity cushion, putting you at risk of being underwater (owing more than the car is worth). Additionally, lenders offering 0% down typically charge higher interest rates—often 6–9% APR—to offset risk, resulting in thousands of dollars in additional interest over the loan term compared to putting 10–20% down.",
    },
    {
      question: "How does interest rate affect my payoff time compared to down payment size?",
      answer: "Interest rate has a larger impact on total cost than payoff time, while down payment size primarily affects both. For a $25,000 car financed over 60 months with $5,000 down, the difference between 4% APR and 7% APR adds approximately $2,100 in interest charges but doesn't significantly shorten the 60-month term. However, increasing your down payment by $5,000 can reduce the loan term by 12–15 months at the same interest rate.",
    },
    {
      question: "What happens if I make extra payments toward my auto loan?",
      answer: "Making extra payments toward principal (not just paying twice per month) can substantially reduce payoff time and interest paid. For instance, on a $20,000 loan at 5% APR over 60 months, adding $100 extra per month can reduce your payoff time to approximately 48 months and save you roughly $800 in interest. Always verify with your lender that extra payments don't carry prepayment penalties.",
    },
    {
      question: "How does loan term length impact the relationship between down payment and payoff time?",
      answer: "Longer loan terms (72–84 months) reduce monthly payments but increase total interest paid, making down payment impact more pronounced. A $5,000 increase in down payment on a 72-month loan saves more total interest than on a 36-month loan, though the monthly savings are smaller. For example, increasing down payment by $5,000 on a $25,000 car at 6% APR saves roughly $1,500 over 72 months versus $450 over 36 months.",
    },
    {
      question: "What is the relationship between down payment and APR approval rates?",
      answer: "Lenders typically offer 0.5–2% better APR rates to buyers with down payments of 15–20% compared to those with &lt;5% down. A buyer with a 720 credit score and 20% down might qualify for 4.5% APR, while the same buyer with 5% down could face 6.5–7% APR. This APR difference compounds over the loan term: on a $20,000 financed amount, the 2% APR spread costs an additional $2,100–$2,500 in interest over 60 months.",
    },
    {
      question: "Should I deplete my emergency fund to make a larger down payment?",
      answer: "No—financial advisors recommend maintaining 3–6 months of living expenses in an emergency fund before increasing your down payment beyond 10–15%. While a larger down payment saves interest, an unexpected car repair, medical bill, or job loss without emergency savings can force you into high-interest debt. It's better to put down 15% and preserve liquidity than to max out your down payment and risk financial vulnerability.",
    },
    {
      question: "How do rebates and incentives factor into down payment strategy?",
      answer: "Manufacturer rebates and dealer incentives effectively reduce the vehicle's net price, which changes your optimal down payment percentage. If you receive a $3,000 rebate on a $30,000 vehicle, your effective purchase price is $27,000—meaning a 20% down payment is now $5,400 instead of $6,000. It's wise to apply rebates to reduce the financed amount rather than pocket them, as this accelerates payoff time and reduces interest by 15–20% compared to using the rebate elsewhere.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with a 5% annual interest rate over 60 months (5 years), comparing no down payment vs. a $5,000 down payment.",
    steps: [
      {
        label: "Step 1: Calculate loan amount",
        explanation:
          "Without down payment: $35,000. With $5,000 down payment: $35,000 - $5,000 = $30,000.",
      },
      {
        label: "Step 2: Calculate monthly payment without down payment",
        explanation:
          "Using amortization formula: P = $35,000, r = 5%/12 = 0.004167, n = 60.\nMonthly payment = $35,000 * 0.004167 * (1 + 0.004167)^60 / ((1 + 0.004167)^60 - 1) ≈ $660.75.",
      },
      {
        label: "Step 3: Calculate monthly payment with down payment",
        explanation:
          "P = $30,000, same r and n.\nMonthly payment ≈ $566.14.",
      },
      {
        label: "Step 4: Calculate payoff time if monthly payment stays at $660.75 but loan amount is $30,000",
        explanation:
          "Calculate n: n = -log(1 - r*P/M) / log(1 + r) = -log(1 - 0.004167*30000/660.75) / log(1.004167) ≈ 48.3 months (4.0 years).",
      },
      {
        label: "Result",
        explanation:
          "By making a $5,000 down payment and keeping monthly payments at $660.75, you pay off the loan about 12 months earlier, saving interest and reducing payoff time from 5 years to approximately 4 years.",
      },
    ],
    result:
      "Down payment reduces monthly payment from $660.75 to $566.14 or shortens payoff time to about 4 years if monthly payment stays at $660.75.",
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Investopedia - Amortization",
      description:
        "Comprehensive explanation of amortization and loan payment calculations.",
      url: "https://www.investopedia.com/terms/a/amortization.asp",
    },
    {
      title: "Consumer Financial Protection Bureau - Auto Loans",
      description:
        "Guidance on auto loan terms, interest rates, and financing options.",
      url: "https://www.consumerfinance.gov/consumer-tools/auto-loans/",
    },
    {
      title: "Edmunds - Car Financing Calculator",
      description:
        "Tool and advice for calculating car loan payments and understanding financing.",
      url: "https://www.edmunds.com/calculators/car-loan.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (US)</SelectItem>
            <SelectItem value="metric">Metric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Vehicle Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="100"
            placeholder="35000"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Down Payment ($)</Label>
          <Input
            type="number"
            min="0"
            step="100"
            placeholder="5000"
            value={inputs.downPayment}
            onChange={(e) => handleInputChange("downPayment", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Interest Rate (%)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="5.0"
            value={inputs.rate}
            onChange={(e) => handleInputChange("rate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Loan Term (months)</Label>
          <Input
            type="number"
            min="1"
            step="1"
            placeholder="60"
            value={inputs.term}
            onChange={(e) => handleInputChange("term", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Estimated Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Down Payment Impact & Payoff Time Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you understand how your down payment amount directly affects your monthly payment, total interest paid, and loan payoff timeline. By adjusting your down payment on a vehicle purchase, you can instantly see the financial impact across multiple scenarios—allowing you to make an informed decision about how much cash to put down upfront versus how much to finance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The key inputs are the vehicle's purchase price, your down payment amount (in dollars or percentage), the loan term (36–84 months), and the interest rate (APR). The calculator uses these variables to compute your financed principal, monthly payment obligation, and cumulative interest charges. Interest rate is especially important: even a 1% difference in APR can swing your total interest paid by $1,000–$3,000 over the loan term, so always shop around with multiple lenders before committing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret the results by comparing scenarios: notice how a $5,000 increase in down payment typically reduces payoff time by 12–18 months and saves thousands in interest. Use the output to balance your priorities—lower monthly payments (larger loan, longer term) versus faster payoff and less interest (larger down payment, shorter term). A good rule of thumb is to aim for a down payment of 15–20% and a loan term of 48–60 months to optimize both affordability and total cost.</p>
        </div>
      </section>

      {/* TABLE: Down Payment Impact on Total Interest Paid (60-Month Loan at 6% APR) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Down Payment Impact on Total Interest Paid (60-Month Loan at 6% APR)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how increasing your down payment reduces the principal financed and total interest charges on a $30,000 vehicle.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Down Payment Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Down Payment %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Principal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$579</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,740</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$34,740</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$521</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,266</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$31,266</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$464</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,792</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27,792</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$406</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,318</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,318</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$18,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$348</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,844</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,844</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$290</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,370</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$17,370</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations assume 6% APR, 60-month term, and no taxes/fees. Monthly payment rounded to nearest dollar.</p>
      </section>

      {/* TABLE: Payoff Time Reduction by Down Payment Size */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Payoff Time Reduction by Down Payment Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how larger down payments can shorten your loan term when making fixed monthly payments of $500.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vehicle Price</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Down Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment ($500)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Payoff Time (Months)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest at 5.5% APR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$22,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,087</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,851</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$17,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">39</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,614</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">61</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,504</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$24,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,224</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,945</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Fixed $500 monthly payment assumes no prepayment penalties. Interest calculations based on 5.5% APR.</p>
      </section>

      {/* TABLE: APR Rates by Down Payment and Credit Score (2024-2025 Auto Loan Benchmarks) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">APR Rates by Down Payment and Credit Score (2024-2025 Auto Loan Benchmarks)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Lender APR rates vary significantly based on down payment percentage and credit score; this table reflects typical rates across major financial institutions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Score Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0% Down</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10% Down</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20% Down</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Down Payment + Excellent Terms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">761–850 (Excellent)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.9%–5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5%–4.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.9%–3.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5%–3.2%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">701–760 (Good)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.8%–6.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.8%–5.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9%–4.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.4%–4.2%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">651–700 (Fair)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2%–8.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0%–7.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.1%–6.3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.6%–5.5%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;651 (Poor)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.2%–12.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.1%–10.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8%–9.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.2%–8.5%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates represent new vehicle loans and are based on Fed data and major lender surveys. Actual rates vary by lender, location, and loan term (36–84 months).</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator to model a 20% down payment scenario—doing so typically qualifies you for the best APR rates available, which can save $3,000–$5,000 over the loan term compared to financing with &lt;10% down.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Run multiple scenarios by adjusting interest rates to see the sensitivity of your payoff timeline; a 1% APR increase can extend your total interest cost by 15–25%, so always pre-qualify with lenders to lock in your actual rate before deciding on down payment size.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't deplete your emergency fund to maximize down payment—keeping 3–6 months of expenses in liquid savings is more valuable than saving an extra $2,000 in interest, since car repairs or job loss can force you into expensive debt.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider applying manufacturer rebates and incentives to reduce the financed principal rather than pocketing the cash; this approach accelerates your payoff and can save an additional $1,000–$2,000 in interest over the loan term.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring APR when focusing only on down payment size</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many buyers optimize their down payment but neglect to shop for rates across multiple lenders. A 2% APR difference costs $2,000–$3,500 more in interest over 60 months than a $2,000 difference in down payment, so always compare pre-qualified offers from at least three lenders before committing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Financing the full amount to preserve cash reserves</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While keeping cash reserves is prudent, financing 100% of a vehicle purchase typically results in subprime APR rates (8–10%) and being underwater on the loan from day one. A reasonable compromise is putting down 10–15% to qualify for standard rates while maintaining emergency savings.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking the total cost difference between loan terms</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Choosing a 72–84 month loan to lower monthly payments can cost $3,000–$5,000 more in interest than a 48–60 month loan. Always calculate total interest paid, not just the monthly payment, when deciding on loan length.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming trade-in value covers a sufficient down payment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Trade-in values fluctuate and often fall short of buyer expectations; relying on trade-in equity instead of cash down can leave you underwater if the vehicle depreciates quickly. Aim to provide cash down payment of 10–20% alongside any trade-in credit.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does a larger down payment reduce my total payoff time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A larger down payment reduces the loan principal, which means you're financing less of the vehicle's purchase price. For example, putting down $8,000 instead of $3,000 on a $25,000 car reduces your financed amount from $22,000 to $17,000. With a 6% APR over 60 months, this $5,000 increase in down payment can shorten your loan by 12–18 months and save you over $1,200 in interest charges.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered a good down payment percentage for a car?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Financial experts recommend putting down at least 10–20% of the vehicle's purchase price to secure better interest rates and avoid being underwater on your loan. For a $30,000 vehicle, that means $3,000–$6,000. A 20% down payment ($6,000) typically qualifies you for the best APR rates from lenders, while anything below 10% may result in subprime rates exceeding 8–10% APR.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can a 0% down payment car loan ever make financial sense?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 0% down payment is rarely advisable because you immediately owe the full purchase price with no equity cushion, putting you at risk of being underwater (owing more than the car is worth). Additionally, lenders offering 0% down typically charge higher interest rates—often 6–9% APR—to offset risk, resulting in thousands of dollars in additional interest over the loan term compared to putting 10–20% down.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does interest rate affect my payoff time compared to down payment size?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Interest rate has a larger impact on total cost than payoff time, while down payment size primarily affects both. For a $25,000 car financed over 60 months with $5,000 down, the difference between 4% APR and 7% APR adds approximately $2,100 in interest charges but doesn't significantly shorten the 60-month term. However, increasing your down payment by $5,000 can reduce the loan term by 12–15 months at the same interest rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I make extra payments toward my auto loan?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Making extra payments toward principal (not just paying twice per month) can substantially reduce payoff time and interest paid. For instance, on a $20,000 loan at 5% APR over 60 months, adding $100 extra per month can reduce your payoff time to approximately 48 months and save you roughly $800 in interest. Always verify with your lender that extra payments don't carry prepayment penalties.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does loan term length impact the relationship between down payment and payoff time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Longer loan terms (72–84 months) reduce monthly payments but increase total interest paid, making down payment impact more pronounced. A $5,000 increase in down payment on a 72-month loan saves more total interest than on a 36-month loan, though the monthly savings are smaller. For example, increasing down payment by $5,000 on a $25,000 car at 6% APR saves roughly $1,500 over 72 months versus $450 over 36 months.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the relationship between down payment and APR approval rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lenders typically offer 0.5–2% better APR rates to buyers with down payments of 15–20% compared to those with &lt;5% down. A buyer with a 720 credit score and 20% down might qualify for 4.5% APR, while the same buyer with 5% down could face 6.5–7% APR. This APR difference compounds over the loan term: on a $20,000 financed amount, the 2% APR spread costs an additional $2,100–$2,500 in interest over 60 months.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I deplete my emergency fund to make a larger down payment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—financial advisors recommend maintaining 3–6 months of living expenses in an emergency fund before increasing your down payment beyond 10–15%. While a larger down payment saves interest, an unexpected car repair, medical bill, or job loss without emergency savings can force you into high-interest debt. It's better to put down 15% and preserve liquidity than to max out your down payment and risk financial vulnerability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do rebates and incentives factor into down payment strategy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Manufacturer rebates and dealer incentives effectively reduce the vehicle's net price, which changes your optimal down payment percentage. If you receive a $3,000 rebate on a $30,000 vehicle, your effective purchase price is $27,000—meaning a 20% down payment is now $5,400 instead of $6,000. It's wise to apply rebates to reduce the financed amount rather than pocket them, as this accelerates payoff time and reduces interest by 15–20% compared to using the rebate elsewhere.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-a-good-auto-loan-interest-rate/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Auto Loan Rates and Terms | Consumer Financial Protection Bureau</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official CFPB guidance on auto loan interest rates, APR benchmarks, and how down payment affects loan approval and pricing.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/loans/auto-loan/calculator/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Auto Loan Calculator | Bankrate</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bankrate's auto loan calculator and comprehensive guides on down payment strategies, APR comparisons, and total cost of ownership.</p>
          </li>
          <li>
            <a href="https://www.nerdwallet.com/article/loans/auto-loans/how-to-buy-a-car" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">How to Buy a Car | NerdWallet</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NerdWallet's step-by-step guide covering down payment recommendations, interest rate negotiation, and long-term loan cost analysis.</p>
          </li>
          <li>
            <a href="https://www.federalreserve.gov/datadownload/Choose.aspx?rel=G19" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve: Recent Auto Loan Data and Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Reserve's consumer credit data including auto loan origination rates, loan terms, and down payment statistics by credit tier.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Down Payment Impact & Payoff Time"
      description="Professional automotive calculator: Down Payment Impact & Payoff Time. Get accurate estimates, expert advice, and financial insights."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}