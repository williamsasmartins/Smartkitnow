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

export default function CoffeeStrengthVsProductivityMemeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    coffeeStrength: "", // in mg caffeine per 100ml or per fl oz
    coffeeVolume: "", // in ml or fl oz
    hoursWorked: "", // hours of focused work
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Constants for caffeine lethal dose and productivity baseline
  const LETHAL_DOSE_MG = 10000; // ~10g caffeine lethal dose for average adult
  const BASE_PRODUCTIVITY = 50; // baseline productivity score without caffeine

  // Helper to convert volume to ml if imperial
  const volumeInMl = useMemo(() => {
    if (!inputs.coffeeVolume) return 0;
    const vol = parseFloat(inputs.coffeeVolume);
    if (isNaN(vol) || vol <= 0) return 0;
    return inputs.unit === "imperial" ? vol * 29.5735 : vol;
  }, [inputs.coffeeVolume, inputs.unit]);

  // Helper to get caffeine strength in mg per ml
  const caffeineMgPerMl = useMemo(() => {
    if (!inputs.coffeeStrength) return 0;
    const strength = parseFloat(inputs.coffeeStrength);
    if (isNaN(strength) || strength <= 0) return 0;
    // strength input is mg caffeine per 100ml (metric) or per fl oz (imperial)
    if (inputs.unit === "imperial") {
      // convert mg per fl oz to mg per ml: 1 fl oz = 29.5735 ml
      return strength / 29.5735;
    }
    // metric: mg per 100 ml, convert to mg per ml
    return strength / 100;
  }, [inputs.coffeeStrength, inputs.unit]);

  // Total caffeine intake in mg
  const totalCaffeineMg = useMemo(() => {
    return volumeInMl * caffeineMgPerMl;
  }, [volumeInMl, caffeineMgPerMl]);

  // Productivity score calculation
  // Hypothesis: Productivity increases with caffeine intake up to a point (~400mg),
  // then declines due to jitters/anxiety.
  // Also factor in hours worked: more hours can dilute productivity per hour.
  // Formula (arbitrary but fun):
  // productivity = BASE_PRODUCTIVITY + (caffeineEffect) - (overdosePenalty) - (fatiguePenalty)
  // caffeineEffect = 100 * (1 - e^(-totalCaffeineMg/200))  (rapid rise then plateau)
  // overdosePenalty = 0 if caffeine < 400mg else (caffeine - 400)^1.5 / 50
  // fatiguePenalty = max(0, hoursWorked - 6) * 5 (penalty after 6 hours)
  // Clamp productivity between 0 and 200

  const results = useMemo(() => {
    const coffeeStrengthNum = parseFloat(inputs.coffeeStrength);
    const coffeeVolumeNum = parseFloat(inputs.coffeeVolume);
    const hoursWorkedNum = parseFloat(inputs.hoursWorked);

    if (
      !coffeeStrengthNum || coffeeStrengthNum <= 0 ||
      !coffeeVolumeNum || coffeeVolumeNum <= 0 ||
      !hoursWorkedNum || hoursWorkedNum <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-slate-600",
        icon: <Coffee className="mx-auto h-10 w-10 text-slate-400" />,
      };
    }

    // Check lethal dose warning
    if (totalCaffeineMg > LETHAL_DOSE_MG) {
      return {
        value: "☠️",
        label: "Lethal Dose Alert!",
        subtext: "You've entered a caffeine amount that could be fatal. Please drink responsibly!",
        color: "text-red-700",
        icon: <Skull className="mx-auto h-10 w-10 text-red-700" />,
      };
    }

    // Calculate caffeine effect
    const caffeineEffect = 100 * (1 - Math.exp(-totalCaffeineMg / 200));
    const overdosePenalty = totalCaffeineMg > 400 ? Math.pow(totalCaffeineMg - 400, 1.5) / 50 : 0;
    const fatiguePenalty = hoursWorkedNum > 6 ? (hoursWorkedNum - 6) * 5 : 0;

    let productivity = BASE_PRODUCTIVITY + caffeineEffect - overdosePenalty - fatiguePenalty;
    productivity = Math.max(0, Math.min(200, productivity));

    // Determine label and icon based on productivity
    let label = "";
    let subtext = "";
    let color = "";
    let icon = null;

    if (productivity < 50) {
      label = "Low Productivity";
      subtext = "Maybe skip the coffee and take a nap instead.";
      color = "text-slate-500";
      icon = <Frown className="mx-auto h-10 w-10 text-slate-500" />;
    } else if (productivity < 100) {
      label = "Moderate Productivity";
      subtext = "You're getting there, but a little more caffeine might help.";
      color = "text-yellow-600";
      icon = <Meh className="mx-auto h-10 w-10 text-yellow-600" />;
    } else if (productivity < 150) {
      label = "Peak Productivity";
      subtext = "You're in the zone! Keep that coffee coming.";
      color = "text-green-600";
      icon = <Smile className="mx-auto h-10 w-10 text-green-600" />;
    } else {
      label = "Jittery Overload";
      subtext = "Too much caffeine! Your hands might start typing faster than your brain.";
      color = "text-red-600";
      icon = <Zap className="mx-auto h-10 w-10 text-red-600" />;
    }

    return {
      value: productivity.toFixed(0),
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs, totalCaffeineMg]);

  const faqs = [
    {
      question: "How does coffee strength affect productivity?",
      answer:
        "Coffee strength, measured by caffeine concentration, directly influences how alert and focused you feel. Moderate caffeine intake stimulates your central nervous system, improving concentration and reaction times. However, too much caffeine can cause jitters and anxiety, which ironically reduce productivity. This calculator helps you find that sweet spot where caffeine fuels your work without backfiring.",
    },
    {
      question: "Why do we measure coffee strength in mg per 100ml or fl oz?",
      answer:
        "Caffeine content varies widely depending on coffee type, brewing method, and serving size. Measuring strength in mg per 100ml (metric) or per fl oz (imperial) standardizes this variability, allowing for accurate comparisons. For example, espresso packs about 212 mg per 100ml, while drip coffee averages 40-80 mg per 100ml. This unit-based approach helps you tailor your caffeine intake precisely.",
    },
    {
      question: "Is there a lethal dose of caffeine?",
      answer:
        "Yes, although it’s quite high and rarely reached through normal consumption. The estimated lethal dose of caffeine for an average adult is about 10 grams, equivalent to roughly 100 cups of brewed coffee in a short time. Interestingly, the energizing effects peak around 200-400 mg, so it’s best to stay well below dangerous levels. This calculator warns you if your input exceeds safe caffeine limits.",
    },
    {
      question: "How does working longer hours affect productivity with caffeine?",
      answer:
        "While caffeine can boost alertness, prolonged work hours introduce fatigue that caffeine alone can’t fully counteract. After about 6 hours of focused work, diminishing returns set in, and productivity tends to drop despite caffeine intake. This calculator factors in fatigue penalties to reflect how extended work sessions may reduce your overall efficiency, encouraging balanced breaks and rest.",
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

      {/* Coffee Strength Input */}
      <div>
        <Label htmlFor="coffeeStrength" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Coffee Strength (mg caffeine per {inputs.unit === "metric" ? "100 ml" : "fl oz"})
        </Label>
        <Input
          id="coffeeStrength"
          type="number"
          min={0}
          step={1}
          placeholder={inputs.unit === "metric" ? "e.g. 80" : "e.g. 24"}
          value={inputs.coffeeStrength}
          onChange={(e) => handleInputChange("coffeeStrength", e.target.value)}
        />
      </div>

      {/* Coffee Volume Input */}
      <div>
        <Label htmlFor="coffeeVolume" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Coffee Volume ({inputs.unit === "metric" ? "ml" : "fl oz"})
        </Label>
        <Input
          id="coffeeVolume"
          type="number"
          min={0}
          step={1}
          placeholder={inputs.unit === "metric" ? "e.g. 250" : "e.g. 8"}
          value={inputs.coffeeVolume}
          onChange={(e) => handleInputChange("coffeeVolume", e.target.value)}
        />
      </div>

      {/* Hours Worked Input */}
      <div>
        <Label htmlFor="hoursWorked" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Hours of Focused Work
        </Label>
        <Input
          id="hoursWorked"
          type="number"
          min={0}
          step={0.1}
          placeholder="e.g. 5"
          value={inputs.hoursWorked}
          onChange={(e) => handleInputChange("hoursWorked", e.target.value)}
        />
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
          onClick={() => setInputs({ unit: "metric", coffeeStrength: "", coffeeVolume: "", hoursWorked: "" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Coffee Strength vs Productivity Score</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Coffee is more than just a morning ritual; it’s a complex chemical cocktail that can either turbocharge your workday or send you spiraling into jittery chaos. The strength of your coffee, measured by caffeine concentration, plays a pivotal role in how productive you feel. Too little caffeine might leave you yawning through spreadsheets, while too much can cause anxiety and reduce focus. This calculator helps you navigate that delicate balance by combining your coffee’s strength, volume, and your hours of focused work into a fun productivity score.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Legend has it that coffee was discovered by Ethiopian goat herders who noticed their goats dancing energetically after nibbling on coffee cherries. Since then, coffee has evolved into a global obsession, with Finland consuming the most coffee per capita worldwide. Interestingly, the lethal dose of caffeine is about 10 grams—roughly 100 cups of coffee in a short time—so while coffee fuels your productivity, moderation is key!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by selecting your preferred unit system: metric or imperial. Then, enter the caffeine strength of your coffee—this is usually listed on packaging or can be estimated based on the type of coffee you drink. Next, input the volume of coffee you plan to consume, followed by the number of hours you expect to work with focus. Hit calculate to reveal your productivity score, which reflects how your caffeine intake and work duration interact. Use this insight to adjust your coffee habits for optimal performance without the jitters.
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
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3777299/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              National Institutes of Health: Caffeine and Health <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive review of caffeine’s effects on human health, including metabolism and toxicity.
            </p>
          </li>
          <li>
            <a href="https://www.ncausa.org/About-Coffee/History-of-Coffee" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              National Coffee Association USA: History of Coffee <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Dive into the fascinating origins of coffee and how it became the world’s favorite energizer.
            </p>
          </li>
          <li>
            <a href="https://www.statista.com/statistics/507950/coffee-consumption-per-capita-in-selected-countries/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Statista: Coffee Consumption Per Capita <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore global coffee consumption trends, including Finland’s top spot for coffee lovers.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Coffee Strength vs Productivity Score"
      description="Chart your caffeine intake against work output. Find the sweet spot between 'peak productivity' and 'jittery chaos'."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula:
          "Productivity = BASE + 100 × (1 - e^(-CaffeineMg / 200)) - OverdosePenalty - FatiguePenalty",
        variables: [
          { name: "BASE", description: "Baseline productivity score (50)" },
          { name: "CaffeineMg", description: "Total caffeine intake in mg" },
          { name: "OverdosePenalty", description: "Penalty for caffeine > 400mg, calculated as (CaffeineMg - 400)^1.5 / 50" },
          { name: "FatiguePenalty", description: "Penalty for working over 6 hours, 5 points per extra hour" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You drink 250 ml of coffee with 80 mg caffeine per 100 ml and work 5 hours.",
        steps: [
          { label: "1", explanation: "Calculate total caffeine: 250 ml × (80 mg / 100 ml) = 200 mg" },
          { label: "2", explanation: "Calculate caffeine effect: 100 × (1 - e^(-200/200)) ≈ 63.2" },
          { label: "3", explanation: "No overdose penalty since 200 mg < 400 mg" },
          { label: "4", explanation: "No fatigue penalty since 5 hours < 6 hours" },
          { label: "5", explanation: "Total productivity = 50 + 63.2 = 113.2 (Peak Productivity)" },
        ],
        result: "Your productivity score is approximately 113, indicating you’re in the productivity sweet spot!",
      }}
      relatedCalculators={[
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
        { title: "Love Meter (Name Compatibility)", url: "/funny/love-meter", icon: "❤️" },
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
        { title: "Meetings Wasted-Time Counter", url: "/funny/meetings-wasted-time-counter", icon: "💻" },
        { title: "Vacation Budget Reality Check", url: "/funny/vacation-budget-reality-check", icon: "🐈" },
        { title: "Hot-Dog to Bun Mismatch Solver", url: "/funny/hot-dog-bun-mismatch-solver", icon: "🍩" },
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