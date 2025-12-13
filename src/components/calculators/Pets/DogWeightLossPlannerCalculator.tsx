import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  Dog,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogWeightLossPlannerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial"); // lbs default
  const [inputs, setInputs] = useState({
    weight: "",
    goalWeight: "",
    activityLevel: "neutered", // neutered, intact, active, puppy
    durationWeeks: "",
  });

  // Activity multipliers for MER based on AAHA guidelines and OSU Indoor Pet Initiative
  // Neutered adult: 1.6, Intact adult: 1.8, Active adult: 2.0, Puppy: 3.0 (growth)
  const activityMultipliers: Record<string, number> = {
    neutered: 1.6,
    intact: 1.8,
    active: 2.0,
    puppy: 3.0,
  };

  // 2. LOGIC
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const goalWeightRaw = parseFloat(inputs.goalWeight);
    const durationWeeksRaw = parseInt(inputs.durationWeeks, 10);
    const activity = inputs.activityLevel;

    if (
      !weightRaw ||
      weightRaw <= 0 ||
      !goalWeightRaw ||
      goalWeightRaw <= 0 ||
      !durationWeeksRaw ||
      durationWeeksRaw <= 0 ||
      !(activity in activityMultipliers)
    )
      return { value: 0, label: "Enter all details above to calculate." };

    // Convert lbs to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;
    const goalWeightKg =
      unit === "imperial" ? goalWeightRaw / 2.20462 : goalWeightRaw;

    if (goalWeightKg >= weightKg) {
      return {
        value: 0,
        label: "Goal weight must be less than current weight for weight loss.",
      };
    }

    // Calculate RER for current weight and goal weight
    const rerCurrent = 70 * Math.pow(weightKg, 0.75);
    const rerGoal = 70 * Math.pow(goalWeightKg, 0.75);

    // MER based on current weight and activity level
    const merCurrent = rerCurrent * activityMultipliers[activity];

    // Target calories for weight loss: 80% of MER at goal weight (common veterinary recommendation)
    // Some vets recommend feeding 80% of MER at ideal weight for weight loss
    const merGoal = rerGoal * activityMultipliers[activity];
    const targetCalories = merGoal * 0.8;

    // Total calories to lose = (current weight - goal weight) * 7700 kcal/kg fat (approx)
    // But for safety, use 7700 kcal/kg fat loss (1 kg fat ~ 7700 kcal)
    const weightLossKg = weightKg - goalWeightKg;
    const totalCalorieDeficit = weightLossKg * 7700;

    // Daily calorie deficit needed to reach goal in given weeks
    const dailyCalorieDeficit = totalCalorieDeficit / (durationWeeksRaw * 7);

    // Check if daily calorie deficit is safe (generally max 20% deficit recommended)
    const maxSafeDeficit = merCurrent * 0.2;
    let warning = null;
    if (dailyCalorieDeficit > maxSafeDeficit) {
      warning =
        "Warning: The planned weight loss rate is aggressive and may not be safe. Consult your veterinarian.";
    }

    // Suggested daily calories = MER current - daily deficit, but not less than RER current (minimum)
    let suggestedCalories = merCurrent - dailyCalorieDeficit;
    if (suggestedCalories < rerCurrent) {
      suggestedCalories = rerCurrent;
      warning =
        "Warning: Calculated calories are below resting energy requirement. Adjust duration or goal weight.";
    }

    // Convert calories to cups (optional) - assuming average dog food kcal/cup = 350 kcal/cup
    // This is a rough average; real food varies widely.
    const kcalPerCup = 350;
    const cupsPerDay = suggestedCalories / kcalPerCup;

    // Format numbers nicely
    const formattedCalories = Math.round(suggestedCalories).toLocaleString();
    const formattedCups = cupsPerDay.toFixed(2);

    return {
      value: formattedCalories,
      label: "Daily Caloric Intake (kcal/day)",
      subtext: `Approx. ${formattedCups} cups/day (based on 350 kcal/cup dog food)`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why can't I use human BMI formulas for dogs?",
      answer:
        "Dogs have different metabolism and body composition than humans. Veterinary formulas like RER and MER are species-specific and provide accurate calorie needs.",
    },
    {
      question: "What is RER and MER?",
      answer:
        "RER (Resting Energy Requirement) is the energy needed at rest. MER (Maintenance Energy Requirement) adjusts RER based on activity, neuter status, and life stage.",
    },
    {
      question: "How fast should my dog lose weight?",
      answer:
        "Safe weight loss is typically 1-2% of body weight per week. Rapid weight loss can cause health issues and should be supervised by a veterinarian.",
    },
    {
      question: "Can I feed less than RER calories?",
      answer:
        "Feeding below RER risks malnutrition and organ damage. Always keep calories above RER and consult your vet before making drastic changes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">
            Unit System
          </Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Current Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              min="0"
              step="any"
              placeholder={unit === "imperial" ? "e.g. 50" : "e.g. 22.7"}
              value={inputs.weight}
              onChange={handleInputChange}
              aria-describedby="weight-desc"
            />
            <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your dog's current weight.
            </p>
          </div>

          <div>
            <Label htmlFor="goalWeight" className="text-slate-700 dark:text-slate-300">
              Goal Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="goalWeight"
              name="goalWeight"
              type="number"
              min="0"
              step="any"
              placeholder={unit === "imperial" ? "e.g. 40" : "e.g. 18.1"}
              value={inputs.goalWeight}
              onChange={handleInputChange}
              aria-describedby="goalWeight-desc"
            />
            <p id="goalWeight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your dog's target weight.
            </p>
          </div>

          <div>
            <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
              Activity Level / Status
            </Label>
            <select
              id="activityLevel"
              name="activityLevel"
              value={inputs.activityLevel}
              onChange={handleInputChange}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300 px-3 py-2"
            >
              <option value="neutered">Neutered Adult (Typical)</option>
              <option value="intact">Intact Adult</option>
              <option value="active">Active Adult</option>
              <option value="puppy">Puppy (Growth)</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select your dog's activity or life stage.
            </p>
          </div>

          <div>
            <Label htmlFor="durationWeeks" className="text-slate-700 dark:text-slate-300">
              Weight Loss Duration (weeks)
            </Label>
            <Input
              id="durationWeeks"
              name="durationWeeks"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 12"
              value={inputs.durationWeeks}
              onChange={handleInputChange}
              aria-describedby="duration-desc"
            />
            <p id="duration-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How many weeks to reach goal weight.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (noop here since useMemo depends on inputs)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate dog weight loss plan"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              goalWeight: "",
              activityLevel: "neutered",
              durationWeeks: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>

              {results.subtext && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {results.subtext}
                </p>
              )}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> This tool is for
              educational purposes only. Always consult a veterinarian before
              starting any weight loss program for your dog.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is Dog Weight Loss Planner?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Dog Weight Loss Planner is a veterinary tool designed to help pet
          owners and professionals safely plan a weight loss program for dogs.
          Unlike human BMI formulas, it uses veterinary-specific energy
          requirements such as Resting Energy Requirement (RER) and Maintenance
          Energy Requirement (MER) to calculate daily calorie needs based on
          your dog's weight, activity level, and life stage.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Weight loss in dogs must be gradual and carefully managed to avoid
          health risks. This planner estimates a safe daily caloric intake and
          duration to reach your dog's target weight, ensuring nutritional needs
          are met while promoting fat loss.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Follow these steps to plan your dog's weight loss safely:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Enter your dog's current weight in
            pounds or kilograms.
          </li>
          <li>
            <strong>Goal Weight:</strong> Enter the target weight you want your
            dog to achieve.
          </li>
          <li>
            <strong>Activity Level / Status:</strong> Select your dog's
            neuter status and activity level to adjust calorie needs.
          </li>
          <li>
            <strong>Weight Loss Duration:</strong> Specify the number of weeks
            you plan for your dog to reach the goal weight.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to see the
            recommended daily caloric intake and feeding guidance.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Trusted Sources
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/energy-requirements/energy-requirements-in-dogs-and-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Standard veterinary reference for diagnosis and treatment,
              including energy requirements.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines-for-dogs.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Animal Hospital Association (AAHA) Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative guidelines on canine nutrition and weight management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://indoorpet.osu.edu/dog-nutrition-and-weight-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. OSU Indoor Pet Initiative
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Educational resources on indoor pet health, nutrition, and weight control.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petpoisonhelpline.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Pet Poison Helpline
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Trusted source for pet toxicology and safe medication dosing.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Weight Loss Planner"
      description="Plan a safe and effective weight loss program for your dog. Calculates target calories and timeline for goal weight achievement."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Veterinary Formula",
        formula:
          "RER = 70 × (weight_kg ^ 0.75); MER = RER × activity_multiplier; Target Calories = MER_goal × 0.8",
        variables: [
          {
            symbol: "weight_kg",
            description: "Dog's weight in kilograms",
          },
          {
            symbol: "RER",
            description: "Resting Energy Requirement (kcal/day)",
          },
          {
            symbol: "MER",
            description:
              "Maintenance Energy Requirement adjusted for activity/life stage",
          },
          {
            symbol: "activity_multiplier",
            description:
              "Multiplier based on neuter status and activity (e.g., 1.6 for neutered adult)",
          },
          {
            symbol: "Target Calories",
            description:
              "Recommended daily calories for weight loss (80% of MER at goal weight)",
          },
        ],
      }}
      example={{
        title: "Clinical Example",
        scenario:
          "A 50 lb neutered adult dog with a goal weight of 40 lbs over 12 weeks.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weights to kg: 50 lb = 22.7 kg, 40 lb = 18.1 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER for goal weight: 70 × (18.1 ^ 0.75) ≈ 662 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate MER for goal weight: 662 × 1.6 (neutered adult) = 1059 kcal/day.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate target calories for weight loss: 1059 × 0.8 = 847 kcal/day.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate daily calorie deficit needed to lose 4.6 kg in 12 weeks: (22.7 - 18.1) × 7700 / (12 × 7) ≈ 405 kcal/day.",
          },
          {
            label: "Step 6",
            explanation:
              "Calculate current MER: 70 × (22.7 ^ 0.75) × 1.6 ≈ 1313 kcal/day.",
          },
          {
            label: "Step 7",
            explanation:
              "Suggested daily calories: 1313 - 405 = 908 kcal/day (above RER, safe).",
          },
        ],
        result:
          "Feed approximately 900 kcal/day to achieve safe weight loss over 12 weeks.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🍖",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
        {
          title: "Dog Daily Water Intake Checker",
          url: "/pets/dog-daily-water-intake-checker",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is this?" },
        { id: "how-to-use", label: "How to Use" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}