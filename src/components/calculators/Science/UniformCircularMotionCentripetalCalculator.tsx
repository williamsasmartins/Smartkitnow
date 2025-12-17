import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, RotateCcw, AlertTriangle, Orbit } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const g = 9.81; // m/s², gravitational acceleration constant

export default function UniformCircularMotionCentripetalCalculator() {
  // Inputs: mass (kg), radius (m), velocity (m/s), period (s)
  // User can provide any two of velocity, period, radius + mass to calculate centripetal force and acceleration.
  // We'll require mass and radius, and either velocity or period.
  // If velocity is given, calculate acceleration and force.
  // If period is given, calculate velocity first: v = 2πr / T

  const [inputs, setInputs] = useState({
    mass: "",
    radius: "",
    velocity: "",
    period: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const m = parseFloat(inputs.mass);
    const r = parseFloat(inputs.radius);
    const v = parseFloat(inputs.velocity);
    const T = parseFloat(inputs.period);

    // Validation and warnings
    if (
      isNaN(m) ||
      isNaN(r) ||
      (isNaN(v) && isNaN(T)) ||
      m <= 0 ||
      r <= 0 ||
      (v !== undefined && !isNaN(v) && v <= 0 && T !== undefined && !isNaN(T) && T <= 0)
    ) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Please enter positive numeric values for mass, radius, and either velocity or period.",
        formulaUsed: null,
      };
    }

    // Calculate velocity if period given and velocity not given
    let velocityCalc = v;
    let velocityFromPeriod = false;
    if (isNaN(v) && !isNaN(T) && T > 0) {
      velocityCalc = (2 * Math.PI * r) / T;
      velocityFromPeriod = true;
    }

    if (velocityCalc <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Velocity must be greater than zero.",
        formulaUsed: null,
      };
    }

    // Centripetal acceleration: a = v² / r
    const a = velocityCalc * velocityCalc / r; // m/s²

    // Centripetal force: F = m * a
    const F = m * a; // Newtons (kg·m/s²)

    // Period from velocity if not given
    let periodCalc = T;
    if (isNaN(T) && !isNaN(v) && v > 0) {
      periodCalc = (2 * Math.PI * r) / v;
    }

    // Format numbers with scientific notation if very large/small
    const formatNum = (num: number, unit: string) => {
      if (num === 0) return `0 ${unit}`;
      if (Math.abs(num) < 0.001 || Math.abs(num) > 1e5) {
        return `${num.toExponential(4)} ${unit}`;
      }
      return `${num.toFixed(4)} ${unit}`;
    };

    // Compose result string
    const value = (
      <>
        <div>
          <strong>Centripetal Force (F):</strong> {formatNum(F, "N")}
        </div>
        <div>
          <strong>Centripetal Acceleration (a):</strong> {formatNum(a, "m/s²")}
        </div>
        <div>
          <strong>Velocity (v):</strong> {formatNum(velocityCalc, "m/s")}{" "}
          {velocityFromPeriod && <em>(calculated from period)</em>}
        </div>
        {periodCalc !== undefined && !isNaN(periodCalc) && (
          <div>
            <strong>Period (T):</strong> {formatNum(periodCalc, "s")}
          </div>
        )}
      </>
    );

    return {
      value,
      label: "Results for uniform circular motion",
      subtext:
        "F = m × a, a = v² / r, v = 2πr / T. Units: Newtons (N), meters per second squared (m/s²), meters per second (m/s), seconds (s).",
      warning: null,
      formulaUsed: "F = m × v² / r",
    };
  }, [inputs.mass, inputs.radius, inputs.velocity, inputs.period]);

  const faqs = [
    {
      question: "What is uniform circular motion?",
      answer:
        "Uniform circular motion describes the movement of an object traveling at a constant speed along a circular path. Although the speed is constant, the velocity vector changes direction continuously, resulting in acceleration towards the center of the circle called centripetal acceleration.",
    },
    {
      question: "How is centripetal force calculated?",
      answer:
        "Centripetal force is the net force causing the inward acceleration of an object moving in a circle. It is calculated using the formula F = m × v² / r, where m is mass, v is velocity, and r is the radius of the circular path.",
    },
    {
      question: "Can I calculate velocity if I know the period?",
      answer:
        "Yes. Velocity can be calculated from the period (T) using the formula v = 2πr / T, where r is the radius of the circular path. This calculator automatically computes velocity if you provide the period instead of velocity.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mass" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Atom className="w-4 h-4" /> Mass (m) in kilograms (kg)
          </Label>
          <Input
            id="mass"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 5.0"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
            aria-describedby="mass-desc"
          />
          <p id="mass-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mass of the object in kilograms (kg). Must be &gt; 0.
          </p>
        </div>

        <div>
          <Label htmlFor="radius" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Orbit className="w-4 h-4" /> Radius (r) in meters (m)
          </Label>
          <Input
            id="radius"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 2.5"
            value={inputs.radius}
            onChange={(e) => handleInputChange("radius", e.target.value)}
            aria-describedby="radius-desc"
          />
          <p id="radius-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Radius of the circular path in meters (m). Must be &gt; 0.
          </p>
        </div>

        <div>
          <Label htmlFor="velocity" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Zap className="w-4 h-4" /> Velocity (v) in meters per second (m/s)
          </Label>
          <Input
            id="velocity"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 10.0"
            value={inputs.velocity}
            onChange={(e) => {
              handleInputChange("velocity", e.target.value);
              // Clear period if velocity is entered
              if (e.target.value !== "") setInputs((prev) => ({ ...prev, period: "" }));
            }}
            aria-describedby="velocity-desc"
          />
          <p id="velocity-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter velocity if known. Leave blank to calculate from period.
          </p>
        </div>

        <div>
          <Label htmlFor="period" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-4 h-4" /> Period (T) in seconds (s)
          </Label>
          <Input
            id="period"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 1.57"
            value={inputs.period}
            onChange={(e) => {
              handleInputChange("period", e.target.value);
              // Clear velocity if period is entered
              if (e.target.value !== "") setInputs((prev) => ({ ...prev, velocity: "" }));
            }}
            aria-describedby="period-desc"
          />
          <p id="period-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter period if known. Leave blank to use velocity.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate uniform circular motion"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mass: "", radius: "", velocity: "", period: "" })}
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
              <div className="text-3xl font-extrabold text-blue-900 dark:text-white leading-relaxed space-y-3">
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
          Uniform circular motion occurs when an object moves along a circular path with a constant speed. Although the speed remains constant, the direction of the velocity vector continuously changes, resulting in an acceleration directed towards the center of the circle, known as centripetal acceleration. This acceleration is responsible for changing the direction of the velocity, keeping the object moving in a circle.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The centripetal force is the net force required to keep the object moving in this circular path. It always points towards the center of the circle and is calculated based on the mass of the object, its velocity, and the radius of the circle. This calculator helps you find the centripetal force, acceleration, velocity, or period by inputting known values.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          You can provide either the velocity or the period of the motion along with the mass and radius. The calculator will compute the missing values using the fundamental physics formulas governing uniform circular motion. This tool is ideal for students, educators, and enthusiasts seeking precise and educational calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Centripetal Force:
