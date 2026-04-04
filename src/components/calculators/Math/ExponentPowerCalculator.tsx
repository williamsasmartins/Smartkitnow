import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sigma,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  FunctionSquare,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function formatComplex(real: number, imag: number): string {
  const r = real.toFixed(4);
  const i = imag.toFixed(4);
  if (imag === 0) return r;
  if (real === 0) return `${i}i`;
  const sign = imag > 0 ? "+" : "-";
  return `${r} ${sign} ${Math.abs(imag).toFixed(4)}i`;
}

export default function ExponentPowerCalculator() {
  const [inputs, setInputs] = useState({
    base: "",
    exponent: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const baseRaw = inputs.base.trim();
    const exponentRaw = inputs.exponent.trim();

    if (baseRaw === "" || exponentRaw === "") {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const base = Number(baseRaw);
    const exponent = Number(exponentRaw);

    if (Number.isNaN(base) || Number.isNaN(exponent)) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please enter valid numeric values for base and exponent.",
        formulaUsed: "",
      };
    }

    // Handle special cases:
    // 0^0 is undefined
    if (base === 0 && exponent === 0) {
      return {
        value: "Undefined",
        label: "0 raised to the power 0 is undefined",
        subtext: "",
        warning:
          "The expression 0^0 is indeterminate and has no universally accepted value.",
        formulaUsed: "Indeterminate Form",
      };
    }

    // Negative base with fractional exponent may produce complex number
    // Check if exponent is fractional (not integer)
    const isExponentInteger = Number.isInteger(exponent);

    // Calculate power
    let value: string;
    let label = `Result of ${base} raised to the power ${exponent}`;
    let subtext = "";
    let warning: string | null = null;
    const formulaUsed = "xʸ (Power Function)";

    if (base < 0 && !isExponentInteger) {
      // Complex result: use Euler's formula
      // x^y = exp(y * ln(x))
      // ln(x) for negative x = ln(|x|) + iπ
      // So:
      // real = e^(y * ln|x|) * cos(yπ)
      // imag = e^(y * ln|x|) * sin(yπ)

      const absBase = Math.abs(base);
      const lnAbsBase = Math.log(absBase);
      const expReal = Math.exp(exponent * lnAbsBase);
      const realPart = expReal * Math.cos(exponent * Math.PI);
      const imagPart = expReal * Math.sin(exponent * Math.PI);

      value = formatComplex(realPart, imagPart);
      subtext =
        "Complex number result due to negative base with fractional exponent.";
      warning =
        "Result is a complex number because the base is negative and the exponent is fractional.";
    } else {
      // Real result
      const powResult = Math.pow(base, exponent);
      value = powResult.toFixed(4);

      // Handle special constants display
      if (base === Math.E && exponent === 1) {
        label = "Euler's number (e)";
        subtext = "Base is Euler's constant e.";
      } else if (base === Math.PI && exponent === 1) {
        label = "Pi (π)";
        subtext = "Base is the constant π.";
      }
    }

    return {
      value,
      label,
      subtext,
      warning,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does the exponent represent and what are common patterns?",
      answer:
        "The exponent indicates how many times the base is multiplied by itself. Positive integer exponents are straightforward: 2³ = 2 × 2 × 2 = 8. Fractional exponents are roots: 8^(1/3) = ∛8 = 2, and 25^(0.5) = √25 = 5. Negative exponents are reciprocals: 2⁻³ = 1/8. Exponent 0 always gives 1 for any nonzero base (x⁰ = 1). These patterns appear throughout algebra, compound interest (A = P(1+r)ⁿ), exponential growth, and physics.",
    },
    {
      question: "How does the calculator handle negative bases with fractional exponents?",
      answer:
        "Raising a negative number to a fractional exponent produces a complex number. For (−2)^0.5, you are asking for the square root of a negative number — impossible in real numbers but defined as 0 + √2·i in complex numbers. This calculator uses Euler's formula: x^y = e^(y·ln|x|) × (cos(yπ) + i·sin(yπ)). For example, (−8)^(1/3) ≈ 1 + 1.732i. If the exponent is an integer, the result stays real: (−2)³ = −8.",
    },
    {
      question: "Why is 0 raised to the power 0 undefined?",
      answer:
        "0^0 is an indeterminate form because two valid limit rules conflict: any nonzero base raised to 0 gives 1 (x⁰ = 1), but 0 raised to any positive power gives 0 (0ˣ = 0). The limit of xˣ as x → 0⁺ equals 1, while the limit of 0ˣ as x → 0⁺ equals 0 — they disagree. In combinatorics, 0^0 = 1 is a useful convention (it counts the one empty product). In analysis, it must be treated carefully based on context. This calculator correctly flags it as indeterminate.",
    },
    {
      question: "What is the difference between exponential growth and exponential decay?",
      answer:
        "Both involve a base raised to a variable power, but the base determines direction. When the base > 1, repeated multiplication grows: 2^10 = 1024, 2^20 = 1,048,576 — populations, compound interest, viral spread. When 0 < base < 1, multiplication shrinks: 0.5^10 = 0.000977 — radioactive decay, drug metabolism, cooling. The general form is f(t) = A × bᵗ, where A is the initial value, b is the growth/decay factor, and t is time. Doubling time = ln(2) / ln(b) for growth; half-life = ln(0.5) / ln(b) for decay.",
    },
    {
      question: "How are laws of exponents used to simplify expressions?",
      answer:
        "The key exponent laws let you rewrite expressions without evaluating large numbers: (1) Product rule: xᵃ × xᵇ = x^(a+b) — same base, add exponents. (2) Quotient rule: xᵃ / xᵇ = x^(a−b). (3) Power of a power: (xᵃ)ᵇ = x^(ab). (4) Power of a product: (xy)ᵃ = xᵃ × yᵃ. (5) Negative exponent: x⁻ᵃ = 1/xᵃ. Example: simplify (2³ × 2⁵) / 2⁴ = 2^(3+5−4) = 2⁴ = 16. These rules are foundational for algebra, logarithms, and scientific notation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="base" className="flex items-center gap-1 font-semibold">
            <Calculator className="w-4 h-4 text-blue-600" /> Base (x)
          </Label>
          <Input
            id="base"
            type="text"
            placeholder="Enter base number"
            value={inputs.base}
            onChange={(e) => handleInputChange("base", e.target.value)}
            aria-describedby="base-desc"
          />
          <p id="base-desc" className="text-xs text-slate-500 mt-1">
            Any real number (e.g., 2, -3, 3.14, {Math.PI.toFixed(4)}, {Math.E.toFixed(4)})
          </p>
        </div>
        <div>
          <Label
            htmlFor="exponent"
            className="flex items-center gap-1 font-semibold"
          >
            <FunctionSquare className="w-4 h-4 text-blue-600" /> Exponent (y)
          </Label>
          <Input
            id="exponent"
            type="text"
            placeholder="Enter exponent"
            value={inputs.exponent}
            onChange={(e) => handleInputChange("exponent", e.target.value)}
            aria-describedby="exponent-desc"
          />
          <p id="exponent-desc" className="text-xs text-slate-500 mt-1">
            Any real number (positive, negative, or fractional)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate power"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ base: "", exponent: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
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
          Understanding Exponent &amp; Power Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Exponent &amp; Power Calculator is a precise mathematical tool designed
          to compute the value of a base number raised to any real exponent, including
          positive, negative, and fractional powers. Exponents represent repeated
          multiplication of the base, and fractional exponents correspond to roots.
          This calculator supports complex results when negative bases are raised to
          fractional powers, providing answers in the standard form &quot;a + bi&quot;.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By leveraging fundamental mathematical constants such as π (pi) and e
          (Euler's number), users can input these values directly for advanced
          calculations. The tool ensures high precision by rounding decimal results
          to four decimal places, maintaining accuracy without overwhelming detail.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are solving algebraic problems, exploring roots, or working with
          complex numbers, this calculator provides a reliable and authoritative
          solution. It also alerts users when inputs lead to undefined or complex
          results, ensuring clarity and correctness in all computations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`xʸ = e^{y \\cdot \\ln(x)}

Where:
- x is the base
- y is the exponent
- e is Euler's number (≈ 2.7183)
- ln is the natural logarithm

For negative base x and fractional exponent y:
xʸ = e^{y \\cdot (\\ln|x| + i\\pi)} = e^{y \\cdot \\ln|x|} \\cdot (\\cos(y\\pi) + i \\sin(y\\pi))`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Exponents in Growth, Science, and Computing
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Exponential growth describes any quantity that increases by a constant multiplicative factor per time unit. Compound interest follows A = P x (1+r)^n: a 7% annual return on $10,000 grows to $19,672 in 10 years. Population growth, viral spread, and radioactive decay all follow the same exponential pattern with different bases. The defining property: growth accelerates over time because each step multiplies the current value, not the original. This is why early exponential growth looks slow and then becomes sudden.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The laws of exponents govern all power manipulation: a^m x a^n = a^(m+n), a^m / a^n = a^(m-n), (a^m)^n = a^(mn), a^0 = 1, a^(-n) = 1/a^n. These rules handle every exponent operation. The most common error is treating (a+b)^2 as a^2 + b^2 instead of a^2 + 2ab + b^2. The rule (a^m)^n = a^(mn) applies only to products, not sums. Recognizing this prevents algebraic mistakes that cascade through multi-step problems in physics and engineering.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Computer science uses powers of 2 for every memory and data size standard. 1 kilobyte = 2^10 = 1,024 bytes. 1 megabyte = 2^20 = 1,048,576 bytes. 1 gigabyte = 2^30 bytes. A 32-bit integer stores values from 0 to 2^32 - 1 = 4,294,967,295. Choosing between int8, int16, int32, and int64 data types is a direct choice between these powers of 2. Integer overflow bugs occur when a computation exceeds the maximum value a type can hold, a problem diagnosed immediately by knowing the relevant power of 2.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Fractional exponents unify roots and powers: a^(1/2) = sqrt(a), a^(1/3) = cube root of a, a^(m/n) = nth root of a^m. Physics equations from orbital mechanics (period proportional to radius^(3/2)) to fluid dynamics (flow rate proportional to pressure^(1/2)) use fractional exponents. The exponential function base e (where e = 2.71828) is uniquely self-differentiating: d/dx e^x = e^x. This makes it the natural base for continuous growth and decay, differential equations, and Fourier analysis.
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
      title="Exponent & Power Calculator"
      description="Calculate exponents and powers. Raise any base number to a positive, negative, or fractional power instantly."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `xʸ = e^{y \\cdot \\ln(x)}`,
        variables: [
          { symbol: "x", description: "Base number" },
          { symbol: "y", description: "Exponent (power)" },
          { symbol: "e", description: "Euler's number (≈ 2.7183)" },
          { symbol: "ln", description: "Natural logarithm" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate (-2) raised to the power 1.5 (a fractional exponent).",
        steps: [
          {
            label: "1",
            explanation:
              "Identify that the base is negative and the exponent is fractional, so the result will be complex.",
          },
          {
            label: "2",
            explanation:
              "Use Euler's formula: (-2)^1.5 = e^{1.5 * (ln 2 + iπ)}.",
          },
          {
            label: "3",
            explanation:
              "Calculate the magnitude and angle, then convert to rectangular form.",
          },
        ],
        result: "Result ≈ 2.8284 + 2.8284i (complex number)",
      }}
      relatedCalculators={[
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
        },
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