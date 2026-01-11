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
import { weightToKg } from "@/lib/utils";

export default function BirdCalciumSupplementDosageBreedingFemalesCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and calcium requirement factor (mg/kg)
  // Commonly, calcium supplementation for breeding females is around 50-100 mg/kg body weight per day,
  // but we will allow user input for mg/kg dose to customize.
  const [inputs, setInputs] = useState({
    weight: "",
    doseMgPerKg: "80", // default typical dose mg/kg for breeding females
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseNum = parseFloat(inputs.doseMgPerKg);

    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "Invalid weight",
        subtext: "Please enter a valid positive weight.",
        warning: null,
      };
    }
    if (isNaN(doseNum) || doseNum <= 0) {
      return {
        value: 0,
        label: "Invalid dose",
        subtext: "Please enter a valid positive dose in mg/kg.",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate total calcium dose in mg
    const totalDoseMg = weightKg * doseNum;

    // Format result with commas and fixed decimals
    const formattedDose = totalDoseMg.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return {
      value: formattedDose,
      label: `Total Calcium Supplement Dose (mg/day)`,
      subtext: `Based on weight ${weightNum} ${unit} and dose ${doseNum} mg/kg`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is calcium supplementation important for breeding female birds?",
      answer:
        "Calcium is a critical mineral for breeding female birds because it supports eggshell formation and overall reproductive health. Insufficient calcium can lead to weak eggshells, egg binding, and metabolic bone disease. Supplementing calcium ensures females have adequate reserves during the high-demand breeding and egg-laying periods.",
    },
    {
      question: "How do I determine the correct calcium dose for my bird?",
      answer:
        "The correct calcium dose depends primarily on the bird's body weight and reproductive status. Breeding females require higher calcium intake, typically calculated in milligrams per kilogram of body weight per day. Consulting with a veterinarian and using a dosage calculator helps tailor supplementation to the individual bird's needs safely.",
    },
    {
      question: "Can too much calcium be harmful to breeding females?",
      answer:
        "Yes, excessive calcium supplementation can cause hypercalcemia, leading to kidney damage, soft tissue calcification, and impaired absorption of other minerals. It is essential to provide calcium within recommended limits and monitor the bird's health regularly. Balanced nutrition and veterinary guidance help prevent overdose risks.",
    },
    {
      question: "What forms of calcium supplements are best for breeding females?",
      answer:
        "Common calcium supplements include calcium carbonate, calcium citrate, and cuttlebone, each with different absorption rates. Cuttlebone provides a natural source and encourages foraging behavior, while powders and liquids allow precise dosing. Selecting the appropriate form depends on the bird species, preference, and ease of administration.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "lb" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="doseMgPerKg" className="text-slate-700 dark:text-slate-300">
            Calcium Dose (mg/kg body weight per day)
          </Label>
          <Input
            id="doseMgPerKg"
            type="number"
            min="0"
            step="any"
            placeholder="Typical: 50-100 mg/kg"
            value={inputs.doseMgPerKg}
            onChange={(e) => setInputs((prev) => ({ ...prev, doseMgPerKg: e.target.value }))}
          />
        </div>
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
          onClick={() => setInputs({ weight: "", doseMgPerKg: "80" })}
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
          Understanding Calcium Supplement Dosage (Breeding Females)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Calcium plays a vital role in the reproductive health of breeding female birds, particularly during egg formation. Adequate calcium intake ensures strong eggshell development and supports metabolic functions that are critical during the high-demand breeding period. Without sufficient calcium, females may suffer from complications such as egg binding, weak shells, or metabolic bone disease, which can severely impact their health and reproductive success.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The calcium requirement for breeding females is significantly higher than for non-breeding birds due to the mineral's role in eggshell calcification. Supplementation must be carefully calculated based on the bird’s body weight to avoid both deficiency and toxicity. This balance is crucial because excessive calcium can lead to health issues such as kidney damage and mineral imbalances, while inadequate calcium compromises egg quality and female vitality.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Veterinary professionals recommend calculating calcium supplementation in milligrams per kilogram of body weight per day to tailor dosing precisely. This approach allows for adjustments based on species, size, and breeding stage, ensuring optimal health outcomes. Using a scientifically grounded dosage calculator helps bird owners and veterinarians provide safe, effective calcium supplementation during breeding cycles.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the total daily calcium supplement dose required for breeding female birds based on their body weight and the desired dose in milligrams per kilogram. Begin by selecting your preferred unit system—imperial (pounds) or metric (kilograms)—to enter the bird’s weight accurately. Then input the calcium dose per kilogram, which typically ranges between 50 and 100 mg/kg for breeding females.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Enter the bird’s weight in the selected unit system. Ensure the value is positive and accurate for best results.
          </li>
          <li>
            <strong>Step 2:</strong> Input the calcium dose in mg/kg body weight per day. The default is set to 80 mg/kg, a common recommendation for breeding females.
          </li>
          <li>
            <strong>Step 3:</strong> Click “Calculate” to view the total calcium supplement dose in milligrams per day.
          </li>
          <li>
            <strong>Step 4:</strong> Use the result to guide supplementation, and always consult a veterinarian to confirm dosing and monitor your bird’s health.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/nutrition-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual: Nutrition in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on avian nutrition including calcium requirements and supplementation strategies for breeding birds.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6520897/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Calcium Metabolism in Birds - NCBI PMC
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article detailing calcium metabolism and its importance in avian reproduction and health.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/page/avian-nutrition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Association of Avian Veterinarians: Avian Nutrition
            </a>
            <p className="text-slate-500 text-sm">
              Professional resource offering guidelines on nutritional management including calcium supplementation for breeding birds.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Calcium Supplement Dosage (Breeding Females)"
      description="Determine the appropriate calcium supplement dose for egg-laying and breeding female birds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Calcium Dose (mg) = Body Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Bird's body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Calcium dose per kilogram of body weight per day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A breeding female parrot weighs 4.4 lbs (2 kg) and requires 80 mg of calcium per kg of body weight daily during egg-laying.",
        steps: [
          { label: "1", explanation: "Convert weight to kilograms if needed (4.4 lbs = 2 kg)." },
          { label: "2", explanation: "Multiply weight by dose: 2 kg × 80 mg/kg = 160 mg total calcium per day." },
          { label: "3", explanation: "Administer 160 mg of calcium supplement daily, adjusting as advised by a vet." },
        ],
        result: "The bird should receive approximately 160 mg of calcium supplement daily during breeding.",
      }}
      relatedCalculators={[
        { title: "Pond Volume & Liner Size Calculator", url: "/pets/pond-volume-liner-size", icon: "🐾" },
        {
          title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)",
          url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk",
          icon: "🐶",
        },
        { title: "Litter Box Output Tracker (Normal vs. Increased)", url: "/pets/cat-litter-box-output-tracker", icon: "🐱" },
        { title: "Whelping Countdown & Stage Timeline", url: "/pets/dog-whelping-countdown-stage-timeline", icon: "🍖" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Cage Size Requirement Calculator", url: "/pets/small-mammal-cage-size-requirement", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Calcium Supplement Dosage (Breeding Females)" },
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
