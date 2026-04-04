import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, Calculator, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CircleAreaCircumferenceCalculator() {
  // Inputs: radius, diameter, circumference, area
  // User can input any one of these to calculate others.
  // Priority: radius > diameter > circumference > area
  // If multiple inputs, use the first valid in priority order.

  const [inputs, setInputs] = useState({
    radius: "",
    diameter: "",
    circumference: "",
    area: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Accept only numbers and decimal points, empty string allowed
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const parsedInputs = useMemo(() => {
    return {
      radius: parseFloat(inputs.radius),
      diameter: parseFloat(inputs.diameter),
      circumference: parseFloat(inputs.circumference),
      area: parseFloat(inputs.area),
    };
  }, [inputs]);

  const results = useMemo(() => {
    const { radius, diameter, circumference, area } = parsedInputs;

    // Helper to format number to 4 decimals
    const fmt = (num: number) => num.toFixed(4);

    // Validate positive numbers
    const isPositive = (n: number) => !isNaN(n) && n > 0;

    // Determine which input to use based on priority
    // radius > diameter > circumference > area
    let usedInput = "";
    let r: number | null = null;
    let warning: string | null = null;

    if (isPositive(radius)) {
      r = radius;
      usedInput = "radius";
    } else if (isPositive(diameter)) {
      r = diameter / 2;
      usedInput = "diameter";
    } else if (isPositive(circumference)) {
      r = circumference / (2 * Math.PI);
      usedInput = "circumference";
    } else if (isPositive(area)) {
      if (area < 0) {
        warning = "Area cannot be negative.";
        r = null;
      } else {
        r = Math.sqrt(area / Math.PI);
        usedInput = "area";
      }
    } else {
      // No valid input
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    if (r === null || r <= 0 || isNaN(r)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Invalid input value. Please enter a positive number.",
        formulaUsed: "",
      };
    }

    // Calculate all values
    const calcDiameter = 2 * r;
    const calcCircumference = 2 * Math.PI * r;
    const calcArea = Math.PI * r * r;

    // Prepare result display based on input type
    // Show all results in subtext for clarity

    let mainValue = "";
    let mainLabel = "";
    let formulaUsed = "";
    const subtext = (
      <>
        Diameter: {fmt(calcDiameter)} units<br />
        Circumference: {fmt(calcCircumference)} units<br />
        Area: {fmt(calcArea)} square units
      </>
    );

    switch (usedInput) {
      case "radius":
        mainValue = fmt(r);
        mainLabel = "Radius";
        formulaUsed = "r = radius input";
        break;
      case "diameter":
        mainValue = fmt(calcDiameter);
        mainLabel = "Diameter";
        formulaUsed = "d = 2 × r";
        break;
      case "circumference":
        mainValue = fmt(calcCircumference);
        mainLabel = "Circumference";
        formulaUsed = "C = 2πr";
        break;
      case "area":
        mainValue = fmt(calcArea);
        mainLabel = "Area";
        formulaUsed = "A = πr²";
        break;
      default:
        mainValue = "";
        mainLabel = "";
        formulaUsed = "";
    }

    return {
      value: mainValue,
      label: mainLabel,
      subtext,
      warning,
      formulaUsed,
    };
  }, [parsedInputs]);

  const faqs = [
    {
      question: "How do I calculate the area of a circle?",
      answer:
        "To calculate the area of a circle, use the formula A = πr², where r is the radius. This formula multiplies the square of the radius by the constant π (approximately 3.1416). The result gives the space enclosed within the circle's boundary.",
    },
    {
      question: "What is the relationship between diameter and radius?",
      answer:
        "The diameter of a circle is twice the radius. Mathematically, d = 2r. The radius is the distance from the center to any point on the circle, while the diameter spans across the circle through its center.",
    },
    {
      question: "How can I find the circumference from the radius?",
      answer:
        "The circumference, or perimeter, of a circle is calculated by C = 2πr, where r is the radius. This formula gives the total length around the circle using the radius and the constant π.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="radius" className="flex items-center gap-1 font-semibold">
            <Calculator className="w-4 h-4" /> Radius (units)
          </Label>
          <Input
            id="radius"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 5"
            value={inputs.radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            aria-describedby="radius-desc"
          />
          <p id="radius-desc" className="text-xs text-slate-500 mt-1">
            Enter radius to calculate other values.
          </p>
        </div>
        <div>
          <Label htmlFor="diameter" className="flex items-center gap-1 font-semibold">
            <Calculator className="w-4 h-4" /> Diameter (units)
          </Label>
          <Input
            id="diameter"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 10"
            value={inputs.diameter}
            onChange={(e) => handleInputChange("diameter", e.target.value)}
            aria-describedby="diameter-desc"
          />
          <p id="diameter-desc" className="text-xs text-slate-500 mt-1">
            Enter diameter to calculate other values.
          </p>
        </div>
        <div>
          <Label htmlFor="circumference" className="flex items-center gap-1 font-semibold">
            <Calculator className="w-4 h-4" /> Circumference (units)
          </Label>
          <Input
            id="circumference"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 31.4159"
            value={inputs.circumference}
            onChange={(e) => handleInputChange("circumference", e.target.value)}
            aria-describedby="circumference-desc"
          />
          <p id="circumference-desc" className="text-xs text-slate-500 mt-1">
            Enter circumference to calculate other values.
          </p>
        </div>
        <div>
          <Label htmlFor="area" className="flex items-center gap-1 font-semibold">
            <Calculator className="w-4 h-4" /> Area (square units)
          </Label>
          <Input
            id="area"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 78.5398"
            value={inputs.area}
            onChange={(e) => handleInputChange("area", e.target.value)}
            aria-describedby="area-desc"
          />
          <p id="area-desc" className="text-xs text-slate-500 mt-1">
            Enter area to calculate other values.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting state to current inputs (noop)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate circle values"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              radius: "",
              diameter: "",
              circumference: "",
              area: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
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
          Understanding Circle Area / Circumference Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Circle Area / Circumference Calculator is a powerful mathematical tool designed to help you quickly find essential properties of a circle. By inputting any one of the key measurements—radius, diameter, circumference, or area—you can instantly compute the others with precision. This calculator leverages fundamental circle formulas and constants like π (Math.PI) to ensure accurate results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Circles are fundamental shapes in geometry, characterized by their radius (distance from center to edge), diameter (twice the radius), circumference (the perimeter), and area (the space enclosed). Understanding the relationships between these properties is crucial in fields ranging from engineering to physics and everyday problem-solving.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator is designed with professional accuracy and user-friendliness in mind. It validates inputs, handles decimal precision up to four places, and provides clear, formatted results. Whether you are a student, educator, or professional, this tool simplifies complex calculations and enhances your mathematical workflow.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Radius (r):
  r = radius input (if given)

Diameter (d):
  d = 2 × r

Circumference (C):
  C = 2 × π × r

Area (A):
  A = π × r²

Where π (pi) ≈ ${Math.PI.toFixed(4)}`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Circle Calculations in Design, Engineering, and Everyday Life
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The circle is nature's most efficient shape: for a given perimeter, a circle encloses the maximum area. This is why bubbles, cross-sections of pipes, and cell membranes are circular. In engineering, pipes and cables have circular cross-sections because the circular shape distributes internal pressure uniformly — no stress concentrations at corners. The area of a pipe cross-section (pi x r^2) determines its flow capacity for water, gas, or electrical current.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In construction, circular calculations arise in every trade. A concrete column 18 inches in diameter has a cross-sectional area of pi x 9^2 = 254.5 square inches. Cutting a circular hole in drywall, computing how much paint covers a circular feature wall, calculating the area of a round dining table to determine tablecloth size — all require pi x r^2. The circumference (2 x pi x r) gives the perimeter of a circular garden bed, the fencing length for a circular enclosure, or the wheel rotation distance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Pi (pi = 3.14159...) is irrational and transcendental, meaning it cannot be expressed as a fraction and is not the root of any polynomial with rational coefficients. For practical calculations, pi = 3.14159 provides accuracy to within 0.00001 percent, more than sufficient for any real-world measurement. The approximation 22/7 = 3.14286 is accurate to 0.04 percent — useful for quick mental estimates when a calculator is unavailable.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">FAQ</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Circle Area / Circumference Calculator"
      description="Calculate circle metrics. Find the area, circumference, radius, and diameter of a circle instantly."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formulas",
        formula: `r = radius
d = 2 × r
C = 2 × π × r
A = π × r²`,
        variables: [
          { symbol: "r", description: "Radius of the circle" },
          { symbol: "d", description: "Diameter of the circle" },
          { symbol: "C", description: "Circumference (perimeter) of the circle" },
          { symbol: "A", description: "Area enclosed by the circle" },
          { symbol: "π", description: "Mathematical constant Pi (≈ 3.1416)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Suppose you know the diameter of a circle is 10 units, and you want to find its area and circumference.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the radius by dividing the diameter by 2: r = 10 / 2 = 5 units.",
          },
          {
            label: "2",
            explanation:
              "Calculate the circumference using C = 2πr = 2 × 3.1416 × 5 ≈ 31.4159 units.",
          },
          {
            label: "3",
            explanation:
              "Calculate the area using A = πr² = 3.1416 × 5² = 3.1416 × 25 ≈ 78.5398 square units.",
          },
        ],
        result:
          "The circle has a radius of 5 units, circumference approximately 31.4159 units, and area approximately 78.5398 square units.",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
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