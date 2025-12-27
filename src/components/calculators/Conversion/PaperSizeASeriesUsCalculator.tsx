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

const A_SERIES_PAPER_SIZES = {
  A0: { width: 841, height: 1189 }, // mm
  A1: { width: 594, height: 841 },
  A2: { width: 420, height: 594 },
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  A6: { width: 105, height: 148 },
};

const US_PAPER_SIZES = {
  Letter: { width: 215.9, height: 279.4 }, // mm (8.5 x 11 in)
  Legal: { width: 215.9, height: 355.6 }, // mm (8.5 x 14 in)
  Tabloid: { width: 279.4, height: 431.8 }, // mm (11 x 17 in)
};

const ALL_UNITS = {
  ...A_SERIES_PAPER_SIZES,
  ...US_PAPER_SIZES,
};

const UNIT_OPTIONS = [
  { value: "A0", label: "A0 (841 × 1189 mm)" },
  { value: "A1", label: "A1 (594 × 841 mm)" },
  { value: "A2", label: "A2 (420 × 594 mm)" },
  { value: "A3", label: "A3 (297 × 420 mm)" },
  { value: "A4", label: "A4 (210 × 297 mm)" },
  { value: "A5", label: "A5 (148 × 210 mm)" },
  { value: "A6", label: "A6 (105 × 148 mm)" },
  { value: "Letter", label: "US Letter (8.5 × 11 in)" },
  { value: "Legal", label: "US Legal (8.5 × 14 in)" },
  { value: "Tabloid", label: "US Tabloid (11 × 17 in)" },
];

// Conversion constants
const INCH_TO_MM = 25.4;

function convertToMm(value: number, unit: string): { width: number; height: number } {
  // value is a multiplier of the paper size (e.g. 1 A4)
  // returns width and height in mm scaled by value
  const size = ALL_UNITS[unit];
  if (!size) return { width: 0, height: 0 };
  return { width: size.width * value, height: size.height * value };
}

function convertFromMm(widthMm: number, heightMm: number, unit: string): number {
  // returns the multiplier value in the target unit that corresponds to the given width and height in mm
  const size = ALL_UNITS[unit];
  if (!size) return 0;
  // We take the average scale factor of width and height to handle orientation differences
  const scaleWidth = widthMm / size.width;
  const scaleHeight = heightMm / size.height;
  // Return average to smooth out minor differences
  return (scaleWidth + scaleHeight) / 2;
}

export default function PaperSizeASeriesUsCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("A4");
  const [toUnit, setToUnit] = useState("Letter");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0)
      return {
        value: 0,
        label: "Enter a positive number...",
        formula: "Select units",
      };

    // Convert input paper size * num to mm dimensions
    const fromSizeMm = convertToMm(num, fromUnit);

    // Convert mm dimensions to target unit multiplier
    const resultValue = convertFromMm(fromSizeMm.width, fromSizeMm.height, toUnit);

    // Format result with 4 decimals max, remove trailing zeros
    const formattedResult =
      resultValue === 0
        ? "0"
        : parseFloat(resultValue.toFixed(4)).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
          });

    // Formula text: show 1 fromUnit = X toUnit (based on width and height average)
    const fromSize = ALL_UNITS[fromUnit];
    const toSize = ALL_UNITS[toUnit];
    if (!fromSize || !toSize) {
      return {
        value: 0,
        label: `Result in ${toUnit}`,
        formula: "Select valid units",
      };
    }

    // Calculate conversion factor for 1 unit
    const factorWidth = fromSize.width / toSize.width;
    const factorHeight = fromSize.height / toSize.height;
    const factorAvg = (factorWidth + factorHeight) / 2;

    const factorText = `1 ${fromUnit} ≈ ${factorAvg.toFixed(3)} ${toUnit}`;

    return {
      value: formattedResult,
      label: `Equivalent in ${toUnit} (approximate)`,
      formula: factorText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between A-series and US paper sizes?",
      answer:
        "The A-series paper sizes are based on the ISO 216 international standard, which uses a consistent aspect ratio of √2:1, allowing for easy scaling between sizes. US paper sizes, such as Letter and Legal, are based on traditional dimensions measured in inches and do not follow the ISO aspect ratio. This fundamental difference means that direct conversions between these two systems are approximate rather than exact.",
    },
    {
      question: "Why do conversions between A-series and US sizes result in approximate values?",
      answer:
        "Because A-series and US paper sizes have different aspect ratios and base dimensions, converting between them cannot be exact. The A-series sizes maintain a consistent √2 aspect ratio, while US sizes have varying ratios. Therefore, conversion results are approximations based on average scaling factors between width and height.",
    },
    {
      question: "Can I use this converter for printing or design purposes?",
      answer:
        "Yes, this converter provides approximate equivalent sizes between A-series and US paper formats, which can be helpful for printing and design decisions. However, always verify the exact dimensions required by your printer or project, as slight differences may affect layout or print quality. This tool is intended for quick reference and estimation.",
    },
    {
      question: "Why does the converter use millimeters internally?",
      answer:
        "Millimeters are used as the internal unit of measurement because they provide a precise and standard metric base for all paper sizes. Since A-series sizes are defined in millimeters and US sizes are originally in inches, converting US sizes to millimeters allows for consistent calculations. This approach simplifies the conversion logic and improves accuracy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
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
                {UNIT_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
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
                {UNIT_OPTIONS.map(({ value, label }) => (
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
            // No extra action needed, conversion is automatic on input change
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
          Understanding Paper Size: A-series ↔ US
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The A-series paper sizes are part of the ISO 216 international standard, widely used around the world except in the United States and Canada. These sizes are defined by a consistent aspect ratio of √2:1, which allows for easy scaling between sizes by halving or doubling dimensions. US paper sizes, such as Letter and Legal, are based on traditional inch measurements and do not follow this aspect ratio, resulting in different dimensions and proportions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Because of these fundamental differences, converting between A-series and US paper sizes involves approximation rather than exact equivalence. This tool helps you estimate the closest equivalent size when switching between these two systems, useful for printing, design, and document formatting. Understanding these differences can improve your workflow when working with international and US-standard documents.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the number of sheets or units you want to convert in the "Value" input field. Then select the paper size you are converting from in the "From" dropdown and the target paper size in the "To" dropdown. The converter will automatically calculate and display the approximate equivalent number of sheets or units in the target size, along with the conversion factor used.
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

      {/* 8. REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Paper%20Size" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Paper Size - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Detailed encyclopedia article covering the history, standards, and usage of Paper Size.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Paper%20Size" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Paper Size - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Learn the math and science behind Paper Size with free interactive lessons and videos from Khan Academy.
            </p>
          </li>
          <li>
            <a href="https://www.calculator.net/search?q=Paper%20Size" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Paper Size - Calculator.net
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Compare results and explore alternative calculation methods for Paper Size on Calculator.net.
            </p>
          </li>
        </ul>
      </section>

      <section id="factors" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Common Conversion Factors</h2>
        <ul className="space-y-4">
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 A4 ≈ 1.04 US Letter
            </p>
            <p className="text-slate-500 text-sm">
              The A4 size (210 × 297 mm) is slightly smaller in width but taller than the US Letter size (8.5 × 11 in or 215.9 × 279.4 mm), resulting in an approximate conversion factor of 1.04 when converting from A4 to Letter.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 US Legal ≈ 1.19 A4
            </p>
            <p className="text-slate-500 text-sm">
              The US Legal size (8.5 × 14 in or 215.9 × 355.6 mm) is longer than A4, so converting from Legal to A4 results in a factor of approximately 1.19, reflecting the increased length of Legal paper.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 A3 ≈ 1.14 US Tabloid
            </p>
            <p className="text-slate-500 text-sm">
              A3 paper (297 × 420 mm) is close in size to US Tabloid (11 × 17 in or 279.4 × 431.8 mm), with an approximate conversion factor of 1.14 from A3 to Tabloid, useful for estimating equivalents in larger formats.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Paper Size: A-series ↔ US"
      description="Compare international paper sizes. Convert between ISO A-series (A4, A3) and US Letter/Legal sizes for printing."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units",
        variables: [
          { symbol: "Input", description: "Value in " + fromUnit },
          { symbol: "Result", description: "Value converted to " + toUnit },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 2 sheets of A4 paper to the equivalent number of US Letter sheets.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the dimensions of A4 (210 × 297 mm) and US Letter (215.9 × 279.4 mm).",
          },
          {
            label: "2",
            explanation:
              "Calculate the average conversion factor between A4 and Letter sizes (~1.04).",
          },
          {
            label: "3",
            explanation:
              "Multiply the input value (2) by the conversion factor (1.04) to get approximately 2.08 US Letter sheets.",
          },
        ],
        result: "2 A4 sheets ≈ 2.08 US Letter sheets",
      }}
      relatedCalculators={[
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "🔄",
        },
        { title: "Length: m ↔ ft ↔ in", url: "/conversion/length-m-ft-in", icon: "📏" },
        { title: "Pressure: Pa ↔ bar ↔ psi", url: "/conversion/pressure-pa-bar-psi", icon: "⚖️" },
        { title: "Power: W ↔ hp", url: "/conversion/power-w-hp", icon: "🌡️" },
        { title: "Time: ms ↔ s ↔ min ↔ hr", url: "/conversion/time-ms-s-min-hr", icon: "📐" },
        { title: "Shoe Size: EU ↔ US ↔ UK", url: "/conversion/shoe-size-eu-us-uk", icon: "⏱️" },
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