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

export default function DogCaffeineToxicityCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    caffeineMg: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose of caffeine in dogs is approximately 20 mg/kg body weight (lowest reported toxic dose).
  // Severe toxicity and fatality risk increases at doses > 40 mg/kg.
  // We calculate mg/kg = total caffeine ingested (mg) / weight (kg)
  // Then classify risk level based on mg/kg.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const caffeineRaw = parseFloat(inputs.caffeineMg);
    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(caffeineRaw) || caffeineRaw <= 0) {
      return { value: 0, label: "Enter valid weight and caffeine amount..." };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // mg/kg caffeine dose
    const doseMgPerKg = caffeineRaw / weightKg;

    // Risk classification
    let label = "";
    let warning = null;

    if (doseMgPerKg < 10) {
      label = "Low risk of caffeine toxicity";
    } else if (doseMgPerKg >= 10 && doseMgPerKg < 20) {
      label = "Mild toxicity possible; monitor closely";
      warning =
        "Mild symptoms such as restlessness or mild gastrointestinal upset may occur. Veterinary consultation recommended.";
    } else if (doseMgPerKg >= 20 && doseMgPerKg < 40) {
      label = "Moderate toxicity likely; seek veterinary care";
      warning =
        "Signs such as vomiting, diarrhea, increased heart rate, and tremors may develop. Immediate veterinary attention advised.";
    } else {
      label = "Severe toxicity/fatal risk; emergency veterinary care needed";
      warning =
        "High risk of seizures, arrhythmias, and death. This is a medical emergency; seek veterinary care immediately.";
    }

    return {
      value: doseMgPerKg.toFixed(2),
      label,
      subtext: `Based on a caffeine dose of ${caffeineRaw} mg and dog weight of ${weightKg.toFixed(2)} kg.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is caffeine toxic to dogs and how does it affect their body?",
      answer:
        "Caffeine is a stimulant that affects the central nervous system and cardiovascular system. Dogs metabolize caffeine much slower than humans, leading to accumulation and toxicity. It causes increased heart rate, restlessness, tremors, seizures, and can lead to fatal arrhythmias. The toxic effects result from caffeine’s ability to block adenosine receptors and increase catecholamine release, overstimulating the nervous system.",
    },
    {
      question: "How is the toxic dose of caffeine determined for dogs?",
      answer:
        "The toxic dose is calculated based on the dog's body weight, expressed as milligrams of caffeine per kilogram (mg/kg). Veterinary toxicology studies have established that doses above 20 mg/kg can cause clinical signs of toxicity, while doses above 40 mg/kg pose severe risks. This weight-based dosing ensures accurate risk assessment tailored to each dog's size and metabolism.",
    },
    {
      question: "What are common sources of caffeine poisoning in dogs?",
      answer:
        "Dogs can ingest caffeine from various sources including coffee, tea, energy drinks, chocolate, certain medications, and caffeine-containing supplements. Accidental ingestion often occurs when dogs consume human beverages or foods left within reach. Understanding these sources helps pet owners prevent exposure and recognize potential poisoning incidents early.",
    },
    {
      question: "What should I do if I suspect my dog has ingested caffeine?",
      answer:
        "If caffeine ingestion is suspected, immediately contact a veterinarian or emergency animal poison control. Early intervention is critical to prevent severe toxicity. Treatment may involve inducing vomiting, administering activated charcoal to limit absorption, intravenous fluids, and medications to control symptoms like seizures or arrhythmias. Prompt veterinary care significantly improves outcomes.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

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
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>

        {/* Caffeine Input */}
        <div>
          <Label htmlFor="caffeineMg" className="text-slate-700 dark:text-slate-300">
            Estimated Caffeine Ingested (mg)
          </Label>
          <Input
            id="caffeineMg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter caffeine amount in milligrams"
            value={inputs.caffeineMg}
            onChange={(e) => handleInputChange("caffeineMg", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => setInputs((prev) => ({ ...prev }))}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", caffeineMg: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} mg/kg</p>
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
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Caffeine Toxicity Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The Dog Caffeine Toxicity Calculator is a specialized veterinary tool designed to estimate the risk of caffeine poisoning in dogs based on their body weight and the amount of caffeine ingested. Caffeine, a common stimulant found in coffee, tea, chocolate, and energy drinks, can be highly toxic to dogs even in small quantities due to their different metabolism compared to humans. This calculator helps pet owners and veterinary professionals quickly assess the potential severity of caffeine exposure by calculating the dose in milligrams per kilogram (mg/kg) of body weight, which is the standard veterinary toxicology metric.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the dose relative to the dog's weight is crucial because toxicity thresholds vary significantly with size. The calculator uses scientifically established toxic dose ranges to classify the risk level, from low risk to severe toxicity requiring emergency intervention. This approach allows for informed decision-making about when to seek veterinary care. By providing clear, evidence-based guidance, the calculator supports early recognition and management of caffeine poisoning, which can be life-saving given the rapid progression of symptoms in affected dogs.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using the Dog Caffeine Toxicity Calculator is straightforward and requires only two key pieces of information: your dog's weight and the estimated amount of caffeine ingested. First, select the unit system that corresponds to your preference or region—Imperial (pounds) or Metric (kilograms). Then, enter your dog's weight in the chosen unit. Next, input the total estimated caffeine amount your dog has consumed, measured in milligrams. This could be from coffee, tea, chocolate, or any other caffeine-containing product.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter the accurate weight of your dog. If unsure, use a recent veterinary measurement or weigh your dog using a reliable scale. The calculator converts units automatically if needed.
          </li>
          <li>
            <strong>Caffeine Amount:</strong> Estimate the total caffeine ingested in milligrams. For example, an average cup of coffee contains about 95 mg of caffeine. Use product labels or reliable sources to estimate this value as precisely as possible.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these values, click the Calculate button to receive an estimated caffeine dose per kilogram of body weight and a risk classification. The calculator will also provide warnings and recommendations based on veterinary toxicology guidelines. Always remember that this tool is for educational purposes and does not replace professional veterinary advice. If in doubt, seek immediate veterinary care.
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
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6466046/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Gwaltney-Brant SM. "Caffeine Toxicity in Dogs and Cats." Veterinary Clinics of North America: Small Animal Practice, 2019.
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive review of caffeine toxicity mechanisms, clinical signs, and treatment protocols in companion animals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.petpoisonhelpline.com/poison/caffeine/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Pet Poison Helpline - Caffeine Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource providing toxic dose thresholds, symptom descriptions, and emergency response guidelines for caffeine poisoning in pets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wsu.edu/outreach/Pet-Health-Topics/categories/toxicology/caffeine-toxicity-in-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Washington State University - Caffeine Toxicity in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Educational article detailing caffeine sources, toxic doses, clinical signs, and treatment options for dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/poisoning-in-dogs-and-cats/caffeine-and-theobromine-toxicity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Merck Veterinary Manual - Caffeine and Theobromine Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary manual entry describing pathophysiology, clinical signs, diagnosis, and treatment of caffeine poisoning.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Caffeine Toxicity Calculator"
      description="Estimate the toxic level risk from accidental ingestion of coffee, tea, or caffeine-containing products."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: mg/kg = total caffeine ingested (mg) ÷ dog weight (kg)
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg/kg) = Total Caffeine Ingested (mg) ÷ Dog Weight (kg)",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Caffeine dose per kilogram of dog's body weight" },
          { symbol: "Total Caffeine Ingested (mg)", description: "Amount of caffeine consumed by the dog in milligrams" },
          { symbol: "Dog Weight (kg)", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 22-pound (10 kg) dog accidentally drinks a cup of coffee containing approximately 95 mg of caffeine. The owner wants to assess the toxicity risk.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert the dog's weight to kilograms if needed (22 lbs ÷ 2.20462 = 10 kg).",
          },
          {
            label: "Step 2",
            explanation: "Calculate the caffeine dose per kg: 95 mg ÷ 10 kg = 9.5 mg/kg.",
          },
          {
            label: "Step 3",
            explanation:
              "Compare the dose to toxicity thresholds: 9.5 mg/kg is below the mild toxicity threshold (10 mg/kg), indicating low risk but monitoring is advised.",
          },
        ],
        result: "The dog is at low risk of caffeine toxicity but should be observed for any symptoms. Veterinary consultation is recommended if symptoms develop.",
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
        { id: "what-is", label: "Understanding Dog Caffeine Toxicity Calculator" },
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
