import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BreakerSizeCalculator() {
  const [inputs, setInputs] = useState({
    loadAmps: "", // Load current in Amps
    continuousLoad: "no", // yes/no for continuous load
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * According to NEC (National Electrical Code):
   * - For continuous loads, breaker size = Load current × 125%
   * - For non-continuous loads, breaker size = Load current
   * 
   * Then select the next standard breaker size from typical standard sizes.
   */

  // Standard breaker sizes in Amps (common sizes)
  const standardBreakerSizes = [
    15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300,
  ];

  const results = useMemo(() => {
    const load = parseFloat(inputs.loadAmps);
    if (isNaN(load) || load <= 0) {
      return {
        primary: "-",
        secondary: "Amps",
        details: "Please enter a valid load current greater than zero.",
        feedback: "",
      };
    }

    // Calculate required breaker size
    const multiplier = inputs.continuousLoad === "yes" ? 1.25 : 1.0;
    const requiredBreaker = load * multiplier;

    // Find the next standard breaker size >= requiredBreaker
    const breakerSize = standardBreakerSizes.find((size) => size >= requiredBreaker) ?? "Custom";

    // Details explanation
    const details = inputs.continuousLoad === "yes"
      ? `Load current (${load} A) × 125% = ${requiredBreaker.toFixed(2)} A. Selected breaker size is the next standard size ≥ this value.`
      : `Load current (${load} A) requires a breaker size ≥ this value. Selected breaker size is the next standard size ≥ this value.`;

    // Safety feedback
    let feedback = "";
    if (breakerSize === "Custom") {
      feedback = "No standard breaker size found for the calculated value. Consult NEC or a professional.";
    } else if (breakerSize > 100) {
      feedback = "Breaker size is large; ensure conductor size and equipment ratings comply with NEC.";
    } else {
      feedback = "Breaker size calculated per NEC guidelines.";
    }

    return {
      primary: breakerSize.toString(),
      secondary: "Amps",
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do I need to multiply the load current by 125% for continuous loads?",
      answer:
        "The NEC requires that continuous loads be calculated at 125% of their actual current to ensure the breaker can handle the sustained load without tripping. Continuous loads are those expected to run for three hours or more. This safety margin helps prevent nuisance trips and overheating.",
    },
    {
      question: "What if my calculated breaker size is not a standard size?",
      answer:
        "If the calculated breaker size does not match a standard breaker rating, you must select the next higher standard size available. Using a breaker smaller than the calculated size risks nuisance tripping, while a larger breaker may require upsizing conductors and equipment to maintain safety compliance.",
    },
    {
      question: "Can I use this calculator for all types of breakers?",
      answer:
        "This calculator is intended for general circuit breakers protecting standard loads. Specialized breakers, such as GFCI, AFCI, or motor circuit breakers, may have additional requirements. Always consult the NEC and manufacturer specifications for specialized applications.",
    },
    {
      question: "How does conductor size relate to breaker size?",
      answer:
        "Breaker size must be coordinated with conductor ampacity to prevent overheating and fire hazards. Selecting a breaker larger than the conductor's ampacity can cause the conductor to carry excessive current without tripping the breaker. Always ensure conductor size meets or exceeds the breaker rating per NEC tables.",
    },
    {
      question: "Is it safe to always pick the next larger breaker size?",
      answer:
        "While selecting the next larger standard breaker size is NEC-compliant, it must be balanced with conductor size and equipment ratings. Oversizing breakers without proper conductor sizing can create safety hazards. Always verify all components in the circuit are rated for the selected breaker size.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You have a continuous load appliance drawing 32 amps, and you need to determine the correct breaker size to protect the circuit safely.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the load current: 32 amps continuous load.",
      },
      {
        label: "Step 2",
        explanation:
          "Multiply the load current by 125% to account for continuous operation: 32 × 1.25 = 40 amps.",
      },
      {
        label: "Step 3",
        explanation:
          "Select the next standard breaker size equal to or greater than 40 amps, which is 40 amps.",
      },
      {
        label: "Step 4",
        explanation:
          "Verify conductor size and equipment ratings are suitable for a 40-amp breaker.",
      },
    ],
    result: "The correct breaker size for this continuous 32-amp load is a 40-amp breaker.",
  };

  const references = [
    {
      title: "NEC Article 210 - Branch Circuits",
      description:
        "National Electrical Code guidelines on branch circuit requirements, including breaker sizing and continuous load calculations.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "NEC Table 240.6(A) - Standard Breaker Sizes",
      description:
        "Lists standard breaker sizes used in residential and commercial electrical installations.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Electrical Safety Foundation International (ESFI)",
      description:
        "Provides safety tips and guidelines for electrical installations and breaker sizing.",
      url: "https://www.esfi.org",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loadAmps">Load Current (Amps)</Label>
          <Input
            id="loadAmps"
            type="number"
            min="0"
            step="any"
            placeholder="Enter load current in amps"
            value={inputs.loadAmps}
            onChange={(e) => handleInputChange("loadAmps", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="continuousLoad">Is this a continuous load?</Label>
          <select
            id="continuousLoad"
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2"
            value={inputs.continuousLoad}
            onChange={(e) => handleInputChange("continuousLoad", e.target.value)}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
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
            <Separator className="my-4" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{results.feedback}</p>
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
          <li>Enter the load current in amps that the circuit will carry.</li>
          <li>Select whether the load is continuous (operating for 3 hours or more).</li>
          <li>Click the Calculate button to determine the recommended breaker size.</li>
          <li>Review the result and ensure your conductors and equipment are rated accordingly.</li>
          <li>Consult a licensed electrician or the NEC for complex or specialized installations.</li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Breaker Size Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Circuit breakers protect electrical circuits by interrupting current flow during overloads or faults. Selecting the correct breaker size is critical for safety and equipment protection.
          </p>
          <p>
            The National Electrical Code (NEC) requires that continuous loads be calculated at 125% of their actual current to prevent nuisance tripping and overheating. Non-continuous loads can use the actual load current.
          </p>
          <p>
            After calculating the required breaker size, always select the next standard breaker rating equal to or greater than the calculated value. This ensures compliance with NEC and provides a safety margin.
          </p>
          <p>
            Remember that breaker size must be coordinated with conductor ampacity and equipment ratings. Oversizing breakers without proper conductor sizing can create fire hazards.
          </p>
          <p>
            Always consult the NEC, manufacturer guidelines, and a licensed electrician when designing or modifying electrical circuits.
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
            <strong>Warning:</strong> Never select a breaker size smaller than the calculated load current; this will cause nuisance tripping and potential downtime.
          </p>
          <p>
            Oversizing breakers without increasing conductor size can lead to overheating and fire hazards. Always ensure conductors are rated for the breaker size.
          </p>
          <p>
            Continuous loads must always be multiplied by 125% per NEC guidelines. Ignoring this can cause breakers to trip unexpectedly.
          </p>
          <p>
            Do not rely solely on this calculator for specialized loads such as motors, GFCI, or AFCI breakers. Consult NEC and professionals for those cases.
          </p>
          <p>
            Always verify your calculations and installation with a licensed electrician or engineer to ensure safety and code compliance.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">{example.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{example.scenario}</p>
        <ol className="list-decimal pl-5 space-y-3 text-slate-600 dark:text-slate-400">
          {example.steps.map((step, i) => (
            <li key={i}>
              <strong>{step.label}:</strong> {step.explanation}
            </li>
          ))}
        </ol>
        <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{example.result}</p>
      </section>

      <section id="faq">
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
      title="Breaker Size Calculator"
      description="Professional electrical calculator: Breaker Size Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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