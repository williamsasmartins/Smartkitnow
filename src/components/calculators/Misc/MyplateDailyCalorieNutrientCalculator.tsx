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

    let bmrMale = 10 * weight + 6.25 * height - 5 * age + 5;
    let bmrFemale = 10 * weight + 6.25 * height - 5 * age - 161;
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
      answer:
        "The MyPlate Daily Calorie/Nutrient Planner is a comprehensive calculator designed to estimate your daily calorie needs and provide nutrient distribution recommendations based on the USDA's MyPlate guidelines. It helps you plan balanced meals by considering your age, gender, height, weight, and activity level to promote a healthy lifestyle.",
    },
    {
      question: "How accurate is this calculator for my personal needs?",
      answer:
        "This calculator uses scientifically validated formulas such as the Mifflin-St Jeor Equation for Basal Metabolic Rate and adjusts for activity level to estimate your Total Daily Energy Expenditure. While it provides a strong baseline, individual needs may vary due to metabolism, health conditions, and lifestyle factors. It is recommended to consult a healthcare professional for personalized advice.",
    },
    {
      question: "Can I use this planner if I have dietary restrictions or special health conditions?",
      answer:
        "Yes, you can use this planner as a general guideline. However, if you have specific dietary restrictions, chronic illnesses, or special health conditions, it is important to consult with a registered dietitian or healthcare provider to tailor your nutrition plan accordingly.",
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
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding MyPlate Daily Calorie/Nutrient Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The MyPlate Daily Calorie/Nutrient Planner is an advanced tool designed to help individuals estimate their daily caloric needs and understand the ideal distribution of macronutrients based on the USDA's MyPlate dietary guidelines. This planner integrates scientifically validated formulas, such as the Mifflin-St Jeor Equation for calculating Basal Metabolic Rate (BMR), and adjusts for physical activity levels to provide a personalized Total Daily Energy Expenditure (TDEE). By aligning calorie needs with nutrient recommendations, users can plan balanced meals that support overall health, weight management, and energy balance. This approach emphasizes the importance of consuming appropriate portions of fruits, vegetables, grains, protein foods, and dairy to meet nutritional requirements effectively.
        </p>
      </section>

      <section id="how-to" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To obtain an accurate estimate of your daily calorie and nutrient needs, input your personal information into the calculator fields. This includes your age, gender, height in centimeters, weight in kilograms, and your typical activity level. The calculator uses these inputs to compute your Basal Metabolic Rate and adjusts it according to your activity level to estimate your Total Daily Energy Expenditure. The results will provide you with a recommended calorie intake and a breakdown of macronutrients aligned with MyPlate guidelines.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your age in years. The calculator is optimized for adults aged 18 to 120.
          </li>
          <li>
            <strong>Step 2:</strong> Select your gender to apply the correct BMR formula adjustment.
          </li>
          <li>
            <strong>Step 3:</strong> Input your height in centimeters and weight in kilograms for precise metabolic calculations.
          </li>
          <li>
            <strong>Step 4:</strong> Choose your activity level from sedentary to extra active to reflect your daily energy expenditure.
          </li>
          <li>
            <strong>Step 5:</strong> Click "Calculate" to view your estimated daily calorie needs and nutrient distribution.
          </li>
          <li>
            <strong>Step 6:</strong> Use the provided nutrient and serving size recommendations to plan balanced meals following MyPlate guidelines.
          </li>
        </ul>
      </section>

      <section id="tips" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Professional Tips & Safety</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          While this planner offers a scientifically grounded estimate of your daily calorie and nutrient needs, individual variations such as metabolism, medical conditions, and lifestyle factors can influence actual requirements. It is advisable to use this tool as a guideline rather than an absolute prescription. For those with specific health concerns, dietary restrictions, or goals such as weight loss, muscle gain, or managing chronic diseases, consulting a registered dietitian or healthcare professional is essential. Additionally, gradual changes to diet and activity levels are recommended to ensure sustainable and safe health improvements.
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
              href="https://www.cdc.gov/nutrition/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Centers for Disease Control and Prevention - Nutrition (CDC) <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Comprehensive information on nutrition, dietary guidelines, and public health recommendations to promote healthy eating habits.
            </p>
          </li>
          <li>
            <a
              href="https://www.choosemyplate.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              USDA Choose MyPlate <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Official USDA resource providing detailed guidance on balanced meal planning and portion recommendations based on the MyPlate model.
            </p>
          </li>
          <li>
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              National Heart, Lung, and Blood Institute - BMI and Calorie Needs <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-sm text-slate-500 mt-1">
              Provides tools and calculators for estimating calorie needs and understanding body mass index for health management.
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
        { title: "Body Fat Percentage Calculator", url: "/everyday-life/body-fat-percentage", icon: "💡" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday-life/coffee-urn-yield-strength", icon: "💡" },
        { title: "Fertilizer Application Calculator", url: "/everyday-life/fertilizer-application-calculator", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday-life/buffet-pan-capacity-count", icon: "💡" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday-life/propane-tank-burn-time", icon: "💡" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday-life/laundry-detergent-dosage", icon: "💡" },
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