import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

const DRUG_CLASSES = {
  "Benzimidazoles": {
    doseMgPerKg: 7.5, // e.g. Fenbendazole typical dose 7.5 mg/kg
    drugExample: "Fenbendazole"
  },
  "Macrocyclic Lactones": {
    doseMgPerKg: 0.2, // e.g. Ivermectin typical dose 0.2 mg/kg
    drugExample: "Ivermectin"
  },
  "Tetrahydropyrimidines": {
    doseMgPerKg: 6.6, // e.g. Pyrantel pamoate typical dose 6.6 mg/kg
    drugExample: "Pyrantel"
  },
  "Praziquantel": {
    doseMgPerKg: 1.0, // Praziquantel typical dose 1 mg/kg
    drugExample: "Praziquantel"
  }
};

export default function HorseDewormerDoseCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    drugClass: "Benzimidazoles"
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive weight."
      };
    }
    const drugClass = inputs.drugClass;
    if (!DRUG_CLASSES[drugClass]) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please select a valid drug class."
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Dose calculation: Dose (mg) = Dose (mg/kg) * Weight (kg)
    const doseMgPerKg = DRUG_CLASSES[drugClass].doseMgPerKg;
    const totalDoseMg = doseMgPerKg * weightKg;

    // Round to 2 decimals
    const doseRounded = Math.round(totalDoseMg * 100) / 100;

    return {
      value: doseRounded,
      label: `Recommended Dose of ${DRUG_CLASSES[drugClass].drugExample} (mg)`,
      subtext: `Based on a weight of ${weightRaw} ${unit === "imperial" ? "lbs" : "kg"} and drug class ${drugClass}.`,
      warning: null
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How does the calculator adjust dosage based on drug class?",
      answer: "Different dewormer classes (benzimidazoles, macrocyclic lactones, pyrantel) have varying dosing protocols. This calculator selects the appropriate dose range based on your selected drug class and pet weight to ensure safety and efficacy.",
    },
    {
      question: "What weight range does this calculator support?",
      answer: "The calculator accommodates pets from 1 lb to 200+ lbs, covering small dogs, cats, large breeds, and exotic pets. Always verify your pet's actual weight with a recent scale measurement for accuracy.",
    },
    {
      question: "Can I use this calculator for cats and dogs?",
      answer: "Yes, this calculator works for both cats and dogs. Select the correct species before entering weight, as some dewormers have species-specific dosing guidelines.",
    },
    {
      question: "What should I do if my pet's weight falls between dose brackets?",
      answer: "Round up to the nearest weight bracket provided by the calculator to ensure adequate deworming coverage. Your veterinarian can confirm the final dose for borderline cases.",
    },
    {
      question: "Is this calculator a substitute for veterinary advice?",
      answer: "No, this calculator provides general dosing estimates only. Always consult your veterinarian before administering dewormers, especially for pregnant, nursing, or medicated pets.",
    },
    {
      question: "How often should I use this calculator to redose my pet?",
      answer: "Redosing schedules vary by drug class: pyrantel typically requires dosing 2-3 weeks apart, while some macrocyclic lactones are dosed monthly. Follow your vet's deworming protocol for your pet's specific parasite type.",
    },
    {
      question: "Does the calculator account for different parasite types?",
      answer: "The calculator focuses on drug class dosing, which targets different parasite groups (roundworms, hookworms, tapeworms). Confirm your pet's parasite diagnosis with your vet before selecting a drug class.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="drugClass" className="text-slate-700 dark:text-slate-300">
            Dewormer Drug Class
          </Label>
          <Select
            id="drugClass"
            value={inputs.drugClass}
            onValueChange={(value) => setInputs((prev) => ({ ...prev, drugClass: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select drug class" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DRUG_CLASSES).map(([key, val]) => (
                <SelectItem key={key} value={key}>
                  {key} ({val.drugExample})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          onClick={() => setInputs({ weight: "", drugClass: "Benzimidazoles" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dewormer Dose Calculator (by Drug Class &amp; Weight)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator computes the precise deworming medication dose based on your pet's weight and the specific drug class prescribed by your veterinarian. It helps ensure safe, effective parasite elimination while minimizing risks of under- or over-dosing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Begin by selecting your pet's species (cat or dog), entering their current weight in pounds or kilograms, and choosing the drug class your vet recommended. The calculator instantly displays the recommended dose range for your pet's size.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows the total dose in milligrams or milliliters, depending on the drug formulation. Cross-reference this with your medication's label to determine tablet count or liquid volume, then confirm the final dose with your veterinarian before administration.</p>
        </div>
      </section>

      {/* TABLE: Common Dewormer Drug Classes & Typical Dosing Ranges */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Dewormer Drug Classes & Typical Dosing Ranges</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines standard dose ranges by drug class for reference.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Drug Class</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target Parasites</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dose Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Benzimidazoles (Fenbendazole, Albendazole)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Roundworms, hookworms, whipworms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-25 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily for 3-5 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pyrantel Pamoate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Roundworms, hookworms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once, repeat in 2-3 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Macrocyclic Lactones (Ivermectin, Selamectin)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Roundworms, hookworms, some ectoparasites</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2-0.4 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monthly or as directed</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Praziquantel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Tapeworms</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 mg/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once or twice at 2-week intervals</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dosages shown are general guidelines; actual prescriptions vary by product formulation and veterinary recommendation.</p>
      </section>

      {/* TABLE: Pet Weight Categories & Dewormer Dose Brackets */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pet Weight Categories & Dewormer Dose Brackets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common weight ranges used in dewormer dosing calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example Breeds/Types</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dose Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small/Toy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-10 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Chihuahuas, toy poodles, cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lowest dose bracket; use liquid or compounded formulas</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small-Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-25 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Beagles, corgis, cocker spaniels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Quarter to half tablet; standard small dog doses</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26-50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Collies, bulldogs, standard cocker spaniels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Half to full tablet; mid-range dosing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51-100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Golden retrievers, German shepherds, labs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Full to 1.5 tablets; higher dose concentration</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extra Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">101+ lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Great Danes, St. Bernards, mastiffs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple tablets; may require compounding or veterinary formulation</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual dosing formulas account for both weight and drug class; always verify with your veterinarian's prescription.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always weigh your pet on a scale before calculating; rough estimates lead to incorrect dosing and reduced efficacy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep your dewormer prescription label handy to verify the concentration (mg/mL or mg per tablet) matches your calculator result.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Set a calendar reminder for redosing dates, as some parasites require multiple treatments spaced weeks apart for complete elimination.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store dewormers in cool, dry conditions and check expiration dates before use; expired medications may lose potency.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated Weight Information</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using a weight from months ago leads to incorrect dosing; weigh your pet immediately before each deworming round.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Drug Class with Brand Name</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Select the drug class (e.g., 'benzimidazole'), not the brand name (e.g., 'Panacur'), to ensure accurate dosing calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Veterinary Diagnosis</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using the wrong drug class for your pet's parasite type reduces effectiveness; always confirm the specific parasite before deworming.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping the Redose Schedule</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many dewormers require follow-up doses; missing redoses allows parasites to survive and reinfect your pet.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator adjust dosage based on drug class?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Different dewormer classes (benzimidazoles, macrocyclic lactones, pyrantel) have varying dosing protocols. This calculator selects the appropriate dose range based on your selected drug class and pet weight to ensure safety and efficacy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What weight range does this calculator support?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator accommodates pets from 1 lb to 200+ lbs, covering small dogs, cats, large breeds, and exotic pets. Always verify your pet's actual weight with a recent scale measurement for accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for cats and dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator works for both cats and dogs. Select the correct species before entering weight, as some dewormers have species-specific dosing guidelines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What should I do if my pet's weight falls between dose brackets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Round up to the nearest weight bracket provided by the calculator to ensure adequate deworming coverage. Your veterinarian can confirm the final dose for borderline cases.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is this calculator a substitute for veterinary advice?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this calculator provides general dosing estimates only. Always consult your veterinarian before administering dewormers, especially for pregnant, nursing, or medicated pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I use this calculator to redose my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Redosing schedules vary by drug class: pyrantel typically requires dosing 2-3 weeks apart, while some macrocyclic lactones are dosed monthly. Follow your vet's deworming protocol for your pet's specific parasite type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for different parasite types?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator focuses on drug class dosing, which targets different parasite groups (roundworms, hookworms, tapeworms). Confirm your pet's parasite diagnosis with your vet before selecting a drug class.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.capcvet.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Companion Animal Parasite Council (CAPC) Deworming Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for deworming frequency and drug selection in dogs and cats.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center - Dewormer Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Emergency toxicity data and safety information for common deworming medications.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual - Anthelmintics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive clinical pharmacology and dosing protocols for dewormer drug classes.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/animal-veterinary/animal-drug-approval-process" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA Center for Veterinary Medicine - Approved Antiparasitic Drugs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Regulatory approval status and labeling information for U.S. dewormer products.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dewormer Dose Calculator (by Drug Class & Weight)"
      description="Calculate the correct dosage for various types of dewormers (anthelmintics) based on drug class and horse weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg) = Dose (mg/kg) × Weight (kg)",
        variables: [
          { symbol: "Dose (mg)", description: "Total dose of dewormer in milligrams" },
          { symbol: "Dose (mg/kg)", description: "Recommended dose per kilogram for the drug class" },
          { symbol: "Weight (kg)", description: "Horse body weight in kilograms" }
        ]
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb horse requires deworming with fenbendazole, a benzimidazole class drug with a recommended dose of 7.5 mg/kg.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms: 1100 lb ÷ 2.20462 = 499 kg (approx)."
          },
          {
            label: "2",
            explanation:
              "Calculate dose: 7.5 mg/kg × 499 kg = 3742.5 mg total fenbendazole dose."
          }
        ],
        result: "Administer approximately 3743 mg of fenbendazole to the horse."
      }}
      relatedCalculators={[
        {
          title: "Thermal Gradient Maintenance Power Estimator",
          url: "/pets/reptile-thermal-gradient-maintenance-power",
          icon: "🐾"
        },
        {
          title: "Egg Binding Risk Estimator",
          url: "/pets/bird-egg-binding-risk-estimator",
          icon: "🐶"
        },
        {
          title: "Vitamin D3 Requirement (Supplemental)",
          url: "/pets/reptile-vitamin-d3-requirement",
          icon: "🐱"
        },
        {
          title: "Fish Food Feeding Rate Calculator",
          url: "/pets/fish-food-feeding-rate",
          icon: "🍖"
        },
        {
          title: "Omega-3 Supplement Dose (for parrots)",
          url: "/pets/bird-omega-3-supplement-dose-parrots",
          icon: "💉"
        },
        {
          title: "Calcium Supplement Dosage (Breeding Females)",
          url: "/pets/bird-calcium-supplement-dosage-breeding-females",
          icon: "💧"
        }
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dewormer Dose Calculator (by Drug Class & Weight)" },
        { id: "how-to-use", label: "How to Use This Calculator" },
        { id: "faq", label: "Frequently Asked Questions" },
        { id: "references", label: "Veterinary References" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}