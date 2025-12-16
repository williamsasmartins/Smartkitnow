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
import {
  ArrowRightLeft,
  Calculator,
  RotateCcw,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const units = [
  { label: "Celsius (°C)", value: "C" },
  { label: "Fahrenheit (°F)", value: "F" },
  { label: "Kelvin (K)", value: "K" },
];

// Conversion functions
function cToF(c: number) {
  return c * 9 / 5 + 32;
}
function fToC(f: number) {
  return (f - 32) * 5 / 9;
}
function cToK(c: number) {
  return c + 273.15;
}
function kToC(k: number) {
  return k - 273.15;
}

export default function TemperatureCFKCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("C");
  const [toUnit, setToUnit] = useState("F");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: 0,
        label: "Enter a numeric value to convert",
        formula: "Select units and enter a value",
      };
    }
    if (fromUnit === toUnit) {
      return {
        value: num.toLocaleString(undefined, { maximumFractionDigits: 4 }),
        label: `Same unit: ${toUnit}`,
        formula: `1 ${fromUnit} = 1 ${toUnit}`,
      };
    }

    // Convert input to Celsius as intermediate
    let celsius: number;
    switch (fromUnit) {
      case "C":
        celsius = num;
        break;
      case "F":
        celsius = fToC(num);
        break;
      case "K":
        celsius = kToC(num);
        break;
      default:
        return {
          value: 0,
          label: "Invalid from unit",
          formula: "Select valid units",
        };
    }

    // Convert Celsius to target unit
    let resultNum: number;
    switch (toUnit) {
      case "C":
        resultNum = celsius;
        break;
      case "F":
        resultNum = cToF(celsius);
        break;
      case "K":
        resultNum = cToK(celsius);
        break;
      default:
        return {
          value: 0,
          label: "Invalid to unit",
          formula: "Select valid units",
        };
    }

    // Build formula text for factor display
    // Show the formula for 1 unit of fromUnit in toUnit
    let formulaText = "";
    switch (fromUnit + "->" + toUnit) {
      case "C->F":
        formulaText = "1 °C = (1 × 9/5) + 32 = 33.8 °F";
        break;
      case "F->C":
        formulaText = "1 °F = (1 - 32) × 5/9 = -17.2222 °C";
        break;
      case "C->K":
        formulaText = "1 °C = 1 + 273.15 = 274.15 K";
        break;
      case "K->C":
        formulaText = "1 K = 1 - 273.15 = -272.15 °C";
        break;
      case "F->K":
        formulaText = "1 °F = ((1 - 32) × 5/9) + 273.15 = 255.9278 K";
        break;
      case "K->F":
        formulaText = "1 K = ((1 - 273.15) × 9/5) + 32 = -457.87 °F";
        break;
      default:
        formulaText = `1 ${fromUnit} = ... ${toUnit}`;
    }

    return {
      value: resultNum.toLocaleString(undefined, { maximumFractionDigits: 4 }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why do temperature conversions between Celsius and Fahrenheit involve both multiplication and addition?",
      answer:
        "The Celsius and Fahrenheit scales have different zero points and increments per degree, which is why conversion requires both scaling and shifting. Specifically, Fahrenheit degrees are larger by a factor of 9/5 compared to Celsius, and the zero points differ by 32 degrees. This combination results in the formula °F = (°C × 9/5) + 32.",
    },
    {
      question: "Why is Kelvin used in scientific temperature measurements instead of Celsius or Fahrenheit?",
      answer:
        "Kelvin is the SI base unit for temperature and is used in science because it starts at absolute zero, the theoretical point where all molecular motion stops. Unlike Celsius and Fahrenheit, Kelvin does not use negative numbers, simplifying many scientific calculations. This absolute scale is essential for thermodynamics and other physical sciences.",
    },
    {
      question: "Can temperature values below zero be converted to Kelvin?",
      answer:
        "No, Kelvin temperatures cannot be below zero because zero Kelvin represents absolute zero, the lowest possible temperature. Temperatures in Celsius or Fahrenheit below their zero points correspond to negative values, but in Kelvin, such values are physically meaningless. Attempting to convert a Celsius or Fahrenheit temperature below -273.15°C or -459.67°F will result in negative Kelvin, which is invalid.",
    },
    {
      question: "How precise are temperature conversions using this tool?",
      answer:
        "This tool provides temperature conversions with up to four decimal places, ensuring high precision suitable for most practical and scientific applications. However, the precision depends on the input value and the inherent rounding in floating-point arithmetic. For extremely sensitive measurements, specialized equipment and calibration may be necessary.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Value</Label>
          <Input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter number..."
            min={fromUnit === "K" ? "0" : undefined}
            step="any"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">To</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, conversion is reactive
          }}
          aria-label="Convert temperature"
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset input"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {val !== "" && !isNaN(parseFloat(val)) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              <p className="text-xs text-slate-500 mt-4 font-mono bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded">
                Factor: {results.formula}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Temperature: °C ↔ °F ↔ K
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Temperature is a fundamental physical quantity that measures the average kinetic energy of particles in a substance. The three most common temperature scales are Celsius (°C), Fahrenheit (°F), and Kelvin (K), each with different reference points and increments. Celsius and Fahrenheit are widely used in everyday life and weather forecasting, while Kelvin is the standard unit in scientific research due to its absolute zero reference.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Converting between these scales requires understanding their relationships: Celsius and Fahrenheit differ by both scale and offset, while Kelvin is directly related to Celsius by a fixed offset. Accurate conversion is crucial in fields ranging from meteorology to engineering and cooking, ensuring consistent communication and measurement. This tool helps you seamlessly convert temperature values among these three scales with precision.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert a temperature value, enter the numeric temperature in the input field, then select the unit you are converting from and the unit you want to convert to using the dropdown selectors. The conversion result will update automatically, showing the equivalent temperature in the target unit. Use the Reset button to clear the input and start a new conversion at any time.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Celsius to Fahrenheit
            </p>
            <p className="text-slate-500 text-sm">°F = (°C × 9/5) + 32</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Fahrenheit to Celsius
            </p>
            <p className="text-slate-500 text-sm">°C = (°F - 32) × 5/9</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Celsius to Kelvin
            </p>
            <p className="text-slate-500 text-sm">K = °C + 273.15</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Kelvin to Celsius
            </p>
            <p className="text-slate-500 text-sm">°C = K - 273.15</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Temperature: °C ↔ °F ↔ K"
      description="Convert temperature readings. Switch between Celsius (°C), Fahrenheit (°F), and Kelvin (K) for weather, science, and cooking applications."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units",
        variables: [
          {
            symbol: "Input",
            description: `Value in ${units.find((u) => u.value === fromUnit)?.label || fromUnit}`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${units.find((u) => u.value === toUnit)?.label || toUnit}`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 25 degrees Celsius to Fahrenheit to understand how the conversion works.",
        steps: [
          {
            label: "1",
            explanation:
              "Start with the Celsius value: 25 °C.",
          },
          {
            label: "2",
            explanation:
              "Apply the formula °F = (°C × 9/5) + 32: (25 × 9/5) + 32 = 45 + 32 = 77 °F.",
          },
          {
            label: "3",
            explanation:
              "The result is 77 °F, which is the equivalent temperature in Fahrenheit.",
          },
        ],
        result: "25 °C = 77 °F",
      }}
      relatedCalculators={[
        { title: "Frame Rate: fps ↔ Hz", url: "/conversion/frame-rate-fps-hz", icon: "🔄" },
        { title: "Length: m ↔ ft ↔ in", url: "/conversion/length-m-ft-in", icon: "📏" },
        { title: "BMI & BSA quick estimators", url: "/conversion/bmi-bsa-quick-estimators", icon: "⚖️" },
        { title: "Area: m² ↔ ft²", url: "/conversion/area-m2-ft2", icon: "🌡️" },
        { title: "Angle: deg ↔ rad", url: "/conversion/angle-deg-rad", icon: "📐" },
        { title: "Volume: L ↔ mL ↔ gal ↔ oz", url: "/conversion/volume-l-ml-gal-oz", icon: "⏱️" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Conversion" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "factors", label: "Common Factors" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}