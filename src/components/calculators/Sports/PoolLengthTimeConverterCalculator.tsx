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

const POOL_TYPES = {
  SCY: "Short Course Yards (25 yards)",
  SCM: "Short Course Meters (25 meters)",
  LCM: "Long Course Meters (50 meters)",
};

/**
 * Conversion factors and formulas are based on empirical data and accepted conversion standards
 * used by USA Swimming and FINA. These conversions account for differences in pool length and turns,
 * which affect swim times.
 *
 * Source references:
 * - USA Swimming conversion charts
 * - FINA rules and guidelines
 * - Research on swimming performance metrics
 */

function convertTime(timeSeconds, from, to) {
  // If same pool type, no conversion needed
  if (from === to) return timeSeconds;

  // Conversion multipliers derived from USA Swimming and FINA conversion tables
  // These are approximate and may vary by event and swimmer's style.
  // The multipliers reflect the average time difference due to pool length and turns.
  // For example, SCY times are generally faster than SCM due to shorter length and more turns.

  // Base multipliers matrix: from -> to
  const multipliers = {
    SCY: { SCM: 1.11, LCM: 1.14 },
    SCM: { SCY: 0.90, LCM: 1.03 },
    LCM: { SCY: 0.88, SCM: 0.97 },
  };

  const factor = multipliers[from]?.[to];
  if (!factor) return null; // Unsupported conversion

  return timeSeconds * factor;
}

function parseTimeToSeconds(timeStr) {
  // Accepts formats: mm:ss.xx or ss.xx or mm:ss or ss
  // Returns total seconds as float
  if (!timeStr) return null;
  const parts = timeStr.split(":").map((p) => p.trim());
  if (parts.length === 1) {
    // Only seconds
    const s = parseFloat(parts[0]);
    return isNaN(s) ? null : s;
  }
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const s = parseFloat(parts[1]);
    if (isNaN(m) || isNaN(s)) return null;
    return m * 60 + s;
  }
  return null;
}

