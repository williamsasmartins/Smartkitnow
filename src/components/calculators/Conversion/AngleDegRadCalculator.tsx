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

export default function AngleDegRadCalculator() {
  // 1. STATE
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("deg");
  const [toUnit, setToUnit] = useState("rad");

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

    // Conversion factors
    // 1 deg = π/180 rad
    // 1 rad = 180/π deg
    let result = 0;
    let formulaText = "";

    if (fromUnit === toUnit) {
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else if (fromUnit === "deg" && toUnit === "rad") {
      result = (num * Math.PI) / 180;
      formulaText = `1 deg = π/180 rad ≈ 0.0174533 rad`;
    } else if (fromUnit === "rad" && toUnit === "deg") {
      result = (num * 180) / Math.PI;
      formulaText = `1 rad = 180/π deg ≈ 57.2958 deg`;
    }

    return {
      value: result.toLocaleString(undefined, {
        maximumFractionDigits: 8,
      }),
      label: `Value in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between degrees and radians?",
      answer:
        "Degrees and radians are two units used to measure angles. Degrees divide a circle into 360 equal parts, while radians measure angles based on the radius of a circle, where one full circle equals 2π radians. Understanding both units is essential for various mathematical and engineering applications.",
    },
    {
      question: "Why is π involved in converting degrees to radians?",
      answer:
        "The constant π (pi) represents the ratio of a circle's circumference to its diameter, approximately 3.14159. Since radians are defined based on the radius of a circle, π naturally appears in the conversion formulas to relate degrees to radians. This relationship ensures precise and consistent angle measurements across different units.",
    },
    {
      question: "When should I use degrees versus radians?",
      answer:
        "Degrees are commonly used in everyday contexts, such as navigation, construction, and basic geometry, because they are intuitive and easy to visualize. Radians are preferred in higher mathematics, physics, and engineering because they simplify many formulas, especially those involving trigonometric functions and calculus. Choosing the appropriate unit depends on the specific application and context.",
    },
    {
      question: "How can I ensure accuracy when converting between degrees and radians?",
      answer:
        "To maintain accuracy, use precise values of π and avoid rounding intermediate results prematurely. This converter tool uses high-precision calculations and displays results with up to eight decimal places to minimize errors. Additionally, always double-check your input values and units before performing conversions to ensure correctness.",
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
            inputMode="decimal"
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
                <SelectItem value="deg">Degrees (deg)</SelectItem>
                <SelectItem value="rad">Radians (rad)</SelectItem>
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
                <SelectItem value="deg">Degrees (deg)</SelectItem>
                <SelectItem value="rad">Radians (rad)</SelectItem>
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
            // Just triggers recalculation, no extra action needed
            if (val.trim() === "") setVal("");
            else setVal(val);
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
      {val.trim() !== "" && !isNaN(parseFloat(val)) && (
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
          Understanding Angle: deg ↔ rad
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Angles are fundamental in mathematics, physics, and engineering, and they can be measured in various units. Degrees and radians are the most commonly used units for measuring angles, each with its own advantages and applications. This converter helps you seamlessly switch between these two units with precision and ease.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          A degree divides a circle into 360 equal parts, making it intuitive for everyday use and navigation. On the other hand, radians relate an angle to the radius of a circle, providing a natural measure that simplifies many mathematical formulas, especially in calculus and trigonometry. Understanding how to convert between degrees and radians is essential for accurate calculations in science and engineering.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert an angle, enter the numerical value in the input field and select the unit you are converting from using the first dropdown menu. Then, choose the unit you want to convert to from the second dropdown menu. Click the "Convert" button to see the precise converted value along with the conversion factor used.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input at any time by clicking the "Reset" button, which clears the input field and allows you to start a new conversion. The converter supports decimal values for high precision and displays results with up to eight decimal places. This tool is designed to be user-friendly and accurate for all your angle conversion needs.
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
              Degrees to Radians
            </p>
            <p className="text-slate-500 text-sm">
              1 degree (deg) = π/180 radians (rad) ≈ 0.0174533 rad
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Radians to Degrees
            </p>
            <p className="text-slate-500 text-sm">
              1 radian (rad) = 180/π degrees (deg) ≈ 57.2958 deg
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Angle: deg ↔ rad"
      description="Convert angles between degrees and radians. Essential tool for trigonometry, geometry, and engineering calculations."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ FIX: VARIABLES MUST NOT BE EMPTY
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units and enter a number",
        variables: [
          {
            symbol: "Input",
            description: `Value in ${fromUnit === "deg" ? "degrees (deg)" : "radians (rad)"}`,
          },
          {
            symbol: "Result",
            description: `Value converted to ${toUnit === "deg" ? "degrees (deg)" : "radians (rad)"}`,
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Convert 90 degrees to radians to find the equivalent angle in radians.",
        steps: [
          {
            label: "1",
            explanation:
              "Start with the value 90 degrees. Use the conversion factor 1 deg = π/180 rad.",
          },
          {
            label: "2",
            explanation:
              "Multiply 90 by π/180 to get the value in radians: 90 × π/180 = π/2 ≈ 1.5708 rad.",
          },
          {
            label: "3",
            explanation:
              "Thus, 90 degrees is equivalent to approximately 1.5708 radians.",
          },
        ],
        result: "1.5708 rad",
      }}
      relatedCalculators={[
        { title: "Force: N ↔ lbf", url: "/conversion/force-n-lbf", icon: "🔄" },
        { title: "Power: W ↔ hp", url: "/conversion/power-w-hp", icon: "📏" },
        {
          title: "Frequency: Hz ↔ kHz ↔ MHz",
          url: "/conversion/frequency-hz-khz-mhz",
          icon: "⚖️",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "🌡️",
        },
        {
          title: "Clock Time & Timezone Shift",
          url: "/conversion/clock-time-timezone-shift",
          icon: "📐",
        },
        { title: "Mass: kg ↔ lb ↔ oz", url: "/conversion/mass-kg-lb-oz", icon: "⚖️" },
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