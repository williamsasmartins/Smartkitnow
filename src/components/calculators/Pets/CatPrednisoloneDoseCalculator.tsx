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

export default function CatPrednisoloneDoseCalculator() {
  // 1. STATE
  // Unit system needed for weight input (imperial or metric)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only, as dose is mg/kg
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Prednisolone dose range for cats: 0.5 to 2 mg/kg/day depending on indication
  // We'll calculate dose at 1 mg/kg/day as a standard reference dose.
  // User inputs weight, dose = weightKg * 1 mg

  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }
    const weightNum = parseFloat(weightRaw);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive number for weight.",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = weightToKg(weightNum, unit);

    // Calculate dose at 1 mg/kg/day
    const doseMg = weightKg * 1;

    // Round to 2 decimals
    const doseRounded = Math.round(doseMg * 100) / 100;

    // Warning if weight is outside typical range (e.g. <1kg or >10kg)
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Weight entered is very low for an average adult cat. Please verify the weight or consult your veterinarian.";
    } else if (weightKg > 10) {
      warning =
        "Weight entered is unusually high for a typical cat. Please verify the weight or consult your veterinarian.";
    }

    return {
      value: doseRounded,
      label: "Prednisolone Dose (mg/day)",
      subtext:
        "Calculated at 1 mg/kg/day. Actual dose may vary based on condition and vet prescription.",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is prednisolone dosing based on weight in cats?",
      answer:
        "Prednisolone dosing is weight-based because cats metabolize medications differently depending on their size. Using mg/kg ensures the dose is appropriate for the individual cat's body mass, optimizing therapeutic effects while minimizing side effects. This approach helps veterinarians tailor treatment safely and effectively.",
    },
    {
      question: "Can I use this calculator for other steroids or animals?",
      answer:
        "This calculator is specifically designed for prednisolone dosing in cats and should not be used for other steroids or species. Different medications and animals have unique pharmacokinetics and dosing requirements. Always consult a veterinarian before applying dosages from one species or drug to another.",
    },
    {
      question: "What conditions require prednisolone treatment in cats?",
      answer:
        "Prednisolone is commonly prescribed for inflammatory, allergic, and autoimmune conditions in cats, such as asthma, dermatitis, or arthritis. The dose and duration depend on the severity and type of condition. Proper veterinary diagnosis and monitoring are essential to ensure safe and effective treatment.",
    },
    {
      question: "Why is it important to consult a vet before using prednisolone?",
      answer:
        "Prednisolone can have significant side effects, including immune suppression and organ strain, especially if dosed incorrectly. A veterinarian evaluates the cat’s overall health, underlying conditions, and potential drug interactions before prescribing. Self-medicating or incorrect dosing can lead to serious complications.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
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

      {/* Weight input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="0.01"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight || ""}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weightHelp"
        />
        <p id="weightHelp" className="text-xs text-slate-500 dark:text-slate-400">
          Accurate weight is essential for correct dosing.
        </p>
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
          onClick={() => setInputs({ weight: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">
      <section id="what-is" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Understanding Prednisolone Dose Calculator for Cats
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Prednisolone is a corticosteroid widely used in veterinary medicine to manage inflammation, allergies, and autoimmune diseases in cats. Because cats have unique metabolic rates and sensitivities, precise dosing is critical to maximize therapeutic benefits while minimizing adverse effects. This calculator helps estimate an appropriate daily dose based on the cat’s weight, providing a reliable starting point for treatment considerations.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The dose of prednisolone is typically calculated in milligrams per kilogram of body weight (mg/kg), reflecting the individual cat’s size and metabolic needs. This weight-based dosing ensures that smaller cats receive proportionally less medication, reducing the risk of overdose, while larger cats receive sufficient amounts for efficacy. Veterinarians adjust doses based on the specific condition being treated and the cat’s response to therapy.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          While this tool provides an estimated dose, it is essential to remember that prednisolone treatment should always be supervised by a veterinarian. Factors such as the cat’s overall health, concurrent medications, and the severity of the disease influence the final prescribed dose. This calculator serves as an educational aid to support informed discussions between pet owners and veterinary professionals.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide a quick estimate of the daily prednisolone dose for your cat. Begin by selecting the unit system that corresponds to how you measure your cat’s weight—either imperial (pounds) or metric (kilograms). Enter the cat’s current weight accurately to ensure the calculation reflects their true size.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the unit system (imperial or metric) from the dropdown menu to match your preferred measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s weight in the input field. Use a precise scale for accuracy, as dosing depends heavily on weight.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to generate the estimated daily prednisolone dose in milligrams.
          </li>
          <li>
            <strong>Step 4:</strong> Review the result and any warnings provided. Always consult your veterinarian before administering medication.
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
              href="https://www.merckvetmanual.com/pharmacology/corticosteroids/prednisolone"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Prednisolone
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of prednisolone pharmacology, dosing, and clinical use in veterinary medicine.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/corticosteroids"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Cornell Feline Health Center: Corticosteroids in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Detailed information on corticosteroid use, benefits, and risks specifically for feline patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.cliniciansbrief.com/article/corticosteroid-use-small-animal-practice"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Clinician’s Brief: Corticosteroid Use in Small Animal Practice
            </a>
            <p className="text-slate-500 text-sm">
              Expert guidelines on corticosteroid dosing, monitoring, and tapering protocols in cats and dogs.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Prednisolone Dose Calculator for Cats"
      description="Calculate the correct dosage for the anti-inflammatory steroid **Prednisolone** in cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Prednisolone Dose (mg) = Weight (kg) × 1 mg/kg",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "1 mg/kg", description: "Standard prednisolone dose per kilogram" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10-pound (4.54 kg) cat requires prednisolone treatment for inflammation. The veterinarian prescribes 1 mg/kg/day.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by dose: 4.54 kg × 1 mg/kg = 4.54 mg prednisolone per day.",
          },
        ],
        result: "The cat’s daily prednisolone dose is approximately 4.5 mg.",
      }}
      relatedCalculators={[
        { title: "Parasite Treatment Dose Reference", url: "/pets/small-mammal-parasite-treatment-dose-reference", icon: "🐾" },
        { title: "Cat Carrier Size & Fit Guide", url: "/pets/cat-carrier-size-fit-guide", icon: "🐱" },
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "🍖" },
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Dog Harness Size & Fit Guide", url: "/pets/dog-harness-size-fit-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Prednisolone Dose Calculator for Cats" },
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
