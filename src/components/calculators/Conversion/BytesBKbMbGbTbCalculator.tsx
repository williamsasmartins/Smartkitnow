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
  { label: "Bytes (B)", value: "B", factor: 1 },
  { label: "Kilobytes (kB)", value: "kB", factor: 1e3 },
  { label: "Megabytes (MB)", value: "MB", factor: 1e6 },
  { label: "Gigabytes (GB)", value: "GB", factor: 1e9 },
  { label: "Terabytes (TB)", value: "TB", factor: 1e12 },
];

export default function BytesBKbMbGbTbCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("B");
  const [toUnit, setToUnit] = useState("kB");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: "Select units and enter a number",
      };
    }

    const from = units.find((u) => u.value === fromUnit);
    const to = units.find((u) => u.value === toUnit);
    if (!from || !to) {
      return {
        value: "",
        label: "Select valid units",
        formula: "Select units",
      };
    }

    // Conversion: Convert input to bytes, then to target unit
    const bytesValue = num * from.factor;
    const convertedValue = bytesValue / to.factor;

    // Format with max 6 decimals, trim trailing zeros
    const formattedValue = convertedValue
      .toLocaleString(undefined, {
        maximumFractionDigits: 6,
      })
      .replace(/\.?0+$/, "");

    // Formula text
    const formulaText = `1 ${fromUnit} = ${
      from.factor / to.factor
    } ${toUnit}`;

    return {
      value: formattedValue,
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between Bytes and Kilobytes?",
      answer:
        "Bytes (B) are the basic unit of digital information storage, representing a single character or byte of data. Kilobytes (kB) are larger units equal to 1,000 bytes, commonly used to measure small file sizes. Understanding this difference helps in accurately interpreting data sizes and storage capacities.",
    },
    {
      question: "Why do some systems use 1024 instead of 1000 for conversions?",
      answer:
        "Some systems use the binary standard where 1 Kilobyte equals 1024 bytes, based on powers of two, which aligns with computer architecture. However, the decimal standard uses 1,000 bytes per Kilobyte, which is more common in storage device marketing. This discrepancy can cause confusion, so it's important to know which standard is being used.",
    },
    {
      question: "Can I convert between Bytes and Terabytes using this tool?",
      answer:
        "Yes, this converter supports conversions between Bytes, Kilobytes, Megabytes, Gigabytes, and Terabytes seamlessly. You simply select the input and output units and enter the value to get an accurate conversion. This flexibility makes it easy to handle data sizes ranging from very small to extremely large.",
    },
    {
      question: "How precise are the conversion results?",
      answer:
        "The conversion results are calculated using decimal multiples (powers of 1000) for accuracy and consistency. Values are formatted to show up to six decimal places, ensuring precision without overwhelming detail. This balance provides reliable results suitable for most practical applications.",
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
            // No special action needed on convert, result updates automatically
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
          Understanding Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Bytes are the fundamental units of digital information, representing
          a single character or byte of data. As data sizes grow, larger units
          like Kilobytes (kB), Megabytes (MB), Gigabytes (GB), and Terabytes
          (TB) are used to conveniently express these quantities. Each unit is a
          multiple of 1,000 of the previous one, making conversions straightforward
          and essential for understanding storage and data transfer.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This decimal system (based on powers of 10) is widely used in storage
          devices and networking contexts, differing from the binary system
          sometimes used in operating systems. Knowing how to convert between
          these units helps in managing files, understanding device capacities,
          and optimizing data usage effectively.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert between bytes and larger units, enter the numeric value you
          want to convert in the input field. Then select the unit of the value
          you entered in the "From" dropdown and the unit you want to convert to
          in the "To" dropdown. The conversion result will display automatically,
          showing the equivalent value in the chosen output unit along with the
          conversion factor used.
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
              1 Kilobyte (kB) = 1,000 Bytes (B)
            </p>
            <p className="text-slate-500 text-sm">
              Kilobyte is 10³ bytes, used for small file sizes and memory.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Megabyte (MB) = 1,000 Kilobytes (kB)
            </p>
            <p className="text-slate-500 text-sm">
              Megabyte equals 10⁶ bytes, commonly used for images and documents.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Gigabyte (GB) = 1,000 Megabytes (MB)
            </p>
            <p className="text-slate-500 text-sm">
              Gigabyte is 10⁹ bytes, typical for videos and large software.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 Terabyte (TB) = 1,000 Gigabytes (GB)
            </p>
            <p className="text-slate-500 text-sm">
              Terabyte equals 10¹² bytes, used for large storage devices.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB"
      description="Convert digital storage sizes. Transform Bytes to Kilobytes, Megabytes (MB), Gigabytes (GB), and Terabytes (TB) for data management."
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
          "Convert 2048 Bytes (B) to Kilobytes (kB) to understand file size in a larger unit.",
        steps: [
          {
            label: "1",
            explanation:
              "Start with 2048 Bytes. Since 1 kB = 1000 Bytes, divide 2048 by 1000.",
          },
          {
            label: "2",
            explanation:
              "2048 ÷ 1000 = 2.048 kB, so 2048 Bytes equals 2.048 Kilobytes.",
          },
        ],
        result: "2.048 kB",
      }}
      relatedCalculators={[
        {
          title: "Currency: FX quick convert",
          url: "/conversion/currency-fx-quick-convert",
          icon: "🔄",
        },
        {
          title: "Energy: J ↔ cal ↔ kWh",
          url: "/conversion/energy-j-cal-kwh",
          icon: "📏",
        },
        {
          title: "Volume: L ↔ mL ↔ gal ↔ oz",
          url: "/conversion/volume-l-ml-gal-oz",
          icon: "⚖️",
        },
        {
          title: "Transfer Speed: Mbps ↔ MB/s",
          url: "/conversion/transfer-speed-mbps-mbs",
          icon: "🌡️",
        },
        {
          title: "Bits: b ↔ kb ↔ Mb ↔ Gb",
          url: "/conversion/bits-b-kb-mb-gb",
          icon: "💾",
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