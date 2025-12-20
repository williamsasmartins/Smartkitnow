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
        "Swim times differ between Short Course Yards (SCY), Short Course Meters (SCM), and Long Course Meters (LCM) pools primarily due to the pool length and number of turns. SCY pools are 25 yards long, SCM pools are 25 meters, and LCM pools are 50 meters. More turns in shorter pools allow swimmers to push off the wall more frequently, which generally results in faster times. Therefore, times in SCY pools are usually faster than SCM and LCM pools for the same distance.",
    },
    {
      question: "How accurate are the conversion factors used in this calculator?",
      answer:
        "The conversion factors used are based on widely accepted standards from USA Swimming and international swimming organizations. They provide a close approximation of equivalent times between pool lengths but are not exact due to individual swimmer technique, turn efficiency, and other variables. These factors are best used for estimating and comparing performances rather than official record conversions.",
    },
    {
      question: "Can I convert times for any swimming event using this calculator?",
      answer:
        "This calculator is designed for standard pool lengths and typical swim events. While it works well for most freestyle, backstroke, breaststroke, and butterfly events, some specialized events or distances may have slightly different conversion nuances. For official conversions, always refer to governing body guidelines or official conversion charts.",
    },
    {
      question: "What is the best way to input my swim time for accurate conversion?",
      answer:
        "Input your swim time in the format mm:ss.xx (minutes:seconds.hundredths) or ss.xx (seconds.hundredths) for best accuracy. For example, '1:23.45' for one minute, twenty-three seconds, and forty-five hundredths, or '83.45' seconds. Avoid ambiguous formats to ensure the calculator parses your time correctly.",
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
          Swimming competitions are held in pools of varying lengths, primarily Short Course Yards (SCY), Short Course Meters (SCM), and Long Course Meters (LCM). Each pool length affects swim times differently due to the number of turns and push-offs a swimmer can perform. SCY pools, commonly used in the United States, are 25 yards long, while SCM pools are 25 meters, and LCM pools are 50 meters long, the Olympic standard.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Because turns provide an opportunity for swimmers to gain speed by pushing off the wall, times in shorter pools (SCY and SCM) are generally faster than in LCM pools. This discrepancy makes direct comparison of swim times across different pool lengths challenging. Coaches, athletes, and analysts often need to convert times to a common pool length to evaluate performance accurately.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Pool Length Time Converter uses established conversion factors to estimate equivalent swim times between SCY, SCM, and LCM pools. These factors are derived from empirical data and swimming performance research, providing a reliable tool for comparing times across different pool formats. Understanding these conversions helps swimmers set realistic goals and track progress effectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While conversion factors provide useful estimates, individual swimmer characteristics such as turn efficiency, stroke technique, and pacing strategy can influence actual performance differences between pool lengths. Therefore, these conversions should be used as guidelines rather than absolute measures.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to convert swim times between Short Course Yards (SCY), Short Course Meters (SCM), and Long Course Meters (LCM) pools quickly and accurately. To use it, you need to input your swim time and specify the pool length you swam in and the pool length you want to convert to.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The time input accepts formats such as minutes and seconds with hundredths (e.g., 1:23.45) or just seconds with hundredths (e.g., 83.45). Ensure your input is clear and correctly formatted to avoid errors. Select the pool length you swam in under "From Pool Length" and the pool length you want to convert to under "To Pool Length."
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering your data, click the "Calculate" button to see the converted time. The result will display the estimated equivalent time in the target pool length, along with the conversion factor used. If you want to start over, use the "Reset" button to clear all inputs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Enter your swim time in the format mm:ss.xx or ss.xx.</li>
          <li>Step 2: Select the pool length you swam in (SCY, SCM, or LCM).</li>
          <li>Step 3: Select the pool length you want to convert your time to.</li>
          <li>Step 4: Click "Calculate" to view the converted time.</li>
          <li>Step 5: Use "Reset" to clear inputs and perform another conversion.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When training across different pool lengths, it’s important to understand how your pacing and turns affect your overall swim time. Short course pools (SCY and SCM) require more turns, so practicing efficient turns and underwater kicks can significantly improve your times. Focus on maximizing your push-offs and streamline position to gain speed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For long course meters (LCM) training, endurance and maintaining consistent stroke technique over longer distances without turns are critical. Incorporate sets that simulate race pace and build aerobic capacity to sustain speed in the longer pool format.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Use the conversion calculator to set realistic goals when transitioning between pool lengths. For example, if you have a target time in an LCM pool, convert it to SCM or SCY to tailor your training sets accordingly. This approach helps maintain motivation and track progress effectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Lastly, remember that individual differences in turn technique and stroke efficiency mean that conversion times are estimates. Regularly test yourself in the target pool length to adjust your training and expectations based on actual performance.
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