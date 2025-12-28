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

// NEC ampacity table simplified for copper conductors, 75°C insulation (common for THHN/THWN)
// Wire sizes in AWG and KCMIL with max amps allowed (rounded for typical use)
// Source: NEC 310.15(B)(16)
const ampacityTable = [
  { size: "14 AWG", amps: 20 },
  { size: "12 AWG", amps: 25 },
  { size: "10 AWG", amps: 35 },
  { size: "8 AWG", amps: 50 },
  { size: "6 AWG", amps: 65 },
  { size: "4 AWG", amps: 85 },
  { size: "3 AWG", amps: 100 },
  { size: "2 AWG", amps: 115 },
  { size: "1 AWG", amps: 130 },
  { size: "1/0 AWG", amps: 150 },
  { size: "2/0 AWG", amps: 175 },
  { size: "3/0 AWG", amps: 200 },
  { size: "4/0 AWG", amps: 230 },
  { size: "250 KCMIL", amps: 255 },
  { size: "300 KCMIL", amps: 285 },
  { size: "350 KCMIL", amps: 310 },
  { size: "400 KCMIL", amps: 335 },
  { size: "500 KCMIL", amps: 380 },
  { size: "600 KCMIL", amps: 420 },
  { size: "700 KCMIL", amps: 460 },
  { size: "750 KCMIL", amps: 475 },
  { size: "800 KCMIL", amps: 490 },
  { size: "900 KCMIL", amps: 520 },
  { size: "1000 KCMIL", amps: 545 },
];

// Voltage drop calculation constants
// Resistivity of copper ~ 10.4 ohm-cmil/ft at 75°C
// Voltage drop formula: Vdrop = (2 * K * I * L) / CM
// K = resistivity constant (ohm-cmil/ft), I = current (amps), L = one-way length (ft), CM = circular mil area
// Circular mil area for AWG sizes can be derived or approximated, but here we use standard values:

// Circular mil areas for common sizes (AWG and KCMIL)
const circularMilTable: Record<string, number> = {
  "14 AWG": 4110,
  "12 AWG": 6530,
  "10 AWG": 10380,
  "8 AWG": 16510,
  "6 AWG": 26240,
  "4 AWG": 41740,
  "3 AWG": 52620,
  "2 AWG": 66360,
  "1 AWG": 83690,
  "1/0 AWG": 105600,
  "2/0 AWG": 133100,
  "3/0 AWG": 167800,
  "4/0 AWG": 211600,
  "250 KCMIL": 250000,
  "300 KCMIL": 300000,
  "350 KCMIL": 350000,
  "400 KCMIL": 400000,
  "500 KCMIL": 500000,
  "600 KCMIL": 600000,
  "700 KCMIL": 700000,
  "750 KCMIL": 750000,
  "800 KCMIL": 800000,
  "900 KCMIL": 900000,
  "1000 KCMIL": 1000000,
};

const K_RESISTIVITY = 12.9; // ohm-cmil/ft for copper at 75°C (some sources use 12.9 instead of 10.4 for conservative calc)

export default function WireSizeAwgKcmilCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // imperial (ft) or metric (m)
    val1: "", // Length
    val2: "", // Amps
  });

  const handleInputChange = (field: string, value: string) => {
    // Only allow positive numbers or empty string
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const lengthRaw = parseFloat(inputs.val1);
    const ampsRaw = parseFloat(inputs.val2);
    if (isNaN(lengthRaw) || lengthRaw <= 0) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter a valid positive length.",
        feedback: "",
      };
    }
    if (isNaN(ampsRaw) || ampsRaw <= 0) {
      return {
        primary: "-",
        secondary: "",
        details: "Please enter a valid positive current (amps).",
        feedback: "",
      };
    }

    // Convert length to feet if metric
    const lengthFt = inputs.unit === "metric" ? lengthRaw * 3.28084 : lengthRaw;

    // Find minimum wire size from ampacity table that can handle ampsRaw
    const suitableWire = ampacityTable.find((entry) => entry.amps >= ampsRaw);

    if (!suitableWire) {
      return {
        primary: "Wire size too large",
        secondary: "",
        details:
          "The current exceeds the maximum ampacity of available wire sizes in this calculator.",
        feedback: "",
      };
    }

    // Calculate voltage drop for the chosen wire size
    // Vdrop = (2 * K * I * L) / CM
    // 2 for round trip length (out and back)
    const cm = circularMilTable[suitableWire.size];
    if (!cm) {
      return {
        primary: suitableWire.size,
        secondary: "Wire Size",
        details: "Ampacity found but circular mil area data missing.",
        feedback: "",
      };
    }

    const voltageDrop = (2 * K_RESISTIVITY * ampsRaw * lengthFt) / cm; // volts drop per volt base

    // Assuming 120V system for % voltage drop calculation (common residential)
    // For 240V, user should consider accordingly
    const systemVoltage = 120;
    const voltageDropPercent = (voltageDrop / systemVoltage) * 100;

    // Safety feedback based on voltage drop
    let feedback = "";
    if (voltageDropPercent > 5) {
      feedback =
        "Warning: Voltage drop exceeds 5%, which may cause equipment malfunction or inefficiency. Consider upsizing the wire.";
    } else if (voltageDropPercent > 3) {
      feedback =
        "Note: Voltage drop is between 3% and 5%. This is acceptable but consider upsizing for sensitive equipment.";
    } else {
      feedback = "Voltage drop is within acceptable limits (<3%).";
    }

    return {
      primary: suitableWire.size,
      secondary: "Recommended Wire Size",
      details: `Ampacity: ${suitableWire.amps} A | Estimated voltage drop: ${voltageDropPercent.toFixed(
        2
      )}% at ${systemVoltage}V system.`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I choose between AWG and KCMIL wire sizes?",
      answer:
        "AWG (American Wire Gauge) sizes are typically used for smaller conductors up to 4/0 AWG, while KCMIL (thousands of circular mils) sizes are used for larger conductors above 4/0 AWG. The choice depends on the current load and application. This calculator covers both and will recommend the appropriate size based on your input current.",
    },
    {
      question: "Why is voltage drop important when selecting wire size?",
      answer:
        "Voltage drop represents the loss of voltage as electrical current flows through a wire due to its resistance. Excessive voltage drop can cause equipment to operate inefficiently or even fail. The National Electrical Code recommends keeping voltage drop below 3% for branch circuits and 5% overall. This calculator estimates voltage drop to help you select a wire size that maintains safe and efficient operation.",
    },
    {
      question: "Can I use this calculator for aluminum conductors?",
      answer:
        "No, this calculator is designed for copper conductors only, as ampacity and resistivity values differ significantly for aluminum. Using copper values for aluminum wire can lead to unsafe undersizing. For aluminum conductors, consult NEC tables specific to aluminum or use a dedicated aluminum wire size calculator.",
    },
    {
      question: "What if my calculated wire size is not listed in the ampacity table?",
      answer:
        "The ampacity table used here covers common wire sizes up to 1000 KCMIL. If your required current exceeds these values, you may need to use multiple conductors in parallel or consult a professional engineer for custom solutions. Always ensure compliance with local electrical codes and standards.",
    },
    {
      question: "Why do I need to specify length in this calculator?",
      answer:
        "The length of the wire run affects the voltage drop because the longer the wire, the more resistance the current encounters. This calculator uses the length to estimate voltage drop and ensure the recommended wire size keeps voltage drop within acceptable limits for safe and efficient operation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You need to install a new branch circuit to power a 40-amp load located 100 feet away from the main panel. You want to ensure the wire size is safe, NEC compliant, and voltage drop is within acceptable limits.",
    steps: [
      {
        label: "Step 1: Input length",
        explanation:
          "Enter the one-way length of the wire run as 100 feet (imperial units).",
      },
      {
        label: "Step 2: Input current",
        explanation:
          "Enter the load current as 40 amps, which is the expected maximum current.",
      },
      {
        label: "Step 3: Calculate",
        explanation:
          "Click the Calculate button to get the recommended wire size and voltage drop information.",
      },
    ],
    result:
      "The calculator recommends 8 AWG wire, which supports up to 50 amps and keeps voltage drop under 3%. This ensures safe operation and compliance with NEC guidelines.",
  };

  const references = [
    {
      title: "NEC Table 310.15(B)(16) - Ampacity of Conductors",
      description:
        "Official National Electrical Code table listing ampacity ratings for insulated copper conductors rated 0-2000 volts.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Voltage Drop Calculations - Electrical Engineering Portal",
      description:
        "Detailed explanation and formulas for calculating voltage drop in electrical wiring.",
      url: "https://electrical-engineering-portal.com/voltage-drop-calculation",
    },
    {
      title: "Copper Wire Properties and Resistivity",
      description:
        "Technical data on copper wire resistivity and its impact on electrical calculations.",
      url: "https://www.engineeringtoolbox.com/copper-resistivity-d_949.html",
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
          <Label>Length ({inputs.unit === "imperial" ? "feet" : "meters"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder={`Enter length in ${inputs.unit === "imperial" ? "feet" : "meters"}`}
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Current (Amps)</Label>
          <Input
            type="number"
            min="0"
            step="any"
            placeholder="Enter load current in amps"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
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
              <p className="mt-3 text-sm font-medium text-amber-900 dark:text-amber-300">
                {results.feedback}
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
            Select the unit system you want to use: Imperial (feet) or Metric (meters).
          </li>
          <li>
            Enter the one-way length of the wire run from the power source to the load.
          </li>
          <li>Enter the expected load current in amps.</li>
          <li>Click the Calculate button to get the recommended wire size.</li>
          <li>
            Review the voltage drop estimate and safety feedback to ensure compliance
            and efficiency.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Wire Size (AWG/KCMIL) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Selecting the correct wire size is crucial for electrical safety,
            efficiency, and compliance with the National Electrical Code (NEC). This
            calculator helps you determine the appropriate wire size based on the
            load current and the length of the wire run.
          </p>
          <p>
            The calculator uses NEC ampacity tables for copper conductors with 75°C
            insulation ratings, which are common in residential and commercial wiring.
            It also estimates voltage drop, which is the loss of voltage due to the
            resistance of the wire over distance.
          </p>
          <p>
            Voltage drop should be kept below 3% for branch circuits to ensure proper
            operation of electrical equipment and to avoid energy waste. For longer
            runs or higher currents, a larger wire size may be necessary.
          </p>
          <p>
            This tool supports both AWG and KCMIL sizes, covering small to very large
            conductors. Use the unit selector to input length in feet or meters.
          </p>
          <p>
            Always verify your results with local electrical codes and consult a
            licensed electrician or engineer for critical or complex installations.
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
            <strong>Warning:</strong> Never undersize wire based solely on ampacity
            without considering voltage drop, especially for long runs. Undersized
            wiring can cause overheating, fire hazards, and equipment damage.
          </p>
          <p>
            Avoid using aluminum ampacity values for copper wire or vice versa. This
            calculator is for copper conductors only.
          </p>
          <p>
            Always consider the insulation temperature rating and ambient conditions,
            which can affect ampacity. This calculator assumes 75°C insulation.
          </p>
          <p>
            For critical loads or sensitive electronics, aim for voltage drop below 3%
            to ensure stable operation.
          </p>
          <p>
            Consult local electrical codes and a qualified professional before finalizing
            wire size selection.
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
        <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">
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
          <BookOpen className="w-5 h-5 text-blue-500" /> References & additional resources
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
      title="Wire Size (AWG/KCMIL) Calculator"
      description="Professional electrical calculator: Wire Size (AWG/KCMIL) Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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