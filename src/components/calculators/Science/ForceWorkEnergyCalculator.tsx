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

const G = 9.81; // m/s² gravitational acceleration constant

export default function ForceWorkEnergyCalculator() {
  // Inputs: calculationType, mass (kg), acceleration (m/s²), distance (m), force (N), velocity (m/s), height (m)
  const [inputs, setInputs] = useState({
    calculationType: "force", // "force" | "work" | "kineticEnergy" | "potentialEnergy"
    mass: "",
    acceleration: "",
    distance: "",
    force: "",
    velocity: "",
    height: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Helper to parse float safely
  const parseInput = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  };

  const results = useMemo(() => {
    const calcType = inputs.calculationType;

    // Parse inputs
    const m = parseInput(inputs.mass);
    const a = parseInput(inputs.acceleration);
    const d = parseInput(inputs.distance);
    const F = parseInput(inputs.force);
    const v = parseInput(inputs.velocity);
    const h = parseInput(inputs.height);

    let value = null;
    let label = "";
    let subtext = "";
    let warning = null;
    let formulaUsed = "";

    // Validation helper
    const isPositive = (x) => x !== null && x >= 0;
    const isNonZeroPositive = (x) => x !== null && x > 0;

    switch (calcType) {
      case "force":
        // Force = mass * acceleration
        if (m === null || a === null) {
          warning = "Please enter valid mass and acceleration values.";
          break;
        }
        value = m * a;
        label = "Force (Newtons)";
        formulaUsed = "F = m × a";
        subtext = "Force calculated using Newton's Second Law";
        break;

      case "work":
        // Work = force * distance * cos(θ)
        // Here θ assumed 0° (force and displacement in same direction)
        // So Work = force * distance
        if (F === null || d === null) {
          warning = "Please enter valid force and distance values.";
          break;
        }
        value = F * d;
        label = "Work (Joules)";
        formulaUsed = "W = F × d";
        subtext = "Work done by force over distance (θ = 0°)";
        break;

      case "kineticEnergy":
        // KE = 0.5 * mass * velocity²
        if (m === null || v === null) {
          warning = "Please enter valid mass and velocity values.";
          break;
        }
        value = 0.5 * m * v * v;
        label = "Kinetic Energy (Joules)";
        formulaUsed = "KE = ½ × m × v²";
        subtext = "Energy of motion";
        break;

      case "potentialEnergy":
        // PE = mass * g * height
        if (m === null || h === null) {
          warning = "Please enter valid mass and height values.";
          break;
        }
        value = m * G * h;
        label = "Potential Energy (Joules)";
        formulaUsed = "PE = m × g × h";
        subtext = `Gravitational potential energy (g = ${G} m/s²)`;
        break;

      default:
        warning = "Please select a calculation type.";
    }

    // Format value with units and scientific notation if needed
    if (value !== null) {
      if (Math.abs(value) < 1e-4 || Math.abs(value) >= 1e6) {
        value = value.toExponential(4) + " J";
      } else {
        // For force, unit is N, for work and energies unit is J
        if (calcType === "force") {
          value = value.toFixed(4) + " N";
        } else {
          value = value.toFixed(4) + " J";
        }
      }
    } else {
      value = 0;
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between work and energy?",
      answer:
        "Work is the process of energy transfer when a force moves an object over a distance. Energy is the capacity to do work. While work refers to the action, energy is the stored or transferred quantity. For example, kinetic energy is the energy of motion, and work done on an object can increase its kinetic energy.",
    },
    {
      question: "Why do we use 9.81 m/s² for gravitational acceleration?",
      answer:
        "The constant 9.81 m/s² represents the average acceleration due to Earth's gravity at sea level. It is a precise value used in physics calculations involving gravitational force and potential energy near the Earth's surface. This value can vary slightly depending on location and altitude.",
    },
    {
      question: "Can work be negative, and what does it mean?",
      answer:
        "Yes, work can be negative if the force applied opposes the direction of displacement. Negative work means energy is taken out of the system, such as friction slowing down a moving object. It indicates that the force is removing energy from the object rather than adding to it.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Calculation Type Selector */}
      <div>
        <Label htmlFor="calculationType" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
          Select Calculation Type
        </Label>
        <Select
          id="calculationType"
          value={inputs.calculationType}
          onValueChange={(val) => handleInputChange("calculationType", val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select calculation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="force">
              <Scale className="mr-2 inline h-4 w-4 align-text-bottom" /> Force (F = m × a)
            </SelectItem>
            <SelectItem value="work">
              <Zap className="mr-2 inline h-4 w-4 align-text-bottom" /> Work (W = F × d)
            </SelectItem>
            <SelectItem value="kineticEnergy">
              <Waves className="mr-2 inline h-4 w-4 align-text-bottom" /> Kinetic Energy (KE = ½ m v²)
            </SelectItem>
            <SelectItem value="potentialEnergy">
              <Orbit className="mr-2 inline h-4 w-4 align-text-bottom" /> Potential Energy (PE = m g h)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs based on calculation type */}
      {inputs.calculationType === "force" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Mass (kg)
            </Label>
            <Input
              id="mass"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 10"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="acceleration" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Acceleration (m/s²)
            </Label>
            <Input
              id="acceleration"
              type="number"
              step="any"
              placeholder="e.g. 9.81"
              value={inputs.acceleration}
              onChange={(e) => handleInputChange("acceleration", e.target.value)}
            />
          </div>
        </>
      )}

      {inputs.calculationType === "work" && (
        <>
          <div>
            <Label htmlFor="force" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Force (Newtons, N)
            </Label>
            <Input
              id="force"
              type="number"
              step="any"
              placeholder="e.g. 50"
              value={inputs.force}
              onChange={(e) => handleInputChange("force", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="distance" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Distance (meters, m)
            </Label>
            <Input
              id="distance"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 10"
              value={inputs.distance}
              onChange={(e) => handleInputChange("distance", e.target.value)}
            />
          </div>
        </>
      )}

      {inputs.calculationType === "kineticEnergy" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Mass (kg)
            </Label>
            <Input
              id="mass"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 5"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="velocity" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Velocity (m/s)
            </Label>
            <Input
              id="velocity"
              type="number"
              step="any"
              placeholder="e.g. 12"
              value={inputs.velocity}
              onChange={(e) => handleInputChange("velocity", e.target.value)}
            />
          </div>
        </>
      )}

      {inputs.calculationType === "potentialEnergy" && (
        <>
          <div>
            <Label htmlFor="mass" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Mass (kg)
            </Label>
            <Input
              id="mass"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 3"
              value={inputs.mass}
              onChange={(e) => handleInputChange("mass", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="height" className="mb-1 inline-block font-semibold text-slate-700 dark:text-slate-300">
              Height (meters, m)
            </Label>
            <Input
              id="height"
              type="number"
              step="any"
              placeholder="e.g. 15"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation by updating state with same values
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate"
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
              distance: "",
              force: "",
              velocity: "",
              height: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Force, Work &amp; Energy Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to help students and enthusiasts explore fundamental physics concepts related to force, work, and energy. Force is the interaction that causes an object to accelerate, work is the energy transferred by a force acting over a distance, and energy is the capacity to perform work. Understanding these concepts is essential for solving many real-world physics problems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The tool supports calculations for force using Newton's second law, work done by a force, kinetic energy of moving objects, and gravitational potential energy. By inputting relevant parameters such as mass, acceleration, velocity, distance, or height, users can obtain precise results with clear units and scientific notation when appropriate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator also emphasizes correct scientific notation and unit display to promote accurate and educational usage. Whether you are a student preparing for exams or a science educator, this tool provides a reliable and easy-to-use interface for physics calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`// Force (Newton's Second Law)
F = m × a
where:
  F = Force (Newtons, N)
  m = Mass (kilograms, kg)
  a = Acceleration (meters per second squared, m/s²)

// Work done by a force
W = F × d
where:
  W = Work (Joules, J)
  F = Force (Newtons, N)
  d = Distance moved in the direction of force (meters, m)

// Kinetic Energy
KE = ½ × m × v²
where:
  KE = Kinetic Energy (Joules, J)
  m = Mass (kilograms, kg)
  v = Velocity (meters per second, m/s)

// Potential Energy (Gravitational)
PE = m × g × h
where:
  PE = Potential Energy (Joules, J)
  m = Mass (kilograms, kg)
  g = Gravitational acceleration (9.81 m/s²)
  h = Height above reference point (meters, m)
`}
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Work%20and%20Energy%20Physics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Work and Energy Physics - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Work and Energy Physics, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Work%20and%20Energy%20Physics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Work and Energy Physics - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Work and Energy Physics at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://www.physicsclassroom.com/search?q=Work%20and%20Energy%20Physics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Work and Energy Physics - The Physics Classroom
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Explore student-friendly tutorials, interactives, and concept builders related to Work and Energy Physics designed to improve understanding of physics principles.
            </p>
          </li>
          <li>
            <a href="http://hyperphysics.phy-astr.gsu.edu/hbase/hph.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Work and Energy Physics - HyperPhysics
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Navigate the HyperPhysics concept map to find concise summaries and calculation examples for Work and Energy Physics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Force, Work &amp; Energy Calculator"
      description="Calculate Force, Work, and Energy. Solve physics problems involving Newton's laws, kinetic energy, and potential energy."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `F = m × a\nW = F × d\nKE = ½ × m × v²\nPE = m × g × h`,
        variables: [
          { symbol: "F", description: "Force (Newtons, N)" },
          { symbol: "m", description: "Mass (kilograms, kg)" },
          { symbol: "a", description: "Acceleration (meters per second squared, m/s²)" },
          { symbol: "W", description: "Work (Joules, J)" },
          { symbol: "d", description: "Distance (meters, m)" },
          { symbol: "KE", description: "Kinetic Energy (Joules, J)" },
          { symbol: "v", description: "Velocity (meters per second, m/s)" },
          { symbol: "PE", description: "Potential Energy (Joules, J)" },
          { symbol: "g", description: "Gravitational acceleration (9.81 m/s²)" },
          { symbol: "h", description: "Height (meters, m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the kinetic energy of a 2 kg object moving at 3 m/s.",
        steps: [
          { label: "1", explanation: "Identify the formula: KE = ½ × m × v²" },
          { label: "2", explanation: "Substitute values: KE = 0.5 × 2 × 3²" },
          { label: "3", explanation: "Calculate: KE = 0.5 × 2 × 9 = 9 Joules" },
        ],
        result: "The kinetic energy is 9 Joules.",
      }}
      relatedCalculators={[
        { title: "Momentum & Impulse Calculator", url: "/science/momentum-impulse-calculator", icon: "🧪" },
        { title: "Wave Speed / Frequency / Wavelength", url: "/science/wave-speed-frequency-wavelength", icon: "🚀" },
        { title: "Molarity / Moles / Volume Calculator", url: "/science/molarity-moles-volume", icon: "🧪" },
        { title: "Escape Velocity Calculator", url: "/science/escape-velocity-calculator", icon: "🧪" },
        { title: "Kinematics Equations Solver (SUVAT)", url: "/science/kinematics-suvat-solver", icon: "🚀" },
        { title: "Uniform Circular Motion Calculator", url: "/science/uniform-circular-motion-centripetal", icon: "🚀" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References & Resources" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}