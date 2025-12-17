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
  // Inputs:
  // For molality (m): m = moles of solute / kg of solvent
  // For normality (N): N = equivalents of solute / liters of solution
  // We will allow user to input either molality or normality and convert to the other.
  // Required inputs:
  // - Input type: "Molality to Normality" or "Normality to Molality"
  // - Value: molality (mol/kg solvent) or normality (eq/L solution)
  // - Equivalent factor (eq/mol) (for normality calculation)
  // - Density of solution (g/mL) (needed to convert volume to mass)
  // - Molar mass of solute (g/mol) (needed to convert mol to grams)
  // Note: 1 L = 1000 mL, density in g/mL, mass in g

  const [inputs, setInputs] = useState({
    conversionType: "molalityToNormality", // or "normalityToMolality"
    concentrationValue: "", // molality (mol/kg solvent) or normality (eq/L)
    equivalentFactor: "", // eq/mol
    density: "", // g/mL
    molarMass: "", // g/mol
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Parse inputs as floats
    const concVal = parseFloat(inputs.concentrationValue);
    const eqFactor = parseFloat(inputs.equivalentFactor);
    const density = parseFloat(inputs.density);
    const molarMass = parseFloat(inputs.molarMass);

    // Validation
    if (
      isNaN(concVal) ||
      concVal <= 0 ||
      isNaN(eqFactor) ||
      eqFactor <= 0 ||
      isNaN(density) ||
      density <= 0 ||
      isNaN(molarMass) ||
      molarMass <= 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid positive inputs",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Constants
    // density in g/mL, convert to kg/L: 1 g/mL = 1 kg/L
    // So density (g/mL) * 1 = density (kg/L)
    // molarMass in g/mol
    // eqFactor in eq/mol

    // Formulas:
    // Molality (m) = moles solute / kg solvent
    // Normality (N) = equivalents solute / L solution

    // Conversion molality to normality:
    // N = m * eqFactor * density / (1 + m * molarMass)
    // Explanation:
    // mass of solvent = 1 kg (basis)
    // m moles solute = m * molarMass g solute
    // total mass solution = 1000 g solvent + m * molarMass g solute
    // volume solution = total mass / density (g/mL) = (1000 + m * molarMass) / (density * 1000) L
    // equivalents = m * eqFactor (since m moles solute)
    // N = equivalents / volume solution
    // N = m * eqFactor / volume solution
    // volume solution in L = (1000 + m * molarMass) / (density * 1000)
    // => N = m * eqFactor * density * 1000 / (1000 + m * molarMass)
    // Simplify 1000 cancels:
    // N = m * eqFactor * density / (1 + m * molarMass / 1000)
    // But molarMass is in g/mol, m in mol/kg solvent, density in g/mL
    // To keep units consistent, molarMass/1000 converts g to kg
    // So final formula:
    // N = m * eqFactor * density / (1 + m * molarMass / 1000)

    // Conversion normality to molality:
    // Rearranged from above:
    // m = N / (eqFactor * density - N * molarMass / 1000)
    // But denominator must be > 0
    // Check denominator > 0 to avoid division by zero or negative molality

    if (inputs.conversionType === "molalityToNormality") {
      const m = concVal;
      // Calculate denominator for correction factor
      const denom = 1 + (m * molarMass) / 1000;
      if (denom === 0) {
        return {
          value: "Error",
          label: "Denominator zero in calculation",
          subtext: "",
          warning: "Invalid input values causing division by zero.",
          formulaUsed:
            "N = m × eqFactor × density / (1 + m × molarMass / 1000)",
        };
      }
      const N = (m * eqFactor * density) / denom;

      const displayVal =
        N > 10000 || N < 0.001 ? N.toExponential(4) : N.toFixed(4);

      return {
        value: `${displayVal} N`,
        label: "Normality (eq/L solution)",
        subtext:
          "Converted from molality using density and equivalent factor.",
        warning: null,
        formulaUsed: "N = m × eqFactor × density / (1 + m × molarMass / 1000)",
      };
    } else {
      // normalityToMolality
      const N = concVal;
      const denom = eqFactor * density - (N * molarMass) / 1000;
      if (denom <= 0) {
        return {
          value: "Error",
          label: "Invalid inputs",
          subtext: "",
          warning:
            "Denominator ≤ 0. Check that density × eqFactor &gt; N × molarMass / 1000.",
          formulaUsed:
            "m = N / (eqFactor × density - N × molarMass / 1000)",
        };
      }
      const m = N / denom;

      const displayVal =
        m > 10000 || m < 0.001 ? m.toExponential(4) : m.toFixed(4);

      return {
        value: `${displayVal} mol/kg solvent`,
        label: "Molality (mol/kg solvent)",
        subtext:
          "Converted from normality using density and equivalent factor.",
        warning: null,
        formulaUsed: "m = N / (eqFactor × density - N × molarMass / 1000)",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between molality and normality?",
      answer:
        "Molality (m) measures moles of solute per kilogram of solvent, independent of temperature and volume changes. Normality (N) measures equivalents of solute per liter of solution and depends on the reaction type and solution volume. Both are essential in chemistry for precise concentration calculations, especially in titrations and solution preparations.",
    },
    {
      question: "Why do I need the density and molar mass for conversion?",
      answer:
        "Density allows conversion between mass and volume of the solution, crucial for relating molality (based on mass of solvent) to normality (based on volume of solution). Molar mass converts moles of solute to grams, enabling accurate mass and volume calculations. Without these, conversions between molality and normality would be inaccurate.",
    },
    {
      question:
        "What is the equivalent factor and how is it determined for normality?",
      answer:
        "The equivalent factor (eq/mol) is the number of equivalents per mole of solute, depending on the reaction. For acids, it’s the number of H+ ions donated; for bases, OH- ions accepted; for redox reactions, electrons transferred. It must be known or calculated to convert between molality and normality correctly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="conversionType" className="mb-1 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            Conversion Type
          </Label>
          <Select
            value={inputs.conversionType}
            onValueChange={(val) => handleInputChange("conversionType", val)}
            id="conversionType"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="molalityToNormality">
                Molality &rarr; Normality
              </SelectItem>
              <SelectItem value="normalityToMolality">
                Normality &rarr; Molality
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="concentrationValue" className="mb-1 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-green-600" />
            {inputs.conversionType === "molalityToNormality"
              ? "Molality (mol/kg solvent)"
              : "Normality (eq/L solution)"}
          </Label>
          <Input
            type="number"
            step="any"
            min="0"
            id="concentrationValue"
            value={inputs.concentrationValue}
            onChange={(e) =>
              handleInputChange("concentrationValue", e.target.value)
            }
            placeholder={
              inputs.conversionType === "molalityToNormality"
                ? "e.g. 1.5"
                : "e.g. 0.75"
            }
          />
        </div>

        <div>
          <Label htmlFor="equivalentFactor" className="mb-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Equivalent Factor (eq/mol)
          </Label>
          <Input
            type="number"
            step="any"
            min="0"
            id="equivalentFactor"
            value={inputs.equivalentFactor}
            onChange={(e) => handleInputChange("equivalentFactor", e.target.value)}
            placeholder="e.g. 1 for HCl"
          />
        </div>

        <div>
          <Label htmlFor="density" className="mb-1 flex items-center gap-2">
            <Waves className="w-5 h-5 text-cyan-600" />
            Density of Solution (g/mL)
          </Label>
          <Input
            type="number"
            step="any"
            min="0"
            id="density"
            value={inputs.density}
            onChange={(e) => handleInputChange("density", e.target.value)}
            placeholder="e.g. 1.05"
          />
        </div>

        <div>
          <Label htmlFor="molarMass" className="mb-1 flex items-center gap-2">
            <Atom className="w-5 h-5 text-purple-600" />
            Molar Mass of Solute (g/mol)
          </Label>
          <Input
            type="number"
            step="any"
            min="0"
            id="molarMass"
            value={inputs.molarMass}
            onChange={(e) => handleInputChange("molarMass", e.target.value)}
            placeholder="e.g. 36.46 for HCl"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting inputs to current inputs (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              conversionType: "molalityToNormality",
              concentrationValue: "",
              equivalentFactor: "",
              density: "",
              molarMass: "",
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

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Science Fact:</strong> Molality is independent of
              temperature because it is based on mass, while normality depends
              on volume, which can change with temperature. Always use correct
              units and conditions for precise lab work.
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
          Understanding Molality &amp; Normality Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Molality and normality are two important concentration units used in
          chemistry to describe the amount of solute in a solution. Molality (m)
          is defined as the number of moles of solute per kilogram of solvent,
          making it independent of temperature and volume changes. Normality (N)
          measures the number of equivalents of solute per liter of solution,
          which depends on the chemical reaction and solution volume.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This converter helps translate between these two units by accounting
          for the solution's density, the solute's molar mass, and the equivalent
          factor, which depends on the reaction type. Such conversions are
          essential in analytical chemistry, especially in titrations where
          precise concentration measurements are critical.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding these units and their conversions allows chemists and
          scientists to prepare solutions accurately, ensuring reliable and
          reproducible experimental results. This tool aids in bridging the gap
          between mass-based and volume-based concentration units.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Formula &amp; Variables
        </h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Molality to Normality:
N = \\frac{m \\times eqFactor \\times density}{1 + \\frac{m \\times molarMass}{1000}}

Normality to Molality:
m = \\frac{N}{eqFactor \\times density - \\frac{N \\times molarMass}{1000}}

Where:
- N = Normality (equivalents per liter, eq/L)
- m = Molality (moles per kilogram solvent, mol/kg)
- eqFactor = Equivalent factor (equivalents per mole, eq/mol)
- density = Density of solution (grams per milliliter, g/mL)
- molarMass = Molar mass of solute (grams per mole, g/mol)

Note: The factor 1000 converts grams to kilograms for consistent units.`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Step-by-Step Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem converting molality to normality for
          hydrochloric acid (HCl) solution.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> Molality m = 1.5 mol/kg solvent, Equivalent
            factor = 1 (HCl donates 1 H<sup>+</sup>), Density = 1.05 g/mL, Molar
            mass = 36.46 g/mol.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate denominator: 1 + (1.5 × 36.46) /
            1000 = 1 + 0.05469 = 1.05469.
          </li>
          <li>
            <strong>Step 2:</strong> Calculate normality: N = (1.5 × 1 × 1.05) /
            1.05469 ≈ 1.493 eq/L.
          </li>
          <li>
            <strong>Result:</strong> The normality of the solution is approximately{" "}
            <code>1.493 N</code>.
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
      title="Molality & Normality Converter"
      description="Convert concentration units. Calculate Molality and Normality for precise chemical solutions and acid-base titrations."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Molality to Normality:
N = \\frac{m \\times eqFactor \\times density}{1 + \\frac{m \\times molarMass}{1000}}

Normality to Molality:
m = \\frac{N}{eqFactor \\times density - \\frac{N \\times molarMass}{1000}}`,
        variables: [
          { symbol: "N", description: "Normality (equivalents per liter, eq/L)" },
          { symbol: "m", description: "Molality (moles per kilogram solvent, mol/kg)" },
          { symbol: "eqFactor", description: "Equivalent factor (equivalents per mole, eq/mol)" },
          { symbol: "density", description: "Density of solution (grams per milliliter, g/mL)" },
          { symbol: "molarMass", description: "Molar mass of solute (grams per mole, g/mol)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Convert 1.5 mol/kg solvent molality of HCl to normality given equivalent factor 1, density 1.05 g/mL, and molar mass 36.46 g/mol.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate denominator: 1 + (1.5 × 36.46) / 1000 = 1.05469.",
          },
          {
            label: "2",
            explanation:
              "Calculate normality: N = (1.5 × 1 × 1.05) / 1.05469 ≈ 1.493 eq/L.",
          },
        ],
        result: "Normality ≈ 1.493 N (equivalents per liter).",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
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