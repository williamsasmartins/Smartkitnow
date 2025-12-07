import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogWeightLossPlannerCalculator() {
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentWeightUnit, setCurrentWeightUnit] = useState<"kg" | "lb">("kg");
  const [goalWeight, setGoalWeight] = useState("");
  const [goalWeightUnit, setGoalWeightUnit] = useState<"kg" | "lb">("kg");
  const [dailyCalorieIntake, setDailyCalorieIntake] = useState("");
  const [calorieIntakeUnit, setCalorieIntakeUnit] = useState<"kcal">("kcal");
  const [weightLossRate, setWeightLossRate] = useState("1"); // percent per week
  const [result, setResult] = useState<{
    targetCalories: number;
    totalWeightToLose: number;
    weeksNeeded: number;
  } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Convert weight inputs to kg internally
  const parseWeight = (value: string, unit: "kg" | "lb") => {
    const n = parseFloat(value);
    if (isNaN(n) || n <= 0) return null;
    return unit === "kg" ? n : n * 0.45359237;
  };

  const parseCalories = (value: string) => {
    const n = parseFloat(value);
    if (isNaN(n) || n <= 0) return null;
    return n;
  };

  // Calculate target calories for weight loss:
  // Typical safe weight loss rate for dogs is 1-2% body weight per week.
  // Calorie deficit needed is roughly 7700 kcal per kg of fat lost.
  // So weekly deficit = weightLossRate% * currentWeightKg * 7700 kcal/kg
  // Daily deficit = weekly deficit / 7
  // Target calories = current daily calories - daily deficit
  // If dailyCalorieIntake is unknown, estimate maintenance calories as:
  // RER = 70 * (weightKg)^0.75
  // MER = RER * 1.6 (moderate activity)
  // Use MER as maintenance calories.

  const calculate = () => {
    const currentKg = parseWeight(currentWeight, currentWeightUnit);
    const goalKg = parseWeight(goalWeight, goalWeightUnit);
    const currentCalories = parseCalories(dailyCalorieIntake);

    if (!currentKg || !goalKg || goalKg >= currentKg) {
      setResult(null);
      return;
    }

    const weightToLose = currentKg - goalKg;

    // Calculate maintenance calories if not provided
    const maintenanceCalories =
      currentCalories ??
      70 * Math.pow(currentKg, 0.75) * 1.6;

    // Weight loss rate as decimal
    const rate = parseFloat(weightLossRate) / 100;
    if (rate <= 0 || rate > 5) {
      setResult(null);
      return;
    }

    // Weekly weight loss in kg
    const weeklyWeightLoss = currentKg * rate;

    // Total weeks needed
    const weeks = weightToLose / weeklyWeightLoss;

    // Total kcal deficit needed
    const totalDeficit = weightToLose * 7700;

    // Daily deficit kcal
    const dailyDeficit = totalDeficit / (weeks * 7);

    // Target calories per day
    const targetCalories = maintenanceCalories - dailyDeficit;

    setResult({
      targetCalories: Math.max(targetCalories, 0),
      totalWeightToLose: weightToLose,
      weeksNeeded: Math.ceil(weeks),
    });

    if (resultsRef.current) {
      window.scrollTo({
        top: resultsRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const widget = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        calculate();
      }}
      className="space-y-6"
      noValidate
    >
      <div>
        <Label htmlFor="currentWeight" className="flex justify-between">
          Current Weight
          <select
            aria-label="Current weight unit"
            value={currentWeightUnit}
            onChange={(e) =>
              setCurrentWeightUnit(e.target.value as "kg" | "lb")
            }
            className="ml-2 rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </Label>
        <Input
          id="currentWeight"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 20"
          value={currentWeight}
          onChange={(e) => setCurrentWeight(e.target.value)}
          required
          aria-describedby="currentWeightHelp"
        />
        <p id="currentWeightHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your dog's current weight. Use kg or lb as selected.
        </p>
      </div>

      <div>
        <Label htmlFor="goalWeight" className="flex justify-between">
          Goal Weight
          <select
            aria-label="Goal weight unit"
            value={goalWeightUnit}
            onChange={(e) => setGoalWeightUnit(e.target.value as "kg" | "lb")}
            className="ml-2 rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </Label>
        <Input
          id="goalWeight"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 15"
          value={goalWeight}
          onChange={(e) => setGoalWeight(e.target.value)}
          required
          aria-describedby="goalWeightHelp"
        />
        <p id="goalWeightHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your dog's target weight for the weight loss plan.
        </p>
      </div>

      <div>
        <Label htmlFor="dailyCalorieIntake" className="flex justify-between">
          Current Daily Calories (optional)
          <span className="text-sm text-slate-500 dark:text-slate-400">kcal</span>
        </Label>
        <Input
          id="dailyCalorieIntake"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 900"
          value={dailyCalorieIntake}
          onChange={(e) => setDailyCalorieIntake(e.target.value)}
          aria-describedby="dailyCalorieIntakeHelp"
        />
        <p id="dailyCalorieIntakeHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Optional: Enter your dog's current daily calorie intake. If unknown, the calculator will estimate maintenance calories.
        </p>
      </div>

      <div>
        <Label htmlFor="weightLossRate" className="flex justify-between">
          Desired Weekly Weight Loss Rate
          <span className="text-sm text-slate-500 dark:text-slate-400">%</span>
        </Label>
        <Input
          id="weightLossRate"
          type="number"
          min="0.1"
          max="5"
          step="0.1"
          value={weightLossRate}
          onChange={(e) => setWeightLossRate(e.target.value)}
          required
          aria-describedby="weightLossRateHelp"
        />
        <p id="weightLossRateHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Recommended safe range is 1-2% per week. Do not exceed 5% to avoid health risks.
        </p>
      </div>

      <Button type="submit" className="w-full">
        Calculate Weight Loss Plan
      </Button>

      {result && (
        <div ref={resultsRef} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Total Weight to Lose</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 dark:text-slate-300">
              {result.totalWeightToLose.toFixed(2)} kg
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Estimated Weeks Needed</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 dark:text-slate-300">
              {result.weeksNeeded} weeks
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Target Daily Calories</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 dark:text-slate-300">
              {result.targetCalories.toFixed(0)} kcal/day
            </CardContent>
          </Card>
        </div>
      )}
    </form>
  );

  const onThisPage = [
    { id: "how-to-use", label: "How to Use This Calculator" },
    { id: "formulas-theory", label: "Formulas / Theory" },
    { id: "example", label: "Example Calculation" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "disclaimer", label: "Disclaimer" },
    { id: "references", label: "References" },
  ];

  const editorial = (
    <>
      <section id="how-to-use" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          This calculator helps you plan a safe and effective weight loss program for your dog by estimating the target daily calories and the timeline needed to reach your dog's goal weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Weight management is crucial for your dog's health and longevity. Losing weight too quickly or without proper calorie control can be harmful. This tool provides a guideline based on safe weight loss rates.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          After entering your dog's current weight, goal weight, and optionally current daily calorie intake, select a safe weekly weight loss rate. The calculator will estimate how many weeks it will take and the target calories per day.
        </p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4">
          <li>
            <strong>Current Weight:</strong> Your dog's present weight. Choose kg or lb. Use the most recent and accurate measurement.
          </li>
          <li>
            <strong>Goal Weight:</strong> The target weight you want your dog to reach. Must be less than current weight.
          </li>
          <li>
            <strong>Current Daily Calories (optional):</strong> If you know how many calories your dog currently consumes daily, enter it. Otherwise, the calculator estimates maintenance calories.
          </li>
          <li>
            <strong>Desired Weekly Weight Loss Rate:</strong> Percentage of body weight to lose per week. Recommended is 1-2%. Avoid exceeding 5%.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300">
          Remember, this calculator is an educational tool and does not replace professional veterinary advice. Always consult your veterinarian before starting a weight loss program for your dog.
        </p>
      </section>

      <section id="formulas-theory" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Formulas / Theory
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          The calculator estimates your dog's target daily calories based on the desired weekly weight loss rate and current or estimated maintenance calories.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Maintenance calories are estimated using the formula for Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER):
        </p>
        <p className="text-slate-700 dark:text-slate-300 font-mono mb-2">
          RER = 70 × (weight in kg)<sup>0.75</sup>
          <br />
          MER = RER × Activity Factor (typically 1.6 for moderate activity)
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Weight loss requires a calorie deficit. Approximately 7700 kcal deficit is needed to lose 1 kg of fat.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The weekly weight loss in kg is calculated as:
        </p>
        <p className="text-slate-700 dark:text-slate-300 font-mono mb-4">
          Weekly Weight Loss (kg) = Current Weight (kg) × Weight Loss Rate (% / 100)
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Then, the daily calorie deficit is:
        </p>
        <p className="text-slate-700 dark:text-slate-300 font-mono mb-4">
          Daily Deficit (kcal) = (Weight to Lose (kg) × 7700) / (Weeks × 7)
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Finally, target daily calories are:
        </p>
        <p className="text-slate-700 dark:text-slate-300 font-mono">
          Target Calories = Maintenance Calories − Daily Deficit
        </p>
        <table className="w-full mt-6 border border-slate-300 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-100 dark:bg-slate-800">
            <tr>
              <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">Activity Level</th>
              <th className="border border-slate-300 dark:border-slate-700 p-2 text-left">MER Factor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 p-2">Inactive / Neutered</td>
              <td className="border border-slate-300 dark:border-slate-700 p-2">1.2</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 p-2">Moderate Activity</td>
              <td className="border border-slate-300 dark:border-slate-700 p-2">1.6</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 p-2">Active / Working Dog</td>
              <td className="border border-slate-300 dark:border-slate-700 p-2">2.0</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="example" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Example Calculation
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          A 26 lb (≈ 11.8 kg) dog currently weighs 26 lb and the owner wants to reduce the weight to 20 lb (≈ 9.1 kg). The dog’s current daily calorie intake is unknown, so maintenance calories will be estimated. The owner chooses a safe weekly weight loss rate of 1.5%.
        </p>
        <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 space-y-3 mb-4">
          <li>
            <strong>Convert weights to kilograms:</strong> 26 lb × 0.45359237 = 11.8 kg (current), 20 lb × 0.45359237 = 9.1 kg (goal).
          </li>
          <li>
            <strong>Calculate maintenance calories:</strong> RER = 70 × 11.8<sup>0.75</sup> ≈ 394 kcal; MER = 394 × 1.6 = 630 kcal/day.
          </li>
          <li>
            <strong>Calculate weekly weight loss:</strong> 11.8 kg × 1.5% = 0.177 kg/week.
          </li>
          <li>
            <strong>Calculate weeks needed:</strong> (11.8 − 9.1) / 0.177 ≈ 15.3 weeks (rounded up to 16 weeks).
          </li>
          <li>
            <strong>Calculate daily calorie deficit:</strong> (2.7 kg × 7700 kcal/kg) / (16 × 7) ≈ 185 kcal/day.
          </li>
          <li>
            <strong>Calculate target daily calories:</strong> 630 − 185 = 445 kcal/day.
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300">
          The dog should be fed approximately 445 kcal per day to safely reach the goal weight in about 16 weeks.
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Frequently Asked Questions
        </h2>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          Why is it important to lose weight slowly in dogs?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Losing weight too quickly can cause muscle loss, nutritional deficiencies, and other health problems in dogs. A gradual weight loss of 1-2% per week is generally considered safe and sustainable, allowing the dog’s body to adjust and maintain muscle mass.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          What if I don’t know my dog’s current daily calorie intake?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          If you don’t know your dog’s current calorie intake, the calculator estimates maintenance calories based on your dog’s weight and typical activity level. This provides a reasonable starting point for planning a weight loss diet.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          Can I use this calculator for puppies or pregnant dogs?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          No, this calculator is designed for adult dogs needing weight loss. Puppies, pregnant, or lactating dogs have different nutritional needs and should be managed under veterinary guidance.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          How often should I re-evaluate my dog’s weight loss plan?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Regularly monitor your dog’s weight every 2-4 weeks and adjust calorie intake as needed. Weight loss may slow over time, so periodic reassessment with your veterinarian ensures the plan remains safe and effective.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          What if my dog refuses to eat the target calories?
        </h3>
        <p className="text-slate-700 dark:text-slate-300">
          Appetite changes can occur during weight loss. Consult your veterinarian if your dog refuses food or shows signs of distress. They may recommend alternative diets or supplements to maintain health.
        </p>
      </section>

      <section id="disclaimer" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is intended for educational purposes only and does not replace professional veterinary advice. Always consult your veterinarian before starting or changing your dog’s weight loss program to ensure it is safe and appropriate for your pet’s individual health needs.
        </p>
      </section>

      <section id="references" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          References
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.wsava.org/WSAVA/media/Documents/Guidelines/Nutrition-Guidelines-WSAVA-2019.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Nutritional Assessment Guidelines (2019)
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Provides comprehensive guidelines on nutritional assessment and weight management in dogs and cats.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6313445/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                German, A. J. (2016). The Growing Problem of Obesity in Dogs and Cats.
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                A detailed review of obesity prevalence, health risks, and management strategies in companion animals.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/weight-loss"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Cornell University College of Veterinary Medicine: Weight Loss in Pets
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Practical advice and scientific background on safe weight loss programs for dogs and cats.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.akc.org/expert-advice/nutrition/how-to-help-your-dog-lose-weight/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                American Kennel Club: How to Help Your Dog Lose Weight
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                A practical guide for dog owners on managing weight loss safely and effectively.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );

  const formula = {
    title: "Key formulas used in this calculator",
    formula:
      "RER = 70 × (weight in kg)^0.75; MER = RER × Activity Factor; Weekly Weight Loss (kg) = Current Weight × Weight Loss Rate; Daily Deficit = (Weight to Lose × 7700) / (Weeks × 7); Target Calories = Maintenance Calories − Daily Deficit",
    variables: [
      {
        symbol: "RER",
        name: "Resting Energy Requirement",
        description:
          "The basic energy requirement for a dog at rest, calculated based on body weight in kilograms.",
      },
      {
        symbol: "MER",
        name: "Maintenance Energy Requirement",
        description:
          "The estimated daily calorie needs for a dog based on activity level, calculated by multiplying RER by an activity factor.",
      },
      {
        symbol: "Weight Loss Rate",
        name: "Weekly Weight Loss Rate (%)",
        description:
          "The percentage of body weight the dog is intended to lose each week, typically between 1-2%.",
      },
      {
        symbol: "7700 kcal/kg",
        name: "Calorie Deficit per Kilogram",
        description:
          "Approximate number of calories that must be burned or restricted to lose one kilogram of body fat.",
      },
    ],
  };

  const example = {
    title: "Example: Planning Weight Loss for a 26 lb Dog",
    scenario:
      "A dog weighing 26 lb (≈ 11.8 kg) needs to lose weight to reach 20 lb (≈ 9.1 kg). The owner does not know the