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

export default function ThinLensSolverCalculator() {
  // Inputs: focal length (f), object distance (do), image distance (di)
  // User selects which variable to solve for; inputs the other two.
  // All distances in centimeters (cm) for convenience, but units shown clearly.

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
    const { solveFor, f, do: doInput, di } = inputs;

    // Parse inputs to floats
    const fNum = parseFloat(f);
    const doNum = parseFloat(doInput);
    const diNum = parseFloat(di);

    // Validation helper
    const isValidNumber = (n) => !isNaN(n) && isFinite(n);

    // Warning messages
    let warning = null;

    // Formula used string
    let formulaUsed = null;

    // Calculation result
    let value = "Waiting...";
    let label = "";
    let subtext = "";

    // Thin lens formula:
    // 1/f = 1/do + 1/di
    // Solve for one variable given the other two.

    // Validate inputs based on solveFor
    if (solveFor === "f") {
      if (!isValidNumber(doNum) || !isValidNumber(diNum)) {
        return {
          value: "Waiting...",
          label: "Enter valid object & image distances",
          subtext: "Distances must be numeric and non-zero",
          warning: null,
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      if (doNum === 0 || diNum === 0) {
        warning = "Object distance and image distance must not be zero.";
      }
      // Calculate focal length
      // 1/f = 1/do + 1/di => f = 1 / (1/do + 1/di)
      const denom = (1 / doNum) + (1 / diNum);
      if (denom === 0) {
        warning = "Denominator zero, invalid distances.";
        return {
          value: "Undefined",
          label: "Invalid input values",
          subtext: "",
          warning,
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      const fCalc = 1 / denom;
      formulaUsed = "1/f = 1/dₒ + 1/dᵢ";

      // Format result: focal length in cm
      const displayVal =
        Math.abs(fCalc) > 10000 || Math.abs(fCalc) < 0.001
          ? fCalc.toExponential(4)
          : fCalc.toFixed(4);

      value = `${displayVal} cm`;
      label = "Focal Length (f)";
      subtext = "Positive for convex lens, negative for concave lens";
    } else if (solveFor === "do") {
      if (!isValidNumber(fNum) || !isValidNumber(diNum)) {
        return {
          value: "Waiting...",
          label: "Enter valid focal length & image distance",
          subtext: "Distances must be numeric and non-zero",
          warning: null,
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      if (fNum === 0 || diNum === 0) {
        warning = "Focal length and image distance must not be zero.";
      }
      // Calculate object distance
      // 1/do = 1/f - 1/di => do = 1 / (1/f - 1/di)
      const denom = (1 / fNum) - (1 / diNum);
      if (denom === 0) {
        warning = "Denominator zero, invalid distances.";
        return {
          value: "Undefined",
          label: "Invalid input values",
          subtext: "",
          warning,
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      const doCalc = 1 / denom;
      formulaUsed = "1/f = 1/dₒ + 1/dᵢ";

      const displayVal =
        Math.abs(doCalc) > 10000 || Math.abs(doCalc) < 0.001
          ? doCalc.toExponential(4)
          : doCalc.toFixed(4);

      value = `${displayVal} cm`;
      label = "Object Distance (dₒ)";
      subtext = "Distance from object to lens";
    } else if (solveFor === "di") {
      if (!isValidNumber(fNum) || !isValidNumber(doNum)) {
        return {
          value: "Waiting...",
          label: "Enter valid focal length & object distance",
          subtext: "Distances must be numeric and non-zero",
          warning: null,
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      if (fNum === 0 || doNum === 0) {
        warning = "Focal length and object distance must not be zero.";
      }
      // Calculate image distance
      // 1/di = 1/f - 1/do => di = 1 / (1/f - 1/do)
      const denom = (1 / fNum) - (1 / doNum);
      if (denom === 0) {
        warning = "Denominator zero, invalid distances.";
        return {
          value: "Undefined",
          label: "Invalid input values",
          subtext: "",
          warning,
          formulaUsed: "1/f = 1/dₒ + 1/dᵢ",
        };
      }
      const diCalc = 1 / denom;
      formulaUsed = "1/f = 1/dₒ + 1/dᵢ";

      const displayVal =
        Math.abs(diCalc) > 10000 || Math.abs(diCalc) < 0.001
          ? diCalc.toExponential(4)
          : diCalc.toFixed(4);

      value = `${displayVal} cm`;
      label = "Image Distance (dᵢ)";
      subtext = "Distance from image to lens";
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  // FAQs for SEO and educational content
  const faqs = [
    {
      question: "What is the thin lens equation used for?",
      answer:
        "The thin lens equation relates the focal length of a lens to the distances of the object and image from the lens. It is essential in optics to determine image formation properties such as size, orientation, and position. This equation is widely used in designing cameras, eyeglasses, microscopes, and telescopes.",
    },
    {
      question: "How do I know if a lens is convex or concave from the focal length?",
      answer:
        "A positive focal length indicates a convex (converging) lens, which focuses light rays to a point. A negative focal length corresponds to a concave (diverging) lens, which spreads light rays apart. This sign convention helps in understanding image formation and lens behavior in optical systems.",
    },
    {
      question: "Why must object and image distances be non-zero in calculations?",
      answer:
        "Object and image distances must be non-zero to avoid division by zero in the thin lens formula. Zero distances are physically unrealistic because the object or image cannot be exactly at the lens surface. Ensuring valid distances prevents mathematical errors and ensures meaningful results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Select variable to solve for */}
      <div>
        <Label htmlFor="solveFor" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
          Select variable to solve for
        </Label>
        <Select
          value={inputs.solveFor}
          onValueChange={(val) => handleInputChange("solveFor", val)}
          id="solveFor"
          aria-label="Select variable to solve for"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select variable" />
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
          <Label htmlFor="f" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Focal Length (f) [cm]
          </Label>
          <Input
            id="f"
            type="number"
            step="any"
            placeholder="e.g. 10"
            value={inputs.f}
            onChange={(e) => handleInputChange("f", e.target.value)}
            disabled={inputs.solveFor === "f"}
            aria-disabled={inputs.solveFor === "f"}
            aria-label="Focal Length in centimeters"
          />
        </div>
        <div>
          <Label htmlFor="do" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Object Distance (dₒ) [cm]
          </Label>
          <Input
            id="do"
            type="number"
            step="any"
            placeholder="e.g. 15"
            value={inputs.do}
            onChange={(e) => handleInputChange("do", e.target.value)}
            disabled={inputs.solveFor === "do"}
            aria-disabled={inputs.solveFor === "do"}
            aria-label="Object Distance in centimeters"
          />
        </div>
        <div>
          <Label htmlFor="di" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Image Distance (dᵢ) [cm]
          </Label>
          <Input
            id="di"
            type="number"
            step="any"
            placeholder="e.g. 30"
            value={inputs.di}
            onChange={(e) => handleInputChange("di", e.target.value)}
            disabled={inputs.solveFor === "di"}
            aria-disabled={inputs.solveFor === "di"}
            aria-label="Image Distance in centimeters"
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
          aria-label="Calculate thin lens variable"
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
              <strong>Science Fact:</strong> The thin lens formula assumes the lens thickness is negligible compared to object and image distances.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Thin Lens Solver</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The thin lens equation is a fundamental relation in optics that connects the focal length (f) of a lens with the distances of the object (dₒ) and the image (dᵢ) from the lens. It is expressed as <code>1/f = 1/dₒ + 1/dᵢ</code>. This formula helps predict where an image will form and its characteristics, such as size and orientation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This solver allows you to calculate any one of these three variables when the other two are known. It is essential for designing optical devices like cameras, microscopes, and corrective lenses. Understanding how to manipulate these distances is crucial for controlling image formation in practical applications.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Note that distances are positive or negative based on the lens type and the direction of light travel. Convex lenses have positive focal lengths and can produce real or virtual images, while concave lenses have negative focal lengths and produce virtual images only.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`1/f = 1/dₒ + 1/dᵢ

Where:
  f  = Focal length of the lens (cm)
  dₒ = Object distance from the lens (cm)
  dᵢ = Image distance from the lens (cm)

Sign conventions:
  - f &gt; 0 for convex (converging) lenses
  - f &lt; 0 for concave (diverging) lenses
  - dₒ &gt; 0 if object is on the incoming light side
  - dᵢ &gt; 0 for real images, &lt; 0 for virtual images`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the thin lens equation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A convex lens with focal length <code>f = 10 cm</code>, and an object placed <code>dₒ = 15 cm</code> from the lens.
          </li>
          <li>
            <strong>Step 1:</strong> Use the formula <code>1/f = 1/dₒ + 1/dᵢ</code> to find the image distance <code>dᵢ</code>.
          </li>
          <li>
            <strong>Calculation:</strong> <code>1/dᵢ = 1/f - 1/dₒ = 1/10 - 1/15 = 0.0667</code>, so <code>dᵢ = 15 cm</code>.
          </li>
          <li>
            <strong>Result:</strong> The image forms 30 cm on the opposite side of the lens, real and inverted.
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
      title="Thin Lens Solver"
      description="Solve Thin Lens equation problems. Calculate focal length, object distance, and image distance for convex and concave lenses."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "1/f = 1/dₒ + 1/dᵢ",
        variables: [
          { symbol: "f", description: "Focal length of the lens (cm)" },
          { symbol: "dₒ", description: "Object distance from the lens (cm)" },
          { symbol: "dᵢ", description: "Image distance from the lens (cm)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the image distance formed by a convex lens with focal length 10 cm when an object is placed 15 cm from the lens.",
        steps: [
          { label: "1", explanation: "Write the thin lens formula: 1/f = 1/dₒ + 1/dᵢ." },
          { label: "2", explanation: "Substitute known values: 1/10 = 1/15 + 1/dᵢ." },
          { label: "3", explanation: "Solve for 1/dᵢ: 1/dᵢ = 1/10 - 1/15 = 0.0667." },
          { label: "4", explanation: "Calculate dᵢ: dᵢ = 1 / 0.0667 = 15 cm." },
        ],
        result: "The image distance is 30 cm, indicating the image forms on the opposite side of the lens.",
      }}
      relatedCalculators={[
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
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