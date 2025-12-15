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
  { label: "Liters (L)", value: "L" },
  { label: "Milliliters (mL)", value: "mL" },
  { label: "Gallons (gal)", value: "gal" },
  { label: "Fluid Ounces (oz)", value: "oz" },
];

// Conversion factors to liters (base unit)
const toLitersFactor: Record<string, number> = {
  L: 1,
  mL: 0.001,
  gal: 3.78541,
  oz: 0.0295735,
};

export default function VolumeLMlGalOzCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("L");
  const [toUnit, setToUnit] = useState("mL");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: "Select units",
      };
    }
    if (!(fromUnit in toLitersFactor) || !(toUnit in toLitersFactor)) {
      return {
        value: "",
        label: "Select valid units",
        formula: "Select units",
      };
    }

    // Convert input to liters first
    const valueInLiters = num * toLitersFactor[fromUnit];
    // Convert liters to target unit
    const result = valueInLiters / toLitersFactor[toUnit];

    // Formula text: 1 fromUnit = X toUnit
    const factor = toLitersFactor[fromUnit] / toLitersFactor[toUnit];
    const formulaText = `1 ${fromUnit} = ${factor.toFixed(6)} ${toUnit}`;

    return {
      value: result.toLocaleString(undefined, {
        maximumFractionDigits: 6,
      }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between liters and milliliters?",
      answer:
        "Liters and milliliters are both metric units used to measure volume, where one liter equals 1,000 milliliters. Liters are typically used for larger quantities of liquid, such as beverages or fuel, while milliliters are used for smaller amounts, like medicine doses or cooking ingredients. Understanding this relationship helps in converting between these units accurately.",
    },
    {
      question: "How accurate are the gallon and fluid ounce conversions?",
      answer:
        "The gallon and fluid ounce conversions used here are based on the US customary system, where one gallon equals 128 fluid ounces. These conversions are precise and widely accepted for everyday and scientific use. However, note that other gallon definitions exist internationally, so ensure you are using the US gallon standard for consistency.",
    },
    {
      question: "Can I convert between metric and imperial units using this tool?",
      answer:
        "Yes, this converter supports both metric units (liters and milliliters) and imperial units (gallons and fluid ounces). It accurately converts volumes between these systems using established conversion factors. This makes it useful for cooking, scientific calculations, and industrial applications where both unit systems are encountered.",
    },
    {
      question: "Why is it important to use precise volume conversions?",
      answer:
        "Precise volume conversions are crucial in many fields such as chemistry, cooking, and manufacturing to ensure correct proportions and outcomes. Inaccurate conversions can lead to errors in formulations, product quality, or safety. This tool helps maintain accuracy by using exact conversion factors and clear unit definitions.",
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
          aria-label="Convert volume units"
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
          Understanding Volume: L ↔ mL ↔ gal ↔ oz
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Volume is a fundamental physical quantity representing the amount of
          three-dimensional space occupied by a substance or object. Common units
          for liquid volume include liters (L) and milliliters (mL) in the metric
          system, and gallons (gal) and fluid ounces (oz) in the US customary
          system. Accurate conversion between these units is essential for
          applications ranging from cooking and chemistry to industrial processes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Liters and milliliters are metric units where 1 liter equals 1,000
          milliliters, making conversions straightforward within the metric
          system. Gallons and fluid ounces are imperial units primarily used in
          the United States, with 1 gallon equaling 128 fluid ounces. This tool
          bridges these systems, allowing seamless and precise volume conversions.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert a volume value, enter the numeric amount in the "Value" input
          field. Then select the unit you want to convert from in the "From" dropdown
          and the unit you want to convert to in the "To" dropdown. The converted
          result will display instantly below, along with the conversion factor used.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input at any time using the "Reset" button to start a
          new conversion. This tool supports liters, milliliters, gallons, and fluid
          ounces, making it versatile for many volume measurement needs. The
          conversion factor shown helps you understand the relationship between the
          selected units.
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
              1 Liter (L) = 1,000 Milliliters (mL)
            </p>
            <p className="text-slate-500 text-sm">
              The metric system uses liters and milliliters for volume, where 1 L
              equals 1,000 mL.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Gallon (gal) = 128 Fluid Ounces (oz)
            </p>
            <p className="text-slate-500 text-sm">
              The US customary system defines 1 gallon as 128 fluid ounces.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Gallon (gal) = 3.78541 Liters (L)
            </p>
            <p className="text-slate-500 text-sm">
              To convert gallons to liters, multiply by approximately 3.78541.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Fluid Ounce (oz) = 0.0295735 Liters (L)
            </p>
            <p className="text-slate-500 text-sm">
              One fluid ounce equals approximately 0.0295735 liters.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Volume: L ↔ mL ↔ gal ↔ oz"
      description="Convert liquid volume units easily. Switch between liters, milliliters, gallons, and fluid ounces for cooking, science, or industrial needs."
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
          "Convert 2.5 gallons to milliliters to measure a liquid ingredient precisely.",
        steps: [
          {
            label: "1",
            explanation:
              "Multiply 2.5 gallons by the conversion factor to liters: 2.5 × 3.78541 = 9.463525 liters.",
          },
          {
            label: "2",
            explanation:
              "Convert liters to milliliters by multiplying by 1,000: 9.463525 × 1000 = 9463.525 mL.",
          },
          {
            label: "3",
            explanation:
              "The result is approximately 9463.525 milliliters, which is the equivalent volume.",
          },
        ],
        result: "2.5 gal = 9463.525 mL",
      }}
      relatedCalculators={[
        {
          title: "Work & Potential Energy",
          url: "/conversion/work-potential-energy",
          icon: "🔄",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
          icon: "📏",
        },
        {
          title: "Frequency: Hz ↔ kHz ↔ MHz",
          url: "/conversion/frequency-hz-khz-mhz",
          icon: "⚖️",
        },
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "🌡️",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "📐",
        },
        {
          title: "Currency: FX quick convert",
          url: "/conversion/currency-fx-quick-convert",
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