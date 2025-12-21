import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CrinkleCrankleWallBrickSaverCalculator() {
  const [inputs, setInputs] = useState({ straightLength: "", crinkleLength: "" });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const straight = parseFloat(inputs.straightLength);
    const crinkle = parseFloat(inputs.crinkleLength);

    // Initial state safety: if inputs empty or invalid, return neutral state
    if (
      isNaN(straight) ||
      isNaN(crinkle) ||
      straight <= 0 ||
      crinkle <= 0
    ) {
      return { value: null };
    }

    // Calculate bricks saved:
    // Assumption: bricks proportional to length of wall
    // Bricks saved = bricks for straight wall - bricks for crinkle wall
    // Here, user inputs lengths in feet (or any unit, but no unit selector per rules)
    // We just calculate difference in length as bricks saved (assuming 1 brick per unit length)
    // To make it meaningful, let's say bricks per foot = 10 (typical brick length ~8 inches + mortar)
    const bricksPerFoot = 10;

    const bricksStraight = straight * bricksPerFoot;
    const bricksCrinkle = crinkle * bricksPerFoot;
    const bricksSaved = bricksStraight - bricksCrinkle;

    // If crinkle wall is longer, no saving, so zero saved
    const saved = bricksSaved > 0 ? bricksSaved : 0;

    return {
      value: saved.toLocaleString("en-US"),
      label: "Bricks Saved",
      subtext:
        saved > 0
          ? `By building a crinkle crankle wall instead of a straight wall, you save approximately ${saved.toLocaleString(
              "en-US"
            )} bricks.`
          : "No brick savings with the given lengths.",
      color: saved > 0 ? "text-green-600" : "text-gray-600",
      icon: saved > 0 ? <Sparkles className="w-12 h-12 text-green-600 mx-auto" /> : null,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a crinkle crankle wall?",
      answer:
        "A crinkle crankle wall is a wavy or serpentine brick wall design that uses fewer bricks than a straight wall of the same length due to its structural efficiency.",
    },
    {
      question: "Why does a crinkle crankle wall save bricks?",
      answer:
        "The wavy design provides stability and strength, allowing the wall to be thinner and use fewer bricks while maintaining durability.",
    },
    {
      question: "Can I use this calculator for any wall length?",
      answer:
        "Yes, simply input the length of the straight wall and the length of the crinkle crankle wall to estimate brick savings.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="straightLength" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Straight Wall Length (feet)
        </Label>
        <Input
          id="straightLength"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 100"
          value={inputs.straightLength}
          onChange={(e) => handleInputChange("straightLength", e.target.value)}
          aria-describedby="straightLengthHelp"
        />
        <p id="straightLengthHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter the length of the straight wall you want to compare.
        </p>
      </div>

      <div>
        <Label htmlFor="crinkleLength" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Crinkle Crankle Wall Length (feet)
        </Label>
        <Input
          id="crinkleLength"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 85"
          value={inputs.crinkleLength}
          onChange={(e) => handleInputChange("crinkleLength", e.target.value)}
          aria-describedby="crinkleLengthHelp"
        />
        <p id="crinkleLengthHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter the length of the crinkle crankle (wavy) wall.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting state to current inputs
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate bricks saved"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ straightLength: "", crinkleLength: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>{results.value}</p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">{results.label}</p>
            <p className="mt-2 text-sm italic text-slate-500">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Crinkle Crankle Wall Brick Saver
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A crinkle crankle wall is a serpentine or wavy brick wall design that dates back centuries, primarily found in English gardens and estates. Its unique shape provides structural stability, allowing the wall to be thinner and use fewer bricks than a straight wall of the same length. This design not only saves materials but also adds aesthetic appeal and resilience against lateral forces like wind. By calculating the difference in brick usage between straight and crinkle crankle walls, you can optimize your building materials and reduce costs.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The crinkle crankle wall design was popularized in the 18th century by architect William Kent, who used it extensively in the gardens of Chiswick House in London. Its serpentine shape provides natural strength, allowing the wall to be only one brick thick without additional buttressing.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate how many bricks you can save by building a crinkle crankle wall, enter the length of the straight wall you would have built and the length of the crinkle crankle wall you plan to construct. The calculator assumes a typical brick density per foot of wall length and computes the difference in bricks required. This helps you understand the material savings and cost benefits of choosing the wavy design over a conventional straight wall.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-lg text-slate-900 dark:text-slate-100">{question}</dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.britannica.com/technology/crinkle-crankle-wall"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Crinkle Crankle Wall - Britannica <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An overview of the crinkle crankle wall's history and structural benefits.
            </p>
          </li>
          <li>
            <a
              href="https://www.chiswickw4.com/default.asp?section=info&page=conservationchiswickhouse"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Chiswick House Gardens - History <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Details on William Kent's use of crinkle crankle walls in garden architecture.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Crinkle Crankle Wall Brick Saver"
      description="Optimize brick usage. Calculate how many bricks you save by building a wavy 'crinkle crankle' wall instead of a straight one."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Bricks Saved = (Straight Wall Length − Crinkle Crankle Wall Length) × Bricks per Foot",
        variables: [
          { symbol: "Straight Wall Length", description: "Length of the straight wall in feet" },
          { symbol: "Crinkle Crankle Wall Length", description: "Length of the wavy crinkle crankle wall in feet" },
          { symbol: "Bricks per Foot", description: "Number of bricks required per foot of wall length" },
          { symbol: "Bricks Saved", description: "Estimated number of bricks saved by using the crinkle crankle design" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You plan to build a 100-foot straight wall but consider a crinkle crankle wall that is 85 feet long due to its wavy design.",
        steps: [
          {
            label: "1",
            explanation:
              "Enter 100 feet as the straight wall length and 85 feet as the crinkle crankle wall length.",
          },
          {
            label: "2",
            explanation:
              "The calculator multiplies the difference (15 feet) by the bricks per foot (10) to find bricks saved.",
          },
          {
            label: "3",
            explanation: "Result: 150 bricks saved by choosing the crinkle crankle wall design.",
          },
        ],
        result: "150 bricks saved",
      }}
      relatedCalculators={[
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
        { title: "Coffee Addiction Meter", url: "/funny/coffee-addiction-meter", icon: "☕" },
        { title: "Time Travel Energy Requirement", url: "/funny/time-travel-energy-requirement", icon: "✈️" },
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}