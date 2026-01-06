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
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function SeniorCatNutritionCalorieAdjusterCalculator() {
  // 1. STATE
  // Weight is involved, so keep unit switcher
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and activity level (activity factor)
  // Age is implicit as "senior" (7+ years), so no input needed for age
  // We'll ask for weight and activity level (low, moderate, high)
  // Activity factor from veterinary nutrition literature:
  // Low activity: 1.0 (senior, less active)
  // Moderate activity: 1.2
  // High activity: 1.4 (rare in seniors, but possible)
  const [inputs, setInputs] = useState({
    weight: "",
    activity: "moderate",
  });

  // Helper: convert weight to kg if imperial
  const weightKg = useMemo(() => {
    const w = parseFloat(inputs.weight);
    if (isNaN(w) || w <= 0) return null;
    return unit === "imperial" ? w * 0.45359237 : w;
  }, [inputs.weight, unit]);

  // Activity factor map
  const activityFactors: Record<string, number> = {
    low: 1.0,
    moderate: 1.2,
    high: 1.4,
  };

  // 2. LOGIC ENGINE
  // Calculate RER and then MER adjusted for senior cats
  // RER = 70 * (weight_kg)^0.75
  // MER = RER * activity factor (adjusted for senior cats)
  // Senior cats often require fewer calories, so activity factor is lower than young adult cats.
  // We'll provide a warning if weight is out of typical range (e.g., <2kg or >10kg)
  const results = useMemo(() => {
    if (!weightKg) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }
    const af = activityFactors[inputs.activity] ?? 1.2;
    const rer = 70 * Math.pow(weightKg, 0.75);
    const mer = rer * af;

    // Convert calories to integer for display
    const calories = Math.round(mer);

    // Warning for unusual weights
    let warning: string | null = null;
    if (weightKg < 2) {
      warning =
        "Weight is below typical adult cat range; consult your veterinarian for precise needs.";
    } else if (weightKg > 10) {
      warning =
        "Weight is above typical adult cat range; ensure this is accurate and consult your veterinarian.";
    }

    return {
      value: calories.toLocaleString(),
      label: "Daily Calorie Requirement (kcal)",
      subtext:
        "Estimated calories needed per day based on weight and activity level for senior cats.",
      warning,
    };
  }, [weightKg, inputs.activity]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "Why do senior cats require adjusted calorie intake?",
      answer:
        "As cats age, their metabolism and activity levels typically decrease, which reduces their calorie requirements. Adjusting calorie intake helps prevent obesity and related health issues, ensuring they maintain a healthy weight and quality of life.",
    },
    {
      question: "How is the Resting Energy Requirement (RER) calculated for cats?",
      answer:
        "RER is calculated using the formula 70 × (weight in kg)^0.75. It represents the energy needed for basic physiological functions at rest and serves as the baseline for determining total calorie needs.",
    },
    {
      question:
        "What factors influence the Maintenance Energy Requirement (MER) in senior cats?",
      answer:
        "MER accounts for activity level, health status, and life stage. In senior cats, reduced activity and metabolic changes lower MER compared to younger cats, so calorie needs are adjusted accordingly.",
    },
    {
      question:
        "Can I use this calculator for cats with special health conditions?",
      answer:
        "This tool provides general estimates for healthy senior cats. Cats with medical conditions may have different nutritional needs. Always consult a veterinarian for tailored feeding plans.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // JSX Inputs
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
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
      </div>

      {/* Weight Input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="0.1"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => handleInputChange("weight", e.target.value)}
          aria-describedby="weight-desc"
        />
        <p
          id="weight-desc"
          className="text-xs text-slate-500 dark:text-slate-400"
        >
          Typical adult cat weights range from 5 to 15 lbs (2.3 to 6.8 kg).
        </p>
      </div>

      {/* Activity Level Select */}
      <div className="space-y-1">
        <Label
          htmlFor="activity"
          className="text-slate-700 dark:text-slate-300"
        >
          Activity Level
        </Label>
        <Select
          value={inputs.activity}
          onValueChange={(val) => handleInputChange("activity", val)}
        >
          <SelectTrigger id="activity" className="w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low (mostly resting)</SelectItem>
            <SelectItem value="moderate">Moderate (some play/activity)</SelectItem>
            <SelectItem value="high">High (very active)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", activity: "moderate" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only.
              Consult a vet for diagnosis.
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
          Understanding Senior Cat Nutrition & Calorie Adjuster
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Senior cats experience physiological changes that affect their
          nutritional needs. As metabolism slows and activity decreases, their
          calorie requirements typically decline. Properly adjusting their diet
          helps maintain optimal body condition, supports organ function, and
          prevents obesity-related complications common in older cats.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the daily calorie needs of senior cats by
          calculating their Resting Energy Requirement (RER) based on weight,
          then adjusting for activity level to determine the Maintenance Energy
          Requirement (MER). The activity factor reflects the cat’s lifestyle,
          ranging from low to high activity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this tool can guide feeding plans tailored to your cat’s unique
          needs, promoting longevity and quality of life. However, individual
          health conditions and metabolic differences mean veterinary advice is
          essential for precise nutrition management.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate your senior cat’s daily calorie needs, enter their current
          weight and select their typical activity level. The calculator will
          compute the Resting Energy Requirement (RER) and adjust it based on
          activity to provide the Maintenance Energy Requirement (MER).
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric)
            that matches how you measure your cat’s weight.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s weight accurately.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the activity level that best
            describes your cat’s daily behavior.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the estimated
            daily calorie requirement.
          </li>
          <li>
            <strong>Step 5:</strong> Use this estimate as a guideline and
            consult your veterinarian for personalized feeding recommendations.
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
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-cats/energy-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Energy Requirements of Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on calculating energy needs and feeding
              strategies for cats, including senior life stages.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.wsava.org/wp-content/uploads/2020/02/WSAVA-Nutrition-Guidelines-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. WSAVA Global Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              International standards for pet nutrition, emphasizing life stage
              and health condition adjustments.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149730/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Institutes of Health: Aging and Nutrition in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Research article discussing metabolic changes and nutritional
              needs in aging feline populations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Senior Cat Nutrition & Calorie Adjuster"
      description="Adjust feeding plans and calorie targets for older cats, accounting for changes in metabolism and activity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `\\[
