import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

export default function DogCalorieNeedsRerMerCalculator() {
  const [inputs, setInputs] = useState({
    weight: "",
    activityLevel: "1.6"
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight) || 0;
    const activityMultiplier = parseFloat(inputs.activityLevel) || 1.6;

    const rer = 70 * Math.pow(weight, 0.75);
    const mer = rer * activityMultiplier;

    return { rer, mer };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ weight: "", activityLevel: "1.6" });
  };

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) to determine daily calorie needs."
      onThisPage={[
        { id: "introduction", label: "Introduction" },
        { id: "faq", label: "Frequently Asked Questions" }
      ]}
      relatedCalculators={[
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🔗"
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🔗"
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🔗"
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🔗"
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🔗"
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🔗"
        }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
      widget={
        <div className="space-y-6">
          <Card className="border-0 shadow-none">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Input Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <Label htmlFor="weight">Dog's Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={inputs.weight}
                  onChange={(e) => setInputs({...inputs, weight: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <select
                  id="activityLevel"
                  value={inputs.activityLevel}
                  onChange={(e) => setInputs({...inputs, activityLevel: e.target.value})}
                  className="w-full border rounded p-2"
                >
                  <option value="1.6">Inactive</option>
                  <option value="1.8">Average</option>
                  <option value="2.0">Active</option>
                  <option value="2.2">Highly Active</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>

          {results && results.rer > 0 && (
            <div ref={resultsRef} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="col-span-full bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardHeader>
                    <CardTitle>Resting Energy Requirement (RER)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">
                      {formatValue(results.rer)} kcal/day
                    </p>
                  </CardContent>
                </Card>
                <Card className="col-span-full bg-gradient-to-br from-green-50 to-green-100">
                  <CardHeader>
                    <CardTitle>Maintenance Energy Requirement (MER)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">
                      {formatValue(results.mer)} kcal/day
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      }
      editorial={
        <div className="space-y-8">
          <section id="introduction">
            <h2 className="text-3xl font-bold mb-4">Introduction</h2>
            <p>
              Understanding your dog's calorie needs is crucial for maintaining their health and well-being. The Resting Energy Requirement (RER) is the amount of energy required by a dog at rest in a thermoneutral environment, while the Maintenance Energy Requirement (MER) accounts for additional energy needed for daily activities. Calculating these values helps in determining the appropriate amount of food to feed your dog, ensuring they receive the necessary nutrients without overfeeding or underfeeding.
            </p>
            <p>
              The RER is calculated using the formula: RER = 70 * (Body Weight in kg)^0.75. This formula provides a baseline energy requirement for a dog at rest. However, dogs are rarely at rest all day, and their energy needs increase with activity. The MER is calculated by multiplying the RER by an activity factor, which varies based on the dog's activity level. For example, a sedentary dog may have an activity factor of 1.6, while a highly active dog may have a factor of 2.2.
            </p>
            <p>
              By understanding and calculating these energy requirements, pet owners can make informed decisions about their dog's diet, helping to prevent obesity and other health issues related to improper feeding. This calculator provides a simple way to estimate your dog's daily calorie needs based on their weight and activity level.
            </p>
          </section>

          <section id="faq">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Why is it important to calculate my dog's calorie needs?</h3>
                <p>
                  Calculating your dog's calorie needs is essential for maintaining their health. Overfeeding can lead to obesity, which is associated with numerous health problems such as diabetes, joint issues, and heart disease. Underfeeding, on the other hand, can result in malnutrition and a weakened immune system. By understanding your dog's specific calorie requirements, you can ensure they receive the right amount of food to support their health and activity levels.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How often should I recalculate my dog's calorie needs?</h3>
                <p>
                  It's a good idea to recalculate your dog's calorie needs whenever there is a significant change in their weight, activity level, or health status. Puppies, for example, grow rapidly and their calorie needs change frequently. Similarly, if your dog becomes more active or less active, their energy requirements will change. Regularly reassessing their needs ensures that you are providing the appropriate amount of food for their current condition.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I use this calculator for all dog breeds?</h3>
                <p>
                  This calculator provides a general estimate of calorie needs based on weight and activity level, which can be applied to most dog breeds. However, some breeds may have specific dietary requirements or health considerations that affect their energy needs. It's always a good idea to consult with a veterinarian for personalized advice, especially if your dog has unique health conditions or dietary restrictions.
                </p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
}