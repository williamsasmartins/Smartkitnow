import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function TimeTravelEnergyRequirementCalculator() {
  // Inputs: mass (kg), timeTravelSeconds (seconds to go back in time)
  const [inputs, setInputs] = useState({ mass: "", timeTravelSeconds: "" });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  /**
   * Theoretical formula for energy required for time travel (simplified sci-fi):
   * 
   * E = m × c² × (Δt / t₀)
   * 
   * Where:
   * - E = Energy required (Joules)
   * - m = Mass of traveler (kg)
   * - c = Speed of light (≈ 3×10^8 m/s)
   * - Δt = Time displacement backward (seconds)
   * - t₀ = Reference time unit (1 second)
   * 
   * This formula assumes energy scales linearly with mass and time displacement,
   * multiplied by rest energy (E=mc²).
   * 
   * We convert Joules to kilowatt-hours (kWh) for more relatable energy units:
   * 1 kWh = 3.6 × 10^6 Joules
   */

  const results = useMemo(() => {
    const mass = parseFloat(inputs.mass);
    const timeTravelSeconds = parseFloat(inputs.timeTravelSeconds);

    if (
      isNaN(mass) ||
      isNaN(timeTravelSeconds) ||
      mass <= 0 ||
      timeTravelSeconds <= 0
    ) {
      // Neutral state on empty or invalid inputs
      return { value: null };
    }

    const c = 3e8; // speed of light in m/s
    const restEnergyJoules = mass * c * c; // E=mc² in Joules
    const energyJoules = restEnergyJoules * timeTravelSeconds; // scale by time displacement
    const energyKWh = energyJoules / 3.6e6; // convert Joules to kWh

    // Format output with commas and 2 decimals
    const formattedEnergy = energyKWh.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return {
      value: `${formattedEnergy} kWh`,
      label: "Estimated Energy Required",
      subtext:
        "Energy needed to travel back in time for the given mass and duration based on theoretical physics.",
      color: "text-purple-700",
      icon: <Sparkles className="mx-auto h-12 w-12 text-purple-600" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Is time travel energy requirement scientifically proven?",
      answer:
        "No, the concept of time travel and its energy requirements remain theoretical and speculative. Current physics does not support practical time travel, but such calculations help explore sci-fi concepts.",
    },
    {
      question: "Why is mass important in calculating energy for time travel?",
      answer:
        "Mass determines the rest energy (E=mc²) of an object. The heavier the object, the more energy theoretically required to manipulate spacetime for time travel.",
    },
    {
      question: "Can this calculator be used for forward time travel?",
      answer:
        "This calculator estimates energy for backward time travel displacement. Forward time travel involves different relativistic effects and is not covered here.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="mass" className="mb-1 block font-semibold">
          Mass of Traveler (kg)
        </Label>
        <Input
          id="mass"
          type="text"
          placeholder="e.g. 70"
          value={inputs.mass}
          onChange={(e) => handleInputChange("mass", e.target.value)}
          inputMode="decimal"
          aria-describedby="mass-desc"
        />
        <p id="mass-desc" className="text-sm text-slate-500 mt-1">
          Enter the mass of the traveler in kilograms.
        </p>
      </div>

      <div>
        <Label htmlFor="timeTravelSeconds" className="mb-1 block font-semibold">
          Time Displacement (seconds)
        </Label>
        <Input
          id="timeTravelSeconds"
          type="text"
          placeholder="e.g. 3600"
          value={inputs.timeTravelSeconds}
          onChange={(e) => handleInputChange("timeTravelSeconds", e.target.value)}
          inputMode="decimal"
          aria-describedby="time-desc"
        />
        <p id="time-desc" className="text-sm text-slate-500 mt-1">
          Enter how many seconds back in time you want to travel.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-purple-700 hover:bg-purple-800 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation, inputs already update state
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ mass: "", timeTravelSeconds: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-950 border-purple-200 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">{results.icon}</div>
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-300">
              {results.label}
            </p>
            <p className="mt-2 text-sm italic text-slate-500 dark:text-slate-400">
              {results.subtext}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Time Travel Energy Requirement
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Time travel remains a fascinating concept in science fiction and theoretical physics. The immense energy required to manipulate spacetime and move backward in time is often compared to the rest energy of matter, given by Einstein's famous equation E=mc². This calculator estimates the theoretical energy needed based on the traveler's mass and the duration of time displacement. While purely speculative, it offers insight into the scale of energy involved in such hypothetical scenarios.
        </p>

        <div className="bg-purple-50 dark:bg-purple-950/30 p-6 rounded-xl border border-purple-100 dark:border-purple-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The concept of rest energy (E=mc²) means that even a small amount of mass contains an enormous amount of energy. For example, converting just 1 gram of matter completely into energy would release about 90 terajoules, enough to power a city for days.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the mass of the traveler in kilograms and the number of seconds you wish to travel back in time. Press the calculate button to see the estimated energy requirement in kilowatt-hours. This helps visualize the vast energy scales involved in theoretical time travel. Use the reset button to clear inputs and start over.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                {question}
              </dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                {answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Time_travel"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              Time Travel - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm mt-1">
              Comprehensive overview of time travel concepts in physics and fiction.
            </p>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Mass%E2%80%93energy_equivalence"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-purple-700 hover:underline flex items-center gap-1"
            >
              Mass–energy equivalence - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm mt-1">
              Explanation of Einstein's equation E=mc² and its implications.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Time Travel Energy Requirement"
      description="Sci-fi physics. Estimate the immense energy required to travel back in time based on theoretical warp drive metrics."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "E = m × c² × Δt",
        variables: [
          { symbol: "E", description: "Energy required for time travel (Joules)" },
          { symbol: "m", description: "Mass of the traveler (kg)" },
          { symbol: "c", description: "Speed of light (≈ 3×10⁸ m/s)" },
          { symbol: "Δt", description: "Time displacement backward (seconds)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate the energy required for a 70 kg traveler to go back 1 hour (3600 seconds) in time.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate rest energy: E = 70 × (3×10⁸)² = 6.3×10¹⁸ Joules.",
          },
          {
            label: "2",
            explanation:
              "Multiply by time displacement: 6.3×10¹⁸ × 3600 = 2.268×10²² Joules.",
          },
          {
            label: "3",
            explanation:
              "Convert to kWh: 2.268×10²² / 3.6×10⁶ ≈ 6.3×10¹⁵ kWh.",
          },
        ],
        result:
          "The traveler would theoretically require approximately 6.3 quadrillion kWh of energy.",
      }}
      relatedCalculators={[
        {
          title: "Netflix 'Just One More Episode' Timer",
          url: "/funny/netflix-one-more-episode-timer",
          icon: "🤪",
        },
        {
          title: "Social Media Time Alternatives",
          url: "/funny/social-media-time-alternatives",
          icon: "🤪",
        },
        {
          title: "Death by Caffeine (Max Safe Intake)",
          url: "/funny/death-by-caffeine",
          icon: "☕",
        },
        {
          title: "Meme Virality Calculator",
          url: "/funny/meme-virality-calculator",
          icon: "🤪",
        },
        {
          title: "Pokémon GO Weight Loss Calculator",
          url: "/funny/pokemon-go-weight-loss",
          icon: "🤪",
        },
        {
          title: "Pizza Size/Price Comparison Calculator",
          url: "/funny/pizza-size-price-comparison",
          icon: "🍕",
        },
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