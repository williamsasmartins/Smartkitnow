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

export default function DeathByCaffeineCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    weight: "",
    caffeineMg: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Constants
  // According to scientific studies, the median lethal dose (LD50) of caffeine is about 150-200 mg per kg of body weight.
  // We'll use 190 mg/kg as a safe average lethal dose for calculation.
  const LD50_MG_PER_KG = 190;

  // Average caffeine content per beverage type (mg)
  // We'll allow user to input caffeine mg per serving or choose a common beverage.
  // For simplicity, user inputs caffeine mg per serving directly.

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const caffeineMgNum = parseFloat(inputs.caffeineMg);

    if (!weightNum || weightNum <= 0) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Calculate lethal dose in mg for the person
    const lethalDoseMg = LD50_MG_PER_KG * weightNum;

    // If caffeine per serving is invalid, default to 95 mg (average cup of coffee)
    const caffeinePerServing = caffeineMgNum && caffeineMgNum > 0 ? caffeineMgNum : 95;

    // Calculate max safe servings (rounded down)
    const maxServings = Math.floor(lethalDoseMg / caffeinePerServing);

    // Witty remarks based on max servings
    let label = "";
    let subtext = "";
    let color = "text-blue-600";
    let icon = <Coffee className="mx-auto h-12 w-12 text-yellow-600" />;

    if (maxServings > 50) {
      label = "Caffeine Overlord!";
      subtext = `You could theoretically down over ${maxServings} cups of coffee before hitting the lethal dose. That's a lot of buzz!`;
      color = "text-green-600";
      icon = <Zap className="mx-auto h-12 w-12 text-green-600" />;
    } else if (maxServings > 20) {
      label = "High Tolerance";
      subtext = `About ${maxServings} cups of coffee would reach the lethal dose. Remember, moderation is key!`;
      color = "text-yellow-600";
      icon = <Meh className="mx-auto h-12 w-12 text-yellow-600" />;
    } else if (maxServings > 5) {
      label = "Moderate Limit";
      subtext = `You should stop before ${maxServings} cups of coffee to stay safe. Don't push your luck!`;
      color = "text-orange-600";
      icon = <AlertTriangle className="mx-auto h-12 w-12 text-orange-600" />;
    } else if (maxServings > 0) {
      label = "Caffeine Sensitive";
      subtext = `Only about ${maxServings} cups of coffee would be lethal. Sip carefully!`;
      color = "text-red-600";
      icon = <Frown className="mx-auto h-12 w-12 text-red-600" />;
    } else {
      label = "Invalid Input";
      subtext = "Please enter valid weight and caffeine content.";
      color = "text-gray-600";
      icon = <Ghost className="mx-auto h-12 w-12 text-gray-600" />;
    }

    return {
      value: maxServings.toString(),
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What exactly is 'Death by Caffeine'?",
      answer:
        "The phrase 'Death by Caffeine' refers to the lethal dose of caffeine that can cause fatal poisoning. Scientists estimate this dose based on body weight, typically around 150-200 mg per kilogram. Understanding this helps caffeine lovers gauge their limits and avoid dangerous overconsumption.",
    },
    {
      question: "How was the lethal dose of caffeine determined?",
      answer:
        "The lethal dose, often called LD50, is derived from toxicology studies on animals and extrapolated to humans. It represents the amount that kills 50% of test subjects. While exact human data is limited for ethical reasons, this estimate helps set safety guidelines for caffeine intake worldwide.",
    },
    {
      question: "Why does body weight affect caffeine toxicity?",
      answer:
        "Caffeine's effects depend heavily on body mass because it distributes through the bloodstream. A heavier person generally tolerates more caffeine before reaching toxic levels. This is why our calculator uses weight to personalize the maximum safe intake, making it more accurate than generic recommendations.",
    },
    {
      question: "Can caffeine overdose happen from coffee alone?",
      answer:
        "While it's theoretically possible, drinking lethal amounts of coffee is extremely difficult due to volume and taste. Most caffeine overdoses come from concentrated sources like pills or energy drinks. Still, knowing your limits helps prevent accidental overconsumption from any source.",
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
            <SelectItem value="metric">Metric (kg, mg)</SelectItem>
            <SelectItem value="imperial">Imperial (lbs, mg)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div>
        <Label htmlFor="weight" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          Body Weight {inputs.unit === "metric" ? "(kg)" : "(lbs)"}
          <Info className="w-4 h-4 text-slate-400" />
        </Label>
        <Input
          id="weight"
          type="number"
          min="1"
          step="any"
          placeholder={inputs.unit === "metric" ? "e.g. 70" : "e.g. 154"}
          value={inputs.weight}
          onChange={(e) => {
            let val = e.target.value;
            if (inputs.unit === "imperial") {
              // Convert lbs to kg internally for calculation
              const lbs = parseFloat(val);
              if (!isNaN(lbs)) {
                val = (lbs / 2.20462).toFixed(2);
              } else {
                val = "";
              }
            }
            handleInputChange("weight", val);
          }}
        />
        <p className="text-sm text-slate-500 mt-1">
          Enter your weight in {inputs.unit === "metric" ? "kilograms" : "pounds (converted to kg internally)"}.
        </p>
      </div>

      {/* Caffeine per Serving Input */}
      <div>
        <Label htmlFor="caffeineMg" className="mb-1 font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          Caffeine per Serving (mg)
          <Info className="w-4 h-4 text-slate-400" />
        </Label>
        <Input
          id="caffeineMg"
          type="number"
          min="1"
          step="any"
          placeholder="e.g. 95 (average cup of coffee)"
          value={inputs.caffeineMg}
          onChange={(e) => handleInputChange("caffeineMg", e.target.value)}
        />
        <p className="text-sm text-slate-500 mt-1">
          Typical values: 95 mg (coffee), 47 mg (black tea), 80 mg (energy drink). Leave blank for 95 mg default.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ unit: "metric", weight: "", caffeineMg: "" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Death by Caffeine (Max Safe Intake)</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Caffeine is the world’s most widely consumed psychoactive substance, beloved for its energizing kick. But like all good things, too much caffeine can be dangerous, even deadly. The term “Death by Caffeine” refers to the lethal dose of caffeine that can cause fatal poisoning, typically measured in milligrams per kilogram of body weight. This calculator helps you understand your personal maximum safe intake by factoring in your weight and the caffeine content of your favorite beverage.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The median lethal dose (LD50) of caffeine is estimated to be around 150-200 mg per kilogram of body weight, meaning that consuming this amount could be fatal for half of the population at that weight. However, individual sensitivity varies widely due to genetics, metabolism, and tolerance. That’s why it’s crucial to know your limits and never push caffeine consumption to dangerous extremes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Interestingly, caffeine overdose is rare from coffee alone because the volume required is enormous, but concentrated caffeine pills and energy drinks have caused accidental poisonings. This calculator gives you a fun yet informative way to gauge how many cups of coffee—or equivalent caffeine servings—you could theoretically consume before reaching a lethal dose. Spoiler: it’s usually way more than you’d want to drink!
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The energizing effects of caffeine were reportedly discovered by Ethiopian goat herders around the 9th century. They noticed their goats became unusually lively after eating coffee cherries. This serendipitous observation eventually led to the global coffee culture we cherish today, fueling everything from morning routines to creative breakthroughs.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is as easy as your morning brew. First, select your preferred unit system—Metric for kilograms or Imperial for pounds. Then enter your body weight. If you choose Imperial, your input will be converted internally to kilograms for accurate calculation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, input the caffeine content per serving of your favorite drink in milligrams. If you’re unsure, leave it blank to use the default average of 95 mg, which corresponds to a typical cup of brewed coffee. Finally, hit the Calculate button to see your maximum safe caffeine servings before reaching a lethal dose.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, this is a theoretical maximum based on median lethal dose estimates and does not account for individual sensitivity or health conditions. Always consume caffeine responsibly and consult a healthcare professional if you have concerns about your caffeine intake.
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
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3777299/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Institutes of Health: Caffeine Toxicity <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive review of caffeine’s pharmacology, toxicity, and lethal dose estimates.
            </p>
          </li>
          <li>
            <a
              href="https://www.history.com/news/who-discovered-coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              History.com: The Discovery of Coffee <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore the legendary story of how Ethiopian goats led to the discovery of coffee.
            </p>
          </li>
          <li>
            <a
              href="https://www.caffeineinformer.com/caffeine-content"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Caffeine Informer: Caffeine Content Database <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed caffeine content for a wide range of beverages and supplements.
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
        formula: "Max Safe Servings = (LD50 mg/kg × Body Weight in kg) ÷ Caffeine per Serving (mg)",
        variables: [
          { symbol: "LD50 mg/kg", description: "Median lethal dose of caffeine per kilogram of body weight (approx. 190 mg/kg)" },
          { symbol: "Body Weight in kg", description: "Your weight in kilograms (converted if input in pounds)" },
          { symbol: "Caffeine per Serving (mg)", description: "Amount of caffeine in one serving of your drink" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "Calculate the lethal caffeine intake for a 70 kg person drinking coffee with 95 mg caffeine per cup.",
        steps: [
          { label: "1", explanation: "Multiply 190 mg/kg by 70 kg to get 13,300 mg lethal dose." },
          { label: "2", explanation: "Divide 13,300 mg by 95 mg per cup to get approximately 140 cups." },
          { label: "3", explanation: "So, 140 cups of coffee would be the theoretical lethal dose for this person." },
        ],
        result: "Max Safe Servings ≈ 140 cups of coffee",
      }}
      relatedCalculators={[
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
        { title: "Tab Overload Anxiety Score", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
        { title: "Coffee Strength vs Productivity Score", url: "/funny/coffee-strength-vs-productivity-meme", icon: "☕" },
        { title: "Plant Watering Procrastination Index", url: "/funny/plant-watering-procrastination-index", icon: "🤪" },
        { title: "Zombie Survival Calculator", url: "/funny/zombie-survival-calculator", icon: "🧟" },
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