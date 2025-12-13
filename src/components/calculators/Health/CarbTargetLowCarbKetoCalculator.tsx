import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CarbTargetLowCarbKetoCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "", // lbs or kg
    heightFeet: "", // feet (imperial only)
    heightInches: "", // inches (imperial only)
    heightCm: "", // cm (metric only)
    activityLevel: "sedentary", // sedentary, light, moderate, active, very-active
    goal: "maintenance", // maintenance, weight-loss, keto, low-carb
  });

  // Activity multipliers for carb needs estimation (approximate)
  const activityMultipliers: Record<string, number> = {
    sedentary: 0.8,
    light: 1.0,
    moderate: 1.2,
    active: 1.4,
    "very-active": 1.6,
  };

  // Carb ranges in grams per day for different goals
  // Keto: 20-50g, Low-Carb: 50-130g, Maintenance: 130-300g (varies)
  // We'll estimate based on weight and activity

  // 2. LOGIC
  const results = useMemo(() => {
    // Validate inputs
    let weightLbs: number;
    let heightInchesTotal: number | null = null;

    if (unit === "imperial") {
      weightLbs = parseFloat(inputs.weight);
      const feet = parseFloat(inputs.heightFeet);
      const inches = parseFloat(inputs.heightInches);
      if (
        isNaN(weightLbs) ||
        weightLbs <= 0 ||
        isNaN(feet) ||
        feet < 0 ||
        isNaN(inches) ||
        inches < 0
      ) {
        return { value: 0, label: "Please enter valid weight and height.", category: "" };
      }
      heightInchesTotal = feet * 12 + inches;
    } else {
      // metric
      const weightKg = parseFloat(inputs.weight);
      const heightCm = parseFloat(inputs.heightCm);
      if (
        isNaN(weightKg) ||
        weightKg <= 0 ||
        isNaN(heightCm) ||
        heightCm <= 0
      ) {
        return { value: 0, label: "Please enter valid weight and height.", category: "" };
      }
      weightLbs = weightKg * 2.20462;
      heightInchesTotal = heightCm / 2.54;
    }

    // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor (approximate)
    // For carb target, BMR helps estimate energy needs.
    // Since gender not provided, use average: 10*weight(kg) + 6.25*height(cm) - 5*age + 5 (male) or -161 (female)
    // Without age/gender, approximate BMR = 24 * weight(kg)
    const weightKg = weightLbs / 2.20462;
    const heightCm = heightInchesTotal * 2.54;

    // Approximate BMR (kcal/day)
    const bmr = 24 * weightKg;

    // Activity factor
    const activityFactor = activityMultipliers[inputs.activityLevel] || 1.0;

    // Total Daily Energy Expenditure (TDEE)
    const tdee = bmr * activityFactor;

    // Carb target calculation based on goal
    // Carb grams = % of calories from carbs / 4 (calories per gram of carb)
    // Typical calorie % from carbs:
    // Keto: 5-10% (20-50g)
    // Low-Carb: 10-25% (50-130g)
    // Maintenance: 45-65% (130-300g)
    // Weight loss moderate carb: 20-40%

    let carbMin = 0;
    let carbMax = 0;
    let label = "";
    let category = "";

    switch (inputs.goal) {
      case "keto":
        // 5-10% calories from carbs
        carbMin = Math.round((tdee * 0.05) / 4);
        carbMax = Math.round((tdee * 0.10) / 4);
        label = `Ketogenic Range: ${carbMin}g - ${carbMax}g carbs/day`;
        category = "Keto";
        break;
      case "low-carb":
        // 10-25% calories from carbs
        carbMin = Math.round((tdee * 0.10) / 4);
        carbMax = Math.round((tdee * 0.25) / 4);
        label = `Low-Carb Range: ${carbMin}g - ${carbMax}g carbs/day`;
        category = "Low-Carb";
        break;
      case "weight-loss":
        // Moderate carb for weight loss: 20-40%
        carbMin = Math.round((tdee * 0.20) / 4);
        carbMax = Math.round((tdee * 0.40) / 4);
        label = `Weight Loss Range: ${carbMin}g - ${carbMax}g carbs/day`;
        category = "Weight Loss";
        break;
      case "maintenance":
      default:
        // Balanced diet: 45-65%
        carbMin = Math.round((tdee * 0.45) / 4);
        carbMax = Math.round((tdee * 0.65) / 4);
        label = `Maintenance Range: ${carbMin}g - ${carbMax}g carbs/day`;
        category = "Maintenance";
        break;
    }

    // Show range as "min - max"
    return {
      value: `${carbMin} - ${carbMax}`,
      label,
      category,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "What is the Carb Target and why is it important?",
      answer:
        "The Carb Target represents the recommended daily intake of carbohydrates tailored to your personal goals, activity level, and body metrics. Carbohydrates are a primary energy source, and adjusting your intake can influence weight management, metabolic health, and athletic performance. Setting an appropriate carb target helps optimize energy levels while supporting your dietary preferences, such as ketogenic or low-carb diets.",
    },
    {
      question: "How do low-carb and ketogenic ranges differ in carbohydrate intake?",
      answer:
        "Ketogenic diets typically restrict carbohydrate intake to about 5-10% of daily calories (roughly 20-50 grams per day) to induce ketosis, a metabolic state where the body burns fat for fuel. Low-carb diets are less restrictive, allowing 10-25% of calories from carbs (approximately 50-130 grams daily), focusing on reducing carb intake without necessarily inducing ketosis. Both approaches aim to improve metabolic health but differ in strictness and physiological effects.",
    },
    {
      question: "Can I use this calculator if I don’t know my exact activity level?",
      answer:
        "Yes, you can select the activity level that best matches your typical daily routine. If unsure, 'sedentary' or 'light' activity levels are safe defaults. Activity level influences your total energy expenditure and thus your carbohydrate needs. For more precise results, consider tracking your physical activity or consulting with a healthcare professional.",
    },
    {
      question: "Are there limitations to this calculator’s recommendations?",
      answer:
        "This calculator provides estimates based on general population data and simplified formulas. It does not account for individual factors such as age, gender, metabolic conditions, or specific health goals beyond weight management and diet type. For personalized nutrition advice, especially if you have medical conditions or special dietary needs, consult a registered dietitian or healthcare provider.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={(value) => {
            setUnit(value);
            setInputs({
              weight: "",
              heightFeet: "",
              heightInches: "",
              heightCm: "",
              activityLevel: "sedentary",
              goal: "maintenance",
            });
          }}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
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
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        {/* Height Input */}
        {unit === "imperial" ? (
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="heightFeet" className="text-slate-700 dark:text-slate-300">
                Height - Feet
              </Label>
              <Input
                id="heightFeet"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 5"
                value={inputs.heightFeet}
                onChange={(e) => setInputs((prev) => ({ ...prev, heightFeet: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="heightInches" className="text-slate-700 dark:text-slate-300">
                Height - Inches
              </Label>
              <Input
                id="heightInches"
                type="number"
                min={0}
                max={11}
                step="1"
                placeholder="e.g. 8"
                value={inputs.heightInches}
                onChange={(e) => setInputs((prev) => ({ ...prev, heightInches: e.target.value }))}
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
              min={0}
              step="any"
              placeholder="e.g. 173"
              value={inputs.heightCm}
              onChange={(e) => setInputs((prev) => ({ ...prev, heightCm: e.target.value }))}
            />
          </div>
        )}

        {/* Activity Level */}
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            value={inputs.activityLevel}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, activityLevel: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
              <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
              <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
              <SelectItem value="very-active">Very active (very hard exercise & physical job)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Goal */}
        <div>
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Dietary Goal
          </Label>
          <Select
            id="goal"
            value={inputs.goal}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, goal: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance (balanced carbs)</SelectItem>
              <SelectItem value="weight-loss">Weight Loss (moderate carb)</SelectItem>
              <SelectItem value="low-carb">Low-Carb</SelectItem>
              <SelectItem value="keto">Ketogenic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              heightFeet: "",
              heightInches: "",
              heightCm: "",
              activityLevel: "sedentary",
              goal: "maintenance",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Carb Target (incl. low-carb/keto ranges)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The carbohydrate target is a personalized daily goal for carbohydrate intake designed to align with your health objectives, lifestyle, and metabolic needs. Carbohydrates are one of the three macronutrients that provide energy, and their intake significantly influences blood sugar levels, insulin response, and overall energy metabolism. Setting a carb target helps individuals manage weight, optimize athletic performance, or achieve specific metabolic states such as ketosis.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Low-carbohydrate and ketogenic diets have gained popularity for their potential benefits in weight management, diabetes control, and neurological health. A ketogenic diet typically restricts carbohydrate intake to about 20-50 grams per day, inducing a metabolic state called ketosis where the body burns fat for fuel instead of glucose. Low-carb diets are less restrictive, allowing a broader range of carbohydrate intake, generally between 50 and 130 grams daily, focusing on reducing refined carbs and sugars.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates your ideal carbohydrate intake range based on your weight, height, activity level, and dietary goals. It uses established nutritional science principles to provide ranges suitable for maintenance, weight loss, low-carb, and ketogenic diets. Understanding these ranges empowers you to make informed dietary choices tailored to your unique physiology and lifestyle.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to remember that carbohydrate needs vary widely among individuals depending on factors such as age, gender, metabolic health, and physical activity. Therefore, this tool serves as a starting point for personalized nutrition planning and should be complemented with professional guidance when necessary.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your daily carbohydrate target, follow these steps carefully. The calculator requires your body measurements, activity level, and dietary goal to provide a tailored carb intake range. This ensures the recommendations align with your energy expenditure and metabolic objectives.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Weight:</strong> Enter your current body weight in pounds (lbs) if using the imperial system or kilograms (kg) for metric. Accurate weight input is essential for estimating energy needs.
          </li>
          <li>
            <strong>Height:</strong> Provide your height in feet and inches (imperial) or centimeters (metric). Height helps estimate basal metabolic rate (BMR), a key factor in calculating energy requirements.
          </li>
          <li>
            <strong>Activity Level:</strong> Select the option that best describes your typical daily physical activity. This adjusts your total daily energy expenditure (TDEE), influencing your carbohydrate needs.
          </li>
          <li>
            <strong>Dietary Goal:</strong> Choose your nutrition goal: maintenance, weight loss, low-carb, or ketogenic. This determines the carbohydrate percentage range used in calculations.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering all inputs, click "Calculate" to view your personalized carbohydrate intake range. Use this information to guide meal planning and monitor your dietary adherence. Remember to consult healthcare professionals for tailored advice.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Trusted References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2716748/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Feinman RD et al. Dietary carbohydrate restriction as the first approach in diabetes management: Critical review and evidence base. (2015)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              A comprehensive review supporting low-carb diets for diabetes and metabolic health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ketogenic-diet-resource.com/ketogenic-diet.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. The Charlie Foundation. Ketogenic Diet Overview.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative resource on ketogenic diet principles and clinical applications.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nhlbi.nih.gov/health/educational/lose_wt/eat/calories.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Heart, Lung, and Blood Institute. Calculate Your Calorie Needs.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official guidelines on estimating calorie needs based on activity and body metrics.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.healthline.com/nutrition/how-many-carbs-per-day"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Healthline. How Many Carbs Per Day? A Guide to Carb Intake.
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Practical advice on carbohydrate intake ranges for different diet goals.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Carb Target (incl. low-carb/keto ranges)"
      description="Set your daily carbohydrate target. Perfect for planning Low-Carb, Keto, or balanced diets to fuel your energy needs effectively."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Carb grams per day = (TDEE × % calories from carbs) ÷ 4",
        variables: [
          { symbol: "TDEE", description: "Total Daily Energy Expenditure (calories/day)" },
          { symbol: "% calories from carbs", description: "Desired percentage of daily calories from carbohydrates" },
          { symbol: "4", description: "Calories per gram of carbohydrate" },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John weighs 180 lbs, is 5 ft 10 in tall, moderately active, and wants to follow a ketogenic diet.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate John's TDEE: Approximate BMR = 24 × (180 lbs ÷ 2.20462) ≈ 1960 kcal; TDEE = 1960 × 1.2 (moderate activity) = 2352 kcal.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate carb range for keto (5-10% calories): Min = (2352 × 0.05) ÷ 4 ≈ 29 g; Max = (2352 × 0.10) ÷ 4 ≈ 59 g carbs/day.",
          },
        ],
        result: "John's recommended ketogenic carb intake is approximately 29 to 59 grams per day.",
      }}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "💧" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "🥗" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "😴" },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Carb Target (incl. low-carb/keto ranges)?" },
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