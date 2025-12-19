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

const swimEvents = [
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
  { label: "200m Individual Medley", distance: 200, stroke: "medley" },
  { label: "400m Individual Medley", distance: 400, stroke: "medley" },
];

// Reference world record times in seconds (approximate, for men long course meters, 2024)
// Source: FINA World Records (https://www.fina.org/swimming/records)
const worldRecords = {
  freestyle: {
    50: 20.91,
    100: 46.91,
    200: 100.00,
    400: 220.00,
    800: 430.00,
    1500: 870.00,
  },
  backstroke: {
    50: 24.00,
    100: 51.85,
    200: 112.00,
  },
  breaststroke: {
    50: 25.95,
    100: 55.49,
    200: 125.00,
  },
  butterfly: {
    50: 22.27,
    100: 49.45,
    200: 112.00,
  },
  medley: {
    200: 110.00,
    400: 240.00,
  },
};

/**
 * Calculate FINA Points for a swim performance.
 * The FINA points system is a standardized scoring system to compare swimming performances across different events.
 * Formula: Points = 1000 * (B / T)^3
 * Where B = base time (world record), T = swimmer's time.
 * 
 * This cubic relationship rewards performances closer to the world record exponentially.
 * 
 * @param {number} timeSeconds - Swimmer's time in seconds.
 * @param {number} baseTimeSeconds - World record time in seconds.
 * @returns {number} Points scored.
 */
function calculateFINAPoints(timeSeconds: number, baseTimeSeconds: number) {
  if (timeSeconds <= 0 || baseTimeSeconds <= 0) return 0;
  const ratio = baseTimeSeconds / timeSeconds;
  const points = 1000 * Math.pow(ratio, 3);
  return Math.round(points);
}

