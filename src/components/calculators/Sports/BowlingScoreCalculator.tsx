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

const MAX_FRAMES = 10;

function calculateBowlingScore(frames) {
  // frames: array of objects [{rolls: [roll1, roll2, roll3?]}]
  // Each roll is pins knocked down (0-10)
  // Calculate total score with strike/spare bonuses

  let totalScore = 0;
  for (let i = 0; i < MAX_FRAMES; i++) {
    const frame = frames[i];
    if (!frame) break;
    const rolls = frame.rolls || [];
    const first = rolls[0] ?? 0;
    const second = rolls[1] ?? 0;
    const third = rolls[2] ?? 0;

    // Strike
    if (first === 10) {
      // Bonus: next two rolls
      let bonus = 0;
      if (i + 1 < MAX_FRAMES) {
        const nextFrame = frames[i + 1];
        if (nextFrame) {
          const nextRolls = nextFrame.rolls || [];
          bonus += nextRolls[0] ?? 0;
          if (nextRolls[0] === 10 && i + 2 < MAX_FRAMES) {
            // If next frame strike, take first roll from frame after next
            const frameAfterNext = frames[i + 2];
            bonus += frameAfterNext ? frameAfterNext.rolls[0] ?? 0 : 0;
          } else {
            bonus += nextRolls[1] ?? 0;
          }
        }
      }
      totalScore += 10 + bonus;
    }
    // Spare
    else if (first + second === 10) {
      // Bonus: next roll
      let bonus = 0;
      if (i + 1 < MAX_FRAMES) {
        const nextFrame = frames[i + 1];
        if (nextFrame) {
          bonus = nextFrame.rolls[0] ?? 0;
        }
      }
      totalScore += 10 + bonus;
    }
    // Open frame
    else {
      totalScore += first + second;
    }

    // 10th frame special case: add third roll if any
    if (i === 9) {
      totalScore += third;
    }
  }
  return totalScore;
}

