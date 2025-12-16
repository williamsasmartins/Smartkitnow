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
  { label: "Milliseconds (ms)", value: "ms", factor: 0.001 },
  { label: "Seconds (s)", value: "s", factor: 1 },
  { label: "Minutes (min)", value: "min", factor: 60 },
  { label: "Hours (hr)", value: "hr", factor: 3600 },
];

export default function TimeMsSMinHrCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("ms");
  const [toUnit, setToUnit] = useState("s");

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

    const from = units.find((u) => u.value === fromUnit);
    const to = units.find((u) => u.value === toUnit);
    if (!from || !to) {
      return {
        value: "",
        label: "Select valid units",
        formula: "Select units",
      };
    }

    // Convert input to seconds first, then to target unit
    const valueInSeconds = num * from.factor;
    const result = valueInSeconds / to.factor;

    // Format result with max 6 decimals, removing trailing zeros
    const formattedResult = parseFloat(result.toFixed(6)).toLocaleString(
      undefined,
      { maximumFractionDigits: 6 }
    );

    // Build formula text
    // 1 fromUnit = X toUnit
    // X = from.factor / to.factor
    const factor = from.factor / to.factor;
    const factorFormatted = parseFloat(factor.toFixed(9)).toLocaleString(
      undefined,
      { maximumFractionDigits: 9 }
    );

    const formulaText = `1 ${fromUnit} = ${factorFormatted} ${toUnit}`;

    return {
      value: formattedResult,
      label: `Result in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How accurate are the time conversions in this tool?",
      answer:
        "This conversion tool uses precise mathematical factors based on the universally accepted definitions of milliseconds, seconds, minutes, and hours. The calculations are done with up to nine decimal places internally to ensure high accuracy. However, displayed results are rounded for readability without sacrificing meaningful precision.",
    },
    {
      question: "Can I convert fractional time values like 1.5 minutes to seconds?",
      answer:
        "Absolutely! The converter accepts decimal numbers, allowing you to input fractional values such as 1.5 minutes. It will accurately convert these fractional inputs into the desired unit, providing precise results. This flexibility makes it suitable for scientific, engineering, or everyday timing needs.",
    },
    {
      question: "Why do I need to select both 'From' and 'To' units?",
      answer:
        "Selecting both 'From' and 'To' units defines the direction of the conversion, ensuring the tool knows exactly how to interpret your input and what output you expect. This explicit selection prevents ambiguity and guarantees that the conversion factor applied is correct. It also allows you to convert between any two supported units seamlessly.",
    },
    {
      question: "What should I do if the result shows 'Enter a value...' or 'Select units'?",
      answer:
        "These messages indicate that either the input value is missing or invalid, or the units have not been properly selected. To resolve this, please enter a valid numerical value in the input field and ensure both 'From' and 'To' units are chosen from the dropdown menus. Once all inputs are valid, the conversion result will be displayed automatically.",
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
            aria-label="Input value"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="mb-2 block text-slate-700 dark:text-slate-300">
              From
            </Label>
            <Select value={fromUnit} onValueChange={setFromUnit} aria-label="From unit">
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
            <Select value={toUnit} onValueChange={setToUnit} aria-label="To unit">
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
            // No extra action needed, result updates automatically
          }}
          aria-label="Convert button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Convert
        </Button>
        <Button
          variant="outline"
          onClick={() => setVal("")}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset button"
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
          Understanding Time: ms ↔ s ↔ min ↔ hr
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Time is a fundamental physical quantity that we measure in various units depending on the context and precision required. Milliseconds (ms), seconds (s), minutes (min), and hours (hr) are common units used in scientific, industrial, and everyday applications to quantify durations and intervals. Understanding how these units relate to each other allows for accurate conversions and meaningful interpretation of time-based data.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          One second is the base SI unit of time, defined by the vibrations of cesium atoms, and all other units are derived from it. A millisecond is one-thousandth of a second, a minute is sixty seconds, and an hour is sixty minutes or 3600 seconds. This hierarchical relationship makes conversions straightforward through multiplication or division by fixed factors.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert a time value, first enter the numerical amount in the input field labeled “Value.” Next, select the unit of the value you entered from the “From” dropdown menu, choosing between milliseconds, seconds, minutes, or hours. Then, select the desired output unit from the “To” dropdown menu, and the converted result will be displayed automatically below.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The conversion factor used is based on the exact relationships between these units, ensuring precise and reliable results. You can reset the input at any time using the “Reset” button to start a new conversion. This tool is ideal for scientific calculations, project planning, or any situation where accurate time conversions are necessary.
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
              1 second (s) = 1000 milliseconds (ms)
            </p>
            <p className="text-slate-500 text-sm">
              Since a millisecond is one-thousandth of a second, multiplying seconds by 1000 converts to milliseconds.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 minute (min) = 60 seconds (s)
            </p>
            <p className="text-slate-500 text-sm">
              One minute consists of sixty seconds, making it a standard unit for measuring longer durations.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 hour (hr) = 60 minutes (min) = 3600 seconds (s)
            </p>
            <p className="text-slate-500 text-sm">
              An hour is composed of sixty minutes or three thousand six hundred seconds, commonly used for scheduling and timekeeping.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Time: ms ↔ s ↔ min ↔ hr"
      description="Convert time durations easily. Transform milliseconds, seconds, minutes, and hours for scientific timing or project planning."
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
          "Convert 1500 milliseconds to seconds to understand how many seconds are in 1500 ms.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the input value (1500) and the units to convert from (milliseconds) and to (seconds).",
          },
          {
            label: "2",
            explanation:
              "Use the conversion factor: 1 second = 1000 milliseconds, so divide 1500 by 1000.",
          },
          {
            label: "3",
            explanation:
              "Calculate the result: 1500 ms ÷ 1000 = 1.5 seconds.",
          },
        ],
        result: "1.5 seconds",
      }}
      relatedCalculators={[
        {
          title: "Torque: N·m ↔ lbf·ft",
          url: "/conversion/torque-nm-lbfft",
          icon: "🔄",
        },
        {
          title: "Length: m ↔ ft ↔ in",
          url: "/conversion/length-m-ft-in",
          icon: "📏",
        },
        {
          title: "Power: W ↔ hp",
          url: "/conversion/power-w-hp",
          icon: "⚖️",
        },
        {
          title: "Clock Time & Timezone Shift",
          url: "/conversion/clock-time-timezone-shift",
          icon: "🌡️",
        },
        {
          title: "Frame Rate: fps ↔ Hz",
          url: "/conversion/frame-rate-fps-hz",
          icon: "📐",
        },
        {
          title: "Pressure: Pa ↔ bar ↔ psi",
          url: "/conversion/pressure-pa-bar-psi",
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