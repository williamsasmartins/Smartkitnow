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

const periodicTable = {
  H: 1.00794,
  He: 4.002602,
  Li: 6.941,
  Be: 9.012182,
  B: 10.811,
  C: 12.0107,
  N: 14.0067,
  O: 15.9994,
  F: 18.9984032,
  Ne: 20.1797,
  Na: 22.98977,
  Mg: 24.305,
  Al: 26.981538,
  Si: 28.0855,
  P: 30.973761,
  S: 32.065,
  Cl: 35.453,
  Ar: 39.948,
  K: 39.0983,
  Ca: 40.078,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
  Ag: 107.8682,
  Au: 196.96655,
  Pb: 207.2,
  // Add more elements as needed
};

function parseFormula(formula: string) {
  // Parses a chemical formula string into an object { element: count }
  // Supports nested parentheses and multipliers
  // Example: "C6H12O6", "Ca(OH)2", "Al2(SO4)3"
  // Returns null if invalid formula

  const stack: Array<Record<string, number>> = [{}];
  let i = 0;

  while (i < formula.length) {
    const char = formula[i];

    if (char === "(") {
      stack.push({});
      i++;
    } else if (char === ")") {
      i++;
      // parse multiplier after )
      let multiplierStr = "";
      while (i < formula.length && /[0-9]/.test(formula[i])) {
        multiplierStr += formula[i];
        i++;
      }
      const multiplier = multiplierStr ? parseInt(multiplierStr, 10) : 1;
      const popped = stack.pop();
      if (!popped) return null; // unbalanced parentheses
      const top = stack[stack.length - 1];
      for (const el in popped) {
        top[el] = (top[el] || 0) + popped[el] * multiplier;
      }
    } else if (/[A-Z]/.test(char)) {
      // Parse element symbol
      let element = char;
      i++;
      if (i < formula.length && /[a-z]/.test(formula[i])) {
        element += formula[i];
        i++;
      }
      if (!(element in periodicTable)) {
        return null; // unknown element
      }
      // Parse count
      let countStr = "";
      while (i < formula.length && /[0-9]/.test(formula[i])) {
        countStr += formula[i];
        i++;
      }
      const count = countStr ? parseInt(countStr, 10) : 1;
      const top = stack[stack.length - 1];
      top[element] = (top[element] || 0) + count;
    } else if (char === " ") {
      // skip spaces
      i++;
    } else {
      // invalid character
      return null;
    }
  }
  if (stack.length !== 1) return null; // unbalanced parentheses
  return stack[0];
}

