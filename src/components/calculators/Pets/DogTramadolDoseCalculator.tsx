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

export default function DogTramadolDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    painSeverity: "mild",
  });

  // Dosage guidelines (mg/kg) based on veterinary references:
  // Mild pain: 1 mg/kg every 8-12 hours
  // Moderate pain: 2 mg/kg every 8-12 hours
  // Severe pain: 3 mg/kg every 8-12 hours (use with caution, vet supervision required)

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid weight to calculate dose",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Determine dosage per pain severity
    let dosageMgPerKg = 0;
    let warning = null;
    switch (inputs.painSeverity) {
      case "mild":
        dosageMgPerKg = 1;
        break;
      case "moderate":
        dosageMgPerKg = 2;
        break;
      case "severe":
        dosageMgPerKg = 3;
        warning =
          "Severe pain dosage should only be used under strict veterinary supervision due to risk of side effects.";
        break;
      default:
        dosageMgPerKg = 1;
    }

    // Calculate total dose in mg
    const totalDoseMg = +(weightKg * dosageMgPerKg).toFixed(2);

    return {
      value: totalDoseMg,
      label: `Recommended Tramadol dose (${dosageMgPerKg} mg/kg)`,
      subtext: `For a dog weighing ${weightKg.toFixed(2)} kg (${weightRaw.toFixed(
        2
      )} ${unit === "lb" ? "lbs" : "kg"}), administer approximately ${totalDoseMg} mg every 8-12 hours.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is Tramadol dosage calculated based on weight in mg/kg?",
      answer:
        "Tramadol dosage for dogs is calculated in milligrams per kilogram (mg/kg) to ensure precise and safe dosing tailored to the individual dog's body mass. This method accounts for metabolic differences and drug distribution, minimizing the risk of underdosing or overdosing. Using mg/kg allows veterinarians to adjust doses accurately for dogs of varying sizes and breeds, ensuring effective pain relief while reducing side effects.",
    },
    {
      question: "How often should Tramadol be administered to dogs?",
      answer:
        "Tramadol is typically administered every 8 to 12 hours in dogs, depending on the severity of pain and veterinary guidance. This dosing interval maintains effective analgesic levels in the bloodstream while minimizing side effects. It's crucial to follow the veterinarian's prescribed schedule strictly, as improper timing can lead to inadequate pain control or increased risk of adverse reactions.",
    },
    {
      question: "Are there risks associated with using Tramadol in dogs?",
      answer:
        "Yes, while Tramadol is generally safe when dosed correctly, it can cause side effects such as sedation, gastrointestinal upset, or, rarely, seizures. Dogs with certain medical conditions or those on other medications may be at higher risk. Therefore, Tramadol should only be used under veterinary supervision, with careful dose calculation and monitoring to ensure safety and efficacy.",
    },
    {
      question: "Can I use this calculator to dose Tramadol for other animals?",
      answer:
        "No, this calculator is specifically designed for dogs based on veterinary pharmacology and dosing guidelines. Different species metabolize drugs differently, and dosages vary widely. Using this calculator for other animals could result in incorrect dosing and potential harm. Always consult a veterinarian for species-specific medication guidance.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }
  function onPainSeverityChange(value: string) {
    setInputs((prev) => ({ ...prev, painSeverity: value }));
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
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={onInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 mt-1">
            Accurate weight is essential for safe dosing.
          </p>
        </div>

        {/* Pain Severity Select */}
        <div>
          <Label htmlFor="painSeverity" className="text-slate-700 dark:text-slate-300">
            Pain Severity
          </Label>
          <Select value={inputs.painSeverity} onValueChange={onPainSeverityChange}>
            <SelectTrigger id="painSeverity" className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild Pain</SelectItem>
              <SelectItem value="moderate">Moderate Pain</SelectItem>
              <SelectItem value="severe">Severe Pain</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Select the severity of your dog's pain as assessed by a veterinarian.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate Tramadol Dose"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", painSeverity: "mild" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Result
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} mg</p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized treatment.
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
          Understanding Tramadol Dose Calculator for Dogs
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Tramadol is a synthetic opioid analgesic commonly prescribed by veterinarians to manage moderate to severe pain in dogs. Its mechanism involves binding to opioid receptors in the central nervous system, altering the perception of pain. Because dogs vary widely in size and metabolism, dosing must be carefully calculated based on their body weight to ensure efficacy while minimizing adverse effects. This calculator provides a scientifically grounded estimate of the appropriate Tramadol dose based on your dog's weight and pain severity.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The dosage is expressed in milligrams per kilogram (mg/kg), a standard veterinary dosing unit that accounts for the animal's mass. Pain severity influences the dose, with mild pain requiring lower doses and severe pain necessitating higher doses under strict veterinary supervision. This tool does not replace professional veterinary advice but serves as an educational aid to understand how Tramadol dosing is determined for canine patients.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to note that Tramadol should only be administered under veterinary guidance, as improper dosing can lead to side effects such as sedation, gastrointestinal upset, or neurological symptoms. Additionally, some dogs may have contraindications or be on medications that interact with Tramadol. Always consult your veterinarian before starting or adjusting any medication regimen for your dog.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the appropriate Tramadol dose for your dog based on its weight and the severity of pain as assessed by a veterinarian. To use it effectively, you need to provide accurate information about your dog's current weight and select the pain severity category that best matches your dog's condition. The calculator then applies veterinary dosing guidelines to compute the recommended dose in milligrams.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog's Weight:</strong> Enter your dog's weight in pounds or kilograms, depending on your preferred unit system. Accurate weight measurement is critical for safe dosing.
          </li>
          <li>
            <strong>Pain Severity:</strong> Choose the level of pain your dog is experiencing—mild, moderate, or severe—as determined by a veterinary professional. This selection adjusts the dose accordingly.
          </li>
          <li>
            <strong>Calculate:</strong> Click the calculate button to see the recommended Tramadol dose in milligrams. Follow your veterinarian's instructions for administration frequency and monitoring.
          </li>
          <li>
            <strong>Reset:</strong> Use the reset button to clear inputs and start a new calculation.
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
              href="https://www.merckvetmanual.com/pharmacology/analgesics/tramadol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Tramadol
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of Tramadol pharmacology, dosing, and clinical use in veterinary medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4958491/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Pharmacokinetics and Safety of Tramadol in Dogs - NCBI
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed study detailing Tramadol metabolism, dosing, and safety profile in canine patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/aaha-guidelines/pain-management/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. AAHA Pain Management Guidelines for Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guidelines on pain assessment and analgesic dosing, including opioids like Tramadol.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.wsu.edu/outreach/Pet-Health-Topics/categories/pain-management"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Washington State University: Pain Management in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource on pain management strategies and medication dosing for dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tramadol Dose Calculator for Dogs"
      description="Calculate the appropriate pain relief dosage for **Tramadol** in dogs, considering weight and pain severity."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dosage (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total Tramadol dose to administer" },
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          { symbol: "Dosage (mg/kg)", description: "Recommended Tramadol dose per kilogram based on pain severity" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb dog is experiencing moderate pain after surgery. The veterinarian recommends Tramadol at 2 mg/kg every 8-12 hours.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the dog's weight from pounds to kilograms: 30 lbs ÷ 2.20462 = 13.61 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the dose: 13.61 kg × 2 mg/kg = 27.22 mg of Tramadol per dose.",
          },
        ],
        result:
          "The dog should receive approximately 27 mg of Tramadol every 8-12 hours as per veterinary guidance.",
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
        { id: "what-is", label: "Understanding Tramadol Dose Calculator for Dogs" },
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
