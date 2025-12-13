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
      question: "What is the Macro Split Planner and why is it important?",
      answer:
        "The Macro Split Planner is a tool designed to help individuals optimize their daily intake of macronutrients — protein, carbohydrates, and fats — based on their personal characteristics and fitness goals. Proper macro distribution supports muscle growth, fat loss, and overall health by ensuring your body receives the right fuel in the right amounts. Unlike calorie counting alone, focusing on macros helps tailor nutrition to your metabolic needs and activity levels, improving performance and recovery.",
    },
    {
      question: "How do I interpret the macro ratios and grams provided?",
      answer:
        "The macro ratios represent the percentage of your total daily calories that should come from each macronutrient. For example, a 30% protein ratio means 30% of your calories should be from protein. The grams indicate the actual amount of each macronutrient you should consume daily, calculated from these percentages and your total calorie needs (TDEE). Tracking grams helps you measure your intake more precisely, which is crucial for achieving specific fitness goals like muscle gain or fat loss.",
    },
    {
      question: "What are the limitations of this calculator?",
      answer:
        "While this calculator provides a scientifically grounded estimate of your macro needs, individual variations such as metabolic rate, health conditions, and dietary preferences can affect accuracy. It does not replace personalized advice from a registered dietitian or healthcare provider. Additionally, macro needs may change over time with shifts in activity level, body composition, or goals, so regular reassessment is recommended.",
    },
    {
      question: "Can I customize the macro ratios for different diets?",
      answer:
        "Yes, this planner allows you to adjust the protein, carbohydrate, and fat ratios to fit various dietary approaches such as ketogenic, balanced, or high-protein diets. However, it’s important to maintain a total of 100% across macros and consider your health status and goals when customizing. Consulting with a nutrition professional is advised when making significant changes to your diet.",
    },
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
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Macro Split Planner (Protein/Carb/Fat)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Macro Split Planner is a specialized nutritional tool designed to
          help individuals determine the optimal distribution of macronutrients
          — protein, carbohydrates, and fats — tailored to their unique body
          metrics, lifestyle, and fitness objectives. Macronutrients are the
          primary components of our diet that provide energy and support bodily
          functions. Understanding and balancing these macros is essential for
          achieving goals such as fat loss, muscle gain, or weight maintenance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This planner uses scientifically validated formulas, including the
          Mifflin-St Jeor equation for Basal Metabolic Rate (BMR) and activity
          multipliers to estimate Total Daily Energy Expenditure (TDEE). From
          there, it calculates how many calories you need daily and breaks them
          down into grams of protein, carbohydrates, and fats based on your
          chosen macro ratios. This personalized approach ensures your diet
          supports your metabolic rate and activity level, optimizing health and
          performance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Unlike generic calorie calculators, the Macro Split Planner emphasizes
          the quality and balance of your calorie sources. Protein supports
          muscle repair and growth, carbohydrates provide energy for workouts
          and brain function, and fats are vital for hormone production and
          cellular health. Adjusting these ratios can significantly impact your
          body composition and energy levels.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is particularly relevant for users in Canada and the US,
          where dietary guidelines and common measurement units (imperial) are
          considered by default. However, it also supports metric units for
          international users. By integrating personal data and evidence-based
          nutrition science, the Macro Split Planner empowers you to make
          informed dietary choices aligned with your wellness journey.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Macro Split Planner is straightforward and designed to
          provide you with actionable insights quickly. Begin by selecting your
          preferred unit system — Imperial (lbs, feet, inches) or Metric (kg,
          cm). Then, enter your personal details including weight, height, age,
          and gender. These inputs are essential for accurately estimating your
          basal metabolic rate.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight and Height:</strong> Enter your current weight and
            height. For Imperial units, height is split into feet and inches.
            For Metric, enter height in centimeters.
          </li>
          <li>
            <strong>Age and Gender:</strong> These factors influence your basal
            metabolic rate and overall calorie needs.
          </li>
          <li>
            <strong>Activity Level:</strong> Choose the option that best
            describes your typical daily physical activity, from sedentary to
            very active.
          </li>
          <li>
            <strong>Goal:</strong> Select whether you want to maintain, lose,
            or gain weight. This adjusts your calorie target accordingly.
          </li>
          <li>
            <strong>Macro Ratios:</strong> Customize the percentage of your
            calories coming from protein, carbohydrates, and fats. Ensure they
            total 100%.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After filling in all fields, click “Calculate” to see your personalized
          daily calorie needs and macro breakdown in grams. Use these values to
          guide your meal planning and track your intake for optimal results.
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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Trusted References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4258944/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition, 1990.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.eatright.org/fitness/sports-and-performance/fueling-your-workout/macronutrients-and-performance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Academy of Nutrition and Dietetics – Macronutrients and Performance
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guide on how protein, carbs, and fats impact athletic performance.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.healthline.com/nutrition/how-to-calculate-macros"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Healthline – How to Calculate Macros
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Practical advice on calculating macronutrient needs for various goals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nutrition.org.uk/healthyliving/basics/energybalance.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. British Nutrition Foundation – Energy Balance and Macronutrients
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Educational resource on energy balance and the role of macronutrients in health.
            </p>
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