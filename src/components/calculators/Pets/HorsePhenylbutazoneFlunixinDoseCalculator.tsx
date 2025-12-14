import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorsePhenylbutazoneFlunixinDoseCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight only, as dose is mg/kg * weight
  const [inputs, setInputs] = useState({
    weight: "",
    drug: "phenylbutazone",
  });

  // Dose ranges (mg/kg) based on veterinary references
  // Phenylbutazone: 2-4 mg/kg/day divided q12h (commonly 2.2 mg/kg q12h)
  // Flunixin meglumine: 1.1 mg/kg once daily (IV/IM/PO)
  // For simplicity, calculator will show total daily dose mg and mg/kg dose per administration

  // 2. LOGIC ENGINE
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

    let doseMgPerKg = 0;
    let doseMgTotal = 0;
    let doseFrequency = "";
    let drugName = "";
    let warning = null;

    if (inputs.drug === "phenylbutazone") {
      drugName = "Phenylbutazone";
      // Typical dose: 2.2 mg/kg q12h (4.4 mg/kg/day)
      doseMgPerKg = 2.2;
      doseFrequency = "every 12 hours (q12h)";
      doseMgTotal = doseMgPerKg * weightKg;
    } else if (inputs.drug === "flunixin") {
      drugName = "Flunixin meglumine";
      // Typical dose: 1.1 mg/kg once daily
      doseMgPerKg = 1.1;
      doseFrequency = "once daily";
      doseMgTotal = doseMgPerKg * weightKg;
    }

    // Round doses to 1 decimal place
    const doseMgPerKgRounded = doseMgPerKg.toFixed(1);
    const doseMgTotalRounded = doseMgTotal.toFixed(1);

    // Warning if weight is unusually high or low
    if (weightKg < 100) {
      warning =
        "Weight is low; ensure dosing is carefully adjusted and consult your veterinarian for precise guidance.";
    } else if (weightKg > 1000) {
      warning =
        "Weight is high; dosing should be confirmed with a veterinarian to avoid toxicity or underdosing.";
    }

    return {
      value: `${doseMgTotalRounded} mg (${doseMgPerKgRounded} mg/kg) ${doseFrequency}`,
      label: `${drugName} Dose`,
      subtext: `Based on a weight of ${weightKg.toFixed(1)} kg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to dose Phenylbutazone and Flunixin based on weight?",
      answer:
        "Dosing NSAIDs like Phenylbutazone and Flunixin according to the horse's weight ensures therapeutic effectiveness while minimizing the risk of toxicity. Horses vary widely in size, and an incorrect dose can lead to underdosing, which may not control pain or inflammation, or overdosing, which can cause serious side effects such as gastrointestinal ulcers or kidney damage. Accurate weight-based dosing is essential for safe and effective treatment.",
    },
    {
      question: "Can I use this calculator for other NSAIDs in horses?",
      answer:
        "This calculator is specifically designed for Phenylbutazone and Flunixin, as their dosing regimens and safety profiles differ from other NSAIDs. Using it for other drugs could result in inaccurate dosing recommendations. Always consult veterinary guidelines or your veterinarian for dosing other medications to ensure safety and efficacy.",
    },
    {
      question: "Why does the calculator provide doses in mg/kg and total mg?",
      answer:
        "Providing both mg/kg and total mg doses helps veterinarians and caretakers understand the precise amount of drug needed per kilogram of body weight and the overall dose to administer. This dual information aids in accurate measurement and preparation of the medication, especially when dealing with different formulations or concentrations. It also facilitates dose adjustments if the horse's weight changes.",
    },
    {
      question: "What precautions should I take when administering these NSAIDs to horses?",
      answer:
        "NSAIDs like Phenylbutazone and Flunixin should be administered under veterinary supervision, as improper use can cause adverse effects such as gastric ulcers, kidney damage, and bleeding disorders. It's important to avoid concurrent use of multiple NSAIDs and to monitor the horse for any signs of toxicity. Always follow dosing intervals and do not exceed recommended doses to ensure the horse's safety.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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

      {/* Drug selector */}
      <div className="space-y-2">
        <Label htmlFor="drug" className="text-slate-700 dark:text-slate-300">
          Select Drug
        </Label>
        <Select
          id="drug"
          value={inputs.drug}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, drug: value }))}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="phenylbutazone">Phenylbutazone</SelectItem>
            <SelectItem value="flunixin">Flunixin meglumine</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min={0}
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          aria-describedby="weightHelp"
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", drug: "phenylbutazone" })}
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
          Understanding Phenylbutazone / Flunixin Dose Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Phenylbutazone and Flunixin meglumine are commonly used non-steroidal anti-inflammatory drugs (NSAIDs) in equine medicine, primarily for managing pain, inflammation, and fever. Accurate dosing of these medications is critical because both underdosing and overdosing can lead to ineffective treatment or serious adverse effects. This calculator provides a reliable tool to estimate the appropriate dose based on the horse's weight, helping veterinarians and caretakers administer these drugs safely.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Phenylbutazone is often dosed at approximately 2.2 mg/kg every 12 hours, while Flunixin meglumine is typically given at 1.1 mg/kg once daily. These dosing regimens are derived from extensive veterinary research and clinical experience to maximize therapeutic benefits while minimizing risks such as gastrointestinal ulceration or renal toxicity. By inputting the horse's weight and selecting the drug, this calculator instantly provides the recommended dose in both mg/kg and total milligrams.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the pharmacokinetics and safety profile of these NSAIDs is essential for responsible use. This tool does not replace veterinary judgment but serves as an educational aid to support decision-making. Always consult a licensed veterinarian before administering any medication to ensure the health and safety of the animal.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide quick, accurate dosing information for Phenylbutazone and Flunixin meglumine based on your horse's weight. Begin by selecting the unit system that corresponds to how you measure your horse's weight, either Imperial (pounds) or Metric (kilograms). Next, choose the drug you intend to dose, then enter the horse's weight in the selected unit.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) to match your weight measurement method.
          </li>
          <li>
            <strong>Step 2:</strong> Choose the drug (Phenylbutazone or Flunixin meglumine) for which you want to calculate the dose.
          </li>
          <li>
            <strong>Step 3:</strong> Enter the horse's weight accurately in the input field.
          </li>
          <li>
            <strong>Step 4:</strong> Click "Calculate" to view the recommended dose expressed in mg/kg and total mg, along with dosing frequency.
          </li>
          <li>
            <strong>Step 5:</strong> Review any warnings or notes provided, and always consult your veterinarian before administering medication.
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
              href="https://www.merckvetmanual.com/musculoskeletal-system/anti-inflammatory-drugs/phenylbutazone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Phenylbutazone
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of Phenylbutazone pharmacology, dosing, and safety considerations in horses.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/musculoskeletal-system/anti-inflammatory-drugs/flunixin-meglumine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Flunixin Meglumine
            </a>
            <p className="text-slate-500 text-sm">
              Detailed information on Flunixin meglumine use, dosing guidelines, and adverse effects in equine patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://aaep.org/guidelines/anti-inflammatory-drugs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. American Association of Equine Practitioners (AAEP) Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based recommendations for NSAID use in horses, including dosing protocols and monitoring.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Phenylbutazone / Flunixin Dose Calculator"
      description="Calculate the safe dose for the NSAIDs **Phenylbutazone** and **Flunixin** for pain and fever management."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total drug dose to administer" },
          { symbol: "Weight (kg)", description: "Horse body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Recommended dose per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires Phenylbutazone for pain management. Calculate the dose using the recommended 2.2 mg/kg every 12 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 1100 lb ÷ 2.20462 = 499 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Calculate dose per administration: 2.2 mg/kg × 499 kg = 1097.8 mg per dose.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 1100 mg Phenylbutazone every 12 hours as per veterinary guidance.",
          },
        ],
        result: "Dose = 1100 mg every 12 hours (2.2 mg/kg q12h)",
      }}
      relatedCalculators={[
        {
          title: "Dehydration Risk Estimator (Skin Turgor + Mucous Check)",
          url: "/pets/horse-dehydration-risk-estimator",
          icon: "🐾",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
        {
          title: "Heat Risk/Walk Safety Window (Temp & Humidity)",
          url: "/pets/dog-heat-risk-walk-safety-window",
          icon: "🐱",
        },
        {
          title: "Benadryl (Diphenhydramine) Dose Calculator for Cats",
          url: "/pets/cat-benadryl-diphenhydramine-dose",
          icon: "🐱",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Cat Harness Size & Fit Guide",
          url: "/pets/cat-harness-size-fit-guide",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Phenylbutazone / Flunixin Dose Calculator" },
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