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
  { value: "mps", label: "Meters per second (m/s)" },
  { value: "kmph", label: "Kilometers per hour (km/h)" },
  { value: "mph", label: "Miles per hour (mph)" },
];

// Conversion factors relative to meters per second
const toMpsFactor: Record<string, number> = {
  mps: 1,
  kmph: 1000 / 3600, // 1 km/h = 1000m / 3600s = 0.2777777778 m/s
  mph: 1609.344 / 3600, // 1 mph = 1609.344m / 3600s = 0.44704 m/s
};

export default function SpeedMpsKmphMphCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("mps");
  const [toUnit, setToUnit] = useState("kmph");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a value to convert",
        formula: "Select units to see conversion factor",
      };
    }
    if (!(fromUnit in toMpsFactor) || !(toUnit in toMpsFactor)) {
      return {
        value: "",
        label: "Select valid units",
        formula: "Invalid units selected",
      };
    }

    // Convert input value to meters per second
    const valInMps = num * toMpsFactor[fromUnit];
    // Convert meters per second to target unit
    const result = valInMps / toMpsFactor[toUnit];

    // Format result with up to 6 decimals, trimming trailing zeros
    const formattedResult = result.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });

    // Prepare formula text for display
    // Show factor: 1 fromUnit = X toUnit
    // Calculate factor: how many toUnit in 1 fromUnit
    const factor = toMpsFactor[fromUnit] / toMpsFactor[toUnit];
    const formattedFactor = factor.toLocaleString(undefined, {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    });

    const fromLabel = units.find((u) => u.value === fromUnit)?.label || fromUnit;
    const toLabel = units.find((u) => u.value === toUnit)?.label || toUnit;

    const formulaText = `1 ${fromLabel} = ${formattedFactor} ${toLabel}`;

    return {
      value: formattedResult,
      label: `Value in ${toLabel}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why are there different units for measuring speed?",
      answer:
        "Speed can be measured in various units depending on the context and region. Meters per second (m/s) is commonly used in scientific and engineering fields due to its basis in the metric system. Kilometers per hour (km/h) and miles per hour (mph) are more common in everyday life and transportation, reflecting regional preferences and customary units.",
    },
    {
      question: "How accurate are the conversion factors between these speed units?",
      answer:
        "The conversion factors used are exact and based on internationally agreed definitions: 1 mile equals exactly 1609.344 meters, and 1 kilometer equals 1000 meters. Because these are fixed constants, conversions between m/s, km/h, and mph are precise and reliable for all practical purposes. Minor rounding may occur when displaying results but does not affect the underlying accuracy.",
    },
    {
      question: "Can this converter handle negative or zero speed values?",
      answer:
        "Yes, the converter accepts zero and negative values as valid inputs. Zero speed simply means no movement, while negative values can represent direction in some contexts, such as velocity in physics. This tool treats the input as a scalar value, converting it directly without interpreting directionality.",
    },
    {
      question: "Why is the conversion done via meters per second internally?",
      answer:
        "Meters per second (m/s) is the SI base unit for speed, making it a natural standard for conversions. By converting all input values first to m/s, the tool simplifies the logic and ensures consistency. This approach avoids direct pairwise conversions between units, reducing complexity and potential errors.",
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
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Enter number..."
            min={undefined}
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
            // No explicit action needed since conversion is reactive
          }}
          aria-label="Convert speed units"
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
      {val !== "" && results.value !== "" && (
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
          Understanding Speed: m/s ↔ km/h ↔ mph
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Speed is a fundamental physical quantity that describes how fast an object is moving. It is defined as the distance traveled per unit of time and can be expressed in various units depending on the context. The most common units for speed include meters per second (m/s), kilometers per hour (km/h), and miles per hour (mph), each serving different practical and scientific purposes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Meters per second is the standard SI unit used primarily in scientific calculations and engineering, providing a direct measure of distance over time in metric units. Kilometers per hour is widely used in everyday life, especially for vehicle speeds and road signs in most countries. Miles per hour is predominantly used in the United States and the United Kingdom for speed limits and vehicle speed measurements.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Converter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert between speed units, enter the numerical value of the speed you want to convert in the input field. Then select the unit of the value you entered in the "From" dropdown and the unit you want to convert to in the "To" dropdown. The conversion result will be displayed instantly below, showing the equivalent speed in the selected target unit along with the conversion factor used.
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
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Meters per second to kilometers per hour</p>
            <p className="text-slate-500 text-sm">1 m/s = 3.6 km/h</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Kilometers per hour to miles per hour</p>
            <p className="text-slate-500 text-sm">1 km/h ≈ 0.621371 mph</p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Miles per hour to meters per second</p>
            <p className="text-slate-500 text-sm">1 mph ≈ 0.44704 m/s</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Speed: m/s ↔ km/h ↔ mph"
      description="Convert speed and velocity units. Calculate meters per second, kilometers per hour, and miles per hour (mph) for travel and physics."
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
            description: `Value in ${
              units.find((u) => u.value === fromUnit)?.label || fromUnit
            }`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${
              units.find((u) => u.value === toUnit)?.label || toUnit
            }`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 10 meters per second (m/s) to miles per hour (mph).",
        steps: [
          {
            label: "1",
            explanation:
              "Multiply 10 m/s by the conversion factor 2.23694 to get mph.",
          },
          {
            label: "2",
            explanation:
              "10 m/s × 2.23694 = 22.3694 mph, which is the equivalent speed.",
          },
        ],
        result: "10 m/s = 22.3694 mph",
      }}
      relatedCalculators={[
        {
          title: "Shoe Size: EU ↔ US ↔ UK",
          url: "/conversion/shoe-size-eu-us-uk",
          icon: "🔄",
        },
        { title: "Paper Size: A-series ↔ US", url: "/conversion/paper-size-a-series-us", icon: "📏" },
        { title: "Mass: kg ↔ lb ↔ oz", url: "/conversion/mass-kg-lb-oz", icon: "⚖️" },
        { title: "Volume: L ↔ mL ↔ gal ↔ oz", url: "/conversion/volume-l-ml-gal-oz", icon: "🌡️" },
        { title: "Angle: deg ↔ rad", url: "/conversion/angle-deg-rad", icon: "📐" },
        { title: "Bits: b ↔ kb ↔ Mb ↔ Gb", url: "/conversion/bits-b-kb-mb-gb", icon: "💾" },
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