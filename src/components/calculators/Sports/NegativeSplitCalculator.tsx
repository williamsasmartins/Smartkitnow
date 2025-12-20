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

function timeToSeconds(timeStr: string) {
  // Accepts mm:ss or hh:mm:ss or ss format
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
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

function formatPace(secPerKm: number) {
  if (secPerKm <= 0 || isNaN(secPerKm)) return "--:--";
  const m = Math.floor(secPerKm / 60);
  const s = Math.round(secPerKm % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function NegativeSplitCalculator() {
  const [inputs, setInputs] = useState({
    totalDistance: "",
    totalTime: "",
    firstHalfPace: "",
    distanceUnit: "km",
    paceUnit: "min/km",
  });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  // Calculation logic:
  // Negative split means second half is faster than first half.
  // Inputs:
  // - totalDistance (km or miles)
  // - totalTime (hh:mm:ss or mm:ss)
  // - firstHalfPace (pace for first half in min/km or min/mile)
  // Output:
  // - secondHalfPace (pace for second half)
  // - split times for first and second halves
  // - confirmation that second half pace is faster than first half pace

  const results = useMemo(() => {
    const dist = parseFloat(inputs.totalDistance);
    if (isNaN(dist) || dist <= 0) {
      return { value: null, label: null, subtext: null, warning: "Please enter a valid total distance.", formulaUsed: null };
    }
    const totalTimeSec = timeToSeconds(inputs.totalTime);
    if (isNaN(totalTimeSec) || totalTimeSec <= 0) {
      return { value: null, label: null, subtext: null, warning: "Please enter a valid total time.", formulaUsed: null };
    }
    const firstHalfPaceStr = inputs.firstHalfPace.trim();
    if (!firstHalfPaceStr) {
      return { value: null, label: null, subtext: null, warning: "Please enter the first half pace.", formulaUsed: null };
    }
    const firstHalfPaceSec = timeToSeconds(firstHalfPaceStr);
    if (isNaN(firstHalfPaceSec) || firstHalfPaceSec <= 0) {
      return { value: null, label: null, subtext: null, warning: "Please enter a valid first half pace.", formulaUsed: null };
    }

    // Half distance:
    const halfDist = dist / 2;

    // Calculate first half time from pace:
    const firstHalfTime = firstHalfPaceSec * halfDist;

    if (firstHalfTime >= totalTimeSec) {
      return {
        value: null,
        label: null,
        subtext:
          "The first half pace is too slow to finish within the total time. Please enter a faster first half pace or adjust total time.",
        warning: "First half pace &gt;= average pace.",
        formulaUsed: null,
      };
    }

    // Second half time:
    const secondHalfTime = totalTimeSec - firstHalfTime;

    // Second half pace:
    const secondHalfPaceSec = secondHalfTime / halfDist;

    if (secondHalfPaceSec >= firstHalfPaceSec) {
      return {
        value: null,
        label: null,
        subtext:
          "The calculated second half pace is not faster than the first half pace. Negative split requires the second half pace &lt; first half pace.",
        warning: "Second half pace &gt;= first half pace.",
        formulaUsed: null,
      };
    }

    // Average pace for total race:
    const avgPaceSec = totalTimeSec / dist;

    // Format paces:
    const firstHalfPaceFormatted = formatPace(firstHalfPaceSec);
    const secondHalfPaceFormatted = formatPace(secondHalfPaceSec);
    const avgPaceFormatted = formatPace(avgPaceSec);

    // Format times:
    const firstHalfTimeFormatted = secondsToTime(firstHalfTime);
    const secondHalfTimeFormatted = secondsToTime(secondHalfTime);
    const totalTimeFormatted = secondsToTime(totalTimeSec);

    return {
      value: (
        <>
          <p>
            <strong>First Half Pace:</strong> {firstHalfPaceFormatted} {inputs.paceUnit}
          </p>
          <p>
            <strong>Second Half Pace:</strong> {secondHalfPaceFormatted} {inputs.paceUnit} &nbsp;
            <Flag className="inline-block w-4 h-4 text-green-600" />
          </p>
          <p>
            <strong>Total Time:</strong> {totalTimeFormatted}
          </p>
          <p>
            <strong>Split Times:</strong> {firstHalfTimeFormatted} (1st half) / {secondHalfTimeFormatted} (2nd half)
          </p>
          <p>
            <strong>Average Pace:</strong> {avgPaceFormatted} {inputs.paceUnit}
          </p>
        </>
      ),
      label: "Negative Split Race Plan",
      subtext: "Plan your race with a faster second half pace to finish strong.",
      warning: null,
      formulaUsed:
        "Second Half Pace = (Total Time - (First Half Pace × Half Distance)) / Half Distance",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a negative split in running?",
      answer:
        "A negative split means running the second half of a race faster than the first half. This strategy helps conserve energy early and finish strong, often leading to better overall performance and reduced fatigue.",
    },
    {
      question: "Why is pacing important in races?",
      answer:
        "Proper pacing ensures efficient energy use throughout the race. Starting too fast can cause early fatigue, while too slow may prevent achieving your best time. Negative splits encourage controlled starts and strong finishes.",
    },
    {
      question: "Can I use this calculator for any race distance?",
      answer:
        "Yes, this calculator works for any race distance where you want to plan a negative split strategy. Just enter your total distance, target finish time, and your planned first half pace to get the required second half pace.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalDistance" className="flex items-center gap-1">
                <Activity className="w-4 h-4" /> Total Distance
              </Label>
              <Input
                id="totalDistance"
                type="number"
                min={0}
                step="any"
                placeholder="e.g. 10"
                value={inputs.totalDistance}
                onChange={(e) => handleInputChange("totalDistance", e.target.value)}
              />
              <Select
                value={inputs.distanceUnit}
                onValueChange={(v) => handleInputChange("distanceUnit", v)}
                className="mt-1"
              >
                <SelectTrigger aria-label="Distance Unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="km">Kilometers (km)</SelectItem>
                  <SelectItem value="mi">Miles (mi)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="totalTime" className="flex items-center gap-1">
                <Timer className="w-4 h-4" /> Total Target Time
              </Label>
              <Input
                id="totalTime"
                type="text"
                placeholder="HH:MM:SS or MM:SS"
                value={inputs.totalTime}
                onChange={(e) => handleInputChange("totalTime", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="firstHalfPace" className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> First Half Pace
              </Label>
              <Input
                id="firstHalfPace"
                type="text"
                placeholder="MM:SS per km or mile"
                value={inputs.firstHalfPace}
                onChange={(e) => handleInputChange("firstHalfPace", e.target.value)}
              />
              <Select
                value={inputs.paceUnit}
                onValueChange={(v) => handleInputChange("paceUnit", v)}
                className="mt-1"
              >
                <SelectTrigger aria-label="Pace Unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="min/km">min/km</SelectItem>
                  <SelectItem value="min/mi">min/mi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            /* Calculation is automatic on input change */
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              totalDistance: "",
              totalTime: "",
              firstHalfPace: "",
              distanceUnit: "km",
              paceUnit: "min/km",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700">
          <CardContent className="text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center space-y-3 text-blue-900 dark:text-white text-lg font-semibold">
            {results.value}
            <p className="text-sm font-normal mt-4 italic">{results.subtext}</p>
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
          Negative splitting is a race strategy where an athlete runs the second half of a race faster than the first half.
          This approach helps conserve energy early on, allowing for a stronger finish and often better overall performance.
          By pacing yourself conservatively in the first half, you reduce the risk of premature fatigue and can capitalize on
          your endurance and mental strength in the latter stages of the race.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This planner calculates the required pace for your second half based on your total race distance, target finish time,
          and your planned first half pace. It ensures your second half pace is faster, helping you execute a successful negative split.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, input your total race distance and your target finish time. Then enter the pace you
          plan to run for the first half of the race. The calculator will determine the pace you need to run in the second half
          to achieve a negative split and meet your overall goal.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Enter your total race distance in kilometers or miles, depending on your preference.
          </li>
          <li>
            Input your target finish time in HH:MM:SS or MM:SS format.
          </li>
          <li>
            Provide your planned first half pace in minutes per kilometer or mile.
          </li>
          <li>
            Click &quot;Calculate&quot; to see the required second half pace and split times.
          </li>
          <li>
            Adjust inputs as needed to optimize your race strategy.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Training to execute a negative split requires discipline and pacing awareness. It is important to practice running at
          your planned first half pace during training to avoid starting too fast on race day. Incorporate tempo runs and interval
          training to improve your ability to sustain faster paces in the second half of your race.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, a successful negative split often means your second half pace &lt; first half pace &lt; average pace. Avoid
          starting with a pace &gt; 90% of your maximum effort to conserve glycogen stores and reduce early fatigue. Hydration,
          nutrition, and mental focus also play critical roles in sustaining pace and finishing strong.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, pacing strategies, and race planning, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletes.
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
              The NSCA offers resources on strength, conditioning, and endurance training to optimize athletic performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/training/a20803113/negative-splits/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner’s World: Negative Splits Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical guide on how and why to run negative splits for improved race performance.
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
          "Second Half Pace = (Total Time - (First Half Pace × Half Distance)) / Half Distance",
        variables: [
          { symbol: "Total Time", description: "Your target finish time for the entire race" },
          { symbol: "First Half Pace", description: "Your planned pace for the first half of the race" },
          { symbol: "Half Distance", description: "Half of the total race distance" },
          { symbol: "Second Half Pace", description: "Required pace for the second half to achieve a negative split" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are running a 10 km race with a target finish time of 50 minutes. You plan to run the first 5 km at a pace of 5:30 min/km. Use the calculator to find the pace needed for the second half to finish strong.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the total distance as 10 km and the target finish time as 50:00 (50 minutes). Enter your first half pace as 5:30 min/km.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator computes the first half time as 5.5 min/km × 5 km = 27.5 minutes. It subtracts this from the total time (50 minutes) to get 22.5 minutes for the second half.",
          },
          {
            label: "Step 3",
            explanation:
              "Divide the second half time (22.5 minutes) by the half distance (5 km) to get the required second half pace: 4:30 min/km.",
          },
        ],
        result:
          "To achieve a negative split, run the first 5 km at 5:30 min/km and the second 5 km at 4:30 min/km, finishing the race in 50 minutes.",
      }}
      relatedCalculators={[
        { title: "Basketball eFG% & TS% Calculator", url: "/sports/basketball-efg-ts", icon: "⚽" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "Calories Burned per Workout (MET)", url: "/sports/calories-burned-met", icon: "🔥" },
        { title: "Baseball OPS / SLG / OBP Calculator", url: "/sports/baseball-ops-slg-obp", icon: "⚽" },
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