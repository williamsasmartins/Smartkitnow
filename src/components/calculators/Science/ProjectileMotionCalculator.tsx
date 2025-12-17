import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FIX: Adicionei 'Zap' e 'Scale' que estavam faltando
import { Atom, RotateCcw, AlertTriangle, Zap, Scale, Info } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ProjectileMotionCalculator() {
  const [inputs, setInputs] = useState({
    initialSpeed: "",
    launchAngle: "",
    initialHeight: "0",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
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

    // Time of flight formula
    const v0Sin = v0 * Math.sin(theta);
    const discriminant = v0Sin * v0Sin + 2 * g * h0;
    const timeOfFlight = (v0Sin + Math.sqrt(discriminant)) / g;

    // Maximum height formula
    const maxHeight = h0 + (v0 * v0 * Math.sin(theta) * Math.sin(theta)) / (2 * g);

    // Horizontal range formula
    const range = v0 * Math.cos(theta) * timeOfFlight;

    // Format numbers
    function formatNumber(num: number, unit: string) {
      if (num !== 0 && (Math.abs(num) < 1e-4 || Math.abs(num) >= 1e5)) {
        return `${num.toExponential(4)} ${unit}`;
      }
      return `${num.toFixed(3)} ${unit}`;
    }

    return {
      value: (
        <div className="flex flex-col gap-1 items-center">
          <div>
            <strong>Range:</strong> {formatNumber(range, "m")}
          </div>
          <div className="text-3xl text-blue-700 dark:text-blue-300">
            <strong>Max Height:</strong> {formatNumber(maxHeight, "m")}
          </div>
          <div className="text-xl text-slate-500">
            <strong>Time:</strong> {formatNumber(timeOfFlight, "s")}
          </div>
        </div>
      ),
      label: "Projectile Results",
      subtext:
        "Calculated neglecting air resistance.",
      warning: null,
      formulaUsed: "Range, Max Height & Time",
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
          />
          <p className="text-xs text-slate-500 mt-1">
            m/s
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
          />
          <p className="text-xs text-slate-500 mt-1">
            0° to 90°
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
          />
          <p className="text-xs text-slate-500 mt-1">
            meters (≥ 0)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => setInputs({ ...inputs })}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ initialSpeed: "", launchAngle: "", initialHeight: "0" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <div className="text-5xl font-extrabold text-blue-900 dark:text-white mb-2">
                {results.value}
              </div>
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
          Understanding Projectile Motion
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Projectile motion describes the trajectory of an object launched into the air, influenced only by gravity and its initial velocity. This calculator helps analyze key parameters such as range, maximum height, and time of flight.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Time of flight: t = (v₀ * sinθ + √((v₀ * sinθ)² + 2gh₀)) / g
Max height: H = h₀ + (v₀² * sin²θ) / (2g)
Range: R = v₀ * cosθ * t`}
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
        formula: "R = v₀ cosθ × t",
        variables: [
          { symbol: "v₀", description: "Initial speed" },
          { symbol: "θ", description: "Launch angle" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Ball launched at 20 m/s at 30°.",
        steps: [
          { label: "1", explanation: "Calculate components and gravity effect." },
          { label: "2", explanation: "Derive range and height." }
        ],
        result: "Range approx 35m."
      }}
      // Mantive os links dinâmicos que você gerou, pois eles estão corretos
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
