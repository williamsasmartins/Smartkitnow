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

const poolTypes = [
  { label: "Short Course Yards (SCY)", value: "SCY" },
  { label: "Short Course Meters (SCM)", value: "SCM" },
  { label: "Long Course Meters (LCM)", value: "LCM" },
];

// Conversion factors based on USA Swimming and global standards.
// These factors approximate equivalent times between pool lengths.
// Source: https://swimswam.com/swim-time-conversion-chart/
const conversionFactors: Record<string, Record<string, number>> = {
  SCY: { SCY: 1, SCM: 1.11, LCM: 1.14 },
  SCM: { SCY: 0.90, SCM: 1, LCM: 1.03 },
  LCM: { SCY: 0.88, SCM: 0.97, LCM: 1 },
};

function parseTimeToSeconds(timeStr: string): number | null {
  // Accept formats: mm:ss.xx or ss.xx or mm:ss or ss
  if (!timeStr) return null;
  const parts = timeStr.split(":");
  let seconds = 0;
  if (parts.length === 1) {
    seconds = parseFloat(parts[0]);
  } else if (parts.length === 2) {
    const min = parseInt(parts[0], 10);
    const sec = parseFloat(parts[1]);
    if (isNaN(min) || isNaN(sec)) return null;
    seconds = min * 60 + sec;
  } else {
    return null;
  }
  return isNaN(seconds) ? null : seconds;
}

function formatSecondsToTime(seconds: number): string {
  if (seconds < 0 || !isFinite(seconds)) return "--:--";
  const min = Math.floor(seconds / 60);
  const sec = seconds - min * 60;
  return `${min > 0 ? min + ":" : ""}${sec.toFixed(2).padStart(min > 0 ? 5 : 4, "0")}`;
}

