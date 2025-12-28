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

export default function LumensToWattsCalculator() {
  const [inputs, setInputs] = useState({
    lumens: "",
    efficacy: "15", // default efficacy in lumens per watt (typical incandescent)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * General formula:
   * Watts = Lumens / Lumens per Watt (efficacy)
   *
   * Typical efficacy values (lm/W):
   * - Incandescent: ~15
   * - Halogen: ~18
   * - CFL: ~60
   * - LED: ~90-120
   * - Fluorescent: ~50-100
   *
   * User can input efficacy or use default.
   */

  const results = useMemo(() => {
    const lumensNum = parseFloat(inputs.lumens);
    const efficacyNum = parseFloat(inputs.efficacy);

    if (
      isNaN(lumensNum) ||
      lumensNum <= 0 ||
      isNaN(efficacyNum) ||
      efficacyNum <= 0
    ) {
      return {
        primary: "—",
        secondary: "Watts",
        details:
          "Please enter valid positive numbers for lumens and efficacy (lumens per watt).",
        feedback: "",
      };
    }

    const watts = lumensNum / efficacyNum;

    return {
      primary: watts.toFixed(2),
      secondary: "Watts",
      details: `Calculated using efficacy of ${efficacyNum} lumens per watt.`,
      feedback: "",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between lumens and watts?",
      answer:
        "Lumens measure the amount of visible light emitted by a source, indicating brightness, while watts measure the electrical power consumption of the light source. Higher lumens mean brighter light, whereas watts indicate energy usage. Modern lighting technologies like LEDs produce more lumens per watt, making them more efficient.",
    },
    {
      question: "Why do I need to input efficacy (lumens per watt)?",
      answer:
        "Efficacy varies by lighting technology and determines how efficiently electrical power is converted into visible light. By inputting the efficacy, the calculator can accurately convert lumens (brightness) into watts (power consumption) for your specific light type, ensuring precise results.",
    },
    {
      question: "Can I use this calculator for all types of bulbs?",
      answer:
        "Yes, but you should input the correct efficacy value for the bulb type you are using. For example, incandescent bulbs have lower efficacy (~15 lm/W), while LEDs have much higher efficacy (90-120 lm/W). Using the correct efficacy ensures accurate wattage estimation.",
    },
    {
      question: "What if I don’t know the efficacy of my bulb?",
      answer:
        "If you don’t know the exact efficacy, you can use typical average values based on bulb type. For example, incandescent bulbs ~15 lm/W, CFLs ~60 lm/W, LEDs ~100 lm/W. This will give you a reasonable estimate of wattage from lumens.",
    },
    {
      question: "Is this calculator compliant with NEC standards?",
      answer:
        "This calculator provides general electrical conversions and guidance. While it helps estimate power consumption, always consult the National Electrical Code (NEC) and local regulations for wiring, load calculations, and safety compliance in lighting installations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const example = {
    title: "Real World Example",
    scenario:
      "You want to replace a 60W incandescent bulb with an LED bulb that produces the same brightness (lumens). You know the incandescent bulb produces about 800 lumens, and the LED efficacy is about 100 lumens per watt.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Enter the brightness in lumens: 800 lumens (equivalent to the incandescent bulb).",
      },
      {
        label: "Step 2",
        explanation:
          "Enter the efficacy of the LED bulb: 100 lumens per watt (typical LED efficacy).",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate watts: 800 lumens ÷ 100 lm/W = 8 watts. The LED bulb uses only 8 watts to produce the same brightness.",
      },
    ],
    result:
      "The LED bulb will consume approximately 8 watts, significantly less than the 60 watts of the incandescent bulb, saving energy and cost.",
  };

  const references = [
    {
      title: "National Electrical Code (NEC)",
      description:
        "The NEC provides guidelines and standards for electrical wiring and installations, including lighting circuits.",
      url: "https://www.nfpa.org/nec",
    },
    {
      title: "Lighting Facts - Lumens and Watts",
      description:
        "A resource explaining the relationship between lumens and watts and how to choose energy-efficient lighting.",
      url: "https://www.lightingfacts.com/understanding-lumens-and-watts",
    },
    {
      title: "DOE Lighting Efficacy Standards",
      description:
        "U.S. Department of Energy standards and information on lighting efficacy for various bulb types.",
      url: "https://www.energy.gov/eere/ssl/lighting-standards-and-test-procedures",
    },
  ];

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lumens">Brightness (Lumens)</Label>
          <Input
            id="lumens"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 800"
            value={inputs.lumens}
            onChange={(e) => handleInputChange("lumens", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="efficacy">
            Efficacy (Lumens per Watt){" "}
            <Lightbulb className="inline w-4 h-4 text-yellow-500" />
          </Label>
          <Input
            id="efficacy"
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 15 (incandescent), 100 (LED)"
            value={inputs.efficacy}
            onChange={(e) => handleInputChange("efficacy", e.target.value)}
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
            Enter the brightness of the light source in lumens. This value
            represents the total visible light output.
          </li>
          <li>
            Enter the efficacy of the light source in lumens per watt (lm/W).
            This value indicates how efficiently the bulb converts electrical
            power into visible light. Typical values vary by bulb type.
          </li>
          <li>
            Click the "Calculate" button to compute the estimated wattage
            required to produce the entered lumens at the given efficacy.
          </li>
          <li>
            Review the result displayed below the button, which shows the
            estimated power consumption in watts.
          </li>
          <li>
            Use this information to compare different lighting options or plan
            electrical loads.
          </li>
        </ol>
      </section>

      <section id="guide">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <BookOpen className="w-6 h-6 text-blue-500" />
          Complete Guide to Lighting Lumens-to-Watts Converter
        </h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Lighting is commonly measured in two key units: lumens and watts.
            Lumens quantify the brightness or luminous flux emitted by a light
            source, while watts measure the electrical power consumed. The
            relationship between these units depends on the efficacy of the
            lighting technology, expressed as lumens per watt (lm/W).
          </p>
          <p>
            Different lighting technologies have varying efficacies. For
            example, traditional incandescent bulbs typically produce about 15
            lumens per watt, while modern LED bulbs can produce 90 to 120
            lumens per watt or more. This means LEDs produce more light for the
            same amount of power, making them more energy-efficient.
          </p>
          <p>
            This calculator helps convert a desired brightness level (lumens)
            into the estimated power consumption (watts) based on the efficacy
            you provide. This is useful for selecting energy-efficient bulbs,
            estimating electrical loads, and planning lighting installations.
          </p>
          <p>
            Always consider the efficacy specific to your bulb type for accurate
            results. If unsure, use typical average values for common bulb
            types. Remember that actual efficacy can vary by manufacturer and
            model.
          </p>
          <p>
            For electrical safety and compliance, consult the National
            Electrical Code (NEC) and local regulations when designing or
            modifying lighting circuits.
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
            <strong>Warning:</strong> Always ensure you input positive numeric
            values for both lumens and efficacy. Negative or zero values will
            produce invalid results.
          </p>
          <p>
            Do not confuse lumens with watts. Lumens measure brightness, watts
            measure power consumption. Using incorrect values can lead to
            improper load calculations and unsafe electrical designs.
          </p>
          <p>
            Using an incorrect efficacy value can significantly skew your
            wattage estimate. Always use the efficacy specific to your bulb
            type or consult manufacturer specifications.
          </p>
          <p>
            This calculator provides estimates only. For electrical wiring,
            load calculations, and safety compliance, always follow NEC codes
            and consult a licensed electrician.
          </p>
          <p>
            Avoid exceeding the rated wattage of fixtures and circuits to prevent
            overheating and fire hazards.
          </p>
        </div>
      </section>

      <section id="example" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          {example.title}
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">{example.scenario}</p>
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
      title="Lighting Lumens-to-Watts Converter"
      description="Professional electrical calculator: Lighting Lumens-to-Watts Converter. Accurate engineering formulas, NEC compliance tips, and safety guidelines."
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