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
  { label: "Teaspoon (tsp)", value: "tsp", toMl: 4.92892 },
  { label: "Tablespoon (tbsp)", value: "tbsp", toMl: 14.7868 },
  { label: "Cup (cup)", value: "cup", toMl: 236.588 },
  { label: "Milliliter (mL)", value: "ml", toMl: 1 },
];

export default function CookingTspTbspCupMlCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("tsp");
  const [toUnit, setToUnit] = useState("ml");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: 0,
        label: "Enter a value...",
        formula: "Select units",
      };
    }

    const from = units.find((u) => u.value === fromUnit);
    const to = units.find((u) => u.value === toUnit);
    if (!from || !to) {
      return {
        value: 0,
        label: "Select valid units",
        formula: "Select units",
      };
    }

    // Convert input value to mL first, then to target unit
    const valueInMl = num * from.toMl;
    const result = valueInMl / to.toMl;

    // Format result with up to 4 decimals, trimming trailing zeros
    const formattedResult = parseFloat(result.toFixed(4)).toLocaleString();

    // Formula text for display
    const formulaText = `1 ${from.label} = ${(from.toMl / to.toMl).toFixed(4)} ${to.label}`;

    return {
      value: formattedResult,
      label: `Value in ${to.label}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is it important to convert tsp, tbsp, and cups to milliliters?",
      answer:
        "Converting teaspoons, tablespoons, and cups to milliliters ensures precise measurement in cooking and baking, which is crucial for recipe accuracy. Since different countries use different measurement systems, this conversion helps maintain consistency regardless of the units used. Accurate conversions prevent errors that could affect the texture, taste, and outcome of dishes.",
    },
    {
      question: "Can I use this converter for both liquid and dry ingredients?",
      answer:
        "This converter is designed for volume measurements and works best with liquid ingredients or dry ingredients measured by volume. However, dry ingredients can have varying densities, so for precise baking, weight-based measurements might be more accurate. Always consider the ingredient type when converting volumes to ensure the best results.",
    },
    {
      question: "How precise are the conversion factors used in this tool?",
      answer:
        "The conversion factors used here are based on standardized US customary units and metric equivalents, accurate to at least four decimal places. These values are widely accepted in culinary and metrology standards, ensuring reliable conversions for everyday cooking and baking. For scientific or industrial purposes, more precise instruments and factors might be necessary.",
    },
    {
      question: "What should I do if my recipe uses different cup sizes?",
      answer:
        "Cup sizes can vary internationally, with US cups differing from metric or UK cups. This converter uses the US customary cup size (236.588 mL), which is most common in recipes from the United States. If your recipe specifies a different cup size, you should adjust the conversion factor accordingly or use a converter specific to that measurement system.",
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
          aria-label="Convert"
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset"
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
          Understanding Cooking: tsp/tbsp/cup ↔ mL
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In cooking, precise measurements are essential for achieving the desired
          taste and texture of dishes. Common volume units like teaspoons (tsp),
          tablespoons (tbsp), and cups are often used in recipes, but these can vary
          by region and ingredient. Converting these units to milliliters (mL) helps
          standardize measurements, ensuring consistency and accuracy in cooking.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This conversion is particularly useful when following recipes from different
          countries or when using measuring tools calibrated in metric units. By
          understanding the exact volume each unit represents, cooks can better
          control ingredient proportions and improve the overall quality of their
          culinary creations.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this converter, enter the numerical value of the ingredient you wish
          to convert in the "Value" field. Next, select the unit you are converting
          from in the "From" dropdown, and the unit you want to convert to in the
          "To" dropdown. The converted result will display automatically, showing the
          equivalent volume in the selected unit.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input at any time using the "Reset" button to start a new
          conversion. This tool supports conversions between teaspoons, tablespoons,
          cups, and milliliters, making it versatile for most cooking measurement
          needs. Always double-check your inputs for accuracy, especially when
          baking or following precise recipes.
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
              1 Teaspoon (tsp)
            </p>
            <p className="text-slate-500 text-sm">= 4.92892 milliliters (mL)</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Tablespoon (tbsp)
            </p>
            <p className="text-slate-500 text-sm">= 14.7868 milliliters (mL)</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Cup (US customary)
            </p>
            <p className="text-slate-500 text-sm">= 236.588 milliliters (mL)</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Milliliter (mL)
            </p>
            <p className="text-slate-500 text-sm">= 0.202884 teaspoons (tsp)</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cooking: tsp/tbsp/cup ↔ mL"
      description="Convert kitchen measurements. Transform teaspoons, tablespoons, and cups into milliliters (mL) for precise baking and cooking."
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
            description: "Value in " + units.find((u) => u.value === fromUnit)?.label,
          },
          {
            symbol: "Result",
            description: "Value converted to " + units.find((u) => u.value === toUnit)?.label,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 3 tablespoons (tbsp) to milliliters (mL) to measure a liquid ingredient accurately.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the conversion factor: 1 tbsp = 14.7868 mL.",
          },
          {
            label: "2",
            explanation:
              "Multiply the input value by the conversion factor: 3 tbsp × 14.7868 mL = 44.3604 mL.",
          },
          {
            label: "3",
            explanation:
              "The result is approximately 44.36 mL, which is the equivalent volume.",
          },
        ],
        result: "3 tbsp = 44.36 mL",
      }}
      relatedCalculators={[
        {
          title: "Energy: J ↔ cal ↔ kWh",
          url: "/conversion/energy-j-cal-kwh",
          icon: "🔄",
        },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
          icon: "⚖️",
        },
        {
          title: "Shoe Size: EU ↔ US ↔ UK",
          url: "/conversion/shoe-size-eu-us-uk",
          icon: "🌡️",
        },
        {
          title: "Fuel Economy: L/100km ↔ mpg",
          url: "/conversion/fuel-economy-l-per-100km-mpg",
          icon: "📐",
        },
        {
          title: "Transfer Speed: Mbps ↔ MB/s",
          url: "/conversion/transfer-speed-mbps-mbs",
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