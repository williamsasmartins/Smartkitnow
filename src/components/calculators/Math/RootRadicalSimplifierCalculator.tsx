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
        "Simplifying a square root means rewriting √n in the form a√b, where a is the largest integer whose square divides n, and b is what remains after dividing out a². The result b must be square-free (no perfect square factor other than 1). For example: √72 = √(36 × 2) = 6√2. The value is unchanged — 6√2 ≈ 8.485, same as √72 ≈ 8.485 — but the form is simpler and easier to manipulate algebraically.",
    },
    {
      question: "How do you identify whether a square root can be simplified?",
      answer:
        "A square root √n can be simplified if n has any perfect square factor greater than 1. Check by testing whether 4, 9, 16, 25, 36, 49, … divides n evenly. For √50: 25 divides 50 (50/25 = 2), so √50 = 5√2. For √30: none of 4, 9, 16, 25 divide 30 evenly, so √30 is already in simplest form. The quickest approach is prime factorization — if any prime appears with exponent ≥ 2 in the factorization, it can be simplified.",
    },
    {
      question: "Can all square roots be simplified?",
      answer:
        "No. Only square roots of numbers with a perfect square factor other than 1 can be simplified. Square roots of prime numbers (√2, √3, √5, √7, √11, …) are already in their simplest form. Square roots of numbers where all prime factors appear with odd exponents (e.g., √30 = √(2 × 3 × 5)) cannot be simplified further. Perfect squares (√4 = 2, √9 = 3, √16 = 4, √25 = 5…) simplify completely to integers with no radical sign.",
    },
    {
      question: "How do simplified radicals appear in geometry and the Pythagorean theorem?",
      answer:
        "Radical simplification is essential when applying the Pythagorean theorem (a² + b² = c²). For a right triangle with legs 3 and 5: c² = 9 + 25 = 34, so c = √34 (already simplified — 34 = 2 × 17, no repeated prime). For legs 4 and 6: c² = 16 + 36 = 52 = 4 × 13, so c = 2√13. In trigonometry, sin(45°) = √2/2 and sin(60°) = √3/2 are standard simplified forms. Leaving answers in simplified radical form preserves exact precision that decimal approximations lose.",
    },
    {
      question: "Why is simplifying radicals important in algebra?",
      answer:
        "Simplified radicals are required in standard mathematical form and enable several operations that unsimplified forms make awkward: (1) Adding like radicals — 3√2 + 5√2 = 8√2, but you can only add radicals with the same radicand, so simplification first is essential: √8 + √18 = 2√2 + 3√2 = 5√2. (2) Rationalizing denominators — 1/√2 = √2/2 (multiply by √2/√2). (3) Comparing magnitudes — is √50 or √48 larger? After simplifying to 5√2 vs 4√3, multiply both by √2: 10 vs 4√6 ≈ 9.8, so √50 > √48.",
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


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Simplifying Radicals in Algebra and Geometry
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Radical simplification is essential before combining radical expressions. Two radical terms can be added only when they share the same radicand: 3*sqrt(5) + 2*sqrt(5) = 5*sqrt(5). But 3*sqrt(5) + 2*sqrt(3) cannot be simplified further. Simplifying each radical first reveals whether they share a common radicand. For example, sqrt(75) + sqrt(48) = 5*sqrt(3) + 4*sqrt(3) = 9*sqrt(3). The simplification step was the key that made addition possible.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Pythagorean theorem produces radicals naturally. The hypotenuse of a right triangle with legs 3 and 7 is sqrt(9+49) = sqrt(58). This does not simplify because 58 = 2 x 29 has no perfect square factor. Compare to legs 4 and 6: sqrt(16+36) = sqrt(52) = sqrt(4x13) = 2*sqrt(13). Recognizing whether a radical simplifies avoids leaving unnecessarily complex expressions in engineering and physics calculations involving distances, forces, and waveforms.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Rationalizing the denominator is the companion operation to simplification. When a radical appears in the denominator (1/sqrt(3)), multiply by sqrt(3)/sqrt(3) to get sqrt(3)/3. This is required when polynomial long division, partial fractions, and standard-form root expressions need a rational denominator. The process uses the identity sqrt(a) x sqrt(a) = a. In calculus, simplified radicals appear in derivatives: d/dx sqrt(x) = 1/(2*sqrt(x)), and in integrals using trigonometric substitution where sqrt(a^2 - x^2) factors after setting x = a*sin(theta).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In algebra, fractional exponents and radicals are interchangeable: a^(1/2) = sqrt(a), a^(1/3) = cube root of a, and a^(m/n) = nth root of a^m. Exponential rules apply to all radical expressions through this equivalence: sqrt(a) x sqrt(b) = sqrt(ab) follows from a^(1/2) x b^(1/2) = (ab)^(1/2). Negative fractional exponents such as a^(-1/2) = 1/sqrt(a) appear frequently in physics formulas including inverse-square laws, pendulum periods, and wave speed equations.
        </p>
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