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

export default function GroundBallToFlyBallRatioGbFbCalculator() {
  const [inputs, setInputs] = useState({ groundBalls: "", flyBalls: "" });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const gb = parseFloat(inputs.groundBalls);
    const fb = parseFloat(inputs.flyBalls);

    if (isNaN(gb) || isNaN(fb) || gb < 0 || fb < 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter valid non-negative numbers for ground balls and fly balls.",
        warning: "Invalid input",
        formulaUsed: "GB/FB = Ground Balls ÷ Fly Balls",
      };
    }
    if (fb === 0) {
      return {
        value: "∞",
        label: "Infinite Ratio",
        subtext: "Fly balls cannot be zero; ratio is undefined or infinite.",
        warning: "Division by zero",
        formulaUsed: "GB/FB = Ground Balls ÷ Fly Balls",
      };
    }

    const ratio = gb / fb;
    return {
      value: ratio.toFixed(3),
      label: "Ground Ball to Fly Ball Ratio (GB/FB)",
      subtext:
        "This ratio indicates the pitcher's tendency to induce ground balls relative to fly balls. A higher ratio suggests more ground balls.",
      warning: null,
      formulaUsed: "GB/FB = Ground Balls ÷ Fly Balls",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does a high GB/FB ratio indicate about a pitcher?",
      answer:
        "A high GB/FB ratio indicates that a pitcher induces significantly more ground balls than fly balls, which often correlates with fewer home runs allowed and can be advantageous in preventing extra-base hits.",
    },
    {
      question: "Can the GB/FB ratio be used to predict pitching success?",
      answer:
        "While GB/FB ratio is a useful metric to understand batted ball tendencies, it should be combined with other statistics like strikeout rate, walk rate, and velocity for a comprehensive evaluation of pitching performance.",
    },
    {
      question: "How can hitters use GB/FB ratio data?",
      answer:
        "Hitters can analyze a pitcher's GB/FB ratio to anticipate pitch outcomes and adjust their batting approach, such as focusing on hitting line drives or fly balls against pitchers with low GB/FB ratios.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="groundBalls" className="mb-1 flex items-center gap-1">
            Ground Balls <Waves className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="groundBalls"
            type="number"
            min={0}
            step="any"
            placeholder="Enter number of ground balls"
            value={inputs.groundBalls}
            onChange={(e) => handleInputChange("groundBalls", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="flyBalls" className="mb-1 flex items-center gap-1">
            Fly Balls <Flag className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="flyBalls"
            type="number"
            min={0}
            step="any"
            placeholder="Enter number of fly balls"
            value={inputs.flyBalls}
            onChange={(e) => handleInputChange("flyBalls", e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update (inputs already updated)
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ groundBalls: "", flyBalls: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
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
          Understanding Ground Ball to Fly Ball Ratio (GB/FB)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Ground Ball to Fly Ball Ratio (GB/FB) is a critical metric in baseball analytics that quantifies a pitcher's ability to induce ground balls relative to fly balls. This ratio is calculated by dividing the total number of ground balls allowed by the total number of fly balls allowed. A higher GB/FB ratio typically indicates a pitcher who relies on sinkers or pitches that keep the ball low in the strike zone, resulting in more grounders and fewer fly balls. This tendency is often desirable because ground balls are less likely to result in home runs and extra-base hits compared to fly balls.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding this ratio helps coaches, scouts, and analysts evaluate pitching styles and predict outcomes such as defensive alignment and batter approach. It also provides insight into a pitcher's effectiveness in limiting damaging hits. However, it is important to consider GB/FB ratio alongside other metrics like strikeout rate, walk rate, and velocity to form a comprehensive assessment of pitching performance.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to quickly determine the Ground Ball to Fly Ball Ratio by inputting the number of ground balls and fly balls recorded for a pitcher or over a specific period. The resulting ratio helps you analyze pitching tendencies and strategize accordingly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of ground balls induced by the pitcher in the "Ground Balls" input field.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total number of fly balls induced by the pitcher in the "Fly Balls" input field.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to compute the GB/FB ratio.
          </li>
          <li>
            <strong>Step 4:</strong> Review the ratio displayed and interpret it in the context of pitching strategy and performance.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Pitchers aiming to increase their GB/FB ratio should focus on developing pitches that generate downward movement, such as sinkers and split-finger fastballs. Drills that emphasize pitch location low in the strike zone and consistent release points can help induce more ground balls. Additionally, strength training targeting forearm and wrist stability can improve pitch control and movement.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          From a defensive perspective, teams can adjust their infield positioning based on a pitcher's GB/FB ratio to optimize ground ball outs. Conversely, hitters facing pitchers with high GB/FB ratios might focus on hitting line drives or elevating the ball to counteract the ground ball tendency.
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
          For more information on pitching analytics, biomechanics, and training methodologies, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletic performance and injury prevention.
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
              Offers comprehensive resources on strength training, conditioning, and biomechanics relevant to baseball pitchers and athletes.
            </p>
          </li>
          <li>
            <a
              href="https://baseballsavant.mlb.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              MLB Baseball Savant <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official MLB platform providing advanced baseball statistics and batted ball data, including ground ball and fly ball metrics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ground Ball to Fly Ball Ratio (GB/FB)"
      description="Calculate GB/FB ratio. Analyze a pitcher's tendency to induce grounders versus fly balls."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "GB/FB = Ground Balls ÷ Fly Balls",
        variables: [
          { symbol: "GB", description: "Number of ground balls induced" },
          { symbol: "FB", description: "Number of fly balls induced" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A pitcher has induced 120 ground balls and 80 fly balls over a season. To understand his pitching style, calculate his GB/FB ratio.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input 120 for ground balls and 80 for fly balls into the calculator.",
          },
          {
            label: "Step 2",
            explanation: "Click 'Calculate' to compute the ratio.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator returns 1.500, indicating the pitcher induces 1.5 ground balls for every fly ball.",
          },
        ],
        result:
          "This ratio suggests the pitcher has a strong tendency to induce ground balls, which can be advantageous in limiting home runs and extra-base hits.",
      }}
      relatedCalculators={[
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Tournament Bracket Seeding Helper", url: "/sports/tournament-bracket-seeding-helper", icon: "🏆" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "Plate Loading Calculator", url: "/sports/plate-loading", icon: "🏋️" },
        { title: "Calories Burned per Workout (MET)", url: "/sports/calories-burned-met", icon: "🔥" },
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