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

export default function MolalityNormalityConverterCalculator() {
  /**
   * Inputs:
   * - molality (m): mol solute / kg solvent
   * - normality (N): eq solute / L solution
   * - equivalents per mole (eq/mol): depends on acid/base or redox reaction
   * - density (ρ): g/mL or kg/L of solution (needed for Normality <-> Molality conversion)
   *
   * Conversions:
   * 1) Molality to Normality:
   *    N = molality * equivalents_per_mole * density_solution (kg/L)
   *
   * 2) Normality to Molality:
   *    molality = N / (equivalents_per_mole * density_solution)
   *
   * Notes:
   * - Density must be in kg/L for formula consistency.
   * - Equivalents per mole is unitless.
   */

  const [inputs, setInputs] = useState({
    molality: "",
    normality: "",
    equivalents: "1",
    density: "",
    convertFrom: "molality",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const {
      molality,
      normality,
      equivalents,
      density,
      convertFrom,
    } = inputs;

    // Parse inputs to floats
    const m = parseFloat(molality);
    const N = parseFloat(normality);
    const eq = parseFloat(equivalents);
    const d = parseFloat(density);

    // Validation and warnings
    if (eq <= 0 || isNaN(eq)) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Equivalents per mole must be a positive number.",
        formulaUsed: null,
      };
    }
    if (d <= 0 || isNaN(d)) {
      return {
        value: "Waiting...",
        label: "",
        subtext:
          "Density is required and must be a positive number (kg/L) for conversion.",
        warning: null,
        formulaUsed: null,
      };
    }

    if (convertFrom === "molality") {
      if (isNaN(m) || m < 0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Molality must be a non-negative number.",
          formulaUsed: null,
        };
      }
      // N = m * eq * d
      const normalityVal = m * eq * d;
      return {
        value: normalityVal.toExponential(4) + " N",
        label: `Normality (eq/L) calculated from Molality`,
        subtext: `Using equivalents per mole = ${eq} and density = ${d} kg/L`,
        warning: null,
        formulaUsed: "N = m × eq × ρ",
      };
    } else if (convertFrom === "normality") {
      if (isNaN(N) || N < 0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Normality must be a non-negative number.",
          formulaUsed: null,
        };
      }
      // m = N / (eq * d)
      const molalityVal = N / (eq * d);
      return {
        value: molalityVal.toExponential(4) + " mol/kg",
        label: `Molality (mol/kg solvent) calculated from Normality`,
        subtext: `Using equivalents per mole = ${eq} and density = ${d} kg/L`,
        warning: null,
        formulaUsed: "m = N / (eq × ρ)",
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
      question: "What is the difference between molality and normality?",
      answer:
        "Molality (m) is the concentration expressed as moles of solute per kilogram of solvent, independent of temperature. Normality (N) measures equivalents of solute per liter of solution and depends on the reaction type and solution density. They serve different purposes in chemical calculations.",
    },
    {
      question:
        "Why do I need equivalents per mole and density for conversion?",
      answer:
        "Equivalents per mole account for the reactive capacity of the solute in a given reaction, while density converts between mass-based and volume-based concentrations. Both are essential for accurate conversion between molality and normality.",
    },
    {
      question:
        "Can I convert molality to normality without density information?",
      answer:
        "No. Since molality is based on solvent mass and normality on solution volume, density is required to relate mass and volume for precise conversion.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Conversion Direction */}
      <div>
        <Label htmlFor="convertFrom" className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-blue-600" />
          Convert From
        </Label>
        <Select
          value={inputs.convertFrom}
          onValueChange={(value) => handleInputChange("convertFrom", value)}
          id="convertFrom"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="molality">Molality (mol/kg solvent)</SelectItem>
            <SelectItem value="normality">Normality (eq/L solution)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Molality Input */}
      {inputs.convertFrom === "molality" && (
        <div>
          <Label htmlFor="molality" className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Molality (m) [mol/kg solvent]
          </Label>
          <Input
            id="molality"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 1.5"
            value={inputs.molality}
            onChange={(e) => handleInputChange("molality", e.target.value)}
          />
        </div>
      )}

      {/* Normality Input */}
      {inputs.convertFrom === "normality" && (
        <div>
          <Label htmlFor="normality" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Normality (N) [eq/L solution]
          </Label>
          <Input
            id="normality"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 0.5"
            value={inputs.normality}
            onChange={(e) => handleInputChange("normality", e.target.value)}
          />
        </div>
      )}

      {/* Equivalents per mole */}
      <div>
        <Label htmlFor="equivalents" className="flex items-center gap-2">
          <Orbit className="w-5 h-5 text-blue-600" />
          Equivalents per mole (eq/mol)
        </Label>
        <Input
          id="equivalents"
          type="number"
          min="0.0001"
          step="any"
          placeholder="e.g., 1"
          value={inputs.equivalents}
          onChange={(e) => handleInputChange("equivalents", e.target.value)}
        />
        <p className="text-sm text-slate-500 mt-1">
          Number of reactive equivalents per mole of solute.
        </p>
      </div>

      {/* Density Input */}
      <div>
        <Label htmlFor="density" className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-600" />
          Density of solution (ρ) [kg/L]
        </Label>
        <Input
          id="density"
          type="number"
          min="0.0001"
          step="any"
          placeholder="e.g., 1.05"
          value={inputs.density}
          onChange={(e) => handleInputChange("density", e.target.value)}
        />
        <p className="text-sm text-slate-500 mt-1">
          Density is required for conversion between molality and normality.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              molality: "",
              normality: "",
              equivalents: "1",
              density: "",
              convertFrom: "molality",
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
          Understanding Molality &amp; Normality Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Molality and normality are two important concentration units used in
          chemistry to describe the amount of solute in a solution. Molality (m)
          is defined as the number of moles of solute per kilogram of solvent,
          making it independent of temperature and volume changes. Normality (N),
          on the other hand, measures the number of equivalents of solute per
          liter of solution, which depends on the reaction type and solution
          density.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Converting between molality and normality requires knowledge of the
          equivalents per mole of the solute and the density of the solution.
          This is because molality is mass-based while normality is volume-based,
          and the equivalents per mole reflect the reactive capacity of the
          solute in a given chemical reaction.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This converter allows you to input either molality or normality along
          with the equivalents per mole and solution density to accurately
          calculate the corresponding concentration. It is a valuable tool for
          chemists and students working with acid-base titrations, redox
          reactions, and solution preparation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, density must be provided in kilograms per liter (kg/L), and
          equivalents per mole should be based on the specific chemical reaction
          involved.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula &amp; Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Conversion formulas:

