import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogDailyWaterIntakeCheckerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    activityLevel: "normal",
    dietType: "dry", // dry food or wet food affects water intake
  });

  // 2. LOGIC ENGINE
  /**
   * Veterinary basis:
   * Dogs require approximately 50-60 ml of water per kg of body weight daily as a baseline.
   * Activity level and diet type influence this:
   * - Active dogs need ~10-20% more water.
   * - Dogs eating wet food need less additional water since wet food contains moisture.
   * 
   * Formula:
   * BaseWaterIntake (ml) = weightKg * 60
   * ActivityMultiplier = 1.0 (normal), 1.2 (active), 1.4 (very active)
   * DietAdjustment = 1.0 (dry food), 0.8 (wet food)
   * 
   * TotalWaterIntake = BaseWaterIntake * ActivityMultiplier * DietAdjustment
   */
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid weight to calculate water intake",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Activity multiplier
    let activityMultiplier = 1.0;
    switch (inputs.activityLevel) {
      case "normal":
        activityMultiplier = 1.0;
        break;
      case "active":
        activityMultiplier = 1.2;
        break;
      case "very_active":
        activityMultiplier = 1.4;
        break;
      default:
        activityMultiplier = 1.0;
    }

    // Diet adjustment
    const dietAdjustment = inputs.dietType === "wet" ? 0.8 : 1.0;

    // Base water intake ml/kg
    const baseWaterMlPerKg = 60;

    // Calculate total water intake in ml
    const totalWaterMl = weightKg * baseWaterMlPerKg * activityMultiplier * dietAdjustment;

    // Convert to cups (1 cup = 240 ml) if imperial
    const totalWaterCups = totalWaterMl / 240;

    // Format results
    const value =
      unit === "imperial"
        ? totalWaterCups.toFixed(2) + " cups"
        : totalWaterMl.toFixed(0) + " ml";

    const label = `Estimated daily water intake for your dog (${unit === "imperial" ? "cups" : "milliliters"})`;

    // Warning if water intake is very high or low (arbitrary thresholds)
    let warning = null;
    if (totalWaterMl < 200) {
      warning =
        "This estimated water intake is quite low. Ensure your dog is drinking enough, especially in hot weather or if ill.";
    } else if (totalWaterMl > 5000) {
      warning =
        "This estimated water intake is very high. If your dog is drinking excessively, consult a veterinarian to rule out health issues.";
    }

    return {
      value,
      label,
      subtext:
        "Based on weight, activity level, and diet type. Adjust as needed for environmental factors.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How much water should my dog drink daily?",
      answer: "Most dogs need about 0.5 to 1 ounce of water per pound of body weight daily. A 50-pound dog typically requires 25–50 ounces (0.75–1.5 liters) per day, adjusted for activity level and climate.",
    },
    {
      question: "Does the Dog Daily Water Intake Checker account for exercise level?",
      answer: "Yes, this calculator factors in your dog's activity level. Active and working dogs may need 25–50% more water than sedentary dogs to compensate for fluid loss through panting and sweating.",
    },
    {
      question: "What if my dog eats wet food instead of dry kibble?",
      answer: "Wet food contains 70–80% moisture, reducing additional water needs by up to 25%. The calculator can be adjusted for diet type to provide accurate estimates.",
    },
    {
      question: "Should I increase water intake during hot weather?",
      answer: "Absolutely—dogs in hot climates or summer months may need 50% more water than baseline to prevent dehydration and maintain proper body temperature.",
    },
    {
      question: "How do I know if my dog is drinking enough water?",
      answer: "Check skin elasticity, urine color (pale yellow is ideal), and energy levels. Dark urine or lethargy may indicate insufficient hydration.",
    },
    {
      question: "Can puppies and senior dogs have different water needs?",
      answer: "Yes—puppies need more frequent water access (every 1–2 hours), while senior dogs may drink more due to decreased kidney efficiency and medications.",
    },
    {
      question: "What medical conditions affect a dog's water intake?",
      answer: "Kidney disease, diabetes, and UTIs increase water needs significantly. Always consult your vet if water intake changes suddenly.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. INPUT HANDLERS
  const onInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const onSelectChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const onCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculation is reactive via useMemo, so no extra action needed
  };

  const onReset = () => {
    setInputs({
      weight: "",
      activityLevel: "normal",
      dietType: "dry",
    });
  };

  const widget = (
    <form onSubmit={onCalculate} className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog's Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => onInputChange("weight", e.target.value)}
            required
          />
        </div>

        {/* Activity Level */}
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <Select
            id="activityLevel"
            value={inputs.activityLevel}
            onValueChange={(val) => onSelectChange("activityLevel", val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal (average activity)</SelectItem>
              <SelectItem value="active">Active (regular exercise)</SelectItem>
              <SelectItem value="very_active">Very Active (working or highly active)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Diet Type */}
        <div>
          <Label htmlFor="dietType" className="text-slate-700 dark:text-slate-300">
            Diet Type
          </Label>
          <Select
            id="dietType"
            value={inputs.dietType}
            onValueChange={(val) => onSelectChange("dietType", val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dry">Dry Food (kibble)</SelectItem>
              <SelectItem value="wet">Wet/Canned Food</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </form>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Daily Water Intake Checker</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Dog Daily Water Intake Checker estimates your dog's daily hydration needs based on weight, age, activity level, diet, and environmental factors. This tool helps pet owners ensure their dogs stay properly hydrated and identify potential dehydration risks.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your dog's weight in pounds, select their life stage (puppy, adult, or senior), activity level (sedentary, moderate, or active), diet type (dry kibble or wet food), and current climate conditions. The calculator will instantly generate a personalized water intake range.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the results and compare them to your dog's actual water consumption. If your dog falls significantly below the recommended range, consult your veterinarian, as this may indicate dehydration, illness, or a need for dietary adjustments.</p>
        </div>
      </section>

      {/* TABLE: Daily Water Intake Guidelines by Dog Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Water Intake Guidelines by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate baseline daily water requirements for healthy adult dogs at rest.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Baseline Daily Water (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Baseline Daily Water (ml)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Active Dog Increase (oz)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5–15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350–750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–37.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750–1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37.5–75</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">37–75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100–2,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55–112</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500–3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–150</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Increase water intake by 25–50% for active dogs, hot climates, or nursing females.</p>
      </section>

      {/* TABLE: Water Intake Adjustments by Life Stage and Condition */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Intake Adjustments by Life Stage and Condition</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Apply these multipliers to baseline water intake for specific dog populations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Stage / Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water Intake Adjustment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puppies (8 weeks–12 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+25–50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid growth and frequent activity require additional fluids</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Dogs (7+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+10–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decreased kidney efficiency and medications increase needs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Nursing Mothers</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+100–150%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nursing depletes significant fluid reserves daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hot Weather / Summer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+25–50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased panting and evaporative cooling loss</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Activity Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+30–50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Working dogs and athletes lose fluids through exertion</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dry Kibble Diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No moisture in food requires full water intake</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wet Food Diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">−20–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High moisture content reduces supplemental water needs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Combine adjustments if multiple conditions apply (e.g., active senior dog in heat gets both increases).</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Refill water bowls at least 2–3 times daily and use fresh, clean water to encourage adequate drinking.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">During hot weather or after exercise, offer water in smaller, frequent amounts to prevent bloat while keeping your dog hydrated.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Wet food, broth, and water-rich treats like watermelon can supplement bowl water and increase total fluid intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor urine color—pale yellow indicates good hydration, while dark yellow or amber suggests your dog needs more water.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Diet Type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming all dogs need the same water intake ignores that wet food provides significant moisture, reducing supplemental water needs by 20–25%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Climate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to increase water intake during summer or in hot regions can lead to dehydration, panting, and heat-related illness.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Activity Level</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using baseline water intake for highly active or working dogs underestimates their needs by 30–50% and may cause chronic dehydration.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Water Intake with Thirst</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dogs do not always drink when thirsty; elderly and sick dogs especially may drink less than needed, requiring owner monitoring and intervention.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much water should my dog drink daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most dogs need about 0.5 to 1 ounce of water per pound of body weight daily. A 50-pound dog typically requires 25–50 ounces (0.75–1.5 liters) per day, adjusted for activity level and climate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the Dog Daily Water Intake Checker account for exercise level?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator factors in your dog's activity level. Active and working dogs may need 25–50% more water than sedentary dogs to compensate for fluid loss through panting and sweating.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my dog eats wet food instead of dry kibble?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Wet food contains 70–80% moisture, reducing additional water needs by up to 25%. The calculator can be adjusted for diet type to provide accurate estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I increase water intake during hot weather?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely—dogs in hot climates or summer months may need 50% more water than baseline to prevent dehydration and maintain proper body temperature.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my dog is drinking enough water?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Check skin elasticity, urine color (pale yellow is ideal), and energy levels. Dark urine or lethargy may indicate insufficient hydration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can puppies and senior dogs have different water needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—puppies need more frequent water access (every 1–2 hours), while senior dogs may drink more due to decreased kidney efficiency and medications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What medical conditions affect a dog's water intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Kidney disease, diabetes, and UTIs increase water needs significantly. Always consult your vet if water intake changes suddenly.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Nutrient Profiles for Dog Food</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards for dog nutrition, including water requirements and dietary guidelines.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) Pet Hydration</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based veterinary guidance on maintaining proper hydration in dogs across life stages.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals Water Intake Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical resource on normal and abnormal water consumption patterns in dogs.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed information on canine nutrition and fluid balance requirements.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Daily Water Intake Checker"
      description="Check if your dog is drinking enough water daily. Calculates the minimum required intake based on weight, activity level, and diet type."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "TotalWaterIntake (ml) = weightKg × 60 × ActivityMultiplier × DietAdjustment",
        variables: [
          { symbol: "weightKg", description: "Dog's weight in kilograms" },
          {
            symbol: "60",
            description:
              "Baseline water requirement in milliliters per kilogram of body weight",
          },
          {
            symbol: "ActivityMultiplier",
            description:
              "Multiplier based on activity level (1.0 normal, 1.2 active, 1.4 very active)",
          },
          {
            symbol: "DietAdjustment",
            description:
              "Adjustment factor based on diet type (1.0 dry food, 0.8 wet food)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) moderately active dog eating dry kibble needs an estimate of daily water intake.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms: 30 lbs ÷ 2.20462 = 13.6 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate base water need: 13.6 kg × 60 ml = 816 ml.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply activity multiplier (active = 1.2): 816 ml × 1.2 = 979 ml.",
          },
          {
            label: "Step 4",
            explanation:
              "Apply diet adjustment (dry food = 1.0): 979 ml × 1.0 = 979 ml total daily water intake.",
          },
        ],
        result:
          "The dog should drink approximately 979 ml (about 4.1 cups) of water daily to stay properly hydrated.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Daily Water Intake Checker" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}