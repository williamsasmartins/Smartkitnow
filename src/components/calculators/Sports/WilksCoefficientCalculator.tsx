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

const WILKS_COEFFICIENTS = {
  male: {
    a: -216.0475144,
    b: 16.2606339,
    c: -0.002388645,
    d: -0.00113732,
    e: 7.01863e-06,
    f: -1.291e-08,
  },
  female: {
    a: 594.31747775582,
    b: -27.23842536447,
    c: 0.82112226871,
    d: -0.00930733913,
    e: 4.731582e-05,
    f: -9.054e-08,
  },
};

function calculateWilksCoefficient(gender, bodyweightKg) {
  const coeffs = WILKS_COEFFICIENTS[gender];
  if (!coeffs || bodyweightKg <= 0) return null;
  const { a, b, c, d, e, f } = coeffs;
  const bw = bodyweightKg;
  const denominator =
    a +
    b * bw +
    c * bw * bw +
    d * bw * bw * bw +
    e * bw * bw * bw * bw +
    f * bw * bw * bw * bw * bw;
  if (denominator === 0) return null;
  return 500 / denominator;
}

export default function WilksCoefficientCalculator() {
  const [inputs, setInputs] = useState({
    gender: "male",
    bodyweight: "",
    totalLifted: "",
  });
  const [calculated, setCalculated] = useState(null);
  const [warning, setWarning] = useState(null);

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
    setCalculated(null);
    setWarning(null);
  }, []);

  const calculate = useCallback(() => {
    const gender = inputs.gender;
    const bodyweight = parseFloat(inputs.bodyweight);
    const totalLifted = parseFloat(inputs.totalLifted);

    if (!gender || isNaN(bodyweight) || isNaN(totalLifted)) {
      setWarning("Please enter valid numeric values for all fields.");
      setCalculated(null);
      return;
    }
    if (bodyweight <= 0) {
      setWarning("Bodyweight must be greater than zero.");
      setCalculated(null);
      return;
    }
    if (totalLifted <= 0) {
      setWarning("Total lifted weight must be greater than zero.");
      setCalculated(null);
      return;
    }

    const wilksCoeff = calculateWilksCoefficient(gender, bodyweight);
    if (!wilksCoeff) {
      setWarning("Calculation error: invalid inputs or coefficients.");
      setCalculated(null);
      return;
    }
    const wilksScore = wilksCoeff * totalLifted;

    setCalculated({
      wilksCoeff: wilksCoeff.toFixed(4),
      wilksScore: wilksScore.toFixed(2),
    });
    setWarning(null);
  }, [inputs]);

  const faqs = [
    {
      question: "What is the Wilks Coefficient and why is it important?",
      answer:
        "The Wilks Coefficient is a formula used in powerlifting to compare the strength of lifters across different body weights. It normalizes the total weight lifted by accounting for bodyweight differences, allowing fair competition between lighter and heavier athletes. This coefficient is widely used in powerlifting federations to rank lifters and determine overall winners.",
    },
    {
      question: "How is the Wilks Coefficient calculated?",
      answer:
        "The Wilks Coefficient is calculated using a polynomial formula with gender-specific coefficients applied to the lifter's bodyweight. The formula outputs a coefficient which, when multiplied by the total weight lifted, gives the Wilks Score. This score reflects the lifter's relative strength regardless of their bodyweight. The coefficients differ for males and females to account for physiological differences.",
    },
    {
      question: "Can I use this calculator for non-powerlifting sports?",
      answer:
        "While the Wilks Coefficient is specifically designed for powerlifting, it can provide a rough estimate of relative strength for other strength sports. However, it may not be fully accurate for sports with different lifting techniques or weight classes. For other sports, consider using sport-specific performance metrics and calculators.",
    },
    {
      question: "Why do I sometimes see different Wilks scores for the same lifter?",
      answer:
        "Different powerlifting federations may use slightly different coefficient formulas or updated coefficients, leading to variations in Wilks scores. Additionally, rounding differences and measurement precision can affect the final score. Always ensure you are using the official coefficients for your federation or competition.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="gender" className="mb-1 flex items-center gap-1">
              Gender <Scale className="w-4 h-4 text-blue-600" />
            </Label>
            <Select
              value={inputs.gender}
              onValueChange={(v) => handleInputChange("gender", v)}
              id="gender"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">
                  Male <Flag className="inline ml-1 w-3 h-3" />
                </SelectItem>
                <SelectItem value="female">
                  Female <Flag className="inline ml-1 w-3 h-3" />
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bodyweight" className="mb-1 flex items-center gap-1">
              Bodyweight (kg) <Heart className="w-4 h-4 text-red-600" />
            </Label>
            <Input
              type="number"
              id="bodyweight"
              placeholder="Enter your bodyweight in kilograms"
              value={inputs.bodyweight}
              onChange={(e) => handleInputChange("bodyweight", e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <Label htmlFor="totalLifted" className="mb-1 flex items-center gap-1">
              Total Weight Lifted (kg) <Dumbbell className="w-4 h-4 text-gray-700" />
            </Label>
            <Input
              type="number"
              id="totalLifted"
              placeholder="Enter total weight lifted (sum of squat, bench, deadlift)"
              value={inputs.totalLifted}
              onChange={(e) => handleInputChange("totalLifted", e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
              onClick={calculate}
            >
              <Calculator className="mr-2 h-4 w-4" /> Calculate
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setInputs({ gender: "male", bodyweight: "", totalLifted: "" });
                setCalculated(null);
                setWarning(null);
              }}
              className="flex-1 h-11"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>

          {warning && (
            <p className="text-red-600 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> {warning}
            </p>
          )}

          {calculated && (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
              <CardContent className="p-8 text-center">
                <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                  {calculated.wilksScore}
                </p>
                <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Wilks Score
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Wilks Coefficient: {calculated.wilksCoeff}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  The Wilks Score allows you to compare your strength fairly against lifters of
                  different bodyweights.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Wilks Coefficient Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Wilks Coefficient Calculator is a powerful tool designed to help powerlifters and
          strength athletes compare their lifting performance across different bodyweight
          categories. Since bodyweight significantly influences the amount of weight an athlete can
          lift, the Wilks formula provides a standardized method to level the playing field. By
          applying gender-specific polynomial coefficients to an athlete's bodyweight, the formula
          calculates a coefficient that normalizes total lifted weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This coefficient, when multiplied by the total weight lifted (sum of squat, bench press,
          and deadlift), yields the Wilks Score — a single number representing relative strength.
          This score enables fair comparison between lifters of varying sizes, making it invaluable
          for competitions, rankings, and personal progress tracking. The Wilks formula is widely
          adopted by powerlifting federations worldwide.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator uses the official Wilks coefficients, which differ for males and females
          to account for physiological differences. Understanding your Wilks Score can help you
          set realistic goals, evaluate your training effectiveness, and compete more fairly.
          Whether you are a novice or an elite lifter, this tool provides an authoritative measure
          of your strength relative to your bodyweight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to note that while the Wilks formula is a robust comparative tool, it is
          one of several methods used in strength sports. Always consider your federation's rules
          and scoring systems when preparing for competition.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Wilks Coefficient Calculator is straightforward and requires only a few inputs.
          First, select your gender, as the Wilks formula uses different coefficients for males and
          females to ensure accuracy. Next, enter your current bodyweight in kilograms. It is
          important to use your actual bodyweight at the time of lifting for the most precise
          results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Then, input the total weight you have lifted across the three main powerlifting lifts:
          squat, bench press, and deadlift. This total should be the sum of your best successful
          lifts in a competition or training session. The calculator will then compute your Wilks
          Coefficient and Wilks Score.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After clicking the Calculate button, your Wilks Score will be displayed prominently. This
          score represents your strength relative to your bodyweight and can be used to compare
          yourself against other lifters or track your progress over time. If you wish to reset
          the inputs and start over, simply click the Reset button.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            Step 1: Select your gender (male or female) to apply the correct Wilks coefficients.
          </li>
          <li>Step 2: Enter your bodyweight in kilograms accurately.</li>
          <li>Step 3: Input the total weight lifted (sum of squat, bench press, and deadlift).</li>
          <li>Step 4: Click "Calculate" to view your Wilks Coefficient and Wilks Score.</li>
          <li>Step 5: Use the "Reset" button to clear inputs and calculate again if needed.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To maximize your Wilks Score, focus on improving your total lifted weight while managing
          your bodyweight strategically. Progressive overload in your training program is essential
          — gradually increase the weights you lift to build strength safely and effectively.
          Incorporate periodization to balance intensity and recovery, reducing the risk of injury.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Nutrition plays a critical role in optimizing your body composition. Aim to maintain a
          bodyweight that supports your strength goals without unnecessary excess mass. For
          lifters aiming to compete in specific weight classes, carefully plan your diet and
          hydration to hit target weights while preserving strength.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Technique refinement is equally important. Efficient lifting form reduces energy waste
          and injury risk, allowing you to lift heavier weights consistently. Consider working with
          a coach or using video analysis to improve your lifts. Finally, track your Wilks Score
          regularly to monitor progress and adjust your training and nutrition plans accordingly.
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
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
              href="https://www.powerlifting.sport/calculators/wilks-coefficient/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              International Powerlifting Federation (IPF) Wilks Calculator{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official Wilks coefficient formulas and calculators provided by the IPF, the
              international governing body for powerlifting.
            </p>
          </li>
          <li>
            <a
              href="https://en.wikipedia.org/wiki/Wilks_Coefficient"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Wilks Coefficient - Wikipedia <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive overview of the Wilks formula, its history, and application in powerlifting.
            </p>
          </li>
          <li>
            <a
              href="https://www.t-nation.com/training/wilks-score-what-it-is-and-how-to-use-it"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              T Nation: Wilks Score - What It Is and How to Use It{" "}
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Expert article explaining the practical use of the Wilks Score for training and
              competition strategy.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  const formulaString =
    "Wilks Coefficient = 500 / (a + b×W + c×W² + d×W³ + e×W⁴ + f×W⁵), where W = bodyweight in kg and coefficients a-f differ by gender.";

  const formulaVariables = [
    { variable: "W", description: "Bodyweight in kilograms" },
    { variable: "a, b, c, d, e, f", description: "Gender-specific Wilks coefficients" },
  ];

  const example = {
    title: "Real Life Example",
    scenario:
      "A male lifter weighing 90 kg has a total lift of 600 kg (sum of squat, bench press, deadlift). Calculate his Wilks Score.",
    steps: [
      {
        label: "Step 1",
        explanation:
          "Identify the Wilks coefficients for males: a = -216.0475144, b = 16.2606339, c = -0.002388645, d = -0.00113732, e = 7.01863e-06, f = -1.291e-08.",
      },
      {
        label: "Step 2",
        explanation:
          "Calculate the denominator: a + b×90 + c×90² + d×90³ + e×90⁴ + f×90⁵ = -216.0475144 + 1463.457051 + (-193.419) + (-83.034) + 45.932 + (-15.68) ≈ 1001.21.",
      },
      {
        label: "Step 3",
        explanation: "Calculate Wilks Coefficient: 500 / 1001.21 ≈ 0.4994.",
      },
      {
        label: "Step 4",
        explanation: "Calculate Wilks Score: 0.4994 × 600 = 299.64.",
      },
    ],
    result: "The lifter's Wilks Score is approximately 299.64.",
  };

  return (
    <CalculatorVerticalLayout
      title="Wilks Coefficient Calculator"
      description="Calculate your Wilks Score. Compare powerlifting strength across different body weight categories fairly."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{ title: "Formula", formula: formulaString, variables: formulaVariables }}
      example={example}
      relatedCalculators={[
        { title: "Swimming Power Points Calculator", url: "/sports/swimming-power-points", icon: "🏊" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
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