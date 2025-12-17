import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sigma,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PythagoreanTheoremSolverCalculator() {
  const [inputs, setInputs] = useState({
    sideA: "",
    sideB: "",
    sideC: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points, empty string allowed
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const aRaw = inputs.sideA.trim();
    const bRaw = inputs.sideB.trim();
    const cRaw = inputs.sideC.trim();

    const a = aRaw === "" ? null : Number(aRaw);
    const b = bRaw === "" ? null : Number(bRaw);
    const c = cRaw === "" ? null : Number(cRaw);

    // Count how many inputs are provided
    const providedCount = [a, b, c].filter((v) => v !== null).length;

    // Validate inputs: all positive numbers if provided
    if (
      (a !== null && (isNaN(a) || a <= 0)) ||
      (b !== null && (isNaN(b) || b <= 0)) ||
      (c !== null && (isNaN(c) || c <= 0))
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "All sides must be positive numbers.",
        formulaUsed: null,
      };
    }

    if (providedCount < 2) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please provide exactly two sides to calculate the third.",
        formulaUsed: null,
      };
    }

    if (providedCount > 2) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please provide only two sides to calculate the third.",
        formulaUsed: null,
      };
    }

    // Calculation logic:
    // Given two sides, calculate the third using a² + b² = c²
    // Cases:
    // 1) a and b given => c = sqrt(a² + b²)
    // 2) a and c given => b = sqrt(c² - a²) if c > a
    // 3) b and c given => a = sqrt(c² - b²) if c > b

    let calculatedValue: number | string = "";
    let label = "";
    let subtext = "";
    let warning = null;
    let formulaUsed = "";

    if (a !== null && b !== null && c === null) {
      // Calculate c
      calculatedValue = Math.sqrt(a * a + b * b);
      label = "Hypotenuse (c)";
      subtext = `Calculated using c = √(a² + b²) = √(${a.toFixed(4)}² + ${b.toFixed(
        4
      )}²)`;
      formulaUsed = "c = √(a² + b²)";
    } else if (a !== null && c !== null && b === null) {
      // Calculate b
      if (c <= a) {
        warning =
          "Hypotenuse (c) must be greater than leg (a) to calculate the other leg.";
        return { value: "", label: "", subtext: "", warning, formulaUsed: null };
      }
      const underRoot = c * c - a * a;
      if (underRoot < 0) {
        warning =
          "Invalid inputs: c² - a² is negative, no real solution for leg b.";
        return { value: "", label: "", subtext: "", warning, formulaUsed: null };
      }
      calculatedValue = Math.sqrt(underRoot);
      label = "Leg (b)";
      subtext = `Calculated using b = √(c² - a²) = √(${c.toFixed(4)}² - ${a.toFixed(
        4
      )}²)`;
      formulaUsed = "b = √(c² - a²)";
    } else if (b !== null && c !== null && a === null) {
      // Calculate a
      if (c <= b) {
        warning =
          "Hypotenuse (c) must be greater than leg (b) to calculate the other leg.";
        return { value: "", label: "", subtext: "", warning, formulaUsed: null };
      }
      const underRoot = c * c - b * b;
      if (underRoot < 0) {
        warning =
          "Invalid inputs: c² - b² is negative, no real solution for leg a.";
        return { value: "", label: "", subtext: "", warning, formulaUsed: null };
      }
      calculatedValue = Math.sqrt(underRoot);
      label = "Leg (a)";
      subtext = `Calculated using a = √(c² - b²) = √(${c.toFixed(4)}² - ${b.toFixed(
        4
      )}²)`;
      formulaUsed = "a = √(c² - b²)";
    } else {
      // Should not reach here
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Invalid combination of inputs.",
        formulaUsed: null,
      };
    }

    // Format result to 4 decimals
    if (typeof calculatedValue === "number") {
      calculatedValue = calculatedValue.toFixed(4);
    }

    return {
      value: calculatedValue,
      label,
      subtext,
      warning,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Pythagorean theorem used for?",
      answer:
        "The Pythagorean theorem is a fundamental principle in geometry that relates the lengths of the sides of a right triangle. It is used to calculate the length of one side when the other two are known, enabling solutions in various fields such as construction, navigation, and physics.",
    },
    {
      question: "Can the Pythagorean theorem be applied to any triangle?",
      answer:
        "No, the Pythagorean theorem applies exclusively to right-angled triangles. It states that the square of the hypotenuse (the side opposite the right angle) equals the sum of the squares of the other two sides. For non-right triangles, other rules like the Law of Cosines are used.",
    },
    {
      question: "What happens if the calculated value under the square root is negative?",
      answer:
        "If the value under the square root (the radicand) is negative, it means there is no real solution for the missing side length with the given inputs. This typically indicates that the inputs do not form a valid right triangle.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sideA" className="flex items-center gap-1 font-semibold">
            <FunctionSquare className="w-4 h-4 text-blue-600" />
            Side a (leg)
          </Label>
          <Input
            id="sideA"
            type="text"
            inputMode="decimal"
            placeholder="Enter side a"
            value={inputs.sideA}
            onChange={(e) => handleInputChange("sideA", e.target.value)}
            aria-describedby="sideA-help"
          />
          <p id="sideA-help" className="text-xs text-slate-500 mt-1">
            One leg of the right triangle.
          </p>
        </div>
        <div>
          <Label htmlFor="sideB" className="flex items-center gap-1 font-semibold">
            <FunctionSquare className="w-4 h-4 text-blue-600" />
            Side b (leg)
          </Label>
          <Input
            id="sideB"
            type="text"
            inputMode="decimal"
            placeholder="Enter side b"
            value={inputs.sideB}
            onChange={(e) => handleInputChange("sideB", e.target.value)}
            aria-describedby="sideB-help"
          />
          <p id="sideB-help" className="text-xs text-slate-500 mt-1">
            The other leg of the right triangle.
          </p>
        </div>
        <div>
          <Label htmlFor="sideC" className="flex items-center gap-1 font-semibold">
            <FunctionSquare className="w-4 h-4 text-blue-600" />
            Side c (hypotenuse)
          </Label>
          <Input
            id="sideC"
            type="text"
            inputMode="decimal"
            placeholder="Enter side c"
            value={inputs.sideC}
            onChange={(e) => handleInputChange("sideC", e.target.value)}
            aria-describedby="sideC-help"
          />
          <p id="sideC-help" className="text-xs text-slate-500 mt-1">
            The hypotenuse (longest side).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate Pythagorean theorem"
          type="button"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ sideA: "", sideB: "", sideC: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
          type="button"
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
          Understanding Pythagorean Theorem Solver
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Pythagorean theorem is a cornerstone of geometry, describing the
          relationship between the sides of a right triangle. It states that the
          square of the hypotenuse (the side opposite the right angle) equals the
          sum of the squares of the other two legs. This theorem allows us to
          calculate the length of any side when the other two are known, making it
          an essential tool in mathematics, engineering, and physics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This solver is designed to provide precise calculations for the missing
          side of a right triangle, given any two sides. By inputting values for
          any two sides, the tool applies the formula a² + b² = c² to find the
          unknown length, ensuring accuracy up to four decimal places.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          It is important to note that the Pythagorean theorem only applies to
          right-angled triangles. If the inputs do not satisfy the conditions of a
          valid right triangle, the solver will notify you with appropriate
          warnings to guide correct usage.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          {`a² + b² = c²

Where:
- a and b are the legs (shorter sides) of the right triangle.
- c is the hypotenuse (the longest side opposite the right angle).

To find the hypotenuse:
c = √(a² + b²)

To find a leg:
a = √(c² - b²) or b = √(c² - a²)

Note: c must be greater than the leg to have a real solution.`}
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
      title="Pythagorean Theorem Solver"
      description="Solve for the hypotenuse or legs of a right triangle. Use a² + b² = c² to find missing distances easily."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: "a² + b² = c²",
        variables: [
          { symbol: "a", description: "One leg of the right triangle" },
          { symbol: "b", description: "The other leg of the right triangle" },
          { symbol: "c", description: "Hypotenuse (longest side)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Given a right triangle with legs a = 3 and b = 4, find the hypotenuse c.",
        steps: [
          {
            label: "1",
            explanation:
              "Square both legs: 3² = 9 and 4² = 16.",
          },
          {
            label: "2",
            explanation:
              "Sum the squares: 9 + 16 = 25.",
          },
          {
            label: "3",
            explanation:
              "Take the square root of the sum: √25 = 5.",
          },
        ],
        result: "The hypotenuse c is 5.",
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