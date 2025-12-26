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

export default function AnnualFuelCostBreakEvenCalculator() {
  /*
    Inputs:
      - unit: "imperial" or "metric"
      - distance: trip distance (miles or km)
      - fuelEfficiency: MPG (imperial) or L/100km (metric)
      - gasPrice: price per gallon (imperial) or per liter (metric)
  */

  const [inputs, setInputs] = useState({
    unit: "imperial",
    distance: "",
    fuelEfficiency: "",
    gasPrice: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only valid numeric inputs (including decimal)
    if (
      value === "" ||
      /^(\d+(\.\d*)?|\.\d+)$/.test(value) // regex for positive decimals
    ) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Conversion constants
  const MILES_TO_KM = 1.609344;
  const GALLON_TO_LITER = 3.785411784;

  // Calculate results
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
      return null;
    }

    let fuelUsed = 0; // in gallons or liters depending on unit
    let tripCost = 0;

    if (inputs.unit === "imperial") {
      // fuelEfficiency = MPG (miles per gallon)
      // fuelUsed = distance / MPG
      fuelUsed = distance / fuelEfficiency; // gallons
      tripCost = fuelUsed * gasPrice; // dollars
    } else {
      // metric: fuelEfficiency = L/100km
      // fuelUsed = (distance * L/100km) / 100
      fuelUsed = (distance * fuelEfficiency) / 100; // liters
      tripCost = fuelUsed * gasPrice; // currency
    }

    // Format outputs
    const fuelUsedFormatted =
      inputs.unit === "imperial"
        ? `${fuelUsed.toFixed(2)} gallons`
        : `${fuelUsed.toFixed(2)} liters`;

    const tripCostFormatted = `$${tripCost.toFixed(2)}`;

    return {
      primary: tripCostFormatted,
      label: "Estimated Trip Fuel Cost",
      secondary: fuelUsedFormatted,
      details: `Fuel used for ${distance.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} ${inputs.unit === "imperial" ? "miles" : "km"}`,
      feedback: "Accurate estimate based on inputs",
    };
  }, [inputs]);

  // FAQ content
  const faqs = [
    {
      question: "How does fuel efficiency affect my annual fuel cost?",
      answer:
        "Fuel efficiency directly impacts how much fuel your vehicle consumes over a distance. Higher MPG or lower L/100km means less fuel used, reducing your overall fuel expenses.",
    },
    {
      question: "Why is it important to switch between Imperial and Metric units?",
      answer:
        "Fuel economy and distances are measured differently worldwide. Switching units ensures accurate calculations based on your local standards and fuel pricing.",
    },
    {
      question: "How can I estimate my annual fuel cost from a single trip?",
      answer:
        "Multiply your trip fuel cost by the number of similar trips you make annually, or scale the trip distance to your total yearly driving distance for an estimate.",
    },
    {
      question: "What factors can cause my actual fuel cost to differ from estimates?",
      answer:
        "Driving habits, traffic conditions, vehicle maintenance, and fuel quality can all affect real-world fuel consumption and costs compared to estimates.",
    },
    {
      question: "How does gas price volatility affect break-even calculations?",
      answer:
        "Fluctuating gas prices can change your fuel expenses significantly. It's wise to use average or current prices and update calculations regularly for accurate budgeting.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Realistic example object
  const example = {
    title: "Real World Example: 2023 Honda Civic Trip",
    scenario:
      "Calculating the fuel cost for a 150-mile trip in a 2023 Honda Civic with an EPA rating of 32 MPG city and 42 MPG highway, assuming an average of 37 MPG and gas price of $3.50 per gallon.",
    steps: [
      {
        label: "Step 1: Input Distance",
        explanation: "Enter the trip distance as 150 miles.",
      },
      {
        label: "Step 2: Enter Fuel Efficiency",
        explanation:
          "Use the average fuel efficiency of 37 MPG for the Civic.",
      },
      {
        label: "Step 3: Enter Gas Price",
        explanation: "Set the gas price to $3.50 per gallon.",
      },
      {
        label: "Step 4: Calculate",
        explanation:
          "The calculator estimates fuel used and total trip cost based on inputs.",
      },
    ],
    result:
      "Estimated fuel used: 4.05 gallons, Estimated trip cost: $14.18",
  };

  // Widget JSX
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
            Distance ({inputs.unit === "imperial" ? "miles" : "km"})
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 150" : "e.g. 240"
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
            step="0.01"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 37" : "e.g. 6.35"
            }
            value={inputs.fuelEfficiency}
            onChange={(e) =>
              handleInputChange("fuelEfficiency", e.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label>
            Gas Price (per {inputs.unit === "imperial" ? "gallon" : "liter"})
          </Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.92"
            }
            value={inputs.gasPrice}
            onChange={(e) => handleInputChange("gasPrice", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate Annual Fuel Cost and Break-Even"
      >
        <Car className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              {results.label}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Guide: Annual Fuel Cost &
          Break-Even
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding your vehicle’s annual fuel cost is essential for budgeting and
            making informed decisions about your transportation expenses. By accurately
            estimating how much fuel you consume and the cost associated with it, you can
            identify opportunities to save money, whether through improved driving habits,
            vehicle maintenance, or considering more fuel-efficient alternatives.
          </p>
          <p>
            This calculator supports both Imperial and Metric units, allowing you to input
            your trip distance, fuel efficiency, and local fuel prices in the units you are
            most familiar with. It then computes the fuel used and the total trip cost,
            providing a clear picture of your fuel expenses.
          </p>
          <p>
            When evaluating break-even points, such as deciding whether to upgrade to a more
            fuel-efficient vehicle or invest in alternative fuel technologies, understanding
            your current fuel costs is critical. This tool helps you quantify those costs
            precisely, enabling better financial and environmental decisions.
          </p>
          <p>
            Remember, real-world fuel consumption can vary due to factors like driving style,
            traffic, terrain, and vehicle condition. Use this calculator as a baseline and
            adjust your inputs accordingly for the most accurate estimates.
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
            <strong>1. Ignoring Unit Consistency:</strong> Mixing miles with liters or
            kilometers with gallons leads to incorrect calculations. Always ensure units
            match your inputs.
          </p>
          <p>
            <strong>2. Using Incorrect Fuel Efficiency Values:</strong> Using city MPG for
            highway trips or vice versa can skew results. Use the most relevant fuel
            efficiency rating for your driving conditions.
          </p>
          <p>
            <strong>3. Neglecting Fuel Price Variability:</strong> Gas prices fluctuate
            frequently. Use current or average prices for better accuracy.
          </p>
          <p>
            <strong>4. Overlooking Vehicle Maintenance Effects:</strong> Poorly maintained
            vehicles consume more fuel. Regular maintenance can improve fuel economy.
          </p>
          <p>
            <strong>5. Forgetting Tire Size and Pressure Impact:</strong> Incorrect tire
            size or low pressure increases rolling resistance, reducing fuel efficiency.
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Annual Fuel Cost & Break-Even"
      description="Professional automotive calculator: Annual Fuel Cost & Break-Even. Get accurate estimates and expert advice."
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