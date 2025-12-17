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

export default function SnellsLawCriticalAngleCalculator() {
  // Inputs: n1 (incident medium refractive index), n2 (refracted medium refractive index), angle of incidence (degrees)
  const [inputs, setInputs] = useState({
    n1: "",
    n2: "",
    angleIncidence: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  // None needed beyond refractive indices and angles

  // Calculation logic in useMemo
  const results = useMemo(() => {
    const n1 = parseFloat(inputs.n1);
    const n2 = parseFloat(inputs.n2);
    const angleIncidence = parseFloat(inputs.angleIncidence);

    // Validation
    if (
      isNaN(n1) ||
      isNaN(n2) ||
      isNaN(angleIncidence) ||
      n1 <= 0 ||
      n2 <= 0 ||
      angleIncidence < 0 ||
      angleIncidence > 90
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid positive inputs",
        subtext: "Refractive indices must be &gt; 0; angle between 0° and 90°",
        warning: null,
        formulaUsed: null,
      };
    }

    // Snell's Law: n1 * sin(θ1) = n2 * sin(θ2)
    // Calculate angle of refraction θ2 in degrees
    // sin(θ2) = (n1 / n2) * sin(θ1)
    const sinTheta1 = Math.sin((angleIncidence * Math.PI) / 180);
    const ratio = n1 / n2;
    const sinTheta2 = ratio * sinTheta1;

    let angleRefraction: number | null = null;
    let warning: string | null = null;

    if (sinTheta2 > 1) {
      // Total internal reflection occurs, no refraction angle
      warning =
        "Total internal reflection occurs: angle of incidence &gt; critical angle.";
      angleRefraction = null;
    } else {
      angleRefraction = Math.asin(sinTheta2) * (180 / Math.PI);
    }

    // Critical angle θc (only defined if n1 &gt; n2)
    // sin(θc) = n2 / n1
    let criticalAngle: number | null = null;
    if (n1 > n2) {
      const sinCritical = n2 / n1;
      if (sinCritical <= 1) {
        criticalAngle = Math.asin(sinCritical) * (180 / Math.PI);
      }
    }

    // Format outputs
    const formatAngle = (val: number) =>
      val < 0.001 || val > 10000 ? val.toExponential(4) + "°" : val.toFixed(4) + "°";

    const angleRefractionDisplay =
      angleRefraction === null ? "N/A" : formatAngle(angleRefraction);
    const criticalAngleDisplay =
      criticalAngle === null ? "N/A" : formatAngle(criticalAngle);

    return {
      value: (
        <>
          <div>
            <strong>Angle of Refraction:</strong> {angleRefractionDisplay}
          </div>
          <div className="mt-2">
            <strong>Critical Angle:</strong> {criticalAngleDisplay}
          </div>
        </>
      ),
      label: "Results (degrees)",
      subtext:
        "Angle of refraction calculated using Snell's Law. Critical angle for total internal reflection.",
      warning,
      formulaUsed: "n₁ sin(θ₁) = n₂ sin(θ₂); sin(θc) = n₂ / n₁",
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is Snell’s Law and why is it important?",
      answer:
        "Snell’s Law describes how light bends, or refracts, when passing between two media with different refractive indices. It is fundamental in optics and helps us understand lenses, prisms, and fiber optics. Engineers and scientists use it to design optical devices and study natural phenomena like rainbows.",
    },
    {
      question: "What is the critical angle and when does it occur?",
      answer:
        "The critical angle is the minimum angle of incidence above which total internal reflection occurs, meaning light reflects entirely within the first medium instead of refracting. It only exists when light travels from a medium with a higher refractive index to a lower one, such as from water to air. This principle is essential in fiber optic communication.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="n1" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Refractive Index n₁ (Incident Medium)
          </Label>
          <Input
            id="n1"
            type="number"
            min="0.0001"
            step="any"
            placeholder="e.g. 1.00 (air)"
            value={inputs.n1}
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
            min="0.0001"
            step="any"
            placeholder="e.g. 1.33 (water)"
            value={inputs.n2}
            onChange={(e) => handleInputChange("n2", e.target.value)}
            aria-describedby="n2-desc"
          />
          <p id="n2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Must be &gt; 0
          </p>
        </div>

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
            value={inputs.angleIncidence}
            onChange={(e) => handleInputChange("angleIncidence", e.target.value)}
            aria-describedby="angleIncidence-desc"
          />
          <p id="angleIncidence-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Must be between 0° and 90°
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
          type="button"
          aria-label="Calculate Snell's Law and Critical Angle"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ n1: "", n2: "", angleIncidence: "" })}
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
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white">
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
              <strong>Science Fact:</strong> The critical angle is crucial in fiber optics, enabling light to be guided with minimal loss through cables.
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
          Snell’s Law governs how light bends when it passes from one transparent medium to another, such as from air into water or glass. This bending occurs because light travels at different speeds in different materials, characterized by their refractive indices. The law mathematically relates the angle of incidence and the angle of refraction through the refractive indices of the two media.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The critical angle is a special angle of incidence beyond which light cannot pass into the second medium and instead reflects entirely within the first medium. This phenomenon, called total internal reflection, is the principle behind fiber optic cables and many optical devices.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps students, educators, and professionals quickly determine the angle of refraction and critical angle for any two media, facilitating deeper understanding and practical application in optics, engineering, and physics.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Snell's Law:
n₁ * sin(θ₁) = n₂ * sin(θ₂)

Where:
  n₁ = Refractive index of incident medium
  n₂ = Refractive index of refracted medium
  θ₁ = Angle of incidence (degrees)
  θ₂ = Angle of refraction (degrees)

Critical Angle (θc) for total internal reflection:
sin(θc) = n₂ / n₁  (only if n₁ &gt; n₂)

If θ₁ &gt; θc, total internal reflection occurs.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem involving light passing from water into air.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> n₁ = 1.33 (water), n₂ = 1.00 (air), angle of incidence θ₁ = 50°
          </li>
          <li>
            <strong>Step 1:</strong> Calculate sin(θ₂) = (n₁ / n₂) * sin(θ₁) = (1.33 / 1.00) * sin(50°) ≈ 1.33 * 0.7660 = 1.018
          </li>
          <li>
            <strong>Step 2:</strong> Since sin(θ₂) &gt; 1, refraction is impossible; total internal reflection occurs.
          </li>
          <li>
            <strong>Step 3:</strong> Calculate critical angle θc = arcsin(n₂ / n₁) = arcsin(1.00 / 1.33) ≈ 48.75°
          </li>
          <li>
            <strong>Result:</strong> Because θ₁ = 50° &gt; θc = 48.75°, light reflects entirely inside water.
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
          { symbol: "n₁", description: "Refractive index of incident medium" },
          { symbol: "n₂", description: "Refractive index of refracted medium" },
          { symbol: "θ₁", description: "Angle of incidence (degrees)" },
          { symbol: "θ₂", description: "Angle of refraction (degrees)" },
          { symbol: "θc", description: "Critical angle for total internal reflection (degrees)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Light traveling from water (n₁ = 1.33) into air (n₂ = 1.00) at an incidence angle of 50°.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate sin(θ₂) = (n₁ / n₂) * sin(θ₁) = 1.33 * sin(50°) ≈ 1.018, which is &gt; 1, so no refraction.",
          },
          {
            label: "2",
            explanation:
              "Calculate critical angle θc = arcsin(n₂ / n₁) = arcsin(1.00 / 1.33) ≈ 48.75°.",
          },
          {
            label: "3",
            explanation:
              "Since θ₁ = 50° &gt; θc = 48.75°, total internal reflection occurs.",
          },
        ],
        result:
          "Light does not refract but reflects entirely inside water due to total internal reflection.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
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