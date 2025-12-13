import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, CheckCircle2 } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ProteinIntakeByGoalCalculator() {
  // 1. STATE (Imperial Default)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "", // lbs or kg
    goal: "maintain", // cut, bulk, maintain
  });

  // Helper: convert weight to kg if imperial
  const weightKg = useMemo(() => {
    if (!inputs.weight || isNaN(Number(inputs.weight))) return 0;
    const w = Number(inputs.weight);
    return unit === "imperial" ? w * 0.453592 : w;
  }, [inputs.weight, unit]);

  // 2. LOGIC
  // Protein intake recommendations (grams per kg body weight) based on goal:
  // Cutting: 2.0 - 2.5 g/kg to preserve muscle mass during calorie deficit
  // Maintenance: 1.2 - 1.8 g/kg for general health and maintenance
  // Bulking: 1.6 - 2.2 g/kg to support muscle gain with calorie surplus
  // We'll use midpoints for simplicity but show ranges in editorial.

  const proteinIntake = useMemo(() => {
    if (weightKg <= 0) return { value: 0, label: "", category: "" };

    let gramsPerKg = 1.5; // default maintain midpoint
    let category = "";
    switch (inputs.goal) {
      case "cut":
        gramsPerKg = 2.25; // midpoint of 2.0-2.5
        category = "Cutting (Fat Loss)";
        break;
      case "bulk":
        gramsPerKg = 1.9; // midpoint of 1.6-2.2
        category = "Bulking (Muscle Gain)";
        break;
      case "maintain":
      default:
        gramsPerKg = 1.5; // midpoint of 1.2-1.8
        category = "Maintenance";
        break;
    }

    const proteinGrams = weightKg * gramsPerKg;
    // Show result in grams rounded to nearest whole number
    return {
      value: Math.round(proteinGrams),
      label: "Daily Protein Intake (grams)",
      category,
    };
  }, [weightKg, inputs.goal]);

  // 3. FAQS
  const faqs = [
    {
      question: "How does protein intake differ when cutting, bulking, or maintaining?",
      answer:
        "Protein needs vary based on your fitness goal. When cutting (losing fat), higher protein intake (2.0-2.5 g/kg) helps preserve lean muscle mass despite calorie deficits. During bulking (muscle gain), moderate to high protein (1.6-2.2 g/kg) supports muscle synthesis alongside increased calories. Maintenance requires moderate protein (1.2-1.8 g/kg) to sustain muscle and overall health. Adjusting protein intake according to your goal optimizes body composition and recovery.",
    },
    {
      question: "Why is protein intake calculated per kilogram of body weight?",
      answer:
        "Protein requirements are typically based on body weight in kilograms because protein supports muscle repair and growth proportional to lean mass. Using kilograms standardizes calculations globally and aligns with scientific research. If using imperial units, weight is converted to kilograms internally to maintain accuracy and consistency with clinical guidelines.",
    },
    {
      question: "Are there any risks of consuming too much protein?",
      answer:
        "For healthy individuals, consuming protein within recommended ranges is generally safe. Excessive protein intake beyond 3 g/kg body weight may strain kidneys over time, especially in those with pre-existing kidney conditions. It's important to balance protein with other macronutrients and maintain hydration. Always consult a healthcare professional if you have medical concerns or chronic conditions.",
    },
    {
      question: "Can vegetarians or vegans meet these protein targets?",
      answer:
        "Yes, vegetarians and vegans can meet protein needs by consuming a variety of plant-based protein sources such as legumes, tofu, tempeh, seitan, quinoa, nuts, and seeds. Combining different sources ensures all essential amino acids are obtained. Plant proteins may have lower digestibility, so slightly higher intake or supplementation might be necessary to achieve optimal muscle maintenance or growth.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onWeightChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    // Allow only numbers and decimal
    if (/^\d*\.?\d*$/.test(val)) {
      setInputs((prev) => ({ ...prev, weight: val }));
    }
  }
  function onGoalChange(value: string) {
    setInputs((prev) => ({ ...prev, goal: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher & Inputs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (US/Canada)</SelectItem>
              <SelectItem value="metric">Metric (International)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 150" : "e.g. 68"}
            value={inputs.weight}
            onChange={onWeightChange}
            className="mt-1"
          />
        </div>

        {/* Goal Select */}
        <div>
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Your Goal
          </Label>
          <Select value={inputs.goal} onValueChange={onGoalChange}>
            <SelectTrigger id="goal" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cut">Cut (Fat Loss)</SelectItem>
              <SelectItem value="maintain">Maintain</SelectItem>
              <SelectItem value="bulk">Bulk (Muscle Gain)</SelectItem>
            </SelectContent>
          </Select>
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
          onClick={() => setInputs({ weight: "", goal: "maintain" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results (High Contrast for Dark Mode) */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Your Result</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.category && (
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-white/50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-800 dark:text-blue-300 text-sm font-bold">
                  {results.category}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* MANDATORY "WHAT IS" SECTION */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          What is the Protein Intake by Goal (cut/bulk/maintain)?
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Protein intake by goal refers to the tailored amount of daily protein consumption based on an individual's fitness objective—whether cutting (losing fat), bulking (gaining muscle), or maintaining current body composition. Protein is a vital macronutrient that supports muscle repair, growth, and overall metabolic health. Adjusting protein intake according to your goal helps optimize body composition, preserve lean mass, and improve recovery.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          When cutting, higher protein intake is recommended to minimize muscle loss during calorie deficits. Bulking requires sufficient protein to support muscle hypertrophy alongside increased calorie consumption. Maintenance protein levels help sustain muscle mass and metabolic functions. This calculator uses evidence-based protein ranges per kilogram of body weight to provide personalized recommendations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calculator defaults to imperial units (lbs) for users in the US and Canada but supports metric units (kg) for international users. Internally, weight is converted to kilograms to align with scientific literature and clinical guidelines. This ensures accuracy and consistency in protein intake recommendations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding and applying the correct protein intake based on your goal can significantly impact your fitness progress, muscle retention, and overall health. This tool empowers you with precise, goal-specific protein targets grounded in current nutrition science.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide you with an accurate daily protein intake recommendation tailored to your body weight and fitness goal. Follow these steps to get your personalized result:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Select your preferred unit system:</strong> Choose between Imperial (lbs) or Metric (kg) units depending on your familiarity and location.
          </li>
          <li>
            <strong>Enter your current body weight:</strong> Input your weight in the selected unit system. This value is essential as protein recommendations are weight-dependent.
          </li>
          <li>
            <strong>Choose your fitness goal:</strong> Select whether you are cutting (fat loss), bulking (muscle gain), or maintaining your current weight. This determines the protein intake range applied.
          </li>
          <li>
            <strong>Calculate your protein intake:</strong> Click the calculate button to see your recommended daily protein intake in grams, optimized for your goal.
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
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Trusted References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0187-8"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. International Society of Sports Nutrition Position Stand: Protein and Exercise
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Comprehensive review on protein requirements for athletes and active individuals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3905294/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Protein Intake and Muscle Health in Older Adults
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Discusses protein needs for muscle preservation during calorie deficits and aging.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.healthline.com/nutrition/how-much-protein-per-day"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. How Much Protein Per Day? The Definitive Guide
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Practical guide on protein intake ranges for different goals and populations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.eatright.org/fitness/sports-and-performance/fueling-your-workout/how-much-protein-do-you-need"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Academy of Nutrition and Dietetics: Protein Needs for Athletes
            </a>
            <p className="text-slate-500 text-sm mt-1">
              Official recommendations on protein intake for exercise and muscle maintenance.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  // Formula & example for editorial props
  const formula = {
    title: "The Math Formula",
    formula: "Protein Intake (grams) = Body Weight (kg) × Protein Factor (g/kg)",
    variables: [
      { symbol: "Body Weight (kg)", description: "Your weight converted to kilograms" },
      {
        symbol: "Protein Factor (g/kg)",
        description:
          "Recommended protein grams per kilogram based on goal: 2.25 for cutting, 1.5 for maintenance, 1.9 for bulking",
      },
    ],
  };

  const example = {
    title: "Real-World Example",
    scenario:
      "A 180 lbs individual wants to know their daily protein intake while cutting fat.",
    steps: [
      {
        label: "Step 1",
        explanation: "Convert 180 lbs to kilograms: 180 × 0.453592 = 81.65 kg",
      },
      {
        label: "Step 2",
        explanation:
          "Multiply weight by cutting protein factor: 81.65 × 2.25 = 183.7 grams of protein per day",
      },
    ],
    result: "Recommended daily protein intake is approximately 184 grams.",
  };

  // Alias results for rendering
  const results = proteinIntake;

  return (
    <CalculatorVerticalLayout
      title="Protein Intake by Goal (cut/bulk/maintain)"
      description="Calculate your optimal daily protein intake. Find out exactly how many grams you need to build muscle or preserve mass while dieting."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "BMI — Body Mass Index Calculator", url: "/health/bmi-body-mass-index", icon: "⚖️" },
        { title: "BMR — Basal Metabolic Rate (Mifflin-St Jeor)", url: "/health/bmr-mifflin-st-jeor", icon: "🔥" },
        { title: "TDEE — Total Daily Energy Expenditure Calculator", url: "/health/tdee-daily-energy-expenditure", icon: "🔥" },
        { title: "Body Fat % (US Navy / 3-sites)", url: "/health/body-fat-us-navy-3-sites", icon: "💧" },
        { title: "Ideal Weight Range (Hamwi/Devine/Miller)", url: "/health/ideal-weight-range-hamwi-devine-miller", icon: "🥗" },
        { title: "Waist-to-Height Ratio Checker", url: "/health/waist-to-height-ratio", icon: "😴" },
      ]}
      onThisPage={[
        { id: "what-is", label: "What is Protein Intake by Goal (cut/bulk/maintain)?" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Trusted References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}