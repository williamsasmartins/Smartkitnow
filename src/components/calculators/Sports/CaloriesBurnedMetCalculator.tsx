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

const MET_VALUES = [
  { label: "Resting (Sleeping)", value: 0.9 },
  { label: "Sleeping", value: 0.95 },
  { label: "Sitting quietly", value: 1.0 },
  { label: "Walking, 2.0 mph (3.2 km/h)", value: 2.8 },
  { label: "Walking, 3.0 mph (4.8 km/h)", value: 3.5 },
  { label: "Walking, 4.0 mph (6.4 km/h)", value: 5.0 },
  { label: "Running, 5 mph (8 km/h)", value: 8.3 },
  { label: "Running, 6 mph (9.7 km/h)", value: 9.8 },
  { label: "Running, 7 mph (11.3 km/h)", value: 11.0 },
  { label: "Cycling, moderate effort (12-13.9 mph)", value: 8.0 },
  { label: "Cycling, vigorous effort (14-15.9 mph)", value: 10.0 },
  { label: "Swimming, general", value: 6.0 },
  { label: "Weightlifting, moderate effort", value: 6.0 },
  { label: "Basketball game", value: 8.0 },
  { label: "Soccer game", value: 10.0 },
  { label: "Jump rope, moderate effort", value: 12.3 },
  { label: "Vigorous calisthenics", value: 8.0 },
  { label: "Hiking, cross country", value: 6.0 },
  { label: "Yoga", value: 2.5 },
];

