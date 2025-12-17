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

export default function UniformCircularMotionCentripetalCalculator() {
  // Inputs: mass (kg), radius (m), velocity (m/s)
  // Calculate centripetal force (F = m*v²/r), centripetal acceleration (a = v²/r), period (T = 2πr/v), angular velocity (ω = v/r)
  // User can input any two of the three: velocity, period, angular velocity, but to keep simple, we ask for mass, radius, velocity.
  // We'll validate inputs > 0.

  const [inputs, setInputs] = useState({
    mass: "", // kg
    radius: "", // m
    velocity: "", // m/s
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const mass = parseFloat(inputs.mass);
    const radius = parseFloat(inputs.radius);
    const velocity = parseFloat(inputs.velocity);

    // Validation
    if (
      isNaN(mass) ||
      isNaN(radius) ||
      isNaN(velocity) ||
      mass <= 0 ||
      radius <= 0 ||
      velocity <= 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter positive values for mass, radius, and velocity",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Constants
    // None needed here

    // Calculations
    // Centripetal Force: F = m * v² / r (N)
    const centripetalForce = (mass * velocity * velocity) / radius;

    // Centripetal Acceleration: a = v² / r (m/s²)
    const centripetalAcceleration = (velocity * velocity) / radius;

    // Period: T = 2πr / v (s)
    const period = (2 * Math.PI * radius) / velocity;

    // Angular Velocity: ω = v / r (rad/s)
    const angularVelocity = velocity / radius;

    // Formatting helper
    function formatValue(val: number, unit: string) {
      if (val === 0) return `0 ${unit}`;
      if (Math.abs(val) >= 10000 || Math.abs(val) < 0.001) {
        return `${val.toExponential(4)} ${unit}`;
      }
      return `${val.toFixed(4)} ${unit}`;
    }

    return {
      value: (
        <>
          <p>
            <strong>Centripetal Force:</strong>{" "}
            {formatValue(centripetalForce, "N")}
          </p>
          <p>
            <strong>Centripetal Acceleration:</strong>{" "}
            {formatValue(centripetalAcceleration, "m/s²")}
          </p>
          <p>
            <strong>Period:</strong> {formatValue(period, "s")}
          </p>
          <p>
            <strong>Angular Velocity:</strong>{" "}
            {formatValue(angularVelocity, "rad/s")}
          </p>
        </>
      ),
      label: "Results for Uniform Circular Motion",
      subtext:
        "Inputs: mass (kg), radius (m), velocity (m/s). Outputs: force (N), acceleration (m/s²), period (s), angular velocity (rad/s).",
      warning: null,
      formulaUsed:
        "F = m × v² / r, a = v² / r, T = 2πr / v, ω = v / r",
    };
  }, [inputs.mass, inputs.radius, inputs.velocity]);

  const faqs = [
    {
      question: "What is uniform circular motion?",
      answer:
        "Uniform circular motion describes the movement of an object traveling at a constant speed along a circular path. Despite the constant speed, the object's velocity vector continuously changes direction, resulting in acceleration towards the center of the circle called centripetal acceleration. This concept is fundamental in physics and engineering for analyzing rotational systems.",
    },
    {
      question: "Where is uniform circular motion applied in real life?",
      answer:
        "Uniform circular motion principles are applied in many real-world scenarios such as designing roller coasters, calculating the forces on satellites orbiting planets, and engineering rotating machinery like turbines and centrifuges. Understanding these forces ensures safety, efficiency, and functionality in mechanical and aerospace engineering.",
    },
    {
      question: "Why is centripetal force necessary?",
      answer:
        "Centripetal force is the inward force required to keep an object moving in a circular path. Without this force, the object would move off in a straight line due to inertia. This force can be provided by tension, gravity, friction, or other forces depending on the system, and is essential for maintaining circular motion.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="mass" className="mb-1 font-semibold">
            Mass (kg)
          </Label>
          <Input
            id="mass"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 5"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
            aria-describedby="mass-desc"
          />
          <p id="mass-desc" className="text-xs text-slate-500 mt-1">
            Mass of the object in kilograms (kg).
          </p>
        </div>
        <div>
          <Label htmlFor="radius" className="mb-1 font-semibold">
            Radius (m)
          </Label>
          <Input
            id="radius"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 2"
            value={inputs.radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            aria-describedby="radius-desc"
          />
          <p id="radius-desc" className="text-xs text-slate-500 mt-1">
            Radius of the circular path in meters (m).
          </p>
        </div>
        <div>
          <Label htmlFor="velocity" className="mb-1 font-semibold">
            Velocity (m/s)
          </Label>
          <Input
            id="velocity"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 3"
            value={inputs.velocity}
            onChange={(e) => handleInputChange("velocity", e.target.value)}
            aria-describedby="velocity-desc"
          />
          <p id="velocity-desc" className="text-xs text-slate-500 mt-1">
            Tangential velocity in meters per second (m/s).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation, no extra logic needed
          }}
          type="button"
          aria-label="Calculate uniform circular motion results"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mass: "", radius: "", velocity: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
          aria-label="Reset inputs"
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
              <div className="text-3xl font-extrabold text-blue-900 dark:text-white space-y-3">
                {results.value}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-4 font-medium">
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
              <strong>Science Fact:</strong> Always ensure units are consistent,
              e.g., mass in kilograms, radius in meters, and velocity in meters
              per second for accurate physics calculations.
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
          Understanding Uniform Circular Motion Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Uniform circular motion occurs when an object moves along a circular
          path with a constant speed. Although the speed remains constant, the
          velocity vector changes direction continuously, resulting in an
          acceleration directed towards the center of the circle, known as
          centripetal acceleration. This acceleration requires a net inward
          force called centripetal force to maintain the circular path.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine key parameters such as centripetal
          force, centripetal acceleration, period, and angular velocity based
          on the mass of the object, radius of the circular path, and its
          tangential velocity. Understanding these quantities is essential in
          fields like mechanical engineering, astrophysics, and everyday
          applications involving rotational motion.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, all inputs must be positive real numbers. Use consistent
          SI units: mass in kilograms (kg), radius in meters (m), and velocity
          in meters per second (m/s). This ensures the results are accurate and
          meaningful.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Centripetal Force (F) = m × v² / r
Centripetal Acceleration (a) = v² / r
Period (T) = 2πr / v
Angular Velocity (ω) = v / r

Where:
  m = mass of the object (kg)
  v = tangential velocity (m/s)
  r = radius of circular path (m)
  F = centripetal force (Newtons, N)
  a = centripetal acceleration (m/s²)
  T = period of one revolution (seconds, s)
  ω = angular velocity (radians per second, rad/s)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the uniform circular motion
          formulas.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A 2 kg object moves in a circle of radius 3
            meters at a velocity of 4 m/s.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate centripetal force using F = m ×
            v² / r = 2 × 4² / 3 = 10.6667 N.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate centripetal acceleration a = v²
            / r = 16 / 3 = 5.3333 m/s².
          </li>
          <li>
            <strong>Step 3:</strong> Calculate period T = 2πr / v ≈ 4.7124 s.
          </li>
          <li>
            <strong>Step 4:</strong> Calculate angular velocity ω = v / r =
            4 / 3 = 1.3333 rad/s.
          </li>
          <li>
            <strong>Result:</strong> The object experiences a centripetal force
            of approximately 10.67 N, acceleration of 5.33 m/s², completes one
            revolution in about 4.71 seconds, and has an angular velocity of
            1.33 rad/s.
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
      title="Uniform Circular Motion Calculator"
      description="Solve for centripetal force and acceleration. Calculate the velocity and period of objects in uniform circular motion."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula:
          "F = m × v² / r, a = v² / r, T = 2πr / v, ω = v / r",
        variables: [
          { symbol: "m", description: "Mass of the object (kg)" },
          { symbol: "v", description: "Tangential velocity (m/s)" },
          { symbol: "r", description: "Radius of circular path (m)" },
          { symbol: "F", description: "Centripetal force (N)" },
          { symbol: "a", description: "Centripetal acceleration (m/s²)" },
          { symbol: "T", description: "Period of revolution (s)" },
          { symbol: "ω", description: "Angular velocity (rad/s)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A 2 kg object moves in a circle of radius 3 meters at a velocity of 4 m/s.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate centripetal force: F = m × v² / r = 2 × 4² / 3 = 10.6667 N.",
          },
          {
            label: "2",
            explanation:
              "Calculate centripetal acceleration: a = v² / r = 16 / 3 = 5.3333 m/s².",
          },
          {
            label: "3",
            explanation:
              "Calculate period: T = 2πr / v ≈ 4.7124 seconds.",
          },
          {
            label: "4",
            explanation:
              "Calculate angular velocity: ω = v / r = 4 / 3 = 1.3333 rad/s.",
          },
        ],
        result:
          "The object experiences a centripetal force of approximately 10.67 N, acceleration of 5.33 m/s², completes one revolution in about 4.71 seconds, and has an angular velocity of 1.33 rad/s.",
      }}
      relatedCalculators={[
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
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