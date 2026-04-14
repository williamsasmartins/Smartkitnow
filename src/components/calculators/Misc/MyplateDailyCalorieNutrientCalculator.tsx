import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const activityLevels = [
  { label: "Sedentary (little or no exercise)", value: 1.2 },
  { label: "Lightly active (light exercise/sports 1-3 days/week)", value: 1.375 },
  { label: "Moderately active (moderate exercise/sports 3-5 days/week)", value: 1.55 },
  { label: "Very active (hard exercise/sports 6-7 days a week)", value: 1.725 },
  { label: "Extra active (very hard exercise & physical job or 2x training)", value: 1.9 },
];

const genders = [
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Other/Non-binary", value: "other" },
];

export default function MyplateDailyCalorieNutrientCalculator() {
  const [inputs, setInputs] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation:
   * For men: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age + 5
   * For women: BMR = 10*weight(kg) + 6.25*height(cm) - 5*age - 161
   * For other/non-binary: average of male and female BMR
   */
  const results = useMemo(() => {
    const age = Number(inputs.age);
    const height = Number(inputs.height);
    const weight = Number(inputs.weight);
    const gender = inputs.gender;
    const activityFactor = Number(inputs.activityLevel);

    if (!age || !height || !weight || !gender || !activityFactor) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please fill in all fields with valid values.",
        formulaUsed: "",
      };
    }

    if (age < 18 || age > 120) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Age should be between 18 and 120 years for accurate results.",
        formulaUsed: "",
      };
    }

    if (height < 100 || height > 250) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Height should be between 100 cm and 250 cm.",
        formulaUsed: "",
      };
    }

    if (weight < 30 || weight > 300) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Weight should be between 30 kg and 300 kg.",
        formulaUsed: "",
      };
    }

    const bmrMale = 10 * weight + 6.25 * height - 5 * age + 5;
    const bmrFemale = 10 * weight + 6.25 * height - 5 * age - 161;
    let bmr = 0;

    if (gender === "male") {
      bmr = bmrMale;
    } else if (gender === "female") {
      bmr = bmrFemale;
    } else {
      bmr = (bmrMale + bmrFemale) / 2;
    }

    // Total Daily Energy Expenditure (TDEE)
    const tdee = bmr * activityFactor;

    // Macronutrient distribution based on MyPlate and USDA guidelines:
    // Protein: 10-35% of calories, Carbs: 45-65%, Fat: 20-35%
    // We'll use moderate values: Protein 20%, Carbs 50%, Fat 30%
    const proteinCalories = tdee * 0.20;
    const carbCalories = tdee * 0.50;
    const fatCalories = tdee * 0.30;

    // Convert calories to grams:
    // Protein and carbs = 4 kcal/g, fat = 9 kcal/g
    const proteinGrams = proteinCalories / 4;
    const carbGrams = carbCalories / 4;
    const fatGrams = fatCalories / 9;

    // MyPlate daily recommended servings roughly:
    // Vegetables: 2.5 cups, Fruits: 2 cups, Grains: 6 oz, Protein foods: 5.5 oz, Dairy: 3 cups
    // We'll scale servings based on calorie needs (2000 kcal baseline)
    const calorieBaseline = 2000;
    const scaleFactor = tdee / calorieBaseline;

    const servings = {
      vegetables: (2.5 * scaleFactor).toFixed(1),
      fruits: (2 * scaleFactor).toFixed(1),
      grains: (6 * scaleFactor).toFixed(1),
      proteinFoods: (5.5 * scaleFactor).toFixed(1),
      dairy: (3 * scaleFactor).toFixed(1),
    };

    return {
      value: Math.round(tdee),
      label: "Estimated Daily Calorie Needs (kcal)",
      subtext: `Based on your inputs, you need approximately ${Math.round(tdee)} calories daily to maintain your current weight. Macronutrient distribution: Protein ${proteinGrams.toFixed(
        1
      )}g, Carbs ${carbGrams.toFixed(1)}g, Fat ${fatGrams.toFixed(1)}g. Recommended MyPlate servings scaled to your calorie needs: Vegetables ${servings.vegetables} cups, Fruits ${servings.fruits} cups, Grains ${servings.grains} oz, Protein foods ${servings.proteinFoods} oz, Dairy ${servings.dairy} cups.`,
      warning: null,
      formulaUsed:
        "BMR calculated using Mifflin-St Jeor Equation; TDEE = BMR × Activity Factor; Macronutrients based on USDA MyPlate guidelines.",
      servings,
      macros: {
        proteinGrams: proteinGrams.toFixed(1),
        carbGrams: carbGrams.toFixed(1),
        fatGrams: fatGrams.toFixed(1),
      },
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the MyPlate Daily Calorie/Nutrient Planner?",
      answer: "This calculator estimates your daily calorie needs and recommended nutrient intake based on USDA MyPlate guidelines. It uses your age, sex, weight, height, and activity level to personalize recommendations.",
    },
    {
      question: "How does the calculator determine my daily calorie needs?",
      answer: "It applies the Mifflin-St Jeor equation to calculate your basal metabolic rate, then multiplies by your activity factor (sedentary, moderate, or active) to estimate total daily energy expenditure.",
    },
    {
      question: "What nutrients does MyPlate include in its recommendations?",
      answer: "MyPlate provides guidance on calories, protein, carbohydrates, fiber, fat, sodium, and key vitamins and minerals like iron, calcium, and vitamin D based on USDA dietary guidelines.",
    },
    {
      question: "Can I use this calculator if I'm pregnant or breastfeeding?",
      answer: "No, this standard calculator doesn't account for pregnancy or lactation; consult a healthcare provider for personalized recommendations during these periods.",
    },
    {
      question: "How often should I update my information in this calculator?",
      answer: "Recalculate every 3-6 months if your weight, activity level, or age changes significantly to keep recommendations accurate.",
    },
    {
      question: "Does the MyPlate calculator work for children?",
      answer: "While some versions include children's data, pediatric recommendations differ significantly; consult a pediatrician or registered dietitian for children under 18.",
    },
    {
      question: "What if my calculated needs seem too high or too low?",
      answer: "Individual metabolism varies; if results seem off, monitor your weight for 2-3 weeks and adjust intake by 200-300 calories as needed, or consult a registered dietitian.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                min={18}
                max={120}
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="e.g., 30"
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
                  {genders.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
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
                min={100}
                max={250}
                value={inputs.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="e.g., 170"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min={30}
                max={300}
                value={inputs.weight}
                onChange={(e) => handleInputChange("weight", e.target.value)}
                placeholder="e.g., 70"
              />
            </div>
            <div className="sm:col-span-2">
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
                  {activityLevels.map((a) => (
                    <SelectItem key={a.value} value={a.value.toString()}>
                      {a.label}
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
            // No special action needed, results update automatically
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ age: "", gender: "", height: "", weight: "", activityLevel: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 text-red-800">
          <CardContent className="p-4 text-center font-semibold">
            <AlertTriangle className="inline-block mr-2 h-5 w-5 align-middle" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} kcal</p>
            <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{results.subtext}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the MyPlate Daily Calorie/Nutrient Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The MyPlate Daily Calorie/Nutrient Planner calculates your personalized daily calorie goal and recommended nutrient intake based on USDA MyPlate guidelines. It translates general nutrition science into actionable, individualized targets for your specific body and lifestyle.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your age, biological sex, current weight, height, and activity level (sedentary, lightly active, moderately active, very active, or extremely active). The calculator uses these inputs to estimate your basal metabolic rate and total daily energy expenditure.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review your personalized calorie goal and nutrient targets (protein, carbohydrates, fiber, fat, sodium, and micronutrients). Use these numbers as a reference when meal planning, grocery shopping, and tracking food intake to stay aligned with healthy nutrition goals.</p>
        </div>
      </section>

      {/* TABLE: Daily Calorie Needs by Activity Level (Adult Female, 30 years, 5'5", 140 lbs) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Needs by Activity Level (Adult Female, 30 years, 5'5", 140 lbs)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated daily calorie requirements vary based on physical activity patterns.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Daily Calories</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Little or no exercise</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800-2,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lightly Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 1-3 days/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,050-2,250</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderately Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 3-5 days/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,300-2,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise 6-7 days/week</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,550-2,800</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extremely Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Athletic training daily</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,850-3,100</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations use Mifflin-St Jeor equation; individual needs vary by metabolism.</p>
      </section>

      {/* TABLE: MyPlate Daily Nutrient Recommendations (Adult Female, 2,000 calories) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">MyPlate Daily Nutrient Recommendations (Adult Female, 2,000 calories)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">USDA guidelines for essential macronutrients and micronutrients at a 2,000-calorie intake level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nutrient</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Target</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Source Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Protein</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60g (10-12% calories)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poultry, beans, nuts, yogurt</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Carbohydrates</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225-325g (45-65% calories)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Whole grains, fruits, vegetables</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dietary Fiber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Oats, beans, berries, vegetables</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44-78g (20-35% calories)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Olive oil, avocados, fish</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sodium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;2,300mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Limit processed foods, salt</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Calcium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dairy, leafy greens, fortified foods</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Iron</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Red meat, spinach, fortified cereals</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Recommendations follow 2020-2025 USDA Dietary Guidelines for Americans.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your current weight accurately on a digital scale to ensure your calorie and nutrient recommendations are based on your true body composition.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Select the activity level that matches your typical week—be honest about exercise frequency to avoid overestimating or underestimating calorie needs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use your nutrient targets as ranges rather than rigid limits; aim to stay within 10% above or below the recommendation for macronutrients.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pair this calculator with a food tracking app to monitor actual nutrient intake and compare it against your personalized MyPlate recommendations.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Activity Level</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Choosing a higher activity level than your actual routine inflates calorie recommendations, leading to unintended weight gain.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Micronutrient Targets</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Focusing only on calories while neglecting fiber, sodium, and minerals misses key health markers that MyPlate emphasizes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated Personal Data</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Plugging in old weight or activity information produces inaccurate recommendations that don't reflect your current lifestyle.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying Results Too Rigidly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treating calculated targets as absolute rules instead of guidelines can lead to disordered eating; allow for natural daily variation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the MyPlate Daily Calorie/Nutrient Planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator estimates your daily calorie needs and recommended nutrient intake based on USDA MyPlate guidelines. It uses your age, sex, weight, height, and activity level to personalize recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator determine my daily calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">It applies the Mifflin-St Jeor equation to calculate your basal metabolic rate, then multiplies by your activity factor (sedentary, moderate, or active) to estimate total daily energy expenditure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What nutrients does MyPlate include in its recommendations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">MyPlate provides guidance on calories, protein, carbohydrates, fiber, fat, sodium, and key vitamins and minerals like iron, calcium, and vitamin D based on USDA dietary guidelines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator if I'm pregnant or breastfeeding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this standard calculator doesn't account for pregnancy or lactation; consult a healthcare provider for personalized recommendations during these periods.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I update my information in this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 3-6 months if your weight, activity level, or age changes significantly to keep recommendations accurate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the MyPlate calculator work for children?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While some versions include children's data, pediatric recommendations differ significantly; consult a pediatrician or registered dietitian for children under 18.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my calculated needs seem too high or too low?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Individual metabolism varies; if results seem off, monitor your weight for 2-3 weeks and adjust intake by 200-300 calories as needed, or consult a registered dietitian.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.myplate.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA MyPlate Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official USDA resource for personalized nutrition recommendations and MyPlate food group guidance.</p>
          </li>
          <li>
            <a href="https://www.dietaryguidelines.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dietary Guidelines for Americans 2020-2025</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based nutrition recommendations from the USDA and HHS covering calorie, nutrient, and food group targets.</p>
          </li>
          <li>
            <a href="https://bwsimulator.niddk.nih.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIH Body Weight Planner</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Advanced calculator using the Mifflin-St Jeor equation and weight projection modeling for personalized calorie planning.</p>
          </li>
          <li>
            <a href="https://www.eatright.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Academy of Nutrition and Dietetics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional organization providing evidence-based nutrition information and registered dietitian referrals.</p>
          </li>
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
          "BMR (Mifflin-St Jeor): For men: 10×weight(kg) + 6.25×height(cm) - 5×age + 5; For women: 10×weight(kg) + 6.25×height(cm) - 5×age - 161; TDEE = BMR × Activity Factor; Macronutrients: Protein 20%, Carbs 50%, Fat 30% of total calories.",
        variables: [
          { name: "weight", description: "Body weight in kilograms" },
          { name: "height", description: "Height in centimeters" },
          { name: "age", description: "Age in years" },
          { name: "gender", description: "Biological sex or gender identity" },
          { name: "activityFactor", description: "Physical activity multiplier" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 30-year-old female, 165 cm tall, weighing 60 kg, with a moderately active lifestyle wants to estimate her daily calorie and nutrient needs.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input age as 30, gender as female, height as 165 cm, weight as 60 kg, and select 'Moderately active' for activity level.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator computes BMR using the female Mifflin-St Jeor formula: 10×60 + 6.25×165 - 5×30 - 161 = 1363.75 kcal.",
          },
          {
            label: "Step 3",
            explanation:
              "Multiply BMR by activity factor 1.55 (moderately active): 1363.75 × 1.55 = 2113.8 kcal (TDEE).",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate macronutrients: Protein 20% (423 kcal = 106 g), Carbs 50% (1057 kcal = 264 g), Fat 30% (634 kcal = 70 g).",
          },
          {
            label: "Step 5",
            explanation:
              "Scale MyPlate servings based on 2114 kcal: Vegetables ~2.6 cups, Fruits ~2.1 cups, Grains ~6.3 oz, Protein foods ~5.8 oz, Dairy ~3.2 cups.",
          },
        ],
        result:
          "The user should consume approximately 2114 kcal daily with the specified macronutrient distribution and MyPlate servings to maintain her current weight and support her activity level.",
      }}
      relatedCalculators={[
        { title: "Body Fat Percentage Calculator", url: "/everyday/body-fat-percentage", icon: "💡" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday/coffee-urn-yield-strength", icon: "💡" },
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday/buffet-pan-capacity-count", icon: "💡" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday/laundry-detergent-dosage", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}