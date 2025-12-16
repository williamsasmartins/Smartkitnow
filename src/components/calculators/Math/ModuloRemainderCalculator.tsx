import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ModuloRemainderCalculator() {
  const [inputs, setInputs] = useState({ dividend: "", divisor: "" });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers, decimals, and minus sign for input
    if (/^-?\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const dividendRaw = inputs.dividend.trim();
    const divisorRaw = inputs.divisor.trim();

    if (dividendRaw === "" || divisorRaw === "") {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const dividend = Number(dividendRaw);
    const divisor = Number(divisorRaw);

    if (isNaN(dividend) || isNaN(divisor)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid numeric values.",
        formulaUsed: "",
      };
    }

    if (divisor === 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Division by zero is undefined.",
        formulaUsed: "",
      };
    }

    // Modulo calculation that works correctly for negative numbers:
    // result = dividend - divisor * floor(dividend / divisor)
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend - divisor * quotient;

    // Format result to 4 decimals if not integer
    const remainderFormatted =
      remainder % 1 === 0 ? remainder.toString() : remainder.toFixed(4);

    return {
      value: remainderFormatted,
      label: `Remainder of ${dividend} ÷ ${divisor}`,
      subtext:
        "The modulo operation returns the remainder after division, always non-negative if divisor &gt; 0.",
      warning: null,
      formulaUsed: "Modulo Formula: r = x - y × ⌊x / y⌋",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the modulo operation?",
      answer:
        "The modulo operation finds the remainder after division of one number by another. It is widely used in computer science, cryptography, and mathematics to determine cyclic patterns, remainders, and congruences. For example, 17 modulo 5 equals 2 because 17 divided by 5 leaves a remainder of 2.",
    },
    {
      question: "How does modulo handle negative numbers?",
      answer:
        "In this calculator, the modulo result is computed using the formula r = x - y × ⌊x / y⌋, ensuring the remainder is always non-negative when the divisor is positive. This differs from the JavaScript % operator, which can return negative remainders for negative dividends.",
    },
    {
      question: "Why can't the divisor be zero?",
      answer:
        "Division by zero is undefined in mathematics because it does not produce a meaningful or finite result. Therefore, the modulo operation with a divisor of zero is also undefined and not allowed.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="dividend" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Dividend (x)
          </Label>
          <Input
            id="dividend"
            type="text"
            inputMode="decimal"
            placeholder="Enter dividend"
            value={inputs.dividend}
            onChange={(e) => handleInputChange("dividend", e.target.value)}
            aria-describedby="dividend-desc"
          />
          <p id="dividend-desc" className="text-xs text-slate-500 mt-1">
            The number to be divided.
          </p>
        </div>
        <div>
          <Label htmlFor="divisor" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Divisor (y)
          </Label>
          <Input
            id="divisor"
            type="text"
            inputMode="decimal"
            placeholder="Enter divisor"
            value={inputs.divisor}
            onChange={(e) => handleInputChange("divisor", e.target.value)}
            aria-describedby="divisor-desc"
          />
          <p id="divisor-desc" className="text-xs text-slate-500 mt-1">
            The number by which dividend is divided (≠ 0).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate modulo"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ dividend: "", divisor: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
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
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Modulo (Remainder) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The modulo operation, often denoted as &quot;x mod y&quot;, calculates the remainder when one number (the dividend) is divided by another (the divisor). It is a fundamental concept in mathematics and computer science, used extensively in algorithms, cryptography, and number theory. This calculator helps you find the remainder of any division operation with precision and clarity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Unlike simple division, which yields a quotient, the modulo operation focuses on what is left over after division. For example, 10 mod 3 equals 1 because 3 goes into 10 three times (3 × 3 = 9) with a remainder of 1. This remainder is crucial in many applications such as hashing, cyclic counters, and modular arithmetic.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool ensures accurate results even with negative numbers by using the mathematical floor function to compute the remainder, which differs from some programming languages&apos; built-in modulo operators. It also prevents division by zero, which is undefined, ensuring safe and reliable calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`r = x - y × ⌊x / y⌋

where:
  r = remainder (modulo result)
  x = dividend
  y = divisor (≠ 0)
  ⌊ ⌋ = floor function (rounds down to nearest integer)`}
        </pre>
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
      title="Modulo (Remainder) Calculator"
      description="Calculate the modulo (remainder). Find the remainder of a division operation, essential for computer science and cryptography."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: "r = x - y × ⌊x / y⌋",
        variables: [
          { symbol: "r", description: "Remainder (modulo result)" },
          { symbol: "x", description: "Dividend" },
          { symbol: "y", description: "Divisor (≠ 0)" },
          { symbol: "⌊ ⌋", description: "Floor function (round down)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the remainder when 17 is divided by 5.",
        steps: [
          { label: "1", explanation: "Divide 17 by 5: 17 ÷ 5 = 3.4" },
          { label: "2", explanation: "Take the floor of the quotient: ⌊3.4⌋ = 3" },
          { label: "3", explanation: "Multiply divisor by floor quotient: 5 × 3 = 15" },
          { label: "4", explanation: "Subtract from dividend: 17 - 15 = 2" },
        ],
        result: "The remainder is 2, so 17 mod 5 = 2.",
      }}
      relatedCalculators={[
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
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