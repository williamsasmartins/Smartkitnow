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
  if (seconds <= 0 || isNaN(seconds)) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function paceToSeconds(pace: string) {
  // pace format mm:ss or mm:ss.s
  const parts = pace.split(":");
  if (parts.length !== 2) return NaN;
  const mins = parseInt(parts[0], 10);
  const secs = parseFloat(parts[1]);
  if (isNaN(mins) || isNaN(secs)) return NaN;
  return mins * 60 + secs;
}

function secondsToPace(seconds: number) {
  if (seconds <= 0 || isNaN(seconds)) return "--:--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function NegativeSplitCalculator() {
  /*
    Inputs:
    - Total race distance (km or miles)
    - Total target time (hh:mm:ss or mm:ss)
    - First half pace (mm:ss per km or mile)
    - Units: km or miles
  */

  const [inputs, setInputs] = useState({
    distance: "",
    unit: "km",
    targetTime: "",
    firstHalfPace: "",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parsing inputs and calculating results
  const results = useMemo(() => {
    const distance = parseFloat(inputs.distance);
    if (isNaN(distance) || distance <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid race distance.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Parse target time (allow hh:mm:ss or mm:ss)
    const timeParts = inputs.targetTime.split(":").map((v) => v.trim());
    let targetSeconds = 0;
    if (timeParts.length === 3) {
      // hh:mm:ss
      const h = parseInt(timeParts[0], 10);
      const m = parseInt(timeParts[1], 10);
      const s = parseInt(timeParts[2], 10);
      if ([h, m, s].some((v) => isNaN(v) || v < 0)) {
        return {
          value: null,
          label: null,
          subtext: "Please enter a valid target time (hh:mm:ss or mm:ss).",
          warning: null,
          formulaUsed: null,
        };
      }
      targetSeconds = h * 3600 + m * 60 + s;
    } else if (timeParts.length === 2) {
      // mm:ss
      const m = parseInt(timeParts[0], 10);
      const s = parseInt(timeParts[1], 10);
      if ([m, s].some((v) => isNaN(v) || v < 0)) {
        return {
          value: null,
          label: null,
          subtext: "Please enter a valid target time (hh:mm:ss or mm:ss).",
          warning: null,
          formulaUsed: null,
        };
      }
      targetSeconds = m * 60 + s;
    } else {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid target time (hh:mm:ss or mm:ss).",
        warning: null,
        formulaUsed: null,
      };
    }

    if (targetSeconds <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Target time must be greater than zero.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Parse first half pace mm:ss per unit
    const firstHalfPaceSeconds = paceToSeconds(inputs.firstHalfPace);
    if (isNaN(firstHalfPaceSeconds) || firstHalfPaceSeconds <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid first half pace (mm:ss).",
        warning: null,
        formulaUsed: null,
      };
    }

    // Calculate first half distance and second half distance
    const halfDistance = distance / 2;

    // Calculate first half time = pace * halfDistance
    const firstHalfTime = firstHalfPaceSeconds * halfDistance;

    if (firstHalfTime >= targetSeconds) {
      return {
        value: null,
        label: null,
        subtext:
          "First half pace is too slow to achieve the target time with a negative split.",
        warning: "Adjust your first half pace or target time.",
        formulaUsed: null,
      };
    }

    // Second half time = targetSeconds - firstHalfTime
    const secondHalfTime = targetSeconds - firstHalfTime;

    // Second half pace = secondHalfTime / halfDistance
    const secondHalfPaceSeconds = secondHalfTime / halfDistance;

    // Calculate pace difference and percentage improvement
    const paceDifference = firstHalfPaceSeconds - secondHalfPaceSeconds;
    const paceImprovementPercent = (paceDifference / firstHalfPaceSeconds) * 100;

    return {
      value: secondsToPace(secondHalfPaceSeconds),
      label: `Required Second Half Pace (${inputs.unit}/unit)`,
      subtext: `To achieve a negative split and finish in ${inputs.targetTime}, run the second half at ${secondsToPace(
        secondHalfPaceSeconds
      )} per ${inputs.unit}. This is a ${paceImprovementPercent.toFixed(
        2
      )}% faster pace than your first half pace.`,
      warning: null,
      formulaUsed:
        "Second Half Pace = (Total Target Time - (First Half Pace × Half Distance)) ÷ Half Distance",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a negative split in racing?",
      answer:
        "A negative split is a pacing strategy where the second half of a race is run faster than the first half. This approach helps conserve energy early and finish strong, often leading to improved overall performance and reduced fatigue.",
    },
    {
      question: "Why is pacing important in endurance races?",
      answer:
        "Proper pacing helps optimize energy expenditure, delay fatigue, and maintain consistent effort throughout the race. It reduces the risk of burnout and allows for a stronger finish, which is critical for achieving personal bests and race goals.",
    },
    {
      question: "Can I use this calculator for any race distance?",
      answer:
        "Yes, this calculator supports any race distance where a negative split strategy is applicable. Simply input your race distance, target finish time, and your planned first half pace to determine the required second half pace.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distance" className="flex items-center gap-1 mb-1">
                <Flag className="w-4 h-4 text-blue-600" /> Race Distance
              </Label>
              <Input
                id="distance"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 10"
                value={inputs.distance}
                onChange={(e) => handleInputChange("distance", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="unit" className="flex items-center gap-1 mb-1">
                <Scale className="w-4 h-4 text-blue-600" /> Unit
              </Label>
              <Select
                value={inputs.unit}
                onValueChange={(v) => handleInputChange("unit", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="mile">Miles (mile)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetTime" className="flex items-center gap-1 mb-1">
                <Timer className="w-4 h-4 text-blue-600" /> Target Finish Time
              </Label>
              <Input
                id="targetTime"
                type="text"
                placeholder="hh:mm:ss or mm:ss"
                value={inputs.targetTime}
                onChange={(e) => handleInputChange("targetTime", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="firstHalfPace" className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" /> First Half Pace (per {inputs.unit})
              </Label>
              <Input
                id="firstHalfPace"
                type="text"
                placeholder="mm:ss"
                value={inputs.firstHalfPace}
                onChange={(e) => handleInputChange("firstHalfPace", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              distance: "",
              unit: "km",
              targetTime: "",
              firstHalfPace: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-4 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
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
          Understanding Negative Split Race Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The negative split race strategy involves running the second half of a race faster than the first half. This pacing technique is widely regarded as an effective way to optimize endurance performance by conserving energy early and capitalizing on a strong finish. Athletes who successfully execute negative splits often experience less fatigue and improved overall race times. This planner helps you calculate the precise pace needed in the latter half of your race to achieve this goal based on your target finish time and initial pace.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By inputting your race distance, target finish time, and first half pace, the calculator determines the required pace for the second half to ensure a negative split. This approach is supported by extensive research in exercise physiology and race strategy, emphasizing the importance of even or negative pacing for endurance events.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Negative Split Race Planner effectively, follow these steps carefully. First, enter the total race distance in either kilometers or miles, depending on your preference. Next, input your target finish time in a standard time format (hh:mm:ss or mm:ss). Then, provide your planned pace for the first half of the race in minutes and seconds per unit distance. Once all inputs are entered, click the calculate button to determine the required pace for the second half of your race.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your total race distance (e.g., 10 km or 6.2 miles).
          </li>
          <li>
            <strong>Step 2:</strong> Select the unit of measurement (kilometers or miles).
          </li>
          <li>
            <strong>Step 3:</strong> Input your target finish time in hh:mm:ss or mm:ss format.
          </li>
          <li>
            <strong>Step 4:</strong> Enter your first half pace in mm:ss per selected unit.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see the required second half pace to achieve a negative split.
          </li>
          <li>
            <strong>Step 6:</strong> Use the results to plan your race strategy and training accordingly.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Training to execute a negative split requires a combination of endurance, pacing awareness, and mental discipline. Incorporate interval training and tempo runs into your regimen to improve your ability to sustain faster paces later in the race. Practicing race simulations where you consciously run the second half faster than the first can help develop the physiological and psychological skills needed for this strategy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, monitor your heart rate and perceived exertion during training to avoid starting too fast, which can lead to premature fatigue. Nutrition and hydration strategies should also support sustained energy release to enable a strong finish. Remember, the negative split is not just about speed but about smart energy management throughout the race.
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
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, pacing strategies, and endurance performance, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for endurance training and pacing.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Runner's World offers expert advice on race strategies, including negative splits, pacing plans, and training tips for runners of all levels.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NSCA provides research and resources on strength and conditioning principles that support endurance performance and effective pacing strategies.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Negative Split Race Planner"
      description="Plan a negative split strategy. Calculate the pace required for the second half of your race to finish stronger than you started."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "Second Half Pace = (Total Target Time - (First Half Pace × Half Distance)) ÷ Half Distance",
        variables: [
          { symbol: "Total Target Time", description: "Your goal finish time in seconds" },
          { symbol: "First Half Pace", description: "Pace for first half in seconds per unit" },
          { symbol: "Half Distance", description: "Half of the total race distance" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are running a 10 km race with a target finish time of 50 minutes. You plan to run the first 5 km at a pace of 5:30 per km. What pace do you need to run the second 5 km to achieve a negative split and meet your target?",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the target finish time to seconds: 50 minutes = 3000 seconds.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the time for the first half: 5 km × 330 seconds/km (5:30) = 1650 seconds.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate remaining time for second half: 3000 - 1650 = 1350 seconds.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate required second half pace: 1350 seconds ÷ 5 km = 270 seconds/km (4:30 per km).",
          },
        ],
        result:
          "You need to run the second half at 4:30 per km, which is 1 minute per km faster than your first half pace, to achieve a negative split and finish in 50 minutes.",
      }}
      relatedCalculators={[
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "⚽" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "Target Heart Rate / RPE Zones", url: "/sports/target-heart-rate-rpe-zones", icon: "🏆" },
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
