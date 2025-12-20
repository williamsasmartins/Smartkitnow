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
  // 1. Calculate Handicap Differentials for each score:
  //    Differential = (Adjusted Gross Score - Course Rating) * 113 / Slope Rating
  // 2. Use best differentials based on number of scores:
  //    3-6 scores: lowest 1 differential
  //    7-8 scores: lowest 2 differentials
  //    9-10 scores: lowest 3 differentials
  //    11-12 scores: lowest 4 differentials
  //    13-14 scores: lowest 5 differentials
  //    15-16 scores: lowest 6 differentials
  //    17 scores: lowest 7 differentials
  //    18 scores: lowest 8 differentials
  //    19 scores: lowest 9 differentials
  //    20+ scores: lowest 10 differentials
  // 3. Average the selected differentials and multiply by 0.96 (USGA standard)
  // 4. Handicap Index is truncated (not rounded) to one decimal place

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
    return ((score - cr) * 113) / sr;
  });

  differentials.sort((a, b) => a - b);

  let countToUse = 0;
  const n = differentials.length;
  if (n < 3) return null; // Minimum 3 scores required

  if (n >= 3 && n <= 6) countToUse = 1;
  else if (n <= 8) countToUse = 2;
  else if (n <= 10) countToUse = 3;
  else if (n <= 12) countToUse = 4;
  else if (n <= 14) countToUse = 5;
  else if (n <= 16) countToUse = 6;
  else if (n === 17) countToUse = 7;
  else if (n === 18) countToUse = 8;
  else if (n === 19) countToUse = 9;
  else countToUse = 10;

  const bestDiffs = differentials.slice(0, countToUse);
  const avg = bestDiffs.reduce((a, b) => a + b, 0) / countToUse;
  const handicapIndex = Math.floor(avg * 0.96 * 10) / 10; // truncate to 1 decimal

  return handicapIndex >= 0 ? handicapIndex.toFixed(1) : "0.0";
}

