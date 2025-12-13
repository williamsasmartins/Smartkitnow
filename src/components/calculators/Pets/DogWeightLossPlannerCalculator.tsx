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
  Scale,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogWeightLossPlannerCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  // Inputs: Current Weight, Target Weight, Weekly Weight Loss Rate (%)
  const [inputs, setInputs] = useState({
    currentWeight: "",
    targetWeight: "",
    weeklyLossPercent: "2", // default safe weight loss rate 2%
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const currentWeightRaw = parseFloat(inputs.currentWeight);
    const targetWeightRaw = parseFloat(inputs.targetWeight);
    const weeklyLossPercentRaw = parseFloat(inputs.weeklyLossPercent);

    // Validation
    if (
      !currentWeightRaw ||
      currentWeightRaw <= 0 ||
      !targetWeightRaw ||
      targetWeightRaw <= 0 ||
      targetWeightRaw >= currentWeightRaw ||
      !weeklyLossPercentRaw ||
      weeklyLossPercentRaw <= 0 ||
      weeklyLossPercentRaw > 5
    ) {
      return {
        value: 0,
        label:
          "Please enter valid positive weights with target less than current weight and weekly loss between 0-5%.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weights to kg if imperial
    const currentWeightKg =
      unit === "imperial" ? currentWeightRaw / 2.20462 : currentWeightRaw;
    const targetWeightKg =
      unit === "imperial" ? targetWeightRaw / 2.20462 : targetWeightRaw;

    // Veterinary Math:
    // RER = 70 * (weight_kg ^ 0.75)
    // For weight loss, MER = 1.0 * RER (safe weight loss calories)
    // Calculate current RER and target RER for info

    const currentRER = 70 * Math.pow(currentWeightKg, 0.75);
    const targetRER = 70 * Math.pow(targetWeightKg, 0.75);

    // Target calories for weight loss = MER = 1.0 * RER at target weight (safe caloric intake)
    const targetCalories = targetRER * 1.0;

    // Calculate total weight to lose (kg)
    const totalWeightLossKg = currentWeightKg - targetWeightKg;

    // Weekly weight loss in kg based on % of current weight
    const weeklyLossKg = (weeklyLossPercentRaw / 100) * currentWeightKg;

    // Calculate estimated weeks to reach target weight
    const weeksToGoal = totalWeightLossKg / weeklyLossKg;

    // Format output values based on unit
    const formatWeight = (kg: number) =>
      unit === "imperial"
        ? (kg * 2.20462).toFixed(1) + " lbs"
        : kg.toFixed(1) + " kg";

    const formatCalories = (cal: number) => Math.round(cal) + " kcal/day";

    // Warning if weekly loss % > 3% (generally safe max)
    const warning =
      weeklyLossPercentRaw > 3
        ? "Weekly weight loss above 3% may be unsafe. Consult your veterinarian."
        : null;

    return {
      value: formatCalories(targetCalories),
      label: `Daily Caloric Intake for Weight Loss`,
      subtext: `To safely reduce your dog's weight from ${formatWeight(
        currentWeightKg
      )} to ${formatWeight(
        targetWeightKg
      )}, feed approximately ${formatCalories(
        targetCalories
      )}. Estimated time to goal: ${Math.ceil(weeksToGoal)} weeks at a weekly loss of ${weeklyLossPercentRaw}%.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (Rich Content)
  const faqs = [
    {
      question:
        "Why is it important to calculate Resting Energy Requirement (RER) for dog weight loss?",
      answer:
        "Calculating the **Resting Energy Requirement (RER)** is essential because it represents the baseline calories your dog needs at rest to maintain vital body functions. For weight loss, feeding below the RER adjusted by a safe multiplier ensures your dog loses weight without compromising health or muscle mass. This veterinary-based approach prevents malnutrition and supports safe, gradual weight loss.",
    },
    {
      question:
        "How does the Maintenance Energy Requirement (MER) multiplier affect a dog's weight loss plan?",
      answer:
        "The **Maintenance Energy Requirement (MER)** multiplier adjusts the RER based on activity level and physiological state. For weight loss, a MER of around 1.0 is typically used to create a caloric deficit while still meeting essential energy needs. Using an appropriate MER ensures the dog loses weight safely without excessive hunger or metabolic slowdown, which can occur with overly restrictive diets.",
    },
    {
      question:
        "Why should weekly weight loss rates be limited to 1-3% of body weight?",
      answer:
        "Limiting weekly weight loss to 1-3% of body weight is critical to avoid health risks such as nutrient deficiencies, muscle loss, and metabolic imbalances. Rapid weight loss can stress organs and lead to complications like hepatic lipidosis. A gradual rate supports sustainable fat loss, preserves lean tissue, and improves long-term success in managing **canine obesity**.",
    },
    {
      question:
        "How does converting between imperial and metric units impact the accuracy of the weight loss plan?",
      answer:
        "Accurate unit conversion between imperial (lbs) and metric (kg) is vital because veterinary formulas like RER are based on kilograms. Incorrect conversions can lead to over- or underestimating caloric needs, risking ineffective or unsafe weight loss plans. This calculator ensures precise internal conversions, maintaining veterinary accuracy regardless of user preference.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget Inputs and UI
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

        {/* Current Weight Input */}
        <div>
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            type="number"
            min="0"
            step="any"
            value={inputs.currentWeight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, currentWeight: e.target.value }))
            }
            placeholder={`Enter current weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Target Weight Input */}
        <div>
          <Label htmlFor="targetWeight" className="text-slate-700 dark:text-slate-300">
            Target Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="targetWeight"
            type="number"
            min="0"
            step="any"
            value={inputs.targetWeight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, targetWeight: e.target.value }))
            }
            placeholder={`Enter target weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          />
        </div>

        {/* Weekly Weight Loss Percentage Input */}
        <div>
          <Label htmlFor="weeklyLossPercent" className="text-slate-700 dark:text-slate-300">
            Desired Weekly Weight Loss (% of current weight)
          </Label>
          <Input
            id="weeklyLossPercent"
            type="number"
            min="0.5"
            max="5"
            step="0.1"
            value={inputs.weeklyLossPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weeklyLossPercent: e.target.value }))
            }
            placeholder="Recommended 1-3%"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers re-render, calculation is in useMemo
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ currentWeight: "", targetWeight: "", weeklyLossPercent: "2" })
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
              purposes only. Always consult your veterinarian before starting or
              modifying your dog's weight loss plan to ensure safety and effectiveness.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial Content (Rich SEO Content)
  const editorial = (
    <div className="space-y-12">
      {/* Understanding Section */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Weight Loss Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Managing **canine obesity** is a critical aspect of maintaining your dog's
          overall health and longevity. Excess weight can lead to serious health
          complications such as diabetes, arthritis, and cardiovascular disease.
          The **Dog Weight Loss Planner** is designed to provide a veterinary-based,
          personalized approach to safely reduce your dog's weight by calculating
          their daily caloric needs and estimating a realistic timeline for weight
          loss.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Central to this planner is the calculation of the **Resting Energy
          Requirement (RER)**, which estimates the calories your dog needs at rest
          to maintain vital bodily functions. By applying a safe multiplier known as
          the **Maintenance Energy Requirement (MER)**, adjusted for weight loss,
          this tool helps determine the optimal caloric intake that supports fat
          loss while preserving lean muscle mass and overall well-being.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This planner also incorporates a recommended weekly weight loss percentage,
          typically between 1-3% of the dog's current body weight, to ensure gradual
          and sustainable weight reduction. Rapid weight loss can be dangerous,
          leading to nutrient deficiencies and metabolic disturbances. By following
          this scientifically-backed approach, pet owners can confidently guide their
          dogs toward a healthier weight.
        </p>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Dog Weight Loss Planner is straightforward and requires just a
          few key inputs. First, select your preferred unit system—Imperial (lbs) or
          Metric (kg)—to match how you measure your dog’s weight. Then, enter your
          dog’s current weight and the target weight you aim for. Finally, specify
          the desired weekly weight loss percentage, with 2% being a safe default.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Input your dog’s present weight accurately
            to ensure precise calculations of energy requirements.
          </li>
          <li>
            <strong>Target Weight:</strong> Set a realistic and healthy goal weight
            based on veterinary recommendations.
          </li>
          <li>
            <strong>Weekly Weight Loss Percentage:</strong> Choose a safe rate of weight
            loss, typically between 1-3%, to promote gradual fat reduction without
            compromising health.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these values, click “Calculate” to view the recommended daily
          caloric intake and an estimated timeline for reaching your dog’s target
          weight. Remember, this tool provides an estimate; always consult your
          veterinarian for a tailored weight loss plan.
        </p>
      </section>

      {/* FAQ Section */}
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

      {/* References Section */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/weight-management/weight-management-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Animal Hospital Association (AAHA) Weight Management Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guidelines on safe weight loss rates, caloric restriction,
              and nutritional management for dogs and cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/obesity-in-dogs-and-cats/obesity-in-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Obesity in Dogs
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative resource detailing causes, risks, and management strategies
              for canine obesity, including energy requirement formulas.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vetnutrition.tufts.edu/2018/03/energy-requirements-of-dogs-and-cats/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Tufts University Cummings School of Veterinary Medicine - Energy Requirements of Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Detailed explanation of RER and MER calculations and their application in
              clinical nutrition for weight management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.apopcares.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Association for Pet Obesity Prevention (APOP)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Provides data and guidelines on pet obesity prevalence and safe weight loss
              strategies.
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
        formula: "RER = 70 × (Weight in kg)^0.75",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (Calories at rest)" },
          { symbol: "MER", description: "Maintenance Energy Requirement (Activity Multiplier)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb dog currently overweight aims to reach a healthy weight of 24 lbs with a weekly weight loss goal of 2%.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weights to kg: 30 lbs ≈ 13.6 kg, 24 lbs ≈ 10.9 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER at target weight: RER = 70 × (10.9)^0.75 ≈ 394 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Set MER for weight loss at 1.0 × RER = 394 kcal/day as daily caloric intake.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate weekly weight loss: 2% of 13.6 kg = 0.27 kg/week, total loss = 2.7 kg, estimated time ≈ 10 weeks.",
          },
        ],
        result:
          "Feed approximately 394 kcal/day to achieve a safe weight loss of 2% per week, reaching the target weight in about 10 weeks.",
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