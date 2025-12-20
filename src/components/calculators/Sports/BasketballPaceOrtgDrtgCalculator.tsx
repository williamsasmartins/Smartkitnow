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

export default function BasketballPaceOrtgDrtgCalculator() {
  const [inputs, setInputs] = useState({
    teamPossessions: "",
    opponentPossessions: "",
    teamPoints: "",
    opponentPoints: "",
    teamOffensivePossessions: "",
    teamDefensivePossessions: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimals
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Calculation formulas reference:
  // Pace = 48 * ((Team Possessions + Opponent Possessions) / (2 * (Team Minutes Played / 5)))
  // ORtg = 100 * (Team Points / Team Offensive Possessions)
  // DRtg = 100 * (Opponent Points / Team Defensive Possessions)
  // For this calculator, we assume 48 minutes per game (standard NBA game length)

  const results = useMemo(() => {
    const {
      teamPossessions,
      opponentPossessions,
      teamPoints,
      opponentPoints,
      teamOffensivePossessions,
      teamDefensivePossessions,
    } = inputs;

    // Parse inputs to floats
    const tp = parseFloat(teamPossessions);
    const op = parseFloat(opponentPossessions);
    const tPts = parseFloat(teamPoints);
    const oPts = parseFloat(opponentPoints);
    const tOffPoss = parseFloat(teamOffensivePossessions);
    const tDefPoss = parseFloat(teamDefensivePossessions);

    // Validate inputs for Pace calculation
    // We assume 48 minutes per game and 5 players on court
    // Pace formula denominator = 2 * (48 / 5) = 2 * 9.6 = 19.2
    const denominator = 19.2;

    let pace = null;
    let ortg = null;
    let drtg = null;
    let warning = null;

    if (
      !isNaN(tp) &&
      !isNaN(op) &&
      tp > 0 &&
      op > 0
    ) {
      pace = (48 * ((tp + op) / 2)) / denominator;
      pace = Math.round(pace * 10) / 10; // round to 1 decimal
    }

    if (
      !isNaN(tPts) &&
      !isNaN(tOffPoss) &&
      tPts >= 0 &&
      tOffPoss > 0
    ) {
      ortg = (100 * tPts) / tOffPoss;
      ortg = Math.round(ortg * 10) / 10;
    }

    if (
      !isNaN(oPts) &&
      !isNaN(tDefPoss) &&
      oPts >= 0 &&
      tDefPoss > 0
    ) {
      drtg = (100 * oPts) / tDefPoss;
      drtg = Math.round(drtg * 10) / 10;
    }

    if (
      (tp !== "" && (isNaN(tp) || tp <= 0)) ||
      (op !== "" && (isNaN(op) || op <= 0)) ||
      (tPts !== "" && (isNaN(tPts) || tPts < 0)) ||
      (oPts !== "" && (isNaN(oPts) || oPts < 0)) ||
      (tOffPoss !== "" && (isNaN(tOffPoss) || tOffPoss <= 0)) ||
      (tDefPoss !== "" && (isNaN(tDefPoss) || tDefPoss <= 0))
    ) {
      warning = "Please enter valid positive numbers where required.";
    }

    return {
      pace: pace !== null ? pace.toFixed(1) : null,
      ortg: ortg !== null ? ortg.toFixed(1) : null,
      drtg: drtg !== null ? drtg.toFixed(1) : null,
      warning,
      formulaUsed:
        "Pace = 48 * ((Team Possessions + Opponent Possessions) / 2) / (2 * (48 / 5)) | ORtg = 100 * (Team Points / Team Offensive Possessions) | DRtg = 100 * (Opponent Points / Team Defensive Possessions)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Basketball Pace and why is it important?",
      answer:
        "Basketball Pace measures the number of possessions a team uses per 48 minutes, reflecting the speed and tempo of the game. A higher pace indicates a faster game with more possessions, which can lead to more scoring opportunities. Understanding pace helps coaches and analysts tailor strategies to optimize team performance and matchups.",
    },
    {
      question: "How do Offensive Rating (ORtg) and Defensive Rating (DRtg) differ?",
      answer:
        "Offensive Rating (ORtg) quantifies the number of points a team scores per 100 possessions, measuring offensive efficiency. Defensive Rating (DRtg) measures the points allowed per 100 possessions, indicating defensive effectiveness. Together, they provide a comprehensive view of a team's performance on both ends of the court.",
    },
    {
      question: "Can this calculator be used for different basketball leagues?",
      answer:
        "Yes, while the formulas are based on NBA standards (48-minute games), you can adjust inputs accordingly for other leagues with different game lengths. The calculator assumes 5 players on the court and standard possession calculations, so minor adjustments may be needed for leagues with different rules or game durations.",
    },
    {
      question: "Why do I need to input both possessions and points separately?",
      answer:
        "Possessions and points are distinct metrics: possessions represent the number of times a team has the ball to attempt scoring, while points are the actual scoring output. Offensive and Defensive Ratings rely on these separate inputs to accurately measure efficiency, so providing both ensures precise calculations.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="teamPossessions" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-white">
              <Activity className="w-4 h-4" /> Team Possessions
            </Label>
            <Input
              id="teamPossessions"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 100"
              value={inputs.teamPossessions}
              onChange={(e) => handleInputChange("teamPossessions", e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">
              Total possessions used by your team in the game.
            </p>
          </div>

          <div>
            <Label htmlFor="opponentPossessions" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-white">
              <Activity className="w-4 h-4" /> Opponent Possessions
            </Label>
            <Input
              id="opponentPossessions"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 98"
              value={inputs.opponentPossessions}
              onChange={(e) => handleInputChange("opponentPossessions", e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">
              Total possessions used by the opposing team.
            </p>
          </div>

          <div>
            <Label htmlFor="teamPoints" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-white">
              <Trophy className="w-4 h-4" /> Team Points Scored
            </Label>
            <Input
              id="teamPoints"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 110"
              value={inputs.teamPoints}
              onChange={(e) => handleInputChange("teamPoints", e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">
              Total points your team scored in the game.
            </p>
          </div>

          <div>
            <Label htmlFor="opponentPoints" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-white">
              <Flag className="w-4 h-4" /> Opponent Points Allowed
            </Label>
            <Input
              id="opponentPoints"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 105"
              value={inputs.opponentPoints}
              onChange={(e) => handleInputChange("opponentPoints", e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">
              Total points allowed by your team on defense.
            </p>
          </div>

          <div>
            <Label htmlFor="teamOffensivePossessions" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-white">
              <TrendingUp className="w-4 h-4" /> Team Offensive Possessions
            </Label>
            <Input
              id="teamOffensivePossessions"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 100"
              value={inputs.teamOffensivePossessions}
              onChange={(e) => handleInputChange("teamOffensivePossessions", e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">
              Number of possessions your team used on offense.
            </p>
          </div>

          <div>
            <Label htmlFor="teamDefensivePossessions" className="flex items-center gap-1 mb-1 font-semibold text-blue-900 dark:text-white">
              <Shield className="w-4 h-4" /> Team Defensive Possessions
            </Label>
            <Input
              id="teamDefensivePossessions"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 98"
              value={inputs.teamDefensivePossessions}
              onChange={(e) => handleInputChange("teamDefensivePossessions", e.target.value)}
            />
            <p className="text-xs text-slate-500 mt-1">
              Number of possessions your team defended.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, results update automatically
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              teamPossessions: "",
              opponentPossessions: "",
              teamPoints: "",
              opponentPoints: "",
              teamOffensivePossessions: "",
              teamDefensivePossessions: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <AlertTriangle className="text-red-600 mx-auto mt-4" size={48} />
      )}

      {results.warning && (
        <p className="text-center text-red-600 font-semibold">{results.warning}</p>
      )}

      {(results.pace || results.ortg || results.drtg) && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            {results.pace && (
              <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
                Pace: {results.pace}
              </p>
            )}
            {results.ortg && (
              <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                Offensive Rating (ORtg): {results.ortg}
              </p>
            )}
            {results.drtg && (
              <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                Defensive Rating (DRtg): {results.drtg}
              </p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-400 italic">
              Formula used: {results.formulaUsed}
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
          Understanding Basketball Pace &amp; ORtg/DRtg
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Basketball Pace is a critical metric that quantifies the tempo of a game by estimating the number of possessions a team uses per 48 minutes. It reflects how quickly a team plays, influencing scoring opportunities and overall game dynamics. A faster pace often leads to higher scoring games, while a slower pace emphasizes control and defense.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Offensive Rating (ORtg) and Defensive Rating (DRtg) are advanced efficiency metrics that measure a team’s effectiveness on each end of the court. ORtg calculates the points scored per 100 possessions, providing insight into offensive productivity. Conversely, DRtg measures points allowed per 100 possessions, highlighting defensive strength.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Together, these metrics offer a comprehensive view of team performance beyond traditional box score statistics. Coaches, analysts, and players use these numbers to identify strengths, weaknesses, and strategic adjustments needed to improve outcomes. Understanding these metrics is essential for anyone serious about basketball analytics.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator simplifies the process of computing Pace, ORtg, and DRtg using standard formulas, allowing users to analyze team performance quickly and accurately.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, you need to input key game statistics: possessions, points scored, and possessions used on offense and defense. These inputs allow the calculator to compute Pace, Offensive Rating, and Defensive Rating accurately.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Follow these steps to get your results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total possessions your team and the opponent used during the game. These numbers reflect how many times each team had the opportunity to score.
          </li>
          <li>
            <strong>Step 2:</strong> Input the total points scored by your team and the points allowed (opponent’s points). These values are essential for calculating offensive and defensive efficiency.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the number of offensive possessions your team used and the number of defensive possessions your team defended. These are necessary for the ORtg and DRtg calculations.
          </li>
          <li>
            <strong>Step 4:</strong> Click the Calculate button to see your team’s Pace, Offensive Rating, and Defensive Rating displayed instantly.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          If you make a mistake or want to start over, use the Reset button to clear all inputs.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips &amp; Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding Pace and Ratings can guide your training and game strategy. If your team’s pace is slower than desired, incorporate drills that emphasize quick transitions, fast breaks, and efficient ball movement to increase possessions and scoring chances.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To improve Offensive Rating, focus on shooting efficiency, reducing turnovers, and creating high-quality shot opportunities. Encourage players to work on shooting mechanics, pick-and-roll execution, and spacing to maximize scoring per possession.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Defensive Rating improvements come from enhancing defensive communication, positioning, and rebounding. Drills that simulate game-like defensive scenarios, closeouts, and help defense will reduce opponents’ scoring efficiency.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regularly tracking these metrics during the season allows coaches to adjust tactics and training focus dynamically, leading to sustained team improvement.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
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
              href="https://www.basketball-reference.com/about/pace.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Basketball-Reference: Pace and Ratings <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive explanation of pace, offensive rating, and defensive rating metrics used in basketball analytics.
            </p>
          </li>
          <li>
            <a
              href="https://www.nba.com/stats/help/glossary/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NBA Stats Glossary <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official NBA glossary defining key basketball statistics including possessions, pace, and efficiency ratings.
            </p>
          </li>
          <li>
            <a
              href="https://www.kenpom.com/blog/2010/11/understanding-offensive-and-defensive-ratings.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Ken Pomeroy: Understanding Offensive and Defensive Ratings <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Insightful article explaining the calculation and interpretation of ORtg and DRtg in basketball analytics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Basketball Pace &amp; ORtg/DRtg"
      description="Calculate Basketball Pace and Ratings. Analyze possessions per game and offensive/defensive efficiency metrics."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formulas Used",
        formula:
          "Pace = 48 * ((Team Possessions + Opponent Possessions) / 2) / (2 * (48 / 5)) | ORtg = 100 * (Team Points / Team Offensive Possessions) | DRtg = 100 * (Opponent Points / Team Defensive Possessions)",
        variables: [
          { symbol: "Team Possessions", description: "Number of possessions your team used" },
          { symbol: "Opponent Possessions", description: "Number of possessions opponent used" },
          { symbol: "Team Points", description: "Points scored by your team" },
          { symbol: "Opponent Points", description: "Points allowed by your team" },
          { symbol: "Team Offensive Possessions", description: "Offensive possessions used by your team" },
          { symbol: "Team Defensive Possessions", description: "Defensive possessions your team defended" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A team played a full 48-minute game with 100 possessions, scored 110 points, and allowed 105 points. The opponent had 98 possessions. The team used 100 offensive possessions and defended 98 possessions.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the possessions and points: Team Possessions = 100, Opponent Possessions = 98, Team Points = 110, Opponent Points = 105, Offensive Possessions = 100, Defensive Possessions = 98.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate Pace: 48 * ((100 + 98) / 2) / (2 * (48 / 5)) = 48 * 99 / 19.2 ≈ 2472 / 19.2 ≈ 128.75 (rounded to 128.8).",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate ORtg: 100 * (110 / 100) = 110.0 points per 100 possessions.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate DRtg: 100 * (105 / 98) ≈ 107.1 points allowed per 100 possessions.",
          },
        ],
        result:
          "Pace: 128.8, Offensive Rating: 110.0, Defensive Rating: 107.1",
      }}
      relatedCalculators={[
        { title: "Tournament Bracket Seeding Helper", url: "/sports/tournament-bracket-seeding-helper", icon: "🏆" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Bowling Score Calculator", url: "/sports/bowling-score-calculator", icon: "🏆" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "Climbing Grade Converter", url: "/sports/climbing-grade-converter-yds-french-eu", icon: "🏆" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
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

// Added missing Shield icon import for defensive possessions label
function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}