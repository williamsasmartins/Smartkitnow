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
  const [dailyCalorieIntake, setDailyCalorieIntake] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [result, setResult] = useState<{
    targetCalories: number;
    weightLossRateKgPerWeek: number;
    weeksToGoal: number;
  } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Activity level multipliers for MER (Maintenance Energy Requirement)
  const activityMultipliers: Record<string, number> = {
    low: 1.2,
    moderate: 1.4,
    high: 1.6,
  };

  // Constants
  const kcalPerKgFat = 7700; // kcal per kg of fat loss

  function scrollToResults() {
    if (resultsRef.current) {
      window.scrollTo({
        top: resultsRef.current.offsetTop - 20,
        behavior: "smooth",
      });
    }
  }

  function calculate() {
    const currentKg = parseFloat(currentWeightKg);
    const goalKg = parseFloat(goalWeightKg);
    const dailyCalories = parseFloat(dailyCalorieIntake);
    if (
      isNaN(currentKg) ||
      isNaN(goalKg) ||
      isNaN(dailyCalories) ||
      currentKg <= goalKg ||
      currentKg <= 0 ||
      goalKg <= 0 ||
      dailyCalories <= 0
    ) {
      setResult(null);
      scrollToResults();
      return;
    }

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * (weight in kg)^0.75
    const rer = 70 * Math.pow(currentKg, 0.75);

    // Calculate Maintenance Energy Requirement (MER)
    // MER = RER * activity multiplier
    const mer = rer * activityMultipliers[activityLevel];

    // Calculate target calories for weight loss (usually 80% of MER)
    // But user input dailyCalorieIntake overrides this
    const targetCalories = dailyCalories;

    // Calculate calorie deficit per day
    const calorieDeficit = mer - targetCalories;

    // Calculate weekly weight loss in kg
    // weight loss (kg) = (calorie deficit * 7) / 7700
    const weightLossRateKgPerWeek = (calorieDeficit * 7) / kcalPerKgFat;

    // Calculate weeks to reach goal weight
    const totalWeightToLose = currentKg - goalKg;
    const weeksToGoal = weightLossRateKgPerWeek > 0 ? totalWeightToLose / weightLossRateKgPerWeek : 0;

    setResult({
      targetCalories,
      weightLossRateKgPerWeek,
      weeksToGoal,
    });
    scrollToResults();
  }

  const widget = (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Dog Weight Loss Planner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="currentWeight" className="mb-1 block text-slate-700 dark:text-slate-300">
            Current Weight (kg)
          </Label>
          <Input
            id="currentWeight"
            type="number"
            min={0}
            step={0.1}
            value={currentWeightKg}
            onChange={(e) => setCurrentWeightKg(e.target.value)}
            placeholder="e.g. 25.0"
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
            step={0.1}
            value={goalWeightKg}
            onChange={(e) => setGoalWeightKg(e.target.value)}
            placeholder="e.g. 20.0"
          />
        </div>
        <div>
          <Label htmlFor="activityLevel" className="mb-1 block text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <select
            id="activityLevel"
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
          >
            <option value="low">Low (sedentary)</option>
            <option value="moderate">Moderate (average activity)</option>
            <option value="high">High (very active)</option>
          </select>
        </div>
        <div>
          <Label htmlFor="dailyCalories" className="mb-1 block text-slate-700 dark:text-slate-300">
            Planned Daily Calorie Intake (kcal)
          </Label>
          <Input
            id="dailyCalories"
            type="number"
            min={0}
            step={1}
            value={dailyCalorieIntake}
            onChange={(e) => setDailyCalorieIntake(e.target.value)}
            placeholder="e.g. 800"
          />
        </div>
        <Button onClick={calculate} className="w-full mt-2">
          Calculate
        </Button>
      </CardContent>
      {result && (
        <CardContent ref={resultsRef} className="mt-4 space-y-4">
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Target Daily Calories
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {result.targetCalories.toFixed(0)} kcal per day
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Estimated Weekly Weight Loss
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {result.weightLossRateKgPerWeek > 0
                  ? result.weightLossRateKgPerWeek.toFixed(3)
                  : "0"}{" "}
                kg per week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Estimated Time to Reach Goal Weight
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {result.weeksToGoal > 0
                  ? result.weeksToGoal.toFixed(1)
                  : "N/A"}{" "}
                weeks
              </p>
            </CardContent>
          </Card>
        </CardContent>
      )}
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
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          This calculator helps you plan a safe and effective weight loss program for your dog by estimating the target daily calories and the expected timeline to reach your dog's goal weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Maintaining a healthy weight is crucial for your dog's overall well-being, mobility, and longevity. This tool provides an evidence-based estimate to guide your feeding and exercise plans.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Use the results to adjust your dog's diet and activity gradually, and always consult your veterinarian before starting any weight loss program.
        </p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4">
          <li>
            <strong>Current Weight (kg):</strong> Your dog's present weight in kilograms. Use a reliable scale or vet measurement.
          </li>
          <li>
            <strong>Goal Weight (kg):</strong> The healthy target weight you want your dog to achieve.
          </li>
          <li>
            <strong>Activity Level:</strong> Choose the level that best matches your dog's daily activity: low, moderate, or high.
          </li>
          <li>
            <strong>Planned Daily Calorie Intake (kcal):</strong> The amount of calories you plan to feed your dog daily during the weight loss program.
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
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          The calculator uses your dog's current weight to estimate the Resting Energy Requirement (RER), which is the energy needed for basic bodily functions at rest.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          The Maintenance Energy Requirement (MER) adjusts RER based on your dog's activity level to estimate daily calories needed to maintain current weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Weight loss is achieved by feeding fewer calories than MER, creating a calorie deficit. The calculator estimates weekly weight loss based on this deficit and the energy content of fat.
        </p>
        <code className="block whitespace-pre-wrap break-words bg-slate-100 dark:bg-slate-800 p-3 rounded mb-4">
          {`RER = 70 × (Current Weight in kg)^0.75

MER = RER × Activity Multiplier

Weight Loss Rate (kg/week) = (MER - Daily Calories) × 7 / 7700`}
        </code>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          <strong>Activity Multipliers:</strong>
        </p>
        <table className="w-full border border-slate-300 dark:border-slate-700 mb-4 text-slate-700 dark:text-slate-300">
          <thead>
            <tr className="bg-slate-200 dark:bg-slate-700">
              <th className="border border-slate-300 dark:border-slate-600 px-3 py-1 text-left">Activity Level</th>
              <th className="border border-slate-300 dark:border-slate-600 px-3 py-1 text-left">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 dark:border-slate-600 px-3 py-1">Low (sedentary)</td>
              <td className="border border-slate-300 dark:border-slate-600 px-3 py-1">1.2</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-600 px-3 py-1">Moderate (average activity)</td>
              <td className="border border-slate-300 dark:border-slate-600 px-3 py-1">1.4</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-600 px-3 py-1">High (very active)</td>
              <td className="border border-slate-300 dark:border-slate-600 px-3 py-1">1.6</td>
            </tr>
          </tbody>
        </table>
        <p className="text-slate-700 dark:text-slate-300">
          The constant 7700 kcal per kg represents the approximate energy stored in one kilogram of body fat.
        </p>
      </section>

      <section id="example" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Example Calculation
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          A dog currently weighs 30 kg and the owner wants to reduce the weight to 25 kg. The dog has a moderate activity level and the planned daily calorie intake is 900 kcal.
        </p>
        <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-2">
          <li>
            <strong>Calculate RER:</strong> 70 × 30^0.75 = 70 × 12.75 = 892.5 kcal/day
          </li>
          <li>
            <strong>Calculate MER:</strong> 892.5 × 1.4 (moderate activity) = 1249.5 kcal/day
          </li>
          <li>
            <strong>Calculate daily calorie deficit:</strong> 1249.5 - 900 = 349.5 kcal/day
          </li>
          <li>
            <strong>Calculate weekly weight loss:</strong> (349.5 × 7) / 7700 = 2.52 kg/week
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300">
          At this rate, the dog will reach the goal weight of 25 kg in approximately 2 weeks (5 kg ÷ 2.52 kg/week).
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Frequently Asked Questions
        </h2>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Why is it important to calculate my dog's calorie needs for weight loss?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Calculating calorie needs ensures your dog loses weight safely without risking malnutrition or muscle loss. It helps you feed the right amount to promote fat loss while maintaining health.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Can I use this calculator for puppies or pregnant dogs?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          No, this calculator is designed for adult dogs aiming to lose weight. Puppies and pregnant dogs have different nutritional needs and require specialized care.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          What if my dog’s activity level changes during the weight loss program?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Changes in activity level affect your dog's calorie needs. If activity increases or decreases, recalculate to adjust calorie intake accordingly for continued safe weight loss.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          How often should I monitor my dog’s weight during the program?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Regular monitoring every 2 to 4 weeks is recommended to track progress and adjust feeding plans. Consult your veterinarian for personalized guidance.
        </p>
      </section>

      <section id="disclaimer" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is intended for educational purposes only and does not replace professional veterinary advice. Always consult your veterinarian before starting or changing your dog’s diet or exercise program.
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
                href="https://www.aaha.org/aaha-guidelines/weight-management/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                American Animal Hospital Association (AAHA) Weight Management Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Comprehensive guidelines on canine weight management including calorie calculation and safe weight loss strategies.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.merckvetmanual.com/nutrition/obesity-in-dogs-and-cats/overview-of-obesity-in-dogs-and-cats"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Merck Veterinary Manual: Obesity in Dogs and Cats
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Detailed overview of obesity causes, risks, and management in dogs, including energy requirements.
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
                National Center for Biotechnology Information: Canine Obesity and Weight Loss
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Scientific article discussing energy requirements and weight loss protocols in dogs.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.petmd.com/dog/nutrition/evr_dg_how_to_help_your_dog_lose_weight"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                PetMD: How to Help Your Dog Lose Weight
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Practical advice on managing canine weight loss including calorie control and exercise.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );

  const formula = {
    title: "Key formulas used in this calculator",
    formula: `RER = 70 × (Current Weight in kg)^0.75

MER = RER × Activity Multiplier

Weight Loss Rate (kg/week) = (MER - Daily Calories) × 7 / 7700`,
    variables: [
      {
        symbol: "RER",
        name: "Resting Energy Requirement",
        description:
          "The energy required for basic physiological functions at rest, calculated from current weight in kilograms.",
      },
      {
        symbol: "MER",
        name: "Maintenance Energy Requirement",
        description:
          "The total daily energy requirement adjusted for activity level using a multiplier.",
      },
      {
        symbol: "Daily Calories",
        name: "Planned Daily Calorie Intake",
        description: "The number of calories fed to the dog daily during weight loss.",
      },
      {
        symbol: "Weight Loss Rate",
        name: "Estimated Weekly Weight Loss",
        description:
          "The expected weight loss in kilograms per week based on calorie deficit and energy content of fat.",
      },
    ],
  };

  const example = {
    title: "Example: Planning Weight Loss for a 30 kg Dog",
    scenario: `A dog currently weighs 30 kg and the owner wants to reduce the weight to 25 kg. The dog has a moderate activity level and the planned daily calorie intake is 900 kcal.`,
    steps: [
      {
        step: 1,
        description: "Calculate Resting Energy Requirement (RER)",
        calculation: "70 × 30^0.75 = 892.5 kcal/day",
      },
      {
        step: 2,
        description: "Calculate Maintenance Energy Requirement (MER)",
        calculation: "892.5 × 1.4 (moderate activity) = 1249.5 kcal/day",
      },
      {
        step: 3,
        description: "Calculate daily calorie deficit",
        calculation: "1249.5 - 900 = 349.5 kcal/day",
      },
      {
        step: 4,
        description: "Calculate weekly weight loss",
        calculation: "(349.5 × 7) / 7700 = 2.52 kg/week",
      },
    ],
    result: `At this rate, the dog will reach the goal weight of 25 kg in approximately 2 weeks, supporting a safe and effective weight loss plan.`,
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
      title: "Pet Food Portion Calculator",
      url: "/pets/dogs-nutrition/pet-food-portion-calculator",
      icon: "🍖",
    },
  ];

  const faqItems = [
    {
      question: "Why is it important to calculate my dog's calorie needs for weight loss?",
      answer: `Calculating calorie needs ensures your dog loses weight safely without risking malnutrition or muscle loss. It helps you feed the right amount to promote fat loss while maintaining health.`,
    },
    {
      question: "Can I use this calculator for puppies or pregnant dogs?",
      answer: `No, this calculator is designed for adult dogs aiming to lose weight. Puppies and pregnant dogs have different nutritional needs and require specialized care.`,
    },
    {
      question: "What if my dog’s activity level changes during the weight loss program?",
      answer: `Changes in activity level affect your dog's calorie needs. If activity increases or decreases, recalculate to adjust calorie intake accordingly for continued safe weight loss.`,
    },
    {
      question: "How often should I monitor my dog’s weight during the program?",
      answer: `Regular monitoring every 2 to 4 weeks is recommended to track progress and adjust feeding plans. Consult your veterinarian for personalized guidance.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Weight Loss Planner"
      description="Plan a safe and effective weight loss program for your dog. Calculates target calories and timeline for goal weight achievement."
      widget={widget}
      editorial={editorial}
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
      jsonLd={jsonLd}
      icon={<Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default DogWeightLossPlannerCalculator;