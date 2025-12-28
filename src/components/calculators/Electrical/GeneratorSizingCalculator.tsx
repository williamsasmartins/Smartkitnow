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

export default function GeneratorSizingCalculator() {
  /*
    Generator Sizing Calculator Logic:
    Inputs:
      - Total Running Watts (continuous load)
      - Starting Watts (surge load)
      - Optional: Load Type (Residential, Commercial, Industrial) - affects sizing margin (not implemented here for simplicity)
    
    Output:
      - Recommended Generator Size (Watts)
      - Explanation/details
    
    Formula:
      The generator size must be at least the starting watts (surge load),
      but also able to handle the running watts continuously.
      Usually, the recommended generator size is the greater of:
        - Starting Watts
        - Running Watts * 1.25 (to provide 25% margin for safety and future expansion)
  */

  const [inputs, setInputs] = useState({
    runningWatts: "",
    startingWatts: "",
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const running = parseFloat(inputs.runningWatts);
    const starting = parseFloat(inputs.startingWatts);

    if (
      isNaN(running) ||
      isNaN(starting) ||
      running <= 0 ||
      starting <= 0
    ) {
      return {
        primary: "—",
        secondary: "Watts",
        details: "Please enter valid positive numbers for both inputs.",
        feedback: "",
      };
    }

    // Calculate recommended generator size
    const recommended = Math.max(starting, running * 1.25);

    // Round up to nearest 100 watts for practical sizing
    const recommendedRounded = Math.ceil(recommended / 100) * 100;

    return {
      primary: recommendedRounded.toLocaleString(),
      secondary: "Watts",
      details: `Recommended generator size to handle ${running.toLocaleString()}W running load and ${starting.toLocaleString()}W starting surge.`,
      feedback:
        recommendedRounded >= starting && recommendedRounded >= running
          ? "Sizing includes 25% margin on running load or starting surge, whichever is greater."
          : "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do I need to consider both running and starting watts?",
      answer:
        "Running watts represent the continuous power your equipment consumes during normal operation, while starting watts are the extra surge power needed to start motors or compressors. A generator must be sized to handle the higher of these two values to avoid overload or damage. Ignoring starting watts can cause the generator to fail when equipment starts.",
    },
    {
      question: "Why is a 25% margin added to the running watts?",
      answer:
        "Adding a 25% margin to the running watts ensures the generator can handle unexpected load increases, voltage drops, and future expansions. This safety margin helps maintain stable operation and prolongs generator life by preventing it from running at maximum capacity continuously.",
    },
    {
      question: "Can I use this calculator for all types of generators?",
      answer:
        "This calculator provides a general sizing guideline suitable for most portable and standby generators. However, specialized generators, such as those for industrial or critical applications, may require additional considerations like power factor, load type, and NEC compliance. Always consult a professional engineer for complex installations.",
    },
    {
      question: "What happens if my generator is undersized?",
      answer:
        "An undersized generator may fail to start or run your equipment properly, leading to frequent overloads, tripped breakers, or damage to both the generator and connected devices. It can also cause voltage fluctuations that harm sensitive electronics. Proper sizing is essential for safe and reliable operation.",
    },
    {
      question: "How do I measure the running and starting watts of my equipment?",
      answer:
        "Running watts can often be found on the equipment nameplate or in the user manual. Starting watts are typically higher and may be listed as 'starting watts' or 'surge watts.' If not available, you can estimate starting watts as 2-3 times the running watts for motor-driven devices. For precise measurement, use a wattmeter or consult the manufacturer.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You want to size a generator for a home backup system that powers essential appliances including a refrigerator, sump pump, and lighting.",
    steps: [
      {
        label: "Step 1: Determine Running Watts",
        explanation:
          "Add the running watts of all appliances you want to power simultaneously. For example, refrigerator (700W), sump pump (800W), lighting (300W) = 1800W total running load.",
      },
      {
        label: "Step 2: Determine Starting Watts",
        explanation:
          "Identify the highest starting wattage among your appliances. The sump pump typically has the highest surge, about 1600W.",
      },
      {
        label: "Step 3: Calculate Recommended Generator Size",
        explanation:
          "Calculate 1.25 × running watts = 1.25 × 1800 = 2250W. Compare with starting watts (1600W). The higher value is 2250W, so choose a generator rated at least 2250W. Round up to nearest 100W = 2300W.",
      },
    ],
    result:
      "Recommended generator size: 2300 Watts to safely power your essential home appliances with margin for safety and surge loads.",
  };

  const references = [
    {
      title: "National Electrical Code (NEC) Article 445",
      description:
        "Guidelines for generator installation and sizing, including load calculations and safety requirements.",
      url: "https://www.nfpa.org/NEC",
    },
    {
      title: "Generator Sizing Guide - Generac",
      description:
        "Comprehensive guide on how to size generators for residential and commercial applications.",
      url: "https://www.generac.com/for-homeowners/generator-buying-guide/generator-sizing",
    },
    {
      title: "Portable Generator Sizing Calculator - Honda",
      description:
        "Honda's official calculator and tips for selecting the right portable generator size.",
      url: "https://powerequipment.honda.com/generators/portable-generator-sizing-calculator",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="runningWatts">Total Running Watts (Continuous Load)</Label>
          <Input
            id="runningWatts"
            type="number"
            min={0}
            placeholder="e.g. 1800"
            value={inputs.runningWatts}
            onChange={(e) => handleInputChange("runningWatts", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startingWatts">Starting Watts (Surge Load)</Label>
          <Input
            id="startingWatts"
            type="number"
            min={0}
            placeholder="e.g. 1600"
            value={inputs.startingWatts}
            onChange={(e) => handleInputChange("startingWatts", e.target.value)}
          />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Zap className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Recommended Generator Size</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.primary}</div>
            <div className="text-xl font-bold mt-2">{results.secondary}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            {results.feedback && (
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 font-medium">{results.feedback}</p>
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
            Enter the total running watts of all equipment you plan to power simultaneously. This is the continuous load.
          </li>
          <li>
            Enter the highest starting watts (surge load) required by any motor or compressor in your equipment.
          </li>
          <li>
            Click the Calculate button to get the recommended generator size in watts.
          </li>
          <li>
            Use the recommended size to select a generator that can safely handle your load with margin.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Generator Sizing Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Proper generator sizing is critical to ensure reliable power supply and protect your equipment. The two main power ratings to consider are running watts and starting watts. Running watts represent the continuous power your devices consume during operation, while starting watts are the additional surge power needed to start motors or compressors.
          </p>
          <p>
            The generator must be sized to handle the higher of these two values. To provide a safety margin and accommodate future load increases, it is common practice to add 25% to the running watts before comparing to the starting watts. The recommended generator size is the greater of the starting watts or 1.25 times the running watts.
          </p>
          <p>
            This calculator automates this calculation and rounds up the result to the nearest 100 watts for practical generator selection. Always verify your equipment specifications and consult with a professional engineer or electrician for complex or critical applications.
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
            <strong>Warning:</strong> Never undersize a generator. Using a generator that cannot handle the starting or running load can cause equipment damage, generator failure, and safety hazards such as fire or electric shock.
          </p>
          <p>
            Avoid ignoring starting watts; many appliances require significantly more power to start than to run. Always include a margin (typically 25%) on running watts to accommodate load fluctuations and future expansion.
          </p>
          <p>
            Do not rely solely on nameplate ratings without verifying actual load requirements. Use a wattmeter or consult manufacturer data for accurate sizing.
          </p>
          <p>
            Improper generator sizing can lead to voltage drops, frequent breaker trips, and damage to sensitive electronics. Always follow NEC guidelines and local electrical codes.
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