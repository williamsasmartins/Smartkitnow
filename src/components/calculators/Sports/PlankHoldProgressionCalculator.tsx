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

export default function PlankHoldProgressionCalculator() {
  // Inputs: current hold time (seconds), training frequency (days per week), goal hold time (seconds)
  const [inputs, setInputs] = useState({
    currentTime: "",
    frequency: "",
    goalTime: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Logic Explanation:
   * This calculator estimates the number of weeks required to progress from a current plank hold time
   * to a target goal hold time based on training frequency per week. The progression model is based on
   * incremental increases in hold time, respecting recovery and adaptation principles.
   *
   * The progression rate is influenced by training frequency:
   * - 1-2 days/week: slower progression (~5% increase per week)
   * - 3-4 days/week: moderate progression (~10% increase per week)
   * - 5-7 days/week: faster progression (~15% increase per week)
   *
   * The formula used is a compound progression model:
   * weeks = log(goalTime / currentTime) / log(1 + weeklyProgressionRate)
   *
   * This reflects exponential growth in hold time capacity, consistent with neuromuscular adaptation.
   */

  const results = useMemo(() => {
    const currentTime = parseFloat(inputs.currentTime);
    const frequency = parseInt(inputs.frequency);
    const goalTime = parseFloat(inputs.goalTime);

    if (
      isNaN(currentTime) ||
      isNaN(frequency) ||
      isNaN(goalTime) ||
      currentTime <= 0 ||
      goalTime <= currentTime ||
      frequency < 1 ||
      frequency > 7
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning:
          "Please enter valid values: Current time > 0, Goal time > Current time, Frequency between 1 and 7 days/week.",
        formulaUsed: null,
      };
    }

    // Determine weekly progression rate based on frequency
    let weeklyProgressionRate = 0.05; // default 5%
    if (frequency >= 3 && frequency <= 4) weeklyProgressionRate = 0.10;
    else if (frequency >= 5) weeklyProgressionRate = 0.15;

    // Calculate weeks needed using logarithmic progression formula
    const weeksNeeded =
      Math.log(goalTime / currentTime) / Math.log(1 + weeklyProgressionRate);

    const roundedWeeks = Math.ceil(weeksNeeded);

    return {
      value: `${roundedWeeks} week${roundedWeeks > 1 ? "s" : ""}`,
      label: "Estimated Time to Reach Goal",
      subtext: `Based on a weekly progression rate of ${(weeklyProgressionRate * 100).toFixed(
        0
      )}%, training ${frequency} day${frequency > 1 ? "s" : ""} per week.`,
      warning: null,
      formulaUsed:
        "weeks = log(goalTime / currentTime) / log(1 + weeklyProgressionRate)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How often should I train to improve my plank hold time?",
      answer:
        "Training frequency significantly impacts progression speed. According to the National Strength and Conditioning Association (NSCA), training core muscles 3-5 times per week with proper recovery optimizes endurance gains without risking overtraining.",
    },
    {
      question: "Can I progress faster by increasing hold time every session?",
      answer:
        "While incremental increases are essential, too rapid progression can lead to fatigue and injury. The American College of Sports Medicine (ACSM) recommends gradual overload, typically increasing hold times by 5-15% weekly depending on training frequency and individual adaptation.",
    },
    {
      question: "What if I plateau and cannot increase my hold time?",
      answer:
        "Plateaus are common and may indicate the need for varied training stimuli, such as incorporating dynamic planks or other core exercises. Additionally, ensuring adequate rest, nutrition, and technique refinement can help overcome stagnation.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="currentTime" className="mb-1 flex items-center gap-1">
            <Timer className="w-4 h-4 text-blue-600" /> Current Plank Hold Time (seconds)
          </Label>
          <Input
            id="currentTime"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 30"
            value={inputs.currentTime}
            onChange={(e) => handleInputChange("currentTime", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="frequency" className="mb-1 flex items-center gap-1">
            <Activity className="w-4 h-4 text-blue-600" /> Training Frequency (days/week)
          </Label>
          <Select
            value={inputs.frequency}
            onValueChange={(v) => handleInputChange("frequency", v)}
            id="frequency"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day} day{day > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="goalTime" className="mb-1 flex items-center gap-1">
            <Flag className="w-4 h-4 text-blue-600" /> Goal Plank Hold Time (seconds)
          </Label>
          <Input
            id="goalTime"
            type="number"
            min={1}
            step={1}
            placeholder="e.g. 90"
            value={inputs.goalTime}
            onChange={(e) => handleInputChange("goalTime", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ currentTime: "", frequency: "", goalTime: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Plank / Hold Time Progression
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The plank exercise is a fundamental isometric core strengthening movement that enhances abdominal endurance, spinal stability, and overall functional fitness. Progression in plank hold time is a reliable indicator of improving core muscular endurance and neuromuscular control. Scientific research shows that gradual overload—incrementally increasing hold duration—stimulates muscular adaptation without risking injury or overtraining. This progression is nonlinear and influenced by factors such as training frequency, recovery, and individual fitness levels.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The progression model used in this calculator is grounded in principles from exercise physiology and strength conditioning literature, which emphasize the importance of consistent, progressive training stimuli. By tracking your current hold time and setting realistic goals, you can plan a structured training regimen that maximizes core endurance gains while minimizing plateaus and injury risk.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the number of weeks required to progress from your current plank hold time to your desired goal, based on how many days per week you plan to train. Enter your current maximum hold time in seconds, select your weekly training frequency, and input your target hold time. The calculator uses a scientifically-informed progression rate to provide a realistic timeline for achieving your goal.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your current maximum plank hold time accurately by timing yourself maintaining proper form.
          </li>
          <li>
            <strong>Step 2:</strong> Choose your realistic training frequency per week, considering your schedule and recovery needs.
          </li>
          <li>
            <strong>Step 3:</strong> Set a challenging but achievable goal hold time to motivate consistent progression.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see the estimated weeks needed to reach your goal based on your inputs.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to plan your training schedule, progressively increasing hold times each week.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To optimize plank hold time progression, focus on maintaining impeccable form throughout each hold to engage the correct muscle groups and prevent injury. Incorporate rest days to allow muscular recovery and adaptation, especially if training frequency is high. Vary your core training by including dynamic plank variations and complementary exercises such as dead bugs or bird dogs to enhance overall core stability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Tracking your progress weekly and adjusting your training load based on fatigue and performance feedback is crucial. If you experience plateaus, consider reducing frequency temporarily or integrating periodization strategies, alternating between higher and lower intensity weeks. Nutrition, hydration, and sleep quality also play vital roles in recovery and performance gains.
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
          For more information on training science and rules, consult the following sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines on strength and endurance training.
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
              Authoritative body on strength training and conditioning, offering scientifically validated protocols for core endurance progression.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/fitness/a20865668/core-strength-training/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - Core Strength Training <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical insights and expert advice on core training techniques and progression strategies for endurance athletes.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plank / Hold Time Progression"
      description="Track core strength progression. Log and plan plank hold times to gradually build abdominal endurance and stability."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Progression Formula",
        formula: "weeks = log(goalTime / currentTime) / log(1 + weeklyProgressionRate)",
        variables: [
          { symbol: "weeks", description: "Number of weeks to reach goal" },
          { symbol: "goalTime", description: "Target plank hold time (seconds)" },
          { symbol: "currentTime", description: "Current plank hold time (seconds)" },
          { symbol: "weeklyProgressionRate", description: "Weekly increase rate based on training frequency" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An individual currently holds a plank for 30 seconds and wants to reach 90 seconds. They plan to train 4 days per week.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input current hold time: 30 seconds, training frequency: 4 days/week, and goal time: 90 seconds.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator applies a 10% weekly progression rate (for 3-4 days training frequency).",
          },
          {
            label: "Step 3",
            explanation:
              "Using the formula, it estimates approximately 12 weeks needed to reach the 90-second goal.",
          },
        ],
        result: "Estimated time to reach 90 seconds plank hold is 12 weeks with consistent training 4 days per week.",
      }}
      relatedCalculators={[
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
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