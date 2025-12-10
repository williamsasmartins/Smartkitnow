import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Info, ChevronRight, Activity, Scale } from "lucide-react";

function DogIdealWeightTargetCaloriesCalculator() {
  // --- 1. STATE ---
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [inputs, setInputs] = useState<{ weight: string; activityFactor: string }>({
    weight: "",
    activityFactor: "",
  });

  // --- 2. LOGIC ---
  /**
   * Formulas:
   * RER = 70 * (weight in kg) ^ 0.75
   * MER = RER * activity factor
   *
   * Weight input:
   * - imperial: pounds (lb)
   * - metric: kilograms (kg)
   *
   * Activity factor typical values:
   * 1.2 (neutered adult), 1.4 (intact adult), 1.6-2.0 (active, working dogs), etc.
   */

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const activityFactorNum = parseFloat(inputs.activityFactor);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(activityFactorNum) ||
      activityFactorNum <= 0
    ) {
      return null;
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate RER
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Calculate MER
    const mer = rer * activityFactorNum;

    return {
      rer,
      mer,
    };
  }, [inputs, unit]);

  // --- 3. WIDGET DEFINITION ---
  const widget = (
    <div className="space-y-6">
      {/* INPUT CARD */}
      <Card className="border border-slate-200/70 dark:border-slate-700/80 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Calculator className="h-5 w-5 text-sky-500" />
            Calculator Inputs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Unit Toggle */}
          <div className="flex gap-4">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              onClick={() => setUnit("imperial")}
              className="flex-1"
              type="button"
            >
              Imperial (lb)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              onClick={() => setUnit("metric")}
              className="flex-1"
              type="button"
            >
              Metric (kg)
            </Button>
          </div>

          {/* Weight Input */}
          <div>
            <Label htmlFor="weight" className="mb-1 block font-medium">
              Dog Weight ({unit === "imperial" ? "pounds (lb)" : "kilograms (kg)"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              value={inputs.weight}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, weight: e.target.value }))
              }
              placeholder={`Enter weight in ${unit === "imperial" ? "lb" : "kg"}`}
            />
          </div>

          {/* Activity Factor Input */}
          <div>
            <Label htmlFor="activityFactor" className="mb-1 block font-medium">
              Activity Factor (MER multiplier)
            </Label>
            <Input
              id="activityFactor"
              type="number"
              min={0}
              step="any"
              value={inputs.activityFactor}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, activityFactor: e.target.value }))
              }
              placeholder="e.g. 1.2 for neutered adult"
            />
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Typical values: 1.2 (neutered adult), 1.4 (intact adult), 1.6-2.0 (active/working dogs)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          type="button"
        >
          Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", activityFactor: "" })}
          type="button"
        >
          Reset
        </Button>
      </div>

      {/* RESULTS CARD (Gradient Style) */}
      {results && (
        <div className="space-y-6 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Card className="bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-blue-500/10 border border-emerald-400/50 dark:border-emerald-500/60 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                <Activity className="h-5 w-5" />
                Daily Calorie Needs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div>
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                  Resting Energy Requirement (RER):
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                  {results.rer.toFixed(0)} kcal/day
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                  Maintenance Energy Requirement (MER):
                </p>
                <p className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                  {results.mer.toFixed(0)} kcal/day
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // --- 4. EDITORIAL DEFINITION ---
  const editorial = (
    <div className="space-y-10">
      <section id="how-to-use">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to use this calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 mb-3">
          Enter your dog's weight in pounds (imperial) or kilograms (metric). Then input the appropriate activity factor that best describes your dog's lifestyle:
          <ul className="list-disc list-inside mt-2 mb-2 text-slate-700 dark:text-slate-300">
            <li>1.2 for neutered adult dogs</li>
            <li>1.4 for intact adult dogs</li>
            <li>1.6 to 2.0 for active or working dogs</li>
          </ul>
          Click "Calculate" to see your dog's Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER), which represent the daily calories needed for rest and maintenance respectively.
        </p>
      </section>

      <section id="faq" className="border-t border-slate-200 dark:border-slate-700 pt-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          <details className="group border border-slate-300 dark:border-slate-700 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100 flex justify-between items-center">
              What is Resting Energy Requirement (RER)?
              <ChevronRight className="h-5 w-5 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              RER is the amount of energy (calories) a dog needs at rest to maintain basic bodily functions like breathing and circulation.
            </p>
          </details>

          <details className="group border border-slate-300 dark:border-slate-700 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100 flex justify-between items-center">
              What does Maintenance Energy Requirement (MER) mean?
              <ChevronRight className="h-5 w-5 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              MER is the total daily energy requirement accounting for activity, growth, reproduction, and other factors beyond resting needs.
            </p>
          </details>

          <details className="group border border-slate-300 dark:border-slate-700 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100 flex justify-between items-center">
              How do I choose the right activity factor?
              <ChevronRight className="h-5 w-5 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Choose based on your dog's lifestyle: lower factors for sedentary or neutered dogs, higher for active, working, or breeding dogs.
            </p>
          </details>

          <details className="group border border-slate-300 dark:border-slate-700 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100 flex justify-between items-center">
              Can I use this calculator for puppies?
              <ChevronRight className="h-5 w-5 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              This calculator is designed for adult dogs. Puppies have different energy needs and should use a specialized puppy calorie calculator.
            </p>
          </details>

          <details className="group border border-slate-300 dark:border-slate-700 rounded-md p-4">
            <summary className="cursor-pointer font-semibold text-slate-900 dark:text-slate-100 flex justify-between items-center">
              Why is weight converted to kilograms internally?
              <ChevronRight className="h-5 w-5 text-slate-400 group-open:rotate-90 transition-transform" />
            </summary>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              The RER formula uses kilograms for consistency and accuracy, so weights entered in pounds are converted automatically.
            </p>
          </details>
        </div>
      </section>

      <section id="references" className="border-t border-slate-200 dark:border-slate-700 pt-10 mt-12">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">References</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            National Research Council (2006). Nutrient Requirements of Dogs and Cats. The National Academies Press.
          </li>
          <li>
            Freeman, L. M., et al. (2011). Energy requirements of adult dogs. Journal of Nutrition.
          </li>
          <li>
            Case, L. P., et al. (2011). Canine and Feline Nutrition: A Resource for Companion Animal Professionals.
          </li>
          <li>
            <a
              href="https://vcahospitals.com/know-your-pet/energy-requirements-in-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 dark:text-sky-400 underline"
            >
              VCA Hospitals - Energy Requirements in Dogs
            </a>
          </li>
        </ul>
      </section>
    </div>
  );

  // --- 5. FINAL RENDER ---
  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description="Calculate your dog's **Resting Energy Requirement (RER)** and **Maintenance Energy Requirement (MER)** to determine daily calorie needs."
      widget={widget}
      editorial={editorial}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      formula={{
        title: "Formula Used",
        formula: "RER = 70 × (weight in kg)^0.75\nMER = RER × activity factor",
        variables: [
          { symbol: "weight", description: "Dog's weight in kilograms (kg)" },
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
          { symbol: "activity factor", description: "Multiplier based on dog's activity level" },
        ],
      }}
      example={{
        title: "Example Calculation",
        scenario:
          "A neutered adult dog weighs 50 pounds (22.7 kg) and has an activity factor of 1.2.",
        steps: [
          {
            step: 1,
            description: "Convert weight to kilograms (if needed)",
            calculation: "50 lb ÷ 2.20462 = 22.7 kg",
          },
          {
            step: 2,
            description: "Calculate RER",
            calculation: "70 × (22.7)^0.75 ≈ 70 × 10.2 = 714 kcal/day",
          },
          {
            step: 3,
            description: "Calculate MER",
            calculation: "714 × 1.2 = 857 kcal/day",
          },
        ],
        result: "The dog needs approximately 857 kcal per day to maintain its weight.",
      }}
      relatedCalculators={[
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🧮" },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🧮",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🧮",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🧮",
        },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🧮" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🧮" },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default DogIdealWeightTargetCaloriesCalculator;
