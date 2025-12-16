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

export default function ShoeSizeEuUsUkCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("EU");
  const [toUnit, setToUnit] = useState("US");

  // 2. LOGIC

  /**
   * Shoe size conversion logic:
   * We use approximate formulas based on common shoe size conversion charts.
   * These are approximations and can vary by brand, but are widely accepted.
   *
   * EU sizes: typically whole numbers, starting ~35 for women, 39 for men.
   * US sizes: decimals allowed, starting ~5 for women, 6 for men.
   * UK sizes: decimals allowed, usually 1 size smaller than US.
   *
   * Conversion formulas (approximate):
   * - EU to US (Men): US = (EU / 1.5) - 13
   * - US to EU (Men): EU = (US + 13) * 1.5
   * - UK to US (Men): US = UK + 1
   * - US to UK (Men): UK = US - 1
   * - EU to UK (Men): UK = (EU / 1.5) - 14
   * - UK to EU (Men): EU = (UK + 14) * 1.5
   *
   * For women's sizes, US sizes are typically 1.5 to 2 sizes smaller than men's.
   * For simplicity, this calculator assumes men's sizes.
   */

  // Helper conversion functions:
  function euToUs(eu: number) {
    return (eu / 1.5) - 13;
  }
  function usToEu(us: number) {
    return (us + 13) * 1.5;
  }
  function ukToUs(uk: number) {
    return uk + 1;
  }
  function usToUk(us: number) {
    return us - 1;
  }
  function euToUk(eu: number) {
    return (eu / 1.5) - 14;
  }
  function ukToEu(uk: number) {
    return (uk + 14) * 1.5;
  }

  // Round to nearest 0.5 for shoe sizes
  function roundHalf(num: number) {
    return Math.round(num * 2) / 2;
  }

  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: "Select units and enter a number",
      };
    }

    if (num < 10 || num > 50) {
      // Shoe sizes outside typical range
      return {
        value: "",
        label: "Enter a realistic shoe size",
        formula: "Shoe sizes typically range from 10 to 50",
      };
    }

    let resultNum: number | null = null;
    let formulaText = "";

    if (fromUnit === toUnit) {
      resultNum = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else if (fromUnit === "EU" && toUnit === "US") {
      resultNum = euToUs(num);
      formulaText = `US = (EU / 1.5) - 13`;
    } else if (fromUnit === "US" && toUnit === "EU") {
      resultNum = usToEu(num);
      formulaText = `EU = (US + 13) × 1.5`;
    } else if (fromUnit === "UK" && toUnit === "US") {
      resultNum = ukToUs(num);
      formulaText = `US = UK + 1`;
    } else if (fromUnit === "US" && toUnit === "UK") {
      resultNum = usToUk(num);
      formulaText = `UK = US - 1`;
    } else if (fromUnit === "EU" && toUnit === "UK") {
      resultNum = euToUk(num);
      formulaText = `UK = (EU / 1.5) - 14`;
    } else if (fromUnit === "UK" && toUnit === "EU") {
      resultNum = ukToEu(num);
      formulaText = `EU = (UK + 14) × 1.5`;
    } else {
      // Fallback, no conversion
      resultNum = null;
      formulaText = "Conversion not supported";
    }

    if (resultNum === null || isNaN(resultNum)) {
      return {
        value: "",
        label: "Conversion not available",
        formula: formulaText,
      };
    }

    // Round result to nearest 0.5
    const rounded = roundHalf(resultNum);

    return {
      value: rounded.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why do shoe sizes differ between EU, US, and UK systems?",
      answer:
        "Shoe sizing systems evolved independently in different regions, leading to variations in measurement units and standards. The EU system is based on the length of the last in Paris points, while US and UK sizes are derived from inches but use different starting points and increments. This results in different numeric values representing similar foot lengths across these systems.",
    },
    {
      question: "Can I rely on these conversions for all shoe brands?",
      answer:
        "While these conversions provide a close approximation, shoe sizing can vary significantly between brands and styles due to last shape and manufacturing differences. It's always recommended to try shoes on or consult specific brand sizing charts when possible. This tool offers a general guideline but may not guarantee a perfect fit for every shoe.",
    },
    {
      question: "Why are some shoe sizes decimal numbers while others are whole numbers?",
      answer:
        "US and UK shoe sizes often use half sizes to accommodate slight differences in foot length, providing a more precise fit. The EU system typically uses whole numbers based on the length of the shoe last measured in Paris points, which are smaller increments. This difference in sizing granularity leads to decimals in US/UK sizes but whole numbers in EU sizes.",
    },
    {
      question: "How should I measure my foot to use this converter accurately?",
      answer:
        "To measure your foot accurately, place your foot on a piece of paper and mark the heel and longest toe points. Measure the distance between these points in centimeters or inches. Use this measurement to find your approximate EU, US, or UK shoe size using sizing charts or this converter for better fitting shoes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const units = [
    { value: "EU", label: "European (EU)" },
    { value: "US", label: "American (US)" },
    { value: "UK", label: "British (UK)" },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="mb-2 block text-slate-700 dark:text-slate-300">Value</Label>
          <Input
            type="number"
            min="10"
            max="50"
            step="0.5"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter shoe size..."
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
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">To</Label>
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              <p className="text-xs text-slate-500 mt-4 font-mono bg-white/50 dark:bg-black/20 inline-block px-3 py-1 rounded">
                Formula: {results.formula}
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
          Understanding Shoe Size: EU ↔ US ↔ UK
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Shoe sizes vary internationally due to different measurement systems and standards. The European (EU) system uses Paris points based on the length of the shoe last, while the American (US) and British (UK) systems use inches but differ in their starting points and increments. Understanding these differences helps in selecting the right shoe size when shopping across regions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This converter provides approximate conversions between EU, US, and UK shoe sizes, primarily based on men's sizing standards. While these conversions are widely accepted, individual brands may have slight variations. Always consider trying shoes on or consulting brand-specific charts for the best fit.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter your shoe size value in the input field and select the unit system you want to convert from (EU, US, or UK). Then, choose the unit system you want to convert to. Click the "Convert" button to see the equivalent shoe size in the selected system along with the conversion formula used.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          If you want to clear your input and start over, use the "Reset" button. The converter rounds results to the nearest half size for practical fitting purposes. This tool is designed to help you navigate international shoe size differences with ease and confidence.
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
              EU to US (Men's): US = (EU / 1.5) - 13
            </p>
            <p className="text-slate-500 text-sm">
              This formula approximates the US men's shoe size from the EU size.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              US to EU (Men's): EU = (US + 13) × 1.5
            </p>
            <p className="text-slate-500 text-sm">
              Converts US men's shoe size back to the EU size using this factor.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              UK to US (Men's): US = UK + 1
            </p>
            <p className="text-slate-500 text-sm">
              The US men's shoe size is typically one size larger than the UK size.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              EU to UK (Men's): UK = (EU / 1.5) - 14
            </p>
            <p className="text-slate-500 text-sm">
              Approximate conversion from EU to UK men's shoe size.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Shoe Size: EU ↔ US ↔ UK"
      description="Convert international shoe sizes. Find the right fit by converting between European (EU), American (US), and British (UK) sizing charts."
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
            description: `Value in ${fromUnit} shoe size system`,
          },
          {
            symbol: "Result",
            description: `Equivalent value in ${toUnit} shoe size system`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert a European shoe size 42 to its American equivalent.",
        steps: [
          {
            label: "1",
            explanation:
              "Start with EU size 42. Using the formula US = (EU / 1.5) - 13, substitute 42 for EU.",
          },
          {
            label: "2",
            explanation:
              "Calculate: (42 / 1.5) - 13 = 28 - 13 = 15. Round to nearest half size if needed.",
          },
          {
            label: "3",
            explanation:
              "The equivalent US men's shoe size is approximately 15.",
          },
        ],
        result: "EU 42 ≈ US 15",
      }}
      relatedCalculators={[
        {
          title: "Volume: L ↔ mL ↔ gal ↔ oz",
          url: "/conversion/volume-l-ml-gal-oz",
          icon: "🔄",
        },
        {
          title: "Frame Rate: fps ↔ Hz",
          url: "/conversion/frame-rate-fps-hz",
          icon: "📏",
        },
        {
          title: "Mass: kg ↔ lb ↔ oz",
          url: "/conversion/mass-kg-lb-oz",
          icon: "⚖️",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "🌡️",
        },
        {
          title: "Binary ↔ Decimal prefixes (KiB ↔ KB)",
          url: "/conversion/binary-decimal-prefixes",
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