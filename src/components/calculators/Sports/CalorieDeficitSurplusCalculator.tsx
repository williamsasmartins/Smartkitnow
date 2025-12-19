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

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (light exercise/sports 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise/sports 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise/sports 6-7 days a week)", value: 1.725 },
  { label: "Extra active (very hard exercise & physical job or 2x training)", value: 1.9 },
];

function calculateBMR({ weight, height, age, sex }) {
  // Mifflin-St Jeor Equation (most validated)
  if (sex === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

function formatNumber(num) {
  return Math.round(num).toLocaleString();
}

export default function CalorieDeficitSurplusCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    height: "",
    age: "",
    sex: "male",
    activity: 1.2,
    goal: "deficit",
    calorieChange: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const height = parseFloat(inputs.height);
    const age = parseInt(inputs.age);
    const sex = inputs.sex;
    const activity = parseFloat(inputs.activity);
    const calorieChange = parseInt(inputs.calorieChange);
    const goal = inputs.goal;

    if (
      !weight ||
      !height ||
      !age ||
      !sex ||
      !activity ||
      !calorieChange ||
      calorieChange <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: null,
        formulaUsed: "",
      };
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    const bmr = calculateBMR({ weight, height, age, sex });

    // Total Daily Energy Expenditure (TDEE)
    const tdee = bmr * activity;

    // Adjust calories based on goal
    let adjustedCalories;
    let note;
    if (goal === "deficit") {
      adjustedCalories = tdee - calorieChange;
      note =
        "Calorie deficit indicates energy intake below maintenance to promote fat loss.";
      if (adjustedCalories < 1200) {
        return {
          value: null,
          label: "",
          subtext: "",
          warning:
            "Warning: Calorie intake below 1200 kcal/day may be unsafe. Consult a professional.",
          formulaUsed: "TDEE - Calorie Deficit",
        };
      }
    } else {
      adjustedCalories = tdee + calorieChange;
      note =
        "Calorie surplus indicates energy intake above maintenance to promote muscle gain or weight gain.";
    }

    return {
      value: `${formatNumber(adjustedCalories)} kcal/day`,
      label: `Recommended Daily Calories (${goal === "deficit" ? "Deficit" : "Surplus"})`,
      subtext: note,
      warning: null,
      formulaUsed: `TDEE (${formatNumber(tdee)} kcal) ${
        goal === "deficit" ? "-" : "+"
      } Calorie Change (${calorieChange} kcal)`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is a calorie deficit and why is it important?",
      answer:
        "A calorie deficit occurs when you consume fewer calories than your body expends, forcing it to use stored fat for energy. This is essential for fat loss and weight reduction. Maintaining a moderate deficit ensures fat loss while preserving muscle mass and metabolic health.",
    },
    {
      question: "How do I determine the right calorie surplus for muscle gain?",
      answer:
        "A calorie surplus means consuming more calories than your body burns, providing extra energy for muscle growth and recovery. A moderate surplus of 250-500 kcal/day is recommended to maximize lean mass gain while minimizing fat accumulation.",
    },
    {
      question: "Why do I need to consider activity level in this calculation?",
      answer:
        "Activity level directly influences your Total Daily Energy Expenditure (TDEE). Accurately estimating your activity multiplier ensures your calorie needs reflect your lifestyle, preventing under- or over-estimation of energy requirements.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
            Weight (kg) <Scale className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="weight"
            type="number"
            min={30}
            max={300}
            step={0.1}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            placeholder="e.g. 70"
          />
        </div>
        <div>
          <Label htmlFor="height" className="mb-1 flex items-center gap-1">
            Height (cm) <Flag className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="height"
            type="number"
            min={100}
            max={250}
            step={0.1}
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder="e.g. 175"
          />
        </div>
        <div>
          <Label htmlFor="age" className="mb-1 flex items-center gap-1">
            Age (years) <Timer className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="age"
            type="number"
            min={10}
            max={100}
            value={inputs.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            placeholder="e.g. 28"
          />
        </div>
        <div>
          <Label htmlFor="sex" className="mb-1 flex items-center gap-1">
            Sex <Heart className="w-4 h-4 text-blue-600" />
          </Label>
          <Select
            value={inputs.sex}
            onValueChange={(v) => handleInputChange("sex", v)}
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
        <div className="sm:col-span-2">
          <Label htmlFor="activity" className="mb-1 flex items-center gap-1">
            Activity Level <Activity className="w-4 h-4 text-blue-600" />
          </Label>
          <Select
            value={inputs.activity.toString()}
            onValueChange={(v) => handleInputChange("activity", v)}
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
          <Label htmlFor="goal" className="mb-1 flex items-center gap-1">
            Goal <Trophy className="w-4 h-4 text-blue-600" />
          </Label>
          <Select
            value={inputs.goal}
            onValueChange={(v) => handleInputChange("goal", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deficit">Calorie Deficit (Fat Loss)</SelectItem>
              <SelectItem value="surplus">Calorie Surplus (Muscle Gain)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="calorieChange" className="mb-1 flex items-center gap-1">
            Calorie Change (kcal) <Flame className="w-4 h-4 text-blue-600" />
          </Label>
          <Input
            id="calorieChange"
            type="number"
            min={100}
            max={1500}
            step={10}
            value={inputs.calorieChange}
            onChange={(e) => handleInputChange("calorieChange", e.target.value)}
            placeholder="e.g. 500"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate calorie deficit or surplus"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              height: "",
              age: "",
              sex: "male",
              activity: 1.2,
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

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-4 text-red-600 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {results.warning}
              </p>
            )}
            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic">
              Formula used: {results.formulaUsed}
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
          Understanding Calorie Deficit / Surplus Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps athletes and fitness enthusiasts precisely estimate their daily calorie needs based on individual characteristics such as weight, height, age, sex, and activity level. By calculating your Basal Metabolic Rate (BMR) and adjusting for your activity level, it determines your Total Daily Energy Expenditure (TDEE), which is the number of calories your body requires to maintain its current weight. From there, you can plan a calorie deficit to lose fat or a calorie surplus to gain muscle mass, ensuring your nutrition aligns with your training goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator uses the Mifflin-St Jeor equation, a widely validated formula in sports science, to estimate BMR. It then multiplies BMR by an activity factor reflecting your lifestyle and exercise habits. Adjusting calories by a specific deficit or surplus allows you to create an energy balance tailored to your goals, whether cutting weight or bulking up.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get the most accurate results, input your current weight in kilograms, height in centimeters, age in years, and select your biological sex. Choose your typical activity level from sedentary to extra active, which adjusts your calorie needs based on how much energy you expend daily. Then select your goal: a calorie deficit for fat loss or a calorie surplus for muscle gain. Finally, enter the amount of calorie change you want to apply, typically between 250 and 500 kcal for safe and effective results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your weight, height, age, and sex accurately.
          </li>
          <li>
            <strong>Step 2:</strong> Select your activity level based on your weekly exercise and lifestyle.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your goal: calorie deficit for weight loss or surplus for muscle gain.
          </li>
          <li>
            <strong>Step 4:</strong> Input your desired calorie change (e.g., 500 kcal deficit or surplus).
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to see your recommended daily calorie intake.
          </li>
          <li>
            <strong>Step 6:</strong> Use this number to guide your meal planning and monitor progress.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Training Tips & Strategy
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When implementing a calorie deficit, aim for a moderate reduction of 10-20% below your maintenance calories to promote fat loss while preserving lean muscle mass. Avoid aggressive deficits that can impair performance, recovery, and metabolic health. Pair your nutrition strategy with resistance training to maintain strength and muscle tissue during weight loss phases.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          For muscle gain, a slight calorie surplus of 250-500 kcal above maintenance is optimal to support hypertrophy without excessive fat gain. Prioritize nutrient timing, protein intake, and progressive overload in your training to maximize muscle synthesis. Regularly reassess your calorie needs as your body composition and activity levels change.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Consistency and patience are key. Track your progress weekly and adjust calorie intake based on changes in weight, performance, and recovery. Consulting a sports nutritionist or dietitian can provide personalized guidance tailored to your unique physiology and goals.
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
          References & Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science, energy balance, and nutrition strategies, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines on energy expenditure and nutrition.
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
              Offers comprehensive resources on strength training, nutrition, and performance optimization for athletes.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/nutrition-weight-loss/a20803187/calorie-deficit-for-weight-loss/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - Calorie Deficit for Weight Loss <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical advice and scientific insights on managing calorie deficits safely and effectively for endurance athletes.
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
          "BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5 (male) or -161 (female); TDEE = BMR × Activity Factor; Adjusted Calories = TDEE ± Calorie Change",
        variables: [
          { symbol: "BMR", description: "Basal Metabolic Rate (kcal/day)" },
          { symbol: "TDEE", description: "Total Daily Energy Expenditure (kcal/day)" },
          { symbol: "weight", description: "Body weight in kilograms" },
          { symbol: "height", description: "Height in centimeters" },
          { symbol: "age", description: "Age in years" },
          { symbol: "Activity Factor", description: "Multiplier based on activity level" },
          { symbol: "Calorie Change", description: "Desired calorie deficit or surplus (kcal)" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 28-year-old male athlete weighing 75 kg, 180 cm tall, moderately active (activity factor 1.55), wants to create a 500 kcal calorie deficit for fat loss.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate BMR: (10 × 75) + (6.25 × 180) - (5 × 28) + 5 = 750 + 1125 - 140 + 5 = 1740 kcal/day",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate TDEE: 1740 × 1.55 = 2697 kcal/day (calories to maintain weight)",
          },
          {
            label: "Step 3",
            explanation:
              "Apply calorie deficit: 2697 - 500 = 2197 kcal/day recommended intake for fat loss.",
          },
        ],
        result:
          "The athlete should consume approximately 2200 kcal/day to achieve a safe and effective calorie deficit for fat loss.",
      }}
      relatedCalculators={[
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "T1/T2 Transition Time Impact (Triathlon)", url: "/sports/t1-t2-time-impact", icon: "🏆" },
        { title: "Body Fat Percentage Calculator (Athletes)", url: "/sports/body-fat-percentage", icon: "🔥" },
        { title: "One-Rep Max (1RM) Calculator", url: "/sports/one-rep-max-1rm", icon: "🏋️" },
        { title: "Basketball eFG% & TS% Calculator", url: "/sports/basketball-efg-ts", icon: "⚽" },
        { title: "Soccer League Table: Points & GD", url: "/sports/soccer-league-table-points-gd", icon: "⚽" },
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