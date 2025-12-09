import { useState, useMemo, useRef } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, ChevronRight, Activity } from "lucide-react";

function DogIdealWeightTargetCaloriesCalculator() {
  // 1. STATE
  const [inputs, setInputs] = useState({
    weight: "", // in kg
    weightUnit: "kg",
    activityLevel: "neuteredAdult",
  });

  // Helper to parse weight safely
  function parseWeight() {
    let w = parseFloat(inputs.weight);
    if (isNaN(w) || w <= 0) return null;
    if (inputs.weightUnit === "lb") {
      w = w / 2.20462; // convert lb to kg
    }
    return w;
  }

  // 2. LOGIC
  const results = useMemo(() => {
    const weightKg = parseWeight();
    if (!weightKg) return null;

    // RER formula: 70 * (weight in kg)^0.75
    const rer = 70 * Math.pow(weightKg, 0.75);

    // MER multipliers based on activity level
    // Source: NRC and common veterinary guidelines
    // neuteredAdult: 1.6
    // intactAdult: 1.8
    // inactive/obeseProne: 1.2
    // weightLoss: 1.0
    // weightGain: 1.8
    // puppy: 3.0 (not used here)
    let merMultiplier = 1.6;
    switch (inputs.activityLevel) {
      case "neuteredAdult":
        merMultiplier = 1.6;
        break;
      case "intactAdult":
        merMultiplier = 1.8;
        break;
      case "inactiveObeseProne":
        merMultiplier = 1.2;
        break;
      case "weightLoss":
        merMultiplier = 1.0;
        break;
      case "weightGain":
        merMultiplier = 1.8;
        break;
      default:
        merMultiplier = 1.6;
    }

    const mer = rer * merMultiplier;

    return {
      weightKg: weightKg.toFixed(2),
      rer: rer.toFixed(0),
      mer: mer.toFixed(0),
      merMultiplier: merMultiplier.toFixed(1),
    };
  }, [inputs]);

  // 3. WIDGET JSX (The Input Form + Result Card)
  const widget = (
    <div className="space-y-6">
      {/* INPUT CARD - MUST USE THESE CLASSES */}
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Calculator className="h-5 w-5 text-sky-500" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Weight Input */}
          <div>
            <Label htmlFor="weight" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Dog Weight
            </Label>
            <div className="flex gap-2">
              <Input
                id="weight"
                type="number"
                min="0"
                step="any"
                placeholder="Enter weight"
                value={inputs.weight}
                onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
                className="h-10 w-full rounded-md border border-slate-300 bg-slate-950/5 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
              />
              <select
                aria-label="Weight unit"
                value={inputs.weightUnit}
                onChange={(e) => setInputs({ ...inputs, weightUnit: e.target.value })}
                className="h-10 rounded-md border border-slate-300 bg-slate-950/5 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
              >
                <option value="kg">kg</option>
                <option value="lb">lb</option>
              </select>
            </div>
          </div>

          {/* Activity Level Select */}
          <div>
            <Label htmlFor="activityLevel" className="mb-1 block font-medium text-slate-700 dark:text-slate-300">
              Activity Level
            </Label>
            <select
              id="activityLevel"
              value={inputs.activityLevel}
              onChange={(e) => setInputs({ ...inputs, activityLevel: e.target.value })}
              className="h-10 w-full rounded-md border border-slate-300 bg-slate-950/5 px-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
            >
              <option value="neuteredAdult">Neutered Adult (typical)</option>
              <option value="intactAdult">Intact Adult</option>
              <option value="inactiveObeseProne">Inactive/Obese Prone</option>
              <option value="weightLoss">Weight Loss</option>
              <option value="weightGain">Weight Gain</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ACTION BUTTON */}
      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={() => {
            // No special action needed, calculation is live
            // But we can force re-render by setting state if needed
            setInputs({ ...inputs });
          }}
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              weightUnit: "kg",
              activityLevel: "neuteredAdult",
            })
          }
        >
          Reset
        </Button>
      </div>

      {/* RESULTS CARD - THE "PREMIUM" GRADIENT */}
      {results && (
        <div className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                <Activity className="h-5 w-5" />
                Daily Calorie Needs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                {results.mer} kcal/day
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
                Based on a weight of {results.weightKg} kg and activity multiplier of {results.merMultiplier}× RER.
              </p>
            </CardContent>
          </Card>

          {/* Secondary Results Table */}
          <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Detailed Results
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Weight (kg)</TableCell>
                    <TableCell>{results.weightKg}</TableCell>
                    <TableCell>Dog's weight converted to kilograms</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>RER (Resting Energy Requirement)</TableCell>
                    <TableCell>{results.rer} kcal/day</TableCell>
                    <TableCell>Energy needed at rest (70 × weight^0.75)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>MER Multiplier</TableCell>
                    <TableCell>{results.merMultiplier}×</TableCell>
                    <TableCell>Activity level multiplier applied to RER</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>MER (Maintenance Energy Requirement)</TableCell>
                    <TableCell>{results.mer} kcal/day</TableCell>
                    <TableCell>Estimated daily calorie needs</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // 4. EDITORIAL JSX (Deep Content)
  const editorial = (
    <div className="space-y-10">
      <section id="how-to-use">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          This calculator estimates your dog's daily calorie needs based on their weight and activity level. It uses the Resting Energy Requirement (RER) formula and applies a Maintenance Energy Requirement (MER) multiplier to account for activity.
        </p>
        <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li>Enter your dog's current weight. You can select kilograms (kg) or pounds (lb).</li>
          <li>Choose the activity level that best describes your dog:</li>
          <ul className="list-disc list-inside pl-6 mb-2 text-slate-700 dark:text-slate-300">
            <li><strong>Neutered Adult:</strong> Typical adult dog with moderate activity.</li>
            <li><strong>Intact Adult:</strong> Adult dog that is not neutered/spayed, usually more active.</li>
            <li><strong>Inactive/Obese Prone:</strong> Less active or prone to weight gain.</li>
            <li><strong>Weight Loss:</strong> Dogs on a calorie-restricted diet.</li>
            <li><strong>Weight Gain:</strong> Dogs needing to gain weight or highly active.</li>
          </ul>
          <li>Click "Calculate" to see your dog's estimated daily calorie needs.</li>
          <li>Use the results to guide feeding amounts or discuss with your veterinarian.</li>
        </ol>
      </section>

      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              What is Resting Energy Requirement (RER)?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              RER is the amount of energy (calories) a dog needs at rest to maintain basic bodily functions like breathing and circulation.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              How is Maintenance Energy Requirement (MER) different from RER?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              MER accounts for the dog's activity level and lifestyle by multiplying RER with an activity factor to estimate total daily calorie needs.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Can I use this calculator for puppies or senior dogs?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              This calculator is designed for adult dogs. Puppies and seniors have different energy needs and should use specialized calculators or consult a veterinarian.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Why do I need to select an activity level?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              Activity level affects how many calories your dog burns daily. Selecting the correct level helps provide a more accurate calorie estimate.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              This calculator provides an estimate based on standard formulas. Individual needs may vary. Always consult your veterinarian for personalized advice.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            National Research Council (NRC). Nutrient Requirements of Dogs and Cats. 2006.
          </li>
          <li>
            Freeman, L. M., et al. "Energy requirements of adult dogs." Journal of Nutrition 130.12 (2000): 2707S-2710S.
          </li>
          <li>
            Case, L. P., et al. "Canine and Feline Nutrition: A Resource for Companion Animal Professionals." 3rd Edition, 2011.
          </li>
          <li>
            National Animal Supplement Council (NASC). "Dog Calorie Needs and Feeding Guidelines."
          </li>
          <li>
            Veterinary Partner. "Calculating Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) in Dogs."
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's **Resting Energy Requirement (RER)** and **Maintenance Energy Requirement (MER)** to determine daily calorie needs."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References" },
      ]}
      formula={{
        title: "Formula Used",
        formula:
          "RER = 70 × (weight in kg)^0.75\nMER = RER × Activity Multiplier",
        variables: [
          { symbol: "weight", description: "Dog's weight in kilograms" },
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
          { symbol: "Activity Multiplier", description: "Factor based on activity level" },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "A neutered adult dog weighs 20 kg. Calculate the daily calorie needs.",
        steps: [
          {
            step: 1,
            description: "Calculate RER using the formula 70 × weight^0.75",
            calculation: "70 × 20^0.75 ≈ 70 × 9.46 = 662 kcal/day",
          },
          {
            step: 2,
            description:
              "Apply MER multiplier for neutered adult (1.6× RER)",
            calculation: "662 × 1.6 = 1059 kcal/day",
          },
        ],
        result: "The dog needs approximately 1059 kcal per day to maintain weight.",
      }}
      relatedCalculators={[
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐕" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐕" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐕" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🐕" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐕" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐕" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default DogIdealWeightTargetCaloriesCalculator;
