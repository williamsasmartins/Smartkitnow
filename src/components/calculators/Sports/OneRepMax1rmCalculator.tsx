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

export default function OneRepMax1rmCalculator() {
  const [inputs, setInputs] = useState({ weight: "", reps: "" });
  const [calculated, setCalculated] = useState(false);

  const handleInputChange = useCallback((n, v) => {
    // Allow only numbers and decimals
    if (v === "" || /^[0-9]*\.?[0-9]*$/.test(v)) {
      setInputs(p => ({ ...p, [n]: v }));
      setCalculated(false);
    }
  }, []);

  // Epley formula: 1RM = weight * (1 + reps / 30)
  // Valid reps: 1 to 10 (commonly)
  // We'll also show Brzycki formula for comparison:
  // Brzycki: 1RM = weight * (36 / (37 - reps))

  const results = useMemo(() => {
    const w = parseFloat(inputs.weight);
    const r = parseInt(inputs.reps);

    if (!w || !r || r < 1 || r > 10) {
      return { 
        value: null, 
        label: null, 
        subtext: null, 
        warning: r && (r < 1 || r > 10) ? "Reps should be between 1 and 10 for accurate estimation." : null,
        formulaUsed: null,
        brzycki: null,
      };
    }

    // Epley formula
    const epley1RM = w * (1 + r / 30);
    // Brzycki formula
    const brzycki1RM = w * (36 / (37 - r));

    // Round results to nearest 0.5 kg/lb
    const roundToHalf = (num) => Math.round(num * 2) / 2;

    return {
      value: roundToHalf(epley1RM).toFixed(1),
      label: "Estimated One-Rep Max (Epley Formula)",
      subtext: `Brzycki estimate: ${roundToHalf(brzycki1RM).toFixed(1)}`,
      warning: null,
      formulaUsed: "Epley: 1RM = weight × (1 + reps ÷ 30)",
      brzycki: roundToHalf(brzycki1RM).toFixed(1),
    };
  }, [inputs]);

  const onCalculate = () => {
    setCalculated(true);
  };

  const onReset = () => {
    setInputs({ weight: "", reps: "" });
    setCalculated(false);
  };

  const faqs = [
    {
      question: "What is a One-Rep Max (1RM) and why is it important?",
      answer:
        "One-Rep Max (1RM) is the maximum amount of weight an individual can lift for one complete repetition of a given exercise. It is a fundamental measure of maximal strength and is widely used by athletes, coaches, and fitness enthusiasts to assess strength levels, track progress, and design effective training programs. Knowing your 1RM helps tailor training loads to optimize strength gains while minimizing injury risk."
    },
    {
      question: "Why do we use formulas to estimate 1RM instead of testing it directly?",
      answer:
        "Directly testing your 1RM can be risky, especially for beginners or those without proper supervision, as it involves lifting maximal loads that can cause injury if performed incorrectly. Estimation formulas like Epley or Brzycki provide a safer alternative by calculating your 1RM based on submaximal lifts (multiple repetitions at lighter weights). These formulas offer reliable approximations without the need for maximal effort testing."
    },
    {
      question: "How accurate are 1RM estimation formulas?",
      answer:
        "1RM estimation formulas provide reasonably accurate results for most individuals, especially when the number of repetitions performed is between 1 and 10. Accuracy can vary depending on the formula used, exercise type, and individual differences such as muscle fiber composition and lifting technique. For best results, use these formulas as guidelines rather than absolute values, and consider multiple tests over time to track progress."
    },
    {
      question: "Can I use this calculator for any exercise?",
      answer:
        "While this calculator is designed primarily for compound lifts like bench press, squat, and deadlift, it can be used for other resistance exercises as well. However, estimation accuracy may decrease for isolation exercises or those involving smaller muscle groups. Always consider the context of the exercise and your own experience when interpreting results."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="weight" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
          <Dumbbell className="w-5 h-5 text-blue-600" /> Weight Lifted
        </Label>
        <Input
          id="weight"
          type="text"
          placeholder="Enter weight lifted (kg or lbs)"
          value={inputs.weight}
          onChange={e => handleInputChange("weight", e.target.value)}
          aria-describedby="weight-desc"
          className="max-w-xs"
        />
        <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          The amount of weight you lifted for the set.
        </p>
      </div>

      <div>
        <Label htmlFor="reps" className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
          <Activity className="w-5 h-5 text-blue-600" /> Number of Repetitions
        </Label>
        <Input
          id="reps"
          type="text"
          placeholder="Enter number of reps performed"
          value={inputs.reps}
          onChange={e => handleInputChange("reps", e.target.value)}
          aria-describedby="reps-desc"
          className="max-w-xs"
        />
        <p id="reps-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          The number of repetitions completed at the given weight (1-10 recommended).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4 max-w-xs">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={onCalculate}
          disabled={!inputs.weight || !inputs.reps}
          aria-label="Calculate One-Rep Max"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button variant="outline" onClick={onReset} className="flex-1 h-11" aria-label="Reset inputs">
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {calculated && results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg max-w-xs mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm italic text-slate-700 dark:text-slate-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}

      {calculated && !results.value && (
        <Card className="bg-red-50 border-red-300 shadow-sm max-w-xs mx-auto">
          <CardContent className="p-6 text-center text-red-700 dark:text-red-400">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" />
            <p>Please enter valid weight and repetitions (1 to 10 reps recommended) to calculate 1RM.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12 max-w-3xl mx-auto">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding One-Rep Max (1RM) Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The One-Rep Max (1RM) represents the maximum amount of weight an individual can lift for a single repetition of a specific exercise. It is a critical metric in strength training, providing insight into an athlete's maximal strength capacity. Measuring 1RM directly can be challenging and sometimes unsafe, especially for beginners or those without proper supervision.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To address this, estimation formulas have been developed that allow you to calculate your 1RM based on submaximal lifts — that is, the weight you can lift for multiple repetitions. These formulas use the weight lifted and the number of repetitions performed to estimate your maximal strength without requiring maximal effort lifts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses the widely accepted Epley formula, which balances accuracy and simplicity, and also provides the Brzycki formula estimate for comparison. Both formulas are validated by research and commonly used by coaches and athletes worldwide.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding your 1RM helps in designing effective training programs, setting realistic goals, and monitoring progress over time. It also aids in determining appropriate training loads for different phases of your workout cycle.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this One-Rep Max calculator is straightforward and requires just two inputs: the weight you lifted and the number of repetitions you performed at that weight. Follow these steps to get an accurate estimate of your 1RM:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Step 1:</strong> Enter the exact weight you lifted during your set. This can be in kilograms or pounds, depending on your preference.</li>
          <li><strong>Step 2:</strong> Enter the number of repetitions you completed at that weight. For best accuracy, keep this number between 1 and 10.</li>
          <li><strong>Step 3:</strong> Click the <em>Calculate</em> button to see your estimated One-Rep Max based on the Epley formula, along with a secondary estimate using the Brzycki formula.</li>
          <li><strong>Step 4:</strong> Review the results and use them to inform your training loads and goals.</li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          If you want to clear your inputs and start over, simply click the <em>Reset</em> button. Remember, these formulas provide estimates and should be used as guidelines rather than absolute values.
        </p>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize the effectiveness of your strength training and safely improve your One-Rep Max, consider the following tips and strategies:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li><strong>Warm-Up Properly:</strong> Always perform a thorough warm-up before attempting heavy lifts to prepare your muscles and joints, reducing injury risk.</li>
          <li><strong>Use Progressive Overload:</strong> Gradually increase the weight or volume of your training over time to stimulate strength gains without overtraining.</li>
          <li><strong>Focus on Technique:</strong> Proper form is essential for maximizing strength and minimizing injury. Consider working with a coach or using video feedback.</li>
          <li><strong>Incorporate Rest and Recovery:</strong> Allow adequate recovery between heavy sessions to enable muscle repair and growth.</li>
          <li><strong>Track Your Progress:</strong> Regularly use this calculator to monitor changes in your estimated 1RM and adjust your training accordingly.</li>
          <li><strong>Listen to Your Body:</strong> Avoid pushing through pain or extreme fatigue; prioritize long-term health and consistency.</li>
        </ul>
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
          For more information, consult these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a href="https://journals.lww.com/nsca-jscr/Fulltext/1995/02000/Prediction_of_One_Repetition_Maximum_From_Two_to.9.aspx" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Epley, B. (1995). Prediction of One Repetition Maximum From Two to Ten Repetitions. <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              This seminal paper introduces the Epley formula, a widely used method for estimating 1RM based on submaximal lifts.
            </p>
          </li>
          <li>
            <a href="https://journals.lww.com/nsca-jscr/Fulltext/1999/02000/Prediction_of_One_Repetition_Maximum_Using_the.12.aspx" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Brzycki, M. (1993). Strength Testing — Predicting a One-Rep Max from Reps-to-Fatigue. <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              This article details the Brzycki formula, another popular and validated approach to estimating 1RM.
            </p>
          </li>
          <li>
            <a href="https://www.verywellfit.com/how-to-calculate-your-one-rep-max-3498373" target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
              Verywell Fit: How to Calculate Your One-Rep Max <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical guide explaining 1RM concepts, formulas, and safety considerations for lifters of all levels.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="One-Rep Max (1RM) Calculator"
      description="Calculate your One-Rep Max (1RM) to safely estimate your maximum lifting potential for bench press, squat, deadlift, and more."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Primary Formula (Epley)",
        formula: "1RM = weight × (1 + reps ÷ 30)",
        variables: [
          { symbol: "1RM", description: "Estimated one-repetition maximum" },
          { symbol: "weight", description: "Weight lifted for multiple reps" },
          { symbol: "reps", description: "Number of repetitions performed" }
        ]
      }}
      example={{
        title: "Real Life Example",
        scenario: "You lifted 80 kg for 5 repetitions on the bench press and want to estimate your 1RM.",
        steps: [
          { label: "Step 1", explanation: "Enter 80 as the weight lifted." },
          { label: "Step 2", explanation: "Enter 5 as the number of repetitions performed." },
          { label: "Step 3", explanation: "Click Calculate to get your estimated 1RM." }
        ],
        result: "Estimated 1RM (Epley) = 80 × (1 + 5 ÷ 30) = 93.3 kg"
      }}
      relatedCalculators={[
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Cycling Cadence Calculator", url: "/sports/cycling-cadence", icon: "🏆" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" }
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Training Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}