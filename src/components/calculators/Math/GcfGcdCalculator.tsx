import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, Calculator, RotateCcw, Info, AlertTriangle, FunctionSquare } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function gcd(a: number, b: number): number {
  // Euclidean algorithm for GCD
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

export default function GcfGcdCalculator() {
  const [inputs, setInputs] = useState({ num1: "", num2: "" });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only digits, optional leading minus sign, and trim spaces
    if (/^-?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const n1 = inputs.num1.trim();
    const n2 = inputs.num2.trim();

    if (n1 === "" || n2 === "") {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const parsedNum1 = Number(n1);
    const parsedNum2 = Number(n2);

    if (Number.isNaN(parsedNum1) || Number.isNaN(parsedNum2)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid integers.",
        formulaUsed: "",
      };
    }

    if (!Number.isInteger(parsedNum1) || !Number.isInteger(parsedNum2)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Inputs must be integers.",
        formulaUsed: "",
      };
    }

    if (parsedNum1 === 0 && parsedNum2 === 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "GCD is undefined for both inputs zero.",
        formulaUsed: "",
      };
    }

    const gcdValue = gcd(parsedNum1, parsedNum2);

    return {
      value: gcdValue.toString(),
      label: `Greatest Common Divisor of ${parsedNum1} and ${parsedNum2}`,
      subtext:
        "The largest positive integer that divides both numbers without a remainder.",
      warning: null,
      formulaUsed: "Euclidean Algorithm",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Greatest Common Factor (GCF) or Greatest Common Divisor (GCD)?",
      answer:
        "The Greatest Common Factor (GCF), also known as the Greatest Common Divisor (GCD), is the largest positive integer that divides two or more integers without leaving a remainder. It is fundamental in simplifying fractions, finding common denominators, and solving problems involving divisibility.",
    },
    {
      question: "How does the Euclidean algorithm work for finding the GCD?",
      answer:
        "The Euclidean algorithm finds the GCD by repeatedly replacing the larger number by the remainder of dividing the larger number by the smaller number. This process continues until the remainder is zero. The last non-zero remainder is the GCD. This method is efficient and works for all integers.",
    },
    {
      question: "Can the GCD be negative or zero?",
      answer:
        "The GCD is always a non-negative integer. By definition, it is the greatest positive integer dividing the given numbers. If both inputs are zero, the GCD is undefined because every number divides zero, so no greatest divisor exists.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="num1" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Calculator className="w-4 h-4" /> Number 1
          </Label>
          <Input
            id="num1"
            type="text"
            inputMode="numeric"
            pattern="-?[0-9]*"
            placeholder="Enter first integer"
            value={inputs.num1}
            onChange={(e) => handleInputChange("num1", e.target.value)}
            aria-describedby="num1-desc"
          />
          <p id="num1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Integer value (positive or negative)
          </p>
        </div>
        <div>
          <Label htmlFor="num2" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Calculator className="w-4 h-4" /> Number 2
          </Label>
          <Input
            id="num2"
            type="text"
            inputMode="numeric"
            pattern="-?[0-9]*"
            placeholder="Enter second integer"
            value={inputs.num2}
            onChange={(e) => handleInputChange("num2", e.target.value)}
            aria-describedby="num2-desc"
          />
          <p id="num2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Integer value (positive or negative)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate GCF / GCD"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ num1: "", num2: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding GCF / GCD Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Greatest Common Factor (GCF), also known as the Greatest Common Divisor (GCD), is the largest positive integer that divides two or more integers without leaving a remainder. This concept is essential in number theory and has practical applications in simplifying fractions, finding common denominators, and solving problems involving divisibility.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses the Euclidean algorithm, a highly efficient method for computing the GCD of two integers. The algorithm repeatedly replaces the larger number by the remainder when divided by the smaller number until the remainder is zero. The last non-zero remainder is the GCD.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that the GCD is always a non-negative integer. If both inputs are zero, the GCD is undefined because every integer divides zero, so no greatest divisor exists. This tool ensures inputs are valid integers and provides warnings for invalid or undefined cases.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`function gcd(a, b) {
  a = |a|;
  b = |b|;
  while (b ≠ 0) {
    temp = b;
    b = a mod b;
    a = temp;
  }
  return a;
}`}
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
      title="GCF / GCD Calculator"
      description="Find the Greatest Common Factor (GCF) or Greatest Common Divisor (GCD). Identify the largest number that divides two or more integers."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `gcd(a, b) = gcd(b, a mod b), with gcd(a, 0) = |a|`,
        variables: [
          { symbol: "a", description: "First integer" },
          { symbol: "b", description: "Second integer" },
          { symbol: "mod", description: "Modulo operation (remainder)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Find the GCD of 48 and 18.",
        steps: [
          { label: "1", explanation: "Compute 48 mod 18 = 12." },
          { label: "2", explanation: "Replace (48, 18) with (18, 12)." },
          { label: "3", explanation: "Compute 18 mod 12 = 6." },
          { label: "4", explanation: "Replace (18, 12) with (12, 6)." },
          { label: "5", explanation: "Compute 12 mod 6 = 0." },
          { label: "6", explanation: "Since remainder is 0, GCD is 6." },
        ],
        result: "The Greatest Common Divisor of 48 and 18 is 6.",
      }}
      relatedCalculators={[
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
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