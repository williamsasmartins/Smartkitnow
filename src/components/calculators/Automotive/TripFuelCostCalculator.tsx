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
  Gauge,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Settings,
  Timer,
  Zap,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TripFuelCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // imperial or metric
    distance: "", // miles or km
    fuelEfficiency: "", // mpg or L/100km
    gasPrice: "", // $/gallon or $/liter
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and dot
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const distance = parseFloat(inputs.distance);
    const fuelEfficiency = parseFloat(inputs.fuelEfficiency);
    const gasPrice = parseFloat(inputs.gasPrice);

    if (
      isNaN(distance) ||
      distance <= 0 ||
      isNaN(fuelEfficiency) ||
      fuelEfficiency <= 0 ||
      isNaN(gasPrice) ||
      gasPrice <= 0
    ) {
      return {
        primary: "0.00",
        label: "Trip Cost",
        secondary: "$0.00",
        details: "Enter valid positive numbers to calculate.",
        feedback: "neutral",
      };
    }

    let fuelUsed = 0;
    let tripCost = 0;

    if (inputs.unit === "imperial") {
      // fuelEfficiency in MPG, distance in miles, gasPrice in $/gallon
      // fuelUsed = distance / mpg
      fuelUsed = distance / fuelEfficiency; // gallons
      tripCost = fuelUsed * gasPrice; // $
      return {
        primary: tripCost.toFixed(2),
        label: "Trip Cost ($)",
        secondary: `$${tripCost.toFixed(2)}`,
        details: `Fuel used: ${fuelUsed.toFixed(2)} gallons`,
        feedback: tripCost < 50 ? "good" : tripCost < 150 ? "average" : "bad",
      };
    } else {
      // metric: fuelEfficiency in L/100km, distance in km, gasPrice in $/liter
      // fuelUsed = (distance * fuelEfficiency) / 100
      fuelUsed = (distance * fuelEfficiency) / 100; // liters
      tripCost = fuelUsed * gasPrice; // $
      return {
        primary: tripCost.toFixed(2),
        label: "Trip Cost ($)",
        secondary: `$${tripCost.toFixed(2)}`,
        details: `Fuel used: ${fuelUsed.toFixed(2)} liters`,
        feedback: tripCost < 50 ? "good" : tripCost < 150 ? "average" : "bad",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "How do I convert MPG to L/100km?",
      answer:
        "To convert MPG (miles per gallon) to L/100km (liters per 100 kilometers), use the formula: L/100km = 235.215 / MPG. This helps when switching between Imperial and Metric units.",
    },
    {
      question: "Why does fuel efficiency differ between city and highway?",
      answer:
        "Fuel efficiency varies because city driving involves frequent stops and idling, which consumes more fuel, while highway driving is steadier and more efficient. Use the appropriate fuel efficiency figure for your trip type.",
    },
    {
      question: "How accurate is the trip fuel cost estimate?",
      answer:
        "The estimate is based on average fuel efficiency and current fuel prices. Actual costs may vary due to driving style, terrain, vehicle load, and fuel quality.",
    },
    {
      question: "Can I use this calculator for electric vehicles?",
      answer:
        "No, this calculator is designed for internal combustion engine vehicles using liquid fuel. Electric vehicle energy consumption requires a different approach.",
    },
    {
      question: "How often should I update the gas price input?",
      answer:
        "Fuel prices fluctuate frequently. For the most accurate trip cost estimate, update the gas price input shortly before your trip using current local prices.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the fuel cost for a 2023 Honda Civic on a 300-mile trip using Imperial units.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the trip distance: 300 miles (typical highway trip).",
      },
      {
        label: "Step 2",
        explanation:
          "Enter the fuel efficiency: 36 MPG (combined highway/city for 2023 Honda Civic).",
      },
      {
        label: "Step 3",
        explanation: "Enter the current gas price: $4.25 per gallon.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculate to find the estimated fuel used and total trip cost.",
      },
    ],
    result:
      "The trip will use approximately 8.33 gallons of fuel, costing about $35.41.",
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Distance ({inputs.unit === "imperial" ? "miles" : "kilometers"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Enter distance in ${
              inputs.unit === "imperial" ? "miles" : "km"
            }`}
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Fuel Efficiency (
            {inputs.unit === "imperial" ? "MPG" : "L/100km"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Enter fuel efficiency in ${
              inputs.unit === "imperial" ? "MPG" : "L/100km"
            }`}
            value={inputs.fuelEfficiency}
            onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Gas Price ($ per {inputs.unit === "imperial" ? "gallon" : "liter"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Enter gas price per ${
              inputs.unit === "imperial" ? "gallon" : "liter"
            }`}
            value={inputs.gasPrice}
            onChange={(e) => handleInputChange("gasPrice", e.target.value)}
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
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Guide: Trip Fuel Cost
          Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Accurately estimating your trip fuel cost is essential for budgeting
            and planning long drives. This calculator helps you determine how
            much fuel your vehicle will consume and the total cost based on your
            trip distance, vehicle fuel efficiency, and current fuel prices.
          </p>
          <p>
            Understanding the difference between Imperial and Metric units is
            crucial. In the US, fuel efficiency is commonly measured in miles
            per gallon (MPG), while most other countries use liters per 100
            kilometers (L/100km). This calculator supports both units and allows
            you to toggle between them seamlessly.
          </p>
          <p>
            Keep in mind that fuel efficiency varies depending on driving
            conditions such as city vs highway, terrain, and vehicle load.
            Always use the most accurate and recent fuel efficiency figures for
            your specific vehicle and driving style to get the best estimate.
          </p>
          <p>
            Regularly updating the gas price input with local fuel prices ensures
            your trip cost estimate remains relevant, especially during periods
            of volatile fuel prices.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Ignoring Unit Consistency:</strong> Mixing units like MPG
            with kilometers or L/100km with miles leads to incorrect results.
            Always ensure your inputs match the selected unit system.
          </p>
          <p>
            <strong>2. Using Outdated Fuel Efficiency:</strong> Vehicle fuel
            efficiency can change with maintenance, tire wear, and driving
            habits. Use recent and accurate data for your vehicle.
          </p>
          <p>
            <strong>3. Forgetting Fuel Price Variability:</strong> Fuel prices
            fluctuate daily and regionally. Use current local prices for best
            accuracy.
          </p>
          <p>
            <strong>4. Overlooking Tire Size Effects:</strong> Incorrect tire
            size can affect odometer readings and fuel economy, skewing your
            calculations.
          </p>
          <p>
            <strong>5. Not Accounting for Driving Conditions:</strong> Heavy
            traffic, hilly terrain, and vehicle load can significantly impact
            fuel consumption.
          </p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <div className="space-y-4">
          {faqs.map(({ question, answer }, i) => (
            <div key={i} className="prose prose-slate dark:prose-invert">
              <h3 className="font-semibold">{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Trip Fuel Cost Calculator"
      description="Professional automotive calculator: Trip Fuel Cost Calculator. Get accurate estimates and expert advice."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "guide", label: "Guide" },
        { id: "mistakes", label: "Mistakes" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}