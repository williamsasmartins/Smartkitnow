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

export default function LeaseVsBuyCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    price: "",
    rate: "",
    term: "",
    leasePayment: "",
    leaseTerm: "",
    leaseResidual: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Helper: Calculate monthly payment for loan amortization
  // P = principal, r = monthly interest rate, n = number of months
  function calculateLoanPayment(P: number, annualRate: number, n: number) {
    if (annualRate === 0) return P / n;
    const r = annualRate / 12 / 100;
    return (P * r) / (1 - Math.pow(1 + r, -n));
  }

  // Helper: Calculate total lease cost (simplified)
  // leasePayment * leaseTerm + (price - residual) (depreciation) + interest on depreciation (money factor)
  // Here, we just calculate total lease payments + residual value (assuming you pay residual if you buy at end)
  // For simplicity, we just sum lease payments and residual value.
  // Money factor is usually lease rate / 2400, but we omit complex lease interest calc here.
  // User inputs lease payment, lease term, residual value.

  const results = useMemo(() => {
    const price = parseFloat(inputs.price);
    const rate = parseFloat(inputs.rate);
    const term = parseInt(inputs.term);
    const leasePayment = parseFloat(inputs.leasePayment);
    const leaseTerm = parseInt(inputs.leaseTerm);
    const leaseResidual = parseFloat(inputs.leaseResidual);

    if (
      isNaN(price) || price <= 0 ||
      isNaN(rate) || rate < 0 ||
      isNaN(term) || term <= 0 ||
      isNaN(leasePayment) || leasePayment < 0 ||
      isNaN(leaseTerm) || leaseTerm <= 0 ||
      isNaN(leaseResidual) || leaseResidual < 0
    ) {
      return {
        primary: "—",
        secondary: "Please enter valid inputs",
        details: "",
        feedback: ""
      };
    }

    // Calculate monthly loan payment
    const monthlyLoanPayment = calculateLoanPayment(price, rate, term);

    // Total cost of buying = monthly payment * term
    const totalBuyCost = monthlyLoanPayment * term;

    // Total cost of leasing = lease payment * lease term + residual value (if buying at end)
    // Usually residual is what you pay if you buy the car at lease end.
    const totalLeaseCost = leasePayment * leaseTerm + leaseResidual;

    // Difference
    const diff = totalBuyCost - totalLeaseCost;

    // Format results
    const formatCurrency = (v: number) =>
      v.toLocaleString("en-US", { style: "currency", currency: "USD" });

    return {
      primary: diff > 0 ? "Buying Costs More" : diff < 0 ? "Leasing Costs More" : "Costs Are Equal",
      secondary: `Buy Total: ${formatCurrency(totalBuyCost)} | Lease Total: ${formatCurrency(totalLeaseCost)}`,
      details: `Monthly Loan Payment: ${formatCurrency(monthlyLoanPayment)} | Lease Payment: ${formatCurrency(leasePayment)}`,
      feedback: diff > 0
        ? "Leasing is cheaper over the term."
        : diff < 0
        ? "Buying is cheaper over the term."
        : "Both options cost about the same."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What factors should I consider when deciding to lease or buy a car?",
      answer:
        "When deciding between leasing and buying a car, consider your driving habits, financial situation, and long-term plans. Leasing typically offers lower monthly payments and allows you to drive a new car every few years, but you don't own the vehicle at the end. Buying usually requires higher monthly payments but results in ownership, which can be more cost-effective over time if you keep the car long-term. Also, consider mileage limits, maintenance costs, and your credit score."
    },
    {
      question: "How does the interest rate affect the cost of buying a car?",
      answer:
        "The interest rate directly impacts your monthly loan payments and the total cost of buying a car. A higher interest rate means you pay more in interest over the loan term, increasing your overall cost. Conversely, a lower rate reduces your monthly payments and total interest paid. It's important to shop around for the best financing terms to minimize costs."
    },
    {
      question: "What is a residual value in a lease agreement?",
      answer:
        "Residual value is the estimated worth of the vehicle at the end of the lease term. It is used to calculate your monthly lease payments, as you essentially pay for the depreciation (difference between the purchase price and residual value) plus interest and fees. A higher residual value generally means lower monthly payments because the car retains more value."
    },
    {
      question: "Can I buy the car at the end of my lease?",
      answer:
        "Yes, most lease agreements include a buyout option allowing you to purchase the vehicle at the residual value once the lease ends. This can be a good option if the car’s market value is higher than the residual or if you want to keep the car long-term. Be sure to review your lease contract for specific terms and conditions."
    },
    {
      question: "Does leasing affect my credit score differently than buying?",
      answer:
        "Both leasing and buying a car involve credit checks and monthly payments that can affect your credit score. Making timely payments on either will help build your credit, while missed payments can harm it. Leasing may involve lower monthly payments, which can be easier to manage, but the impact on your credit score depends on your overall credit behavior."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with a 5% annual interest rate over 60 months versus leasing the same SUV with a $400 monthly lease payment for 36 months and a residual value of $20,000.",
    steps: [
      {
        label: "Step 1: Calculate monthly loan payment for buying",
        explanation:
          "Using the amortization formula, the monthly payment is calculated as: P = $35,000, r = 5% annual / 12 = 0.004167, n = 60 months. Monthly payment = (35000 * 0.004167) / (1 - (1 + 0.004167)^-60) ≈ $660.75."
      },
      {
        label: "Step 2: Calculate total cost of buying",
        explanation:
          "Total cost = monthly payment * term = $660.75 * 60 = $39,645."
      },
      {
        label: "Step 3: Calculate total cost of leasing",
        explanation:
          "Total lease payments = $400 * 36 = $14,400. Add residual value $20,000 (if buying at lease end), total lease cost = $14,400 + $20,000 = $34,400."
      },
      {
        label: "Step 4: Compare total costs",
        explanation:
          "Buying total cost: $39,645 vs Leasing total cost: $34,400. Leasing is cheaper by $5,245 over the term."
      }
    ],
    result: "In this example, leasing the SUV is financially cheaper over the term compared to buying, assuming you do not keep the car beyond the lease period."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "Edmunds Lease vs Buy Calculator",
      description: "A trusted tool to compare leasing and buying costs with detailed inputs.",
      url: "https://www.edmunds.com/calculators/lease-vs-buy.html"
    },
    {
      title: "Consumer Financial Protection Bureau - Leasing a Car",
      description: "Official guide explaining leasing terms, costs, and considerations.",
      url: "https://www.consumerfinance.gov/consumer-tools/auto-loans/leasing-a-car/"
    },
    {
      title: "Kelley Blue Book - Car Buying Advice",
      description: "Comprehensive resource for car pricing, leasing, and buying tips.",
      url: "https://www.kbb.com/car-advice/"
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
          <Label>Purchase Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="100"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder="e.g. 35000"
          />
        </div>
        <div className="space-y-2">
          <Label>Loan Interest Rate (Annual %)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.rate}
            onChange={(e) => handleInputChange("rate", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <Label>Loan Term (Months)</Label>
          <Input
            type="number"
            min="1"
            step="1"
            value={inputs.term}
            onChange={(e) => handleInputChange("term", e.target.value)}
            placeholder="e.g. 60"
          />
        </div>
        <Separator className="md:hidden" />
        <div className="space-y-2">
          <Label>Lease Monthly Payment ($)</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={inputs.leasePayment}
            onChange={(e) => handleInputChange("leasePayment", e.target.value)}
            placeholder="e.g. 400"
          />
        </div>
        <div className="space-y-2">
          <Label>Lease Term (Months)</Label>
          <Input
            type="number"
            min="1"
            step="1"
            value={inputs.leaseTerm}
            onChange={(e) => handleInputChange("leaseTerm", e.target.value)}
            placeholder="e.g. 36"
          />
        </div>
        <div className="space-y-2">
          <Label>Lease Residual Value ($)</Label>
          <Input
            type="number"
            min="0"
            step="100"
            value={inputs.leaseResidual}
            onChange={(e) => handleInputChange("leaseResidual", e.target.value)}
            placeholder="e.g. 20000"
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Estimated Result</span>
            <div className="text-3xl md:text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 italic text-sm text-slate-700 dark:text-slate-400">{results.feedback}</p>
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
            <strong>Enter the purchase price</strong> of the vehicle you are considering buying in the "Purchase Price" field.
          </li>
          <li>
            <strong>Input the loan interest rate</strong> (annual percentage rate) and the loan term in months for buying the car.
          </li>
          <li>
            <strong>Provide the lease details:</strong> monthly lease payment, lease term in months, and the residual value at lease end.
          </li>
          <li>
            <strong>Click the Calculate button</strong> to see a comparison of the total costs of buying versus leasing over the specified terms.
          </li>
          <li>
            <strong>Review the results</strong> which show the total cost for each option and a recommendation on which is financially cheaper.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Lease vs Buy Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Deciding whether to lease or buy a vehicle is a significant financial decision that depends on your personal circumstances, driving habits, and long-term goals. This calculator helps you compare the total costs of both options by considering the purchase price, loan interest rate, loan term, lease payments, lease term, and residual value. The core financial principle used here is amortization, which calculates your monthly loan payments based on the principal, interest rate, and term.
          </p>
          <p>
            When you buy a car, you typically take out a loan and make monthly payments until the loan is paid off. The monthly payment depends on the loan amount, interest rate, and loan duration. Over time, you build equity in the vehicle, and once the loan is paid off, you own the car outright. However, buying usually involves higher monthly payments compared to leasing.
          </p>
          <p>
            Leasing, on the other hand, is essentially a long-term rental. You pay monthly lease payments based on the vehicle's depreciation during the lease term plus interest and fees. The residual value is the estimated worth of the car at the end of the lease. Leasing often results in lower monthly payments but you do not own the car unless you choose to buy it at the end of the lease term by paying the residual value.
          </p>
          <p>
            This calculator simplifies the comparison by summing the total loan payments for buying and the total lease payments plus residual value for leasing. It provides a clear financial snapshot to help you decide which option is more cost-effective over your chosen terms. Remember to also consider other factors such as mileage limits, maintenance costs, and your preference for ownership versus flexibility.
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
            <strong>1. Ignoring total cost of ownership:</strong> Many people focus only on monthly payments without considering the total cost over the term, including interest, fees, and residuals.
          </p>
          <p>
            <strong>2. Overlooking mileage limits in leases:</strong> Exceeding mileage limits can result in costly penalties that make leasing more expensive than anticipated.
          </p>
          <p>
            <strong>3. Not factoring in maintenance and insurance:</strong> Leasing may require higher insurance coverage and maintenance costs that affect overall affordability.
          </p>
          <p>
            <strong>4. Assuming residual value is fixed:</strong> Residual values are estimates and market conditions can affect the actual buyout price at lease end.
          </p>
          <p>
            <strong>5. Forgetting tax implications:</strong> Taxes on leases and purchases vary by location and can impact monthly payments and total costs.
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
      title="Lease vs Buy Calculator"
      description="Professional automotive calculator: Lease vs Buy Calculator. Get accurate estimates, expert advice, and financial insights."
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