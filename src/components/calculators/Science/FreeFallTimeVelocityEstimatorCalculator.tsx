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

const g = 9.81; // acceleration due to gravity in m/s²

export default function FreeFallTimeVelocityEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    height: "", // in meters
    initialVelocity: "0", // in m/s, default 0 for free fall
    airResistance: "No", // Yes/No
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Parse inputs safely
    const height = parseFloat(inputs.height);
    const initialVelocity = parseFloat(inputs.initialVelocity);
    const airResistance = inputs.airResistance === "Yes";

    // Validation
    if (isNaN(height) || height <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Height must be a positive number (m).",
        formulaUsed: null,
      };
    }
    if (isNaN(initialVelocity)) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Initial velocity must be a number (m/s).",
        formulaUsed: null,
      };
    }
    if (airResistance) {
      return {
        value: "N/A",
        label: "Air resistance complicates calculations.",
        subtext: "This estimator assumes no air resistance for accuracy.",
        warning: "Air resistance is not accounted for in this model.",
        formulaUsed: null,
      };
    }

    // Free fall formulas (no air resistance)
    // Time to fall from height h with initial velocity v0 downward:
    // Using equation: h = v0 * t + 0.5 * g * t²
    // Solve quadratic: 0.5 * g * t² + v0 * t - h = 0
    // t = [-v0 + sqrt(v0² + 2gh)] / g (taking positive root)
    const discriminant = initialVelocity * initialVelocity + 2 * g * height;
    if (discriminant < 0) {
      return {
        value: "N/A",
        label: "No real solution for given inputs.",
        subtext: "Check initial velocity and height values.",
        warning: "Discriminant is negative; invalid inputs.",
        formulaUsed: null,
      };
    }
    const time = (-initialVelocity + Math.sqrt(discriminant)) / g;

    // Velocity at impact: v = v0 + g * t
    const velocity = initialVelocity + g * time;

    // Format results with units and scientific notation if needed
    const timeStr = time < 0.001 || time > 1e4 ? time.toExponential(4) : time.toFixed(4);
    const velocityStr = velocity < 0.001 || velocity > 1e4 ? velocity.toExponential(4) : velocity.toFixed(4);

    return {
      value: `${timeStr} s / ${velocityStr} m/s`,
      label: "Time to fall / Impact velocity",
      subtext: "Assuming no air resistance and downward initial velocity.",
      warning: null,
      formulaUsed: "t = [-v₀ + √(v₀² + 2gh)] / g, v = v₀ + gt",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What assumptions does this free-fall estimator make?",
      answer:
        "This estimator assumes that the object is falling under Earth's gravity with no air resistance. It also assumes a constant gravitational acceleration of 9.81 m/s² and that the initial velocity is directed downward. Air resistance and other forces are neglected, so results are most accurate for dense objects falling short distances in air.",
    },
    {
      question: "Can I input an initial upward velocity?",
      answer:
        "This tool is designed for initial downward velocities or zero initial velocity. If you input a positive initial velocity (upward), the formula may not yield a valid fall time because the object first moves upward before falling. For upward throws, more complex motion equations are needed.",
    },
    {
      question: "Why is air resistance not included in the calculations?",
      answer:
        "Air resistance depends on many factors like shape, size, and velocity, making the calculations complex and requiring numerical methods. This estimator focuses on ideal free-fall physics to provide quick, educational insights. For precise modeling with air resistance, specialized simulations are recommended.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="height" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-5 h-5 text-blue-600" /> Height (m)
          </Label>
          <Input
            id="height"
            type="number"
            min="0"
            step="any"
            placeholder="Enter height in meters"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">Height from which the object is dropped/falls.</p>
        </div>

        <div>
          <Label htmlFor="initialVelocity" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-5 h-5 text-yellow-600" /> Initial Velocity (m/s)
          </Label>
          <Input
            id="initialVelocity"
            type="number"
            step="any"
            placeholder="0 for free fall"
            value={inputs.initialVelocity}
            onChange={(e) => handleInputChange("initialVelocity", e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">Initial downward velocity. Use 0 if dropped.</p>
        </div>

        <div>
          <Label htmlFor="airResistance" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-5 h-5 text-cyan-600" /> Air Resistance
          </Label>
          <Select
            value={inputs.airResistance}
            onValueChange={(value) => handleInputChange("airResistance", value)}
          >
            <SelectTrigger id="airResistance" className="w-full">
              <SelectValue placeholder="Select air resistance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 mt-1">Select if air resistance should be considered (not supported).</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; useMemo updates automatically
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ height: "", initialVelocity: "0", airResistance: "No" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Free-Fall Time/Velocity Estimator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Free fall describes the motion of an object falling solely under the influence of gravity, with no other forces acting on it, such as air resistance. This estimator calculates the time it takes for an object to fall from a specified height and its velocity upon impact, assuming a constant gravitational acceleration of 9.81 m/s². The initial velocity can be set to zero if the object is simply dropped, or to a positive value if it is already moving downward.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          It is important to note that air resistance is neglected in this model, which is a reasonable approximation for dense objects falling short distances. However, for lightweight or large objects, air resistance can significantly affect the fall time and velocity. This tool is designed primarily for educational purposes to illustrate the fundamental physics of free fall.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculations are based on classical mechanics equations derived from Newton's laws of motion. By inputting the height and initial velocity, users can understand how these variables influence the fall duration and impact speed. This knowledge is foundational in physics and engineering applications.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Given:
  h = height (m)
  v₀ = initial velocity downward (m/s)
  g = acceleration due to gravity = 9.81 m/s²
  t = time to fall (s)
  v = velocity at impact (m/s)

Equation of motion:
  h = v₀ * t + 0.5 * g * t²

Solve quadratic for t:
  0.5 * g * t² + v₀ * t - h = 0

Time to fall:
  t = [-v₀ + √(v₀² + 2gh)] / g

Impact velocity:
  v = v₀ + g * t`}
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">

          <li>
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Free%20Fall%20Physics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Free Fall Physics - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Free Fall Physics, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Free%20Fall%20Physics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Free Fall Physics - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Free Fall Physics at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://www.physicsclassroom.com/search?q=Free%20Fall%20Physics" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Free Fall Physics - The Physics Classroom
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Explore student-friendly tutorials, interactives, and concept builders related to Free Fall Physics designed to improve understanding of physics principles.
            </p>
          </li>
          <li>
            <a href="http://hyperphysics.phy-astr.gsu.edu/hbase/hph.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Free Fall Physics - HyperPhysics
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Navigate the HyperPhysics concept map to find concise summaries and calculation examples for Free Fall Physics.
            </p>
          </li>
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
          "t = [-v₀ + √(v₀² + 2gh)] / g, v = v₀ + gt",
        variables: [
          { symbol: "h", description: "Height from which the object falls (meters)" },
          { symbol: "v₀", description: "Initial downward velocity (meters per second)" },
          { symbol: "g", description: "Acceleration due to gravity (9.81 m/s²)" },
          { symbol: "t", description: "Time to fall (seconds)" },
          { symbol: "v", description: "Velocity at impact (meters per second)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the time and impact velocity of an object dropped from a height of 20 meters with no initial velocity.",
        steps: [
          {
            label: "1",
            explanation:
              "Input height h = 20 m and initial velocity v₀ = 0 m/s into the formula.",
          },
          {
            label: "2",
            explanation:
              "Calculate time: t = [-0 + √(0² + 2 * 9.81 * 20)] / 9.81 ≈ 2.02 s.",
          },
          {
            label: "3",
            explanation:
              "Calculate velocity: v = 0 + 9.81 * 2.02 ≈ 19.82 m/s.",
          },
        ],
        result: "The object takes approximately 2.02 seconds to fall and hits the ground at about 19.82 m/s.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Capacitor/Inductor Reactance Calculator", url: "/science/reactance-capacitor-inductor-educational", icon: "⚡" },
        { title: "ppm / ppb Concentration Converter", url: "/science/ppm-ppb-concentration-converter", icon: "🧪" },
        { title: "Snell’s Law & Critical Angle Calculator", url: "/science/snells-law-critical-angle", icon: "🌈" },
        { title: "Specific Heat Calculator", url: "/science/specific-heat-q-mc-delta-t", icon: "🔥" },
        { title: "Molar Mass Calculator", url: "/science/molar-mass-calculator", icon: "🧪" },
        { title: "Radioactive Activity Calculator", url: "/science/radioactive-activity-a-lambda-n", icon: "🧪" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "formula", label: "Formula" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References & Resources" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}