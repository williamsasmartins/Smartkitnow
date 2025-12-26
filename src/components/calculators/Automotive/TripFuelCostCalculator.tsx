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
    fuelEfficiency: "", // MPG or L/100km
    gasPrice: "", // $/gallon or $/liter
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal point
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const distance = parseFloat(inputs.distance);
    const fuelEfficiency = parseFloat(inputs.fuelEfficiency);
    const gasPrice = parseFloat(inputs.gasPrice);
    const unit = inputs.unit;

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
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "Invalid input",
      };
    }

    let fuelUsed = 0;
    let tripCost = 0;

    if (unit === "imperial") {
      // fuelEfficiency in MPG, distance in miles, gasPrice in $/gallon
      fuelUsed = distance / fuelEfficiency; // gallons
      tripCost = fuelUsed * gasPrice; // $
    } else {
      // metric: fuelEfficiency in L/100km, distance in km, gasPrice in $/liter
      fuelUsed = (fuelEfficiency * distance) / 100; // liters
      tripCost = fuelUsed * gasPrice; // $
    }

    return {
      primary: tripCost.toFixed(2),
      label: "Trip Cost",
      secondary: `$${tripCost.toFixed(2)}`,
      details: `Fuel Used: ${
        unit === "imperial"
          ? `${fuelUsed.toFixed(2)} gallons`
          : `${fuelUsed.toFixed(2)} liters`
      }`,
      feedback: "Calculation successful",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I convert between MPG and L/100km?",
      answer:
        "MPG (miles per gallon) and L/100km (liters per 100 kilometers) are inverse measures of fuel efficiency. To convert MPG to L/100km, use: L/100km = 235.215 / MPG. To convert L/100km to MPG, use: MPG = 235.215 / L/100km.",
    },
    {
      question: "Why does fuel efficiency vary between city and highway driving?",
      answer:
        "City driving involves frequent stops, idling, and lower speeds, which reduce fuel efficiency. Highway driving is steadier with higher speeds and less idling, generally resulting in better fuel economy.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "This calculator provides an estimate based on your inputs. Actual fuel consumption and cost can vary due to driving habits, vehicle condition, terrain, and fuel quality.",
    },
    {
      question: "Should I include additional costs like tolls or parking?",
      answer:
        "This calculator focuses solely on fuel costs. For a complete trip budget, consider adding tolls, parking fees, and other expenses separately.",
    },
    {
      question: "How does tire size affect fuel efficiency?",
      answer:
        "Incorrect tire size can affect your vehicle's speedometer accuracy and fuel economy. Using manufacturer-recommended tire sizes helps maintain optimal fuel efficiency.",
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
          "Input the trip distance as 300 miles, the fuel efficiency as 32 MPG (typical highway mileage for a 2023 Honda Civic), and the gas price as $4.00 per gallon.",
      },
      {
        label: "Step 2",
        explanation:
          "The calculator computes fuel used as 300 / 32 = 9.375 gallons and multiplies by $4.00 to get a trip cost of $37.50.",
      },
    ],
    result: "Final Result: Trip Cost = $37.50, Fuel Used = 9.38 gallons",
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
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 300" : "e.g. 480"
            }
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
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 32" : "e.g. 7.5"
            }
            value={inputs.fuelEfficiency}
            onChange={(e) =>
              handleInputChange("fuelEfficiency", e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>
            Gas Price (
            {inputs.unit === "imperial" ? "$ per gallon" : "$ per liter"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 4.00" : "e.g. 1.05"
            }
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
            Calculating the fuel cost for a trip is essential for budgeting and
            planning, especially for long-distance travel. This calculator
            allows you to estimate the total fuel cost by inputting your trip
            distance, vehicle fuel efficiency, and current fuel price. It
            supports both Imperial and Metric units, making it versatile for
            users worldwide.
          </p>
          <p>
            Fuel efficiency is commonly expressed as miles per gallon (MPG) in
            the US or liters per 100 kilometers (L/100km) in most other parts
            of the world. Understanding these units and how to convert between
            them can help you better interpret your vehicle’s performance and
            optimize fuel consumption.
          </p>
          <p>
            Remember that actual fuel consumption can vary due to driving
            conditions, vehicle maintenance, and driving habits. Using this
            calculator provides a reliable estimate, but always allow some
            margin for variability.
          </p>
          <p>
            Regularly monitoring your fuel costs and efficiency can help you
            identify when your vehicle may need maintenance or when driving
            habits could be improved to save money and reduce environmental
            impact.
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
            <strong>1. Ignoring unit consistency:</strong> Mixing units like
            miles with liters or MPG with L/100km without proper conversion
            leads to incorrect results.
          </p>
          <p>
            <strong>2. Using outdated or incorrect fuel prices:</strong> Fuel
            prices fluctuate frequently; always use current local prices for
            accuracy.
          </p>
          <p>
            <strong>3. Not accounting for driving conditions:</strong> Stop-and-go
            traffic, hills, and weather can significantly affect fuel
            consumption.
          </p>
          <p>
            <strong>4. Incorrect tire size or pressure:</strong> Using wrong tire
            sizes or underinflated tires can reduce fuel efficiency.
          </p>
          <p>
            <strong>5. Overlooking vehicle maintenance:</strong> Dirty air
            filters, old spark plugs, and poor engine tuning can increase fuel
            consumption.
          </p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <p className="font-semibold">{question}</p>
              <p>{answer}</p>
              <Separator className="my-2" />
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