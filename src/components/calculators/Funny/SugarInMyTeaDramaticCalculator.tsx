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

export default function SugarInMyTeaDramaticCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    teaVolume: "", // in ml or fl oz
    sugarGrams: "", // grams or teaspoons converted later
    sugarUnit: "grams",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Constants
  const GRAMS_PER_TEASPOON = 4.2; // average sugar grams per teaspoon
  const SUGAR_CUBE_GRAMS = 4; // average sugar cube weight in grams

  // Convert volume to ml if imperial
  const teaVolumeMl = useMemo(() => {
    if (!inputs.teaVolume || isNaN(Number(inputs.teaVolume))) return 0;
    const vol = Number(inputs.teaVolume);
    if (inputs.unit === "imperial") {
      // fl oz to ml (1 fl oz = 29.5735 ml)
      return vol * 29.5735;
    }
    return vol;
  }, [inputs.teaVolume, inputs.unit]);

  // Convert sugar input to grams
  const sugarGrams = useMemo(() => {
    if (!inputs.sugarGrams || isNaN(Number(inputs.sugarGrams))) return 0;
    const sugarInput = Number(inputs.sugarGrams);
    if (inputs.sugarUnit === "teaspoons") {
      return sugarInput * GRAMS_PER_TEASPOON;
    }
    return sugarInput;
  }, [inputs.sugarGrams, inputs.sugarUnit]);

  // Calculate sugar cubes equivalent
  const sugarCubes = useMemo(() => {
    if (sugarGrams <= 0) return 0;
    return sugarGrams / SUGAR_CUBE_GRAMS;
  }, [sugarGrams]);

  // Dramatic interpretation based on sugar cubes
  const results = useMemo(() => {
    if (teaVolumeMl <= 0) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }
    if (sugarCubes === 0) {
      return {
        value: "0",
        label: "No Sugar Cubes Here!",
        subtext: "Your tea is as pure as a mountain spring. Bravo!",
        color: "text-green-600",
        icon: <Smile />,
      };
    }

    // Dramatic scale
    let label = "";
    let subtext = "";
    let color = "";
    let icon = <Meh />;

    if (sugarCubes < 1) {
      label = "Less than One Sugar Cube";
      subtext = "Just a whisper of sweetness, barely a sugar footprint.";
      color = "text-blue-600";
      icon = <Smile />;
    } else if (sugarCubes < 3) {
      label = `${sugarCubes.toFixed(1)} Sugar Cubes`;
      subtext = "A modest sugar boost, enough to brighten your sip without guilt.";
      color = "text-yellow-600";
      icon = <Zap />;
    } else if (sugarCubes < 6) {
      label = `${sugarCubes.toFixed(1)} Sugar Cubes`;
      subtext = "Warning: Your tea is flirting with the sweet side of life. Handle with care!";
      color = "text-orange-600";
      icon = <AlertTriangle />;
    } else if (sugarCubes < 10) {
      label = `${sugarCubes.toFixed(1)} Sugar Cubes`;
      subtext = "Sugar overload alert! This tea could fuel a small rocket launch.";
      color = "text-red-600";
      icon = <Flame />;
    } else {
      label = `${sugarCubes.toFixed(1)} Sugar Cubes`;
      subtext = "Sweet apocalypse! You're basically sipping on liquid candy. Proceed at your own risk.";
      color = "text-red-800";
      icon = <Skull />;
    }

    return { value: sugarCubes.toFixed(1), label, subtext, color, icon };
  }, [sugarCubes, teaVolumeMl]);

  const faqs = [
    {
      question: "Why should I care about how much sugar is in my tea?",
      answer:
        "Sugar isn't just a sweetener; it's a sneaky calorie bomb that can add up quickly without you realizing it. Drinking tea with excessive sugar can contribute to health issues like diabetes, obesity, and tooth decay. By understanding exactly how much sugar you consume, you can make smarter choices and still enjoy your cuppa without the guilt.",
    },
    {
      question: "How did sugar cubes come to be the standard for measuring sugar?",
      answer:
        "Before sugar cubes, people had to cut blocks of sugar with knives, which was messy and inconsistent. In 1843, a Viennese man named Jakob Christoph Rad invented the sugar cube to simplify this process. This sweet innovation quickly spread worldwide, becoming the iconic symbol of sugar measurement we recognize today.",
    },
    {
      question: "Is sugar in tea different from sugar in other drinks?",
      answer:
        "Chemically, sugar is sugar, whether in tea, coffee, or soda. However, the perception of sweetness can vary depending on the drink's temperature and other ingredients. Tea often has a more subtle flavor profile, so sugar can dramatically change its taste, making it easier to accidentally over-sweeten your brew.",
    },
    {
      question: "Can I use teaspoons instead of grams for sugar input?",
      answer:
        "Absolutely! Since many people measure sugar by teaspoons rather than grams, this calculator lets you input sugar in either unit. One teaspoon of granulated sugar weighs approximately 4.2 grams, so the tool converts your input behind the scenes to keep the math accurate and your results meaningful.",
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

      {/* Tea Volume Input */}
      <div>
        <Label htmlFor="teaVolume" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Tea Volume ({inputs.unit === "metric" ? "ml" : "fl oz"})
        </Label>
        <Input
          id="teaVolume"
          type="number"
          min="0"
          placeholder={inputs.unit === "metric" ? "e.g. 250" : "e.g. 8"}
          value={inputs.teaVolume}
          onChange={(e) => handleInputChange("teaVolume", e.target.value)}
        />
      </div>

      {/* Sugar Amount Input */}
      <div>
        <Label htmlFor="sugarGrams" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Sugar Amount
        </Label>
        <div className="flex gap-2">
          <Input
            id="sugarGrams"
            type="number"
            min="0"
            placeholder="e.g. 10"
            value={inputs.sugarGrams}
            onChange={(e) => handleInputChange("sugarGrams", e.target.value)}
          />
          <Select
            value={inputs.sugarUnit}
            onValueChange={(v) => handleInputChange("sugarUnit", v)}
            className="w-[120px]"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grams">Grams (g)</SelectItem>
              <SelectItem value="teaspoons">Teaspoons (tsp)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation by updating state (already reactive)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              teaVolume: "",
              sugarGrams: "",
              sugarUnit: "grams",
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding How Much Sugar Is in My Tea? (Dramatic)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Tea is one of the most beloved beverages worldwide, cherished for its soothing warmth and subtle flavors. However, the sugar we add to our tea can quickly transform this gentle drink into a sugar bomb, often without us realizing the extent. Measuring sugar in grams or teaspoons can feel abstract, but visualizing it as sugar cubes makes the concept tangible and dramatic. This calculator helps you see exactly how many sugar cubes you’re sipping, turning a simple cup of tea into a fascinating lesson in nutrition and moderation.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The sugar cube was invented in 1843 by Jakob Christoph Rad, a Viennese man who wanted to simplify the tedious task of cutting sugar from large blocks. Before that, people had to hack away at sugar loaves with knives, a sticky and uneven process. Today, sugar cubes remain a universal symbol of sweetness, making it easier to visualize sugar intake — a perfect metaphor for understanding how much sugar lurks in your tea.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by selecting your preferred unit system: metric for milliliters and grams, or imperial for fluid ounces and teaspoons. Enter the volume of tea you typically drink, then input the amount of sugar you add, either in grams or teaspoons. Hit calculate to see a dramatic visualization of your sugar intake in sugar cubes. If you want to start fresh, just hit reset and try different values to experiment with your sweet tooth limits.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to educate and entertain, so feel free to play around with the numbers and discover how even small changes in sugar can add up. Remember, moderation is key, and sometimes less sugar means more flavor — and a healthier you.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Fun Reads</h2>
        <ul className="space-y-4">
          <li>
            <a href="https://www.britannica.com/topic/sugar" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Sugar History - Britannica <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive overview of sugar’s history, from its origins to modern-day consumption.
            </p>
          </li>
          <li>
            <a href="https://www.nhs.uk/live-well/eat-well/how-to-reduce-your-sugar-intake/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              NHS Guide to Reducing Sugar <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical tips and health advice on cutting down sugar in your diet, including tea.
            </p>
          </li>
          <li>
            <a href="https://www.history.com/news/sugar-cube-invention" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              The Sweet Story of Sugar Cubes <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Dive into the invention of sugar cubes and how they changed the way we sweeten our drinks.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="How Much Sugar Is in My Tea? (Dramatic)"
      description="Visualize your sugar intake. See a dramatic representation of exactly how many sugar cubes you are drinking in your daily tea."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Sugar Cubes = (Sugar Amount in grams) ÷ (4 grams per sugar cube)",
        variables: [
          { name: "Sugar Amount in grams", description: "The total sugar you add to your tea, converted to grams." },
          { name: "4 grams per sugar cube", description: "Average weight of one sugar cube." },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You drink 250 ml of tea and add 2 teaspoons of sugar.",
        steps: [
          { label: "1", explanation: "Convert teaspoons to grams: 2 tsp × 4.2 g/tsp = 8.4 g" },
          { label: "2", explanation: "Calculate sugar cubes: 8.4 g ÷ 4 g/cube = 2.1 cubes" },
          { label: "3", explanation: "Result: Your tea contains about 2.1 sugar cubes worth of sugar." },
        ],
        result: "2.1 sugar cubes",
      }}
      relatedCalculators={[
        { title: "Netflix 'Just One More Episode' Timer", url: "/funny/netflix-one-more-episode-timer", icon: "🤪" },
        { title: "Rocks to Flood a Country Estimator", url: "/funny/rocks-to-flood-country", icon: "✈️" },
        { title: "Zombie Survival Calculator", url: "/funny/zombie-survival-calculator", icon: "🧟" },
        { title: "Loop-the-Loop Speed Calculator", url: "/funny/loop-the-loop-speed-calculator", icon: "✈️" },
        { title: "Tab Overload Anxiety Score", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
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