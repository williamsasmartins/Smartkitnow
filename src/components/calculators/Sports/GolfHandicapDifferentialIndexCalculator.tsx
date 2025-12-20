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

function roundToOneDecimal(num: number) {
  return Math.round(num * 10) / 10;
}

export default function GolfHandicapDifferentialIndexCalculator() {
  /**
   * Inputs:
   * - Score (number): The gross score for the round.
   * - Course Rating (number): The difficulty rating of the course for a scratch golfer.
   * - Slope Rating (number): The difficulty rating of the course for a bogey golfer (standard 113).
   * - Number of Differentials (number): Number of recent differentials to use for index calculation (min 3, max 20).
   * - Differentials (array of numbers): The list of handicap differentials from recent rounds.
   */

  const [inputs, setInputs] = useState({
    score: "",
    courseRating: "",
    slopeRating: "113",
    numDifferentials: "5",
    differentials: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Parse inputs safely
  const score = parseFloat(inputs.score);
  const courseRating = parseFloat(inputs.courseRating);
  const slopeRating = parseFloat(inputs.slopeRating);
  const numDifferentials = Math.min(Math.max(parseInt(inputs.numDifferentials), 3), 20);

  // Parse differentials input (comma separated)
  const differentialsArray = inputs.differentials
    .split(",")
    .map((d) => parseFloat(d.trim()))
    .filter((d) => !isNaN(d));

  // Calculate Handicap Differential for current round
  // Formula: (Score - Course Rating) * 113 / Slope Rating
  const currentDifferential =
    !isNaN(score) && !isNaN(courseRating) && !isNaN(slopeRating) && slopeRating > 0
      ? roundToOneDecimal(((score - courseRating) * 113) / slopeRating)
      : null;

  // Calculate Handicap Index from differentials
  // Steps:
  // 1. Sort differentials ascending
  // 2. Use the lowest 'numDifferentials' differentials (or all if less)
  // 3. Average them
  // 4. Multiply by 0.96 (USGA standard)
  // 5. Round to one decimal place

  const sortedDifferentials = [...differentialsArray].sort((a, b) => a - b);
  const differentialsToUse = sortedDifferentials.slice(0, numDifferentials);

  const averageDifferential =
    differentialsToUse.length > 0
      ? differentialsToUse.reduce((a, b) => a + b, 0) / differentialsToUse.length
      : null;

  const handicapIndex =
    averageDifferential !== null ? roundToOneDecimal(averageDifferential * 0.96) : null;

  // Result label and subtext
  const results = useMemo(() => {
    if (
      currentDifferential === null &&
      (handicapIndex === null || differentialsToUse.length === 0)
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid inputs to calculate.",
        formulaUsed: "",
      };
    }

    let value = "";
    let label = "";
    let subtext = "";
    let warning = null;
    let formulaUsed = "";

    if (currentDifferential !== null) {
      value = currentDifferential.toFixed(1);
      label = "Handicap Differential for Current Round";
      formulaUsed =
        "Handicap Differential = (Score - Course Rating) × 113 / Slope Rating";
      subtext = `Calculated from Score: ${score}, Course Rating: ${courseRating}, Slope Rating: ${slopeRating}`;
    }

    if (handicapIndex !== null) {
      value += value ? " | " : "";
      value += handicapIndex.toFixed(1);
      label += label ? " & Handicap Index" : "Handicap Index";
      formulaUsed += formulaUsed
        ? " & Handicap Index = Average of lowest differentials × 0.96"
        : "Handicap Index = Average of lowest differentials × 0.96";
      subtext +=
        subtext +
        ` | Using lowest ${differentialsToUse.length} differential${
          differentialsToUse.length > 1 ? "s" : ""
        } from provided list`;
    }

    if (differentialsArray.length < numDifferentials) {
      warning = `Warning: You provided only ${differentialsArray.length} differential${
        differentialsArray.length !== 1 ? "s" : ""
      }, but selected to use ${numDifferentials}. Calculation uses available differentials.`;
    }

    return { value, label, subtext, warning, formulaUsed };
  }, [
    currentDifferential,
    handicapIndex,
    score,
    courseRating,
    slopeRating,
    differentialsArray.length,
    numDifferentials,
    differentialsToUse.length,
  ]);

  // FAQ content
  const faqs = [
    {
      question: "What is a Golf Handicap Differential?",
      answer:
        "A Golf Handicap Differential represents the relative difficulty of a golf round compared to the course rating and slope. It is calculated by adjusting your gross score to a standard difficulty level, allowing fair comparison across different courses. This differential is the foundation for calculating your Handicap Index.",
    },
    {
      question: "How is the Handicap Index calculated from differentials?",
      answer:
        "The Handicap Index is computed by averaging the lowest Handicap Differentials from your recent rounds, typically the best 5 out of your last 20 scores. This average is then multiplied by 0.96 to provide a slightly conservative estimate of your playing ability, ensuring fairness in competition.",
    },
    {
      question: "Why do I need to input multiple differentials?",
      answer:
        "Multiple differentials provide a more accurate and stable Handicap Index by smoothing out anomalies from any single round. Using several recent scores accounts for variations in performance and course difficulty, resulting in a fairer representation of your skill level.",
    },
    {
      question: "What if I don’t know the slope rating of the course?",
      answer:
        "If the slope rating is unknown, the standard value of 113 can be used as a default. This represents an average course difficulty and allows you to estimate your Handicap Differential. However, for precise calculations, it’s best to use the actual slope rating provided by the course.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Golf Handicap Differential &amp; Index
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Golf Handicap Differential is a standardized measure that adjusts your raw golf score based on the difficulty of the course played. It enables golfers to compare performances across different courses by accounting for variations in course rating and slope rating. This differential is essential for calculating your Handicap Index, which reflects your potential playing ability.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Course Rating represents the expected score for a scratch golfer on a particular course, while the Slope Rating indicates the relative difficulty for a bogey golfer compared to a scratch golfer. By incorporating these ratings, the Handicap Differential normalizes scores, making handicaps equitable and meaningful.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Your Handicap Index is calculated by averaging the lowest Handicap Differentials from your recent rounds, typically the best 5 out of your last 20. This average is then multiplied by a factor of 0.96 to provide a slight buffer, ensuring the index reflects your potential rather than your average performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Maintaining an accurate Handicap Index allows golfers of varying skill levels to compete fairly, fostering enjoyment and sportsmanship in the game. Understanding these concepts is crucial for anyone serious about tracking and improving their golf performance.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you determine your Handicap Differential for a single round and your overall Handicap Index based on multiple differentials. To use it effectively, you need to input your round score, the course rating, and the slope rating of the course you played.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, you can input a list of your recent Handicap Differentials to calculate your Handicap Index. The calculator will use the lowest differentials based on the number you specify (between 3 and 20), average them, and apply the USGA multiplier of 0.96.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Follow the steps below to get your results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your gross score for the round you want to analyze.
          </li>
          <li>
            <strong>Step 2:</strong> Input the Course Rating and Slope Rating for the course played. If unknown, use 113 for slope rating.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your recent Handicap Differentials as a comma-separated list.
          </li>
          <li>
            <strong>Step 4:</strong> Specify how many of the lowest differentials to use for the Handicap Index calculation (minimum 3, maximum 20).
          </li>
          <li>
            <strong>Step 5:</strong> Click &quot;Calculate&quot; to see your Handicap Differential for the current round and your Handicap Index.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips &amp; Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your golf handicap requires consistent practice and strategic training. Focus on developing a well-rounded game by working on driving accuracy, approach shots, short game, and putting. Each area contributes significantly to lowering your scores and, consequently, your Handicap Differential.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Track your scores diligently and use this calculator regularly to monitor your Handicap Index. Analyze rounds where your differential was higher than usual to identify weaknesses or external factors such as course difficulty or weather conditions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate physical conditioning and mental training into your routine. Flexibility, strength, and focus can improve swing mechanics and course management. Consider working with a coach to tailor your practice sessions and receive feedback on your technique.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, play a variety of courses with different ratings and slopes to gain experience and adapt your game. This diversity will help you maintain a stable and accurate Handicap Index over time.
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
          References &amp; Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.usga.org/handicapping.html" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              USGA Handicap System <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official United States Golf Association resource detailing the rules and calculations behind the Handicap System.
            </p>
          </li>
          <li>
            <a href="https://www.randa.org/rules-of-handicap" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              R&A Handicap Guide <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The R&A provides comprehensive guidelines on handicapping used internationally, complementing USGA standards.
            </p>
          </li>
          <li>
            <a href="https://www.golfdigest.com/story/understanding-handicap-index" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Golf Digest: Understanding Handicap Index <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An accessible explanation of how handicaps work and tips for golfers to improve their index.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Example scenario for formula section
  const example = {
    title: "Real Life Example",
    scenario:
      "A golfer plays a round scoring 85 on a course with a Course Rating of 72.5 and a Slope Rating of 130. They have recent differentials: 12.3, 11.5, 13.0, 10.8, 12.0.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Calculate the Handicap Differential for the round: (85 - 72.5) × 113 / 130 = 11.7",
      },
      {
        label: "Step 2",
        explanation:
          "Sort recent differentials and select the lowest 5: 10.8, 11.5, 12.0, 12.3, 13.0",
      },
      {
        label: "Step 3",
        explanation:
          "Calculate the average: (10.8 + 11.5 + 12.0 + 12.3 + 13.0) / 5 = 11.92",
      },
      {
        label: "Step 4",
        explanation:
          "Multiply by 0.96 to get Handicap Index: 11.92 × 0.96 = 11.44, rounded to 11.4",
      },
    ],
    result: "Handicap Differential: 11.7 | Handicap Index: 11.4",
  };

  // Formula display
  const formula = {
    title: "Formula",
    formula: "Handicap Differential = (Score - Course Rating) × 113 / Slope Rating",
    variables: [
      { symbol: "Score", description: "Gross score for the round" },
      { symbol: "Course Rating", description: "Difficulty rating for scratch golfer" },
      { symbol: "Slope Rating", description: "Relative difficulty for bogey golfer (standard 113)" },
    ],
  };

  // Widget UI
  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950 border-green-200 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="score" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
              Score <Calculator className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="score"
              type="number"
              min="1"
              max="200"
              placeholder="e.g. 85"
              value={inputs.score}
              onChange={(e) => handleInputChange("score", e.target.value)}
              aria-describedby="score-desc"
            />
            <p id="score-desc" className="text-xs text-slate-500 mt-1">
              Enter your gross score for the round.
            </p>
          </div>

          <div>
            <Label htmlFor="courseRating" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
              Course Rating <Gauge className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="courseRating"
              type="number"
              step="0.1"
              min="60"
              max="80"
              placeholder="e.g. 72.5"
              value={inputs.courseRating}
              onChange={(e) => handleInputChange("courseRating", e.target.value)}
              aria-describedby="courseRating-desc"
            />
            <p id="courseRating-desc" className="text-xs text-slate-500 mt-1">
              The difficulty rating for a scratch golfer.
            </p>
          </div>

          <div>
            <Label htmlFor="slopeRating" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
              Slope Rating <Scale className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="slopeRating"
              type="number"
              min="55"
              max="155"
              placeholder="e.g. 113"
              value={inputs.slopeRating}
              onChange={(e) => handleInputChange("slopeRating", e.target.value)}
              aria-describedby="slopeRating-desc"
            />
            <p id="slopeRating-desc" className="text-xs text-slate-500 mt-1">
              Course difficulty for bogey golfer (standard is 113).
            </p>
          </div>

          <div>
            <Label htmlFor="differentials" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
              Recent Handicap Differentials <TrendingUp className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="differentials"
              type="text"
              placeholder="e.g. 12.3, 11.5, 13.0, 10.8, 12.0"
              value={inputs.differentials}
              onChange={(e) => handleInputChange("differentials", e.target.value)}
              aria-describedby="differentials-desc"
            />
            <p id="differentials-desc" className="text-xs text-slate-500 mt-1">
              Enter comma-separated Handicap Differentials from recent rounds.
            </p>
          </div>

          <div>
            <Label htmlFor="numDifferentials" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
              Number of Differentials to Use <Flag className="w-4 h-4 text-green-600" />
            </Label>
            <Select
              value={inputs.numDifferentials}
              onValueChange={(v) => handleInputChange("numDifferentials", v)}
              aria-describedby="numDifferentials-desc"
            >
              <SelectTrigger id="numDifferentials" className="w-full">
                <SelectValue placeholder="Select number" />
              </SelectTrigger>
              <SelectContent>
                {[3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p id="numDifferentials-desc" className="text-xs text-slate-500 mt-1">
              Choose how many lowest differentials to average for Handicap Index.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white shadow-md"
          aria-label="Calculate Handicap Differential and Index"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              score: "",
              courseRating: "",
              slopeRating: "113",
              numDifferentials: "5",
              differentials: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-950 border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-green-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-green-800 dark:text-green-300 mt-2">{results.label}</p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-3 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            {results.formulaUsed && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-4 italic">{results.formulaUsed}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Golf Handicap Differential &amp; Index"
      description="Calculate Golf Handicap Differential and determine your Handicap Index based on course rating, slope difficulty, and recent differentials."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏆" },
        { title: "Macronutrient Calculator (Sports)", url: "/sports/macronutrient-calculator", icon: "🏆" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
        { title: "FTP (Functional Threshold Power) Zones Planner", url: "/sports/ftp-zones-planner", icon: "🚴" },
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