1) Molality to Normality:
   N = m × eq × ρ

2) Normality to Molality:
   m = N / (eq × ρ)

Where:
  N  = Normality [eq/L solution]
  m  = Molality [mol/kg solvent]
  eq = Equivalents per mole [unitless]
  ρ  = Density of solution [kg/L]

Notes:
- Equivalents per mole depend on the chemical reaction.
- Density converts between mass-based and volume-based units.`}
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
      title="Molality & Normality Converter"
      description="Convert concentration units. Calculate Molality and Normality for precise chemical solutions and acid-base titrations."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `N = m × eq × ρ
m = N / (eq × ρ)`,
        variables: [
          { symbol: "N", description: "Normality [eq/L solution]" },
          { symbol: "m", description: "Molality [mol/kg solvent]" },
          { symbol: "eq", description: "Equivalents per mole [unitless]" },
          { symbol: "ρ", description: "Density of solution [kg/L]" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the normality of a solution with molality 2 mol/kg, equivalents per mole 1, and density 1.1 kg/L.",
        steps: [
          {
            label: "1",
            explanation:
              "Use the formula N = m × eq × ρ to calculate normality.",
          },
          {
            label: "2",
            explanation:
              "Substitute values: N = 2 × 1 × 1.1 = 2.2 eq/L.",
          },
          {
            label: "3",
            explanation:
              "The normality of the solution is 2.2 N.",
          },
        ],
        result: "Normality = 2.2 N",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        {
          title: "Escape Velocity Calculator",
          url: "/science/escape-velocity-calculator",
          icon: "🧪",
        },
        {
          title: "Kinematics Equations Solver (SUVAT)",
          url: "/science/kinematics-suvat-solver",
          icon: "🚀",
        },
        {
          title: "Photon Energy Calculator",
          url: "/science/photon-energy-e-hf",
          icon: "🔥",
        },
        {
          title: "Percent Composition by Mass",
          url: "/science/percent-composition-by-mass",
          icon: "🧪",
        },
        {
          title: "Buffer (Henderson–Hasselbalch) Helper",
          url: "/science/buffer-henderson-hasselbalch-helper",
          icon: "🧪",
        },
        {
          title: "pH / pOH / [H+] Calculator",
          url: "/science/ph-poh-h-oh-calculator",
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