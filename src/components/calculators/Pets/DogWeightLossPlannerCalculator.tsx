import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogWeightLossPlannerCalculator() {
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [dailyCalories, setDailyCalories] = useState("");
  const [weightLossRate, setWeightLossRate] = useState("1"); // percent per week
  const [results, setResults] = useState<{
    targetCalories: number;
    weeksToGoal: number;
  } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  function calculate() {
    const cw = parseFloat(currentWeight);
    const gw = parseFloat(goalWeight);
    const cal = parseFloat(dailyCalories);
    const rate = parseFloat(weightLossRate);

    if (
      isNaN(cw) ||
      isNaN(gw) ||
      isNaN(cal) ||
      isNaN(rate) ||
      cw <= gw ||
      cw <= 0 ||
      gw <= 0 ||
      cal <= 0 ||
      rate <= 0
    ) {
      setResults(null);
      return;
    }

    // Calculate target calories for weight loss:
    // A common approach is to reduce daily calories by 10-20% below maintenance.
    // Here, we calculate target calories as maintenance calories minus calories to lose weight safely.
    // Weight loss rate is % of body weight lost per week.
    // 1 pound of fat ~ 3500 calories deficit.
    // Convert weight loss rate % to pounds lost per week:
    // pounds lost per week = (rate / 100) * current weight in pounds
    // calories deficit per day = (pounds lost per week * 3500) / 7
    // target calories = maintenance calories - calories deficit per day

    // Since user inputs dailyCalories as maintenance calories, we use that.

    // Convert kg to pounds for calculation:
    const cwPounds = cw * 2.20462;

    const poundsLostPerWeek = (rate / 100) * cwPounds;
    const dailyCalorieDeficit = (poundsLostPerWeek * 3500) / 7;

    const targetCal = cal - dailyCalorieDeficit;

    // Calculate weeks to reach goal weight:
    // total pounds to lose = current - goal in pounds
    const totalPoundsToLose = (cw - gw) * 2.20462;
    const weeks = totalPoundsToLose / poundsLostPerWeek;

    setResults({
      targetCalories: Math.max(targetCal, 0),
      weeksToGoal: Math.max(Math.ceil(weeks), 0),
    });

    if (resultsRef.current) {
      window.scrollTo({
        top: resultsRef.current.offsetTop - 20,
        behavior: "smooth",
      });
    }
  }

  const onThisPage = [
    { id: "how-to-use", label: "How to Use This Calculator" },
    { id: "formulas-theory", label: "Formulas / Theory" },
    { id: "example", label: "Example" },
    { id: "faq", label: "FAQ" },
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
          This calculator helps you plan a safe and effective weight loss program for your dog by estimating the target daily calories and the timeline to reach your dog’s goal weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Maintaining a healthy weight is crucial for your dog’s overall well-being, mobility, and longevity. This tool assists in setting realistic goals and understanding the calorie adjustments needed to achieve them.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Use the results to guide feeding and exercise plans, but always consult your veterinarian before making significant changes to your dog’s diet or activity.
        </p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4">
          <li>
            <strong>Current Weight (kg):</strong> Your dog’s present weight in kilograms. Use a reliable scale or vet measurement.
          </li>
          <li>
            <strong>Goal Weight (kg):</strong> The target weight you want your dog to reach. Should be a healthy weight recommended by your vet.
          </li>
          <li>
            <strong>Maintenance Calories (kcal/day):</strong> The estimated daily calories your dog needs to maintain current weight. This can be calculated or obtained from previous feeding guidelines.
          </li>
          <li>
            <strong>Weight Loss Rate (% per week):</strong> The percentage of body weight your dog will lose weekly. Typically between 0.5% and 2% for safe weight loss.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is an educational tool and does not replace professional veterinary advice. Always consult your veterinarian before starting a weight loss program for your dog.
        </p>
      </section>

      <section id="formulas-theory" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Formulas / Theory
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          The calculator estimates the target daily calories by subtracting the calories needed to create a safe calorie deficit for weight loss from the maintenance calories.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Weight loss rate is expressed as a percentage of body weight lost per week. Since 1 pound of fat equals approximately 3500 calories, the daily calorie deficit is calculated accordingly.
        </p>
        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded mb-4 text-slate-900 dark:text-slate-100 font-mono">
          Target Calories = Maintenance Calories - (Weight Loss Rate % × Current Weight in lbs × 3500) / 7
        </pre>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          The time to reach the goal weight is calculated by dividing the total pounds to lose by the pounds lost per week.
        </p>
        <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-700 mb-4">
          <thead>
            <tr>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 bg-slate-200 dark:bg-slate-700">Weight Loss Rate (% per week)</th>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 bg-slate-200 dark:bg-slate-700">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">0.5%</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Very slow, safe for most dogs</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">1.0%</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Moderate, typical recommended rate</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">2.0%</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Aggressive, only under vet supervision</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="example" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Example
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          A 20 kg dog currently eating 900 kcal/day needs to lose weight safely to reach 16 kg. The owner chooses a weight loss rate of 1% per week.
        </p>
        <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-2">
          <li>
            Step 1: Calculate pounds lost per week: 1% of 20 kg = 0.2 kg = 0.44 lbs.
          </li>
          <li>
            Step 2: Calculate daily calorie deficit: (0.44 lbs × 3500) / 7 = 220 kcal/day.
          </li>
          <li>
            Step 3: Calculate target calories: 900 kcal - 220 kcal = 680 kcal/day.
          </li>
          <li>
            Step 4: Calculate weeks to goal: (20 kg - 16 kg) = 4 kg = 8.82 lbs; 8.82 lbs / 0.44 lbs per week = 20 weeks.
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300">
          The dog should be fed approximately 680 kcal per day and is expected to reach the goal weight in about 20 weeks with this plan.
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          FAQ
        </h2>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          What is a safe rate of weight loss for dogs?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          A safe weight loss rate for most dogs is between 0.5% and 2% of their body weight per week. Losing weight too quickly can cause health problems and muscle loss. Always consult your veterinarian to determine the best rate for your dog.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          How do I estimate my dog’s maintenance calories?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Maintenance calories can be estimated using formulas based on your dog’s weight, age, and activity level, or by consulting feeding guidelines on your dog’s food packaging. Your veterinarian can also help determine an accurate maintenance calorie level.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Can I feed less than the target calories suggested?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Feeding less than the recommended target calories can be harmful and may lead to nutrient deficiencies or other health issues. Always aim for a gradual weight loss and consult your veterinarian before making any drastic changes.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          How often should I monitor my dog’s weight during the program?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          It is best to monitor your dog’s weight every 1 to 2 weeks to track progress and adjust the plan if necessary. Regular check-ins with your veterinarian will help ensure the weight loss is safe and effective.
        </p>
      </section>

      <section id="disclaimer" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is intended for educational purposes only and does not replace professional veterinary advice. Always consult your veterinarian before starting or changing your dog’s diet or weight loss program.
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
                href="https://www.wsava.org/WSAVA/media/Documents/Guidelines/Nutrition-Guidelines-2019.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Nutritional Assessment Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Provides comprehensive guidelines on assessing and managing nutrition and weight in dogs, including safe weight loss recommendations.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/obesity"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Cornell University College of Veterinary Medicine - Obesity in Pets
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Explains the health risks of obesity in pets and strategies for safe weight loss and maintenance.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.aaha.org/globalassets/02-guidelines/weight-management/weight_management_guidelines_final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                American Animal Hospital Association Weight Management Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Offers detailed protocols for assessing and managing weight loss in dogs, including calorie calculations and monitoring.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.petmd.com/dog/nutrition/evr_dg_safe_weight_loss_for_dogs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                PetMD - Safe Weight Loss for Dogs
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Discusses practical advice on how to safely reduce your dog’s weight through diet and exercise.
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
      "Target Calories = Maintenance Calories - (Weight Loss Rate % × Current Weight in lbs × 3500) / 7",
    variables: [
      {
        symbol: "Target Calories",
        name: "Daily calories to feed for weight loss",
        description:
          "The adjusted daily calorie intake to achieve the desired weight loss rate safely.",
      },
      {
        symbol: "Maintenance Calories",
        name: "Daily calories to maintain current weight",
        description:
          "Estimated calories your dog needs daily to maintain its current weight.",
      },
      {
        symbol: "Weight Loss Rate %",
        name: "Percent of body weight lost per week",
        description:
          "The target percentage of body weight your dog will lose each week, typically between 0.5 and 2.",
      },
      {
        symbol: "Current Weight in lbs",
        name: "Current weight converted to pounds",
        description:
          "Your dog’s current weight converted from kilograms to pounds for calorie deficit calculation.",
      },
    ],
  };

  const example = {
    title: "Example: Planning Weight Loss for a 20 kg Dog",
    scenario: `A dog weighing 20 kg currently consumes 900 kcal/day. The owner wants the dog to reach 16 kg safely, choosing a weight loss rate of 1% per week.`,
    steps: [
      {
        step: 1,
        description: "Calculate pounds lost per week (1% of 20 kg).",
        calculation: "0.01 × 20 kg × 2.20462 = 0.44 lbs",
      },
      {
        step: 2,
        description: "Calculate daily calorie deficit needed.",
        calculation: "(0.44 lbs × 3500) / 7 = 220 kcal/day",
      },
      {
        step: 3,
        description: "Calculate target daily calories.",
        calculation: "900 kcal - 220 kcal = 680 kcal/day",
      },
      {
        step: 4,
        description: "Calculate weeks to reach goal weight.",
        calculation: "((20 kg - 16 kg) × 2.20462) / 0.44 lbs = 20 weeks",
      },
    ],
    result: `The dog should be fed approximately 680 kcal per day and is expected to reach the goal weight in about 20 weeks with this plan.`,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a safe rate of weight loss for dogs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `A safe weight loss rate for most dogs is between 0.5% and 2% of their body weight per week. Losing weight too quickly can cause health problems and muscle loss. Always consult your veterinarian to determine the best rate for your dog.`,
        },
      },
      {
        "@type": "Question",
        name: "How do I estimate my dog’s maintenance calories?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Maintenance calories can be estimated using formulas based on your dog’s weight, age, and activity level, or by consulting feeding guidelines on your dog’s food packaging. Your veterinarian can also help determine an accurate maintenance calorie level.`,
        },
      },
      {
        "@type": "Question",
        name: "Can I feed less than the target calories suggested?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Feeding less than the recommended target calories can be harmful and may lead to nutrient deficiencies or other health issues. Always aim for a gradual weight loss and consult your veterinarian before making any drastic changes.`,
        },
      },
      {
        "@type": "Question",
        name: "How often should I monitor my dog’s weight during the program?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `It is best to monitor your dog’s weight every 1 to 2 weeks to track progress and adjust the plan if necessary. Regular check-ins with your veterinarian will help ensure the weight loss is safe and effective.`,
        },
      },
    ],
  };

  const widget = (
    <Card>
      <CardHeader>
        <CardTitle>Dog Weight Loss Planner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="currentWeight">Current Weight (kg)</Label>
          <Input
            id="currentWeight"
            type="number"
            min="0"
            step="0.1"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder="e.g. 20"
          />
        </div>
        <div>
          <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
          <Input
            id="goalWeight"
            type="number"
            min="0"
            step="0.1"
            value={goalWeight}
            onChange={(e) => setGoalWeight(e.target.value)}
            placeholder="e.g. 16"
          />
        </div>
        <div>
          <Label htmlFor="dailyCalories">Maintenance Calories (kcal/day)</Label>
          <Input
            id="dailyCalories"
            type="number"
            min="0"
            step="10"
            value={dailyCalories}
            onChange={(e) => setDailyCalories(e.target.value)}
            placeholder="e.g. 900"
          />
        </div>
        <div>
          <Label htmlFor="weightLossRate">Weight Loss Rate (% per week)</Label>
          <Input
            id="weightLossRate"
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={weightLossRate}
            onChange={(e) => setWeightLossRate(e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
        <Button onClick={calculate} className="w-full mt-4">
          Calculate
        </Button>
        {results && (
          <div
            ref={resultsRef}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Target Daily Calories</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 dark:text-slate-300 text-lg font-semibold">
                {results.targetCalories.toFixed(0)} kcal/day
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Estimated Time to Goal</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-700 dark:text-slate-300 text-lg font-semibold">
                {results.weeksToGoal} weeks
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );

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