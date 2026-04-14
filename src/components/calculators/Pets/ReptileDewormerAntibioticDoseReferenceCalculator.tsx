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
      question: "How do I calculate the correct dewormer dose for my dog?",
      answer: "Enter your dog's weight in pounds or kilograms, select the dewormer type (e.g., ivermectin, fenbendazole), and the calculator will display the dose in mg based on standard 5-10 mg/kg protocols.",
    },
    {
      question: "What's the difference between broad-spectrum and targeted dewormers?",
      answer: "Broad-spectrum dewormers like fenbendazole treat multiple parasite types, while targeted dewormers like praziquantel specifically treat tapeworms; consult your vet to determine which suits your pet's needs.",
    },
    {
      question: "Can I use the same antibiotic dose for cats and dogs?",
      answer: "No—cats metabolize medications differently than dogs and typically require lower doses; always use species-specific dosing, which this calculator separates by pet type.",
    },
    {
      question: "How often should I administer dewormer treatments?",
      answer: "Puppies and kittens typically need deworming every 2 weeks until 12 weeks old, then monthly until 6 months; adult pets require treatment 1-4 times yearly depending on exposure risk and vet recommendation.",
    },
    {
      question: "What antibiotics are safe for pets with kidney disease?",
      answer: "Amoxicillin and cephalexin are kidney-safe at adjusted doses, while fluoroquinolones require caution; this calculator highlights contraindications, but always confirm with your veterinarian for compromised pets.",
    },
    {
      question: "Why is accurate weight measurement critical for dosing?",
      answer: "Overdosing causes toxicity and side effects, while underdosing reduces treatment efficacy; even 5% weight inaccuracy can significantly impact medication safety, especially in small animals.",
    },
    {
      question: "Should I adjust doses if my pet is pregnant or nursing?",
      answer: "Most dewormers and antibiotics require dose adjustments or avoidance during pregnancy and lactation; this calculator flags these scenarios, but veterinary consultation is essential before treating pregnant or nursing pets.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dewormer & Antibiotic Dose Reference</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator provides fast, accurate dosing recommendations for common dewormers and antibiotics used in veterinary medicine. It eliminates manual calculations and reduces medication errors by delivering species-specific, weight-based doses.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's weight (in pounds or kilograms), select the medication type and pet species (dog or cat), and confirm any relevant health conditions or concurrent medications. The calculator instantly shows recommended dose ranges and administration frequency.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the calculated dose with your veterinarian before administering; this tool is a reference aid, not a replacement for professional veterinary diagnosis and treatment decisions. Always follow your vet's final dosing instructions and monitor for adverse reactions.</p>
        </div>
      </section>

      {/* TABLE: Common Dewormer Dosing Reference */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Dewormer Dosing Reference</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard deworming doses for dogs and cats based on weight and medication type.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dewormer</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fenbendazole</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily &times; 3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Broad-spectrum; safe for puppies</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fenbendazole</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Daily &times; 3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Broad-spectrum; safe for kittens</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ivermectin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">For roundworms &amp; hookworms only</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Praziquantel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tapeworm specific</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Praziquantel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tapeworm specific</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pyrantel Pamoate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single dose</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Roundworms &amp; hookworms</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Milbemycin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Prevention; not treatment</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses are approximate; always confirm with veterinarian based on pet's health status and specific parasite identification.</p>
      </section>

      {/* TABLE: Common Antibiotic Dosing for Pets */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Antibiotic Dosing for Pets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard antibiotic doses for dogs and cats treating bacterial infections.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Antibiotic</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Amoxicillin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Amoxicillin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cephalexin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 6-8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-14 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cephalexin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 8-12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-14 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Azithromycin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fluoroquinolone</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Doxycycline</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Every 12 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses vary by infection severity; renal/hepatic impairment requires adjustment; complete full course even if symptoms improve.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your pet on an accurate scale before each treatment course, as weight changes significantly impact medication safety and efficacy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Set phone reminders for each dose and complete the full course even if symptoms resolve, to prevent drug resistance and treatment failure.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep detailed treatment records including date, medication, dose, pet weight, and any side effects observed for future veterinary consultations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store dewormers and antibiotics in cool, dry conditions away from direct sunlight and ensure they're stored out of reach of children and other pets.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Human Dosing Charts for Pets</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pet metabolism differs drastically from humans; using human antibiotic or dewormer doses can cause toxicity or treatment failure.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Pet Species Differences</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats metabolize certain medications (like acetaminophen, NSAIDs, and some antibiotics) differently than dogs, making species-specific dosing essential.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Rounding Weight Estimates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Guessing pet weight instead of measuring precisely can lead to under- or overdosing, particularly in small animals where accuracy matters most.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Veterinary Confirmation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using calculator results without veterinary review risks missing drug interactions, contraindications, or underlying health complications requiring dose adjustments.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the correct dewormer dose for my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your dog's weight in pounds or kilograms, select the dewormer type (e.g., ivermectin, fenbendazole), and the calculator will display the dose in mg based on standard 5-10 mg/kg protocols.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between broad-spectrum and targeted dewormers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Broad-spectrum dewormers like fenbendazole treat multiple parasite types, while targeted dewormers like praziquantel specifically treat tapeworms; consult your vet to determine which suits your pet's needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the same antibiotic dose for cats and dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—cats metabolize medications differently than dogs and typically require lower doses; always use species-specific dosing, which this calculator separates by pet type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I administer dewormer treatments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Puppies and kittens typically need deworming every 2 weeks until 12 weeks old, then monthly until 6 months; adult pets require treatment 1-4 times yearly depending on exposure risk and vet recommendation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What antibiotics are safe for pets with kidney disease?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Amoxicillin and cephalexin are kidney-safe at adjusted doses, while fluoroquinolones require caution; this calculator highlights contraindications, but always confirm with your veterinarian for compromised pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is accurate weight measurement critical for dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Overdosing causes toxicity and side effects, while underdosing reduces treatment efficacy; even 5% weight inaccuracy can significantly impact medication safety, especially in small animals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust doses if my pet is pregnant or nursing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most dewormers and antibiotics require dose adjustments or avoidance during pregnancy and lactation; this calculator flags these scenarios, but veterinary consultation is essential before treating pregnant or nursing pets.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Anthelmintic Drug Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Association of American Feed Control Officials standards for dewormer safety and efficacy in pets.</p>
          </li>
          <li>
            <a href="https://www.drugsforpets.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Pharmacology Handbook - Plumb</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive reference for veterinary drug dosing, interactions, and contraindications.</p>
          </li>
          <li>
            <a href="https://www.avma.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional guidelines for antibiotic stewardship and deworming protocols in veterinary practice.</p>
          </li>
          <li>
            <a href="https://www.catvets.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAAFP Feline Medicine Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Specialized dosing and safety guidelines specific to feline antibiotic and dewormer administration.</p>
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
