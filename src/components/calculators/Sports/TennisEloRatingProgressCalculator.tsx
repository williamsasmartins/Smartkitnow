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

function calculateExpectedScore(playerRating: number, opponentRating: number) {
  // ELO expected score formula
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

function calculateNewRating(playerRating: number, opponentRating: number, score: number, kFactor: number) {
  // score: 1 = win, 0.5 = draw, 0 = loss
  const expected = calculateExpectedScore(playerRating, opponentRating);
  return playerRating + kFactor * (score - expected);
}

export default function TennisEloRatingProgressCalculator() {
  const [inputs, setInputs] = useState({
    currentRating: "",
    opponentRating: "",
    matchResult: "win",
    kFactor: "32",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const currentRating = Number(inputs.currentRating);
    const opponentRating = Number(inputs.opponentRating);
    const kFactor = Number(inputs.kFactor);
    if (
      isNaN(currentRating) ||
      isNaN(opponentRating) ||
      isNaN(kFactor) ||
      currentRating < 100 ||
      opponentRating < 100 ||
      kFactor <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid numeric values (ratings ≥ 100, K-factor > 0).",
        formulaUsed: null,
      };
    }

    let score = 0;
    if (inputs.matchResult === "win") score = 1;
    else if (inputs.matchResult === "draw") score = 0.5;
    else score = 0;

    const expectedScore = calculateExpectedScore(currentRating, opponentRating);
    const newRating = calculateNewRating(currentRating, opponentRating, score, kFactor);
    const ratingChange = newRating - currentRating;

    return {
      value: newRating.toFixed(1),
      label: "New ELO Rating",
      subtext: `Rating change: ${ratingChange >= 0 ? "+" : ""}${ratingChange.toFixed(1)} (Expected score: ${expectedScore.toFixed(3)})`,
      warning: null,
      formulaUsed:
        "R' = R + K × (S - E), where R = current rating, S = match score (1=win, 0.5=draw, 0=loss), E = expected score",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the ELO rating system and why is it used in tennis?",
      answer:
        "The ELO rating system is a method for calculating the relative skill levels of players in competitor-versus-competitor games. In tennis, it provides a dynamic and statistically grounded way to track player performance over time, adjusting ratings based on match outcomes and opponent strength. This system helps to objectively rank players beyond simple win-loss records.",
    },
    {
      question: "How does the K-factor affect rating changes?",
      answer:
        "The K-factor determines the maximum possible rating change after a match. A higher K-factor means ratings adjust more quickly, which is useful for new or rapidly improving players. Conversely, a lower K-factor stabilizes ratings for established players, preventing large fluctuations from single match results. Typical tennis K-factors range from 16 to 32 depending on competition level.",
    },
    {
      question: "Can this calculator handle draws or unfinished matches?",
      answer:
        "While tennis matches rarely end in draws, the ELO system can accommodate draws by assigning a score of 0.5. For unfinished matches or retirements, the system typically treats them as wins or losses depending on the circumstances. This calculator allows input for win, loss, or draw to reflect these scenarios accurately.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentRating" className="mb-1 flex items-center gap-1">
              Current Player Rating <Calculator className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="currentRating"
              type="number"
              min={100}
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
              min={100}
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
              id="matchResult"
              value={inputs.matchResult}
              onValueChange={(v) => handleInputChange("matchResult", v)}
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
            <Input
              id="kFactor"
              type="number"
              min={1}
              max={64}
              step={1}
              placeholder="e.g. 32"
              value={inputs.kFactor}
              onChange={(e) => handleInputChange("kFactor", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, results update automatically
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              currentRating: "",
              opponentRating: "",
              matchResult: "win",
              kFactor: "32",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700 p-4">
          <p className="text-red-700 dark:text-red-300 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {results.warning}
          </p>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Tennis ELO / Rating Progress</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The ELO rating system, originally developed for chess by Arpad Elo, has been widely adapted for tennis to provide a dynamic and statistically robust method of ranking players. Unlike traditional ranking systems that rely solely on tournament points, ELO ratings adjust after every match based on the relative skill levels of opponents and match outcomes. This continuous update mechanism allows for a more accurate reflection of a player's current form and skill progression.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          In tennis, each player's rating changes after a match depending on whether they win, lose, or draw (rare in tennis). The amount of rating points gained or lost is influenced by the difference in ratings between the two players and a constant called the K-factor, which controls the sensitivity of rating changes. This system rewards players who defeat higher-rated opponents with larger rating gains, while losses to lower-rated players result in more significant rating drops.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Tracking ELO rating progress over time can help players and coaches identify performance trends, evaluate training effectiveness, and strategically plan match schedules. It also provides fans and analysts with a more nuanced understanding of player strength beyond simple win-loss records or tournament titles.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates your new ELO rating after a tennis match based on your current rating, your opponent's rating, the match result, and the K-factor. The K-factor determines how much your rating changes after each match and can be adjusted depending on your experience level or competition rules. Enter your current rating and your opponent's rating, select the match result, and input the K-factor to see your updated rating.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your current ELO rating. This is your rating before the match.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your opponent's ELO rating. This reflects their skill level.
          </li>
          <li>
            <strong>Step 3:</strong> Select the match result: Win, Loss, or Draw.
          </li>
          <li>
            <strong>Step 4:</strong> Specify the K-factor. For most amateur tennis players, 32 is standard; professionals may use lower values like 16.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your new rating and the rating change.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your ELO rating progress, focus on consistent performance improvements and strategic match selection. Playing against higher-rated opponents provides opportunities for larger rating gains, but also carries the risk of rating loss. Balancing challenging matches with winnable games helps maintain steady rating growth. Additionally, regular training emphasizing technical skills, physical conditioning, and mental toughness will improve your chances of winning against stronger opponents.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Monitoring your rating trends can highlight periods of stagnation or decline, signaling when to adjust your training regimen or seek coaching. Incorporate recovery and injury prevention strategies to maintain peak performance throughout the season. Remember, the ELO system rewards not just wins, but wins against quality opponents, so aim to elevate your game continuously.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, use this calculator regularly after matches to track your progress objectively and set realistic goals based on your rating trajectory.
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
          For more information on sports science, tennis performance, and rating systems, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for athlete training and performance.
            </p>
          </li>
          <li>
            <a
              href="https://www.itftennis.com/en/about-us/governance/rules-and-regulations/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              International Tennis Federation (ITF) Rules & Regulations <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official governing body for tennis worldwide, offering comprehensive rules, ranking systems, and player development resources.
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
              Provides research and certifications focused on strength, conditioning, and athletic performance optimization.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  const example = {
    title: "Real Life Example",
    scenario:
      "A tennis player with a current ELO rating of 1500 plays against an opponent rated 1600. The player wins the match, and the K-factor is set to 32.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Calculate the expected score: E = 1 / (1 + 10^((1600 - 1500)/400)) ≈ 0.36. This means the player is expected to win about 36% of the time against this opponent.",
      },
      {
        label: "Step 2",
        explanation:
          "Since the player won, the actual score S = 1. Calculate the rating change: ΔR = 32 × (1 - 0.36) = 20.48 points gained.",
      },
      {
        label: "Step 3",
        explanation:
          "Update the rating: New rating = 1500 + 20.48 = 1520.48. The player’s rating increases significantly due to beating a higher-rated opponent.",
      },
    ],
    result: "The player's new ELO rating is approximately 1520.5, reflecting their improved performance.",
  };

  return (
    <CalculatorVerticalLayout
      title="Tennis ELO / Rating Progress"
      description="Track Tennis ELO rating progress. Understand how match wins and losses affect your player ranking."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "R' = R + K × (S - E)",
        variables: [
          { symbol: "R", description: "Current player rating" },
          { symbol: "R'", description: "New player rating" },
          { symbol: "K", description: "K-factor (rating sensitivity constant)" },
          { symbol: "S", description: "Actual match score (1 = win, 0.5 = draw, 0 = loss)" },
          { symbol: "E", description: "Expected score based on ratings" },
        ],
      }}
      example={example}
      relatedCalculators={[
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🚴" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
        { title: "Basketball eFG% & TS% Calculator", url: "/sports/basketball-efg-ts", icon: "⚽" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
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