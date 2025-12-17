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

const relatedCalculators = [
  { title: "Kinematics Equations Solver (SUVAT)", url: "/science/kinematics-suvat-solver", icon: "🚀" },
  { title: "Percent Yield & Theoretical Yield", url: "/science/percent-yield-theoretical-yield", icon: "🧪" },
  { title: "Projectile Motion Calculator", url: "/science/projectile-motion-calculator", icon: "🚀" },
  { title: "Capacitor/Inductor Reactance Calculator", url: "/science/reactance-capacitor-inductor-educational", icon: "⚡" },
  { title: "Density / Specific Gravity Calculator", url: "/science/density-specific-gravity-calculator", icon: "🪐" },
  { title: "Force, Work & Energy Calculator", url: "/science/force-work-energy-calculator", icon: "🚀" },
];

export default function PpmPpbConcentrationConverterCalculator() {
  const [inputs, setInputs] = useState({
    inputValue: "",
    inputUnit: "ppm",
    outputUnit: "ppb",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Conversion logic:
   * ppm = parts per million = 1 part / 10^6 parts
   * ppb = parts per billion = 1 part / 10^9 parts
   * molarity (M) = moles per liter (mol/L)
   * 
   * For trace analysis, ppm and ppb are often mass-based or mole-based.
   * Here, we assume ppm and ppb are dimensionless ratios (mass or mole fraction).
   * 
   * Conversion:
   * 1 ppm = 1e-6 (fraction)
   * 1 ppb = 1e-9 (fraction)
   * 
   * To convert between ppm and ppb:
   * ppm to ppb: multiply by 1000
   * ppb to ppm: divide by 1000
   * 
   * To convert ppm or ppb to molarity (mol/L), additional info is needed:
   * molarity = (ppm or ppb) * density (g/mL) / molar mass (g/mol)
   * 
   * Since density and molar mass are not provided, we cannot convert to molarity accurately.
   * We will allow conversion only between ppm and ppb.
   * 
   * If user selects molarity, we show a warning that density and molar mass are required.
   */

  const results = useMemo(() => {
    const { inputValue, inputUnit, outputUnit } = inputs;

    if (!inputValue || isNaN(Number(inputValue))) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    const val = Number(inputValue);

    // Supported units: ppm, ppb, molarity
    const units = ["ppm", "ppb", "molarity"];

    if (!units.includes(inputUnit) || !units.includes(outputUnit)) {
      return {
        value: "Error",
        label: "Unsupported unit selected",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    // Conversion factors between ppm and ppb
    // 1 ppm = 1000 ppb
    // molarity conversion requires density and molar mass - not provided

    if (inputUnit === outputUnit) {
      return {
        value: val.toExponential(4) + " " + outputUnit,
        label: `Same unit: ${outputUnit}`,
        subtext: "No conversion needed.",
        warning: null,
        formulaUsed: null,
      };
    }

    // ppm <-> ppb conversion
    if ((inputUnit === "ppm" && outputUnit === "ppb") || (inputUnit === "ppb" && outputUnit === "ppm")) {
      let convertedValue: number;
      if (inputUnit === "ppm" && outputUnit === "ppb") {
        convertedValue = val * 1000;
      } else {
        convertedValue = val / 1000;
      }
      return {
        value: convertedValue.toExponential(4) + " " + outputUnit,
        label: `Converted concentration in ${outputUnit}`,
        subtext:
          outputUnit === "ppm"
            ? "1 ppm = 10⁻⁶ (fraction), 1 ppb = 10⁻⁹ (fraction)"
            : "1 ppb = 10⁻⁹ (fraction), 1 ppm = 10⁻⁶ (fraction)",
        warning: null,
        formulaUsed: `Conversion: 1 ppm = 1000 ppb`,
      };
    }

    // Conversion involving molarity - cannot compute without density and molar mass
    if (inputUnit === "molarity" || outputUnit === "molarity") {
      return {
        value: "N/A",
        label: "Conversion involving molarity requires density and molar mass",
        subtext: "Please provide density and molar mass for accurate conversion.",
        warning:
          "Molarity conversion is not supported in this tool without density (g/mL) and molar mass (g/mol).",
        formulaUsed: null,
      };
    }

    return {
      value: "Error",
      label: "Invalid conversion",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between ppm and ppb?",
      answer:
        "Parts per million (ppm) and parts per billion (ppb) are units used to express very dilute concentrations of substances. 1 ppm means one part of substance per million parts of the total, while 1 ppb means one part per billion parts. Therefore, 1 ppm equals 1000 ppb. These units are commonly used in environmental science, chemistry, and biology to measure trace amounts.",
    },
    {
      question: "Can I convert ppm or ppb to molarity directly?",
      answer:
        "Direct conversion from ppm or ppb to molarity requires additional information such as the density of the solution and the molar mass of the solute. Without these, the conversion is not possible because ppm and ppb are ratios by mass or volume, while molarity is moles per liter. This tool currently supports conversion only between ppm and ppb.",
    },
    {
      question: "Why do we use scientific notation in concentration values?",
      answer:
        "Scientific notation is used to express very large or very small numbers concisely and clearly. Concentrations like ppm and ppb often involve very small fractions (e.g., 1 ppm = 1×10⁻⁶), so scientific notation helps avoid errors and improves readability in scientific calculations and communication.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="inputValue" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
          <FlaskConical className="w-5 h-5 text-blue-600" /> Enter Concentration Value
        </Label>
        <Input
          id="inputValue"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 1.23"
          value={inputs.inputValue}
          onChange={(e) => handleInputChange("inputValue", e.target.value)}
          aria-describedby="inputValueHelp"
        />
        <p id="inputValueHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter a positive numeric value.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="inputUnit" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-5 h-5 text-green-600" /> From Unit
          </Label>
          <Select
            value={inputs.inputUnit}
            onValueChange={(value) => handleInputChange("inputUnit", value)}
            id="inputUnit"
            aria-label="Select input concentration unit"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ppm">ppm (parts per million)</SelectItem>
              <SelectItem value="ppb">ppb (parts per billion)</SelectItem>
              <SelectItem value="molarity">Molarity (mol/L)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="outputUnit" className="flex items-center gap-2 mb-1 font-semibold text-slate-700 dark:text-slate-300">
            <Orbit className="w-5 h-5 text-purple-600" /> To Unit
          </Label>
          <Select
            value={inputs.outputUnit}
            onValueChange={(value) => handleInputChange("outputUnit", value)}
            id="outputUnit"
            aria-label="Select output concentration unit"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ppm">ppm (parts per million)</SelectItem>
              <SelectItem value="ppb">ppb (parts per billion)</SelectItem>
              <SelectItem value="molarity">Molarity (mol/L)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          aria-label="Calculate concentration conversion"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ inputValue: "", inputUnit: "ppm", outputUnit: "ppb" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding ppm / ppb Concentration Converter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Parts per million (ppm) and parts per billion (ppb) are units used to express extremely dilute concentrations of substances in mixtures or solutions.
          Specifically, 1 ppm means one part of a substance per one million parts of the total, while 1 ppb means one part per one billion parts.
          These units are crucial in fields such as environmental science, chemistry, and biology for measuring trace amounts of pollutants, chemicals, or nutrients.
          The converter tool helps switch between these units accurately, ensuring clarity in scientific communication.
          Note that ppm and ppb are dimensionless ratios often based on mass or volume fractions, and converting to molarity requires additional parameters like density and molar mass.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Conversion between ppm and ppb:

1 ppm = 1 × 10⁻⁶ (fraction)
1 ppb = 1 × 10⁻⁹ (fraction)

Therefore:

ppm to ppb: ppb = ppm × 1000
ppb to ppm: ppm = ppb ÷ 1000

Variables:
- ppm: parts per million (unitless ratio)
- ppb: parts per billion (unitless ratio)

Note:
- Molarity (mol/L) conversion requires density (ρ, g/mL) and molar mass (M, g/mol):
  molarity = (ppm × ρ) / M

Since density and molar mass are not provided, molarity conversions are not supported here.`}
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
        formula: `ppb = ppm × 1000\nppm = ppb ÷ 1000`,
        variables: [
          { symbol: "ppm", description: "Parts per million (unitless ratio)" },
          { symbol: "ppb", description: "Parts per billion (unitless ratio)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Convert 2.5 ppm of a pollutant to ppb to understand its concentration in a more precise unit.",
        steps: [
          {
            label: "1",
            explanation: "Identify the input value and units: 2.5 ppm.",
          },
          {
            label: "2",
            explanation: "Use the conversion formula: ppb = ppm × 1000.",
          },
          {
            label: "3",
            explanation: "Calculate: 2.5 × 1000 = 2500 ppb.",
          },
        ],
        result: "2.5 ppm equals 2.5 × 10³ ppb (2500 ppb).",
      }}
      relatedCalculators={relatedCalculators}
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