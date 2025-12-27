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
      question: "How does a down payment affect my car loan payoff time?",
      answer:
        "A down payment reduces the principal amount you need to finance, which in turn lowers your monthly payments or shortens your loan term if you keep payments constant. By paying more upfront, you reduce the interest accrued over time, enabling you to pay off the loan faster and save money on interest. This calculator shows how different down payment amounts impact your payoff time and monthly payments.",
    },
    {
      question: "What is the amortization formula used in this calculator?",
      answer:
        "The amortization formula calculates the fixed monthly payment required to pay off a loan over a specified term at a given interest rate. It accounts for both principal and interest portions of each payment. This formula helps determine how much you pay monthly and how long it takes to fully repay the loan, factoring in your down payment and interest rate.",
    },
    {
      question: "Can I use this calculator for zero interest loans?",
      answer:
        "Yes, if the interest rate is zero, the calculator simply divides the loan amount by the term in months to find the monthly payment. The payoff time equals the loan term since no interest accrues. This scenario is straightforward and the calculator adjusts accordingly.",
    },
    {
      question: "Why is my payoff time sometimes shorter than the loan term?",
      answer:
        "If you keep your monthly payment the same as if you had no down payment but actually make a down payment, you effectively pay off the loan faster because your payments cover more principal each month. This reduces the total number of payments needed, shortening your payoff time.",
    },
    {
      question: "What inputs do I need to use this calculator accurately?",
      answer:
        "You need to enter the vehicle price, the amount of down payment you plan to make, the annual interest rate of your loan, and the loan term in months. Accurate inputs ensure the calculator provides realistic estimates of monthly payments and payoff time.",
    },
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
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Enter the total price of the vehicle you
            plan to purchase.
          </li>
          <li>
            <strong>Step 2:</strong> Input the amount you intend to pay upfront
            as a down payment.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the annual interest rate of your
            loan as a percentage (e.g., 5 for 5%).
          </li>
          <li>
            <strong>Step 4:</strong> Enter the loan term in months (e.g., 60
            months for 5 years).
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see how your down
            payment affects your monthly payment and payoff time.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Down
          Payment Impact & Payoff Time
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            When financing a vehicle, the down payment you make plays a crucial
            role in determining your monthly payments and the total time it
            takes to pay off your loan. A down payment reduces the principal
            amount borrowed, which directly lowers the interest you pay over
            the life of the loan. This calculator uses the amortization formula
            to estimate your monthly payments and payoff time based on your
            inputs.
          </p>
          <p>
            The amortization formula calculates fixed monthly payments by
            considering the loan amount, interest rate, and term. By entering
            your vehicle price, down payment, interest rate, and loan term, you
            can see how different down payment amounts impact your monthly
            payments and how quickly you can pay off your loan if you maintain
            a consistent monthly payment.
          </p>
          <p>
            For example, if you keep your monthly payment the same as if you
            had no down payment but actually make a down payment, you will pay
            off your loan faster. This is because a larger portion of each
            payment goes toward reducing the principal rather than interest.
            Conversely, if you reduce your monthly payment by making a down
            payment, your payoff time remains the same but your monthly burden
            is lighter.
          </p>
          <p>
            Understanding these dynamics helps you make informed decisions about
            how much to put down upfront and how to structure your loan for
            optimal financial benefit. Always consider your budget and financial
            goals when deciding on down payment and loan terms.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring the impact of down payment on interest:</strong>{" "}
            Many borrowers focus only on monthly payments without realizing that
            a higher down payment reduces the principal and total interest paid,
            shortening the loan payoff time.
          </p>
          <p>
            <strong>2. Using incorrect loan term units:</strong> Entering loan
            term in years instead of months or vice versa can lead to inaccurate
            calculations. Always ensure the term is in months.
          </p>
          <p>
            <strong>3. Overlooking fees and taxes:</strong> This calculator
            assumes the price is the financed amount before taxes and fees.
            Including these costs in your loan amount without adjusting inputs
            can skew results.
          </p>
          <p>
            <strong>4. Assuming zero interest rate incorrectly:</strong> If
            your loan has zero interest, use 0% as the rate. Any other value
            will produce incorrect monthly payments.
          </p>
          <p>
            <strong>5. Not validating inputs:</strong> Negative values or down
            payments exceeding the vehicle price will cause errors or misleading
            results.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {ref.description}
              </p>
            </div>
          ))}
        </div>
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