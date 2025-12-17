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
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const g = 9.81; // m/s², standard gravity

// SUVAT variables:
// s = displacement (m)
// u = initial velocity (m/s)
// v = final velocity (m/s)
// a = acceleration (m/s²)
// t = time (s)

// Equations:
// 1) v = u + a t
// 2) s = u t + 0.5 a t²
// 3) s = ((u + v) / 2) t
// 4) v² = u² + 2 a s
// 5) s = v t - 0.5 a t²

// We will allow user to input any 3 variables and calculate the other 2.
// For simplicity, user selects which variable to solve for, and inputs the other 4.

// Helper to parse float safely
function parseInput(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return isNaN(n) ? null : n;
}

export default function KinematicsSuvatSolverCalculator() {
  // Inputs: variable to solve for + values for other 4 variables
  // Variables: s, u, v, a, t
  // SolveFor: one of s,u,v,a,t
  const [solveFor, setSolveFor] = useState("s");
  const [inputs, setInputs] = useState({
    s: "",
    u: "",
    v: "",
    a: "",
    t: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic in useMemo
  const results = useMemo(() => {
    // Parse inputs to numbers or null
    const s = parseInput(inputs.s);
    const u = parseInput(inputs.u);
    const v = parseInput(inputs.v);
    const a = parseInput(inputs.a);
    const t = parseInput(inputs.t);

    // We need exactly 4 known variables to solve for the 5th
    // Count known variables excluding solveFor
    const knownVars = { s, u, v, a, t };
    const knownCount = Object.entries(knownVars).filter(
      ([k, val]) => k !== solveFor && val !== null
    ).length;

    if (knownCount < 4) {
      return {
        value: 0,
        label: "Please enter exactly 4 known variables to calculate the unknown.",
        subtext: null,
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculation functions for each variable
    // Return { value: number, formulaUsed: string } or null if no solution

    // We will try to solve using the SUVAT equations:
    // Depending on solveFor, use the most straightforward formula.

    // Helper to format number with units and scientific notation if needed
    function formatNumber(val, unit) {
      if (val === null || val === undefined || isNaN(val)) return "N/A";
      if (Math.abs(val) < 1e-4 || Math.abs(val) > 1e6) {
        return val.toExponential(4) + " " + unit;
      }
      return val.toFixed(4).replace(/\.?0+$/, "") + " " + unit;
    }

    // Solve for s (displacement)
    function solveS() {
      // Use s = u t + 0.5 a t² if u,a,t known
      if (u !== null && a !== null && t !== null) {
        const val = u * t + 0.5 * a * t * t;
        return {
          value: formatNumber(val, "m"),
          formulaUsed: "s = u × t + 0.5 × a × t²",
          label: "Displacement (s)",
          subtext: "Calculated using initial velocity, acceleration, and time.",
          warning: null,
        };
      }
      // Use s = ((u + v)/2) t if u,v,t known
      if (u !== null && v !== null && t !== null) {
        const val = ((u + v) / 2) * t;
        return {
          value: formatNumber(val, "m"),
          formulaUsed: "s = ((u + v) / 2) × t",
          label: "Displacement (s)",
          subtext: "Calculated using average velocity and time.",
          warning: null,
        };
      }
      // Use s = (v² - u²) / (2 a) if v,u,a known and a ≠ 0
      if (v !== null && u !== null && a !== null && a !== 0) {
        const val = (v * v - u * u) / (2 * a);
        return {
          value: formatNumber(val, "m"),
          formulaUsed: "s = (v² - u²) / (2 × a)",
          label: "Displacement (s)",
          subtext: "Calculated using velocities and acceleration.",
          warning: null,
        };
      }
      return {
        value: 0,
        label: "Insufficient or incompatible inputs to calculate displacement (s).",
        subtext: null,
        warning: null,
        formulaUsed: null,
      };
    }

    // Solve for u (initial velocity)
    function solveU() {
      // From v = u + a t => u = v - a t
      if (v !== null && a !== null && t !== null) {
        const val = v - a * t;
        return {
          value: formatNumber(val, "m/s"),
          formulaUsed: "u = v - a × t",
          label: "Initial velocity (u)",
          subtext: "Calculated using final velocity, acceleration, and time.",
          warning: null,
        };
      }
      // From s = u t + 0.5 a t² => u = (s - 0.5 a t²) / t if t ≠ 0
      if (s !== null && a !== null && t !== null && t !== 0) {
        const val = (s - 0.5 * a * t * t) / t;
        return {
          value: formatNumber(val, "m/s"),
          formulaUsed: "u = (s - 0.5 × a × t²) / t",
          label: "Initial velocity (u)",
          subtext: "Calculated using displacement, acceleration, and time.",
          warning: null,
        };
      }
      // From s = ((u + v)/2) t => u = (2 s / t) - v if t ≠ 0
      if (s !== null && v !== null && t !== null && t !== 0) {
        const val = (2 * s) / t - v;
        return {
          value: formatNumber(val, "m/s"),
          formulaUsed: "u = (2 × s / t) - v",
          label: "Initial velocity (u)",
          subtext: "Calculated using displacement, final velocity, and time.",
          warning: null,
        };
      }
      // From v² = u² + 2 a s => u = sqrt(v² - 2 a s) if inside sqrt ≥ 0
      if (v !== null && a !== null && s !== null) {
        const inside = v * v - 2 * a * s;
        if (inside < 0) {
          return {
            value: 0,
            label: "No real solution for initial velocity (u).",
            subtext: null,
            warning:
              "The values produce an invalid square root (negative value). Check inputs.",
            formulaUsed: null,
          };
        }
        const val = Math.sqrt(inside);
        return {
          value: formatNumber(val, "m/s"),
          formulaUsed: "u = √(v² - 2 × a × s)",
          label: "Initial velocity (u)",
          subtext: "Calculated using final velocity, acceleration, and displacement.",
          warning: null,
        };
      }
      return {
        value: 0,
        label: "Insufficient or incompatible inputs to calculate initial velocity (u).",
        subtext: null,
        warning: null,
        formulaUsed: null,
      };
    }

    // Solve for v (final velocity)
    function solveV() {
      // From v = u + a t
      if (u !== null && a !== null && t !== null) {
        const val = u + a * t;
        return {
          value: formatNumber(val, "m/s"),
          formulaUsed: "v = u + a × t",
          label: "Final velocity (v)",
          subtext: "Calculated using initial velocity, acceleration, and time.",
          warning: null,
        };
      }
      // From v² = u² + 2 a s => v = sqrt(u² + 2 a s) if inside sqrt ≥ 0
      if (u !== null && a !== null && s !== null) {
        const inside = u * u + 2 * a * s;
        if (inside < 0) {
          return {
            value: 0,
            label: "No real solution for final velocity (v).",
            subtext: null,
            warning:
              "The values produce an invalid square root (negative value). Check inputs.",
            formulaUsed: null,
          };
        }
        const val = Math.sqrt(inside);
        return {
          value: formatNumber(val, "m/s"),
          formulaUsed: "v = √(u² + 2 × a × s)",
          label: "Final velocity (v)",
          subtext: "Calculated using initial velocity, acceleration, and displacement.",
          warning: null,
        };
      }
      // From s = ((u + v)/2) t => v = (2 s / t) - u if t ≠ 0
      if (s !== null && u !== null && t !== null && t !== 0) {
        const val = (2 * s) / t - u;
        return {
          value: formatNumber(val, "m/s"),
          formulaUsed: "v = (2 × s / t) - u",
          label: "Final velocity (v)",
          subtext: "Calculated using displacement, initial velocity, and time.",
          warning: null,
        };
      }
      return {
        value: 0,
        label: "Insufficient or incompatible inputs to calculate final velocity (v).",
        subtext: null,
        warning: null,
        formulaUsed: null,
      };
    }

    // Solve for a (acceleration)
    function solveA() {
      // From v = u + a t => a = (v - u) / t if t ≠ 0
      if (v !== null && u !== null && t !== null && t !== 0) {
        const val = (v - u) / t;
        return {
          value: formatNumber(val, "m/s²"),
          formulaUsed: "a = (v - u) / t",
          label: "Acceleration (a)",
          subtext: "Calculated using initial and final velocities and time.",
          warning: null,
        };
      }
      // From s = u t + 0.5 a t² => a = 2 (s - u t) / t² if t ≠ 0
      if (s !== null && u !== null && t !== null && t !== 0) {
        const val = (2 * (s - u * t)) / (t * t);
        return {
          value: formatNumber(val, "m/s²"),
          formulaUsed: "a = 2 × (s - u × t) / t²",
          label: "Acceleration (a)",
          subtext: "Calculated using displacement, initial velocity, and time.",
          warning: null,
        };
      }
      // From v² = u² + 2 a s => a = (v² - u²) / (2 s) if s ≠ 0
      if (v !== null && u !== null && s !== null && s !== 0) {
        const val = (v * v - u * u) / (2 * s);
        return {
          value: formatNumber(val, "m/s²"),
          formulaUsed: "a = (v² - u²) / (2 × s)",
          label: "Acceleration (a)",
          subtext: "Calculated using velocities and displacement.",
          warning: null,
        };
      }
      return {
        value: 0,
        label: "Insufficient or incompatible inputs to calculate acceleration (a).",
        subtext: null,
        warning: null,
        formulaUsed: null,
      };
    }

    // Solve for t (time)
    function solveT() {
      // From v = u + a t => t = (v - u) / a if a ≠ 0
      if (v !== null && u !== null && a !== null && a !== 0) {
        const val = (v - u) / a;
        return {
          value: formatNumber(val, "s"),
          formulaUsed: "t = (v - u) / a",
          label: "Time (t)",
          subtext: "Calculated using initial and final velocities and acceleration.",
          warning: null,
        };
      }
      // From s = u t + 0.5 a t² => quadratic: 0.5 a t² + u t - s = 0
      // Solve quadratic for t
      if (s !== null && u !== null && a !== null) {
        const A = 0.5 * a;
        const B = u;
        const C = -s;
        const discriminant = B * B - 4 * A * C;
        if (discriminant < 0) {
          return {
            value: 0,
            label: "No real solution for time (t).",
            subtext: null,
            warning:
              "The quadratic equation has no real roots. Check inputs.",
            formulaUsed: null,
          };
        }
        const sqrtD = Math.sqrt(discriminant);
        const t1 = (-B + sqrtD) / (2 * A);
        const t2 = (-B - sqrtD) / (2 * A);
        // Choose positive and realistic time (t ≥ 0)
        const candidates = [t1, t2].filter((x) => x >= 0);
        if (candidates.length === 0) {
          return {
            value: 0,
            label: "No positive real solution for time (t).",
            subtext: null,
            warning:
              "Both roots are negative. Check inputs for physical validity.",
            formulaUsed: null,
          };
        }
        const val = Math.min(...candidates);
        return {
          value: formatNumber(val, "s"),
          formulaUsed: "Solve quadratic: 0.5 × a × t² + u × t - s = 0",
          label: "Time (t)",
          subtext:
            "Calculated by solving the quadratic equation from displacement formula.",
          warning: null,
        };
      }
      // From s = ((u + v)/2) t => t = (2 s) / (u + v) if (u + v) ≠ 0
      if (s !== null && u !== null && v !== null && (u + v) !== 0) {
        const val = (2 * s) / (u + v);
        return {
          value: formatNumber(val, "s"),
          formulaUsed: "t = (2 × s) / (u + v)",
          label: "Time (t)",
          subtext: "Calculated using displacement and average velocity.",
          warning: null,
        };
      }
      return {
        value: 0,
        label: "Insufficient or incompatible inputs to calculate time (t).",
        subtext: null,
        warning: null,
        formulaUsed: null,
      };
    }

    switch (solveFor) {
      case "s":
        return solveS();
      case "u":
        return solveU();
      case "v":
        return solveV();
      case "a":
        return solveA();
      case "t":
        return solveT();
      default:
        return {
          value: 0,
          label: "Select a variable to solve for.",
          subtext: null,
          warning: null,
          formulaUsed: null,
        };
    }
  }, [inputs, solveFor]);

  const faqs = [
    {
      question: "What are the SUVAT equations used for in physics?",
      answer:
        "SUVAT equations describe motion under constant acceleration, allowing calculation of displacement, velocity, acceleration, and time. They are fundamental in kinematics to analyze linear motion without requiring calculus.",
    },
    {
      question: "Why do I need to input exactly four variables to solve for the fifth?",
      answer:
        "The SUVAT equations relate five variables. Knowing any four allows you to solve for the unknown fifth using algebraic manipulation of the equations, ensuring a unique solution.",
    },
    {
      question: "What if I get no real solution when calculating time or velocity?",
      answer:
        "No real solution indicates the input values are physically inconsistent or impossible under constant acceleration. Double-check inputs for errors or unrealistic values.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Select variable to solve for */}
      <div>
        <Label htmlFor="solveFor" className="mb-1 font-semibold">
          Select variable to solve for
        </Label>
        <Select
          value={solveFor}
          onValueChange={(val) => {
            setSolveFor(val);
            // Clear input for solved variable
            setInputs((prev) => ({ ...prev, [val]: "" }));
          }}
          id="solveFor"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="s">Displacement (s) [m]</SelectItem>
            <SelectItem value="u">Initial Velocity (u) [m/s]</SelectItem>
            <SelectItem value="v">Final Velocity (v) [m/s]</SelectItem>
            <SelectItem value="a">Acceleration (a) [m/s²]</SelectItem>
            <SelectItem value="t">Time (t) [s]</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs for other variables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {["s", "u", "v", "a", "t"].map((variable) => {
          if (variable === solveFor) return null;
          let label = "";
          let unit = "";
          switch (variable) {
            case "s":
              label = "Displacement (s)";
              unit = "m";
              break;
            case "u":
              label = "Initial Velocity (u)";
              unit = "m/s";
              break;
            case "v":
              label = "Final Velocity (v)";
              unit = "m/s";
              break;
            case "a":
              label = "Acceleration (a)";
              unit = "m/s²";
              break;
            case "t":
              label = "Time (t)";
              unit = "s";
              break;
          }
          return (
            <div key={variable}>
              <Label htmlFor={variable} className="mb-1 font-semibold">
                {label} [{unit}]
              </Label>
              <Input
                type="number"
                step="any"
                id={variable}
                value={inputs[variable]}
                onChange={(e) => handleInputChange(variable, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
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
            // Just trigger re-calculation by setting state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({ s: "", u: "", v: "", a: "", t: "" });
            setSolveFor("s");
          }}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
          Understanding Kinematics Equations Solver (SUVAT)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The SUVAT equations are a set of five fundamental formulas used in
          physics to describe the motion of objects undergoing constant
          acceleration. The acronym SUVAT stands for displacement (s), initial
          velocity (u), final velocity (v), acceleration (a), and time (t). These
          variables are interconnected, allowing you to solve for any unknown
          quantity if the other four are known.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This solver tool enables you to input four known variables and select
          the unknown variable you want to calculate. It applies the appropriate
          SUVAT equation to provide an accurate result, complete with units and
          the formula used. This is especially useful for students and educators
          to understand the relationships between motion parameters in a clear
          and interactive way.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Remember, these equations assume uniform acceleration, meaning the
          acceleration does not change over time. They are widely used in
          mechanics, engineering, and various scientific fields to analyze linear
          motion scenarios such as free-fall, projectile motion, and vehicle
          acceleration.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`v = u + a × t
s = u × t + 0.5 × a × t²
s = ((u + v) / 2) × t
v² = u² + 2 × a × s
s = v × t - 0.5 × a × t²

Variables:
s: Displacement (meters, m)
u: Initial velocity (meters per second, m/s)
v: Final velocity (meters per second, m/s)
a: Acceleration (meters per second squared, m/s²)
t: Time (seconds, s)`}
        </pre>
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
        formula: `v = u + a × t
s = u × t + 0.5 × a × t²
s = ((u + v) / 2) × t
v² = u² + 2 × a × s
s = v × t - 0.5 × a × t²`,
        variables: [
          { symbol: "s", description: "Displacement (meters, m)" },
          { symbol: "u", description: "Initial velocity (m/s)" },
          { symbol: "v", description: "Final velocity (m/s)" },
          { symbol: "a", description: "Acceleration (m/s²)" },
          { symbol: "t", description: "Time (seconds, s)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A car accelerates uniformly from rest (u = 0 m/s) to a speed of 20 m/s in 5 seconds. Calculate the acceleration and displacement during this time.",
        steps: [
          {
            label: "1",
            explanation:
              "Known variables: u = 0 m/s, v = 20 m/s, t = 5 s. Unknown: a, s.",
          },
          {
            label: "2",
            explanation:
              "Calculate acceleration using a = (v - u) / t = (20 - 0) / 5 = 4 m/s².",
          },
          {
            label: "3",
            explanation:
              "Calculate displacement using s = u t + 0.5 a t² = 0 × 5 + 0.5 × 4 × 25 = 50 m.",
          },
        ],
        result:
          "The car's acceleration is 4 m/s² and it covers a displacement of 50 meters.",
      }}
      relatedCalculators={[
        {
          title: "Dilution Calculator (C₁V₁ = C₂V₂)",
          url: "/science/dilution-c1v1-c2v2",
          icon: "🧪",
        },
        {
          title: "Gravity on Other Planets Calculator",
          url: "/science/gravity-on-other-planets-calculator",
          icon: "🪐",
        },
        {
          title: "Free-Fall Time/Velocity Estimator",
          url: "/science/free-fall-time-velocity-estimator",
          icon: "🧪",
        },
        {
          title: "Capacitor/Inductor Reactance Calculator",
          url: "/science/reactance-capacitor-inductor-educational",
          icon: "🧪",
        },
        {
          title: "Ideal Gas Law Calculator",
          url: "/science/ideal-gas-law-pv-nrt",
          icon: "🧪",
        },
        {
          title: "RC Time Constant Calculator",
          url: "/science/rc-time-constant-tau-rc",
          icon: "🧪",
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