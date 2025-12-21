import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Cat, Lightbulb, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatIgnoreOMeterCalculator() {
  // Inputs: catAttentionLevel (1-10), yourCallingEffort (1-10), catMood (1-10)
  const [inputs, setInputs] = useState({
    catAttentionLevel: "",
    yourCallingEffort: "",
    catMood: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and empty string
    if (/^\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const catAttentionLevel = Number(inputs.catAttentionLevel);
    const yourCallingEffort = Number(inputs.yourCallingEffort);
    const catMood = Number(inputs.catMood);

    // Initial state safety: if any input is empty or out of range, return neutral state
    if (
      !catAttentionLevel ||
      !yourCallingEffort ||
      !catMood ||
      catAttentionLevel < 1 ||
      catAttentionLevel > 10 ||
      yourCallingEffort < 1 ||
      yourCallingEffort > 10 ||
      catMood < 1 ||
      catMood > 10
    ) {
      return { value: null };
    }

    // Formula:
    // Ignore-o-Meter Score = 100 - ((catAttentionLevel * 0.4 + yourCallingEffort * 0.3 + catMood * 0.3) * 10)
    // Score from 0 (no ignoring) to 100 (full ignore)
    const weightedSum = catAttentionLevel * 0.4 + yourCallingEffort * 0.3 + catMood * 0.3;
    let ignoreScore = 100 - weightedSum * 10;

    // Clamp between 0 and 100
    ignoreScore = Math.min(Math.max(ignoreScore, 0), 100);

    // Determine label, color, icon based on ignoreScore
    let label = "";
    let subtext = "";
    let color = "";
    let icon = null;

    if (ignoreScore >= 75) {
      label = "Cat is Ignoring You Completely";
      subtext = "Your cat is in full ignore mode. Try again later or offer treats!";
      color = "text-red-600";
      icon = <Frown className="mx-auto w-12 h-12" />;
    } else if (ignoreScore >= 40) {
      label = "Cat is Partially Ignoring You";
      subtext = "Your cat acknowledges you but remains mostly indifferent.";
      color = "text-yellow-600";
      icon = <Meh className="mx-auto w-12 h-12" />;
    } else {
      label = "Cat is Paying Attention";
      subtext = "Your cat is likely to respond when you call its name.";
      color = "text-green-600";
      icon = <Smile className="mx-auto w-12 h-12" />;
    }

    return {
      value: `${ignoreScore.toFixed(0)}%`,
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why does my cat ignore me sometimes?",
      answer:
        "Cats are independent animals and may ignore calls when they are distracted, sleepy, or simply not in the mood. Their attention varies based on mood, environment, and previous interactions.",
    },
    {
      question: "Can I train my cat to respond better?",
      answer:
        "Yes, positive reinforcement with treats and gentle calling can improve your cat's responsiveness over time. Patience and consistency are key.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="catAttentionLevel">Cat's Attention Level (1-10)</Label>
          <Input
            id="catAttentionLevel"
            type="number"
            min={1}
            max={10}
            placeholder="Enter a value from 1 to 10"
            value={inputs.catAttentionLevel}
            onChange={(e) => handleInputChange("catAttentionLevel", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="yourCallingEffort">Your Calling Effort (1-10)</Label>
          <Input
            id="yourCallingEffort"
            type="number"
            min={1}
            max={10}
            placeholder="Enter a value from 1 to 10"
            value={inputs.yourCallingEffort}
            onChange={(e) => handleInputChange("yourCallingEffort", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="catMood">Cat's Current Mood (1-10)</Label>
          <Input
            id="catMood"
            type="number"
            min={1}
            max={10}
            placeholder="Enter a value from 1 to 10"
            value={inputs.catMood}
            onChange={(e) => handleInputChange("catMood", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, results update automatically
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              catAttentionLevel: "",
              yourCallingEffort: "",
              catMood: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Cat 'Ignore-o-Meter'</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Cat 'Ignore-o-Meter' is a playful way to estimate how likely your cat is to ignore you when you call its name. Cats are known for their independent nature and selective attention, which can sometimes feel like they are deliberately ignoring us. This calculator combines factors such as your cat's current attention level, your effort in calling, and your cat's mood to predict the probability of being ignored. It helps cat owners understand and appreciate their feline friends' unique personalities.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Cats have a unique way of communicating with humans and often ignore calls because they don’t perceive them as urgent. Interestingly, cats can recognize their own names but choose to respond only when they feel like it or when there is a reward involved.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cat 'Ignore-o-Meter'</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, simply input three values between 1 and 10: your cat's current attention level, how much effort you put into calling your cat, and your cat's current mood. These inputs reflect the dynamic nature of your cat’s behavior. After entering the values, click "Calculate" to see the likelihood that your cat will ignore you. Use the results to better understand your cat’s behavior and adjust your approach accordingly.
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
              href="https://www.petmd.com/cat/behavior/why-do-cats-ignore-you"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Why Do Cats Ignore You? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm mt-1">PetMD article explaining cat behavior and attention patterns.</p>
          </li>
          <li>
            <a
              href="https://www.sciencedaily.com/releases/2019/03/190312101234.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Cats Recognize Their Names <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm mt-1">Scientific study showing cats can recognize their own names.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat 'Ignore-o-Meter'"
      description="Predict cat acknowledgement. Calculate the extremely low probability that your cat will actually respond when you call its name."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Ignore-o-Meter Score = 100 - ((Attention × 0.4 + Effort × 0.3 + Mood × 0.3) × 10)",
        variables: [
          { symbol: "Attention", description: "Cat's current attention level (1-10)" },
          { symbol: "Effort", description: "Your calling effort (1-10)" },
          { symbol: "Mood", description: "Cat's current mood (1-10)" },
          { symbol: "Ignore-o-Meter Score", description: "Probability your cat will ignore you (%)" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "If your cat's attention level is 3, your calling effort is 7, and your cat's mood is 4, the calculator estimates how likely your cat is to ignore you.",
        steps: [
          {
            label: "1",
            explanation: "Multiply each input by its weight: (3 × 0.4) + (7 × 0.3) + (4 × 0.3) = 1.2 + 2.1 + 1.2 = 4.5",
          },
          {
            label: "2",
            explanation: "Multiply the sum by 10: 4.5 × 10 = 45",
          },
          {
            label: "3",
            explanation: "Subtract from 100 to get the ignore score: 100 - 45 = 55%",
          },
        ],
        result: "Your cat has a 55% chance of ignoring you at this moment.",
      }}
      relatedCalculators={[
        { title: "Medical Tourism Cost Saver", url: "/funny/medical-tourism-cost-saver", icon: "🤪" },
        { title: "Cost to Send This Email (Energy/kWh)", url: "/funny/email-cost-estimator-energy", icon: "💻" },
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
        { title: "Keyboard Clicks per Day Estimator", url: "/funny/keyboard-clicks-per-day", icon: "💻" },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🤪" },
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