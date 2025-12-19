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

function calculateFrameScore(rolls, frameIndex) {
  // Calculate the score for a single frame in bowling based on rolls array and frame index
  // rolls: array of rolls (pins knocked down)
  // frameIndex: index of the frame (0-based)
  // Returns the score for the frame or null if incomplete
  const rollIndex = frameIndex * 2; // Approximate start index for frame rolls
  if (frameIndex < 9) {
    // Frames 1-9
    if (rolls[rollIndex] === 10) {
      // Strike: score = 10 + next two rolls
      if (rolls[rollIndex + 1] != null && rolls[rollIndex + 2] != null) {
        return 10 + rolls[rollIndex + 1] + rolls[rollIndex + 2];
      }
      return null; // incomplete
    } else if (
      rolls[rollIndex] != null &&
      rolls[rollIndex + 1] != null
    ) {
      const frameSum = rolls[rollIndex] + rolls[rollIndex + 1];
      if (frameSum === 10) {
        // Spare: 10 + next roll
        if (rolls[rollIndex + 2] != null) {
          return 10 + rolls[rollIndex + 2];
        }
        return null; // incomplete
      } else if (frameSum < 10) {
        // Open frame: sum of pins
        return frameSum;
      }
      return null; // invalid input
    }
    return null; // incomplete
  } else {
    // 10th frame can have 2 or 3 rolls
    if (
      rolls[rollIndex] != null &&
      rolls[rollIndex + 1] != null
    ) {
      const first = rolls[rollIndex];
      const second = rolls[rollIndex + 1];
      if (first === 10 || first + second === 10) {
        // Strike or spare in 10th frame allows 3rd roll
        if (rolls[rollIndex + 2] != null) {
          return first + second + rolls[rollIndex + 2];
        }
        return null; // incomplete
      } else {
        // Open frame: sum first two rolls only
        return first + second;
      }
    }
    return null; // incomplete
  }
}

