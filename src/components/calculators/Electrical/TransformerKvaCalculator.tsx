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

export default function TransformerKvaCalculator() {
  const [inputs, setInputs] = useState({
    voltagePrimary: "",
    currentPrimary: "",
    voltageSecondary: "",
    currentSecondary: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  /**
   * Transformer kVA calculation logic:
   * kVA = (Voltage × Current) / 1000
   * 
   * We will calculate both primary and secondary kVA based on inputs.
   * If only one side is filled, calculate that side's kVA.
   * If both sides are filled, calculate both and compare.
   */

  const results = useMemo(() => {
    const Vp = parseFloat(inputs.voltagePrimary);
    const Ip = parseFloat(inputs.currentPrimary);
    const Vs = parseFloat(inputs.voltageSecondary);
    const Is = parseFloat(inputs.currentSecondary);

    let primaryKva = null;
    let secondaryKva = null;
    let feedback = "";
    let details = "";

    if (Vp > 0 && Ip > 0) {
      primaryKva = (Vp * Ip) / 1000;
    }
    if (Vs > 0 && Is > 0) {
      secondaryKva = (Vs * Is) / 1000;
    }

    if (primaryKva && secondaryKva) {
      details =
        "Both primary and secondary kVA calculated. Values should be approximately equal for a balanced transformer.";
      const diff = Math.abs(primaryKva - secondaryKva);
      if (diff / Math.max(primaryKva, secondaryKva) > 0.1) {
        feedback =
          "Warning: Significant difference (>10%) between primary and secondary kVA values. Check input values and transformer specs.";
      } else {
        feedback = "Primary and secondary kVA values are consistent.";
      }
      return {
        primary: `${primaryKva.toFixed(2)} kVA`,
        secondary: `${secondaryKva.toFixed(2)} kVA`,
        details,
        feedback,
      };
    } else if (primaryKva) {
      details = "Calculated transformer kVA based on primary voltage and current.";
      return {
        primary: `${primaryKva.toFixed(2)} kVA`,
        secondary: "",
        details,
        feedback,
      };
    } else if (secondaryKva) {
      details = "Calculated transformer kVA based on secondary voltage and current.";
      return {
        primary: `${secondaryKva.toFixed(2)} kVA`,
        secondary: "",
        details,
        feedback,
      };
    } else {
      return {
        primary: "0",
        secondary: "",
        details: "Please enter valid voltage and current values to calculate kVA.",
        feedback: "",
      };
    }
  }, [inputs]);

  const faqs = [
    {
      question: "What is transformer kVA rating?",
      answer:
        "The transformer kVA rating represents the apparent power capacity of the transformer. It is calculated by multiplying the voltage and current on either the primary or secondary side and dividing by 1000 to convert to kilo-volt-amperes. This rating helps determine the maximum load the transformer can safely handle without overheating or damage.",
    },
    {
      question: "Why might primary and secondary kVA values differ?",
      answer:
        "Primary and secondary kVA values might differ due to measurement inaccuracies, load imbalances, or transformer losses such as copper and core losses. Additionally, if the inputs are not measured under the same load conditions, the values may not match exactly. A difference within 10% is generally acceptable, but larger discrepancies should be investigated.",
    },
    {
      question: "Can I calculate transformer kVA with only voltage or current?",
      answer:
        "No, you need both voltage and current values from either the primary or secondary side to calculate the kVA rating. The formula requires multiplying voltage by current. Without both values, the calculation cannot be performed accurately.",
    },
    {
      question: "How does transformer kVA relate to transformer efficiency?",
      answer:
        "Transformer kVA rating indicates the apparent power capacity, not the efficiency. Efficiency is the ratio of output power to input power and depends on losses within the transformer. While kVA rating tells you the maximum load, efficiency tells you how well the transformer converts input power to output power with minimal losses.",
    },
    {
      question: "Is the transformer kVA rating the same as power consumption?",
      answer:
        "No, transformer kVA rating indicates the maximum apparent power the transformer can handle, not the actual power consumption. The actual power consumed depends on the load connected and power factor. kVA includes both real power (kW) and reactive power (kVAR), so it is a measure of total apparent power.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "An electrical engineer needs to verify the kVA rating of a transformer installed in a commercial building. The primary side voltage is 480 V, and the measured current is 50 A. The secondary side voltage is 208 V, and the current is 115 A.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the primary voltage (480 V) and primary current (50 A) into the calculator.",
      },
      {
        label: "Step 2",
        explanation:
          "Input the secondary voltage (208 V) and secondary current (115 A) into the calculator.",
      },
      {
        label: "Step 3",
        explanation:
          "Click the Calculate button to compute the kVA values for both primary and secondary sides.",
      },
      {
        label: "Step 4",
        explanation:
          "Compare the results. The primary kVA should be approximately equal to the secondary kVA, confirming transformer balance.",
      },
    ],
    result:
      "The calculator shows primary kVA as 24.00 kVA and secondary kVA as 23.92 kVA, indicating the transformer is operating within expected parameters.",
  };

  const references = [
    {
      title: "NEC Article 450 - Transformers",
      description:
        "National Electrical Code guidelines for transformer installation, sizing, and safety requirements.",
      url: "https://www.nfpa.org/codes-and-standards/all-codes-and-standards/list-of-codes-and-standards/detail?code=70",
    },
    {
      title: "IEEE Transformer Standards",
      description:
        "Standards and recommended practices for transformer design and testing by the IEEE.",
      url: "https://standards.ieee.org/standard/C57_12_00-2015.html",
    },
    {
      title: "Electrical Engineering Portal - Transformer Basics",
      description:
        "Comprehensive guide on transformer ratings, calculations, and practical applications.",
      url: "https://electrical-engineering-portal.com/transformer-kva-calculation",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="voltagePrimary">Primary Voltage (V)</Label>
          <Input
            id="voltagePrimary"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 480"
            value={inputs.voltagePrimary}
            onChange={(e) => handleInputChange("voltagePrimary", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentPrimary">Primary Current (A)</Label>
          <Input
            id="currentPrimary"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 50"
            value={inputs.currentPrimary}
            onChange={(e) => handleInputChange("currentPrimary", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="voltageSecondary">Secondary Voltage (V)</Label>
          <Input
            id="voltageSecondary"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 208"
            value={inputs.voltageSecondary}
            onChange={(e) => handleInputChange("voltageSecondary", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentSecondary">Secondary Current (A)</Label>
          <Input
            id="currentSecondary"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 115"
            value={inputs.currentSecondary}
            onChange={(e) => handleInputChange("currentSecondary", e.target.value)}
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
            <div className="text-4xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            {results.secondary && (
              <div className="text-2xl font-bold mt-2 text-blue-500">{results.secondary}</div>
            )}
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p className="mt-3 text-sm font-semibold text-amber-700 dark:text-amber-400">{results.feedback}</p>
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
            Enter the primary side voltage (in volts) and current (in amperes) if available.
          </li>
          <li>
            Enter the secondary side voltage (in volts) and current (in amperes) if available.
          </li>
          <li>
            Click the <strong>Calculate</strong> button to compute the transformer kVA rating.
          </li>
          <li>
            Review the results. If both primary and secondary values are entered, the calculator will compare both kVA values for consistency.
          </li>
          <li>
            Use the feedback messages to check for potential input errors or transformer imbalances.
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
            The transformer kVA calculator helps electrical engineers and technicians determine the apparent power rating of a transformer based on voltage and current measurements from either the primary or secondary side.
          </p>
          <p>
            The fundamental formula used is <em>kVA = (Voltage × Current) / 1000</em>. This formula calculates the apparent power in kilo-volt-amperes, which is a key rating for transformers indicating their load capacity.
          </p>
          <p>
            When both primary and secondary voltage and current values are provided, the calculator compares the two kVA values to ensure they are consistent. Significant differences may indicate measurement errors, transformer faults, or load imbalances.
          </p>
          <p>
            This calculator is useful for sizing transformers, verifying transformer ratings during maintenance, and ensuring compliance with electrical codes and standards.
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
            <strong>Warning:</strong> Always ensure that voltage and current measurements are taken safely using properly rated instruments and following lockout/tagout procedures. Working with transformers involves high voltages and currents that can be hazardous.
          </p>
          <p>
            A common mistake is to input incorrect voltage or current values, leading to inaccurate kVA calculations. Double-check all measurements and units before calculating.
          </p>
          <p>
            Another frequent error is assuming that primary and secondary kVA values must be exactly equal. Small differences are normal due to transformer losses and measurement tolerances, but large discrepancies should be investigated.
          </p>
          <p>
            Never exceed the transformer's rated kVA to avoid overheating and potential failure. Use this calculator as a guide but always refer to manufacturer specifications and electrical codes.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {example.title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          {example.steps.map((step, i) => (
            <li key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold text-slate-700 dark:text-slate-300">{example.result}</p>
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