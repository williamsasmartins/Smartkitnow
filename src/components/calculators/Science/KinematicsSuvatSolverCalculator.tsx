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

const SUVAT_VARIABLES = ["s", "u", "v", "a", "t"] as const;
type SuvatVar = typeof SUVAT_VARIABLES[number];

// SUVAT equations:
// 1) v = u + at
// 2) s = ut + 1/2 a t²
// 3) v² = u² + 2as
// 4) s = vt - 1/2 a t²
// 5) s = (u + v)/2 * t

// We will allow user to input any 3 known variables and solve for the 4th unknown (except t which is tricky).
// For simplicity, user selects which variable to solve for, inputs the others, and we calculate the unknown.

export default function KinematicsSuvatSolverCalculator() {
  // Inputs: which variable to solve for, and values for the others
  const [solveFor, setSolveFor] = useState<SuvatVar>("s");
  const [inputs, setInputs] = useState<Partial<Record<SuvatVar, string>>>({});

  const handleInputChange = useCallback(
    (name: SuvatVar, value: string) => {
      setInputs((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Parsing inputs to numbers or NaN
  const parsedInputs = useMemo(() => {
    const parsed: Partial<Record<SuvatVar, number>> = {};
    SUVAT_VARIABLES.forEach((v) => {
      const val = inputs[v];
      if (val !== undefined && val.trim() !== "") {
        const n = Number(val);
        parsed[v] = isNaN(n) ? NaN : n;
      }
    });
    return parsed;
  }, [inputs]);

  // Validation helper: check if a number is valid (not NaN and finite)
  const isValidNumber = (n: number | undefined) =>
    typeof n === "number" && !isNaN(n) && isFinite(n);

  // Calculation logic in useMemo
  const results = useMemo(() => {
    // We need at least 3 known variables (except the one to solve for)
    const knownVars = SUVAT_VARIABLES.filter(
      (v) => v !== solveFor && isValidNumber(parsedInputs[v])
    );

    if (knownVars.length < 3) {
      return {
        value: "Waiting...",
        label: "Enter at least 3 known values",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Extract known values safely
    const s = parsedInputs.s;
    const u = parsedInputs.u;
    const v = parsedInputs.v;
    const a = parsedInputs.a;
    const t = parsedInputs.t;

    // We'll try to solve for solveFor variable using SUVAT equations
    // Return value with units and formula used

    // Helper to format output with units
    function formatValue(val: number, unit: string) {
      if (Math.abs(val) >= 10000 || (Math.abs(val) > 0 && Math.abs(val) < 0.001)) {
        return val.toExponential(4) + " " + unit;
      }
      return val.toFixed(4) + " " + unit;
    }

    // Solve for s (displacement, meters)
    if (solveFor === "s") {
      // Use s = ut + 1/2 a t² if u,a,t known
      if (isValidNumber(u) && isValidNumber(a) && isValidNumber(t)) {
        const val = u! * t! + 0.5 * a! * t! * t!;
        return {
          value: formatValue(val, "meters"),
          label: "Displacement (s)",
          subtext: "Using s = ut + 1/2 a t²",
          warning: null,
          formulaUsed: "s = ut + 1/2 a t²",
        };
      }
      // Use s = (u + v)/2 * t if u,v,t known
      if (isValidNumber(u) && isValidNumber(v) && isValidNumber(t)) {
        const val = ((u! + v!) / 2) * t!;
        return {
          value: formatValue(val, "meters"),
          label: "Displacement (s)",
          subtext: "Using s = (u + v)/2 × t",
          warning: null,
          formulaUsed: "s = (u + v)/2 × t",
        };
      }
      // Use s = (v² - u²) / (2a) if v,u,a known and a ≠ 0
      if (
        isValidNumber(v) &&
        isValidNumber(u) &&
        isValidNumber(a) &&
        a !== 0
      ) {
        const val = (v! * v! - u! * u!) / (2 * a!);
        return {
          value: formatValue(val, "meters"),
          label: "Displacement (s)",
          subtext: "Using s = (v² - u²) / 2a",
          warning: null,
          formulaUsed: "s = (v² - u²) / 2a",
        };
      }
      return {
        value: "Insufficient or incompatible inputs",
        label: "Displacement (s)",
        subtext: "",
        warning:
          "Provide appropriate known variables to solve for displacement (s).",
        formulaUsed: null,
      };
    }

    // Solve for u (initial velocity, m/s)
    if (solveFor === "u") {
      // Use v = u + at => u = v - at if v,a,t known
      if (isValidNumber(v) && isValidNumber(a) && isValidNumber(t)) {
        const val = v! - a! * t!;
        return {
          value: formatValue(val, "m/s"),
          label: "Initial Velocity (u)",
          subtext: "Using u = v - at",
          warning: null,
          formulaUsed: "v = u + at",
        };
      }
      // Use s = ut + 1/2 a t² => u = (s - 1/2 a t²)/t if s,a,t known and t ≠ 0
      if (isValidNumber(s) && isValidNumber(a) && isValidNumber(t) && t !== 0) {
        const val = (s! - 0.5 * a! * t! * t!) / t!;
        return {
          value: formatValue(val, "m/s"),
          label: "Initial Velocity (u)",
          subtext: "Using s = ut + 1/2 a t²",
          warning: null,
          formulaUsed: "s = ut + 1/2 a t²",
        };
      }
      // Use v² = u² + 2as => u = sqrt(v² - 2as) if v,a,s known and inside sqrt ≥ 0
      if (
        isValidNumber(v) &&
        isValidNumber(a) &&
        isValidNumber(s) &&
        v! * v! - 2 * a! * s! >= 0
      ) {
        const val = Math.sqrt(v! * v! - 2 * a! * s!);
        return {
          value: formatValue(val, "m/s"),
          label: "Initial Velocity (u)",
          subtext: "Using v² = u² + 2as",
          warning: null,
          formulaUsed: "v² = u² + 2as",
        };
      }
      return {
        value: "Insufficient or incompatible inputs",
        label: "Initial Velocity (u)",
        subtext: "",
        warning:
          "Provide appropriate known variables to solve for initial velocity (u).",
        formulaUsed: null,
      };
    }

    // Solve for v (final velocity, m/s)
    if (solveFor === "v") {
      // Use v = u + at if u,a,t known
      if (isValidNumber(u) && isValidNumber(a) && isValidNumber(t)) {
        const val = u! + a! * t!;
        return {
          value: formatValue(val, "m/s"),
          label: "Final Velocity (v)",
          subtext: "Using v = u + at",
          warning: null,
          formulaUsed: "v = u + at",
        };
      }
      // Use v² = u² + 2as if u,a,s known and inside sqrt ≥ 0
      if (
        isValidNumber(u) &&
        isValidNumber(a) &&
        isValidNumber(s) &&
        u! * u! + 2 * a! * s! >= 0
      ) {
        const val = Math.sqrt(u! * u! + 2 * a! * s!);
        return {
          value: formatValue(val, "m/s"),
          label: "Final Velocity (v)",
          subtext: "Using v² = u² + 2as",
          warning: null,
          formulaUsed: "v² = u² + 2as",
        };
      }
      // Use s = (u + v)/2 * t => v = (2s / t) - u if s,u,t known and t ≠ 0
      if (isValidNumber(s) && isValidNumber(u) && isValidNumber(t) && t !== 0) {
        const val = (2 * s!) / t! - u!;
        return {
          value: formatValue(val, "m/s"),
          label: "Final Velocity (v)",
          subtext: "Using s = (u + v)/2 × t",
          warning: null,
          formulaUsed: "s = (u + v)/2 × t",
        };
      }
      return {
        value: "Insufficient or incompatible inputs",
        label: "Final Velocity (v)",
        subtext: "",
        warning:
          "Provide appropriate known variables to solve for final velocity (v).",
        formulaUsed: null,
      };
    }

    // Solve for a (acceleration, m/s²)
    if (solveFor === "a") {
      // Use v = u + at => a = (v - u)/t if v,u,t known and t ≠ 0
      if (isValidNumber(v) && isValidNumber(u) && isValidNumber(t) && t !== 0) {
        const val = (v! - u!) / t!;
        return {
          value: formatValue(val, "m/s²"),
          label: "Acceleration (a)",
          subtext: "Using a = (v - u)/t",
          warning: null,
          formulaUsed: "v = u + at",
        };
      }
      // Use s = ut + 1/2 a t² => a = 2(s - ut)/t² if s,u,t known and t ≠ 0
      if (isValidNumber(s) && isValidNumber(u) && isValidNumber(t) && t !== 0) {
        const val = (2 * (s! - u! * t!)) / (t! * t!);
        return {
          value: formatValue(val, "m/s²"),
          label: "Acceleration (a)",
          subtext: "Using s = ut + 1/2 a t²",
          warning: null,
          formulaUsed: "s = ut + 1/2 a t²",
        };
      }
      // Use v² = u² + 2as => a = (v² - u²)/(2s) if v,u,s known and s ≠ 0
      if (
        isValidNumber(v) &&
        isValidNumber(u) &&
        isValidNumber(s) &&
        s !== 0
      ) {
        const val = (v! * v! - u! * u!) / (2 * s!);
        return {
          value: formatValue(val, "m/s²"),
          label: "Acceleration (a)",
          subtext: "Using v² = u² + 2as",
          warning: null,
          formulaUsed: "v² = u² + 2as",
        };
      }
      return {
        value: "Insufficient or incompatible inputs",
        label: "Acceleration (a)",
        subtext: "",
        warning:
          "Provide appropriate known variables to solve for acceleration (a).",
        formulaUsed: null,
      };
    }

    // Solve for t (time, seconds)
    if (solveFor === "t") {
      // Use v = u + at => t = (v - u)/a if v,u,a known and a ≠ 0
      if (isValidNumber(v) && isValidNumber(u) && isValidNumber(a) && a !== 0) {
        const val = (v! - u!) / a!;
        if (val < 0) {
          return {
            value: formatValue(val, "s"),
            label: "Time (t)",
            subtext: "Using t = (v - u)/a",
            warning:
              "Calculated time is negative; check input values for physical validity.",
            formulaUsed: "v = u + at",
          };
        }
        return {
          value: formatValue(val, "s"),
          label: "Time (t)",
          subtext: "Using t = (v - u)/a",
          warning: null,
          formulaUsed: "v = u + at",
        };
      }
      // Use s = ut + 1/2 a t² => quadratic in t: 1/2 a t² + u t - s = 0
      if (isValidNumber(s) && isValidNumber(u) && isValidNumber(a)) {
        const A = 0.5 * a!;
        const B = u!;
        const C = -s!;
        const discriminant = B * B - 4 * A * C;
        if (discriminant < 0) {
          return {
            value: "No real solution for time",
            label: "Time (t)",
            subtext: "",
            warning:
              "Discriminant is negative; no real time solution for given inputs.",
            formulaUsed: "s = ut + 1/2 a t²",
          };
        }
        const sqrtD = Math.sqrt(discriminant);
        const t1 = (-B + sqrtD) / (2 * A);
        const t2 = (-B - sqrtD) / (2 * A);
        // Choose positive time if possible
        const val =
          t1 >= 0 && t2 >= 0
            ? Math.min(t1, t2)
            : t1 >= 0
            ? t1
            : t2 >= 0
            ? t2
            : NaN;
        if (isNaN(val)) {
          return {
            value: "No positive real solution for time",
            label: "Time (t)",
            subtext: "",
            warning:
              "Both solutions for time are negative; check input values.",
            formulaUsed: "s = ut + 1/2 a t²",
          };
        }
        return {
          value: formatValue(val, "s"),
          label: "Time (t)",
          subtext: "Using quadratic formula on s = ut + 1/2 a t²",
          warning: null,
          formulaUsed: "s = ut + 1/2 a t²",
        };
      }
      // Use s = (u + v)/2 * t => t = 2s / (u + v) if s,u,v known and denominator ≠ 0
      if (
        isValidNumber(s) &&
        isValidNumber(u) &&
        isValidNumber(v) &&
        u! + v! !== 0
      ) {
        const val = (2 * s!) / (u! + v!);
        if (val < 0) {
          return {
            value: formatValue(val, "s"),
            label: "Time (t)",
            subtext: "Using t = 2s / (u + v)",
            warning:
              "Calculated time is negative; check input values for physical validity.",
            formulaUsed: "s = (u + v)/2 × t",
          };
        }
        return {
          value: formatValue(val, "s"),
          label: "Time (t)",
          subtext: "Using t = 2s / (u + v)",
          warning: null,
          formulaUsed: "s = (u + v)/2 × t",
        };
      }
      return {
        value: "Insufficient or incompatible inputs",
        label: "Time (t)",
        subtext: "",
        warning:
          "Provide appropriate known variables to solve for time (t).",
        formulaUsed: null,
      };
    }

    return {
      value: "Unknown error",
      label: "",
      subtext: "",
      warning: "Unexpected error in calculation.",
      formulaUsed: null,
    };
  }, [parsedInputs, solveFor]);

  // FAQs
  const faqs = [
    {
      question: "What are SUVAT equations used for?",
      answer:
        "SUVAT equations describe motion under constant acceleration and are essential in physics to solve problems involving displacement, velocity, acceleration, and time. They are widely used in engineering, automotive design, and aerospace to predict object trajectories and optimize performance.",
    },
    {
      question: "Why must units be consistent in SUVAT calculations?",
      answer:
        "Consistent units ensure accurate results when applying SUVAT equations. Mixing units like meters with kilometers or seconds with minutes leads to incorrect answers. Always convert all inputs to SI units (meters, seconds, meters per second squared) before calculating.",
    },
    {
      question: "Can SUVAT equations be used for non-constant acceleration?",
      answer:
        "No, SUVAT equations assume uniform (constant) acceleration. For variable acceleration, calculus-based methods or numerical simulations are required. SUVAT provides simplified solutions for many practical scenarios with steady acceleration.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Select variable to solve for */}
      <div>
        <Label htmlFor="solveFor" className="mb-1 font-semibold">
          Select variable to solve for:
        </Label>
        <Select
          value={solveFor}
          onValueChange={(val) => {
            setSolveFor(val as SuvatVar);
            // Clear the solved variable input on change
            setInputs((prev) => ({ ...prev, [val as SuvatVar]: "" }));
          }}
          id="solveFor"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select variable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s">Displacement (s) - meters</SelectItem>
            <SelectItem value="u">Initial Velocity (u) - m/s</SelectItem>
            <SelectItem value="v">Final Velocity (v) - m/s</SelectItem>
            <SelectItem value="a">Acceleration (a) - m/s²</SelectItem>
            <SelectItem value="t">Time (t) - seconds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs for other variables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUVAT_VARIABLES.filter((v) => v !== solveFor).map((v) => {
          let label = "";
          let placeholder = "";
          switch (v) {
            case "s":
              label = "Displacement (s) in meters";
              placeholder = "e.g. 100";
              break;
            case "u":
              label = "Initial Velocity (u) in m/s";
              placeholder = "e.g. 0";
              break;
            case "v":
              label = "Final Velocity (v) in m/s";
              placeholder = "e.g. 20";
              break;
            case "a":
              label = "Acceleration (a) in m/s²";
              placeholder = "e.g. 9.81";
              break;
            case "t":
              label = "Time (t) in seconds";
              placeholder = "e.g. 5";
              break;
          }
          return (
            <div key={v}>
              <Label htmlFor={v} className="mb-1 font-semibold">
                {label}
              </Label>
              <Input
                id={v}
                type="number"
                step="any"
                value={inputs[v] || ""}
                placeholder={placeholder}
                onChange={(e) => handleInputChange(v, e.target.value)}
                aria-label={label}
              />
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          type="button"
          aria-label="Calculate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({});
          }}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
          aria-label="Reset inputs"
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
              <strong>Science Fact:</strong> Always check your units (e.g., convert
              grams to kg for physics formulas). Use meters (m), seconds (s), and
              meters per second squared (m/s²) for consistent results.
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
          The SUVAT equations are a set of five fundamental formulas in classical
          mechanics that describe the motion of objects under constant acceleration.
          The acronym SUVAT stands for displacement (s), initial velocity (u), final
          velocity (v), acceleration (a), and time (t). These equations allow you to
          calculate any one of these variables if the other three are known.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These equations are widely used in physics education and practical
          engineering problems, such as calculating the trajectory of vehicles,
          projectiles, or any object moving with uniform acceleration. They provide
          a straightforward way to analyze linear motion without the need for
          calculus.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that these equations apply only when acceleration is constant. For
          motions where acceleration changes over time, more advanced methods are
          required. Always ensure your input values use consistent units to avoid
          errors.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`1) v = u + at
2) s = ut + 1/2 a t²
3) v² = u² + 2as
4) s = vt - 1/2 a t²
5) s = (u + v)/2 × t

Where:
s = displacement (meters)
u = initial velocity (meters/second)
v = final velocity (meters/second)
a = acceleration (meters/second²)
t = time (seconds)`}
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
            <strong>Given:</strong> A car starts from rest (u = 0 m/s) and accelerates
            uniformly at 3 m/s² for 5 seconds (t = 5 s). Find the displacement (s)
            and final velocity (v).
          </li>
          <li>
            <strong>Step 1:</strong> Calculate displacement using s = ut + 1/2 a t²:
            s = 0 × 5 + 0.5 × 3 × 5² = 0 + 0.5 × 3 × 25 = 37.5 meters.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate final velocity using v = u + at:
            v = 0 + 3 × 5 = 15 m/s.
          </li>
          <li>
            <strong>Result:</strong> The car travels 37.5 meters and reaches a final
            velocity of 15 m/s after 5 seconds.
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
        formula: `v = u + at
s = ut + 1/2 a t²
v² = u² + 2as
s = vt - 1/2 a t²
s = (u + v)/2 × t`,
        variables: [
          { symbol: "s", description: "Displacement (meters)" },
          { symbol: "u", description: "Initial velocity (meters/second)" },
          { symbol: "v", description: "Final velocity (meters/second)" },
          { symbol: "a", description: "Acceleration (meters/second²)" },
          { symbol: "t", description: "Time (seconds)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A car accelerates uniformly from rest at 3 m/s² for 5 seconds. Find displacement and final velocity.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate displacement using s = ut + 1/2 a t²: s = 0 × 5 + 0.5 × 3 × 5² = 37.5 meters.",
          },
          {
            label: "2",
            explanation:
              "Calculate final velocity using v = u + at: v = 0 + 3 × 5 = 15 m/s.",
          },
        ],
        result:
          "The car travels 37.5 meters and reaches a final velocity of 15 m/s after 5 seconds.",
      }}
      relatedCalculators={[
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
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