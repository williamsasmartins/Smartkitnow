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

export default function TabOverloadAnxietyScoreCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    tabs: "",
    averageTabAge: "",
    multitaskingLevel: "medium",
    caffeineIntake: "none",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Helper to parse number safely
  const parseNumber = (val) => {
    const n = Number(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  const results = useMemo(() => {
    const tabs = parseNumber(inputs.tabs);
    const avgAge = parseNumber(inputs.averageTabAge);
    const multitaskingMap = { low: 0.8, medium: 1, high: 1.3 };
    const caffeineMap = { none: 1, low: 1.1, moderate: 1.25, high: 1.5 };

    // Base anxiety score is influenced by number of tabs and their age (older tabs = more anxiety)
    // Multitasking level and caffeine intake amplify anxiety
    // Formula: score = tabs * (1 + avgAge/10) * multitaskingFactor * caffeineFactor
    // Clamp score to max 100 for sanity

    let baseScore = tabs * (1 + avgAge / 10);
    baseScore *= multitaskingMap[inputs.multitaskingLevel] || 1;
    baseScore *= caffeineMap[inputs.caffeineIntake] || 1;

    const clampedScore = Math.min(100, Math.round(baseScore));

    // Determine label and icon based on score
    let label = "";
    let subtext = "";
    let color = "";
    let icon = <Meh className="mx-auto text-6xl" />;

    if (clampedScore < 20) {
      label = "Zen Master";
      subtext = "Your tab game is calm and collected. You probably meditate on your browser.";
      color = "text-green-600";
      icon = <Smile className="mx-auto text-6xl" />;
    } else if (clampedScore < 50) {
      label = "Mildly Distracted";
      subtext = "A few tabs here and there, but nothing you can't handle. Just don’t open Reddit.";
      color = "text-yellow-600";
      icon = <Meh className="mx-auto text-6xl" />;
    } else if (clampedScore < 80) {
      label = "Tab Juggler";
      subtext = "Your tabs are multiplying like rabbits. Time to consider some digital decluttering.";
      color = "text-orange-600";
      icon = <AlertTriangle className="mx-auto text-6xl" />;
    } else {
      label = "Overload Alert!";
      subtext = "Your browser is a chaotic multiverse. Close some tabs before your anxiety hits critical mass!";
      color = "text-red-600";
      icon = <Skull className="mx-auto text-6xl" />;
    }

    return { value: clampedScore.toString(), label, subtext, color, icon };
  }, [inputs]);

  const faqs = [
    {
      question: "Why does having too many tabs open cause anxiety?",
      answer:
        "Having dozens of tabs open can overwhelm your brain’s working memory because each tab represents a task or piece of information demanding attention. This cognitive overload triggers stress hormones, making it harder to focus or relax. The anxiety grows as tabs accumulate, especially if you’re afraid to close any and lose important info. It’s like juggling flaming swords—exciting but nerve-wracking!",
    },
    {
      question: "How does caffeine intake affect tab overload anxiety?",
      answer:
        "Caffeine is a stimulant that can heighten your alertness but also amplify anxiety symptoms, especially when combined with multitasking stress. If you’re chugging coffee while juggling many tabs, your brain might feel wired and overwhelmed simultaneously. This cocktail can spike your tab anxiety score, making you more prone to distraction and digital fatigue. So, your coffee habit might be fueling your tab chaos!",
    },
    {
      question: "What’s the history behind browser tabs and multitasking?",
      answer:
        "Browser tabs were introduced in the early 2000s to help users manage multiple web pages without opening new windows. This innovation revolutionized multitasking online, but it also birthed the modern plague of tab overload. Interestingly, studies show that humans aren’t naturally great at multitasking; our brains switch focus rather than handle tasks simultaneously. So, while tabs make it easier to open many pages, they also tempt us into cognitive overload.",
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

      {/* Number of Tabs Input */}
      <div>
        <Label htmlFor="tabs" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Number of Open Tabs
        </Label>
        <Input
          id="tabs"
          type="number"
          min={0}
          placeholder="e.g. 15"
          value={inputs.tabs}
          onChange={(e) => handleInputChange("tabs", e.target.value)}
          aria-describedby="tabs-help"
        />
        <p id="tabs-help" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          How many tabs do you currently have open in your browser? Don’t worry, no judgment here!
        </p>
      </div>

      {/* Average Tab Age Input */}
      <div>
        <Label htmlFor="averageTabAge" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Average Tab Age ({inputs.unit === "metric" ? "hours" : "hours"})
        </Label>
        <Input
          id="averageTabAge"
          type="number"
          min={0}
          placeholder="e.g. 5"
          value={inputs.averageTabAge}
          onChange={(e) => handleInputChange("averageTabAge", e.target.value)}
          aria-describedby="age-help"
        />
        <p id="age-help" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Estimate how long your tabs have been open on average. Older tabs tend to increase anxiety since they linger unfinished.
        </p>
      </div>

      {/* Multitasking Level Selector */}
      <div>
        <Label htmlFor="multitaskingLevel" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Multitasking Level
        </Label>
        <Select
          id="multitaskingLevel"
          value={inputs.multitaskingLevel}
          onValueChange={(v) => handleInputChange("multitaskingLevel", v)}
        >
          <SelectTrigger className="w-full">
            <Calculator className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (1-2 tasks)</SelectItem>
            <SelectItem value="medium">Medium (3-5 tasks)</SelectItem>
            <SelectItem value="high">High (6+ tasks)</SelectItem>
          </SelectContent>
        </Select>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          How many tasks or projects are you juggling alongside your tabs? More multitasking means more mental strain.
        </p>
      </div>

      {/* Caffeine Intake Selector */}
      <div>
        <Label htmlFor="caffeineIntake" className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">
          Caffeine Intake
        </Label>
        <Select
          id="caffeineIntake"
          value={inputs.caffeineIntake}
          onValueChange={(v) => handleInputChange("caffeineIntake", v)}
        >
          <SelectTrigger className="w-full">
            <Coffee className="mr-2 h-4 w-4" /> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="low">Low (1 cup)</SelectItem>
            <SelectItem value="moderate">Moderate (2-3 cups)</SelectItem>
            <SelectItem value="high">High (4+ cups)</SelectItem>
          </SelectContent>
        </Select>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your caffeine consumption can amplify feelings of anxiety and restlessness, especially when combined with tab overload.
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
          onClick={() =>
            setInputs({
              unit: "metric",
              tabs: "",
              averageTabAge: "",
              multitaskingLevel: "medium",
              caffeineIntake: "none",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && inputs.tabs !== "" && (
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Tab Overload Anxiety Score</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Tab Overload Anxiety Score measures the mental stress caused by having too many browser tabs open simultaneously. Each tab represents an unfinished task or a piece of information demanding your attention, which can clutter your mind and increase cognitive load. This score factors in not just the number of tabs, but also how long they’ve been open, your multitasking habits, and even your caffeine intake, all of which influence your brain’s ability to focus and stay calm. Think of it as a digital stress meter for your browser chaos.
        </p>

        {/* TRIVIA BOX */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            Browser tabs were first popularized by the Opera browser in 2000, revolutionizing how we multitask online. Before tabs, users had to juggle multiple windows, which was cumbersome and inefficient. Interestingly, studies show that humans aren’t truly multitaskers; our brains rapidly switch focus between tasks, which can increase stress and reduce productivity. So, while tabs make it easier to open many pages, they also tempt us into cognitive overload—a classic case of convenience with a hidden cost!
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To calculate your Tab Overload Anxiety Score, start by entering the number of tabs you currently have open. Next, estimate the average age of these tabs in hours—older tabs often mean unfinished tasks lingering in your mind. Select your multitasking level to reflect how many projects or tasks you juggle alongside your tabs, and finally, indicate your caffeine intake, as stimulants can heighten anxiety. Hit calculate to see your score and get personalized insights on your digital stress level.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Use this score as a fun yet insightful way to understand how your browsing habits might be affecting your mental well-being. If your score is high, consider closing some tabs, organizing your tasks, or taking a mindful break. Remember, a cleaner browser can lead to a clearer mind!
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
            <a href="https://www.nngroup.com/articles/multitasking-and-web-usability/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Nielsen Norman Group on Multitasking <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A deep dive into how multitasking affects web usability and user attention.
            </p>
          </li>
          <li>
            <a href="https://www.wired.com/story/history-browser-tabs/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              The History of Browser Tabs - Wired <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Explore how browser tabs evolved and changed the way we surf the web.
            </p>
          </li>
          <li>
            <a href="https://www.healthline.com/nutrition/caffeine-and-anxiety" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              How Caffeine Affects Anxiety - Healthline <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Understand the science behind caffeine’s impact on anxiety and stress.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tab Overload Anxiety Score"
      description="Measure your browser tab anxiety. Calculate a stress score based on the number of open tabs you are too afraid to close."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Score = Tabs × (1 + Average Tab Age ÷ 10) × Multitasking Factor × Caffeine Factor",
        variables: [
          { name: "Tabs", description: "Number of open browser tabs" },
          { name: "Average Tab Age", description: "Average time tabs have been open (hours)" },
          { name: "Multitasking Factor", description: "Multiplier based on your multitasking level (Low=0.8, Medium=1, High=1.3)" },
          { name: "Caffeine Factor", description: "Multiplier based on caffeine intake (None=1, Low=1.1, Moderate=1.25, High=1.5)" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "You have 20 tabs open, average tab age is 4 hours, multitasking at medium level, and moderate caffeine intake.",
        steps: [
          { label: "1", explanation: "Calculate base: 20 × (1 + 4 ÷ 10) = 20 × 1.4 = 28" },
          { label: "2", explanation: "Apply multitasking factor: 28 × 1 = 28" },
          { label: "3", explanation: "Apply caffeine factor: 28 × 1.25 = 35" },
          { label: "Result", explanation: "Your Tab Overload Anxiety Score is 35, indicating mild distraction." },
        ],
        result: "35 (Mildly Distracted)",
      }}
      relatedCalculators={[
        { title: "Cat 'Ignore-o-Meter'", url: "/funny/cat-ignore-o-meter", icon: "🐈" },
        { title: "Social Media Time Alternatives", url: "/funny/social-media-time-alternatives", icon: "🤪" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Coffee Strength vs Productivity Score", url: "/funny/coffee-strength-vs-productivity-meme", icon: "☕" },
        { title: "Cost to Send This Email (Energy/kWh)", url: "/funny/email-cost-estimator-energy", icon: "💻" },
        { title: "Donut Calculator", url: "/funny/donut-calculator", icon: "🍩" },
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