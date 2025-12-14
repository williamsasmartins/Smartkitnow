import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatCalorieNeedsRerMerCalculator() {
  // 1. STATE
  // Weight is involved, so keep unit switcher
  const [unit, setUnit] = useState("metric");

  // Inputs: weight only (kg or lbs)
  const [inputs, setInputs] = useState<{ weight?: string }>({ weight: "" });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = inputs.weight?.trim();
    if (!weightRaw) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Parse weight input
    const weightNum = Number(weightRaw);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive number for weight.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum * 0.45359237 : weightNum;

    // RER formula: RER = 70 * (weight in kg)^0.75
    const rer = 70 * Math.pow(weightKg, 0.75);

    // MER depends on activity/lifestyle, typical multipliers for cats:
    // Neutered adult indoor cat: 1.2 * RER
    // Intact adult cat: 1.4 * RER
    // Active/Outdoor cat: 1.6 * RER
    // Growth, pregnancy, lactation require higher multipliers but not included here for simplicity

    // For this calculator, show all three common MER values for user info

    // Round to nearest whole number kcal
    const rerRounded = Math.round(rer);
    const merNeutered = Math.round(rer * 1.2);
    const merIntact = Math.round(rer * 1.4);
    const merActive = Math.round(rer * 1.6);

    return {
      value: rerRounded,
      label: "Resting Energy Requirement (RER) kcal/day",
      subtext: `Maintenance Energy Requirement (MER) estimates:
- Neutered adult indoor cat: ${merNeutered} kcal/day
- Intact adult cat: ${merIntact} kcal/day
- Active/outdoor cat: ${merActive} kcal/day`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "What is the difference between RER and MER in cats?",
      answer:
        "Resting Energy Requirement (RER) is the amount of energy a cat needs at rest to maintain vital body functions. Maintenance Energy Requirement (MER) accounts for additional energy needs based on activity, lifestyle, and physiological states. MER is calculated by multiplying RER by factors reflecting neuter status, activity level, or growth.",
    },
    {
      question: "Why is weight important for calculating a cat's calorie needs?",
      answer:
        "Weight is the primary factor in determining a cat's energy requirements because metabolic rate scales with body mass. Using the cat's weight allows the calculator to estimate the energy needed for maintenance and activity accurately, ensuring proper nutrition and health management.",
    },
    {
      question: "Can I use this calculator for kittens or pregnant cats?",
      answer:
        "This calculator is designed for adult cats and does not specifically account for the increased energy needs of kittens, pregnant, or lactating cats. For those life stages, consult a veterinarian for tailored feeding recommendations as energy requirements can be significantly higher.",
    },
    {
      question: "How accurate are the MER multipliers for different cat lifestyles?",
      answer:
        "MER multipliers are general guidelines based on veterinary research and clinical experience. Individual cats may vary due to metabolism, health, and environment. Regular monitoring of body condition and consultation with a veterinarian are recommended to adjust feeding accordingly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs({ weight: e.target.value });
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

      {/* INPUT */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight ?? ""}
          onChange={onInputChange}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-sm text-slate-500 dark:text-slate-400">
          Use your cat's current body weight for accurate calorie needs.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger re-render, no extra action needed
            setInputs((i) => ({ ...i }));
          }}
          aria-label="Calculate cat calorie needs"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center whitespace-pre-line">
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and feeding plans.
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
          Understanding Cat Calorie Needs (RER/MER) Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Cat Calorie Needs Calculator estimates the Resting Energy Requirement (RER) and Maintenance Energy Requirement (MER) for your feline companion. RER represents the baseline calories needed for vital bodily functions at rest, while MER adjusts this value based on activity level, neuter status, and lifestyle. Understanding these values helps ensure your cat receives appropriate nutrition to maintain optimal health.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This tool uses your cat's weight as the primary input, applying scientifically validated formulas to calculate energy needs. By providing estimates for different activity levels, it supports informed feeding decisions tailored to your cat's unique lifestyle and physiological state. Proper calorie intake is essential for preventing obesity, malnutrition, and related health issues.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Regularly monitoring your cat's weight and adjusting calorie intake accordingly is crucial, as energy requirements can fluctuate with age, health status, and activity. This calculator serves as a reliable starting point for managing your cat's dietary needs, but always consult your veterinarian for personalized advice and adjustments.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately estimate your cat's calorie needs, follow these simple steps. First, select the unit system that matches how you measure your cat's weight—either metric (kilograms) or imperial (pounds). Then, enter your cat's current body weight in the input field. Finally, click the Calculate button to view the estimated Resting Energy Requirement and Maintenance Energy Requirement values.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the unit system (metric or imperial) that corresponds to your cat's weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat's accurate current weight in the input box.
          </li>
          <li>
            <strong>Step 3:</strong> Click "Calculate" to see the RER and MER estimates tailored to different activity levels.
          </li>
          <li>
            <strong>Step 4:</strong> Use these values as a guide to adjust your cat's daily food intake, and consult your veterinarian for personalized recommendations.
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
              href="https://www.merckvetmanual.com/nutrition/energy-requirements-of-animals/energy-requirements-of-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Energy Requirements of Cats
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of feline energy needs, including RER and MER calculations and factors influencing calorie requirements.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.wsava.org/wp-content/uploads/2020/03/WSAVA-Nutrition-Guidelines-2019.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. WSAVA Global Nutrition Guidelines (2019)
            </a>
            <p className="text-slate-500 text-sm">
              International guidelines for companion animal nutrition, including energy requirement formulas and feeding recommendations for cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149605/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information: Feline Energy Requirements
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed research article discussing metabolic energy requirements and factors affecting feline calorie needs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cat Calorie Needs (RER/MER) Calculator"
      description="Calculate your cat's **Resting Energy Requirement (RER)** and **Maintenance Energy Requirement (MER)** for daily feeding."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: `\\[
\\text{RER} = 70 \\times (\\text{Body Weight in kg})^{0.75}
\\]

\\[
\\text{MER} = \\text{RER} \\times \\text{Activity Factor}
\\]

Where activity factors commonly are:
- Neutered adult indoor cat: 1.2
- Intact adult cat: 1.4
- Active/outdoor cat: 1.6`,
        variables: [
          { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
          { symbol: "MER", description: "Maintenance Energy Requirement (kcal/day)" },
          { symbol: "Body Weight in kg", description: "Cat's body weight in kilograms" },
          { symbol: "Activity Factor", description: "Multiplier based on lifestyle and physiological state" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A neutered indoor cat weighs 4.5 kg. Calculate the RER and MER for this cat to determine daily calorie needs.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate RER: 70 × (4.5)^0.75 ≈ 70 × 2.83 = 198 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Calculate MER for neutered indoor cat: 198 × 1.2 = 238 kcal/day.",
          },
        ],
        result:
          "The cat requires approximately 198 kcal/day at rest and about 238 kcal/day to maintain its weight considering its lifestyle.",
      }}
      relatedCalculators={[
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🐾" },
        { title: "Dog Macadamia Nut Toxicity Calculator", url: "/pets/dog-macadamia-nut-toxicity", icon: "🐶" },
        { title: "Cat Weight Loss Planner", url: "/pets/cat-weight-loss-planner", icon: "🐱" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "🍖" },
        { title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator", url: "/pets/dog-onion-garlic-exposure-risk", icon: "🐶" },
        { title: "Fluid Intake vs. Urine Output Balance Checker", url: "/pets/cat-fluid-intake-urine-output-balance", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cat Calorie Needs (RER/MER) Calculator" },
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