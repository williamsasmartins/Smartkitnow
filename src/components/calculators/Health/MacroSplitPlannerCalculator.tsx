import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  CheckCircle2,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function MacroSplitPlannerCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    heightFeet: "",
    heightInches: "",
    age: "",
    gender: "male",
    activityLevel: "sedentary",
    goal: "maintenance",
    proteinRatio: 30,
    carbRatio: 40,
    fatRatio: 30,
  });

  // Helper: convert height to total inches or cm
  const heightInInches = useMemo(() => {
    if (unit === "imperial") {
      const feet = parseFloat(inputs.heightFeet) || 0;
      const inches = parseFloat(inputs.heightInches) || 0;
      return feet * 12 + inches;
    } else {
      // metric cm to inches
      const cm = parseFloat(inputs.heightFeet) || 0;
      return cm / 2.54;
    }
  }, [inputs.heightFeet, inputs.heightInches, unit]);

  // Helper: weight in lbs or kg
  const weightInLbs = useMemo(() => {
    if (unit === "imperial") {
      return parseFloat(inputs.weight) || 0;
    } else {
      // kg to lbs
      return (parseFloat(inputs.weight) || 0) * 2.20462;
    }
  }, [inputs.weight, unit]);

  // 2. LOGIC
  // Calculate BMR using Mifflin-St Jeor Equation (imperial units converted)
  // Then TDEE by activity factor
  // Then calculate macros grams based on user ratios and TDEE calories

  const results = useMemo(() => {
    const weight = weightInLbs;
    const height = heightInInches;
    const age = parseInt(inputs.age) || 0;
    const gender = inputs.gender;
    const activityLevel = inputs.activityLevel;
    const goal = inputs.goal;

    if (!weight || !height || !age) {
      return { value: 0, label: "", category: "" };
    }

    // Convert weight to kg and height to cm for formula
    const weightKg = weight / 2.20462;
    const heightCm = height * 2.54;

    // BMR calculation (Mifflin-St Jeor)
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const activityFactor = activityMultipliers[activityLevel] || 1.2;

    // TDEE calculation
    let tdee = bmr * activityFactor;

    // Adjust TDEE based on goal
    if (goal === "lose") {
      tdee *= 0.8; // 20% deficit
    } else if (goal === "gain") {
      tdee *= 1.15; // 15% surplus
    }

    // Macro ratios (percentages)
    let proteinPercent = Number(inputs.proteinRatio);
    let carbPercent = Number(inputs.carbRatio);
    let fatPercent = Number(inputs.fatRatio);

    // Normalize if sum not 100
    const totalPercent = proteinPercent + carbPercent + fatPercent;
    if (totalPercent !== 100 && totalPercent > 0) {
      proteinPercent = (proteinPercent / totalPercent) * 100;
      carbPercent = (carbPercent / totalPercent) * 100;
      fatPercent = (fatPercent / totalPercent) * 100;
    }

    // Calories per gram macros
    const calPerGramProtein = 4;
    const calPerGramCarb = 4;
    const calPerGramFat = 9;

    // Calculate grams per macro
    const proteinCalories = (proteinPercent / 100) * tdee;
    const carbCalories = (carbPercent / 100) * tdee;
    const fatCalories = (fatPercent / 100) * tdee;

    const proteinGrams = proteinCalories / calPerGramProtein;
    const carbGrams = carbCalories / calPerGramCarb;
    const fatGrams = fatCalories / calPerGramFat;

    return {
      value: 1, // dummy to show results block
      label: "",
      category: "",
      tdee: Math.round(tdee),
      proteinPercent: proteinPercent.toFixed(1),
      carbPercent: carbPercent.toFixed(1),
      fatPercent: fatPercent.toFixed(1),
      proteinGrams: proteinGrams.toFixed(1),
      carbGrams: carbGrams.toFixed(1),
      fatGrams: fatGrams.toFixed(1),
    };
  }, [inputs, weightInLbs, heightInInches]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the ideal protein-to-calorie ratio for muscle building?",
      answer: "The standard recommendation for muscle-building is 0.7–1.0 grams of protein per pound of body weight, or approximately 1.6–2.2 grams per kilogram. For a 180-pound person aiming to build muscle, this translates to 126–180 grams of protein daily. This range supports muscle protein synthesis while accounting for individual variation in training intensity and recovery.",
    },
    {
      question: "How do I adjust my macro split if I'm doing intermittent fasting?",
      answer: "With intermittent fasting, your macro percentages remain the same, but they're compressed into fewer eating windows. Aim for the same total daily macros (e.g., 40% protein, 35% carbs, 25% fat) but consume them in 4–8 hours instead of 12–16 hours. This may mean eating 40–60 grams of protein per meal rather than spreading it across six meals.",
    },
    {
      question: "What's the difference between macro splits for cutting versus bulking?",
      answer: "During a bulk (caloric surplus), a typical split is 30% protein, 50% carbs, 20% fat to maximize muscle gains. During a cut (caloric deficit), the split shifts to 40% protein, 35% carbs, 25% fat to preserve muscle mass while losing fat. The higher protein during a cut helps maintain satiety and prevents muscle loss in a deficit.",
    },
    {
      question: "Can I use this calculator if I have dietary restrictions like keto or vegetarian?",
      answer: "Yes, but you'll need to adjust the suggested percentages. For keto diets, use 70% fat, 25% protein, 5% carbs. For vegetarian diets, prioritize protein from legumes, tofu, and dairy to hit your gram targets, which may shift the carb/fat ratio upward. The calculator provides the framework; you customize based on your nutritional constraints.",
    },
    {
      question: "How often should I recalculate my macros as my goals change?",
      answer: "Recalculate your macros every 4–8 weeks or whenever your body weight changes by &gt;5 pounds. If you transition from bulking to cutting, recalculate immediately to adjust calorie and protein targets. Seasonal changes in activity level or training focus also warrant a macro recalculation.",
    },
    {
      question: "What happens if I consistently exceed my daily fat target?",
      answer: "Exceeding your fat target by 10–20 grams occasionally won't derail progress, but consistent overages can lead to a calorie surplus, causing unwanted weight gain. Fat is calorie-dense at 9 calories per gram, so even small portions add up quickly. Track for 1–2 weeks to identify if excess fat is preventing you from reaching other macro goals.",
    },
    {
      question: "Is there a minimum carb intake I should maintain?",
      answer: "For non-keto approaches, a minimum of 100–150 grams of carbs daily supports brain function, hormone production, and training performance. Athletes doing &gt;60 minutes of intense exercise should aim for 4–7 grams of carbs per kilogram of body weight. Going below 50 grams daily long-term can impair mood, energy, and recovery.",
    },
    {
      question: "How do I account for fiber when calculating my carb macros?",
      answer: "Fiber is a carbohydrate but doesn't spike blood sugar or provide significant calories. Many nutritionists subtract fiber from total carbs to calculate 'net carbs,' especially on lower-carb diets. For example, 50 grams of total carbs with 10 grams of fiber equals 40 grams of net carbs; adjust your macro split calculator accordingly if you track net carbs.",
    },
    {
      question: "Should my macro split change based on my age or metabolism?",
      answer: "Yes, older adults (&gt;50 years) benefit from higher protein ratios (1.0–1.2 grams per kilogram) to combat age-related muscle loss. Slower metabolisms may require slightly higher fat intake (25–30%) to maintain hormonal balance and satiety. Use the calculator as a starting point, then adjust based on 2–3 weeks of tracking and how you feel.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // Reset inputs to defaults
  function resetInputs() {
    setInputs({
      weight: "",
      heightFeet: "",
      heightInches: "",
      age: "",
      gender: "male",
      activityLevel: "sedentary",
      goal: "maintenance",
      proteinRatio: 30,
      carbRatio: 40,
      fatRatio: 30,
    });
  }

  // Calculate button triggers recalculation by updating state (no-op here)
  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    // Calculation is memoized, so no action needed here
  }

  const widget = (
    <form
      onSubmit={handleCalculate}
      className="space-y-6"
      aria-label="Macro Split Planner Calculator"
    >
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min={0}
            step="any"
            value={inputs.weight}
            onChange={handleInputChange}
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            required
          />
        </div>

        {/* Height */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label
                htmlFor="heightFeet"
                className="text-slate-700 dark:text-slate-300"
              >
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                name="heightFeet"
                type="number"
                min={0}
                step="1"
                value={inputs.heightFeet}
                onChange={handleInputChange}
                placeholder="5"
                required
              />
            </div>
            <div className="flex-1">
              <Label
                htmlFor="heightInches"
                className="text-slate-700 dark:text-slate-300"
              >
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                name="heightInches"
                type="number"
                min={0}
                max={11}
                step="any"
                value={inputs.heightInches}
                onChange={handleInputChange}
                placeholder="8"
                required
              />
            </div>
          </div>
        ) : (
          <div>
            <Label
              htmlFor="heightFeet"
              className="text-slate-700 dark:text-slate-300"
            >
              Height (cm)
            </Label>
            <Input
              id="heightFeet"
              name="heightFeet"
              type="number"
              min={0}
              step="any"
              value={inputs.heightFeet}
              onChange={handleInputChange}
              placeholder="e.g. 173"
              required
            />
          </div>
        )}

        {/* Age */}
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (years)
          </Label>
          <Input
            id="age"
            name="age"
            type="number"
            min={10}
            max={120}
            step="1"
            value={inputs.age}
            onChange={handleInputChange}
            placeholder="e.g. 30"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300">
            Gender
          </Label>
          <Select
            id="gender"
            name="gender"
            value={inputs.gender}
            onValueChange={(val) => setInputs((prev) => ({ ...prev, gender: val }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other / Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Level */}
        <div>
          <Label
            htmlFor="activityLevel"
            className="text-slate-700 dark:text-slate-300"
          >
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            name="activityLevel"
            value={inputs.activityLevel}
            onValueChange={(val) =>
              setInputs((prev) => ({ ...prev, activityLevel: val }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="light">Lightly active (1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderately active (3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (6-7 days/week)</SelectItem>
              <SelectItem value="veryActive">Very active (hard exercise & physical job)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Goal */}
        <div>
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Goal
          </Label>
          <Select
            id="goal"
            name="goal"
            value={inputs.goal}
            onValueChange={(val) => setInputs((prev) => ({ ...prev, goal: val }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintain weight</SelectItem>
              <SelectItem value="lose">Lose weight (fat loss)</SelectItem>
              <SelectItem value="gain">Gain weight (muscle gain)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Macro Ratios */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label
              htmlFor="proteinRatio"
              className="text-slate-700 dark:text-slate-300"
            >
              Protein (%) 
              <Info className="inline ml-1 h-4 w-4 text-blue-500" title="Recommended: 25-35%" />
            </Label>
            <Input
              id="proteinRatio"
              name="proteinRatio"
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={inputs.proteinRatio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="carbRatio"
              className="text-slate-700 dark:text-slate-300"
            >
              Carbohydrates (%) 
              <Info className="inline ml-1 h-4 w-4 text-blue-500" title="Recommended: 40-50%" />
            </Label>
            <Input
              id="carbRatio"
              name="carbRatio"
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={inputs.carbRatio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label
              htmlFor="fatRatio"
              className="text-slate-700 dark:text-slate-300"
            >
              Fat (%) 
              <Info className="inline ml-1 h-4 w-4 text-blue-500" title="Recommended: 20-30%" />
            </Label>
            <Input
              id="fatRatio"
              name="fatRatio"
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={inputs.fatRatio}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate macro split"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Estimated Daily Needs
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-6">
                Total Calories: <span className="text-5xl">{results.tdee}</span> kcal
              </p>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-xl font-bold text-blue-900 dark:text-white">
                    Protein
                  </p>
                  <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
                    {results.proteinGrams} g
                  </p>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    {results.proteinPercent}%
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-900 dark:text-white">
                    Carbs
                  </p>
                  <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
                    {results.carbGrams} g
                  </p>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    {results.carbPercent}%
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-900 dark:text-white">
                    Fat
                  </p>
                  <p className="text-4xl font-extrabold text-blue-900 dark:text-white">
                    {results.fatGrams} g
                  </p>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                    {results.fatPercent}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </form>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Macro Split Planner (Protein/Carb/Fat)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Macro Split Planner is a nutrition tool that breaks down your daily calorie intake into optimal ratios of protein, carbohydrates, and fat based on your fitness goals. Whether you're building muscle, losing fat, or maintaining your current physique, balancing these three macronutrients is essential for energy, recovery, and achieving sustainable results. Rather than counting only calories, macro tracking ensures you're fueling your body with the right nutrient balance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your daily calorie target (or TDEE), select your primary fitness goal (cutting, bulking, maintenance, or sport-specific), and choose any dietary preferences (keto, high-carb, vegetarian, etc.). The calculator then auto-populates recommended percentage ranges and gram amounts for each macro. Key inputs include your body weight, activity level, and any special considerations like meal timing or training frequency.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your daily protein, carb, and fat targets in both grams and percentage-of-calories format. Use these numbers to plan meals, log food in a tracking app, and monitor whether you're hitting targets consistently over 1–2 week periods. Remember that hitting macros within ±5 grams is close enough; perfection isn't required, but consistency over weeks and months drives visible progress.</p>
        </div>
      </section>

      {/* TABLE: Recommended Macro Splits by Goal (Percentage of Total Calories) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Macro Splits by Goal (Percentage of Total Calories)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different fitness goals require different macro distributions to optimize results.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fitness Goal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Carbs %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example (2,500 cal/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fat Loss (Cutting)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250g protein, 219g carbs, 69g fat</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Muscle Gain (Bulking)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">188g protein, 313g carbs, 56g fat</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance (Balanced)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">219g protein, 281g carbs, 56g fat</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Endurance Training</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">156g protein, 375g carbs, 42g fat</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ketogenic (Low-Carb)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">156g protein, 31g carbs, 194g fat</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Intensity Training</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">219g protein, 313g carbs, 42g fat</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages are flexible; individual needs vary based on activity level, metabolism, and personal tolerance. Adjust protein upward if you struggle with hunger during cuts.</p>
      </section>

      {/* TABLE: Daily Protein Recommendations by Body Weight and Goal */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Protein Recommendations by Body Weight and Goal</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Protein needs scale with body weight and training intensity; use these benchmarks as starting points.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance (g/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Muscle Building (g/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat Loss (g/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">130 lbs (59 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">89–130g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">94–130g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130–156g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">160 lbs (73 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">109–160g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">116–160g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160–192g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">190 lbs (86 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">130–190g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">137–190g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">190–228g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">220 lbs (100 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–220g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160–220g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220–264g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250 lbs (113 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">170–250g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">181–250g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–300g</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Protein recommendations assume moderate-to-high training frequency (4+ days/week). Sedentary individuals can use the lower range; competitive athletes may exceed the upper range.</p>
      </section>

      {/* TABLE: Calorie and Macro Targets for Common Daily Calorie Levels */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calorie and Macro Targets for Common Daily Calorie Levels</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for total daily energy expenditure (TDEE) and corresponding macro targets using a balanced 35/45/20 split.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Carbs (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical User Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,800 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">158g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">203g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sedentary woman; aggressive cut</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,200 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">193g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">248g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderately active woman; mild cut</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">219g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">281g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Active person; maintenance</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">263g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">338g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very active man; mild bulk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,500 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">306g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">394g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Athlete or heavy laborer; bulk</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are estimated targets. Individual needs vary based on age, sex, metabolism, and training style. Use a TDEE calculator for personalized estimates.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Prioritize protein first when meal planning—hit your protein target daily, then fill the remaining calories with carbs and fat based on your preference. Protein keeps you fuller longer, preserves muscle during calorie deficits, and has the highest thermic effect of food.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a food scale and tracking app for at least 2–3 weeks to learn portion sizes and gain accuracy. Many people underestimate calories and overestimate protein intake by eye, so data-driven tracking prevents costly mistakes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Adjust your macro split weekly based on hunger, energy, and progress. If you feel constantly fatigued on a high-carb split, trial a higher-fat variation; if you're always hungry, try bumping protein up 10 grams and reducing carbs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Don't chase perfect macros daily—instead, aim for a rolling 7-day average. One day of 10% overage on fat is offset by an underage the next day, and this reduces the stress and rigidity of rigid daily tracking.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Fiber When Tracking Carbs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people count total carbs without subtracting fiber, leading to net carb intake that's higher than intended. On low-carb or keto diets, fiber doesn't impact blood sugar, so tracking net carbs (total carbs minus fiber) gives a more accurate picture of your metabolic impact.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using a One-Size-Fits-All Macro Split</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying a standard 40/40/20 split regardless of your training style, metabolism, or preferences is a recipe for inconsistency. Your ideal split depends on your sport, eating patterns, and how different macros make you feel—use the calculator to personalize, not generalize.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Recalculate When Weight Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">As you gain or lose weight, your calorie and macro needs change. If you lose 10 pounds but keep the same macro targets, you'll overshoot your deficit or surplus. Recalculate every 4–8 weeks or when body weight shifts &gt;5 pounds.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Conflating Macro Targets With Food Choices</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hitting 200 grams of protein from fast food is nutritionally different from 200 grams from lean meats and legumes. Macros guide quantity; micronutrients, food quality, and whole-food emphasis guide the sources. Don't optimize macros at the expense of nutrient density.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal protein-to-calorie ratio for muscle building?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard recommendation for muscle-building is 0.7–1.0 grams of protein per pound of body weight, or approximately 1.6–2.2 grams per kilogram. For a 180-pound person aiming to build muscle, this translates to 126–180 grams of protein daily. This range supports muscle protein synthesis while accounting for individual variation in training intensity and recovery.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I adjust my macro split if I'm doing intermittent fasting?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">With intermittent fasting, your macro percentages remain the same, but they're compressed into fewer eating windows. Aim for the same total daily macros (e.g., 40% protein, 35% carbs, 25% fat) but consume them in 4–8 hours instead of 12–16 hours. This may mean eating 40–60 grams of protein per meal rather than spreading it across six meals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between macro splits for cutting versus bulking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">During a bulk (caloric surplus), a typical split is 30% protein, 50% carbs, 20% fat to maximize muscle gains. During a cut (caloric deficit), the split shifts to 40% protein, 35% carbs, 25% fat to preserve muscle mass while losing fat. The higher protein during a cut helps maintain satiety and prevents muscle loss in a deficit.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator if I have dietary restrictions like keto or vegetarian?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but you'll need to adjust the suggested percentages. For keto diets, use 70% fat, 25% protein, 5% carbs. For vegetarian diets, prioritize protein from legumes, tofu, and dairy to hit your gram targets, which may shift the carb/fat ratio upward. The calculator provides the framework; you customize based on your nutritional constraints.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my macros as my goals change?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate your macros every 4–8 weeks or whenever your body weight changes by &gt;5 pounds. If you transition from bulking to cutting, recalculate immediately to adjust calorie and protein targets. Seasonal changes in activity level or training focus also warrant a macro recalculation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I consistently exceed my daily fat target?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Exceeding your fat target by 10–20 grams occasionally won't derail progress, but consistent overages can lead to a calorie surplus, causing unwanted weight gain. Fat is calorie-dense at 9 calories per gram, so even small portions add up quickly. Track for 1–2 weeks to identify if excess fat is preventing you from reaching other macro goals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is there a minimum carb intake I should maintain?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For non-keto approaches, a minimum of 100–150 grams of carbs daily supports brain function, hormone production, and training performance. Athletes doing &gt;60 minutes of intense exercise should aim for 4–7 grams of carbs per kilogram of body weight. Going below 50 grams daily long-term can impair mood, energy, and recovery.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for fiber when calculating my carb macros?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fiber is a carbohydrate but doesn't spike blood sugar or provide significant calories. Many nutritionists subtract fiber from total carbs to calculate 'net carbs,' especially on lower-carb diets. For example, 50 grams of total carbs with 10 grams of fiber equals 40 grams of net carbs; adjust your macro split calculator accordingly if you track net carbs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should my macro split change based on my age or metabolism?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, older adults (&gt;50 years) benefit from higher protein ratios (1.0–1.2 grams per kilogram) to combat age-related muscle loss. Slower metabolisms may require slightly higher fat intake (25–30%) to maintain hormonal balance and satiety. Use the calculator as a starting point, then adjust based on 2–3 weeks of tracking and how you feel.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/books/NBK56068/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Academies of Sciences, Engineering, and Medicine guidance on macronutrient intake for health and disease prevention.</p>
          </li>
          <li>
            <a href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Sports Nutrition Position Stand: Protein and Exercise</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations on protein intake for athletes and individuals engaged in resistance and endurance training.</p>
          </li>
          <li>
            <a href="https://pubmed.ncbi.nlm.nih.gov/26633063/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Macronutrient and Micronutrient Needs for Athletes</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research from the American Journal of Clinical Nutrition on optimizing macronutrient ratios for athletic performance.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6142030/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Effects of Protein Timing on Muscle Strength and Hypertrophy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific review examining how macronutrient distribution throughout the day impacts muscle growth and recovery.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Macro Split Planner (Protein/Carb/Fat)"
      description="Optimize your diet with a macro split planner. Calculate the perfect ratio of proteins, carbohydrates, and fats for your fitness goals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "TDEE = BMR × Activity Factor; BMR (Mifflin-St Jeor) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + (5 for men, -161 for women); " +
          "Calories from Macro = (Macro % / 100) × TDEE; Grams of Macro = Calories from Macro / Calories per gram (Protein/Carb=4, Fat=9)",
        variables: [
          {
            symbol: "weight",
            description: "Body weight in kilograms",
          },
          {
            symbol: "height",
            description: "Height in centimeters",
          },
          {
            symbol: "age",
            description: "Age in years",
          },
          {
            symbol: "Activity Factor",
            description:
              "Multiplier based on physical activity level (1.2–1.9)",
          },
          {
            symbol: "Macro %",
            description: "Percentage of total calories from protein, carbs, or fat",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John is a 30-year-old male, 5'10\" (70 inches), 180 lbs, moderately active, aiming to lose weight.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate BMR: 10 × 81.65 kg + 6.25 × 177.8 cm - 5 × 30 + 5 = 1770 kcal",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate TDEE: 1770 × 1.55 (moderate activity) = 2743 kcal",
          },
          {
            label: "Step 3",
            explanation:
              "Adjust for goal (lose weight): 2743 × 0.8 = 2194 kcal",
          },
          {
            label: "Step 4",
            explanation:
              "Apply macro split (30% protein, 40% carbs, 30% fat): Protein = 658 kcal / 4 = 164.5 g, Carbs = 877.6 kcal / 4 = 219.4 g, Fat = 658 kcal / 9 = 73.1 g",
          },
        ],
        result:
          "John should consume approximately 2194 calories daily with 165g protein, 219g carbohydrates, and 73g fat to support fat loss while maintaining muscle.",
      }}
      relatedCalculators={[
        {
          title: "BMI — Body Mass Index Calculator",
          url: "/health/bmi-body-mass-index",
          icon: "⚖️",
        },
        {
          title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)",
          url: "/health/bmr-mifflin-st-jeor",
          icon: "🔥",
        },
        {
          title: "TDEE — Total Daily Energy Expenditure Calculator",
          url: "/health/tdee-daily-energy-expenditure",
          icon: "🔥",
        },
        {
          title: "Body Fat % (US Navy / 3-sites)",
          url: "/health/body-fat-us-navy-3-sites",
          icon: "💧",
        },
        {
          title: "Ideal Weight Range (Hamwi/Devine/Miller)",
          url: "/health/ideal-weight-range-hamwi-devine-miller",
          icon: "🥗",
        },
        {
          title: "Waist-to-Height Ratio Checker",
          url: "/health/waist-to-height-ratio",
          icon: "😴",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Macro Split Planner (Protein/Carb/Fat)?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}