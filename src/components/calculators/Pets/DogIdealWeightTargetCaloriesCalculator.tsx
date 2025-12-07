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
  // Source: general veterinary guidelines for breed size ideal weights
  // These are approximate median ideal weights for adult dogs by size category
  const idealWeightRange = useMemo(() => {
    switch (breedSize) {
      case "small":
        return { min: 4, max: 10 };
      case "medium":
        return { min: 11, max: 25 };
      case "large":
        return { min: 26, max: 45 };
      case "giant":
        return { min: 46, max: 90 };
      default:
        return { min: 11, max: 25 };
    }
  }, [breedSize]);

  // Calculate ideal weight as midpoint of range
  const idealWeight = useMemo(() => {
    return (idealWeightRange.min + idealWeightRange.max) / 2;
  }, [idealWeightRange]);

  // Calculate Resting Energy Requirement (RER) = 70 * (weight in kg)^0.75
  // Use ideal weight for RER calculation
  const rer = useMemo(() => {
    return 70 * Math.pow(idealWeight, 0.75);
  }, [idealWeight]);

  // Activity factor multipliers for MER (Maintenance Energy Requirement)
  // Source: veterinary nutrition guidelines
  const activityFactor = useMemo(() => {
    switch (activityLevel) {
      case "low":
        return 1.2; // sedentary or older dogs
      case "moderate":
        return 1.6; // typical adult dogs with normal activity
      case "high":
        return 2.0; // working or highly active dogs
      default:
        return 1.6;
    }
  }, [activityLevel]);

  // Calculate MER = RER * activity factor
  const mer = useMemo(() => {
    return rer * activityFactor;
  }, [rer, activityFactor]);

  // Handler to reset inputs
  function resetInputs() {
    setCurrentWeight("");
    setBreedSize("medium");
    setActivityLevel("moderate");
  }

  // Format numbers to 2 decimals for display
  function formatNum(num: number) {
    return num.toFixed(2);
  }

  // SEO structured data FAQPage schema
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I determine my dog's ideal weight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ideal weight depends on your dog's breed size category. This calculator uses typical weight ranges for small, medium, large, and giant breeds to estimate a healthy target weight."
        }
      },
      {
        "@type": "Question",
        "name": "What is the Resting Energy Requirement (RER)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RER is the amount of energy your dog needs at rest, calculated using the formula 70 × (weight in kg)^0.75."
        }
      },
      {
        "@type": "Question",
        "name": "How do activity levels affect calorie needs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "More active dogs require more calories. This calculator adjusts calorie needs based on low, moderate, or high activity multipliers applied to the RER."
        }
      },
      {
        "@type": "Question",
        "name": "Can this calculator replace veterinary advice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. This tool is for educational purposes only. Always consult your veterinarian for personalized health and nutrition advice."
        }
      }
    ]
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size."
      category="pets"
      subcategory="Dogs — Nutrition & Weight"
      seo={{
        pageTitle: "Dog Ideal Weight & Target Calories Calculator | SmartKitNow",
        metaDescription:
          "Calculate your dog's ideal weight and daily calorie needs based on breed size and activity level. Use this veterinary-informed calculator to support your dog's health.",
        keywords: [
          "dog ideal weight",
          "dog calorie needs",
          "dog nutrition calculator",
          "dog weight calculator",
          "dog maintenance energy requirement",
          "RER dog formula",
          "dog activity calorie calculator",
          "pet nutrition",
          "dog health calculator"
        ],
        structuredData: faqStructuredData
      }}
      widget={
        <Card>
          <CardHeader>
            <CardTitle>Calculate Your Dog's Ideal Weight & Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-6"
              noValidate
            >
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
                  required
                />
                {!isWeightValid && currentWeight !== "" && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400" id="weight-helper">
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
                  onChange={(e) => setBreedSize(e.target.value as any)}
                >
                  <option value="small">Small (4–10 kg)</option>
                  <option value="medium">Medium (11–25 kg)</option>
                  <option value="large">Large (26–45 kg)</option>
                  <option value="giant">Giant (46–90 kg)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <select
                  id="activityLevel"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as any)}
                >
                  <option value="low">Low (sedentary or older dogs)</option>
                  <option value="moderate">Moderate (typical adult dogs)</option>
                  <option value="high">High (working or very active dogs)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <Button type="button" variant="outline" onClick={resetInputs}>
                  Reset
                </Button>
              </div>
            </form>

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Results
              </h3>
              {!isWeightValid ? (
                <p className="text-gray-700 dark:text-gray-300">
                  Please enter a valid current weight to see results.
                </p>
              ) : (
                <>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Ideal Weight:</strong> {formatNum(idealWeight)} kg (based on breed size)
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Resting Energy Requirement (RER):</strong> {formatNum(rer)} kcal/day
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Maintenance Energy Requirement (MER):</strong> {formatNum(mer)} kcal/day
                  </p>
                  <p className="text-sm italic text-gray-600 dark:text-gray-400">
                    * MER is the estimated daily calories needed to maintain your dog's ideal weight,
                    adjusted for activity level.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      }
      formula={{
        heading: "Key formulas used in this calculator",
        items: [
          {
            label: "Ideal Weight",
            formula: "Midpoint of typical breed size weight range (kg)",
            description:
              "We estimate your dog's ideal weight as the midpoint of the breed size category's typical weight range."
          },
          {
            label: "Resting Energy Requirement (RER)",
            formula: "RER = 70 × (Ideal Weight in kg)^0.75",
            description:
              "RER estimates the calories your dog needs at rest to maintain basic bodily functions."
          },
          {
            label: "Maintenance Energy Requirement (MER)",
            formula: "MER = RER × Activity Factor",
            description:
              "MER adjusts RER based on your dog's activity level to estimate total daily calorie needs."
          }
        ]
      }}
      examples={{
        heading: "Worked examples",
        items: [
          {
            title: "Example 1: Medium breed, moderate activity",
            description:
              "A medium-sized dog weighing 15 kg with a moderate activity level.",
            steps: [
              "Ideal weight range for medium breeds: 11–25 kg.",
              "Ideal weight midpoint: (11 + 25) / 2 = 18 kg.",
              "Calculate RER: 70 × 18^0.75 ≈ 70 × 9.54 = 668 kcal/day.",
              "Activity factor for moderate activity: 1.6.",
              "Calculate MER: 668 × 1.6 = 1070 kcal/day."
            ],
            resultSummary:
              "The dog should ideally weigh about 18 kg and consume approximately 1070 kcal daily to maintain that weight."
          },
          {
            title: "Example 2: Large breed, high activity",
            description:
              "A large breed dog with high activity level.",
            steps: [
              "Ideal weight range for large breeds: 26–45 kg.",
              "Ideal weight midpoint: (26 + 45) / 2 = 35.5 kg.",
              "Calculate RER: 70 × 35.5^0.75 ≈ 70 × 16.9 = 1183 kcal/day.",
              "Activity factor for high activity: 2.0.",
              "Calculate MER: 1183 × 2.0 = 2366 kcal/day."
            ],
            resultSummary:
              "The dog should ideally weigh about 35.5 kg and consume approximately 2366 kcal daily to maintain that weight."
          }
        ]
      }}
      faqItems={[
        {
          question: "Why is it important to know my dog's ideal weight?",
          answer:
            "Maintaining an ideal weight helps support your dog's overall health, mobility, and longevity. Overweight or underweight dogs may face health risks."
        },
        {
          question: "Can I use this calculator for puppies or senior dogs?",
          answer:
            "This calculator is designed for adult dogs. Puppies and senior dogs have different nutritional needs. Consult your veterinarian for tailored advice."
        },
        {
          question: "How often should I check my dog's weight and calorie needs?",
          answer:
            "Regularly monitoring your dog's weight and adjusting calorie intake as needed helps maintain optimal health. Check weight monthly or as advised by your vet."
        },
        {
          question: "What if my dog’s actual weight is outside the ideal range?",
          answer:
            "If your dog is underweight or overweight, consult your veterinarian for a personalized nutrition and weight management plan."
        },
        {
          question: "Does breed size always determine ideal weight?",
          answer:
            "Breed size provides a general guideline, but individual dogs may vary. Use this calculator as a starting point and seek veterinary advice for specifics."
        },
        {
          question: "How accurate are the calorie estimates?",
          answer:
            "Calorie needs vary by individual metabolism, health, and lifestyle. These estimates provide a useful baseline but should be adjusted based on your dog's condition."
        },
        {
          question: "Can activity level change over time?",
          answer:
            "Yes, your dog's activity level can fluctuate due to age, health, or lifestyle changes. Update the calculator inputs accordingly to maintain accurate calorie estimates."
        },
        {
          question: "Is this calculator a substitute for veterinary advice?",
          answer:
            "No. This tool is for educational purposes only. Always consult your veterinarian for personalized health and nutrition guidance."
        }
      ]}
      references={[
        {
          title: "National Research Council (NRC) Nutrient Requirements of Dogs and Cats",
          href: "https://www.nap.edu/catalog/10668/nutrient-requirements-of-dogs-and-cats",
          description:
            "Authoritative resource on canine nutritional needs, including energy requirements and feeding guidelines.",
          icon: BookOpen
        },
        {
          title: "Merck Veterinary Manual: Canine Nutrition",
          href: "https://www.merckvetmanual.com/digestive-system/nutrition/canine-nutrition",
          description:
            "Comprehensive overview of dog nutrition principles, energy requirements, and feeding management.",
          icon: Info
        },
        {
          title: "WSAVA Global Nutrition Guidelines",
          href: "https://wsava.org/wp-content/uploads/2020/01/WSAVA-Nutrition-Guidelines-2019.pdf",
          description:
            "Global standards for companion animal nutrition, including energy calculations and life stage considerations.",
          icon: BookOpen
        }
      ]}
      relatedCalculators={[
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
          icon: Scale,
          category: "Pets – Dogs",
          description: "Determine the right amount of food to feed your dog daily."
        }
      ]}
      showTopBanner={true}
      showBottomBanner={true}
      showSidebarAds={true}
    />
  );
}

export default DogIdealWeightTargetCaloriesCalculator;