import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Zap, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PowerEfficiencyCalculator() {
  // Inputs:
  // Power calculation: Work done (Joules), Time (seconds)
  // Efficiency calculation: Useful output energy (Joules), Input energy (Joules)
  // User selects calculation type: "Power" or "Efficiency"
  const [inputs, setInputs] = useState({
    calculationType: "power", // "power" or "efficiency"
    workDone: "", // in Joules
    time: "", // in seconds
    usefulEnergy: "", // in Joules
    inputEnergy: "", // in Joules
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    // Parse inputs as floats
    const workDone = parseFloat(inputs.workDone);
    const time = parseFloat(inputs.time);
    const usefulEnergy = parseFloat(inputs.usefulEnergy);
    const inputEnergy = parseFloat(inputs.inputEnergy);

    // Validation helpers
    const isPositiveNumber = (n: number) => !isNaN(n) && n > 0;

    if (inputs.calculationType === "power") {
      // Power = Work done / Time
      if (!isPositiveNumber(workDone) || !isPositiveNumber(time)) {
        return {
          value: "Waiting...",
          label: "Enter valid positive numbers for Work done and Time",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      const power = workDone / time; // Watts (J/s)
      const displayVal =
        power > 10000 || power < 0.001
          ? power.toExponential(4) + " Watts"
          : power.toFixed(4) + " Watts";

      return {
        value: displayVal,
        label: "Power (Rate of Work Done)",
        subtext: "Power is the rate at which work is done, measured in Watts (Joules per second).",
        warning: null,
        formulaUsed: "P = W / t",
      };
    } else if (inputs.calculationType === "efficiency") {
      // Efficiency = (Useful output energy / Input energy) * 100%
      if (!isPositiveNumber(usefulEnergy) || !isPositiveNumber(inputEnergy)) {
        return {
          value: "Waiting...",
          label: "Enter valid positive numbers for Useful and Input Energy",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      if (usefulEnergy > inputEnergy) {
        return {
          value: "Invalid",
          label: "Useful energy cannot exceed input energy",
          subtext: "",
          warning: "Efficiency cannot be greater than 100%. Please check your inputs.",
          formulaUsed: "η = (Eₒ / Eᵢ) × 100%",
        };
      }
      const efficiency = (usefulEnergy / inputEnergy) * 100; // percentage
      const displayVal =
        efficiency < 0.001
          ? efficiency.toExponential(4) + " %"
          : efficiency.toFixed(4) + " %";

      return {
        value: displayVal,
        label: "Efficiency",
        subtext: "Efficiency is the ratio of useful output energy to input energy, expressed as a percentage.",
        warning: null,
        formulaUsed: "η = (Eₒ / Eᵢ) × 100%",
      };
    }

    return {
      value: "Waiting...",
      label: "Select calculation type and enter inputs",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is power in physics?",
      answer:
        "Power is defined as the rate at which work is done or energy is transferred over time. It is measured in Watts (W), where 1 Watt equals 1 Joule per second. Power helps quantify how quickly energy is used or produced in systems such as engines, electrical devices, and mechanical machines.",
    },
    {
      question: "How is efficiency calculated and why is it important?",
      answer:
        "Efficiency is the ratio of useful output energy to the total input energy, expressed as a percentage. It indicates how well a machine or process converts energy into useful work without losses. High efficiency means less wasted energy, which is crucial in engineering, energy conservation, and environmental sustainability.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Calculation Type Selector */}
      <div>
        <Label htmlFor="calculationType" className="mb-1 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
          <Zap className="w-5 h-5 text-yellow-500" />
          Select Calculation
        </Label>
        <Select
          value={inputs.calculationType}
          onValueChange={(val) => handleInputChange("calculationType", val)}
          id="calculationType"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose calculation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="power">Power (Watts)</SelectItem>
            <SelectItem value="efficiency">Efficiency (%)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      {inputs.calculationType === "power" && (
        <>
          <div>
            <Label htmlFor="workDone" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Scale className="w-5 h-5 text-green-600" />
              Work Done (Joules)
            </Label>
            <Input
              id="workDone"
              type="number"
              min="0"
              step="any"
              value={inputs.workDone}
              onChange={(e) => handleInputChange("workDone", e.target.value)}
              placeholder="e.g., 500"
            />
          </div>
          <div>
            <Label htmlFor="time" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Waves className="w-5 h-5 text-blue-600" />
              Time (seconds)
            </Label>
            <Input
              id="time"
              type="number"
              min="0"
              step="any"
              value={inputs.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              placeholder="e.g., 10"
            />
          </div>
        </>
      )}

      {inputs.calculationType === "efficiency" && (
        <>
          <div>
            <Label htmlFor="usefulEnergy" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Useful Output Energy (Joules)
            </Label>
            <Input
              id="usefulEnergy"
              type="number"
              min="0"
              step="any"
              value={inputs.usefulEnergy}
              onChange={(e) => handleInputChange("usefulEnergy", e.target.value)}
              placeholder="e.g., 400"
            />
          </div>
          <div>
            <Label htmlFor="inputEnergy" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-red-600" />
              Input Energy (Joules)
            </Label>
            <Input
              id="inputEnergy"
              type="number"
              min="0"
              step="any"
              value={inputs.inputEnergy}
              onChange={(e) => handleInputChange("inputEnergy", e.target.value)}
              placeholder="e.g., 500"
            />
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger recalculation by updating state with same values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              calculationType: "power",
              workDone: "",
              time: "",
              usefulEnergy: "",
              inputEnergy: "",
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
              <strong>Science Fact:</strong> Always ensure units are consistent. For example, work done and energy should be in Joules, and time in seconds for accurate power calculations.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Power &amp; Efficiency Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Power and efficiency are fundamental concepts in physics and engineering that describe how energy is transferred and utilized in systems. Power quantifies the rate at which work is done or energy is converted, measured in Watts (W), where 1 Watt equals 1 Joule per second. Efficiency, expressed as a percentage, measures how effectively a system converts input energy into useful output energy without losses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to compute either the power given work done and time, or the efficiency given useful output and input energies. Understanding these concepts is essential in designing engines, electrical devices, and mechanical systems to optimize performance and reduce energy waste.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, power &lt; 0 or time &lt;= 0 is physically meaningless, and efficiency cannot exceed 100%. Always double-check your input units to ensure accurate results.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Power (P) = Work done (W) / Time (t)
P = W / t

Variables:
P = Power (Watts, W)
W = Work done or energy transferred (Joules, J)
t = Time taken (seconds, s)

Efficiency (η) = (Useful output energy (Eₒ) / Input energy (Eᵢ)) × 100%
η = (Eₒ / Eᵢ) × 100%

Variables:
η = Efficiency (%)
Eₒ = Useful output energy (Joules, J)
Eᵢ = Input energy (Joules, J)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using this calculator:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> A machine does 1500 Joules of work in 30 seconds. Calculate the power output.</li>
          <li><strong>Step 1:</strong> Enter Work done = 1500 J and Time = 30 s in the calculator.</li>
          <li><strong>Step 2:</strong> Calculate power using P = W / t = 1500 J / 30 s = 50 Watts.</li>
          <li><strong>Result:</strong> The machine's power output is 50 Watts, meaning it does 50 Joules of work every second.</li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Similarly, you can calculate efficiency by entering the useful output and input energies to understand how effectively a system converts energy.
        </p>
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
      title="Power & Efficiency Calculator"
      description="Determine Power and Efficiency. Calculate the rate of work done and the energy efficiency of mechanical systems or engines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Power: P = W / t
Efficiency: η = (Eₒ / Eᵢ) × 100%`,
        variables: [
          { symbol: "P", description: "Power in Watts (W)" },
          { symbol: "W", description: "Work done or energy transferred in Joules (J)" },
          { symbol: "t", description: "Time in seconds (s)" },
          { symbol: "η", description: "Efficiency in percentage (%)" },
          { symbol: "Eₒ", description: "Useful output energy in Joules (J)" },
          { symbol: "Eᵢ", description: "Input energy in Joules (J)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A machine performs 1500 Joules of work in 30 seconds. Calculate its power output.",
        steps: [
          { label: "1", explanation: "Identify the given values: Work done W = 1500 J, Time t = 30 s." },
          { label: "2", explanation: "Apply the power formula: P = W / t = 1500 J / 30 s." },
          { label: "3", explanation: "Calculate: P = 50 Watts." },
        ],
        result: "The machine's power output is 50 Watts, indicating it does 50 Joules of work every second.",
      }}
      relatedCalculators={[
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
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