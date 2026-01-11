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
import { convertWeight, formatNumberForInput, LB_PER_KG } from "@/lib/utils";

export default function CatCephalexinDoseCalculator() {
  // 1. STATE
  // Unit system needed for weight input (lbs or kg)
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  const [unit, setUnit] = useState<"imperial" | "metric">(() => (preferredWeightUnit === "lb" ? "imperial" : "metric"));

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Cephalexin dose for cats: 15-30 mg/kg/day divided q8-12h (commonly 20 mg/kg q12h)
  // We'll calculate total daily dose and per administration dose assuming q12h dosing.
  // Formula: Dose (mg per administration) = 20 mg/kg × weight (kg) / 2 doses per day

  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw) {
      return {
        value: 0,
        label: "Please enter weight",
        subtext: "",
        warning: null,
      };
    }
    const weightNum = parseFloat(weightRaw);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "Invalid weight input",
        subtext: "",
        warning: null,
      };
    }
    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / LB_PER_KG : weightNum;

    // Calculate dose per administration (20 mg/kg q12h)
    const doseMgPerAdmin = 20 * weightKg;

    // Round to 1 decimal place
    const doseRounded = Math.round(doseMgPerAdmin * 10) / 10;

    // Warning if weight is outside typical cat range (2-10 kg)
    let warning = null;
    if (weightKg < 2) {
      warning =
        "Weight is below typical cat range; dose should be confirmed by a veterinarian.";
    } else if (weightKg > 10) {
      warning =
        "Weight is above typical cat range; dose should be confirmed by a veterinarian.";
    }

    return {
      value: doseRounded,
      label: "Cephalexin dose per administration (mg)",
      subtext: "Assuming 20 mg/kg every 12 hours",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is the Cephalexin dose calculated per kilogram of body weight?",
      answer:
        "Dosing antibiotics like Cephalexin based on body weight ensures that each cat receives an effective amount tailored to its size. Cats vary significantly in weight, so a fixed dose could lead to underdosing or overdosing. Weight-based dosing optimizes therapeutic effects while minimizing toxicity risks.",
    },
    {
      question: "Why is Cephalexin typically dosed every 12 hours in cats?",
      answer:
        "Cephalexin has a half-life that supports dosing every 12 hours to maintain effective blood levels. This dosing interval balances efficacy and convenience, ensuring the antibiotic remains at therapeutic concentrations without causing accumulation. Veterinarians may adjust frequency based on infection severity or patient response.",
    },
    {
      question: "Can I use this calculator for kittens or very small cats?",
      answer:
        "While this calculator provides a general dosing estimate, kittens and very small cats may have different pharmacokinetics and sensitivities. It's important to consult a veterinarian for precise dosing in young or fragile animals. The calculator includes warnings for weights outside typical adult cat ranges to encourage professional guidance.",
    },
    {
      question: "Is it safe to use Cephalexin without veterinary supervision?",
      answer:
        "Cephalexin is a prescription antibiotic and should only be used under veterinary guidance. Incorrect dosing or inappropriate use can lead to ineffective treatment or antibiotic resistance. Always consult a veterinarian before administering Cephalexin to ensure safety and proper diagnosis.",
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
              if (next !== "imperial" && next !== "metric") return;
              setInputs((prev) => {
                const num = parseFloat(prev.weight);
                if (!prev.weight || Number.isNaN(num) || num <= 0) return prev;
                const converted = convertWeight(num, unit === "imperial" ? "lb" : "kg", next === "imperial" ? "lb" : "kg");
                return { ...prev, weight: formatNumberForInput(converted, 2) };
              });
              setUnit(next);
              setPreferredWeightUnit(next === "imperial" ? "lb" : "kg");
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat's Body Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
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
            // No special action needed, calculation is reactive
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
          Understanding Cephalexin Dose Calculator for Cats
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Cephalexin is a commonly prescribed antibiotic used to treat bacterial infections in cats, including skin infections, urinary tract infections, and respiratory illnesses. Accurate dosing is critical to ensure the medication is effective while minimizing potential side effects or toxicity. This calculator helps veterinarians and cat owners estimate the appropriate dose based on the cat’s body weight, which is the most reliable factor influencing drug metabolism and clearance.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The dosing regimen for Cephalexin in cats typically ranges from 15 to 30 mg per kilogram of body weight per day, divided into two doses administered every 12 hours. This calculator uses a standard dose of 20 mg/kg every 12 hours, which is widely accepted in veterinary practice for most uncomplicated infections. By inputting the cat’s weight, users receive a precise dose per administration, helping to avoid underdosing that could lead to treatment failure or overdosing that could cause adverse effects.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to remember that while this tool provides a useful estimate, individual cats may require dose adjustments based on their health status, kidney function, or the severity of the infection. Always consult a licensed veterinarian before starting or adjusting any antibiotic treatment to ensure safe and effective care tailored to your cat’s specific needs.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this Cephalexin dose calculator is straightforward and designed for ease of use by both veterinary professionals and cat owners. Begin by selecting the unit system that matches how you measure your cat’s weight—either pounds (imperial) or kilograms (metric). Next, enter the cat’s current body weight into the input field. The calculator will then compute the recommended dose per administration based on the standard veterinary dosing guidelines.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) that corresponds to your cat’s weight measurement.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s accurate body weight in the input box provided.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to view the recommended Cephalexin dose per administration.
          </li>
          <li>
            <strong>Step 4:</strong> Review the result and any warnings, and consult your veterinarian before administering the medication.
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
              href="https://www.plumbsveterinarydrugs.com/#!/monograph/cephalexin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Plumb's Veterinary Drug Handbook: Cephalexin
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive veterinary drug reference providing dosing guidelines, pharmacology, and clinical use of Cephalexin in cats.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/pharmacology/antibacterial-drugs/cephalexin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual: Cephalexin
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative source on veterinary pharmacology, including indications, dosing, and safety considerations for Cephalexin in feline patients.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/antibiotics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Cornell Feline Health Center: Antibiotics in Cats
            </a>
            <p className="text-slate-500 text-sm">
              Educational resource discussing antibiotic use in cats, including dosing principles and the importance of veterinary supervision.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cephalexin Dose Calculator for Cats"
      description="Calculate the veterinarian-recommended dosage for the antibiotic **Cephalexin** in cats based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg per administration) = 20 mg/kg × Weight (kg)",
        variables: [
          { symbol: "Dose", description: "Cephalexin dose per administration in milligrams" },
          { symbol: "Weight", description: "Cat's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10-pound (4.54 kg) cat requires Cephalexin treatment for a skin infection. The veterinarian prescribes 20 mg/kg every 12 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate dose per administration: 20 mg × 4.54 kg = 90.8 mg per dose.",
          },
          {
            label: "3",
            explanation:
              "Administer approximately 90.8 mg of Cephalexin every 12 hours as prescribed.",
          },
        ],
        result: "The cat should receive about 90.8 mg of Cephalexin twice daily.",
      }}
      relatedCalculators={[
        {
          title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
          url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko",
          icon: "🐾",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Grape/Raisin Exposure Risk Calculator",
          url: "/pets/dog-grape-raisin-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Heat Risk/Walk Safety Window (Temp & Humidity)",
          url: "/pets/dog-heat-risk-walk-safety-window",
          icon: "🍖",
        },
        {
          title: "Dehydration Risk Estimator (Weight & Symptoms Aware)",
          url: "/pets/dog-dehydration-risk-estimator",
          icon: "💉",
        },
        {
          title: "Kitten Calorie Needs by Age/Size",
          url: "/pets/kitten-calorie-needs-age-size",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Cephalexin Dose Calculator for Cats" },
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
