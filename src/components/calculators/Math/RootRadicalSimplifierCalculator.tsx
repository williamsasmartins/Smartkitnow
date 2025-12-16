import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function simplifyRoot(n: number): { outside: number; inside: number } {
  // Simplify √n into outside * √inside form
  // outside and inside are integers, inside is square-free
  if (n <= 0) return { outside: 0, inside: 0 };
  let outside = 1;
  let inside = n;

  // Check for perfect squares up to n
  for (let i = Math.floor(Math.sqrt(n)); i >= 2; i--) {
    const square = i * i;
    if (n % square === 0) {
      outside = i;
      inside = n / square;
      break;
    }
  }
  return { outside, inside };
}

export default function RootRadicalSimplifierCalculator() {
  const [inputs, setInputs] = useState({ radicand: "" });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const radStr = inputs.radicand?.trim();
    if (!radStr) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    // Validate input: must be positive integer
    const radicandNum = Number(radStr);
    if (
      Number.isNaN(radicandNum) ||
      !Number.isInteger(radicandNum) ||
      radicandNum <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please enter a positive integer radicand.",
        formulaUsed: "",
      };
    }

    // Simplify radical √n = outside * √inside
    const { outside, inside } = simplifyRoot(radicandNum);

    // Construct result string
    let simplifiedStr = "";
    if (inside === 1) {
      // Perfect square
      simplifiedStr = outside.toString();
    } else if (outside === 1) {
      simplifiedStr = `√${inside}`;
    } else {
      simplifiedStr = `${outside}√${inside}`;
    }

    // Check if simplification changed the radicand
    const isSimplified = !(outside === 1 && inside === radicandNum);

    const label = isSimplified
      ? "Simplified Radical Form"
      : "Already Simplified";

    const subtext = isSimplified
      ? `√${radicandNum} = ${simplifiedStr}`
      : `√${radicandNum} cannot be simplified further`;

    return {
      value: simplifiedStr,
      label,
      subtext,
      warning: null,
      formulaUsed: "Simplification of Square Roots",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does it mean to simplify a square root?",
      answer:
        "Simplifying a square root means expressing it in the form a√b, where a and b are integers, and b has no perfect square factors other than 1. This makes the radical expression easier to understand and work with in further calculations.",
    },
    {
      question: "Can all square roots be simplified?",
      answer:
        "No, only square roots of numbers that have perfect square factors other than 1 can be simplified. For example, √8 can be simplified to 2√2, but √3 is already in its simplest form.",
    },
    {
      question: "Why is simplifying radicals important in mathematics?",
      answer:
        "Simplifying radicals helps in solving equations, comparing expressions, and performing arithmetic operations more efficiently. It also provides a clearer understanding of the magnitude of the number represented by the radical.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <Label htmlFor="radicand" className="font-semibold">
          Enter Radicand (positive integer)
        </Label>
        <Input
          id="radicand"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="e.g., 8"
          value={inputs.radicand || ""}
          onChange={(e) => handleInputChange("radicand", e.target.value)}
          className="mt-1"
          aria-describedby="radicand-desc"
        />
        <p
          id="radicand-desc"
          className="text-sm text-slate-500 dark:text-slate-400 mt-1"
        >
          Simplifies the square root of the entered number.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate simplified root"
          type="button"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
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
          Understanding Root/Radical Simplifier
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Root or Radical Simplifier is a mathematical tool designed to
          simplify square roots and other radicals into their simplest form.
          Simplifying radicals involves expressing a root in the form a√b,
          where &quot;a&quot; and &quot;b&quot; are integers, and &quot;b&quot; has
          no perfect square factors other than 1. This process makes complex
          radical expressions easier to interpret and use in calculations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For example, the square root of 8, written as √8, can be simplified to
          2√2 because 8 = 4 × 2 and √4 = 2. Simplifying radicals is essential in
          algebra, geometry, and calculus, as it helps in solving equations,
          comparing values, and performing arithmetic operations more
          efficiently.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool accepts a positive integer radicand and returns the simplest
          radical form. It also validates inputs to ensure meaningful and
          accurate results, providing warnings if the input is invalid.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`√n = a√b

Where:
- n = original radicand (positive integer)
- a = largest integer such that a² divides n
- b = n / a² (b is square-free)

Example:
√8 = √(4 × 2) = √4 × √2 = 2√2`}
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
      title="Root/Radical Simplifier"
      description="Simplify square roots and radicals. Convert unsimplified radicals into their simplest mixed radical form (e.g., √8 to 2√2)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `√n = a√b

Where:
- n = original radicand (positive integer)
- a = largest integer such that a² divides n
- b = n / a² (b is square-free)`,
        variables: [
          { symbol: "n", description: "Original radicand (positive integer)" },
          { symbol: "a", description: "Largest integer with a² dividing n" },
          { symbol: "b", description: "Square-free integer after division" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Simplify the square root of 72.",
        steps: [
          {
            label: "1",
            explanation:
              "Find the largest perfect square dividing 72, which is 36 (6²).",
          },
          {
            label: "2",
            explanation:
              "Express √72 as √(36 × 2) = √36 × √2 = 6√2.",
          },
        ],
        result: "The simplified form of √72 is 6√2.",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        {
          title: "Quadratic Equation Solver",
          url: "/math/quadratic-equation-solver",
          icon: "📐",
        },
        {
          title: "Standard Deviation",
          url: "/math/standard-deviation-variance",
          icon: "📊",
        },
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
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