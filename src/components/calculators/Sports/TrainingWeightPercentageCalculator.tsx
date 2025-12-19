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
  // Inputs: 1RM (one-rep max), desired percentage or target weight, unit (kg/lbs)
  const [inputs, setInputs] = useState({
    oneRepMax: "",
    percentage: "",
    unit: "kg",
  });

  const handleInputChange = useCallback((name, value) => {
    // Sanitize numeric inputs to allow only numbers and decimals
    if (name === "oneRepMax" || name === "percentage") {
      // Allow empty string or valid number
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  // Calculation logic:
  // Training Weight = 1RM * (Percentage / 100)
  // Validate inputs and provide warnings if needed
  const results = useMemo(() => {
    const oneRepMaxNum = parseFloat(inputs.oneRepMax);
    const percentageNum = parseFloat(inputs.percentage);

    if (
      isNaN(oneRepMaxNum) ||
      oneRepMaxNum <= 0 ||
      isNaN(percentageNum) ||
      percentageNum <= 0 ||
      percentageNum > 100
    ) {
      return {
        value: "",
        label: "",
        subtext: null,
        warning:
          "Please enter a valid 1RM greater than 0 and a percentage between 0 and 100.",
        formulaUsed: "Training Weight = 1RM × (Percentage ÷ 100)",
      };
    }

    const trainingWeight = oneRepMaxNum * (percentageNum / 100);

    // Round to 2 decimals for display
    const roundedWeight = Math.round(trainingWeight * 100) / 100;

    return {
      value: `${roundedWeight} ${inputs.unit}`,
      label: "Calculated Training Weight",
      subtext: `This weight corresponds to ${percentageNum}% of your 1RM (${oneRepMaxNum} ${inputs.unit}).`,
      warning: null,
      formulaUsed: "Training Weight = 1RM × (Percentage ÷ 100)",
    };
  }, [inputs]);

  // FAQs with detailed answers
  const faqs = [
    {
      question: "What is Training Weight Percentage and why is it important?",
      answer:
        "Training Weight Percentage refers to the proportion of your one-repetition maximum (1RM) used during a workout. It is crucial for structuring training programs because different percentages target various physiological adaptations such as hypertrophy, strength, or power. Using the correct percentage ensures optimal stimulus for your goals while minimizing injury risk.",
    },
    {
      question: "How do I accurately determine my 1RM?",
      answer:
        "Your 1RM is the maximum weight you can lift for one complete repetition with proper form. It can be measured directly by attempting maximal lifts under supervision or estimated using submaximal lifts and prediction formulas. Accurate 1RM assessment is essential for calculating training weights and programming effectively.",
    },
    {
      question: "Can I use this calculator for different units like pounds or kilograms?",
      answer:
        "Yes, this calculator supports both kilograms and pounds. Simply select your preferred unit, and ensure your 1RM and percentage inputs correspond to that unit. Consistency in units is vital for accurate calculations and safe training.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI with inputs and buttons
  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="oneRepMax" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              One-Rep Max (1RM)
            </Label>
            <Input
              id="oneRepMax"
              type="text"
              placeholder="Enter your 1RM"
              value={inputs.oneRepMax}
              onChange={(e) => handleInputChange("oneRepMax", e.target.value)}
              aria-describedby="oneRepMaxHelp"
            />
            <p id="oneRepMaxHelp" className="text-sm text-slate-500 mt-1">
              Your maximum weight lifted for one repetition.
            </p>
          </div>

          <div>
            <Label htmlFor="percentage" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Training Weight Percentage (%)
            </Label>
            <Input
              id="percentage"
              type="text"
              placeholder="Enter desired percentage"
              value={inputs.percentage}
              onChange={(e) => handleInputChange("percentage", e.target.value)}
              aria-describedby="percentageHelp"
            />
            <p id="percentageHelp" className="text-sm text-slate-500 mt-1">
              Percentage of your 1RM to calculate training weight.
            </p>
          </div>

          <div>
            <Label htmlFor="unit" className="mb-1 font-semibold text-slate-700 dark:text-slate-300">
              Unit
            </Label>
            <Select
              value={inputs.unit}
              onValueChange={(v) => handleInputChange("unit", v)}
              id="unit"
              aria-label="Select unit"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit action needed, calculation is reactive
          }}
          aria-label="Calculate training weight"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ oneRepMax: "", percentage: "", unit: "kg" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.warning && (
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-red-950 border-red-200 shadow-lg">
          <CardContent className="p-6 text-center text-red-800 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 h-6 w-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Editorial content with rich explanations and guides
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Training Weight Percentage Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Training Weight Percentage Calculator is a vital tool for athletes, coaches, and fitness enthusiasts aiming to optimize their strength training programs. By calculating the exact weight corresponding to a specific percentage of your one-repetition maximum (1RM), you can tailor your workouts to target specific adaptations such as hypertrophy, maximal strength, or power development. This precision ensures that training loads are neither too light to be ineffective nor too heavy to risk injury. Understanding and applying training percentages is foundational in periodization and progressive overload strategies.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator uses the simple yet powerful formula: Training Weight = 1RM × (Percentage ÷ 100). This formula allows you to translate your maximal strength into actionable training loads, facilitating structured and goal-oriented programming. Whether you are preparing for a competition or aiming to improve general fitness, knowing your training weights at various percentages is indispensable.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed for accuracy and ease. Begin by entering your one-repetition maximum (1RM) for the lift you want to train. This value represents the heaviest weight you can lift for one complete repetition with proper form. Next, input the desired training percentage, which reflects the intensity of your workout relative to your 1RM. Finally, select your preferred unit of measurement, either kilograms or pounds, to ensure consistency.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your 1RM value accurately. If unsure, consider performing a 1RM test or estimating it using submaximal lifts.
          </li>
          <li>
            <strong>Step 2:</strong> Input the training percentage based on your program’s prescription (e.g., 70% for hypertrophy, 85% for strength).
          </li>
          <li>
            <strong>Step 3:</strong> Choose the unit of measurement (kg or lbs) matching your 1RM input.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the exact training weight you should use for your workout.
          </li>
          <li>
            <strong>Step 5:</strong> Use the calculated weight to guide your training session, adjusting as needed for fatigue or progression.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize the benefits of your training, it is essential to understand how different percentages of your 1RM affect physiological adaptations. For hypertrophy (muscle growth), training typically occurs between 65% and 80% of 1RM with moderate repetitions. Strength development often requires higher intensities, around 85% to 95% of 1RM, with lower repetitions and longer rest periods. Power training involves explosive movements at moderate to high intensities (30% to 70% of 1RM) focusing on speed and technique.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, regularly reassessing your 1RM ensures your training percentages remain accurate as you progress. Incorporate deload weeks and listen to your body to avoid overtraining. Using this calculator as part of a comprehensive training plan can help you stay on track, monitor progress, and achieve your performance goals safely and effectively.
        </p>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science and rules, consult the following sources:
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
              Global leader in sports medicine and exercise science research.
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
              Authoritative source on strength training and conditioning best practices.
            </p>
          </li>
          <li>
            <a
              href="https://www.fifa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Fédération Internationale de Football Association (FIFA) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides guidelines on athlete conditioning and performance standards.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Formula and example for the calculator
  const formula = {
    title: "Formula",
    formula: "Training Weight = 1RM × (Percentage ÷ 100)",
    variables: [
      { symbol: "1RM", description: "One-Repetition Maximum (maximum weight lifted once)" },
      { symbol: "Percentage", description: "Desired training intensity as a percentage of 1RM" },
      { symbol: "Training Weight", description: "Calculated weight to use for training" },
    ],
  };

  const example = {
    title: "Real Life Example",
    scenario:
      "An athlete has a 1RM bench press of 100 kg and wants to train at 75% intensity for hypertrophy.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Input the 1RM value as 100 kg into the calculator’s 1RM field.",
      },
      {
        label: "Step 2",
        explanation:
          "Enter 75 as the training percentage to represent 75% intensity.",
      },
      {
        label: "Step 3",
        explanation:
          "Select kilograms (kg) as the unit of measurement.",
      },
      {
        label: "Step 4",
        explanation:
          "Click Calculate to find the training weight.",
      },
    ],
    result:
      "The calculator outputs 75 kg, indicating the athlete should use 75 kg for their training sets at 75% intensity.",
  };

  return (
    <CalculatorVerticalLayout
      title="Training Weight Percentage Calculator"
      description="Calculate training weights. Determine specific percentages of your 1RM to plan hypertrophy, strength, or power workouts."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Yoga Calories Burned Calculator", url: "/sports/yoga-calories-burned", icon: "🔥" },
        { title: "Baseball OPS / SLG / OBP Calculator", url: "/sports/baseball-ops-slg-obp", icon: "⚽" },
        { title: "Bowling Score Calculator", url: "/sports/bowling-score-calculator", icon: "🏆" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "⚽" },
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