import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, FlaskConical, Zap, Orbit, Thermometer, Scale, Waves, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MomentumImpulseCalculator() {
  const [inputs, setInputs] = useState({
    mass: "",
    initialVelocity: "",
    finalVelocity: "",
    timeInterval: "",
    calculate: "momentum", // or "impulse"
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const g = 9.81; // m/s², not used here but for reference
    // Parse inputs safely
    const m = parseFloat(inputs.mass);
    const v_i = parseFloat(inputs.initialVelocity);
    const v_f = parseFloat(inputs.finalVelocity);
    const dt = parseFloat(inputs.timeInterval);
    const calcType = inputs.calculate;

    // Validation flags
    const invalidMass = isNaN(m) || m <= 0;
    const invalidVi = isNaN(v_i);
    const invalidVf = isNaN(v_f);
    const invalidDt = isNaN(dt) || dt <= 0;

    if (calcType === "momentum") {
      // Momentum p = m * v
      if (invalidMass) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Mass must be a positive number (kg).",
          formulaUsed: null,
        };
      }
      if (invalidVi) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Initial velocity must be a number (m/s).",
          formulaUsed: null,
        };
      }
      const p = m * v_i;
      // Format large/small numbers in scientific notation if abs < 1e-3 or > 1e5
      const formattedP =
        Math.abs(p) !== 0 && (Math.abs(p) < 1e-3 || Math.abs(p) > 1e5)
          ? p.toExponential(4)
          : p.toFixed(4);
      return {
        value: `${formattedP} kg·m/s`,
        label: "Momentum (p)",
        subtext: `Calculated using mass and initial velocity.`,
        warning: null,
        formulaUsed: "p = m × v",
      };
    } else if (calcType === "impulse") {
      // Impulse J = m * (v_f - v_i) = F_avg * Δt
      if (invalidMass) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Mass must be a positive number (kg).",
          formulaUsed: null,
        };
      }
      if (invalidVi) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Initial velocity must be a number (m/s).",
          formulaUsed: null,
        };
      }
      if (invalidVf) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Final velocity must be a number (m/s).",
          formulaUsed: null,
        };
      }
      if (invalidDt) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Time interval must be a positive number (s).",
          formulaUsed: null,
        };
      }
      const deltaV = v_f - v_i;
      const J = m * deltaV;
      // Average force F_avg = J / Δt
      const F_avg = J / dt;

      const formattedJ =
        Math.abs(J) !== 0 && (Math.abs(J) < 1e-3 || Math.abs(J) > 1e5)
          ? J.toExponential(4)
          : J.toFixed(4);
      const formattedF =
        Math.abs(F_avg) !== 0 && (Math.abs(F_avg) < 1e-3 || Math.abs(F_avg) > 1e5)
          ? F_avg.toExponential(4)
          : F_avg.toFixed(4);

      return {
        value: `${formattedJ} N·s`,
        label: "Impulse (J)",
        subtext: `Average Force: ${formattedF} N over Δt = ${dt} s`,
        warning: null,
        formulaUsed: "J = m × (v_f - v_i) = F_avg × Δt",
      };
    }

    return {
      value: "Waiting...",
      label: "",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between momentum and impulse?",
      answer:
        "Momentum is the quantity of motion an object has, calculated as mass times velocity (p = m × v). Impulse measures the change in momentum resulting from a force applied over a time interval (J = F × Δt). While momentum describes the state of motion, impulse describes how that state changes.",
    },
    {
      question: "Why is impulse measured in Newton-seconds (N·s)?",
      answer:
        "Impulse is the product of force (Newtons) and time (seconds), so its unit is Newton-seconds (N·s). This unit directly relates to the change in momentum, as impulse equals the change in momentum of an object.",
    },
    {
      question: "Can momentum be negative?",
      answer:
        "Yes, momentum can be negative if the velocity is negative, indicating direction opposite to the chosen positive axis. Momentum is a vector quantity, so direction matters in calculations and interpretations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mass" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-4 h-4 text-blue-600" /> Mass (kg)
          </Label>
          <Input
            id="mass"
            type="number"
            min="0"
            step="any"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
            placeholder="e.g. 5.0"
            aria-describedby="mass-desc"
          />
          <p id="mass-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the object's mass in kilograms (kg).
          </p>
        </div>

        <div>
          <Label htmlFor="initialVelocity" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-4 h-4 text-yellow-600" /> Initial Velocity (m/s)
          </Label>
          <Input
            id="initialVelocity"
            type="number"
            step="any"
            value={inputs.initialVelocity}
            onChange={(e) => handleInputChange("initialVelocity", e.target.value)}
            placeholder="e.g. 10.0"
            aria-describedby="initialVelocity-desc"
          />
          <p id="initialVelocity-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the initial velocity in meters per second (m/s).
          </p>
        </div>

        {inputs.calculate === "impulse" && (
          <>
            <div>
              <Label htmlFor="finalVelocity" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Zap className="w-4 h-4 text-green-600" /> Final Velocity (m/s)
              </Label>
              <Input
                id="finalVelocity"
                type="number"
                step="any"
                value={inputs.finalVelocity}
                onChange={(e) => handleInputChange("finalVelocity", e.target.value)}
                placeholder="e.g. 15.0"
                aria-describedby="finalVelocity-desc"
              />
              <p id="finalVelocity-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter the final velocity in meters per second (m/s).
              </p>
            </div>

            <div>
              <Label htmlFor="timeInterval" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <Waves className="w-4 h-4 text-purple-600" /> Time Interval Δt (s)
              </Label>
              <Input
                id="timeInterval"
                type="number"
                min="0"
                step="any"
                value={inputs.timeInterval}
                onChange={(e) => handleInputChange("timeInterval", e.target.value)}
                placeholder="e.g. 2.0"
                aria-describedby="timeInterval-desc"
              />
              <p id="timeInterval-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter the time interval over which force is applied, in seconds (s).
              </p>
            </div>
          </>
        )}
      </div>

      <div>
        <Label htmlFor="calculate" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          <FlaskConical className="w-4 h-4 text-indigo-600" /> Calculation Type
        </Label>
        <Select
          value={inputs.calculate}
          onValueChange={(value) => handleInputChange("calculate", value)}
          aria-label="Select calculation type"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select calculation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="momentum" aria-label="Calculate Momentum">
              Momentum (p = m × v)
            </SelectItem>
            <SelectItem value="impulse" aria-label="Calculate Impulse">
              Impulse (J = m × Δv)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed; calculation is reactive
          }}
          aria-label="Calculate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mass: "",
              initialVelocity: "",
              finalVelocity: "",
              timeInterval: "",
              calculate: "momentum",
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Momentum &amp; Impulse Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Momentum is a fundamental concept in physics that quantifies the quantity of motion an object possesses. It is defined as the product of an object's mass and its velocity. Impulse, on the other hand, measures the effect of a force applied over a period of time, resulting in a change in momentum. This calculator helps you compute either the momentum of an object or the impulse experienced during a change in velocity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting the mass and velocity values, you can determine the momentum, which is a vector quantity indicating both magnitude and direction of motion. When analyzing collisions or forces applied over time, impulse calculations provide insight into how the momentum changes, which is crucial for understanding dynamics in real-world scenarios.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember that velocity values can be positive or negative depending on direction, and time intervals must be positive. This tool ensures precise calculations and clear unit representation to support your learning and scientific analysis.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Momentum:
p = m × v

