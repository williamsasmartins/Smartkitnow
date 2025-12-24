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
  // val1: input fuel economy (mpg or L/100km depending on unit)
  // val2: not used here but kept for extensibility
  const [inputs, setInputs] = useState({ unit: "imperial", val1: "" });
  const handleInputChange = useCallback(
    (n: string, v: string) => setInputs((p) => ({ ...p, [n]: v })),
    []
  );

  /**
   * Conversion formulas:
   * mpg (US) to L/100km: L/100km = 235.214583 / mpg
   * L/100km to mpg (US): mpg = 235.214583 / L/100km
   *
   * Why 235.214583? Because:
   * 1 gallon (US) = 3.785411784 liters
   * 1 mile = 1.609344 kilometers
   * So, mpg to L/100km = (100 * 3.785411784) / 1.609344 / mpg = 235.214583 / mpg
   */

  const results = useMemo(() => {
    const val = parseFloat(inputs.val1);
    if (!val || val <= 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter a valid positive number.",
        color: "text-red-600",
        icon: <Fuel />,
      };
    }

    if (inputs.unit === "imperial") {
      // Input is mpg (US), convert to L/100km
      const lPer100km = 235.214583 / val;
      return {
        value: lPer100km.toFixed(2),
        label: "Liters per 100 kilometers (L/100 km)",
        subtext:
          "Lower values mean better fuel efficiency in metric units. This conversion helps international travelers understand fuel consumption globally.",
        color: "text-green-700",
        icon: <Gauge />,
      };
    } else {
      // Input is L/100km, convert to mpg (US)
      const mpg = 235.214583 / val;
      return {
        value: mpg.toFixed(2),
        label: "Miles per Gallon (MPG, US)",
        subtext:
          "Higher values mean better fuel efficiency in imperial units. This conversion is essential for comparing vehicles across regions.",
        color: "text-blue-600",
        icon: <Car />,
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "Why is fuel economy measured differently in the US and Europe?",
      answer:
        "The US uses miles per gallon (mpg) because it follows the imperial system, while Europe uses liters per 100 kilometers (L/100 km) based on the metric system. Both units express fuel efficiency but from different perspectives: mpg shows distance per fuel volume, L/100 km shows fuel volume per distance.",
    },
    {
      question: "Can I convert UK mpg with this calculator?",
      answer:
        "This calculator uses US mpg, which differs slightly from UK mpg due to different gallon sizes. UK gallon is larger (4.546 L), so UK mpg values will be higher for the same fuel consumption. Use a dedicated UK mpg converter for precise conversions.",
    },
    {
      question: "Why does the formula use 235.214583?",
      answer:
        "The constant 235.214583 is derived from unit conversions between gallons, liters, miles, and kilometers. It ensures accurate conversion between mpg (US) and L/100 km using real engineering standards.",
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
                ? "Imperial (MPG, US)"
                : "Metric (L/100 km)"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (MPG, US)</SelectItem>
            <SelectItem value="metric">Metric (L/100 km)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fuelEconomyInput" className="mb-1 flex items-center gap-2">
            <Fuel className="w-4 h-4 text-yellow-600" />
            Fuel Economy ({inputs.unit === "imperial" ? "MPG (US)" : "L/100 km"})
          </Label>
          <Input
            id="fuelEconomyInput"
            type="number"
            min="0"
            step="any"
            placeholder={
              inputs.unit === "imperial"
                ? "e.g., 30"
                : "e.g., 7.8"
            }
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
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
          onClick={() => setInputs({ ...inputs, val1: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Result */}
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
          Fuel economy is a critical metric that indicates how efficiently a vehicle uses fuel. In the United States, fuel economy is commonly expressed as miles per gallon (mpg), which measures how many miles a vehicle can travel on one gallon of fuel. Conversely, many countries use liters per 100 kilometers (L/100 km), which measures how many liters of fuel are consumed to travel 100 kilometers. This converter allows users to switch between these units, facilitating international comparisons and helping drivers understand their vehicle's efficiency regardless of location.
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
            The first fuel economy standards were introduced in the United States in the 1970s following the oil crisis, aiming to reduce fuel consumption and dependence on foreign oil. Since then, fuel economy has become a key factor in automotive engineering, influencing vehicle design, engine technology, and environmental regulations worldwide.
          </p>
        </div>
      </section>

      {/* How to Use */}
      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          1. Select the unit system of your input fuel economy: Imperial (MPG, US) or Metric (L/100 km).<br />
          2. Enter the fuel economy value in the input box.<br />
          3. Click "Calculate" to see the converted fuel economy in the other unit.<br />
          4. Use the reset button to clear the input and start a new conversion.<br />
          This tool helps you understand and compare fuel consumption values globally.
        </p>
      </section>

      {/* FAQ */}
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
      title="Fuel Economy Converter (mpg ↔ L/100 km)"
      description="Convert fuel consumption instantly. Switch between Miles Per Gallon (MPG) and Liters per 100 kilometers (L/100 km) for international travel."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Formula",
        formula: "L/100 km = 235.214583 ÷ MPG (US)",
        variables: [
          {
            symbol: "MPG (US)",
            description: "Miles per gallon (US gallon)",
          },
          {
            symbol: "L/100 km",
            description: "Liters per 100 kilometers",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have a car that runs at 30 MPG (US) and want to know its fuel consumption in L/100 km.",
        steps: [
          {
            label: "1",
            explanation:
              "Use the formula L/100 km = 235.214583 ÷ 30 = 7.84 L/100 km.",
          },
          {
            label: "2",
            explanation:
              "This means your car consumes approximately 7.84 liters of fuel to travel 100 kilometers.",
          },
        ],
        result: "7.84 L/100 km",
      }}
      relatedCalculators={[
        { title: "Fuel Cost Calculator", url: "/automotive/fuel-cost-calculator", icon: "⛽" },
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
