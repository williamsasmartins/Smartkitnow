import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogWeightLossPlannerCalculator() {
  const [currentWeightKg, setCurrentWeightKg] = useState("");
  const [goalWeightKg, setGoalWeightKg] = useState("");
  const [weightLossRatePercent, setWeightLossRatePercent] = useState("2");
  const [activityLevelFactor, setActivityLevelFactor] = useState("1.4");
  const [result, setResult] = useState<{
    targetCalories: number;
    weeklyWeightLossKg: number;
    estimatedWeeks: number;
  } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Constants
  // 7700 kcal per kg of fat loss (approximate)
  // MER factor adjusts maintenance calories based on activity

  function calculate() {
    const current = parseFloat(currentWeightKg);
    const goal = parseFloat(goalWeightKg);
    const ratePercent = parseFloat(weightLossRatePercent);
    const activityFactor = parseFloat(activityLevelFactor);

    if (
      isNaN(current) ||
      isNaN(goal) ||
      isNaN(ratePercent) ||
      isNaN(activityFactor) ||
      current <= 0 ||
      goal <= 0 ||
      ratePercent <= 0 ||
      activityFactor <= 0 ||
      goal >= current
    ) {
      setResult(null);
      return;
    }

    // Resting Energy Requirement (RER) = 70 * (weight in kg)^0.75
    const RER = 70 * Math.pow(current, 0.75);

    // Maintenance Energy Requirement (MER) = RER * activity factor
    const MER = RER * activityFactor;

    // Weekly weight loss in kg = (weightLossRate% / 100) * current weight
    const weeklyWeightLossKg = (ratePercent / 100) * current;

    // Weekly calorie deficit = 7700 kcal * weeklyWeightLossKg
    const weeklyCalorieDeficit = 7700 * weeklyWeightLossKg;

    // Daily calorie deficit = weeklyCalorieDeficit / 7
    const dailyCalorieDeficit = weeklyCalorieDeficit / 7;

    // Target calories = MER - dailyCalorieDeficit
    const targetCalories = MER - dailyCalorieDeficit;

    // Estimated weeks to reach goal = (current - goal) / weeklyWeightLossKg
    const estimatedWeeks = (current - goal) / weeklyWeightLossKg;

    setResult({
      targetCalories: Math.max(targetCalories, 0),
      weeklyWeightLossKg,
      estimatedWeeks,
    });

    if (resultsRef.current) {
      window.scrollTo({
        top: resultsRef.current.offsetTop - 20,
        behavior: "smooth",
      });
    }
  }

  const widget = (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Dog Weight Loss Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="currentWeight" className="mb-1 block text-slate-700 dark:text-slate-300">
            Current Weight (kg)
          </Label>
          <Input
            id="currentWeight"
            type="number"
            min={0}
            step="0.1"
            value={currentWeightKg}
            onChange={(e) => setCurrentWeightKg(e.target.value)}
            placeholder="e.g. 20"
          />
        </div>
        <div>
          <Label htmlFor="goalWeight" className="mb-1 block text-slate-700 dark:text-slate-300">
            Goal Weight (kg)
          </Label>
          <Input
            id="goalWeight"
            type="number"
            min={0}
            step="0.1"
            value={goalWeightKg}
            onChange={(e) => setGoalWeightKg(e.target.value)}
            placeholder="e.g. 15"
          />
        </div>
        <div>
          <Label htmlFor="weightLossRate" className="mb-1 block text-slate-700 dark:text-slate-300">
            Weekly Weight Loss Rate (% of current weight)
          </Label>
          <Input
            id="weightLossRate"
            type="number"
            min={0.5}
            max={5}
            step="0.1"
            value={weightLossRatePercent}
            onChange={(e) => setWeightLossRatePercent(e.target.value)}
            placeholder="e.g. 2"
          />
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Recommended safe range: 1% to 3%
          </p>
        </div>
        <div>
          <Label htmlFor="activityLevel" className="mb-1 block text-slate-700 dark:text-slate-300">
            Activity Level Factor
          </Label>
          <select
            id="activityLevel"
            value={activityLevelFactor}
            onChange={(e) => setActivityLevelFactor(e.target.value)}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="1.2">Low activity (mostly resting)</option>
            <option value="1.4">Moderate activity (typical pet dog)</option>
            <option value="1.6">High activity (active, working dog)</option>
          </select>
        </div>
        <Button onClick={calculate} className="w-full">
          Calculate
        </Button>
        {result && (
          <div ref={resultsRef} className="mt-6 space-y-4">
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Target Daily Calories
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {result.targetCalories.toFixed(0)} kcal/day
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Estimated Weekly Weight Loss
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {result.weeklyWeightLossKg.toFixed(2)} kg/week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Estimated Time to Reach Goal
                </h3>
                <p className="text-slate-700 dark:text-slate-300">
                  {result.estimatedWeeks.toFixed(1)} weeks
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
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
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This calculator helps you plan a safe and effective weight loss program for your dog by estimating the target daily calories and the expected timeline to reach your dog's goal weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Maintaining a healthy weight is crucial for your dog's overall well-being, mobility, and longevity. This tool provides guidance on calorie intake adjustments based on your dog's current weight, goal weight, activity level, and a safe weekly weight loss rate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Interpret the results as a starting point for planning your dog's diet and exercise. Always consult your veterinarian before making significant changes to your dog's feeding or activity routine.
        </p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-3">
          <li>
            <strong>Current Weight (kg):</strong> Your dog's present weight in kilograms. Use an accurate scale or vet measurement.
          </li>
          <li>
            <strong>Goal Weight (kg):</strong> The healthy target weight you want your dog to achieve.
          </li>
          <li>
            <strong>Weekly Weight Loss Rate (%):</strong> The percentage of current weight your dog will lose each week. Recommended safe range is 1% to 3%.
          </li>
          <li>
            <strong>Activity Level Factor:</strong> Select the factor that best matches your dog's daily activity level to adjust calorie needs.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is an educational tool and does not replace professional veterinary advice or diagnosis.
        </p>
      </section>

      <section id="formulas-theory" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Formulas / Theory
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          The calculator uses established formulas to estimate your dog's energy requirements and weight loss timeline.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          First, the Resting Energy Requirement (RER) estimates the calories needed for basic bodily functions:
        </p>
        <code className="block whitespace-pre-wrap break-words mb-3">
          RER = 70 × (Current Weight in kg)^0.75
        </code>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Then, the Maintenance Energy Requirement (MER) adjusts RER by an activity factor to account for your dog's lifestyle:
        </p>
        <code className="block whitespace-pre-wrap break-words mb-3">
          MER = RER × Activity Level Factor
        </code>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          To lose weight safely, a calorie deficit is created based on the desired weekly weight loss rate. Approximately 7700 kcal corresponds to 1 kg of fat loss:
        </p>
        <code className="block whitespace-pre-wrap break-words mb-3">
          Target Calories = MER − (Weekly Weight Loss Rate % × Current Weight in kg × 7700) / 7
        </code>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          The estimated time to reach the goal weight is calculated by dividing the total weight to lose by the weekly weight loss.
        </p>
        <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 mb-3">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-left text-slate-900 dark:text-slate-100">Activity Level</th>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-left text-slate-900 dark:text-slate-100">Factor</th>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-left text-slate-900 dark:text-slate-100">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300">Low activity</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300">1.2</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300">Mostly resting, minimal exercise</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300">Moderate activity</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300">1.4</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300">Typical pet dog with daily walks</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300">High activity</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300">1.6</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1 text-slate-700 dark:text-slate-300">Active, working, or sporting dogs</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="example" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Example Calculation
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Suppose you have a dog weighing 20 kg and want to reduce its weight to 15 kg safely. You choose a weekly weight loss rate of 2% and your dog has a moderate activity level.
        </p>
        <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300 mb-4">
          <li>
            Calculate RER: 70 × 20^0.75 = 70 × 9.46 = 662 kcal/day
          </li>
          <li>
            Calculate MER: 662 × 1.4 (moderate activity) = 927 kcal/day
          </li>
          <li>
            Calculate weekly weight loss: 2% of 20 kg = 0.4 kg/week
          </li>
          <li>
            Calculate daily calorie deficit: (0.4 kg × 7700 kcal/kg) ÷ 7 = 440 kcal/day
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300">
          Target calories = MER − daily calorie deficit = 927 − 440 = 487 kcal/day. Estimated time to reach goal weight: (20 − 15) ÷ 0.4 = 12.5 weeks.
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Frequently Asked Questions
        </h2>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          Is it safe for my dog to lose 2% of its body weight per week?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Yes, a weight loss rate between 1% and 3% per week is generally considered safe for most dogs. Losing weight too quickly can cause health issues, so it is important to aim for gradual loss.
          Always consult your veterinarian before starting a weight loss program.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          How do I measure my dog’s current weight accurately?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Use a pet scale or visit your veterinarian to get an accurate measurement. Home bathroom scales can be used by weighing yourself first, then weighing yourself holding your dog and subtracting the difference.
          Consistency in measurement conditions helps track progress reliably.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          What does the activity level factor represent?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The activity level factor adjusts your dog’s energy needs based on how active they are daily. Sedentary dogs require fewer calories, while active or working dogs need more energy.
          Selecting the correct factor helps tailor calorie recommendations more accurately.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          Can I use this calculator for puppies or senior dogs?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          This calculator is designed for adult dogs aiming to lose weight safely. Puppies and senior dogs have different nutritional needs and energy requirements.
          Consult your veterinarian for specialized guidance for these age groups.
        </p>
      </section>

      <section id="disclaimer" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is intended for educational purposes only and does not replace professional veterinary advice. Always consult your veterinarian before making changes to your dog’s diet or exercise routine.
          Individual needs may vary based on health status, breed, age, and other factors.
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
                href="https://www.wsava.org/global-guidelines/nutrition-guidelines/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Global Nutrition Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Comprehensive guidelines on pet nutrition and weight management from the World Small Animal Veterinary Association.
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
                Cornell Feline Health Center: Weight Loss in Cats and Dogs
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Expert advice on safe weight loss strategies and calorie management for pets.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.merckvetmanual.com/nutrition/obesity-in-small-animals/overview-of-obesity-in-small-animals"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Merck Veterinary Manual: Obesity in Small Animals
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Detailed overview of obesity causes, risks, and management in dogs and cats.
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
                National Institutes of Health: Energy Requirements of Dogs
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Peer-reviewed research on energy needs and metabolism in dogs, supporting the formulas used in this calculator.
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
      "RER = 70 × (Current Weight in kg)^0.75\n" +
      "MER = RER × Activity Level Factor\n" +
      "Target Calories = MER − (Weekly Weight Loss Rate % × Current Weight in kg × 7700) / 7",
    variables: [
      {
        symbol: "RER",
        name: "Resting Energy Requirement",
        description:
          "The baseline calories needed for basic bodily functions at rest, based on metabolic weight.",
      },
      {
        symbol: "MER",
        name: "Maintenance Energy Requirement",
        description:
          "Calories needed to maintain current weight, adjusted for activity level.",
      },
      {
        symbol: "Weekly Weight Loss Rate %",
        name: "Weekly Weight Loss Rate Percentage",
        description:
          "The percentage of current body weight targeted for loss each week, typically 1% to 3%.",
      },
      {
        symbol: "7700 kcal/kg",
        name: "Energy content of fat",
        description:
          "Approximate calories stored in 1 kilogram of body fat, used to calculate calorie deficit.",
      },
    ],
  };

  const example = {
    title: "Example: Planning Weight Loss for a 20 kg Dog",
    scenario:
      `You have a dog weighing 20 kg and want to reduce its weight to 15 kg safely. You choose a weekly weight loss rate of 2% and your dog has a moderate activity level.`,
    steps: [
      {
        step: 1,
        description: "Calculate Resting Energy Requirement (RER)",
        calculation: "70 × 20^0.75 = 662 kcal/day",
      },
      {
        step: 2,
        description: "Calculate Maintenance Energy Requirement (MER)",
        calculation: "662 × 1.4 = 927 kcal/day",
      },
      {
        step: 3,
        description: "Calculate weekly weight loss in kg",
        calculation: "2% of 20 kg = 0.4 kg/week",
      },
      {
        step: 4,
        description: "Calculate daily calorie deficit",
        calculation: "(0.4 × 7700) ÷ 7 = 440 kcal/day",
      },
    ],
    result:
      `The target daily calories for the dog are 927 − 440 = 487 kcal/day. At this rate, it will take approximately 12.5 weeks to reach the goal weight of 15 kg.`,
  };

  const relatedCalculators = [
    {
      title: "Dog Calorie Needs Calculator",
      url: "/pets/dogs-nutrition/dog-calorie-needs-calculator",
      icon: "🐕",
    },
    {
      title: "Dog Ideal Weight Calculator",
      url: "/pets/dogs-nutrition/dog-ideal-weight-calculator",
      icon: "⚖️",
    },
    {
      title: "Puppy Growth Rate Calculator",
      url: "/pets/dogs-nutrition/puppy-growth-rate-calculator",
      icon: "🐶",
    },
    {
      title: "Pet Body Condition Score Guide",
      url: "/pets/dogs-nutrition/pet-body-condition-score",
      icon: "📏",
    },
  ];

  const faqItems = [
    {
      question: "Is it safe for my dog to lose 2% of its body weight per week?",
      answer: `Yes, a weight loss rate between 1% and 3% per week is generally considered safe for most dogs. Losing weight too quickly can cause health issues, so it is important to aim for gradual loss.
Always consult your veterinarian before starting a weight loss program.`,
    },
    {
      question: "How do I measure my dog’s current weight accurately?",
      answer: `Use a pet scale or visit your veterinarian to get an accurate measurement. Home bathroom scales can be used by weighing yourself first, then weighing yourself holding your dog and subtracting the difference.
Consistency in measurement conditions helps track progress reliably.`,
    },
    {
      question: "What does the activity level factor represent?",
      answer: `The activity level factor adjusts your dog’s energy needs based on how active they are daily. Sedentary dogs require fewer calories, while active or working dogs need more energy.
Selecting the correct factor helps tailor calorie recommendations more accurately.`,
    },
    {
      question: "Can I use this calculator for puppies or senior dogs?",
      answer: `This calculator is designed for adult dogs aiming to lose weight safely. Puppies and senior dogs have different nutritional needs and energy requirements.
Consult your veterinarian for specialized