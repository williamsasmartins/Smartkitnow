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

export default function ReactanceCapacitorInductorEducationalCalculator() {
  // Inputs: frequency (Hz), capacitance (F), inductance (H), reactance type (capacitive or inductive)
  const [inputs, setInputs] = useState({
    frequency: "",
    capacitance: "",
    inductance: "",
    reactanceType: "capacitive", // or "inductive"
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants
  const TWO_PI = 2 * Math.PI;

  // Calculation and validation in useMemo
  const results = useMemo(() => {
    const freq = parseFloat(inputs.frequency);
    const cap = parseFloat(inputs.capacitance);
    const ind = parseFloat(inputs.inductance);
    const type = inputs.reactanceType;

    // Validation
    if (isNaN(freq) || freq <= 0) {
      return {
        value: "Waiting...",
        label: "Enter a valid frequency &gt; 0 Hz",
        subtext: "",
        warning: null,
        formulaUsed: null,
      };
    }

    if (type === "capacitive") {
      if (isNaN(cap) || cap <= 0) {
        return {
          value: "Waiting...",
          label: "Enter a valid capacitance &gt; 0 Farads",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      // Xc = 1 / (2πfC)
      const reactance = 1 / (TWO_PI * freq * cap);
      const displayVal =
        reactance > 10000 || reactance < 0.001
          ? reactance.toExponential(4)
          : reactance.toFixed(4);
      return {
        value: `${displayVal} Ω`,
        label: "Capacitive Reactance",
        subtext:
          "Opposition to current flow by a capacitor at given frequency",
        warning: null,
        formulaUsed: "X₍c₎ = 1 / (2πfC)",
      };
    } else if (type === "inductive") {
      if (isNaN(ind) || ind <= 0) {
        return {
          value: "Waiting...",
          label: "Enter a valid inductance &gt; 0 Henrys",
          subtext: "",
          warning: null,
          formulaUsed: null,
        };
      }
      // Xl = 2πfL
      const reactance = TWO_PI * freq * ind;
      const displayVal =
        reactance > 10000 || reactance < 0.001
          ? reactance.toExponential(4)
          : reactance.toFixed(4);
      return {
        value: `${displayVal} Ω`,
        label: "Inductive Reactance",
        subtext:
          "Opposition to current flow by an inductor at given frequency",
        warning: null,
        formulaUsed: "X₍l₎ = 2πfL",
      };
    }

    return {
      value: "Waiting...",
      label: "Select reactance type and enter inputs",
      subtext: "",
      warning: null,
      formulaUsed: null,
    };
  }, [inputs]);

  // FAQs
  const faqs = [
    {
      question: "What is reactance in AC circuits?",
      answer:
        "Reactance is the opposition that capacitors and inductors provide to alternating current (AC). Unlike resistance, reactance depends on the frequency of the AC signal and the component's properties. Capacitive reactance decreases with increasing frequency, while inductive reactance increases with frequency.",
    },
    {
      question: "Why does capacitive reactance decrease with frequency?",
      answer:
        "Capacitive reactance (X₍c₎) is inversely proportional to frequency (f) and capacitance (C), given by X₍c₎ = 1/(2πfC). As frequency increases, the capacitor charges and discharges more rapidly, allowing more current to pass, thus reducing reactance. This behavior is essential in filters and tuning circuits.",
    },
    {
      question: "Where are capacitive and inductive reactances applied in real life?",
      answer:
        "Reactance calculations are fundamental in designing AC circuits such as radio tuners, filters, and power supplies. Engineers use these values to control signal frequencies, reduce noise, and improve energy efficiency. For example, inductors and capacitors are used in resonance circuits to select desired frequencies in communication devices.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget JSX
  const widget = (
    <div className="space-y-6">
      {/* Reactance Type Selector */}
      <div>
        <Label htmlFor="reactanceType" className="mb-1 font-semibold">
          Select Reactance Type
        </Label>
        <Select
          value={inputs.reactanceType}
          onValueChange={(value) => handleInputChange("reactanceType", value)}
          id="reactanceType"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select reactance type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="capacitive">
              <Zap className="mr-2 inline h-4 w-4" /> Capacitive Reactance
            </SelectItem>
            <SelectItem value="inductive">
              <Zap className="mr-2 inline h-4 w-4 rotate-90" /> Inductive Reactance
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Frequency Input */}
      <div>
        <Label htmlFor="frequency" className="mb-1 font-semibold">
          Frequency (Hz)
        </Label>
        <Input
          id="frequency"
          type="number"
          min="0"
          step="any"
          placeholder="e.g., 60"
          value={inputs.frequency}
          onChange={(e) => handleInputChange("frequency", e.target.value)}
        />
      </div>

      {/* Conditional Inputs */}
      {inputs.reactanceType === "capacitive" && (
        <div>
          <Label htmlFor="capacitance" className="mb-1 font-semibold">
            Capacitance (Farads)
          </Label>
          <Input
            id="capacitance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 0.000001 (1 μF)"
            value={inputs.capacitance}
            onChange={(e) => handleInputChange("capacitance", e.target.value)}
          />
        </div>
      )}
      {inputs.reactanceType === "inductive" && (
        <div>
          <Label htmlFor="inductance" className="mb-1 font-semibold">
            Inductance (Henrys)
          </Label>
          <Input
            id="inductance"
            type="number"
            min="0"
            step="any"
            placeholder="e.g., 0.01"
            value={inputs.inductance}
            onChange={(e) => handleInputChange("inductance", e.target.value)}
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger calculation by updating state (already reactive)
          }}
          type="button"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ frequency: "", capacitance: "", inductance: "", reactanceType: "capacitive" })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <strong>Science Fact:</strong> Reactance varies with frequency; capacitive reactance decreases as frequency increases, while inductive reactance increases.
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
          Understanding Capacitor/Inductor Reactance Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Reactance is a fundamental concept in alternating current (AC) circuits that describes how capacitors and inductors resist the flow of current. Unlike resistance, which dissipates energy as heat, reactance stores energy temporarily in electric or magnetic fields. Capacitive reactance decreases as frequency increases, while inductive reactance increases with frequency. This calculator helps you determine the reactance of capacitors and inductors at specific frequencies, essential for designing and analyzing AC circuits.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding reactance is crucial in many real-world applications such as radio tuning, signal filtering, and power management. Engineers use these calculations to optimize circuit performance, ensuring signals are transmitted or blocked as desired. This tool provides a precise and educational approach to calculating reactance, reinforcing the underlying physics principles.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Always remember to input frequency in Hertz (Hz), capacitance in Farads (F), and inductance in Henrys (H). The results are displayed in Ohms (Ω), representing the opposition to current flow caused by the reactive components.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula & Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Capacitive Reactance:
X₍c₎ = 1 / (2πfC)

Inductive Reactance:
X₍l₎ = 2πfL

Where:
  X₍c₎ = Capacitive Reactance (Ohms, Ω)
  X₍l₎ = Inductive Reactance (Ohms, Ω)
  f = Frequency (Hertz, Hz)
  C = Capacitance (Farads, F)
  L = Inductance (Henrys, H)

Note: π ≈ 3.14159`}
        </pre>
      </section>

      <section id="example" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Step-by-Step Example</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Let's solve a real-world problem to find the capacitive reactance of a 1 μF capacitor at 60 Hz.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Given:</strong> Frequency, f = 60 Hz; Capacitance, C = 1 μF = 1 × 10⁻⁶ F</li>
          <li><strong>Step 1:</strong> Calculate reactance using the formula X₍c₎ = 1 / (2πfC)</li>
          <li><strong>Step 2:</strong> Substitute values: X₍c₎ = 1 / (2 × 3.14159 × 60 × 1×10⁻⁶) ≈ 2652.58 Ω</li>
          <li><strong>Result:</strong> The capacitive reactance is approximately 2652.58 Ohms, meaning the capacitor opposes AC current flow with this reactance at 60 Hz.</li>
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
      title="Capacitor/Inductor Reactance Calculator"
      description="Calculate reactance for AC circuits. Determine the opposition to current flow in capacitors and inductors at specific frequencies."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `Capacitive Reactance: X₍c₎ = 1 / (2πfC)
Inductive Reactance: X₍l₎ = 2πfL`,
        variables: [
          { symbol: "X₍c₎", description: "Capacitive Reactance (Ohms, Ω)" },
          { symbol: "X₍l₎", description: "Inductive Reactance (Ohms, Ω)" },
          { symbol: "f", description: "Frequency (Hertz, Hz)" },
          { symbol: "C", description: "Capacitance (Farads, F)" },
          { symbol: "L", description: "Inductance (Henrys, H)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the capacitive reactance of a 1 μF capacitor at 60 Hz frequency.",
        steps: [
          {
            label: "1",
            explanation:
              "Use the formula X₍c₎ = 1 / (2πfC) and substitute f = 60 Hz and C = 1×10⁻⁶ F.",
          },
          {
            label: "2",
            explanation:
              "Calculate X₍c₎ = 1 / (2 × 3.14159 × 60 × 1×10⁻⁶) ≈ 2652.58 Ω.",
          },
        ],
        result:
          "The capacitive reactance is approximately 2652.58 Ohms, indicating the opposition to AC current at 60 Hz.",
      }}
      relatedCalculators={[
        { title: "Kinematics Equations (SUVAT)", url: "/science/kinematics-equations", icon: "🚀" },
        { title: "Molarity Calculator", url: "/science/molarity-calculator", icon: "🧪" },
        { title: "Ideal Gas Law", url: "/science/ideal-gas-law", icon: "🎈" },
        { title: "Photon Energy", url: "/science/photon-energy", icon: "⚡" },
        { title: "Snell's Law", url: "/science/snells-law", icon: "🌈" },
        { title: "Orbital Period", url: "/science/orbital-period", icon: "🪐" },
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