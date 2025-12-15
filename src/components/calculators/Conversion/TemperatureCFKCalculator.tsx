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
  Info,
  Thermometer,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TemperatureCFKCalculator() {
  // 1. STATE (CONVERTER PATTERN)
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("C");
  const [toUnit, setToUnit] = useState("F");

  // 2. LOGIC ENGINE
  // Conversion formulas:
  // °C to °F: (°C × 9/5) + 32
  // °F to °C: (°F − 32) × 5/9
  // °C to K: °C + 273.15
  // K to °C: K − 273.15
  // °F to K: (°F − 32) × 5/9 + 273.15
  // K to °F: (K − 273.15) × 9/5 + 32

  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: 0,
        label: "Enter a value...",
        formula: "",
      };
    }

    let result = 0;
    let formulaText = "";

    if (fromUnit === toUnit) {
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else {
      switch (fromUnit + "->" + toUnit) {
        case "C->F":
          result = num * (9 / 5) + 32;
          formulaText = "°F = (°C × 9/5) + 32";
          break;
        case "F->C":
          result = (num - 32) * (5 / 9);
          formulaText = "°C = (°F − 32) × 5/9";
          break;
        case "C->K":
          result = num + 273.15;
          formulaText = "K = °C + 273.15";
          break;
        case "K->C":
          result = num - 273.15;
          formulaText = "°C = K − 273.15";
          break;
        case "F->K":
          result = (num - 32) * (5 / 9) + 273.15;
          formulaText = "K = (°F − 32) × 5/9 + 273.15";
          break;
        case "K->F":
          result = (num - 273.15) * (9 / 5) + 32;
          formulaText = "°F = (K − 273.15) × 9/5 + 32";
          break;
        default:
          result = 0;
          formulaText = "Conversion not supported";
      }
    }

    return {
      value: result.toLocaleString("en-US", { maximumFractionDigits: 4 }),
      label: `Result in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between Celsius, Fahrenheit, and Kelvin?",
      answer:
        "Celsius and Fahrenheit are temperature scales commonly used for weather and daily life, while Kelvin is the absolute temperature scale used in scientific contexts. Celsius and Kelvin have the same incremental size, but Kelvin starts at absolute zero.",
    },
    {
      question: "Why is Kelvin used in science instead of Celsius or Fahrenheit?",
      answer:
        "Kelvin is used because it starts at absolute zero, the theoretical point where particles have minimum thermal motion. This makes it ideal for scientific calculations involving thermodynamics and physical laws.",
    },
    {
      question: "Can I convert negative temperatures between these units?",
      answer:
        "Yes, negative temperatures are valid in Celsius and Fahrenheit scales. Kelvin temperatures cannot be negative since 0 K is absolute zero, the lowest possible temperature.",
    },
    {
      question: "How precise are these conversions?",
      answer:
        "The conversions use exact formulas with constants like 273.15 for Celsius-Kelvin conversion and fractional multipliers for Celsius-Fahrenheit. The results are precise up to four decimal places.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* INPUT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">
            Value
          </Label>
          <Input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter number..."
            aria-label="Input temperature value"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              From
            </Label>
            <Select value={fromUnit} onValueChange={setFromUnit} aria-label="Select from unit">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">Celsius (°C)</SelectItem>
                <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                <SelectItem value="K">Kelvin (K)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" aria-hidden="true" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              To
            </Label>
            <Select value={toUnit} onValueChange={setToUnit} aria-label="Select to unit">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="C">Celsius (°C)</SelectItem>
                <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                <SelectItem value="K">Kelvin (K)</SelectItem>
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
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Value
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              <p className="text-xs text-slate-500 mt-4 font-mono bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded">
                Formula: {results.formula}
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
          Understanding Temperature: °C ↔ °F ↔ K Conversion
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Temperature is a fundamental physical quantity that measures the
          average kinetic energy of particles in a substance. The three most
          commonly used temperature scales are Celsius (°C), Fahrenheit (°F),
          and Kelvin (K). Each scale has its own reference points and units,
          making conversions between them essential for science, weather
          reporting, and everyday use.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Celsius is widely used around the world and is based on the freezing
          and boiling points of water at standard atmospheric pressure. The
          Fahrenheit scale, primarily used in the United States, uses a
          different zero point and degree size. Kelvin, the SI unit for
          temperature, starts at absolute zero — the theoretical point where
          particles have minimum thermal motion — and is crucial in scientific
          research.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding how to convert between these scales accurately is
          important for interpreting temperature data correctly across
          different contexts. This converter uses precise mathematical formulas
          to ensure reliable and quick conversions between °C, °F, and K.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert a temperature value, enter the numeric temperature into the
          "Value" input field. Then select the unit you want to convert from
          using the "From" dropdown, and the unit you want to convert to using
          the "To" dropdown. The conversion result will be displayed instantly
          below, along with the formula used for the calculation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input field at any time by clicking the "Reset"
          button. This tool supports all bidirectional conversions between
          Celsius, Fahrenheit, and Kelvin, making it versatile for various
          needs such as cooking, weather forecasting, and scientific
          calculations.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
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

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 °C = 33.8 °F
            </p>
            <p className="text-slate-500 text-sm">
              To convert Celsius to Fahrenheit, multiply by 9/5 and add 32.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 °F = -17.2222 °C
            </p>
            <p className="text-slate-500 text-sm">
              To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              0 °C = 273.15 K
            </p>
            <p className="text-slate-500 text-sm">
              Kelvin is the Celsius temperature plus 273.15.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              0 K = -273.15 °C
            </p>
            <p className="text-slate-500 text-sm">
              Celsius is Kelvin temperature minus 273.15.
            </p>
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
      // DYNAMIC FORMULA
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units to see formula",
        variables: [{ symbol: "x", description: "Input Value" }],
      }}
      example={{
        title: "Example Conversion",
        scenario:
          "Convert 25 °C to Fahrenheit using the formula °F = (°C × 9/5) + 32.",
        steps: [
          {
            label: "1",
            explanation: "Multiply 25 by 9/5: 25 × 1.8 = 45",
          },
          {
            label: "2",
            explanation: "Add 32 to the result: 45 + 32 = 77",
          },
        ],
        result: "25 °C = 77 °F",
      }}
      relatedCalculators={[
        { title: "Power: W ↔ hp", url: "/conversion/power-w-hp", icon: "🔄" },
        { title: "Angle: deg ↔ rad", url: "/conversion/angle-deg-rad", icon: "📏" },
        { title: "Shoe Size: EU ↔ US ↔ UK", url: "/conversion/shoe-size-eu-us-uk", icon: "⚖️" },
        { title: "Torque: N·m ↔ lbf·ft", url: "/conversion/torque-nm-lbfft", icon: "🌡️" },
        { title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB", url: "/conversion/bytes-b-kb-mb-gb-tb", icon: "💾" },
        { title: "Paper Size: A-series ↔ US", url: "/conversion/paper-size-a-series-us", icon: "⏱️" },
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