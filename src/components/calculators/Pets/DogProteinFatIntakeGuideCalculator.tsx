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

export default function DogProteinFatIntakeGuideCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  // Inputs: Current Weight, Target Weight, Goal (Growth, Maintenance, Weight Loss, Athletic)
  const [inputs, setInputs] = useState({
    weight: "",
    targetWeight: "",
    goal: "maintenance",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const targetWeightRaw = parseFloat(inputs.targetWeight);
    const goal = inputs.goal;

    // Safety Check
    if (!weightRaw || weightRaw <= 0) {
      return {
        proteinGrams: 0,
        fatGrams: 0,
        calories: 0,
        label: "Enter valid current weight...",
        subtext: null,
        warning: null,
      };
    }
    if (
      (goal === "weightloss" || goal === "growth") &&
      (!targetWeightRaw || targetWeightRaw <= 0)
    ) {
      return {
        proteinGrams: 0,
        fatGrams: 0,
        calories: 0,
        label: "Enter valid target weight for this goal...",
        subtext: null,
        warning: null,
      };
    }

    // Conversion to kg
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;
    const targetWeightKg =
      unit === "imperial" ? targetWeightRaw / 2.20462 : targetWeightRaw;

    // Veterinary Math
    // RER = 70 * (weight_kg ^ 0.75)
    // MER multipliers:
    // Growth: 2.0 x RER (puppy growth)
    // Maintenance: 1.6 x RER (average adult)
    // Weight Loss: 1.0 x RER (caloric restriction)
    // Athletic: 2.0 x RER (high activity)

    // Determine working weight for RER calculation
    // For weight loss, use target weight (ideal weight) for MER calc to avoid overfeeding
    // For growth, use target weight (expected adult weight)
    // For maintenance and athletic, use current weight

    let rer = 0;
    let mer = 1.6; // default maintenance

    if (goal === "growth") {
      rer = 70 * Math.pow(targetWeightKg, 0.75);
      mer = 2.0;
    } else if (goal === "maintenance") {
      rer = 70 * Math.pow(weightKg, 0.75);
      mer = 1.6;
    } else if (goal === "weightloss") {
      rer = 70 * Math.pow(targetWeightKg, 0.75);
      mer = 1.0;
    } else if (goal === "athletic") {
      rer = 70 * Math.pow(weightKg, 0.75);
      mer = 2.0;
    } else {
      // fallback
      rer = 70 * Math.pow(weightKg, 0.75);
      mer = 1.6;
    }

    const dailyCalories = rer * mer;

    // Protein and Fat intake ranges (g/kg body weight/day)
    // Source: AAHA, Merck Vet Manual, Tufts Vet Nutrition
    // Protein:
    // Growth: 4.0 - 6.0 g/kg
    // Maintenance: 2.0 - 3.5 g/kg
    // Weight Loss: 3.0 - 4.5 g/kg (higher protein to preserve lean mass)
    // Athletic: 4.0 - 6.0 g/kg

    // Fat:
    // Growth: 2.5 - 4.0 g/kg
    // Maintenance: 1.0 - 2.0 g/kg
    // Weight Loss: 0.5 - 1.5 g/kg (moderate fat)
    // Athletic: 3.0 - 5.0 g/kg

    // Use midpoint of ranges for recommendation

    let proteinPerKg = 2.75;
    let fatPerKg = 1.5;

    if (goal === "growth") {
      proteinPerKg = (4.0 + 6.0) / 2; // 5.0
      fatPerKg = (2.5 + 4.0) / 2; // 3.25
    } else if (goal === "maintenance") {
      proteinPerKg = (2.0 + 3.5) / 2; // 2.75
      fatPerKg = (1.0 + 2.0) / 2; // 1.5
    } else if (goal === "weightloss") {
      proteinPerKg = (3.0 + 4.5) / 2; // 3.75
      fatPerKg = (0.5 + 1.5) / 2; // 1.0
    } else if (goal === "athletic") {
      proteinPerKg = (4.0 + 6.0) / 2; // 5.0
      fatPerKg = (3.0 + 5.0) / 2; // 4.0
    }

    // Calculate protein and fat grams based on current weight (not target) for intake
    // Protein and fat needs are based on current metabolic demands, so use current weight for intake calculation
    const proteinGrams = proteinPerKg * weightKg;
    const fatGrams = fatPerKg * weightKg;

    // Convert grams to display unit if needed (grams always grams, no conversion needed)

    // Calories from protein and fat (for info):
    // Protein: 4 kcal/g, Fat: 9 kcal/g
    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;

    // Warning if weight loss goal but current weight < target weight (dangerous)
    let warning = null;
    if (goal === "weightloss" && weightKg <= targetWeightKg) {
      warning =
        "Current weight is less than or equal to target weight. Weight loss goal may not be appropriate.";
    }

    // Format numbers nicely
    const formatNum = (num: number) => num.toFixed(1);

    return {
      proteinGrams: formatNum(proteinGrams),
      fatGrams: formatNum(fatGrams),
      calories: formatNum(dailyCalories),
      label: `Daily Protein & Fat Intake for ${goal.charAt(0).toUpperCase() + goal.slice(1)}`,
      subtext: `Estimated daily calories: ${formatNum(dailyCalories)} kcal`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (Rich Content)
  const faqs = [
    {
      question:
        "Why is it important to adjust protein and fat intake based on my dog's goal?",
      answer:
        "Adjusting protein and fat intake according to your dog's specific goal—whether growth, maintenance, weight loss, or athletic performance—is crucial because each state demands different nutrient levels. For example, growing puppies require higher protein and fat to support development, while weight loss plans emphasize higher protein to preserve lean muscle mass. Tailoring intake ensures optimal health and prevents nutritional imbalances.",
    },
    {
      question:
        "How does Resting Energy Requirement (RER) influence my dog's dietary needs?",
      answer:
        "The Resting Energy Requirement (RER) represents the calories a dog needs at rest to maintain vital bodily functions. It forms the baseline for calculating total daily energy needs by applying multipliers (MER) based on activity or health goals. Understanding RER helps veterinarians and pet owners create precise feeding plans that meet energy demands without overfeeding or underfeeding.",
    },
    {
      question:
        "Why do protein requirements increase during weight loss in dogs?",
      answer:
        "During weight loss, dogs need higher protein intake to preserve lean muscle mass while losing fat. Adequate protein prevents muscle wasting, supports immune function, and maintains metabolic rate. Without sufficient protein, weight loss may lead to unhealthy muscle loss, weakening the dog and potentially causing other health issues.",
    },
    {
      question:
        "Can I use this guide for all dog breeds and sizes?",
      answer:
        "While this guide provides general recommendations based on veterinary research, individual dogs vary widely by breed, size, age, and health status. Large breeds may have different nutrient needs than small breeds, and some medical conditions require specialized diets. Always consult your veterinarian to tailor feeding plans specific to your dog's unique requirements.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET INPUTS & UI
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

        {/* Target Weight (only for growth and weight loss goals) */}
        {(inputs.goal === "growth" || inputs.goal === "weightloss") && (
          <div>
            <Label
              htmlFor="targetWeight"
              className="text-slate-700 dark:text-slate-300"
            >
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
        )}

        {/* Goal Selector */}
        <div>
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Select Goal
          </Label>
          <Select
            id="goal"
            value={inputs.goal}
            onValueChange={(value) =>
              setInputs((prev) => ({
                ...prev,
                goal: value,
                // Reset targetWeight if goal changes to maintenance or athletic
                targetWeight:
                  value === "growth" || value === "weightloss"
                    ? prev.targetWeight
                    : "",
              }))
            }
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="growth">Growth (Puppy Development)</SelectItem>
              <SelectItem value="maintenance">Maintenance (Adult Dog)</SelectItem>
              <SelectItem value="weightloss">Weight Loss</SelectItem>
              <SelectItem value="athletic">Athletic Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation via state update (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              targetWeight: "",
              goal: "maintenance",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.proteinGrams !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Daily Intake
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-2">
                Protein: {results.proteinGrams} g
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-4">
                Fat: {results.fatGrams} g
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
              <strong>Veterinary Disclaimer:</strong> This tool is for
              educational purposes. Consult your veterinarian for a specific
              weight loss or nutrition plan tailored to your dog’s unique needs.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT (Rich SEO Content)
  const editorial = (
    <div className="space-y-12">
      {/* WHAT IS SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Protein/Fat Intake Guide (by Goal)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The <strong>Dog Protein/Fat Intake Guide (by Goal)</strong> is a
          veterinary-informed tool designed to help pet owners and professionals
          determine the optimal daily intake of protein and fat tailored to a
          dog’s specific life stage and health objectives. Protein and fat are
          essential macronutrients that support vital functions such as muscle
          development, energy metabolism, immune response, and overall cellular
          health. Understanding the precise needs based on your dog’s goal
          ensures balanced nutrition and promotes longevity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This guide incorporates the <strong>Resting Energy Requirement (RER)</strong>, a
          foundational veterinary formula that calculates the baseline caloric
          needs of a dog at rest. By applying specific multipliers known as the
          Maintenance Energy Requirement (MER), it adjusts for activity level,
          growth, weight loss, or athletic performance. This dynamic approach
          ensures that protein and fat intake recommendations are not generic
          but tailored to the metabolic demands of each goal.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By using this guide, pet owners can avoid common nutritional pitfalls
          such as underfeeding essential nutrients during growth or overfeeding
          calories during weight loss attempts. Proper protein and fat balance
          supports healthy weight management, muscle preservation, and energy
          availability, which are critical for maintaining your dog’s vitality
          and preventing chronic diseases.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your dog’s daily protein and fat requirements,
          begin by selecting the appropriate unit system—Imperial (lbs) or Metric
          (kg)—that matches your preference or measurement tools. Next, enter
          your dog’s current weight. If your goal involves growth or weight loss,
          you will also need to enter the target weight to reflect the desired
          outcome.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Choose the goal that best fits your dog’s current life stage or health
          objective: Growth for puppies, Maintenance for adult dogs, Weight Loss
          for overweight dogs, or Athletic Performance for highly active dogs.
          Once all inputs are provided, click “Calculate” to receive tailored
          protein and fat intake recommendations, along with estimated daily
          caloric needs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Current Weight:</strong> The dog’s present body weight,
            essential for calculating baseline energy needs.
          </li>
          <li>
            <strong>Target Weight:</strong> Required only for growth or weight
            loss goals, representing the ideal or expected weight.
          </li>
          <li>
            <strong>Goal Selection:</strong> Defines the metabolic multiplier
            and nutrient ranges to tailor intake recommendations.
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
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition_guidelines_final.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Animal Hospital Association (AAHA) Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive guidelines on canine nutrition, including energy
              requirements and nutrient recommendations for different life stages.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-dogs-and-cats/nutritional-requirements-of-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual - Nutritional Requirements of Dogs
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Authoritative resource detailing energy calculations and nutrient
              needs for dogs at various physiological states.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vetnutrition.tufts.edu/2014/07/energy-requirements-of-dogs-and-cats/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Tufts University Cummings School of Veterinary Medicine - Energy Requirements
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Detailed explanations of RER and MER calculations and their application
              in clinical nutrition.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petobesityprevention.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Association for Pet Obesity Prevention (APOP)
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Research and guidelines focused on safe weight loss rates and caloric
              restriction strategies for dogs and cats.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Protein/Fat Intake Guide (by Goal)"
      description="Guide for setting optimal protein and fat ratios in your dog's diet, tailored for growth, maintenance, weight loss, or athletic performance."
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
          "A 30 lb adult dog aiming for weight loss with a target weight of 25 lbs.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weights to kg: 30 lb = 13.6 kg, 25 lb = 11.3 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate RER using target weight: RER = 70 × (11.3)^0.75 ≈ 484 kcal.",
          },
          {
            label: "Step 3",
            explanation:
              "Apply MER for weight loss (1.0): Daily calories = 484 kcal.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate protein and fat intake based on current weight (13.6 kg) and weight loss goal ranges.",
          },
        ],
        result:
          "Recommended protein intake: ~51 g/day, fat intake: ~14 g/day, with daily calories around 484 kcal to support safe weight loss.",
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
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
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
          label: "Understanding Dog Protein/Fat Intake Guide (by Goal)",
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