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
  });
  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Helper to parse float or 0
  const parseNum = (val) => (val === "" ? 0 : parseFloat(val));

  // Calculate total race time and impact of T1/T2 transitions
  const results = useMemo(() => {
    const swim = parseNum(inputs.swimTime);
    const bike = parseNum(inputs.bikeTime);
    const run = parseNum(inputs.runTime);
    const t1 = parseNum(inputs.t1Time);
    const t2 = parseNum(inputs.t2Time);

    if (swim <= 0 || bike <= 0 || run <= 0 || t1 < 0 || t2 < 0) {
      return {
        value: "",
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all fields.",
        formulaUsed: "",
      };
    }

    // Total race time including transitions
    const totalTime = swim + bike + run + t1 + t2;

    // Total race time excluding transitions
    const baseTime = swim + bike + run;

    // Percentage impact of transitions on total time
    const transitionTime = t1 + t2;
    const impactPercent = (transitionTime / totalTime) * 100;

    // Estimated time saved if transitions improved by 30%
    const improvedTransitionTime = transitionTime * 0.7;
    const improvedTotalTime = baseTime + improvedTransitionTime;
    const timeSaved = totalTime - improvedTotalTime;

    // Format times to mm:ss or hh:mm:ss if > 3600 seconds
    const formatTime = (seconds) => {
      if (seconds < 0) return "0:00";
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.round(seconds % 60);
      if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
      }
      return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return {
      value: formatTime(totalTime),
      label: "Total Race Time (including T1 & T2)",
      subtext: (
        <>
          <p>
            Transition time (T1 + T2) accounts for <strong>{impactPercent.toFixed(1)}&nbsp;%</strong> of your total race time.
          </p>
          <p>
            Improving your transitions by 30&percnt; could save you approximately <strong>{formatTime(timeSaved)}</strong>, potentially improving your race ranking.
          </p>
        </>
      ),
      warning: null,
      formulaUsed:
        "Total Time = Swim + T1 + Bike + T2 + Run; Transition Impact (%) = ((T1 + T2) / Total Time) × 100",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why are T1 and T2 transitions important in triathlon performance?",
      answer:
        "Transitions (T1 and T2) are often called the 'fourth discipline' of triathlon because efficient transitions can save valuable time and improve overall race performance. They require practice, strategy, and smooth execution to minimize delays between disciplines.",
    },
    {
      question: "How can I improve my T1 and T2 transition times?",
      answer:
        "Improving transitions involves practicing quick gear changes, organizing equipment efficiently, and rehearsing race-day routines. Training transition-specific drills and simulating race conditions can significantly reduce transition times.",
    },
    {
      question: "Does a faster transition time always guarantee a better race result?",
      answer:
        "While faster transitions contribute to better overall times, they are only one component of triathlon performance. Swim, bike, and run speeds, endurance, and race strategy also play critical roles in determining final results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="swimTime" className="flex items-center gap-1">
            <Waves className="w-4 h-4 text-blue-600" /> Swim Time (seconds)
          </Label>
          <Input
            id="swimTime"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 1800 (30 min)"
            value={inputs.swimTime}
            onChange={(e) => handleInputChange("swimTime", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="t1Time" className="flex items-center gap-1">
            <Timer className="w-4 h-4 text-indigo-600" /> T1 Transition Time (seconds)
          </Label>
          <Input
            id="t1Time"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 90 (1.5 min)"
            value={inputs.t1Time}
            onChange={(e) => handleInputChange("t1Time", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="bikeTime" className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-green-600" /> Bike Time (seconds)
          </Label>
          <Input
            id="bikeTime"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 5400 (90 min)"
            value={inputs.bikeTime}
            onChange={(e) => handleInputChange("bikeTime", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="t2Time" className="flex items-center gap-1">
            <Timer className="w-4 h-4 text-purple-600" /> T2 Transition Time (seconds)
          </Label>
          <Input
            id="t2Time"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 60 (1 min)"
            value={inputs.t2Time}
            onChange={(e) => handleInputChange("t2Time", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="runTime" className="flex items-center gap-1">
            <Activity className="w-4 h-4 text-red-600" /> Run Time (seconds)
          </Label>
          <Input
            id="runTime"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 3600 (60 min)"
            value={inputs.runTime}
            onChange={(e) => handleInputChange("runTime", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate total race time and transition impact"
        >
          <Trophy className="mr-2 h-4 w-4" aria-hidden="true" /> Calculate
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
            })
          }
          className="flex-1 h-11"
          aria-label="Reset all inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700 border rounded p-4">
          <CardContent className="text-yellow-800 dark:text-yellow-300 text-center font-semibold">
            <AlertTriangle className="inline-block mr-2 w-5 h-5" aria-hidden="true" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-live="polite" aria-atomic="true">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <div className="mt-4 text-sm text-blue-700 dark:text-blue-400 leading-relaxed">{results.subtext}</div>
          </CardContent>
        </Card>
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
          In triathlon, the transitions between disciplines—known as T1 (swim-to-bike) and T2 (bike-to-run)—are critical components that can significantly affect overall race performance. These transition phases require athletes to quickly change gear and mindset while maintaining momentum. Although often overlooked, efficient transitions can save valuable seconds or even minutes, which can be the difference between podium finishes or missed personal bests. This calculator helps quantify how your transition times impact your total race time and potential ranking.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By analyzing your swim, bike, run, and transition times, you can identify how much time transitions contribute to your overall race duration. Understanding this impact enables targeted training to optimize these crucial moments and improve your triathlon efficiency.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, input your best estimated or actual times for each triathlon segment: swim, bike, run, and the two transitions T1 and T2. All times should be entered in seconds for precision. Once entered, click &quot;Calculate&quot; to see your total race time including transitions, the percentage of time spent in transitions, and an estimate of time savings if you improve your transitions by 30&percnt;.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Enter your <strong>Swim Time</strong> in seconds (e.g., 1800 seconds for 30 minutes).
          </li>
          <li>
            Enter your <strong>T1 Transition Time</strong> in seconds (e.g., 90 seconds for 1.5 minutes).
          </li>
          <li>
            Enter your <strong>Bike Time</strong> in seconds (e.g., 5400 seconds for 90 minutes).
          </li>
          <li>
            Enter your <strong>T2 Transition Time</strong> in seconds (e.g., 60 seconds for 1 minute).
          </li>
          <li>
            Enter your <strong>Run Time</strong> in seconds (e.g., 3600 seconds for 60 minutes).
          </li>
          <li>
            Click <strong>Calculate</strong> to view your total race time and transition impact.
          </li>
          <li>
            Use the <strong>Reset</strong> button to clear all inputs and start fresh.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To reduce your T1 and T2 times, focus on practicing transitions under race-like conditions. Set up a mock transition area and rehearse removing your wetsuit, putting on cycling shoes, helmet, and then switching to running shoes quickly and efficiently. Prioritize organization by laying out your gear in a consistent, logical order to minimize fumbling. Remember, transitions &gt; 90 seconds can add significant time, so aim to keep them as short as possible without sacrificing safety or comfort.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, consider strength and mobility training to improve agility and speed during transitions. Mental rehearsal and visualization can also help reduce hesitation and improve confidence. Small improvements in transition times can cumulatively lead to substantial gains in overall race performance.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Additional Resources</h2>
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
              World Triathlon (International Triathlon Union) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official international governing body for triathlon, offering rules, race standards, and athlete resources.
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
              Provides research and guidelines on strength and conditioning programs that can enhance triathlon transition performance.
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
        formula:
          "Total Time = Swim + T1 + Bike + T2 + Run; Transition Impact (%) = ((T1 + T2) / Total Time) × 100",
        variables: [
          { symbol: "Swim", description: "Swim segment time in seconds" },
          { symbol: "T1", description: "Transition 1 time (swim to bike) in seconds" },
          { symbol: "Bike", description: "Bike segment time in seconds" },
          { symbol: "T2", description: "Transition 2 time (bike to run) in seconds" },
          { symbol: "Run", description: "Run segment time in seconds" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An athlete completes a sprint triathlon with the following segment times: Swim = 20 minutes (1200 seconds), T1 = 90 seconds, Bike = 45 minutes (2700 seconds), T2 = 60 seconds, Run = 30 minutes (1800 seconds).",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Sum all segment times including transitions: 1200 + 90 + 2700 + 60 + 1800 = 5850 seconds (1 hour 37 minutes 30 seconds).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total transition time: 90 + 60 = 150 seconds (2 minutes 30 seconds).",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate transition impact percentage: (150 / 5850) × 100 ≈ 2.56%.",
          },
          {
            label: "Step 4",
            explanation:
              "Estimate time saved by improving transitions by 30%: 150 × 0.3 = 45 seconds saved, reducing total time to 5805 seconds (1 hour 36 minutes 45 seconds).",
          },
        ],
        result:
          "By improving transitions by 30%, the athlete can save 45 seconds, which may improve their race ranking significantly.",
      }}
      relatedCalculators={[
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
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