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

const K_FACTOR_OPTIONS = [
  { label: "Beginner (K=40)", value: 40 },
  { label: "Intermediate (K=20)", value: 20 },
  { label: "Advanced (K=10)", value: 10 },
];

const INITIAL_INPUTS = {
  currentRating: "",
  opponentRating: "",
  matchResult: "win",
  kFactor: 20,
};

function calculateExpectedScore(playerRating: number, opponentRating: number) {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

function calculateNewRating(
  currentRating: number,
  opponentRating: number,
  matchResult: number,
  kFactor: number
) {
  const expectedScore = calculateExpectedScore(currentRating, opponentRating);
  return currentRating + kFactor * (matchResult - expectedScore);
}

export default function TennisEloRatingProgressCalculator() {
  const [inputs, setInputs] = useState(INITIAL_INPUTS);
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const currentRating = parseFloat(inputs.currentRating);
    const opponentRating = parseFloat(inputs.opponentRating);
    const kFactor = Number(inputs.kFactor);
    const matchResult = inputs.matchResult === "win" ? 1 : inputs.matchResult === "draw" ? 0.5 : 0;

    if (
      Number.isNaN(currentRating) ||
      Number.isNaN(opponentRating) ||
      Number.isNaN(kFactor) ||
      !(matchResult === 0 || matchResult === 0.5 || matchResult === 1)
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid numeric values for all fields.",
        formulaUsed: "",
      };
    }

    const expectedScore = calculateExpectedScore(currentRating, opponentRating);
    const newRating = calculateNewRating(currentRating, opponentRating, matchResult, kFactor);
    const ratingChange = newRating - currentRating;

    return {
      value: newRating.toFixed(2),
      label: `New ELO Rating (K=${kFactor})`,
      subtext: `Rating change: ${ratingChange >= 0 ? "+" : ""}${ratingChange.toFixed(2)}`,
      warning: null,
      formulaUsed: `R' = R + K × (S - E) where E = 1 / (1 + 10^((R_opponent - R) / 400))`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the ELO rating system and why is it used in tennis?",
      answer:
        "The ELO rating system is a method for calculating the relative skill levels of players in competitor-versus-competitor games such as tennis. It provides a dynamic rating that updates after each match based on the outcome and the opponent's rating, allowing for a fair and continuous assessment of player performance over time.",
    },
    {
      question: "How does the K-factor affect my rating changes?",
      answer:
        "The K-factor determines the sensitivity of your rating to match results. A higher K-factor means your rating will change more dramatically after each match, which is useful for beginners or players with fewer matches. Lower K-factors are used for advanced players to stabilize ratings and reflect consistent performance.",
    },
    {
      question: "Can this calculator handle draws or unfinished matches?",
      answer:
        "Yes, this calculator supports three match outcomes: win, draw, and loss. A draw is treated as a half-point (0.5) in the ELO formula, which adjusts ratings accordingly. Unfinished matches should not be input as they do not provide a valid result for rating calculation.",
    },
    {
      question: "How often should I update my ELO rating?",
      answer:
        "Ideally, you should update your ELO rating after every official match to maintain an accurate reflection of your current skill level. Frequent updates help track progress and adjust your rating dynamically based on recent performance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="currentRating" className="mb-1 flex items-center gap-1">
          Current Player Rating <Gauge className="w-4 h-4 text-blue-600" />
        </Label>
        <Input
          id="currentRating"
          type="number"
          min={0}
          step={1}
          placeholder="e.g. 1500"
          value={inputs.currentRating}
          onChange={(e) => handleInputChange("currentRating", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="opponentRating" className="mb-1 flex items-center gap-1">
          Opponent Rating <Flag className="w-4 h-4 text-red-600" />
        </Label>
        <Input
          id="opponentRating"
          type="number"
          min={0}
          step={1}
          placeholder="e.g. 1600"
          value={inputs.opponentRating}
          onChange={(e) => handleInputChange("opponentRating", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="matchResult" className="mb-1 flex items-center gap-1">
          Match Result <Trophy className="w-4 h-4 text-yellow-600" />
        </Label>
        <Select
          value={inputs.matchResult}
          onValueChange={(v) => handleInputChange("matchResult", v)}
          id="matchResult"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="win">Win</SelectItem>
            <SelectItem value="draw">Draw</SelectItem>
            <SelectItem value="loss">Loss</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="kFactor" className="mb-1 flex items-center gap-1">
          K-Factor <Scale className="w-4 h-4 text-green-600" />
        </Label>
        <Select
          value={inputs.kFactor}
          onValueChange={(v) => handleInputChange("kFactor", Number(v))}
          id="kFactor"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {K_FACTOR_OPTIONS.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update, no extra action needed
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs(INITIAL_INPUTS)}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <p className="text-red-600 font-semibold text-center">{results.warning}</p>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-xl font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-lg text-blue-600 dark:text-blue-400 mt-1">{results.subtext}</p>
            <p className="mt-4 text-sm italic text-slate-600 dark:text-slate-400">
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
          Understanding Tennis ELO / Rating Progress
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The ELO rating system is a widely respected method for quantifying the skill levels of players in competitive sports, including tennis. Originally developed for chess, it has been adapted to tennis to provide a dynamic and fair ranking system that updates after each match. The system calculates the expected outcome of a match based on the current ratings of both players and adjusts their ratings accordingly depending on the actual result.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In tennis, a player’s ELO rating increases when they win matches against higher-rated opponents and decreases when they lose to lower-rated players. This dynamic adjustment reflects the relative difficulty of each match and rewards players who outperform expectations. The system is designed to be self-correcting, meaning that as players improve or decline in skill, their ratings will adjust to reflect their current level.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The K-factor is a crucial component of the ELO system that controls how much a player’s rating changes after each match. Beginners or players with fewer matches typically have a higher K-factor, allowing their ratings to change more rapidly as they establish their skill level. More experienced players have a lower K-factor to stabilize their ratings and prevent large fluctuations from single match results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding how your ELO rating progresses can help you track your development as a tennis player, set realistic goals, and strategize your match play. It provides an objective measure of your competitive standing and helps identify areas for improvement.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator allows you to estimate your new ELO rating after a tennis match by inputting your current rating, your opponent’s rating, the match result, and the K-factor that best represents your experience level. The calculator then applies the ELO formula to provide your updated rating and the rating change.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Follow these steps to use the calculator effectively:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your current ELO rating. If you are new to the system, a starting rating of 1500 is common.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your opponent’s current ELO rating. This helps the calculator determine the expected outcome of the match.
          </li>
          <li>
            <strong>Step 3:</strong> Select the match result: win, draw, or loss. This reflects the actual outcome of the match.
          </li>
          <li>
            <strong>Step 4:</strong> Choose the appropriate K-factor based on your experience level. Beginners should select a higher K-factor for faster rating adjustments.
          </li>
          <li>
            <strong>Step 5:</strong> Click “Calculate” to see your new rating and the rating change resulting from the match.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          Use this tool regularly after matches to keep your rating current and to monitor your progress over time.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your ELO rating in tennis requires a combination of skill development, strategic match play, and consistent training. Focus on strengthening your technical skills such as serve accuracy, groundstrokes, and volleying to gain an edge during matches.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Analyze your opponents’ playing styles and adapt your strategy accordingly. For example, against aggressive baseline players, consider using slice shots and drop shots to disrupt their rhythm. Against defensive players, focus on patience and constructing points carefully.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Physical conditioning is equally important. Incorporate endurance, agility, and strength training into your routine to maintain peak performance throughout matches. Mental toughness and focus can also influence match outcomes, so practice visualization and stress management techniques.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regularly review your match results and use the ELO rating progress as feedback to identify strengths and weaknesses. Set incremental goals to improve your rating steadily and celebrate milestones to stay motivated.
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
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Elo_rating_system"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Wikipedia: ELO Rating System <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive overview of the ELO rating system, its history, and applications in various sports.
            </p>
          </li>
          <li>
            <a
              href="https://www.tennisabstract.com/blog/elo-ratings-explained/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Tennis Abstract: ELO Ratings Explained <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Detailed explanation of how ELO ratings are applied specifically to tennis players and match outcomes.
            </p>
          </li>
          <li>
            <a
              href="https://www.atptour.com/en/stats/elo-ratings"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              ATP Tour: ELO Ratings and Player Rankings <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official ATP resource showing how ELO ratings influence professional tennis player rankings.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tennis ELO / Rating Progress"
      description="Track Tennis ELO rating progress. Understand how match wins and losses affect your player ranking."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "ELO Rating Formula",
        formula: "R' = R + K × (S - E)",
        variables: [
          { symbol: "R", description: "Current player rating" },
          { symbol: "R'", description: "New player rating" },
          { symbol: "K", description: "K-factor (rating adjustment sensitivity)" },
          { symbol: "S", description: "Actual match result (1=win, 0.5=draw, 0=loss)" },
          {
            symbol: "E",
            description:
              "Expected score = 1 / (1 + 10^((R_opponent - R) / 400))",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player with a current rating of 1500 plays against an opponent rated 1600 and wins the match. The player uses a K-factor of 20.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate the expected score: E = 1 / (1 + 10^((1600 - 1500) / 400)) ≈ 0.36",
          },
          {
            label: "Step 2",
            explanation:
              "Determine the actual score: S = 1 (win)",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate the rating change: ΔR = 20 × (1 - 0.36) = 12.8",
          },
          {
            label: "Step 4",
            explanation:
              "Update the rating: New rating = 1500 + 12.8 = 1512.8",
          },
        ],
        result: "The player's new ELO rating is 1512.8, reflecting the win against a higher-rated opponent.",
      }}
      relatedCalculators={[
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
        { title: "Calories Burned per Workout (MET)", url: "/sports/calories-burned-met", icon: "🔥" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
        { title: "Baseball OPS / SLG / OBP Calculator", url: "/sports/baseball-ops-slg-obp", icon: "⚽" },
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