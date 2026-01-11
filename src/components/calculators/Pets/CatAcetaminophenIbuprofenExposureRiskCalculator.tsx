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

export default function CatAcetaminophenIbuprofenExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: Weight and Estimated Dose Ingested (mg)
  const [inputs, setInputs] = useState({
    weight: "",
    dose: "",
    medType: "acetaminophen",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const doseRaw = parseFloat(inputs.dose);
    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(doseRaw) || doseRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(weightRaw, unit);

    // Calculate mg/kg dose ingested
    const mgPerKg = doseRaw / weightKg;

    // Toxicity thresholds (approximate, species-specific)
    // Acetaminophen toxic dose for cats: ~50 mg/kg (severe toxicity)
    // Ibuprofen toxic dose for cats: ~25 mg/kg (severe toxicity)
    // We'll use these to categorize risk

    let toxicThreshold = 0;
    let medName = "";
    if (inputs.medType === "acetaminophen") {
      toxicThreshold = 50;
      medName = "Acetaminophen";
    } else {
      toxicThreshold = 25;
      medName = "Ibuprofen";
    }

    // Risk categorization
    let riskLevel = "";
    let warning = null;
    if (mgPerKg >= toxicThreshold) {
      riskLevel = "High Risk";
      warning =
        `The ingested dose of ${medName} is at or above the toxic threshold for cats. Immediate veterinary attention is critical to prevent severe poisoning and organ damage.`;
    } else if (mgPerKg >= toxicThreshold / 2) {
      riskLevel = "Moderate Risk";
      warning =
        `The ingested dose of ${medName} is concerning and may cause adverse effects. Veterinary consultation is strongly recommended to evaluate and manage potential toxicity.`;
    } else {
      riskLevel = "Low Risk";
      warning = null;
    }

    return {
      value: mgPerKg.toFixed(1),
      label: `Estimated Dose Ingested (mg/kg) - ${riskLevel}`,
      subtext: `Toxic threshold for ${medName} in cats is approximately ${toxicThreshold} mg/kg.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is acetaminophen so dangerous to cats?",
      answer:
        "Acetaminophen is highly toxic to cats because they lack the necessary liver enzymes to safely metabolize it. This leads to the accumulation of harmful metabolites that cause oxidative damage to red blood cells and liver tissue. Even small doses can result in severe poisoning, making prompt veterinary care essential if exposure occurs.",
    },
    {
      question: "How does ibuprofen affect cats differently than humans?",
      answer:
        "Ibuprofen can cause serious gastrointestinal irritation, kidney damage, and central nervous system effects in cats, even at doses much lower than those tolerated by humans. Cats metabolize ibuprofen poorly, which increases the risk of toxicity. Therefore, any accidental ingestion should be treated as an emergency requiring veterinary evaluation.",
    },
    {
      question: "What symptoms indicate my cat has ingested a toxic dose?",
      answer:
        "Symptoms of acetaminophen or ibuprofen toxicity in cats include vomiting, lethargy, difficulty breathing, swelling of the face or paws, and dark or discolored gums. These signs reflect internal damage and require immediate veterinary attention. Early recognition and treatment significantly improve the prognosis.",
    },
    {
      question: "Can I induce vomiting at home if my cat ingests these medications?",
      answer:
        "Inducing vomiting at home is generally not recommended without veterinary guidance because it can cause additional harm or be ineffective depending on the time since ingestion. Some medications may cause esophageal irritation or aspiration pneumonia if vomited improperly. Always contact a veterinarian or poison control center immediately for advice.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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

      {/* Medication Type */}
      <div className="space-y-2">
        <Label htmlFor="medType" className="text-slate-700 dark:text-slate-300">
          Medication Type
        </Label>
        <Select
          id="medType"
          value={inputs.medType}
          onValueChange={(value) => setInputs((prev) => ({ ...prev, medType: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="acetaminophen">Acetaminophen (Tylenol)</SelectItem>
            <SelectItem value="ibuprofen">Ibuprofen (Advil, Motrin)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat's Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={unit === "lb" ? "e.g. 8.5" : "e.g. 3.9"}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
        />
      </div>

      {/* Dose Input */}
      <div className="space-y-2">
        <Label htmlFor="dose" className="text-slate-700 dark:text-slate-300">
          Estimated Dose Ingested (mg)
        </Label>
        <Input
          id="dose"
          type="number"
          min="0"
          step="any"
          placeholder="e.g. 100"
          value={inputs.dose}
          onChange={(e) => setInputs((prev) => ({ ...prev, dose: e.target.value }))}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dose: "", medType: "acetaminophen" })}
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
          Understanding Acetaminophen/Ibuprofen Exposure Risk (human meds)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Acetaminophen and ibuprofen are common human pain relievers that pose significant toxicity risks to cats. Unlike humans, cats metabolize these drugs very poorly due to deficiencies in liver enzymes responsible for detoxification. This metabolic limitation means even small amounts can cause severe and potentially fatal damage to vital organs such as the liver and kidneys.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Acetaminophen toxicity primarily causes oxidative damage to red blood cells, leading to methemoglobinemia and anemia, while ibuprofen mainly induces gastrointestinal ulceration and kidney injury. Both medications can rapidly cause clinical signs such as vomiting, lethargy, difficulty breathing, and swelling. Early recognition and intervention are critical to improving outcomes in affected cats.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator estimates the risk level based on the estimated dose ingested relative to the cat’s weight, helping pet owners and veterinarians quickly assess the urgency of the situation. It is important to remember that any exposure should prompt immediate veterinary consultation, as individual sensitivity and clinical response can vary widely.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To use this tool, enter your cat’s weight and the estimated amount of acetaminophen or ibuprofen ingested. Select the medication type to ensure accurate risk assessment. The calculator will then provide an estimated dose per kilogram and categorize the exposure risk based on veterinary toxicology data.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the medication type your cat was exposed to—either acetaminophen or ibuprofen.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s weight in pounds or kilograms, depending on your preferred unit system.
          </li>
          <li>
            <strong>Step 3:</strong> Input the estimated total dose ingested in milligrams. This may require checking pill strength or packaging.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the estimated mg/kg dose and risk level. Follow any warnings and seek veterinary care immediately if risk is moderate or high.
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
              href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/acetaminophen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. ASPCA Animal Poison Control Center: Acetaminophen Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of acetaminophen poisoning in pets, including clinical signs and treatment protocols.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/ibuprofen-toxicity-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell Feline Health Center: Ibuprofen Toxicity in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of ibuprofen’s effects on cats, including toxic doses and emergency care recommendations.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/poisoning-by-drugs-and-chemicals/acetaminophen-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual: Acetaminophen Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary resource describing pathophysiology, clinical signs, and treatment of acetaminophen poisoning.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Acetaminophen/Ibuprofen Exposure Risk (human meds)"
      description="Alert tool for accidental exposure to common human pain relievers, particularly dangerous **Acetaminophen (Tylenol)**."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Exposure Risk = Dose Ingested (mg) ÷ Weight (kg)",
        variables: [
          { symbol: "Dose Ingested (mg)", description: "Total amount of medication ingested" },
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 9 lb (4.08 kg) cat accidentally ingests one 200 mg ibuprofen tablet. The owner wants to assess the risk of toxicity.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert the cat's weight to kilograms if needed (9 lb ÷ 2.20462 = 4.08 kg).",
          },
          {
            label: "2",
            explanation:
              "Calculate mg/kg dose: 200 mg ÷ 4.08 kg = 49 mg/kg.",
          },
          {
            label: "3",
            explanation:
              "Compare to ibuprofen toxic threshold (~25 mg/kg). Since 49 mg/kg > 25 mg/kg, this is a high-risk exposure requiring immediate veterinary care.",
          },
        ],
        result: "Estimated dose ingested is 49 mg/kg, indicating high risk of ibuprofen toxicity in this cat.",
      }}
      relatedCalculators={[
        { title: "Fish Food Feeding Rate Calculator", url: "/pets/fish-food-feeding-rate", icon: "🐾" },
        { title: "Horse Weight Estimator (Heart Girth & Length)", url: "/pets/horse-weight-estimator-girth-length", icon: "🐎" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
        { title: "Essential Oils Exposure Risk (diffuser/dermal)", url: "/pets/cat-essential-oils-exposure-risk", icon: "🍖" },
        { title: "Environmental Enrichment Planner (per room)", url: "/pets/cat-environmental-enrichment-planner", icon: "💉" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs", url: "/pets/dog-benadryl-diphenhydramine-dose", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Acetaminophen/Ibuprofen Exposure Risk (human meds)" },
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
