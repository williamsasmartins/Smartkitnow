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
  const [inputs, setInputs] = useState({
    mass: "", // in kg
    initialVelocity: "", // in m/s
    finalVelocity: "", // in m/s
    timeInterval: "", // in seconds
    calculationType: "momentum", // "momentum" or "impulse"
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  const g = 9.81; // m/s², not directly needed here but for reference

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    // Parse inputs to floats
    const m = parseFloat(inputs.mass);
    const v_i = parseFloat(inputs.initialVelocity);
    const v_f = parseFloat(inputs.finalVelocity);
    const dt = parseFloat(inputs.timeInterval);

    // Validation
    if (
      isNaN(m) || m <= 0 ||
      (isNaN(v_i) && inputs.calculationType === "momentum") ||
      (isNaN(v_i) || isNaN(v_f) || isNaN(dt) || dt <= 0) && inputs.calculationType === "impulse"
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid inputs",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculation
    if (inputs.calculationType === "momentum") {
      // Momentum p = m * v
      const p = m * v_i;
      const displayVal =
        Math.abs(p) >= 10000 || (Math.abs(p) > 0 && Math.abs(p) < 0.001)
          ? p.toExponential(4)
          : p.toFixed(4);
      return {
        value: `${displayVal} kg·m/s`,
        label: "Momentum",
        subtext: "Momentum (p) = mass × velocity",
        warning: null,
        formulaUsed: "p = m × v",
      };
    } else {
      // Impulse J = m × (v_f - v_i) = F_avg × Δt
      const deltaV = v_f - v_i;
      const J = m * deltaV;
      const displayVal =
        Math.abs(J) >= 10000 || (Math.abs(J) > 0 && Math.abs(J) < 0.001)
          ? J.toExponential(4)
          : J.toFixed(4);
      return {
        value: `${displayVal} N·s`,
        label: "Impulse",
        subtext:
          "Impulse (J) = mass × change in velocity = average force × time interval",
        warning:
          dt <= 0
            ? "Time interval must be greater than zero for impulse calculation."
            : null,
        formulaUsed: "J = m × (v_f - v_i) = F_avg × Δt",
      };
    }
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is momentum and why is it important?",
      answer:
        "Momentum is a fundamental concept in physics defined as the product of an object's mass and velocity. It quantifies the motion of an object and is conserved in isolated systems, making it essential for analyzing collisions and motion. Understanding momentum helps engineers design safer vehicles and predict outcomes in physical interactions.",
    },
    {
      question: "How does impulse relate to force and motion?",
      answer:
        "Impulse measures the effect of a force applied over a time interval, causing a change in an object's momentum. It is calculated as the product of average force and the duration of application. Impulse is crucial in understanding how forces influence motion, such as in car crash safety features where force is spread over time to reduce injury.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mass" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Mass (kg)
          </Label>
          <Input
            id="mass"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 5"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
          />
        </div>

        {inputs.calculationType === "momentum" && (
          <div>
            <Label htmlFor="initialVelocity" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
              Velocity (m/s)
            </Label>
            <Input
              id="initialVelocity"
              type="number"
              step="any"
              placeholder="e.g., 10"
              value={inputs.initialVelocity}
              onChange={(e) => handleInputChange("initialVelocity", e.target.value)}
            />
          </div>
        )}

        {inputs.calculationType === "impulse" && (
          <>
            <div>
              <Label htmlFor="initialVelocity" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                Initial Velocity (m/s)
              </Label>
              <Input
                id="initialVelocity"
                type="number"
                step="any"
                placeholder="e.g., 5"
                value={inputs.initialVelocity}
                onChange={(e) => handleInputChange("initialVelocity", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="finalVelocity" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                Final Velocity (m/s)
              </Label>
              <Input
                id="finalVelocity"
                type="number"
                step="any"
                placeholder="e.g., 15"
                value={inputs.finalVelocity}
                onChange={(e) => handleInputChange("finalVelocity", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="timeInterval" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
                Time Interval (s)
              </Label>
              <Input
                id="timeInterval"
                type="number"
                min="0"
                step="any"
                placeholder="e.g., 2"
                value={inputs.timeInterval}
                onChange={(e) => handleInputChange("timeInterval", e.target.value)}
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="calculationType" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
            Calculation Type
          </Label>
          <Select
            value={inputs.calculationType}
            onValueChange={(value) => handleInputChange("calculationType", value)}
          >
            <SelectTrigger id="calculationType" className="w-full">
              <SelectValue placeholder="Select calculation type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="momentum">Momentum (p = m × v)</SelectItem>
              <SelectItem value="impulse">Impulse (J = m × Δv)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
          type="button"
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
              calculationType: "momentum",
            })
          }
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
              <strong>Science Fact:</strong> Always ensure units are consistent (e.g., mass in kilograms, velocity in meters per second) for accurate physics calculations.
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
          Momentum is a vector quantity defined as the product of an object's mass and velocity. It describes the quantity of motion an object has and is conserved in isolated systems. Impulse, on the other hand, measures the change in momentum resulting from a force applied over a time interval. Both concepts are fundamental in physics to analyze motion, collisions, and forces.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to compute either the momentum of an object or the impulse experienced during a change in velocity. By inputting mass and velocity values, you can explore how objects behave under different conditions. Understanding these principles is essential in fields such as mechanical engineering, automotive safety design, and sports science.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, always use consistent units: mass in kilograms (kg), velocity in meters per second (m/s), and time in seconds (s). Incorrect units can lead to inaccurate results and misunderstandings of physical phenomena.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Momentum (p):
p = m × v

Impulse (J):
J = m × (v_f - v_i) = F_{avg} × Δt

Where:
m     = mass (kg)
v     = velocity (m/s)
v_i   = initial velocity (m/s)
v_f   = final velocity (m/s)
J     = impulse (N·s)
F_{avg} = average force (N)
Δt    = time interval (s)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem calculating impulse:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A 2 kg object changes velocity from 3 m/s to 8 m/s in 2 seconds.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate change in velocity: Δv = 8 - 3 = 5 m/s.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate impulse: J = m × Δv = 2 × 5 = 10 N·s.
          </li>
          <li>
            <strong>Step 3:</strong> Calculate average force: F_avg = J / Δt = 10 / 2 = 5 N.
          </li>
          <li>
            <strong>Result:</strong> The impulse is 10 N·s, and the average force applied is 5 N over 2 seconds.
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
        title: "Impulse Calculation Example",
        scenario:
          "A 2 kg object changes velocity from 3 m/s to 8 m/s in 2 seconds. Calculate the impulse and average force applied.",
        steps: [
          { label: "1", explanation: "Calculate change in velocity: Δv = 8 - 3 = 5 m/s." },
          { label: "2", explanation: "Calculate impulse: J = m × Δv = 2 × 5 = 10 N·s." },
          { label: "3", explanation: "Calculate average force: F_avg = J / Δt = 10 / 2 = 5 N." },
        ],
        result: "Impulse is 10 N·s and average force applied is 5 N over 2 seconds.",
      }}
      relatedCalculators={[
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
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