export default function SwimmingPowerPointsCalculator() {
  const [inputs, setInputs] = useState({
    event: swimEvents[1].label,
    timeMinutes: "",
    timeSeconds: "",
    timeHundredths: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parse time inputs into total seconds
  const totalTimeSeconds = useMemo(() => {
    const min = parseInt(inputs.timeMinutes, 10);
    const sec = parseInt(inputs.timeSeconds, 10);
    const hund = parseInt(inputs.timeHundredths, 10);
    if (
      isNaN(min) ||
      isNaN(sec) ||
      isNaN(hund) ||
      min < 0 ||
      sec < 0 ||
      sec >= 60 ||
      hund < 0 ||
      hund >= 100
    ) {
      return null;
    }
    return min * 60 + sec + hund / 100;
  }, [inputs.timeMinutes, inputs.timeSeconds, inputs.timeHundredths]);

  // Find event details and base time
  const eventDetails = useMemo(() => {
    return swimEvents.find((e) => e.label === inputs.event);
  }, [inputs.event]);

  const baseTime = useMemo(() => {
    if (!eventDetails) return null;
    const strokeRecords = worldRecords[eventDetails.stroke];
    if (!strokeRecords) return null;
    return strokeRecords[eventDetails.distance] || null;
  }, [eventDetails]);

  // Calculate points
  const results = useMemo(() => {
    if (!totalTimeSeconds || !baseTime) {
      return {
        value: null,
        label: "Enter valid time and event",
        subtext: null,
        warning: null,
        formulaUsed: "Points = 1000 × (World Record Time / Your Time)^3",
      };
    }
    if (totalTimeSeconds < baseTime) {
      return {
        value: null,
        label: "Invalid time",
        subtext: "Your time cannot be faster than the world record time.",
        warning: "Please check your input.",
        formulaUsed: "Points = 1000 × (World Record Time / Your Time)^3",
      };
    }
    const points = calculateFINAPoints(totalTimeSeconds, baseTime);
    return {
      value: points.toLocaleString(),
      label: "FINA Points",
      subtext: `Based on world record of ${baseTime.toFixed(2)} seconds for ${eventDetails.label}`,
      warning: null,
      formulaUsed: "Points = 1000 × (World Record Time / Your Time)^3",
    };
  }, [totalTimeSeconds, baseTime, eventDetails]);

  const faqs = [
    {
      question: "What are Swimming Power Points?",
      answer:
        "Swimming Power Points, commonly known as FINA Points, are a standardized scoring system that allows comparison of swimming performances across different strokes and distances. The system uses world record times as a baseline and applies a cubic formula to reward performances closer to these records exponentially.",
    },
    {
      question: "Why use the cubic formula in the calculation?",
      answer:
        "The cubic formula (Points = 1000 × (World Record Time / Your Time)^3) emphasizes the difficulty of approaching world record performances. It ensures that small improvements near the record yield significantly higher points, reflecting the elite level of performance required.",
    },
    {
      question: "Can I compare points across different events?",
      answer:
        "Yes, the FINA Points system is designed to normalize performances across various swimming events and strokes, enabling fair comparison of athletes' power and speed regardless of their specialty.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Label htmlFor="event" className="mb-2 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Waves className="w-5 h-5 text-blue-600" /> Select Event
          </Label>
          <Select
            value={inputs.event}
            onValueChange={(v) => handleInputChange("event", v)}
            aria-label="Select swimming event"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {swimEvents.map((ev) => (
                <SelectItem key={ev.label} value={ev.label}>
                  {ev.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Label htmlFor="time" className="mb-2 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            <Timer className="w-5 h-5 text-blue-600" /> Enter Your Time (MM:SS.HH)
          </Label>
          <div className="flex gap-2 max-w-xs">
            <Input
              type="number"
              min={0}
              max={59}
              placeholder="MM"
              aria-label="Minutes"
              value={inputs.timeMinutes}
              onChange={(e) => handleInputChange("timeMinutes", e.target.value)}
              className="w-16 text-center"
            />
            <span className="text-xl font-bold select-none">:</span>
            <Input
              type="number"
              min={0}
              max={59}
              placeholder="SS"
              aria-label="Seconds"
              value={inputs.timeSeconds}
              onChange={(e) => handleInputChange("timeSeconds", e.target.value)}
              className="w-16 text-center"
            />
            <span className="text-xl font-bold select-none">.</span>
            <Input
              type="number"
              min={0}
              max={99}
              placeholder="HH"
              aria-label="Hundredths"
              value={inputs.timeHundredths}
              onChange={(e) => handleInputChange("timeHundredths", e.target.value)}
              className="w-16 text-center"
            />
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter your swim time in minutes, seconds, and hundredths of a second.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate Swimming Power Points"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              event: swimEvents[1].label,
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

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            {results.subtext && <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>}
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Swimming Power Points Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Swimming Power Points Calculator is designed to provide an objective measure of swimming performance by converting swim times into standardized points. This system, based on the FINA Points Table, allows swimmers, coaches, and analysts to compare performances across different strokes and distances fairly. By using world record times as a baseline, the calculator rewards performances exponentially closer to these elite benchmarks, reflecting the increasing difficulty of marginal improvements at the highest level.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core formula used is Points = 1000 × (World Record Time / Your Time)^3, which means that as a swimmer's time approaches the world record, their points increase dramatically. This cubic relationship emphasizes the significance of elite-level performance and helps in talent identification, training evaluation, and competition analysis. The calculator supports multiple events and strokes, making it a versatile tool for swimmers of all levels.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Swimming Power Points Calculator is straightforward and requires only two inputs: the swimming event and your recorded time. Select the event from the dropdown menu, ensuring it matches the stroke and distance of your swim. Then, enter your swim time in minutes, seconds, and hundredths of a second to achieve the highest accuracy.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the swimming event that corresponds to your performance (e.g., 100m Freestyle).
          </li>
          <li>
            <strong>Step 2:</strong> Input your swim time accurately in the format MM:SS.HH (minutes, seconds, hundredths).
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to generate your Swimming Power Points.
          </li>
          <li>
            <strong>Step 4:</strong> Review your points and compare them to other performances or use them to track your progress.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your Swimming Power Points, focus on improving your technique, endurance, and race strategy. Efficient stroke mechanics reduce drag and energy expenditure, allowing you to swim faster with less effort. Incorporate interval training and race-pace sets into your workouts to build speed and anaerobic capacity, which are critical for sprint and middle-distance events.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, monitor your progress regularly using this calculator to identify plateaus or improvements. Cross-training with strength and conditioning exercises can enhance power output and injury resilience. Remember, consistent training, proper nutrition, and adequate recovery are essential components for achieving elite swimming performances reflected by higher power points.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on swimming performance metrics, training science, and official rules, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletic performance and training.
            </p>
          </li>
          <li>
            <a
              href="https://www.fina.org/swimming/records"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FINA (International Swimming Federation) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official governing body for international swimming, maintaining world records, rules, and the FINA Points Table used in this calculator.
            </p>
          </li>
          <li>
            <a
              href="https://www.usaswimming.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Swimming <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The national governing body for competitive swimming in the United States, offering resources on training, technique, and performance analysis.
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
        formula: "Points = 1000 × (World Record Time / Your Time)^3",
        variables: [
          { symbol: "Points", description: "Swimming Power Points scored" },
          { symbol: "World Record Time", description: "Official world record time for the event (seconds)" },
          { symbol: "Your Time", description: "Swimmer's recorded time (seconds)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer completes the 100m freestyle in 55.32 seconds. The world record for this event is approximately 46.91 seconds.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the world record time for the 100m freestyle (46.91 seconds).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the ratio: 46.91 / 55.32 ≈ 0.848.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the cubic formula: 1000 × (0.848)^3 ≈ 1000 × 0.609 ≈ 609 points.",
          },
          {
            label: "Step 4",
            explanation:
              "The swimmer earns approximately 609 Swimming Power Points for this performance.",
          },
        ],
        result: "Swimming Power Points: 609",
      }}
      relatedCalculators={[
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "Baseball OPS / SLG / OBP Calculator", url: "/sports/baseball-ops-slg-obp", icon: "⚽" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
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