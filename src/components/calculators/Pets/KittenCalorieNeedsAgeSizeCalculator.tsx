import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function KittenCalorieNeedsAgeSizeCalculator() {
  // 1. STATE
  // This calculator requires weight input, so unit switcher is kept.
  const [unit, setUnit] = useState("metric"); // default metric for veterinary use

  // Inputs: weight (kg or lbs), age (weeks)
  const [inputs, setInputs] = useState({
    weight: "",
    age: "",
  });

  // 2. LOGIC ENGINE
  // Veterinary formula for Resting Energy Requirement (RER):
  // RER = 70 * (Body Weight in kg)^0.75 kcal/day
  // Growing kittens need about 2-3x RER depending on age.
  // Approximate multipliers by age:
  // 0-8 weeks: 3.0x RER
  // 9-16 weeks: 2.5x RER
  // 17-52 weeks: 2.0x RER
  // >52 weeks: 1.4x RER (adult maintenance, out of scope here)

  // Convert lbs to kg if needed: 1 lb = 0.453592 kg

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ageRaw = parseInt(inputs.age);

    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(ageRaw) ||
      ageRaw < 0 ||
      ageRaw > 52
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          ageRaw > 52
            ? "This calculator is intended for kittens up to 52 weeks old."
            : null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw * 0.453592 : weightRaw;

    // Calculate RER
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Determine multiplier by age
    let multiplier = 2.0;
    if (ageRaw <= 8) multiplier = 3.0;
    else if (ageRaw <= 16) multiplier = 2.5;
    else if (ageRaw <= 52) multiplier = 2.0;

    const calories = rer * multiplier;

    // Convert calories to integer kcal/day
    const caloriesRounded = Math.round(calories);

    return {
      value: caloriesRounded,
      label: "Daily Calorie Needs (kcal/day)",
      subtext: `Based on weight ${weightRaw} ${
        unit === "imperial" ? "lbs" : "kg"
      } and age ${ageRaw} weeks`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "Why do kittens require more calories than adult cats?",
      answer:
        "Kittens are in a rapid growth phase requiring significantly more energy to support development of muscles, bones, and organs. Their metabolism is higher, and they need extra calories to fuel this growth, immune system development, and increased activity levels compared to adult cats.",
    },
    {
      question: "How does age affect a kitten's calorie needs?",
      answer:
        "Calorie needs decrease as kittens grow older. Neonatal kittens (0-8 weeks) require about three times their resting energy requirement, while older kittens (9-16 weeks) need about 2.5 times, and adolescents (17-52 weeks) about twice their resting energy requirement. After one year, calorie needs stabilize closer to adult maintenance levels.",
    },
    {
      question: "Can I use this calculator for overweight or underweight kittens?",
      answer:
        "This calculator estimates calorie needs based on current weight and age, assuming a healthy growth trajectory. For overweight or underweight kittens, consult a veterinarian for tailored feeding plans, as calorie needs may differ significantly to promote healthy weight gain or loss safely.",
    },
    {
      question: "Why is weight input necessary for this calculator?",
      answer:
        "Weight is essential to calculate the resting energy requirement (RER), which is the foundation for determining daily calorie needs. Since energy expenditure scales with metabolic body size, accurate weight measurement ensures precise calorie estimations for optimal kitten growth and health.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. JSX WIDGET

  const onInputChange =
    (field: "weight" | "age") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Allow only numbers and decimal for weight, only numbers for age
      if (field === "weight") {
        if (/^\d*\.?\d*$/.test(val)) {
          setInputs((prev) => ({ ...prev, weight: val }));
        }
      } else {
        if (/^\d*$/.test(val)) {
          setInputs((prev) => ({ ...prev, age: val }));
        }
      }
    };

  const onReset = () => {
    setInputs({ weight: "", age: "" });
  };

  const onCalculate = () => {
    // Calculation is automatic via useMemo, no action needed here.
  };

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
            aria-label="Select unit system"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="text"
            inputMode="decimal"
            pattern="^\d*\.?\d*$"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange("weight")}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Use current measured weight of your kitten.
          </p>
        </div>

        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (weeks)
          </Label>
          <Input
            id="age"
            type="text"
            inputMode="numeric"
            pattern="^\d*$"
            placeholder="Enter age in weeks (0-52)"
            value={inputs.age}
            onChange={onInputChange("age")}
            aria-describedby="age-desc"
          />
          <p id="age-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Age of kitten in weeks (0 to 52 weeks).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={onCalculate}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate calorie needs"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized feeding plans.
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
          Understanding Kitten Calorie Needs by Age/Size
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Kittens have unique nutritional requirements that differ significantly from adult cats. Their rapid growth and development demand a higher caloric intake to support the formation of muscles, bones, and vital organs. Energy needs are calculated based on their current weight and age, reflecting their metabolic rate and growth stage.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Resting Energy Requirement (RER) is the baseline energy expenditure for a kitten at rest, calculated using their body weight raised to the 0.75 power. Growing kittens require multiples of this RER to meet their increased energy demands. Younger kittens need more calories per kilogram of body weight compared to older kittens as their growth rate slows.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these calorie needs helps pet owners provide appropriate feeding amounts to promote healthy growth without overfeeding, which can lead to obesity or nutritional imbalances. This calculator uses established veterinary formulas to estimate daily calorie requirements based on weight and age, ensuring a science-backed approach to kitten nutrition.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool estimates the daily calorie needs of your kitten based on its current weight and age in weeks. Accurate inputs will yield the most reliable results to guide feeding decisions.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system that matches your measurement (Imperial for pounds or Metric for kilograms).
          </li>
          <li>
            <strong>Step 2:</strong> Enter your kitten’s current weight in the chosen unit.
          </li>
          <li>
            <strong>Step 3:</strong> Enter your kitten’s age in weeks (0 to 52 weeks).
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the estimated daily calorie needs.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to guide feeding amounts, and consult your veterinarian for personalized advice.
          </li>
        </ul>
      </section>

      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li key={i} className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0">
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">{item.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-the-growing-animal/nutrition-of-kittens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Nutrition of Kittens
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of nutritional requirements and energy needs for growing kittens.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.wsava.org/wp-content/uploads/2020/01/WSAVA-Nutrition-Guidelines-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. WSAVA Global Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              International standards for pet nutrition including energy requirements for kittens.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149605/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information: Energy Requirements of Growing Cats
            </a>
            <p className="text-slate-500 text-sm">
              Scientific study detailing metabolic energy needs during feline growth phases.
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
      "RER = 70 × (Body Weight in kg)^0.75 kcal/day\n" +
      "Daily Calorie Needs = RER × Growth Multiplier\n\n" +
      "Growth Multipliers by Age:\n" +
      "0-8 weeks: 3.0 × RER\n" +
      "9-16 weeks: 2.5 × RER\n" +
      "17-52 weeks: 2.0 × RER",
    variables: [
      { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
      { symbol: "Body Weight", description: "Current weight of kitten in kilograms" },
      { symbol: "Growth Multiplier", description: "Factor based on kitten age to account for growth energy needs" },
    ],
  };

  const example = {
    title: "Case Study",
    scenario:
      "A 10-week-old kitten weighs 2.5 kg. Calculate the estimated daily calorie needs.",
    steps: [
      {
        label: "1",
        explanation:
          "Calculate RER: 70 × (2.5)^0.75 = 70 × 1.68 = 117.6 kcal/day",
      },
      {
        label: "2",
        explanation:
          "Determine multiplier for 10 weeks: 2.5 × RER = 2.5 × 117.6 = 294 kcal/day",
      },
    ],
    result: "Estimated daily calorie needs = 294 kcal/day",
  };

  return (
    <CalculatorVerticalLayout
      title="Kitten Calorie Needs by Age/Size"
      description="Calculate the high energy requirements for growing kittens based on their age and projected adult size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        {
          title: "Foaling Countdown & Lactation Feed Planner",
          url: "/pets/horse-foaling-countdown-lactation-feed-planner",
          icon: "🐾",
        },
        {
          title: "Horse Body Condition Score Helper (Henneke 1–9)",
          url: "/pets/horse-body-condition-score-henneke",
          icon: "🐎",
        },
        {
          title: "Koi Feed Planner (Temp + Weight)",
          url: "/pets/koi-feed-planner-temp-weight",
          icon: "🐱",
        },
        {
          title: "Basking Temperature & Gradient Planner",
          url: "/pets/reptile-basking-temperature-gradient-planner",
          icon: "🍖",
        },
        {
          title: "Electrolyte Powder Mixing Calculator",
          url: "/pets/horse-electrolyte-powder-mixing",
          icon: "💉",
        },
        {
          title: "UVB Lighting Distance & Duration Calculator",
          url: "/pets/reptile-uvb-lighting-distance-duration",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Kitten Calorie Needs by Age/Size" },
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