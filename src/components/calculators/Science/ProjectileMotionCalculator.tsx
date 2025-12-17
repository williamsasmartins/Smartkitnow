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

export default function ProjectileMotionCalculator() {
  // Inputs: initial velocity (v0), launch angle (theta), initial height (h0)
  // Units: velocity in m/s, angle in degrees, height in meters
  const [inputs, setInputs] = useState({
    v0: "", // initial velocity (m/s)
    theta: "", // launch angle (degrees)
    h0: "", // initial height (m)
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points, empty string allowed for clearing
    if (value === "" || /^(\d+\.?\d*|\.\d*)$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Constants
  const g = 9.81; // m/s^2 gravitational acceleration

  // Calculation logic in useMemo
  const results = useMemo(() => {
    const v0 = parseFloat(inputs.v0);
    const thetaDeg = parseFloat(inputs.theta);
    const h0 = parseFloat(inputs.h0);

    // Validation
    if (
      isNaN(v0) ||
      isNaN(thetaDeg) ||
      isNaN(h0) ||
      v0 < 0 ||
      thetaDeg < 0 ||
      thetaDeg > 90
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid inputs",
        subtext:
          "Initial velocity ≥ 0 m/s, angle between 0° and 90°, height ≥ 0 m",
        warning: null,
        formulaUsed: null,
      };
    }

    // Convert angle to radians
    const theta = (thetaDeg * Math.PI) / 180;

    // Time of flight calculation:
    // Solve quadratic: y = h0 + v0*sin(theta)*t - 0.5*g*t^2 = 0
    // t = [v0*sin(theta) + sqrt((v0*sin(theta))^2 + 2*g*h0)] / g
    const v0y = v0 * Math.sin(theta);
    const discriminant = v0y * v0y + 2 * g * h0;

    if (discriminant < 0) {
      return {
        value: "Error",
        label: "No real solution for time of flight",
        subtext: "Check inputs: initial height and velocity angle",
        warning:
          "The discriminant is negative, indicating no real flight time. Adjust inputs.",
        formulaUsed: null,
      };
    }

    const timeOfFlight = (v0y + Math.sqrt(discriminant)) / g;

    // Maximum height:
    // h_max = h0 + (v0*sin(theta))^2 / (2*g)
    const maxHeight = h0 + (v0y * v0y) / (2 * g);

    // Horizontal range:
    // Range = v0*cos(theta) * timeOfFlight
    const v0x = v0 * Math.cos(theta);
    const range = v0x * timeOfFlight;

    // Formatting results with units and scientific notation if needed
    function formatVal(val: number, unit: string) {
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
            <strong>Range:</strong> {formatVal(range, "meters")}
          </p>
          <p>
            <strong>Maximum Height:</strong> {formatVal(maxHeight, "meters")}
          </p>
          <p>
            <strong>Time of Flight:</strong> {formatVal(timeOfFlight, "seconds")}
          </p>
        </>
      ),
      label: "Projectile Motion Results",
      subtext:
        "Range, maximum height, and time of flight calculated assuming no air resistance and constant gravity (g = 9.81 m/s²).",
      warning: null,
      formulaUsed:
        "Range = v₀·cos(θ)·t, Max Height = h₀ + (v₀·sin(θ))² / (2g), Time of Flight = [v₀·sin(θ) + √((v₀·sin(θ))² + 2gh₀)] / g",
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What factors affect projectile motion?",
      answer:
        "Projectile motion is influenced primarily by the initial velocity, launch angle, and the height from which the object is launched. Gravity acts downward constantly, affecting the vertical motion. Air resistance is often neglected in basic calculations but can significantly alter real-world trajectories.",
    },
    {
      question: "Why is the launch angle limited between 0° and 90°?",
      answer:
        "The launch angle is measured from the horizontal axis. Angles less than 0° imply downward launch, and angles greater than 90° imply launching backward or downward. For standard projectile motion analysis, angles between 0° and 90° represent upward launches that produce a parabolic trajectory.",
    },
    {
      question: "Where is projectile motion applied in real life?",
      answer:
        "Projectile motion principles are essential in various fields such as sports (e.g., basketball, soccer), engineering (e.g., ballistics, bridge design), and space science (e.g., satellite launches). Understanding projectile trajectories helps optimize performance, safety, and design in these applications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="v0" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Initial Velocity (v₀) [m/s]
          </Label>
          <Input
            id="v0"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 20"
            value={inputs.v0}
            onChange={(e) => handleInputChange("v0", e.target.value)}
            aria-describedby="v0-desc"
          />
          <p id="v0-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Must be ≥ 0
          </p>
        </div>

        <div>
          <Label htmlFor="theta" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Launch Angle (θ) [degrees]
          </Label>
          <Input
            id="theta"
            type="text"
            inputMode="decimal"
            placeholder="0 to 90"
            value={inputs.theta}
            onChange={(e) => handleInputChange("theta", e.target.value)}
            aria-describedby="theta-desc"
          />
          <p id="theta-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Between 0° and 90°
          </p>
        </div>

        <div>
          <Label htmlFor="h0" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Initial Height (h₀) [meters]
          </Label>
          <Input
            id="h0"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 0"
            value={inputs.h0}
            onChange={(e) => handleInputChange("h0", e.target.value)}
            aria-describedby="h0-desc"
          />
          <p id="h0-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Must be ≥ 0
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
          aria-label="Calculate projectile motion"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ v0: "", theta: "", h0: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <div className="text-3xl font-extrabold text-blue-900 dark:text-white space-y-2">
                {results.value}
              </div>
              <p className="text-slate-600 dark:text-slate-300 mt-4 font-medium">{results.label}</p>
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
              <strong>Science Fact:</strong> Always ensure units are consistent (e.g., velocity in m/s, height in meters) for accurate projectile motion calculations.
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
          Understanding Projectile Motion Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Projectile motion describes the curved path an object follows when launched into the air, influenced only by gravity and its initial velocity. This calculator helps analyze key parameters such as range, maximum height, and time of flight for an object launched at an angle from a certain height. It assumes no air resistance and constant gravitational acceleration (g = 9.81 m/s²).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The initial velocity and launch angle determine the shape and distance of the trajectory. The initial height affects how long the projectile stays in the air and how far it travels horizontally. Understanding these factors is crucial in fields like sports, engineering, and physics education.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that the launch angle must be between 0° and 90° (&lt;= θ &lt;= 90°), and the initial velocity must be non-negative. The calculator outputs results in meters and seconds, providing clear units for each value.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Time of Flight (t):
t = \\frac{v_0 \\sin \\theta + \\sqrt{(v_0 \\sin \\theta)^2 + 2 g h_0}}{g}

Maximum Height (h_{max}):
h_{max} = h_0 + \\frac{(v_0 \\sin \\theta)^2}{2 g}

Horizontal Range (R):
R = v_0 \\cos \\theta \\times t

Where:
v_0 = initial velocity (m/s)
\\theta = launch angle (degrees)
h_0 = initial height (m)
g = acceleration due to gravity = 9.81 m/s²`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the projectile motion calculator.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> An object is launched with an initial velocity of 25 m/s at an angle of 45° from a height of 1.5 meters.
          </li>
          <li>
            <strong>Step 1:</strong> Convert the angle to radians: θ = 45° × π/180 = 0.7854 rad.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate vertical and horizontal components of velocity:
            v₀y = 25 × sin(0.7854) ≈ 17.68 m/s,
            v₀x = 25 × cos(0.7854) ≈ 17.68 m/s.
          </li>
          <li>
            <strong>Step 3:</strong> Calculate time of flight:
            t = (17.68 + √(17.68² + 2 × 9.81 × 1.5)) / 9.81 ≈ 3.71 seconds.
          </li>
          <li>
            <strong>Step 4:</strong> Calculate maximum height:
            h_max = 1.5 + (17.68²) / (2 × 9.81) ≈ 17.42 meters.
          </li>
          <li>
            <strong>Step 5:</strong> Calculate horizontal range:
            R = 17.68 × 3.71 ≈ 65.58 meters.
          </li>
          <li>
            <strong>Result:</strong> The projectile lands approximately 65.58 meters away, reaches a maximum height of 17.42 meters, and stays in the air for about 3.71 seconds.
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
      title="Projectile Motion Calculator"
      description="Analyze projectile motion. Calculate range, maximum height, and time of flight for objects launched at an angle under gravity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula:
          "t = (v₀ sin θ + √((v₀ sin θ)² + 2 g h₀)) / g\nh_max = h₀ + (v₀ sin θ)² / (2 g)\nR = v₀ cos θ × t",
        variables: [
          { symbol: "v₀", description: "Initial velocity (m/s)" },
          { symbol: "θ", description: "Launch angle (degrees)" },
          { symbol: "h₀", description: "Initial height (meters)" },
          { symbol: "g", description: "Acceleration due to gravity (9.81 m/s²)" },
          { symbol: "t", description: "Time of flight (seconds)" },
          { symbol: "h_max", description: "Maximum height (meters)" },
          { symbol: "R", description: "Horizontal range (meters)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the projectile motion parameters for an object launched at 25 m/s at 45° from a height of 1.5 meters.",
        steps: [
          { label: "1", explanation: "Convert angle to radians and calculate velocity components." },
          { label: "2", explanation: "Calculate time of flight using the quadratic formula." },
          { label: "3", explanation: "Calculate maximum height using vertical velocity component." },
          { label: "4", explanation: "Calculate horizontal range using horizontal velocity and time." },
        ],
        result:
          "Range ≈ 65.58 meters, Maximum Height ≈ 17.42 meters, Time of Flight ≈ 3.71 seconds.",
      }}
      relatedCalculators={[
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
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