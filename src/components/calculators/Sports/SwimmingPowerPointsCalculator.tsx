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

const worldRecords: Record<string, number> = {
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

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate total time in seconds
  const totalTimeSeconds = useMemo(() => {
    const min = parseInt(inputs.timeMinutes, 10);
    const sec = parseInt(inputs.timeSeconds, 10);
    const hun = parseInt(inputs.timeHundredths, 10);
    
    if (isNaN(min) && isNaN(sec) && isNaN(hun)) return null;

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

    let subtext = `Based on world record (${wrTime.toFixed(2)}s).`;
    let warning = null;
    
    // FIX: Using logical operators < and > here, NOT HTML entities
    if (points > 1200) {
      warning = "Points > 1200 indicate world-class performance.";
    } else if (points < 100) {
      warning = "Points < 100 indicate beginner level.";
    }

    return {
      value: points.toLocaleString(),
      label: "Swimming Power Points",
      subtext,
      warning,
      formulaUsed: "Points = 1000 × (World Record / Your Time)³",
    };
  }, [inputs.event, totalTimeSeconds]);

  const faqs = [
    {
      question: "What are Swimming Power Points?",
      answer: "Swimming Power Points provide a way to compare performances across different events (e.g., 50m Free vs 1500m Free) by scoring them relative to the current World Record."
    },
    {
      question: "How is the score calculated?",
      answer: "The formula is based on the cubic relationship between the World Record time and the swimmer's time. A score of 1000 points typically matches the World Record time."
    }
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
          <Label className="mb-1 flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
            <Timer className="w-4 h-4 text-blue-600" /> Enter Your Swim Time (LCM)
          </Label>
          <div className="flex gap-3 max-w-xs">
            <Input type="number" placeholder="Min" value={inputs.timeMinutes} onChange={(e) => handleInputChange("timeMinutes", e.target.value)} />
            <Input type="number" placeholder="Sec" value={inputs.timeSeconds} onChange={(e) => handleInputChange("timeSeconds", e.target.value)} />
            <Input type="number" placeholder="1/100" value={inputs.timeHundredths} onChange={(e) => handleInputChange("timeHundredths", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md" onClick={() => setInputs(p => ({...p}))}>
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={() => setInputs({ event: "100m Freestyle", timeMinutes: "", timeSeconds: "", timeHundredths: "" })} className="flex-1 h-11">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex justify-center gap-1">
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Swimming Power Points</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Swimming Power Points are a standardized scoring system that allows swimmers and coaches to compare performances across different events and distances. They are calculated relative to world record times, providing an objective measure of performance quality.
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Swimming Power Points Calculator"
      description="Compare swimming performances across different events."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ title: "Formula", formula: "Points = 1000 * (WR / Time)^3", variables: [] }}
      example={{ title: "Example", scenario: "100m Free in 55s", steps: [], result: "572 Points" }}
      relatedCalculators={relatedCalculators}
      onThisPage={[{ id: "what-is", label: "Understanding" }, { id: "faq", label: "FAQ" }]}
      showTopBanner showSidebar showBottomBanner
    />
  );
}
