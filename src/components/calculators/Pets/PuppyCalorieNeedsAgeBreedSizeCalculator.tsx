import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function PuppyCalorieNeedsAgeBreedSizeCalculator() {
  const [weight, setWeight] = useState("");
  const [ageWeeks, setAgeWeeks] = useState("");
  const [breedSize, setBreedSize] = useState("medium");
  const [calorieNeeds, setCalorieNeeds] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Breed size factors for MER multiplier based on age and breed size
  // Source: NRC and AAFCO guidelines adapted for puppy growth stages
  const getMERFactor = (age: number, size: string) => {
    if (age < 8) {
      // Neonatal to 8 weeks: highest energy needs
      return 3.0;
    }
    if (age < 16) {
      // 8 to 16 weeks: high energy needs, varies by breed size
      switch (size) {
        case "small":
          return 2.5;
        case "medium":
          return 2.8;
        case "large":
          return 3.0;
        case "giant":
          return 3.2;
        default:
          return 2.8;
      }
    }
    if (age < 26) {
      // 16 to 26 weeks: moderate energy needs, varies by breed size
      switch (size) {
        case "small":
          return 2.0;
        case "medium":
          return 2.2;
        case "large":
          return 2.4;
        case "giant":
          return 2.6;
        default:
          return 2.2;
      }
    }
    // Older than 26 weeks: approaching adult MER factor ~1.6-2.0
    switch (size) {
      case "small":
        return 1.8;
      case "medium":
        return 1.8;
      case "large":
        return 1.6;
      case "giant":
        return 1.6;
      default:
        return 1.8;
    }
  };

  // Calculate RER = 70 * (kg^0.75)
  const calculateRER = (kg: number) => 70 * Math.pow(kg, 0.75);

  // Calculate Puppy PER = MER = RER * factor
  const calculatePuppyPER = (kg: number, age: number, size: string) => {
    const rer = calculateRER(kg);
    const factor = getMERFactor(age, size);
    return rer * factor;
  };

  const handleCalculate = () => {
    const w = parseFloat(weight);
    const a = parseInt(ageWeeks, 10);
    if (isNaN(w) || w <= 0 || isNaN(a) || a <= 0) {
      setCalorieNeeds(null);
      return;
    }
    const calories = calculatePuppyPER(w, a, breedSize);
    setCalorieNeeds(calories);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const widget = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCalculate();
      }}
      className="space-y-6"
      aria-label="Puppy Calorie Needs Calculator Form"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Enter Puppy Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6">
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Current Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min={0.1}
              step={0.01}
              placeholder="e.g. 5.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              aria-describedby="weight-desc"
            />
            <p id="weight-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your puppy's current weight in kilograms.
            </p>
          </div>
          <div>
            <Label htmlFor="ageWeeks" className="text-slate-700 dark:text-slate-300">
              Age (weeks)
            </Label>
            <Input
              id="ageWeeks"
              type="number"
              min={1}
              max={52}
              step={1}
              placeholder="e.g. 12"
              value={ageWeeks}
              onChange={(e) => setAgeWeeks(e.target.value)}
              required
              aria-describedby="age-desc"
            />
            <p id="age-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter your puppy's age in weeks (1-52).
            </p>
          </div>
          <div>
            <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
              Predicted Adult Breed Size
            </Label>
            <select
              id="breedSize"
              value={breedSize}
              onChange={(e) => setBreedSize(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              aria-describedby="breedSize-desc"
            >
              <option value="small">Small (under 10 kg)</option>
              <option value="medium">Medium (10-25 kg)</option>
              <option value="large">Large (25-45 kg)</option>
              <option value="giant">Giant (over 45 kg)</option>
            </select>
            <p id="breedSize-desc" className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select the expected adult size of your puppy's breed.
            </p>
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full">
              Calculate Calorie Needs
            </Button>
          </div>
        </CardContent>
      </Card>
      {calorieNeeds !== null && (
        <Card ref={resultsRef} className="mt-4">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Estimated Daily Calorie Needs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {calorieNeeds.toFixed(0)} kcal/day
            </p>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              This is the estimated energy requirement for your puppy to support healthy growth.
            </p>
          </CardContent>
        </Card>
      )}
    </form>
  );

  const editorial = (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        Understanding Puppy Calorie Needs by Age and Breed Size
      </h2>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        Puppies have unique nutritional requirements that vary significantly based on their age and the size of their adult breed. Proper calorie intake supports optimal growth, development, and overall health. This calculator estimates your puppy's daily calorie needs by combining their current weight, age in weeks, and predicted adult breed size.
      </p>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        The calculation uses the Resting Energy Requirement (RER) formula adjusted by a growth factor (MER) specific to puppies. Younger puppies and larger breeds require more calories per kilogram of body weight due to rapid growth and higher metabolic demands.
      </p>
      <p className="text-slate-700 dark:text-slate-300">
        Always consult your veterinarian to tailor feeding plans to your puppy's individual health and activity level.
      </p>
    </>
  );

  const onThisPage = [
    { id: "how-to-use", label: "How to Use This Calculator" },
    { id: "formula", label: "Formula Explanation" },
    { id: "example", label: "Example Calculation" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "references", label: "References" },
  ];

  const formula = {
    title: "Key formulas used in this calculator",
    formula: "RER = 70 × (kg^0.75); Puppy PER (MER) = RER × growth factor",
    variables: [
      { symbol: "RER", name: "Resting Energy Requirement", description: "Energy needed at rest (kcal/day)" },
      { symbol: "kg", name: "Weight in kilograms", description: "Current body weight of the puppy" },
      { symbol: "Puppy PER (MER)", name: "Puppy Maintenance Energy Requirement", description: "Energy needed for growth and activity" },
      { symbol: "growth factor", name: "Age and breed size multiplier", description: "Adjusts RER for puppy growth stage and breed size" },
    ],
  };

  const example = {
    steps: [
      {
        step: 1,
        description: "Determine your puppy's current weight in kilograms.",
        calculation: "Weight = 6.5 kg",
      },
      {
        step: 2,
        description: "Identify your puppy's age in weeks.",
        calculation: "Age = 12 weeks",
      },
      {
        step: 3,
        description: "Select the predicted adult breed size (e.g., Medium).",
        calculation: "Breed size factor = 2.8 (for Medium breed at 12 weeks)",
      },
      {
        step: 4,
        description: "Calculate RER and multiply by growth factor to get daily calorie needs.",
        calculation: "RER = 70 × (6.5^0.75) ≈ 293 kcal; Puppy PER = 293 × 2.8 ≈ 820 kcal/day",
      },
    ],
  };

  const faq = (
    <>
      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
        Why does puppy calorie need vary by breed size?
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        Larger breeds grow for a longer period and require more energy to support their rapid development compared to smaller breeds. This is why the growth factor changes based on predicted adult size.
      </p>

      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
        How often should I recalculate my puppy's calorie needs?
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        Puppies grow quickly, so it's recommended to recalculate calorie needs every few weeks or when you notice significant weight changes to ensure proper nutrition.
      </p>

      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
        Can I use this calculator for adult dogs?
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        No, this calculator is specifically designed for puppies. Adult dogs have different energy requirements and should use calculators tailored for adult maintenance energy needs.
      </p>

      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
        What if my puppy is very active or less active than average?
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        This calculator provides an average estimate. For highly active or less active puppies, consult your veterinarian to adjust calorie intake accordingly.
      </p>

      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
        Is this calculator suitable for mixed breed puppies?
      </h3>
      <p className="text-slate-700 dark:text-slate-300 mb-4">
        Yes, but you should estimate the adult size based on the predominant breed characteristics or consult a vet for a more accurate assessment.
      </p>
    </>
  );

  const references = (
    <ul className="space-y-4">
      <li className="flex items-start gap-3">
        <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
        <div>
          <a
            href="https://www.nap.edu/read/10668/chapter/9"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Nutrient Requirements of Dogs and Cats (NRC, 2006)
          </a>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            Authoritative guidelines on canine nutrition including energy requirements for puppies by age and breed size.
          </p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
        <div>
          <a
            href="https://www.aafco.org/Standards-and-Documents/Guidelines"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            AAFCO Dog Food Nutrient Profiles
          </a>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            Official nutrient profiles and feeding guidelines for dogs including growth and reproduction stages.
          </p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
        <div>
          <a
            href="https://vcahospitals.com/know-your-pet/pet-nutrition-for-puppies"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            VCA Hospitals: Pet Nutrition for Puppies
          </a>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            Practical advice on feeding puppies for healthy growth and development.
          </p>
        </div>
      </li>
      <li className="flex items-start gap-3">
        <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
        <div>
          <a
            href="https://www.petmd.com/dog/nutrition/evr_dg_how_much_should_i_feed_my_puppy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            PetMD: How Much Should I Feed My Puppy?
          </a>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
            Guidelines on puppy feeding amounts based on weight, age, and breed size.
          </p>
        </div>
      </li>
    </ul>
  );

  const relatedCalculators = [
    {
      title: "Dog Calorie Needs RER & MER Calculator",
      href: "/dog-calorie-needs-rer-mer",
    },
    {
      title: "Dog Ideal Weight & Target Calories Calculator",
      href: "/dog-ideal-weight-target-calories",
    },
    {
      title: "Dog Treat Calories Daily Allowance Calculator",
      href: "/dog-treat-calories-daily-allowance",
    },
    {
      title: "Puppy Growth Rate & Weight Estimator",
      href: "/puppy-growth-rate-weight-estimator",
    },
    {
      title: "Cat Calorie Needs Calculator",
      href: "/cat-calorie-needs",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why does puppy calorie need vary by breed size?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Larger breeds grow for a longer period and require more energy to support their rapid development compared to smaller breeds. This is why the growth factor changes based on predicted adult size.",
        },
      },
      {
        "@type": "Question",
        name: "How often should I recalculate my puppy's calorie needs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Puppies grow quickly, so it's recommended to recalculate calorie needs every few weeks or when you notice significant weight changes to ensure proper nutrition.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this calculator for adult dogs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No, this calculator is specifically designed for puppies. Adult dogs have different energy requirements and should use calculators tailored for adult maintenance energy needs.",
        },
      },
      {
        "@type": "Question",
        name: "What if my puppy is very active or less active than average?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "This calculator provides an average estimate. For highly active or less active puppies, consult your veterinarian to adjust calorie intake accordingly.",
        },
      },
      {
        "@type": "Question",
        name: "Is this calculator suitable for mixed breed puppies?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes, but you should estimate the adult size based on the predominant breed characteristics or consult a vet for a more accurate assessment.",
        },
      },
    ],
  };

  return (
    <CalculatorVerticalLayout
      title="Puppy Calorie Needs by Age and Breed Size Calculator"
      description="Calculate the specific energy needs for puppies based on their current age and predicted adult breed size for optimal growth."
      widget={widget}
      editorial={editorial}
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
      jsonLd={jsonLd}
      icon={<Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default PuppyCalorieNeedsAgeBreedSizeCalculator;