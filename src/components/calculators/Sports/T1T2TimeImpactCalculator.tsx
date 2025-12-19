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

export default function T1T2TimeImpactCalculator() {
  const [inputs, setInputs] = useState({
    swimTime: "",
    bikeTime: "",
    runTime: "",
    t1Time: "",
    t2Time: "",
    raceDistance: "Olympic",
    fieldAverageT1: "",
    fieldAverageT2: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Converts a time string "mm:ss" or "ss" to total seconds as number.
   * Returns NaN if invalid.
   */
  function parseTimeToSeconds(timeStr) {
    if (!timeStr) return NaN;
    const parts = timeStr.split(":").map((p) => p.trim());
    if (parts.length === 1) {
      // seconds only
      const s = Number(parts[0]);
      return isNaN(s) ? NaN : s;
    } else if (parts.length === 2) {
      // mm:ss
      const m = Number(parts[0]);
      const s = Number(parts[1]);
      if (isNaN(m) || isNaN(s)) return NaN;
      return m * 60 + s;
    }
    return NaN;
  }

  /**
   * Converts seconds to "mm:ss" format string.
   */
  function formatSecondsToTime(sec) {
    if (isNaN(sec) || sec < 0) return "--:--";
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  /**
   * Estimates total race time including transitions.
   * Calculates impact of T1/T2 times relative to field averages.
   */
  const results = useMemo(() => {
    // Parse inputs to seconds
    const swim = parseTimeToSeconds(inputs.swimTime);
    const bike = parseTimeToSeconds(inputs.bikeTime);
    const run = parseTimeToSeconds(inputs.runTime);
    const t1 = parseTimeToSeconds(inputs.t1Time);
    const t2 = parseTimeToSeconds(inputs.t2Time);
    const avgT1 = parseTimeToSeconds(inputs.fieldAverageT1);
    const avgT2 = parseTimeToSeconds(inputs.fieldAverageT2);

    // Validate inputs
    if (
      [swim, bike, run, t1, t2].some((v) => isNaN(v) || v < 0) ||
      (inputs.fieldAverageT1 && (isNaN(avgT1) || avgT1 <= 0)) ||
      (inputs.fieldAverageT2 && (isNaN(avgT2) || avgT2 <= 0))
    ) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid positive times in mm:ss or ss format.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Total race time including transitions
    const totalTime = swim + t1 + bike + t2 + run;

    // Calculate transition impact if field averages provided
    let t1Impact = null,
      t2Impact = null,
      totalImpact = null,
      impactMessage = null;

    if (avgT1 && avgT2) {
      t1Impact = t1 - avgT1; // positive means slower than average
      t2Impact = t2 - avgT2;
      totalImpact = t1Impact + t2Impact;

      impactMessage = `Compared to average transitions, your total transition time is ${
        totalImpact > 0 ? `${formatSecondsToTime(totalImpact)} slower` : `${formatSecondsToTime(-totalImpact)} faster`
      }.`;

      // Warn if transitions are significantly slower (>30s)
      if (totalImpact > 30) {
        impactMessage += " Improving your transitions could significantly improve your overall race time.";
      }
    }

    // Formula used
    const formula = "Total Race Time = Swim + T1 + Bike + T2 + Run";

    return {
      value: formatSecondsToTime(totalTime),
      label: "Estimated Total Race Time (including transitions)",
      subtext: impactMessage,
      warning: null,
      formulaUsed: formula,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why are T1 and T2 transition times important in triathlon?",
      answer:
        "Transitions (T1 and T2) are often called the 'fourth discipline' in triathlon because they can significantly affect overall race performance. Efficient transitions save valuable seconds or minutes, which can be the difference between podium finishes or missed personal bests. Training transitions improves muscle memory, reduces errors, and enhances race-day confidence.",
    },
    {
      question: "How can I improve my transition times?",
      answer:
        "Improving transition times involves practicing the sequence of activities such as removing wetsuits, mounting/dismounting the bike, and preparing running gear. Setting up your transition area efficiently, rehearsing transitions during training, and minimizing unnecessary movements are key strategies. Many elite triathletes dedicate specific training sessions to transitions to optimize speed and fluidity.",
    },
    {
      question: "Does transition time impact vary by race distance?",
      answer:
        "Yes, transition time impact varies by race distance. In shorter races like Sprint or Olympic distances, transitions can represent a larger percentage of total race time, making them more critical. In longer races like Ironman, while transitions still matter, the relative impact is smaller but can still influence overall rankings and personal goals.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="raceDistance" className="mb-1 flex items-center gap-1">
                Race Distance <Activity className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.raceDistance}
                onValueChange={(v) => handleInputChange("raceDistance", v)}
                id="raceDistance"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sprint">Sprint (750m swim, 20km bike, 5km run)</SelectItem>
                  <SelectItem value="Olympic">Olympic (1.5km swim, 40km bike, 10km run)</SelectItem>
                  <SelectItem value="HalfIronman">Half Ironman (1.9km swim, 90km bike, 21.1km run)</SelectItem>
                  <SelectItem value="Ironman">Ironman (3.8km swim, 180km bike, 42.2km run)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="swimTime" className="mb-1 flex items-center gap-1">
                Swim Time (mm:ss or ss) <Waves className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="swimTime"
                type="text"
                placeholder="e.g. 25:30"
                value={inputs.swimTime}
                onChange={(e) => handleInputChange("swimTime", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="t1Time" className="mb-1 flex items-center gap-1">
                T1 Transition Time (mm:ss or ss) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="t1Time"
                type="text"
                placeholder="e.g. 1:15"
                value={inputs.t1Time}
                onChange={(e) => handleInputChange("t1Time", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bikeTime" className="mb-1 flex items-center gap-1">
                Bike Time (mm:ss or ss) <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="bikeTime"
                type="text"
                placeholder="e.g. 1:10:00 or 4200"
                value={inputs.bikeTime}
                onChange={(e) => handleInputChange("bikeTime", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="t2Time" className="mb-1 flex items-center gap-1">
                T2 Transition Time (mm:ss or ss) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="t2Time"
                type="text"
                placeholder="e.g. 0:45"
                value={inputs.t2Time}
                onChange={(e) => handleInputChange("t2Time", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="runTime" className="mb-1 flex items-center gap-1">
                Run Time (mm:ss or ss) <Heart className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="runTime"
                type="text"
                placeholder="e.g. 45:00"
                value={inputs.runTime}
                onChange={(e) => handleInputChange("runTime", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fieldAverageT1" className="mb-1 flex items-center gap-1">
                Average Field T1 Time (optional) <Info className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="fieldAverageT1"
                type="text"
                placeholder="e.g. 1:00"
                value={inputs.fieldAverageT1}
                onChange={(e) => handleInputChange("fieldAverageT1", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fieldAverageT2" className="mb-1 flex items-center gap-1">
                Average Field T2 Time (optional) <Info className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="fieldAverageT2"
                type="text"
                placeholder="e.g. 0:50"
                value={inputs.fieldAverageT2}
                onChange={(e) => handleInputChange("fieldAverageT2", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by setting state (already reactive)
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              swimTime: "",
              bikeTime: "",
              runTime: "",
              t1Time: "",
              t2Time: "",
              raceDistance: "Olympic",
              fieldAverageT1: "",
              fieldAverageT2: "",
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
            {results.subtext && <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.subtext}</p>}
          </CardContent>
        </Card>
      )}

      {results.subtext && !results.value && (
        <p className="text-red-600 dark:text-red-400 font-semibold mt-4">{results.subtext}</p>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding T1/T2 Transition Time Impact (Triathlon)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In triathlon, the transitions between disciplines—known as T1 (swim-to-bike) and T2 (bike-to-run)—play a critical role in overall race performance. These transition phases require athletes to quickly change equipment and mindset, making them a unique blend of physical and technical skill. While often overlooked, transition times can cumulatively add several minutes to a race, potentially altering finishing positions and personal records.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The impact of transition times varies depending on race distance and competition level. In shorter races like Sprint or Olympic distances, transitions can represent a significant percentage of total race time, emphasizing the need for efficiency. Conversely, in longer events such as Ironman triathlons, while transitions are proportionally smaller, optimizing them can still yield meaningful gains.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator helps triathletes analyze how their T1 and T2 times affect their overall race finish time relative to their swim, bike, and run splits. By comparing your transition times to average field times, you can identify opportunities to improve and strategize training to minimize lost seconds during these crucial phases.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your total race time including transitions and understand the impact of your T1 and T2 times, enter your split times in the provided fields. Times can be entered in either "mm:ss" format (e.g., 1:15 for one minute fifteen seconds) or total seconds (e.g., 75). Optionally, input average transition times from your race field to compare your performance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your race distance to contextualize typical split times.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your swim, bike, and run split times.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your T1 and T2 transition times.
          </li>
          <li>
            <strong>Step 4:</strong> Optionally, add average field transition times to see how you compare.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your estimated total race time and transition impact.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Efficient transitions require deliberate practice and race-day preparation. Start by organizing your transition area to minimize movement and confusion. Practice removing your wetsuit quickly, mounting and dismounting your bike smoothly, and preparing your running gear in advance. Incorporate transition drills into your training sessions to build muscle memory and reduce cognitive load during races.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, simulate race conditions during training to practice transitions under fatigue. Time yourself regularly to track improvements and identify bottlenecks. Remember, even small gains in transition times can translate into significant competitive advantages, especially in tightly contested races.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, review race footage or seek feedback from coaches to refine your technique and strategy. Mental rehearsal and visualization of transitions can also enhance performance by reducing anxiety and improving focus.
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
          For more information on triathlon training, transition techniques, and sports science, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for endurance athletes.
            </p>
          </li>
          <li>
            <a
              href="https://www.triathlon.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              World Triathlon (ITU) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The international governing body for triathlon, offering official race rules, training resources, and performance standards.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/training/a20803195/transition-training-for-triathletes/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - Transition Training Guide <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical tips and drills to improve triathlon transitions, focusing on efficiency and speed.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="T1/T2 Transition Time Impact (Triathlon)"
      description="Analyze triathlon transition times. See how T1 and T2 durations impact your overall race finish time and ranking."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Total Race Time = Swim + T1 + Bike + T2 + Run",
        variables: [
          { symbol: "Swim", description: "Swim split time" },
          { symbol: "T1", description: "Transition 1 time (swim to bike)" },
          { symbol: "Bike", description: "Bike split time" },
          { symbol: "T2", description: "Transition 2 time (bike to run)" },
          { symbol: "Run", description: "Run split time" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An Olympic distance triathlete completes the swim in 25:30, T1 in 1:15, bike in 1:10:00, T2 in 0:45, and run in 45:00. The average field T1 and T2 times are 1:00 and 0:50 respectively.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert all times to seconds: Swim = 1530s, T1 = 75s, Bike = 4200s, T2 = 45s, Run = 2700s.",
          },
          {
            label: "Step 2",
            explanation: "Calculate total race time including transitions: 1530 + 75 + 4200 + 45 + 2700 = 8550 seconds (2h 22m 30s).",
          },
          {
            label: "Step 3",
            explanation:
              "Compare T1 and T2 times to average field times: T1 is 15s slower, T2 is 5s faster, total transition impact is +10s slower than average.",
          },
        ],
        result: "Estimated total race time: 2:22:30, with transitions 10 seconds slower than average field times.",
      }}
      relatedCalculators={[
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "Target Heart Rate / RPE Zones", url: "/sports/target-heart-rate-rpe-zones", icon: "🏆" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏊" },
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