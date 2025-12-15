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
  Scale,
  Ruler,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AreaM2Ft2Calculator() {
  // 1. STATE (CONVERTER PATTERN)
  // Use fromUnit and toUnit states instead of global unit state
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("m²");
  const [toUnit, setToUnit] = useState("ft²");

  // 2. LOGIC ENGINE
  // Conversion factors between m² and ft²
  // 1 m² = 10.76391041671 ft² (precise)
  // 1 ft² = 0.09290304 m² (precise)
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: 0,
        label: "Enter a valid number...",
        formula: "",
      };
    }

    let result = 0;
    let formulaText = "";

    if (fromUnit === toUnit) {
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else if (fromUnit === "m²" && toUnit === "ft²") {
      const factor = 10.76391041671;
      result = num * factor;
      formulaText = `1 m² = ${factor.toFixed(8)} ft²`;
    } else if (fromUnit === "ft²" && toUnit === "m²") {
      const factor = 0.09290304;
      result = num * factor;
      formulaText = `1 ft² = ${factor.toFixed(8)} m²`;
    } else {
      // fallback (should not happen)
      result = 0;
      formulaText = "";
    }

    return {
      value: result.toLocaleString("en-US", { maximumFractionDigits: 6 }),
      label: `Result in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is the conversion factor between m² and ft² not a simple number?",
      answer:
        "The conversion factor between square meters and square feet is derived from the linear conversion between meters and feet. Since area units are squared, the factor is the square of the linear conversion factor, resulting in a non-integer value.",
    },
    {
      question: "Can I convert between other area units using this tool?",
      answer:
        "This converter specifically handles square meters and square feet. For other area units, please use dedicated converters or tools designed for those units to ensure accuracy.",
    },
    {
      question: "How precise is this conversion?",
      answer:
        "The conversion factors used are precise up to at least eight decimal places, ensuring high accuracy suitable for most real estate, engineering, and scientific applications.",
    },
    {
      question: "Why do I need to select both 'From' and 'To' units if only m² and ft² are available?",
      answer:
        "Allowing selection of both units provides flexibility to convert in either direction (m² to ft² or ft² to m²) and helps users understand the relationship between the two units clearly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* INPUT SECTION */}
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
            aria-label="Input value for conversion"
          />
        </div>

        {/* UNIT SELECTORS */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit} aria-label="Select from unit">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m²">Square Meter (m²)</SelectItem>
                <SelectItem value="ft²">Square Foot (ft²)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" aria-hidden="true" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">To</Label>
            <Select value={toUnit} onValueChange={setToUnit} aria-label="Select to unit">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m²">Square Meter (m²)</SelectItem>
                <SelectItem value="ft²">Square Foot (ft²)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, conversion happens automatically on input change
            // But we keep button for UX consistency
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Convert units"
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
      {results.value !== 0 && val !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Value
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
          Understanding Area: m² ↔ ft² Conversion
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Area is a two-dimensional measurement that represents the size of a surface. Square meters (m²) and square feet (ft²) are two commonly used units for measuring area, especially in real estate, construction, and land surveying. Converting between these units accurately is essential for comparing property sizes, planning layouts, and ensuring compliance with regulations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The conversion between square meters and square feet is based on the linear conversion between meters and feet. Since area units are squared, the conversion factor is the square of the linear conversion factor. Specifically, 1 meter equals approximately 3.28084 feet, so 1 m² equals about 10.76391 ft².
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding this relationship helps users appreciate why the conversion factor is not a simple integer and highlights the importance of precision in measurements. Whether you are a homeowner, architect, or engineer, knowing how to convert between these units accurately ensures better communication and decision-making.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this converter, simply enter the numeric value of the area you want to convert in the "Value" input field. Then, select the unit you are converting from in the "From" dropdown and the unit you want to convert to in the "To" dropdown. The converter supports both directions: square meters to square feet and square feet to square meters.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          After entering the value and selecting units, click the "Convert" button to see the converted result displayed below. You can reset the input at any time by clicking the "Reset" button. This tool is designed to provide quick, accurate conversions with clear explanations of the conversion factors used.
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
              1 m² = 10.76391042 ft²
            </p>
            <p className="text-slate-500 text-sm">
              One square meter equals approximately 10.7639 square feet, derived by squaring the linear conversion factor of 1 meter = 3.28084 feet.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 ft² = 0.09290304 m²
            </p>
            <p className="text-slate-500 text-sm">
              One square foot equals approximately 0.0929 square meters, the inverse of the square meter to square feet conversion factor.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Area: m² ↔ ft²"
      description="Calculate area conversions for real estate and land. Convert square meters to square feet (m² to sq ft) and other area units accurately."
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
          "Convert 50 square meters to square feet to understand the size in imperial units.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the conversion factor: 1 m² = 10.76391042 ft².",
          },
          {
            label: "2",
            explanation:
              "Multiply the input value by the factor: 50 × 10.76391042 = 538.195521 ft².",
          },
          {
            label: "3",
            explanation:
              "The result shows that 50 m² equals approximately 538.20 ft².",
          },
        ],
        result: "50 m² = 538.1955 ft²",
      }}
      relatedCalculators={[
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "🔄",
        },
        {
          title: "Paper Size: A-series ↔ US",
          url: "/conversion/paper-size-a-series-us",
          icon: "📏",
        },
        {
          title: "Angle: deg ↔ rad",
          url: "/conversion/angle-deg-rad",
          icon: "⚖️",
        },
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "🌡️",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
          icon: "📐",
        },
        {
          title: "Time: ms ↔ s ↔ min ↔ hr",
          url: "/conversion/time-ms-s-min-hr",
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