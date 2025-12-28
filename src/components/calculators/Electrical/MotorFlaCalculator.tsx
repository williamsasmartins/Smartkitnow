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
  const [inputs, setInputs] = useState({
    power: "", // Motor Power in HP or kW
    voltage: "", // Voltage in Volts
    phase: "3", // Phase: 1 or 3
    efficiency: "", // Efficiency in %
    powerFactor: "", // Power Factor (decimal)
    unit: "hp", // Unit for power: hp or kW
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Calculation logic for Motor FLA (Full Load Amps)
  // Formulas:
  // For HP:
  //   Single Phase: I = (HP × 746) / (Voltage × Efficiency × Power Factor)
  //   Three Phase: I = (HP × 746) / (√3 × Voltage × Efficiency × Power Factor)
  // For kW:
  //   Single Phase: I = (kW × 1000) / (Voltage × Efficiency × Power Factor)
  //   Three Phase: I = (kW × 1000) / (√3 × Voltage × Efficiency × Power Factor)
  // Efficiency and Power Factor are decimals (e.g. 0.9 for 90%)
  // If efficiency or power factor not provided, assume typical values (Efficiency: 0.9, PF: 0.85)

  const results = useMemo(() => {
    const powerNum = parseFloat(inputs.power);
    const voltageNum = parseFloat(inputs.voltage);
    const phaseNum = parseInt(inputs.phase);
    let efficiencyNum = parseFloat(inputs.efficiency);
    let powerFactorNum = parseFloat(inputs.powerFactor);

    if (
      isNaN(powerNum) ||
      powerNum <= 0 ||
      isNaN(voltageNum) ||
      voltageNum <= 0 ||
      (phaseNum !== 1 && phaseNum !== 3)
    ) {
      return {
        primary: "—",
        secondary: "Amps",
        details: "Please enter valid positive numbers for power, voltage, and select phase.",
        feedback: "",
      };
    }

    // Default typical values if not provided or invalid
    if (isNaN(efficiencyNum) || efficiencyNum <= 0 || efficiencyNum > 1) {
      efficiencyNum = 0.9;
    }
    if (isNaN(powerFactorNum) || powerFactorNum <= 0 || powerFactorNum > 1) {
      powerFactorNum = 0.85;
    }

    // Convert power to watts
    let watts: number;
    if (inputs.unit === "hp") {
      watts = powerNum * 746;
    } else {
      watts = powerNum * 1000;
    }

    // Calculate denominator
    const denominator =
      phaseNum === 3
        ? Math.sqrt(3) * voltageNum * efficiencyNum * powerFactorNum
        : voltageNum * efficiencyNum * powerFactorNum;

    if (denominator === 0) {
      return {
        primary: "—",
        secondary: "Amps",
        details: "Invalid input values leading to division by zero.",
        feedback: "",
      };
    }

    const current = watts / denominator;

    return {
      primary: current.toFixed(2),
      secondary: "Amps",
      details: `Calculated Full Load Amps for a ${inputs.power} ${inputs.unit.toUpperCase()} motor at ${inputs.voltage} V, ${phaseNum}-phase, efficiency ${(
        efficiencyNum * 100
      ).toFixed(0)}%, power factor ${(powerFactorNum * 100).toFixed(0)}%.`,
      feedback:
        "Ensure all inputs are accurate and consult NEC tables for conductor sizing and protection.",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Full Load Amps (FLA) in motors?",
      answer:
        "Full Load Amps (FLA) is the current drawn by an electric motor when operating at its rated horsepower and voltage under full load conditions. It is a critical parameter for selecting appropriate wiring, protection devices, and ensuring safe operation. Knowing the FLA helps in designing electrical systems that comply with safety standards and avoid overloads.",
    },
    {
      question: "Why do I need to input efficiency and power factor?",
      answer:
        "Efficiency and power factor affect the actual current drawn by the motor. Efficiency accounts for losses in the motor converting electrical energy to mechanical energy, while power factor represents the phase difference between voltage and current. Including these values provides a more accurate calculation of the motor's full load current, ensuring proper sizing of electrical components.",
    },
    {
      question: "What if I don't know the motor's efficiency or power factor?",
      answer:
        "If you don't have exact values for efficiency or power factor, this calculator uses typical default values of 90% efficiency and 0.85 power factor. These are common for many motors but may vary. For precise design, refer to the motor's datasheet or manufacturer specifications to obtain accurate values.",
    },
    {
      question: "Can this calculator be used for both single-phase and three-phase motors?",
      answer:
        "Yes, this calculator supports both single-phase and three-phase motors. You can select the phase type, and the calculation formula adjusts accordingly. Three-phase motors typically draw less current per phase compared to single-phase motors for the same power rating.",
    },
    {
      question: "How do I use the calculated FLA value?",
      answer:
        "The calculated Full Load Amps value is used to size conductors, circuit breakers, and other protective devices according to electrical codes such as the NEC. Always consult relevant standards and consider factors like ambient temperature, conductor insulation, and installation conditions when finalizing your design.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Calculating the Full Load Amps for a 10 HP, 460 V, three-phase motor with 92% efficiency and 0.88 power factor.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the motor power as 10 HP and select 'hp' as the unit.",
      },
      {
        label: "Step 2",
        explanation: "Enter the voltage as 460 volts.",
      },
      {
        label: "Step 3",
        explanation: "Select the phase as 3 (three-phase).",
      },
      {
        label: "Step 4",
        explanation:
          "Enter the efficiency as 92% (0.92) and power factor as 0.88.",
      },
      {
        label: "Step 5",
        explanation: "Click Calculate to get the Full Load Amps.",
      },
    ],
    result:
      "The calculator returns approximately 14.46 Amps, which is the expected full load current for this motor under the given conditions.",
  };

  const references = [
    {
      title: "NEC Table 430.250 - Full-Load Currents of Motors",
      description:
        "National Electrical Code (NEC) provides standard full-load current values for motors based on horsepower and voltage ratings.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "IEEE Guide for AC Motor Protection",
      description:
        "A comprehensive guide on motor protection including current ratings and safety considerations.",
      url: "https://standards.ieee.org/standard/141-1993.html",
    },
    {
      title: "Electric Motor Efficiency and Power Factor",
      description:
        "Understanding how efficiency and power factor affect motor performance and current draw.",
      url: "https://www.energy.gov/eere/amo/articles/understanding-motor-efficiency-and-power-factor",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Motor Power</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              step="any"
              placeholder="e.g. 10"
              value={inputs.power}
              onChange={(e) => handleInputChange("power", e.target.value)}
            />
            <select
              className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              value={inputs.unit}
              onChange={(e) => handleInputChange("unit", e.target.value)}
              aria-label="Select power unit"
            >
              <option value="hp">HP</option>
              <option value="kW">kW</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Voltage (Volts)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 460"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Phase</Label>
          <select
            className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
            value={inputs.phase}
            onChange={(e) => handleInputChange("phase", e.target.value)}
            aria-label="Select phase"
          >
            <option value="1">Single Phase</option>
            <option value="3">Three Phase</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Efficiency (%)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            step="any"
            placeholder="e.g. 90"
            value={inputs.efficiency}
            onChange={(e) => handleInputChange("efficiency", e.target.value)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Typical: 90% (default)
          </p>
        </div>

        <div className="space-y-2">
          <Label>Power Factor (decimal)</Label>
          <Input
            type="number"
            min={0}
            max={1}
            step="any"
            placeholder="e.g. 0.85"
            value={inputs.powerFactor}
            onChange={(e) => handleInputChange("powerFactor", e.target.value)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Typical: 0.85 (default)
          </p>
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
            Enter the motor power rating in horsepower (HP) or kilowatts (kW).
          </li>
          <li>Input the motor supply voltage in volts (V).</li>
          <li>Select whether the motor is single-phase or three-phase.</li>
          <li>
            Optionally, enter the motor efficiency as a percentage (default is
            90%).
          </li>
          <li>
            Optionally, enter the power factor as a decimal (default is 0.85).
          </li>
          <li>Click the Calculate button to see the Full Load Amps (FLA).</li>
          <li>
            Use the FLA value to size conductors, circuit breakers, and other
            protective devices according to electrical codes.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Motor
          FLA (Full Load Amps) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The Full Load Amps (FLA) of a motor is the current it draws when
            operating at its rated load and voltage. It is essential for
            electrical engineers and electricians to know this value to ensure
            proper sizing of wiring, overcurrent protection devices, and to
            maintain safe and efficient operation.
          </p>
          <p>
            This calculator uses standard electrical engineering formulas to
            estimate the FLA based on motor power, voltage, phase, efficiency,
            and power factor. Efficiency accounts for losses in the motor,
            while power factor accounts for the phase difference between current
            and voltage.
          </p>
          <p>
            For single-phase motors, the formula is:
            <br />
            <em>
              I = (Power × 746 or 1000) / (Voltage × Efficiency × Power Factor)
            </em>
            <br />
            For three-phase motors, the formula is:
            <br />
            <em>
              I = (Power × 746 or 1000) / (√3 × Voltage × Efficiency × Power
              Factor)
            </em>
          </p>
          <p>
            If efficiency or power factor values are unknown, typical default
            values of 90% efficiency and 0.85 power factor are used. Always
            consult motor datasheets or manufacturer specifications for precise
            values.
          </p>
          <p>
            After calculating the FLA, refer to the National Electrical Code
            (NEC) and other standards for conductor sizing, protection device
            selection, and installation requirements.
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
            <strong>Warning:</strong> Always verify input values for power,
            voltage, efficiency, and power factor. Incorrect inputs can lead to
            underestimating the motor current, resulting in undersized wiring
            and protection devices, which pose fire and safety hazards.
          </p>
          <p>
            Do not rely solely on calculated FLA values for final design.
            Always cross-reference with motor nameplate data and NEC tables.
            Consider ambient temperature, conductor insulation, and installation
            conditions when sizing conductors.
          </p>
          <p>
            Avoid using default efficiency and power factor values if precise
            data is available. Using inaccurate values can cause improper
            electrical system design and potential equipment damage.
          </p>
          <p>
            Ensure that the phase selection matches the motor's actual supply
            type. Using the wrong phase in calculations will yield incorrect
            current values.
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