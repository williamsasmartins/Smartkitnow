import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, Activity, Scale } from "lucide-react";

function DogIdealWeightTargetCaloriesCalculator() {
  // --- STATE ---
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{
    weight?: string;
    activityLevel?: string;
  }>({});

  // --- LOGIC ---
  // RER = 70 * (weight in kg) ^ 0.75
  // MER = RER * activity factor
  // Activity factors (example):
  // Neutered adult: 1.6
  // Intact adult: 1.8
  // Weight loss: 1.0
  // Weight gain: 1.2
  // Active, working dogs: 2-5 (varies)
  // For simplicity, we'll provide a dropdown with common activity levels and factors.

  const activityLevels = [
    { label: "Neutered Adult (1.6x)", factor: 1.6 },
    { label: "Intact Adult (1.8x)", factor: 1.8 },
    { label: "Weight Loss (1.0x)", factor: 1.0 },
    { label: "Weight Gain (1.2x)", factor: 1.2 },
    { label: "Active, Working Dog (2.0x)", factor: 2.0 },
  ];

  const results = useMemo(() => {
    if (!inputs.weight || !inputs.activityLevel) return null;

    let weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) return null;

    // Convert weight to kg if imperial
    if (unit === "imperial") {
      // input weight is in pounds, convert to kg
      weightNum = weightNum / 2.20462;
    }

    // Calculate RER
    const rer = 70 * Math.pow(weightNum, 0.75);

    // Find activity factor
    const activityFactor = activityLevels.find(
      (a) => a.label === inputs.activityLevel
    )?.factor;

    if (!activityFactor) return null;

    const mer = rer * activityFactor;

    return {
      rer: rer,
      mer: mer,
    };
  }, [inputs, unit]);

  // --- WIDGET ---
  const widget = (
    <div className="space-y-6">
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Calculator className="h-5 w-5 text-sky-500" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Unit toggle */}
          <div className="flex items-center gap-4">
            <Label htmlFor="unit-imperial" className="cursor-pointer flex items-center gap-1">
              <input
                type="radio"
                name="unit"
                id="unit-imperial"
                checked={unit === "imperial"}
                onChange={() => setUnit("imperial")}
                className="cursor-pointer"
              />
              <span>Imperial (lbs)</span>
            </Label>
            <Label htmlFor="unit-metric" className="cursor-pointer flex items-center gap-1">
              <input
                type="radio"
                name="unit"
                id="unit-metric"
                checked={unit === "metric"}
                onChange={() => setUnit("metric")}
                className="cursor-pointer"
              />
              <span>Metric (kg)</span>
            </Label>
          </div>

          {/* Weight input */}
          <div>
            <Label htmlFor="weight" className="block mb-1 font-medium">
              Dog's Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
              value={inputs.weight ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, weight: e.target.value }))
              }
            />
          </div>

          {/* Activity level select */}
          <div>
            <Label htmlFor="activityLevel" className="block mb-1 font-medium">
              Activity Level
            </Label>
            <select
              id="activityLevel"
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
              value={inputs.activityLevel ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, activityLevel: e.target.value }))
              }
            >
              <option value="" disabled>
                Select activity level
              </option>
              {activityLevels.map(({ label }) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={() => {
            // Trigger calculation by forcing re-render, no-op here since useMemo depends on inputs
            // Just ensure inputs are valid
            if (!inputs.weight || !inputs.activityLevel) return;
            // No extra action needed, results update automatically
          }}
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
        >
          Reset
        </Button>
      </div>

      {results && (
        <div className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                <Activity className="h-5 w-5" />
                Result
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                {results.mer.toFixed(0)} kcal/day
              </p>
              <div className="text-slate-700 dark:text-slate-300">
                <p>
                  <strong>Resting Energy Requirement (RER):</strong>{" "}
                  {results.rer.toFixed(0)} kcal/day
                </p>
                <p>
                  <strong>Maintenance Energy Requirement (MER):</strong> RER × activity factor = {results.mer.toFixed(0)} kcal/day
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // --- EDITORIAL (WITH IDS FOR ANCHORS) ---
  const editorial = (
    <div className="space-y-10">
      {/* SECTION 1: HOW TO USE - MUST HAVE ID */}
      <section id="how-to-use">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          This calculator helps you determine your dog's daily calorie needs based on their weight and activity level.
          <br />
          1. Select the unit system (Imperial or Metric).
          <br />
          2. Enter your dog's weight.
          <br />
          3. Choose the appropriate activity level that best describes your dog's lifestyle.
          <br />
          4. Click "Calculate" to see the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER).
          <br />
          Use these values to guide feeding amounts and maintain your dog's optimal health.
        </p>
      </section>

      {/* SECTION 2: FAQ - MUST HAVE ID */}
      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {/* Q1 */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">What is RER?</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              RER stands for Resting Energy Requirement, which is the amount of energy (calories) your dog needs at rest to maintain basic physiological functions.
            </p>
          </div>
          {/* Q2 */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">What is MER?</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              MER stands for Maintenance Energy Requirement, which accounts for your dog's activity level and represents the total daily calories needed to maintain their current weight.
            </p>
          </div>
          {/* Q3 */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Why do I need to select an activity level?</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Different dogs have different energy needs based on their lifestyle. Selecting an activity level adjusts the calorie needs accordingly to ensure your dog gets the right amount of food.
            </p>
          </div>
          {/* Q4 */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Can I use this calculator for puppies?</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              This calculator is designed for adult dogs. For puppies, please use a specialized calculator that accounts for age and breed size.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: REFERENCES - MUST HAVE ID */}
      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">References & Resources</h2>
        <ul className="space-y-4">
          <li className="flex flex-col">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-dogs-and-cats/energy-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Merck Veterinary Manual - Energy Requirements of Dogs and Cats
            </a>
            <span className="text-sm text-slate-500">
              Authoritative veterinary resource on canine energy needs.
            </span>
          </li>
          <li className="flex flex-col">
            <a
              href="https://www.petmd.com/dog/nutrition/evr_dg_how_many_calories_do_dogs_need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              PetMD - How Many Calories Does My Dog Need?
            </a>
            <span className="text-sm text-slate-500">
              Practical guide on calculating dog calorie requirements.
            </span>
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
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={{
        title: "Formula Used",
        formula: "RER = 70 × (weight in kg)^0.75\nMER = RER × activity factor",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
          { symbol: "weight", description: "Dog's weight in kilograms" },
          { symbol: "activity factor", description: "Multiplier based on dog's activity level" },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "A neutered adult dog weighs 50 lbs (22.7 kg) and has a typical activity level.",
        steps: [
          {
            step: 1,
            description: "Convert weight to kilograms if needed.",
            calculation: "50 lbs ÷ 2.20462 = 22.7 kg",
          },
          {
            step: 2,
            description: "Calculate RER using the formula.",
            calculation: "70 × 22.7^0.75 ≈ 922 kcal/day",
          },
          {
            step: 3,
            description: "Apply activity factor for neutered adult (1.6).",
            calculation: "922 × 1.6 = 1475 kcal/day (MER)",
          },
        ],
        result: "The dog requires approximately 1475 kcal per day to maintain its weight.",
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
