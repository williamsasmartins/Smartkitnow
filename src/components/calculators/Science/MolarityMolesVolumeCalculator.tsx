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
  // Inputs: molarity (M), moles (n), volume (V)
  // User selects which variable to calculate, inputs the other two.
  const [inputs, setInputs] = useState({
    calculate: "molarity", // "molarity" | "moles" | "volume"
    molarity: "",
    moles: "",
    volume: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants (for reference, not used in calculation)
  const R = 8.314; // J/(mol·K)

  // Calculation logic in useMemo
  const results = useMemo(() => {
    const calc = inputs.calculate;
    const M = parseFloat(inputs.molarity);
    const n = parseFloat(inputs.moles);
    const V = parseFloat(inputs.volume);

    // Validation helper
    const isValidNumber = (val: number) => !isNaN(val) && val > 0;

    // Early return if inputs invalid or missing
    if (calc === "molarity") {
      if (!isValidNumber(n) || !isValidNumber(V)) {
        return {
          value: "Waiting...",
          label: "Enter valid moles and volume",
          subtext: "",
          warning: null,
          formulaUsed: "M = n / V",
        };
      }
      // Molarity = moles / volume (mol/L)
      const molarity = n / V;
      const displayVal =
        molarity > 10000 || molarity < 0.001
          ? molarity.toExponential(4) + " M"
          : molarity.toFixed(4) + " M";
      return {
        value: displayVal,
        label: "Molarity (mol/L)",
        subtext: "Molarity is the concentration of solute in solution.",
        warning: null,
        formulaUsed: "M = n / V",
      };
    } else if (calc === "moles") {
      if (!isValidNumber(M) || !isValidNumber(V)) {
        return {
          value: "Waiting...",
          label: "Enter valid molarity and volume",
          subtext: "",
          warning: null,
          formulaUsed: "n = M × V",
        };
      }
      // Moles = molarity * volume
      const moles = M * V;
      const displayVal =
        moles > 10000 || moles < 0.001
          ? moles.toExponential(4) + " mol"
          : moles.toFixed(4) + " mol";
      return {
        value: displayVal,
        label: "Moles (mol)",
        subtext: "Amount of substance in moles.",
        warning: null,
        formulaUsed: "n = M × V",
      };
    } else if (calc === "volume") {
      if (!isValidNumber(n) || !isValidNumber(M)) {
        return {
          value: "Waiting...",
          label: "Enter valid moles and molarity",
          subtext: "",
          warning: null,
          formulaUsed: "V = n / M",
        };
      }
      // Volume = moles / molarity
      const volume = n / M;
      const displayVal =
        volume > 10000 || volume < 0.001
          ? volume.toExponential(4) + " L"
          : volume.toFixed(4) + " L";
      return {
        value: displayVal,
        label: "Volume (L)",
        subtext: "Volume of solution in liters.",
        warning: null,
        formulaUsed: "V = n / M",
      };
    }

    return {
      value: "Waiting...",
      label: "Select calculation and enter values",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is molarity and why is it important?",
      answer:
        "Molarity (M) is a measure of concentration representing moles of solute per liter of solution. It is essential in chemistry for preparing solutions with precise concentrations, enabling accurate reactions and analyses in labs and industry. Understanding molarity helps in stoichiometric calculations and titrations.",
    },
    {
      question: "How do I choose which variable to calculate?",
      answer:
        "You select the variable you want to find—molarity, moles, or volume—and input the other two values. This flexibility allows you to solve various practical problems, such as determining how much solute is needed or the volume of solution required for a reaction.",
    },
    {
      question: "Can volume be in units other than liters?",
      answer:
        "This calculator assumes volume in liters (L) for molarity calculations. If your volume is in milliliters (mL), convert it to liters by dividing by 1000 before using the calculator. Consistent units ensure accurate results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Select variable to calculate */}
      <div>
        <Label htmlFor="calculate" className="mb-1 font-semibold flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-blue-600" /> Calculate:
        </Label>
        <Select
          value={inputs.calculate}
          onValueChange={(val) => setInputs((prev) => ({ ...prev, calculate: val }))}
          id="calculate"
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
          <Label htmlFor="molarity" className="mb-1 font-semibold flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" /> Molarity (M)
          </Label>
          <Input
            id="molarity"
            type="number"
            min="0"
            step="any"
            placeholder="mol/L"
            value={inputs.molarity}
            onChange={(e) => handleInputChange("molarity", e.target.value)}
            disabled={inputs.calculate === "molarity"}
            aria-describedby="molarity-desc"
          />
          <p id="molarity-desc" className="text-xs text-slate-500 mt-1">
            Concentration in moles per liter (mol/L)
          </p>
        </div>

        {/* Moles input */}
        <div>
          <Label htmlFor="moles" className="mb-1 font-semibold flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" /> Moles (n)
          </Label>
          <Input
            id="moles"
            type="number"
            min="0"
            step="any"
            placeholder="mol"
            value={inputs.moles}
            onChange={(e) => handleInputChange("moles", e.target.value)}
            disabled={inputs.calculate === "moles"}
            aria-describedby="moles-desc"
          />
          <p id="moles-desc" className="text-xs text-slate-500 mt-1">
            Amount of substance in moles (mol)
          </p>
        </div>

        {/* Volume input */}
        <div>
          <Label htmlFor="volume" className="mb-1 font-semibold flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-blue-600" /> Volume (V)
          </Label>
          <Input
            id="volume"
            type="number"
            min="0"
            step="any"
            placeholder="L"
            value={inputs.volume}
            onChange={(e) => handleInputChange("volume", e.target.value)}
            disabled={inputs.calculate === "volume"}
            aria-describedby="volume-desc"
          />
          <p id="volume-desc" className="text-xs text-slate-500 mt-1">
            Volume of solution in liters (L)
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state with same values (no-op)
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
              calculate: "molarity",
              molarity: "",
              moles: "",
              volume: "",
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
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
              <strong>Science Fact:</strong> Molarity calculations are fundamental in chemistry labs for preparing solutions with precise concentrations, crucial for reactions and titrations.
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
          Understanding Molarity / Moles / Volume Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you find the molarity, moles, or volume of a chemical solution when two of these variables are known. Molarity (M) is defined as the number of moles of solute per liter of solution. It is a key concept in chemistry, used to describe solution concentrations precisely. The relationship between molarity (M), moles (n), and volume (V) is given by the formula M = n / V, where volume is in liters.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool is essential for students, educators, and professionals working in chemistry labs, pharmaceuticals, environmental science, and chemical engineering. It ensures accurate preparation of solutions, which is critical for reproducible experiments and industrial processes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always ensure your volume is in liters and moles in mol for consistent results. If volume is given in milliliters, convert it by dividing by 1000. This calculator also formats results in scientific notation for very large or small values, maintaining precision and clarity.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`M = \\frac{n}{V}

Where:
M = Molarity (mol/L)
n = Moles of solute (mol)
V = Volume of solution (L)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using this calculator:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> You have 0.5 moles of sodium chloride (NaCl) and want to prepare 2 liters of solution. Find the molarity.
          </li>
          <li>
            <strong>Step 1:</strong> Select "Molarity" as the variable to calculate.
          </li>
          <li>
            <strong>Step 2:</strong> Enter moles = 0.5 mol and volume = 2 L.
          </li>
          <li>
            <strong>Result:</strong> Molarity = 0.5 mol / 2 L = 0.25 M.
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
          "Calculate the molarity of a solution prepared by dissolving 0.5 moles of solute in 2 liters of solution.",
        steps: [
          { label: "1", explanation: "Select 'Molarity' as the variable to calculate." },
          { label: "2", explanation: "Input moles = 0.5 mol and volume = 2 L." },
          { label: "3", explanation: "Calculate molarity using M = n / V = 0.5 / 2 = 0.25 M." },
        ],
        result: "Molarity = 0.25 mol/L",
      }}
      relatedCalculators={[
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
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