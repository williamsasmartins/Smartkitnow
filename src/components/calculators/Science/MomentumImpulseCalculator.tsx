import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Scale, Zap, Info, RotateCcw, AlertTriangle } from "lucide-react";
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

  const results = useMemo(() => {
    const g = 9.81; // m/s² (not directly used here but for reference)
    // Parse inputs as floats
    const m = parseFloat(inputs.mass);
    const v_i = parseFloat(inputs.velocityInitial);
    const v_f = parseFloat(inputs.velocityFinal);
    const delta_t = parseFloat(inputs.timeInterval);

    // Validation flags
    const validMass = !isNaN(m) && m > 0;
    const validVi = !isNaN(v_i);
    const validVf = !isNaN(v_f);
    const validDt = !isNaN(delta_t) && delta_t > 0;

    // Momentum initial and final
    const p_i = validMass && validVi ? m * v_i : null; // kg·m/s
    const p_f = validMass && validVf ? m * v_f : null; // kg·m/s

    // Change in momentum (Impulse)
    const impulse = p_i !== null && p_f !== null ? p_f - p_i : null; // kg·m/s

    // Average force = impulse / delta_t
    const avgForce = impulse !== null && validDt ? impulse / delta_t : null; // N (kg·m/s²)

    // Format numbers with scientific notation if needed
    function formatNumber(val: number) {
      if (Math.abs(val) < 1e-4 || Math.abs(val) >= 1e5) {
        return val.toExponential(4);
      }
      return val.toFixed(4);
    }

    // Compose result strings
    let value = 0;
    let label = "";
    let subtext = "";
    let warning = null;
    let formulaUsed = "";

    if (!validMass) {
      warning = "Mass must be a positive number greater than zero.";
    } else if (!validVi) {
      warning = "Initial velocity must be a valid number.";
    } else if (!validVf) {
      warning = "Final velocity must be a valid number.";
    } else if (!validDt) {
      warning = "Time interval must be a positive number greater than zero.";
    } else {
      // Show impulse and average force results
      const impulseStr = formatNumber(impulse!);
      const forceStr = formatNumber(avgForce!);

      value = impulseStr;
      label = "Impulse (Change in Momentum) in kg·m/s";
      subtext = `Average Force: ${forceStr} N over ${delta_t.toFixed(4)} s`;
      formulaUsed = "Impulse = Δp = m(v_f - v_i), Force = Impulse / Δt";
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "What is momentum and why is it important in physics?",
      answer:
        "Momentum is a fundamental physical quantity defined as the product of an object's mass and velocity. It describes the quantity of motion an object has and is conserved in isolated systems, making it crucial for analyzing collisions and interactions in physics.",
    },
    {
      question: "How does impulse relate to force and time?",
      answer:
        "Impulse is the change in momentum of an object resulting from a force applied over a time interval. Mathematically, impulse equals the average force multiplied by the time duration, showing how forces affect motion over time.",
    },
    {
      question: "Why must time interval be positive in impulse calculations?",
      answer:
        "The time interval represents the duration over which a force acts. It must be positive because negative or zero time would be physically meaningless and would invalidate the calculation of average force from impulse.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="mass" className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" /> Mass (kg)
          </Label>
          <Input
            id="mass"
            type="text"
            inputMode="decimal"
            placeholder="e.g., 5.0"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
            aria-describedby="mass-desc"
          />
          <p id="mass-desc" className="text-xs text-slate-500 mt-1">
            Enter the mass of the object in kilograms (kg).
          </p>
        </div>

        <div>
          <Label htmlFor="velocityInitial" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" /> Initial Velocity (m/s)
          </Label>
          <Input
            id="velocityInitial"
            type="text"
            inputMode="decimal"
            placeholder="e.g., 10.0"
            value={inputs.velocityInitial}
            onChange={(e) => handleInputChange("velocityInitial", e.target.value)}
            aria-describedby="vi-desc"
          />
          <p id="vi-desc" className="text-xs text-slate-500 mt-1">
            Enter the initial velocity of the object in meters per second (m/s).
          </p>
        </div>

        <div>
          <Label htmlFor="velocityFinal" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" /> Final Velocity (m/s)
          </Label>
          <Input
            id="velocityFinal"
            type="text"
            inputMode="decimal"
            placeholder="e.g., 15.0"
            value={inputs.velocityFinal}
            onChange={(e) => handleInputChange("velocityFinal", e.target.value)}
            aria-describedby="vf-desc"
          />
          <p id="vf-desc" className="text-xs text-slate-500 mt-1">
            Enter the final velocity of the object in meters per second (m/s).
          </p>
        </div>

        <div>
          <Label htmlFor="timeInterval" className="flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-600" /> Time Interval (s)
          </Label>
          <Input
            id="timeInterval"
            type="text"
            inputMode="decimal"
            placeholder="e.g., 2.0"
            value={inputs.timeInterval}
            onChange={(e) => handleInputChange("timeInterval", e.target.value)}
            aria-describedby="dt-desc"
          />
          <p id="dt-desc" className="text-xs text-slate-500 mt-1">
            Enter the time interval over which the force acts, in seconds (s).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; results update automatically
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
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider" aria-label="Formula used">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-label="Result value">
                {results.value}
              </p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Momentum &amp; Impulse Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Momentum is a vector quantity defined as the product of an object's mass and velocity. It represents the quantity of motion an object possesses and is fundamental in analyzing physical systems, especially collisions. Impulse, on the other hand, measures the change in momentum resulting from a force applied over a specific time interval. This calculator helps you quantify both momentum and impulse, providing insight into how forces influence motion.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting the mass of an object, its initial and final velocities, and the time interval during which a force acts, you can calculate the impulse experienced and the average force applied. This is particularly useful in physics education and practical applications like vehicle crash analysis, sports science, and engineering.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these concepts deepens your grasp of Newton's laws of motion and conservation principles. The calculator ensures precise results by enforcing correct units and validating inputs, making it a reliable tool for students and professionals alike.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Impulse (J) = Δp = m(v_f - v_i)
Average Force (F_avg) = J / Δt

Where:
  m     = mass of the object (kg)
  v_i   = initial velocity (m/s)
  v_f   = final velocity (m/s)
  Δp    = change in momentum (kg·m/s)
  J     = impulse (kg·m/s)
  Δt    = time interval over which force acts (s)
  F_avg = average force applied (N)`}
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
      title="Momentum &amp; Impulse Calculator"
      description="Calculate Momentum and Impulse. Analyze collisions and the change in motion of objects using mass and velocity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Impulse (J) = Δp = m(v_f - v_i)
Average Force (F_avg) = J / Δt`,
        variables: [
          { symbol: "m", description: "Mass of the object in kilograms (kg)" },
          { symbol: "v_i", description: "Initial velocity in meters per second (m/s)" },
          { symbol: "v_f", description: "Final velocity in meters per second (m/s)" },
          { symbol: "Δp", description: "Change in momentum (Impulse) in kg·m/s" },
          { symbol: "J", description: "Impulse in kg·m/s" },
          { symbol: "Δt", description: "Time interval over which force acts in seconds (s)" },
          { symbol: "F_avg", description: "Average force applied in newtons (N)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A 2 kg object changes its velocity from 3 m/s to 7 m/s over 4 seconds. Calculate the impulse and average force applied.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the change in velocity: 7 m/s - 3 m/s = 4 m/s.",
          },
          {
            label: "2",
            explanation:
              "Calculate impulse: J = m × Δv = 2 kg × 4 m/s = 8 kg·m/s.",
          },
          {
            label: "3",
            explanation:
              "Calculate average force: F_avg = J / Δt = 8 kg·m/s ÷ 4 s = 2 N.",
          },
        ],
        result: "Impulse = 8 kg·m/s, Average Force = 2 N",
      }}
      relatedCalculators={[
        { title: "Specific Heat Calculator", url: "/science/specific-heat-q-mc-delta-t", icon: "Zap" },
        { title: "Buffer (Henderson–Hasselbalch) Helper", url: "/science/buffer-henderson-hasselbalch-helper", icon: "FlaskConical" },
        { title: "RC Time Constant Calculator", url: "/science/rc-time-constant-tau-rc", icon: "Zap" },
        { title: "Density / Specific Gravity Calculator", url: "/science/density-specific-gravity-calculator", icon: "Orbit" },
        { title: "Radioactive Activity Calculator", url: "/science/radioactive-activity-a-lambda-n", icon: "FlaskConical" },
        { title: "Dilution Calculator (C₁V₁ = C₂V₂)", url: "/science/dilution-c1v1-c2v2", icon: "FlaskConical" },
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