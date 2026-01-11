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

export default function DogMacadamiaNutToxicityCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    nutsConsumed: "",
  });

  // 2. LOGIC ENGINE
  /**
   * Veterinary literature indicates that macadamia nut toxicity in dogs can occur at doses as low as 2.4 grams per kilogram of body weight.
   * Symptoms typically appear within 12 hours and include weakness, ataxia, tremors, and hyperthermia.
   * This calculator estimates the risk level based on the dog's weight and the amount of macadamia nuts ingested.
   * 
   * Formula:
   * Dose (g/kg) = Total grams of nuts consumed / Dog's weight in kg
   * Toxicity threshold = 2.4 g/kg (lowest reported toxic dose)
   * 
   * Risk assessment:
   * - Dose < 2.4 g/kg: Low risk, monitor closely.
   * - Dose ≥ 2.4 g/kg and < 5 g/kg: Moderate risk, veterinary consultation recommended.
   * - Dose ≥ 5 g/kg: High risk, immediate veterinary care advised.
   */
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const nutsRaw = parseFloat(inputs.nutsConsumed);
    if (!weightRaw || weightRaw <= 0 || !nutsRaw || nutsRaw <= 0)
      return { value: 0, label: "Enter valid details...", subtext: null, warning: null };

    const weightKg = weightToKg(weightRaw, unit);

    // Dose in grams per kg
    const dose = nutsRaw / weightKg;

    // Risk assessment
    let riskLabel = "";
    let warning = null;

    if (dose < 2.4) {
      riskLabel = "Low Risk: Monitor your dog closely for symptoms.";
    } else if (dose >= 2.4 && dose < 5) {
      riskLabel = "Moderate Risk: Veterinary consultation is recommended.";
      warning = "Symptoms may develop; early veterinary intervention can improve outcomes.";
    } else {
      riskLabel = "High Risk: Immediate veterinary care is necessary!";
      warning = "Severe toxicity likely; do not delay seeking emergency veterinary attention.";
    }

    return {
      value: dose.toFixed(2),
      label: `${riskLabel} (Dose: ${dose.toFixed(2)} g/kg)`,
      subtext:
        "Macadamia nut toxicity threshold is approximately 2.4 g/kg body weight. This calculator estimates exposure risk based on ingestion.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why are macadamia nuts toxic to dogs, and what causes the symptoms?",
      answer:
        "Macadamia nuts contain an unknown toxin that affects the neuromuscular system of dogs, causing symptoms such as weakness, tremors, and hyperthermia. The exact toxic compound has not been isolated, but ingestion leads to transient dysfunction of peripheral nerves and muscles. Understanding this helps owners recognize the seriousness and seek timely veterinary care.",
    },
    {
      question: "How quickly do symptoms of macadamia nut toxicity appear in dogs?",
      answer:
        "Symptoms typically develop within 12 hours after ingestion, although onset can vary between 1 to 12 hours. Early signs include weakness and hind limb tremors, progressing to difficulty walking and elevated body temperature. Prompt recognition and monitoring during this window are critical for effective treatment and recovery.",
    },
    {
      question: "Can small amounts of macadamia nuts cause toxicity in all dogs?",
      answer:
        "Toxicity depends on the dose relative to the dog's body weight, with doses as low as 2.4 grams per kilogram causing symptoms. Smaller dogs are more susceptible due to lower body mass. However, some dogs may tolerate very small amounts without symptoms. Because individual sensitivity varies, any ingestion should be treated cautiously.",
    },
    {
      question: "What veterinary treatments are available for dogs exposed to macadamia nuts?",
      answer:
        "Treatment is primarily supportive and symptomatic, including intravenous fluids, pain management, and temperature control. Activated charcoal may be administered if ingestion was recent to reduce absorption. Most dogs recover fully within 48 hours with proper care, but severe cases require hospitalization and close monitoring.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog's Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter dog's weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accurate weight is essential for toxicity risk calculation.
          </p>
        </div>

        {/* Nuts Consumed Input */}
        <div>
          <Label htmlFor="nutsConsumed" className="text-slate-700 dark:text-slate-300">
            Estimated Macadamia Nuts Consumed (grams)
          </Label>
          <Input
            id="nutsConsumed"
            name="nutsConsumed"
            type="number"
            min="0"
            step="any"
            placeholder="Enter total grams of macadamia nuts ingested"
            value={inputs.nutsConsumed}
            onChange={handleInputChange}
            aria-describedby="nuts-desc"
          />
          <p id="nuts-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weigh or estimate the total grams of nuts your dog ate.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", nutsConsumed: "" })}
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
                Estimated Toxic Dose
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} g/kg</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Macadamia Nut Toxicity Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Macadamia nut toxicity is a well-documented condition in dogs that results from ingestion of macadamia nuts or products containing them. Although the exact toxic compound remains unidentified, clinical signs such as hind limb weakness, tremors, and hyperthermia are consistently observed. This toxicity is dose-dependent, meaning the severity correlates with the amount ingested relative to the dog's body weight. Understanding this relationship is critical for assessing risk and determining the urgency of veterinary intervention.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The Dog Macadamia Nut Toxicity Calculator uses established veterinary toxicology data to estimate the dose of macadamia nuts ingested per kilogram of the dog's body weight. This dose is then compared against known toxicity thresholds to categorize risk levels. By inputting your dog's weight and the estimated grams of nuts consumed, you can receive an evidence-based assessment of potential toxicity. This tool is designed to empower pet owners with knowledge but does not replace professional veterinary advice.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Early recognition of macadamia nut poisoning is essential because symptoms can develop rapidly, often within hours. While most dogs recover fully with supportive care, severe cases require prompt veterinary attention to prevent complications. This calculator also educates users on the importance of monitoring and when to seek emergency care, making it a valuable resource for both prevention and early response.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and requires two key pieces of information: your dog's current weight and the estimated amount of macadamia nuts ingested. Begin by selecting the unit system you prefer—imperial (pounds) or metric (kilograms). Then, enter your dog's weight accordingly. Next, estimate the total grams of macadamia nuts your dog has consumed. If you are unsure, try to weigh the nuts or approximate based on packaging information.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog's Weight:</strong> Enter the accurate weight of your dog. This is crucial because toxicity is dose-dependent and calculated per kilogram of body weight.
          </li>
          <li>
            <strong>Macadamia Nuts Consumed:</strong> Input the total grams of macadamia nuts ingested. This includes whole nuts, pieces, or foods containing macadamia nuts.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these values, click the "Calculate" button to receive an estimated toxic dose and risk assessment. The result will guide you on whether to monitor your dog at home or seek immediate veterinary care. Remember, this tool is for educational purposes and should not replace professional veterinary evaluation.
        </p>
      </section>

      {/* SECTION 3: FAQ */}
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

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">Veterinary References</h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4594205/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Gwaltney-Brant SM. "Macadamia Nut Toxicity in Dogs." Veterinary Clinics of North America: Small Animal Practice, 2015.
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review of clinical signs, toxic doses, and treatment protocols for macadamia nut poisoning in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petpoisonhelpline.com/poison/macaroni-nuts/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Pet Poison Helpline. "Macadamia Nut Toxicity." 2023.
            </a>
            <p className="text-slate-500 text-sm">
              Up-to-date toxicology information and emergency response guidelines for macadamia nut ingestion in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wsu.edu/outreach/Pet-Health-Topics/categories/dog-health/toxicities/macadamia-nut-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Washington State University. "Macadamia Nut Toxicity in Dogs."
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource detailing clinical presentation and management of macadamia nut poisoning.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.veterinarypartner.com/Content.plx?P=A&A=2796"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Veterinary Partner. "Macadamia Nut Toxicity in Dogs."
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidance for pet owners and veterinarians on recognizing and treating macadamia nut toxicity.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Macadamia Nut Toxicity Calculator"
      description="Assess the risk of macadamia nut poisoning, which causes severe weakness and elevated body temperature."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: "Dose (g/kg) = Total grams of macadamia nuts consumed ÷ Dog's weight in kilograms",
        variables: [
          { symbol: "Dose (g/kg)", description: "Estimated toxic dose per kilogram of dog's body weight" },
          { symbol: "Total grams of macadamia nuts consumed", description: "Weight of nuts ingested by the dog in grams" },
          { symbol: "Dog's weight in kilograms", description: "Body weight of the dog in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) dog ingests approximately 30 grams of macadamia nuts from a spilled snack bag.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the dog's weight to kilograms if using imperial units: 20 lbs ÷ 2.20462 = 9.07 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the dose: 30 grams ÷ 9.07 kg = 3.31 g/kg, which exceeds the 2.4 g/kg toxicity threshold.",
          },
          {
            label: "Step 3",
            explanation:
              "Interpret the result: 3.31 g/kg indicates moderate risk; veterinary consultation is recommended.",
          },
        ],
        result:
          "The dog is at moderate risk of macadamia nut toxicity and should be monitored closely with prompt veterinary evaluation advised.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Macadamia Nut Toxicity Calculator" },
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
