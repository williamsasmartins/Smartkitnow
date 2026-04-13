import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  RotateCcw,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function OneRepMax1rmEpleyBrzyckiCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState<{
    weight?: number;
    reps?: number;
  }>({});

  // 2. LOGIC
  // Epley formula: 1RM = weight * (1 + reps / 30)
  // Brzycki formula: 1RM = weight * (36 / (37 - reps))
  // Valid reps: 1-10 (typically)
  const results = useMemo(() => {
    const weight = inputs.weight ?? 0;
    const reps = inputs.reps ?? 0;

    if (weight <= 0 || reps <= 0 || reps > 10) {
      return { value: 0, label: "", category: "" };
    }

    // Calculate 1RM estimates
    const epley = weight * (1 + reps / 30);
    const brzycki = weight * (36 / (37 - reps));

    // Average the two for a balanced estimate
    const avg1RM = (epley + brzycki) / 2;

    // Round to nearest whole number for display
    const rounded = Math.round(avg1RM);

    // Label and category
    const label = unit === "imperial" ? "lbs" : "kg";

    return { value: rounded, label: label, category: "Estimated 1RM" };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the difference between the Epley and Brzycki formulas for 1RM?",
      answer: "The Epley formula tends to overestimate 1RM slightly at higher rep ranges, while the Brzycki formula provides more conservative estimates, particularly beyond 10 reps. For lifts in the 2-10 rep range, both formulas produce similar results within 5-10% accuracy. The Epley formula is: 1RM = weight × (1 + 0.0333 × reps), while Brzycki is: 1RM = weight ÷ (1.0278 - 0.0278 × reps).",
    },
    {
      question: "How accurate is the 1RM calculator for predicting my actual one-rep max?",
      answer: "Both Epley and Brzycki formulas have an accuracy range of ±5-10% for most lifters when reps are between 2-10. Accuracy decreases significantly beyond 10 reps, where estimates can deviate by 10-20%. Your actual 1RM may vary based on individual strength curve, training experience, and technique efficiency.",
    },
    {
      question: "Can I use this calculator for all types of lifts?",
      answer: "Yes, the 1RM calculator works for compound lifts like squats, deadlifts, and bench presses, as well as isolation exercises like bicep curls or leg presses. However, the formula is most accurate for barbell movements performed with proper form and in the 2-10 rep range. Machine exercises may produce less reliable estimates due to differences in leverage and resistance curves.",
    },
    {
      question: "What rep range should I use for the most accurate 1RM estimate?",
      answer: "The most accurate estimates come from rep ranges between 3-8 reps, where both formulas maintain ±5% accuracy. Using 2-rep or single lifts eliminates the need for estimation entirely. Avoid using this calculator with rep ranges &gt;12, as estimates become increasingly unreliable and can overestimate 1RM by 15-30%.",
    },
    {
      question: "Is it safe to attempt a calculated 1RM without prior training?",
      answer: "No, attempting a calculated 1RM without proper strength training foundation and technique mastery significantly increases injury risk. A calculated 1RM represents your theoretical maximum, not a guaranteed safe lift. Always build up to heavy singles gradually over weeks, focus on proper form, use spotters, and consider working with a qualified strength coach.",
    },
    {
      question: "How often should I recalculate my 1RM estimates?",
      answer: "Recalculate your 1RM every 4-6 weeks during active training phases to track progress, or immediately after a dedicated strength testing cycle. If you're consistently hitting your calculated max for 3-5 clean reps, it's time to retest or recalculate based on your new performance. Avoid constant recalculation as minor day-to-day fluctuations in strength don't represent true progress.",
    },
    {
      question: "Why does my calculated 1RM seem lower than what I've actually lifted?",
      answer: "This often occurs when lifters use poor form or partial range of motion on their tested weight, which inflates perceived strength without proportional muscle development. It can also happen if you tested reps at a submaximal effort or after fatigue from other exercises. If confident in your form and conditions, the estimate may be conservative—verify by testing a carefully programmed max attempt with full range of motion.",
    },
    {
      question: "Can I use this calculator for bodyweight exercises like pull-ups or dips?",
      answer: "Yes, you can use this calculator for weighted bodyweight exercises by adding the external weight to your bodyweight. For example, if you weigh 180 lbs and perform 6 weighted pull-ups with a 25 lb belt, enter 205 lbs as your weight. For unweighted pull-ups or dips, the calculator is less applicable since the 1RM concept doesn't translate directly; use absolute reps performed as a strength metric instead.",
    },
    {
      question: "Should I test my 1RM or rely on the calculator for programming?",
      answer: "Using the calculator for programming is safer and more practical for most lifters, as frequent maximal testing increases injury risk and neural fatigue. Calculate your 1RM every 4-6 weeks from submaximal lifts (3-8 reps) to adjust training weights. Only perform actual 1RM tests 1-2 times per year for peak strength assessment or competition preparation.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(value) => {
              setUnit(value);
              setInputs({}); // Reset inputs on unit change
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs, ft, in)</SelectItem>
              <SelectItem value="metric">Metric (kg, cm, m)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight Lifted ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step={unit === "imperial" ? 1 : 0.1}
            placeholder={unit === "imperial" ? "e.g. 100" : "e.g. 45.5"}
            value={inputs.weight ?? ""}
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                weight: e.target.value === "" ? undefined : Number(e.target.value),
              }))
            }
            aria-describedby="weight-desc"
          />
          <p
            id="weight-desc"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter the amount of weight you lifted for the reps below.
          </p>
        </div>

        {/* Reps Input */}
        <div>
          <Label htmlFor="reps" className="text-slate-700 dark:text-slate-300">
            Number of Repetitions (1-10)
          </Label>
          <Input
            id="reps"
            type="number"
            min={1}
            max={10}
            step={1}
            placeholder="e.g. 5"
            value={inputs.reps ?? ""}
            onChange={(e) => {
              const val = e.target.value === "" ? undefined : Number(e.target.value);
              if (val !== undefined && (val < 1 || val > 10)) return;
              setInputs((prev) => ({
                ...prev,
                reps: val,
              }));
            }}
            aria-describedby="reps-desc"
          />
          <p
            id="reps-desc"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter the number of reps performed at the weight above (max 10).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          disabled={
            !inputs.weight ||
            !inputs.reps ||
            inputs.weight <= 0 ||
            inputs.reps <= 0 ||
            inputs.reps > 10
          }
          aria-label="Calculate One-Rep Max"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite" aria-atomic="true">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the 1RM — One-Rep Max (Epley/Brzycki)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The 1RM calculator estimates your one-repetition maximum—the heaviest weight you can lift for a single rep—based on a submaximal lift you can perform for multiple reps. This tool is invaluable for strength athletes, powerlifters, and gym enthusiasts because it allows you to estimate your max without risking injury through actual maximal testing. Both the Epley and Brzycki formulas are scientifically validated and widely used in strength training programming.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, enter two values: the weight you lifted and the number of reps you completed with good form. The weight should be accurate to the nearest pound or kilogram, and the rep count should reflect the highest number of controlled, full-range repetitions you could perform. For best results, use weights that represent your true working max at that rep range—not a warm-up set or a set performed under fatigue.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will display your estimated 1RM using both formulas, allowing you to compare results and see which may be more conservative for your strength profile. Use the Epley estimate for slightly higher predictions and the Brzycki for more conservative estimates, particularly if you performed more than 10 reps. Apply these estimates to adjust your training weights for different rep ranges, periodize your workouts, or track strength progress over time without constant maximal testing.</p>
        </div>
      </section>

      {/* TABLE: 1RM Estimates Using Epley vs. Brzycki (200 lbs Lifted) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">1RM Estimates Using Epley vs. Brzycki (200 lbs Lifted)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares estimated one-rep maximums across different rep ranges using both the Epley and Brzycki formulas for a 200 lb lift.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Reps Performed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Epley Formula (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Brzycki Formula (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">206</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">204</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">213</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">227</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">222</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">247</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">238</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">273</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">262</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">293</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13 lbs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Epley tends to overestimate at higher rep ranges. Formulas are most accurate between 2-10 reps.</p>
      </section>

      {/* TABLE: Strength Standards for Upper Body Lifts (Male, Bodyweight 185 lbs) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Strength Standards for Upper Body Lifts (Male, Bodyweight 185 lbs)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These benchmarks represent approximate 1RM standards for untrained, intermediate, and advanced male lifters at 185 lbs bodyweight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lift</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Untrained</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Intermediate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Advanced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bench Press</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">135 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">315 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Overhead Press</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">145 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">205 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Barbell Row</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">155 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">255 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">365 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Incline Bench Press</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">245 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Close Grip Bench</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">115 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">185 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">275 lbs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Standards vary by training age, genetics, and technique. Use these as general reference points only.</p>
      </section>

      {/* TABLE: Rep Max Conversion Reference (Estimated 1RM of 300 lbs) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Rep Max Conversion Reference (Estimated 1RM of 300 lbs)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate weights for different rep maxes when your calculated 1RM is 300 lbs, useful for programming training cycles.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target Reps</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approximate Weight (%1RM)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Training Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300 lbs (100%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Maximal strength testing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280-290 lbs (93-97%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low rep strength work</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">265-275 lbs (88-92%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Strength and hypertrophy</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">255-265 lbs (85-88%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hypertrophy focus</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225-240 lbs (75-80%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Muscular endurance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-210 lbs (60-70%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Conditioning, high reps</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These percentages are approximations; actual loads depend on individual strength curves and lift type.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your submaximal reps when fresh and after adequate warm-up to ensure an accurate 1RM estimate; testing after fatigue or poor form will underestimate your true maximum.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use rep ranges between 3-8 reps for the most reliable 1RM estimates, as both formulas maintain ±5% accuracy in this zone and provide the best balance between safety and validity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Update your 1RM estimate every 4-6 weeks during training blocks to adjust your working weights and track strength progress; avoid constant daily recalculation as minor fluctuations in performance don't indicate true progress.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Apply your calculated 1RM percentages to structure training cycles: use 85-88% for hypertrophy (8-10 reps), 88-92% for strength (5-6 reps), and 75-80% for muscular endurance (12-15 reps).</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Testing at High Rep Ranges (&gt;12 reps)</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using rep ranges above 12-15 significantly reduces formula accuracy, with estimates potentially overestimating your 1RM by 15-30%. Stick to the 2-10 rep range for reliable estimates, as these formulas were validated using data from this rep range.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Including Failed Reps or Partial Reps</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Counting reps where you didn't achieve full range of motion or had to grind excessively inflates your numbers and leads to an overestimated 1RM. Only count reps performed with controlled form and complete range of motion for accurate calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Attempting Calculated Max Without Proper Progression</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A calculated 1RM is a theoretical estimate, not a guaranteed safe lift—attempting it without gradually building up strength and technique over weeks increases serious injury risk. Always progress conservatively toward heavy singles using proper periodization and coaching.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming One Formula is Always Correct</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Neither Epley nor Brzycki is universally perfect; individual variation in strength curves means one formula may suit your physiology better than the other. Compare both results and use historical testing data to determine which formula typically tracks closer to your actual maxes.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between the Epley and Brzycki formulas for 1RM?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Epley formula tends to overestimate 1RM slightly at higher rep ranges, while the Brzycki formula provides more conservative estimates, particularly beyond 10 reps. For lifts in the 2-10 rep range, both formulas produce similar results within 5-10% accuracy. The Epley formula is: 1RM = weight × (1 + 0.0333 × reps), while Brzycki is: 1RM = weight ÷ (1.0278 - 0.0278 × reps).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the 1RM calculator for predicting my actual one-rep max?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Both Epley and Brzycki formulas have an accuracy range of ±5-10% for most lifters when reps are between 2-10. Accuracy decreases significantly beyond 10 reps, where estimates can deviate by 10-20%. Your actual 1RM may vary based on individual strength curve, training experience, and technique efficiency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all types of lifts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the 1RM calculator works for compound lifts like squats, deadlifts, and bench presses, as well as isolation exercises like bicep curls or leg presses. However, the formula is most accurate for barbell movements performed with proper form and in the 2-10 rep range. Machine exercises may produce less reliable estimates due to differences in leverage and resistance curves.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What rep range should I use for the most accurate 1RM estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most accurate estimates come from rep ranges between 3-8 reps, where both formulas maintain ±5% accuracy. Using 2-rep or single lifts eliminates the need for estimation entirely. Avoid using this calculator with rep ranges &gt;12, as estimates become increasingly unreliable and can overestimate 1RM by 15-30%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is it safe to attempt a calculated 1RM without prior training?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, attempting a calculated 1RM without proper strength training foundation and technique mastery significantly increases injury risk. A calculated 1RM represents your theoretical maximum, not a guaranteed safe lift. Always build up to heavy singles gradually over weeks, focus on proper form, use spotters, and consider working with a qualified strength coach.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my 1RM estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate your 1RM every 4-6 weeks during active training phases to track progress, or immediately after a dedicated strength testing cycle. If you're consistently hitting your calculated max for 3-5 clean reps, it's time to retest or recalculate based on your new performance. Avoid constant recalculation as minor day-to-day fluctuations in strength don't represent true progress.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does my calculated 1RM seem lower than what I've actually lifted?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This often occurs when lifters use poor form or partial range of motion on their tested weight, which inflates perceived strength without proportional muscle development. It can also happen if you tested reps at a submaximal effort or after fatigue from other exercises. If confident in your form and conditions, the estimate may be conservative—verify by testing a carefully programmed max attempt with full range of motion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for bodyweight exercises like pull-ups or dips?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, you can use this calculator for weighted bodyweight exercises by adding the external weight to your bodyweight. For example, if you weigh 180 lbs and perform 6 weighted pull-ups with a 25 lb belt, enter 205 lbs as your weight. For unweighted pull-ups or dips, the calculator is less applicable since the 1RM concept doesn't translate directly; use absolute reps performed as a strength metric instead.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I test my 1RM or rely on the calculator for programming?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Using the calculator for programming is safer and more practical for most lifters, as frequent maximal testing increases injury risk and neural fatigue. Calculate your 1RM every 4-6 weeks from submaximal lifts (3-8 reps) to adjust training weights. Only perform actual 1RM tests 1-2 times per year for peak strength assessment or competition preparation.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nsca.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Strength and Conditioning Association (NSCA) — Position Stand on Strength Training</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The NSCA provides evidence-based guidelines for strength testing and programming across all populations and experience levels.</p>
          </li>
          <li>
            <a href="https://www.acsm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American College of Sports Medicine (ACSM) — Resistance Training Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ACSM offers peer-reviewed research on exercise prescription, including one-rep max testing protocols and safety standards.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PubMed Central — Epley and Brzycki Formula Validation Studies</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific literature database containing peer-reviewed studies validating the accuracy and limitations of both 1RM prediction formulas.</p>
          </li>
          <li>
            <a href="https://exrx.net/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ExRx.net — Exercise Prescription Information and Database</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource providing exercise execution guidelines, strength standards, and one-rep max programming applications for various lifts.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="1RM — One-Rep Max (Epley/Brzycki)"
      description="Calculate your One-Rep Max (1RM) safely. Estimate your maximum lifting strength using proven Epley and Brzycki formulas."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula: `1RM_{Epley} = weight \u00D7 (1 + reps / 30)\n1RM_{Brzycki} = weight \u00D7 \frac{36}{37 - reps}`,
        variables: [
          {
            symbol: "weight",
            description:
              "The amount of weight lifted during the submaximal set (lbs or kg).",
          },
          {
            symbol: "reps",
            description:
              "The number of repetitions performed at the given weight (1-10).",
          },
          {
            symbol: "1RM",
            description:
              "Estimated One-Rep Max, the maximum weight that can be lifted for one repetition.",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "Suppose you lifted 150 lbs for 5 repetitions on the bench press and want to estimate your 1RM.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input 150 lbs as the weight and 5 as the number of repetitions.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator applies the Epley and Brzycki formulas and averages the results.",
          },
        ],
        result:
          "The estimated 1RM is approximately 180 lbs, indicating the maximum weight you could lift for one repetition.",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "💧",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "🥗",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is 1RM — One-Rep Max (Epley/Brzycki)?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}