export default function BowlingScoreCalculator() {
  // Store rolls for each frame: array of 10 frames, each with rolls array
  const [frames, setFrames] = useState(
    Array.from({ length: MAX_FRAMES }, () => ({ rolls: [] }))
  );

  // Handle roll input change
  const handleRollChange = useCallback(
    (frameIndex, rollIndex, value) => {
      let val = parseInt(value);
      if (isNaN(val) || val < 0) val = 0;
      if (val > 10) val = 10;

      setFrames((prev) => {
        const newFrames = [...prev];
        const rolls = [...(newFrames[frameIndex]?.rolls || [])];

        // Special validation for rolls sum in frames 1-9
        if (frameIndex < 9) {
          if (rollIndex === 0) {
            // First roll, just set
            rolls[0] = val;
            // Reset second roll if first roll is 10 (strike)
            if (val === 10) {
              rolls[1] = 0;
            }
          } else if (rollIndex === 1) {
            // Second roll cannot make sum > 10
            const firstRoll = rolls[0] ?? 0;
            if (firstRoll + val > 10) {
              val = 10 - firstRoll;
            }
            rolls[1] = val;
          }
          // No third roll in frames 1-9
          rolls.length = 2;
        } else {
          // 10th frame logic
          // Max pins per roll 10, but sum rules differ
          if (rollIndex === 0) {
            rolls[0] = val;
          } else if (rollIndex === 1) {
            // If first roll < 10, sum first+second <= 10 unless first was strike
            if (rolls[0] < 10 && rolls[0] + val > 10) {
              val = 10 - rolls[0];
            }
            rolls[1] = val;
          } else if (rollIndex === 2) {
            // Third roll only allowed if strike or spare in first two rolls
            if (
              rolls[0] === 10 ||
              (rolls[0] + (rolls[1] ?? 0) === 10)
            ) {
              rolls[2] = val;
            } else {
              // Not allowed, ignore
              return prev;
            }
          }
          // Trim rolls length to max 3
          rolls.length = 3;
        }

        newFrames[frameIndex] = { rolls };
        return newFrames;
      });
    },
    []
  );

  const results = useMemo(() => {
    const score = calculateBowlingScore(frames);
    return {
      value: score,
      label: "Total Bowling Score",
      subtext: "Calculated based on standard ten-pin bowling rules with strikes and spares bonuses.",
      warning: null,
      formulaUsed:
        "Score = Sum of pins knocked down + bonuses for strikes (next two rolls) and spares (next roll).",
    };
  }, [frames]);

  const faqs = [
    {
      question: "How does the calculator handle strikes and spares?",
      answer:
        "This calculator follows official ten-pin bowling scoring rules. A strike (knocking down all pins on the first roll) earns a bonus of the next two rolls' pin count. A spare (knocking down all pins in two rolls) earns a bonus of the next roll's pin count. These bonuses are automatically calculated to provide an accurate total score.",
    },
    {
      question: "Can I input partial frames or incomplete games?",
      answer:
        "Yes, you can input as many frames as you have played. The calculator will compute the score based on the frames entered. For incomplete frames, enter the rolls you have, and the calculator will provide the current score accordingly.",
    },
    {
      question: "How is the 10th frame different from others?",
      answer:
        "The 10th frame allows up to three rolls if a strike or spare is scored. This calculator supports entering up to three rolls in the final frame and calculates the score accordingly, including any bonus rolls granted by strikes or spares in the 10th frame.",
    },
    {
      question: "What if I enter invalid pin counts?",
      answer:
        "The calculator validates inputs to ensure no roll exceeds 10 pins and that the sum of rolls in a frame (except the 10th) does not exceed 10. If invalid values are entered, they are automatically adjusted to maintain valid scoring rules.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-center">
          <thead>
            <tr className="bg-blue-100 dark:bg-blue-900">
              <th className="border border-slate-300 dark:border-slate-700 p-2">Frame</th>
              {[...Array(MAX_FRAMES)].map((_, i) => (
                <th key={i} className="border border-slate-300 dark:border-slate-700 p-2">
                  {i + 1}
                </th>
              ))}
            </tr>
            <tr className="bg-blue-50 dark:bg-blue-800">
              <th className="border border-slate-300 dark:border-slate-700 p-2">Roll 1</th>
              {[...Array(MAX_FRAMES)].map((_, i) => (
                <td key={i} className="border border-slate-300 dark:border-slate-700 p-1">
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={frames[i]?.rolls[0] ?? ""}
                    onChange={(e) => handleRollChange(i, 0, e.target.value)}
                    aria-label={`Frame ${i + 1} Roll 1`}
                    className="w-16 text-center"
                  />
                </td>
              ))}
            </tr>
            <tr className="bg-blue-50 dark:bg-blue-800">
              <th className="border border-slate-300 dark:border-slate-700 p-2">Roll 2</th>
              {[...Array(MAX_FRAMES)].map((_, i) => (
                <td key={i} className="border border-slate-300 dark:border-slate-700 p-1">
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={frames[i]?.rolls[1] ?? ""}
                    onChange={(e) => handleRollChange(i, 1, e.target.value)}
                    aria-label={`Frame ${i + 1} Roll 2`}
                    className="w-16 text-center"
                    disabled={i < 9 && frames[i]?.rolls[0] === 10}
                    // Disable second roll if strike in frames 1-9
                  />
                </td>
              ))}
            </tr>
            <tr className="bg-blue-50 dark:bg-blue-800">
              <th className="border border-slate-300 dark:border-slate-700 p-2">Roll 3 (10th Frame Only)</th>
              {[...Array(MAX_FRAMES)].map((_, i) => (
                <td key={i} className="border border-slate-300 dark:border-slate-700 p-1">
                  {i === 9 ? (
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={frames[i]?.rolls[2] ?? ""}
                      onChange={(e) => handleRollChange(i, 2, e.target.value)}
                      aria-label={`Frame ${i + 1} Roll 3`}
                      className="w-16 text-center"
                    />
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600">-</span>
                  )}
                </td>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No calculation needed, score updates live
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setFrames(Array.from({ length: MAX_FRAMES }, () => ({ rolls: [] })))}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Bowling Score Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Bowling scoring can appear complex due to the unique rules involving strikes and spares. Each game consists of 10 frames, where players try to knock down pins with one or two rolls per frame, except the 10th frame which can have up to three rolls. The score for each frame is the total pins knocked down plus bonuses for strikes and spares.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          A strike occurs when all pins are knocked down on the first roll of a frame, granting a bonus of the next two rolls' pin counts. A spare happens when all pins are knocked down in two rolls within a frame, granting a bonus of the next roll's pin count. These bonuses make scoring dynamic and require careful tracking of subsequent rolls.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator automates the scoring process by allowing you to input the pins knocked down in each roll for all frames. It then applies the official scoring rules to compute your total score accurately, including all strike and spare bonuses. This tool is invaluable for players, coaches, and enthusiasts who want to analyze or predict game outcomes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Whether you are a beginner learning the scoring system or an advanced player tracking your performance, this calculator provides a reliable and authoritative way to understand and compute bowling scores without manual errors.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this bowling score calculator is straightforward and intuitive. Begin by entering the number of pins knocked down in each roll for every frame. For frames 1 through 9, you will enter up to two rolls per frame. For the 10th frame, you can enter up to three rolls if a strike or spare is achieved.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator automatically validates your inputs to ensure they conform to bowling rules, such as not exceeding 10 pins per roll and not allowing the sum of rolls in a frame to surpass 10 unless in the 10th frame with bonus rolls. If you enter a strike in frames 1-9, the second roll input will be disabled since no second roll is needed.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering your rolls, click the "Calculate" button to compute your total score. The result will display prominently below the input table, showing your current game score with all strike and spare bonuses applied. You can reset all inputs anytime using the "Reset" button to start a new calculation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the number of pins knocked down in each roll for frames 1 to 9. If you roll a strike (10 pins on first roll), the second roll input will be disabled automatically.
          </li>
          <li>
            <strong>Step 2:</strong> For the 10th frame, enter up to three rolls if you score a strike or spare. Otherwise, enter one or two rolls as applicable.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to see your total score based on official bowling scoring rules.
          </li>
          <li>
            <strong>Step 4:</strong> Use the "Reset" button to clear all inputs and start a new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consistent scoring in bowling requires both physical skill and strategic thinking. Focus on developing a repeatable delivery technique that allows you to hit your target consistently. Practice your approach, release, and follow-through to improve accuracy and power.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding the scoring system helps you make smarter decisions during play. For example, aiming for strikes early in the game can maximize your bonus points, but spares are equally important to maintain a steady score. Use this calculator to simulate different scenarios and identify scoring patterns that work best for you.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, analyze your game data regularly to identify weaknesses, such as missed spares or inconsistent strikes. Incorporate drills that target these areas, and consider working with a coach to refine your technique and mental game.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Finally, maintain physical fitness with exercises that enhance balance, flexibility, and core strength, all critical for a powerful and controlled bowling delivery.
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
              href="https://www.bowl.com/Rules_and_Regulations/Scoring/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              United States Bowling Congress - Scoring Rules <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official rules and detailed explanation of ten-pin bowling scoring from the governing body in the United States.
            </p>
          </li>
          <li>
            <a
              href="https://www.bowlingball.com/bowlversity/how-to-score-in-bowling"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Bowlversity - How to Score in Bowling <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive guide explaining bowling scoring with examples, tips, and common scenarios.
            </p>
          </li>
          <li>
            <a
              href="https://www.britannica.com/sports/bowling-sport"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Britannica - Bowling (Sport) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Encyclopedic overview of bowling, including history, rules, and scoring systems.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Bowling Score Calculator"
      description="Calculate bowling scores. Simulate frames, strikes, and spares to predict your final game score."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "Total Score = Sum of pins knocked down + bonuses for strikes (next two rolls) and spares (next roll).",
        variables: [
          { symbol: "Strike", description: "All 10 pins knocked down on first roll of frame" },
          { symbol: "Spare", description: "All 10 pins knocked down in two rolls of frame" },
          { symbol: "Bonus", description: "Additional pins counted from next rolls after strike or spare" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player bowls a perfect game with 12 strikes in a row, scoring the maximum 300 points.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 10 pins for the first roll in each of the first 9 frames, and for the first two rolls in the 10th frame.",
          },
          {
            label: "Step 2",
            explanation:
              "Enter 10 pins for the third roll in the 10th frame as the bonus roll after strikes.",
          },
          {
            label: "Step 3",
            explanation: "Click Calculate to see the total score of 300, the perfect game score.",
          },
        ],
        result: "Total Score: 300",
      }}
      relatedCalculators={[
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "FTP (Functional Threshold Power) Zones Planner", url: "/sports/ftp-zones-planner", icon: "🚴" },
        { title: "Hydration / Sweat Rate Calculator", url: "/sports/hydration-sweat-rate", icon: "🏆" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
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