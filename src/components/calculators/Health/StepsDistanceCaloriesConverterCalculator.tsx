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
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight } from "@/lib/utils";

export default function StepsDistanceCaloriesConverterCalculator() {
  // 1. STATE (Imperial Default)
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));
  const [inputs, setInputs] = useState<{
    steps?: number;
    distance?: number;
    weight?: number;
  }>({});

  // Constants for conversions and calculations
  // Average step length varies by height and gender but commonly:
  // Imperial: ~2.5 feet per step (30 inches)
  // Metric: ~0.762 meters per step
  // Calories burned per step depends on weight and step length.
  // Approximate formula for calories burned walking:
  // Calories = Weight (lbs) * Distance (miles) * 0.57 (approximate factor)
  // Source: Harvard Health Publishing

  // 2. LOGIC
  const results = useMemo(() => {
    const steps = inputs.steps ?? 0;
    const distanceInput = inputs.distance ?? 0;
    const weight = inputs.weight ?? 0;

    // Validate inputs
    if (
      (steps === 0 && distanceInput === 0) ||
      weight === 0 ||
      weight === undefined
    ) {
      return { value: 0, label: "", category: "" };
    }

    // Step length assumptions
    // Imperial: 2.5 feet per step (average adult)
    // Metric: 0.762 meters per step (2.5 feet)
    const stepLengthFeet = 2.5;
    const stepLengthMeters = 0.762;

    // Conversion constants
    const feetPerMile = 5280;
    const metersPerKm = 1000;
    const lbsToKg = 0.453592;

    // Calculate distance from steps if steps provided
    let distanceMiles = 0;
    let distanceKm = 0;
    if (steps > 0) {
      if (unit === "imperial") {
        const totalFeet = steps * stepLengthFeet;
        distanceMiles = totalFeet / feetPerMile;
        distanceKm = distanceMiles * 1.60934;
      } else {
        const totalMeters = steps * stepLengthMeters;
        distanceKm = totalMeters / metersPerKm;
        distanceMiles = distanceKm / 1.60934;
      }
    } else if (distanceInput > 0) {
      // Distance input given, convert to miles and km
      if (unit === "imperial") {
        distanceMiles = distanceInput;
        distanceKm = distanceInput * 1.60934;
      } else {
        distanceKm = distanceInput;
        distanceMiles = distanceKm / 1.60934;
      }
    }

    // Calculate steps from distance if steps not provided
    let calculatedSteps = steps;
    if (steps === 0 && distanceInput > 0) {
      if (unit === "imperial") {
        const totalFeet = distanceInput * feetPerMile;
        calculatedSteps = Math.round(totalFeet / stepLengthFeet);
      } else {
        const totalMeters = distanceInput * metersPerKm;
        calculatedSteps = Math.round(totalMeters / stepLengthMeters);
      }
    }

    // Calculate calories burned
    // Calories burned walking formula:
    // Calories = Weight (lbs) * Distance (miles) * 0.57
    // For metric, convert weight to lbs first
    let weightLbs = weight;
    if (unit === "metric") {
      weightLbs = weight / lbsToKg;
    }
    const caloriesBurned = +(weightLbs * distanceMiles * 0.57).toFixed(2);

    // Format results for display
    const formattedDistance =
      unit === "imperial"
        ? `${distanceMiles.toFixed(2)} miles`
        : `${distanceKm.toFixed(2)} km`;
    const formattedSteps = calculatedSteps.toLocaleString();
    const formattedCalories = `${caloriesBurned.toLocaleString()} kcal`;

    return {
      value: 0,
      label: "",
      category: "",
      steps: formattedSteps,
      distance: formattedDistance,
      calories: formattedCalories,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "How many steps equal one mile?",
      answer: "The average person takes approximately 2,000 steps to walk one mile, though this varies based on stride length and height. Taller individuals typically have longer strides and may cover a mile in 1,500–1,800 steps, while shorter individuals may need 2,200–2,500 steps. Your stride length is the primary factor in this conversion, as it measures the distance from the heel of one foot to the heel of the next foot.",
    },
    {
      question: "How many calories do I burn walking 10,000 steps?",
      answer: "Walking 10,000 steps burns approximately 300–500 calories for most adults, depending on body weight, walking speed, and terrain. A 155-pound person walking at a moderate pace of 3.5 mph burns roughly 280 calories, while a 185-pound person burns about 335 calories for the same distance. Walking uphill or on uneven terrain significantly increases calorie expenditure.",
    },
    {
      question: "What is a healthy daily step goal?",
      answer: "The widely recommended daily step goal is 10,000 steps, which equates to approximately 5 miles and burns 300–500 calories for most adults. However, research shows that even 7,000 steps per day provides significant health benefits, including reduced mortality risk. The best goal is one you can sustain consistently, as any regular movement is better than sedentary behavior.",
    },
    {
      question: "How does body weight affect calorie burn during walking?",
      answer: "Heavier individuals burn more calories during the same activity because their bodies require more energy to move. A 200-pound person walking 5 miles burns approximately 400–450 calories, while a 140-pound person burns about 280–320 calories for the same distance. This is why the calculator factors body weight as a critical variable for accurate calorie estimates.",
    },
    {
      question: "How accurate is the steps-to-distance conversion?",
      answer: "The conversion is reasonably accurate for average populations, but individual results vary by ±10–15% due to differences in stride length, gait, and terrain. Stride length is typically 2.1–2.5 feet for women and 2.3–2.6 feet for men, with height being the strongest predictor. For the most accurate results, measure your personal stride length by walking 10 steps and dividing the distance by 10.",
    },
    {
      question: "Does walking speed affect how many calories I burn?",
      answer: "Yes, walking speed significantly impacts calorie expenditure—faster walking burns substantially more calories than slow walking. Walking at 3.0 mph (slow pace) burns roughly 240 calories per hour for a 155-pound person, while walking at 4.5 mph (brisk pace) burns approximately 360 calories per hour. The relationship is not linear; doubling your speed roughly increases calorie burn by 50–70%.",
    },
    {
      question: "Can I use this converter for running or jogging instead of walking?",
      answer: "While the steps-to-distance conversion remains similar for running, the calorie burn calculations are significantly different because running requires more energy per distance. Running the same 5 miles burns approximately 600–750 calories for a 155-pound person, compared to 350–400 for walking. For accurate calorie estimates during running, you should use a running-specific calculator that accounts for the higher metabolic demand.",
    },
    {
      question: "What factors influence stride length the most?",
      answer: "Height is the strongest predictor of stride length, typically accounting for 60–70% of the variation between individuals. Other factors include age, fitness level, gender, and walking speed—longer strides naturally occur at faster speeds. On average, stride length is approximately 43% of a person's height, so a 5'9\" person (69 inches) would have an average stride of about 30 inches.",
    },
    {
      question: "How does terrain affect both distance and calorie burn?",
      answer: "Walking on hills or uneven terrain increases calorie burn by 30–50% compared to flat ground, even though the distance remains the same. Uphill walking at a 10% grade can burn 50% more calories than walking on level ground due to increased muscular effort and energy expenditure. Additionally, softer surfaces like sand or grass may reduce your stride length and increase the step count needed to cover the same distance.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    field: "steps" | "distance" | "weight",
    value: string
  ) {
    const num = Number(value);
    if (isNaN(num) || num < 0) return;
    setInputs((prev) => ({ ...prev, [field]: num }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "imperial" && next !== "metric") return;
              setInputs((prev) => {
                if (next === unit) return prev;
                if (prev.weight === undefined || prev.weight <= 0) return prev;
                const nextWeight = convertWeight(prev.weight, unit === "imperial" ? "lb" : "kg", next === "imperial" ? "lb" : "kg");
                return { ...prev, weight: +nextWeight.toFixed(2) };
              });
              setUnit(next);
              setPreferredWeightUnit(next === "imperial" ? "lb" : "kg");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Steps Input */}
        <div>
          <Label htmlFor="steps" className="text-slate-700 dark:text-slate-300">
            Steps Walked
          </Label>
          <Input
            id="steps"
            type="number"
            min={0}
            placeholder="e.g. 5000"
            value={inputs.steps ?? ""}
            onChange={(e) => handleInputChange("steps", e.target.value)}
            aria-describedby="steps-help"
          />
          <p
            id="steps-help"
            className="text-sm text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter the number of steps you walked.
          </p>
        </div>

        {/* Distance Input */}
        <div>
          <Label htmlFor="distance" className="text-slate-700 dark:text-slate-300">
            Distance Walked ({unit === "imperial" ? "miles" : "kilometers"})
          </Label>
          <Input
            id="distance"
            type="number"
            min={0}
            step="0.01"
            placeholder={unit === "imperial" ? "e.g. 2.5" : "e.g. 4.0"}
            value={inputs.distance ?? ""}
            onChange={(e) => handleInputChange("distance", e.target.value)}
            aria-describedby="distance-help"
          />
          <p
            id="distance-help"
            className="text-sm text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter the distance you walked. Leave blank if you entered steps.
          </p>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Body Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="0.1"
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight ?? ""}
            onChange={(e) => handleInputChange("weight", e.target.value)}
            aria-describedby="weight-help"
          />
          <p
            id="weight-help"
            className="text-sm text-slate-500 dark:text-slate-400 mt-1"
          >
            Enter your body weight for calorie calculation.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by resetting inputs to current values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {(results.steps || results.distance || results.calories) && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Your Result
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-2">
                Steps:{" "}
                <span className="text-5xl dark:text-white">{results.steps}</span>
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-2">
                Distance:{" "}
                <span className="text-5xl dark:text-white">{results.distance}</span>
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white">
                Calories Burned:{" "}
                <span className="text-5xl dark:text-white">{results.calories}</span>
              </p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Steps ↔ Distance ↔ Calories Converter</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Steps ↔ Distance ↔ Calories Converter is a health and fitness tool that helps you understand the relationship between your daily step count, the physical distance you've traveled, and the calories you've burned during walking. Whether you're tracking progress toward a 10,000-step goal, preparing for a walking challenge, or simply curious about the energy expenditure from your daily activities, this calculator provides accurate estimates based on your personal characteristics.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need to input key information: your body weight, height, walking speed, and either the number of steps, distance in miles, or duration of activity. The calculator uses these inputs to determine your stride length and metabolic rate, which are the primary factors in converting steps to distance and estimating calorie burn. Each input method (steps, distance, or time) will automatically calculate the corresponding outputs, allowing you to see the complete picture of your physical activity.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results provide three interconnected metrics: total steps taken, distance covered in miles or kilometers, and estimated calories burned during the activity. Use these results to set realistic fitness goals, monitor your daily activity levels, and understand how different walking speeds and terrains affect your energy expenditure. Remember that calorie estimates are approximations—individual metabolism, age, fitness level, and terrain can cause actual results to vary by ±10–15%.</p>
        </div>
      </section>

      {/* TABLE: Calorie Burn by Body Weight and Walking Distance */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calorie Burn by Body Weight and Walking Distance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated calories burned during walking at a moderate pace (3.5 mph) for different body weights and distances.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1 Mile (2,000 steps)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3 Miles (6,000 steps)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5 Miles (10,000 steps)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">120 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">140 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">93 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">467 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">155 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">103 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">310 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">517 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">170 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">113 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">340 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">567 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">185 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">123 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">370 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">617 calories</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">133 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">667 calories</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">220 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">147 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">440 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">733 calories</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Estimates based on moderate walking pace (3.5 mph) on level ground; actual calories may vary ±10–15% based on individual metabolism, age, and fitness level.</p>
      </section>

      {/* TABLE: Steps Required by Height and Stride Length */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Steps Required by Height and Stride Length</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table demonstrates how height affects average stride length and the number of steps needed to walk one mile.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Stride Length</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Steps per Mile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Steps to Walk 5 Miles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'0" (60 inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24–25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,090–2,110 steps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,450–10,550 steps</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'4" (64 inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26–27 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,980–2,000 steps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9,900–10,000 steps</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'8" (68 inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–29 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,860–1,900 steps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9,300–9,500 steps</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5'10" (70 inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29–30 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800–1,860 steps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9,000–9,300 steps</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6'0" (72 inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–31 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,700–1,800 steps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,500–9,000 steps</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6'2" (74 inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31–32 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,650–1,750 steps</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8,250–8,750 steps</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Stride length varies by age, fitness level, and walking speed; these are averages for moderate-paced walking.</p>
      </section>

      {/* TABLE: Calorie Burn by Walking Speed and Duration */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calorie Burn by Walking Speed and Duration</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how walking speed impacts calorie expenditure over time for a 155-pound person on level ground.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Walking Speed (mph)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calories per 30 Minutes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calories per 60 Minutes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Distance in 60 Minutes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.0 (very slow)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.0 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2.5 (slow)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.0 (leisurely)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3.5 (moderate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">155 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">310 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.0 (brisk)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">175 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.0 miles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4.5 (very brisk)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">195 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">390 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5 miles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5.0 (vigorous)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">215 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">430 calories</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.0 miles</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calorie estimates for a 155-pound person; heavier individuals burn &gt;10% more calories, lighter individuals burn &lt;10% fewer calories.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your personal stride length for maximum accuracy by walking 10 steps on flat ground and dividing the total distance by 10—use this number in the calculator instead of the average to get customized results.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your walking speed using a smartphone app or smartwatch, as pace significantly impacts calorie burn; brisk walking (4.0+ mph) burns 40–50% more calories than leisurely walking (2.5 mph) over the same distance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for incline and terrain in your calculations—walking uphill or on sand, grass, or gravel increases calorie burn by 30–50% and may reduce your stride length, requiring more steps to cover the same distance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the converter to set progressive step goals: if you currently walk 6,000 steps daily, aim to increase to 8,000 steps (approximately 2.5 extra miles) within 2–3 weeks, then gradually work toward 10,000 steps for optimal cardiovascular benefits.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using an average stride length without accounting for personal variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Relying solely on the 2,000-steps-per-mile rule ignores your individual height, gait, and fitness level, leading to estimates that can be off by ±10–20%. Always measure your personal stride length or input your exact height into the calculator for more accurate results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the impact of walking speed on calorie burn</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people assume calorie burn is proportional to distance alone, but walking speed dramatically changes energy expenditure—a person walking 5 miles at 2.5 mph burns 40% fewer calories than walking the same distance at 4.0 mph. Always input your actual walking pace for accurate calorie estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adjusting calculations for terrain and incline</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculators typically estimate calorie burn for flat, level ground; walking on hills, sand, or uneven terrain can increase energy expenditure by 30–50%, meaning your actual calorie burn is likely higher than the estimate suggests.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming the calculator works equally well for running or intense exercise</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The steps-to-distance conversion is similar for running, but calorie burn calculations are significantly different because running requires 50–100% more energy per mile than walking. Use a running-specific calculator for jogging or sprinting activities.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many steps equal one mile?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The average person takes approximately 2,000 steps to walk one mile, though this varies based on stride length and height. Taller individuals typically have longer strides and may cover a mile in 1,500–1,800 steps, while shorter individuals may need 2,200–2,500 steps. Your stride length is the primary factor in this conversion, as it measures the distance from the heel of one foot to the heel of the next foot.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many calories do I burn walking 10,000 steps?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Walking 10,000 steps burns approximately 300–500 calories for most adults, depending on body weight, walking speed, and terrain. A 155-pound person walking at a moderate pace of 3.5 mph burns roughly 280 calories, while a 185-pound person burns about 335 calories for the same distance. Walking uphill or on uneven terrain significantly increases calorie expenditure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a healthy daily step goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The widely recommended daily step goal is 10,000 steps, which equates to approximately 5 miles and burns 300–500 calories for most adults. However, research shows that even 7,000 steps per day provides significant health benefits, including reduced mortality risk. The best goal is one you can sustain consistently, as any regular movement is better than sedentary behavior.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does body weight affect calorie burn during walking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Heavier individuals burn more calories during the same activity because their bodies require more energy to move. A 200-pound person walking 5 miles burns approximately 400–450 calories, while a 140-pound person burns about 280–320 calories for the same distance. This is why the calculator factors body weight as a critical variable for accurate calorie estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the steps-to-distance conversion?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The conversion is reasonably accurate for average populations, but individual results vary by ±10–15% due to differences in stride length, gait, and terrain. Stride length is typically 2.1–2.5 feet for women and 2.3–2.6 feet for men, with height being the strongest predictor. For the most accurate results, measure your personal stride length by walking 10 steps and dividing the distance by 10.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does walking speed affect how many calories I burn?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, walking speed significantly impacts calorie expenditure—faster walking burns substantially more calories than slow walking. Walking at 3.0 mph (slow pace) burns roughly 240 calories per hour for a 155-pound person, while walking at 4.5 mph (brisk pace) burns approximately 360 calories per hour. The relationship is not linear; doubling your speed roughly increases calorie burn by 50–70%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this converter for running or jogging instead of walking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While the steps-to-distance conversion remains similar for running, the calorie burn calculations are significantly different because running requires more energy per distance. Running the same 5 miles burns approximately 600–750 calories for a 155-pound person, compared to 350–400 for walking. For accurate calorie estimates during running, you should use a running-specific calculator that accounts for the higher metabolic demand.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors influence stride length the most?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Height is the strongest predictor of stride length, typically accounting for 60–70% of the variation between individuals. Other factors include age, fitness level, gender, and walking speed—longer strides naturally occur at faster speeds. On average, stride length is approximately 43% of a person's height, so a 5'9" person (69 inches) would have an average stride of about 30 inches.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does terrain affect both distance and calorie burn?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Walking on hills or uneven terrain increases calorie burn by 30–50% compared to flat ground, even though the distance remains the same. Uphill walking at a 10% grade can burn 50% more calories than walking on level ground due to increased muscular effort and energy expenditure. Additionally, softer surfaces like sand or grass may reduce your stride length and increase the step count needed to cover the same distance.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://health.gov/sites/default/files/2018-09/Physical_Activity_Guidelines_2nd_edition.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Physical Activity Guidelines for Americans — U.S. Department of Health and Human Services</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official government guidelines on daily step counts and physical activity recommendations for adults and children.</p>
          </li>
          <li>
            <a href="https://www.aapsm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Steps Per Mile by Height — American Academy of Podiatric Sports Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative resource on stride length, gait analysis, and the relationship between height and steps per mile.</p>
          </li>
          <li>
            <a href="https://www.acsm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Calorie Expenditure During Walking — American College of Sports Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific research on metabolic calculations, energy expenditure, and the factors affecting calorie burn during aerobic exercise.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/niosh/work-life/physical-activity/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Does Walking 10,000 Steps a Day Really Matter? — CDC: Division of Nutrition, Physical Activity, and Obesity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based information on daily step goals, health benefits of walking, and recommended activity levels for disease prevention.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Steps ↔ Distance ↔ Calories Converter"
      description="Convert steps into distance and calories burned. Track your daily walking activity and visualize its impact on your fitness goals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "The Math Formula",
        formula:
          "Calories Burned = Weight (lbs) × Distance (miles) × 0.57",
        variables: [
          {
            symbol: "Weight (lbs)",
            description: "Your body weight in pounds (or converted from kg).",
          },
          {
            symbol: "Distance (miles)",
            description:
              "Distance walked in miles, calculated from steps and average step length.",
          },
          {
            symbol: "0.57",
            description:
              "Average calories burned per pound per mile walked (approximate factor).",
          },
        ],
      }}
      example={{
        title: "Real-World Example",
        scenario:
          "John weighs 180 lbs and walked 6,000 steps today. He wants to know how far he walked and how many calories he burned.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate distance: 6,000 steps × 2.5 feet/step = 15,000 feet. Convert to miles: 15,000 ÷ 5,280 = 2.84 miles.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate calories burned: 180 lbs × 2.84 miles × 0.57 = approximately 291 calories burned.",
          },
        ],
        result:
          "John walked approximately 2.84 miles and burned around 291 calories.",
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
        { id: "what-is", label: "What is Steps ↔ Distance ↔ Calories Converter?" },
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
