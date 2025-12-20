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

export default function PizzaSlicesPerPersonRegretIndexCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    totalSlices: "",
    totalPeople: "",
    averageSlicesPerPerson: "",
  });
  const handleInputChange = useCallback(
    (n, v) => setInputs((p) => ({ ...p, [n]: v })),
    []
  );

  const results = useMemo(() => {
    const totalSlices = Number(inputs.totalSlices);
    const totalPeople = Number(inputs.totalPeople);

    if (
      !totalSlices ||
      !totalPeople ||
      totalSlices < 1 ||
      totalPeople < 1 ||
      isNaN(totalSlices) ||
      isNaN(totalPeople)
    ) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-slate-500",
        icon: <Info />,
      };
    }

    // Calculate slices per person (average)
    const slicesPerPerson = totalSlices / totalPeople;

    // Regret Index logic:
    // If slices per person < 2 => High regret (frown)
    // 2 <= slices per person < 3 => Meh (neutral)
    // 3 <= slices per person < 4 => Smile (happy)
    // >=4 => Overeating risk (skull)
    // We scale regret index 0-100 where 0 = perfect, 100 = max regret

    let regretIndex = 0;
    let label = "";
    let subtext = "";
    let color = "";
    let icon = <Smile />;

    if (slicesPerPerson < 2) {
      regretIndex = Math.min(100, Math.round((2 - slicesPerPerson) * 50));
      label = "Pizza Regret: Starving Edition";
      subtext =
        "You might regret not ordering more slices. Nobody likes a hangry party! 🍕😩";
      color = "text-red-600";
      icon = <Frown />;
    } else if (slicesPerPerson >= 2 && slicesPerPerson < 3) {
      regretIndex = Math.round(50 - (slicesPerPerson - 2) * 25);
      label = "Pizza Regret: Balanced Bite";
      subtext =
        "A decent slice count, but some might still want a little more. Keep an eye on those cravings!";
      color = "text-yellow-600";
      icon = <Meh />;
    } else if (slicesPerPerson >= 3 && slicesPerPerson < 4) {
      regretIndex = Math.max(0, 25 - (slicesPerPerson - 3) * 25);
      label = "Pizza Regret: Satisfied Slices";
      subtext =
        "Everyone’s happily munching away. The perfect pizza party slice count! 🍕😄";
      color = "text-green-600";
      icon = <Smile />;
    } else {
      regretIndex = Math.min(100, Math.round((slicesPerPerson - 4) * 50));
      label = "Pizza Regret: Overindulgence Alert";
      subtext =
        "Too many slices! Beware the dreaded pizza coma and regretful food baby. 🍕💀";
      color = "text-purple-700";
      icon = <Skull />;
    }

    return {
      value: slicesPerPerson.toFixed(2),
      label,
      subtext,
      color,
      icon,
      regretIndex,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I know how many pizza slices per person is ideal?",
      answer:
        "The ideal number of pizza slices per person depends on appetite, slice size, and occasion. Typically, 2-3 slices per person satisfy most adults, balancing hunger and avoiding waste. This calculator helps you estimate that sweet spot by dividing total slices by guests, factoring in a 'regret index' to warn if you’re under- or over-ordering.",
    },
    {
      question: "Why is there a 'Regret Index' for pizza slices?",
      answer:
        "The 'Regret Index' is a playful way to quantify the emotional aftermath of your pizza party choices. Ordering too few slices leads to hangry guests and regret, while too many slices can cause overeating and food comas. This index helps you find the Goldilocks zone—just right to keep everyone happy and avoid waste.",
    },
    {
      question: "Does pizza slice size vary globally?",
      answer:
        "Absolutely! Pizza slice sizes differ worldwide, influenced by cultural preferences and pizza styles. For example, New York slices are famously large and foldable, while Neapolitan slices are smaller and softer. This variation means slice count alone isn’t always perfect, but it’s a fun and practical estimate for most parties.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[140px]">
            <Globe className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="totalSlices" className="mb-1 block font-semibold">
            Total Pizza Slices
          </Label>
          <Input
            id="totalSlices"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 16"
            value={inputs.totalSlices}
            onChange={(e) => handleInputChange("totalSlices", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="totalPeople" className="mb-1 block font-semibold">
            Number of People
          </Label>
          <Input
            id="totalPeople"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 5"
            value={inputs.totalPeople}
            onChange={(e) => handleInputChange("totalPeople", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ unit: "metric", totalSlices: "", totalPeople: "" })
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
            <p className={`text-5xl font-extrabold ${results.color}`}>
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
              {results.label}
            </p>
            <p className="mt-2 text-sm italic text-slate-500">
              {results.subtext}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Pizza Slices per Person &amp; Regret Index
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calculating the right number of pizza slices per person is both an art
          and a science. It’s about balancing appetites, slice sizes, and the
          inevitable human tendency to either over-order or under-order. The
          Regret Index adds a fun twist by quantifying the emotional aftermath:
          too few slices and your guests might leave hungry and grumpy; too many
          and you risk the dreaded pizza coma and food waste. This calculator
          helps you find that Goldilocks zone where everyone leaves satisfied and
          no one regrets their choices.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">
              Did You Know?
            </h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Norway tops the charts for pizza consumption per capita, with the
            average Norwegian devouring over 12 kilograms of pizza annually. And
            speaking of origins, the iconic Margherita pizza was created in Naples
            in 1889 to honor Queen Margherita of Savoy, featuring the colors of the
            Italian flag: red tomatoes, white mozzarella, and green basil. So,
            every slice you enjoy carries a delicious slice of history!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the total number of pizza slices you plan to order and the
          number of people attending your pizza party. The calculator will then
          determine the average slices per person and provide a Regret Index to
          warn you if you’re likely to run short or have too many leftovers. Use
          the unit selector to toggle between metric and imperial if you want to
          consider pizza size or weight in future upgrades. This tool is perfect
          for parties, office lunches, or any pizza gathering where you want to
          avoid the awkward “who ate the last slice?” moment.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References &amp; Fun Reads
        </h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.statista.com/statistics/263937/pizza-consumption-in-selected-countries/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Statista: Pizza Consumption by Country{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A detailed report on global pizza consumption trends and per capita
              statistics.
            </p>
          </li>
          <li>
            <a
              href="https://www.history.com/news/who-invented-pizza"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              History.com: Who Invented Pizza?{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore the fascinating origins of pizza and the story behind the
              Margherita.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pizza Slices per Person &amp; Regret Index"
      description="Plan your pizza party perfectly. Estimate slices per person and calculate the potential 'regret index' for overeating."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula:
          "Slices per Person = Total Pizza Slices ÷ Number of People\nRegret Index is a playful scale based on slices per person to estimate satisfaction or regret.",
        variables: [
          { symbol: "Total Pizza Slices", description: "The total number of pizza slices ordered." },
          { symbol: "Number of People", description: "The total number of guests eating pizza." },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You order 16 slices of pizza for 5 people. How many slices does each person get, and what is the regret index?",
        steps: [
          {
            label: "1",
            explanation:
              "Divide total slices by people: 16 ÷ 5 = 3.2 slices per person on average.",
          },
          {
            label: "2",
            explanation:
              "Since 3.2 slices per person is between 3 and 4, the regret index is low, indicating a happy and satisfied group.",
          },
        ],
        result:
          "Each person gets about 3.2 slices, with a low regret index meaning your pizza party is a success!",
      }}
      relatedCalculators={[
        {
          title: "First-Date Awkwardness Meter",
          url: "/funny/first-date-awkwardness-meter",
          icon: "❤️",
        },
        {
          title: "Pizza Size/Price Comparison Calculator",
          url: "/funny/pizza-size-price-comparison",
          icon: "🍕",
        },
        {
          title: "Meetings Wasted-Time Counter",
          url: "/funny/meetings-wasted-time-counter",
          icon: "💻",
        },
        {
          title: "Black Hole Sun Impact Calculator",
          url: "/funny/black-hole-sun-impact",
          icon: "🧟",
        },
        {
          title: "Plant Watering Procrastination Index",
          url: "/funny/plant-watering-procrastination-index",
          icon: "🤪",
        },
        {
          title: "Tab Overload Anxiety Score",
          url: "/funny/tab-overload-anxiety-score",
          icon: "💻",
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