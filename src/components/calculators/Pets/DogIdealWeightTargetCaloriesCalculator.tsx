import { useState, useMemo, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Calculator, Info, AlertCircle, BookOpen } from "lucide-react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";

function DogIdealWeightTargetCaloriesCalculator() {
  const [currentWeight, setCurrentWeight] = useState("");
  const [idealWeight, setIdealWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [calories, setCalories] = useState("");
  const resultRef = useRef(null);

  const handleCalculate = () => {
    let currentWeightKg = parseFloat(currentWeight);
    let idealWeightKg = parseFloat(idealWeight);

    if (unit === "lb") {
      currentWeightKg *= 0.45359237;
      idealWeightKg *= 0.45359237;
    }

    const targetCalories = idealWeightKg * 30 + 70;
    setCalories(targetCalories.toFixed(2));

    if (resultRef.current) {
      window.scrollTo({
        top: resultRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const widget = (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Dog Ideal Weight & Target Calories Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="currentWeight">Current Weight</Label>
          <Input
            id="currentWeight"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
            placeholder="Enter current weight"
          />
          <Label htmlFor="idealWeight">Ideal Weight</Label>
          <Input
            id="idealWeight"
            value={idealWeight}
            onChange={(e) => setIdealWeight(e.target.value)}
            placeholder="Enter ideal weight"
          />
          <Label htmlFor="unit">Unit</Label>
          <Select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            options={[
              { value: "kg", label: "kg" },
              { value: "lb", label: "lb" },
            ]}
          />
          <Button onClick={handleCalculate}>Calculate</Button>
        </CardContent>
      </Card>
      {calories && (
        <Card ref={resultRef}>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              To maintain an ideal weight of {idealWeight} {unit}, your dog
              needs approximately {calories} calories per day.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div>
      <section id="how-to-use">
        <h2>How to Use</h2>
        <p>
          This calculator helps you determine the ideal weight for your dog and
          the daily calorie intake needed to maintain it. Enter your dog's
          current and ideal weights, select the unit of measurement, and click
          "Calculate".
        </p>
        <p>
          The results will show the recommended daily calorie intake for your
          dog to achieve and maintain its ideal weight.
        </p>
        <p>
          Use this tool to ensure your dog stays healthy and fit by maintaining
          an appropriate weight.
        </p>
        <ul>
          <li>Current Weight: Enter your dog's current weight.</li>
          <li>Ideal Weight: Enter the ideal weight for your dog.</li>
          <li>Unit: Select the unit of measurement (kg or lb).</li>
        </ul>
      </section>
      <section id="formulas">
        <h2>Formulas</h2>
        <p>
          The formula used to calculate the target calorie intake is based on
          the ideal weight of your dog:
        </p>
        <p>Calories = Ideal Weight (kg) * 30 + 70</p>
        <p>
          This formula provides an estimate of the daily calorie needs for your
          dog to maintain its ideal weight.
        </p>
      </section>
      <section id="example">
        <h2>Example</h2>
        <p>
          Let's say you have a dog that currently weighs 25 kg, but the ideal
          weight for its breed and size is 20 kg. You want to calculate the
          target calorie intake.
        </p>
        <ol>
          <li>Enter "25" as the current weight.</li>
          <li>Enter "20" as the ideal weight.</li>
          <li>Select "kg" as the unit.</li>
          <li>Click "Calculate".</li>
        </ol>
        <p>
          The calculator will show that your dog needs approximately 670
          calories per day to maintain an ideal weight of 20 kg.
        </p>
      </section>
      <section id="faq">
        <h2>FAQ</h2>
        <h3>What is the ideal weight for my dog?</h3>
        <p>
          The ideal weight varies by breed and size. Consult your veterinarian
          for specific guidance.
        </p>
        <h3>How do I know if my dog is overweight?</h3>
        <p>
          Signs of being overweight include difficulty in feeling ribs, lack of
          a waist, and reduced energy levels.
        </p>
        <h3>Can I use this calculator for puppies?</h3>
        <p>
          This calculator is designed for adult dogs. Puppies have different
          nutritional needs.
        </p>
        <h3>How often should I weigh my dog?</h3>
        <p>
          Regular weigh-ins, such as monthly, can help monitor your dog's
          weight.
        </p>
      </section>
      <section id="references">
        <h2>References</h2>
        <ul>
          <li>
            <BookOpen className="inline-block" /> American Kennel Club - Dog
            Nutrition
          </li>
          <li>
            <BookOpen className="inline-block" /> PetMD - Ideal Dog Weight
          </li>
          <li>
            <BookOpen className="inline-block" /> ASPCA - Pet Nutrition
          </li>
          <li>
            <BookOpen className="inline-block" /> VCA Hospitals - Dog Weight
            Management
          </li>
        </ul>
      </section>
    </div>
  );

  const onThisPage = [
    { id: "how-to-use", title: "How to Use" },
    { id: "formulas", title: "Formulas" },
    { id: "example", title: "Example" },
    { id: "faq", title: "FAQ" },
    { id: "references", title: "References" },
  ];

  const formula = {
    title: "Calorie Calculation Formula",
    main: "Calories = Ideal Weight (kg) * 30 + 70",
    variables: [
      {
        symbol: "Calories",
        name: "Calories",
        description: "The daily calorie intake needed to maintain ideal weight.",
      },
      {
        symbol: "Ideal Weight",
        name: "Ideal Weight",
        description: "The target weight for the dog in kilograms.",
      },
    ],
  };

  const example = {
    title: "Example Calculation",
    scenario: "Calculate target calories for a dog with an ideal weight of 20 kg.",
    result: "670 calories per day",
    steps: [
      {
        step: 1,
        description: "Enter current weight as 25 kg.",
        calculation: "Current Weight = 25 kg",
      },
      {
        step: 2,
        description: "Enter ideal weight as 20 kg.",
        calculation: "Ideal Weight = 20 kg",
      },
      {
        step: 3,
        description: "Select kg as the unit.",
        calculation: "Unit = kg",
      },
      {
        step: 4,
        description: "Calculate target calories.",
        calculation: "Calories = 20 * 30 + 70 = 670",
      },
    ],
  };

  const relatedCalculators = [
    { title: "Dog BMI Calculator", url: "/dog-bmi-calculator", icon: "🐶" },
    { title: "Dog Age Calculator", url: "/dog-age-calculator", icon: "📊" },
    { title: "Dog Calorie Calculator", url: "/dog-calorie-calculator", icon: "➗" },
    { title: "Pet Nutrition Calculator", url: "/pet-nutrition-calculator", icon: "💰" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the ideal weight for my dog?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The ideal weight varies by breed and size. Consult your veterinarian for specific guidance."
        }
      },
      {
        "@type": "Question",
        "name": "How do I know if my dog is overweight?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Signs of being overweight include difficulty in feeling ribs, lack of a waist, and reduced energy levels."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use this calculator for puppies?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "This calculator is designed for adult dogs. Puppies have different nutritional needs."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I weigh my dog?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Regular weigh-ins, such as monthly, can help monitor your dog's weight."
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
      icon={<Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
    />
  );
}

export default DogIdealWeightTargetCaloriesCalculator;