import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Dog, Activity, Info } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogTreatCaloriesDailyAllowanceCalculator() {
  // State for inputs
  const [dogWeight, setDogWeight] = useState<string>("10");
  const [treatCalories, setTreatCalories] = useState<string>("50");
  const [dailyTreats, setDailyTreats] = useState<string>("1");

  // Convert inputs to numbers safely
  const weightKg = useMemo(() => {
    const w = parseFloat(dogWeight);
    return isNaN(w) || w <= 0 ? 0 : w;
  }, [dogWeight]);

  const treatCal = useMemo(() => {
    const c = parseFloat(treatCalories);
    return isNaN(c) || c < 0 ? 0 : c;
  }, [treatCalories]);

  const treatsCount = useMemo(() => {
    const t = parseInt(dailyTreats);
    return isNaN(t) || t < 0 ? 0 : t;
  }, [dailyTreats]);

  // Calculate Resting Energy Requirement (RER) in kcal/day
  // RER = 70 * (weight in kg) ^ 0.75
  const RER = useMemo(() => {
    if (weightKg <= 0) return 0;
    return 70 * Math.pow(weightKg, 0.75);
  }, [weightKg]);

  // Calculate Maintenance Energy Requirement (MER) in kcal/day
  // MER = RER * activity factor (typical 1.6 for average adult dog)
  const activityFactor = 1.6;
  const MER = useMemo(() => {
    return RER * activityFactor;
  }, [RER]);

  // Calculate total treat calories consumed daily
  const totalTreatCalories = useMemo(() => {
    return treatCal * treatsCount;
  }, [treatCal, treatsCount]);

  // Calculate max safe daily treat calories (10% of MER)
  const maxTreatCalories = useMemo(() => {
    return MER * 0.1;
  }, [MER]);

  // Calculate max safe number of treats per day based on treat calories
  const maxTreatsAllowed = useMemo(() => {
    if (treatCal <= 0) return 0;
    return Math.floor(maxTreatCalories / treatCal);
  }, [maxTreatCalories, treatCal]);

  // Reset inputs handler
  const handleReset = () => {
    setDogWeight("10");
    setTreatCalories("50");
    setDailyTreats("1");
  };

  // Formula description
  const formula = {
    title: "Core Formulas Used",
    formula:
      "RER = 70 × (Weight in kg)^0.75\nMER = RER × Activity Factor (1.6 typical)\nMax Treat Calories = 10% of MER\nMax Treats Allowed = Max Treat Calories ÷ Calories per Treat",
    variables: [
      { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
      { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
      { symbol: "Weight", description: "Dog's weight in kilograms (kg)" },
      { symbol: "Activity Factor", description: "Typical multiplier for activity level (1.6 average adult dog)" },
      { symbol: "Max Treat Calories", description: "Maximum safe calories from treats per day (10% of MER)" },
      { symbol: "Max Treats Allowed", description: "Maximum number of treats allowed daily without exceeding safe calorie intake" },
      { symbol: "Calories per Treat", description: "Calorie content of one treat" },
    ],
  };

  // Example worked example
  const example = {
    title: "Example: Calculating Treat Allowance for a 15 kg Dog",
    scenario:
      "You have a 15 kg adult dog and want to give treats that contain 40 calories each. You want to know how many treats are safe to give daily without risking weight gain.",
    steps: [
      "Calculate RER: 70 × 15^0.75 ≈ 70 × 7.62 = 533 kcal/day",
      "Calculate MER: 533 × 1.6 = 853 kcal/day",
      "Calculate max treat calories: 10% of 853 = 85 kcal/day",
      "Calculate max treats allowed: 85 ÷ 40 ≈ 2 treats per day",
    ],
    result: "You can safely give up to 2 treats per day without exceeding 10% of your dog's daily calorie needs.",
  };

  // Related calculators
  const relatedCalculators = [
    {
      title: "Dog Calorie Needs (RER/MER) Calculator",
      url: "/pets/dog-calorie-needs-rer-mer",
      icon: "🐶",
    },
    {
      title: "Dog Ideal Weight & Target Calories Calculator",
      url: "/pets/dog-ideal-weight-target-calories",
      icon: "🐶",
    },
    {
      title: "Dog Weight Loss Rate Calculator",
      url: "/pets/dog-weight-loss-rate",
      icon: "🐶",
    },
  ];

  // FAQ JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why should I limit my dog's treat calories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Treat calories can add up quickly and contribute to weight gain if not limited. Keeping treats to 10% or less of your dog's daily calorie needs helps maintain a healthy weight."
        }
      },
      {
        "@type": "Question",
        "name": "What if my dog is very active or a puppy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Active dogs or puppies may have higher calorie needs. Consult your veterinarian to adjust the activity factor or treat allowance accordingly."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this calculator for all dog breeds?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, this calculator uses weight-based formulas applicable to all breeds, but individual needs may vary."
        }
      },
      {
        "@type": "Question",
        "name": "What if I don't know my dog's weight in kilograms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can convert pounds to kilograms by dividing the weight in pounds by 2.2046."
        }
      },
      {
        "@type": "Question",
        "name": "Is this calculator a substitute for veterinary advice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, this calculator is for educational purposes only. Always consult your veterinarian for personalized nutrition and health advice."
        }
      }
    ]
  };

  // Editorial content
  const editorial = (
    <section className="space-y-8">
      <section id="how-it-works">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          How this calculator works
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          This calculator helps you estimate the calorie content of your dog's treats and determine the maximum safe daily treat allowance to prevent unwanted weight gain. It uses standard veterinary nutrition formulas based on your dog's weight to calculate their Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER).
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Treat calories should generally not exceed 10% of your dog's total daily calorie needs (MER). By entering your dog's weight, the calories per treat, and how many treats you give daily, you can see if you are within a safe range or if you should reduce treat intake.
        </p>
      </section>

      <section id="examples">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-green-600 dark:text-green-400" />
          Examples
        </h2>
        <article className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{example.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">{example.scenario}</p>
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-2">
            {example.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{example.result}</p>
        </article>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          <div>
            <dt className="font-semibold text-gray-900 dark:text-gray-100">Why should I limit my dog's treat calories?</dt>
            <dd className="text-gray-700 dark:text-gray-300">
              Treat calories can add up quickly and contribute to weight gain if not limited. Keeping treats to 10% or less of your dog's daily calorie needs helps maintain a healthy weight.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-gray-100">What if my dog is very active or a puppy?</dt>
            <dd className="text-gray-700 dark:text-gray-300">
              Active dogs or puppies may have higher calorie needs. Consult your veterinarian to adjust the activity factor or treat allowance accordingly.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-gray-100">Can I use this calculator for all dog breeds?</dt>
            <dd className="text-gray-700 dark:text-gray-300">
              Yes, this calculator uses weight-based formulas applicable to all breeds, but individual needs may vary.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-gray-100">What if I don't know my dog's weight in kilograms?</dt>
            <dd className="text-gray-700 dark:text-gray-300">
              You can convert pounds to kilograms by dividing the weight in pounds by 2.2046.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-900 dark:text-gray-100">Is this calculator a substitute for veterinary advice?</dt>
            <dd className="text-gray-700 dark:text-gray-300">
              No, this calculator is for educational purposes only. Always consult your veterinarian for personalized nutrition and health advice.
            </dd>
          </div>
        </dl>
      </section>

      <section id="disclaimer">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          Disclaimer
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          This calculator is intended for educational purposes only and does not replace professional veterinary advice. Always consult your veterinarian before making changes to your dog's diet or treat regimen.
        </p>
      </section>

      <section id="references">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          References &amp; further reading
        </h2>
        <ul className="list-disc list-inside space-y-4">
          <li>
            <a
              href="https://vcahospitals.com/know-your-pet/nutrition-for-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-semibold"
            >
              Nutrition for Dogs - VCA Hospitals
            </a>
            <p className="text-gray-700 dark:text-gray-300">
              Comprehensive guide on canine nutrition including calorie needs and treat allowances.
            </p>
          </li>
          <li>
            <a
              href="https://www.petmd.com/dog/nutrition/evr_dg_how_many_calories_does_my_dog_need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-semibold"
            >
              How Many Calories Does My Dog Need? - PetMD
            </a>
            <p className="text-gray-700 dark:text-gray-300">
              Explains how to calculate your dog's calorie requirements and the importance of balanced feeding.
            </p>
          </li>
          <li>
            <a
              href="https://www.akc.org/expert-advice/nutrition/how-many-calories-does-my-dog-need/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-semibold"
            >
              How Many Calories Does My Dog Need? - American Kennel Club
            </a>
            <p className="text-gray-700 dark:text-gray-300">
              Useful resource on daily calorie needs and treat management for dogs.
            </p>
          </li>
          <li>
            <a
              href="https://www.wsava.org/wp-content/uploads/2020/03/WSAVA-Nutrition-Guidelines-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-semibold"
            >
              WSAVA Global Nutrition Guidelines
            </a>
            <p className="text-gray-700 dark:text-gray-300">
              International guidelines on pet nutrition and feeding practices.
            </p>
          </li>
        </ul>
      </section>
    </section>
  );

  // On this page links for editorial navigation
  const onThisPage = [
    { label: "How this calculator works", href: "#how-it-works" },
    { label: "Examples", href: "#examples" },
    { label: "FAQ", href: "#faq" },
    { label: "Disclaimer", href: "#disclaimer" },
    { label: "References & further reading", href: "#references" },
  ];

  // Main calculator widget UI
  const widget = (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Treat Calories & Daily Allowance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="dogWeight" className="mb-1">
            Dog's Weight (kg)
          </Label>
          <Input
            id="dogWeight"
            type="number"
            min="0"
            step="0.1"
            value={dogWeight}
            onChange={(e) => setDogWeight(e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
        <div>
          <Label htmlFor="treatCalories" className="mb-1">
            Calories per Treat
          </Label>
          <Input
            id="treatCalories"
            type="number"
            min="0"
            step="1"
            value={treatCalories}
            onChange={(e) => setTreatCalories(e.target.value)}
            placeholder="e.g. 50"
          />
        </div>
        <div>
          <Label htmlFor="dailyTreats" className="mb-1">
            Number of Treats Given Daily
          </Label>
          <Input
            id="dailyTreats"
            type="number"
            min="0"
            step="1"
            value={dailyTreats}
            onChange={(e) => setDailyTreats(e.target.value)}
            placeholder="e.g. 1"
          />
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-900 dark:text-gray-100 font-semibold">
            Resting Energy Requirement (RER): {RER.toFixed(0)} kcal/day
          </p>
          <p className="text-gray-900 dark:text-gray-100 font-semibold">
            Maintenance Energy Requirement (MER): {MER.toFixed(0)} kcal/day
          </p>
          <p className="text-gray-900 dark:text-gray-100 font-semibold">
            Total Treat Calories Consumed: {totalTreatCalories.toFixed(0)} kcal/day
          </p>
          <p
            className={`font-semibold ${
              totalTreatCalories > maxTreatCalories ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
            }`}
          >
            Maximum Safe Treat Calories (10% of MER): {maxTreatCalories.toFixed(0)} kcal/day
          </p>
          <p className="text-gray-900 dark:text-gray-100 font-semibold">
            Maximum Treats Allowed Daily: {maxTreatsAllowed}
          </p>
          {totalTreatCalories > maxTreatCalories && (
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Warning: Your current treat calories exceed the recommended 10% of daily calorie needs.
            </p>
          )}
        </div>

        <Button variant="secondary" onClick={handleReset} className="w-full">
          Reset Inputs
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Treat Calories & Daily Allowance Calculator"
      description="Calculate the calorie content of treats and the maximum safe daily treat allowance to prevent weight gain."
      widget={widget}
      editorial={editorial}
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
      jsonLd={jsonLd}
      icon={<Dog className="w-8 h-8 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default DogTreatCaloriesDailyAllowanceCalculator;