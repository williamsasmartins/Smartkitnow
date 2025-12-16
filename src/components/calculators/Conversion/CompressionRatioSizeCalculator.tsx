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

type UnitKey = "ratio" | "size_bytes" | "size_kb" | "size_mb" | "size_gb";

const units: { [key in UnitKey]: { label: string; toBytes?: number } } = {
  ratio: { label: "Compression Ratio (e.g. 2:1)" },
  size_bytes: { label: "File Size (Bytes)", toBytes: 1 },
  size_kb: { label: "File Size (KB)", toBytes: 1024 },
  size_mb: { label: "File Size (MB)", toBytes: 1024 * 1024 },
  size_gb: { label: "File Size (GB)", toBytes: 1024 * 1024 * 1024 },
};

function parseRatio(input: string): number | null {
  // Accept formats like "2", "2:1", "3:2", "1.5"
  if (!input) return null;
  input = input.trim();
  if (input.includes(":")) {
    const parts = input.split(":");
    if (parts.length !== 2) return null;
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (isNaN(num) || isNaN(den) || den === 0) return null;
    return num / den;
  } else {
    const val = parseFloat(input);
    if (isNaN(val) || val <= 0) return null;
    return val;
  }
}

function formatRatio(ratio: number): string {
  // Format ratio as "X:1" with 2 decimals max
  if (ratio <= 0) return "Invalid";
  return ratio.toFixed(2).replace(/\.00$/, "") + ":1";
}

