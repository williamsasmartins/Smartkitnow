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
  Cat,
  Scale,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogTreatCaloriesDailyAllowanceCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  // Inputs: Current Weight, Target Weight, Treat Calories per Treat, Number of Treats per Day
  const [inputs, setInputs] = useState({
    weight: "",
    targetWeight: "",
    treatCalories: "",
    treatsPerDay: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const targetWeightRaw = parseFloat(inputs.targetWeight);
    const treatCaloriesRaw = parseFloat(inputs.treatCalories);
    const treatsPerDayRaw = parseInt(inputs.treatsPerDay);

    // Safety Check
    if (
      !weightRaw ||
      weightRaw <= 0 ||
      !targetWeightRaw ||
      targetWeightRaw <= 0 ||
      !treatCaloriesRaw ||
      treatCaloriesRaw <= 0
    )
      return {
        value: 0,
        label: "Enter valid details above to see results.",
        subtext: null,
        warning: null,
      };

    // Convert weights to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;
    const targetWeightKg =
      unit === "imperial" ? targetWeightRaw / 2.20462 : targetWeightRaw;

    // Calculate Resting Energy Requirement (RER)
    // RER = 70 * (weight_kg ^ 0.75)
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Determine Maintenance Energy Requirement (MER) multiplier
    // For weight loss, MER = 1.0 * RER (veterinary standard)
    // For maintenance, MER ~ 1.6 * RER (average active dog)
    // Since targetWeight < current weight => weight loss mode
    // If targetWeight >= current weight, assume maintenance (1.6)
    const isWeightLoss = targetWeightKg < weightKg;
    const merMultiplier = isWeightLoss ? 1.0 : 1.6;

    // Calculate daily calorie allowance for weight loss or maintenance
    const dailyCalorieAllowance = rer * merMultiplier;

    // Calculate total treat calories consumed if treatsPerDay is provided
    const totalTreatCalories = treatsPerDayRaw
      ? treatCaloriesRaw * treatsPerDayRaw
      : 0;

    // Calculate max safe treat calories (10% of daily calories recommended by vets)
    const maxTreatCalories = dailyCalorieAllowance * 0.1;

    // Calculate max number of treats allowed safely
    const maxTreatsAllowed = treatCaloriesRaw
      ? Math.floor(maxTreatCalories / treatCaloriesRaw)
      : 0;

    // Prepare display values in user's unit system
    const weightDisplay =
      unit === "imperial"
        ? weightKg * 2.20462
        : weightKg; /* Should match input unit */
    const targetWeightDisplay =
      unit === "imperial"
        ? targetWeightKg * 2.20462
        : targetWeightKg;

    // Format numbers with commas and fixed decimals
    const formatNum = (num: number, decimals = 0) =>
      num.toLocaleString(undefined, { maximumFractionDigits: decimals });

    // Compose result label and subtext
    let label = "";
    let subtext = "";
    let warning = null;

    if (isWeightLoss) {
      label = `Daily Calorie Allowance for Weight Loss: ${formatNum(
        dailyCalorieAllowance,
        0
      )} kcal`;
      subtext = `To safely lose weight from ${formatNum(
        weightDisplay,
        1
      )} ${unit === "imperial" ? "lbs" : "kg"} to ${formatNum(
        targetWeightDisplay,
        1
      )} ${unit === "imperial" ? "lbs" : "kg"}, your dog should consume approximately ${formatNum(
        dailyCalorieAllowance,
        0
      )} calories daily.`;
    } else {
      label = `Daily Calorie Maintenance Allowance: ${formatNum(
        dailyCalorieAllowance,
        0
      )} kcal`;
      subtext = `To maintain your dog's current weight of ${formatNum(
        weightDisplay,
        1
      )} ${unit === "imperial" ? "lbs" : "kg"}, the estimated daily calorie need is approximately ${formatNum(
        dailyCalorieAllowance,
        0
      )} calories.`;
    }

    // Add treat allowance info if treat calories input is provided
    if (treatCaloriesRaw > 0) {
      subtext += `\n\nVeterinary guidelines recommend treats should not exceed 10% of daily calories. This means a maximum of ${formatNum(
        maxTreatCalories,
        0
      )} kcal from treats daily.`;

      if (treatsPerDayRaw && treatsPerDayRaw > maxTreatsAllowed) {
        warning = `Warning: The number of treats entered (${treatsPerDayRaw}) exceeds the safe daily treat allowance (${maxTreatsAllowed}). Excess treats can lead to weight gain and health issues.`;
      } else if (treatsPerDayRaw) {
        subtext += `\n\nYour dog is currently receiving approximately ${formatNum(
          totalTreatCalories,
          0
        )} kcal from treats daily, which is within the safe limit.`;
      } else {
        subtext += `\n\nBased on treat calories, your dog can safely have up to ${maxTreatsAllowed} treats per day.`;
      }
    }

    return {
      value: formatNum(dailyCalorieAllowance, 0),
      label,
      subtext,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (Rich Content)
  const faqs = [
    {
      question:
        "Why is it important to calculate the calorie content of dog treats?",
      answer:
        "Calculating the calorie content of dog treats is crucial because treats can significantly contribute to a dog's daily caloric intake. Overfeeding treats without accounting for their calories can lead to **canine obesity**, which increases the risk of diabetes, joint problems, and reduced lifespan. Understanding treat calories helps maintain a balanced diet and healthy weight.",
    },
    {
      question:
        "How does the Resting Energy Requirement (RER) influence daily calorie needs?",
      answer:
        "The **Resting Energy Requirement (RER)** represents the baseline calories a dog needs at rest to maintain vital body functions. It is calculated using the dog's weight raised to the 0.75 power, reflecting metabolic scaling. RER forms the foundation for estimating total daily calorie needs by applying activity multipliers, ensuring energy intake matches lifestyle and health goals.",
    },
    {
      question:
        "Why should treats be limited to 10% of a dog's daily calorie intake?",
      answer:
        "Limiting treats to 10% of daily calories prevents excessive calorie consumption that can disrupt nutritional balance and promote weight gain. Treats often lack essential nutrients and can replace healthier food portions if overfed. This guideline helps maintain optimal weight and supports overall health by ensuring treats complement rather than dominate the diet.",
    },
    {
      question:
        "How can I safely adjust my dog's treat allowance during weight loss?",
      answer:
        "During weight loss, a dog's total calorie intake must be reduced, including treats. Using this calculator, you can determine a safe daily calorie allowance and calculate the maximum treat calories within that limit. Reducing treat quantity or choosing low-calorie treats helps prevent exceeding calorie goals, supporting gradual, healthy weight loss without compromising treat enjoyment.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET UI
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

        {/* Current Weight */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
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
            placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Target Weight */}
        <div>
          <Label htmlFor="targetWeight" className="text-slate-700 dark:text-slate-300">
            Target Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="targetWeight"
            type="number"
            min={0}
            step="any"
            value={inputs.targetWeight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, targetWeight: e.target.value }))
            }
            placeholder={`Enter target weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Treat Calories per Treat */}
        <div>
          <Label htmlFor="treatCalories" className="text-slate-700 dark:text-slate-300">
            Calories per Treat (kcal)
          </Label>
          <Input
            id="treatCalories"
            type="number"
            min={0}
            step="any"
            value={inputs.treatCalories}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, treatCalories: e.target.value }))
            }
            placeholder="Enter calories in one treat"
          />
        </div>

        {/* Number of Treats per Day */}
        <div>
          <Label htmlFor="treatsPerDay" className="text-slate-700 dark:text-slate-300">
            Number of Treats per Day (optional)
          </Label>
          <Input
            id="treatsPerDay"
            type="number"
            min={0}
            step={1}
            value={inputs.treatsPerDay}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, treatsPerDay: e.target.value }))
            }
            placeholder="Enter how many treats your dog gets daily"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger calculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ weight: "", targetWeight: "", treatCalories: "", treatsPerDay: "" })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 whitespace-pre-line">
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
              <strong>Veterinary Disclaimer:</strong> This tool is for educational
              purposes. Consult your veterinarian for a specific weight loss plan.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      {/* WHAT IS SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Treat Calories & Daily Allowance Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The <strong>Dog Treat Calories & Daily Allowance Calculator</strong> is a
          specialized tool designed to help dog owners accurately estimate the
          caloric content of treats and determine a safe daily treat allowance. In
          veterinary nutrition, managing a dog's calorie intake is essential to
          prevent <strong>canine obesity</strong>, a condition linked to numerous
          health complications such as diabetes, arthritis, and cardiovascular
          disease. This calculator integrates veterinary formulas to provide
          precise calorie recommendations tailored to your dog's weight and weight
          goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Central to this calculator is the concept of the <strong>Resting Energy
          Requirement (RER)</strong>, which estimates the baseline calories a dog
          needs at rest to maintain vital bodily functions. The RER is calculated
          using the dog's weight raised to the power of 0.75, reflecting metabolic
          scaling principles recognized in veterinary science. By applying an
          activity multiplier known as the Maintenance Energy Requirement (MER),
          the calculator adjusts the RER to reflect your dog's lifestyle and weight
          management goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Treats, while often used as rewards or supplements, can contribute
          significantly to a dog's daily calorie intake. Without careful
          monitoring, treats can inadvertently cause calorie excess, leading to
          weight gain. This calculator helps quantify treat calories and advises on
          a maximum treat allowance, typically recommended to be no more than 10%
          of total daily calories, ensuring treats complement rather than disrupt a
          balanced diet.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide you with
          actionable insights for managing your dog's treat intake safely. Begin by
          selecting your preferred unit system—Imperial (pounds) or Metric
          (kilograms)—to match your familiar measurement standards. Then, enter your
          dog's current weight and target weight to establish the weight management
          context.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, input the calorie content per treat, which can often be found on
          treat packaging or obtained from the manufacturer. Optionally, enter the
          number of treats your dog currently receives daily to assess if this
          amount fits within safe caloric limits. Once all inputs are provided,
          clicking the calculate button will display your dog's estimated daily
          calorie allowance and the maximum safe treat allowance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Enter your dog's present weight to
            calculate baseline energy needs accurately.
          </li>
          <li>
            <strong>Target Weight:</strong> Specify your dog's ideal or goal weight
            to tailor calorie recommendations for maintenance or weight loss.
          </li>
          <li>
            <strong>Calories per Treat:</strong> Input the calorie value of a single
            treat to quantify treat intake precisely.
          </li>
          <li>
            <strong>Number of Treats per Day:</strong> (Optional) Enter how many
            treats your dog receives daily to check if this fits within safe limits.
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
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.petobesityprevention.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Association for Pet Obesity Prevention (APOP)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Guidelines on safe weight loss rates and caloric restriction for dogs
              and cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-in-dogs-and-cats/energy-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Energy Requirements in Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive overview of energy needs, including RER and MER formulas.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines-for-dogs-and-cats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA) Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Evidence-based recommendations for canine nutrition and weight management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vetnutrition.tufts.edu/2018/02/energy-requirements-of-dogs-and-cats/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Tufts University Cummings Veterinary Nutrition Blog
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Expert insights on calculating energy requirements and managing pet diets.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Treat Calories & Daily Allowance Calculator"
      description="Calculate the calorie content of treats and the maximum safe daily treat allowance to prevent weight gain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Veterinary Formula",
        formula: "RER = 70 × (Weight in kg)^0.75",
        variables: [
          {
            symbol: "RER",
            description: "Resting Energy Requirement (Calories at rest)",
          },
          {
            symbol: "MER",
            description: "Maintenance Energy Requirement (Activity Multiplier)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb dog aims to lose weight to 25 lbs. Each treat contains 15 kcal, and the owner gives 5 treats daily.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weights to kg: 30 lb = 13.6 kg, 25 lb = 11.3 kg. Calculate RER: 70 × 13.6^0.75 ≈ 444 kcal.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate daily allowance for weight loss: MER = 1.0 × RER = 444 kcal. Max treat calories = 10% × 444 = 44 kcal, so max treats = 44 / 15 ≈ 2 treats.",
          },
        ],
        result:
          "The dog should consume about 444 kcal daily for weight loss, with no more than 2 treats per day to stay within safe calorie limits.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
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
        {
          id: "what-is",
          label: "Understanding Dog Treat Calories & Daily Allowance Calculator",
        },
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