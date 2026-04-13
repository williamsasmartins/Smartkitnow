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
      question: "What is the AMDR and why is it important for fat intake?",
      answer: "The Acceptable Macronutrient Distribution Range (AMDR) for fat is 20-35% of your total daily calories, as established by the National Academy of Medicine. This range is based on scientific research showing that consuming fat within this window supports heart health, hormone production, and nutrient absorption while reducing disease risk. The AMDR provides evidence-based guidance that accounts for individual variation in dietary needs and preferences.",
    },
    {
      question: "How do I calculate my daily fat intake range in grams?",
      answer: "First, determine your total daily calorie needs (typically 1,600-2,400 calories for women and 2,000-3,000 for men). Then multiply your calorie target by 0.20 and 0.35 to get the 20-35% range, then divide by 9 (since fat contains 9 calories per gram). For example, a 2,000-calorie diet means 400-700 calories from fat, or approximately 44-78 grams of fat daily.",
    },
    {
      question: "Is the AMDR the same for all age groups?",
      answer: "The 20-35% AMDR applies to children ages 4 and older, as well as adults. However, infants and toddlers (0-3 years) have higher fat requirements because their developing brains need more fat for optimal growth and cognitive development. For infants, 30-40% of calories should come from fat, reflecting their unique nutritional needs during critical developmental stages.",
    },
    {
      question: "Can I consume fat below the 20% AMDR minimum?",
      answer: "While some very low-fat diets may fall below 20%, going significantly lower (&lt;15%) can impair absorption of fat-soluble vitamins (A, D, E, K) and reduce hormone production. The 20% minimum is set to ensure adequate essential fatty acid intake (omega-3 and omega-6) and optimal nutrient bioavailability. If considering a low-fat diet for medical reasons, consult a registered dietitian to ensure nutritional adequacy.",
    },
    {
      question: "What happens if I exceed the 35% AMDR upper limit?",
      answer: "Consuming more than 35% of calories from fat consistently may increase intake of saturated fat and calories, potentially raising cholesterol levels and contributing to weight gain. However, short-term excursions above 35% are not problematic; the AMDR is a long-term guideline. The quality of fat matters—emphasizing unsaturated fats over saturated fats (&lt;10% of calories) is more important than staying strictly within the range.",
    },
    {
      question: "How does the AMDR differ from daily fat intake limits recommended by other organizations?",
      answer: "The American Heart Association recommends limiting saturated fat to &lt;7% of total calories and keeping total fat at 25-35%, which aligns closely with the AMDR. The AMDR is broader and focuses on overall macronutrient balance, while organizations like the AHA emphasize fat quality (saturated vs. unsaturated). Both frameworks agree that the 20-35% range supports health when fat sources are primarily unsaturated.",
    },
    {
      question: "Should athletes follow the standard AMDR for fat intake?",
      answer: "Athletes can use the standard 20-35% AMDR as a starting point, but some evidence suggests 25-30% may optimize performance and recovery for endurance and strength athletes. Individual fat needs vary based on training intensity, sport type, and overall calorie expenditure. A sports nutritionist can help athletes personalize their fat intake to support performance while maintaining energy balance.",
    },
    {
      question: "How do I adjust my fat intake if I'm trying to lose weight?",
      answer: "Fat intake should remain within the 20-35% AMDR even during weight loss, though your total calorie intake will be lower. For example, a 1,500-calorie weight-loss diet would allow 33-52 grams of fat daily (maintaining the percentage). Prioritizing protein and fiber-rich carbohydrates within your calorie deficit helps maintain satiety while staying within the AMDR.",
    },
    {
      question: "What are essential fatty acids and why are they part of the AMDR?",
      answer: "Essential fatty acids—alpha-linolenic acid (omega-3) and linoleic acid (omega-6)—cannot be synthesized by the body and must come from food. The 20% AMDR minimum ensures adequate intake of these critical nutrients needed for brain function, inflammation control, and cardiovascular health. Meeting the 20% threshold with whole food sources like nuts, seeds, fish, and oils naturally provides sufficient essential fatty acids for most people.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Fat Intake Range (AMDR) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Fat Intake Range (AMDR) calculator helps you determine the optimal amount of fat you should consume daily based on your total calorie intake. The AMDR recommends that 20-35% of your daily calories come from fat—a range supported by decades of nutrition research and endorsed by the National Academy of Medicine. Understanding your personal fat intake range is essential for balanced nutrition, heart health, and achieving fitness or weight management goals.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, you'll need to input your total daily calorie intake (which depends on your age, sex, activity level, and goals). The calculator will automatically compute your fat range in both percentage of calories and grams per day. Since fat contains 9 calories per gram, the calculator converts your calorie range into practical gram amounts you can use when reading nutrition labels and planning meals.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret your results as a daily target range rather than a strict limit. For example, if the calculator shows 44-78 grams of fat for a 2,000-calorie diet, aim to consume fat within this range on most days—slight variations are normal. The quality of fat matters significantly: prioritize unsaturated fats (olive oil, nuts, fish) over saturated fats, keep saturated fat below 10% of calories (&lt;22g in a 2,000-calorie diet), and minimize trans fats for optimal cardiovascular health.</p>
        </div>
      </section>

      {/* TABLE: Daily Fat Intake Ranges by Calorie Level (AMDR 20-35%) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Fat Intake Ranges by Calorie Level (AMDR 20-35%)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the recommended daily fat intake in grams across common calorie targets using the AMDR formula.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Daily Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20% AMDR (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">27.5% AMDR (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">35% AMDR (grams)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">47</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">46</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">58</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">61</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">49</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">86</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">77</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">97</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">86</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">109</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">117</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values calculated using the formula: (Calories × Percentage) ÷ 9 calories/gram. The 27.5% midpoint represents the center of the AMDR range.</p>
      </section>

      {/* TABLE: Fat Content in Common Foods (per typical serving) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Fat Content in Common Foods (per typical serving)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference to understand how different foods contribute to your daily AMDR fat intake.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calories from Fat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Olive oil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tablespoon (14g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Almonds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 ounce (23 nuts)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">127</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Salmon, cooked</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 ounces (85g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Avocado</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">½ medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">107</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peanut butter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 tablespoons (32g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">144</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Whole egg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ground beef (85% lean)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 ounces (85g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">135</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cheddar cheese</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 ounce (28g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">81</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Greek yogurt (full-fat)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 ounces (200g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Data reflects USDA nutrition database values. Serving sizes are typical portions; actual fat content may vary by brand and preparation method.</p>
      </section>

      {/* TABLE: Saturated vs. Unsaturated Fat Recommendations (as % of total calories) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Saturated vs. Unsaturated Fat Recommendations (as % of total calories)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how to balance fat types while staying within the AMDR, following guidelines from the American Heart Association and National Academy of Medicine.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Saturated Fat Limit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example Daily Limit (2,000 cal)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Total Fat (AMDR)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44-78 grams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Saturated Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Less than 10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;10% calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;22 grams</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Monounsaturated Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to 20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No upper limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Up to 44 grams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Polyunsaturated Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No upper limit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-22 grams</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Trans Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimize</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;1% calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;2 grams</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages shown are evidence-based recommendations that support cardiovascular health. Meeting AMDR while limiting saturated fat to &lt;10% requires choosing primarily unsaturated fat sources.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Focus on fat quality within your AMDR range—emphasize monounsaturated fats (olive oil, avocados, nuts) and polyunsaturated fats (fatty fish, flaxseeds) over saturated fats to support heart health and stay within the American Heart Association's &lt;10% saturated fat recommendation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator result as a flexible range rather than a rigid target; achieving 20-35% of calories from fat over a week is more important than hitting exact daily numbers, allowing for day-to-day variation while maintaining nutritional balance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pair your AMDR fat range with adequate fiber and protein to enhance satiety and prevent overeating; consuming fat alongside vegetables, whole grains, and lean proteins helps create balanced meals that support your energy and health goals.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track fat intake using nutrition apps like MyFitnessPal or Cronometer for 3-5 days to see if your natural eating patterns fall within the calculated AMDR range; this baseline helps identify whether you need to adjust food choices or portions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing AMDR percentage with actual daily limit</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The AMDR 20-35% refers to the percentage of total calories, not a daily gram limit that applies universally. A 1,500-calorie diet requires 33-58 grams of fat, while a 2,500-calorie diet requires 56-97 grams—the same percentage translates to different gram amounts based on your calorie needs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all fat counts equally toward AMDR</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While any fat source contributes to your AMDR percentage, the type of fat significantly affects health outcomes. Consuming 78 grams of saturated fat daily stays within the AMDR but violates the &lt;10% saturated fat guideline; balance your AMDR with fat quality by choosing unsaturated sources.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring essential fatty acid requirements when minimizing fat</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dropping below 20% AMDR to very low levels (&lt;15%) increases risk of omega-3 and omega-6 deficiency, potentially impairing brain function, hormone production, and nutrient absorption. The 20% minimum exists specifically to ensure adequate essential fatty acid intake.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using outdated low-fat diet principles instead of AMDR guidance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Older weight-loss advice recommended very low-fat diets (&lt;20%), but current evidence shows the AMDR 20-35% range is more sustainable and effective. Research demonstrates that moderate-fat, balanced diets are superior for long-term weight loss and metabolic health compared to severely restricted fat intake.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the AMDR and why is it important for fat intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The Acceptable Macronutrient Distribution Range (AMDR) for fat is 20-35% of your total daily calories, as established by the National Academy of Medicine. This range is based on scientific research showing that consuming fat within this window supports heart health, hormone production, and nutrient absorption while reducing disease risk. The AMDR provides evidence-based guidance that accounts for individual variation in dietary needs and preferences.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate my daily fat intake range in grams?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">First, determine your total daily calorie needs (typically 1,600-2,400 calories for women and 2,000-3,000 for men). Then multiply your calorie target by 0.20 and 0.35 to get the 20-35% range, then divide by 9 (since fat contains 9 calories per gram). For example, a 2,000-calorie diet means 400-700 calories from fat, or approximately 44-78 grams of fat daily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is the AMDR the same for all age groups?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The 20-35% AMDR applies to children ages 4 and older, as well as adults. However, infants and toddlers (0-3 years) have higher fat requirements because their developing brains need more fat for optimal growth and cognitive development. For infants, 30-40% of calories should come from fat, reflecting their unique nutritional needs during critical developmental stages.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I consume fat below the 20% AMDR minimum?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While some very low-fat diets may fall below 20%, going significantly lower (&lt;15%) can impair absorption of fat-soluble vitamins (A, D, E, K) and reduce hormone production. The 20% minimum is set to ensure adequate essential fatty acid intake (omega-3 and omega-6) and optimal nutrient bioavailability. If considering a low-fat diet for medical reasons, consult a registered dietitian to ensure nutritional adequacy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I exceed the 35% AMDR upper limit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Consuming more than 35% of calories from fat consistently may increase intake of saturated fat and calories, potentially raising cholesterol levels and contributing to weight gain. However, short-term excursions above 35% are not problematic; the AMDR is a long-term guideline. The quality of fat matters—emphasizing unsaturated fats over saturated fats (&lt;10% of calories) is more important than staying strictly within the range.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the AMDR differ from daily fat intake limits recommended by other organizations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The American Heart Association recommends limiting saturated fat to &lt;7% of total calories and keeping total fat at 25-35%, which aligns closely with the AMDR. The AMDR is broader and focuses on overall macronutrient balance, while organizations like the AHA emphasize fat quality (saturated vs. unsaturated). Both frameworks agree that the 20-35% range supports health when fat sources are primarily unsaturated.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should athletes follow the standard AMDR for fat intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Athletes can use the standard 20-35% AMDR as a starting point, but some evidence suggests 25-30% may optimize performance and recovery for endurance and strength athletes. Individual fat needs vary based on training intensity, sport type, and overall calorie expenditure. A sports nutritionist can help athletes personalize their fat intake to support performance while maintaining energy balance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I adjust my fat intake if I'm trying to lose weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fat intake should remain within the 20-35% AMDR even during weight loss, though your total calorie intake will be lower. For example, a 1,500-calorie weight-loss diet would allow 33-52 grams of fat daily (maintaining the percentage). Prioritizing protein and fiber-rich carbohydrates within your calorie deficit helps maintain satiety while staying within the AMDR.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are essential fatty acids and why are they part of the AMDR?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Essential fatty acids—alpha-linolenic acid (omega-3) and linoleic acid (omega-6)—cannot be synthesized by the body and must come from food. The 20% AMDR minimum ensures adequate intake of these critical nutrients needed for brain function, inflammation control, and cardiovascular health. Meeting the 20% threshold with whole food sources like nuts, seeds, fish, and oils naturally provides sufficient essential fatty acids for most people.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/13050/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids — National Academies of Sciences, Engineering, and Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The authoritative scientific source for AMDR macronutrient recommendations, including the 20-35% fat range endorsed by nutrition science.</p>
          </li>
          <li>
            <a href="https://www.dietaryguidelines.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dietary Guidelines for Americans 2020-2025 — U.S. Department of Agriculture and Department of Health and Human Services</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official U.S. government nutrition guidelines that align with AMDR recommendations for fat intake as part of a healthy eating pattern.</p>
          </li>
          <li>
            <a href="https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/nutrition-basics/saturated-fats" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Heart Association Dietary Recommendations for Cardiovascular Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on fat quality and saturated fat limits that complement the AMDR for cardiovascular disease prevention.</p>
          </li>
          <li>
            <a href="https://www.fatsecret.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FatSecret Nutrition Database — Comprehensive Food Composition Reference</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Reliable online resource for looking up fat content and macronutrient composition of thousands of foods to track against your AMDR range.</p>
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