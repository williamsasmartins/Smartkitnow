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
  Calculator,
  RotateCcw,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FatIntakeRangeAmdrCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "", // lbs or kg
    heightFeet: "", // feet (imperial only)
    heightInches: "", // inches (imperial only)
    heightCm: "", // cm (metric only)
    age: "",
    sex: "female", // female or male
    activityLevel: "sedentary", // sedentary, light, moderate, active, very active
    totalCalories: "", // optional, user can input total daily calories to get fat grams range
  });

  // Helper: Convert height to meters
  function heightMeters() {
    if (unit === "imperial") {
      const feet = parseFloat(inputs.heightFeet || "0");
      const inches = parseFloat(inputs.heightInches || "0");
      if (feet === 0 && inches === 0) return 0;
      return (feet * 12 + inches) * 0.0254;
    } else {
      const cm = parseFloat(inputs.heightCm || "0");
      if (cm === 0) return 0;
      return cm / 100;
    }
  }

  // Helper: Convert weight to kg
  function weightKg() {
    const w = parseFloat(inputs.weight || "0");
    if (w === 0) return 0;
    return unit === "imperial" ? w * 0.45359237 : w;
  }

  // Helper: Calculate BMR (Mifflin-St Jeor Equation)
  function calculateBMR() {
    const weight = weightKg();
    const height = heightMeters() * 100; // cm
    const age = parseInt(inputs.age || "0");
    if (weight === 0 || height === 0 || age === 0) return 0;

    if (inputs.sex === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161;
    }
  }

  // Helper: Activity factor based on activity level
  function activityFactor() {
    switch (inputs.activityLevel) {
      case "sedentary":
        return 1.2;
      case "light":
        return 1.375;
      case "moderate":
        return 1.55;
      case "active":
        return 1.725;
      case "very active":
        return 1.9;
      default:
        return 1.2;
    }
  }

  // 2. LOGIC
  const results = useMemo(() => {
    // Validate inputs
    const weight = weightKg();
    const height = heightMeters();
    const age = parseInt(inputs.age || "0");
    if (weight === 0 || height === 0 || age === 0) {
      return { value: 0, label: "Please enter valid inputs", category: "" };
    }

    // Calculate Total Daily Energy Expenditure (TDEE)
    const bmr = calculateBMR();
    const tdee = bmr * activityFactor();

    // Use user input totalCalories if provided and valid
    const totalCalories = parseFloat(inputs.totalCalories || "");
    const calories = totalCalories > 0 ? totalCalories : tdee;

    // AMDR for fat: 20-35% of total calories from fat (per Health Canada & US Dietary Guidelines)
    // 1 gram fat = 9 kcal
    const fatMinCalories = calories * 0.20;
    const fatMaxCalories = calories * 0.35;
    const fatMinGrams = fatMinCalories / 9;
    const fatMaxGrams = fatMaxCalories / 9;

    // Format results with 1 decimal place
    const fatMinGramsFormatted = fatMinGrams.toFixed(1);
    const fatMaxGramsFormatted = fatMaxGrams.toFixed(1);

    return {
      value: `${fatMinGramsFormatted} - ${fatMaxGramsFormatted} g`,
      label: `Recommended Fat Intake Range (20-35% of total calories)`,
      category: "AMDR",
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Acceptable Macronutrient Distribution Range (AMDR) for fat?",
      answer:
        "The AMDR for fat is a range of intake that is associated with reduced risk of chronic diseases while providing adequate essential fatty acids and fat-soluble vitamins. For adults, Health Canada and the US Dietary Guidelines recommend that 20-35% of total daily calories come from fat. This range supports hormonal health, brain function, and satiety.",
    },
    {
      question: "How do I interpret my fat intake range result?",
      answer:
        "The result shows the recommended daily fat intake in grams based on your estimated total daily calorie needs. Staying within this range helps ensure you consume enough fat for essential bodily functions without exceeding calories that could lead to weight gain. Adjust your fat intake according to your health goals and dietary preferences.",
    },
    {
      question: "Can I use this calculator if I don't know my total daily calories?",
      answer:
        "Yes. If you do not input your total daily calories, the calculator estimates your calorie needs using the Mifflin-St Jeor equation for Basal Metabolic Rate (BMR) adjusted by your activity level. For more precise results, you can input your known calorie intake.",
    },
    {
      question: "Are all fats equally healthy within the AMDR?",
      answer:
        "No. While the AMDR defines the total fat intake range, the quality of fats matters. Unsaturated fats from sources like nuts, seeds, fish, and vegetable oils are beneficial, whereas trans fats and excessive saturated fats should be limited. Balancing fat types supports cardiovascular and metabolic health.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) {
    setInputs((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  }

  // Reset inputs
  function resetInputs() {
    setInputs({
      weight: "",
      heightFeet: "",
      heightInches: "",
      heightCm: "",
      age: "",
      sex: "female",
      activityLevel: "sedentary",
      totalCalories: "",
    });
  }

  const widget = (
    <div className="space-y-6">
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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={1}
            step="any"
            value={inputs.weight}
            onChange={(e) => handleInputChange(e, "weight")}
            placeholder={unit === "imperial" ? "e.g., 150" : "e.g., 68"}
          />
        </div>

        {/* Height Inputs */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                Height (feet)
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={0}
                step="1"
                value={inputs.heightFeet}
                onChange={(e) => handleInputChange(e, "heightFeet")}
                placeholder="5"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                Height (inches)
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                step="1"
                value={inputs.heightInches}
                onChange={(e) => handleInputChange(e, "heightInches")}
                placeholder="8"
              />
            </div>
          </div>
        ) : (
          <div>
            <Label htmlFor="heightCm" className="text-slate-700 dark:text-slate-300">
              Height (cm)
            </Label>
            <Input
              id="heightCm"
              type="number"
              min={1}
              step="any"
              value={inputs.heightCm}
              onChange={(e) => handleInputChange(e, "heightCm")}
              placeholder="e.g., 173"
            />
          </div>
        )}

        {/* Age Input */}
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (years)
          </Label>
          <Input
            id="age"
            type="number"
            min={1}
            step="1"
            value={inputs.age}
            onChange={(e) => handleInputChange(e, "age")}
            placeholder="e.g., 30"
          />
        </div>

        {/* Sex Select */}
        <div>
          <Label htmlFor="sex" className="text-slate-700 dark:text-slate-300">
            Sex
          </Label>
          <select
            id="sex"
            value={inputs.sex}
            onChange={(e) => handleInputChange(e, "sex")}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        {/* Activity Level Select */}
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <select
            id="activityLevel"
            value={inputs.activityLevel}
            onChange={(e) => handleInputChange(e, "activityLevel")}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-2"
          >
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Lightly active (light exercise 1-3 days/week)</option>
            <option value="moderate">Moderately active (moderate exercise 3-5 days/week)</option>
            <option value="active">Active (hard exercise 6-7 days/week)</option>
            <option value="very active">Very active (very hard exercise & physical job)</option>
          </select>
        </div>

        {/* Optional Total Calories Input */}
        <div>
          <Label htmlFor="totalCalories" className="text-slate-700 dark:text-slate-300">
            Total Daily Calories (optional)
          </Label>
          <Input
            id="totalCalories"
            type="number"
            min={0}
            step="any"
            value={inputs.totalCalories}
            onChange={(e) => handleInputChange(e, "totalCalories")}
            placeholder="e.g., 2000"
          />
          <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-1">
            If left blank, estimated calories will be used.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={resetInputs}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && results.value !== "Please enter valid inputs" && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Show validation message if inputs invalid */}
      {results.value === "Please enter valid inputs" && (
        <p className="text-red-600 dark:text-red-400 font-semibold mt-4 text-center">
          Please fill in all required fields with valid values.
        </p>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Fat Intake Range (AMDR)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Acceptable Macronutrient Distribution Range (AMDR) for fat is a scientifically
          established range of daily fat intake expressed as a percentage of total calories.
          It is designed to provide adequate essential fatty acids and fat-soluble vitamins
          while minimizing the risk of chronic diseases such as cardiovascular disease and
          obesity. In both Canada and the United States, the AMDR for fat for adults is set
          between 20% and 35% of total daily calories.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dietary fats play crucial roles beyond energy provision. They are vital for hormone
          production, cell membrane integrity, brain function, and absorption of fat-soluble
          vitamins (A, D, E, and K). Consuming fats within the AMDR supports these physiological
          functions while helping maintain a healthy weight and metabolic profile. Deviating
          significantly below or above this range can lead to nutrient deficiencies or increased
          health risks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The AMDR is not a fixed target but a flexible range that can be adjusted based on
          individual health goals, medical conditions, and dietary preferences. For example,
          athletes or individuals on ketogenic diets may consume fat at the higher end or
          slightly above the AMDR, while others focusing on weight loss might aim for the
          lower end. This calculator helps you estimate your personalized fat intake range
          based on your calorie needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to emphasize not only the quantity but also the quality of fats
          consumed. Unsaturated fats from sources like nuts, seeds, avocados, and fatty fish
          are encouraged, whereas trans fats and excessive saturated fats should be limited
          to promote cardiovascular health.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates your recommended daily fat intake range in grams based
          on your personal characteristics and lifestyle. It uses your weight, height, age,
          sex, and activity level to estimate your total daily calorie needs, then calculates
          20-35% of those calories as fat calories and converts them to grams.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight:</strong> Enter your current weight in pounds (lbs) or kilograms (kg)
            depending on your selected unit system.
          </li>
          <li>
            <strong>Height:</strong> Enter your height in feet and inches (imperial) or centimeters
            (metric).
          </li>
          <li>
            <strong>Age and Sex:</strong> Provide your age in years and select your biological sex,
            which affects basal metabolic rate calculations.
          </li>
          <li>
            <strong>Activity Level:</strong> Choose your typical daily activity level to adjust
            your calorie needs accordingly.
          </li>
          <li>
            <strong>Total Daily Calories (optional):</strong> If you know your exact daily calorie
            intake, enter it here to get a more precise fat intake range.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering your information, click "Calculate" to see your personalized fat intake
          range. Use this range to guide your dietary fat consumption for optimal health.
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
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
              href="https://www.canada.ca/en/health-canada/services/food-nutrition/healthy-eating/dietary-reference-intakes/energy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Health Canada - Dietary Reference Intakes for Energy
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official Canadian guidelines on energy and macronutrient intake ranges.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nal.usda.gov/fnic/dietary-reference-intakes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. USDA Dietary Reference Intakes (DRIs)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive nutrient intake recommendations from the US National Academies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/eat/calories.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. NIH - Calories and Weight Management
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Information on calorie needs and macronutrient distribution from the National Heart, Lung, and Blood Institute.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.healthline.com/nutrition/healthy-fats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Healthline - Healthy Fats Explained
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Educational content on types of fats and their health impacts.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fat Intake Range (AMDR)"
      description="Determine healthy fat intake ranges based on AMDR. Ensure hormonal health and satiety by consuming the right amount of dietary fats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Fat Intake Range (g) = (Total Calories × Fat % Range) ÷ 9 kcal/g",
        variables: [
          {
            symbol: "Total Calories",
            description:
              "Your estimated or actual total daily calorie intake (kcal)",
          },
          {
            symbol: "Fat % Range",
            description:
              "Acceptable Macronutrient Distribution Range for fat (20% to 35%)",
          },
          {
            symbol: "9 kcal/g",
            description: "Calories per gram of fat",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 30-year-old female, 5 feet 6 inches tall, weighing 150 lbs, moderately active, with estimated daily calories of 2,000 kcal.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate total calories (estimated as 2,000 kcal based on inputs).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate fat intake range: 20-35% of 2,000 kcal = 400-700 kcal from fat.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert calories to grams: 400 ÷ 9 = 44.4 g, 700 ÷ 9 = 77.8 g fat per day.",
          },
        ],
        result:
          "Recommended fat intake range: approximately 44 to 78 grams per day.",
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
        { id: "what-is", label: "What is Fat Intake Range (AMDR)?" },
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