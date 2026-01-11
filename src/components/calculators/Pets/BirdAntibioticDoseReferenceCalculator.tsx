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

export default function BirdAntibioticDoseReferenceCalculator() {
  // 1. STATE
  // Unit system default to imperial (lbs)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and dose per kg
  const [inputs, setInputs] = useState({
    weight: "",
    doseMgPerKg: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseNum = parseFloat(inputs.doseMgPerKg);

    if (isNaN(weightNum) || weightNum <= 0 || isNaN(doseNum) || doseNum <= 0) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for weight and dose.",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate total dose in mg
    const totalDoseMg = weightKg * doseNum;

    // Round to 2 decimals
    const roundedDose = Math.round(totalDoseMg * 100) / 100;

    // Warning if dose is unusually high or low (example threshold)
    let warning = null;
    if (doseNum < 5) {
      warning =
        "The dose entered is quite low; ensure this matches veterinary guidelines for the specific antibiotic.";
    } else if (doseNum > 50) {
      warning =
        "The dose entered is high; double-check with a veterinary professional to avoid toxicity.";
    }

    return {
      value: roundedDose,
      label: "Total Antibiotic Dose (mg)",
      subtext: `Based on ${weightKg.toFixed(2)} kg body weight and ${doseNum} mg/kg dose.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is dosing antibiotics by mg/kg important in birds?",
      answer:
        "Dosing antibiotics by mg/kg ensures that each bird receives an accurate amount of medication based on its body weight, which is critical for efficacy and safety. Birds vary widely in size, so a fixed dose could lead to underdosing or overdosing. Proper dosing helps prevent antibiotic resistance and adverse effects by tailoring treatment to the individual bird's needs.",
    },
    {
      question: "How do I convert weight from pounds to kilograms for this calculator?",
      answer:
        "This calculator automatically converts weight from pounds to kilograms when the imperial unit system is selected. Since veterinary dosing guidelines are typically based on mg/kg, accurate conversion is essential. Simply enter the bird's weight in pounds, and the calculator handles the rest to provide a precise dose.",
    },
    {
      question: "What should I do if the recommended dose varies between sources?",
      answer:
        "When dosing recommendations differ, it is important to consult a qualified avian veterinarian who can interpret the data in the context of your bird’s species, health status, and infection severity. Variations may arise due to different antibiotic formulations or resistance patterns. Always prioritize professional guidance over generalized references to ensure safe and effective treatment.",
    },
    {
      question: "Can I use this calculator for all bird species?",
      answer:
        "While this calculator provides a general dosing reference based on body weight, antibiotic sensitivity and metabolism can vary significantly among bird species. It is best used as a starting point or educational tool rather than a definitive dosing guide. Always confirm species-specific dosing and treatment protocols with a veterinarian experienced in avian medicine.",
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
            Bird Weight ({unit})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="doseMgPerKg" className="text-slate-700 dark:text-slate-300">
            Antibiotic Dose (mg/kg)
          </Label>
          <Input
            id="doseMgPerKg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter dose in mg per kg"
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
            // Trigger recalculation by updating state (already handled by useMemo)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseMgPerKg: "" })}
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
          Understanding Antibiotic Dose Reference (mg/kg)
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Antibiotic dosing in birds is a critical aspect of veterinary care that ensures effective treatment of infections while minimizing the risk of toxicity or resistance. The dose is typically calculated based on the bird's body weight, expressed in milligrams of antibiotic per kilogram of body weight (mg/kg). This weight-based dosing accounts for the wide range of sizes and metabolic rates across different bird species, providing a tailored approach to medication administration.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Using mg/kg dosing helps veterinarians deliver precise amounts of antibiotics, which is essential because birds have unique physiology and drug metabolism compared to mammals. Overdosing can lead to harmful side effects, while underdosing may result in ineffective treatment and promote antibiotic resistance. This reference tool supports clinicians and bird owners by simplifying the calculation process, ensuring safer and more accurate dosing.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          It is important to remember that antibiotic dosing should always be guided by a qualified veterinarian who considers the specific antibiotic, bird species, health status, and infection severity. This calculator serves as an educational and practical aid but does not replace professional veterinary advice. Proper dosing contributes to better health outcomes and responsible antibiotic stewardship in avian medicine.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator helps you estimate the total antibiotic dose required for a bird based on its body weight and the prescribed dose per kilogram. Begin by selecting the unit system that corresponds to your bird’s weight measurement—either imperial (pounds) or metric (kilograms). Then, enter the bird’s weight and the antibiotic dose recommended in mg/kg.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric) to match how you measure your bird’s weight.
          </li>
          <li>
            <strong>Step 2:</strong> Enter the bird’s weight in the chosen unit. The calculator will convert pounds to kilograms automatically if needed.
          </li>
          <li>
            <strong>Step 3:</strong> Input the antibiotic dose in mg per kilogram as prescribed by your veterinarian or reference guide.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to see the total antibiotic dose in milligrams that should be administered.
          </li>
          <li>
            <strong>Step 5:</strong> Review any warnings or notes provided and always confirm dosing with a veterinary professional before administration.
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
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/birds/antimicrobial-therapy-in-birds"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Antimicrobial Therapy in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive guide on antibiotic use in avian species, including dosing principles and drug selection.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aav.org/resources/avian-medicine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Association of Avian Veterinarians - Avian Medicine Resources
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative resources and guidelines for avian veterinary care, including pharmacology and dosing.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7151207/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. NCBI - Pharmacokinetics and Dosing of Antibiotics in Birds
            </a>
            <p className="text-slate-500 text-sm">
              Scientific article discussing antibiotic pharmacokinetics and dosing considerations in avian species.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Antibiotic Dose Reference (mg/kg)"
      description="Reference guide for common antibiotic dosages in birds by body weight (mg/kg)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Dose (mg) = Body Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Bird's body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Antibiotic dose per kilogram of body weight" },
          { symbol: "Total Dose (mg)", description: "Calculated total antibiotic dose in milligrams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) parakeet requires an antibiotic dose of 20 mg/kg. Calculate the total dose in milligrams.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed. Here, 2.2 lbs equals approximately 1 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply the body weight (1 kg) by the dose (20 mg/kg) to find the total dose.",
          },
          {
            label: "3",
            explanation: "Total Dose = 1 kg × 20 mg/kg = 20 mg.",
          },
        ],
        result: "The parakeet should receive a total antibiotic dose of 20 mg.",
      }}
      relatedCalculators={[
        { title: "Heavy Metal (Lead/Zinc) Exposure Risk", url: "/pets/bird-heavy-metal-exposure-risk", icon: "🐾" },
        { title: "Dehydration Risk Estimator (Symptoms + Intake)", url: "/pets/cat-dehydration-risk-estimator", icon: "🐶" },
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Shedding & Combing Time Planner", url: "/pets/cat-shedding-combing-time-planner", icon: "🍖" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Antibiotic Dose Reference (mg/kg)" },
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
