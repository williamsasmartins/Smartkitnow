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
  // Units: v0 in m/s, theta in degrees, h0 in meters
  const [inputs, setInputs] = useState({
    v0: "", // initial velocity in m/s
    theta: "", // launch angle in degrees
    h0: "0", // initial height in meters, default 0
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
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
      v0 <= 0 ||
      thetaDeg < 0 ||
      thetaDeg > 90 ||
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
    const theta = (thetaDeg * Math.PI) / 180;

    // Components of velocity
    const v0x = v0 * Math.cos(theta);
    const v0y = v0 * Math.sin(theta);

    // Time of flight calculation:
    // Solve quadratic for y(t) = 0: y = h0 + v0y * t - 0.5 * g * t^2 = 0
    // t = [v0y + sqrt(v0y^2 + 2 * g * h0)] / g (positive root)
    const discriminant = v0y * v0y + 2 * g * h0;
    if (discriminant < 0) {
      return {
        value: "Error",
        label: "No real solution for time of flight",
        subtext: "Check inputs for physical validity",
        warning: "Discriminant is negative, no real roots for flight time.",
        formulaUsed: null,
      };
    }
    const timeOfFlight = (v0y + Math.sqrt(discriminant)) / g;

    // Maximum height:
    // h_max = h0 + (v0y^2) / (2g)
    const maxHeight = h0 + (v0y * v0y) / (2 * g);

    // Range:
    // range = v0x * timeOfFlight
    const range = v0x * timeOfFlight;

    // Formatting results with units and scientific notation if needed
    function formatValue(val: number, unit: string) {
      if (val >= 10000 || (val !== 0 && val < 0.001)) {
        return `${val.toExponential(4)} ${unit}`;
      }
      return `${val.toFixed(4)} ${unit}`;
    }

    return {
      value: {
        range: formatValue(range, "m"),
        maxHeight: formatValue(maxHeight, "m"),
        timeOfFlight: formatValue(timeOfFlight, "s"),
      },
      label: "Projectile Motion Results",
      subtext:
        "Range, maximum height, and time of flight calculated under gravity (g = 9.81 m/s²).",
      warning: null,
      formulaUsed:
        "Range = v₀ cos(θ) × t_flight; Max Height = h₀ + (v₀ sin(θ))² / (2g); Time of Flight = [v₀ sin(θ) + √(v₀² sin²(θ) + 2gh₀)] / g",
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What factors affect the range of a projectile?",
      answer:
        "The range of a projectile depends primarily on the initial velocity, launch angle, and initial height. Air resistance is neglected in this calculation. A higher initial velocity or an optimal launch angle close to 45° generally increases the range. Initial height also affects the total time the projectile stays in the air, influencing the range.",
    },
    {
      question: "Why is the launch angle restricted between 0° and 90°?",
      answer:
        "The launch angle is restricted between 0° and 90° because angles outside this range do not represent physically meaningful projectile launches in this context. Angles below 0° would imply launching below the horizontal, and angles above 90° would mean launching backward or downward, which are not typical projectile motions considered here.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
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
          <p id="v0-desc" className="text-xs text-slate-500 mt-1">
            Must be &gt; 0 m/s
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
          <p id="theta-desc" className="text-xs text-slate-500 mt-1">
            Between 0&deg; and 90&deg;
          </p>
        </div>
        <div>
          <Label htmlFor="h0" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Initial Height (h₀) [m]
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
          <p id="h0-desc" className="text-xs text-slate-500 mt-1">
            Must be &ge; 0 m (default 0)
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
          aria-label="Calculate projectile motion"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ v0: "", theta: "", h0: "0" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && results.value !== "Error" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-4">
                Range: {results.value.range}
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-4">
                Max Height: {results.value.maxHeight}
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white">
                Time of Flight: {results.value.timeOfFlight}
              </p>
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
              <strong>Science Fact:</strong> Always ensure units are consistent. Convert velocities to m/s and heights to meters for accurate projectile motion calculations.
            </p>
          </div>
        </div>
      )}

      {results.value === "Error" && (
        <div
          className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">{results.subtext}</p>
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
          Projectile motion describes the curved path an object follows when launched into the air, influenced only by gravity and its initial velocity. This calculator helps analyze such motion by computing the range, maximum height, and time of flight for an object launched at an angle from a given height. It assumes no air resistance and constant gravitational acceleration (g = 9.81 m/s²).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding projectile motion is essential in fields like ballistics, sports science, and engineering. For example, engineers use these calculations to design trajectories for projectiles or optimize the launch angles of sports equipment. This tool provides precise results based on classical physics formulas.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that the launch angle must be between 0&deg; and 90&deg;, and initial velocity must be positive. The initial height can be zero or any positive value, representing the height from which the object is launched.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`// Variables:
v₀ = initial velocity (m/s)
θ = launch angle (degrees)
h₀ = initial height (m)
g = gravitational acceleration (9.81 m/s²)

// Convert θ to radians:
θ_rad = θ × (π / 180)

// Velocity components:
v₀x = v₀ × cos(θ_rad)
v₀y = v₀ × sin(θ_rad)

// Time of flight (t_flight):
t_flight = [v₀y + sqrt(v₀y² + 2gh₀)] / g

// Maximum height (h_max):
h_max = h₀ + (v₀y²) / (2g)

// Range (R):
R = v₀x × t_flight`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the projectile motion calculator:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> An object is launched with an initial velocity of 30 m/s at an angle of 40&deg; from a height of 2 meters.
          </li>
          <li>
            <strong>Step 1:</strong> Convert the angle to radians: θ_rad = 40 × (π / 180) ≈ 0.698 radians.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate velocity components: v₀x = 30 × cos(0.698) ≈ 22.98 m/s, v₀y = 30 × sin(0.698) ≈ 19.28 m/s.
          </li>
          <li>
            <strong>Step 3:</strong> Compute time of flight: t_flight = [19.28 + √(19.28² + 2 × 9.81 × 2)] / 9.81 ≈ 4.19 s.
          </li>
          <li>
            <strong>Step 4:</strong> Calculate maximum height: h_max = 2 + (19.28²) / (2 × 9.81) ≈ 21.95 m.
          </li>
          <li>
            <strong>Step 5:</strong> Calculate range: R = 22.98 × 4.19 ≈ 96.29 m.
          </li>
          <li>
            <strong>Result:</strong> The projectile lands approximately 96.29 meters away, reaches a maximum height of 21.95 meters, and stays in the air for about 4.19 seconds.
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
          "Range = v₀ cos(θ) × t_flight; Max Height = h₀ + (v₀ sin(θ))² / (2g); Time of Flight = [v₀ sin(θ) + √(v₀² sin²(θ) + 2gh₀)] / g",
        variables: [
          { symbol: "v₀", description: "Initial velocity in meters per second (m/s)" },
          { symbol: "θ", description: "Launch angle in degrees (°)" },
          { symbol: "h₀", description: "Initial height in meters (m)" },
          { symbol: "g", description: "Acceleration due to gravity (9.81 m/s²)" },
          { symbol: "t_flight", description: "Time of flight in seconds (s)" },
          { symbol: "Range", description: "Horizontal distance traveled in meters (m)" },
          { symbol: "Max Height", description: "Maximum vertical height reached in meters (m)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the range, maximum height, and time of flight for a projectile launched at 30 m/s at 40° from a height of 2 meters.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the angle to radians and calculate velocity components: v₀x and v₀y.",
          },
          {
            label: "2",
            explanation:
              "Calculate the time of flight using the quadratic formula considering initial height.",
          },
          {
            label: "3",
            explanation:
              "Compute maximum height and range using the formulas provided.",
          },
        ],
        result:
          "Range ≈ 96.29 m, Max Height ≈ 21.95 m, Time of Flight ≈ 4.19 s.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
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