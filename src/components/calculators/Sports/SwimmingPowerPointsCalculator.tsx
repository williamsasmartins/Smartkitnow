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

const relatedCalculators = [
  { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
  { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
  { title: "Basketball eFG% & TS% Calculator", url: "/sports/basketball-efg-ts", icon: "⚽" },
  { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
  { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
  { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" }
];

// Swimming power points are calculated to compare performances across different swimming events and distances.
// The FINA points system is a widely accepted method to assign points based on swim times relative to world records.
// The formula used here approximates the FINA points calculation:
// Points = 1000 * (World Record Time / Swimmer's Time) ^ 3

// World record times (in seconds) for selected events (LCM - Long Course Meters)
const worldRecords = {
  "50m Freestyle": 20.91,
  "100m Freestyle": 46.91,
  "200m Freestyle": 101.97,
  "400m Freestyle": 214.04,
  "800m Freestyle": 427.71,
  "1500m Freestyle": 871.11,
  "50m Backstroke": 24.00,
  "100m Backstroke": 51.85,
  "200m Backstroke": 112.19,
  "50m Breaststroke": 25.95,
  "100m Breaststroke": 56.88,
  "200m Breaststroke": 127.41,
  "50m Butterfly": 22.27,
  "100m Butterfly": 49.45,
  "200m Butterfly": 98.71,
  "200m Individual Medley": 112.33,
  "400m Individual Medley": 256.68,
};

export default function SwimmingPowerPointsCalculator() {
  const [inputs, setInputs] = useState({
    event: "100m Freestyle",
    timeMinutes: "",
    timeSeconds: "",
    timeHundredths: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate total time in seconds
  const totalTimeSeconds = useMemo(() => {
    const min = parseInt(inputs.timeMinutes, 10);
    const sec = parseInt(inputs.timeSeconds, 10);
    const hun = parseInt(inputs.timeHundredths, 10);
    if (
      isNaN(min) && isNaN(sec) && isNaN(hun)
    ) return null;

    const minutes = isNaN(min) ? 0 : min;
    const seconds = isNaN(sec) ? 0 : sec;
    const hundredths = isNaN(hun) ? 0 : hun;

    return minutes * 60 + seconds + hundredths / 100;
  }, [inputs.timeMinutes, inputs.timeSeconds, inputs.timeHundredths]);

  // Calculate points using FINA formula approximation
  const results = useMemo(() => {
    if (!totalTimeSeconds || totalTimeSeconds <= 0) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter a valid swim time greater than 0.",
        formulaUsed: "",
      };
    }
    const wrTime = worldRecords[inputs.event];
    if (!wrTime) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "World record time for selected event is unavailable.",
        formulaUsed: "",
      };
    }
    // FINA points formula: Points = 1000 * (WR / Time)^3
    const ratio = wrTime / totalTimeSeconds;
    if (ratio <= 0) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Invalid time ratio calculated.",
        formulaUsed: "",
      };
    }
    const pointsRaw = 1000 * Math.pow(ratio, 3);
    const points = Math.round(pointsRaw);

    let subtext = `Based on the FINA points system comparing your time to the world record (${wrTime.toFixed(2)} seconds).`;
    let warning = null;
    if (points > 1200) {
      warning = "Points &gt; 1200 are extremely rare and indicate a world-class or better performance.";
    } else if (points &lt; 100) {
      warning = "Points &lt; 100 indicate a beginner or recreational level performance.";
    }

    return {
      value: points.toLocaleString(),
      label: "Swimming Power Points",
      subtext,
      warning,
      formulaUsed: "Points = 1000 × (World Record Time / Your Time)³",
    };
  }, [inputs.event, totalTimeSeconds]);

  const faqs = [
    {
      question: "What are Swimming Power Points?",
      answer:
        "Swimming Power Points are a standardized scoring system that allows swimmers and coaches to compare performances across different events and distances. " +
        "They are calculated relative to world record times, providing an objective measure of performance quality. " +
        "This system is widely used in competitive swimming to rank and evaluate swimmers fairly.",
    },
    {
      question: "Why use the FINA points system formula?",
      answer:
        "The FINA points system is the official method endorsed by the International Swimming Federation (FINA) to evaluate swimming performances. " +
        "It uses a cubic relationship between world record times and swim times to assign points, emphasizing improvements near world record levels. " +
        "This makes it a reliable and recognized standard for performance comparison.",
    },
    {
      question: "Can I use this calculator for short course events?",
      answer:
        "This calculator uses long course meters (LCM) world record times for accuracy and consistency. " +
        "Short course (SCY or SCM) times differ due to pool length and turns, so results may not be directly comparable. " +
        "For short course events, consider using a dedicated short course points calculator or convert times accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Label htmlFor="event" className="mb-1 flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
            <Waves className="w-4 h-4 text-blue-600" /> Select Swimming Event
          </Label>
          <Select
            value={inputs.event}
            onValueChange={(v) => handleInputChange("event", v)}
            aria-label="Select swimming event"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select event" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(worldRecords).map((event) => (
                <SelectItem key={event} value={event}>
                  {event}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Label htmlFor="time" className="mb-1 flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
            <Timer className="w-4 h-4 text-blue-600" /> Enter Your Swim Time (LCM)
          </Label>
          <div className="flex gap-3 max-w-xs">
            <Input
              id="timeMinutes"
              type="number"
              min="0"
              step="1"
              placeholder="Minutes"
              value={inputs.timeMinutes}
              onChange={(e) => handleInputChange("timeMinutes", e.target.value)}
              aria-label="Minutes"
            />
            <Input
              id="timeSeconds"
              type="number"
              min="0"
              max="59"
              step="1"
              placeholder="Seconds"
              value={inputs.timeSeconds}
              onChange={(e) => handleInputChange("timeSeconds", e.target.value)}
              aria-label="Seconds"
            />
            <Input
              id="timeHundredths"
              type="number"
              min="0"
              max="99"
              step="1"
              placeholder="Hundredths"
              value={inputs.timeHundredths}
              onChange={(e) => handleInputChange("timeHundredths", e.target.value)}
              aria-label="Hundredths of a second"
            />
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter your swim time in minutes, seconds, and hundredths of a second.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate swimming power points"
        >
          <Trophy className="mr-2 h-4 w-4" aria-hidden="true" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              event: "100m Freestyle",
              timeMinutes: "",
              timeSeconds: "",
              timeHundredths: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white" aria-live="polite" aria-atomic="true">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" /> {results.warning}
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
          Understanding Swimming Power Points Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Swimming Power Points provide a standardized metric to evaluate and compare swimming performances across different events and distances. This is essential because raw swim times cannot be directly compared due to varying event lengths and stroke types. By referencing world record times, the calculator assigns points that reflect the quality of a swim relative to the best performances globally. This approach helps swimmers, coaches, and analysts objectively assess progress and competitive standing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The points are calculated using a cubic formula, which emphasizes improvements near world record times more heavily than slower times. This non-linear scaling ensures that elite performances receive significantly higher points, reflecting their exceptional nature. The system is widely adopted in competitive swimming, including by FINA, the international governing body for aquatic sports.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator uses long course meters (LCM) world record times to maintain consistency and accuracy. Users should note that short course times (SCY or SCM) differ due to pool length and number of turns, which affect swim times and thus points.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To calculate your swimming power points, first select the swimming event that matches your performance. Then, enter your swim time in minutes, seconds, and hundredths of a second. The calculator will use the official world record time for that event to compute your points using the FINA points formula. This score allows you to compare your swim against other events or swimmers objectively.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Select the event from the dropdown menu. Events include freestyle, backstroke, breaststroke, butterfly, and individual medley distances.
          </li>
          <li>
            Input your swim time accurately in the three fields: minutes, seconds, and hundredths of a second.
          </li>
          <li>
            Click the &quot;Calculate&quot; button to see your swimming power points displayed prominently.
          </li>
          <li>
            Use the &quot;Reset&quot; button to clear inputs and start a new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To improve your swimming power points, focus on consistent training that enhances both aerobic capacity and anaerobic power. Incorporate interval training, technique drills, and strength conditioning to optimize stroke efficiency and speed. Remember that improvements &gt; 1% near elite levels can significantly increase your points due to the cubic scaling of the formula. Tracking your points over time can help you identify progress and adjust your training plan accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, pay attention to race strategy, starts, turns, and finishes, as these can shave crucial fractions of a second off your time. Nutrition, recovery, and mental preparation also play vital roles in achieving peak performance. Use this calculator regularly to benchmark your swims and set realistic goals that push you closer to world-class standards.
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
          For more information on swimming performance metrics, training science, and official rules, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletic performance.
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
              The national governing body for competitive swimming in the United States, offering resources on training, technique, and competition standards.
            </p>
          </li>
          <li>
            <a
              href="https://www.fina.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FINA (International Swimming Federation) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The international authority for aquatic sports, responsible for world records, rules, and the official points system used in this calculator.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Swimming Power Points Calculator"
      description="Calculate swimming power points. Compare performances across different events and distances using standardized scoring tables."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Points = 1000 × (World Record Time / Your Time)³",
        variables: [
          { symbol: "Points", description: "Swimming power points scored" },
          { symbol: "World Record Time", description: "Official world record time for the selected event (seconds)" },
          { symbol: "Your Time", description: "Your swim time in seconds" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer completes the 100m freestyle in 55.32 seconds. The world record for this event is 46.91 seconds. Using the calculator, we compute the swimming power points to evaluate the swimmer's performance.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select '100m Freestyle' from the event dropdown menu.",
          },
          {
            label: "Step 2",
            explanation: "Enter the swim time as 0 minutes, 55 seconds, and 32 hundredths.",
          },
          {
            label: "Step 3",
            explanation:
              "Click 'Calculate' to compute the points using the formula: 1000 × (46.91 / 55.32)³.",
          },
          {
            label: "Step 4",
            explanation: "The calculator returns approximately 572 points, indicating a competitive but not elite performance.",
          },
        ],
        result: "The swimmer's power points are 572, allowing comparison to other events or swimmers.",
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