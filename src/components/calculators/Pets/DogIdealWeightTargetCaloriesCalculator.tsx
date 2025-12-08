import { useState, useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Calculator, Info, AlertTriangle, BookOpen } from "lucide-react";

const DogIdealWeightTargetCaloriesCalculator = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const [idealWeight, setIdealWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  const [bodyCondition, setBodyCondition] = useState("moderate");
  const [activityLevel, setActivityLevel] = useState("average");
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const calculateCalories = () => {
    if (!currentWeight || !idealWeight || parseFloat(currentWeight) <= 0 || parseFloat(idealWeight) <= 0) {
      setError("Please enter valid weights greater than 0.");
      return;
    }
    setError("");
    resultRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const widget = (
    <Card>
      <CardHeader>
        <CardTitle>Dog Ideal Weight & Target Calories</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size.</p>
        <div className="space-y-4">
          <div>
            <Label>Current Weight</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="20"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="flex-1"
              />
              <Select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </Select>
            </div>
            <p className="text-sm text-muted">Enter your dog's current weight. Typical range: 2-100 kg (4.4-220 lb).</p>
          </div>
          <div>
            <Label>Ideal Weight</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="18"
                value={idealWeight}
                onChange={(e) => setIdealWeight(e.target.value)}
                className="flex-1"
              />
              <Select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </Select>
            </div>
            <p className="text-sm text-muted">Enter the ideal weight for your dog. Consult your vet for guidance.</p>
          </div>
          <div>
            <Label>Body Condition</Label>
            <Select value={bodyCondition} onChange={(e) => setBodyCondition(e.target.value)}>
              <option value="slight">Just a little overweight</option>
              <option value="moderate">Moderately overweight</option>
              <option value="obese">Obese / needs strict plan</option>
            </Select>
            <p className="text-sm text-muted">Select the body condition that best describes your dog.</p>
          </div>
          <div>
            <Label>Activity Level</Label>
            <Select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
              <option value="low">Low</option>
              <option value="average">Average</option>
              <option value="high">High</option>
            </Select>
            <p className="text-sm text-muted">Choose your dog's typical activity level.</p>
          </div>
          {error && <Alert icon={<AlertTriangle />} title="Error" description={error} />}
          <Button onClick={calculateCalories} className="w-full mt-4">Calculate</Button>
          <Button onClick={() => { setCurrentWeight(""); setIdealWeight(""); setBodyCondition("moderate"); setActivityLevel("average"); }} className="w-full mt-2">Reset</Button>
        </div>
      </CardContent>
    </Card>
  );

  const editorial = (
    <div>
      <section id="how-to-use">
        <h2>How to use this calculator</h2>
        <p>To use this calculator, input your dog's current and ideal weights in the appropriate fields. Select the weight unit (kg or lb) and choose the body condition that best describes your dog. Finally, select the activity level that matches your dog's lifestyle.</p>
        <p>Ensure that all inputs are filled correctly to avoid errors. After entering the data, click "Calculate" to see the results.</p>
        <p>Typical pitfalls include mixing weight units and selecting an incorrect body condition. Consult your veterinarian for accurate assessments.</p>
      </section>
      <section id="inputs-explained">
        <h2>What each input means</h2>
        <p>The "Current Weight" field is for your dog's current weight. This is a crucial input as it affects the calorie calculation.</p>
        <p>The "Ideal Weight" field is for the target weight you aim for your dog to achieve. This should be based on veterinary advice.</p>
        <p>The "Body Condition" input helps adjust the calorie needs based on your dog's current condition. It reflects how much weight your dog needs to lose.</p>
        <p>The "Activity Level" input adjusts the calorie needs based on how active your dog is. More active dogs require more calories.</p>
      </section>
      <section id="understanding-results">
        <h2>Understanding your results</h2>
        <p>After calculation, you will see the target daily calories your dog needs to maintain or reach the ideal weight.</p>
        <p>The results also include an estimate of the weekly weight change and the time required to reach the target weight.</p>
        <p>These results provide a guideline and should be used in conjunction with professional veterinary advice.</p>
      </section>
      <section id="theory-formulas">
        <h2>Formulas and theory</h2>
        <p>The calculator uses the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) formulas to estimate calorie needs.</p>
        <ul>
          <li>RER = 70 * (Ideal Weight in kg)^0.75</li>
          <li>MER = RER * Activity Factor</li>
        </ul>
        <p>The activity factor varies based on the dog's activity level and body condition.</p>
        <p>Weight loss is typically safe at a rate of 0.5% to 2% of body weight per week.</p>
      </section>
      <section id="worked-example">
        <h2>Worked example</h2>
        <p>Consider a dog weighing 25 kg with an ideal weight of 20 kg. The dog is moderately overweight and has an average activity level.</p>
        <p>Step 1: Calculate RER: RER = 70 * (20)^0.75 = 662 kcal/day.</p>
        <p>Step 2: Determine MER: MER = 662 * 1.4 (activity factor) = 927 kcal/day.</p>
        <p>Step 3: Estimate weekly weight loss: 0.5% of 25 kg = 0.125 kg/week.</p>
        <p>Step 4: Calculate time to reach target weight: (25 - 20) / 0.125 = 40 weeks.</p>
        <p>Result: The dog should consume approximately 927 kcal/day to achieve a healthy weight loss over 40 weeks.</p>
      </section>
      <section id="faq">
        <h2>Frequently asked questions</h2>
        <h3>How often should I recalculate my dog's calories?</h3>
        <p>It's advisable to recalculate your dog's calorie needs every few months or after significant weight changes. Regular monitoring ensures that your dog remains on track to reach its ideal weight.</p>
        <h3>Can I use this calculator for puppies?</h3>
        <p>This calculator is designed for adult dogs. Puppies have different nutritional requirements, and it's best to consult a veterinarian for specific guidance.</p>
        <h3>What if my dog is not perfectly rectangular?</h3>
        <p>The calculator assumes average body conditions. If your dog has unique body characteristics, consult a veterinarian for a more tailored approach.</p>
        <h3>Is this calculator accurate for all breeds?</h3>
        <p>While the calculator provides general guidance, specific breeds may have unique needs. It's important to consider breed-specific factors and consult your vet.</p>
        <h3>What should I do if my dog isn't losing weight?</h3>
        <p>If your dog isn't losing weight as expected, consult your veterinarian. They can help adjust the plan and check for underlying health issues.</p>
      </section>
      <section id="limitations">
        <h2>Limitations of this tool</h2>
        <p>This calculator provides estimates based on average conditions and may not account for all individual variations.</p>
        <p>It should not replace professional veterinary advice, and users should consult a vet for personalized recommendations.</p>
        <p>Always monitor your dog's health and adjust the plan as needed under veterinary guidance.</p>
      </section>
      <section id="references">
        <h2>Scientific / technical references</h2>
        <ul>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a href="https://wsava.org" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                WSAVA Nutritional Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Guidelines on nutritional requirements for dogs and cats, including calorie needs and weight management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a href="https://petnutritionalliance.org" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Pet Nutrition Alliance
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                A resource for pet owners and veterinarians on pet nutrition and weight management.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a href="https://avma.org" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                American Veterinary Medical Association
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Provides guidelines and resources for veterinary professionals and pet owners.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a href="https://aaha.org" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                AAHA Weight Management Guidelines
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                Guidelines for managing pet weight, including calorie calculations and weight loss strategies.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <a href="https://veterinarypartner.vin.com" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Veterinary Partner
              </a>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                A comprehensive resource for pet health, including nutrition and weight management.
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
    { id: "references", label: "Scientific / technical references" }
  ];

  const formula = (
    <div>
      <h2>Formulas Used in This Calculator</h2>
      <p>This calculator uses the following formulas to estimate your dog's calorie needs:</p>
      <ul>
        <li><strong>Resting Energy Requirement (RER):</strong> RER = 70 * (Ideal Weight in kg)^0.75</li>
        <li><strong>Maintenance Energy Requirement (MER):</strong> MER = RER * Activity Factor</li>
      </ul>
      <p>Variables:</p>
      <ul>
        <li><strong>Ideal Weight:</strong> The target weight for your dog, based on veterinary advice.</li>
        <li><strong>Activity Factor:</strong> A multiplier based on your dog's activity level.</li>
        <li><strong>RER:</strong> The baseline energy requirement for a resting dog.</li>
        <li><strong>MER:</strong> The adjusted energy requirement accounting for activity level.</li>
      </ul>
    </div>
  );

  const example = {
    title: "Example: Calculating Ideal Weight and Calories for a Dog",
    scenario: "A 25 kg dog is moderately overweight and has an ideal weight of 20 kg. The dog is moderately active.",
    steps: [
      { step: 1, description: "Calculate RER for the ideal weight.", calculation: "RER = 70 * (20)^0.75 = 662 kcal/day" },
      { step: 2, description: "Determine MER using the activity factor.", calculation: "MER = 662 * 1.4 = 927 kcal/day" },
      { step: 3, description: "Estimate weekly weight loss.", calculation: "0.5% of 25 kg = 0.125 kg/week" },
      { step: 4, description: "Calculate time to reach target weight.", calculation: "(25 - 20) / 0.125 = 40 weeks" }
    ],
    result: "The dog should consume approximately 927 kcal/day to achieve a healthy weight loss over 40 weeks."
  };

  const relatedCalculators = [
    { title: "Dog Calorie Needs Calculator", url: "/pets/dogs-nutrition/dog-calorie-needs", icon: "🐶" },
    { title: "Dog Weight Loss Planner", url: "/pets/dogs-nutrition/dog-weight-loss-planner", icon: "📊" },
    { title: "Dog Treat Allowance Calculator", url: "/pets/dogs-nutrition/dog-treat-allowance", icon: "🦴" }
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
          "text": "It's advisable to recalculate your dog's calorie needs every few months or after significant weight changes. Regular monitoring ensures that your dog remains on track to reach its ideal weight."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this calculator for puppies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This calculator is designed for adult dogs. Puppies have different nutritional requirements, and it's best to consult a veterinarian for specific guidance."
        }
      },
      {
        "@type": "Question",
        "name": "What if my dog is not perfectly rectangular?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The calculator assumes average body conditions. If your dog has unique body characteristics, consult a veterinarian for a more tailored approach."
        }
      },
      {
        "@type": "Question",
        "name": "Is this calculator accurate for all breeds?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "While the calculator provides general guidance, specific breeds may have unique needs. It's important to consider breed-specific factors and consult your vet."
        }
      },
      {
        "@type": "Question",
        "name": "What should I do if my dog isn't losing weight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If your dog isn't losing weight as expected, consult your veterinarian. They can help adjust the plan and check for underlying health issues."
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