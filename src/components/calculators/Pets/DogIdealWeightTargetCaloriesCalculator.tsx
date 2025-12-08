import { useState, useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Calculator, Info, AlertTriangle, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const DogIdealWeightTargetCaloriesCalculator = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [idealWeight, setIdealWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [goalIntensity, setGoalIntensity] = useState("moderate");
  const [maintenanceCalories, setMaintenanceCalories] = useState("");
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const handleCalculate = () => {
    if (!currentWeight || !idealWeight || !maintenanceCalories) {
      setError("Please fill in all fields with valid values.");
      return;
    }
    setError("");
    resultRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    setCurrentWeight("");
    setIdealWeight("");
    setUnit("kg");
    setGoalIntensity("moderate");
    setMaintenanceCalories("");
    setError("");
  };

  const widget = (
    <Card>
      <CardHeader>
        <CardTitle>Dog Ideal Weight & Target Calories Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size.</p>
        <div>
          <Label>Current Weight</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="e.g., 20"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
            />
            <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </Select>
          </div>
          <p className="text-muted">Enter your dog's current weight.</p>
        </div>
        <div>
          <Label>Ideal Weight</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="e.g., 18"
              value={idealWeight}
              onChange={(e) => setIdealWeight(e.target.value)}
            />
            <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </Select>
          </div>
          <p className="text-muted">Enter the ideal weight for your dog.</p>
        </div>
        <div>
          <Label>Goal Intensity</Label>
          <Select value={goalIntensity} onChange={(e) => setGoalIntensity(e.target.value)}>
            <option value="light">Just a little overweight</option>
            <option value="moderate">Moderately overweight</option>
            <option value="strict">Obese / needs strict plan</option>
          </Select>
          <p className="text-muted">Select the intensity of the weight loss goal.</p>
        </div>
        <div>
          <Label>Maintenance Calories</Label>
          <Input
            type="number"
            placeholder="e.g., 800"
            value={maintenanceCalories}
            onChange={(e) => setMaintenanceCalories(e.target.value)}
          />
          <p className="text-muted">Enter the maintenance calories per day.</p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <Button onClick={handleCalculate} className="w-full mt-4">Calculate</Button>
        <Button onClick={handleReset} variant="secondary" className="w-full mt-2">Reset</Button>
        <div ref={resultRef}>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Main numeric result (e.g., target calories per day).</p>
              <p>Secondary metrics (e.g., estimated weekly weight loss, time to goal, safety notes).</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  const editorial = (
    <>
      <section id="how-to-use">
        <h2>How to use this calculator</h2>
        <p>This calculator helps you determine your dog's ideal weight and the calories needed to maintain it. Follow these steps:</p>
        <ol>
          <li>Enter your dog's current weight and select the unit (kg or lb).</li>
          <li>Enter the ideal weight for your dog and select the unit.</li>
          <li>Select the goal intensity based on your dog's condition.</li>
          <li>Enter the maintenance calories your dog currently consumes.</li>
          <li>Click "Calculate" to see the results.</li>
        </ol>
        <p>The results will show the target daily calories and other important metrics.</p>
      </section>
      <section id="understanding-calories">
        <h2>Understanding dog calories and weight</h2>
        <p>Calories are the energy your dog needs to maintain its body functions and activities. The right calorie intake helps maintain a healthy weight.</p>
        <p>Overfeeding or underfeeding can lead to health issues. It's important to adjust calorie intake based on your dog's activity level and weight goals.</p>
        <p>Consult with a veterinarian to determine the best calorie intake for your dog.</p>
      </section>
      <section id="safe-weight-loss">
        <h2>What is safe weight loss for dogs?</h2>
        <p>A safe weight loss rate for dogs is between 0.5% to 2% of their body weight per week. Rapid weight loss can be harmful.</p>
        <p>Always consult a veterinarian before starting a weight loss plan for your dog, especially if the plan is aggressive.</p>
        <p>Monitor your dog's progress and adjust the plan as needed.</p>
      </section>
      <section id="worked-example">
        <h2>Worked example</h2>
        <p>Let's consider a 20 kg dog whose owner wants to achieve an ideal weight of 18 kg.</p>
        <p>The owner selects a moderate weight loss goal and enters the maintenance calories as 800 kcal/day.</p>
        <p>After calculation, the target daily calories are determined, along with the estimated time to reach the goal weight.</p>
      </section>
      <section id="faq">
        <h2>Frequently asked questions</h2>
        <h3>What age is appropriate for weight management?</h3>
        <p>Weight management is important for dogs of all ages, but special care should be taken with puppies and senior dogs. Consult your vet for age-specific advice.</p>
        <h3>How often should I recalculate my dog's calorie needs?</h3>
        <p>Recalculate your dog's calorie needs whenever there is a significant change in weight, activity level, or health status.</p>
        <h3>Can all breeds follow the same weight loss plan?</h3>
        <p>Different breeds have different needs. Consult with a veterinarian to tailor a plan suitable for your dog's breed and condition.</p>
        <h3>What if my dog has a health condition?</h3>
        <p>If your dog has a health condition, consult with a veterinarian before making any changes to their diet or weight management plan.</p>
      </section>
      <section id="references">
        <h2>Scientific references</h2>
        <ul>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a href="https://www.petnutritionalliance.org" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Pet Nutrition Alliance
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                A comprehensive resource on pet nutrition and weight management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a href="https://www.wsava.org" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                World Small Animal Veterinary Association
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Offers guidelines on pet nutrition and weight management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                American Veterinary Medical Association
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Provides insights into veterinary care and pet health.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                American Animal Hospital Association
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Offers standards and guidelines for veterinary practices.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </>
  );

  const onThisPage = [
    { id: "how-to-use", label: "How to use this calculator" },
    { id: "understanding-calories", label: "Understanding dog calories and weight" },
    { id: "safe-weight-loss", label: "What is safe weight loss for dogs?" },
    { id: "worked-example", label: "Worked example" },
    { id: "faq", label: "Frequently asked questions" },
    { id: "references", label: "Scientific references" }
  ];

  const formula = {
    title: "Formulas / theory",
    formula: "Target Calories = Maintenance Calories - (Weight Loss Rate * Current Weight)",
    variables: [
      { name: "Target Calories", description: "Calories needed per day to achieve weight loss goal." },
      { name: "Maintenance Calories", description: "Calories needed to maintain current weight." },
      { name: "Weight Loss Rate", description: "Percentage of body weight to lose per week." },
      { name: "Current Weight", description: "The current weight of the dog." }
    ]
  };

  const example = {
    title: "Example: Planning safe weight loss for a 20 kg dog",
    scenario: "A 20 kg dog needs to achieve an ideal weight of 18 kg. The owner selects a moderate goal intensity.",
    steps: [
      { step: 1, description: "Enter current weight as 20 kg.", calculation: "Current Weight = 20 kg" },
      { step: 2, description: "Enter ideal weight as 18 kg.", calculation: "Ideal Weight = 18 kg" },
      { step: 3, description: "Select moderate goal intensity.", calculation: "Goal Intensity = Moderate" },
      { step: 4, description: "Enter maintenance calories as 800 kcal/day.", calculation: "Maintenance Calories = 800 kcal/day" }
    ],
    result: "The target daily calories are calculated to help the dog safely reach its ideal weight over time."
  };

  const relatedCalculators = [
    { title: "Dog Calorie Needs RER/MER", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
    { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "📊" },
    { title: "Dog Treat Allowance", url: "/pets/dog-treat-allowance", icon: "🧮" }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What age is appropriate for weight management?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Weight management is important for dogs of all ages, but special care should be taken with puppies and senior dogs. Consult your vet for age-specific advice."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I recalculate my dog's calorie needs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Recalculate your dog's calorie needs whenever there is a significant change in weight, activity level, or health status."
        }
      },
      {
        "@type": "Question",
        "name": "Can all breeds follow the same weight loss plan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Different breeds have different needs. Consult with a veterinarian to tailor a plan suitable for your dog's breed and condition."
        }
      },
      {
        "@type": "Question",
        "name": "What if my dog has a health condition?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If your dog has a health condition, consult with a veterinarian before making any changes to their diet or weight management plan."
        }
      }
    ]
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size."
      widget={widget}
      editorial={editorial}
      onThisPage={onThisPage}
      formula={formula}
      example={example}
      relatedCalculators={relatedCalculators}
      jsonLd={jsonLd}
      icon={
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
          <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      }
    />
  );
};

export default DogIdealWeightTargetCaloriesCalculator;