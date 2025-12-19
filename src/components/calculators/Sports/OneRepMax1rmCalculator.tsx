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

const FORMULAS = {
  epley: {
    label: "Epley Formula",
    formula: "1RM = Weight × (1 + Reps / 30)",
    calc: (weight, reps) => weight * (1 + reps / 30),
    description:
      "The Epley formula is one of the most widely used and validated methods for estimating 1RM. It assumes a linear relationship between reps and percentage of 1RM, making it suitable for reps up to 10. This formula is simple and effective for most recreational lifters.",
  },
  brzycki: {
    label: "Brzycki Formula",
    formula: "1RM = Weight × (36 / (37 - Reps))",
    calc: (weight, reps) => weight * (36 / (37 - reps)),
    description:
      "The Brzycki formula is another popular method that provides a slightly different estimation, often considered more accurate for reps between 1 and 10. It is based on empirical data and is commonly used by strength coaches and athletes.",
  },
  lombardi: {
    label: "Lombardi Formula",
    formula: "1RM = Weight × Reps^0.10",
    calc: (weight, reps) => weight * Math.pow(reps, 0.10),
    description:
      "The Lombardi formula uses an exponential approach to estimate 1RM, accounting for the diminishing returns of repetitions at higher rep ranges. It tends to be more accurate for moderate rep ranges and is favored by some advanced lifters.",
  },
};

