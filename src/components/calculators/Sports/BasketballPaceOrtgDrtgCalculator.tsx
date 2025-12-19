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

export default function BasketballPaceOrtgDrtgCalculator() {
  const [inputs, setInputs] = useState({
    teamMinutes: "",
    teamPossessions: "",
    teamPoints: "",
    teamOffensivePossessions: "",
    teamDefensivePossessions: "",
    teamOffensivePoints: "",
    teamDefensivePointsAllowed: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * 
   * Pace = 48 * ((Team Possessions + Opponent Possessions) / (2 * (Team Minutes Played / 5)))
   * ORtg = 100 * (Team Points / Team Offensive Possessions)
   * DRtg = 100 * (Opponent Points / Team Defensive Possessions)
   * 
   * Notes:
   * - Team Minutes Played is usually 240 minutes (48 minutes * 5 players on court)
   * - Possessions are estimated or provided by advanced stats
   * - Offensive and Defensive possessions can differ due to turnovers, offensive rebounds, etc.
   */

  const results = useMemo(() => {
    // Parse inputs as floats
    const teamMinutes = parseFloat(inputs.teamMinutes);
    const teamPossessions = parseFloat(inputs.teamPossessions);
    const teamPoints = parseFloat(inputs.teamPoints);
    const teamOffPoss = parseFloat(inputs.teamOffensivePossessions);
    const teamDefPoss = parseFloat(inputs.teamDefensivePossessions);
    const teamOffPoints = parseFloat(inputs.teamOffensivePoints);
    const teamDefPointsAllowed = parseFloat(inputs.teamDefensivePointsAllowed);

    // Validate inputs
    const validInputs =
      !isNaN(teamMinutes) && teamMinutes > 0 &&
      !isNaN(teamPossessions) && teamPossessions >= 0 &&
      !isNaN(teamPoints) && teamPoints >= 0 &&
      !isNaN(teamOffPoss) && teamOffPoss > 0 &&
      !isNaN(teamDefPoss) && teamDefPoss > 0 &&
      !isNaN(teamOffPoints) && teamOffPoints >= 0 &&
      !isNaN(teamDefPointsAllowed) && teamDefPointsAllowed >= 0;

    if (!validInputs) {
      return {
        value: null,
        label: "",
        subtext: "Please fill in all fields with valid positive numbers.",
        warning: "Incomplete or invalid input",
        formulaUsed: "",
      };
    }

    // Pace calculation
    // Pace = 48 * ((Team Possessions + Opponent Possessions) / (2 * (Team Minutes Played / 5)))
    // Here, teamPossessions = Team Possessions, opponentPossessions = teamPossessions (assumed equal)
    // Team Minutes Played is input, typically 240 (48*5)
    const pace =
      48 *
      ((teamPossessions + teamPossessions) / (2 * (teamMinutes / 5)));

    // Offensive Rating (ORtg) = 100 * (Team Points / Team Offensive Possessions)
    const ortg = 100 * (teamOffPoints / teamOffPoss);

    // Defensive Rating (DRtg) = 100 * (Opponent Points / Team Defensive Possessions)
    const drtg = 100 * (teamDefPointsAllowed / teamDefPoss);

    return {
      value: (
        <>
          <div className="mb-4">
            <span className="font-semibold text-lg">Pace:</span>{" "}
            <span className="text-xl font-bold">{pace.toFixed(2)}</span>{" "}
            <span className="text-sm text-slate-600 dark:text-slate-400">possessions per 48 minutes</span>
          </div>
          <div className="mb-4">
            <span className="font-semibold text-lg">Offensive Rating (ORtg):</span>{" "}
            <span className="text-xl font-bold">{ortg.toFixed(2)}</span>{" "}
            <span className="text-sm text-slate-600 dark:text-slate-400">points per 100 possessions</span>
          </div>
          <div>
            <span className="font-semibold text-lg">Defensive Rating (DRtg):</span>{" "}
            <span className="text-xl font-bold">{drtg.toFixed(2)}</span>{" "}
            <span className="text-sm text-slate-600 dark:text-slate-400">points allowed per 100 possessions</span>
          </div>
        </>
      ),
      label: "Basketball Pace & Ratings",
      subtext:
        "Calculated based on inputs for possessions, points, and minutes played. Ensure data accuracy for best results.",
      warning: null,
      formulaUsed:
        "Pace = 48 * ((Team Possessions + Opponent Possessions) / (2 * (Team Minutes Played / 5)))\n" +
        "ORtg = 100 * (Team Points / Team Offensive Possessions)\n" +
        "DRtg = 100 * (Opponent Points / Team Defensive Possessions)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Pace in basketball analytics?",
      answer:
        "Pace is a measure of the number of possessions a team uses per 48 minutes. It reflects the speed at which a team plays, influencing scoring opportunities and game tempo. A higher pace indicates a faster game with more possessions.",
    },
    {
      question: "How do Offensive and Defensive Ratings differ?",
      answer:
        "Offensive Rating (ORtg) quantifies the number of points a team scores per 100 possessions, measuring offensive efficiency. Defensive Rating (DRtg) measures points allowed per 100 possessions, indicating defensive effectiveness. Together, they provide a comprehensive view of team performance.",
    },
    {
      question: "Why do I need to input both offensive and defensive possessions?",
      answer:
        "Offensive and defensive possessions can differ due to turnovers, offensive rebounds, and other factors. Using separate values ensures more accurate calculation of ORtg and DRtg, reflecting true team efficiency on both ends of the court.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="teamMinutes" className="flex items-center gap-1">
                <Timer className="w-4 h-4 text-blue-600" /> Team Minutes Played (e.g., 240)
              </Label>
              <Input
                id="teamMinutes"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 240"
                value={inputs.teamMinutes}
                onChange={(e) => handleInputChange("teamMinutes", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="teamPossessions" className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-600" /> Team Possessions (Estimate)
              </Label>
              <Input
                id="teamPossessions"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 100"
                value={inputs.teamPossessions}
                onChange={(e) => handleInputChange("teamPossessions", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="teamPoints" className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-600" /> Team Points Scored
              </Label>
              <Input
                id="teamPoints"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 110"
                value={inputs.teamPoints}
                onChange={(e) => handleInputChange("teamPoints", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="teamOffensivePossessions" className="flex items-center gap-1">
                <Flag className="w-4 h-4 text-red-600" /> Team Offensive Possessions
              </Label>
              <Input
                id="teamOffensivePossessions"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 98"
                value={inputs.teamOffensivePossessions}
                onChange={(e) => handleInputChange("teamOffensivePossessions", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="teamDefensivePossessions" className="flex items-center gap-1">
                <ShieldIcon className="w-4 h-4 text-purple-600" /> Team Defensive Possessions
              </Label>
              <Input
                id="teamDefensivePossessions"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 100"
                value={inputs.teamDefensivePossessions}
                onChange={(e) => handleInputChange("teamDefensivePossessions", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="teamOffensivePoints" className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-600" /> Team Offensive Points (Usually same as Team Points)
              </Label>
              <Input
                id="teamOffensivePoints"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 110"
                value={inputs.teamOffensivePoints}
                onChange={(e) => handleInputChange("teamOffensivePoints", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="teamDefensivePointsAllowed" className="flex items-center gap-1">
                <ShieldIcon className="w-4 h-4 text-teal-600" /> Team Defensive Points Allowed
              </Label>
              <Input
                id="teamDefensivePointsAllowed"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 105"
                value={inputs.teamDefensivePointsAllowed}
                onChange={(e) => handleInputChange("teamDefensivePointsAllowed", e.target.value)}
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
            // No special action needed, results update automatically
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              teamMinutes: "",
              teamPossessions: "",
              teamPoints: "",
              teamOffensivePossessions: "",
              teamDefensivePossessions: "",
              teamOffensivePoints: "",
              teamDefensivePointsAllowed: "",
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
          <CardContent className="p-8 text-center">{results.value}</CardContent>
        </Card>
      )}

      {results.warning && (
        <div className="text-red-600 font-semibold text-center mt-4 flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {results.warning}
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Basketball Pace & ORtg/DRtg
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Basketball analytics has evolved to provide deeper insights into team performance beyond traditional box score statistics. Two of the most critical metrics in this domain are Pace and the Offensive and Defensive Ratings (ORtg and DRtg). Pace measures the tempo of the game by estimating the number of possessions a team uses per 48 minutes, which directly influences scoring opportunities and overall game flow. Teams with a higher pace tend to play faster, creating more possessions and scoring chances, while slower-paced teams emphasize control and defense.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Offensive Rating (ORtg) quantifies a team's offensive efficiency by calculating the points scored per 100 possessions. This metric normalizes scoring output regardless of pace, allowing for meaningful comparisons between teams playing at different speeds. Conversely, Defensive Rating (DRtg) measures the points allowed per 100 possessions, reflecting a team's defensive effectiveness. Together, ORtg and DRtg provide a comprehensive picture of a team's strengths and weaknesses on both ends of the court.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate calculation of these metrics requires detailed possession data, which accounts for factors such as turnovers, offensive rebounds, and free throws. This calculator enables coaches, analysts, and enthusiasts to input relevant game data and instantly compute Pace, ORtg, and DRtg, facilitating informed strategic decisions and performance evaluations.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately calculate basketball Pace and Ratings, you need to provide specific game statistics related to possessions, points, and minutes played. This calculator requires inputs for total team minutes played, estimated possessions, points scored, and separate offensive and defensive possessions and points. These inputs allow the formulas to normalize performance metrics per possession and per 48 minutes, ensuring fair comparisons across different teams and game contexts.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the total minutes played by the team (usually 240 minutes for a full 48-minute game with 5 players on court).
          </li>
          <li>
            <strong>Step 2:</strong> Input the estimated total possessions for the team and the points scored.
          </li>
          <li>
            <strong>Step 3:</strong> Provide the offensive possessions and points scored on offense.
          </li>
          <li>
            <strong>Step 4:</strong> Enter the defensive possessions and points allowed on defense.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see the Pace, Offensive Rating, and Defensive Rating.
          </li>
          <li>
            <strong>Step 6:</strong> Use the results to analyze team tempo and efficiency, adjusting strategies accordingly.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding Pace and Ratings can significantly enhance coaching strategies and player development. Teams aiming to increase scoring opportunities might focus on raising their Pace by improving transition offense and quickening shot selection. However, a faster pace can sometimes lead to defensive lapses, so balancing tempo with defensive discipline is crucial.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving Offensive Rating involves enhancing shot quality, reducing turnovers, and increasing effective field goal percentage. Coaches should emphasize efficient ball movement, spacing, and player decision-making to maximize points per possession. On the defensive end, lowering Defensive Rating requires strong communication, contesting shots, and forcing turnovers to limit opponent scoring.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regularly tracking these metrics during the season helps identify trends and areas for improvement. Integrating Pace and Ratings analysis into training sessions and game planning can lead to more targeted drills and tactical adjustments, ultimately elevating team performance.
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
          For more information on basketball analytics, training science, and performance metrics, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for athletic performance and training.
            </p>
          </li>
          <li>
            <a
              href="https://www.nba.com/stats/help/glossary"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NBA Advanced Stats Glossary <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official NBA resource explaining advanced basketball statistics including Pace, Offensive Rating, and Defensive Rating.
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
              NSCA provides research and resources on strength, conditioning, and performance optimization for athletes across sports.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Basketball Pace & ORtg/DRtg"
      description="Calculate Basketball Pace and Ratings. Analyze possessions per game and offensive/defensive efficiency metrics."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formulas Used",
        formula:
          "Pace = 48 * ((Team Possessions + Opponent Possessions) / (2 * (Team Minutes Played / 5)))\n" +
          "ORtg = 100 * (Team Points / Team Offensive Possessions)\n" +
          "DRtg = 100 * (Opponent Points / Team Defensive Possessions)",
        variables: [
          { symbol: "Team Possessions", description: "Estimated total possessions by the team" },
          { symbol: "Opponent Possessions", description: "Estimated total possessions by the opponent (usually equal to team possessions)" },
          { symbol: "Team Minutes Played", description: "Total minutes played by the team (typically 240 for a full game)" },
          { symbol: "Team Points", description: "Points scored by the team" },
          { symbol: "Team Offensive Possessions", description: "Number of possessions the team had on offense" },
          { symbol: "Team Defensive Possessions", description: "Number of possessions the team defended" },
          { symbol: "Opponent Points", description: "Points scored by the opponent" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A basketball team plays a full 48-minute game with 5 players on court, totaling 240 team minutes. The team estimates 100 possessions, scores 110 points, has 98 offensive possessions with 110 points scored, and defends 100 possessions allowing 105 points.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the total team minutes played as 240, total possessions as 100, and points scored as 110.",
          },
          {
            label: "Step 2",
            explanation:
              "Enter offensive possessions as 98 and offensive points as 110.",
          },
          {
            label: "Step 3",
            explanation:
              "Enter defensive possessions as 100 and points allowed as 105.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate to find Pace ≈ 48 * ((100 + 100) / (2 * (240 / 5))) = 100 possessions per 48 minutes, ORtg = 100 * (110 / 98) ≈ 112.24, and DRtg = 100 * (105 / 100) = 105.",
          },
        ],
        result:
          "The team plays at a pace of 100 possessions per 48 minutes, with an Offensive Rating of 112.24 points per 100 possessions and a Defensive Rating of 105 points allowed per 100 possessions.",
      }}
      relatedCalculators={[
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
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

// Helper icon for defensive possessions label (not in lucide-react, so we define a simple SVG)
function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}