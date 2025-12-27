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

export default function SnellsLawCriticalAngleCalculator() {
  // Inputs:
  // n1: refractive index of medium 1 (incident medium)
  // n2: refractive index of medium 2 (refracted medium)
  // angleIncidence: angle of incidence in degrees (optional for critical angle calc)
  // mode: "refraction" or "criticalAngle"
  const [inputs, setInputs] = useState({
    n1: "",
    n2: "",
    angleIncidence: "",
    mode: "refraction",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const n1 = parseFloat(inputs.n1);
    const n2 = parseFloat(inputs.n2);
    const angleIncidence = parseFloat(inputs.angleIncidence);
    const mode = inputs.mode;

    // Validate refractive indices
    if (isNaN(n1) || n1 <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Please enter a valid positive refractive index for medium 1 (n₁).",
        formulaUsed: null,
      };
    }
    if (isNaN(n2) || n2 <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Please enter a valid positive refractive index for medium 2 (n₂).",
        formulaUsed: null,
      };
    }

    if (mode === "refraction") {
      // Calculate angle of refraction using Snell's Law:
      // n₁ * sin(θ₁) = n₂ * sin(θ₂)
      // θ₂ = arcsin((n₁ / n₂) * sin(θ₁))
      if (isNaN(angleIncidence) || angleIncidence < 0 || angleIncidence > 90) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Please enter a valid angle of incidence θ₁ between 0° and 90°.",
          formulaUsed: null,
        };
      }

      const theta1Rad = (angleIncidence * Math.PI) / 180;
      const sinTheta2 = (n1 / n2) * Math.sin(theta1Rad);

      if (sinTheta2 > 1) {
        // Total internal reflection occurs, no refraction angle
        return {
          value: "N/A",
          label: "Total Internal Reflection occurs; no refraction angle.",
          subtext: "sin(θ₂) &gt; 1 means no refracted ray exists.",
          warning: null,
          formulaUsed: "n₁ sin(θ₁) = n₂ sin(θ₂)",
        };
      }

      const theta2Rad = Math.asin(sinTheta2);
      const theta2Deg = (theta2Rad * 180) / Math.PI;

      return {
        value: `${theta2Deg.toFixed(4)}°`,
        label: "Angle of Refraction (θ₂)",
        subtext: `Calculated using Snell's Law: n₁ sin(θ₁) = n₂ sin(θ₂)`,
        warning: null,
        formulaUsed: "θ₂ = arcsin((n₁ / n₂) × sin(θ₁))",
      };
    } else if (mode === "criticalAngle") {
      // Calculate critical angle θc for total internal reflection:
      // θc = arcsin(n₂ / n₁), valid only if n₁ > n₂
      if (n1 <= n2) {
        return {
          value: "N/A",
          label: "Critical angle does not exist when n₁ ≤ n₂.",
          subtext: "Total internal reflection only occurs when light moves from denser to rarer medium.",
          warning: null,
          formulaUsed: "θc = arcsin(n₂ / n₁)",
        };
      }

      const ratio = n2 / n1;
      if (ratio > 1) {
        // Should not happen due to above check, but safe guard
        return {
          value: "N/A",
          label: "Invalid refractive indices for critical angle calculation.",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }

      const thetaCRad = Math.asin(ratio);
      const thetaCDeg = (thetaCRad * 180) / Math.PI;

      return {
        value: `${thetaCDeg.toFixed(4)}°`,
        label: "Critical Angle (θc)",
        subtext:
          "Angle of incidence above which total internal reflection occurs when light passes from medium 1 to medium 2.",
        warning: null,
        formulaUsed: "θc = arcsin(n₂ / n₁)",
      };
    }

    return {
      value: "Waiting...",
      label: "",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Snell’s Law and how is it used in optics?",
      answer:
        "Snell’s Law describes how light bends, or refracts, when passing between two media with different refractive indices. It states that the product of the refractive index and the sine of the angle of incidence equals that of the refracted angle. This law helps calculate the angle of refraction, essential for designing lenses and understanding optical phenomena.",
    },
    {
      question: "What is the critical angle and when does total internal reflection occur?",
      answer:
        "The critical angle is the minimum angle of incidence in a denser medium at which light is completely reflected back, rather than refracted into the less dense medium. Total internal reflection occurs when light tries to pass from a medium with higher refractive index to one with lower refractive index at an angle greater than this critical angle.",
    },
    {
      question: "Can the critical angle be calculated if the refractive index of the second medium is higher?",
      answer:
        "No, the critical angle only exists when light travels from a medium with a higher refractive index to one with a lower refractive index. If the second medium has a higher refractive index, total internal reflection does not occur, and thus no critical angle is defined.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Mode selector */}
      <div>
        <Label htmlFor="mode" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <Waves className="w-5 h-5 text-blue-600" /> Select Calculation Mode
        </Label>
        <Select
          value={inputs.mode}
          onValueChange={(value) => handleInputChange("mode", value)}
          id="mode"
          aria-label="Calculation Mode"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="refraction" aria-label="Calculate angle of refraction">
              Calculate Angle of Refraction
            </SelectItem>
            <SelectItem value="criticalAngle" aria-label="Calculate critical angle">
              Calculate Critical Angle
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div>
        <Label htmlFor="n1" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <Scale className="w-5 h-5 text-indigo-600" /> Refractive Index n₁ (Incident Medium)
        </Label>
        <Input
          id="n1"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 1.0003 (air), 1.33 (water)"
          value={inputs.n1}
          onChange={(e) => handleInputChange("n1", e.target.value)}
          aria-describedby="n1-desc"
        />
        <p id="n1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Must be &gt; 0. Example: Air ≈ 1.0003, Water ≈ 1.33, Glass ≈ 1.5
        </p>
      </div>

      <div>
        <Label htmlFor="n2" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <Scale className="w-5 h-5 text-indigo-600" /> Refractive Index n₂ (Refracted Medium)
        </Label>
        <Input
          id="n2"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 1.33 (water), 1.5 (glass)"
          value={inputs.n2}
          onChange={(e) => handleInputChange("n2", e.target.value)}
          aria-describedby="n2-desc"
        />
        <p id="n2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Must be &gt; 0. Example: Air ≈ 1.0003, Water ≈ 1.33, Glass ≈ 1.5
        </p>
      </div>

      {inputs.mode === "refraction" && (
        <div>
          <Label htmlFor="angleIncidence" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Orbit className="w-5 h-5 text-green-600" /> Angle of Incidence θ₁ (degrees)
          </Label>
          <Input
            id="angleIncidence"
            type="number"
            min="0"
            max="90"
            step="any"
            placeholder="0 to 90 degrees"
            value={inputs.angleIncidence}
            onChange={(e) => handleInputChange("angleIncidence", e.target.value)}
            aria-describedby="angleIncidence-desc"
          />
          <p id="angleIncidence-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter angle between 0° and 90°.
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger recalculation by updating state with current values (noop)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ n1: "", n2: "", angleIncidence: "", mode: "refraction" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
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
          Understanding Snell’s Law &amp; Critical Angle Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Snell’s Law is a fundamental principle in optics that describes how light bends when it passes from one transparent medium to another with a different refractive index. It relates the angle of incidence (θ₁) and the angle of refraction (θ₂) through the refractive indices (n₁ and n₂) of the two media. This calculator helps you determine the angle of refraction or the critical angle for total internal reflection, which occurs when light attempts to move from a denser to a rarer medium.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The critical angle is the minimum angle of incidence above which all light is reflected back into the denser medium, a phenomenon known as total internal reflection. This effect is widely used in fiber optics and other optical technologies. Understanding these concepts is essential for students, educators, and professionals working in physics, engineering, and related fields.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use this tool by selecting the calculation mode, entering the refractive indices of the two media, and providing the angle of incidence if calculating refraction. The results will show the precise angle of refraction or the critical angle, along with explanations and warnings if inputs are invalid or if total internal reflection occurs.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Snell's Law:
n₁ × sin(θ₁) = n₂ × sin(θ₂)

Where:
  n₁ = Refractive index of incident medium (unitless)
  θ₁ = Angle of incidence (degrees)
  n₂ = Refractive index of refracted medium (unitless)
  θ₂ = Angle of refraction (degrees)

Angle of refraction:
θ₂ = arcsin((n₁ / n₂) × sin(θ₁))

Critical angle (for total internal reflection, when n₁ > n₂):
θc = arcsin(n₂ / n₁)

Where:
  θc = Critical angle (degrees)

Note:
- Angles are measured from the normal (perpendicular) to the interface.
- Total internal reflection occurs only if n₁ &gt; n₂ and θ₁ &gt; θc.`}
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
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Snell's%20Law%20Refraction" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Snell's Law Refraction - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Snell's Law Refraction, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Snell's%20Law%20Refraction" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Snell's Law Refraction - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Snell's Law Refraction at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://www.physicsclassroom.com/search?q=Snell's%20Law%20Refraction" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Snell's Law Refraction - The Physics Classroom
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Explore student-friendly tutorials, interactives, and concept builders related to Snell's Law Refraction designed to improve understanding of physics principles.
            </p>
          </li>
          <li>
            <a href="http://hyperphysics.phy-astr.gsu.edu/hbase/hph.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Snell's Law Refraction - HyperPhysics
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Navigate the HyperPhysics concept map to find concise summaries and calculation examples for Snell's Law Refraction.
            </p>
          </li>
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
        formula: `n₁ × sin(θ₁) = n₂ × sin(θ₂)
θ₂ = arcsin((n₁ / n₂) × sin(θ₁))
θc = arcsin(n₂ / n₁) (if n₁ &gt; n₂)`,
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
          "Light travels from water (n₁ = 1.33) into glass (n₂ = 1.5). Calculate the angle of refraction when the angle of incidence is 30°.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the refractive indices: n₁ = 1.33 (water), n₂ = 1.5 (glass). Angle of incidence θ₁ = 30°.",
          },
          {
            label: "2",
            explanation:
              "Apply Snell's Law: θ₂ = arcsin((n₁ / n₂) × sin(θ₁)) = arcsin((1.33 / 1.5) × sin(30°)).",
          },
          {
            label: "3",
            explanation:
              "Calculate sin(30°) = 0.5, then (1.33 / 1.5) × 0.5 ≈ 0.4433. θ₂ = arcsin(0.4433) ≈ 26.35°.",
          },
        ],
        result: "The angle of refraction θ₂ is approximately 26.35°.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Blackbody Peak (Wien's Law) Estimator", url: "/science/blackbody-peak-wien-law-estimator", icon: "🧪" },
        { title: "Stoichiometry & Limiting Reagent Solver", url: "/science/stoichiometry-limiting-reagent", icon: "🧪" },
        { title: "Photon Energy Calculator", url: "/science/photon-energy-e-hf", icon: "🔥" },
        { title: "Escape Velocity Calculator", url: "/science/escape-velocity-calculator", icon: "🧪" },
        { title: "Orbital Period (Kepler) Estimator", url: "/science/orbital-period-kepler-estimator", icon: "🪐" },
        { title: "Density / Specific Gravity Calculator", url: "/science/density-specific-gravity-calculator", icon: "🪐" },
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