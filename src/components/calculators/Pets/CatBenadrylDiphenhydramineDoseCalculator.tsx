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

export default function CatBenadrylDiphenhydramineDoseCalculator() {
  // 1. STATE
  // Unit system default: imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Benadryl dose for cats: 1 mg/kg every 8-12 hours (commonly 1 mg/kg q8-12h)
  // We'll calculate a single dose in mg based on weight.
  // Convert weight to kg if input is imperial.
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    const weightKg = weightToKg(weightRaw, unit);

    // Dose mg = 1 mg/kg * weightKg
    const doseMg = +(weightKg * 1).toFixed(2);

    // Safety warning if weight is very low or dose is unusually high
    let warning = null;
    if (weightKg < 1) {
      warning =
        "Caution: Cats under 1 kg require veterinary supervision before dosing Benadryl.";
    }
    if (doseMg > 50) {
      warning =
        "Warning: Doses above 50 mg should only be given under veterinary guidance.";
    }

    return {
      value: doseMg,
      label: "Recommended Benadryl Dose (mg) per administration",
      subtext:
        "Administer every 8 to 12 hours as directed by your veterinarian. Do not exceed recommended dose.",
      warning,
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate Benadryl dosage based on weight?",
      answer:
        "Benadryl dosage must be carefully calculated based on a cat's weight to avoid underdosing or overdosing, both of which can be harmful. Cats metabolize medications differently than humans, and incorrect dosing can lead to ineffective treatment or toxic side effects. Weight-based dosing ensures the medication is both safe and effective for your cat's specific size.",
    },
    {
      question: "Can I give Benadryl to my cat without consulting a veterinarian?",
      answer:
        "While Benadryl is sometimes used in cats for allergies or mild sedation, it should never be given without veterinary guidance. Cats have unique sensitivities and underlying health conditions that may contraindicate its use. A veterinarian can confirm the appropriate dose and frequency, minimizing risks of adverse reactions or toxicity.",
    },
    {
      question: "What are the risks of giving too much Benadryl to a cat?",
      answer:
        "Overdosing Benadryl in cats can cause serious side effects such as excessive sedation, dry mouth, urinary retention, rapid heart rate, and even seizures. Cats are particularly sensitive to diphenhydramine, so precise dosing is critical. If an overdose is suspected, immediate veterinary attention is necessary to prevent life-threatening complications.",
    },
    {
      question: "How often can I safely administer Benadryl to my cat?",
      answer:
        "Benadryl is typically administered every 8 to 12 hours in cats, depending on the condition being treated and veterinary recommendations. Administering doses too frequently can increase the risk of toxicity, while too infrequently may reduce effectiveness. Always follow your veterinarian’s instructions regarding timing and dosage intervals.",
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
              setInputs((prev) => {
                const num = parseFloat(prev.weight);
                if (!prev.weight || Number.isNaN(num) || num <= 0) return prev;
                const converted = convertWeight(num, unit, next);
                return { ...prev, weight: formatNumberForInput(converted, 2) };
              });
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
          Cat's Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, weight: e.target.value }))
          }
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400">
          Please enter your cat's current body weight for accurate dosing.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already handled by useMemo)
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              vet for diagnosis.
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
          Understanding Benadryl (Diphenhydramine) Dose Calculator for Cats
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Benadryl, known generically as diphenhydramine, is an antihistamine commonly
          used in veterinary medicine to alleviate allergic reactions, itching, and
          mild sedation in cats. However, dosing must be precise because cats metabolize
          medications differently than humans and other animals. This calculator helps
          determine the safe and effective dose based on your cat’s body weight, ensuring
          proper treatment while minimizing risks.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The recommended dose of Benadryl for cats is approximately 1 mg per kilogram
          of body weight, administered every 8 to 12 hours. Overdosing can lead to
          serious side effects such as sedation, dry mouth, or even toxicity, while
          underdosing may render the treatment ineffective. This tool simplifies the
          calculation process, providing a clear dosage recommendation tailored to your
          cat’s size.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to remember that while this calculator offers guidance, it
          does not replace professional veterinary advice. Always consult your vet
          before administering any medication, especially if your cat has pre-existing
          health conditions or is taking other drugs. Responsible use of Benadryl can
          improve your cat’s comfort and health safely.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using this calculator is straightforward and designed to provide an accurate
          Benadryl dose based on your cat’s weight. Begin by selecting the unit system
          that matches your measurement preference—imperial (pounds) or metric
          (kilograms). Then, enter your cat’s current weight in the input field provided.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Choose the unit system (lbs or kg) that you will
            use to measure your cat’s weight.
          </li>
          <li>
            <strong>Step 2:</strong> Enter your cat’s weight accurately in the input
            box. Ensure the value is positive and realistic.
          </li>
          <li>
            <strong>Step 3:</strong> Click the “Calculate” button to see the
            recommended Benadryl dose in milligrams.
          </li>
          <li>
            <strong>Step 4:</strong> Review the result and any warnings. Consult your
            veterinarian before administering the medication.
          </li>
        </ul>
      </section>

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

      <section id="references" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          Veterinary References
        </h2>
        <ul className="space-y-4">
          <li className="block">
            <a
              href="https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/health-information/benadryl-diphenhydramine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Cornell University College of Veterinary Medicine: Benadryl (Diphenhydramine) Use in Pets
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on the safe use and dosing of diphenhydramine in cats and dogs.
            </p>
          </li>
          <li className="block">
            <a
              href="https://vcahospitals.com/know-your-pet/benadryl-for-dogs-and-cats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. VCA Hospitals: Benadryl for Dogs and Cats
            </a>
            <p className="text-slate-500 text-sm">
              Veterinary insights on indications, dosing, and precautions for diphenhydramine use in pets.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/pharmacology/antihistamines-and-antihistamine-anticholinergic-drugs/diphenhydramine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Merck Veterinary Manual: Diphenhydramine
            </a>
            <p className="text-slate-500 text-sm">
              Detailed pharmacological information and clinical uses of diphenhydramine in veterinary medicine.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Benadryl (Diphenhydramine) Dose Calculator for Cats"
      description="Calculate the safe, appropriate dosage of **Benadryl (Diphenhydramine)** for cats based on body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Benadryl Dose (mg) = 1 mg × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Cat's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A cat weighs 8.8 lbs (4 kg). The owner wants to know the correct Benadryl dose.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (8.8 lbs ÷ 2.20462 = 4 kg).",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by 1 mg/kg: 4 kg × 1 mg = 4 mg dose per administration.",
          },
          {
            label: "3",
            explanation:
              "Administer 4 mg every 8 to 12 hours as directed by a veterinarian.",
          },
        ],
        result:
          "The recommended Benadryl dose for this cat is 4 mg per dose, given every 8-12 hours.",
      }}
      relatedCalculators={[
        {
          title: "Shedding & Combing Time Planner",
          url: "/pets/cat-shedding-combing-time-planner",
          icon: "🐾",
        },
        {
          title: "Breeding Tank Volume Planner",
          url: "/pets/breeding-tank-volume-planner",
          icon: "🐶",
        },
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Horse Colic Risk Assessment (Feeding & Management)",
          url: "/pets/horse-colic-risk-assessment",
          icon: "🐎",
        },
        {
          title: "Heavy Metal (Lead/Zinc) Exposure Risk",
          url: "/pets/bird-heavy-metal-exposure-risk",
          icon: "💉",
        },
        {
          title: "Daily Water Requirement per Weight",
          url: "/pets/bird-daily-water-requirement-per-weight",
          icon: "💧",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Benadryl (Diphenhydramine) Dose Calculator for Cats",
        },
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
