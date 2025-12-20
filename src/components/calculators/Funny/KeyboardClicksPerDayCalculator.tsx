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

export default function KeyboardClicksPerDayCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    typingSpeed: "", // in words per minute
    typingHours: "", // hours per day typing
    wordsPerClick: "", // average words per keyboard click (usually 1)
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Constants and assumptions:
  // Average word length in English is about 5 characters + 1 space = 6 keystrokes per word.
  // One keyboard click = one keystroke.
  // Typing speed is in words per minute (wpm).
  // Typing hours per day is how many hours user actively types.
  // wordsPerClick is usually 1, but some might consider shortcuts or macros.

  const results = useMemo(() => {
    const wpm = parseFloat(inputs.typingSpeed);
    const hours = parseFloat(inputs.typingHours);
    const wpc = parseFloat(inputs.wordsPerClick);

    if (isNaN(wpm) || wpm <= 0 || isNaN(hours) || hours <= 0 || isNaN(wpc) || wpc <= 0) {
      return { value: "", label: "", subtext: "", color: "text-gray-500", icon: <Meh /> };
    }

    // Calculate total clicks per day:
    // clicks per minute = wpm * 6 (chars per word) / wpc (words per click)
    // total clicks per day = clicks per minute * 60 * hours
    // We divide by wpc because if user inputs >1 words per click (e.g. macros), clicks reduce.

    const clicksPerMinute = (wpm * 6) / wpc;
    const clicksPerDay = clicksPerMinute * 60 * hours;

    // Format result nicely with commas and rounding
    const clicksFormatted = clicksPerDay.toLocaleString(undefined, { maximumFractionDigits: 0 });

    // Fun witty remark based on volume
    let color = "text-blue-600";
    let icon = <Smile />;
    let subtext = "You're typing away like a pro!";

    if (clicksPerDay < 1000) {
      color = "text-gray-600";
      icon = <Meh />;
      subtext = "Are you sure you typed something? That's quite low!";
    } else if (clicksPerDay > 1000000) {
      color = "text-red-600";
      icon = <Flame />;
      subtext = "Whoa! Your fingers must be on fire!";
    } else if (clicksPerDay > 500000) {
      color = "text-yellow-600";
      icon = <Zap />;
      subtext = "Impressive speed! Keyboard warrior alert!";
    }

    return {
      value: clicksFormatted,
      label: "Estimated Keyboard Clicks Per Day",
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is this keyboard clicks estimator?",
      answer:
        "This estimator uses average typing speed and hours spent typing to approximate your daily keyboard clicks. Since typing habits vary widely, the result is an estimate rather than an exact count. Factors like typing style, use of shortcuts, and keyboard layout can influence your actual clicks. Still, it gives a fun ballpark figure to appreciate your daily typing volume!",
    },
    {
      question: "Why do we multiply words per minute by 6 to get clicks?",
      answer:
        "On average, an English word consists of about 5 characters plus a space, totaling roughly 6 keystrokes per word. Each keystroke corresponds to a keyboard click. Multiplying your typing speed by 6 converts words per minute into keystrokes per minute, which is the basis for estimating clicks. This average has been studied extensively in linguistics and typing research to provide a reliable conversion factor.",
    },
    {
      question: "Can macros or shortcuts affect my keyboard clicks count?",
      answer:
        "Absolutely! If you use macros or keyboard shortcuts that input multiple characters or words with a single keypress, your actual clicks will be fewer than the estimate. The calculator allows you to adjust the 'words per click' value to account for this. For example, if one click produces 3 words via a macro, your clicks per day will be roughly a third of the standard calculation.",
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="typingSpeed">Typing Speed (words per minute)</Label>
          <Input
            id="typingSpeed"
            type="number"
            min={1}
            max={300}
            placeholder="e.g., 40"
            value={inputs.typingSpeed}
            onChange={(e) => handleInputChange("typingSpeed", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="typingHours">Typing Hours per Day</Label>
          <Input
            id="typingHours"
            type="number"
            min={0.1}
            max={24}
            step={0.1}
            placeholder="e.g., 4"
            value={inputs.typingHours}
            onChange={(e) => handleInputChange("typingHours", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="wordsPerClick">Average Words per Keyboard Click</Label>
          <Input
            id="wordsPerClick"
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            placeholder="Usually 1"
            value={inputs.wordsPerClick}
            onChange={(e) => handleInputChange("wordsPerClick", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting state again (no-op)
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
              typingSpeed: "",
              typingHours: "",
              wordsPerClick: "",
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Keyboard Clicks per Day Estimator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Have you ever wondered just how many times your fingers tap those tiny keys each day? This estimator helps you quantify your daily keyboard clicks based on your typing speed and how long you spend typing. Since each word averages about six keystrokes—including spaces and punctuation—multiplying your words per minute by six gives a solid estimate of your keystrokes per minute. By factoring in your daily typing hours, we reveal the staggering volume of keyboard clicks you produce, turning mundane typing into a fascinating numerical adventure.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The modern keyboard layout, QWERTY, was designed in the 1870s to slow typists down and prevent mechanical jams in typewriters. Ironically, today’s fastest typists can reach speeds over 200 words per minute, clicking keys faster than the original inventors ever imagined. The average office worker types about 40 words per minute, which still adds up to over 14,000 keyboard clicks in an 8-hour workday!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter your average typing speed in words per minute, how many hours you spend typing each day, and the average number of words produced per keyboard click. Most users will leave the last field at 1, but if you use macros or shortcuts that produce multiple words with a single keystroke, adjust accordingly. Hit calculate, and voilà — your estimated daily keyboard clicks appear, giving you a new appreciation for your typing prowess!
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
            <a href="https://en.wikipedia.org/wiki/QWERTY" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              History of the QWERTY Keyboard <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore how the QWERTY layout was invented to prevent typewriter jams and how it still dominates keyboards today.
            </p>
          </li>
          <li>
            <a href="https://www.typing.com/blog/average-typing-speed" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Average Typing Speeds Around the World <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A fascinating look at typing speeds by country and profession, revealing surprising global typing trends.
            </p>
          </li>
          <li>
            <a href="https://www.linguisticsociety.org/content/average-word-length" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Average Word Length in English <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Linguistic research on how the average English word length is calculated and why it matters for typing metrics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Keyboard Clicks per Day Estimator"
      description="Estimate your daily typing volume. Calculate how many millions of times you click your keyboard over a lifetime of work."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Clicks per Day = (Words per Minute × 6 ÷ Words per Click) × 60 × Typing Hours per Day",
        variables: [
          { symbol: "Words per Minute", description: "Your typing speed in words per minute" },
          { symbol: "6", description: "Average keystrokes per word (5 letters + 1 space)" },
          { symbol: "Words per Click", description: "Average words produced per keyboard click (usually 1)" },
          { symbol: "60", description: "Minutes per hour" },
          { symbol: "Typing Hours per Day", description: "How many hours you spend typing daily" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "If you type 40 words per minute for 4 hours a day, with 1 word per click:",
        steps: [
          { label: "1", explanation: "Calculate keystrokes per minute: 40 × 6 = 240" },
          { label: "2", explanation: "Adjust for words per click: 240 ÷ 1 = 240" },
          { label: "3", explanation: "Calculate clicks per day: 240 × 60 × 4 = 57,600" },
        ],
        result: "You would click approximately 57,600 times per day.",
      }}
      relatedCalculators={[
        { title: "Pokémon GO Weight Loss Calculator", url: "/funny/pokemon-go-weight-loss", icon: "🤪" },
        { title: "Zombie Survival Calculator", url: "/funny/zombie-survival-calculator", icon: "🧟" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "First-Date Awkwardness Meter", url: "/funny/first-date-awkwardness-meter", icon: "❤️" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🤪" },
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