import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

// Se quiser usar ícones no futuro, importa de lucide-react
// import { Calculator, Dog, Activity, HeartPulse } from "lucide-react";

function DogIdealWeightTargetCaloriesCalculator() {
  // =========================
  // STATE
  // =========================
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [breedSize, setBreedSize] = useState<"small" | "medium" | "large" | "giant">("medium");
  const [activityLevel, setActivityLevel] = useState<"low" | "moderate" | "high">("moderate");

  const weightNum = parseFloat(currentWeight);
  const isWeightValid = !isNaN(weightNum) && weightNum > 0;

  // =========================
  // IDEAL WEIGHT RANGE
  // =========================
  const idealWeightRange = useMemo(() => {
    switch (breedSize) {
      case "small":
        return { min: 2, max: 10 };
      case "medium":
        return { min: 10, max: 25 };
      case "large":
        return { min: 25, max: 45 };
      case "giant":
        return { min: 45, max: 90 };
      default:
        return { min: 10, max: 25 };
    }
  }, [breedSize]);

  const idealWeight = useMemo(
    () => (idealWeightRange.min + idealWeightRange.max) / 2,
    [idealWeightRange]
  );

  // =========================
  // RER & MER
  // =========================
  const rer = useMemo(() => {
    return 70 * Math.pow(idealWeight, 0.75);
  }, [idealWeight]);

  const activityMultiplier = useMemo(() => {
    switch (activityLevel) {
      case "low":
        return 1.2;
      case "moderate":
        return 1.6;
      case "high":
        return 2.0;
      default:
        return 1.6;
    }
  }, [activityLevel]);

  const mer = useMemo(() => {
    return rer * activityMultiplier;
  }, [rer, activityMultiplier]);

  const formatCalories = (cal: number) => Math.round(cal);

  const handleReset = () => {
    setCurrentWeight("");
    setBreedSize("medium");
    setActivityLevel("moderate");
  };

  // =========================
  // FAQ / JSON-LD
  // =========================
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I know my dog's ideal weight?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your dog's ideal weight depends on its breed size and body condition. This calculator uses typical weight ranges for breed sizes to estimate a healthy target weight.",
        },
      },
      {
        "@type": "Question",
        name: "What is Resting Energy Requirement (RER)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "RER is the amount of energy a dog needs at rest to maintain basic bodily functions. It is calculated based on the dog's weight.",
        },
      },
      {
        "@type": "Question",
        name: "How does activity level affect calorie needs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "More active dogs require more calories to maintain their weight. This calculator adjusts calorie needs based on low, moderate, or high activity levels.",
        },
      },
      {
        "@type": "Question",
        name: "Can this calculator replace veterinary advice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This tool provides general estimates. Always consult your veterinarian for personalized nutrition and weight management advice.",
        },
      },
    ],
  };

  // =========================
  // WIDGET (FORM + RESULT)
  // =========================
  const widget = (
    <Card>
      <CardHeader>
        <CardTitle>Enter your dog's details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="currentWeight">Current Weight (kg)</Label>
          <Input
            id="currentWeight"
            type="number"
            min={0.1}
            step={0.1}
            placeholder="e.g. 15.5"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            aria-describedby="weight-helper"
          />
          {!isWeightValid && currentWeight !== "" && (
            <p
              id="weight-helper"
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              Please enter a valid positive weight.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="breedSize">Breed Size</Label>
          <select
            id="breedSize"
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            value={breedSize}
            onChange={(e) => setBreedSize(e.target.value as typeof breedSize)}
          >
            <option value="small">Small (2–10 kg)</option>
            <option value="medium">Medium (10–25 kg)</option>
            <option value="large">Large (25–45 kg)</option>
            <option value="giant">Giant (45–90 kg)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="activityLevel">Activity Level</Label>
          <select
            id="activityLevel"
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as typeof activityLevel)}
          >
            <option value="low">Low (less active or older dogs)</option>
            <option value="moderate">Moderate (average adult dogs)</option>
            <option value="high">High (very active or working dogs)</option>
          </select>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>

        {isWeightValid && (
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Results
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Ideal Weight:</strong> {idealWeight.toFixed(1)} kg (typical
              for a {breedSize} breed)
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Resting Energy Requirement (RER):</strong>{" "}
              {formatCalories(rer)} kcal/day
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Maintenance Energy Requirement (MER):</strong>{" "}
              {formatCalories(mer)} kcal/day based on {activityLevel} activity
            </p>
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              These calorie needs are estimates to maintain your dog's ideal
              weight. Always confirm feeding plans with your veterinarian.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // =========================
  // FORMULA (FORMATO NOVO DO LAYOUT)
  // =========================
  const formula = {
    title: "Key formulas for ideal weight calories",
    formula: "MER = 70 × (Ideal Weight in kg)^0.75 × Activity Multiplier",
    variables: [
      {
        symbol: "Ideal Weight",
        description: "Estimated healthy target weight for your dog (kg).",
      },
      {
        symbol: "RER",
        description:
          "Resting Energy Requirement – base calories needed at rest.",
      },
      {
        symbol: "Activity Multiplier",
        description:
          "Factor based on how active your dog is (1.2 low, 1.6 moderate, 2.0 high).",
      },
      {
        symbol: "MER",
        description:
          "Maintenance Energy Requirement – total daily calories to maintain ideal weight.",
      },
    ],
  };

  // =========================
  // EXAMPLE (FORMATO NOVO DO LAYOUT)
  // =========================
  const example = {
    title: "Example: Medium breed dog with moderate activity",
    scenario:
      "You have a 15 kg medium breed adult dog that is moderately active. You want to estimate a healthy target weight and daily calories.",
    steps: [
      {
        step: 1,
        description: "Estimate ideal weight from the medium breed range (10–25 kg).",
        calculation: "Ideal weight = (10 + 25) / 2 = 17.5 kg",
      },
      {
        step: 2,
        description: "Calculate Resting Energy Requirement (RER).",
        calculation: "RER = 70 × 17.5^0.75 ≈ 70 × 8.36 ≈ 585 kcal/day",
      },
      {
        step: 3,
        description: "Apply the activity multiplier for moderate activity.",
        calculation: "MER = 585 × 1.6 ≈ 936 kcal/day",
      },
      {
        step: 4,
        description: "Interpret the result.",
        calculation:
          "Your dog needs about 930–950 kcal/day to maintain its ideal weight.",
      },
    ],
    result:
      "A medium breed adult dog with moderate activity should receive roughly 940 kcal/day to maintain a healthy ideal weight.",
  };

  // =========================
  // RELATED CALCULATORS (FORMATO NOVO)
  // =========================
  const relatedCalculators = [
    {
      title: "Dog Calorie Needs (RER/MER) Calculator",
      url: "/pets/dog-calorie-needs-rer-mer",
      icon: "🔥",
    },
    {
      title: "Dog Weight Loss Planner",
      url: "/pets/dog-weight-loss-planner",
      icon: "❤️",
    },
    {
      title: "Dog Food Portion Calculator",
      url: "/pets/dog-food-portion-calculator",
      icon: "🍖",
    },
  ];

  // =========================
  // EDITORIAL (TEXTO)
  // =========================
  const editorial = (
    <>
      <section id="how-it-works">
        <h2>How this dog ideal weight & target calories calculator works</h2>
        <p>
          This tool estimates a healthy target weight range for your dog based
          on general size categories (small, medium, large, giant) and then
          calculates how many calories are needed per day to maintain that ideal
          weight.
        </p>
        <p>
          It uses standard veterinary formulas for Resting Energy Requirement
          (RER) and Maintenance Energy Requirement (MER), combined with an
          activity multiplier that reflects how active your dog is.
        </p>
      </section>

      <section id="tips">
        <h2>Important tips before changing your dog's diet</h2>
        <ul>
          <li>
            Always confirm any weight-loss or weight-gain plan with your
            veterinarian.
          </li>
          <li>
            Make changes gradually so your dog's digestive system can adapt.
          </li>
          <li>
            Monitor body condition score (BCS), not just the number on the
            scale.
          </li>
          <li>
            Keep fresh water available at all times and avoid drastic calorie
            restrictions.
          </li>
        </ul>
      </section>

      <section id="disclaimer">
        <h2>Disclaimer</h2>
        <p>
          This calculator is for educational purposes only and does not replace
          professional veterinary advice. Always consult a licensed
          veterinarian before making major changes to your dog's nutrition or
          weight-management plan.
        </p>
      </section>
    </>
  );

  // =========================
  // RENDER
  // =========================
  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Estimate your dog's ideal weight and the daily calories needed to maintain it, based on breed size and activity level."
      widget={widget}
      editorial={editorial}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
      jsonLd={faqStructuredData}
      showTopBanner={true}
      showBottomBanner={true}
      showSidebar={true}
      onThisPage={[
        { id: "how-it-works", label: "How this calculator works" },
        { id: "tips", label: "Tips for safe weight management" },
        { id: "disclaimer", label: "Important disclaimer" },
      ]}
    />
  );
}

export default DogIdealWeightTargetCaloriesCalculator;
