import { useState, useMemo, useCallback } from "react";
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
  Sigma,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  FunctionSquare,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AngleConverterDegRadCalculator() {
  const [inputs, setInputs] = useState({
    angle: "",
    unit: "deg",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const angleRaw = inputs.angle.trim();
    const unit = inputs.unit;

    if (angleRaw === "") {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    // Validate numeric input
    const angleNum = Number(angleRaw);
    if (isNaN(angleNum)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid numeric angle.",
        formulaUsed: "",
      };
    }

    // Conversion logic
    // deg to rad: rad = deg × (π / 180)
    // rad to deg: deg = rad × (180 / π)
    let convertedValue: number;
    let label: string;
    let formulaUsed: string;

    if (unit === "deg") {
      convertedValue = angleNum * (Math.PI / 180);
      label = "Radians (rad)";
      formulaUsed = "Radians = Degrees × (π / 180)";
    } else {
      convertedValue = angleNum * (180 / Math.PI);
      label = "Degrees (°)";
      formulaUsed = "Degrees = Radians × (180 / π)";
    }

    // Format to 4 decimals
    const formattedValue = convertedValue.toFixed(4);

    return {
      value: formattedValue,
      label,
      subtext: `Converted from ${unit === "deg" ? "Degrees" : "Radians"}`,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between degrees and radians?",
      answer:
        "Degrees and radians are two units for measuring angles. Degrees divide a circle into 360 parts, while radians measure angles based on the radius of a circle, where 2π radians equal 360 degrees. Radians are commonly used in calculus and trigonometry due to their natural relationship with circle properties.",
    },
    {
      question: "Why is π used in angle conversion?",
      answer:
        "Pi (π) represents the ratio of a circle's circumference to its diameter. Since radians are defined based on the radius of a circle, π naturally appears in the conversion formulas between degrees and radians. Specifically, 180 degrees equals π radians, making π essential for accurate angle conversions.",
    },
    {
      question: "When should I use radians instead of degrees?",
      answer:
        "Radians are preferred in higher mathematics, especially calculus and trigonometry, because they simplify many formulas and derivatives involving trigonometric functions. Degrees are more intuitive for everyday use and basic geometry, but radians provide a more natural measure for mathematical analysis.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="angle" className="font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Enter Angle
          </Label>
          <Input
            id="angle"
            type="text"
            inputMode="decimal"
            pattern="[0-9.+-eE]*"
            placeholder="Enter angle value"
            value={inputs.angle}
            onChange={(e) => handleInputChange("angle", e.target.value)}
            aria-describedby="angle-desc"
            className="mt-1"
          />
          <p id="angle-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Numeric value of the angle to convert.
          </p>
        </div>

        <div>
          <Label htmlFor="unit" className="font-semibold flex items-center gap-2">
            <FunctionSquare className="w-5 h-5 text-blue-600" />
            Select Unit
          </Label>
          <Select
            value={inputs.unit}
            onValueChange={(value) => handleInputChange("unit", value)}
            aria-label="Select angle unit"
          >
            <SelectTrigger id="unit" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deg">Degrees (°)</SelectItem>
              <SelectItem value="rad">Radians (rad)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit calculation needed here since useMemo updates automatically
          }}
          aria-label="Calculate angle conversion"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ angle: "", unit: "deg" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
                </div>
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
          Understanding Angle Converter (deg ↔ rad)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Angles are fundamental in mathematics, physics, and engineering, representing the measure of rotation between two intersecting lines or planes. The two most common units for measuring angles are degrees and radians. Degrees divide a full circle into 360 equal parts, making it intuitive for everyday use and navigation. Radians, however, are based on the radius of a circle and provide a natural way to relate angles to arc lengths and trigonometric functions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This Angle Converter tool allows you to seamlessly convert between degrees and radians, ensuring precision up to four decimal places. Such conversions are essential in calculus, trigonometry, and physics, where radians simplify the differentiation and integration of trigonometric functions. Understanding and converting between these units enhances your ability to solve complex mathematical problems accurately.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use this tool to input any angle value and select its current unit. The converter will instantly provide the equivalent angle in the other unit, accompanied by the formula used for conversion. This ensures clarity and reinforces your understanding of the mathematical relationship between degrees and radians.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`// Degrees to Radians
radians = degrees × (π / 180)

// Radians to Degrees
degrees = radians × (180 / π)`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          When to Use Degrees vs Radians — and How to Convert
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Degrees and radians both measure the same thing — rotation angle — but suit different contexts. Degrees are intuitive for humans: a right angle is 90 degrees, a full rotation is 360. Radians are natural for mathematics and physics: a full rotation is 2*pi radians, and the radian measure of an arc equals the arc length divided by the radius. When you integrate or differentiate trigonometric functions, radian measure makes the derivatives clean: d/dx sin(x) = cos(x) only when x is in radians.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Engineering and programming almost exclusively use radians. Every math library — Python's math module, JavaScript's Math object, C's math.h — assumes radian input for sin(), cos(), and tan(). Passing degrees without converting is a common bug that produces wrong results that look plausible. For example, sin(90) in a radian-based function returns 0.894 (sin of 90 radians), not 1.0 (sin of 90 degrees). Always convert to radians before passing angle values to code.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The conversion formulas are simple: radians = degrees x pi/180; degrees = radians x 180/pi. Key reference points to memorize: 0 degrees = 0 rad, 30 degrees = pi/6 rad, 45 degrees = pi/4 rad, 60 degrees = pi/3 rad, 90 degrees = pi/2 rad, 180 degrees = pi rad, 360 degrees = 2*pi rad. These six values cover the majority of angles encountered in trigonometry and physics problems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Navigation and geodesy use degrees with decimal minutes or DMS (degrees, minutes, seconds) notation. GPS coordinates are expressed in decimal degrees: 40.7128 degrees N, 74.0060 degrees W for New York City. Converting between DMS and decimal degrees requires dividing minutes by 60 and seconds by 3600, then summing. This is distinct from the degree-to-radian conversion but often encountered alongside it in geospatial calculations.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Angle Converter (deg ↔ rad)"
      description="Convert angles between Degrees and Radians. Essential for calculus and trigonometry calculations."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `// Degrees to Radians
radians = degrees × (π / 180)

// Radians to Degrees
degrees = radians × (180 / π)`,
        variables: [
          { symbol: "degrees", description: "Angle in degrees" },
          { symbol: "radians", description: "Angle in radians" },
          { symbol: "π", description: "Mathematical constant Pi (≈ 3.1416)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Convert 90 degrees to radians using the converter.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 90 in the angle input field and select 'Degrees (°)' as the unit.",
          },
          {
            label: "2",
            explanation:
              "Click 'Calculate' to see the equivalent angle in radians.",
          },
          {
            label: "3",
            explanation:
              "The result will display 1.5708 radians, which is 90 × (π / 180).",
          },
        ],
        result: "1.5708 radians",
      }}
      relatedCalculators={[
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
        },
        {
          title: "Standard Deviation",
          url: "/math/standard-deviation-variance",
          icon: "📊",
        },
        {
          title: "Quadratic Equation Solver",
          url: "/math/quadratic-equation-solver",
          icon: "📐",
        },
        {
          title: "Percent of Total",
          url: "/math/percent-of-total",
          icon: "➗",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}