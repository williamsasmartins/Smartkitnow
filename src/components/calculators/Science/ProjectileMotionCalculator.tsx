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
    v0: "", // initial velocity in m/s
    angle: "", // launch angle in degrees
    h0: "0", // initial height in meters, default 0
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numeric input with optional decimal point
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Constants
  const g = 9.81; // m/s^2 gravitational acceleration

  // Calculation logic in useMemo
  const results = useMemo(() => {
    // Parse inputs to floats
    const v0 = parseFloat(inputs.v0);
    const angleDeg = parseFloat(inputs.angle);
    const h0 = parseFloat(inputs.h0);

    // Validation
    if (
      isNaN(v0) ||
      isNaN(angleDeg) ||
      isNaN(h0) ||
      v0 <= 0 ||
      angleDeg <= 0 ||
      angleDeg >= 90 ||
      h0 < 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid inputs",
        subtext:
          "Initial velocity &gt; 0 m/s, angle between 0&deg; and 90&deg;, height &ge; 0 m",
        warning: null,
        formulaUsed: null,
      };
    }

    // Convert angle to radians
    const theta = (angleDeg * Math.PI) / 180;

    // Time of flight (t)
    // Quadratic formula for vertical motion: y = h0 + v0*sin(theta)*t - 0.5*g*t^2 = 0
    // Solve for t > 0:
    // t = [v0*sin(theta) + sqrt((v0*sin(theta))^2 + 2*g*h0)] / g
    const v0y = v0 * Math.sin(theta);
    const discriminant = v0y * v0y + 2 * g * h0;
    const timeOfFlight = (v0y + Math.sqrt(discriminant)) / g;

    // Maximum height (H)
    // H = h0 + (v0*sin(theta))^2 / (2*g)
    const maxHeight = h0 + (v0y * v0y) / (2 * g);

    // Horizontal range (R)
    // R = v0*cos(theta) * timeOfFlight
    const v0x = v0 * Math.cos(theta);
    const range = v0x * timeOfFlight;

    // Formatting function for results with units
    function formatValue(val: number, unit: string) {
      if (val >= 10000 || val < 0.001) {
        return val.toExponential(4) + " " + unit;
      }
      return val.toFixed(4) + " " + unit;
    }

    return {
      timeOfFlight: {
        value: formatValue(timeOfFlight, "seconds"),
        label: "Time of Flight",
        formulaUsed:
          "t = [v₀ sin θ + √((v₀ sin θ)² + 2gh₀)] / g",
      },
      maxHeight: {
        value: formatValue(maxHeight, "meters"),
        label: "Maximum Height",
        formulaUsed: "H = h₀ + (v₀ sin θ)² / (2g)",
      },
      range: {
        value: formatValue(range, "meters"),
        label: "Horizontal Range",
        formulaUsed: "R = v₀ cos θ × t",
      },
      warning: null,
      subtext: null,
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What factors affect the range of a projectile?",
      answer:
        "The range of a projectile depends primarily on its initial velocity, launch angle, and initial height. Air resistance is often neglected in basic calculations but can significantly affect real-world trajectories. The gravitational acceleration also plays a crucial role, as it determines how quickly the projectile falls back to the ground.",
    },
    {
      question: "Why must the launch angle be between 0° and 90°?",
      answer:
        "The launch angle must be between 0° and 90° because angles outside this range do not represent a physically meaningful projectile launch in the context of this calculator. Angles less than or equal to 0° would mean launching downward or horizontally, while angles greater than or equal to 90° would imply launching vertically upward or backward, which changes the nature of the motion.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="v0" className="font-semibold">
            Initial Velocity (v₀) in m/s
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
          <p id="v0-desc" className="text-sm text-slate-500 mt-1">
            Enter the initial speed of the projectile in meters per second.
          </p>
        </div>

        <div>
          <Label htmlFor="angle" className="font-semibold">
            Launch Angle (θ) in degrees
          </Label>
          <Input
            id="angle"
            type="text"
            inputMode="decimal"
            placeholder="Between 0 and 90"
            value={inputs.angle}
            onChange={(e) => handleInputChange("angle", e.target.value)}
            aria-describedby="angle-desc"
          />
          <p id="angle-desc" className="text-sm text-slate-500 mt-1">
            Enter the angle of launch in degrees (0 &lt; θ &lt; 90).
          </p>
        </div>

        <div>
          <Label htmlFor="h0" className="font-semibold">
            Initial Height (h₀) in meters
          </Label>
          <Input
            id="h0"
            type="text"
            inputMode="decimal"
            placeholder="Default is 0"
            value={inputs.h0}
            onChange={(e) => handleInputChange("h0", e.target.value)}
            aria-describedby="h0-desc"
          />
          <p id="h0-desc" className="text-sm text-slate-500 mt-1">
            Enter the initial height from which the projectile is launched (≥ 0).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          type="button"
          aria-label="Calculate projectile motion"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ v0: "", angle: "", h0: "0" })}
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
          {/* Time of Flight */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.timeOfFlight.formulaUsed || "Time of Flight"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.timeOfFlight.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.timeOfFlight.label}
              </p>
            </CardContent>
          </Card>

          {/* Maximum Height */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.maxHeight.formulaUsed || "Maximum Height"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.maxHeight.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.maxHeight.label}
              </p>
            </CardContent>
          </Card>

          {/* Horizontal Range */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.range.formulaUsed || "Horizontal Range"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.range.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.range.label}
              </p>
            </CardContent>
          </Card>

          {results.warning && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 dark:text-red-200">{results.warning}</p>
            </div>
          )}

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Always ensure units are consistent; convert angles to radians for calculations and velocities to meters per second.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Projectile Motion Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Projectile motion describes the trajectory of an object launched into the air, influenced only by gravity and its initial velocity. This calculator helps analyze key parameters such as the time the projectile stays in the air, the maximum height it reaches, and the horizontal distance it covers. These calculations assume no air resistance and constant gravitational acceleration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding projectile motion is essential in fields like sports science, ballistics, engineering, and space exploration. For example, engineers use these principles to design trajectories for rockets and missiles, while athletes apply them to optimize their throws or jumps.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator requires three inputs: the initial velocity (speed at launch), the launch angle (between 0&deg; and 90&deg;), and the initial height from which the object is launched. By adjusting these parameters, users can explore how each affects the projectile's path.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Time of Flight (t):
t = [v₀ sin θ + √((v₀ sin θ)² + 2gh₀)] / g

