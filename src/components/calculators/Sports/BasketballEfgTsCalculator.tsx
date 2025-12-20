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

export default function BasketballEfgTsCalculator() {
  const [inputs, setInputs] = useState({
    fgm: "",
    fga: "",
    threePm: "",
    fta: "",
    pts: "",
  });
  const handleInputChange = useCallback((n, v) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(v)) {
      setInputs((p) => ({ ...p, [n]: v }));
    }
  }, []);

  // Parsing inputs to numbers safely
  const fgm = parseFloat(inputs.fgm);
  const fga = parseFloat(inputs.fga);
  const threePm = parseFloat(inputs.threePm);
  const fta = parseFloat(inputs.fta);
  const pts = parseFloat(inputs.pts);

  // Calculate eFG% and TS%
  const results = useMemo(() => {
    // Validation
    if (
      isNaN(fgm) ||
      isNaN(fga) ||
      isNaN(threePm) ||
      isNaN(fta) ||
      isNaN(pts) ||
      fga === 0 ||
      fta === 0
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid numbers greater than zero for all fields.",
        formulaUsed: "",
      };
    }
    if (threePm > fgm) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Three-point made shots cannot exceed total field goals made.",
        formulaUsed: "",
      };
    }
    if (fga < fgm) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Field goals attempted cannot be less than field goals made.",
        formulaUsed: "",
      };
    }
    if (pts < 0) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Points scored cannot be negative.",
        formulaUsed: "",
      };
    }

    // Effective Field Goal Percentage (eFG%)
    // eFG% = (FGM + 0.5 * 3PM) / FGA
    const efg = (fgm + 0.5 * threePm) / fga;

    // True Shooting Percentage (TS%)
    // TS% = Points / (2 * (FGA + 0.44 * FTA))
    const ts = pts / (2 * (fga + 0.44 * fta));

    return {
      value: (
        <>
          <div className="mb-4">
            <span className="font-semibold text-lg text-blue-800 dark:text-blue-300">
              Effective Field Goal Percentage (eFG%):
            </span>{" "}
            <span className="text-4xl font-extrabold text-blue-900 dark:text-white">
              {(efg * 100).toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="font-semibold text-lg text-indigo-800 dark:text-indigo-300">
              True Shooting Percentage (TS%):
            </span>{" "}
            <span className="text-4xl font-extrabold text-indigo-900 dark:text-white">
              {(ts * 100).toFixed(2)}%
            </span>
          </div>
        </>
      ),
      label: "Results",
      subtext:
        "eFG% adjusts FG% to account for 3-point shots. TS% accounts for all scoring including free throws.",
      warning: null,
      formulaUsed:
        "eFG% = (FGM + 0.5 × 3PM) ÷ FGA; TS% = Points ÷ (2 × (FGA + 0.44 × FTA))",
    };
  }, [fgm, fga, threePm, fta, pts]);

  const faqs = [
    {
      question: "What is the difference between eFG% and TS%?",
      answer:
        "Effective Field Goal Percentage (eFG%) adjusts the traditional field goal percentage by giving extra weight to three-point shots, recognizing their higher value. True Shooting Percentage (TS%) goes further by incorporating free throws into the efficiency metric, providing a more comprehensive measure of a player's scoring efficiency across all shot types.",
    },
    {
      question: "Why is the factor 0.44 used in the TS% formula?",
      answer:
        "The 0.44 factor in the TS% formula is an empirically derived estimate representing the average number of free throw attempts per possession. It accounts for the fact that not all free throws come in pairs and some are technical or and-ones, providing a more accurate denominator for true shooting efficiency.",
    },
    {
      question: "Can eFG% or TS% exceed 100%?",
      answer:
        "In theory, both eFG% and TS% can exceed 100% if a player scores more than two points per shot attempt on average, which is extremely rare. Typically, these percentages range between 40% and 70% for professional players, reflecting realistic scoring efficiencies.",
    },
    {
      question: "How can coaches use eFG% and TS% to improve team performance?",
      answer:
        "Coaches use eFG% and TS% to evaluate player and team scoring efficiency beyond simple points per game. These metrics help identify players who maximize scoring opportunities effectively, guide shot selection strategies, and optimize offensive schemes to increase overall scoring efficiency.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fgm" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-blue-300">
              <Calculator className="w-4 h-4" /> Field Goals Made (FGM)
            </Label>
            <Input
              id="fgm"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 8"
              value={inputs.fgm}
              onChange={(e) => handleInputChange("fgm", e.target.value)}
              aria-describedby="fgm-desc"
            />
            <p id="fgm-desc" className="text-xs text-slate-500 mt-1">
              Total number of field goals made.
            </p>
          </div>
          <div>
            <Label htmlFor="fga" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-blue-300">
              <Calculator className="w-4 h-4" /> Field Goals Attempted (FGA)
            </Label>
            <Input
              id="fga"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 15"
              value={inputs.fga}
              onChange={(e) => handleInputChange("fga", e.target.value)}
              aria-describedby="fga-desc"
            />
            <p id="fga-desc" className="text-xs text-slate-500 mt-1">
              Total number of field goals attempted.
            </p>
          </div>
          <div>
            <Label htmlFor="threePm" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-blue-300">
              <Calculator className="w-4 h-4" /> Three-Point Field Goals Made (3PM)
            </Label>
            <Input
              id="threePm"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 3"
              value={inputs.threePm}
              onChange={(e) => handleInputChange("threePm", e.target.value)}
              aria-describedby="threePm-desc"
            />
            <p id="threePm-desc" className="text-xs text-slate-500 mt-1">
              Number of three-point shots made (must be ≤ FGM).
            </p>
          </div>
          <div>
            <Label htmlFor="fta" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-blue-300">
              <Calculator className="w-4 h-4" /> Free Throws Attempted (FTA)
            </Label>
            <Input
              id="fta"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 6"
              value={inputs.fta}
              onChange={(e) => handleInputChange("fta", e.target.value)}
              aria-describedby="fta-desc"
            />
            <p id="fta-desc" className="text-xs text-slate-500 mt-1">
              Total number of free throws attempted.
            </p>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="pts" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-blue-300">
              <Calculator className="w-4 h-4" /> Total Points Scored
            </Label>
            <Input
              id="pts"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 22"
              value={inputs.pts}
              onChange={(e) => handleInputChange("pts", e.target.value)}
              aria-describedby="pts-desc"
            />
            <p id="pts-desc" className="text-xs text-slate-500 mt-1">
              Total points scored by the player or team.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger calculation by re-setting inputs (no-op)
            setInputs((p) => ({ ...p }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate eFG% and TS%"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              fgm: "",
              fga: "",
              threePm: "",
              fta: "",
              pts: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <Card className="bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700 border shadow-lg">
          <CardContent className="p-6 text-center text-red-800 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            {results.value}
            <p className="mt-4 text-sm italic text-blue-700 dark:text-blue-300">{results.subtext}</p>
            <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
              <Info className="inline-block w-4 h-4 mr-1 align-text-bottom" />
              <strong>Formulas used:</strong> {results.formulaUsed}
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
          Understanding Basketball eFG% &amp; TS% Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In basketball analytics, measuring scoring efficiency is crucial for evaluating player and team performance. Traditional field goal percentage (FG%) only accounts for the ratio of shots made to shots attempted, but it treats all field goals equally regardless of their point value. This is where Effective Field Goal Percentage (eFG%) and True Shooting Percentage (TS%) come into play as more advanced metrics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Effective Field Goal Percentage (eFG%) adjusts FG% by giving extra weight to three-point shots, recognizing that a made three-pointer is worth 1.5 times a two-pointer. This adjustment provides a more accurate reflection of a player's shooting efficiency by incorporating shot value. The formula for eFG% is: <code>eFG% = (FGM + 0.5 × 3PM) ÷ FGA</code>.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          True Shooting Percentage (TS%) further expands on this concept by including free throws, which are an essential part of scoring but not captured by FG%. TS% measures a player's overall scoring efficiency by considering points scored relative to shooting attempts, including free throws. The formula is: <code>TS% = Points ÷ (2 × (FGA + 0.44 × FTA))</code>, where the factor 0.44 accounts for the average number of free throw attempts per possession.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Together, eFG% and TS% provide a comprehensive view of scoring efficiency, helping coaches, analysts, and players understand shooting performance beyond basic statistics.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate eFG% and TS%, you need to input five key statistics from a player or team's performance: Field Goals Made (FGM), Field Goals Attempted (FGA), Three-Point Field Goals Made (3PM), Free Throws Attempted (FTA), and Total Points Scored. These inputs should be numbers representing totals over a game, season, or any desired period.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once you enter these values, click the "Calculate" button. The calculator will validate your inputs to ensure logical consistency (e.g., three-point made shots cannot exceed total field goals made). If inputs are valid, it will display the eFG% and TS% results with formulas used for transparency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          If you want to start over or analyze a different player or game, simply click the "Reset" button to clear all inputs. Use these metrics to compare performances, identify strengths and weaknesses, and inform coaching or training decisions.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total Field Goals Made (FGM).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the total Field Goals Attempted (FGA).
          </li>
          <li>
            <strong>Step 3:</strong> Enter the number of Three-Point Field Goals Made (3PM).
          </li>
          <li>
            <strong>Step 4:</strong> Enter the total Free Throws Attempted (FTA).
          </li>
          <li>
            <strong>Step 5:</strong> Enter the total Points Scored.
          </li>
          <li>
            <strong>Step 6:</strong> Click "Calculate" to view your eFG% and TS% results.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your eFG% and TS% requires a combination of skill development, shot selection, and game awareness. Focus on practicing high-percentage shots such as layups, mid-range jumpers, and open three-pointers. Work on your shooting mechanics to increase consistency and confidence from all areas of the court.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate drills that simulate game scenarios, emphasizing decision-making to take smart shots rather than forcing low-percentage attempts. Understanding when to drive, pass, or shoot can significantly impact your efficiency metrics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, free throw shooting is critical for TS%. Regularly practice free throws under fatigue and pressure to maintain a high free throw percentage. Coaches should analyze these metrics to tailor training programs that address specific weaknesses and optimize offensive strategies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, use video analysis to review shot selection and efficiency, helping players visualize areas for improvement and track progress over time.
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
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.basketball-reference.com/about/glossary.html#efg"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Basketball Reference Glossary <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive definitions and explanations of basketball statistics including eFG% and TS%.
            </p>
          </li>
          <li>
            <a
              href="https://stats.nba.com/help/glossary/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NBA Stats Glossary <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official NBA resource explaining advanced metrics and their calculation methods.
            </p>
          </li>
          <li>
            <a
              href="https://www.kenpom.com/blog/2011/11/true-shooting-percentage.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Ken Pomeroy's Blog on True Shooting Percentage <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              In-depth analysis and discussion on the importance and calculation of TS% in basketball analytics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Basketball eFG% &amp; TS% Calculator"
      description="Calculate Effective Field Goal and True Shooting percentage. Measure basketball scoring efficiency accurately."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formulas",
        formula:
          "eFG% = (FGM + 0.5 × 3PM) ÷ FGA; TS% = Points ÷ (2 × (FGA + 0.44 × FTA))",
        variables: [
          { symbol: "FGM", description: "Field Goals Made" },
          { symbol: "FGA", description: "Field Goals Attempted" },
          { symbol: "3PM", description: "Three-Point Field Goals Made" },
          { symbol: "FTA", description: "Free Throws Attempted" },
          { symbol: "Points", description: "Total Points Scored" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player made 8 field goals out of 15 attempts, including 3 three-pointers, attempted 6 free throws, and scored a total of 22 points in a game.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input 8 for Field Goals Made (FGM).",
          },
          {
            label: "Step 2",
            explanation: "Input 15 for Field Goals Attempted (FGA).",
          },
          {
            label: "Step 3",
            explanation: "Input 3 for Three-Point Field Goals Made (3PM).",
          },
          {
            label: "Step 4",
            explanation: "Input 6 for Free Throws Attempted (FTA).",
          },
          {
            label: "Step 5",
            explanation: "Input 22 for Total Points Scored.",
          },
          {
            label: "Step 6",
            explanation: "Click Calculate to get eFG% and TS%.",
          },
        ],
        result:
          "eFG% = (8 + 0.5 × 3) ÷ 15 = 0.767 or 76.7%; TS% = 22 ÷ (2 × (15 + 0.44 × 6)) ≈ 0.659 or 65.9%.",
      }}
      relatedCalculators={[
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "FTP (Functional Threshold Power) Zones Planner", url: "/sports/ftp-zones-planner", icon: "🚴" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏆" },
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
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