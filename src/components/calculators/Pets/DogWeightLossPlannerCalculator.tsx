import React, { useState } from 'react';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const DogWeightLossPlannerCalculator: React.FC = () => {
  const [currentWeight, setCurrentWeight] = useState<number | ''>('');
  const [idealWeight, setIdealWeight] = useState<number | ''>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [calories, setCalories] = useState<number | null>(null);

  const calculateCalories = () => {
    if (currentWeight && idealWeight) {
      const weightInKg = weightUnit === 'lb' ? currentWeight / 2.20462 : currentWeight;
      const idealWeightInKg = weightUnit === 'lb' ? idealWeight / 2.20462 : idealWeight;
      const calorieTarget = 70 * Math.pow(idealWeightInKg, 0.75);
      setCalories(calorieTarget);
    }
  };

  return (
    <CalculatorVerticalLayout>
      <Card>
        <CardHeader>
          <CardTitle>Dog Weight Loss Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor='current-weight'>Current Weight</Label>
          <Input
            id='current-weight'
            type='number'
            value={currentWeight}
            onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
            placeholder='Enter current weight'
          />
          <Label htmlFor='ideal-weight'>Ideal Weight</Label>
          <Input
            id='ideal-weight'
            type='number'
            value={idealWeight}
            onChange={(e) => setIdealWeight(parseFloat(e.target.value))}
            placeholder='Enter ideal weight'
          />
          <Label htmlFor='weight-unit'>Weight Unit</Label>
          <select
            id='weight-unit'
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lb')}
          >
            <option value='kg'>Kilograms (kg)</option>
            <option value='lb'>Pounds (lb)</option>
          </select>
          <Button onClick={calculateCalories}>Calculate</Button>
          {calories !== null && (
            <Alert>
              <AlertTitle>Calorie Target</AlertTitle>
              <AlertDescription>
                Your dog's daily calorie target for weight loss is approximately {calories.toFixed(2)} kcal.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <section>
        <h2>Introduction</h2>
        <p>
          Managing your dog's weight is crucial for their overall health and well-being. The Dog Weight Loss Planner helps you
          determine the appropriate calorie intake to safely achieve your dog's ideal weight. Use this tool when you want to
          plan a weight loss program for your dog.
        </p>
        <p>
          This calculator provides a guideline for daily calorie intake, but it's important to consult with your veterinarian
          to tailor a plan specific to your dog's needs.
        </p>

        <h2>How to Use This Calculator</h2>
        <ol>
          <li>Enter your dog's current weight in the input field.</li>
          <li>Enter your dog's ideal weight goal.</li>
          <li>Select the unit of measurement (kg or lb).</li>
          <li>Click "Calculate" to see the recommended daily calorie intake for weight loss.</li>
          <li>Use this information as a guideline and consult your veterinarian for a personalized plan.</li>
        </ol>

        <h2>Formulas / Theory</h2>
        <p>
          The calorie target is calculated using the formula: 70 x (Ideal Weight in kg)^0.75. This formula estimates the
          resting energy requirement (RER) for the ideal weight, which is then used to guide weight loss calorie intake.
        </p>

        <h2>Worked Example</h2>
        <p>
          Suppose your dog currently weighs 30 kg and the ideal weight is 25 kg. Using the formula:
          70 x (25)^0.75 = 945 kcal. This is the estimated daily calorie intake to help your dog reach the ideal weight.
        </p>

        <h2>Frequently Asked Questions</h2>
        <h3>How quickly should my dog lose weight?</h3>
        <p>
          A safe weight loss rate for dogs is about 0.5% to 2% of their body weight per week. Rapid weight loss can be
          harmful, so it's important to follow a gradual plan.
        </p>
        <h3>Can I use this calculator for puppies?</h3>
        <p>
          This calculator is designed for adult dogs. Puppies have different nutritional needs, and you should consult your
          veterinarian for advice on managing a puppy's weight.
        </p>
        <h3>What if my dog doesn't lose weight?</h3>
        <p>
          If your dog isn't losing weight as expected, consult your veterinarian. They can help adjust the plan and check for
          underlying health issues.
        </p>
        <h3>Is exercise important for weight loss?</h3>
        <p>
          Yes, exercise is a key component of a weight loss plan. It helps burn calories and maintain muscle mass. Discuss
          suitable exercise routines with your veterinarian.
        </p>

        <h2>References</h2>
        <ul>
          <li>American Veterinary Medical Association. (2021). Dog Nutrition Tips.</li>
          <li>World Small Animal Veterinary Association. (2020). Nutritional Assessment Guidelines.</li>
          <li>Pet Obesity Prevention. (2021). Weight Management for Dogs.</li>
        </ul>
      </section>
    </CalculatorVerticalLayout>
  );
};

export default DogWeightLossPlannerCalculator;