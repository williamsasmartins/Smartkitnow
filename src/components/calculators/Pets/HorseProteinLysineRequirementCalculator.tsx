import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseProteinLysineRequirementCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), activity level factor (multiplier), lysine % in diet (default 6.4%)
  // Protein requirement is based on metabolic weight and activity factor
  // Lysine requirement is % of crude protein requirement
  const [inputs, setInputs] = useState({
    weight: "",
    activityFactor: "1.2", // Maintenance default
    lysinePercent: "6.4", // Typical lysine % of crude protein in diet
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const activityFactorNum = parseFloat(inputs.activityFactor);
    const lysinePercentNum = parseFloat(inputs.lysinePercent);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(activityFactorNum) ||
      activityFactorNum <= 0 ||
      isNaN(lysinePercentNum) ||
      lysinePercentNum <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all inputs.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Crude Protein Requirement (g/day) = 3.2 * (BW in kg)^0.75 * Activity Factor
    // Source: NRC (2007) and common veterinary nutrition references
    const cpRequirement = 3.2 * Math.pow(weightKg, 0.75) * activityFactorNum;

    // Lysine Requirement (g/day) = Crude Protein Requirement * (Lysine % / 100)
    const lysineRequirement = cpRequirement * (lysinePercentNum / 100);

    // Format results to 1 decimal place
    const cpFormatted = cpRequirement.toFixed(1);
    const lysineFormatted = lysineRequirement.toFixed(1);

    return {
      value: 0,
      label: "",
      subtext: "",
      warning: null,
      cpFormatted,
      lysineFormatted,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is lysine an important amino acid for horses?",
      answer:
        "Lysine is the first limiting essential amino acid in equine diets, meaning it is often the nutrient most deficient relative to the horse's needs. It plays a critical role in muscle development, tissue repair, and overall growth. Ensuring adequate lysine intake supports optimal health, performance, and recovery in horses.",
    },
    {
      question: "How does a horse's activity level affect its protein requirements?",
      answer:
        "Protein requirements increase with higher activity levels because active horses need more amino acids to repair muscle tissue and support metabolic functions. Maintenance horses have lower protein needs, while performance, growth, or breeding horses require significantly more. Adjusting protein intake based on activity ensures balanced nutrition and prevents deficiencies or excesses.",
    },
    {
      question: "Why do we use metabolic body weight (BW^0.75) in protein calculations?",
      answer:
        "Metabolic body weight (BW^0.75) better reflects the animal's metabolic rate than total body weight alone. It accounts for the fact that larger animals have relatively lower metabolic rates per unit of body weight. Using this exponent allows for more accurate estimation of nutrient requirements across different horse sizes.",
    },
    {
      question: "Can this calculator replace veterinary nutritional advice?",
      answer:
        "This calculator provides an evidence-based estimate of protein and lysine requirements but does not replace personalized veterinary consultation. Individual horses may have unique health conditions, metabolic differences, or dietary restrictions that require tailored nutrition plans. Always consult a qualified veterinarian or equine nutritionist for comprehensive dietary management.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  function handleActivityFactorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setInputs((prev) => ({ ...prev, activityFactor: e.target.value }));
  }

  // Render
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
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Body weight is used to calculate metabolic weight for protein needs.
          </p>
        </div>

        <div>
          <Label htmlFor="activityFactor" className="text-slate-700 dark:text-slate-300">
            Activity Level Factor
          </Label>
          <select
            id="activityFactor"
            name="activityFactor"
            value={inputs.activityFactor}
            onChange={handleActivityFactorChange}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          >
            <option value="1.0">Maintenance (1.0)</option>
            <option value="1.2">Light Work (1.2)</option>
            <option value="1.4">Moderate Work (1.4)</option>
            <option value="1.6">Heavy Work (1.6)</option>
            <option value="1.8">Growth, Pregnancy, Lactation (1.8)</option>
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select the activity level to adjust protein needs accordingly.
          </p>
        </div>

        <div>
          <Label htmlFor="lysinePercent" className="text-slate-700 dark:text-slate-300">
            Lysine Percentage in Diet (% of Crude Protein)
          </Label>
          <Input
            id="lysinePercent"
            name="lysinePercent"
            type="number"
            min="0"
            step="any"
            placeholder="Typical: 6.4%"
            value={inputs.lysinePercent}
            onChange={handleInputChange}
            aria-describedby="lysine-desc"
          />
          <p id="lysine-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Lysine is typically 6.4% of crude protein in horse diets; adjust if known.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", activityFactor: "1.2", lysinePercent: "6.4" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.cpFormatted && results.lysineFormatted && !results.warning && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Daily Requirements
              </p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-1">
                {results.cpFormatted} g
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-medium mb-4">Crude Protein</p>
              <p className="text-3xl font-extrabold text-blue-900 dark:text-white mb-1">
                {results.lysineFormatted} g
              </p>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Lysine</p>
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and dietary planning.
            </p>
          </div>
        </div>
      )}

      {/* Warning */}
      {results.warning && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Horse Protein & Lysine Requirement Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Horse Protein & Lysine Requirement Calculator is a veterinary-grade tool designed to estimate the daily crude protein and lysine needs of horses based on their body weight and activity level. Protein is a vital macronutrient that supports muscle maintenance, repair, and overall metabolic functions in equines. Lysine, an essential amino acid, is particularly important as it is often the first limiting amino acid in horse diets, meaning its availability can restrict protein synthesis if insufficient.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator uses metabolic body weight (weight raised to the 0.75 power) to more accurately reflect the horse’s metabolic demands rather than relying solely on total body weight. It then adjusts protein requirements according to the horse’s activity level, recognizing that performance, growth, or reproductive states increase nutritional needs. By incorporating lysine as a percentage of crude protein, the tool provides a comprehensive estimate to help owners and veterinarians formulate balanced diets.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Accurate protein and lysine intake is crucial for maintaining optimal health, supporting muscle development, and enhancing recovery after exercise or illness. This calculator serves as an evidence-based guide to inform feeding strategies but should be used alongside professional veterinary advice to address individual horse needs and conditions.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this calculator effectively, begin by selecting the unit system that corresponds to your measurement preference—Imperial (pounds) or Metric (kilograms). Enter the horse’s current body weight accurately, as this is fundamental to calculating metabolic weight and subsequent protein requirements. Next, select the activity level factor that best describes your horse’s workload or physiological state, ranging from maintenance to heavy work or reproductive phases.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Input the horse’s weight in the chosen unit system. Ensure the value is positive and reflects the current condition of the horse.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the activity factor that matches your horse’s lifestyle. This multiplier adjusts the protein requirement to meet increased metabolic demands.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the lysine percentage in the diet, typically around 6.4%, or adjust if you have specific dietary information.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the estimated daily crude protein and lysine requirements. Use these values to guide dietary formulation or discuss with your veterinarian.
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
              href="https://www.nap.edu/catalog/11653/nutrient-requirements-of-horses-sixth-revised-edition-2007"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Nutrient Requirements of Horses, 6th Revised Edition (NRC, 2007)
            </a>
            <p className="text-slate-500 text-sm">
              The definitive guide on equine nutrition, providing detailed nutrient requirement tables and explanations for protein and amino acid needs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.extension.org/pages/Equine-Nutrition:-Protein-Requirements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Equine Nutrition: Protein Requirements (Extension.org)
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource explaining the role of protein and lysine in horse diets, including practical feeding recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-the-horse/protein-and-amino-acids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual: Protein and Amino Acids in Horses
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary manual detailing protein metabolism and amino acid requirements in equine species.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Protein & Lysine Requirement Calculator"
      description="Calculate the daily requirements for crude protein and the essential amino acid **Lysine** for horses."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Crude Protein Requirement (g/day) = 3.2 × (Body Weight in kg)^0.75 × Activity Factor",
        variables: [
          { symbol: "Body Weight", description: "Horse's body weight in kilograms" },
          { symbol: "Activity Factor", description: "Multiplier based on horse's activity level" },
          { symbol: "Crude Protein Requirement", description: "Daily protein requirement in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) horse performing moderate work requires an estimate of daily crude protein and lysine intake.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (1100 lb ÷ 2.20462 = 499 kg). Calculate metabolic weight: 499^0.75 ≈ 112.4.",
          },
          {
            label: "2",
            explanation:
              "Apply activity factor for moderate work (1.4): 3.2 × 112.4 × 1.4 = 503.6 g crude protein/day.",
          },
          {
            label: "3",
            explanation:
              "Calculate lysine requirement assuming 6.4% lysine in diet: 503.6 × 0.064 = 32.2 g lysine/day.",
          },
        ],
        result:
          "The horse requires approximately 504 g of crude protein and 32 g of lysine daily to meet its nutritional needs.",
      }}
      relatedCalculators={[
        {
          title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
          url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko",
          icon: "🐾",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
        { title: "Cat Carrier Size & Fit Guide", url: "/pets/cat-carrier-size-fit-guide", icon: "🐱" },
        {
          title: "Xylitol Exposure Risk for Cats (rare but educational)",
          url: "/pets/cat-xylitol-exposure-risk",
          icon: "🐱",
        },
        {
          title: "Litter Box Output Tracker (Normal vs. Increased)",
          url: "/pets/cat-litter-box-output-tracker",
          icon: "💉",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Protein & Lysine Requirement Calculator" },
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