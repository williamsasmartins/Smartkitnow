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

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (light exercise 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise 6-7 days/week)", value: 1.725 },
  { label: "Extra active (very hard exercise & physical job)", value: 1.9 },
  { label: "Athlete (intense training multiple times daily)", value: 2.1 },
];

function calculateBMR({ sex, weight, height, age }) {
  // Mifflin-St Jeor Equation
  if (sex === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (sex === "female") {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return 0;
}

export default function TdeeCalculator() {
  const [inputs, setInputs] = useState({
    sex: "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const canCalculate =
    inputs.sex &&
    inputs.age &&
    inputs.weight &&
    inputs.height &&
    inputs.activityLevel &&
    !isNaN(inputs.age) &&
    !isNaN(inputs.weight) &&
    !isNaN(inputs.height);

  const results = useMemo(() => {
    if (!canCalculate) {
      return { value: null, label: "", subtext: "", warning: null, formulaUsed: "" };
    }

    const age = Number(inputs.age);
    const weight = Number(inputs.weight);
    const height = Number(inputs.height);
    const activityFactor = Number(inputs.activityLevel);

    if (age < 15 || age > 80) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Age should be between 15 and 80 for accurate results.",
        formulaUsed: "",
      };
    }
    if (weight < 30 || weight > 250) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Weight should be between 30kg and 250kg for accurate results.",
        formulaUsed: "",
      };
    }
    if (height < 130 || height > 230) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Height should be between 130cm and 230cm for accurate results.",
        formulaUsed: "",
      };
    }

    const bmr = calculateBMR({ sex: inputs.sex, weight, height, age });
    const tdee = bmr * activityFactor;

    return {
      value: Math.round(tdee),
      label: "Total Daily Energy Expenditure (kcal)",
      subtext:
        "This is an estimate of the calories you need daily to maintain your current weight with your activity level.",
      warning: null,
      formulaUsed: `TDEE = BMR × Activity Factor = ${bmr.toFixed(0)} × ${activityFactor} = ${tdee.toFixed(0)} kcal`,
    };
  }, [inputs, canCalculate]);

  const faqs = [
    {
      question: "What is TDEE and why is it important for athletes?",
      answer:
        "Total Daily Energy Expenditure (TDEE) represents the total number of calories your body burns in a day, including all activities and bodily functions. For athletes, understanding TDEE is crucial to optimize nutrition, recovery, and performance. Consuming calories in line with your TDEE helps maintain energy balance, supports training adaptations, and prevents unwanted weight changes.",
    },
    {
      question: "How does activity level affect TDEE calculations?",
      answer:
        "Activity level is a multiplier applied to your Basal Metabolic Rate (BMR) to estimate your total energy needs. Athletes typically have higher activity factors due to intense training and physical demands. Selecting the correct activity level ensures your TDEE reflects your actual energy expenditure, which is essential for accurate calorie planning.",
    },
    {
      question: "Can I use this calculator if I am a teenager or senior athlete?",
      answer:
        "This calculator is optimized for ages 15 to 80 for accuracy. Teenagers under 15 and seniors over 80 have different metabolic rates and physiological considerations. For these groups, consulting a healthcare professional or sports scientist is recommended for personalized assessments.",
    },
    {
      question: "How often should I recalculate my TDEE?",
      answer:
        "You should recalculate your TDEE whenever there are significant changes in your weight, training volume, or lifestyle. For athletes, this might be every few months or when transitioning between training phases, such as off-season to competition season, to ensure your nutrition aligns with your current energy demands.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="sex" className="flex items-center gap-2 mb-1 font-semibold text-blue-900 dark:text-white">
              <Flag className="w-5 h-5" /> Sex
            </Label>
            <Select
              value={inputs.sex}
              onValueChange={(v) => handleInputChange("sex", v)}
              aria-label="Select sex"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="age" className="flex items-center gap-2 mb-1 font-semibold text-blue-900 dark:text-white">
              <Timer className="w-5 h-5" /> Age (years)
            </Label>
            <Input
              id="age"
              type="number"
              min={15}
              max={80}
              placeholder="e.g., 25"
              value={inputs.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              aria-describedby="age-desc"
            />
            <p id="age-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your age between 15 and 80 years.
            </p>
          </div>

          <div>
            <Label htmlFor="weight" className="flex items-center gap-2 mb-1 font-semibold text-blue-900 dark:text-white">
              <Scale className="w-5 h-5" /> Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min={30}
              max={250}
              placeholder="e.g., 70"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              aria-describedby="weight-desc"
            />
            <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your body weight in kilograms.
            </p>
          </div>

          <div>
            <Label htmlFor="height" className="flex items-center gap-2 mb-1 font-semibold text-blue-900 dark:text-white">
              <RulerIcon className="w-5 h-5" /> Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              min={130}
              max={230}
              placeholder="e.g., 175"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
              aria-describedby="height-desc"
            />
            <p id="height-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your height in centimeters.
            </p>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="activityLevel" className="flex items-center gap-2 mb-1 font-semibold text-blue-900 dark:text-white">
              <Activity className="w-5 h-5" /> Activity Level
            </Label>
            <Select
              value={inputs.activityLevel}
              onValueChange={(v) => handleInputChange("activityLevel", v)}
              aria-label="Select activity level"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map(({ label, value }) => (
                  <SelectItem key={value} value={String(value)}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          disabled={!canCalculate}
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Calculate TDEE"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              sex: "",
              age: "",
              weight: "",
              height: "",
              activityLevel: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-yellow-50 border-yellow-300 dark:bg-yellow-900 dark:border-yellow-700 border p-4 mt-4">
          <AlertTriangle className="inline-block mr-2 w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-800 dark:text-yellow-300 font-semibold">{results.warning}</span>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} kcal</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding TDEE Calculator (Sports)</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Total Daily Energy Expenditure (TDEE) is the total number of calories your body requires in a day to maintain your current weight,
          accounting for all physical activities, exercise, and basic metabolic functions. For athletes, accurately estimating TDEE is essential
          to fuel performance, optimize recovery, and support training adaptations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses the Mifflin-St Jeor equation to estimate Basal Metabolic Rate (BMR), which is then multiplied by an activity factor
          tailored for athletes and highly active individuals. The activity factor reflects your training volume and intensity, which significantly
          influences your daily energy needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your TDEE helps in planning nutrition strategies, whether your goal is to maintain weight, build muscle, or reduce fat.
          It also assists in preventing under-fueling, which can impair performance and increase injury risk.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Remember, TDEE is an estimate and individual variations exist due to genetics, metabolism, and lifestyle factors. Regular monitoring and
          adjustments are recommended for best results.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate TDEE estimate, input your biological sex, age, weight in kilograms, height in centimeters, and select your
          activity level that best matches your typical training and lifestyle. The activity level options range from sedentary to athlete-level
          intense training.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          After entering your details, click the "Calculate" button to see your estimated daily calorie needs. The result includes the formula used,
          so you understand how the calculation was derived.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Use this number as a baseline for your nutrition planning. If your goal is weight loss, consume fewer calories than your TDEE; for muscle
          gain, consume more. Always consider consulting a sports nutritionist for personalized advice.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your biological sex (male or female) to apply the correct BMR formula.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your age in years, ensuring it is between 15 and 80 for accuracy.
          </li>
          <li>
            <strong>Step 3:</strong> Input your current weight in kilograms and height in centimeters.
          </li>
          <li>
            <strong>Step 4:</strong> Choose your activity level that best reflects your daily training and lifestyle intensity.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your TDEE and use it to guide your nutrition and training strategy.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          1. <strong>Fuel Your Training:</strong> Use your TDEE as a foundation to ensure you consume enough calories to support your training demands.
          Under-fueling can lead to fatigue, decreased performance, and increased injury risk.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          2. <strong>Adjust for Training Phases:</strong> During heavy training or competition phases, your energy needs may increase. Recalculate your TDEE
          regularly to stay aligned with your current workload.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          3. <strong>Monitor Body Composition:</strong> Track changes in weight and body composition alongside your calorie intake to ensure your nutrition
          strategy is effective.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          4. <strong>Hydration and Recovery:</strong> Remember that calorie needs are only part of the equation. Proper hydration, sleep, and recovery strategies
          are essential to maximize training adaptations and overall health.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Mifflin-St Jeor Equation Study <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A foundational research article validating the Mifflin-St Jeor equation for estimating basal metabolic rate in adults.
            </p>
          </li>
          <li>
            <a
              href="https://www.sportsci.org/jour/9801/wgh.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Energy Expenditure in Athletes <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An overview of energy expenditure considerations specific to athletes, including training and recovery demands.
            </p>
          </li>
          <li>
            <a
              href="https://www.eatright.org/fitness/sports-and-performance/fueling-your-workout/understanding-total-daily-energy-expenditure"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Academy of Nutrition and Dietetics: Understanding TDEE <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical guidance on TDEE and its role in sports nutrition from a leading professional nutrition organization.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="TDEE Calculator (Sports)"
      description="Calculate Total Daily Energy Expenditure for athletes. Estimate calorie needs based on high activity levels and training volume."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula: "TDEE = BMR × Activity Factor",
        variables: [
          { symbol: "BMR", description: "Basal Metabolic Rate (kcal/day)" },
          { symbol: "Activity Factor", description: "Multiplier based on activity level" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 25-year-old male athlete, weighing 75kg and 180cm tall, training intensely 6 days a week.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate BMR using Mifflin-St Jeor: 10 × 75 + 6.25 × 180 - 5 × 25 + 5 = 1763 kcal",
          },
          {
            label: "Step 2",
            explanation: "Select activity factor for very active athlete: 1.725",
          },
          {
            label: "Step 3",
            explanation: "Calculate TDEE: 1763 × 1.725 = 3041 kcal/day",
          },
        ],
        result: "Estimated TDEE is approximately 3040 kcal/day to maintain current weight.",
      }}
      relatedCalculators={[
        { title: "Swim Performance Level Calculator", url: "/sports/swim-performance-level-calculator", icon: "🏊" },
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "🏆" },
        { title: "Macronutrient Calculator (Sports)", url: "/sports/macronutrient-calculator", icon: "🏆" },
        { title: "Heart-Rate Zones Calculator (Karvonen Method)", url: "/sports/heart-rate-zones-karvonen", icon: "🔥" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Pool Length Time Converter (SCY/SCM/LCM)", url: "/sports/pool-length-time-converter", icon: "🏊" },
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

// Helper icon for height label (since no ruler icon imported, create inline SVG)
function RulerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="7" y1="3" x2="7" y2="21" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="17" y1="3" x2="17" y2="21" />
    </svg>
  );
}