\\text{RER} = 70 \\times (\\text{weight}_{kg})^{0.75} \\\\
\\text{MER} = \\text{RER} \\times \\text{Activity Factor}
\\]`,
        variables: [
          {
            symbol: "weight_{kg}",
            description: "Cat's body weight in kilograms",
          },
          {
            symbol: "RER",
            description:
              "Resting Energy Requirement - energy needed at rest (kcal/day)",
          },
          {
            symbol: "MER",
            description:
              "Maintenance Energy Requirement - adjusted daily calorie needs (kcal/day)",
          },
          {
            symbol: "Activity Factor",
            description:
              "Adjustment multiplier based on activity level (e.g., 1.0 low, 1.2 moderate, 1.4 high)",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An 8-year-old senior cat weighs 10 lbs (4.54 kg) and has a moderate activity level.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (10 lbs = 4.54 kg). Calculate RER: 70 × 4.54^0.75 ≈ 197 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Apply activity factor for moderate activity (1.2): MER = 197 × 1.2 = 236 kcal/day.",
          },
          {
            label: "3",
            explanation:
              "Result: The cat requires approximately 236 kcal per day to maintain weight and health.",
          },
        ],
        result: "Daily Calorie Requirement: 236 kcal",
      }}
      relatedCalculators={[
        {
          title: "Cat Weight Loss Planner",
          url: "/pets/cat-weight-loss-planner",
          icon: "🐱",
        },
        {
          title: "Oxygen Solubility vs. Temperature Table",
          url: "/pets/oxygen-solubility-vs-temperature-table",
          icon: "🐶",
        },
        {
          title: "Dog Step-Goal & Activity Time Planner",
          url: "/pets/dog-step-goal-activity-time-planner",
          icon: "🐶",
        },
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Whelping Countdown & Stage Timeline",
          url: "/pets/dog-whelping-countdown-stage-timeline",
          icon: "💉",
        },
        {
          title: "Heavy Metal (Lead/Zinc) Exposure Risk",
          url: "/pets/bird-heavy-metal-exposure-risk",
          icon: "💧",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Senior Cat Nutrition & Calorie Adjuster",
        },
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
