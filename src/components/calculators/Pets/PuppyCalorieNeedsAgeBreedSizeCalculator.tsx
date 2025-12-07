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
  const [weightKg, setWeightKg] = useState<string>("");

  const resultsRef = useRef<HTMLDivElement>(null);

  // Breed size factors for MER multipliers for puppies by age group (approximate)
  // Source: National Research Council, AAFCO, and general vet nutrition guidelines
  // MER multipliers relative to RER for puppies by age and breed size:
  // Age < 8 weeks: 3.0 (all sizes)
  // Age 8-12 weeks: small=3.0, medium=3.0, large=2.5
  // Age 12-16 weeks: small=2.5, medium=2.5, large=2.0
  // Age >16 weeks: small=2.0, medium=2.0, large=1.8 (approaching adult MER)

  // Clamp age to positive number, max 26 weeks (6 months)
  const age = useMemo(() => {
    const n = Number(ageWeeks);
    if (isNaN(n) || n <= 0) return 0;
    if (n > 26) return 26;
    return n;
  }, [ageWeeks]);

  // Weight in kg must be positive
  const weight = useMemo(() => {
    const w = Number(weightKg);
    if (isNaN(w) || w <= 0) return 0;
    return w;
  }, [weightKg]);

  // Calculate RER = 70 * weight^0.75
  const rer = useMemo(() => {
    if (weight <= 0) return 0;
    return 70 * Math.pow(weight, 0.75);
  }, [weight]);

  // Determine MER multiplier based on age and breed size
  const merMultiplier = useMemo(() => {
    if (age === 0) return 0;
    if (age < 8) return 3.0;
    if (age >= 8 && age < 12) {
      if (breedSize === "large") return 2.5;
      return 3.0;
    }
    if (age >= 12 && age < 16) {
      if (breedSize === "large") return 2.0;
      return 2.5;
    }
    // age >= 16 weeks
    if (breedSize === "large") return 1.8;
    return 2.0;
  }, [age, breedSize]);

  // Calculate MER = RER * multiplier
  const mer = useMemo(() => {
    if (rer === 0 || merMultiplier === 0) return 0;
    return rer * merMultiplier;
  }, [rer, merMultiplier]);

  // Scroll to results on calculate
  const onCalculate = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Format kcal output
  const formatKcal = (val: number) =>
    val > 0 ? val.toFixed(0) + " kcal/day" : "—";

  // Widget JSX
  const widget = (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Puppy Calorie Needs Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="ageWeeks" className="text-slate-700 dark:text-slate-300">
            Puppy Age (weeks)
          </Label>
          <Input
            id="ageWeeks"
            type="number"
            min={1}
            max={26}
            placeholder="e.g. 10"
            value={ageWeeks}
            onChange={(e) => setAgeWeeks(e.target.value)}
            aria-describedby="ageHelp"
          />
          <p id="ageHelp" className="text-sm text-slate-500 dark:text-slate-400">
            Enter the puppy's current age in weeks (1 to 26).
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="breedSize" className="text-slate-700 dark:text-slate-300">
            Predicted Adult Breed Size
          </Label>
          <select
            id="breedSize"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            value={breedSize}
            onChange={(e) =>
              setBreedSize(e.target.value as "small" | "medium" | "large")
            }
          >
            <option value="small">Small (under 20 lbs / 9 kg)</option>
            <option value="medium">Medium (20–50 lbs / 9–23 kg)</option>
            <option value="large">Large (over 50 lbs / 23+ kg)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weightKg" className="text-slate-700 dark:text-slate-300">
            Current Puppy Weight (kg)
          </Label>
          <Input
            id="weightKg"
            type="number"
            min={0.1}
            step={0.1}
            placeholder="e.g. 5.5"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            aria-describedby="weightHelp"
          />
          <p id="weightHelp" className="text-sm text-slate-500 dark:text-slate-400">
            Enter the puppy's current weight in kilograms.
          </p>
        </div>

        <Button onClick={onCalculate} disabled={age === 0 || weight === 0}>
          Calculate
        </Button>

        <div ref={resultsRef} aria-live="polite" className="pt-4">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Results
          </h3>
          {age === 0 || weight === 0 ? (
            <p className="text-slate-700 dark:text-slate-300">
              Please enter valid age and weight to see calorie needs.
            </p>
          ) : (
            <div className="space-y-2 text-slate-900 dark:text-slate-100">
              <p>
                <strong>Resting Energy Requirement (RER): </strong>
                {rer.toFixed(0)} kcal/day
              </p>
              <p>
                <strong>
                  Maintenance Energy Requirement (MER) multiplier:
                </strong>{" "}
                {merMultiplier.toFixed(2)} × RER
              </p>
              <p className="text-lg font-bold">
                Estimated Daily Calorie Needs: {formatKcal(mer)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-10">
      <section id="how-it-works" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          How this calculator works
        </h2>
        <p className="text-base text-slate-700 dark:text-slate-300">
          This calculator estimates the daily calorie needs of a growing puppy
          based on their current age in weeks, weight, and predicted adult breed
          size. Puppies have higher energy requirements than adult dogs to support
          rapid growth and development. By inputting these details, the calculator
          uses established veterinary nutrition formulas to provide an estimate of
          the calories your puppy needs each day for optimal growth.
        </p>
        <p className="text-base text-slate-700 dark:text-slate-300">
          The calculation first determines the Resting Energy Requirement (RER),
          which is the energy needed for basic bodily functions at rest. Then, it
          applies a multiplier based on the puppy’s age and expected adult size to
          estimate the Maintenance Energy Requirement (MER), reflecting the total
          daily energy expenditure including growth and activity.
        </p>
      </section>

      <section id="domain-rules" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Key concepts and domain rules
        </h2>
        <p className="text-base text-slate-700 dark:text-slate-300">
          <strong>Resting Energy Requirement (RER):</strong> The baseline energy
          needed for vital functions, calculated as 70 × (weight in kg)<sup>0.75</sup>.
        </p>
        <p className="text-base text-slate-700 dark:text-slate-300">
          <strong>Maintenance Energy Requirement (MER):</strong> The total daily
          calories required, including growth and activity, calculated by
          multiplying RER by an age- and breed size-specific factor.
        </p>
        <p className="text-base text-slate-700 dark:text-slate-300">
          <strong>Age and breed size multipliers:</strong> Puppies require more
          calories per kg of body weight than adults. Younger puppies and smaller
          breeds generally have higher multipliers to support faster growth rates.
          These multipliers decrease as the puppy approaches adulthood.
        </p>
        <p className="text-base text-slate-700 dark:text-slate-300">
          <strong>Weight input:</strong> Accurate current weight is essential for
          reliable calorie estimates. We recommend weighing your puppy regularly.
        </p>
      </section>

      <section id="worked-example" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Worked example
        </h2>
        <p className="text-base text-slate-700 dark:text-slate-300">
          <em>Scenario:</em> A 10-week-old medium breed puppy currently weighs 5.5
          kg. What are their estimated daily calorie needs?
        </p>
        <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Calculate RER:</strong> 70 × (5.5)<sup>0.75</sup> = 70 × 3.34 =
            234 kcal/day
          </li>
          <li>
            <strong>Determine MER multiplier:</strong> For a 10-week medium breed
            puppy, multiplier = 3.0
          </li>
          <li>
            <strong>Calculate MER:</strong> 234 × 3.0 = 702 kcal/day
          </li>
        </ol>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Result: The puppy needs approximately 700 kcal per day for healthy growth.
        </p>
      </section>

      <section id="faq" className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Why does the calorie multiplier change with age and breed size?
            </dt>
            <dd className="text-base text-slate-700 dark:text-slate-300">
              Puppies grow at different rates depending on their breed size. Smaller
              breeds mature faster and have higher energy needs early on, while
              larger breeds grow more slowly and require slightly fewer calories per
              kg as they age.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              How often should I update my puppy’s weight in the calculator?
            </dt>
            <dd className="text-base text-slate-700 dark:text-slate-300">
              We recommend weighing your puppy every 1–2 weeks during rapid growth
              phases and updating the calculator accordingly to ensure accurate
              calorie estimates.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Can I use this calculator for adult dogs?
            </dt>
            <dd className="text-base text-slate-700 dark:text-slate-300">
              No, this calculator is specifically designed for puppies up to 26 weeks
              old. For adult dogs, use a maintenance calorie calculator tailored to
              adult life stages.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              What if my puppy’s breed size is uncertain?
            </dt>
            <dd className="text-base text-slate-700 dark:text-slate-300">
              If unsure, choose the breed size category that best matches your puppy’s
              expected adult weight range or consult your veterinarian for guidance.
            </dd>
          </div>
          <div>
            <dt className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
              Does this calculator consider activity level?
            </dt>
            <dd className="text-base text-slate-700 dark:text-slate-300">
              This calculator uses average multipliers that include typical activity
              for puppies. If your puppy is unusually active or inactive, calorie
              needs may vary.
            </dd>
          </div>
        </dl>
      </section>

      <section id="disclaimer" className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          Disclaimer
        </h2>
        <p className="text-base text-slate-700 dark:text-slate-300">
          This calculator provides general estimates for puppy calorie needs based
          on typical growth patterns and breed sizes. It is intended for
          informational purposes only and does not replace professional veterinary
          advice. Always consult your veterinarian for personalized feeding
          recommendations and health assessments.
        </p>
      </section>

      <section id="references" className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
          References &amp; Further Reading
        </h2>
        <ul className="list-none space-y-4">
          <li className="flex items-start space-x-2">
            <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.aafco.org/Portals/0/SiteContent/Regulatory/Committees/Pet-Food/2019-Pet-Food-Guide.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                AAFCO Official Publication 2019
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Nutritional guidelines and energy requirements for dogs and puppies.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-2">
            <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.merckvetmanual.com/nutrition/feeding-the-growing-puppy/energy-requirements"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Merck Veterinary Manual: Energy Requirements of Puppies
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Detailed explanation of energy needs during puppy growth stages.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-2">
            <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://vcahospitals.com/know-your-pet/feeding-your-puppy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                VCA Hospitals: Feeding Your Puppy
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Practical feeding advice and calorie considerations for puppies.
              </p>
            </div>
          </li>
          <li className="flex items-start space-x-2">
            <BookOpen className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
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
                Guidelines on puppy feeding amounts and calorie needs by age and size.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  // On this page anchors
  const onThisPage = [
    { href: "#how-it-works", label: "How this calculator works" },
    { href: "#domain-rules", label: "Key concepts and domain rules" },
    { href: "#worked-example", label: "Worked example" },
    { href: "#faq", label: "FAQ" },
    { href: "#disclaimer", label: "Disclaimer" },
    { href: "#references", label: "References & Further Reading" },
  ];

  // Formula object
  const formula = {
    title: "Core formulas used",
    formulas: [
      {
        formula: "RER = 70 × (weight in kg)^0.75",
        description:
          "Resting Energy Requirement (RER) is the baseline energy needed for vital functions.",
      },
      {
        formula:
          "MER = RER × multiplier (based on puppy age and predicted adult breed size)",
        description:
          "Maintenance Energy Requirement (MER) accounts for growth and activity energy needs.",
      },
      {
        formula:
          "Multipliers vary by age and breed size, e.g., 3.0 for puppies under 8 weeks, decreasing as they mature.",
        description:
          "These multipliers reflect the higher energy demands of growing puppies.",
      },
    ],
  };

  // Worked example object
  const example = {
    title: "Example: 10-week-old medium breed puppy",
    scenario:
      "A 10-week-old medium breed puppy weighing 5.5 kg needs an estimate of daily calorie intake.",
    steps: [
      {
        step: 1,
        description: "Calculate RER",
        calculation: "70 × (5.5)^0.75 = 234 kcal/day",
      },
      {
        step: 2,
        description: "Determine MER multiplier",
        calculation: "3.0 for 10-week medium breed puppy",
      },
      {
        step: 3,
        description: "Calculate MER",
        calculation: "234 × 3.0 = 702 kcal/day",
      },
    ],
    result:
      "The puppy requires approximately 700 kcal per day to support healthy growth.",
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
      title: "Puppy Weight Gain Planner",
      url: "/pets/dogs-nutrition-weight/puppy-weight-gain-planner",
      icon: "🐕",
    },
    {
      title: "Adult Dog Calorie Needs Calculator",
      url: "/pets/dogs-nutrition-weight/adult-dog-calorie-needs",
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
        name: "Why does the calorie multiplier change with age and breed size?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Puppies grow at different rates depending on their breed size. Smaller breeds mature faster and have higher energy needs early on, while larger breeds grow more slowly and require slightly fewer calories per kg as they age.",
        },
      },
      {
        "@type": "Question",
        name: "How often should I update my puppy’s weight in the calculator?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "We recommend weighing your puppy every 1–2 weeks during rapid growth phases and updating the calculator accordingly to ensure accurate calorie estimates.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this calculator for adult dogs?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No, this calculator is specifically designed for puppies up to 26 weeks old. For adult dogs, use a maintenance calorie calculator tailored to adult life stages.",
        },
      },
      {
        "@type": "Question",
        name: "What if my puppy’s breed size is uncertain?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "If unsure, choose the breed size category that best matches your puppy’s expected adult weight range or consult your veterinarian for guidance.",
        },
      },
      {
        "@type": "Question",
        name: "Does this calculator consider activity level?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "This calculator uses average multipliers that include typical activity for puppies. If your puppy is unusually active or inactive, calorie needs may vary.",
        },
      },
    ],
  };

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