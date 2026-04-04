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
      question: "What is the modulo operation and when is it used?",
      answer:
        "The modulo operation (x mod y) returns the remainder after dividing x by y. For example, 17 mod 5 = 2 because 17 = 3 × 5 + 2. It is one of the most widely used operations in computer science and mathematics. Key uses: (1) Checking even/odd — n mod 2 = 0 means even. (2) Wrapping around — clock arithmetic: 14:00 mod 12 = 2 (2 PM). (3) Hashing — assigning keys to buckets: key mod tableSize. (4) Cryptography — RSA and Diffie-Hellman rely entirely on modular exponentiation.",
    },
    {
      question: "How does modulo handle negative numbers?",
      answer:
        "Different languages handle negative modulo differently. Python and this calculator use the floored division definition: r = x − y × ⌊x/y⌋, which always returns a non-negative result when y > 0. Example: −7 mod 3 = −7 − 3 × ⌊−7/3⌋ = −7 − 3 × (−3) = −7 + 9 = 2. In contrast, C, Java, and JavaScript use truncated division where −7 % 3 = −1 (sign follows the dividend). The floored version is mathematically preferred for modular arithmetic.",
    },
    {
      question: "What are real-world applications of modulo in programming?",
      answer:
        "Modulo is ubiquitous in software: (1) Pagination — page number = itemIndex mod itemsPerPage. (2) Round-robin scheduling — task mod workerCount assigns tasks to workers evenly. (3) Checksums — ISBN-10 validity: (sum of weighted digits) mod 11 = 0. (4) Color cycling and animations — frame mod totalFrames keeps animations looping. (5) Leap year check — year mod 4 = 0 (with corrections for centuries). (6) Ring buffers — index mod bufferSize wraps around to reuse memory.",
    },
    {
      question: "What is modular arithmetic and why does it matter?",
      answer:
        "Modular arithmetic is a system where numbers wrap around after reaching a modulus. The notation a ≡ b (mod m) means a and b have the same remainder when divided by m. For example, 17 ≡ 2 (mod 5) because both leave remainder 2. This is the mathematics of clocks, calendars, and cryptography. RSA encryption protects internet traffic using the fact that x^e mod n is easy to compute but the inverse (finding x from the result) is computationally infeasible for large primes.",
    },
    {
      question: "Why can't the divisor be zero?",
      answer:
        "Division by zero is undefined because there is no number that, when multiplied by zero, gives a nonzero dividend. Dividing 17 by 0 would require a number q where 0 × q = 17 — impossible. The modulo operation r = x − y × ⌊x/y⌋ inherits this restriction: ⌊x/0⌋ is undefined. In limits, x/0 approaches ±∞ depending on the sign of x, but infinity is not a valid finite result for arithmetic. All programming languages and calculators correctly reject division by zero.",
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


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Where Modulo Arithmetic Appears in Practice
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The modulo operation (a mod n) returns the remainder after dividing a by n. This seemingly simple operation is one of the most used in computer programming. Checking if a number is even: n mod 2 = 0. Wrapping an array index: index = (current + 1) mod length. Generating a cyclical sequence: values cycle through 0, 1, 2, ... n-1 endlessly. Any algorithm that needs to restart at zero after reaching a limit uses modulo.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calendar calculations rely on modulo. The day of the week follows a mod-7 cycle: if today is Wednesday (day 3), what day is it 100 days from now? (3 + 100) mod 7 = 5 = Friday. This is the same arithmetic behind Zeller's congruence, the formula used to determine day-of-week for any date in history. Leap year detection uses modulo: a year is a leap year if (year mod 4 = 0) and (year mod 100 != 0 or year mod 400 = 0).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cryptography uses modular arithmetic as its core operation. The RSA algorithm encrypts a message M as C = M^e mod n and decrypts as M = C^d mod n. The security depends on the difficulty of computing discrete logarithms in modular arithmetic without knowing the private exponent d. Even simple Caesar ciphers use modulo: shift each letter by k positions, with wrap-around handled by (letter + k) mod 26.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Hash functions and checksums use modulo to fit values into fixed ranges. A hash table with 16 buckets assigns each key to bucket = hash(key) mod 16. Credit card validation (Luhn algorithm) repeatedly applies modulo 10. ISBN-10 validation uses modulo 11. Anywhere a large number must map to a bounded range, modulo is the mechanism.
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