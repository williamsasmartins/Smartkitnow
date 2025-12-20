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

export default function SoccerLeagueTablePointsGdCalculator() {
  // Inputs: Number of matches played, wins, draws, losses, goals for, goals against
  const [inputs, setInputs] = useState({
    played: "",
    wins: "",
    draws: "",
    losses: "",
    goalsFor: "",
    goalsAgainst: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and empty string
    if (/^\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Calculate points and goal difference
  const results = useMemo(() => {
    const played = Number(inputs.played);
    const wins = Number(inputs.wins);
    const draws = Number(inputs.draws);
    const losses = Number(inputs.losses);
    const goalsFor = Number(inputs.goalsFor);
    const goalsAgainst = Number(inputs.goalsAgainst);

    // Validation
    if (
      played === 0 ||
      wins === 0 && draws === 0 && losses === 0 ||
      played !== wins + draws + losses ||
      played < 0 ||
      wins < 0 ||
      draws < 0 ||
      losses < 0 ||
      goalsFor < 0 ||
      goalsAgainst < 0
    ) {
      return {
        value: null,
        label: null,
        subtext: "Please ensure all inputs are valid and consistent (e.g., played = wins + draws + losses).",
        warning: "Input validation error",
        formulaUsed: "Points = (Wins × 3) + (Draws × 1); Goal Difference = Goals For - Goals Against",
      };
    }

    const points = wins * 3 + draws * 1;
    const goalDifference = goalsFor - goalsAgainst;

    return {
      value: `${points} pts`,
      label: "Total Points",
      subtext: `Goal Difference: ${goalDifference >= 0 ? "+" : ""}${goalDifference}`,
      warning: null,
      formulaUsed: "Points = (Wins × 3) + (Draws × 1); Goal Difference = Goals For - Goals Against",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How are points calculated in a soccer league table?",
      answer:
        "Points in soccer leagues are typically awarded based on match outcomes: 3 points for a win, 1 point for a draw, and 0 points for a loss. This system incentivizes teams to play for a win rather than settle for a draw, promoting competitive matches throughout the season.",
    },
    {
      question: "What is goal difference and why is it important?",
      answer:
        "Goal difference (GD) is the difference between goals scored (Goals For) and goals conceded (Goals Against). It is used as a tiebreaker when teams have equal points, reflecting the overall performance and strength of a team’s offense and defense.",
    },
    {
      question: "Can this calculator handle incomplete or inconsistent data?",
      answer:
        "The calculator validates inputs to ensure consistency, such as verifying that the total matches played equals the sum of wins, draws, and losses. If inputs are inconsistent or incomplete, it will prompt you to correct them to provide accurate results.",
    },
    {
      question: "How can I use this calculator to analyze my team’s league standing?",
      answer:
        "By inputting your team’s current match statistics, you can quickly determine total points and goal difference. This helps you understand your position relative to competitors and strategize for upcoming matches to improve your ranking.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="played" className="mb-1 flex items-center gap-1">
              Matches Played <Activity className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="played"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputs.played}
              onChange={(e) => handleInputChange("played", e.target.value)}
              placeholder="e.g. 10"
            />
          </div>
          <div>
            <Label htmlFor="wins" className="mb-1 flex items-center gap-1">
              Wins <Trophy className="w-4 h-4 text-yellow-600" />
            </Label>
            <Input
              id="wins"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputs.wins}
              onChange={(e) => handleInputChange("wins", e.target.value)}
              placeholder="e.g. 6"
            />
          </div>
          <div>
            <Label htmlFor="draws" className="mb-1 flex items-center gap-1">
              Draws <Flag className="w-4 h-4 text-gray-600" />
            </Label>
            <Input
              id="draws"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputs.draws}
              onChange={(e) => handleInputChange("draws", e.target.value)}
              placeholder="e.g. 2"
            />
          </div>
          <div>
            <Label htmlFor="losses" className="mb-1 flex items-center gap-1">
              Losses <AlertTriangle className="w-4 h-4 text-red-600" />
            </Label>
            <Input
              id="losses"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputs.losses}
              onChange={(e) => handleInputChange("losses", e.target.value)}
              placeholder="e.g. 2"
            />
          </div>
          <div>
            <Label htmlFor="goalsFor" className="mb-1 flex items-center gap-1">
              Goals For <Flame className="w-4 h-4 text-orange-500" />
            </Label>
            <Input
              id="goalsFor"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputs.goalsFor}
              onChange={(e) => handleInputChange("goalsFor", e.target.value)}
              placeholder="e.g. 18"
            />
          </div>
          <div>
            <Label htmlFor="goalsAgainst" className="mb-1 flex items-center gap-1">
              Goals Against <ShieldIcon className="w-4 h-4 text-gray-700" />
            </Label>
            <Input
              id="goalsAgainst"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputs.goalsAgainst}
              onChange={(e) => handleInputChange("goalsAgainst", e.target.value)}
              placeholder="e.g. 10"
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, results update automatically
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              played: "",
              wins: "",
              draws: "",
              losses: "",
              goalsFor: "",
              goalsAgainst: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-xl font-semibold text-blue-700 dark:text-blue-300">{results.subtext}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <p className="text-red-600 font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {results.warning}
        </p>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Soccer League Table: Points &amp; GD
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Soccer league tables are essential tools for tracking team performance throughout a season. They summarize results by showing the number of matches played, wins, draws, losses, goals scored, goals conceded, and ultimately the points accumulated. Points are the primary metric used to rank teams, rewarding victories and draws while penalizing losses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Goal difference (GD) is a critical secondary metric that reflects the net goals a team has scored versus conceded. It serves as a tiebreaker when teams have equal points, providing insight into the offensive and defensive strengths of a team. A positive goal difference often correlates with higher league standings.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding these metrics helps coaches, analysts, and fans evaluate team performance, strategize for upcoming matches, and predict potential league outcomes. This calculator simplifies the process by allowing you to input your team’s match data and instantly see the points and goal difference.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By mastering these concepts, you can better appreciate the dynamics of league competitions and make informed decisions to improve your team’s chances of success.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to help you quickly compute your soccer team’s total points and goal difference based on match results. To use it effectively, you need to provide accurate data about your team’s performance in the league.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Begin by entering the total number of matches played, followed by the number of wins, draws, and losses. Ensure that the sum of wins, draws, and losses equals the total matches played to maintain data consistency. Next, input the total goals your team has scored (Goals For) and the goals conceded (Goals Against).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once all inputs are entered, click the Calculate button to see your team’s total points and goal difference displayed prominently. If any inputs are inconsistent or invalid, the calculator will prompt you to correct them before proceeding.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total matches played.
          </li>
          <li>
            <strong>Step 2:</strong> Input the number of wins, draws, and losses (ensure their sum equals matches played).
          </li>
          <li>
            <strong>Step 3:</strong> Enter goals scored (Goals For) and goals conceded (Goals Against).
          </li>
          <li>
            <strong>Step 4:</strong> Click Calculate to view points and goal difference.
          </li>
          <li>
            <strong>Step 5:</strong> Use the Reset button to clear inputs and start over.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips &amp; Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your team’s league standing requires a balanced approach focusing on both offensive and defensive capabilities. Training sessions should emphasize tactical awareness, physical conditioning, and mental resilience to maximize performance across all matches.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To boost points, prioritize strategies that increase your chances of winning, such as improving finishing skills, set-piece effectiveness, and maintaining possession. However, minimizing goals conceded is equally vital; defensive drills, communication, and positioning can reduce losses and improve goal difference.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Regularly analyzing your team’s league table metrics using this calculator can help identify areas needing improvement. For example, a strong points tally but poor goal difference might indicate defensive weaknesses, while a positive goal difference with fewer points could suggest missed opportunities to convert draws into wins.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Consistent training, tactical flexibility, and data-driven adjustments are key to climbing the league table and achieving long-term success.
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
              href="https://www.fifa.com/football-development/technical-analysis/football-technical-reports"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FIFA Technical Reports <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official technical analysis and reports from FIFA covering league structures, points systems, and performance metrics.
            </p>
          </li>
          <li>
            <a
              href="https://www.uefa.com/insideuefa/protecting-the-game/football-development/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              UEFA Football Development <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              UEFA’s resources on football development, including league ranking criteria and statistical insights.
            </p>
          </li>
          <li>
            <a
              href="https://www.sportsperformancebulletin.com/endurance-training/soccer-training/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Sports Performance Bulletin: Soccer Training <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Expert articles on training methodologies and strategies to improve soccer team performance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Soccer League Table: Points &amp; GD"
      description="Calculate soccer league standings. Track points, goal differential, and ranking scenarios for your team."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Points = (Wins × 3) + (Draws × 1); Goal Difference = Goals For - Goals Against",
        variables: [
          { symbol: "Wins", description: "Number of matches won" },
          { symbol: "Draws", description: "Number of matches drawn" },
          { symbol: "Goals For", description: "Total goals scored by the team" },
          { symbol: "Goals Against", description: "Total goals conceded by the team" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A team has played 10 matches, winning 6, drawing 2, and losing 2. They have scored 18 goals and conceded 10.",
        steps: [
          {
            label: "Step 1",
            explanation: "Confirm total matches played equals sum of wins, draws, and losses: 6 + 2 + 2 = 10.",
          },
          {
            label: "Step 2",
            explanation: "Calculate points: (6 wins × 3) + (2 draws × 1) = 18 + 2 = 20 points.",
          },
          {
            label: "Step 3",
            explanation: "Calculate goal difference: 18 goals for - 10 goals against = +8 GD.",
          },
        ],
        result: "The team has 20 points with a goal difference of +8.",
      }}
      relatedCalculators={[
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
        { title: "TDEE Calculator (Sports)", url: "/sports/tdee-calculator", icon: "🏆" },
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "🏆" },
        { title: "Plate Loading Calculator", url: "/sports/plate-loading", icon: "🏆" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
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

// Additional icon for Goals Against (defense)
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
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