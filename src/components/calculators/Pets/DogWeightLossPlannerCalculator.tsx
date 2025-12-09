import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Info } from "lucide-react";

function DogCalorieNeedsRerMer() {
  const [inputs, setInputs] = useState({
    weightKg: "",
    activityFactor: "1.6"
  });

  const weight = parseFloat(inputs.weightKg);
  const activityFactor = parseFloat(inputs.activityFactor);

  const results = useMemo(() => {
    if (isNaN(weight) || weight <= 0 || isNaN(activityFactor) || activityFactor <= 0) {
      return { rer: 0, mer: 0 };
    }
    // RER = 70 × (weight in kg)^0.75
    const rer = 70 * Math.pow(weight, 0.75);
    // MER = RER × activity factor
    const mer = rer * activityFactor;
    return { rer: rer, mer: mer };
  }, [weight, activityFactor]);

  function handleCalculate() {
    // No additional action needed since useMemo updates automatically
  }

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      widget={
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculator Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weightKg">Dog's Weight (kg)</Label>
                <Input
                  id="weightKg"
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.weightKg}
                  onChange={(e) => setInputs({ ...inputs, weightKg: e.target.value })}
                  placeholder="Enter weight in kilograms"
                />
              </div>
              <div>
                <Label htmlFor="activityFactor">Activity Factor</Label>
                <Input
                  id="activityFactor"
                  type="number"
                  min="0"
                  step="any"
                  value={inputs.activityFactor}
                  onChange={(e) => setInputs({ ...inputs, activityFactor: e.target.value })}
                  placeholder="Enter activity factor (e.g. 1.6)"
                />
              </div>
              <Button onClick={handleCalculate} className="w-full">
                Calculate
              </Button>
            </CardContent>
          </Card>

          {(results.rer > 0 && results.mer > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Resting Energy Requirement (RER): {results.rer.toFixed(2)} kcal/day</p>
                <p>Maintenance Energy Requirement (MER): {results.mer.toFixed(2)} kcal/day</p>
              </CardContent>
            </Card>
          )}
        </div>
      }
      editorial={
        <div>
          <section id="how-it-works">
            <h2>How It Works</h2>
            <p>
              This calculator estimates your dog's daily calorie needs using two key values:
            </p>
            <ul>
              <li>
                <strong>Resting Energy Requirement (RER):</strong> The amount of energy your dog needs at rest to maintain basic bodily functions. Calculated as 70 times the dog's weight in kilograms raised to the power of 0.75.
              </li>
              <li>
                <strong>Maintenance Energy Requirement (MER):</strong> The total daily energy requirement including activity, calculated by multiplying RER by an activity factor.
              </li>
            </ul>
            <p>
              The activity factor varies depending on your dog's lifestyle and health status. Common values range from 1.2 for inactive dogs to 2.0 or higher for very active or working dogs.
            </p>
          </section>

          <section id="faq">
            <h2>Frequently Asked Questions</h2>
            <h3>What is the activity factor?</h3>
            <p>
              The activity factor adjusts the resting energy needs to account for your dog's daily activity level. Typical values are:
            </p>
            <ul>
              <li>1.2 - Neutered adult dogs, inactive</li>
              <li>1.4 - Intact adult dogs, moderately active</li>
              <li>1.6 - Active, working dogs</li>
              <li>2.0 - Highly active or performance dogs</li>
            </ul>

            <h3>Can I use this calculator for puppies?</h3>
            <p>
              Puppies have different energy requirements. For accurate puppy calorie needs, use a dedicated puppy calorie calculator.
            </p>
          </section>

          <section id="references">
            <h2>References</h2>
            <ul>
              <li>
                <a href="https://www.merckvetmanual.com/nutrition/energy-requirements/energy-requirements" target="_blank" rel="noopener noreferrer">
                  Merck Veterinary Manual - Energy Requirements
                </a>
              </li>
              <li>
                <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149607/" target="_blank" rel="noopener noreferrer">
                  National Center for Biotechnology Information - Canine Energy Requirements
                </a>
              </li>
            </ul>
          </section>
        </div>
      }
      onThisPage={[
        { id: "how-it-works", label: "How It Works" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" }
      ]}
      formula={{
        title: "RER and MER Formulas",
        formula: "RER = 70 × weight^0.75; MER = RER × activity factor",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "weight", description: "Dog's weight in kilograms" },
          { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
          { symbol: "activity factor", description: "Multiplier based on activity level" }
        ]
      }}
      example={{
        title: "Example Calculation",
        scenario: "A 15 kg adult dog with moderate activity (activity factor 1.6)",
        steps: [
          {
            step: 1,
            description: "Calculate RER",
            calculation: "RER = 70 × (15)^0.75 = 534 kcal"
          },
          {
            step: 2,
            description: "Calculate MER",
            calculation: "MER = 534 × 1.6 = 854 kcal"
          }
        ],
        result: "Daily calories needed: 854 kcal"
      }}
      relatedCalculators={[
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐕"
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories"
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance"
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size"
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide"
        }
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default DogWeightLossPlannerCalculator;
