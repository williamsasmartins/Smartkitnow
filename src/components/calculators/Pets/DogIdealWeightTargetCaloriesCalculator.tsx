import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Dog, Activity, HeartPulse, BookOpen, Info } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogIdealWeightTargetCaloriesCalculator() {
  // State for inputs
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [breedSize, setBreedSize] = useState<"small" | "medium" | "large" | "giant">("medium");
  const [activityLevel, setActivityLevel] = useState<"low" | "moderate" | "high">("moderate");

  // Validation helpers
  const weightNum = parseFloat(currentWeight);
  const isWeightValid = !isNaN(weightNum) && weightNum > 0;

  // Ideal weight ranges by breed size (kg)
  // These are typical ideal weight ranges for adult dogs by size category
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

  // Calculate ideal weight as midpoint of range
  const idealWeight = useMemo(() => {
    return (idealWeightRange.min + idealWeightRange.max) / 2;
  }, [idealWeightRange]);

  // Calculate Resting Energy Requirement (RER) = 70 * (weight in kg)^0.75
  // Use ideal weight for calculation
  const rer = useMemo(() => {
    return 70 * Math.pow(idealWeight, 0.75);
  }, [idealWeight]);

  // Multipliers for Maintenance Energy Requirement (MER) based on activity level
  // Source: typical veterinary nutrition guidelines
  const activityMultiplier = useMemo(() => {
    switch (activityLevel) {
      case "low":
        return 1.2; // less active or older dogs
      case "moderate":
        return 1.6; // average adult dogs
      case "high":
        return 2.0; // very active or working dogs
      default:
        return 1.6;
    }
  }, [activityLevel]);

  // Calculate MER = RER * activity multiplier
  const mer = useMemo(() => {
    return rer * activityMultiplier;
  }, [rer, activityMultiplier]);

  // Helper to format calories with no decimals
  const formatCalories = (cal: number) => Math.round(cal);

  // Reset inputs handler
  const handleReset = () => {
    setCurrentWeight("");
    setBreedSize("medium");
    setActivityLevel("moderate");
  };

  // SEO structured data FAQPage schema
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I know my dog's ideal weight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your dog's ideal weight depends on its breed size and body condition. This calculator uses typical weight ranges for breed sizes to estimate a healthy target weight."
        }
      },
      {
        "@type": "Question",
        "name": "What is Resting Energy Requirement (RER)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RER is the amount of energy a dog needs at rest to maintain basic bodily functions. It is calculated based on the dog's weight."
        }
      },
      {
        "@type": "Question",
        "name": "How does activity level affect calorie needs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "More active dogs require more calories to maintain their weight. This calculator adjusts calorie needs based on low, moderate, or high activity levels."
        }
      },
      {
        "@type": "Question",
        "name": "Can this calculator replace veterinary advice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. This tool provides general estimates. Always consult your veterinarian for personalized nutrition and weight management advice."
        }
      }
    ]
  };

  // Widget UI
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
            <p id="weight-helper" className="mt-1 text-sm text-red-600 dark:text-red-400">
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
              <strong>Ideal Weight:</strong> {idealWeight.toFixed(1)} kg (typical for a {breedSize} breed)
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Resting Energy Requirement (RER):</strong> {formatCalories(rer)} kcal/day
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Maintenance Energy Requirement (MER):</strong> {formatCalories(mer)} kcal/day based on {activityLevel} activity
            </p>
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              These calorie needs are estimates to maintain your dog's ideal weight.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Formula section
  const formula = {
    heading: "Key formulas",
    items: [
      {
        label: "Resting Energy Requirement (RER)",
        formula: "RER = 70 × (Ideal Weight in kg)^0.75",
        description:
          "Calculates the energy your dog needs at rest to maintain vital functions."
      },
      {
        label: "Maintenance Energy Requirement (MER)",
        formula: "MER = RER × Activity Multiplier",
        description:
          "Adjusts RER based on your dog's activity level to estimate daily calorie needs."
      }
    ]
  };

  // Examples section
  const examples = {
    heading: "Worked examples",
    items: [
      {
        title: "Medium breed dog with moderate activity",
        description:
          "A 15 kg medium breed dog with moderate activity level.",
        steps: [
          "Ideal weight range for medium breed: 10–25 kg.",
          "Ideal weight midpoint: (10 + 25) / 2 = 17.5 kg.",
          "Calculate RER: 70 × 17.5^0.75 ≈ 70 × 8.36 = 585 kcal/day.",
          "MER: 585 × 1.6 (moderate activity) = 936 kcal/day."
        ],
        resultSummary:
          "The dog should consume approximately 936 kcal/day to maintain ideal weight."
      },
      {
        title: "Large breed dog with high activity",
        description:
          "A 40 kg large breed dog with high activity level.",
        steps: [
          "Ideal weight range for large breed: 25–45 kg.",
          "Ideal weight midpoint: (25 + 45) / 2 = 35 kg.",
          "Calculate RER: 70 × 35^0.75 ≈ 70 × 15.62 = 1093 kcal/day.",
          "MER: 1093 × 2.0 (high activity) = 2186 kcal/day."
        ],
        resultSummary:
          "The dog should consume approximately 2186 kcal/day to maintain ideal weight."
      }
    ]
  };

  // FAQ items
  const faqItems = [
    {
      question: "Why is ideal weight important for my dog?",
      answer:
        "Maintaining an ideal weight helps reduce the risk of health problems and improves your dog's quality of life."
    },
    {
      question: "Can I use this calculator for puppies or senior dogs?",
      answer:
        "This calculator is designed for adult dogs. Puppies and seniors have different nutritional needs; consult your veterinarian for guidance."
    },
    {
      question: "What if my dog is underweight or overweight?",
      answer:
        "If your dog is outside the ideal weight range, consult your veterinarian for a tailored weight management plan."
    },
    {
      question: "How often should I adjust my dog's calorie intake?",
      answer:
        "Adjust calorie intake based on changes in activity, age, health status, or weight. Regular monitoring and vet checkups are recommended."
    },
    {
      question: "Does breed size affect calorie needs?",
      answer:
        "Yes, breed size influences ideal weight and energy requirements, which this calculator accounts for."
    },
    {
      question: "Are these calorie estimates exact?",
      answer:
        "No, these are general estimates. Individual dogs may require more precise evaluation by a professional."
    },
    {
      question: "Can I use this calculator for mixed breed dogs?",
      answer:
        "Yes, select the breed size that best matches your dog's size and body type."
    },
    {
      question: "Is activity level the only factor affecting calorie needs?",
      answer:
        "No, factors like age, health, neuter status, and environment also affect calorie needs."
    }
  ];

  // References
  const references = [
    {
      title: "National Research Council (NRC) Nutrient Requirements of Dogs and Cats",
      href: "https://www.nap.edu/catalog/10668/nutrient-requirements-of-dogs-and-cats",
      description:
        "Authoritative resource on canine nutrition requirements, including energy needs and feeding guidelines.",
      icon: BookOpen
    },
    {
      title: "Merck Veterinary Manual: Canine Nutrition",
      href: "https://www.merckvetmanual.com/digestive-system/nutrition/canine-nutrition",
      description:
        "Comprehensive overview of dog nutrition, energy requirements, and feeding recommendations.",
      icon: Info
    },
    {
      title: "WSAVA Global Nutrition Guidelines",
      href: "https://www.wsava.org/WSAVA/media/Documents/Guidelines/Nutrition-Guidelines-WSAVA-2019.pdf",
      description:
        "Global guidelines for feeding dogs and cats, including energy calculations and life-stage nutrition.",
      icon: BookOpen
    }
  ];

  // Related calculators
  const relatedCalculators = [
    {
      title: "Dog Calorie Needs (RER/MER) Calculator",
      href: "/pets/dog-calorie-needs-rer-mer",
      icon: Activity,
      category: "Pets – Dogs",
      description: "Calculate your dog's daily calorie needs based on weight and activity."
    },
    {
      title: "Dog Weight Loss Planner",
      href: "/pets/dog-weight-loss-planner",
      icon: HeartPulse,
      category: "Pets – Dogs",
      description: "Plan a safe and effective weight loss program for your overweight dog."
    },
    {
      title: "Dog Food Portion Calculator",
      href: "/pets/dog-food-portion-calculator",
      icon: Dog,
      category: "Pets – Dogs",
      description: "Determine the right amount of food to feed your dog daily."
    }
  ];

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size."
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      seo={{
        pageTitle: "Dog Ideal Weight & Target Calories Calculator - SmartKitNow",
        metaDescription:
          "Calculate your dog's ideal weight and daily calorie needs based on breed size and activity level. Maintain your dog's health with accurate nutrition estimates.",
        keywords: [
          "dog ideal weight",
          "dog calorie calculator",
          "dog nutrition",
          "dog weight management",
          "canine calorie needs",
          "pet nutrition calculator",
          "dog activity calorie needs"
        ],
        structuredData: faqStructuredData
      }}
      widget={widget}
      formula={formula}
      examples={examples}
      faqItems={faqItems}
      references={references}
      relatedCalculators={relatedCalculators}
      showTopBanner={true}
      showBottomBanner={true}
      showSidebarAds={true}
    />
  );
}

export default DogIdealWeightTargetCaloriesCalculator;