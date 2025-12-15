import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const DRUG_CLASSES = {
  "Benzimidazoles": {
    doseMgPerKg: 7.5, // e.g. Fenbendazole typical dose 7.5 mg/kg
    drugExample: "Fenbendazole"
  },
  "Macrocyclic Lactones": {
    doseMgPerKg: 0.2, // e.g. Ivermectin typical dose 0.2 mg/kg
    drugExample: "Ivermectin"
  },
  "Tetrahydropyrimidines": {
    doseMgPerKg: 6.6, // e.g. Pyrantel pamoate typical dose 6.6 mg/kg
    drugExample: "Pyrantel"
  },
  "Praziquantel": {
    doseMgPerKg: 1.0, // Praziquantel typical dose 1 mg/kg
    drugExample: "Praziquantel"
  }
};

export default function HorseDewormerDoseCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    drugClass: "Benzimidazoles"
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive weight."
      };
    }
    const drugClass = inputs.drugClass;
    if (!DRUG_CLASSES[drugClass]) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please select a valid drug class."
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Dose calculation: Dose (mg) = Dose (mg/kg) * Weight (kg)
    const doseMgPerKg = DRUG_CLASSES[drugClass].doseMgPerKg;
    const totalDoseMg = doseMgPerKg * weightKg;

    // Round to 2 decimals
    const doseRounded = Math.round(totalDoseMg * 100) / 100;

    return {
      value: doseRounded,
      label: `Recommended Dose of ${DRUG_CLASSES[drugClass].drugExample} (mg)`,
      subtext: `Based on a weight of ${weightRaw} ${unit === "imperial" ? "lbs" : "kg"} and drug class ${drugClass}.`,
      warning: null
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate dewormer dose based on drug class and weight?",
      answer:
        "Calculating the dewormer dose based on drug class and weight ensures the medication is both safe and effective. Different drug classes have varying potencies and mechanisms of action, requiring precise dosing to target parasites without causing toxicity. Weight-based dosing accounts for individual variation among horses, preventing underdosing that can lead to resistance or overdosing that can cause adverse effects."
    },
    {
      question: "How does the drug class affect the dosage calculation?",
      answer:
        "Each drug class has a specific recommended dose per kilogram of body weight due to differences in pharmacodynamics and pharmacokinetics. For example, macrocyclic lactones like ivermectin require much smaller doses compared to benzimidazoles like fenbendazole. Using the correct drug class ensures the calculator applies the appropriate dose multiplier for accurate results."
    },
    {
      question: "Can I use this calculator for animals other than horses?",
      answer:
        "This calculator is specifically designed for horses and uses dosing guidelines validated for equine species. Other animals have different metabolic rates and drug sensitivities, so using this tool for other species could result in incorrect dosing. Always consult a veterinarian for species-specific dosing recommendations."
    },
    {
      question: "What should I do if my horse’s weight is unknown or estimated?",
      answer:
        "Accurate weight measurement is crucial for safe dosing; if unknown, use a weight tape or consult a veterinarian for an estimate. Overestimating weight can lead to overdosing, while underestimating may cause ineffective treatment and parasite resistance. When in doubt, err on the side of caution and seek professional guidance."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="drugClass" className="text-slate-700 dark:text-slate-300">
            Dewormer Drug Class
          </Label>
          <Select
            id="drugClass"
            value={inputs.drugClass}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, drugClass: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select drug class" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DRUG_CLASSES).map(([key, val]) => (
                <SelectItem key={key} value={key}>
                  {key} ({val.drugExample})
                </SelectItem>
              ))}
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
          onClick={() => setInputs({ weight: "", drugClass: "Benzimidazoles" })}
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
          Understanding Dewormer Dose Calculator (by Drug Class & Weight)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Deworming is a critical aspect of equine health management, aimed at controlling internal parasites that can cause significant illness and performance issues. The Dewormer Dose Calculator by Drug Class & Weight provides a precise method to determine the correct dosage of anthelmintic drugs based on the horse’s weight and the specific drug class used. This approach ensures that the medication is administered safely and effectively, minimizing the risk of underdosing or overdosing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Different classes of dewormers, such as benzimidazoles, macrocyclic lactones, tetrahydropyrimidines, and praziquantel, have unique dosing requirements due to their varying potencies and mechanisms of action. Weight-based dosing is essential because horses vary widely in size and metabolism, and a one-size-fits-all approach can lead to treatment failure or toxicity. By integrating drug class and weight, this calculator supports veterinarians and horse owners in making informed dosing decisions.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Using this tool promotes responsible parasite control, which is vital to prevent the development of anthelmintic resistance—a growing concern in equine medicine. Accurate dosing also helps maintain the health and welfare of horses, ensuring they remain free from parasitic burdens that can impair digestion, nutrient absorption, and overall vitality. This calculator is designed as an educational aid and should complement, not replace, professional veterinary advice.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use the Dewormer Dose Calculator, begin by selecting the unit system that corresponds to your measurement preference—Imperial (pounds) or Metric (kilograms). Next, enter the horse’s weight accurately, as this is the primary factor in determining the correct dose. Then, choose the drug class of the dewormer you intend to use from the dropdown menu, which includes common classes such as benzimidazoles and macrocyclic lactones.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) to match how you measure your horse’s weight.
          </li>
          <li>
            <strong>Step 2:</strong> Input the horse’s weight in the selected unit. Use a weight tape or scale for accuracy.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the appropriate drug class for the dewormer you plan to administer.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the recommended dose in milligrams.
          </li>
          <li>
            <strong>Step 5:</strong> Always cross-check the result with product labels and consult your veterinarian before administration.
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
              href="https://aaep.org/guidelines/deworming-horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. American Association of Equine Practitioners (AAEP) Deworming Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guidelines on equine parasite control, including dosing recommendations for various anthelmintic drug classes.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/digestive-system/gastrointestinal-parasites-of-horses/anthelmintics-for-horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Anthelmintics for Horses
            </a>
            <p className="text-slate-500 text-sm">
              Detailed pharmacology and dosing information for common equine dewormers, supporting evidence-based dosing calculations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ivis.org/library/equine-therapeutics/anthelmintics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. IVIS Equine Therapeutics: Anthelmintics
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary resource covering drug classes, mechanisms, and dosing strategies for equine parasite management.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dewormer Dose Calculator (by Drug Class & Weight)"
      description="Calculate the correct dosage for various types of dewormers (anthelmintics) based on drug class and horse weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Dose (mg/kg) × Weight (kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total dose of dewormer in milligrams" },
          { symbol: "Dose (mg/kg)", description: "Recommended dose per kilogram for the drug class" },
          { symbol: "Weight (kg)", description: "Horse body weight in kilograms" }
        ]
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires deworming with fenbendazole, a benzimidazole class drug with a recommended dose of 7.5 mg/kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 1100 lb ÷ 2.20462 = 499 kg (approx)."
          },
          {
            label: "2",
            explanation:
              "Calculate dose: 7.5 mg/kg × 499 kg = 3742.5 mg total fenbendazole dose."
          }
        ],
        result: "Administer approximately 3743 mg of fenbendazole to the horse."
      }}
      relatedCalculators={[
        {
          title: "Thermal Gradient Maintenance Power Estimator",
          url: "/pets/reptile-thermal-gradient-maintenance-power",
          icon: "🐾"
        },
        {
          title: "Egg Binding Risk Estimator",
          url: "/pets/bird-egg-binding-risk-estimator",
          icon: "🐶"
        },
        {
          title: "Vitamin D3 Requirement (Supplemental)",
          url: "/pets/reptile-vitamin-d3-requirement",
          icon: "🐱"
        },
        {
          title: "Fish Food Feeding Rate Calculator",
          url: "/pets/fish-food-feeding-rate",
          icon: "🍖"
        },
        {
          title: "Omega-3 Supplement Dose (for parrots)",
          url: "/pets/bird-omega-3-supplement-dose-parrots",
          icon: "💉"
        },
        {
          title: "Calcium Supplement Dosage (Breeding Females)",
          url: "/pets/bird-calcium-supplement-dosage-breeding-females",
          icon: "💧"
        }
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dewormer Dose Calculator (by Drug Class & Weight)" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}