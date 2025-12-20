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

export default function DonutCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    teamSize: "",
    hungerLevel: "moderate",
    isFriday: false,
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Hunger level multipliers roughly based on appetite intensity
  const hungerMultipliers = {
    light: 0.75,
    moderate: 1,
    heavy: 1.5,
  };

  const results = useMemo(() => {
    const teamSize = Number(inputs.teamSize);
    if (!teamSize || teamSize < 1) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "",
        icon: null,
      };
    }

    // Base donuts per person depending on hunger level
    const baseDonutsPerPerson = 1.5 * (hungerMultipliers[inputs.hungerLevel] ?? 1);

    // Friday factor: people tend to indulge more on Fridays
    const fridayBonus = inputs.isFriday ? 0.5 : 0;

    // Total donuts calculation
    const totalDonuts = Math.ceil(teamSize * (baseDonutsPerPerson + fridayBonus));

    // Witty remarks based on quantity
    let color = "text-blue-600";
    let icon = <Smile />;
    let subtext = "Perfect amount to keep everyone happy and productive!";

    if (totalDonuts < teamSize) {
      color = "text-red-600";
      icon = <Frown />;
      subtext = "Uh-oh, not enough donuts! Someone might get hangry.";
    } else if (totalDonuts > teamSize * 3) {
      color = "text-green-700";
      icon = <Sparkles />;
      subtext = "Wow, that's a donut party! Hope you have enough coffee.";
    } else if (totalDonuts > teamSize * 2) {
      color = "text-yellow-600";
      icon = <Meh />;
      subtext = "A generous spread! Donuts for days.";
    }

    return {
      value: totalDonuts.toString(),
      label: `Total Donuts for ${teamSize} ${teamSize === 1 ? "person" : "people"}`,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How many donuts should I get per person?",
      answer:
        "The ideal number of donuts per person depends on appetite and occasion. Typically, 1 to 2 donuts per person satisfy most appetites, but on special days like Fridays, people tend to indulge more. This calculator adjusts for hunger levels and the 'Friday factor' to help you avoid both shortage and waste.",
    },
    {
      question: "Why does the calculator include a 'Friday factor'?",
      answer:
        "Fridays have a special place in office culture as the gateway to the weekend, often celebrated with treats. Studies show that people tend to eat more sweets on Fridays, possibly as a reward or mood booster. Including this factor helps you plan for that extra donut craving and keep morale high.",
    },
    {
      question: "Can I use this calculator for other pastries?",
      answer:
        "Absolutely! While designed for donuts, the logic applies to any similar-sized pastry like bagels or muffins. Just keep in mind the average size and richness, as some pastries might be more filling. Adjust the hunger level accordingly for best results.",
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

      {/* Team Size Input */}
      <div>
        <Label htmlFor="teamSize" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Team Size
        </Label>
        <Input
          id="teamSize"
          type="number"
          min={1}
          placeholder="Enter number of people"
          value={inputs.teamSize}
          onChange={(e) => handleInputChange("teamSize", e.target.value)}
          aria-describedby="teamSizeHelp"
        />
        <p id="teamSizeHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          How many hungry humans are you feeding?
        </p>
      </div>

      {/* Hunger Level Selector */}
      <div>
        <Label htmlFor="hungerLevel" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Hunger Level
        </Label>
        <Select
          id="hungerLevel"
          value={inputs.hungerLevel}
          onValueChange={(v) => handleInputChange("hungerLevel", v)}
        >
          <SelectTrigger className="w-full">
            <Utensils className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light (Just a nibble)</SelectItem>
            <SelectItem value="moderate">Moderate (Average appetite)</SelectItem>
            <SelectItem value="heavy">Heavy (Big eaters!)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Friday Factor Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          id="isFriday"
          type="checkbox"
          checked={inputs.isFriday}
          onChange={(e) => handleInputChange("isFriday", e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="isFriday" className="text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          Is it Friday? (Add extra indulgence)
        </Label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed; results update automatically
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              teamSize: "",
              hungerLevel: "moderate",
              isFriday: false,
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Donut Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Donuts are more than just a sweet treat; they are a cultural icon that brings people together, especially in office settings. This calculator helps you estimate the optimal number of donuts to order based on your team size, their hunger levels, and even the day of the week. By factoring in these variables, you avoid the twin perils of running out or wasting delicious pastries. It’s a smart way to keep morale high and productivity fueled with just the right amount of sugary goodness.
        </p>

        {/* TRIVIA BOX - AI MUST FILL THIS */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The donut’s origin story is as rich as its glaze. Dutch settlers brought the concept of “olykoeks” or oily cakes to America in the 19th century, but it was Hanson Gregory, a ship captain, who famously punched the hole in the center in 1847. This clever innovation allowed the dough to cook evenly, creating the iconic ring shape we adore today. Fun fact: Americans consume over 10 billion donuts annually, making it one of the most beloved snacks nationwide!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Start by entering the number of people you want to feed with donuts. Next, select the hunger level that best describes your team’s appetite — whether they’re nibblers or big eaters. Don’t forget to check the Friday box if you’re ordering for the end of the workweek, when cravings tend to spike. Hit calculate, and voilà! You’ll get a recommended donut count that balances generosity with practicality, ensuring no one leaves the break room disappointed.
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
              href="https://www.history.com/news/who-invented-the-doughnut"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              History.com: Who Invented the Doughnut? <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A fascinating dive into the origins of the donut and the story behind its iconic hole.
            </p>
          </li>
          <li>
            <a
              href="https://www.npd.com/wps/portal/npd/us/news/press-releases/2019/americans-eat-more-than-10-billion-doughnuts-annually-npd-finds/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NPD Group: Americans Eat More Than 10 Billion Doughnuts Annually <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Statistical insights into donut consumption trends across the United States.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Donut Calculator"
      description="Calculate the optimal number of donuts for the office. Adjust for team size, hunger levels, and the 'it is Friday' factor."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Total Donuts = Team Size × (Base Donuts per Person × Hunger Multiplier + Friday Bonus)",
        variables: [
          { name: "Team Size", description: "Number of people to feed" },
          { name: "Base Donuts per Person", description: "Average donuts per person (1.5)" },
          { name: "Hunger Multiplier", description: "Adjusts for appetite (0.75 to 1.5)" },
          { name: "Friday Bonus", description: "Extra donuts for Friday indulgence (0 or 0.5)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You have 10 people with moderate hunger on a Friday.",
        steps: [
          { label: "1", explanation: "Base donuts per person is 1.5." },
          { label: "2", explanation: "Moderate hunger multiplier is 1." },
          { label: "3", explanation: "Friday bonus adds 0.5 donuts per person." },
          { label: "4", explanation: "Calculate: 10 × (1.5 × 1 + 0.5) = 20 donuts." },
        ],
        result: "Order 20 donuts to satisfy your team perfectly.",
      }}
      relatedCalculators={[
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Netflix 'Just One More Episode' Timer", url: "/funny/netflix-one-more-episode-timer", icon: "🤪" },
        { title: "Crinkle Crankle Wall Brick Saver", url: "/funny/crinkle-crankle-wall-brick-saver", icon: "🤪" },
        { title: "Plant Watering Procrastination Index", url: "/funny/plant-watering-procrastination-index", icon: "🤪" },
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