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

export default function DogPrednisonePrednisoloneDoseCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    dosageMgPerKg: "0.5", // default starting dosage mg/kg (typical anti-inflammatory range)
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const dosageRaw = parseFloat(inputs.dosageMgPerKg);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!dosageRaw || dosageRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dosage (mg/kg).",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Calculate dose in mg: Dose (mg) = weightKg * dosageMgPerKg
    const doseMg = weightKg * dosageRaw;

    // Round dose to 2 decimals for display
    const doseRounded = Math.round(doseMg * 100) / 100;

    // Warning for high doses (above typical max 2 mg/kg/day)
    let warning = null;
    if (dosageRaw > 2) {
      warning =
        "Dosage exceeds typical maximum recommended dose (2 mg/kg/day). Consult your veterinarian before administering.";
    }

    return {
      value: doseRounded,
      label: `Prednisone/Prednisolone dose for your dog`,
      subtext: `Based on weight ${weightKg.toFixed(2)} kg and dosage ${dosageRaw} mg/kg.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "Why is dosing Prednisone/Prednisolone based on mg/kg in dogs?",
      answer:
        "Dosing Prednisone or Prednisolone based on milligrams per kilogram (mg/kg) ensures the medication is tailored to the individual dog's size and metabolic needs. Dogs vary widely in weight, and a fixed dose could lead to underdosing or overdosing. Using mg/kg allows veterinarians to provide a safe and effective dose that maximizes therapeutic benefits while minimizing side effects.",
    },
    {
      question: "How does Prednisone differ from Prednisolone in veterinary use?",
      answer:
        "Prednisone is a prodrug that is converted into Prednisolone in the liver. Some dogs, especially those with liver dysfunction, may not efficiently convert Prednisone, making Prednisolone the preferred choice. Both drugs have similar anti-inflammatory and immunosuppressive effects, but Prednisolone is often favored in veterinary medicine for its direct activity and more predictable pharmacokinetics.",
    },
    {
      question: "What are the risks of incorrect Prednisone dosing in dogs?",
      answer:
        "Incorrect dosing of Prednisone can lead to serious health issues. Underdosing may result in insufficient control of inflammation or immune-mediated diseases, while overdosing can cause side effects like increased thirst, urination, appetite, gastrointestinal ulcers, and long-term risks such as Cushing’s syndrome. Accurate dosing based on weight and veterinary guidance is critical to balance efficacy and safety.",
    },
    {
      question: "Why is it important to consult a veterinarian before adjusting Prednisone doses?",
      answer:
        "Prednisone dosing must be carefully managed because it affects multiple body systems and can interact with other medications. A veterinarian considers the dog’s specific condition, weight, concurrent diseases, and response to therapy before adjusting doses. Self-adjusting doses without professional advice can lead to treatment failure or harmful side effects, emphasizing the importance of veterinary supervision.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  // 5. WIDGET JSX
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
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weightHelp"
          />
          <p id="weightHelp" className="text-xs text-slate-500 mt-1">
            Please enter your dog’s current weight.
          </p>
        </div>

        {/* Dosage Input */}
        <div>
          <Label htmlFor="dosageMgPerKg" className="text-slate-700 dark:text-slate-300">
            Dosage (mg/kg)
          </Label>
          <Input
            id="dosageMgPerKg"
            name="dosageMgPerKg"
            type="text"
            placeholder="Typical range: 0.5 - 2 mg/kg"
            value={inputs.dosageMgPerKg}
            onChange={handleInputChange}
            aria-describedby="dosageHelp"
          />
          <p id="dosageHelp" className="text-xs text-slate-500 mt-1">
            Enter the prescribed dosage in milligrams per kilogram of body weight.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          aria-label="Calculate Prednisone dose"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", dosageMgPerKg: "0.5" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and treatment.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 6. EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">
      {/* SECTION 1: UNDERSTANDING */}
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Prednisone/Prednisolone Dose Calculator for Dogs
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Prednisone and Prednisolone are corticosteroids widely used in veterinary medicine to treat a variety of inflammatory and immune-mediated conditions in dogs. These medications help reduce inflammation, suppress immune responses, and alleviate symptoms associated with allergies, arthritis, autoimmune diseases, and certain cancers. Because of their potent effects and potential side effects, precise dosing is critical to ensure safety and efficacy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The dose of Prednisone or Prednisolone is typically calculated based on the dog’s body weight in kilograms, expressed as milligrams per kilogram (mg/kg). This approach accounts for the wide range of dog sizes and metabolic rates, allowing for individualized treatment plans. The dosage may vary depending on the condition being treated, ranging from low anti-inflammatory doses to higher immunosuppressive doses.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          This calculator provides an easy and accurate way to determine the appropriate dose based on your dog’s weight and prescribed dosage. It helps pet owners and veterinary professionals avoid dosing errors that could lead to ineffective treatment or adverse effects. Always remember that this tool is for educational purposes and should not replace professional veterinary advice.
        </p>
      </section>

      {/* SECTION 2: HOW TO USE */}
      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Prednisone/Prednisolone dose calculator is straightforward and designed to provide accurate dosing guidance. Begin by selecting the unit system that corresponds to how you measure your dog’s weight—either imperial (pounds) or metric (kilograms). Then, enter your dog’s current weight in the chosen unit. Next, input the prescribed dosage in milligrams per kilogram (mg/kg), which your veterinarian will provide based on your dog’s condition.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Dog Weight:</strong> Enter the exact weight of your dog. For imperial units, enter pounds; for metric, enter kilograms. Accurate weight measurement is essential for correct dosing.
          </li>
          <li>
            <strong>Dosage (mg/kg):</strong> Input the dosage prescribed by your veterinarian. Typical anti-inflammatory doses range from 0.5 to 1 mg/kg, while immunosuppressive doses may be higher, up to 2 mg/kg or more.
          </li>
        </ul>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
          After entering these values, click the “Calculate” button to see the recommended total dose in milligrams. If you need to start over, use the “Reset” button to clear all inputs. Always consult your veterinarian before making any changes to your dog’s medication regimen.
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
              href="https://www.plumbsveterinarydrugs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Plumb’s Veterinary Drug Handbook
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource providing detailed drug dosing, pharmacology, and clinical use guidelines for veterinary medications including Prednisone and Prednisolone.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/pharmacology/corticosteroids/corticosteroids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Corticosteroids
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guide on corticosteroid use in animals, covering indications, dosing strategies, and potential adverse effects.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vetmed.ucdavis.edu/sites/g/files/dgvnsk5741/files/inline-files/Prednisone%20and%20Prednisolone%20in%20Dogs.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. UC Davis Veterinary Pharmacology Notes
            </a>
            <p className="text-slate-500 text-sm">
              Educational material detailing pharmacokinetics and clinical use of Prednisone and Prednisolone in canine patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/globalassets/02-guidelines/2019-canine-lymphoma-guidelines.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              4. American Animal Hospital Association (AAHA) Canine Lymphoma Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Clinical guidelines including corticosteroid dosing protocols for immune-mediated diseases and lymphoma treatment in dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Prednisone/Prednisolone Dose Calculator for Dogs"
      description="Calculate the correct dosage for the anti-inflammatory and immunosuppressant steroid **Prednisone/Prednisolone**."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Weight (kg) × Dosage (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total Prednisone/Prednisolone dose in milligrams" },
          { symbol: "Weight (kg)", description: "Dog’s body weight in kilograms" },
          { symbol: "Dosage (mg/kg)", description: "Prescribed dosage per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30-pound dog is prescribed Prednisolone at an anti-inflammatory dose of 0.5 mg/kg daily. Calculate the total daily dose in milligrams.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the dog’s weight from pounds to kilograms: 30 lbs ÷ 2.20462 = 13.61 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Multiply the weight in kg by the dosage: 13.61 kg × 0.5 mg/kg = 6.805 mg.",
          },
        ],
        result: "The recommended daily dose is approximately 6.8 mg of Prednisolone.",
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
        { id: "what-is", label: "Understanding Prednisone/Prednisolone Dose Calculator for Dogs" },
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
