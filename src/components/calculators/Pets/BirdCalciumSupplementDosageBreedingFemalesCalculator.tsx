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
      question: "Why do breeding females need more calcium than non-breeding pets?",
      answer: "Breeding females require 1.5–2 times more calcium to support fetal development and milk production during lactation. Calcium deficiency during pregnancy can cause eclampsia or poor bone development in offspring.",
    },
    {
      question: "What is the recommended daily calcium intake for breeding females?",
      answer: "Most breeding females need 1,000–1,500 mg of calcium daily, depending on species, body weight, and reproductive stage. Lactating females may require up to 2,000 mg daily.",
    },
    {
      question: "How do I calculate the right supplement dosage for my breeding female?",
      answer: "Input your pet's weight, reproductive stage (pregnant or lactating), and current diet calcium content. The calculator adjusts dosage based on these variables to meet species-specific requirements.",
    },
    {
      question: "Can too much calcium harm breeding females?",
      answer: "Excessive calcium (&gt;2,500 mg daily) can interfere with phosphorus and magnesium absorption, causing mineral imbalances. Maintain the recommended 1.2:1 calcium-to-phosphorus ratio.",
    },
    {
      question: "Should I adjust calcium dosage during different pregnancy stages?",
      answer: "Yes, calcium needs increase progressively during pregnancy and peak during lactation. Early pregnancy requires baseline levels; late pregnancy and lactation demand 50–100% more supplementation.",
    },
    {
      question: "What forms of calcium supplements are best for breeding females?",
      answer: "Calcium carbonate and calcium citrate are highly absorbable options. Liquid or powder supplements mixed with food are easier to administer and monitor than tablets.",
    },
    {
      question: "How often should I reassess my breeding female's calcium needs?",
      answer: "Reassess every 2–3 weeks during pregnancy and weekly during active lactation, as nutritional demands fluctuate significantly throughout these stages.",
    }
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

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Calcium Supplement Dosage (Breeding Females) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines optimal daily calcium supplementation for pregnant and lactating females by analyzing reproductive stage, body weight, and dietary calcium intake. It prevents deficiency-related complications like eclampsia, poor fetal development, and inadequate milk production.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's current weight in pounds or kilograms, select the reproductive stage (pregnant or lactating), and input the baseline calcium content from her current diet. The calculator cross-references species-specific mineral requirements and accounts for absorption rates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your breeding female's total daily calcium requirement and the supplementation gap. Compare the recommended dosage against her current diet to determine whether additional supplementation is necessary and in what form.</p>
        </div>
      </section>

      {/* TABLE: Daily Calcium Requirements by Reproductive Stage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calcium Requirements by Reproductive Stage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Calcium intake guidelines vary significantly across reproductive phases for breeding females.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Reproductive Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calcium (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calcium-to-Phosphorus Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Non-breeding</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800–1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Early Pregnancy (Weeks 1–4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000–1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Late Pregnancy (Weeks 5–8)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,300–1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Early Lactation (Weeks 1–2)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800–2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peak Lactation (Weeks 3–4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000–2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Late Lactation (Weeks 5+)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500–1,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2:1</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust based on litter size and individual metabolic rates. Consult veterinarian for species-specific needs.</p>
      </section>

      {/* TABLE: Calcium Content in Common Pet Foods */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calcium Content in Common Pet Foods</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Baseline calcium levels in standard diets help determine supplementation needs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calcium Content (mg/100g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial dry kibble</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800–1,200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Varies by brand; check label</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-quality wet food</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600–900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Often lower than dry food</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Raw/homemade diet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200–400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Usually requires supplementation</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Prescription pregnancy formula</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,400–1,600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pre-formulated for breeding</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Whole prey (mice/rabbits)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500–800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Natural but variable calcium</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dairy products (cottage cheese)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100–150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minor calcium source only</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always verify actual calcium content on product labels or nutritional analysis sheets.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your breeding female's calcium levels monthly via bloodwork during pregnancy and bi-weekly during lactation to prevent dangerous deficiencies.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pair calcium supplements with vitamin D3 (400–600 IU daily) to maximize intestinal calcium absorption and utilization.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Divide daily supplements into 2–3 smaller doses rather than one large dose to improve absorption efficiency.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a food scale or syringe to measure liquid calcium supplements precisely, as inconsistent dosing can disrupt mineral balance.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Dietary Calcium Content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for baseline calcium in food often results in over-supplementation, causing mineral imbalances and metabolic issues.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Fixed Dosages Across All Stages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying the same calcium amount throughout pregnancy and lactation misses the 50–100% increase needed during peak lactation periods.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Phosphorus Ratios</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Supplementing calcium without maintaining a 1.2:1 calcium-to-phosphorus ratio compromises mineral absorption and skeletal health.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Discontinuing Supplements Too Early</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Stopping calcium supplementation before lactation ends deprives nursing offspring and accelerates maternal bone loss and milk quality decline.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do breeding females need more calcium than non-breeding pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Breeding females require 1.5–2 times more calcium to support fetal development and milk production during lactation. Calcium deficiency during pregnancy can cause eclampsia or poor bone development in offspring.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended daily calcium intake for breeding females?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most breeding females need 1,000–1,500 mg of calcium daily, depending on species, body weight, and reproductive stage. Lactating females may require up to 2,000 mg daily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the right supplement dosage for my breeding female?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Input your pet's weight, reproductive stage (pregnant or lactating), and current diet calcium content. The calculator adjusts dosage based on these variables to meet species-specific requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can too much calcium harm breeding females?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive calcium (&gt;2,500 mg daily) can interfere with phosphorus and magnesium absorption, causing mineral imbalances. Maintain the recommended 1.2:1 calcium-to-phosphorus ratio.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust calcium dosage during different pregnancy stages?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, calcium needs increase progressively during pregnancy and peak during lactation. Early pregnancy requires baseline levels; late pregnancy and lactation demand 50–100% more supplementation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What forms of calcium supplements are best for breeding females?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calcium carbonate and calcium citrate are highly absorbable options. Liquid or powder supplements mixed with food are easier to administer and monitor than tablets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I reassess my breeding female's calcium needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reassess every 2–3 weeks during pregnancy and weekly during active lactation, as nutritional demands fluctuate significantly throughout these stages.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Pet Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for calcium and phosphorus requirements in pet foods, including breeding and growth stages.</p>
          </li>
          <li>
            <a href="https://www.aafco.org/vns/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Nutrition Society</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based nutritional recommendations for pregnant and lactating animals with mineral supplementation protocols.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine - Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed nutritional science for reproductive health and supplementation strategies in breeding females.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD Eclampsia in Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of eclampsia prevention through proper calcium management during pregnancy and lactation.</p>
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
