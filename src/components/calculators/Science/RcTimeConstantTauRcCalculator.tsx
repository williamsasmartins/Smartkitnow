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

export default function RcTimeConstantTauRcCalculator() {
  // Inputs: Resistance (R) in Ohms, Capacitance (C) in Farads
  const [inputs, setInputs] = useState({
    resistance: "",
    capacitance: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    // Allow only numbers, decimal points, and scientific notation
    if (/^[0-9eE.+-]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const R = parseFloat(inputs.resistance);
    const C = parseFloat(inputs.capacitance);

    // Validate inputs
    if (isNaN(R) || isNaN(C)) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "τ = R × C",
      };
    }
    if (R <= 0 || C <= 0) {
      return {
        value: "Invalid input",
        label: "",
        subtext: "",
        warning: "Resistance and Capacitance must be positive numbers.",
        formulaUsed: "τ = R × C",
      };
    }

    // Calculate time constant τ = R × C (seconds)
    const tau = R * C;

    // Format result in seconds, use scientific notation if very small or large
    const formattedTau =
      tau < 1e-3 || tau > 1e3 ? tau.toExponential(4) : tau.toFixed(6);

    return {
      value: `${formattedTau} s`,
      label: "RC Time Constant (Tau)",
      subtext:
        "Time constant τ represents how quickly a capacitor charges or discharges through a resistor.",
      warning: null,
      formulaUsed: "τ = R × C",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the RC time constant?",
      answer:
        "The RC time constant, denoted by τ (tau), is the product of resistance (R) and capacitance (C) in an electrical circuit. It represents the time required for a capacitor to charge or discharge approximately 63.2% of the way through the resistor-capacitor network.",
    },
    {
      question: "Why must resistance and capacitance be positive?",
      answer:
        "Resistance and capacitance values must be positive because negative or zero values do not physically represent real components. Negative resistance or capacitance is non-physical in typical circuits and would invalidate the calculation of the time constant.",
    },
    {
      question: "How is the RC time constant used in circuits?",
      answer:
        "The RC time constant is crucial in timing circuits, filters, and signal processing. It determines how fast a capacitor charges or discharges, affecting the response time and frequency characteristics of the circuit.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="resistance" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <Scale className="w-5 h-5 text-blue-600" />
            Resistance (R) in Ohms (Ω)
          </Label>
          <Input
            id="resistance"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 1000 or 1e3"
            value={inputs.resistance}
            onChange={(e) => handleInputChange("resistance", e.target.value)}
            aria-describedby="resistance-help"
            spellCheck={false}
          />
          <p id="resistance-help" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter resistance value in Ohms (Ω), must be &gt; 0.
          </p>
        </div>

        <div>
          <Label htmlFor="capacitance" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <FlaskConical className="w-5 h-5 text-indigo-600" />
            Capacitance (C) in Farads (F)
          </Label>
          <Input
            id="capacitance"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 0.000001 or 1e-6"
            value={inputs.capacitance}
            onChange={(e) => handleInputChange("capacitance", e.target.value)}
            aria-describedby="capacitance-help"
            spellCheck={false}
          />
          <p id="capacitance-help" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter capacitance value in Farads (F), must be &gt; 0.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
          aria-label="Calculate RC Time Constant"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ resistance: "", capacitance: "" })}
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
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider" aria-label="Formula used">
                {results.formulaUsed || "Calculated Result"}
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-label="Result value">
                {results.value}
              </p>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding RC Time Constant Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The RC time constant, denoted by τ (tau), is a fundamental parameter in electrical engineering that describes how quickly a capacitor charges or discharges through a resistor. It is calculated as the product of resistance (R) in Ohms (Ω) and capacitance (C) in Farads (F). The time constant τ has units of seconds (s) and represents the time it takes for the voltage across the capacitor to reach approximately 63.2% of its final value during charging or discharging.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In practical circuits, the RC time constant determines the speed of response in filters, timers, and other signal processing applications. A larger τ means the capacitor charges or discharges more slowly, while a smaller τ means a faster response. Understanding and calculating τ is essential for designing circuits with desired timing characteristics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Note that both resistance and capacitance must be positive values. If either is zero or negative, the time constant is not physically meaningful. This calculator helps you precisely compute τ and understand its significance in your circuit designs.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`τ = R × C

Where:
  τ (tau) = RC time constant (seconds, s)
  R = Resistance (Ohms, Ω), R &gt; 0
  C = Capacitance (Farads, F), C &gt; 0`}
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
      title="RC Time Constant Calculator"
      description="Calculate the RC Time Constant (τ). Determine how fast a capacitor charges or discharges through a resistor in a circuit."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "τ = R × C",
        variables: [
          { symbol: "τ", description: "RC time constant in seconds (s)" },
          { symbol: "R", description: "Resistance in Ohms (Ω), R &gt; 0" },
          { symbol: "C", description: "Capacitance in Farads (F), C &gt; 0" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the RC time constant for a circuit with a 10 kΩ resistor and a 100 μF capacitor.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert values to standard units: 10 kΩ = 10,000 Ω, 100 μF = 100 × 10⁻⁶ F = 0.0001 F.",
          },
          {
            label: "2",
            explanation: "Apply the formula τ = R × C = 10,000 Ω × 0.0001 F = 1 second.",
          },
          {
            label: "3",
            explanation:
              "Interpretation: The capacitor will charge or discharge to about 63.2% of its final voltage in 1 second.",
          },
        ],
        result: "RC time constant τ = 1 s",
      }}
      // USE THIS VARIABLE EXACTLY - NO MANUAL EDITS
      relatedCalculators={[
        { title: "Wave Speed / Frequency / Wavelength", url: "/science/wave-speed-frequency-wavelength", icon: "🚀" },
        { title: "Buffer (Henderson–Hasselbalch) Helper", url: "/science/buffer-henderson-hasselbalch-helper", icon: "🧪" },
        { title: "Specific Heat Calculator", url: "/science/specific-heat-q-mc-delta-t", icon: "🔥" },
        { title: "Density / Specific Gravity Calculator", url: "/science/density-specific-gravity-calculator", icon: "🪐" },
        { title: "Kinematics Equations Solver (SUVAT)", url: "/science/kinematics-suvat-solver", icon: "🚀" },
        { title: "ppm / ppb Concentration Converter", url: "/science/ppm-ppb-concentration-converter", icon: "🧪" },
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