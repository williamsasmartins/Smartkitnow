import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogTreatCaloriesDailyAllowanceCalculator() {
  const [weightKg, setWeightKg] = useState("");
  const [currentDailyCalories, setCurrentDailyCalories] = useState("");
  const [treatCalories, setTreatCalories] = useState("");
  const [treatsPerDay, setTreatsPerDay] = useState("");
  const [maxTreatCalories, setMaxTreatCalories] = useState<number | null>(null);
  const [maxTreats, setMaxTreats] = useState<number | null>(null);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  function scrollToResults() {
    if (resultsRef.current) {
      window.scrollTo({
        top: resultsRef.current.offsetTop - 20,
        behavior: "smooth",
      });
    }
  }

  function calculate() {
    setError("");
    const w = parseFloat(weightKg);
    const dailyCal = parseFloat(currentDailyCalories);
    const treatCal = parseFloat(treatCalories);
    const treatsNum = parseFloat(treatsPerDay);

    if (isNaN(w) || w <= 0) {
      setError("Please enter a valid dog weight in kilograms.");
      return;
    }
    if (isNaN(dailyCal) || dailyCal <= 0) {
      setError("Please enter a valid current daily calorie intake.");
      return;
    }
    if (isNaN(treatCal) || treatCal <= 0) {
      setError("Please enter a valid calorie amount per treat.");
      return;
    }
    if (isNaN(treatsNum) || treatsNum <= 0) {
      setError("Please enter a valid number of treats given per day.");
      return;
    }

    // Maximum treat calories recommended is 10% of daily calories to avoid weight gain
    const maxTreatCal = dailyCal * 0.1;

    // Calculate total treat calories currently given
    const currentTreatCalTotal = treatCal * treatsNum;

    // Calculate max number of treats allowed per day
    const maxTreatCount = Math.floor(maxTreatCal / treatCal);

    setMaxTreatCalories(maxTreatCal);
    setMaxTreats(maxTreatCount);

    scrollToResults();
  }

  const widget = (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Dog Treat Calories & Daily Allowance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="weightKg">Dog Weight (kg)</Label>
          <Input
            id="weightKg"
            type="number"
            min={0}
            step="0.1"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            placeholder="e.g. 15.5"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter your dog's weight in kilograms.
          </p>
        </div>
        <div>
          <Label htmlFor="currentDailyCalories">Current Daily Calories (kcal)</Label>
          <Input
            id="currentDailyCalories"
            type="number"
            min={0}
            step="1"
            value={currentDailyCalories}
            onChange={(e) => setCurrentDailyCalories(e.target.value)}
            placeholder="e.g. 800"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter the total calories your dog currently consumes daily from all food.
          </p>
        </div>
        <div>
          <Label htmlFor="treatCalories">Calories per Treat (kcal)</Label>
          <Input
            id="treatCalories"
            type="number"
            min={0}
            step="0.1"
            value={treatCalories}
            onChange={(e) => setTreatCalories(e.target.value)}
            placeholder="e.g. 15"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter the calorie content of one treat.
          </p>
        </div>
        <div>
          <Label htmlFor="treatsPerDay">Number of Treats Given Daily</Label>
          <Input
            id="treatsPerDay"
            type="number"
            min={0}
            step="1"
            value={treatsPerDay}
            onChange={(e) => setTreatsPerDay(e.target.value)}
            placeholder="e.g. 4"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter how many treats your dog receives each day.
          </p>
        </div>
        {error && <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>}
        <Button onClick={calculate} className="w-full mt-2">
          Calculate
        </Button>
      </CardContent>
      {maxTreatCalories !== null && maxTreats !== null && (
        <CardContent ref={resultsRef} className="mt-4 space-y-4">
          <Card className="bg-blue-50 dark:bg-blue-900 p-4">
            <p className="text-slate-900 dark:text-slate-100 font-semibold text-lg">
              Maximum Treat Calories Allowed Daily
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-lg">{maxTreatCalories.toFixed(0)} kcal</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              This is 10% of your dog's total daily calorie intake to help prevent weight gain.
            </p>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900 p-4">
            <p className="text-slate-900 dark:text-slate-100 font-semibold text-lg">
              Maximum Number of Treats per Day
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-lg">{maxTreats} treats</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Based on the calories per treat you entered, this is the safe daily limit.
            </p>
          </Card>
        </CardContent>
      )}
    </Card>
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
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          This calculator helps you estimate the calorie content of treats you give your dog and determines the maximum safe daily treat allowance to prevent unwanted weight gain.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Treats can add significant calories to your dog's diet, which may lead to obesity if not managed properly. Understanding how many calories your dog receives from treats is essential for maintaining a healthy weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Use the results to adjust treat quantities or calorie content to keep your dog’s total daily calories balanced. This ensures treats remain a healthy part of your dog's nutrition.
        </p>
        <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4">
          <li>
            <strong>Dog Weight (kg):</strong> Your dog's current weight in kilograms. Use a recent accurate measurement.
          </li>
          <li>
            <strong>Current Daily Calories (kcal):</strong> Total calories your dog consumes daily from all food sources excluding treats.
          </li>
          <li>
            <strong>Calories per Treat (kcal):</strong> Calorie content of a single treat. Check packaging or consult your vet.
          </li>
          <li>
            <strong>Number of Treats Given Daily:</strong> How many treats your dog receives each day.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is an educational tool and does not replace professional veterinary advice. Always consult your veterinarian for personalized nutrition guidance.
        </p>
      </section>

      <section id="formulas-theory" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Formulas / Theory
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          The key principle is to limit treat calories to a safe portion of your dog’s total daily calorie intake to avoid weight gain.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-2">
          Veterinarians generally recommend that treats should not exceed 10% of your dog's daily calories.
        </p>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          The main formulas used are:
        </p>
        <code className="block whitespace-pre-wrap break-words bg-slate-100 dark:bg-slate-800 p-3 rounded mb-4">
          {`Maximum Treat Calories = Current Daily Calories × 0.10

Maximum Number of Treats = Maximum Treat Calories ÷ Calories per Treat`}
        </code>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          This ensures treats remain a small, controlled part of your dog’s diet.
        </p>
        <table className="w-full text-left border-collapse border border-slate-300 dark:border-slate-700 mb-4">
          <thead>
            <tr>
              <th className="border border-slate-300 dark:border-slate-700 p-2">Factor</th>
              <th className="border border-slate-300 dark:border-slate-700 p-2">Description</th>
              <th className="border border-slate-300 dark:border-slate-700 p-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300 dark:border-slate-700 p-2">Treat Calorie Limit</td>
              <td className="border border-slate-300 dark:border-slate-700 p-2">Maximum % of daily calories from treats</td>
              <td className="border border-slate-300 dark:border-slate-700 p-2">10%</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="example" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Example Calculation
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          A 15 kg dog currently consumes 800 kcal daily from regular food. The owner gives treats that contain 15 kcal each and gives 4 treats daily. Let's calculate the safe treat calorie allowance and maximum treats.
        </p>
        <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-2">
          <li>
            <strong>Calculate maximum treat calories:</strong> 800 kcal × 0.10 = 80 kcal
          </li>
          <li>
            <strong>Calculate current treat calories:</strong> 15 kcal × 4 treats = 60 kcal
          </li>
          <li>
            <strong>Calculate maximum number of treats allowed:</strong> 80 kcal ÷ 15 kcal per treat = 5.33 treats
          </li>
          <li>
            <strong>Round down to whole treats:</strong> 5 treats per day maximum
          </li>
        </ol>
        <p className="text-slate-700 dark:text-slate-300">
          This means the owner can safely give up to 5 treats daily without risking weight gain, assuming the dog's other calorie intake remains constant.
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Frequently Asked Questions
        </h2>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          Why should treats be limited to 10% of daily calories?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Treats often contain concentrated calories that can quickly add up. Limiting treats to 10% of daily calories helps maintain a balanced diet and prevents excess weight gain.
          This guideline is widely recommended by veterinary nutritionists.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          What if my dog is overweight or underweight?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          If your dog is overweight, reducing treat calories or switching to low-calorie treats can help with weight loss. For underweight dogs, consult your veterinarian before increasing treat calories.
          This calculator assumes a healthy weight and maintenance calorie intake.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          Can I use this calculator for puppies or senior dogs?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Puppies and senior dogs have different nutritional needs. This calculator is designed for adult dogs at maintenance weight.
          For puppies or seniors, consult your veterinarian for tailored calorie and treat recommendations.
        </p>

        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
          How do I find out the calories in my dog's treats?
        </h3>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Check the treat packaging for nutritional information or contact the manufacturer. If unavailable, your veterinarian or pet nutritionist may help estimate treat calories.
          Accurate calorie input is important for reliable results.
        </p>
      </section>

      <section id="disclaimer" className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Disclaimer
        </h2>
        <p className="text-slate-700 dark:text-slate-300">
          This calculator is intended for educational purposes only and does not replace professional veterinary advice.
          Always consult your veterinarian before making changes to your dog's diet or treat regimen.
          Individual needs may vary based on health, activity level, and breed.
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
                href="https://www.aaha.org/aaha-guidelines/nutrition/nutrition-calorie-calculations/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                American Animal Hospital Association: Nutrition Calorie Calculations
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Provides guidelines on calculating daily calorie needs and treat allowances for dogs.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://vcahospitals.com/know-your-pet/nutrition-for-dogs"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                VCA Hospitals: Nutrition for Dogs
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Explains the importance of balanced nutrition and managing treat calories to maintain healthy weight.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.petmd.com/dog/nutrition/evr_dg_how-many-calories-does-my-dog-need"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                PetMD: How Many Calories Does My Dog Need?
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Covers daily calorie requirements and the impact of treats on a dog’s diet.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.wsava.org/wp-content/uploads/2020/10/WSAVA-Nutrition-Guidelines-2020.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Global Nutrition Guidelines for Dogs and Cats
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                International veterinary guidelines on pet nutrition including treat calorie recommendations.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );

  const formula = {
    title: "Key formulas used in this calculator",
    formula: `Maximum Treat Calories = Current Daily Calories × 0.10

Maximum Number of Treats = Maximum Treat Calories ÷ Calories per Treat`,
    variables: [
      {
        symbol: "Maximum Treat Calories",
        name: "Maximum calories allowed from treats per day",
        description: "Calculated as 10% of the dog's total daily calorie intake to prevent weight gain",
      },
      {
        symbol: "Current Daily Calories",
        name: "Total calories consumed daily from regular food",
        description: "The dog's daily maintenance calories excluding treats",
      },
      {
        symbol: "Calories per Treat",
        name: "Calorie content of one treat",
        description: "Energy provided by a single treat",
      },
      {
        symbol: "Maximum Number of Treats",
        name: "Maximum treats allowed per day",
        description: "Maximum treat calories divided by calories per treat, rounded down",
      },
    ],
  };

  const example = {
    title: "Example: Calculating Safe Treat Allowance for a 15 kg Dog",
    scenario: `A dog weighing 15 kilograms consumes 800 kcal daily from regular food. The owner gives treats containing 15 kcal each and currently gives 4 treats daily. We want to find the safe daily treat calorie allowance and maximum number of treats.`,
    steps: [
      {
        step: 1,
        description: "Calculate maximum treat calories as 10% of daily calories",
        calculation: "800 kcal × 0.10 = 80 kcal",
      },
      {
        step: 2,
        description: "Calculate current treat calories given",
        calculation: "15 kcal × 4 treats = 60 kcal",
      },
      {
        step: 3,
        description: "Calculate maximum number of treats allowed",
        calculation: "80 kcal ÷ 15 kcal per treat = 5.33 treats",
      },
      {
        step: 4,
        description: "Round down to whole treats for safety",
        calculation: "5 treats per day maximum",
      },
    ],
    result: `The owner can safely give up to 5 treats daily without risking weight gain, assuming the dog's other calorie intake remains constant.`,
  };

  const relatedCalculators = [
    {
      title: "Dog Calorie Needs Calculator",
      url: "/pets/dogs-nutrition/dog-calorie-needs-rer-mer",
      icon: "🐕",
    },
    {
      title: "Dog Ideal Weight & Target Calories",
      url: "/pets/dogs-nutrition/dog-ideal-weight-target-calories",
      icon: "⚖️",
    },
    {
      title: "Puppy Calorie Needs by Age & Breed Size",
      url: "/pets/dogs-nutrition/puppy-calorie-needs-age-breed-size",
      icon: "🐶",
    },
    {
      title: "Loan Payment Calculator",
      url: "/finance/loans/loan-payment-calculator",
      icon: "💰",
    },
  ];

  const faqItems = [
    {
      question: "Why should treats be limited to 10% of daily calories?",
      answer: `Treats often contain concentrated calories that can quickly add up. Limiting treats to 10% of daily calories helps maintain a balanced diet and prevents excess weight gain. This guideline is widely recommended by veterinary nutritionists.`,
    },
    {
      question: "What if my dog is overweight or underweight?",
      answer: `If your dog is overweight, reducing treat calories or switching to low-calorie treats can help with weight loss. For underweight dogs, consult your veterinarian before increasing treat calories. This calculator assumes a healthy weight and maintenance calorie intake.`,
    },
    {
      question: "Can I use this calculator for puppies or senior dogs?",
      answer: `Puppies and senior dogs have different nutritional needs. This calculator is designed for adult dogs at maintenance weight. For puppies or seniors, consult your veterinarian for tailored calorie and treat recommendations.`,
    },
    {
      question: "How do I find out the calories in my dog's treats?",
      answer: `Check the treat packaging for nutritional information or contact the manufacturer. If unavailable, your veterinarian or pet nutritionist may help estimate treat calories. Accurate calorie input is important for reliable results.`,
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
        text: answer,
      },
    })),
  };

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
      icon={<Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default DogTreatCaloriesDailyAllowanceCalculator;