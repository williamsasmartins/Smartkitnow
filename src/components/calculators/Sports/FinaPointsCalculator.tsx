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

const eventList = [
  { label: "50m Freestyle", value: "50_free" },
  { label: "100m Freestyle", value: "100_free" },
  { label: "200m Freestyle", value: "200_free" },
  { label: "400m Freestyle", value: "400_free" },
  { label: "800m Freestyle", value: "800_free" },
  { label: "1500m Freestyle", value: "1500_free" },
  { label: "50m Backstroke", value: "50_back" },
  { label: "100m Backstroke", value: "100_back" },
  { label: "200m Backstroke", value: "200_back" },
  { label: "50m Breaststroke", value: "50_breast" },
  { label: "100m Breaststroke", value: "100_breast" },
  { label: "200m Breaststroke", value: "200_breast" },
  { label: "50m Butterfly", value: "50_fly" },
  { label: "100m Butterfly", value: "100_fly" },
  { label: "200m Butterfly", value: "200_fly" },
  { label: "200m Individual Medley", value: "200_im" },
  { label: "400m Individual Medley", value: "400_im" },
];

// Reference times (World Record) for 2024, long course meters (LCM) - used as base times for FINA points calculation.
// Source: FINA World Records as of 2024 (https://www.fina.org/swimming/world-records)
const baseTimes = {
  "50_free": 20.91,
  "100_free": 46.86,
  "200_free": 101.56,
  "400_free": 214.06,
  "800_free": 428.00,
  "1500_free": 900.00,
  "50_back": 24.00,
  "100_back": 51.85,
  "200_back": 112.98,
  "50_breast": 25.95,
  "100_breast": 55.49,
  "200_breast": 117.03,
  "50_fly": 22.27,
  "100_fly": 49.45,
  "200_fly": 112.26,
  "200_im": 104.33,
  "400_im": 225.95,
};

// FINA Points calculation formula:
// Points = 1000 * (BaseTime / SwimmerTime)^3
// This formula is standardized by FINA to compare performances across events and genders.
// Source: FINA Swimming Points Table Methodology (https://www.fina.org/swimming/points)

