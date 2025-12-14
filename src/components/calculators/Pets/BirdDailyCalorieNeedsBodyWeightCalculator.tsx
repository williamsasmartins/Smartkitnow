import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdDailyCalorieNeedsBodyWeightCalculator() {
  // 1. STATE
  // Unit selector needed because weight input can be in lbs or kg
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Formula: RER = 70 * (Body Weight in kg)^0.75
  // Daily Calorie Needs = RER * 1.6 (typical multiplier for adult birds at maintenance)
  // We show only the primary formula in the formula prop.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate Resting Energy Requirement (RER)
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Typical multiplier for daily calorie needs in adult birds (maintenance)
    const dailyCalories = rer * 1.6;

    // Format result to 2 decimals
    const dailyCaloriesRounded = dailyCalories.toFixed(2);

    return {
      value: dailyCaloriesRounded,
      label: "kcal/day",
      subtext: `Based on a body weight of ${weightRaw} ${unit === "imperial" ? "lbs" : "kg"}`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is body weight important for calculating daily calorie needs in birds?",
      answer:
        "Body weight is a fundamental factor in determining a bird's energy requirements because metabolic rate scales with size. Larger birds generally require more calories, but not in a linear fashion; the relationship follows an allometric scaling (weight to the power of 0.75). This ensures that calorie needs are accurately estimated to maintain healthy body function and activity levels.",
    },
    {
      question: "How does the Resting Energy Requirement (RER) relate to daily calorie needs?",
      answer:
        "The Resting Energy Requirement (RER) represents the baseline energy a bird needs at rest to maintain vital physiological functions. Daily calorie needs are calculated by multiplying RER by a factor that accounts for activity, thermoregulation, and other metabolic demands. This multiplier varies depending on the bird's life stage, health, and activity level, ensuring tailored nutritional support.",
    },
    {
      question: "Can this calculator be used for birds of all species and ages?",
      answer:
        "While this calculator provides a general estimate based on body weight, energy requirements can vary significantly among species and ages. Juvenile, breeding, or sick birds may require different multipliers or nutritional adjustments. For precise dietary planning, consulting a veterinarian familiar with the specific bird species and condition is essential.",
    },
    {
      question: "Why do we use kilograms internally even if the input is in pounds?",
      answer:
        "Kilograms are the standard unit of mass in scientific and veterinary calculations, ensuring consistency and accuracy. Converting pounds to kilograms internally allows the formula to use established metabolic equations without unit discrepancies. This approach prevents calculation errors and aligns with veterinary best practices.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Body Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-xs text-slate-400 dark:text-slate-500">
          Enter the bird's current body weight to estimate daily calorie needs.
        </p>
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
          onClick={() => setInputs({ weight: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Daily Calorie Needs by Body Weight
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Determining the daily calorie needs of birds based on their body weight is a cornerstone of avian nutrition and veterinary care. Birds have unique metabolic rates that differ significantly from mammals, and their energy requirements scale non-linearly with body size. By using scientifically validated formulas, such as the Resting Energy Requirement (RER), veterinarians and caretakers can estimate the baseline energy a bird requires to maintain vital physiological functions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The RER calculation incorporates the bird’s body weight raised to the power of 0.75, reflecting the allometric scaling principle common in biology. This approach accounts for the fact that larger birds do not simply need proportionally more calories but rather follow a metabolic scaling law. Once the RER is established, it is multiplied by a factor that considers the bird’s activity level, life stage, and health status to estimate the total daily calorie needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding these energy requirements is critical for formulating appropriate diets, preventing malnutrition, and supporting recovery in ill or stressed birds. This calculator provides a reliable estimate based on body weight, serving as a valuable tool for veterinarians, avian nutritionists, and bird owners aiming to optimize health and longevity through proper feeding strategies.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the daily calorie needs of birds based on their body weight using a scientifically validated formula. To use it effectively, simply enter the bird’s current weight in the appropriate unit system—either pounds or kilograms. The calculator will convert the weight internally if needed and provide an estimate of the daily kilocalorie requirement.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system that matches your measurement (Imperial for pounds or Metric for kilograms).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird’s body weight accurately in the input field.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to view the estimated daily calorie needs in kcal/day.
          </li>
          <li>
            <strong>Step 4:</strong> Use this estimate as a guideline for feeding and consult a veterinarian for species-specific adjustments or health concerns.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7149734/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Nutritional Requirements of Birds: Resting Energy Requirement and Daily Calorie Needs
            </a>
            <p className="text-slate-500 text-sm">
              This peer-reviewed article discusses the metabolic scaling and energy requirements of birds, providing foundational formulas used in veterinary nutrition.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/nutrition-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Nutrition in Birds
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive veterinary resource outlining dietary energy needs and feeding guidelines for various bird species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/avian_nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians: Avian Nutrition Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Professional guidelines and recommendations for calculating and meeting the nutritional needs of pet and exotic birds.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Daily Calorie Needs by Body Weight"
      description="Calculate the daily calorie and energy requirements for different species of birds based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Calorie Needs = 70 × (Body Weight in kg)^0.75 × 1.6",
        variables: [
          { symbol: "Body Weight in kg", description: "Bird's body weight in kilograms" },
          { symbol: "70", description: "Constant for Resting Energy Requirement calculation" },
          { symbol: "1.6", description: "Multiplier for maintenance energy needs in adult birds" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A parrot weighs 2.2 lbs (1 kg). Calculate its estimated daily calorie needs using the formula.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed. Here, 2.2 lbs = 1 kg (already metric).",
          },
          {
            label: "2",
            explanation:
              "Calculate RER: 70 × (1)^0.75 = 70 kcal/day.",
          },
          {
            label: "3",
            explanation:
              "Multiply RER by 1.6 for maintenance: 70 × 1.6 = 112 kcal/day.",
          },
        ],
        result: "The parrot requires approximately 112 kcal per day to maintain its body weight.",
      }}
      relatedCalculators={[
        { title: "Omega-3 Supplement Planner (EPA/DHA per kg)", url: "/pets/horse-omega-3-supplement-planner", icon: "🐾" },
        { title: "Antibiotic Dose Reference (mg/kg)", url: "/pets/bird-antibiotic-dose-reference", icon: "🐶" },
        { title: "Parasite Treatment Dose Reference", url: "/pets/small-mammal-parasite-treatment-dose-reference", icon: "🐱" },
        { title: "Safe Stocking Density (Fish/cm per Litre)", url: "/pets/aquarium-safe-stocking-density-fish-per-litre", icon: "🍖" },
        { title: "Metabolic Bone Disease Risk Estimator", url: "/pets/reptile-metabolic-bone-disease-risk", icon: "💉" },
        { title: "pH Adjustment (Acid/Base Buffer) Calculator", url: "/pets/aquarium-ph-adjustment-buffer", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Daily Calorie Needs by Body Weight" },
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