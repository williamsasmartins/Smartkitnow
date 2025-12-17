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
  // Gravity default 9.81 m/s², user can override for other planets or conditions
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

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const h = parseFloat(inputs.height);
    const v0 = parseFloat(inputs.initialVelocity);
    const g = parseFloat(inputs.gravity);

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
    // Free-fall time t = (v0 + sqrt(v0² + 2gh)) / g  (assuming downward positive)
    // Impact velocity v = sqrt(v0² + 2gh)
    // Here, height h is vertical distance fallen, g is acceleration due to gravity
    // We consider downward direction positive for velocity and acceleration

    // Compute impact velocity magnitude
    const vImpact = Math.sqrt(v0 * v0 + 2 * g * h);

    // Compute time of fall
    // Time t = (vImpact - v0) / g if v0 is upward (negative), else (vImpact + v0)/g
    // But since v0 can be positive or zero, formula t = (vImpact - v0)/g if v0 is downward (positive)
    // To avoid confusion, use standard formula for time to fall from rest with initial velocity v0 downward:
    // t = (vImpact - v0) / g if v0 is downward (positive)
    // If v0 is upward (negative), t = (vImpact + |v0|)/g
    // To unify, use t = (vImpact - v0) / g

    // But if v0 is upward (negative), vImpact - v0 = vImpact + |v0|, so formula holds.

    const tFall = (vImpact - v0) / g;

    // Formatting results:
    // Use scientific notation if value > 10000 or < 0.001
    function formatVal(val: number, unit: string) {
      if (val > 10000 || val < 0.001) {
        return val.toExponential(4) + " " + unit;
      }
      return val.toFixed(4) + " " + unit;
    }

    const timeStr = formatVal(tFall, "seconds");
    const velocityStr = formatVal(vImpact, "m/s");

    return {
      value: (
        <>
          <span className="block font-semibold text-lg">Time of Fall: {timeStr}</span>
          <span className="block font-semibold text-lg mt-2">Impact Velocity: {velocityStr}</span>
        </>
      ),
      label: "Free-Fall Time & Impact Velocity",
      subtext:
        "Assuming downward direction positive, no air resistance, constant gravity.",
      warning: null,
      formulaUsed:
        "t = (√(v₀² + 2gh) - v₀) / g,  v = √(v₀² + 2gh)",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why does the formula include the initial velocity squared term?",
      answer:
        "The initial velocity squared term (v₀²) accounts for the object's starting speed before free fall begins. This is important because the total impact velocity depends on both the initial velocity and the acceleration due to gravity over the fall distance. Ignoring initial velocity assumes the object starts from rest, which is not always the case in real-world scenarios.",
    },
    {
      question: "How does air resistance affect free-fall calculations?",
      answer:
        "This estimator assumes no air resistance, meaning the object falls freely under gravity alone. In reality, air resistance slows down falling objects, especially those with large surface areas or low mass. Including air resistance requires more complex modeling and often numerical methods, so this tool provides idealized estimates useful for basic physics and engineering calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="height" className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-blue-600" /> Height (meters)
          </Label>
          <Input
            id="height"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 100"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            aria-describedby="height-desc"
          />
          <p id="height-desc" className="text-xs text-slate-500 mt-1">
            Enter the vertical drop height in meters (m). Must be &gt; 0.
          </p>
        </div>

        <div>
          <Label htmlFor="initialVelocity" className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-green-600" /> Initial Velocity (m/s)
          </Label>
          <Input
            id="initialVelocity"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 0"
            value={inputs.initialVelocity}
            onChange={(e) => handleInputChange("initialVelocity", e.target.value)}
            aria-describedby="initialVelocity-desc"
          />
          <p id="initialVelocity-desc" className="text-xs text-slate-500 mt-1">
            Enter initial velocity in meters per second (m/s). Positive is downward, negative is upward.
          </p>
        </div>

        <div>
          <Label htmlFor="gravity" className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-red-600" /> Gravity (m/s²)
          </Label>
          <Input
            id="gravity"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 9.81"
            value={inputs.gravity}
            onChange={(e) => handleInputChange("gravity", e.target.value)}
            aria-describedby="gravity-desc"
          />
          <p id="gravity-desc" className="text-xs text-slate-500 mt-1">
            Acceleration due to gravity. Default is Earth's gravity (9.81 m/s²). Must be &gt; 0.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
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
              <strong>Science Fact:</strong> Always use consistent units (meters, seconds) and convert initial velocity to m/s. Positive velocity means downward direction.
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
          Free fall describes the motion of an object falling solely under the influence of gravity, without air resistance. This estimator calculates the time it takes for an object to fall from a given height and its velocity upon impact. The initial velocity can be zero (object dropped) or non-zero (object thrown downward or upward). Gravity is a constant acceleration that pulls objects toward the Earth or other celestial bodies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool is essential in physics education, engineering, and safety calculations. For example, engineers use free-fall time and velocity to design safe drop tests, while astronomers estimate fall times on other planets by adjusting gravity. Understanding these parameters helps predict impact forces and design protective measures.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The estimator assumes no air resistance and constant gravity, which is a good approximation for many practical scenarios near the Earth's surface. For more complex environments, additional factors must be considered.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`t = \\frac{\\sqrt{v_0^2 + 2gh} - v_0}{g}

v = \\sqrt{v_0^2 + 2gh}

Where:
  t = time of fall (seconds)
  v = impact velocity (m/s)
  v_0 = initial velocity (m/s), positive downward, negative upward
  g = acceleration due to gravity (m/s²), positive
  h = height (meters), vertical distance fallen`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem: Calculate the time and impact velocity of a ball dropped from 45 meters with no initial velocity on Earth.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> Height h = 45 m, initial velocity v₀ = 0 m/s, gravity g = 9.81 m/s².</li>
          <li><strong>Step 1:</strong> Calculate impact velocity: v = √(0² + 2 × 9.81 × 45) = √(882.9) ≈ 29.71 m/s.</li>
          <li><strong>Step 2:</strong> Calculate time of fall: t = (29.71 - 0) / 9.81 ≈ 3.03 seconds.</li>
          <li><strong>Result:</strong> The ball takes approximately 3.03 seconds to hit the ground with an impact velocity of about 29.71 m/s downward.</li>
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
        formula:
          "t = (√(v₀² + 2gh) - v₀) / g,  v = √(v₀² + 2gh)",
        variables: [
          { symbol: "t", description: "Time of fall (seconds)" },
          { symbol: "v", description: "Impact velocity (m/s)" },
          { symbol: "v₀", description: "Initial velocity (m/s), positive downward" },
          { symbol: "g", description: "Acceleration due to gravity (m/s²)" },
          { symbol: "h", description: "Height (meters)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the fall time and impact velocity of a ball dropped from 45 meters on Earth with zero initial velocity.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate impact velocity using v = √(v₀² + 2gh) = √(0 + 2 × 9.81 × 45) ≈ 29.71 m/s.",
          },
          {
            label: "2",
            explanation:
              "Calculate time of fall using t = (v - v₀) / g = (29.71 - 0) / 9.81 ≈ 3.03 seconds.",
          },
        ],
        result:
          "The ball takes approximately 3.03 seconds to hit the ground with an impact velocity of about 29.71 m/s downward.",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "Orbit" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "FlaskConical" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "Waves" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "Atom" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "Zap" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "Zap" },
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