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

export default function EscapeVelocityCalculator() {
  const [inputs, setInputs] = useState({
    mass: "",
    radius: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const G = 6.67430e-11; // gravitational constant, m^3 kg^-1 s^-2
    const mass = parseFloat(inputs.mass);
    const radius = parseFloat(inputs.radius);

    if (isNaN(mass) || isNaN(radius) || mass <= 0 || radius <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    // Escape velocity formula: v = sqrt(2GM/r)
    const escapeVelocity = Math.sqrt((2 * G * mass) / radius); // in m/s

    // Format in scientific notation with 4 decimals
    const value = escapeVelocity.toExponential(4) + " m/s";

    // Provide a warning if radius is unrealistically small or mass is too small
    let warning = null;
    if (radius < 1) {
      warning = "Radius is very small; ensure units are in meters.";
    } else if (mass < 1) {
      warning = "Mass is very small; ensure units are in kilograms.";
    }

    return {
      value,
      label: "Escape Velocity",
      subtext: "Speed needed to break free from gravitational pull",
      warning,
      formulaUsed: "v = √(2GM / r)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is escape velocity?",
      answer:
        "Escape velocity is the minimum speed an object needs to escape the gravitational pull of a planet or moon without further propulsion. It depends on the mass and radius of the celestial body. If an object reaches this speed, it can move away indefinitely without falling back.",
    },
    {
      question: "Why does escape velocity depend on mass and radius?",
      answer:
        "Escape velocity depends on the gravitational pull, which is stronger for more massive bodies and weaker farther from the center. The formula v = √(2GM / r) shows that velocity increases with mass (M) and decreases with radius (r). This relationship ensures that heavier or more compact bodies require higher speeds to escape.",
    },
    {
      question: "Can escape velocity be achieved on Earth?",
      answer:
        "Yes, but it requires extremely high speeds (about 11.2 km/s for Earth). Rockets achieve this velocity to leave Earth’s atmosphere and enter space. Achieving escape velocity means overcoming Earth's gravity without additional propulsion.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="mass" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-5 h-5 text-blue-600" />
            Mass (M) in kilograms (kg)
          </Label>
          <Input
            id="mass"
            type="text"
            placeholder="e.g. 5.972e24"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
            aria-describedby="mass-desc"
          />
          <p id="mass-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mass of the celestial body (e.g., Earth ≈ 5.972 × 10<sup>24</sup> kg)
          </p>
        </div>
        <div>
          <Label htmlFor="radius" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-5 h-5 text-blue-600" />
            Radius (r) in meters (m)
          </Label>
          <Input
            id="radius"
            type="text"
            placeholder="e.g. 6.371e6"
            value={inputs.radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            aria-describedby="radius-desc"
          />
          <p id="radius-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Radius from the center of mass to surface (e.g., Earth ≈ 6.371 × 10<sup>6</sup> m)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is automatic on input change
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Escape Velocity Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Escape velocity is the minimum speed an object must reach to break free from the gravitational pull of a celestial body,
          such as a planet or moon, without further propulsion. It is crucial in space exploration and astrophysics to determine the
          energy required for spacecraft to leave a planet's surface and enter orbit or travel to other celestial bodies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The escape velocity depends on two main factors: the mass (M) of the celestial body and the radius (r) from its center to the
          point of escape. Larger mass increases gravitational pull, requiring higher velocity, while a larger radius reduces the needed speed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to input the mass and radius of any celestial body to compute the escape velocity in meters per second (m/s).
          Understanding this concept helps in grasping fundamental principles of gravity, orbital mechanics, and energy conservation.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`v = √(2GM / r)

Where:
  v = escape velocity (m/s)
  G = gravitational constant = 6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²
  M = mass of the celestial body (kg)
  r = radius from the center of mass to the surface (m)

The formula calculates the minimum speed needed to overcome the gravitational attraction without further propulsion.`}
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
      title="Escape Velocity Calculator"
      description="Calculate Escape Velocity. Determine the speed needed to break free from the gravitational pull of a planet or moon."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "v = √(2GM / r)",
        variables: [
          { symbol: "v", description: "Escape velocity in meters per second (m/s)" },
          { symbol: "G", description: "Gravitational constant (6.67430 × 10⁻¹¹ m³·kg⁻¹·s⁻²)" },
          { symbol: "M", description: "Mass of the celestial body in kilograms (kg)" },
          { symbol: "r", description: "Radius from center to surface in meters (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the escape velocity for Earth, which has a mass of approximately 5.972 × 10²⁴ kg and a radius of about 6.371 × 10⁶ meters.",
        steps: [
          {
            label: "1",
            explanation:
              "Input the mass (5.972e24 kg) and radius (6.371e6 m) of Earth into the calculator.",
          },
          {
            label: "2",
            explanation:
              "The calculator applies the formula v = √(2GM / r) to compute the escape velocity.",
          },
          {
            label: "3",
            explanation:
              "The result shows approximately 1.118e4 m/s (11.18 km/s), which is the speed needed to escape Earth's gravity.",
          },
        ],
        result: "Escape velocity ≈ 1.118 × 10⁴ m/s (11.18 km/s)",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Half-Life / Exponential Decay Calculator", url: "/science/half-life-exponential-decay", icon: "⚛️" },
        { title: "Molar Mass Calculator", url: "/science/molar-mass-calculator", icon: "🧪" },
        { title: "Blackbody Peak (Wien's Law) Estimator", url: "/science/blackbody-peak-wien-law-estimator", icon: "🧪" },
        { title: "Free-Fall Time/Velocity Estimator", url: "/science/free-fall-time-velocity-estimator", icon: "🧪" },
        { title: "Momentum & Impulse Calculator", url: "/science/momentum-impulse-calculator", icon: "🧪" },
        { title: "Force, Work & Energy Calculator", url: "/science/force-work-energy-calculator", icon: "🚀" },
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