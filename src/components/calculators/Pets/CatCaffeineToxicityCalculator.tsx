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

export default function CatCaffeineToxicityCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and caffeine amount
  const [inputs, setInputs] = useState({
    weight: "",
    caffeineAmount: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose threshold for caffeine in cats: ~20 mg/kg (lowest reported toxic dose)
  // Risk Score = (Caffeine Dose in mg) / (Weight in kg * 20 mg/kg)
  // Score > 1 indicates toxic risk
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const caffeineRaw = parseFloat(inputs.caffeineAmount);

    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(caffeineRaw) || caffeineRaw <= 0) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for weight and caffeine amount.",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Calculate risk score
    const toxicDoseMgPerKg = 20;
    const riskScore = caffeineRaw / (weightKg * toxicDoseMgPerKg);

    let label = "";
    let warning = null;

    if (riskScore < 0.1) {
      label = "Minimal risk of caffeine toxicity.";
    } else if (riskScore < 0.5) {
      label = "Low risk of caffeine toxicity. Monitor your cat closely.";
    } else if (riskScore < 1) {
      label = "Moderate risk of caffeine toxicity. Veterinary consultation recommended.";
      warning = "Potentially harmful caffeine exposure detected. Seek veterinary advice promptly.";
    } else {
      label = "High risk of caffeine toxicity! Immediate veterinary care required.";
      warning = "This caffeine dose is potentially life-threatening. Contact a veterinarian immediately.";
    }

    return {
      value: riskScore.toFixed(2),
      label,
      subtext: `Based on a toxic dose threshold of 20 mg/kg for cats.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is caffeine toxic to cats?",
      answer:
        "Cats metabolize caffeine much more slowly than humans, leading to accumulation of toxic levels in their system. Caffeine stimulates the central nervous system and cardiovascular system, which can cause symptoms ranging from restlessness and rapid breathing to seizures and cardiac arrest. Because cats are smaller and more sensitive, even small amounts can be dangerous, making awareness critical.",
    },
    {
      question: "How much caffeine is considered toxic for cats?",
      answer:
        "The lowest reported toxic dose of caffeine in cats is approximately 20 mg per kilogram of body weight. This means that a 5 kg cat could experience toxicity symptoms after ingesting around 100 mg of caffeine. However, individual sensitivity varies, so any caffeine ingestion should be treated cautiously and monitored closely.",
    },
    {
      question: "What are common sources of caffeine that cats might ingest?",
      answer:
        "Cats can be exposed to caffeine through coffee grounds, tea leaves, energy drinks, chocolate, certain medications, and even some dietary supplements. Because cats often explore their environment with their mouths, accidental ingestion of these substances is possible. Pet owners should keep all caffeine-containing products securely out of reach to prevent accidental poisoning.",
    },
    {
      question: "What should I do if I suspect my cat has ingested caffeine?",
      answer:
        "If you suspect caffeine ingestion, immediately contact your veterinarian or an emergency animal poison control center. Early symptoms include hyperactivity, vomiting, and increased heart rate, which can escalate quickly. Prompt veterinary intervention can prevent severe complications and improve the prognosis significantly.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

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
                setInputs((prev) => ({
                  ...prev,
                  weight: formatNumberForInput(nextWeight, 2),
                }));
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat's Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={unit === "lb" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your cat's current body weight.
          </p>
        </div>

        <div>
          <Label htmlFor="caffeineAmount" className="text-slate-700 dark:text-slate-300">
            Estimated Caffeine Amount (mg)
          </Label>
          <Input
            id="caffeineAmount"
            name="caffeineAmount"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 50"
            value={inputs.caffeineAmount}
            onChange={handleInputChange}
            aria-describedby="caffeine-desc"
          />
          <p id="caffeine-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the estimated caffeine ingested from all sources.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", caffeineAmount: "" })}
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
          Understanding Caffeine Toxicity Risk for Cats
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Caffeine is a potent stimulant that affects the central nervous and cardiovascular systems. Cats are particularly sensitive to caffeine because their bodies metabolize it much more slowly than humans, leading to prolonged toxic effects. Even small amounts of caffeine can cause serious health issues, including tremors, seizures, and cardiac arrhythmias. Understanding the risk factors and toxic thresholds is essential for preventing accidental poisoning.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The toxic dose of caffeine in cats is estimated to be around 20 mg per kilogram of body weight, but individual sensitivity varies. Sources of caffeine exposure include coffee grounds, tea, chocolate, energy drinks, and certain medications. Because cats often explore their environment with their mouths, accidental ingestion is a common risk, especially in multi-pet households or homes with children. Early recognition and intervention can save lives.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the risk of caffeine toxicity in cats based on their weight and the estimated amount of caffeine ingested. By inputting your cat’s weight and the caffeine dose, you can assess whether the exposure is likely to be harmful. The tool uses a scientifically supported toxic dose threshold to provide a risk score and guidance.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that matches your cat’s weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s current weight accurately to ensure correct risk calculation.
          </li>
          <li>
            <strong>Step 3:</strong> Input the total estimated caffeine amount ingested in milligrams from all sources.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the risk score and interpret the results carefully. If the risk is moderate or high, seek veterinary advice immediately.
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
              href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/caffeine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. ASPCA Animal Poison Control Center: Caffeine Toxicity in Pets
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of caffeine poisoning symptoms, toxic doses, and emergency treatment protocols for cats and other pets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/caffeine-and-theobromine-poisoning/caffeine-and-theobromine-poisoning-in-animals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Caffeine and Theobromine Poisoning
            </a>
            <p className="text-slate-500 text-sm">
              Detailed veterinary reference on the pathophysiology, clinical signs, and treatment of caffeine toxicity in small animals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/caffeine-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center: Caffeine Toxicity in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource focused on feline-specific caffeine toxicity risks, prevention, and emergency care recommendations.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Caffeine Toxicity Risk for Cats"
      description="Estimate the toxic exposure risk from caffeine in products like coffee grounds, tea, or energy drinks."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Risk Score = Caffeine Dose (mg) ÷ (Weight (kg) × 20 mg/kg)",
        variables: [
          { symbol: "Caffeine Dose (mg)", description: "Total caffeine ingested in milligrams" },
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "20 mg/kg", description: "Estimated toxic dose threshold for caffeine in cats" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat accidentally ingests 100 mg of caffeine from spilled coffee grounds.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate risk score: 100 mg ÷ (4.54 kg × 20 mg/kg) = 100 ÷ 90.8 = 1.10.",
          },
          {
            label: "3",
            explanation:
              "Since the risk score is above 1, this indicates a high risk of caffeine toxicity requiring immediate veterinary care.",
          },
        ],
        result: "Risk Score = 1.10 (High risk - seek emergency veterinary attention)",
      }}
      relatedCalculators={[
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "🐾" },
        { title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)", url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko", icon: "🐶" },
        { title: "Horse Colic Risk Assessment (Feeding & Management)", url: "/pets/horse-colic-risk-assessment", icon: "🐎" },
        { title: "Horse Body Condition Score Helper (Henneke 1–9)", url: "/pets/horse-body-condition-score-henneke", icon: "🐎" },
        { title: "Horse NSAID Overdose Risk (Phenylbutazone)", url: "/pets/horse-nsaid-overdose-risk", icon: "🐎" },
        { title: "Daily Water Requirement per Weight", url: "/pets/bird-daily-water-requirement-per-weight", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Caffeine Toxicity Risk for Cats" },
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
