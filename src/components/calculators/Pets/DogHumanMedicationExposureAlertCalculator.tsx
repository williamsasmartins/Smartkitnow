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

export default function DogHumanMedicationExposureAlertCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    medication: "ibuprofen",
    doseTaken: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose thresholds (mg/kg) for dogs:
  // Ibuprofen: toxic dose ~ 50 mg/kg (mild toxicity), severe toxicity > 100 mg/kg
  // Acetaminophen: toxic dose ~ 75 mg/kg (mild toxicity), severe toxicity > 100 mg/kg
  // These are approximate and vary by source; always consult a vet.
  // This calculator alerts if the ingested dose exceeds mild toxicity threshold.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const doseTakenRaw = parseFloat(inputs.doseTaken);
    if (!weightRaw || weightRaw <= 0) {
      return { value: 0, label: "Enter valid dog weight", subtext: null, warning: null };
    }
    if (!doseTakenRaw || doseTakenRaw <= 0) {
      return { value: 0, label: "Enter valid medication dose taken", subtext: null, warning: null };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Calculate mg/kg dose ingested by dog
    const mgPerKgDose = doseTakenRaw / weightKg;

    // Define toxic thresholds per medication
    let mildToxicDose = 0;
    let severeToxicDose = 0;
    let medName = "";
    if (inputs.medication === "ibuprofen") {
      mildToxicDose = 50;
      severeToxicDose = 100;
      medName = "Ibuprofen";
    } else if (inputs.medication === "acetaminophen") {
      mildToxicDose = 75;
      severeToxicDose = 100;
      medName = "Acetaminophen";
    } else {
      return { value: 0, label: "Select a valid medication", subtext: null, warning: null };
    }

    // Determine toxicity level
    let toxicityLabel = "Dose below toxic threshold";
    let warning = null;
    if (mgPerKgDose >= severeToxicDose) {
      toxicityLabel = "Severe toxicity risk! Immediate veterinary care required.";
      warning =
        "This dose exceeds the severe toxicity threshold. Immediate veterinary attention is critical to prevent life-threatening complications.";
    } else if (mgPerKgDose >= mildToxicDose) {
      toxicityLabel = "Mild to moderate toxicity risk. Veterinary consultation recommended.";
      warning =
        "This dose exceeds the mild toxicity threshold. Contact your veterinarian promptly for advice and possible treatment.";
    }

    return {
      value: mgPerKgDose.toFixed(1),
      label: `${medName} dose ingested (mg/kg)`,
      subtext: toxicityLabel,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is Ibuprofen toxic to dogs and how does it affect them?",
      answer:
        "Ibuprofen is a non-steroidal anti-inflammatory drug (NSAID) designed for human use and can cause severe toxicity in dogs because their metabolism differs significantly from humans. Dogs are unable to efficiently metabolize ibuprofen, leading to accumulation and damage primarily to the gastrointestinal tract and kidneys. Toxicity can result in vomiting, diarrhea, ulcers, kidney failure, and even death if untreated. Immediate veterinary intervention is crucial to mitigate these effects.",
    },
    {
      question: "How does Acetaminophen poisoning manifest in dogs and why is it dangerous?",
      answer:
        "Acetaminophen (Tylenol) is highly toxic to dogs because it causes oxidative damage to red blood cells and liver cells. This can lead to methemoglobinemia, where oxygen delivery to tissues is impaired, and acute liver failure. Symptoms include weakness, difficulty breathing, swelling of the face or paws, and jaundice. Even small doses can be dangerous, so any suspected ingestion requires urgent veterinary evaluation and treatment to prevent fatal outcomes.",
    },
    {
      question: "How is the toxic dose of these medications calculated for dogs?",
      answer:
        "The toxic dose is calculated based on the dog's body weight in kilograms and the amount of medication ingested in milligrams. The formula used is mg/kg = total mg ingested ÷ dog’s weight in kg. This calculation helps determine if the dose exceeds known toxicity thresholds. Veterinarians use these thresholds to assess risk and decide on treatment urgency. Accurate weight measurement is essential for reliable calculations.",
    },
    {
      question: "What immediate steps should I take if my dog ingests Ibuprofen or Acetaminophen?",
      answer:
        "If you suspect your dog has ingested ibuprofen or acetaminophen, act quickly by contacting your veterinarian or an emergency animal poison control center. Do not induce vomiting or administer any treatments without professional guidance, as improper actions can worsen the situation. Provide details such as the amount ingested, time of ingestion, and your dog’s weight. Early veterinary intervention can significantly improve prognosis and reduce complications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Dog Weight ({unit === "lb" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min={0}
              step="any"
              placeholder={`Enter dog weight in ${unit === "lb" ? "lbs" : "kg"}`}
              value={inputs.weight}
              onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="medication" className="text-slate-700 dark:text-slate-300">
              Medication
            </Label>
            <Select
              value={inputs.medication}
              onValueChange={(value) => setInputs({ ...inputs, medication: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ibuprofen">Ibuprofen</SelectItem>
                <SelectItem value="acetaminophen">Acetaminophen (Tylenol)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doseTaken" className="text-slate-700 dark:text-slate-300">
              Estimated Dose Taken (mg)
            </Label>
            <Input
              id="doseTaken"
              type="number"
              min={0}
              step="any"
              placeholder="Enter amount ingested in mg"
              value={inputs.doseTaken}
              onChange={(e) => setInputs({ ...inputs, doseTaken: e.target.value })}
            />
          </div>
        </div>
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
          onClick={() => setInputs({ weight: "", medication: "ibuprofen", doseTaken: "" })}
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
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Accidental ingestion of human medications like ibuprofen and acetaminophen by dogs is a common and potentially life-threatening emergency. These drugs, while safe for humans at therapeutic doses, are metabolized very differently by dogs, often resulting in toxic effects even at relatively low doses. Ibuprofen, a non-steroidal anti-inflammatory drug (NSAID), can cause severe gastrointestinal irritation, kidney damage, and central nervous system effects in dogs. Acetaminophen, commonly known as Tylenol, is particularly dangerous because it induces oxidative damage to red blood cells and liver cells, leading to anemia and liver failure.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the toxic dose thresholds and the clinical signs of poisoning is critical for early recognition and intervention. Toxicity depends on the amount ingested relative to the dog’s body weight, which is why calculating the mg/kg dose is essential. This calculator helps pet owners and veterinary professionals estimate the potential toxicity risk based on the dog's weight and the amount of medication ingested. However, it is important to remember that individual sensitivity varies, and any suspected ingestion should prompt immediate veterinary consultation.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to help estimate the toxicity risk of ibuprofen or acetaminophen ingestion in dogs by calculating the dose per kilogram of body weight. To use it effectively, follow these steps carefully to ensure accurate inputs and meaningful results.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog’s current weight in pounds (lbs) or kilograms (kg), depending on your preferred unit system. Accurate weight measurement is crucial as the toxicity thresholds are weight-dependent.
          </li>
          <li>
            <strong>Medication:</strong> Select the medication your dog has ingested — either Ibuprofen or Acetaminophen (Tylenol). Each medication has different toxicity thresholds and effects.
          </li>
          <li>
            <strong>Estimated Dose Taken:</strong> Enter the estimated amount of medication ingested in milligrams (mg). This may require checking the medication packaging or calculating based on the number of pills consumed.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to see the estimated mg/kg dose and the associated toxicity risk level. Follow any warnings or recommendations provided.
          </li>
        </ul>
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
              href="https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants/ibuprofen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. ASPCA Animal Poison Control Center - Ibuprofen Toxicity in Pets
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on ibuprofen poisoning symptoms, treatment, and prevention in dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/acetaminophen-toxicity-cats-and-dogs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell University College of Veterinary Medicine - Acetaminophen Toxicity
            </a>
            <p className="text-slate-500 text-sm">
              Detailed explanation of acetaminophen poisoning mechanisms and clinical management in dogs and cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/toxicology/poisoning-by-nonsteroidal-anti-inflammatory-drugs-nsaids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual - NSAID Poisoning in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative veterinary resource outlining NSAID toxicity, clinical signs, and treatment protocols.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.veterinarypartner.com/Content.plx?P=A&A=2796"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Veterinary Partner - Ibuprofen and Acetaminophen Toxicity in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Practical advice for pet owners and veterinarians on recognizing and managing human medication toxicity in dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)"
      description="Alert tool for accidental exposure to common human pain relievers like **Ibuprofen** or **Acetaminophen (Tylenol)**."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: mg/kg = total mg ingested ÷ dog weight (kg)
      formula={{
        title: "Scientific Formula",
        formula: "mg/kg = Dose Ingested (mg) ÷ Dog Weight (kg)",
        variables: [
          { symbol: "mg/kg", description: "Dose per kilogram of dog body weight" },
          { symbol: "Dose Ingested (mg)", description: "Total amount of medication ingested in milligrams" },
          { symbol: "Dog Weight (kg)", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog accidentally ingests two 200 mg ibuprofen tablets (total 400 mg). The owner wants to assess toxicity risk.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert dog weight to kilograms if needed: 30 lbs ÷ 2.20462 = 13.6 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate mg/kg dose: 400 mg ÷ 13.6 kg = 29.4 mg/kg, which is below the mild toxicity threshold of 50 mg/kg for ibuprofen.",
          },
        ],
        result:
          "The ingested dose is below the mild toxicity threshold but still warrants veterinary consultation due to individual sensitivity and potential delayed effects.",
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
        { id: "what-is", label: "Understanding Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)" },
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
