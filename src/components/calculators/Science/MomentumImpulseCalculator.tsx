import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, RotateCcw, AlertTriangle, Info } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MomentumImpulseCalculator() {
  // Inputs: mass (kg), initial velocity (m/s), final velocity (m/s), time interval (s)
  const [inputs, setInputs] = useState({
    mass: "",
    velocityInitial: "",
    velocityFinal: "",
    timeInterval: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const m = parseFloat(inputs.mass);
    const v_i = parseFloat(inputs.velocityInitial);
    const v_f = parseFloat(inputs.velocityFinal);
    const dt = parseFloat(inputs.timeInterval);

    // Validation
    if (
      isNaN(m) || m <= 0 ||
      isNaN(v_i) || isNaN(v_f) ||
      isNaN(dt) || dt <= 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid positive inputs",
        subtext: "Mass & time must be &gt; 0. Velocities can be any real number.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculations
    // Momentum p = m * v
    const p_i = m * v_i; // initial momentum (kg·m/s)
    const p_f = m * v_f; // final momentum (kg·m/s)

    // Impulse J = Δp = p_f - p_i (kg·m/s)
    const impulse = p_f - p_i;

    // Average Force F = J / Δt (N = kg·m/s²)
    const avgForce = impulse / dt;

    // Formatting function for scientific notation if needed
    function formatValue(val: number, unit: string) {
      if (val !== 0 && (Math.abs(val) >= 10000 || Math.abs(val) < 0.001)) {
        return val.toExponential(4) + " " + unit;
      }
      return val.toFixed(4) + " " + unit;
    }

    return {
      value: (
        <>
          <div>
            <strong>Initial Momentum:</strong> {formatValue(p_i, "kg·m/s")}
          </div>
          <div>
            <strong>Final Momentum:</strong> {formatValue(p_f, "kg·m/s")}
          </div>
          <div>
            <strong>Impulse (Δp):</strong> {formatValue(impulse, "kg·m/s")}
          </div>
          <div>
            <strong>Average Force (F):</strong> {formatValue(avgForce, "N")}
          </div>
        </>
      ),
      label: "Momentum, Impulse, and Average Force",
      subtext:
        "Momentum (p) in kilogram meters per second (kg·m/s), impulse (J) is change in momentum, force (F) in Newtons (N).",
      warning: null,
      formulaUsed:
        "p = m × v; J = Δp = p_f - p_i; F = J / Δt",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is momentum and why is it important?",
      answer:
        "Momentum is a vector quantity defined as the product of an object's mass and velocity. It represents the quantity of motion an object has and is conserved in isolated systems. Understanding momentum is essential in physics to analyze collisions, motion, and forces acting on objects.",
    },
    {
      question: "How does impulse relate to force and time?",
      answer:
        "Impulse is the change in momentum of an object resulting from a force applied over a time interval. It is calculated as the product of the average force and the time duration. Impulse explains how forces cause changes in motion, crucial in areas like vehicle safety and sports physics.",
    },
    {
      question: "Why must mass be in kilograms and velocity in meters per second?",
      answer:
        "Using kilograms for mass and meters per second for velocity ensures that momentum and force calculations are consistent with the International System of Units (SI). This standardization allows results to be meaningful and comparable across scientific and engineering applications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mass" className="mb-1 font-semibold">
            Mass (kg)
          </Label>
          <Input
            id="mass"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 5.0"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
            aria-describedby="mass-desc"
          />
          <p id="mass-desc" className="text-xs text-slate-500 mt-1">
            Mass must be &gt; 0 kilograms.
          </p>
        </div>

        <div>
          <Label htmlFor="velocityInitial" className="mb-1 font-semibold">
            Initial Velocity (m/s)
          </Label>
          <Input
            id="velocityInitial"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 10.0"
            value={inputs.velocityInitial}
            onChange={(e) => handleInputChange("velocityInitial", e.target.value)}
            aria-describedby="vi-desc"
          />
          <p id="vi-desc" className="text-xs text-slate-500 mt-1">
            Velocity can be positive or negative.
          </p>
        </div>

        <div>
          <Label htmlFor="velocityFinal" className="mb-1 font-semibold">
            Final Velocity (m/s)
          </Label>
          <Input
            id="velocityFinal"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 15.0"
            value={inputs.velocityFinal}
            onChange={(e) => handleInputChange("velocityFinal", e.target.value)}
            aria-describedby="vf-desc"
          />
          <p id="vf-desc" className="text-xs text-slate-500 mt-1">
            Velocity can be positive or negative.
          </p>
        </div>

        <div>
          <Label htmlFor="timeInterval" className="mb-1 font-semibold">
            Time Interval Δt (seconds)
          </Label>
          <Input
            id="timeInterval"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 2.0"
            value={inputs.timeInterval}
            onChange={(e) => handleInputChange("timeInterval", e.target.value)}
            aria-describedby="dt-desc"
          />
          <p id="dt-desc" className="text-xs text-slate-500 mt-1">
            Time interval must be &gt; 0 seconds.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate Momentum and Impulse"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mass: "",
              velocityInitial: "",
              velocityFinal: "",
              timeInterval: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <div className="text-3xl font-extrabold text-blue-900 dark:text-white space-y-2">
                {results.value}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-4 font-medium">{results.label}</p>
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
              <strong>Science Fact:</strong> Always ensure mass is in kilograms and velocity in meters per second for accurate momentum and impulse calculations.
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
          Understanding Momentum &amp; Impulse Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Momentum is a fundamental concept in physics describing the quantity of motion an object possesses. It is calculated as the product of an object's mass and velocity. Impulse, on the other hand, measures the change in momentum resulting from a force applied over a period of time. This calculator helps analyze how forces affect motion by computing momentum, impulse, and average force based on user inputs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These concepts are widely applied in real-world scenarios such as vehicle crash analysis, sports science, and engineering safety designs. For example, understanding impulse helps engineers design airbags that reduce the force experienced by passengers during collisions by increasing the time over which the force acts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this tool, students and professionals can explore how changes in velocity and time intervals influence forces and motion, reinforcing core physics principles with practical calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Momentum (p) = m × v
Impulse (J) = Δp = p_f - p_i = m × (v_f - v_i)
Average Force (F) = J / Δt

Where:
  m = mass (kg)
  v_i = initial velocity (m/s)
  v_f = final velocity (m/s)
  Δp = change in momentum (kg·m/s)
  Δt = time interval (s)
  F = average force (N)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the momentum and impulse concepts.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A 3 kg ball initially moving at 4 m/s slows down to 1 m/s over 2 seconds.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate initial momentum: p_i = 3 kg × 4 m/s = 12 kg·m/s.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate final momentum: p_f = 3 kg × 1 m/s = 3 kg·m/s.
          </li>
          <li>
            <strong>Step 3:</strong> Calculate impulse: J = p_f - p_i = 3 - 12 = -9 kg·m/s.
          </li>
          <li>
            <strong>Step 4:</strong> Calculate average force: F = J / Δt = -9 / 2 = -4.5 N.
          </li>
          <li>
            <strong>Result:</strong> The ball experienced an average force of -4.5 Newtons opposing its motion over 2 seconds.
          </li>
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
      title="Momentum & Impulse Calculator"
      description="Calculate Momentum and Impulse. Analyze collisions and the change in motion of objects using mass and velocity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `p = m × v
J = Δp = p_f - p_i = m × (v_f - v_i)
F = J / Δt`,
        variables: [
          { symbol: "m", description: "Mass in kilograms (kg)" },
          { symbol: "v_i", description: "Initial velocity in meters per second (m/s)" },
          { symbol: "v_f", description: "Final velocity in meters per second (m/s)" },
          { symbol: "Δp", description: "Change in momentum (kg·m/s)" },
          { symbol: "Δt", description: "Time interval in seconds (s)" },
          { symbol: "F", description: "Average force in Newtons (N)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A 3 kg ball slows down from 4 m/s to 1 m/s over 2 seconds. Calculate momentum, impulse, and average force.",
        steps: [
          { label: "1", explanation: "Calculate initial momentum: p_i = 3 × 4 = 12 kg·m/s." },
          { label: "2", explanation: "Calculate final momentum: p_f = 3 × 1 = 3 kg·m/s." },
          { label: "3", explanation: "Calculate impulse: J = 3 - 12 = -9 kg·m/s." },
          { label: "4", explanation: "Calculate average force: F = -9 / 2 = -4.5 N." },
        ],
        result: "The ball experienced an average force of -4.5 Newtons opposing its motion.",
      }}
      relatedCalculators={[
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
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