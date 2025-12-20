import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

function parseTimeToSeconds(timeStr) {
  // Accept formats: HH:MM:SS, MM:SS, or SS
  if (!timeStr) return null;
  const parts = timeStr.trim().split(":").map((p) => p.trim());
  if (parts.length === 3) {
    // HH:MM:SS
    const [h, m, s] = parts;
    if (
      isNaN(h) ||
      isNaN(m) ||
      isNaN(s) ||
      +m >= 60 ||
      +s >= 60 ||
      +h < 0 ||
      +m < 0 ||
      +s < 0
    )
      return null;
    return +h * 3600 + +m * 60 + +s;
  } else if (parts.length === 2) {
    // MM:SS
    const [m, s] = parts;
    if (
      isNaN(m) ||
      isNaN(s) ||
      +m < 0 ||
      +s < 0 ||
      +s >= 60
    )
      return null;
    return +m * 60 + +s;
  } else if (parts.length === 1) {
    // SS only
    const s = parts[0];
    if (isNaN(s) || +s < 0) return null;
    return +s;
  }
  return null;
}

function formatSecondsToHMS(seconds) {
  if (seconds == null || isNaN(seconds) || seconds < 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  const hh = h > 0 ? `${h}:` : "";
  const mm = h > 0 ? (m < 10 ? `0${m}` : m) : m;
  const ss = s < 10 ? `0${s}` : s;
  return `${hh}${mm}:${ss}`;
}

const relatedCalculators = [
  {
    title: "Fitness Age Calculator",
    url: "/sports/fitness-age-calculator",
    icon: "🏆",
  },
  {
    title: "Macronutrient Calculator (Sports)",
    url: "/sports/macronutrient-calculator",
    icon: "🏆",
  },
  {
    title: "Golf Handicap Differential & Index",
    url: "/sports/golf-handicap-differential-index",
    icon: "⛳",
  },
  {
    title: "Swim Pace: CSS (Critical Swim Speed) & Splits",
    url: "/sports/swim-pace-css-splits",
    icon: "🏃",
  },
  {
    title: "Target Heart Rate / RPE Zones",
    url: "/sports/target-heart-rate-rpe-zones",
    icon: "🏆",
  },
  {
    title: "Tennis ELO / Rating Progress",
    url: "/sports/tennis-elo-rating-progress",
    icon: "⚽",
  },
];

export default function RaceTimePredictorRiegelCalculator() {
  const [inputs, setInputs] = useState({
    knownDistance: "",
    knownTime: "",
    targetDistance: "",
  });
  const [calculated, setCalculated] = useState(false);

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
    setCalculated(false);
  }, []);

  // Riegel formula: T2 = T1 * (D2 / D1)^1.06
  // T1, T2 in seconds; D1, D2 in same units (km or miles)
  const results = useMemo(() => {
    if (
      !inputs.knownDistance ||
      !inputs.knownTime ||
      !inputs.targetDistance
    )
      return {
        value: "",
        label: "",
        subtext: null,
        warning: null,
        formulaUsed: "",
      };

    const D1 = parseFloat(inputs.knownDistance);
    const D2 = parseFloat(inputs.targetDistance);
    const T1 = parseTimeToSeconds(inputs.knownTime);

    if (
      isNaN(D1) ||
      isNaN(D2) ||
      !T1 ||
      D1 <= 0 ||
      D2 <= 0 ||
      T1 <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: null,
        warning:
          "Please enter valid positive numbers for distances and a valid time format (HH:MM:SS, MM:SS, or SS).",
        formulaUsed: "",
      };
    }

    // Calculate predicted time in seconds
    const exponent = 1.06;
    const T2 = T1 * Math.pow(D2 / D1, exponent);

    // Format predicted time nicely
    const formattedTime = formatSecondsToHMS(T2);

    return {
      value: formattedTime,
      label: `Predicted time for ${D2} km`,
      subtext: `Based on your ${D1} km time of ${formatSecondsToHMS(T1)}`,
      warning: null,
      formulaUsed: `T₂ = T₁ × (D₂ / D₁)^${exponent.toFixed(2)}`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Riegel formula?",
      answer:
        "The Riegel formula is a widely used mathematical model to predict race times for different distances based on a known performance. It assumes that performance decreases at a consistent rate as distance increases, using an exponent typically around 1.06. This formula helps athletes estimate their potential times for races they have not yet run.",
    },
    {
      question: "Can I use this formula for any sport or distance?",
      answer:
        "While the Riegel formula was originally developed for running events, it can be adapted for other endurance sports like cycling or swimming with caution. It is most accurate for distances ranging from 1.5 km to marathon distances. For ultra-distance events or very short sprints, the formula may not provide reliable predictions.",
    },
    {
      question: "How should I input my known time?",
      answer:
        "You can enter your known race time in HH:MM:SS, MM:SS, or SS format. For example, 1:23:45 for 1 hour 23 minutes 45 seconds, 23:45 for 23 minutes 45 seconds, or simply 3600 for 3600 seconds. Make sure to use colons to separate hours, minutes, and seconds as appropriate.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="space-y-4">
          <div>
            <Label htmlFor="knownDistance" className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-blue-600" />
              Known Distance (km)
            </Label>
            <Input
              id="knownDistance"
              type="number"
              min="0"
              step="any"
              placeholder="e.g., 5"
              value={inputs.knownDistance}
              onChange={(e) => handleInputChange("knownDistance", e.target.value)}
              aria-describedby="knownDistanceHelp"
            />
            <p
              id="knownDistanceHelp"
              className="text-xs text-slate-500 dark:text-slate-400 mt-1"
            >
              Enter the distance of your known race in kilometers.
            </p>
          </div>

          <div>
            <Label htmlFor="knownTime" className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-600" />
              Known Time (HH:MM:SS, MM:SS or SS)
            </Label>
            <Input
              id="knownTime"
              type="text"
              placeholder="e.g., 00:23:45"
              value={inputs.knownTime}
              onChange={(e) => handleInputChange("knownTime", e.target.value)}
              aria-describedby="knownTimeHelp"
            />
            <p
              id="knownTimeHelp"
              className="text-xs text-slate-500 dark:text-slate-400 mt-1"
            >
              Enter your finish time for the known distance.
            </p>
          </div>

          <div>
            <Label htmlFor="targetDistance" className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-blue-600" />
              Target Distance (km)
            </Label>
            <Input
              id="targetDistance"
              type="number"
              min="0"
              step="any"
              placeholder="e.g., 10"
              value={inputs.targetDistance}
              onChange={(e) => handleInputChange("targetDistance", e.target.value)}
              aria-describedby="targetDistanceHelp"
            />
            <p
              id="targetDistanceHelp"
              className="text-xs text-slate-500 dark:text-slate-400 mt-1"
            >
              Enter the distance you want to predict your time for.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            onClick={() => setCalculated(true)}
            disabled={
              !inputs.knownDistance ||
              !inputs.knownTime ||
              !inputs.targetDistance
            }
            aria-label="Calculate predicted race time"
          >
            <Trophy className="mr-2 h-4 w-4" aria-hidden="true" /> Calculate
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setInputs({ knownDistance: "", knownTime: "", targetDistance: "" });
              setCalculated(false);
            }}
            className="flex-1 h-11"
            aria-label="Reset inputs"
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Reset
          </Button>
        </div>
      </Card>

      {calculated && results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-live="polite">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {results.subtext}
            </p>
            <p className="mt-3 text-xs italic text-slate-600 dark:text-slate-400">
              Formula used: <code>{results.formulaUsed}</code>
            </p>
          </CardContent>
        </Card>
      )}

      {calculated && results.warning && (
        <Card className="border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700 shadow-md">
          <CardContent className="text-center text-red-700 dark:text-red-300">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" aria-hidden="true" />
            {results.warning}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Race Time Predictor (Riegel Formula)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Race Time Predictor uses the Riegel formula, a scientifically
          validated method to estimate your race time for a target distance based
          on a known performance. This formula accounts for the natural decline in
          pace as race distance increases, using an exponent typically set at
          1.06. It is widely used by runners and endurance athletes to set realistic
          goals and plan training strategies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting your known race distance and finish time, along with the
          distance you want to predict, this calculator provides an estimated finish
          time. This helps athletes gauge their fitness level and prepare for races
          they have not yet attempted. The formula assumes consistent training and
          similar race conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While the Riegel formula is robust for distances between 1.5 km and the
          marathon, predictions for ultra-distance events or very short sprints may
          be less accurate. Always consider individual factors such as terrain,
          weather, and race strategy when interpreting results.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Race Time Predictor, you need to provide three key inputs: your
          known race distance, the time it took you to complete that distance, and
          the target distance for which you want to predict your finish time. The
          calculator will then apply the Riegel formula to estimate your performance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Enter your known race distance in kilometers. This should be a positive
            number representing a race you have completed.
          </li>
          <li>
            Input your finish time for that race in HH:MM:SS, MM:SS, or SS format.
            For example, 1:23:45 for 1 hour 23 minutes 45 seconds.
          </li>
          <li>
            Enter the target distance in kilometers for which you want to predict
            your race time.
          </li>
          <li>
            Click the &quot;Calculate&quot; button to see your predicted finish time
            for the target distance.
          </li>
          <li>
            Use the &quot;Reset&quot; button to clear inputs and start a new
            calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips &amp; Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To improve your race times and make the most of predictions, focus on
          structured training that balances endurance, speed, and recovery. Incorporate
          interval training and tempo runs to enhance your lactate threshold and
          running economy. Consistency is key; gradual increases in training volume
          and intensity reduce injury risk and improve performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Nutrition and hydration strategies tailored to your race distance and
          conditions also play a critical role in achieving predicted times. Remember
          that external factors such as weather, terrain, and race-day conditions can
          affect your actual performance, so use predictions as a guide rather than a
          guarantee.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, regularly update your known race times to refine predictions and
          track your progress over time. This approach helps you set realistic goals
          and stay motivated throughout your training cycle.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References &amp; Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, endurance performance, and
          exercise physiology, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science,
              providing research, guidelines, and certifications for fitness
              professionals.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA){" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NSCA offers evidence-based resources on strength, conditioning,
              and endurance training for athletes and coaches.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/training/a20803157/riegel-formula/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner&apos;s World: Understanding the Riegel Formula{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical explanation of the Riegel formula and its application for
              runners of all levels.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Race Time Predictor (Riegel Formula)"
      description="Predict your race time for any distance. Use the Riegel formula to estimate performance based on a previous race result."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Riegel Formula",
        formula: "T₂ = T₁ × (D₂ / D₁)^1.06",
        variables: [
          {
            symbol: "T₁",
            description: "Known race time (seconds)",
          },
          {
            symbol: "D₁",
            description: "Known race distance (kilometers)",
          },
          {
            symbol: "T₂",
            description: "Predicted race time (seconds)",
          },
          {
            symbol: "D₂",
            description: "Target race distance (kilometers)",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You ran a 5 km race in 23 minutes and 45 seconds. You want to predict your time for a 10 km race.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input your known distance: 5 km, and your known time: 00:23:45.",
          },
          {
            label: "Step 2",
            explanation: "Enter your target distance: 10 km.",
          },
          {
            label: "Step 3",
            explanation:
              "Click Calculate. The calculator applies the Riegel formula to estimate your 10 km finish time.",
          },
        ],
        result:
          "The predicted 10 km time is approximately 00:50:21, based on your 5 km performance.",
      }}
      relatedCalculators={relatedCalculators}
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