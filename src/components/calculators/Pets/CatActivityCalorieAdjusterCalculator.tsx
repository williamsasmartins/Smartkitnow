import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatActivityCalorieAdjusterCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: Weight (lbs or kg), Activity Level (Indoor/Outdoor)
  const [inputs, setInputs] = useState({
    weight: "",
    activity: "indoor",
  });

  // 2. LOGIC ENGINE
  // Formula:
  // RER = 70 * (weight_kg)^0.75
  // Adjusted Calories = RER * Activity Factor
  // Activity Factor: Indoor = 1.0, Outdoor = 1.2 (20% increase)
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid weight greater than zero.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate RER (Resting Energy Requirement)
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Activity factor based on indoor/outdoor
    const activityFactor = inputs.activity === "outdoor" ? 1.2 : 1.0;

    // Adjusted calorie requirement
    const adjustedCalories = Math.round(rer * activityFactor);

    return {
      value: adjustedCalories,
      label: "Adjusted Daily Calorie Requirement (kcal)",
      subtext:
        inputs.activity === "outdoor"
          ? "Includes 20% increase for outdoor activity."
          : "Standard resting energy requirement for indoor cats.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why does outdoor activity increase a cat's calorie needs?",
      answer:
        "Outdoor cats typically expend more energy due to increased physical activity such as climbing, hunting, and exploring. This elevated activity level raises their metabolic demands, requiring more calories to maintain healthy body weight and function. Adjusting calorie intake ensures they receive adequate nutrition to support their active lifestyle without risking malnutrition.",
    },
    {
      question: "How is the Resting Energy Requirement (RER) calculated for cats?",
      answer:
        "RER is calculated using the formula 70 × (weight in kg)^0.75, which estimates the energy a cat needs at rest for vital bodily functions. This formula accounts for metabolic scaling based on body weight, providing a baseline calorie requirement. It is essential for determining appropriate feeding amounts before adjusting for activity level or other factors.",
    },
    {
      question: "Can indoor cats have the same calorie needs as outdoor cats?",
      answer:
        "Generally, indoor cats have lower calorie requirements because they are less active and expend less energy. Feeding an indoor cat the same calories as an outdoor cat may lead to weight gain and obesity. Therefore, adjusting calorie intake based on activity level helps maintain optimal health and prevents diet-related diseases.",
    },
    {
      question: "How often should I reassess my cat's calorie needs?",
      answer:
        "Calorie needs should be reassessed regularly, especially if your cat's activity level, weight, or health status changes. Seasonal changes or lifestyle adjustments, such as moving from indoor to outdoor access, can significantly impact energy requirements. Regular monitoring ensures your cat maintains a healthy weight and receives balanced nutrition tailored to their current needs.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
        />
      </div>

      {/* Activity Level Select */}
      <div className="space-y-2">
        <Label htmlFor="activity" className="text-slate-700 dark:text-slate-300">
          Activity Level
        </Label>
        <Select
          id="activity"
          value={inputs.activity}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, activity: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="indoor">Indoor Only</SelectItem>
            <SelectItem value="outdoor">Outdoor Access</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger calculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", activity: "indoor" })}
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
          Understanding Indoor/Outdoor Activity Calorie Adjuster
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Indoor/Outdoor Activity Calorie Adjuster is a veterinary tool designed to estimate the daily calorie needs of cats based on their activity levels. Cats that have outdoor access generally expend more energy due to increased physical activity such as hunting, climbing, and exploring their environment. This tool adjusts the resting energy requirement (RER) by applying an activity factor to better reflect these increased energy demands, ensuring cats receive appropriate nutrition.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculation begins with the Resting Energy Requirement, which estimates the calories a cat needs at rest to maintain vital bodily functions. This baseline is then multiplied by an activity factor—1.0 for indoor-only cats and 1.2 for those with outdoor access—to account for the additional calories burned during active behaviors. By tailoring calorie recommendations to lifestyle, this adjuster helps prevent underfeeding or overfeeding, promoting optimal health and weight management.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires only two inputs: your cat’s weight and their activity level. First, select the unit system you prefer—imperial (pounds) or metric (kilograms)—and enter your cat’s current weight accurately. Next, choose whether your cat is strictly indoor or has outdoor access, as this affects their calorie needs.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s weight in the selected unit system. Accurate weight measurement is crucial for precise calorie estimation.
          </li>
          <li>
            <strong>Step 2:</strong> Select the activity level that best describes your cat’s lifestyle—indoor only or outdoor access.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to see the adjusted daily calorie requirement tailored to your cat’s activity.
          </li>
          <li>
            <strong>Step 4:</strong> Use the result as a guideline for feeding, but always consult your veterinarian for personalized advice, especially if your cat has health concerns.
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
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-cats-and-dogs/energy-requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Energy Requirements of Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of feline energy requirements, including resting energy needs and adjustments for activity levels.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell Feline Health Center - Nutrition and Energy Needs
            </a>
            <p className="text-slate-500 text-sm">
              Expert guidance on feline nutrition, emphasizing the importance of adjusting calorie intake based on lifestyle and activity.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/nutrition/nutrition_guidelines_feline.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association - Feline Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on feeding cats, including energy requirements and considerations for indoor versus outdoor lifestyles.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Indoor/Outdoor Activity Calorie Adjuster"
      description="Adjust daily calorie targets based on whether your cat is strictly indoor or has outdoor access."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Adjusted Calories = 70 × (Weight_kg)^0.75 × Activity Factor",
        variables: [
          { symbol: "Weight_kg", description: "Cat's weight in kilograms" },
          { symbol: "Activity Factor", description: "1.0 for indoor cats, 1.2 for outdoor cats" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb indoor cat and a 10 lb outdoor cat require different calorie amounts due to activity differences.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert 10 lbs to kg: 10 ÷ 2.20462 ≈ 4.54 kg. Calculate RER: 70 × 4.54^0.75 ≈ 197 kcal.",
          },
          {
            label: "2",
            explanation:
              "Indoor cat calorie need: 197 × 1.0 = 197 kcal/day. Outdoor cat calorie need: 197 × 1.2 = 236 kcal/day.",
          },
        ],
        result:
          "The outdoor cat requires approximately 20% more calories daily to support its higher activity level.",
      }}
      relatedCalculators={[
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        {
          title: "Dog Pregnancy (Gestation) Due-Date Calculator",
          url: "/pets/dog-pregnancy-gestation-due-date",
          icon: "🐶",
        },
        { title: "Heavy Metal (Lead/Zinc) Exposure Risk", url: "/pets/bird-heavy-metal-exposure-risk", icon: "🍖" },
        { title: "Ideal Weight & Target Calories for Cats", url: "/pets/cat-ideal-weight-target-calories", icon: "🐱" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Indoor/Outdoor Activity Calorie Adjuster" },
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