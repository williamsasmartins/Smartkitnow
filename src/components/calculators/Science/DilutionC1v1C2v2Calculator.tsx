import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// ⚠️ FIX: Adicionei FlaskConical, Scale e Waves que estavam faltando
import { Atom, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DilutionC1v1C2v2Calculator() {
  const [inputs, setInputs] = useState({
    c1: "",
    v1: "",
    c2: "",
    v2: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const c1 = parseFloat(inputs.c1);
    const v1 = parseFloat(inputs.v1);
    const c2 = parseFloat(inputs.c2);
    const v2 = parseFloat(inputs.v2);

    // Count how many inputs are provided (non-empty and valid numbers)
    const provided = [c1, v1, c2, v2].filter((x) => !isNaN(x)).length;

    // We need exactly 3 inputs to calculate the 4th
    if (provided < 3) {
      return {
        value: "Waiting...",
        label: "Please enter any three values to calculate the fourth.",
        subtext: null,
        warning: null,
        formulaUsed: "C₁V₁ = C₂V₂",
      };
    }

    // Validate inputs: concentrations and volumes must be >= 0
    if (
      (inputs.c1 !== "" && (isNaN(c1) || c1 < 0)) ||
      (inputs.v1 !== "" && (isNaN(v1) || v1 < 0)) ||
      (inputs.c2 !== "" && (isNaN(c2) || c2 < 0)) ||
      (inputs.v2 !== "" && (isNaN(v2) || v2 < 0))
    ) {
      return {
        value: "Error",
        label: "All concentrations and volumes must be numbers ≥ 0.",
        subtext: null,
        warning: "Invalid input detected.",
        formulaUsed: "C₁V₁ = C₂V₂",
      };
    }

    // Determine which variable to calculate (the one empty)
    try {
      if (inputs.c1 === "") {
        // c1 = (c2 * v2) / v1
        if (v1 === 0) {
          return {
            value: "Error",
            label: "Volume V₁ cannot be zero for calculation.",
            subtext: null,
            warning: "Division by zero.",
            formulaUsed: "C₁ = (C₂ × V₂) / V₁",
          };
        }
        const val = (c2 * v2) / v1;
        return {
          value: val.toExponential(4) + " M",
          label: "Calculated initial concentration (C₁)",
          subtext: "Molarity (M)",
          warning: null,
          formulaUsed: "C₁ = (C₂ × V₂) / V₁",
        };
      }
      if (inputs.v1 === "") {
        // v1 = (c2 * v2) / c1
        if (c1 === 0) {
          return {
            value: "Error",
            label: "Concentration C₁ cannot be zero for calculation.",
            subtext: null,
            warning: "Division by zero.",
            formulaUsed: "V₁ = (C₂ × V₂) / C₁",
          };
        }
        const val = (c2 * v2) / c1;
        return {
          value: val.toExponential(4) + " L",
          label: "Calculated initial volume (V₁)",
          subtext: "Liters (L)",
          warning: null,
          formulaUsed: "V₁ = (C₂ × V₂) / C₁",
        };
      }
      if (inputs.c2 === "") {
        // c2 = (c1 * v1) / v2
        if (v2 === 0) {
          return {
            value: "Error",
            label: "Volume V₂ cannot be zero for calculation.",
            subtext: null,
            warning: "Division by zero.",
            formulaUsed: "C₂ = (C₁ × V₁) / V₂",
          };
        }
        const val = (c1 * v1) / v2;
        return {
          value: val.toExponential(4) + " M",
          label: "Calculated final concentration (C₂)",
          subtext: "Molarity (M)",
          warning: null,
          formulaUsed: "C₂ = (C₁ × V₁) / V₂",
        };
      }
      if (inputs.v2 === "") {
        // v2 = (c1 * v1) / c2
        if (c2 === 0) {
          return {
            value: "Error",
            label: "Concentration C₂ cannot be zero for calculation.",
            subtext: null,
            warning: "Division by zero.",
            formulaUsed: "V₂ = (C₁ × V₁) / C₂",
          };
        }
        const val = (c1 * v1) / c2;
        return {
          value: val.toExponential(4) + " L",
          label: "Calculated final volume (V₂)",
          subtext: "Liters (L)",
          warning: null,
          formulaUsed: "V₂ = (C₁ × V₁) / C₂",
        };
      }
      // If all four inputs are filled, no calculation needed
      return {
        value: "All inputs provided",
        label: "Please clear one value to calculate it.",
        subtext: null,
        warning: null,
        formulaUsed: "C₁V₁ = C₂V₂",
      };
    } catch {
      return {
        value: "Error",
        label: "An unexpected error occurred.",
        subtext: null,
        warning: "Check your inputs.",
        formulaUsed: "C₁V₁ = C₂V₂",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What does the dilution formula C₁V₁ = C₂V₂ represent?",
      answer:
        "The formula C₁V₁ = C₂V₂ expresses the relationship between the concentration and volume of a stock solution before dilution (C₁ and V₁) and the concentration and volume after dilution (C₂ and V₂). It assumes the amount of solute remains constant, allowing calculation of one variable if the other three are known.",
    },
    {
      question: "Can I use this calculator if I only know two values?",
      answer:
        "No, you need to provide exactly three of the four variables (C₁, V₁, C₂, V₂) to calculate the missing one. With fewer than three inputs, the calculation cannot be performed because the equation has four variables.",
    },
    {
      question: "What units should I use for concentration and volume?",
      answer:
        "Concentrations should be entered in molarity (M, moles per liter), and volumes should be in liters (L). Consistent units are essential for accurate calculations using the dilution formula.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="c1" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            Initial Concentration (C₁) [M]
          </Label>
          <Input
            id="c1"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 1.0"
            value={inputs.c1}
            onChange={(e) => handleInputChange("c1", e.target.value)}
            aria-describedby="c1-desc"
          />
          <p id="c1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter initial concentration in molarity (M).
          </p>
        </div>

        <div>
          <Label htmlFor="v1" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-5 h-5 text-blue-600" />
            Initial Volume (V₁) [L]
          </Label>
          <Input
            id="v1"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 0.5"
            value={inputs.v1}
            onChange={(e) => handleInputChange("v1", e.target.value)}
            aria-describedby="v1-desc"
          />
          <p id="v1-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter initial volume in liters (L).
          </p>
        </div>

        <div>
          <Label htmlFor="c2" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-5 h-5 text-blue-600" />
            Final Concentration (C₂) [M]
          </Label>
          <Input
            id="c2"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 0.1"
            value={inputs.c2}
            onChange={(e) => handleInputChange("c2", e.target.value)}
            aria-describedby="c2-desc"
          />
          <p id="c2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter final concentration in molarity (M).
          </p>
        </div>

        <div>
          <Label htmlFor="v2" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            Final Volume (V₂) [L]
          </Label>
          <Input
            id="v2"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 5.0"
            value={inputs.v2}
            onChange={(e) => handleInputChange("v2", e.target.value)}
            aria-describedby="v2-desc"
          />
          <p id="v2-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter final volume in liters (L).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is automatic
          }}
          aria-label="Calculate dilution"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ c1: "", v1: "", c2: "", v2: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div
                  className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left"
                  role="alert"
                >
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
          Understanding Dilution Calculator (C₁V₁ = C₂V₂)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The dilution formula C₁V₁ = C₂V₂ is fundamental in chemistry for calculating how to dilute a concentrated stock solution to a desired concentration. Here, C₁ and V₁ represent the concentration and volume of the initial solution, while C₂ and V₂ represent those of the diluted solution. This relationship assumes the amount of solute remains constant during dilution.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to input any three of these variables to solve for the fourth, making it a practical tool for laboratory preparations and experiments. It ensures precise measurements, which are critical for reproducibility and accuracy in scientific work.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Remember to use consistent units: concentrations in molarity (M) and volumes in liters (L). If you enter inconsistent units, the results will be incorrect. Always double-check your inputs before calculating.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is ideal for students, educators, and professionals who need a reliable and educational resource for dilution calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`C₁ × V₁ = C₂ × V₂

Where:
C₁ = Initial concentration (molarity, M)
V₁ = Initial volume (liters, L)
C₂ = Final concentration (molarity, M)
V₂ = Final volume (liters, L)

To find the missing variable, rearrange the formula:

C₁ = (C₂ × V₂) / V₁
V₁ = (C₂ × V₂) / C₁
C₂ = (C₁ × V₁) / V₂
V₂ = (C₁ × V₁) / C₂`}
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
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Dilution%20Calculations" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Dilution Calculations - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Dilution Calculations, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Dilution%20Calculations" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Dilution Calculations - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Dilution Calculations at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://chem.libretexts.org/Special:Search?query=Dilution%20Calculations" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Dilution Calculations - Chemistry LibreTexts
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Access open-access chemistry textbooks and rigorous academic articles explaining Dilution Calculations in detail for students and researchers.
            </p>
          </li>
          <li>
            <a href="https://pubchem.ncbi.nlm.nih.gov/#query=Dilution%20Calculations" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Dilution Calculations - PubChem
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Search the PubChem database for chemical information, compound properties, and safety data related to Dilution Calculations.
            </p>
          </li>
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
          { symbol: "C₁", description: "Initial concentration (molarity, M)" },
          { symbol: "V₁", description: "Initial volume (liters, L)" },
          { symbol: "C₂", description: "Final concentration (molarity, M)" },
          { symbol: "V₂", description: "Final volume (liters, L)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have 0.5 L of a 2.0 M stock solution (C₁ and V₁) and want to prepare 5.0 L of a diluted solution (V₂) with an unknown concentration (C₂).",
        steps: [
          {
            label: "1",
            explanation:
              "Identify known values: C₁ = 2.0 M, V₁ = 0.5 L, V₂ = 5.0 L, C₂ = unknown.",
          },
          {
            label: "2",
            explanation:
              "Use the formula C₁V₁ = C₂V₂ and solve for C₂: C₂ = (C₁ × V₁) / V₂.",
          },
          {
            label: "3",
            explanation:
              "Calculate: C₂ = (2.0 M × 0.5 L) / 5.0 L = 0.2 M.",
          },
        ],
        result: "The final concentration C₂ is 0.2 M.",
      }}
      relatedCalculators={[
        { title: "Momentum & Impulse Calculator", url: "/science/momentum-impulse-calculator", icon: "🧪" },
        { title: "Half-Life / Exponential Decay Calculator", url: "/science/half-life-exponential-decay", icon: "⚛️" },
        { title: "Radioactive Activity Calculator", url: "/science/radioactive-activity-a-lambda-n", icon: "🧪" },
        { title: "Power & Efficiency Calculator", url: "/science/power-efficiency-calculator", icon: "🔥" },
        { title: "Thin Lens Solver", url: "/science/thin-lens-solver", icon: "🌈" },
        { title: "Percent Yield & Theoretical Yield", url: "/science/percent-yield-theoretical-yield", icon: "🧪" },
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
