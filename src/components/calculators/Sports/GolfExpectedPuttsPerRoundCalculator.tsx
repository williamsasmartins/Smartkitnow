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

const puttingDistanceOptions = [
  { label: "0-3 feet", value: 3, avgPutts: 1.05 },
  { label: "3-6 feet", value: 6, avgPutts: 1.3 },
  { label: "6-10 feet", value: 10, avgPutts: 1.7 },
  { label: "10-15 feet", value: 15, avgPutts: 2.2 },
  { label: "15-20 feet", value: 20, avgPutts: 2.8 },
  { label: "20+ feet", value: 30, avgPutts: 3.5 },
];

// Average number of putts per distance band based on PGA Tour stats and putting performance studies.

export default function GolfExpectedPuttsPerRoundCalculator() {
  /*
    Inputs:
    - Number of putts attempted from each distance band per round.
    Output:
    - Expected total putts per round = sum of (putts attempted * avg putts per attempt)
  */

  const [inputs, setInputs] = useState({
    putts_0_3: "",
    putts_3_6: "",
    putts_6_10: "",
    putts_10_15: "",
    putts_15_20: "",
    putts_20_plus: "",
  });

  const handleInputChange = useCallback((name, value) => {
    // Only allow numeric input or empty string
    if (/^\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    // Parse inputs as integers or zero
    const counts = {
      putts_0_3: parseInt(inputs.putts_0_3) || 0,
      putts_3_6: parseInt(inputs.putts_3_6) || 0,
      putts_6_10: parseInt(inputs.putts_6_10) || 0,
      putts_10_15: parseInt(inputs.putts_10_15) || 0,
      putts_15_20: parseInt(inputs.putts_15_20) || 0,
      putts_20_plus: parseInt(inputs.putts_20_plus) || 0,
    };

    // Total attempts
    const totalAttempts =
      counts.putts_0_3 +
      counts.putts_3_6 +
      counts.putts_6_10 +
      counts.putts_10_15 +
      counts.putts_15_20 +
      counts.putts_20_plus;

    if (totalAttempts === 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter the number of putts attempted from each distance.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Calculate expected putts per round
    // Expected putts = sum over distance bands of (attempts * avg putts per attempt)
    const expectedPutts =
      counts.putts_0_3 * 1.05 +
      counts.putts_3_6 * 1.3 +
      counts.putts_6_10 * 1.7 +
      counts.putts_10_15 * 2.2 +
      counts.putts_15_20 * 2.8 +
      counts.putts_20_plus * 3.5;

    // Round to 2 decimals
    const roundedExpectedPutts = expectedPutts.toFixed(2);

    return {
      value: roundedExpectedPutts,
      label: "Expected Putts per Round",
      subtext:
        "This is the estimated total number of putts you can expect per round based on your input distribution.",
      warning: null,
      formulaUsed:
        "Expected Putts = Σ (Putts Attempted at Distance × Avg Putts per Attempt at that Distance)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does 'Expected Putts per Round' mean?",
      answer:
        "Expected Putts per Round estimates the total number of putts a golfer is likely to take in a full round based on the number of putts attempted from various distances. It helps golfers understand their putting performance relative to typical averages and identify areas for improvement.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "This calculator uses average putts per attempt derived from professional golf statistics and putting studies. While it provides a solid estimate, actual results may vary depending on individual skill, course conditions, and other factors. Use it as a benchmark rather than an absolute prediction.",
    },
    {
      question: "Can I use this calculator to track my progress over time?",
      answer:
        "Absolutely. By regularly inputting your putting attempts from different distances, you can monitor changes in your expected putts per round. This can help you identify improvements or areas needing more focused training in your short game.",
    },
    {
      question: "Why are putts from longer distances weighted higher?",
      answer:
        "Longer putts generally require more strokes to hole out due to increased difficulty and lower make percentages. Therefore, putts attempted from greater distances have higher average putts per attempt, reflecting the increased challenge and expected strokes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {puttingDistanceOptions.map(({ label, value }, i) => {
          const key = `putts_${label
            .replace(/[^\w]/g, "_")
            .toLowerCase()}`; /* e.g. putts_0_3_feet */
          // Map keys to inputs state keys:
          // We'll use fixed keys for inputs state:
          // 0-3 feet -> putts_0_3
          // 3-6 feet -> putts_3_6
          // 6-10 feet -> putts_6_10
          // 10-15 feet -> putts_10_15
          // 15-20 feet -> putts_15_20
          // 20+ feet -> putts_20_plus
          let inputKey = "";
          switch (label) {
            case "0-3 feet":
              inputKey = "putts_0_3";
              break;
            case "3-6 feet":
              inputKey = "putts_3_6";
              break;
            case "6-10 feet":
              inputKey = "putts_6_10";
              break;
            case "10-15 feet":
              inputKey = "putts_10_15";
              break;
            case "15-20 feet":
              inputKey = "putts_15_20";
              break;
            case "20+ feet":
              inputKey = "putts_20_plus";
              break;
          }
          return (
            <div key={inputKey} className="flex flex-col">
              <Label htmlFor={inputKey} className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Putts Attempted from {label}
              </Label>
              <Input
                id={inputKey}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="0"
                value={inputs[inputKey]}
                onChange={(e) => handleInputChange(inputKey, e.target.value)}
                className="max-w-[120px]"
                aria-describedby={`${inputKey}-desc`}
              />
              <p id={`${inputKey}-desc`} className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Avg putts per attempt:{" "}
                {
                  puttingDistanceOptions.find((opt) => {
                    switch (inputKey) {
                      case "putts_0_3":
                        return opt.label === "0-3 feet";
                      case "putts_3_6":
                        return opt.label === "3-6 feet";
                      case "putts_6_10":
                        return opt.label === "6-10 feet";
                      case "putts_10_15":
                        return opt.label === "10-15 feet";
                      case "putts_15_20":
                        return opt.label === "15-20 feet";
                      case "putts_20_plus":
                        return opt.label === "20+ feet";
                      default:
                        return false;
                    }
                  })?.avgPutts.toFixed(2)
                }
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate expected putts per round"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              putts_0_3: "",
              putts_3_6: "",
              putts_6_10: "",
              putts_10_15: "",
              putts_15_20: "",
              putts_20_plus: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value !== null && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
              Formula used: {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}

      {results.value === null && (
        <p className="text-center text-slate-600 dark:text-slate-400 mt-4">{results.subtext}</p>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Golf Expected Putts per Round
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Expected Putts per Round is a statistical estimate of the total number of putts a golfer is likely to take during an 18-hole round based on their putting attempts from various distances. This metric helps golfers and coaches analyze putting performance by breaking down the short game into measurable components.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation uses average putts per attempt from different distance bands, derived from professional golf statistics and research. Since putting difficulty increases with distance, longer putts typically require more strokes to hole out, which is reflected in the weighted averages used in this calculator.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          By understanding where putts are attempted and how many strokes are expected from each distance, golfers can identify strengths and weaknesses in their short game. This insight is crucial for targeted practice and strategic improvements on the greens.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Tracking expected putts over time also allows players to monitor progress and compare their performance against benchmarks such as professional averages or personal goals, making it a valuable tool for continuous development.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, input the number of putts you typically attempt from each distance range during a round of golf. These ranges cover common putting distances from very short (0-3 feet) to long putts (20+ feet). If you track your putting stats, use your actual counts; otherwise, estimate based on your experience.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once you enter the putts attempted from each distance, click the Calculate button to see your expected total putts per round. The calculator multiplies your attempts by average putts per attempt for each distance band and sums the results to provide an overall estimate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Use the Reset button to clear all inputs and start fresh. You can use this tool regularly to track changes in your putting distribution and performance, helping you focus your training on the distances where you can gain the most improvement.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Step 1: Enter the number of putts you attempt from each distance range during a typical round.
          </li>
          <li>
            Step 2: Click the Calculate button to compute your expected putts per round.
          </li>
          <li>
            Step 3: Review the results and use the insights to guide your putting practice and strategy.
          </li>
          <li>
            Step 4: Reset inputs as needed to test different scenarios or track progress over time.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Improving your expected putts per round starts with understanding your putting tendencies and focusing practice on the distances where you lose the most strokes. Short putts (0-6 feet) are critical for scoring, so prioritize drills that build confidence and consistency in this range.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For mid-range putts (6-15 feet), work on distance control and green reading skills. Use drills that simulate real course conditions, including breaks and varying green speeds. Practicing lag putting can reduce three-putts and save valuable strokes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Long putts (15+ feet) require a strategic approach. Focus on speed control to leave the ball close to the hole for an easy tap-in. Developing a repeatable stroke and practicing with different green speeds will improve your ability to judge distance and pace.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Incorporate video analysis and feedback tools to refine your putting mechanics. Mental training, including visualization and routine development, can also enhance focus and confidence on the greens.
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
              href="https://www.pgatour.com/stats.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              PGA Tour Stats <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official statistics from the PGA Tour, including putting performance and distance-based putting averages.
            </p>
          </li>
          <li>
            <a
              href="https://www.golfdigest.com/story/putting-stats-explained"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Golf Digest: Understanding Putting Stats <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An in-depth article explaining how putting statistics are measured and interpreted to improve your short game.
            </p>
          </li>
          <li>
            <a
              href="https://www.usga.org/content/usga/home-page/course-care/green-section-record/58/putting-performance-and-statistics.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USGA Green Section Record: Putting Performance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Research and insights from the USGA on putting performance metrics and how they relate to overall scoring.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  const formula = {
    title: "Formula",
    formula:
      "Expected Putts = Σ (Putts Attempted at Distance × Avg Putts per Attempt at that Distance)",
    variables: [
      {
        symbol: "Putts Attempted at Distance",
        description: "Number of putts attempted from a specific distance range during a round",
      },
      {
        symbol: "Avg Putts per Attempt at that Distance",
        description: "Average number of putts taken per attempt from that distance, based on professional data",
      },
    ],
  };

  const example = {
    title: "Real Life Example",
    scenario:
      "A golfer attempts 10 putts from 0-3 feet, 8 putts from 3-6 feet, 6 putts from 6-10 feet, 4 putts from 10-15 feet, 2 putts from 15-20 feet, and 1 putt from 20+ feet in a round.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Multiply each putt attempt count by the average putts per attempt for that distance: (10 × 1.05) + (8 × 1.3) + (6 × 1.7) + (4 × 2.2) + (2 × 2.8) + (1 × 3.5).",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate each product: 10.5 + 10.4 + 10.2 + 8.8 + 5.6 + 3.5.",
      },
      {
        label: "Step 3",
        explanation: "Sum all values: 10.5 + 10.4 + 10.2 + 8.8 + 5.6 + 3.5 = 48.99 expected putts.",
      },
    ],
    result: "The golfer's expected putts per round is approximately 49.0.",
  };

  return (
    <CalculatorVerticalLayout
      title="Golf Expected Putts per Round"
      description="Estimate expected putts per round. Track putting performance against benchmarks to improve your short game."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Cycling Power ↔ Speed Estimator (flat/wind)", url: "/sports/cycling-power-speed-estimator", icon: "🏆" },
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "Plate Loading Calculator", url: "/sports/plate-loading", icon: "🏆" },
        { title: "Betting Odds & Payout Calculator", url: "/sports/betting-odds-payout-calculator", icon: "🏆" },
        { title: "Soccer League Table: Points & GD", url: "/sports/soccer-league-table-points-gd", icon: "⚽" },
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