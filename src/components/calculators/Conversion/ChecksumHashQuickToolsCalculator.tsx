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

const units = [
  { value: "none", label: "None (raw input)" },
  { value: "md5", label: "MD5 (128-bit hash)" },
  { value: "sha1", label: "SHA-1 (160-bit hash)" },
  { value: "sha256", label: "SHA-256 (256-bit hash)" },
  { value: "crc32", label: "CRC32 (32-bit checksum)" },
  { value: "adler32", label: "Adler-32 (32-bit checksum)" },
];

// Dummy conversion factors for demonstration (not real cryptographic conversions)
// We treat this as a "length" conversion of hash/checksum bit lengths for illustration.
// In reality, these are not convertible, but this tool helps understand bit-length equivalences.
const bitLengths: Record<string, number> = {
  none: 0,
  md5: 128,
  sha1: 160,
  sha256: 256,
  crc32: 32,
  adler32: 32,
};

export default function ChecksumHashQuickToolsCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("md5");
  const [toUnit, setToUnit] = useState("sha1");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a numeric value to convert",
        formula: "Select units",
      };
    }
    if (fromUnit === "none" || toUnit === "none") {
      return {
        value: val,
        label: `Raw input (no conversion)`,
        formula: `No conversion between raw input and hash/checksum types`,
      };
    }

    // Conversion logic: scale input value by ratio of bit lengths
    // This is a conceptual conversion to understand relative sizes.
    const fromBits = bitLengths[fromUnit];
    const toBits = bitLengths[toUnit];
    if (!fromBits || !toBits) {
      return {
        value: "",
        label: "Invalid unit selected",
        formula: "Select valid units",
      };
    }

    // Convert input value proportionally to bit length ratio
    // For example, converting 1 MD5 unit to SHA-1 units:
    // result = val * (toBits / fromBits)
    const result = (num * toBits) / fromBits;

    const formulaText = `1 ${fromUnit.toUpperCase()} unit = ${(
      toBits / fromBits
    ).toFixed(4)} ${toUnit.toUpperCase()} units`;

    return {
      value: result.toLocaleString(undefined, {
        maximumFractionDigits: 6,
      }),
      label: `Equivalent value in ${toUnit.toUpperCase()}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between a checksum and a hash?",
      answer:
        "A checksum is a simple value calculated from a data set to detect errors during transmission or storage, often using algorithms like CRC32 or Adler-32. A hash, on the other hand, is a more complex cryptographic function that produces a fixed-size string from data, designed to be unique and irreversible, such as MD5 or SHA-256. While both verify data integrity, hashes provide stronger security guarantees and are widely used in authentication and digital signatures.",
    },
    {
      question: "Can I convert one hash type directly into another?",
      answer:
        "No, hash functions are designed to be one-way and irreversible, meaning you cannot convert a hash of one type directly into another hash type. Each hash algorithm produces a unique output based on the input data, and the outputs are not mathematically convertible between algorithms. This tool provides conceptual conversions based on bit-length equivalences to help understand relative sizes, not actual cryptographic transformations.",
    },
    {
      question: "Why do different hash algorithms have different bit lengths?",
      answer:
        "Different hash algorithms are designed with varying bit lengths to balance security and performance. Longer bit lengths, like SHA-256's 256 bits, provide stronger resistance against collisions and preimage attacks, making them more secure. Shorter hashes, like MD5's 128 bits, are faster to compute but less secure, which is why they are generally deprecated for security-sensitive applications.",
    },
    {
      question: "How can I use this tool effectively for data integrity checks?",
      answer:
        "This tool helps you understand the relative sizes and conceptual relationships between various checksum and hash types by converting numeric values proportionally based on their bit lengths. While it does not perform actual hashing or checksum calculations, it can assist in planning storage or transmission requirements when working with different hash algorithms. For actual integrity verification, you should use dedicated hashing libraries or tools to generate and compare hash values.",
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
                {units.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
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
                {units.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
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
            // No special action needed; conversion is live
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
          Understanding Checksum & Hash Quick Tools
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Checksums and hashes are essential tools used to verify the integrity
          of data during storage or transmission. While checksums are simpler
          algorithms designed to detect accidental errors, hashes are complex
          cryptographic functions that provide a unique fingerprint of data,
          ensuring authenticity and security. This tool helps you conceptually
          understand the relationships and relative sizes of common checksum and
          hash types.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By comparing bit lengths and conceptual conversion factors, users can
          better plan for storage, transmission, or verification processes when
          working with different checksum and hash algorithms. Although direct
          conversion between hash types is not possible, understanding their
          relative sizes is valuable for many technical applications. This
          calculator provides a quick reference and conversion framework for
          these cryptographic primitives.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter a numeric value representing a quantity or conceptual unit of a
          checksum or hash type in the input field. Then select the source
          algorithm type from the "From" dropdown and the target algorithm type
          from the "To" dropdown. The tool will calculate and display the
          equivalent value scaled by the relative bit lengths of the selected
          algorithms, helping you understand their size relationships.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use the "Convert" button to refresh the calculation if needed, or the
          "Reset" button to clear the input and start over. Note that this tool
          does not perform actual cryptographic hashing or checksum generation,
          but rather provides a conceptual conversion based on bit-length
          equivalences. For real-world integrity checks, use dedicated hashing
          software or libraries.
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
            <a href="https://www.computerhope.com/search.htm?q=Checksum%20and%20Hash" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Checksum and Hash - Computer Hope
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Clear explanations, examples, and history of Checksum and Hash from Computer Hope's extensive tech dictionary.
            </p>
          </li>
          <li>
            <a href="https://search.techtarget.com/search/query?q=Checksum%20and%20Hash" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Checksum and Hash - TechTarget
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              In-depth technical definitions and enterprise context for Checksum and Hash from TechTarget.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Checksum%20and%20Hash" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Checksum and Hash - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Checksum and Hash on Calculator.net.
            </p>
          </li>
          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Checksum%20and%20Hash" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Checksum and Hash - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed encyclopedia article covering the history, standards, and usage of Checksum and Hash.
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
              Bit Length Ratios Between Hash & Checksum Types
            </p>
            <p className="text-slate-500 text-sm">
              1 MD5 unit (128 bits) = 1.25 SHA-1 units (160 bits)
              <br />
              1 SHA-1 unit (160 bits) = 0.8 MD5 units (128 bits)
              <br />
              1 SHA-256 unit (256 bits) = 2 MD5 units (128 bits)
              <br />
              1 CRC32 or Adler-32 unit (32 bits) = 0.25 MD5 units (128 bits)
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Checksum & Hash Quick Tools"
      description="Verify data integrity. Quickly generate or compare checksums and hash values for files to ensure they are not corrupted."
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
            description: "Value in " + (fromUnit.toUpperCase() || "unit"),
          },
          {
            symbol: "Result",
            description: "Value converted to " + (toUnit.toUpperCase() || "unit"),
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert a value of 100 MD5 units to SHA-1 units to understand relative size.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the bit lengths: MD5 is 128 bits, SHA-1 is 160 bits.",
          },
          {
            label: "2",
            explanation:
              "Calculate the ratio: 160 / 128 = 1.25, meaning SHA-1 units are larger.",
          },
          {
            label: "3",
            explanation:
              "Multiply the input value by the ratio: 100 * 1.25 = 125 SHA-1 units.",
          },
        ],
        result: "100 MD5 units are conceptually equivalent to 125 SHA-1 units.",
      }}
      relatedCalculators={[
        { title: "Power: W ↔ hp", url: "/conversion/power-w-hp", icon: "🔄" },
        {
          title: "Binary ↔ Decimal prefixes (KiB ↔ KB)",
          url: "/conversion/binary-decimal-prefixes",
          icon: "📏",
        },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Temperature: °C ↔ °F ↔ K",
          url: "/conversion/temperature-c-f-k",
          icon: "🌡️",
        },
        { title: "Force: N ↔ lbf", url: "/conversion/force-n-lbf", icon: "📐" },
        { title: "Mass: kg ↔ lb ↔ oz", url: "/conversion/mass-kg-lb-oz", icon: "⚖️" },
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