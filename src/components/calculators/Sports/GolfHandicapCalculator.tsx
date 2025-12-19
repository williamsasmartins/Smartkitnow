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

function calculateHandicapIndex(scores, courseRatings, slopeRatings) {
  // According to USGA Handicap System:
  // Handicap Differential = (Adjusted Gross Score - Course Rating) x 113 / Slope Rating
  // Use best 8 of last 20 differentials (or fewer if less scores)
  if (
    !scores.length ||
    scores.length !== courseRatings.length ||
    scores.length !== slopeRatings.length
  ) {
    return null;
  }

  const differentials = scores.map((score, i) => {
    const cr = courseRatings[i];
    const sr = slopeRatings[i];
    if (sr === 0) return null; // avoid division by zero
    return ((score - cr) * 113) / sr;
  }).filter(d => d !== null);

  if (differentials.length === 0) return null;

  // Sort ascending (lowest differentials are best)
  differentials.sort((a, b) => a - b);

  // Number of differentials to use based on count (USGA rules)
  // For simplicity, we implement for 5 to 20 scores:
  // 5 scores: best 1, 6: best 2, 7-8: best 3, 9-10: best 4, 11-12: best 5,
  // 13-14: best 6, 15-16: best 7, 17-20: best 8
  const n = differentials.length;
  let countToUse = 0;
  if (n < 5) return null; // minimum 5 scores needed
  else if (n === 5) countToUse = 1;
  else if (n === 6) countToUse = 2;
  else if (n <= 8) countToUse = 3;
  else if (n <= 10) countToUse = 4;
  else if (n <= 12) countToUse = 5;
  else if (n <= 14) countToUse = 6;
  else if (n <= 16) countToUse = 7;
  else countToUse = 8;

  const bestDiffs = differentials.slice(0, countToUse);
  const avgDiff = bestDiffs.reduce((a, b) => a + b, 0) / countToUse;

  // Apply USGA multiplier (0.96) to get Handicap Index
  const handicapIndex = avgDiff * 0.96;

  // Handicap Index is rounded to one decimal place
  return Math.round(handicapIndex * 10) / 10;
}

