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
    },
    {
      label: "Small (e.g., Dachshund, Jack Russell)",
      value: "small",
      minWeight: 5,
      maxWeight: 10,
      avgWeight: 7.5,
    },
    {
      label: "Medium (e.g., Beagle, Border Collie)",
      value: "medium",
      minWeight: 11,
      maxWeight: 25,
      avgWeight: 18,
    },
    {
      label: "Large (e.g., Labrador, Golden Retriever)",
      value: "large",
      minWeight: 26,
      maxWeight: 44,
      avgWeight: 35,
    },
    {
      label: "Giant (e.g., Great Dane, Mastiff)",
      value: "giant",
      minWeight: 45,
      maxWeight: 90,
      avgWeight: 67.5,
    },
  ];

  // Activity multipliers for MER
  const activityLevels = [
    {
      label: "Neutered adult (normal activity)",
      value: "neutered",
      multiplier: 1.6,
    },
    {
      label: "Intact adult (normal activity)",
      value: "intact",
      multiplier: 1.8,
    },
    {
      label: "Active/working dog",
      value: "active",
      multiplier: 2.0,
    },
    {
      label: "Weight loss (restricted calories)",
      value: "weightloss",
      multiplier: 1.0,
    },
    {
      label: "Senior/less active",
      value: "senior",
      multiplier: 1.4,
    },
  ];

  // State
  const [currentWeight, setCurrentWeight] = useState("");
  const [breedSize, setBreedSize] = useState("medium");
  const [activityLevel, setActivityLevel] = useState("neutered");
  const [customIdealWeight, setCustomIdealWeight] = useState("");
  const [showCustomIdeal, setShowCustomIdeal] = useState(false);

  // For scrolling to results
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Helper: get selected breed size object
  const selectedBreed = useMemo(
    () => breedSizes.find((b) => b.value === breedSize) || breedSizes[2],
    [breedSize]
  );

  // Helper: get selected activity multiplier
  const selectedActivity = useMemo(
    () => activityLevels.find((a) => a.value === activityLevel) || activityLevels[0],
    [activityLevel]
  );

  // Parse input values
  const parsedCurrentWeight = parseFloat(currentWeight);
  const parsedCustomIdealWeight = parseFloat(customIdealWeight);

  // Calculate ideal weight (kg)
  const idealWeightKg = useMemo(() => {
    if (showCustomIdeal && !isNaN(parsedCustomIdealWeight) && parsedCustomIdealWeight > 0) {
      return parsedCustomIdealWeight;
    }
    // If current weight is within breed range, use it as ideal
    if (
      !isNaN(parsedCurrentWeight) &&
      parsedCurrentWeight >= selectedBreed.minWeight &&
      parsedCurrentWeight <= selectedBreed.maxWeight
    ) {
      return parsedCurrentWeight;
    }
    // Otherwise, use breed average
    return selectedBreed.avgWeight;
  }, [
    showCustomIdeal,
    parsedCustomIdealWeight,
    parsedCurrentWeight,
    selectedBreed.minWeight,
    selectedBreed.maxWeight,
    selectedBreed.avgWeight,
  ]);

  // Calculate RER (Resting Energy Requirement)
  const rer = useMemo(() => {
    if (!idealWeightKg || idealWeightKg <= 0) return 0;
    return 70 * Math.pow(idealWeightKg, 0.75);
  }, [idealWeightKg]);

  // Calculate MER (Maintenance Energy Requirement)
  const mer = useMemo(() => {
    if (!rer || !selectedActivity.multiplier) return 0;
    return rer * selectedActivity.multiplier;
  }, [rer, selectedActivity.multiplier]);

  // Calculate weight difference
  const weightDiff = useMemo(() => {
    if (isNaN(parsedCurrentWeight) || !idealWeightKg) return 0;
    return parsedCurrentWeight - idealWeightKg;
  }, [parsedCurrentWeight, idealWeightKg]);

  // Calculate percent overweight/underweight
  const percentDiff = useMemo(() => {
    if (!idealWeightKg || isNaN(parsedCurrentWeight)) return 0;
    return ((parsedCurrentWeight - idealWeightKg) / idealWeightKg) * 100;
  }, [parsedCurrentWeight, idealWeightKg]);

  // Formatters
  const nf = (n: number, digits = 2) =>
    isNaN(n) ? "-" : Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n);

  // Handle calculate button
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Handle reset
  const handleReset = () => {
    setCurrentWeight("");
    setBreedSize("medium");
    setActivityLevel("neutered");
    setCustomIdealWeight("");
    setShowCustomIdeal(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // Supporting numbers for results
  const supporting = [
    {
      label: "Breed ideal weight range",
      value: `${nf(selectedBreed.minWeight, 1)} – ${nf(selectedBreed.maxWeight, 1)} kg`,
      icon: <Scale className="h-5 w-5 text-blue-500" />,
    },
    {
      label: "Resting Energy Requirement (RER)",
      value: `${nf(rer, 0)} kcal/day`,
      icon: <Activity className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Activity multiplier",
      value: `× ${selectedActivity.multiplier}`,
      icon: <Dog className="h-5 w-5 text-yellow-500" />,
    },
    {
      label: "Weight difference",
      value:
        isNaN(weightDiff) || weightDiff === 0
          ? "At ideal"
          : `${weightDiff > 0 ? "+" : ""}${nf(weightDiff, 1)} kg (${weightDiff > 0 ? "over" : "under"})`,
      icon: <Info className="h-5 w-5 text-slate-500" />,
    },
  ];

  // Editorial navigation
  const onThisPage = [
    { id: "how-to-calculate", label: "How this calculator works" },
    { id: "formula", label: "Formula" },
    { id: "how-to-use", label: "How to use this calculator" },
    { id: "understanding-results", label: "Understanding the results" },
    { id: "examples", label: "Examples" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "references", label: "References & resources" },
  ];

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size."
      widget={
        <form onSubmit={handleCalculate} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Dog className="inline-block h-6 w-6 mr-2 text-blue-600" />
                Dog Ideal Weight & Target Calories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="currentWeight">
                  Current weight <span className="text-slate-500">(kg)</span>
                </Label>
                <Input
                  id="currentWeight"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.1}
                  placeholder="e.g. 18.5"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  required
                />
                <div className="text-xs text-slate-500 mt-1">
                  Enter your dog's current body weight in kilograms (1 kg ≈ 2.2 lb).
                </div>
              </div>
              <div>
                <Label htmlFor="breedSize">Breed size category</Label>
                <select
                  id="breedSize"
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-base"
                  value={breedSize}
                  onChange={(e) => setBreedSize(e.target.value)}
                >
                  {breedSizes.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-500 mt-1">
                  Select the category that best matches your dog's breed or expected adult size.
                </div>
              </div>
              <div>
                <Label htmlFor="activityLevel">Activity & life stage</Label>
                <select
                  id="activityLevel"
                  className="mt-1 block w-full border rounded-md px-3 py-2 text-base"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  {activityLevels.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-slate-500 mt-1">
                  Choose the option that best describes your dog's activity and reproductive status.
                </div>
              </div>
              <div>
                <Label>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={showCustomIdeal}
                    onChange={() => setShowCustomIdeal((v) => !v)}
                  />
                  Enter custom ideal weight
                </Label>
                {showCustomIdeal && (
                  <div className="mt-2">
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.1}
                      placeholder={`e.g. ${nf(selectedBreed.avgWeight, 1)}`}
                      value={customIdealWeight}
                      onChange={(e) => setCustomIdealWeight(e.target.value)}
                    />
                    <div className="text-xs text-slate-500 mt-1">
                      If your veterinarian has recommended a specific ideal weight, enter it here (kg).
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Calculate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="h-5 w-5" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          <div ref={resultsRef} />
          <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-800 dark:to-slate-900 border-blue-200 dark:border-slate-700 shadow-lg">
            <CardHeader>
              <CardTitle>
                <Scale className="inline-block h-6 w-6 mr-2 text-blue-600" />
                Ideal Weight & Target Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {idealWeightKg > 0 ? (
                  <>
                    Ideal weight:{" "}
                    <span className="text-blue-700 dark:text-blue-300">
                      {nf(idealWeightKg, 1)} kg
                    </span>
                  </>
                ) : (
                  "—"
                )}
              </div>
              <div className="text-lg mb-4">
                Target daily calories (MER):{" "}
                <span className="text-green-700 dark:text-green-300 font-semibold">
                  {mer > 0 ? `${nf(mer, 0)} kcal/day` : "—"}
                </span>
              </div>
              <ul className="space-y-2">
                {supporting.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-base">
                    {s.icon}
                    <span className="font-medium">{s.label}:</span>
                    <span>{s.value}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-xs text-slate-500">
                Always consult a licensed veterinarian before making decisions about your pet’s diet, medication or treatment. This calculator provides general estimates only and does not replace professional veterinary advice.
              </div>
            </CardContent>
          </Card>
        </form>
      }
      editorial={
        <div>
          <section id="how-to-calculate" className="mb-10">
            <h2 className="text-xl font-semibold mb-3">How this calculator works</h2>
            <p>
              The Dog Ideal Weight & Target Calories Calculator is designed to help dog owners estimate their pet’s healthy body weight and the daily calorie intake required to maintain it. By considering your dog’s current weight, breed size, and activity level, this tool applies established veterinary formulas to provide a science-based calorie recommendation. This approach helps you support your dog’s long-term health, whether your goal is weight maintenance, gradual weight loss, or simply ensuring your companion is neither under- nor overweight.
            </p>
            <p className="mt-3">
              The calculator uses breed size categories to estimate an ideal weight range, referencing typical healthy weights for toy, small, medium, large, and giant breeds. If your veterinarian has provided a specific target weight, you can enter it directly for a more personalized calculation. The tool then applies the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) formulas, which are widely accepted in veterinary nutrition, to determine how many calories your dog should consume each day.
            </p>
            <p className="mt-3">
              This calculator is intended for adult dogs of typical breeds and body conditions. Puppies, pregnant or lactating females, and dogs with certain medical conditions may have very different nutritional needs. Always consult your veterinarian for tailored advice, especially if your dog is overweight, underweight, or has special health considerations.
            </p>
            <p className="mt-3">
              By using this calculator, you gain a clearer understanding of your dog’s nutritional requirements and can make more informed decisions about feeding, weight management, and overall well-being.
            </p>
          </section>
          <section id="formula" className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Formula</h2>
            <p>
              The calculator estimates your dog’s ideal weight based on breed size or a custom value. It then calculates the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) as follows:
            </p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded p-4 my-4 border text-base">
              <strong>Resting Energy Requirement (RER):</strong>
              <br />
              <span className="font-mono text-blue-700">RER = 70 × (Ideal Weight in kg)<sup>0.75</sup></span>
              <br />
              <strong>Maintenance Energy Requirement (MER):</strong>
              <br />
              <span className="font-mono text-green-700">MER = RER × Activity Multiplier</span>
            </div>
            <p>
              <strong>Variables:</strong>
            </p>
            <ul className="list-disc ml-6 mb-3">
              <li>
                <strong>Ideal Weight (kg):</strong> The healthy target body weight for your dog, based on breed size or veterinary recommendation.
              </li>
              <li>
                <strong>RER:</strong> The baseline daily calorie needs for basic metabolic functions at rest.
              </li>
              <li>
                <strong>Activity Multiplier:</strong> A factor reflecting your dog’s life stage and activity (e.g., 1.6 for neutered adults, 2.0 for highly active dogs).
              </li>
              <li>
                <strong>MER:</strong> The total daily calories needed to maintain the ideal weight, accounting for activity.
              </li>
            </ul>
            <p>
              <strong>Assumptions & Limitations:</strong> These formulas are based on average adult dogs in healthy condition. Individual needs may vary due to age, breed, metabolism, health status, and environmental factors. This tool does not account for puppies, pregnant/lactating females, or dogs with medical conditions. Always use veterinary guidance for precise recommendations.
            </p>
          </section>
          <section id="how-to-use" className="mb-10">
            <h2 className="text-xl font-semibold mb-3">How to use this calculator</h2>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                <strong>Enter your dog’s current weight:</strong> Input your dog’s current body weight in kilograms. If you only know the weight in pounds, divide by 2.2 to convert to kilograms.
              </li>
              <li>
                <strong>Select the breed size category:</strong> Choose the option that best matches your dog’s breed or expected adult size. If your dog is a mixed breed, select the closest category based on their build.
              </li>
              <li>
                <strong>Choose the activity & life stage:</strong> Pick the description that fits your dog’s typical activity level and reproductive status. This affects the calorie calculation.
              </li>
              <li>
                <strong>(Optional) Enter a custom ideal weight:</strong> If your veterinarian has recommended a specific target weight, check the box and enter it. Otherwise, the calculator will estimate based on breed size.
              </li>
              <li>
                <strong>Click “Calculate”:</strong> The calculator will display your dog’s ideal weight, target daily calories, and supporting details such as the breed’s healthy weight range and your dog’s weight difference from ideal.
              </li>
              <li>
                <strong>Review the results:</strong> Use the information to guide feeding decisions, but always consult your veterinarian before making significant changes to your dog’s diet or weight management plan.
              </li>
            </ol>
          </section>
          <section id="understanding-results" className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Understanding the results</h2>
            <p>
              The calculator provides two main results: your dog’s estimated ideal weight and the target daily calorie intake (MER) to maintain that weight. The ideal weight is based on breed size averages or a custom value if provided. The target calories reflect your dog’s metabolic needs, adjusted for activity and life stage.
            </p>
            <p className="mt-3">
              <strong>Higher calorie recommendations</strong> are typical for larger, more active, or intact dogs. <strong>Lower calorie needs</strong> are seen in smaller, less active, senior, or neutered dogs. If your dog’s current weight is above the ideal, the calculator will show the difference and percentage over ideal. This can help you and your veterinarian plan gradual, safe weight loss if needed.
            </p>
            <p className="mt-3">
              <strong>Practical tips:</strong> Use the target calorie value as a starting point for selecting commercial dog foods or planning homemade diets. Always measure food portions carefully and monitor your dog’s weight regularly. Adjust feeding as needed based on your dog’s body condition and veterinary advice.
            </p>
            <p className="mt-3">
              Remember, these results are estimates. Individual dogs may have unique needs due to genetics, health, or environment. Never restrict calories drastically or make major dietary changes without professional guidance.
            </p>
          </section>
          <section id="examples" className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Examples</h2>
            <p>
              <strong>Example 1:</strong> Bella is a 7-year-old female Beagle who weighs 21 kg. Her veterinarian recommends she should ideally weigh 18 kg. She is spayed and moderately active.
            </p>
            <ul className="list-disc ml-6 mb-3">
              <li>
                <strong>Current weight:</strong> 21 kg
              </li>
              <li>
                <strong>Breed size:</strong> Medium
              </li>
              <li>
                <strong>Activity:</strong> Neutered adult (multiplier 1.6)
              </li>
              <li>
                <strong>Custom ideal weight:</strong> 18 kg
              </li>
            </ul>
            <p>
              <strong>Step 1:</strong> Calculate RER:
              <br />
              RER = 70 × (18)<sup>0.75</sup> ≈ 70 × 7.92 ≈ 554 kcal/day
            </p>
            <p>
              <strong>Step 2:</strong> Calculate MER:
              <br />
              MER = 554 × 1.6 ≈ 886 kcal/day
            </p>
            <p>
              <strong>Step 3:</strong> Weight difference:
              <br />
              21 kg (current) – 18 kg (ideal) = 3 kg over ideal (≈16.7% overweight)
            </p>
            <p>
              <strong>Interpretation:</strong> Bella should aim for a daily intake of about 886 kcal to maintain her ideal weight. Since she is overweight, her veterinarian may recommend a slightly lower calorie target for gradual weight loss, along with regular monitoring.
            </p>
            <hr className="my-6" />
            <p>
              <strong>Example 2:</strong> Max is a 3-year-old intact male Labrador Retriever, weighing 36 kg. He is very active and in good body condition.
            </p>
            <ul className="list-disc ml-6 mb-3">
              <li>
                <strong>Current weight:</strong> 36 kg
              </li>
              <li>
                <strong>Breed size:</strong> Large
              </li>
              <li>
                <strong>Activity:</strong> Active/working dog (multiplier 2.0)
              </li>
              <li>
                <strong>Ideal weight:</strong> 36 kg (within breed range)
              </li>
            </ul>
            <p>
              <strong>Step 1:</strong> RER = 70 × (36)<sup>0.75</sup> ≈ 70 × 13.5 ≈ 945 kcal/day
            </p>
            <p>
              <strong>Step 2:</strong> MER = 945 × 2.0 = 1,890 kcal/day
            </p>
            <p>
              <strong>Step 3:</strong> Weight difference: 0 kg (at ideal)
            </p>
            <p>
              <strong>Interpretation:</strong> Max’s calorie needs are higher due to his size and activity. He should consume about 1,890 kcal/day to maintain his healthy weight.
            </p>
          </section>
          <section id="faq" className="mb-10">
            <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
            <h3 className="text-lg font-semibold mt-5 mb-2">How accurate are these calorie and weight estimates?</h3>
            <p>
              The calculator uses formulas and breed averages widely accepted in veterinary nutrition. However, individual dogs can vary significantly due to genetics, metabolism, health status, and environment. These results are best used as a starting point for discussion with your veterinarian, who can provide a more tailored assessment based on your dog’s unique needs.
            </p>
            <p>
              For dogs with medical conditions, unusual body types, or those outside typical breed standards, professional evaluation is essential. Never use online calculators as a substitute for veterinary care.
            </p>
            <h3 className="text-lg font-semibold mt-5 mb-2">Can I use this calculator for puppies or pregnant/lactating dogs?</h3>
            <p>
              No. Puppies, pregnant, and lactating dogs have very different nutritional requirements that change rapidly with age and physiological state. This calculator is intended for adult dogs in maintenance, weight loss, or typical activity scenarios. For growing or reproducing dogs, consult your veterinarian for precise feeding guidelines.
            </p>
            <p>
              Feeding puppies or pregnant/lactating females based on adult maintenance formulas can result in undernutrition or overnutrition, both of which can be harmful.
            </p>
            <h3 className="text-lg font-semibold mt-5 mb-2">What should I do if my dog is overweight or underweight?</h3>
            <p>
              If your dog’s current weight is significantly above or below the ideal range, consult your veterinarian before making dietary changes. Safe weight loss or gain should be gradual and supervised to avoid health risks. Your vet can recommend a specific calorie target, feeding plan, and monitoring schedule tailored to your dog’s needs.
            </p>
            <p>
              Never restrict calories drastically or attempt rapid weight changes, as this can cause serious health problems, especially in overweight or senior dogs.
            </p>
            <h3 className="text-lg font-semibold mt-5 mb-2">How should I use the calorie result to choose dog food portions?</h3>
            <p>
              Use the target calorie value to guide your choice of commercial dog foods or homemade diets. Check the calorie content (kcal per cup, can, or gram) on the food label, and measure portions carefully. Adjust the amount fed based on your dog’s body condition, weight trends, and veterinary advice.
            </p>
            <p>
              Remember to include treats and table scraps in your dog’s total daily calorie intake. Overfeeding, even by small amounts, can lead to gradual weight gain over time.
            </p>
            <h3 className="text-lg font-semibold mt-5 mb-2">Is it safe to use this calculator without consulting a veterinarian?</h3>
            <p>
              This calculator is for educational purposes only and provides general estimates.