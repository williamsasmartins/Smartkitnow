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

const g = 9.81; // m/s^2, acceleration due to gravity

export default function ForceWorkEnergyCalculator() {
  // Inputs:
  // - Calculation type: Force, Work, Kinetic Energy, Potential Energy
  // - Variables depend on calculation:
  //   Force: mass (kg), acceleration (m/s²)
  //   Work: force (N), displacement (m), angle (deg)
  //   Kinetic Energy: mass (kg), velocity (m/s)
  //   Potential Energy: mass (kg), height (m)
  const [inputs, setInputs] = useState({
    calculationType: "force",
    mass: "",
    acceleration: "",
    force: "",
    displacement: "",
    angle: "0",
    velocity: "",
    height: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Parse inputs to floats, handle empty or invalid inputs
    const mass = parseFloat(inputs.mass);
    const acceleration = parseFloat(inputs.acceleration);
    const force = parseFloat(inputs.force);
    const displacement = parseFloat(inputs.displacement);
    const angleDeg = parseFloat(inputs.angle);
    const velocity = parseFloat(inputs.velocity);
    const height = parseFloat(inputs.height);

    // Validation helper
    function isValidNumber(n) {
      return typeof n === "number" && !isNaN(n);
    }

    // Result object template
    const waiting = {
      value: "Waiting...",
      label: "Enter all required inputs",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };

    switch (inputs.calculationType) {
      case "force": {
        // Force = mass * acceleration
        if (!isValidNumber(mass) || mass <= 0) {
          return {
            ...waiting,
            warning: "Mass must be a positive number (kg).",
          };
        }
        if (!isValidNumber(acceleration)) {
          return {
            ...waiting,
            warning: "Acceleration must be a number (m/s²).",
          };
        }
        const F = mass * acceleration; // Newtons (N)
        const displayVal =
          Math.abs(F) > 10000 || (Math.abs(F) < 0.001 && F !== 0)
            ? F.toExponential(4) + " N"
            : F.toFixed(4) + " N";
        return {
          value: displayVal,
          label: "Force (Newtons)",
          subtext: "Force calculated as F = m × a",
          warning: null,
          formulaUsed: "F = m × a",
        };
      }
      case "work": {
        // Work = force * displacement * cos(theta)
        if (!isValidNumber(force) || force < 0) {
          return {
            ...waiting,
            warning: "Force must be a non-negative number (N).",
          };
        }
        if (!isValidNumber(displacement) || displacement < 0) {
          return {
            ...waiting,
            warning: "Displacement must be a non-negative number (m).",
          };
        }
        if (!isValidNumber(angleDeg)) {
          return {
            ...waiting,
            warning: "Angle must be a number (degrees).",
          };
        }
        // Convert angle to radians
        const angleRad = (angleDeg * Math.PI) / 180;
        const W = force * displacement * Math.cos(angleRad); // Joules (J)
        const displayVal =
          Math.abs(W) > 10000 || (Math.abs(W) < 0.001 && W !== 0)
            ? W.toExponential(4) + " J"
            : W.toFixed(4) + " J";
        return {
          value: displayVal,
          label: "Work Done (Joules)",
          subtext:
            "Work calculated as W = F × d × cos(θ), θ in degrees",
          warning: null,
          formulaUsed: "W = F × d × cos(θ)",
        };
      }
      case "kineticEnergy": {
        // KE = 1/2 m v²
        if (!isValidNumber(mass) || mass <= 0) {
          return {
            ...waiting,
            warning: "Mass must be a positive number (kg).",
          };
        }
        if (!isValidNumber(velocity)) {
          return {
            ...waiting,
            warning: "Velocity must be a number (m/s).",
          };
        }
        const KE = 0.5 * mass * velocity * velocity; // Joules (J)
        const displayVal =
          KE > 10000 || (KE < 0.001 && KE !== 0)
            ? KE.toExponential(4) + " J"
            : KE.toFixed(4) + " J";
        return {
          value: displayVal,
          label: "Kinetic Energy (Joules)",
          subtext: "KE = 1/2 × m × v²",
          warning: null,
          formulaUsed: "Eₖ = 1/2 m v²",
        };
      }
      case "potentialEnergy": {
        // PE = m g h
        if (!isValidNumber(mass) || mass <= 0) {
          return {
            ...waiting,
            warning: "Mass must be a positive number (kg).",
          };
        }
        if (!isValidNumber(height)) {
          return {
            ...waiting,
            warning: "Height must be a number (m).",
          };
        }
        const PE = mass * g * height; // Joules (J)
        const displayVal =
          PE > 10000 || (PE < 0.001 && PE !== 0)
            ? PE.toExponential(4) + " J"
            : PE.toFixed(4) + " J";
        return {
          value: displayVal,
          label: "Potential Energy (Joules)",
          subtext: `PE = m × g × h, with g = ${g} m/s²`,
          warning: null,
          formulaUsed: "Eₚ = m g h",
        };
      }
      default:
        return waiting;
    }
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is the difference between work and energy?",
      answer:
        "Work is the process of energy transfer when a force moves an object over a distance. Energy is the capacity to do work. In physics, work done on an object results in a change in its energy, such as kinetic or potential energy. Understanding this distinction helps in analyzing mechanical systems and energy conservation.",
    },
    {
      question: "Why do we use cosine of the angle in work calculation?",
      answer:
        "The cosine of the angle between the force and displacement vectors determines the component of force that actually does work. If the force is in the same direction as displacement, cos(0°) = 1, so all force contributes. If perpendicular, cos(90°) = 0, so no work is done. This is essential for accurately calculating work in real-world scenarios.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Inputs UI depends on calculation type
  const renderInputs = () => {
    switch (inputs.calculationType) {
      case "force":
        return (
          <>
            <div>
              <Label htmlFor="mass">Mass (kg)</Label>
              <Input
                id="mass"
                type="number"
                min="0"
                step="any"
                value={inputs.mass}
                onChange={(e) => handleInputChange("mass", e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
            <div>
              <Label htmlFor="acceleration">Acceleration (m/s²)</Label>
              <Input
                id="acceleration"
                type="number"
                step="any"
                value={inputs.acceleration}
                onChange={(e) =>
                  handleInputChange("acceleration", e.target.value)
                }
                placeholder="e.g. 9.81"
              />
            </div>
          </>
        );
      case "work":
        return (
          <>
            <div>
              <Label htmlFor="force">Force (N)</Label>
              <Input
                id="force"
                type="number"
                min="0"
                step="any"
                value={inputs.force}
                onChange={(e) => handleInputChange("force", e.target.value)}
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <Label htmlFor="displacement">Displacement (m)</Label>
              <Input
                id="displacement"
                type="number"
                min="0"
                step="any"
                value={inputs.displacement}
                onChange={(e) =>
                  handleInputChange("displacement", e.target.value)
                }
                placeholder="e.g. 10"
              />
            </div>
            <div>
              <Label htmlFor="angle">Angle (degrees)</Label>
              <Input
                id="angle"
                type="number"
                step="any"
                value={inputs.angle}
                onChange={(e) => handleInputChange("angle", e.target.value)}
                placeholder="0"
              />
            </div>
          </>
        );
      case "kineticEnergy":
        return (
          <>
            <div>
              <Label htmlFor="mass">Mass (kg)</Label>
              <Input
                id="mass"
                type="number"
                min="0"
                step="any"
                value={inputs.mass}
                onChange={(e) => handleInputChange("mass", e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <Label htmlFor="velocity">Velocity (m/s)</Label>
              <Input
                id="velocity"
                type="number"
                step="any"
                value={inputs.velocity}
                onChange={(e) => handleInputChange("velocity", e.target.value)}
                placeholder="e.g. 12"
              />
            </div>
          </>
        );
      case "potentialEnergy":
        return (
          <>
            <div>
              <Label htmlFor="mass">Mass (kg)</Label>
              <Input
                id="mass"
                type="number"
                min="0"
                step="any"
                value={inputs.mass}
                onChange={(e) => handleInputChange("mass", e.target.value)}
                placeholder="e.g. 3"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (m)</Label>
              <Input
                id="height"
                type="number"
                step="any"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="e.g. 15"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // On Calculate button click: no special action needed, calculation is reactive

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="calculationType">Select Calculation</Label>
        <Select
          value={inputs.calculationType}
          onValueChange={(val) => setInputs((prev) => ({ ...prev, calculationType: val }))}
        >
          <SelectTrigger id="calculationType" className="w-full">
            <SelectValue placeholder="Choose calculation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="force">
              <Scale className="mr-2 inline h-4 w-4" /> Force (F = m × a)
            </SelectItem>
            <SelectItem value="work">
              <Zap className="mr-2 inline h-4 w-4" /> Work (W = F × d × cos(θ))
            </SelectItem>
            <SelectItem value="kineticEnergy">
              <Atom className="mr-2 inline h-4 w-4" /> Kinetic Energy (Eₖ = 1/2 m v²)
            </SelectItem>
            <SelectItem value="potentialEnergy">
              <Zap className="mr-2 inline h-4 w-4" /> Potential Energy (Eₚ = m g h)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic Inputs */}
      {renderInputs()}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation reactive
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
              force: "",
              displacement: "",
              angle: "0",
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
          This calculator helps you compute fundamental physics quantities: force,
          work done by a force, kinetic energy, and potential energy. These concepts
          are foundational in mechanics, describing how objects move and interact.
          Force quantifies the push or pull on an object, work measures energy transfer
          via force over distance, kinetic energy relates to motion, and potential energy
          relates to position in a gravitational field.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding these quantities is essential in engineering, physics research,
          and everyday applications like vehicle dynamics, construction, and energy
          management. The calculator ensures correct unit usage and angle considerations,
          providing accurate and educational results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Always input mass in kilograms, distances in meters, forces in Newtons, and
          angles in degrees. This tool is ideal for students, educators, and professionals
          seeking quick and reliable physics calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
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
  F = Force applied (Newtons, N)
  d = Displacement (meters, m)
  θ = Angle between force and displacement (degrees)

Kinetic Energy:
Eₖ = 1/2 × m × v²
where
  Eₖ = Kinetic Energy (Joules, J)
  m = Mass (kilograms, kg)
  v = Velocity (meters per second, m/s)

Potential Energy:
Eₚ = m × g × h
where
  Eₚ = Potential Energy (Joules, J)
  m = Mass (kilograms, kg)
  g = Gravitational acceleration (9.81 m/s²)
  h = Height above reference point (meters, m)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem: Calculate the work done by a force of 100 N
          pushing a box 5 meters across the floor at an angle of 30° to the horizontal.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Force F = 100 N, displacement d = 5 m, angle θ = 30°
          </li>
          <li>
            <strong>Step 1:</strong> Convert angle to radians if needed (calculator does this internally).
          </li>
          <li>
            <strong>Step 2:</strong> Calculate work: W = F × d × cos(θ) = 100 × 5 × cos(30°) ≈ 433.013 J
          </li>
          <li>
            <strong>Result:</strong> The work done on the box is approximately 433.013 Joules.
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
          { symbol: "θ", description: "Angle between force and displacement in degrees" },
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
          "Calculate the work done by a force of 100 N pushing a box 5 meters at an angle of 30°.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify given values: Force = 100 N, Displacement = 5 m, Angle = 30°.",
          },
          {
            label: "2",
            explanation:
              "Apply formula: W = F × d × cos(θ). Calculate cos(30°) ≈ 0.866.",
          },
          {
            label: "3",
            explanation:
              "Calculate work: 100 × 5 × 0.866 = 433.013 Joules.",
          },
        ],
        result: "Work done is approximately 433.013 Joules.",
      }}
      relatedCalculators={[
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
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