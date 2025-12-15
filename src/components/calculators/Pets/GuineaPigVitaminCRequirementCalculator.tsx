import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GuineaPigVitaminCRequirementCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Vitamin C requirement for guinea pigs is generally 10-30 mg/kg body weight daily.
  // We'll use 20 mg/kg as a standard recommended daily supplemental dose.
  // Formula: Vitamin C Requirement (mg/day) = Body Weight (kg) × 20 mg/kg
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    // Convert to kg if input is imperial (lbs)
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate Vitamin C requirement
    const vitaminCmg = weightKg * 20;

    // Round to 1 decimal place
    const rounded = Math.round(vitaminCmg * 10) / 10;

    return {
      value: rounded.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      label: "Daily Vitamin C Requirement (mg)",
      subtext: `Based on a body weight of ${weightRaw} ${unit === "imperial" ? "lbs" : "kg"}`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why do guinea pigs require supplemental Vitamin C?",
      answer:
        "Guinea pigs lack the enzyme necessary to synthesize Vitamin C internally, making dietary supplementation essential. Without adequate Vitamin C, they can develop scurvy, a serious condition causing joint pain, lethargy, and poor wound healing. Therefore, ensuring a consistent daily intake is critical for their overall health and immune function.",
    },
    {
      question: "How is the Vitamin C requirement calculated for guinea pigs?",
      answer:
        "The requirement is based on the guinea pig's body weight, typically expressed in milligrams per kilogram. Veterinary guidelines recommend approximately 20 mg of Vitamin C per kilogram of body weight daily to meet metabolic needs. This calculation helps tailor supplementation to individual animals, ensuring neither deficiency nor excess.",
    },
    {
      question: "Can guinea pigs get Vitamin C from fresh vegetables alone?",
      answer:
        "While fresh vegetables like bell peppers and kale contain Vitamin C, the amount can vary widely due to storage and preparation methods. Relying solely on vegetables may not guarantee consistent intake, especially for growing, pregnant, or ill guinea pigs with higher needs. Supplementation ensures a reliable and adequate daily dose to prevent deficiency.",
    },
    {
      question: "What are the signs of Vitamin C deficiency in guinea pigs?",
      answer:
        "Signs include swollen joints, lethargy, poor appetite, rough coat, and bleeding gums. These symptoms arise because Vitamin C is vital for collagen synthesis and immune health. Early detection and supplementation can reverse symptoms, but prolonged deficiency can lead to severe complications and even death.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
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

      {/* Weight input */}
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
          aria-describedby="weight-help"
        />
        <p id="weight-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your guinea pig's current body weight to calculate daily Vitamin C needs.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation (already reactive)
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
          Understanding Vitamin C Requirement (Guinea Pig)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Guinea pigs are unique among many mammals because they cannot synthesize Vitamin C internally due to the absence of the enzyme L-gulonolactone oxidase. This inability necessitates a dietary source of Vitamin C to maintain essential physiological functions such as collagen synthesis, immune defense, and antioxidant protection. Without adequate Vitamin C intake, guinea pigs are at risk of developing scurvy, a debilitating disease characterized by joint pain, lethargy, and poor wound healing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The daily Vitamin C requirement for guinea pigs is typically calculated based on their body weight, with veterinary guidelines recommending approximately 20 mg per kilogram of body weight. This ensures that the animal receives enough Vitamin C to meet metabolic demands and prevent deficiency symptoms. Supplementation can be provided through specially formulated pellets, fresh vegetables, or Vitamin C drops, but consistency and dosage accuracy are critical to avoid both deficiency and toxicity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Monitoring and adjusting Vitamin C intake is especially important for growing, pregnant, or ill guinea pigs, as their requirements may be elevated. This calculator provides a reliable estimate of the daily supplemental Vitamin C needed based on current body weight, helping owners and veterinarians tailor nutrition plans effectively. Maintaining optimal Vitamin C levels supports overall health, longevity, and quality of life for these sensitive small mammals.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the daily supplemental Vitamin C requirement for your guinea pig based on its current body weight. To use it effectively, enter the weight of your guinea pig in either pounds or kilograms, depending on your preferred unit system. The calculator will then provide the recommended Vitamin C dosage in milligrams per day, helping you ensure your pet receives adequate supplementation.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that matches how you measure your guinea pig's weight.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the guinea pig's current body weight accurately in the input field.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to view the estimated daily Vitamin C requirement.
          </li>
          <li>
            <strong>Step 4:</strong> Use the result to guide supplementation through diet or Vitamin C additives, consulting your veterinarian for personalized advice.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/rodents/guinea-pigs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Guinea Pigs
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary resource detailing guinea pig nutrition, including Vitamin C requirements and deficiency symptoms.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5372977/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. National Institutes of Health - Vitamin C in Guinea Pigs
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article discussing the metabolic necessity of Vitamin C supplementation in guinea pigs and related health impacts.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/resource-library/vitamin-c-requirements-in-guinea-pigs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Veterinarian Exotics - Vitamin C Requirements
            </a>
            <p className="text-slate-500 text-sm">
              Expert guidelines on daily Vitamin C supplementation for guinea pigs, emphasizing dosage and administration methods.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Vitamin C Requirement (Guinea Pig)"
      description="Calculate the daily supplemental Vitamin C requirement, which guinea pigs cannot synthesize themselves."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Vitamin C Requirement (mg/day) = Body Weight (kg) × 20 mg/kg",
        variables: [
          { symbol: "Body Weight (kg)", description: "Guinea pig's body weight in kilograms" },
          { symbol: "20 mg/kg", description: "Recommended Vitamin C dose per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A guinea pig weighs 2.5 lbs. The owner wants to know the daily Vitamin C supplementation needed.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms: 2.5 lbs ÷ 2.20462 = 1.13 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Multiply body weight by 20 mg/kg: 1.13 kg × 20 mg/kg = 22.6 mg Vitamin C per day.",
          },
        ],
        result: "The guinea pig requires approximately 22.6 mg of Vitamin C daily to maintain health.",
      }}
      relatedCalculators={[
        { title: "Weight Maintenance vs. Gain/Loss Planner", url: "/pets/small-mammal-weight-maintenance-gain-loss-planner", icon: "🐾" },
        { title: "Breeding Tank Volume Planner", url: "/pets/breeding-tank-volume-planner", icon: "🐶" },
        { title: "Water Change Volume Planner", url: "/pets/aquarium-water-change-volume-planner", icon: "🐱" },
        { title: "Fiber & Protein Ratio Calculator", url: "/pets/small-mammal-fiber-protein-ratio", icon: "🍖" },
        { title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)", url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko", icon: "💉" },
        { title: "Safe Vegetables & Fruits Portion Calculator", url: "/pets/small-mammal-safe-vegetables-fruits-portion", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Vitamin C Requirement (Guinea Pig)" },
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