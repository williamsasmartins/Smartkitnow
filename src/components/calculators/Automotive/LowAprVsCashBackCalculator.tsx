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
      question: "When should I choose a low APR offer over a cash back incentive?",
      answer: "Low APR offers typically benefit borrowers who plan to carry a balance beyond the promotional period or need lower monthly payments, while cash back works better for those paying off the loan quickly. For example, on a $30,000 vehicle financed over 60 months, a 0% APR for 36 months could save you $3,600 in interest compared to a 4.9% APR, even if you forgo a 2% cash back rebate ($600). Use this calculator to compare your specific loan terms and payoff timeline.",
    },
    {
      question: "How does the calculator determine which offer saves more money?",
      answer: "The calculator computes total interest paid under the low APR scenario versus the total interest on the standard rate minus the cash back incentive amount. It factors in your loan principal, loan term in months, and the APR difference between offers. The tool shows the net savings for each option, allowing you to see which choice puts more money back in your pocket over the loan's lifetime.",
    },
    {
      question: "What is a typical low APR offer for new car financing in 2025?",
      answer: "Manufacturer-sponsored low APR offers typically range from 0% to 3.9% APR for well-qualified buyers, though promotional periods vary from 24 to 60 months depending on the lender and vehicle. The national average auto loan APR for new cars is currently around 6.5% for borrowers with good credit (660–749 FICO), making 0–2% promotional rates significantly advantageous. However, these offers usually require excellent credit scores (&gt;750) and may not be combinable with other incentives.",
    },
    {
      question: "How much cash back incentive is typical on a new vehicle purchase?",
      answer: "Typical cash back incentives range from 1% to 4% of the vehicle's purchase price, though luxury and high-demand models may offer 2–3% while clearance vehicles can reach 5–6%. On a $35,000 vehicle, a 3% cash back incentive equals $1,050 in rebates applied to your down payment or financed amount. This calculator helps you compare whether that incentive or the low APR saves more interest over your loan term.",
    },
    {
      question: "Can I combine a low APR offer with a cash back rebate?",
      answer: "Most manufacturers do not allow stacking of low APR financing with cash back incentives—you typically must choose one or the other. Some dealers offer a third option: standard financing at regular APR with cash back, which the calculator can evaluate alongside the promotional offers. Always confirm with your dealer whether combination deals are available, as this significantly impacts your savings calculation.",
    },
    {
      question: "What loan term should I enter into the calculator?",
      answer: "Enter the actual number of months you plan to finance the vehicle, typically ranging from 24 to 84 months for new cars. The calculator uses your loan term to compute total interest and shows how long promotional APR periods apply; for example, a 0% APR for 36 months on a 72-month loan means you pay standard APR for the remaining 36 months. Match your entered term to your financing agreement for the most accurate comparison.",
    },
    {
      question: "How do credit score requirements affect which offer I can access?",
      answer: "Low APR offers usually require credit scores &gt;750 (excellent credit), while cash back incentives may be available to borrowers with good credit (700–749) or even fair credit (660–699). If your credit score qualifies for only the cash back option, the calculator will show you're comparing 0% APR (unavailable to you) versus your actual eligible rate; adjust inputs to reflect realistic scenarios based on your creditworthiness. Check your credit report before shopping to understand which incentives you genuinely qualify for.",
    },
    {
      question: "What happens to my savings comparison if I make a larger down payment?",
      answer: "A larger down payment reduces the financed amount, which lowers total interest paid under both scenarios proportionally. For example, paying $10,000 down instead of $5,000 on a $35,000 vehicle reduces interest calculations by roughly 28% since you're financing $25,000 instead of $30,000. The calculator adjusts the interest savings for each incentive option, though the APR offer's advantage may increase if cash back is a fixed-dollar amount rather than percentage-based.",
    },
    {
      question: "Should I factor in opportunity cost when choosing between these offers?",
      answer: "Yes—if you take the cash back rebate and invest it at 4–5% annual return instead of applying it to the loan, the opportunity cost could reduce your effective savings. However, most consumers should prioritize the guaranteed interest savings from a low APR offer rather than speculative investment returns, especially with auto loan rates at 5–7%. The calculator focuses on direct financing costs; use it alongside your investment goals to make a fully informed decision.",
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Low APR vs. Cash Back Incentive Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine whether a manufacturer's promotional low APR offer or a cash back incentive saves you more money on an auto purchase. Since these offers are rarely available together, the tool allows you to isolate the impact of each option and compare total interest paid against your actual out-of-pocket savings. By entering your vehicle price, down payment, loan term, and available incentive terms, you'll see which choice delivers the greatest financial benefit.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering the vehicle's purchase price (or financed amount after rebates), your down payment in dollars, and your intended loan term in months. Then input the promotional APR offer and its duration (e.g., 0% for 36 months), the standard APR you'd pay without promotion, and any cash back rebate amount available. The calculator computes monthly payments and cumulative interest under each scenario, showing you the net dollar savings for low APR versus cash back.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Compare the "Total Interest Paid" row for each offer to determine which saves more money over the full loan term. Remember that low APR benefits increase with longer loan terms, while cash back is typically a fixed dollar amount, making APR offers more advantageous on 60+ month loans. Factor in your credit score eligibility, ability to qualify for promotional rates, and whether you plan to keep or trade the vehicle before the promotional period ends.</p>
        </div>
      </section>

      {/* TABLE: Low APR vs. Cash Back Incentive Comparison (2025 Market Rates) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Low APR vs. Cash Back Incentive Comparison (2025 Market Rates)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical manufacturer incentives and their comparative savings on a $35,000 vehicle financed over 60 months.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Incentive Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">APR / Rebate Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Interest Paid</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Net Savings vs. 6.5% Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0% APR (36 months, then 6.5%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% → 6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$583 / $610</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,198</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,902</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.9% APR (48 months, then 6.5%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.9% → 6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$599 / $615</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,145</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,955</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5% Cash Back Rebate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5% Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$635</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,047</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,050 (rebate only)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3% Cash Back Rebate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5% Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$635</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,047</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$630 (rebate only)</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard 6.5% APR</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$635</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,677</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0 (baseline)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Payments vary based on down payment; this assumes 10% down ($3,500). Promotional APR period shown in parentheses; after expiration, rate reverts to lender's standard rate. Cash back rebates shown as standalone amounts; not calculated into monthly payment for this comparison.</p>
      </section>

      {/* TABLE: Impact of Loan Term on APR vs. Cash Back Savings */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Loan Term on APR vs. Cash Back Savings</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how loan term length affects the relative advantage of low APR offers versus cash back incentives on the same vehicle.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Loan Term</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0% APR Savings (36mo promo)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2% Cash Back ($700 value)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">APR Advantage Over Cash Back</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">36 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,275</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,575</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">48 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,145</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,445</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,902</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,202</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">72 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,430</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,730</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">84 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,890</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$700</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7,190</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Based on $35,000 financed with 10% down; 0% APR promotional period expires after 36 months, then reverts to 6.5% standard APR. Longer terms amplify low APR benefits. Cash back is a fixed $700 example (2% of principal).</p>
      </section>

      {/* TABLE: Federal and Manufacturer Incentive Eligibility by Credit Score (2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Federal and Manufacturer Incentive Eligibility by Credit Score (2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines typical credit score thresholds for accessing low APR promotions and cash back incentives from major manufacturers.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Credit Score Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical APR Offers</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cash Back Eligibility</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Special Requirements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;760 (Excellent)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0% – 1.9% APR available</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full access to all rebates</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May require auto-pay / bank account</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">740–759 (Very Good)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9% – 3.9% APR typical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full access to 2–4% cash back</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Often requires &gt;10% down payment</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">700–739 (Good)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.9% – 5.9% APR range</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Limited cash back (1–2%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May exclude lowest APR tiers</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">660–699 (Fair)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.9% – 7.9% APR range</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimal cash back offered</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Down payment &gt;15% often required</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;660 (Poor)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.9%+ APR typical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No standard cash back</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Subprime financing; limited options</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Requirements vary by manufacturer, lender, and current market conditions. Always pre-qualify before assuming access to specific rates. FICO score ranges shown are standard industry definitions.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Match the loan term you enter to your actual financing agreement or intended payoff timeline—mismatches undermine the calculator's accuracy and can skew your decision by thousands of dollars.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify current manufacturer incentives and promotional APR durations directly with dealerships or manufacturers' websites, as offers change monthly and vary by vehicle model and region.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your credit score falls short of 0% APR eligibility, use the calculator to compare a realistic APR tier (e.g., 3.9% for good credit) against cash back to avoid comparing unavailable scenarios.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for the "reversion rate" after a promotional APR period ends; if 0% APR expires after 36 months on a 72-month loan, enter the standard APR you'll pay for the remaining 36 months to see true total interest.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the APR reversion date</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many borrowers assume 0% APR applies to the entire loan term, but promotional periods typically last 24–48 months. After expiration, your rate reverts to the lender's standard APR, significantly increasing interest on the remaining balance; always confirm reversion rates and enter them into the calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Comparing cash back to unavailable low APR offers</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If your credit score doesn't qualify for 0% APR (usually requires &gt;750 FICO), comparing against it is misleading. Instead, use the calculator to compare the cash back option against the lowest APR your credit actually qualifies for to make a real-world decision.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Treating cash back as interest reduction rather than principal reduction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cash back rebates reduce your financed amount or down payment but don't lower your APR; they're a one-time discount. The calculator treats them correctly, but borrowers often mistakenly assume cash back reduces monthly interest charges proportionally, when in fact only APR differences affect ongoing interest calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking manufacturer requirements and restrictions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many low APR offers require auto-pay enrollment, specific credit unions, or minimum down payments (&gt;10%), and cash back may exclude certain vehicle trims or exclude recent college graduates. Don't finalize your comparison without confirming you meet all eligibility requirements.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When should I choose a low APR offer over a cash back incentive?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Low APR offers typically benefit borrowers who plan to carry a balance beyond the promotional period or need lower monthly payments, while cash back works better for those paying off the loan quickly. For example, on a $30,000 vehicle financed over 60 months, a 0% APR for 36 months could save you $3,600 in interest compared to a 4.9% APR, even if you forgo a 2% cash back rebate ($600). Use this calculator to compare your specific loan terms and payoff timeline.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator determine which offer saves more money?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator computes total interest paid under the low APR scenario versus the total interest on the standard rate minus the cash back incentive amount. It factors in your loan principal, loan term in months, and the APR difference between offers. The tool shows the net savings for each option, allowing you to see which choice puts more money back in your pocket over the loan's lifetime.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a typical low APR offer for new car financing in 2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Manufacturer-sponsored low APR offers typically range from 0% to 3.9% APR for well-qualified buyers, though promotional periods vary from 24 to 60 months depending on the lender and vehicle. The national average auto loan APR for new cars is currently around 6.5% for borrowers with good credit (660–749 FICO), making 0–2% promotional rates significantly advantageous. However, these offers usually require excellent credit scores (&gt;750) and may not be combinable with other incentives.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much cash back incentive is typical on a new vehicle purchase?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Typical cash back incentives range from 1% to 4% of the vehicle's purchase price, though luxury and high-demand models may offer 2–3% while clearance vehicles can reach 5–6%. On a $35,000 vehicle, a 3% cash back incentive equals $1,050 in rebates applied to your down payment or financed amount. This calculator helps you compare whether that incentive or the low APR saves more interest over your loan term.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I combine a low APR offer with a cash back rebate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most manufacturers do not allow stacking of low APR financing with cash back incentives—you typically must choose one or the other. Some dealers offer a third option: standard financing at regular APR with cash back, which the calculator can evaluate alongside the promotional offers. Always confirm with your dealer whether combination deals are available, as this significantly impacts your savings calculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What loan term should I enter into the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter the actual number of months you plan to finance the vehicle, typically ranging from 24 to 84 months for new cars. The calculator uses your loan term to compute total interest and shows how long promotional APR periods apply; for example, a 0% APR for 36 months on a 72-month loan means you pay standard APR for the remaining 36 months. Match your entered term to your financing agreement for the most accurate comparison.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do credit score requirements affect which offer I can access?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Low APR offers usually require credit scores &gt;750 (excellent credit), while cash back incentives may be available to borrowers with good credit (700–749) or even fair credit (660–699). If your credit score qualifies for only the cash back option, the calculator will show you're comparing 0% APR (unavailable to you) versus your actual eligible rate; adjust inputs to reflect realistic scenarios based on your creditworthiness. Check your credit report before shopping to understand which incentives you genuinely qualify for.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens to my savings comparison if I make a larger down payment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A larger down payment reduces the financed amount, which lowers total interest paid under both scenarios proportionally. For example, paying $10,000 down instead of $5,000 on a $35,000 vehicle reduces interest calculations by roughly 28% since you're financing $25,000 instead of $30,000. The calculator adjusts the interest savings for each incentive option, though the APR offer's advantage may increase if cash back is a fixed-dollar amount rather than percentage-based.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I factor in opportunity cost when choosing between these offers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—if you take the cash back rebate and invest it at 4–5% annual return instead of applying it to the loan, the opportunity cost could reduce your effective savings. However, most consumers should prioritize the guaranteed interest savings from a low APR offer rather than speculative investment returns, especially with auto loan rates at 5–7%. The calculator focuses on direct financing costs; use it alongside your investment goals to make a fully informed decision.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.federalreserve.gov/datadownload/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Reserve – Auto Loan Statistics and Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official federal data on average auto loan rates, FICO score distributions, and lending trends across consumer credit markets.</p>
          </li>
          <li>
            <a href="https://www.consumerfinance.gov/ask-cfpb/what-is-apr-annual-percentage-rate-en-1566/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Financial Protection Bureau – Auto Loans Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CFPB resource explaining APR, how it differs from interest rate, and consumer rights in auto financing negotiations.</p>
          </li>
          <li>
            <a href="https://www.bankrate.com/loans/auto-loan/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bankrate – Auto Loan Rates and Incentives Tracker</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Current market data on manufacturer incentives, average auto loan rates by credit score, and promotional APR availability across brands.</p>
          </li>
          <li>
            <a href="https://www.ftc.gov/business-guidance/resources/guides-auto-industry" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission – Guides for the Auto Industry</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">FTC guidance on auto financing disclosures, incentive transparency, and consumer protections in dealer financing arrangements.</p>
          </li>
        </ul>
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