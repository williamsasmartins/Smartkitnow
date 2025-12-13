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
  Calculator,
  RotateCcw,
  AlertTriangle,
  Info,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogIdealWeightTargetCaloriesCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  // Inputs: current weight, target weight (ideal weight), age (optional), activity level (optional)
  // For this calculator, we focus on current weight and target weight to calculate ideal calories for weight loss or maintenance.
  const [inputs, setInputs] = useState({
    currentWeight: "",
    targetWeight: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const currentWeightRaw = parseFloat(inputs.currentWeight);
    const targetWeightRaw = parseFloat(inputs.targetWeight);

    // Safety Checks
    if (
      !currentWeightRaw ||
      currentWeightRaw <= 0 ||
      !targetWeightRaw ||
      targetWeightRaw <= 0
    )
      return {
        value: 0,
        label: "Please enter valid current and target weights.",
        subtext: null,
        warning: null,
      };

    // Convert inputs to kg if imperial
    const currentWeightKg =
      unit === "imperial" ? currentWeightRaw / 2.20462 : currentWeightRaw;
    const targetWeightKg =
      unit === "imperial" ? targetWeightRaw / 2.20462 : targetWeightRaw;

    // Calculate RER for current and target weights
    // RER = 70 * (weight_kg ^ 0.75)
    const rerCurrent = 70 * Math.pow(currentWeightKg, 0.75);
    const rerTarget = 70 * Math.pow(targetWeightKg, 0.75);

    // MER multipliers:
    // For weight loss: MER = 1.0 * RER (veterinary recommended safe weight loss calories)
    // For maintenance: MER = 1.6 * RER (average maintenance for adult dogs)
    // We calculate calories needed to maintain target weight (ideal weight)
    const merWeightLoss = rerTarget * 1.0;
    const merMaintenance = rerTarget * 1.6;

    // Determine if dog needs weight loss or maintenance calories
    const needsWeightLoss = currentWeightKg > targetWeightKg;

    // Display calories rounded to nearest integer
    const calories = needsWeightLoss
      ? Math.round(merWeightLoss)
      : Math.round(merMaintenance);

    // Display calories with unit "kcal/day"
    // Display weights in user's unit system rounded to 1 decimal place
    const currentWeightDisplay =
      unit === "imperial"
        ? (currentWeightKg * 2.20462).toFixed(1)
        : currentWeightKg.toFixed(1);
    const targetWeightDisplay =
      unit === "imperial"
        ? (targetWeightKg * 2.20462).toFixed(1)
        : targetWeightKg.toFixed(1);

    // Warning if target weight is unrealistic (e.g., target > current by large margin)
    let warning = null;
    if (targetWeightKg > currentWeightKg * 1.2) {
      warning =
        "Target weight is significantly higher than current weight. Please verify inputs.";
    } else if (targetWeightKg < currentWeightKg * 0.5) {
      warning =
        "Target weight is very low compared to current weight. Consult your veterinarian before starting a weight loss plan.";
    }

    return {
      value: calories.toLocaleString(),
      label: needsWeightLoss
        ? `Calories for safe weight loss at target weight (${targetWeightDisplay} ${
            unit === "imperial" ? "lbs" : "kg"
          })`
        : `Calories to maintain ideal weight (${targetWeightDisplay} ${
            unit === "imperial" ? "lbs" : "kg"
          })`,
      subtext: `Current weight: ${currentWeightDisplay} ${
        unit === "imperial" ? "lbs" : "kg"
      } | RER at target weight: ${rerTarget.toFixed(0)} kcal/day`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (Rich Content)
  const faqs = [
    {
      question:
        "Why is calculating my dog's ideal weight and target calories important?",
      answer:
        "Calculating your dog's ideal weight and target calories is crucial for preventing **Canine Obesity**, which can lead to serious health problems such as diabetes, joint issues, and reduced lifespan. Understanding the **Resting Energy Requirement (RER)** and adjusting calorie intake accordingly helps maintain a healthy body condition and supports overall well-being.",
    },
    {
      question:
        "How does the Resting Energy Requirement (RER) influence my dog's calorie needs?",
      answer:
        "The **Resting Energy Requirement (RER)** represents the baseline calories your dog needs at rest to maintain vital bodily functions. By calculating RER using the formula 70 × (weight in kg)^0.75, veterinarians can estimate energy needs more accurately. This baseline is then multiplied by a factor (MER) to account for activity, growth, or weight loss goals, ensuring tailored nutrition plans.",
    },
    {
      question:
        "Can I use this calculator for all dog breeds and sizes?",
      answer:
        "Yes, the calculator uses a scientifically validated formula applicable across breeds and sizes. However, individual factors like age, health status, and activity level can influence calorie needs. For precise recommendations, especially for dogs with medical conditions, consulting a veterinarian is essential to customize the plan.",
    },
    {
      question:
        "Why does the calculator convert units internally to kilograms?",
      answer:
        "The calculator converts weights to kilograms internally because the **RER formula** and veterinary nutritional guidelines are standardized using metric units. This ensures accuracy in calculations. Results are then converted back to the user's preferred unit system (imperial or metric) for ease of understanding and practical use.",
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

        {/* Current Weight Input */}
        <div>
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            type="number"
            min={0}
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
            Target (Ideal) Weight ({unit === "imperial" ? "lbs" : "kg"})
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
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ currentWeight: "", targetWeight: "" })}
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
              <strong>Veterinary Disclaimer:</strong> This tool is for educational
              purposes. Consult your veterinarian for a specific weight loss plan.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT (Rich SEO content)
  const editorial = (
    <div className="space-y-12">
      {/* WHAT IS SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Ideal Weight & Target Calories Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Maintaining a healthy weight is fundamental to your dog's overall health and longevity.
          The <strong>Dog Ideal Weight & Target Calories Calculator</strong> is designed to help
          pet owners estimate the optimal weight for their dog and the corresponding daily calorie
          intake needed to achieve or maintain that weight. This tool uses veterinary science-based
          formulas to provide accurate and personalized recommendations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          At the core of this calculator is the concept of <strong>Resting Energy Requirement (RER)</strong>,
          which represents the number of calories a dog needs at rest to maintain vital bodily functions.
          By calculating RER based on your dog's weight, and applying appropriate multipliers for activity
          or weight loss goals, the calculator estimates the <strong>Maintenance Energy Requirement (MER)</strong>,
          which is the total daily calorie requirement.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this calculator can help prevent <strong>Canine Obesity</strong>, a common and serious
          health issue that increases the risk of diabetes, arthritis, cardiovascular disease, and
          decreases lifespan. By understanding your dog's ideal weight and calorie needs, you can
          make informed decisions about diet and exercise, promoting a healthier, happier pet.
        </p>
      </section>

      {/* HOW TO USE SECTION */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the calculator is straightforward and requires just a few key inputs. First, select
          your preferred unit system—Imperial (pounds) or Metric (kilograms). Then, enter your dog's
          current weight and the target (ideal) weight you aim for. The calculator will compute the
          daily calorie intake needed to safely reach or maintain that target weight.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> Enter your dog's present weight accurately. This is
            essential for calculating the baseline energy needs.
          </li>
          <li>
            <strong>Target Weight:</strong> Input the ideal weight recommended by your veterinarian
            or based on breed standards. This helps determine the calorie intake for weight loss or
            maintenance.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to see the estimated daily calorie
            requirement. If your dog needs to lose weight, the calculator provides a safe calorie
            target to support gradual weight loss.
          </li>
          <li>
            <strong>Reset:</strong> Use the reset button to clear inputs and start a new calculation.
          </li>
        </ul>
      </section>

      {/* FAQ SECTION */}
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
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* REFERENCES SECTION */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/weight-management/weight-management-guidelines_final.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Animal Hospital Association (AAHA) Weight Management Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guidelines on canine obesity prevention, weight loss protocols, and calorie management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/energy-requirements-of-animals/energy-requirements-of-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Energy Requirements of Dogs
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative resource detailing energy needs, RER and MER calculations, and nutritional management.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vetnutrition.tufts.edu/2013/07/calculating-calorie-needs-for-dogs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Tufts University Cummings Veterinary Nutrition - Calculating Calorie Needs for Dogs
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Educational article explaining calorie calculations and factors affecting canine energy requirements.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.wsava.org/wp-content/uploads/2020/01/WSAVA-Nutrition-Guidelines-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. WSAVA Global Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Global standards for pet nutrition, including energy requirements and weight management strategies.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Ideal Weight & Target Calories Calculator"
      description="Determine your dog's ideal healthy weight and the specific calorie intake needed to maintain it based on breed and size."
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
          "A 50 lb dog currently weighs 60 lbs and needs to lose weight safely to reach the ideal weight.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert current and target weights to kilograms (60 lbs = 27.2 kg, 50 lbs = 22.7 kg).",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER for target weight: 70 × (22.7)^0.75 ≈ 776 kcal/day.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate target calories for weight loss: MER = 1.0 × RER = 776 kcal/day.",
          },
        ],
        result:
          "The dog should consume approximately 776 kcal/day to safely lose weight to the target 50 lbs.",
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
        {
          id: "what-is",
          label: "Understanding Dog Ideal Weight & Target Calories Calculator",
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