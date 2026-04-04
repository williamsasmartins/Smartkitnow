import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Lightbulb, RotateCcw, Sparkles, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SocialMediaTimeAlternativesCalculator() {
  const [inputs, setInputs] = useState({ dailyMinutes: "" });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const dailyMinutes = parseFloat(inputs.dailyMinutes);
    if (isNaN(dailyMinutes) || dailyMinutes <= 0) {
      // Neutral state on empty or invalid input
      return { value: null };
    }

    // Calculate total minutes spent on social media per year
    const totalMinutesPerYear = dailyMinutes * 365;

    // Convert total minutes to hours and days
    const totalHours = totalMinutesPerYear / 60;
    const totalDays = totalHours / 24;

    // Suggest alternatives based on total days spent
    // For example: learning a new language, reading books, exercising, or cooking

    // We'll show the total days spent and suggest what could be done instead
    const formattedDays = totalDays.toFixed(1);

    return {
      value: `${formattedDays} days`,
      label: "Time spent on social media per year",
      subtext:
        "Imagine what you could achieve by dedicating this time to new skills or hobbies like learning a language, reading, exercising, or cooking!",
      color: "text-blue-600",
      icon: <Smile className="mx-auto" size={48} />,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How is the time calculated?",
      answer:
        "The calculator multiplies your average daily social media usage in minutes by 365 days to estimate your yearly time spent. This helps you visualize how much time you could reclaim.",
    },
    {
      question: "Can I use this calculator for other screen time?",
      answer:
        "Yes, you can input any daily screen time you want to analyze. However, this calculator is optimized for social media usage specifically.",
    },
    {
      question: "Why is it important to track social media time?",
      answer:
        "Tracking social media time helps increase awareness of your habits and encourages you to spend time on more fulfilling activities, improving productivity and well-being.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div>
        <Label htmlFor="dailyMinutes" className="mb-2 block font-semibold text-slate-700 dark:text-slate-300">
          Average Daily Social Media Time (minutes)
        </Label>
        <Input
          id="dailyMinutes"
          type="number"
          min={0}
          placeholder="e.g. 90"
          value={inputs.dailyMinutes}
          onChange={(e) => handleInputChange("dailyMinutes", e.target.value)}
          aria-describedby="dailyMinutesHelp"
        />
        <p id="dailyMinutesHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter the average number of minutes you spend on social media each day.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special calculation trigger needed since useMemo updates automatically
          }}
        >
          <Sparkles className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ dailyMinutes: "" })}
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
          Understanding Social Media Time Alternatives
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Social media platforms are designed to capture your attention, often leading to hours of scrolling each day. While these platforms can be entertaining and informative, excessive use may reduce time available for personal growth and hobbies. This calculator helps you visualize how much time you spend on social media annually and what productive activities you could pursue instead. By becoming aware of your usage, you can make intentional choices to reclaim your time.
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 my-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Did You Know?</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-300">
            The average person spends over 2 hours per day on social media, which adds up to more than 5 years over a lifetime. Redirecting even a fraction of this time to learning new skills or hobbies can have a profound impact on personal development.
          </p>
        </div>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Simply enter your average daily social media usage in minutes into the input field and click "Calculate." The calculator will estimate the total time you spend on social media annually and suggest alternative activities you could pursue with that time. Use this insight to motivate changes in your daily habits and reclaim valuable hours.
        </p>
      </section>


      <section id="use-cases" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Your Relationship With Social Media Time
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Average daily social media usage worldwide is 2 hours 27 minutes (DataReportal, 2024). Over a year, this totals approximately 37 days spent on social platforms. The opportunity cost is substantial: that same time could yield 18 books read, 1,000 hours of skill practice, or a meaningful second language acquisition (research estimates 500-1000 hours to conversational fluency). The calculator translates abstract daily minutes into annual equivalents that make the trade-off concrete.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Passive consumption vs active creation is the key distinction in social media use. Research by the Oxford Internet Institute found that passive scrolling correlates with reduced well-being, while active use (posting, messaging, creating) shows neutral or positive correlation. The same platform can serve either mode — the behavior pattern matters more than the platform. Digital wellness frameworks like the 'JOMO' (Joy of Missing Out) movement advocate intentional, time-bounded social media use rather than total abstinence.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Screen time reduction experiments show a consistent pattern: the first three days feel difficult, days 4-7 show productivity gains, and by day 14, most participants report improved sleep and reduced anxiety (University of Bath study, 2019). The alternative-activity framing used by this calculator is more effective than willpower-based restriction. Replacing scroll time with a specific activity (reading, walking, learning) activates implementation intentions that are more reliably followed than vague 'use less' goals.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <dl className="space-y-6">
          {faqs.map(({ question, answer }, i) => (
            <div key={i}>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">{question}</dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300">{answer}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="space-y-4 list-disc list-inside text-slate-700 dark:text-slate-300">
          <li>
            <a
              href="https://www.statista.com/statistics/433871/daily-social-media-usage-worldwide/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Daily Social Media Usage Worldwide <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Statista report on average daily social media usage globally.
            </p>
          </li>
          <li>
            <a
              href="https://www.pewresearch.org/internet/2021/04/07/social-media-use-in-2021/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Social Media Use in 2021 <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pew Research Center analysis of social media usage trends.
            </p>
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
        formula: "Total Time = Daily Minutes × 365",
        variables: [
          { symbol: "Total Time", description: "Total minutes spent on social media per year" },
          { symbol: "Daily Minutes", description: "Average daily social media usage in minutes" },
          { symbol: "365", description: "Number of days in a year" },
        ],
      }}
      example={{
        title: "Example",
        scenario: "If you spend 90 minutes daily on social media, how much time is that annually?",
        steps: [
          { label: "1", explanation: "Multiply 90 minutes by 365 days." },
          { label: "2", explanation: "90 × 365 = 32,850 minutes per year." },
          { label: "3", explanation: "Convert minutes to days: 32,850 ÷ 60 ÷ 24 ≈ 22.8 days." },
        ],
        result: "You spend approximately 22.8 days per year on social media.",
      }}
      relatedCalculators={[
        { title: "Calculator Word Generator (Upside-Down)", url: "/funny/calculator-word-generator-upside-down", icon: "🤪" },
        { title: "Tab Overload Anxiety Score", url: "/funny/tab-overload-anxiety-score", icon: "💻" },
        { title: "Medical Tourism Cost Saver", url: "/funny/medical-tourism-cost-saver", icon: "🤪" },
        { title: "Cost to Send This Email (Energy/kWh)", url: "/funny/email-cost-estimator-energy", icon: "💻" },
        { title: "Time Travel Energy Requirement", url: "/funny/time-travel-energy-requirement", icon: "✈️" },
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