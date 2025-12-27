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
  AlertTriangle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FuelEconomyConverterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (L/100km) or imperial (mpg)
    fuelConsumption: "", // L/100km or mpg
    distance: "", // km or miles
    waste: "10", // waste margin %
    pricePerUnit: "", // price per liter or gallon
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * - Convert fuel consumption and distance to consistent units.
   * - Calculate fuel needed = (distance / 100) * fuelConsumption (metric)
   *   or fuel needed = distance / fuelConsumption (imperial mpg)
   * - Add waste margin.
   * - Calculate cost if price per unit is given.
   */

  const results = useMemo(() => {
    const fuelConsumptionNum = parseFloat(inputs.fuelConsumption);
    const distanceNum = parseFloat(inputs.distance);
    const wasteNum = parseInt(inputs.waste);
    const priceNum = parseFloat(inputs.pricePerUnit);

    if (
      isNaN(fuelConsumptionNum) ||
      fuelConsumptionNum <= 0 ||
      isNaN(distanceNum) ||
      distanceNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0
    ) {
      return null;
    }

    let fuelNeededRaw = 0; // raw fuel needed before waste
    let unitLabel = "";
    if (inputs.unit === "metric") {
      // fuelConsumption in L/100km, distance in km
      // fuelNeeded = (distance / 100) * fuelConsumption
      fuelNeededRaw = (distanceNum / 100) * fuelConsumptionNum;
      unitLabel = "Liters";
    } else {
      // imperial: fuelConsumption in mpg, distance in miles
      // fuelNeeded = distance / mpg
      fuelNeededRaw = distanceNum / fuelConsumptionNum;
      unitLabel = "Gallons";
    }

    // Add waste margin
    const fuelNeededWithWaste = fuelNeededRaw * (1 + wasteNum / 100);

    // Cost calculation
    let cost = null;
    if (!isNaN(priceNum) && priceNum > 0) {
      cost = fuelNeededWithWaste * priceNum;
    }

    return {
      mainQty: fuelNeededWithWaste.toFixed(2),
      unitLabel,
      cost: cost !== null ? `$${cost.toFixed(2)}` : "N/A",
      details: `Raw fuel needed: ${fuelNeededRaw.toFixed(2)} ${unitLabel}`,
      wasteInfo: `+${wasteNum}% Waste margin included`,
    };
  }, [inputs]);

  // --- 1. DETAILED FAQ ---
  const faqs = [
    {
      question: "What is fuel economy and why is it important?",
      answer:
        "Fuel economy measures how efficiently a vehicle uses fuel, typically expressed as liters per 100 kilometers (L/100km) or miles per gallon (mpg). It is important because it affects fuel costs and environmental impact.",
    },
    {
      question: "How do I convert between metric and imperial fuel economy units?",
      answer:
        "To convert mpg to L/100km, use the formula: 235.215 ÷ mpg. To convert L/100km to mpg, use: 235.215 ÷ L/100km.",
    },
    {
      question: "Why should I include a waste margin in fuel calculations?",
      answer:
        "Including a waste margin accounts for unexpected variations such as detours, idling, or fuel inefficiencies, ensuring you have enough fuel for your trip.",
    },
    {
      question: "Can I use this calculator for any type of vehicle?",
      answer:
        "Yes, as long as you know the vehicle's fuel consumption rate and the distance you plan to travel, this calculator can estimate fuel needs.",
    },
    {
      question: "How accurate are the cost estimates provided?",
      answer:
        "Cost estimates depend on the accuracy of the fuel price you enter and the fuel consumption data. Real-world conditions may cause variations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. REFERENCES ---
  const references = [
    {
      title: "U.S. Department of Energy - Fuel Economy Guide",
      description:
        "Official guide providing detailed information on fuel economy ratings and tips for improving efficiency.",
    },
    {
      title: "Environmental Protection Agency (EPA) Fuel Economy",
      description:
        "Comprehensive resource on fuel economy standards, testing methods, and vehicle comparisons.",
    },
    {
      title: "American Society of Mechanical Engineers (ASME) Fuel Efficiency Standards",
      description:
        "Technical standards and best practices for measuring and improving fuel efficiency in vehicles.",
    },
  ];

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (L/100km)</SelectItem>
            <SelectItem value="imperial">Imperial (mpg)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Fuel Consumption ({inputs.unit === "metric" ? "L/100km" : "mpg"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "metric"
                ? "e.g. 8.5"
                : "e.g. 30"
            }
            value={inputs.fuelConsumption}
            onChange={(e) => handleInputChange("fuelConsumption", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Distance ({inputs.unit === "metric" ? "Kilometers" : "Miles"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "metric"
                ? "e.g. 150"
                : "e.g. 93"
            }
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          value={[parseInt(inputs.waste)]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Price per {inputs.unit === "metric" ? "Liter" : "Gallon"} (optional)
        </Label>
        <Input
          type="number"
          min="0"
          step="any"
          placeholder={
            inputs.unit === "metric" ? "e.g. 1.25" : "e.g. 3.50"
          }
          value={inputs.pricePerUnit}
          onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Fuel Needed
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty}{" "}
              <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-bold mt-2">
              Estimated Cost: {results.cost}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {results.details} • {results.wasteInfo}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* SECTION: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system: Metric
            (Liters per 100 kilometers) or Imperial (Miles per gallon).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your vehicle's fuel consumption rate
            in the selected unit.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the total distance you plan to travel
            in kilometers or miles.
          </li>
          <li>
            <strong>Step 4:</strong> Adjust the Waste Margin slider to add a
            safety buffer for fuel usage (10% is recommended).
          </li>
          <li>
            <strong>Step 5:</strong> (Optional) Enter the current price per
            liter or gallon to estimate the total fuel cost.
          </li>
          <li>
            <strong>Step 6:</strong> Click the Calculate button to see your
            estimated fuel needs and cost.
          </li>
        </ol>
      </section>

      {/* SECTION: COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Fuel
          Economy Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Fuel economy is a critical factor for vehicle owners and fleet
            managers alike, influencing both operational costs and environmental
            impact. This calculator helps you estimate the amount of fuel needed
            for a given trip based on your vehicle's fuel consumption and the
            distance to be traveled.
          </p>
          <p>
            Understanding fuel consumption units is essential. Metric units use
            liters per 100 kilometers (L/100km), which indicates how many liters
            of fuel the vehicle consumes to travel 100 kilometers. Imperial units
            use miles per gallon (mpg), which indicates how many miles the
            vehicle can travel on one gallon of fuel.
          </p>
          <p>
            This tool allows you to input your fuel consumption in either unit
            system and calculates the total fuel required for your trip,
            including an adjustable waste margin to account for real-world
            driving conditions such as traffic, detours, or idling.
          </p>
          <p>
            Additionally, by entering the current fuel price, you can obtain an
            estimated cost for the fuel needed, helping you budget your trip more
            effectively.
          </p>
          <p>
            Always ensure your inputs are accurate and up-to-date for the best
            results. Regularly checking your vehicle's fuel consumption and
            current fuel prices will help you make informed decisions and reduce
            unexpected expenses.
          </p>
        </div>
      </section>

      {/* SECTION: COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Unit Selection:</strong> Using fuel consumption
            values in one unit system but selecting the other unit system in the
            calculator leads to inaccurate results.
          </p>
          <p>
            <strong>2. Forgetting to Include Waste Margin:</strong> Not adding a
            waste margin can result in running out of fuel due to unforeseen
            circumstances.
          </p>
          <p>
            <strong>3. Using Outdated Fuel Prices:</strong> Fuel prices fluctuate
            frequently; using old prices will make cost estimates unreliable.
          </p>
          <p>
            <strong>4. Ignoring Vehicle Load and Driving Conditions:</strong>{" "}
            Fuel consumption can vary based on load, terrain, and driving style,
            so estimates may differ from actual usage.
          </p>
          <p>
            <strong>5. Entering Zero or Negative Values:</strong> This causes
            calculation errors or nonsensical results.
          </p>
        </div>
      </section>

      {/* SECTION: FAQ (FULL TEXT) */}
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

      {/* SECTION: REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          These resources provide more detail on fuel economy standards, vehicle
          efficiency, and industry best practices.
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
      title="Fuel Economy Converter"
      description="Professional calculator: Fuel Economy Converter. Accurate estimates, waste factors, and expert construction advice."
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