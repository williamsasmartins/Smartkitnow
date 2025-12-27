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

export default function CarLoanPaymentAmortizationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    price: "",
    rate: "",
    term: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculates the monthly payment and amortization details for a car loan.
   * Formula:
   *   M = P * (r(1+r)^n) / ((1+r)^n - 1)
   * where:
   *   M = monthly payment
   *   P = loan principal (price)
   *   r = monthly interest rate (annual rate / 12 / 100)
   *   n = total number of payments (term in months)
   */
  const results = useMemo(() => {
    const P = parseFloat(inputs.price);
    const annualRate = parseFloat(inputs.rate);
    const termMonths = parseInt(inputs.term);

    if (isNaN(P) || P <= 0 || isNaN(annualRate) || annualRate < 0 || isNaN(termMonths) || termMonths <= 0) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    const r = annualRate / 100 / 12; // monthly interest rate

    let monthlyPayment: number;
    if (r === 0) {
      // No interest loan
      monthlyPayment = P / termMonths;
    } else {
      const numerator = r * Math.pow(1 + r, termMonths);
      const denominator = Math.pow(1 + r, termMonths) - 1;
      monthlyPayment = P * (numerator / denominator);
    }

    const totalPayment = monthlyPayment * termMonths;
    const totalInterest = totalPayment - P;

    return {
      primary: monthlyPayment.toFixed(2),
      secondary: `$${monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      details: `Total Interest Paid: $${totalInterest.toFixed(2)} over ${termMonths} months`,
      feedback: "Calculation successful"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What is a car loan amortization?",
      answer:
        "Car loan amortization is the process of spreading out your loan payments over a set period, typically monthly, so that each payment covers both principal and interest. This ensures the loan is fully paid off by the end of the term. Understanding amortization helps you see how much interest you pay over time and how your loan balance decreases."
    },
    {
      question: "How does the interest rate affect my monthly payment?",
      answer:
        "The interest rate directly impacts your monthly payment amount. A higher interest rate means you pay more interest over the loan term, increasing your monthly payments. Conversely, a lower rate reduces your monthly cost. Even a small change in rate can significantly affect total interest paid."
    },
    {
      question: "Can I pay off my car loan early?",
      answer:
        "Yes, most lenders allow early repayment of car loans, which can save you money on interest. However, some loans may have prepayment penalties or fees. Always check your loan agreement before making extra payments to avoid unexpected charges."
    },
    {
      question: "What is the difference between term and loan duration?",
      answer:
        "The term or loan duration refers to the total length of time you have to repay your car loan, usually expressed in months or years. It determines how many payments you will make. Longer terms reduce monthly payments but increase total interest paid, while shorter terms increase monthly payments but reduce interest."
    },
    {
      question: "Why is it important to know the total interest paid?",
      answer:
        "Knowing the total interest paid helps you understand the true cost of your loan beyond the car's price. It allows you to compare loan offers, evaluate refinancing options, and make informed financial decisions. Being aware of interest costs can motivate you to pay off your loan faster."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario: "Financing a $35,000 SUV with a 5% annual interest rate over a 60-month term.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation: "Principal (P) = $35,000, Annual Interest Rate = 5%, Term = 60 months."
      },
      {
        label: "Step 2: Calculate monthly interest rate",
        explanation: "Monthly interest rate (r) = 5% / 12 = 0.004167."
      },
      {
        label: "Step 3: Apply amortization formula",
        explanation:
          "Monthly payment M = P * (r(1+r)^n) / ((1+r)^n - 1) = 35000 * (0.004167 * (1.004167)^60) / ((1.004167)^60 - 1)."
      },
      {
        label: "Step 4: Calculate powers",
        explanation:
          "(1.004167)^60 ≈ 1.28336."
      },
      {
        label: "Step 5: Calculate numerator and denominator",
        explanation:
          "Numerator = 0.004167 * 1.28336 = 0.005347, Denominator = 1.28336 - 1 = 0.28336."
      },
      {
        label: "Step 6: Calculate monthly payment",
        explanation:
          "M = 35000 * (0.005347 / 0.28336) ≈ 35000 * 0.01887 = $660.45."
      },
      {
        label: "Step 7: Calculate total payment and interest",
        explanation:
          "Total payment = $660.45 * 60 = $39,627. Total interest = $39,627 - $35,000 = $4,627."
      }
    ],
    result: "Final monthly payment is approximately $660.45, with total interest paid of $4,627 over 5 years."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Investopedia - Amortization",
      description: "Comprehensive explanation of amortization and loan calculations.",
      url: "https://www.investopedia.com/terms/a/amortization.asp"
    },
    {
      title: "Consumer Financial Protection Bureau - Car Loans",
      description: "Official guidance on car loans and financing options.",
      url: "https://www.consumerfinance.gov/consumer-tools/auto-loans/"
    },
    {
      title: "Bankrate - Auto Loan Calculator",
      description: "Interactive calculator and tips for auto loans.",
      url: "https://www.bankrate.com/calculators/auto/auto-loan-calculator.aspx"
    }
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
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
          <Label>Car Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 35000"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Interest Rate (%)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 5"
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
            placeholder="e.g. 60"
            value={inputs.term}
            onChange={(e) => handleInputChange("term", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Monthly Payment</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">${results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.details}</div>
            <p className="text-xs text-slate-500 mt-2">{results.feedback}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Enter the total price of the car you want to finance in the "Car Price" field.
          </li>
          <li>
            <strong>Step 2:</strong> Input the annual interest rate (APR) offered by your lender in the "Annual Interest Rate" field.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the loan term in months (e.g., 60 for 5 years) in the "Loan Term" field.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to see your estimated monthly payment and total interest paid over the loan term.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results and adjust inputs if needed to explore different financing scenarios.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Car Loan Payment & Amortization Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Financing a car is a significant financial commitment that requires careful planning and understanding of loan terms. This calculator helps you estimate your monthly payments based on the car price, interest rate, and loan term. The core of the calculation is the amortization formula, which breaks down each payment into principal and interest components, ensuring the loan is fully paid off by the end of the term.
          </p>
          <p>
            The interest rate you enter is annual, but the calculator converts it to a monthly rate to accurately compute monthly payments. The loan term is the total number of months you plan to repay the loan. By adjusting these inputs, you can see how different scenarios affect your monthly budget and total interest paid. For example, a longer term reduces monthly payments but increases total interest, while a shorter term does the opposite.
          </p>
          <p>
            Understanding amortization schedules can empower you to make informed decisions, such as whether to refinance or pay extra toward your loan principal. This calculator provides a quick and reliable way to visualize your car loan payments and plan your finances accordingly.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring additional fees:</strong> Many buyers forget to account for taxes, registration, and dealer fees, which can increase the total loan amount and monthly payments.
          </p>
          <p>
            <strong>2. Using the wrong interest rate:</strong> Ensure you use the annual percentage rate (APR) and not just the nominal rate, as APR includes fees and gives a more accurate cost.
          </p>
          <p>
            <strong>3. Confusing loan term units:</strong> Always enter the loan term in months, not years, to avoid miscalculations.
          </p>
          <p>
            <strong>4. Overlooking prepayment penalties:</strong> Some loans charge fees for early repayment, which can affect your decision to pay off the loan faster.
          </p>
          <p>
            <strong>5. Not verifying input accuracy:</strong> Double-check all inputs for typos or unrealistic values to get reliable results.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Car Loan Payment & Amortization Calculator"
      description="Professional automotive calculator: Car Loan Payment & Amortization Calculator. Get accurate estimates, expert advice, and financial insights."
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
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}