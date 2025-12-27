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

export default function OutTheDoorEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    vehiclePrice: "",
    salesTaxRate: "",
    titleFee: "",
    registrationFee: "",
    additionalFees: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs safely
    const price = parseFloat(inputs.vehiclePrice);
    const taxRate = parseFloat(inputs.salesTaxRate);
    const titleFee = parseFloat(inputs.titleFee);
    const registrationFee = parseFloat(inputs.registrationFee);
    const additionalFees = parseFloat(inputs.additionalFees);

    if (
      isNaN(price) || price <= 0 ||
      isNaN(taxRate) || taxRate < 0 ||
      isNaN(titleFee) || titleFee < 0 ||
      isNaN(registrationFee) || registrationFee < 0 ||
      isNaN(additionalFees) || additionalFees < 0
    ) {
      return {
        primary: "—",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all fields.",
        feedback: "Invalid input"
      };
    }

    // Calculate sales tax amount
    const salesTaxAmount = price * (taxRate / 100);

    // Sum all fees
    const totalFees = titleFee + registrationFee + additionalFees;

    // Calculate out-the-door price
    const outTheDoorPrice = price + salesTaxAmount + totalFees;

    return {
      primary: outTheDoorPrice.toLocaleString("en-US", { style: "currency", currency: "USD" }),
      secondary: `Includes $${salesTaxAmount.toFixed(2)} sales tax and $${totalFees.toFixed(2)} fees`,
      details: `Vehicle Price: $${price.toFixed(2)} + Sales Tax (${taxRate.toFixed(2)}%): $${salesTaxAmount.toFixed(2)} + Fees: $${totalFees.toFixed(2)} = Out-the-Door Price`,
      feedback: "Estimate based on provided inputs"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What does 'out-the-door price' mean?",
      answer:
        "The out-the-door price is the total amount you pay to purchase a vehicle, including the vehicle's price, sales tax, title fees, registration fees, and any additional fees. It represents the final cost to drive the car off the lot without any surprise charges later."
    },
    {
      question: "How is sales tax calculated on a vehicle purchase?",
      answer:
        "Sales tax on a vehicle is typically calculated as a percentage of the vehicle's purchase price. The exact rate varies by state and sometimes by city or county. This calculator requires you to input the applicable sales tax rate to estimate the tax amount accurately."
    },
    {
      question: "What are title and registration fees?",
      answer:
        "Title fees cover the cost of legally registering the vehicle's ownership in your name, while registration fees are for licensing the vehicle to be driven on public roads. Both fees vary by state and sometimes by vehicle type or weight."
    },
    {
      question: "Can additional fees affect the out-the-door price?",
      answer:
        "Yes, additional fees such as documentation fees, dealer fees, emission testing fees, or local taxes can add to the total cost. It's important to include these fees in the calculator to get an accurate out-the-door estimate."
    },
    {
      question: "Why is it important to know the out-the-door price before buying?",
      answer:
        "Knowing the out-the-door price helps you budget accurately and avoid surprises at the dealership. It ensures you understand the full financial commitment, including taxes and fees, so you can compare offers and negotiate effectively."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with a 7.5% sales tax rate, $150 title fee, $200 registration fee, and $100 in additional dealer fees.",
    steps: [
      {
        label: "Step 1: Calculate Sales Tax",
        explanation: "Sales Tax = $35,000 × 7.5% = $2,625.00"
      },
      {
        label: "Step 2: Sum Title, Registration, and Additional Fees",
        explanation: "Total Fees = $150 + $200 + $100 = $450.00"
      },
      {
        label: "Step 3: Calculate Out-the-Door Price",
        explanation: "Out-the-Door Price = $35,000 + $2,625 + $450 = $38,075.00"
      }
    ],
    result: "Final Out-the-Door Price: $38,075.00"
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "IRS Sales Tax Information",
      description: "Official guidelines on sales tax for vehicle purchases."
    },
    {
      title: "DMV Title and Registration Fees",
      description: "State-specific information on title and registration fees."
    },
    {
      title: "Edmunds Car Buying Guide",
      description: "Comprehensive advice on understanding car pricing and fees."
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
            placeholder="e.g. 35000"
            value={inputs.vehiclePrice}
            onChange={(e) => handleInputChange("vehiclePrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Sales Tax Rate (%)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 7.5"
            value={inputs.salesTaxRate}
            onChange={(e) => handleInputChange("salesTaxRate", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Title Fee ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 150"
            value={inputs.titleFee}
            onChange={(e) => handleInputChange("titleFee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Registration Fee ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 200"
            value={inputs.registrationFee}
            onChange={(e) => handleInputChange("registrationFee", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Additional Fees ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 100"
            value={inputs.additionalFees}
            onChange={(e) => handleInputChange("additionalFees", e.target.value)}
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
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
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
            <strong>Step 1:</strong> Enter the vehicle's purchase price in dollars. This is the base price before taxes and fees.
          </li>
          <li>
            <strong>Step 2:</strong> Input the applicable sales tax rate as a percentage (e.g., 7.5 for 7.5%). This rate varies by location.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the title fee charged by your state or local DMV. This fee covers the legal ownership transfer.
          </li>
          <li>
            <strong>Step 4:</strong> Provide the registration fee required to license the vehicle for road use.
          </li>
          <li>
            <strong>Step 5:</strong> Add any additional fees such as dealer documentation fees, emission fees, or local taxes.
          </li>
          <li>
            <strong>Step 6:</strong> Click the "Calculate" button to see the estimated out-the-door price, which includes all taxes and fees.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Sales Tax, Title & Fees Out-the-Door Estimator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            When purchasing a vehicle, the sticker price you see is rarely the final amount you will pay. The out-the-door price is the comprehensive total that includes the vehicle's price, applicable sales tax, title fees, registration fees, and any additional charges imposed by the dealer or government agencies. Understanding this total cost is crucial for budgeting and negotiating effectively.
          </p>
          <p>
            Sales tax is calculated as a percentage of the vehicle's purchase price and varies widely depending on your state, county, or city. Title fees are government charges for legally transferring ownership of the vehicle to you, while registration fees cover the cost of licensing the vehicle for use on public roads. Additional fees may include dealer documentation fees, emission testing fees, or local taxes, which can significantly impact the total cost.
          </p>
          <p>
            This calculator helps you estimate the out-the-door price by allowing you to input all relevant costs. By providing accurate inputs, you can avoid surprises at the dealership and make informed financial decisions. Remember that some fees may be negotiable, and tax rates can differ based on your location, so always verify the exact amounts with your dealer or local DMV.
          </p>
          <p>
            Ultimately, knowing the out-the-door price empowers you to compare offers from different dealers, plan your financing or cash payment, and ensure a smooth vehicle purchase experience without unexpected expenses.
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
            <strong>1. Forgetting to include all fees:</strong> Many buyers only consider the vehicle price and sales tax, overlooking title, registration, and dealer fees, which can add hundreds or thousands to the total cost.
          </p>
          <p>
            <strong>2. Using incorrect sales tax rates:</strong> Sales tax rates vary by location and sometimes by vehicle type. Using a generic or outdated rate can lead to inaccurate estimates.
          </p>
          <p>
            <strong>3. Ignoring additional dealer fees:</strong> Dealers often charge documentation or processing fees that are not included in the sticker price but affect the final amount.
          </p>
          <p>
            <strong>4. Not verifying fees with local DMV:</strong> Title and registration fees differ by state and sometimes by vehicle weight or age. Always check with your local DMV for precise fees.
          </p>
          <p>
            <strong>5. Assuming out-the-door price includes financing costs:</strong> This calculator estimates purchase price only; financing interest and loan fees are separate and should be considered independently.
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
      title="Sales Tax, Title & Fees Out-the-Door Estimator"
      description="Professional automotive calculator: Sales Tax, Title & Fees Out-the-Door Estimator. Get accurate estimates, expert advice, and financial insights."
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