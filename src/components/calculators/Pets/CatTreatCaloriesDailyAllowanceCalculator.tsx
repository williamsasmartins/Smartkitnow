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
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatTreatCaloriesDailyAllowanceCalculator() {
  // 1. STATE
  // Weight and volume involved, so keep unit switcher
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs: weight (lbs or kg), treat calories per treat (kcal), daily calorie allowance (kcal)
  // We only need weight and treat calories per treat as inputs; daily allowance is calculated.
  const [inputs, setInputs] = useState<{
    weight: string;
    treatCalories: string;
  }>({
    weight: "",
    treatCalories: "",
  });

  // 2. LOGIC ENGINE
  // Calculate:
  // 1. RER = 70 * (weight_kg)^0.75
  // 2. Daily Calorie Allowance = RER * 1.2 (average maintenance factor for indoor cats)
  // 3. Max treats per day = (Daily Calorie Allowance * 0.10) / treatCalories
  //  - Treat calories per treat must be > 0
  //  - Weight must be > 0
  //  - Show warnings if inputs invalid or unrealistic

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const treatCalNum = parseFloat(inputs.treatCalories);

    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive weight.",
      };
    }
    if (isNaN(treatCalNum) || treatCalNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive treat calorie value.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate RER
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Maintenance Energy Requirement (MER) for indoor cats ~1.2 * RER
    const mer = rer * 1.2;

    // Max calories from treats = 10% of MER
    const maxTreatCalories = mer * 0.1;

    // Max treats per day
    const maxTreats = maxTreatCalories / treatCalNum;

    // Round results nicely
    const rerRounded = Math.round(rer);
    const merRounded = Math.round(mer);
    const maxTreatCaloriesRounded = Math.round(maxTreatCalories);
    const maxTreatsRounded = Math.floor(maxTreats);

    let warning: string | null = null;
    if (maxTreatsRounded < 1) {
      warning =
        "Treat calories are high relative to your cat's needs. Limit treats accordingly.";
    }

    return {
      value: maxTreatsRounded > 0 ? maxTreatsRounded : 0,
      label: "Maximum Treats Per Day",
      subtext: `Based on a daily calorie allowance of ~${merRounded} kcal (RER: ${rerRounded} kcal). Treat calories capped at 10% of daily intake (~${maxTreatCaloriesRounded} kcal).`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "Why is it important to limit cat treat calories?",
      answer:
        "Limiting cat treat calories helps prevent obesity, which can lead to diabetes, arthritis, and other health issues. Treats should only make up about 10% of a cat’s daily caloric intake to maintain a balanced diet and healthy weight.",
    },
    {
      question: "How is the daily calorie allowance for cats calculated?",
      answer:
        "The daily calorie allowance is based on the Resting Energy Requirement (RER), calculated using the cat’s weight in kilograms raised to the 0.75 power, then multiplied by 70. This value is adjusted by a maintenance factor (typically 1.2 for indoor cats) to estimate total daily energy needs.",
    },
    {
      question: "Can I use this calculator for kittens or overweight cats?",
      answer:
        "This calculator is designed for healthy adult cats. Kittens and overweight cats have different energy requirements and should be assessed by a veterinarian for personalized feeding plans.",
    },
    {
      question: "What should I do if my cat refuses to eat the recommended number of treats?",
      answer:
        "Cats can be picky, and treat intake varies. If your cat refuses treats, ensure their main diet meets nutritional needs. Treats are optional and should never replace balanced meals or veterinary advice.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. JSX WIDGET

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={(v) => setUnit(v as "imperial" | "metric")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accurate weight is essential for precise calorie calculations.
          </p>
        </div>

        <div>
          <Label htmlFor="treatCalories" className="text-slate-700 dark:text-slate-300">
            Calories per Treat (kcal)
          </Label>
          <Input
            id="treatCalories"
            type="number"
            min={0}
            step="any"
            placeholder="Enter calories per single treat"
            value={inputs.treatCalories}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, treatCalories: e.target.value }))
            }
            aria-describedby="treat-cal-desc"
          />
          <p id="treat-cal-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Find this on the treat packaging or manufacturer's website.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", treatCalories: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              veterinarian for personalized diagnosis and feeding advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Cat Treat Calories & Daily Allowance
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cat treats are a popular way to reward and bond with your feline friend,
          but they can contribute significantly to your cat’s daily calorie intake.
          Overfeeding treats can lead to unwanted weight gain, obesity, and related
          health problems such as diabetes and joint issues. Understanding the
          caloric content of treats and how they fit into your cat’s overall diet is
          essential for maintaining optimal health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates your cat’s Resting Energy Requirement (RER) based
          on weight, then applies a maintenance factor to determine daily calorie
          needs. It then calculates a safe daily treat allowance, recommending that
          treats should not exceed 10% of total daily calories. This approach helps
          balance nutrition and enjoyment without compromising health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          By using this tool, cat owners can make informed decisions about treat
          quantities and select treats with appropriate calorie content. Always
          consult your veterinarian for personalized feeding plans, especially if
          your cat has special health considerations.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your cat’s treat allowance, follow these steps:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or
            Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s current weight in pounds or
            kilograms.
          </li>
          <li>
            <strong>Step 3:</strong> Input the calories per single treat, which can
            be found on the treat packaging or manufacturer’s website.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the maximum number of
            treats your cat can safely consume daily without exceeding 10% of their
            calorie needs.
          </li>
          <li>
            <strong>Step 5:</strong> Use this information to guide treat feeding and
            maintain a balanced diet.
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
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-cats-and-kittens/energy-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Energy Requirements of Cats
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource on feline nutrition and energy needs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition-guidelines-for-healthy-adult-dogs-and-cats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Animal Hospital Association (AAHA) Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Guidelines for maintaining healthy weight and nutrition in cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/nutrition-for-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. VCA Hospitals: Nutrition for Cats
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice on feeding and treat management for cats.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // 6. FORMULA & EXAMPLE

  const formula = {
    title: "Scientific Formula",
    formula:
      "RER = 70 × (Weight_kg)^0.75\nDaily Calorie Allowance = RER × 1.2\nMax Treat Calories = Daily Calorie Allowance × 0.10\nMax Treats = Max Treat Calories ÷ Calories per Treat",
    variables: [
      { symbol: "Weight_kg", description: "Cat's weight in kilograms" },
      { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
      { symbol: "Daily Calorie Allowance", description: "Estimated daily calories needed (kcal/day)" },
      { symbol: "Max Treat Calories", description: "Maximum calories from treats per day (kcal)" },
      { symbol: "Max Treats", description: "Maximum number of treats per day" },
    ],
  };

  const example = {
    title: "Case Study",
    scenario:
      "A 10 lb (4.54 kg) indoor cat is given treats that contain 5 kcal each. Calculate the maximum number of treats allowed per day.",
    steps: [
      {
        label: "1",
        explanation:
          "Convert weight to kg: 10 lbs ÷ 2.20462 = 4.54 kg",
      },
      {
        label: "2",
        explanation:
          "Calculate RER: 70 × (4.54)^0.75 ≈ 197 kcal/day",
      },
      {
        label: "3",
        explanation:
          "Calculate daily allowance: 197 × 1.2 = 236 kcal/day",
      },
      {
        label: "4",
        explanation:
          "Calculate max treat calories: 236 × 0.10 = 23.6 kcal/day",
      },
      {
        label: "5",
        explanation:
          "Calculate max treats: 23.6 ÷ 5 = 4.7 treats/day (rounded down to 4)",
      },
    ],
    result: "The cat can safely have up to 4 treats per day without exceeding 10% of its daily calorie allowance.",
  };

  return (
    <CalculatorVerticalLayout
      title="Cat Treat Calories & Daily Allowance"
      description="Calculate the caloric contribution of cat treats and set a safe daily limit to prevent excess weight gain."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        {
          title: "Horse Weight Estimator (Heart Girth & Length)",
          url: "/pets/horse-weight-estimator-girth-length",
          icon: "🐎",
        },
        {
          title: "Basking Temperature & Gradient Planner",
          url: "/pets/reptile-basking-temperature-gradient-planner",
          icon: "🐶",
        },
        {
          title: "Dog Crate Size Finder",
          url: "/pets/dog-crate-size-finder",
          icon: "🐶",
        },
        {
          title: "Dog Caffeine Toxicity Calculator",
          url: "/pets/dog-caffeine-toxicity",
          icon: "🐶",
        },
        {
          title: "Dog BMI/Body Index (educational)",
          url: "/pets/dog-bmi-body-index-educational",
          icon: "🐶",
        },
        {
          title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs",
          url: "/pets/dog-omega-3-epa-dha-supplement",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Treat Calories & Daily Allowance" },
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