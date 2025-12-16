import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sigma,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  FunctionSquare,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

function factorial(num: number): number {
  if (num < 0) return NaN;
  if (num === 0 || num === 1) return 1;
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  return result;
}

export default function PermutationsCombinationsNprNcrCalculator() {
  const [inputs, setInputs] = useState({
    n: "",
    r: "",
    type: "nPr",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const nRaw = inputs.n.trim();
    const rRaw = inputs.r.trim();
    const type = inputs.type;

    if (nRaw === "" || rRaw === "") {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const n = Number(nRaw);
    const r = Number(rRaw);

    if (
      Number.isNaN(n) ||
      Number.isNaN(r) ||
      !Number.isInteger(n) ||
      !Number.isInteger(r)
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Inputs must be integers.",
        formulaUsed: "",
      };
    }

    if (n < 0 || r < 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Inputs must be non-negative integers.",
        formulaUsed: "",
      };
    }

    if (r > n) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "r cannot be greater than n.",
        formulaUsed: "",
      };
    }

    // Calculate factorials once for efficiency
    const factN = factorial(n);
    const factR = factorial(r);
    const factNMinusR = factorial(n - r);

    if (
      Number.isNaN(factN) ||
      Number.isNaN(factR) ||
      Number.isNaN(factNMinusR) ||
      !isFinite(factN) ||
      !isFinite(factR) ||
      !isFinite(factNMinusR)
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Input values are too large to compute factorial safely in JavaScript.",
        formulaUsed: "",
      };
    }

    if (type === "nPr") {
      // Permutations: nPr = n! / (n-r)!
      const val = factN / factNMinusR;
      return {
        value: val.toFixed(4),
        label: `Number of permutations of ${r} items from ${n}`,
        subtext:
          "Permutations count arrangements where order matters.",
        warning: null,
        formulaUsed: "nPr = n! / (n - r)!",
      };
    } else {
      // Combinations: nCr = n! / (r! * (n-r)!)
      const val = factN / (factR * factNMinusR);
      return {
        value: val.toFixed(4),
        label: `Number of combinations of ${r} items from ${n}`,
        subtext:
          "Combinations count selections where order does not matter.",
        warning: null,
        formulaUsed: "nCr = n! / (r! × (n - r)!)",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between permutations and combinations?",
      answer:
        "Permutations consider the order of items, meaning different arrangements count as distinct. Combinations do not consider order; only the selection matters. For example, selecting ABC is the same as BAC in combinations but different in permutations.",
    },
    {
      question: "Can n or r be negative or non-integers?",
      answer:
        "No. Both n and r must be non-negative integers because factorials and these formulas are defined only for whole numbers. Negative or fractional inputs are invalid and will produce warnings.",
    },
    {
      question: "What happens if r is greater than n?",
      answer:
        "If r is greater than n, the calculation is invalid because you cannot select or arrange more items than available. The tool will warn you to input valid values where r ≤ n.",
    },
    {
      question: "Why do results have decimal places if permutations and combinations are integers?",
      answer:
        "The tool formats results with four decimal places for consistency and precision. However, permutations and combinations always yield integer values, so decimals will be .0000 in valid cases.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="n-input" className="mb-1 font-semibold">
            Total items (n)
          </Label>
          <Input
            id="n-input"
            type="number"
            min={0}
            step={1}
            placeholder="Enter n"
            value={inputs.n}
            onChange={(e) => handleInputChange("n", e.target.value)}
            aria-describedby="n-desc"
          />
          <p
            id="n-desc"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Total number of items in the set (n ≥ 0)
          </p>
        </div>

        <div>
          <Label htmlFor="r-input" className="mb-1 font-semibold">
            Selected items (r)
          </Label>
          <Input
            id="r-input"
            type="number"
            min={0}
            step={1}
            placeholder="Enter r"
            value={inputs.r}
            onChange={(e) => handleInputChange("r", e.target.value)}
            aria-describedby="r-desc"
          />
          <p
            id="r-desc"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Number of items selected or arranged (r ≥ 0)
          </p>
        </div>

        <div>
          <Label htmlFor="type-select" className="mb-1 font-semibold">
            Calculation Type
          </Label>
          <Select
            onValueChange={(val) => handleInputChange("type", val)}
            value={inputs.type}
            id="type-select"
            aria-describedby="type-desc"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select calculation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nPr">Permutations (nPr)</SelectItem>
              <SelectItem value="nCr">Combinations (nCr)</SelectItem>
            </SelectContent>
          </Select>
          <p
            id="type-desc"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Choose whether order matters (permutations) or not (combinations)
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
          aria-label="Calculate permutations or combinations"
        >
          <Sigma className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ n: "", r: "", type: "nPr" })}
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
          Understanding Permutations &amp; Combinations (nPr / nCr)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Permutations and combinations are fundamental concepts in combinatorics,
          a branch of mathematics concerned with counting, arrangement, and selection
          of objects. Permutations (denoted as nPr) count the number of ways to arrange
          <em>r</em> items out of <em>n</em> distinct items where order matters.
          Combinations (denoted as nCr) count the number of ways to select <em>r</em>
          items from <em>n</em> distinct items where order does not matter.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These concepts are widely used in probability, statistics, and various fields
          requiring enumeration of possibilities. Understanding the difference between
          permutations and combinations is crucial: permutations consider different
          orders as unique, while combinations treat different orders as the same selection.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool allows you to calculate both permutations and combinations easily,
          ensuring accurate results with proper input validation and clear explanations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Permutations (nPr):
nPr = n! / (n - r)!

Combinations (nCr):
nCr = n! / (r! × (n - r)!)

Where:
- n! (n factorial) = n × (n-1) × (n-2) × ... × 1
- r! (r factorial) = r × (r-1) × (r-2) × ... × 1
- (n - r)! = factorial of (n - r)

Note: Factorial of 0 is defined as 1.`}
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
      title="Permutations &amp; Combinations (nPr / nCr)"
      description="Calculate permutations (nPr) and combinations (nCr). Determine the number of ways to arrange or select items from a set."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formula",
        formula: `Permutations (nPr): nPr = n! / (n - r)!
Combinations (nCr): nCr = n! / (r! × (n - r)!)`,
        variables: [
          { symbol: "n", description: "Total number of distinct items" },
          { symbol: "r", description: "Number of items selected or arranged" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the number of ways to select 3 students from a group of 5.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify n = 5 (total students) and r = 3 (students to select).",
          },
          {
            label: "2",
            explanation:
              "For combinations (order does not matter), use nCr = 5! / (3! × (5-3)!)",
          },
          {
            label: "3",
            explanation:
              "Calculate factorials: 5! = 120, 3! = 6, 2! = 2.",
          },
          {
            label: "4",
            explanation:
              "Compute nCr = 120 / (6 × 2) = 120 / 12 = 10 ways.",
          },
        ],
        result: "There are 10 ways to select 3 students from 5.",
      }}
      relatedCalculators={[
        {
          title: "Linear Equation Solver",
          url: "/math/linear-equation-solver",
          icon: "📈",
        },
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
          title: "Percent of Total",
          url: "/math/percent-of-total",
          icon: "➗",
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