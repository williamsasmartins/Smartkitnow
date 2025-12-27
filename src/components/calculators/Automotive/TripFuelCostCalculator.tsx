import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Ruler, Hammer, HardHat, Box, DollarSign, Info, CheckCircle2, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TripFuelCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (kilometers, liters) or imperial (miles, gallons)
    distance: "", // trip distance
    fuelEfficiency: "", // fuel consumption per 100 km or per mile
    fuelPrice: "", // price per liter or gallon
    waste: "10", // waste margin percentage (for fuel inefficiencies, detours, idling)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Calculation logic:
  // Trip Fuel Cost = (Distance / 100) * Fuel Efficiency * (1 + Waste%) * Fuel Price
  // For imperial units, fuel efficiency is miles per gallon, so formula changes:
  // Fuel needed = Distance / Fuel Efficiency * (1 + Waste%)
  // Cost = Fuel needed * Fuel Price

  const results = useMemo(() => {
    const distanceNum = parseFloat(inputs.distance);
    const fuelEffNum = parseFloat(inputs.fuelEfficiency);
    const fuelPriceNum = parseFloat(inputs.fuelPrice);
    const wasteNum = parseFloat(inputs.waste) / 100;

    if (
      isNaN(distanceNum) ||
      distanceNum <= 0 ||
      isNaN(fuelEffNum) ||
      fuelEffNum <= 0 ||
      isNaN(fuelPriceNum) ||
      fuelPriceNum < 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0
    ) {
      return {
        mainQty: "0",
        unitLabel: inputs.unit === "metric" ? "liters" : "gallons",
        cost: "$0.00",
        details: "Fuel needed: 0.00",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    let fuelNeeded = 0;
    if (inputs.unit === "metric") {
      // fuelEffNum is liters per 100 km
      fuelNeeded = (distanceNum / 100) * fuelEffNum * (1 + wasteNum);
    } else {
      // imperial: fuelEffNum is miles per gallon
      // fuelNeeded = distance / mpg * (1 + waste)
      fuelNeeded = (distanceNum / fuelEffNum) * (1 + wasteNum);
    }

    const cost = fuelNeeded * fuelPriceNum;

    return {
      mainQty: fuelNeeded.toFixed(2),
      unitLabel: inputs.unit === "metric" ? "liters" : "gallons",
      cost: `$${cost.toFixed(2)}`,
      details: `Fuel needed: ${fuelNeeded.toFixed(2)} ${inputs.unit === "metric" ? "liters" : "gallons"}`,
      wasteInfo: `+${inputs.waste}% Waste included`,
    };
  }, [inputs]);

  // --- 1. DETAILED FAQ ---
  const faqs = [
    {
      question: "How do I determine the correct fuel efficiency to use?",
      answer:
        "Use your vehicle's average fuel consumption figures, typically found in the owner's manual or vehicle specifications. For metric units, this is usually liters per 100 kilometers; for imperial, miles per gallon.",
    },
    {
      question: "What does the waste margin represent in this calculator?",
      answer:
        "The waste margin accounts for extra fuel consumption due to factors like traffic, detours, idling, or inefficient driving. It is recommended to keep it around 10% to ensure you have enough fuel.",
    },
    {
      question: "Can I use this calculator for round trips?",
      answer:
        "Yes, simply enter the total distance for the entire trip, including the return journey, to get an accurate fuel cost estimate.",
    },
    {
      question: "Why does the calculator ask for fuel price?",
      answer:
        "Entering the current fuel price per liter or gallon allows the calculator to estimate the total cost of fuel for your trip, helping you budget accordingly.",
    },
    {
      question: "What units should I select for my inputs?",
      answer:
        "Select 'Metric' if you measure distance in kilometers and fuel in liters. Select 'Imperial' if you use miles and gallons. Ensure all inputs correspond to the selected unit system for accurate results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. REFERENCES ---
  const references = [
    {
      title: "American Society for Testing and Materials (ASTM)",
      description:
        "Provides standards and guidelines for fuel efficiency testing and vehicle performance metrics.",
    },
    {
      title: "U.S. Department of Energy - Fuel Economy Guide",
      description:
        "Comprehensive resource for understanding vehicle fuel consumption and cost estimation.",
    },
    {
      title: "Environmental Protection Agency (EPA) - Green Vehicle Guide",
      description:
        "Offers detailed information on fuel economy ratings and environmental impact of vehicles.",
    },
  ];

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Distance ({inputs.unit === "metric" ? "kilometers" : "miles"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Enter trip distance in ${inputs.unit === "metric" ? "km" : "miles"}`}
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Fuel Efficiency (
            {inputs.unit === "metric" ? "liters per 100 kilometers" : "miles per gallon"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={
              inputs.unit === "metric"
                ? "e.g., 8.5"
                : "e.g., 25"
            }
            value={inputs.fuelEfficiency}
            onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Price ({inputs.unit === "metric" ? "per liter" : "per gallon"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Enter fuel price in $/${inputs.unit === "metric" ? "liter" : "gallon"}`}
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
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

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Fuel Needed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty}{" "}
              <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
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
            <strong>Step 1:</strong> Select your preferred unit system: Metric (kilometers and liters) or Imperial (miles and gallons).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total trip distance in the selected unit.
          </li>
          <li>
            <strong>Step 3:</strong> Input your vehicle's fuel efficiency. For Metric, enter liters per 100 kilometers; for Imperial, enter miles per gallon.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the current fuel price per liter or gallon.
          </li>
          <li>
            <strong>Step 5:</strong> Adjust the Waste Margin slider to account for extra fuel consumption due to traffic, detours, or idling. A 10% margin is recommended.
          </li>
          <li>
            <strong>Step 6:</strong> Click the Calculate button to see the estimated fuel needed and total fuel cost for your trip.
          </li>
        </ol>
      </section>

      {/* SECTION: COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Trip Fuel Cost Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Planning a trip requires careful budgeting, and fuel cost is often a significant part of travel expenses. This Trip Fuel Cost Calculator helps you estimate the amount of fuel you will need and the total cost based on your vehicle's fuel efficiency, trip distance, and current fuel prices.
          </p>
          <p>
            The calculator supports both Metric and Imperial units to accommodate different measurement preferences. Fuel efficiency is a critical input and varies widely depending on vehicle type, driving habits, and road conditions. For metric users, fuel efficiency is expressed as liters consumed per 100 kilometers. For imperial users, it is miles traveled per gallon of fuel.
          </p>
          <p>
            The waste margin accounts for additional fuel consumption caused by factors such as traffic congestion, detours, idling, and variations in driving style. Including a waste margin ensures you have a buffer and reduces the risk of running out of fuel during your trip.
          </p>
          <p>
            By entering the current fuel price, you can also estimate the total cost of fuel for your journey, helping you plan your budget more accurately. This calculator is a valuable tool for both everyday commuters and long-distance travelers.
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
            <strong>1. Incorrect unit selection:</strong> Mixing metric and imperial units can lead to inaccurate results. Always ensure the unit system matches your input values.
          </p>
          <p>
            <strong>2. Using outdated or inaccurate fuel efficiency:</strong> Fuel efficiency can vary based on vehicle condition and driving habits. Use recent and realistic values for best estimates.
          </p>
          <p>
            <strong>3. Ignoring waste margin:</strong> Not accounting for extra fuel consumption due to traffic or detours can cause underestimation of fuel needs.
          </p>
          <p>
            <strong>4. Forgetting to include round-trip distance:</strong> If your trip includes a return journey, include the total distance to avoid underestimating fuel costs.
          </p>
          <p>
            <strong>5. Not updating fuel price:</strong> Fuel prices fluctuate frequently. Use current prices to get accurate cost estimates.
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
      title="Trip Fuel Cost Calculator"
      description="Professional calculator: Trip Fuel Cost Calculator. Accurate estimates, waste factors, and expert construction advice."
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