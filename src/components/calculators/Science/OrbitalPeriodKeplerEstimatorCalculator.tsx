import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Orbit, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function OrbitalPeriodKeplerEstimatorCalculator() {
  // Inputs: 
  // M = Mass of central body (kg)
  // a = Semi-major axis (orbital radius for circular orbit) (m)
  // Select central body for convenience (optional)
  // Constants: G = 6.67430e-11 m³/kg/s² (gravitational constant)

  const [inputs, setInputs] = useState({
    mass: "", // in kg
    radius: "", // in meters
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Constants
  const G = 6.67430e-11; // m³/kg/s² gravitational constant

  // Calculation of orbital period T using Kepler's third law:
  // T = 2π * sqrt(a³ / (G * M))
  // T in seconds, a in meters, M in kg

  const results = useMemo(() => {
    const massNum = parseFloat(inputs.mass);
    const radiusNum = parseFloat(inputs.radius);

    // Validation
    if (!inputs.mass || !inputs.radius) {
      return {
        value: "Waiting...",
        label: "Enter mass and orbital radius",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (isNaN(massNum) || isNaN(radiusNum)) {
      return {
        value: "Invalid input",
        label: "Mass and radius must be numbers",
        subtext: "",
        warning: "Please enter valid numerical values for mass and radius.",
        formulaUsed: null,
      };
    }
    if (massNum <= 0 || radiusNum <= 0) {
      return {
        value: "Invalid input",
        label: "Mass and radius must be positive",
        subtext: "",
        warning: "Mass and orbital radius must be greater than zero.",
        formulaUsed: null,
      };
    }

    // Calculate orbital period in seconds
    // T = 2π * sqrt(a³ / (G * M))
    const numerator = Math.pow(radiusNum, 3);
    const denominator = G * massNum;
    const periodSeconds = 2 * Math.PI * Math.sqrt(numerator / denominator);

    // Format output:
    // If period < 60 seconds, show seconds
    // else if < 3600 seconds, show minutes
    // else if < 86400 seconds, show hours
    // else show days or years

    let displayVal = "";
    let label = "";
    if (periodSeconds < 60) {
      displayVal = periodSeconds.toFixed(4);
      label = "Seconds";
    } else if (periodSeconds < 3600) {
      displayVal = (periodSeconds / 60).toFixed(4);
      label = "Minutes";
    } else if (periodSeconds < 86400) {
      displayVal = (periodSeconds / 3600).toFixed(4);
      label = "Hours";
    } else if (periodSeconds < 3.154e7) {
      // less than a year
      displayVal = (periodSeconds / 86400).toFixed(4);
      label = "Days";
    } else {
      // years
      const years = periodSeconds / 3.154e7;
      displayVal = years > 10000 || years < 0.001 ? years.toExponential(4) : years.toFixed(4);
      label = "Years";
    }

    return {
      value: `${displayVal} ${label}`,
      label: "Orbital Period",
      subtext: `Calculated using Kepler's Third Law with G = 6.67430×10⁻¹¹ m³/kg/s²`,
      warning: null,
      formulaUsed: "T = 2π × √(a³ / GM)",
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is Kepler's Third Law and why is it important?",
      answer:
        "Kepler's Third Law states that the square of the orbital period of a planet is proportional to the cube of the semi-major axis of its orbit. This law is fundamental in astronomy and physics because it allows us to calculate the time it takes for an object to orbit another based on their distance and mass. It is essential for understanding planetary motion and satellite trajectories.",
    },
    {
      question: "Why do we use the gravitational constant G in the formula?",
      answer:
        "The gravitational constant G quantifies the strength of gravity in Newton's law of universal gravitation. It is necessary in Kepler's Third Law when derived from Newtonian mechanics to relate the mass of the central body and the orbital radius to the orbital period. Without G, the formula would not correctly predict orbital times.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="mass" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Orbit className="w-5 h-5 text-blue-600" /> Mass of Central Body (M) in kilograms (kg)
          </Label>
          <Input
            id="mass"
            type="text"
            placeholder="e.g. 1.989e30 (Sun's mass)"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
            aria-describedby="mass-desc"
          />
          <p id="mass-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the mass of the central body around which the object orbits.
          </p>
        </div>

        <div>
          <Label htmlFor="radius" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Orbit className="w-5 h-5 text-blue-600" /> Orbital Radius (a) in meters (m)
          </Label>
          <Input
            id="radius"
            type="text"
            placeholder="e.g. 1.496e11 (Earth-Sun distance)"
            value={inputs.radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            aria-describedby="radius-desc"
          />
          <p id="radius-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the semi-major axis or orbital radius (for circular orbits).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger recalculation by setting state (already done on input change)
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate orbital period"
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
              <strong>Science Fact:</strong> Orbital period calculations are crucial for satellite deployment, space missions, and understanding planetary systems.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Orbital Period (Kepler) Estimator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Kepler's Third Law relates the orbital period of a planet or satellite to its distance from the central body it orbits. Specifically, the square of the orbital period (T) is proportional to the cube of the semi-major axis (a) of its orbit. This relationship allows scientists and engineers to predict how long an object will take to complete one full orbit based on its distance and the mass of the central body.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This principle is fundamental in astrophysics, satellite communications, and space exploration. For example, it helps determine satellite launch parameters, plan interplanetary missions, and understand the dynamics of planetary systems. By inputting the mass of the central body and the orbital radius, this tool estimates the orbital period accurately.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that the orbital radius here assumes a circular orbit for simplicity. For elliptical orbits, the semi-major axis is used. Understanding these concepts is essential for anyone working in astronomy, aerospace engineering, or physics.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`T = 2π × √(a³ / GM)

Where:
  T = Orbital period (seconds)
  a = Semi-major axis / orbital radius (meters)
  G = Gravitational constant = 6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²
  M = Mass of the central body (kilograms)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem: Calculate the orbital period of Earth around the Sun.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Mass of Sun, M = 1.989 × 10³⁰ kg; Orbital radius (Earth-Sun distance), a = 1.496 × 10¹¹ m.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate a³ = (1.496 × 10¹¹)³ = 3.35 × 10³³ m³.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate GM = 6.67430 × 10⁻¹¹ × 1.989 × 10³⁰ = 1.327 × 10²⁰ m³/s².
          </li>
          <li>
            <strong>Step 3:</strong> Compute √(a³ / GM) = √(3.35 × 10³³ / 1.327 × 10²⁰) = √(2.525 × 10¹³) ≈ 5.025 × 10⁶ s.
          </li>
          <li>
            <strong>Step 4:</strong> Multiply by 2π: T = 2π × 5.025 × 10⁶ ≈ 3.16 × 10⁷ seconds.
          </li>
          <li>
            <strong>Result:</strong> T ≈ 3.16 × 10⁷ seconds ≈ 1 year, which matches Earth's orbital period.
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
      title="Orbital Period (Kepler) Estimator"
      description="Estimate Orbital Period using Kepler's Laws. Calculate the time it takes for a planet or satellite to orbit a massive body."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "T = 2π × √(a³ / GM)",
        variables: [
          { symbol: "T", description: "Orbital period (seconds)" },
          { symbol: "a", description: "Semi-major axis or orbital radius (meters)" },
          { symbol: "G", description: "Gravitational constant = 6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²" },
          { symbol: "M", description: "Mass of the central body (kilograms)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate Earth's orbital period around the Sun.",
        steps: [
          { label: "1", explanation: "Given M = 1.989 × 10³⁰ kg, a = 1.496 × 10¹¹ m." },
          { label: "2", explanation: "Calculate a³ and GM." },
          { label: "3", explanation: "Compute T = 2π × √(a³ / GM)." },
          { label: "4", explanation: "Result: T ≈ 3.16 × 10⁷ seconds ≈ 1 year." },
        ],
        result: "Orbital period T ≈ 1 year (Earth's orbital period).",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
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