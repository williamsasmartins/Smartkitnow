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

export default function FuelEconomyConverterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // imperial or metric
    distance: "", // miles or km
    fuelEfficiency: "", // MPG or L/100km
    fuelEfficiencyUnit: "mpg", // mpg or lper100km
    gasPrice: "", // $ per gallon or $ per liter
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const MPG_TO_LPER100KM = 235.214583; // L/100km = 235.214583 / MPG
  const MILES_TO_KM = 1.609344;
  const GALLON_TO_LITER = 3.785411784;

  const results = useMemo(() => {
    const distanceNum = parseFloat(inputs.distance);
    const fuelEffNum = parseFloat(inputs.fuelEfficiency);
    const gasPriceNum = parseFloat(inputs.gasPrice);

    if (
      isNaN(distanceNum) ||
      distanceNum <= 0 ||
      isNaN(fuelEffNum) ||
      fuelEffNum <= 0 ||
      isNaN(gasPriceNum) ||
      gasPriceNum <= 0
    ) {
      return null;
    }

    let fuelUsedLiters = 0;
    let tripCost = 0;

    if (inputs.unit === "imperial") {
      // Inputs: distance in miles, fuelEff in MPG, gasPrice in $/gallon
      if (inputs.fuelEfficiencyUnit === "mpg") {
        // Fuel used in gallons = distance / MPG
        const fuelUsedGallons = distanceNum / fuelEffNum;
        fuelUsedLiters = fuelUsedGallons * GALLON_TO_LITER;
        tripCost = fuelUsedGallons * gasPriceNum;
      } else {
        // User entered L/100km but unit is imperial - convert distance to km first
        const distanceKm = distanceNum * MILES_TO_KM;
        // Fuel used in liters = (L/100km * distanceKm) / 100
        fuelUsedLiters = (fuelEffNum * distanceKm) / 100;
        const fuelUsedGallons = fuelUsedLiters / GALLON_TO_LITER;
        tripCost = fuelUsedGallons * gasPriceNum;
      }
    } else {
      // Metric units: distance in km, fuelEff in L/100km, gasPrice in $/liter
      if (inputs.fuelEfficiencyUnit === "lper100km") {
        // Fuel used in liters = (L/100km * distance) / 100
        fuelUsedLiters = (fuelEffNum * distanceNum) / 100;
        tripCost = fuelUsedLiters * gasPriceNum;
      } else {
        // User entered MPG but unit is metric - convert distance to miles first
        const distanceMiles = distanceNum / MILES_TO_KM;
        // Fuel used in gallons = distanceMiles / MPG
        const fuelUsedGallons = distanceMiles / fuelEffNum;
        fuelUsedLiters = fuelUsedGallons * GALLON_TO_LITER;
        tripCost = fuelUsedLiters * gasPriceNum;
      }
    }

    // Format outputs
    const fuelUsedFormatted = fuelUsedLiters.toFixed(2) + " L";
    const tripCostFormatted = "$" + tripCost.toFixed(2);

    return {
      primary: fuelUsedFormatted,
      label: "Fuel Used",
      secondary: tripCostFormatted,
      details: `Based on ${inputs.distance} ${
        inputs.unit === "imperial" ? "miles" : "km"
      }, fuel efficiency of ${inputs.fuelEfficiency} ${
        inputs.fuelEfficiencyUnit === "mpg" ? "MPG" : "L/100km"
      }, and gas price of $${gasPriceNum.toFixed(2)} per ${
        inputs.unit === "imperial" ? "gallon" : "liter"
      }.`,
      feedback: tripCost < 50 ? "Economical trip" : "Consider fuel savings",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I convert MPG to L/100km?",
      answer:
        "To convert MPG (miles per gallon) to L/100km (liters per 100 kilometers), use the formula: L/100km = 235.214583 ÷ MPG. This calculator handles conversions automatically.",
    },
    {
      question: "Why does fuel efficiency differ between city and highway?",
      answer:
        "City driving often involves stop-and-go traffic, which reduces fuel efficiency compared to steady highway speeds. Always consider your typical driving conditions when estimating fuel usage.",
    },
    {
      question: "How accurate is the trip cost estimate?",
      answer:
        "The estimate is based on your inputs and assumes consistent fuel efficiency and gas prices. Real-world factors like traffic, terrain, and vehicle load can affect actual fuel consumption and cost.",
    },
    {
      question: "Can I use this calculator for electric vehicles?",
      answer:
        "No, this calculator is designed for internal combustion engine vehicles using liquid fuel. For electric vehicles, use a dedicated energy consumption calculator.",
    },
    {
      question: "How does tire size affect fuel economy?",
      answer:
        "Incorrect tire size can impact your vehicle’s speedometer accuracy and fuel efficiency. Always use manufacturer-recommended tire sizes to maintain optimal fuel economy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "2023 Honda Civic trip: Planning a 150-mile highway drive with an average fuel efficiency of 32 MPG and gas price of $4.10 per gallon.",
    steps: [
      {
        label: "Step 1: Enter Distance",
        explanation: "Input 150 miles as your trip distance.",
      },
      {
        label: "Step 2: Enter Fuel Efficiency",
        explanation: "Input 32 MPG as your vehicle's fuel efficiency.",
      },
      {
        label: "Step 3: Enter Gas Price",
        explanation: "Input $4.10 as the current gas price per gallon.",
      },
      {
        label: "Step 4: Calculate",
        explanation:
          "The calculator estimates fuel used and trip cost based on your inputs.",
      },
    ],
    result:
      "Fuel Used: 4.69 gallons (~17.75 liters), Trip Cost: $19.23 for the 150-mile trip.",
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => {
            // When unit changes, reset fuelEfficiencyUnit accordingly
            setInputs((prev) => ({
              ...prev,
              unit: v,
              fuelEfficiencyUnit: v === "imperial" ? "mpg" : "lper100km",
              distance: "",
              fuelEfficiency: "",
              gasPrice: "",
            }));
          }}
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
            Fuel Efficiency{" "}
            <Select
              value={inputs.fuelEfficiencyUnit}
              onValueChange={(v) => handleInputChange("fuelEfficiencyUnit", v)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mpg">MPG</SelectItem>
                <SelectItem value="lper100km">L/100km</SelectItem>
              </SelectContent>
            </Select>
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Enter fuel efficiency in ${
              inputs.fuelEfficiencyUnit === "mpg" ? "MPG" : "L/100km"
            }`}
            value={inputs.fuelEfficiency}
            onChange={(e) => handleInputChange("fuelEfficiency", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>
            Gas Price ($ per{" "}
            {inputs.unit === "imperial" ? "gallon" : "liter"})
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

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        // Calculation is reactive, so no action needed on click
      >
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
          <BookOpen className="w-6 h-6 text-blue-500" /> Guide: Fuel Economy
          Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Understanding your vehicle's fuel economy is essential for budgeting
            trips and reducing fuel expenses. This calculator helps convert
            between common fuel efficiency units—miles per gallon (MPG) and liters
            per 100 kilometers (L/100km)—while estimating fuel consumption and
            trip cost based on your inputs.
          </p>
          <p>
            Always ensure you select the correct unit system—Imperial (US) or
            Metric—to match your inputs. Fuel efficiency values differ in meaning
            between MPG and L/100km: higher MPG means better efficiency, whereas
            lower L/100km means better efficiency.
          </p>
          <p>
            Gas prices fluctuate frequently, so update the gas price input to
            reflect current local prices for the most accurate trip cost
            estimation. Remember, real-world driving conditions such as traffic,
            terrain, and vehicle load can impact actual fuel consumption.
          </p>
          <p>
            Regular vehicle maintenance, including proper tire inflation and
            timely oil changes, can improve fuel economy and save money over
            time.
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
            with kilometers or liters with gallons leads to incorrect results.
            Always verify your unit selections.
          </p>
          <p>
            <strong>2. Using Outdated Gas Prices:</strong> Fuel prices vary daily.
            Using old prices can mislead your trip cost estimates.
          </p>
          <p>
            <strong>3. Overlooking Real-World Factors:</strong> Traffic, terrain,
            and driving habits affect fuel consumption beyond the calculator's
            estimates.
          </p>
          <p>
            <strong>4. Incorrect Tire Size:</strong> Using tires not recommended by
            the manufacturer can affect speedometer accuracy and fuel economy.
          </p>
          <p>
            <strong>5. Neglecting Vehicle Maintenance:</strong> Poorly maintained
            vehicles consume more fuel and reduce efficiency.
          </p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <strong>Q: {question}</strong>
              <p className="mt-1">{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fuel Economy Converter"
      description="Professional automotive calculator: Fuel Economy Converter. Get accurate estimates and expert advice."
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