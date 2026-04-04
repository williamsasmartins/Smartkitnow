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

function factorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function combination(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

export default function BinomialProbabilityCalculator() {
  const [inputs, setInputs] = useState({
    n: "",
    p: "",
    x: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only valid numeric input with decimals for p
    if (name === "n" || name === "x") {
      // integers only
      if (/^\d*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
    } else if (name === "p") {
      // decimal between 0 and 1
      if (/^(\d*\.?\d*)$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
    }
  }, []);

  const results = useMemo(() => {
    const n = Number(inputs.n);
    const p = Number(inputs.p);
    const x = Number(inputs.x);

    // Validate inputs
    if (
      !Number.isInteger(n) ||
      !Number.isInteger(x) ||
      n <= 0 ||
      x < 0 ||
      x > n ||
      isNaN(p) ||
      p < 0 ||
      p > 1
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Please enter valid inputs: n &gt; 0, 0 ≤ x ≤ n, and 0 ≤ p ≤ 1.",
        formulaUsed: "Binomial Probability Formula",
      };
    }

    // Calculate binomial probability: P(X = x) = C(n,x) * p^x * (1-p)^(n-x)
    const comb = combination(n, x);
    const prob = comb * Math.pow(p, x) * Math.pow(1 - p, n - x);

    return {
      value: prob.toFixed(4),
      label: `Probability of exactly ${x} success${x !== 1 ? "es" : ""} in ${n} trials`,
      subtext: `Using p = ${p.toFixed(4)}`,
      warning: null,
      formulaUsed: "Binomial Probability Formula",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the binomial probability?",
      answer:
        "Binomial probability calculates the likelihood of obtaining exactly a specified number of successes in a fixed number of independent trials, each with the same probability of success. It is widely used in statistics and probability theory to model binary outcomes such as success/failure or yes/no scenarios.",
    },
    {
      question: "How do I interpret the probability result?",
      answer:
        "The result represents the chance that the exact number of successes you specify will occur in the given number of trials. For example, a result of 0.25 means there is a 25% chance of that outcome happening under the given conditions.",
    },
    {
      question: "What are the input constraints for this calculator?",
      answer:
        "The number of trials (n) must be a positive integer, the number of successes (x) must be an integer between 0 and n inclusive, and the probability of success (p) must be a decimal between 0 and 1 inclusive.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="n" className="flex items-center gap-1 font-semibold">
            Number of Trials (n) <Calculator className="w-4 h-4" />
          </Label>
          <Input
            id="n"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 10"
            value={inputs.n}
            onChange={(e) => handleInputChange("n", e.target.value)}
            aria-describedby="n-desc"
          />
          <p id="n-desc" className="text-xs text-slate-500 mt-1">
            Positive integer &gt; 0
          </p>
        </div>

        <div>
          <Label htmlFor="p" className="flex items-center gap-1 font-semibold">
            Probability of Success (p) <FunctionSquare className="w-4 h-4" />
          </Label>
          <Input
            id="p"
            type="text"
            inputMode="decimal"
            placeholder="0 to 1"
            value={inputs.p}
            onChange={(e) => handleInputChange("p", e.target.value)}
            aria-describedby="p-desc"
          />
          <p id="p-desc" className="text-xs text-slate-500 mt-1">
            Decimal between 0 and 1 inclusive
          </p>
        </div>

        <div>
          <Label htmlFor="x" className="flex items-center gap-1 font-semibold">
            Number of Successes (x) <Sigma className="w-4 h-4" />
          </Label>
          <Input
            id="x"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0 to n"
            value={inputs.x}
            onChange={(e) => handleInputChange("x", e.target.value)}
            aria-describedby="x-desc"
          />
          <p id="x-desc" className="text-xs text-slate-500 mt-1">
            Integer between 0 and n inclusive
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate binomial probability"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ n: "", p: "", x: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
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
          Understanding Binomial Probability Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Binomial Probability Calculator is a powerful mathematical tool
          designed to determine the likelihood of achieving a specific number of
          successes in a fixed number of independent trials. Each trial has only
          two possible outcomes: success or failure, and the probability of
          success remains constant throughout the trials. This calculator is
          essential for statisticians, researchers, and students who work with
          binomial distributions in fields such as biology, finance, and quality
          control.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting the total number of trials (n), the probability of success
          in each trial (p), and the desired number of successes (x), the
          calculator computes the exact probability that the event will occur
          exactly x times. This helps in making informed decisions based on
          probabilistic outcomes and understanding the behavior of binary random
          processes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The binomial model assumes that trials are independent, meaning the
          outcome of one trial does not affect another. This assumption is
          critical for the accuracy of the results. The calculator also ensures
          input validation to maintain mathematical correctness and provide
          reliable outputs.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
          {`P(X = x) = C(n, x) * p^x * (1 - p)^{n - x}

where:
  - C(n, x) = n! / (x! * (n - x)!)
  - n = number of trials
  - x = number of successes
  - p = probability of success in a single trial`}
        </pre>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Binomial Probability in Quality Control and Statistics
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The binomial probability model applies when you have a fixed number of independent trials, each with exactly two outcomes (success or failure) and a constant success probability. Coin flipping is the textbook example, but real applications are everywhere: manufacturing defect rates, clinical trial response rates, A/B test conversion rates, and survey response patterns all follow binomial distributions when each unit is independent.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Quality control uses binomial probability to set acceptance sampling rules. If a production line has a 2% defect rate (p=0.02) and you sample 50 units, the probability of finding zero defects is (1-0.02)^50 = 0.364. The probability of finding 3 or more defects is 1 minus the cumulative probability of 0, 1, or 2 defects. Acceptance sampling plans specify a rejection threshold — typically the number of defects where the probability of seeing that many from acceptable-quality production falls below 5%.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A/B testing in web analytics applies binomial testing. Button A converts 5.2% of visitors (control); Button B converts 6.1% (variant). With 1,000 visitors each, is this difference statistically significant? The null hypothesis is that both buttons have the same true conversion rate. The binomial test (or its normal approximation for large samples) calculates the probability of observing this size difference by chance. If p-value &lt; 0.05, the difference is significant.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The normal approximation to the binomial is accurate when np >= 10 and n(1-p) >= 10. For n=1000 and p=0.05: np=50 and n(1-p)=950 — both well above 10, so use the normal approximation with mean = np = 50 and standard deviation = sqrt(np(1-p)) = sqrt(47.5) = 6.89. This simplifies probability calculations for large samples where computing exact binomial probabilities is computationally intensive.
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
      title="Binomial Probability Calculator"
      description="Calculate Binomial Probability. Determine the likelihood of a specific number of successes in a series of independent experiments."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `P(X = x) = C(n, x) * p^x * (1 - p)^{n - x}`,
        variables: [
          { symbol: "n", description: "Number of trials (positive integer)" },
          { symbol: "x", description: "Number of successes (integer, 0 ≤ x ≤ n)" },
          { symbol: "p", description: "Probability of success in each trial (0 ≤ p ≤ 1)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Suppose you flip a fair coin 10 times (n = 10), and you want to find the probability of getting exactly 4 heads (x = 4). The probability of heads in each flip is 0.5 (p = 0.5).",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the number of combinations C(10, 4) = 210.",
          },
          {
            label: "2",
            explanation:
              "Calculate p^x = 0.5^4 = 0.0625.",
          },
          {
            label: "3",
            explanation:
              "Calculate (1 - p)^{n - x} = 0.5^{6} = 0.015625.",
          },
          {
            label: "4",
            explanation:
              "Multiply all: 210 * 0.0625 * 0.015625 = 0.2051.",
          },
        ],
        result:
          "The probability of getting exactly 4 heads in 10 flips is approximately 0.2051.",
      }}
      relatedCalculators={[
        { title: "Percent of Total", url: "/math/percent-of-total", icon: "➗" },
        {
          title: "Standard Deviation",
          url: "/math/standard-deviation-variance",
          icon: "📊",
        },
        {
          title: "Quadratic Equation Solver",
          url: "/math/quadratic-equation-solver",
          icon: "📐",
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