where:
  p = momentum (kg·m/s)
  m = mass (kg)
  v = velocity (m/s)

Impulse:
J = m × (v_f - v_i) = F_{avg} × Δt

where:
  J = impulse (N·s)
  m = mass (kg)
  v_i = initial velocity (m/s)
  v_f = final velocity (m/s)
  F_{avg} = average force (N)
  Δt = time interval (s)

Note: Velocity can be positive or negative depending on direction.`}
        </pre>
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
        formula: `Momentum: p = m × v\nImpulse: J = m × (v_f - v_i) = F_{avg} × Δt`,
        variables: [
          { symbol: "p", description: "Momentum (kg·m/s)" },
          { symbol: "m", description: "Mass (kg)" },
          { symbol: "v", description: "Velocity (m/s)" },
          { symbol: "J", description: "Impulse (N·s)" },
          { symbol: "v_i", description: "Initial velocity (m/s)" },
          { symbol: "v_f", description: "Final velocity (m/s)" },
          { symbol: "F_{avg}", description: "Average force (N)" },
          { symbol: "Δt", description: "Time interval (s)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A 3 kg object moves initially at 4 m/s. It is acted upon by a force changing its velocity to 10 m/s over 2 seconds. Calculate the momentum before the force and the impulse applied.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate initial momentum: p = m × v_i = 3 kg × 4 m/s = 12 kg·m/s.",
          },
          {
            label: "2",
            explanation:
              "Calculate impulse: J = m × (v_f - v_i) = 3 kg × (10 - 4) m/s = 18 N·s.",
          },
          {
            label: "3",
            explanation:
              "Calculate average force: F_avg = J / Δt = 18 N·s / 2 s = 9 N.",
          },
        ],
        result:
          "Initial momentum is 12 kg·m/s. The impulse applied is 18 N·s, corresponding to an average force of 9 N over 2 seconds.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Power & Efficiency Calculator", url: "/science/power-efficiency-calculator", icon: "🔥" },
        { title: "Buffer (Henderson–Hasselbalch) Helper", url: "/science/buffer-henderson-hasselbalch-helper", icon: "🧪" },
        { title: "Escape Velocity Calculator", url: "/science/escape-velocity-calculator", icon: "🧪" },
        { title: "ppm / ppb Concentration Converter", url: "/science/ppm-ppb-concentration-converter", icon: "🧪" },
        { title: "Dilution Calculator (C₁V₁ = C₂V₂)", url: "/science/dilution-c1v1-c2v2", icon: "🧪" },
        { title: "Stoichiometry & Limiting Reagent Solver", url: "/science/stoichiometry-limiting-reagent", icon: "🧪" },
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