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
  // Power (P) in Watts (W)
  // Work done (W) in Joules (J)
  // Time (t) in seconds (s)
  // Efficiency (%) as percentage (0-100)
  // User can calculate either Power or Efficiency based on inputs

  // We'll let user select calculation type: "Power" or "Efficiency"
  // For Power: inputs needed: Work done (J), Time (s)
  // For Efficiency: inputs needed: Useful power output (W), Power input (W)

  const [calcType, setCalcType] = useState("power"); // "power" or "efficiency"
  const [inputs, setInputs] = useState({
    workDone: "",
    time: "",
    powerOutput: "",
    powerInput: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Accept only numbers or empty string
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    // Parse inputs to floats
    const workDone = parseFloat(inputs.workDone);
    const time = parseFloat(inputs.time);
    const powerOutput = parseFloat(inputs.powerOutput);
    const powerInput = parseFloat(inputs.powerInput);

    // Validation and calculation
    if (calcType === "power") {
      // Calculate Power = Work done / Time
      if (isNaN(workDone) || isNaN(time)) {
        return {
          value: "Waiting...",
          label: "Enter Work done and Time",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      if (time <= 0) {
        return {
          value: "Invalid",
          label: "Time must be &gt; 0 seconds",
          subtext: "",
          warning: "Time cannot be zero or negative.",
          formulaUsed: "P = W / t",
        };
      }
      const power = workDone / time; // Watts (W)
      const displayVal =
        power > 10000 || (power !== 0 && power < 0.001)
          ? power.toExponential(4) + " W"
          : power.toFixed(4) + " W";
      return {
        value: displayVal,
        label: "Power",
        subtext: "Power is the rate of doing work, in Watts (W).",
        warning: null,
        formulaUsed: "P = W / t",
      };
    } else if (calcType === "efficiency") {
      // Calculate Efficiency = (Power output / Power input) * 100%
      if (isNaN(powerOutput) || isNaN(powerInput)) {
        return {
          value: "Waiting...",
          label: "Enter Power output and Power input",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      if (powerInput <= 0) {
        return {
          value: "Invalid",
          label: "Power input must be &gt; 0 Watts",
          subtext: "",
          warning: "Power input cannot be zero or negative.",
          formulaUsed: "η = (P_out / P_in) × 100%",
        };
      }
      if (powerOutput > powerInput) {
        return {
          value: "Invalid",
          label: "Power output cannot exceed Power input",
          subtext: "",
          warning: "Efficiency cannot be greater than 100%.",
          formulaUsed: "η = (P_out / P_in) × 100%",
        };
      }
      const efficiency = (powerOutput / powerInput) * 100; // Percentage
      const displayVal =
        efficiency > 10000 || (efficiency !== 0 && efficiency < 0.001)
          ? efficiency.toExponential(4) + " %"
          : efficiency.toFixed(4) + " %";
      return {
        value: displayVal,
        label: "Efficiency",
        subtext: "Efficiency is the ratio of useful power output to power input, expressed as a percentage.",
        warning: null,
        formulaUsed: "η = (P_out / P_in) × 100%",
      };
    }
    return {
      value: "Waiting...",
      label: "Select calculation type",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs, calcType]);

  // FAQs
  const faqs = [
    {
      question: "What is power in physics?",
      answer:
        "Power is the rate at which work is done or energy is transferred over time. It is measured in Watts (W), where one Watt equals one Joule per second. Understanding power helps in analyzing how quickly machines or systems perform tasks in engineering and everyday applications.",
    },
    {
      question: "Why is efficiency important in machines?",
      answer:
        "Efficiency measures how well a machine converts input energy into useful output energy, expressed as a percentage. High efficiency means less energy is wasted, which is crucial for saving resources and reducing costs in engineering, automotive, and energy industries. It also impacts environmental sustainability.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Calculation Type Selector */}
      <div>
        <Label htmlFor="calcType" className="mb-1 font-semibold flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Select Calculation
        </Label>
        <Select
          value={calcType}
          onValueChange={(val) => {
            setCalcType(val);
            setInputs({
              workDone: "",
              time: "",
              powerOutput: "",
              powerInput: "",
            });
          }}
          id="calcType"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose calculation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="power">Calculate Power (P)</SelectItem>
            <SelectItem value="efficiency">Calculate Efficiency (η)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      {calcType === "power" && (
        <>
          <div>
            <Label htmlFor="workDone" className="mb-1 flex items-center gap-2 font-semibold">
              <Atom className="w-5 h-5 text-blue-600" />
              Work done (W)
            </Label>
            <Input
              id="workDone"
              type="text"
              placeholder="Enter work done in Joules (J)"
              value={inputs.workDone}
              onChange={(e) => handleInputChange("workDone", e.target.value)}
              aria-describedby="workDoneHelp"
            />
            <p id="workDoneHelp" className="text-sm text-slate-500 mt-1">
              Work done in Joules (J). Must be &ge; 0.
            </p>
          </div>
          <div>
            <Label htmlFor="time" className="mb-1 flex items-center gap-2 font-semibold">
              <Zap className="w-5 h-5 text-red-600" />
              Time (t)
            </Label>
            <Input
              id="time"
              type="text"
              placeholder="Enter time in seconds (s)"
              value={inputs.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              aria-describedby="timeHelp"
            />
            <p id="timeHelp" className="text-sm text-slate-500 mt-1">
              Time in seconds (s). Must be &gt; 0.
            </p>
          </div>
        </>
      )}

      {calcType === "efficiency" && (
        <>
          <div>
            <Label htmlFor="powerOutput" className="mb-1 flex items-center gap-2 font-semibold">
              <Atom className="w-5 h-5 text-green-600" />
              Useful Power Output (P_out)
            </Label>
            <Input
              id="powerOutput"
              type="text"
              placeholder="Enter useful power output in Watts (W)"
              value={inputs.powerOutput}
              onChange={(e) => handleInputChange("powerOutput", e.target.value)}
              aria-describedby="powerOutputHelp"
            />
            <p id="powerOutputHelp" className="text-sm text-slate-500 mt-1">
              Useful power output in Watts (W). Must be &ge; 0.
            </p>
          </div>
          <div>
            <Label htmlFor="powerInput" className="mb-1 flex items-center gap-2 font-semibold">
              <Atom className="w-5 h-5 text-purple-600" />
              Power Input (P_in)
            </Label>
            <Input
              id="powerInput"
              type="text"
              placeholder="Enter power input in Watts (W)"
              value={inputs.powerInput}
              onChange={(e) => handleInputChange("powerInput", e.target.value)}
              aria-describedby="powerInputHelp"
            />
            <p id="powerInputHelp" className="text-sm text-slate-500 mt-1">
              Power input in Watts (W). Must be &gt; 0.
            </p>
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          type="button"
          aria-label="Calculate"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({
              workDone: "",
              time: "",
              powerOutput: "",
              powerInput: "",
            });
          }}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
          aria-label="Reset"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== "Waiting..." && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
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
              <strong>Science Fact:</strong> Always ensure units are consistent. For example, time must be in seconds and work in Joules to calculate power in Watts correctly.
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
          Understanding Power &amp; Efficiency Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Power is a fundamental concept in physics that describes the rate at which work is done or energy is transferred over time. It is measured in Watts (W), where 1 Watt equals 1 Joule per second. Efficiency, on the other hand, quantifies how effectively a machine or system converts input energy into useful output energy, expressed as a percentage. This calculator helps you determine either the power output of a system or its efficiency based on the inputs you provide.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          These calculations are essential in many real-world applications such as engineering, automotive design, and energy management. For example, engineers use power calculations to design engines and motors that meet specific performance criteria, while efficiency calculations help optimize energy use and reduce waste in mechanical and electrical systems.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these concepts allows scientists and engineers to improve machine performance, reduce environmental impact, and innovate new technologies that rely on energy transfer and conversion.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Power (P) = Work done (W) / Time (t)
P = W / t

Efficiency (η) = (Useful Power Output (P_out) / Power Input (P_in)) × 100%
η = (P_out / P_in) × 100%

Where:
P = Power in Watts (W)
W = Work done in Joules (J)
t = Time in seconds (s)
η = Efficiency in percentage (%)
P_out = Useful power output in Watts (W)
P_in = Power input in Watts (W)`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem using the power calculation:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A machine does 5000 Joules of work in 10 seconds.
          </li>
          <li>
            <strong>Step 1:</strong> Use the formula P = W / t.
          </li>
          <li>
            <strong>Step 2:</strong> Substitute values: P = 5000 J / 10 s = 500 W.
          </li>
          <li>
            <strong>Result:</strong> The power output of the machine is 500 Watts.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          This calculation helps engineers understand how much power a machine produces, which is critical for designing systems that meet performance requirements.
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
        formula: `Power (P) = Work done (W) / Time (t)\nEfficiency (η) = (Useful Power Output (P_out) / Power Input (P_in)) × 100%`,
        variables: [
          { symbol: "P", description: "Power in Watts (W)" },
          { symbol: "W", description: "Work done in Joules (J)" },
          { symbol: "t", description: "Time in seconds (s)" },
          { symbol: "η", description: "Efficiency in percentage (%)" },
          { symbol: "P_out", description: "Useful power output in Watts (W)" },
          { symbol: "P_in", description: "Power input in Watts (W)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the power output of a machine that does 5000 Joules of work in 10 seconds.",
        steps: [
          { label: "1", explanation: "Identify the known values: Work done W = 5000 J, Time t = 10 s." },
          { label: "2", explanation: "Apply the formula: P = W / t." },
          { label: "3", explanation: "Calculate: P = 5000 J / 10 s = 500 W." },
        ],
        result: "The power output is 500 Watts.",
      }}
      relatedCalculators={[
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
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