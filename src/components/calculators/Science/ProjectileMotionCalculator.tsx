import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Atom, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ProjectileMotionCalculator() {
  const [inputs, setInputs] = useState({
    initialSpeed: "",
    launchAngle: "",
    initialHeight: "0",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const g = 9.81; // m/s² gravity constant

    // Parse inputs as floats
    const v0 = parseFloat(inputs.initialSpeed);
    const thetaDeg = parseFloat(inputs.launchAngle);
    const h0 = parseFloat(inputs.initialHeight);

    // Validate inputs
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
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Please enter valid positive numbers. Launch angle must be between 0° and 90°. Initial height cannot be negative.",
        formulaUsed: null,
      };
    }

    // Convert angle to radians
    const theta = (thetaDeg * Math.PI) / 180;

    // Time of flight formula for projectile launched from height h0:
    // t = (v0 * sinθ + sqrt((v0 * sinθ)^2 + 2gh0)) / g
    const v0Sin = v0 * Math.sin(theta);
    const discriminant = v0Sin * v0Sin + 2 * g * h0;
    const timeOfFlight = (v0Sin + Math.sqrt(discriminant)) / g;

    // Maximum height formula:
    // h_max = h0 + (v0^2 * sin^2θ) / (2g)
    const maxHeight = h0 + (v0 * v0 * Math.sin(theta) * Math.sin(theta)) / (2 * g);

    // Horizontal range formula:
    // R = v0 * cosθ * timeOfFlight
    const range = v0 * Math.cos(theta) * timeOfFlight;

    // Format numbers with units and scientific notation if needed
    function formatNumber(num: number, unit: string) {
      if (num !== 0 && (Math.abs(num) < 1e-4 || Math.abs(num) >= 1e5)) {
        return `${num.toExponential(4)} ${unit}`;
      }
      return `${num.toFixed(3)} ${unit}`;
    }

    return {
      value: (
        <>
          <div>
            <strong>Range:</strong> {formatNumber(range, "m")}
          </div>
          <div>
            <strong>Max Height:</strong> {formatNumber(maxHeight, "m")}
          </div>
          <div>
            <strong>Time of Flight:</strong> {formatNumber(timeOfFlight, "s")}
          </div>
        </>
      ),
      label: "Projectile motion results",
      subtext:
        "Range is the horizontal distance traveled. Max height is the peak altitude. Time of flight is total duration in air.",
      warning: null,
      formulaUsed: "Range, Max Height & Time of Flight",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What factors affect the range of a projectile?",
      answer:
        "The range of a projectile depends primarily on its initial speed, launch angle, and initial height. Air resistance is neglected in this calculator. The optimal angle for maximum range on level ground is 45°, but this changes if launched from a height.",
    },
    {
      question: "Why is the launch angle limited between 0° and 90°?",
      answer:
        "Launch angles below 0° or above 90° are physically unrealistic for projectile motion in this context. Angles between 0° and 90° represent upward launches from the horizontal plane.",
    },
    {
      question: "How does initial height influence the projectile's flight?",
      answer:
        "An initial height greater than zero increases the total time the projectile stays in the air and generally increases the range and maximum height compared to launching from ground level.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="initialSpeed" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-4 h-4" /> Initial Speed (v₀)
          </Label>
          <Input
            id="initialSpeed"
            type="text"
            placeholder="m/s"
            value={inputs.initialSpeed}
            onChange={(e) => handleInputChange("initialSpeed", e.target.value)}
            aria-describedby="initialSpeedHelp"
          />
          <p id="initialSpeedHelp" className="text-xs text-slate-500 mt-1">
            Enter initial speed in meters per second (m/s).
          </p>
        </div>

        <div>
          <Label htmlFor="launchAngle" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <RotateCcw className="w-4 h-4" /> Launch Angle (θ)
          </Label>
          <Input
            id="launchAngle"
            type="text"
            placeholder="degrees"
            value={inputs.launchAngle}
            onChange={(e) => handleInputChange("launchAngle", e.target.value)}
            aria-describedby="launchAngleHelp"
          />
          <p id="launchAngleHelp" className="text-xs text-slate-500 mt-1">
            Enter launch angle in degrees (0° &lt;= θ &lt;= 90°).
          </p>
        </div>

        <div>
          <Label htmlFor="initialHeight" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-4 h-4" /> Initial Height (h₀)
          </Label>
          <Input
            id="initialHeight"
            type="text"
            placeholder="meters"
            value={inputs.initialHeight}
            onChange={(e) => handleInputChange("initialHeight", e.target.value)}
            aria-describedby="initialHeightHelp"
          />
          <p id="initialHeightHelp" className="text-xs text-slate-500 mt-1">
            Enter initial height in meters (≥ 0).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state with current inputs (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate projectile motion"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ initialSpeed: "", launchAngle: "", initialHeight: "0" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Projectile Motion Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Projectile motion describes the trajectory of an object launched into the air, influenced only by gravity and its initial velocity. This calculator helps analyze key parameters such as range, maximum height, and time of flight for a projectile launched at an angle from a given initial height. Understanding these parameters is essential in physics, engineering, and various applications like ballistics and sports science.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator assumes no air resistance and a constant gravitational acceleration of 9.81 m/s² near Earth's surface. By inputting the initial speed, launch angle, and initial height, users can explore how these factors affect the projectile's flight path and performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is valuable for students and educators to visualize and quantify projectile motion, reinforcing theoretical concepts with practical calculations. It also aids in designing experiments and solving real-world problems involving parabolic trajectories.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Constants:
  g = 9.81 m/s² (acceleration due to gravity)

Variables:
  v₀ = initial speed (m/s)
  θ = launch angle (degrees)
  h₀ = initial height (m)
  t = time of flight (s)
  R = horizontal range (m)
  H = maximum height (m)

Conversions:
  θ (radians) = θ (degrees) × π / 180

Formulas:
  Time of flight:
    t = (v₀ * sinθ + √((v₀ * sinθ)² + 2gh₀)) / g

  Maximum height:
    H = h₀ + (v₀² * sin²θ) / (2g)

  Range:
    R = v₀ * cosθ * t
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
H = h_0 + \\frac{v_0^2 \\sin^2 \\theta}{2 g}
R = v_0 \\cos \\theta \\times t`,
        variables: [
          { symbol: "v₀", description: "Initial speed in meters per second (m/s)" },
          { symbol: "θ", description: "Launch angle in degrees (°)" },
          { symbol: "h₀", description: "Initial height in meters (m)" },
          { symbol: "t", description: "Time of flight in seconds (s)" },
          { symbol: "H", description: "Maximum height in meters (m)" },
          { symbol: "R", description: "Horizontal range in meters (m)" },
          { symbol: "g", description: "Acceleration due to gravity (9.81 m/s²)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A ball is launched with an initial speed of 20 m/s at an angle of 30° from a height of 1.5 meters. Calculate the range, maximum height, and time of flight.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the launch angle to radians: θ = 30° × π / 180 = 0.5236 rad.",
          },
          {
            label: "2",
            explanation:
              "Calculate time of flight using the formula: t = (v₀ sinθ + √((v₀ sinθ)² + 2gh₀)) / g.",
          },
          {
            label: "3",
            explanation:
              "Calculate maximum height: H = h₀ + (v₀² sin²θ) / (2g).",
          },
          {
            label: "4",
            explanation:
              "Calculate range: R = v₀ cosθ × t.",
          },
        ],
        result:
          "Time of flight ≈ 2.26 s, Maximum height ≈ 6.09 m, Range ≈ 39.13 m.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations Solver (SUVAT)", url: "/science/kinematics-suvat-solver", icon: "🚀" },
        { title: "Specific Heat Calculator", url: "/science/specific-heat-q-mc-delta-t", icon: "🔥" },
        { title: "Orbital Period (Kepler) Estimator", url: "/science/orbital-period-kepler-estimator", icon: "🪐" },
        { title: "Percent Yield & Theoretical Yield", url: "/science/percent-yield-theoretical-yield", icon: "🧪" },
        { title: "Gravity on Other Planets Calculator", url: "/science/gravity-on-other-planets-calculator", icon: "🪐" },
        { title: "Radioactive Activity Calculator", url: "/science/radioactive-activity-a-lambda-n", icon: "🧪" },
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