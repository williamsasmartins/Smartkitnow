import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, BookOpen, AlertTriangle, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GeneratorSizingCalculator() {
  /**
   * Inputs:
   * val1: Total connected load in watts (W)
   * val2: Starting load in watts (W) (optional, default 0)
   * val3: Generator power factor (PF) (optional, default 1.0)
   * 
   * Output:
   * Recommended generator size in kVA and kW
   * 
   * Logic:
   * 1. Calculate total load including starting load.
   * 2. Apply power factor to convert watts to kVA.
   * 3. Add 25% safety margin.
   * 4. Round up to nearest standard generator size.
   */

  const [inputs, setInputs] = useState({
    val1: "", // Total connected load (W)
    val2: "", // Starting load (W)
    val3: "", // Power factor (PF)
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Standard generator sizes in kVA (common commercial sizes)
  // These are typical generator ratings to round up to
  const standardGeneratorSizes = [
    5, 7.5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 200, 250, 300, 400, 500,
  ];

  const results = useMemo(() => {
    const connectedLoad = parseFloat(inputs.val1);
    const startingLoad = inputs.val2 ? parseFloat(inputs.val2) : 0;
    const powerFactor = inputs.val3 ? parseFloat(inputs.val3) : 1.0;

    if (
      isNaN(connectedLoad) ||
      connectedLoad <= 0 ||
      isNaN(startingLoad) ||
      startingLoad < 0 ||
      isNaN(powerFactor) ||
      powerFactor <= 0 ||
      powerFactor > 1
    ) {
      return {
        primary: "—",
        secondary: "kVA / kW",
        details: "Please enter valid positive numbers. Power factor must be between 0 and 1.",
        feedback: "",
      };
    }

    // Total load including starting load (starting load is often motor starting watts)
    const totalLoadWatts = connectedLoad + startingLoad;

    // Convert watts to kVA using power factor: kVA = Watts / (1000 * PF)
    const totalLoadKva = totalLoadWatts / (1000 * powerFactor);

    // Add 25% safety margin for transient loads, future expansion, and generator sizing
    const recommendedKva = totalLoadKva * 1.25;

    // Round up to nearest standard generator size
    const roundedKva =
      standardGeneratorSizes.find((size) => size >= recommendedKva) ||
      Math.ceil(recommendedKva);

    // Calculate kW rating based on power factor
    const ratedKw = roundedKva * powerFactor;

    return {
      primary: `${roundedKva.toFixed(1)} kVA / ${ratedKw.toFixed(1)} kW`,
      secondary: "Recommended Generator Size",
      details: `Calculated from connected load ${connectedLoad.toLocaleString()} W, starting load ${startingLoad.toLocaleString()} W, and power factor ${powerFactor.toFixed(
        2
      )}. Includes 25% safety margin.`,
      feedback:
        recommendedKva > roundedKva
          ? "Note: Generator size rounded up to nearest standard rating."
          : "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do we add a 25% safety margin when sizing a generator?",
      answer:
        "A 25% safety margin is added to account for transient loads such as motor starting currents, future load expansions, and to ensure the generator operates within safe limits without being overloaded. This margin helps improve reliability and longevity of the generator by preventing frequent overload conditions.",
    },
    {
      question: "What is the significance of power factor in generator sizing?",
      answer:
        "Power factor (PF) represents the phase difference between voltage and current in an AC circuit and affects the real power delivered. Since generators are rated in kVA (apparent power), the power factor is used to convert real power (kW) to apparent power (kVA). A lower power factor means the generator must supply more apparent power for the same real power load, impacting sizing.",
    },
    {
      question: "How do starting loads affect generator sizing?",
      answer:
        "Starting loads, especially from motors and compressors, can draw significantly higher current than their running load, sometimes 3-7 times the rated current. Including starting load wattage in the calculation ensures the generator can handle these transient surges without voltage drops or damage.",
    },
    {
      question: "Can I use this calculator for three-phase generators?",
      answer:
        "Yes, this calculator provides the total generator size in kVA/kW regardless of single or three-phase systems. However, for three-phase systems, ensure the connected load input represents the total load across all phases. Further phase-specific calculations may be needed for detailed design.",
    },
    {
      question: "What happens if I undersize my generator?",
      answer:
        "Undersizing a generator can cause frequent overloads, voltage drops, and potential damage to both the generator and connected equipment. It may also lead to nuisance tripping of protective devices and reduced generator lifespan. Proper sizing is critical for safe and reliable operation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "Running a 100 ft run of 12/2 Romex cable to power a workshop with a total connected load of 8,000 watts, including a 2,000 watt motor starting load, and a power factor of 0.9.",
    steps: [
      {
        label: "Step 1: Enter Connected Load",
        explanation:
          "Input the total connected load of 8,000 watts into the calculator.",
      },
      {
        label: "Step 2: Enter Starting Load",
        explanation:
          "Input the motor starting load of 2,000 watts to account for surge current.",
      },
      {
        label: "Step 3: Enter Power Factor",
        explanation:
          "Input the power factor of 0.9, typical for mixed resistive and inductive loads.",
      },
      {
        label: "Step 4: Calculate",
        explanation:
          "The calculator computes the total load, applies the power factor, adds a 25% safety margin, and rounds up to the nearest standard generator size.",
      },
    ],
    result:
      "Recommended generator size is 15.0 kVA / 13.5 kW, ensuring reliable operation with margin for starting loads and future expansion.",
  };

  const references = [
    {
      title: "NEC Table 310.16",
      description: "Allowable Ampacities of Insulated Conductors.",
      url: "https://www.nfpa.org/",
    },
    {
      title: "IEEE Std 141-1993 (Red Book)",
      description:
        "Recommended Practice for Electric Power Distribution for Industrial Plants.",
      url: "https://standards.ieee.org/standard/141-1993.html",
    },
    {
      title: "Generator Sizing Guide - Cummins",
      description:
        "Comprehensive guide on sizing generators for various applications.",
      url: "https://www.cummins.com/generators/sizing-guide",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="connectedLoad">Total Connected Load (Watts)</Label>
          <Input
            id="connectedLoad"
            type="text"
            placeholder="e.g. 8000"
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startingLoad">Starting Load (Watts)</Label>
          <Input
            id="startingLoad"
            type="text"
            placeholder="e.g. 2000"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="powerFactor">Power Factor (0 - 1)</Label>
          <Input
            id="powerFactor"
            type="text"
            placeholder="e.g. 0.9"
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
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.primary}
            </div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p className="text-xs text-amber-900 mt-2 font-semibold">
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
            Enter the total connected load in watts. This is the sum of all
            electrical devices expected to run simultaneously.
          </li>
          <li>
            Enter the starting load in watts. This accounts for surge currents
            from motors or compressors starting up.
          </li>
          <li>
            Enter the power factor of your load, typically between 0.8 and 1.0.
            If unknown, use 1.0 for purely resistive loads.
          </li>
          <li>
            Click "Calculate" to get the recommended generator size in kVA and
            kW.
          </li>
          <li>
            Use the recommended size to select a generator that meets or exceeds
            this rating.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Generator Sizing Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Generator sizing is a critical step in ensuring reliable power
            supply for residential, commercial, or industrial applications. The
            generator must be capable of supplying the total connected load,
            including transient starting currents, without excessive voltage
            drop or overload.
          </p>
          <p>
            The total connected load is the sum of all devices expected to run
            simultaneously, measured in watts. Starting loads, especially from
            motors and compressors, can be significantly higher than running
            loads and must be included to avoid undersizing.
          </p>
          <p>
            Power factor (PF) is the ratio of real power (watts) to apparent
            power (volt-amperes). Since generators are rated in kVA, the PF is
            used to convert watts to kVA. A lower PF means the generator must
            supply more apparent power for the same real power.
          </p>
          <p>
            A safety margin of 25% is added to accommodate transient loads,
            future expansion, and to ensure the generator operates within safe
            limits. The final recommended size is rounded up to the nearest
            standard generator rating.
          </p>
          <p>
            Proper generator sizing improves reliability, prevents damage, and
            ensures compliance with electrical codes and standards.
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
            <strong>Warning:</strong> Electricity is dangerous and can cause
            serious injury or death. Always consult a licensed electrician or
            electrical engineer before installing or modifying electrical
            systems.
          </p>
          <p>
            Common mistakes include undersizing the generator, ignoring starting
            loads, and using incorrect power factor values. These errors can
            lead to generator overload, equipment damage, and unsafe operating
            conditions.
          </p>
          <p>
            Always verify your calculations and consider future load growth.
            Use proper protective devices and follow local electrical codes and
            standards.
          </p>
          <p>
            Never attempt to install or service generators without proper
            training and safety precautions.
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
      title="Generator Sizing Calculator"
      description="Professional electrical calculator: Generator Sizing Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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