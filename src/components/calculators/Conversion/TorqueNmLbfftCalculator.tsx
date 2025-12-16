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

const UNITS = [
  { label: "Newton-meter (N·m)", value: "Nm" },
  { label: "Pound-foot (lbf·ft)", value: "lbf·ft" },
];

// Conversion factors:
// 1 N·m = 0.737562149 lbf·ft
// 1 lbf·ft = 1.35581795 N·m
const FACTOR_NM_TO_LBFFT = 0.737562149;
const FACTOR_LBFFT_TO_NM = 1.35581795;

export default function TorqueNmLbfftCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("Nm");
  const [toUnit, setToUnit] = useState("lbf·ft");

  // 2. LOGIC
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: "",
        label: "Enter a valid number",
        formula: "Select units and enter a numeric value",
      };
    }
    if (fromUnit === toUnit) {
      return {
        value: num.toLocaleString(undefined, { maximumFractionDigits: 6 }),
        label: `Value in ${toUnit} (no conversion needed)`,
        formula: `1 ${fromUnit} = 1 ${toUnit}`,
      };
    }

    let resultNum = 0;
    let formulaText = "";

    if (fromUnit === "Nm" && toUnit === "lbf·ft") {
      resultNum = num * FACTOR_NM_TO_LBFFT;
      formulaText = `1 N·m = ${FACTOR_NM_TO_LBFFT.toFixed(6)} lbf·ft`;
    } else if (fromUnit === "lbf·ft" && toUnit === "Nm") {
      resultNum = num * FACTOR_LBFFT_TO_NM;
      formulaText = `1 lbf·ft = ${FACTOR_LBFFT_TO_NM.toFixed(6)} N·m`;
    } else {
      // fallback (should not happen)
      resultNum = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    }

    return {
      value: resultNum.toLocaleString(undefined, { maximumFractionDigits: 6 }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is torque and why is it measured in N·m or lbf·ft?",
      answer:
        "Torque is a measure of the rotational force applied to an object, such as a bolt or a shaft. It quantifies how much twisting force is being exerted, which is crucial in mechanical applications to ensure proper tightness and function. Newton-meters (N·m) and pound-feet (lbf·ft) are standard units used internationally to express torque values, with N·m being metric and lbf·ft used primarily in the United States.",
    },
    {
      question: "How accurate is the conversion between N·m and lbf·ft?",
      answer:
        "The conversion between Newton-meters and pound-feet is based on a fixed mathematical factor derived from the relationship between the metric and imperial systems. This factor is highly precise and widely accepted in engineering and metrology standards. However, slight rounding differences may occur depending on decimal precision, but these are negligible for most practical applications.",
    },
    {
      question: "When should I use N·m versus lbf·ft in torque measurements?",
      answer:
        "The choice between N·m and lbf·ft depends largely on regional standards and the equipment specifications you are working with. Metric countries and industries typically use Newton-meters, while the United States and some other countries prefer pound-feet. It is important to use the unit specified by the manufacturer or engineering guidelines to ensure safety and accuracy.",
    },
    {
      question: "Can I convert torque values directly without considering other factors?",
      answer:
        "Yes, torque values can be directly converted between N·m and lbf·ft using the fixed conversion factors provided, as torque is a straightforward physical quantity. However, ensure that the torque measurement context (such as static vs dynamic torque) and units are consistent. For specialized applications, other factors like temperature or material properties might influence torque requirements but do not affect the unit conversion itself.",
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
            min="0"
            step="any"
            aria-label="Torque value input"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">From</Label>
            <Select value={fromUnit} onValueChange={setFromUnit} aria-label="From unit selector">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ArrowRightLeft className="mb-3 text-slate-400" aria-hidden="true" />
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">To</Label>
            <Select value={toUnit} onValueChange={setToUnit} aria-label="To unit selector">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map(({ label, value }) => (
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
            // Conversion happens automatically on input change, so no action needed here.
          }}
          aria-label="Convert torque units"
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset input and selections"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {val !== "" && !isNaN(parseFloat(val)) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
          Understanding Torque: N·m ↔ lbf·ft
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Torque is a fundamental physical quantity that measures the tendency of a force to rotate an object about an axis, fulcrum, or pivot. It is essential in many engineering and mechanical contexts, such as tightening bolts or operating machinery, where precise rotational force is critical. The two most common units for torque are Newton-meters (N·m), used in the metric system, and pound-feet (lbf·ft), used primarily in the imperial system.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Converting between these units allows engineers and mechanics to work seamlessly across different measurement systems, ensuring accuracy and safety. Understanding the relationship between N·m and lbf·ft is crucial for interpreting torque specifications and applying the correct force. This converter provides a reliable and precise way to switch between these units effortlessly.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Converter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert torque values, simply enter the numeric value in the input field labeled "Value." Then, select the unit you are converting from in the "From" dropdown and the unit you want to convert to in the "To" dropdown. The converted result will display automatically below, along with the conversion factor used for transparency and verification.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input and selections at any time using the Reset button to start a new conversion. This tool is designed to be intuitive and precise, making it suitable for professionals and hobbyists alike who need accurate torque conversions. Remember that selecting the correct units is essential for meaningful results.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
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
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Newton-meters to Pound-feet
            </p>
            <p className="text-slate-500 text-sm">
              1 N·m = 0.737562 lbf·ft
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Pound-feet to Newton-meters
            </p>
            <p className="text-slate-500 text-sm">
              1 lbf·ft = 1.355818 N·m
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Torque: N·m ↔ lbf·ft"
      description="Convert torque settings. Switch between Newton-meters (Nm) and pound-feet (lb-ft) for automotive and machinery mechanics."
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
            description: `Equivalent value in ${toUnit} (the unit you are converting to)`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "You have a torque wrench set to 50 N·m and want to know the equivalent torque in lbf·ft.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the input value and units: 50 N·m.",
          },
          {
            label: "2",
            explanation:
              `Use the conversion factor: 1 N·m = 0.737562 lbf·ft.`,
          },
          {
            label: "3",
            explanation:
              "Multiply the input value by the factor: 50 × 0.737562 = 36.8781 lbf·ft.",
          },
        ],
        result: "50 N·m is equivalent to approximately 36.8781 lbf·ft.",
      }}
      relatedCalculators={[
        {
          title: "Fuel Economy: L/100km ↔ mpg",
          url: "/conversion/fuel-economy-l-per-100km-mpg",
          icon: "🔄",
        },
        {
          title: "Currency: FX quick convert",
          url: "/conversion/currency-fx-quick-convert",
          icon: "📏",
        },
        {
          title: "Period ↔ Frequency",
          url: "/conversion/period-frequency",
          icon: "⚖️",
        },
        {
          title: "Checksum & Hash Quick Tools",
          url: "/conversion/checksum-hash-quick-tools",
          icon: "🌡️",
        },
        {
          title: "Compression Ratio & Size",
          url: "/conversion/compression-ratio-size",
          icon: "📐",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
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