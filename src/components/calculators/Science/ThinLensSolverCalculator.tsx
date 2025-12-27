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

export default function ThinLensSolverCalculator() {
  // Inputs: focal length (f), object distance (do), image distance (di)
  // User selects which variable to solve for
  const [inputs, setInputs] = useState({
    solveFor: "f", // "f", "do", or "di"
    f: "",
    do: "",
    di: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const solveFor = inputs.solveFor;
    const fRaw = inputs.f.trim();
    const doRaw = inputs.do.trim();
    const diRaw = inputs.di.trim();

    // Parse inputs as floats
    const f = parseFloat(fRaw);
    const do_ = parseFloat(doRaw);
    const di = parseFloat(diRaw);

    // Validation helper
    const isValidNumber = (n) => typeof n === "number" && !isNaN(n);

    // Thin lens formula: 1/f = 1/do + 1/di
    // Solve for selected variable

    // Check required inputs are present and valid
    if (solveFor === "f") {
      if (!isValidNumber(do_) || !isValidNumber(di)) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: null,
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      if (do_ === 0 || di === 0) {
        return {
          value: "Error",
          label: "",
          subtext: "",
          warning: "Object distance and image distance must not be zero.",
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      // Calculate focal length
      const invF = 1 / do_ + 1 / di;
      if (invF === 0) {
        return {
          value: "Error",
          label: "",
          subtext: "",
          warning: "Sum of reciprocals results in division by zero.",
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      const focalLength = 1 / invF;
      return {
        value: `${focalLength.toFixed(4)} m`,
        label: "Focal Length (f)",
        subtext: "Positive for convex lens, negative for concave lens",
        warning: null,
        formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
      };
    } else if (solveFor === "do") {
      if (!isValidNumber(f) || !isValidNumber(di)) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: null,
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      if (f === 0 || di === 0) {
        return {
          value: "Error",
          label: "",
          subtext: "",
          warning: "Focal length and image distance must not be zero.",
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      // Calculate object distance: 1/do = 1/f - 1/di
      const invDo = 1 / f - 1 / di;
      if (invDo === 0) {
        return {
          value: "Error",
          label: "",
          subtext: "",
          warning: "Division by zero encountered in calculation.",
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      const objectDistance = 1 / invDo;
      return {
        value: `${objectDistance.toFixed(4)} m`,
        label: "Object Distance (dₒ)",
        subtext: "Distance from object to lens",
        warning: null,
        formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
      };
    } else if (solveFor === "di") {
      if (!isValidNumber(f) || !isValidNumber(do_)) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: null,
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      if (f === 0 || do_ === 0) {
        return {
          value: "Error",
          label: "",
          subtext: "",
          warning: "Focal length and object distance must not be zero.",
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      // Calculate image distance: 1/di = 1/f - 1/do
      const invDi = 1 / f - 1 / do_;
      if (invDi === 0) {
        return {
          value: "Error",
          label: "",
          subtext: "",
          warning: "Division by zero encountered in calculation.",
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      const imageDistance = 1 / invDi;
      return {
        value: `${imageDistance.toFixed(4)} m`,
        label: "Image Distance (dᵢ)",
        subtext: "Distance from image to lens",
        warning: null,
        formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
      };
    }

    return {
      value: "Waiting...",
      label: "",
      subtext: "",
      warning: null,
      formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does a positive focal length indicate?",
      answer:
        "A positive focal length indicates a convex (converging) lens, which focuses parallel light rays to a point. This type of lens can form real or virtual images depending on the object distance.",
    },
    {
      question: "Why must object distance and image distance not be zero?",
      answer:
        "Object distance (dₒ) and image distance (dᵢ) represent physical distances from the lens. Zero or near-zero values are physically impossible and cause mathematical errors like division by zero in the thin lens formula.",
    },
    {
      question: "Can the thin lens formula be used for concave lenses?",
      answer:
        "Yes, the thin lens formula applies to both convex and concave lenses. For concave lenses, the focal length is negative, and the image formed is virtual and upright.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Select variable to solve for */}
      <div>
        <Label htmlFor="solveFor" className="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <FlaskConical className="w-5 h-5 text-blue-600" /> Solve For
        </Label>
        <Select
          value={inputs.solveFor}
          onValueChange={(value) => handleInputChange("solveFor", value)}
          id="solveFor"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="f">Focal Length (f)</SelectItem>
            <SelectItem value="do">Object Distance (dₒ)</SelectItem>
            <SelectItem value="di">Image Distance (dᵢ)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="f" className="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <Orbit className="w-5 h-5 text-indigo-600" /> Focal Length (f) [m]
          </Label>
          <Input
            id="f"
            type="number"
            step="any"
            placeholder="e.g. 0.15"
            value={inputs.f}
            onChange={(e) => handleInputChange("f", e.target.value)}
            disabled={inputs.solveFor === "f"}
            aria-disabled={inputs.solveFor === "f"}
          />
        </div>
        <div>
          <Label htmlFor="do" className="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <Scale className="w-5 h-5 text-green-600" /> Object Distance (dₒ) [m]
          </Label>
          <Input
            id="do"
            type="number"
            step="any"
            placeholder="e.g. 0.30"
            value={inputs.do}
            onChange={(e) => handleInputChange("do", e.target.value)}
            disabled={inputs.solveFor === "do"}
            aria-disabled={inputs.solveFor === "do"}
          />
        </div>
        <div>
          <Label htmlFor="di" className="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <Waves className="w-5 h-5 text-purple-600" /> Image Distance (dᵢ) [m]
          </Label>
          <Input
            id="di"
            type="number"
            step="any"
            placeholder="e.g. 0.10"
            value={inputs.di}
            onChange={(e) => handleInputChange("di", e.target.value)}
            disabled={inputs.solveFor === "di"}
            aria-disabled={inputs.solveFor === "di"}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          aria-label="Calculate Thin Lens"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              solveFor: "f",
              f: "",
              do: "",
              di: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">{results.formulaUsed || "Calculated Result"}</p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Thin Lens Solver</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The thin lens equation is a fundamental formula in optics that relates the focal length (f) of a lens to the distances of the object (dₒ) and the image (dᵢ) from the lens. It is expressed as <code>1/f = 1/dₒ + 1/dᵢ</code>. This equation assumes the lens thickness is negligible compared to the object and image distances, simplifying calculations for many practical applications.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By using this solver, you can calculate any one of the three variables if the other two are known. This is crucial in designing optical systems such as cameras, microscopes, and eyeglasses. Remember, the sign conventions are important: focal length is positive for convex lenses and negative for concave lenses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that object and image distances are measured from the lens along the principal axis. If the image distance is positive, the image is real and formed on the opposite side of the lens from the object. If negative, the image is virtual and on the same side as the object.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`1/f = 1/dₒ + 1/dᵢ

Where:
  f  = focal length of the lens (meters)
  dₒ = object distance from the lens (meters)
  dᵢ = image distance from the lens (meters)

Rearranged formulas:
  To find focal length (f):
    f = 1 / (1/dₒ + 1/dᵢ)

  To find object distance (dₒ):
    1/dₒ = 1/f - 1/dᵢ

  To find image distance (dᵢ):
    1/dᵢ = 1/f - 1/dₒ

Sign conventions:
  - f &gt; 0 for convex (converging) lenses
  - f &lt; 0 for concave (diverging) lenses
  - dᵢ &gt; 0 for real images
  - dᵢ &lt; 0 for virtual images`}
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
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Thin%20Lens%20Equation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Thin Lens Equation - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Thin Lens Equation, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Thin%20Lens%20Equation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Thin Lens Equation - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Thin Lens Equation at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://www.physicsclassroom.com/search?q=Thin%20Lens%20Equation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Thin Lens Equation - The Physics Classroom
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Explore student-friendly tutorials, interactives, and concept builders related to Thin Lens Equation designed to improve understanding of physics principles.
            </p>
          </li>
          <li>
            <a href="http://hyperphysics.phy-astr.gsu.edu/hbase/hph.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Thin Lens Equation - HyperPhysics
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Navigate the HyperPhysics concept map to find concise summaries and calculation examples for Thin Lens Equation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Thin Lens Solver"
      description="Solve Thin Lens equation problems. Calculate focal length, object distance, and image distance for convex and concave lenses."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "1/f = 1/dₒ + 1/dᵢ",
        variables: [
          { symbol: "f", description: "Focal length of the lens (meters)" },
          { symbol: "dₒ", description: "Object distance from the lens (meters)" },
          { symbol: "dᵢ", description: "Image distance from the lens (meters)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A convex lens has a focal length of 0.20 m. An object is placed 0.30 m from the lens. Calculate the image distance.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify known values: f = 0.20 m, dₒ = 0.30 m, solve for dᵢ.",
          },
          {
            label: "2",
            explanation:
              "Use the thin lens formula: 1/f = 1/dₒ + 1/dᵢ → 1/dᵢ = 1/f - 1/dₒ.",
          },
          {
            label: "3",
            explanation:
              "Calculate: 1/dᵢ = 1/0.20 - 1/0.30 = 5 - 3.3333 = 1.6667 m⁻¹.",
          },
          {
            label: "4",
            explanation: "Invert to find dᵢ: dᵢ = 1 / 1.6667 = 0.6000 m.",
          },
        ],
        result: "The image distance is 0.6000 meters on the opposite side of the lens.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Wave Speed / Frequency / Wavelength", url: "/science/wave-speed-frequency-wavelength", icon: "🚀" },
        { title: "Buffer (Henderson–Hasselbalch) Helper", url: "/science/buffer-henderson-hasselbalch-helper", icon: "🧪" },
        { title: "Radioactive Activity Calculator", url: "/science/radioactive-activity-a-lambda-n", icon: "🧪" },
        { title: "Gravity on Other Planets Calculator", url: "/science/gravity-on-other-planets-calculator", icon: "🪐" },
        { title: "Capacitor/Inductor Reactance Calculator", url: "/science/reactance-capacitor-inductor-educational", icon: "⚡" },
        { title: "Ideal Gas Law Calculator", url: "/science/ideal-gas-law-pv-nrt", icon: "🧪" },
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