import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatOmega3EpaDhaSupplementCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Omega-3 Dose (mg/day) = 20 mg/kg * weight (kg)
  // Reference dose: 20 mg EPA+DHA per kg body weight daily for cats (typical veterinary recommendation)
  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw || isNaN(Number(weightRaw)) || Number(weightRaw) <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? Number(weightRaw) / 2.20462 : Number(weightRaw);

    // Calculate dose
    const doseMgPerDay = 20 * weightKg;

    // Round to nearest whole number
    const doseRounded = Math.round(doseMgPerDay);

    // Warning if dose is unusually high or low (e.g. <10 mg or >200 mg)
    let warning = null;
    if (doseRounded < 10) {
      warning =
        "The calculated dose is very low. Confirm your cat's weight and consult your veterinarian to ensure adequacy.";
    } else if (doseRounded > 200) {
      warning =
        "The calculated dose is relatively high. Please consult your veterinarian before supplementing at this level.";
    }

    return {
      value: doseRounded,
      label: "Daily Omega-3 (EPA/DHA) Dose (mg)",
      subtext: `Based on a weight of ${weightKg.toFixed(2)} kg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is Omega-3 supplementation important for cats?",
      answer:
        "Omega-3 fatty acids, specifically EPA and DHA, play a crucial role in maintaining healthy skin, coat, joints, and immune function in cats. These essential fats cannot be synthesized efficiently by cats and must be obtained through diet or supplements. Supplementation helps manage inflammatory conditions and supports overall feline wellness.",
    },
    {
      question: "How is the correct Omega-3 dose for cats determined?",
      answer:
        "The dose is calculated based on the cat's body weight, typically using a standard veterinary recommendation of 20 mg of combined EPA and DHA per kilogram of body weight daily. This ensures the cat receives an adequate amount to support health without risking overdose. Weight-based dosing accounts for size variability among cats.",
    },
    {
      question: "Can I use fish oil supplements intended for humans for my cat?",
      answer:
        "While some human fish oil supplements contain EPA and DHA, they may have additives or dosages unsuitable for cats. It's important to use supplements specifically formulated for pets or consult your veterinarian to ensure safety and proper dosing. Incorrect supplementation can lead to toxicity or nutrient imbalances.",
    },
    {
      question: "Are there any risks associated with Omega-3 supplementation in cats?",
      answer:
        "Excessive Omega-3 intake can cause side effects such as gastrointestinal upset, blood clotting issues, or nutrient imbalances. It's essential to follow veterinary dosing guidelines and monitor your cat for any adverse reactions. Always consult your veterinarian before starting or adjusting supplementation.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX
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
          Cat's Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weightHelp"
        />
        <p id="weightHelp" className="text-xs text-slate-500 dark:text-slate-400">
          Enter your cat's current body weight to calculate the recommended daily Omega-3 dose.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
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

  // EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Omega-3 (EPA/DHA) Supplement Calculator for Cats
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Omega-3 fatty acids, particularly eicosapentaenoic acid (EPA) and docosahexaenoic acid (DHA), are essential nutrients that support various physiological functions in cats. These polyunsaturated fats contribute significantly to maintaining healthy skin and coat, reducing inflammation, and promoting joint health. Since cats cannot efficiently synthesize EPA and DHA from precursors, supplementation is often necessary, especially in cases of skin disorders or arthritis.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator provides a precise, weight-based dosage recommendation for Omega-3 supplementation tailored specifically for cats. By inputting your cat’s weight, the tool estimates the daily amount of EPA and DHA required to support optimal health. This approach ensures that cats receive neither too little, which may be ineffective, nor too much, which could lead to adverse effects.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Veterinary professionals widely endorse Omega-3 supplementation as part of comprehensive feline health management, particularly for conditions involving inflammation or immune dysfunction. Using this calculator helps pet owners and veterinarians make informed decisions about supplementation, promoting safe and effective use of these vital nutrients.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To accurately determine the appropriate daily dose of Omega-3 fatty acids for your cat, begin by selecting the unit system that corresponds to how you measure your cat’s weight: Imperial (pounds) or Metric (kilograms). Next, enter your cat’s current body weight into the input field. The calculator will then compute the recommended daily dose of combined EPA and DHA based on veterinary dosing guidelines.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that matches your measurement preference.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s weight accurately in the input field provided.
          </li>
          <li>
            <strong>Step 3:</strong> Click the "Calculate" button to view the recommended daily Omega-3 dose in milligrams.
          </li>
          <li>
            <strong>Step 4:</strong> Review the result and any warnings. Consult your veterinarian before starting supplementation.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4808858/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Bauer JE. Therapeutic use of fish oils in companion animals. J Am Vet Med Assoc. 2011.
            </a>
            <p className="text-slate-500 text-sm">
              This article reviews the benefits and dosing of Omega-3 fatty acids in pets, emphasizing their role in managing inflammatory conditions.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/omega-3-fatty-acids.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine: Omega-3 Fatty Acids in Companion Animals.
            </a>
            <p className="text-slate-500 text-sm">
              A comprehensive guide on the clinical applications and dosing recommendations of EPA and DHA for cats and dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/nutrition/nutrition-of-cats-and-dogs/fatty-acids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual: Fatty Acids in Cats.
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource detailing the metabolism, requirements, and supplementation guidelines for fatty acids in feline nutrition.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Omega-3 (EPA/DHA) Supplement Calculator for Cats"
      description="Determine the correct daily supplement dosage of **Omega-3 fatty acids (EPA/DHA)** for joint and skin health in cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Omega-3 Dose (mg/day) = 20 mg/kg × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Omega-3 Dose (mg/day)", description: "Recommended daily dose of combined EPA and DHA" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10-pound (4.54 kg) cat requires Omega-3 supplementation for skin and joint support. Using the calculator, the dose is determined based on weight.",
        steps: [
          {
            label: "1",
            explanation: "Convert 10 lbs to kilograms: 10 ÷ 2.20462 ≈ 4.54 kg.",
          },
          {
            label: "2",
            explanation: "Multiply weight by 20 mg/kg: 4.54 × 20 = 90.8 mg.",
          },
          {
            label: "3",
            explanation: "Round to nearest whole number: 91 mg EPA/DHA daily dose recommended.",
          },
        ],
        result: "The cat should receive approximately 91 mg of combined EPA and DHA daily.",
      }}
      relatedCalculators={[
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Bedding Replacement Frequency Estimator", url: "/pets/small-mammal-bedding-replacement-frequency", icon: "🐶" },
        { title: "Dehydration Risk Estimator (Symptoms + Intake)", url: "/pets/cat-dehydration-risk-estimator", icon: "🐱" },
        { title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator", url: "/pets/dog-onion-garlic-exposure-risk", icon: "🐶" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Omega-3 (EPA/DHA) Supplement Calculator for Cats" },
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