export default function GolfHandicapCalculator() {
  // Inputs: multiple rounds with Score, Course Rating, Slope Rating
  // We'll allow up to 20 rounds input dynamically

  const [rounds, setRounds] = useState([
    { score: "", courseRating: "", slopeRating: "" },
  ]);

  const handleRoundChange = useCallback(
    (index, field, value) => {
      setRounds((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], [field]: value };
        return copy;
      });
    },
    [setRounds]
  );

  const addRound = useCallback(() => {
    setRounds((prev) => {
      if (prev.length >= 20) return prev;
      return [...prev, { score: "", courseRating: "", slopeRating: "" }];
    });
  }, []);

  const removeRound = useCallback(
    (index) => {
      setRounds((prev) => {
        if (prev.length <= 1) return prev;
        const copy = [...prev];
        copy.splice(index, 1);
        return copy;
      });
    },
    [setRounds]
  );

  const results = useMemo(() => {
    // Validate inputs and parse numbers
    const scores = [];
    const courseRatings = [];
    const slopeRatings = [];

    for (const r of rounds) {
      const s = parseFloat(r.score);
      const cr = parseFloat(r.courseRating);
      const sr = parseFloat(r.slopeRating);

      if (
        isNaN(s) ||
        isNaN(cr) ||
        isNaN(sr) ||
        s <= 0 ||
        cr <= 0 ||
        sr < 55 || // slope rating min 55 per USGA
        sr > 155
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
      scores.push(s);
      courseRatings.push(cr);
      slopeRatings.push(sr);
    }

    if (scores.length < 3) {
      return {
        value: null,
        label: null,
        subtext: "At least 3 rounds are required to calculate a handicap index.",
        warning: true,
        formulaUsed:
          "Handicap Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating",
      };
    }

    const handicapIndex = calculateHandicapIndex(scores, courseRatings, slopeRatings);

    if (handicapIndex === null) {
      return {
        value: null,
        label: null,
        subtext: "Unable to calculate handicap index with the provided data.",
        warning: true,
        formulaUsed:
          "Handicap Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating",
      };
    }

    return {
      value: handicapIndex,
      label: "Your Golf Handicap Index",
      subtext:
        "This index allows you to compete fairly with golfers of different skill levels.",
      warning: null,
      formulaUsed:
        "Handicap Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating",
    };
  }, [rounds]);

  const faqs = [
    {
      question: "What is a golf handicap and why is it important?",
      answer:
        "A golf handicap is a numerical measure of a golfer's potential ability. It allows players of different skill levels to compete fairly by adjusting their scores relative to the difficulty of the course. The lower the handicap, the better the player. It is important because it levels the playing field and encourages improvement.",
    },
    {
      question: "How many rounds do I need to establish an official handicap?",
      answer:
        "According to the USGA, a minimum of three 18-hole scores are required to establish a handicap index. However, the more scores you submit (up to 20), the more accurate and stable your handicap will be. The system uses your best differentials from recent rounds to calculate your index.",
    },
    {
      question: "What is the difference between Course Rating and Slope Rating?",
      answer:
        "Course Rating represents the expected score for a scratch golfer (0 handicap) on a course under normal conditions. Slope Rating measures the relative difficulty of a course for a bogey golfer compared to a scratch golfer. Both ratings are essential to calculate a fair handicap differential for each round.",
    },
    {
      question: "Can I use this calculator for 9-hole rounds?",
      answer:
        "This calculator is designed for 18-hole rounds. For 9-hole rounds, the USGA recommends combining two 9-hole scores to form an 18-hole score or using a specific 9-hole handicap calculation method. Always check with your local golf association for official procedures.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        {rounds.map((round, i) => (
          <Card key={i} className="border-blue-300 shadow-sm">
            <CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <Label htmlFor={`score-${i}`}>Score (Adjusted Gross)</Label>
                <Input
                  id={`score-${i}`}
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 85"
                  value={round.score}
                  onChange={(e) => handleRoundChange(i, "score", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`courseRating-${i}`}>Course Rating</Label>
                <Input
                  id={`courseRating-${i}`}
                  type="number"
                  min="60"
                  max="80"
                  step="0.1"
                  placeholder="e.g. 72.5"
                  value={round.courseRating}
                  onChange={(e) => handleRoundChange(i, "courseRating", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor={`slopeRating-${i}`}>Slope Rating</Label>
                <Input
                  id={`slopeRating-${i}`}
                  type="number"
                  min="55"
                  max="155"
                  step="1"
                  placeholder="e.g. 130"
                  value={round.slopeRating}
                  onChange={(e) => handleRoundChange(i, "slopeRating", e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                {rounds.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRound(i)}
                    aria-label={`Remove round ${i + 1}`}
                    className="h-9 w-9 p-0 flex items-center justify-center"
                  >
                    <AlertTriangle className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={addRound}
        disabled={rounds.length >= 20}
        className="w-full"
        aria-label="Add round"
      >
        <PlusIcon className="mr-2 h-4 w-4" /> Add Round
      </Button>

      {/* Calculate & Reset */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          aria-label="Calculate Handicap"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setRounds([{ score: "", courseRating: "", slopeRating: "" }])
          }
          className="flex-1 h-11"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {results.subtext}
            </p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
              Formula used: {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}
      {results.warning && (
        <p className="text-red-600 dark:text-red-400 font-semibold mt-2">
          <AlertTriangle className="inline-block mr-1 h-4 w-4" />
          {results.subtext}
        </p>
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
          The golf handicap system is a standardized method to measure a golfer's
          potential playing ability. It allows players of varying skill levels to
          compete on an equitable basis by adjusting their scores relative to the
          difficulty of the courses they play. The handicap index reflects the
          average of a golfer's best performances, providing a fair comparison
          metric.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses the official USGA formula to compute your handicap
          index based on your recent rounds. It takes into account your adjusted
          gross scores, the course rating, and the slope rating for each round.
          The course rating represents the difficulty for a scratch golfer, while
          the slope rating adjusts for the relative difficulty for a bogey golfer.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By inputting your scores along with the course and slope ratings, this
          tool calculates your handicap differentials and averages the best ones
          according to USGA guidelines. The result is a precise handicap index that
          you can use to track your progress and compete fairly with others.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding your handicap index helps you set realistic goals, identify
          areas for improvement, and enjoy the game more competitively. It is an
          essential metric for both casual and serious golfers alike.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To calculate your golf handicap index, you need to enter your recent round
          scores along with the corresponding course rating and slope rating for
          each round. This calculator supports up to 20 rounds, which is the
          standard number used by the USGA for official handicap calculations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Each round requires three inputs: your adjusted gross score (the total
          strokes taken after applying any handicap or penalty adjustments), the
          course rating (a number typically between 67 and 77), and the slope rating
          (a number between 55 and 155). These ratings are usually provided on the
          scorecard or by the golf course.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering your rounds, click the "Calculate" button to compute your
          handicap index. If you need to clear all inputs, use the "Reset" button.
          The calculator will display your handicap index along with a brief
          explanation and the formula used.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Step 1: Enter your adjusted gross score for each round played.
          </li>
          <li>
            Step 2: Input the course rating and slope rating for each round.
          </li>
          <li>
            Step 3: Add more rounds as needed, up to 20, using the "Add Round"
            button.
          </li>
          <li>
            Step 4: Click "Calculate" to see your official golf handicap index.
          </li>
          <li>
            Step 5: Use the "Reset" button to clear all inputs and start over.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your golf handicap requires a combination of consistent practice,
          strategic course management, and physical conditioning. Focus on honing
          your short game, as putting and chipping often have the greatest impact
          on lowering scores.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Incorporate drills that improve your swing mechanics and accuracy. Use
          video analysis or work with a coach to identify and correct flaws. Regularly
          practice different shot types and lies to build confidence in varied
          situations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Physical fitness also plays a key role. Strengthen your core, improve
          flexibility, and enhance endurance to maintain consistency throughout
          your round. Mental training, including visualization and course strategy,
          can help you make smarter decisions and reduce costly mistakes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Track your progress using this handicap calculator regularly and set
          incremental goals. Celebrate improvements and analyze rounds to learn
          from mistakes. With dedication and smart training, you can steadily lower
          your handicap and enjoy the game more.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
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
              href="https://www.usga.org/handicapping.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USGA Handicap System <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The official United States Golf Association website detailing the
              rules and methodology behind the golf handicap system.
            </p>
          </li>
          <li>
            <a
              href="https://www.randa.org/handicap"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              R&A World Handicap System <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The R&A provides global governance on golf rules including the World
              Handicap System used internationally.
            </p>
          </li>
          <li>
            <a
              href="https://www.golfdigest.com/story/how-to-calculate-a-golf-handicap"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Golf Digest: How to Calculate a Golf Handicap <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A detailed guide explaining the calculation process and tips for
              golfers to understand their handicap better.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Golf Handicap Calculator"
      description="Calculate your official Golf Handicap. Enter your scores to track improvement and compete fairly with others."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "Handicap Differential = (Adjusted Gross Score - Course Rating) × 113 / Slope Rating",
        variables: [
          {
            symbol: "Adjusted Gross Score",
            description:
              "Your total strokes for the round after any adjustments or penalties.",
          },
          {
            symbol: "Course Rating",
            description:
              "The expected score for a scratch golfer on the course under normal conditions.",
          },
          {
            symbol: "Slope Rating",
            description:
              "A measure of the relative difficulty of the course for a bogey golfer compared to a scratch golfer.",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A golfer has played 5 rounds with the following scores and course data:",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input each round's adjusted gross score, course rating, and slope rating into the calculator.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator computes the handicap differentials for each round.",
          },
          {
            label: "Step 3",
            explanation:
              "It selects the best differentials based on the number of rounds and averages them.",
          },
          {
            label: "Step 4",
            explanation:
              "The average is multiplied by 0.96 and truncated to one decimal place to give the handicap index.",
          },
        ],
        result: "The golfer's handicap index is calculated as 12.4.",
      }}
      relatedCalculators={[
        {
          title: "Training Weight Percentage Calculator",
          url: "/sports/training-weight-percentage",
          icon: "🏆",
        },
        {
          title: "Race Time Predictor (Riegel Formula)",
          url: "/sports/race-time-predictor-riegel",
          icon: "🏆",
        },
        {
          title: "Fantasy Team Points Projections Calculator",
          url: "/sports/fantasy-team-points-projections",
          icon: "🏆",
        },
        {
          title: "Baseball OPS / SLG / OBP Calculator",
          url: "/sports/baseball-ops-slg-obp",
          icon: "⚽",
        },
        {
          title: "Win Probability Shift (WPS) Estimator",
          url: "/sports/win-probability-shift-wps",
          icon: "🏆",
        },
        {
          title: "Swim Pace: CSS (Critical Swim Speed) & Splits",
          url: "/sports/swim-pace-css-splits",
          icon: "🏃",
        },
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

// Additional icon needed for Add Round button
function PlusIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}