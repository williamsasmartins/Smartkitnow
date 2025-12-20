import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const relatedCalculators = [
  {
    title: "Fitness Age Calculator",
    url: "/sports/fitness-age-calculator",
    icon: "🏆",
  },
  {
    title: "Target Heart Rate / RPE Zones",
    url: "/sports/target-heart-rate-rpe-zones",
    icon: "🏆",
  },
  { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏋️" },
  {
    title: "Fantasy Team Points Projections Calculator",
    url: "/sports/fantasy-team-points-projections",
    icon: "🏆",
  },
  { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
  { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
];

function timeToSeconds(timeStr: string) {
  // Accepts "HH:MM:SS" or "MM:SS" or "SS"
  const parts = timeStr.split(":").map((p) => parseFloat(p));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }
  return NaN;
}

function secondsToTime(sec: number) {
  if (sec < 0 || isNaN(sec)) return "--:--";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatPace(secondsPerKm: number) {
  if (secondsPerKm <= 0 || isNaN(secondsPerKm)) return "--:--";
  const m = Math.floor(secondsPerKm / 60);
  const s = Math.round(secondsPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RunningPaceSplitFinishTimeCalculator() {
  /**
   * Inputs:
   * - distance (km or miles)
   * - distance unit (km or miles)
   * - pace (min/km or min/mile)
   * - pace unit (min/km or min/mile)
   * - finish time (HH:MM:SS or MM:SS)
   * 
   * User can provide any two of the three: distance + pace, distance + finish time, pace + finish time
   * The calculator will compute the missing value.
   */

  const [inputs, setInputs] = useState({
    distance: "",
    distanceUnit: "km",
    pace: "",
    paceUnit: "min/km",
    finishTime: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Conversion constants
  const MILE_TO_KM = 1.609344;

  // Parsing inputs
  const distanceNum = parseFloat(inputs.distance);
  const paceStr = inputs.pace.trim();
  const finishTimeStr = inputs.finishTime.trim();

  // Convert pace string to seconds per km or mile
  // Pace input format: "MM:SS" or "M:SS"
  function parsePace(paceInput: string) {
    if (!paceInput) return NaN;
    const parts = paceInput.split(":").map((p) => parseInt(p, 10));
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      return parts[0] * 60; // If user inputs only minutes, assume 0 seconds
    }
    return NaN;
  }

  const paceSecondsRaw = parsePace(paceStr);

  // Convert pace to seconds per km internally
  const paceSecondsPerKm =
    inputs.paceUnit === "min/km"
      ? paceSecondsRaw
      : !isNaN(paceSecondsRaw)
      ? paceSecondsRaw / MILE_TO_KM
      : NaN;

  // Convert distance to km internally
  const distanceKm =
    inputs.distanceUnit === "km"
      ? distanceNum
      : !isNaN(distanceNum)
      ? distanceNum * MILE_TO_KM
      : NaN;

  // Convert finish time string to seconds
  const finishTimeSeconds = timeToSeconds(finishTimeStr);

  // Determine which two inputs are provided to calculate the third
  // Possible known pairs:
  // 1) distance + pace => finish time
  // 2) distance + finish time => pace
  // 3) pace + finish time => distance

  // Validate inputs
  const hasDistance = !isNaN(distanceKm) && distanceKm > 0;
  const hasPace = !isNaN(paceSecondsPerKm) && paceSecondsPerKm > 0;
  const hasFinishTime = !isNaN(finishTimeSeconds) && finishTimeSeconds > 0;

  // Calculation results
  const results = useMemo(() => {
    let value = "";
    let label = "";
    let subtext = "";
    let warning = null;
    let formulaUsed = "";

    if (hasDistance && hasPace && !hasFinishTime) {
      // Calculate finish time = pace * distance
      const finishSec = paceSecondsPerKm * distanceKm;
      value = secondsToTime(finishSec);
      label = "Estimated Finish Time";
      formulaUsed = "Finish Time = Pace × Distance";
      subtext = `Based on a pace of ${formatPace(
        paceSecondsPerKm
      )} ${inputs.paceUnit} over ${distanceNum} ${inputs.distanceUnit}`;
    } else if (hasDistance && hasFinishTime && !hasPace) {
      // Calculate pace = finish time / distance
      if (distanceKm === 0) {
        warning = "Distance must be greater than zero to calculate pace.";
      } else {
        const paceSecPerKm = finishTimeSeconds / distanceKm;
        let paceDisplay = "";
        if (inputs.paceUnit === "min/km") {
          paceDisplay = formatPace(paceSecPerKm);
        } else {
          // Convert pace back to min/mile
          paceDisplay = formatPace(paceSecPerKm * MILE_TO_KM);
        }
        value = paceDisplay;
        label = "Required Pace";
        formulaUsed = "Pace = Finish Time ÷ Distance";
        subtext = `To finish ${distanceNum} ${inputs.distanceUnit} in ${secondsToTime(
          finishTimeSeconds
        )}, you need a pace of ${paceDisplay} ${inputs.paceUnit}`;
      }
    } else if (hasPace && hasFinishTime && !hasDistance) {
      // Calculate distance = finish time / pace
      if (paceSecondsPerKm === 0) {
        warning = "Pace must be greater than zero to calculate distance.";
      } else {
        const distKm = finishTimeSeconds / paceSecondsPerKm;
        let distDisplay = "";
        if (inputs.distanceUnit === "km") {
          distDisplay = distKm.toFixed(2);
        } else {
          distDisplay = (distKm / MILE_TO_KM).toFixed(2);
        }
        value = `${distDisplay} ${inputs.distanceUnit}`;
        label = "Estimated Distance";
        formulaUsed = "Distance = Finish Time ÷ Pace";
        subtext = `At a pace of ${formatPace(
          paceSecondsPerKm
        )} min/km for ${secondsToTime(
          finishTimeSeconds
        )}, you would cover approximately ${distDisplay} ${inputs.distanceUnit}`;
      }
    } else {
      warning =
        "Please provide exactly two of the following: distance, pace, or finish time to calculate the third.";
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [
    hasDistance,
    hasPace,
    hasFinishTime,
    paceSecondsPerKm,
    distanceKm,
    finishTimeSeconds,
    inputs.distanceUnit,
    inputs.paceUnit,
    distanceNum,
  ]);

  const faqs = [
    {
      question: "How accurate is this calculator for predicting finish times?",
      answer:
        "This calculator provides estimates based on constant pace assumptions. Actual race conditions, terrain, weather, and runner fatigue can affect finish times. For best results, use recent race data or time trials to inform your inputs.",
    },
    {
      question: "Can I use this calculator for any race distance?",
      answer:
        "Yes, this calculator supports any distance input in kilometers or miles. It is suitable for short distances like 5Ks, as well as marathons and ultramarathons, provided you input realistic pace or finish time values.",
    },
    {
      question: "Why do I need to provide exactly two inputs?",
      answer:
        "The calculator solves for the missing variable based on the relationship between distance, pace, and finish time. Providing two inputs allows it to compute the third accurately. Providing fewer or more than two inputs will not yield a valid calculation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="distance" className="flex items-center gap-1">
                <Flag className="w-4 h-4" /> Distance
              </Label>
              <div className="flex gap-2">
                <Input
                  id="distance"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g. 10"
                  value={inputs.distance}
                  onChange={(e) => handleInputChange("distance", e.target.value)}
                />
                <Select
                  value={inputs.distanceUnit}
                  onValueChange={(v) => handleInputChange("distanceUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">km</SelectItem>
                    <SelectItem value="miles">miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="pace" className="flex items-center gap-1">
                <Waves className="w-4 h-4" /> Pace
              </Label>
              <div className="flex gap-2">
                <Input
                  id="pace"
                  type="text"
                  placeholder="MM:SS"
                  value={inputs.pace}
                  onChange={(e) => handleInputChange("pace", e.target.value)}
                />
                <Select
                  value={inputs.paceUnit}
                  onValueChange={(v) => handleInputChange("paceUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="min/km">min/km</SelectItem>
                    <SelectItem value="min/mile">min/mile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="finishTime" className="flex items-center gap-1">
                <Timer className="w-4 h-4" /> Finish Time
              </Label>
              <Input
                id="finishTime"
                type="text"
                placeholder="HH:MM:SS or MM:SS"
                value={inputs.finishTime}
                onChange={(e) => handleInputChange("finishTime", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              distance: "",
              distanceUnit: "km",
              pace: "",
              paceUnit: "min/km",
              finishTime: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700">
          <CardContent className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
            <AlertTriangle className="w-5 h-5" />
            <p>{results.warning}</p>
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-3xl font-semibold text-blue-900 dark:text-white mb-2">
              {results.label}
            </p>
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-3 text-sm italic text-blue-800 dark:text-blue-300">
              {results.subtext}
            </p>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              <Calculator className="inline w-4 h-4 mr-1" />
              {results.formulaUsed}
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
          Understanding Running Pace / Split / Finish Time Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Running performance is fundamentally linked to three key variables: distance,
          pace, and finish time. This calculator allows runners to input any two of these
          variables to accurately determine the third. Whether you want to know the pace
          required to finish a race in a target time, estimate your finish time based on
          your current pace, or find out how far you can run given a pace and time, this
          tool provides precise calculations to aid your training and race planning.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator supports both metric (kilometers) and imperial (miles) units,
          and accepts pace inputs in minutes per kilometer or minutes per mile. By
          understanding these relationships, runners can better strategize their splits
          and optimize their performance on race day.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, you need to provide exactly two of the
          following inputs: distance, pace, or finish time. The calculator will then
          compute the missing variable for you. This approach leverages the fundamental
          formula: <code>Finish Time = Pace × Distance</code>.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the distance you plan to run or have run,
            selecting kilometers or miles as your unit.
          </li>
          <li>
            <strong>Step 2:</strong> Input either your pace (in min/km or min/mile) or
            your finish time (in HH:MM:SS or MM:SS format).
          </li>
          <li>
            <strong>Step 3:</strong> Leave the third field blank and click &quot;Calculate&quot;.
            The calculator will display the missing value along with explanatory notes.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips &amp; Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning your training and race strategy, it is important to understand
          that maintaining a consistent pace is key to achieving your target finish time.
          Use this calculator to set realistic pace goals based on your current fitness
          level and race distance. Remember that factors such as terrain, weather, and
          fatigue can cause your actual pace to vary, so always allow some margin in your
          pacing strategy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Incorporate interval training and tempo runs to improve your sustainable pace.
          Regularly monitor your progress by timing your splits and adjusting your goals
          accordingly. Using this calculator in conjunction with a training log can help
          you track improvements and optimize your race-day performance.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References &amp; Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on running physiology, pacing strategies, and training
          science, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science
              research, providing evidence-based guidelines for training and performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.usatf.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Track &amp; Field (USATF) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The national governing body for track and field, long-distance running,
              and race walking in the United States, offering official rules and training
              resources.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner&apos;s World <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A leading publication providing expert advice on running training,
              nutrition, and race strategies for all levels of runners.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Running Pace / Split / Finish Time Calculator"
      description="Calculate your running pace and finish times. Determine the splits needed to achieve your marathon or 5K personal best."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Finish Time = Pace × Distance",
        variables: [
          { symbol: "Finish Time", description: "Total time to complete the run" },
          { symbol: "Pace", description: "Time per unit distance (min/km or min/mile)" },
          { symbol: "Distance", description: "Total distance of the run (km or miles)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You plan to run a half marathon (21.1 km) and want to finish in under 2 hours.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter the distance as 21.1 km and the target finish time as 2:00:00 (2 hours). Leave pace blank.",
          },
          {
            label: "Step 2",
            explanation:
              "Click Calculate. The calculator will compute the required pace to achieve this finish time.",
          },
          {
            label: "Step 3",
            explanation:
              "The result shows you need to maintain approximately 5:41 min/km pace to finish in 2 hours.",
          },
        ],
        result:
          "Required Pace: 5:41 min/km. Use this pace to guide your training and race splits.",
      }}
      relatedCalculators={relatedCalculators}
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