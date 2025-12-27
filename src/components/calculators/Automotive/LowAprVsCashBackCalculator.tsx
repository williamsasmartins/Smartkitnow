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

export default function LowAprVsCashBackCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    vehiclePrice: "",
    downPayment: "",
    loanTermMonths: "",
    aprPercent: "",
    cashBackAmount: ""
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs(prev => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const price = parseFloat(inputs.vehiclePrice);
    const down = parseFloat(inputs.downPayment);
    const term = parseInt(inputs.loanTermMonths);
    const apr = parseFloat(inputs.aprPercent);
    const cashBack = parseFloat(inputs.cashBackAmount);

    if (
      isNaN(price) || price <= 0 ||
      isNaN(term) || term <= 0 ||
      (isNaN(apr) && isNaN(cashBack)) // At least one incentive must be provided
    ) {
      return {
        primary: "N/A",
        secondary: "",
        details: "Please enter valid inputs to calculate.",
        feedback: ""
      };
    }

    // Loan amount after down payment
    const loanAmount = price - (isNaN(down) ? 0 : down);

    // Monthly interest rate
    const monthlyRate = apr / 100 / 12;

    // Calculate monthly payment with APR (if APR given)
    // Formula: P = (r*L) / (1 - (1 + r)^-n)
    let monthlyPaymentAPR = 0;
    if (!isNaN(apr) && apr > 0) {
      monthlyPaymentAPR = (monthlyRate * loanAmount) / (1 - Math.pow(1 + monthlyRate, -term));
    } else {
      // If APR is 0 or not given, monthly payment is principal / term
      monthlyPaymentAPR = loanAmount / term;
    }

    // Total cost with APR incentive (no cash back)
    const totalCostAPR = monthlyPaymentAPR * term + (isNaN(down) ? 0 : down);

    // Total cost with cash back incentive (assume standard financing APR of 6.5% if APR not given)
    const standardAPR = 6.5 / 100 / 12;
    const monthlyPaymentStandard = (standardAPR * loanAmount) / (1 - Math.pow(1 + standardAPR, -term));
    const totalCostCashBack = monthlyPaymentStandard * term + (isNaN(down) ? 0 : down) - (isNaN(cashBack) ? 0 : cashBack);

    // Compare total costs
    let betterOption = "";
    let savings = 0;
    if (totalCostAPR < totalCostCashBack) {
      betterOption = `Low APR financing is better by $${(totalCostCashBack - totalCostAPR).toFixed(2)}`;
      savings = totalCostCashBack - totalCostAPR;
    } else if (totalCostCashBack < totalCostAPR) {
      betterOption = `Cash Back incentive is better by $${(totalCostAPR - totalCostCashBack).toFixed(2)}`;
      savings = totalCostAPR - totalCostCashBack;
    } else {
      betterOption = "Both options cost about the same.";
      savings = 0;
    }

    return {
      primary: betterOption,
      secondary: `Total Cost with Low APR: $${totalCostAPR.toFixed(2)} | Total Cost with Cash Back: $${totalCostCashBack.toFixed(2)}`,
      details: `Monthly Payment with Low APR: $${monthlyPaymentAPR.toFixed(2)} | Monthly Payment with Standard APR: $${monthlyPaymentStandard.toFixed(2)}`,
      feedback: savings > 0 ? `You save approximately $${savings.toFixed(2)} by choosing the better option.` : "No significant savings difference."
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How do I decide between a low APR offer and a cash back incentive?",
      answer:
        "Choosing between a low APR and cash back depends on your financing needs and how long you plan to keep the vehicle. A low APR reduces your interest payments over the loan term, potentially saving you more money if you finance for a longer period. Cash back provides immediate savings but may come with higher interest rates. Calculating total costs for both options helps identify which is financially better for your situation."
    },
    {
      question: "Can I combine low APR and cash back incentives?",
      answer:
        "Typically, manufacturers or dealers do not allow combining low APR financing with cash back incentives. You usually must choose one or the other. It's important to read the terms carefully or ask the dealer to clarify which incentives apply and if any stacking is possible."
    },
    {
      question: "Does the loan term affect which incentive is better?",
      answer:
        "Yes, the length of your loan term significantly impacts which incentive is more beneficial. Longer loan terms increase total interest paid, making a low APR more valuable. For shorter terms, cash back might offer better immediate savings. Always calculate total costs based on your expected loan duration."
    },
    {
      question: "What if I pay off my loan early?",
      answer:
        "If you plan to pay off your loan early, cash back incentives might be more advantageous since you reduce interest payments by shortening the loan duration. Low APR benefits accrue over time, so early payoff can diminish those savings. Consider your payment plans when choosing incentives."
    },
    {
      question: "Are there any hidden fees or conditions with these incentives?",
      answer:
        "Some incentives may have conditions such as minimum credit scores, specific loan terms, or dealer fees. Cash back might be taxable in some states, and low APR offers may require financing through the manufacturer's lender. Always review the fine print and consult with your dealer or financial advisor."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with a choice between a 2.9% APR for 60 months or a $2,000 cash back incentive with a standard 6.5% APR loan for 60 months.",
    steps: [
      {
        label: "Step 1: Calculate loan amount",
        explanation: "Assuming no down payment, loan amount is $35,000."
      },
      {
        label: "Step 2: Calculate monthly payment with 2.9% APR",
        explanation:
          "Monthly interest rate = 2.9% / 12 = 0.002417. Monthly payment = (0.002417 * 35000) / (1 - (1 + 0.002417)^-60) ≈ $627.41."
      },
      {
        label: "Step 3: Calculate total cost with low APR",
        explanation: "Total cost = $627.41 * 60 = $37,644.60."
      },
      {
        label: "Step 4: Calculate monthly payment with standard 6.5% APR",
        explanation:
          "Monthly interest rate = 6.5% / 12 = 0.005417. Monthly payment = (0.005417 * 35000) / (1 - (1 + 0.005417)^-60) ≈ $683.02."
      },
      {
        label: "Step 5: Calculate total cost with cash back",
        explanation: "Total cost = ($683.02 * 60) - $2,000 = $39,981.20 - $2,000 = $37,981.20."
      },
      {
        label: "Step 6: Compare total costs",
        explanation:
          "Low APR total cost: $37,644.60. Cash back total cost: $37,981.20. Low APR saves $336.60 over cash back."
      }
    ],
    result: "Choosing the 2.9% APR financing saves $336.60 compared to taking the $2,000 cash back with a higher APR."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and vehicle fuel efficiency."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing guide for new and used cars."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and buying advice."
    },
    {
      title: "Consumer Financial Protection Bureau - Auto Loans",
      description: "Guidance on auto loans, financing options, and consumer rights."
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
          <Label>Vehicle Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.vehiclePrice}
            onChange={(e) => handleInputChange("vehiclePrice", e.target.value)}
            placeholder="e.g. 35000"
          />
        </div>
        <div className="space-y-2">
          <Label>Down Payment ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.downPayment}
            onChange={(e) => handleInputChange("downPayment", e.target.value)}
            placeholder="e.g. 0"
          />
        </div>
        <div className="space-y-2">
          <Label>Loan Term (months)</Label>
          <Input
            type="number"
            min="1"
            step="1"
            value={inputs.loanTermMonths}
            onChange={(e) => handleInputChange("loanTermMonths", e.target.value)}
            placeholder="e.g. 60"
          />
        </div>
        <div className="space-y-2">
          <Label>Low APR Offer (%)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.aprPercent}
            onChange={(e) => handleInputChange("aprPercent", e.target.value)}
            placeholder="e.g. 2.9"
          />
        </div>
        <div className="space-y-2">
          <Label>Cash Back Incentive ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.cashBackAmount}
            onChange={(e) => handleInputChange("cashBackAmount", e.target.value)}
            placeholder="e.g. 2000"
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
            <div className="text-3xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-lg font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="mt-3 text-sm font-medium text-green-700 dark:text-green-400">{results.feedback}</p>
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
            <strong>Step 1:</strong> Enter the vehicle's purchase price in dollars. Include any taxes or fees if you want a more accurate estimate.
          </li>
          <li>
            <strong>Step 2:</strong> Input your down payment amount, if any. This reduces the loan amount you need to finance.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the loan term in months (e.g., 60 months for a 5-year loan).
          </li>
          <li>
            <strong>Step 4:</strong> Enter the low APR percentage offered by the dealer or manufacturer. If no low APR is offered, leave it blank or zero.
          </li>
          <li>
            <strong>Step 5:</strong> Enter the cash back incentive amount offered, if any. If none, leave it blank or zero.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to see which option—low APR financing or cash back incentive—saves you more money over the loan term.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Low APR vs. Cash Back Incentive Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            When purchasing a vehicle, manufacturers and dealers often offer incentives to attract buyers. Two common incentives are low APR (Annual Percentage Rate) financing and cash back offers. Deciding which incentive is better depends on your financial situation, loan term, and how much you plan to finance. This calculator helps you compare the total cost of financing under both options to make an informed decision.
          </p>
          <p>
            Low APR financing reduces the interest rate on your auto loan, lowering your monthly payments and total interest paid over the life of the loan. This option is especially beneficial if you plan to finance the vehicle for a longer period. On the other hand, cash back incentives provide immediate savings by reducing the vehicle's purchase price or giving you a lump sum rebate. However, cash back offers are often paired with higher interest rates, which can increase your total loan cost.
          </p>
          <p>
            To use this calculator, input the vehicle price, your down payment, loan term, the low APR rate offered, and the cash back amount. The calculator assumes a standard APR (6.5%) for the cash back option if no APR is specified. It then computes the monthly payments and total costs for both scenarios, helping you identify which incentive saves you more money overall. Remember, other factors such as credit score, loan approval, and dealer fees may also influence your final decision.
          </p>
          <p>
            By understanding the trade-offs between low APR financing and cash back incentives, you can negotiate better deals and optimize your vehicle purchase financially. Always review the terms and conditions of each offer carefully and consider consulting a financial advisor if needed.
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
            <strong>1. Ignoring the loan term:</strong> Many buyers overlook how the length of the loan affects total interest paid. A low APR is more beneficial for longer loans, while cash back might be better for shorter terms.
          </p>
          <p>
            <strong>2. Not factoring in down payments:</strong> Down payments reduce the loan amount and affect monthly payments and total costs. Always include your down payment in calculations.
          </p>
          <p>
            <strong>3. Assuming incentives can be combined:</strong> Usually, you must choose between low APR and cash back offers. Trying to combine them can lead to confusion or disqualification.
          </p>
          <p>
            <strong>4. Forgetting additional fees or taxes:</strong> Taxes, dealer fees, and other charges can impact your total cost. Include these in your vehicle price for accurate estimates.
          </p>
          <p>
            <strong>5. Overlooking credit score impact:</strong> Your credit score affects the APR you qualify for. The advertised low APR may not apply if your credit is less than excellent.
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
                href="#"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
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
      title="Low APR vs. Cash Back Incentive Calculator"
      description="Professional automotive calculator: Low APR vs. Cash Back Incentive Calculator. Get accurate estimates, expert advice, and financial insights."
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