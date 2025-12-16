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
  { value: "N", label: "Newton (N)" },
  { value: "lbf", label: "Pound-force (lbf)" },
];

// Conversion factors
// 1 N = 0.224808943 lbf
// 1 lbf = 4.448221615 N

export default function ForceNLbfCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("N");
  const [toUnit, setToUnit] = useState("lbf");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: "Select units and enter a numeric value",
      };
    }

    let result = 0;
    let formulaText = "";

    if (fromUnit === toUnit) {
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else if (fromUnit === "N" && toUnit === "lbf") {
      result = num * 0.224808943;
      formulaText = `1 N = 0.224808943 lbf`;
    } else if (fromUnit === "lbf" && toUnit === "N") {
      result = num * 4.448221615;
      formulaText = `1 lbf = 4.448221615 N`;
    } else {
      // fallback (should not happen)
      result = 0;
      formulaText = "Conversion not supported";
    }

    return {
      value: result.toLocaleString(undefined, {
        maximumFractionDigits: 8,
      }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between Newton and pound-force?",
      answer:
        "Newton (N) is the SI unit of force defined as the force required to accelerate a one-kilogram mass by one meter per second squared. Pound-force (lbf) is a unit of force commonly used in the United States, defined as the force exerted by gravity on a one-pound mass. Understanding these units is essential for converting forces accurately between metric and imperial systems.",
    },
    {
      question: "Why is precise force conversion important in engineering?",
      answer:
        "Accurate force conversion ensures that calculations and designs meet safety and performance standards, especially when components or systems use different unit systems. Misconversions can lead to structural failures, inefficient designs, or costly errors. Therefore, engineers must use precise tools to convert forces reliably between Newtons and pound-force.",
    },
    {
      question: "Can I convert other force units using this tool?",
      answer:
        "This specific converter is designed exclusively for Newtons and pound-force units to maintain precision and clarity. For other force units like dynes or kilonewtons, specialized converters or additional tools are recommended. Expanding unit options requires careful consideration of conversion factors and unit definitions.",
    },
    {
      question: "How do I use this converter effectively?",
      answer:
        "Enter the numeric value of the force you want to convert in the input field, then select the unit you are converting from and the unit you want to convert to using the dropdown selectors. Click the 'Convert' button to see the converted result displayed clearly below. You can reset the input anytime using the 'Reset' button to start a new conversion.",
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
          aria-label="Convert force units"
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
          Understanding Force: N ↔ lbf
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Force is a fundamental physical quantity that describes the interaction
          that causes an object to accelerate. The Newton (N) is the SI unit of
          force, defined as the force needed to accelerate a one-kilogram mass by
          one meter per second squared. Pound-force (lbf) is an imperial unit of
          force commonly used in the United States, representing the force exerted
          by gravity on a one-pound mass.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Converting between Newtons and pound-force is essential in engineering,
          physics, and various applied sciences where both metric and imperial
          units are used. This conversion ensures consistency and accuracy in
          calculations involving forces, such as structural analysis, mechanical
          design, and material testing. Understanding the relationship between
          these units helps bridge different measurement systems effectively.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this force conversion tool, start by entering the numeric value of
          the force you want to convert in the input field. Next, select the unit
          you are converting from (either Newton or pound-force) and the unit you
          want to convert to using the dropdown selectors. Finally, click the
          "Convert" button to see the converted value displayed clearly below.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          If you need to perform another conversion, simply reset the input using
          the "Reset" button and enter a new value. This tool provides precise and
          reliable conversions to support your engineering, physics, or academic
          needs. The conversion factors are based on internationally recognized
          standards to ensure accuracy.
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
              Newton to Pound-force
            </p>
            <p className="text-slate-500 text-sm">
              1 N = 0.224808943 lbf
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Pound-force to Newton
            </p>
            <p className="text-slate-500 text-sm">
              1 lbf = 4.448221615 N
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Force: N ↔ lbf"
      description="Convert force units accurately. Transform Newtons (N) to pound-force (lbf) for engineering and mechanical physics problems."
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
            description: `Value in ${fromUnit === "N" ? "Newtons (N)" : "Pound-force (lbf)"}`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${toUnit === "N" ? "Newtons (N)" : "Pound-force (lbf)"}`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 10 Newtons (N) to pound-force (lbf) using the conversion factor.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the conversion factor: 1 N = 0.224808943 lbf.",
          },
          {
            label: "2",
            explanation:
              "Multiply the input value by the conversion factor: 10 N × 0.224808943 = 2.24808943 lbf.",
          },
          {
            label: "3",
            explanation:
              "The result is approximately 2.2481 lbf, which is the equivalent force.",
          },
        ],
        result: "10 N = 2.2481 lbf",
      }}
      relatedCalculators={[
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "📏",
        },
        {
          title: "Currency: FX quick convert",
          url: "/conversion/currency-fx-quick-convert",
          icon: "⚖️",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "🌡️",
        },
        {
          title: "Density: g/mL ↔ kg/m³",
          url: "/conversion/density-g-per-ml-kg-per-m3",
          icon: "📐",
        },
        {
          title: "Fuel Economy: L/100km ↔ mpg",
          url: "/conversion/fuel-economy-l-per-100km-mpg",
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