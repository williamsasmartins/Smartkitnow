import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sigma, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function primeFactorization(n: number): { factor: number; exponent: number }[] {
  const factors: { factor: number; exponent: number }[] = [];
  if (n < 2) return factors;

  let num = n;
  for (let i = 2; i * i <= num; i++) {
    let count = 0;
    while (num % i === 0) {
      count++;
      num /= i;
    }
    if (count > 0) {
      factors.push({ factor: i, exponent: count });
    }
  }
  if (num > 1) {
    factors.push({ factor: num, exponent: 1 });
  }
  return factors;
}

function formatFactorization(factors: { factor: number; exponent: number }[]): string {
  if (factors.length === 0) return "No prime factors (input &lt; 2)";
  return factors
    .map(({ factor, exponent }) =>
      exponent === 1 ? `${factor}` : `${factor}²`.replace("²", `^${exponent}`)
    )
    .join(" × ");
}

export default function PrimeFactorizationToolCalculator() {
  const [inputs, setInputs] = useState({ number: "" });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only digits, no decimals or negative signs
    if (name === "number") {
      if (/^\d*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
    }
  }, []);

  const results = useMemo(() => {
    const inputStr = inputs.number.trim();
    if (inputStr === "") {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const num = Number(inputStr);
    if (Number.isNaN(num) || !Number.isInteger(num)) {
      return {
        value: "",
        label: "",
        subtext: "",
        warning: "Please enter a valid integer number.",
        formulaUsed: "",
      };
    }
    if (num < 2) {
      return {
        value: num.toString(),
        label: "Input must be an integer greater than or equal to 2.",
        subtext: "",
        warning: "Prime factorization is defined for integers ≥ 2.",
        formulaUsed: "",
      };
    }
    if (num > 1_000_000_000) {
      return {
        value: num.toString(),
        label: "Input too large for instant factorization.",
        subtext: "Try a smaller number (≤ 1,000,000,000).",
        warning: "Large inputs may cause performance issues.",
        formulaUsed: "",
      };
    }

    const factors = primeFactorization(num);
    const formatted = formatFactorization(factors);

    return {
      value: formatted,
      label: `Prime factorization of ${num}`,
      subtext: "Expressed as product of prime factors with exponents.",
      warning: null,
      formulaUsed: "Prime Factorization",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is prime factorization?",
      answer:
        "Prime factorization expresses a composite number as a product of its prime factors — the unique set of primes that multiply together to form it. For example, 360 = 2³ × 3² × 5. The Fundamental Theorem of Arithmetic guarantees that this representation is unique for every integer greater than 1 (ignoring order). Prime numbers themselves (2, 3, 5, 7, 11, …) are already their own prime factorization and cannot be broken down further.",
    },
    {
      question: "Why is prime factorization important in mathematics?",
      answer:
        "Prime factorization is the foundation for many core operations: (1) Finding GCD and LCM — GCD(360, 120) = 2² × 3 × 5 = 120 by taking the minimum exponent of each shared prime. (2) Simplifying fractions — 360/120 = 3 directly from the factorizations. (3) Cryptography — RSA encryption relies on the fact that factoring the product of two very large primes is computationally infeasible, making it secure. (4) Solving Diophantine equations and modular arithmetic problems in number theory.",
    },
    {
      question: "What is the Fundamental Theorem of Arithmetic?",
      answer:
        "The Fundamental Theorem of Arithmetic states that every integer greater than 1 has exactly one prime factorization (up to the order of factors). This uniqueness is what makes prime factorization so powerful — 12 is always 2² × 3, never any other combination of primes. The theorem underpins all of number theory and explains why primes are considered the atomic building blocks of the integers.",
    },
    {
      question: "How do you find the GCD and LCM from prime factorizations?",
      answer:
        "Once you have the prime factorizations, finding GCD and LCM is straightforward. For GCD, take each prime that appears in BOTH factorizations with the MINIMUM exponent: GCD(360, 84) where 360 = 2³ × 3² × 5 and 84 = 2² × 3 × 7 → GCD = 2² × 3 = 12. For LCM, take each prime that appears in EITHER factorization with the MAXIMUM exponent: LCM = 2³ × 3² × 5 × 7 = 2520. These rules make factorization the most systematic method for GCD/LCM with multiple numbers.",
    },
    {
      question: "Can prime factorization be done for negative numbers or decimals?",
      answer:
        "Standard prime factorization is defined only for positive integers greater than 1. For negative integers, mathematicians often factor out −1 first: −360 = −1 × 2³ × 3² × 5. For decimals and fractions, factorization extends to rational numbers — for example, 3/4 = 3 × 2⁻², using negative exponents for the denominator's primes. However, this tool focuses on positive integers where the definition is unambiguous and universally agreed upon.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="number" className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
          Enter an integer &ge; 2
          <Sigma className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="number"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="e.g., 360"
          value={inputs.number}
          onChange={(e) => handleInputChange("number", e.target.value)}
          aria-describedby="number-desc"
          className="max-w-xs"
        />
        <p id="number-desc" className="text-sm text-slate-500 mt-1">
          Input must be a positive integer &ge; 2.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is automatic on input change
          }}
          aria-label="Calculate prime factorization"
          type="button"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ number: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset input"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== "" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white break-words">{results.value}</p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Prime Factorization Tool</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Prime factorization is a fundamental concept in mathematics where a composite number is expressed as a product of prime numbers. These prime numbers are the basic building blocks of all integers greater than 1. This tool allows you to input any integer &ge; 2 and obtain its prime factors, revealing the unique prime components that multiply to form the original number.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding prime factorization is essential for various mathematical applications including simplifying fractions, finding greatest common divisors (GCD), and solving problems in number theory and cryptography. The tool efficiently breaks down numbers into their prime factors, providing a clear and concise representation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator ensures accuracy and clarity by formatting the output with exponents where applicable, making it easy to interpret the factorization. It also validates input to ensure only valid integers are processed, enhancing reliability and user experience.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`n = p_1^{a_1} × p_2^{a_2} × ... × p_k^{a_k}

where:
- n is the integer to factorize (n ≥ 2)
- p_i are prime numbers
- a_i are their respective exponents (positive integers)

This expresses n as a unique product of prime powers.`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          When Prime Factorization Is the Right Tool
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Prime factorization decomposes any composite number into its prime building blocks. This is more than an academic exercise: once you have the prime factorization of two numbers, you can compute their GCD and LCM immediately without any further division. GCD is the product of shared prime factors at their minimum exponents; LCM is the product of all prime factors at their maximum exponents. For 360 = 2^3 x 3^2 x 5 and 84 = 2^2 x 3 x 7: GCD = 2^2 x 3 = 12, LCM = 2^3 x 3^2 x 5 x 7 = 2520.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cryptography depends on the difficulty of prime factorization for large numbers. The RSA algorithm encodes messages using the product of two large primes (n = p x q). Decoding requires knowing p and q individually. While multiplying two 1024-bit primes takes a computer microseconds, factoring their product would take longer than the current age of the universe with classical computers. This asymmetry is what makes RSA secure.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Number theory puzzles and competitive math problems frequently require prime factorization as the first step. Finding the number of divisors, the sum of divisors, or whether a number is a perfect square all follow directly from the prime factorization. A number has (e1+1)(e2+1)... divisors where e1, e2... are the exponents in its factorization. For 360 = 2^3 x 3^2 x 5^1: divisors = (3+1)(2+1)(1+1) = 24.
        </p>
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
      title="Prime Factorization Tool"
      description="Find the prime factorization of any number. Break down composite numbers into their prime components (e.g., 12 = 2² × 3)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `n = p_1^{a_1} × p_2^{a_2} × ... × p_k^{a_k}`,
        variables: [
          { symbol: "n", description: "Integer to factorize (n ≥ 2)" },
          { symbol: "p_i", description: "Prime factors" },
          { symbol: "a_i", description: "Exponents of prime factors" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Find the prime factorization of 360.",
        steps: [
          { label: "1", explanation: "Start dividing 360 by the smallest prime 2." },
          { label: "2", explanation: "Divide repeatedly by 2: 360 ÷ 2 = 180, 180 ÷ 2 = 90, 90 ÷ 2 = 45." },
          { label: "3", explanation: "Next prime is 3: divide 45 ÷ 3 = 15, then 15 ÷ 3 = 5." },
          { label: "4", explanation: "Next prime is 5: divide 5 ÷ 5 = 1, factorization complete." },
        ],
        result: "360 = 2^3 × 3^2 × 5",
      }}
      relatedCalculators={[
        { title: "Linear Equation Solver", url: "/math/linear-equation-solver", icon: "📈" },
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        { title: "Standard Deviation", url: "/math/standard-deviation-variance", icon: "📊" },
        { title: "Quadratic Equation Solver", url: "/math/quadratic-equation-solver", icon: "📐" },
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