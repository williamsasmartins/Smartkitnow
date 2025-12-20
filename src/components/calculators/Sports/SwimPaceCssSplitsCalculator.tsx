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

export default function SwimPaceCssSplitsCalculator() {
  const [inputs, setInputs] = useState({
    dist1: "",
    time1: "",
    dist2: "",
    time2: "",
    splitDistance: "50",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  // Helper to convert time string mm:ss or ss to seconds number
  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr) return null;
    const parts = timeStr.split(":").map((p) => p.trim());
    if (parts.length === 1) {
      const s = parseFloat(parts[0]);
      return isNaN(s) ? null : s;
    } else if (parts.length === 2) {
      const m = parseInt(parts[0], 10);
      const s = parseFloat(parts[1]);
      if (isNaN(m) || isNaN(s)) return null;
      return m * 60 + s;
    }
    return null;
  };

  // Format seconds to mm:ss.ss
  const formatSecondsToTime = (seconds) => {
    if (seconds == null || isNaN(seconds)) return "";
    const m = Math.floor(seconds / 60);
    const s = (seconds % 60).toFixed(2);
    return `${m}:${s.padStart(5, "0")}`;
  };

  // Calculate CSS and splits
  const results = useMemo(() => {
    const d1 = parseFloat(inputs.dist1);
    const d2 = parseFloat(inputs.dist2);
    const t1 = parseTimeToSeconds(inputs.time1);
    const t2 = parseTimeToSeconds(inputs.time2);
    const splitDist = parseFloat(inputs.splitDistance);

    if (
      !d1 || !d2 || !t1 || !t2 ||
      d1 <= 0 || d2 <= 0 || t1 <= 0 || t2 <= 0 ||
      d2 <= d1
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid distances and times. Distance 2 must be &gt; Distance 1.",
        formulaUsed: null,
      };
    }

    // CSS formula: CSS = (d2 - d1) / (t2 - t1) [m/s]
    const css = (d2 - d1) / (t2 - t1); // meters per second

    // Convert CSS to pace per 100m (seconds per 100m)
    const pacePer100m = 100 / css;

    // Calculate splits for chosen split distance
    // split time = splitDist / CSS (seconds)
    const splitTime = splitDist / css;

    // Format results
    const paceFormatted = formatSecondsToTime(pacePer100m);
    const splitTimeFormatted = formatSecondsToTime(splitTime);

    return {
      value: `${paceFormatted} per 100m`,
      label: "Critical Swim Speed (CSS) Pace",
      subtext: `Estimated split time for ${splitDist}m: ${splitTimeFormatted}`,
      warning: null,
      formulaUsed: "CSS = (d₂ - d₁) / (t₂ - t₁), where distances are in meters and times in seconds",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Critical Swim Speed (CSS)?",
      answer:
        "Critical Swim Speed (CSS) is the swimming velocity that can be maintained without exhaustion for a prolonged period, typically representing the boundary between aerobic and anaerobic metabolism. It is calculated using two swim distances and their corresponding times to estimate sustainable pace.",
    },
    {
      question: "How can I use CSS to improve my training?",
      answer:
        "CSS helps swimmers set training intensities that optimize aerobic conditioning and pacing strategies. Training at or near CSS improves endurance and efficiency, while intervals above CSS target anaerobic capacity. Monitoring CSS over time tracks fitness improvements.",
    },
    {
      question: "Why do I need two distances and times for CSS calculation?",
      answer:
        "Using two distances and their times allows for a more accurate estimation of CSS by calculating the slope of the distance-time relationship. This method reduces errors compared to using a single distance and time, providing a reliable pace for training.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dist1" className="flex items-center gap-1">
                Distance 1 (meters) <Waves className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="dist1"
                type="number"
                min="1"
                step="any"
                placeholder="e.g., 200"
                value={inputs.dist1}
                onChange={(e) => handleInputChange("dist1", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time1" className="flex items-center gap-1">
                Time 1 (mm:ss or ss) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="time1"
                type="text"
                placeholder="e.g., 3:30 or 210"
                value={inputs.time1}
                onChange={(e) => handleInputChange("time1", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dist2" className="flex items-center gap-1">
                Distance 2 (meters) <Waves className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="dist2"
                type="number"
                min="1"
                step="any"
                placeholder="e.g., 400"
                value={inputs.dist2}
                onChange={(e) => handleInputChange("dist2", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time2" className="flex items-center gap-1">
                Time 2 (mm:ss or ss) <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="time2"
                type="text"
                placeholder="e.g., 7:30 or 450"
                value={inputs.time2}
                onChange={(e) => handleInputChange("time2", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="splitDistance" className="flex items-center gap-1">
                Split Distance (meters) <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.splitDistance}
                onValueChange={(v) => handleInputChange("splitDistance", v)}
                id="splitDistance"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 meters</SelectItem>
                  <SelectItem value="50">50 meters</SelectItem>
                  <SelectItem value="100">100 meters</SelectItem>
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
            // Just triggers recalculation, no extra action needed
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              dist1: "",
              time1: "",
              dist2: "",
              time2: "",
              splitDistance: "50",
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
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Swim Pace: CSS (Critical Swim Speed) &amp; Splits
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Critical Swim Speed (CSS) is a scientifically validated metric that represents the fastest pace a swimmer can maintain aerobically without accumulating significant fatigue. It is derived from two time trials over different distances, typically between 200m and 400m or 400m and 800m, allowing coaches and athletes to estimate sustainable swim velocity. CSS serves as a practical threshold to guide training intensity, pacing strategies, and monitor aerobic conditioning improvements over time. By understanding and applying CSS, swimmers can optimize workouts to enhance endurance and race performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Splits are shorter segment times within a swim session or race, often measured over 25m, 50m, or 100m distances. Calculating splits based on CSS helps swimmers maintain consistent pacing, avoid early fatigue, and execute race strategies effectively. This calculator estimates your CSS and provides split times for your chosen segment length, empowering you to train smarter and race faster.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To calculate your Critical Swim Speed, input two swim distances and the times it took you to complete each. The distances should be in meters, and times can be entered in either seconds or minutes and seconds (mm:ss). Select your preferred split distance to see estimated split times based on your CSS. Press &quot;Calculate&quot; to view your CSS pace and splits.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Enter your first swim distance (e.g., 200 meters) and the time it took you to swim that distance (e.g., 3:30).
          </li>
          <li>
            Enter your second swim distance, which must be longer than the first (e.g., 400 meters), and the corresponding time (e.g., 7:30).
          </li>
          <li>
            Choose the split distance you want to calculate splits for (25m, 50m, or 100m).
          </li>
          <li>
            Click &quot;Calculate&quot; to see your Critical Swim Speed pace per 100 meters and the estimated split time for your chosen segment.
          </li>
          <li>
            Use the &quot;Reset&quot; button to clear inputs and start a new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Training at or near your CSS pace enhances aerobic capacity and muscular endurance, which are critical for middle- and long-distance swimming events. Incorporate intervals at CSS pace with short rest periods to improve your ability to sustain high-intensity efforts. For anaerobic conditioning, perform sets above CSS pace, but ensure adequate recovery to avoid overtraining. Monitoring your CSS regularly allows you to track fitness gains and adjust training loads accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When racing, use your CSS splits to pace yourself evenly, avoiding the common mistake of starting too fast and fading later. Consistent splits close to CSS pace maximize efficiency and reduce lactate accumulation. Remember that CSS is a dynamic metric; as your fitness improves, your CSS will increase, so retest every 4-6 weeks to keep your training zones accurate.
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
          For more information on swim training science, physiology, and pacing strategies, consult the following authoritative sources:
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
              The national governing body for competitive swimming in the United States, offering resources on training, technique, and competition rules.
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
              Provides research and education on strength and conditioning principles applicable to swim training and athletic performance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Swim Pace: CSS (Critical Swim Speed) &amp; Splits"
      description="Calculate your Critical Swim Speed (CSS). Determine optimal pacing for swim training and monitor aerobic threshold improvements."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "CSS = (d₂ - d₁) / (t₂ - t₁)",
        variables: [
          { symbol: "CSS", description: "Critical Swim Speed (meters per second)" },
          { symbol: "d₁", description: "First swim distance (meters)" },
          { symbol: "d₂", description: "Second swim distance (meters)" },
          { symbol: "t₁", description: "Time for first distance (seconds)" },
          { symbol: "t₂", description: "Time for second distance (seconds)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer completes 200 meters in 3 minutes and 30 seconds, and 400 meters in 7 minutes and 30 seconds. They want to calculate their CSS and estimate 50-meter split times.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert times to seconds: 3:30 = 210 seconds, 7:30 = 450 seconds.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate CSS: (400m - 200m) / (450s - 210s) = 200m / 240s = 0.833 m/s.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate pace per 100m: 100 / 0.833 = 120 seconds = 2:00 per 100m.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate 50m split: 50 / 0.833 = 60 seconds = 1:00 per 50m split.",
          },
        ],
        result:
          "The swimmer's CSS pace is 2:00 per 100 meters, with estimated 50-meter splits of 1:00. This pace can be used to guide training and race pacing.",
      }}
      relatedCalculators={[
        { title: "🏊 Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "🏆 T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "🏊 FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏊" },
        { title: "🏊 Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
        { title: "🏆 Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "⚽ Baseball OPS / SLG / OBP Calculator", url: "/sports/baseball-ops-slg-obp", icon: "⚽" },
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