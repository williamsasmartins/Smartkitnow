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

export default function BaseballOpsSlgObpCalculator() {
  const [inputs, setInputs] = useState({
    atBats: "",
    hits: "",
    doubles: "",
    triples: "",
    homeRuns: "",
    walks: "",
    hitByPitch: "",
    sacrificeFlies: "",
  });

  const handleInputChange = useCallback((n, v) => {
    // Only allow digits and empty string
    if (/^\d*$/.test(v)) {
      setInputs((p) => ({ ...p, [n]: v }));
    }
  }, []);

  // Parsing inputs to numbers or zero
  const atBats = Number(inputs.atBats) || 0;
  const hits = Number(inputs.hits) || 0;
  const doubles = Number(inputs.doubles) || 0;
  const triples = Number(inputs.triples) || 0;
  const homeRuns = Number(inputs.homeRuns) || 0;
  const walks = Number(inputs.walks) || 0;
  const hitByPitch = Number(inputs.hitByPitch) || 0;
  const sacrificeFlies = Number(inputs.sacrificeFlies) || 0;

  // Calculations
  const results = useMemo(() => {
    // Validation: atBats must be > 0 for SLG and OBP denominator must be > 0
    const singles = hits - doubles - triples - homeRuns;

    // Slugging Percentage (SLG) = Total Bases / At Bats
    // Total Bases = singles*1 + doubles*2 + triples*3 + homeRuns*4
    const totalBases = singles * 1 + doubles * 2 + triples * 3 + homeRuns * 4;
    const slg = atBats > 0 ? totalBases / atBats : null;

    // On-Base Percentage (OBP) = (Hits + Walks + Hit By Pitch) / (At Bats + Walks + Hit By Pitch + Sacrifice Flies)
    const obpDenominator = atBats + walks + hitByPitch + sacrificeFlies;
    const obpNumerator = hits + walks + hitByPitch;
    const obp = obpDenominator > 0 ? obpNumerator / obpDenominator : null;

    // On-Base Plus Slugging (OPS) = OBP + SLG
    const ops = obp !== null && slg !== null ? obp + slg : null;

    // Formatting results to 3 decimals or show "N/A"
    const formatNum = (num) => (num !== null ? num.toFixed(3) : "N/A");

    // Warning messages for invalid inputs
    let warning = null;
    if (atBats === 0) {
      warning = "At Bats must be greater than zero for accurate SLG and OPS calculation.";
    }
    if (obpDenominator === 0) {
      warning = "Denominator for OBP calculation is zero; please enter valid inputs.";
    }
    if (hits > atBats) {
      warning = "Hits cannot exceed At Bats.";
    }
    if (doubles + triples + homeRuns > hits) {
      warning = "Sum of doubles, triples, and home runs cannot exceed total hits.";
    }

    return {
      slg: formatNum(slg),
      obp: formatNum(obp),
      ops: formatNum(ops),
      warning,
      formulaUsed:
        "SLG = (1B + 2×2B + 3×3B + 4×HR) / AB; OBP = (H + BB + HBP) / (AB + BB + HBP + SF); OPS = OBP + SLG",
    };
  }, [atBats, hits, doubles, triples, homeRuns, walks, hitByPitch, sacrificeFlies]);

  const faqs = [
    {
      question: "What is the significance of OPS in baseball analytics?",
      answer:
        "OPS (On-base Plus Slugging) is a comprehensive statistic that combines a player's ability to get on base (OBP) with their power hitting (SLG). It provides a single metric to evaluate offensive performance, helping teams and analysts assess a player's overall contribution to scoring runs. Higher OPS values generally indicate more productive hitters.",
    },
    {
      question: "Why do sacrifice flies affect the OBP calculation?",
      answer:
        "Sacrifice flies (SF) are included in the denominator of OBP because they represent plate appearances where the batter successfully advanced a runner without getting on base themselves. Including SF ensures OBP accurately reflects the batter's ability to reach base, excluding productive outs that don't count against on-base skills.",
    },
    {
      question: "Can OPS exceed 1.000, and what does that mean?",
      answer:
        "Yes, OPS can exceed 1.000, which indicates an exceptional offensive performance. Since OPS sums OBP and SLG, values above 1.000 suggest the player gets on base frequently and hits for significant power. Elite MLB hitters often have OPS values around or above 1.000 during peak seasons.",
    },
    {
      question: "How do doubles, triples, and home runs influence slugging percentage?",
      answer:
        "Slugging percentage weights hits by their total bases: singles count as one base, doubles two, triples three, and home runs four. Therefore, extra-base hits like doubles, triples, and home runs increase total bases more than singles, boosting SLG and reflecting a player's power hitting ability.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="atBats">At Bats (AB)</Label>
          <Input
            id="atBats"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.atBats}
            onChange={(e) => handleInputChange("atBats", e.target.value)}
            placeholder="e.g. 300"
          />
        </div>
        <div>
          <Label htmlFor="hits">Hits (H)</Label>
          <Input
            id="hits"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.hits}
            onChange={(e) => handleInputChange("hits", e.target.value)}
            placeholder="e.g. 90"
          />
        </div>
        <div>
          <Label htmlFor="doubles">Doubles (2B)</Label>
          <Input
            id="doubles"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.doubles}
            onChange={(e) => handleInputChange("doubles", e.target.value)}
            placeholder="e.g. 20"
          />
        </div>
        <div>
          <Label htmlFor="triples">Triples (3B)</Label>
          <Input
            id="triples"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.triples}
            onChange={(e) => handleInputChange("triples", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div>
          <Label htmlFor="homeRuns">Home Runs (HR)</Label>
          <Input
            id="homeRuns"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.homeRuns}
            onChange={(e) => handleInputChange("homeRuns", e.target.value)}
            placeholder="e.g. 15"
          />
        </div>
        <div>
          <Label htmlFor="walks">Walks (BB)</Label>
          <Input
            id="walks"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.walks}
            onChange={(e) => handleInputChange("walks", e.target.value)}
            placeholder="e.g. 40"
          />
        </div>
        <div>
          <Label htmlFor="hitByPitch">Hit By Pitch (HBP)</Label>
          <Input
            id="hitByPitch"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.hitByPitch}
            onChange={(e) => handleInputChange("hitByPitch", e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
        <div>
          <Label htmlFor="sacrificeFlies">Sacrifice Flies (SF)</Label>
          <Input
            id="sacrificeFlies"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={inputs.sacrificeFlies}
            onChange={(e) => handleInputChange("sacrificeFlies", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, results update automatically
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              atBats: "",
              hits: "",
              doubles: "",
              triples: "",
              homeRuns: "",
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

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700 border p-4 mt-4">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
            <AlertTriangle className="w-5 h-5" />
            <p>{results.warning}</p>
          </div>
        </Card>
      )}

      {(results.ops !== "N/A" || results.slg !== "N/A" || results.obp !== "N/A") && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center space-y-4">
            <div>
              <p className="text-3xl font-semibold text-blue-900 dark:text-white">Slugging Percentage (SLG)</p>
              <p className="text-4xl font-extrabold text-blue-800 dark:text-white">{results.slg}</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-blue-900 dark:text-white">On-Base Percentage (OBP)</p>
              <p className="text-4xl font-extrabold text-blue-800 dark:text-white">{results.obp}</p>
            </div>
            <div>
              <p className="text-3xl font-semibold text-blue-900 dark:text-white">On-Base Plus Slugging (OPS)</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.ops}</p>
            </div>
            <p className="italic text-sm text-blue-700 dark:text-blue-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Baseball OPS / SLG / OBP Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Baseball statistics have evolved significantly with the advent of sabermetrics, providing deeper insights into player performance beyond traditional metrics. Among these, OPS (On-base Plus Slugging), SLG (Slugging Percentage), and OBP (On-Base Percentage) stand out as critical indicators of a player's offensive value. This calculator helps you compute these metrics accurately using fundamental batting data.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Slugging Percentage (SLG) measures the total bases a player earns per at bat, emphasizing power hitting by weighting extra-base hits more heavily. On-Base Percentage (OBP) reflects how often a player reaches base by any means except errors or fielder's choices, including hits, walks, and hit-by-pitches. OPS combines these two metrics, offering a holistic view of a player's ability to get on base and hit for power.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding these statistics is essential for coaches, scouts, analysts, and players aiming to evaluate offensive contributions effectively. This calculator simplifies the process by requiring basic inputs such as hits, at bats, walks, and extra-base hits, then instantly providing the calculated OPS, SLG, and OBP values.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By mastering these metrics, you can better appreciate player strengths and weaknesses, make informed decisions on player development, and enhance strategic planning for games and seasons.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires entering your baseball player's key batting statistics. These include At Bats (AB), Hits (H), Doubles (2B), Triples (3B), Home Runs (HR), Walks (BB), Hit By Pitch (HBP), and Sacrifice Flies (SF). Each input field accepts only numeric values, ensuring accurate calculations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once you input the data, click the "Calculate" button to instantly see the results for Slugging Percentage, On-Base Percentage, and On-Base Plus Slugging. If any input is missing or inconsistent, the calculator will provide warnings to guide you in correcting the data.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator automatically validates your inputs to prevent impossible scenarios, such as hits exceeding at bats or extra-base hits exceeding total hits. Use the "Reset" button to clear all fields and start fresh for a new player or dataset.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the player's At Bats (AB) — the number of official batting attempts excluding walks, sacrifices, and hit-by-pitches.
          </li>
          <li>
            <strong>Step 2:</strong> Input the total Hits (H), including singles, doubles, triples, and home runs.
          </li>
          <li>
            <strong>Step 3:</strong> Specify the number of Doubles (2B), Triples (3B), and Home Runs (HR) to calculate total bases accurately.
          </li>
          <li>
            <strong>Step 4:</strong> Enter Walks (BB), Hit By Pitch (HBP), and Sacrifice Flies (SF) to complete the On-Base Percentage calculation.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view the OPS, SLG, and OBP values, which will help you analyze the player's offensive performance.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving OPS, SLG, and OBP requires a balanced approach focusing on both power and plate discipline. Players should work on hitting for extra bases by developing strength and bat speed, which directly increases slugging percentage. Incorporating drills that enhance bat control and timing can help maximize extra-base hits.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Equally important is improving on-base skills. Training to recognize pitches better and developing patience at the plate can increase walks and reduce strikeouts, boosting OBP. Practicing situational hitting and understanding pitcher tendencies also contribute to better on-base results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Coaches should emphasize video analysis and data-driven feedback to identify areas for improvement. Combining physical training with mental preparation helps players maintain consistency and adapt to different pitchers and game situations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, maintaining overall fitness and injury prevention strategies ensures players can perform at their peak throughout the season, sustaining high OPS, SLG, and OBP levels.
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
              href="https://www.baseball-reference.com/about/ops.shtml"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Baseball Reference: OPS Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive explanation of OPS, its components, and its importance in evaluating player performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.fangraphs.com/library/offense/slugging-percentage/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FanGraphs: Slugging Percentage (SLG) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed insights into slugging percentage, how it is calculated, and its role in sabermetrics.
            </p>
          </li>
          <li>
            <a
              href="https://www.mlb.com/glossary/standard-stats/on-base-percentage"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              MLB Glossary: On-Base Percentage (OBP) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official MLB resource explaining OBP, its calculation, and significance in player evaluation.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Baseball OPS / SLG / OBP Calculator"
      description="Calculate baseball sabermetrics. Find On-Base Plus Slugging (OPS), Slugging percentage, and On-Base Percentage instantly."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "SLG = (1B + 2×2B + 3×3B + 4×HR) / AB; OBP = (H + BB + HBP) / (AB + BB + HBP + SF); OPS = OBP + SLG",
        variables: [
          { symbol: "1B", description: "Singles (Hits - Doubles - Triples - Home Runs)" },
          { symbol: "2B", description: "Doubles" },
          { symbol: "3B", description: "Triples" },
          { symbol: "HR", description: "Home Runs" },
          { symbol: "AB", description: "At Bats" },
          { symbol: "H", description: "Hits" },
          { symbol: "BB", description: "Walks (Bases on Balls)" },
          { symbol: "HBP", description: "Hit By Pitch" },
          { symbol: "SF", description: "Sacrifice Flies" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player has 300 at bats, 90 hits including 20 doubles, 5 triples, and 15 home runs, with 40 walks, 3 hit by pitches, and 4 sacrifice flies.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate singles: 90 hits - (20 doubles + 5 triples + 15 home runs) = 50 singles.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total bases: (50×1) + (20×2) + (5×3) + (15×4) = 50 + 40 + 15 + 60 = 165 total bases.",
          },
          {
            label: "Step 3",
            explanation: "Calculate SLG: 165 total bases / 300 at bats = 0.550.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate OBP: (90 hits + 40 walks + 3 HBP) / (300 AB + 40 BB + 3 HBP + 4 SF) = 133 / 347 ≈ 0.383.",
          },
          {
            label: "Step 5",
            explanation: "Calculate OPS: 0.550 SLG + 0.383 OBP = 0.933.",
          },
        ],
        result: "The player's OPS is 0.933, indicating strong offensive performance.",
      }}
      relatedCalculators={[
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Plank / Hold Time Progression", url: "/sports/plank-hold-progression", icon: "🏆" },
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