function formatSecondsToTime(seconds) {
  if (seconds == null || isNaN(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, "0")}`;
}

export default function PoolLengthTimeConverterCalculator() {
  const [inputs, setInputs] = useState({
    time: "",
    fromPool: "SCY",
    toPool: "LCM",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const { time, fromPool, toPool } = inputs;
    const timeInSeconds = parseTimeToSeconds(time);
    if (timeInSeconds == null) {
      return {
        value: null,
        label: "Invalid input time",
        subtext: "Please enter a valid time format (e.g., 1:23.45 or 83.45 seconds).",
        warning: true,
        formulaUsed: "",
      };
    }
    if (!fromPool || !toPool) {
      return {
        value: null,
        label: "Select pool types",
        subtext: "Please select both source and target pool lengths.",
        warning: true,
        formulaUsed: "",
      };
    }
    const converted = convertTime(timeInSeconds, fromPool, toPool);
    if (converted == null) {
      return {
        value: null,
        label: "Conversion not supported",
        subtext: "Conversion between selected pool types is not supported.",
        warning: true,
        formulaUsed: "",
      };
    }
    return {
      value: formatSecondsToTime(converted),
      label: `Converted Time (${POOL_TYPES[toPool]})`,
      subtext: `Converted from ${POOL_TYPES[fromPool]} time of ${formatSecondsToTime(timeInSeconds)}.`,
      warning: null,
      formulaUsed: `Converted Time = Input Time × Conversion Factor (${convertTime.name})`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why do swim times differ between SCY, SCM, and LCM pools?",
      answer:
        "Swim times vary due to differences in pool length and the number of turns. Short Course Yards (SCY) pools are 25 yards long, Short Course Meters (SCM) pools are 25 meters, and Long Course Meters (LCM) pools are 50 meters. More turns in shorter pools can lead to faster times because swimmers push off the wall more frequently, gaining momentum.",
    },
    {
      question: "How accurate are these time conversions?",
      answer:
        "These conversions are based on empirical data and accepted standards from USA Swimming and FINA. While they provide a reliable estimate, individual swimmer technique, stroke efficiency, and turn speed can cause variations. Always consider these conversions as approximate guides rather than exact predictions.",
    },
    {
      question: "Can I convert times for all swimming events using this calculator?",
      answer:
        "This calculator provides general conversions applicable to most freestyle, backstroke, breaststroke, and butterfly events. However, some specialized events or distances may have slightly different conversion factors. For official conversions, consult governing bodies or event-specific conversion charts.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="time" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <Timer /> Enter Swim Time (mm:ss.ss or ss.ss)
        </Label>
        <Input
          id="time"
          type="text"
          placeholder="e.g. 1:23.45 or 83.45"
          value={inputs.time}
          onChange={(e) => handleInputChange("time", e.target.value)}
          aria-describedby="timeHelp"
        />
        <p id="timeHelp" className="text-sm text-slate-500 dark:text-slate-400">
          Input your swim time in minutes and seconds or just seconds.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="fromPool" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <Flag /> From Pool Length
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
              {Object.entries(POOL_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Label htmlFor="toPool" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <Flag /> To Pool Length
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
              {Object.entries(POOL_TYPES).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ time: "", fromPool: "SCY", toPool: "LCM" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card
          className={`${
            results.warning
              ? "bg-red-50 border-red-200"
              : "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200"
          } dark:from-slate-900 dark:to-slate-950 dark:border-blue-900 shadow-lg`}
        >
          <CardContent className="p-8 text-center">
            <p
              className={`text-5xl font-extrabold ${
                results.warning ? "text-red-700 dark:text-red-400" : "text-blue-900 dark:text-white"
              }`}
            >
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-300">{results.label}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{results.subtext}</p>
          </CardContent>
        </Card>
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
          Competitive swimming is conducted in pools of varying lengths: Short Course Yards (SCY), Short Course Meters (SCM),
          and Long Course Meters (LCM). Each pool length affects swim times due to differences in distance and the number of turns.
          Turns provide swimmers with an opportunity to push off the wall, gaining speed and momentum, which generally results in faster times
          in shorter pools. This converter helps athletes, coaches, and enthusiasts accurately translate swim times between these pool formats,
          facilitating performance comparisons and training adjustments.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The conversion factors used are derived from extensive empirical data collected by USA Swimming and FINA, the international swimming federation.
          These factors consider the biomechanical and physiological impacts of pool length differences, ensuring that converted times reflect realistic performance expectations.
          While individual swimmer characteristics may cause slight variations, this tool offers a scientifically grounded baseline for time conversion.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed for accuracy. Begin by entering your swim time in a recognized format such as minutes and seconds (e.g., 1:23.45) or total seconds (e.g., 83.45). Next, select the pool length where the original time was recorded (SCY, SCM, or LCM) and then select the pool length to which you want to convert the time.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your swim time in the input field. Ensure the format is correct to avoid errors.
          </li>
          <li>
            <strong>Step 2:</strong> Select the source pool length from which the time was recorded.
          </li>
          <li>
            <strong>Step 3:</strong> Select the target pool length to convert your time into.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to see the converted swim time displayed below.
          </li>
          <li>
            <strong>Step 5:</strong> Use the "Reset" button to clear inputs and start a new conversion.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When training across different pool lengths, understanding how your times translate can help tailor your workouts and race strategies. Short course pools (SCY/SCM) emphasize turns and underwater phases, so swimmers should focus on improving turns and underwater dolphin kicks to maximize speed. Conversely, long course meters (LCM) require sustained speed and endurance, as there are fewer turns and longer swimming distances between walls.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Incorporate pool-specific drills into your training regimen to optimize performance. For example, practice breakout speed and streamline position for short course, and build aerobic capacity and stroke efficiency for long course. Using this converter, coaches can set realistic goals and benchmarks when transitioning swimmers between pool formats, ensuring training remains targeted and effective.
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
          For more information on swimming performance, pool length conversions, and training science, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
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
              The national governing body for competitive swimming in the United States, providing official conversion charts and performance standards.
            </p>
          </li>
          <li>
            <a
              href="https://www.fina.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FINA (Fédération Internationale de Natation) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The international federation recognized by the International Olympic Committee for administering international competition in water sports.
            </p>
          </li>
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine (ACSM) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A global leader in sports medicine and exercise science research, offering insights into training adaptations and performance metrics.
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
          { symbol: "Input Time", description: "Original swim time in seconds" },
          { symbol: "Conversion Factor", description: "Multiplier based on pool length conversion" },
          { symbol: "Converted Time", description: "Estimated swim time in target pool length" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer records a time of 1:00.00 in a Short Course Yards (SCY) pool and wants to estimate their equivalent time in a Long Course Meters (LCM) pool.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert 1:00.00 to total seconds: 60 seconds.",
          },
          {
            label: "Step 2",
            explanation:
              "Identify the conversion factor from SCY to LCM, which is approximately 1.14.",
          },
          {
            label: "Step 3",
            explanation: "Multiply the original time by the conversion factor: 60 × 1.14 = 68.4 seconds.",
          },
          {
            label: "Step 4",
            explanation: "Convert 68.4 seconds back to minutes and seconds: 1:08.40.",
          },
        ],
        result: "The estimated equivalent time in a Long Course Meters pool is 1:08.40.",
      }}
      relatedCalculators={[
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
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