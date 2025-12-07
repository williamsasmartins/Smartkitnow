import { useState, useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function PuppyCalorieNeedsAgeBreedSizeCalculator() {
  const [weightKg, setWeightKg] = useState("");
  const [ageWeeks, setAgeWeeks] = useState("");
  const [breedSize, setBreedSize] = useState("medium");
  const [result, setResult] = useState<number | null>(null);
  const [showFAQ, setShowFAQ] = useState<Record<number, boolean>>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  // Breed size multipliers for MER factor based on age in weeks
  // Source: Adapted from NRC and WSAVA guidelines for puppy energy needs
  const breedSizeFactors = {
    small: [
      { maxAge: 8, factor: 3.0 },
      { maxAge: 12, factor: 2.5 },
      { maxAge: 16, factor: 2.0 },
      { maxAge: 26, factor: 1.8 },
      { maxAge: Infinity, factor: 1.6 },
    ],
    medium: [
      { maxAge: 8, factor: 3.5 },
      { maxAge: 12, factor: 3.0 },
      { maxAge: 16, factor: 2.5 },
      { maxAge: 26, factor: 2.0 },
      { maxAge: Infinity, factor: 1.8 },
    ],
    large: [
      { maxAge: 8, factor: 4.0 },
      { maxAge: 12, factor: 3.5 },
      { maxAge: 16, factor: 3.0 },
      { maxAge: 26, factor: 2.5 },
      { maxAge: Infinity, factor: 2.0 },
    ],
    giant: [
      { maxAge: 8, factor: 4.5 },
      { maxAge: 12, factor: 4.0 },
      { maxAge: 16, factor: 3.5 },
      { maxAge: 26, factor: 3.0 },
      { maxAge: Infinity, factor: 2.5 },
    ],
  };

  // Calculate Resting Energy Requirement (RER)
  // RER = 70 * (weight in kg)^0.75
  function calculateRER(weight: number) {
    return 70 * Math.pow(weight, 0.75);
  }

  // Get MER factor based on breed size and age
  function getMERFactor(age: number, size: string) {
    const factors = breedSizeFactors[size as keyof typeof breedSizeFactors];
    for (const entry of factors) {
      if (age <= entry.maxAge) return entry.factor;
    }
    return 2.0; // fallback
  }

  // Calculate Puppy Calorie Needs (MER)
  // MER = RER * factor (based on age and breed size)
  const calorieNeeds = useMemo(() => {
    const w = parseFloat(weightKg);
    const a = parseInt(ageWeeks);
    if (isNaN(w) || w <= 0 || isNaN(a) || a <= 0) return null;
    const rer = calculateRER(w);
    const factor = getMERFactor(a, breedSize);
    return Math.round(rer * factor);
  }, [weightKg, ageWeeks, breedSize]);

  function onCalculate() {
    setResult(calorieNeeds);
    if (resultsRef.current) {
      window.scrollTo({
        top: resultsRef.current.offsetTop - 20,
        behavior: "smooth",
      });
    }
  }

  const toggleFAQ = (index: number) => {
    setShowFAQ((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const onThisPage = [
    { id: "how-to-use", label: "How to Use This Calculator" },
    { id: "understanding-results", label: "Understanding the Results" },
    { id: "formula-explanation", label: "Formula Explanation" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "references", label: "References" },
  ];

  const editorial = (
    <>
      <section id="how-to-use" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          Enter your puppy's current weight in kilograms and their age in weeks. Select the predicted adult breed size category to estimate the daily calorie needs for optimal growth. This calculator uses breed size and age-specific multipliers to adjust energy requirements.
        </p>
      </section>

      <section id="understanding-results" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Understanding the Results
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          The result shows the estimated daily calorie needs (in kilocalories) for your puppy based on their current weight, age, and expected adult size. This value helps guide feeding amounts to support healthy growth without overfeeding or underfeeding.
        </p>
      </section>

      <section id="formula-explanation" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Formula Explanation
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          The calculator uses the Resting Energy Requirement (RER) formula combined with a multiplier factor that varies by breed size and age. RER estimates the energy needed at rest, and the multiplier adjusts for growth and activity levels typical of puppies.
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Frequently Asked Questions
        </h2>

        {[

          {
            question: "Why does breed size affect calorie needs?",
            answer:
              "Larger breed puppies grow for a longer period and have higher energy demands during growth phases compared to smaller breeds. The multiplier adjusts for these differences to provide accurate calorie estimates.",
          },
          {
            question: "Can I use this calculator for adult dogs?",
            answer:
              "No, this calculator is specifically designed for puppies. Adult dogs have different energy requirements and should use an adult dog calorie calculator.",
          },
          {
            question: "What if I don’t know my puppy’s predicted adult size?",
            answer:
              "If unsure, select the breed size that most closely matches your puppy’s breed or expected adult weight. When in doubt, consult your veterinarian for guidance.",
          },
          {
            question: "How often should I recalculate as my puppy grows?",
            answer:
              "It’s recommended to update the weight and age inputs every few weeks to adjust feeding amounts as your puppy grows and their energy needs change.",
          },
        ].map(({ question, answer }, i) => (
          <div key={i} className="mb-6">
            <h3
              className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center cursor-pointer select-none"
              onClick={() => toggleFAQ(i)}
              aria-expanded={!!showFAQ[i]}
              aria-controls={`faq-answer-${i}`}
            >
              {question}
              {showFAQ[i] ? (
                <ChevronUp className="ml-2 h-5 w-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronDown className="ml-2 h-5 w-5 text-slate-600 dark:text-slate-400" />
              )}
            </h3>
            {showFAQ[i] && (
              <p
                id={`faq-answer-${i}`}
                className="text-slate-700 dark:text-slate-300 mt-2"
              >
                {answer}
              </p>
            )}
          </div>
        ))}
      </section>

      <section id="references" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          References
        </h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.merckvetmanual.com/nutrition/energy-requirements-of-animals/energy-requirements-of-dogs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Merck Veterinary Manual: Energy Requirements of Dogs
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Comprehensive overview of energy needs in dogs including puppies, with formulas and factors affecting calorie requirements.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://wsava.org/wp-content/uploads/2020/01/WSAVA-Nutrition-Guidelines-2019.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Global Nutrition Guidelines for Dogs and Cats
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Authoritative guidelines on nutritional needs for dogs including growth stages and breed size considerations.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines-for-dogs-and-cats.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                AAHA Canine and Feline Nutrition Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Detailed recommendations for feeding puppies based on breed size and developmental stage.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://vcahospitals.com/know-your-pet/puppy-nutrition"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                VCA Hospitals: Puppy Nutrition
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Practical advice on feeding puppies including energy requirements and growth monitoring.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );

  const formula = {
    title: "Key formulas used in this calculator",
    formula: "MER = RER × Factor (based on age and breed size)",
    variables: [
      {
        symbol: "MER",
        name: "Maintenance Energy Requirement",
        description:
          "Estimated daily calorie needs for the puppy to support growth and activity.",
      },
      {
        symbol: "RER",
        name: "Resting Energy Requirement",
        description:
          "Energy required at rest, calculated as 70 × (weight in kg)^0.75.",
      },
      {
        symbol: "Factor",
        name: "Age and Breed Size Multiplier",
        description:
          "A multiplier that adjusts RER based on puppy's age in weeks and predicted adult breed size.",
      },
      {
        symbol: "weight (kg)",
        name: "Current weight in kilograms",
        description: "The puppy's current body weight used to calculate RER.",
      },
      {
        symbol: "age (weeks)",
        name: "Age in weeks",
        description: "The puppy's current age used to select the appropriate multiplier.",
      },
    ],
  };

  const example = {
    title: "Example: Calculating Calorie Needs for a 10-Week-Old Medium Breed Puppy",
    scenario:
      "A 10-week-old puppy weighing 5 kg is expected to be a medium-sized adult dog. We want to estimate the daily calorie needs to support healthy growth.",
    steps: [
      {
        step: 1,
        description: "Calculate the Resting Energy Requirement (RER).",
        calculation: "RER = 70 × 5^0.75 = 70 × 3.34 ≈ 234 kcal",
      },
      {
        step: 2,
        description:
          "Determine the multiplier factor for a medium breed puppy at 10 weeks.",
        calculation: "Factor = 3.0 (from breed size and age table)",
      },
      {
        step: 3,
        description: "Calculate the Maintenance Energy Requirement (MER).",
        calculation: "MER = 234 × 3.0 = 702 kcal",
      },
      {
        step: 4,
        description:
          "Interpret the result as the estimated daily calorie needs for the puppy.",
        calculation: "Daily calorie needs ≈ 700 kcal",
      },
    ],
    result:
      "The 10-week-old medium breed puppy weighing 5 kg requires approximately 700 kilocalories per day to support healthy growth.",
  };

  const relatedCalculators = [
    {
      title: "Dog Calorie Needs RER/MER Calculator",
      url: "/pets/dogs-nutrition/dog-calorie-needs-rer-mer",
      icon: "🐶",
    },
    {
      title: "Dog Ideal Weight & Target Calories Calculator",
      url: "/pets/dogs-nutrition/dog-ideal-weight-target-calories",
      icon: "🐾",
    },
    {
      title: "Dog Treat Calories Daily Allowance Calculator",
      url: "/pets/dogs-nutrition/dog-treat-calories-daily-allowance",
      icon: "🦴",
    },
    {
      title: "Puppy Growth Rate & Weight Tracking Calculator",
      url: "/pets/dogs-nutrition/puppy-growth-rate-weight-tracking",
      icon: "🍼",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why does breed size affect calorie needs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Larger breed puppies grow for a longer period and have higher energy demands during growth phases compared to smaller breeds. The multiplier adjusts for these differences to provide accurate calorie estimates.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this calculator for adult dogs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No, this calculator is specifically designed for puppies. Adult dogs have different energy requirements and should use an adult dog calorie calculator.",
        },
      },
      {
        "@type": "Question",
        name: "What if I don’t know my puppy’s predicted adult size?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "If unsure, select the breed size that most closely matches your puppy’s breed or expected adult weight. When in doubt, consult your veterinarian for guidance.",
        },
      },
      {
        "@type": "Question",
        name: "How often should I recalculate as my puppy grows?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It’s recommended to update the weight and age inputs every few weeks to adjust feeding amounts as your puppy grows and their energy needs change.",
        },
      },
    ],
  };

  const widget = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-6"
      aria-label="Puppy Calorie Needs Calculator Form"
    >
      <div>
        <Label htmlFor="weight" className="mb-2 block font-semibold text-slate-900 dark:text-slate-100">
          Current Weight (kg)
        </Label>
        <Input
          id="weight"
          type="number"
          min="0.1"
          step="0.1"
          placeholder="e.g. 5.0"
          value={weightKg}
          onChange={(e) => setWeightKg(e.target.value)}
          required
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your puppy's current weight in kilograms.
        </p>
      </div>

      <div>
        <Label htmlFor="age" className="mb-2 block font-semibold text-slate-900 dark:text-slate-100">
          Age (weeks)
        </Label>
        <Input
          id="age"
          type="number"
          min="1"
          max="26"
          step="1"
          placeholder="e.g. 10"
          value={ageWeeks}
          onChange={(e) => setAgeWeeks(e.target.value)}
          required
          aria-describedby="age-desc"
        />
        <p id="age-desc" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Enter your puppy's age in weeks (1–26 weeks).
        </p>
      </div>

      <div>
        <Label htmlFor="breedSize" className="mb-2 block font-semibold text-slate-900 dark:text-slate-100">
          Predicted Adult Breed Size
        </Label>
        <select
          id="breedSize"
          value={breedSize}
          onChange={(e) => setBreedSize(e.target.value)}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          aria-describedby="breedSize-desc"
          required
        >
          <option value="small">Small (under 10 kg)</option>
          <option value="medium">Medium (10–25 kg)</option>
          <option value="large">Large (25–45 kg)</option>
          <option value="giant">Giant (over 45 kg)</option>
        </select>
        <p id="breedSize-desc" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Select the expected adult size category of your puppy's breed.
        </p>
      </div>

      <Button type="submit" className="w-full">
        Calculate
      </Button>

      {result !== null && (
        <div
          ref={resultsRef}
          tabIndex={-1}
          aria-live="polite"
          className="mt-6 rounded border border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Estimated Daily Calorie Needs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {result.toLocaleString()} kcal/day
              </p>
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                This is the estimated amount of energy your puppy requires daily to support healthy growth.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </form>
  );

  return (
    <CalculatorVerticalLayout
      title="Puppy Calorie Needs by Age/Breed Size Calculator"
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