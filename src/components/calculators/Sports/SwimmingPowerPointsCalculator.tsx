import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import {
  Activity,
  Timer,
  TrendingUp,
  Dumbbell,
  Trophy,
  Medal,
  Flag,
  Flame,
  Zap,
  Heart,
  Scale,
  Calculator,
  Info,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Waves,
  Gauge,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const EVENTS = [
  { label: "50m Freestyle", distance: 50, stroke: "freestyle" },
  { label: "100m Freestyle", distance: 100, stroke: "freestyle" },
  { label: "200m Freestyle", distance: 200, stroke: "freestyle" },
  { label: "400m Freestyle", distance: 400, stroke: "freestyle" },
  { label: "800m Freestyle", distance: 800, stroke: "freestyle" },
  { label: "1500m Freestyle", distance: 1500, stroke: "freestyle" },
  { label: "50m Backstroke", distance: 50, stroke: "backstroke" },
  { label: "100m Backstroke", distance: 100, stroke: "backstroke" },
  { label: "200m Backstroke", distance: 200, stroke: "backstroke" },
  { label: "50m Breaststroke", distance: 50, stroke: "breaststroke" },
  { label: "100m Breaststroke", distance: 100, stroke: "breaststroke" },
  { label: "200m Breaststroke", distance: 200, stroke: "breaststroke" },
  { label: "50m Butterfly", distance: 50, stroke: "butterfly" },
  { label: "100m Butterfly", distance: 100, stroke: "butterfly" },
  { label: "200m Butterfly", distance: 200, stroke: "butterfly" },
  { label: "200m Individual Medley", distance: 200, stroke: "im" },
  { label: "400m Individual Medley", distance: 400, stroke: "im" },
];

// Power Points calculation is based on FINA points system principles:
// Points = 1000 * (BaseTime / SwimmerTime)^3
// BaseTime is the world record or standard time for the event.
// This cubic relationship rewards faster times exponentially.
// For demonstration, we use approximate world record times (in seconds) for each event.

const BASE_TIMES: Record<string, number> = {
  "50m freestyle": 20.91,
  "100m freestyle": 46.91,
  "200m freestyle": 101.00,
  "400m freestyle": 210.00,
  "800m freestyle": 420.00,
  "1500m freestyle": 875.00,
  "50m backstroke": 24.00,
  "100m backstroke": 51.85,
  "200m backstroke": 112.00,
  "50m breaststroke": 26.62,
  "100m breaststroke": 56.88,
  "200m breaststroke": 127.00,
  "50m butterfly": 22.27,
  "100m butterfly": 49.50,
  "200m butterfly": 111.00,
  "200m individual medley": 104.00,
  "400m individual medley": 225.00,
};

function formatTimeToSeconds(timeStr: string) {
  // Accepts mm:ss.xx or ss.xx or sss.xx formats and converts to seconds as float
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  if (parts.length === 1) {
    // seconds only
    const val = parseFloat(parts[0]);
    return isNaN(val) ? null : val;
  } else if (parts.length === 2) {
    const min = parseInt(parts[0], 10);
    const sec = parseFloat(parts[1]);
    if (isNaN(min) || isNaN(sec)) return null;
    return min * 60 + sec;
  }
  return null;
}

export default function SwimmingPowerPointsCalculator() {
  const [inputs, setInputs] = useState({
    event: "",
    time: "",
  });
  const [calculated, setCalculated] = useState(null);

  const handleInputChange = useCallback(
    (n, v) => {
      setInputs((p) => ({ ...p, [n]: v }));
      setCalculated(null);
    },
    [setInputs]
  );

  const calculatePoints = useCallback(() => {
    const eventKey = inputs.event.toLowerCase();
    const baseTime = BASE_TIMES[eventKey];
    if (!baseTime) return null;

    const swimTime = formatTimeToSeconds(inputs.time);
    if (!swimTime || swimTime <= 0) return null;

    // Formula: Points = 1000 * (BaseTime / SwimmerTime)^3
    const ratio = baseTime / swimTime;
    if (ratio <= 0) return null;

    const points = 1000 * Math.pow(ratio, 3);
    return Math.round(points);
  }, [inputs]);

  const onCalculate = () => {
    const pts = calculatePoints();
    setCalculated(pts);
  };

  const faqs = [
    {
      question: "What are Swimming Power Points and why are they important?",
      answer:
        "Swimming Power Points are a standardized scoring system that allows swimmers and coaches to compare performances across different events and distances. By converting swim times into a single points value, it becomes easier to evaluate relative performance levels, track progress, and set training goals regardless of the stroke or distance.",
    },
    {
      question: "How is the Swimming Power Points score calculated?",
      answer:
        "The score is calculated using a cubic formula where the swimmer's time is compared against a base time, typically the world record or a recognized standard. The formula rewards faster times exponentially, meaning small improvements in time can lead to significant increases in points. This method ensures fair comparison across events.",
    },
    {
      question: "Can I use this calculator for any swimming event?",
      answer:
        "This calculator currently supports a wide range of common competitive swimming events including freestyle, backstroke, breaststroke, butterfly, and individual medley distances. For events not listed, the calculator may not provide accurate points as base times are required for calculation.",
    },
    {
      question: "How can I improve my Swimming Power Points?",
      answer:
        "Improving your Swimming Power Points requires improving your swim times through focused training, technique refinement, and race strategy. Consistent training, strength conditioning, and proper recovery are key factors. Using this calculator regularly can help monitor your progress and adjust your training accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="event" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          Select Event <Waves className="w-4 h-4 text-blue-600" />
        </Label>
        <Select
          value={inputs.event}
          onValueChange={(v) => handleInputChange("event", v)}
          aria-label="Select swimming event"
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose an event" />
          </SelectTrigger>
          <SelectContent>
            {EVENTS.map((ev) => (
              <SelectItem key={ev.label} value={ev.label}>
                {ev.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="time" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          Enter Your Time (mm:ss.ss or ss.ss) <Timer className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="time"
          type="text"
          placeholder="e.g. 1:02.34 or 62.34"
          value={inputs.time}
          onChange={(e) => handleInputChange("time", e.target.value)}
          aria-describedby="time-format-help"
        />
        <p id="time-format-help" className="text-xs text-slate-500 mt-1">
          Use minutes and seconds separated by colon or seconds only.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={onCalculate}
          disabled={!inputs.event || !inputs.time}
          aria-disabled={!inputs.event || !inputs.time}
          aria-label="Calculate Swimming Power Points"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({ event: "", time: "" });
            setCalculated(null);
          }}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {calculated !== null && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{calculated}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">
              Swimming Power Points
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Based on your time in the {inputs.event} event. Higher points indicate better performance relative to world-class standards.
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
          Understanding Swimming Power Points Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Swimming Power Points provide a standardized metric to evaluate and compare swimming performances across different strokes and distances. Unlike raw times, which vary greatly depending on the event, power points translate these times into a single scale that reflects the quality of the swim relative to elite benchmarks. This allows swimmers, coaches, and analysts to objectively assess performance levels and improvements.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation is based on a cubic formula that compares the swimmer's time to a base time, typically the world record or a recognized standard for that event. The cubic relationship means that improvements in time yield exponentially higher points, rewarding faster swims more significantly. This approach is widely accepted in competitive swimming analytics and is used by organizations such as FINA.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By using this calculator, swimmers can gain insight into their relative strengths across different events, identify areas for improvement, and set realistic goals. It also facilitates fair comparison between swimmers specializing in different strokes or distances, making it a valuable tool for coaches and talent scouts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator supports a broad range of competitive swimming events, including freestyle, backstroke, breaststroke, butterfly, and individual medley distances. It is designed to be user-friendly while providing accurate and meaningful results based on established performance standards.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Swimming Power Points Calculator, start by selecting the swimming event you want to evaluate from the dropdown menu. The list includes common competitive events across all strokes and distances. Accurate selection ensures the correct base time is used for calculation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, enter your swim time for the selected event. The time should be entered in a format such as mm:ss.ss (minutes and seconds) or ss.ss (seconds only). For example, a time of 1 minute and 2.34 seconds can be entered as "1:02.34" or "62.34". The calculator will parse this input and convert it into seconds for computation.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering your time, click the "Calculate" button. The calculator will process your input and display your Swimming Power Points score. This score reflects your performance relative to world-class standards, with higher points indicating better swims. You can reset the inputs at any time to evaluate different performances.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the swimming event from the dropdown.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your swim time in mm:ss.ss or ss.ss format.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to see your Swimming Power Points.
          </li>
          <li>
            <strong>Step 4:</strong> Use the results to compare performances or track progress.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your Swimming Power Points requires a holistic approach to training that balances technique, endurance, strength, and race strategy. Focus on refining your stroke mechanics to reduce drag and increase propulsion. Video analysis and coaching feedback can be invaluable for identifying inefficiencies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate interval training and pace work into your sessions to build aerobic and anaerobic capacity. Structured sets that mimic race pace help condition your body to sustain high speeds. Strength training, particularly core and upper body exercises, supports powerful strokes and better starts and turns.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Recovery and nutrition are equally important. Ensure adequate rest between intense sessions to allow muscle repair and adaptation. Proper hydration and a balanced diet fuel training and optimize performance. Regularly use this calculator to monitor your progress and adjust your training plan accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, mental preparation and race tactics such as pacing, breathing patterns, and starts can make a significant difference in your swim times and thus your power points. Work with your coach to develop a race plan tailored to your strengths and event.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
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
              FINA Swimming Points System <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official FINA resource explaining the points system used to compare swimming performances across events.
            </p>
          </li>
          <li>
            <a
              href="https://www.usaswimming.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Swimming <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive resource for competitive swimming training, technique, and performance analysis.
            </p>
          </li>
          <li>
            <a
              href="https://www.swimmingworldmagazine.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Swimming World Magazine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Industry-leading publication providing news, training tips, and scientific insights into swimming performance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Swimming Power Points Calculator"
      description="Calculate swimming power points. Compare performances across different events and distances using standardized scoring tables."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Points = 1000 × (BaseTime / SwimmerTime)^3",
        variables: [
          { symbol: "Points", description: "Swimming Power Points score" },
          { symbol: "BaseTime", description: "World record or standard time for the event (in seconds)" },
          { symbol: "SwimmerTime", description: "Your swim time for the event (in seconds)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer completes the 100m freestyle in 55.00 seconds. The world record base time is 46.91 seconds. Calculate the Swimming Power Points.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the base time for 100m freestyle: 46.91 seconds.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert swimmer's time to seconds: 55.00 seconds.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the formula: Points = 1000 × (46.91 / 55.00)^3 ≈ 1000 × (0.852)^3 ≈ 1000 × 0.618 = 618 points.",
          },
          {
            label: "Step 4",
            explanation:
              "The swimmer's Swimming Power Points score is approximately 618, indicating their performance relative to the world record.",
          },
        ],
        result: "618 points",
      }}
      relatedCalculators={[
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "🏆" },
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