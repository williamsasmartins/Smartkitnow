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

export default function SwimIntervalPaceCalculator() {
  /**
   * Inputs:
   * - distancePerRepeat: number (meters)
   * - targetTime: string (mm:ss or ss)
   * - restInterval: string (mm:ss or ss)
   * - numberOfRepeats: number
   * - paceUnit: "min/100m" or "sec/100m"
   */

  const [inputs, setInputs] = useState({
    distancePerRepeat: 100,
    targetTime: "",
    restInterval: "00:30",
    numberOfRepeats: 4,
    paceUnit: "min/100m",
  });

  // Parse time string mm:ss or ss to total seconds
  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":").map((p) => p.trim());
    if (parts.length === 1) return parseFloat(parts[0]) || 0;
    if (parts.length === 2) return (parseInt(parts[0], 10) || 0) * 60 + (parseFloat(parts[1]) || 0);
    return 0;
  };

  // Format seconds to mm:ss
  const formatSecondsToMMSS = (seconds) => {
    if (seconds === 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const dist = Number(inputs.distancePerRepeat);
    const repeats = Number(inputs.numberOfRepeats);
    if (dist <= 0 || repeats <= 0) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Distance and number of repeats must be positive numbers.",
        formulaUsed: null,
      };
    }

    const targetTimeSec = parseTimeToSeconds(inputs.targetTime);
    const restTimeSec = parseTimeToSeconds(inputs.restInterval);

    if (targetTimeSec <= 0) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter a valid target time greater than zero.",
        formulaUsed: null,
      };
    }

    // Calculate pace per 100m
    // pace = (targetTimeSec / distance) * 100
    const pacePer100mSec = (targetTimeSec / dist) * 100;

    // Total swim time (excluding rest)
    const totalSwimTimeSec = targetTimeSec * repeats;

    // Total rest time
    const totalRestTimeSec = restTimeSec * (repeats - 1);

    // Total workout time
    const totalWorkoutTimeSec = totalSwimTimeSec + totalRestTimeSec;

    // Format pace output
    let paceFormatted = "";
    if (inputs.paceUnit === "min/100m") {
      paceFormatted = formatSecondsToMMSS(pacePer100mSec);
    } else {
      paceFormatted = pacePer100mSec.toFixed(1) + " sec/100m";
    }

    return {
      value: paceFormatted,
      label: "Target Pace per 100m",
      subtext: `Total workout time: ${formatSecondsToMMSS(totalWorkoutTimeSec)} (including rest)`,
      warning: null,
      formulaUsed: `Pace = (Target Time ÷ Distance) × 100`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is swim interval pace and why is it important?",
      answer:
        "Swim interval pace refers to the speed at which a swimmer completes a set distance during interval training. It is crucial for structuring workouts that improve speed, endurance, and efficiency by balancing effort and recovery. Maintaining consistent interval pace helps swimmers optimize training adaptations and avoid overtraining or undertraining.",
    },
    {
      question: "How should I choose rest intervals between repeats?",
      answer:
        "Rest intervals depend on your training goals. Shorter rest periods (e.g., 15-30 seconds) enhance aerobic capacity and endurance, while longer rests (e.g., 45-90 seconds) allow for higher intensity efforts targeting speed and anaerobic power. Adjust rest based on your fitness level and workout objectives to maximize performance gains.",
    },
    {
      question: "Can I use this calculator for distances other than 100m repeats?",
      answer:
        "Yes, this calculator supports any repeat distance you input, such as 50m, 200m, or 400m. It calculates the equivalent pace per 100m based on your target time for the specified distance, allowing you to standardize pacing across different interval lengths.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="distancePerRepeat" className="flex items-center gap-2">
              <Waves /> Distance per Repeat (meters)
            </Label>
            <Input
              id="distancePerRepeat"
              type="number"
              min={10}
              step={10}
              value={inputs.distancePerRepeat}
              onChange={(e) => handleInputChange("distancePerRepeat", e.target.value)}
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <Label htmlFor="targetTime" className="flex items-center gap-2">
              <Timer /> Target Time (mm:ss or seconds)
            </Label>
            <Input
              id="targetTime"
              type="text"
              value={inputs.targetTime}
              onChange={(e) => handleInputChange("targetTime", e.target.value)}
              placeholder="e.g. 1:30 or 90"
            />
          </div>
          <div>
            <Label htmlFor="restInterval" className="flex items-center gap-2">
              <Heart /> Rest Interval (mm:ss or seconds)
            </Label>
            <Input
              id="restInterval"
              type="text"
              value={inputs.restInterval}
              onChange={(e) => handleInputChange("restInterval", e.target.value)}
              placeholder="e.g. 0:30 or 30"
            />
          </div>
          <div>
            <Label htmlFor="numberOfRepeats" className="flex items-center gap-2">
              <Activity /> Number of Repeats
            </Label>
            <Input
              id="numberOfRepeats"
              type="number"
              min={1}
              step={1}
              value={inputs.numberOfRepeats}
              onChange={(e) => handleInputChange("numberOfRepeats", e.target.value)}
              placeholder="e.g. 4"
            />
          </div>
          <div>
            <Label htmlFor="paceUnit" className="flex items-center gap-2">
              <Scale /> Pace Unit
            </Label>
            <Select
              value={inputs.paceUnit}
              onValueChange={(v) => handleInputChange("paceUnit", v)}
              id="paceUnit"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pace unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="min/100m">Minutes per 100m</SelectItem>
                <SelectItem value="sec/100m">Seconds per 100m</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              distancePerRepeat: 100,
              targetTime: "",
              restInterval: "00:30",
              numberOfRepeats: 4,
              paceUnit: "min/100m",
            })
          }
          className="flex-1 h-11"
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
              <p className="text-red-600 dark:text-red-400 mt-2 flex items-center justify-center gap-2">
                <AlertTriangle /> {results.warning}
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
          Understanding Swim Interval Pace Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Swim Interval Pace Calculator is a specialized tool designed to help swimmers and coaches
          determine the optimal pace per 100 meters based on target times for specific interval distances.
          Interval training is a cornerstone of swim conditioning, allowing athletes to improve speed,
          endurance, and technique by repeating set distances with controlled rest periods. By calculating
          the pace per 100 meters, swimmers can standardize their training intensity regardless of the
          interval distance, facilitating consistent progress tracking and workout planning.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator also factors in rest intervals and the number of repeats to provide an estimate
          of total workout duration, which is essential for managing training load and recovery. Understanding
          and applying interval pace principles can significantly enhance swim performance and reduce injury risk.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Swim Interval Pace Calculator effectively, input the distance of each repeat in meters,
          your target time for that distance, the rest interval between repeats, and the total number of repeats
          you plan to complete. Select your preferred pace unit, either minutes per 100 meters or seconds per 100 meters,
          to view the calculated pace accordingly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the distance per repeat (e.g., 100 meters or 50 meters).
          </li>
          <li>
            <strong>Step 2:</strong> Input your target time for that distance in mm:ss format or total seconds.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the rest interval between repeats, also in mm:ss or seconds.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the number of repeats you intend to swim.
          </li>
          <li>
            <strong>Step 5:</strong> Choose your preferred pace unit for the output.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to see your target pace per 100 meters and total workout time.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When designing interval swim workouts, it is important to balance intensity and recovery to maximize
          physiological adaptations. Use this calculator to set realistic and challenging target paces that push
          your aerobic and anaerobic thresholds without causing excessive fatigue. Incorporate varied rest intervals
          to target different energy systems: shorter rests for endurance and longer rests for sprint speed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Consistency in pacing is key; aim to maintain your calculated pace across all repeats to develop pacing
          discipline and race readiness. Additionally, monitor your perceived exertion and adjust rest or pace accordingly
          to avoid overtraining. Combining interval pace data with stroke technique analysis can further enhance swim efficiency.
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
          For more information on swim training science, pacing strategies, and interval training principles, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for training and performance.
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
              The national governing body for competitive swimming in the United States, offering training resources, technique guides, and official rules.
            </p>
          </li>
          <li>
            <a
              href="https://www.swimming.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Swim England <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The national governing body for swimming in England, providing coaching education, training plans, and performance analysis tools.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Swim Interval Pace Calculator"
      description="Calculate swim interval pacing. Set target times for 100m or 50m repeats to improve speed and endurance in the pool."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Pace per 100m = (Target Time ÷ Distance) × 100",
        variables: [
          { symbol: "Target Time", description: "Time to complete one repeat (seconds)" },
          { symbol: "Distance", description: "Distance of one repeat (meters)" },
          { symbol: "Pace per 100m", description: "Equivalent pace standardized to 100 meters" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer plans to do 4 repeats of 100 meters each, targeting 1 minute 30 seconds per repeat, with 30 seconds rest between repeats.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input 100 meters as distance per repeat.",
          },
          {
            label: "Step 2",
            explanation: "Enter 1:30 as the target time for each 100m repeat.",
          },
          {
            label: "Step 3",
            explanation: "Set rest interval to 0:30 seconds.",
          },
          {
            label: "Step 4",
            explanation: "Specify 4 repeats.",
          },
          {
            label: "Step 5",
            explanation: "Select pace unit as minutes per 100m and calculate.",
          },
        ],
        result:
          "The calculator outputs a target pace of 1:30 min/100m and a total workout time of 7:30 minutes including rest intervals.",
      }}
      relatedCalculators={[
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "Soccer League Table: Points & GD", url: "/sports/soccer-league-table-points-gd", icon: "⚽" },
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🚴" },
        { title: "FTP (Functional Threshold Power) Zones Planner", url: "/sports/ftp-zones-planner", icon: "🚴" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
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