export default function BowlingScoreCalculator() {
  // State to hold rolls input as strings for 21 possible rolls max (including bonus rolls)
  const [rollsInput, setRollsInput] = useState(Array(21).fill(""));

  // Handle input change for each roll
  const handleRollChange = useCallback(
    (index, value) => {
      // Validate input: only digits 0-10 or empty allowed
      if (value === "" || (/^\d{1,2}$/.test(value) && Number(value) <= 10)) {
        setRollsInput((prev) => {
          const newRolls = [...prev];
          newRolls[index] = value;
          return newRolls;
        });
      }
    },
    [setRollsInput]
  );

  // Calculate total score and frame-by-frame breakdown
  const results = useMemo(() => {
    // Parse rolls to numbers or null if empty
    const rolls = rollsInput.map((r) => (r === "" ? null : Number(r)));

    // Validate rolls for bowling rules (max pins per frame, etc.)
    // We'll do basic validation here and show warnings if invalid

    // Calculate score frame by frame
    let totalScore = 0;
    let frameScores = [];
    let rollIndex = 0;
    let warning = null;

    for (let frame = 0; frame < 10; frame++) {
      if (rolls[rollIndex] == null) {
        // Incomplete frame
        break;
      }

      if (rolls[rollIndex] === 10) {
        // Strike
        if (
          rolls[rollIndex + 1] == null ||
          rolls[rollIndex + 2] == null
        ) {
          break; // incomplete strike bonus
        }
        const frameScore = 10 + rolls[rollIndex + 1] + rolls[rollIndex + 2];
        totalScore += frameScore;
        frameScores.push(frameScore);
        rollIndex += 1;
      } else {
        // Not strike, need two rolls
        if (rolls[rollIndex + 1] == null) {
          break; // incomplete frame
        }
        const frameSum = rolls[rollIndex] + rolls[rollIndex + 1];
        if (frameSum > 10) {
          warning = `Invalid pin count in frame ${frame + 1}: sum of rolls exceeds 10`;
          break;
        }
        if (frameSum === 10) {
          // Spare
          if (rolls[rollIndex + 2] == null) {
            break; // incomplete spare bonus
          }
          const frameScore = 10 + rolls[rollIndex + 2];
          totalScore += frameScore;
          frameScores.push(frameScore);
        } else {
          // Open frame
          totalScore += frameSum;
          frameScores.push(frameSum);
        }
        rollIndex += 2;
      }
      // Special handling for 10th frame bonus rolls
      if (frame === 9) {
        // 10th frame can have up to 3 rolls
        if (rolls[rollIndex] != null) {
          if (rolls[rollIndex] > 10) {
            warning = "Invalid bonus roll pin count in 10th frame";
            break;
          }
          totalScore += rolls[rollIndex];
          rollIndex += 1;
        }
      }
    }

    return {
      value: totalScore.toString(),
      label: "Total Score",
      subtext: frameScores.length === 10 ? "Complete game score" : "Partial score (incomplete game)",
      warning,
      formulaUsed:
        "Score is calculated frame-by-frame: Strike = 10 + next two rolls, Spare = 10 + next roll, Open frame = sum of pins.",
      frameScores,
    };
  }, [rollsInput]);

  const faqs = [
    {
      question: "How is the bowling score calculated?",
      answer:
        "Bowling scoring is based on 10 frames per game. Each frame allows up to two rolls to knock down 10 pins. A strike (all pins down on first roll) scores 10 plus the next two rolls, while a spare (all pins down in two rolls) scores 10 plus the next roll. Open frames score the total pins knocked down in that frame.",
    },
    {
      question: "What happens in the 10th frame if I get a strike or spare?",
      answer:
        "In the 10th frame, if you roll a strike or spare, you are awarded extra rolls to calculate the bonus. A strike grants two extra rolls, and a spare grants one extra roll. This allows the final frame to have up to three rolls, ensuring the bonus points are accounted for correctly.",
    },
    {
      question: "Can I enter partial games in this calculator?",
      answer:
        "Yes, this calculator supports partial games. You can input rolls as they happen, and the calculator will update the score accordingly. Incomplete frames or missing bonus rolls will result in partial scoring until the game is complete.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
        <p className="mb-4 text-center font-semibold text-lg text-slate-900 dark:text-slate-100">
          Enter pins knocked down for each roll below. Leave empty if roll not yet played.
        </p>
        <div className="grid grid-cols-7 gap-3 justify-center">
          {[...Array(21)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Label htmlFor={`roll-${i}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {i + 1}
              </Label>
              <Input
                id={`roll-${i}`}
                type="number"
                min={0}
                max={10}
                value={rollsInput[i]}
                onChange={(e) => handleRollChange(i, e.target.value)}
                className="w-12 text-center"
                placeholder="-"
                aria-label={`Roll ${i + 1} pins`}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setRollsInput(Array(21).fill(""))}
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

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-sm mt-2 text-blue-700 dark:text-blue-300">{results.subtext}</p>
          </CardContent>
        </Card>
      )}

      {results.frameScores.length > 0 && (
        <Card className="mt-6 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-slate-100">Frame-by-Frame Scores</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {results.frameScores.map((score, i) => (
              <div
                key={i}
                className="w-12 h-12 flex items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-300 font-semibold"
                title={`Frame ${i + 1} score`}
              >
                {score}
              </div>
            ))}
          </div>
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
          Bowling scoring is a nuanced system that rewards both consistency and skillful play. Each game consists of 10 frames, where players attempt to knock down all 10 pins with up to two rolls per frame. Strikes and spares add complexity by granting bonus points from subsequent rolls, making the scoring dynamic and strategic. This calculator simulates the scoring process by allowing users to input each roll's pin count, automatically computing the cumulative score while accounting for strikes, spares, and bonus rolls in the final frame.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator also supports partial games, enabling players to track their score in real-time as the game progresses. By understanding how each roll contributes to the total score, bowlers can better strategize their play and improve their performance over time.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Bowling Score Calculator, enter the number of pins knocked down for each roll in the input fields provided. The calculator supports up to 21 rolls to accommodate the maximum possible rolls in a game, including bonus rolls in the 10th frame. Leave any rolls blank if they have not yet been played or if the game is incomplete. Once inputs are entered, the calculator will automatically compute the total score and display frame-by-frame breakdowns.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Input the pins knocked down for each roll sequentially. Use 0 if no pins were knocked down.
          </li>
          <li>
            <strong>Step 2:</strong> For strikes, enter 10 in the first roll of the frame and leave the second roll blank.
          </li>
          <li>
            <strong>Step 3:</strong> For spares, ensure the sum of the two rolls in a frame equals 10.
          </li>
          <li>
            <strong>Step 4:</strong> In the 10th frame, enter bonus rolls if applicable (strike or spare).
          </li>
          <li>
            <strong>Step 5:</strong> Review the total score and frame-by-frame scores displayed below the inputs.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your bowling score requires a combination of technical skill, physical conditioning, and mental focus. Consistent practice on your approach, release, and targeting can significantly increase your strike and spare rates. Additionally, strength and flexibility training, especially focusing on the lower body and core, can enhance your stability and power during delivery.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Strategically, understanding lane conditions and adjusting your ball speed and spin accordingly can improve pin carry and reduce splits. Use this calculator to track your progress frame-by-frame, identify patterns in your scoring, and tailor your training to address weaknesses such as spare conversion or strike consistency.
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
          For more information on bowling scoring rules, training science, and performance optimization, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based training guidelines.
            </p>
          </li>
          <li>
            <a
              href="https://www.bowlingball.com/bowlingscience"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              BowlingBall.com - Bowling Science <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive resource on bowling physics, scoring rules, and techniques to improve performance.
            </p>
          </li>
          <li>
            <a
              href="https://bowl.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              United States Bowling Congress (USBC) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official governing body for bowling in the U.S., providing official rules, scoring standards, and training resources.
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
        title: "Bowling Scoring Formula",
        formula:
          "Total Score = Sum of frame scores; Frame Score = 10 + next two rolls (strike), 10 + next roll (spare), or sum of pins (open frame).",
        variables: [
          { symbol: "Strike", description: "All 10 pins knocked down on first roll" },
          { symbol: "Spare", description: "All 10 pins knocked down in two rolls" },
          { symbol: "Open Frame", description: "Less than 10 pins knocked down in two rolls" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A player rolls a strike in the first frame, then knocks down 7 and 2 pins in the second frame, followed by a spare in the third frame (5 + 5).",
        steps: [
          {
            label: "Step 1",
            explanation:
              "First frame is a strike: score = 10 + next two rolls (7 + 2) = 19.",
          },
          {
            label: "Step 2",
            explanation:
              "Second frame is open: score = 7 + 2 = 9; cumulative score = 19 + 9 = 28.",
          },
          {
            label: "Step 3",
            explanation:
              "Third frame is a spare: score = 10 + next roll (assume 4) = 14; cumulative score = 28 + 14 = 42.",
          },
        ],
        result: "Total score after three frames is 42.",
      }}
      relatedCalculators={[
        { title: "Body Fat Percentage Calculator (Athletes)", url: "/sports/body-fat-percentage", icon: "🔥" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
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