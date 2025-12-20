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

export default function CoffeeAddictionMeterCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    cupsPerDay: "",
    cupSize: "medium",
    yearsDrinking: "",
    sleepHours: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Cup size in ml or oz depending on unit
  const cupSizesMetric = { small: 150, medium: 240, large: 350 };
  const cupSizesImperial = { small: 5, medium: 8, large: 12 };

  const results = useMemo(() => {
    const cups = Number(inputs.cupsPerDay);
    const years = Number(inputs.yearsDrinking);
    const sleep = Number(inputs.sleepHours);
    if (isNaN(cups) || cups < 0 || isNaN(years) || years < 0 || isNaN(sleep) || sleep < 0) {
      return { value: "", label: "", subtext: "", color: "", icon: null };
    }
    if (cups === 0) {
      return {
        value: "0",
        label: "Coffee-Free Legend",
        subtext: "You’re either a tea person or a sleep enthusiast. Either way, your heart thanks you!",
        color: "text-green-600",
        icon: <Smile />,
      };
    }

    // Calculate daily caffeine intake estimate (mg)
    // Average caffeine per ml coffee ~0.4 mg/ml (varies by brew)
    // Cup size in ml or oz converted to ml
    const cupSizeMl =
      inputs.unit === "metric"
        ? cupSizesMetric[inputs.cupSize] || 240
        : (cupSizesImperial[inputs.cupSize] || 8) * 29.5735;

    const caffeineMgPerDay = cups * cupSizeMl * 0.4;

    // Addiction score base: caffeine intake + years drinking weighted + sleep deficit penalty
    // Sleep deficit: recommended 7-9 hours, penalty if <7
    const sleepDeficit = sleep < 7 ? 7 - sleep : 0;

    // Score formula (arbitrary for fun):
    // score = caffeineMgPerDay / 100 + years * 0.5 + sleepDeficit * 2
    let score = caffeineMgPerDay / 100 + years * 0.5 + sleepDeficit * 2;

    // Cap score max 100 for display
    if (score > 100) score = 100;

    // Determine label and icon based on score
    let label = "";
    let icon = null;
    let color = "";
    let subtext = "";

    if (score < 10) {
      label = "Casual Sipper";
      icon = <Meh />;
      color = "text-blue-600";
      subtext = "You enjoy coffee but it’s not running your life. Keep it chill!";
    } else if (score < 25) {
      label = "Daily Drinker";
      icon = <Coffee />;
      color = "text-yellow-600";
      subtext = "Your coffee habit is steady. You probably know your barista by name.";
    } else if (score < 50) {
      label = "Caffeine Enthusiast";
      icon = <Zap />;
      color = "text-orange-600";
      subtext = "You rely on coffee to power through your day. Beware the jitters!";
    } else if (score < 75) {
      label = "Coffee Addict";
      icon = <Frown />;
      color = "text-red-600";
      subtext = "Your coffee intake is high and your sleep might be suffering. Time to reconsider?";
    } else {
      label = "Caffeine Zombie";
      icon = <Skull />;
      color = "text-purple-700";
      subtext = "You’re practically fueled by coffee alone. Remember, even goats discovered coffee by accident!";
    }

    return {
      value: score.toFixed(1),
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How much caffeine is too much?",
      answer:
        "The lethal dose of caffeine is estimated to be around 10 grams for an average adult, which translates to roughly 80-100 cups of coffee in a short time. However, consuming more than 400 mg daily (about 4 cups) can cause side effects like insomnia, jitters, and increased heart rate. Understanding your caffeine tolerance helps you avoid addiction and health risks.",
    },
    {
      question: "Why do people get addicted to coffee?",
      answer:
        "Coffee addiction stems from caffeine’s ability to block adenosine receptors in the brain, reducing tiredness and boosting alertness. Over time, your brain craves caffeine to function normally, leading to dependence. Interestingly, coffee’s discovery is linked to Ethiopian goats who became energetic after eating coffee cherries, sparking human curiosity.",
    },
    {
      question: "Can coffee addiction affect sleep?",
      answer:
        "Absolutely! Caffeine is a stimulant that can delay your sleep onset and reduce sleep quality, especially if consumed late in the day. Chronic sleep deprivation caused by excessive coffee intake can create a vicious cycle where you rely more on caffeine to stay awake. Balancing coffee consumption with healthy sleep habits is key to breaking this cycle.",
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

      {/* Cups per day */}
      <div>
        <Label htmlFor="cupsPerDay" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          How many cups of coffee do you drink daily?
        </Label>
        <Input
          id="cupsPerDay"
          type="number"
          min={0}
          placeholder="e.g. 3"
          value={inputs.cupsPerDay}
          onChange={(e) => handleInputChange("cupsPerDay", e.target.value)}
        />
      </div>

      {/* Cup size */}
      <div>
        <Label htmlFor="cupSize" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Select your usual cup size
        </Label>
        <Select value={inputs.cupSize} onValueChange={(v) => handleInputChange("cupSize", v)}>
          <SelectTrigger id="cupSize" className="w-full">
            <Coffee className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">
              Small ({inputs.unit === "metric" ? "150 ml" : "5 oz"})
            </SelectItem>
            <SelectItem value="medium">
              Medium ({inputs.unit === "metric" ? "240 ml" : "8 oz"})
            </SelectItem>
            <SelectItem value="large">
              Large ({inputs.unit === "metric" ? "350 ml" : "12 oz"})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Years drinking */}
      <div>
        <Label htmlFor="yearsDrinking" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          How many years have you been drinking coffee regularly?
        </Label>
        <Input
          id="yearsDrinking"
          type="number"
          min={0}
          placeholder="e.g. 5"
          value={inputs.yearsDrinking}
          onChange={(e) => handleInputChange("yearsDrinking", e.target.value)}
        />
      </div>

      {/* Sleep hours */}
      <div>
        <Label htmlFor="sleepHours" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          On average, how many hours of sleep do you get per night?
        </Label>
        <Input
          id="sleepHours"
          type="number"
          min={0}
          max={24}
          placeholder="e.g. 6"
          value={inputs.sleepHours}
          onChange={(e) => handleInputChange("sleepHours", e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (noop here)
            setInputs((p) => ({ ...p }));
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              cupsPerDay: "",
              cupSize: "medium",
              yearsDrinking: "",
              sleepHours: "",
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Coffee Addiction Meter</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Coffee addiction is more than just a morning ritual; it’s a complex interplay between caffeine intake, brain chemistry, and lifestyle habits. This meter estimates your addiction level by considering how much coffee you drink daily, how long you've been a coffee lover, and how your sleep patterns might be affected. The goal is to provide a fun yet insightful glimpse into your caffeine dependency, helping you understand if you’re a casual sipper or a full-blown caffeine zombie. By quantifying these factors, we can better appreciate how coffee influences our daily lives and health.
        </p>

        {/* TRIVIA BOX - AI MUST FILL THIS */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The energizing magic of coffee was reportedly discovered by Ethiopian goat herders around the 9th century, who noticed their goats became unusually lively after nibbling on coffee cherries. This serendipitous discovery eventually led to coffee becoming the world’s second most traded commodity after oil. Interestingly, the average lethal dose of caffeine is about 10 grams, which is roughly equivalent to drinking 80-100 cups of coffee in a short period — so moderation is key!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Coffee Addiction Meter is as easy as your morning brew. Start by selecting your preferred measurement unit — metric or imperial — to match your usual coffee cup sizes. Then, input how many cups you drink daily, choose your typical cup size, enter how many years you’ve been a regular coffee drinker, and finally, share your average nightly sleep hours. Hit calculate, and voilà! You’ll receive a witty, personalized assessment of your coffee addiction level, complete with fun facts and tips to keep your caffeine habit in check.
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
              A comprehensive review of caffeine’s effects on human health, including addiction and toxicity.
            </p>
          </li>
          <li>
            <a href="https://www.history.com/news/who-invented-coffee" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              History.com: The Origins of Coffee <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore the fascinating story of how coffee was discovered and became a global sensation.
            </p>
          </li>
          <li>
            <a href="https://www.sleepfoundation.org/nutrition/caffeine-and-sleep" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Sleep Foundation: Caffeine and Sleep <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Learn how caffeine impacts your sleep cycle and tips for balancing your coffee intake.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Coffee Addiction Meter"
      description="Assess your coffee dependency level. Answer fun questions to see if you run on caffeine or actual sleep."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Score = (Daily Caffeine Intake in mg / 100) + (Years Drinking × 0.5) + (Sleep Deficit × 2)",
        variables: [
          { name: "Daily Caffeine Intake", description: "Estimated caffeine consumed daily in milligrams" },
          { name: "Years Drinking", description: "Number of years you have been drinking coffee regularly" },
          { name: "Sleep Deficit", description: "Difference between 7 hours and your average sleep hours if less than 7" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You drink 3 medium cups (240 ml each) daily, have been drinking coffee for 5 years, and sleep 6 hours per night.",
        steps: [
          {
            label: "1",
            explanation: "Calculate daily caffeine: 3 cups × 240 ml × 0.4 mg/ml = 288 mg",
          },
          {
            label: "2",
            explanation: "Calculate sleep deficit: 7 - 6 = 1 hour",
          },
          {
            label: "3",
            explanation: "Apply formula: (288 / 100) + (5 × 0.5) + (1 × 2) = 2.88 + 2.5 + 2 = 7.38",
          },
        ],
        result: "Your Coffee Addiction Score is 7.4, placing you in the 'Casual Sipper' category.",
      }}
      relatedCalculators={[
        { title: "Social Media Time Alternatives", url: "/funny/social-media-time-alternatives", icon: "🤪" },
        { title: "Rocks to Flood a Country Estimator", url: "/funny/rocks-to-flood-country", icon: "✈️" },
        { title: "Drake Equation Calculator", url: "/funny/drake-equation-calculator", icon: "🤪" },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
        { title: "BBQ 'Who Brings the Charcoal?' Splitter", url: "/funny/bbq-charcoal-splitter", icon: "🍩" },
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