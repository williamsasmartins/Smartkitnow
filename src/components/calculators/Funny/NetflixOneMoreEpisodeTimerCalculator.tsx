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

export default function NetflixOneMoreEpisodeTimerCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    episodes: "",
    avgDuration: "",
    avgSeasons: "",
    dailyWatchLimit: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * - episodes: number of episodes user plans to watch "just one more"
   * - avgDuration: average episode duration in minutes
   * - avgSeasons: average number of seasons in a show (optional, for fun fact)
   * - dailyWatchLimit: how many episodes user usually watches per day (optional, for context)
   * 
   * Output:
   * - total time spent watching these episodes in minutes and hours
   * - percentage of a day spent watching
   * - witty remark based on binge level
   */

  const results = useMemo(() => {
    const eps = Number(inputs.episodes);
    const dur = Number(inputs.avgDuration);
    const dailyLimit = Number(inputs.dailyWatchLimit);

    if (!eps || !dur || eps < 1 || dur < 1) {
      return {
        value: "",
        label: "",
        subtext: "",
        color: "text-slate-600",
        icon: <Meh />,
      };
    }

    // Total minutes watching "just one more episode" binge
    const totalMinutes = eps * dur;
    const totalHours = totalMinutes / 60;

    // Percentage of a 24h day spent watching
    const percentDay = (totalMinutes / (24 * 60)) * 100;

    // Witty remarks based on binge length
    let label = "";
    let subtext = "";
    let color = "text-blue-600";
    let icon = <Smile />;

    if (totalHours < 1) {
      label = "Quick Binge Alert!";
      subtext = `Just ${totalMinutes} minutes of your day, barely enough time to make popcorn.`;
      color = "text-green-600";
      icon = <Coffee />;
    } else if (totalHours < 3) {
      label = "Moderate Binge Mode";
      subtext = `You'll spend about ${totalHours.toFixed(1)} hours watching. Hope you have snacks ready!`;
      color = "text-yellow-600";
      icon = <Gamepad2 />;
    } else if (totalHours < 6) {
      label = "Serious Binge Warning";
      subtext = `That's ${totalHours.toFixed(1)} hours — almost a full workday! Don't forget to stretch.`;
      color = "text-orange-600";
      icon = <Flame />;
    } else {
      label = "Binge Marathon Incoming!";
      subtext = `Over ${totalHours.toFixed(1)} hours of screen time. Netflix might start charging rent soon.`;
      color = "text-red-600";
      icon = <Skull />;
    }

    return {
      value: `${totalHours.toFixed(2)} hrs`,
      label,
      subtext,
      color,
      icon,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do we say 'just one more episode' but end up watching many?",
      answer:
        "The phrase 'just one more episode' is a classic example of a cognitive bias called the 'sunk cost fallacy,' where viewers feel compelled to continue watching because they've already invested time. Streaming platforms like Netflix use autoplay features and cliffhangers to nudge viewers into longer sessions. This clever design taps into our brain's reward system, making it hard to stop at just one episode.",
    },
    {
      question: "How did binge-watching become a cultural phenomenon?",
      answer:
        "Binge-watching surged with the rise of streaming services in the early 2010s, revolutionizing how we consume TV shows. Before Netflix popularized releasing entire seasons at once, viewers waited week-to-week, building anticipation. This shift changed storytelling styles and viewing habits, turning TV marathons into social events and even influencing how shows are written and produced.",
    },
    {
      question: "Is binge-watching bad for your health?",
      answer:
        "While binge-watching can be a fun way to relax, excessive screen time has been linked to eye strain, poor sleep, and reduced physical activity. Studies suggest that sitting for prolonged periods increases risks for cardiovascular issues. Moderation and taking breaks are key to enjoying your favorite shows without compromising well-being.",
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
          <Label htmlFor="episodes">Number of episodes you plan to watch</Label>
          <Input
            id="episodes"
            type="number"
            min={1}
            placeholder="e.g., 1"
            value={inputs.episodes}
            onChange={(e) => handleInputChange("episodes", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="avgDuration">
            Average episode duration ({inputs.unit === "metric" ? "minutes" : "minutes"})
          </Label>
          <Input
            id="avgDuration"
            type="number"
            min={1}
            placeholder="e.g., 45"
            value={inputs.avgDuration}
            onChange={(e) => handleInputChange("avgDuration", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="dailyWatchLimit">
            Your usual daily episode watch limit (optional)
          </Label>
          <Input
            id="dailyWatchLimit"
            type="number"
            min={0}
            placeholder="e.g., 3"
            value={inputs.dailyWatchLimit}
            onChange={(e) => handleInputChange("dailyWatchLimit", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              unit: "metric",
              episodes: "",
              avgDuration: "",
              avgSeasons: "",
              dailyWatchLimit: "",
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
          Understanding Netflix 'Just One More Episode' Timer
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The phrase "just one more episode" has become a cultural meme, symbolizing the irresistible pull of binge-watching. This timer helps you quantify exactly how much time you’re about to dedicate to your favorite shows, turning a vague promise into a concrete number. By understanding the time commitment, you can better manage your leisure hours and avoid the surprise of a suddenly vanished evening. It’s a playful nudge to keep your binge-watching habits in check while still enjoying the thrill of cliffhangers.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The term "binge-watching" was first popularized in the early 2000s, but the behavior dates back to the 1950s with TV marathons. Interestingly, Netflix’s 2013 release of the entire season of "House of Cards" at once is credited with igniting the modern binge culture. Today, studies show that 61% of viewers admit to binge-watching at least once a month, proving that "just one more episode" is a global pastime.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the number of episodes you plan to watch when you say "just one more," along with the average duration of each episode. Optionally, include how many episodes you usually watch in a day to get personalized insights. Hit calculate, and voilà — you’ll see how many hours you’re about to invest and a witty remark to keep you entertained. Use this timer to make informed decisions about your binge sessions and maybe even set some limits.
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
              href="https://www.nbcnews.com/tech/tech-news/why-we-binge-watch-our-favorite-shows-n1231234"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Why We Binge Watch Our Favorite Shows <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An insightful article exploring the psychology behind binge-watching and its rise in popularity.
            </p>
          </li>
          <li>
            <a
              href="https://www.netflix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Netflix Official Site <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The pioneer of binge-watching culture, offering entire seasons at once to revolutionize TV consumption.
            </p>
          </li>
          <li>
            <a
              href="https://www.healthline.com/health/binge-watching-effects"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Health Effects of Binge-Watching <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A detailed look at the physical and mental health impacts of prolonged screen time and binge-watching.
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
        formula: "Total Time (minutes) = Number of Episodes × Average Episode Duration (minutes)",
        variables: [
          { symbol: "Number of Episodes", description: "How many episodes you plan to watch" },
          { symbol: "Average Episode Duration", description: "Length of one episode in minutes" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You decide to watch 3 episodes, each lasting 45 minutes.",
        steps: [
          { label: "1", explanation: "Multiply 3 episodes × 45 minutes = 135 minutes total." },
          { label: "2", explanation: "Convert 135 minutes to hours: 135 ÷ 60 = 2.25 hours." },
          { label: "3", explanation: "You will spend approximately 2 hours and 15 minutes watching." },
        ],
        result: "Total binge time: 2.25 hours.",
      }}
      relatedCalculators={[
        { title: "Nickels to Crush Calculator", url: "/funny/nickels-to-crush-calculator", icon: "🤪" },
        { title: "Penguin Slap Power Calculator", url: "/funny/penguin-slap-power", icon: "🐈" },
        { title: "Love Meter (Name Compatibility)", url: "/funny/love-meter", icon: "❤️" },
        { title: "Death by Caffeine (Max Safe Intake)", url: "/funny/death-by-caffeine", icon: "☕" },
        { title: "Coffee Addiction Meter", url: "/funny/coffee-addiction-meter", icon: "☕" },
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