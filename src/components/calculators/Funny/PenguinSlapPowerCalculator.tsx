import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Lightbulb, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PenguinSlapPowerCalculator() {
  /**
   * Inputs:
   * - Mass of penguin (kg)
   * - Velocity of slap (m/s)
   * 
   * Formula:
   * Kinetic Energy = 0.5 * mass * velocity^2
   * This estimates the slap power in Joules.
   */

  const [inputs, setInputs] = useState({ mass: "", velocity: "" });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const mass = parseFloat(inputs.mass);
    const velocity = parseFloat(inputs.velocity);

    // Initial state safety: if inputs empty or invalid, return neutral state
    if (
      isNaN(mass) || mass <= 0 ||
      isNaN(velocity) || velocity <= 0
    ) {
      return { value: null };
    }

    // Calculate kinetic energy in Joules
    const energy = 0.5 * mass * velocity * velocity;

    // Format energy with commas and unit J (Joules)
    const formattedEnergy = energy.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    }) + " J";

    // Color coding based on energy magnitude (fun, arbitrary)
    let color = "text-green-600";
    let icon = <Smile />;
    if (energy > 1000) {
      color = "text-red-600";
      icon = <Smile />;
    } else if (energy < 10) {
      color = "text-yellow-600";
      icon = <Smile />;
    }

    return {
      value: formattedEnergy,
      label: "Penguin Slap Power",
      subtext: "Estimated kinetic energy delivered by the slap",
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Is this calculator meant to be taken seriously?",
      answer:
        "No, this calculator is purely hypothetical and for entertainment purposes only. It estimates the kinetic energy of a slap on a penguin, which is a fictional scenario.",
    },
    {
      question: "Why use kinetic energy to measure slap power?",
      answer:
        "Kinetic energy is a physical quantity representing the energy an object possesses due to its motion. It’s a good proxy to estimate the power behind a slap based on mass and velocity.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="mass">Mass of the Penguin (kg)</Label>
          <Input
            id="mass"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 15"
            value={inputs.mass}
            onChange={(e) => handleInputChange("mass", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="velocity">Velocity of Slap (m/s)</Label>
          <Input
            id="velocity"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 10"
            value={inputs.velocity}
            onChange={(e) => handleInputChange("velocity", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No calculation needed here because results are memoized on input change
            // Just force re-render by setting inputs to current values (noop)
            setInputs((p) => ({ ...p }));
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mass: "", velocity: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-slate-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              {results.label}
            </p>
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
          Understanding Penguin Slap Power Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Penguin Slap Power Calculator estimates the kinetic energy delivered by a slap on a penguin, using the mass of the penguin and the velocity of the slap. This is a playful way to explore physics concepts like kinetic energy in a fun and hypothetical context. The calculation is based on the classical physics formula for kinetic energy, which is half the mass times the velocity squared. While the scenario is fictional, it helps illustrate how energy transfer works in motion.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Penguins can reach swimming speeds up to 15 miles per hour (24 km/h), but their body mass varies widely depending on species, ranging from about 1 kg to over 40 kg. This calculator uses mass and slap velocity to estimate energy, showing how physics applies even in whimsical scenarios.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use the Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Penguin Slap Power Calculator, enter the mass of the penguin in kilograms and the velocity of the slap in meters per second. Both inputs must be positive numbers. After entering the values, click the Calculate button to see the estimated kinetic energy of the slap in Joules. You can reset the inputs anytime using the Reset button to start fresh.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-1">{answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Kinetic_energy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Kinetic Energy - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm mt-1">
              Comprehensive explanation of kinetic energy and its applications in physics.
            </p>
          </li>
          <li>
            <a
              href="https://www.nationalgeographic.com/animals/article/penguins"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Penguin Facts - National Geographic <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm mt-1">
              Detailed information about penguin species, behavior, and physical characteristics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Penguin Slap Power Calculator"
      description="Calculate slap physics. Estimate the thermodynamic energy converted if you theoretically slapped a penguin (strictly hypothetical)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "E = ½ × m × v²",
        variables: [
          { symbol: "E", description: "Kinetic energy delivered by the slap (Joules)" },
          { symbol: "m", description: "Mass of the penguin (kilograms)" },
          { symbol: "v", description: "Velocity of the slap (meters per second)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Suppose you slap a penguin weighing 15 kg with a velocity of 10 m/s. How much energy is delivered?",
        steps: [
          {
            label: "1",
            explanation: "Calculate kinetic energy using E = ½ × m × v²",
          },
          {
            label: "2",
            explanation: "Plug in values: E = 0.5 × 15 × 10² = 0.5 × 15 × 100 = 750 Joules",
          },
        ],
        result: "The slap delivers 750 Joules of kinetic energy.",
      }}
      relatedCalculators={[
        { title: "First-Date Awkwardness Meter", url: "/funny/first-date-awkwardness-meter", icon: "❤️" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Drake Equation Calculator", url: "/funny/drake-equation-calculator", icon: "🤪" },
        { title: "Coffee Addiction Meter", url: "/funny/coffee-addiction-meter", icon: "☕" },
        { title: "Black Hole Sun Impact Calculator", url: "/funny/black-hole-sun-impact", icon: "🧟" },
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
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