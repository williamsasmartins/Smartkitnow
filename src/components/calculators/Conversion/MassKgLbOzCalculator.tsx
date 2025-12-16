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
  { value: "kg", label: "Kilogram (kg)" },
  { value: "lb", label: "Pound (lb)" },
  { value: "oz", label: "Ounce (oz)" },
];

// Conversion factors relative to kilograms
// 1 kg = 2.2046226218 lb
// 1 lb = 16 oz
// So base conversions will use kg as pivot
const toKgFactors: Record<string, number> = {
  kg: 1,
  lb: 1 / 2.2046226218,
  oz: 1 / (2.2046226218 * 16),
};
const fromKgFactors: Record<string, number> = {
  kg: 1,
  lb: 2.2046226218,
  oz: 2.2046226218 * 16,
};

export default function MassKgLbOzCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("kg");
  const [toUnit, setToUnit] = useState("lb");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a value...",
        formula: "Select units",
      };
    }
    // Convert input to kg first
    const valInKg = num * toKgFactors[fromUnit];
    // Convert from kg to target unit
    const result = valInKg * fromKgFactors[toUnit];

    // Build formula text showing factor from fromUnit to toUnit
    // Factor = how many toUnit in 1 fromUnit
    const factor = fromKgFactors[toUnit] * toKgFactors[fromUnit];
    const formulaText = `1 ${fromUnit} = ${factor.toFixed(6)} ${toUnit}`;

    return {
      value: result.toLocaleString(undefined, {
        maximumFractionDigits: 6,
        minimumFractionDigits: 0,
      }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between kilograms, pounds, and ounces?",
      answer:
        "Kilograms, pounds, and ounces are all units used to measure mass or weight, but they belong to different measurement systems. Kilograms are part of the metric system and are widely used internationally, while pounds and ounces are part of the imperial system, commonly used in the United States. Understanding these differences helps in converting values accurately between these units.",
    },
    {
      question: "How accurate are the conversion factors used in this tool?",
      answer:
        "The conversion factors used here are based on internationally recognized standards to ensure high precision. For example, 1 kilogram equals exactly 2.2046226218 pounds, and 1 pound equals exactly 16 ounces. This precision ensures that conversions performed by this tool are reliable for both everyday and professional use.",
    },
    {
      question: "Can I convert fractional values with this calculator?",
      answer:
        "Yes, this calculator supports fractional and decimal values, allowing you to convert precise measurements. You can enter any numeric value, including decimals, in the input field, and the tool will compute the equivalent mass in the selected unit. This flexibility is especially useful for scientific, culinary, or shipping calculations requiring accuracy.",
    },
    {
      question: "Why is it important to select both 'From' and 'To' units before converting?",
      answer:
        "Selecting both 'From' and 'To' units ensures that the calculator knows exactly which units you want to convert between, preventing any ambiguity. Without specifying these units, the tool cannot perform the correct mathematical conversion. This step guarantees that the output value corresponds precisely to your desired unit of measurement.",
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
            // No extra action needed, results update automatically
          }}
          aria-label="Convert mass units"
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
          Understanding Mass: kg ↔ lb ↔ oz
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Mass is a fundamental physical property that quantifies the amount of
          matter in an object. The kilogram (kg) is the base unit of mass in the
          International System of Units (SI), widely used around the world. In
          contrast, pounds (lb) and ounces (oz) are units from the imperial system,
          commonly used in the United States and some other countries.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Converting between these units requires precise factors to maintain
          accuracy, especially in scientific, commercial, and everyday contexts.
          This tool facilitates seamless conversion between kilograms, pounds,
          and ounces, ensuring you can work confidently with any unit of mass.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this converter, start by entering the numerical value of the mass
          you want to convert in the input field. Next, select the unit of the value
          you entered from the "From" dropdown, and then choose the unit you want to
          convert to from the "To" dropdown. Finally, click the "Convert" button to
          see the equivalent mass in the desired unit.
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
              Kilogram to Pound
            </p>
            <p className="text-slate-500 text-sm">1 kg = 2.2046226 lb</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Pound to Ounce
            </p>
            <p className="text-slate-500 text-sm">1 lb = 16 oz</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Kilogram to Ounce
            </p>
            <p className="text-slate-500 text-sm">1 kg = 35.273962 oz</p>
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
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units",
        variables: [
          {
            symbol: "Input",
            description: "Value in " + (fromUnit || "unit"),
          },
          {
            symbol: "Result",
            description: "Value converted to " + (toUnit || "unit"),
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 5 kilograms to pounds to understand how much 5 kg weighs in the imperial system.",
        steps: [
          {
            label: "1",
            explanation:
              "Start with the value in kilograms: 5 kg.",
          },
          {
            label: "2",
            explanation:
              "Use the conversion factor: 1 kg = 2.2046226 lb.",
          },
          {
            label: "3",
            explanation:
              "Multiply 5 by 2.2046226 to get the equivalent in pounds: 5 × 2.2046226 = 11.023113 lb.",
          },
        ],
        result: "Therefore, 5 kilograms is equal to approximately 11.023113 pounds.",
      }}
      relatedCalculators={[
        {
          title: "Time: ms ↔ s ↔ min ↔ hr",
          url: "/conversion/time-ms-s-min-hr",
          icon: "🔄",
        },
        {
          title: "Force: N ↔ lbf",
          url: "/conversion/force-n-lbf",
          icon: "📏",
        },
        {
          title: "Length: m ↔ ft ↔ in",
          url: "/conversion/length-m-ft-in",
          icon: "📏",
        },
        {
          title: "Temperature: °C ↔ °F ↔ K",
          url: "/conversion/temperature-c-f-k",
          icon: "🌡️",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
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
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}