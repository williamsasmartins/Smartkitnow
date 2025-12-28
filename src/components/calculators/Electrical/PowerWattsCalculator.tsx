import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  AlertTriangle,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PowerWattsCalculator() {
  const [inputs, setInputs] = useState({
    voltage: "",
    current: "",
    powerFactor: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const V = parseFloat(inputs.voltage);
    const I = parseFloat(inputs.current);
    let PF = inputs.powerFactor === "" ? 1 : parseFloat(inputs.powerFactor);

    if (
      isNaN(V) ||
      isNaN(I) ||
      isNaN(PF) ||
      V <= 0 ||
      I <= 0 ||
      PF <= 0 ||
      PF > 1
    ) {
      return {
        primary: "—",
        secondary: "Watts",
        details:
          "Please enter valid positive numbers. Power Factor must be between 0 and 1.",
        feedback: "Invalid input",
      };
    }

    // Calculate Power (Watts) = Voltage (V) × Current (I) × Power Factor (PF)
    const power = V * I * PF;

    return {
      primary: power.toFixed(2),
      secondary: "Watts",
      details: `Calculated using P = V × I × PF with V=${V}V, I=${I}A, PF=${PF}`,
      feedback: "Calculation successful",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Power Factor and why is it important?",
      answer:
        "Power Factor (PF) is the ratio of real power flowing to the load to the apparent power in the circuit. It ranges from 0 to 1 and indicates how effectively electrical power is being used. A PF of 1 means all the power is effectively used, while lower values indicate inefficiencies. Understanding PF helps in designing efficient electrical systems and reducing energy costs.",
    },
    {
      question: "Can I calculate power without knowing the power factor?",
      answer:
        "Yes, if the load is purely resistive (like incandescent bulbs or heaters), the power factor is 1, and you can calculate power simply by multiplying voltage and current. However, for inductive or capacitive loads (motors, transformers), power factor is less than 1 and must be considered for accurate power calculation.",
    },
    {
      question: "Why is it important to enter correct units?",
      answer:
        "Entering correct units ensures accurate calculations. Voltage should be in volts (V), current in amperes (A), and power factor as a decimal between 0 and 1. Using incorrect units or values can lead to wrong power estimations, which may cause improper equipment sizing or safety hazards.",
    },
    {
      question: "What happens if power factor is greater than 1 or less than 0?",
      answer:
        "Power factor values outside the range 0 to 1 are physically impossible and indicate incorrect input. Values greater than 1 or less than 0 will result in invalid calculations and should be corrected to ensure meaningful results.",
    },
    {
      question: "How does this calculator help in real-world electrical design?",
      answer:
        "This calculator helps engineers and electricians quickly estimate the real power consumption of electrical devices or circuits by considering voltage, current, and power factor. This aids in proper equipment sizing, energy management, and ensuring compliance with electrical standards.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the power consumption of an industrial motor operating at 230 volts, drawing 10 amperes with a power factor of 0.85.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the voltage supply: 230 volts (V).",
      },
      {
        label: "Step 2",
        explanation:
          "Measure or obtain the current drawn by the motor: 10 amperes (A).",
      },
      {
        label: "Step 3",
        explanation:
          "Determine the power factor of the motor, typically from the motor's datasheet or measurement: 0.85.",
      },
      {
        label: "Step 4",
        explanation:
          "Use the formula P = V × I × PF to calculate power: 230 × 10 × 0.85 = 1955 Watts.",
      },
    ],
    result:
      "The motor consumes approximately 1955 Watts (or 1.955 kW) of real power under these operating conditions.",
  };

  const references = [
    {
      title: "National Electrical Code (NEC)",
      description:
        "The NEC provides guidelines and standards for electrical installations, including power calculations and safety requirements.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "IEEE Power and Energy Society",
      description:
        "Resources and publications on power systems, power factor correction, and electrical engineering best practices.",
      url: "https://www.ieee-pes.org/",
    },
    {
      title: "Electrical Power Systems by C.L. Wadhwa",
      description:
        "A comprehensive textbook covering fundamentals of electrical power systems including power calculations and power factor concepts.",
      url: "https://www.amazon.com/Electrical-Power-Systems-C-L-Wadhwa/dp/8120345039",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voltage">Voltage (Volts, V)</Label>
          <Input
            id="voltage"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 230"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current">Current (Amperes, A)</Label>
          <Input
            id="current"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 10"
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
            placeholder="Default 1"
            value={inputs.powerFactor}
            onChange={(e) => handleInputChange("powerFactor", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" disabled={
        !inputs.voltage || !inputs.current || (inputs.powerFactor !== "" && (parseFloat(inputs.powerFactor) < 0 || parseFloat(inputs.powerFactor) > 1))
      }>
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
            Enter the voltage of your electrical system in volts (V). This is
            typically the supply voltage.
          </li>
          <li>
            Enter the current drawn by the load in amperes (A). This can be
            measured or obtained from equipment specifications.
          </li>
          <li>
            Enter the power factor (PF) of the load as a decimal between 0 and
            1. If unknown, leave it blank or enter 1 for purely resistive loads.
          </li>
          <li>
            Click the "Calculate" button to compute the real power consumption
            in watts (W).
          </li>
          <li>
            Review the result and use it for equipment sizing, energy
            management, or further electrical design.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Power (Watts) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Power in electrical circuits is the rate at which electrical energy
            is transferred by an electric circuit. The unit of power is the
            watt (W). Real power (also called active power) is the actual power
            consumed by the electrical devices to perform work.
          </p>
          <p>
            The fundamental formula to calculate real power in an AC circuit is:
          </p>
          <p className="font-semibold text-center text-lg">
            P (Watts) = V (Volts) × I (Amperes) × PF (Power Factor)
          </p>
          <p>
            Where voltage (V) is the potential difference, current (I) is the
            flow of electric charge, and power factor (PF) accounts for the
            phase difference between voltage and current in AC circuits.
          </p>
          <p>
            Power factor is a dimensionless number between 0 and 1 that
            represents how effectively the current is being converted into
            useful work output. A power factor of 1 means all the current is
            doing useful work, while lower values indicate inefficiencies due to
            reactive components like inductors or capacitors.
          </p>
          <p>
            This calculator helps you quickly determine the real power consumed
            by a device or circuit, which is essential for proper electrical
            design, energy management, and ensuring compliance with safety
            standards.
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
            <strong>Warning:</strong> Always ensure that the voltage and current
            inputs are measured accurately and correspond to the same circuit.
            Incorrect measurements can lead to wrong power calculations and
            unsafe electrical designs.
          </p>
          <p>
            Do not ignore the power factor in AC circuits with inductive or
            capacitive loads. Assuming a power factor of 1 when it is lower can
            underestimate the actual power consumption and cause equipment
            undersizing.
          </p>
          <p>
            Never input power factor values outside the range 0 to 1. Values
            greater than 1 or less than 0 are invalid and will produce
            incorrect results.
          </p>
          <p>
            When working with high voltages or currents, always follow proper
            safety protocols and use appropriate measuring instruments rated
            for the application.
          </p>
          <p>
            If unsure about any values or calculations, consult a licensed
            electrical engineer or professional.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {example.title}
        </h2>
        <p className="mb-4 text-slate-700 dark:text-slate-300">{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          {example.steps.map((step, i) => (
            <li key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">
          Result: {example.result}
        </p>
      </section>

      <section id="faq" className="scroll-mt-24">
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

      <section id="references" className="scroll-mt-24">
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
      title="Power (Watts) Calculator"
      description="Professional electrical calculator: Power (Watts) Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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