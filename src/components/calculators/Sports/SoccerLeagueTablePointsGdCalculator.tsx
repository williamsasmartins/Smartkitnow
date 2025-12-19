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

export default function SoccerLeagueTablePointsGdCalculator() {
  /**
   * Inputs:
   * - matchesPlayed: number of matches played
   * - wins: number of wins
   * - draws: number of draws
   * - losses: number of losses
   * - goalsFor: goals scored by the team
   * - goalsAgainst: goals conceded by the team
   * - pointsPerWin: points awarded per win (usually 3)
   * - pointsPerDraw: points awarded per draw (usually 1)
   * - pointsPerLoss: points awarded per loss (usually 0)
   */

  const [inputs, setInputs] = useState({
    matchesPlayed: "",
    wins: "",
    draws: "",
    losses: "",
    goalsFor: "",
    goalsAgainst: "",
    pointsPerWin: "3",
    pointsPerDraw: "1",
    pointsPerLoss: "0",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numeric input or empty string
    if (/^\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const {
      matchesPlayed,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      pointsPerWin,
      pointsPerDraw,
      pointsPerLoss,
    } = inputs;

    // Parse inputs to integers
    const mp = parseInt(matchesPlayed, 10);
    const w = parseInt(wins, 10);
    const d = parseInt(draws, 10);
    const l = parseInt(losses, 10);
    const gf = parseInt(goalsFor, 10);
    const ga = parseInt(goalsAgainst, 10);
    const ppw = parseInt(pointsPerWin, 10);
    const ppd = parseInt(pointsPerDraw, 10);
    const ppl = parseInt(pointsPerLoss, 10);

    // Validate inputs
    if (
      isNaN(mp) || isNaN(w) || isNaN(d) || isNaN(l) || isNaN(gf) || isNaN(ga) ||
      isNaN(ppw) || isNaN(ppd) || isNaN(ppl)
    ) {
      return {
        value: "",
        label: "",
        subtext: "Please fill in all fields with valid numbers.",
        warning: null,
        formulaUsed: "",
      };
    }

    if (w + d + l !== mp) {
      return {
        value: "",
        label: "",
        subtext: "Sum of wins, draws, and losses must equal matches played.",
        warning: <AlertTriangle className="inline-block w-5 h-5 text-red-600" />,
        formulaUsed: "",
      };
    }

    if (mp === 0) {
      return {
        value: "",
        label: "",
        subtext: "Matches played must be greater than zero.",
        warning: <AlertTriangle className="inline-block w-5 h-5 text-red-600" />,
        formulaUsed: "",
      };
    }

    // Calculate total points
    const totalPoints = w * ppw + d * ppd + l * ppl;

    // Calculate goal difference
    const goalDifference = gf - ga;

    // Calculate points per game (PPG)
    const pointsPerGame = (totalPoints / mp).toFixed(2);

    // Return results with detailed label and formula
    return {
      value: `${totalPoints} pts`,
      label: "Total Points",
      subtext: `Goal Difference (GD): ${goalDifference} | Points Per Game (PPG): ${pointsPerGame}`,
      warning: null,
      formulaUsed: `Points = (Wins × ${ppw}) + (Draws × ${ppd}) + (Losses × ${ppl})`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How is the goal difference (GD) calculated?",
      answer:
        "Goal difference is calculated by subtracting the total goals conceded (Goals Against) from the total goals scored (Goals For). It is a key tiebreaker in league standings and reflects the team's overall scoring dominance or weakness.",
    },
    {
      question: "Why do wins, draws, and losses need to sum to matches played?",
      answer:
        "The sum of wins, draws, and losses must equal the total matches played to ensure data consistency and accuracy in calculating points and standings. Any discrepancy indicates incorrect input or incomplete match data.",
    },
    {
      question: "Can the points per win or draw be customized?",
      answer:
        "Yes, while the standard points system awards 3 points for a win and 1 for a draw, some leagues or tournaments may use different scoring systems. This calculator allows customization of points per win, draw, and loss to accommodate various formats.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="matchesPlayed">Matches Played</Label>
              <Input
                id="matchesPlayed"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputs.matchesPlayed}
                onChange={(e) => handleInputChange("matchesPlayed", e.target.value)}
                placeholder="e.g. 10"
              />
            </div>
            <div>
              <Label htmlFor="wins">Wins</Label>
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
              <Label htmlFor="draws">Draws</Label>
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
              <Label htmlFor="losses">Losses</Label>
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
              <Label htmlFor="goalsFor">Goals For (GF)</Label>
              <Input
                id="goalsFor"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputs.goalsFor}
                onChange={(e) => handleInputChange("goalsFor", e.target.value)}
                placeholder="e.g. 20"
              />
            </div>
            <div>
              <Label htmlFor="goalsAgainst">Goals Against (GA)</Label>
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
            <div>
              <Label htmlFor="pointsPerWin">Points per Win</Label>
              <Input
                id="pointsPerWin"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputs.pointsPerWin}
                onChange={(e) => handleInputChange("pointsPerWin", e.target.value)}
                placeholder="Usually 3"
              />
            </div>
            <div>
              <Label htmlFor="pointsPerDraw">Points per Draw</Label>
              <Input
                id="pointsPerDraw"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputs.pointsPerDraw}
                onChange={(e) => handleInputChange("pointsPerDraw", e.target.value)}
                placeholder="Usually 1"
              />
            </div>
            <div>
              <Label htmlFor="pointsPerLoss">Points per Loss</Label>
              <Input
                id="pointsPerLoss"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputs.pointsPerLoss}
                onChange={(e) => handleInputChange("pointsPerLoss", e.target.value)}
                placeholder="Usually 0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              matchesPlayed: "",
              wins: "",
              draws: "",
              losses: "",
              goalsFor: "",
              goalsAgainst: "",
              pointsPerWin: "3",
              pointsPerDraw: "1",
              pointsPerLoss: "0",
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
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{results.subtext}</p>
            {results.warning && <div className="mt-2">{results.warning}</div>}
            {results.formulaUsed && (
              <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-400">{results.formulaUsed}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Soccer League Table: Points & GD
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The soccer league table is a fundamental tool used worldwide to rank teams based on their performance throughout a season. The primary metric for ranking is the total points accumulated, which are awarded based on match outcomes—typically 3 points for a win, 1 point for a draw, and none for a loss. Alongside points, the goal difference (GD), calculated as goals scored minus goals conceded, serves as a critical tiebreaker when teams have equal points. This differential reflects both offensive strength and defensive solidity, providing a more nuanced view of team performance beyond just wins and losses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Accurate calculation of points and goal difference is essential for coaches, analysts, and fans to understand league dynamics and predict potential outcomes. The points system incentivizes teams to strive for victories while maintaining defensive discipline to optimize their goal difference. Understanding these metrics helps in strategic planning, such as prioritizing attacking play to improve GD or focusing on securing draws in tough matches to accumulate steady points.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator enables you to input your soccer team's match statistics and instantly compute the total points and goal difference, reflecting your current league standing. You can customize the points awarded per win, draw, and loss to match different league rules or tournament formats. The tool also validates your inputs to ensure data consistency, such as verifying that the sum of wins, draws, and losses equals the total matches played.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total number of matches played by your team.
          </li>
          <li>
            <strong>Step 2:</strong> Input the number of wins, draws, and losses. Ensure their sum equals matches played.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the total goals scored (Goals For) and goals conceded (Goals Against).
          </li>
          <li>
            <strong>Step 4:</strong> Adjust the points awarded per win, draw, and loss if your league uses a non-standard system.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your total points, goal difference, and points per game.
          </li>
          <li>
            <strong>Step 6:</strong> Use the "Reset" button to clear inputs and start a new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your team's league standing, focus on both offensive and defensive training. Improving goal-scoring ability not only helps secure wins but also enhances your goal difference, which can be decisive in tight league tables. Defensive drills that reduce goals conceded are equally important, as a strong defense preserves points even in challenging matches. Additionally, understanding the points system allows coaches to tailor strategies; for example, in leagues where draws yield fewer points, teams might adopt more aggressive tactics to convert draws into wins.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Monitoring your points per game (PPG) can provide insights into consistency and performance trends. A high PPG indicates strong form, while fluctuations may signal areas needing improvement. Incorporating sports science principles such as periodization, recovery optimization, and psychological resilience training can further enhance team performance across the season, ultimately improving league outcomes.
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
          For more information on soccer performance metrics, league rules, and sports science principles, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.fifa.com/football-development/technical"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              FIFA Technical Development <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official global governing body for soccer, providing rules, technical guidelines, and development resources.
            </p>
          </li>
          <li>
            <a
              href="https://www.acsm.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine (ACSM) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Leading organization in sports medicine and exercise science, offering research on athlete performance and training methodologies.
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
              Provides evidence-based strength and conditioning guidelines to optimize athletic performance and injury prevention.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Soccer League Table: Points & GD"
      description="Calculate soccer league standings. Track points, goal differential, and ranking scenarios for your team."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Points Calculation Formula",
        formula: "Points = (Wins × Points per Win) + (Draws × Points per Draw) + (Losses × Points per Loss)",
        variables: [
          { symbol: "Wins", description: "Number of matches won" },
          { symbol: "Draws", description: "Number of matches drawn" },
          { symbol: "Losses", description: "Number of matches lost" },
          { symbol: "Points per Win", description: "Points awarded for a win (usually 3)" },
          { symbol: "Points per Draw", description: "Points awarded for a draw (usually 1)" },
          { symbol: "Points per Loss", description: "Points awarded for a loss (usually 0)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A team has played 10 matches, winning 6, drawing 2, and losing 2. They scored 20 goals and conceded 10. The league awards 3 points per win and 1 per draw.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate total points: (6 wins × 3 points) + (2 draws × 1 point) + (2 losses × 0 points) = 18 + 2 + 0 = 20 points.",
          },
          {
            label: "Step 2",
            explanation: "Calculate goal difference: 20 goals scored - 10 goals conceded = +10 GD.",
          },
          {
            label: "Step 3",
            explanation: "Points per game (PPG) = Total points / Matches played = 20 / 10 = 2.0.",
          },
        ],
        result: "The team has 20 points, a goal difference of +10, and an average of 2.0 points per game.",
      }}
      relatedCalculators={[
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🚴" },
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "⚽" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "Wilks Coefficient Calculator", url: "/sports/wilks-coefficient", icon: "🏆" },
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