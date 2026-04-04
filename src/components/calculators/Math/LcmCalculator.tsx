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
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a);
}

function lcmTwoNumbers(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

function parseInputToNumbers(input: string): number[] {
  // Split by comma or space, filter out empty, parse to numbers
  return input
    .split(/[\s,]+/)
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .map((v) => Number(v))
    .filter((n) => !isNaN(n) && Number.isInteger(n));
}

export default function LcmCalculator() {
  const [inputs, setInputs] = useState({ numbers: "" });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const rawInput = inputs.numbers || "";
    const numbers = parseInputToNumbers(rawInput);

    if (numbers.length === 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter at least one integer.",
        formulaUsed: "",
      };
    }

    if (numbers.some((n) => n === 0)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "LCM involving zero is undefined (result is zero).",
        formulaUsed: "",
      };
    }

    if (numbers.some((n) => n < 0)) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter only positive integers.",
        formulaUsed: "",
      };
    }

    // Calculate LCM for multiple numbers
    const lcmValue = numbers.reduce((acc, curr) => lcmTwoNumbers(acc, curr), 1);

    return {
      value: lcmValue.toString(),
      label: `Least Common Multiple of [${numbers.join(", ")}]`,
      subtext: "The smallest positive integer divisible by all input numbers.",
      warning: null,
      formulaUsed: "LCM Calculation",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Least Common Multiple (LCM)?",
      answer:
        "The Least Common Multiple (LCM) of two or more integers is the smallest positive integer that is divisible by all of them without leaving a remainder. For example, LCM(4, 6) = 12 because 12 is the smallest number that both 4 and 6 divide evenly into. LCM is fundamental in adding fractions with different denominators — you need the LCM as the common denominator.",
    },
    {
      question: "How do I calculate the LCM of multiple numbers?",
      answer:
        "The most efficient method uses the GCD (Greatest Common Divisor): LCM(a, b) = |a × b| / GCD(a, b). For more than two numbers, apply it iteratively: LCM(a, b, c) = LCM(LCM(a, b), c). Alternatively, use prime factorization: write each number as a product of primes and take the highest power of each prime that appears. For 12 = 2² × 3 and 18 = 2 × 3², LCM = 2² × 3² = 36.",
    },
    {
      question: "What is the relationship between LCM and GCD?",
      answer:
        "For any two positive integers a and b: LCM(a, b) × GCD(a, b) = a × b. This identity is useful — if you know the GCD, you can find the LCM without additional computation. For example, GCD(12, 18) = 6, so LCM(12, 18) = (12 × 18) / 6 = 36. The LCM is always a multiple of both numbers, while the GCD is always a factor of both.",
    },
    {
      question: "What are real-world applications of LCM?",
      answer:
        "LCM appears in many practical contexts: (1) Adding fractions — to add 1/4 + 1/6, find LCM(4, 6) = 12, then convert both fractions. (2) Scheduling problems — if event A repeats every 4 days and event B every 6 days, they next coincide in LCM(4, 6) = 12 days. (3) Gear ratios — the LCM determines when two meshing gears return to their original position. (4) Music rhythm — LCM helps calculate when two time signatures realign.",
    },
    {
      question: "Can the LCM be zero or negative?",
      answer:
        "No. The LCM is always a positive integer for non-zero inputs. If any number is zero, the LCM is undefined (or sometimes treated as 0) because zero has no defined multiples in this context. For negative integers, convention is to take absolute values first — LCM(−4, 6) = LCM(4, 6) = 12. The LCM is always ≥ the largest input number.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="numbers" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Enter integers (comma or space separated)
          <Info className="w-4 h-4 text-slate-400" />
        </Label>
        <Input
          id="numbers"
          type="text"
          placeholder="e.g. 12, 15, 20"
          value={inputs.numbers || ""}
          onChange={(e) => handleInputChange("numbers", e.target.value)}
          aria-describedby="numbers-help"
          spellCheck={false}
          autoComplete="off"
        />
        <p id="numbers-help" className="text-xs text-slate-500 mt-1">
          Enter two or more positive integers separated by commas or spaces.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate LCM"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ numbers: "" })}
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
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding LCM Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Least Common Multiple (LCM) of a set of integers is the smallest positive integer that is divisible by all the numbers in the set. It is a fundamental concept in number theory and is widely used in solving problems involving fractions, ratios, and algebraic expressions. Calculating the LCM helps in finding common denominators and simplifying computations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to input multiple positive integers separated by commas or spaces. It then computes the LCM by iteratively applying the formula based on the Greatest Common Divisor (GCD). The result is the smallest number that all input values divide evenly into.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that the LCM is always a positive integer. If zero or negative numbers are entered, the calculator will prompt you to enter valid positive integers only. This ensures the mathematical integrity of the calculation.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`LCM(a, b) = |a × b| / GCD(a, b)

For multiple numbers:
LCM(a, b, c, ...) = LCM(LCM(a, b), c, ...)`}
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
      title="LCM Calculator"
      description="Calculate the Least Common Multiple (LCM). Find the smallest positive integer that is divisible by two or more numbers."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `LCM(a, b) = |a × b| / GCD(a, b)`,
        variables: [
          { symbol: "a, b", description: "Input integers" },
          { symbol: "GCD(a, b)", description: "Greatest Common Divisor of a and b" },
          { symbol: "LCM(a, b)", description: "Least Common Multiple of a and b" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Find the LCM of 12, 15, and 20.",
        steps: [
          { label: "1", explanation: "Calculate GCD(12, 15) = 3." },
          { label: "2", explanation: "Calculate LCM(12, 15) = (12 × 15) / 3 = 60." },
          { label: "3", explanation: "Calculate GCD(60, 20) = 20." },
          { label: "4", explanation: "Calculate LCM(60, 20) = (60 × 20) / 20 = 60." },
          { label: "5", explanation: "Therefore, LCM(12, 15, 20) = 60." },
        ],
        result: "60",
      }}
      relatedCalculators={[
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
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