import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (light exercise/sports 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise/sports 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise/sports 6-7 days a week)", value: 1.725 },
  { label: "Extra active (very hard exercise/sports & physical job or 2x training)", value: 1.9 },
];

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other / Prefer not to say", value: "other" },
];

export default function MyplateDailyCalorieNutrientCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    goal: "maintain",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
  // Then adjust for activity level to get Total Daily Energy Expenditure (TDEE)
  // Then adjust for goal (lose, maintain, gain weight)
  // Then calculate MyPlate nutrient distribution based on USDA guidelines

  const results = useMemo(() => {
    const age = Number(inputs.age);
    const height = Number(inputs.height);
    const weight = Number(inputs.weight);
    const activityFactor = Number(inputs.activityLevel);
    const gender = inputs.gender;
    const goal = inputs.goal;

    if (
      !age ||
      age < 10 ||
      age > 120 ||
      !height ||
      height < 50 ||
      height > 250 ||
      !weight ||
      weight < 20 ||
      weight > 500 ||
      !activityFactor ||
      !gender
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid inputs for all fields.",
        formulaUsed: null,
        nutrients: null,
      };
    }

    // BMR calculation (Mifflin-St Jeor)
    // Male: BMR = 10*weight + 6.25*height - 5*age + 5
    // Female: BMR = 10*weight + 6.25*height - 5*age - 161
    // Other: average of male and female formulas
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === "female") {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      // average of male and female
      const maleBmr = 10 * weight + 6.25 * height - 5 * age + 5;
      const femaleBmr = 10 * weight + 6.25 * height - 5 * age - 161;
      bmr = (maleBmr + femaleBmr) / 2;
    }

    // Total Daily Energy Expenditure (TDEE)
    const tdee = bmr * activityFactor;

    // Adjust for goal
    // lose: -20% calories, maintain: no change, gain: +15% calories
    let adjustedCalories = tdee;
    if (goal === "lose") {
      adjustedCalories = tdee * 0.8;
    } else if (goal === "gain") {
      adjustedCalories = tdee * 1.15;
    }

    // Macronutrient distribution based on MyPlate and USDA guidelines:
    // Protein: 10-35% calories, Carbs: 45-65%, Fat: 20-35%
    // We'll use a balanced moderate approach:
    // Protein: 20%, Carbs: 50%, Fat: 30%
    // 1 gram protein = 4 kcal, 1 gram carb = 4 kcal, 1 gram fat = 9 kcal

    const proteinCalories = adjustedCalories * 0.20;
    const carbCalories = adjustedCalories * 0.50;
    const fatCalories = adjustedCalories * 0.30;

    const proteinGrams = proteinCalories / 4;
    const carbGrams = carbCalories / 4;
    const fatGrams = fatCalories / 9;

    // MyPlate daily servings recommendations (approximate, based on USDA):
    // Vegetables: 2.5 cups
    // Fruits: 2 cups
    // Grains: 6 ounces (half whole grains)
    // Protein foods: 5.5 ounces
    // Dairy: 3 cups

    // We can estimate calories per serving:
    // Vegetables: ~25 kcal/cup
    // Fruits: ~60 kcal/cup
    // Grains: ~80 kcal/ounce
    // Protein foods: ~50 kcal/ounce
    // Dairy: ~120 kcal/cup

    // Calculate calories from servings:
    const vegCalories = 2.5 * 25;
    const fruitCalories = 2 * 60;
    const grainCalories = 6 * 80;
    const proteinFoodCalories = 5.5 * 50;
    const dairyCalories = 3 * 120;

    // Sum calories from MyPlate servings
    const myPlateCalories =
      vegCalories + fruitCalories + grainCalories + proteinFoodCalories + dairyCalories;

    // Compare MyPlate calories to adjustedCalories to show balance
    // Provide notes if calories differ significantly

    let calorieNote = "";
    if (myPlateCalories > adjustedCalories * 1.1) {
      calorieNote =
        "The standard MyPlate servings slightly exceed your calorie needs. Consider adjusting portion sizes accordingly.";
    } else if (myPlateCalories < adjustedCalories * 0.9) {
      calorieNote =
        "The standard MyPlate servings are slightly below your calorie needs. You may want to increase portions or add healthy snacks.";
    } else {
      calorieNote = "The standard MyPlate servings align well with your calorie needs.";
    }

    return {
      value: `${Math.round(adjustedCalories)} kcal/day`,
      label: "Estimated Daily Calorie Needs",
      subtext: calorieNote,
      warning: null,
      formulaUsed:
        "BMR calculated using Mifflin-St Jeor Equation, adjusted by activity level and goal to estimate Total Daily Energy Expenditure (TDEE). Macronutrients distributed as Protein 20%, Carbs 50%, Fat 30%.",
      nutrients: {
        proteinGrams: proteinGrams.toFixed(1),
        carbGrams: carbGrams.toFixed(1),
        fatGrams: fatGrams.toFixed(1),
        myPlateServings: {
          vegetables: 2.5,
          fruits: 2,
          grains: 6,
          proteinFoods: 5.5,
          dairy: 3,
        },
      },
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the MyPlate Daily Calorie/Nutrient Planner and why is it important?",
      answer:
        "The MyPlate Daily Calorie/Nutrient Planner is a comprehensive tool designed to help individuals estimate their daily calorie needs and plan balanced meals according to USDA MyPlate guidelines. It integrates personal factors like age, gender, weight, height, and activity level to provide tailored calorie and macronutrient recommendations. This planner is important because it promotes a balanced diet, supports healthy weight management, and encourages nutrient-rich food choices aligned with national dietary standards.",
    },
    {
      question: "How does the calculator determine my daily calorie needs?",
      answer:
        "The calculator uses the Mifflin-St Jeor Equation to estimate your Basal Metabolic Rate (BMR), which is the number of calories your body needs at rest to maintain vital functions. It then multiplies the BMR by an activity factor based on your reported physical activity level to calculate your Total Daily Energy Expenditure (TDEE). Finally, it adjusts this value depending on your goal—whether to lose, maintain, or gain weight—to provide a personalized daily calorie target.",
    },
    {
      question: "Why does the calculator use specific macronutrient percentages?",
      answer:
        "The macronutrient distribution of 20% protein, 50% carbohydrates, and 30% fat is based on balanced dietary recommendations consistent with MyPlate and USDA guidelines. This ratio supports sustained energy, muscle maintenance, and overall health. Protein is essential for tissue repair, carbohydrates provide energy, and fats support hormone production and nutrient absorption. The calculator uses these percentages to translate calorie needs into practical gram-based targets for each macronutrient.",
    },
    {
      question: "Can I use this planner if I have special dietary needs or medical conditions?",
      answer:
        "While this planner provides general guidance based on widely accepted nutritional standards, it may not account for specific dietary restrictions, allergies, or medical conditions such as diabetes, kidney disease, or food intolerances. Individuals with special dietary needs should consult a registered dietitian or healthcare professional to tailor nutrition plans that safely meet their unique requirements.",
    },
    {
      question: "How can I apply the MyPlate servings recommendations in my daily meals?",
      answer:
        "The MyPlate servings recommendations suggest daily amounts of vegetables, fruits, grains, protein foods, and dairy to promote balanced nutrition. To apply these, aim to fill half your plate with fruits and vegetables, choose whole grains for at least half your grain intake, include lean protein sources, and incorporate low-fat or fat-free dairy products. Using measuring cups or food scales can help ensure portion accuracy, and varying food choices within each group enhances nutrient diversity.",
    },
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              min={10}
              max={120}
              placeholder="e.g. 30"
              value={inputs.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              onValueChange={(v) => handleInputChange("gender", v)}
              value={inputs.gender}
              id="gender"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {genderOptions.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              min={50}
              max={250}
              placeholder="e.g. 170"
              value={inputs.height}
              onChange={(e) => handleInputChange("height", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              min={20}
              max={500}
              placeholder="e.g. 70"
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select
              onValueChange={(v) => handleInputChange("activityLevel", v)}
              value={inputs.activityLevel}
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
            <Label htmlFor="goal">Goal</Label>
            <Select
              onValueChange={(v) => handleInputChange("goal", v)}
              value={inputs.goal}
              id="goal"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
                <SelectItem value="gain">Gain Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No explicit calculation trigger needed as useMemo updates automatically
            // But we can force validation or focus if needed
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              age: "",
              gender: "",
              height: "",
              weight: "",
              activityLevel: "",
              goal: "maintain",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-700 border p-4 mt-4">
          <CardContent>
            <p className="text-red-800 dark:text-red-300 font-semibold">{results.warning}</p>
          </CardContent>
        </Card>
      )}

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg mt-6">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">{results.subtext}</p>

            <div className="mt-8 text-left max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">Macronutrient Breakdown</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                <li>Protein: {results.nutrients.proteinGrams} grams/day</li>
                <li>Carbohydrates: {results.nutrients.carbGrams} grams/day</li>
                <li>Fat: {results.nutrients.fatGrams} grams/day</li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-slate-100">MyPlate Daily Servings</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                <li>Vegetables: {results.nutrients.myPlateServings.vegetables} cups</li>
                <li>Fruits: {results.nutrients.myPlateServings.fruits} cups</li>
                <li>Grains: {results.nutrients.myPlateServings.grains} ounces (at least half whole grains)</li>
                <li>Protein Foods: {results.nutrients.myPlateServings.proteinFoods} ounces</li>
                <li>Dairy: {results.nutrients.myPlateServings.dairy} cups</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Understanding the Basics</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The MyPlate Daily Calorie/Nutrient Planner is a scientifically grounded tool designed to help individuals understand and manage their daily nutritional needs. It integrates personal data such as age, gender, height, weight, and physical activity level to estimate your basal metabolic rate (BMR) — the number of calories your body requires at rest. This foundational metric is then adjusted to account for your lifestyle and fitness goals, providing a tailored estimate of your total daily energy expenditure (TDEE).
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Beyond calorie estimation, this planner breaks down your daily nutritional requirements into macronutrients — proteins, carbohydrates, and fats — following balanced dietary guidelines consistent with the USDA's MyPlate recommendations. It also translates these needs into practical daily servings of food groups, including vegetables, fruits, grains, protein foods, and dairy, empowering you to make informed, healthful food choices that support your well-being and lifestyle.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the MyPlate Daily Calorie/Nutrient Planner is straightforward and intuitive. By entering your personal details and lifestyle information, the calculator provides a comprehensive overview of your daily calorie needs and nutrient targets. Follow these detailed steps to get the most accurate and useful results:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your <em>age</em> in years. This helps determine your metabolic rate as metabolism changes with age.
          </li>
          <li>
            <strong>Step 2:</strong> Select your <em>gender</em>. This affects the basal metabolic rate calculation since males and females have different average body compositions.
          </li>
          <li>
            <strong>Step 3:</strong> Input your <em>height</em> in centimeters. Height influences your basal metabolic rate and overall energy needs.
          </li>
          <li>
            <strong>Step 4:</strong> Input your <em>weight</em> in kilograms. Weight is a critical factor in calculating your calorie requirements.
          </li>
          <li>
            <strong>Step 5:</strong> Choose your <em>activity level</em> from the dropdown. This reflects how active you are daily, adjusting calorie needs accordingly.
          </li>
          <li>
            <strong>Step 6:</strong> Select your <em>goal</em> — whether you want to lose, maintain, or gain weight. The calculator adjusts calorie targets based on this.
          </li>
          <li>
            <strong>Step 7:</strong> Click the <em>Calculate</em> button to view your personalized daily calorie needs, macronutrient breakdown, and MyPlate servings recommendations.
          </li>
          <li>
            <strong>Step 8:</strong> Use the detailed nutrient and serving information to plan balanced meals that align with your health goals.
          </li>
          <li>
            <strong>Step 9:</strong> If needed, click <em>Reset</em> to clear all inputs and start a new calculation.
          </li>
        </ul>
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
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="MyPlate Daily Calorie/Nutrient Planner"
      description="Plan balanced meals with MyPlate guidelines. Calculate daily calorie and nutrient portions for a healthy lifestyle."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + gender constant (5 for males, -161 for females). " +
          "TDEE = BMR × Activity Factor. Adjusted Calories = TDEE × Goal Factor (0.8 for weight loss, 1.0 for maintenance, 1.15 for gain). " +
          "Macronutrients: Protein 20%, Carbs 50%, Fat 30% of total calories.",
        variables: [
          { name: "weight", description: "Body weight in kilograms" },
          { name: "height", description: "Height in centimeters" },
          { name: "age", description: "Age in years" },
          { name: "gender constant", description: "5 for males, -161 for females" },
          { name: "Activity Factor", description: "Multiplier based on physical activity level" },
          { name: "Goal Factor", description: "0.8 for weight loss, 1.0 for maintenance, 1.15 for gain" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Consider a 30-year-old female who is 165 cm tall, weighs 65 kg, and is moderately active (exercises 3-5 days a week). She wants to maintain her current weight.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Input age as 30, gender as female, height as 165 cm, weight as 65 kg, and select 'Moderately active' for activity level.",
          },
          {
            label: "Step 2",
            explanation:
              "Choose the goal 'Maintain Weight' and click Calculate. The calculator computes her BMR using the Mifflin-St Jeor equation, then multiplies by the activity factor (1.55) to get TDEE.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator then distributes her calorie needs into macronutrients: 20% protein, 50% carbohydrates, and 30% fat, and provides MyPlate servings recommendations.",
          },
        ],
        result:
          "The result shows she needs approximately 2,100 kcal/day, with about 105g protein, 263g carbs, and 70g fat daily, alongside recommended servings of vegetables, fruits, grains, protein foods, and dairy to meet these needs.",
      }}
      relatedCalculators={[
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "❤️" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday-life/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday-life/water-heater-recovery-time", icon: "💧" },
        { title: "Square Footage Calculator", url: "/everyday-life/square-footage-calculator", icon: "💡" },
        { title: "Ice Quantity for Beverages Calculator", url: "/everyday-life/ice-quantity-beverages", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday-life/event-budget-calculator", icon: "🎉" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}