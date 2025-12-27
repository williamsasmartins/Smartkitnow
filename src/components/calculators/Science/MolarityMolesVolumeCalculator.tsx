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

export default function MolarityMolesVolumeCalculator() {
  // Inputs: molarity (M, mol/L), moles (n, mol), volume (V, L)
  // Formula: M = n / V  =>  n = M * V  =>  V = n / M

  const [inputs, setInputs] = useState({
    molarity: "",
    moles: "",
    volume: "",
    calculateFor: "molarity", // "molarity" | "moles" | "volume"
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { molarity, moles, volume, calculateFor } = inputs;

    // Parse inputs to floats
    const M = parseFloat(molarity);
    const n = parseFloat(moles);
    const V = parseFloat(volume);

    // Validation helpers
    const isPositiveNumber = (x) => !isNaN(x) && x > 0;

    // Result object template
    let value = "Waiting...";
    let label = "";
    const subtext = "";
    let warning = null;
    let formulaUsed = "";

    // Calculation logic
    if (calculateFor === "molarity") {
      // Calculate M = n / V
      if (!isPositiveNumber(n) || !isPositiveNumber(V)) {
        warning = "Please enter positive numbers for moles and volume.";
      } else {
        const molarityCalc = n / V;
        value = molarityCalc.toExponential(4) + " mol/L";
        label = "Molarity (M)";
        formulaUsed = "M = n / V";
      }
    } else if (calculateFor === "moles") {
      // Calculate n = M * V
      if (!isPositiveNumber(M) || !isPositiveNumber(V)) {
        warning = "Please enter positive numbers for molarity and volume.";
      } else {
        const molesCalc = M * V;
        value = molesCalc.toExponential(4) + " mol";
        label = "Moles (n)";
        formulaUsed = "n = M × V";
      }
    } else if (calculateFor === "volume") {
      // Calculate V = n / M
      if (!isPositiveNumber(n) || !isPositiveNumber(M)) {
        warning = "Please enter positive numbers for moles and molarity.";
      } else {
        const volumeCalc = n / M;
        value = volumeCalc.toExponential(4) + " L";
        label = "Volume (V)";
        formulaUsed = "V = n / M";
      }
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [inputs]);

  const faqs = [
    {
      question: "What is molarity and why is it important?",
      answer:
        "Molarity (M) is a measure of the concentration of a solute in a solution, expressed as moles of solute per liter of solution. It is essential in chemistry for preparing solutions with precise concentrations, enabling accurate reactions and analyses in laboratories.",
    },
    {
      question: "How do I decide which variable to calculate?",
      answer:
        "You choose the variable to calculate based on what you know and what you need. For example, if you know the moles of solute and volume of solution, calculate molarity. If you know molarity and volume, calculate moles. This flexibility helps in various lab scenarios.",
    },
    {
      question: "Can I use this calculator for any chemical solution?",
      answer:
        "Yes, this calculator works for any chemical solution where molarity, moles, and volume relationships apply. Ensure your inputs are in correct units: moles in mol, volume in liters (L), and molarity in mol/L for accurate results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Select variable to calculate */}
      <div>
        <Label htmlFor="calculateFor" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <FlaskConical className="w-5 h-5 text-blue-600" /> Calculate for:
          <Info className="w-4 h-4 text-slate-400" />
        </Label>
        <Select
          id="calculateFor"
          value={inputs.calculateFor}
          onValueChange={(value) => handleInputChange("calculateFor", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="molarity">Molarity (M)</SelectItem>
            <SelectItem value="moles">Moles (n)</SelectItem>
            <SelectItem value="volume">Volume (V)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Molarity input */}
        <div>
          <Label htmlFor="molarity" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Scale className="w-5 h-5 text-green-600" /> Molarity (M, mol/L)
          </Label>
          <Input
            id="molarity"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.5"
            value={inputs.molarity}
            onChange={(e) => handleInputChange("molarity", e.target.value)}
            disabled={inputs.calculateFor === "molarity"}
            aria-describedby="molarity-desc"
          />
          <p id="molarity-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter molarity in mol/L. Disabled if calculating molarity.
          </p>
        </div>

        {/* Moles input */}
        <div>
          <Label htmlFor="moles" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Atom className="w-5 h-5 text-purple-600" /> Moles (n, mol)
          </Label>
          <Input
            id="moles"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.1"
            value={inputs.moles}
            onChange={(e) => handleInputChange("moles", e.target.value)}
            disabled={inputs.calculateFor === "moles"}
            aria-describedby="moles-desc"
          />
          <p id="moles-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter moles in mol. Disabled if calculating moles.
          </p>
        </div>

        {/* Volume input */}
        <div>
          <Label htmlFor="volume" className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Waves className="w-5 h-5 text-teal-600" /> Volume (V, L)
          </Label>
          <Input
            id="volume"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 0.2"
            value={inputs.volume}
            onChange={(e) => handleInputChange("volume", e.target.value)}
            disabled={inputs.calculateFor === "volume"}
            aria-describedby="volume-desc"
          />
          <p id="volume-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter volume in liters (L). Disabled if calculating volume.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting inputs again (no inline logic)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              molarity: "",
              moles: "",
              volume: "",
              calculateFor: "molarity",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider" aria-label="Formula used">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-label="Result value">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium" aria-label="Result label">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2" aria-label="Additional notes">
                  {results.subtext}
                </p>
              )}
              {results.warning && (
                <div
                  className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left"
                  role="alert"
                  aria-live="assertive"
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
          Understanding Molarity / Moles / Volume Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Molarity / Moles / Volume Calculator is an essential tool for chemistry students and professionals to accurately determine the concentration, amount, or volume of a chemical solution. Molarity (M) represents the number of moles of solute per liter of solution, a fundamental concept in solution chemistry. This calculator allows you to compute molarity, moles, or volume by providing any two of these values, ensuring precise preparation and analysis of chemical solutions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding the relationship between molarity, moles, and volume is crucial in laboratory work, where accurate measurements affect reaction outcomes. The formula <code>M = n / V</code> connects these variables, where <code>M</code> is molarity in mol/L, <code>n</code> is moles of solute in mol, and <code>V</code> is volume of solution in liters. This calculator simplifies these calculations, reducing errors and saving time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always ensure your inputs are in the correct units: moles in mol, volume in liters (L), and molarity in mol/L. If you encounter any warnings, double-check that all values are positive numbers, as negative or zero values are not physically meaningful in this context.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`M = n / V

Where:
M = Molarity (mol/L)
n = Moles of solute (mol)
V = Volume of solution (L)

Rearranged formulas:
n = M × V
V = n / M

Note: All values must be positive numbers.`}
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
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Molarity" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Molarity - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Molarity, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Molarity" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Molarity - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Molarity at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://chem.libretexts.org/Special:Search?query=Molarity" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Molarity - Chemistry LibreTexts
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Access open-access chemistry textbooks and rigorous academic articles explaining Molarity in detail for students and researchers.
            </p>
          </li>
          <li>
            <a href="https://pubchem.ncbi.nlm.nih.gov/#query=Molarity" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Molarity - PubChem
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Search the PubChem database for chemical information, compound properties, and safety data related to Molarity.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Molarity / Moles / Volume Calculator"
      description="Calculate Molarity, Moles, and Volume. The essential tool for preparing chemical solutions and performing lab calculations."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "M = n / V",
        variables: [
          { symbol: "M", description: "Molarity (mol/L)" },
          { symbol: "n", description: "Moles of solute (mol)" },
          { symbol: "V", description: "Volume of solution (L)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You have 0.5 moles of solute dissolved in 2 liters of solution. Calculate the molarity of the solution.",
        steps: [
          {
            label: "1",
            explanation: "Identify known values: n = 0.5 mol, V = 2 L.",
          },
          {
            label: "2",
            explanation: "Use formula M = n / V to find molarity.",
          },
          {
            label: "3",
            explanation: "Calculate M = 0.5 mol / 2 L = 0.25 mol/L.",
          },
        ],
        result: "The molarity of the solution is 0.25 mol/L.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Thin Lens Solver", url: "/science/thin-lens-solver", icon: "🌈" },
        { title: "Capacitor/Inductor Reactance Calculator", url: "/science/reactance-capacitor-inductor-educational", icon: "⚡" },
        { title: "pH / pOH / [H+] Calculator", url: "/science/ph-poh-h-oh-calculator", icon: "🧪" },
        { title: "Percent Composition by Mass", url: "/science/percent-composition-by-mass", icon: "🧪" },
        { title: "ppm / ppb Concentration Converter", url: "/science/ppm-ppb-concentration-converter", icon: "🧪" },
        { title: "Molar Mass Calculator", url: "/science/molar-mass-calculator", icon: "🧪" },
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