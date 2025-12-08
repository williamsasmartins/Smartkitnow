import { useState, useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Calculator, Info, AlertTriangle, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

const DogWeightLossPlannerCalculator = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [bodyCondition, setBodyCondition] = useState("Moderately overweight");
  const [maintenanceCalories, setMaintenanceCalories] = useState("");
  const [error, setError] = useState("");
  const resultsRef = useRef(null);

  const handleCalculate = () => {
    if (!currentWeight || !targetWeight || !maintenanceCalories) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReset = () => {
    setCurrentWeight("");
    setTargetWeight("");
    setWeightUnit("kg");
    setBodyCondition("Moderately overweight");
    setMaintenanceCalories("");
    setError("");
  };

  const widget = (
    <Card>
      <CardHeader>
        <CardTitle>Dog Weight Loss Planner</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Plan a safe and effective weight loss program for your dog.</p>
        <div className="space-y-4">
          <div>
            <Label>Current Weight</Label>
            <Input
              type="number"
              placeholder="20"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              className="w-full"
            />
            <Select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value)}
              className="mt-1"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </Select>
            <p className="text-sm text-muted">Enter your dog's current weight.</p>
          </div>
          <div>
            <Label>Target Weight</Label>
            <Input
              type="number"
              placeholder="18"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted">Enter the desired target weight.</p>
          </div>
          <div>
            <Label>Body Condition</Label>
            <Select
              value={bodyCondition}
              onChange={(e) => setBodyCondition(e.target.value)}
              className="w-full"
            >
              <option value="Just a little overweight">Just a little overweight</option>
              <option value="Moderately overweight">Moderately overweight</option>
              <option value="Obese / needs strict plan">Obese / needs strict plan</option>
            </Select>
            <p className="text-sm text-muted">Select the current body condition of your dog.</p>
          </div>
          <div>
            <Label>Maintenance Calories (kcal/day)</Label>
            <Input
              type="number"
              placeholder="800"
              value={maintenanceCalories}
              onChange={(e) => setMaintenanceCalories(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted">Enter the maintenance calories per day.</p>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <Button onClick={handleCalculate} className="w-full">
            Calculate
          </Button>
          <Button onClick={handleReset} className="w-full mt-2">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const editorial = (
    <div>
      <section id="how-to-use">
        <h2>How to use this calculator</h2>
        <p>To use this calculator, fill in your dog's current weight, target weight, body condition, and maintenance calories.</p>
        <p>Select the appropriate units for weight and ensure all fields are filled before calculating.</p>
        <p>After entering the data, click "Calculate" to see the results.</p>
      </section>
      <section id="inputs-explained">
        <h2>What each input means</h2>
        <p>The current weight is your dog's present weight. Target weight is the desired weight after the weight loss plan.</p>
        <p>Body condition helps determine the intensity of the weight loss plan.</p>
        <p>Maintenance calories are the calories needed to maintain the current weight.</p>
      </section>
      <section id="understanding-results">
        <h2>Understanding your results</h2>
        <p>The results will show the target daily calories for weight loss and the estimated time to reach the target weight.</p>
        <p>It will also provide an interpretation of the weight loss rate and its suitability for your dog.</p>
        <p>Ensure to follow the plan under veterinary supervision for aggressive weight loss goals.</p>
      </section>
      <section id="theory-formulas">
        <h2>Formulas and theory</h2>
        <p>The calculator uses the following formulas to estimate the weight loss plan:</p>
        <ul>
          <li>RER = 70 * (Current Weight in kg)^0.75</li>
          <li>MER = RER * Activity Factor</li>
          <li>Calorie Deficit = Maintenance Calories - Target Calories</li>
          <li>Weight Loss Rate = 0.5% to 2% of body weight per week</li>
        </ul>
        <p>RER is the Resting Energy Requirement, and MER is the Maintenance Energy Requirement.</p>
      </section>
      <section id="worked-example">
        <h2>Worked example</h2>
        <p>Consider a dog weighing 20 kg with a target weight of 18 kg. The body condition is moderately overweight, and maintenance calories are 800 kcal/day.</p>
        <p>Step 1: Calculate RER = 70 * (20)^0.75 = 662 kcal/day.</p>
        <p>Step 2: Determine MER using an activity factor of 1.2 = 662 * 1.2 = 794 kcal/day.</p>
        <p>Step 3: Calculate calorie deficit = 800 - 794 = 6 kcal/day.</p>
        <p>Step 4: Estimate weight loss rate = 0.5% to 2% of 20 kg = 0.1 to 0.4 kg per week.</p>
        <p>The dog should reach the target weight in approximately 5 to 20 weeks, depending on the weight loss rate.</p>
      </section>
      <section id="faq">
        <h2>Frequently asked questions</h2>
        <h3>How often should I recalculate my dog's calories?</h3>
        <p>It's recommended to recalculate your dog's calorie needs every few weeks or after significant weight changes.</p>
        <p>Regular recalculations help ensure the weight loss plan remains effective and safe.</p>
        <h3>Can I use this calculator for puppies?</h3>
        <p>This calculator is designed for adult dogs. Puppies have different nutritional needs and growth rates.</p>
        <p>Consult a veterinarian for a tailored plan for puppies.</p>
        <h3>What if my dog is not losing weight?</h3>
        <p>If your dog is not losing weight as expected, consult a veterinarian to reassess the plan.</p>
        <p>There may be underlying health issues or the need for plan adjustments.</p>
        <h3>Is this calculator suitable for all dog breeds?</h3>
        <p>While the calculator provides general guidance, consult a veterinarian for breed-specific needs.</p>
        <p>Some breeds may have unique dietary requirements.</p>
        <h3>Can I use this calculator if my dog is underweight?</h3>
        <p>This calculator is not designed for underweight dogs. Consult a veterinarian for appropriate guidance.</p>
        <p>Underweight dogs require a different approach to nutrition and weight management.</p>
      </section>
      <section id="limitations">
        <h2>Limitations of this tool</h2>
        <p>This calculator provides estimates and does not replace professional veterinary advice.</p>
        <p>Individual variations in metabolism and health conditions may affect results.</p>
        <p>Always consult a veterinarian before starting a weight loss plan for your dog.</p>
      </section>
      <section id="references">
        <h2>References</h2>
        <ul>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.wsava.org/Guidelines/Global-Nutrition-Guidelines"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                WSAVA Global Nutrition Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Comprehensive guidelines on pet nutrition and weight management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.petobesityprevention.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Association for Pet Obesity Prevention
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Resources and statistics on pet obesity and weight management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.acvn.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                American College of Veterinary Nutrition
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Professional organization for veterinary nutritionists.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.avma.org/resources-tools/pet-owners/petcare/obesity-pets"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                AVMA: Obesity in Pets
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Information on obesity in pets and its health implications.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a
                href="https://www.vetmed.ucdavis.edu/hospital/small-animal/nutrition-support-service"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                UC Davis Veterinary Nutrition Support
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Veterinary nutrition support services and resources.
              </p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );

  const onThisPage = [
    { id: "how-to-use", label: "How to use this calculator" },
    { id: "inputs-explained", label: "What each input means" },
    { id: "understanding-results", label: "Understanding your results" },
    { id: "theory-formulas", label: "Formulas and theory" },
    { id: "worked-example", label: "Worked example" },
    { id: "faq", label: "Frequently asked questions" },
    { id: "limitations", label: "Limitations of this tool" },
    { id: "references", label: "References" },
  ];

  const formula = (
    <div>
      <h2>Formulas</h2>
      <p>The following formulas are used to calculate the weight loss plan:</p>
      <ul>
        <li>RER = 70 * (Current Weight in kg)^0.75</li>
        <li>MER = RER * Activity Factor</li>
        <li>Calorie Deficit = Maintenance Calories - Target Calories</li>
        <li>Weight Loss Rate = 0.5% to 2% of body weight per week</li>
      </ul>
      <p>RER is the Resting Energy Requirement, and MER is the Maintenance Energy Requirement.</p>
    </div>
  );

  const example = {
    title: "Example: Planning weight loss for a moderately overweight dog",
    scenario: "A 20 kg dog is moderately overweight and needs to reach a target weight of 18 kg.",
    steps: [
      { step: 1, description: "Calculate RER for the current weight.", calculation: "RER = 70 * (20)^0.75 = 662 kcal/day" },
      { step: 2, description: "Determine MER using an activity factor.", calculation: "MER = 662 * 1.2 = 794 kcal/day" },
      { step: 3, description: "Calculate the calorie deficit needed.", calculation: "Calorie Deficit = 800 - 794 = 6 kcal/day" },
      { step: 4, description: "Estimate the weight loss rate.", calculation: "Weight Loss Rate = 0.5% to 2% of 20 kg = 0.1 to 0.4 kg per week" }
    ],
    result: "The dog should reach the target weight in approximately 5 to 20 weeks, depending on the weight loss rate."
  };

  const relatedCalculators = [
    { title: "Dog Calorie Needs Calculator", url: "/pets/dogs-nutrition/dog-calorie-needs", icon: "🐶" },
    { title: "Dog Ideal Weight Calculator", url: "/pets/dogs-nutrition/dog-ideal-weight", icon: "🐾" },
    { title: "Dog Treat Allowance Calculator", url: "/pets/dogs-nutrition/dog-treat-allowance", icon: "🍖" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How often should I recalculate my dog's calories?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It's recommended to recalculate your dog's calorie needs every few weeks or after significant weight changes. Regular recalculations help ensure the weight loss plan remains effective and safe."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this calculator for puppies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This calculator is designed for adult dogs. Puppies have different nutritional needs and growth rates. Consult a veterinarian for a tailored plan for puppies."
        }
      },
      {
        "@type": "Question",
        "name": "What if my dog is not losing weight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If your dog is not losing weight as expected, consult a veterinarian to reassess the plan. There may be underlying health issues or the need for plan adjustments."
        }
      },
      {
        "@type": "Question",
        "name": "Is this calculator suitable for all dog breeds?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While the calculator provides general guidance, consult a veterinarian for breed-specific needs. Some breeds may have unique dietary requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this calculator if my dog is underweight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This calculator is not designed for underweight dogs. Consult a veterinarian for appropriate guidance. Underweight dogs require a different approach to nutrition and weight management."
        }
      }
    ]
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Weight Loss Planner"
      description="Plan a safe and effective weight loss program for your dog. Calculates target calories and timeline for goal weight achievement."
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

export default DogWeightLossPlannerCalculator;