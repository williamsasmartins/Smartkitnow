import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calculator, Dog, Activity, HeartPulse, BookOpen, Info } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogIdealWeightTargetCaloriesCalculator() {
  // State for inputs
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [breedSize, setBreedSize] = useState<"small" | "medium" | "large">("medium");
  const [activityLevel, setActivityLevel] = useState<"low" | "moderate" | "high">("moderate");

  // Parse weight input as number
  const weightKg = useMemo(() => {
    const w = parseFloat(currentWeight);
    return isNaN(w) || w <= 0 ? null : w;
  }, [currentWeight]);

  // Ideal weight estimation based on breed size
  // These are typical ideal weight ranges (kg) for adult dogs by breed size:
  // Small: 5 - 10 kg (ideal midpoint 7.5)
  // Medium: 15 - 25 kg (ideal midpoint 20)
  // Large: 30 - 45 kg (ideal midpoint 37.5)
  // We use midpoint as ideal weight for simplicity.
  const idealWeightKg = useMemo(() => {
    switch (breedSize) {
      case "small":
        return 7.5;
      case "medium":
        return 20;
      case "large":
        return 37.5;
      default:
        return null;
    }
  }, [breedSize]);

  // Resting Energy Requirement (RER) = 70 * (idealWeightKg ^ 0.75)
  const rer = useMemo(() => {
    if (!idealWeightKg) return null;
    return 70 * Math.pow(idealWeightKg, 0.75);
  }, [idealWeightKg]);

  // Maintenance Energy Requirement (MER) = RER * activity factor
  // Activity factors:
  // low: 1.2 (older, less active dogs)
  // moderate: 1.6 (typical adult dog)
  // high: 2.0 (active, working dogs)
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

  const mer = useMemo(() => {
    if (!rer) return null;
    return rer * activityFactor;
  }, [rer, activityFactor]);

  // Helper text for weight input validation
  const weightError = currentWeight !== "" && (weightKg === null || weightKg <= 0) ? "Please enter a valid positive weight in kilograms." : "";

  // Format calories to nearest integer
  const formattedMER = mer ? Math.round(mer) : null;

  // Formula descriptions for editorial
  const formulaItems = [
    {
      label: "Resting Energy Requirement (RER)",
      formula: "RER = 70 × (Ideal Weight in kg)^0.75",
      description:
        "RER estimates the calories a dog needs at rest to maintain basic bodily functions."
    },
    {
      label: "Maintenance Energy Requirement (MER)",
      formula: "MER = RER × Activity Factor",
      description:
        "MER adjusts RER based on the dog's activity level to estimate daily calorie needs."
    },
    {
      label: "Ideal Weight",
      formula: "Based on breed size typical weight ranges",
      description:
        "Ideal weight is estimated from typical adult weight ranges for small, medium, and large breeds."
    }
  ];

  // Examples for editorial
  const exampleItems = [
    {
      title: "Example 1: Medium Breed, Moderate Activity",
      description:
        "A medium-sized dog with moderate activity level and current weight of 18 kg.",
      steps: [
        "Ideal weight for medium breed is 20 kg.",
        "Calculate RER: 70 × 20^0.75 ≈ 662 kcal/day.",
        "Activity factor for moderate activity is 1.6.",
        "Calculate MER: 662 × 1.6 ≈ 1059 kcal/day.",
        "Recommended daily calories to maintain ideal weight: ~1059 kcal."
      ],
      resultSummary: "Ideal Weight: 20 kg, Target Calories: ~1059 kcal/day"
    },
    {
      title: "Example 2: Large Breed, High Activity",
      description:
        "A large breed dog with high activity level and current weight of 40 kg.",
      steps: [
        "Ideal weight for large breed is 37.5 kg.",
        "Calculate RER: 70 × 37.5^0.75 ≈ 1327 kcal/day.",
        "Activity factor for high activity is 2.0.",
        "Calculate MER: 1327 × 2.0 ≈ 2654 kcal/day.",
        "Recommended daily calories to maintain ideal weight: ~2654 kcal."
      ],
      resultSummary: "Ideal Weight: 37.5 kg, Target Calories: ~2654 kcal/day"
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: "Why is ideal weight important for my dog?",
      answer:
        "Maintaining an ideal weight helps reduce the risk of health problems such as joint issues, diabetes, and heart disease. This calculator provides an estimate to guide healthy weight management."
    },
    {
      question: "Can I use this calculator for puppies or senior dogs?",
      answer:
        "This calculator is designed for adult dogs. Puppies and senior dogs have different nutritional needs, so consult your veterinarian for tailored advice."
    },
    {
      question: "How do I know my dog's activity level?",
      answer:
        "Activity levels vary by lifestyle: low (mostly resting), moderate (daily walks/play), and high (working or very active dogs). Choose the level that best matches your dog's routine."
    },
    {
      question: "What if my dog's current weight is very different from the ideal weight?",
      answer:
        "If your dog is overweight or underweight, gradual adjustments to diet and exercise are recommended. Always consult a veterinarian before starting a weight management plan."
    },
    {
      question: "Does breed size affect calorie needs?",
      answer:
        "Yes, breed size influences ideal weight and energy requirements. This calculator uses breed size categories to estimate healthy weight and calorie intake."
    },
    {
      question: "Are these calorie recommendations exact?",
      answer:
        "These are estimates based on standard formulas. Individual needs may vary due to metabolism, health status, and environment. Use this as a guideline and consult your vet for personalized plans."
    },
    {
      question: "Can I use this calculator for mixed breed dogs?",
      answer:
        "Yes, select the breed size category that best fits your dog's size and build for an approximate estimate."
    },
    {
      question: "How often should I reassess my dog's weight and calorie needs?",
      answer:
        "Regularly monitor your dog's weight and body condition, especially during life changes. Adjust calorie intake as needed and consult your veterinarian for guidance."
    }
  ];

  // References
  const references = [
    {
      title: "National Research Council - Nutrient Requirements of Dogs and Cats",
      href: "https://www.nap.edu/catalog/10668/nutrient-requirements-of-dogs-and-cats",
      description:
        "Comprehensive resource on canine nutrition requirements, including energy needs and feeding guidelines.",
      icon: BookOpen
    },
    {
      title: "WSAVA Global Nutrition Guidelines",
      href: "https://www.wsava.org/WSAVA/media/Documents/Guidelines/Nutrition-Guidelines-WSAVA-2018.pdf",
      description:
        "World Small Animal Veterinary Association guidelines on nutrition for dogs and cats, including weight management.",
      icon: Info
    },
    {
      title: "Pet Nutrition Alliance - Calorie Calculator",
      href: "https://petnutritionalliance.org/calorie-calculator/",
      description:
        "An online tool and resource for estimating pet calorie needs based on weight and activity.",
      icon: Info
    }
  ];

  // Related calculators
  const relatedCalculators = [
    {
      title: "Dog Calorie Needs (RER/MER) Calculator",
      href: "/pets/dog-calorie-needs-rer-mer",
      icon: Activity,
      category: "Pets – Dogs",
      description: "Calculate your dog's resting and maintenance calorie needs based on weight and activity."
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
      description: "Determine daily food portions based on your dog's calorie needs and food type."
    }
  ];

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
            aria-describedby="weight-helper"
          />
          {weightError && (
            <p id="weight-helper" className="mt-1 text-sm text-red-600 dark:text-red-400">
              {weightError}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="breedSize">Breed Size</Label>
          <select
            id="breedSize"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            value={breedSize}
            onChange={(e) => setBreedSize(e.target.value as "small" | "medium" | "large")}
          >
            <option value="small">Small (5-10 kg)</option>
            <option value="medium">Medium (15-25 kg)</option>
            <option value="large">Large (30-45 kg)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="activityLevel">Activity Level</Label>
          <select
            id="activityLevel"
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as "low" | "moderate" | "high")}
          >
            <option value="low">Low (mostly resting)</option>
            <option value="moderate">Moderate (daily walks/play)</option>
            <option value="high">High (working or very active)</option>
          </select>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Results</h3>
          {weightError ? (
            <p className="text-red-600 dark:text-red-400">Please enter a valid current weight to see results.</p>
          ) : (
            <>
              <p>
                <strong>Estimated Ideal Weight:</strong>{" "}
                {idealWeightKg ? `${idealWeightKg.toFixed(1)} kg` : "N/A"}
              </p>
              <p>
                <strong>Target Daily Calories to Maintain Ideal Weight:</strong>{" "}
                {formattedMER !== null ? `${formattedMER} kcal/day` : "N/A"}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // SEO structured data FAQPage
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(({ question, answer }) => ({
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    }))
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
          "Calculate your dog's ideal weight and daily calorie needs based on breed size and activity level. Use this easy tool to support your dog's healthy nutrition and weight management.",
        keywords: [
          "dog ideal weight calculator",
          "dog calorie needs",
          "dog nutrition calculator",
          "dog weight management",
          "pet calorie calculator",
          "dog activity level calories"
        ],
        structuredData
      }}
      widget={widget}
      formula={{
        heading: "Key formulas",
        items: formulaItems
      }}
      examples={{
        heading: "Worked examples",
        items: exampleItems
      }}
      faqItems={faqItems}
      references={references}
      relatedCalculators={relatedCalculators}
      showTopBanner={true}
      showBottomBanner={true}
      showSidebarAds={true}
    >
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">How this calculator works</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          This calculator estimates your dog's ideal weight based on typical breed size categories (small, medium, large). It then calculates the Resting Energy Requirement (RER), which is the number of calories your dog needs at rest to maintain basic bodily functions. The RER is calculated using the formula <em>70 × (ideal weight in kg)^0.75</em>.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          To account for your dog's activity level, the calculator multiplies the RER by an activity factor (ranging from 1.2 for low activity to 2.0 for high activity). This gives the Maintenance Energy Requirement (MER), which is the estimated daily calorie intake needed to maintain your dog's ideal weight.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Please note that these calculations provide estimates and should be used as a guideline. For personalized nutrition and weight management advice, consult your veterinarian.
        </p>
      </section>

      <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Disclaimer</h2>
        <p className="text-gray-700 dark:text-gray-300">
          This calculator is intended for educational purposes only and does not replace professional veterinary advice. Always consult a qualified veterinarian for personalized recommendations regarding your dog's health, nutrition, and weight management.
        </p>
      </section>

      <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">References & Additional Resources</h2>
        <ul className="space-y-4">
          {references.map(({ title, href, description, icon: Icon }, i) => (
            <li key={i} className="flex items-start gap-3">
              {Icon && <Icon className="mt-1 h-5 w-5 text-blue-500 dark:text-blue-400" />}
              <div>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {title}
                </a>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
}

export default DogIdealWeightTargetCaloriesCalculator;