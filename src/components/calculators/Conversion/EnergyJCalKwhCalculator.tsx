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
  { label: "Joule (J)", value: "J" },
  { label: "Calorie (cal)", value: "cal" },
  { label: "Kilowatt-hour (kWh)", value: "kWh" },
];

// Conversion factors to Joules (J)
const toJouleFactors: Record<string, number> = {
  J: 1,
  cal: 4.184, // 1 cal = 4.184 J
  kWh: 3_600_000, // 1 kWh = 3.6 million J
};

export default function EnergyJCalKwhCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("J");
  const [toUnit, setToUnit] = useState("cal");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: "Select units and enter a value",
      };
    }
    if (!(fromUnit in toJouleFactors) || !(toUnit in toJouleFactors)) {
      return {
        value: "",
        label: "Select valid units",
        formula: "Select units",
      };
    }

    // Convert input value to Joules
    const valueInJoule = num * toJouleFactors[fromUnit];
    // Convert Joules to target unit
    const convertedValue = valueInJoule / toJouleFactors[toUnit];

    // Format result with up to 8 decimals, trimming trailing zeros
    const formattedValue = convertedValue.toLocaleString(undefined, {
      maximumFractionDigits: 8,
    });

    // Build formula text
    // Example: 1 cal = 4.184 J, so 1 cal = 4.184 / 3600000 kWh = 0.00000116222 kWh
    const factorFromTo =
      toJouleFactors[fromUnit] / toJouleFactors[toUnit];
    const formulaText = `1 ${fromUnit} = ${factorFromTo.toLocaleString(
      undefined,
      { maximumFractionDigits: 8 }
    )} ${toUnit}`;

    return {
      value: formattedValue,
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between Joules, calories, and kilowatt-hours?",
      answer:
        "Joules, calories, and kilowatt-hours are all units of energy but differ in scale and typical usage. Joules are the SI unit used broadly in physics and engineering, calories are often used in nutrition to measure food energy, and kilowatt-hours are commonly used to measure electrical energy consumption. Understanding these differences helps in selecting the appropriate unit for specific applications.",
    },
    {
      question: "How accurate are the conversions between these energy units?",
      answer:
        "The conversions between Joules, calories, and kilowatt-hours are based on fixed, internationally recognized constants, ensuring high precision. For example, 1 calorie is exactly 4.184 Joules, and 1 kilowatt-hour equals 3.6 million Joules. Therefore, the conversion tool provides precise and reliable results suitable for scientific and practical use.",
    },
    {
      question: "Can I convert fractional values or very large numbers using this tool?",
      answer:
        "Yes, this converter supports fractional and large numerical inputs, handling decimal values with up to eight decimal places for accuracy. It also formats large numbers with appropriate separators for readability. This flexibility makes it suitable for a wide range of energy conversion needs, from small laboratory measurements to large-scale electrical consumption.",
    },
    {
      question: "Why is it important to convert energy units correctly?",
      answer:
        "Correct energy unit conversion is crucial to ensure consistency and accuracy in scientific calculations, engineering designs, and everyday applications like nutrition and electricity billing. Misconversions can lead to errors in energy budgeting, cost estimations, and performance assessments. This tool helps prevent such mistakes by providing a reliable and user-friendly conversion interface.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
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
            min="0"
            step="any"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              From
            </Label>
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
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              To
            </Label>
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
            // No extra action needed, conversion is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {val !== "" && results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
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
          Understanding Energy: J ↔ cal ↔ kWh
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Energy is a fundamental physical quantity that can be expressed in
          various units depending on the context and scale of measurement. The
          Joule (J) is the standard SI unit of energy, widely used in physics
          and engineering. Calories (cal) are commonly used in nutrition to
          quantify the energy content of food, while kilowatt-hours (kWh) are
          typically used to measure electrical energy consumption.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Converting between these units requires understanding their precise
          relationships: 1 calorie equals exactly 4.184 Joules, and 1
          kilowatt-hour equals 3.6 million Joules. This converter facilitates
          accurate and quick transformations between these units, supporting
          applications from dietary calculations to electrical energy billing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By mastering these conversions, users can better interpret energy
          values across different domains, ensuring clarity and consistency in
          scientific, nutritional, and industrial contexts.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert energy values, enter the numerical amount you wish to
          convert in the "Value" input field. Then, select the unit of the input
          value from the "From" dropdown menu and the desired output unit from
          the "To" dropdown menu. The conversion result will be displayed
          instantly below, showing the equivalent energy value in the selected
          unit.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          You can reset the input field at any time using the "Reset" button to
          start a new conversion. The tool also displays the conversion factor
          used, helping you understand the relationship between the selected
          units. This intuitive interface ensures precise and efficient energy
          unit conversions for various practical needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are calculating nutritional energy, electrical usage, or
          scientific measurements, this converter provides a reliable and user-
          friendly solution to handle your energy unit transformations.
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
              Joules to Calories
            </p>
            <p className="text-slate-500 text-sm">1 cal = 4.184 J</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Joules to Kilowatt-hours
            </p>
            <p className="text-slate-500 text-sm">1 kWh = 3,600,000 J</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Calories to Kilowatt-hours
            </p>
            <p className="text-slate-500 text-sm">
              1 cal ≈ 0.00000116222 kWh (1 cal = 4.184 J ÷ 3,600,000 J)
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Energy: J ↔ cal ↔ kWh"
      description="Convert energy units. Switch between Joules (J), calories (cal), and kilowatt-hours (kWh) for nutrition and electrical calculations."
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
            description: "Value in " + fromUnit,
          },
          {
            symbol: "Result",
            description: "Value converted to " + toUnit,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 500 calories (cal) to kilowatt-hours (kWh) to understand energy equivalence in electrical terms.",
        steps: [
          {
            label: "1",
            explanation:
              "Multiply 500 cal by the conversion factor to Joules: 500 × 4.184 = 2092 Joules.",
          },
          {
            label: "2",
            explanation:
              "Convert Joules to kilowatt-hours by dividing by 3,600,000: 2092 ÷ 3,600,000 ≈ 0.000581 kWh.",
          },
          {
            label: "3",
            explanation:
              "Therefore, 500 calories is approximately 0.000581 kilowatt-hours of energy.",
          },
        ],
        result: "0.000581 kWh",
      }}
      relatedCalculators={[
        {
          title: "Frequency: Hz ↔ kHz ↔ MHz",
          url: "/conversion/frequency-hz-khz-mhz",
          icon: "🔄",
        },
        {
          title: "Frame Rate: fps ↔ Hz",
          url: "/conversion/frame-rate-fps-hz",
          icon: "📏",
        },
        {
          title: "Currency: FX quick convert",
          url: "/conversion/currency-fx-quick-convert",
          icon: "⚖️",
        },
        {
          title: "Clock Time & Timezone Shift",
          url: "/conversion/clock-time-timezone-shift",
          icon: "🌡️",
        },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "⏱️",
        },
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