F = m × a = m × (v² / r)

Velocity (if period known):
v = (2 × π × r) / T

Variables:
m = mass of the object (kg)
r = radius of circular path (m)
v = velocity (m/s)
T = period (s)
a = centripetal acceleration (m/s²)
F = centripetal force (N)`}
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
      title="Uniform Circular Motion Calculator"
      description="Solve for centripetal force and acceleration. Calculate the velocity and period of objects in uniform circular motion."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `F = m × v² / r\nv = 2πr / T`,
        variables: [
          { symbol: "F", description: "Centripetal force in Newtons (N)" },
          { symbol: "m", description: "Mass of the object in kilograms (kg)" },
          { symbol: "v", description: "Velocity in meters per second (m/s)" },
          { symbol: "r", description: "Radius of the circular path in meters (m)" },
          { symbol: "T", description: "Period of one revolution in seconds (s)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A 2 kg object moves in a circle of radius 3 meters with a velocity of 4 m/s. Calculate the centripetal force and acceleration.",
        steps: [
          {
            label: "1",
            explanation: "Calculate centripetal acceleration: a = v² / r = 4² / 3 = 5.3333 m/s²",
          },
          {
            label: "2",
            explanation: "Calculate centripetal force: F = m × a = 2 × 5.3333 = 10.6667 N",
          },
        ],
        result: "The centripetal force is approximately 10.6667 N, and the centripetal acceleration is 5.3333 m/s².",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Snell’s Law & Critical Angle Calculator", url: "/science/snells-law-critical-angle", icon: "🌈" },
        { title: "Dilution Calculator (C₁V₁ = C₂V₂)", url: "/science/dilution-c1v1-c2v2", icon: "🧪" },
        { title: "RC Time Constant Calculator", url: "/science/rc-time-constant-tau-rc", icon: "🧪" },
        { title: "Free-Fall Time/Velocity Estimator", url: "/science/free-fall-time-velocity-estimator", icon: "🧪" },
        { title: "Orbital Period (Kepler) Estimator", url: "/science/orbital-period-kepler-estimator", icon: "🪐" },
        { title: "Density / Specific Gravity Calculator", url: "/science/density-specific-gravity-calculator", icon: "🪐" },
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