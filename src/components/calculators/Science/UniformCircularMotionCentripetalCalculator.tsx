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
  // Inputs:
  // User can calculate centripetal force (F_c), centripetal acceleration (a_c), velocity (v), or period (T)
  // Given the other parameters.
  // Variables:
  // r = radius (m)
  // m = mass (kg)
  // v = velocity (m/s)
  // T = period (s)
  // F_c = centripetal force (N)
  // a_c = centripetal acceleration (m/s²)

  // We allow user to select which variable to calculate, and input the others.

  const [inputs, setInputs] = useState<{
    calculateFor: "Fc" | "ac" | "v" | "T";
    mass?: string;
    radius?: string;
    velocity?: string;
    period?: string;
  }>({
    calculateFor: "Fc",
    mass: "",
    radius: "",
    velocity: "",
    period: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  const g = 9.81; // m/s² (not directly needed here but for reference)

  // Calculation logic in useMemo
  const results = useMemo(() => {
    const { calculateFor, mass, radius, velocity, period } = inputs;

    // Parse inputs to floats
    const m = mass ? parseFloat(mass) : NaN;
    const r = radius ? parseFloat(radius) : NaN;
    const v = velocity ? parseFloat(velocity) : NaN;
    const T = period ? parseFloat(period) : NaN;

    // Validation helper
    const isValidPositive = (x: number) => !isNaN(x) && x > 0;

    // Prepare output object
    let value = "Waiting...";
    let label = "";
    let subtext = "";
    let warning: string | null = null;
    let formulaUsed: string | null = null;

    // Calculation and validation per case
    if (calculateFor === "Fc") {
      // Calculate centripetal force: F_c = m * v² / r
      if (!isValidPositive(m)) {
        warning = "Mass must be a positive number.";
      } else if (!isValidPositive(v)) {
        warning = "Velocity must be a positive number.";
      } else if (!isValidPositive(r)) {
        warning = "Radius must be a positive number.";
      } else {
        const Fc = (m * v * v) / r; // Newtons (N)
        const displayVal =
          Fc > 10000 || Fc < 0.001 ? Fc.toExponential(4) : Fc.toFixed(4);
        value = `${displayVal} N`;
        label = "Centripetal Force";
        subtext = "Force required to keep the object moving in a circle";
        formulaUsed = "F_c = m × v² / r";
      }
    } else if (calculateFor === "ac") {
      // Calculate centripetal acceleration: a_c = v² / r
      if (!isValidPositive(v)) {
        warning = "Velocity must be a positive number.";
      } else if (!isValidPositive(r)) {
        warning = "Radius must be a positive number.";
      } else {
        const ac = (v * v) / r; // m/s²
        const displayVal =
          ac > 10000 || ac < 0.001 ? ac.toExponential(4) : ac.toFixed(4);
        value = `${displayVal} m/s²`;
        label = "Centripetal Acceleration";
        subtext = "Acceleration directed towards the center of the circle";
        formulaUsed = "a_c = v² / r";
      }
    } else if (calculateFor === "v") {
      // Calculate velocity: v = 2πr / T or v = sqrt(F_c * r / m)
      // We require radius and either period or force & mass
      if (isValidPositive(r) && isValidPositive(T)) {
        // Use v = 2πr / T
        const velocityCalc = (2 * Math.PI * r) / T;
        const displayVal =
          velocityCalc > 10000 || velocityCalc < 0.001
            ? velocityCalc.toExponential(4)
            : velocityCalc.toFixed(4);
        value = `${displayVal} m/s`;
        label = "Velocity (from period)";
        subtext = "Speed of the object along the circular path";
        formulaUsed = "v = 2πr / T";
      } else if (isValidPositive(r) && isValidPositive(m) && !isNaN(inputs.mass) && !isNaN(inputs.radius) && !isNaN(inputs.velocity) && !isNaN(inputs.period)) {
        // If force is given (not input here), can't calculate velocity from force here
        warning =
          "To calculate velocity, provide radius and period (T).";
      } else {
        warning = "Radius and period (T) must be positive numbers.";
      }
    } else if (calculateFor === "T") {
      // Calculate period: T = 2πr / v
      if (!isValidPositive(r)) {
        warning = "Radius must be a positive number.";
      } else if (!isValidPositive(v)) {
        warning = "Velocity must be a positive number.";
      } else {
        const periodCalc = (2 * Math.PI * r) / v; // seconds
        const displayVal =
          periodCalc > 10000 || periodCalc < 0.001
            ? periodCalc.toExponential(4)
            : periodCalc.toFixed(4);
        value = `${displayVal} s`;
        label = "Period";
        subtext = "Time taken for one complete revolution";
        formulaUsed = "T = 2πr / v";
      }
    } else {
      warning = "Select a variable to calculate.";
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is uniform circular motion and why is centripetal force important?",
      answer:
        "Uniform circular motion occurs when an object moves in a circle at a constant speed. Although the speed is constant, the direction changes continuously, causing acceleration towards the center of the circle. This acceleration requires a force called centripetal force, which keeps the object moving along the circular path instead of flying off tangentially.",
    },
    {
      question: "How is the period related to velocity and radius in circular motion?",
      answer:
        "The period (T) is the time taken for one complete revolution around the circle. It is related to velocity (v) and radius (r) by the formula T = 2πr / v. This means that for a fixed radius, increasing velocity decreases the period, making the object complete revolutions faster.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Select variable to calculate */}
      <div>
        <Label htmlFor="calculateFor" className="mb-1 font-semibold">
          Calculate for:
        </Label>
        <Select
          value={inputs.calculateFor}
          onValueChange={(val) => handleInputChange("calculateFor", val)}
          id="calculateFor"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Fc">Centripetal Force (F_c)</SelectItem>
            <SelectItem value="ac">Centripetal Acceleration (a_c)</SelectItem>
            <SelectItem value="v">Velocity (v)</SelectItem>
            <SelectItem value="T">Period (T)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs based on selection */}
      {(inputs.calculateFor === "Fc" || inputs.calculateFor === "ac" || inputs.calculateFor === "v" || inputs.calculateFor === "T") && (
        <>
          {/* Mass input only if needed */}
          {(inputs.calculateFor === "Fc" || inputs.calculateFor === "v") && (
            <div>
              <Label htmlFor="mass" className="mb-1 font-semibold">
                Mass (kg)
              </Label>
              <Input
                type="number"
                id="mass"
                placeholder="e.g. 5"
                value={inputs.mass || ""}
                onChange={(e) => handleInputChange("mass", e.target.value)}
                min="0"
                step="any"
              />
            </div>
          )}

          {/* Radius input always needed except for ac (needs radius) */}
          {(inputs.calculateFor === "Fc" ||
            inputs.calculateFor === "ac" ||
            inputs.calculateFor === "v" ||
            inputs.calculateFor === "T") && (
            <div>
              <Label htmlFor="radius" className="mb-1 font-semibold">
                Radius (m)
              </Label>
              <Input
                type="number"
                id="radius"
                placeholder="e.g. 2"
                value={inputs.radius || ""}
                onChange={(e) => handleInputChange("radius", e.target.value)}
                min="0"
                step="any"
              />
            </div>
          )}

          {/* Velocity input if needed */}
          {(inputs.calculateFor === "Fc" ||
            inputs.calculateFor === "ac" ||
            inputs.calculateFor === "T") && (
            <div>
              <Label htmlFor="velocity" className="mb-1 font-semibold">
                Velocity (m/s)
              </Label>
              <Input
                type="number"
                id="velocity"
                placeholder="e.g. 10"
                value={inputs.velocity || ""}
                onChange={(e) => handleInputChange("velocity", e.target.value)}
                min="0"
                step="any"
              />
            </div>
          )}

          {/* Period input if needed */}
          {inputs.calculateFor === "v" && (
            <div>
              <Label htmlFor="period" className="mb-1 font-semibold">
                Period (s)
              </Label>
              <Input
                type="number"
                id="period"
                placeholder="e.g. 4"
                value={inputs.period || ""}
                onChange={(e) => handleInputChange("period", e.target.value)}
                min="0"
                step="any"
              />
            </div>
          )}
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              calculateFor: "Fc",
              mass: "",
              radius: "",
              velocity: "",
              period: "",
            })
          }
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
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
              <strong>Science Fact:</strong> Always check your units (e.g., convert
              grams to kg for physics formulas). Radius must be in meters, mass in
              kilograms, velocity in meters per second, and period in seconds.
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
          Understanding Uniform Circular Motion Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Uniform circular motion describes the movement of an object traveling at a
          constant speed along a circular path. Despite the constant speed, the
          object's velocity vector continuously changes direction, resulting in a
          centripetal acceleration directed towards the center of the circle. This
          acceleration requires a centripetal force to maintain the circular motion.
          This calculator helps you find key parameters such as centripetal force,
          acceleration, velocity, and period based on known values.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The concept is fundamental in physics and engineering, applied in designing
          roller coasters, vehicle turning dynamics, satellite orbits, and many
          mechanical systems where objects follow curved paths. Understanding these
          parameters ensures safety and efficiency in such applications.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always ensure your input values use consistent SI units: mass in kilograms,
          radius in meters, velocity in meters per second, and time in seconds. This
          consistency is crucial for accurate calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Centripetal Force: F_c = m × v² / r
Centripetal Acceleration: a_c = v² / r
Velocity: v = 2πr / T
Period: T = 2πr / v

Where:
  F_c = centripetal force (Newtons, N)
  m = mass (kilograms, kg)
  v = velocity (meters per second, m/s)
  r = radius of circular path (meters, m)
  a_c = centripetal acceleration (meters per second squared, m/s²)
  T = period (seconds, s)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the centripetal force formula.
          Suppose a 2 kg object moves in a circle of radius 3 meters at a velocity of
          4 m/s. We want to find the centripetal force acting on the object.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> m = 2 kg, r = 3 m, v = 4 m/s
          </li>
          <li>
            <strong>Step 1:</strong> Use the formula F_c = m × v² / r
          </li>
          <li>
            <strong>Step 2:</strong> Calculate v² = 4² = 16 m²/s²
          </li>
          <li>
            <strong>Step 3:</strong> Calculate F_c = 2 × 16 / 3 = 32 / 3 ≈ 10.6667 N
          </li>
          <li>
            <strong>Result:</strong> The centripetal force is approximately 10.6667
            Newtons.
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
        formula: `F_c = m × v² / r
a_c = v² / r
v = 2πr / T
T = 2πr / v`,
        variables: [
          { symbol: "F_c", description: "Centripetal force (Newtons, N)" },
          { symbol: "m", description: "Mass (kilograms, kg)" },
          { symbol: "v", description: "Velocity (meters per second, m/s)" },
          { symbol: "r", description: "Radius of circular path (meters, m)" },
          { symbol: "a_c", description: "Centripetal acceleration (m/s²)" },
          { symbol: "T", description: "Period (seconds, s)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the centripetal force on a 2 kg object moving at 4 m/s in a circle of radius 3 m.",
        steps: [
          {
            label: "1",
            explanation: "Identify known values: m = 2 kg, v = 4 m/s, r = 3 m.",
          },
          {
            label: "2",
            explanation: "Apply formula: F_c = m × v² / r = 2 × 16 / 3.",
          },
          {
            label: "3",
            explanation: "Calculate: F_c ≈ 10.6667 N.",
          },
        ],
        result: "Centripetal force is approximately 10.6667 Newtons.",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
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