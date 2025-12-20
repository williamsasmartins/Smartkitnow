import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function GroundBallToFlyBallRatioGbFbCalculator() {
  const [inputs, setInputs] = useState({ groundBalls: "", flyBalls: "" });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const gb = parseFloat(inputs.groundBalls);
    const fb = parseFloat(inputs.flyBalls);

    if (isNaN(gb) || isNaN(fb) || gb < 0 || fb < 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter valid non-negative numbers for ground balls and fly balls.",
        warning: <AlertTriangle className="inline-block mr-1 w-5 h-5 text-red-600" />,
        formulaUsed: "GB/FB = Ground Balls ÷ Fly Balls",
      };
    }
    if (fb === 0) {
      return {
        value: null,
        label: null,
        subtext: "Fly Balls cannot be zero to calculate GB/FB ratio.",
        warning: <AlertTriangle className="inline-block mr-1 w-5 h-5 text-red-600" />,
        formulaUsed: "GB/FB = Ground Balls ÷ Fly Balls",
      };
    }

    const ratio = gb / fb;
    const ratioRounded = ratio.toFixed(3);

    let interpretation = "";
    if (ratio < 0.8) {
      interpretation = "Pitcher tends to induce more fly balls.";
    } else if (ratio <= 1.2) {
      interpretation = "Pitcher has a balanced ground ball to fly ball ratio.";
    } else {
      interpretation = "Pitcher tends to induce more ground balls.";
    }

    return {
      value: ratioRounded,
      label: "Ground Ball to Fly Ball Ratio (GB/FB)",
      subtext: interpretation,
      warning: null,
      formulaUsed: "GB/FB = Ground Balls ÷ Fly Balls",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does the Ground Ball to Fly Ball Ratio (GB/FB) indicate?",
      answer:
        "The GB/FB ratio measures a pitcher's ability to induce ground balls relative to fly balls. A higher ratio means the pitcher generates more ground balls, which often results in fewer extra-base hits and home runs. Conversely, a lower ratio indicates a tendency to allow more fly balls, which can be riskier but sometimes leads to more strikeouts or pop-ups.",
    },
    {
      question: "How can batters use the GB/FB ratio to their advantage?",
      answer:
        "Batters can analyze a pitcher's GB/FB ratio to anticipate the type of contact they are likely to make. Against pitchers with a high GB/FB ratio, batters might focus on hitting line drives or ground balls to exploit defensive weaknesses. Against pitchers with a low ratio, batters might prepare for fly balls and adjust their swing to maximize power and elevation.",
    },
    {
      question: "Is a higher GB/FB ratio always better for pitchers?",
      answer:
        "Not necessarily. While inducing ground balls can reduce home runs and extra-base hits, it can also lead to more hits if the defense is weak or the infield is slow. Additionally, some pitchers succeed with lower GB/FB ratios by generating strikeouts or weak fly balls. The ideal ratio depends on the pitcher's style, defense, and ballpark factors.",
    },
    {
      question: "How often should pitchers track their GB/FB ratio?",
      answer:
        "Pitchers and coaches should monitor the GB/FB ratio regularly throughout the season to identify trends and adjust strategies. Tracking it after every few starts or monthly can provide actionable insights to improve pitch selection, location, and mechanics to optimize batted ball outcomes.",
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
            min="0"
            step="1"
            placeholder="Enter number of ground balls"
            value={inputs.groundBalls}
            onChange={(e) => handleInputChange("groundBalls", e.target.value)}
            aria-describedby="groundBallsHelp"
          />
          <p id="groundBallsHelp" className="text-xs text-slate-500 mt-1">
            Total ground balls induced by the pitcher.
          </p>
        </div>
        <div>
          <Label htmlFor="flyBalls" className="mb-1 flex items-center gap-1">
            Fly Balls <Flame className="w-4 h-4 text-red-600" />
          </Label>
          <Input
            id="flyBalls"
            type="number"
            min="0"
            step="1"
            placeholder="Enter number of fly balls"
            value={inputs.flyBalls}
            onChange={(e) => handleInputChange("flyBalls", e.target.value)}
            aria-describedby="flyBallsHelp"
          />
          <p id="flyBallsHelp" className="text-xs text-slate-500 mt-1">
            Total fly balls allowed by the pitcher.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update, no extra logic needed
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate GB/FB Ratio"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ groundBalls: "", flyBalls: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">{results.label}</p>
            <p className="text-sm text-slate-700 dark:text-slate-400">{results.subtext}</p>
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-600 italic">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <p className="text-red-600 flex items-center justify-center gap-2 font-semibold mt-4">
          {results.warning} {results.subtext}
        </p>
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
          The Ground Ball to Fly Ball Ratio (GB/FB) is a key metric in baseball analytics that quantifies a pitcher's ability to induce ground balls relative to fly balls. Ground balls are batted balls that hit the ground before reaching the outfield, while fly balls are batted balls that travel through the air beyond the infield. This ratio provides insight into the type of contact a pitcher typically allows, which can influence defensive strategies and pitching approaches.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A higher GB/FB ratio suggests that a pitcher is more effective at generating ground balls, which often results in fewer extra-base hits and home runs. Ground balls tend to be easier for infielders to field and convert into outs, making this a desirable trait for many pitchers. Conversely, a lower GB/FB ratio indicates a tendency to allow more fly balls, which can be riskier but sometimes leads to more strikeouts or weakly hit pop-ups.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding this ratio helps coaches and analysts evaluate pitching performance beyond traditional statistics like ERA or strikeouts. It also assists in tailoring defensive alignments and pitch selection to maximize a pitcher's strengths and minimize damage from batted balls.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          In summary, the GB/FB ratio is a valuable tool for assessing how a pitcher influences the type of contact hitters make, which directly impacts game outcomes and player development.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to quickly determine the Ground Ball to Fly Ball Ratio (GB/FB) for any pitcher by inputting the total number of ground balls and fly balls they have induced or allowed. The ratio is calculated by dividing the number of ground balls by the number of fly balls.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the calculator, enter the total ground balls and fly balls in the respective input fields. Ensure that both values are non-negative numbers. Once entered, click the "Calculate" button to see the GB/FB ratio along with an interpretation of what the ratio suggests about the pitcher's batted ball tendencies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          If you wish to analyze a different pitcher or update the data, simply modify the inputs and recalculate. The "Reset" button clears all inputs for a fresh start.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of ground balls induced by the pitcher.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total number of fly balls allowed by the pitcher.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to compute the GB/FB ratio.
          </li>
          <li>
            <strong>Step 4:</strong> Review the ratio and its interpretation to understand the pitcher's batted ball profile.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving a pitcher's GB/FB ratio involves focusing on pitch selection, location, and mechanics to induce more ground balls or fly balls depending on strategic goals. For pitchers aiming to increase ground balls, emphasize sinkers, two-seam fastballs, and changeups low in the strike zone. These pitches encourage hitters to hit the top half of the ball, resulting in grounders.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Conversely, pitchers who want to generate more fly balls might focus on four-seam fastballs up in the zone or cutters that induce weak contact. Understanding the ballpark and defensive alignment is crucial, as some parks favor ground ball pitchers while others favor fly ball pitchers.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Regular video analysis and biomechanical assessments can help refine delivery to optimize pitch movement and location. Additionally, working with catchers and coaches to develop game plans tailored to opposing hitters' tendencies can maximize the effectiveness of the GB/FB strategy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, conditioning and strength training focused on core stability and arm health support consistent mechanics, which is essential for maintaining a desired GB/FB ratio over the course of a season.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://baseballsavant.mlb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Baseball Savant <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official MLB site providing advanced batted ball data, including GB/FB ratios, with detailed player and pitch-level analytics.
            </p>
          </li>
          <li>
            <a
              href="https://www.fangraphs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FanGraphs <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive baseball statistics and analysis platform offering in-depth metrics and articles on batted ball profiles and pitcher tendencies.
            </p>
          </li>
          <li>
            <a
              href="https://www.baseball-reference.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Baseball Reference <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Extensive historical and current baseball statistics database, including batted ball data and advanced pitching metrics.
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
          { symbol: "GB", description: "Number of ground balls induced by the pitcher" },
          { symbol: "FB", description: "Number of fly balls allowed by the pitcher" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A pitcher has induced 120 ground balls and allowed 80 fly balls over a season. Calculate the GB/FB ratio to understand their batted ball tendencies.",
        steps: [
          { label: "Step 1", explanation: "Identify the total ground balls: 120." },
          { label: "Step 2", explanation: "Identify the total fly balls: 80." },
          { label: "Step 3", explanation: "Divide ground balls by fly balls: 120 ÷ 80 = 1.5." },
          { label: "Step 4", explanation: "Interpret the ratio: 1.5 indicates the pitcher induces more ground balls than fly balls." },
        ],
        result: "GB/FB ratio = 1.5, indicating a ground ball-heavy pitching style.",
      }}
      relatedCalculators={[
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
        { title: "Rowing Split (500m) ↔ Pace", url: "/sports/rowing-split-500m-pace", icon: "🏃" },
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Bowling Score Calculator", url: "/sports/bowling-score-calculator", icon: "🏆" },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
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