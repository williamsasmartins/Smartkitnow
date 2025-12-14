import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatDailyWaterIntakeCheckerCalculator() {
  // 1. STATE
  // Weight and volume involved => keep unit switcher
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  // Inputs: weight only (kg or lbs)
  const [inputs, setInputs] = useState<{ weight?: string }>({ weight: "" });

  // 2. LOGIC ENGINE
  // Formula source:
  // Cats require approximately 50 ml of water per kg of body weight daily.
  // This includes water from food and drinking water.
  // For dry food fed cats, water intake should be closely monitored.
  // Reference: National Research Council, 2006; WSAVA Nutrition Guidelines

  // Conversion helpers
  const lbsToKg = (lbs: number) => lbs * 0.45359237;
  const mlToOz = (ml: number) => ml * 0.033814;

  const results = useMemo(() => {
    if (!inputs.weight) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    let weightKg: number;
    if (unit === "imperial") {
      const weightLbs = parseFloat(inputs.weight);
      if (isNaN(weightLbs) || weightLbs <= 0) {
        return {
          value: 0,
          label: "",
          subtext: "",
          warning: "Please enter a valid positive weight.",
        };
      }
      weightKg = lbsToKg(weightLbs);
    } else {
      const weightMetric = parseFloat(inputs.weight);
      if (isNaN(weightMetric) || weightMetric <= 0) {
        return {
          value: 0,
          label: "",
          subtext: "",
          warning: "Please enter a valid positive weight.",
        };
      }
      weightKg = weightMetric;
    }

    // Calculate daily water intake in ml
    // Typical recommendation: 50 ml/kg/day
    const waterMl = weightKg * 50;

    // Convert result to user preferred volume unit
    let displayValue: number;
    let displayLabel: string;
    if (unit === "imperial") {
      // Convert ml to fluid ounces (oz)
      displayValue = parseFloat((mlToOz(waterMl)).toFixed(2));
      displayLabel = "fl oz per day";
    } else {
      displayValue = parseFloat(waterMl.toFixed(0));
      displayLabel = "ml per day";
    }

    // Warning if weight is unusually low or high for typical cats
    let warning: string | null = null;
    if (weightKg < 2) {
      warning = "Weight entered is very low; ensure this is accurate for your cat.";
    } else if (weightKg > 10) {
      warning = "Weight entered is high; consult your vet for personalized water needs.";
    }

    return {
      value: displayValue,
      label: displayLabel,
      subtext: `Based on a daily water requirement of 50 ml per kg of body weight.`,
      warning,
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "Why is daily water intake important for cats?",
      answer:
        "Daily water intake is crucial for maintaining kidney function and overall health in cats. Cats are prone to urinary tract issues and kidney disease, especially if they consume primarily dry food. Adequate hydration supports toxin elimination and prevents urinary crystals and stones.",
    },
    {
      question: "Does this calculator account for water from food?",
      answer:
        "This calculator estimates total daily water needs including water from food and drinking water. Cats eating wet food receive significant moisture from their diet, so their drinking water requirement may be lower. Adjust accordingly based on your cat’s diet.",
    },
    {
      question: "How can I encourage my cat to drink more water?",
      answer:
        "Encourage water intake by providing fresh water daily, using water fountains, placing multiple water bowls around the home, and offering wet food. Some cats prefer running water or flavored water (e.g., low sodium broth). Consult your vet if hydration remains low.",
    },
    {
      question: "When should I consult a veterinarian about my cat’s hydration?",
      answer:
        "Consult a veterinarian if your cat shows signs of dehydration such as lethargy, sunken eyes, dry gums, or reduced urination. Also seek advice if your cat refuses to drink water or has underlying health conditions affecting hydration.",
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

      {/* WEIGHT INPUT */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={unit === "imperial" ? "e.g. 10" : "e.g. 4.5"}
          value={inputs.weight ?? ""}
          onChange={(e) => setInputs({ weight: e.target.value })}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400">
          Enter your cat’s current body weight.
        </p>
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
          onClick={() => setInputs({ weight: "" })}
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Daily Water Intake Checker for Cats
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Proper hydration is essential for cats to maintain optimal kidney function, regulate body temperature, and support overall health. Cats are naturally low-thirst animals, evolved to obtain moisture from their prey. However, domestic cats often consume dry kibble, which contains minimal water, increasing their risk of dehydration and urinary tract issues.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the recommended daily water intake based on your cat’s body weight, providing a practical guideline to ensure your feline friend stays well-hydrated. Adequate water consumption helps prevent common feline health problems such as kidney disease, urinary crystals, and bladder infections.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Monitoring your cat’s water intake is especially important for cats on dry food diets or those with pre-existing health conditions. By understanding and meeting your cat’s hydration needs, you contribute significantly to their long-term wellness and quality of life.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this tool, simply enter your cat’s current body weight and select the appropriate unit system (imperial or metric). The calculator will estimate the total daily water intake your cat requires, including water from food and drinking water. Use this estimate to monitor and encourage adequate hydration.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Measure or estimate your cat’s weight accurately using a scale or veterinary records.
          </li>
          <li>
            <strong>Step 2:</strong> Select the unit system that matches your measurement (lbs or kg).
          </li>
          <li>
            <strong>Step 3:</strong> Enter the weight value into the input field.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended daily water intake.
          </li>
          <li>
            <strong>Step 5:</strong> Use the result to guide your cat’s hydration management and consult your veterinarian if you have concerns.
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
              href="https://www.wsava.org/global-guidelines/global-nutrition-guidelines/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. WSAVA Global Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              World Small Animal Veterinary Association guidelines on feline nutrition and hydration recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.nap.edu/catalog/10668/nutrient-requirements-of-dogs-and-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Nutrient Requirements of Dogs and Cats (NRC, 2006)
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource detailing water and nutrient requirements for cats based on scientific research.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/hydration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center - Hydration
            </a>
            <p className="text-slate-500 text-sm">
              Expert advice on feline hydration, signs of dehydration, and strategies to increase water intake.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Water Intake Checker for Cats"
      description="Check if your cat is meeting its daily fluid requirement, crucial for kidney health, especially with dry food diets."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Daily Water Intake (ml) = 50 × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Your cat's weight in kilograms" },
          { symbol: "50 (ml/kg)", description: "Recommended daily water intake per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) domestic cat primarily fed dry food needs adequate hydration to prevent urinary issues.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed: 10 lb × 0.4536 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate water intake: 50 ml × 4.54 kg = 227 ml per day.",
          },
          {
            label: "3",
            explanation:
              "Convert to fluid ounces if preferred: 227 ml × 0.0338 = 7.67 fl oz per day.",
          },
        ],
        result: "The cat should consume approximately 227 ml (7.67 fl oz) of water daily.",
      }}
      relatedCalculators={[
        { title: "Common Toxic Foods Reference", url: "/pets/small-mammal-common-toxic-foods-reference", icon: "🐾" },
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🐶" },
        { title: "Temperature Stress Risk (Rabbit Heatstroke)", url: "/pets/rabbit-temperature-stress-risk-heatstroke", icon: "🐱" },
        { title: "Horse Gestation (Due Date) Calculator", url: "/pets/horse-gestation-due-date", icon: "🐎" },
        { title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)", url: "/pets/horse-dehydration-risk-estimator", icon: "💉" },
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Daily Water Intake Checker for Cats" },
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