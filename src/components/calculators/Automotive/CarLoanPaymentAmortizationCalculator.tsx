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

  // Calculate monthly payment using amortization formula:
  // P = (r * PV) / (1 - (1 + r)^-n)
  // where:
  // P = monthly payment
  // PV = loan amount (price)
  // r = monthly interest rate (annual rate / 12 / 100)
  // n = total number of payments (term in months)
  const results = useMemo(() => {
    const price = parseFloat(inputs.price);
    const annualRate = parseFloat(inputs.rate);
    const termYears = parseFloat(inputs.term);

    if (
      isNaN(price) || price <= 0 ||
      isNaN(annualRate) || annualRate < 0 ||
      isNaN(termYears) || termYears <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    const n = termYears * 12; // total months
    const r = annualRate / 100 / 12; // monthly interest rate

    let monthlyPayment: number;

    if (r === 0) {
      // No interest loan
      monthlyPayment = price / n;
    } else {
      monthlyPayment = (r * price) / (1 - Math.pow(1 + r, -n));
    }

    // Total payment over the loan term
    const totalPayment = monthlyPayment * n;
    // Total interest paid
    const totalInterest = totalPayment - price;

    return {
      primary: monthlyPayment.toFixed(2),
      secondary: `$${monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} / month`,
      details: `Loan Amount: $${price.toLocaleString()} | Interest Rate: ${annualRate}% APR | Term: ${termYears} years | Total Interest: $${totalInterest.toFixed(2)}`,
      feedback: "Calculated monthly payment"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How is the monthly car loan payment calculated?",
      answer:
        "The monthly car loan payment is calculated using the amortization formula, which takes into account the loan amount, the annual interest rate, and the loan term in years. The formula converts the annual interest rate to a monthly rate and calculates payments so that the loan is fully paid off by the end of the term. This ensures consistent monthly payments covering both principal and interest."
    },
    {
      question: "What happens if the interest rate is zero?",
      answer:
        "If the interest rate is zero, the loan is considered interest-free. In this case, the monthly payment is simply the loan amount divided evenly by the total number of months in the loan term. This means you pay back only the principal amount without any additional interest charges."
    },
    {
      question: "Can I use this calculator for loans with different compounding periods?",
      answer:
        "This calculator assumes monthly compounding, which is standard for most car loans. If your loan uses a different compounding period, such as daily or quarterly, the results may vary slightly. For precise calculations, consult your lender or use a calculator tailored to your loan's compounding frequency."
    },
    {
      question: "Why is it important to know the total interest paid?",
      answer:
        "Knowing the total interest paid over the life of the loan helps you understand the true cost of financing your vehicle. It allows you to compare different loan offers, evaluate refinancing options, and make informed decisions about your budget and financial planning."
    },
    {
      question: "Can I use this calculator to estimate affordability?",
      answer:
        "Yes, this calculator helps estimate your monthly payment based on the loan amount, interest rate, and term. By knowing your expected monthly payment, you can assess whether the loan fits within your budget and plan accordingly before committing to a car purchase."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with a 5.5% annual interest rate over a 6-year term.",
    steps: [
      {
        label: "Step 1: Identify Inputs",
        explanation:
          "Loan Amount (Price) = $35,000, Annual Interest Rate = 5.5%, Term = 6 years."
      },
      {
        label: "Step 2: Convert Annual Rate to Monthly Rate",
        explanation:
          "Monthly Interest Rate (r) = 5.5% / 12 / 100 = 0.0045833."
      },
      {
        label: "Step 3: Calculate Total Number of Payments",
        explanation:
          "Total Payments (n) = 6 years × 12 months = 72 months."
      },
      {
        label: "Step 4: Apply Amortization Formula",
        explanation:
          "Monthly Payment (P) = (r × PV) / (1 - (1 + r)^-n) = (0.0045833 × 35000) / (1 - (1 + 0.0045833)^-72) ≈ $599.42."
      },
      {
        label: "Step 5: Calculate Total Interest Paid",
        explanation:
          "Total Payment = $599.42 × 72 = $43,156.24; Total Interest = $43,156.24 - $35,000 = $8,156.24."
      }
    ],
    result:
      "The monthly payment is approximately $599.42, and the total interest paid over 6 years will be about $8,156.24."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Investopedia - Amortization",
      description:
        "Comprehensive explanation of amortization and loan payment calculations.",
      url: "https://www.investopedia.com/terms/a/amortization.asp"
    },
    {
      title: "Consumer Financial Protection Bureau - Car Loans",
      description:
        "Official guidance on car loans, financing, and understanding loan terms.",
      url: "https://www.consumerfinance.gov/consumer-tools/auto-loans/"
    },
    {
      title: "Edmunds - Car Loan Calculator",
      description:
        "Trusted automotive site offering loan calculators and buying advice.",
      url: "https://www.edmunds.com/calculators/car-loan.html"
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
            placeholder="e.g. 5.5"
            value={inputs.rate}
            onChange={(e) => handleInputChange("rate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Loan Term (years)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 6"
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Enter the total price of the car you intend to finance in the "Car Price" field.
          </li>
          <li>
            <strong>Step 2:</strong> Input the annual interest rate (APR) offered by your lender in the "Annual Interest Rate" field.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the loan term in years in the "Loan Term" field.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to compute your estimated monthly payment and view detailed loan information.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results to understand your monthly financial commitment and total interest paid over the loan term.
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
            Financing a vehicle is a significant financial decision that requires a clear understanding of your monthly obligations and the overall cost of the loan. This calculator uses the amortization formula to provide an accurate estimate of your monthly car loan payment based on the loan amount, interest rate, and loan term. The amortization process breaks down each payment into principal and interest components, ensuring the loan is fully paid off by the end of the term.
          </p>
          <p>
            To use the calculator effectively, input the total price of the car you plan to finance, the annual percentage rate (APR) your lender offers, and the length of the loan in years. The calculator converts the APR to a monthly interest rate and determines the total number of monthly payments. It then applies the amortization formula to compute the fixed monthly payment amount. This payment covers both the interest accrued and the principal repayment, allowing you to budget accurately.
          </p>
          <p>
            Understanding your monthly payment helps you assess affordability and compare different loan offers. Additionally, the calculator provides insights into the total interest paid over the life of the loan, highlighting the true cost of financing. This information empowers you to make informed decisions, whether negotiating loan terms, considering a shorter loan duration to save interest, or evaluating refinancing options.
          </p>
          <p>
            Remember, while this calculator assumes monthly compounding and fixed interest rates, actual loan terms may vary. Always consult your lender for precise loan details and disclosures. Using this tool as a guide will help you plan your vehicle purchase with confidence and financial clarity.
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
            <strong>1. Ignoring Additional Costs:</strong> Many users forget to account for taxes, fees, insurance, and maintenance costs, which can significantly increase monthly expenses beyond the loan payment.
          </p>
          <p>
            <strong>2. Using Incorrect Interest Rates:</strong> Inputting the nominal interest rate instead of the APR or vice versa can lead to inaccurate payment estimates. Always use the APR provided by your lender.
          </p>
          <p>
            <strong>3. Misunderstanding Loan Term:</strong> Confusing months and years or entering an unrealistic loan term can distort results. Ensure the loan term is entered in years as specified.
          </p>
          <p>
            <strong>4. Assuming Zero Interest:</strong> Some may assume zero interest loans are common; however, most car loans include interest, and ignoring it will underestimate payments.
          </p>
          <p>
            <strong>5. Not Considering Credit Impact:</strong> Loan terms and interest rates depend on creditworthiness. This calculator does not factor in credit scores or lender-specific conditions.
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