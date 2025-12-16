import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// SAFE ICONS ONLY
import { Sigma, RotateCcw, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ProportionSolverCalculator() {
  // Inputs: a, b, c, x (x is unknown to solve)
  // User inputs three known values, leaves one blank (x)
  // We solve for x using cross multiplication: a/b = c/x => x = (b*c)/a or variants depending on missing variable

  const [inputs, setInputs] = useState({
    a: "",
    b: "",
    c: "",
    x: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points, empty string allowed
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    // Parse inputs to floats or NaN
    const a = parseFloat(inputs.a);
    const b = parseFloat(inputs.b);
    const c = parseFloat(inputs.c);
    const x = parseFloat(inputs.x);

    // Count how many inputs are filled (non-NaN)
    const filled = [a, b, c, x].filter((v) => !isNaN(v)).length;

    // We need exactly 3 inputs filled to solve for the 4th
    if (filled < 3) {
      return {
        value: 0,
        label: "Enter exactly three values to solve for the fourth.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (filled > 3) {
      return {
        value: 0,
        label: "Please leave one value empty to solve for it.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Identify which variable is missing (NaN)
    const missingVar = isNaN(a)
      ? "a"
      : isNaN(b)
      ? "b"
      : isNaN(c)
      ? "c"
      : isNaN(x)
      ? "x"
      : null;

    if (!missingVar) {
      return {
        value: 0,
        label: "Unexpected error: no variable to solve for.",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Cross multiplication formula: a/b = c/x
    // Solve for missing variable:
    // a = (b*c)/x
    // b = (a*x)/c
    // c = (a*x)/b
    // x = (b*c)/a

    let resultValue: number | string = 0;
    let formulaUsed = "";
    let warning: string | null = null;

    try {
      switch (missingVar) {
        case "a":
          if (b === 0) {
            warning = "Division by zero encountered while solving for a.";
            resultValue = "undefined";
          } else {
            resultValue = (b * c) / x;
            formulaUsed = "a = (b × c) / x";
          }
          break;
        case "b":
          if (c === 0) {
            warning = "Division by zero encountered while solving for b.";
            resultValue = "undefined";
          } else {
            resultValue = (a * x) / c;
            formulaUsed = "b = (a × x) / c";
          }
          break;
        case "c":
          if (b === 0) {
            warning = "Division by zero encountered while solving for c.";
            resultValue = "undefined";
          } else {
            resultValue = (a * x) / b;
            formulaUsed = "c = (a × x) / b";
          }
          break;
        case "x":
          if (a === 0) {
            warning = "Division by zero encountered while solving for x.";
            resultValue = "undefined";
          } else {
            resultValue = (b * c) / a;
            formulaUsed = "x = (b × c) / a";
          }
          break;
      }
    } catch {
      warning = "An error occurred during calculation.";
      resultValue = "error";
    }

    // Format result
    if (typeof resultValue === "number") {
      // Check for complex number scenario (not expected here since no roots)
      // But if resultValue is NaN or infinite, handle
      if (!isFinite(resultValue)) {
        warning = "Result is infinite or undefined.";
        return {
          value: "undefined",
          label: `Result for ${missingVar} is undefined.`,
          subtext: "",
          warning,
          formulaUsed,
        };
      }
      const fixedVal = resultValue.toFixed(4);
      return {
        value: fixedVal,
        label: `Value of ${missingVar.toUpperCase()}`,
        subtext: `Calculated using cross-multiplication`,
        warning,
        formulaUsed,
      };
    } else {
      // resultValue is string (undefined, error)
      return {
        value: resultValue,
        label: `Value of ${missingVar.toUpperCase()}`,
        subtext: "",
        warning,
        formulaUsed,
      };
    }
  }, [inputs]);

  // FAQs with 50-80 words each
  const faqs = [
    {
      question: "What is cross-multiplication in proportions?",
      answer:
        "Cross-multiplication is a method used to solve equations involving two ratios or fractions set equal to each other. By multiplying the numerator of one ratio by the denominator of the other, and vice versa, you create an equation that can be solved for the unknown variable. This technique simplifies solving proportions efficiently and accurately.",
    },
    {
      question: "When should I use the proportion solver?",
      answer:
        "Use the proportion solver when you have two ratios or fractions that are equal, and you need to find the missing value in one of them. This is common in problems involving scaling, ratios, rates, and conversions. The solver requires three known values to calculate the fourth unknown value precisely.",
    },
    {
      question: "Can the proportion solver handle zero or negative inputs?",
      answer:
        "Zero inputs can cause division by zero errors, which the solver detects and warns about. Negative values are mathematically valid in proportions and will be processed accordingly. However, ensure that the context of your problem allows negative numbers, as proportions typically represent positive quantities.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="input-a" className="text-slate-700 dark:text-slate-300">
            a (first numerator)
          </Label>
          <Input
            id="input-a"
            type="text"
            inputMode="decimal"
            value={inputs.a}
            placeholder="Enter value or leave blank"
            onChange={(e) => handleInputChange("a", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="input-b" className="text-slate-700 dark:text-slate-300">
            b (first denominator)
          </Label>
          <Input
            id="input-b"
            type="text"
            inputMode="decimal"
            value={inputs.b}
            placeholder="Enter value or leave blank"
            onChange={(e) => handleInputChange("b", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="input-c" className="text-slate-700 dark:text-slate-300">
            c (second numerator)
          </Label>
          <Input
            id="input-c"
            type="text"
            inputMode="decimal"
            value={inputs.c}
            placeholder="Enter value or leave blank"
            onChange={(e) => handleInputChange("c", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="input-x" className="text-slate-700 dark:text-slate-300">
            x (second denominator)
          </Label>
          <Input
            id="input-x"
            type="text"
            inputMode="decimal"
            value={inputs.x}
            placeholder="Enter value or leave blank"
            onChange={(e) => handleInputChange("x", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate proportion"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ a: "", b: "", c: "", x: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.value !== "Enter data..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}

              {results.warning && (
                <div
                  className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left"
                  role="alert"
                >
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <FunctionSquare className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Math Tip:</strong> Always double-check your input units and ensure exactly one value is left blank to solve for it accurately.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Proportion Solver (Cross-Multiplication)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proportions are equations that state two ratios or fractions are equal. They are fundamental in various fields such as physics, chemistry, finance, and everyday problem-solving. The proportion solver uses cross-multiplication, a reliable algebraic technique, to find the unknown value in a proportional relationship quickly and accurately. This method transforms the proportion into a simple equation that can be solved with basic arithmetic.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Cross-multiplication works by multiplying the numerator of one ratio by the denominator of the other, setting these products equal to each other. This approach eliminates fractions and simplifies the equation, making it easier to isolate and solve for the unknown variable. The solver requires three known values and calculates the fourth, ensuring precision and efficiency in computations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the equality of two ratios expressed as a proportion:
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`a / b = c / x

Cross-multiplying gives:

a × x = b × c

Solving for the unknown variable:

x = (b × c) / a

Similarly, if any other variable is unknown:

a = (b × c) / x
b = (a × x) / c
c = (a × x) / b`}
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
            <a
              href="https://math.libretexts.org/Bookshelves/Algebra/Book%3A_Intermediate_Algebra_(OpenStax)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mathematics LibreTexts - Intermediate Algebra
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive open-access mathematics library covering algebraic concepts including proportions and cross-multiplication.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/arithmetic/arith-review-ratios-prop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy - Ratios and Proportions
            </a>
            <p className="text-slate-500 text-sm">
              Detailed lessons and exercises on understanding and solving proportions using cross-multiplication.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.purplemath.com/modules/prop.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Purplemath - Proportions and Cross Multiplication
            </a>
            <p className="text-slate-500 text-sm">
              Clear explanations and examples of proportion problems solved via cross-multiplication.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Proportion Solver (Cross-Multiplication)"
      description="Solve proportions using cross-multiplication. Find the value of X in any proportional equation quickly and accurately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `a / b = c / x
Cross-multiplying: a × x = b × c
Solving for unknown: x = (b × c) / a`,
        variables: [
          { symbol: "a", description: "First numerator" },
          { symbol: "b", description: "First denominator" },
          { symbol: "c", description: "Second numerator" },
          { symbol: "x", description: "Second denominator (unknown to solve)" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario:
          "Given the proportion 3/4 = 6/x, find the value of x.",
        steps: [
          {
            label: "1",
            explanation:
              "Set up the proportion: 3/4 = 6/x.",
          },
          {
            label: "2",
            explanation:
              "Cross-multiply: 3 × x = 4 × 6.",
          },
          {
            label: "3",
            explanation:
              "Simplify: 3x = 24.",
          },
          {
            label: "4",
            explanation:
              "Solve for x: x = 24 / 3 = 8.",
          },
        ],
        result: "x = 8",
      }}
      relatedCalculators={[
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Proportion Solver (Cross-Multiplication)" },
        { id: "formula", label: "Formula & Methodology" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Academic References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}