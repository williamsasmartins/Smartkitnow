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
  // Inputs: actualYield (g or mol), theoreticalYield (g or mol), unit (grams or moles)
  const [inputs, setInputs] = useState({
    actualYield: "",
    theoreticalYield: "",
    unit: "grams",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const actualYieldNum = parseFloat(inputs.actualYield);
    const theoreticalYieldNum = parseFloat(inputs.theoreticalYield);
    const unit = inputs.unit;

    if (
      isNaN(actualYieldNum) ||
      isNaN(theoreticalYieldNum) ||
      actualYieldNum <= 0 ||
      theoreticalYieldNum <= 0
    ) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    // Percent Yield = (Actual Yield / Theoretical Yield) * 100%
    const percentYield = (actualYieldNum / theoreticalYieldNum) * 100;

    let warning = null;
    if (percentYield > 100) {
      warning =
        "Percent yield &gt; 100% indicates possible measurement error or impurities.";
    }

    // Format numbers with 4 decimals or scientific notation if very small/large
    const formatNumber = (num: number) => {
      if (num !== 0 && (Math.abs(num) < 0.001 || Math.abs(num) > 100000)) {
        return num.toExponential(4);
      }
      return num.toFixed(4);
    };

    return {
      value: `${formatNumber(percentYield)} %`,
      label: `Percent Yield (${unit})`,
      subtext: `Actual Yield = ${actualYieldNum} ${unit}, Theoretical Yield = ${theoreticalYieldNum} ${unit}`,
      warning,
      formulaUsed: "Percent Yield = (Actual Yield / Theoretical Yield) × 100%",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is percent yield in a chemical reaction?",
      answer:
        "Percent yield measures the efficiency of a chemical reaction by comparing the actual amount of product obtained to the maximum possible amount (theoretical yield). It is expressed as a percentage and helps chemists evaluate reaction success and optimize conditions.",
    },
    {
      question: "Why can percent yield be greater than 100%?",
      answer:
        "Percent yield greater than 100% usually indicates errors such as impurities in the product, incomplete drying, or measurement inaccuracies. It is physically impossible to produce more product than the theoretical maximum.",
    },
    {
      question: "How do I calculate theoretical yield?",
      answer:
        "Theoretical yield is calculated based on stoichiometry from the balanced chemical equation, using the limiting reactant amount. It represents the maximum amount of product expected under ideal conditions.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="actualYield" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <FlaskConical className="w-4 h-4 text-blue-600" /> Actual Yield
          </Label>
          <Input
            id="actualYield"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 5.0"
            value={inputs.actualYield}
            onChange={(e) => handleInputChange("actualYield", e.target.value)}
            aria-describedby="actualYieldHelp"
          />
          <p id="actualYieldHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Amount of product obtained (g or mol)
          </p>
        </div>

        <div>
          <Label htmlFor="theoreticalYield" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Scale className="w-4 h-4 text-blue-600" /> Theoretical Yield
          </Label>
          <Input
            id="theoreticalYield"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 6.5"
            value={inputs.theoreticalYield}
            onChange={(e) => handleInputChange("theoreticalYield", e.target.value)}
            aria-describedby="theoreticalYieldHelp"
          />
          <p id="theoreticalYieldHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Maximum expected product (g or mol)
          </p>
        </div>

        <div>
          <Label htmlFor="unit" className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Info className="w-4 h-4 text-blue-600" /> Unit
          </Label>
          <Select
            value={inputs.unit}
            onValueChange={(value) => handleInputChange("unit", value)}
            aria-label="Select unit for yield"
          >
            <SelectTrigger id="unit" className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grams">Grams (g)</SelectItem>
              <SelectItem value="moles">Moles (mol)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No additional action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate percent yield"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Percent Yield & Theoretical Yield
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In chemistry, the <strong>theoretical yield</strong> is the maximum amount of product that can be formed from the given quantities of reactants, assuming perfect conditions and complete reaction. It is calculated using stoichiometry based on the balanced chemical equation. The <strong>actual yield</strong> is the amount of product actually obtained from the reaction, which is often less due to side reactions, incomplete reactions, or losses during processing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The <strong>percent yield</strong> quantifies the efficiency of a reaction by comparing the actual yield to the theoretical yield, expressed as a percentage. It is calculated as: <em>Percent Yield = (Actual Yield / Theoretical Yield) × 100%</em>. Percent yield values typically range from 0% to 100%, but values &gt; 100% can occur due to impurities or measurement errors.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding percent yield is crucial in both academic and industrial chemistry to optimize reactions, reduce waste, and improve cost-effectiveness. It also helps identify potential issues in experimental procedures or product purity.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Percent Yield (%) = (Actual Yield / Theoretical Yield) × 100%

Where:
  Actual Yield      = amount of product obtained (grams or moles)
  Theoretical Yield = maximum possible product amount (grams or moles)`}
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
      title="Percent Yield & Theoretical Yield"
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
          "A chemist expects to produce 10.0 grams of a compound from a reaction. After performing the experiment, the actual product obtained is 8.5 grams. Calculate the percent yield.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the actual yield (8.5 g) and theoretical yield (10.0 g).",
          },
          {
            label: "2",
            explanation:
              "Apply the formula: Percent Yield = (8.5 g / 10.0 g) × 100% = 85%.",
          },
          {
            label: "3",
            explanation:
              "Interpret the result: The reaction had an 85% efficiency.",
          },
        ],
        result: "Percent Yield = 85%",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Specific Heat Calculator", url: "/science/specific-heat-q-mc-delta-t", icon: "🔥" },
        { title: "Power & Efficiency Calculator", url: "/science/power-efficiency-calculator", icon: "🔥" },
        { title: "Free-Fall Time/Velocity Estimator", url: "/science/free-fall-time-velocity-estimator", icon: "🧪" },
        { title: "Thin Lens Solver", url: "/science/thin-lens-solver", icon: "🌈" },
        { title: "Gravity on Other Planets Calculator", url: "/science/gravity-on-other-planets-calculator", icon: "🪐" },
        { title: "Orbital Period (Kepler) Estimator", url: "/science/orbital-period-kepler-estimator", icon: "🪐" },
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