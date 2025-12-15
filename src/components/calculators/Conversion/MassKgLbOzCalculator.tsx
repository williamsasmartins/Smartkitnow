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

export default function MassKgLbOzCalculator() {
  // 1. STATE (CONVERTER PATTERN)
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("kg");
  const [toUnit, setToUnit] = useState("lb");

  // Conversion factors relative to kilogram (base unit)
  // 1 kg = 2.20462 lb
  // 1 lb = 16 oz
  // 1 kg = 35.27396 oz
  // We'll convert input to kg first, then to target unit

  const toKgFactors: Record<string, number> = {
    kg: 1,
    lb: 1 / 2.20462, // lb to kg
    oz: 1 / 35.27396, // oz to kg
  };

  const fromKgFactors: Record<string, number> = {
    kg: 1,
    lb: 2.20462,
    oz: 35.27396,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) return { value: 0, label: "Enter a value...", formula: "" };
    if (num < 0) return { value: 0, label: "Enter a non-negative value", formula: "" };

    // Convert input value to kg
    const valueInKg = num * toKgFactors[fromUnit];

    // Convert kg to target unit
    const result = valueInKg * fromKgFactors[toUnit];

    // Prepare formula text dynamically
    // Show formula as: 1 fromUnit = X toUnit
    // Calculate factor for 1 unit fromUnit to toUnit
    const factor = toKgFactors[fromUnit] * fromKgFactors[toUnit];
    // factor = (1 fromUnit in kg) * (kg to toUnit)
    // But since toKgFactors[fromUnit] is fromUnit to kg, and fromKgFactors[toUnit] is kg to toUnit,
    // factor = 1 fromUnit in toUnit

    const formulaText = `1 ${fromUnit} = ${factor.toFixed(5)} ${toUnit}`;

    return {
      value: result.toLocaleString("en-US", { maximumFractionDigits: 5 }),
      label: `Result in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why do kilograms, pounds, and ounces have different conversion factors?",
      answer:
        "Kilograms, pounds, and ounces belong to different measurement systems—metric and imperial. Kilograms are metric units, while pounds and ounces are imperial units. Their conversion factors reflect the historical and practical differences in these systems, requiring precise formulas for accurate conversion.",
    },
    {
      question: "Can I convert negative mass values using this tool?",
      answer:
        "Mass is inherently a non-negative quantity, so negative values do not physically represent mass. This converter restricts input to non-negative numbers to ensure meaningful and accurate results.",
    },
    {
      question: "How precise are the conversion factors used here?",
      answer:
        "The conversion factors are precise to at least five decimal places, ensuring high accuracy suitable for scientific, fitness, and shipping calculations. For example, 1 kilogram equals exactly 2.20462 pounds.",
    },
    {
      question: "Why does the converter use kilograms as an intermediate unit?",
      answer:
        "Using kilograms as an intermediate unit simplifies the conversion logic. All input units are first converted to kilograms, then from kilograms to the target unit, ensuring consistent and accurate results across all unit pairs.",
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
            min="0"
            step="any"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter number..."
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
                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                <SelectItem value="lb">Pound (lb)</SelectItem>
                <SelectItem value="oz">Ounce (oz)</SelectItem>
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
                <SelectItem value="kg">Kilogram (kg)</SelectItem>
                <SelectItem value="lb">Pound (lb)</SelectItem>
                <SelectItem value="oz">Ounce (oz)</SelectItem>
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
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
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
          Understanding Mass: kg ↔ lb ↔ oz Conversion
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Mass is a fundamental physical property that quantifies the amount of matter in an object. The kilogram (kg) is the base unit of mass in the International System of Units (SI), widely used around the world. In contrast, pounds (lb) and ounces (oz) are units from the imperial system, commonly used in the United States and a few other countries. Converting between these units requires precise mathematical relationships to ensure accuracy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The conversion between kilograms, pounds, and ounces is not arbitrary but based on fixed ratios. For example, one kilogram is exactly equal to approximately 2.20462 pounds, and one pound contains 16 ounces. Understanding these relationships helps in various fields such as fitness, cooking, shipping, and science, where accurate mass measurement and conversion are essential.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This converter uses kilograms as an intermediate unit to simplify calculations and maintain precision. By converting any input mass to kilograms first, and then to the desired unit, the tool ensures consistent and reliable results across all supported units.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Converter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this mass conversion tool, start by entering the numerical value you wish to convert in the "Value" input field. Next, select the unit of the value you entered from the "From" dropdown menu. Then, choose the unit you want to convert to from the "To" dropdown menu. The converter supports kilograms (kg), pounds (lb), and ounces (oz).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          After entering your value and selecting the units, click the "Convert" button to see the converted result instantly displayed below. You can reset the input at any time using the "Reset" button. This tool is designed for ease of use, accuracy, and clarity, making it suitable for both casual and professional needs.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
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
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 kilogram (kg) = 2.20462 pounds (lb)</p>
            <p className="text-slate-500 text-sm">This factor converts mass from the metric system to the imperial system.</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 pound (lb) = 16 ounces (oz)</p>
            <p className="text-slate-500 text-sm">This factor breaks down pounds into smaller imperial units for finer measurement.</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 kilogram (kg) = 35.27396 ounces (oz)</p>
            <p className="text-slate-500 text-sm">This factor directly converts kilograms to ounces, useful for precise conversions.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mass: kg ↔ lb ↔ oz"
      description="Convert weight and mass units. Instantly calculate kilograms to pounds (kg to lbs), ounces to grams, and more for fitness or shipping."
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
        scenario: "Convert 5 kilograms to pounds.",
        steps: [
          { label: "1", explanation: "Identify the input value and units: 5 kg." },
          {
            label: "2",
            explanation:
              "Use the conversion factor: 1 kg = 2.20462 lb.",
          },
          {
            label: "3",
            explanation:
              "Multiply the input value by the factor: 5 × 2.20462 = 11.0231 lb.",
          },
        ],
        result: "5 kilograms equals approximately 11.0231 pounds.",
      }}
      relatedCalculators={[
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Shoe Size: EU ↔ US ↔ UK",
          url: "/conversion/shoe-size-eu-us-uk",
          icon: "📏",
        },
        {
          title: "Bits: b ↔ kb ↔ Mb ↔ Gb",
          url: "/conversion/bits-b-kb-mb-gb",
          icon: "💾",
        },
        {
          title: "Transfer Speed: Mbps ↔ MB/s",
          url: "/conversion/transfer-speed-mbps-mbs",
          icon: "🌡️",
        },
        {
          title: "Time: ms ↔ s ↔ min ↔ hr",
          url: "/conversion/time-ms-s-min-hr",
          icon: "📐",
        },
        {
          title: "Torque: N·m ↔ lbf·ft",
          url: "/conversion/torque-nm-lbfft",
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