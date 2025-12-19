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

const DISTANCE_UNITS = [
  { label: "Meters (m)", value: "m" },
  { label: "Kilometers (km)", value: "km" },
  { label: "Miles (mi)", value: "mi" },
];

function convertDistanceToMeters(distance, unit) {
  if (!distance || isNaN(distance)) return null;
  switch (unit) {
    case "m":
      return distance;
    case "km":
      return distance * 1000;
    case "mi":
      return distance * 1609.344;
    default:
      return null;
  }
}

function convertMetersToUnit(meters, unit) {
  if (meters == null || isNaN(meters)) return null;
  switch (unit) {
    case "m":
      return meters;
    case "km":
      return meters / 1000;
    case "mi":
      return meters / 1609.344;
    default:
      return null;
  }
}

function parseTimeToSeconds(timeStr) {
  // Accept formats: HH:MM:SS, MM:SS, SS, or decimal seconds
  if (!timeStr) return null;
  const parts = timeStr.trim().split(":").map((p) => p.trim());
  if (parts.length === 1) {
    // Could be seconds or decimal seconds
    const val = parseFloat(parts[0]);
    return isNaN(val) ? null : val;
  }
  if (parts.length === 2) {
    // MM:SS
    const m = parseInt(parts[0], 10);
    const s = parseFloat(parts[1]);
    if (isNaN(m) || isNaN(s)) return null;
    return m * 60 + s;
  }
  if (parts.length === 3) {
    // HH:MM:SS
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const s = parseFloat(parts[2]);
    if (isNaN(h) || isNaN(m) || isNaN(s)) return null;
    return h * 3600 + m * 60 + s;
  }
  return null;
}

