import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// SAFE ICONS ONLY
import { Sigma, RotateCcw, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export default function FractionReducerSimplifierCalculator() {
  const [inputs, setInputs] = useState<{ numerator?: string; denominator?: string }>({});

  const handleInputChange = useCallback((name: "numerator" | "denominator", value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const numRaw = inputs.numerator?.trim() ?? "";
    const denRaw = inputs.denominator?.trim() ?? "";

    if (numRaw === "" || denRaw === "") {
      return {
        value: 0,
        label: "Enter numerator and denominator",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    const numerator = Number(numRaw);
    const denominator = Number(denRaw);

    if (isNaN(numerator) || isNaN(denominator)) {
      return {
        value: 0,
        label: "Invalid input: Please enter valid numbers",
        subtext: "",
        warning: "Numerator and denominator must be valid numbers.",
        formulaUsed: null,
      };
    }

    if (denominator === 0) {
      return {
        value: 0,
        label: "Denominator cannot be zero",
        subtext: "",
        warning: "Division by zero is undefined.",
        formulaUsed: null,
      };
    }

    // Calculate gcd
    const divisor = gcd(numerator, denominator);

    // Reduced fraction
    const reducedNum = numerator / divisor;
    const reducedDen = denominator / divisor;

    // Format output
    let valueStr: string;
    let labelStr: string;

    if (reducedDen === 1) {
      // Whole number
      valueStr = reducedNum.toFixed(4);
      labelStr = "Simplified to whole number";
    } else if (reducedDen === -1) {
      // Whole number negative
      valueStr = (-reducedNum).toFixed(4);
      labelStr = "Simplified to whole number";
    } else if (reducedDen < 0) {
      // Make denominator positive by flipping signs
      valueStr = `${(-reducedNum).toFixed(4)} / ${(-reducedDen).toFixed(4)}`;
      labelStr = "Simplified fraction with positive denominator";
    } else {
      valueStr = `${reducedNum.toFixed(4)} / ${reducedDen.toFixed(4)}`;
      labelStr = "Simplified fraction";
    }

    return {
      value: valueStr,
      label: labelStr,
      subtext: `Original fraction: ${numerator} / ${denominator}`,
      warning: null,
      formulaUsed: "Greatest Common Divisor (GCD) Method",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is it important to simplify fractions?",
      answer:
        "Simplifying fractions makes them easier to understand and work with in calculations. It reduces complexity by expressing the fraction in its lowest terms, which helps avoid errors in arithmetic operations. Additionally, simplified fractions provide clearer insights into proportional relationships and are preferred in both academic and practical applications.",
    },
    {
      question: "How does the Greatest Common Divisor (GCD) help in fraction simplification?",
      answer:
        "The Greatest Common Divisor (GCD) is the largest integer that divides both the numerator and denominator without leaving a remainder. By dividing both parts of the fraction by the GCD, we reduce the fraction to its simplest form. This method ensures the fraction is expressed in the lowest terms while preserving its value.",
    },
    {
      question: "Can fractions with negative denominators be simplified?",
      answer:
        "Yes, fractions with negative denominators can be simplified by multiplying both numerator and denominator by -1 to make the denominator positive. This does not change the value of the fraction but aligns with the conventional representation where denominators are positive, improving clarity and consistency in mathematical expressions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="numerator" className="text-slate-700 dark:text-slate-300 font-semibold">
            Numerator
          </Label>
          <Input
            id="numerator"
            type="text"
            inputMode="numeric"
            pattern="[0-9\-]+"
            placeholder="Enter numerator"
            value={inputs.numerator ?? ""}
            onChange={(e) => handleInputChange("numerator", e.target.value)}
            aria-describedby="numerator-desc"
          />
          <p id="numerator-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Integer or decimal number (e.g., 4, -3, 2.5)
          </p>
        </div>
        <div>
          <Label htmlFor="denominator" className="text-slate-700 dark:text-slate-300 font-semibold">
            Denominator
          </Label>
          <Input
            id="denominator"
            type="text"
            inputMode="numeric"
            pattern="[0-9\-]+"
            placeholder="Enter denominator"
            value={inputs.denominator ?? ""}
            onChange={(e) => handleInputChange("denominator", e.target.value)}
            aria-describedby="denominator-desc"
          />
          <p id="denominator-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Integer or decimal number (cannot be zero)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate simplified fraction"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.label !== "Enter numerator and denominator" && (
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
              <strong>Math Tip:</strong> Always double-check your input values to avoid division by zero and ensure the fraction is valid.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Fraction Reducer / Simplifier</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Fraction simplification is a fundamental concept in mathematics that involves reducing a fraction to its simplest form. This process makes fractions easier to interpret, compare, and use in further calculations. By expressing a fraction in its lowest terms, we ensure clarity and precision in mathematical communication, which is essential in both academic and real-world contexts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The simplification process relies on identifying common factors between the numerator and denominator and dividing both by their greatest common divisor (GCD). This method preserves the value of the fraction while minimizing its components. Simplified fractions are preferred because they reduce computational complexity and enhance understanding, especially when dealing with ratios, proportions, and algebraic expressions.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the Greatest Common Divisor (GCD) method. To simplify a fraction, we find the GCD of the numerator and denominator and divide both by this number. This reduces the fraction to its lowest terms without changing its value.
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Simplified Fraction = (Numerator ÷ GCD) / (Denominator ÷ GCD)

Where:
GCD = Greatest Common Divisor of Numerator and Denominator`}
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
              href="https://math.libretexts.org/Bookshelves/Precalculus/Book%3A_Precalculus_(OpenStax)"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mathematics LibreTexts
            </a>
            <p className="text-slate-500 text-sm">Comprehensive open-access mathematics library covering foundational topics including fractions and number theory.</p>
          </li>
          <li className="block">
            <a
              href="https://www.khanacademy.org/math/arithmetic/fraction-arithmetic"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Khan Academy: Fraction Arithmetic
            </a>
            <p className="text-slate-500 text-sm">Detailed lessons and exercises on fraction simplification and operations, ideal for learners at all levels.</p>
          </li>
          <li className="block">
            <a
              href="https://mathworld.wolfram.com/GreatestCommonDivisor.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Wolfram MathWorld: Greatest Common Divisor
            </a>
            <p className="text-slate-500 text-sm">Authoritative resource explaining the theory and applications of the GCD in number theory and fraction simplification.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fraction Reducer / Simplifier"
      description="Simplify fractions instantly. Reduce complex fractions to their lowest terms for easier math and clearer answers."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: "Simplified Fraction = (Numerator ÷ GCD) / (Denominator ÷ GCD)",
        variables: [
          { symbol: "Numerator", description: "The top part of the fraction" },
          { symbol: "Denominator", description: "The bottom part of the fraction (non-zero)" },
          { symbol: "GCD", description: "Greatest Common Divisor of numerator and denominator" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario: "Simplify the fraction 24/36 to its lowest terms.",
        steps: [
          { label: "1", explanation: "Find the GCD of 24 and 36, which is 12." },
          { label: "2", explanation: "Divide numerator and denominator by 12: 24 ÷ 12 = 2, 36 ÷ 12 = 3." },
          { label: "3", explanation: "The simplified fraction is 2/3." },
        ],
        result: "2 / 3",
      }}
      relatedCalculators={[
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fraction Reducer / Simplifier" },
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