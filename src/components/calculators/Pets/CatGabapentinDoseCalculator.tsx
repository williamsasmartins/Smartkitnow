import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function CatGabapentinDoseCalculator() {
  // 1. STATE
  // Unit system default: imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Gabapentin dose for cats typically: 5-10 mg/kg every 8-12 hours
  // We'll calculate a recommended dose range based on weight.
  // Convert weight to kg if input is imperial.
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

    const weightKg = weightToKg(weightRaw, unit);

    // Dose range: 5 to 10 mg/kg
    const doseMin = (5 * weightKg).toFixed(1);
    const doseMax = (10 * weightKg).toFixed(1);

    // Display dose range in mg per dose
    const doseRange = `${doseMin} - ${doseMax} mg per dose`;

    // Warning if weight is outside typical range for cats (e.g. <1kg or >10kg)
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Weight entered is very low for a typical cat. Please verify the weight and consult your veterinarian before dosing.";
    } else if (weightKg > 10) {
      warning =
        "Weight entered is unusually high for a typical cat. Ensure accurate dosing by consulting your veterinarian.";
    }

    return {
      value: doseRange,
      label: "Recommended Gabapentin Dose Range",
      subtext: "Dose is per administration, typically every 8-12 hours.",
      warning,
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is Gabapentin dosing based on weight in cats?",
      answer:
        "Gabapentin dosing is weight-based because the drug’s efficacy and safety depend on the amount administered relative to the cat’s body mass. Cats metabolize medications differently, so precise dosing helps avoid underdosing, which may be ineffective, or overdosing, which can cause adverse effects. Weight-based dosing ensures a tailored approach for each individual cat’s needs.",
    },
    {
      question: "How often should Gabapentin be administered to cats?",
      answer:
        "Gabapentin is typically given every 8 to 12 hours in cats, depending on the condition being treated and veterinary guidance. This dosing interval maintains therapeutic drug levels in the bloodstream to manage nerve pain or sedation effectively. Always follow your veterinarian’s instructions, as frequency may vary based on your cat’s health status.",
    },
    {
      question: "Can I use this calculator for cats with kidney or liver disease?",
      answer:
        "Cats with kidney or liver disease may process Gabapentin differently, requiring dose adjustments to avoid toxicity. This calculator provides general dosing guidelines but cannot replace personalized veterinary advice. Always consult your veterinarian before administering Gabapentin to cats with underlying health conditions.",
    },
    {
      question: "What are the risks of incorrect Gabapentin dosing in cats?",
      answer:
        "Incorrect dosing of Gabapentin can lead to insufficient pain relief or sedation if underdosed, or serious side effects such as sedation, ataxia, or toxicity if overdosed. Because cats are sensitive to medications, precise dosing based on weight is critical to ensure safety. Always verify doses with a veterinarian to minimize risks.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  // 5. WIDGET JSX
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.weight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({ ...prev, weight: formatNumberForInput(nextWeight, 2) }));
              }
              setUnit(next);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight input */}
      <div>
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          name="weight"
          type="text"
          inputMode="decimal"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={handleInputChange}
          aria-describedby="weight-desc"
          className="mt-1"
        />
        <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Please enter your cat’s current body weight for accurate dosing.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            setInputs((prev) => ({ ...prev }));
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
              <p className="text-4xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized dosing recommendations.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Gabapentin Dose Calculator for Cats
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Gabapentin is a medication commonly prescribed in veterinary medicine to manage neuropathic pain, seizures, and provide sedation in cats. Because cats metabolize drugs differently than humans and other animals, precise dosing based on body weight is essential to ensure both efficacy and safety. This calculator helps pet owners and veterinary professionals estimate an appropriate gabapentin dose tailored to the individual cat’s weight.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The typical dosing range for gabapentin in cats is 5 to 10 milligrams per kilogram of body weight, administered every 8 to 12 hours depending on the clinical situation. This range allows for flexibility based on the severity of symptoms and the cat’s response to treatment. Overdosing can lead to sedation and ataxia, while underdosing may result in inadequate pain control, making accurate calculations critical.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool is designed to provide a quick, evidence-based estimate of gabapentin dosage to assist in clinical decision-making or owner education. However, it does not replace professional veterinary advice. Always consult your veterinarian before starting or adjusting any medication regimen for your cat to ensure safety and effectiveness.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide an accurate dose range based on your cat’s current weight. Begin by selecting the unit system that corresponds to how you measure your cat’s weight—either pounds (imperial) or kilograms (metric). Enter the weight value into the input field, ensuring it is as precise as possible for the best results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) from the dropdown menu.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s weight in the appropriate units. Use a scale for accuracy.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to view the recommended gabapentin dose range.
          </li>
          <li>
            <strong>Step 4:</strong> Review the results and any warnings. Consult your veterinarian before administering medication.
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
              href="https://www.merckvetmanual.com/pharmacology/anticonvulsant-drugs/gabapentin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Gabapentin
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of gabapentin pharmacology, dosing, and clinical use in veterinary medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Analgesics%20for%20Cats%20-%20Gabapentin.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. UC Davis Veterinary Medicine: Gabapentin Use in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Detailed clinical guidelines and dosing recommendations for gabapentin in feline patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4977029/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information: Gabapentin Pharmacokinetics in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Research article exploring gabapentin absorption, metabolism, and dosing in feline subjects.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Gabapentin Dose Calculator for Cats"
      description="Calculate the proper dosage for the nerve pain and sedation medication **Gabapentin** in cats by weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Gabapentin Dose (mg) = Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Recommended gabapentin dose per kilogram (5-10 mg/kg)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 9-pound (4.08 kg) cat requires gabapentin for neuropathic pain management. The veterinarian recommends a dose range of 5-10 mg/kg every 8 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the cat’s weight to kilograms if needed (9 lbs ÷ 2.20462 = 4.08 kg).",
          },
          {
            label: "2",
            explanation:
              "Calculate the minimum dose: 4.08 kg × 5 mg/kg = 20.4 mg per dose.",
          },
          {
            label: "3",
            explanation:
              "Calculate the maximum dose: 4.08 kg × 10 mg/kg = 40.8 mg per dose.",
          },
          {
            label: "4",
            explanation:
              "Administer between 20.4 mg and 40.8 mg every 8-12 hours as directed by the veterinarian.",
          },
        ],
        result: "Recommended gabapentin dose range: 20.4 - 40.8 mg per dose every 8-12 hours.",
      }}
      relatedCalculators={[
        { title: "Laminitis Risk Index (BCS + NSC intake)", url: "/pets/horse-laminitis-risk-index", icon: "🐾" },
        { title: "Daily Water Intake Checker for Cats", url: "/pets/cat-daily-water-intake-checker", icon: "🐱" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Gabapentin Dose Calculator for Cats" },
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
