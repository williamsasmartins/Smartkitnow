import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Smile, Frown, Meh, Ghost, Skull, Coffee, Utensils, Gamepad2, Cat, Dog, Zap, Heart, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Flame, Clock, Ticket, Plane, Globe, Sparkles, Lightbulb } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PokemonGoWeightLossCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    weight: "",
    distance: "",
    duration: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * Pokémon GO players burn calories primarily by walking or jogging to hatch eggs and catch Pokémon.
   * Calories burned depend on weight, distance walked, and duration.
   * 
   * Formula:
   * Calories burned (kcal) ≈ MET value × weight (kg) × duration (hours)
   * 
   * MET (Metabolic Equivalent of Task) for walking ~ 3.5 (moderate pace)
   * 
   * Alternatively, calories can be estimated by distance:
   * Calories ≈ weight (kg) × distance (km) × 1.036 (average kcal per kg per km walking)
   * 
   * We'll use distance-based calculation for simplicity and accuracy.
   */

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const distanceRaw = parseFloat(inputs.distance);
    const durationRaw = parseFloat(inputs.duration);

    if (
      isNaN(weightRaw) || weightRaw <= 0 ||
      isNaN(distanceRaw) || distanceRaw <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-gray-500",
        icon: <Meh />,
      };
    }

    // Convert inputs to metric if needed
    const weightKg = inputs.unit === "imperial" ? weightRaw * 0.453592 : weightRaw; // lbs to kg
    const distanceKm = inputs.unit === "imperial" ? distanceRaw * 1.60934 : distanceRaw; // miles to km

    // Calories burned walking approx 1.036 kcal per kg per km
    const caloriesBurned = weightKg * distanceKm * 1.036;

    // Fun twist: Pokémon GO hatches eggs at 2 km, 5 km, 7 km, 10 km, 12 km distances
    // Calculate how many eggs you could hatch with this distance
    const eggsHatched2km = Math.floor(distanceKm / 2);
    const eggsHatched5km = Math.floor(distanceKm / 5);
    const eggsHatched7km = Math.floor(distanceKm / 7);
    const eggsHatched10km = Math.floor(distanceKm / 10);
    const eggsHatched12km = Math.floor(distanceKm / 12);

    // Witty remarks based on calories burned
    let color = "text-green-600";
    let icon = <Smile />;
    let subtext = "";

    if (caloriesBurned < 50) {
      color = "text-yellow-600";
      icon = <Meh />;
      subtext = "A light stroll, but hey, every step counts!";
    } else if (caloriesBurned < 200) {
      color = "text-green-600";
      icon = <Smile />;
      subtext = "Great job! You're burning calories and catching 'em all!";
    } else if (caloriesBurned < 500) {
      color = "text-blue-600";
      icon = <Zap />;
      subtext = "Impressive! You're a true Pokémon GO fitness master.";
    } else {
      color = "text-purple-600";
      icon = <Flame />;
      subtext = "Legendary effort! You could hatch a whole Pokémon daycare!";
    }

    return {
      value: caloriesBurned.toFixed(0),
      label: `Calories Burned & Potential Eggs Hatched`,
      subtext: (
        <>
          You burned approximately <strong>{caloriesBurned.toFixed(0)}</strong> kcal walking <strong>{distanceKm.toFixed(2)} km</strong>.<br />
          That distance could hatch: <strong>{eggsHatched2km}</strong> 2km eggs, <strong>{eggsHatched5km}</strong> 5km eggs, <strong>{eggsHatched7km}</strong> 7km eggs, <strong>{eggsHatched10km}</strong> 10km eggs, or <strong>{eggsHatched12km}</strong> 12km eggs!
        </>
      ),
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How does walking in Pokémon GO help with weight loss?",
      answer:
        "Walking in Pokémon GO is not just fun; it’s a fantastic way to stay active. The game encourages players to walk certain distances to hatch eggs and earn rewards, which means you’re motivated to move more. This increased physical activity burns calories, contributing to weight loss over time when combined with a healthy diet. Plus, the social and exploratory aspects keep you engaged, making exercise feel less like a chore and more like an adventure.",
    },
    {
      question: "Why do different Pokémon eggs require different walking distances?",
      answer:
        "Pokémon eggs come in various types, each requiring a specific walking distance to hatch, ranging from 2 km to 12 km. This design adds layers of challenge and excitement, encouraging players to explore their surroundings more extensively. The distances reflect the rarity and strength of the Pokémon inside; rarer Pokémon usually require longer walks. This mechanic cleverly combines fitness with gameplay, making exercise a natural part of the experience.",
    },
    {
      question: "Can I estimate calories burned using distance alone?",
      answer:
        "Yes, estimating calories burned based on distance walked is a reliable method because walking a certain distance generally burns a consistent amount of energy per kilogram of body weight. While factors like walking speed and terrain can affect calorie burn, distance-based calculations provide a practical and straightforward estimate. This is why our calculator uses your weight and distance walked to give you an engaging and fairly accurate calorie count.",
    },
    {
      question: "Is Pokémon GO effective for long-term fitness?",
      answer:
        "Pokémon GO has proven to be an effective tool for promoting long-term fitness by turning exercise into a game. Studies have shown that players often increase their daily step counts significantly after starting the game. The blend of augmented reality, social interaction, and goal-oriented gameplay keeps motivation high. However, like any fitness routine, consistency and balanced nutrition are key to sustained health benefits.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Globe className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div>
        <Label htmlFor="weight" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Your Weight ({inputs.unit === "metric" ? "kg" : "lbs"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="1"
          step="any"
          placeholder={inputs.unit === "metric" ? "e.g. 70" : "e.g. 154"}
          value={inputs.weight}
          onChange={(e) => handleInputChange("weight", e.target.value)}
        />
      </div>

      {/* Distance Input */}
      <div>
        <Label htmlFor="distance" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Distance Walked ({inputs.unit === "metric" ? "km" : "miles"})
        </Label>
        <Input
          id="distance"
          type="number"
          min="0.1"
          step="any"
          placeholder={inputs.unit === "metric" ? "e.g. 5" : "e.g. 3.1"}
          value={inputs.distance}
          onChange={(e) => handleInputChange("distance", e.target.value)}
        />
      </div>

      {/* Duration Input (optional) */}
      <div>
        <Label htmlFor="duration" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Duration (minutes, optional)
        </Label>
        <Input
          id="duration"
          type="number"
          min="1"
          step="any"
          placeholder="e.g. 60"
          value={inputs.duration}
          onChange={(e) => handleInputChange("duration", e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already reactive)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ unit: "metric", weight: "", distance: "", duration: "" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Pokémon GO Weight Loss Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Pokémon GO revolutionized mobile gaming by blending augmented reality with physical activity, encouraging millions worldwide to get outside and walk. This calculator estimates the calories you burn while chasing Pokémon and hatching eggs, turning your fitness journey into a playful adventure. By inputting your weight and distance walked, you get a personalized calorie burn estimate, helping you track your progress in a fun, engaging way. It’s a perfect example of how gaming can motivate healthier lifestyles without feeling like exercise.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Pokémon GO was launched in 2016 and quickly became a global phenomenon, with over 28 million daily active users at its peak. Interestingly, studies found that players increased their daily steps by an average of 26%, proving that the game’s design effectively promotes physical activity. The egg-hatching mechanic, which requires walking specific distances, cleverly integrates fitness goals into gameplay, making exercise feel like a natural part of the fun.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply select your preferred unit system—metric or imperial—then enter your weight and the distance you walked while playing Pokémon GO. Optionally, you can add the duration of your walk to keep track of your pace, though it’s not required for calorie estimation. Hit “Calculate” to see how many calories you burned and how many Pokémon eggs you could have potentially hatched during your adventure. Use this tool to gamify your fitness and stay motivated on your journey to better health.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Fun Reads</h2>
        <ul className="space-y-4">
          <li>
            <a href="https://pokemongolive.com/en/post/announcements/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Official Pokémon GO Announcements <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official source for updates, events, and insights into Pokémon GO’s gameplay mechanics and community initiatives.
            </p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5798736/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Study: Pokémon GO Increases Physical Activity <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A scientific paper analyzing how Pokémon GO positively impacted players’ physical activity levels and health outcomes.
            </p>
          </li>
          <li>
            <a href="https://www.pokemon.com/us/pokemon-video-games/pokemon-go/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Pokémon GO Official Website <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore the game’s features, events, and tips to maximize your Pokémon GO experience and fitness benefits.
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
      formula={{
        title: "The Math",
        formula: "Calories Burned ≈ Weight (kg) × Distance Walked (km) × 1.036",
        variables: [
          { symbol: "Weight", description: "Your body weight in kilograms (kg)" },
          { symbol: "Distance Walked", description: "Distance you walked while playing in kilometers (km)" },
          { symbol: "1.036", description: "Average calories burned per kg per km walking" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You weigh 70 kg and walked 5 km while playing Pokémon GO.",
        steps: [
          { label: "1", explanation: "Multiply your weight by distance: 70 × 5 = 350" },
          { label: "2", explanation: "Multiply by 1.036 to estimate calories: 350 × 1.036 ≈ 362.6" },
          { label: "3", explanation: "You burned approximately 363 kcal during your walk." },
        ],
        result: "Calories Burned ≈ 363 kcal",
      }}
      relatedCalculators={[
        { title: "Loop-the-Loop Speed Calculator", url: "/funny/loop-the-loop-speed-calculator", icon: "✈️" },
        { title: "Coffee Strength vs Productivity Score", url: "/funny/coffee-strength-vs-productivity-meme", icon: "☕" },
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "Meme Virality Calculator", url: "/funny/meme-virality-calculator", icon: "🤪" },
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