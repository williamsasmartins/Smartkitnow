import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink, Coffee, Skull } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DeathByCaffeineCalculator() {
  const [inputs, setInputs] = useState({ weight: "" });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * - Median lethal dose (LD50) of caffeine is about 150-200 mg per kg of body weight.
   * - We'll use 190 mg/kg as a safe average lethal dose.
   * - Input: weight in kg.
   * - Output: max safe intake in mg caffeine before lethal dose.
   * - Also convert to approximate cups of coffee (1 cup ~ 95 mg caffeine).
   */
  const results = useMemo(() => {
    const weightKg = parseFloat(inputs.weight);
    if (!inputs.weight || isNaN(weightKg) || weightKg <= 0) {
      return { value: null };
    }

    const lethalDoseMgPerKg = 190; // mg per kg body weight
    const lethalDoseMg = lethalDoseMgPerKg * weightKg;

    // Approximate caffeine per cup of coffee
    const caffeinePerCupMg = 95;

    const cups = lethalDoseMg / caffeinePerCupMg;

    return {
      value: lethalDoseMg.toLocaleString("en-US") + " mg",
      label: "Estimated Lethal Dose of Caffeine",
      subtext: `Approximately ${cups.toFixed(1)} cups of coffee (95 mg caffeine each)`,
      color: "text-red-600",
      icon: <Skull className="mx-auto h-12 w-12 text-red-600" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Is caffeine lethal at low doses?",
      answer:
        "No, caffeine is generally safe at moderate doses. Lethal doses are extremely high and rarely reached through normal consumption.",
    },
    {
      question: "Does body weight affect caffeine toxicity?",
      answer:
        "Yes, heavier individuals generally tolerate higher amounts of caffeine before reaching toxic levels, as lethal dose scales with body weight.",
    },
    {
      question: "Can caffeine overdose happen from coffee alone?",
      answer:
        "It is unlikely to overdose on caffeine from coffee alone due to volume limits, but caffeine pills or powders can be dangerous if misused.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="weight" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Your Body Weight (kg)
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder="e.g. 70"
          value={inputs.weight}
          onChange={(e) => handleInputChange("weight", e.target.value)}
          aria-describedby="weight-help"
        />
        <p id="weight-help" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your weight in kilograms to estimate your lethal caffeine dose.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger recalculation by setting inputs again (no extra logic needed)
            setInputs((p) => ({ ...p }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate lethal caffeine dose"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
          className="flex-1 h-11"
          aria-label="Reset input"
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Death by Caffeine (Max Safe Intake)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Caffeine is a widely consumed stimulant found in coffee, tea, energy drinks, and many medications. While moderate caffeine intake is generally safe and can improve alertness and focus, extremely high doses can be toxic and potentially fatal. The lethal dose of caffeine varies depending on body weight, metabolism, and individual sensitivity, but it is typically estimated around 150-200 mg per kilogram of body weight. Knowing your approximate lethal dose can help you understand safe consumption limits and avoid dangerous overdoses.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The average cup of brewed coffee contains about 95 mg of caffeine, but some espresso shots can have up to 150 mg. Despite caffeine's stimulating effects, consuming more than 10 grams at once can be fatal, which would require drinking roughly 100 cups of coffee in a short period.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter your body weight in kilograms into the input field above and click "Calculate." The calculator will estimate the approximate lethal dose of caffeine for your weight, expressed in milligrams and equivalent cups of coffee. This is a theoretical value and should not be used as a target or goal for caffeine consumption. Always consume caffeine responsibly and consult a healthcare professional if you have concerns about your intake.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside space-y-4 text-slate-700 dark:text-slate-300">
          {faqs.map(({ question, answer }, i) => (
            <li key={i}>
              <strong>{question}</strong>
              <p className="mt-1">{answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3777296/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Caffeine Toxicity and Lethal Dose - NCBI <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive review of caffeine toxicity and lethal dose estimates from the National Center for Biotechnology Information.
            </p>
          </li>
          <li>
            <a
              href="https://www.fda.gov/food/food-additives-petitions/caffeine"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FDA on Caffeine Safety <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official information from the U.S. Food and Drug Administration regarding caffeine safety and regulations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Death by Caffeine (Max Safe Intake)"
      description="Calculate your caffeine limit. Find out exactly how many cups of coffee would be lethal (so you can stop safely before that)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Lethal Dose (mg) = Body Weight (kg) × 190 mg/kg",
        variables: [
          { symbol: "Lethal Dose (mg)", description: "Estimated lethal caffeine dose in milligrams" },
          { symbol: "Body Weight (kg)", description: "Your body weight in kilograms" },
          { symbol: "190 mg/kg", description: "Average lethal dose of caffeine per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate lethal caffeine dose for a person weighing 70 kg.",
        steps: [
          { label: "1", explanation: "Multiply 70 kg by 190 mg/kg." },
          { label: "2", explanation: "70 × 190 = 13,300 mg caffeine." },
          { label: "3", explanation: "This equals about 140 cups of coffee (13,300 ÷ 95 mg per cup)." },
        ],
        result: "The estimated lethal dose is 13,300 mg caffeine, roughly 140 cups of coffee.",
      }}
      relatedCalculators={[
        { title: "Coffee Strength vs Productivity Score", url: "/funny/coffee-strength-vs-productivity-meme", icon: "☕" },
        { title: "Zombie Survival Calculator", url: "/funny/zombie-survival-calculator", icon: "🧟" },
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
        { title: "Tab Overload Anxiety Score", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
        { title: "Black Hole Sun Impact Calculator", url: "/funny/black-hole-sun-impact", icon: "🧟" },
        { title: "Pizza Slices per Person & Regret Index", url: "/funny/pizza-slices-per-person-regret-index", icon: "🍕" },
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