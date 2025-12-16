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
  { label: "Pascal (Pa)", value: "Pa" },
  { label: "Bar", value: "bar" },
  { label: "Pounds per square inch (psi)", value: "psi" },
];

// Conversion factors to Pascal (Pa)
const toPaFactors: Record<string, number> = {
  Pa: 1,
  bar: 100000,
  psi: 6894.76,
};

// Conversion factors from Pascal (Pa)
const fromPaFactors: Record<string, number> = {
  Pa: 1,
  bar: 1 / 100000,
  psi: 1 / 6894.76,
};

export default function PressurePaBarPsiCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("Pa");
  const [toUnit, setToUnit] = useState("bar");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: "Select units to see conversion factor",
      };
    }
    // Convert input value to Pascal
    const valueInPa = num * toPaFactors[fromUnit];
    // Convert Pascal to target unit
    const resultValue = valueInPa * fromPaFactors[toUnit];

    // Format result with up to 6 decimals, trimming trailing zeros
    const formattedResult = resultValue.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });

    // Build formula text for display
    // Show factor from fromUnit to toUnit
    // factor = how many toUnit in 1 fromUnit
    const factor =
      toPaFactors[fromUnit] * fromPaFactors[toUnit]; // unitless factor
    const factorFormatted = factor.toLocaleString(undefined, {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    });

    const formulaText = `1 ${fromUnit} = ${factorFormatted} ${toUnit}`;

    return {
      value: formattedResult,
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between Pascal, Bar, and PSI?",
      answer:
        "Pascal (Pa), Bar, and PSI are all units used to measure pressure, but they differ in scale and usage. Pascal is the SI unit and is widely used in scientific contexts, representing force per unit area in newtons per square meter. Bar and PSI are more common in industrial and everyday applications, with Bar being metric-based and PSI used primarily in the United States.",
    },
    {
      question: "How accurate are the conversions between these pressure units?",
      answer:
        "The conversions provided by this tool are precise and based on internationally accepted standards for unit equivalences. Minor rounding may occur when displaying results, but the underlying calculations maintain high accuracy suitable for engineering and scientific purposes. Always consider significant figures relevant to your application when interpreting results.",
    },
    {
      question: "Can I convert negative pressure values using this calculator?",
      answer:
        "Yes, this calculator supports negative pressure values, which can represent gauge pressures below atmospheric pressure or vacuum conditions. However, ensure that the context of your measurement allows for negative values, as absolute pressure cannot be negative. The tool will convert any numeric input consistently across units.",
    },
    {
      question: "Why is it important to convert pressure units correctly?",
      answer:
        "Correct pressure unit conversion is critical to ensure safety, accuracy, and consistency in engineering, scientific research, and industrial processes. Using incorrect units or conversion factors can lead to misinterpretation of data, equipment malfunction, or hazardous situations. This tool helps prevent such errors by providing reliable and easy-to-use conversions.",
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
            step="any"
            inputMode="decimal"
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
            // No special action needed, conversion is live
          }}
          aria-label="Convert pressure units"
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
      {val.trim() !== "" && results.value !== "" && (
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
          Understanding Pressure: Pa ↔ bar ↔ psi
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Pressure is a fundamental physical quantity that describes the force
          exerted per unit area. The Pascal (Pa) is the SI unit of pressure,
          defined as one newton per square meter. Bar and pounds per square inch
          (psi) are commonly used units in various industries, with bar being
          metric-based and psi primarily used in the United States.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate conversion between these units is essential for engineering,
          scientific research, and practical applications such as tire
          inflation and hydraulic systems. This converter allows seamless
          transformation between Pascal, bar, and psi, ensuring precision and
          ease of use. Understanding these units and their relationships helps
          in interpreting pressure measurements correctly.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the numerical value of the pressure you want to convert in the
          input field. Then, select the unit of the input value from the "From"
          dropdown menu and choose the desired output unit from the "To"
          dropdown menu. The converted result will be displayed instantly below,
          along with the conversion factor used for transparency.
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
              1 Pascal (Pa)
            </p>
            <p className="text-slate-500 text-sm">
              = 0.00001 bar = 0.000145038 psi
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Bar
            </p>
            <p className="text-slate-500 text-sm">
              = 100,000 Pascals (Pa) = 14.5038 psi
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 PSI (pound per square inch)
            </p>
            <p className="text-slate-500 text-sm">
              = 6,894.76 Pascals (Pa) = 0.0689476 bar
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pressure: Pa ↔ bar ↔ psi"
      description="Convert pressure units for tires and hydraulics. Transform Pascals (Pa), Bar, and PSI (pounds per square inch) accurately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units to see formula",
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
          "Convert 500,000 Pascals (Pa) to pounds per square inch (psi).",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the input value and units: 500,000 Pa.",
          },
          {
            label: "2",
            explanation:
              "Use the conversion factor: 1 Pa = 0.000145038 psi.",
          },
          {
            label: "3",
            explanation:
              "Multiply the input by the factor: 500,000 × 0.000145038 = 72.519 psi.",
          },
        ],
        result: "500,000 Pa equals approximately 72.519 psi.",
      }}
      relatedCalculators={[
        {
          title: "Work & Potential Energy",
          url: "/conversion/work-potential-energy",
          icon: "🔄",
        },
        {
          title: "Paper Size: A-series ↔ US",
          url: "/conversion/paper-size-a-series-us",
          icon: "📏",
        },
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "⚖️",
        },
        {
          title: "Density: g/mL ↔ kg/m³",
          url: "/conversion/density-g-per-ml-kg-per-m3",
          icon: "🌡️",
        },
        {
          title: "Clock Time & Timezone Shift",
          url: "/conversion/clock-time-timezone-shift",
          icon: "📐",
        },
        {
          title: "Area: m² ↔ ft²",
          url: "/conversion/area-m2-ft2",
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