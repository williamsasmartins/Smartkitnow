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
  { label: "Lightly active (light exercise 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise 6-7 days/week)", value: 1.725 },
  { label: "Extra active (very hard exercise & physical job)", value: 1.9 },
];

const sportGoals = [
  { label: "Maintain Weight", proteinFactor: 1.2, carbFactor: 3.0, fatFactor: 1.0 },
  { label: "Muscle Gain", proteinFactor: 1.6, carbFactor: 4.5, fatFactor: 1.2 },
  { label: "Fat Loss", proteinFactor: 1.8, carbFactor: 2.0, fatFactor: 0.8 },
  { label: "Endurance Training", proteinFactor: 1.4, carbFactor: 5.5, fatFactor: 1.0 },
];

function roundToOneDecimal(num) {
  return Math.round(num * 10) / 10;
}

export default function MacronutrientCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    height: "",
    age: "",
    sex: "male",
    activityLevel: 1.55,
    goal: "Maintain Weight",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Basal Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
  // Male: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
  // Female: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
  // Then multiply by activity factor for Total Daily Energy Expenditure (TDEE)
  // Macronutrients calculated based on goal-specific factors (g/kg bodyweight)

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const height = parseFloat(inputs.height);
    const age = parseInt(inputs.age);
    const sex = inputs.sex;
    const activityLevel = parseFloat(inputs.activityLevel);
    const goal = inputs.goal;

    if (!weight || !height || !age || !sex || !activityLevel || !goal) {
      return { value: null, label: "", subtext: "", warning: null, formulaUsed: "" };
    }

    // Calculate BMR
    let bmr = 0;
    if (sex === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Total Daily Energy Expenditure (TDEE)
    const tdee = bmr * activityLevel;

    // Get macronutrient factors based on goal
    const goalObj = sportGoals.find((g) => g.label === goal);
    if (!goalObj) {
      return { value: null, label: "", subtext: "", warning: "Invalid goal selected", formulaUsed: "" };
    }

    // Protein, Carbs, Fat grams per day
    const proteinGrams = weight * goalObj.proteinFactor;
    const carbGrams = weight * goalObj.carbFactor;
    const fatGrams = weight * goalObj.fatFactor;

    // Calories from macros
    const proteinCalories = proteinGrams * 4;
    const carbCalories = carbGrams * 4;
    const fatCalories = fatGrams * 9;

    // Total calories from macros (may differ slightly from TDEE)
    const totalMacroCalories = proteinCalories + carbCalories + fatCalories;

    // Percentage of calories from each macro
    const proteinPercent = roundToOneDecimal((proteinCalories / totalMacroCalories) * 100);
    const carbPercent = roundToOneDecimal((carbCalories / totalMacroCalories) * 100);
    const fatPercent = roundToOneDecimal((fatCalories / totalMacroCalories) * 100);

    return {
      value: (
        <div className="space-y-4 text-left">
          <p className="text-lg font-semibold text-blue-900 dark:text-white">Total Daily Energy Expenditure (TDEE): <span className="font-extrabold">{Math.round(tdee)} kcal</span></p>
          <p className="text-lg font-semibold text-blue-900 dark:text-white">Macronutrient Targets:</p>
          <ul className="list-disc pl-5 space-y-1 text-blue-800 dark:text-blue-300">
            <li>Protein: <span className="font-bold">{roundToOneDecimal(proteinGrams)} g</span> ({proteinPercent}%)</li>
            <li>Carbohydrates: <span className="font-bold">{roundToOneDecimal(carbGrams)} g</span> ({carbPercent}%)</li>
            <li>Fats: <span className="font-bold">{roundToOneDecimal(fatGrams)} g</span> ({fatPercent}%)</li>
          </ul>
          <p className="italic text-sm text-slate-600 dark:text-slate-400">
            Note: Macronutrient grams are calculated per kilogram of body weight based on your selected goal and activity level.
          </p>
        </div>
      ),
      label: "Your Macronutrient Breakdown",
      subtext: "Calculated using Mifflin-St Jeor BMR and goal-specific macronutrient factors.",
      warning: null,
      formulaUsed:
        "BMR (Mifflin-St Jeor) × Activity Factor = TDEE; Protein, Carbs, Fat grams = Bodyweight (kg) × Goal-specific factors",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Why is protein intake important for athletes?",
      answer:
        "Protein is essential for muscle repair, recovery, and growth. Athletes require higher protein intake than sedentary individuals to support training adaptations and prevent muscle breakdown, especially during intense training or calorie deficits.",
    },
    {
      question: "How does carbohydrate intake affect performance?",
      answer:
        "Carbohydrates are the primary fuel source during high-intensity and endurance exercise. Adequate carbohydrate intake replenishes glycogen stores, delays fatigue, and enhances recovery, making it critical for sustained athletic performance.",
    },
    {
      question: "Can fat intake impact athletic performance?",
      answer:
        "Yes, fats provide a dense energy source and are vital for hormone production and cell function. While athletes need sufficient fats, excessive intake can displace carbohydrates, so balance is key depending on sport and goals.",
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
                <Scale className="w-4 h-4 text-blue-600" /> Weight (kg)
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
              <Label htmlFor="height" className="flex items-center gap-1">
                <Flag className="w-4 h-4 text-blue-600" /> Height (cm)
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
              <Label htmlFor="age" className="flex items-center gap-1">
                <Timer className="w-4 h-4 text-blue-600" /> Age (years)
              </Label>
              <Input
                id="age"
                type="number"
                min={10}
                max={100}
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="e.g. 25"
              />
            </div>
            <div>
              <Label htmlFor="sex" className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-blue-600" /> Sex
              </Label>
              <Select
                value={inputs.sex}
                onValueChange={(v) => handleInputChange("sex", v)}
                id="sex"
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
              <Label htmlFor="activityLevel" className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-blue-600" /> Activity Level
              </Label>
              <Select
                value={inputs.activityLevel}
                onValueChange={(v) => handleInputChange("activityLevel", v)}
                id="activityLevel"
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
                <Trophy className="w-4 h-4 text-blue-600" /> Goal
              </Label>
              <Select
                value={inputs.goal}
                onValueChange={(v) => handleInputChange("goal", v)}
                id="goal"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  {sportGoals.map(({ label }) => (
                    <SelectItem key={label} value={label}>
                      {label}
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
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Just triggers recalculation by updating state with current inputs
            setInputs((p) => ({ ...p }));
          }}
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
              activityLevel: 1.55,
              goal: "Maintain Weight",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">{results.value}</CardContent>
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
          Macronutrients — protein, carbohydrates, and fats — are the foundational building blocks of an athlete’s diet. Their precise balance is critical for optimizing performance, recovery, and body composition. This calculator uses scientifically validated formulas to estimate your basal metabolic rate (BMR) and total daily energy expenditure (TDEE), then tailors macronutrient targets based on your sport-specific goals and activity level. By personalizing intake, athletes can fuel training demands, support muscle repair, and maintain energy balance effectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Mifflin-St Jeor equation, recognized for its accuracy across diverse populations, estimates BMR by accounting for weight, height, age, and sex. Multiplying BMR by an activity factor reflects your daily energy needs considering training intensity and lifestyle. Macronutrient grams are then calculated per kilogram of body weight, adjusted for goals such as muscle gain, fat loss, or endurance performance, ensuring nutritional strategies align with physiological demands.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain your personalized macronutrient targets, input your current weight in kilograms, height in centimeters, age in years, and select your sex. Choose your typical activity level to reflect your daily exercise intensity and frequency. Finally, select your primary goal—whether maintaining weight, gaining muscle, losing fat, or training for endurance. Click “Calculate” to view your total daily energy expenditure and recommended grams of protein, carbohydrates, and fats.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your body metrics (weight, height, age, sex) accurately for precise BMR calculation.
          </li>
          <li>
            <strong>Step 2:</strong> Select your activity level based on your weekly training volume and intensity.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your sport-specific goal to tailor macronutrient distribution accordingly.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to generate your personalized macronutrient and calorie targets.
          </li>
          <li>
            <strong>Step 5:</strong> Use these targets to guide meal planning, fueling strategies, and recovery nutrition.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Training Tips & Strategy</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Consistency in meeting your macronutrient targets is crucial for athletic progress. Prioritize protein intake evenly across meals to maximize muscle protein synthesis and recovery. Carbohydrates should be timed around training sessions to optimize glycogen replenishment and performance. Healthy fats support hormonal balance and long-term energy, but should not displace carbohydrate needs in high-intensity sports. Hydration and micronutrient intake also play vital roles in overall performance and should complement your macronutrient strategy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Adjust your macronutrient intake based on training cycles, competition schedules, and body composition goals. For example, endurance athletes may increase carbohydrate intake during heavy training phases, while strength athletes might emphasize protein and moderate carbohydrates. Regularly reassess your nutrition plan in conjunction with performance metrics and recovery status to ensure optimal adaptation and avoid plateaus.
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

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For more information on training science and nutrition guidelines, consult the following authoritative sources:
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
              Global leader in sports medicine and exercise science research, providing evidence-based guidelines for athlete nutrition and training.
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
              Offers comprehensive resources on strength training, conditioning, and sports nutrition for athletes and coaches.
            </p>
          </li>
          <li>
            <a
              href="https://www.runnersworld.com/nutrition-weight-loss/a20803108/how-to-calculate-your-macros-for-running/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Runner's World - How to Calculate Your Macros for Running <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Practical guide on tailoring macronutrient intake to support endurance training and recovery.
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
          "BMR (Mifflin-St Jeor) = 10 × weight (kg) + 6.25 × height (cm) - 5 × age + (5 if male, -161 if female); TDEE = BMR × Activity Factor; Macronutrients (g) = Bodyweight (kg) × Goal-specific factor",
        variables: [
          { name: "weight", description: "Body weight in kilograms" },
          { name: "height", description: "Height in centimeters" },
          { name: "age", description: "Age in years" },
          { name: "sex", description: "Biological sex (male/female)" },
          { name: "activityLevel", description: "Activity multiplier based on training intensity" },
          { name: "goal", description: "Sport-specific nutrition goal" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 25-year-old male athlete weighing 75 kg, 180 cm tall, moderately active, aiming for muscle gain.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input weight (75 kg), height (180 cm), age (25), sex (male), activity level (Moderately active), and goal (Muscle Gain).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate BMR: 10×75 + 6.25×180 - 5×25 + 5 = 1755 kcal.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate TDEE: 1755 × 1.55 = 2710 kcal.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate macros: Protein = 75 × 1.6 = 120 g; Carbs = 75 × 4.5 = 338 g; Fats = 75 × 1.2 = 90 g.",
          },
          {
            label: "Step 5",
            explanation:
              "Use these targets to plan meals supporting muscle growth and recovery.",
          },
        ],
        result:
          "TDEE: ~2710 kcal; Protein: 120 g; Carbohydrates: 338 g; Fats: 90 g.",
      }}
      relatedCalculators={[
        { title: "Tennis Serve Speed Calculator", url: "/sports/tennis-serve-speed", icon: "⚽" },
        { title: "Basketball Pace & ORtg/DRtg", url: "/sports/basketball-pace-ortg-drtg", icon: "🏃" },
        { title: "Golf Handicap Calculator", url: "/sports/golf-handicap-calculator", icon: "⛳" },
        { title: "Running Pace / Split / Finish Time Calculator", url: "/sports/running-pace-split-finish-time", icon: "🏃" },
        { title: "Tennis ELO / Rating Progress", url: "/sports/tennis-elo-rating-progress", icon: "⚽" },
        { title: "Tournament Bracket Seeding Helper", url: "/sports/tournament-bracket-seeding-helper", icon: "🏆" },
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