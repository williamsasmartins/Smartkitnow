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

export default function BabipCalculator() {
  const [inputs, setInputs] = useState({
    hits: "",
    homeRuns: "",
    atBats: "",
    strikeOuts: "",
    walks: "",
    hitByPitch: "",
    sacrificeFlies: "",
  });

  const handleInputChange = useCallback((n, v) => {
    // Accept only numbers or empty string
    if (v === "" || /^\d*$/.test(v)) {
      setInputs((p) => ({ ...p, [n]: v }));
    }
  }, []);

  const results = useMemo(() => {
    const hits = Number(inputs.hits);
    const homeRuns = Number(inputs.homeRuns);
    const atBats = Number(inputs.atBats);
    const strikeOuts = Number(inputs.strikeOuts);
    const walks = Number(inputs.walks);
    const hitByPitch = Number(inputs.hitByPitch);
    const sacrificeFlies = Number(inputs.sacrificeFlies);

    // Validate inputs: all must be >= 0 and atBats > 0 to calculate
    if (
      [hits, homeRuns, atBats, strikeOuts, walks, hitByPitch, sacrificeFlies].some(
        (v) => isNaN(v) || v < 0
      )
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid non-negative numbers for all fields.",
        formulaUsed:
          "BABIP = (H - HR) / (AB - K - HR + SF)",
      };
    }
    if (atBats === 0) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "At Bats (AB) must be greater than zero to calculate BABIP.",
        formulaUsed:
          "BABIP = (H - HR) / (AB - K - HR + SF)",
      };
    }

    // Calculate denominator
    const denominator = atBats - strikeOuts - homeRuns + sacrificeFlies;

    if (denominator <= 0) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning:
          "Denominator (AB - K - HR + SF) must be greater than zero for a valid BABIP calculation.",
        formulaUsed:
          "BABIP = (H - HR) / (AB - K - HR + SF)",
      };
    }

    const babip = (hits - homeRuns) / denominator;

    // Format as batting average style: .300 etc.
    const babipFormatted = babip.toFixed(3).replace(/^0/, "");

    return {
      value: babipFormatted,
      label: "Batting Average on Balls in Play (BABIP)",
      subtext:
        "BABIP measures how often a ball in play goes for a hit, excluding home runs and strikeouts.",
      warning: null,
      formulaUsed: "BABIP = (H - HR) / (AB - K - HR + SF)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does BABIP tell us about a player's performance?",
      answer:
        "BABIP, or Batting Average on Balls in Play, measures the rate at which batted balls in play result in hits, excluding home runs and strikeouts. It helps distinguish between skill and luck by showing if a player is consistently getting hits on balls put into play or benefiting from favorable circumstances like defensive positioning or luck.",
    },
    {
      question: "Why are home runs and strikeouts excluded from the BABIP calculation?",
      answer:
        "Home runs are excluded because they are not balls in play—they leave the field entirely. Strikeouts are excluded because the ball is never put into play. BABIP focuses solely on balls that are fielded, providing insight into how often those balls result in hits, which is more indicative of a player's contact quality and luck.",
    },
    {
      question: "How can BABIP be used to evaluate pitchers?",
      answer:
        "For pitchers, BABIP can indicate how much luck or defense is influencing their performance. A pitcher with an unusually high BABIP might be giving up more hits on balls in play than expected, possibly due to poor defense or bad luck. Conversely, a low BABIP might suggest good defense or luck. Over time, BABIP tends to regress toward the league average for pitchers.",
    },
    {
      question: "Can BABIP be used to predict future performance?",
      answer:
        "BABIP is often used as a predictive tool because extreme BABIP values tend to regress to the mean. Players with very high BABIP may experience a decline, while those with low BABIP may improve. However, some players consistently maintain higher or lower BABIPs due to skill factors like speed or hitting style.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hits" className="flex items-center gap-1">
            Hits (H) <Activity className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="hits"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 150"
            value={inputs.hits}
            onChange={(e) => handleInputChange("hits", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="homeRuns" className="flex items-center gap-1">
            Home Runs (HR) <Flame className="w-4 h-4 text-red-600" />
          </Label>
          <Input
            id="homeRuns"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 30"
            value={inputs.homeRuns}
            onChange={(e) => handleInputChange("homeRuns", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="atBats" className="flex items-center gap-1">
            At Bats (AB) <Scale className="w-4 h-4 text-green-600" />
          </Label>
          <Input
            id="atBats"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 500"
            value={inputs.atBats}
            onChange={(e) => handleInputChange("atBats", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="strikeOuts" className="flex items-center gap-1">
            Strikeouts (K) <Zap className="w-4 h-4 text-yellow-600" />
          </Label>
          <Input
            id="strikeOuts"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 120"
            value={inputs.strikeOuts}
            onChange={(e) => handleInputChange("strikeOuts", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="walks" className="flex items-center gap-1">
            Walks (BB) <Heart className="w-4 h-4 text-pink-600" />
          </Label>
          <Input
            id="walks"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 60"
            value={inputs.walks}
            onChange={(e) => handleInputChange("walks", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="hitByPitch" className="flex items-center gap-1">
            Hit By Pitch (HBP) <AlertTriangle className="w-4 h-4 text-orange-600" />
          </Label>
          <Input
            id="hitByPitch"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 5"
            value={inputs.hitByPitch}
            onChange={(e) => handleInputChange("hitByPitch", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sacrificeFlies" className="flex items-center gap-1">
            Sacrifice Flies (SF) <Waves className="w-4 h-4 text-cyan-600" />
          </Label>
          <Input
            id="sacrificeFlies"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 7"
            value={inputs.sacrificeFlies}
            onChange={(e) => handleInputChange("sacrificeFlies", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No action needed, calculation is automatic
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              hits: "",
              homeRuns: "",
              atBats: "",
              strikeOuts: "",
              walks: "",
              hitByPitch: "",
              sacrificeFlies: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
              Formula used: <code>{results.formulaUsed}</code>
            </p>
          </CardContent>
        </Card>
      )}
      {results.warning && (
        <Card className="bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700 shadow-lg">
          <CardContent className="p-6 text-center text-red-700 dark:text-red-400">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
            <p className="font-semibold">{results.warning}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding BABIP Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Batting Average on Balls in Play (BABIP) is a key baseball statistic that measures how often a
          batted ball in play results in a hit, excluding home runs and strikeouts. It provides insight
          into a player's ability to get hits on balls they put into play, separating skill from luck.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          BABIP is widely used by analysts, coaches, and scouts to evaluate both hitters and pitchers.
          For hitters, a high BABIP may indicate good contact skills or speed, while a low BABIP might
          suggest bad luck or weak contact. For pitchers, BABIP helps assess whether their performance is
          sustainable or influenced by defense and luck.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The formula for BABIP is: <code>BABIP = (H - HR) / (AB - K - HR + SF)</code>, where H is hits,
          HR is home runs, AB is at bats, K is strikeouts, and SF is sacrifice flies. This formula
          excludes outcomes where the ball is not put into play or leaves the field entirely.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding BABIP allows teams to identify players who may be overperforming or
          underperforming due to luck, and to make better decisions about player development,
          acquisitions, and game strategy.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To calculate BABIP using this tool, you need to input several key statistics from a player's
          performance. These include Hits (H), Home Runs (HR), At Bats (AB), Strikeouts (K), Walks (BB),
          Hit By Pitch (HBP), and Sacrifice Flies (SF). While Walks and Hit By Pitch are not directly used
          in the BABIP formula, they provide context for overall plate discipline and can be useful for
          deeper analysis.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once you enter the values, click the "Calculate" button to see the BABIP result displayed
          prominently. The calculator automatically validates inputs to ensure meaningful results.
          If any input is invalid or missing, helpful error messages will guide you to correct them.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The BABIP value is presented as a decimal batting average (e.g., .300). This number represents
          the proportion of balls in play that resulted in hits, excluding home runs and strikeouts.
          Use this value to compare players or evaluate trends over time.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the player's Hits (H), Home Runs (HR), At Bats (AB), Strikeouts (K),
            Walks (BB), Hit By Pitch (HBP), and Sacrifice Flies (SF).
          </li>
          <li>
            <strong>Step 2:</strong> Click the "Calculate" button to compute the BABIP.
          </li>
          <li>
            <strong>Step 3:</strong> Review the BABIP result and interpret it in the context of player performance.
          </li>
          <li>
            <strong>Step 4:</strong> Use the "Reset" button to clear inputs and analyze other players or time periods.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving BABIP often involves focusing on contact quality and hitting strategy. Hitters should
          work on making consistent, hard contact and placing the ball in areas that are difficult for
          defenders to reach. Drills that enhance bat control and situational hitting can increase BABIP.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Speed is another important factor. Faster players can beat out infield hits more often, boosting
          their BABIP. Incorporating agility and sprint training can help players improve their ability to
          turn ground balls into hits.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For pitchers, understanding BABIP can guide defensive positioning and pitch selection. Pitchers
          can work with coaches to develop strategies that induce weak contact or ground balls, which tend
          to result in lower BABIP.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, always consider BABIP in the context of other metrics and scouting reports to get a
          comprehensive view of performance and potential.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References &amp; Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.fangraphs.com/library/offense/babip/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FanGraphs - BABIP Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive breakdown of BABIP, its calculation, and interpretation in modern baseball
              analytics.
            </p>
          </li>
          <li>
            <a
              href="https://www.baseball-reference.com/about/babip.shtml"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Baseball Reference - BABIP Overview <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed explanation of BABIP with historical context and examples from MLB players.
            </p>
          </li>
          <li>
            <a
              href="https://www.baseballprospectus.com/news/article/15017/babip-and-its-meaning/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Baseball Prospectus - BABIP and Its Meaning <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An analytical article discussing the implications of BABIP for player evaluation and
              predictive analytics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="BABIP Calculator"
      description="Calculate Batting Average on Balls in Play (BABIP). Assess whether a pitcher or hitter is lucky or skilled."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "BABIP = (H - HR) / (AB - K - HR + SF)",
        variables: [
          { symbol: "H", description: "Hits" },
          { symbol: "HR", description: "Home Runs" },
          { symbol: "AB", description: "At Bats" },
          { symbol: "K", description: "Strikeouts" },
          { symbol: "SF", description: "Sacrifice Flies" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player has 150 hits, 30 home runs, 500 at bats, 120 strikeouts, and 7 sacrifice flies in a season.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Subtract home runs from hits: 150 - 30 = 120.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate denominator: 500 - 120 - 30 + 7 = 357.",
          },
          {
            label: "Step 3",
            explanation:
              "Divide numerator by denominator: 120 / 357 ≈ 0.336.",
          },
        ],
        result: "The player's BABIP is approximately .336, indicating a high rate of hits on balls in play.",
      }}
      relatedCalculators={[
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        {
          title: "Running Pace / Split / Finish Time Calculator",
          url: "/sports/running-pace-split-finish-time",
          icon: "🏃",
        },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
        { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏆" },
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
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