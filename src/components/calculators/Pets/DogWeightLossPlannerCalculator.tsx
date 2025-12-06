import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Dog, Activity, Info, HelpCircle, BookOpen } from "lucide-react";

export default function DogWeightLossPlannerCalculator() {
  // Input states
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [activityLevel, setActivityLevel] = useState<"low" | "moderate" | "high">("moderate");
  const [weeklyLossPercent, setWeeklyLossPercent] = useState("1.0");

  // Result ref for scroll
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Helper: convert lb to kg if needed
  const parseWeight = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) return undefined;
    return weightUnit === "kg" ? num : num * 0.453592;
  };

  // Activity factor for MER (maintenance energy requirement)
  const activityFactor = useMemo(() => {
    switch (activityLevel) {
      case "low":
        return 1.0; // sedentary/obese-prone
      case "moderate":
        return 1.2; // typical pet
      case "high":
        return 1.4; // active/young
      default:
        return 1.2;
    }
  }, [activityLevel]);

  // Main calculations
  const {
    rer,
    mer,
    targetCal,
    totalWeightToLose,
    estimatedWeeks,
    safeWeeklyLossKg,
    safeWeeklyLossG,
    currentWeightKg,
    goalWeightKg,
    weeklyLossPercentNum,
  } = useMemo(() => {
    const currentWeightKg = parseWeight(currentWeight);
    const goalWeightKg = parseWeight(goalWeight);
    const weeklyLossPercentNum = Math.max(0.5, Math.min(2.0, parseFloat(weeklyLossPercent) || 1.0)); // 0.5–2% safe range

    if (
      currentWeightKg === undefined ||
      goalWeightKg === undefined ||
      currentWeightKg <= goalWeightKg ||
      goalWeightKg <= 0
    ) {
      return {
        rer: undefined,
        mer: undefined,
        targetCal: undefined,
        totalWeightToLose: undefined,
        estimatedWeeks: undefined,
        safeWeeklyLossKg: undefined,
        safeWeeklyLossG: undefined,
        currentWeightKg,
        goalWeightKg,
        weeklyLossPercentNum,
      };
    }

    // RER = 70 × (ideal weight in kg)^0.75
    const rer = 70 * Math.pow(goalWeightKg, 0.75);

    // MER = RER × activity factor
    const mer = rer * activityFactor;

    // For weight loss, target calories = 80% of MER (typical vet recommendation)
    const targetCal = mer * 0.8;

    // Total weight to lose
    const totalWeightToLose = currentWeightKg - goalWeightKg;

    // Safe weekly loss (kg): 0.5–2% of current weight per week
    const safeWeeklyLossKg = (currentWeightKg * weeklyLossPercentNum) / 100;
    const safeWeeklyLossG = safeWeeklyLossKg * 1000;

    // Estimated weeks to goal
    const estimatedWeeks = totalWeightToLose / safeWeeklyLossKg;

    return {
      rer,
      mer,
      targetCal,
      totalWeightToLose,
      estimatedWeeks,
      safeWeeklyLossKg,
      safeWeeklyLossG,
      currentWeightKg,
      goalWeightKg,
      weeklyLossPercentNum,
    };
  }, [currentWeight, goalWeight, weightUnit, activityFactor, weeklyLossPercent]);

  // Formatters
  const nf0 = (n: number | undefined) =>
    n === undefined ? "--" : Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
  const nf1 = (n: number | undefined) =>
    n === undefined ? "--" : Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(n);
  const nf2 = (n: number | undefined) =>
    n === undefined ? "--" : Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);

  // Handle calculate (scroll to results)
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Handle reset
  const handleReset = () => {
    setCurrentWeight("");
    setGoalWeight("");
    setWeightUnit("kg");
    setActivityLevel("moderate");
    setWeeklyLossPercent("1.0");
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Validation
  const canCalculate =
    !!currentWeight &&
    !!goalWeight &&
    parseWeight(currentWeight) !== undefined &&
    parseWeight(goalWeight) !== undefined &&
    parseWeight(currentWeight)! > parseWeight(goalWeight)! &&
    parseWeight(goalWeight)! > 0;

  return (
    <CalculatorVerticalLayout
      title="Dog Weight Loss Planner"
      description="Plan a safe and effective weight loss program for your dog. Calculates target calories and timeline for goal weight achievement."
      widget={
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Dog className="inline-block mr-2 text-blue-500" />
                Dog Weight Loss Planner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={e => {
                  e.preventDefault();
                  handleCalculate();
                }}
              >
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <Label htmlFor="currentWeight">
                      Current weight
                      <span className="ml-1 text-xs text-slate-500">(in {weightUnit})</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="currentWeight"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder={weightUnit === "kg" ? "e.g. 30" : "e.g. 66"}
                        value={currentWeight}
                        onChange={e => setCurrentWeight(e.target.value)}
                        className="w-32"
                        inputMode="decimal"
                        required
                      />
                      <select
                        className="border rounded px-2 py-1 text-sm bg-background"
                        value={weightUnit}
                        onChange={e => setWeightUnit(e.target.value as "kg" | "lb")}
                        aria-label="Weight unit"
                      >
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="goalWeight">
                      Goal weight
                      <span className="ml-1 text-xs text-slate-500">(in {weightUnit})</span>
                    </Label>
                    <Input
                      id="goalWeight"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder={weightUnit === "kg" ? "e.g. 25" : "e.g. 55"}
                      value={goalWeight}
                      onChange={e => setGoalWeight(e.target.value)}
                      className="w-32"
                      inputMode="decimal"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="activityLevel">
                    Activity level
                    <span className="ml-1 text-xs text-slate-500">(choose best fit)</span>
                  </Label>
                  <div className="flex space-x-4 mt-1">
                    <label className="flex items-center space-x-1">
                      <Input
                        type="radio"
                        name="activityLevel"
                        value="low"
                        checked={activityLevel === "low"}
                        onChange={() => setActivityLevel("low")}
                      />
                      <span className="text-sm">Low (sedentary/obese-prone)</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <Input
                        type="radio"
                        name="activityLevel"
                        value="moderate"
                        checked={activityLevel === "moderate"}
                        onChange={() => setActivityLevel("moderate")}
                      />
                      <span className="text-sm">Moderate (typical pet)</span>
                    </label>
                    <label className="flex items-center space-x-1">
                      <Input
                        type="radio"
                        name="activityLevel"
                        value="high"
                        checked={activityLevel === "high"}
                        onChange={() => setActivityLevel("high")}
                      />
                      <span className="text-sm">High (active/young)</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="weeklyLossPercent">
                    Weekly weight loss rate
                    <span className="ml-1 text-xs text-slate-500">(as % of current weight)</span>
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="weeklyLossPercent"
                      type="number"
                      min="0.5"
                      max="2"
                      step="0.1"
                      placeholder="e.g. 1.0"
                      value={weeklyLossPercent}
                      onChange={e => setWeeklyLossPercent(e.target.value)}
                      className="w-24"
                      inputMode="decimal"
                      required
                    />
                    <span className="text-sm text-slate-500">%</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Typical safe range: 0.5%–2% per week. Most dogs do best at 1% per week.
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button
                    type="submit"
                    disabled={!canCalculate}
                    onClick={handleCalculate}
                  >
                    <Calculator className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div ref={resultRef} />
          <Card className="bg-gradient-to-br from-blue-50/80 to-white dark:from-blue-900/40 dark:to-slate-900/60 border-blue-200 dark:border-blue-700 shadow-lg">
            <CardHeader>
              <CardTitle>
                <Activity className="inline-block mr-2 text-green-600" />
                Weight Loss Plan Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!canCalculate ? (
                <div className="text-slate-500 text-sm flex items-center">
                  <Info className="mr-2 h-5 w-5" />
                  Enter your dog's current and goal weight to see the plan.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-blue-700 dark:text-blue-200">
                    Target daily calories:{" "}
                    <span className="text-2xl font-bold">
                      {nf0(targetCal)} kcal
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-100/60 dark:bg-blue-900/30 rounded p-3">
                      <div className="font-medium text-slate-700 dark:text-slate-200">
                        Estimated weeks to goal:
                      </div>
                      <div className="text-xl font-bold">
                        {nf1(estimatedWeeks)} weeks
                      </div>
                    </div>
                    <div className="bg-blue-100/60 dark:bg-blue-900/30 rounded p-3">
                      <div className="font-medium text-slate-700 dark:text-slate-200">
                        Safe weekly weight loss:
                      </div>
                      <div className="text-xl font-bold">
                        {nf2(safeWeeklyLossKg)} kg (
                        {nf0(safeWeeklyLossG)} g)
                      </div>
                    </div>
                    <div className="bg-blue-100/60 dark:bg-blue-900/30 rounded p-3">
                      <div className="font-medium text-slate-700 dark:text-slate-200">
                        Total weight to lose:
                      </div>
                      <div className="text-xl font-bold">
                        {nf2(totalWeightToLose)} kg
                      </div>
                    </div>
                    <div className="bg-blue-100/60 dark:bg-blue-900/30 rounded p-3">
                      <div className="font-medium text-slate-700 dark:text-slate-200">
                        Calculated RER (Resting Energy Requirement):
                      </div>
                      <div className="text-xl font-bold">
                        {nf0(rer)} kcal/day
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 mt-2 flex items-start">
                    <HelpCircle className="h-4 w-4 mr-1 mt-0.5" />
                    <span>
                      <strong>Note:</strong> This plan is for educational purposes only. Always consult a licensed veterinarian before making decisions about your dog’s diet, weight loss, or health care. Never restrict calories or change feeding without professional guidance.
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      }
      editorial={
        <div>
          <section id="how-to-calculate" className="mb-8">
            <h2 className="text-xl font-bold mb-2">How the Dog Weight Loss Planner Works</h2>
            <p>
              The Dog Weight Loss Planner is a specialized tool designed to help pet owners and veterinary professionals estimate a safe, effective weight loss plan for dogs. By entering your dog’s current and goal weights, activity level, and desired weekly weight loss rate, the calculator provides a recommended daily calorie target and an estimated timeline to reach the goal weight.
            </p>
            <p>
              Weight management is a cornerstone of canine health. Overweight and obese dogs are at higher risk for joint problems, diabetes, heart disease, and reduced quality of life. However, weight loss must be approached carefully—losing weight too quickly can be dangerous, while losing too slowly may not yield health benefits. This planner uses evidence-based veterinary formulas to estimate safe calorie reductions and realistic timelines, supporting a gradual, sustainable approach.
            </p>
            <p>
              The calculations are based on your dog’s ideal (goal) weight and take into account their activity level. The tool applies a safe weekly weight loss rate, typically between 0.5% and 2% of current body weight per week, as recommended by veterinary nutritionists. The result is a tailored plan that helps you and your veterinarian monitor progress and make informed decisions.
            </p>
            <p>
              Remember, this calculator is an educational resource. Every dog is unique, and factors such as age, breed, medical history, and metabolism can influence weight loss. Always consult your veterinarian before starting or modifying your dog’s weight loss program.
            </p>
          </section>
          <section id="formula" className="mb-8">
            <h2 className="text-xl font-bold mb-2">Formula Used in the Dog Weight Loss Planner</h2>
            <p>
              The Dog Weight Loss Planner uses a multi-step formula based on veterinary nutrition guidelines:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>
                <strong>Resting Energy Requirement (RER):</strong> <br />
                <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded">RER = 70 × (Ideal Weight in kg)<sup>0.75</sup></span>
              </li>
              <li>
                <strong>Maintenance Energy Requirement (MER):</strong> <br />
                <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded">MER = RER × Activity Factor</span>
                <br />
                Activity Factor varies: 1.0 (low), 1.2 (moderate), 1.4 (high)
              </li>
              <li>
                <strong>Target Calories for Weight Loss:</strong> <br />
                <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Target Calories = MER × 0.8</span>
                <br />
                (A 20% reduction is a typical starting point for safe weight loss.)
              </li>
              <li>
                <strong>Safe Weekly Weight Loss:</strong> <br />
                <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Weekly Loss = Current Weight × (Weekly Loss % / 100)</span>
                <br />
                (Recommended: 0.5%–2% per week)
              </li>
              <li>
                <strong>Estimated Weeks to Goal:</strong> <br />
                <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Weeks = (Current Weight – Goal Weight) / Weekly Loss</span>
              </li>
            </ul>
            <p>
              <strong>Variables:</strong>
            </p>
            <ul className="list-disc ml-6">
              <li>
                <strong>Current Weight:</strong> Your dog’s present body weight (kg or lb).
              </li>
              <li>
                <strong>Goal Weight:</strong> The target healthy weight for your dog (kg or lb).
              </li>
              <li>
                <strong>Activity Level:</strong> Sedentary, moderate, or high—affects calorie needs.
              </li>
              <li>
                <strong>Weekly Loss %:</strong> The percentage of current weight to lose per week.
              </li>
            </ul>
            <p>
              <strong>Assumptions & Limitations:</strong> The formulas assume your dog is otherwise healthy, not a puppy, pregnant, or lactating. The calorie targets are estimates; individual needs may vary. Always consult a veterinarian for a personalized plan.
            </p>
          </section>
          <section id="how-to-use" className="mb-8">
            <h2 className="text-xl font-bold mb-2">How to Use the Dog Weight Loss Planner</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                <strong>Enter your dog’s current weight:</strong> Use kilograms (kg) or pounds (lb). If unsure, ask your veterinarian or use a pet scale.
              </li>
              <li>
                <strong>Enter your dog’s goal weight:</strong> This is the healthy weight you and your vet have agreed upon. It should be less than the current weight.
              </li>
              <li>
                <strong>Select the weight unit:</strong> Choose between kg and lb for your convenience. The calculator will handle conversions automatically.
              </li>
              <li>
                <strong>Choose your dog’s activity level:</strong> Select “Low” for sedentary or obese-prone dogs, “Moderate” for typical pets, or “High” for very active or young dogs.
              </li>
              <li>
                <strong>Set the weekly weight loss rate:</strong> Enter a value between 0.5% and 2%. Most dogs do best at 1% per week. Never exceed 2% without veterinary supervision.
              </li>
              <li>
                <strong>Click “Calculate”:</strong> The planner will display your dog’s daily calorie target, safe weekly weight loss, estimated weeks to goal, and other supporting numbers.
              </li>
              <li>
                <strong>Review the results:</strong> Use the plan as a starting point for discussion with your veterinarian. Adjust as needed based on your dog’s progress and health.
              </li>
            </ol>
          </section>
          <section id="understanding-results" className="mb-8">
            <h2 className="text-xl font-bold mb-2">Understanding the Results</h2>
            <p>
              The Dog Weight Loss Planner provides several key numbers to guide your dog’s weight loss journey:
            </p>
            <ul className="list-disc ml-6 mb-2">
              <li>
                <strong>Target daily calories:</strong> The recommended daily caloric intake to promote safe weight loss. This is typically 80% of your dog’s maintenance needs at their goal weight and activity level.
              </li>
              <li>
                <strong>Estimated weeks to goal:</strong> The projected time required to reach the goal weight, based on the chosen weekly loss rate. This helps set realistic expectations and track progress.
              </li>
              <li>
                <strong>Safe weekly weight loss:</strong> The amount of weight (in kg and grams) your dog should lose each week. Staying within the 0.5%–2% range helps prevent health risks.
              </li>
              <li>
                <strong>Total weight to lose:</strong> The difference between current and goal weight.
              </li>
              <li>
                <strong>Calculated RER:</strong> The baseline energy requirement for your dog at their goal weight.
              </li>
            </ul>
            <p>
              <strong>Interpreting the numbers:</strong> A higher target calorie number means your dog needs more energy, usually due to higher activity or larger size. A lower number means stricter calorie control is needed. The estimated weeks to goal helps you plan and monitor progress—if your dog loses weight faster or slower than projected, adjust the plan with your veterinarian’s guidance.
            </p>
            <p>
              <strong>Practical tips:</strong> Weigh your dog regularly (every 1–2 weeks), keep a feeding diary, and avoid excessive treats. If your dog seems hungry or lethargic, or if weight loss stalls, consult your veterinarian promptly. Never restrict calories below recommended levels without professional advice.
            </p>
          </section>
          <section id="examples" className="mb-8">
            <h2 className="text-xl font-bold mb-2">Example: Planning Weight Loss for a Labrador Retriever</h2>
            <p>
              Let’s walk through an example to illustrate how the Dog Weight Loss Planner can be used in practice.
            </p>
            <p>
              <strong>Scenario:</strong> Bella is a 32 kg (70.5 lb) female Labrador Retriever. Her veterinarian recommends a goal weight of 27 kg (59.5 lb). Bella is moderately active, and her owner wants to aim for a 1% weekly weight loss rate.
            </p>
            <ol className="list-decimal ml-6 mb-2">
              <li>
                <strong>Current weight:</strong> 32 kg
              </li>
              <li>
                <strong>Goal weight:</strong> 27 kg
              </li>
              <li>
                <strong>Activity level:</strong> Moderate (factor 1.2)
              </li>
              <li>
                <strong>Weekly loss rate:</strong> 1%
              </li>
            </ol>
            <p>
              <strong>Step 1: Calculate RER at goal weight</strong><br />
              RER = 70 × (27)<sup>0.75</sup> ≈ 70 × 10.47 ≈ 733 kcal/day
            </p>
            <p>
              <strong>Step 2: Calculate MER</strong><br />
              MER = RER × 1.2 = 733 × 1.2 = 880 kcal/day
            </p>
            <p>
              <strong>Step 3: Calculate target calories for weight loss</strong><br />
              Target Calories = 880 × 0.8 = 704 kcal/day
            </p>
            <p>
              <strong>Step 4: Calculate safe weekly weight loss</strong><br />
              Weekly Loss = 32 kg × 1% = 0.32 kg (320 g) per week
            </p>
            <p>
              <strong>Step 5: Estimate weeks to goal</strong><br />
              Total weight to lose = 32 kg – 27 kg = 5 kg<br />
              Weeks = 5 kg / 0.32 kg ≈ 15.6 weeks
            </p>
            <p>
              <strong>Interpretation:</strong> Bella’s owner should feed about 704 kcal per day, expect a weight loss of 320 g per week, and anticipate reaching the goal weight in about 16 weeks. Regular check-ins with the veterinarian will help ensure Bella stays healthy and on track.
            </p>
          </section>
          <section id="faq" className="mb-8">
            <h2 className="text-xl font-bold mb-2">Frequently Asked Questions</h2>
            <h3 className="font-semibold mt-4 mb-1">How do I determine my dog’s ideal (goal) weight?</h3>
            <p>
              Determining a dog’s ideal weight is best done in consultation with a veterinarian. Vets use body condition scoring, breed standards, and your dog’s age, size, and health status to recommend a healthy target. Online charts can provide rough estimates, but individual variation is significant. Never set a goal weight without professional input, as being underweight can be as harmful as being overweight.
            </p>
            <p>
              If you’re unsure, schedule a wellness exam. Your vet can assess your dog’s body condition and help you set a realistic, safe goal.
            </p>
            <h3 className="font-semibold mt-4 mb-1">Is it safe to restrict my dog’s calories for weight loss?</h3>
            <p>
              Calorie restriction must be done carefully. Losing weight too quickly can cause muscle loss, nutritional deficiencies, or even life-threatening conditions like hepatic lipidosis (especially in small breeds). The safe rate is typically 0.5%–2% of current body weight per week. This calculator uses those guidelines, but individual needs may vary.
            </p>
            <p>
              Always consult your veterinarian before starting a weight loss plan. They may recommend a prescription weight loss diet to ensure your dog gets all essential nutrients while reducing calories.
            </p>
            <h3 className="font-semibold mt-4 mb-1">
                What if my dog seems hungry all the time on the diet?
              </h3>
