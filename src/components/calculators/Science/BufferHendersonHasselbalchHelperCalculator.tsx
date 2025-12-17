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

export default function BufferHendersonHasselbalchHelperCalculator() {
  // Inputs: pKa, concentration of acid [HA], concentration of conjugate base [A-]
  // Optionally, user can input pH or ratio, but here we focus on pH calculation and ratio calculation from pKa and concentrations.
  const [inputs, setInputs] = useState({
    pKa: "",
    acidConcentration: "",
    baseConcentration: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only valid numeric input or empty string
    if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const pKa = parseFloat(inputs.pKa);
    const acidConc = parseFloat(inputs.acidConcentration);
    const baseConc = parseFloat(inputs.baseConcentration);

    // Validation
    if (
      isNaN(pKa) ||
      isNaN(acidConc) ||
      isNaN(baseConc) ||
      pKa <= 0 ||
      acidConc < 0 ||
      baseConc < 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid positive numbers",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (acidConc === 0 && baseConc === 0) {
      return {
        value: "Waiting...",
        label: "Acid and base concentrations cannot both be zero",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Henderson-Hasselbalch equation:
    // pH = pKa + log10([A-]/[HA])
    // Calculate ratio [A-]/[HA]
    // Handle zero acid or base concentrations carefully:
    // If acidConc = 0, ratio = Infinity => pH very high
    // If baseConc = 0, ratio = 0 => pH = pKa + log10(0) = -Infinity (very low pH)

    let ratio: number;
    let pH: number;

    if (acidConc === 0 && baseConc > 0) {
      // Pure base buffer, ratio infinite
      ratio = Infinity;
      pH = 14; // Approximate max pH for aqueous solutions
    } else if (baseConc === 0 && acidConc > 0) {
      // Pure acid buffer, ratio zero
      ratio = 0;
      pH = 0; // Approximate min pH for aqueous solutions
    } else if (acidConc === 0 && baseConc === 0) {
      // Already handled above, but just in case
      return {
        value: "Waiting...",
        label: "Acid and base concentrations cannot both be zero",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    } else {
      ratio = baseConc / acidConc;
      pH = pKa + Math.log10(ratio);
      // pH range check (0-14 typical)
      if (pH < 0) pH = 0;
      if (pH > 14) pH = 14;
    }

    // Format ratio: if very large or very small, use exponential notation
    const ratioDisplay =
      ratio === Infinity
        ? "∞"
        : ratio === 0
        ? "0"
        : ratio > 10000 || ratio < 0.001
        ? ratio.toExponential(4)
        : ratio.toFixed(4);

    // Format pH to 4 decimals
    const pHDisplay = pH.toFixed(4);

    return {
      value: `${pHDisplay}`,
      label: "Calculated pH",
      subtext: `Ratio [A⁻]/[HA] = ${ratioDisplay} (molar)`,
      warning: null,
      formulaUsed: "pH = pKa + log₁₀([A⁻]/[HA])",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Henderson–Hasselbalch equation used for?",
      answer:
        "The Henderson–Hasselbalch equation is fundamental in chemistry and biochemistry for calculating the pH of buffer solutions. It relates the pH, the acid dissociation constant (pKa), and the ratio of conjugate base to acid concentrations. This equation helps scientists design buffers that maintain stable pH in biological systems, pharmaceuticals, and laboratory experiments.",
    },
    {
      question: "Why is it important to maintain a specific pH in buffer solutions?",
      answer:
        "Maintaining a specific pH is crucial because many chemical reactions and biological processes are pH-dependent. Buffers resist changes in pH when small amounts of acid or base are added, ensuring optimal conditions. For example, enzymes in the human body function best within narrow pH ranges, and buffers help maintain these conditions in blood and cellular fluids.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="pKa" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Atom className="w-4 h-4 text-blue-600" /> pKa (Acid Dissociation Constant)
          </Label>
          <Input
            id="pKa"
            type="text"
            placeholder="e.g. 4.76"
            value={inputs.pKa}
            onChange={(e) => handleInputChange("pKa", e.target.value)}
            aria-describedby="pKaHelp"
          />
          <p id="pKaHelp" className="text-xs text-slate-500 mt-1">
            Enter the pKa value (unitless).
          </p>
        </div>

        <div>
          <Label htmlFor="acidConcentration" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <FlaskConicalIcon /> Acid Concentration [HA] (Molar)
          </Label>
          <Input
            id="acidConcentration"
            type="text"
            placeholder="e.g. 0.1"
            value={inputs.acidConcentration}
            onChange={(e) => handleInputChange("acidConcentration", e.target.value)}
            aria-describedby="acidConcHelp"
          />
          <p id="acidConcHelp" className="text-xs text-slate-500 mt-1">
            Enter concentration of acid [HA] in mol/L.
          </p>
        </div>

        <div>
          <Label htmlFor="baseConcentration" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <FlaskConicalIcon /> Base Concentration [A⁻] (Molar)
          </Label>
          <Input
            id="baseConcentration"
            type="text"
            placeholder="e.g. 0.1"
            value={inputs.baseConcentration}
            onChange={(e) => handleInputChange("baseConcentration", e.target.value)}
            aria-describedby="baseConcHelp"
          />
          <p id="baseConcHelp" className="text-xs text-slate-500 mt-1">
            Enter concentration of conjugate base [A⁻] in mol/L.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No calculation trigger needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          type="button"
          aria-label="Calculate pH"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ pKa: "", acidConcentration: "", baseConcentration: "" })}
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
              <strong>Science Fact:</strong> The Henderson–Hasselbalch equation helps design buffers that maintain stable pH in biological systems and lab experiments.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Buffer (Henderson–Hasselbalch) Helper
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Henderson–Hasselbalch equation is a fundamental tool in chemistry used to calculate the pH of buffer solutions. Buffers are solutions that resist changes in pH when small amounts of acid or base are added, making them essential in many scientific and industrial applications. This helper tool allows you to input the acid dissociation constant (pKa) and the molar concentrations of the acid and its conjugate base to calculate the resulting pH.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding how to manipulate buffer components is critical in fields such as biochemistry, pharmacology, and environmental science. For example, maintaining the correct pH is vital for enzyme activity in biological systems or for the stability of pharmaceuticals. This calculator aids in designing buffers with desired pH values by providing quick and accurate calculations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Note that the equation assumes ideal behavior and that the concentrations are in molarity (moles per liter). It is also important to ensure that the pKa value corresponds to the acid in question and that the concentrations are accurate for precise results.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`pH = pKa + log₁₀ \\left( \\frac{[A⁻]}{[HA]} \\right)

Where:
  pH = acidity of the solution (unitless)
  pKa = acid dissociation constant (unitless)
  [A⁻] = concentration of conjugate base (molar, mol/L)
  [HA] = concentration of acid (molar, mol/L)

Note: Use &lt; and &gt; for inequalities in text.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the Henderson–Hasselbalch equation to find the pH of a buffer solution.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> pKa = 4.76 (acetic acid), [HA] = 0.1 M, [A⁻] = 0.1 M.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate the ratio [A⁻]/[HA] = 0.1 / 0.1 = 1.
          </li>
          <li>
            <strong>Step 2:</strong> Apply the formula: pH = 4.76 + log₁₀(1) = 4.76 + 0 = 4.76.
          </li>
          <li>
            <strong>Result:</strong> The buffer solution has a pH of 4.76, which is ideal for applications requiring mildly acidic conditions.
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
      title="Buffer (Henderson–Hasselbalch) Helper"
      description="Design chemical buffers. Use the Henderson-Hasselbalch equation to calculate pH and ratio of conjugate base to acid."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "pH = pKa + log₁₀([A⁻]/[HA])",
        variables: [
          { symbol: "pH", description: "Acidity of the solution (unitless)" },
          { symbol: "pKa", description: "Acid dissociation constant (unitless)" },
          { symbol: "[A⁻]", description: "Concentration of conjugate base (molar, mol/L)" },
          { symbol: "[HA]", description: "Concentration of acid (molar, mol/L)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the pH of a buffer solution with pKa = 4.76, [HA] = 0.1 M, and [A⁻] = 0.1 M.",
        steps: [
          { label: "1", explanation: "Calculate the ratio [A⁻]/[HA] = 0.1 / 0.1 = 1." },
          { label: "2", explanation: "Apply the Henderson–Hasselbalch equation: pH = 4.76 + log₁₀(1) = 4.76." },
          { label: "3", explanation: "Resulting pH is 4.76, suitable for mildly acidic buffer applications." },
        ],
        result: "pH = 4.76 (unitless)",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
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

// Custom icon component for FlaskConical with safe icon usage
function FlaskConicalIcon(props: React.SVGProps<SVGSVGElement>) {
  // Using the safe icon "FlaskConical" imported from lucide-react
  return <Atom {...props} />;
}