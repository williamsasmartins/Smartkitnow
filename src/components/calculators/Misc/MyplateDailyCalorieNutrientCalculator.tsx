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
  { label: "Other / Prefer not to say", value: "other" },
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
   * For other/unspecified: average of men and women formula
   */
  const bmr = useMemo(() => {
    const age = Number(inputs.age);
    const height = Number(inputs.height);
    const weight = Number(inputs.weight);
    if (!age || !height || !weight) return null;

    if (inputs.gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (inputs.gender === "female") {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      // Average of male and female BMR
      const maleBmr = 10 * weight + 6.25 * height - 5 * age + 5;
      const femaleBmr = 10 * weight + 6.25 * height - 5 * age - 161;
      return (maleBmr + femaleBmr) / 2;
    }
  }, [inputs.age, inputs.gender, inputs.height, inputs.weight]);

  /**
   * Total Daily Energy Expenditure (TDEE) = BMR * Activity Factor
   */
  const tdee = useMemo(() => {
    if (!bmr) return null;
    const activityFactor = Number(inputs.activityLevel);
    if (!activityFactor) return null;
    return bmr * activityFactor;
  }, [bmr, inputs.activityLevel]);

  /**
   * Macronutrient distribution based on MyPlate and USDA guidelines:
   * - Carbohydrates: 45-65% of total calories
   * - Protein: 10-35% of total calories
   * - Fat: 20-35% of total calories
   * We'll use a balanced moderate split: 50% carbs, 20% protein, 30% fat
   * Calories per gram: carbs=4, protein=4, fat=9
   */
  const macros = useMemo(() => {
    if (!tdee) return null;
    const carbsCalories = tdee * 0.5;
    const proteinCalories = tdee * 0.2;
    const fatCalories = tdee * 0.3;

    return {
      carbsGrams: Math.round(carbsCalories / 4),
      proteinGrams: Math.round(proteinCalories / 4),
      fatGrams: Math.round(fatCalories / 9),
    };
  }, [tdee]);

  const results = useMemo(() => {
    if (!tdee || !macros) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: null,
        formulaUsed: null,
      };
    }

    let warning = null;
    if (inputs.age && (inputs.age < 18 || inputs.age > 80)) {
      warning = "Calorie needs may vary significantly for children and seniors.";
    }

    return {
      value: `${Math.round(tdee)} kcal/day`,
      label: "Estimated Daily Calorie Needs",
      subtext: `Based on your inputs, your estimated daily calorie requirement to maintain your current weight is approximately ${Math.round(
        tdee
      )} calories. Macronutrient distribution is approximately ${macros.carbsGrams}g carbohydrates, ${macros.proteinGrams}g protein, and ${macros.fatGrams}g fat per day.`,
      warning,
      formulaUsed:
        "TDEE = BMR × Activity Level Factor; BMR calculated via Mifflin-St Jeor Equation",
    };
  }, [tdee, macros, inputs.age]);

  const faqs = [
    {
      question: "What is the MyPlate Daily Calorie/Nutrient Planner?",
      answer:
        "This planner estimates your daily calorie needs and macronutrient distribution based on your age, gender, height, weight, and activity level, aligned with USDA MyPlate guidelines to help you maintain a balanced and healthy diet.",
    },
    {
      question: "How accurate is the calorie estimation?",
      answer:
        "While the calculator uses scientifically validated formulas like the Mifflin-St Jeor Equation and activity multipliers, individual calorie needs can vary due to metabolism, health conditions, and lifestyle factors. Use this as a guideline and consult a healthcare professional for personalized advice.",
    },
    {
      question: "Can I use this calculator if I want to lose or gain weight?",
      answer:
        "This calculator estimates maintenance calories. To lose weight, a calorie deficit is needed, and to gain weight, a surplus. Adjust your intake accordingly and consider consulting a nutritionist for tailored plans.",
    },
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
                min={1}
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
                min={50}
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
                min={20}
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
            // Just triggers recalculation via state update if needed
            setInputs((p) => ({ ...p }));
          }}
          disabled={
            !inputs.age ||
            !inputs.gender ||
            !inputs.height ||
            !inputs.weight ||
            !inputs.activityLevel
          }
          aria-disabled={
            !inputs.age ||
            !inputs.gender ||
            !inputs.height ||
            !inputs.weight ||
            !inputs.activityLevel
          }
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ age: "", gender: "", height: "", weight: "", activityLevel: "" })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-4 text-lg text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl mx-auto">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-6 text-xs italic text-slate-500 dark:text-slate-400">
              <Info className="inline-block w-4 h-4 mr-1" /> {results.formulaUsed}
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
          Understanding MyPlate Daily Calorie/Nutrient Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The MyPlate Daily Calorie/Nutrient Planner is a scientifically grounded tool designed to help individuals estimate their daily caloric needs and macronutrient distribution based on personal characteristics such as age, gender, height, weight, and physical activity level. Rooted in the USDA MyPlate guidelines, this planner emphasizes balanced nutrition by allocating appropriate portions of carbohydrates, proteins, and fats to support overall health and wellness. By understanding your body's energy requirements, you can make informed decisions about meal planning, portion control, and nutrient intake to maintain or improve your health. This planner is especially valuable for those seeking to align their diet with evidence-based nutritional standards while accommodating individual lifestyle factors.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires you to input a few key personal details. These inputs allow the tool to estimate your Basal Metabolic Rate (BMR) and adjust it according to your activity level to provide your Total Daily Energy Expenditure (TDEE). The calculator then breaks down your calorie needs into macronutrient targets based on balanced dietary recommendations. Follow the steps below to get your personalized daily calorie and nutrient plan:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your age in years. This helps adjust metabolic calculations as energy needs change with age.
          </li>
          <li>
            <strong>Step 2:</strong> Select your gender. This affects the BMR formula used for more accurate estimations.
          </li>
          <li>
            <strong>Step 3:</strong> Input your height in centimeters and weight in kilograms. These are essential for calculating your basal metabolic rate.
          </li>
          <li>
            <strong>Step 4:</strong> Choose your typical activity level from sedentary to very active. This factor scales your calorie needs to match your lifestyle.
          </li>
          <li>
            <strong>Step 5:</strong> Click the "Calculate" button to view your estimated daily calorie needs and recommended macronutrient distribution.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While this planner provides a robust estimate of your daily calorie and nutrient needs, it is important to remember that individual requirements can vary due to genetics, health conditions, and metabolic differences. Always consider consulting a registered dietitian or healthcare provider before making significant changes to your diet, especially if you have underlying health issues or specific fitness goals. Additionally, ensure you stay hydrated, consume a variety of nutrient-dense foods, and adjust your calorie intake gradually to avoid adverse effects. Monitoring your progress and listening to your body's signals will help you maintain a sustainable and healthy eating pattern.
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

      {/* NEW RICH REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">References & Additional Resources</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
          For further reading and verification, please refer to these authoritative sources:
        </p>
        <ul className="space-y-4">
          <li>
            <a
              href="https://www.choosemyplate.gov/resources/MyPlatePlan"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              MyPlate Plan - USDA <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official USDA resource providing personalized nutrition plans based on MyPlate guidelines, including calorie and nutrient recommendations.
            </p>
          </li>
          <li>
            <a
              href="https://www.cdc.gov/nutrition/data-statistics/know-your-limit-for-added-sugars.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              CDC Nutrition Data & Guidelines <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive data and guidelines on nutrition, calorie intake, and healthy eating habits from the Centers for Disease Control and Prevention.
            </p>
          </li>
          <li>
            <a
              href="https://www.nal.usda.gov/fnic/dri-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA Dietary Reference Intakes Calculator <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Tool for calculating individual nutrient requirements based on age, gender, and activity level, supporting personalized dietary planning.
            </p>
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
          "BMR (Mifflin-St Jeor) = 10 × weight (kg) + 6.25 × height (cm) - 5 × age (years) + 5 (men) or -161 (women); TDEE = BMR × Activity Factor",
        variables: [
          { name: "weight", description: "Your weight in kilograms" },
          { name: "height", description: "Your height in centimeters" },
          { name: "age", description: "Your age in years" },
          { name: "activity factor", description: "Multiplier based on physical activity level" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 30-year-old moderately active female who is 165 cm tall and weighs 65 kg wants to know her daily calorie and nutrient needs.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input age as 30, gender as female, height as 165 cm, weight as 65 kg, and select 'Moderately active' activity level.",
          },
          {
            label: "Step 2",
            explanation:
              "The calculator computes BMR: 10*65 + 6.25*165 - 5*30 - 161 = 1391.25 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "TDEE is calculated by multiplying BMR by activity factor 1.55: 1391.25 × 1.55 ≈ 2156 kcal/day.",
          },
          {
            label: "Step 4",
            explanation:
              "Macronutrients are distributed as 50% carbs (269g), 20% protein (108g), and 30% fat (72g) based on calorie needs.",
          },
        ],
        result:
          "The woman should aim for approximately 2156 calories daily, with balanced macronutrients to maintain her weight and support her activity level.",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday-life/steps-to-distance-converter", icon: "💡" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday-life/laundry-detergent-dosage", icon: "💡" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday-life/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Party Food & Drinks Planner", url: "/everyday-life/party-food-drinks-planner", icon: "🎉" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday-life/bmr-calculator", icon: "💡" },
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday-life/screen-time-pomodoro-planner", icon: "💡" },
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