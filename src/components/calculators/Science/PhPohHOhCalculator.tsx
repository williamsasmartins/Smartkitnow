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

export default function PhPohHOhCalculator() {
  // Inputs: value and type (pH, pOH, or [H+])
  const [inputs, setInputs] = useState({
    inputType: "pH",
    inputValue: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { inputType, inputValue } = inputs;

    if (!inputValue || inputValue.trim() === "") {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    // Parse input number
    const val = Number(inputValue);
    if (isNaN(val)) {
      return {
        value: "Invalid input",
        label: "",
        subtext: "",
        warning: "Please enter a valid numeric value.",
        formulaUsed: "",
      };
    }

    // Constants
    const Kw = 1e-14; // Ion product of water at 25°C (mol²/L²)

    // Validate input ranges and calculate
    // pH and pOH range: 0 to 14 (typical)
    // [H+] range: 1e-14 to 1 mol/L (typical)
    // Use scientific notation for very small/large numbers

    let pH: number | null = null;
    let pOH: number | null = null;
    let H_conc: number | null = null;
    let warning: string | null = null;
    let formulaUsed = "";

    if (inputType === "pH") {
      if (val < 0 || val > 14) {
        warning = "pH typically ranges from 0 to 14.";
      }
      pH = val;
      pOH = 14 - pH;
      H_conc = Math.pow(10, -pH);
      formulaUsed = "pH = -log₁₀[H⁺]";
    } else if (inputType === "pOH") {
      if (val < 0 || val > 14) {
        warning = "pOH typically ranges from 0 to 14.";
      }
      pOH = val;
      pH = 14 - pOH;
      H_conc = Math.pow(10, -pH);
      formulaUsed = "pOH = -log₁₀[OH⁻], pH + pOH = 14";
    } else if (inputType === "[H+]") {
      if (val <= 0) {
        return {
          value: "Invalid input",
          label: "",
          subtext: "",
          warning: "Concentration [H⁺] must be &gt; 0.",
          formulaUsed: "",
        };
      }
      H_conc = val;
      pH = -Math.log10(H_conc);
      pOH = 14 - pH;
      formulaUsed = "[H⁺] = 10^(-pH)";
      if (H_conc > 1 || H_conc < 1e-14) {
        warning = "Typical [H⁺] ranges from 1e-14 to 1 mol/L.";
      }
    }

    // Format values with scientific notation if needed
    const formatConc = (c: number) =>
      c < 0.001 || c > 1000 ? c.toExponential(4) : c.toFixed(6);

    const formattedPH = pH !== null ? pH.toFixed(3) : "-";
    const formattedPOH = pOH !== null ? pOH.toFixed(3) : "-";
    const formattedHConc = H_conc !== null ? formatConc(H_conc) : "-";

    return {
      value: (
        <>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white">{formattedPH}</p>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">pH</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-indigo-900 dark:text-indigo-300">{formattedPOH}</p>
              <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">pOH</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold text-teal-900 dark:text-teal-300">{formattedHConc}</p>
              <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">[H⁺] (mol/L)</p>
            </div>
          </div>
        </>
      ),
      label: "Calculated acidity/basicity metrics",
      subtext: "pH and pOH are unitless; [H⁺] is in mol/L (molarity).",
      warning,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the relationship between pH, pOH, and [H⁺]?",
      answer:
        "pH measures the acidity of a solution and is defined as the negative logarithm of the hydrogen ion concentration: pH = -log₁₀[H⁺]. pOH measures hydroxide ion concentration similarly. At 25°C, pH + pOH = 14. Knowing any one of these values allows calculation of the others, which is essential in chemistry and biology to understand solution properties.",
    },
    {
      question: "Why does pH range typically between 0 and 14?",
      answer:
        "The pH scale is derived from the ion product of water (Kw = 1.0 × 10⁻¹⁴ at 25°C). Pure water has equal concentrations of H⁺ and OH⁻ ions at 1.0 × 10⁻⁷ mol/L, corresponding to pH 7. Acidic solutions have pH &lt; 7, basic solutions have pH &gt; 7. Extreme pH values outside 0-14 are possible but rare and usually under special conditions.",
    },
    {
      question: "How precise are pH calculations using this tool?",
      answer:
        "This calculator assumes standard conditions at 25°C and uses the ion product of water (Kw = 1.0 × 10⁻¹⁴). Real-world pH can vary with temperature and ionic strength. For precise laboratory measurements, temperature corrections and activity coefficients should be considered. This tool provides a reliable estimate for educational and general use.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-3">
        <Label htmlFor="inputType" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <FlaskConical className="w-5 h-5 text-blue-600" /> Select Input Type
        </Label>
        <Select
          value={inputs.inputType}
          onValueChange={(val) => handleInputChange("inputType", val)}
          aria-label="Select input type"
        >
          <SelectTrigger id="inputType" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pH">pH (Acidity)</SelectItem>
            <SelectItem value="pOH">pOH (Basicity)</SelectItem>
            <SelectItem value="[H+]">[H⁺] Concentration (mol/L)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="inputValue" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <Scale className="w-5 h-5 text-indigo-600" /> Enter Value
        </Label>
        <Input
          id="inputValue"
          type="number"
          step="any"
          min={inputs.inputType === "[H+]" ? "0" : undefined}
          placeholder={
            inputs.inputType === "pH"
              ? "e.g. 7.00"
              : inputs.inputType === "pOH"
              ? "e.g. 7.00"
              : "e.g. 1.0e-7"
          }
          value={inputs.inputValue}
          onChange={(e) => handleInputChange("inputValue", e.target.value)}
          aria-describedby="inputValueHelp"
        />
        <p id="inputValueHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {inputs.inputType === "pH" || inputs.inputType === "pOH"
            ? "Typical range: 0 to 14"
            : "Typical range: 1.0e-14 to 1 mol/L"}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No explicit action needed; calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate pH, pOH, and [H+]"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ inputType: "pH", inputValue: "" })}
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
              <div className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</div>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding pH / pOH / [H⁺] Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The pH / pOH / [H⁺] Calculator is a fundamental tool in chemistry and biology that helps quantify the acidity or basicity of aqueous solutions. pH is the negative logarithm of the hydrogen ion concentration, indicating how acidic a solution is, while pOH measures the hydroxide ion concentration. These two values are intrinsically linked by the relation pH + pOH = 14 at 25°C. This calculator allows users to input any one of these values and instantly find the others, facilitating understanding of chemical equilibria and reactions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Acidity and basicity influence many biological processes, environmental conditions, and industrial applications. For example, enzyme activity in living organisms often depends on pH, and water quality is assessed by measuring pH levels. Understanding the relationship between pH, pOH, and hydrogen ion concentration is essential for students and professionals working in science fields.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses precise scientific constants and logarithmic relationships to ensure accurate results. It also warns users when inputs fall outside typical ranges, promoting safe and meaningful interpretations. By converting between these acidity metrics, users gain deeper insight into solution chemistry and can apply this knowledge in laboratory or educational settings.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`pH = -log₁₀[H⁺]

pOH = -log₁₀[OH⁻]

At 25°C: pH + pOH = 14

[H⁺] = 10^(-pH)

[OH⁻] = 10^(-pOH)

Kw = [H⁺] × [OH⁻] = 1.0 × 10⁻¹⁴ (mol²/L²)`}
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
      title="pH / pOH / [H+] Calculator"
      description="Calculate pH, pOH, and ion concentration. Convert between acidity metrics easily for chemistry and biology applications."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `pH = -log₁₀[H⁺]\npOH = -log₁₀[OH⁻]\npH + pOH = 14\n[H⁺] = 10^{-pH}\nKw = [H⁺][OH⁻] = 1.0 × 10^{-14} mol²/L²`,
        variables: [
          { symbol: "pH", description: "Measure of acidity (unitless)" },
          { symbol: "pOH", description: "Measure of basicity (unitless)" },
          { symbol: "[H⁺]", description: "Hydrogen ion concentration (mol/L)" },
          { symbol: "[OH⁻]", description: "Hydroxide ion concentration (mol/L)" },
          { symbol: "Kw", description: "Ion product of water at 25°C (1.0 × 10⁻¹⁴ mol²/L²)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate pOH and [H⁺] concentration for a solution with pH = 3.5.",
        steps: [
          { label: "1", explanation: "Given pH = 3.5, calculate pOH using pH + pOH = 14." },
          { label: "2", explanation: "pOH = 14 - 3.5 = 10.5." },
          { label: "3", explanation: "Calculate [H⁺] using [H⁺] = 10^(-pH) = 10^(-3.5) ≈ 3.1623 × 10⁻⁴ mol/L." },
        ],
        result: "pOH = 10.5 (unitless), [H⁺] ≈ 3.1623e-4 mol/L",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Snell’s Law & Critical Angle Calculator", url: "/science/snells-law-critical-angle", icon: "🌈" },
        { title: "Ideal Gas Law Calculator", url: "/science/ideal-gas-law-pv-nrt", icon: "🧪" },
        { title: "Force, Work & Energy Calculator", url: "/science/force-work-energy-calculator", icon: "🚀" },
        { title: "Heat Transfer (Conduction) Calculator", url: "/science/heat-transfer-conduction", icon: "🔥" },
        { title: "Buffer (Henderson–Hasselbalch) Helper", url: "/science/buffer-henderson-hasselbalch-helper", icon: "🧪" },
        { title: "Photon Energy Calculator", url: "/science/photon-energy-e-hf", icon: "🔥" },
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