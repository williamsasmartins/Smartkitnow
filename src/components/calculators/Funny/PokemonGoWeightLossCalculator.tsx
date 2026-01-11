import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Smile,
  RotateCcw,
  Sparkles,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PokemonGoWeightLossCalculator() {
  // Units: Metric (km, kg) or Imperial (miles, lbs)
  const [units, setUnits] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    distance: "",
    duration: "",
  });
  const handleInputChange = useCallback(
    (name, value) => setInputs((p) => ({ ...p, [name]: value })),
    []
  );

  // Constants for calorie burn estimation
  // Average MET for walking in Pokémon GO ~ 3.5 (moderate pace)
  // Calories burned = MET × weight(kg) × duration(hr)
  // We'll calculate duration from distance and average speed or use input duration if provided.
  // To keep it simple, user inputs weight, distance walked while playing, and optionally duration.
  // If duration is empty, assume average walking speed 5 km/h (3.1 mph).

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const distance = parseFloat(inputs.distance);
    const durationInput = parseFloat(inputs.duration);

    if (
      !weight ||
      weight <= 0 ||
      !distance ||
      distance <= 0 ||
      (inputs.duration !== "" && (isNaN(durationInput) || durationInput <= 0))
    ) {
      // Return neutral state if inputs are empty or invalid
      return { value: null };
    }

    // Convert weight to kg if imperial
    const weightKg = units === "imperial" ? weight * 0.453592 : weight;
    // Convert distance to km if imperial
    const distanceKm = units === "imperial" ? distance * 1.60934 : distance;

    // Calculate duration in hours
    let durationHr = durationInput;
    if (inputs.duration === "") {
      // Estimate duration by distance / average speed (5 km/h or 3.1 mph)
      durationHr = distanceKm / 5;
    }

    // MET value for moderate walking
    const MET = 3.5;

    // Calories burned formula
    const caloriesBurned = MET * weightKg * durationHr;

    // Weight loss estimate: 3500 calories = 1 lb fat
    // Convert calories burned to pounds lost
    const poundsLost = caloriesBurned / 3500;

    // Convert pounds lost to kg if metric
    const weightLost = units === "imperial" ? poundsLost : poundsLost * 0.453592;

    // Format output
    const formattedCalories = caloriesBurned.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
    const formattedWeightLost = units === "imperial"
      ? poundsLost.toFixed(2) + " lbs"
      : weightLost.toFixed(2) + " kg";

    return {
      value: formattedWeightLost,
      label: "Estimated Weight Loss",
      subtext: `Burned approximately ${formattedCalories} calories playing Pokémon GO`,
      color: "text-green-600",
      icon: <Smile className="mx-auto" />,
    };
  }, [inputs, units]);

  const faqs = [
    {
      question: "Can playing Pokémon GO really help me lose weight?",
      answer:
        "Yes! Pokémon GO encourages walking and physical activity, which burns calories and can contribute to weight loss when combined with a healthy diet.",
    },
    {
      question: "Why do I need to input my weight?",
      answer:
        "Calorie burn depends on your body weight because heavier individuals burn more calories performing the same activity compared to lighter individuals.",
    },
    {
      question: "What if I don't know how long I played?",
      answer:
        "If you don't know the duration, the calculator estimates it based on your distance and an average walking speed of 5 km/h (3.1 mph).",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div>
        <Label htmlFor="units" className="mb-1 block font-semibold">
          Select Units
        </Label>
        <Select
          value={units}
          onValueChange={(v) => setUnits(v)}
          id="units"
          aria-label="Select units"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (kg, km)</SelectItem>
            <SelectItem value="imperial">Imperial (lbs, miles)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div>
        <Label htmlFor="weight" className="mb-1 block font-semibold">
          Your Weight ({units === "metric" ? "kg" : "lbs"})
        </Label>
        <Input
          type="number"
          id="weight"
          min="1"
          step="any"
          placeholder={`e.g. ${units === "metric" ? "70" : "154"}`}
          value={inputs.weight}
          onChange={(e) => handleInputChange("weight", e.target.value)}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-sm text-slate-500 mt-1">
          Enter your current body weight.
        </p>
      </div>

      <div>
        <Label htmlFor="distance" className="mb-1 block font-semibold">
          Distance Walked While Playing ({units === "metric" ? "km" : "miles"})
        </Label>
        <Input
          type="number"
          id="distance"
          min="0"
          step="any"
          placeholder={`e.g. ${units === "metric" ? "5" : "3.1"}`}
          value={inputs.distance}
          onChange={(e) => handleInputChange("distance", e.target.value)}
          aria-describedby="distance-desc"
        />
        <p id="distance-desc" className="text-sm text-slate-500 mt-1">
          Total distance you walked during your Pokémon GO session.
        </p>
      </div>

      <div>
        <Label htmlFor="duration" className="mb-1 block font-semibold">
          Duration of Play (hours) <span className="italic">(optional)</span>
        </Label>
        <Input
          type="number"
          id="duration"
          min="0"
          step="any"
          placeholder="e.g. 1.5"
          value={inputs.duration}
          onChange={(e) => handleInputChange("duration", e.target.value)}
          aria-describedby="duration-desc"
        />
        <p id="duration-desc" className="text-sm text-slate-500 mt-1">
          How long you played Pokémon GO. If left empty, duration is estimated.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate weight loss"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", distance: "", duration: "" })}
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
          Understanding Pokémon GO Weight Loss Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Pokémon GO Weight Loss Calculator estimates how much weight you can
          lose by walking and playing Pokémon GO. It uses your weight, distance
          walked, and duration of play to calculate calories burned and convert
          that into an estimated weight loss. This gamified approach encourages
          physical activity while enjoying the game.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting your personal data and gameplay stats, you get a realistic
          estimate of your fitness progress. Whether you’re hatching eggs or
          catching Pokémon, this tool helps you track the health benefits of your
          adventures.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Pokémon GO was one of the first augmented reality games to motivate
            millions of players worldwide to walk more, with some studies showing
            an average increase of 26% in daily steps among players.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use the Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by selecting your preferred measurement units: Metric or Imperial.
          Then enter your current body weight, the distance you walked while
          playing Pokémon GO, and optionally the duration of your play session.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          If you don’t know how long you played, leave the duration blank and the
          calculator will estimate it based on an average walking speed. Click
          “Calculate” to see your estimated weight loss and calories burned.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use this tool regularly to track your progress and stay motivated on
          your fitness journey with Pokémon GO.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
              {question}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-1">
              {answer}
            </p>
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
              href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0183503"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Impact of Pokémon GO on Physical Activity <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A study published in PLOS ONE showing increased physical activity
              among Pokémon GO players.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/physicalactivity/basics/measuring/calories.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC: Calories Burned in Physical Activity <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines on estimating calories burned during exercise.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pokémon GO Weight Loss Calculator"
      description="Gamify your fitness. Estimate how many calories you burn while walking to hatch eggs and catch Pokémon."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ IMPORTANT: Use 'symbol' and 'description' keys here!
      formula={{
        title: "The Math",
        formula: "Calories Burned = MET × Weight (kg) × Duration (hours)",
        variables: [
          {
            symbol: "MET",
            description:
              "Metabolic Equivalent of Task, average 3.5 for moderate walking",
          },
          {
            symbol: "Weight (kg)",
            description: "Your body weight in kilograms",
          },
          {
            symbol: "Duration (hours)",
            description: "Time spent walking while playing Pokémon GO",
          },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "A player weighing 70 kg walks 5 km playing Pokémon GO for 1 hour.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate calories burned: 3.5 × 70 × 1 = 245 calories.",
          },
          {
            label: "2",
            explanation:
              "Convert calories to weight loss: 245 / 3500 ≈ 0.07 lbs (0.03 kg).",
          },
          {
            label: "3",
            explanation:
              "This shows a small but meaningful weight loss from a single session.",
          },
        ],
        result: "Estimated weight loss: 0.03 kg (0.07 lbs)",
      }}
      relatedCalculators={[
        {
          title: "First-Date Awkwardness Meter",
          url: "/funny/first-date-awkwardness-meter",
          icon: "❤️",
        },
        {
          title: "Ideal Egg Boiling Calculator",
          url: "/funny/ideal-egg-boiling-calculator",
          icon: "🤪",
        },
        {
          title: "BBQ 'Who Brings the Charcoal?' Splitter",
          url: "/funny/bbq-charcoal-splitter",
          icon: "🍩",
        },
        {
          title: "Black Hole Sun Impact Calculator",
          url: "/funny/black-hole-sun-impact",
          icon: "🧟",
        },
        {
          title: "How Much Sugar Is in My Tea? (Dramatic)",
          url: "/funny/sugar-in-my-tea-dramatic",
          icon: "☕",
        },
        {
          title: "Love Meter (Name Compatibility)",
          url: "/funny/love-meter",
          icon: "❤️",
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
