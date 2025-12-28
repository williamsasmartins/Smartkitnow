import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, AlertTriangle, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ThreePhasePowerCalculator() {
  const [inputs, setInputs] = useState({
    voltage: "", // Line-to-line voltage (V)
    current: "", // Line current (A)
    powerFactor: "1", // Power factor (cos φ), default 1 (unity)
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const V = parseFloat(inputs.voltage);
    const I = parseFloat(inputs.current);
    const pf = parseFloat(inputs.powerFactor);

    if (
      isNaN(V) ||
      isNaN(I) ||
      isNaN(pf) ||
      V <= 0 ||
      I <= 0 ||
      pf <= 0 ||
      pf > 1
    ) {
      return {
        primary: "—",
        secondary: "Watts (W)",
        details:
          "Please enter valid positive numbers. Power factor must be between 0 and 1.",
        feedback: "",
      };
    }

    // 3-Phase Power Formula: P = √3 × V × I × PF
    const power = Math.sqrt(3) * V * I * pf;

    return {
      primary: power.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }),
      secondary: "Watts (W)",
      details: `Calculated using P = √3 × V × I × PF with V=${V} V, I=${I} A, PF=${pf}`,
      feedback:
        pf < 0.85
          ? "Warning: Low power factor can cause inefficiencies and higher costs."
          : "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is 3-phase power and why is it used?",
      answer:
        "Three-phase power is a method of alternating current electric power generation, transmission, and distribution. It uses three wires, each carrying current that reaches its peak at one-third of a cycle apart, providing a constant power transfer. This system is more efficient and economical for powering large motors and heavy loads compared to single-phase power.",
    },
    {
      question: "What units should I use for voltage and current?",
      answer:
        "Voltage should be entered as the line-to-line RMS voltage in volts (V), and current should be the line current in amperes (A). Ensure you use consistent units to get accurate results. For example, if your system voltage is 400 V line-to-line, enter 400 for voltage.",
    },
    {
      question: "What is power factor and how does it affect power calculation?",
      answer:
        "Power factor (PF) is the ratio of real power flowing to the load to apparent power in the circuit. It ranges from 0 to 1 and indicates how effectively electrical power is being used. A PF of 1 means all power is used effectively, while lower values indicate inefficiencies. The calculator multiplies power by PF to give real power in watts.",
    },
    {
      question: "Can this calculator be used for single-phase systems?",
      answer:
        "No, this calculator is specifically designed for three-phase power calculations. Single-phase power calculations use a different formula (P = V × I × PF). Using this calculator for single-phase systems will give incorrect results.",
    },
    {
      question: "Why is the power factor defaulted to 1?",
      answer:
        "The power factor defaults to 1 (unity) assuming a purely resistive load, which is common in many calculations for simplicity. If you know the actual power factor of your load, you should enter it to get a more accurate real power value.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculate the real power consumed by a 3-phase motor operating at 400 V line-to-line voltage, drawing 30 A line current, with a power factor of 0.85.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the line-to-line voltage: 400 V, line current: 30 A, and power factor: 0.85.",
      },
      {
        label: "Step 2",
        explanation:
          "Use the formula P = √3 × V × I × PF to calculate power.",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate: √3 × 400 × 30 × 0.85 ≈ 17,700 Watts or 17.7 kW.",
      },
    ],
    result:
      "The motor consumes approximately 17,700 Watts (17.7 kW) of real power under these conditions.",
  };

  const references = [
    {
      title: "NEC (National Electrical Code)",
      description:
        "The NEC provides guidelines and standards for electrical installations including 3-phase power systems.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "IEEE Std 141-1993 (Red Book)",
      description:
        "IEEE recommended practice for electric power distribution for industrial plants, including 3-phase power calculations.",
      url: "https://standards.ieee.org/standard/141-1993.html",
    },
    {
      title: "Electrical4U - Three Phase Power",
      description:
        "A comprehensive resource explaining three-phase power concepts and calculations.",
      url: "https://www.electrical4u.com/three-phase-power/",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voltage">Line-to-Line Voltage (V)</Label>
          <Input
            id="voltage"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 400"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current">Line Current (A)</Label>
          <Input
            id="current"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 30"
            value={inputs.current}
            onChange={(e) => handleInputChange("current", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="powerFactor">Power Factor (0 to 1)</Label>
          <Input
            id="powerFactor"
            type="number"
            min={0}
            max={1}
            step="any"
            placeholder="e.g. 0.85"
            value={inputs.powerFactor}
            onChange={(e) => handleInputChange("powerFactor", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Result
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p className="text-sm text-amber-700 mt-3 font-semibold">
                ⚠️ {results.feedback}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Enter the line-to-line voltage (V) of your 3-phase system in volts.
          </li>
          <li>
            Enter the line current (A) drawn by the load or equipment in amperes.
          </li>
          <li>
            Enter the power factor (PF) of the load, a value between 0 and 1. If
            unknown, use 1 for unity power factor.
          </li>
          <li>
            Click the <strong>Calculate</strong> button to compute the real power
            in watts.
          </li>
          <li>
            Review the result and any safety or efficiency warnings provided.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to 3-Phase Power Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Three-phase power systems are widely used in industrial and commercial
            electrical installations due to their efficiency and ability to
            deliver constant power. The real power consumed by a balanced three-phase
            load can be calculated using the formula:
          </p>
          <p className="font-mono text-lg text-center">
            P = √3 × V × I × PF
          </p>
          <p>
            Where <em>P</em> is the real power in watts (W), <em>V</em> is the
            line-to-line voltage in volts (V), <em>I</em> is the line current in
            amperes (A), and <em>PF</em> is the power factor (unitless, between 0
            and 1).
          </p>
          <p>
            This formula assumes a balanced load and sinusoidal voltages and
            currents. The power factor accounts for the phase difference between
            voltage and current, representing how effectively the electrical power
            is being converted into useful work.
          </p>
          <p>
            It is important to use the correct units and ensure the power factor is
            accurate for precise calculations. This calculator helps engineers,
            electricians, and students quickly determine the real power consumption
            of three-phase equipment.
          </p>
        </div>
      </section>

      {/* FIXED CSS FOR READABILITY */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Always verify that the voltage and current
            values entered correspond to the line-to-line voltage and line current,
            respectively. Using line-to-neutral voltage or incorrect current values
            will lead to inaccurate results.
          </p>
          <p>
            Do not use this calculator for single-phase systems as the formula and
            assumptions differ significantly. For single-phase power, use P = V × I
            × PF.
          </p>
          <p>
            Ensure the power factor is between 0 and 1. Values outside this range are
            invalid and will produce incorrect calculations.
          </p>
          <p>
            Low power factor values indicate inefficient power usage and can cause
            overheating and increased electricity costs. Consider power factor
            correction if your load has a low power factor.
          </p>
          <p>
            Always follow local electrical codes and standards when designing or
            analyzing electrical systems.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-2">
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p>
            <strong>Result:</strong> {example.result}
          </p>
        </div>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional
          resources
        </h2>
        <div className="space-y-4">
          {references.map((ref, i) => (
            <div key={i}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                {ref.title} <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {ref.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="3-Phase Power Calculator"
      description="Professional electrical calculator: 3-Phase Power Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "guide", label: "Complete Guide" },
        { id: "mistakes", label: "Safety & Mistakes" },
        { id: "example", label: "Real World Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}