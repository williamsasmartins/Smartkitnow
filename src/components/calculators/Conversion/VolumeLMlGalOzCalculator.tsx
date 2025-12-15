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

const units = {
  L: { label: "Liters (L)" },
  mL: { label: "Milliliters (mL)" },
  gal: { label: "Gallons (gal)" },
  oz: { label: "Fluid Ounces (oz)" },
};

// Base unit: Liter (L)
// Conversion factors to Liter:
const toLiterFactors: Record<string, number> = {
  L: 1,
  mL: 0.001,
  gal: 3.78541,
  oz: 0.0295735,
};

export default function VolumeLMlGalOzCalculator() {
  // 1. STATE (CONVERTER PATTERN)
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("L");
  const [toUnit, setToUnit] = useState("mL");

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) return { value: 0, label: "Enter a value...", formula: "" };
    if (!(fromUnit in toLiterFactors) || !(toUnit in toLiterFactors)) {
      return { value: 0, label: "Invalid units selected", formula: "" };
    }

    // Convert input value to liters
    const valueInLiters = num * toLiterFactors[fromUnit];
    // Convert liters to target unit
    const result = valueInLiters / toLiterFactors[toUnit];

    // Build formula string showing factor from fromUnit to toUnit
    // factor = (toLiterFactors[fromUnit]) / (toLiterFactors[toUnit])
    const factor = toLiterFactors[fromUnit] / toLiterFactors[toUnit];
    const formulaText = `1 ${fromUnit} = ${factor.toFixed(6)} ${toUnit}`;

    return {
      value: result.toLocaleString("en-US", { maximumFractionDigits: 6 }),
      label: `Result in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between liters and milliliters?",
      answer:
        "Liters and milliliters are both metric units of volume. One liter equals 1,000 milliliters, making milliliters useful for measuring smaller quantities of liquid.",
    },
    {
      question: "How accurate are these volume conversions?",
      answer:
        "The conversions use precise mathematical factors based on internationally recognized standards. Minor rounding may occur for display purposes, but accuracy is maintained up to six decimal places.",
    },
    {
      question: "Why are gallons and fluid ounces included?",
      answer:
        "Gallons and fluid ounces are common volume units in the imperial system, widely used in the US and other countries. Including them allows easy conversion between metric and imperial volumes.",
    },
    {
      question: "Can I convert volumes for cooking or scientific purposes?",
      answer:
        "Yes, this converter is designed for both everyday cooking measurements and scientific or industrial volume conversions, providing precise and reliable results.",
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
                {Object.entries(units).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
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
                {Object.entries(units).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
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
            // No special action needed, conversion is reactive
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
      {results.value !== 0 && val.trim() !== "" && (
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
          Understanding Volume: L ↔ mL ↔ gal ↔ oz Conversion
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Volume is a fundamental physical quantity that measures the amount of space an object or substance occupies. In everyday life and scientific contexts, volume is often measured in liters (L), milliliters (mL), gallons (gal), and fluid ounces (oz). These units belong to either the metric system (liters and milliliters) or the imperial/US customary system (gallons and fluid ounces).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding how to convert between these units is essential for cooking, laboratory work, industrial processes, and even daily activities like filling a gas tank or measuring beverages. Liters and milliliters are widely used internationally, while gallons and fluid ounces are common in the United States and some other countries.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This converter uses precise mathematical relationships based on standard definitions: 1 liter equals 1,000 milliliters, 1 gallon equals approximately 3.78541 liters, and 1 fluid ounce equals about 0.0295735 liters. By converting all units through liters as a base, the tool ensures accuracy and consistency in all conversions.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Converter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this volume converter, start by entering the numeric value you wish to convert in the "Value" input field. Then select the unit of the value you entered from the "From" dropdown menu. Next, select the unit you want to convert to from the "To" dropdown menu.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once you have entered the value and selected the units, click the "Convert" button to see the converted result displayed below. The conversion factor used will also be shown to help you understand the relationship between the units.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input at any time using the "Reset" button. This tool is designed to provide quick, accurate, and easy-to-understand volume conversions for a variety of practical uses.
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
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 L = 1,000 mL</p>
            <p className="text-slate-500 text-sm">One liter contains one thousand milliliters, making milliliters suitable for measuring smaller volumes.</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 gal = 3.78541 L</p>
            <p className="text-slate-500 text-sm">One US gallon equals approximately 3.78541 liters, used primarily in the United States and some other countries.</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 oz = 0.0295735 L</p>
            <p className="text-slate-500 text-sm">One US fluid ounce equals about 0.0295735 liters, commonly used for small liquid measurements.</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">1 gal = 128 oz</p>
            <p className="text-slate-500 text-sm">One gallon contains 128 fluid ounces, linking these two imperial units directly.</p>
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
      // DYNAMIC FORMULA
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units to see formula",
        variables: [{ symbol: "x", description: "Input Value" }],
      }}
      example={{
        title: "Example Conversion",
        scenario:
          "Convert 2.5 gallons to milliliters for a recipe requiring metric units.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the conversion factor: 1 gal = 3.78541 L, and 1 L = 1000 mL.",
          },
          {
            label: "2",
            explanation:
              "Convert gallons to liters: 2.5 gal × 3.78541 = 9.46353 L.",
          },
          {
            label: "3",
            explanation:
              "Convert liters to milliliters: 9.46353 L × 1000 = 9463.53 mL.",
          },
        ],
        result: "2.5 gallons equals approximately 9463.53 milliliters.",
      }}
      relatedCalculators={[
        { title: "Frequency: Hz ↔ kHz ↔ MHz", url: "/conversion/frequency-hz-khz-mhz", icon: "🔄" },
        { title: "Cooking: tsp/tbsp/cup ↔ mL", url: "/conversion/cooking-tsp-tbsp-cup-ml", icon: "📏" },
        { title: "Force: N ↔ lbf", url: "/conversion/force-n-lbf", icon: "⚖️" },
        { title: "Compression Ratio & Size", url: "/conversion/compression-ratio-size", icon: "🌡️" },
        { title: "Angle: deg ↔ rad", url: "/conversion/angle-deg-rad", icon: "📐" },
        { title: "Work & Potential Energy", url: "/conversion/work-potential-energy", icon: "⏱️" },
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