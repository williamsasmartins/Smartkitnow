import { useState, useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function PuppyCalorieNeedsAgeBreedSizeCalculator() {
  const [weight, setWeight] = useState("");
  const [ageWeeks, setAgeWeeks] = useState("");
  const [breedSize, setBreedSize] = useState("medium");
  const [calorieNeeds, setCalorieNeeds] = useState<number | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Breed size MER factors for puppies by age range (weeks)
  // Source: NRC Nutrient Requirements of Dogs and Cats, 2006
  // Small breed puppies reach adult size faster, so MER decreases earlier
  // Medium and large breed puppies have different MER factors by age
  // MER = Maintenance Energy Requirement multiplier of RER (Resting Energy Requirement)
  const merFactors = {
    small: [
      { maxAge: 8, factor: 3.0 },
      { maxAge: 12, factor: 2.0 },
      { maxAge: 16, factor: 1.6 },
      { maxAge: 52, factor: 1.4 },
    ],
    medium: [
      { maxAge: 8, factor: 3.0 },
      { maxAge: 12, factor: 2.5 },
      { maxAge: 16, factor: 2.0 },
      { maxAge: 52, factor: 1.6 },
    ],
    large: [
      { maxAge: 8, factor: 3.0 },
      { maxAge: 12, factor: 3.0 },
      { maxAge: 16, factor: 2.5 },
      { maxAge: 52, factor: 2.0 },
    ],
  };

  // Calculate RER = 70 * (weight in kg)^0.75
  // Then multiply by MER factor based on age and breed size
  const calculateCalories = () => {
    const w = parseFloat(weight);
    const age = parseInt(ageWeeks, 10);
    if (isNaN(w) || w <= 0 || isNaN(age) || age <= 0) {
      setCalorieNeeds(null);
      return;
    }
    // Find MER factor for breed size and age
    const factors = merFactors[breedSize];
    let mer = factors[factors.length - 1].factor; // default last factor
    for (const f of factors) {
      if (age <= f.maxAge) {
        mer = f.factor;
        break;
      }
    }
    const rer = 70 * Math.pow(w, 0.75);
    const calories = rer * mer;
    setCalorieNeeds(Math.round(calories));
    if (resultsRef.current) {
      window.scrollTo({
        top: resultsRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const widget = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        calculateCalories();
      }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="weight" className="mb-1 block font-semibold text-slate-900 dark:text-slate-100">
          Current Puppy Weight (kg)
        </Label>
        <Input
          id="weight"
          type="number"
          min="0.1"
          step="0.01"
          placeholder="e.g. 3.5"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="ageWeeks" className="mb-1 block font-semibold text-slate-900 dark:text-slate-100">
          Puppy Age (weeks)
        </Label>
        <Input
          id="ageWeeks"
          type="number"
          min="1"
          max="52"
          placeholder="e.g. 10"
          value={ageWeeks}
          onChange={(e) => setAgeWeeks(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="breedSize" className="mb-1 block font-semibold text-slate-900 dark:text-slate-100">
          Predicted Adult Breed Size
        </Label>
        <select
          id="breedSize"
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          value={breedSize}
          onChange={(e) => setBreedSize(e.target.value)}
          required
        >
          <option value="small">Small (under 10 kg)</option>
          <option value="medium">Medium (10–25 kg)</option>
          <option value="large">Large (over 25 kg)</option>
        </select>
      </div>
      <Button type="submit" className="w-full">
        Calculate Calorie Needs
      </Button>
      {calorieNeeds !== null && (
        <Card ref={resultsRef} className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Estimated Daily Calorie Needs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-700 dark:text-slate-300 text-lg font-medium">
            {calorieNeeds.toLocaleString()} kcal/day
          </CardContent>
        </Card>
      )}
    </form>
  );

  const onThisPage = [
    { id: "how-to-use", label: "How to Use This Calculator" },
    { id: "formulas-theory", label: "Formulas / Theory" },
    { id: "example", label: "Example Calculation" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "disclaimer", label: "Disclaimer" },
    { id: "references", label: "References" },
  ];

  const editorial = (
    <>
      <section id="how-to-use" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This calculator estimates the daily calorie needs of puppies based on their current weight, age in weeks, and predicted adult breed size. It helps pet owners and veterinarians ensure puppies receive adequate nutrition for healthy growth.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Proper calorie intake during puppyhood is crucial to support rapid growth, bone development, and immune system maturation. Overfeeding or underfeeding can lead to health problems later in life.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Use the results to guide feeding amounts and choose appropriate commercial or homemade diets. Always monitor your puppy’s body condition and adjust feeding as needed.
        </p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4">
          <li><strong>Current Puppy Weight (kg):</strong> Enter the puppy’s current weight in kilograms. Use an accurate scale.</li>
          <li><strong>Puppy Age (weeks):</strong> Enter the puppy’s age in weeks. This helps determine energy needs as they grow.</li>
          <li><strong>Predicted Adult Breed Size:</strong> Select the expected adult size category of your puppy’s breed to adjust energy requirements accordingly.</li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300">
          Remember, this tool is educational and does not replace professional veterinary advice. Always consult your veterinarian for personalized feeding recommendations.
        </p>
      </section>

      <section id="formulas-theory" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Formulas / Theory
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          The calculator uses the Resting Energy Requirement (RER) formula to estimate the baseline energy needs of the puppy based on its weight. RER represents the energy required for basic physiological functions at rest.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          To account for the increased energy demands of growth, the RER is multiplied by a Maintenance Energy Requirement (MER) factor. This factor varies depending on the puppy’s age and predicted adult breed size.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The main formula is:
        </p>
        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded text-slate-900 dark:text-slate-100 font-mono text-lg mb-4">
          Calories = RER × MER
        </pre>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Where:
        </p>
        <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-700 mb-4">
          <thead>
            <tr>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 font-semibold">Factor</th>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 font-semibold">Description</th>
              <th className="border border-slate-300 dark:border-slate-700 px-3 py-1 font-semibold">Typical MER Values</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">RER</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Resting Energy Requirement (kcal/day)</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">70 × (weight in kg)^0.75</td>
            </tr>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">MER</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">Maintenance Energy Requirement multiplier for growth</td>
              <td className="border border-slate-300 dark:border-slate-700 px-3 py-1">
                Small breed: 3.0 (≤8w), 2.0 (9-12w), 1.6 (13-16w), 1.4 (adult)<br />
                Medium breed: 3.0 (≤8w), 2.5 (9-12w), 2.0 (13-16w), 1.6 (adult)<br />
                Large breed: 3.0 (≤8w), 3.0 (9-12w), 2.5 (13-16w), 2.0 (adult)
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-slate-700 dark:text-slate-300">
          These MER factors reflect the higher energy demands of puppies during rapid growth phases, which gradually decrease as they approach adult size.
        </p>
      </section>

      <section id="example" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Example Calculation
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Consider a 10-week-old medium breed puppy weighing 5 kg. We want to estimate its daily calorie needs to support healthy growth.
        </p>
        <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-2">
          <li>
            <strong>Calculate RER:</strong> 70 × (5)^0.75 = 70 × 3.343 = 234 kcal/day
          </li>
          <li>
            <strong>Determine MER factor:</strong> For a medium breed at 10 weeks, MER = 2.5
          </li>
          <li>
            <strong>Calculate total calorie needs:</strong> 234 × 2.5 = 585 kcal/day
          </li>
          <li>
            <strong>Interpretation:</strong> This puppy requires approximately 585 kcal daily to support optimal growth.
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300">
          Use this calorie estimate to guide feeding amounts and ensure your puppy receives balanced nutrition tailored to its growth stage.
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          Frequently Asked Questions
        </h2>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Why does the calorie requirement change as my puppy ages?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Puppies grow rapidly during their first few months, requiring more energy to support tissue development, bone growth, and immune function. As they mature, their growth rate slows, and their calorie needs decrease accordingly.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator adjusts calorie needs based on age to reflect these changing metabolic demands.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          How do I know my puppy’s predicted adult breed size?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Predicted adult breed size is usually based on the breed standard or your veterinarian’s estimate. If your puppy is a mixed breed, consider the size of the parents or dominant breed traits.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Selecting the correct size category ensures the calculator applies the appropriate energy multipliers for growth.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          Can I use this calculator for adult dogs or senior dogs?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          No, this calculator is specifically designed for puppies in their growth phase up to 52 weeks (1 year). Adult and senior dogs have different energy requirements and should be assessed with other calculators or veterinary guidance.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          For adult dogs, consider using a maintenance calorie needs calculator tailored to their activity level and health status.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
          What if my puppy’s weight is outside the typical range for its age?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Puppies grow at different rates depending on genetics, nutrition, and health. If your puppy is underweight or overweight for its age, consult your veterinarian for a tailored feeding plan.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator provides estimates based on typical growth patterns and should be used as a general guide.
        </p>
      </section>

      <section id="disclaimer" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is an educational tool designed to provide general estimates of puppy calorie needs. It does not replace professional veterinary advice or diagnosis.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Always consult your veterinarian for personalized nutrition recommendations, especially if your puppy has health conditions or special dietary requirements.
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
                href="https://www.nap.edu/catalog/10668/nutrient-requirements-of-dogs-and-cats"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Nutrient Requirements of Dogs and Cats (NRC, 2006)
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                The authoritative guide on canine nutrition requirements, including energy needs during growth phases.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11339&id=4956056"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Energy Requirements of Growing Dogs: A Review (Journal of Nutrition, 2000)
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                A detailed review of energy needs in puppies by age and breed size, supporting MER factor selection.
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
                Puppy Nutrition Guide (VCA Hospitals)
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Practical guidance on feeding puppies for optimal growth and health, including calorie considerations.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.akc.org/expert-advice/nutrition/how-much-should-i-feed-my-puppy/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                How Much Should I Feed My Puppy? (American Kennel Club)
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                A comprehensive overview of puppy feeding amounts based on weight, age, and breed size.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );

  const formula = {
    title: "Key formulas used in this calculator",
    formula: "Calories = RER × MER, where RER = 70 × (weight in kg)^0.75",
    variables: [
      {
        symbol: "Calories",
        name: "Daily Calorie Needs",
        description: "Estimated energy requirement for the puppy to support growth and maintenance",
      },
      {
        symbol: "RER",
        name: "Resting Energy Requirement",
        description: "Baseline energy expenditure at rest, calculated from weight",
      },
      {
        symbol: "MER",
        name: "Maintenance Energy Requirement factor",
        description:
          "Multiplier adjusting RER for growth stage and breed size to estimate total energy needs",
      },
      {
        symbol: "weight",
        name: "Current Puppy Weight (kg)",
        description: "The puppy’s current body weight in kilograms",
      },
    ],
  };

  const example = {
    title: "Example: Calculating Calorie Needs for a 10-Week-Old Medium Breed Puppy",
    scenario:
      "A 10-week-old medium breed puppy weighs 5 kg. We want to estimate how many calories it needs daily to support healthy growth.",
    steps: [
      {
        step: 1,
        description: "Calculate the Resting Energy Requirement (RER):",
        calculation: "70 × (5)^0.75 = 234 kcal/day",
      },
      {
        step: 2,
        description: "Determine the appropriate MER factor for a medium breed at 10 weeks:",
        calculation: "MER = 2.5",
      },
      {
        step: 3,
        description: "Multiply RER by MER to get total calorie needs:",
        calculation: "234 × 2.5 = 585 kcal/day",
      },
      {
        step: 4,
        description: "Interpret the result as the daily calorie requirement for this puppy.",
        calculation: "585 kcal/day",
      },
    ],
    result:
      "This puppy requires approximately 585 kcal per day to support optimal growth and development during this stage.",
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
      icon: "🔥",
    },
    {
      title: "Puppy Growth Rate & Weight Tracking Calculator",
      url: "/pets/dogs-nutrition/puppy-growth-rate-weight-tracking",
      icon: "📊",
    },
  ];

  const faqItems = [
    {
      question: "Why does the calorie requirement change as my puppy ages?",
      answer: (
        <>
          <p>
            Puppies grow rapidly during their first few months, requiring more energy to support tissue development, bone growth, and immune function. As they mature, their growth rate slows, and their calorie needs decrease accordingly.
          </p>
          <p>
            This calculator adjusts calorie needs based on age to reflect these changing metabolic demands.
          </p>
        </>
      ),
    },
    {
      question: "How do I know my puppy’s predicted adult breed size?",
      answer: (
        <>
          <p>
            Predicted adult breed size is usually based on the breed standard or your veterinarian’s estimate. If your puppy is a mixed breed, consider the size of the parents or dominant breed traits.
          </p>
          <p>
            Selecting the correct size category ensures the calculator applies the appropriate energy multipliers for growth.
          </p>
        </>
      ),
    },
    {
      question: "Can I use this calculator for adult dogs or senior dogs?",
      answer: (
        <>
          <p>
            No, this calculator is specifically designed for puppies in their growth phase up to 52 weeks (1 year). Adult and senior dogs have different energy requirements and should be assessed with other calculators or veterinary guidance.
          </p>
          <p>
            For adult dogs, consider using a maintenance calorie needs calculator tailored to their activity level and health status.
          </p>
        </>
      ),
    },
    {
      question: "What if my puppy’s weight is outside the typical range for its age?",
      answer: (
        <>
          <p>
            Puppies grow at different rates depending on genetics, nutrition, and health. If your puppy is underweight or overweight for its age, consult your veterinarian for a tailored feeding plan.
          </p>
          <p>
            This calculator provides estimates based on typical growth patterns and should be used as a general guide.
          </p>
        </>
      ),
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
        text: typeof answer === "string" ? answer : answer.props.children.map((p: any) => p.props.children).join("\n\n"),
      },
    })),
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
      icon={<Calculator className="h-8 w-8 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default PuppyCalorieNeedsAgeBreedSizeCalculator;