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

export default function FuelEconomyConverterCalculator() {
  // State: unit system and input value
  // val1: Fuel Economy input (mpg or L/100km)
  // unit: "imperial" (mpg) or "metric" (L/100km)
  const [inputs, setInputs] = useState({ unit: "imperial", val1: "" });
  const handleInputChange = useCallback(
    (n: string, v: string) =>
      setInputs((p) => ({
        ...p,
        [n]: v,
      })),
    []
  );

  // Conversion formulas:
  // mpg (US) to L/100km: L/100km = 235.214583 / mpg
  // L/100km to mpg (US): mpg = 235.214583 / L/100km
  // Use US gallon and miles for imperial base

  const results = useMemo(() => {
    const val = parseFloat(inputs.val1);
    if (!val || val <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    if (inputs.unit === "imperial") {
      // Input is mpg (US)
      // Convert mpg to L/100km
      const lPer100km = 235.214583 / val;
      return {
        value: lPer100km.toFixed(2),
        label: "Liters per 100 kilometers (L/100 km)",
        subtext:
          "L/100 km is a metric measure of fuel consumption indicating how many liters of fuel are used to travel 100 kilometers. Lower values mean better fuel efficiency.",
        color: "text-green-700",
        icon: <Fuel className="mx-auto h-10 w-10 text-green-700" />,
      };
    } else {
      // Input is L/100km
      // Convert L/100km to mpg (US)
      const mpg = 235.214583 / val;
      return {
        value: mpg.toFixed(2),
        label: "Miles per Gallon (mpg US)",
        subtext:
          "MPG measures how many miles a vehicle can travel per gallon of fuel. Higher MPG means better fuel economy.",
        color: "text-blue-600",
        icon: <Gauge className="mx-auto h-10 w-10 text-blue-600" />,
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "Why do fuel economy units differ between countries?",
      answer:
        "Fuel economy units vary due to historical measurement systems. The US uses miles per gallon (mpg) based on the imperial system, while most other countries use liters per 100 kilometers (L/100 km) based on the metric system. This difference reflects regional preferences and standards.",
    },
    {
      question: "Why is L/100 km inversely related to mpg?",
      answer:
        "L/100 km measures fuel consumed per distance, while mpg measures distance per fuel volume. Hence, they are inversely related: as mpg increases, L/100 km decreases, indicating better fuel efficiency.",
    },
    {
      question: "Is mpg always based on US gallons?",
      answer:
        "No, mpg can refer to US gallons or imperial gallons. This calculator uses US gallons (1 US gallon = 3.78541 liters) as it is the most common standard for mpg in automotive contexts.",
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
          <SelectTrigger className="w-[180px]">
            <Settings className="mr-2 h-4 w-4" />{" "}
            <SelectValue>
              {inputs.unit === "imperial"
                ? "Imperial (mpg US)"
                : "Metric (L/100 km)"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (mpg US)</SelectItem>
            <SelectItem value="metric">Metric (L/100 km)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fuelEconomyInput" className="mb-1 flex items-center gap-1">
            <Fuel className="h-4 w-4 text-yellow-600" />
            Enter Fuel Economy ({inputs.unit === "imperial" ? "mpg" : "L/100 km"})
          </Label>
          <Input
            id="fuelEconomyInput"
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial"
                ? "e.g. 25 (mpg)"
                : "e.g. 8.5 (L/100 km)"
            }
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Car className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ unit: inputs.unit, val1: "" })}
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
            <p className="mt-2 text-sm italic text-slate-500">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Fuel Economy Converter (mpg ↔ L/100 km)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Fuel economy is a critical measure of how efficiently a vehicle uses fuel.
          In the United States and a few other countries, fuel economy is commonly
          expressed as miles per gallon (mpg), which indicates how many miles a vehicle
          can travel on one gallon of fuel. Most other countries use liters per 100 kilometers
          (L/100 km), which measures how many liters of fuel are consumed to travel 100 kilometers.
          This converter allows you to switch between these two units easily, helping drivers
          understand and compare fuel efficiency globally.
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
            The formula 235.214583 used in fuel economy conversions comes from the exact
            relationship between miles, gallons, liters, and kilometers. It ensures precise
            conversions between mpg (US) and L/100 km, reflecting real-world engineering standards.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Select the unit system you want to input: Imperial (mpg US) or Metric (L/100 km).
          Enter the fuel economy value in the input box. Click "Calculate" to see the converted
          value instantly. Use the reset button to clear the input and start over.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
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
      title="Fuel Economy Converter (mpg ↔ L/100 km)"
      description="Convert fuel consumption instantly. Switch between Miles Per Gallon (MPG) and Liters per 100 kilometers (L/100 km) for international travel."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Formula",
        formula:
          "L/100 km = 235.214583 ÷ mpg (US)  |  mpg (US) = 235.214583 ÷ L/100 km",
        variables: [
          {
            symbol: "mpg (US)",
            description: "Miles per US gallon, imperial unit of fuel economy",
          },
          {
            symbol: "L/100 km",
            description: "Liters of fuel consumed per 100 kilometers, metric unit",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have a car that runs at 30 mpg (US) and want to know its fuel consumption in L/100 km.",
        steps: [
          {
            label: "1",
            explanation:
              "Use the formula: L/100 km = 235.214583 ÷ mpg = 235.214583 ÷ 30",
          },
          {
            label: "2",
            explanation: "Calculate: 235.214583 ÷ 30 ≈ 7.84 L/100 km",
          },
          {
            label: "3",
            explanation:
              "This means the car consumes approximately 7.84 liters of fuel to travel 100 kilometers.",
          },
        ],
        result: "Fuel consumption = 7.84 L/100 km",
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