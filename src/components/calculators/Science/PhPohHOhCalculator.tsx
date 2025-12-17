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

const LOG10 = Math.log10 || ((x: number) => Math.log(x) / Math.LN10);
const KW = 1e-14; // Ion product of water at 25°C (mol²/L²)

export default function PhPohHOhCalculator() {
  // Inputs: value and type (pH, pOH, [H+])
  const [inputs, setInputs] = useState<{ value?: string; type?: "pH" | "pOH" | "[H+]" }>({});

  const handleInputChange = useCallback((name: "value" | "type", value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const valRaw = inputs.value?.trim() ?? "";
    const type = inputs.type;

    if (!valRaw || !type) {
      return {
        value: "Waiting...",
        label: "Enter a value and select type",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Validate numeric input
    const valNum = Number(valRaw);
    if (isNaN(valNum)) {
      return {
        value: "Invalid input",
        label: "Input must be a number",
        subtext: "",
        warning: "Please enter a valid numeric value.",
        formulaUsed: null,
      };
    }

    // Validate ranges
    // pH and pOH typically range 0-14, but can be outside in extreme cases
    // [H+] must be > 0

    // Calculation variables
    let pH: number | null = null;
    let pOH: number | null = null;
    let Hconcentration: number | null = null;

    // Helper: format number with scientific notation if needed
    function formatNumber(num: number): string {
      if (num === 0) return "0 M";
      if (num >= 1e4 || num > 0 && num < 0.001) return num.toExponential(4) + " M";
      return num.toFixed(4) + " M";
    }
    function formatPH(num: number): string {
      if (num < 0.001 || num > 14.999) return num.toExponential(4);
      return num.toFixed(4);
    }

    // Calculate based on input type
    if (type === "pH") {
      if (valNum < 0 || valNum > 14) {
        return {
          value: "Out of range",
          label: "pH typically ranges from 0 to 14",
          subtext: "Extreme pH values are rare and may indicate errors.",
          warning: "pH value should be between 0 and 14 for most aqueous solutions.",
          formulaUsed: "pH = -log₁₀[H⁺]",
        };
      }
      pH = valNum;
      pOH = 14 - pH;
      Hconcentration = Math.pow(10, -pH);
    } else if (type === "pOH") {
      if (valNum < 0 || valNum > 14) {
        return {
          value: "Out of range",
          label: "pOH typically ranges from 0 to 14",
          subtext: "Extreme pOH values are rare and may indicate errors.",
          warning: "pOH value should be between 0 and 14 for most aqueous solutions.",
          formulaUsed: "pOH = -log₁₀[OH⁻]",
        };
      }
      pOH = valNum;
      pH = 14 - pOH;
      Hconcentration = Math.pow(10, -pH);
    } else if (type === "[H+]") {
      if (valNum <= 0) {
        return {
          value: "Invalid input",
          label: "[H⁺] must be &gt; 0",
          subtext: "",
          warning: "Hydrogen ion concentration must be a positive number.",
          formulaUsed: "[H⁺] concentration",
        };
      }
      Hconcentration = valNum;
      pH = -LOG10(Hconcentration);
      pOH = 14 - pH;
    } else {
      return {
        value: "Invalid type",
        label: "Select a valid input type",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Format outputs
    const pHDisplay = formatPH(pH);
    const pOHDisplay = formatPH(pOH);
    const HDisplay = formatNumber(Hconcentration);

    return {
      value: (
        <>
          <div>
            <strong>pH:</strong> {pHDisplay}
          </div>
          <div>
            <strong>pOH:</strong> {pOHDisplay}
          </div>
          <div>
            <strong>[H⁺]:</strong> {HDisplay}
          </div>
        </>
      ),
      label: "Calculated Values",
      subtext: "pH and pOH are unitless; [H⁺] is in Molar (mol/L).",
      warning: null,
      formulaUsed:
        "pH = -log₁₀[H⁺], pOH = 14 - pH, [H⁺] = 10⁻ᵖᴴ (at 25°C)",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is pH and why is it important?",
      answer:
        "pH is a measure of the acidity or basicity of an aqueous solution. It quantifies the concentration of hydrogen ions ([H⁺]) in the solution. pH values range from 0 (very acidic) to 14 (very basic), with 7 being neutral. Understanding pH is crucial in chemistry, biology, environmental science, and medicine to control reactions, maintain homeostasis, and monitor water quality.",
    },
    {
      question: "How are pH, pOH, and [H⁺] related?",
      answer:
        "pH and pOH are complementary measures of acidity and alkalinity, respectively, related by the equation pH + pOH = 14 at 25°C. The hydrogen ion concentration [H⁺] is related to pH by the formula pH = -log₁₀[H⁺]. These relationships allow scientists to convert between different acidity metrics easily, which is essential for titrations, buffer solutions, and biochemical processes.",
    },
    {
      question: "Why do we use logarithms in pH calculations?",
      answer:
        "The concentration of hydrogen ions in solutions can vary over many orders of magnitude, from about 1 mol/L to 10⁻¹⁴ mol/L. Using a logarithmic scale (pH) compresses this wide range into a manageable scale from 0 to 14. This makes it easier to compare acidity levels and understand chemical behavior without dealing with extremely large or small numbers directly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="value" className="font-semibold">
            Enter Value
          </Label>
          <Input
            id="value"
            type="number"
            step="any"
            placeholder="e.g. 7 or 1e-7"
            value={inputs.value ?? ""}
            onChange={(e) => handleInputChange("value", e.target.value)}
            aria-describedby="value-desc"
          />
          <p id="value-desc" className="text-sm text-slate-500 mt-1">
            Enter the numeric value of pH, pOH, or [H⁺] concentration.
          </p>
        </div>

        <div>
          <Label htmlFor="type" className="font-semibold">
            Select Input Type
          </Label>
          <Select
            onValueChange={(val) => handleInputChange("type", val)}
            value={inputs.type ?? ""}
            aria-label="Select input type"
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue placeholder="Choose pH, pOH, or [H⁺]" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pH">pH (Acidity)</SelectItem>
              <SelectItem value="pOH">pOH (Basicity)</SelectItem>
              <SelectItem value="[H+]">[H⁺] (Hydrogen Ion Concentration)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting state to current inputs (noop)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate pH, pOH, and [H⁺]"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
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
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white space-y-2">
                {results.value}
              </p>
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> pH and pOH are dimensionless logarithmic scales, while [H⁺] concentration is expressed in Molar (mol/L). These calculations assume standard conditions at 25°C.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding pH / pOH / [H⁺] Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The pH / pOH / [H⁺] Calculator is a precise scientific tool designed to interconvert between acidity metrics commonly used in chemistry and biology. pH measures the acidity of a solution by quantifying the hydrogen ion concentration on a logarithmic scale. pOH similarly measures the hydroxide ion concentration. These values are related by the fundamental equation pH + pOH = 14 at 25°C, reflecting the ion product of water.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows users to input any one of these values and instantly obtain the others, facilitating understanding and practical applications such as titrations, buffer preparation, and environmental water testing. It is essential for students, educators, and professionals working in laboratories, environmental science, medicine, and industrial chemistry.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The logarithmic nature of pH and pOH compresses a vast range of ion concentrations into a manageable scale, making it easier to interpret acidity levels. This tool ensures accurate conversions and helps avoid common mistakes in manual calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`pH = -log₁₀[H⁺]
pOH = -log₁₀[OH⁻]
pH + pOH = 14 (at 25°C)
[H⁺] = 10^{-pH} (Molar)

Where:
  pH = acidity level (unitless)
  pOH = basicity level (unitless)
  [H⁺] = hydrogen ion concentration (mol/L or M)
  [OH⁻] = hydroxide ion concentration (mol/L or M)
`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem: Calculate the pOH and [H⁺] concentration of a solution with pH = 3.5.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> pH = 3.5
          </li>
          <li>
            <strong>Step 1:</strong> Calculate pOH using pOH = 14 - pH = 14 - 3.5 = 10.5
          </li>
          <li>
            <strong>Step 2:</strong> Calculate [H⁺] concentration using [H⁺] = 10⁻³·⁵ ≈ 3.1623 × 10⁻⁴ M
          </li>
          <li>
            <strong>Result:</strong> pOH = 10.5 (unitless), [H⁺] = 3.1623e-4 M
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
      title="pH / pOH / [H+] Calculator"
      description="Calculate pH, pOH, and ion concentration. Convert between acidity metrics easily for chemistry and biology applications."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula:
          "pH = -log₁₀[H⁺]\npOH = 14 - pH\n[H⁺] = 10⁻ᵖᴴ (at 25°C)",
        variables: [
          { symbol: "pH", description: "Measure of acidity (unitless)" },
          { symbol: "pOH", description: "Measure of basicity (unitless)" },
          { symbol: "[H⁺]", description: "Hydrogen ion concentration (mol/L)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate pOH and [H⁺] for a solution with pH = 3.5.",
        steps: [
          { label: "1", explanation: "Calculate pOH using pOH = 14 - pH = 10.5." },
          { label: "2", explanation: "Calculate [H⁺] using [H⁺] = 10⁻³·⁵ ≈ 3.1623 × 10⁻⁴ M." },
        ],
        result: "pOH = 10.5 (unitless), [H⁺] = 3.1623e-4 M",
      }}
      relatedCalculators={[
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
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