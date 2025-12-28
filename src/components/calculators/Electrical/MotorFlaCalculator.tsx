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

export default function MotorFlaCalculator() {
  /**
   * Inputs:
   * val1: Motor Horsepower (HP)
   * val2: Motor Voltage (V)
   * val3: Motor Efficiency (%) - optional, default 90%
   *
   * Formula for Full Load Amps (FLA) for 3-phase motors:
   * FLA = (HP * 746) / (√3 * Voltage * Power Factor * Efficiency)
   *
   * For simplicity, assume Power Factor = 0.85 (typical for induction motors)
   *
   * For single-phase motors:
   * FLA = (HP * 746) / (Voltage * Power Factor * Efficiency)
   *
   * We will ask user for phase type (1 or 3).
   */

  const [inputs, setInputs] = useState({
    horsepower: "",
    voltage: "",
    phase: "3",
    efficiency: "90",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants
  const POWER_FACTOR = 0.85;

  // Validate inputs and calculate FLA
  const results = useMemo(() => {
    const hp = parseFloat(inputs.horsepower);
    const voltage = parseFloat(inputs.voltage);
    const phase = inputs.phase === "3" ? 3 : 1;
    let efficiency = parseFloat(inputs.efficiency);

    if (isNaN(hp) || hp <= 0) {
      return {
        primary: "-",
        secondary: "Amps",
        details: "Please enter a valid motor horsepower greater than 0.",
        feedback: "",
      };
    }
    if (isNaN(voltage) || voltage <= 0) {
      return {
        primary: "-",
        secondary: "Amps",
        details: "Please enter a valid voltage greater than 0.",
        feedback: "",
      };
    }
    if (isNaN(efficiency) || efficiency <= 0 || efficiency > 100) {
      efficiency = 90; // default to 90%
    }

    // Convert efficiency percent to decimal
    efficiency = efficiency / 100;

    let fla = 0;
    if (phase === 3) {
      // 3-phase motor FLA calculation
      fla = (hp * 746) / (Math.sqrt(3) * voltage * POWER_FACTOR * efficiency);
    } else {
      // Single-phase motor FLA calculation
      fla = (hp * 746) / (voltage * POWER_FACTOR * efficiency);
    }

    fla = Math.round(fla * 100) / 100; // round to 2 decimals

    // Safety feedback
    let feedback = "";
    if (fla > 100) {
      feedback =
        "Warning: The calculated FLA is quite high. Ensure the wiring and protection devices are rated accordingly.";
    }

    return {
      primary: fla.toString(),
      secondary: "Amps",
      details: `Calculated Full Load Amps for a ${hp} HP, ${phase}-phase motor at ${voltage} V with ${(
        efficiency * 100
      ).toFixed(0)}% efficiency.`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Full Load Amps (FLA) and why is it important?",
      answer:
        "Full Load Amps (FLA) is the current drawn by an electric motor when operating at its rated horsepower and voltage under full load conditions. It is crucial for selecting the correct wire size, circuit breakers, and protective devices to ensure safe and efficient motor operation. Knowing the FLA helps prevent overheating, electrical faults, and ensures compliance with electrical codes such as the NEC.",
    },
    {
      question: "Why do we assume a power factor of 0.85 in calculations?",
      answer:
        "The power factor represents the phase difference between voltage and current in an AC circuit. For typical induction motors, the power factor at full load is approximately 0.85. This assumption simplifies calculations and provides a realistic estimate of current draw. However, actual power factor can vary based on motor design and load conditions, so for precise engineering, motor datasheets should be consulted.",
    },
    {
      question: "How does motor efficiency affect the FLA calculation?",
      answer:
        "Motor efficiency indicates how effectively electrical power is converted into mechanical power. Lower efficiency means more electrical power is required for the same mechanical output, resulting in higher current draw (FLA). Including efficiency in calculations ensures more accurate current estimates, which is essential for proper conductor sizing and protection device selection.",
    },
    {
      question: "Can this calculator be used for all motor types?",
      answer:
        "This calculator is designed primarily for standard AC induction motors, which are the most common. It assumes typical power factor and efficiency values. For specialized motors such as synchronous, DC, or variable frequency drive (VFD) motors, the current draw characteristics may differ, and specific manufacturer data should be used for accurate calculations.",
    },
    {
      question: "What safety precautions should I take when working with motor circuits?",
      answer:
        "Always ensure power is disconnected before working on motor circuits. Use appropriate personal protective equipment (PPE) and follow lockout/tagout procedures. Verify that conductors and protective devices are rated for the calculated FLA and any applicable code requirements. Improper wiring or undersized components can lead to overheating, fire hazards, or equipment damage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the Full Load Amps for a 10 HP, 3-phase motor running at 460 volts with 92% efficiency.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the motor horsepower as 10 HP into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Set the voltage to 460 V, which is a common industrial voltage.",
      },
      {
        label: "Step 3",
        explanation:
          "Select 3-phase as the motor type since most industrial motors are 3-phase.",
      },
      {
        label: "Step 4",
        explanation:
          "Enter the motor efficiency as 92%, reflecting a high-efficiency motor.",
      },
      {
        label: "Step 5",
        explanation:
          "Click Calculate to get the Full Load Amps, which will be approximately 13.6 Amps.",
      },
    ],
    result:
      "The motor draws about 13.6 Amps under full load conditions, guiding proper wire sizing and protection device selection.",
  };

  const references = [
    {
      title: "NEC Table 430.250",
      description:
        "Full-Load Currents of Motors Rated 1/4 to 200 hp, 230 and 460 Volts, 60 Hertz, 3-Phase.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "IEEE Std 141-1993 (Red Book)",
      description:
        "Recommended Practice for Electric Power Distribution for Industrial Plants.",
      url: "https://standards.ieee.org/standard/141-1993.html",
    },
    {
      title: "Motor Full Load Current Calculation - Engineering Toolbox",
      description:
        "Technical explanation and formulas for calculating motor full load current.",
      url: "https://www.engineeringtoolbox.com/electric-motor-currents-d_654.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="horsepower">Motor Horsepower (HP)</Label>
          <Input
            id="horsepower"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 10"
            value={inputs.horsepower}
            onChange={(e) => handleInputChange("horsepower", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="voltage">Motor Voltage (V)</Label>
          <Input
            id="voltage"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 460"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phase">Motor Phase</Label>
          <select
            id="phase"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            value={inputs.phase}
            onChange={(e) => handleInputChange("phase", e.target.value)}
          >
            <option value="3">3-Phase</option>
            <option value="1">Single-Phase</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="efficiency">Motor Efficiency (%)</Label>
          <Input
            id="efficiency"
            type="number"
            min="1"
            max="100"
            step="any"
            placeholder="Default 90%"
            value={inputs.efficiency}
            onChange={(e) => handleInputChange("efficiency", e.target.value)}
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
              <>
                <Separator className="my-4" />
                <p className="text-sm text-amber-900 dark:text-amber-100 font-semibold">
                  ⚠️ {results.feedback}
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
            Enter the motor horsepower (HP) rating as specified on the motor
            nameplate.
          </li>
          <li>
            Input the motor voltage (V) at which the motor operates, commonly
            230, 460, or 575 volts.
          </li>
          <li>
            Select the motor phase type: single-phase or three-phase.
          </li>
          <li>
            Optionally, enter the motor efficiency percentage. If unknown, leave
            the default 90%.
          </li>
          <li>
            Click the Calculate button to compute the Full Load Amps (FLA).
          </li>
          <li>
            Use the calculated FLA to select appropriate wire sizes, circuit
            breakers, and protective devices according to NEC guidelines.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Motor FLA (Full Load Amps) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Full Load Amps (FLA) of a motor is the current it draws when
            operating at its rated horsepower and voltage under full load
            conditions. It is a critical parameter for electrical engineers and
            electricians to ensure that wiring, circuit breakers, and other
            protective devices are properly sized to prevent overheating and
            electrical hazards.
          </p>
          <p>
            This calculator uses the standard electrical engineering formula to
            estimate the FLA based on motor horsepower, voltage, phase type, and
            efficiency. The power factor is assumed to be 0.85, which is typical
            for most induction motors.
          </p>
          <p>
            For three-phase motors, the formula accounts for the square root of
            three (√3) in the denominator, reflecting the nature of three-phase
            power systems. Single-phase motors use a simplified formula without
            the √3 factor.
          </p>
          <p>
            Motor efficiency affects the current draw because less efficient
            motors require more electrical power to produce the same mechanical
            output. Including efficiency in the calculation improves accuracy.
          </p>
          <p>
            Always verify calculated values against motor nameplate data and
            consult the National Electrical Code (NEC) or local regulations for
            compliance and safety.
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
            <strong>Warning:</strong> Electricity is inherently dangerous and
            working with motor circuits requires strict adherence to safety
            protocols. Always de-energize circuits before working on them and
            use appropriate personal protective equipment (PPE).
          </p>
          <p>
            A common mistake is underestimating the motor's full load current,
            leading to undersized conductors or protective devices. This can
            cause overheating, insulation failure, and fire hazards.
          </p>
          <p>
            Another frequent error is neglecting to consider motor efficiency and
            power factor, which can result in inaccurate current calculations.
            Always use actual motor data when available.
          </p>
          <p>
            Ensure that all calculations comply with the latest edition of the
            National Electrical Code (NEC) and local electrical codes.
          </p>
          <p>
            When in doubt, consult a licensed electrical engineer or
            professional electrician.
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
      title="Motor FLA (Full Load Amps) Calculator"
      description="Professional electrical calculator: Motor FLA (Full Load Amps) Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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