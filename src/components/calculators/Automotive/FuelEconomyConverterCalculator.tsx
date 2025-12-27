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

export default function FuelEconomyConverterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    dist: "", // Distance to travel
    mpg: "",  // Fuel economy (MPG or L/100km)
    price: "" // Fuel price per gallon or liter
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const dist = parseFloat(inputs.dist);
    const mpg = parseFloat(inputs.mpg);
    const price = parseFloat(inputs.price);
    const unit = inputs.unit;

    if (isNaN(dist) || dist <= 0 || isNaN(mpg) || mpg <= 0 || isNaN(price) || price <= 0) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input"
      };
    }

    let fuelNeeded = 0;
    let cost = 0;

    if (unit === "imperial") {
      // Inputs: dist in miles, mpg in miles per gallon, price in $/gallon
      fuelNeeded = dist / mpg; // gallons
      cost = fuelNeeded * price;
    } else {
      // Metric: dist in kilometers, mpg is actually L/100km, price in $/liter
      // Convert L/100km to fuel needed: (dist * L/100km) / 100
      fuelNeeded = (dist * mpg) / 100; // liters
      cost = fuelNeeded * price;
    }

    return {
      primary: unit === "imperial"
        ? `${fuelNeeded.toFixed(2)} gallons`
        : `${fuelNeeded.toFixed(2)} liters`,
      secondary: `$${cost.toFixed(2)}`,
      details: `Fuel needed: ${fuelNeeded.toFixed(2)} ${unit === "imperial" ? "gallons" : "liters"} × Price: $${price.toFixed(2)} per ${unit === "imperial" ? "gallon" : "liter"}`,
      feedback: "Calculation successful"
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How do I convert fuel economy between MPG and L/100km?",
      answer:
        "MPG (miles per gallon) and L/100km (liters per 100 kilometers) are two common units for measuring fuel economy. To convert MPG to L/100km, use the formula: L/100km = 235.214 / MPG. Conversely, MPG = 235.214 / L/100km. This calculator uses MPG directly for imperial units and L/100km for metric units to estimate fuel cost."
    },
    {
      question: "Why does the calculator ask for fuel price?",
      answer:
        "Fuel price is essential to estimate the total cost of fuel for a trip. Even if you know your vehicle's fuel economy and the distance, without the current fuel price, you cannot calculate the total expense. Prices vary by location and fuel type, so entering an accurate price ensures precise cost estimation."
    },
    {
      question: "Can I use this calculator for electric vehicles?",
      answer:
        "No, this calculator is designed specifically for internal combustion engine vehicles that consume liquid fuel like gasoline or diesel. Electric vehicles use electricity measured in kWh, which requires a different calculation method and is not covered here."
    },
    {
      question: "What units should I use for distance and fuel economy?",
      answer:
        "Select 'Imperial (US)' if your distance is in miles and fuel economy in miles per gallon (MPG). Choose 'Metric' if your distance is in kilometers and fuel economy in liters per 100 kilometers (L/100km). Using consistent units ensures accurate calculations."
    },
    {
      question: "How accurate are the cost estimates?",
      answer:
        "The estimates depend on the accuracy of your inputs: distance, fuel economy, and fuel price. Real-world factors like driving conditions, vehicle maintenance, and fuel quality can affect actual fuel consumption and cost. Use this calculator as a guideline rather than an exact figure."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Financing a $35,000 SUV with an average fuel economy of 25 MPG, planning a 300-mile road trip, and fuel price at $4.00 per gallon.",
    steps: [
      {
        label: "Step 1: Calculate fuel needed",
        explanation: "Fuel needed = Distance ÷ MPG = 300 miles ÷ 25 MPG = 12 gallons"
      },
      {
        label: "Step 2: Calculate total fuel cost",
        explanation: "Cost = Fuel needed × Price per gallon = 12 gallons × $4.00 = $48.00"
      }
    ],
    result: "Final Result: You will need approximately 12 gallons of fuel, costing about $48.00 for the trip."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for MPG ratings and fuel economy information from the U.S. Environmental Protection Agency."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing resource including fuel economy data."
    },
    {
      title: "Edmunds Automotive",
      description: "Comprehensive car reviews, pricing, and fuel economy advice for consumers."
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
          <Label>Distance to Travel ({inputs.unit === "imperial" ? "miles" : "kilometers"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.dist}
            onChange={(e) => handleInputChange("dist", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 300" : "e.g. 480"}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Fuel Economy ({inputs.unit === "imperial" ? "MPG (miles/gallon)" : "L/100km (liters/100 km)"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.mpg}
            onChange={(e) => handleInputChange("mpg", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 25" : "e.g. 9.4"}
          />
        </div>
        <div className="space-y-2">
          <Label>Fuel Price ({inputs.unit === "imperial" ? "$ per gallon" : "$ per liter"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 4.00" : "e.g. 1.06"}
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
            <strong>Step 1:</strong> Select your preferred unit system: Imperial (miles, gallons) or Metric (kilometers, liters).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total distance you plan to travel in the appropriate unit (miles or kilometers).
          </li>
          <li>
            <strong>Step 3:</strong> Input your vehicle's fuel economy. Use MPG for Imperial or L/100km for Metric.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the current fuel price per gallon or liter depending on your unit choice.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to see the estimated fuel needed and total cost for your trip.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Fuel Economy Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding your vehicle's fuel economy and the cost of fuel is crucial for budgeting trips and managing your automotive expenses efficiently. This Fuel Economy Converter calculator helps you estimate the total fuel cost for any journey by combining three key inputs: the distance you plan to travel, your vehicle's fuel efficiency, and the current fuel price.
          </p>
          <p>
            The calculator supports both Imperial and Metric units, accommodating users worldwide. In the Imperial system, fuel economy is measured in miles per gallon (MPG), distance in miles, and fuel price per gallon. In the Metric system, fuel economy is expressed as liters per 100 kilometers (L/100km), distance in kilometers, and fuel price per liter. This distinction is important because MPG and L/100km represent fuel efficiency inversely; higher MPG means better efficiency, while lower L/100km means better efficiency.
          </p>
          <p>
            To calculate the fuel needed, the calculator divides the distance by MPG in Imperial units or multiplies distance by L/100km and divides by 100 in Metric units. Multiplying the fuel needed by the fuel price gives the total estimated cost. This tool is invaluable for trip planning, helping you anticipate fuel expenses and make informed decisions about your vehicle usage.
          </p>
          <p>
            Remember, actual fuel consumption can vary due to driving habits, terrain, vehicle load, and maintenance. Always consider these factors for more accurate budgeting. This calculator provides a reliable estimate to guide your financial planning related to fuel consumption.
          </p>
        </div>
      </section>

      {/* 3. COMMON MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Mixing units:</strong> Entering distance in miles but fuel economy in L/100km or vice versa will produce incorrect results. Always ensure your units are consistent with the selected system.
          </p>
          <p>
            <strong>2. Using outdated fuel prices:</strong> Fuel prices fluctuate frequently. Using old or estimated prices can lead to inaccurate cost calculations.
          </p>
          <p>
            <strong>3. Ignoring real-world factors:</strong> The calculator assumes average conditions. Factors like traffic, terrain, and vehicle load can affect actual fuel consumption.
          </p>
          <p>
            <strong>4. Not entering positive numbers:</strong> Negative or zero values for distance, fuel economy, or price are invalid and will prevent accurate calculations.
          </p>
          <p>
            <strong>5. Confusing MPG and L/100km:</strong> Remember that MPG is miles per gallon (higher is better), while L/100km is liters per 100 kilometers (lower is better). Enter the correct value based on your unit selection.
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
      title="Fuel Economy Converter"
      description="Professional automotive calculator: Fuel Economy Converter. Get accurate estimates, expert advice, and financial insights."
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