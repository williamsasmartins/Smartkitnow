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
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    goalWeight: "",
    weeklyLossPercent: "2", // default 2% weight loss per week
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const goalWeightRaw = parseFloat(inputs.goalWeight);
    const weeklyLossPercentRaw = parseFloat(inputs.weeklyLossPercent);

    if (
      !weightRaw ||
      weightRaw <= 0 ||
      !goalWeightRaw ||
      goalWeightRaw <= 0 ||
      !weeklyLossPercentRaw ||
      weeklyLossPercentRaw <= 0
    )
      return {
        value: 0,
        label: "Enter valid details...",
        subtext: null,
        warning: null,
      };

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;
    const goalWeightKg =
      unit === "imperial" ? goalWeightRaw / 2.20462 : goalWeightRaw;

    if (goalWeightKg >= weightKg) {
      return {
        value: 0,
        label: "Goal weight must be less than current weight",
        subtext: null,
        warning: "Weight loss goal should be less than current weight.",
      };
    }

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * (weight_kg ^ 0.75)
    const rerCurrent = 70 * Math.pow(weightKg, 0.75);
    const rerGoal = 70 * Math.pow(goalWeightKg, 0.75);

    // For weight loss, typically feeding at 80% of RER at goal weight is recommended
    // This is a common veterinary guideline to promote safe weight loss.
    const targetCalories = Math.round(rerGoal * 0.8);

    // Calculate weight difference and weeks needed based on weekly % loss
    const weightDiffKg = weightKg - goalWeightKg;
    // Weekly weight loss in kg = current weight * (weeklyLossPercent / 100)
    // But weight loss slows as dog loses weight, so we use average weight for estimate
    // For simplicity, use current weight * weeklyLossPercent / 100 as weekly loss
    const weeklyLossKg = weightKg * (weeklyLossPercentRaw / 100);

    // Minimum safe weekly loss is about 1% to 3% of body weight
    // If user inputs outside this range, show warning
    let warning = null;
    if (weeklyLossPercentRaw < 1 || weeklyLossPercentRaw > 3) {
      warning =
        "Recommended weekly weight loss is between 1% and 3% of body weight for safety.";
    }

    // Calculate weeks needed to reach goal weight
    const weeksNeeded = Math.ceil(weightDiffKg / weeklyLossKg);

    return {
      value: targetCalories,
      label: "Daily Target Calories",
      subtext: `Estimated time to reach goal weight: ~${weeksNeeded} week${
        weeksNeeded > 1 ? "s" : ""
      } at ${weeklyLossPercentRaw}% weekly loss.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS
  const faqs = [
    {
      question: "Why is Resting Energy Requirement (RER) important for weight loss?",
      answer:
        "RER represents the energy a dog needs at rest to maintain vital body functions. Calculating calories based on RER ensures the dog receives enough energy to stay healthy while losing weight safely.",
    },
    {
      question:
        "Is it safe to aim for rapid weight loss in dogs using this planner?",
      answer:
        "Rapid weight loss can be dangerous and lead to muscle loss or other health issues. This planner recommends a safe weekly weight loss between 1% and 3% of body weight to ensure gradual and healthy fat loss.",
    },
    {
      question:
        "How often should I re-evaluate my dog's weight and calorie needs?",
      answer:
        "Regular monitoring every 2-4 weeks is recommended. As your dog loses weight, calorie needs decrease, so adjust feeding amounts accordingly to continue safe weight loss.",
    },
    {
      question:
        "Can this planner be used for all dog breeds and sizes?",
      answer:
        "Yes, the formula uses metabolic scaling based on weight, making it applicable across breeds and sizes. However, always consult your veterinarian before starting a weight loss program.",
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
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
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
        <div className="space-y-4">
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
              value={inputs.weight}
              onChange={handleInputChange}
              placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              aria-describedby="weight-desc"
            />
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
              value={inputs.goalWeight}
              onChange={handleInputChange}
              placeholder={`Enter goal weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              aria-describedby="goalWeight-desc"
            />
          </div>

          <div>
            <Label
              htmlFor="weeklyLossPercent"
              className="text-slate-700 dark:text-slate-300"
            >
              Weekly Weight Loss Percentage (%)
            </Label>
            <Input
              id="weeklyLossPercent"
              name="weeklyLossPercent"
              type="number"
              min="1"
              max="3"
              step="0.1"
              value={inputs.weeklyLossPercent}
              onChange={handleInputChange}
              placeholder="Recommended 1-3%"
              aria-describedby="weeklyLossPercent-desc"
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ weight: "", goalWeight: "", weeklyLossPercent: "2" })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                {results.value} kcal/day
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult
              a vet for diagnosis and personalized weight loss plans.
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
          Understanding Dog Weight Loss Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Managing your dog's weight is crucial for their overall health, longevity,
          and quality of life. Excess weight can lead to joint problems, diabetes,
          heart disease, and decreased mobility. This Dog Weight Loss Planner is a
          veterinary tool designed to help you safely and effectively plan your
          dog's weight loss journey by estimating daily calorie targets and
          timelines based on scientifically validated metabolic formulas.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The core of this planner uses the Resting Energy Requirement (RER) formula,
          which calculates the energy your dog needs at rest to maintain vital
          bodily functions. By adjusting calories to approximately 80% of the RER at
          your dog's goal weight, the planner ensures a safe calorie deficit that
          promotes fat loss while preserving lean muscle mass and overall health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Additionally, the planner incorporates a recommended weekly weight loss
          percentage, typically between 1% and 3% of body weight, to estimate how
          long it will take your dog to reach their ideal weight. This gradual
          approach minimizes health risks and supports sustainable weight loss,
          making it easier for you and your dog to maintain the results long-term.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To get started, input your dog's current weight and their target goal
          weight. Select the unit system you prefer—Imperial (lbs) or Metric (kg)—
          and enter the values accordingly. Next, specify the weekly weight loss
          percentage you aim for, ideally between 1% and 3% per week, which is a safe
          and effective range recommended by veterinarians.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Your dog's present weight. This is used
            to calculate their current metabolic needs.
          </li>
          <li>
            <strong>Goal Weight:</strong> The target weight you want your dog to
            achieve. It must be less than the current weight for the planner to
            work correctly.
          </li>
          <li>
            <strong>Weekly Weight Loss Percentage:</strong> The percentage of body
            weight your dog should lose each week. Staying within 1-3% ensures safe
            weight loss.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these values, click the "Calculate" button to see the
          recommended daily calorie intake and an estimated timeline for reaching
          your dog's goal weight. Use this information to adjust your dog's diet and
          exercise plan accordingly, and always consult your veterinarian before
          making significant changes.
        </p>
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
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.wsava.org/WSAVA/media/Arpita-and-others/Canine-Obesity-Guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. WSAVA Global Nutrition Committee: Canine Obesity Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on canine obesity management including safe
              weight loss targets and calorie calculations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3665202/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Resting Energy Requirement and Weight Loss in Dogs - NCBI
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article detailing the metabolic formulas used for canine
              energy requirements.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/obesity-in-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. VCA Hospitals: Obesity in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary resource explaining risks of obesity and safe weight loss
              strategies.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/weight-management/weight_management_guidelines_final_2018.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. AAHA Weight Management Guidelines for Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on weight loss protocols and calorie
              calculations for pets.
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
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED ABOVE
      formula={{
        title: "Scientific Formula",
        formula:
          "RER = 70 × (Weight_kg ^ 0.75); Target Calories = 0.8 × RER at Goal Weight; Weeks Needed = (Current Weight - Goal Weight) / (Current Weight × Weekly Loss % / 100)",
        variables: [
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement in kcal/day, energy needed at rest",
          },
          {
            symbol: "Weight_kg",
            description: "Dog's weight in kilograms",
          },
          {
            symbol: "Target Calories",
            description:
              "Recommended daily calorie intake for safe weight loss",
          },
          {
            symbol: "Weekly Loss %",
            description:
              "Percentage of body weight to lose per week (recommended 1-3%)",
          },
          {
            symbol: "Weeks Needed",
            description:
              "Estimated weeks to reach goal weight at specified weekly loss",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 50 lb (22.7 kg) dog currently overweight wants to reach a goal weight of 40 lb (18.1 kg). The owner aims for a 2% weekly weight loss.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weights to kg: Current = 22.7 kg, Goal = 18.1 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER at goal weight: 70 × (18.1 ^ 0.75) ≈ 522 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate target calories: 0.8 × 522 = 418 kcal/day for weight loss.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate weeks needed: (22.7 - 18.1) / (22.7 × 0.02) ≈ 10.1 weeks.",
          },
        ],
        result:
          "Feed approximately 418 kcal/day. Expect to reach goal weight in about 10 weeks with 2% weekly weight loss.",
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
        { id: "what-is", label: "Understanding Dog Weight Loss Planner" },
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