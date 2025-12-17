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

export default function ForceWorkEnergyCalculator() {
  // Inputs: mass (kg), acceleration (m/s²), displacement (m), velocity (m/s)
  // User can calculate Force, Work, Kinetic Energy, Potential Energy
  // Select calculation type

  const [inputs, setInputs] = useState({
    calculationType: "force", // force, work, kineticEnergy, potentialEnergy
    mass: "",
    acceleration: "",
    displacement: "",
    velocity: "",
    height: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  const g = 9.81; // m/s² gravitational acceleration

  // Validation helper
  const isPositiveNumber = (val: string) => {
    if (!val) return false;
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  };

  // Calculation logic in useMemo
  const results = useMemo(() => {
    const { calculationType, mass, acceleration, displacement, velocity, height } = inputs;

    // Parse inputs to numbers
    const m = Number(mass);
    const a = Number(acceleration);
    const d = Number(displacement);
    const v = Number(velocity);
    const h = Number(height);

    // Validation and warnings
    let warning: string | null = null;

    // Helper to format results with units and scientific notation if needed
    function formatResult(val: number, unit: string) {
      if (val === 0) return `0 ${unit}`;
      if (Math.abs(val) >= 10000 || Math.abs(val) < 0.001) {
        return `${val.toExponential(4)} ${unit}`;
      }
      return `${val.toFixed(4)} ${unit}`;
    }

    switch (calculationType) {
      case "force":
        // Force = mass * acceleration
        if (!isPositiveNumber(mass)) {
          warning = "Mass must be a non-negative number.";
          return {
            value: "Waiting...",
            label: "Enter valid mass",
            subtext: "",
            warning,
            formulaUsed: "F = m × a",
          };
        }
        if (acceleration === "") {
          return {
            value: "Waiting...",
            label: "Enter acceleration",
            subtext: "",
            warning: null,
            formulaUsed: "F = m × a",
          };
        }
        if (isNaN(a)) {
          warning = "Acceleration must be a number.";
          return {
            value: "Waiting...",
            label: "Invalid acceleration",
            subtext: "",
            warning,
            formulaUsed: "F = m × a",
          };
        }
        const force = m * a;
        return {
          value: formatResult(force, "Newtons (N)"),
          label: "Force",
          subtext: `Force exerted by mass ${m} kg with acceleration ${a} m/s²`,
          warning: null,
          formulaUsed: "F = m × a",
        };

      case "work":
        // Work = Force × displacement = m × a × d
        if (!isPositiveNumber(mass)) {
          warning = "Mass must be a non-negative number.";
          return {
            value: "Waiting...",
            label: "Enter valid mass",
            subtext: "",
            warning,
            formulaUsed: "W = F × d = m × a × d",
          };
        }
        if (acceleration === "" || displacement === "") {
          return {
            value: "Waiting...",
            label: "Enter acceleration and displacement",
            subtext: "",
            warning: null,
            formulaUsed: "W = F × d = m × a × d",
          };
        }
        if (isNaN(a) || isNaN(d)) {
          warning = "Acceleration and displacement must be numbers.";
          return {
            value: "Waiting...",
            label: "Invalid input",
            subtext: "",
            warning,
            formulaUsed: "W = F × d = m × a × d",
          };
        }
        const work = m * a * d;
        return {
          value: formatResult(work, "Joules (J)"),
          label: "Work Done",
          subtext: `Work done moving mass ${m} kg with force from acceleration ${a} m/s² over displacement ${d} m`,
          warning: null,
          formulaUsed: "W = F × d = m × a × d",
        };

      case "kineticEnergy":
        // KE = 1/2 m v²
        if (!isPositiveNumber(mass)) {
          warning = "Mass must be a non-negative number.";
          return {
            value: "Waiting...",
            label: "Enter valid mass",
            subtext: "",
            warning,
            formulaUsed: "KE = 1/2 m v²",
          };
        }
        if (velocity === "") {
          return {
            value: "Waiting...",
            label: "Enter velocity",
            subtext: "",
            warning: null,
            formulaUsed: "KE = 1/2 m v²",
          };
        }
        if (isNaN(v)) {
          warning = "Velocity must be a number.";
          return {
            value: "Waiting...",
            label: "Invalid velocity",
            subtext: "",
            warning,
            formulaUsed: "KE = 1/2 m v²",
          };
        }
        const kineticEnergy = 0.5 * m * v * v;
        return {
          value: formatResult(kineticEnergy, "Joules (J)"),
          label: "Kinetic Energy",
          subtext: `Energy of mass ${m} kg moving at velocity ${v} m/s`,
          warning: null,
          formulaUsed: "KE = 1/2 m v²",
        };

      case "potentialEnergy":
        // PE = m g h
        if (!isPositiveNumber(mass)) {
          warning = "Mass must be a non-negative number.";
          return {
            value: "Waiting...",
            label: "Enter valid mass",
            subtext: "",
            warning,
            formulaUsed: "PE = m g h",
          };
        }
        if (height === "") {
          return {
            value: "Waiting...",
            label: "Enter height",
            subtext: "",
            warning: null,
            formulaUsed: "PE = m g h",
          };
        }
        if (isNaN(h)) {
          warning = "Height must be a number.";
          return {
            value: "Waiting...",
            label: "Invalid height",
            subtext: "",
            warning,
            formulaUsed: "PE = m g h",
          };
        }
        const potentialEnergy = m * g * h;
        return {
          value: formatResult(potentialEnergy, "Joules (J)"),
          label: "Potential Energy",
          subtext: `Energy of mass ${m} kg at height ${h} m (g = ${g} m/s²)`,
          warning: null,
          formulaUsed: "PE = m g h",
        };

      default:
        return {
          value: "Waiting...",
          label: "Select calculation type",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
    }
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is the difference between work and energy?",
      answer:
        "Work and energy are closely related concepts in physics. Work is the process of energy transfer when a force moves an object over a distance. Energy is the capacity to do work. For example, when you lift an object, you do work on it, increasing its potential energy. Understanding this relationship is essential in fields like engineering and mechanics.",
    },
    {
      question: "Why do we use scientific notation for very large or small values?",
      answer:
        "Scientific notation allows us to express very large or very small numbers compactly and clearly, avoiding errors and improving readability. In physics and chemistry, quantities like atomic masses or astronomical distances can be extremely large or small, making scientific notation essential for precise communication and calculation.",
    },
    {
      question: "How is force calculated using mass and acceleration?",
      answer:
        "Force is calculated using Newton's second law of motion, which states that force equals mass times acceleration (F = m × a). This means the force applied to an object is proportional to its mass and the acceleration it experiences. This principle is fundamental in mechanics and is widely used in engineering and physics applications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Calculation Type Selector */}
      <div>
        <Label htmlFor="calculationType" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
          Select Calculation
        </Label>
        <Select
          value={inputs.calculationType}
          onValueChange={(val) => handleInputChange("calculationType", val)}
          id="calculationType"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose calculation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="force">
              <Zap className="mr-2 inline h-4 w-4" /> Force (F = m × a)
            </SelectItem>
            <SelectItem value="work">
              <Scale className="mr-2 inline h-4 w-4" /> Work (W = F × d)
            </SelectItem>
            <SelectItem value="kineticEnergy">
              <Atom className="mr-2 inline h-4 w-4" /> Kinetic Energy (KE = 1/2 m v²)
            </SelectItem>
            <SelectItem value="potentialEnergy">
              <Zap className="mr-2 inline h-4 w-4" /> Potential Energy (PE = m g h)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs based on calculation type */}
      {inputs.calculationType === "force" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Mass (kg)
            </Label>
            <Input
              id="mass"
              type="number"
              min="0"
              step="any"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <Label htmlFor="acceleration" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Acceleration (m/s²)
            </Label>
            <Input
              id="acceleration"
              type="number"
              step="any"
              value={inputs.acceleration}
              onChange={(e) => handleInputChange("acceleration", e.target.value)}
              placeholder="e.g., 9.81"
            />
          </div>
        </>
      )}

      {inputs.calculationType === "work" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Mass (kg)
            </Label>
            <Input
              id="mass"
              type="number"
              min="0"
              step="any"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <Label htmlFor="acceleration" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Acceleration (m/s²)
            </Label>
            <Input
              id="acceleration"
              type="number"
              step="any"
              value={inputs.acceleration}
              onChange={(e) => handleInputChange("acceleration", e.target.value)}
              placeholder="e.g., 9.81"
            />
          </div>
          <div>
            <Label htmlFor="displacement" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Displacement (m)
            </Label>
            <Input
              id="displacement"
              type="number"
              step="any"
              value={inputs.displacement}
              onChange={(e) => handleInputChange("displacement", e.target.value)}
              placeholder="e.g., 5"
            />
          </div>
        </>
      )}

      {inputs.calculationType === "kineticEnergy" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Mass (kg)
            </Label>
            <Input
              id="mass"
              type="number"
              min="0"
              step="any"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <Label htmlFor="velocity" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Velocity (m/s)
            </Label>
            <Input
              id="velocity"
              type="number"
              step="any"
              value={inputs.velocity}
              onChange={(e) => handleInputChange("velocity", e.target.value)}
              placeholder="e.g., 15"
            />
          </div>
        </>
      )}

      {inputs.calculationType === "potentialEnergy" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Mass (kg)
            </Label>
            <Input
              id="mass"
              type="number"
              min="0"
              step="any"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
          <div>
            <Label htmlFor="height" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Height (m)
            </Label>
            <Input
              id="height"
              type="number"
              step="any"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              placeholder="e.g., 20"
            />
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger re-calculation by setting state to current inputs (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              calculationType: "force",
              mass: "",
              acceleration: "",
              displacement: "",
              velocity: "",
              height: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <strong>Science Fact:</strong> Always check your units (e.g., convert grams to kg for physics formulas). Using consistent SI units ensures accurate calculations.
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
          This calculator helps you compute fundamental physics quantities: force, work, kinetic energy, and potential energy. Force is the interaction that changes an object's motion, calculated as mass times acceleration (F = m × a). Work measures energy transfer when a force moves an object over a distance (W = F × d). Kinetic energy is the energy of motion (KE = 1/2 m v²), while potential energy is stored energy due to position (PE = m g h). These concepts are foundational in physics and engineering.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding these quantities is essential in many real-world applications, such as designing vehicles, calculating energy efficiency, and analyzing mechanical systems. For example, engineers use force calculations to ensure structures withstand loads, while work and energy principles help optimize machine performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool provides an educational and precise way to explore these physics concepts interactively. Always ensure your inputs use consistent units (SI units) to get accurate results.
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
W = F × d = m × a × d
where
  W = Work done (Joules, J)
  F = Force (Newtons, N)
  d = Displacement (meters, m)

Kinetic Energy:
KE = 1/2 m v²
where
  KE = Kinetic Energy (Joules, J)
  m = Mass (kilograms, kg)
  v = Velocity (meters per second, m/s)

Potential Energy:
PE = m g h
where
  PE = Potential Energy (Joules, J)
  m = Mass (kilograms, kg)
  g = Gravitational acceleration (9.81 m/s²)
  h = Height (meters, m)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using this calculator: Calculate the work done to move a 10 kg box with an acceleration of 2 m/s² over a displacement of 5 meters.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> mass m = 10 kg, acceleration a = 2 m/s², displacement d = 5 m
          </li>
          <li>
            <strong>Step 1:</strong> Calculate the force using F = m × a = 10 × 2 = 20 N
          </li>
          <li>
            <strong>Step 2:</strong> Calculate the work done using W = F × d = 20 × 5 = 100 Joules
          </li>
          <li>
            <strong>Result:</strong> The work done to move the box is 100 Joules (J)
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

  // Formula object for CalculatorVerticalLayout
  const formula = {
    title: "Scientific Formula",
    formula: `Force: F = m × a
Work: W = F × d = m × a × d
Kinetic Energy: KE = 1/2 m v²
Potential Energy: PE = m g h`,
    variables: [
      { symbol: "F", description: "Force (Newtons, N)" },
      { symbol: "W", description: "Work done (Joules, J)" },
      { symbol: "KE", description: "Kinetic Energy (Joules, J)" },
      { symbol: "PE", description: "Potential Energy (Joules, J)" },
      { symbol: "m", description: "Mass (kilograms, kg)" },
      { symbol: "a", description: "Acceleration (meters per second squared, m/s²)" },
      { symbol: "d", description: "Displacement (meters, m)" },
      { symbol: "v", description: "Velocity (meters per second, m/s)" },
      { symbol: "g", description: "Gravitational acceleration (9.81 m/s²)" },
      { symbol: "h", description: "Height (meters, m)" },
    ],
  };

  // Example object for CalculatorVerticalLayout
  const example = {
    title: "Example",
    scenario:
      "Calculate the work done to move a 10 kg box with an acceleration of 2 m/s² over a displacement of 5 meters.",
    steps: [
      { label: "1", explanation: "Calculate the force: F = m × a = 10 × 2 = 20 N" },
      { label: "2", explanation: "Calculate the work done: W = F × d = 20 × 5 = 100 Joules" },
    ],
    result: "The work done to move the box is 100 Joules (J).",
  };

  return (
    <CalculatorVerticalLayout
      title="Force, Work & Energy Calculator"
      description="Calculate Force, Work, and Energy. Solve physics problems involving Newton's laws, kinetic energy, and potential energy."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
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