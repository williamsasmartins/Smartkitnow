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

function roundToTwo(num: number) {
  return Math.round(num * 100) / 100;
}

export default function WinProbabilityShiftWpsCalculator() {
  /**
   * Inputs:
   * - currentWinProb: Current win probability of the team (0-100%)
   * - playImpact: Estimated impact of the play on win probability in percentage points (-100 to 100)
   * - timeRemaining: Time remaining in the game (minutes)
   * - scoreDifference: Current score difference (team points - opponent points)
   * - possession: Which team has possession (Our Team / Opponent)
   * 
   * Output:
   * - Win Probability Shift (WPS): Change in win probability caused by the play
   * - New Win Probability: Updated win probability after the play
   * 
   * Formula:
   * WPS = playImpact (adjusted by context factors)
   * NewWinProb = currentWinProb + WPS (bounded between 0 and 100)
   * 
   * Context adjustment example (simplified):
   * - Plays late in the game have more impact (scale factor)
   * - Score difference affects impact (closer games = higher impact)
   */

  const [inputs, setInputs] = useState({
    currentWinProb: "",
    playImpact: "",
    timeRemaining: "",
    scoreDifference: "",
    possession: "our",
  });

  const handleInputChange = useCallback((name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const currentWinProb = parseFloat(inputs.currentWinProb);
    const playImpact = parseFloat(inputs.playImpact);
    const timeRemaining = parseFloat(inputs.timeRemaining);
    const scoreDifference = parseFloat(inputs.scoreDifference);
    const possession = inputs.possession;

    if (
      isNaN(currentWinProb) ||
      isNaN(playImpact) ||
      isNaN(timeRemaining) ||
      isNaN(scoreDifference) ||
      currentWinProb < 0 || currentWinProb > 100 ||
      playImpact < -100 || playImpact > 100 ||
      timeRemaining < 0 || timeRemaining > 60 // assuming max 60 mins left
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid inputs within the specified ranges.",
        formulaUsed: null,
      };
    }

    // Contextual adjustment factors
    // 1. Time factor: plays later in the game have more impact
    // Scale from 0.5 (start of game) to 1.5 (end of game)
    const timeFactor = 0.5 + (60 - timeRemaining) * (1 / 60);

    // 2. Score difference factor: closer games have higher impact
    // Scale from 0.5 (large lead > 20 pts) to 1.5 (tie game)
    const absScoreDiff = Math.abs(scoreDifference);
    let scoreFactor = 1;
    if (absScoreDiff >= 20) scoreFactor = 0.5;
    else if (absScoreDiff <= 3) scoreFactor = 1.5;
    else scoreFactor = 1 + (3 - absScoreDiff) * (0.5 / 3); // linear scale between 3 and 20

    // 3. Possession factor: if our team has possession, impact is more direct
    const possessionFactor = possession === "our" ? 1 : 0.8;

    // Calculate adjusted play impact
    const adjustedImpact = playImpact * timeFactor * scoreFactor * possessionFactor;

    // Calculate new win probability
    let newWinProb = currentWinProb + adjustedImpact;
    if (newWinProb > 100) newWinProb = 100;
    if (newWinProb < 0) newWinProb = 0;

    const wps = newWinProb - currentWinProb;

    return {
      value: `${roundToTwo(wps)}%`,
      label: "Win Probability Shift (WPS)",
      subtext: `New Win Probability: ${roundToTwo(newWinProb)}%`,
      warning: null,
      formulaUsed:
        "WPS = playImpact × timeFactor × scoreFactor × possessionFactor; NewWinProb = currentWinProb + WPS (bounded 0-100%)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is Win Probability Shift (WPS) and why is it important?",
      answer:
        "Win Probability Shift (WPS) quantifies how a specific play or event changes a team's chances of winning a game. It is crucial for understanding the impact of key moments in real-time, allowing coaches, analysts, and fans to evaluate the significance of plays beyond just the scoreboard. WPS helps in strategic decision-making and performance analysis by providing a probabilistic measure of game dynamics.",
    },
    {
      question: "How do time remaining and score difference affect the WPS calculation?",
      answer:
        "Time remaining and score difference are critical contextual factors in WPS estimation. Plays occurring later in the game typically have a greater impact because there is less time to recover. Similarly, plays in close games (small score difference) have a higher influence on win probability compared to those in games with large leads. The calculator adjusts the play impact by scaling it based on these factors to reflect realistic game scenarios.",
    },
    {
      question: "Can the Win Probability Shift be negative, and what does that mean?",
      answer:
        "Yes, the Win Probability Shift can be negative, indicating that a play decreased the team's chances of winning. For example, a turnover or a missed scoring opportunity might reduce win probability. Negative WPS values highlight detrimental plays, helping teams identify moments that hurt their likelihood of success and adjust strategies accordingly.",
    },
    {
      question: "How accurate is the WPS estimator for different sports?",
      answer:
        "While the WPS estimator provides a solid framework for understanding play impacts, its accuracy depends on sport-specific models and data. This calculator uses generalized assumptions suitable for sports like basketball or football where win probabilities fluctuate dynamically. For precise sport-specific analysis, integrating detailed historical data and advanced models is recommended. Nonetheless, this tool offers valuable insights for a broad range of competitive sports.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currentWinProb" className="mb-1 flex items-center gap-1">
            Current Win Probability (%) <Gauge className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="currentWinProb"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g. 45.5"
            value={inputs.currentWinProb}
            onChange={(e) => handleInputChange("currentWinProb", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="playImpact" className="mb-1 flex items-center gap-1">
            Estimated Play Impact (%) <Zap className="w-4 h-4 text-yellow-500" />
          </Label>
          <Input
            id="playImpact"
            type="number"
            min={-100}
            max={100}
            step={0.1}
            placeholder="e.g. 5 or -3"
            value={inputs.playImpact}
            onChange={(e) => handleInputChange("playImpact", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="timeRemaining" className="mb-1 flex items-center gap-1">
            Time Remaining (minutes) <Timer className="w-4 h-4 text-green-600" />
          </Label>
          <Input
            id="timeRemaining"
            type="number"
            min={0}
            max={60}
            step={0.1}
            placeholder="e.g. 12.5"
            value={inputs.timeRemaining}
            onChange={(e) => handleInputChange("timeRemaining", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="scoreDifference" className="mb-1 flex items-center gap-1">
            Score Difference (Our Team - Opponent) <Flag className="w-4 h-4 text-red-600" />
          </Label>
          <Input
            id="scoreDifference"
            type="number"
            step={1}
            placeholder="e.g. 3 or -7"
            value={inputs.scoreDifference}
            onChange={(e) => handleInputChange("scoreDifference", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="possession" className="mb-1 flex items-center gap-1">
            Possession <Heart className="w-4 h-4 text-pink-600" />
          </Label>
          <Select
            value={inputs.possession}
            onValueChange={(v) => handleInputChange("possession", v)}
            id="possession"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select possession" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="our">Our Team</SelectItem>
              <SelectItem value="opponent">Opponent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate Win Probability Shift"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              currentWinProb: "",
              playImpact: "",
              timeRemaining: "",
              scoreDifference: "",
              possession: "our",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
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
          Understanding Win Probability Shift (WPS) Estimator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Win Probability Shift (WPS) is a powerful metric used in sports analytics to quantify the impact of a specific play or event on a team's chances of winning a game. Unlike traditional statistics that focus on points or yardage, WPS provides a probabilistic perspective, showing how the likelihood of victory changes in real-time as the game unfolds. This allows coaches, analysts, and fans to better understand the significance of key moments beyond the scoreboard.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The WPS Estimator integrates multiple contextual factors such as the current win probability, time remaining, score difference, and possession to calculate how a play shifts the probability of winning. By adjusting the raw impact of a play with these factors, the estimator provides a nuanced and realistic assessment of its true influence on the game's outcome.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This approach is especially valuable in fast-paced sports like basketball, football, and hockey, where momentum swings can drastically alter the course of a game. Understanding WPS helps teams make informed strategic decisions, optimize player performance, and communicate the importance of plays to stakeholders.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Ultimately, the WPS Estimator bridges the gap between raw game events and their strategic impact, empowering users with actionable insights into the dynamics of competitive sports.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To effectively use the Win Probability Shift Estimator, begin by entering the current win probability of your team as a percentage. This represents the likelihood of winning before the play occurs. Next, input the estimated impact of the play on win probability, which can be positive or negative depending on whether the play benefits or harms your team's chances.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Then, specify the time remaining in the game in minutes. Plays occurring later in the game generally have a larger impact on win probability. Enter the current score difference, calculated as your team's points minus the opponent's points. This helps the calculator understand the closeness of the game, which affects the significance of plays.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Finally, select which team has possession of the ball or puck. Possession influences the likelihood of scoring and thus the impact of plays. After filling in all inputs, click the Calculate button to see the Win Probability Shift and the updated win probability. Use the Reset button to clear inputs and start a new calculation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter current win probability (0-100%).
          </li>
          <li>
            <strong>Step 2:</strong> Input estimated play impact (-100% to 100%).
          </li>
          <li>
            <strong>Step 3:</strong> Provide time remaining in minutes.
          </li>
          <li>
            <strong>Step 4:</strong> Enter score difference (your team - opponent).
          </li>
          <li>
            <strong>Step 5:</strong> Select possession (Our Team or Opponent).
          </li>
          <li>
            <strong>Step 6:</strong> Click Calculate to view results.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporating Win Probability Shift analysis into training and game strategy can elevate team performance and decision-making. Coaches should review plays with significant positive or negative WPS to identify what actions lead to momentum shifts. Emphasizing high-impact plays during practice can help players understand their importance and replicate success.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Use WPS data to simulate game scenarios and train players on situational awareness, especially in critical moments with little time remaining. Understanding how possession and score difference affect play impact can guide tactical adjustments, such as when to take risks or play conservatively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, integrating WPS insights into video review sessions helps players visualize the consequences of their actions, fostering a mindset focused on maximizing positive shifts and minimizing negative ones. Over time, this analytical approach builds a culture of strategic thinking and resilience.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, combining WPS with other performance metrics creates a comprehensive framework for continuous improvement and competitive advantage.
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
              href="https://www.espn.com/nba/story/_/id/29112565/how-win-probability-works-nba"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              ESPN: How Win Probability Works <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A detailed explanation of win probability models in basketball, including how plays affect game outcomes.
            </p>
          </li>
          <li>
            <a
              href="https://www.baseballprospectus.com/news/article/17943/understanding-win-probability/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Baseball Prospectus: Understanding Win Probability <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An authoritative resource on win probability in baseball, covering methodology and practical applications.
            </p>
          </li>
          <li>
            <a
              href="https://www.sloansportsconference.com/wp-content/uploads/2017/02/Win_Probability_Shift.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Sloan Sports Analytics Conference: Win Probability Shift Paper <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A research paper presenting the concept of Win Probability Shift and its use in sports analytics.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Win Probability Shift (WPS) Estimator"
      description="Estimate Win Probability Shift. Analyze how specific plays impact the likelihood of winning a game in real-time."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "WPS = playImpact × timeFactor × scoreFactor × possessionFactor; NewWinProb = currentWinProb + WPS (bounded 0-100%)",
        variables: [
          { symbol: "WPS", description: "Win Probability Shift (%)" },
          { symbol: "playImpact", description: "Estimated impact of the play (%)" },
          { symbol: "timeFactor", description: "Scaling factor based on time remaining" },
          { symbol: "scoreFactor", description: "Scaling factor based on score difference" },
          { symbol: "possessionFactor", description: "Scaling factor based on possession" },
          { symbol: "currentWinProb", description: "Current win probability (%)" },
          { symbol: "NewWinProb", description: "Updated win probability (%)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A basketball team has a 45% chance of winning with 10 minutes left, trailing by 3 points, and gains possession. They make a successful 3-point shot estimated to increase win probability by 5%.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input current win probability: 45%",
          },
          {
            label: "Step 2",
            explanation: "Input play impact: +5%",
          },
          {
            label: "Step 3",
            explanation: "Input time remaining: 10 minutes",
          },
          {
            label: "Step 4",
            explanation: "Input score difference: -3 (trailing)",
          },
          {
            label: "Step 5",
            explanation: "Select possession: Our Team",
          },
          {
            label: "Step 6",
            explanation: "Calculate to find WPS and new win probability",
          },
        ],
        result: "The calculator estimates a WPS of approximately +7.5%, increasing the win probability to 52.5%.",
      }}
      relatedCalculators={[
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "Calories Burned per Workout (MET)", url: "/sports/calories-burned-met", icon: "🔥" },
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "VO2max Estimator (Cooper/Rockport Test)", url: "/sports/vo2max-estimator-cooper-rockport", icon: "🏆" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
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