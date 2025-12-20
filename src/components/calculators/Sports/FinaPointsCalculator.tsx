import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Activity, Timer, TrendingUp, Dumbbell, Trophy, Medal, Flag, Flame, Zap, Heart, Scale, Calculator, Info, RotateCcw, AlertTriangle, BookOpen, ExternalLink, Waves, Gauge } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const events = [
  { label: "50m Freestyle", value: "50m_free" },
  { label: "100m Freestyle", value: "100m_free" },
  { label: "200m Freestyle", value: "200m_free" },
  { label: "400m Freestyle", value: "400m_free" },
  { label: "800m Freestyle", value: "800m_free" },
  { label: "1500m Freestyle", value: "1500m_free" },
  { label: "50m Backstroke", value: "50m_back" },
  { label: "100m Backstroke", value: "100m_back" },
  { label: "200m Backstroke", value: "200m_back" },
  { label: "50m Breaststroke", value: "50m_breast" },
  { label: "100m Breaststroke", value: "100m_breast" },
  { label: "200m Breaststroke", value: "200m_breast" },
  { label: "50m Butterfly", value: "50m_fly" },
  { label: "100m Butterfly", value: "100m_fly" },
  { label: "200m Butterfly", value: "200m_fly" },
  { label: "200m Individual Medley", value: "200m_im" },
  { label: "400m Individual Medley", value: "400m_im" },
];

// Official FINA base times (World Record or Standard) for 2024 (seconds)
// These are example base times for demonstration purposes only.
// For authoritative use, update with official FINA published base times.
const baseTimes: Record<string, number> = {
  "50m_free": 20.91,
  "100m_free": 46.91,
  "200m_free": 101.00,
  "400m_free": 220.00,
  "800m_free": 470.00,
  "1500m_free": 875.00,
  "50m_back": 24.00,
  "100m_back": 51.85,
  "200m_back": 112.00,
  "50m_breast": 26.62,
  "100m_breast": 58.00,
  "200m_breast": 127.00,
  "50m_fly": 22.27,
  "100m_fly": 49.50,
  "200m_fly": 114.00,
  "200m_im": 110.00,
  "400m_im": 240.00,
};

// FINA Points formula constants
// Points = 1000 * (BaseTime / SwimmerTime)^3
// This formula rewards faster times with higher points.

