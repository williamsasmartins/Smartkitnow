import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
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
  const results = useMemo(() => {
    if (!inputs.weight) return null;
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) return null;

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // RER = 70 * (weight in kg)^0.75
    const rer = 70 * Math.pow(weightKg, 0.75);

    // MER multiplier based on activity level
    // Common multipliers:
    // Neutered adult: 1.6
    // Intact adult: 1.8
    // Active/working dog: 2.0 - 5.0 (we'll cap at 5.0)
    // Puppy: 3.0
    // Default to 1.6 if not selected or unknown

    let merMultiplier = 1.6;
    switch (inputs.activityLevel) {
      case "neutered":
        merMultiplier = 1.6;
        break;
      case "intact":
        merMultiplier = 1.8;
        break;
      case "active":
        merMultiplier = 2.5;
        break;
      case "working":
        merMultiplier = 4.0;
        break;
      case "puppy":
        merMultiplier = 3.0;
        break;
      default:
        merMultiplier = 1.6;
    }

    const mer = rer * merMultiplier;

    // Format results with 0 decimals for calories
    return {
      rer: Math.round(rer),
      mer: Math.round(mer),
      merMultiplier,
      weightKg,
      weightDisplay:
        unit === "imperial"
          ? `${weightNum.toFixed(1)} lbs`
          : `${weightNum.toFixed(2)} kg`,
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
          {/* Unit Toggle */}
          <div className="flex items-center gap-4 mb-2">
            <Label htmlFor="unit-toggle" className="font-semibold">
              Unit System:
            </Label>
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("imperial")}
              aria-pressed={unit === "imperial"}
            >
              Imperial (lbs)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              size="sm"
              onClick={() => setUnit("metric")}
              aria-pressed={unit === "metric"}
            >
              Metric (kg)
            </Button>
          </div>

          {/* Weight Input */}
          <div>
            <Label htmlFor="weight" className="font-semibold">
              Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.weight ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, weight: e.target.value }))
              }
            />
          </div>

          {/* Activity Level Select */}
          <div>
            <Label htmlFor="activityLevel" className="font-semibold">
              Activity Level
            </Label>
            <select
              id="activityLevel"
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              value={inputs.activityLevel ?? ""}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, activityLevel: e.target.value }))
              }
            >
              <option value="" disabled>
                Select activity level
              </option>
              <option value="neutered">Neutered Adult (1.6× RER)</option>
              <option value="intact">Intact Adult (1.8× RER)</option>
              <option value="active">Active Dog (2.5× RER)</option>
              <option value="working">Working Dog (4.0× RER)</option>
              <option value="puppy">Puppy (3.0× RER)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={() => {
            // Just trigger re-render, inputs already set
            setInputs((prev) => ({ ...prev }));
          }}
          disabled={!inputs.weight || !inputs.activityLevel}
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({})}
          aria-label="Reset inputs"
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
            <CardContent className="pt-0">
              <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                RER: {results.rer} kcal/day<br />
                MER: {results.mer} kcal/day
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
                For a dog weighing {results.weightDisplay} with activity level{" "}
                <strong>
                  {(() => {
                    switch (inputs.activityLevel) {
                      case "neutered":
                        return "Neutered Adult";
                      case "intact":
                        return "Intact Adult";
                      case "active":
                        return "Active Dog";
                      case "working":
                        return "Working Dog";
                      case "puppy":
                        return "Puppy";
                      default:
                        return "Unknown";
                    }
                  })()}
                </strong>, the Resting Energy Requirement (RER) is{" "}
                <strong>{results.rer} kcal/day</strong> and the Maintenance Energy
                Requirement (MER) is <strong>{results.mer} kcal/day</strong> using a
                multiplier of <strong>{results.merMultiplier}×</strong>.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // --- EDITORIAL ---
  const editorial = (
    <div className="space-y-10">
      <section id="how-to-use">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Enter your dog's weight in either pounds or kilograms, depending on your preferred unit system.
          Then select your dog's activity level from the dropdown menu. Click "Calculate" to see the
          Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) in kilocalories per day.
          Use the "Reset" button to clear inputs and start over.
        </p>
      </section>

      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              What is Resting Energy Requirement (RER)?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              RER is the amount of energy (calories) a dog needs at rest to maintain basic physiological functions like breathing,
              circulation, and cell metabolism. It is the baseline calorie requirement before considering activity or other factors.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              How is Maintenance Energy Requirement (MER) different from RER?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              MER accounts for the dog's daily activity level, growth, reproduction, and other energy expenditures beyond resting.
              It is calculated by multiplying the RER by an activity factor specific to the dog's lifestyle and physiological state.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Why do I need to select an activity level?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Different dogs have different energy needs based on their activity, age, and reproductive status.
              Selecting the correct activity level ensures the MER calculation reflects your dog's true calorie needs.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              Can I use this calculator for puppies or working dogs?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Yes. The calculator includes multipliers for puppies and working dogs, which have higher energy requirements.
              Be sure to select the appropriate activity level to get an accurate estimate.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">
              How accurate is this calculator?
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              This calculator provides an estimate based on widely accepted veterinary formulas.
              Individual dogs may have different needs based on health, breed, metabolism, and environment.
              Always consult your veterinarian for personalized dietary advice.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">References & Resources</h2>
        <ul className="space-y-4">
          <li className="flex flex-col">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-the-dog-and-cat/energy-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Merck Veterinary Manual - Energy Requirements of Dogs
            </a>
            <span className="text-sm text-slate-500">
              Authoritative veterinary resource explaining RER and MER calculations.
            </span>
          </li>
          <li className="flex flex-col">
            <a
              href="https://vcahospitals.com/know-your-pet/feeding-your-dog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              VCA Hospitals - Feeding Your Dog
            </a>
            <span className="text-sm text-slate-500">
              Practical guide on dog nutrition and calorie needs by activity level.
            </span>
          </li>
          <li className="flex flex-col">
            <a
              href="https://www.petmd.com/dog/nutrition/evr_dg_how_many_calories_does_my_dog_need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              PetMD - How Many Calories Does My Dog Need?
            </a>
            <span className="text-sm text-slate-500">
              Explains calorie requirements and factors affecting dog energy needs.
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
        { id: "formula", label: "Formula Used" },
        { id: "example", label: "Worked Example" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "References & Resources" },
      ]}
      formula={{
        title: "Formula Used",
        formula:
          "RER = 70 × (Body Weight in kg)^0.75\nMER = RER × Activity Multiplier",
        variables: [
          {
            symbol: "RER",
            description: "Resting Energy Requirement in kcal/day",
          },
          {
            symbol: "MER",
            description: "Maintenance Energy Requirement in kcal/day",
          },
          {
            symbol: "Body Weight",
            description: "Dog's weight in kilograms (kg)",
          },
          {
            symbol: "Activity Multiplier",
            description:
              "Factor based on dog's activity level (e.g., 1.6 for neutered adult)",
          },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "Calculate the daily calorie needs for a neutered adult dog weighing 50 lbs.",
        steps: [
          {
            step: 1,
            description:
              "Convert weight from pounds to kilograms: 50 lbs ÷ 2.20462 = 22.68 kg",
            calculation: "22.68 kg",
          },
          {
            step: 2,
            description:
              "Calculate RER: 70 × (22.68)^0.75 = 70 × 10.42 = 729 kcal/day",
            calculation: "729 kcal/day",
          },
          {
            step: 3,
            description:
              "Calculate MER using neutered adult multiplier (1.6): 729 × 1.6 = 1166 kcal/day",
            calculation: "1166 kcal/day",
          },
        ],
        result:
          "The dog requires approximately 729 kcal/day at rest and 1166 kcal/day to maintain its current weight and activity level.",
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
