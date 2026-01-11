import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function DogGabapentinDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    dosageMgPerKg: "10",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const dosageRaw = parseFloat(inputs.dosageMgPerKg);

    if (!weightRaw || weightRaw <= 0)
      return {
        value: 0,
        label: "Enter a valid dog weight to calculate dosage.",
        subtext: null,
        warning: null,
      };
    if (!dosageRaw || dosageRaw <= 0)
      return {
        value: 0,
        label: "Enter a valid dosage (mg/kg).",
        subtext: null,
        warning: null,
      };

    const weightKg = weightToKg(weightRaw, unit);

    // Gabapentin dose calculation:
    // Dose (mg) = weightKg * dosageMgPerKg
    const doseMg = weightKg * dosageRaw;

    // Typical gabapentin dosing range for dogs is 5-10 mg/kg every 8-12 hours.
    // Warn if dosage is outside typical range
    let warning = null;
    if (dosageRaw < 5) {
      warning =
        "Entered dosage is below the commonly recommended minimum of 5 mg/kg. Consult your veterinarian before administering.";
    } else if (dosageRaw > 20) {
      warning =
        "Entered dosage exceeds typical maximum recommendations (usually up to 20 mg/kg in special cases). Use caution and consult a veterinarian.";
    }

    // Format dose to 1 decimal place
    const doseFormatted = doseMg.toFixed(1);

    return {
      value: doseFormatted,
      label: `Gabapentin dose for your dog (${dosageRaw} mg/kg)`,
      subtext: `Based on a weight of ${weightKg.toFixed(
        2
      )} kg (${unit === "lb" ? weightRaw + " lbs" : weightRaw + " kg"})`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question:
        "Why is gabapentin dosage calculated based on mg/kg in dogs rather than a fixed dose?",
      answer:
        "Gabapentin dosage in dogs is calculated per kilogram of body weight to ensure safe and effective treatment tailored to each individual dog. Dogs vary widely in size and metabolism, so a fixed dose could lead to underdosing or overdosing. Using mg/kg dosing accounts for these differences, optimizing therapeutic effects while minimizing side effects.",
    },
    {
      question:
        "How often should gabapentin be administered to dogs, and does this calculator account for frequency?",
      answer:
        "Gabapentin is typically administered every 8 to 12 hours in dogs, depending on the condition being treated and veterinary guidance. This calculator provides a single dose amount based on weight and dosage rate but does not calculate frequency. Always follow your veterinarian's instructions regarding dosing intervals to maintain effective blood levels.",
    },
    {
      question:
        "Are there any risks or side effects associated with gabapentin use in dogs?",
      answer:
        "Gabapentin is generally well tolerated in dogs, but side effects can include sedation, ataxia (loss of coordination), and gastrointestinal upset. Overdosing can increase these risks. This calculator helps estimate safe dosing, but it is essential to consult a veterinarian before starting or adjusting gabapentin therapy to monitor for adverse effects.",
    },
    {
      question:
        "Can this calculator be used for puppies or dogs with health conditions?",
      answer:
        "While this calculator provides a general dosing estimate based on weight, puppies and dogs with certain health conditions (e.g., kidney or liver disease) may require adjusted dosages. Always consult a veterinarian for these special cases, as they can tailor dosing and monitor your pet's response safely.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
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
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-400 mt-1">
            Please enter your dog's current body weight.
          </p>
        </div>

        {/* Dosage Input */}
        <div>
          <Label
            htmlFor="dosageMgPerKg"
            className="text-slate-700 dark:text-slate-300"
          >
            Dosage (mg/kg)
          </Label>
          <Input
            id="dosageMgPerKg"
            name="dosageMgPerKg"
            type="text"
            inputMode="decimal"
            placeholder="Typical: 5 - 10 mg/kg"
            value={inputs.dosageMgPerKg}
            onChange={handleInputChange}
            aria-describedby="dosage-desc"
          />
          <p id="dosage-desc" className="text-xs text-slate-400 mt-1">
            Enter the prescribed gabapentin dosage in milligrams per kilogram.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via state update, no extra logic needed
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dosageMgPerKg: "10" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value} mg
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult
              a veterinarian for diagnosis and personalized dosing.
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
          Understanding Gabapentin Dose Calculator for Dogs
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Gabapentin is a medication commonly prescribed to dogs for managing nerve
          pain, seizures, and anxiety. Because dogs vary significantly in size and
          metabolism, determining the correct dosage is critical to ensure efficacy
          while minimizing adverse effects. This calculator uses your dog’s weight
          and the prescribed dosage rate (mg/kg) to estimate an appropriate dose in
          milligrams.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The calculation is based on veterinary pharmacology principles, where the
          dose is proportional to the dog’s body weight in kilograms. This approach
          helps tailor the medication to the individual dog’s physiology. It is
          important to note that gabapentin dosing can vary depending on the
          condition being treated and the dog’s overall health status, so always
          consult your veterinarian before administering or adjusting doses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This tool does not replace professional veterinary advice but serves as an
          educational resource to help pet owners understand how dosing is
          calculated. Proper dosing ensures that gabapentin provides therapeutic
          benefits such as pain relief and seizure control while reducing the risk
          of side effects like sedation or ataxia.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide an
          accurate gabapentin dose estimate based on your dog’s weight and the
          prescribed dosage rate. Begin by selecting the unit system you prefer:
          Imperial (pounds) or Metric (kilograms). Then, enter your dog’s current
          weight in the chosen units.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Next, input the dosage in milligrams per kilogram (mg/kg) as prescribed by
          your veterinarian. Typical dosing ranges from 5 to 10 mg/kg, but your vet
          may recommend a different amount based on your dog’s specific needs.
          After entering these values, click the “Calculate” button to see the
          estimated gabapentin dose in milligrams.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter your dog’s weight accurately to ensure
            the dose calculation is precise. Use a scale or recent veterinary
            records.
          </li>
          <li>
            <strong>Dosage (mg/kg):</strong> Input the dosage prescribed by your
            veterinarian. If unsure, consult your vet before administering any
            medication.
          </li>
        </ul>
      </section>

      {/* SECTION 3: FAQ */}
      <section id="faq" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Frequently Asked Questions
        </h2>
        <ul className="space-y-6">
          {faqs.map((item, i) => (
            <li
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-4 last:border-0"
            >
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-2">
                {item.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* SECTION 4: REFERENCES */}
      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.plumbsveterinarydrugs.com/#!/monograph/gabapentin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Plumb’s Veterinary Drug Handbook - Gabapentin
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive monograph detailing gabapentin pharmacology, dosing,
              and clinical use in veterinary medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11339&catId=36538&id=4959365"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Veterinary Information Network (VIN) - Gabapentin Use in Dogs
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed discussions and clinical guidelines on gabapentin dosing
              and safety considerations in canine patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/pharmacology/central-nervous-system-pharmacology/gabapentin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual - Gabapentin
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resource covering gabapentin’s mechanism of action,
              indications, and dosing protocols in veterinary patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5605306/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. Clinical Pharmacokinetics of Gabapentin in Dogs (NCBI)
            </a>
            <p className="text-slate-500 text-sm">
              Research article analyzing gabapentin absorption, distribution, and
              dosing optimization in canine models.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Gabapentin Dose Calculator for Dogs"
      description="Calculate the proper dosage for the nerve pain and anxiety medication **Gabapentin** in dogs by weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dosage (mg/kg)",
        variables: [
          {
            symbol: "Weight (kg)",
            description: "Dog's body weight in kilograms",
          },
          {
            symbol: "Dosage (mg/kg)",
            description:
              "Prescribed gabapentin dosage in milligrams per kilogram of body weight",
          },
          {
            symbol: "Dose (mg)",
            description: "Calculated gabapentin dose in milligrams",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30-pound dog is prescribed gabapentin at 10 mg/kg to manage nerve pain.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the dog's weight from pounds to kilograms: 30 lbs ÷ 2.20462 = 13.61 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Multiply the weight in kg by the dosage: 13.61 kg × 10 mg/kg = 136.1 mg.",
          },
        ],
        result:
          "The calculated gabapentin dose for this dog is approximately 136 mg per administration.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Gabapentin Dose Calculator for Dogs" },
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
