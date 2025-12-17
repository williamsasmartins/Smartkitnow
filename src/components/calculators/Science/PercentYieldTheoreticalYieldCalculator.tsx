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

export default function PercentYieldTheoreticalYieldCalculator() {
  // Inputs: actualYield (grams or moles), theoreticalYield (grams or moles), unit (g or mol)
  const [inputs, setInputs] = useState({
    actualYield: "",
    theoreticalYield: "",
    unit: "grams",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const actual = parseFloat(inputs.actualYield);
    const theoretical = parseFloat(inputs.theoreticalYield);
    const unit = inputs.unit;

    // Validation
    if (isNaN(actual) || isNaN(theoretical)) {
      return {
        value: "Waiting...",
        label: "Enter valid numeric values",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (actual < 0 || theoretical <= 0) {
      return {
        value: "Invalid input",
        label: "Actual yield must be ≥ 0 and theoretical yield must be &gt; 0",
        subtext: "",
        warning: "Yields cannot be negative; theoretical yield must be positive.",
        formulaUsed: null,
      };
    }
    if (actual > theoretical) {
      return {
        value: "Warning",
        label: "Actual yield &gt; Theoretical yield",
        subtext: "Check your inputs for accuracy.",
        warning: "Actual yield cannot realistically exceed theoretical yield.",
        formulaUsed: null,
      };
    }

    // Calculations
    // Percent Yield = (Actual Yield / Theoretical Yield) × 100%
    const percentYield = (actual / theoretical) * 100;

    // Formatting percent yield with 2 decimals
    const percentYieldDisplay = percentYield.toFixed(2) + " %";

    // Theoretical Yield display with unit
    // Use scientific notation if very large or small
    const formatValue = (val: number) =>
      val > 10000 || val < 0.001 ? val.toExponential(4) : val.toFixed(4);

    const theoreticalDisplay = `${formatValue(theoretical)} ${unit}`;

    return {
      value: percentYieldDisplay,
      label: `Percent Yield (based on theoretical yield of ${theoreticalDisplay})`,
      subtext: `Actual Yield: ${formatValue(actual)} ${unit}`,
      warning: null,
      formulaUsed: "Percent Yield = (Actual Yield / Theoretical Yield) × 100%",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is percent yield and why is it important?",
      answer:
        "Percent yield measures the efficiency of a chemical reaction by comparing the actual amount of product obtained to the maximum possible amount (theoretical yield). It helps chemists understand how successful a reaction was and identify losses due to side reactions or experimental errors. High percent yield indicates an efficient reaction, which is crucial in industrial and laboratory settings.",
    },
    {
      question: "How do I calculate theoretical yield in a chemical reaction?",
      answer:
        "Theoretical yield is calculated based on stoichiometry from the balanced chemical equation. It represents the maximum amount of product expected if the reaction proceeds perfectly with no losses. To find it, convert the limiting reactant amount to moles, use mole ratios to find moles of product, then convert to grams or desired units using molar mass.",
    },
    {
      question: "Can percent yield be greater than 100%?",
      answer:
        "Percent yield should never exceed 100% because it represents the ratio of actual to theoretical product. Values above 100% usually indicate measurement errors, impurities in the product, or incomplete drying. Always verify your data and experimental procedure if you encounter percent yields greater than 100%.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="actualYield" className="mb-1 font-semibold flex items-center gap-1">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            Actual Yield
          </Label>
          <Input
            id="actualYield"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 12.5"
            value={inputs.actualYield}
            onChange={(e) => handleInputChange("actualYield", e.target.value)}
            aria-describedby="actualYieldHelp"
          />
          <p id="actualYieldHelp" className="text-xs text-slate-500 mt-1">
            Enter the actual amount of product obtained.
          </p>
        </div>

        <div>
          <Label htmlFor="theoreticalYield" className="mb-1 font-semibold flex items-center gap-1">
            <Scale className="w-5 h-5 text-blue-600" />
            Theoretical Yield
          </Label>
          <Input
            id="theoreticalYield"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 15.0"
            value={inputs.theoreticalYield}
            onChange={(e) => handleInputChange("theoreticalYield", e.target.value)}
            aria-describedby="theoreticalYieldHelp"
          />
          <p id="theoreticalYieldHelp" className="text-xs text-slate-500 mt-1">
            Enter the maximum possible amount of product.
          </p>
        </div>

        <div>
          <Label htmlFor="unit" className="mb-1 font-semibold flex items-center gap-1">
            <Info className="w-5 h-5 text-blue-600" />
            Unit
          </Label>
          <Select
            value={inputs.unit}
            onValueChange={(val) => handleInputChange("unit", val)}
            id="unit"
            aria-describedby="unitHelp"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grams">Grams (g)</SelectItem>
              <SelectItem value="moles">Moles (mol)</SelectItem>
            </SelectContent>
          </Select>
          <p id="unitHelp" className="text-xs text-slate-500 mt-1">
            Select the unit for your yields.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate Percent Yield"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ actualYield: "", theoreticalYield: "", unit: "grams" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
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
              <strong>Science Fact:</strong> Percent yield is essential for evaluating reaction efficiency in industrial chemistry and research labs, helping optimize processes and reduce waste.
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
          Understanding Percent Yield &amp; Theoretical Yield
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In chemistry, the <strong>theoretical yield</strong> is the maximum amount of product that can be formed from given reactants, assuming perfect conversion and no losses. It is calculated using stoichiometry based on the balanced chemical equation. The <strong>actual yield</strong> is the amount of product actually obtained from the reaction, which is often less due to side reactions, incomplete reactions, or experimental errors.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The <strong>percent yield</strong> quantifies the efficiency of a reaction by comparing the actual yield to the theoretical yield, expressed as a percentage. It is calculated as:
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4 italic text-center font-semibold">
          Percent Yield = (Actual Yield / Theoretical Yield) × 100%
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Percent yield values are always between 0% and 100%, where 100% means the reaction was perfectly efficient. Values less than 100% indicate losses or inefficiencies. This concept is crucial in industrial chemistry to optimize production and minimize waste, as well as in academic labs to assess experimental success.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Percent Yield (%) = (Actual Yield / Theoretical Yield) × 100%

Where:
  Actual Yield      = amount of product obtained (grams or moles)
  Theoretical Yield = maximum possible amount of product (grams or moles)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem to understand percent yield calculation:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A reaction theoretically produces 20.0 grams of product, but the actual isolated product weighs 16.5 grams.
          </li>
          <li>
            <strong>Step 1:</strong> Calculate percent yield using the formula:
            <br />
            Percent Yield = (16.5 g / 20.0 g) × 100% = 82.5%
          </li>
          <li>
            <strong>Result:</strong> The reaction had an 82.5% yield, indicating some product loss or inefficiency during the process.
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
      title="Percent Yield &amp; Theoretical Yield"
      description="Calculate Percent Yield. Compare actual yield to theoretical yield to measure the efficiency of a chemical reaction."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Percent Yield (%) = (Actual Yield / Theoretical Yield) × 100%",
        variables: [
          { symbol: "Actual Yield", description: "Amount of product obtained (grams or moles)" },
          { symbol: "Theoretical Yield", description: "Maximum possible product amount (grams or moles)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A reaction theoretically produces 20.0 grams of product, but only 16.5 grams are actually obtained.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate percent yield using the formula: (16.5 g / 20.0 g) × 100% = 82.5%",
          },
        ],
        result: "The percent yield is 82.5%, indicating the reaction was fairly efficient but not perfect.",
      }}
      relatedCalculators={[
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
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