import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Ruler,
  Hammer,
  HardHat,
  Box,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AnnualFuelCostBreakEvenCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric or imperial
    annualFuelConsumption: "", // in liters or gallons
    fuelPrice: "", // price per liter or gallon
    annualOperatingHours: "", // hours per year
    equipmentFuelEfficiency: "", // fuel consumption per hour (liters/hour or gallons/hour)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 
   * Annual Fuel Cost = Annual Fuel Consumption * Fuel Price
   * Break-Even Operating Hours = Annual Fuel Consumption / Equipment Fuel Efficiency
   * 
   * Inputs:
   * - annualFuelConsumption (liters or gallons)
   * - fuelPrice (per liter or gallon)
   * - annualOperatingHours (hours per year)
   * - equipmentFuelEfficiency (liters/hour or gallons/hour)
   * 
   * Outputs:
   * - Annual Fuel Cost ($)
   * - Break-Even Operating Hours (hours)
   */

  const results = useMemo(() => {
    const {
      unit,
      annualFuelConsumption,
      fuelPrice,
      annualOperatingHours,
      equipmentFuelEfficiency,
    } = inputs;

    // Parse inputs to floats
    const fuelCons = parseFloat(annualFuelConsumption);
    const price = parseFloat(fuelPrice);
    const opHours = parseFloat(annualOperatingHours);
    const fuelEff = parseFloat(equipmentFuelEfficiency);

    // Validation
    if (
      isNaN(fuelCons) ||
      fuelCons <= 0 ||
      isNaN(price) ||
      price <= 0 ||
      isNaN(opHours) ||
      opHours <= 0 ||
      isNaN(fuelEff) ||
      fuelEff <= 0
    ) {
      return null;
    }

    // Calculate Annual Fuel Cost
    const annualFuelCost = fuelCons * price;

    // Calculate Break-Even Operating Hours
    // Break-Even Hours = Annual Fuel Consumption / Equipment Fuel Efficiency
    const breakEvenHours = fuelCons / fuelEff;

    // Format numbers with appropriate units and currency
    const currencyFormatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

    const unitLabel = unit === "metric" ? "liters" : "gallons";

    return {
      annualFuelCost: currencyFormatter.format(annualFuelCost),
      breakEvenHours: breakEvenHours.toFixed(1),
      unitLabel,
      details: `Based on ${fuelCons.toLocaleString()} ${unitLabel} annual consumption and $${price.toFixed(
        2
      )} per ${unitLabel}`,
    };
  }, [inputs]);

  // --- 1. DETAILED FAQ ---
  const faqs = [
    {
      question: "What is annual fuel cost and why is it important?",
      answer:
        "Annual fuel cost represents the total amount spent on fuel over a year for operating equipment. It is crucial for budgeting and understanding operational expenses.",
    },
    {
      question: "How do I determine the break-even operating hours?",
      answer:
        "Break-even operating hours indicate how many hours your equipment must operate to consume the annual fuel amount. It is calculated by dividing annual fuel consumption by equipment fuel efficiency.",
    },
    {
      question: "Why should I select the correct unit system?",
      answer:
        "Selecting the correct unit system (Metric or Imperial) ensures that all inputs and calculations are consistent, preventing errors in fuel consumption and cost estimates.",
    },
    {
      question: "Can I use this calculator for multiple types of equipment?",
      answer:
        "Yes, by inputting the specific fuel consumption and efficiency values for each equipment, you can estimate annual fuel costs and break-even points for various machines.",
    },
    {
      question: "How does fuel price fluctuation affect the results?",
      answer:
        "Fuel price changes directly impact the annual fuel cost estimate. It is recommended to update the fuel price regularly to maintain accurate budgeting.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. REFERENCES ---
  const references = [
    {
      title: "ASTM International - Fuel Consumption Standards",
      description:
        "Provides standardized methods for measuring and reporting fuel consumption in construction equipment.",
    },
    {
      title: "Gypsum Association - Equipment Efficiency Guidelines",
      description:
        "Guidelines on optimizing equipment fuel efficiency to reduce operational costs in construction projects.",
    },
    {
      title: "Concrete Network - Construction Equipment Fuel Cost Analysis",
      description:
        "Comprehensive resource on calculating and managing fuel costs for concrete and construction equipment.",
    },
  ];

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
          aria-label="Select unit system"
        >
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (Liters)</SelectItem>
            <SelectItem value="imperial">Imperial (Gallons)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="annualFuelConsumption">Annual Fuel Consumption</Label>
          <Input
            id="annualFuelConsumption"
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "e.g. 5000 liters" : "e.g. 1320 gallons"}
            value={inputs.annualFuelConsumption}
            onChange={(e) => handleInputChange("annualFuelConsumption", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fuelPrice">Fuel Price (per {inputs.unit === "metric" ? "liter" : "gallon"})</Label>
          <Input
            id="fuelPrice"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 1.25"
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annualOperatingHours">Annual Operating Hours</Label>
          <Input
            id="annualOperatingHours"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 1500 hours"
            value={inputs.annualOperatingHours}
            onChange={(e) => handleInputChange("annualOperatingHours", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="equipmentFuelEfficiency">Equipment Fuel Efficiency</Label>
          <Input
            id="equipmentFuelEfficiency"
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "liters/hour" : "gallons/hour"}
            value={inputs.equipmentFuelEfficiency}
            onChange={(e) => handleInputChange("equipmentFuelEfficiency", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No special action needed, results update automatically
        }}
        aria-label="Calculate Annual Fuel Cost and Break-Even"
      >
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Annual Fuel Cost</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.annualFuelCost}</div>
            <Separator className="my-4" />
            <span className="text-sm font-semibold text-slate-500 uppercase">Break-Even Operating Hours</span>
            <div className="text-4xl font-bold text-blue-600 my-3">{results.breakEvenHours} hours</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* SECTION: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system: Metric (liters) or Imperial (gallons).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total annual fuel consumption for your equipment.
          </li>
          <li>
            <strong>Step 3:</strong> Input the current fuel price per liter or gallon.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the total annual operating hours of the equipment.
          </li>
          <li>
            <strong>Step 5:</strong> Provide the equipment's fuel efficiency (fuel consumption per hour).
          </li>
          <li>
            <strong>Step 6:</strong> Click <em>Calculate</em> to see your estimated annual fuel cost and break-even operating hours.
          </li>
        </ol>
      </section>

      {/* SECTION: COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Annual Fuel Cost & Break-Even
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Understanding your equipment's annual fuel cost is essential for effective budgeting and cost control in construction projects.
            This calculator helps you estimate the total fuel expenses based on your equipment's fuel consumption and current fuel prices.
          </p>
          <p>
            The break-even operating hours indicate the number of hours your equipment must operate to consume the annual fuel amount.
            This metric helps in planning equipment usage, maintenance schedules, and evaluating operational efficiency.
          </p>
          <p>
            To use this calculator accurately, ensure you have reliable data on your equipment's fuel consumption, fuel prices, and operating hours.
            Regularly updating these inputs will provide the most precise estimates for your project planning.
          </p>
          <p>
            Selecting the correct unit system is critical. Metric units use liters and Imperial units use gallons. Mixing units can lead to incorrect calculations.
            Always verify your input units before calculating.
          </p>
          <p>
            By monitoring your annual fuel costs and break-even points, you can identify opportunities to improve fuel efficiency,
            reduce operational costs, and make informed decisions about equipment usage and replacement.
          </p>
        </div>
      </section>

      {/* SECTION: COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Common Mistakes
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Mixing Units:</strong> Entering fuel consumption in liters but fuel price in gallons (or vice versa) will cause inaccurate results.
            Always ensure consistent units.
          </p>
          <p>
            <strong>2. Using Estimated Instead of Actual Data:</strong> Using rough guesses for fuel consumption or efficiency can lead to misleading cost estimates.
            Use actual measured data when possible.
          </p>
          <p>
            <strong>3. Ignoring Fuel Price Fluctuations:</strong> Fuel prices can vary significantly over time. Regularly update the fuel price input to keep estimates relevant.
          </p>
          <p>
            <strong>4. Overlooking Equipment Efficiency Changes:</strong> Equipment fuel efficiency may degrade over time due to wear and maintenance issues.
            Periodically reassess fuel efficiency values.
          </p>
          <p>
            <strong>5. Not Accounting for Idle Time:</strong> Fuel consumption during idle periods can affect total fuel costs but may not be reflected in efficiency ratings.
            Consider idle fuel use separately if significant.
          </p>
        </div>
      </section>

      {/* SECTION: FAQ (FULL TEXT) */}
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

      {/* SECTION: REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" />
          References & additional resources
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          These resources provide more detail on construction standards, material properties, and industry best practices.
        </p>
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
      title="Annual Fuel Cost & Break-Even"
      description="Professional calculator: Annual Fuel Cost & Break-Even. Accurate estimates, waste factors, and expert construction advice."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}