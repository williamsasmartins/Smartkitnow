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

const MET_VALUES = [
  { label: "Resting (Sleeping)", value: 0.9 },
  { label: "Sitting quietly", value: 1.3 },
  { label: "Walking, 2.0 mph (3.2 km/h)", value: 2.8 },
  { label: "Walking, 3.0 mph (4.8 km/h)", value: 3.5 },
  { label: "Bicycling, light effort", value: 4.0 },
  { label: "Weightlifting, general", value: 6.0 },
  { label: "Running, 6 mph (10 min/mile)", value: 9.8 },
  { label: "Running, 7.5 mph (8 min/mile)", value: 11.0 },
  { label: "Running, 10 mph (6 min/mile)", value: 14.5 },
  { label: "Jumping rope", value: 12.3 },
  { label: "Swimming, moderate effort", value: 8.0 },
  { label: "Basketball game", value: 8.0 },
  { label: "Soccer game", value: 10.0 },
  { label: "Cross-country skiing", value: 13.0 },
];

function formatNumber(num) {
  return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}

export default function CaloriesBurnedMetCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    duration: "",
    met: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const duration = parseFloat(inputs.duration);
    const met = parseFloat(inputs.met);

    if (!weight || !duration || !met || weight <= 0 || duration <= 0 || met <= 0) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all inputs.",
        formulaUsed: "",
      };
    }

    // Calories burned formula:
    // Calories = MET × weight (kg) × duration (hours)
    // Duration input is in minutes, convert to hours
    const durationHours = duration / 60;
    const caloriesBurned = met * weight * durationHours;

    return {
      value: formatNumber(caloriesBurned),
      label: "Calories Burned",
      subtext: `Based on MET value of ${met}, weight of ${weight} kg, and duration of ${duration} minutes.`,
      warning: null,
      formulaUsed: "Calories = MET × Weight (kg) × Duration (hours)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a MET and why is it important for calculating calories burned?",
      answer:
        "MET stands for Metabolic Equivalent of Task and represents the energy cost of physical activities as multiples of resting metabolic rate. It allows for standardized comparisons of energy expenditure across different activities and intensities, making it a valuable tool for estimating calories burned during exercise.",
    },
    {
      question: "How accurate is the MET-based calorie calculation?",
      answer:
        "While MET values provide a useful estimate, individual factors such as fitness level, body composition, and exercise efficiency can affect actual calorie burn. Therefore, MET-based calculations should be considered approximations rather than exact measurements.",
    },
    {
      question: "Can I use this calculator for any type of workout?",
      answer:
        "Yes, as long as you know or can estimate the MET value for your activity. The calculator covers a wide range of common exercises, but for specialized sports or activities, consult scientific literature or trusted databases for accurate MET values.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weight" className="flex items-center gap-1">
              Body Weight (kg) <Scale className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="weight"
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 70"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              aria-describedby="weight-desc"
            />
            <p id="weight-desc" className="text-sm text-slate-500 mt-1">
              Enter your body weight in kilograms for accurate calorie estimation.
            </p>
          </div>

          <div>
            <Label htmlFor="duration" className="flex items-center gap-1">
              Workout Duration (minutes) <Timer className="w-4 h-4 text-blue-600" />
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              step="any"
              placeholder="e.g. 45"
              value={inputs.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              aria-describedby="duration-desc"
            />
            <p id="duration-desc" className="text-sm text-slate-500 mt-1">
              Duration of your workout session in minutes.
            </p>
          </div>

          <div>
            <Label htmlFor="met" className="flex items-center gap-1">
              Activity MET Value <Flame className="w-4 h-4 text-blue-600" />
            </Label>
            <Select
              onValueChange={(v) => handleInputChange("met", v)}
              value={inputs.met}
              aria-describedby="met-desc"
            >
              <SelectTrigger aria-label="Select MET value">
                <SelectValue placeholder="Select activity MET" />
              </SelectTrigger>
              <SelectContent>
                {MET_VALUES.map(({ label, value }) => (
                  <SelectItem key={value} value={value.toString()}>
                    {label} — MET: {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p id="met-desc" className="text-sm text-slate-500 mt-1">
              Select the MET value corresponding to your workout intensity.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs state to current values (noop)
            setInputs((p) => ({ ...p }));
          }}
          aria-label="Calculate calories burned"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", duration: "", met: "" })}
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-medium text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{results.subtext}</p>
            <p className="text-xs italic text-slate-500 dark:text-slate-600 mt-2">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}

      {results.warning && (
        <p className="text-red-600 dark:text-red-400 font-semibold mt-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {results.warning}
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
          The Metabolic Equivalent of Task (MET) is a standardized unit that quantifies the energy cost of physical activities as multiples of resting metabolic rate. One MET is defined as the energy expended while sitting quietly, approximately 3.5 ml O₂/kg/min. By using MET values, we can estimate the calories burned during various exercises by accounting for the intensity and duration of the activity relative to rest.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses the formula: <em>Calories Burned = MET × Body Weight (kg) × Duration (hours)</em>. It provides a practical and evidence-based method to estimate energy expenditure, which is essential for athletes, coaches, and fitness enthusiasts aiming to optimize training, weight management, or performance goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          MET values vary widely depending on the type and intensity of the activity, from low-intensity tasks like sitting or walking slowly to high-intensity sports like running or competitive cycling. Selecting an accurate MET value for your workout is crucial for precise calorie estimation.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To calculate the calories burned during your workout, you need to input three key parameters: your body weight in kilograms, the duration of your workout in minutes, and the MET value corresponding to your activity's intensity. The MET value can be selected from the dropdown list, which includes common activities and their standardized METs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your accurate body weight in kilograms. This is essential as calorie burn scales with body mass.
          </li>
          <li>
            <strong>Step 2:</strong> Input the total duration of your workout in minutes.
          </li>
          <li>
            <strong>Step 3:</strong> Select the MET value that best matches your workout intensity from the provided list.
          </li>
          <li>
            <strong>Step 4:</strong> Click the "Calculate" button to see your estimated calories burned.
          </li>
          <li>
            <strong>Step 5:</strong> Use the "Reset" button to clear inputs and perform new calculations.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When planning your training or weight management program, understanding your calorie expenditure can help tailor your nutrition and recovery strategies. Use MET-based calculations to estimate your daily energy expenditure from workouts and adjust your caloric intake accordingly to support your goals, whether fat loss, muscle gain, or endurance improvement.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Remember that MET values are averages and individual variations exist due to factors like fitness level, exercise efficiency, and environmental conditions. For more precise monitoring, consider combining MET estimates with wearable technology or metabolic testing when possible.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, progressively increasing workout intensity or duration will raise your total calorie burn, but always balance this with adequate rest and nutrition to avoid overtraining and injury.
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
          For more information on training science, energy expenditure, and exercise physiology, consult the following authoritative sources:
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
              The ACSM is a global leader in sports medicine and exercise science research, providing evidence-based guidelines on physical activity and energy expenditure.
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
              The NSCA offers comprehensive resources on strength training, conditioning, and metabolic calculations for athletes and coaches.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/health-injuries/a20803104/metabolic-equivalent-met/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World: Understanding METs <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A practical guide explaining MET values and their application in running and general fitness.
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
        formula: "Calories Burned = MET × Body Weight (kg) × Duration (hours)",
        variables: [
          { symbol: "MET", description: "Metabolic Equivalent of Task for the activity" },
          { symbol: "Body Weight (kg)", description: "Your weight in kilograms" },
          { symbol: "Duration (hours)", description: "Workout duration in hours" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 70 kg individual runs at 6 mph (MET = 9.8) for 30 minutes. How many calories are burned?",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert duration from minutes to hours: 30 minutes = 0.5 hours.",
          },
          {
            label: "Step 2",
            explanation: "Use the formula: Calories = 9.8 × 70 × 0.5 = 343 calories.",
          },
        ],
        result: "The individual burns approximately 343 calories during the 30-minute run.",
      }}
      relatedCalculators={[
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Race Time Predictor (Riegel Formula)", url: "/sports/race-time-predictor-riegel", icon: "🏆" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
        { title: "Soccer League Table: Points & GD", url: "/sports/soccer-league-table-points-gd", icon: "⚽" },
        { title: "ERA & WHIP Calculator", url: "/sports/era-whip-calculator", icon: "🏆" },
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