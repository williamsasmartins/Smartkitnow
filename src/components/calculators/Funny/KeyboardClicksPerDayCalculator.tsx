import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Lightbulb, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function KeyboardClicksPerDayCalculator() {
  // Inputs: average typing speed (words per minute), average words typed per day, average characters per word
  // Formula: Total clicks per day = words per day × characters per word
  // We don't need WPM for clicks/day directly, but can show it optionally or for validation.

  const [inputs, setInputs] = useState({
    wordsPerDay: "",
    charsPerWord: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and empty string
    if (/^\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const wordsPerDay = Number(inputs.wordsPerDay);
    const charsPerWord = Number(inputs.charsPerWord);

    if (!inputs.wordsPerDay || !inputs.charsPerWord) {
      // Neutral state on empty inputs
      return { value: null };
    }

    if (wordsPerDay <= 0 || charsPerWord <= 0) {
      return {
        value: null,
        label: "Invalid input",
        subtext: "Please enter positive numbers.",
        color: "text-red-600",
        icon: <RotateCcw />,
      };
    }

    // Calculate total keyboard clicks per day
    // Each character typed is a click, roughly.
    // We assume no special keys or corrections for simplicity.
    const totalClicks = wordsPerDay * charsPerWord;

    // Format number with commas
    const formattedClicks = totalClicks.toLocaleString("en-US");

    return {
      value: formattedClicks,
      label: "Estimated Keyboard Clicks per Day",
      subtext: `Based on typing ${wordsPerDay.toLocaleString()} words/day with an average of ${charsPerWord} characters/word.`,
      color: "text-blue-600",
      icon: <Smile />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is this estimator?",
      answer:
        "This estimator provides a rough approximation based on average words typed per day and average characters per word. Actual keyboard clicks may vary depending on typing habits, use of shortcuts, and corrections.",
    },
    {
      question: "Why don't you include typing speed (WPM)?",
      answer:
        "Typing speed affects how fast you type but not the total number of clicks per day. This calculator focuses on total daily volume rather than speed.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="wordsPerDay" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Average Words Typed per Day
        </Label>
        <Input
          id="wordsPerDay"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="e.g. 3000"
          value={inputs.wordsPerDay}
          onChange={(e) => handleInputChange("wordsPerDay", e.target.value)}
          aria-describedby="wordsPerDayHelp"
        />
        <p id="wordsPerDayHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter the average number of words you type daily.
        </p>
      </div>

      <div>
        <Label htmlFor="charsPerWord" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Average Characters per Word
        </Label>
        <Input
          id="charsPerWord"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="e.g. 5"
          value={inputs.charsPerWord}
          onChange={(e) => handleInputChange("charsPerWord", e.target.value)}
          aria-describedby="charsPerWordHelp"
        />
        <p id="charsPerWordHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Typical English word length is around 5 characters.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special calculation needed on button click since useMemo updates automatically
          }}
          aria-label="Calculate keyboard clicks per day"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ wordsPerDay: "", charsPerWord: "" })}
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
          Understanding Keyboard Clicks per Day Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This estimator helps you approximate how many times you press keys on your keyboard each day based on your typing habits. By inputting your average words typed daily and the average characters per word, you get a realistic estimate of your daily keyboard clicks. This can be useful for understanding your typing workload or for ergonomic and productivity considerations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Keep in mind that this is a simplified model and does not account for special keys, shortcuts, or corrections, but it provides a solid baseline for most typical typing scenarios.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The average professional typist can press around 40,000 keys per hour, which means a typical 8-hour workday could involve over 300,000 keyboard clicks. This highlights the importance of ergonomic keyboards and proper typing posture to prevent strain.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Estimator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the average number of words you type each day and the average number of characters per word. If you’re unsure about the characters per word, the default English average is about 5 characters. Then click the calculate button to see your estimated keyboard clicks per day.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          You can reset the inputs anytime to try different scenarios or update your typing habits. This tool is designed to be quick and easy to use for anyone curious about their typing volume.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        {faqs.map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">{question}</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-1">{answer}</p>
          </div>
        ))}
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Typing"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Typing - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Overview of typing and keyboard usage statistics.
            </p>
          </li>
          <li>
            <a
              href="https://ergonomics.uq.edu.au/typing-and-keyboarding"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Typing Ergonomics - University of Queensland <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Information on keyboard usage and ergonomic recommendations.
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
        formula: "Total Clicks = Words per Day × Characters per Word",
        variables: [
          { symbol: "Total Clicks", description: "Estimated keyboard clicks per day" },
          { symbol: "Words per Day", description: "Average number of words typed daily" },
          { symbol: "Characters per Word", description: "Average number of characters in each word" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "If you type 3,000 words per day with an average of 5 characters per word:",
        steps: [
          { label: "1", explanation: "Multiply 3,000 words by 5 characters." },
          { label: "2", explanation: "3,000 × 5 = 15,000 keyboard clicks per day." },
        ],
        result: "You would press approximately 15,000 keys daily.",
      }}
      relatedCalculators={[
        { title: "Tab Overload Anxiety Score", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
        { title: "Ideal Egg Boiling Calculator", url: "/funny/ideal-egg-boiling-calculator", icon: "🤪" },
        { title: "Plant Watering Procrastination Index", url: "/funny/plant-watering-procrastination-index", icon: "🤪" },
        { title: "Pizza Size/Price Comparison Calculator", url: "/funny/pizza-size-price-comparison", icon: "🍕" },
        { title: "Crinkle Crankle Wall Brick Saver", url: "/funny/crinkle-crankle-wall-brick-saver", icon: "🤪" },
        { title: "First-Date Awkwardness Meter", url: "/funny/first-date-awkwardness-meter", icon: "❤️" },
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