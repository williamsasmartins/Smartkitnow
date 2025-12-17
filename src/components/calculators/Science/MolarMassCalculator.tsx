import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import {
  Atom,
  FlaskConical,
  Zap,
  Orbit,
  Thermometer,
  Scale,
  Waves,
  Info,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

// Atomic masses (g/mol) for common elements (can be extended)
const ATOMIC_MASSES: Record<string, number> = {
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
  Na: 22.98976928,
  Mg: 24.3050,
  Al: 26.9815386,
  Si: 28.0855,
  P: 30.973762,
  S: 32.065,
  Cl: 35.453,
  Ar: 39.948,
  K: 39.0983,
  Ca: 40.078,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
  Ag: 107.8682,
  Au: 196.966569,
  Hg: 200.59,
  Pb: 207.2,
};

type ParsedElement = {
  symbol: string;
  count: number;
};

function parseFormula(formula: string): ParsedElement[] | null {
  // Regex to parse elements and counts, e.g. H2, O, C12
  // This is a simple parser and does not support parentheses or nested groups.
  // For educational tool, this is sufficient.
  const regex = /([A-Z][a-z]?)(\d*)/g;
  const elements: ParsedElement[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(formula)) !== null) {
    const symbol = match[1];
    const countStr = match[2];
    if (!(symbol in ATOMIC_MASSES)) return null; // Unknown element
    const count = countStr === "" ? 1 : parseInt(countStr, 10);
    if (isNaN(count) || count <= 0) return null; // Invalid count
    elements.push({ symbol, count });
  }
  if (elements.length === 0) return null;
  return elements;
}

export default function MolarMassCalculator() {
  const [inputs, setInputs] = useState<{ formula: string }>({ formula: "" });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const formulaRaw = inputs.formula.trim();

    if (formulaRaw.length === 0) {
      return {
        value: "Waiting...",
        label: "Enter chemical formula",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Parse formula
    const parsed = parseFormula(formulaRaw);

    if (!parsed) {
      return {
        value: "",
        label: "Invalid formula",
        subtext: "Please enter a valid chemical formula using element symbols and counts (e.g., H2O, CO2).",
        warning: "Unknown element symbol or invalid format detected.",
        formulaUsed: null,
      };
    }

    // Calculate molar mass
    let molarMass = 0;
    for (const { symbol, count } of parsed) {
      molarMass += ATOMIC_MASSES[symbol] * count;
    }

    // Format output: use scientific notation if > 10000 or < 0.001
    const displayVal =
      molarMass > 10000 || molarMass < 0.001
        ? molarMass.toExponential(4)
        : molarMass.toFixed(4);

    // Build formula used string
    // Sum of (count × atomic mass)
    const formulaUsed = parsed
      .map(
        ({ symbol, count }) =>
          `${count} × ${symbol}(${ATOMIC_MASSES[symbol].toFixed(4)})`
      )
      .join(" + ");

    return {
      value: `${displayVal} g/mol`,
      label: "Molar Mass",
      subtext: `Sum of atomic masses of elements in ${formulaRaw}`,
      warning: null,
      formulaUsed: `Molar Mass = ${formulaUsed}`,
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is molar mass and why is it important?",
      answer:
        "Molar mass is the mass of one mole of a substance, typically expressed in grams per mole (g/mol). It is crucial in chemistry for converting between the mass of a substance and the amount in moles, enabling precise stoichiometric calculations in reactions. Understanding molar mass helps chemists measure reactants and products accurately in lab experiments and industrial processes.",
    },
    {
      question: "How do I write a chemical formula correctly for this calculator?",
      answer:
        "Chemical formulas should use standard element symbols with correct capitalization, followed by optional numeric subscripts indicating the number of atoms. For example, water is H2O (two hydrogens, one oxygen). Avoid spaces, parentheses, or complex notations as this calculator supports simple linear formulas only. Correct input ensures accurate molar mass calculation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="formula" className="font-semibold mb-1 flex items-center gap-2">
          <Atom className="w-5 h-5 text-blue-600" /> Chemical Formula
        </Label>
        <Input
          id="formula"
          placeholder="e.g., H2O, CO2, C6H12O6"
          value={inputs.formula}
          onChange={(e) => handleInputChange("formula", e.target.value)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          className="text-lg font-mono"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          type="button"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ formula: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Molar mass is essential for lab
              titrations, chemical synthesis, and understanding molecular
              composition. Always ensure your chemical formula is correct and
              units are consistent.
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
          Understanding Molar Mass Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Molar mass is the mass of one mole of a chemical compound, expressed
          in grams per mole (g/mol). It is calculated by summing the atomic
          masses of all atoms present in the molecular formula. For example,
          water (H<sub>2</sub>O) has a molar mass of approximately 18.015 g/mol,
          calculated as 2 × 1.00794 (hydrogen) + 15.9994 (oxygen). This
          calculator helps you find the molar mass of any compound by entering
          its chemical formula.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Accurate molar mass calculations are fundamental in chemistry and
          related sciences. They enable precise conversions between mass and
          moles, which is essential for stoichiometry, reaction yield
          calculations, and preparing solutions with exact concentrations.
          Whether you are a student, educator, or professional scientist, this
          tool supports your understanding and application of chemical
          principles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember to input chemical formulas using correct element symbols and
          counts. This calculator currently supports simple linear formulas
          without parentheses or complex groupings. For example, glucose is
          C6H12O6, not (CH2O)6.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Molar Mass (M) = Σ (nᵢ × Aᵢ)

Where:
  M = Molar mass of the compound (g/mol)
  nᵢ = Number of atoms of element i in the formula
  Aᵢ = Atomic mass of element i (g/mol)

Example:
  For H2O:
    M = 2 × 1.00794 + 1 × 15.9994 = 18.01528 g/mol`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem: Calculate the molar mass of carbon
          dioxide (CO2).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Chemical formula CO2 (1 carbon atom, 2 oxygen
            atoms)
          </li>
          <li>
            <strong>Step 1:</strong> Identify atomic masses from the periodic
            table: Carbon = 12.0107 g/mol, Oxygen = 15.9994 g/mol
          </li>
          <li>
            <strong>Step 2:</strong> Multiply atomic masses by atom counts and
            sum:
            <br />
            M = 1 × 12.0107 + 2 × 15.9994 = 43.9995 g/mol
          </li>
          <li>
            <strong>Result:</strong> The molar mass of CO2 is approximately{" "}
            <code>43.9995 g/mol</code>.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
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
        formula: "M = Σ (nᵢ × Aᵢ)",
        variables: [
          { symbol: "M", description: "Molar mass of the compound (g/mol)" },
          {
            symbol: "nᵢ",
            description: "Number of atoms of element i in the formula",
          },
          {
            symbol: "Aᵢ",
            description: "Atomic mass of element i (g/mol)",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the molar mass of carbon dioxide (CO2) by summing atomic masses.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify atomic masses: Carbon = 12.0107 g/mol, Oxygen = 15.9994 g/mol.",
          },
          {
            label: "2",
            explanation:
              "Multiply atomic masses by atom counts and sum: 1 × 12.0107 + 2 × 15.9994.",
          },
          {
            label: "3",
            explanation:
              "Resulting molar mass is approximately 43.9995 g/mol for CO2.",
          },
        ],
        result: "43.9995 g/mol",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
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