export default function OneRepMax1rmCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    reps: "",
    formula: "epley",
  });
  const [calculated, setCalculated] = useState(false);

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
    setCalculated(false);
  }, []);

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const reps = parseInt(inputs.reps);
    const formulaKey = inputs.formula;

    if (!weight || !reps || reps < 1 || reps > 10) {
      return {
        value: null,
        label: "Invalid input",
        subtext: "Please enter a valid weight and reps between 1 and 10.",
        warning: "Repetitions should be between 1 and 10 for accurate estimation.",
        formulaUsed: "",
      };
    }

    const formula = FORMULAS[formulaKey];
    if (!formula) {
      return {
        value: null,
        label: "Formula not found",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    const oneRm = formula.calc(weight, reps);
    return {
      value: `${oneRm.toFixed(2)} kg`,
      label: `Estimated 1RM using ${formula.label}`,
      subtext: `Based on ${weight} kg lifted for ${reps} reps.`,
      warning: null,
      formulaUsed: formula.formula,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is One-Rep Max (1RM)?",
      answer:
        "One-Rep Max (1RM) is the maximum amount of weight an individual can lift for one repetition of a given exercise. It is a standard measure of maximal strength and is used to tailor training programs and track progress.",
    },
    {
      question: "Why should I estimate 1RM instead of testing it directly?",
      answer:
        "Directly testing 1RM can be risky, especially for beginners or those with injuries, as it requires maximal effort and can lead to injury if performed improperly. Estimating 1RM using submaximal weights and reps is safer and still provides reliable data for programming.",
    },
    {
      question: "Which formula should I use for the most accurate 1RM estimate?",
      answer:
        "The Epley and Brzycki formulas are the most commonly used and validated for reps between 1 and 10. The choice depends on individual response and exercise type, but Epley is generally recommended for its simplicity and accuracy.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const handleCalculate = () => {
    setCalculated(true);
  };

  const handleReset = () => {
    setInputs({ weight: "", reps: "", formula: "epley" });
    setCalculated(false);
  };

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weight" className="flex items-center gap-1">
              <Dumbbell className="w-4 h-4 text-blue-600" /> Weight lifted (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min={1}
              step={0.1}
              placeholder="e.g. 100"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="reps" className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-blue-600" /> Number of repetitions (1-10)
            </Label>
            <Input
              id="reps"
              type="number"
              min={1}
              max={10}
              step={1}
              placeholder="e.g. 5"
              value={inputs.reps}
              onChange={(e) => handleInputChange("reps", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="formula" className="flex items-center gap-1">
              <Calculator className="w-4 h-4 text-blue-600" /> Select formula
            </Label>
            <Select
              value={inputs.formula}
              onValueChange={(v) => handleInputChange("formula", v)}
            >
              <SelectTrigger id="formula" className="w-full">
                <SelectValue placeholder="Choose formula" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FORMULAS).map(([key, f]) => (
                  <SelectItem key={key} value={key}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              onClick={handleCalculate}
              disabled={!inputs.weight || !inputs.reps}
            >
              <Trophy className="mr-2 h-4 w-4" /> Calculate
            </Button>
            <Button variant="outline" onClick={handleReset} className="flex-1 h-11">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {calculated && results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs italic text-slate-500 dark:text-slate-600">
              Formula used: <code>{results.formulaUsed}</code>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding One-Rep Max (1RM) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The One-Rep Max (1RM) represents the maximum load an individual can lift for a single repetition of a given exercise, such as the bench press, squat, or deadlift. It is a fundamental metric in strength training, providing a benchmark for maximal strength and serving as a basis for designing training programs tailored to individual capacity. Directly testing 1RM can be physically demanding and potentially risky, especially for novice lifters or those with pre-existing injuries. Therefore, estimating 1RM through validated formulas based on submaximal lifts and repetitions offers a safer and practical alternative.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator employs several scientifically validated formulas, including the Epley, Brzycki, and Lombardi equations, to provide an accurate estimate of your 1RM. Each formula has been derived from empirical research and is widely accepted in the strength and conditioning community. By inputting the weight you lifted and the number of repetitions performed, you can obtain a reliable estimate of your maximal strength without the need for maximal exertion.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding your 1RM is crucial for setting appropriate training intensities, tracking progress, and preventing overtraining. It also allows for periodized programming, where training loads are adjusted based on your current strength levels to optimize performance and reduce injury risk.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your One-Rep Max using this calculator, you need to enter the weight you successfully lifted and the number of repetitions you completed with that weight. It is important that the number of repetitions is between 1 and 10, as the formulas used are validated within this range for accuracy. You can also select from different formulas based on your preference or the guidance of your coach.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the weight you lifted in kilograms (kg). This should be the actual load you used during your set.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the number of repetitions you performed with that weight, ensuring it is between 1 and 10.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the formula you want to use for the estimation. The default is the Epley formula, which is widely accepted.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to see your estimated 1RM.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to guide your training loads and progression.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When using your estimated 1RM to plan training, it is essential to consider individual variability and fatigue levels. Always start training loads conservatively, especially if you are new to strength training or returning after a break. Use your 1RM estimate to calculate percentages for different training zones, such as hypertrophy (65-75% 1RM), strength (80-90% 1RM), and power (>90% 1RM).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Regularly re-assess your 1RM estimate every 4-6 weeks to adjust your training loads accordingly. This helps ensure progressive overload, a key principle for strength gains. Additionally, always prioritize proper technique and recovery to minimize injury risk. Remember that 1RM is just one metric and should be integrated with other performance indicators for a holistic training approach.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, consult with a qualified strength and conditioning professional if you are unsure about testing or interpreting your 1RM results. Personalized coaching can optimize your training outcomes and safety.
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
          For more information on training science, strength testing, and exercise physiology, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines for strength training and testing.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The NSCA offers comprehensive resources on strength assessment, programming, and coaching best practices widely used by professionals worldwide.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/training/a20803107/how-to-calculate-your-one-rep-max/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World: How to Calculate Your One-Rep Max <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical guide explaining different 1RM formulas and their application for athletes and fitness enthusiasts.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="One-Rep Max (1RM) Calculator"
      description="Calculate your One-Rep Max (1RM) safely and accurately. Estimate your maximum lifting potential for bench press, squat, deadlift, and more using validated formulas."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Common 1RM Formulas",
        formula:
          "Epley: 1RM = Weight × (1 + Reps / 30)\nBrzycki: 1RM = Weight × (36 / (37 - Reps))\nLombardi: 1RM = Weight × Reps^0.10",
        variables: [
          { symbol: "Weight", description: "Weight lifted (kg)" },
          { symbol: "Reps", description: "Number of repetitions performed" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An athlete lifts 80 kg for 5 repetitions on the bench press and wants to estimate their 1RM to plan their training loads.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input the weight lifted: 80 kg, and the number of repetitions: 5, into the calculator.",
          },
          {
            label: "Step 2",
            explanation:
              "Select the Epley formula (default) and click Calculate to get the estimated 1RM.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator outputs an estimated 1RM of 93.33 kg, which the athlete can use to set training intensities.",
          },
        ],
        result: "Estimated 1RM: 93.33 kg using the Epley formula.",
      }}
      relatedCalculators={[
        { title: "Tournament Bracket Seeding Helper", url: "/sports/tournament-bracket-seeding-helper", icon: "🏆" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏊" },
        { title: "Bowling Score Calculator", url: "/sports/bowling-score-calculator", icon: "🏆" },
        { title: "Baseball OPS / SLG / OBP Calculator", url: "/sports/baseball-ops-slg-obp", icon: "⚽" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
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