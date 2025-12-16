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
  { value: "W", label: "Watt (W)" },
  { value: "hp_mech", label: "Mechanical Horsepower (hp)" },
  { value: "hp_metric", label: "Metric Horsepower (hp)" },
];

const conversionFactors: Record<string, number> = {
  // Base unit: Watt (W)
  W: 1,
  hp_mech: 745.699872, // 1 mechanical hp = 745.699872 W
  hp_metric: 735.49875, // 1 metric hp = 735.49875 W
};

export default function PowerWHpCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("W");
  const [toUnit, setToUnit] = useState("hp_mech");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a value to convert",
        formula: "Select units to see conversion factor",
      };
    }
    if (!conversionFactors[fromUnit] || !conversionFactors[toUnit]) {
      return {
        value: "",
        label: "Select valid units",
        formula: "Invalid unit selection",
      };
    }

    // Convert input to Watts first
    const valInW = num * conversionFactors[fromUnit];

    // Convert Watts to target unit
    const result = valInW / conversionFactors[toUnit];

    // Format result with up to 6 decimals, trimming trailing zeros
    const formattedResult = result.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });

    // Formula text: 1 fromUnit = X toUnit
    // Calculate factor: how many toUnit in 1 fromUnit
    const factor = conversionFactors[fromUnit] / conversionFactors[toUnit];
    const formattedFactor = factor.toLocaleString(undefined, {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    });

    const formulaText = `1 ${units.find((u) => u.value === fromUnit)?.label} = ${formattedFactor} ${units.find((u) => u.value === toUnit)?.label}`;

    return {
      value: formattedResult,
      label: `Value in ${units.find((u) => u.value === toUnit)?.label}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between mechanical and metric horsepower?",
      answer:
        "Mechanical horsepower, often used in the United States, is defined as exactly 745.699872 watts, while metric horsepower, commonly used in Europe, is defined as exactly 735.49875 watts. The difference arises from historical measurement standards and regional preferences. Understanding which horsepower unit applies is crucial for accurate power conversions and comparisons.",
    },
    {
      question: "Why do I need to convert between Watts and horsepower?",
      answer:
        "Watts and horsepower are both units of power but are used in different contexts and regions. Watts are the SI unit of power and are widely used in scientific and engineering applications, whereas horsepower is traditionally used to describe engine power, especially in automotive and mechanical industries. Converting between these units allows for better understanding and communication of power ratings across different systems.",
    },
    {
      question: "Can this converter handle other types of horsepower units?",
      answer:
        "This converter currently supports mechanical and metric horsepower, which are the most commonly used types worldwide. Other horsepower variants, such as electrical or boiler horsepower, have different definitions and conversion factors. For those, specialized converters or additional formulas would be necessary to ensure precise conversions.",
    },
    {
      question: "How precise are the conversion factors used in this tool?",
      answer:
        "The conversion factors used here are based on internationally recognized standards with high precision, accurate to at least six decimal places. This ensures that conversions between Watts and horsepower are reliable for most engineering, scientific, and practical applications. However, for extremely sensitive measurements, consulting detailed metrology references is recommended.",
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
            min="0"
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
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">To</Label>
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
            // Just triggers re-render, conversion is automatic on input change
          }}
          aria-label="Convert power units"
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
      {results.value !== "" && (
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
          Understanding Power: W ↔ hp
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Power is the rate at which work is done or energy is transferred, and it is commonly measured in Watts (W) in the International System of Units (SI). Horsepower (hp) is a traditional unit of power that originated to compare the output of steam engines with the power of draft horses, and it remains widely used in automotive and mechanical engineering contexts. This converter bridges the gap between these units, allowing precise and instant conversions between Watts and the two most common types of horsepower: mechanical and metric.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Mechanical horsepower is defined as exactly 745.699872 Watts and is primarily used in the United States, while metric horsepower is defined as exactly 735.49875 Watts and is common in Europe and other regions. Understanding these distinctions is essential for engineers, mechanics, and enthusiasts who work with power ratings across different measurement systems. This tool ensures accurate conversions by using internationally recognized standards and precise conversion factors.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert power values, simply enter the numerical value you wish to convert in the input field. Then, select the unit of the value you entered from the "From" dropdown and the unit you want to convert to from the "To" dropdown. Click the "Convert" button to see the converted result instantly displayed below, along with the conversion factor used for transparency and verification.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Common Conversion Factors</h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Mechanical Horsepower to Watts
            </p>
            <p className="text-slate-500 text-sm">1 mechanical hp = 745.699872 W</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Metric Horsepower to Watts
            </p>
            <p className="text-slate-500 text-sm">1 metric hp = 735.49875 W</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Watts to Mechanical Horsepower
            </p>
            <p className="text-slate-500 text-sm">1 W = 0.001341022 hp (mechanical)</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Watts to Metric Horsepower
            </p>
            <p className="text-slate-500 text-sm">1 W = 0.001359621 hp (metric)</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Power: W ↔ hp"
      description="Convert power units instantly. Calculate Watts (W) to mechanical or metric Horsepower (hp) for engines and motors."
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
            description: "Value in " + (units.find((u) => u.value === fromUnit)?.label || fromUnit),
          },
          {
            symbol: "Result",
            description: "Value converted to " + (units.find((u) => u.value === toUnit)?.label || toUnit),
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 1000 Watts to mechanical horsepower to understand engine power equivalence.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the input value and units: 1000 Watts (W).",
          },
          {
            label: "2",
            explanation:
              "Use the conversion factor: 1 mechanical hp = 745.699872 W.",
          },
          {
            label: "3",
            explanation:
              "Divide the input by the factor: 1000 W ÷ 745.699872 W/hp ≈ 1.341 hp (mechanical).",
          },
        ],
        result: "1000 Watts is approximately 1.341 mechanical horsepower.",
      }}
      relatedCalculators={[
        {
          title: "Temperature: °C ↔ °F ↔ K",
          url: "/conversion/temperature-c-f-k",
          icon: "🌡️",
        },
        {
          title: "Currency: FX quick convert",
          url: "/conversion/currency-fx-quick-convert",
          icon: "📏",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
          icon: "⚖️",
        },
        {
          title: "Mass: kg ↔ lb ↔ oz",
          url: "/conversion/mass-kg-lb-oz",
          icon: "⚖️",
        },
        {
          title: "Frame Rate: fps ↔ Hz",
          url: "/conversion/frame-rate-fps-hz",
          icon: "📐",
        },
        {
          title: "Cooking: tsp/tbsp/cup ↔ mL",
          url: "/conversion/cooking-tsp-tbsp-cup-ml",
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