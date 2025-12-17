import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const g = 9.81; // m/s², gravitational acceleration constant

// SUVAT variables:
// s = displacement (m)
// u = initial velocity (m/s)
// v = final velocity (m/s)
// a = acceleration (m/s²)
// t = time (s)

// Equations:
// 1) v = u + at
// 2) s = ut + 0.5at²
// 3) v² = u² + 2as
// 4) s = ((u + v)/2) * t
// 5) s = vt - 0.5at²

// The solver will allow user to input any 3 known variables and calculate the unknown 2.
// To keep UI simple, user selects which variable to calculate, inputs the other 4.

// We will validate inputs and calculate accordingly.

export default function KinematicsSuvatSolverCalculator() {
  // Variables: s, u, v, a, t
  // Calculate one of them based on the other four inputs.

  const [calculateFor, setCalculateFor] = useState<"s" | "u" | "v" | "a" | "t">("s");
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

  // Parsing helper
  const parseInput = (val?: string): number | null => {
    if (!val) return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  };

  // Calculation logic in useMemo
  const results = useMemo(() => {
    // Parse all inputs to numbers or null
    const s = parseInput(inputs.s);
    const u = parseInput(inputs.u);
    const v = parseInput(inputs.v);
    const a = parseInput(inputs.a);
    const t = parseInput(inputs.t);

    // Validate inputs: For calculation, all except the one to calculate must be numbers
    const vars = { s, u, v, a, t };
    const missingVars = Object.entries(vars)
      .filter(([key, val]) => key !== calculateFor && (val === null || val === undefined))
      .map(([key]) => key);

    if (missingVars.length > 0) {
      return {
        value: "Waiting...",
        label: `Please enter values for: ${missingVars.join(", ")}`,
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculation functions for each variable
    // Each returns number | null if no solution or invalid

    // Helper for formatting results with units
    const formatResult = (val: number, unit: string) => {
      const absVal = Math.abs(val);
      const displayVal =
        absVal !== 0 && (absVal >= 10000 || absVal < 0.001)
          ? val.toExponential(4)
          : val.toFixed(4);
      return `${displayVal} ${unit}`;
    };

    // Calculation implementations:
    // We use the SUVAT equations and algebra to solve for the unknown.

    // Calculate s:
    // Use s = ut + 0.5 a t² if u,a,t known
    // Or s = ((u+v)/2)*t if u,v,t known
    // Or s = (v² - u²)/(2a) if u,v,a known
    if (calculateFor === "s") {
      if (u !== null && a !== null && t !== null) {
        // s = ut + 0.5 a t²
        const val = u * t + 0.5 * a * t * t;
        return {
          value: formatResult(val, "meters"),
          label: "Displacement (s)",
          subtext: "Using s = ut + 0.5at²",
          warning: null,
          formulaUsed: "s = ut + 0.5at²",
        };
      }
      if (u !== null && v !== null && t !== null) {
        // s = ((u+v)/2)*t
        const val = ((u + v) / 2) * t;
        return {
          value: formatResult(val, "meters"),
          label: "Displacement (s)",
          subtext: "Using s = ((u + v)/2) × t",
          warning: null,
          formulaUsed: "s = ((u + v)/2) × t",
        };
      }
      if (v !== null && u !== null && a !== null && a !== 0) {
        // s = (v² - u²)/(2a)
        const val = (v * v - u * u) / (2 * a);
        return {
          value: formatResult(val, "meters"),
          label: "Displacement (s)",
          subtext: "Using s = (v² - u²) / 2a",
          warning: null,
          formulaUsed: "s = (v² - u²) / 2a",
        };
      }
      return {
        value: "Waiting...",
        label: "Insufficient or invalid inputs for s",
        subtext: "",
        warning: "Please provide valid inputs for calculation.",
        formulaUsed: null,
      };
    }

    // Calculate u:
    // From v = u + at => u = v - at
    // From s = ut + 0.5 a t² => u = (s - 0.5 a t²)/t if t ≠ 0
    // From v² = u² + 2as => u = sqrt(v² - 2as) or -sqrt(...) (choose positive root)
    if (calculateFor === "u") {
      if (v !== null && a !== null && t !== null) {
        // u = v - at
        const val = v - a * t;
        return {
          value: formatResult(val, "m/s"),
          label: "Initial Velocity (u)",
          subtext: "Using u = v - at",
          warning: null,
          formulaUsed: "u = v - at",
        };
      }
      if (s !== null && a !== null && t !== null && t !== 0) {
        // u = (s - 0.5 a t²)/t
        const val = (s - 0.5 * a * t * t) / t;
        return {
          value: formatResult(val, "m/s"),
          label: "Initial Velocity (u)",
          subtext: "Using u = (s - 0.5at²) / t",
          warning: null,
          formulaUsed: "u = (s - 0.5at²) / t",
        };
      }
      if (v !== null && s !== null && a !== null) {
        // u = sqrt(v² - 2as) or -sqrt(...)
        const underSqrt = v * v - 2 * a * s;
        if (underSqrt < 0) {
          return {
            value: "No real solution",
            label: "Initial Velocity (u)",
            subtext: "",
            warning: "v² - 2as &lt; 0, no real solution for u.",
            formulaUsed: "u = ±√(v² - 2as)",
          };
        }
        const valPos = Math.sqrt(underSqrt);
        const valNeg = -valPos;
        return {
          value: `${formatResult(valPos, "m/s")} or ${formatResult(valNeg, "m/s")}`,
          label: "Initial Velocity (u)",
          subtext: "Using u = ±√(v² - 2as)",
          warning: null,
          formulaUsed: "u = ±√(v² - 2as)",
        };
      }
      return {
        value: "Waiting...",
        label: "Insufficient or invalid inputs for u",
        subtext: "",
        warning: "Please provide valid inputs for calculation.",
        formulaUsed: null,
      };
    }

    // Calculate v:
    // v = u + at
    // v = sqrt(u² + 2as) (positive root)
    // v = (2s / t) - u (from s = ((u+v)/2) t => v = (2s / t) - u)
    if (calculateFor === "v") {
      if (u !== null && a !== null && t !== null) {
        // v = u + at
        const val = u + a * t;
        return {
          value: formatResult(val, "m/s"),
          label: "Final Velocity (v)",
          subtext: "Using v = u + at",
          warning: null,
          formulaUsed: "v = u + at",
        };
      }
      if (u !== null && a !== null && s !== null) {
        // v = sqrt(u² + 2as)
        const underSqrt = u * u + 2 * a * s;
        if (underSqrt < 0) {
          return {
            value: "No real solution",
            label: "Final Velocity (v)",
            subtext: "",
            warning: "u² + 2as &lt; 0, no real solution for v.",
            formulaUsed: "v = ±√(u² + 2as)",
          };
        }
        const valPos = Math.sqrt(underSqrt);
        const valNeg = -valPos;
        return {
          value: `${formatResult(valPos, "m/s")} or ${formatResult(valNeg, "m/s")}`,
          label: "Final Velocity (v)",
          subtext: "Using v = ±√(u² + 2as)",
          warning: null,
          formulaUsed: "v = ±√(u² + 2as)",
        };
      }
      if (s !== null && t !== null && u !== null && t !== 0) {
        // v = (2s / t) - u
        const val = (2 * s) / t - u;
        return {
          value: formatResult(val, "m/s"),
          label: "Final Velocity (v)",
          subtext: "Using v = (2s / t) - u",
          warning: null,
          formulaUsed: "v = (2s / t) - u",
        };
      }
      return {
        value: "Waiting...",
        label: "Insufficient or invalid inputs for v",
        subtext: "",
        warning: "Please provide valid inputs for calculation.",
        formulaUsed: null,
      };
    }

    // Calculate a:
    // a = (v - u) / t if t ≠ 0
    // a = (v² - u²) / (2s) if s ≠ 0
    // a = (2 (s - ut)) / t² if t ≠ 0
    if (calculateFor === "a") {
      if (v !== null && u !== null && t !== null && t !== 0) {
        // a = (v - u) / t
        const val = (v - u) / t;
        return {
          value: formatResult(val, "m/s²"),
          label: "Acceleration (a)",
          subtext: "Using a = (v - u) / t",
          warning: null,
          formulaUsed: "a = (v - u) / t",
        };
      }
      if (v !== null && u !== null && s !== null && s !== 0) {
        // a = (v² - u²) / (2s)
        const val = (v * v - u * u) / (2 * s);
        return {
          value: formatResult(val, "m/s²"),
          label: "Acceleration (a)",
          subtext: "Using a = (v² - u²) / 2s",
          warning: null,
          formulaUsed: "a = (v² - u²) / 2s",
        };
      }
      if (s !== null && u !== null && t !== null && t !== 0) {
        // a = (2 (s - ut)) / t²
        const val = (2 * (s - u * t)) / (t * t);
        return {
          value: formatResult(val, "m/s²"),
          label: "Acceleration (a)",
          subtext: "Using a = 2(s - ut) / t²",
          warning: null,
          formulaUsed: "a = 2(s - ut) / t²",
        };
      }
      return {
        value: "Waiting...",
        label: "Insufficient or invalid inputs for a",
        subtext: "",
        warning: "Please provide valid inputs for calculation.",
        formulaUsed: null,
      };
    }

    // Calculate t:
    // From v = u + at => t = (v - u)/a if a ≠ 0
    // From s = ut + 0.5 a t² => quadratic: 0.5 a t² + u t - s = 0
    // From s = ((u + v)/2) t => t = 2s / (u + v) if (u + v) ≠ 0

    if (calculateFor === "t") {
      if (v !== null && u !== null && a !== null && a !== 0) {
        // t = (v - u)/a
        const val = (v - u) / a;
        return {
          value: formatResult(val, "seconds"),
          label: "Time (t)",
          subtext: "Using t = (v - u) / a",
          warning: null,
          formulaUsed: "t = (v - u) / a",
        };
      }
      if (s !== null && u !== null && a !== null) {
        // Solve quadratic: 0.5 a t² + u t - s = 0
        // a_quad = 0.5 a, b_quad = u, c_quad = -s
        const a_quad = 0.5 * a;
        const b_quad = u;
        const c_quad = -s;
        const discriminant = b_quad * b_quad - 4 * a_quad * c_quad;
        if (discriminant < 0) {
          return {
            value: "No real solution",
            label: "Time (t)",
            subtext: "",
            warning: "Discriminant &lt; 0, no real solution for t.",
            formulaUsed: "0.5 a t² + u t - s = 0",
          };
        }
        const sqrtDisc = Math.sqrt(discriminant);
        const t1 = (-b_quad + sqrtDisc) / (2 * a_quad);
        const t2 = (-b_quad - sqrtDisc) / (2 * a_quad);
        // Only positive times make physical sense
        const validTimes = [t1, t2].filter((time) => time >= 0);
        if (validTimes.length === 0) {
          return {
            value: "No positive real solution",
            label: "Time (t)",
            subtext: "",
            warning: "No positive real solution for t.",
            formulaUsed: "0.5 a t² + u t - s = 0",
          };
        }
        const formattedTimes = validTimes
          .map((time) => formatResult(time, "seconds"))
          .join(" or ");
        return {
          value: formattedTimes,
          label: "Time (t)",
          subtext: "Using quadratic formula on 0.5 a t² + u t - s = 0",
          warning: null,
          formulaUsed: "0.5 a t² + u t - s = 0",
        };
      }
      if (s !== null && u !== null && v !== null && (u + v) !== 0) {
        // t = 2s / (u + v)
        const val = (2 * s) / (u + v);
        return {
          value: formatResult(val, "seconds"),
          label: "Time (t)",
          subtext: "Using t = 2s / (u + v)",
          warning: null,
          formulaUsed: "t = 2s / (u + v)",
        };
      }
      return {
        value: "Waiting...",
        label: "Insufficient or invalid inputs for t",
        subtext: "",
        warning: "Please provide valid inputs for calculation.",
        formulaUsed: null,
      };
    }

    return {
      value: "Waiting...",
      label: "Select variable to calculate and enter inputs",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [calculateFor, inputs]);

  // FAQs
  const faqs = [
    {
      question: "What are SUVAT equations used for?",
      answer:
        "SUVAT equations describe motion under constant acceleration, allowing calculation of displacement, velocity, acceleration, and time. They are essential in physics and engineering to analyze linear motion, such as vehicles accelerating or objects in free fall. Understanding these equations helps solve real-world problems involving uniform acceleration.",
    },
    {
      question: "Why must units be consistent in SUVAT calculations?",
      answer:
        "Consistent units ensure accurate results in physics calculations. For SUVAT equations, displacement should be in meters, velocity in meters per second, acceleration in meters per second squared, and time in seconds. Mixing units like kilometers and seconds without conversion leads to incorrect answers and misunderstandings of physical phenomena.",
    },
    {
      question: "Can SUVAT equations be used for non-uniform acceleration?",
      answer:
        "No, SUVAT equations assume constant acceleration throughout the motion. For variable acceleration, calculus-based methods or numerical techniques are required. Using SUVAT equations with changing acceleration yields inaccurate results and should be avoided in such scenarios.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Select variable to calculate */}
      <div>
        <Label htmlFor="calculateFor" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
          Select variable to calculate
        </Label>
        <Select
          value={calculateFor}
          onValueChange={(val) => {
            setCalculateFor(val as any);
            setInputs({}); // reset inputs on variable change
          }}
          id="calculateFor"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select variable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s">Displacement (s)</SelectItem>
            <SelectItem value="u">Initial Velocity (u)</SelectItem>
            <SelectItem value="v">Final Velocity (v)</SelectItem>
            <SelectItem value="a">Acceleration (a)</SelectItem>
            <SelectItem value="t">Time (t)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs for other variables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["s", "u", "v", "a", "t"].map((variable) => {
          if (variable === calculateFor) return null;
          let label = "";
          let unit = "";
          switch (variable) {
            case "s":
              label = "Displacement (s)";
              unit = "meters (m)";
              break;
            case "u":
              label = "Initial Velocity (u)";
              unit = "meters/second (m/s)";
              break;
            case "v":
              label = "Final Velocity (v)";
              unit = "meters/second (m/s)";
              break;
            case "a":
              label = "Acceleration (a)";
              unit = "meters/second² (m/s²)";
              break;
            case "t":
              label = "Time (t)";
              unit = "seconds (s)";
              break;
          }
          return (
            <div key={variable}>
              <Label htmlFor={variable} className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
                {label}
              </Label>
              <Input
                id={variable}
                type="number"
                step="any"
                placeholder={`Enter ${label} in ${unit}`}
                value={inputs[variable as keyof typeof inputs] || ""}
                onChange={(e) => handleInputChange(variable, e.target.value)}
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
          aria-label="Calculate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
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
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Always ensure units are consistent (e.g., meters, seconds) when using SUVAT equations to avoid calculation errors.
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
          The SUVAT equations are a set of five fundamental formulas used in physics to describe the motion of objects moving with constant acceleration. The acronym SUVAT stands for displacement (s), initial velocity (u), final velocity (v), acceleration (a), and time (t). These equations allow us to calculate any one of these variables if the other three are known, making them essential tools for solving linear motion problems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These equations are widely applied in fields such as engineering, automotive design, ballistics, and even sports science to predict and analyze the motion of objects. For example, engineers use SUVAT equations to calculate the stopping distance of vehicles, while physicists apply them to study free-falling bodies under gravity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to note that SUVAT equations are valid only when acceleration is constant. If acceleration varies with time, more advanced calculus-based methods are required. Additionally, always ensure that units are consistent (e.g., meters, seconds) to obtain accurate results.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`1) v = u + a t
2) s = u t + 0.5 a t²
3) v² = u² + 2 a s
4) s = ((u + v) / 2) × t
5) s = v t - 0.5 a t²

Where:
  s = Displacement (meters, m)
  u = Initial velocity (meters/second, m/s)
  v = Final velocity (meters/second, m/s)
  a = Acceleration (meters/second², m/s²)
  t = Time (seconds, s)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using SUVAT equations. Suppose a car accelerates uniformly from rest to a speed of 20 m/s in 5 seconds. We want to find the displacement during this time.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> u = 0 m/s (starting from rest), v = 20 m/s, t = 5 s</li>
          <li><strong>Step 1:</strong> Calculate acceleration using v = u + at → a = (v - u) / t = (20 - 0) / 5 = 4 m/s²</li>
          <li><strong>Step 2:</strong> Calculate displacement using s = ut + 0.5 a t² → s = 0 × 5 + 0.5 × 4 × 5² = 50 meters</li>
          <li><strong>Result:</strong> The car travels 50 meters during the acceleration period.</li>
        </ul>
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
        formula: `v = u + a t
s = u t + 0.5 a t²
v² = u² + 2 a s
s = ((u + v) / 2) × t
s = v t - 0.5 a t²`,
        variables: [
          { symbol: "s", description: "Displacement (meters, m)" },
          { symbol: "u", description: "Initial velocity (meters/second, m/s)" },
          { symbol: "v", description: "Final velocity (meters/second, m/s)" },
          { symbol: "a", description: "Acceleration (meters/second², m/s²)" },
          { symbol: "t", description: "Time (seconds, s)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A car accelerates uniformly from rest to 20 m/s in 5 seconds. Calculate the displacement during this time.",
        steps: [
          { label: "1", explanation: "Calculate acceleration: a = (v - u) / t = (20 - 0) / 5 = 4 m/s²" },
          { label: "2", explanation: "Calculate displacement: s = ut + 0.5 a t² = 0 + 0.5 × 4 × 5² = 50 meters" },
        ],
        result: "The car travels 50 meters during the acceleration period.",
      }}
      relatedCalculators={[]}
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
