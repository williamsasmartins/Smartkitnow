import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function RcTimeConstantTauRcCalculator() {
  // Inputs: Resistance (R) in Ohms, Capacitance (C) in Farads
  const [inputs, setInputs] = useState({
    resistance: "",
    capacitance: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const R = parseFloat(inputs.resistance);
    const C = parseFloat(inputs.capacitance);

    // Validation
    if (inputs.resistance === "" || inputs.capacitance === "") {
      return {
        value: "Waiting...",
        label: "Enter resistance and capacitance",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }
    if (isNaN(R) || isNaN(C)) {
      return {
        value: "Invalid input",
        label: "Resistance and capacitance must be numbers",
        subtext: "",
        warning: "Please enter valid numeric values for both inputs.",
        formulaUsed: null,
      };
    }
    if (R <= 0 || C <= 0) {
      return {
        value: "Invalid input",
        label: "Resistance and capacitance must be &gt; 0",
        subtext: "",
        warning: "Resistance and capacitance values must be greater than zero.",
        formulaUsed: null,
      };
    }

    // Calculation: τ = R × C (seconds)
    const tau = R * C;

    // Formatting result: use scientific notation if very large or small
    const displayVal =
      tau > 10000 || tau < 0.001 ? tau.toExponential(4) : tau.toFixed(6);

    return {
      value: `${displayVal} seconds`,
      label: "RC Time Constant (τ)",
      subtext:
        "Time constant τ represents how quickly a capacitor charges or discharges through a resistor.",
      warning: null,
      formulaUsed: "τ = R × C",
    };
  }, [inputs]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the RC time constant and why is it important?",
      answer:
        "The RC time constant (τ) is the product of resistance (R) and capacitance (C) in an electrical circuit. It represents the characteristic time it takes for a capacitor to charge or discharge to approximately 63.2% of its full voltage. This concept is crucial in designing timing circuits, filters, and understanding transient responses in electronics.",
    },
    {
      question: "How do units affect the calculation of the RC time constant?",
      answer:
        "To correctly calculate the RC time constant, resistance must be in ohms (Ω) and capacitance in farads (F). Using other units like kilo-ohms or microfarads requires conversion to base units first. Incorrect units lead to wrong time constant values, affecting circuit behavior predictions.",
    },
    {
      question: "Where is the RC time constant applied in real-world engineering?",
      answer:
        "The RC time constant is widely used in electronics for designing filters, oscillators, and timers. It helps engineers predict how fast circuits respond to voltage changes, essential in signal processing, communication devices, and analog circuit design.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="resistance" className="font-semibold flex items-center gap-2">
            <Atom className="w-5 h-5 text-blue-600" />
            Resistance (R) in Ohms (Ω)
          </Label>
          <Input
            id="resistance"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="e.g. 1000"
            value={inputs.resistance}
            onChange={(e) => handleInputChange("resistance", e.target.value)}
            aria-describedby="resistance-help"
          />
          <p id="resistance-help" className="text-xs text-slate-500 mt-1">
            Enter resistance in ohms (Ω). Must be &gt; 0.
          </p>
        </div>

        <div>
          <Label htmlFor="capacitance" className="font-semibold flex items-center gap-2">
            <Atom className="w-5 h-5 text-blue-600" />
            Capacitance (C) in Farads (F)
          </Label>
          <Input
            id="capacitance"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            placeholder="e.g. 0.000001"
            value={inputs.capacitance}
            onChange={(e) => handleInputChange("capacitance", e.target.value)}
            aria-describedby="capacitance-help"
          />
          <p id="capacitance-help" className="text-xs text-slate-500 mt-1">
            Enter capacitance in farads (F). Must be &gt; 0.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Calculation is automatic on input change; button just triggers re-render if needed
            // No action needed here
          }}
          type="button"
          aria-label="Calculate RC Time Constant"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ resistance: "", capacitance: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <strong>Science Fact:</strong> The RC time constant τ is the time it takes for the capacitor voltage to reach about 63.2% of its final value during charging or discharging.
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
          Understanding RC Time Constant Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The RC time constant, denoted by τ (tau), is a fundamental concept in electronics and physics that describes how quickly a capacitor charges or discharges through a resistor. It is defined as the product of the resistance (R) in ohms (Ω) and the capacitance (C) in farads (F). The time constant τ has units of seconds and characterizes the exponential rate of voltage change across the capacitor.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In practical terms, after a time equal to τ, the voltage across a charging capacitor reaches approximately 63.2% of its final value, or during discharging, it falls to about 36.8% of its initial value. This behavior is crucial in timing circuits, filters, and transient analysis in electrical engineering.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding and calculating the RC time constant allows engineers and scientists to design circuits with precise timing characteristics, such as oscillators, pulse generators, and analog filters. It also helps in predicting how circuits respond to sudden changes in voltage or current.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`τ = R × C

Where:
  τ (tau) = RC time constant (seconds)
  R = Resistance (ohms, Ω)
  C = Capacitance (farads, F)

Units:
  1 Ω × 1 F = 1 second (s)

Note:
  For values in kilo-ohms (kΩ) or microfarads (μF), convert to base units first:
    1 kΩ = 1000 Ω
    1 μF = 1 × 10⁻⁶ F`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem to calculate the RC time constant for a simple circuit.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Given:</strong> A resistor of 10 kΩ (10,000 Ω) and a capacitor of 100 μF (100 × 10⁻⁶ F).
          </li>
          <li>
            <strong>Step 1:</strong> Convert units to base units:
            <br />
            R = 10,000 Ω
            <br />
            C = 100 × 10⁻⁶ F = 0.0001 F
          </li>
          <li>
            <strong>Step 2:</strong> Calculate τ:
            <br />
            τ = R × C = 10,000 × 0.0001 = 1 second
          </li>
          <li>
            <strong>Result:</strong> The RC time constant is 1 second, meaning the capacitor will charge to about 63.2% of the supply voltage in 1 second.
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
      title="RC Time Constant Calculator"
      description="Calculate the RC Time Constant (τ). Determine how fast a capacitor charges or discharges through a resistor in a circuit."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "τ = R × C",
        variables: [
          { symbol: "τ", description: "RC time constant (seconds)" },
          { symbol: "R", description: "Resistance (ohms, Ω)" },
          { symbol: "C", description: "Capacitance (farads, F)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the RC time constant for a circuit with a 10 kΩ resistor and a 100 μF capacitor.",
        steps: [
          { label: "1", explanation: "Convert units: 10 kΩ = 10,000 Ω; 100 μF = 0.0001 F." },
          { label: "2", explanation: "Multiply resistance and capacitance: τ = 10,000 × 0.0001." },
          { label: "3", explanation: "Calculate τ = 1 second." },
        ],
        result: "The RC time constant is 1 second.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
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