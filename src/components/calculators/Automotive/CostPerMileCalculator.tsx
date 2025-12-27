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

export default function CostPerMileCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    purchasePrice: "",
    annualMiles: "",
    annualFuelCost: "",
    annualMaintenanceCost: "",
    annualInsuranceCost: "",
    annualDepreciationCost: "",
    annualOtherCosts: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    // Parse inputs
    const purchasePrice = parseFloat(inputs.purchasePrice);
    const annualMiles = parseFloat(inputs.annualMiles);
    const annualFuelCost = parseFloat(inputs.annualFuelCost);
    const annualMaintenanceCost = parseFloat(inputs.annualMaintenanceCost);
    const annualInsuranceCost = parseFloat(inputs.annualInsuranceCost);
    const annualDepreciationCost = parseFloat(inputs.annualDepreciationCost);
    const annualOtherCosts = parseFloat(inputs.annualOtherCosts);

    // Validate inputs
    if (
      isNaN(purchasePrice) || purchasePrice <= 0 ||
      isNaN(annualMiles) || annualMiles <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for purchase price and annual miles.",
        feedback: "Invalid input"
      };
    }

    // Sum all annual costs (fuel, maintenance, insurance, depreciation, others)
    const totalAnnualCosts =
      (isNaN(annualFuelCost) ? 0 : annualFuelCost) +
      (isNaN(annualMaintenanceCost) ? 0 : annualMaintenanceCost) +
      (isNaN(annualInsuranceCost) ? 0 : annualInsuranceCost) +
      (isNaN(annualDepreciationCost) ? 0 : annualDepreciationCost) +
      (isNaN(annualOtherCosts) ? 0 : annualOtherCosts);

    // Calculate cost per mile or km
    const costPerUnit = totalAnnualCosts / annualMiles;

    // Format results
    const unitLabel = inputs.unit === "imperial" ? "mile" : "kilometer";
    const primary = costPerUnit.toFixed(4);
    const secondary = `$${costPerUnit.toFixed(2)} per ${unitLabel}`;
    const details = `Total annual costs: $${totalAnnualCosts.toFixed(2)} ÷ Annual ${unitLabel}s: ${annualMiles.toLocaleString()}`;

    return {
      primary,
      secondary,
      details,
      feedback: "Calculation based on your inputs"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "What costs should I include in the Cost Per Mile calculation?",
      answer:
        "To get an accurate cost per mile, include all relevant vehicle expenses such as fuel, maintenance, insurance, depreciation, and any other recurring costs. Excluding some costs can underestimate the true cost of ownership. This comprehensive approach helps you understand the full financial impact of driving your vehicle."
    },
    {
      question: "How does depreciation affect the cost per mile?",
      answer:
        "Depreciation represents the loss in your vehicle's value over time and is a significant part of ownership costs. Including depreciation in your cost per mile calculation ensures you account for the vehicle's declining worth, which is often one of the largest expenses after fuel and maintenance."
    },
    {
      question: "Can I use this calculator for electric vehicles?",
      answer:
        "Yes, this calculator works for electric vehicles as well. Instead of fuel costs, input your annual electricity costs for charging. Maintenance and insurance costs may differ, so adjust those inputs accordingly to reflect your EV's expenses."
    },
    {
      question: "Why is annual mileage important in this calculation?",
      answer:
        "Annual mileage is crucial because it spreads your total yearly vehicle costs over the distance you drive. Higher mileage typically lowers the cost per mile for fixed costs like depreciation but increases variable costs like fuel. Accurate mileage estimates lead to more precise cost calculations."
    },
    {
      question: "How often should I update the inputs for this calculator?",
      answer:
        "It's best to update your inputs annually or whenever significant changes occur, such as fuel price fluctuations, insurance changes, or maintenance needs. Regular updates ensure your cost per mile reflects your current driving habits and expenses."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with average annual driving of 12,000 miles, including fuel, maintenance, insurance, depreciation, and other costs.",
    steps: [
      {
        label: "Step 1: Gather Annual Costs",
        explanation:
          "Fuel cost: $1,800, Maintenance: $600, Insurance: $1,200, Depreciation: $3,000, Other costs: $400. Total annual costs = 1800 + 600 + 1200 + 3000 + 400 = $7,000."
      },
      {
        label: "Step 2: Calculate Cost Per Mile",
        explanation:
          "Divide total annual costs by annual miles: $7,000 ÷ 12,000 miles = $0.5833 per mile."
      }
    ],
    result: "Final Result: The cost per mile for this SUV is approximately $0.58 per mile."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel cost estimates."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, ownership costs, and advice."
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
            <SelectItem value="imperial">Imperial (Miles)</SelectItem>
            <SelectItem value="metric">Metric (Kilometers)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Purchase Price of Vehicle ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 35000"
            value={inputs.purchasePrice}
            onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Distance Driven ({inputs.unit === "imperial" ? "Miles" : "Kilometers"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 12000"
            value={inputs.annualMiles}
            onChange={(e) => handleInputChange("annualMiles", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Fuel Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1800"
            value={inputs.annualFuelCost}
            onChange={(e) => handleInputChange("annualFuelCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Maintenance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 600"
            value={inputs.annualMaintenanceCost}
            onChange={(e) => handleInputChange("annualMaintenanceCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Insurance Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1200"
            value={inputs.annualInsuranceCost}
            onChange={(e) => handleInputChange("annualInsuranceCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Annual Depreciation Cost ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 3000"
            value={inputs.annualDepreciationCost}
            onChange={(e) => handleInputChange("annualDepreciationCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Other Annual Costs ($)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 400"
            value={inputs.annualOtherCosts}
            onChange={(e) => handleInputChange("annualOtherCosts", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (miles) or Metric (kilometers).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the purchase price of your vehicle in dollars.
          </li>
          <li>
            <strong>Step 3:</strong> Input your estimated annual distance driven in miles or kilometers.
          </li>
          <li>
            <strong>Step 4:</strong> Provide your estimated annual costs for fuel, maintenance, insurance, depreciation, and any other expenses.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to see your estimated cost per mile or kilometer.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Cost Per Mile (Per Kilometer) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the cost per mile or kilometer of operating a vehicle is essential for budgeting, comparing vehicles, and making informed financial decisions. This calculator helps you estimate the total cost of driving by considering all major expenses associated with vehicle ownership. These include fuel, maintenance, insurance, depreciation, and other miscellaneous costs.
          </p>
          <p>
            The calculation divides your total annual vehicle expenses by the number of miles or kilometers you drive each year. This approach provides a clear, per-unit cost that reflects the true financial impact of your driving habits. It is particularly useful for fleet managers, rideshare drivers, and anyone looking to optimize their transportation expenses.
          </p>
          <p>
            To get the most accurate results, gather detailed records of your annual expenses and mileage. Remember that depreciation, often overlooked, can be one of the largest costs, representing the vehicle's loss in value over time. Including it ensures you understand the full cost of ownership beyond just out-of-pocket expenses.
          </p>
          <p>
            This calculator is flexible and can be used for gasoline, diesel, hybrid, or electric vehicles by adjusting the fuel or energy cost inputs accordingly. Regularly updating your inputs as costs or driving habits change will help you maintain an accurate understanding of your vehicle's cost efficiency.
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
            <strong>1. Ignoring Depreciation:</strong> Many users forget to include depreciation, which can significantly underestimate the true cost per mile. Depreciation often represents the largest ownership cost after fuel.
          </p>
          <p>
            <strong>2. Using Inaccurate Mileage:</strong> Estimating annual mileage too low or too high skews the cost per mile calculation. Use realistic and recent mileage data for accuracy.
          </p>
          <p>
            <strong>3. Omitting Maintenance or Insurance:</strong> Excluding these recurring costs leads to incomplete cost estimates. Always include all relevant expenses.
          </p>
          <p>
            <strong>4. Not Updating Costs Regularly:</strong> Fuel prices, insurance premiums, and maintenance costs fluctuate. Regular updates ensure your cost per mile remains relevant.
          </p>
          <p>
            <strong>5. Mixing Units:</strong> Ensure consistency in units (miles vs kilometers) throughout your inputs to avoid calculation errors.
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
      title="Cost Per Mile (Per Kilometer) Calculator"
      description="Professional automotive calculator: Cost Per Mile (Per Kilometer) Calculator. Get accurate estimates, expert advice, and financial insights."
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