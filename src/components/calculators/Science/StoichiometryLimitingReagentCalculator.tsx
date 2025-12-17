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

type SubstanceInput = {
  name: string;
  molarMass: number | ""; // g/mol
  mass: number | ""; // grams
  moles: number | ""; // moles (optional, auto-calculated if mass given)
  coefficient: number | ""; // stoichiometric coefficient in reaction
};

export default function StoichiometryLimitingReagentCalculator() {
  // We allow up to 3 reactants and 3 products for simplicity
  // User inputs: name, molar mass, mass or moles, coefficient
  // We calculate moles from mass if given, else use moles input
  // Then find limiting reagent among reactants
  // Calculate theoretical yield of products based on limiting reagent

  const [reactants, setReactants] = useState<SubstanceInput[]>([
    { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
    { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
    { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
  ]);
  const [products, setProducts] = useState<SubstanceInput[]>([
    { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
    { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
    { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
  ]);

  // Handle input changes for reactants and products
  const handleReactantChange = useCallback(
    (
      index: number,
      field: keyof SubstanceInput,
      value: string | number | ""
    ) => {
      setReactants((prev) => {
        const newArr = [...prev];
        if (field === "molarMass" || field === "mass" || field === "moles") {
          // Accept only numbers or empty string
          if (value === "") newArr[index][field] = "";
          else {
            const num = Number(value);
            newArr[index][field] = isNaN(num) ? "" : num;
          }
        } else if (field === "coefficient") {
          if (value === "") newArr[index][field] = "";
          else {
            const num = Number(value);
            newArr[index][field] = isNaN(num) ? "" : Math.max(1, Math.floor(num));
          }
        } else {
          newArr[index][field] = value as string;
        }
        return newArr;
      });
    },
    []
  );

  const handleProductChange = useCallback(
    (
      index: number,
      field: keyof SubstanceInput,
      value: string | number | ""
    ) => {
      setProducts((prev) => {
        const newArr = [...prev];
        if (field === "molarMass" || field === "mass" || field === "moles") {
          if (value === "") newArr[index][field] = "";
          else {
            const num = Number(value);
            newArr[index][field] = isNaN(num) ? "" : num;
          }
        } else if (field === "coefficient") {
          if (value === "") newArr[index][field] = "";
          else {
            const num = Number(value);
            newArr[index][field] = isNaN(num) ? "" : Math.max(1, Math.floor(num));
          }
        } else {
          newArr[index][field] = value as string;
        }
        return newArr;
      });
    },
    []
  );

  // Reset all inputs
  const resetAll = useCallback(() => {
    setReactants([
      { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
      { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
      { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
    ]);
    setProducts([
      { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
      { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
      { name: "", molarMass: "", mass: "", moles: "", coefficient: "" },
    ]);
  }, []);

  // Calculation logic
  const results = useMemo(() => {
    // Filter valid reactants: must have name, molarMass > 0, coefficient > 0, and either mass or moles > 0
    const validReactants = reactants.filter(
      (r) =>
        r.name.trim() !== "" &&
        typeof r.molarMass === "number" &&
        r.molarMass > 0 &&
        typeof r.coefficient === "number" &&
        r.coefficient > 0 &&
        ((typeof r.mass === "number" && r.mass > 0) ||
          (typeof r.moles === "number" && r.moles > 0))
    );

    if (validReactants.length === 0) {
      return {
        value: "Waiting...",
        label: "Enter valid reactants data",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculate moles for each reactant (mass / molarMass if mass given, else use moles)
    const reactantsWithMoles = validReactants.map((r) => {
      let moles: number;
      if (typeof r.mass === "number" && r.mass > 0) {
        moles = r.mass / r.molarMass;
      } else if (typeof r.moles === "number" && r.moles > 0) {
        moles = r.moles;
      } else {
        moles = 0;
      }
      return { ...r, moles };
    });

    // Calculate mole ratio: moles / coefficient for each reactant
    const moleRatios = reactantsWithMoles.map(
      (r) => r.moles / (r.coefficient as number)
    );

    // Limiting reagent is reactant with smallest mole ratio
    const minRatio = Math.min(...moleRatios);
    const limitingIndex = moleRatios.indexOf(minRatio);
    const limitingReagent = reactantsWithMoles[limitingIndex];

    if (minRatio <= 0) {
      return {
        value: "Invalid input",
        label: "Moles or coefficients must be positive",
        subtext: "",
        warning: "Check that masses, moles, and coefficients are positive numbers.",
        formulaUsed: null,
      };
    }

    // Now calculate theoretical yield of products based on limiting reagent
    // For each product: moles = coefficient_product * minRatio
    // mass = moles * molarMass_product

    // Filter valid products: must have name, molarMass > 0, coefficient > 0
    const validProducts = products.filter(
      (p) =>
        p.name.trim() !== "" &&
        typeof p.molarMass === "number" &&
        p.molarMass > 0 &&
        typeof p.coefficient === "number" &&
        p.coefficient > 0
    );

    const productsYield = validProducts.map((p) => {
      const molesProduced = (p.coefficient as number) * minRatio;
      const massProduced = molesProduced * p.molarMass;
      return {
        ...p,
        molesProduced,
        massProduced,
      };
    });

    // Format output strings with scientific notation if needed
    function formatNumber(val: number): string {
      if (val === 0) return "0";
      if (val >= 10000 || val < 0.001) return val.toExponential(4);
      return val.toFixed(4);
    }

    // Compose result strings
    const limitingReagentStr = `${limitingReagent.name} (Limiting Reagent) with ${formatNumber(
      limitingReagent.moles
    )} moles`;

    const productResultsStr =
      productsYield.length === 0
        ? "No valid products entered."
        : productsYield
            .map(
              (p) =>
                `${p.name}: ${formatNumber(p.massProduced)} grams (${formatNumber(
                  p.molesProduced
                )} moles)`
            )
            .join("; ");

    return {
      value: limitingReagentStr,
      label: "Limiting Reagent Identification",
      subtext: `Theoretical product yields: ${productResultsStr}`,
      warning: null,
      formulaUsed:
        "Limiting reagent determined by min(moles_reactant / coefficient_reactant)",
    };
  }, [reactants, products]);

  // FAQs
  const faqs = [
    {
      question: "What is a limiting reagent in a chemical reaction?",
      answer:
        "The limiting reagent is the reactant that is completely consumed first in a chemical reaction, limiting the amount of products formed. It determines the maximum yield of products possible. Identifying the limiting reagent is essential for calculating theoretical yields and understanding reaction efficiency.",
    },
    {
      question: "Why do we use stoichiometric coefficients in calculations?",
      answer:
        "Stoichiometric coefficients represent the relative amounts of reactants and products in a balanced chemical equation. They allow us to relate moles of different substances and calculate how much product can form from given reactants. Without these coefficients, mole-to-mole relationships would be inaccurate.",
    },
    {
      question: "How is stoichiometry applied in real-world scenarios?",
      answer:
        "Stoichiometry is fundamental in chemical manufacturing, pharmaceuticals, environmental engineering, and laboratory analysis. It helps chemists scale reactions, optimize resource use, and predict product amounts. For example, in industrial synthesis, stoichiometry ensures reactants are used efficiently to minimize waste and cost.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <FlaskConical className="w-5 h-5" /> Reactants
        </h3>
        {reactants.map((r, i) => (
          <Card
            key={i}
            className="mb-4 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
          >
            <CardContent className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-center">
              <Input
                placeholder="Name (e.g. H₂O)"
                value={r.name}
                onChange={(e) =>
                  handleReactantChange(i, "name", e.target.value)
                }
                className="col-span-1"
                aria-label={`Reactant ${i + 1} name`}
              />
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="Molar Mass (g/mol)"
                value={r.molarMass === "" ? "" : r.molarMass}
                onChange={(e) =>
                  handleReactantChange(i, "molarMass", e.target.value)
                }
                className="col-span-1"
                aria-label={`Reactant ${i + 1} molar mass`}
              />
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="Mass (g)"
                value={r.mass === "" ? "" : r.mass}
                onChange={(e) => handleReactantChange(i, "mass", e.target.value)}
                className="col-span-1"
                aria-label={`Reactant ${i + 1} mass`}
              />
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="Moles (optional)"
                value={r.moles === "" ? "" : r.moles}
                onChange={(e) => handleReactantChange(i, "moles", e.target.value)}
                className="col-span-1"
                aria-label={`Reactant ${i + 1} moles`}
              />
              <Input
                type="number"
                min={1}
                step={1}
                placeholder="Coefficient"
                value={r.coefficient === "" ? "" : r.coefficient}
                onChange={(e) =>
                  handleReactantChange(i, "coefficient", e.target.value)
                }
                className="col-span-1"
                aria-label={`Reactant ${i + 1} coefficient`}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 col-span-1 text-center">
                Name | Molar Mass | Mass (g) | Moles | Coefficient
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-green-700 dark:text-green-300">
          <Atom className="w-5 h-5" /> Products
        </h3>
        {products.map((p, i) => (
          <Card
            key={i}
            className="mb-4 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
          >
            <CardContent className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              <Input
                placeholder="Name (e.g. CO₂)"
                value={p.name}
                onChange={(e) => handleProductChange(i, "name", e.target.value)}
                className="col-span-1"
                aria-label={`Product ${i + 1} name`}
              />
              <Input
                type="number"
                min={0}
                step="any"
                placeholder="Molar Mass (g/mol)"
                value={p.molarMass === "" ? "" : p.molarMass}
                onChange={(e) =>
                  handleProductChange(i, "molarMass", e.target.value)
                }
                className="col-span-1"
                aria-label={`Product ${i + 1} molar mass`}
              />
              <Input
                type="number"
                min={1}
                step={1}
                placeholder="Coefficient"
                value={p.coefficient === "" ? "" : p.coefficient}
                onChange={(e) =>
                  handleProductChange(i, "coefficient", e.target.value)
                }
                className="col-span-1"
                aria-label={`Product ${i + 1} coefficient`}
              />
              <div className="text-xs text-slate-500 dark:text-slate-400 col-span-2 text-center">
                Name | Molar Mass | Coefficient
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            /* Calculation is automatic on input change */
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate stoichiometry"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetAll}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
              <p className="text-3xl sm:text-5xl font-extrabold text-blue-900 dark:text-white break-words">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium break-words">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2 break-words">
                  {results.subtext}
                </p>
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
              <strong>Science Fact:</strong> Stoichiometry is essential for
              predicting product amounts and optimizing reactant usage in
              chemical reactions.
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
          Understanding Stoichiometry & Limiting Reagent Solver
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Stoichiometry is the branch of chemistry that deals with the
          quantitative relationships between reactants and products in a
          chemical reaction. It allows chemists to calculate how much product
          will form from given amounts of reactants or how much reactant is
          needed to produce a desired amount of product. Central to this is the
          concept of the limiting reagent, which is the reactant that runs out
          first, thus limiting the extent of the reaction.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This solver helps identify the limiting reagent by comparing the mole
          ratios of reactants based on their stoichiometric coefficients. It
          then calculates the theoretical yield of products accordingly. This
          tool is invaluable for students and professionals alike to predict
          reaction outcomes accurately.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In real-world applications, stoichiometry is used extensively in
          chemical manufacturing, pharmaceuticals, environmental science, and
          laboratory research. Accurate stoichiometric calculations ensure
          efficient use of materials, cost savings, and minimal waste
          production.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula & Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Limiting reagent determined by:
min \\left( \\frac{n_i}{a_i} \\right)

Where:
n_i = moles of reactant i (mol)
a_i = stoichiometric coefficient of reactant i (unitless)

Theoretical moles of product j:
n_j = a_j \\times \\min \\left( \\frac{n_i}{a_i} \\right)

Where:
a_j = stoichiometric coefficient of product j (unitless)

Mass of product j:
m_j = n_j \\times M_j

Where:
M_j = molar mass of product j (g/mol)
m_j = mass of product j (g)
`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem involving the reaction of hydrogen
          gas with oxygen gas to form water:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> 4.0 g of H₂ (molar mass = 2.016 g/mol), 32.0 g
            of O₂ (molar mass = 32.00 g/mol), reaction: 2 H₂ + O₂ → 2 H₂O
          </li>
          <li>
            <strong>Step 1:</strong> Calculate moles of each reactant:
            n(H₂) = 4.0 / 2.016 ≈ 1.984 mol, n(O₂) = 32.0 / 32.00 = 1.0 mol
          </li>
          <li>
            <strong>Step 2:</strong> Calculate mole ratios:
            n(H₂)/2 = 0.992, n(O₂)/1 = 1.0
          </li>
          <li>
            <strong>Step 3:</strong> Limiting reagent is H₂ (smaller ratio 0.992)
          </li>
          <li>
            <strong>Step 4:</strong> Calculate theoretical moles of H₂O:
            2 × 0.992 = 1.984 mol
          </li>
          <li>
            <strong>Step 5:</strong> Calculate mass of H₂O produced:
            1.984 × 18.015 = 35.74 g
          </li>
          <li>
            <strong>Result:</strong> Maximum 35.74 grams of water can be formed.
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
      title="Stoichiometry & Limiting Reagent Solver"
      description="Solve stoichiometry problems. Calculate the amounts of reactants and products and identify the limiting reagent in reactions."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `\\min \\left( \\frac{n_i}{a_i} \\right) \\to \\text{Limiting Reagent}`,
        variables: [
          { symbol: "n_i", description: "Moles of reactant i (mol)" },
          {
            symbol: "a_i",
            description: "Stoichiometric coefficient of reactant i (unitless)",
          },
          {
            symbol: "n_j",
            description:
              "Moles of product j formed = a_j × min(n_i / a_i) (mol)",
          },
          {
            symbol: "a_j",
            description: "Stoichiometric coefficient of product j (unitless)",
          },
          {
            symbol: "m_j",
            description: "Mass of product j formed = n_j × M_j (grams)",
          },
          { symbol: "M_j", description: "Molar mass of product j (g/mol)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the limiting reagent and theoretical yield of water when 4.0 g of hydrogen gas reacts with 32.0 g of oxygen gas.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate moles of H₂ and O₂ using their masses and molar masses.",
          },
          {
            label: "2",
            explanation:
              "Divide moles of each reactant by their stoichiometric coefficients from the balanced equation.",
          },
          {
            label: "3",
            explanation:
              "Identify the limiting reagent as the reactant with the smallest mole ratio.",
          },
          {
            label: "4",
            explanation:
              "Calculate moles and mass of water produced based on the limiting reagent.",
          },
        ],
        result:
          "Limiting reagent is hydrogen gas; maximum 35.74 grams of water can be formed.",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        {
          title: "Kinematics Equations (SUVAT)",
          url: "/science/kinematics-equations",
          icon: "🚀",
        },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
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