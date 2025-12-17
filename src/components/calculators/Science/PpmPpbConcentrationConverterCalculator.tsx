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
  Info,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PpmPpbConcentrationConverterCalculator() {
  // Inputs:
  // - inputValue: numeric concentration value
  // - inputUnit: "ppm", "ppb", or "molarity"
  // - outputUnit: "ppm", "ppb", or "molarity"
  // Note: Molarity unit is mol/L (M)
  // Conversion logic:
  // 1 ppm = 1 mg/L (assuming water density ~1 g/mL)
  // 1 ppb = 1 µg/L
  // 1 M = 1 mol/L
  // To convert ppm/ppb to molarity, molecular weight (g/mol) is needed.
  // For this tool, molecular weight input is required when converting to/from molarity.

  const [inputs, setInputs] = useState<{
    inputValue: string;
    inputUnit: "ppm" | "ppb" | "molarity" | "";
    outputUnit: "ppm" | "ppb" | "molarity" | "";
    molecularWeight: string; // g/mol, required if molarity involved
  }>({
    inputValue: "",
    inputUnit: "",
    outputUnit: "",
    molecularWeight: "",
  });

  const handleInputChange = useCallback(
    (name: string, value: string) => {
      setInputs((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const results = useMemo(() => {
    const { inputValue, inputUnit, outputUnit, molecularWeight } = inputs;

    // Validation
    if (
      !inputValue ||
      !inputUnit ||
      !outputUnit ||
      isNaN(Number(inputValue)) ||
      Number(inputValue) < 0
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid input",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    const val = Number(inputValue);
    const mw = Number(molecularWeight);

    // If molarity involved, molecular weight must be positive
    if (
      (inputUnit === "molarity" || outputUnit === "molarity") &&
      (isNaN(mw) || mw <= 0)
    ) {
      return {
        value: "Waiting...",
        label: "Enter valid molecular weight (g/mol)",
        subtext:
          "Molecular weight is required for conversions involving molarity.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Conversion logic:
    // ppm to ppb: multiply by 1000
    // ppb to ppm: divide by 1000
    // ppm to molarity: (ppm mg/L) / (molecular weight g/mol) = mmol/L = mol/m³
    // But molarity is mol/L, so:
    // molarity (mol/L) = ppm (mg/L) / (molecular weight (g/mol) * 1000 mg/g)
    // => molarity = ppm / (mw * 1000)
    // Similarly for ppb:
    // ppb (µg/L) = 1e-3 mg/L
    // molarity = ppb / (mw * 1e6)

    let outputVal: number | null = null;
    let formulaUsed: string | null = null;

    // Helper formulas as strings for display
    const formulaPpmToPpb = "ppb = ppm × 1000";
    const formulaPpbToPpm = "ppm = ppb ÷ 1000";
    const formulaPpmToMolarity =
      "Molarity (mol/L) = ppm (mg/L) ÷ (Molecular Weight (g/mol) × 1000 mg/g)";
    const formulaPpbToMolarity =
      "Molarity (mol/L) = ppb (µg/L) ÷ (Molecular Weight (g/mol) × 1,000,000 µg/g)";
    const formulaMolarityToPpm =
      "ppm (mg/L) = Molarity (mol/L) × Molecular Weight (g/mol) × 1000 mg/g";
    const formulaMolarityToPpb =
      "ppb (µg/L) = Molarity (mol/L) × Molecular Weight (g/mol) × 1,000,000 µg/g";

    if (inputUnit === outputUnit) {
      // Same units, no conversion
      outputVal = val;
      formulaUsed = `No conversion needed: ${inputUnit} = ${outputUnit}`;
    } else if (inputUnit === "ppm" && outputUnit === "ppb") {
      outputVal = val * 1000;
      formulaUsed = formulaPpmToPpb;
    } else if (inputUnit === "ppb" && outputUnit === "ppm") {
      outputVal = val / 1000;
      formulaUsed = formulaPpbToPpm;
    } else if (inputUnit === "ppm" && outputUnit === "molarity") {
      outputVal = val / (mw * 1000);
      formulaUsed = formulaPpmToMolarity;
    } else if (inputUnit === "ppb" && outputUnit === "molarity") {
      outputVal = val / (mw * 1_000_000);
      formulaUsed = formulaPpbToMolarity;
    } else if (inputUnit === "molarity" && outputUnit === "ppm") {
      outputVal = val * mw * 1000;
      formulaUsed = formulaMolarityToPpm;
    } else if (inputUnit === "molarity" && outputUnit === "ppb") {
      outputVal = val * mw * 1_000_000;
      formulaUsed = formulaMolarityToPpb;
    } else {
      return {
        value: "Error",
        label: "Unsupported conversion",
        subtext: "",
        warning: "Conversion between selected units is not supported.",
        formulaUsed: null,
      };
    }

    // Format output with scientific notation if needed
    let displayVal: string;
    if (outputVal === null || isNaN(outputVal)) {
      displayVal = "Error";
    } else if (outputVal === 0) {
      displayVal = "0";
    } else if (Math.abs(outputVal) >= 10000 || Math.abs(outputVal) < 0.001) {
      displayVal = outputVal.toExponential(4);
    } else {
      displayVal = outputVal.toFixed(4);
    }

    // Units label
    let unitLabel = "";
    if (outputUnit === "ppm") unitLabel = "ppm (mg/L)";
    else if (outputUnit === "ppb") unitLabel = "ppb (µg/L)";
    else if (outputUnit === "molarity") unitLabel = "mol/L (M)";

    return {
      value: `${displayVal} ${unitLabel}`,
      label: `Converted concentration`,
      subtext:
        outputUnit === "molarity"
          ? "Molarity is in moles per liter (mol/L). Molecular weight used: " +
            mw.toFixed(4) +
            " g/mol."
          : "",
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is the difference between ppm and ppb?",
      answer:
        "Parts per million (ppm) and parts per billion (ppb) are units used to describe very dilute concentrations of substances. One ppm corresponds to one part of substance per million parts of the total, while one ppb corresponds to one part per billion parts. In water analysis, ppm is equivalent to mg/L and ppb to µg/L, assuming water density is approximately 1 g/mL.",
    },
    {
      question: "Why is molecular weight important for converting ppm/ppb to molarity?",
      answer:
        "Molarity measures concentration in moles per liter, which depends on the number of molecules rather than mass. To convert mass-based units like ppm or ppb to molarity, the molecular weight (grams per mole) of the substance is required. This allows conversion from mass units (mg or µg) to moles, enabling accurate molarity calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="inputValue" className="mb-1 font-semibold">
            Enter Concentration
          </Label>
          <Input
            id="inputValue"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5.0"
            value={inputs.inputValue}
            onChange={(e) => handleInputChange("inputValue", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="inputUnit" className="mb-1 font-semibold">
            From Unit
          </Label>
          <Select
            value={inputs.inputUnit}
            onValueChange={(val) => handleInputChange("inputUnit", val)}
          >
            <SelectTrigger id="inputUnit" className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ppm">ppm (mg/L)</SelectItem>
              <SelectItem value="ppb">ppb (µg/L)</SelectItem>
              <SelectItem value="molarity">Molarity (mol/L)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="outputUnit" className="mb-1 font-semibold">
            To Unit
          </Label>
          <Select
            value={inputs.outputUnit}
            onValueChange={(val) => handleInputChange("outputUnit", val)}
          >
            <SelectTrigger id="outputUnit" className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ppm">ppm (mg/L)</SelectItem>
              <SelectItem value="ppb">ppb (µg/L)</SelectItem>
              <SelectItem value="molarity">Molarity (mol/L)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(inputs.inputUnit === "molarity" || inputs.outputUnit === "molarity") && (
        <div>
          <Label htmlFor="molecularWeight" className="mb-1 font-semibold flex items-center gap-1">
            Molecular Weight (g/mol)
            <Info className="w-4 h-4 text-blue-500" />
          </Label>
          <Input
            id="molecularWeight"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 18.015 (water)"
            value={inputs.molecularWeight}
            onChange={(e) => handleInputChange("molecularWeight", e.target.value)}
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ inputValue: "", inputUnit: "", outputUnit: "", molecularWeight: "" })
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
              <strong>Science Fact:</strong> Molecular weight is essential when converting between mass-based units (ppm/ppb) and molarity, as it links mass to moles.
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
          Understanding ppm / ppb Concentration Converter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Parts per million (ppm) and parts per billion (ppb) are units commonly used to express very low concentrations of substances, especially in environmental science, chemistry, and engineering. For example, ppm is often used to measure pollutant levels in air or water, while ppb is used for even more dilute concentrations. This converter helps translate these units into molarity, which is essential for chemical reactions and lab work where concentrations are expressed in moles per liter.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The conversion between ppm, ppb, and molarity requires understanding the relationship between mass and moles. Since molarity depends on the number of molecules (moles) per liter, the molecular weight of the substance must be known to convert from mass-based units like ppm or ppb. This tool allows scientists and engineers to switch between these units accurately, facilitating precise calculations in research, environmental monitoring, and industrial processes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This converter is widely used in water quality analysis, atmospheric chemistry, and pharmaceutical formulations, where trace concentrations impact safety and efficacy. Understanding these units and their conversions is fundamental for accurate measurement and reporting in scientific disciplines.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`// ppm to molarity:
Molarity (mol/L) = ppm (mg/L) ÷ (Molecular Weight (g/mol) × 1000 mg/g)

// ppb to molarity:
Molarity (mol/L) = ppb (µg/L) ÷ (Molecular Weight (g/mol) × 1,000,000 µg/g)

// molarity to ppm:
ppm (mg/L) = Molarity (mol/L) × Molecular Weight (g/mol) × 1000 mg/g

// molarity to ppb:
ppb (µg/L) = Molarity (mol/L) × Molecular Weight (g/mol) × 1,000,000 µg/g

// ppm to ppb:
ppb = ppm × 1000

// ppb to ppm:
ppm = ppb ÷ 1000

Variables:
- ppm: parts per million (mg/L)
- ppb: parts per billion (µg/L)
- Molarity: moles per liter (mol/L)
- Molecular Weight: grams per mole (g/mol)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem: Convert 50 ppm of sodium chloride (NaCl) to molarity. The molecular weight of NaCl is approximately 58.44 g/mol.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> 50 ppm NaCl, Molecular Weight = 58.44 g/mol
          </li>
          <li>
            <strong>Step 1:</strong> Use the formula: Molarity = ppm ÷ (Molecular Weight × 1000)
          </li>
          <li>
            <strong>Calculation:</strong> 50 ÷ (58.44 × 1000) = 50 ÷ 58440 ≈ 0.0008557 mol/L
          </li>
          <li>
            <strong>Result:</strong> The molarity of NaCl is approximately 8.557 × 10<sup>-4</sup> mol/L.
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
      title="ppm / ppb Concentration Converter"
      description="Convert concentration units. Switch between parts per million (ppm), parts per billion (ppb), and molarity for trace analysis."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Molarity (mol/L) = ppm (mg/L) ÷ (Molecular Weight (g/mol) × 1000 mg/g)`,
        variables: [
          { symbol: "ppm", description: "Parts per million (mg/L)" },
          { symbol: "ppb", description: "Parts per billion (µg/L)" },
          { symbol: "M", description: "Molarity (mol/L)" },
          { symbol: "MW", description: "Molecular Weight (g/mol)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Convert 50 ppm of sodium chloride (NaCl) to molarity. Molecular weight of NaCl is 58.44 g/mol.",
        steps: [
          {
            label: "1",
            explanation:
              "Use the formula: Molarity = ppm ÷ (Molecular Weight × 1000)",
          },
          {
            label: "2",
            explanation:
              "Calculate: 50 ÷ (58.44 × 1000) = 0.0008557 mol/L",
          },
          {
            label: "3",
            explanation:
              "Result: Molarity ≈ 8.557 × 10⁻⁴ mol/L",
          },
        ],
        result: "0.0008557 mol/L (or 8.557 × 10⁻⁴ mol/L)",
      }}
      relatedCalculators={[
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
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