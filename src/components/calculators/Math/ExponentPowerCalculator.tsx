import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// SAFE ICONS ONLY
import { Sigma, Calculator, RotateCcw, Info, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function formatComplex(real: number, imag: number): string {
  const r = real.toFixed(4);
  const i = Math.abs(imag).toFixed(4);
  const sign = imag >= 0 ? "+" : "-";
  return `${r} ${sign} ${i}i`;
}

export default function ExponentPowerCalculator() {
  const [inputs, setInputs] = useState({
    base: "",
    exponent: "",
    notation: "decimal", // decimal or scientific
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const baseRaw = inputs.base.trim();
    const exponentRaw = inputs.exponent.trim();

    if (baseRaw === "" || exponentRaw === "") {
      return {
        value: "Enter data...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    const base = Number(baseRaw);
    const exponent = Number(exponentRaw);

    if (isNaN(base) || isNaN(exponent)) {
      return {
        value: "Invalid input",
        label: "",
        subtext: "",
        warning: "Please enter valid numeric values for base and exponent.",
        formulaUsed: null,
      };
    }

    // Handle special constants input (Math.PI, Math.E) if user types "pi" or "e"
    // But since inputs are numeric only, we skip that.

    // Calculation:
    // For real base and exponent, result = base^exponent
    // If base < 0 and exponent is fractional (non-integer), result is complex

    // Check if exponent is integer
    const isExponentInteger = Number.isInteger(exponent);

    // Complex number detection
    if (base < 0 && !isExponentInteger) {
      // Complex result: base^exponent = e^(exponent * ln(base))
      // ln(base) = ln(|base|) + i*pi (since base < 0)
      // So result = e^(exponent * (ln|base| + i*pi)) = e^(exponent*ln|base|) * e^(i*exponent*pi)
      // = r * (cos(theta) + i sin(theta))
      const r = Math.exp(exponent * Math.log(Math.abs(base)));
      const theta = exponent * Math.PI;
      const real = r * Math.cos(theta);
      const imag = r * Math.sin(theta);
      const complexStr = formatComplex(real, imag);
      return {
        value: complexStr,
        label: `Result of (${base})^${exponent}`,
        subtext: "Complex number result due to negative base and fractional exponent",
        warning: null,
        formulaUsed: "Using Euler's formula: a^b = e^(b * ln(a))",
      };
    }

    // Normal real result
    const powResult = Math.pow(base, exponent);

    // Format output with .toFixed(4)
    const formattedResult =
      Math.abs(powResult) < 1e-7 && powResult !== 0
        ? powResult.toExponential(4)
        : powResult.toFixed(4);

    return {
      value: formattedResult,
      label: `Result of ${base} raised to the power ${exponent}`,
      subtext: "Standard power calculation",
      warning: null,
      formulaUsed: "Power formula: base^exponent",
    };
  }, [inputs]);

  // 3. FAQS (ENGLISH - LONG ANSWERS)
  const faqs = [
    {
      question: "What is an exponent and how is it used in calculations?",
      answer:
        "An exponent represents how many times a base number is multiplied by itself. For example, in 2^3, 2 is the base and 3 is the exponent, meaning 2 × 2 × 2 = 8. Exponents simplify repeated multiplication and are fundamental in various mathematical fields including algebra, calculus, and scientific notation.",
    },
    {
      question: "How does the calculator handle negative and fractional exponents?",
      answer:
        "Negative exponents represent the reciprocal of the base raised to the positive exponent, such as 2^-3 = 1/(2^3) = 1/8. Fractional exponents denote roots, for example, 9^(1/2) = √9 = 3. When the base is negative and the exponent is fractional, the result may be a complex number, which this calculator formats accordingly.",
    },
    {
      question: "Why is precision important when calculating powers and exponents?",
      answer:
        "Precision ensures that results are accurate and reliable, especially in scientific and engineering applications. This calculator uses four decimal places to balance readability and accuracy. Rounding too early or too much can lead to significant errors, so maintaining consistent precision is critical for trustworthy computations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="base" className="text-slate-700 dark:text-slate-300">
            Base Number
          </Label>
          <Input
            id="base"
            type="text"
            placeholder="Enter base (e.g., 2, -3.5)"
            value={inputs.base}
            onChange={(e) => handleInputChange("base", e.target.value)}
            aria-describedby="base-desc"
            spellCheck={false}
            autoComplete="off"
          />
          <p id="base-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            The number to be raised to a power. Can be positive, negative, or zero.
          </p>
        </div>

        <div>
          <Label htmlFor="exponent" className="text-slate-700 dark:text-slate-300">
            Exponent (Power)
          </Label>
          <Input
            id="exponent"
            type="text"
            placeholder="Enter exponent (e.g., 3, -0.5)"
            value={inputs.exponent}
            onChange={(e) => handleInputChange("exponent", e.target.value)}
            aria-describedby="exponent-desc"
            spellCheck={false}
            autoComplete="off"
          />
          <p id="exponent-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            The power to which the base is raised. Can be positive, negative, or fractional.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
          aria-label="Calculate exponentiation"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ base: "", exponent: "", notation: "decimal" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Enter data..." && results.value !== "Invalid input" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          {/* BLUE GRADIENT CARD - SAME AS COOKING */}
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

      {(results.value === "Enter data..." || results.value === "Invalid input") && (
        <div
          className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 border border-yellow-300 rounded-lg flex items-start gap-3 text-left"
          role="alert"
        >
          <Info className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">{results.value}</p>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Exponent & Power Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Exponent & Power Calculator is a fundamental mathematical tool designed to compute the result of raising a base number to a specified power or exponent. Exponents are a concise way to express repeated multiplication of the same number, and this calculator supports positive, negative, and fractional exponents, enabling a wide range of calculations from simple squares to roots and reciprocals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is essential for students, educators, engineers, and scientists who frequently work with exponential expressions. It handles complex scenarios such as negative bases raised to fractional powers by providing results in complex number format, ensuring mathematical accuracy and completeness. The calculator also maintains precision by formatting results to four decimal places, balancing clarity and exactness.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Methodology</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core mathematical principle used here is the power function, which raises a base number to an exponent. When the base is positive or zero, the calculation is straightforward using the formula:
        </p>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          {"result = base^{exponent}"}
        </pre>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          For negative bases with fractional exponents, the calculator employs Euler's formula to express the result as a complex number:
        </p>
        <pre className="mt-2 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          {"a^b = e^{b * ln(a)} = e^{b * (ln|a| + iπ)} = r (cos θ + i sin θ)"}
        </pre>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
          where <code>r = e^{b * ln|a|}</code> and <code>θ = bπ</code>. This approach ensures accurate representation of complex results when real-valued exponentiation is not defined.
        </p>
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
            <p className="text-slate-500 text-sm">Comprehensive open-access mathematics library covering exponents and powers in detail.</p>
          </li>
          <li className="block">
            <a
              href="https://en.wikipedia.org/wiki/Exponentiation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Wikipedia: Exponentiation
            </a>
            <p className="text-slate-500 text-sm">Detailed explanation of exponentiation including complex powers and applications.</p>
          </li>
          <li className="block">
            <a
              href="https://mathworld.wolfram.com/Exponentiation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Wolfram MathWorld: Exponentiation
            </a>
            <p className="text-slate-500 text-sm">Authoritative resource on the mathematical properties and formulas of exponentiation.</p>
          </li>
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
      // CLEAN FORMULA DISPLAY
      formula={{
        title: "Key Formula",
        formula: "result = base^{exponent}",
        variables: [
          { symbol: "base", description: "The number to be raised to a power" },
          { symbol: "exponent", description: "The power to which the base is raised" },
          { symbol: "result", description: "The calculated power value" },
        ],
      }}
      example={{
        title: "Solved Example",
        scenario: "Calculate 4 raised to the power 1.5.",
        steps: [
          { label: "1", explanation: "Identify the base (4) and the exponent (1.5)." },
          { label: "2", explanation: "Calculate 4^{1.5} = 4^{(3/2)} = √(4^3) = √64 = 8." },
          { label: "3", explanation: "Result is 8.0000 after formatting to four decimals." },
        ],
        result: "8.0000",
      }}
      relatedCalculators={[
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Circle Area Calculator", url: "/math/circle-area-calculator", icon: "⚪" },
        { title: "Triangle Solver", url: "/math/triangle-solver", icon: "📐" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Exponent & Power Calculator" },
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