export default function PoolLengthTimeConverterCalculator() {
  const [inputs, setInputs] = useState({
    time: "",
    fromPool: "SCY",
    toPool: "LCM",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  }, []);

  const results = useMemo(() => {
    const { time, fromPool, toPool } = inputs;
    if (!time || !fromPool || !toPool) return { value: null, label: "", subtext: "", warning: null, formulaUsed: "" };

    const seconds = parseTimeToSeconds(time);
    if (seconds === null) {
      return { value: null, label: "", subtext: "", warning: "Invalid time format. Use mm:ss.xx or ss.xx", formulaUsed: "" };
    }
    if (fromPool === toPool) {
      return {
        value: formatSecondsToTime(seconds),
        label: `Time in ${fromPool}`,
        subtext: "No conversion needed as pool lengths are the same.",
        warning: null,
        formulaUsed: "No conversion applied.",
      };
    }

    // Apply conversion factor
    const factor = conversionFactors[fromPool][toPool];
    const convertedSeconds = seconds * factor;

    return {
      value: formatSecondsToTime(convertedSeconds),
      label: `Converted Time (${toPool})`,
      subtext: `Converted from ${fromPool} to ${toPool} using factor ${factor.toFixed(3)}.`,
      warning: null,
      formulaUsed: `Converted Time = Input Time × Conversion Factor (${factor.toFixed(3)})`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do swim times differ between SCY, SCM, and LCM pools?",
      answer:
        "Swim times differ because shorter pools (25y or 25m) allow more turns. Each wall push-off generates speed that carries swimmers further than continuous swimming. SCY pools have the most turns per 100 yards, producing the fastest splits. LCM (50m Olympic pools) have the fewest turns, meaning swimmers must sustain speed through open-water stroke — typically resulting in times 3–6% slower than SCY equivalents.",
    },
    {
      question: "How much slower is LCM compared to SCY?",
      answer:
        "On average, LCM times are 3–7% slower than SCY times for the same event. A 100 free in 50.00 SCY typically converts to around 54–56 seconds LCM. The difference is larger for shorter events (more turns per distance) and smaller for longer events like the 1500m. Sprint events like the 50m free see the biggest percentage difference.",
    },
    {
      question: "What is the SCY to SCM conversion factor?",
      answer:
        "The standard SCY to SCM conversion multiplier is approximately 1.1 (adding ~10%). To convert SCM to SCY, multiply by ~0.91. These are approximations — individual turn efficiency, stroke rate, and race tactics all affect real-world differences. USA Swimming's official equivalency calculator uses slightly more granular factors by event.",
    },
    {
      question: "How accurate are the conversion factors?",
      answer:
        "These factors are based on empirical data from thousands of competitive swims and are widely used by coaches and organizations like USA Swimming. They give reliable estimates (within 1–2%) for most swimmers and distances. However, strong turners may outperform the conversion in short course, while weak turners may underperform it.",
    },
    {
      question: "Can I use this for any stroke — freestyle, backstroke, breaststroke, butterfly?",
      answer:
        "Yes. The conversion factors work for all four strokes and individual medley. However, breaststroke and butterfly — which benefit more from underwater pull-outs after turns — tend to show larger differences between short and long course than freestyle and backstroke. The factors used here are best-fit averages across strokes.",
    },
    {
      question: "What is a Short Course Yards (SCY) pool?",
      answer:
        "A Short Course Yards pool is 25 yards (22.86 meters) long. It is the standard for high school and college swimming in the United States. NCAA championships, high school state championships, and most US club meets are held in SCY pools.",
    },
    {
      question: "What is a Long Course Meters (LCM) pool?",
      answer:
        "A Long Course Meters pool is 50 meters long and is the Olympic standard. World Championships, the Olympics, and most international competitions use LCM. In the US, LCM season typically runs from May to August (summer). Times in LCM are used for Olympic qualification standards.",
    },
    {
      question: "How do I enter my swim time in the correct format?",
      answer:
        "Enter time as mm:ss.xx or ss.xx — for example, 1:23.45 for 1 minute 23.45 seconds, or 55.78 for 55.78 seconds. For times under a minute, both formats work. For times over a minute, use the colon format. The calculator parses both automatically.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="time" className="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          Enter Swim Time <Timer className="w-5 h-5 text-blue-600" />
        </Label>
        <Input
          id="time"
          placeholder="e.g. 1:23.45 or 83.45"
          value={inputs.time}
          onChange={(e) => handleInputChange("time", e.target.value)}
          type="text"
          aria-describedby="time-format-desc"
          spellCheck={false}
          autoComplete="off"
        />
        <p id="time-format-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Format: mm:ss.xx or ss.xx (minutes:seconds.hundredths or seconds.hundredths)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="fromPool" className="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            From Pool Length <Waves className="w-5 h-5 text-blue-600" />
          </Label>
          <Select
            id="fromPool"
            value={inputs.fromPool}
            onValueChange={(v) => handleInputChange("fromPool", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pool length" />
            </SelectTrigger>
            <SelectContent>
              {poolTypes.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label htmlFor="toPool" className="mb-1 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            To Pool Length <Flag className="w-5 h-5 text-blue-600" />
          </Label>
          <Select
            id="toPool"
            value={inputs.toPool}
            onValueChange={(v) => handleInputChange("toPool", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select pool length" />
            </SelectTrigger>
            <SelectContent>
              {poolTypes.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => setSubmitted(true)}
          disabled={!inputs.time || !inputs.fromPool || !inputs.toPool}
          aria-label="Calculate converted swim time"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs({ time: "", fromPool: "SCY", toPool: "LCM" });
            setSubmitted(false);
          }}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {submitted && (
        <>
          {results.warning ? (
            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-950 border-red-300 shadow-lg">
              <CardContent className="p-6 text-center text-red-700 dark:text-red-400 font-semibold">
                <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
                {results.warning}
              </CardContent>
            </Card>
          ) : results.value ? (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
                <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
                <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
                <p className="mt-3 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Pool Length Time Converter (SCY/SCM/LCM)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Competitive swimming uses three primary pool formats: <strong>Short Course Yards (SCY)</strong> at 25 yards, <strong>Short Course Meters (SCM)</strong> at 25 meters, and <strong>Long Course Meters (LCM)</strong> at 50 meters. Each format produces different times because the number of wall push-offs (turns) per race differs significantly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A 100-yard SCY race has 3 turns; a 100m LCM race has only 1. Each turn adds roughly 0.5–1.5 seconds of advantage through underwater dolphin kicks and streamline glides. This is why SCY times are fastest, SCM slightly slower, and LCM slowest for equivalent distances.
        </p>
      </section>

      <section id="conversion-table" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">SCY / SCM / LCM Conversion Reference Table</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Use these approximate conversion factors to estimate equivalent times between pool formats. Multiply your time (in seconds) by the factor.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Convert From</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Convert To</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Multiply By</th>
                <th className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">Example (1:00.00)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                ["SCY", "SCM", "× 1.11", "1:06.60"],
                ["SCY", "LCM", "× 1.14", "1:08.40"],
                ["SCM", "SCY", "× 0.90", "0:54.00"],
                ["SCM", "LCM", "× 1.03", "1:01.80"],
                ["LCM", "SCY", "× 0.88", "0:52.80"],
                ["LCM", "SCM", "× 0.97", "0:58.20"],
              ].map(([from, to, factor, ex]) => (
                <tr key={`${from}-${to}`} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300">{from}</td>
                  <td className="px-4 py-2 text-slate-700 dark:text-slate-300">{to}</td>
                  <td className="px-4 py-2 text-blue-700 dark:text-blue-400 font-semibold">{factor}</td>
                  <td className="px-4 py-2 text-slate-600 dark:text-slate-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 mt-2">Factors are approximate averages. Actual differences vary by event, stroke, and swimmer turn efficiency.</p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <ol className="list-decimal pl-5 space-y-3 text-slate-700 dark:text-slate-300">
          <li><strong>Enter your swim time</strong> in mm:ss.xx format (e.g., 1:23.45) or ss.xx (e.g., 55.78 for under a minute).</li>
          <li><strong>Select the pool you swam in</strong> — SCY, SCM, or LCM.</li>
          <li><strong>Select the pool you want to convert to.</strong></li>
          <li><strong>Click Calculate</strong> to see the estimated equivalent time and the conversion factor used.</li>
        </ol>
        <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm">
          Example: A 1:45.00 SCY 200-yard backstroke converts to approximately 1:57.00 LCM 200m — helpful for setting Olympic Trials qualification goals.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips for Cross-Format Swimmers</h2>
        <ul className="list-disc pl-5 space-y-3 text-slate-700 dark:text-slate-300">
          <li><strong>Improve your turns for short course gains.</strong> A 0.3-second improvement in turn time translates directly to your SCY time. Work on breakout distance and underwater dolphin kicks.</li>
          <li><strong>Build LCM endurance separately.</strong> LCM races stress aerobic capacity more. Add longer unbroken swims (200m+) to your training blocks before long course season.</li>
          <li><strong>Use conversions to set season goals.</strong> If your SCY 100 free is 48.5, a converted LCM goal of ~55 seconds is realistic for an equivalent level of fitness.</li>
          <li><strong>Don’t panic about "slow" LCM times.</strong> Almost every swimmer is slower in LCM. The gap closes as you build open-water stroke efficiency.</li>
        </ul>
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
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a href="https://swimswam.com/swim-time-conversion-chart/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              SwimSwam: Swim Time Conversion Chart <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive chart and explanation of swim time conversions between SCY, SCM, and LCM pools, widely used by coaches and swimmers.
            </p>
          </li>
          <li>
            <a href="https://www.usaswimming.org/" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              USA Swimming <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The national governing body for competitive swimming in the United States, providing official rules, conversion standards, and training resources.
            </p>
          </li>
          <li>
            <a href="https://www.fina.org/swimming" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              FINA Swimming Rules and Regulations <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The international federation for swimming, offering official guidelines on pool specifications and competition standards.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pool Length Time Converter (SCY/SCM/LCM)"
      description="Convert swim times between pool lengths. Switch between Short Course Yards, Short Course Meters, and Long Course Meters accurately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Conversion Formula",
        formula: "Converted Time = Input Time × Conversion Factor",
        variables: [
          { symbol: "Input Time", description: "Your original swim time in seconds" },
          { symbol: "Conversion Factor", description: "Multiplier based on pool length conversion" },
          { symbol: "Converted Time", description: "Estimated equivalent time in target pool length" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer completes a 100-yard freestyle in 50.00 seconds in an SCY pool and wants to estimate their equivalent time in a 100-meter long course pool (LCM).",
        steps: [
          { label: "Step 1", explanation: "Input the time: 50.00 seconds." },
          { label: "Step 2", explanation: "Select 'From Pool Length' as SCY." },
          { label: "Step 3", explanation: "Select 'To Pool Length' as LCM." },
          { label: "Step 4", explanation: "Click 'Calculate' to get the converted time." },
        ],
        result: "The calculator shows approximately 57.00 seconds as the equivalent 100m LCM time.",
      }}
      relatedCalculators={[
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "🏆" },
        { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏆" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
      ]}
      onThisPage={[
        { id: "what-is", label: "SCY vs SCM vs LCM" },
        { id: "conversion-table", label: "Conversion Table" },
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