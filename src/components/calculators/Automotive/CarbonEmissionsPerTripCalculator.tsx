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

export default function CarbonEmissionsPerTripCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    distance: "", // Trip distance (miles or km)
    fuelEfficiency: "", // Vehicle fuel efficiency (mpg or L/100km)
    fuelType: "gasoline", // Fuel type
    fuelPrice: "" // Price per unit fuel (optional, for cost estimate)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Emission factors in kg CO2 per liter or gallon of fuel burned
  // Source: EPA and UK DEFRA data
  const emissionFactors = {
    gasoline: {
      imperial: 8.887, // kg CO2 per gallon
      metric: 2.31 // kg CO2 per liter
    },
    diesel: {
      imperial: 10.16,
      metric: 2.68
    },
    electric: {
      imperial: 0, // zero tailpipe emissions
      metric: 0
    }
  };

  // Convert fuel efficiency to fuel consumed per distance unit
  // For imperial: mpg => gallons per mile = 1/mpg
  // For metric: L/100km => liters per km = L/100km / 100
  // We calculate total fuel consumed = distance * fuel consumed per unit distance

  const results = useMemo(() => {
    const dist = parseFloat(inputs.distance);
    const fe = parseFloat(inputs.fuelEfficiency);
    const price = parseFloat(inputs.fuelPrice);
    const unit = inputs.unit;
    const fuel = inputs.fuelType;

    if (isNaN(dist) || dist <= 0 || isNaN(fe) || fe <= 0) {
      return {
        primary: "0 kg CO₂",
        secondary: price > 0 ? "$0.00" : "",
        details: "Please enter valid positive numbers for distance and fuel efficiency.",
        feedback: "Awaiting valid input"
      };
    }

    // Fuel consumed calculation
    let fuelConsumed = 0; // in gallons or liters depending on unit

    if (unit === "imperial") {
      // fuelEfficiency is mpg, fuelConsumed = distance / mpg
      fuelConsumed = dist / fe;
    } else {
      // metric: fuelEfficiency is L/100km
      // liters per km = fe / 100
      fuelConsumed = dist * (fe / 100);
    }

    // Emission factor for fuel type and unit
    const emissionFactor = emissionFactors[fuel][unit]; // kg CO2 per gallon or liter

    // Total emissions in kg CO2
    const totalEmissions = fuelConsumed * emissionFactor;

    // Cost calculation if price is provided
    let cost = 0;
    if (!isNaN(price) && price > 0) {
      cost = fuelConsumed * price;
    }

    // Format results
    const primary = `${totalEmissions.toFixed(2)} kg CO₂`;
    const secondary = cost > 0 ? `$${cost.toFixed(2)}` : "";
    const details = `Fuel consumed: ${fuelConsumed.toFixed(2)} ${unit === "imperial" ? "gallons" : "liters"}`;

    // Feedback based on emissions
    let feedback = "Emission estimate within typical range.";
    if (totalEmissions > 50) {
      feedback = "High emissions for this trip distance and vehicle.";
    } else if (totalEmissions < 5) {
      feedback = "Low emissions, possibly electric or very efficient vehicle.";
    }

    return { primary, secondary, details, feedback };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How is carbon emissions per trip calculated?",
      answer:
        "Carbon emissions per trip are calculated by estimating the amount of fuel consumed during the trip and multiplying it by the carbon dioxide emission factor for the specific fuel type. The fuel consumed depends on the trip distance and the vehicle's fuel efficiency. This method provides an estimate of the greenhouse gases released directly from fuel combustion."
    },
    {
      question: "Why do different fuel types have different emission factors?",
      answer:
        "Different fuels contain varying amounts of carbon and energy content, which affects the amount of CO2 produced when burned. For example, diesel fuel has a higher carbon content per gallon than gasoline, resulting in higher emissions per unit of fuel consumed. Electric vehicles have zero tailpipe emissions but may have indirect emissions depending on electricity generation."
    },
    {
      question: "Can this calculator estimate emissions for electric vehicles?",
      answer:
        "This calculator assumes zero tailpipe emissions for electric vehicles since they do not burn fuel directly. However, it does not account for upstream emissions from electricity production, which vary by region and energy sources. For a full lifecycle analysis, additional data on electricity generation emissions would be needed."
    },
    {
      question: "How accurate is the carbon emissions estimate?",
      answer:
        "The estimate is based on average emission factors and user-provided inputs such as fuel efficiency and trip distance. Real-world emissions can vary due to driving conditions, vehicle maintenance, and fuel quality. This calculator provides a useful approximation but should not replace detailed emissions testing."
    },
    {
      question: "Why is fuel efficiency input different for imperial and metric units?",
      answer:
        "Fuel efficiency is expressed differently depending on the measurement system. In imperial units, it is typically miles per gallon (mpg), indicating how many miles a vehicle can travel per gallon of fuel. In metric units, it is liters per 100 kilometers (L/100km), indicating how many liters of fuel are consumed to travel 100 kilometers. The calculator converts these appropriately for calculations."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating carbon emissions for a 50-mile trip in a gasoline SUV with a fuel efficiency of 20 mpg and gasoline price of $3.50 per gallon.",
    steps: [
      {
        label: "Step 1: Calculate fuel consumed",
        explanation: "Fuel consumed = Distance / Fuel Efficiency = 50 miles / 20 mpg = 2.5 gallons"
      },
      {
        label: "Step 2: Calculate CO₂ emissions",
        explanation:
          "CO₂ emissions = Fuel consumed × Emission factor = 2.5 gallons × 8.887 kg CO₂/gallon = 22.22 kg CO₂"
      },
      {
        label: "Step 3: Calculate fuel cost",
        explanation: "Fuel cost = Fuel consumed × Price per gallon = 2.5 gallons × $3.50 = $8.75"
      }
    ],
    result: "Final Result: 22.22 kg CO₂ emitted and $8.75 spent on fuel for the trip."
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description: "Official source for fuel economy ratings and emission factors for vehicles."
    },
    {
      title: "UK DEFRA Emission Factors",
      description: "Comprehensive emission factors for various fuels and activities."
    },
    {
      title: "Kelley Blue Book",
      description: "Trusted vehicle valuation and pricing information."
    },
    {
      title: "Edmunds Automotive",
      description: "Car reviews, fuel efficiency data, and automotive advice."
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
          <Label>Trip Distance ({inputs.unit === "imperial" ? "miles" : "kilometers"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            placeholder={`Enter distance in ${inputs.unit === "imperial" ? "miles" : "km"}`}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Fuel Efficiency ({inputs.unit === "imperial" ? "mpg" : "L/100km"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelEfficiency}
            onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 25 mpg" : "e.g. 8.5 L/100km"}
          />
        </div>

        <div className="space-y-2">
          <Label>Fuel Type</Label>
          <Select
            value={inputs.fuelType}
            onValueChange={(v) => handleInputChange("fuelType", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasoline">Gasoline</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Electric (Zero tailpipe emissions)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>
            Fuel Price ({inputs.unit === "imperial" ? "per gallon" : "per liter"}) (optional)
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.90"}
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
            <p className="mt-3 text-sm italic text-slate-700 dark:text-slate-400">{results.feedback}</p>
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
            <strong>Step 1:</strong> Select your preferred measurement system: Imperial (miles, gallons) or Metric (kilometers, liters).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total distance of your trip in miles or kilometers.
          </li>
          <li>
            <strong>Step 3:</strong> Input your vehicle's fuel efficiency: miles per gallon (mpg) for Imperial or liters per 100 kilometers (L/100km) for Metric.
          </li>
          <li>
            <strong>Step 4:</strong> Choose your vehicle's fuel type: gasoline, diesel, or electric.
          </li>
          <li>
            <strong>Step 5 (Optional):</strong> Enter the current fuel price per gallon or liter to estimate the fuel cost for your trip.
          </li>
          <li>
            <strong>Step 6:</strong> Click the Calculate button to see your estimated carbon emissions and fuel cost.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Carbon Emissions per Trip
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding the carbon emissions generated by your vehicle during a trip is essential for assessing your environmental impact and making informed decisions about transportation. This calculator estimates the amount of carbon dioxide (CO₂) emitted based on your trip distance, vehicle fuel efficiency, and fuel type. It uses standardized emission factors that represent the average CO₂ produced per unit of fuel burned.
          </p>
          <p>
            The calculation starts by determining how much fuel your vehicle consumes over the trip distance. For example, if you drive 100 miles in a car that gets 25 miles per gallon, you consume 4 gallons of fuel. This fuel consumption is then multiplied by the emission factor for your fuel type, such as gasoline or diesel, to estimate the total CO₂ emissions in kilograms.
          </p>
          <p>
            Fuel efficiency is a critical input and varies widely between vehicles and driving conditions. Imperial units use miles per gallon (mpg), which indicates how many miles a vehicle can travel on one gallon of fuel. Metric units use liters per 100 kilometers (L/100km), which shows how many liters of fuel are consumed to travel 100 kilometers. This calculator automatically adjusts calculations based on your selected unit system.
          </p>
          <p>
            Additionally, you can input the current fuel price to estimate the cost of fuel for your trip. This helps you understand not only the environmental but also the financial impact of your travel. Electric vehicles are treated as having zero tailpipe emissions here, though it's important to note that upstream emissions from electricity generation are not included.
          </p>
          <p>
            By using this calculator regularly, you can track your vehicle’s carbon footprint, compare different vehicles or routes, and explore ways to reduce emissions, such as carpooling, choosing more efficient vehicles, or switching to alternative fuels.
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
            <strong>1. Incorrect unit selection:</strong> Using miles with metric fuel efficiency or kilometers with imperial fuel efficiency will produce inaccurate results. Always ensure your units are consistent.
          </p>
          <p>
            <strong>2. Using outdated or estimated fuel efficiency:</strong> Factory ratings may differ from real-world fuel efficiency. For better accuracy, use your vehicle’s actual average fuel consumption.
          </p>
          <p>
            <strong>3. Ignoring fuel type differences:</strong> Gasoline and diesel have different emission factors. Selecting the wrong fuel type will skew your emissions estimate.
          </p>
          <p>
            <strong>4. Not accounting for electric vehicle nuances:</strong> This calculator assumes zero tailpipe emissions for electric vehicles but does not consider upstream emissions from electricity generation.
          </p>
          <p>
            <strong>5. Leaving inputs blank or zero:</strong> Ensure all required fields have positive numbers to get meaningful results.
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
      title="Carbon Emissions per Trip"
      description="Professional automotive calculator: Carbon Emissions per Trip. Get accurate estimates, expert advice, and financial insights."
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