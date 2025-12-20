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

export default function SocialMediaTimeAlternativesCalculator() {
  const [inputs, setInputs] = useState({ unit: "metric", dailyMinutes: "" });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Constants for calculations
  const DAYS_IN_YEAR = 365;

  // Fun skill/hobby average learning times (hours)
  // Source: Various online learning platforms and hobbyist surveys
  const skills = [
    { name: "Learn Basic Guitar", hours: 100, icon: <Gamepad2 className="inline-block w-5 h-5 mr-1" /> },
    { name: "Master Cooking Basics", hours: 50, icon: <Utensils className="inline-block w-5 h-5 mr-1" /> },
    { name: "Read 12 Books", hours: 60, icon: <BookOpen className="inline-block w-5 h-5 mr-1" /> },
    { name: "Practice Yoga", hours: 75, icon: <Heart className="inline-block w-5 h-5 mr-1" /> },
    { name: "Learn a New Language (Basic)", hours: 200, icon: <Globe className="inline-block w-5 h-5 mr-1" /> },
    { name: "Meditate Daily", hours: 30, icon: <Lightbulb className="inline-block w-5 h-5 mr-1" /> },
  ];

  const results = useMemo(() => {
    const dailyMins = parseFloat(inputs.dailyMinutes);
    if (isNaN(dailyMins) || dailyMins <= 0) {
      return { value: "", label: "", subtext: "", color: "text-slate-600", icon: <Meh /> };
    }

    // Total yearly minutes spent on social media
    const totalMinutes = dailyMins * DAYS_IN_YEAR;
    const totalHours = totalMinutes / 60;

    // Calculate how many times each skill could be completed
    const skillResults = skills.map(skill => {
      const times = totalHours / skill.hours;
      return { ...skill, times };
    });

    // Find the skill with the highest number of completions (or partial)
    const bestSkill = skillResults.reduce((prev, curr) => (curr.times > prev.times ? curr : prev));

    // Format value and label
    const value = bestSkill.times < 0.01
      ? "Less than 1%"
      : bestSkill.times < 1
      ? `${(bestSkill.times * 100).toFixed(1)}%`
      : bestSkill.times.toFixed(2);

    const label = bestSkill.times < 1
      ? `of ${bestSkill.name} learned`
      : bestSkill.times < 2
      ? `time to ${bestSkill.name}`
      : `${bestSkill.times} times ${bestSkill.name}`;

    // Witty subtext based on time spent
    let subtext = "";
    if (totalHours < 10) {
      subtext = "Just a sprinkle of social scrolling, but imagine the possibilities!";
    } else if (totalHours < 100) {
      subtext = "Enough time to pick up a new hobby or two, if you dare.";
    } else if (totalHours < 500) {
      subtext = "You could be a semi-pro by now, or just really good at scrolling.";
    } else {
      subtext = "Legendary dedication to scrolling! Or a master of new skills.";
    }

    return {
      value,
      label,
      subtext,
      color: "text-blue-600",
      icon: bestSkill.icon || <Smile />,
    };
  }, [inputs.dailyMinutes]);

  const faqs = [
    {
      question: "How much time do people typically spend on social media daily?",
      answer:
        "On average, adults worldwide spend about 2 hours and 30 minutes daily on social media platforms. This figure varies by country and age group, with younger users often exceeding this average. Understanding this helps put into perspective how much time could be redirected towards more productive or fulfilling activities.",
    },
    {
      question: "Why compare social media time to learning new skills?",
      answer:
        "Time is our most valuable resource, and social media often consumes it silently. By translating scrolling minutes into tangible achievements like learning guitar or cooking, we visualize opportunity costs. This approach motivates users to reclaim their time and invest it in personal growth or hobbies.",
    },
    {
      question: "Can small daily time savings really add up?",
      answer:
        "Absolutely! Even saving just 15 minutes a day from social media can accumulate to over 90 hours a year. That’s enough time to read a dozen books or learn the basics of a new language. Small consistent changes lead to impressive long-term results.",
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

      {/* Input for daily social media time */}
      <div>
        <Label htmlFor="dailyMinutes" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Daily Social Media Time (minutes)
        </Label>
        <Input
          id="dailyMinutes"
          type="number"
          min={0}
          placeholder="e.g. 120"
          value={inputs.dailyMinutes}
          onChange={(e) => handleInputChange("dailyMinutes", e.target.value)}
          className="max-w-xs"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Just trigger recalculation by updating state (already handled by useMemo)
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ unit: "metric", dailyMinutes: "" })}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Social Media Time Alternatives</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Social media has become a ubiquitous part of modern life, often consuming hours each day without us realizing it. While scrolling through feeds can be entertaining and informative, it also quietly chips away at time that could be spent on more enriching activities. This calculator helps you visualize what you could achieve if you redirected your social media minutes into learning new skills or hobbies. By quantifying your daily usage, you gain insight into the opportunity cost of endless scrolling.
        </p>

        {/* TRIVIA BOX - AI MUST FILL THIS */}
        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The average person spends over 2.5 hours daily on social media, which adds up to nearly 5 years over a lifetime! Interestingly, the first recognizable social media site, Six Degrees, launched in 1997, allowing users to create profiles and friend others. Since then, social media has evolved into a powerful cultural force, but also a massive time sink that many are only now beginning to reckon with.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter the average number of minutes you spend on social media each day. The calculator will estimate how many hours that adds up to over a year and translate that time into how many times you could have completed various popular skills or hobbies. Whether it’s learning guitar, cooking, or reading books, this tool puts your scrolling habits into perspective. Use the unit selector to switch between metric and imperial if needed, though time is universal!
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          After calculating, reflect on the results and consider small changes to your daily routine. Even reducing social media time by 10-15 minutes can free up hours annually for meaningful pursuits. Remember, the goal isn’t to demonize social media but to empower you with knowledge about your time’s true value.
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
            <a href="https://www.statista.com/statistics/433871/daily-social-media-usage-worldwide/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Statista: Daily Social Media Usage <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">Comprehensive statistics on global social media usage patterns and trends.</p>
          </li>
          <li>
            <a href="https://www.history.com/news/first-social-network-six-degrees" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              History.com: The First Social Network <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">Explore the origins of social media with the story of Six Degrees, launched in 1997.</p>
          </li>
          <li>
            <a href="https://www.lifehack.org/articles/productivity/how-to-stop-wasting-time-on-social-media.html" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Lifehack: How to Stop Wasting Time on Social Media <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">Practical tips to reduce social media time and reclaim your day for meaningful activities.</p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Social Media Time Alternatives"
      description="Reclaim your time. See what new skills or hobbies you could have mastered in the time spent scrolling social media this year."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math",
        formula: "Total Yearly Hours = (Daily Minutes × 365) ÷ 60",
        variables: [
          { symbol: "Daily Minutes", description: "Average minutes spent on social media per day" },
          { symbol: "365", description: "Days in a year" },
          { symbol: "60", description: "Minutes in an hour" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "If you spend 120 minutes daily on social media, how many hours is that yearly, and what could you learn?",
        steps: [
          { label: "1", explanation: "Multiply 120 minutes by 365 days = 43,800 minutes yearly." },
          { label: "2", explanation: "Convert minutes to hours: 43,800 ÷ 60 = 730 hours yearly." },
          { label: "3", explanation: "Compare 730 hours to skill learning times, e.g., 100 hours to learn guitar." },
        ],
        result: "You could learn basic guitar 7.3 times in the time spent scrolling social media annually!",
      }}
      relatedCalculators={[
        { title: "Cost to Send This Email (Energy/kWh)", url: "/funny/email-cost-estimator-energy", icon: "💻" },
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
        { title: "Commit Message Quality Judge", url: "/funny/commit-message-quality-judge", icon: "🤪" },
        { title: "Black Hole Sun Impact Calculator", url: "/funny/black-hole-sun-impact", icon: "🧟" },
        { title: "Penguin Slap Power Calculator", url: "/funny/penguin-slap-power", icon: "🐈" },
        { title: "Crinkle Crankle Wall Brick Saver", url: "/funny/crinkle-crankle-wall-brick-saver", icon: "🤪" },
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