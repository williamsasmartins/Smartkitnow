import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ SAFE ICONS ONLY
import { Atom, Zap, Waves, Info, RotateCcw, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const relatedCalculators = [
  { title: "Gravity on Other Planets Calculator", url: "/science/gravity-on-other-planets-calculator", icon: "🪐" },
  { title: "Molality & Normality Converter", url: "/science/molality-normality-converter", icon: "🧪" },
  { title: "Percent Composition by Mass", url: "/science/percent-composition-by-mass", icon: "🧪" },
  { title: "Radioactive Activity Calculator", url: "/science/radioactive-activity-a-lambda-n", icon: "🧪" },
  { title: "Photon Energy Calculator", url: "/science/photon-energy-e-hf", icon: "🔥" },
  { title: "Force, Work & Energy Calculator", url: "/science/force-work-energy-calculator", icon: "🚀" },
];

export default function ReactanceCapacitorInductorEducationalCalculator() {
  const [inputs, setInputs] = useState({
    frequency: "",
    capacitance: "",
    inductance: "",
    reactanceType: "capacitor",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const f = parseFloat(inputs.frequency);
    const C = parseFloat(inputs.capacitance);
    const L = parseFloat(inputs.inductance);
    const type = inputs.reactanceType;

    const TWO_PI = 2 * Math.PI;

    if (!f || f <= 0) {
      return {
        value: "Waiting...",
        label: "",
        subtext: "",
        warning: "Frequency must be a positive number (Hz).",
        formulaUsed: null,
      };
    }

    if (type === "capacitor") {
      if (!C || C <= 0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Capacitance must be a positive number (Farads).",
          formulaUsed: null,
        };
      }
      // Xc = 1 / (2πfC)
      const Xc = 1 / (TWO_PI * f * C);
      const XcStr = Xc >= 1e3 || Xc <= 1e-3 ? Xc.toExponential(4) : Xc.toFixed(4);
      return {
        value: `${XcStr} Ω`,
        label: "Capacitive Reactance",
        subtext: "Opposition to AC current by capacitor",
        warning: null,
        formulaUsed: "X₍c₎ = 1 / (2πfC)",
      };
    } else if (type === "inductor") {
      if (!L || L <= 0) {
        return {
          value: "Waiting...",
          label: "",
          subtext: "",
          warning: "Inductance must be a positive number (Henrys).",
          formulaUsed: null,
        };
      }
      // Xl = 2πfL
      const Xl = TWO_PI * f * L;
      const XlStr = Xl >= 1e3 || Xl <= 1e-3 ? Xl.toExponential(4) : Xl.toFixed(4);
      return {
        value: `${XlStr} Ω`,
        label: "Inductive Reactance",
        subtext: "Opposition to AC current by inductor",
        warning: null,
        formulaUsed: "X₍L₎ = 2πfL",
      };
    }

    return {
      value: "Waiting...",
      label: "",
      subtext: "",
      warning: "Select a valid reactance type.",
      formulaUsed: null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is reactance in AC circuits?",
      answer:
        "Reactance is the opposition that capacitors and inductors provide to alternating current (AC). Unlike resistance, reactance varies with frequency and causes phase shifts between voltage and current. Capacitive reactance decreases with frequency, while inductive reactance increases with frequency.",
    },
    {
      question: "Why does capacitive reactance decrease with frequency?",
      answer:
        "Capacitive reactance (Xc) is inversely proportional to frequency (f) and capacitance (C), given by Xc = 1 / (2πfC). As frequency increases, the capacitor charges and discharges more rapidly, allowing AC to pass more easily, thus reducing reactance.",
    },
    {
      question: "How does inductive reactance affect AC circuits?",
      answer:
        "Inductive reactance (Xl) increases linearly with frequency and inductance, given by Xl = 2πfL. It causes the current to lag behind the voltage, affecting the phase and impedance of the circuit, which is crucial in tuning and filtering applications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="reactanceType" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <Zap className="w-5 h-5 text-yellow-600" />
            Reactance Type
          </Label>
          <Select
            value={inputs.reactanceType}
            onValueChange={(value) => handleInputChange("reactanceType", value)}
            id="reactanceType"
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="capacitor" className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-blue-500" /> Capacitive Reactance
              </SelectItem>
              <SelectItem value="inductor" className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-red-500" /> Inductive Reactance
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frequency" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <Waves className="w-5 h-5 text-cyan-600" />
            Frequency (Hz)
          </Label>
          <Input
            id="frequency"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 60"
            value={inputs.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
            aria-describedby="frequency-help"
          />
          <p id="frequency-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Frequency must be &gt; 0 Hertz (Hz).
          </p>
        </div>

        {inputs.reactanceType === "capacitor" && (
          <div>
            <Label htmlFor="capacitance" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <Info className="w-5 h-5 text-blue-600" />
              Capacitance (Farads)
            </Label>
            <Input
              id="capacitance"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 0.000001 (1μF)"
              value={inputs.capacitance}
              onChange={(e) => handleInputChange("capacitance", e.target.value)}
              aria-describedby="capacitance-help"
            />
            <p id="capacitance-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter capacitance in Farads (F). Must be &gt; 0.
            </p>
          </div>
        )}

        {inputs.reactanceType === "inductor" && (
          <div>
            <Label htmlFor="inductance" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
              <Info className="w-5 h-5 text-red-600" />
              Inductance (Henrys)
            </Label>
            <Input
              id="inductance"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 0.01"
              value={inputs.inductance}
              onChange={(e) => handleInputChange("inductance", e.target.value)}
              aria-describedby="inductance-help"
            />
            <p id="inductance-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter inductance in Henrys (H). Must be &gt; 0.
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger recalculation by setting inputs to current inputs (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate Reactance"
        >
          <Atom className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              frequency: "",
              capacitance: "",
              inductance: "",
              reactanceType: "capacitor",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset Inputs"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-live="polite" aria-atomic="true">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
              {results.warning && (
                <div
                  className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg flex items-start gap-3 text-left"
                  role="alert"
                  aria-live="assertive"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Capacitor/Inductor Reactance Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Reactance is a fundamental concept in alternating current (AC) circuits that quantifies the opposition to current flow caused by capacitors and inductors. Unlike resistance, which dissipates energy as heat, reactance stores energy temporarily in electric or magnetic fields. Capacitive reactance decreases as frequency increases, allowing AC to pass more easily through capacitors. Conversely, inductive reactance increases with frequency, impeding current flow through inductors.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine the reactance of capacitors and inductors at a given frequency, which is essential for designing and analyzing AC circuits such as filters, oscillators, and impedance matching networks. Understanding reactance enables engineers and students to predict how circuits will behave under different signal frequencies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Always ensure that the frequency and component values entered are positive and in the correct units: Hertz (Hz) for frequency, Farads (F) for capacitance, and Henrys (H) for inductance. The results are presented in Ohms (Ω), the unit of reactance.
        </p>
      </section>

      <section id="formula" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Formula &amp; Variables</h2>
        <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto font-mono text-slate-800 dark:text-slate-200">
{`Capacitive Reactance (X₍c₎):
X₍c₎ = 1 / (2πfC)

Inductive Reactance (X₍L₎):
X₍L₎ = 2πfL

Where:
  X₍c₎ = Capacitive Reactance (Ohms, Ω)
  X₍L₎ = Inductive Reactance (Ohms, Ω)
  f = Frequency (Hertz, Hz), f &gt; 0
  C = Capacitance (Farads, F), C &gt; 0
  L = Inductance (Henrys, H), L &gt; 0
  π ≈ 3.14159`}
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
      title="Capacitor/Inductor Reactance Calculator"
      description="Calculate reactance for AC circuits. Determine the opposition to current flow in capacitors and inductors at specific frequencies."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `X₍c₎ = 1 / (2πfC)  (Capacitive Reactance)
X₍L₎ = 2πfL  (Inductive Reactance)`,
        variables: [
          { symbol: "X₍c₎", description: "Capacitive Reactance (Ohms, Ω)" },
          { symbol: "X₍L₎", description: "Inductive Reactance (Ohms, Ω)" },
          { symbol: "f", description: "Frequency (Hertz, Hz), f &gt; 0" },
          { symbol: "C", description: "Capacitance (Farads, F), C &gt; 0" },
          { symbol: "L", description: "Inductance (Henrys, H), L &gt; 0" },
          { symbol: "π", description: "Pi, approximately 3.14159" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the capacitive reactance of a 1μF capacitor at 60 Hz frequency.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify the values: f = 60 Hz, C = 1μF = 1×10⁻⁶ F.",
          },
          {
            label: "2",
            explanation:
              "Apply the formula: X₍c₎ = 1 / (2π × 60 × 1×10⁻⁶).",
          },
          {
            label: "3",
            explanation:
              "Calculate: X₍c₎ ≈ 2652.58 Ω.",
          },
        ],
        result: "The capacitive reactance is approximately 2652.58 Ohms (Ω).",
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