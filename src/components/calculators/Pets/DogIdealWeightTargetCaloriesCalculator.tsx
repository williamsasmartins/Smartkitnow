import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Dog,
  Activity,
  Info,
  Scale,
  HelpCircle,
  BookOpen,
  HeartPulse,
} from "lucide-react";

export default function DogIdealWeightTargetCaloriesCalculator() {
  // Breed size options and their ideal weight ranges (kg)
  const breedSizes = [
    {
      label: "Toy (e.g., Chihuahua, Pomeranian)",
      value: "toy",
      minWeight: 2,
      maxWeight: 4,
      avgWeight: 3,
      merFactor: 1.6,
    },
    {
      label: "Small (e.g., Dachshund, Jack Russell)",
      value: "small",
      minWeight: 5,
      maxWeight: 10,
      avgWeight: 7.5,
      merFactor: 1.6,
    },
    {
      label: "Medium (e.g., Beagle, Cocker Spaniel)",
      value: "medium",
      minWeight: 11,
      maxWeight: 25,
      avgWeight: 18,
      merFactor: 1.6,
    },
    {
      label: "Large (e.g., Labrador, Boxer)",
      value: "large",
      minWeight: 26,
      maxWeight: 40,
      avgWeight: 33,
      merFactor: 1.6,
    },
    {
      label: "Giant (e.g., Great Dane, Mastiff)",
      value: "giant",
      minWeight: 41,
      maxWeight: 70,
      avgWeight: 55,
      merFactor: 1.6,
    },
  ];

  // Activity level options and their MER multipliers
  const activityLevels = [
    {
      label: "Neutered adult (normal activity)",
      value: "neutered",
      merFactor: 1.6,
    },
    {
      label: "Intact adult (normal activity)",
      value: "intact",
      merFactor: 1.8,
    },
    {
      label: "Active/working dog",
      value: "active",
      merFactor: 2.0,
    },
    {
      label: "Weight loss (restricted calories)",
      value: "weightloss",
      merFactor: 1.0,
    },
    {
      label: "Senior/low activity",
      value: "senior",
      merFactor: 1.4,
    },
  ];

  // Input states
  const [currentWeight, setCurrentWeight] = useState("");
  const [breedSize, setBreedSize] = useState("medium");
  const [activityLevel, setActivityLevel] = useState("neutered");
  const [idealWeight, setIdealWeight] = useState(""); // optional manual override

  // Results ref for scroll
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Helper: get breed size object
  const selectedBreed = useMemo(
    () => breedSizes.find((b) => b.value === breedSize) || breedSizes[2],
    [breedSize]
  );

  // Helper: get activity level object
  const selectedActivity = useMemo(
    () => activityLevels.find((a) => a.value === activityLevel) || activityLevels[0],
    [activityLevel]
  );

  // Calculate ideal weight (kg)
  const computedIdealWeight = useMemo(() => {
    // If user entered a manual ideal weight, use it (if valid)
    const manual = parseFloat(idealWeight);
    if (!isNaN(manual) && manual > 0) {
      return manual;
    }
    // Otherwise, use breed size average
    return selectedBreed.avgWeight;
  }, [idealWeight, selectedBreed]);

  // Calculate RER (Resting Energy Requirement)
  // RER = 70 × (Ideal Weight in kg)^0.75
  const rer = useMemo(() => {
    if (!computedIdealWeight || computedIdealWeight <= 0) return 0;
    return 70 * Math.pow(computedIdealWeight, 0.75);
  }, [computedIdealWeight]);

  // Calculate MER (Maintenance Energy Requirement)
  // MER = RER × Activity Factor
  const mer = useMemo(() => {
    if (!rer || rer <= 0) return 0;
    return rer * selectedActivity.merFactor;
  }, [rer, selectedActivity]);

  // Calculate weight difference
  const weightDiff = useMemo(() => {
    const curr = parseFloat(currentWeight);
    if (isNaN(curr) || curr <= 0) return 0;
    return curr - computedIdealWeight;
  }, [currentWeight, computedIdealWeight]);

  // Calculate percent overweight/underweight
  const percentDiff = useMemo(() => {
    const curr = parseFloat(currentWeight);
    if (isNaN(curr) || curr <= 0 || !computedIdealWeight) return 0;
    return ((curr - computedIdealWeight) / computedIdealWeight) * 100;
  }, [currentWeight, computedIdealWeight]);

  // Formatters
  const nf = (n: number, digits = 2) =>
    isNaN(n) ? "--" : Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n);

  // Handle calculate button
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Handle reset
  const handleReset = () => {
    setCurrentWeight("");
    setBreedSize("medium");
    setActivityLevel("neutered");
    setIdealWeight("");
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Widget JSX
  const widget = (
    <form onSubmit={handleCalculate} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Dog className="inline-block mr-2 text-orange-500" />
            Dog Ideal Weight & Target Calories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="currentWeight">
              Current Weight <span className="text-slate-500">(kg)</span>
            </Label>
            <Input
              id="currentWeight"
              type="number"
              min={0}
              step={0.1}
              placeholder="e.g. 22.5"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              inputMode="decimal"
              required
            />
            <div className="text-xs text-muted-foreground mt-1">
              Enter your dog's current body weight in kilograms (1 kg ≈ 2.2 lb).
            </div>
          </div>
          <div>
            <Label htmlFor="breedSize">Breed Size Category</Label>
            <select
              id="breedSize"
              className="block w-full mt-1 border rounded px-3 py-2 bg-background"
              value={breedSize}
              onChange={(e) => setBreedSize(e.target.value)}
            >
              {breedSizes.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            <div className="text-xs text-muted-foreground mt-1">
              Select the category that best matches your dog's breed or adult size.
            </div>
          </div>
          <div>
            <Label htmlFor="activityLevel">Activity Level</Label>
            <select
              id="activityLevel"
              className="block w-full mt-1 border rounded px-3 py-2 bg-background"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              {activityLevels.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
            <div className="text-xs text-muted-foreground mt-1">
              Choose the option that best describes your dog's lifestyle.
            </div>
          </div>
          <div>
            <Label htmlFor="idealWeight">
              Ideal Weight <span className="text-slate-500">(kg, optional)</span>
            </Label>
            <Input
              id="idealWeight"
              type="number"
              min={1}
              step={0.1}
              placeholder={`e.g. ${selectedBreed.avgWeight}`}
              value={idealWeight}
              onChange={(e) => setIdealWeight(e.target.value)}
              inputMode="decimal"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Optionally enter a target weight (kg) if known. Otherwise, the calculator will estimate based on breed size.
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              <Calculator className="mr-2 h-5 w-5" />
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleReset}
            >
              <HelpCircle className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
      <div ref={resultsRef} />
      <Card className="bg-gradient-to-br from-orange-50 via-white to-orange-100 border-orange-200 shadow-lg">
        <CardHeader>
          <CardTitle>
            <Scale className="inline-block mr-2 text-orange-600" />
            Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-lg font-semibold text-orange-700">
              Ideal Weight:{" "}
              <span className="text-2xl font-bold">
                {nf(computedIdealWeight, 1)} kg
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Based on breed size and/or your input.
            </div>
          </div>
          <div className="mb-4">
            <div className="text-lg font-semibold text-orange-700">
              Target Daily Calories (MER):{" "}
              <span className="text-2xl font-bold">
                {nf(mer, 0)} kcal
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              For maintenance at ideal weight and selected activity level.
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded bg-orange-50 border">
              <div className="font-medium flex items-center">
                <HeartPulse className="mr-2 h-5 w-5 text-orange-400" />
                Resting Energy Requirement (RER)
              </div>
              <div className="text-xl font-bold">{nf(rer, 0)} kcal</div>
              <div className="text-xs text-muted-foreground">
                Minimum calories needed at rest (no activity).
              </div>
            </div>
            <div className="p-3 rounded bg-orange-50 border">
              <div className="font-medium flex items-center">
                <Info className="mr-2 h-5 w-5 text-orange-400" />
                Weight Difference
              </div>
              <div className="text-xl font-bold">
                {weightDiff > 0
                  ? `+${nf(weightDiff, 1)} kg`
                  : weightDiff < 0
                  ? `${nf(weightDiff, 1)} kg`
                  : "0 kg"}
              </div>
              <div className="text-xs text-muted-foreground">
                {weightDiff > 0
                  ? `Your dog is approximately ${nf(percentDiff, 1)}% above ideal weight.`
                  : weightDiff < 0
                  ? `Your dog is approximately ${nf(Math.abs(percentDiff), 1)}% below ideal weight.`
                  : "At ideal weight."}
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-orange-700">
            <Info className="inline-block mr-1 h-4 w-4" />
            Always consult a licensed veterinarian before making decisions about your pet’s diet, medication or treatment. This calculator provides estimates for educational purposes only.
          </div>
        </CardContent>
      </Card>
    </form>
  );

  // Editorial content
  const editorial = (
    <div>
      <section id="how-to-calculate" className="mb-8">
        <h2 className="text-xl font-bold mb-3">How this calculator works</h2>
        <p>
          The Dog Ideal Weight & Target Calories Calculator is designed to help dog owners estimate their pet’s healthy body weight and the number of calories needed to maintain that weight. By considering your dog’s current weight, breed size, and activity level, this tool provides a science-based estimate of both the ideal weight range and the daily caloric intake required for optimal health.
        </p>
        <p>
          Maintaining a healthy weight is crucial for your dog’s longevity, mobility, and overall well-being. Overweight or underweight dogs are at increased risk for a variety of health issues, including joint problems, diabetes, heart disease, and decreased quality of life. This calculator uses widely accepted veterinary formulas to estimate your dog’s Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER), which together inform the recommended daily calorie intake.
        </p>
        <p>
          The calculator also allows you to manually enter a target weight if you have a specific goal in mind, such as a veterinarian-recommended weight. Otherwise, it estimates the ideal weight based on typical breed size categories. The results are intended as a starting point for discussions with your veterinarian about your dog’s nutrition and weight management.
        </p>
        <p>
          Remember, every dog is unique. Factors such as age, metabolism, health status, and breed-specific traits can influence ideal weight and calorie needs. Always use these results as a guide, not a substitute for professional veterinary advice.
        </p>
      </section>

      <section id="formula" className="mb-8">
        <h2 className="text-xl font-bold mb-3">Formula</h2>
        <p>
          This calculator uses two key formulas commonly recommended by veterinary nutritionists:
        </p>
        <ul className="list-disc pl-6 mb-3">
          <li>
            <strong>Resting Energy Requirement (RER):</strong> <br />
            <span className="font-mono bg-slate-100 px-2 py-1 rounded">
              RER = 70 × (Ideal Weight in kg)<sup>0.75</sup>
            </span>
            <br />
            This formula estimates the minimum calories your dog needs at rest, supporting basic metabolic functions.
          </li>
          <li className="mt-2">
            <strong>Maintenance Energy Requirement (MER):</strong> <br />
            <span className="font-mono bg-slate-100 px-2 py-1 rounded">
              MER = RER × Activity Factor
            </span>
            <br />
            The activity factor (typically 1.4–2.0) adjusts for your dog’s lifestyle, reproductive status, and energy expenditure.
          </li>
        </ul>
        <p>
          <strong>Variables:</strong>
        </p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Ideal Weight (kg):</strong> The healthy target weight for your dog, based on breed size or your input.
          </li>
          <li>
            <strong>Current Weight (kg):</strong> Your dog’s present weight.
          </li>
          <li>
            <strong>Activity Factor:</strong> Multiplier reflecting your dog’s activity level and reproductive status.
          </li>
        </ul>
        <p>
          <strong>Assumptions & Limitations:</strong> These formulas are based on average adult dogs in good health. Puppies, pregnant/lactating females, and dogs with medical conditions may have different requirements. The breed size-based ideal weight is an estimate; for mixed breeds or unique cases, consult your veterinarian.
        </p>
      </section>

      <section id="how-to-use" className="mb-8">
        <h2 className="text-xl font-bold mb-3">How to use this calculator</h2>
        <ol className="list-decimal pl-6">
          <li>
            <strong>Enter your dog’s current weight:</strong> Input the most recent and accurate weight in kilograms. If you only know the weight in pounds, divide by 2.2 to convert to kilograms.
          </li>
          <li>
            <strong>Select the breed size category:</strong> Choose the option that best matches your dog’s breed or expected adult size. If your dog is a mixed breed, select the category closest to their build.
          </li>
          <li>
            <strong>Choose the activity level:</strong> Pick the description that best fits your dog’s daily routine and reproductive status. For most pet dogs, “Neutered adult (normal activity)” is appropriate.
          </li>
          <li>
            <strong>Optionally enter an ideal weight:</strong> If your veterinarian has recommended a specific target weight, enter it here. Otherwise, leave this blank to use the breed size estimate.
          </li>
          <li>
            <strong>Click “Calculate”:</strong> The calculator will display your dog’s estimated ideal weight, daily calorie needs (MER), resting energy requirement (RER), and the difference between current and ideal weight.
          </li>
          <li>
            <strong>Review the results:</strong> Use these numbers as a guide for discussions with your veterinarian about diet, exercise, and weight management strategies.
          </li>
        </ol>
      </section>

      <section id="understanding-results" className="mb-8">
        <h2 className="text-xl font-bold mb-3">Understanding the results</h2>
        <p>
          The calculator provides several key numbers to help you understand your dog’s weight and nutritional needs:
        </p>
        <ul className="list-disc pl-6 mb-3">
          <li>
            <strong>Ideal Weight:</strong> This is the estimated healthy weight for your dog, based on breed size or your manual input. If your dog’s current weight is above this, they may be overweight; if below, they may be underweight.
          </li>
          <li>
            <strong>Target Daily Calories (MER):</strong> This is the recommended daily caloric intake to maintain your dog at their ideal weight, considering their activity level. Feeding above this amount may lead to weight gain; feeding below may result in weight loss.
          </li>
          <li>
            <strong>Resting Energy Requirement (RER):</strong> The minimum calories needed for basic bodily functions at rest. This is a baseline and should not be used as the sole guide for feeding.
          </li>
          <li>
            <strong>Weight Difference & Percentage:</strong> Shows how much your dog is above or below the ideal weight, both in kilograms and as a percentage. This helps you and your veterinarian assess the degree of underweight or overweight status.
          </li>
        </ul>
        <p>
          <strong>Interpreting higher vs. lower values:</strong> A higher weight difference or percentage indicates your dog is further from their ideal weight, which may increase health risks. A higher MER means your dog needs more calories, often due to greater size or activity. Always aim for gradual, safe changes in weight and calorie intake, and never put your dog on a diet without veterinary supervision.
        </p>
        <p>
          <strong>Practical tips:</strong> Use the calorie estimate as a starting point. Monitor your dog’s body condition, energy, and weight regularly. Adjust food portions gradually and avoid sudden changes. Treats should be included in the total daily calorie count.
        </p>
      </section>

      <section id="examples" className="mb-8">
        <h2 className="text-xl font-bold mb-3">Examples</h2>
        <p>
          Let’s walk through a sample scenario to illustrate how to use the Dog Ideal Weight & Target Calories Calculator:
        </p>
        <div className="bg-slate-50 rounded p-4 my-3">
          <strong>Example:</strong> <br />
          <ul className="list-disc pl-6">
            <li>Current weight: 28 kg</li>
            <li>Breed size: Large (e.g., Labrador)</li>
            <li>Activity level: Neutered adult (normal activity)</li>
            <li>Ideal weight: (leave blank to use breed estimate)</li>
          </ul>
        </div>
        <p>
          <strong>Step 1:</strong> The calculator estimates the ideal weight for a large breed as 33 kg. Since the current weight is 28 kg, the dog is about 5 kg below the breed average, or roughly 15% underweight.
        </p>
        <p>
          <strong>Step 2:</strong> The Resting Energy Requirement (RER) is calculated:
          <br />
          RER = 70 × (33)<sup>0.75</sup> ≈ 1,170 kcal
        </p>
        <p>
          <strong>Step 3:</strong> The Maintenance Energy Requirement (MER) is:
          <br />
          MER = 1,170 kcal × 1.6 (activity factor) ≈ 1,872 kcal/day
        </p>
        <p>
          <strong>Interpretation:</strong> This dog should consume about 1,870 kcal per day to maintain an ideal weight of 33 kg, assuming normal activity. Since the dog is underweight, a gradual increase in food (under veterinary guidance) may be appropriate. Always monitor body condition and adjust as needed.
        </p>
        <p>
          <strong>Note:</strong> If you know your dog’s specific ideal weight (e.g., from a vet), enter it for a more tailored result.
        </p>
      </section>

      <section id="faq" className="mb-8">
        <h2 className="text-xl font-bold mb-3">Frequently Asked Questions</h2>
        <h3 className="text-lg font-semibold mt-4 mb-2">How accurate are these calorie and weight estimates?</h3>
        <p>
          The formulas used in this calculator are based on widely accepted veterinary guidelines and provide a reliable starting point for most adult dogs. However, individual dogs may have unique needs due to genetics, metabolism, health conditions, or lifestyle. The breed size-based ideal weight is an average; some dogs may be healthy at weights above or below this range. For the most accurate assessment, consult your veterinarian, who can evaluate your dog’s body condition and recommend a personalized plan.
        </p>
        <p>
          Calorie needs can also fluctuate with changes in activity, age, or health status. Always monitor your dog’s weight and adjust food portions as needed, with professional guidance.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Should I use the calculator’s ideal weight or my vet’s recommendation?</h3>
        <p>
          If your veterinarian has provided a specific target weight for your dog, always use that value. The calculator’s estimate is based on breed size averages and is intended as a general guide. Your vet’s recommendation takes into account your dog’s unique body condition, health status, and other factors that may not be reflected in breed averages.
        </p>
        <p>
          Enter your vet’s recommended weight in the “Ideal Weight” field for the most tailored calorie and weight calculations.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Can I use this calculator for puppies, seniors, or dogs with health issues?</h3>
        <p>
          This calculator is designed for healthy adult dogs. Puppies, pregnant or lactating females, seniors, and dogs with medical conditions have different nutritional needs that are not fully addressed by these formulas. For these cases, consult your veterinarian for a customized feeding and weight management plan.
        </p>
        <p>
          Feeding puppies or special-needs dogs based on adult maintenance formulas may result in under- or overfeeding, which can impact growth and health.
        </p>

        <h3 className="text-lg font-semibold mt-4 mb-2">What should I do if my dog is overweight or underweight?</h3>
        <p>
          If your dog’s current weight is significantly above or below the ideal weight estimate, schedule a veterinary checkup before making any dietary changes. Rapid weight loss or gain can be harmful. Your veterinarian can help identify underlying causes and develop a safe, gradual plan for weight management.
        </p>
        <p>
          Never put your dog on a restrictive diet or weight loss program without professional supervision. Regular monitoring, appropriate exercise, and a balanced diet are key to achieving and maintaining a healthy weight.
        </p>
      </section>

      <section id="references" className="mb-8">
        <h2 className="text-xl font-bold mb-3">Official References & Resources</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://wsava.org/global-guidelines/global-nutrition-guidelines/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WSAVA Global Nutrition Guidelines
              </a>
              <p className="text-xs text-muted-foreground">
                Comprehensive nutrition guidelines for dogs and cats from the World Small Animal Veterinary Association.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.petnutritionalliance.org/site/qa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Pet Nutrition Alliance: Calorie Calculator
              </a>
              <p className="text-xs text-muted-foreground">
                Interactive tools and educational resources for pet nutrition, including calorie calculators and feeding guides.
              </p>
            </div>
          </li>
          <li className="flex items-start gap-2">
            <BookOpen className="h-5 w-5 text-slate-400 mt-1 shrink-0" />
            <div>
              <a
                href="https://www.acvn.org/"
                target="_blank