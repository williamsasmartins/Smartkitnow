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
    currentWeight: "",
    goalWeight: "",
    weeklyLossPercent: "2", // default safe weight loss % per week
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const currentWeightRaw = parseFloat(inputs.currentWeight);
    const goalWeightRaw = parseFloat(inputs.goalWeight);
    const weeklyLossPercentRaw = parseFloat(inputs.weeklyLossPercent);

    if (
      !currentWeightRaw ||
      currentWeightRaw <= 0 ||
      !goalWeightRaw ||
      goalWeightRaw <= 0 ||
      !weeklyLossPercentRaw ||
      weeklyLossPercentRaw <= 0
    )
      return {
        value: 0,
        label: "Enter valid details above to calculate.",
        subtext: "",
        warning: null,
      };

    // Convert weights to kg if imperial
    const currentWeightKg =
      unit === "imperial" ? currentWeightRaw / 2.20462 : currentWeightRaw;
    const goalWeightKg =
      unit === "imperial" ? goalWeightRaw / 2.20462 : goalWeightRaw;

    if (goalWeightKg >= currentWeightKg)
      return {
        value: 0,
        label: "Goal weight must be less than current weight.",
        subtext: "",
        warning:
          "Weight loss planner is designed for dogs needing to lose weight. For weight gain, consult a vet.",
      };

    // Calculate Resting Energy Requirement (RER) at goal weight
    // RER = 70 * (goalWeightKg)^0.75
    const RER = 70 * Math.pow(goalWeightKg, 0.75);

    // Calculate safe weekly weight loss in kg
    // Safe weight loss is typically 1-2% of current body weight per week
    const weeklyLossKg = (weeklyLossPercentRaw / 100) * currentWeightKg;

    // Calculate total weight to lose
    const totalLossKg = currentWeightKg - goalWeightKg;

    // Calculate estimated weeks to reach goal weight
    const weeksToGoal = totalLossKg / weeklyLossKg;

    // Calculate daily calorie intake for weight loss
    // Weight loss calorie intake = RER * factor (usually 0.8 for weight loss)
    // Factor 0.8 means feeding 80% of RER to induce weight loss safely
    const weightLossCalories = Math.round(RER * 0.8);

    // Format output values
    const caloriesLabel = `${weightLossCalories} kcal/day`;
    const timelineLabel = `${Math.ceil(weeksToGoal)} week${
      weeksToGoal > 1 ? "s" : ""
    }`;

    // Warnings for unrealistic inputs
    let warning = null;
    if (weeklyLossPercentRaw > 3) {
      warning =
        "Weekly weight loss above 3% is generally unsafe and not recommended without veterinary supervision.";
    }

    return {
      value: caloriesLabel,
      label: "Recommended daily calorie intake for weight loss",
      subtext: `Estimated time to reach goal weight: ${timelineLabel}`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question:
        "Why is Resting Energy Requirement (RER) used instead of human BMI formulas for dogs?",
      answer:
        "RER is a scientifically validated formula specifically designed to estimate the basal metabolic energy needs of animals based on their body weight in kilograms raised to the 0.75 power. Unlike human BMI formulas, which are not applicable to dogs due to differing physiology and body composition, RER provides a more accurate baseline for calculating caloric needs and planning weight loss safely in veterinary medicine.",
    },
    {
      question:
        "How does feeding 80% of RER calories promote safe weight loss in dogs?",
      answer:
        "Feeding approximately 80% of the dog's RER creates a controlled calorie deficit that encourages gradual fat loss while preserving lean muscle mass. This moderate reduction avoids rapid weight loss, which can cause metabolic imbalances or nutritional deficiencies. The 80% factor is widely recommended by veterinary nutritionists to ensure weight loss is steady, safe, and sustainable over weeks to months.",
    },
    {
      question:
        "Why is a weekly weight loss target of 1-2% recommended for dogs?",
      answer:
        "A weekly weight loss of 1-2% of body weight is considered safe and effective for dogs because it minimizes health risks such as muscle wasting, nutrient deficiencies, and gallbladder issues. Rapid weight loss can stress the dog's metabolism and organs. This gradual approach allows the dog's body to adjust, maintain energy levels, and supports long-term success in reaching and maintaining a healthy weight.",
    },
    {
      question:
        "What should I do if my dog’s weight loss is slower or faster than the planner’s estimate?",
      answer:
        "Weight loss rates can vary due to factors like age, breed, activity level, and underlying health conditions. If weight loss is slower, consult your veterinarian to reassess diet, exercise, and possible medical issues. If weight loss is faster than planned, it may be unsafe, and veterinary guidance is essential to adjust calorie intake and prevent complications. Regular monitoring and vet check-ups ensure a healthy weight loss journey.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // INPUT HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "weeklyLossPercent") {
      // Allow only numbers and decimal point, max 5 chars
      if (!/^\d*\.?\d*$/.test(value) || value.length > 5) return;
    }
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
            <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
              Current Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="currentWeight"
              name="currentWeight"
              type="number"
              min="0"
              step="any"
              value={inputs.currentWeight}
              onChange={handleInputChange}
              placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              aria-describedby="currentWeightHelp"
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
              aria-describedby="goalWeightHelp"
            />
          </div>
          <div>
            <Label htmlFor="weeklyLossPercent" className="text-slate-700 dark:text-slate-300">
              Weekly Weight Loss Target (% of current weight)
            </Label>
            <Input
              id="weeklyLossPercent"
              name="weeklyLossPercent"
              type="number"
              min="0.5"
              max="3"
              step="0.1"
              value={inputs.weeklyLossPercent}
              onChange={handleInputChange}
              placeholder="Recommended: 1-2%"
              aria-describedby="weeklyLossHelp"
            />
            <p id="weeklyLossHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Safe range is 1-2% per week; max 3% without vet supervision.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ currentWeight: "", goalWeight: "", weeklyLossPercent: "2" })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Weight Loss Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Dog Weight Loss Planner is a specialized veterinary tool designed to help pet owners and professionals plan a safe and effective weight loss program for dogs. Unlike human weight loss methods, canine weight management requires precise calculations based on metabolic energy needs, body weight, and safe weight loss rates. This planner uses scientifically validated formulas to estimate the daily calorie intake necessary to promote gradual fat loss while preserving muscle mass and overall health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Central to this planner is the Resting Energy Requirement (RER), which estimates the baseline calories a dog needs at rest to maintain vital functions. By calculating the RER at the dog’s goal weight and applying a safe calorie reduction factor, the planner determines an appropriate daily calorie target to achieve weight loss. Additionally, it estimates the timeline for reaching the goal weight based on a recommended weekly weight loss percentage, ensuring the process is both effective and sustainable.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool emphasizes veterinary best practices by incorporating safe weight loss rates (typically 1-2% of body weight per week) and providing warnings when inputs suggest potentially unsafe plans. It is an educational resource that encourages consultation with veterinary professionals to tailor weight loss programs to individual dogs’ needs, considering factors such as breed, age, activity level, and health status.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Dog Weight Loss Planner is straightforward and requires three key inputs: your dog’s current weight, goal weight, and the desired weekly weight loss percentage. Begin by selecting the unit system you prefer—imperial (pounds) or metric (kilograms). Enter your dog’s current weight accurately, then input the target weight you wish your dog to achieve. Finally, specify the weekly weight loss target, ideally between 1-2%, which aligns with veterinary safety guidelines.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Enter your dog’s present weight using a reliable scale. Accurate measurement is crucial for precise calculations.
          </li>
          <li>
            <strong>Goal Weight:</strong> Input a realistic and healthy target weight recommended by your veterinarian to ensure safe weight management.
          </li>
          <li>
            <strong>Weekly Weight Loss Target:</strong> Choose a percentage between 1-2% for gradual weight loss. Avoid exceeding 3% without veterinary supervision to prevent health risks.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these details, click “Calculate” to receive your dog’s recommended daily calorie intake for weight loss and an estimated timeline to reach the goal weight. Use this information to guide feeding plans and monitor progress, adjusting as necessary in consultation with your veterinarian.
        </p>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.wsava.org/WSAVA/media/Documents/Guidelines/Nutrition-Guidelines-WSAVA-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. WSAVA Nutritional Assessment Guidelines (2019)
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on canine nutrition and weight management by the World Small Animal Veterinary Association.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149602/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. German et al., 2018 - Canine Obesity and Weight Loss
            </a>
            <p className="text-slate-500 text-sm">
              A detailed review of obesity in dogs, safe weight loss strategies, and metabolic considerations published in Frontiers in Veterinary Science.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/weight-management/weight_management_guidelines_final.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA) Weight Management Guidelines (2018)
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based protocols for assessing and managing canine obesity, including caloric restriction and safe weight loss rates.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/weight-loss-for-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. VCA Hospitals - Weight Loss for Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice and veterinary insights on canine weight loss, diet planning, and monitoring progress.
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
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "RER = 70 × (Goal Weight in kg)^0.75; Daily Calories = RER × 0.8; Weeks to Goal = (Current Weight - Goal Weight) / (Weekly Loss % × Current Weight)",
        variables: [
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement - baseline calories needed at rest for goal weight",
          },
          {
            symbol: "Goal Weight",
            description: "Target body weight in kilograms",
          },
          {
            symbol: "Daily Calories",
            description:
              "Recommended daily calorie intake to achieve weight loss safely",
          },
          {
            symbol: "Weekly Loss %",
            description:
              "Desired weekly weight loss percentage of current body weight (e.g., 0.02 for 2%)",
          },
          {
            symbol: "Weeks to Goal",
            description:
              "Estimated number of weeks to reach the goal weight at the specified weekly loss rate",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog currently overweight aims to reach a healthy weight of 24 lb (10.9 kg) with a weekly weight loss target of 2%.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weights to kilograms: Current = 13.6 kg, Goal = 10.9 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER at goal weight: 70 × 10.9^0.75 ≈ 440 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate daily calories for weight loss: 440 × 0.8 = 352 kcal/day.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate weekly weight loss in kg: 2% × 13.6 = 0.272 kg/week.",
          },
          {
            label: "Step 5",
            explanation:
              "Calculate weeks to goal: (13.6 - 10.9) / 0.272 ≈ 10 weeks.",
          },
        ],
        result:
          "Feed approximately 352 kcal/day. Estimated time to reach goal weight is about 10 weeks with safe, gradual weight loss.",
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
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}