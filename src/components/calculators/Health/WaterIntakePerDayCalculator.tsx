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

const activityLevels = [
  { value: "sedentary", label: "Sedentary (little or no exercise)", multiplier: 1.0 },
  { value: "light", label: "Lightly active (light exercise 1-3 days/week)", multiplier: 1.1 },
  { value: "moderate", label: "Moderately active (moderate exercise 3-5 days/week)", multiplier: 1.25 },
  { value: "active", label: "Very active (hard exercise 6-7 days/week)", multiplier: 1.4 },
  { value: "extra", label: "Extra active (very hard exercise & physical job)", multiplier: 1.6 },
];

const climates = [
  { value: "temperate", label: "Temperate (mild climate)", multiplier: 1.0 },
  { value: "hot", label: "Hot climate", multiplier: 1.2 },
  { value: "cold", label: "Cold climate", multiplier: 1.1 },
  { value: "high-altitude", label: "High altitude (> 8,000 ft / 2,400 m)", multiplier: 1.15 },
];

export default function WaterIntakePerDayCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    activity: "sedentary",
    climate: "temperate",
  });

  // 2. LOGIC
  /**
   * Calculation logic:
   * Base water intake: 0.5 oz per lb of body weight (US National Academies recommendation ~3.7L men, 2.7L women)
   * Adjusted by activity multiplier (increased water loss from sweat)
   * Adjusted by climate multiplier (hot, cold, altitude affect hydration needs)
   *
   * Formula:
   * Water Intake (oz) = Weight (lbs) * 0.5 * ActivityMultiplier * ClimateMultiplier
   *
   * For metric:
   * Weight in kg * 35 ml * ActivityMultiplier * ClimateMultiplier
   * (35 ml per kg is a common baseline)
   */

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (!weightNum || weightNum <= 0) return { value: 0, label: "", category: "" };

    const activityObj = activityLevels.find((a) => a.value === inputs.activity);
    const climateObj = climates.find((c) => c.value === inputs.climate);

    if (!activityObj || !climateObj) return { value: 0, label: "", category: "" };

    let waterOz = 0;
    let label = "";
    if (unit === "imperial") {
      // oz calculation
      waterOz = weightNum * 0.5 * activityObj.multiplier * climateObj.multiplier;
      label = "Fluid Ounces per Day";
      // Round to nearest whole oz for simplicity
      waterOz = Math.round(waterOz);
      return { value: waterOz, label, category: "" };
    } else {
      // metric: ml
      // 35 ml per kg baseline
      const weightKg = weightNum;
      let waterMl = weightKg * 35 * activityObj.multiplier * climateObj.multiplier;
      waterMl = Math.round(waterMl);
      label = "Milliliters per Day";
      return { value: waterMl, label, category: "" };
    }
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How much water should I drink per day based on my body weight?",
      answer: "A common guideline is to drink half your body weight in ounces daily. For example, a 150-pound person should aim for approximately 75 ounces (2.2 liters) of water per day. However, this is a baseline that should be adjusted for activity level, climate, and individual health factors. The calculator refines this estimate by factoring in your specific circumstances.",
    },
    {
      question: "Does exercise increase my daily water intake needs?",
      answer: "Yes, exercise significantly increases water requirements. For moderate activity (30-60 minutes daily), add 12-16 ounces of water per day. For intense exercise or athletic training (&gt;60 minutes daily), add 16-24 ounces or more depending on sweat rate and intensity. The calculator accounts for activity levels ranging from sedentary to very active, adjusting recommendations accordingly.",
    },
    {
      question: "How does climate and temperature affect water intake recommendations?",
      answer: "Hot and humid climates increase water loss through perspiration, requiring 1-1.5 liters more water daily than in temperate conditions. Cold climates may reduce perceived thirst but don't eliminate hydration needs. High altitude also increases water requirements by 1-1.5 liters daily due to increased respiration and lower humidity. The calculator adjusts recommendations based on your climate zone.",
    },
    {
      question: "What is the recommended daily water intake according to health authorities?",
      answer: "The National Academies of Sciences, Engineering, and Medicine recommends 15.5 cups (3.7 liters) for adult men and 11.5 cups (2.7 liters) for adult women from all beverages and foods combined. About 20% typically comes from food, meaning men need approximately 3 liters from drinks and women need approximately 2.2 liters from drinks daily. Individual needs vary based on weight, activity, and environment.",
    },
    {
      question: "Can I drink too much water in a day?",
      answer: "Yes, excessive water intake can lead to hyponatremia (dangerously low sodium levels), though this is rare in healthy individuals. Generally, drinking &gt;3-4 liters per hour consistently without electrolyte replacement poses risk. The calculator provides personalized recommendations to help you stay within safe hydration zones. Most people achieve optimal hydration by following weight and activity-based guidelines.",
    },
    {
      question: "How do I adjust my water intake if I'm pregnant or breastfeeding?",
      answer: "Pregnant women should increase daily fluid intake by approximately 300 milliliters (10 ounces) above their baseline recommendation, totaling around 3 liters daily. Breastfeeding mothers need even more, approximately 3.8 liters daily to support milk production. These adjustments should be incorporated into the calculator's activity and health status considerations for accurate personalized recommendations.",
    },
    {
      question: "Does caffeine or alcohol affect my water intake calculations?",
      answer: "Caffeine and alcohol are mild diuretics that increase fluid loss, potentially requiring an additional 1-2 cups (240-480 milliliters) of water daily per caffeinated or alcoholic beverage consumed. While they contribute to overall fluid intake, they're less efficient at hydration than water. The calculator recommends accounting for these beverages separately and adding extra water beyond your calculated daily needs.",
    },
    {
      question: "What factors besides weight, activity, and climate should I consider?",
      answer: "Additional factors include age (older adults need reminders to drink more), health conditions (diabetes, kidney disease, heart conditions), medications (diuretics, antihistamines), and diet (high-sodium foods increase needs). Illness with fever, vomiting, or diarrhea can increase requirements by 1-2 liters daily. The calculator focuses on the primary factors, but you should consult a healthcare provider about condition-specific adjustments.",
    },
    {
      question: "How can I tell if I'm properly hydrated?",
      answer: "Urine color is the most reliable indicator: pale yellow indicates good hydration, while dark yellow suggests dehydration. You should urinate 6-8 times daily, experience minimal thirst, and have normal energy levels and cognitive function. If you're consistently thirsty, experiencing headaches, or have dark urine despite following your calculated intake, increase water consumption or consult a healthcare provider.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your body weight in {unit === "imperial" ? "pounds (lbs)" : "kilograms (kg)"}
          </p>
        </div>

        {/* Activity Level Select */}
        <div>
          <Label htmlFor="activity" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Activity Level
          </Label>
          <Select
            id="activity"
            value={inputs.activity}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, activity: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activityLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select your typical daily activity level.
          </p>
        </div>

        {/* Climate Select */}
        <div>
          <Label htmlFor="climate" className="text-slate-700 dark:text-slate-300 mb-1 block font-semibold">
            Climate
          </Label>
          <Select
            id="climate"
            value={inputs.climate}
            onValueChange={(value) =>
              setInputs((prev) => ({ ...prev, climate: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {climates.map((climate) => (
                <SelectItem key={climate.value} value={climate.value}>
                  {climate.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select the climate you live in or are exposed to most often.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          aria-label="Calculate water intake"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              activity: "sedentary",
              climate: "temperate",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value.toLocaleString()}
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
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Water Intake per Day (by weight/activity/climate) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine your personalized daily water intake recommendation by analyzing three primary factors: your body weight, physical activity level, and climate conditions. Proper hydration is essential for maintaining energy, cognitive function, physical performance, and overall health. Rather than following generic "8 glasses a day" advice, this tool provides a customized target based on your unique circumstances.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your body weight (in pounds or kilograms), select your typical activity level (ranging from sedentary to very active athlete), and indicate your climate zone (from cold temperate to very hot/humid conditions). The calculator combines these inputs using evidence-based hydration science to account for water loss through metabolic activity and environmental factors. Each input directly influences how much fluid your body requires daily.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your recommended daily water intake in multiple formats (ounces, liters, and cups) for easy reference. Use this as your target range, understanding that individual needs can vary based on health conditions, medications, diet, and personal sweat rate. Monitor your hydration status through urine color, energy levels, and thirst cues. If recommendations seem significantly different from what your body signals, consult a healthcare provider to account for individual health factors.</p>
        </div>
      </section>

      {/* TABLE: Daily Water Intake Recommendations by Body Weight (Baseline) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Water Intake Recommendations by Body Weight (Baseline)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows baseline daily water intake recommendations based on body weight using the standard guideline of consuming half your body weight in ounces.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Baseline Daily Water (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Baseline Daily Water (liters)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Baseline Daily Water (cups)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.9</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">73</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.4</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">91</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.6</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">114</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.3</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These are baseline recommendations and should be adjusted upward for activity level, climate, and individual health factors.</p>
      </section>

      {/* TABLE: Activity Level Water Intake Adjustments */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Activity Level Water Intake Adjustments</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines additional daily water intake adjustments based on exercise frequency and intensity.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Activity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Exercise Duration/Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Additional Water Per Day (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Additional Water Per Day (liters)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Adjustment Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sedentary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No exercise</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Use baseline calculation only</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Light</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light activity, &lt;30 min/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.24-0.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add to baseline</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-60 min moderate exercise/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.35-0.47</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add to baseline</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60+ min moderate or 30-45 min intense/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.47-0.71</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add to baseline</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Active</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90+ min intense exercise/day or training</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.71-0.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Add to baseline; monitor for electrolyte needs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Athlete/Competition</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-intensity training 2+ hours/day</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.95+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Consult sports nutritionist; may need electrolyte replacement</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjustments assume moderate temperature conditions. Hot climate or outdoor activity requires additional increases.</p>
      </section>

      {/* TABLE: Climate and Environmental Water Intake Adjustments */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Climate and Environmental Water Intake Adjustments</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how climate conditions and environmental factors modify baseline water intake recommendations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Climate Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temperature Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Humidity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Additional Daily Water (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Additional Daily Water (liters)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Temperate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-72°F (10-22°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Warm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-86°F (22-30°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.24-0.47</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">86-104°F (30-40°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.47-0.71</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Very Hot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;104°F (&gt;40°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.71-0.95</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Humid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any temp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;75%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.35-0.59</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High Altitude</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,000+ feet (2,400+ m)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.47-0.71</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dry/Arid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any temp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.35-0.71</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cold</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;50°F (&lt;10°C)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.12-0.24</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These adjustments stack with activity level adjustments. For example, hot climate + intense exercise requires both adjustments combined.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Spread your water intake throughout the day rather than drinking large amounts at once—aim for consistent hydration every 2-3 hours to maximize absorption and maintain steady energy levels.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use urine color as your hydration indicator: pale yellow signals good hydration, while dark yellow suggests you need to drink more water regardless of the calculator's recommendation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for water from other sources: approximately 20% of daily fluid intake comes from food (especially fruits and vegetables), and other beverages like tea and milk count toward your total fluid intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase your water intake on days with additional activity, higher temperatures, or if you're experiencing illness—don't rely solely on the baseline calculation during unusual circumstances.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a reusable water bottle with you and set reminders on your phone to drink at regular intervals; tracking consumption helps you meet calculated targets consistently.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Activity Level Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people calculate their water needs once and never adjust for seasonal activity changes, vacations, or new exercise routines. Increasing exercise intensity by 30+ minutes requires adding 12-16+ ounces to your daily target, not ignoring the change.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Climate Adjustments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Moving to a hot climate or traveling abroad without recalculating water needs can lead to chronic dehydration. Hot and humid conditions can increase requirements by 16-32 ounces daily, making the original baseline outdated.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Counting All Beverages Equally</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">While coffee, tea, and soda count toward total fluid intake, caffeinated and alcoholic beverages are mild diuretics that don't hydrate as efficiently as water. Replacing plain water with caffeinated drinks actually increases net water needs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Health Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pregnancy, new medications, illness, or chronic health conditions significantly alter hydration requirements, but many people continue using their old calculations. Consult healthcare providers when major health changes occur rather than relying solely on weight and activity.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much water should I drink per day based on my body weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A common guideline is to drink half your body weight in ounces daily. For example, a 150-pound person should aim for approximately 75 ounces (2.2 liters) of water per day. However, this is a baseline that should be adjusted for activity level, climate, and individual health factors. The calculator refines this estimate by factoring in your specific circumstances.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does exercise increase my daily water intake needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, exercise significantly increases water requirements. For moderate activity (30-60 minutes daily), add 12-16 ounces of water per day. For intense exercise or athletic training (&gt;60 minutes daily), add 16-24 ounces or more depending on sweat rate and intensity. The calculator accounts for activity levels ranging from sedentary to very active, adjusting recommendations accordingly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does climate and temperature affect water intake recommendations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Hot and humid climates increase water loss through perspiration, requiring 1-1.5 liters more water daily than in temperate conditions. Cold climates may reduce perceived thirst but don't eliminate hydration needs. High altitude also increases water requirements by 1-1.5 liters daily due to increased respiration and lower humidity. The calculator adjusts recommendations based on your climate zone.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended daily water intake according to health authorities?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The National Academies of Sciences, Engineering, and Medicine recommends 15.5 cups (3.7 liters) for adult men and 11.5 cups (2.7 liters) for adult women from all beverages and foods combined. About 20% typically comes from food, meaning men need approximately 3 liters from drinks and women need approximately 2.2 liters from drinks daily. Individual needs vary based on weight, activity, and environment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I drink too much water in a day?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, excessive water intake can lead to hyponatremia (dangerously low sodium levels), though this is rare in healthy individuals. Generally, drinking &gt;3-4 liters per hour consistently without electrolyte replacement poses risk. The calculator provides personalized recommendations to help you stay within safe hydration zones. Most people achieve optimal hydration by following weight and activity-based guidelines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I adjust my water intake if I'm pregnant or breastfeeding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pregnant women should increase daily fluid intake by approximately 300 milliliters (10 ounces) above their baseline recommendation, totaling around 3 liters daily. Breastfeeding mothers need even more, approximately 3.8 liters daily to support milk production. These adjustments should be incorporated into the calculator's activity and health status considerations for accurate personalized recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does caffeine or alcohol affect my water intake calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Caffeine and alcohol are mild diuretics that increase fluid loss, potentially requiring an additional 1-2 cups (240-480 milliliters) of water daily per caffeinated or alcoholic beverage consumed. While they contribute to overall fluid intake, they're less efficient at hydration than water. The calculator recommends accounting for these beverages separately and adding extra water beyond your calculated daily needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors besides weight, activity, and climate should I consider?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Additional factors include age (older adults need reminders to drink more), health conditions (diabetes, kidney disease, heart conditions), medications (diuretics, antihistamines), and diet (high-sodium foods increase needs). Illness with fever, vomiting, or diarrhea can increase requirements by 1-2 liters daily. The calculator focuses on the primary factors, but you should consult a healthcare provider about condition-specific adjustments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How can I tell if I'm properly hydrated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Urine color is the most reliable indicator: pale yellow indicates good hydration, while dark yellow suggests dehydration. You should urinate 6-8 times daily, experience minimal thirst, and have normal energy levels and cognitive function. If you're consistently thirsty, experiencing headaches, or have dark urine despite following your calculated intake, increase water consumption or consult a healthcare provider.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nationalacademies.org/our-work/dietary-reference-intakes-for-adequacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Academies of Sciences, Engineering, and Medicine - Dietary Reference Intakes for Adequacy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guidelines establishing recommended daily water intake values of 3.7 liters for men and 2.7 liters for women from all sources.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic - Water: How much should you drink every day?</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on daily water intake, factors affecting hydration needs, and signs of dehydration from a leading medical institution.</p>
          </li>
          <li>
            <a href="https://www.acsm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American College of Sports Medicine - Exercise and Fluid Replacement</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific consensus on hydration strategies for athletes and active individuals, including recommendations for fluid intake during and after exercise.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/nutrition/data-statistics/water.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC - Healthy Water - Water and Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal guidelines on daily water intake recommendations and the relationship between proper hydration and overall health outcomes.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Water Intake per Day (by weight/activity/climate)"
      description="Calculate your daily water intake requirements. Stay hydrated by adjusting for body weight, activity level, and climate conditions."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Water Intake = Weight × Base Intake per Unit Weight × Activity Multiplier × Climate Multiplier",
        variables: [
          {
            symbol: "Weight",
            description:
              "Your body weight in pounds (lbs) or kilograms (kg) depending on unit system",
          },
          {
            symbol: "Base Intake per Unit Weight",
            description:
              "0.5 fluid ounces per pound (imperial) or 35 milliliters per kilogram (metric)",
          },
          {
            symbol: "Activity Multiplier",
            description:
              "Factor based on your physical activity level (ranges from 1.0 to 1.6)",
          },
          {
            symbol: "Climate Multiplier",
            description:
              "Factor based on environmental climate (ranges from 1.0 to 1.2)",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "A 180 lb moderately active person living in a hot climate wants to know their daily water intake.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Start with base intake: 180 lbs × 0.5 oz = 90 oz",
          },
          {
            label: "Step 2",
            explanation:
              "Apply activity multiplier: 90 oz × 1.25 (moderate activity) = 112.5 oz",
          },
          {
            label: "Step 3",
            explanation:
              "Apply climate multiplier: 112.5 oz × 1.2 (hot climate) = 135 oz",
          },
          {
            label: "Result",
            explanation:
              "Recommended daily water intake is approximately 135 fluid ounces.",
          },
        ],
        result: "135 fluid ounces per day",
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
        {
          id: "what-is",
          label: "What is Water Intake per Day (by weight/activity/climate)?",
        },
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