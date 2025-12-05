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
    activityFactor: ""
  });
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const weight = parseFloat(inputs.weight) || 0;
    const activityFactor = parseFloat(inputs.activityFactor) || 0;

    const rer = 70 * Math.pow(weight, 0.75);
    const mer = rer * activityFactor;

    return { rer, mer };
  }, [inputs]);

  const handleCalculate = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleReset = () => {
    setInputs({ weight: "", activityFactor: "" });
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
                <Label htmlFor="activityFactor">Activity Factor</Label>
                <Input
                  id="activityFactor"
                  type="number"
                  placeholder="Enter activity factor"
                  value={inputs.activityFactor}
                  onChange={(e) => setInputs({...inputs, activityFactor: e.target.value})}
                />
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
              Understanding your dog's calorie needs is crucial for maintaining their health and well-being. The Resting Energy Requirement (RER) is the amount of energy your dog needs at rest, while the Maintenance Energy Requirement (MER) accounts for additional energy needs based on activity level. This calculator helps you determine these values to ensure your dog receives the appropriate amount of food.
            </p>
            <p>
              The RER is calculated using the formula: <strong>RER = 70 * (weight in kg)^0.75</strong>. This formula estimates the energy required for basic bodily functions such as breathing, circulation, and cell production. The MER is then calculated by multiplying the RER by an activity factor, which varies depending on your dog's lifestyle and activity level.
            </p>
            <p>
              For example, a sedentary dog may have an activity factor of 1.2, while a highly active working dog might have a factor of 2.0 or more. By accurately determining these values, you can tailor your dog's diet to prevent obesity or malnutrition, both of which can lead to serious health issues.
            </p>
          </section>
          
          <section id="faq">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">What is the difference between RER and MER?</h3>
                <p>
                  The Resting Energy Requirement (RER) is the amount of energy a dog needs to maintain basic physiological functions while at rest. It does not account for any additional energy expenditure due to activity. The Maintenance Energy Requirement (MER), on the other hand, includes the RER plus additional energy needed for daily activities, growth, reproduction, and other factors. MER is a more comprehensive measure of a dog's total daily energy needs.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I determine the correct activity factor for my dog?</h3>
                <p>
                  The activity factor is a multiplier used to estimate the additional energy needs based on your dog's lifestyle. A sedentary dog, such as one that spends most of the day indoors, might have an activity factor of 1.2. A moderately active dog, which goes for regular walks and plays, might have a factor of 1.4 to 1.6. Highly active dogs, such as working or sporting dogs, might require a factor of 2.0 or higher. It's important to assess your dog's activity level accurately to ensure they receive the right amount of calories.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I use this calculator for puppies?</h3>
                <p>
                  While this calculator is primarily designed for adult dogs, it can be adapted for puppies by adjusting the activity factor. Puppies have higher energy needs due to growth and development, so their activity factor will be higher than that of adult dogs. It's recommended to consult with a veterinarian to determine the appropriate factor for your puppy's specific needs.
                </p>
              </div>
            </div>
          </section>
        </div>
      }
    />
  );
}