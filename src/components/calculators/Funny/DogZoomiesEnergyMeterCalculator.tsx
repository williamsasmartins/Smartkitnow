import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, Lightbulb, ExternalLink, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogZoomiesEnergyMeterCalculator() {
  // Inputs: speed in mph, destruction level 1-10 scale
  const [inputs, setInputs] = useState({ speed: "", destruction: "" });
  const handleInputChange = useCallback((n, v) => {
    // Allow only numbers and decimals for speed, integers 1-10 for destruction
    if (n === "speed") {
      if (v === "" || /^\d*\.?\d*$/.test(v)) setInputs((p) => ({ ...p, [n]: v }));
    } else if (n === "destruction") {
      if (v === "" || (/^\d+$/.test(v) && +v >= 1 && +v <= 10)) setInputs((p) => ({ ...p, [n]: v }));
    }
  }, []);

  const results = useMemo(() => {
    const speed = parseFloat(inputs.speed);
    const destruction = parseInt(inputs.destruction);

    // Initial state safety: if inputs empty or invalid, return neutral state
    if (
      isNaN(speed) ||
      speed <= 0 ||
      isNaN(destruction) ||
      destruction < 1 ||
      destruction > 10
    ) {
      return { value: null };
    }

    // Formula: Energy Release Score = speed (mph) * destruction level * 10
    // The multiplier 10 is arbitrary to scale the number nicely.
    const energyScore = speed * destruction * 10;

    // Label and subtext based on score ranges
    let label = "";
    let subtext = "";
    let color = "";
    let icon = <Dog className="mx-auto" size={48} />;

    if (energyScore < 200) {
      label = "Low Zoomies Energy";
      subtext = "Your dog’s zoomies are gentle and playful.";
      color = "text-green-600";
      icon = <Dog size={48} className="mx-auto text-green-600" />;
    } else if (energyScore < 500) {
      label = "Moderate Zoomies Energy";
      subtext = "Expect some wild bursts but manageable fun.";
      color = "text-yellow-600";
      icon = <Dog size={48} className="mx-auto text-yellow-600" />;
    } else if (energyScore < 900) {
      label = "High Zoomies Energy";
      subtext = "Prepare for a fast and chaotic zoom session!";
      color = "text-orange-600";
      icon = <Dog size={48} className="mx-auto text-orange-600" />;
    } else {
      label = "Extreme Zoomies Energy";
      subtext = "Your dog is a zoomies tornado! Safety first.";
      color = "text-red-600";
      icon = <Dog size={48} className="mx-auto text-red-600" />;
    }

    // Format value with commas and one decimal place
    const formattedValue = energyScore.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

    return { value: formattedValue, label, subtext, color, icon };
  }, [inputs]);

  const faqs = [
    {
      question: "What causes dog zoomies?",
      answer:
        "Dog zoomies, or Frenetic Random Activity Periods (FRAPs), are bursts of energy often triggered by excitement, stress relief, or simply happiness. They help dogs release pent-up energy and maintain mental and physical health.",
    },
    {
      question: "Is it safe for dogs to have zoomies?",
      answer:
        "Generally, zoomies are safe and normal behavior. However, ensure your dog has a safe environment free of hazards to prevent injuries during these energetic bursts.",
    },
    {
      question: "How can I manage my dog's zoomies?",
      answer:
        "Regular exercise, mental stimulation, and scheduled playtime can help manage zoomies. Providing a safe space for your dog to run freely also helps them release energy safely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="speed" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Dog's Speed During Zoomies (mph)
        </Label>
        <Input
          id="speed"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 15"
          value={inputs.speed}
          onChange={(e) => handleInputChange("speed", e.target.value)}
          aria-describedby="speed-desc"
        />
        <p id="speed-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your dog's estimated running speed during zoomies in miles per hour.
        </p>
      </div>

      <div>
        <Label htmlFor="destruction" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Destruction Level (1-10)
        </Label>
        <Input
          id="destruction"
          type="text"
          inputMode="numeric"
          placeholder="1 (low) to 10 (extreme)"
          value={inputs.destruction}
          onChange={(e) => handleInputChange("destruction", e.target.value)}
          aria-describedby="destruction-desc"
          maxLength={2}
        />
        <p id="destruction-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Rate how destructive your dog’s zoomies usually are, from 1 (gentle) to 10 (extreme chaos).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger calculation by re-setting inputs to current values (no-op)
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate Dog Zoomies Energy Release"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ speed: "", destruction: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
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
          Understanding Dog Zoomies Energy Release Meter
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Dog Zoomies Energy Release Meter estimates the intensity of your dog's energetic bursts, commonly known as zoomies. By combining your dog's running speed and the level of destruction caused during these episodes, this meter provides a fun and insightful score representing their kinetic energy release. This helps dog owners understand and anticipate their pet’s behavior, ensuring a safer and more enjoyable environment for both dogs and humans.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Dog zoomies, scientifically called Frenetic Random Activity Periods (FRAPs), are a natural behavior that helps dogs release excess energy and reduce stress. These bursts can last from a few seconds to several minutes and are often triggered by excitement or after a bath.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Meter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Dog Zoomies Energy Release Meter, input your dog's estimated running speed during zoomies in miles per hour. Next, rate the destruction level on a scale from 1 to 10, where 1 means minimal chaos and 10 indicates extreme destruction. Click "Calculate" to see your dog's zoomies energy score and get insights on their energetic behavior.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-1">{answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.akc.org/expert-advice/training/what-are-dog-zoomies/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              What Are Dog Zoomies? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              American Kennel Club explains the causes and behaviors of dog zoomies.
            </p>
          </li>
          <li>
            <a
              href="https://www.petmd.com/dog/behavior/why-do-dogs-get-zoomies"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Why Do Dogs Get Zoomies? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              PetMD article on the science behind Frenetic Random Activity Periods (FRAPs).
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Zoomies Energy Release Meter"
      description="Measure dog energy bursts. Calculate the kinetic energy of your dog's 3 AM zoomies based on speed and destruction level."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Energy Score = Speed × Destruction Level × 10",
        variables: [
          { symbol: "Speed", description: "Dog's running speed during zoomies in miles per hour" },
          { symbol: "Destruction Level", description: "Scale of destruction caused during zoomies (1-10)" },
          { symbol: "Energy Score", description: "Calculated zoomies energy release score" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "If your dog runs at 12 mph during zoomies and has a destruction level of 7, the energy release score can be calculated as:",
        steps: [
          { label: "1", explanation: "Multiply speed by destruction level: 12 × 7 = 84" },
          { label: "2", explanation: "Multiply the result by 10 to scale: 84 × 10 = 840" },
          { label: "3", explanation: "The energy release score is 840, indicating high zoomies energy." },
        ],
        result: "840 (High Zoomies Energy)",
      }}
      relatedCalculators={[
        { title: "Loop-the-Loop Speed Calculator", url: "/funny/loop-the-loop-speed-calculator", icon: "✈️" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Zombie Survival Calculator", url: "/funny/zombie-survival-calculator", icon: "🧟" },
        { title: "Meetings Wasted-Time Counter", url: "/funny/meetings-wasted-time-counter", icon: "💻" },
        { title: "Nickels to Crush Calculator", url: "/funny/nickels-to-crush-calculator", icon: "🤪" },
        { title: "How Much Sugar Is in My Tea? (Dramatic)", url: "/funny/sugar-in-my-tea-dramatic", icon: "☕" },
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