import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogIdealWeightTargetCaloriesCalculator() {
  const [currentWeightKg, setCurrentWeightKg] = useState("");
  const [breedSize, setBreedSize] = useState("medium");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [idealWeightKg, setIdealWeightKg] = useState<number | null>(null);
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Ideal weight multipliers by breed size (typical healthy weight % of current weight)
  // These are rough estimates based on breed size categories.
  const idealWeightMultipliers: Record<string, number> = {
    small: 0.9,
    medium: 0.85,
    large: 0.8,
    giant: 0.75,
  };

  // Activity level multipliers for Maintenance Energy Requirement (MER)
  // Source: typical MER factors for dogs based on activity level
  const activityMultipliers: Record<string, number> = {
    low: 1.2,
    moderate: 1.6,
    high: 2.0,
  };

  function handleCalculate() {
    const weight = parseFloat(currentWeightKg);
    if (isNaN(weight) || weight <= 0) {
      setIdealWeightKg(null);
      setTargetCalories(null);
      return;
    }
    const idealMultiplier = idealWeightMultipliers[breedSize] ?? 0.85;
    const activityMultiplier = activityMultipliers[activityLevel] ?? 1.6;

    // Calculate ideal weight
    const idealWeight = weight * idealMultiplier;

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * (idealWeightKg ^ 0.75)
    const rer = 70 * Math.pow(idealWeight, 0.75);

    // Calculate Target Calories = RER * MER factor (activity multiplier)
    const calories = rer * activityMultiplier;

    setIdealWeightKg(Number(idealWeight.toFixed(2)));
    setTargetCalories(Number(calories.toFixed(0)));

    if (resultsRef.current) {
      window.scrollTo({
        top: resultsRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }

  const widget = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCalculate();
      }}
      className="space-y-6"
      aria-label="Dog Ideal Weight and Target Calories Calculator Form"
    >
      <div>
        <Label htmlFor="currentWeight" className="block mb-1 font-semibold text-slate-900 dark:text-slate-100">
          Current Weight (kg)
        </Label>
        <Input
          id="currentWeight"
          type="number"
          min={0.1}
          step={0.1}
          value={currentWeightKg}
          onChange={(e) => setCurrentWeightKg(e.target.value)}
          placeholder="e.g. 20.5"
          required
          aria-describedby="currentWeightHelp"
        />
        <p id="currentWeightHelp" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your dog’s current weight in kilograms.
        </p>
      </div>

      <div>
        <Label htmlFor="breedSize" className="block mb-1 font-semibold text-slate-900 dark:text-slate-100">
          Breed Size
        </Label>
        <select
          id="breedSize"
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          value={breedSize}
          onChange={(e) => setBreedSize(e.target.value)}
          required
        >
          <option value="small">Small (e.g. Chihuahua, Dachshund)</option>
          <option value="medium">Medium (e.g. Beagle, Cocker Spaniel)</option>
          <option value="large">Large (e.g. Labrador, Golden Retriever)</option>
          <option value="giant">Giant (e.g. Great Dane, Mastiff)</option>
        </select>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Select your dog’s breed size category.
        </p>
      </div>

      <div>
        <Label htmlFor="activityLevel" className="block mb-1 font-semibold text-slate-900 dark:text-slate-100">
          Activity Level
        </Label>
        <select
          id="activityLevel"
          className="w-full rounded border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
          required
        >
          <option value="low">Low (mostly resting, older dogs)</option>
          <option value="moderate">Moderate (typical daily activity)</option>
          <option value="high">High (working or highly active dogs)</option>
        </select>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choose your dog’s typical daily activity level.
        </p>
      </div>

      <Button type="submit" className="w-full">
        Calculate Ideal Weight & Target Calories
      </Button>
    </form>
  );

  const editorial = (
    <>
      <section id="how-to-use" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This calculator helps you determine your dog’s ideal healthy weight based on their current weight and breed size. It also estimates the daily calorie intake needed to maintain that ideal weight considering your dog’s activity level.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Maintaining an ideal weight is crucial for your dog’s overall health, longevity, and quality of life. Overweight or underweight dogs can face various health challenges, so understanding these targets helps you manage their nutrition effectively.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          After entering your dog’s current weight, breed size, and activity level, the calculator will provide an ideal weight estimate and the recommended daily calories to maintain that weight. Use these results to guide feeding amounts and consult your veterinarian for personalized advice.
        </p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-3">
          <li>
            <strong>Current Weight (kg):</strong> Your dog’s present weight in kilograms. Use a reliable scale for accuracy.
          </li>
          <li>
            <strong>Breed Size:</strong> Select the category that best fits your dog’s breed size to adjust ideal weight estimates.
          </li>
          <li>
            <strong>Activity Level:</strong> Choose the level that matches your dog’s typical daily activity to calculate calorie needs.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is an educational tool and does not replace professional veterinary advice. Always consult your veterinarian for health or diet concerns.
        </p>
      </section>

      <section id="formulas-theory" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Formulas / Theory
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          The calculator uses your dog’s current weight and breed size to estimate an ideal healthy weight by applying a breed size multiplier. This multiplier reflects typical healthy weight percentages for different breed sizes.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          To estimate daily calorie needs, the calculator uses the Resting Energy Requirement (RER) formula, which estimates the energy required for basic bodily functions at rest. This is then multiplied by a Maintenance Energy Requirement (MER) factor based on your dog’s activity level.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          The key formulas are:
        </p>
        <code className="block whitespace-pre-wrap break-words rounded bg-slate-100 p-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100 mb-3">
          {`Ideal Weight (kg) = Current Weight (kg) × Breed Size Multiplier

RER (kcal/day) = 70 × (Ideal Weight in kg)^0.75

Target Calories (kcal/day) = RER × Activity Level Multiplier`}
        </code>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          The breed size multipliers and activity multipliers used are typical values based on veterinary nutrition guidelines:
        </p>
        <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-700 mb-3">
          <thead>
            <tr>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 bg-slate-200 dark:bg-slate-700">Breed Size</th>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 bg-slate-200 dark:bg-slate-700">Multiplier</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Small</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">0.9</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Medium</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">0.85</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Large</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">0.8</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Giant</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">0.75</td>
            </tr>
          </tbody>
        </table>
        <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-700">
          <thead>
            <tr>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 bg-slate-200 dark:bg-slate-700">Activity Level</th>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 bg-slate-200 dark:bg-slate-700">MER Multiplier</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Low</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">1.2</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Moderate</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">1.6</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">High</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">2.0</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="example" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Example: Calculating Ideal Weight and Calories for a Medium Breed Dog
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Imagine you have a medium breed dog that currently weighs 25 kg and has a moderate activity level. You want to find out the ideal weight and daily calories needed to maintain that weight.
        </p>
        <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 space-y-3 mb-4">
          <li>
            <strong>Calculate Ideal Weight:</strong> 25 kg × 0.85 (medium breed multiplier) = 21.25 kg
          </li>
          <li>
            <strong>Calculate RER:</strong> 70 × (21.25)^0.75 ≈ 70 × 9.17 = 641.9 kcal/day
          </li>
          <li>
            <strong>Apply Activity Multiplier:</strong> 641.9 kcal × 1.6 (moderate activity) = 1027 kcal/day
          </li>
          <li>
            <strong>Result:</strong> Your dog’s ideal weight is approximately 21.25 kg, and they need about 1027 kcal daily to maintain this weight.
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300">
          Use this calorie target to guide feeding amounts and monitor your dog’s weight regularly to ensure they stay healthy.
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Frequently Asked Questions
        </h2>

        <article className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Why is it important to know my dog’s ideal weight?
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            Knowing your dog’s ideal weight helps you manage their health and nutrition effectively. Dogs that are overweight or underweight are at higher risk for health problems such as joint issues, diabetes, and heart disease.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            Maintaining an ideal weight supports longevity and quality of life by reducing strain on organs and joints.
          </p>
        </article>

        <article className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            How accurate are the breed size multipliers?
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            Breed size multipliers are general guidelines based on typical healthy weight ranges for different breed categories. Individual dogs may vary due to genetics, body composition, and health status.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            Always consult your veterinarian for a personalized assessment of your dog’s ideal weight.
          </p>
        </article>

        <article className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Can I use this calculator for puppies or senior dogs?
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            This calculator is designed for adult dogs with stable weights. Puppies and senior dogs have different nutritional needs and growth patterns.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            For puppies or seniors, consult your veterinarian or use specialized calculators tailored for those life stages.
          </p>
        </article>

        <article className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            How often should I check my dog’s weight and calorie needs?
          </h3>
          <p className="text-slate-700 dark:text-slate-300">
            Regular weight monitoring is recommended at least monthly to detect changes early. Calorie needs may change with age, activity, or health conditions.
          </p>
          <p className="text-slate-700 dark:text-slate-300">
            Adjust feeding amounts accordingly and consult your veterinarian for guidance.
          </p>
        </article>
      </section>

      <section id="disclaimer" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is intended for educational purposes only and does not replace professional veterinary advice. Individual dogs may have unique health needs that require personalized assessment.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Always consult your veterinarian before making significant changes to your dog’s diet or health regimen.
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
                href="https://www.aaha.org/aaha-guidelines/nutrition/nutrition-calculations/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                American Animal Hospital Association (AAHA) Nutrition Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Provides detailed guidelines on calculating energy requirements and nutritional needs for dogs.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.merckvetmanual.com/nutrition/nutrition-in-dogs-and-cats/energy-requirements"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Merck Veterinary Manual: Energy Requirements in Dogs
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Explains resting energy requirements and maintenance energy requirements for dogs of various sizes and activity levels.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.wsava.org/global-guidelines/nutrition-guidelines"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Global Nutrition Guidelines for Dogs and Cats
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                International guidelines on canine nutrition, including energy needs and weight management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/ideal-body-weight"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Cornell University College of Veterinary Medicine: Ideal Body Weight
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Discusses the importance of ideal body weight and methods to estimate it for pets.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );

  const onThisPage = [
    { id: "how-to-use", label: "How to Use This Calculator" },
    { id: "formulas-theory", label: "Formulas / Theory" },
    { id: "example", label: "Example Calculation" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "disclaimer", label: "Disclaimer" },
    { id: "references", label: "References" },
  ];

  const formula = {
    title: "Key formulas used in this calculator",
    formula: `Ideal Weight (kg) = Current Weight (kg) × Breed Size Multiplier

RER (kcal/day) = 70 × (Ideal Weight in kg)^0.75

Target Calories (kcal/day) = RER × Activity Level Multiplier`,
    variables: [
      {
        symbol: "Ideal Weight (kg)",
        name: "Ideal Weight in kilograms",
        description:
          "Estimated healthy weight based on current weight and breed size multiplier",
      },
      {
        symbol: "RER",
        name: "Resting Energy Requirement",
        description:
          "Energy required for basic bodily functions at rest, calculated from ideal weight",
      },
      {
        symbol: "MER",
        name: "Maintenance Energy Requirement multiplier",
        description:
          "Factor based on activity level to estimate total daily calorie needs",
      },
    ],
  };

  const example = {
    title: "Example: Calculating Ideal Weight and Calories for a Medium Breed Dog",
    scenario:
      `Imagine you have a medium breed dog that currently weighs 25 kg and has a moderate activity level. You want to find out the ideal weight and daily calories needed to maintain that weight.`,
    steps: [
      {
        step: 1,
        description: "Calculate Ideal Weight using breed size multiplier",
        calculation: "25 kg × 0.85 = 21.25 kg",
      },
      {
        step: 2,
        description: "Calculate Resting Energy Requirement (RER)",
        calculation: "70 × (21.25)^0.75 ≈ 641.9 kcal/day",
      },
      {
        step: 3,
        description: "Apply Activity Level multiplier (MER)",
        calculation: "641.9 kcal × 1.6 = 1027 kcal/day",
      },
      {
        step: 4,
        description: "Resulting ideal weight and daily calorie needs",
        calculation: "Ideal Weight = 21.25 kg, Target Calories = 1027 kcal/day",
      },
    ],
    result:
      "The dog’s ideal weight is approximately 21.25 kg, and they require about 1027 kcal daily to maintain this weight under moderate activity.",
  };

  const relatedCalculators = [
    {
      title: "Dog Calorie Needs RER & MER Calculator",
      url: "/pets/dogs-nutrition/dog-calorie-needs-rer-mer",
      icon: "🐕",
    },
    {
      title: "Dog Treat Calories Daily Allowance Calculator",
      url: "/pets/dogs-nutrition/dog-treat-calories-daily-allowance",
      icon: "🍖",
    },
    {
      title: "Puppy Calorie Needs by Age, Breed & Size",
      url: "/pets/dogs-nutrition/puppy-calorie-needs-age-breed-size",
      icon: "🐶",
    },
    {
      title: "Pet Weight Loss Target Calories Calculator",
      url: "/pets/dogs-nutrition/pet-weight-loss-target-calories",
      icon: "⚖️",
    },
  ];

  const faqItems = [
    {
      question: "Why is it important to know my dog’s ideal weight?",
      answer: `Knowing your dog’s ideal weight helps you manage their health and nutrition effectively. Dogs that are overweight or underweight are at higher risk for health problems such as joint issues, diabetes, and heart disease.

Maintaining an ideal weight supports longevity and quality of life by reducing strain on organs and joints.`,
    },
    {
      question: "How accurate are the breed size multipliers?",
      answer: `Breed size multipliers are general guidelines based on typical healthy weight ranges for different breed categories. Individual dogs may vary due to genetics, body composition, and health status.

Always consult your veterinarian for a personalized assessment of your dog’s ideal weight.`,
    },
    {
      question: "Can I use this calculator for puppies or senior dogs?",
      answer: `This calculator is designed for adult dogs with stable weights. Puppies and senior dogs have different nutritional needs and growth patterns.

For puppies or seniors, consult your veterinarian or use specialized calculators tailored for those life stages.`,
    },
    {
      question: "How often should I check my dog’s weight and calorie needs?",
      answer: `Regular weight monitoring is recommended at least monthly to detect changes early. Calorie needs may change with age, activity, or health conditions.

Adjust feeding amounts accordingly and consult your veterinarian for guidance.`,
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
    <