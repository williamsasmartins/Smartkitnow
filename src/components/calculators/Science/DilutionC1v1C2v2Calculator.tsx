import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, RotateCcw, AlertTriangle, Atom, FlaskConical } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DilutionC1v1C2v2Calculator() {
  // Inputs: C1, V1, C2, V2 (Molarity in M, Volume in mL or L)
  // User can leave one field empty to calculate it.
  const [inputs, setInputs] = useState({
    C1: "", // Initial concentration (M)
    V1: "", // Initial volume (mL)
    C2: "", // Final concentration (M)
    V2: "", // Final volume (mL)
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Calculation logic:
  // C1 * V1 = C2 * V2
  // Given any three, calculate the fourth.
  // Validation: Exactly one field must be empty to calculate it.
  // Units: Volumes in mL, Concentrations in M (mol/L)
  // Output volume in mL, concentration in M

  const results = useMemo(() => {
    const { C1, V1, C2, V2 } = inputs;

    // Parse inputs to floats
    const c1 = parseFloat(C1);
    const v1 = parseFloat(V1);
    const c2 = parseFloat(C2);
    const v2 = parseFloat(V2);

    // Count how many inputs are valid numbers
    const vals = [C1, V1, C2, V2];
    const filledCount = vals.filter((v) => v !== "").length;

    // Validation: Need exactly 3 inputs filled to calculate the 4th
    if (filledCount < 3) {
      return {
        value: "Waiting...",
        label: "Enter exactly three values",
        subtext: "Leave the value to calculate empty",
        warning: null,
        formulaUsed: "C₁V₁ = C₂V₂",
      };
    }
    if (filledCount > 3) {
      return {
        value: "Error",
        label: "Please leave exactly one field empty to calculate",
        subtext: null,
        warning: "Fill exactly three fields and leave one empty.",
        formulaUsed: "C₁V₁ = C₂V₂",
      };
    }

    // Check for invalid inputs (NaN or zero or negative where not allowed)
    // Concentrations and volumes must be positive numbers
    const invalidInput =
      (C1 !== "" && (isNaN(c1) || c1 <= 0)) ||
      (V1 !== "" && (isNaN(v1) || v1 <= 0)) ||
      (C2 !== "" && (isNaN(c2) || c2 <= 0)) ||
      (V2 !== "" && (isNaN(v2) || v2 <= 0));

    if (invalidInput) {
      return {
        value: "Error",
        label: "Invalid input detected",
        subtext: "Concentrations and volumes must be positive numbers",
        warning: "Please enter positive numeric values only.",
        formulaUsed: "C₁V₁ = C₂V₂",
      };
    }

    // Calculate the missing value
    // Cases:
    // Missing C1: C1 = (C2 * V2) / V1
    // Missing V1: V1 = (C2 * V2) / C1
    // Missing C2: C2 = (C1 * V1) / V2
    // Missing V2: V2 = (C1 * V1) / C2

    let calculatedValue: number | null = null;
    let label = "";
    let unit = "";

    if (C1 === "") {
      // Calculate C1
      calculatedValue = (c2 * v2) / v1;
      label = "Initial Concentration (C₁)";
      unit = "M (Molar)";
    } else if (V1 === "") {
      // Calculate V1
      calculatedValue = (c2 * v2) / c1;
      label = "Initial Volume (V₁)";
      unit = "mL";
    } else if (C2 === "") {
      // Calculate C2
      calculatedValue = (c1 * v1) / v2;
      label = "Final Concentration (C₂)";
      unit = "M (Molar)";
    } else if (V2 === "") {
      // Calculate V2
      calculatedValue = (c1 * v1) / c2;
      label = "Final Volume (V₂)";
      unit = "mL";
    }

    if (calculatedValue === null || !isFinite(calculatedValue)) {
      return {
        value: "Error",
        label: "Calculation error",
        subtext: "Check your inputs for validity",
        warning: "Result is not a finite number.",
        formulaUsed: "C₁V₁ = C₂V₂",
      };
    }

    // Format output: use scientific notation if very large or very small
    const absVal = Math.abs(calculatedValue);
    const displayVal =
      absVal !== 0 && (absVal >= 10000 || absVal < 0.001)
        ? calculatedValue.toExponential(4)
        : calculatedValue.toFixed(4);

    return {
      value: `${displayVal} ${unit}`,
      label,
      subtext: "Using formula: C₁V₁ = C₂V₂",
      warning: null,
      formulaUsed: "C₁V₁ = C₂V₂",
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is the purpose of the dilution formula C₁V₁ = C₂V₂?",
      answer:
        "The dilution formula C₁V₁ = C₂V₂ is used to calculate the concentration or volume of a solution after dilution. It helps chemists and scientists determine how much solvent to add to achieve a desired concentration. This formula assumes the amount of solute remains constant before and after dilution.",
    },
    {
      question: "Where is the dilution calculation commonly applied in real life?",
      answer:
        "Dilution calculations are essential in laboratory experiments, pharmaceutical preparations, and chemical manufacturing. For example, preparing solutions for titrations, adjusting reagent concentrations, or diluting stock chemicals to safe working levels all require precise dilution calculations to ensure accuracy and safety.",
    },
    {
      question: "Can I use any units for volume in the dilution formula?",
      answer:
        "Yes, but the units for volume must be consistent on both sides of the equation. For example, if you use milliliters (mL) for V₁, then V₂ must also be in milliliters. Mixing units like mL and L without conversion will lead to incorrect results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="C1" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-5 h-5 text-blue-600" /> Initial Concentration (C₁)
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">M (Molar)</span>
          </Label>
          <Input
            id="C1"
            type="text"
            placeholder="e.g. 1.5"
            value={inputs.C1}
            onChange={(e) => handleInputChange("C1", e.target.value)}
            aria-describedby="C1-desc"
            autoComplete="off"
          />
          <p id="C1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter initial concentration or leave empty to calculate.
          </p>
        </div>

        <div>
          <Label htmlFor="V1" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-5 h-5 text-green-600" /> Initial Volume (V₁)
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">mL</span>
          </Label>
          <Input
            id="V1"
            type="text"
            placeholder="e.g. 50"
            value={inputs.V1}
            onChange={(e) => handleInputChange("V1", e.target.value)}
            aria-describedby="V1-desc"
            autoComplete="off"
          />
          <p id="V1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter initial volume or leave empty to calculate.
          </p>
        </div>

        <div>
          <Label htmlFor="C2" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-5 h-5 text-purple-600" /> Final Concentration (C₂)
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">M (Molar)</span>
          </Label>
          <Input
            id="C2"
            type="text"
            placeholder="e.g. 0.5"
            value={inputs.C2}
            onChange={(e) => handleInputChange("C2", e.target.value)}
            aria-describedby="C2-desc"
            autoComplete="off"
          />
          <p id="C2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter final concentration or leave empty to calculate.
          </p>
        </div>

        <div>
          <Label htmlFor="V2" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-5 h-5 text-red-600" /> Final Volume (V₂)
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">mL</span>
          </Label>
          <Input
            id="V2"
            type="text"
            placeholder="e.g. 150"
            value={inputs.V2}
            onChange={(e) => handleInputChange("V2", e.target.value)}
            aria-describedby="V2-desc"
            autoComplete="off"
          />
          <p id="V2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter final volume or leave empty to calculate.
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
          aria-label="Calculate dilution"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ C1: "", V1: "", C2: "", V2: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
              <strong>Science Fact:</strong> Always ensure volume units are consistent on both sides of the equation (e.g., mL with mL). Concentrations are typically in molar (M).
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Dilution Calculator (C₁V₁ = C₂V₂)</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The dilution calculator uses the fundamental chemistry formula <strong>C₁V₁ = C₂V₂</strong> to relate the concentrations and volumes of solutions before and after dilution. Here, <em>C₁</em> and <em>V₁</em> represent the initial concentration and volume of a stock solution, while <em>C₂</em> and <em>V₂</em> represent the final concentration and volume after dilution. This formula assumes the amount of solute remains constant during the dilution process.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool is essential for chemists, biologists, and laboratory technicians who need to prepare solutions of precise concentrations. It helps avoid errors in experiments and ensures reproducibility by accurately calculating the volume or concentration needed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Remember, the units of volume must be consistent (e.g., both in milliliters or liters), and concentrations are typically expressed in molarity (moles per liter). This calculator allows you to input any three values and computes the missing one, making it a versatile and practical tool.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`C₁ × V₁ = C₂ × V₂

Where:
  C₁ = Initial concentration (Molar, M)
  V₁ = Initial volume (mL or L)
  C₂ = Final concentration (Molar, M)
  V₂ = Final volume (mL or L)

Note:
- Units of volume must be consistent on both sides.
- Concentration units are typically mol/L (M).`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the dilution formula:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> You have 50 mL of a 1.5 M stock solution (C₁ and V₁) and want to prepare 150 mL of a diluted solution (V₂) with unknown concentration (C₂).</li>
          <li><strong>Step 1:</strong> Use the formula C₁V₁ = C₂V₂ and rearrange to find C₂ = (C₁ × V₁) / V₂.</li>
          <li><strong>Step 2:</strong> Substitute values: C₂ = (1.5 M × 50 mL) / 150 mL = 0.5 M.</li>
          <li><strong>Result:</strong> The final concentration after dilution is 0.5 M.</li>
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
      title="Dilution Calculator (C₁V₁ = C₂V₂)"
      description="Solve dilution problems easily. Calculate the volume needed to dilute a stock solution to a desired concentration."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "C₁ × V₁ = C₂ × V₂",
        variables: [
          { symbol: "C₁", description: "Initial concentration (Molar, M)" },
          { symbol: "V₁", description: "Initial volume (mL or L)" },
          { symbol: "C₂", description: "Final concentration (Molar, M)" },
          { symbol: "V₂", description: "Final volume (mL or L)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the final concentration when 50 mL of 1.5 M solution is diluted to 150 mL.",
        steps: [
          { label: "1", explanation: "Use formula C₁V₁ = C₂V₂ and solve for C₂." },
          { label: "2", explanation: "Substitute values: C₂ = (1.5 × 50) / 150." },
          { label: "3", explanation: "Calculate: C₂ = 0.5 M." },
        ],
        result: "Final concentration is 0.5 M.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
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