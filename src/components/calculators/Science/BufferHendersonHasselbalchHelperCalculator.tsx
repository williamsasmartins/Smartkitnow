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

export default function BufferHendersonHasselbalchHelperCalculator() {
  // Inputs:
  // pKa: acid dissociation constant (log scale)
  // ratio: [A-]/[HA] ratio OR pH: solution pH
  // User chooses which to calculate: pH or ratio
  // Optionally, user can input pKa and either pH or ratio, and calculate the other.

  // State for inputs:
  // mode: "pH" or "ratio" - what to calculate
  // pKa: number
  // pH: number (optional)
  // ratio: number (optional)

  const [inputs, setInputs] = useState({
    pKa: "",
    pH: "",
    ratio: "",
    mode: "pH", // calculate pH or ratio
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic:
  // Henderson-Hasselbalch equation:
  // pH = pKa + log10([A-]/[HA])
  // So:
  // If mode === "pH", calculate pH given pKa and ratio
  // If mode === "ratio", calculate ratio given pKa and pH

  // Validate inputs: pKa must be a number, ratio and pH must be positive numbers where applicable.

  const results = useMemo(() => {
    const pKaNum = parseFloat(inputs.pKa);
    const pHNum = parseFloat(inputs.pH);
    const ratioNum = parseFloat(inputs.ratio);
    const mode = inputs.mode;

    // Validate pKa
    if (isNaN(pKaNum)) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Please enter a valid pKa value.",
        formulaUsed: null,
      };
    }

    if (mode === "pH") {
      // Calculate pH from pKa and ratio
      if (isNaN(ratioNum) || ratioNum <= 0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Please enter a valid positive ratio value.",
          formulaUsed: null,
        };
      }
      // pH = pKa + log10(ratio)
      const pHcalc = pKaNum + Math.log10(ratioNum);
      return {
        value: pHcalc.toFixed(4),
        label: "Calculated pH",
        subtext: `Using ratio [A⁻]/[HA] = ${ratioNum.toExponential(4)}`,
        warning: null,
        formulaUsed: "pH = pKₐ + log₁₀([A⁻]/[HA])",
      };
    } else if (mode === "ratio") {
      // Calculate ratio from pKa and pH
      if (isNaN(pHNum)) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Please enter a valid pH value.",
          formulaUsed: null,
        };
      }
      // ratio = 10^(pH - pKa)
      const ratioCalc = Math.pow(10, pHNum - pKaNum);
      return {
        value: ratioCalc.toExponential(4),
        label: "Calculated ratio [A⁻]/[HA]",
        subtext: `Using pH = ${pHNum.toFixed(4)}`,
        warning: null,
        formulaUsed: "pH = pKₐ + log₁₀([A⁻]/[HA])",
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
      question: "What is the Henderson–Hasselbalch equation used for?",
      answer:
        "The Henderson–Hasselbalch equation is used to estimate the pH of a buffer solution based on the concentration ratio of its conjugate base and acid forms. It helps chemists design buffers with desired pH values by relating pH, pKa, and the ratio of species.",
    },
    {
      question: "Why is the ratio [A⁻]/[HA] important in buffer solutions?",
      answer:
        "The ratio of conjugate base ([A⁻]) to acid ([HA]) determines the pH of the buffer solution. Adjusting this ratio shifts the pH according to the Henderson–Hasselbalch equation, allowing precise control over the solution's acidity or alkalinity.",
    },
    {
      question: "Can I use this calculator for strong acids or bases?",
      answer:
        "No, the Henderson–Hasselbalch equation applies to weak acids and their conjugate bases in buffer solutions. Strong acids or bases fully dissociate and do not form buffers, so this equation is not suitable for them.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="pKa" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-4 h-4 text-blue-600" /> pK<span className="align-top text-xs">a</span> (Acid Dissociation Constant)
          </Label>
          <Input
            id="pKa"
            type="number"
            step="0.0001"
            min="0"
            max="14"
            placeholder="e.g. 4.76"
            value={inputs.pKa}
            onChange={(e) => handleInputChange("pKa", e.target.value)}
            aria-describedby="pKaHelp"
          />
          <p id="pKaHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Typical range: 0 &lt; pK<span className="align-top text-xs">a</span> &lt; 14
          </p>
        </div>

        <div>
          <Label htmlFor="mode" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-4 h-4 text-blue-600" /> Calculate
          </Label>
          <Select
            value={inputs.mode}
            onValueChange={(val) => {
              // Clear dependent inputs on mode change
              if (val === "pH") {
                setInputs((prev) => ({ ...prev, mode: val, pH: "", ratio: prev.ratio }));
              } else {
                setInputs((prev) => ({ ...prev, mode: val, ratio: "", pH: prev.pH }));
              }
            }}
          >
            <SelectTrigger aria-label="Select calculation mode" className="w-full">
              <SelectValue placeholder="Select calculation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pH">Calculate pH</SelectItem>
              <SelectItem value="ratio">Calculate Ratio [A⁻]/[HA]</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {inputs.mode === "pH" ? (
          <div>
            <Label htmlFor="ratio" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
              <Orbit className="w-4 h-4 text-blue-600" /> Ratio [A⁻]/[HA]
            </Label>
            <Input
              id="ratio"
              type="number"
              step="any"
              min="0"
              placeholder="e.g. 1.0"
              value={inputs.ratio}
              onChange={(e) => handleInputChange("ratio", e.target.value)}
              aria-describedby="ratioHelp"
            />
            <p id="ratioHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Must be &gt; 0
            </p>
          </div>
        ) : (
          <div>
            <Label htmlFor="pH" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
              <Thermometer className="w-4 h-4 text-blue-600" /> pH of Solution
            </Label>
            <Input
              id="pH"
              type="number"
              step="any"
              min="0"
              max="14"
              placeholder="e.g. 7.4"
              value={inputs.pH}
              onChange={(e) => handleInputChange("pH", e.target.value)}
              aria-describedby="pHHelp"
            />
            <p id="pHHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Typical range: 0 &lt; pH &lt; 14
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ pKa: "", pH: "", ratio: "", mode: "pH" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Buffer (Henderson–Hasselbalch) Helper</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Henderson–Hasselbalch equation is a fundamental tool in chemistry used to estimate the pH of buffer solutions. Buffers resist changes in pH when small amounts of acid or base are added, making them essential in biological systems and chemical experiments. This equation relates the pH of a solution to the acid dissociation constant (pK<span className="align-top text-xs">a</span>) and the ratio of the concentrations of the conjugate base ([A⁻]) to the acid ([HA]).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By manipulating the ratio of conjugate base to acid, chemists can design buffers with specific pH values. The equation assumes the acid is weak and partially dissociates, which is typical for many biological buffers like phosphate or acetate buffers.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This helper tool allows you to calculate either the pH of a buffer given the pK<span className="align-top text-xs">a</span> and ratio, or the ratio needed to achieve a desired pH. Understanding and using this equation is crucial for preparing solutions that maintain stable pH in various chemical and biological applications.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`pH = pKₐ + log₁₀ \\left( \\frac{[A⁻]}{[HA]} \\right)

Where:
  pH   = acidity of the solution (unitless)
  pKₐ  = negative log of acid dissociation constant (unitless)
  [A⁻] = concentration of conjugate base (mol/L)
  [HA] = concentration of acid (mol/L)

Rearranged to find ratio:
  \\frac{[A⁻]}{[HA]} = 10^{pH - pKₐ}`}
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
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Henderson-Hasselbalch%20Equation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Henderson-Hasselbalch Equation - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Henderson-Hasselbalch Equation, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Henderson-Hasselbalch%20Equation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Henderson-Hasselbalch Equation - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Henderson-Hasselbalch Equation at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://chem.libretexts.org/Special:Search?query=Henderson-Hasselbalch%20Equation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Henderson-Hasselbalch Equation - Chemistry LibreTexts
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Access open-access chemistry textbooks and rigorous academic articles explaining Henderson-Hasselbalch Equation in detail for students and researchers.
            </p>
          </li>
          <li>
            <a href="https://pubchem.ncbi.nlm.nih.gov/#query=Henderson-Hasselbalch%20Equation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Henderson-Hasselbalch Equation - PubChem
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Search the PubChem database for chemical information, compound properties, and safety data related to Henderson-Hasselbalch Equation.
            </p>
          </li>
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
        formula:
          "pH = pKₐ + log₁₀([A⁻]/[HA])",
        variables: [
          { symbol: "pH", description: "Acidity of the solution (unitless)" },
          { symbol: "pKₐ", description: "Negative log of acid dissociation constant (unitless)" },
          { symbol: "[A⁻]", description: "Concentration of conjugate base (mol/L)" },
          { symbol: "[HA]", description: "Concentration of acid (mol/L)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the pH of a buffer solution with pKₐ = 4.76 and a conjugate base to acid ratio of 1.5.",
        steps: [
          { label: "1", explanation: "Identify given values: pKₐ = 4.76, ratio = 1.5" },
          { label: "2", explanation: "Apply Henderson–Hasselbalch equation: pH = 4.76 + log₁₀(1.5)" },
          { label: "3", explanation: "Calculate log₁₀(1.5) ≈ 0.1761" },
          { label: "4", explanation: "Sum: pH ≈ 4.76 + 0.1761 = 4.9361" },
        ],
        result: "The buffer solution has a pH of approximately 4.936.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Heat Transfer (Conduction) Calculator", url: "/science/heat-transfer-conduction", icon: "🔥" },
        { title: "Blackbody Peak (Wien's Law) Estimator", url: "/science/blackbody-peak-wien-law-estimator", icon: "🧪" },
        { title: "Dilution Calculator (C₁V₁ = C₂V₂)", url: "/science/dilution-c1v1-c2v2", icon: "🧪" },
        { title: "Gravity on Other Planets Calculator", url: "/science/gravity-on-other-planets-calculator", icon: "🪐" },
        { title: "Molarity / Moles / Volume Calculator", url: "/science/molarity-moles-volume", icon: "🧪" },
        { title: "ppm / ppb Concentration Converter", url: "/science/ppm-ppb-concentration-converter", icon: "🧪" },
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