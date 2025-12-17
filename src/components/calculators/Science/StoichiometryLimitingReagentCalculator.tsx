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

const MOLECULAR_WEIGHTS: Record<string, number> = {
  // Common elements (g/mol)
  H: 1.0079,
  He: 4.0026,
  Li: 6.941,
  Be: 9.0122,
  B: 10.811,
  C: 12.0107,
  N: 14.0067,
  O: 15.999,
  F: 18.9984,
  Ne: 20.1797,
  Na: 22.9897,
  Mg: 24.305,
  Al: 26.9815,
  Si: 28.0855,
  P: 30.9738,
  S: 32.065,
  Cl: 35.453,
  Ar: 39.948,
  K: 39.0983,
  Ca: 40.078,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
  Ag: 107.8682,
  Au: 196.9665,
  Hg: 200.59,
  Pb: 207.2,
};

function parseFormula(formula: string): Record<string, number> | null {
  // Parses a simple chemical formula (e.g. H2O, C6H12O6)
  // Does NOT support nested parentheses or complex groups.
  // Returns element counts or null if invalid.

  // Regex to match element symbols and optional counts
  // e.g. H2, O, C12
  const elementRegex = /([A-Z][a-z]?)(\d*)/g;
  const counts: Record<string, number> = {};
  let match;
  while ((match = elementRegex.exec(formula)) !== null) {
    const element = match[1];
    const countStr = match[2];
    if (!(element in MOLECULAR_WEIGHTS)) {
      return null; // Unknown element
    }
    const count = countStr === "" ? 1 : parseInt(countStr, 10);
    if (isNaN(count) || count <= 0) return null;
    counts[element] = (counts[element] || 0) + count;
  }
  // If no matches found, invalid formula
  if (Object.keys(counts).length === 0) return null;
  return counts;
}

function molarMass(formula: string): number | null {
  // Calculate molar mass in g/mol from formula string
  const counts = parseFormula(formula);
  if (!counts) return null;
  let mass = 0;
  for (const el in counts) {
    mass += MOLECULAR_WEIGHTS[el] * counts[el];
  }
  return mass;
}

