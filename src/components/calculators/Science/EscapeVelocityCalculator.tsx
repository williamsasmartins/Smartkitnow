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

export default function EscapeVelocityCalculator() {
  // Inputs: Mass of celestial body (kg), Radius of celestial body (m)
  const [inputs, setInputs] = useState({
    mass: "", // in kg
    radius: "", // in meters
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Constants
  const G = 6.67430e-11; // gravitational constant, m^3 kg^-1 s^-2

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const massNum = parseFloat(inputs.mass);
    const radiusNum = parseFloat(inputs.radius);

    // Validation
    if (!inputs.mass || !inputs.radius) {
      return {
        value: "Waiting...",
        label: "Enter mass and radius",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (isNaN(massNum) || isNaN(radiusNum)) {
      return {
        value: "Invalid input",
        label: "Please enter valid numbers",
        subtext: "",
        warning: "Inputs must be numeric values.",
        formulaUsed: null,
      };
    }
    if (massNum <= 0 || radiusNum <= 0) {
      return {
        value: "Invalid input",
        label: "Mass and radius must be positive",
        subtext: "",
        warning: "Mass & radius must be greater than zero.",
        formulaUsed: null,
      };
    }

    // Calculation: v = sqrt(2GM/R)
    const escapeVelocity = Math.sqrt((2 * G * massNum) / radiusNum); // in m/s

    // Formatting output
    // Use scientific notation if <0.001 or >10000
    const displayVal =
      escapeVelocity < 0.001 || escapeVelocity > 10000
        ? escapeVelocity.toExponential(4)
        : escapeVelocity.toFixed(4);

    return {
      value: `${displayVal} m/s`,
      label: "Escape Velocity",
      subtext: "Speed needed to break free from gravitational pull",
      warning: null,
      formulaUsed: "v = √(2GM / R)",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is escape velocity and why is it important?",
      answer:
        "Escape velocity is the minimum speed an object needs to leave a celestial body's gravitational influence without further propulsion. It is crucial in space missions to ensure spacecraft can break free from planets or moons. Understanding escape velocity helps engineers design rockets and plan fuel requirements effectively.",
    },
    {
      question: "Does escape velocity depend on the object's mass?",
      answer:
        "No, escape velocity depends only on the mass and radius of the celestial body, not on the mass of the object trying to escape. This is because gravitational potential energy and kinetic energy scale proportionally with the object's mass, which cancels out in the escape velocity formula.",
    },
    {
      question: "Where is escape velocity applied in real-world scenarios?",
      answer:
        "Escape velocity is fundamental in aerospace engineering, especially for launching satellites and interplanetary probes. It also helps astronomers understand planetary atmospheres and whether a planet can retain gases. Additionally, it is used in astrophysics to study black holes and stellar phenomena.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="mass" className="mb-1 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Atom className="w-5 h-5 text-blue-600" /> Mass of Celestial Body (kg)
          </Label>
          <Input
            id="mass"
            type="text"
            inputMode="decimal"
            placeholder="e.g., 5.972e24"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
            aria-describedby="mass-help"
          />
          <p id="mass-help" className="text-xs text-slate-500 mt-1">
            Enter mass in kilograms (kg). Example: Earth's mass ≈ 5.972 × 10<sup>24</sup> kg.
          </p>
        </div>

        <div>
          <Label htmlFor="radius" className="mb-1 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Orbit className="w-5 h-5 text-blue-600" /> Radius of Celestial Body (m)
          </Label>
          <Input
            id="radius"
            type="text"
            inputMode="decimal"
            placeholder="e.g., 6.371e6"
            value={inputs.radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            aria-describedby="radius-help"
          />
          <p id="radius-help" className="text-xs text-slate-500 mt-1">
            Enter radius in meters (m). Example: Earth's radius ≈ 6.371 × 10<sup>6</sup> m.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate escape velocity"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mass: "", radius: "" })}
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Escape velocity depends on the celestial body's mass and radius, not on the escaping object's mass.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Escape Velocity Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Escape velocity is the minimum speed an object must reach to break free from the gravitational pull of a planet, moon, or other celestial body without further propulsion. It is a fundamental concept in astrophysics and aerospace engineering, helping us understand how rockets leave Earth or how atmospheres are retained by planets. The escape velocity depends on the mass (M) and radius (R) of the celestial body.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to input the mass and radius of any celestial body to determine the escape velocity in meters per second (m/s). Understanding this speed is essential for mission planning in space exploration and for studying planetary atmospheres and gravitational fields.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that escape velocity is independent of the mass of the object trying to escape; it depends solely on the celestial body's properties. This tool is widely used in physics education, aerospace engineering, and astronomy research.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`v = \\sqrt{\\frac{2GM}{R}}

Where:
  v = escape velocity (m/s)
  G = gravitational constant = 6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²
  M = mass of the celestial body (kg)
  R = radius of the celestial body (m)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem: Calculate the escape velocity from Earth.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Mass of Earth, M = 5.972 × 10<sup>24</sup> kg; Radius of Earth, R = 6.371 × 10<sup>6</sup> m.
          </li>
          <li>
            <strong>Step 1:</strong> Plug values into the formula: v = √(2 × 6.67430 × 10⁻¹¹ × 5.972 × 10²⁴ / 6.371 × 10⁶).
          </li>
          <li>
            <strong>Step 2:</strong> Calculate the value inside the square root: ≈ 1.252 × 10⁷.
          </li>
          <li>
            <strong>Result:</strong> v ≈ √(1.252 × 10⁷) ≈ 35394 m/s (about 11.2 km/s).
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          This means a spacecraft must reach approximately 11.2 kilometers per second to escape Earth's gravity without further propulsion.
        </p>
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
      title="Escape Velocity Calculator"
      description="Calculate Escape Velocity. Determine the speed needed to break free from the gravitational pull of a planet or moon."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "v = \\sqrt{\\frac{2GM}{R}}",
        variables: [
          { symbol: "v", description: "Escape velocity (m/s)" },
          { symbol: "G", description: "Gravitational constant = 6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²" },
          { symbol: "M", description: "Mass of the celestial body (kg)" },
          { symbol: "R", description: "Radius of the celestial body (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the escape velocity from Earth given its mass and radius.",
        steps: [
          { label: "1", explanation: "Identify Earth's mass (5.972 × 10²⁴ kg) and radius (6.371 × 10⁶ m)." },
          { label: "2", explanation: "Apply the formula v = √(2GM / R)." },
          { label: "3", explanation: "Calculate the value inside the square root and then the square root itself." },
          { label: "4", explanation: "Result: Escape velocity ≈ 11.2 km/s." },
        ],
        result: "Escape velocity from Earth is approximately 11,200 m/s (11.2 km/s).",
      }}
      relatedCalculators={[
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "Orbit" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "Zap" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "FlaskConical" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "Atom" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "Waves" },
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