import { useState, useMemo, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Calculator, Dog, Activity, Info, BookOpen } from "lucide-react";

function PuppyCalorieNeedsAgeBreedSizeCalculator() {
  // Inputs: age in weeks, predicted adult breed size (small, medium, large)
  const [ageWeeks, setAgeWeeks] = useState<string>("");
  const [breedSize, setBreedSize] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  // Clamp and parse inputs
  const age = useMemo(() => {
    const val = Number(ageWeeks);
    if (isNaN(val) || val < 1) return 1;
    if (val > 52) return 52;
    return val;
  }, [ageWeeks]);

  // Predicted adult weight (kg) by breed size category (approximate averages)
  // Small: 5-10 kg, Medium: 15-25 kg, Large: 30-45 kg
  const predictedAdultWeight = useMemo(() => {
    switch (breedSize) {
      case "small":
        return 7.5;
      case "medium":
        return 20;
      case "large":
        return 37.5;
      default:
        return 20;
    }
  }, [breedSize]);

  // Puppy Energy Requirement (PER) calculation based on NRC and common veterinary nutrition sources:
  // PER (kcal/day) = 3 × RER
  // RER = 70 × (weight in kg)^0.75
  // Puppy weight estimated by age and adult weight using growth curves:
  // Approximate % adult weight by age in weeks:
  // 4 weeks: 10%, 8 weeks: 25%, 12 weeks: 40%, 16 weeks: 55%, 20 weeks: 70%, 24 weeks: 85%, 52 weeks: 100%
  // Linear interpolation between points for smooth estimate.

  const percentAdultWeightByAge = useMemo(() => {
    // Age breakpoints and % adult weight
    const points = [
      { w: 4, p: 0.10 },
      { w: 8, p: 0.25 },
      { w: 12, p: 0.40 },
      { w: 16, p: 0.55 },
      { w: 20, p: 0.70 },
      { w: 24, p: 0.85 },
      { w: 52, p: 1.0 },
    ];

    if (age <= 4) return 0.10;
    if (age >= 52) return 1.0;

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (age >= p1.w && age <= p2.w) {
        // Linear interpolate
        const ratio = (age - p1.w) / (p2.w - p1.w);
        return p1.p + ratio * (p2.p - p1.p);
      }
    }
    return 1.0;
  }, [age]);

  const estimatedPuppyWeight = useMemo(() => {
    return predictedAdultWeight * percentAdultWeightByAge;
  }, [predictedAdultWeight, percentAdultWeightByAge]);

  const RER = useMemo(() => {
    if (estimatedPuppyWeight <= 0) return 0;
    return 70 * Math.pow(estimatedPuppyWeight, 0.75);
  }, [estimatedPuppyWeight]);

  const PER = useMemo(() => {
    // NRC suggests 3x RER for growing puppies
    return RER * 3;
  }, [RER]);

  // Scroll to results on calculate
  const onCalculate = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Format kcal with commas and no decimals
  const formatKcal = (val: number) => {
    if (val <= 0 || isNaN(val)) return "0";
    return Math.round(val).toLocaleString();
  };

  // onThisPage anchors
  const onThisPage = [
    { href: "#how-it-works", title: "How this calculator works" },
    { href: "#domain-rules", title: "Key concepts & domain rules" },
    { href: "#worked-example", title: "Worked example" },
    { href: "#faq", title: "FAQ" },
    { href: "#disclaimer", title: "Disclaimer" },
    { href: "#references", title: "References & further reading" },
  ];

  // Formula object
  const formula = {
    title: "Core formulas used in this calculator",
    formulas: [
      {
        formula: "RER = 70 × (weight in kg)^0.75",
        description:
          "Resting Energy Requirement (RER) estimates the energy needed at rest.",
      },
      {
        formula: "PER = 3 × RER",
        description:
          "Puppy Energy Requirement (PER) is approximately three times RER to support growth.",
      },
      {
        formula:
          "Estimated Puppy Weight = Predicted Adult Weight × % Adult Weight by Age",
        description:
          "Puppy weight is estimated as a percentage of predicted adult weight based on age.",
      },
    ],
  };

  // Worked example object
  const example = {
    title: "Calculating calorie needs for a 10-week-old medium breed puppy",
    scenario:
      "You have a 10-week-old puppy expected to grow into a medium-sized dog (~20 kg adult weight). You want to estimate daily calorie needs for optimal growth.",
    steps: [
      {
        step: 1,
        description:
          "Estimate puppy weight as a percentage of adult weight at 10 weeks. Between 8 weeks (25%) and 12 weeks (40%), interpolate:",
        calculation:
          "≈ 25% + ((10 - 8) / (12 - 8)) × (40% - 25%) = 25% + 0.5 × 15% = 32.5%",
      },
      {
        step: 2,
        description:
          "Calculate estimated puppy weight: 20 kg × 32.5% = 6.5 kg",
        calculation: "20 × 0.325 = 6.5 kg",
      },
      {
        step: 3,
        description:
          "Calculate Resting Energy Requirement (RER): 70 × (6.5)^0.75",
        calculation: "70 × 3.75 ≈ 262.5 kcal/day",
      },
      {
        step: 4,
        description:
          "Calculate Puppy Energy Requirement (PER): 3 × RER = 3 × 262.5",
        calculation: "3 × 262.5 = 787.5 kcal/day",
      },
    ],
    result:
      "The puppy needs approximately 788 kcal per day to support healthy growth at 10 weeks old.",
  };

  // Related calculators
  const relatedCalculators = [
    {
      title: "Dog Ideal Weight Calculator",
      url: "/pets/dogs-nutrition-weight/dog-ideal-weight",
      icon: "🐶",
    },
    {
      title: "Dog Treat Calories Daily Allowance Calculator",
      url: "/pets/dogs-nutrition-weight/dog-treat-calories-daily-allowance",
      icon: "🍖",
    },
    {
      title: "Dog Weight Loss Planner",
      url: "/pets/dogs-nutrition-weight/dog-weight-loss-planner",
      icon: "🐕‍🦺",
    },
    {
      title: "Cat Calorie Needs Calculator",
      url: "/pets/cats-nutrition-weight/cat-calorie-needs",
      icon: "🐱",
    },
    {
      title: "Puppy Growth Rate Calculator",
      url: "/pets/dogs-nutrition-weight/puppy-growth-rate",
      icon: "🐾",
    },
  ];

  // JSON-LD FAQPage structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why is it important to calculate calorie needs for puppies?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Puppies have higher energy needs than adult dogs to support rapid growth and development. Calculating calorie needs helps ensure they receive adequate nutrition without overfeeding.",
        },
      },
      {
        "@type": "Question",
        name: "How does predicted adult breed size affect calorie needs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Larger breed puppies grow for longer periods and require more calories overall. This calculator adjusts calorie needs based on predicted adult size to optimize growth.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this calculator for puppies younger than 4 weeks?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "This calculator is designed for puppies aged 4 weeks and older. For neonates younger than 4 weeks, specialized feeding guidelines from a veterinarian should be followed.",
        },
      },
      {
        "@type": "Question",
        name: "What if my puppy’s growth rate differs from the estimate?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Individual puppies may grow faster or slower than average. Regular veterinary check-ups and weight monitoring are important to adjust feeding as needed.",
        },
      },
    ],
  };

  // Widget: form + results
  const widget = (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Puppy Calorie Needs Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="ageWeeks" className="text-slate-700 dark:text-slate-300">
              Puppy Age (weeks)
            </Label>
            <Input
              id="ageWeeks"
              type="number"
              min={1}
              max={52}
              step={1}
              placeholder="Enter puppy age in weeks"
              value={ageWeeks}
              onChange={(e) => setAgeWeeks(e.target.value)}
              className="mt-1"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter age between 1 and 52 weeks.
            </p>
          </div>

          <div>
            <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
              Predicted Adult Breed Size
            </Label>
            <select
              id="breedSize"
              value={breedSize}
              onChange={(e) =>
                setBreedSize(e.target.value as "small" | "medium" | "large")
              }
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="small">Small (5-10 kg)</option>
              <option value="medium">Medium (15-25 kg)</option>
              <option value="large">Large (30-45 kg)</option>
            </select>
          </div>

          <Button onClick={onCalculate} className="w-full" variant="default" size="lg" type="button">
            Calculate
          </Button>
        </CardContent>
      </Card>

      <Card ref={resultsRef} className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Estimated Daily Calorie Needs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-slate-700 dark:text-slate-300 text-base">
          <p>
            <strong>Estimated Puppy Weight:</strong>{" "}
            {estimatedPuppyWeight.toFixed(2)} kg
          </p>
          <p>
            <strong>Resting Energy Requirement (RER):</strong>{" "}
            {formatKcal(RER)} kcal/day
          </p>
          <p>
            <strong>Puppy Energy Requirement (PER):</strong>{" "}
            {formatKcal(PER)} kcal/day
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This is the estimated number of calories your puppy needs daily to
            support healthy growth.
          </p>
        </CardContent>
      </Card>
    </>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-10">
      <section id="how-it-works" className="prose prose-slate dark:prose-invert max-w-none">
        <h2>How this calculator works</h2>
        <p>
          This calculator estimates the daily calorie needs of puppies based on their current age in weeks and predicted adult breed size. Puppies require more energy than adult dogs to support rapid growth, development, and increased activity levels. By estimating the puppy’s current weight as a percentage of their predicted adult weight, we calculate their Resting Energy Requirement (RER) and then multiply it by a factor to estimate the Puppy Energy Requirement (PER).
        </p>
        <p>
          The inputs you provide—age and breed size—help tailor the calorie estimate to your puppy’s unique growth stage and expected adult size, ensuring optimal nutrition for healthy development.
        </p>
      </section>

      <section id="domain-rules" className="prose prose-slate dark:prose-invert max-w-none">
        <h2>Key concepts & domain rules</h2>
        <p>
          <strong>Resting Energy Requirement (RER)</strong> is the baseline energy your puppy needs at rest to maintain vital body functions. It is calculated using the formula: <em>RER = 70 × (weight in kg)^0.75</em>.
        </p>
        <p>
          <strong>Puppy Energy Requirement (PER)</strong> is higher than RER because puppies are growing and more active. Veterinary nutrition guidelines commonly use a multiplier of 3 times RER to estimate PER.
        </p>
        <p>
          <strong>Growth curves</strong> estimate puppy weight as a percentage of their predicted adult weight at different ages. This calculator uses typical growth percentages to estimate current weight from predicted adult size and age.
        </p>
        <p>
          Note that individual puppies may vary in growth rate and energy needs. Regular veterinary check-ups and weight monitoring are essential to adjust feeding amounts appropriately.
        </p>
      </section>

      <section id="worked-example" className="prose prose-slate dark:prose-invert max-w-none">
        <h2>Worked example</h2>
        <p>{example.scenario}</p>
        <ol className="list-decimal list-inside space-y-4">
          {example.steps.map(({ step, description, calculation }) => (
            <li key={step}>
              <p>{description}</p>
              <p className="font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm">{calculation}</p>
            </li>
          ))}
        </ol>
        <p className="font-semibold">{example.result}</p>
      </section>

      <section id="faq" className="prose prose-slate dark:prose-invert max-w-none">
        <h2>FAQ</h2>
        <dl className="space-y-6">
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Why is it important to calculate calorie needs for puppies?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Puppies have higher energy needs than adult dogs to support rapid growth and development. Calculating calorie needs helps ensure they receive adequate nutrition without overfeeding.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              How does predicted adult breed size affect calorie needs?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Larger breed puppies grow for longer periods and require more calories overall. This calculator adjusts calorie needs based on predicted adult size to optimize growth.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Can I use this calculator for puppies younger than 4 weeks?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              This calculator is designed for puppies aged 4 weeks and older. For neonates younger than 4 weeks, specialized feeding guidelines from a veterinarian should be followed.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              What if my puppy’s growth rate differs from the estimate?
            </dt>
            <dd className="text-slate-700 dark:text-slate-300">
              Individual puppies may grow faster or slower than average. Regular veterinary check-ups and weight monitoring are important to adjust feeding as needed.
            </dd>
          </div>
        </dl>
      </section>

      <section id="disclaimer" className="prose prose-slate dark:prose-invert max-w-none">
        <h2>Disclaimer</h2>
        <p>
          This calculator provides general estimates for puppy calorie needs based on typical growth patterns and breed sizes. It is intended for educational purposes only and does not replace professional veterinary advice. Always consult your veterinarian for personalized feeding recommendations and health assessments.
        </p>
      </section>

      <section id="references" className="prose prose-slate dark:prose-invert max-w-none">
        <h2>References &amp; further reading</h2>
        <ul className="space-y-4">
          <li className="flex items-start space-x-2">
            <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.nal.usda.gov/legacy/fnic/growth-standards-puppies"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                USDA Nutrient Requirements of Dogs and Cats
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Official guidelines on nutrient requirements including energy needs for growing puppies.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-2">
            <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition_guidelines_final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                American Animal Hospital Association (AAHA) Canine Nutrition Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Comprehensive nutrition recommendations for puppies and adult dogs.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-2">
            <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://vcahospitals.com/know-your-pet/nutrition-for-puppies"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                VCA Hospitals: Nutrition for Puppies
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Practical advice on feeding puppies for healthy growth and development.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-2">
            <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.merckvetmanual.com/nutrition/nutrition-of-the-growing-puppy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Merck Veterinary Manual: Nutrition of the Growing Puppy
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Authoritative veterinary resource covering puppy nutritional needs and growth.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
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
      icon={<Dog className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default PuppyCalorieNeedsAgeBreedSizeCalculator;