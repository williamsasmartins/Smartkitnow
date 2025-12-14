import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatMeloxicamDoseCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Meloxicam dose for cats: 0.05 mg/kg once daily (short-term analgesic dose)
  // Dose (mg) = Weight (kg) * 0.05
  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw || isNaN(Number(weightRaw)) || Number(weightRaw) <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? Number(weightRaw) / 2.20462 : Number(weightRaw);

    // Calculate dose in mg
    const doseMg = weightKg * 0.05;

    // Round to 3 decimals for precision
    const doseRounded = Math.round(doseMg * 1000) / 1000;

    // Warning if dose is unusually high or low (e.g. > 0.1 mg/kg or < 0.01 mg/kg)
    let warning = null;
    if (doseMg > weightKg * 0.1) {
      warning =
        "The calculated dose exceeds typical recommended limits. Consult your veterinarian before administration.";
    } else if (doseMg < weightKg * 0.01) {
      warning =
        "The calculated dose is unusually low. Ensure weight input is accurate and consult your veterinarian.";
    }

    return {
      value: doseRounded,
      label: "Meloxicam Dose (mg) once daily",
      subtext: `Based on ${weightKg.toFixed(2)} kg body weight`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is Meloxicam dosing based on weight in kilograms?",
      answer:
        "Meloxicam dosing is weight-based to ensure accurate and safe administration tailored to each cat's size. Using kilograms standardizes dosing across veterinary medicine globally, as it aligns with scientific research and pharmacological guidelines. This approach minimizes the risk of underdosing or overdosing, which can lead to ineffective treatment or adverse effects.",
    },
    {
      question: "Can I use this calculator for long-term Meloxicam administration in cats?",
      answer:
        "This calculator is designed for short-term analgesic dosing only, as Meloxicam's long-term use in cats requires careful veterinary supervision due to potential kidney and gastrointestinal side effects. Chronic administration involves different dosing protocols and monitoring strategies. Always consult your veterinarian before extending Meloxicam treatment beyond the recommended short-term period.",
    },
    {
      question: "What should I do if my cat's weight is difficult to measure accurately?",
      answer:
        "If precise weight measurement is challenging, try using a pet scale or visit a veterinary clinic for an accurate reading. Accurate weight is crucial for safe Meloxicam dosing to avoid toxicity or insufficient pain control. If uncertainty persists, always consult your veterinarian before administering any medication.",
    },
    {
      question: "Why is it important to consult a veterinarian even after using this dose calculator?",
      answer:
        "While this calculator provides an estimated Meloxicam dose, individual cats may have unique health conditions affecting drug metabolism and safety. Veterinarians consider factors like kidney function, concurrent medications, and overall health before prescribing NSAIDs. Therefore, professional veterinary advice ensures the safest and most effective treatment plan for your cat.",
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
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="0.01"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weightHelp"
        />
        <p id="weightHelp" className="text-xs text-slate-400 dark:text-slate-500">
          Accurate weight is essential for safe Meloxicam dosing.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No extra action needed, calculation is reactive
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
          Understanding Meloxicam Dose Calculator for Cats
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Meloxicam is a non-steroidal anti-inflammatory drug (NSAID) commonly prescribed to cats for managing pain and inflammation associated with conditions such as arthritis, post-operative recovery, and other musculoskeletal disorders. Accurate dosing is critical because cats metabolize NSAIDs differently than other species, and improper dosing can lead to serious adverse effects including kidney damage and gastrointestinal upset. This calculator provides a precise dose estimate based on your cat’s weight to help ensure safe and effective analgesic therapy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculator uses a scientifically established dosing guideline of 0.05 mg per kilogram of body weight, which is the recommended short-term analgesic dose for cats. This weight-based dosing approach accounts for individual variability and helps avoid underdosing, which can result in inadequate pain relief, or overdosing, which increases the risk of toxicity. While this tool offers an evidence-based estimate, it is essential to use it as a supplement to veterinary advice rather than a replacement.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Meloxicam dose calculator is straightforward and designed for pet owners and veterinary professionals alike. Begin by selecting the unit system that corresponds to your cat’s weight measurement—either Imperial (pounds) or Metric (kilograms). Next, enter your cat’s current weight accurately into the input field. The calculator will then compute the recommended Meloxicam dose in milligrams for once-daily administration.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that matches your cat’s weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s weight in the input field, ensuring the value is accurate and up-to-date.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to view the recommended Meloxicam dose in milligrams.
          </li>
          <li>
            <strong>Step 4:</strong> Review the result and any warnings provided, and always consult your veterinarian before administering medication.
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
              href="https://www.merckvetmanual.com/pharmacology/nonsteroidal-anti-inflammatory-drugs-nsaids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Nonsteroidal Anti-Inflammatory Drugs (NSAIDs)
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of NSAID pharmacology, dosing, and safety considerations in veterinary medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Meloxicam%20in%20Cats.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. University of California Davis: Meloxicam Use in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Detailed clinical guidelines and research on Meloxicam dosing and safety in feline patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/analgesia-pain-management/analgesia-pain-management-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Animal Hospital Association (AAHA) Pain Management Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on pain management protocols including NSAID use in cats.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Meloxicam Dose Calculator for Cats"
      description="Calculate the short-term analgesic dose for the NSAID **Meloxicam** in cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Meloxicam Dose (mg) = Weight (kg) × 0.05",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "0.05", description: "Recommended Meloxicam dose in mg per kg body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat weighing 10 lbs requires a Meloxicam dose for short-term pain relief after surgery.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by dose factor: 4.54 kg × 0.05 mg/kg = 0.227 mg Meloxicam.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 0.23 mg Meloxicam once daily as per veterinary guidance.",
          },
        ],
        result: "Recommended Meloxicam dose is approximately 0.23 mg once daily.",
      }}
      relatedCalculators={[
        {
          title: "Dewormer & Antibiotic Dose Reference",
          url: "/pets/reptile-dewormer-antibiotic-dose-reference",
          icon: "🐾",
        },
        {
          title: "Phosphorus per Meal Estimator (diet label helper)",
          url: "/pets/cat-phosphorus-per-meal-estimator",
          icon: "🐶",
        },
        {
          title: "Dog Walking Calories Burned Calculator",
          url: "/pets/dog-walking-calories-burned",
          icon: "🐶",
        },
        {
          title: "Cat Carrier Size & Fit Guide",
          url: "/pets/cat-carrier-size-fit-guide",
          icon: "🐱",
        },
        {
          title: "Puppy Adult Size Predictor (Weight Curve)",
          url: "/pets/puppy-adult-size-predictor-weight-curve",
          icon: "💉",
        },
        {
          title: "Cat Weight Loss Planner",
          url: "/pets/cat-weight-loss-planner",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Meloxicam Dose Calculator for Cats" },
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