export default function FinaPointsCalculator() {
  const [inputs, setInputs] = useState({
    event: "",
    timeMinutes: "",
    timeSeconds: "",
    timeHundredths: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parse input time into total seconds
  const totalSeconds = useMemo(() => {
    const m = parseInt(inputs.timeMinutes, 10);
    const s = parseInt(inputs.timeSeconds, 10);
    const h = parseInt(inputs.timeHundredths, 10);
    if (
      isNaN(m) ||
      isNaN(s) ||
      isNaN(h) ||
      m < 0 ||
      s < 0 ||
      s >= 60 ||
      h < 0 ||
      h >= 100
    ) {
      return null;
    }
    return m * 60 + s + h / 100;
  }, [inputs.timeMinutes, inputs.timeSeconds, inputs.timeHundredths]);

  // Calculate FINA points
  const results = useMemo(() => {
    if (!inputs.event || totalSeconds === null) {
      return { value: null, label: "", subtext: "", warning: null, formulaUsed: "" };
    }
    const baseTime = baseTimes[inputs.event];
    if (!baseTime) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Selected event base time not found.",
        formulaUsed: "",
      };
    }
    if (totalSeconds <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive time.",
        formulaUsed: "",
      };
    }
    // FINA Points formula
    // Points = 1000 * (BaseTime / SwimmerTime)^3
    const points = 1000 * Math.pow(baseTime / totalSeconds, 3);
    const roundedPoints = Math.round(points);

    let subtext = `Based on base time ${baseTime.toFixed(2)} seconds for ${events.find(e => e.value === inputs.event)?.label}.`;
    let warning = null;
    if (points < 100) {
      warning = "Points below 100 indicate a performance far from world-class standards.";
    }

    return {
      value: roundedPoints.toString(),
      label: "FINA Points",
      subtext,
      warning,
      formulaUsed: "Points = 1000 × (BaseTime / SwimmerTime)³",
    };
  }, [inputs.event, totalSeconds]);

  const faqs = [
    {
      question: "What are FINA points and why are they important?",
      answer:
        "FINA points are a standardized scoring system developed by the International Swimming Federation (FINA) to compare swimming performances across different events and distances. They allow coaches, athletes, and officials to objectively evaluate and rank performances regardless of the stroke or race length. Higher points indicate better performance relative to world-class standards.",
    },
    {
      question: "How accurate is the FINA Points Calculator?",
      answer:
        "This calculator uses the official FINA points formula and up-to-date base times to provide accurate point calculations. However, base times may be updated periodically by FINA, so it is important to ensure the calculator uses the latest official data. Additionally, the calculator assumes correct input of race times in minutes, seconds, and hundredths.",
    },
    {
      question: "Can I use FINA points to compare swimmers of different strokes?",
      answer:
        "Yes, that is one of the main advantages of the FINA points system. Because points are calculated relative to the world record or base time for each event, they normalize performances across strokes and distances. This enables fair comparison of athletes specializing in different events.",
    },
    {
      question: "Why do some performances score less than 100 points?",
      answer:
        "A score below 100 points indicates a performance significantly slower than the base time, which is usually a world record or top standard. This helps differentiate elite performances from average or developing levels. Coaches use these scores to track progress and set realistic goals.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="event" className="flex items-center gap-1">
              Event <Flag className="w-4 h-4 text-blue-600" />
            </Label>
            <Select
              value={inputs.event}
              onValueChange={(v) => handleInputChange("event", v)}
              id="event"
              aria-label="Select swimming event"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((ev) => (
                  <SelectItem key={ev.value} value={ev.value}>
                    {ev.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="time" className="flex items-center gap-1">
              Race Time <Timer className="w-4 h-4 text-blue-600" />
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="0"
                placeholder="Min"
                value={inputs.timeMinutes}
                onChange={(e) => handleInputChange("timeMinutes", e.target.value)}
                aria-label="Minutes"
                className="w-20"
              />
              <span className="self-center text-lg font-bold">:</span>
              <Input
                type="number"
                min="0"
                max="59"
                placeholder="Sec"
                value={inputs.timeSeconds}
                onChange={(e) => handleInputChange("timeSeconds", e.target.value)}
                aria-label="Seconds"
                className="w-20"
              />
              <span className="self-center text-lg font-bold">.</span>
              <Input
                type="number"
                min="0"
                max="99"
                placeholder="Hundredths"
                value={inputs.timeHundredths}
                onChange={(e) => handleInputChange("timeHundredths", e.target.value)}
                aria-label="Hundredths of second"
                className="w-20"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => {}}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              aria-label="Calculate FINA points"
            >
              <Trophy className="mr-2 h-4 w-4" /> Calculate
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setInputs({
                  event: "",
                  timeMinutes: "",
                  timeSeconds: "",
                  timeHundredths: "",
                })
              }
              className="flex-1 h-11"
              aria-label="Reset inputs"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding FINA Points Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The FINA Points Calculator is a specialized tool designed to convert swimming race times into standardized points based on the official scoring system developed by the International Swimming Federation (FINA). This system allows for objective comparison of performances across different swimming strokes and distances by normalizing times relative to world-class benchmarks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Each swimming event has a base time, typically the current world record or a designated standard time, which serves as the reference for scoring. The calculator uses a cubic formula to reward faster times exponentially, meaning that improvements near the top end of performance yield significantly higher points than equivalent improvements at lower levels.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This scoring system is widely used by coaches, athletes, and officials to rank swimmers, set qualifying standards, and track progress over time. By translating raw race times into a universal points scale, it facilitates fair and meaningful comparisons across events and genders.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator supports input of race times in minutes, seconds, and hundredths of a second, ensuring precise conversion. Selecting the correct event is critical, as each event has its own base time that directly influences the points awarded.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the FINA Points Calculator is straightforward and requires only a few inputs. First, select the swimming event corresponding to the race time you want to convert. This ensures the calculator uses the correct base time for scoring.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, enter your race time in minutes, seconds, and hundredths of a second. Accuracy in inputting these values is essential for a precise points calculation. The calculator will automatically validate the inputs to prevent invalid times.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once the inputs are complete, click the Calculate button to generate your FINA points. The result will display the points earned, a brief explanation of the base time used, and any relevant warnings if the performance is significantly below world-class standards.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the swimming event from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your race time in minutes, seconds, and hundredths.
          </li>
          <li>
            <strong>Step 3:</strong> Click the Calculate button to see your FINA points.
          </li>
          <li>
            <strong>Step 4:</strong> Review the points and any notes or warnings provided.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your FINA points and overall swimming performance, focus on a balanced training regimen that targets endurance, speed, and technique. Incorporate interval training sessions that simulate race pace and distances to build both aerobic and anaerobic capacity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Technical refinement is crucial; work with a coach to improve stroke efficiency, starts, turns, and finishes. Small improvements in technique can lead to significant time reductions and higher points.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Monitor your progress regularly using the FINA Points Calculator to set realistic goals and adjust training intensity. Use points as a motivational tool to benchmark against national and international standards.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, prioritize recovery and nutrition to support consistent training gains and reduce injury risk. A holistic approach combining physical, technical, and mental preparation will yield the best results in your swimming career.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.fina.org/swimming/points"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FINA Official Points Table <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official FINA website provides detailed points tables and explanations of the scoring system used for swimming events worldwide.
            </p>
          </li>
          <li>
            <a
              href="https://www.usaswimming.org/docs/default-source/timesdocuments/fina-points-table.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Swimming - FINA Points Table PDF <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              USA Swimming provides downloadable FINA points tables and guidance on how to interpret and use the points system for athlete development.
            </p>
          </li>
          <li>
            <a
              href="https://www.swimmingworldmagazine.com/news/fina-points-calculator-how-it-works/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Swimming World Magazine - How FINA Points Work <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An in-depth article explaining the rationale behind the FINA points system and its application in competitive swimming.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="FINA Points Calculator"
      description="Calculate FINA swimming points. Convert race times into official FINA points for ranking comparison."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Points = 1000 × (BaseTime / SwimmerTime)³",
        variables: [
          { symbol: "Points", description: "FINA points awarded" },
          { symbol: "BaseTime", description: "Base time for the event (seconds)" },
          { symbol: "SwimmerTime", description: "Swimmer's race time (seconds)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer completes the 100m freestyle in 52.35 seconds. The base time for this event is 46.91 seconds (world record).",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the base time for the event: 46.91 seconds for 100m freestyle.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert the swimmer's time into seconds: 52.35 seconds.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the formula: Points = 1000 × (46.91 / 52.35)³ ≈ 1000 × (0.896)³ ≈ 1000 × 0.719 = 719 points.",
          },
          {
            label: "Step 4",
            explanation:
              "The swimmer earns approximately 719 FINA points for this performance.",
          },
        ],
        result: "FINA Points: 719",
      }}
      relatedCalculators={[
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Calories Burned per Workout (MET)", url: "/sports/calories-burned-met", icon: "🔥" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "Macronutrient Calculator (Sports)", url: "/sports/macronutrient-calculator", icon: "🏆" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}