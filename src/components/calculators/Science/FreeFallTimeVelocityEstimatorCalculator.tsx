import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FreeFallTimeVelocityEstimatorCalculator() {
  // Inputs: height (m), initial velocity (m/s), gravity (m/s²)
  // Default gravity = 9.81 m/s² (Earth surface)
  const [inputs, setInputs] = useState({
    height: "",
    initialVelocity: "0",
    gravity: "9.81",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const g = parseFloat(inputs.gravity);
    const h = parseFloat(inputs.height);
    const v0 = parseFloat(inputs.initialVelocity);

    // Validation
    if (isNaN(h) || h <= 0) {
      return {
        value: "Waiting...",
        label: "Enter a valid height &gt; 0",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (isNaN(g) || g <= 0) {
      return {
        value: "Waiting...",
        label: "Enter a valid gravity &gt; 0",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (isNaN(v0)) {
      return {
        value: "Waiting...",
        label: "Enter a valid initial velocity",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculation:
    // Free-fall time t = (v - v0) / g where v = sqrt(v0² + 2gh)
    // Impact velocity v = sqrt(v0² + 2gh)
    // Time t = (v - v0) / g if v0 and v have same direction (assuming downward positive)
    // Here, assume object is dropped or thrown downward (v0 positive downward)
    // If v0 is upward (negative), time calculation differs; we use quadratic formula for time:
    // Equation: h = v0 * t + 0.5 * g * t²
    // Solve for t: 0.5 * g * t² + v0 * t - h = 0
    // Use quadratic formula: t = [-v0 ± sqrt(v0² + 2gh)] / g
    // Time must be positive, so take positive root.

    const discriminant = v0 * v0 + 2 * g * h;
    if (discriminant < 0) {
      return {
        value: "Error",
        label: "No real solution for given inputs",
        subtext: "",
        warning: "Discriminant is negative. Check inputs.",
        formulaUsed: null,
      };
    }
    const sqrtDisc = Math.sqrt(discriminant);
    const t1 = (-v0 + sqrtDisc) / g;
    const t2 = (-v0 - sqrtDisc) / g;

    // Choose positive time
    const time = t1 > 0 ? t1 : t2 > 0 ? t2 : null;
    if (time === null) {
      return {
        value: "Error",
        label: "No positive time solution",
        subtext: "",
        warning: "Calculated time is negative. Check initial velocity direction.",
        formulaUsed: null,
      };
    }

    const impactVelocity = v0 + g * time; // v = v0 + g*t

    // Formatting results:
    const formatNumber = (num: number) =>
      num > 10000 || num < 0.001 ? num.toExponential(4) : num.toFixed(4);

    return {
      value: `${formatNumber(time)} s / ${formatNumber(impactVelocity)} m/s`,
      label: "Free-Fall Time / Impact Velocity",
      subtext:
        "Time in seconds (s) and velocity in meters per second (m/s) assuming downward positive direction.",
      warning: null,
      formulaUsed:
        "t = [-v₀ ± √(v₀² + 2gh)] / g, v = v₀ + gt",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What factors affect free-fall time?",
      answer:
        "Free-fall time depends primarily on the height from which an object is dropped and the acceleration due to gravity. Initial velocity also affects the time if the object is thrown upwards or downwards. Air resistance is neglected in this idealized calculation, which assumes vacuum conditions.",
    },
    {
      question: "Why do we use the quadratic formula for time?",
      answer:
        "The motion equation h = v₀t + ½gt² is quadratic in time, so solving for t requires the quadratic formula. This accounts for both upward and downward initial velocities, ensuring we find the physically meaningful positive time when the object reaches the ground.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="height" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Atom className="w-5 h-5 text-blue-600" /> Height (meters)
          </Label>
          <Input
            id="height"
            type="text"
            placeholder="Enter height (m)"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            aria-describedby="height-desc"
          />
          <p id="height-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Height from which the object is dropped or thrown. Must be &gt; 0.
          </p>
        </div>

        <div>
          <Label htmlFor="initialVelocity" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Atom className="w-5 h-5 text-green-600" /> Initial Velocity (m/s)
          </Label>
          <Input
            id="initialVelocity"
            type="text"
            placeholder="Enter initial velocity (m/s)"
            value={inputs.initialVelocity}
            onChange={(e) => handleInputChange("initialVelocity", e.target.value)}
            aria-describedby="velocity-desc"
          />
          <p id="velocity-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Positive means downward throw; zero means dropped; negative means thrown upward.
          </p>
        </div>

        <div>
          <Label htmlFor="gravity" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Atom className="w-5 h-5 text-red-600" /> Gravity (m/s²)
          </Label>
          <Input
            id="gravity"
            type="text"
            placeholder="Acceleration due to gravity"
            value={inputs.gravity}
            onChange={(e) => handleInputChange("gravity", e.target.value)}
            aria-describedby="gravity-desc"
          />
          <p id="gravity-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Standard Earth gravity is 9.81 m/s². Change for other planets.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          type="button"
          aria-label="Calculate free-fall time and velocity"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              height: "",
              initialVelocity: "0",
              gravity: "9.81",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <strong>Science Fact:</strong> Always ensure units are consistent. Height in meters, velocity in meters per second, and gravity in meters per second squared.
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
          Understanding Free-Fall Time/Velocity Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Free-fall motion describes the movement of an object solely under the influence of gravity, neglecting air resistance. This estimator calculates how long an object takes to fall from a given height and its velocity upon impact. It accounts for initial velocity, which can be zero (dropped), positive (thrown downward), or negative (thrown upward).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding free-fall is essential in physics, engineering, and many real-world applications such as calculating the impact speed of falling objects, designing safety equipment, or predicting trajectories in sports and aerospace. The acceleration due to gravity varies slightly depending on location and celestial body, which can be adjusted in this tool.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool assumes a uniform gravitational field and no air resistance, which is a good approximation for many practical scenarios near Earth's surface. For more complex cases, factors like drag and varying gravity must be considered.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`h = v₀ t + ½ g t²

Solve for time t using quadratic formula:

t = [-v₀ ± √(v₀² + 2 g h)] / g

Impact velocity:

v = v₀ + g t

Where:
  h = height (meters)
  v₀ = initial velocity (m/s)
  g = acceleration due to gravity (m/s²)
  t = time of fall (seconds)
  v = impact velocity (m/s)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem: An object is thrown upward from a 20-meter high cliff with an initial velocity of 5 m/s. Calculate the time it takes to hit the ground and its impact velocity. Use Earth's gravity (9.81 m/s²).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> h = 20 m, v₀ = -5 m/s (upward), g = 9.81 m/s²</li>
          <li><strong>Step 1:</strong> Calculate discriminant: v₀² + 2gh = (-5)² + 2×9.81×20 = 25 + 392.4 = 417.4</li>
          <li><strong>Step 2:</strong> Calculate time: t = [-(-5) ± √417.4] / 9.81 = [5 ± 20.436] / 9.81</li>
          <li><strong>Step 3:</strong> Positive root: t = (5 + 20.436) / 9.81 ≈ 2.58 s</li>
          <li><strong>Step 4:</strong> Calculate impact velocity: v = v₀ + g t = -5 + 9.81 × 2.58 ≈ 20.3 m/s downward</li>
          <li><strong>Result:</strong> Time to hit ground ≈ 2.58 s, Impact velocity ≈ 20.3 m/s downward</li>
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
      title="Free-Fall Time/Velocity Estimator"
      description="Estimate free-fall parameters. Calculate how long an object takes to fall and its impact velocity under gravity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `t = [-v₀ ± √(v₀² + 2 g h)] / g\nv = v₀ + g t`,
        variables: [
          { symbol: "h", description: "Height (meters)" },
          { symbol: "v₀", description: "Initial velocity (m/s)" },
          { symbol: "g", description: "Acceleration due to gravity (m/s²)" },
          { symbol: "t", description: "Time of fall (seconds)" },
          { symbol: "v", description: "Impact velocity (m/s)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "An object is thrown upward from a 20-meter cliff with an initial velocity of 5 m/s. Calculate the time to hit the ground and impact velocity using Earth's gravity.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the discriminant v₀² + 2gh = 25 + 392.4 = 417.4",
          },
          {
            label: "2",
            explanation:
              "Calculate time using quadratic formula: t = (5 + √417.4) / 9.81 ≈ 2.58 s",
          },
          {
            label: "3",
            explanation:
              "Calculate impact velocity: v = v₀ + g t = -5 + 9.81 × 2.58 ≈ 20.3 m/s downward",
          },
        ],
        result: "Time to hit ground ≈ 2.58 s, Impact velocity ≈ 20.3 m/s downward",
      }}
      relatedCalculators={[
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
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