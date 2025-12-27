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
  { label: "Meters (m)", value: "m" },
  { label: "Feet (ft)", value: "ft" },
  { label: "Inches (in)", value: "in" },
];

// Conversion factors to meters (base unit)
const toMeters = {
  m: 1,
  ft: 0.3048,
  in: 0.0254,
};

export default function LengthMFtInCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: `1 ${fromUnit} = ? ${toUnit}`,
      };
    }

    // Convert input value to meters first
    const valInMeters = num * toMeters[fromUnit];
    // Convert meters to target unit
    const convertedValue = valInMeters / toMeters[toUnit];

    // Build formula text
    // For clarity, show factor from fromUnit to toUnit
    const factor = toMeters[fromUnit] / toMeters[toUnit];
    const formulaText = `1 ${fromUnit} = ${factor.toFixed(6)} ${toUnit}`;

    return {
      value: convertedValue.toLocaleString(undefined, {
        maximumFractionDigits: 6,
      }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is it important to convert length units accurately?",
      answer:
        "Accurate length unit conversion is crucial in fields like engineering, construction, and science to ensure measurements are consistent and reliable. Incorrect conversions can lead to errors in design, manufacturing, or data analysis, potentially causing costly mistakes or safety issues. Therefore, using precise conversion tools helps maintain integrity and quality across various applications.",
    },
    {
      question: "How do meters, feet, and inches relate to each other?",
      answer:
        "Meters, feet, and inches are units of length used in different measurement systems: meters in the metric system, and feet and inches in the imperial system. One meter equals approximately 3.28084 feet, and one foot equals 12 inches. Understanding these relationships allows for seamless conversion between metric and imperial units.",
    },
    {
      question: "Can this converter handle decimal and fractional inputs?",
      answer:
        "Yes, this converter accepts decimal numbers as input, allowing you to convert precise measurements including fractions expressed in decimal form. However, it does not currently support fractional notation like '1 1/2 feet' directly. For fractional inputs, convert them to decimal equivalents before using the tool.",
    },
    {
      question: "What are some practical uses for converting between meters, feet, and inches?",
      answer:
        "Converting between meters, feet, and inches is essential in international trade, construction, and travel where different measurement systems are used. For example, architects may need to convert blueprints from metric to imperial units, or travelers might convert height or distance measurements. This tool facilitates these conversions quickly and accurately to avoid confusion or errors.",
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
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
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
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
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
      {results.value !== "" && (
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
          Understanding Length: m ↔ ft ↔ in
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Length is a fundamental physical quantity that measures the distance
          between two points. The metric system uses meters (m) as its base unit,
          while the imperial system commonly uses feet (ft) and inches (in). Being
          able to convert accurately between these units is essential for
          engineering, construction, and everyday measurements.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This converter allows you to seamlessly switch between meters, feet,
          and inches, ensuring precision and ease of use. Whether you are working
          on a technical project or simply need to understand measurements in
          different systems, this tool provides reliable results instantly.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the numerical value you wish to convert in the input field labeled
          "Value." Next, select the unit of the value you entered from the "From"
          dropdown menu, choosing between meters, feet, or inches. Then, select the
          unit you want to convert to in the "To" dropdown menu. The converted
          result will display instantly below, along with the conversion factor used.
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

      {/* 8. REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <li>
            <a href="https://www.nist.gov/search?s=Length%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Length Conversion - NIST
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Official guide and standards for Length Conversion from the National Institute of Standards and Technology.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Length%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Length Conversion - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Learn the math and science behind Length Conversion with free interactive lessons and videos from Khan Academy.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Length%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Length Conversion - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Length Conversion on Calculator.net.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Length%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Length Conversion - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed encyclopedia article covering the history, standards, and usage of Length Conversion.
            </p>
          </li>
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 meter (m)
            </p>
            <p className="text-slate-500 text-sm">
              = 3.28084 feet (ft) = 39.3701 inches (in)
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 foot (ft)
            </p>
            <p className="text-slate-500 text-sm">
              = 0.3048 meters (m) = 12 inches (in)
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 inch (in)
            </p>
            <p className="text-slate-500 text-sm">
              = 0.0254 meters (m) = 0.0833333 feet (ft)
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Length: m ↔ ft ↔ in"
      description="Convert length units instantly. Quickly transform meters to feet, inches to centimeters, and handle both metric and imperial measurements with precision."
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
            description: "Value in " + (fromUnit === "m" ? "meters (m)" : fromUnit === "ft" ? "feet (ft)" : "inches (in)"),
          },
          {
            symbol: "Result",
            description: "Value converted to " + (toUnit === "m" ? "meters (m)" : toUnit === "ft" ? "feet (ft)" : "inches (in)"),
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 2.5 meters to feet using the converter.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 2.5 in the Value input field.",
          },
          {
            label: "2",
            explanation:
              "Select 'Meters (m)' in the From dropdown.",
          },
          {
            label: "3",
            explanation:
              "Select 'Feet (ft)' in the To dropdown.",
          },
          {
            label: "4",
            explanation:
              "The converter displays the result: 8.2021 feet.",
          },
        ],
        result: "2.5 meters = 8.2021 feet",
      }}
      relatedCalculators={[
        {
          title: "Fuel Economy: L/100km ↔ mpg",
          url: "/conversion/fuel-economy-l-per-100km-mpg",
          icon: "🔄",
        },
        {
          title: "Frequency: Hz ↔ kHz ↔ MHz",
          url: "/conversion/frequency-hz-khz-mhz",
          icon: "📏",
        },
        {
          title: "Binary ↔ Decimal prefixes (KiB ↔ KB)",
          url: "/conversion/binary-decimal-prefixes",
          icon: "⚖️",
        },
        {
          title: "Currency: FX quick convert",
          url: "/conversion/currency-fx-quick-convert",
          icon: "🌡️",
        },
        {
          title: "Torque: N·m ↔ lbf·ft",
          url: "/conversion/torque-nm-lbfft",
          icon: "📐",
        },
        {
          title: "Period ↔ Frequency",
          url: "/conversion/period-frequency",
          icon: "⏱️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Conversion" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "factors", label: "Common Factors" },
        { id: "references", label: "References & Resources" },
]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}