Maximum Height (H):
H = h₀ + (v₀ sin θ)² / (2g)

Horizontal Range (R):
R = v₀ cos θ × t

Where:
  v₀ = initial velocity (m/s)
  θ = launch angle (radians)
  h₀ = initial height (m)
  g = gravitational acceleration (9.81 m/s²)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the projectile motion calculator:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A ball is thrown with an initial velocity of 25 m/s at an angle of 40&deg; from a height of 1.5 meters.
          </li>
          <li>
            <strong>Step 1:</strong> Convert the angle to radians: θ = 40 × π / 180 ≈ 0.698 radians.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate the time of flight using the formula:
            <br />
            t = [25 × sin(0.698) + √((25 × sin(0.698))² + 2 × 9.81 × 1.5)] / 9.81 ≈ 3.57 seconds.
          </li>
          <li>
            <strong>Step 3:</strong> Calculate the maximum height:
            <br />
            H = 1.5 + (25 × sin(0.698))² / (2 × 9.81) ≈ 17.3 meters.
          </li>
          <li>
            <strong>Step 4:</strong> Calculate the horizontal range:
            <br />
            R = 25 × cos(0.698) × 3.57 ≈ 68.3 meters.
          </li>
          <li>
            <strong>Result:</strong> The ball stays in the air for about 3.57 seconds, reaches a maximum height of 17.3 meters, and lands approximately 68.3 meters away.
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
      title="Projectile Motion Calculator"
      description="Analyze projectile motion. Calculate range, maximum height, and time of flight for objects launched at an angle under gravity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `t = \\frac{v_0 \\sin \\theta + \\sqrt{(v_0 \\sin \\theta)^2 + 2 g h_0}}{g}
H = h_0 + \\frac{(v_0 \\sin \\theta)^2}{2 g}
R = v_0 \\cos \\theta \\times t`,
        variables: [
          { symbol: "v₀", description: "Initial velocity (m/s)" },
          { symbol: "θ", description: "Launch angle (degrees)" },
          { symbol: "h₀", description: "Initial height (meters)" },
          { symbol: "g", description: "Gravitational acceleration (9.81 m/s²)" },
          { symbol: "t", description: "Time of flight (seconds)" },
          { symbol: "H", description: "Maximum height (meters)" },
          { symbol: "R", description: "Horizontal range (meters)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A ball is thrown with an initial velocity of 25 m/s at an angle of 40° from a height of 1.5 meters.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the angle to radians and calculate the time of flight using the quadratic formula.",
          },
          {
            label: "2",
            explanation:
              "Calculate the maximum height reached by the projectile using the vertical velocity component.",
          },
          {
            label: "3",
            explanation:
              "Calculate the horizontal range by multiplying horizontal velocity by time of flight.",
          },
        ],
        result:
          "Time of flight ≈ 3.57 seconds, Maximum height ≈ 17.3 meters, Horizontal range ≈ 68.3 meters.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
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