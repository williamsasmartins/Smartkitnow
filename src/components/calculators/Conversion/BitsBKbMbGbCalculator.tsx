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
  { label: "bits (b)", value: "b", factor: 1 },
  { label: "kilobits (kb)", value: "kb", factor: 1e3 },
  { label: "megabits (Mb)", value: "Mb", factor: 1e6 },
  { label: "gigabits (Gb)", value: "Gb", factor: 1e9 },
];

export default function BitsBKbMbGbCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("b");
  const [toUnit, setToUnit] = useState("kb");

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
    if (fromUnit === toUnit) {
      return {
        value: num.toLocaleString(undefined, { maximumFractionDigits: 9 }),
        label: `Result in ${toUnit}`,
        formula: `1 ${fromUnit} = 1 ${toUnit}`,
      };
    }

    const fromFactor = units.find((u) => u.value === fromUnit)?.factor || 1;
    const toFactor = units.find((u) => u.value === toUnit)?.factor || 1;

    // Convert input to bits, then to target unit
    const resultNum = (num * fromFactor) / toFactor;

    // Format result with up to 9 decimals, trimming trailing zeros
    const formattedResult = parseFloat(resultNum.toFixed(9)).toLocaleString();

    // Formula text
    const formulaText = `1 ${fromUnit} = ${fromFactor / toFactor} ${toUnit}`;

    return {
      value: formattedResult,
      label: `Result in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between bits and bytes?",
      answer:
        "Bits are the smallest unit of digital data, representing a single binary value of 0 or 1. Bytes consist of 8 bits and are commonly used to measure data storage size. This converter focuses exclusively on bits and their multiples, not bytes.",
    },
    {
      question: "Why do kilobits use 1000 instead of 1024?",
      answer:
        "In networking and data transmission, the decimal system is used, where kilo means 1000, mega means 1,000,000, and giga means 1,000,000,000. This differs from some computer storage contexts where binary prefixes use 1024. This tool uses decimal prefixes to align with standard network speed units.",
    },
    {
      question: "Can I convert from bits to gigabits directly?",
      answer:
        "Yes, you can convert directly between any of the supported units including bits, kilobits, megabits, and gigabits. The converter automatically applies the correct conversion factor based on the selected units. This ensures precise and immediate results without intermediate steps.",
    },
    {
      question: "How accurate are the conversion results?",
      answer:
        "The conversion results are calculated using exact decimal factors (powers of 10) for bits and their multiples. Results are formatted to show up to 9 decimal places to maintain precision while avoiding unnecessary trailing zeros. This provides a reliable and clear conversion for all typical use cases.",
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
            // No special action needed, conversion is live
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
      {val !== "" && results.value !== "" && (
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
          Understanding Bits: b ↔ kb ↔ Mb ↔ Gb
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Bits are the fundamental units of digital information, representing a
          binary value of either 0 or 1. In data communication and networking,
          bits are commonly grouped into larger units such as kilobits (kb),
          megabits (Mb), and gigabits (Gb) to express data rates and sizes more
          conveniently. Each unit is a multiple of the base bit, scaled by powers
          of 10: 1 kb equals 1,000 bits, 1 Mb equals 1,000,000 bits, and 1 Gb
          equals 1,000,000,000 bits.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these units and their relationships is essential for
          interpreting network speeds, bandwidth, and data transfer rates. This
          converter helps you seamlessly switch between these units, ensuring
          accurate and clear conversions. Whether you are analyzing internet
          speeds or configuring network equipment, knowing how to convert bits
          between these scales is invaluable.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this converter, simply enter the numeric value you want to
          convert in the input field. Then select the unit of the input value
          from the "From" dropdown menu and the desired output unit from the
          "To" dropdown menu. Click the "Convert" button to see the equivalent
          value in the chosen output unit instantly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input at any time by clicking the "Reset" button,
          which clears the value and allows you to start fresh. The conversion
          factors are based on standard decimal multiples used in networking,
          ensuring precise and reliable results. This tool is designed to be
          intuitive and efficient for both beginners and professionals.
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

      {/* 8. REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <li>
            <a href="https://www.computerhope.com/search.htm?q=Bit%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Bit Conversion - Computer Hope
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Clear explanations, examples, and history of Bit Conversion from Computer Hope's extensive tech dictionary.
            </p>
          </li>
          <li>
            <a href="https://search.techtarget.com/search/query?q=Bit%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Bit Conversion - TechTarget
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              In-depth technical definitions and enterprise context for Bit Conversion from TechTarget.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Bit%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Bit Conversion - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Bit Conversion on Calculator.net.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Bit%20Conversion" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Bit Conversion - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed encyclopedia article covering the history, standards, and usage of Bit Conversion.
            </p>
          </li>
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Common Conversion Factors
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 kilobit (kb) = 1,000 bits (b)
            </p>
            <p className="text-slate-500 text-sm">
              Kilobits are 1,000 times larger than bits, commonly used to measure
              network speeds.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 megabit (Mb) = 1,000,000 bits (b)
            </p>
            <p className="text-slate-500 text-sm">
              Megabits represent one million bits and are often used for broadband
              internet speeds.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 gigabit (Gb) = 1,000,000,000 bits (b)
            </p>
            <p className="text-slate-500 text-sm">
              Gigabits are one billion bits, typically used for very high-speed
              network connections.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Bits: b ↔ kb ↔ Mb ↔ Gb"
      description="Convert network data units. Switch between bits, kilobits, megabits (Mb), and gigabits (Gb) to understand network speeds."
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
          "Convert 1500 kilobits (kb) to megabits (Mb) to understand the equivalent data rate.",
        steps: [
          {
            label: "1",
            explanation:
              "Recognize that 1 kb = 1,000 bits and 1 Mb = 1,000,000 bits.",
          },
          {
            label: "2",
            explanation:
              "Convert 1500 kb to bits: 1500 × 1,000 = 1,500,000 bits.",
          },
          {
            label: "3",
            explanation:
              "Convert bits to Mb: 1,500,000 ÷ 1,000,000 = 1.5 Mb.",
          },
        ],
        result: "Therefore, 1500 kb equals 1.5 Mb.",
      }}
      relatedCalculators={[
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "🔄",
        },
        {
          title: "Pressure: Pa ↔ bar ↔ psi",
          url: "/conversion/pressure-pa-bar-psi",
          icon: "📏",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
          icon: "⚖️",
        },
        {
          title: "Binary ↔ Decimal prefixes (KiB ↔ KB)",
          url: "/conversion/binary-decimal-prefixes",
          icon: "🌡️",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "📐",
        },
        {
          title: "Frame Rate: fps ↔ Hz",
          url: "/conversion/frame-rate-fps-hz",
          icon: "⏱️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Conversion" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "factors", label: "Common Factors" },
        { id: "references", label: "References & Resources" },
]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}