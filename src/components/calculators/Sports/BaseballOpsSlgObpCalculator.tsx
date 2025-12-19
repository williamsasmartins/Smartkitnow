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
    hits: "",
    doubles: "",
    triples: "",
    homeRuns: "",
    atBats: "",
    walks: "",
    hitByPitch: "",
    sacrificeFlies: "",
    plateAppearances: "",
  });

  const handleInputChange = useCallback((n, v) => {
    // Allow only digits and empty string
    if (v === "" || /^\d+$/.test(v)) {
      setInputs((p) => ({ ...p, [n]: v }));
    }
  }, []);

  // Parsing inputs to numbers or zero
  const parsed = useMemo(() => {
    return {
      hits: Number(inputs.hits) || 0,
      doubles: Number(inputs.doubles) || 0,
      triples: Number(inputs.triples) || 0,
      homeRuns: Number(inputs.homeRuns) || 0,
      atBats: Number(inputs.atBats) || 0,
      walks: Number(inputs.walks) || 0,
      hitByPitch: Number(inputs.hitByPitch) || 0,
      sacrificeFlies: Number(inputs.sacrificeFlies) || 0,
      plateAppearances: Number(inputs.plateAppearances) || 0,
    };
  }, [inputs]);

  const results = useMemo(() => {
    const {
      hits,
      doubles,
      triples,
      homeRuns,
      atBats,
      walks,
      hitByPitch,
      sacrificeFlies,
      plateAppearances,
    } = parsed;

    // Validation warnings
    let warning = null;
    if (atBats === 0) {
      warning = "At-Bats cannot be zero for SLG calculation.";
    }
    if (
      plateAppearances === 0 &&
      (walks > 0 || hitByPitch > 0 || sacrificeFlies > 0)
    ) {
      warning =
        "Plate Appearances is zero, but other stats require it for OBP calculation.";
    }

    // Calculate Singles
    const singles = hits - doubles - triples - homeRuns;
    if (singles < 0) {
      warning =
        "Sum of doubles, triples, and home runs exceeds total hits. Please check inputs.";
    }

    // Slugging Percentage (SLG) = Total Bases / At Bats
    // Total Bases = 1*Singles + 2*Doubles + 3*Triples + 4*Home Runs
    const totalBases =
      singles * 1 + doubles * 2 + triples * 3 + homeRuns * 4;
    const slg = atBats > 0 ? totalBases / atBats : null;

    // On-Base Percentage (OBP) = (Hits + Walks + Hit By Pitch) / (At Bats + Walks + Hit By Pitch + Sacrifice Flies)
    const obpDenominator =
      atBats + walks + hitByPitch + sacrificeFlies;
    const obp =
      obpDenominator > 0
        ? (hits + walks + hitByPitch) / obpDenominator
        : null;

    // On-Base Plus Slugging (OPS) = OBP + SLG
    const ops =
      obp !== null && slg !== null ? obp + slg : null;

    return {
      slg: slg !== null ? slg.toFixed(3) : "N/A",
      obp: obp !== null ? obp.toFixed(3) : "N/A",
      ops: ops !== null ? ops.toFixed(3) : "N/A",
      warning,
      formulaUsed:
        "SLG = Total Bases / At Bats; OBP = (Hits + Walks + HBP) / (At Bats + Walks + HBP + Sacrifice Flies); OPS = OBP + SLG",
    };
  }, [parsed]);

  const faqs = [
    {
      question: "What is Slugging Percentage (SLG) in baseball?",
      answer:
        "Slugging Percentage (SLG) measures the total number of bases a player records per at-bat. It accounts for the power of a hitter by weighting extra-base hits more heavily than singles, providing insight into a player’s ability to hit for power.",
    },
    {
      question: "How is On-Base Percentage (OBP) different from batting average?",
      answer:
        "On-Base Percentage (OBP) calculates how often a player reaches base by any means (hits, walks, hit by pitch), while batting average only considers hits per at-bat. OBP is a more comprehensive measure of a player’s ability to avoid making outs.",
    },
    {
      question: "Why is OPS considered an important sabermetric?",
      answer:
        "OPS combines On-Base Percentage and Slugging Percentage to provide a single metric that reflects a player’s overall offensive value, balancing their ability to get on base and hit for power. It is widely used in sabermetrics to evaluate hitter performance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hits" className="mb-1 flex items-center gap-1">
                Hits <Calculator className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="hits"
                type="text"
                inputMode="numeric"
                value={inputs.hits}
                onChange={(e) => handleInputChange("hits", e.target.value)}
                placeholder="Total Hits"
              />
            </div>
            <div>
              <Label htmlFor="doubles" className="mb-1 flex items-center gap-1">
                Doubles <TrendingUp className="w-4 h-4 text-green-600" />
              </Label>
              <Input
                id="doubles"
                type="text"
                inputMode="numeric"
                value={inputs.doubles}
                onChange={(e) => handleInputChange("doubles", e.target.value)}
                placeholder="Number of Doubles"
              />
            </div>
            <div>
              <Label htmlFor="triples" className="mb-1 flex items-center gap-1">
                Triples <Flame className="w-4 h-4 text-red-600" />
              </Label>
              <Input
                id="triples"
                type="text"
                inputMode="numeric"
                value={inputs.triples}
                onChange={(e) => handleInputChange("triples", e.target.value)}
                placeholder="Number of Triples"
              />
            </div>
            <div>
              <Label htmlFor="homeRuns" className="mb-1 flex items-center gap-1">
                Home Runs <Trophy className="w-4 h-4 text-yellow-600" />
              </Label>
              <Input
                id="homeRuns"
                type="text"
                inputMode="numeric"
                value={inputs.homeRuns}
                onChange={(e) => handleInputChange("homeRuns", e.target.value)}
                placeholder="Number of Home Runs"
              />
            </div>
            <div>
              <Label htmlFor="atBats" className="mb-1 flex items-center gap-1">
                At Bats <Activity className="w-4 h-4 text-purple-600" />
              </Label>
              <Input
                id="atBats"
                type="text"
                inputMode="numeric"
                value={inputs.atBats}
                onChange={(e) => handleInputChange("atBats", e.target.value)}
                placeholder="Total At Bats"
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
                value={inputs.walks}
                onChange={(e) => handleInputChange("walks", e.target.value)}
                placeholder="Number of Walks"
              />
            </div>
            <div>
              <Label htmlFor="hitByPitch" className="mb-1 flex items-center gap-1">
                Hit By Pitch (HBP) <AlertTriangle className="w-4 h-4 text-orange-600" />
              </Label>
              <Input
                id="hitByPitch"
                type="text"
                inputMode="numeric"
                value={inputs.hitByPitch}
                onChange={(e) => handleInputChange("hitByPitch", e.target.value)}
                placeholder="Times Hit By Pitch"
              />
            </div>
            <div>
              <Label htmlFor="sacrificeFlies" className="mb-1 flex items-center gap-1">
                Sacrifice Flies (SF) <Flag className="w-4 h-4 text-gray-600" />
              </Label>
              <Input
                id="sacrificeFlies"
                type="text"
                inputMode="numeric"
                value={inputs.sacrificeFlies}
                onChange={(e) => handleInputChange("sacrificeFlies", e.target.value)}
                placeholder="Number of Sacrifice Flies"
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
              hits: "",
              doubles: "",
              triples: "",
              homeRuns: "",
              atBats: "",
              walks: "",
              hitByPitch: "",
              sacrificeFlies: "",
              plateAppearances: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700">
          <CardContent className="text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {!results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-white">
                Slugging Percentage (SLG)
              </h3>
              <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
                {results.slg}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-white">
                On-Base Percentage (OBP)
              </h3>
              <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
                {results.obp}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-white">
                On-Base Plus Slugging (OPS)
              </h3>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.ops}
              </p>
            </div>
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
          Baseball statistics have evolved significantly with the advent of sabermetrics,
          which provide deeper insights into player performance beyond traditional metrics.
          Among these, On-Base Percentage (OBP), Slugging Percentage (SLG), and On-Base Plus Slugging (OPS)
          are critical indicators of a hitter’s effectiveness. OBP measures how frequently a player reaches base,
          SLG quantifies the power of a hitter by accounting for total bases earned per at-bat,
          and OPS combines these two metrics to give a comprehensive view of offensive productivity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator enables players, coaches, analysts, and fans to quickly compute these key statistics
          by inputting fundamental hitting data such as hits, doubles, triples, home runs, walks, and more.
          Understanding these metrics helps in evaluating player value, making strategic decisions,
          and comparing performances across different seasons or leagues.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The formulas used are standardized in baseball analytics and are widely accepted by professional
          organizations and sabermetricians. Accurate input of data ensures reliable results that can be used
          for scouting, training, and performance analysis.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To calculate OPS, SLG, and OBP, you need to enter the relevant hitting statistics from a player's performance.
          This includes the total number of hits, breakdown of extra-base hits (doubles, triples, home runs),
          at-bats, walks, hit by pitch, and sacrifice flies. The calculator will then process these inputs to provide
          the three key metrics instantly.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of hits, including singles, doubles, triples, and home runs.
          </li>
          <li>
            <strong>Step 2:</strong> Input the number of at-bats, which excludes walks and sacrifices.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the number of walks (bases on balls), hit by pitch occurrences, and sacrifice flies.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to compute SLG, OBP, and OPS.
          </li>
          <li>
            <strong>Step 5:</strong> Review the results and any warnings or notes to ensure data accuracy.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          If you need to start over, use the "Reset" button to clear all inputs. This tool is designed to be user-friendly
          and provide immediate feedback for baseball performance analysis.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving OPS, SLG, and OBP requires a combination of skill development, strategic plate discipline,
          and physical conditioning. Players should focus on enhancing their hitting mechanics to increase power,
          which directly impacts slugging percentage. Strength training and bat speed drills can contribute significantly
          to extra-base hits.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, plate discipline is crucial for raising on-base percentage. Learning to recognize pitches,
          drawing walks, and avoiding unnecessary swings can help a player reach base more frequently.
          Mental preparation and video analysis of pitchers can also improve decision-making at the plate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Coaches should tailor training programs to balance power hitting and on-base skills,
          ensuring players develop a well-rounded offensive profile. Regularly tracking these metrics
          using this calculator can help monitor progress and adjust training focus accordingly.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on baseball statistics, training science, and performance analysis,
          consult the following authoritative sources:
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
              href="https://www.mlb.com/glossary/standard-stats"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Major League Baseball (MLB) Glossary <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official definitions and explanations of baseball statistics and sabermetrics used in professional baseball.
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
              Premier organization dedicated to the research and dissemination of baseball history and statistics.
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
          "SLG = Total Bases / At Bats; OBP = (Hits + Walks + HBP) / (At Bats + Walks + HBP + Sacrifice Flies); OPS = OBP + SLG",
        variables: [
          { symbol: "SLG", description: "Slugging Percentage" },
          { symbol: "OBP", description: "On-Base Percentage" },
          { symbol: "OPS", description: "On-Base Plus Slugging" },
          { symbol: "HBP", description: "Hit By Pitch" },
          { symbol: "SF", description: "Sacrifice Flies" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player has 150 hits, including 30 doubles, 5 triples, and 25 home runs, with 500 at-bats, 60 walks, 5 hit by pitch, and 4 sacrifice flies in a season.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate total bases: Singles = 150 - 30 - 5 - 25 = 90; Total Bases = (90*1) + (30*2) + (5*3) + (25*4) = 90 + 60 + 15 + 100 = 265.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate SLG: 265 total bases / 500 at-bats = 0.530.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate OBP: (150 hits + 60 walks + 5 HBP) / (500 at-bats + 60 walks + 5 HBP + 4 SF) = 215 / 569 ≈ 0.378.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate OPS: OBP (0.378) + SLG (0.530) = 0.908.",
          },
        ],
        result:
          "The player's OPS is 0.908, indicating a strong offensive performance combining power and on-base skills.",
      }}
      relatedCalculators={[
        {
          title: "Heart-Rate Zones Calculator (Karvonen Method)",
          url: "/sports/heart-rate-zones-karvonen",
          icon: "🔥",
        },
        {
          title: "Basketball Pace & ORtg/DRtg",
          url: "/sports/basketball-pace-ortg-drtg",
          icon: "🏃",
        },
        {
          title: "Calorie Deficit / Surplus Calculator",
          url: "/sports/calorie-deficit-surplus",
          icon: "🔥",
        },
        {
          title: "Negative Split Race Planner",
          url: "/sports/negative-split",
          icon: "🏆",
        },
        {
          title: "Fitness Age Calculator",
          url: "/sports/fitness-age-calculator",
          icon: "🏆",
        },
        {
          title: "Bowling Score Calculator",
          url: "/sports/bowling-score-calculator",
          icon: "🏆",
        },
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