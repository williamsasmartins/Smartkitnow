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

export default function SmallMammalParasiteTreatmentDoseReferenceCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and dose rate (mg/kg)
  const [inputs, setInputs] = useState({
    weight: "",
    doseRate: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const doseRateNum = parseFloat(inputs.doseRate);

    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      isNaN(doseRateNum) ||
      doseRateNum <= 0
    ) {
      return {
        value: 0,
        label: "Total Dose (mg)",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate total dose in mg
    const totalDoseMg = weightKg * doseRateNum;

    // Warning if dose is unusually high or low (arbitrary thresholds)
    let warning: string | null = null;
    if (totalDoseMg > 5000) {
      warning =
        "Calculated dose is very high. Please verify weight and dose rate inputs.";
    } else if (totalDoseMg < 1) {
      warning =
        "Calculated dose is very low. Please verify weight and dose rate inputs.";
    }

    return {
      value: totalDoseMg.toFixed(2),
      label: "Total Dose (mg)",
      subtext: `Based on weight (${weightNum} ${
        unit === "lb" ? "lbs" : "kg"
      }) and dose rate (${doseRateNum} mg/kg)`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is it important to calculate the parasite treatment dose accurately?",
      answer:
        "Accurate dosing ensures the medication is effective against parasites while minimizing the risk of toxicity or side effects. Underdosing can lead to treatment failure and parasite resistance, whereas overdosing can harm the animal’s health. Calculating the dose based on weight and recommended mg/kg dosage helps veterinarians and pet owners administer safe and effective treatments.",
    },
    {
      question: "How does weight unit conversion affect the dose calculation?",
      answer:
        "Weight unit conversion is critical because dose rates are typically given in mg per kilogram of body weight. If weight is entered in pounds without conversion, the calculated dose will be incorrect and potentially unsafe. This calculator converts pounds to kilograms internally to maintain accuracy regardless of the unit system selected.",
    },
    {
      question: "Can this calculator be used for all types of anti-parasitic medications?",
      answer:
        "This calculator provides a general framework for dose calculation based on weight and dose rate, which applies to many anti-parasitic drugs. However, specific medications may have unique dosing protocols, frequency, or contraindications. Always consult veterinary guidelines or a veterinarian before administering any medication to ensure safety and efficacy.",
    },
    {
      question: "What should I do if the calculated dose seems unusually high or low?",
      answer:
        "If the dose appears outside typical ranges, double-check the weight and dose rate inputs for accuracy. Extremely high or low doses may indicate input errors or inappropriate dose rates. When in doubt, consult a veterinarian to verify the correct dosage and avoid potential harm to the animal.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Animal Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="doseRate"
            className="text-slate-700 dark:text-slate-300"
          >
            Dose Rate (mg/kg)
          </Label>
          <Input
            id="doseRate"
            type="number"
            min="0"
            step="any"
            placeholder="Enter dose rate in mg/kg"
            value={inputs.doseRate}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, doseRate: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by setting state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", doseRate: "" })}
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
                {results.value}
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
              a vet for diagnosis.
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
          Understanding Parasite Treatment Dose Reference
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Parasite treatment dose references are essential tools in veterinary
          medicine that guide the administration of anti-parasitic medications
          based on an animal’s weight and the recommended dosage per kilogram. These
          references ensure that treatments are both safe and effective, minimizing
          the risk of underdosing, which can lead to treatment failure and parasite
          resistance, or overdosing, which can cause toxicity and adverse effects.
          Accurate dosing is particularly critical in small mammals, where even
          slight deviations can have significant health impacts.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          The dose reference typically involves calculating the total amount of
          medication required by multiplying the animal’s weight by the dose rate
          (expressed in mg/kg). This calculation must consider the unit system used,
          converting pounds to kilograms when necessary, to maintain precision. By
          adhering to these standards, veterinarians and pet owners can confidently
          administer treatments that effectively target parasites such as mites,
          fleas, and intestinal worms, promoting animal health and welfare.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          How to Use This Calculator
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator is designed to provide a straightforward method for
          determining the total dose of anti-parasitic medication based on your
          animal’s weight and the recommended dose rate. Begin by selecting the unit
          system that matches your measurement preference—imperial (pounds) or
          metric (kilograms). Then, enter the animal’s weight and the dose rate in
          milligrams per kilogram.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Select the unit system (Imperial or Metric).
          </li>
          <li>
            <strong>Step 2:</strong> Enter the animal’s weight in the chosen unit.
          </li>
          <li>
            <strong>Step 3:</strong> Input the recommended dose rate (mg/kg) for the
            specific medication.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to view the total dose in
            milligrams.
          </li>
          <li>
            <strong>Step 5:</strong> Review the result and any warnings before
            administering medication. Always consult a veterinarian if unsure.
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
              href="https://www.merckvetmanual.com/pharmacology/antiparasitic-drugs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Merck Veterinary Manual - Antiparasitic Drugs
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive overview of antiparasitic medications, dosing, and
              administration guidelines for veterinary use.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.aaha.org/guidelines/parasite-prevention/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. American Animal Hospital Association - Parasite Prevention Guidelines
            </a>
            <p className="text-slate-500 text-sm">
              Evidence-based recommendations for parasite control and treatment in
              companion animals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11339&id=4950919"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. Veterinary Information Network - Parasite Treatment Dosage Calculations
            </a>
            <p className="text-slate-500 text-sm">
              Practical guidance on calculating and administering parasite treatment
              doses safely.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Parasite Treatment Dose Reference"
      description="Reference guide for common anti-parasitic medication dosages (e.g., for mites, fleas, or intestinal parasites)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Total Dose (mg) = Weight (kg) × Dose Rate (mg/kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Animal's body weight in kilograms" },
          { symbol: "Dose Rate (mg/kg)", description: "Recommended medication dose per kilogram" },
          { symbol: "Total Dose (mg)", description: "Calculated total medication dose in milligrams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A small mammal weighs 4.4 lbs (2 kg) and requires a parasite treatment with a dose rate of 5 mg/kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms if necessary. Here, 4.4 lbs equals 2 kg.",
          },
          {
            label: "2",
            explanation:
              "Multiply the weight (2 kg) by the dose rate (5 mg/kg) to find the total dose.",
          },
          {
            label: "3",
            explanation: "Calculate: 2 kg × 5 mg/kg = 10 mg total dose.",
          },
        ],
        result: "The animal should receive a total dose of 10 mg of the medication.",
      }}
      relatedCalculators={[
        {
          title: "Horse Electrolyte Need Estimator (Exercise & Heat)",
          url: "/pets/horse-electrolyte-need-estimator",
          icon: "🐎",
        },
        {
          title: "Cat Calorie Needs (RER/MER) Calculator",
          url: "/pets/cat-calorie-needs-rer-mer",
          icon: "🐱",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
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
          title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs",
          url: "/pets/dog-benadryl-diphenhydramine-dose",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Parasite Treatment Dose Reference" },
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
