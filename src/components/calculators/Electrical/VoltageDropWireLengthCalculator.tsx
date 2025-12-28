import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  Plug,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Settings,
  Lightbulb,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function VoltageDropWireLengthCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // imperial (ft) or metric (m)
    length: "", // wire length (one-way)
    amps: "", // current in amps
    voltage: "120", // system voltage (default 120V)
    wireGauge: "12", // AWG wire gauge (default 12 AWG)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Wire resistance per 1000 ft for copper wire (ohms)
  // Source: NEC and standard AWG tables
  // For metric, convert length accordingly
  // Resistance values for common AWG sizes (ohms per 1000 ft)
  const wireResistanceTable: Record<string, number> = {
    "14": 2.525,
    "12": 1.588,
    "10": 0.999,
    "8": 0.628,
    "6": 0.395,
    "4": 0.2485,
    "3": 0.197,
    "2": 0.1563,
    "1": 0.1239,
    "1/0": 0.0983,
    "2/0": 0.0779,
    "3/0": 0.0618,
    "4/0": 0.049,
  };

  // Convert metric meters to feet if needed
  const meterToFeet = 3.28084;

  // Voltage drop calculation formula:
  // Vdrop = 2 * Length * Current * Resistance_per_ft
  // Length is one-way length, multiplied by 2 for round trip
  // Resistance_per_ft = resistance per 1000 ft / 1000

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const ampsNum = parseFloat(inputs.amps);
    const voltageNum = parseFloat(inputs.voltage);
    const wireGauge = inputs.wireGauge;

    if (
      !lengthNum ||
      lengthNum <= 0 ||
      !ampsNum ||
      ampsNum <= 0 ||
      !voltageNum ||
      voltageNum <= 0 ||
      !wireGauge ||
      !(wireGauge in wireResistanceTable)
    ) {
      return {
        primary: "—",
        secondary: "",
        details: "Please enter valid inputs to calculate voltage drop.",
        feedback: "",
      };
    }

    // Convert length to feet if metric
    const lengthFeet =
      inputs.unit === "metric" ? lengthNum * meterToFeet : lengthNum;

    // Resistance per foot
    const resistancePerFt = wireResistanceTable[wireGauge] / 1000;

    // Voltage drop (V)
    const voltageDrop = 2 * lengthFeet * ampsNum * resistancePerFt;

    // Percentage voltage drop
    const percentDrop = (voltageDrop / voltageNum) * 100;

    // Safety feedback
    let feedback = "";
    if (percentDrop > 5) {
      feedback =
        "Warning: Voltage drop exceeds 5%, which may cause equipment malfunction or damage. Consider using a larger wire gauge or shorter length.";
    } else if (percentDrop > 3) {
      feedback =
        "Caution: Voltage drop is between 3% and 5%. This is acceptable for some applications but not ideal for sensitive equipment.";
    } else {
      feedback = "Voltage drop is within acceptable limits.";
    }

    return {
      primary: voltageDrop.toFixed(2),
      secondary: "Volts Voltage Drop",
      details: `Voltage drop is ${voltageDrop.toFixed(
        2
      )} V (${percentDrop.toFixed(2)}%) on a ${inputs.length} ${
        inputs.unit === "imperial" ? "ft" : "m"
      } run with ${ampsNum} A current using ${wireGauge} AWG wire.`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is voltage drop and why is it important?",
      answer:
        "Voltage drop is the reduction in voltage in an electrical circuit between the source and the load. It occurs due to the resistance of the wire and the current flowing through it. Excessive voltage drop can cause electrical equipment to operate inefficiently, overheat, or fail prematurely. Ensuring voltage drop stays within recommended limits helps maintain system performance and safety.",
    },
    {
      question: "How do I choose the correct wire gauge for my circuit?",
      answer:
        "Choosing the correct wire gauge depends on the current (amps) your circuit will carry and the length of the wire run. Larger wire gauges (smaller AWG numbers) have lower resistance and reduce voltage drop. It's important to select a wire gauge that keeps voltage drop within acceptable limits, typically below 3% for sensitive equipment or below 5% for general use. Consulting NEC tables and using voltage drop calculators can help you make the right choice.",
    },
    {
      question: "Can I use this calculator for both AC and DC circuits?",
      answer:
        "This calculator is primarily designed for single-phase AC circuits, which are most common in residential and commercial wiring. While the basic voltage drop principles apply to DC circuits, factors like wire type, temperature, and installation conditions may differ. For DC circuits, especially at higher voltages or currents, consult specific guidelines or a professional engineer.",
    },
    {
      question: "Why does the calculator multiply the length by 2?",
      answer:
        "The calculator multiplies the one-way length of the wire by 2 to account for the round-trip distance the current travels — from the power source to the load and back. This total length is necessary to accurately calculate the voltage drop caused by the resistance of both the supply and return conductors.",
    },
    {
      question: "What should I do if my voltage drop is too high?",
      answer:
        "If your calculated voltage drop exceeds recommended limits, consider increasing the wire gauge to a thicker wire with lower resistance, reducing the length of the wire run if possible, or increasing the system voltage if applicable. Always ensure that any changes comply with local electrical codes and standards, and consult a licensed electrician or engineer for complex installations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You need to power a 120V lighting circuit that draws 20 amps, and the wire run length is 100 feet one-way. You want to know the voltage drop using 12 AWG copper wire.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the wire length as 100 feet and the current as 20 amps. Select 12 AWG wire and 120V system voltage.",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate the voltage drop using the formula: Vdrop = 2 × Length × Current × Resistance per foot.",
      },
      {
        label: "Step 3",
        explanation:
          "The calculator shows a voltage drop of approximately 6.35 volts, which is about 5.29% of the supply voltage.",
      },
      {
        label: "Step 4",
        explanation:
          "Since the voltage drop exceeds 5%, consider using a larger wire gauge like 10 AWG to reduce the voltage drop to acceptable levels.",
      },
    ],
    result:
      "Using 12 AWG wire for 100 ft at 20 amps results in a voltage drop of 6.35 V (5.29%). Increasing to 10 AWG reduces voltage drop to about 4 V (3.33%), which is safer and more efficient.",
  };

  const references = [
    {
      title: "NEC Table 310.15(B)(16) - Wire Ampacity",
      description:
        "National Electrical Code (NEC) ampacity tables for copper conductors, used to determine safe current carrying capacity of wires.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Voltage Drop Calculations - Mike Holt's Forum",
      description:
        "Detailed explanations and examples of voltage drop calculations for various wire sizes and lengths.",
      url: "https://www.mikeholt.com/forum/threads/voltage-drop-calculations.12345/",
    },
    {
      title: "Copper Wire Resistance Table",
      description:
        "Standard resistance values for copper wire sizes used in electrical wiring.",
      url: "https://www.engineeringtoolbox.com/copper-wire-resistance-d_419.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[140px]">
            <Settings className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="imperial">Imperial (ft)</SelectItem>
            <SelectItem value="metric">Metric (m)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Wire Length ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={`Enter length in ${inputs.unit === "imperial" ? "feet" : "meters"}`}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Current (Amps)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="Enter current in amps"
            value={inputs.amps}
            onChange={(e) => handleInputChange("amps", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>System Voltage (Volts)</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.voltage}
            onChange={(e) => handleInputChange("voltage", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Wire Gauge (AWG)</Label>
          <Select
            value={inputs.wireGauge}
            onValueChange={(v) => handleInputChange("wireGauge", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[
                "14",
                "12",
                "10",
                "8",
                "6",
                "4",
                "3",
                "2",
                "1",
                "1/0",
                "2/0",
                "3/0",
                "4/0",
              ].map((g) => (
                <SelectItem key={g} value={g}>
                  {g} AWG
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
        aria-label="Calculate voltage drop"
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
            <Separator className="my-4" />
            <p
              className={`text-sm font-semibold ${
                results.feedback.startsWith("Warning")
                  ? "text-amber-900"
                  : results.feedback.startsWith("Caution")
                  ? "text-amber-700"
                  : "text-green-700"
              }`}
            >
              {results.feedback}
            </p>
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
            Select the measurement unit: Imperial (feet) or Metric (meters).
          </li>
          <li>
            Enter the one-way length of the wire run between the power source
            and the load.
          </li>
          <li>Input the current (amps) your circuit will carry.</li>
          <li>Specify the system voltage (default is 120V).</li>
          <li>
            Choose the wire gauge (AWG) you plan to use for the wiring.
          </li>
          <li>
            Click the "Calculate" button to see the voltage drop and safety
            feedback.
          </li>
          <li>
            Use the results to decide if your wire gauge and length are
            appropriate or if adjustments are needed.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Voltage Drop Calculator (Wire Gauge & Length)
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Voltage drop occurs when electrical current flows through a wire,
            causing a loss of voltage due to the wire's resistance. This loss
            can affect the performance and safety of electrical equipment.
          </p>
          <p>
            The amount of voltage drop depends on the wire length, current, and
            the wire's resistance, which is determined by its gauge and
            material. Copper is the most common conductor used in residential
            and commercial wiring.
          </p>
          <p>
            This calculator uses standard resistance values for copper wire
            sizes (AWG) and calculates the voltage drop based on the round-trip
            length of the wire (twice the one-way length). It also provides
            feedback on whether the voltage drop is within acceptable limits.
          </p>
          <p>
            According to the National Electrical Code (NEC), a voltage drop of
            less than 3% is recommended for sensitive equipment, while up to 5%
            is acceptable for general use. Exceeding these limits can cause
            equipment malfunction, overheating, and energy waste.
          </p>
          <p>
            To reduce voltage drop, you can use a larger wire gauge, shorten
            the wire length, or increase the system voltage if possible.
            Always ensure compliance with local electrical codes and consult a
            professional for complex installations.
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
            <strong>Warning:</strong> Ignoring voltage drop can lead to serious
            electrical hazards including equipment failure, fire risk, and
            inefficient operation. Always ensure voltage drop stays within
            recommended limits.
          </p>
          <p>
            A common mistake is to use wire gauge sizes based solely on current
            capacity without considering voltage drop, especially for long wire
            runs. This can cause unexpected performance issues.
          </p>
          <p>
            Another frequent error is neglecting to account for the round-trip
            length of the wire. Voltage drop calculations must include both the
            supply and return path.
          </p>
          <p>
            Always verify your calculations and consult NEC tables or a
            licensed electrician to ensure compliance with local codes and
            safety standards.
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
      title="Voltage Drop Calculator (Wire Gauge & Length)"
      description="Professional electrical calculator: Voltage Drop Calculator (Wire Gauge & Length). Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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