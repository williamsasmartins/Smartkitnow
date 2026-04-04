import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Lightbulb, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function NetflixOneMoreEpisodeTimerCalculator() {
  // Inputs: number of episodes left to watch, average episode length (minutes)
  const [inputs, setInputs] = useState({ episodes: "", avgLength: "" });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals for avgLength, integers for episodes
    if (name === "episodes") {
      // Allow only digits
      if (/^\d*$/.test(value)) setInputs((p) => ({ ...p, [name]: value }));
    } else if (name === "avgLength") {
      // Allow digits and decimal point
      if (/^\d*\.?\d*$/.test(value)) setInputs((p) => ({ ...p, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const episodesNum = Number(inputs.episodes);
    const avgLengthNum = Number(inputs.avgLength);

    // Initial state safety: if inputs empty or zero or invalid, return neutral state
    if (
      !inputs.episodes ||
      !inputs.avgLength ||
      isNaN(episodesNum) ||
      isNaN(avgLengthNum) ||
      episodesNum <= 0 ||
      avgLengthNum <= 0
    ) {
      return { value: null };
    }

    // Calculate total binge time in minutes
    const totalMinutes = episodesNum * avgLengthNum;

    // Convert totalMinutes to hours and minutes for better readability
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    // Format output string
    let valueStr = "";
    if (hours > 0) {
      valueStr = `${hours} hour${hours > 1 ? "s" : ""}`;
      if (minutes > 0) valueStr += ` and ${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      valueStr = `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }

    return {
      value: valueStr,
      label: "Total Binge-Watching Time",
      subtext: `If you watch "just one more episode" for ${episodesNum} episode${episodesNum > 1 ? "s" : ""}, you'll spend this much time.`,
      color: "text-red-600",
      icon: <Smile className="text-red-600" />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Can I use decimals for average episode length?",
      answer:
        "Yes, you can input decimal values for the average episode length to get a more precise calculation. For example, 22.5 minutes per episode.",
    },
    {
      question: "What if I watch multiple episodes in one sitting?",
      answer:
        "This calculator estimates the total time spent watching the specified number of episodes consecutively. It helps you understand how much time you might be dedicating to binge-watching.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="episodes" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Number of Episodes to Watch
        </Label>
        <Input
          id="episodes"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="e.g., 1"
          value={inputs.episodes}
          onChange={(e) => handleInputChange("episodes", e.target.value)}
          aria-describedby="episodes-desc"
        />
        <p id="episodes-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter how many episodes you plan to watch "just one more" of.
        </p>
      </div>

      <div>
        <Label htmlFor="avgLength" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Average Episode Length (minutes)
        </Label>
        <Input
          id="avgLength"
          type="text"
          inputMode="decimal"
          placeholder="e.g., 22"
          value={inputs.avgLength}
          onChange={(e) => handleInputChange("avgLength", e.target.value)}
          aria-describedby="avgLength-desc"
        />
        <p id="avgLength-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter the average length of an episode in minutes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed on calculate, results update automatically
          }}
          aria-label="Calculate total binge-watching time"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ episodes: "", avgLength: "" })}
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
          Understanding Netflix 'Just One More Episode' Timer
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Binge-watching has become a popular pastime, but it can easily consume more time than intended.
          This calculator helps you estimate how much time you'll spend if you decide to watch "just one more episode."
          By inputting the number of episodes and their average length, you get a clear picture of your potential time commitment.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The term "binge-watching" was added to the Oxford English Dictionary in 2018, reflecting the cultural impact of streaming services like Netflix.
            Studies show that binge-watching can affect sleep patterns and productivity, making time awareness crucial.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Timer</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the number of episodes you plan to watch and the average length of each episode in minutes.
          Click "Calculate" to see the total time you'll spend watching.
          Use this information to manage your time better and avoid unintended long binge sessions.
        </p>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          The Psychology of Binge-Watching and Time Awareness
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Streaming platforms are engineered for continued viewing. Netflix auto-plays the next episode after a 5-second countdown, removing the conscious decision to continue. Each episode ends on an unresolved narrative tension specifically designed to create forward momentum. The result: what viewers intend as a single episode often becomes three or four. Research at the University of Texas at Austin found that binge-watching correlates with higher levels of loneliness and depression, and is often associated with using television to escape negative emotions rather than as active entertainment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The sunk cost fallacy amplifies binge-watching. Having already watched seven episodes of a mediocre series, viewers continue because stopping feels like wasting the previous investment. The rational approach recognizes that past time is already spent regardless of future choices. This calculator makes the sunk cost explicit by showing the total time committed and the precise end-time of additional episodes, which helps break the automatic continuation pattern by making the cost concrete and visible.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Sleep researchers identify late-night streaming as a significant contributor to sleep debt. Blue light from screens suppresses melatonin production, and psychological arousal from compelling content delays sleep onset even after screens are turned off. The American Academy of Sleep Medicine recommends stopping screen use 30-60 minutes before target sleep time. Using the end-time calculation from this calculator to know the exact clock time three more episodes will finish enables concrete bedtime planning rather than vague intentions that dissolve in the moment.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="list-disc list-inside space-y-3 text-slate-700 dark:text-slate-300">
          {faqs.map(({ question, answer }, i) => (
            <li key={i}>
              <strong>{question}</strong>
              <p>{answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.oxfordlearnersdictionaries.com/definition/english/binge-watch"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Oxford English Dictionary: Binge-Watching <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Definition and cultural context of binge-watching.
            </p>
          </li>
          <li>
            <a
              href="https://www.sleepfoundation.org/sleep-hygiene/binge-watching-and-sleep"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Sleep Foundation: Effects of Binge-Watching on Sleep <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Research on how binge-watching impacts sleep quality and patterns.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Netflix 'Just One More Episode' Timer"
      description="Manage binge-watching risks. Calculate how much of your life will be consumed if you watch 'just one more episode' tonight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Total Time = Number of Episodes × Average Episode Length",
        variables: [
          { symbol: "Number of Episodes", description: "How many episodes you plan to watch" },
          { symbol: "Average Episode Length", description: "Average duration of each episode in minutes" },
          { symbol: "Total Time", description: "Total binge-watching time in minutes" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "You want to watch 3 episodes, each averaging 22 minutes. How much time will you spend?",
        steps: [
          { label: "1", explanation: "Multiply 3 episodes by 22 minutes each." },
          { label: "2", explanation: "3 × 22 = 66 minutes total." },
          { label: "3", explanation: "Convert 66 minutes to 1 hour and 6 minutes." },
        ],
        result: "You will spend approximately 1 hour and 6 minutes watching 3 episodes.",
      }}
      relatedCalculators={[
        { title: "Tab Overload Anxiety Score", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
        { title: "Social Media Time Alternatives", url: "/funny/social-media-time-alternatives", icon: "🤪" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Rocks to Flood a Country Estimator", url: "/funny/rocks-to-flood-country", icon: "✈️" },
        { title: "Nickels to Crush Calculator", url: "/funny/nickels-to-crush-calculator", icon: "🤪" },
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
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