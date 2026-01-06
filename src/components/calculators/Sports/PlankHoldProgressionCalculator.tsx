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

type PlankProgressionRow = { week: number; holdTime: number };

type PlankProgressionResults = {
  value: string | null;
  label: string | null;
  subtext: string | null;
  warning: string | null;
  formulaUsed: string;
  progressionTable: PlankProgressionRow[] | null;
};

export default function PlankHoldProgressionCalculator() {
  /**
   * Inputs:
   * - currentHold: current max plank hold time in seconds
   * - targetHold: target plank hold time in seconds
   * - sessionsPerWeek: how many plank sessions per week
   * - progressionRate: % increase per session (default 5%)
   */

  const [inputs, setInputs] = useState({
    currentHold: "",
    targetHold: "",
    sessionsPerWeek: "3",
    progressionRate: "5",
  });

  const handleInputChange = useCallback(
    (name: "currentHold" | "targetHold" | "sessionsPerWeek" | "progressionRate", value: string) => {
    // Only allow numbers and decimals for inputs except sessionsPerWeek (integer)
    if (name === "sessionsPerWeek") {
      if (/^\d*$/.test(value)) setInputs((p) => ({ ...p, [name]: value }));
    } else {
      if (/^\d*\.?\d*$/.test(value)) setInputs((p) => ({ ...p, [name]: value }));
    }
    },
    []
  );

  /**
   * Calculation logic:
   * We assume a linear progression based on % increase per session.
   * Formula to calculate number of sessions needed:
   *   sessionsNeeded = log(target/current) / log(1 + progressionRate/100)
   * Then weeksNeeded = sessionsNeeded / sessionsPerWeek
   * 
   * We also provide a progression table for each week showing expected hold time.
   */

  const results = useMemo<PlankProgressionResults>(() => {
    const current = parseFloat(inputs.currentHold);
    const target = parseFloat(inputs.targetHold);
    const sessionsPerWeek = parseInt(inputs.sessionsPerWeek);
    const progressionRate = parseFloat(inputs.progressionRate);

    if (
      !current ||
      !target ||
      !sessionsPerWeek ||
      !progressionRate ||
      current <= 0 ||
      target <= 0 ||
      target <= current ||
      sessionsPerWeek <= 0 ||
      progressionRate <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning:
          "Please enter valid positive numbers. Target hold time must be greater than current hold time.",
        formulaUsed:
          "sessionsNeeded = log(target/current) / log(1 + progressionRate/100)",
        progressionTable: null,
      };
    }

    // Calculate sessions needed
    const sessionsNeeded = Math.log(target / current) / Math.log(1 + progressionRate / 100);
    const weeksNeeded = sessionsNeeded / sessionsPerWeek;

    // Round up sessions and weeks
    const sessionsRounded = Math.ceil(sessionsNeeded);
    const weeksRounded = Math.ceil(weeksNeeded);

    // Generate progression table: weekly expected max hold time
    // For each week, calculate hold time after sessionsPerWeek sessions
    // holdTime_week = current * (1 + progressionRate/100)^(sessionsPerWeek * week)
    const progressionTable: PlankProgressionRow[] = [];
    for (let w = 1; w <= weeksRounded; w++) {
      const holdTime = current * Math.pow(1 + progressionRate / 100, sessionsPerWeek * w);
      progressionTable.push({
        week: w,
        holdTime: Math.min(holdTime, target),
      });
    }

    return {
      value: `${weeksRounded} week${weeksRounded > 1 ? "s" : ""}`,
      label: `Estimated time to reach your target plank hold`,
      subtext: `Based on ${sessionsPerWeek} sessions/week and a ${progressionRate}% progression rate per session.`,
      warning: null,
      formulaUsed:
        "sessionsNeeded = log(target/current) / log(1 + progressionRate/100)",
      progressionTable,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How accurate is the plank hold progression calculator?",
      answer:
        "This calculator provides an estimate based on a consistent percentage progression per session. Actual results may vary depending on individual factors such as fitness level, recovery, nutrition, and training consistency. It assumes linear progression which might slow down as you approach your target.",
    },
    {
      question: "What is a safe progression rate for plank hold times?",
      answer:
        "A progression rate of 5% per session is generally safe and effective for most individuals. Increasing hold times too quickly can lead to poor form or injury. It’s important to listen to your body and adjust progression accordingly.",
    },
    {
      question: "Can I use this calculator for other isometric holds?",
      answer:
        "Yes, the principles of progression and session planning apply to other isometric holds like wall sits or hollow holds. Just input your current and target hold times and adjust progression rate and session frequency as needed.",
    },
    {
      question: "How often should I train planks to see improvement?",
      answer:
        "Training planks 2-4 times per week is effective for most people. This frequency allows for sufficient stimulus and recovery. Overtraining can lead to fatigue and decreased performance, so balance is key.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="currentHold" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          <Timer className="w-4 h-4" /> Current Max Hold Time (seconds)
        </Label>
        <Input
          id="currentHold"
          type="text"
          placeholder="e.g. 30"
          value={inputs.currentHold}
          onChange={(e) => handleInputChange("currentHold", e.target.value)}
          aria-describedby="currentHoldHelp"
        />
      </div>

      <div>
        <Label htmlFor="targetHold" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          <Flag className="w-4 h-4" /> Target Hold Time (seconds)
        </Label>
        <Input
          id="targetHold"
          type="text"
          placeholder="e.g. 120"
          value={inputs.targetHold}
          onChange={(e) => handleInputChange("targetHold", e.target.value)}
          aria-describedby="targetHoldHelp"
        />
      </div>

      <div>
        <Label htmlFor="sessionsPerWeek" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          <Activity className="w-4 h-4" /> Sessions per Week
        </Label>
        <Input
          id="sessionsPerWeek"
          type="text"
          placeholder="e.g. 3"
          value={inputs.sessionsPerWeek}
          onChange={(e) => handleInputChange("sessionsPerWeek", e.target.value)}
          aria-describedby="sessionsPerWeekHelp"
        />
      </div>

      <div>
        <Label htmlFor="progressionRate" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          <TrendingUp className="w-4 h-4" /> Progression Rate per Session (%)
        </Label>
        <Input
          id="progressionRate"
          type="text"
          placeholder="e.g. 5"
          value={inputs.progressionRate}
          onChange={(e) => handleInputChange("progressionRate", e.target.value)}
          aria-describedby="progressionRateHelp"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              currentHold: "",
              targetHold: "",
              sessionsPerWeek: "3",
              progressionRate: "5",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <Card className="bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700">
          <CardContent className="p-4 text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="inline-block mr-2 w-5 h-5 align-text-bottom" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-6">{results.subtext}</p>

            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-700">
                <thead className="bg-blue-100 dark:bg-blue-900">
                  <tr>
                    <th className="border border-slate-300 dark:border-slate-700 px-3 py-1">Week</th>
                    <th className="border border-slate-300 dark:border-slate-700 px-3 py-1">Expected Max Hold Time (seconds)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.progressionTable.map(({ week, holdTime }) => (
                    <tr key={week} className="odd:bg-white even:bg-blue-50 dark:odd:bg-slate-800 dark:even:bg-slate-900">
                      <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 font-medium">{week}</td>
                      <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">{holdTime.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs italic text-blue-700 dark:text-blue-400">
              Formula used: {results.formulaUsed}
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
          Understanding Plank / Hold Time Progression
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The plank is a fundamental isometric exercise that targets the core muscles, including the abdominals, lower back, and shoulders. Improving your plank hold time is a reliable indicator of increasing core strength and endurance, which are essential for athletic performance, injury prevention, and overall functional fitness.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Progression in plank hold time should be gradual and consistent to avoid overtraining and injury. This calculator uses a scientifically grounded model based on percentage increases per training session, allowing you to estimate how long it will take to reach your target hold time given your current ability and training frequency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By understanding the relationship between progression rate, session frequency, and total training time, you can plan your training more effectively. This approach helps maintain motivation by setting realistic goals and tracking incremental improvements over weeks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, individual factors such as recovery, nutrition, and exercise form also play a critical role in progression. Use this tool as a guide, but always listen to your body and adjust your training accordingly.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you estimate the time required to progress from your current plank hold time to a desired target hold time. To use it effectively, you need to input your current maximum hold time, your target hold time, how many plank sessions you plan to perform each week, and your expected progression rate per session.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The progression rate represents the percentage increase in hold time you expect to achieve with each training session. A typical safe value is around 5%, but this can be adjusted based on your experience and recovery ability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering these values, click "Calculate" to see an estimate of how many weeks it will take to reach your goal. The calculator also provides a week-by-week progression table to help you track your improvements and stay motivated.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Enter your current plank hold time in seconds.</li>
          <li>Step 2: Enter your target plank hold time in seconds (must be greater than current).</li>
          <li>Step 3: Specify how many plank sessions you plan per week.</li>
          <li>Step 4: Set your expected progression rate per session (default is 5%).</li>
          <li>Step 5: Click "Calculate" to view your estimated progression timeline and weekly targets.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your plank progression, focus on maintaining proper form throughout each hold. Engage your core, keep your body in a straight line from head to heels, and avoid sagging hips or raised buttocks. Quality is more important than duration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate plank variations and complementary core exercises to build overall strength and prevent plateaus. Examples include side planks, plank with shoulder taps, and hollow body holds. These variations challenge different muscle groups and improve stability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Allow adequate rest between sessions to promote recovery and muscle adaptation. Overtraining can lead to fatigue and injury, which will hinder your progress. Listen to your body and adjust your training frequency or intensity if you experience persistent soreness or discomfort.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, track your progress regularly and celebrate small milestones. Consistency and patience are key to long-term success in improving your plank hold time.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5485202/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Core Stability Exercises and Their Effectiveness <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive review of core stability exercises, including plank variations, and their impact on muscle activation and endurance.
            </p>
          </li>
          <li>
            <a
              href="https://www.acefitness.org/education-and-resources/professional/expert-articles/5673/how-to-progress-your-plank-exercise/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              How to Progress Your Plank Exercise - ACE Fitness <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Expert guidance on safely increasing plank hold times and variations to improve core strength and endurance.
            </p>
          </li>
          <li>
            <a
              href="https://journals.lww.com/nsca-jscr/Fulltext/2014/11000/Effects_of_Core_Stability_Training_on_Balance_and.12.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Effects of Core Stability Training on Balance and Performance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Research article exploring the benefits of core stability training, including plank exercises, on athletic performance and injury prevention.
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
        title: "Formula",
        formula: "sessionsNeeded = log(target/current) / log(1 + progressionRate/100)",
        variables: [
          { symbol: "sessionsNeeded", description: "Number of plank sessions needed to reach target" },
          { symbol: "target", description: "Target plank hold time (seconds)" },
          { symbol: "current", description: "Current plank hold time (seconds)" },
          { symbol: "progressionRate", description: "Expected progression rate per session (%)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You currently hold a plank for 30 seconds and want to reach 120 seconds. You train 3 times per week and expect to improve by 5% each session.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input current hold time: 30 seconds.",
          },
          {
            label: "Step 2",
            explanation: "Input target hold time: 120 seconds.",
          },
          {
            label: "Step 3",
            explanation: "Set sessions per week: 3.",
          },
          {
            label: "Step 4",
            explanation: "Set progression rate per session: 5%.",
          },
          {
            label: "Step 5",
            explanation: "Calculate to find it will take approximately 8 weeks to reach your goal.",
          },
        ],
        result: "Estimated time to reach target: 8 weeks with weekly progression targets.",
      }}
      relatedCalculators={[
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Target Heart Rate / RPE Zones", url: "/sports/target-heart-rate-rpe-zones", icon: "🏆" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
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
