import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatWeightLossPlannerCalculator() {
  // 1. STATE
  // Weight is involved in calculations, so keep unit switcher
  const [unit, setUnit] = useState("imperial");

  // Inputs: Current Weight, Target Weight, Weight Loss Rate (% per week)
  // Weight loss rate is a percentage, no unit needed
  const [inputs, setInputs] = useState({
    currentWeight: "",
    targetWeight: "",
    weeklyLossPercent: "1", // default safe weight loss rate 1% per week
  });

  // Helper: convert weight to kg if imperial
  function toKg(weight: number) {
    return unit === "imperial" ? weight / 2.20462 : weight;
  }
  // Helper: convert kg to display unit
  function fromKg(weightKg: number) {
    return unit === "imperial" ? weightKg * 2.20462 : weightKg;
  }

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const cw = parseFloat(inputs.currentWeight);
    const tw = parseFloat(inputs.targetWeight);
    const wlp = parseFloat(inputs.weeklyLossPercent);

    if (
      isNaN(cw) ||
      isNaN(tw) ||
      isNaN(wlp) ||
      cw <= 0 ||
      tw <= 0 ||
      wlp <= 0 ||
      tw >= cw
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          tw >= cw
            ? "Target weight must be less than current weight."
            : "Please enter valid positive numbers for all fields.",
      };
    }

    // Convert weights to kg for calculation
    const currentWeightKg = toKg(cw);
    const targetWeightKg = toKg(tw);

    // Calculate total weight to lose (kg)
    const weightToLoseKg = currentWeightKg - targetWeightKg;

    // Weekly weight loss in kg (percentage of current weight)
    const weeklyLossKg = (wlp / 100) * currentWeightKg;

    // Calculate duration in weeks (round up)
    const durationWeeks = Math.ceil(weightToLoseKg / weeklyLossKg);

    // Calculate Resting Energy Requirement (RER) for target weight
    // RER = 70 * (weight in kg)^0.75
    const RER = 70 * Math.pow(targetWeightKg, 0.75);

    // Weight loss feeding calories = 80% of RER (typical veterinary recommendation)
    const targetCalories = Math.round(RER * 0.8);

    // Format results for display
    const durationText = durationWeeks === 1 ? "week" : "weeks";
    const weightToLoseDisplay = fromKg(weightToLoseKg).toFixed(2);
    const currentWeightDisplay = fromKg(currentWeightKg).toFixed(2);
    const targetWeightDisplay = fromKg(targetWeightKg).toFixed(2);

    return {
      value: `${targetCalories} kcal/day`,
      label: "Recommended Daily Calories",
      subtext: `To reduce from ${currentWeightDisplay} ${unit === "imperial" ? "lbs" : "kg"} to ${targetWeightDisplay} ${unit === "imperial" ? "lbs" : "kg"} over approximately ${durationWeeks} ${durationText}, feeding about ${wlp}% of current weight loss per week.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "What is the safest rate of weight loss for cats?",
      answer:
        "A safe and effective weight loss rate for cats is typically around 1% of their current body weight per week. Losing weight too quickly can cause serious health issues such as hepatic lipidosis. Always consult your veterinarian before starting a weight loss program to ensure it is tailored to your cat's specific needs.",
    },
    {
      question: "How is the recommended daily calorie intake calculated?",
      answer:
        "The recommended daily calorie intake during weight loss is calculated as 80% of the cat's Resting Energy Requirement (RER), which is based on their target weight. RER is determined by the formula 70 × (weight in kg)^0.75. This reduction helps promote gradual fat loss while maintaining muscle mass and overall health.",
    },
    {
      question: "Can I use this planner for overweight kittens or only adult cats?",
      answer:
        "This planner is designed primarily for adult cats. Kittens have different nutritional requirements due to their growth needs and should not be put on weight loss diets without veterinary supervision. Always consult a veterinarian before applying any weight loss plan to kittens or young cats.",
    },
    {
      question: "What should I do if my cat is not losing weight as expected?",
      answer:
        "If your cat is not losing weight as expected, first ensure you are accurately measuring food portions and not giving extra treats. If weight loss remains stagnant, consult your veterinarian to rule out underlying medical conditions and to adjust the weight loss plan safely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
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
      </div>

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            name="currentWeight"
            type="text"
            inputMode="decimal"
            value={inputs.currentWeight}
            onChange={onInputChange}
            placeholder={`e.g. ${unit === "imperial" ? "10.5" : "4.8"}`}
          />
        </div>
        <div>
          <Label htmlFor="targetWeight" className="text-slate-700 dark:text-slate-300">
            Target Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="targetWeight"
            name="targetWeight"
            type="text"
            inputMode="decimal"
            value={inputs.targetWeight}
            onChange={onInputChange}
            placeholder={`e.g. ${unit === "imperial" ? "8.5" : "3.9"}`}
          />
        </div>
        <div>
          <Label htmlFor="weeklyLossPercent" className="text-slate-700 dark:text-slate-300">
            Weekly Weight Loss Rate (% of current weight)
          </Label>
          <Input
            id="weeklyLossPercent"
            name="weeklyLossPercent"
            type="text"
            inputMode="decimal"
            value={inputs.weeklyLossPercent}
            onChange={onInputChange}
            placeholder="e.g. 1"
          />
        </div>
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
          onClick={() =>
            setInputs({
              currentWeight: "",
              targetWeight: "",
              weeklyLossPercent: "1",
            })
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
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
          Understanding Cat Weight Loss Planner
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Managing your cat’s weight is crucial for their overall health and longevity. Overweight cats are at increased risk for diabetes, arthritis, and heart disease. This planner helps you create a safe, effective weight loss program by calculating the ideal daily calorie intake based on your cat’s current and target weights, as well as a recommended weekly weight loss rate.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculation uses Resting Energy Requirement (RER), a veterinary standard that estimates the calories needed for basic bodily functions at rest. By feeding approximately 80% of the RER based on your cat’s target weight, you encourage gradual fat loss while preserving lean muscle mass. This approach minimizes health risks associated with rapid weight loss.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Weight loss should be slow and steady, typically around 1% of body weight per week. This planner factors in your chosen weekly weight loss percentage to estimate the duration of the program, helping you set realistic expectations and monitor progress effectively.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this planner, input your cat’s current weight and your desired target weight. Select the unit system that matches your preference or measurement tools. Enter the weekly weight loss rate as a percentage, with 1% being the recommended safe default. Then, click “Calculate” to see the recommended daily calorie intake and estimated duration for the weight loss program.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure your cat’s current weight accurately using a reliable scale.
          </li>
          <li>
            <strong>Step 2:</strong> Determine a healthy target weight in consultation with your veterinarian.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the weekly weight loss rate, typically 1%, to ensure safe progress.
          </li>
          <li>
            <strong>Step 4:</strong> Review the recommended daily calorie intake and estimated program duration.
          </li>
          <li>
            <strong>Step 5:</strong> Monitor your cat’s weight regularly and adjust the plan as needed with veterinary guidance.
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
              href="https://www.wsava.org/wp-content/uploads/2020/01/WSAVA-Nutrition-Guidelines-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. WSAVA Global Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              World Small Animal Veterinary Association guidelines on nutrition and weight management in cats and dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4808651/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Veterinary Weight Management in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing safe weight loss rates and calorie restriction strategies for feline obesity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/obesity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center: Obesity in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on feline obesity, health risks, and weight loss recommendations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Weight Loss Planner"
      description="Plan a tailored weight loss program for your cat, calculating target calories, weight reduction, and duration."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula:
          "RER = 70 × (Target Weight in kg)^0.75\n" +
          "Daily Calories = 0.8 × RER\n" +
          "Duration (weeks) = (Current Weight - Target Weight) ÷ (Weekly Loss % × Current Weight)",
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "Weight", description: "Weight in kilograms (kg)" },
          { symbol: "Weekly Loss %", description: "Weekly weight loss rate as a decimal fraction" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 12 lb (5.44 kg) cat currently overweight wants to reach a healthy weight of 9 lb (4.08 kg). The owner chooses a safe weekly weight loss rate of 1%.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weights to kg: Current = 5.44 kg, Target = 4.08 kg. Calculate RER: 70 × 4.08^0.75 ≈ 190 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Calculate daily calories for weight loss: 0.8 × 190 = 152 kcal/day recommended.",
          },
          {
            label: "3",
            explanation:
              "Calculate duration: Weight to lose = 5.44 - 4.08 = 1.36 kg. Weekly loss = 1% × 5.44 = 0.0544 kg/week. Duration ≈ 1.36 ÷ 0.0544 ≈ 25 weeks.",
          },
        ],
        result: "Feed approximately 152 kcal/day for about 25 weeks to reach the target weight safely.",
      }}
      relatedCalculators={[
        { title: "Cat Age in Human Years (Breed/Size Aware)", url: "/pets/cat-age-human-years-breed-size-aware", icon: "🐱" },
        { title: "Tramadol Dose Calculator for Dogs", url: "/pets/dog-tramadol-dose", icon: "🐶" },
        { title: "Daily Water Requirement per Weight", url: "/pets/bird-daily-water-requirement-per-weight", icon: "🐱" },
        { title: "Basking Temperature & Gradient Planner", url: "/pets/reptile-basking-temperature-gradient-planner", icon: "🍖" },
        { title: "CO₂ Injection Rate Calculator (Planted Tank)", url: "/pets/aquarium-co2-injection-rate-planted-tank", icon: "💉" },
        { title: "Feather Plucking & Stress Risk Index", url: "/pets/bird-feather-plucking-stress-risk-index", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Weight Loss Planner" },
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