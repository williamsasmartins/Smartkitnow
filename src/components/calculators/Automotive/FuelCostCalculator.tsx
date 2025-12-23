import { useState, useMemo, useCallback } from "react";
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
// ⚠️ AUTOMOTIVE ICONS
import {
  Car,
  Fuel,
  Gauge,
  Wrench,
  Settings,
  DollarSign,
  Info,
  RotateCcw,
  Zap,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FuelCostCalculator() {
  // State: unit system, distance, fuel consumption, fuel price
  // Distance: miles or km
  // Fuel consumption: MPG (US) or L/100km
  // Fuel price: per gallon (US) or per liter (metric)
  const [inputs, setInputs] = useState({
    unit: "imperial", // imperial or metric
    distance: "",
    fuelConsumption: "",
    fuelPrice: "",
  });

  const handleInputChange = useCallback(
    (name: string, value: string) =>
      setInputs((prev) => ({ ...prev, [name]: value })),
    []
  );

  const results = useMemo(() => {
    const { unit, distance, fuelConsumption, fuelPrice } = inputs;

    // Validate inputs
    if (
      !distance ||
      !fuelConsumption ||
      !fuelPrice ||
      isNaN(Number(distance)) ||
      isNaN(Number(fuelConsumption)) ||
      isNaN(Number(fuelPrice))
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Parse inputs
    const distInput = Number(distance);
    const fuelConsInput = Number(fuelConsumption);
    const fuelPriceInput = Number(fuelPrice);

    // Convert all to metric base units inside useMemo
    // Distance: miles to km (1 mile = 1.60934 km)
    // Fuel consumption:
    //   Imperial: MPG (US) -> L/100km = 235.215 / MPG
    //   Metric: L/100km (already)
    // Fuel price:
    //   Imperial: $/gallon (US gallon = 3.78541 L)
    //   Metric: $/liter (already)

    let distanceKm: number;
    let fuelConsumptionLper100km: number;
    let fuelPricePerLiter: number;

    if (unit === "imperial") {
      distanceKm = distInput * 1.60934;
      fuelConsumptionLper100km = 235.215 / fuelConsInput;
      fuelPricePerLiter = fuelPriceInput / 3.78541;
    } else {
      distanceKm = distInput;
      fuelConsumptionLper100km = fuelConsInput;
      fuelPricePerLiter = fuelPriceInput;
    }

    // Calculate fuel needed (liters)
    // Fuel needed = (distance in km) * (L/100km) / 100
    const fuelNeededLiters = (distanceKm * fuelConsumptionLper100km) / 100;

    // Calculate total cost
    const totalCost = fuelNeededLiters * fuelPricePerLiter;

    // Format cost as USD currency
    const costFormatted = totalCost.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

    // For display, also show fuel needed in liters and gallons
    // Gallons = liters / 3.78541
    const fuelNeededGallons = fuelNeededLiters / 3.78541;

    // Display fuel needed in unit system preferred by user
    const fuelNeededDisplay =
      unit === "imperial"
        ? `${fuelNeededGallons.toFixed(2)} gallons`
        : `${fuelNeededLiters.toFixed(2)} liters`;

    // Explanation note
    const subtext = `Fuel needed: ${fuelNeededDisplay}. Total cost calculated using your inputs converted to metric units for accuracy.`;

    return {
      value: costFormatted,
      label: "Estimated Fuel Cost",
      subtext,
      color: "text-green-700",
      icon: <DollarSign className="mx-auto h-12 w-12 text-green-700" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do we convert all units to metric for calculation?",
      answer:
        "Metric units provide a standardized base for calculations, reducing errors caused by unit inconsistencies. Converting inputs to metric ensures accuracy regardless of the user's preferred unit system.",
    },
    {
      question: "What does L/100km mean?",
      answer:
        "L/100km stands for liters per 100 kilometers, a common metric measure of fuel consumption indicating how many liters of fuel a vehicle uses to travel 100 kilometers.",
    },
    {
      question: "How does fuel consumption affect total cost?",
      answer:
        "Higher fuel consumption means more fuel is needed for the same distance, increasing the total fuel cost. Efficient vehicles with lower consumption save money over time.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[160px]">
            <Settings className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (Mi/MPG/Gal)</SelectItem>
            <SelectItem value="metric">Metric (Km/L/₤)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Distance */}
        <div>
          <Label htmlFor="distance" className="flex items-center gap-1">
            <Gauge className="h-4 w-4" /> Distance (
            {inputs.unit === "imperial" ? "miles" : "kilometers"})
          </Label>
          <Input
            id="distance"
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 100" : "e.g. 160"
            }
            value={inputs.distance}
            onChange={(e) => handleInputChange("distance", e.target.value)}
          />
        </div>

        {/* Fuel Consumption */}
        <div>
          <Label htmlFor="fuelConsumption" className="flex items-center gap-1">
            <Fuel className="h-4 w-4" /> Fuel Consumption (
            {inputs.unit === "imperial" ? "MPG (US)" : "L/100km"})
          </Label>
          <Input
            id="fuelConsumption"
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 25" : "e.g. 9.4"
            }
            value={inputs.fuelConsumption}
            onChange={(e) =>
              handleInputChange("fuelConsumption", e.target.value)
            }
          />
        </div>

        {/* Fuel Price */}
        <div>
          <Label htmlFor="fuelPrice" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" /> Fuel Price (
            {inputs.unit === "imperial" ? "$/gallon" : "$/liter"})
          </Label>
          <Input
            id="fuelPrice"
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial" ? "e.g. 3.50" : "e.g. 0.92"
            }
            value={inputs.fuelPrice}
            onChange={(e) => handleInputChange("fuelPrice", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            /* Calculation is automatic on input change */
          }}
        >
          <Car className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ unit: inputs.unit, distance: "", fuelConsumption: "", fuelPrice: "" })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              {results.label}
            </p>
            <p className="mt-2 text-sm italic text-slate-500">
              {results.subtext}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Fuel Cost Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the total fuel cost for a trip based on
          your vehicle's fuel consumption, the distance you plan to travel, and
          current fuel prices. By converting all inputs to metric units, it
          ensures consistent and accurate calculations regardless of your
          preferred measurement system. Understanding your fuel cost helps you
          budget effectively and make informed decisions about your vehicle's
          efficiency and trip planning.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The first mass-produced car, the Ford Model T (1908), had a fuel
            efficiency of about 13 miles per gallon (MPG). Modern vehicles can
            achieve over 50 MPG, showcasing significant advances in automotive
            engineering and fuel economy.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          1. Select your preferred unit system: Imperial (miles, MPG, gallons)
          or Metric (kilometers, L/100km, liters).<br />
          2. Enter the distance you plan to travel.<br />
          3. Input your vehicle's fuel consumption rating.<br />
          4. Provide the current fuel price per gallon or liter.<br />
          5. Click "Calculate" to see your estimated total fuel cost for the
          trip.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          FAQ
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fuel Cost Calculator"
      description="Estimate your total fuel costs for any trip. Input distance and your car's mileage to budget for gas expenses accurately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Formula",
        formula:
          "Fuel Cost = (Distance × Fuel Consumption) ÷ 100 × Fuel Price per Liter",
        variables: [
          {
            symbol: "Distance",
            description:
              "Distance traveled in kilometers (converted from miles if needed)",
          },
          {
            symbol: "Fuel Consumption",
            description:
              "Fuel consumption in liters per 100 kilometers (L/100km)",
          },
          {
            symbol: "Fuel Price per Liter",
            description: "Fuel price in USD per liter (converted if needed)",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You plan to drive 150 miles in a car that gets 30 MPG, with fuel costing $3.50 per gallon.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 150 miles to kilometers: 150 × 1.60934 = 241.4 km.",
          },
          {
            label: "2",
            explanation:
              "Convert 30 MPG to L/100km: 235.215 ÷ 30 = 7.84 L/100km.",
          },
          {
            label: "3",
            explanation:
              "Convert fuel price to $/liter: $3.50 ÷ 3.78541 = $0.92 per liter.",
          },
          {
            label: "4",
            explanation:
              "Calculate fuel needed: (241.4 × 7.84) ÷ 100 = 18.92 liters.",
          },
          {
            label: "5",
            explanation:
              "Calculate total cost: 18.92 × 0.92 = $17.40.",
          },
        ],
        result: "Estimated fuel cost for the trip is $17.40.",
      }}
      relatedCalculators={[
        { title: "Trip Fuel Cost", url: "/automotive/trip-fuel-cost-calculator", icon: "⛽" },
        { title: "Tire Size Comparison", url: "/automotive/tire-size-comparison", icon: "🚗" },
        { title: "Car Loan Amortization", url: "/automotive/car-loan-payment-amortization-calculator", icon: "💰" },
        { title: "EV Charging Cost", url: "/automotive/ev-charging-cost-time-estimator", icon: "⚡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}