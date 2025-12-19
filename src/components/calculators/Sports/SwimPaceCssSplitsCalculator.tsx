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

function timeToSeconds(timeStr) {
  // Accepts mm:ss or ss format, returns total seconds as number
  if (!timeStr) return null;
  const parts = timeStr.split(":").map(p => p.trim());
  if (parts.length === 1) return parseFloat(parts[0]);
  if (parts.length === 2) return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
  return null;
}

function secondsToTime(sec) {
  if (sec == null || isNaN(sec) || sec <= 0) return "--:--";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.round(sec % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function SwimPaceCssSplitsCalculator() {
  const [inputs, setInputs] = useState({
    distance1: 400,
    time1: "6:40",
    distance2: 200,
    time2: "3:10",
    targetDistance: 1500,
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Critical Swim Speed (CSS) is an estimate of the maximal speed a swimmer can maintain
   * without exhaustion, representing the aerobic threshold pace. It is calculated using two
   * time trials of different distances, typically 200m and 400m or 400m and 800m.
   *
   * Formula (per Maglischo, 2003):
   * CSS = (D2 - D1) / (T2 - T1)
   * where D1, D2 are distances in meters, T1, T2 are times in seconds.
   *
   * Once CSS is known, split times for any target distance can be estimated by:
   * Split Time = Target Distance / CSS
   */

  const results = useMemo(() => {
    const d1 = parseFloat(inputs.distance1);
    const d2 = parseFloat(inputs.distance2);
    const t1 = timeToSeconds(inputs.time1);
    const t2 = timeToSeconds(inputs.time2);
    const targetD = parseFloat(inputs.targetDistance);

    if (!d1 || !d2 || !t1 || !t2 || !targetD) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid distances and times.",
        formulaUsed: "",
      };
    }
    if (d2 <= d1) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Distance 2 must be greater than Distance 1 for valid CSS calculation.",
        formulaUsed: "",
      };
    }
    if (t2 <= t1) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Time 2 must be greater than Time 1 for valid CSS calculation.",
        formulaUsed: "",
      };
    }

    // Calculate CSS (m/s)
    const css = (d2 - d1) / (t2 - t1);
    // Calculate split time for target distance (seconds)
    const targetTimeSec = targetD / css;

    // Calculate pace per 100m (seconds)
    const pacePer100m = 100 / css;

    return {
      value: secondsToTime(targetTimeSec),
      label: `Estimated time for ${targetD}m at CSS pace`,
      subtext: `Critical Swim Speed (CSS): ${(css * 100).toFixed(2)} m/min | Pace: ${secondsToTime(pacePer100m)} per 100m`,
      warning: null,
      formulaUsed: `CSS = (D2 - D1) / (T2 - T1); Target Time = Target Distance / CSS`,
      css,
      targetTimeSec,
      pacePer100m,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Critical Swim Speed (CSS)?",
      answer:
        "Critical Swim Speed (CSS) is a scientifically validated estimate of the maximal speed a swimmer can sustain aerobically without fatigue. It represents the swimmer's aerobic threshold pace and is used to guide training intensity and pacing strategies.",
    },
    {
      question: "Why do I need two time trials for CSS calculation?",
      answer:
        "CSS requires two time trials at different distances (commonly 200m and 400m) to accurately estimate the swimmer's aerobic threshold speed. Using two distances helps account for pacing and physiological factors, providing a reliable CSS value.",
    },
    {
      question: "How can I use CSS to improve my swim training?",
      answer:
        "By training at or near your CSS pace, you can improve aerobic endurance and efficiency. CSS-based training helps optimize workouts by targeting the intensity that maximizes aerobic capacity without causing excessive fatigue.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distance1" className="flex items-center gap-1">
                Distance 1 (meters) <Waves className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="distance1"
                type="number"
                min={50}
                step={50}
                value={inputs.distance1}
                onChange={(e) => handleInputChange("distance1", e.target.value)}
                placeholder="e.g. 400"
              />
            </div>
            <div>
              <Label htmlFor="time1" className="flex items-center gap-1">
                Time 1 (mm:ss or ss) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="time1"
                type="text"
                value={inputs.time1}
                onChange={(e) => handleInputChange("time1", e.target.value)}
                placeholder="e.g. 6:40"
              />
            </div>
            <div>
              <Label htmlFor="distance2" className="flex items-center gap-1">
                Distance 2 (meters) <Waves className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="distance2"
                type="number"
                min={50}
                step={50}
                value={inputs.distance2}
                onChange={(e) => handleInputChange("distance2", e.target.value)}
                placeholder="e.g. 200"
              />
            </div>
            <div>
              <Label htmlFor="time2" className="flex items-center gap-1">
                Time 2 (mm:ss or ss) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="time2"
                type="text"
                value={inputs.time2}
                onChange={(e) => handleInputChange("time2", e.target.value)}
                placeholder="e.g. 3:10"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="targetDistance" className="flex items-center gap-1">
                Target Distance (meters) <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="targetDistance"
                type="number"
                min={50}
                step={50}
                value={inputs.targetDistance}
                onChange={(e) => handleInputChange("targetDistance", e.target.value)}
                placeholder="e.g. 1500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
              distance1: 400,
              time1: "6:40",
              distance2: 200,
              time2: "3:10",
              targetDistance: 1500,
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700">
          <CardContent className="text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Swim Pace: CSS (Critical Swim Speed) & Splits
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Critical Swim Speed (CSS) is a pivotal concept in swim training, representing the threshold pace that a swimmer can maintain aerobically without fatigue. It is derived from two maximal effort time trials over different distances, typically 200m and 400m, or 400m and 800m. CSS serves as a reliable indicator of aerobic endurance and is widely used by coaches and athletes to tailor training intensity and race pacing strategies. By understanding and applying CSS, swimmers can optimize their workouts to improve efficiency, endurance, and overall performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation of CSS is based on the linear relationship between swim distance and time, assuming that the swimmer's speed decreases linearly with increasing distance. This relationship allows for the estimation of a sustainable pace that maximizes aerobic energy production while minimizing anaerobic fatigue. CSS is not only a performance metric but also a training tool that helps swimmers monitor progress and adapt their training zones accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Splits, or segment times, are derived from CSS to help swimmers pace themselves during training or competition. By calculating split times for various distances, swimmers can maintain consistent effort levels and avoid early fatigue or underperformance. This calculator provides both the CSS value and estimated split times for any target distance, empowering swimmers with actionable data to enhance their swim workouts.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate your Critical Swim Speed (CSS), you need to input two swim time trials of different distances along with their respective times. These distances should be measured in meters, and times can be entered in either seconds or the mm:ss format. Additionally, specify the target distance for which you want to estimate your split time at CSS pace.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your first swim distance (e.g., 400 meters) and the corresponding time trial result (e.g., 6:40).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your second swim distance (e.g., 200 meters) and its time trial result (e.g., 3:10). Ensure this distance is shorter or longer than the first to maintain validity.
          </li>
          <li>
            <strong>Step 3:</strong> Input the target distance you want to calculate splits for (e.g., 1500 meters).
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to compute your CSS and estimated split time for the target distance.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results, including your CSS pace in meters per minute and your estimated time for the target distance.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporating CSS into your training regimen can significantly enhance your aerobic capacity and race performance. Use your CSS pace as a benchmark for interval training, tempo swims, and endurance sets to ensure you are training at the optimal intensity. Avoid training too far above CSS for extended periods, as this can lead to premature fatigue and overtraining.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Regularly retesting your CSS every 4-6 weeks allows you to track improvements and adjust your training zones accordingly. When preparing for races, use CSS-based splits to pace yourself evenly, preventing early burnout and enabling a strong finish. Remember that environmental factors such as pool length, water temperature, and fatigue levels can influence your times, so consider these when interpreting your CSS results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, complement CSS training with strength, technique, and flexibility work to maximize swimming efficiency and reduce injury risk. Combining physiological data with technical improvements yields the best performance gains.
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
          For more information on swim training science, aerobic threshold concepts, and pacing strategies, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for endurance training and performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.usms.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              U.S. Masters Swimming (USMS) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Offers comprehensive resources on swim training, pacing, and aerobic conditioning for swimmers of all levels.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/uk/training/swimming/a776310/critical-swim-speed-explained/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - Critical Swim Speed Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An accessible explanation of CSS and its application in swim training, including practical tips for pacing and workouts.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Swim Pace: CSS (Critical Swim Speed) & Splits"
      description="Calculate your Critical Swim Speed (CSS). Determine optimal pacing for swim training and monitor aerobic threshold improvements."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "CSS = (D2 - D1) / (T2 - T1); Target Time = Target Distance / CSS",
        variables: [
          { symbol: "CSS", description: "Critical Swim Speed (meters per second)" },
          { symbol: "D1", description: "Distance of first time trial (meters)" },
          { symbol: "D2", description: "Distance of second time trial (meters)" },
          { symbol: "T1", description: "Time for first distance (seconds)" },
          { symbol: "T2", description: "Time for second distance (seconds)" },
          { symbol: "Target Distance", description: "Distance to calculate split for (meters)" },
          { symbol: "Target Time", description: "Estimated time for target distance at CSS pace (seconds)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer completes a 400m time trial in 6 minutes 40 seconds and a 200m time trial in 3 minutes 10 seconds. They want to estimate their 1500m time at CSS pace.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert times to seconds: 400m = 400s (6*60+40=400), 200m = 190s (3*60+10=190).",
          },
          {
            label: "Step 2",
            explanation: "Calculate CSS: (400 - 200) / (400 - 190) = 200 / 210 ≈ 0.952 m/s.",
          },
          {
            label: "Step 3",
            explanation: "Calculate estimated 1500m time: 1500 / 0.952 ≈ 1575 seconds (26 minutes 15 seconds).",
          },
        ],
        result: "Estimated 1500m time at CSS pace is approximately 26:15.",
      }}
      relatedCalculators={[
        { title: "TDEE Calculator (Sports)", url: "/sports/tdee-calculator", icon: "🔥" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Macronutrient Calculator (Sports)", url: "/sports/macronutrient-calculator", icon: "🏆" },
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🚴" },
        { title: "Bowling Score Calculator", url: "/sports/bowling-score-calculator", icon: "🏆" },
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