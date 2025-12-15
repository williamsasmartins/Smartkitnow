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
  Ruler,
  Info,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LengthMFtInCalculator() {
  // 1. STATE (CONVERTER PATTERN)
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");

  // 2. LOGIC ENGINE
  // Conversion factors based on meters as base unit
  // 1 m = 3.280839895 ft
  // 1 ft = 12 in
  // We'll convert input to meters first, then to target unit

  const units = ["m", "ft", "in"];

  // Helper: convert any unit to meters
  function toMeters(value: number, unit: string): number {
    switch (unit) {
      case "m":
        return value;
      case "ft":
        return value / 3.280839895;
      case "in":
        return value / 39.37007874; // 1 in = 0.0254 m, so 1 m = 39.37007874 in
      default:
        return NaN;
    }
  }

  // Helper: convert meters to target unit
  function fromMeters(value: number, unit: string): number {
    switch (unit) {
      case "m":
        return value;
      case "ft":
        return value * 3.280839895;
      case "in":
        return value * 39.37007874;
      default:
        return NaN;
    }
  }

  // Generate formula text for display
  // We'll show the direct conversion factor from fromUnit to toUnit
  // factor = meters per fromUnit, meters per toUnit => factor = fromUnit to meters / toUnit to meters
  // Actually factor = how many toUnit in 1 fromUnit
  // factor = (meters in 1 fromUnit) / (meters in 1 toUnit)
  function getFactor(from: string, to: string): number | null {
    if (from === to) return 1;
    const metersPerFrom = toMeters(1, from);
    const metersPerTo = toMeters(1, to);
    if (isNaN(metersPerFrom) || isNaN(metersPerTo)) return null;
    return metersPerFrom / metersPerTo;
  }

  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: 0,
        label: "Enter a valid number...",
        formula: "",
      };
    }
    if (!units.includes(fromUnit) || !units.includes(toUnit)) {
      return {
        value: 0,
        label: "Select valid units...",
        formula: "",
      };
    }

    // Convert input to meters
    const meters = toMeters(num, fromUnit);
    // Convert meters to target unit
    const result = fromMeters(meters, toUnit);

    // Get factor for formula display
    const factor = getFactor(fromUnit, toUnit);

    // Format factor with 6 decimals max
    const factorText =
      factor === null
        ? ""
        : `1 ${fromUnit} = ${factor.toFixed(6)} ${toUnit}`;

    return {
      value: result.toLocaleString("en-US", { maximumFractionDigits: 6 }),
      label: `Result in ${toUnit}`,
      formula: factorText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is precise length conversion important?",
      answer:
        "Accurate length conversion ensures measurements are consistent across different unit systems, which is critical in engineering, construction, and science to avoid costly errors and maintain safety standards.",
    },
    {
      question: "How do meters, feet, and inches relate?",
      answer:
        "Meters are the base unit in the metric system, while feet and inches belong to the imperial system. One meter equals approximately 3.28084 feet or 39.3701 inches, making conversions essential for interoperability.",
    },
    {
      question: "Can I convert between any units here?",
      answer:
        "Yes, this tool allows you to convert any value between meters, feet, and inches bidirectionally, providing flexibility for various measurement needs.",
    },
    {
      question: "What is the formula used for conversion?",
      answer:
        "The conversion uses precise mathematical factors based on the exact length of each unit in meters, ensuring high accuracy in all conversions between meters, feet, and inches.",
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
            min="0"
            step="any"
            aria-label="Input value"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              From
            </Label>
            <Select value={fromUnit} onValueChange={setFromUnit} aria-label="From unit">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m">Meters (m)</SelectItem>
                <SelectItem value="ft">Feet (ft)</SelectItem>
                <SelectItem value="in">Inches (in)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" aria-hidden="true" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              To
            </Label>
            <Select value={toUnit} onValueChange={setToUnit} aria-label="To unit">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m">Meters (m)</SelectItem>
                <SelectItem value="ft">Feet (ft)</SelectItem>
                <SelectItem value="in">Inches (in)</SelectItem>
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
          aria-label="Convert length units"
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
      {results.value !== 0 && val.trim() !== "" && (
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
          Understanding Length: m ↔ ft ↔ in Conversion
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Length measurement is fundamental in science, engineering, and daily life.
          The metric system, with meters as its base unit, is widely used internationally,
          while the imperial system, including feet and inches, remains common in the United States and other countries.
          Converting accurately between these units is essential to ensure consistency and avoid errors.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          One meter equals approximately 3.28084 feet or 39.3701 inches.
          These conversions are based on exact definitions: one inch is defined as exactly 0.0254 meters.
          This precision allows for reliable transformations between metric and imperial units,
          which is critical in fields such as construction, manufacturing, and scientific research.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This converter provides a quick and precise way to switch between meters, feet, and inches.
          Whether you are measuring height, distance, or any length dimension,
          this tool helps you translate values seamlessly, supporting both educational and practical applications.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the numeric value you wish to convert in the "Value" input field.
          Then select the unit of the input value from the "From" dropdown menu.
          Next, choose the unit you want to convert to from the "To" dropdown menu.
          Click the "Convert" button to see the converted result displayed below.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input at any time using the "Reset" button.
          The conversion is based on precise mathematical formulas ensuring accuracy.
          This tool supports bidirectional conversions between meters, feet, and inches,
          making it versatile for various measurement needs.
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
              1 meter = 3.28084 feet
            </p>
            <p className="text-slate-500 text-sm">
              The meter is the base unit of length in the metric system, and one meter equals approximately 3.28084 feet in the imperial system.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 foot = 12 inches
            </p>
            <p className="text-slate-500 text-sm">
              The foot is subdivided into 12 inches, a standard unit in the imperial system commonly used for smaller length measurements.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 inch = 0.0254 meters
            </p>
            <p className="text-slate-500 text-sm">
              The inch is defined as exactly 0.0254 meters, providing a precise basis for conversions between metric and imperial units.
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
      // DYNAMIC FORMULA
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units to see formula",
        variables: [{ symbol: "x", description: "Input Value" }],
      }}
      example={{
        title: "Example Conversion",
        scenario:
          "Convert 2.5 meters to feet using this converter.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 2.5 in the Value field and select 'Meters (m)' as the From unit.",
          },
          {
            label: "2",
            explanation:
              "Select 'Feet (ft)' as the To unit and click Convert.",
          },
          {
            label: "3",
            explanation:
              "The result will display approximately 8.2021 feet, showing the precise conversion.",
          },
        ],
        result: "2.5 m = 8.2021 ft",
      }}
      relatedCalculators={[
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "📏",
        },
        {
          title: "Time: ms ↔ s ↔ min ↔ hr",
          url: "/conversion/time-ms-s-min-hr",
          icon: "⚖️",
        },
        {
          title: "Work & Potential Energy",
          url: "/conversion/work-potential-energy",
          icon: "🌡️",
        },
        {
          title: "Mass: kg ↔ lb ↔ oz",
          url: "/conversion/mass-kg-lb-oz",
          icon: "⚖️",
        },
        {
          title: "Pressure: Pa ↔ bar ↔ psi",
          url: "/conversion/pressure-pa-bar-psi",
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