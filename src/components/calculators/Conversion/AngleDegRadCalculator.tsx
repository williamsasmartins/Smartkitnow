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

export default function AngleDegRadCalculator() {
  // 1. STATE (CONVERTER PATTERN)
  // Units: degrees (deg), radians (rad)
  const [val, setVal] = useState("");
  const [fromUnit, setFromUnit] = useState("deg");
  const [toUnit, setToUnit] = useState("rad");

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        value: 0,
        label: "Enter a valid number...",
        formula: "",
      };
    }

    let result = 0;
    let formulaText = "";

    // Conversion logic between degrees and radians
    // deg to rad: rad = deg * (π / 180)
    // rad to deg: deg = rad * (180 / π)
    const pi = Math.PI;

    if (fromUnit === toUnit) {
      result = num;
      formulaText = `1 ${fromUnit} = 1 ${toUnit}`;
    } else if (fromUnit === "deg" && toUnit === "rad") {
      result = num * (pi / 180);
      formulaText = `1 deg = π/180 rad ≈ ${(
        pi / 180
      ).toFixed(6)} rad`;
    } else if (fromUnit === "rad" && toUnit === "deg") {
      result = num * (180 / pi);
      formulaText = `1 rad = 180/π deg ≈ ${(
        180 / pi
      ).toFixed(6)} deg`;
    } else {
      // fallback (should not happen)
      result = 0;
      formulaText = "";
    }

    return {
      value: result.toLocaleString("en-US", {
        maximumFractionDigits: 6,
      }),
      label: `Result in ${toUnit}`,
      formula: formulaText,
    };
  }, [val, fromUnit, toUnit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between degrees and radians?",
      answer:
        "Degrees and radians are two units for measuring angles. Degrees divide a circle into 360 parts, while radians measure angles based on the radius of a circle, where one full circle equals 2π radians.",
    },
    {
      question: "Why use radians instead of degrees?",
      answer:
        "Radians are preferred in higher mathematics and physics because they simplify many formulas, especially in calculus and trigonometry, due to their natural relationship with the circle's radius.",
    },
    {
      question: "How do I convert degrees to radians manually?",
      answer:
        "To convert degrees to radians, multiply the degree value by π/180. For example, 90 degrees × π/180 = π/2 radians.",
    },
    {
      question: "Can I convert radians back to degrees?",
      answer:
        "Yes, to convert radians to degrees, multiply the radian value by 180/π. For example, π/2 radians × 180/π = 90 degrees.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* INPUT SECTION */}
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
            aria-label="Input value"
          />
        </div>

        {/* Unit Selectors */}
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
            <Select value={toUnit} onValueChange={setToUnit} aria-label="To unit">
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
      {val !== "" && !isNaN(parseFloat(val)) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Converted Value
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
          Understanding Angle: deg ↔ rad Conversion
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Angles are fundamental in mathematics, physics, and engineering, and
          they can be measured in different units. The two most common units
          for measuring angles are degrees and radians. Degrees divide a full
          circle into 360 equal parts, making it intuitive for everyday use.
          Radians, on the other hand, relate the angle directly to the radius
          of a circle, providing a natural and mathematically elegant way to
          measure angles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The radian measure is defined as the length of the arc subtended by
          the angle divided by the radius of the circle. This makes radians
          especially useful in calculus and trigonometry, where many formulas
          and functions are simpler and more natural when angles are expressed
          in radians.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding how to convert between degrees and radians is essential
          for students, engineers, and scientists. This converter provides a
          precise and easy way to switch between these units, ensuring accuracy
          in calculations and a deeper comprehension of angular measurements.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To convert an angle, enter the numeric value in the "Value" input
          field. Then select the unit you want to convert from ("From") and the
          unit you want to convert to ("To"). The converter supports degrees
          and radians. Click the "Convert" button to see the result displayed
          below along with the conversion factor used.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          You can reset the input at any time by clicking the "Reset" button.
          This tool is designed to be intuitive and precise, helping you
          quickly switch between degrees and radians for your calculations.
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
              1 degree (deg) = π/180 radians (rad) ≈ 0.017453 radians
            </p>
            <p className="text-slate-500 text-sm">
              Degrees to radians conversion factor. Multiply degrees by π/180
              to get radians.
            </p>
          </li>
          <li className="block">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1 radian (rad) = 180/π degrees (deg) ≈ 57.2958 degrees
            </p>
            <p className="text-slate-500 text-sm">
              Radians to degrees conversion factor. Multiply radians by 180/π
              to get degrees.
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
      // DYNAMIC FORMULA
      formula={{
        title: "Conversion Formula",
        formula: results.formula || "Select units to see formula",
        variables: [{ symbol: "x", description: "Input Value" }],
      }}
      example={{
        title: "Example Conversion",
        scenario:
          "Convert 90 degrees to radians using the converter.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 90 in the Value input field.",
          },
          {
            label: "2",
            explanation:
              'Set "From" unit to Degrees (deg) and "To" unit to Radians (rad).',
          },
          {
            label: "3",
            explanation:
              "Click Convert to see the result: 90 × π/180 = π/2 ≈ 1.5708 radians.",
          },
        ],
        result: "1.5708 radians",
      }}
      relatedCalculators={[
        {
          title: "Temperature: °C ↔ °F ↔ K",
          url: "/conversion/temperature-c-f-k",
          icon: "🌡️",
        },
        {
          title: "Speed: m/s ↔ km/h ↔ mph",
          url: "/conversion/speed-mps-kmph-mph",
          icon: "📏",
        },
        {
          title: "Length: m ↔ ft ↔ in",
          url: "/conversion/length-m-ft-in",
          icon: "📏",
        },
        {
          title: "Bytes: B ↔ kB ↔ MB ↔ GB ↔ TB",
          url: "/conversion/bytes-b-kb-mb-gb-tb",
          icon: "💾",
        },
        {
          title: "Time: ms ↔ s ↔ min ↔ hr",
          url: "/conversion/time-ms-s-min-hr",
          icon: "📐",
        },
        {
          title: "Clock Time & Timezone Shift",
          url: "/conversion/clock-time-timezone-shift",
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