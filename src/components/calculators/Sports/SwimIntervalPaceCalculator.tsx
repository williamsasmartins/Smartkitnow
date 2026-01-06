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

function timeStringToSeconds(timeStr: string) {
  // Accept formats: mm:ss, m:ss, ss, mm:ss.ms, m:ss.ms
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  if (parts.length === 1) {
    // seconds only
    const sec = parseFloat(parts[0]);
    return isNaN(sec) ? null : sec;
  } else if (parts.length === 2) {
    const min = parseInt(parts[0], 10);
    const sec = parseFloat(parts[1]);
    if (isNaN(min) || isNaN(sec)) return null;
    return min * 60 + sec;
  }
  return null;
}

function secondsToTimeString(seconds: number) {
  if (seconds == null || isNaN(seconds) || seconds < 0) return "";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return min + ":" + (sec < 10 ? "0" : "") + sec.toFixed(2);
}

type SwimIntervalPaceResult =
  | { error: string }
  | {
      pacePer100m: number;
      totalIntervalTime: number;
      totalSessionTime: number;
      pacePer100mStr: string;
      totalIntervalTimeStr: string;
      totalSessionTimeStr: string;
    };

export default function SwimIntervalPaceCalculator() {
  const [inputs, setInputs] = useState({
    distance: "100",
    targetTime: "",
    restTime: "",
    intervals: "",
  });
  const [calculated, setCalculated] = useState<SwimIntervalPaceResult | null>(null);

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
    setCalculated(null);
  }, []);

  const calculatePace = useCallback(() => {
    // Parse inputs
    const dist = parseInt(inputs.distance, 10);
    const targetSeconds = timeStringToSeconds(inputs.targetTime);
    const restSeconds = timeStringToSeconds(inputs.restTime) ?? 0;
    const intervals = parseInt(inputs.intervals, 10);

    if (
      !dist ||
      !targetSeconds ||
      isNaN(restSeconds) ||
      !intervals ||
      dist <= 0 ||
      targetSeconds <= 0 ||
      intervals <= 0
    ) {
      setCalculated({
        error: "Please enter valid positive values for all required fields.",
      });
      return;
    }

    // Total interval time = swim time + rest time
    const totalIntervalTime = targetSeconds + restSeconds;

    // Pace per 100m (seconds per 100m)
    // If distance is 100m, pace = targetSeconds
    // If distance is 50m, pace = targetSeconds * 2
    const pacePer100m = dist === 100 ? targetSeconds : targetSeconds * (100 / dist);

    // Total session time (excluding warmup/cooldown)
    const totalSessionTime = totalIntervalTime * intervals;

    setCalculated({
      pacePer100m,
      totalIntervalTime,
      totalSessionTime,
      pacePer100mStr: secondsToTimeString(pacePer100m),
      totalIntervalTimeStr: secondsToTimeString(totalIntervalTime),
      totalSessionTimeStr: secondsToTimeString(totalSessionTime),
    });
  }, [inputs]);

  const faqs = [
    {
      question: "What is the purpose of calculating swim interval pace?",
      answer:
        "Calculating swim interval pace helps swimmers and coaches set precise target times for each repeat during interval training. This ensures workouts are structured to improve speed, endurance, and pacing strategy effectively. By knowing the exact pace needed per 100 meters or 50 meters, swimmers can maintain consistent effort and track progress over time.",
    },
    {
      question: "How do rest intervals affect swim interval pace calculations?",
      answer:
        "Rest intervals are critical in swim interval training as they influence recovery and the quality of each repeat. While rest time does not change the swim pace itself, it affects the total interval time and overall workout duration. Including rest intervals in calculations helps swimmers plan sessions that balance intensity and recovery for optimal performance gains.",
    },
    {
      question: "Can this calculator be used for different pool lengths?",
      answer:
        "Yes, this calculator supports common training distances such as 50 meters and 100 meters, which correspond to short course and long course pool lengths. By selecting the appropriate distance, the calculator adjusts pace calculations accordingly, allowing swimmers to train effectively regardless of pool size.",
    },
    {
      question: "Why is it important to convert pace to a per 100m basis?",
      answer:
        "Converting pace to a per 100m basis standardizes swim speeds, making it easier to compare performances across different distances and workouts. It also aligns with common swim training metrics and race distances, enabling swimmers to set realistic goals and monitor improvements consistently.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distance" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Distance per Repeat (meters) <Waves className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.distance}
                onValueChange={(v) => handleInputChange("distance", v)}
                aria-label="Distance per Repeat"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 meters</SelectItem>
                  <SelectItem value="100">100 meters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetTime" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Target Swim Time per Repeat (mm:ss or ss) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="targetTime"
                type="text"
                placeholder="e.g. 1:30 or 90"
                value={inputs.targetTime}
                onChange={(e) => handleInputChange("targetTime", e.target.value)}
                aria-describedby="targetTimeHelp"
              />
              <p id="targetTimeHelp" className="text-xs text-slate-500 mt-1">
                Enter your target swim time for each repeat. Formats accepted: mm:ss, ss, or mm:ss.ms
              </p>
            </div>

            <div>
              <Label htmlFor="restTime" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Rest Time Between Repeats (mm:ss or ss) <Heart className="w-4 h-4 text-red-600" />
              </Label>
              <Input
                id="restTime"
                type="text"
                placeholder="e.g. 0:30 or 30"
                value={inputs.restTime}
                onChange={(e) => handleInputChange("restTime", e.target.value)}
                aria-describedby="restTimeHelp"
              />
              <p id="restTimeHelp" className="text-xs text-slate-500 mt-1">
                Enter rest time between repeats. Defaults to 0 if left blank.
              </p>
            </div>

            <div>
              <Label htmlFor="intervals" className="flex items-center gap-1 mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Number of Intervals <Activity className="w-4 h-4 text-green-600" />
              </Label>
              <Input
                id="intervals"
                type="number"
                min={1}
                placeholder="e.g. 10"
                value={inputs.intervals}
                onChange={(e) => handleInputChange("intervals", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              onClick={calculatePace}
              aria-label="Calculate Swim Interval Pace"
            >
              <Trophy className="mr-2 h-4 w-4" /> Calculate
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInputs({ distance: "100", targetTime: "", restTime: "", intervals: "" });
                setCalculated(null);
              }}
              className="flex-1 h-11"
              aria-label="Reset Inputs"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          {calculated && (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
              <CardContent className="p-8 text-center">
                {"error" in calculated ? (
                  <p className="text-red-600 font-semibold text-lg">{calculated.error}</p>
                ) : (
                  <>
                    <p className="text-4xl font-extrabold text-blue-900 dark:text-white mb-2">
                      {calculated.pacePer100mStr} &lt;mm:ss&gt; per 100m
                    </p>
                    <p className="text-lg text-blue-800 dark:text-blue-300 mb-4">
                      Total Interval Time (Swim + Rest): {calculated.totalIntervalTimeStr}
                    </p>
                    <p className="text-lg text-blue-800 dark:text-blue-300">
                      Total Workout Time ({inputs.intervals} intervals): {calculated.totalSessionTimeStr}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Swim Interval Pace Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Swim interval training is a fundamental method used by swimmers to improve speed, endurance, and pacing. The Swim Interval Pace Calculator is a specialized tool designed to help swimmers and coaches determine the precise pace needed for each repeat in a swim workout. By inputting target times, distances, rest intervals, and number of repeats, this calculator provides a clear breakdown of the pace per 100 meters and the total workout duration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your swim pace is crucial for structuring effective training sessions. It allows swimmers to maintain consistent effort, avoid burnout, and progressively improve performance. The calculator standardizes pace to a per 100-meter basis, which is the most common metric in swimming, making it easier to compare efforts across different distances and workouts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, incorporating rest intervals into the calculation helps swimmers plan realistic session durations and manage recovery effectively. This balance between work and rest is essential for maximizing training benefits and minimizing injury risk. Whether training for sprint events or long-distance races, this calculator supports tailored interval pacing strategies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Overall, the Swim Interval Pace Calculator empowers swimmers with data-driven insights to optimize their training, track progress, and achieve their competitive goals with confidence.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Swim Interval Pace Calculator is straightforward and intuitive. Begin by selecting the distance of each repeat, typically 50 or 100 meters, depending on your pool length and training focus. Next, enter your target swim time for each repeat in a standard time format such as minutes and seconds (e.g., 1:30 for one minute and thirty seconds).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Then, input the rest time you plan to take between repeats. This rest period is important for recovery and maintaining quality in each interval. If you do not plan to rest, you can leave this field blank or enter zero. Finally, specify the total number of intervals you intend to complete during your workout.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering all required fields, click the "Calculate" button. The calculator will display your pace per 100 meters, total interval time including rest, and the overall workout duration based on the number of intervals. Use these results to guide your training intensity and manage your session effectively.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the distance per repeat (50m or 100m).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your target swim time for each repeat in mm:ss or seconds.
          </li>
          <li>
            <strong>Step 3:</strong> Input your planned rest time between repeats.
          </li>
          <li>
            <strong>Step 4:</strong> Specify the total number of intervals.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your pace and workout summary.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize the benefits of interval training, it is essential to balance intensity and recovery. Use the calculated pace as a guideline, but listen to your body and adjust as needed. Consistency in hitting your target pace will lead to improved aerobic capacity and muscular endurance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate a variety of interval distances and rest periods to target different energy systems. For example, shorter repeats with shorter rest improve anaerobic capacity, while longer repeats with moderate rest enhance aerobic endurance. Periodically reassess your pace targets as your fitness improves.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Warm-up and cool-down are critical components of any swim workout. Allocate sufficient time before and after intervals to prepare your muscles and aid recovery. Proper technique focus during intervals will also improve efficiency and reduce injury risk.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, track your interval times and rest periods in a training log to monitor progress and adjust your training plan accordingly. Using this calculator regularly can help you set realistic goals and stay motivated throughout your swim training journey.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.usms.org/fitness-and-training/articles-and-videos/articles/swim-interval-training"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              US Masters Swimming - Swim Interval Training <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guide on swim interval training principles and workout examples from a leading swimming organization.
            </p>
          </li>
          <li>
            <a
              href="https://www.swimmingworldmagazine.com/news/interval-training-for-swimmers-how-to-improve-your-speed-and-endurance/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Swimming World Magazine - Interval Training for Swimmers <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Expert advice on structuring interval workouts to enhance speed and endurance, including pacing strategies.
            </p>
          </li>
          <li>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6019055/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              PubMed Central - Effects of Interval Training on Swimming Performance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Scientific study analyzing the physiological benefits of interval training in competitive swimmers.
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
        formula:
          "Pace per 100m = (Target Swim Time in seconds) × (100 / Distance per Repeat in meters)\n" +
          "Total Interval Time = Target Swim Time + Rest Time\n" +
          "Total Workout Time = Total Interval Time × Number of Intervals",
        variables: [
          { symbol: "Pace per 100m", description: "Swim pace normalized to 100 meters" },
          { symbol: "Target Swim Time", description: "Time taken to swim one repeat" },
          { symbol: "Distance per Repeat", description: "Distance of each swim repeat (50m or 100m)" },
          { symbol: "Rest Time", description: "Rest period between repeats" },
          { symbol: "Number of Intervals", description: "Total repeats in the workout" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer plans to do 10 repeats of 100 meters each, targeting 1 minute 30 seconds per repeat, with 30 seconds rest between repeats.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select 100 meters as the distance per repeat.",
          },
          {
            label: "Step 2",
            explanation: "Enter 1:30 as the target swim time per repeat.",
          },
          {
            label: "Step 3",
            explanation: "Enter 0:30 as the rest time between repeats.",
          },
          {
            label: "Step 4",
            explanation: "Enter 10 as the number of intervals.",
          },
          {
            label: "Step 5",
            explanation: "Click Calculate to get pace and total workout time.",
          },
        ],
        result:
          "Pace per 100m: 1:30.00\nTotal Interval Time: 2:00.00\nTotal Workout Time: 20:00.00",
      }}
      relatedCalculators={[
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "🏆" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Body Fat Percentage Calculator (Athletes)", url: "/sports/body-fat-percentage", icon: "🔥" },
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
