import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Frown, Meh, Lightbulb, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PlantWateringProcrastinationIndexCalculator() {
  const [inputs, setInputs] = useState({
    daysSinceLastWatered: "",
    plantTypeFactor: "",
    wateringFrequency: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const daysSinceLastWatered = parseFloat(inputs.daysSinceLastWatered);
    const plantTypeFactor = parseFloat(inputs.plantTypeFactor);
    const wateringFrequency = parseFloat(inputs.wateringFrequency);

    // Initial state safety: if any input is empty or invalid, return neutral state
    if (
      isNaN(daysSinceLastWatered) ||
      isNaN(plantTypeFactor) ||
      isNaN(wateringFrequency) ||
      daysSinceLastWatered < 0 ||
      plantTypeFactor <= 0 ||
      wateringFrequency <= 0
    ) {
      return { value: null };
    }

    /**
     * Formula:
     * Procrastination Index = (Days Since Last Watered) / (Recommended Watering Frequency × Plant Type Factor)
     * 
     * Interpretation:
     * - < 0.5: You are very prompt with watering your plants.
     * - 0.5 - 1: Slight procrastination, but plants are safe.
     * - 1 - 1.5: Moderate procrastination, plants may start showing stress.
     * - > 1.5: High procrastination, plants at risk of damage.
     */

    const procrastinationIndex = daysSinceLastWatered / (wateringFrequency * plantTypeFactor);

    // Round to 2 decimals
    const roundedIndex = Math.round(procrastinationIndex * 100) / 100;

    // Determine label, color, icon based on index
    let label = "";
    let color = "";
    let icon = null;
    let subtext = "";

    if (roundedIndex < 0.5) {
      label = "Excellent Care";
      color = "text-green-600";
      icon = <Smile className="mx-auto" size={48} />;
      subtext = "You're watering your plants well before they get thirsty. Keep it up!";
    } else if (roundedIndex < 1) {
      label = "Slight Procrastination";
      color = "text-yellow-600";
      icon = <Meh className="mx-auto" size={48} />;
      subtext = "A bit late, but your plants are still happy. Try to water a bit sooner.";
    } else if (roundedIndex < 1.5) {
      label = "Moderate Procrastination";
      color = "text-orange-600";
      icon = <Frown className="mx-auto" size={48} />;
      subtext = "Your plants might be stressed. Consider watering them soon.";
    } else {
      label = "High Procrastination";
      color = "text-red-700";
      icon = <Skull className="mx-auto" size={48} />;
      subtext = "Your plants are at risk! Water immediately to save them.";
    }

    return {
      value: roundedIndex.toString(),
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Plant Watering Procrastination Index?",
      answer:
        "The Plant Watering Procrastination Index measures how delayed you are in watering your plants compared to their ideal watering schedule. It helps you understand if your plants are getting enough water or if they are at risk due to neglect.",
    },
    {
      question: "How do I find the Plant Type Factor?",
      answer:
        "The Plant Type Factor is a multiplier that adjusts the watering frequency based on your plant's water needs. Succulents have a higher factor (less frequent watering), while tropical plants have a lower factor (more frequent watering). We provide common values in the input placeholder.",
    },
    {
      question: "Can I use this index for all types of plants?",
      answer:
        "Yes, but you should adjust the Plant Type Factor according to your plant's specific watering needs for accurate results. Using a generic factor may give less precise feedback.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="daysSinceLastWatered" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Days Since Last Watered
        </Label>
        <Input
          id="daysSinceLastWatered"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 5"
          value={inputs.daysSinceLastWatered}
          onChange={(e) => handleInputChange("daysSinceLastWatered", e.target.value)}
          aria-describedby="daysSinceLastWatered-desc"
        />
        <p id="daysSinceLastWatered-desc" className="text-sm text-slate-500 mt-1">
          Number of days since you last watered your plant.
        </p>
      </div>

      <div>
        <Label htmlFor="plantTypeFactor" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Plant Type Factor
        </Label>
        <Input
          id="plantTypeFactor"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 1 for tropical, 1.5 for succulents"
          value={inputs.plantTypeFactor}
          onChange={(e) => handleInputChange("plantTypeFactor", e.target.value)}
          aria-describedby="plantTypeFactor-desc"
        />
        <p id="plantTypeFactor-desc" className="text-sm text-slate-500 mt-1">
          Multiplier based on plant type water needs (e.g., 1 for tropical, 1.5 for succulents).
        </p>
      </div>

      <div>
        <Label htmlFor="wateringFrequency" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Recommended Watering Frequency (days)
        </Label>
        <Input
          id="wateringFrequency"
          type="text"
          inputMode="decimal"
          placeholder="e.g. 7"
          value={inputs.wateringFrequency}
          onChange={(e) => handleInputChange("wateringFrequency", e.target.value)}
          aria-describedby="wateringFrequency-desc"
        />
        <p id="wateringFrequency-desc" className="text-sm text-slate-500 mt-1">
          How often your plant should ideally be watered, in days.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate Plant Watering Procrastination Index"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ daysSinceLastWatered: "", plantTypeFactor: "", wateringFrequency: "" })}
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
          Understanding Plant Watering Procrastination Index
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Plant Watering Procrastination Index is a simple yet insightful metric that helps plant owners gauge how delayed they are in watering their plants relative to the ideal schedule. By considering the days since last watering, the plant's specific water needs, and the recommended watering frequency, this index provides a clear picture of plant care habits. It encourages timely watering to keep plants healthy and thriving.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This index is especially useful for busy individuals who want to track their plant care without guesswork. It highlights when plants might be under stress due to neglect, allowing for proactive care adjustments. Using this tool regularly can improve plant health and reduce the risk of over- or under-watering.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Overwatering is one of the most common causes of plant death, often more harmful than underwatering. The Plant Watering Procrastination Index helps balance watering schedules to avoid this common mistake.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the calculator, enter the number of days since you last watered your plant, the plant type factor that reflects your plant's water needs, and the recommended watering frequency in days. The plant type factor adjusts the index to account for different plant species, such as succulents or tropical plants.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering these values, click "Calculate" to see your Plant Watering Procrastination Index. The result will indicate how timely your watering habits are and provide advice on whether you need to water your plants soon or if you are doing great.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use the reset button to clear inputs and start fresh. Regularly tracking this index can help you maintain healthier plants and avoid common watering mistakes.
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
              href="https://www.gardeningknowhow.com/plant-problems/environmental/overwatering-plants.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Overwatering Plants: Symptoms and Solutions <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Gardening Know How explains the dangers of overwatering and how to recognize it.
            </p>
          </li>
          <li>
            <a
              href="https://www.thespruce.com/how-often-to-water-houseplants-1902776"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              How Often to Water Houseplants <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The Spruce provides guidelines on watering frequency for different plant types.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plant Watering Procrastination Index"
      description="Track plant neglect. Calculate how long you can 'procrastinate' watering your plants before they officially give up on you."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Procrastination Index = (Days Since Last Watered) ÷ (Recommended Watering Frequency × Plant Type Factor)",
        variables: [
          { symbol: "Days Since Last Watered", description: "Number of days since you last watered your plant" },
          { symbol: "Recommended Watering Frequency", description: "Ideal watering interval for your plant in days" },
          { symbol: "Plant Type Factor", description: "Multiplier adjusting for plant's water needs (e.g., 1 for tropical, 1.5 for succulents)" },
          { symbol: "Procrastination Index", description: "Ratio indicating watering delay relative to ideal schedule" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You last watered your succulent 10 days ago. The recommended watering frequency for succulents is 7 days, and the plant type factor is 1.5.",
        steps: [
          {
            label: "Step 1",
            explanation: "Identify days since last watered: 10 days.",
          },
          {
            label: "Step 2",
            explanation: "Use recommended watering frequency: 7 days.",
          },
          {
            label: "Step 3",
            explanation: "Apply plant type factor for succulents: 1.5.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate index: 10 ÷ (7 × 1.5) = 10 ÷ 10.5 ≈ 0.95, indicating slight procrastination but plants are still safe.",
          },
        ],
        result: "Plant Watering Procrastination Index ≈ 0.95 (Slight Procrastination)",
      }}
      relatedCalculators={[
        { title: "Meme Virality Calculator", url: "/funny/meme-virality-calculator", icon: "🤪" },
        { title: "Lost Socks Calculator", url: "/funny/lost-socks-calculator", icon: "🤪" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Pizza Slices per Person & Regret Index", url: "/funny/pizza-slices-per-person-regret-index", icon: "🍕" },
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
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