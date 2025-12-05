import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DogCalorieNeedsRerMerCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    activityLevel: "1.6", // Default to a moderate activity level
  });

  const resultsRef = useRef(null);

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight);
    const activityLevel = parseFloat(inputs.activityLevel);

    if (isNaN(weight) || weight <= 0) {
      return { rer: 0, mer: 0 };
    }

    const rer = 70 * Math.pow(weight, 0.75);
    const mer = rer * activityLevel;

    return { rer, mer };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  const handleReset = () => {
    setInputs({
      weight: "",
      activityLevel: "1.6",
    });
  };

  const formatNumber = (value, fractionDigits = 2) => {
    if (!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      onThisPage={[
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "formula", label: "Formula & Variables" },
        { id: "examples", label: "Examples" },
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
        title: "Calorie Needs Formula",
      }}
      example={{
        title: "Example Calculation",
        scenario: "Calculate the calorie needs for a 20 kg dog with moderate activity.",
        steps: [
          {
            step: 1,
            description: "Calculate the RER using the formula RER = 70 * (Weight^0.75).",
            calculation: "RER = 70 * (20^0.75) = 662.4 kcal/day",
          },
          {
            step: 2,
            description: "Calculate the MER using the formula MER = RER * Activity Level.",
            calculation: "MER = 662.4 * 1.6 = 1059.84 kcal/day",
          },
        ],
      }}
      relatedCalculators={[
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🔗",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🔗",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🔗",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🔗",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🔗",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🔗",
        },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Your Dog's Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight">Dog's Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 20"
                  value={inputs.weight}
                  onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <select
                  id="activityLevel"
                  value={inputs.activityLevel}
                  onChange={(e) => setInputs({ ...inputs, activityLevel: e.target.value })}
                  className="block w-full mt-1"
                >
                  <option value="1.2">Low</option>
                  <option value="1.6">Moderate</option>
                  <option value="2.0">High</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleCalculate}>Calculate</Button>
                <Button variant="secondary" onClick={handleReset}>Reset</Button>
              </div>
            </CardContent>
          </Card>
          <Card ref={resultsRef}>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Resting Energy Requirement (RER):</strong> {formatNumber(results.rer)} kcal/day
                </div>
                <div>
                  <strong>Maintenance Energy Requirement (MER):</strong> {formatNumber(results.mer)} kcal/day
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
      editorial={
        <div className="skn-editorial-sections space-y-10">
          <section id="how-to-use">
            <h2 className="text-3xl font-bold mb-4">How to Use This Calculator</h2>
            <p className="mb-4">
              To determine your dog's daily calorie needs, enter their weight in kilograms and select their activity level. The calculator will provide both the Resting Energy Requirement (RER) and the Maintenance Energy Requirement (MER), which are essential for understanding your dog's dietary needs.
            </p>
          </section>

          <section id="formula">
            <h2 className="text-3xl font-bold mb-4">Formula & Variables</h2>
            <p className="mb-4">
              The calculator uses the RER formula, which is 70 times the dog's weight raised to the power of 0.75. The MER is then calculated by multiplying the RER by an activity level factor. These formulas are widely accepted in veterinary nutrition to estimate a dog's caloric needs.
            </p>
          </section>

          <section id="examples">
            <h2 className="text-3xl font-bold mb-4">Examples</h2>
            <p className="mb-4">
              Consider a 20 kg dog with moderate activity. Using the formulas, the RER is calculated as 662.4 kcal/day, and the MER is 1059.84 kcal/day. This information helps in planning a balanced diet for the dog.
            </p>
          </section>

          <section id="faq">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Why is calculating RER and MER important?</h3>
                <p className="mb-2">
                  Understanding your dog's RER and MER is crucial for ensuring they receive the right amount of food to maintain a healthy weight and energy level. It helps prevent underfeeding or overfeeding, which can lead to health issues.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I use this calculator for puppies?</h3>
                <p className="mb-2">
                  This calculator is designed for adult dogs. Puppies have different nutritional needs, and it's recommended to use a calculator specifically designed for puppies or consult with a veterinarian.
                </p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
}