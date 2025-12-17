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
  // User selects which variable to solve for, and inputs the other two.
  const [inputs, setInputs] = useState({
    solveFor: "f", // "f", "do", or "di"
    f: "",
    do: "",
    di: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic in useMemo
  const results = useMemo(() => {
    const { solveFor, f, do: doStr, di } = inputs;

    // Parse inputs to floats
    const fNum = parseFloat(f);
    const doNum = parseFloat(doStr);
    const diNum = parseFloat(di);

    // Validation helper
    const isValidNumber = (n: number) => !isNaN(n) && isFinite(n);

    // Early return if inputs incomplete
    if (
      (solveFor === "f" && (!isValidNumber(doNum) || !isValidNumber(diNum))) ||
      (solveFor === "do" && (!isValidNumber(fNum) || !isValidNumber(diNum))) ||
      (solveFor === "di" && (!isValidNumber(fNum) || !isValidNumber(doNum)))
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid inputs",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Thin lens formula: 1/f = 1/do + 1/di
    // Solve for the selected variable
    let resultValue: number | null = null;
    let formulaUsed = "";
    let warning: string | null = null;

    try {
      switch (solveFor) {
        case "f":
          // f = 1 / (1/do + 1/di)
          if (doNum === 0 || diNum === 0) {
            warning = "Object distance and image distance must not be zero.";
            break;
          }
          resultValue = 1 / (1 / doNum + 1 / diNum);
          formulaUsed = "1/f = 1/d₀ + 1/dᵢ";
          break;

        case "do":
          // do = 1 / (1/f - 1/di)
          if (fNum === 0) {
            warning = "Focal length must not be zero.";
            break;
          }
          if (diNum === 0) {
            warning = "Image distance must not be zero.";
            break;
          }
          if (1 / fNum - 1 / diNum === 0) {
            warning = "Denominator zero: object distance undefined.";
            break;
          }
          resultValue = 1 / (1 / fNum - 1 / diNum);
          formulaUsed = "1/d₀ = 1/f - 1/dᵢ";
          break;

        case "di":
          // di = 1 / (1/f - 1/do)
          if (fNum === 0) {
            warning = "Focal length must not be zero.";
            break;
          }
          if (doNum === 0) {
            warning = "Object distance must not be zero.";
            break;
          }
          if (1 / fNum - 1 / doNum === 0) {
            warning = "Denominator zero: image distance undefined.";
            break;
          }
          resultValue = 1 / (1 / fNum - 1 / doNum);
          formulaUsed = "1/dᵢ = 1/f - 1/d₀";
          break;

        default:
          warning = "Invalid variable to solve for.";
      }
    } catch {
      warning = "Calculation error. Check inputs.";
    }

    if (resultValue === null || !isFinite(resultValue)) {
      return {
        value: "Error",
        label: "Invalid calculation",
        subtext: "",
        warning: warning || "Calculation resulted in an invalid number.",
        formulaUsed,
      };
    }

    // Format result with scientific notation if very large/small
    const absVal = Math.abs(resultValue);
    const displayVal =
      absVal !== 0 && (absVal >= 10000 || absVal < 0.001)
        ? resultValue.toExponential(4)
        : resultValue.toFixed(4);

    // Units: distances in centimeters (cm) or meters (m) - we assume user inputs in cm for simplicity
    // We will display units as "cm"
    let label = "";
    switch (solveFor) {
      case "f":
        label = "Focal Length (cm)";
        break;
      case "do":
        label = "Object Distance (cm)";
        break;
      case "di":
        label = "Image Distance (cm)";
        break;
    }

    return {
      value: `${displayVal} cm`,
      label,
      subtext: "Distances are in centimeters (cm).",
      warning,
      formulaUsed,
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is the thin lens formula used for?",
      answer:
        "The thin lens formula relates the focal length of a lens to the distances of the object and the image from the lens. It is fundamental in optics for determining image formation properties in cameras, glasses, microscopes, and telescopes. This formula helps predict where an image will form and its size relative to the object.",
    },
    {
      question: "How do positive and negative focal lengths affect image formation?",
      answer:
        "A positive focal length corresponds to a convex (converging) lens, which can produce real or virtual images depending on object placement. A negative focal length corresponds to a concave (diverging) lens, which always produces virtual, diminished images. Understanding the sign conventions is essential for correctly applying the thin lens formula.",
    },
    {
      question: "Why must object and image distances not be zero?",
      answer:
        "Object and image distances represent physical distances from the lens to the object or image. Zero distance implies the object or image is exactly at the lens surface, which is physically unrealistic and mathematically undefined in the thin lens formula. Such inputs lead to division by zero errors and invalid results.",
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
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select variable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="f">Focal Length (f)</SelectItem>
            <SelectItem value="do">Object Distance (d₀)</SelectItem>
            <SelectItem value="di">Image Distance (dᵢ)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="f" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Focal Length (cm)
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
          />
        </div>
        <div>
          <Label htmlFor="do" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Object Distance (d₀) (cm)
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
          />
        </div>
        <div>
          <Label htmlFor="di" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
            Image Distance (dᵢ) (cm)
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
          type="button"
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
          type="button"
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
              <strong>Science Fact:</strong> Always ensure units are consistent. Here, distances are in centimeters (cm). Convert units if needed before calculation.
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
          The thin lens formula is a fundamental equation in optics that relates the focal length (f) of a lens to the distances of the object (d₀) and the image (dᵢ) formed by the lens. It is expressed as <code>1/f = 1/d₀ + 1/dᵢ</code>. This formula assumes the lens thickness is negligible compared to the object and image distances, which simplifies calculations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This solver allows you to calculate any one of these three variables when the other two are known. It is essential for understanding how lenses form images, whether real or virtual, magnified or diminished. The sign conventions used here assume distances measured from the lens along the principal axis, with positive values for real objects and images.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Applications of the thin lens formula include designing optical instruments like cameras, microscopes, and eyeglasses, as well as in physics education to demonstrate image formation principles. Understanding this formula helps in predicting image location and size, which is critical in many scientific and engineering fields.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`1/f = 1/d₀ + 1/dᵢ

Where:
  f  = focal length of the lens (cm)
  d₀ = object distance from the lens (cm)
  dᵢ = image distance from the lens (cm)

Rearranged forms:
  f = 1 / (1/d₀ + 1/dᵢ)
  d₀ = 1 / (1/f - 1/dᵢ)
  dᵢ = 1 / (1/f - 1/d₀)

Note:
- Positive f indicates a convex (converging) lens.
- Negative f indicates a concave (diverging) lens.
- Distances are positive if measured in the direction of incoming light; use sign conventions accordingly.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the thin lens formula:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A convex lens with focal length <code>f = 10 cm</code>, and an object placed at <code>d₀ = 15 cm</code> from the lens.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate the image distance <code>dᵢ</code> using the formula <code>1/dᵢ = 1/f - 1/d₀</code>.
          </li>
          <li>
            <strong>Calculation:</strong> <code>1/dᵢ = 1/10 - 1/15 = 0.0667</code>, so <code>dᵢ = 15 cm</code>.
          </li>
          <li>
            <strong>Result:</strong> The image forms at 30 cm on the opposite side of the lens, indicating a real, inverted image.
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
        formula: "1/f = 1/d₀ + 1/dᵢ",
        variables: [
          { symbol: "f", description: "Focal length of the lens (cm)" },
          { symbol: "d₀", description: "Object distance from the lens (cm)" },
          { symbol: "dᵢ", description: "Image distance from the lens (cm)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Given a convex lens with focal length 10 cm and an object placed 15 cm from the lens, find the image distance.",
        steps: [
          { label: "1", explanation: "Use the formula 1/dᵢ = 1/f - 1/d₀." },
          { label: "2", explanation: "Calculate 1/dᵢ = 1/10 - 1/15 = 0.0667." },
          { label: "3", explanation: "Invert to find dᵢ = 15 cm." },
        ],
        result: "The image forms 30 cm from the lens on the opposite side, indicating a real image.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
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