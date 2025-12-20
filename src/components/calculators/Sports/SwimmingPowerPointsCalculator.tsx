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

type StrokeType = "Freestyle" | "Backstroke" | "Breaststroke" | "Butterfly";

const strokeFactors: Record<StrokeType, number> = {
  Freestyle: 1.0,
  Backstroke: 0.95,
  Breaststroke: 0.9,
  Butterfly: 0.92,
};

export default function SwimmingPowerPointsCalculator() {
  const [inputs, setInputs] = useState<{
    distance?: number;
    timeSeconds?: number;
    stroke?: StrokeType;
  }>({
    distance: undefined,
    timeSeconds: undefined,
    stroke: "Freestyle",
  });

  const handleInputChange = useCallback(
    (name: keyof typeof inputs, value: any) =>
      setInputs((prev) => ({ ...prev, [name]: value })),
    []
  );

  // Swimming Power Points Calculation logic:
  // Simplified example formula:
  // PowerPoints = (distance / timeSeconds) * strokeFactor * 100
  // Higher points = better performance
  // Show warning if inputs invalid or timeSeconds = 0

  const results = useMemo(() => {
    const { distance, timeSeconds, stroke } = inputs;
    if (
      distance === undefined ||
      timeSeconds === undefined ||
      stroke === undefined ||
      distance <= 0 ||
      timeSeconds <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive values for distance and time.",
        formulaUsed:
          "PowerPoints = (distance / timeSeconds) × strokeFactor × 100",
      };
    }

    const strokeFactor = strokeFactors[stroke];
    const powerPoints = (distance / timeSeconds) * strokeFactor * 100;

    let label = "Swimming Power Points";
    let subtext = `Stroke: ${stroke}, Distance: ${distance}m, Time: ${timeSeconds}s`;
    let warning = null;

    if (powerPoints < 50) {
      warning = "Performance is below average.";
    } else if (powerPoints > 200) {
      warning = "Exceptional performance!";
    }

    return {
      value: powerPoints.toFixed(1),
      label,
      subtext,
      warning,
      formulaUsed:
        "PowerPoints = (distance / timeSeconds) × strokeFactor × 100",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Swimming Power Points?",
      answer:
        "Swimming Power Points provide a standardized score to compare performances across different strokes and distances.",
    },
    {
      question: "How is the score calculated?",
      answer:
        "The score is calculated using the formula: PowerPoints = (distance / time) × stroke factor × 100.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="distance">Distance (meters)</Label>
            <Input
              id="distance"
              type="number"
              min={1}
              step={1}
              value={inputs.distance ?? ""}
              onChange={(e) =>
                handleInputChange("distance", Number(e.target.value))
              }
              placeholder="e.g. 100"
            />
          </div>
          <div>
            <Label htmlFor="timeSeconds">Time (seconds)</Label>
            <Input
              id="timeSeconds"
              type="number"
              min={1}
              step={0.01}
              value={inputs.timeSeconds ?? ""}
              onChange={(e) =>
                handleInputChange("timeSeconds", Number(e.target.value))
              }
              placeholder="e.g. 55.32"
            />
          </div>
          <div>
            <Label htmlFor="stroke">Stroke</Label>
            <Select
              value={inputs.stroke}
              onValueChange={(v) =>
                handleInputChange("stroke", v as StrokeType)
              }
            >
              <SelectTrigger id="stroke" className="w-full">
                <SelectValue placeholder="Select stroke" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Freestyle">Freestyle</SelectItem>
                <SelectItem value="Backstroke">Backstroke</SelectItem>
                <SelectItem value="Breaststroke">Breaststroke</SelectItem>
                <SelectItem value="Butterfly">Butterfly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, results update automatically
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ distance: undefined, timeSeconds: undefined, stroke: "Freestyle" })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                <AlertTriangle className="inline mr-1 w-4 h-4 align-text-bottom" />
                {results.warning}
              </p>
            )}
            {/* ⚠️ JSX TEXT AREA: Use &lt; and &gt; */}
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
              Formula used: PowerPoints = (distance / time) &times; strokeFactor &times; 100
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
          Understanding Swimming Power Points Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Swimming Power Points Calculator allows swimmers and coaches to
          compare performances across different strokes and distances by
          converting times into a standardized points system. This helps in
          evaluating relative performance levels objectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculation takes into account the stroke type, distance swum,
          and time taken, applying stroke-specific factors to normalize scores.
          Higher points indicate better performance.
        </p>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References
        </h2>
        <ul className="space-y-4 list-disc list-inside">
          <li>
            <a
              href="https://www.usaswimming.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USA Swimming <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official site for swimming rules, rankings, and performance
              standards.
            </p>
          </li>
          <li>
            <a
              href="https://www.swimmingworldmagazine.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Swimming World Magazine <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              News and analysis on competitive swimming and training methods.
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
        formula: "PowerPoints = (distance / time) × strokeFactor × 100",
        variables: [
          { symbol: "distance", description: "Distance swum in meters" },
          { symbol: "time", description: "Time taken in seconds" },
          { symbol: "strokeFactor", description: "Stroke-specific factor" },
        ],
      }}
      example={{
        title: "Example",
        scenario:
          "Calculate power points for 100m Freestyle swum in 55 seconds.",
        steps: [
          {
            label: "1",
            explanation:
              "Identify stroke factor for Freestyle: 1.0",
          },
          {
            label: "2",
            explanation: "Calculate distance/time: 100 / 55 ≈ 1.818",
          },
          {
            label: "3",
            explanation:
              "Multiply by stroke factor and 100: 1.818 × 1.0 × 100 = 181.8 points",
          },
        ],
        result: "Power Points = 181.8",
      }}
      relatedCalculators={[
        {
          title: "Hydration / Sweat Rate Calculator",
          url: "/sports/hydration-sweat-rate",
          icon: "🏆",
        },
        {
          title: "Wilks Coefficient Calculator",
          url: "/sports/wilks-coefficient",
          icon: "🏆",
        },
        {
          title: "Golf Handicap Differential & Index",
          url: "/sports/golf-handicap-differential-index",
          icon: "⛳",
        },
        {
          title: "Soccer League Table: Points & GD",
          url: "/sports/soccer-league-table-points-gd",
          icon: "⚽",
        },
        {
          title: "Baseball OPS / SLG / OBP Calculator",
          url: "/sports/baseball-ops-slg-obp",
          icon: "⚽",
        },
        {
          title: "Running Pace / Split / Finish Time Calculator",
          url: "/sports/running-pace-split-finish-time",
          icon: "🏃",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}