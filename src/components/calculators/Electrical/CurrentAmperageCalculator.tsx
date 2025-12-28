import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  BookOpen,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CurrentAmperageCalculator() {
  /**
   * This calculator computes electrical current (amperage) using the formula:
   * I = P / V
   * where:
   * I = Current (Amperage) in Amps (A)
   * P = Power in Watts (W)
   * V = Voltage in Volts (V)
   *
   * User inputs Power (Watts) and Voltage (Volts).
   */

  const [inputs, setInputs] = useState({
    power: "", // Watts
    voltage: "", // Volts
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const power = parseFloat(inputs.power);
    const voltage = parseFloat(inputs.voltage);

    if (isNaN(power) || power <= 0) {
      return {
        primary: "-",
        secondary: "Amps (A)",
        details: "Please enter a valid power value greater than zero.",
        feedback: "",
      };
    }
    if (isNaN(voltage) || voltage <= 0) {
      return {
        primary: "-",
        secondary: "Amps (A)",
        details: "Please enter a valid voltage value greater than zero.",
        feedback: "",
      };
    }

    // Calculate current I = P / V
    const current = power / voltage;

    // Safety feedback
    let feedback = "";
    if (current > 100) {
      feedback =
        "Warning: Calculated current exceeds 100A, ensure wiring and breakers are rated accordingly.";
    } else if (current < 0.1) {
      feedback =
        "Note: Calculated current is very low; verify input values for accuracy.";
    }

    return {
      primary: current.toFixed(2),
      secondary: "Amps (A)",
      details: `Calculated current based on Power = ${power} W and Voltage = ${voltage} V.`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is electrical current (amperage)?",
      answer:
        "Electrical current, measured in amperes (amps), is the flow of electric charge through a conductor. It indicates how much electricity is flowing in a circuit at any given time. Understanding amperage is crucial for selecting the right wire size and circuit protection devices to ensure safety and efficiency.",
    },
    {
      question: "Why do I need to know the current in a circuit?",
      answer:
        "Knowing the current helps you determine the appropriate wire gauge and circuit breaker size to prevent overheating and potential fire hazards. It also ensures that electrical devices operate safely within their designed electrical limits, avoiding damage or failure.",
    },
    {
      question: "Can I use this calculator for AC and DC circuits?",
      answer:
        "Yes, this calculator provides a general calculation of current based on power and voltage, which applies to both AC and DC circuits. However, for AC circuits, especially those with reactive loads, additional factors like power factor should be considered for precise calculations.",
    },
    {
      question: "What if I only know the resistance of the load?",
      answer:
        "If you know the resistance (R) and voltage (V), you can calculate current using Ohm's Law: I = V / R. This calculator focuses on power and voltage inputs, but you can use Ohm's Law separately if resistance is known.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "This calculator provides a theoretical current value based on input power and voltage. Real-world factors such as power factor, efficiency, and load type can affect actual current. Always consult electrical codes and professionals for critical applications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You want to find out the current drawn by a 1500-watt electric heater operating on a 120-volt supply.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the power rating of the heater: 1500 watts (W).",
      },
      {
        label: "Step 2",
        explanation:
          "Identify the voltage supply: 120 volts (V).",
      },
      {
        label: "Step 3",
        explanation:
          "Use the formula I = P / V to calculate current.",
      },
      {
        label: "Step 4",
        explanation:
          "Calculate: I = 1500 W / 120 V = 12.5 Amps.",
      },
    ],
    result:
      "The heater draws 12.5 amps of current from the 120V supply.",
  };

  const references = [
    {
      title: "National Electrical Code (NEC)",
      description:
        "The NEC provides guidelines and standards for electrical wiring and safety in the United States.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Ohm's Law and Power Formulas",
      description:
        "Basic electrical formulas used to calculate current, voltage, resistance, and power.",
      url: "https://www.electronics-tutorials.ws/dccircuits/dcp_2.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="power">Power (Watts, W)</Label>
          <Input
            id="power"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 1500"
            value={inputs.power}
            onChange={(e) => handleInputChange("power", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="voltage">Voltage (Volts, V)</Label>
          <Input
            id="voltage"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 120"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {
          // No special action needed, calculation is reactive
        }}
      >
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
              <>
                <Separator className="my-4" />
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  {results.feedback}
                </p>
              </>
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
            Enter the power rating of your electrical device or load in watts
            (W). This value is often found on the device label or manual.
          </li>
          <li>
            Enter the voltage supply in volts (V) that powers the device. Common
            voltages are 120V or 240V depending on your region and application.
          </li>
          <li>
            Click the "Calculate" button to compute the current (amperage) drawn
            by the device.
          </li>
          <li>
            Review the result displayed in amps (A). Use this information to
            select appropriate wiring and circuit protection.
          </li>
          <li>
            Always cross-check results with electrical codes and consult a
            professional electrician for critical or complex installations.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Current (Amperage) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electrical current, measured in amperes (amps), is a fundamental
            parameter in electrical engineering that represents the flow of
            electric charge through a conductor. Calculating current accurately
            is essential for designing safe and efficient electrical systems.
          </p>
          <p>
            The most common formula to calculate current when power and voltage
            are known is: <code>I = P / V</code>, where <code>I</code> is the
            current in amps, <code>P</code> is power in watts, and <code>V</code>{" "}
            is voltage in volts.
          </p>
          <p>
            This calculator uses this formula to provide quick and reliable
            current calculations for general electrical applications. It is
            suitable for both AC and DC circuits, although for AC circuits with
            reactive loads, additional considerations like power factor may be
            necessary.
          </p>
          <p>
            Always ensure that the calculated current does not exceed the ratings
            of your wiring, circuit breakers, and other electrical components to
            maintain safety and compliance with electrical codes such as the NEC.
          </p>
        </div>
      </section>

      {/* FIXED CSS FOR READABILITY */}
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
            <strong>Warning:</strong> Never rely solely on calculated current
            values without considering the full electrical context. Always
            verify wire sizes, breaker ratings, and device specifications to
            prevent overheating and fire hazards.
          </p>
          <p>
            A common mistake is to ignore the power factor in AC circuits, which
            can cause the actual current to be higher than calculated. For loads
            like motors or fluorescent lighting, consult detailed electrical
            data.
          </p>
          <p>
            Avoid using this calculator for high-frequency or complex loads
            without professional advice. Incorrect current estimation can lead
            to equipment damage or safety risks.
          </p>
          <p>
            Always follow local electrical codes and standards, and when in
            doubt, consult a licensed electrician.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Real World Example
        </h2>
        <article className="prose prose-slate dark:prose-invert">
          <p>{example.scenario}</p>
          <ol>
            {example.steps.map((step, i) => (
              <li key={i}>
                <strong>{step.label}:</strong> {step.explanation}
              </li>
            ))}
          </ol>
          <p>
            <strong>Result:</strong> {example.result}
          </p>
        </article>
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
      title="Current (Amperage) Calculator"
      description="Professional electrical calculator: Current (Amperage) Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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