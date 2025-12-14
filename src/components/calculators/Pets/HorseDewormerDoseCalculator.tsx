import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const DEWORMER_DOSES: Record<
  string,
  { doseMgPerKg: number; drugName: string; notes?: string }
> = {
  benzimidazoles: { doseMgPerKg: 7.5, drugName: "Benzimidazoles (e.g., Fenbendazole)" },
  tetrahydropyrimidines: { doseMgPerKg: 6.6, drugName: "Tetrahydropyrimidines (e.g., Pyrantel)" },
  macrocyclic_lactones: { doseMgPerKg: 0.2, drugName: "Macrocyclic Lactones (e.g., Ivermectin)" },
  praziquantel: { doseMgPerKg: 1.0, drugName: "Praziquantel" },
};

export default function HorseDewormerDoseCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    drugClass: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = inputs.weight.trim();
    const drugClass = inputs.drugClass;

    if (!weightRaw || !drugClass) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightNum = parseFloat(weightRaw);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive number for weight.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    const drugData = DEWORMER_DOSES[drugClass];
    if (!drugData) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Selected drug class is not supported.",
      };
    }

    // Dose calculation: Dose (mg) = Dose (mg/kg) * Weight (kg)
    const doseMg = drugData.doseMgPerKg * weightKg;

    // Round dose to 1 decimal place
    const doseRounded = Math.round(doseMg * 10) / 10;

    return {
      value: doseRounded,
      label: `Recommended dose of ${drugData.drugName} (mg)`,
      subtext: `Based on ${weightKg.toFixed(1)} kg horse weight`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate dewormer doses based on drug class and weight?",
      answer:
        "Calculating dewormer doses based on drug class and weight ensures the medication is both safe and effective. Different drug classes have varying potencies and mechanisms of action, so dosing must be tailored accordingly. Additionally, accurate weight-based dosing prevents underdosing, which can lead to resistance, or overdosing, which can cause toxicity.",
    },
    {
      question: "How does the horse's weight affect the dewormer dosage?",
      answer:
        "The horse's weight directly influences the amount of active drug required to achieve therapeutic effects. Since most dewormers are dosed in milligrams per kilogram of body weight, heavier horses require proportionally higher doses. Accurate weight measurement is critical to avoid ineffective treatment or potential side effects from incorrect dosing.",
    },
    {
      question: "Can I use this calculator for all types of dewormers?",
      answer:
        "This calculator covers the most commonly used drug classes in equine deworming, including benzimidazoles, tetrahydropyrimidines, macrocyclic lactones, and praziquantel. However, some specialized or compounded dewormers may require different dosing protocols. Always consult your veterinarian before administering any medication to ensure proper use.",
    },
    {
      question: "Why do I need to select the drug class when calculating the dose?",
      answer:
        "Each drug class has a unique recommended dose per kilogram due to differences in potency and pharmacodynamics. Selecting the correct drug class ensures the calculator applies the appropriate dosing factor. This specificity helps prevent dosing errors and promotes effective parasite control tailored to the medication used.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. WIDGET JSX
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
            Select Dewormer Drug Class
          </Label>
          <Select
            id="drugClass"
            value={inputs.drugClass}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, drugClass: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose drug class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="benzimidazoles">Benzimidazoles (e.g., Fenbendazole)</SelectItem>
              <SelectItem value="tetrahydropyrimidines">Tetrahydropyrimidines (e.g., Pyrantel)</SelectItem>
              <SelectItem value="macrocyclic_lactones">Macrocyclic Lactones (e.g., Ivermectin)</SelectItem>
              <SelectItem value="praziquantel">Praziquantel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger re-render, calculation is memoized on inputs change
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", drugClass: "" })}
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

  // 5. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dewormer Dose Calculator (by Drug Class & Weight)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Deworming is a critical aspect of equine health management, aimed at controlling internal parasites that can cause significant illness and performance issues. Different classes of deworming drugs, or anthelmintics, target various parasites and have distinct dosing requirements based on their pharmacological properties. This calculator helps horse owners and veterinarians determine the precise dose of dewormer needed by considering both the drug class and the horse's weight, ensuring safe and effective treatment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Accurate dosing is essential because underdosing can lead to parasite resistance, rendering treatments ineffective over time, while overdosing can cause toxicity and adverse reactions. The calculator uses scientifically established dose rates expressed in milligrams per kilogram of body weight, which is the standard veterinary dosing method. By inputting the horse’s weight and selecting the appropriate drug class, users receive a tailored dosage recommendation that aligns with veterinary best practices.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to support informed decision-making but does not replace professional veterinary advice. Always confirm the calculated dose with your veterinarian, especially when dealing with young, pregnant, or medically compromised horses. Proper parasite control, combined with strategic pasture management and regular fecal egg counts, forms the foundation of maintaining equine health and wellbeing.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed for ease of use by horse owners and veterinary professionals alike. Begin by selecting the unit system that corresponds to your preferred measurement—either imperial (pounds) or metric (kilograms). Next, enter the horse’s accurate weight in the chosen unit. Accurate weight measurement is crucial for precise dosing.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) to match your weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the horse’s weight in the input field. Use a scale or weight tape for accuracy.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the dewormer drug class you intend to use from the dropdown menu.
          </li>
          <li>
            <strong>Step 4:</strong> Click the “Calculate” button to receive the recommended dose in milligrams.
          </li>
          <li>
            <strong>Step 5:</strong> Review the result and consult your veterinarian before administering the medication.
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
              1. AAEP Parasite Control Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              American Association of Equine Practitioners provides comprehensive guidelines on equine parasite control and deworming protocols.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/horse-owners/parasites-of-horses/anthelmintics-for-horses"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Anthelmintics for Horses
            </a>
            <p className="text-slate-500 text-sm">
              Detailed information on drug classes, dosing, and resistance issues related to equine dewormers.
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
              Veterinary resource covering pharmacology and clinical use of anthelmintics in horses.
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
          { symbol: "Dose (mg)", description: "Total dose of dewormer to administer" },
          { symbol: "Dose (mg/kg)", description: "Recommended dose per kilogram for the drug class" },
          { symbol: "Weight (kg)", description: "Horse body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires treatment with a benzimidazole-class dewormer. The recommended dose is 7.5 mg/kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 1100 lb ÷ 2.20462 = 499.0 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Calculate dose: 7.5 mg/kg × 499.0 kg = 3742.5 mg total dose.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 3743 mg of the benzimidazole dewormer to the horse.",
          },
        ],
        result: "Recommended dose: 3743 mg of benzimidazole-class dewormer.",
      }}
      relatedCalculators={[
        { title: "Cat Harness Size & Fit Guide", url: "/pets/cat-harness-size-fit-guide", icon: "🐱" },
        { title: "Horse Gestation (Due Date) Calculator", url: "/pets/horse-gestation-due-date", icon: "🐎" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🐱" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
        { title: "Essential Oils Exposure Risk (diffuser/dermal)", url: "/pets/cat-essential-oils-exposure-risk", icon: "💉" },
        { title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)", url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dewormer Dose Calculator (by Drug Class & Weight)" },
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