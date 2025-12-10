import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Scale, TrendingDown, Activity, Heart } from "lucide-react";

export default function DogWeightLossPlannerCalculator() {
  // State for unit system
  const [unit, setUnit] = useState("imperial"); // imperial or metric
  
  // State for inputs
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("1.4");
  const [weeksToGoal, setWeeksToGoal] = useState("16");

  // Convert weights to kg for calculations
  const currentWeightKg = useMemo(() => {
    const w = parseFloat(currentWeight);
    if (isNaN(w) || w <= 0) return null;
    return unit === "imperial" ? w * 0.45359237 : w;
  }, [currentWeight, unit]);

  const targetWeightKg = useMemo(() => {
    const w = parseFloat(targetWeight);
    if (isNaN(w) || w <= 0) return null;
    return unit === "imperial" ? w * 0.45359237 : w;
  }, [targetWeight, unit]);

  // Calculate weight loss needed
  const weightLossNeeded = useMemo(() => {
    if (!currentWeightKg || !targetWeightKg) return null;
    if (targetWeightKg >= currentWeightKg) return null; // Not a weight loss scenario
    return currentWeightKg - targetWeightKg;
  }, [currentWeightKg, targetWeightKg]);

  // Calculate RER based on TARGET weight
  const rer = useMemo(() => {
    if (!targetWeightKg) return null;
    return 70 * Math.pow(targetWeightKg, 0.75);
  }, [targetWeightKg]);

  // Calculate daily calorie target for weight loss
  const dailyCalorieTarget = useMemo(() => {
    if (!rer) return null;
    const factor = parseFloat(activityLevel);
    if (isNaN(factor)) return null;
    return rer * factor;
  }, [rer, activityLevel]);

  // Calculate weekly weight loss rate
  const weeklyLossRate = useMemo(() => {
    if (!weightLossNeeded) return null;
    const weeks = parseFloat(weeksToGoal);
    if (isNaN(weeks) || weeks <= 0) return null;
    return weightLossNeeded / weeks;
  }, [weightLossNeeded, weeksToGoal]);

  // Calculate percentage of body weight per week
  const weeklyLossPercentage = useMemo(() => {
    if (!weeklyLossRate || !currentWeightKg) return null;
    return (weeklyLossRate / currentWeightKg) * 100;
  }, [weeklyLossRate, currentWeightKg]);

  // Determine if weight loss rate is safe (1-2% per week)
  const isSafeRate = useMemo(() => {
    if (!weeklyLossPercentage) return null;
    return weeklyLossPercentage >= 0.5 && weeklyLossPercentage <= 2.5;
  }, [weeklyLossPercentage]);

  // Format functions
  const formatWeight = (kg) => {
    if (kg === null) return "--";
    if (unit === "imperial") {
      return (kg / 0.45359237).toFixed(1) + " lbs";
    }
    return kg.toFixed(1) + " kg";
  };

  const formatCalories = (cal) => {
    if (cal === null) return "--";
    return Math.round(cal).toString() + " kcal/day";
  };

  // Activity level options
  const activityOptions = [
    { value: "1.0", label: "Weight loss (RER only)" },
    { value: "1.2", label: "Sedentary, weight loss" },
    { value: "1.4", label: "Light activity, weight loss (recommended)" },
    { value: "1.6", label: "Moderate activity" },
  ];

  return (
    <CalculatorVerticalLayout
      title="Dog Weight Loss Planner Calculator"
      description="Create a safe, veterinary-approved weight loss plan for your dog. Calculate daily calorie needs, target timeline, and weekly weight loss rate based on current weight, goal weight, and activity level."
      widget={
        <div className="space-y-6">
          {/* Unit Toggle */}
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant={unit === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("imperial")}
            >
              Imperial (lbs)
            </Button>
            <Button
              type="button"
              variant={unit === "metric" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("metric")}
            >
              Metric (kg)
            </Button>
          </div>

          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Weight Loss Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentWeight" className="mb-2 block text-sm font-medium">
                  Current Weight (" + (unit === "imperial" ? "lbs" : "kg") + ")
                </Label>
                <Input
                  id="currentWeight"
                  type="number"
                  min="0"
                  step="any"
                  placeholder={"Enter current weight in " + (unit === "imperial" ? "pounds" : "kilograms")}
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="targetWeight" className="mb-2 block text-sm font-medium">
                  Target Weight (" + (unit === "imperial" ? "lbs" : "kg") + ")
                </Label>
                <Input
                  id="targetWeight"
                  type="number"
                  min="0"
                  step="any"
                  placeholder={"Enter target weight in " + (unit === "imperial" ? "pounds" : "kilograms")}
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="activityLevel" className="mb-2 block text-sm font-medium">
                  Activity Level During Weight Loss
                </Label>
                <select
                  id="activityLevel"
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  {activityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label + " (" + opt.value + "x RER)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="weeksToGoal" className="mb-2 block text-sm font-medium">
                  Timeline (weeks to reach goal)
                </Label>
                <Input
                  id="weeksToGoal"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter number of weeks"
                  value={weeksToGoal}
                  onChange={(e) => setWeeksToGoal(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {dailyCalorieTarget !== null && weightLossNeeded !== null && weeklyLossRate !== null && (
            <div className="space-y-4">
              {/* Daily Calorie Target */}
              <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-slate-500/10 p-6 shadow-xl">
                <div className="mb-4">
                  <p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Daily Calorie Target
                  </p>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    {formatCalories(dailyCalorieTarget)}
                  </p>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Feed this amount daily to achieve gradual weight loss while maintaining health.
                </p>
              </div>

              {/* Weight Loss Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Weight Loss Plan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                    <span className="text-slate-700 dark:text-slate-300">Total Weight to Lose:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatWeight(weightLossNeeded)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                    <span className="text-slate-700 dark:text-slate-300">Weekly Loss Rate:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatWeight(weeklyLossRate)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                    <span className="text-slate-700 dark:text-slate-300">% of Body Weight/Week:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {weeklyLossPercentage !== null ? weeklyLossPercentage.toFixed(2) + "%" : "--"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Timeline:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {weeksToGoal + " weeks"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Alert */}
              {isSafeRate !== null && (
                <div
                  className={
                    "rounded-lg border p-4 " +
                    (isSafeRate
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                      : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950")
                  }
                >
                  <div className="flex items-start gap-3">
                    <Heart
                      className={
                        "h-5 w-5 shrink-0 " +
                        (isSafeRate ? "text-green-600" : "text-amber-600")
                      }
                    />
                    <div>
                      <p className={"text-sm font-semibold " + (isSafeRate ? "text-green-800 dark:text-green-400" : "text-amber-800 dark:text-amber-400")}>
                        {isSafeRate ? "✓ Safe Weight Loss Rate" : "⚠ Review Weight Loss Rate"}
                      </p>
                      <p className={"text-sm mt-1 " + (isSafeRate ? "text-green-700 dark:text-green-300" : "text-amber-700 dark:text-amber-300")}>
                        {isSafeRate
                          ? "Your plan falls within the veterinary-recommended range of 0.5-2.5% body weight loss per week."
                          : "This rate may be too fast or too slow. Safe weight loss is typically 1-2% of body weight per week. Consult your veterinarian."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      }
      editorial={
        <div className="space-y-12">
          {/* How to Use This Calculator */}
          <section id="how-to-use">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              How to use this dog weight loss calculator
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              This calculator helps you create a science-based weight loss plan for your overweight or obese dog. 
              Unlike generic calorie calculators, this tool specifically accounts for the unique metabolic needs 
              during weight loss and provides a safe timeline based on veterinary guidelines.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              To use the calculator effectively, you will need:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-4">
              <li>
                <strong>Current weight</strong> – Weigh your dog at home or at your veterinary clinic. 
                Use a pet scale or a regular scale where you weigh yourself holding the dog, then subtract your own weight.
              </li>
              <li>
                <strong>Target weight</strong> – Your veterinarian should determine this based on breed standards, 
                body condition scoring, and your dog's frame size. If you're unsure, ask your vet for an ideal 
                weight range before starting any diet plan.
              </li>
              <li>
                <strong>Activity level</strong> – Choose the multiplier that best matches your dog's daily routine 
                during the weight loss period. Most dogs on weight loss diets use 1.0-1.4x RER.
              </li>
              <li>
                <strong>Timeline</strong> – Enter how many weeks you want to reach the goal. The calculator will 
                show if this creates a safe weight loss rate (1-2% of body weight per week).
              </li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300">
              The calculator uses the target weight (not current weight) to calculate Resting Energy Requirement (RER), 
              then applies an activity multiplier. This method prevents overfeeding and ensures steady, sustainable weight loss. 
              Always work with your veterinarian throughout the weight loss journey for adjustments and health monitoring.
            </p>
          </section>

          {/* Formula and Methodology */}
          <section id="formula" className="border-t border-slate-200 dark:border-slate-700 pt-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              Formula and methodology for canine weight loss
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Veterinary nutritionists recommend calculating calorie needs for weight loss using the 
              <strong> target weight</strong> rather than current weight. This approach prevents overfeeding 
              and creates a sustainable calorie deficit.
            </p>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-indigo-100 dark:border-indigo-800 mb-6">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Step 1: Calculate RER Using Target Weight
              </p>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-slate-100 mb-2">
                RER = 70 × (target weight in kg)<sup>0.75</sup>
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                This gives you the baseline calories needed for basic bodily functions at the goal weight.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-emerald-100 dark:border-emerald-800 mb-6">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Step 2: Apply Activity Multiplier
              </p>
              <p className="text-2xl sm:text-3xl font-mono font-bold text-slate-900 dark:text-slate-100 mb-2">
                Daily Calories = RER × factor
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                The factor typically ranges from 1.0 to 1.4 for weight loss, depending on activity level.
              </p>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Recommended activity factors for weight loss
            </h3>
            <Table className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-sm mb-4">
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-900/60">
                  <TableHead>Activity Level</TableHead>
                  <TableHead>Factor</TableHead>
                  <TableHead>Best For</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>RER only</TableCell>
                  <TableCell>1.0 × RER</TableCell>
                  <TableCell>Very sedentary dogs, under vet supervision</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sedentary weight loss</TableCell>
                  <TableCell>1.2 × RER</TableCell>
                  <TableCell>Indoor dogs with minimal exercise</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Light activity</TableCell>
                  <TableCell>1.4 × RER</TableCell>
                  <TableCell>Daily walks, light play (most common)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Moderate activity</TableCell>
                  <TableCell>1.6 × RER</TableCell>
                  <TableCell>Active dogs maintaining exercise during diet</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Using the target weight ensures that as your dog loses weight, you're not constantly recalculating 
              calories downward. The calorie target remains stable throughout the weight loss period, making it 
              easier to follow and reducing the risk of plateaus.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
              Safe weight loss rate guidelines
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-3">
              Veterinary medicine recommends a weight loss rate of <strong>1-2% of body weight per week</strong> 
              for most dogs. This gradual approach:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300">
              <li>Minimizes muscle loss and preserves lean body mass</li>
              <li>Reduces metabolic stress on organs</li>
              <li>Decreases risk of hepatic lipidosis (fatty liver disease)</li>
              <li>Makes the diet more sustainable and less stressful for your dog</li>
              <li>Allows time for appetite and behavior adjustment</li>
            </ul>
          </section>

          {/* Worked Example */}
          <section id="examples" className="border-t border-slate-200 dark:border-slate-700 pt-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              Example: creating a 16-week weight loss plan for a 70 lb dog
            </h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Let's plan a weight loss program for a Labrador Retriever who currently weighs 
              <strong> 70 pounds (31.8 kg)</strong> but should weigh <strong>60 pounds (27.2 kg)</strong> 
              according to the veterinarian. The dog gets daily 30-minute walks.
            </p>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 mb-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Step-by-step calculation:</h4>
              <ol className="list-decimal pl-6 space-y-3 text-slate-700 dark:text-slate-300">
                <li>
                  <strong>Convert target weight to kg:</strong>
                  <br />
                  <span className="font-mono">60 lbs × 0.453592 = 27.2 kg</span>
                </li>
                <li>
                  <strong>Calculate RER using target weight:</strong>
                  <br />
                  <span className="font-mono">
                    RER = 70 × (27.2)<sup>0.75</sup> ≈ 70 × 13.1 ≈ 917 kcal/day
                  </span>
                </li>
                <li>
                  <strong>Apply activity factor for light activity:</strong>
                  <br />
                  <span className="font-mono">Daily Calories = 917 × 1.4 ≈ 1,284 kcal/day</span>
                </li>
                <li>
                  <strong>Calculate weight loss needed:</strong>
                  <br />
                  <span className="font-mono">70 lbs - 60 lbs = 10 lbs (4.5 kg) to lose</span>
                </li>
                <li>
                  <strong>Set timeline to 16 weeks:</strong>
                  <br />
                  <span className="font-mono">Weekly loss = 10 lbs ÷ 16 weeks = 0.625 lbs/week</span>
                </li>
                <li>
                  <strong>Check if rate is safe:</strong>
                  <br />
                  <span className="font-mono">
                    % per week = (0.625 ÷ 70) × 100 = 0.89% per week ✓
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6">
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                Result: Safe and Effective Plan
              </h4>
              <p className="text-emerald-800 dark:text-emerald-200">
                Feed <strong>1,284 kcal per day</strong> for 16 weeks. This creates a weight loss rate of 
                0.89% per week, which is within the safe range (1-2%). The dog should reach the target weight 
                of 60 pounds while maintaining muscle mass and energy levels. Schedule weigh-ins every 2-3 weeks 
                with your veterinarian to monitor progress and adjust as needed.
              </p>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              Frequently asked questions about dog weight loss
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  Why do you calculate RER using target weight instead of current weight?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Using target weight rather than current weight is a cornerstone of modern veterinary weight loss protocols. 
                  When you calculate RER based on a dog's current overweight condition, you end up prescribing too many calories, 
                  which defeats the purpose of a calorie-restricted diet.
                </p>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  By basing the calculation on the <strong>ideal or target weight</strong>, you immediately create an appropriate 
                  calorie deficit. This method has been validated in clinical studies and is recommended by organizations such as 
                  the World Small Animal Veterinary Association (WSAVA) and the Association for Pet Obesity Prevention.
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  An additional benefit: the calorie target stays consistent throughout the weight loss program. You don't need 
                  to recalculate as your dog sheds pounds, which makes feeding simpler and reduces the risk of weight loss plateaus.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  Is 1-2% body weight loss per week safe for all dogs?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  The 1-2% guideline is appropriate for most otherwise healthy adult dogs. However, certain populations require 
                  special consideration:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-2">
                  <li>
                    <strong>Severely obese dogs</strong> (body condition score 9/9) may need a more conservative rate (0.5-1%) 
                    to avoid hepatic lipidosis or other metabolic complications.
                  </li>
                  <li>
                    <strong>Senior dogs</strong> may lose weight more slowly and need extra monitoring to ensure adequate protein 
                    intake and muscle preservation.
                  </li>
                  <li>
                    <strong>Dogs with concurrent diseases</strong> (diabetes, heart disease, arthritis, etc.) should only lose 
                    weight under direct veterinary supervision with tailored calorie and nutrient targets.
                  </li>
                  <li>
                    <strong>Very small breeds</strong> (under 10 lbs) may need slower rates to account for their higher metabolic 
                    demands and smaller margin for error.
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300">
                  Always discuss the appropriate rate with your veterinarian, who can adjust the plan based on your dog's individual 
                  health status, lab work, and response to the diet.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  What if my dog is always hungry on a weight loss diet?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Hunger and begging are common challenges during weight loss. Several strategies can help:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-2">
                  <li>
                    <strong>Split meals into smaller, more frequent portions</strong> – Feeding 3-4 times per day instead of 
                    1-2 can help your dog feel more satisfied.
                  </li>
                  <li>
                    <strong>Add low-calorie vegetables</strong> – Vegetables like green beans, carrots, or broccoli (steamed, 
                    no seasoning) can add bulk to meals without many calories. Consult your vet about appropriate amounts.
                  </li>
                  <li>
                    <strong>Use a weight loss formula food</strong> – Therapeutic diets formulated for weight loss are higher 
                    in fiber and protein, which promote satiety better than regular foods at the same calorie level.
                  </li>
                  <li>
                    <strong>Increase water content</strong> – Adding water or low-sodium broth to dry kibble can increase 
                    volume without adding calories.
                  </li>
                  <li>
                    <strong>Provide mental stimulation</strong> – Food puzzles and slow-feeder bowls make mealtime last longer, 
                    and regular training sessions or enrichment activities can distract from food-seeking behavior.
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300">
                  Begging may decrease over time as your dog adapts to the new routine. If extreme hunger persists, talk to your 
                  veterinarian about adjusting the calorie target or checking for underlying metabolic conditions like hypothyroidism.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  Should I increase exercise during a weight loss program?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Exercise is beneficial for weight loss, but it should be introduced gradually, especially in dogs with significant 
                  obesity or joint problems. Calorie restriction is the primary driver of weight loss; exercise is a helpful supplement 
                  that provides additional benefits:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-2">
                  <li>Preserves lean muscle mass during calorie restriction</li>
                  <li>Improves cardiovascular health and stamina</li>
                  <li>Enhances joint mobility (when done appropriately)</li>
                  <li>Provides mental stimulation and reduces boredom</li>
                  <li>Strengthens the bond between you and your dog</li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Start with low-impact activities like short walks or swimming. As your dog loses weight and gains fitness, you can 
                  gradually increase duration and intensity. Avoid high-impact exercise (running, jumping, agility) in obese dogs until 
                  they've lost at least 10-15% of their excess weight to protect joints.
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  If your dog has arthritis, heart disease, or respiratory issues, get clearance from your veterinarian before starting 
                  an exercise program. Physical therapy or hydrotherapy may be better options for dogs with mobility challenges.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  How often should I weigh my dog during weight loss?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Regular weigh-ins are crucial for tracking progress and adjusting the plan as needed. Most veterinarians recommend:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-2">
                  <li>
                    <strong>Weigh every 2-3 weeks</strong> for the first 2-3 months to ensure the rate of loss is appropriate
                  </li>
                  <li>
                    <strong>Weigh monthly</strong> once a steady, safe rate is established
                  </li>
                  <li>
                    <strong>Use the same scale and time of day</strong> for consistency (preferably before feeding in the morning)
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Don't panic if weight fluctuates slightly week to week — this is normal due to hydration, bowel contents, and 
                  other factors. Look at the overall trend over 4-6 weeks.
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  Many veterinary clinics offer free weight checks between appointments. Take advantage of this service to stay on 
                  track. Some pet stores also have scales available. For very large dogs or dogs who are difficult to weigh at home, 
                  your veterinarian can provide guidance on portable scales or livestock scales.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
                  Can I give treats during a weight loss program?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Yes, but treats need to be carefully accounted for in the daily calorie budget. The general rule is that treats 
                  should make up <strong>no more than 10% of daily calories</strong>. If your dog is on a 1,000 kcal/day diet, 
                  that's a maximum of 100 kcal from treats.
                </p>
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Strategies for including treats without sabotaging weight loss:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-300 mb-2">
                  <li>
                    <strong>Use low-calorie treats</strong> – Carrot sticks, apple slices (no seeds), green beans, or air-popped 
                    popcorn (no butter/salt) are very low in calories
                  </li>
                  <li>
                    <strong>Reserve part of the daily kibble</strong> – Set aside 10-20 pieces of your dog's regular food to use 
                    as training treats throughout the day
                  </li>
                  <li>
                    <strong>Break treats into smaller pieces</strong> – Dogs respond to the frequency of rewards, not the size. 
                    One treat broken into 4-5 tiny pieces provides multiple rewards for the same calories
                  </li>
                  <li>
                    <strong>Choose freeze-dried or dehydrated single-ingredient treats</strong> – These tend to be lower in 
                    calories than processed biscuits and add-on oils/flavors
                  </li>
                </ul>
                <p className="text-slate-700 dark:text-slate-300">
                  Avoid table scraps, which are often high in fat and calories and can disrupt the nutrient balance of a therapeutic 
                  weight loss diet. If family members are struggling to resist feeding the dog, consider posting the weight loss plan 
                  on the refrigerator as a visible reminder of the health goals.
                </p>
              </div>
            </div>
          </section>

          {/* References */}
          <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              References and additional resources
            </h2>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                <div>
                  <a
                    href="https://wsava.org/global-guidelines/global-nutrition-guidelines/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
                  >
                    WSAVA Global Nutrition Guidelines
                  </a>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The World Small Animal Veterinary Association provides evidence-based guidelines for calculating 
                    calorie needs, including specific recommendations for weight loss programs in dogs and cats.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                <div>
                  <a
                    href="https://petobesityprevention.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
                  >
                    Association for Pet Obesity Prevention (APOP)
                  </a>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    APOP provides educational resources, veterinary guidance, and annual surveys on pet obesity trends. 
                    Their website includes tools for assessing body condition and creating weight management plans.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                <div>
                  <a
                    href="https://www.amazon.com/Small-Animal-Clinical-Nutrition-5th/dp/0982054971"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
                  >
                    Small Animal Clinical Nutrition (5th Edition)
                  </a>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The gold-standard textbook used by veterinary nutritionists. Includes detailed chapters on energy 
                    requirements, obesity management, and therapeutic diet formulation for dogs with concurrent diseases.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                <div>
                  <a
                    href="https://www.avma.org/resources-tools/pet-owners/petcare/your-pets-healthy-weight"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
                  >
                    American Veterinary Medical Association (AVMA) – Pet Weight Resources
                  </a>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The AVMA offers consumer-friendly guides on recognizing obesity, understanding body condition scoring, 
                    and working with your veterinarian to create a safe weight loss program.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
                <div>
                  <a
                    href="https://www.acvn.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-lg"
                  >
                    American College of Veterinary Nutrition (ACVN)
                  </a>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    If your dog has complex medical needs or hasn't responded well to standard weight loss approaches, 
                    consider consulting a board-certified veterinary nutritionist. The ACVN directory helps you find 
                    specialists in your area or available for remote consultations.
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </div>
      }
      formula={{
        title: "Weight Loss Formulas Used",
        formula: "RER = 70 × (target weight in kg)^0.75\nDaily Calories = RER × activity factor\nWeekly Loss Rate = Total Weight Loss ÷ Timeline (weeks)",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement at target weight (kcal/day)" },
          { symbol: "target weight", description: "Desired ideal weight in kilograms" },
          { symbol: "activity factor", description: "Multiplier based on activity level during weight loss (typically 1.0-1.4)" },
          { symbol: "Weekly Loss Rate", description: "Amount of weight to lose per week" },
        ],
      }}
      example={{
        title: "Example: 70 lb Dog Losing Weight Over 16 Weeks",
        scenario: "A 70 lb Labrador Retriever needs to reach 60 lbs (target weight). The dog gets daily 30-minute walks.",
        steps: [
          { step: 1, description: "Convert target weight to kg", calculation: "60 lbs × 0.453592 = 27.2 kg" },
          { step: 2, description: "Calculate RER using target weight", calculation: "RER = 70 × (27.2)^0.75 ≈ 917 kcal/day" },
          { step: 3, description: "Apply activity factor (light activity)", calculation: "Daily Calories = 917 × 1.4 = 1,284 kcal/day" },
          { step: 4, description: "Calculate total weight loss needed", calculation: "70 lbs - 60 lbs = 10 lbs to lose" },
          { step: 5, description: "Determine weekly loss rate", calculation: "10 lbs ÷ 16 weeks = 0.625 lbs/week" },
          { step: 6, description: "Verify safe rate", calculation: "(0.625 ÷ 70) × 100 = 0.89% per week (safe range: 1-2%)" },
        ],
        result: "Feed 1,284 kcal per day. The dog will lose weight at a safe rate of 0.89% per week, reaching the 60 lb goal in approximately 16 weeks with proper monitoring.",
      }}
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula", label: "Formula & Methodology" },
        { id: "examples", label: "Worked Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐕" },
        { title: "Dog Ideal Weight Checker", url: "/pets/dog-ideal-weight", icon: "⚖️" },
        { title: "Puppy Calorie Needs Calculator", url: "/pets/puppy-calorie-needs", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance", url: "/pets/dog-treat-calories", icon: "🦴" },
        { title: "Dog Daily Water Intake Calculator", url: "/pets/dog-water-intake", icon: "💧" },
        { title: "Dog Body Condition Score Guide", url: "/pets/dog-body-condition-score", icon: "📊" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}
