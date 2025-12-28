import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ThreePhasePowerCalculator() {
  const [inputs, setInputs] = useState({
    voltage: "", // Line-to-line voltage (V)
    current: "", // Current (A)
    powerFactor: "", // Power factor (0-1)
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * 3-Phase Power Formulas:
   * 
   * Apparent Power (S) in VA = √3 × V_line × I_line
   * Real Power (P) in Watts = √3 × V_line × I_line × Power Factor
   * Reactive Power (Q) in VAR = √3 × V_line × I_line × sin(acos(PF))
   * 
   * Inputs:
   * - voltage: line-to-line voltage (V)
   * - current: line current (A)
   * - powerFactor: unitless (0-1)
   */

  const results = useMemo(() => {
    const V = parseFloat(inputs.voltage);
    const I = parseFloat(inputs.current);
    const PF = parseFloat(inputs.powerFactor);

    if (
      isNaN(V) ||
      isNaN(I) ||
      isNaN(PF) ||
      V <= 0 ||
      I <= 0 ||
      PF < 0 ||
      PF > 1
    ) {
      return {
        primary: "Invalid input",
        secondary: "",
        details: "Please enter valid positive numbers. Power factor must be between 0 and 1.",
        feedback: "",
      };
    }

    const sqrt3 = Math.sqrt(3);
    const apparentPower = sqrt3 * V * I; // VA
    const realPower = apparentPower * PF; // Watts
    const reactivePower = apparentPower * Math.sqrt(1 - PF * PF); // VAR

    return {
      primary: `${realPower.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} W`,
      secondary: "Real Power (P)",
      details: `Apparent Power (S): ${apparentPower.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} VA | Reactive Power (Q): ${reactivePower.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })} VAR`,
      feedback:
        PF < 0.85
          ? "Warning: Low power factor can cause inefficiencies and higher costs."
          : "Power factor is within typical range.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between real power, apparent power, and reactive power?",
      answer:
        "Real power (P), measured in watts (W), is the actual power consumed by the load to perform useful work. Apparent power (S), measured in volt-amperes (VA), is the product of the RMS voltage and current without considering phase angle. Reactive power (Q), measured in volt-amperes reactive (VAR), represents the power stored and released by inductive or capacitive elements in the system, which does not perform useful work but affects the current flow. Understanding these distinctions is crucial for designing efficient electrical systems and selecting appropriate equipment.",
    },
    {
      question: "Why is the power factor important in 3-phase power calculations?",
      answer:
        "Power factor (PF) is the ratio of real power to apparent power and indicates how effectively electrical power is being used. A low power factor means more current is required to deliver the same amount of useful power, leading to increased losses in conductors and transformers, higher utility charges, and potential overheating. Correcting power factor improves system efficiency, reduces energy costs, and prolongs equipment life. This calculator incorporates power factor to provide accurate real power values.",
    },
    {
      question: "Can this calculator be used for both delta and wye configurations?",
      answer:
        "Yes, this calculator assumes line-to-line voltage input, which is common for both delta and wye (star) configurations in 3-phase systems. The formulas used are general for balanced 3-phase loads. However, for unbalanced loads or specific configurations, additional parameters and calculations may be necessary. Always verify system configuration and consult detailed engineering references for complex scenarios.",
    },
    {
      question: "What units should I use for voltage and current inputs?",
      answer:
        "Voltage should be entered as the line-to-line RMS voltage in volts (V), and current should be the line current in amperes (A). Power factor is a unitless decimal between 0 and 1 representing the cosine of the phase angle between voltage and current. Using consistent units ensures accurate calculations and meaningful results.",
    },
    {
      question: "How does this calculator handle power factor values outside the 0 to 1 range?",
      answer:
        "The calculator validates the power factor input to ensure it is between 0 and 1. Values outside this range are considered invalid because power factor represents the cosine of the phase angle and cannot exceed these bounds. If an invalid value is entered, the calculator will prompt the user to correct the input for accurate results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the real power consumption of a 3-phase industrial motor operating at 480 V line-to-line voltage, drawing 50 A current with a power factor of 0.9.",
    steps: [
      {
        label: "Step 1: Identify inputs",
        explanation:
          "Voltage (V) = 480 V, Current (I) = 50 A, Power Factor (PF) = 0.9",
      },
      {
        label: "Step 2: Calculate apparent power (S)",
        explanation:
          "S = √3 × V × I = 1.732 × 480 × 50 = 41,569 VA (approx.)",
      },
      {
        label: "Step 3: Calculate real power (P)",
        explanation:
          "P = S × PF = 41,569 × 0.9 = 37,412 W (approx.)",
      },
      {
        label: "Step 4: Calculate reactive power (Q)",
        explanation:
          "Q = S × sin(acos(PF)) = 41,569 × sin(acos(0.9)) ≈ 18,042 VAR",
      },
    ],
    result:
      "The motor consumes approximately 37.4 kW of real power, with an apparent power of 41.6 kVA and reactive power of 18.0 kVAR.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "IEEE Std 141-1993 (Red Book)",
      description:
        "IEEE Recommended Practice for Electric Power Distribution for Industrial Plants.",
      url: "https://standards.ieee.org/standard/141-1993.html",
    },
    {
      title: "Electrical Power Systems Technology, 3rd Edition",
      description:
        "A comprehensive textbook covering fundamentals of power systems including 3-phase power calculations.",
      url: "https://www.elsevier.com/books/electrical-power-systems-technology/hambley/978-0-13-312458-1",
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
            min="0"
            step="any"
            placeholder="e.g. 480"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current">Current (A)</Label>
          <Input
            id="current"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
            value={inputs.current}
            onChange={(e) => handleInputChange("current", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="powerFactor">Power Factor (0 to 1)</Label>
          <Input
            id="powerFactor"
            type="number"
            min="0"
            max="1"
            step="any"
            placeholder="e.g. 0.9"
            value={inputs.powerFactor}
            onChange={(e) => handleInputChange("powerFactor", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Result</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p className="mt-3 text-sm font-semibold text-amber-900 dark:text-amber-400">{results.feedback}</p>
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
            Enter the line-to-line voltage of your 3-phase system in volts (V). This is the voltage measured between any two of the three phase conductors.
          </li>
          <li>
            Enter the current flowing through one line conductor in amperes (A). This is typically measured with a clamp meter or specified by equipment ratings.
          </li>
          <li>
            Enter the power factor of the load, which is a decimal value between 0 and 1. This represents the phase difference between voltage and current and affects real power consumption.
          </li>
          <li>
            Click the "Calculate" button to compute the real power (in watts), apparent power (in volt-amperes), and reactive power (in volt-amperes reactive).
          </li>
          <li>
            Review the results and any safety or efficiency feedback provided to ensure your system is operating optimally.
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
            Three-phase power systems are widely used in industrial and commercial electrical installations due to their efficiency and ability to deliver constant power. Calculating power in these systems requires understanding the relationships between voltage, current, and power factor.
          </p>
          <p>
            The apparent power (S) represents the total power flowing in the circuit, combining both real and reactive components. Real power (P) is the portion that performs useful work, while reactive power (Q) oscillates between the source and reactive components like inductors and capacitors.
          </p>
          <p>
            This calculator uses the standard formula: P = √3 × V × I × PF, where V is the line-to-line voltage, I is the line current, and PF is the power factor. It also calculates apparent and reactive power to provide a complete picture of the electrical load.
          </p>
          <p>
            Accurate power calculations help in selecting appropriate equipment, sizing conductors, and ensuring compliance with electrical codes such as the NEC. Always verify your inputs and consult with a licensed electrical engineer for complex or critical applications.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Electricity is inherently dangerous. Always ensure power is disconnected before working on electrical circuits. Use proper personal protective equipment and follow local electrical codes.
          </p>
          <p>
            Common mistakes include entering incorrect voltage or current values, neglecting power factor, and assuming balanced loads when the system is unbalanced. These errors can lead to inaccurate power calculations, equipment damage, or unsafe conditions.
          </p>
          <p>
            Always double-check your inputs and understand the system configuration. If unsure, consult a qualified electrical engineer or electrician to verify calculations and system safety.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol className="list-decimal pl-5 space-y-3">
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
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="references">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-5 h-5 text-blue-500" />
          References & additional resources
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
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