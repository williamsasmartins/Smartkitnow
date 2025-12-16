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
  { label: "KiB (Kibibyte)", value: "KiB", factor: 1024 },
  { label: "MiB (Mebibyte)", value: "MiB", factor: 1024 ** 2 },
  { label: "GiB (Gibibyte)", value: "GiB", factor: 1024 ** 3 },
  { label: "TiB (Tebibyte)", value: "TiB", factor: 1024 ** 4 },
  { label: "KB (Kilobyte)", value: "KB", factor: 1000 },
  { label: "MB (Megabyte)", value: "MB", factor: 1000 ** 2 },
  { label: "GB (Gigabyte)", value: "GB", factor: 1000 ** 3 },
  { label: "TB (Terabyte)", value: "TB", factor: 1000 ** 4 },
];

export default function BinaryDecimalPrefixesCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("KiB");
  const [toUnit, setToUnit] = useState("KB");

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

    // Convert input value to bytes (base unit)
    const bytes = num * from.factor;

    // Convert bytes to target unit
    const result = bytes / to.factor;

    // Formula text: 1 fromUnit = X toUnit
    const factorValue = from.factor / to.factor;
    const formulaText = `1 ${fromUnit} = ${factorValue.toLocaleString(undefined, {
      maximumFractionDigits: 9,
    })} ${toUnit}`;

    return {
      value: result.toLocaleString(undefined, {
        maximumFractionDigits: 9,
      }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between binary and decimal prefixes?",
      answer:
        "Binary prefixes such as KiB, MiB, and GiB are based on powers of 2 (1024), commonly used in computing to represent memory sizes. Decimal prefixes like KB, MB, and GB are based on powers of 10 (1000), typically used in storage device marketing and data transfer rates. Understanding this difference helps avoid confusion when comparing storage capacities or data sizes.",
    },
    {
      question: "Why do some systems use KiB instead of KB?",
      answer:
        "KiB (kibibyte) is used to explicitly denote 1024 bytes, avoiding ambiguity with KB, which can mean either 1000 or 1024 bytes depending on context. Operating systems and software that require precision use binary prefixes like KiB to clearly communicate memory sizes. This standardization helps users and developers accurately interpret data sizes without misinterpretation.",
    },
    {
      question: "How accurate are conversions between KiB and KB?",
      answer:
        "Conversions between KiB and KB are mathematically precise because they are based on fixed factors: 1024 for KiB and 1000 for KB. However, the perceived size difference can cause confusion, especially when manufacturers use decimal prefixes for marketing. This tool ensures exact conversions by applying the correct factors and displaying results with high precision.",
    },
    {
      question: "Can I convert larger units like MiB or GB with this tool?",
      answer:
        "Yes, this converter supports multiple binary and decimal prefixes including KiB, MiB, GiB, TiB and their decimal counterparts KB, MB, GB, TB. You can select any combination from the dropdown selectors to convert between these units accurately. This flexibility allows you to handle a wide range of data sizes effortlessly.",
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
            // No special action needed, conversion updates automatically
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
          Understanding Binary ↔ Decimal prefixes (KiB ↔ KB)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Binary prefixes such as KiB (kibibyte) and MiB (mebibyte) are based on
          powers of 2, specifically 1024 bytes per KiB. Decimal prefixes like KB
          (kilobyte) and MB (megabyte) are based on powers of 10, with 1000 bytes
          per KB. This distinction is crucial in computing and data storage,
          where precise measurements affect performance and capacity understanding.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The International Electrotechnical Commission (IEC) standardized binary
          prefixes to avoid confusion with decimal prefixes used in the
          International System of Units (SI). While operating systems often use
          binary prefixes internally, storage manufacturers typically use decimal
          prefixes for marketing. This converter helps bridge the gap by allowing
          accurate conversions between these two systems.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the numeric value you want to convert in the "Value" input field.
          Then select the unit you are converting from in the "From" dropdown and
          the unit you want to convert to in the "To" dropdown. Click the
          "Convert" button to see the precise converted result displayed below,
          along with the conversion factor used.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can convert between binary prefixes like KiB, MiB, GiB, TiB and
          decimal prefixes like KB, MB, GB, TB seamlessly. Use the reset button to
          clear the input and start a new conversion. This tool ensures you always
          get accurate and clear results for your data size conversions.
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
              1 KiB = 1,024 Bytes
            </p>
            <p className="text-slate-500 text-sm">
              Binary prefix: 1 KiB equals 1,024 bytes, based on powers of 2.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 KB = 1,000 Bytes
            </p>
            <p className="text-slate-500 text-sm">
              Decimal prefix: 1 KB equals 1,000 bytes, based on powers of 10.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 MiB = 1,048,576 Bytes (1024 KiB)
            </p>
            <p className="text-slate-500 text-sm">
              Binary prefix: 1 MiB equals 1,048,576 bytes, or 1024 KiB.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 MB = 1,000,000 Bytes (1000 KB)
            </p>
            <p className="text-slate-500 text-sm">
              Decimal prefix: 1 MB equals 1,000,000 bytes, or 1000 KB.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Binary ↔ Decimal prefixes (KiB ↔ KB)"
      description="Understand storage definitions. Convert between binary prefixes (KiB, MiB - IEC) and decimal prefixes (KB, MB - SI)."
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
            description: `Value in ${fromUnit} (the unit you are converting from)`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${toUnit} (the unit you are converting to)`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 5 KiB (kibibytes) to KB (kilobytes) to understand the difference between binary and decimal prefixes.",
        steps: [
          {
            label: "1",
            explanation:
              "Recognize that 1 KiB = 1024 bytes and 1 KB = 1000 bytes.",
          },
          {
            label: "2",
            explanation:
              "Multiply 5 KiB by 1024 to get bytes: 5 × 1024 = 5120 bytes.",
          },
          {
            label: "3",
            explanation:
              "Divide bytes by 1000 to convert to KB: 5120 ÷ 1000 = 5.12 KB.",
          },
        ],
        result: "Therefore, 5 KiB equals 5.12 KB.",
      }}
      relatedCalculators={[
        {
          title: "Clock Time & Timezone Shift",
          url: "/conversion/clock-time-timezone-shift",
          icon: "🔄",
        },
        {
          title: "Density: g/mL ↔ kg/m³",
          url: "/conversion/density-g-per-ml-kg-per-m3",
          icon: "📏",
        },
        {
          title: "Mass: kg ↔ lb ↔ oz",
          url: "/conversion/mass-kg-lb-oz",
          icon: "⚖️",
        },
        {
          title: "Period ↔ Frequency",
          url: "/conversion/period-frequency",
          icon: "🌡️",
        },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
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