function formatSecondsToHMS(seconds) {
  if (seconds == null || isNaN(seconds) || seconds < 0) return "--:--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RaceTimePredictorRiegelCalculator() {
  const [inputs, setInputs] = useState({
    knownDistance: "",
    knownDistanceUnit: "km",
    knownTime: "",
    predictDistance: "",
    predictDistanceUnit: "km",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const {
      knownDistance,
      knownDistanceUnit,
      knownTime,
      predictDistance,
      predictDistanceUnit,
    } = inputs;

    // Validate inputs
    if (
      !knownDistance ||
      !knownTime ||
      !predictDistance ||
      isNaN(parseFloat(knownDistance)) ||
      isNaN(parseFloat(predictDistance))
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid numeric values for distances and time.",
        formulaUsed: "T2 = T1 × (D2 / D1)^1.06",
      };
    }

    // Convert distances to meters
    const D1 = convertDistanceToMeters(parseFloat(knownDistance), knownDistanceUnit);
    const D2 = convertDistanceToMeters(parseFloat(predictDistance), predictDistanceUnit);

    if (D1 == null || D2 == null) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Invalid distance units or values.",
        formulaUsed: "T2 = T1 × (D2 / D1)^1.06",
      };
    }

    // Parse known time to seconds
    const T1 = parseTimeToSeconds(knownTime);
    if (T1 == null) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter a valid known time (HH:MM:SS, MM:SS, or seconds).",
        formulaUsed: "T2 = T1 × (D2 / D1)^1.06",
      };
    }

    // Riegel formula exponent
    const exponent = 1.06;

    // Calculate predicted time in seconds
    const T2 = T1 * Math.pow(D2 / D1, exponent);

    // Format predicted time to HH:MM:SS or MM:SS
    const formattedTime = formatSecondsToHMS(T2);

    // Provide subtext with explanation
    const subtext = `Predicted time for ${predictDistance} ${predictDistanceUnit} based on your known time of ${knownTime} for ${knownDistance} ${knownDistanceUnit}.`;

    return {
      value: formattedTime,
      label: "Predicted Race Time",
      subtext,
      warning: null,
      formulaUsed: `T2 = T1 × (D2 / D1)^${exponent}`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Riegel formula and how accurate is it?",
      answer:
        "The Riegel formula is a widely used mathematical model to predict race times for different distances based on a known performance. It assumes a consistent fatigue factor represented by the exponent (commonly 1.06). While it provides a reliable estimate for endurance events, individual variations such as training, terrain, and conditions can affect accuracy.",
    },
    {
      question: "Can I use this calculator for any race distance?",
      answer:
        "Yes, the calculator supports any race distance, converting units between meters, kilometers, and miles. However, the Riegel formula is most accurate for distances ranging from 1500 meters to marathon distances. Predictions for very short sprints or ultra-marathons may be less precise.",
    },
    {
      question: "How should I input my known time?",
      answer:
        "You can enter your known race time in several formats: HH:MM:SS (e.g., 1:23:45), MM:SS (e.g., 35:30), or just seconds (e.g., 2100). The calculator will parse these formats and convert them internally for prediction.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="knownDistance" className="flex items-center gap-2">
            Known Distance <Flag className="w-4 h-4 text-blue-600" />
          </Label>
          <div className="flex gap-2">
            <Input
              id="knownDistance"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 10"
              value={inputs.knownDistance}
              onChange={(e) => handleInputChange("knownDistance", e.target.value)}
              aria-describedby="knownDistanceHelp"
            />
            <Select
              value={inputs.knownDistanceUnit}
              onValueChange={(v) => handleInputChange("knownDistanceUnit", v)}
            >
              <SelectTrigger aria-label="Known distance unit">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {DISTANCE_UNITS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p id="knownDistanceHelp" className="text-xs text-slate-500 mt-1">
            Enter the distance of your known race.
          </p>
        </div>

        <div>
          <Label htmlFor="knownTime" className="flex items-center gap-2">
            Known Time <Timer className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="knownTime"
            type="text"
            placeholder="HH:MM:SS or MM:SS or seconds"
            value={inputs.knownTime}
            onChange={(e) => handleInputChange("knownTime", e.target.value)}
            aria-describedby="knownTimeHelp"
          />
          <p id="knownTimeHelp" className="text-xs text-slate-500 mt-1">
            Enter your known race time in a valid format.
          </p>
        </div>

        <div>
          <Label htmlFor="predictDistance" className="flex items-center gap-2">
            Predict Distance <Flag className="w-4 h-4 text-green-600" />
          </Label>
          <div className="flex gap-2">
            <Input
              id="predictDistance"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 21.1"
              value={inputs.predictDistance}
              onChange={(e) => handleInputChange("predictDistance", e.target.value)}
              aria-describedby="predictDistanceHelp"
            />
            <Select
              value={inputs.predictDistanceUnit}
              onValueChange={(v) => handleInputChange("predictDistanceUnit", v)}
            >
              <SelectTrigger aria-label="Predict distance unit">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {DISTANCE_UNITS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p id="predictDistanceHelp" className="text-xs text-slate-500 mt-1">
            Enter the race distance you want to predict your time for.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate predicted race time"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              knownDistance: "",
              knownDistanceUnit: "km",
              knownTime: "",
              predictDistance: "",
              predictDistanceUnit: "km",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300 shadow-md">
          <CardContent className="p-4 text-center flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <p>{results.warning}</p>
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-live="polite">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">{results.subtext}</p>
            <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-600">
              Formula used: <code>{results.formulaUsed}</code>
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
          Understanding Race Time Predictor (Riegel Formula)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Riegel formula, developed by Peter Riegel in 1977, is a seminal model in endurance sports science used to predict race times across different distances based on a known performance. It mathematically accounts for the nonlinear increase in fatigue and energy expenditure as race distance increases, using an exponent typically set around 1.06. This formula has been extensively validated in running and cycling, providing athletes and coaches with a reliable tool to estimate achievable times and set realistic goals. While it simplifies complex physiological factors, its ease of use and reasonable accuracy make it a cornerstone in performance prediction.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula is expressed as: <br />
          <code>T2 = T1 × (D2 / D1)^1.06</code>, where T1 and D1 are the known time and distance, and T2 and D2 are the predicted time and distance respectively. The exponent 1.06 reflects the typical fatigue rate observed in endurance events but can vary slightly depending on the athlete’s conditioning and race conditions. This calculator allows you to input your known race performance and predict your time for any other distance, facilitating smarter training and race planning.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately predict your race time for a new distance, you need to provide a known race distance and the time you completed it in. This known performance serves as the baseline for the Riegel formula calculation. You then specify the distance you want to predict your time for. The calculator supports multiple units for convenience, including meters, kilometers, and miles.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your known race distance and select the appropriate unit (meters, kilometers, or miles).
          </li>
          <li>
            <strong>Step 2:</strong> Input your known race time in a supported format such as HH:MM:SS, MM:SS, or total seconds.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the distance you want to predict your time for and select its unit.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see your predicted race time based on the Riegel formula.
          </li>
          <li>
            <strong>Step 5:</strong> Use the predicted time to guide your training goals and race pacing strategies.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While the Riegel formula provides a useful prediction, it is essential to remember that individual performance can vary due to factors such as terrain, weather, nutrition, and training status. To optimize your race outcomes, incorporate interval training, tempo runs, and long endurance sessions tailored to your target distance. Monitoring your progress with periodic time trials can help recalibrate predictions and adjust training loads accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, consider recovery and tapering strategies as you approach race day to ensure peak performance. Using this calculator in conjunction with physiological metrics such as VO2max and lactate threshold can provide a more comprehensive training framework. Always listen to your body and adjust your training intensity to avoid overtraining and injury.
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
          For more information on training science, endurance performance, and race prediction models, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for endurance training and performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Runner's World offers practical advice, training plans, and scientific insights tailored to runners of all levels, including race prediction and pacing strategies.
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
              The NSCA provides research and certification in strength and conditioning, including endurance training methodologies and performance optimization.
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
          { symbol: "T₁", description: "Known race time" },
          { symbol: "D₁", description: "Known race distance" },
          { symbol: "T₂", description: "Predicted race time" },
          { symbol: "D₂", description: "Predicted race distance" },
          { symbol: "1.06", description: "Fatigue exponent (typical value)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You ran a 10 km race in 50 minutes and want to predict your half marathon (21.1 km) time.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input your known distance as 10 km and your time as 50:00.",
          },
          {
            label: "Step 2",
            explanation: "Set the predicted distance to 21.1 km (half marathon).",
          },
          {
            label: "Step 3",
            explanation:
              "Click Calculate to get your predicted half marathon time using the Riegel formula.",
          },
        ],
        result: "Predicted time: approximately 1:50:30 (1 hour, 50 minutes, and 30 seconds).",
      }}
      relatedCalculators={[
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
        { title: "Bowling Score Calculator", url: "/sports/bowling-score-calculator", icon: "🏆" },
        { title: "Basketball eFG% & TS% Calculator", url: "/sports/basketball-efg-ts", icon: "⚽" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
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