export default function StoichiometryLimitingReagentCalculator() {
  /**
   * Inputs:
   * - reactant1Formula (string)
   * - reactant1Mass (number, grams)
   * - reactant2Formula (string)
   * - reactant2Mass (number, grams)
   * - reactionCoefficients (string): e.g. "1,1" or "2,3" (stoichiometric coefficients for reactants)
   *
   * Outputs:
   * - Limiting reagent (Reactant 1 or 2)
   * - Moles of limiting reagent
   * - Moles of excess reagent left
   * - Theoretical moles of product (assuming 1:1 product)
   * - Mass of product (if product formula given)
   *
   * For simplicity, product formula input is optional.
   */

  const [inputs, setInputs] = useState({
    reactant1Formula: "",
    reactant1Mass: "",
    reactant2Formula: "",
    reactant2Mass: "",
    reactant1Coeff: "1",
    reactant2Coeff: "1",
    productFormula: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Validate inputs
    const {
      reactant1Formula,
      reactant1Mass,
      reactant2Formula,
      reactant2Mass,
      reactant1Coeff,
      reactant2Coeff,
      productFormula,
    } = inputs;

    if (
      !reactant1Formula.trim() ||
      !reactant2Formula.trim() ||
      !reactant1Mass.trim() ||
      !reactant2Mass.trim() ||
      !reactant1Coeff.trim() ||
      !reactant2Coeff.trim()
    ) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    // Parse masses and coefficients
    const m1 = parseFloat(reactant1Mass);
    const m2 = parseFloat(reactant2Mass);
    const c1 = parseFloat(reactant1Coeff);
    const c2 = parseFloat(reactant2Coeff);

    if (
      isNaN(m1) ||
      isNaN(m2) ||
      isNaN(c1) ||
      isNaN(c2) ||
      m1 <= 0 ||
      m2 <= 0 ||
      c1 <= 0 ||
      c2 <= 0
    ) {
      return {
        value: "Invalid input",
        label: "Masses and coefficients must be positive numbers.",
        subtext: "",
        warning: <span>Check your inputs and try again.</span>,
        formulaUsed: "",
      };
    }

    // Calculate molar masses
    const M1 = molarMass(reactant1Formula.trim());
    const M2 = molarMass(reactant2Formula.trim());

    if (M1 === null || M2 === null) {
      return {
        value: "Invalid formula",
        label:
          "One or both reactant formulas are invalid or contain unsupported elements.",
        subtext: "",
        warning: (
          <span>
            Use valid chemical formulas with known elements (e.g., H2O, CO2).
          </span>
        ),
        formulaUsed: "",
      };
    }

    // Calculate moles of each reactant
    const n1 = m1 / M1; // moles reactant 1
    const n2 = m2 / M2; // moles reactant 2

    // Calculate mole ratio for limiting reagent
    // Limiting reagent is the one for which n / coefficient is smaller
    const ratio1 = n1 / c1;
    const ratio2 = n2 / c2;

    let limitingReagent = "";
    let limitingMoles = 0;
    let excessMolesLeft = 0;
    let excessReagent = "";
    let theoreticalProductMoles = 0;
    let productMass = null;
    let warning = null;

    if (ratio1 < ratio2) {
      limitingReagent = "Reactant 1";
      limitingMoles = n1;
      excessReagent = "Reactant 2";
      // Excess moles left = initial moles - (limiting moles * coeff ratio)
      excessMolesLeft = n2 - (c2 / c1) * n1;
      theoreticalProductMoles = limitingMoles; // Assume 1:1 product formation
    } else if (ratio2 < ratio1) {
      limitingReagent = "Reactant 2";
      limitingMoles = n2;
      excessReagent = "Reactant 1";
      excessMolesLeft = n1 - (c1 / c2) * n2;
      theoreticalProductMoles = limitingMoles;
    } else {
      limitingReagent = "Neither (Reactants are perfectly stoichiometric)";
      limitingMoles = ratio1 * c1; // same as ratio2 * c2
      excessReagent = "None";
      excessMolesLeft = 0;
      theoreticalProductMoles = limitingMoles;
    }

    // Calculate product mass if product formula given
    if (productFormula.trim()) {
      const Mprod = molarMass(productFormula.trim());
      if (Mprod === null) {
        warning = (
          <span>
            Product formula invalid or contains unsupported elements. Product
            mass not calculated.
          </span>
        );
      } else {
        productMass = theoreticalProductMoles * Mprod;
      }
    }

    // Format numbers with scientific notation if very large/small
    function fmt(num: number, unit: string) {
      if (num === 0) return `0 ${unit}`;
      if (Math.abs(num) < 0.001 || Math.abs(num) > 1e5) {
        return `${num.toExponential(4)} ${unit}`;
      }
      return `${num.toFixed(4)} ${unit}`;
    }

    // Compose result string
    let value = "";
    let label = "";
    let subtext = "";

    if (limitingReagent === "Neither (Reactants are perfectly stoichiometric)") {
      value = "No limiting reagent";
      label = "Reactants are in exact stoichiometric ratio.";
      subtext = `Moles of each reactant: ${fmt(n1, "mol")}`;
    } else {
      value = limitingReagent;
      label = `Limiting reagent with ${fmt(limitingMoles, "mol")}`;
      subtext = `Excess reagent (${excessReagent}) left: ${fmt(
        excessMolesLeft,
        "mol"
      )}`;
    }

    if (productMass !== null) {
      subtext += ` • Theoretical product mass: ${fmt(productMass, "g")}`;
    }

    return {
      value,
      label,
      subtext,
      warning,
      formulaUsed:
        "Limiting reagent determined by comparing n / coefficient ratios",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a limiting reagent in a chemical reaction?",
      answer:
        "The limiting reagent is the reactant that is completely consumed first during a chemical reaction, limiting the amount of product formed. It determines the maximum yield of the product, as the reaction cannot proceed further without it.",
    },
    {
      question: "How do I calculate the limiting reagent from masses?",
      answer:
        "First, convert the mass of each reactant to moles using their molar masses. Then, divide the moles by their stoichiometric coefficients from the balanced equation. The reactant with the smallest resulting value is the limiting reagent.",
    },
    {
      question: "Why is stoichiometry important in chemistry?",
      answer:
        "Stoichiometry allows chemists to predict the quantities of reactants and products involved in chemical reactions. It ensures reactions are carried out efficiently, minimizing waste and optimizing yields.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border-blue-300 dark:border-blue-700">
          <CardContent>
            <h3 className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold mb-4">
              <FlaskConical className="w-5 h-5" /> Reactant 1
            </h3>
            <Label htmlFor="reactant1Formula" className="mb-1 font-medium">
              Chemical Formula
            </Label>
            <Input
              id="reactant1Formula"
              placeholder="e.g. H2O"
              value={inputs.reactant1Formula}
              onChange={(e) =>
                handleInputChange("reactant1Formula", e.target.value.toUpperCase())
              }
              spellCheck={false}
              autoComplete="off"
            />
            <Label htmlFor="reactant1Mass" className="mt-4 mb-1 font-medium">
              Mass (grams)
            </Label>
            <Input
              id="reactant1Mass"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 10"
              value={inputs.reactant1Mass}
              onChange={(e) => handleInputChange("reactant1Mass", e.target.value)}
            />
            <Label htmlFor="reactant1Coeff" className="mt-4 mb-1 font-medium">
              Stoichiometric Coefficient
            </Label>
            <Input
              id="reactant1Coeff"
              type="number"
              min="0.0001"
              step="any"
              placeholder="e.g. 1"
              value={inputs.reactant1Coeff}
              onChange={(e) => handleInputChange("reactant1Coeff", e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="border-blue-300 dark:border-blue-700">
          <CardContent>
            <h3 className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold mb-4">
              <FlaskConical className="w-5 h-5" /> Reactant 2
            </h3>
            <Label htmlFor="reactant2Formula" className="mb-1 font-medium">
              Chemical Formula
            </Label>
            <Input
              id="reactant2Formula"
              placeholder="e.g. CO2"
              value={inputs.reactant2Formula}
              onChange={(e) =>
                handleInputChange("reactant2Formula", e.target.value.toUpperCase())
              }
              spellCheck={false}
              autoComplete="off"
            />
            <Label htmlFor="reactant2Mass" className="mt-4 mb-1 font-medium">
              Mass (grams)
            </Label>
            <Input
              id="reactant2Mass"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 20"
              value={inputs.reactant2Mass}
              onChange={(e) => handleInputChange("reactant2Mass", e.target.value)}
            />
            <Label htmlFor="reactant2Coeff" className="mt-4 mb-1 font-medium">
              Stoichiometric Coefficient
            </Label>
            <Input
              id="reactant2Coeff"
              type="number"
              min="0.0001"
              step="any"
              placeholder="e.g. 1"
              value={inputs.reactant2Coeff}
              onChange={(e) => handleInputChange("reactant2Coeff", e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-300 dark:border-blue-700">
        <CardContent>
          <h3 className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold mb-4">
            <Atom className="w-5 h-5" /> Product (Optional)
          </h3>
          <Label htmlFor="productFormula" className="mb-1 font-medium">
            Chemical Formula
          </Label>
          <Input
            id="productFormula"
            placeholder="e.g. H2CO3"
            value={inputs.productFormula}
            onChange={(e) =>
              handleInputChange("productFormula", e.target.value.toUpperCase())
            }
            spellCheck={false}
            autoComplete="off"
          />
          <p className="text-sm text-slate-500 mt-1">
            Enter product formula to calculate theoretical product mass.
          </p>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed; calculation is reactive
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              reactant1Formula: "",
              reactant1Mass: "",
              reactant2Formula: "",
              reactant2Mass: "",
              reactant1Coeff: "1",
              reactant2Coeff: "1",
              productFormula: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Stoichiometry &amp; Limiting Reagent Solver
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Stoichiometry is the branch of chemistry that deals with the quantitative
          relationships between reactants and products in a chemical reaction. It
          allows chemists to predict the amounts of substances consumed and produced,
          ensuring reactions are efficient and balanced. The limiting reagent is the
          reactant that runs out first, stopping the reaction from continuing and
          determining the maximum amount of product formed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This solver helps you calculate the limiting reagent by converting the
          masses of reactants to moles, then comparing their mole ratios based on the
          balanced chemical equation. By identifying the limiting reagent, you can
          determine how much product can theoretically be formed and how much excess
          reactant remains.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Enter the chemical formulas and masses of two reactants along with their
          stoichiometric coefficients from the balanced equation. Optionally, provide
          the product formula to calculate the theoretical mass of product formed.
          This tool is ideal for students and professionals seeking precise and
          educational stoichiometry calculations.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula &amp; Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Moles (n) = Mass (m) / Molar Mass (M)

Limiting reagent determined by comparing:

n₁ / coefficient₁ &lt; n₂ / coefficient₂

Where:
  n₁, n₂ = moles of reactants 1 and 2
  coefficient₁, coefficient₂ = stoichiometric coefficients from balanced equation

Excess moles left = initial moles of excess reagent - (stoichiometric ratio × limiting moles)

Theoretical product mass = moles of limiting reagent × molar mass of product`}
        </pre>
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
      title="Stoichiometry & Limiting Reagent Solver"
      description="Solve stoichiometry problems. Calculate the amounts of reactants and products and identify the limiting reagent in reactions."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `n = \\frac{m}{M}

\\text{Limiting reagent if } \\frac{n_1}{c_1} &lt; \\frac{n_2}{c_2}

\\text{Excess moles left} = n_{excess} - \\left(\\frac{c_{excess}}{c_{limiting}} \\times n_{limiting}\\right)

\\text{Product mass} = n_{limiting} \\times M_{product}`,
        variables: [
          { symbol: "n", description: "Number of moles (mol)" },
          { symbol: "m", description: "Mass of substance (g)" },
          { symbol: "M", description: "Molar mass (g/mol)" },
          {
            symbol: "c",
            description:
              "Stoichiometric coefficient from balanced chemical equation",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Given 10 g of H₂ and 80 g of O₂ reacting to form water (H₂O), determine the limiting reagent and theoretical mass of water produced.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate moles of H₂: n = 10 g / 2.0158 g/mol ≈ 4.96 mol",
          },
          {
            label: "2",
            explanation:
              "Calculate moles of O₂: n = 80 g / 31.998 g/mol ≈ 2.5 mol",
          },
          {
            label: "3",
            explanation:
              "Balanced equation: 2 H₂ + 1 O₂ → 2 H₂O; coefficients: c₁=2, c₂=1",
          },
          {
            label: "4",
            explanation:
              "Calculate ratios: H₂ → 4.96 / 2 = 2.48; O₂ → 2.5 / 1 = 2.5",
          },
          {
            label: "5",
            explanation:
              "Limiting reagent is H₂ (smaller ratio). Theoretical moles of H₂O = 2 × 2.48 = 4.96 mol",
          },
          {
            label: "6",
            explanation:
              "Calculate mass of H₂O: 4.96 mol × 18.015 g/mol ≈ 89.4 g",
          },
        ],
        result:
          "Limiting reagent: H₂; Theoretical water mass produced: ~89.4 g",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        {
          title: "Snell’s Law & Critical Angle Calculator",
          url: "/science/snells-law-critical-angle",
          icon: "🌈",
        },
        {
          title: "Kinematics Equations Solver (SUVAT)",
          url: "/science/kinematics-suvat-solver",
          icon: "🚀",
        },
        {
          title: "Gravity on Other Planets Calculator",
          url: "/science/gravity-on-other-planets-calculator",
          icon: "🪐",
        },
        {
          title: "ppm / ppb Concentration Converter",
          url: "/science/ppm-ppb-concentration-converter",
          icon: "🧪",
        },
        {
          title: "Ideal Gas Law Calculator",
          url: "/science/ideal-gas-law-pv-nrt",
          icon: "🧪",
        },
        {
          title: "Momentum & Impulse Calculator",
          url: "/science/momentum-impulse-calculator",
          icon: "🧪",
        },
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