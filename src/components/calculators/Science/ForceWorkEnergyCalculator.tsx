import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Zap, Scale, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const g = 9.81; // m/s^2 gravitational acceleration

export default function ForceWorkEnergyCalculator() {
  // Inputs:
  // mode: "force", "work", "kineticEnergy", "potentialEnergy"
  // For force: mass (kg), acceleration (m/s²)
  // For work: force (N), displacement (m), angle (deg)
  // For kinetic energy: mass (kg), velocity (m/s)
  // For potential energy: mass (kg), height (m)

  const [inputs, setInputs] = useState({
    mode: "force",
    mass: "",
    acceleration: "",
    force: "",
    displacement: "",
    angle: "0",
    velocity: "",
    height: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Parse inputs as floats
    const mass = parseFloat(inputs.mass);
    const acceleration = parseFloat(inputs.acceleration);
    const force = parseFloat(inputs.force);
    const displacement = parseFloat(inputs.displacement);
    const angle = parseFloat(inputs.angle);
    const velocity = parseFloat(inputs.velocity);
    const height = parseFloat(inputs.height);

    // Validation helper
    const isValidNumber = (v: number) => !isNaN(v) && isFinite(v);

    // Result object template
    const waiting = {
      value: "Waiting...",
      label: "Enter all required inputs",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };

    switch (inputs.mode) {
      case "force":
        // F = m * a
        if (!isValidNumber(mass) || !isValidNumber(acceleration)) return waiting;
        if (mass < 0) return { ...waiting, warning: "Mass cannot be negative." };
        // Calculate force
        const forceCalc = mass * acceleration;
        const forceDisplay =
          Math.abs(forceCalc) > 10000 || Math.abs(forceCalc) < 0.001
            ? forceCalc.toExponential(4)
            : forceCalc.toFixed(4);
        return {
          value: `${forceDisplay} Newton${Math.abs(forceCalc) !== 1 ? "s" : ""}`,
          label: "Force",
          subtext: `Calculated using mass (kg) and acceleration (m/s²)`,
          warning: null,
          formulaUsed: "F = m × a",
        };

      case "work":
        // W = F × d × cos(θ)
        if (!isValidNumber(force) || !isValidNumber(displacement) || !isValidNumber(angle))
          return waiting;
        if (displacement < 0) return { ...waiting, warning: "Displacement cannot be negative." };
        // Convert angle to radians
        const angleRad = (angle * Math.PI) / 180;
        const workCalc = force * displacement * Math.cos(angleRad);
        const workDisplay =
          Math.abs(workCalc) > 10000 || Math.abs(workCalc) < 0.001
            ? workCalc.toExponential(4)
            : workCalc.toFixed(4);
        return {
          value: `${workDisplay} Joules`,
          label: "Work Done",
          subtext: `Force (N), displacement (m), angle (°) used`,
          warning: null,
          formulaUsed: "W = F × d × cos(θ)",
        };

      case "kineticEnergy":
        // KE = 1/2 m v²
        if (!isValidNumber(mass) || !isValidNumber(velocity)) return waiting;
        if (mass < 0) return { ...waiting, warning: "Mass cannot be negative." };
        const keCalc = 0.5 * mass * velocity * velocity;
        const keDisplay =
          keCalc > 10000 || (keCalc !== 0 && keCalc < 0.001)
            ? keCalc.toExponential(4)
            : keCalc.toFixed(4);
        return {
          value: `${keDisplay} Joules`,
          label: "Kinetic Energy",
          subtext: "Mass (kg) and velocity (m/s) used",
          warning: null,
          formulaUsed: "Eₖ = 1/2 m v²",
        };

      case "potentialEnergy":
        // PE = m g h
        if (!isValidNumber(mass) || !isValidNumber(height)) return waiting;
        if (mass < 0) return { ...waiting, warning: "Mass cannot be negative." };
        const peCalc = mass * g * height;
        const peDisplay =
          peCalc > 10000 || (peCalc !== 0 && peCalc < 0.001)
            ? peCalc.toExponential(4)
            : peCalc.toFixed(4);
        return {
          value: `${peDisplay} Joules`,
          label: "Potential Energy",
          subtext: `Mass (kg), height (m), and g = ${g} m/s² used`,
          warning: null,
          formulaUsed: "Eₚ = m g h",
        };

      default:
        return waiting;
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between work and energy?",
      answer:
        "Work and energy are closely related concepts in physics. Work is the process of energy transfer when a force moves an object over a distance. Energy is the capacity to do work. For example, kinetic energy is the energy of motion, while work is done when a force causes displacement. Understanding both helps in analyzing physical systems and engineering applications.",
    },
    {
      question: "Why do we use cosine of the angle in work calculation?",
      answer:
        "The cosine of the angle between the force and displacement vectors determines the effective component of force doing work. If the force is in the same direction as displacement, cos(0°) = 1, so all force contributes. If perpendicular, cos(90°) = 0, so no work is done. This is essential in mechanics to accurately calculate work done by forces at angles.",
    },
    {
      question: "How is potential energy related to height?",
      answer:
        "Potential energy in a gravitational field depends directly on the height of an object above a reference point. The higher the object, the more potential energy it stores, calculated as Eₚ = mgh. This principle is widely used in engineering, such as in hydroelectric power where water's height determines energy potential.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div>
        <Label htmlFor="mode" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          <Zap className="w-5 h-5 text-yellow-500" /> Select Calculation Mode
        </Label>
        <Select
          value={inputs.mode}
          onValueChange={(val) => setInputs((prev) => ({ ...prev, mode: val }))}
          id="mode"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="force">Force (F = m × a)</SelectItem>
            <SelectItem value="work">Work (W = F × d × cos(θ))</SelectItem>
            <SelectItem value="kineticEnergy">Kinetic Energy (Eₖ = 1/2 m v²)</SelectItem>
            <SelectItem value="potentialEnergy">Potential Energy (Eₚ = m g h)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs based on mode */}
      {inputs.mode === "force" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Scale className="w-5 h-5 text-green-600" /> Mass (kg)
            </Label>
            <Input
              type="number"
              id="mass"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
              placeholder="e.g. 10"
              min="0"
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="acceleration" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Zap className="w-5 h-5 text-yellow-500" /> Acceleration (m/s²)
            </Label>
            <Input
              type="number"
              id="acceleration"
              value={inputs.acceleration}
              onChange={(e) => handleInputChange("acceleration", e.target.value)}
              placeholder="e.g. 9.81"
              step="any"
            />
          </div>
        </>
      )}

      {inputs.mode === "work" && (
        <>
          <div>
            <Label htmlFor="force" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Zap className="w-5 h-5 text-yellow-500" /> Force (Newtons, N)
            </Label>
            <Input
              type="number"
              id="force"
              value={inputs.force}
              onChange={(e) => handleInputChange("force", e.target.value)}
              placeholder="e.g. 50"
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="displacement" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Scale className="w-5 h-5 text-green-600" /> Displacement (meters, m)
            </Label>
            <Input
              type="number"
              id="displacement"
              value={inputs.displacement}
              onChange={(e) => handleInputChange("displacement", e.target.value)}
              placeholder="e.g. 10"
              min="0"
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="angle" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <RotateCcw className="w-5 h-5 text-blue-600" /> Angle (degrees, θ)
            </Label>
            <Input
              type="number"
              id="angle"
              value={inputs.angle}
              onChange={(e) => handleInputChange("angle", e.target.value)}
              placeholder="0"
              step="any"
              min="0"
              max="180"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Angle between force and displacement vectors (0° ≤ θ ≤ 180°)
            </p>
          </div>
        </>
      )}

      {inputs.mode === "kineticEnergy" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Scale className="w-5 h-5 text-green-600" /> Mass (kg)
            </Label>
            <Input
              type="number"
              id="mass"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
              placeholder="e.g. 5"
              min="0"
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="velocity" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Zap className="w-5 h-5 text-yellow-500" /> Velocity (m/s)
            </Label>
            <Input
              type="number"
              id="velocity"
              value={inputs.velocity}
              onChange={(e) => handleInputChange("velocity", e.target.value)}
              placeholder="e.g. 12"
              step="any"
            />
          </div>
        </>
      )}

      {inputs.mode === "potentialEnergy" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Scale className="w-5 h-5 text-green-600" /> Mass (kg)
            </Label>
            <Input
              type="number"
              id="mass"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
              placeholder="e.g. 8"
              min="0"
              step="any"
            />
          </div>
          <div>
            <Label htmlFor="height" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Zap className="w-5 h-5 text-yellow-500" /> Height (meters, m)
            </Label>
            <Input
              type="number"
              id="height"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              placeholder="e.g. 15"
              step="any"
            />
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          type="button"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mode: "force",
              mass: "",
              acceleration: "",
              force: "",
              displacement: "",
              angle: "0",
              velocity: "",
              height: "",
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
              <strong>Science Fact:</strong> Always check your units (e.g., convert grams to kg for physics formulas). Angles must be in degrees for work calculation.
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
          Understanding Force, Work & Energy Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you compute fundamental physics quantities: force, work, kinetic energy, and potential energy. Force is the interaction that causes an object to accelerate, calculated by multiplying mass and acceleration. Work quantifies energy transfer when a force moves an object over a distance, factoring in the angle between force and displacement. Kinetic energy measures the energy of motion, while potential energy represents stored energy due to position in a gravitational field.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These concepts are foundational in physics and engineering, used in designing machines, vehicles, and structures. For example, engineers calculate forces to ensure bridges withstand loads, while understanding work and energy is crucial in mechanical systems and energy conservation. This tool provides precise calculations with clear units and scientific notation for very large or small values.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Always ensure your inputs are in correct SI units: mass in kilograms, distances in meters, forces in Newtons, and angles in degrees. This ensures accurate and meaningful results. Use this calculator to deepen your understanding or assist in solving physics problems.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Force:
F = m × a
where
  F = Force (Newtons, N)
  m = Mass (kilograms, kg)
  a = Acceleration (meters per second squared, m/s²)

Work:
W = F × d × cos(θ)
where
  W = Work done (Joules, J)
  F = Force (Newtons, N)
  d = Displacement (meters, m)
  θ = Angle between force and displacement (degrees, °)

Kinetic Energy:
Eₖ = 1/2 m v²
where
  Eₖ = Kinetic Energy (Joules, J)
  m = Mass (kilograms, kg)
  v = Velocity (meters per second, m/s)

Potential Energy:
Eₚ = m g h
where
  Eₚ = Potential Energy (Joules, J)
  m = Mass (kilograms, kg)
  g = Gravitational acceleration (9.81 m/s²)
  h = Height above reference point (meters, m)
`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem calculating the work done by a force:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A force of 100 N is applied to push a box 5 meters across the floor at an angle of 30° to the direction of displacement.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate the work done using W = F × d × cos(θ).
          </li>
          <li>
            <strong>Step 2:</strong> Convert angle to radians or use cosine of 30° ≈ 0.866.
          </li>
          <li>
            <strong>Step 3:</strong> Work = 100 N × 5 m × 0.866 = 433 Joules.
          </li>
          <li>
            <strong>Result:</strong> The work done on the box is approximately 433 Joules.
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
      title="Force, Work & Energy Calculator"
      description="Calculate Force, Work, and Energy. Solve physics problems involving Newton's laws, kinetic energy, and potential energy."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Force: F = m × a
Work: W = F × d × cos(θ)
Kinetic Energy: Eₖ = 1/2 m v²
Potential Energy: Eₚ = m g h`,
        variables: [
          { symbol: "F", description: "Force in Newtons (N)" },
          { symbol: "m", description: "Mass in kilograms (kg)" },
          { symbol: "a", description: "Acceleration in meters per second squared (m/s²)" },
          { symbol: "W", description: "Work done in Joules (J)" },
          { symbol: "d", description: "Displacement in meters (m)" },
          { symbol: "θ", description: "Angle between force and displacement in degrees (°)" },
          { symbol: "Eₖ", description: "Kinetic Energy in Joules (J)" },
          { symbol: "v", description: "Velocity in meters per second (m/s)" },
          { symbol: "Eₚ", description: "Potential Energy in Joules (J)" },
          { symbol: "g", description: "Gravitational acceleration (9.81 m/s²)" },
          { symbol: "h", description: "Height in meters (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the work done by a 100 N force pushing a box 5 meters at an angle of 30° to the displacement.",
        steps: [
          { label: "1", explanation: "Identify given values: F = 100 N, d = 5 m, θ = 30°." },
          { label: "2", explanation: "Calculate work using W = F × d × cos(θ)." },
          { label: "3", explanation: "Compute cos(30°) ≈ 0.866 and multiply: 100 × 5 × 0.866 = 433 J." },
        ],
        result: "Work done is approximately 433 Joules.",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "Orbit" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "FlaskConical" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "Zap" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "Zap" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "Waves" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "Thermometer" },
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