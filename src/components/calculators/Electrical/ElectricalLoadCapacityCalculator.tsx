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

export default function ElectricalLoadCapacityCalculator() {
  /**
   * Inputs:
   * val1: Total connected load in watts (W)
   * val2: Voltage (V) - typically 120, 240, or 208
   * val3: Power factor or demand factor (%) - optional, default 100%
   *
   * Output:
   * primary: Recommended breaker/panel rating in Amps (A)
   * secondary: "Amps"
   * details: Explanation of calculation
   * feedback: Safety notes or warnings
   */

  const [inputs, setInputs] = useState({
    val1: "", // Connected load (W)
    val2: "240", // Voltage (V) default 240V
    val3: "100", // Demand factor (%) default 100%
  });

  const handleInputChange = (field: string, value: string) => {
    // Allow only numeric values and empty string
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [field]: value }));
    }
  };

  const results = useMemo(() => {
    const loadWatts = parseFloat(inputs.val1);
    const voltage = parseFloat(inputs.val2);
    const demandFactorPercent = parseFloat(inputs.val3);

    if (
      isNaN(loadWatts) ||
      loadWatts <= 0 ||
      isNaN(voltage) ||
      voltage <= 0 ||
      isNaN(demandFactorPercent) ||
      demandFactorPercent <= 0
    ) {
      return {
        primary: "0",
        secondary: "Amps",
        details: "Please enter valid positive numbers for all inputs.",
        feedback: "",
      };
    }

    // Apply demand factor (percentage)
    const adjustedLoadWatts = (loadWatts * demandFactorPercent) / 100;

    // Calculate current (I = P / V)
    // For single-phase or split-phase systems (most residential), use I = P / V
    // For three-phase systems, I = P / (√3 * V)
    // Here we assume single-phase for simplicity; user can adjust voltage accordingly.

    // To be more accurate, we can ask user for phase type, but requirement does not specify.
    // So we will assume single-phase.

    const currentAmps = adjustedLoadWatts / voltage;

    // NEC requires breaker rating to be at least 125% of continuous load
    // So multiply by 1.25 and round up to next standard breaker size

    const continuousLoadAmps = currentAmps * 1.25;

    // Standard breaker sizes (NEC typical): 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250, 300, 350, 400, 450, 500, 600
    const standardBreakers = [
      15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 125, 150, 175, 200, 225, 250,
      300, 350, 400, 450, 500, 600,
    ];

    // Find the smallest breaker size >= continuousLoadAmps
    const recommendedBreaker = standardBreakers.find(
      (size) => size >= continuousLoadAmps
    );

    const details = `Connected load: ${loadWatts.toLocaleString()} W, Voltage: ${voltage} V, Demand factor: ${demandFactorPercent}%. Adjusted load: ${adjustedLoadWatts.toLocaleString()} W. Continuous load current (125%): ${continuousLoadAmps.toFixed(
      2
    )} A. Recommended breaker size: ${
      recommendedBreaker ?? "N/A"
    } A (rounded to next standard size).`;

    let feedback = "";
    if (!recommendedBreaker) {
      feedback =
        "Warning: Load exceeds typical breaker sizes. Consult a professional engineer.";
    } else if (continuousLoadAmps > recommendedBreaker) {
      feedback =
        "Warning: Calculated load exceeds recommended breaker size. Recheck inputs.";
    } else {
      feedback = "Calculation based on NEC guidelines for continuous loads.";
    }

    return {
      primary: recommendedBreaker ? recommendedBreaker.toString() : "N/A",
      secondary: "Amps",
      details,
      feedback,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the purpose of applying a demand factor in this calculator?",
      answer:
        "The demand factor accounts for the fact that not all electrical loads operate at their maximum capacity simultaneously. By applying a demand factor, typically expressed as a percentage, the calculator adjusts the total connected load to a more realistic value. This helps in sizing breakers and panels more efficiently, avoiding oversizing and reducing costs while maintaining safety and compliance with electrical codes.",
    },
    {
      question: "Why does the calculator multiply the current by 125% when sizing breakers?",
      answer:
        "According to the National Electrical Code (NEC), continuous loads—those expected to run for three hours or more—must be considered at 125% of their calculated current to ensure safety and prevent overheating. Multiplying by 125% provides a safety margin to accommodate continuous operation without tripping the breaker unnecessarily. This practice helps protect wiring and equipment from damage due to sustained high current.",
    },
    {
      question: "Can this calculator be used for three-phase electrical systems?",
      answer:
        "This calculator assumes a single-phase or split-phase system for simplicity. Three-phase systems require a different calculation method involving the square root of three (√3) in the current calculation formula. For three-phase loads, the current is calculated as I = P / (√3 × V). If you are working with three-phase systems, it is recommended to consult a specialized calculator or an electrical engineer to ensure accurate sizing.",
    },
    {
      question: "What should I do if my calculated load exceeds the largest standard breaker size?",
      answer:
        "If the calculated load requires a breaker size larger than the standard maximum (usually 600 Amps), it indicates a very high electrical demand that typical residential or commercial panels cannot handle. In such cases, you should consult a professional electrical engineer or electrician to design a custom solution, which may include multiple panels, transformers, or specialized equipment to safely distribute the electrical load.",
    },
    {
      question: "How accurate is this calculator for real-world electrical load planning?",
      answer:
        "This calculator provides a general estimation based on common NEC guidelines and typical assumptions. While it is useful for preliminary planning and educational purposes, real-world electrical load planning involves many factors such as load diversity, specific equipment characteristics, local code amendments, and safety margins. Always consult a licensed electrician or engineer for detailed design and compliance verification.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "A homeowner wants to determine the appropriate breaker size for a new subpanel feeding several appliances with a total connected load of 7200 watts at 240 volts. They estimate a demand factor of 80% based on typical usage patterns.",
    steps: [
      {
        label: "Step 1: Enter the total connected load",
        explanation:
          "Input 7200 watts as the total connected load in the calculator.",
      },
      {
        label: "Step 2: Enter the system voltage",
        explanation:
          "Input 240 volts, which is standard for residential subpanels.",
      },
      {
        label: "Step 3: Enter the demand factor",
        explanation:
          "Input 80% to account for the fact that not all appliances run simultaneously at full load.",
      },
      {
        label: "Step 4: Calculate the recommended breaker size",
        explanation:
          "The calculator computes the adjusted load, applies the 125% continuous load factor, and suggests the next standard breaker size.",
      },
    ],
    result:
      "The calculator recommends a 50 Amp breaker, which safely accommodates the adjusted continuous load with NEC compliance.",
  };

  const references = [
    {
      title: "National Electrical Code (NEC) Article 220",
      description:
        "Official NEC guidelines on load calculations and breaker sizing.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "NEC Table 310.15(B)(16)",
      description:
        "Standard conductor ampacity tables used for sizing conductors and breakers.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Electrical Load Calculations - Mike Holt's Forum",
      description:
        "Discussion and examples of load calculations for residential and commercial applications.",
      url: "https://forums.mikeholt.com",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loadWatts">Total Connected Load (Watts)</Label>
          <Input
            id="loadWatts"
            type="number"
            min={0}
            placeholder="e.g. 7200"
            value={inputs.val1}
            onChange={(e) => handleInputChange("val1", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="voltage">Voltage (Volts)</Label>
          <Input
            id="voltage"
            type="number"
            min={1}
            placeholder="e.g. 120 or 240"
            value={inputs.val2}
            onChange={(e) => handleInputChange("val2", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="demandFactor">Demand Factor (%)</Label>
          <Input
            id="demandFactor"
            type="number"
            min={1}
            max={100}
            placeholder="100"
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
              <>
                <Separator className="my-4" />
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
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
            Enter the total connected load of your electrical system or panel in
            watts (W). This is the sum of all devices and appliances expected to
            be connected.
          </li>
          <li>
            Input the system voltage in volts (V). Common residential voltages are
            120 V or 240 V.
          </li>
          <li>
            Specify the demand factor as a percentage (%). This accounts for the
            likelihood that not all loads operate simultaneously. If unsure,
            leave at 100%.
          </li>
          <li>
            Click the "Calculate" button to get the recommended breaker or panel
            rating in amps (A), based on NEC guidelines.
          </li>
          <li>
            Review the detailed explanation and safety feedback to ensure proper
            application.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Electrical Load Capacity (Breaker/Panel) Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Electrical load capacity calculation is essential for selecting the
            correct breaker or panel size to ensure safety, code compliance, and
            efficient operation. The National Electrical Code (NEC) provides
            guidelines for calculating loads and sizing protective devices.
          </p>
          <p>
            This calculator uses the total connected load in watts, system voltage,
            and an optional demand factor to estimate the continuous load current.
            It then applies a 125% multiplier to account for continuous loads,
            which are loads expected to run for three hours or more. This ensures
            the breaker or panel can handle sustained current without nuisance
            tripping.
          </p>
          <p>
            The recommended breaker size is rounded up to the next standard size
            per NEC tables. This approach balances safety and cost-effectiveness.
            For complex or three-phase systems, additional considerations and
            calculations are necessary.
          </p>
          <p>
            Always verify your calculations with local electrical codes and consult
            a licensed electrician or engineer for final design and installation.
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
            <strong>Warning:</strong> Never undersize breakers or panels based on
            optimistic load assumptions. Undersizing can cause overheating,
            equipment damage, and fire hazards.
          </p>
          <p>
            Avoid neglecting the 125% multiplier for continuous loads; this is a
            critical NEC requirement to ensure safety during sustained operation.
          </p>
          <p>
            Do not use this calculator for three-phase or specialized industrial
            systems without consulting an expert, as the calculations differ
            significantly.
          </p>
          <p>
            Always verify your inputs, especially voltage and demand factor, as
            incorrect values can lead to unsafe or costly sizing.
          </p>
          <p>
            When in doubt, consult a licensed electrician or electrical engineer
            to review your load calculations and breaker sizing.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {example.title}
        </h2>
        <p className="mb-4 text-slate-600 dark:text-slate-400">{example.scenario}</p>
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
      title="Electrical Load Capacity (Breaker/Panel) Calculator"
      description="Professional electrical calculator: Electrical Load Capacity (Breaker/Panel) Calculator. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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