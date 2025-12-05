import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

export default function DogCalorieNeedsCalculator() {
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [activityLevel, setActivityLevel] = useState<number>(1.6);
  const [rer, setRer] = useState<number | undefined>(undefined);
  const [mer, setMer] = useState<number | undefined>(undefined);

  const calculateCalories = () => {
    if (weight) {
      const calculatedRER = 70 * Math.pow(weight, 0.75);
      const calculatedMER = calculatedRER * activityLevel;
      setRer(calculatedRER);
      setMer(calculatedMER);
    }
  };

  const resetCalculator = () => {
    setWeight(undefined);
    setActivityLevel(1.6);
    setRer(undefined);
    setMer(undefined);
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula", label: "Formula & Variables" },
        { id: "examples", label: "Examples" },
        { id: "tips", label: "Tips & Notes" },
        { id: "faq", label: "Frequently Asked Questions" },
      ]}
      formula={{
        formula: "RER = 70 * (Weight^0.75); MER = RER * Activity Level",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement in kcal/day" },
          { symbol: "MER", description: "Maintenance Energy Requirement in kcal/day" },
          { symbol: "Weight", description: "Dog's weight in kilograms" },
          { symbol: "Activity Level", description: "Multiplier based on dog's activity" },
        ],
        title: "RER and MER Formulas"
      }}
      example={{
        title: "Example Calculation",
        scenario: "Calculate the daily calorie needs for a 20 kg dog with moderate activity.",
        steps: [
          {
            step: 1,
            description: "Calculate the RER using the formula.",
            calculation: "RER = 70 * (20^0.75) = 662.4 kcal/day"
          },
          {
            step: 2,
            description: "Determine the MER by multiplying RER by the activity level.",
            calculation: "MER = 662.4 * 1.6 = 1059.84 kcal/day"
          },
          {
            step: 3,
            description: "Round the MER to the nearest whole number.",
            calculation: "MER ≈ 1060 kcal/day"
          }
        ],
        result: "A 20 kg dog with moderate activity needs approximately 1060 kcal/day."
      }}
      relatedCalculators={[
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐾" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐾" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐾" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🐾" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐾" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐾" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enter Dog's Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight ?? ""}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  placeholder="Enter weight in kg"
                />
              </div>
              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <select
                  id="activity"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  <option value={1.2}>Sedentary (1.2)</option>
                  <option value={1.4}>Low Activity (1.4)</option>
                  <option value={1.6}>Moderate Activity (1.6)</option>
                  <option value={1.8}>High Activity (1.8)</option>
                  <option value={2.0}>Very High Activity (2.0)</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <Button onClick={calculateCalories}>Calculate</Button>
                <Button onClick={resetCalculator} variant="outline">Reset</Button>
              </div>
            </CardContent>
          </Card>
          {rer !== undefined && mer !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label>Resting Energy Requirement (RER):</Label>
                  <p>{rer.toFixed(2)} kcal/day</p>
                </div>
                <div>
                  <Label>Maintenance Energy Requirement (MER):</Label>
                  <p>{mer.toFixed(2)} kcal/day</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      }
      editorial={
        <div className="skn-editorial-sections space-y-10">
          <section id="how-to-use">
            <h2 className="text-3xl font-bold mb-4">How to Use This Calculator</h2>
            <p className="mb-4">
              To use this calculator, enter your dog's weight in kilograms and select the appropriate activity level from the dropdown menu. Click "Calculate" to determine the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) for your dog. The results will display the daily calorie needs in kilocalories (kcal).
            </p>
          </section>

          <section id="formula">
            <h2 className="text-3xl font-bold mb-4">Formula & Variables</h2>
            <p className="mb-4">
              The calculator uses the following formulas to estimate your dog's calorie needs:
              <ul className="list-disc ml-6">
                <li><strong>RER (Resting Energy Requirement):</strong> RER = 70 * (Weight^0.75)</li>
                <li><strong>MER (Maintenance Energy Requirement):</strong> MER = RER * Activity Level</li>
              </ul>
              These formulas are widely used in veterinary medicine to estimate the energy requirements of dogs based on their weight and activity level. The RER represents the energy needed for basic bodily functions at rest, while the MER accounts for additional energy required for daily activities.
            </p>
          </section>

          <section id="examples">
            <h2 className="text-3xl font-bold mb-4">Examples</h2>
            <p className="mb-4">
              Consider a 20 kg dog with moderate activity. Using the calculator, you would enter 20 kg for the weight and select "Moderate Activity" (1.6) as the activity level. The calculator will compute the RER as 662.4 kcal/day and the MER as approximately 1060 kcal/day. This indicates the dog needs around 1060 kcal per day to maintain its current weight and activity level.
            </p>
          </section>

          <section id="tips">
            <h2 className="text-3xl font-bold mb-4">Tips & Practical Notes</h2>
            <p className="mb-4">
              When using this calculator, ensure that you have an accurate measurement of your dog's weight. The activity level should reflect your dog's typical daily routine. Note that these calculations provide estimates and individual needs may vary. Always consult with a veterinarian for personalized dietary recommendations for your dog.
            </p>
          </section>

          <section id="faq">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">What is the difference between RER and MER?</h3>
                <p className="mb-2">
                  RER (Resting Energy Requirement) is the amount of energy a dog needs at rest, while MER (Maintenance Energy Requirement) includes additional energy for daily activities. MER is typically higher than RER.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How accurate are these calculations?</h3>
                <p className="mb-2">
                  These calculations provide a general estimate of calorie needs. Individual dogs may have different requirements based on factors such as age, breed, health status, and specific activity levels. Consult a veterinarian for precise dietary advice.
                </p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
}