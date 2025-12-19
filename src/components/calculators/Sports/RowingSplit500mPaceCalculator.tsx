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

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function parseTimeToSeconds(timeStr: string) {
  // Accept formats like "1:45", "0:45", "2:00"
  const parts = timeStr.split(":").map((p) => p.trim());
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const s = parseFloat(parts[1]);
    if (!isNaN(m) && !isNaN(s)) return m * 60 + s;
  }
  return NaN;
}

export default function RowingSplit500mPaceCalculator() {
  const [inputs, setInputs] = useState({
    mode: "splitToPace", // or "paceToSplit"
    split: "2:00", // time per 500m
    distance: 2000, // meters
    duration: "8:00", // total time
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Calculation logic:
  // Two modes:
  // 1) Given split (time per 500m), distance => calculate total duration and pace (m/s)
  // 2) Given total duration and distance => calculate split (time per 500m) and pace

  const results = useMemo(() => {
    if (inputs.mode === "splitToPace") {
      // Parse split time
      const splitSeconds = parseTimeToSeconds(inputs.split);
      if (isNaN(splitSeconds) || splitSeconds <= 0) {
        return { value: null, label: null, subtext: "Invalid split time format", warning: "Please enter split as MM:SS", formulaUsed: "" };
      }
      if (!inputs.distance || inputs.distance <= 0) {
        return { value: null, label: null, subtext: "Invalid distance", warning: "Distance must be positive", formulaUsed: "" };
      }
      // Calculate total duration = (distance / 500) * splitSeconds
      const totalDurationSeconds = (inputs.distance / 500) * splitSeconds;
      // Calculate pace in m/s
      const pace = inputs.distance / totalDurationSeconds;

      return {
        value: formatTime(totalDurationSeconds),
        label: `Total Duration for ${inputs.distance}m`,
        subtext: `Pace: ${pace.toFixed(2)} m/s`,
        warning: null,
        formulaUsed: `Total Duration (s) = (Distance (m) / 500) × Split Time (s)`,
      };
    } else if (inputs.mode === "paceToSplit") {
      // Parse duration
      const durationSeconds = parseTimeToSeconds(inputs.duration);
      if (isNaN(durationSeconds) || durationSeconds <= 0) {
        return { value: null, label: null, subtext: "Invalid duration format", warning: "Please enter duration as MM:SS", formulaUsed: "" };
      }
      if (!inputs.distance || inputs.distance <= 0) {
        return { value: null, label: null, subtext: "Invalid distance", warning: "Distance must be positive", formulaUsed: "" };
      }
      // Calculate split time = totalDuration / (distance / 500)
      const splitSeconds = durationSeconds / (inputs.distance / 500);
      // Calculate pace in m/s
      const pace = inputs.distance / durationSeconds;

      return {
        value: formatTime(splitSeconds),
        label: `Split Time per 500m for ${inputs.distance}m`,
        subtext: `Pace: ${pace.toFixed(2)} m/s`,
        warning: null,
        formulaUsed: `Split Time (s) = Total Duration (s) / (Distance (m) / 500)`,
      };
    }
    return { value: null, label: null, subtext: null, warning: "Invalid mode", formulaUsed: "" };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a rowing split and why is 500m the standard?",
      answer:
        "A rowing split is the time it takes to row 500 meters, which is the standard distance used to measure rowing pace on ergometers and in training. It allows athletes and coaches to compare performance consistently across different distances and sessions. The 500m split is widely accepted because it balances granularity and practicality in pacing strategy.",
    },
    {
      question: "How does pace relate to rowing split times?",
      answer:
        "Pace in rowing is typically expressed as meters per second or minutes per 500 meters (split). The split time is inversely proportional to pace: a faster pace means a lower split time. Understanding this relationship helps rowers optimize their stroke rate and power output to maintain target speeds during training or competition.",
    },
    {
      question: "Can I use this calculator for on-water rowing?",
      answer:
        "While this calculator is primarily designed for ergometer rowing, the concepts of split times and pace apply similarly on water. However, environmental factors like wind, current, and water conditions can affect actual on-water pace, so adjustments may be necessary for precise performance analysis.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="mode" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          Mode <Calculator className="w-4 h-4 text-blue-600" />
        </Label>
        <Select
          value={inputs.mode}
          onValueChange={(v) => handleInputChange("mode", v)}
          aria-label="Select calculation mode"
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="splitToPace">Split Time → Total Duration & Pace</SelectItem>
            <SelectItem value="paceToSplit">Total Duration & Distance → Split Time & Pace</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {inputs.mode === "splitToPace" && (
        <>
          <div>
            <Label htmlFor="split" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              Split Time per 500m (MM:SS) <Timer className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="split"
              type="text"
              placeholder="e.g. 2:00"
              value={inputs.split}
              onChange={(e) => handleInputChange("split", e.target.value)}
              aria-describedby="split-help"
            />
            <p id="split-help" className="text-xs text-slate-500 mt-1">
              Enter your average split time per 500 meters in minutes and seconds.
            </p>
          </div>
          <div>
            <Label htmlFor="distance" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              Distance (meters) <Flag className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="distance"
              type="number"
              min={500}
              step={100}
              value={inputs.distance}
              onChange={(e) => handleInputChange("distance", Number(e.target.value))}
              aria-describedby="distance-help"
            />
            <p id="distance-help" className="text-xs text-slate-500 mt-1">
              Enter the total rowing distance in meters (e.g., 2000).
            </p>
          </div>
        </>
      )}

      {inputs.mode === "paceToSplit" && (
        <>
          <div>
            <Label htmlFor="duration" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              Total Duration (MM:SS) <Timer className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="duration"
              type="text"
              placeholder="e.g. 8:00"
              value={inputs.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              aria-describedby="duration-help"
            />
            <p id="duration-help" className="text-xs text-slate-500 mt-1">
              Enter the total time taken to row the distance.
            </p>
          </div>
          <div>
            <Label htmlFor="distance" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              Distance (meters) <Flag className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="distance"
              type="number"
              min={500}
              step={100}
              value={inputs.distance}
              onChange={(e) => handleInputChange("distance", Number(e.target.value))}
              aria-describedby="distance-help"
            />
            <p id="distance-help" className="text-xs text-slate-500 mt-1">
              Enter the total rowing distance in meters.
            </p>
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, results update automatically
          }}
          aria-label="Calculate rowing split or pace"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              mode: "splitToPace",
              split: "2:00",
              distance: 2000,
              duration: "8:00",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center justify-center gap-1">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Rowing Split (500m) ↔ Pace</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The rowing split time is a fundamental metric in rowing performance analysis, representing the time taken to cover 500 meters on an ergometer or on water. This standardized distance allows athletes and coaches to benchmark performance, monitor training progress, and develop pacing strategies. The split time is inversely related to pace; a lower split indicates a faster pace, which is critical for optimizing race outcomes and training efficiency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Pace, often expressed in meters per second or minutes per 500 meters, quantifies the speed at which a rower covers distance. Understanding the relationship between split times and overall pace enables precise adjustments in stroke rate and power application, which are essential for endurance and sprint events alike. This calculator bridges these metrics, allowing conversion between split times and total duration for any given distance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate pacing is vital in rowing to avoid premature fatigue and to maximize efficiency. Coaches use split times to prescribe training intensities and to simulate race conditions on ergometers. This tool supports those efforts by providing quick, reliable conversions and insights into rowing performance metrics.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator offers two primary modes to convert between rowing split times and overall pace/duration. Select the mode that matches your available data, then input the required values. The calculator will instantly provide the corresponding metric, helping you analyze or plan your rowing sessions effectively.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Split Time → Total Duration & Pace:</strong> Enter your average split time per 500 meters and the total distance you plan to row. The calculator will estimate your total duration and average pace.
          </li>
          <li>
            <strong>Total Duration & Distance → Split Time & Pace:</strong> Input the total time taken and the distance rowed to find your average split time per 500 meters and pace.
          </li>
          <li>
            Ensure time inputs are in <em>minutes:seconds</em> format (e.g., 2:00 for two minutes).
          </li>
          <li>
            Use the reset button to clear inputs and start fresh calculations.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consistent monitoring of split times during ergometer sessions can significantly enhance rowing performance by providing immediate feedback on pacing and endurance. Incorporate interval training with varied split targets to develop both aerobic capacity and anaerobic power. Adjust your stroke rate and power output based on split feedback to optimize efficiency and delay fatigue.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When training for races, simulate race pace splits to condition your body for the demands of competition. Use this calculator to set realistic split goals based on your target race time and distance. Remember to factor in recovery periods and cross-train to maintain overall fitness and prevent injury.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, track your progress over time by recording split times and total durations. This data-driven approach allows for informed adjustments to your training plan, ensuring continuous improvement and peak performance on race day.
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
          For more information on rowing physiology, pacing strategies, and ergometer training, consult the following authoritative sources:
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
              The ACSM provides comprehensive research and guidelines on exercise science, including endurance sports and rowing physiology.
            </p>
          </li>
          <li>
            <a
              href="https://www.usrowing.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USRowing <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The national governing body for rowing in the United States, offering training resources, coaching education, and performance standards.
            </p>
          </li>
          <li>
            <a
              href="https://www.rowingnews.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Rowing News <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A leading publication covering rowing training techniques, ergometer workouts, and athlete interviews.
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
          "Total Duration (s) = (Distance (m) / 500) × Split Time (s)\nSplit Time (s) = Total Duration (s) / (Distance (m) / 500)",
        variables: [
          { symbol: "Distance (m)", description: "Total rowing distance in meters" },
          { symbol: "Split Time (s)", description: "Time to row 500 meters in seconds" },
          { symbol: "Total Duration (s)", description: "Total time to row the distance in seconds" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An athlete wants to know how long it will take to row 2000 meters if their average split time is 1 minute 50 seconds per 500 meters.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert the split time to seconds: 1 minute 50 seconds = 110 seconds.",
          },
          {
            label: "Step 2",
            explanation: "Calculate the number of 500m segments in 2000m: 2000 / 500 = 4.",
          },
          {
            label: "Step 3",
            explanation: "Multiply the split time by the number of segments: 110 × 4 = 440 seconds.",
          },
          {
            label: "Step 4",
            explanation: "Convert total seconds back to minutes: 440 seconds = 7 minutes 20 seconds.",
          },
        ],
        result: "The total duration to row 2000 meters at a 1:50 split is 7 minutes and 20 seconds.",
      }}
      relatedCalculators={[
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Soccer League Table: Points & GD", url: "/sports/soccer-league-table-points-gd", icon: "⚽" },
        { title: "Tournament Bracket Seeding Helper", url: "/sports/tournament-bracket-seeding-helper", icon: "🏆" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
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