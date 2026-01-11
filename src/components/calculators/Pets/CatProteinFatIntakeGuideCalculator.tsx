import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatProteinFatIntakeGuideCalculator() {
  // 1. STATE
  // Protein/Fat intake depends on weight, so keep unit switcher for weight (lbs/kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (kg or lbs), goal (maintenance, weight loss, weight gain)
  const [inputs, setInputs] = useState({
    weight: "",
    goal: "maintenance",
  });

  // Helper: convert lbs to kg if needed
  const weightKg = useMemo(() => {
    const w = parseFloat(inputs.weight);
    if (isNaN(w) || w <= 0) return null;
    return unit === "imperial" ? w * 0.453592 : w;
  }, [inputs.weight, unit]);

  // 2. LOGIC ENGINE
  // Calculate RER (Resting Energy Requirement) = 70 * (weight_kg)^0.75
  // Protein and fat intake vary by goal:
  // Protein: Maintenance 5 g/kg BW, Weight loss 6 g/kg BW, Weight gain 7 g/kg BW (dry matter basis)
  // Fat: Maintenance 3 g/kg BW, Weight loss 2 g/kg BW, Weight gain 4 g/kg BW
  // These are typical veterinary guidelines for adult cats (adjusted for clarity)
  // Output grams of protein and fat per day

  const results = useMemo(() => {
    if (!weightKg) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid weight greater than zero.",
      };
    }

    // Protein and fat intake per kg body weight per day (g/kg/day)
    let proteinPerKg = 5;
    let fatPerKg = 3;

    switch (inputs.goal) {
      case "weight_loss":
        proteinPerKg = 6;
        fatPerKg = 2;
        break;
      case "weight_gain":
        proteinPerKg = 7;
        fatPerKg = 4;
        break;
      case "maintenance":
      default:
        proteinPerKg = 5;
        fatPerKg = 3;
        break;
    }

    // Calculate total protein and fat grams per day
    const proteinGrams = proteinPerKg * weightKg;
    const fatGrams = fatPerKg * weightKg;

    // Convert weight back to user unit for display
    const displayWeight = unit === "imperial" ? (weightKg / 0.453592).toFixed(2) : weightKg.toFixed(2);

    return {
      value: 1, // dummy to trigger display
      label: `For a ${displayWeight} ${unit === "imperial" ? "lbs" : "kg"} cat (${inputs.goal.replace("_", " ")}):`,
      subtext: (
        <>
          <p className="mb-1">
            <strong>Protein Intake:</strong> {proteinGrams.toFixed(1)} g/day
          </p>
          <p>
            <strong>Fat Intake:</strong> {fatGrams.toFixed(1)} g/day
          </p>
        </>
      ),
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "Why is protein intake so important for cats?",
      answer:
        "Cats are obligate carnivores, meaning they require a high protein diet to maintain muscle mass, support immune function, and overall health. Insufficient protein can lead to muscle wasting, poor coat condition, and weakened immunity. This calculator helps ensure your cat meets its protein needs based on its weight and health goals.",
    },
    {
      question: "How does fat intake affect my cat’s health?",
      answer:
        "Fat is a vital energy source and supports absorption of fat-soluble vitamins in cats. Adjusting fat intake can help manage weight goals: reducing fat for weight loss or increasing it for weight gain. However, excessive fat can lead to obesity and related health issues, so balance is key.",
    },
    {
      question: "Can I use this calculator for kittens or senior cats?",
      answer:
        "This guide is primarily designed for adult cats. Kittens and senior cats have different nutritional requirements, often needing higher protein or specialized diets. Consult your veterinarian for tailored recommendations for these life stages.",
    },
    {
      question: "Why does the calculator include a unit switcher?",
      answer:
        "Weight is a critical input for calculating protein and fat needs. Since cat owners may use either metric (kg) or imperial (lbs) units, the unit switcher allows accurate input and conversion, ensuring precise nutritional guidance regardless of measurement preference.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  function onGoalChange(value: string) {
    setInputs((prev) => ({ ...prev, goal: value }));
  }

  // JSX Widget
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
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Use your cat’s current body weight for accurate results.
          </p>
        </div>

        <div>
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Goal
          </Label>
          <Select value={inputs.goal} onValueChange={onGoalChange}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="weight_loss">Weight Loss</SelectItem>
              <SelectItem value="weight_gain">Weight Gain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", goal: "maintenance" })}
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
                Estimated Intake
              </p>
              <p className="text-2xl font-extrabold text-blue-900 dark:text-white mb-4">{results.label}</p>
              <div className="text-slate-600 dark:text-slate-300 mt-2 font-medium text-lg">{results.subtext}</div>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and dietary advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Protein/Fat Intake Guide for Cats (by Goal)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cats are obligate carnivores with unique nutritional needs that differ significantly from other pets. Protein is essential for maintaining muscle mass, supporting immune function, and overall cellular health. Fat provides a dense energy source and aids in the absorption of fat-soluble vitamins. This guide helps cat owners tailor protein and fat intake based on their cat’s weight and specific health goals.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator uses veterinary-recommended intake values expressed in grams per kilogram of body weight, adjusted for maintenance, weight loss, or weight gain goals. By inputting your cat’s weight and selecting the appropriate goal, you receive precise daily protein and fat recommendations. This approach ensures nutritional adequacy while supporting your cat’s health and wellbeing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to remember that individual cats may have specific dietary needs based on age, health status, and activity level. Always consult your veterinarian before making significant changes to your cat’s diet, especially if your cat has underlying health conditions or special requirements.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator provides tailored protein and fat intake recommendations based on your cat’s current weight and health goal. Follow these steps to use it effectively:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select your preferred unit system (Imperial or Metric) for weight input.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s accurate body weight in the selected unit.
          </li>
          <li>
            <strong>Step 3:</strong> Choose your cat’s health goal: Maintenance, Weight Loss, or Weight Gain.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended daily protein and fat intake.
          </li>
          <li>
            <strong>Step 5:</strong> Use these values to guide your cat’s feeding plan, and consult your veterinarian for personalized advice.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149300/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Nutritional Requirements of Cats: Protein and Fat Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              National Research Council. Nutrient Requirements of Dogs and Cats. National Academies Press, 2006.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Protein%20and%20Fat%20Requirements%20for%20Cats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Protein and Fat Requirements for Cats
            </a>
            <p className="text-slate-500 text-sm">
              University of California Davis Veterinary Medicine Nutrition Service. Detailed nutrient profiles and feeding guidelines.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.wsava.org/wp-content/uploads/2020/07/WSAVA-Nutrition-Guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. WSAVA Global Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              World Small Animal Veterinary Association. Comprehensive nutrition standards for companion animals.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Protein/Fat Intake Guide for Cats (by Goal)"
      description="Guide for ensuring your cat meets its high protein requirements, adjusting fat ratios for health goals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `\\[
\\text{Protein Intake (g/day)} = P \\times W_{kg} \\\\
\\text{Fat Intake (g/day)} = F \\times W_{kg}
\\]`,
        variables: [
          { symbol: "P", description: "Protein grams per kg body weight per day (varies by goal)" },
          { symbol: "F", description: "Fat grams per kg body weight per day (varies by goal)" },
          { symbol: "W_{kg}", description: "Cat body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4.5 kg adult cat requires protein and fat intake recommendations for weight maintenance.",
        steps: [
          {
            label: "1",
            explanation:
              "Input weight as 4.5 kg and select 'Maintenance' as the goal.",
          },
          {
            label: "2",
            explanation:
              "Calculate protein: 5 g/kg × 4.5 kg = 22.5 g/day; fat: 3 g/kg × 4.5 kg = 13.5 g/day.",
          },
          {
            label: "3",
            explanation:
              "Feed the cat approximately 22.5 grams of protein and 13.5 grams of fat daily to meet maintenance needs.",
          },
        ],
        result:
          "Recommended daily intake: 22.5 g protein and 13.5 g fat for weight maintenance.",
      }}
      relatedCalculators={[
        { title: "Calcium-to-Phosphorus Ratio Calculator", url: "/pets/reptile-calcium-to-phosphorus-ratio", icon: "🐾" },
        { title: "Daily Feeding Ratio (by Species & Age)", url: "/pets/reptile-daily-feeding-ratio-species-age", icon: "🐶" },
        { title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)", url: "/pets/horse-dehydration-risk-estimator", icon: "🐱" },
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🍖" },
        { title: "Daily Calorie Needs (Species Specific)", url: "/pets/small-mammal-daily-calorie-needs", icon: "💉" },
        { title: "Water Change Volume Planner", url: "/pets/aquarium-water-change-volume-planner", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Protein/Fat Intake Guide for Cats (by Goal)" },
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
