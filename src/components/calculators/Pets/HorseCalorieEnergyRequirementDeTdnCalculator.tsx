import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseCalorieEnergyRequirementDeTdnCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight, activity level factor, physiological status factor
  // Weight: horse body weight
  // Activity level: maintenance, light work, moderate work, heavy work
  // Physiological status: maintenance, pregnancy, lactation
  const [inputs, setInputs] = useState({
    weight: "",
    activityLevel: "maintenance",
    physiologicalStatus: "maintenance",
  });

  // Activity level factors based on NRC guidelines (approximate DE multipliers)
  const activityFactors: Record<string, number> = {
    maintenance: 1.0,
    light: 1.2,
    moderate: 1.4,
    heavy: 1.6,
  };

  // Physiological status factors (multipliers for DE)
  const physiologicalFactors: Record<string, number> = {
    maintenance: 1.0,
    pregnancy: 1.2,
    lactation: 1.5,
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive weight.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate Digestible Energy (DE) requirement in Mcal/day
    // DE (Mcal/day) = 1.4 * (BW in kg)^0.75 * Activity Factor * Physiological Factor
    // 1.4 Mcal/kg^0.75 is approximate maintenance DE requirement per NRC (varies by source)
    const activityFactor = activityFactors[inputs.activityLevel] || 1.0;
    const physiologicalFactor = physiologicalFactors[inputs.physiologicalStatus] || 1.0;

    const metabolicBodyWeight = Math.pow(weightKg, 0.75);
    const DE_Mcal = 1.4 * metabolicBodyWeight * activityFactor * physiologicalFactor;

    // Calculate Total Digestible Nutrients (TDN) requirement in kg/day
    // Approximate conversion: TDN (kg/day) = DE (Mcal/day) / 4.4 (Mcal/kg TDN)
    // 4.4 Mcal/kg TDN is average energy content of TDN
    const TDN_kg = DE_Mcal / 4.4;

    // Format results with 2 decimals
    const DE_display = DE_Mcal.toFixed(2);
    const TDN_display = TDN_kg.toFixed(2);

    return {
      value: `${DE_display} Mcal/day DE | ${TDN_display} kg/day TDN`,
      label: "Daily Digestible Energy & Total Digestible Nutrients Requirement",
      subtext:
        "Calculated based on body weight, activity level, and physiological status using NRC guidelines.",
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is body weight raised to the 0.75 power in the DE calculation?",
      answer:
        "The body weight raised to the 0.75 power represents the metabolic body weight, which more accurately reflects the animal's energy needs than raw body weight. This scaling accounts for the fact that larger animals have lower metabolic rates per unit of body mass compared to smaller animals. Using metabolic body weight allows for more precise estimation of maintenance energy requirements across different sizes of horses.",
    },
    {
      question: "How do activity and physiological status affect a horse's energy requirements?",
      answer:
        "Activity level and physiological status significantly influence a horse's daily energy needs. Horses performing moderate to heavy work require more energy to sustain muscle activity and recovery, while pregnant or lactating mares have increased demands to support fetal growth or milk production. Adjusting for these factors ensures the horse receives adequate nutrition to maintain health and performance.",
    },
    {
      question: "What is the difference between Digestible Energy (DE) and Total Digestible Nutrients (TDN)?",
      answer:
        "Digestible Energy (DE) measures the amount of energy available to the horse after digestion, expressed in megacalories (Mcal). Total Digestible Nutrients (TDN) quantify the sum of digestible fiber, protein, fat, and carbohydrates in the feed, expressed in kilograms. While DE focuses on energy, TDN represents the nutrient content contributing to that energy, and both are used to formulate balanced diets.",
    },
    {
      question: "Why is it important to calculate a horse's energy requirements accurately?",
      answer:
        "Accurate calculation of a horse's energy requirements is essential to prevent underfeeding or overfeeding, both of which can lead to health issues. Underfeeding may cause weight loss, poor performance, and compromised immune function, while overfeeding can result in obesity, metabolic disorders, and laminitis. Proper energy balance supports optimal health, productivity, and longevity in horses.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Body Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={inputs.activityLevel}
            onChange={onInputChange}
            className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="maintenance">Maintenance (No work)</option>
            <option value="light">Light Work (e.g., walking, light riding)</option>
            <option value="moderate">Moderate Work (e.g., regular riding, training)</option>
            <option value="heavy">Heavy Work (e.g., intense training, racing)</option>
          </select>
        </div>

        <div>
          <Label htmlFor="physiologicalStatus" className="text-slate-700 dark:text-slate-300">
            Physiological Status
          </Label>
          <select
            id="physiologicalStatus"
            name="physiologicalStatus"
            value={inputs.physiologicalStatus}
            onChange={onInputChange}
            className="mt-1 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="maintenance">Maintenance</option>
            <option value="pregnancy">Pregnancy</option>
            <option value="lactation">Lactation</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              activityLevel: "maintenance",
              physiologicalStatus: "maintenance",
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
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized advice.
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
          Understanding Horse Calorie & Energy Requirement Calculator (DE / TDN)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Horse Calorie & Energy Requirement Calculator estimates the daily Digestible Energy (DE) and Total Digestible Nutrients (TDN) needs of horses based on their body weight, activity level, and physiological status. DE represents the energy available to the horse after digestion, essential for maintaining bodily functions and supporting physical activity. TDN quantifies the digestible nutrients contributing to this energy, providing a comprehensive view of dietary requirements.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses metabolic body weight (weight raised to the 0.75 power) to more accurately reflect the horse's energy metabolism, as larger animals have proportionally lower metabolic rates per unit of body mass. Activity multipliers adjust energy needs for horses engaged in varying levels of work, from maintenance to heavy exercise, while physiological factors account for increased demands during pregnancy and lactation. Together, these inputs enable precise nutritional planning tailored to individual horses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Proper estimation of energy requirements is critical for maintaining optimal health, performance, and longevity in horses. Overfeeding can lead to obesity and metabolic disorders, whereas underfeeding may cause weight loss, poor performance, and compromised immunity. This tool supports veterinarians, nutritionists, and horse owners in making informed feeding decisions based on scientific principles and established veterinary guidelines.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator, begin by selecting the unit system that corresponds to your measurement preference—Imperial (pounds) or Metric (kilograms). Enter the horse's current body weight accurately, as this is the foundation for all subsequent calculations. Next, choose the horse's activity level, which reflects the intensity and frequency of its daily work or exercise routine.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the horse's body weight in the selected unit system. Ensure the weight is current and precise for best results.
          </li>
          <li>
            <strong>Step 2:</strong> Select the activity level that best describes the horse's daily workload, ranging from maintenance to heavy work.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the physiological status, indicating if the horse is in maintenance, pregnant, or lactating, as these states alter energy demands.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view the estimated daily Digestible Energy and Total Digestible Nutrients requirements. Use these values to guide feeding and nutritional management.
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
              href="https://www.nap.edu/read/11653/chapter/1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Nutrient Requirements of Horses, 6th Edition (NRC, 2007)
            </a>
            <p className="text-slate-500 text-sm">
              The definitive guide published by the National Research Council outlining energy and nutrient requirements for horses across different life stages and activity levels.
            </p>
          </li>
          <li className="block">
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/20401976/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Energy Requirements and Nutrient Utilization in Horses (Kronfeld, 2010)
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive review of energy metabolism and feeding strategies in equine nutrition, emphasizing practical applications for health and performance.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.extension.org/pages/Equine-Nutrition:-Energy-Requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Equine Nutrition: Energy Requirements (Extension.org)
            </a>
            <p className="text-slate-500 text-sm">
              An accessible resource summarizing energy requirement calculations and feeding recommendations for horses in various physiological states.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Calorie & Energy Requirement Calculator (DE / TDN)"
      description="Calculate a horse's daily **Digestible Energy (DE)** and **Total Digestible Nutrients (TDN)** requirements."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "DE (Mcal/day) = 1.4 × (Body Weight in kg)^0.75 × Activity Factor × Physiological Factor",
        variables: [
          { symbol: "DE", description: "Digestible Energy requirement in megacalories per day" },
          { symbol: "Body Weight", description: "Horse body weight in kilograms" },
          { symbol: "Activity Factor", description: "Multiplier based on activity level (1.0–1.6)" },
          { symbol: "Physiological Factor", description: "Multiplier for physiological status (1.0–1.5)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) mare performing moderate work and in early pregnancy requires calculation of daily DE and TDN.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (1100 lb ÷ 2.20462 = 499 kg). Calculate metabolic body weight: 499^0.75 ≈ 105.5 kg.",
          },
          {
            label: "2",
            explanation:
              "Apply activity factor for moderate work (1.4) and physiological factor for pregnancy (1.2).",
          },
          {
            label: "3",
            explanation:
              "Calculate DE: 1.4 × 105.5 × 1.4 × 1.2 = 247.5 Mcal/day. Calculate TDN: 247.5 ÷ 4.4 ≈ 56.25 kg/day.",
          },
        ],
        result:
          "The mare requires approximately 247.5 Mcal of Digestible Energy and 56.25 kg of Total Digestible Nutrients daily to meet her needs.",
      }}
      relatedCalculators={[
        {
          title: "Omega-3 Supplement Dose (for parrots)",
          url: "/pets/bird-omega-3-supplement-dose-parrots",
          icon: "🐾",
        },
        {
          title: "Life Expectancy Estimator (lifestyle factors; educational)",
          url: "/pets/cat-life-expectancy-estimator",
          icon: "🐱",
        },
        {
          title: "Dog Xylitol Exposure Risk Calculator",
          url: "/pets/dog-xylitol-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
        {
          title: "Dog Age in Human Years (Breed-Aware)",
          url: "/pets/dog-age-human-years-breed-aware",
          icon: "🐶",
        },
        {
          title: "Gabapentin Dose Calculator for Dogs",
          url: "/pets/dog-gabapentin-dose",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Calorie & Energy Requirement Calculator (DE / TDN)" },
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