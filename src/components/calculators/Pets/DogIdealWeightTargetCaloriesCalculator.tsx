import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Dog, Activity, HeartPulse, BookOpen, Info } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogIdealWeightTargetCaloriesCalculator() {
  // State for user inputs
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [breedSize, setBreedSize] = useState<"small" | "medium" | "large" | "giant">("medium");
  const [activityLevel, setActivityLevel] = useState<"low" | "moderate" | "high">("moderate");

  // Validate weight input as positive number
  const weightNum = parseFloat(currentWeight);
  const weightValid = !isNaN(weightNum) && weightNum > 0;

  // Ideal weight ranges by breed size (kg)
  // Source: general veterinary guidelines for breed size ideal weights
  // Small: 5-10 kg, Medium: 10-25 kg, Large: 25-45 kg, Giant: 45-70 kg
  const idealWeightRange = useMemo(() => {
    switch (breedSize) {
      case "small":
        return { min: 5, max: 10 };
      case "medium":
        return { min: 10, max: 25 };
      case "large":
        return { min: 25, max: 45 };
      case "giant":
        return { min: 45, max: 70 };
      default:
        return { min: 10, max: 25 };
    }
  }, [breedSize]);

  // Calculate ideal weight as midpoint of range
  const idealWeight = useMemo(() => (idealWeightRange.min + idealWeightRange.max) / 2, [idealWeightRange]);

  // Calculate Resting Energy Requirement (RER) = 70 * (weight in kg ^ 0.75)
  // Use ideal weight for RER calculation
  const rer = useMemo(() => 70 * Math.pow(idealWeight, 0.75), [idealWeight]);

  // Activity factor multipliers for Maintenance Energy Requirement (MER)
  // Low: 1.2, Moderate: 1.6, High: 2.0
  const activityFactor = useMemo(() => {
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

  // Calculate MER = RER * activity factor
  const mer = useMemo(() => rer * activityFactor, [rer, activityFactor]);

  // Calculate target calories to maintain ideal weight
  // If current weight is valid, show calories to maintain ideal weight
  // Also show calories to maintain current weight (optional)
  const currentRER = useMemo(() => {
    if (!weightValid) return null;
    return 70 * Math.pow(weightNum, 0.75);
  }, [weightNum, weightValid]);

  const currentMER = useMemo(() => {
    if (!currentRER) return null;
    return currentRER * activityFactor;
  }, [currentRER, activityFactor]);

  // Helper text for invalid input
  const weightHelperText = !weightValid && currentWeight !== "" ? "Please enter a valid positive number for weight." : "";

  // Reset form handler
  function resetForm() {
    setCurrentWeight("");
    setBreedSize("medium");
    setActivityLevel("moderate");
  }

  // Widget UI
  const widget = (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Your Dog's Ideal Weight & Target Calories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="currentWeight">Current Weight (kg)</Label>
          <Input
            id="currentWeight"
            type="number"
            min={0.1}
            step={0.1}
            placeholder="e.g. 18.5"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            aria-describedby="weight-helper-text"
          />
          {weightHelperText && (
            <p id="weight-helper-text" className="text-red-600 dark:text-red-400 mt-1 text-sm">
              {weightHelperText}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="breedSize">Breed Size</Label>
          <select
            id="breedSize"
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600"
            value={breedSize}
            onChange={(e) => setBreedSize(e.target.value as "small" | "medium" | "large" | "giant")}
          >
            <option value="small">Small (5-10 kg)</option>
            <option value="medium">Medium (10-25 kg)</option>
            <option value="large">Large (25-45 kg)</option>
            <option value="giant">Giant (45-70 kg)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="activityLevel">Activity Level</Label>
          <select
            id="activityLevel"
            className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as "low" | "moderate" | "high")}
          >
            <option value="low">Low (mostly resting)</option>
            <option value="moderate">Moderate (regular walks/play)</option>
            <option value="high">High (very active, working dogs)</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Results</h3>
          <p>
            <strong>Ideal Weight:</strong> {idealWeight.toFixed(1)} kg (range: {idealWeightRange.min} - {idealWeightRange.max} kg)
          </p>
          <p>
            <strong>Resting Energy Requirement (RER):</strong> {rer.toFixed(0)} kcal/day
          </p>
          <p>
            <strong>Maintenance Energy Requirement (MER):</strong> {mer.toFixed(0)} kcal/day (based on activity level)
          </p>
          {weightValid && (
            <>
              <p className="mt-2 font-semibold">Based on your dog's current weight ({weightNum.toFixed(1)} kg):</p>
              <p>
                RER: {currentRER!.toFixed(0)} kcal/day
              </p>
              <p>
                MER: {currentMER!.toFixed(0)} kcal/day
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <Button variant="outline" onClick={resetForm} aria-label="Reset form inputs">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Formula explanations
  const formula = {
    heading: "Key formulas",
    items: [
      {
        label: "Resting Energy Requirement (RER)",
        formula: "RER = 70 × (Ideal Weight in kg)^0.75",
        description:
          "RER estimates the energy your dog needs at rest to maintain basic bodily functions. It is calculated using the ideal weight raised to the 0.75 power, multiplied by 70.",
      },
      {
        label: "Maintenance Energy Requirement (MER)",
        formula: "MER = RER × Activity Factor",
        description:
          "MER adjusts the resting energy needs based on your dog's activity level. Activity factors typically range from 1.2 (low activity) to 2.0 (high activity).",
      },
      {
        label: "Ideal Weight",
        formula: "Midpoint of breed size weight range",
        description:
          "Ideal weight is estimated as the midpoint of the typical healthy weight range for your dog's breed size category.",
      },
    ],
  };

  // Examples with step-by-step explanation
  const examples = {
    heading: "Worked examples",
    items: [
      {
        title: "Example 1: Medium breed, moderate activity",
        description:
          "A medium-sized dog weighing 18 kg with a moderate activity level. Calculate ideal weight and daily calorie needs.",
        steps: [
          "Ideal weight range for medium breed: 10-25 kg.",
          "Ideal weight midpoint: (10 + 25) / 2 = 17.5 kg.",
          "Calculate RER: 70 × (17.5)^0.75 ≈ 70 × 8.35 = 584.5 kcal/day.",
          "Activity factor for moderate activity: 1.6.",
          "Calculate MER: 584.5 × 1.6 = 935 kcal/day.",
          "Current weight RER: 70 × (18)^0.75 ≈ 70 × 8.56 = 599.2 kcal/day.",
          "Current weight MER: 599.2 × 1.6 = 958.7 kcal/day.",
        ],
        resultSummary:
          "Ideal weight is 17.5 kg with a maintenance calorie need of about 935 kcal/day. Current weight maintenance calories are slightly higher at 959 kcal/day.",
      },
      {
        title: "Example 2: Large breed, high activity",
        description:
          "A large breed dog weighing 40 kg with a high activity level. Calculate ideal weight and daily calorie needs.",
        steps: [
          "Ideal weight range for large breed: 25-45 kg.",
          "Ideal weight midpoint: (25 + 45) / 2 = 35 kg.",
          "Calculate RER: 70 × (35)^0.75 ≈ 70 × 15.6 = 1092 kcal/day.",
          "Activity factor for high activity: 2.0.",
          "Calculate MER: 1092 × 2.0 = 2184 kcal/day.",
          "Current weight RER: 70 × (40)^0.75 ≈ 70 × 17.4 = 1218 kcal/day.",
          "Current weight MER: 1218 × 2.0 = 2436 kcal/day.",
        ],
        resultSummary:
          "Ideal weight is 35 kg with a maintenance calorie need of about 2184 kcal/day. Current weight maintenance calories are higher at 2436 kcal/day.",
      },
    ],
  };

  // FAQ items
  const faqItems = [
    {
      question: "Why is it important to know my dog's ideal weight?",
      answer:
        "Knowing your dog's ideal weight helps you manage their health, prevent obesity-related issues, and ensure they receive the right amount of nutrition tailored to their breed and size.",
    },
    {
      question: "How do activity levels affect calorie needs?",
      answer:
        "More active dogs require more calories to fuel their energy expenditure. Sedentary dogs need fewer calories to avoid weight gain, while working or highly active dogs need more to maintain their weight.",
    },
    {
      question: "Can I use this calculator for puppies or senior dogs?",
      answer:
        "This calculator is designed for adult dogs at a stable weight. Puppies and senior dogs have different nutritional needs, so consult your veterinarian for tailored advice.",
    },
    {
      question: "What if my dog is overweight or underweight?",
      answer:
        "If your dog is outside the ideal weight range, consider consulting a veterinarian for a weight management plan. Gradual weight loss or gain is safest and most effective.",
    },
    {
      question: "Are breed size categories always accurate for my dog?",
      answer:
        "Breed size categories provide general guidance. Mixed breeds or dogs with unique body types may not fit perfectly into these categories, so use this as a starting point and consult your vet if unsure.",
    },
    {
      question: "How often should I recalculate my dog's calorie needs?",
      answer:
        "Recalculate whenever your dog's weight or activity level changes significantly to ensure their diet remains appropriate for their current needs.",
    },
    {
      question: "Does this calculator replace professional veterinary advice?",
      answer:
        "No. This tool is for educational purposes only. Always consult a qualified veterinarian for personalized health and nutrition advice for your dog.",
    },
  ];

  // References with clickable links
  const references = [
    {
      title: "National Research Council - Nutrient Requirements of Dogs and Cats",
      href: "https://www.nap.edu/catalog/10668/nutrient-requirements-of-dogs-and-cats",
      description:
        "Comprehensive guide on canine nutrition requirements, including energy needs and feeding recommendations.",
      icon: BookOpen,
    },
    {
      title: "WSAVA Global Nutrition Guidelines",
      href: "https://www.wsava.org/Guidelines/Global-Nutrition-Guidelines",
      description:
        "World Small Animal Veterinary Association guidelines on pet nutrition and weight management.",
      icon: Info,
    },
    {
      title: "Merck Veterinary Manual - Canine Nutrition",
      href: "https://www.merckvetmanual.com/nutrition/feeding-the-puppy-and-adult-dog/nutrition-of-the-dog",
      description:
        "Detailed overview of canine nutritional needs and factors affecting energy requirements.",
      icon: Info,
    },
  ];

  // Related calculators
  const relatedCalculators = [
    {
      title: "Dog Calorie Needs (RER/MER) Calculator",
      href: "/pets/dog-calorie-needs-rer-mer",
      icon: Activity,
      category: "Pets – Dogs",
      description: "Calculate your dog's daily calorie needs based on weight and activity level.",
    },
    {
      title: "Dog Weight Loss Planner",
      href: "/pets/dog-weight-loss-planner",
      icon: HeartPulse,
      category: "Pets – Dogs",
      description: "Plan a safe and effective weight loss program for your overweight dog.",
    },
    {
      title: "Dog Ideal Weight Calculator",
      href: "/pets/dog-ideal-weight-calculator",
      icon: Scale,
      category: "Pets – Dogs",
      description: "Estimate your dog's ideal weight based on breed and size.",
    },
  ];

  // SEO metadata
  const seo = {
    pageTitle: "Dog Ideal Weight & Target Calories Calculator | SmartKitNow",
    metaDescription:
      "Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed size and activity level. Use our easy calculator for optimal canine nutrition.",
    keywords: [
      "dog ideal weight",
      "dog calorie calculator",
      "canine nutrition",
      "dog weight management",
      "pet calorie needs",
      "dog activity level calories",
      "dog health calculator",
    ],
    structuredData: {
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
    },
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size."
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      seo={seo}
      widget={widget}
      formula={formula}
      examples={examples}
      faqItems={faqItems}
      references={references}
      relatedCalculators={relatedCalculators}
      showTopBanner={true}
      showBottomBanner={true}
      showSidebarAds={true}
      icon={Dog}
    />
  );
}

export default DogIdealWeightTargetCaloriesCalculator;