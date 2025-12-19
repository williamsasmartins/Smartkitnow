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

export default function GolfHandicapDifferentialIndexCalculator() {
  /**
   * Inputs:
   * - score: The gross score for the round played.
   * - courseRating: The difficulty rating of the course for a scratch golfer.
   * - slopeRating: The slope rating of the course (55-155 scale).
   * - playingHandicapCount: Number of differentials to use for index calculation (usually 20 rounds).
   */

  const [inputs, setInputs] = useState({
    score: "",
    courseRating: "",
    slopeRating: "",
    differentialsCount: "20",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate Handicap Differential for a single round
  // Formula: (Score - Course Rating) x 113 / Slope Rating
  // Handicap Index is the average of the lowest differentials (usually lowest 8 of last 20)
  // Here, we calculate differential for one round, and optionally average if multiple inputs were allowed.
  // For simplicity, this calculator focuses on single round differential and index from multiple differentials input.

  // For PRO CONTENT: We allow user to input multiple differentials (comma separated) to calculate index.

  const [differentialsInput, setDifferentialsInput] = useState("");

  const parseDifferentials = (input) => {
    // Parse comma or space separated numbers, filter valid numbers
    return input
      .split(/[\s,]+/)
      .map((v) => parseFloat(v))
      .filter((v) => !isNaN(v) && v > 0);
  };

  const results = useMemo(() => {
    const score = parseFloat(inputs.score);
    const courseRating = parseFloat(inputs.courseRating);
    const slopeRating = parseFloat(inputs.slopeRating);
    const differentialsCount = parseInt(inputs.differentialsCount, 10);
    const diffs = parseDifferentials(differentialsInput);

    let differential = null;
    let index = null;
    let warning = null;
    let formulaUsed = "";

    // Validate inputs for differential calculation
    if (!isNaN(score) && !isNaN(courseRating) && !isNaN(slopeRating) && slopeRating > 0) {
      differential = ((score - courseRating) * 113) / slopeRating;
      differential = Math.round(differential * 10) / 10; // round to 1 decimal
      formulaUsed = "Handicap Differential = ((Score - Course Rating) × 113) ÷ Slope Rating";
    }

    // Calculate Handicap Index from differentials array
    // USGA rules: Use lowest 8 differentials out of most recent 20 rounds (or fewer rounds with adjusted count)
    // For simplicity, user inputs differentials manually.
    if (diffs.length > 0) {
      // Sort ascending
      const sorted = diffs.sort((a, b) => a - b);
      // Determine number of differentials to use based on count
      // USGA Table for number of differentials used:
      // 5-6 rounds: lowest 1
      // 7-8 rounds: lowest 2
      // 9-10 rounds: lowest 3
      // 11-12 rounds: lowest 4
      // 13-14 rounds: lowest 5
      // 15-16 rounds: lowest 6
      // 17 rounds: lowest 7
      // 18-19 rounds: lowest 8
      // 20+ rounds: lowest 8
      let countToUse = 0;
      if (sorted.length < 5) {
        warning = "At least 5 differentials are recommended for an accurate Handicap Index.";
      }
      if (sorted.length >= 20) countToUse = 8;
      else if (sorted.length >= 18) countToUse = 8;
      else if (sorted.length === 17) countToUse = 7;
      else if (sorted.length >= 15) countToUse = 6;
      else if (sorted.length >= 13) countToUse = 5;
      else if (sorted.length >= 11) countToUse = 4;
      else if (sorted.length >= 9) countToUse = 3;
      else if (sorted >= 7) countToUse = 2;
      else if (sorted >= 5) countToUse = 1;

      if (countToUse === 0) countToUse = 1; // fallback

      const lowestDiffs = sorted.slice(0, countToUse);
      const avg = lowestDiffs.reduce((a, b) => a + b, 0) / countToUse;

      // USGA Handicap Index formula includes multiplying by 0.96 (bonus for excellence)
      index = Math.round(avg * 0.96 * 10) / 10;
      formulaUsed = "Handicap Index = Average of lowest differentials × 0.96";
    }

    return {
      differential: differential !== null ? differential.toFixed(1) : null,
      index: index !== null ? index.toFixed(1) : null,
      warning,
      formulaUsed,
    };
  }, [inputs, differentialsInput]);

  const faqs = [
    {
      question: "What is a Golf Handicap Differential?",
      answer:
        "A Golf Handicap Differential represents the relative difficulty of a round played compared to the course rating and slope. It adjusts your gross score to a standardized scale, allowing fair comparison of scores across different courses and conditions.",
    },
    {
      question: "How is the Handicap Index calculated?",
      answer:
        "The Handicap Index is calculated by averaging the lowest Handicap Differentials from your most recent rounds (usually the lowest 8 of 20). This average is then multiplied by 0.96 to provide a slight advantage for consistent excellence, as per USGA guidelines.",
    },
    {
      question: "Why is the slope rating important?",
      answer:
        "Slope rating measures the relative difficulty of a course for a bogey golfer compared to a scratch golfer. It adjusts the Handicap Differential to reflect the challenge posed by the course, ensuring handicaps are equitable across varying course difficulties.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="score" className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" /> Gross Score
              </Label>
              <Input
                id="score"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 85"
                value={inputs.score}
                onChange={(e) => handleInputChange("score", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="courseRating" className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-green-600" /> Course Rating
              </Label>
              <Input
                id="courseRating"
                type="number"
                min="65"
                max="80"
                step="0.1"
                placeholder="e.g. 72.5"
                value={inputs.courseRating}
                onChange={(e) => handleInputChange("courseRating", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="slopeRating" className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-red-600" /> Slope Rating
              </Label>
              <Input
                id="slopeRating"
                type="number"
                min="55"
                max="155"
                step="1"
                placeholder="e.g. 130"
                value={inputs.slopeRating}
                onChange={(e) => handleInputChange("slopeRating", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="differentialsInput" className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" /> Handicap Differentials (comma separated)
              </Label>
              <Input
                id="differentialsInput"
                type="text"
                placeholder="e.g. 12.3, 10.5, 11.0, 13.2"
                value={differentialsInput}
                onChange={(e) => setDifferentialsInput(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
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
          onClick={() => {
            setInputs({ score: "", courseRating: "", slopeRating: "", differentialsCount: "20" });
            setDifferentialsInput("");
          }}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {(results.differential || results.index) && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            {results.differential && (
              <div>
                <p className="text-lg font-semibold text-blue-800 dark:text-white">Handicap Differential</p>
                <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.differential}</p>
              </div>
            )}
            {results.index && (
              <div>
                <p className="text-lg font-semibold text-indigo-800 dark:text-white">Handicap Index</p>
                <p className="text-5xl font-extrabold text-indigo-900 dark:text-white">{results.index}</p>
              </div>
            )}
            {results.warning && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                <AlertTriangle className="inline w-4 h-4 mr-1" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-2">{results.formulaUsed}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding Golf Handicap Differential & Index</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Golf Handicap Differential is a standardized measure that adjusts a player's gross score to account for the difficulty of the course played. It is calculated by comparing the player's score against the course rating and slope rating, which represent the challenge posed to scratch and bogey golfers respectively. This differential allows golfers of varying skill levels to compete fairly by normalizing scores across different courses and conditions. The Handicap Index, derived from the average of the lowest differentials, provides a dynamic measure of a golfer's potential ability, updated as new scores are posted.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The United States Golf Association (USGA) and other governing bodies use this system to promote equitable competition. The slope rating, ranging from 55 to 155, adjusts for course difficulty relative to a bogey golfer, ensuring that handicaps reflect the true challenge faced. The Handicap Index is capped and adjusted to maintain fairness and integrity in scoring, making it a vital tool for both casual and competitive golfers worldwide.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator enables you to compute your Handicap Differential for a single round and estimate your Handicap Index based on multiple differentials. To calculate the differential, input your gross score, the course rating, and the slope rating of the course you played. For a more comprehensive Handicap Index, enter your recent Handicap Differentials separated by commas or spaces. The calculator will then average the lowest differentials according to USGA guidelines and apply the standard multiplier.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your gross score, course rating, and slope rating for the round you want to analyze.
          </li>
          <li>
            <strong>Step 2:</strong> Input your recent Handicap Differentials separated by commas or spaces to calculate your Handicap Index.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to view your Handicap Differential and Index results.
          </li>
          <li>
            <strong>Step 4:</strong> Use the "Reset" button to clear inputs and start a new calculation.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To improve your Handicap Index, focus on consistent practice and course management. Work on your short game and putting, as these areas often yield the most strokes saved. Track your scores diligently and ensure you post all acceptable rounds to maintain an accurate Handicap Index. Playing on a variety of courses with different slope ratings can help you adapt your strategy and better understand how course difficulty affects your performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, consider mental training and physical conditioning to enhance focus and endurance during rounds. Regularly review your Handicap Differentials to identify trends and areas for improvement. Using technology such as launch monitors and swing analyzers can provide valuable feedback to refine your technique and lower your scores over time.
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
          For more information on golf handicapping systems, training science, and official rules, consult the following authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.usga.org/handicapping.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              United States Golf Association (USGA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official governing body for golf in the U.S., providing comprehensive rules and guidelines on handicapping.
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
              The R&A governs the rules of golf worldwide outside the U.S. and Mexico, including the World Handicap System.
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
              Leading authority on sports science and exercise physiology, offering insights into training and performance optimization.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Golf Handicap Differential & Index"
      description="Calculate your Golf Handicap Differential and Handicap Index based on course rating and slope difficulty. Use this authoritative calculator to understand and track your golfing performance."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Key Formulas",
        formula:
          "Handicap Differential = ((Score - Course Rating) × 113) ÷ Slope Rating\nHandicap Index = Average of lowest differentials × 0.96",
        variables: [
          { symbol: "Score", description: "Gross score for the round played" },
          { symbol: "Course Rating", description: "Difficulty rating for scratch golfers" },
          { symbol: "Slope Rating", description: "Course difficulty for bogey golfers (55-155 scale)" },
          { symbol: "Handicap Differential", description: "Adjusted score reflecting course difficulty" },
          { symbol: "Handicap Index", description: "Average of lowest differentials adjusted by 0.96 multiplier" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A golfer shoots an 85 on a course with a rating of 72.5 and a slope of 130. They have recent differentials of 12.3, 10.5, 11.0, 13.2, 9.8, 14.1, 10.2, and 11.5.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate the Handicap Differential for the round: ((85 - 72.5) × 113) ÷ 130 = 11.6",
          },
          {
            label: "Step 2",
            explanation:
              "Sort recent differentials and select the lowest 8: 9.8, 10.2, 10.5, 11.0, 11.5, 12.3, 13.2, 14.1",
          },
          {
            label: "Step 3",
            explanation:
              "Average these 8 differentials: (9.8 + 10.2 + 10.5 + 11.0 + 11.5 + 12.3 + 13.2 + 14.1) ÷ 8 = 11.3",
          },
          {
            label: "Step 4",
            explanation:
              "Multiply by 0.96 to get Handicap Index: 11.3 × 0.96 = 10.8",
          },
        ],
        result: "The golfer's Handicap Differential for the round is 11.6, and their Handicap Index is approximately 10.8.",
      }}
      relatedCalculators={[
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
        { title: "BABIP Calculator", url: "/sports/babip-calculator", icon: "🏆" },
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "Plate Loading Calculator", url: "/sports/plate-loading", icon: "🏋️" },
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
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