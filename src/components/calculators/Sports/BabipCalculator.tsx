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

export default function BabipCalculator() {
  const [inputs, setInputs] = useState({
    hits: "",
    homeRuns: "",
    atBats: "",
    strikeouts: "",
    walks: "",
    hitByPitch: "",
    sacrificeFlies: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and empty string
    if (/^\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const hits = Number(inputs.hits);
    const homeRuns = Number(inputs.homeRuns);
    const atBats = Number(inputs.atBats);
    const strikeouts = Number(inputs.strikeouts);
    const walks = Number(inputs.walks);
    const hitByPitch = Number(inputs.hitByPitch);
    const sacrificeFlies = Number(inputs.sacrificeFlies);

    // Validate inputs: all must be >= 0 and atBats > 0 to calculate
    if (
      [hits, homeRuns, atBats, strikeouts, walks, hitByPitch, sacrificeFlies].some(
        (v) => isNaN(v) || v < 0
      )
    ) {
      return {
        value: null,
        label: null,
        subtext: "Please enter valid non-negative numbers for all fields.",
        warning: null,
        formulaUsed: "",
      };
    }
    if (atBats === 0) {
      return {
        value: null,
        label: null,
        subtext: "At Bats must be greater than zero to calculate BABIP.",
        warning: null,
        formulaUsed: "",
      };
    }
    if (hits < homeRuns) {
      return {
        value: null,
        label: null,
        subtext: "Hits cannot be less than Home Runs.",
        warning: null,
        formulaUsed: "",
      };
    }

    // BABIP formula:
    // BABIP = (H - HR) / (AB - K - HR + SF)
    // H = Hits, HR = Home Runs, AB = At Bats, K = Strikeouts, SF = Sacrifice Flies
    // Walks and HBP are excluded from denominator because they are not balls in play.
    const denominator = atBats - strikeouts - homeRuns + sacrificeFlies;
    if (denominator <= 0) {
      return {
        value: null,
        label: null,
        subtext:
          "Invalid input combination results in zero or negative denominator. Please check your inputs.",
        warning: null,
        formulaUsed: "",
      };
    }

    const babip = (hits - homeRuns) / denominator;

    // Interpretation: BABIP typically ranges ~.290-.320 for MLB hitters.
    let interpretation = "";
    if (babip < 0.280) {
      interpretation = "Below average BABIP, possibly indicating bad luck or weak contact.";
    } else if (babip <= 0.320) {
      interpretation = "Average BABIP, indicating typical performance.";
    } else {
      interpretation = "Above average BABIP, possibly indicating good luck or strong contact.";
    }

    return {
      value: babip.toFixed(3),
      label: "Batting Average on Balls in Play (BABIP)",
      subtext: interpretation,
      warning: null,
      formulaUsed: "BABIP = (H - HR) / (AB - K - HR + SF)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does BABIP tell us about a player's performance?",
      answer:
        "BABIP measures how often a ball in play goes for a hit, excluding home runs and strikeouts. It helps distinguish between skill and luck, as unusually high or low BABIP can indicate a player is experiencing good or bad luck rather than a true change in ability.",
    },
    {
      question: "Why are walks and hit-by-pitches excluded from the BABIP calculation?",
      answer:
        "Walks and hit-by-pitches do not involve putting the ball into play, so they are excluded from BABIP. The metric focuses solely on balls that are fielded, which better reflects a player's ability to generate hits on batted balls.",
    },
    {
      question: "Can BABIP be used to evaluate pitchers as well as hitters?",
      answer:
        "Yes, BABIP is often used to assess pitchers' luck or skill in preventing hits on balls in play. A pitcher with an unusually low BABIP may be benefiting from good defense or luck, while a high BABIP might indicate poor defense or bad luck.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hits" className="mb-1 flex items-center gap-1">
            Hits (H) <Calculator className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="hits"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.hits}
            onChange={(e) => handleInputChange("hits", e.target.value)}
            placeholder="e.g. 150"
          />
        </div>
        <div>
          <Label htmlFor="homeRuns" className="mb-1 flex items-center gap-1">
            Home Runs (HR) <Trophy className="w-4 h-4 text-yellow-500" />
          </Label>
          <Input
            id="homeRuns"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.homeRuns}
            onChange={(e) => handleInputChange("homeRuns", e.target.value)}
            placeholder="e.g. 30"
          />
        </div>
        <div>
          <Label htmlFor="atBats" className="mb-1 flex items-center gap-1">
            At Bats (AB) <Flag className="w-4 h-4 text-red-600" />
          </Label>
          <Input
            id="atBats"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.atBats}
            onChange={(e) => handleInputChange("atBats", e.target.value)}
            placeholder="e.g. 500"
          />
        </div>
        <div>
          <Label htmlFor="strikeouts" className="mb-1 flex items-center gap-1">
            Strikeouts (K) <AlertTriangle className="w-4 h-4 text-red-500" />
          </Label>
          <Input
            id="strikeouts"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.strikeouts}
            onChange={(e) => handleInputChange("strikeouts", e.target.value)}
            placeholder="e.g. 120"
          />
        </div>
        <div>
          <Label htmlFor="walks" className="mb-1 flex items-center gap-1">
            Walks (BB) <Heart className="w-4 h-4 text-pink-600" />
          </Label>
          <Input
            id="walks"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.walks}
            onChange={(e) => handleInputChange("walks", e.target.value)}
            placeholder="e.g. 60"
          />
        </div>
        <div>
          <Label htmlFor="hitByPitch" className="mb-1 flex items-center gap-1">
            Hit By Pitch (HBP) <Flame className="w-4 h-4 text-orange-500" />
          </Label>
          <Input
            id="hitByPitch"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.hitByPitch}
            onChange={(e) => handleInputChange("hitByPitch", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div>
          <Label htmlFor="sacrificeFlies" className="mb-1 flex items-center gap-1">
            Sacrifice Flies (SF) <Waves className="w-4 h-4 text-blue-400" />
          </Label>
          <Input
            id="sacrificeFlies"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.sacrificeFlies}
            onChange={(e) => handleInputChange("sacrificeFlies", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger recalculation by setting inputs to current values (noop)
            setInputs((p) => ({ ...p }));
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
              strikeouts: "",
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

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed">{results.subtext}</p>
            <p className="mt-4 text-sm italic text-slate-500 dark:text-slate-400">
              Formula used: <code>{results.formulaUsed}</code>
            </p>
          </CardContent>
        </Card>
      )}

      {results.subtext && !results.value && (
        <Card className="bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 shadow-md">
          <CardContent className="p-6 text-center text-red-700 dark:text-red-300 font-semibold">
            {results.subtext}
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
          Batting Average on Balls in Play (BABIP) is a key sabermetric statistic used to evaluate a
          hitter's or pitcher's performance by measuring how often batted balls in play result in hits,
          excluding home runs and strikeouts. This metric helps isolate the elements of luck and skill,
          as it removes outcomes that are not influenced by fielders or random variation, such as walks,
          strikeouts, and home runs. BABIP is particularly useful for identifying whether a player is
          experiencing an unsustainable hot or cold streak, as extreme BABIP values tend to regress toward
          the league average over time.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formula for BABIP is: <br />
          <code className="font-mono bg-gray-100 dark:bg-gray-800 p-1 rounded">
            BABIP = (H - HR) / (AB - K - HR + SF)
          </code>
          , where H is hits, HR is home runs, AB is at bats, K is strikeouts, and SF is sacrifice flies.
          This calculation focuses on balls that are actually put into play and fielded, providing a more
          nuanced view of a player's ability to generate hits or prevent them.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate BABIP, input the player's relevant statistics from a given period or season.
          These include total hits, home runs, at bats, strikeouts, walks, hit by pitches, and sacrifice flies.
          The calculator automatically applies the BABIP formula and provides an interpretation of the result,
          helping you understand whether the player's BABIP is typical, above, or below average.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of hits (H) the player has recorded.
          </li>
          <li>
            <strong>Step 2:</strong> Input the number of home runs (HR) to exclude them from balls in play.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the total at bats (AB), which is the denominator base.
          </li>
          <li>
            <strong>Step 4:</strong> Enter strikeouts (K) and sacrifice flies (SF) to adjust the denominator.
          </li>
          <li>
            <strong>Step 5:</strong> Optionally, include walks (BB) and hit by pitches (HBP) for completeness,
            though they do not affect BABIP directly.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to see the BABIP value and its interpretation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While BABIP is a valuable metric for evaluating performance, it should be used in conjunction with other
          statistics and scouting reports to form a comprehensive assessment. Players with consistently high BABIP
          often demonstrate superior contact skills, speed, and the ability to hit line drives, while pitchers
          with low BABIP may benefit from strong defensive support or induce weak contact.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          To improve BABIP, hitters can focus on increasing their line drive rate and improving bat control to
          place the ball in gaps. Pitchers can work on inducing ground balls or weak fly balls to reduce the
          likelihood of hits. Additionally, understanding BABIP trends can help coaches and analysts identify
          when a player's performance is likely to regress to the mean, informing decisions on playing time and
          strategy.
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
          For more information on baseball statistics, player evaluation, and sports science, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based insights into athletic performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.mlb.com/glossary/advanced-stats/babip"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              MLB Glossary: BABIP <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official Major League Baseball resource explaining BABIP and its application in player analysis.
            </p>
          </li>
          <li>
            <a
              href="https://sabr.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Society for American Baseball Research (SABR) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A leading organization dedicated to baseball research and statistics, offering in-depth analysis and historical data.
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
          "A hitter has 150 hits, 30 home runs, 500 at bats, 120 strikeouts, 60 walks, 5 hit by pitches, and 5 sacrifice flies in a season.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Subtract home runs from hits: 150 - 30 = 120 balls in play hits.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate denominator: 500 - 120 - 30 + 5 = 355 balls in play opportunities.",
          },
          {
            label: "Step 3",
            explanation:
              "Divide balls in play hits by balls in play opportunities: 120 / 355 ≈ 0.338.",
          },
        ],
        result: "The player's BABIP is approximately 0.338, which is above average and may indicate strong contact skills or some favorable luck.",
      }}
      relatedCalculators={[
        { title: "Target Heart Rate / RPE Zones", url: "/sports/target-heart-rate-rpe-zones", icon: "🏆" },
        { title: "Swim Interval Pace Calculator", url: "/sports/swim-interval-pace", icon: "🏃" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "⚽" },
        { title: "TDEE Calculator (Sports)", url: "/sports/tdee-calculator", icon: "🔥" },
        { title: "Fitness Age Calculator", url: "/sports/fitness-age-calculator", icon: "🏆" },
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