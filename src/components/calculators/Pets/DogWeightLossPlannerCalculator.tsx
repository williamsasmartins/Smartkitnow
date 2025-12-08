import { useState, useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Calculator, Info, AlertCircle, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogWeightLossPlannerCalculator() {
  const [currentWeight, setCurrentWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [calories, setCalories] = useState("");
  const resultRef = useRef(null);

  const calculateCalories = () => {
    const currentWeightKg = unit === "lb" ? parseFloat(currentWeight) * 0.45359237 : parseFloat(currentWeight);
    const goalWeightKg = unit === "lb" ? parseFloat(goalWeight) * 0.45359237 : parseFloat(goalWeight);
    const dailyCalories = 70 * Math.pow(goalWeightKg, 0.75);
    setCalories(dailyCalories.toFixed(2));
    if (resultRef.current) {
      window.scrollTo({ top: resultRef.current.offsetTop, behavior: "smooth" });
    }
  };

  const widget = (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Dog Weight Loss Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="currentWeight">Current Weight</Label>
          <Input
            id="currentWeight"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder="Enter current weight"
          />
          <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </Select>
          <Label htmlFor="goalWeight">Goal Weight</Label>
          <Input
            id="goalWeight"
            value={goalWeight}
            onChange={(e) => setGoalWeight(e.target.value)}
            placeholder="Enter goal weight"
          />
          <Button onClick={calculateCalories}>Calculate</Button>
        </CardContent>
      </Card>
      {calories && (
        <Card ref={resultRef}>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Daily Caloric Intake: {calories} kcal</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div>
      <section id="how-to-use">
        <h2>How to Use the Dog Weight Loss Planner</h2>
        <p>This tool helps you plan a safe and effective weight loss program for your dog. By entering your dog's current and goal weights, you can calculate the daily caloric intake needed to reach the desired weight.</p>
        <p>Ensure you consult with a veterinarian before starting any weight loss program for your pet.</p>
        <p>Follow these steps to use the calculator:</p>
        <ul>
          <li>Enter your dog's current weight.</li>
          <li>Select the unit of measurement (kg or lb).</li>
          <li>Enter your dog's goal weight.</li>
          <li>Click "Calculate" to see the recommended daily caloric intake.</li>
        </ul>
      </section>
      <section id="formulas">
        <h2>Formulas Used</h2>
        <p>The calculation is based on the Resting Energy Requirement (RER) formula, which estimates the daily caloric needs of a dog at rest.</p>
        <p>RER = 70 * (Goal Weight in kg)^0.75</p>
      </section>
      <section id="example">
        <h2>Example Calculation</h2>
        <p>Let's say your dog currently weighs 30 kg and you want to reduce its weight to 25 kg.</p>
        <ol>
          <li>Enter "30" in the current weight field and select "kg".</li>
          <li>Enter "25" in the goal weight field.</li>
          <li>Click "Calculate".</li>
          <li>The result will show a daily caloric intake of approximately 840 kcal.</li>
        </ol>
      </section>
      <section id="faq">
        <h2>Frequently Asked Questions</h2>
        <h3>How accurate is this calculator?</h3>
        <p>The calculator provides an estimate based on standard formulas. Always consult with a veterinarian for personalized advice.</p>
        <h3>Can I use this for other pets?</h3>
        <p>This calculator is specifically designed for dogs. Consult a vet for other pets.</p>
        <h3>What if my dog is very active?</h3>
        <p>Active dogs may require more calories. Adjust the intake based on activity level and consult a vet.</p>
        <h3>Is weight loss safe for all dogs?</h3>
        <p>Weight loss should be monitored by a vet to ensure it's safe and effective for your dog's health.</p>
      </section>
      <section id="references">
        <h2>References</h2>
        <ul>
          <li><BookOpen className="inline-block" /> Veterinary Nutrition Guidelines</li>
          <li><BookOpen className="inline-block" /> Canine Weight Management Studies</li>
          <li><BookOpen className="inline-block" /> Pet Health and Nutrition Journals</li>
          <li><BookOpen className="inline-block" /> American Veterinary Medical Association</li>
        </ul>
      </section>
    </div>
  );

  const onThisPage = [
    { id: "how-to-use", title: "How to Use" },
    { id: "formulas", title: "Formulas" },
    { id: "example", title: "Example" },
    { id: "faq", title: "FAQ" },
    { id: "references", title: "References" }
  ];

  const formula = {
    title: "Resting Energy Requirement Formula",
    main: "RER = 70 * (Goal Weight in kg)^0.75",
    variables: [
      { symbol: "RER", name: "Resting Energy Requirement", description: "The daily caloric needs of a dog at rest." },
      { symbol: "kg", name: "Kilograms", description: "The unit of weight used in the formula." }
    ]
  };

  const example = {
    title: "Example Calculation",
    scenario: "Dog weight loss from 30 kg to 25 kg",
    result: "Daily caloric intake: 840 kcal",
    steps: [
      { step: 1, description: "Enter current weight: 30 kg", calculation: "" },
      { step: 2, description: "Enter goal weight: 25 kg", calculation: "" },
      { step: 3, description: "Calculate RER using the formula", calculation: "RER = 70 * (25)^0.75" },
      { step: 4, description: "Result: 840 kcal", calculation: "" }
    ]
  };

  const relatedCalculators = [
    { title: "Dog Calorie Calculator", url: "/dog-calorie-calculator", icon: "🐶" },
    { title: "Pet Nutrition Planner", url: "/pet-nutrition-planner", icon: "📊" },
    { title: "Dog BMI Calculator", url: "/dog-bmi-calculator", icon: "➗" }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How accurate is this calculator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The calculator provides an estimate based on standard formulas. Always consult with a veterinarian for personalized advice."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this for other pets?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This calculator is specifically designed for dogs. Consult a vet for other pets."
        }
      },
      {
        "@type": "Question",
        "name": "What if my dog is very active?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Active dogs may require more calories. Adjust the intake based on activity level and consult a vet."
        }
      },
      {
        "@type": "Question",
        "name": "Is weight loss safe for all dogs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Weight loss should be monitored by a vet to ensure it's safe and effective for your dog's health."
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
      icon={<Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default DogWeightLossPlannerCalculator;