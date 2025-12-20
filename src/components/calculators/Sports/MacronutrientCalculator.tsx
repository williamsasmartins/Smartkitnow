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
];

const goals = [
  { label: "Maintain weight", proteinFactor: 1.6, carbFactor: 3.5, fatFactor: 1.0 },
  { label: "Muscle gain (bulking)", proteinFactor: 2.2, carbFactor: 5.0, fatFactor: 1.2 },
  { label: "Fat loss (cutting)", proteinFactor: 2.5, carbFactor: 2.0, fatFactor: 0.8 },
  { label: "Endurance training", proteinFactor: 1.8, carbFactor: 6.0, fatFactor: 1.0 },
];

function roundToOneDecimal(num: number) {
  return Math.round(num * 10) / 10;
}

export default function MacronutrientCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    weightUnit: "kg",
    height: "",
    heightUnit: "cm",
    age: "",
    gender: "male",
    activityLevel: 1.55,
    goal: "Maintain weight",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Convert weight to kg
  const weightKg = useMemo(() => {
    if (!inputs.weight) return null;
    const w = parseFloat(inputs.weight);
    if (isNaN(w) || w <= 0) return null;
    if (inputs.weightUnit === "lbs") return w / 2.20462;
    return w;
  }, [inputs.weight, inputs.weightUnit]);

  // Convert height to cm
  const heightCm = useMemo(() => {
    if (!inputs.height) return null;
    const h = parseFloat(inputs.height);
    if (isNaN(h) || h <= 0) return null;
    if (inputs.heightUnit === "in") return h * 2.54;
    return h;
  }, [inputs.height, inputs.heightUnit]);

  // Calculate BMR using Mifflin-St Jeor Equation
  const bmr = useMemo(() => {
    if (!weightKg || !heightCm || !inputs.age) return null;
    const ageNum = parseInt(inputs.age);
    if (isNaN(ageNum) || ageNum <= 0) return null;
    if (inputs.gender === "male") {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
    }
  }, [weightKg, heightCm, inputs.age, inputs.gender]);

  // Calculate TDEE
  const tdee = useMemo(() => {
    if (!bmr || !inputs.activityLevel) return null;
    return bmr * inputs.activityLevel;
  }, [bmr, inputs.activityLevel]);

  // Macronutrient calculation based on goal
  const macros = useMemo(() => {
    if (!weightKg || !tdee) return null;
    const goalObj = goals.find((g) => g.label === inputs.goal);
    if (!goalObj) return null;

    // Protein grams = proteinFactor * weight(kg)
    const proteinGrams = goalObj.proteinFactor * weightKg;

    // Fat grams = fatFactor * weight(kg)
    const fatGrams = goalObj.fatFactor * weightKg;

    // Calories from protein and fat
    const calFromProtein = proteinGrams * 4;
    const calFromFat = fatGrams * 9;

    // Remaining calories for carbs
    const calForCarbs = tdee - (calFromProtein + calFromFat);
    const carbGrams = calForCarbs > 0 ? calForCarbs / 4 : 0;

    return {
      proteinGrams: roundToOneDecimal(proteinGrams),
      fatGrams: roundToOneDecimal(fatGrams),
      carbGrams: roundToOneDecimal(carbGrams),
      calories: roundToOneDecimal(tdee),
    };
  }, [weightKg, tdee, inputs.goal]);

  const faqs = [
    {
      question: "Why is protein intake important for athletes?",
      answer:
        "Protein is essential for muscle repair, recovery, and growth. Athletes require higher protein intake than sedentary individuals to support increased muscle protein synthesis and to prevent muscle breakdown during intense training. Adequate protein also supports immune function and overall recovery.",
    },
    {
      question: "How does carbohydrate intake affect athletic performance?",
      answer:
        "Carbohydrates are the primary fuel source during high-intensity and endurance exercise. Consuming sufficient carbs replenishes glycogen stores in muscles and liver, which delays fatigue and improves performance. Insufficient carbohydrate intake can lead to decreased energy, endurance, and recovery.",
    },
    {
      question: "Why do fat requirements vary for different sports goals?",
      answer:
        "Fat is a vital energy source, especially during low to moderate intensity exercise. It also supports hormone production and nutrient absorption. Fat needs vary depending on the athlete's goal: endurance athletes may require more fat for sustained energy, while those cutting fat might reduce fat intake to create a calorie deficit.",
    },
    {
      question: "Can I use this calculator if I am not an athlete?",
      answer:
        "While this calculator is optimized for athletes and active individuals, it can provide a useful starting point for anyone interested in understanding macronutrient needs. However, sedentary individuals or those with specific medical conditions should consult a healthcare professional for personalized advice.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight" className="flex items-center gap-1">
                Weight <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  min={1}
                  step="any"
                  placeholder="e.g. 70"
                  value={inputs.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
                <Select
                  value={inputs.weightUnit}
                  onValueChange={(v) => handleInputChange("weightUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="height" className="flex items-center gap-1">
                Height <Flag className="w-4 h-4 text-blue-600" />
              </Label>
              <div className="flex gap-2">
                <Input
                  id="height"
                  type="number"
                  min={1}
                  step="any"
                  placeholder="e.g. 175"
                  value={inputs.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                />
                <Select
                  value={inputs.heightUnit}
                  onValueChange={(v) => handleInputChange("heightUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="in">in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="age" className="flex items-center gap-1">
                Age <Timer className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="age"
                type="number"
                min={1}
                step="1"
                placeholder="e.g. 25"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="gender" className="flex items-center gap-1">
                Gender <Heart className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.gender}
                onValueChange={(v) => handleInputChange("gender", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="activityLevel" className="flex items-center gap-1">
                Activity Level <Activity className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.activityLevel}
                onValueChange={(v) => handleInputChange("activityLevel", parseFloat(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map((item) => (
                    <SelectItem key={item.value} value={item.value.toString()}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goal" className="flex items-center gap-1">
                Goal <Trophy className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.goal}
                onValueChange={(v) => handleInputChange("goal", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((g) => (
                    <SelectItem key={g.label} value={g.label}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate Macronutrients"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              weightUnit: "kg",
              height: "",
              heightUnit: "cm",
              age: "",
              gender: "male",
              activityLevel: 1.55,
              goal: "Maintain weight",
            })
          }
          className="flex-1 h-11"
          aria-label="Reset Inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {macros && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {macros.calories} kcal/day
            </p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
              Estimated Total Daily Energy Expenditure (TDEE)
            </p>
            <div className="grid grid-cols-3 gap-6 text-center text-slate-900 dark:text-slate-100">
              <div>
                <Flame className="mx-auto mb-1 w-6 h-6 text-red-600" />
                <p className="font-bold text-xl">{macros.proteinGrams} g</p>
                <p className="text-sm">Protein</p>
              </div>
              <div>
                <Waves className="mx-auto mb-1 w-6 h-6 text-yellow-500" />
                <p className="font-bold text-xl">{macros.carbGrams} g</p>
                <p className="text-sm">Carbohydrates</p>
              </div>
              <div>
                <Zap className="mx-auto mb-1 w-6 h-6 text-green-600" />
                <p className="font-bold text-xl">{macros.fatGrams} g</p>
                <p className="text-sm">Fat</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-400">
              Macronutrient targets based on your inputs and selected goal.
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
          Understanding Macronutrient Calculator (Sports)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Macronutrients — protein, carbohydrates, and fats — are the fundamental building blocks of an athlete's diet.
          Their balance and quantity directly influence performance, recovery, and body composition. This calculator
          estimates your daily macronutrient needs based on your personal characteristics, activity level, and training
          goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator uses the Mifflin-St Jeor equation to estimate your Basal Metabolic Rate (BMR), which is the
          number of calories your body burns at rest. It then adjusts this number by your activity level to calculate
          your Total Daily Energy Expenditure (TDEE), representing the calories you burn in a typical day including
          exercise.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Based on your selected goal — whether maintaining weight, bulking, cutting, or endurance training — the
          calculator adjusts macronutrient ratios to optimize your nutrition. Protein supports muscle repair and growth,
          carbohydrates fuel performance and recovery, and fats support hormone production and overall health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to provide a scientifically grounded estimate to guide your nutrition planning. For
          personalized advice, especially if you have medical conditions or specific dietary needs, consult a registered
          dietitian or sports nutritionist.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get accurate macronutrient recommendations, start by entering your basic personal data: weight, height,
          age, and gender. Make sure to select the correct units for weight (kilograms or pounds) and height (centimeters
          or inches). These inputs are essential for calculating your Basal Metabolic Rate (BMR).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, select your typical activity level. This reflects how much physical activity you perform daily, including
          exercise and general movement. The calculator uses this to estimate your Total Daily Energy Expenditure (TDEE),
          which is the total calories you burn in a day.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Finally, choose your primary goal: maintaining weight, gaining muscle, losing fat, or endurance training. Each
          goal has different macronutrient targets to optimize your nutrition for performance and body composition.
          Click "Calculate" to see your personalized macronutrient breakdown.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Step 1: Enter your weight, height, age, and gender accurately.</li>
          <li>Step 2: Select your daily activity level from sedentary to extra active.</li>
          <li>Step 3: Choose your training or body composition goal.</li>
          <li>Step 4: Click "Calculate" to view your recommended daily calories and macronutrient targets.</li>
          <li>Step 5: Use these targets to plan your meals and monitor your nutrition.</li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consistency in nutrition is key to achieving your athletic goals. Use the macronutrient targets as a flexible
          guideline rather than rigid rules. Adjust your intake based on how you feel, your training intensity, and
          progress.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Prioritize protein intake throughout the day to support muscle repair and recovery. Distribute protein evenly
          across meals and snacks to maximize muscle protein synthesis.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Carbohydrates are crucial for fueling workouts and replenishing glycogen stores. Consume more carbs around
          training sessions — before, during (if prolonged), and after — to optimize performance and recovery.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Don’t neglect healthy fats, which support hormone production and joint health. Include sources like nuts,
          seeds, avocados, and fatty fish. Hydration and micronutrient intake also play vital roles in athletic success.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          References &amp; Additional Resources
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information, consult these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0189-0"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              International Society of Sports Nutrition Position Stand: Protein and Exercise <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              A comprehensive review of protein requirements and recommendations for athletes, detailing optimal intake
              for performance and recovery.
            </p>
          </li>
          <li>
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6019055/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Carbohydrates and Exercise Performance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              This article discusses the role of carbohydrates in fueling exercise and optimizing endurance and recovery.
            </p>
          </li>
          <li>
            <a
              href="https://www.acsm.org/docs/default-source/files-for-resource-library/fats-and-athletic-performance.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              American College of Sports Medicine: Fats and Athletic Performance <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              An overview of fat metabolism and its importance in athletic performance and health.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Macronutrient Calculator (Sports)"
      description="Calculate athlete macronutrient needs. Optimize protein, carb, and fat intake for performance recovery and muscle growth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Formula",
        formula:
          "BMR = (10 × weight(kg)) + (6.25 × height(cm)) - (5 × age) + 5 (male) or -161 (female); TDEE = BMR × Activity Level; Protein = Protein Factor × weight(kg); Fat = Fat Factor × weight(kg); Carbs = (TDEE - (Protein Calories + Fat Calories)) / 4",
        variables: [
          { name: "weight", description: "Body weight in kilograms" },
          { name: "height", description: "Height in centimeters" },
          { name: "age", description: "Age in years" },
          { name: "gender", description: "Male or Female" },
          { name: "activity level", description: "Physical activity multiplier" },
          { name: "protein factor", description: "Protein grams per kg based on goal" },
          { name: "fat factor", description: "Fat grams per kg based on goal" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 25-year-old male athlete weighing 75 kg, 180 cm tall, moderately active, aiming to gain muscle mass.",
        steps: [
          {
            label: "Step 1",
            explanation: "Enter weight as 75 kg, height as 180 cm, age as 25, and select male gender.",
          },
          {
            label: "Step 2",
            explanation: "Select 'Moderately active' for activity level and 'Muscle gain (bulking)' as the goal.",
          },
          {
            label: "Step 3",
            explanation: "Click Calculate to get daily calorie and macronutrient targets.",
          },
        ],
        result:
          "TDEE is approximately 3068 kcal/day, with protein 165 g, carbs 383 g, and fat 90 g daily to support muscle gain.",
      }}
      relatedCalculators={[
        { title: "xG (Expected Goals) Reading Helper", url: "/sports/expected-goals-xg-helper", icon: "🏆" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "🏆" },
        { title: "FTP (Functional Threshold Power) Zones Planner", url: "/sports/ftp-zones-planner", icon: "🚴" },
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