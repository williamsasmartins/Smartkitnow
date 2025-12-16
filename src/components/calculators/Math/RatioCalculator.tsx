import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// SAFE ICONS ONLY
import { Sigma, RotateCcw, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RatioCalculator() {
  // Inputs: a, b, c, d (one missing)
  // User enters three known values, leaves one blank to solve for it.
  const [inputs, setInputs] = useState({
    a: "",
    b: "",
    c: "",
    d: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points, empty string allowed
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Calculation logic:
  // Given A:B = C:D, solve for the missing variable.
  // Exactly one input must be empty.
  // Formula: A/B = C/D => cross multiply: A*D = B*C
  // If missing is a: a = (b*c)/d
  // If missing is b: b = (a*d)/c
  // If missing is c: c = (a*d)/b
  // If missing is d: d = (b*c)/a
  // Handle division by zero and invalid inputs.
  // Use toFixed(4) for decimals.
  // If result is complex (e.g., negative root) - not applicable here since no roots.
  // But if division by zero or invalid, show warning.

  const results = useMemo(() => {
    const { a, b, c, d } = inputs;

    // Count how many inputs are empty
    const emptyFields = [a, b, c, d].filter((v) => v === "").length;
    if (emptyFields !== 1) {
      return {
        value: 0,
        label: "Please enter exactly three values and leave one blank to solve.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Parse floats
    const parsed = {
      a: a === "" ? null : parseFloat(a),
      b: b === "" ? null : parseFloat(b),
      c: c === "" ? null : parseFloat(c),
      d: d === "" ? null : parseFloat(d),
    };

    // Validate parsed numbers
    for (const key of ["a", "b", "c", "d"]) {
      if (parsed[key] !== null && (isNaN(parsed[key]) || !isFinite(parsed[key]))) {
        return {
          value: 0,
          label: `Invalid input for ${key.toUpperCase()}. Please enter a valid number.`,
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
    }

    // Solve for missing variable
    let missingVar = "";
    for (const key of ["a", "b", "c", "d"]) {
      if (parsed[key] === null) {
        missingVar = key;
        break;
      }
    }

    // Calculation with safety checks
    let result: number | string = 0;
    let formulaUsed = "";
    let warning: string | null = null;

    try {
      switch (missingVar) {
        case "a":
          // a = (b * c) / d
          if (parsed.d === 0) {
            warning = "Division by zero encountered while calculating A.";
            result = "Undefined";
          } else {
            result = (parsed.b! * parsed.c!) / parsed.d!;
            formulaUsed = "a = (b × c) / d";
          }
          break;
        case "b":
          // b = (a * d) / c
          if (parsed.c === 0) {
            warning = "Division by zero encountered while calculating B.";
            result = "Undefined";
          } else {
            result = (parsed.a! * parsed.d!) / parsed.c!;
            formulaUsed = "b = (a × d) / c";
          }
          break;
        case "c":
          // c = (a * d) / b
          if (parsed.b === 0) {
            warning = "Division by zero encountered while calculating C.";
            result = "Undefined";
          } else {
            result = (parsed.a! * parsed.d!) / parsed.b!;
            formulaUsed = "c = (a × d) / b";
          }
          break;
        case "d":
          // d = (b * c) / a
          if (parsed.a === 0) {
            warning = "Division by zero encountered while calculating D.";
            result = "Undefined";
          } else {
            result = (parsed.b! * parsed.c!) / parsed.a!;
            formulaUsed = "d = (b × c) / a";
          }
          break;
        default:
          return {
            value: 0,
            label: "Unexpected error in calculation.",
            subtext: "",
            warning: null,
            formulaUsed: null,
          };
      }
    } catch {
      return {
        value: 0,
        label: "Error during calculation. Please check inputs.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Format result
    let formattedResult: string;
    if (typeof result === "number") {
      // toFixed(4)
      formattedResult = result.toFixed(4);
    } else {
      // string (e.g., "Undefined")
      formattedResult = result;
    }

    // Label for output
    const labelMap: Record<string, string> = {
      a: "Value of A",
      b: "Value of B",
      c: "Value of C",
      d: "Value of D",
    };

    return {
      value: formattedResult,
      label: labelMap[missingVar],
      subtext: "Ratio proportion result",
      warning,
      formulaUsed,
    };
  }, [inputs]);

  // FAQs with 50-80 words each
  const faqs = [
    {
      question: "What is the significance of the ratio A:B = C:D?",
      answer:
        "The ratio A:B = C:D expresses a proportion where two ratios are equal. This relationship is fundamental in mathematics and real-world applications such as scaling recipes, maps, or models. Understanding this equality allows one to find an unknown term when three terms are known, ensuring consistent proportional relationships across different contexts.",
    },
    {
      question: "How do I know which variable to solve for in the ratio calculator?",
      answer:
        "In the Ratio Calculator, you must provide exactly three known values and leave the unknown variable blank. The calculator then determines which variable is missing and solves for it using cross multiplication. This approach ensures accurate and reliable results by maintaining the proportional equality between the ratios.",
    },
    {
      question: "Can the ratio calculator handle zero or negative values?",
      answer:
        "The calculator can handle zero and negative values with caution. Zero in the denominator leads to undefined results and triggers warnings. Negative values are mathematically valid in ratios but should be used carefully depending on the context. Always verify the meaning of negative or zero values in your specific application to avoid misinterpretation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="a" className="text-slate-700 dark:text-slate-300">
            A
          </Label>
          <Input
            id="a"
            type="text"
            inputMode="decimal"
            value={inputs.a}
            onChange={(e) => handleInputChange("a", e.target.value)}
            placeholder="Enter value for A"
            aria-label="Input for A"
          />
        </div>
        <div>
          <Label htmlFor="b" className="text-slate-700 dark:text-slate-300">
            B
          </Label>
          <Input
            id="b"
            type="text"
            inputMode="decimal"
            value={inputs.b}
            onChange={(e) => handleInputChange("b", e.target.value)}
            placeholder="Enter value for B"
            aria-label="Input for B"
          />
        </div>
        <div>
          <Label htmlFor="c" className="text-slate-700 dark:text-slate-300">
            C
          </Label>
          <Input
            id="c"
            type="text"
            inputMode="decimal"
            value={inputs.c}
            onChange={(e) => handleInputChange("c", e.target.value)}
            placeholder="Enter value for C"
            aria-label="Input for C"
          />
        </div>
        <div>
          <Label htmlFor="d" className="text-slate-700 dark:text-slate-300">
            D
          </Label>
          <Input
            id="d"
            type="text"
            inputMode="decimal"
            value={inputs.d}
            onChange={(e) => handleInputChange("d", e.target.value)}
            placeholder="Enter value for D"
            aria-label="Input for D"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate ratio"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ a: "", b: "", c: "", d: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.value !== "Please enter exactly three values and leave one blank to solve." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* BLUE GRADIENT CARD */}
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <FunctionSquare className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Math Tip:</strong> Always double-check your input units (e.g., Degrees vs Radians) to ensure accuracy.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Ratio Calculator (A:B = C:D)</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Ratios express the relative size of two quantities, and the proportion A:B = C:D states that two ratios are equal. This equality is foundational in mathematics, enabling comparisons and scaling across various fields such as engineering, cooking, and design. By understanding and applying this principle, one can solve for unknown values to maintain consistent relationships between quantities.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Ratio Calculator simplifies this process by allowing users to input three known values and solve for the fourth unknown variable. This tool is invaluable for practical applications where proportional reasoning is required, such as resizing images, adjusting ingredient quantities, or converting units. Its precision and ease of use make it a reliable resource for students and professionals alike.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the equality of two ratios expressed as a proportion. By cross-multiplying, we derive the formula to solve for the unknown variable. This method ensures that the proportional relationship is preserved and provides a straightforward calculation path.
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`A : B = C : D
=> A × D = B × C

Solving for the missing variable (x):

If A is unknown:  A = (B × C) / D
If B is unknown:  B = (A × D) / C
If C is unknown:  C = (A × D) / B
If D is unknown:  D = (B × C) / A`}
        </pre>
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Academic References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a href="https://math.libretexts.org/Bookshelves/Precalculus/Book%3A_Precalculus_(OpenStax)" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              1. Mathematics LibreTexts
            </a>
            <p className="text-slate-500 text-sm">Comprehensive open-access mathematics library covering ratios, proportions, and algebraic methods.</p>
          </li>
          <li className="block">
            <a href="https://www.khanacademy.org/math/arithmetic/arith-review-ratios-prop" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              2. Khan Academy - Ratios & Proportions
            </a>
            <p className="text-slate-500 text-sm">Detailed lessons and exercises on understanding and solving ratio and proportion problems.</p>
          </li>
          <li className="block">
            <a href="https://mathworld.wolfram.com/Proportion.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline text-lg">
              3. Wolfram MathWorld - Proportion
            </a>
            <p className="text-slate-500 text-sm">Authoritative resource explaining the mathematical theory behind proportions and their applications.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ratio Calculator (A:B = C:D)"
      description="Solve ratio problems easily. Find the missing value in a proportion (A:B = C:D) to scale recipes, images, or designs."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // CLEAN FORMULA DISPLAY
      formula={{
        title: "Key Formula",
        formula: `A : B = C : D\n=> A × D = B × C\n\nSolving for the missing variable (x):\n\nIf A is unknown:  A = (B × C) / D\nIf B is unknown:  B = (A × D) / C\nIf C is unknown:  C = (A × D) / B\nIf D is unknown:  D = (B × C) / A`,
        variables: [
          { symbol: "A", description: "First term of the first ratio" },
          { symbol: "B", description: "Second term of the first ratio" },
          { symbol: "C", description: "First term of the second ratio" },
          { symbol: "D", description: "Second term of the second ratio" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario: "Given the proportion 3 : 4 = C : 8, find the value of C.",
        steps: [
          { label: "1", explanation: "Identify the known values: A=3, B=4, D=8, C is unknown." },
          { label: "2", explanation: "Apply the formula: C = (A × D) / B = (3 × 8) / 4." },
          { label: "3", explanation: "Calculate: C = 24 / 4 = 6." },
        ],
        result: "The missing value C is 6, maintaining the proportion 3:4 = 6:8.",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Ratio Calculator (A:B = C:D)" },
        { id: "formula", label: "Formula & Methodology" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}