export default function GolfHandicapCalculator() {
  // Inputs: up to 20 rounds with Score, Course Rating, Slope Rating
  // For UI simplicity, allow user to input number of rounds (5-20), then show inputs accordingly
  const [numRounds, setNumRounds] = useState(5);
  const [inputs, setInputs] = useState(
    Array(20).fill({ score: "", courseRating: "", slopeRating: "" })
  );

  const handleInputChange = useCallback(
    (index, field, value) => {
      setInputs((prev) => {
        const newInputs = [...prev];
        newInputs[index] = { ...newInputs[index], [field]: value };
        return newInputs;
      });
    },
    [setInputs]
  );

  const results = useMemo(() => {
    // Extract valid inputs for the number of rounds selected
    const scores = [];
    const courseRatings = [];
    const slopeRatings = [];

    for (let i = 0; i < numRounds; i++) {
      const round = inputs[i];
      const score = parseFloat(round.score);
      const cr = parseFloat(round.courseRating);
      const sr = parseFloat(round.slopeRating);

      if (
        isNaN(score) ||
        isNaN(cr) ||
        isNaN(sr) ||
        score <= 0 ||
        cr <= 0 ||
        sr < 55 || // USGA slope rating min 55
        sr > 155 // max 155
      ) {
        return {
          value: null,
          label: null,
          subtext: "Please enter valid positive numbers for all fields. Slope rating must be between 55 and 155.",
          warning: true,
          formulaUsed:
            "Handicap Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating",
        };
      }

      scores.push(score);
      courseRatings.push(cr);
      slopeRatings.push(sr);
    }

    const handicapIndex = calculateHandicapIndex(scores, courseRatings, slopeRatings);

    if (handicapIndex === null) {
      return {
        value: null,
        label: null,
        subtext: "At least 5 valid rounds are required to calculate a Handicap Index.",
        warning: true,
        formulaUsed:
          "Handicap Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating",
      };
    }

    return {
      value: handicapIndex.toFixed(1),
      label: "Your USGA Handicap Index",
      subtext:
        "Calculated using the best differentials of your recent rounds, adjusted by USGA formula.",
      warning: false,
      formulaUsed:
        "Handicap Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating; Handicap Index = Average of best differentials × 0.96",
    };
  }, [inputs, numRounds]);

  const faqs = [
    {
      question: "What is a Golf Handicap Index?",
      answer:
        "A Golf Handicap Index is a numerical measure of a golfer's potential ability, allowing players of different skill levels to compete fairly. It is calculated using a standardized formula by the USGA, considering the difficulty of courses played and the player's recent scores.",
    },
    {
      question: "How many rounds do I need to calculate my handicap?",
      answer:
        "According to USGA rules, a minimum of 5 rounds is required to establish a Handicap Index. The calculation improves in accuracy as more rounds (up to 20) are included, using the best differentials from those rounds.",
    },
    {
      question: "Why do course rating and slope rating matter?",
      answer:
        "Course Rating represents the difficulty for a scratch golfer, while Slope Rating measures the relative difficulty for a bogey golfer compared to a scratch golfer. These ratings adjust your score to a standardized scale, ensuring fair comparison across different courses.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="mb-4">
        <Label htmlFor="numRounds" className="font-semibold">
          Number of Rounds (5-20)
        </Label>
        <Select
          id="numRounds"
          value={numRounds.toString()}
          onValueChange={(v) => setNumRounds(parseInt(v))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select rounds" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(16)].map((_, i) => {
              const val = i + 5;
              return <SelectItem key={val} value={val.toString()}>{val}</SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto max-h-[400px] border rounded-md border-slate-300 dark:border-slate-700">
        <table className="w-full text-sm text-left text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0">
            <tr>
              <th className="px-3 py-2">Round</th>
              <th className="px-3 py-2">Score (Adjusted Gross)</th>
              <th className="px-3 py-2">Course Rating</th>
              <th className="px-3 py-2">Slope Rating</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(numRounds)].map((_, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800"}>
                <td className="px-3 py-2 font-medium">{i + 1}</td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    min={40}
                    max={150}
                    step="1"
                    placeholder="e.g. 85"
                    value={inputs[i]?.score || ""}
                    onChange={(e) => handleInputChange(i, "score", e.target.value)}
                    aria-label={`Score for round ${i + 1}`}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    min={65}
                    max={80}
                    step="0.1"
                    placeholder="e.g. 72.5"
                    value={inputs[i]?.courseRating || ""}
                    onChange={(e) => handleInputChange(i, "courseRating", e.target.value)}
                    aria-label={`Course rating for round ${i + 1}`}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    min={55}
                    max={155}
                    step="1"
                    placeholder="e.g. 113"
                    value={inputs[i]?.slopeRating || ""}
                    onChange={(e) => handleInputChange(i, "slopeRating", e.target.value)}
                    aria-label={`Slope rating for round ${i + 1}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setInputs(Array(20).fill({ score: "", courseRating: "", slopeRating: "" }));
            setNumRounds(5);
          }}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{results.subtext}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{results.subtext}</span>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Golf Handicap Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Golf Handicap Calculator is designed to provide golfers with an accurate Handicap Index
          based on their recent rounds, following the USGA's standardized methodology. This index
          reflects a player's potential ability by adjusting scores for course difficulty using
          Course Rating and Slope Rating. By calculating the best differentials from a set of rounds,
          the calculator ensures fair competition among golfers of varying skill levels.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Handicap Index is essential for tournament play and casual rounds alike, enabling
          equitable scoring adjustments. This calculator supports up to 20 rounds, allowing users to
          track their progress and see how their handicap evolves with each new score entered.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To calculate your Golf Handicap Index, input the number of rounds you've played (minimum 5,
          maximum 20). For each round, enter your Adjusted Gross Score, the Course Rating, and the
          Slope Rating of the course played. These values are typically found on the scorecard or
          course website.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the number of rounds you want to include in the calculation.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your Adjusted Gross Score for each round. This is your total strokes adjusted for any handicap strokes received.
          </li>
          <li>
            <strong>Step 3:</strong> Input the Course Rating and Slope Rating for each course played.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to see your Handicap Index, which will update automatically as you enter data.
          </li>
          <li>
            <strong>Step 5:</strong> Use the "Reset" button to clear all inputs and start fresh.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your Golf Handicap Index requires consistent practice, strategic course management,
          and physical conditioning. Focus on developing a reliable short game, as it can significantly
          reduce your scores. Incorporate drills that improve putting, chipping, and bunker play.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, maintaining cardiovascular fitness and flexibility can enhance your swing
          mechanics and endurance during rounds. Tracking your handicap over time with this calculator
          helps identify trends and areas for improvement, enabling targeted training and goal setting.
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
          For more information on golf handicapping, course rating, and training science, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.usga.org/handicapping.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USGA Handicap System <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official United States Golf Association resource detailing the World Handicap System and calculation methods.
            </p>
          </li>
          <li>
            <a
              href="https://www.randa.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              The R&A <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Governing body for golf worldwide, providing rules, course rating standards, and handicap system governance.
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
              Leading authority on sports science and exercise physiology, offering insights into golf-specific fitness and training.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Golf Handicap Calculator"
      description="Calculate your official Golf Handicap Index using your recent rounds, course ratings, and slope ratings. Track your progress and compete fairly."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "USGA Handicap Index Formula",
        formula:
          "Handicap Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating; Handicap Index = Average of best differentials × 0.96",
        variables: [
          { symbol: "Adjusted Gross Score", description: "Your total strokes adjusted for any handicap strokes" },
          { symbol: "Course Rating", description: "Difficulty rating for a scratch golfer" },
          { symbol: "Slope Rating", description: "Relative difficulty for a bogey golfer compared to scratch golfer" },
          { symbol: "113", description: "Standard slope rating used for normalization" },
          { symbol: "0.96", description: "USGA multiplier to adjust average differential" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A golfer has played 7 rounds with the following scores and course data. Calculate their Handicap Index.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter each round's Adjusted Gross Score, Course Rating, and Slope Rating into the calculator inputs.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator computes the Handicap Differential for each round using the formula: (Score - Course Rating) × 113 / Slope Rating.",
          },
          {
            label: "Step 3",
            explanation:
              "It selects the best 3 differentials (since 7 rounds played) and averages them, then multiplies by 0.96 to get the Handicap Index.",
          },
          {
            label: "Step 4",
            explanation: "The resulting Handicap Index is displayed, representing the golfer's potential ability.",
          },
        ],
        result: "For example, if the best 3 differentials average to 12.5, the Handicap Index = 12.5 × 0.96 = 12.0.",
      }}
      relatedCalculators={[
        { title: "Calories Burned per Workout (MET)", url: "/sports/calories-burned-met", icon: "Flame" },
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "Activity" },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "Flame" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "Trophy" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "Trophy" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "Trophy" },
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