import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Fuel,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Settings,
  Zap,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TripFuelCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial",
    dist: "",
    mpg: "",
    price: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const results = useMemo(() => {
    const dist = parseFloat(inputs.dist);
    const mpg = parseFloat(inputs.mpg);
    const price = parseFloat(inputs.price);

    if (
      isNaN(dist) ||
      isNaN(mpg) ||
      isNaN(price) ||
      dist <= 0 ||
      mpg <= 0 ||
      price <= 0
    ) {
      return {
        primary: "0",
        secondary: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input",
      };
    }

    // Calculate gallons/liters needed
    // Imperial: miles and mpg
    // Metric: kilometers and L/100km (convert to mpg equivalent)
    let fuelNeeded = 0;
    let cost = 0;

    if (inputs.unit === "imperial") {
      // dist in miles, mpg in miles per gallon
      fuelNeeded = dist / mpg; // gallons
      cost = fuelNeeded * price; // dollars
    } else {
      // metric: dist in km, mpg input is L/100km (fuel consumption)
      // Convert L/100km to mpg equivalent for calculation:
      // Actually, better to calculate fuelNeeded = (dist * L/100km) / 100
      fuelNeeded = (dist * mpg) / 100; // liters
      cost = fuelNeeded * price; // currency unit per liter
    }

    return {
      primary:
        inputs.unit === "imperial"
          ? fuelNeeded.toFixed(2) + " gallons"
          : fuelNeeded.toFixed(2) + " liters",
      secondary: `$${cost.toFixed(2)}`,
      details: `Fuel needed: ${fuelNeeded.toFixed(
        2
      )} ${inputs.unit === "imperial" ? "gallons" : "liters"} × Price per ${
        inputs.unit === "imperial" ? "gallon" : "liter"
      } = $${cost.toFixed(2)}`,
      feedback: "Calculation successful",
    };
  }, [inputs]);

  // --- 1. LONG-FORM FAQ ---
  const faqs = [
    {
      question: "How accurate is the Trip Fuel Cost Calculator?",
      answer:
        "The calculator provides an estimate based on the inputs you provide, such as distance, fuel efficiency, and fuel price. Actual fuel costs may vary due to driving conditions, vehicle maintenance, and fuel quality. Always consider this as a guideline rather than an exact figure. For best results, use your vehicle's real-world MPG or fuel consumption data.",
    },
    {
      question: "Can I use this calculator for electric vehicles?",
      answer:
        "This calculator is designed specifically for internal combustion engine vehicles that consume fuel measured in gallons or liters. Electric vehicles use electricity, so their energy consumption and cost calculations differ significantly. For EVs, consider using a dedicated electric vehicle cost calculator based on kWh consumption and electricity rates.",
    },
    {
      question: "What units should I use for distance and fuel efficiency?",
      answer:
        "You can select between Imperial (miles and miles per gallon) or Metric (kilometers and liters per 100 kilometers) units using the dropdown. Ensure that your inputs correspond to the selected unit system to get accurate results. Mixing units may lead to incorrect calculations.",
    },
    {
      question: "Why does the calculator ask for fuel price per gallon or liter?",
      answer:
        "Fuel prices vary by location and fuel type. To estimate your trip fuel cost accurately, you need to input the current price you pay per gallon (Imperial) or per liter (Metric). This allows the calculator to multiply the fuel needed by the price, giving you a realistic cost estimate.",
    },
    {
      question: "How can I improve the accuracy of my fuel cost estimate?",
      answer:
        "Use your vehicle’s actual fuel efficiency data from recent trips rather than manufacturer ratings, as real-world driving conditions affect MPG or L/100km. Also, update the fuel price to reflect current local prices. Consider factors like traffic, terrain, and load, which can influence fuel consumption.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the fuel cost for a 300-mile trip in a midsize sedan with an average fuel efficiency of 30 MPG and a fuel price of $4.00 per gallon.",
    steps: [
      {
        label: "Step 1: Calculate fuel needed",
        explanation: "Fuel needed = Distance ÷ MPG = 300 miles ÷ 30 MPG = 10 gallons",
      },
      {
        label: "Step 2: Calculate total fuel cost",
        explanation: "Cost = Fuel needed × Price per gallon = 10 gallons × $4.00 = $40.00",
      },
    ],
    result: "Final Result: The trip will cost approximately $40.00 in fuel.",
  };

  // --- 3. REFERENCES ---
  const references = [
    {
      title: "EPA Fuel Economy Guide",
      description:
        "Official source for MPG ratings and fuel economy information provided by the U.S. Environmental Protection Agency.",
      url: "https://www.fueleconomy.gov/",
    },
    {
      title: "Kelley Blue Book",
      description:
        "Trusted vehicle valuation and pricing resource offering insights on vehicle fuel efficiency and costs.",
      url: "https://www.kbb.com/",
    },
    {
      title: "Edmunds Automotive",
      description:
        "Comprehensive car reviews, buying advice, and automotive cost calculators including fuel cost estimators.",
      url: "https://www.edmunds.com/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>
            Distance ({inputs.unit === "imperial" ? "miles" : "kilometers"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 300" : "e.g. 480"
            }
            value={inputs.dist}
            onChange={(e) => handleInputChange("dist", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Fuel Efficiency (
            {inputs.unit === "imperial" ? "MPG" : "L/100km"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 30" : "e.g. 7.8"
            }
            value={inputs.mpg}
            onChange={(e) => handleInputChange("mpg", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Fuel Price per {inputs.unit === "imperial" ? "gallon" : "liter"}
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 4.00" : "e.g. 1.06"
            }
            value={inputs.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Estimated Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system: Imperial
            (miles, gallons) or Metric (kilometers, liters).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total distance of your trip in
            miles or kilometers.
          </li>
          <li>
            <strong>Step 3:</strong> Input your vehicle’s fuel efficiency:
            miles per gallon (MPG) for Imperial or liters per 100 kilometers
            (L/100km) for Metric.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the current fuel price per gallon or
            liter based on your unit selection.
          </li>
          <li>
            <strong>Step 5:</strong> Click the “Calculate” button to see the
            estimated fuel needed and total fuel cost for your trip.
          </li>
        </ol>
      </section>

      {/* 2. COMPLETE GUIDE */}
      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Trip Fuel
          Cost Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Planning a road trip or daily commute often involves estimating fuel
            expenses to budget effectively. The Trip Fuel Cost Calculator is a
            professional tool designed to provide accurate fuel cost estimates
            based on your vehicle’s fuel efficiency, trip distance, and current
            fuel prices. Whether you drive a compact car or a large SUV, this
            calculator helps you understand how much you can expect to spend on
            fuel for any journey.
          </p>
          <p>
            The calculator supports both Imperial and Metric units, accommodating
            users worldwide. In Imperial mode, distance is measured in miles,
            fuel efficiency in miles per gallon (MPG), and fuel price per gallon.
            In Metric mode, distance is in kilometers, fuel efficiency in liters
            per 100 kilometers (L/100km), and fuel price per liter. This flexibility
            ensures accurate calculations regardless of your location or vehicle
            specifications.
          </p>
          <p>
            To use the calculator, simply input your trip distance, your vehicle’s
            fuel efficiency, and the current fuel price. The calculator then
            computes the total fuel needed and multiplies it by the fuel price to
            give you the estimated cost. This estimate can help you plan your
            budget, compare vehicles, or evaluate the cost-effectiveness of
            different routes or driving habits.
          </p>
          <p>
            Remember that real-world fuel consumption can vary due to factors such
            as traffic, terrain, weather, and vehicle load. For the most accurate
            results, use your vehicle’s actual fuel efficiency data from recent
            trips. This calculator is an essential tool for drivers, fleet
            managers, and anyone interested in understanding and managing fuel
            expenses efficiently.
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
            <strong>1. Mixing Units:</strong> Entering distance, fuel efficiency,
            or fuel price in different unit systems (e.g., miles with L/100km)
            leads to incorrect calculations. Always select the correct unit system
            and ensure all inputs match.
          </p>
          <p>
            <strong>2. Using Manufacturer MPG Instead of Real-World Data:</strong>{" "}
            Factory MPG ratings often differ from actual driving conditions. Use
            your vehicle’s real fuel consumption data for better accuracy.
          </p>
          <p>
            <strong>3. Forgetting to Update Fuel Prices:</strong> Fuel prices can
            fluctuate frequently. Using outdated prices will skew your cost
            estimate.
          </p>
          <p>
            <strong>4. Ignoring Driving Conditions:</strong> Factors like heavy
            traffic, hilly terrain, or carrying extra load increase fuel
            consumption but are not accounted for in this basic calculator.
          </p>
          <p>
            <strong>5. Negative or Zero Inputs:</strong> Ensure all inputs are
            positive numbers. Zero or negative values will invalidate the
            calculation.
          </p>
        </div>
      </section>

      {/* 4. FAQ */}
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

      {/* 5. REFERENCES */}
      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
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
      title="Trip Fuel Cost Calculator"
      description="Professional automotive calculator: Trip Fuel Cost Calculator. Get accurate estimates, expert advice, and financial insights."
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
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}