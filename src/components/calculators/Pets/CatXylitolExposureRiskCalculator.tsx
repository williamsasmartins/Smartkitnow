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

export default function CatXylitolExposureRiskCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: Cat weight and xylitol amount ingested (mg)
  const [inputs, setInputs] = useState({
    weight: "",
    xylitolMg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const xylitolRaw = parseFloat(inputs.xylitolMg);
    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(xylitolRaw) || xylitolRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial (lbs)
    const weightKg = weightToKg(weightRaw, unit);

    // Toxic dose threshold for xylitol in cats is not well established but considered very low.
    // For educational purposes, use a conservative threshold of 50 mg/kg as potential risk.
    // Risk Score = Xylitol dose (mg) / (Weight (kg) * 50 mg/kg)
    // Score > 1 indicates potential toxic exposure.

    const riskScore = xylitolRaw / (weightKg * 50);

    let label = "";
    let warning = null;
    if (riskScore < 0.2) {
      label = "Minimal Risk";
    } else if (riskScore < 1) {
      label = "Low to Moderate Risk";
      warning = "Monitor your cat closely and consult a veterinarian if symptoms appear.";
    } else {
      label = "High Risk of Xylitol Toxicity";
      warning =
        "Immediate veterinary attention is strongly recommended. Xylitol can cause severe hypoglycemia and liver failure in cats.";
    }

    return {
      value: riskScore.toFixed(2),
      label,
      subtext: `Based on a toxic threshold of 50 mg/kg xylitol exposure.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is xylitol exposure rare but still important to understand in cats?",
      answer:
        "Xylitol poisoning is well-documented in dogs but is considered rare in cats due to their less frequent exposure to xylitol-containing products. However, cats are still susceptible to its toxic effects, including hypoglycemia and liver damage. Understanding this risk is crucial for early recognition and prevention, especially as xylitol use in human foods and dental products increases.",
    },
    {
      question: "How does xylitol cause toxicity in cats?",
      answer:
        "Xylitol triggers a rapid release of insulin in cats, similar to dogs, leading to a dangerous drop in blood sugar levels (hypoglycemia). This insulin surge can cause weakness, seizures, and even coma. Additionally, xylitol may cause liver failure, which can be fatal if not treated promptly, making early detection and veterinary intervention vital.",
    },
    {
      question: "What are the signs of xylitol poisoning in cats to watch for?",
      answer:
        "Symptoms typically appear within 30 minutes to a few hours after ingestion and include vomiting, lethargy, weakness, loss of coordination, seizures, and collapse. Because these signs can mimic other illnesses, any suspected xylitol exposure should prompt immediate veterinary evaluation. Early treatment improves prognosis significantly.",
    },
    {
      question: "How can I prevent xylitol poisoning in my cat?",
      answer:
        "Preventing exposure is the best defense; keep all xylitol-containing products such as sugar-free gum, candies, baked goods, and dental products out of your cat’s reach. Educate household members and guests about the dangers of xylitol. If accidental ingestion occurs, seek veterinary care immediately regardless of the amount ingested.",
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

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Cat Weight ({unit === "lb" ? "lbs" : "kg"})
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
        <div>
          <Label htmlFor="xylitolMg" className="text-slate-700 dark:text-slate-300">
            Estimated Xylitol Amount Ingested (mg)
          </Label>
          <Input
            id="xylitolMg"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={inputs.xylitolMg}
            onChange={(e) => setInputs((prev) => ({ ...prev, xylitolMg: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", xylitolMg: "" })}
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
          Understanding Xylitol Exposure Risk for Cats (rare but educational)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Xylitol is a sugar alcohol commonly used as a sweetener in sugar-free gums, candies, baked goods, and dental products. While xylitol toxicity is well-known in dogs, exposure in cats is rare but still possible and potentially dangerous. Cats may accidentally ingest xylitol-containing products, leading to serious health consequences despite the lower incidence compared to dogs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The toxic effects of xylitol in cats primarily involve a rapid release of insulin, causing hypoglycemia, which can manifest as weakness, seizures, or even coma. Additionally, xylitol may induce liver failure, a life-threatening complication. Because cats metabolize substances differently and have unique sensitivities, understanding the risk and recognizing early symptoms is critical for timely veterinary intervention.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator provides an educational estimate of the potential risk based on the amount of xylitol ingested relative to the cat’s body weight. Given the limited research on exact toxic doses in cats, this tool uses a conservative threshold to help pet owners and veterinary professionals assess exposure severity and decide when urgent care is necessary.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          To estimate the risk of xylitol exposure in your cat, enter the cat’s weight and the estimated amount of xylitol ingested in milligrams. Select the appropriate unit system for weight input (imperial or metric). The calculator will then provide a risk score based on a conservative toxic dose threshold, helping you understand the severity of the exposure.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter your cat’s weight accurately, choosing pounds or kilograms depending on your preference.
          </li>
          <li>
            <strong>Step 2:</strong> Estimate the amount of xylitol ingested in milligrams. This may require checking product labels or estimating based on the quantity consumed.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to view the risk score and interpretation. Follow any warnings and seek veterinary care if the risk is moderate or high.
          </li>
          <li>
            <strong>Step 4:</strong> Use the reset button to clear inputs and assess additional scenarios if needed.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151201/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Xylitol Toxicity in Dogs and Cats: A Review
            </a>
            <p className="text-slate-500 text-sm">
              This peer-reviewed article discusses the mechanisms, clinical signs, and treatment of xylitol poisoning in companion animals, emphasizing the rarity but severity of cases in cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/xylitol-toxicity-in-pets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals: Xylitol Toxicity in Pets
            </a>
            <p className="text-slate-500 text-sm">
              A trusted veterinary resource outlining symptoms, diagnosis, and emergency care recommendations for xylitol ingestion in dogs and cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petpoisonhelpline.com/poison/xylitol/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Pet Poison Helpline: Xylitol Poisoning
            </a>
            <p className="text-slate-500 text-sm">
              Provides detailed information on xylitol toxicity, including clinical signs and treatment protocols, with notes on species differences including cats.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Xylitol Exposure Risk for Cats (rare but educational)"
      description="Educational tool detailing the severe risk of Xylitol poisoning, even though cat exposure is less frequent."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Risk Score = Xylitol Dose (mg) ÷ (Weight (kg) × 50 mg/kg)",
        variables: [
          { symbol: "Xylitol Dose (mg)", description: "Amount of xylitol ingested in milligrams" },
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "50 mg/kg", description: "Conservative toxic threshold for xylitol in cats" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4.5 kg cat ingests approximately 150 mg of xylitol from a sugar-free gum piece left unattended.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the toxic threshold: 4.5 kg × 50 mg/kg = 225 mg is the estimated toxic dose.",
          },
          {
            label: "2",
            explanation:
              "Calculate risk score: 150 mg ÷ 225 mg = 0.67, indicating a low to moderate risk of toxicity.",
          },
          {
            label: "3",
            explanation:
              "Monitor the cat closely and seek veterinary advice promptly due to potential hypoglycemia risk.",
          },
        ],
        result: "Risk Score: 0.67 (Low to Moderate Risk) - Veterinary consultation recommended.",
      }}
      relatedCalculators={[
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
        { title: "Dog BMI/Body Index (educational)", url: "/pets/dog-bmi-body-index-educational", icon: "🐶" },
        { title: "Dog Body Condition Score Helper (BCS → Target Plan)", url: "/pets/dog-body-condition-score-bcs-target", icon: "🐶" },
        { title: "Gabapentin Dose Calculator for Cats", url: "/pets/cat-gabapentin-dose", icon: "🐱" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Cat Onion/Garlic Toxicity Calculator", url: "/pets/cat-onion-garlic-toxicity", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Xylitol Exposure Risk for Cats (rare but educational)" },
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
