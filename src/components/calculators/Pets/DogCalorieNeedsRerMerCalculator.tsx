import React, { useState, useMemo, useRef } from 'react';
import { CalculatorVerticalLayout } from "@/components/templates/CalculatorVerticalLayout";
import { HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Button, Input, Label } from '@/components/ui';

const DogCalorieNeedsRerMerCalculator: React.FC = () => {
  const [inputs, setInputs] = useState({ weight: '', age: '', activityLevel: '' });
  const [showFullTable, setShowFullTable] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const formatValue = (value: number, type: "weight" | "currency") => {
    if (type === "weight") return `${value.toFixed(2)} kg`;
    if (type === "currency") return `$${value.toFixed(2)}`;
    return value.toString();
  };

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight) || 0;
    const age = parseFloat(inputs.age) || 0;
    const activityMultiplier = inputs.activityLevel === 'high' ? 1.8 : inputs.activityLevel === 'medium' ? 1.6 : 1.4;

    const rer = 70 * Math.pow(weight, 0.75);
    const mer = rer * activityMultiplier;

    const weeklyCalories = mer * 7;
    const monthlyCost = (weeklyCalories / 1000) * 30;

    const scheduleData = Array.from({ length: 14 }, (_, i) => ({
      period: `Day ${i + 1}`,
      value: mer,
    }));

    return { rer, mer, weeklyCalories, monthlyCost, scheduleData };
  }, [inputs]);

  const handleCalculate = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setInputs({ weight: '', age: '', activityLevel: '' });
    setShowFullTable(false);
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      widget={
        <div>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight in kg"
                value={inputs.weight}
                onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age in years"
                value={inputs.age}
                onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="activityLevel">Activity Level</Label>
              <select
                id="activityLevel"
                value={inputs.activityLevel}
                onChange={(e) => setInputs({ ...inputs, activityLevel: e.target.value })}
              >
                <option value="">Select activity level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Button onClick={handleCalculate}>Calculate</Button>
            <Button onClick={handleReset} variant="secondary">Reset</Button>
          </div>
          <div ref={resultsRef} className="grid grid-cols-2 gap-4 mt-6">
            <Card className="col-span-full bg-gradient-to-r from-blue-500 to-blue-300 text-white text-5xl font-bold">
              <CardContent>
                {formatValue(results.mer, "currency")} kcal/day
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <span>Weekly Calories: {formatValue(results.weeklyCalories, "currency")} kcal</span>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <span>Monthly Cost: {formatValue(results.monthlyCost, "currency")}</span>
              </CardContent>
            </Card>
            {results.scheduleData && results.scheduleData.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>Feeding Schedule</span>
                    {results.scheduleData.length > 12 && (
                      <Button onClick={() => setShowFullTable(!showFullTable)} size="sm">
                        {showFullTable ? 'Show Less' : `Show All ${results.scheduleData.length}`}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Calories (kcal)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.scheduleData.slice(0, showFullTable ? undefined : 12).map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{row.period}</TableCell>
                          <TableCell>{formatValue(row.value, "currency")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      }
      editorial={
        <div>
          <section>
            <h2 className="text-2xl font-bold">Introduction</h2>
            <p>
              Understanding your dog's calorie needs is essential for maintaining their health and well-being. Dogs, like humans, require a certain number of calories each day to support their energy levels and bodily functions. This calculator helps you determine your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER), giving you insights into their daily calorie needs based on weight, age, and activity level.
            </p>
            <p>
              Whether you have a playful puppy or a more sedentary senior dog, ensuring they receive the right amount of calories can prevent obesity and other health issues. This tool is designed to guide pet owners in making informed decisions about their dog's diet, promoting a balanced and healthy lifestyle.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold">Formula</h2>
            <div className="bg-slate-100 dark:bg-slate-800 p-8">
              <p>The RER is calculated using the formula:</p>
              <p className="font-bold">RER = 70 * (Weight in kg)<sup>0.75</sup></p>
              <p>The MER is then determined by multiplying the RER by an activity factor:</p>
              <ul>
                <li>Low activity: 1.4</li>
                <li>Medium activity: 1.6</li>
                <li>High activity: 1.8</li>
              </ul>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold">Factors Influencing Calorie Needs</h2>
            <p>
              Several factors influence a dog's calorie requirements. The primary factors include:
            </p>
            <ul>
              <li><strong>Weight:</strong> Heavier dogs require more calories to maintain their body weight.</li>
              <li><strong>Age:</strong> Puppies and young dogs need more calories for growth, while older dogs may require fewer calories.</li>
              <li><strong>Activity Level:</strong> Active dogs burn more calories and thus need more food than less active dogs.</li>
              <li><strong>Breed:</strong> Some breeds have higher metabolic rates and may require more calories.</li>
              <li><strong>Health Status:</strong> Health conditions such as pregnancy or illness can affect calorie needs.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold">FAQ</h2>
            <div>
              <h3 className="text-xl font-bold flex items-center"><HelpCircle className="mr-2" />What is the RER?</h3>
              <p>
                The Resting Energy Requirement (RER) is the amount of energy required by your dog at rest in a thermoneutral environment. It accounts for the energy needed to maintain basic bodily functions like breathing, circulation, and cell production.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center"><HelpCircle className="mr-2" />What is the MER?</h3>
              <p>
                The Maintenance Energy Requirement (MER) is the energy a dog needs to maintain its current weight, considering its activity level. It includes the RER and additional calories for physical activity.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center"><HelpCircle className="mr-2" />How do I know my dog's activity level?</h3>
              <p>
                Activity level can be categorized as low, medium, or high based on your dog's daily physical activity. Low activity might include short walks, medium activity involves regular playtime, and high activity includes running or other vigorous exercises.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center"><HelpCircle className="mr-2" />Why is it important to calculate my dog's calorie needs?</h3>
              <p>
                Calculating your dog's calorie needs helps prevent overfeeding or underfeeding, both of which can lead to health issues. Proper nutrition supports a healthy weight, energy levels, and overall well-being.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center"><HelpCircle className="mr-2" />Can I use this calculator for puppies?</h3>
              <p>
                Yes, but keep in mind that puppies have higher calorie needs due to growth. Adjustments may be necessary, and consulting with a veterinarian for a tailored plan is recommended.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center"><HelpCircle className="mr-2" />What should I do if my dog is overweight?</h3>
              <p>
                If your dog is overweight, consider reducing calorie intake and increasing physical activity. Consult with a veterinarian for a weight management plan tailored to your dog's needs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center"><HelpCircle className="mr-2" />How often should I recalculate my dog's calorie needs?</h3>
              <p>
                It's advisable to recalculate your dog's calorie needs periodically, especially if there are changes in weight, age, or activity level. Regular assessments ensure your dog receives the right amount of nutrition.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center"><HelpCircle className="mr-2" />Can this calculator replace veterinary advice?</h3>
              <p>
                While this calculator provides a good estimate of calorie needs, it should not replace professional veterinary advice. Always consult with a veterinarian for personalized recommendations based on your dog's specific health needs.
              </p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold">References</h2>
            <ul>
              <li><a href="https://www.akc.org" target="_blank" rel="noopener noreferrer">American Kennel Club (Dog Care)</a> - Expert guidance on dog breeds, health, and nutrition</li>
              <li><a href="https://www.avma.org" target="_blank" rel="noopener noreferrer">AVMA (Veterinary Standards)</a> - American Veterinary Medical Association guidelines</li>
              <li><a href="https://www.aspca.org" target="_blank" rel="noopener noreferrer">ASPCA (Animal Welfare)</a> - Pet care and animal welfare information</li>
              <li><a href="https://www.petmd.com" target="_blank" rel="noopener noreferrer">PetMD (Pet Health)</a> - Veterinarian-reviewed pet health information</li>
              <li><a href="https://www.vet.cornell.edu" target="_blank" rel="noopener noreferrer">Cornell Vet (Veterinary Research)</a> - Leading veterinary research and resources</li>
              <li><a href="https://www.wsava.org" target="_blank" rel="noopener noreferrer">WSAVA (Nutrition Standards)</a> - Global veterinary nutrition guidelines</li>
            </ul>
          </section>
        </div>
      }
      onThisPage={["Introduction", "Formula", "Factors Influencing Calorie Needs", "FAQ", "References"]}
      formula={{
        formula: "RER = 70 * (Weight in kg)^0.75; MER = RER * Activity Factor",
        variables: [
          { name: "RER", description: "Resting Energy Requirement" },
          { name: "MER", description: "Maintenance Energy Requirement" },
          { name: "Activity Factor", description: "Multiplier based on activity level" }
        ]
      }}
      example={{
        steps: [
          "Input your dog's weight in kilograms.",
          "Select the age and activity level.",
          "Calculate the RER using the formula: RER = 70 * (Weight in kg)^0.75.",
          "Determine the MER by multiplying the RER by the activity factor.",
          "Review the results for daily, weekly, and monthly needs."
        ]
      }}
      relatedCalculators={[
        { title: "Puppy Adult Size Predictor (Weight Curve)", url: "/pets/puppy-adult-size-predictor-weight-curve", icon: "🐶" },
        { title: "Rabbit Treat Calories & Safe Portion", url: "/pets/rabbit-treat-calories-safe-portion", icon: "🐰" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
        { title: "Dewormer & Antibiotic Dose Reference", url: "/pets/reptile-dewormer-antibiotic-dose-reference", icon: "🦎" }
      ]}
    />
  );
};

export default DogCalorieNeedsRerMerCalculator;