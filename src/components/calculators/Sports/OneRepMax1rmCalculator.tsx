import { useState, useMemo, useCallback } from "react";
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

const formulas = {
  epley: {
    label: "Epley Formula",
    formula: "1RM = Weight × (1 + Reps / 30)",
    calc: (weight: number, reps: number) => weight * (1 + reps / 30),
  },
  brzycki: {
    label: "Brzycki Formula",
    formula: "1RM = Weight × (36 / (37 - Reps))",
    calc: (weight: number, reps: number) => weight * (36 / (37 - reps)),
  },
  lombardi: {
    label: "Lombardi Formula",
    formula: "1RM = Weight × Reps^0.10",
    calc: (weight: number, reps: number) => weight * Math.pow(reps, 0.10),
  },
  oconner: {
    label: "O'Conner et al. Formula",
    formula: "1RM = Weight × (1 + 0.025 × Reps)",
    calc: (weight: number, reps: number) => weight * (1 + 0.025 * reps),
  },
  wathan: {
    label: "Wathan Formula",
    formula:
      "1RM = (100 × Weight) / (48.8 + 53.8 × e^(-0.075 × Reps))",
    calc: (weight: number, reps: number) =>
      (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps)),
  },
};

export default function OneRepMax1rmCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    reps: "",
    formula: "epley",
  });
  const [calculated, setCalculated] = useState(false);

  const handleInputChange = useCallback(
    (name: string, value: string) => {
      setInputs((prev) => ({ ...prev, [name]: value }));
      setCalculated(false);
    },
    [setInputs]
  );

  const weightNum = useMemo(() => {
    const w = parseFloat(inputs.weight);
    return isNaN(w) || w <= 0 ? null : w;
  }, [inputs.weight]);

  const repsNum = useMemo(() => {
    const r = parseInt(inputs.reps);
    return isNaN(r) || r <= 0 ? null : r;
  }, [inputs.reps]);

  const selectedFormula = useMemo(() => {
    return formulas[inputs.formula as keyof typeof formulas] || formulas.epley;
  }, [inputs.formula]);

  const results = useMemo(() => {
    if (!weightNum || !repsNum) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: null,
        formulaUsed: selectedFormula.formula,
      };
    }
    if (repsNum > 12) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning:
          "Repetitions &gt; 12 reduce 1RM estimate accuracy. Use caution interpreting results.",
        formulaUsed: selectedFormula.formula,
      };
    }
    if (repsNum === 1) {
      return {
        value: weightNum.toFixed(2),
        label: "Direct 1RM Measurement",
        subtext:
          "You entered 1 repetition, so the weight is your actual 1RM.",
        warning: null,
        formulaUsed: "Direct measurement",
      };
    }
    const oneRm = selectedFormula.calc(weightNum, repsNum);
    return {
      value: oneRm.toFixed(2),
      label: "Estimated One-Rep Max (1RM)",
      subtext:
        "This estimate is based on the selected formula and your input values.",
      warning: null,
      formulaUsed: selectedFormula.formula,
    };
  }, [weightNum, repsNum, selectedFormula]);

  const handleCalculate = useCallback(() => {
    setCalculated(true);
  }, []);

  const handleReset = useCallback(() => {
    setInputs({ weight: "", reps: "", formula: "epley" });
    setCalculated(false);
  }, []);

  const faqs = [
    {
      question: "What is One-Rep Max (1RM) and why is it important?",
      answer:
        "One-Rep Max (1RM) represents the maximum amount of weight an individual can lift for a single repetition with proper form. It is a fundamental metric in strength training, allowing athletes and coaches to assess maximal strength, set training loads, and track progress over time. Accurate 1RM estimation helps optimize training intensity and reduce injury risk by avoiding excessive loads.",
    },
    {
      question: "Why are there multiple formulas to estimate 1RM?",
      answer:
        "Different formulas exist because 1RM estimation depends on various factors including exercise type, individual physiology, and repetition ranges. Some formulas perform better for lower repetitions, while others accommodate higher reps. Using multiple formulas provides flexibility and allows users to select the method best suited to their training context and accuracy needs.",
    },
    {
      question: "Can I use this calculator for all exercises?",
      answer:
        "While this calculator provides valid 1RM estimates for many compound lifts like bench press, squat, and deadlift, accuracy may vary for isolation exercises or very high repetition sets. It is recommended to use this tool primarily for major lifts and within the repetition range of 1 to 12 for best results.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="weight" className="mb-1 inline-block">
                Weight Lifted (kg or lbs)
              </Label>
              <Input
                id="weight"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 100"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                aria-describedby="weight-desc"
              />
              <p
                id="weight-desc"
                className="text-xs text-slate-500 mt-1"
                aria-live="polite"
              >
                Enter the weight you lifted for the given repetitions.
              </p>
            </div>

            <div>
              <Label htmlFor="reps" className="mb-1 inline-block">
                Number of Repetitions
              </Label>
              <Input
                id="reps"
                type="number"
                min="1"
                max="12"
                step="1"
                placeholder="e.g. 5"
                value={inputs.reps}
                onChange={(e) => handleInputChange("reps", e.target.value)}
                aria-describedby="reps-desc"
              />
              <p
                id="reps-desc"
                className="text-xs text-slate-500 mt-1"
                aria-live="polite"
              >
                Enter the number of repetitions performed at the weight.
                Values &gt; 12 may reduce accuracy.
              </p>
            </div>

            <div>
              <Label htmlFor="formula" className="mb-1 inline-block">
                Select Estimation Formula
              </Label>
              <Select
                onValueChange={(v) => handleInputChange("formula", v)}
                value={inputs.formula}
                aria-describedby="formula-desc"
              >
                <SelectTrigger id="formula" className="w-full">
                  <SelectValue placeholder="Select formula" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(formulas).map(([key, f]) => (
                    <SelectItem key={key} value={key}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p
                id="formula-desc"
                className="text-xs text-slate-500 mt-1"
                aria-live="polite"
              >
                Different formulas estimate 1RM based on research and training
                data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={handleCalculate}
          disabled={!weightNum || !repsNum}
          aria-disabled={!weightNum || !repsNum}
          aria-label="Calculate One-Rep Max"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {calculated && results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            {results.subtext && (
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                {results.subtext}
              </p>
            )}
            <p className="mt-3 text-xs italic text-slate-600 dark:text-slate-400">
              Formula used: {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}

      {calculated && results.warning && (
        <Card className="border border-yellow-400 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-600 p-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <p className="text-yellow-800 dark:text-yellow-300 text-sm">
            {results.warning}
          </p>
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
          The One-Rep Max (1RM) is a critical measure in strength training that
          quantifies the maximum weight an individual can lift for a single
          repetition with proper technique. This metric serves as a benchmark
          for assessing maximal strength, guiding training intensity, and
          tracking progress over time. Since performing an actual 1RM test can
          be risky or impractical for many, especially beginners or those with
          injuries, estimation formulas provide a safer alternative by
          predicting 1RM based on submaximal lifts and repetitions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator incorporates several scientifically validated formulas
          to estimate your 1RM based on the weight lifted and the number of
          repetitions performed. Each formula has been developed through
          research and reflects different assumptions about fatigue and muscle
          performance. Selecting the appropriate formula and understanding its
          context can help you optimize your training safely and effectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, while these formulas provide useful estimates, individual
          variability means actual 1RM may differ. Always prioritize safety and
          proper technique when testing or training near maximal loads.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your One-Rep Max using this tool, you need to
          input the weight you lifted and the number of repetitions you
          performed at that weight. Then, select the formula you want to use for
          the estimation. Each formula is based on different scientific models,
          so you may want to try multiple to compare results. After entering
          your data, click "Calculate" to see your estimated 1RM.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the weight you lifted (in kilograms
            or pounds).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the number of repetitions performed
            at that weight (ideally between 1 and 12).
          </li>
          <li>
            <strong>Step 3:</strong> Choose the estimation formula from the
            dropdown menu. The default is the widely used Epley formula.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to view your
            estimated 1RM.
          </li>
          <li>
            <strong>Step 5:</strong> Review the result and note the formula
            used. Use this information to guide your training loads safely.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips &amp; Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When using 1RM estimates to plan your training, it is essential to
          consider individual factors such as fatigue, recovery, and exercise
          technique. Avoid attempting maximal lifts without proper warm-up and
          supervision, especially if you are new to strength training. Use the
          1RM estimate to set training intensities, typically working at
          percentages of your 1RM to target different training goals such as
          hypertrophy, strength, or endurance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, regularly reassess your 1RM estimates as your strength
          improves or training conditions change. This practice ensures your
          training loads remain appropriate and effective. Remember that
          consistency, proper nutrition, and recovery are equally important for
          strength gains.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, consider combining multiple formulas or consulting with a
          qualified coach or sports scientist to tailor your training program
          to your specific needs and goals.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References &amp; Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, strength assessment, and
          exercise physiology, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research,
              providing evidence-based guidelines for strength training and
              testing.
            </p>
          </li>
          <li>
            <a
              href="https://www.nsca.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Strength and Conditioning Association (NSCA){" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Leading organization dedicated to advancing strength and
              conditioning through research, education, and certification.
            </p>
          </li>
          <li>
            <a
              href="https://www.fifa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Fédération Internationale de Football Association (FIFA){" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides comprehensive guidelines on athlete performance testing
              and conditioning in football (soccer).
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="One-Rep Max (1RM) Calculator"
      description="Calculate your One-Rep Max (1RM) safely and accurately. Estimate your maximum lifting potential for bench press, squat, deadlift, and other strength exercises using validated formulas."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Common 1RM Estimation Formulas",
        formula:
          "1RM = Weight × (1 + Reps / 30) (Epley), 1RM = Weight × (36 / (37 - Reps)) (Brzycki), etc.",
        variables: [
          { symbol: "Weight", description: "Weight lifted for repetitions" },
          { symbol: "Reps", description: "Number of repetitions performed" },
          {
            symbol: "1RM",
            description:
              "Estimated one-repetition maximum weight for the exercise",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An athlete lifts 80 kg for 5 repetitions on the bench press and wants to estimate their 1RM.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 80 as the weight lifted and 5 as the number of repetitions.",
          },
          {
            label: "Step 2",
            explanation:
              "Select the Epley formula from the dropdown menu for estimation.",
          },
          {
            label: "Step 3",
            explanation:
              "Click 'Calculate' to see the estimated 1RM based on the inputs.",
          },
        ],
        result:
          "The calculator estimates the 1RM as 93.33 kg using the Epley formula.",
      }}
      relatedCalculators={[
        { title: "Golf Expected Putts per Round", url: "/sports/golf-expected-putts-per-round", icon: "⛳" },
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "⚽" },
        { title: "Win Probability Shift (WPS) Estimator", url: "/sports/win-probability-shift-wps", icon: "🏆" },
        { title: "Training Weight Percentage Calculator", url: "/sports/training-weight-percentage", icon: "🏆" },
        { title: "Bowling Score Calculator", url: "/sports/bowling-score-calculator", icon: "🏆" },
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