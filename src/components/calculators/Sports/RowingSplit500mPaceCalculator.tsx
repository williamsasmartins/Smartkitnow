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

function parseTimeToSeconds(timeStr) {
  // Accepts "mm:ss" or "hh:mm:ss"
  if (!timeStr) return null;
  const parts = timeStr.split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 2) {
    // mm:ss
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // hh:mm:ss
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}

function formatSecondsToTime(seconds) {
  if (seconds == null || isNaN(seconds) || seconds <= 0) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function formatSecondsToPace(secondsPer500m) {
  // Format pace as mm:ss per 500m
  return formatSecondsToTime(secondsPer500m);
}

export default function RowingSplit500mPaceCalculator() {
  const [inputs, setInputs] = useState({
    totalDistance: "", // meters
    totalTime: "", // hh:mm:ss or mm:ss
    split500m: "", // mm:ss
  });
  const [mode, setMode] = useState("distance-time-to-split"); // or "split-to-pace"

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation logic:
  // Mode 1: Given total distance and total time, calculate average 500m split
  // Mode 2: Given 500m split, calculate pace per 1000m and speed (m/s)

  const results = useMemo(() => {
    if (mode === "distance-time-to-split") {
      // Validate inputs
      const dist = Number(inputs.totalDistance);
      const totalSeconds = parseTimeToSeconds(inputs.totalTime);
      if (!dist || dist <= 0 || !totalSeconds || totalSeconds <= 0) {
        return {
          value: null,
          label: null,
          subtext: null,
          warning: "Please enter valid total distance and total time.",
          formulaUsed: "Split (500m) = (Total Time / Total Distance) × 500",
        };
      }
      // Calculate split per 500m
      const splitSeconds = (totalSeconds / dist) * 500;
      return {
        value: formatSecondsToPace(splitSeconds),
        label: "Average 500m Split",
        subtext: `Based on ${dist} meters in ${inputs.totalTime}`,
        warning: null,
        formulaUsed: "Split (500m) = (Total Time / Total Distance) × 500",
      };
    } else if (mode === "split-to-pace") {
      // Given split per 500m, calculate pace per 1000m and speed (m/s)
      const splitSeconds = parseTimeToSeconds(inputs.split500m);
      if (!splitSeconds || splitSeconds <= 0) {
        return {
          value: null,
          label: null,
          subtext: null,
          warning: "Please enter a valid 500m split time.",
          formulaUsed: "Pace and speed derived from 500m split time",
        };
      }
      // Pace per 1000m = splitSeconds * 2
      const pace1000mSeconds = splitSeconds * 2;
      // Speed in m/s = 500 / splitSeconds
      const speed = 500 / splitSeconds;

      return {
        value: (
          <div className="space-y-2">
            <p>
              <strong>1000m Pace:</strong> {formatSecondsToTime(pace1000mSeconds)} (mm:ss)
            </p>
            <p>
              <strong>Speed:</strong> {speed.toFixed(2)} m/s
            </p>
          </div>
        ),
        label: "Pace & Speed",
        subtext: `Based on 500m split of ${inputs.split500m}`,
        warning: null,
        formulaUsed:
          "1000m Pace = Split (500m) × 2; Speed (m/s) = 500 / Split (seconds)",
      };
    }
    return {
      value: null,
      label: null,
      subtext: null,
      warning: null,
      formulaUsed: "",
    };
  }, [inputs, mode]);

  const faqs = [
    {
      question: "What is a rowing split and why is 500m used as the standard?",
      answer:
        "A rowing split is the time it takes to row a specific distance, commonly 500 meters, which is the standard segment used in rowing ergometer training and competitions. The 500m split provides a consistent metric to gauge pace and effort, allowing rowers to monitor performance and adjust training intensity effectively. Using 500m as a base unit simplifies comparisons across different distances and workouts.",
    },
    {
      question: "How can I use my 500m split to improve my rowing performance?",
      answer:
        "By tracking your 500m split times, you can identify your sustainable pace and monitor improvements over time. Using this calculator, you can convert your total workout time and distance into average splits or translate your splits into pace and speed metrics. This helps in setting realistic training targets, pacing strategies during races, and evaluating the effectiveness of your training sessions.",
    },
    {
      question: "Can this calculator help me plan interval training sessions?",
      answer:
        "Absolutely. Understanding your 500m split allows you to design interval workouts with precise work and rest periods. For example, you can set target split times for high-intensity intervals and calculate the corresponding pace and speed. This enables structured training that improves aerobic and anaerobic capacity, critical for rowing performance.",
    },
    {
      question: "Why is it important to convert splits to pace and speed?",
      answer:
        "Converting splits to pace and speed provides a more comprehensive understanding of your rowing performance. Pace (time per distance) helps in managing effort and endurance, while speed (meters per second) offers insight into power output and efficiency. These metrics are essential for coaches and athletes to tailor training programs and track progress scientifically.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant={mode === "distance-time-to-split" ? "default" : "outline"}
          onClick={() => setMode("distance-time-to-split")}
          className="flex-1 h-11"
          aria-pressed={mode === "distance-time-to-split"}
        >
          <Timer className="mr-2 h-4 w-4" /> Distance & Time → Split
        </Button>
        <Button
          variant={mode === "split-to-pace" ? "default" : "outline"}
          onClick={() => setMode("split-to-pace")}
          className="flex-1 h-11"
          aria-pressed={mode === "split-to-pace"}
        >
          <Gauge className="mr-2 h-4 w-4" /> Split → Pace & Speed
        </Button>
      </div>

      {mode === "distance-time-to-split" && (
        <Card>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="totalDistance" className="mb-1 flex items-center gap-1">
                Total Distance (meters) <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="totalDistance"
                type="number"
                min={1}
                placeholder="e.g. 2000"
                value={inputs.totalDistance}
                onChange={(e) => handleInputChange("totalDistance", e.target.value)}
                aria-describedby="distanceHelp"
              />
              <p id="distanceHelp" className="text-xs text-slate-500 mt-1">
                Enter the total rowing distance in meters.
              </p>
            </div>

            <div>
              <Label htmlFor="totalTime" className="mb-1 flex items-center gap-1">
                Total Time (hh:mm:ss or mm:ss) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="totalTime"
                type="text"
                placeholder="e.g. 07:30 or 00:07:30"
                value={inputs.totalTime}
                onChange={(e) => handleInputChange("totalTime", e.target.value)}
                aria-describedby="timeHelp"
              />
              <p id="timeHelp" className="text-xs text-slate-500 mt-1">
                Enter total time in minutes and seconds (mm:ss) or hours, minutes, and seconds (hh:mm:ss).
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "split-to-pace" && (
        <Card>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="split500m" className="mb-1 flex items-center gap-1">
                500m Split Time (mm:ss) <Activity className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="split500m"
                type="text"
                placeholder="e.g. 01:45"
                value={inputs.split500m}
                onChange={(e) => handleInputChange("split500m", e.target.value)}
                aria-describedby="splitHelp"
              />
              <p id="splitHelp" className="text-xs text-slate-500 mt-1">
                Enter your 500m split time in minutes and seconds.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate rowing split or pace"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ totalDistance: "", totalTime: "", split500m: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {typeof results.value === "string" ? results.value : null}
            </p>
            {typeof results.value !== "string" ? results.value : null}
            {results.label && (
              <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            )}
            {results.subtext && (
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
                <Calculator className="inline w-3 h-3 mr-1" />
                Formula: {results.formulaUsed}
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Rowing Split (500m) &lt;=&gt; Pace
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In rowing, the term "split" refers to the time taken to cover a set distance, most commonly 500 meters. This metric is fundamental for rowers and coaches alike, as it provides a standardized way to measure and compare performance across different workouts and races. The 500m split is widely used because it balances granularity and practicality, offering a clear snapshot of pace without overwhelming detail.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your 500m split allows you to gauge your current fitness level, monitor progress, and tailor your training intensity. It also helps in pacing strategies during races, ensuring you distribute effort efficiently to avoid burnout or underperformance. The split can be converted into pace (time per distance) and speed (distance per time), which are crucial for analyzing rowing efficiency and power output.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator bridges the gap between total distance and time inputs and the 500m split, enabling you to convert between these metrics seamlessly. Whether you want to know your average split from a completed workout or translate a target split into pace and speed, this tool provides authoritative and precise calculations to support your training and performance goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate measurement and understanding of splits and pace are essential for maximizing rowing performance, preventing injury, and achieving long-term athletic development.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator offers two primary modes to suit your needs: converting total distance and time into a 500m split, or converting a known 500m split into pace and speed metrics. Begin by selecting the mode that matches your available data or training goal.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In the first mode, enter the total distance rowed in meters and the total time taken in either mm:ss or hh:mm:ss format. The calculator will compute your average 500m split, providing a clear indication of your pace over the entire distance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In the second mode, input your 500m split time in mm:ss format. The calculator will then display your equivalent pace per 1000m and your average speed in meters per second. These metrics help you understand your rowing efficiency and can guide your training intensity.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the calculation mode that fits your data.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your inputs carefully, ensuring time formats are correct.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to view your results.
          </li>
          <li>
            <strong>Step 4:</strong> Use the results to inform your training or race strategy.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consistently monitoring your 500m split times is a powerful way to track your rowing fitness and progress. Use this metric to set realistic and incremental goals, aiming to gradually reduce your split times through structured training.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate interval training sessions where you row at or slightly faster than your target split for set distances or times, followed by rest periods. This approach improves both aerobic and anaerobic capacity, essential for competitive rowing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Pay attention to your pacing strategy during longer rows or races. Starting too fast can lead to premature fatigue, while too slow a start may leave untapped potential. Use your split data to find a sustainable pace that balances speed and endurance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, combine split and pace data with stroke rate and power output metrics for a holistic view of your rowing performance. This comprehensive approach enables smarter training decisions and better race execution.
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
              href="https://worldrowing.com/technical/rowing-ergometer/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              World Rowing - Rowing Ergometer <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official guidelines and technical information on rowing ergometer training and performance metrics.
            </p>
          </li>
          <li>
            <a
              href="https://www.concept2.com/indoor-rowers/training/calculators"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Concept2 Rowing Calculator <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive rowing calculators including splits, pace, and calories burned, widely used by rowers worldwide.
            </p>
          </li>
          <li>
            <a
              href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0224694"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              PLOS ONE - Rowing Performance Metrics Study <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A scientific study analyzing the relationship between rowing splits, pace, and physiological performance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rowing Split (500m) ↔ Pace"
      description="Convert rowing splits to pace. Calculate 500m split times based on total distance and duration for ergometer training."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "Split (500m) = (Total Time in seconds / Total Distance in meters) × 500\n\nPace per 1000m = Split (500m) × 2\nSpeed (m/s) = 500 / Split (seconds)",
        variables: [
          { symbol: "Split (500m)", description: "Time to row 500 meters" },
          { symbol: "Total Time", description: "Total rowing time in seconds" },
          { symbol: "Total Distance", description: "Total rowing distance in meters" },
          { symbol: "Pace per 1000m", description: "Time to row 1000 meters" },
          { symbol: "Speed", description: "Average speed in meters per second" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You rowed 2000 meters in 7 minutes and 30 seconds. You want to find your average 500m split time.",
        steps: [
          {
            label: "Step 1",
            explanation: "Enter total distance as 2000 meters.",
          },
          {
            label: "Step 2",
            explanation: "Enter total time as 07:30 (7 minutes 30 seconds).",
          },
          {
            label: "Step 3",
            explanation: "Calculate to find the average 500m split.",
          },
        ],
        result: "Your average 500m split is 01:52.5 (1 minute 52.5 seconds).",
      }}
      relatedCalculators={[
        { title: "Soccer League Table: Points & GD", url: "/sports/soccer-league-table-points-gd", icon: "⚽" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Basketball eFG% & TS% Calculator", url: "/sports/basketball-efg-ts", icon: "⚽" },
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
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