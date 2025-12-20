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

export default function TrainingWeightPercentageCalculator() {
  const [inputs, setInputs] = useState({
    oneRM: "",
    percentage: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  // Calculation logic:
  // Training Weight = (Percentage / 100) * 1RM
  // Validate inputs: 1RM > 0, percentage between 1 and 100

  const results = useMemo(() => {
    const oneRM = parseFloat(inputs.oneRM);
    const percentage = parseFloat(inputs.percentage);

    if (!oneRM || oneRM <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid 1RM greater than 0.",
        warning: "invalid-1rm",
        formulaUsed: "Training Weight = (Percentage / 100) × 1RM",
      };
    }
    if (!percentage || percentage <= 0 || percentage > 100) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid percentage between 1 and 100.",
        warning: "invalid-percentage",
        formulaUsed: "Training Weight = (Percentage / 100) × 1RM",
      };
    }
    const trainingWeight = (percentage / 100) * oneRM;
    return {
      value: trainingWeight.toFixed(2) + " units",
      label: `Training Weight @ ${percentage.toFixed(1)}% of 1RM`,
      subtext: `Calculated using 1RM of ${oneRM.toFixed(2)} units.`,
      warning: null,
      formulaUsed: "Training Weight = (Percentage / 100) × 1RM",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Training Weight Percentage Calculator used for?",
      answer:
        "The Training Weight Percentage Calculator helps athletes and coaches determine the exact weight to lift based on a percentage of the individual’s one-repetition maximum (1RM). This is essential for programming training loads tailored to specific goals such as hypertrophy, strength, or power development. By inputting your 1RM and desired percentage, you get the precise training weight to use.",
    },
    {
      question: "How do I accurately find my 1RM for this calculator?",
      answer:
        "Your 1RM, or one-repetition maximum, is the maximum weight you can lift for a single repetition with proper form. To find it, perform a gradual warm-up and increase weights until you reach the heaviest load you can lift once without assistance. Alternatively, submaximal testing formulas can estimate 1RM safely. Always prioritize safety and consider professional supervision when testing maximal lifts.",
    },
    {
      question: "Why should I train using percentages of my 1RM?",
      answer:
        "Training with percentages of your 1RM allows for precise load management, ensuring that the intensity matches your training goals. For example, hypertrophy is often targeted at 65-75% of 1RM, strength at 80-90%, and power at 30-60%. This method helps optimize adaptations, reduce injury risk, and track progress systematically over time.",
    },
    {
      question: "Can this calculator be used for all types of lifts and exercises?",
      answer:
        "Yes, the Training Weight Percentage Calculator can be applied to any resistance exercise where a 1RM can be established, such as squats, deadlifts, bench presses, or Olympic lifts. However, keep in mind that some lifts have different technical demands and fatigue rates, so adjust your training percentages and volume accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="oneRM" className="flex items-center gap-1">
                <Dumbbell className="w-4 h-4 text-blue-600" />
                1RM (One-Repetition Maximum)
              </Label>
              <Input
                id="oneRM"
                type="number"
                min="0"
                step="any"
                placeholder="Enter your 1RM weight"
                value={inputs.oneRM}
                onChange={(e) => handleInputChange("oneRM", e.target.value)}
                aria-describedby="oneRMHelp"
              />
              <p id="oneRMHelp" className="text-xs text-slate-500 mt-1">
                The maximum weight you can lift for one repetition.
              </p>
            </div>

            <div>
              <Label htmlFor="percentage" className="flex items-center gap-1">
                <Gauge className="w-4 h-4 text-blue-600" />
                Training Weight Percentage (%)
              </Label>
              <Input
                id="percentage"
                type="number"
                min="1"
                max="100"
                step="any"
                placeholder="Enter desired training percentage"
                value={inputs.percentage}
                onChange={(e) => handleInputChange("percentage", e.target.value)}
                aria-describedby="percentageHelp"
              />
              <p id="percentageHelp" className="text-xs text-slate-500 mt-1">
                The percentage of your 1RM you want to train at (1-100).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate training weight"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ oneRM: "", percentage: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{results.subtext}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 italic">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700 shadow-md">
          <CardContent className="p-6 text-center text-red-700 dark:text-red-300">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
            <p>{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Training Weight Percentage Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Training Weight Percentage Calculator is an essential tool for athletes, coaches, and fitness enthusiasts who want to optimize their resistance training programs. It calculates the exact training load based on a percentage of your one-repetition maximum (1RM), which is the heaviest weight you can lift for a single repetition with proper form. This approach allows for precise control over training intensity, which is crucial for targeting specific adaptations such as muscle hypertrophy, maximal strength, or explosive power.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using percentages of your 1RM helps standardize training loads across different exercises and individuals, making programming more systematic and scalable. For example, training at 70% of your 1RM typically targets muscular endurance and hypertrophy, while 85-95% focuses on maximal strength development. This calculator simplifies the process by providing the exact weight to use, eliminating guesswork and reducing the risk of overtraining or injury.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Additionally, this calculator supports periodization strategies by allowing you to adjust training intensities over time, ensuring progressive overload and recovery balance. Whether you are a beginner or an elite athlete, understanding and applying training percentages is fundamental to effective strength training.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By integrating this calculator into your training routine, you can better monitor progress, tailor workouts to your goals, and maintain consistency in your lifting regimen.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Training Weight Percentage Calculator, you first need to know your one-repetition maximum (1RM) for the exercise you want to train. This is the maximum weight you can lift once with proper technique. If you do not know your 1RM, consider performing a 1RM test or using submaximal estimation formulas to approximate it safely.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Once you have your 1RM, enter it into the calculator in the designated input field. Next, input the percentage of your 1RM you want to train at. This percentage should reflect your training goal, such as 70% for hypertrophy or 85% for strength. The calculator will then compute the exact training weight corresponding to that percentage.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering the values, click the "Calculate" button to see your training weight. You can adjust the percentage to explore different training intensities or reset the inputs to start over. Use this calculated weight to guide your workout loads, ensuring you train at the appropriate intensity for your goals.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure or estimate your 1RM for the specific lift.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your 1RM value into the calculator.
          </li>
          <li>
            <strong>Step 3:</strong> Input the desired training percentage (1-100%).
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to get your training weight.
          </li>
          <li>
            <strong>Step 5:</strong> Use the calculated weight in your training session.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When using the Training Weight Percentage Calculator, it is important to align your percentages with your training goals. For hypertrophy (muscle growth), aim for 65-75% of your 1RM with moderate repetitions (8-12 reps). For maximal strength, use heavier loads around 85-95% of your 1RM with lower repetitions (1-5 reps). For power development, lighter loads between 30-60% of 1RM with explosive movements are recommended.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Always warm up properly before lifting heavy weights to reduce injury risk. Use progressive overload by gradually increasing your training percentages or volume over weeks to stimulate continuous adaptation. Monitor your fatigue and recovery closely, adjusting training loads as needed to avoid overtraining.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consider periodizing your training by cycling through phases of different intensities and volumes. For example, a mesocycle might focus on hypertrophy at 70% 1RM for 4 weeks, followed by a strength phase at 85% 1RM. This approach helps prevent plateaus and promotes balanced development.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Lastly, always listen to your body and adjust percentages if you experience excessive fatigue or discomfort. The calculator is a guide, but individual responses vary.
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
              href="https://www.nsca.com/contentassets/0a7c6d7a1b7a4a1a8c1e1a6a7d7f8b2a/nsca-strength-training-programming.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              NSCA Strength Training Programming <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive guidelines from the National Strength and Conditioning Association on programming training loads using percentages of 1RM.
            </p>
          </li>
          <li>
            <a
              href="https://www.verywellfit.com/how-to-calculate-your-one-rep-max-3498373"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Verywell Fit: How to Calculate Your One-Rep Max <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical guide to safely estimating and testing your 1RM for effective strength training.
            </p>
          </li>
          <li>
            <a
              href="https://journals.lww.com/nsca-jscr/Fulltext/2014/02000/Periodization_Structuring_Training_Programs_for.27.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Journal of Strength and Conditioning Research: Periodization <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Scientific article discussing periodization strategies and the role of training intensities in strength development.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Training Weight Percentage Calculator"
      description="Calculate training weights. Determine specific percentages of your 1RM to plan hypertrophy, strength, or power workouts."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Training Weight = (Percentage / 100) × 1RM",
        variables: [
          { symbol: "Training Weight", description: "The weight to be used in training" },
          { symbol: "Percentage", description: "Desired training intensity as a percentage of 1RM" },
          { symbol: "1RM", description: "One-repetition maximum weight" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "An athlete has a 1RM of 100 kg in the bench press and wants to train at 75% intensity for hypertrophy.",
        steps: [
          { label: "Step 1", explanation: "Enter 100 kg as your 1RM." },
          { label: "Step 2", explanation: "Input 75 as the training percentage." },
          { label: "Step 3", explanation: "Click Calculate to get the training weight." },
        ],
        result: "The calculator shows 75 kg as the training weight to use at 75% of 1RM.",
      }}
      relatedCalculators={[
        { title: "Negative Split Race Planner", url: "/sports/negative-split", icon: "🏆" },
        { title: "Swim Pace: CSS (Critical Swim Speed) & Splits", url: "/sports/swim-pace-css-splits", icon: "🏃" },
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "🏆" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Calorie Deficit / Surplus Calculator", url: "/sports/calorie-deficit-surplus", icon: "🔥" },
        { title: "FINA Points Calculator", url: "/sports/fina-points-calculator", icon: "🏆" },
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