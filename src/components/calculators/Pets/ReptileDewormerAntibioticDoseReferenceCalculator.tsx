import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function ReptileDewormerAntibioticDoseReferenceCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and drug selection
  const [inputs, setInputs] = useState({
    weight: "",
    drug: "",
  });

  // Dewormer & Antibiotic dose data (mg/kg) for common reptile drugs
  // Source: Veterinary pharmacology references
  const drugDoseData: Record<
    string,
    { name: string; doseMgPerKg: number; notes: string }
  > = {
    ivermectin: {
      name: "Ivermectin (Dewormer)",
      doseMgPerKg: 0.2,
      notes:
        "Commonly used for internal and external parasites in reptiles. Dose carefully to avoid toxicity.",
    },
    fenbendazole: {
      name: "Fenbendazole (Dewormer)",
      doseMgPerKg: 20,
      notes:
        "Broad-spectrum anthelmintic effective against nematodes and some protozoa. Usually given over multiple days.",
    },
    enrofloxacin: {
      name: "Enrofloxacin (Antibiotic)",
      doseMgPerKg: 10,
      notes:
        "Fluoroquinolone antibiotic used for bacterial infections. Dose based on weight and infection severity.",
    },
    ceftazidime: {
      name: "Ceftazidime (Antibiotic)",
      doseMgPerKg: 20,
      notes:
        "Third-generation cephalosporin antibiotic effective against gram-negative bacteria. Requires veterinary supervision.",
    },
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (
      isNaN(weightNum) ||
      weightNum <= 0 ||
      !inputs.drug ||
      !(inputs.drug in drugDoseData)
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightNum, unit);

    // Calculate dose in mg
    const doseMg = weightKg * drugDoseData[inputs.drug].doseMgPerKg;

    // Format dose to 2 decimals
    const doseFormatted = doseMg.toFixed(2);

    return {
      value: doseFormatted,
      label: `${drugDoseData[inputs.drug].name} Dose (mg)`,
      subtext: `Based on ${weightKg.toFixed(2)} kg body weight and dose of ${drugDoseData[inputs.drug].doseMgPerKg} mg/kg.`,
      warning:
        doseMg > 1000
          ? "High dose calculated. Confirm with veterinary guidelines before administration."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why is accurate weight measurement critical for dosing reptiles?",
      answer:
        "Accurate weight measurement is essential because drug dosages are calculated per kilogram of body weight. Underestimating weight can lead to subtherapeutic dosing, reducing treatment efficacy, while overestimating can cause toxicity. Reptiles have variable body compositions, so precise weight ensures safe and effective medication administration.",
    },
    {
      question: "How do dewormers and antibiotics differ in their use for reptiles?",
      answer:
        "Dewormers target parasitic worms and are used primarily to eliminate internal or external parasites. Antibiotics treat bacterial infections and are ineffective against parasites. Understanding the type of infection is crucial to selecting the correct medication and avoiding misuse, which can lead to resistance or harm.",
    },
    {
      question: "Can I use this calculator for all reptile species?",
      answer:
        "This calculator provides general dosing guidelines based on body weight but does not account for species-specific sensitivities or conditions. Some reptiles metabolize drugs differently, so always consult a veterinarian familiar with the species before treatment. This tool is an aid, not a substitute for professional advice.",
    },
    {
      question: "Why is veterinary supervision recommended even with dose references?",
      answer:
        "Veterinary supervision ensures the correct diagnosis, drug choice, and dosing tailored to the individual reptile's health status. Dosage references are guidelines and may not consider factors like age, organ function, or concurrent diseases. A vet can monitor for adverse reactions and adjust treatment as needed for safety and effectiveness.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit System Selector */}
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

      {/* Weight Input */}
      <div>
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Body Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          name="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={handleInputChange}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Use a precise scale to measure your reptile's weight for accurate dosing.
        </p>
      </div>

      {/* Drug Selector */}
      <div>
        <Label htmlFor="drug" className="text-slate-700 dark:text-slate-300">
          Select Drug
        </Label>
        <select
          id="drug"
          name="drug"
          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2"
          value={inputs.drug}
          onChange={handleInputChange}
          aria-describedby="drug-desc"
        >
          <option value="">-- Select a drug --</option>
          {Object.entries(drugDoseData).map(([key, data]) => (
            <option key={key} value={key}>
              {data.name}
            </option>
          ))}
        </select>
        <p id="drug-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Choose the dewormer or antibiotic prescribed or recommended by your veterinarian.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", drug: "" })}
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
          Understanding Dewormer & Antibiotic Dose Reference
        </h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          Dewormers and antibiotics are critical components in reptile healthcare, used to treat parasitic and bacterial infections respectively. Accurate dosing is essential because reptiles have unique metabolic rates and sensitivities compared to mammals, making precise calculations vital to avoid underdosing or toxicity. This reference guide provides standardized dosing based on body weight, helping caretakers and veterinarians ensure safe and effective treatment.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          The dosages listed are derived from veterinary pharmacology literature and clinical experience, reflecting common therapeutic ranges for reptiles. However, individual species differences, health status, and drug formulations can influence the appropriate dose. Therefore, this tool serves as a starting point, emphasizing the importance of veterinary consultation to tailor treatments to each reptile’s specific needs.
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          Understanding the pharmacokinetics and pharmacodynamics of these drugs in reptiles is complex, as factors like temperature, age, and organ function affect drug absorption and clearance. This calculator simplifies the process by focusing on weight-based dosing, which remains the cornerstone of veterinary drug administration. Users should always monitor their reptiles closely during treatment and report any adverse effects to a veterinarian immediately.
        </p>
      </section>

      <section id="how-to-use" className="scroll-mt-32">
        <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use This Calculator</h2>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          This calculator estimates the appropriate dose of selected dewormers or antibiotics based on your reptile’s body weight. Begin by selecting the unit system you prefer—imperial (pounds) or metric (kilograms)—and enter the accurate weight of your reptile. Next, choose the drug prescribed or recommended by your veterinarian from the dropdown menu. Once all inputs are entered, click “Calculate” to view the estimated dose in milligrams.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
          <li>
            <strong>Step 1:</strong> Weigh your reptile using a precise scale to ensure dosing accuracy.
          </li>
          <li>
            <strong>Step 2:</strong> Select the unit system matching your weight measurement.
          </li>
          <li>
            <strong>Step 3:</strong> Choose the appropriate drug from the list based on veterinary guidance.
          </li>
          <li>
            <strong>Step 4:</strong> Click “Calculate” to obtain the dose in milligrams, and follow your veterinarian’s instructions for administration frequency and duration.
          </li>
          <li>
            <strong>Step 5:</strong> Use the “Reset” button to clear inputs and perform new calculations as needed.
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
              href="https://www.vin.com/apputil/content/defaultadv1.aspx?pId=11339&catId=54128&id=4959587"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              1. Veterinary Information Network (VIN) – Reptile Pharmacology
            </a>
            <p className="text-slate-500 text-sm">
              Comprehensive resource on reptile drug dosages and pharmacokinetics, widely used by veterinary professionals.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/reptiles/pharmacology-of-reptiles"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              2. Merck Veterinary Manual – Pharmacology of Reptiles
            </a>
            <p className="text-slate-500 text-sm">
              Authoritative guide detailing drug use, dosing, and safety considerations specific to reptilian species.
            </p>
          </li>
          <li className="block">
            <a
              href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7159456/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-bold hover:underline text-lg"
            >
              3. National Center for Biotechnology Information (NCBI) – Reptile Antimicrobial Therapy
            </a>
            <p className="text-slate-500 text-sm">
              Peer-reviewed article discussing antimicrobial dosing strategies and resistance concerns in reptiles.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dewormer & Antibiotic Dose Reference"
      description="Reference guide for common dewormer and antibiotic dosages in reptiles by body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Body Weight (kg) × Dose (mg/kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total drug dose to administer" },
          { symbol: "Body Weight (kg)", description: "Reptile's body weight in kilograms" },
          { symbol: "Dose (mg/kg)", description: "Recommended drug dose per kilogram" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon weighs 2.2 lbs and requires ivermectin treatment for parasites.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 2.2 lbs ÷ 2.20462 = 1 kg approximately.",
          },
          {
            label: "2",
            explanation:
              "Multiply weight by ivermectin dose: 1 kg × 0.2 mg/kg = 0.2 mg total dose.",
          },
          {
            label: "3",
            explanation:
              "Administer 0.2 mg ivermectin as per veterinary instructions, monitoring for adverse effects.",
          },
        ],
        result: "The calculated ivermectin dose is 0.2 mg for this bearded dragon.",
      }}
      relatedCalculators={[
        {
          title: "CO₂ Injection Rate Calculator (Planted Tank)",
          url: "/pets/aquarium-co2-injection-rate-planted-tank",
          icon: "🐾",
        },
        { title: "Dog Chocolate Toxicity Calculator", url: "/pets/dog-chocolate-toxicity", icon: "🐶" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "🍖",
        },
        { title: "Heavy Metal (Lead/Zinc) Exposure Risk", url: "/pets/bird-heavy-metal-exposure-risk", icon: "💉" },
        { title: "Cat Weight Loss Planner", url: "/pets/cat-weight-loss-planner", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dewormer & Antibiotic Dose Reference" },
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
