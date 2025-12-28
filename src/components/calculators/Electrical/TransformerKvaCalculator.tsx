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

export default function TransformerKvaCalculator() {
  const [inputs, setInputs] = useState({
    voltagePrimary: "",
    voltageSecondary: "",
    currentSecondary: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Transformer kVA calculation:
   * kVA = (Secondary Voltage × Secondary Current) / 1000
   * 
   * Primary voltage is not directly needed for kVA calculation but useful for validation or additional info.
   */

  const results = useMemo(() => {
    const Vp = parseFloat(inputs.voltagePrimary);
    const Vs = parseFloat(inputs.voltageSecondary);
    const Is = parseFloat(inputs.currentSecondary);

    if (
      isNaN(Vp) ||
      isNaN(Vs) ||
      isNaN(Is) ||
      Vp <= 0 ||
      Vs <= 0 ||
      Is <= 0
    ) {
      return {
        primary: "—",
        secondary: "kVA",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Calculate kVA
    const kva = (Vs * Is) / 1000;

    // Safety feedback example: Check if primary voltage is typical range (e.g., 120V to 480V)
    let feedback = "";
    if (Vp < 120 || Vp > 480) {
      feedback =
        "Warning: Primary voltage is outside typical range (120V-480V). Verify transformer specs.";
    }

    return {
      primary: kva.toFixed(2),
      secondary: "kVA",
      details: `Calculated transformer kVA based on secondary voltage (${Vs} V) and current (${Is} A).`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is transformer kVA and why is it important?",
      answer:
        "Transformer kVA (kilovolt-amperes) rating represents the apparent power capacity of a transformer. It is the product of voltage and current on either the primary or secondary side, expressed in thousands of volt-amperes. This rating is crucial for selecting a transformer that can safely handle the electrical load without overheating or damage. Understanding kVA helps ensure proper sizing, efficiency, and compliance with electrical codes.",
    },
    {
      question: "Why do we use secondary voltage and current for kVA calculation?",
      answer:
        "The kVA rating can be calculated from either the primary or secondary side of a transformer because power (ignoring losses) is conserved. However, in practical applications, secondary voltage and current are often used because they represent the load side conditions. This makes it easier to size transformers based on the actual load requirements and ensures the transformer can supply the needed power safely.",
    },
    {
      question: "Can I use this calculator for three-phase transformers?",
      answer:
        "This calculator is designed for single-phase transformers. For three-phase transformers, the kVA calculation involves multiplying the line-to-line voltage, line current, and the square root of three (√3), then dividing by 1000. Using this calculator for three-phase systems will not provide accurate results. Always use formulas specific to three-phase power when dealing with such transformers.",
    },
    {
      question: "What safety precautions should I take when working with transformers?",
      answer:
        "Transformers operate at potentially dangerous voltages and currents. Always ensure power is disconnected before performing any work. Use appropriate personal protective equipment (PPE) such as insulated gloves and eye protection. Verify transformer ratings and wiring comply with the National Electrical Code (NEC). Improper installation or overload can cause overheating, fire hazards, or equipment failure. When in doubt, consult a licensed electrician or engineer.",
    },
    {
      question: "How does transformer efficiency affect kVA rating?",
      answer:
        "Transformer efficiency refers to the ratio of output power to input power, typically expressed as a percentage. While kVA rating indicates the apparent power capacity, it does not account for losses such as heat. Efficiency affects the actual usable power delivered to the load. A transformer with low efficiency wastes energy and may require a higher kVA rating to meet load demands. Selecting transformers with high efficiency improves energy savings and system reliability.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Suppose you have a single-phase transformer supplying a 240 V secondary circuit with a load current of 50 A. You want to determine the transformer kVA rating needed.",
    steps: [
      {
        label: "Step 1: Identify secondary voltage and current",
        explanation:
          "The secondary voltage is 240 volts and the load current is 50 amperes.",
      },
      {
        label: "Step 2: Apply the kVA formula",
        explanation:
          "Calculate kVA = (Secondary Voltage × Secondary Current) / 1000 = (240 × 50) / 1000 = 12 kVA.",
      },
      {
        label: "Step 3: Verify primary voltage",
        explanation:
          "Assuming the primary voltage is 480 V, ensure it is within typical operating range for safety.",
      },
      {
        label: "Step 4: Select transformer",
        explanation:
          "Choose a transformer with at least 12 kVA rating to safely handle the load without overheating.",
      },
    ],
    result:
      "The transformer should be rated for at least 12 kVA to supply the 240 V, 50 A load safely.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "IEEE Transformer Guide",
      description:
        "Comprehensive guide on transformer ratings, calculations, and safety.",
      url: "https://standards.ieee.org/standard/C57_12_00-2010.html",
    },
    {
      title: "National Electrical Code (NEC)",
      description:
        "The NEC provides regulations and guidelines for electrical installations including transformers.",
      url: "https://www.nfpa.org/nec",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="voltagePrimary">Primary Voltage (V)</Label>
          <Input
            id="voltagePrimary"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 480"
            value={inputs.voltagePrimary}
            onChange={(e) => handleInputChange("voltagePrimary", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="voltageSecondary">Secondary Voltage (V)</Label>
          <Input
            id="voltageSecondary"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 240"
            value={inputs.voltageSecondary}
            onChange={(e) => handleInputChange("voltageSecondary", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentSecondary">Secondary Current (A)</Label>
          <Input
            id="currentSecondary"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 50"
            value={inputs.currentSecondary}
            onChange={(e) => handleInputChange("currentSecondary", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button" onClick={() => {}}>
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
              <p className="mt-3 text-amber-900 font-semibold">{results.feedback}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="how-to-use" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to use this calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          <li>
            Enter the <strong>Primary Voltage</strong> of your transformer in volts (V). This is the input voltage side.
          </li>
          <li>
            Enter the <strong>Secondary Voltage</strong> in volts (V). This is the output voltage side supplying the load.
          </li>
          <li>
            Enter the <strong>Secondary Current</strong> in amperes (A), which is the load current on the secondary side.
          </li>
          <li>
            Click the <strong>Calculate</strong> button to compute the transformer kVA rating required.
          </li>
          <li>
            Review the result and any safety feedback or warnings provided.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Transformer kVA Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            The transformer kVA calculator helps electrical engineers and electricians determine the apparent power rating needed for a transformer based on load requirements. The kVA rating is the product of voltage and current, divided by 1000 to convert volt-amperes to kilovolt-amperes.
          </p>
          <p>
            This calculator uses the secondary voltage and current values because these represent the actual load conditions. The primary voltage input is used for validation and safety checks, ensuring the transformer operates within typical voltage ranges.
          </p>
          <p>
            Proper transformer sizing is critical to avoid overheating, voltage drops, and potential equipment failure. The calculator assumes a single-phase transformer; for three-phase transformers, additional factors such as the square root of three (√3) must be considered.
          </p>
          <p>
            Always consult the National Electrical Code (NEC) and manufacturer specifications when selecting transformers to ensure compliance and safety.
          </p>
        </div>
      </section>

      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" />
          Safety & Common Mistakes
        </h3>
        <div className="space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <p>
            <strong>Warning:</strong> Electricity is dangerous and can cause serious injury or death. Always de-energize circuits before working on transformers or electrical equipment.
          </p>
          <p>
            A common mistake is undersizing the transformer kVA rating, which can lead to overheating and premature failure. Always size transformers with a margin above the calculated load to accommodate future expansion and transient loads.
          </p>
          <p>
            Another frequent error is confusing single-phase and three-phase transformer calculations. Using the wrong formula can result in incorrect sizing and unsafe installations.
          </p>
          <p>
            Verify all input values carefully and consult with a licensed professional if unsure about transformer selection or installation.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Real World Example</h2>
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

      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
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
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ref.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Transformer kVA Calculator"
      description="Professional electrical calculator: Transformer kVA Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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