export default function CaloriesBurnedMetCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    duration: "",
    met: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculation formula:
  // Calories burned = MET × weight (kg) × duration (hours)
  // Source: https://sites.google.com/site/compendiumofphysicalactivities/
  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const duration = parseFloat(inputs.duration);
    const met = parseFloat(inputs.met);

    if (
      isNaN(weight) ||
      weight <= 0 ||
      isNaN(duration) ||
      duration <= 0 ||
      isNaN(met) ||
      met <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all inputs.",
        formulaUsed:
          "Calories Burned = MET × Weight (kg) × Duration (hours)",
      };
    }

    const caloriesBurned = met * weight * duration;

    return {
      value: caloriesBurned.toFixed(2) + " kcal",
      label: "Estimated Calories Burned",
      subtext:
        "Based on MET value, body weight, and workout duration.",
      warning: null,
      formulaUsed:
        "Calories Burned = MET × Weight (kg) × Duration (hours)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a MET and why is it used?",
      answer:
        "MET stands for Metabolic Equivalent of Task and represents the energy cost of physical activities. One MET is the rate of energy expenditure while at rest. Using MET values allows for standardized comparisons of energy expenditure across different activities and intensities.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "This calculator provides an estimate based on average MET values and user inputs. Individual variations such as fitness level, age, and exercise efficiency can affect actual calories burned. For precise measurements, consider using metabolic testing equipment.",
    },
    {
      question: "Can I use pounds instead of kilograms?",
      answer:
        "This calculator requires weight input in kilograms for accuracy. To convert pounds to kilograms, divide the weight in pounds by 2.2046. For example, 150 lbs ÷ 2.2046 ≈ 68.04 kg.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
          <Scale className="w-4 h-4" />
          Body Weight (kg)
        </Label>
        <Input
          id="weight"
          type="number"
          min="1"
          step="any"
          placeholder="e.g., 70"
          value={inputs.weight}
          onChange={(e) => handleInputChange("weight", e.target.value)}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-sm text-slate-500 mt-1">
          Enter your body weight in kilograms.
        </p>
      </div>

      <div>
        <Label htmlFor="duration" className="mb-1 flex items-center gap-1">
          <Timer className="w-4 h-4" />
          Workout Duration (minutes)
        </Label>
        <Input
          id="duration"
          type="number"
          min="1"
          step="any"
          placeholder="e.g., 45"
          value={inputs.duration}
          onChange={(e) => handleInputChange("duration", e.target.value)}
          aria-describedby="duration-desc"
        />
        <p id="duration-desc" className="text-sm text-slate-500 mt-1">
          Enter the total workout duration in minutes.
        </p>
      </div>

      <div>
        <Label htmlFor="met" className="mb-1 flex items-center gap-1">
          <Flame className="w-4 h-4" />
          Select Activity MET Value
        </Label>
        <Select
          value={inputs.met}
          onValueChange={(value) => handleInputChange("met", value)}
          aria-describedby="met-desc"
        >
          <SelectTrigger id="met" className="w-full">
            <SelectValue placeholder="Choose an activity MET value" />
          </SelectTrigger>
          <SelectContent>
            {MET_VALUES.map(({ label, value }) => (
              <SelectItem key={value} value={value.toString()}>
                {label} &mdash; {value.toFixed(1)} MET
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p id="met-desc" className="text-sm text-slate-500 mt-1">
          Select the MET value that best matches your workout intensity.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate calories burned"
        >
          <Trophy className="mr-2 h-4 w-4" aria-hidden="true" />
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              duration: "",
              met: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Reset
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
            {results.subtext && (
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                {results.subtext}
              </p>
            )}
          </CardContent>
        </Card>
      )}
      {results.warning && (
        <p className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          {results.warning}
        </p>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Calories Burned per Workout (MET)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Metabolic Equivalent of Task (MET) is a standardized unit that
          estimates the amount of energy expended during physical activities
          compared to resting metabolism. One MET is defined as the energy cost
          of sitting quietly, roughly equivalent to 1 kcal/kg/hour. By using
          MET values, we can estimate the calories burned during various
          exercises by accounting for the activity intensity, body weight, and
          duration. This method is widely accepted in exercise science and
          provides a practical way to quantify energy expenditure without
          specialized equipment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The formula to calculate calories burned is straightforward: multiply
          the MET value by your body weight in kilograms and the duration of
          the activity in hours. This approach allows athletes, coaches, and
          fitness enthusiasts to monitor training loads and optimize energy
          balance effectively.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate the calories burned during your workout, enter your body
          weight in kilograms, the duration of your exercise in minutes, and
          select the MET value that corresponds to your activity intensity. The
          calculator will then provide an estimate of total calories burned
          based on these inputs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your accurate body weight in
            kilograms. If you know your weight in pounds, convert it by dividing
            by 2.2046.
          </li>
          <li>
            <strong>Step 2:</strong> Input the total duration of your workout
            in minutes. This should reflect the actual time spent performing the
            activity.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the MET value that best matches the
            intensity and type of your workout from the dropdown list.
          </li>
          <li>
            <strong>Step 4:</strong> Click &quot;Calculate&quot; to see your
            estimated calories burned.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips &amp; Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning your workouts, understanding calories burned can help you
          manage energy balance and recovery. For endurance training, aim for
          sessions where calories burned &gt; calories consumed to promote fat
          loss, but ensure adequate nutrition to support performance and
          recovery. For strength training, focus on intensity and volume rather
          than just calorie burn, as muscle growth requires sufficient energy
          and protein intake.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Remember that MET values are averages and individual metabolic rates
          vary. Use this calculator as a guide rather than an absolute measure.
          Tracking your progress over time and adjusting your training based on
          how you feel and perform will yield the best results.
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
          For more information on exercise physiology, MET values, and energy
          expenditure, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing guidelines and position stands on physical activity and health.
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
              The NSCA offers evidence-based resources on strength training, conditioning, and performance enhancement.
            </p>
          </li>
          <li>
            <a
              href="https://sites.google.com/site/compendiumofphysicalactivities/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              The Compendium of Physical Activities <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive listing of MET values for hundreds of physical activities, widely used in research and practice.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calories Burned per Workout (MET)"
      description="Calculate calories burned during workouts. Use MET values to estimate energy expenditure for various sports intensities."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "Calories Burned = MET × Weight (kg) × Duration (hours)",
        variables: [
          {
            symbol: "MET",
            description:
              "Metabolic Equivalent of Task, representing activity intensity",
          },
          {
            symbol: "Weight (kg)",
            description: "Your body weight in kilograms",
          },
          {
            symbol: "Duration (hours)",
            description: "Duration of the activity in hours",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Calculate calories burned for a 70 kg person running at 6 mph (MET = 9.8) for 30 minutes.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Identify the MET value for running at 6 mph, which is 9.8.",
          },
          {
            label: "Step 2",
            explanation:
              "Convert workout duration from minutes to hours: 30 minutes ÷ 60 = 0.5 hours.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply the formula: Calories Burned = 9.8 × 70 × 0.5 = 343 kcal.",
          },
        ],
        result:
          "The person burns approximately 343 kilocalories during the 30-minute run.",
      }}
      relatedCalculators={[
        {
          title: "Race Time Predictor (Riegel Formula)",
          url: "/sports/race-time-predictor-riegel",
          icon: "🏆",
        },
        {
          title: "Wilks Coefficient Calculator",
          url: "/sports/wilks-coefficient",
          icon: "🏋️",
        },
        {
          title: "FTP (Functional Threshold Power) Zones Planner",
          url: "/sports/ftp-zones-planner",
          icon: "🚴",
        },
        {
          title: "Rowing Split (500m) ↔ Pace",
          url: "/sports/rowing-split-500m-pace",
          icon: "🏃",
        },
        {
          title: "Fitness Age Calculator",
          url: "/sports/fitness-age-calculator",
          icon: "🏆",
        },
        {
          title: "ERA & WHIP Calculator",
          url: "/sports/era-whip-calculator",
          icon: "🏆",
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