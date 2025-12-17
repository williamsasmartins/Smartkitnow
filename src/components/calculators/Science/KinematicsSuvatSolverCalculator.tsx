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
// ⚠️ SAFE ICONS ONLY
import {
  Atom,
  RotateCcw,
  AlertTriangle,
  Info,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const G = 9.81; // m/s², gravitational acceleration (not directly used here but for reference)

const SUVAT_VARIABLES = [
  { symbol: "s", description: "Displacement (meters)" },
  { symbol: "u", description: "Initial velocity (m/s)" },
  { symbol: "v", description: "Final velocity (m/s)" },
  { symbol: "a", description: "Acceleration (m/s²)" },
  { symbol: "t", description: "Time (seconds)" },
];

// SUVAT equations:
// 1) v = u + at
// 2) s = ut + ½at²
// 3) s = vt − ½at²
// 4) v² = u² + 2as
// 5) s = ((u + v)/2) t

// We require exactly 3 known variables to solve for the other 2.

function roundOrExp(val: number): string {
  if (val === 0) return "0";
  if (Math.abs(val) >= 10000 || Math.abs(val) < 0.001) {
    return val.toExponential(4);
  }
  return val.toFixed(4);
}

function isValidNumber(val: any): val is number {
  return typeof val === "number" && !isNaN(val);
}

export default function KinematicsSuvatSolverCalculator() {
  // Inputs: s, u, v, a, t (all optional numbers)
  // User selects which variable to solve for (target)
  // User inputs values for the other 4 variables (some may be unknown)
  // We require exactly 3 known variables (including target unknown)

  const [targetVar, setTargetVar] = useState<"s" | "u" | "v" | "a" | "t">("s");
  const [inputs, setInputs] = useState<{
    s?: string;
    u?: string;
    v?: string;
    a?: string;
    t?: string;
  }>({});

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parse inputs to numbers or undefined
  const parsedInputs = useMemo(() => {
    const parsed: Record<string, number | undefined> = {};
    SUVAT_VARIABLES.forEach(({ symbol }) => {
      const val = inputs[symbol as keyof typeof inputs];
      if (val === undefined || val.trim() === "") {
        parsed[symbol] = undefined;
      } else {
        const num = Number(val);
        parsed[symbol] = isNaN(num) ? undefined : num;
      }
    });
    return parsed;
  }, [inputs]);

  // Count known variables (excluding target)
  const knownVarsCount = useMemo(() => {
    let count = 0;
    SUVAT_VARIABLES.forEach(({ symbol }) => {
      if (symbol !== targetVar && isValidNumber(parsedInputs[symbol])) count++;
    });
    return count;
  }, [parsedInputs, targetVar]);

  // Calculation logic
  const results = useMemo(() => {
    // Validate: Need exactly 3 known variables including target unknown
    // So knownVarsCount must be exactly 3
    if (knownVarsCount < 3) {
      return {
        value: "Waiting...",
        label: `Please enter at least 3 known variables excluding ${targetVar}`,
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (knownVarsCount > 3) {
      return {
        value: "Waiting...",
        label: `Please enter only 3 known variables excluding ${targetVar}`,
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Extract known variables for convenience
    const s = parsedInputs.s;
    const u = parsedInputs.u;
    const v = parsedInputs.v;
    const a = parsedInputs.a;
    const t = parsedInputs.t;

    // Helper to check if variable is known
    const known = (x: number | undefined) => isValidNumber(x);

    // We solve for targetVar using SUVAT equations.
    // Use the appropriate formula depending on known variables.

    // We'll try all formulas that can solve for targetVar given known variables.

    // Return { value: string, label: string, subtext: string, warning: string | null, formulaUsed: string | null }

    // 1) v = u + at
    // 2) s = ut + ½at²
    // 3) s = vt − ½at²
    // 4) v² = u² + 2as
    // 5) s = ((u + v)/2) t

    // We'll implement solving for each variable:

    // Solve for s:
    // If u, t, a known: s = ut + 0.5 a t²
    // Else if v, t, a known: s = vt - 0.5 a t²
    // Else if u, v, t known: s = ((u + v)/2) t
    // Else if u, v, a known: s = (v² - u²)/(2a)
    // Else cannot solve

    // Solve for u:
    // If v, a, t known: u = v - a t
    // Else if s, t, a known: u = (s - 0.5 a t²)/t
    // Else if s, v, t known: u = (2 s / t) - v
    // Else if v, a, s known: u = sqrt(v² - 2 a s) (careful with sqrt domain)
    // Else cannot solve

    // Solve for v:
    // If u, a, t known: v = u + a t
    // Else if s, u, t known: v = (2 s / t) - u
    // Else if u, a, s known: v = sqrt(u² + 2 a s)
    // Else cannot solve

    // Solve for a:
    // If v, u, t known: a = (v - u)/t
    // Else if s, u, t known: a = 2 (s - u t)/t²
    // Else if v, u, s known: a = (v² - u²)/(2 s)
    // Else if s, v, t known: a = 2 (v t - s)/t²
    // Else cannot solve

    // Solve for t:
    // If v, u, a known and a !== 0: t = (v - u)/a
    // Else if s, u, a known and a !== 0: solve quadratic t from s = u t + 0.5 a t²
    // Else if s, v, u known and (v + u) !== 0: t = 2 s / (v + u)
    // Else cannot solve

    // We'll implement these with domain checks.

    // Helper sqrt safe:
    const sqrtSafe = (x: number) => (x < 0 ? NaN : Math.sqrt(x));

    // Result variables
    let val: number | null = null;
    let formulaUsed: string | null = null;
    let warning: string | null = null;

    try {
      switch (targetVar) {
        case "s":
          if (known(u) && known(t) && known(a)) {
            // s = u t + 0.5 a t²
            val = u! * t! + 0.5 * a! * t! * t!;
            formulaUsed = "s = ut + ½at²";
          } else if (known(v) && known(t) && known(a)) {
            // s = v t - 0.5 a t²
            val = v! * t! - 0.5 * a! * t! * t!;
            formulaUsed = "s = vt − ½at²";
          } else if (known(u) && known(v) && known(t)) {
            // s = ((u + v)/2) t
            val = ((u! + v!) / 2) * t!;
            formulaUsed = "s = ((u + v)/2) t";
          } else if (known(u) && known(v) && known(a)) {
            // s = (v² - u²)/(2a)
            if (a === 0) {
              warning = "Acceleration a cannot be zero in this formula.";
              break;
            }
            val = (v! * v! - u! * u!) / (2 * a!);
            formulaUsed = "s = (v² - u²) / (2a)";
          }
          break;

        case "u":
          if (known(v) && known(a) && known(t)) {
            // u = v - a t
            val = v! - a! * t!;
            formulaUsed = "u = v - at";
          } else if (known(s) && known(t) && known(a)) {
            if (t === 0) {
              warning = "Time t cannot be zero in this formula.";
              break;
            }
            // u = (s - 0.5 a t²)/t
            val = (s! - 0.5 * a! * t! * t!) / t!;
            formulaUsed = "u = (s - ½at²) / t";
          } else if (known(s) && known(v) && known(t)) {
            if (t === 0) {
              warning = "Time t cannot be zero in this formula.";
              break;
            }
            // u = (2 s / t) - v
            val = (2 * s!) / t! - v!;
            formulaUsed = "u = (2s / t) - v";
          } else if (known(v) && known(a) && known(s)) {
            // u = sqrt(v² - 2 a s)
            const inside = v! * v! - 2 * a! * s!;
            if (inside < 0) {
              warning =
                "Invalid inputs: sqrt of negative number in formula for u.";
              break;
            }
            val = sqrtSafe(inside);
            formulaUsed = "u = √(v² - 2as)";
          }
          break;

        case "v":
          if (known(u) && known(a) && known(t)) {
            // v = u + a t
            val = u! + a! * t!;
            formulaUsed = "v = u + at";
          } else if (known(s) && known(u) && known(t)) {
            if (t === 0) {
              warning = "Time t cannot be zero in this formula.";
              break;
            }
            // v = (2 s / t) - u
            val = (2 * s!) / t! - u!;
            formulaUsed = "v = (2s / t) - u";
          } else if (known(u) && known(a) && known(s)) {
            // v = sqrt(u² + 2 a s)
            const inside = u! * u! + 2 * a! * s!;
            if (inside < 0) {
              warning =
                "Invalid inputs: sqrt of negative number in formula for v.";
              break;
            }
            val = sqrtSafe(inside);
            formulaUsed = "v = √(u² + 2as)";
          }
          break;

        case "a":
          if (known(v) && known(u) && known(t)) {
            if (t === 0) {
              warning = "Time t cannot be zero in this formula.";
              break;
            }
            // a = (v - u)/t
            val = (v! - u!) / t!;
            formulaUsed = "a = (v - u) / t";
          } else if (known(s) && known(u) && known(t)) {
            if (t === 0) {
              warning = "Time t cannot be zero in this formula.";
              break;
            }
            // a = 2 (s - u t)/t²
            val = (2 * (s! - u! * t!)) / (t! * t!);
            formulaUsed = "a = 2(s - ut) / t²";
          } else if (known(v) && known(u) && known(s)) {
            if (s === 0) {
              warning = "Displacement s cannot be zero in this formula.";
              break;
            }
            // a = (v² - u²)/(2 s)
            val = (v! * v! - u! * u!) / (2 * s!);
            formulaUsed = "a = (v² - u²) / (2s)";
          } else if (known(s) && known(v) && known(t)) {
            if (t === 0) {
              warning = "Time t cannot be zero in this formula.";
              break;
            }
            // a = 2 (v t - s)/t²
            val = (2 * (v! * t! - s!)) / (t! * t!);
            formulaUsed = "a = 2(vt - s) / t²";
          }
          break;

        case "t":
          if (known(v) && known(u) && known(a)) {
            if (a === 0) {
              warning = "Acceleration a cannot be zero in this formula.";
              break;
            }
            // t = (v - u)/a
            val = (v! - u!) / a!;
            formulaUsed = "t = (v - u) / a";
          } else if (known(s) && known(u) && known(a)) {
            // Solve quadratic: s = u t + 0.5 a t²
            // 0.5 a t² + u t - s = 0
            // t = [-u ± sqrt(u² + 2 a s)] / a
            const A = 0.5 * a!;
            const B = u!;
            const C = -s!;
            const discriminant = B * B - 4 * A * C;
            if (discriminant < 0) {
              warning =
                "Invalid inputs: no real roots for time t in quadratic formula.";
              break;
            }
            const sqrtD = Math.sqrt(discriminant);
            const t1 = (-B + sqrtD) / (2 * A);
            const t2 = (-B - sqrtD) / (2 * A);
            // Choose positive root if possible
            const candidates = [t1, t2].filter((x) => x >= 0);
            if (candidates.length === 0) {
              warning =
                "No positive time solution found for given inputs.";
              break;
            }
            val = Math.min(...candidates);
            formulaUsed = "t from quadratic: s = ut + ½at²";
          } else if (known(s) && known(v) && known(u)) {
            if (v! + u! === 0) {
              warning = "Sum of velocities (v + u) cannot be zero in this formula.";
              break;
            }
            // t = 2 s / (v + u)
            val = (2 * s!) / (v! + u!);
            formulaUsed = "t = 2s / (v + u)";
          }
          break;
      }
    } catch (e) {
      warning = "Error during calculation. Please check inputs.";
    }

    if (val === null || val === undefined || isNaN(val)) {
      return {
        value: "Waiting...",
        label: `Cannot solve for ${targetVar} with given inputs`,
        subtext: "",
        warning,
        formulaUsed,
      };
    }

    // Format output with units
    const unitMap: Record<string, string> = {
      s: "meters",
      u: "m/s",
      v: "m/s",
      a: "m/s²",
      t: "seconds",
    };

    const displayVal = roundOrExp(val);

    return {
      value: `${displayVal} ${unitMap[targetVar]}`,
      label: `Calculated ${targetVar}`,
      subtext: warning ? "" : `Solved using formula: ${formulaUsed}`,
      warning,
      formulaUsed,
    };
  }, [parsedInputs, targetVar, knownVarsCount]);

  // FAQs
  const faqs = [
    {
      question: "What are SUVAT equations used for?",
      answer:
        "SUVAT equations describe motion under constant acceleration and are fundamental in physics and engineering. They allow calculation of displacement, velocity, acceleration, or time when some variables are known. These equations are widely used in vehicle motion analysis, projectile trajectories, and mechanical system design.",
    },
    {
      question: "Why do I need exactly 3 known variables to solve?",
      answer:
        "SUVAT equations relate five variables with four equations, so to solve for an unknown variable, you must provide values for three others. Providing fewer than three known variables results in insufficient information, while more than three can cause ambiguity or conflicting data.",
    },
    {
      question: "How do I handle negative or zero values in inputs?",
      answer:
        "Negative values can represent direction (e.g., displacement or velocity). Zero values are valid but must be used carefully, especially for time and acceleration, as division by zero or square roots of negative numbers can occur. Always check units and physical feasibility of inputs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetVar" className="mb-1 font-semibold">
            Variable to solve for
          </Label>
          <Select
            value={targetVar}
            onValueChange={(val) => setTargetVar(val as any)}
            id="targetVar"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select variable" />
            </SelectTrigger>
            <SelectContent>
              {SUVAT_VARIABLES.map(({ symbol, description }) => (
                <SelectItem key={symbol} value={symbol}>
                  {symbol} - {description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {SUVAT_VARIABLES.filter(({ symbol }) => symbol !== targetVar).map(
          ({ symbol, description }) => (
            <div key={symbol}>
              <Label htmlFor={symbol} className="mb-1 font-semibold">
                {symbol} ({description})
              </Label>
              <Input
                id={symbol}
                type="text"
                inputMode="decimal"
                placeholder={`Enter ${symbol} value`}
                value={inputs[symbol as keyof typeof inputs] || ""}
                onChange={(e) => handleInputChange(symbol, e.target.value)}
                aria-describedby={`${symbol}-desc`}
              />
            </div>
          )
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          type="button"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({});
            setTargetVar("s");
          }}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Always check your units (e.g.,
              convert grams to kg for physics formulas). Ensure time is in
              seconds, distances in meters, velocities in meters per second,
              and acceleration in meters per second squared.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Kinematics Equations Solver (SUVAT)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The SUVAT equations are a set of five fundamental formulas used in
          classical mechanics to describe the motion of objects under constant
          acceleration. The acronym SUVAT stands for displacement (s), initial
          velocity (u), final velocity (v), acceleration (a), and time (t). These
          equations relate these variables and allow you to solve for an unknown
          quantity when three of the others are known.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These equations are essential in physics education and practical
          engineering applications such as vehicle dynamics, projectile motion,
          and mechanical system design. They assume uniform acceleration, which
          means acceleration remains constant throughout the motion.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          When using these equations, it is crucial to maintain consistent units
          and carefully interpret the direction of vectors. For example, if an
          object moves backward, displacement or velocity may be negative. Also,
          time &gt; 0 and acceleration can be positive or negative depending on
          the scenario.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`1) v = u + at
2) s = ut + ½at²
3) s = vt − ½at²
4) v² = u² + 2as
5) s = ((u + v)/2) t

Where:
s = displacement (meters)
u = initial velocity (m/s)
v = final velocity (m/s)
a = acceleration (m/s²)
t = time (seconds)

Note: Use &lt; and &gt; for inequalities in text.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the SUVAT equations:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A car starts from rest (u = 0 m/s) and
            accelerates uniformly at 3 m/s² for 5 seconds (a = 3 m/s², t = 5 s).
          </li>
          <li>
            <strong>Step 1:</strong> Calculate the final velocity using v = u + at:
            v = 0 + 3 × 5 = 15 m/s.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate the displacement using s = ut + ½at²:
            s = 0 × 5 + 0.5 × 3 × 5² = 37.5 meters.
          </li>
          <li>
            <strong>Result:</strong> After 5 seconds, the car reaches 15 m/s and
            has traveled 37.5 meters.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
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
      title="Kinematics Equations Solver (SUVAT)"
      description="Solve motion problems using SUVAT equations. Calculate displacement, initial/final velocity, acceleration, and time for uniform acceleration."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `1) v = u + at
2) s = ut + ½at²
3) s = vt − ½at²
4) v² = u² + 2as
5) s = ((u + v)/2) t`,
        variables: SUVAT_VARIABLES,
      }}
      example={{
        title: "Example",
        scenario:
          "A car starts from rest and accelerates uniformly at 3 m/s² for 5 seconds. Calculate its final velocity and displacement.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate final velocity using v = u + at: v = 0 + 3 × 5 = 15 m/s.",
          },
          {
            label: "2",
            explanation:
              "Calculate displacement using s = ut + ½at²: s = 0 × 5 + 0.5 × 3 × 5² = 37.5 meters.",
          },
        ],
        result:
          "After 5 seconds, the car reaches 15 m/s and has traveled 37.5 meters.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}