export default function CompressionRatioSizeCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState<UnitKey>("ratio");
  const [toUnit, setToUnit] = useState<UnitKey>("size_bytes");

  // 2. LOGIC
  // Conversion logic:
  // We want to convert between Compression Ratio and File Size.
  // The user inputs a value with fromUnit and wants to get to toUnit.
  //
  // Interpretation:
  // - If fromUnit is ratio and toUnit is size, then val is compression ratio,
  //   and result is original size / ratio (compressed size).
  // - If fromUnit is size and toUnit is ratio, then val is compressed size,
  //   and result is original size / compressed size = ratio.
  // - If both are sizes, convert units.
  // - If both are ratio, convert ratio (should be identity).
  //
  // For simplicity, assume original size = 1 unit (e.g. 1 byte) for ratio conversions,
  // so we can show relative conversions.

  const results = useMemo(() => {
    if (!val) {
      return {
        value: "",
        label: "Enter a value to convert",
        formula: "",
      };
    }

    const inputNum = parseFloat(val);
    if (isNaN(inputNum) || inputNum <= 0) {
      return {
        value: "",
        label: "Please enter a positive number",
        formula: "",
      };
    }

    // Handle ratio parsing if fromUnit is ratio
    let ratioValue: number | null = null;
    if (fromUnit === "ratio") {
      ratioValue = parseRatio(val);
      if (ratioValue === null) {
        return {
          value: "",
          label:
            'Invalid ratio format. Use formats like "2", "2:1", or "3:2" (positive numbers).',
          formula: "",
        };
      }
    }

    // Conversion logic:
    // Define original size as 1 byte for ratio calculations.
    // Compressed size = original size / ratio.

    let resultNum: number | null = null;
    let formulaText = "";

    if (fromUnit === "ratio" && toUnit !== "ratio") {
      // From ratio to size
      // compressed size = original size / ratio
      // original size = 1 unit (bytes)
      if (!ratioValue) return { value: "", label: "Invalid ratio", formula: "" };
      const originalBytes = 1;
      const compressedBytes = originalBytes / ratioValue;
      // Convert compressedBytes to toUnit
      const toBytesFactor = units[toUnit].toBytes || 1;
      resultNum = compressedBytes / toBytesFactor;
      formulaText = `Compressed Size = Original Size ÷ Compression Ratio = 1 byte ÷ ${formatRatio(
        ratioValue
      )} = ${compressedBytes.toFixed(6)} bytes`;
      if (toUnit !== "size_bytes") {
        formulaText += ` = ${(resultNum).toFixed(6)} ${units[toUnit].label}`;
      }
    } else if (fromUnit !== "ratio" && toUnit === "ratio") {
      // From size to ratio
      // ratio = original size / compressed size
      // original size = 1 unit (bytes)
      const fromBytesFactor = units[fromUnit].toBytes || 1;
      const compressedBytes = inputNum * fromBytesFactor;
      if (compressedBytes === 0) return { value: "", label: "Invalid size", formula: "" };
      const ratio = 1 / compressedBytes;
      resultNum = ratio;
      formulaText = `Compression Ratio = Original Size ÷ Compressed Size = 1 byte ÷ ${compressedBytes.toFixed(
        6
      )} bytes = ${formatRatio(ratio)}`;
    } else if (
      fromUnit !== "ratio" &&
      toUnit !== "ratio" &&
      fromUnit !== toUnit
    ) {
      // Size to size conversion
      const fromBytesFactor = units[fromUnit].toBytes || 1;
      const toBytesFactor = units[toUnit].toBytes || 1;
      const bytes = inputNum * fromBytesFactor;
      resultNum = bytes / toBytesFactor;
      formulaText = `1 ${units[fromUnit].label} = ${
        fromBytesFactor / toBytesFactor
      } ${units[toUnit].label}`;
    } else if (fromUnit === "ratio" && toUnit === "ratio") {
      // Ratio to ratio (identity)
      if (!ratioValue) return { value: "", label: "Invalid ratio", formula: "" };
      resultNum = ratioValue;
      formulaText = `Ratio unchanged: ${formatRatio(ratioValue)}`;
    } else {
      // Same units (size to size same unit or ratio to ratio)
      resultNum = inputNum;
      formulaText = `Same units, value unchanged`;
    }

    if (resultNum === null) {
      return {
        value: "",
        label: "Conversion not possible",
        formula: "",
      };
    }

    // Format output
    let displayValue = "";
    if (toUnit === "ratio") {
      displayValue = formatRatio(resultNum);
    } else {
      // For sizes, show up to 6 decimals max, remove trailing zeros
      displayValue = resultNum.toLocaleString(undefined, {
        maximumFractionDigits: 6,
      });
    }

    return {
      value: displayValue,
      label: `Value in ${units[toUnit].label}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is a compression ratio and why is it important?",
      answer:
        "A compression ratio represents how much a file or data size is reduced compared to its original size. It is expressed as a ratio, such as 2:1, meaning the compressed file is half the size of the original. Understanding this ratio helps in estimating storage savings and performance impacts when compressing data.",
    },
    {
      question: "How do I interpret the file size units in this converter?",
      answer:
        "File sizes can be expressed in bytes, kilobytes (KB), megabytes (MB), or gigabytes (GB), each representing increasing multiples of 1024 bytes. This converter allows you to switch between these units seamlessly to better understand the scale of your data. Knowing the correct unit is crucial for accurate size estimation and conversion.",
    },
    {
      question: "Can I convert directly between compression ratios and file sizes?",
      answer:
        "Yes, this tool enables conversion between compression ratios and file sizes by assuming an original file size of 1 byte for calculation purposes. When converting from a ratio to a size, it calculates the compressed size relative to that original size. Conversely, converting from a compressed size to a ratio estimates how much the file has been reduced.",
    },
    {
      question: "Why does the converter require positive numbers and specific formats?",
      answer:
        "Compression ratios and file sizes must be positive values because negative or zero values do not make sense in this context. Ratios can be entered as simple numbers or in the format 'X:Y' to express relative compression. Ensuring correct input formats guarantees meaningful and accurate conversion results.",
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
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={
              fromUnit === "ratio"
                ? 'Enter ratio (e.g. "2", "2:1", "3:2")'
                : "Enter number..."
            }
            spellCheck={false}
            autoComplete="off"
            inputMode={fromUnit === "ratio" ? "text" : "decimal"}
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
                <SelectItem value="ratio">
                  Compression Ratio (e.g. 2:1)
                </SelectItem>
                <SelectItem value="size_bytes">File Size (Bytes)</SelectItem>
                <SelectItem value="size_kb">File Size (KB)</SelectItem>
                <SelectItem value="size_mb">File Size (MB)</SelectItem>
                <SelectItem value="size_gb">File Size (GB)</SelectItem>
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
                <SelectItem value="ratio">
                  Compression Ratio (e.g. 2:1)
                </SelectItem>
                <SelectItem value="size_bytes">File Size (Bytes)</SelectItem>
                <SelectItem value="size_kb">File Size (KB)</SelectItem>
                <SelectItem value="size_mb">File Size (MB)</SelectItem>
                <SelectItem value="size_gb">File Size (GB)</SelectItem>
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
            // No special action needed, conversion is automatic on input change
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
              {results.formula && (
                <p className="text-xs text-slate-500 mt-4 font-mono bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded whitespace-pre-line text-left">
                  Factor: {results.formula}
                </p>
              )}
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
          Understanding Compression Ratio & Size
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Compression ratio is a measure of how much a file or data size is
          reduced during compression. It is typically expressed as a ratio,
          such as 2:1, indicating that the compressed file is half the size of
          the original. Understanding this ratio helps users estimate storage
          savings and the efficiency of compression algorithms.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          File size, on the other hand, is the actual amount of data stored,
          commonly measured in bytes, kilobytes, megabytes, or gigabytes. This
          converter bridges the gap between these two concepts by allowing you
          to convert compression ratios into estimated file sizes and vice
          versa. This is especially useful for planning storage requirements or
          evaluating compression performance.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by entering the value you want to convert in the input field.
          Select the unit type of your input value from the "From" dropdown,
          choosing between compression ratio or various file size units. Then,
          select the desired output unit from the "To" dropdown.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The converter will automatically calculate and display the converted
          value along with the formula used for the conversion. Use the reset
          button to clear your inputs and start a new calculation at any time.
          This tool supports flexible input formats for ratios, such as "2:1"
          or simply "2", to accommodate different user preferences.
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
              File Size Units
            </p>
            <p className="text-slate-500 text-sm">
              1 KB = 1024 Bytes<br />
              1 MB = 1024 KB = 1,048,576 Bytes<br />
              1 GB = 1024 MB = 1,073,741,824 Bytes
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Compression Ratio Example
            </p>
            <p className="text-slate-500 text-sm">
              A 2:1 compression ratio means the compressed file is half the size
              of the original file.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Compression Ratio & Size"
      description="Estimate file size reduction. Calculate the final file size based on original size and compression ratio."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units and enter a value",
        variables: [
          {
            symbol: "Input",
            description:
              "The value you entered in " + units[fromUnit].label,
          },
          {
            symbol: "Result",
            description:
              "The calculated equivalent in " + units[toUnit].label,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "You have a file compressed with a 4:1 ratio and want to know the compressed size in KB.",
        steps: [
          {
            label: "1",
            explanation:
              'Enter "4" or "4:1" as the compression ratio in the input field.',
          },
          {
            label: "2",
            explanation:
              'Select "Compression Ratio" as the "From" unit and "File Size (KB)" as the "To" unit.',
          },
          {
            label: "3",
            explanation:
              "The converter calculates the compressed size as 0.25 KB, assuming the original file size is 1 KB.",
          },
        ],
        result:
          "Compressed Size = Original Size ÷ Compression Ratio = 1 KB ÷ 4 = 0.25 KB",
      }}
      relatedCalculators={[
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "🔄",
        },
        {
          title: "Density: g/mL ↔ kg/m³",
          url: "/conversion/density-g-per-ml-kg-per-m3",
          icon: "📏",
        },
        {
          title: "Shoe Size: EU ↔ US ↔ UK",
          url: "/conversion/shoe-size-eu-us-uk",
          icon: "⚖️",
        },
        {
          title: "Torque: N·m ↔ lbf·ft",
          url: "/conversion/torque-nm-lbfft",
          icon: "🌡️",
        },
        {
          title: "Frequency: Hz ↔ kHz ↔ MHz",
          url: "/conversion/frequency-hz-khz-mhz",
          icon: "📐",
        },
        {
          title: "Temperature: °C ↔ °F ↔ K",
          url: "/conversion/temperature-c-f-k",
          icon: "🌡️",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Compression Ratio & Size" },
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