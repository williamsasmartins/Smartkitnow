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
  Lightbulb,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function LightingCircuitLoadPlannerCalculator() {
  /**
   * Inputs:
   * - Number of lighting fixtures (val1)
   * - Wattage per fixture (val2)
   * - Circuit voltage (val3) (usually 120V or 277V)
   *
   * Outputs:
   * - Total load in watts
   * - Total load in amps (calculated as Watts / Voltage)
   * - Recommended breaker size (rounded up to nearest standard breaker size)
   * - Notes/details about NEC compliance and safety
   */

  const [inputs, setInputs] = useState({
    val1: "",
    val2: "",
    val3: "120",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only positive numbers or empty string
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Standard breaker sizes in amps (NEC typical values)
  const standardBreakers = [15, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const results = useMemo(() => {
    const numFixtures = parseFloat(inputs.val1);
    const wattPerFixture = parseFloat(inputs.val2);
    const voltage = parseFloat(inputs.val3);

    if (
      isNaN(numFixtures) ||
      isNaN(wattPerFixture) ||
      isNaN(voltage) ||
      numFixtures <= 0 ||
      wattPerFixture <= 0 ||
      voltage <= 0
    ) {
      return {
        primary: "—",
        secondary: "Invalid input",
        details: "Please enter positive numeric values for all inputs.",
        feedback: "",
      };
    }

    // Total wattage load
    const totalWatts = numFixtures * wattPerFixture;

    // Total amps load = Watts / Voltage
    const totalAmps = totalWatts / voltage;

    // NEC requires continuous loads to be calculated at 125%
    // Lighting loads are considered continuous, so apply 125% factor
    const adjustedAmps = totalAmps * 1.25;

    // Find recommended breaker size (smallest standard breaker >= adjustedAmps)
    const recommendedBreaker =
      standardBreakers.find((b) => b >= adjustedAmps) || ">100";

    // Feedback message about NEC compliance
    let feedback = "";
    if (adjustedAmps > 100) {
      feedback =
        "Warning: Calculated load exceeds 100A. Consider multiple circuits or consult NEC tables.";
    } else {
      feedback =
        "Load calculated with 125% continuous load factor per NEC guidelines.";
    }

    return {
      primary: `${totalWatts.toFixed(0)} W / ${adjustedAmps.toFixed(2)} A`,
      secondary: `Recommended Breaker: ${recommendedBreaker} A`,
      details: `Total wattage load: ${totalWatts.toFixed(
        0
      )} W. Circuit voltage: ${voltage} V. Continuous load factor (125%) applied.`,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do we multiply the load by 125% for lighting circuits?",
      answer:
        "Lighting loads are considered continuous loads under the NEC, meaning they are expected to run for three hours or more. To ensure safety and prevent overheating, the NEC requires continuous loads to be calculated at 125% of their actual load. This ensures the circuit breaker and wiring can handle the sustained load without tripping or damage.",
    },
    {
      question: "Can I use this calculator for non-lighting loads?",
      answer:
        "This calculator is specifically designed for lighting circuits and applies NEC continuous load rules accordingly. For non-lighting loads, such as receptacles or appliances, different NEC rules and load factors may apply. Always consult the NEC or a qualified electrician for other load types.",
    },
    {
      question:
        "What should I do if my calculated load exceeds the largest standard breaker size?",
      answer:
        "If the calculated load exceeds the largest standard breaker size (usually 100A for lighting), you should split the load across multiple circuits or panels. Large lighting loads often require multiple circuits to comply with NEC and ensure safety. Consult the NEC tables and a licensed electrician for proper load distribution.",
    },
    {
      question: "Why is the circuit voltage important in this calculation?",
      answer:
        "Circuit voltage is crucial because the current (amps) drawn by the load depends on the voltage supply. For the same wattage, a higher voltage results in lower current. Lighting circuits commonly use 120V or 277V, and selecting the correct voltage ensures accurate amperage calculation and proper breaker sizing.",
    },
    {
      question: "Is this calculator compliant with the latest NEC standards?",
      answer:
        "This calculator follows general NEC guidelines for lighting load calculations, including the 125% continuous load factor. However, local amendments or updates to the NEC may affect specific requirements. Always verify with the latest NEC edition and local codes, and consult a licensed professional for critical projects.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "An office lighting circuit has 20 LED fixtures, each rated at 40 watts, powered by a 120V circuit. The electrician needs to determine the total load and appropriate breaker size.",
    steps: [
      {
        label: "Step 1: Input number of fixtures",
        explanation: "Enter 20 as the number of lighting fixtures.",
      },
      {
        label: "Step 2: Input wattage per fixture",
        explanation: "Enter 40 watts as the wattage per fixture.",
      },
      {
        label: "Step 3: Input circuit voltage",
        explanation: "Enter 120 volts as the circuit voltage.",
      },
      {
        label: "Step 4: Calculate total load",
        explanation:
          "The calculator multiplies 20 fixtures by 40 watts = 800 watts total load.",
      },
      {
        label: "Step 5: Calculate amps with continuous load factor",
        explanation:
          "800 watts / 120 volts = 6.67 amps; multiplied by 1.25 = 8.33 amps adjusted load.",
      },
      {
        label: "Step 6: Determine breaker size",
        explanation:
          "The smallest standard breaker size greater than 8.33 amps is 15 amps, so a 15A breaker is recommended.",
      },
    ],
    result:
      "The electrician should use a 15A breaker for this lighting circuit, ensuring NEC compliance and safety.",
  };

  const references = [
    {
      title: "NEC Article 210.70 - Lighting Outlets",
      description:
        "National Electrical Code requirements for lighting outlets and load calculations.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "NEC Article 220 - Branch-Circuit, Feeder, and Service Load Calculations",
      description:
        "Guidelines for calculating electrical loads including continuous loads and demand factors.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Standard Circuit Breaker Sizes",
      description:
        "Common standard breaker sizes used for residential and commercial lighting circuits.",
      url: "https://www.eaton.com/us/en-us/catalog/electrical-circuit-protection/circuit-breakers.html",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="num-fixtures">Number of Lighting Fixtures</Label>
          <Input
            id="num-fixtures"
            type="number"
            min={0}
            step="1"
            placeholder="e.g. 20"
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="watt-per-fixture">Wattage per Fixture (W)</Label>
          <Input
            id="watt-per-fixture"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 40"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="circuit-voltage">Circuit Voltage (V)</Label>
          <Input
            id="circuit-voltage"
            type="number"
            min={0}
            step="any"
            placeholder="120 or 277"
            value={inputs.val3}
            onChange={(e) => handleInputChange("val3", e.target.value)}
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
            <div className="text-4xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <>
                <Separator className="my-4" />
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
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
            Enter the total number of lighting fixtures on the circuit. This is
            the count of all lamps or luminaires connected.
          </li>
          <li>
            Enter the wattage rating per fixture. This is typically found on the
            fixture label or manufacturer datasheet.
          </li>
          <li>
            Enter the circuit voltage, usually 120V or 277V depending on your
            electrical system.
          </li>
          <li>
            Click the Calculate button to see the total load in watts and amps,
            including the NEC-required 125% continuous load factor.
          </li>
          <li>
            Review the recommended breaker size to ensure your circuit is
            properly protected.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Lighting Circuit Load Planner
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Lighting circuits are a fundamental part of electrical design,
            powering fixtures that provide illumination in residential,
            commercial, and industrial buildings. Proper load calculation is
            critical to ensure safety, efficiency, and code compliance.
          </p>
          <p>
            According to the National Electrical Code (NEC), lighting loads are
            considered continuous loads because they often operate for three or
            more hours. This requires applying a 125% factor to the calculated
            current to size conductors and overcurrent protection devices
            correctly.
          </p>
          <p>
            This calculator helps you quickly determine the total wattage and
            amperage load of your lighting circuit, factoring in the continuous
            load multiplier. It then recommends the appropriate breaker size
            based on standard NEC breaker ratings.
          </p>
          <p>
            Always verify your calculations with the latest NEC edition and
            consult a licensed electrician or engineer for complex or critical
            projects.
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
            <strong>Warning:</strong> Always apply the 125% continuous load
            factor for lighting circuits as required by the NEC. Neglecting this
            can cause undersized breakers or wiring, leading to overheating and
            fire hazards.
          </p>
          <p>
            Avoid mixing lighting loads with other types of loads on the same
            circuit without proper calculation, as this can cause inaccurate
            load assessments and breaker sizing.
          </p>
          <p>
            Do not select a breaker size smaller than the calculated load or
            larger than the conductor rating. Oversized breakers can fail to
            protect wiring, while undersized breakers may trip frequently.
          </p>
          <p>
            If your calculated load exceeds standard breaker sizes, split the
            load into multiple circuits rather than oversizing a single breaker.
          </p>
          <p>
            Always follow local electrical codes and consult a licensed
            electrician for installations and inspections.
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
      title="Lighting Circuit Load Planner"
      description="Professional electrical calculator: Lighting Circuit Load Planner. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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