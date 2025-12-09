import { useState, useMemo } from "react";
import CalculatorVerticalLayout from "@/components/templates/CalculatorVerticalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Info, RefreshCcw } from "lucide-react";

function DogIdealWeightTargetCaloriesCalculator() {
  // 1. STATE (Inputs + Unit Mode)
  const [unit, setUnit] = useState("imperial"); // "imperial" | "metric"
  const [weight, setWeight] = useState(""); // string input for weight
  const [activityFactor, setActivityFactor] = useState("1.6"); // default MER factor

  // 2. USEMEMO (Calculations)
  // Convert weight input to number and to kg if imperial
  const weightKg = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;
    return unit === "imperial" ? w * 0.45359237 : w;
  }, [weight, unit]);

  // Calculate RER and MER
  // RER = 70 * (weight in kg)^0.75
  // MER = RER * activityFactor
  const results = useMemo(() => {
    if (weightKg === null) return null;
    const rer = 70 * Math.pow(weightKg, 0.75);
    const mer = rer * parseFloat(activityFactor);
    return { rer, mer };
  }, [weightKg, activityFactor]);

  // Format numbers with no decimals for calories
  function formatCalories(cal: number) {
    return Math.round(cal).toString();
  }

  // Activity factor options with descriptions
  const activityOptions = [
    { value: "1.2", label: "Neutered adult, inactive" },
    { value: "1.4", label: "Intact adult, normal activity" },
    { value: "1.6", label: "Active, working dog" },
    { value: "2.0", label: "Growth, reproduction, or heavy work" },
  ];

  return (
    <CalculatorVerticalLayout
      title="Dog Calorie Needs (RER/MER) Calculator"
      description={
        "Calculate your dog's **Resting Energy Requirement (RER)** and **Maintenance Energy Requirement (MER)** to determine daily calorie needs."
      }
      widget={
        <div className="space-y-6">
          {/* Unit Switcher */}
          <div className="flex justify-center">
            <Button
              variant={unit === "imperial" ? "default" : "outline"}
              onClick={() => setUnit("imperial")}
              aria-pressed={unit === "imperial"}
              className="mr-2"
              type="button"
            >
              Imperial (lbs)
            </Button>
            <Button
              variant={unit === "metric" ? "default" : "outline"}
              onClick={() => setUnit("metric")}
              aria-pressed={unit === "metric"}
              type="button"
            >
              Metric (kg)
            </Button>
          </div>

          {/* Inputs Section */}
          <div>
            <Label
              htmlFor="weight-input"
              className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              {"Weight (" + (unit === "imperial" ? "lbs" : "kg") + ")"}
            </Label>
            <Input
              id="weight-input"
              type="number"
              min="0"
              step="any"
              placeholder={
                unit === "imperial"
                  ? "Enter weight in pounds"
                  : "Enter weight in kilograms"
              }
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              inputMode="decimal"
            />
          </div>

          <div>
            <Label
              htmlFor="activity-factor-select"
              className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              Activity Level (MER Factor)
            </Label>
            <select
              id="activity-factor-select"
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-950"
              value={activityFactor}
              onChange={(e) => setActivityFactor(e.target.value)}
            >
              {activityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label + " (" + opt.value + ")"}
                </option>
              ))}
            </select>
          </div>

          {/* Results Section (Conditional) */}
          {results !== null && (
            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-slate-500/10 p-6 shadow-xl">
              <div className="mb-4">
                <p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Resting Energy Requirement (RER)
                </p>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {formatCalories(results.rer) + " kcal/day"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  Maintenance Energy Requirement (MER)
                </p>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {formatCalories(results.mer) + " kcal/day"}
                </p>
              </div>
            </div>
          )}
        </div>
      }
      editorial={
        <div className="space-y-12">
          <section id="how-to-use">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              How to Use
            </h2>
            <p>
              Enter your dog's weight in either pounds or kilograms by toggling
              the unit switch at the top. Then select the activity level that
              best matches your dog's lifestyle. The calculator will provide
              both the Resting Energy Requirement (RER) and Maintenance Energy
              Requirement (MER) in calories per day.
            </p>
          </section>
          <section id="faq">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              FAQ
            </h2>
            <p>
              <strong>Q:</strong> What is RER? <br />
              <strong>A:</strong> Resting Energy Requirement is the amount of
              energy your dog needs at rest to maintain basic bodily functions.
            </p>
            <p>
              <strong>Q:</strong> What is MER? <br />
              <strong>A:</strong> Maintenance Energy Requirement accounts for
              your dog's activity level and is the total daily calorie need.
            </p>
            <p>
              <strong>Q:</strong> Why do I need to select activity level? <br />
              <strong>A:</strong> Different activity levels require different
              calorie intakes to maintain healthy weight and energy.
            </p>
          </section>
        </div>
      }
      formula={{
        title: "Formula Used",
        formula:
          "RER = 70 × (weight in kg)^0.75" +
          "  \nMER = RER × activity factor (1.2 to 2.0)",
        variables: [
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement in kcal/day, energy needed at rest",
          },
          {
            symbol: "MER",
            description:
              "Maintenance Energy Requirement in kcal/day, total daily energy need",
          },
          {
            symbol: "weight",
            description: "Dog's weight in kilograms (kg)",
          },
          {
            symbol: "activity factor",
            description:
              "Multiplier based on dog's activity level (1.2 to 2.0 range)",
          },
        ],
      }}
      example={{
        title: "Example Scenario",
        scenario:
          "A 50 lbs (22.7 kg) active adult dog with an activity factor of 1.6.",
        steps: [
          {
            step: 1,
            description:
              "Convert weight to kilograms if needed and calculate RER.",
            calculation:
              "RER = 70 × (22.7)^0.75 ≈ 70 × 10.3 = 721 kcal/day",
          },
          {
            step: 2,
            description: "Calculate MER by multiplying RER by activity factor.",
            calculation: "MER = 721 × 1.6 = 1154 kcal/day",
          },
        ],
        result:
          "The dog needs approximately 721 kcal/day at rest and 1154 kcal/day to maintain its current activity level.",
      }}
      onThisPage={[
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
      ]}
      relatedCalculators={[
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🧮",
        },
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
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🧮",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🧮",
        },
      ]}
      showTopBanner={true}
      showSidebar={true}
      showBottomBanner={true}
    />
  );
}

export default DogIdealWeightTargetCaloriesCalculator;
