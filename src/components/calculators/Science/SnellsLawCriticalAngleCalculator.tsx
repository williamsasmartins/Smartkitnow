import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import {
  Atom,
  Info,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SnellsLawCriticalAngleCalculator() {
  // Inputs:
  // n1: refractive index of medium 1 (incident medium)
  // n2: refractive index of medium 2 (refracted medium)
  // angleIncidence: angle of incidence in degrees (optional, for refraction angle calculation)
  // mode: "refraction" or "criticalAngle"
  const [inputs, setInputs] = useState<{
    n1?: string;
    n2?: string;
    angleIncidence?: string;
    mode: "refraction" | "criticalAngle";
  }>({
    mode: "refraction",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  // None needed for Snell's Law directly, but we keep scientific rigor in formatting.

  // Calculation logic in useMemo
  const results = useMemo(() => {
    const n1 = parseFloat(inputs.n1 ?? "");
    const n2 = parseFloat(inputs.n2 ?? "");
    const angleIncidence = parseFloat(inputs.angleIncidence ?? "");
    const mode = inputs.mode;

    // Validation
    if (
      isNaN(n1) ||
      isNaN(n2) ||
      n1 <= 0 ||
      n2 <= 0 ||
      (mode === "refraction" && (isNaN(angleIncidence) || angleIncidence < 0 || angleIncidence > 90))
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid positive inputs",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Refraction angle calculation using Snell's Law:
    // n1 * sin(theta1) = n2 * sin(theta2)
    // => theta2 = arcsin((n1/n2) * sin(theta1))
    // Angles in degrees for input/output, convert to radians for Math.sin/asin

    if (mode === "refraction") {
      // Check if total internal reflection occurs (only if n1 > n2)
      const sinTheta2 = (n1 / n2) * Math.sin((angleIncidence * Math.PI) / 180);
      if (sinTheta2 > 1) {
        // Total internal reflection occurs, no refraction angle
        return {
          value: "N/A",
          label: "Total Internal Reflection occurs",
          subtext:
            "No refraction angle because sin(θ₂) &gt; 1, light is totally internally reflected.",
          warning:
            "Total internal reflection occurs when light tries to pass from a denser to a rarer medium at a large angle.",
          formulaUsed: "n₁ sin(θ₁) = n₂ sin(θ₂)",
        };
      }
      const theta2Rad = Math.asin(sinTheta2);
      const theta2Deg = (theta2Rad * 180) / Math.PI;

      // Format output: angle in degrees with 4 decimals
      const displayVal = theta2Deg.toFixed(4) + "°";

      return {
        value: displayVal,
        label: "Angle of Refraction (θ₂)",
        subtext: `Calculated using Snell's Law with n₁ = ${n1}, n₂ = ${n2}, θ₁ = ${angleIncidence}°`,
        warning: null,
        formulaUsed: "n₁ sin(θ₁) = n₂ sin(θ₂)",
      };
    }

    // Critical angle calculation:
    // Only defined if n1 > n2 (light from denser to rarer medium)
    // sin(θc) = n₂ / n₁
    if (mode === "criticalAngle") {
      if (n1 <= n2) {
        return {
          value: "N/A",
          label: "Critical angle undefined",
          subtext:
            "Critical angle exists only when n₁ &gt; n₂ (light from denser to rarer medium).",
          warning:
            "No total internal reflection possible if n₁ &lt;= n₂.",
          formulaUsed: "sin(θc) = n₂ / n₁",
        };
      }
      const sinThetaC = n2 / n1;
      // sinThetaC must be ≤ 1, but since n1 > n2, it should be.
      const thetaCRad = Math.asin(sinThetaC);
      const thetaCDeg = (thetaCRad * 180) / Math.PI;

      const displayVal = thetaCDeg.toFixed(4) + "°";

      return {
        value: displayVal,
        label: "Critical Angle (θc)",
        subtext: `Calculated for n₁ = ${n1}, n₂ = ${n2}`,
        warning: null,
        formulaUsed: "sin(θc) = n₂ / n₁",
      };
    }

    return {
      value: "Waiting...",
      label: "Select calculation mode",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is Snell’s Law and why is it important?",
      answer:
        "Snell’s Law describes how light bends, or refracts, when passing between materials with different refractive indices. It is fundamental in optics and is used to design lenses, glasses, and fiber optics. Understanding this law helps explain phenomena like rainbows and the focusing of light in cameras.",
    },
    {
      question: "What is the critical angle and when does total internal reflection occur?",
      answer:
        "The critical angle is the minimum angle of incidence above which light cannot pass through the boundary and is instead completely reflected inside the denser medium. Total internal reflection occurs only when light travels from a medium with a higher refractive index to one with a lower refractive index, such as from water to air.",
    },
    {
      question: "How do I know if total internal reflection will happen?",
      answer:
        "Total internal reflection happens when the angle of incidence exceeds the critical angle for the two media involved. If the calculated sine of the refraction angle is greater than 1, it means refraction is impossible and total internal reflection occurs. This principle is used in fiber optic cables to keep light trapped inside.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Mode selector */}
      <div>
        <Label htmlFor="mode" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
          Select Calculation Mode
        </Label>
        <Select
          value={inputs.mode}
          onValueChange={(val) => handleInputChange("mode", val)}
          id="mode"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="refraction">Angle of Refraction</SelectItem>
            <SelectItem value="criticalAngle">Critical Angle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div>
        <Label htmlFor="n1" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
          Refractive Index n₁ (Incident Medium)
        </Label>
        <Input
          id="n1"
          type="number"
          min="0"
          step="any"
          placeholder="e.g., 1.0003 (air)"
          value={inputs.n1 ?? ""}
          onChange={(e) => handleInputChange("n1", e.target.value)}
          aria-describedby="n1-desc"
        />
        <p id="n1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Must be &gt; 0
        </p>
      </div>

      <div>
        <Label htmlFor="n2" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
          Refractive Index n₂ (Refracted Medium)
        </Label>
        <Input
          id="n2"
          type="number"
          min="0"
          step="any"
          placeholder="e.g., 1.33 (water)"
          value={inputs.n2 ?? ""}
          onChange={(e) => handleInputChange("n2", e.target.value)}
          aria-describedby="n2-desc"
        />
        <p id="n2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Must be &gt; 0
        </p>
      </div>

      {inputs.mode === "refraction" && (
        <div>
          <Label
            htmlFor="angleIncidence"
            className="mb-1 font-semibold text-slate-700 dark:text-slate-300"
          >
            Angle of Incidence θ₁ (degrees)
          </Label>
          <Input
            id="angleIncidence"
            type="number"
            min="0"
            max="90"
            step="any"
            placeholder="0 to 90"
            value={inputs.angleIncidence ?? ""}
            onChange={(e) => handleInputChange("angleIncidence", e.target.value)}
            aria-describedby="angleIncidence-desc"
          />
          <p id="angleIncidence-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Must be between 0° and 90°
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting state to current inputs (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mode: "refraction" })}
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
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
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
              <strong>Science Fact:</strong> Refractive indices depend on wavelength and temperature; always use consistent units and conditions.
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
          Understanding Snell’s Law &amp; Critical Angle Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Snell’s Law governs the bending of light as it passes between two media with different refractive indices. It states that the product of the refractive index and the sine of the angle of incidence is constant across the boundary: n₁ sin(θ₁) = n₂ sin(θ₂). This principle explains why objects appear bent or displaced when viewed through water or glass.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The critical angle is a special case that occurs when light travels from a denser medium to a rarer medium. Beyond this angle, light undergoes total internal reflection, meaning it reflects entirely within the denser medium instead of refracting out. This phenomenon is essential in fiber optics and other optical technologies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine either the angle of refraction given an incident angle or the critical angle for total internal reflection, providing a practical tool for students, educators, and professionals working in optics and photonics.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Snell's Law:
n₁ sin(θ₁) = n₂ sin(θ₂)

Where:
  n₁ = Refractive index of incident medium (unitless)
  θ₁ = Angle of incidence (degrees)
  n₂ = Refractive index of refracted medium (unitless)
  θ₂ = Angle of refraction (degrees)

Critical Angle (θc) for total internal reflection:
sin(θc) = n₂ / n₁  (only if n₁ &gt; n₂)

Where:
  θc = Critical angle (degrees)
`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using Snell's Law:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Light passes from air (n₁ = 1.0003) into water (n₂ = 1.33) with an incidence angle θ₁ = 30°.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate sin(θ₂) = (n₁ / n₂) * sin(θ₁) = (1.0003 / 1.33) * sin(30°) ≈ 0.375.
          </li>
          <li>
            <strong>Step 2:</strong> Find θ₂ = arcsin(0.375) ≈ 22.02°.
          </li>
          <li>
            <strong>Result:</strong> The angle of refraction θ₂ is approximately 22.02°.
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
      title="Snell’s Law & Critical Angle Calculator"
      description="Solve optics problems using Snell's Law. Calculate the angle of refraction and the critical angle for total internal reflection."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `n₁ sin(θ₁) = n₂ sin(θ₂)\nsin(θc) = n₂ / n₁ (if n₁ &gt; n₂)`,
        variables: [
          { symbol: "n₁", description: "Refractive index of incident medium (unitless)" },
          { symbol: "θ₁", description: "Angle of incidence (degrees)" },
          { symbol: "n₂", description: "Refractive index of refracted medium (unitless)" },
          { symbol: "θ₂", description: "Angle of refraction (degrees)" },
          { symbol: "θc", description: "Critical angle for total internal reflection (degrees)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Light passes from air (n₁ = 1.0003) into water (n₂ = 1.33) at an incidence angle of 30°.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate sin(θ₂) = (n₁ / n₂) * sin(θ₁) = (1.0003 / 1.33) * sin(30°) ≈ 0.375.",
          },
          {
            label: "2",
            explanation: "Find θ₂ = arcsin(0.375) ≈ 22.02°.",
          },
          {
            label: "3",
            explanation: "The angle of refraction θ₂ is approximately 22.02°.",
          },
        ],
        result: "Angle of refraction θ₂ ≈ 22.02°",
      }}
      relatedCalculators={[
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
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