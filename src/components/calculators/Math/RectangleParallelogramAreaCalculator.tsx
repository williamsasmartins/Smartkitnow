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

export default function RectangleParallelogramAreaCalculator() {
  const [inputs, setInputs] = useState({
    shape: "rectangle",
    base: "",
    height: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const baseNum = parseFloat(inputs.base);
    const heightNum = parseFloat(inputs.height);
    const shape = inputs.shape;

    if (
      isNaN(baseNum) ||
      isNaN(heightNum) ||
      baseNum <= 0 ||
      heightNum <= 0 ||
      (shape !== "rectangle" && shape !== "parallelogram")
    ) {
      return {
        value: 0,
        label: "",
        subtext: null,
        warning:
          baseNum <= 0 || heightNum <= 0
            ? "Base and height must be positive numbers."
            : null,
        formulaUsed: null,
      };
    }

    // Area = base * height for both rectangle and parallelogram
    const area = baseNum * heightNum;

    return {
      value: area.toFixed(4),
      label: `Area of the ${shape}`,
      subtext:
        "Area is calculated as base multiplied by height. Units squared.",
      warning: null,
      formulaUsed: "Area = base × height",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between a rectangle and a parallelogram?",
      answer:
        "A rectangle is a parallelogram with four right angles, meaning all angles are 90 degrees. A parallelogram has opposite sides parallel but angles can be oblique. Both share the same area formula: base multiplied by height.",
    },
    {
      question: "Why is the height important in calculating the area of a parallelogram?",
      answer:
        "The height is the perpendicular distance from the base to the opposite side. It ensures the area calculation accounts for the slant of the sides in a parallelogram, unlike just the side length.",
    },
    {
      question: "Can I use this calculator for squares?",
      answer:
        "Yes. Since a square is a special type of rectangle with equal sides, you can input the side length as both base and height to find its area.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Shape Selector */}
      <div>
        <Label htmlFor="shape" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Select Shape
        </Label>
        <Select
          value={inputs.shape}
          onValueChange={(value) => handleInputChange("shape", value)}
          id="shape"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select shape" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rectangle" className="flex items-center gap-2">
              <FunctionSquare className="w-4 h-4" /> Rectangle
            </SelectItem>
            <SelectItem value="parallelogram" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Parallelogram
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Base Input */}
      <div>
        <Label htmlFor="base" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Base (b)
        </Label>
        <Input
          id="base"
          type="number"
          min="0"
          step="any"
          placeholder="Enter base length"
          value={inputs.base}
          onChange={(e) => handleInputChange("base", e.target.value)}
          aria-describedby="base-desc"
        />
        <p id="base-desc" className="text-sm text-slate-500 mt-1">
          Length of the base side (units).
        </p>
      </div>

      {/* Height Input */}
      <div>
        <Label htmlFor="height" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Height (h)
        </Label>
        <Input
          id="height"
          type="number"
          min="0"
          step="any"
          placeholder="Enter height"
          value={inputs.height}
          onChange={(e) => handleInputChange("height", e.target.value)}
          aria-describedby="height-desc"
        />
        <p id="height-desc" className="text-sm text-slate-500 mt-1">
          Perpendicular height from base (units).
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate area"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              shape: "rectangle",
              base: "",
              height: "",
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {results.warning}
                  </p>
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
          Understanding Rectangle &amp; Parallelogram Area Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The area of a rectangle or parallelogram is a fundamental concept in
          geometry, representing the amount of two-dimensional space enclosed
          within the shape. Both shapes share the same formula for area
          calculation: multiplying the base length by the height. However, the
          height in a parallelogram is the perpendicular distance from the base
          to the opposite side, which may differ from the side length due to
          the slant.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator provides a precise and easy way to compute the area by
          entering the base and height values. It supports both rectangles,
          which have right angles, and parallelograms, which may have oblique
          angles but maintain parallel opposite sides. The result is displayed
          with four decimal places for accuracy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are a student solving homework problems, a professional
          working in construction, or simply curious about geometry, this tool
          offers a reliable and authoritative solution for area calculations.
          Understanding these concepts is essential for further studies in
          mathematics and practical applications in various fields.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          {`Area = base × height

Where:
- base (b) is the length of the base side.
- height (h) is the perpendicular distance from the base to the opposite side.

For rectangles, height is the length of the side perpendicular to the base.
For parallelograms, height is the perpendicular height, not the side length.`}
        </pre>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          FAQ
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rectangle & Parallelogram Area Calculator"
      description="Calculate the area of rectangles and parallelograms. Find the surface area and perimeter for construction or homework."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: "Area = base × height",
        variables: [
          { symbol: "base (b)", description: "Length of the base side" },
          { symbol: "height (h)", description: "Perpendicular height from base" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the area of a parallelogram with a base of 8 units and a height of 5 units.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the base (b = 8) and height (h = 5) values.",
          },
          {
            label: "2",
            explanation:
              "Apply the formula: Area = base × height = 8 × 5.",
          },
          {
            label: "3",
            explanation: "Multiply to get the area: 40 units².",
          },
        ],
        result: "The area of the parallelogram is 40.0000 square units.",
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