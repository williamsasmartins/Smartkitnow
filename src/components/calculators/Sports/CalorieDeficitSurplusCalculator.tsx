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
  { label: "Lightly active (light exercise/sports 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise/sports 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise/sports 6-7 days a week)", value: 1.725 },
  { label: "Extra active (very hard exercise & physical job or 2x training)", value: 1.9 },
];

function calculateBMR({ gender, weightKg, heightCm, age }) {
  // Mifflin-St Jeor Equation
  if (gender === "male") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else if (gender === "female") {
    return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return 0;
}

export default function CalorieDeficitSurplusCalculator() {
  const [inputs, setInputs] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    goal: "deficit",
    calorieChange: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs((p) => ({ ...p, [n]: v })), []);

  const results = useMemo(() => {
    const { gender, age, weight, height, activityLevel, goal, calorieChange } = inputs;
    if (
      !gender ||
      !age ||
      !weight ||
      !height ||
      !activityLevel ||
      !goal ||
      calorieChange === "" ||
      Number(age) <= 0 ||
      Number(weight) <= 0 ||
      Number(height) <= 0
    ) {
      return { value: null, label: "", subtext: "", warning: null, formulaUsed: "" };
    }

    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);
    const activityFactor = Number(activityLevel);
    const calorieChangeNum = Number(calorieChange);

    if (calorieChangeNum < 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Calorie change must be a positive number.",
        formulaUsed: "",
      };
    }

    const bmr = calculateBMR({ gender, weightKg: weightNum, heightCm: heightNum, age: ageNum });
    const tdee = bmr * activityFactor;

    let targetCalories = 0;
    let label = "";
    if (goal === "deficit") {
      targetCalories = tdee - calorieChangeNum;
      label = "Calorie Deficit Target";
    } else if (goal === "surplus") {
      targetCalories = tdee + calorieChangeNum;
      label = "Calorie Surplus Target";
    }

    if (targetCalories < 1200) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning:
          "Warning: Your target calorie intake is very low. Consult a healthcare professional before proceeding.",
        formulaUsed: "",
      };
    }

    return {
      value: Math.round(targetCalories).toLocaleString(),
      label,
      subtext: `Based on your TDEE of ${Math.round(tdee).toLocaleString()} kcal/day`,
      warning: null,
      formulaUsed:
        "TDEE = BMR × Activity Factor; Target Calories = TDEE ± Calorie Change (Deficit or Surplus)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the difference between calorie deficit and calorie surplus?",
      answer:
        "A calorie deficit occurs when you consume fewer calories than your body burns, leading to weight loss. Conversely, a calorie surplus means consuming more calories than you burn, which supports weight gain and muscle growth. Both are essential concepts depending on your fitness goals.",
    },
    {
      question: "How accurate is this calculator for determining my calorie needs?",
      answer:
        "This calculator uses the Mifflin-St Jeor equation, one of the most validated formulas for estimating Basal Metabolic Rate (BMR), combined with an activity multiplier to estimate Total Daily Energy Expenditure (TDEE). While it provides a strong baseline, individual variations such as metabolism, genetics, and lifestyle factors can affect actual calorie needs.",
    },
    {
      question: "How should I choose my calorie change for deficit or surplus?",
      answer:
        "A moderate calorie deficit of 500 kcal/day typically leads to about 0.45 kg (1 lb) of weight loss per week, which is considered safe and sustainable. For muscle gain, a surplus of 250-500 kcal/day is recommended to minimize fat gain while maximizing muscle growth. Always adjust based on progress and how your body responds.",
    },
    {
      question: "Can I use this calculator if I have a medical condition or special dietary needs?",
      answer:
        "While this calculator provides general guidance, individuals with medical conditions, metabolic disorders, or special dietary requirements should consult a healthcare professional or registered dietitian before making significant changes to their calorie intake or diet.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender" className="flex items-center gap-1">
                Gender <Info className="w-4 h-4 text-blue-500" />
              </Label>
              <Select
                value={inputs.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
                id="gender"
                aria-label="Select Gender"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="age" className="flex items-center gap-1">
                Age (years) <Timer className="w-4 h-4 text-blue-500" />
              </Label>
              <Input
                type="number"
                id="age"
                min={1}
                placeholder="e.g. 30"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="weight" className="flex items-center gap-1">
                Weight (kg) <Scale className="w-4 h-4 text-blue-500" />
              </Label>
              <Input
                type="number"
                id="weight"
                min={1}
                placeholder="e.g. 70"
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="height" className="flex items-center gap-1">
                Height (cm) <Flag className="w-4 h-4 text-blue-500" />
              </Label>
              <Input
                type="number"
                id="height"
                min={1}
                placeholder="e.g. 175"
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="activityLevel" className="flex items-center gap-1">
                Activity Level <Activity className="w-4 h-4 text-blue-500" />
              </Label>
              <Select
                value={inputs.activityLevel}
                onValueChange={(v) => handleInputChange("activityLevel", v)}
                id="activityLevel"
                aria-label="Select Activity Level"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map(({ label, value }) => (
                    <SelectItem key={value} value={value.toString()}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goal" className="flex items-center gap-1">
                Goal <TargetIcon />
              </Label>
              <Select
                value={inputs.goal}
                onValueChange={(v) => handleInputChange("goal", v)}
                id="goal"
                aria-label="Select Goal"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deficit">Calorie Deficit (Weight Loss)</SelectItem>
                  <SelectItem value="surplus">Calorie Surplus (Weight Gain)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="calorieChange" className="flex items-center gap-1">
                Calorie Change (kcal/day) <Flame className="w-4 h-4 text-blue-500" />
              </Label>
              <Input
                type="number"
                id="calorieChange"
                min={0}
                placeholder="e.g. 500"
                value={inputs.calorieChange}
                onChange={(e) => handleInputChange("calorieChange", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {}}
          aria-label="Calculate calorie target"
        >
          <Trophy className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              gender: "",
              age: "",
              weight: "",
              height: "",
              activityLevel: "",
              goal: "deficit",
              calorieChange: "",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700">
          <CardContent className="text-center text-red-700 dark:text-red-300 font-semibold">
            <AlertTriangle className="mx-auto mb-2 w-6 h-6" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} kcal/day</p>
            <p className="text-xl font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{results.subtext}</p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Calorie Deficit / Surplus Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Calorie Deficit / Surplus Calculator is a scientifically grounded tool designed to help athletes,
          fitness enthusiasts, and anyone interested in body composition management to precisely plan their daily
          energy intake. It estimates your Total Daily Energy Expenditure (TDEE) by calculating your Basal Metabolic
          Rate (BMR) and adjusting it based on your activity level. This forms the foundation for determining how many
          calories you should consume to either lose weight (calorie deficit) or gain weight (calorie surplus).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Understanding your calorie needs is crucial for effective weight management. A calorie deficit means you are
          consuming fewer calories than your body burns, which forces your body to use stored fat for energy, leading
          to fat loss. Conversely, a calorie surplus provides your body with extra energy, which can be used to build
          muscle mass or increase fat stores, depending on your training and nutrition strategy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses the Mifflin-St Jeor equation, one of the most accurate and widely accepted formulas for
          estimating BMR. By inputting your gender, age, weight, height, and activity level, the calculator estimates
          your TDEE. You then specify your desired calorie change to create a deficit or surplus, allowing you to
          tailor your nutrition plan precisely to your goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Whether you are preparing for a competition, aiming to improve athletic performance, or simply want to manage
          your weight effectively, this calculator provides a reliable starting point for your nutritional planning.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate results from this calculator, you need to provide precise and honest inputs about
          your body and lifestyle. Start by selecting your gender, as the BMR formula differs between males and females.
          Enter your age in years, weight in kilograms, and height in centimeters. These values are essential for
          calculating your Basal Metabolic Rate (BMR), which represents the calories your body burns at rest.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, select your activity level from the provided options. This multiplier adjusts your BMR to account for
          the calories burned through daily activities and exercise, resulting in your Total Daily Energy Expenditure
          (TDEE). Be realistic when choosing your activity level to avoid underestimating or overestimating your calorie
          needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Then, choose your goal: whether you want to create a calorie deficit for weight loss or a calorie surplus for
          weight gain. Enter the number of calories you want to reduce or add daily. For safe and sustainable weight
          loss, a deficit of 300-500 kcal/day is recommended, while a surplus of 250-500 kcal/day is ideal for muscle
          gain.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, click the calculate button to see your target daily calorie intake. Use this number to guide your
          meal planning and monitor your progress, adjusting as necessary based on your results and how you feel.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300 mt-4">
          <li>
            <strong>Step 1:</strong> Enter your gender, age, weight (kg), and height (cm) accurately.
          </li>
          <li>
            <strong>Step 2:</strong> Select your activity level that best matches your daily routine.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your goal: calorie deficit for weight loss or surplus for weight gain.
          </li>
          <li>
            <strong>Step 4:</strong> Input the desired calorie change (e.g., 500 kcal) to create your deficit or
            surplus.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your target daily calorie intake.
          </li>
          <li>
            <strong>Step 6:</strong> Use this target to plan your meals and adjust based on progress and feedback.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When working with calorie deficits or surpluses, it is essential to combine your nutrition plan with an
          appropriate training strategy. For fat loss, prioritize resistance training to preserve lean muscle mass while
          incorporating cardiovascular exercise to increase calorie expenditure. Avoid excessive calorie deficits as they
          can lead to muscle loss and metabolic slowdown.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For muscle gain, focus on progressive overload in your strength training program to maximize hypertrophy. Ensure
          your calorie surplus is moderate to minimize fat gain while providing enough energy for muscle repair and growth.
          Adequate protein intake (1.6-2.2 g/kg body weight) is critical in both deficit and surplus phases.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Monitor your progress regularly by tracking body composition, strength levels, and overall well-being. Adjust
          your calorie intake and training intensity based on these metrics. Remember, consistency and patience are key to
          achieving sustainable results.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Finally, prioritize recovery, sleep, and hydration as they play vital roles in optimizing your metabolism and
          supporting your training goals.
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
              A comprehensive research article validating the Mifflin-St Jeor equation as an accurate method for
              estimating Basal Metabolic Rate in diverse populations.
            </p>
          </li>
          <li>
            <a
              href="https://www.acsm.org/read-research/resource-library/resource_detail?id=5f6e1f9a-1f6a-4a3a-8d0d-4f0c3e9e7a5f"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              ACSM Position Stand on Nutrition and Athletic Performance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              The American College of Sports Medicine's authoritative guidelines on nutrition strategies for athletes,
              including energy balance and weight management.
            </p>
          </li>
          <li>
            <a
              href="https://www.nutrition.org.uk/healthyliving/basics/energybalance.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              British Nutrition Foundation: Energy Balance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An accessible resource explaining the principles of energy intake and expenditure, and their role in
              weight management.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calorie Deficit / Surplus Calculator"
      description="Plan calorie deficits or surpluses. Adjust energy intake precisely for weight cutting or mass gaining cycles."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "TDEE = BMR × Activity Factor; Target Calories = TDEE ± Calorie Change (Deficit or Surplus)",
        variables: [
          { symbol: "BMR", description: "Basal Metabolic Rate (kcal/day)" },
          { symbol: "TDEE", description: "Total Daily Energy Expenditure (kcal/day)" },
          { symbol: "Activity Factor", description: "Multiplier based on activity level" },
          { symbol: "Calorie Change", description: "Desired calorie deficit or surplus (kcal/day)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "John is a 30-year-old male, weighing 80 kg, 180 cm tall, moderately active (activity factor 1.55). He wants to lose weight by creating a 500 kcal deficit daily.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate BMR using Mifflin-St Jeor: 10 × 80 + 6.25 × 180 - 5 × 30 + 5 = 1765 kcal/day.",
          },
          {
            label: "Step 2",
            explanation: "Calculate TDEE: 1765 × 1.55 = 2735 kcal/day.",
          },
          {
            label: "Step 3",
            explanation: "Apply calorie deficit: 2735 - 500 = 2235 kcal/day target intake.",
          },
        ],
        result: "John should consume approximately 2235 kcal/day to achieve his weight loss goal.",
      }}
      relatedCalculators={[
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Rowing Split (500m) ↔ Pace", url: "/sports/rowing-split-500m-pace", icon: "🏃" },
        { title: "Basketball eFG% & TS% Calculator", url: "/sports/basketball-efg-ts", icon: "⚽" },
        { title: "Fantasy Team Points Projections Calculator", url: "/sports/fantasy-team-points-projections", icon: "🏆" },
        { title: "Soccer League Table: Points & GD", url: "/sports/soccer-league-table-points-gd", icon: "⚽" },
        { title: "Golf Handicap Differential & Index", url: "/sports/golf-handicap-differential-index", icon: "⛳" },
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

// Dummy icon for Goal label (Target icon)
function TargetIcon() {
  return (
    <svg
      className="w-4 h-4 text-blue-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}