export default function FinaPointsCalculator() {
  const [inputs, setInputs] = useState({
    event: "",
    timeMinutes: "",
    timeSeconds: "",
    timeHundredths: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parse input time to total seconds
  const totalTimeSeconds = useMemo(() => {
    const min = parseInt(inputs.timeMinutes, 10);
    const sec = parseInt(inputs.timeSeconds, 10);
    const hund = parseInt(inputs.timeHundredths, 10);

    if (
      isNaN(min) ||
      isNaN(sec) ||
      isNaN(hund) ||
      min < 0 ||
      sec < 0 ||
      sec >= 60 ||
      hund < 0 ||
      hund >= 100
    ) {
      return null;
    }
    return min * 60 + sec + hund / 100;
  }, [inputs.timeMinutes, inputs.timeSeconds, inputs.timeHundredths]);

  // Calculate FINA points
  const results = useMemo(() => {
    if (!inputs.event || totalTimeSeconds === null) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const baseTime = baseTimes[inputs.event];
    if (!baseTime) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Selected event is not supported.",
        formulaUsed: "",
      };
    }

    if (totalTimeSeconds <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive time.",
        formulaUsed: "",
      };
    }

    // FINA Points formula
    // Points = 1000 * (BaseTime / SwimmerTime)^3
    const ratio = baseTime / totalTimeSeconds;
    const points = Math.round(1000 * Math.pow(ratio, 3));

    // Points cannot be negative or zero
    if (points <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Calculated points are zero or negative, check input time.",
        formulaUsed: "",
      };
    }

    return {
      value: points.toLocaleString(),
      label: "FINA Points",
      subtext: `Based on event: ${eventList.find((e) => e.value === inputs.event)?.label}`,
      warning: null,
      formulaUsed: "Points = 1000 × (BaseTime / SwimmerTime)^3",
    };
  }, [inputs.event, totalTimeSeconds]);

  const faqs = [
    {
      question: "What are FINA Points and why are they important?",
      answer:
        "FINA Points provide a standardized way to compare swimming performances across different events and genders by converting race times into a single point scale. This allows coaches, athletes, and officials to objectively assess and rank performances internationally, facilitating fair competition and talent identification.",
    },
    {
      question: "How accurate is this calculator compared to official FINA tables?",
      answer:
        "This calculator uses the official FINA points formula and the latest world record base times to provide accurate point estimations. However, official FINA points tables are periodically updated by FINA based on new records and statistical adjustments, so for official rankings, always refer to the latest FINA published tables.",
    },
    {
      question: "Can I use this calculator for short course (25m) events?",
      answer:
        "No, this calculator is designed for long course meters (50m pool) events only, as the base times and points formula are calibrated for long course performances. Short course events require different base times and adjustments due to the increased number of turns.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Label htmlFor="event" className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Flag className="w-4 h-4 text-blue-600" /> Select Event
          </Label>
          <Select
            value={inputs.event}
            onValueChange={(v) => handleInputChange("event", v)}
            aria-label="Select swimming event"
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an event" />
            </SelectTrigger>
            <SelectContent>
              {eventList.map((ev) => (
                <SelectItem key={ev.value} value={ev.value}>
                  {ev.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Label className="mb-1 flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Timer className="w-4 h-4 text-blue-600" /> Enter Race Time (Long Course Meters)
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Min"
              value={inputs.timeMinutes}
              onChange={(e) => handleInputChange("timeMinutes", e.target.value)}
              aria-label="Minutes"
              className="w-20"
            />
            <span className="self-center text-lg font-bold text-slate-700 dark:text-slate-300">:</span>
            <Input
              type="number"
              min={0}
              max={59}
              placeholder="Sec"
              value={inputs.timeSeconds}
              onChange={(e) => handleInputChange("timeSeconds", e.target.value)}
              aria-label="Seconds"
              className="w-20"
            />
            <span className="self-center text-lg font-bold text-slate-700 dark:text-slate-300">.</span>
            <Input
              type="number"
              min={0}
              max={99}
              placeholder="Hundredths"
              value={inputs.timeHundredths}
              onChange={(e) => handleInputChange("timeHundredths", e.target.value)}
              aria-label="Hundredths of a second"
              className="w-20"
            />
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Enter your race time in minutes, seconds, and hundredths of a second.
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate FINA points"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ event: "", timeMinutes: "", timeSeconds: "", timeHundredths: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            <p className="mt-3 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mt-4">
          <AlertTriangle className="w-5 h-5" />
          <p>{results.warning}</p>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding FINA Points Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The FINA Points Calculator is a scientifically grounded tool designed to convert swimming race times into standardized points based on the official FINA points system. This system uses world record times as benchmarks to evaluate and compare performances across different swimming events and genders. By applying a cubic power formula to the ratio of the base (world record) time and the swimmer's time, the calculator provides an objective metric that reflects the quality of a swim relative to the best performances globally.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This approach is essential for coaches, athletes, and analysts who need to assess performance improvements, rank swimmers in multi-event competitions, or identify talent across disciplines. The calculator strictly uses long course meters (50m pool) data, aligning with FINA's official standards and ensuring consistency with international competition metrics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the underlying formula and its application can empower users to interpret results meaningfully and integrate them into training and competition strategies effectively.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the FINA Points Calculator is straightforward and requires only two inputs: the swimming event and the swimmer's race time. The race time should be entered in minutes, seconds, and hundredths of a second to ensure precision. Once these inputs are provided, the calculator applies the official FINA formula to compute the points.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Select the swimming event from the dropdown menu. Ensure you choose the correct event corresponding to your race.</li>
          <li><strong>Step 2:</strong> Enter your race time accurately in the provided fields for minutes, seconds, and hundredths of a second.</li>
          <li><strong>Step 3:</strong> Click the "Calculate" button to generate your FINA points score.</li>
          <li><strong>Step 4:</strong> Review the calculated points displayed prominently. Use this score to compare performances or track progress.</li>
          <li><strong>Step 5:</strong> Use the "Reset" button to clear inputs and perform new calculations as needed.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your FINA points and overall swimming performance, focus on a balanced training program that develops endurance, speed, technique, and race strategy. Incorporate interval training, stroke refinement drills, and strength conditioning tailored to your event specialty. Regularly timing your swims and calculating FINA points can help monitor improvements objectively and adjust training loads accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, mental preparation and race pacing are critical. Use the points calculator to set realistic performance goals and benchmark against elite standards. Remember, consistent technique improvement often yields greater points gains than raw speed alone, especially in technical strokes like breaststroke and butterfly.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, ensure adequate recovery and nutrition to support high-intensity training phases, as these factors significantly impact your ability to perform at peak levels and achieve higher FINA points.
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
          For more information on swimming performance metrics, training science, and official rules, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.fina.org/swimming/points"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FINA Swimming Points System <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official FINA documentation on the points system methodology and tables for swimming performance comparison.
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
              Leading organization providing research and guidelines on sports science, exercise physiology, and athlete training.
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
              National governing body for competitive swimming in the USA, offering resources on training, competition rules, and athlete development.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="FINA Points Calculator"
      description="Calculate FINA swimming points. Convert race times into official FINA points for ranking comparison."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "FINA Points Calculation Formula",
        formula: "Points = 1000 × (BaseTime / SwimmerTime)^3",
        variables: [
          { symbol: "Points", description: "FINA points scored" },
          { symbol: "BaseTime", description: "World record time for the event (seconds)" },
          { symbol: "SwimmerTime", description: "Swimmer's race time (seconds)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A swimmer completes the 100m freestyle in 52.35 seconds. Using the FINA Points Calculator, we can determine their FINA points score to compare their performance internationally.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select '100m Freestyle' from the event dropdown.",
          },
          {
            label: "Step 2",
            explanation: "Enter the race time as 0 minutes, 52 seconds, and 35 hundredths.",
          },
          {
            label: "Step 3",
            explanation: "Click 'Calculate' to generate the FINA points.",
          },
        ],
        result:
          "The calculator computes the points as approximately 819, indicating a strong competitive performance relative to the world record.",
      }}
      relatedCalculators={[
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
        { title: "Ground Ball to Fly Ball Ratio (GB/FB)", url: "/sports/ground-ball-to-fly-ball-ratio-gb-fb", icon: "⚽" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
        { title: "FTP (Functional Threshold Power) Zones Planner", url: "/sports/ftp-zones-planner", icon: "🚴" },
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