export default function MolarMassCalculator() {
  const [inputs, setInputs] = useState({ formula: "" });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const formula = inputs.formula.trim();

    if (!formula) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "Molar Mass = Σ (Atomic Mass × Number of Atoms)",
      };
    }

    const parsed = parseFormula(formula);
    if (!parsed) {
      return {
        value: "Invalid formula",
        label: "",
        subtext: "",
        warning: "Please enter a valid chemical formula using correct element symbols and syntax.",
        formulaUsed: "Molar Mass = Σ (Atomic Mass × Number of Atoms)",
      };
    }

    let molarMass = 0;
    for (const element in parsed) {
      const atomicMass = periodicTable[element];
      const count = parsed[element];
      molarMass += atomicMass * count;
    }

    // Format molar mass with 4 decimals
    const molarMassStr = molarMass.toFixed(4) + " g/mol";

    return {
      value: molarMassStr,
      label: `Molar mass of ${formula}`,
      subtext: "Sum of atomic masses of all atoms in the molecule (units: g/mol)",
      warning: null,
      formulaUsed: "Molar Mass = Σ (Atomic Mass × Number of Atoms)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is molar mass and why is it important?",
      answer:
        "Molar mass is the mass of one mole of a substance, expressed in grams per mole (g/mol). It is essential in chemistry for converting between moles and grams, allowing precise measurement of substances in reactions and calculations.",
    },
    {
      question: "How do I write chemical formulas correctly for this calculator?",
      answer:
        "Use standard chemical notation with element symbols starting with a capital letter followed by lowercase letters if needed, and numbers indicating atom counts. Parentheses can group atoms with multipliers, e.g., Ca(OH)2. Avoid spaces or invalid characters.",
    },
    {
      question: "Can this calculator handle complex molecules with nested groups?",
      answer:
        "Yes, the calculator supports nested parentheses and multipliers, allowing you to input complex chemical formulas accurately. It parses the formula to sum atomic masses accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="formula" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 mb-2">
          <Atom className="w-5 h-5 text-blue-600" />
          Chemical Formula
        </Label>
        <Input
          id="formula"
          type="text"
          placeholder="e.g. H2O, C6H12O6, Ca(OH)2"
          value={inputs.formula || ""}
          onChange={(e) => handleInputChange("formula", e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-describedby="formula-help"
        />
        <p id="formula-help" className="text-sm text-slate-500 mt-1">
          Enter the chemical formula using element symbols and numbers. Use parentheses for groups.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate molar mass"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ formula: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset input"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-label="Molar mass result">
                {results.value}
              </p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Molar Mass Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The molar mass of a substance is the mass of one mole of its molecules or atoms, expressed in grams per mole (g/mol). It is a fundamental property in chemistry that allows scientists and students to convert between the amount of substance (in moles) and its mass (in grams). This calculator helps you find the molar mass of any chemical compound by summing the atomic masses of its constituent elements according to their quantities in the formula.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Chemical formulas represent molecules by listing the elements and the number of atoms of each. For example, water is H<sub>2</sub>O, meaning two hydrogen atoms and one oxygen atom. More complex molecules may include groups of atoms in parentheses with multipliers, such as Ca(OH)<sub>2</sub>. This calculator parses such formulas accurately, including nested groups, to compute the total molar mass.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding molar mass is essential for stoichiometry, reaction calculations, and preparing solutions in laboratories. By entering a valid chemical formula, you can quickly obtain the molar mass and use it for further scientific calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Molar Mass (M) = Σ (Atomic Mass of Element_i × Number of Atoms_i)

Where:
  - Atomic Mass of Element_i: mass of one atom of element i (g/mol)
  - Number of Atoms_i: count of atoms of element i in the molecule

Example:
  For H2O:
    M = (2 × 1.00794) + (1 × 15.9994) = 18.01528 g/mol`}
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
            <a href="https://en.wikipedia.org/wiki/Special:Search?search=Molar%20Mass%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Molar Mass Calculation - Wikipedia
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              A comprehensive encyclopedia article providing an in-depth overview of Molar Mass Calculation, including historical context, mathematical derivations, and key applications.
            </p>
          </li>
          <li>
            <a href="https://www.khanacademy.org/search?page_search_query=Molar%20Mass%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Molar Mass Calculation - Khan Academy
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Watch free educational video tutorials and complete interactive practice exercises on Molar Mass Calculation at Khan Academy, perfect for visual learners.
            </p>
          </li>
          <li>
            <a href="https://chem.libretexts.org/Special:Search?query=Molar%20Mass%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Molar Mass Calculation - Chemistry LibreTexts
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Access open-access chemistry textbooks and rigorous academic articles explaining Molar Mass Calculation in detail for students and researchers.
            </p>
          </li>
          <li>
            <a href="https://pubchem.ncbi.nlm.nih.gov/#query=Molar%20Mass%20Calculation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              Molar Mass Calculation - PubChem
            </a>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Search the PubChem database for chemical information, compound properties, and safety data related to Molar Mass Calculation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Molar Mass Calculator"
      description="Calculate Molar Mass. Find the molecular weight of any chemical compound by summing atomic masses from the periodic table."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Molar Mass (M) = Σ (Atomic Mass × Number of Atoms)",
        variables: [
          { symbol: "M", description: "Molar Mass of the compound (g/mol)" },
          { symbol: "Atomic Mass", description: "Atomic mass of each element (g/mol)" },
          { symbol: "Number of Atoms", description: "Count of atoms of each element in the molecule" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the molar mass of glucose (C6H12O6).",
        steps: [
          { label: "1", explanation: "Identify the number of atoms: C=6, H=12, O=6." },
          { label: "2", explanation: "Multiply each by atomic masses: C=12.0107, H=1.00794, O=15.9994." },
          { label: "3", explanation: "Sum all: (6×12.0107) + (12×1.00794) + (6×15.9994) = 180.156 g/mol." },
        ],
        result: "The molar mass of glucose is 180.156 g/mol.",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Snell’s Law & Critical Angle Calculator", url: "/science/snells-law-critical-angle", icon: "🌈" },
        { title: "Molarity / Moles / Volume Calculator", url: "/science/molarity-moles-volume", icon: "🧪" },
        { title: "Uniform Circular Motion Calculator", url: "/science/uniform-circular-motion-centripetal", icon: "🚀" },
        { title: "Power & Efficiency Calculator", url: "/science/power-efficiency-calculator", icon: "🔥" },
        { title: "Blackbody Peak (Wien's Law) Estimator", url: "/science/blackbody-peak-wien-law-estimator", icon: "🧪" },
        { title: "Gravity on Other Planets Calculator", url: "/science/gravity-on-other-planets-calculator", icon: "🪐" },
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