import React, { useState } from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Button, Input, Label, Select, Card } from '@/components/ui';

const DogWeightLossPlannerCalculator: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState<string>('kg');
  const [caloricIntake, setCaloricIntake] = useState<number>(0);
  const [result, setResult] = useState<string>('');

  const calculateWeightLossPlan = () => {
    if (currentWeight > targetWeight) {
      const weightDifference = currentWeight - targetWeight;
      const caloricDeficit = weightDifference * 7700; // 7700 kcal per kg of body weight
      const dailyCaloricIntake = caloricIntake - (caloricDeficit / 30); // Assuming a 30-day plan
      setResult(`To reach the target weight, your dog's daily caloric intake should be approximately ${dailyCaloricIntake.toFixed(2)} kcal.`);
    } else {
      setResult('Please ensure the target weight is less than the current weight.');
    }
  };

  return (
    <CalculatorVerticalLayout>
      <section>
        <h1>Dog Weight Loss Planner</h1>
        <p>Plan a safe and effective weight loss program for your dog. Calculate the target calories and timeline for achieving your dog's goal weight.</p>
      </section>
      <Card>
        <h2>Weight Loss Calculator</h2>
        <div>
          <Label htmlFor="currentWeight">Current Weight</Label>
          <Input
            id="currentWeight"
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
            placeholder="Enter current weight"
          />
          <Select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)}>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="targetWeight">Target Weight</Label>
          <Input
            id="targetWeight"
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(parseFloat(e.target.value))}
            placeholder="Enter target weight"
          />
        </div>
        <div>
          <Label htmlFor="caloricIntake">Current Caloric Intake (kcal/day)</Label>
          <Input
            id="caloricIntake"
            type="number"
            value={caloricIntake}
            onChange={(e) => setCaloricIntake(parseFloat(e.target.value))}
            placeholder="Enter current caloric intake"
          />
        </div>
        <Button onClick={calculateWeightLossPlan}>Calculate</Button>
        {result && <p>{result}</p>}
      </Card>
      <Card>
        <h2>Introduction</h2>
        <p>Managing your dog's weight is crucial for their overall health and longevity. This calculator helps you plan a weight loss program by estimating the daily caloric intake needed to achieve a target weight. Use this tool to ensure your dog loses weight safely and effectively.</p>
        <p>It's important to consult with your veterinarian before starting any weight loss program for your dog. This calculator provides estimates and should not replace professional advice.</p>
      </Card>
      <Card>
        <h2>How to Use This Calculator</h2>
        <ol>
          <li>Enter your dog's current weight in either kilograms or pounds.</li>
          <li>Input the target weight you aim for your dog to achieve.</li>
          <li>Provide the current daily caloric intake of your dog.</li>
          <li>Click "Calculate" to see the recommended daily caloric intake for weight loss.</li>
          <li>Consult your veterinarian to validate the plan and adjust as necessary.</li>
        </ol>
      </Card>
      <Card>
        <h2>Formulas / Theory</h2>
        <p>The primary formula used in this calculator is based on the caloric deficit required to lose weight:</p>
        <p>Caloric Deficit = (Current Weight - Target Weight) × 7700 kcal/kg</p>
        <p>Where:</p>
        <ul>
          <li>Current Weight and Target Weight are in kilograms.</li>
          <li>7700 kcal is the approximate caloric content of 1 kg of body weight.</li>
        </ul>
        <p>The daily caloric intake is adjusted by dividing the total caloric deficit over a 30-day period.</p>
      </Card>
      <Card>
        <h2>Worked Example</h2>
        <p>Suppose your dog currently weighs 20 kg and you want to reduce its weight to 18 kg. The current caloric intake is 1000 kcal/day.</p>
        <p>Weight Difference = 20 kg - 18 kg = 2 kg</p>
        <p>Caloric Deficit = 2 kg × 7700 kcal/kg = 15400 kcal</p>
        <p>Daily Caloric Adjustment = 15400 kcal / 30 days = 513.33 kcal/day</p>
        <p>New Daily Caloric Intake = 1000 kcal - 513.33 kcal = 486.67 kcal</p>
        <p>Therefore, to achieve the target weight in 30 days, the daily caloric intake should be approximately 487 kcal.</p>
      </Card>
      <Card>
        <h2>Frequently Asked Questions</h2>
        <h3>Why is weight management important for dogs?</h3>
        <p>Maintaining a healthy weight helps prevent various health issues such as diabetes, arthritis, and heart disease. It also improves your dog's quality of life and longevity.</p>
        <h3>How do I know if my dog is overweight?</h3>
        <p>Consult your veterinarian for an accurate assessment. Signs of being overweight include difficulty feeling ribs, lack of a waist, and reduced energy levels.</p>
        <h3>Can I use this calculator for puppies?</h3>
        <p>This calculator is designed for adult dogs. Puppies have different nutritional needs and growth patterns. Consult your veterinarian for puppy-specific advice.</p>
        <h3>What if my dog is not losing weight?</h3>
        <p>If your dog is not losing weight as expected, consult your veterinarian. They can help adjust the diet plan and check for underlying health issues.</p>
      </Card>
      <Card>
        <h2>References</h2>
        <ul>
          <li>National Research Council. Nutrient Requirements of Dogs and Cats. National Academies Press, 2006.</li>
          <li>Association of American Feed Control Officials (AAFCO). Dog and Cat Food Nutrient Profiles.</li>
          <li>World Small Animal Veterinary Association (WSAVA). Global Nutrition Guidelines.</li>
          <li>American Veterinary Medical Association (AVMA). Obesity in Pets.</li>
          <li>Pet Obesity Prevention. 2021 Pet Obesity Survey Results.</li>
        </ul>
      </Card>
    </CalculatorVerticalLayout>
  );
};

export default DogWeightLossPlannerCalculator;