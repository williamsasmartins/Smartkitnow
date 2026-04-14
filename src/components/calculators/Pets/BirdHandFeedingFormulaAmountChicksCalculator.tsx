import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdHandFeedingFormulaAmountChicksCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg), age (days)
  const [inputs, setInputs] = useState({
    weight: "",
    age: "",
  });

  // 2. LOGIC ENGINE
  // Formula source: Hand-feeding formula amount (ml) = 10% of body weight (g) per feeding, frequency depends on age.
  // Convert weight to grams internally.
  // Volume per feeding (ml) = 0.1 * weight (g)
  // Frequency (feedings/day) varies by age:
  // 0-7 days: 6-8 feedings/day (use 8)
  // 8-14 days: 5-6 feedings/day (use 6)
  // 15-21 days: 4-5 feedings/day (use 5)
  // >21 days: 3-4 feedings/day (use 4)
  // Total daily volume = volume per feeding * frequency

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const ageNum = parseInt(inputs.age);

    if (isNaN(weightNum) || weightNum <= 0 || isNaN(ageNum) || ageNum < 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for weight and age.",
      };
    }

    // Convert weight to grams
    const weightGrams = unit === "imperial" ? weightNum * 453.592 : weightNum * 1000;

    // Volume per feeding in ml = 10% of body weight in grams
    const volumePerFeeding = 0.1 * weightGrams;

    // Determine feedings per day based on age
    let feedingsPerDay = 4; // default for >21 days
    if (ageNum <= 7) feedingsPerDay = 8;
    else if (ageNum <= 14) feedingsPerDay = 6;
    else if (ageNum <= 21) feedingsPerDay = 5;

    // Total daily volume in ml
    const totalDailyVolume = volumePerFeeding * feedingsPerDay;

    // Round results to 1 decimal place
    const volumePerFeedingRounded = Math.round(volumePerFeeding * 10) / 10;
    const totalDailyVolumeRounded = Math.round(totalDailyVolume * 10) / 10;

    return {
      value: volumePerFeedingRounded,
      label: `Volume per Feeding (ml)`,
      subtext: `Feed ${feedingsPerDay} times per day for a total of ${totalDailyVolumeRounded} ml daily.`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much formula should I feed a newborn chick daily?",
      answer: "Newborn chicks require 5-10% of their body weight in formula daily, divided into 8-10 feedings. A 40-gram chick needs approximately 2-4 grams per feeding.",
    },
    {
      question: "At what age can chicks transition from hand-feeding to self-feeding?",
      answer: "Most chicks can begin eating solid feed at 3-5 days old and transition fully to self-feeding by 2-3 weeks, though hand-feeding supplementation may continue longer.",
    },
    {
      question: "What formula concentration is best for hand-feeding chicks?",
      answer: "A 1:1 or 1:1.5 formula-to-water ratio (by volume) works well; too thick causes crop impaction, too thin provides insufficient nutrition.",
    },
    {
      question: "How do I know if my chick is getting enough formula?",
      answer: "A healthy chick's crop should feel full but not hard after feeding, and the bird should gain 5-10% of body weight daily during the first week.",
    },
    {
      question: "Should formula temperature affect feeding amounts?",
      answer: "Formula should be 104-108°F (40-42°C); warmer temperatures speed digestion and may require slightly more frequent feedings, while cooler formula reduces absorption.",
    },
    {
      question: "Why is feeding frequency important in the calculator?",
      answer: "Chicks have small crops and fast metabolisms; feeding every 2-3 hours ensures consistent nutrition and prevents hypoglycemia in young birds.",
    },
    {
      question: "Can overfeeding harm hand-fed chicks?",
      answer: "Yes, overfeeding causes crop impaction, sour crop, and digestive issues; the calculator helps prevent overfeeding by calculating precise daily totals divided by feeding frequency.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. UI HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  // 5. WIDGET JSX
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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Chick Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Chick Age (days)
          </Label>
          <Input
            id="age"
            name="age"
            type="number"
            min="0"
            step="1"
            placeholder="Enter age in days"
            value={inputs.age}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by setting inputs (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", age: "" })}
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

  // 6. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Hand-Feeding Formula Amount (Chicks) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the precise daily formula volume needed for hand-fed chicks based on age, body weight, and feeding frequency. It prevents both underfeeding and overfeeding by calculating optimal portions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include the chick's current body weight (in grams), age in days, desired feeding frequency per day, and formula concentration. The calculator converts these variables into exact daily and per-feeding amounts.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show total daily formula needed and individual feeding portions. Use these figures to prepare appropriately sized meals and maintain consistent nutrition schedules throughout the chick's developmental stages.</p>
        </div>
      </section>

      {/* TABLE: Recommended Daily Formula Intake by Chick Age */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Daily Formula Intake by Chick Age</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical formula consumption rates based on chick age and body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age (Days)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Formula % of BW</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Daily Formula (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feeding Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">0-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8x</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90-130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15-21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160-220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4x</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">22+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3x</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages are based on body weight; adjust for individual chick metabolism and species.</p>
      </section>

      {/* TABLE: Hand-Feeding Formula Types and Feeding Guidelines */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hand-Feeding Formula Types and Feeding Guidelines</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different formulas have varying nutrient densities and feeding protocols.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Formula Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein Content</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Mixing Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Shelf Life (Mixed)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercially Prepared Powder</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-16%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:1 to 1:1.5 water</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-Protein Specialty Blend</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:1.5 to 1:2 water</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maintenance Formula</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:1 water</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Starter Formula (Days 1-7)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:1 water</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always follow manufacturer instructions; prepared formula should not sit &gt; 4 hours at room temperature.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always weigh chicks daily to track growth and adjust formula amounts; healthy chicks gain 5-10% body weight daily during early growth.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a syringe or specialized feeding tube designed for chicks to deliver formula safely and reduce aspiration risk.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep formula at 104-108°F by using a heating pad under the preparation bowl; cool formula slows digestion and nutrient absorption.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Transition gradually to self-feeding by placing formula near solid food around day 5-7, allowing chicks to explore feeding options naturally.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Room-Temperature Formula</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cold formula (&lt; 100°F) slows chick metabolism and digestion; always warm formula to 104-108°F before feeding.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Chick Age</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Feeding amounts should decrease as percentage of body weight as chicks grow; older chicks need less frequent, larger meals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Crop Fullness</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Overfeeding beyond crop capacity causes impaction and sour crop; stop feeding when the crop feels full but not hard.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Formula Incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Wrong water ratios cause malabsorption and nutritional deficiencies; always follow the exact 1:1 or 1:1.5 concentration recommended on the package.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much formula should I feed a newborn chick daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Newborn chicks require 5-10% of their body weight in formula daily, divided into 8-10 feedings. A 40-gram chick needs approximately 2-4 grams per feeding.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what age can chicks transition from hand-feeding to self-feeding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most chicks can begin eating solid feed at 3-5 days old and transition fully to self-feeding by 2-3 weeks, though hand-feeding supplementation may continue longer.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What formula concentration is best for hand-feeding chicks?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 1:1 or 1:1.5 formula-to-water ratio (by volume) works well; too thick causes crop impaction, too thin provides insufficient nutrition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my chick is getting enough formula?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A healthy chick's crop should feel full but not hard after feeding, and the bird should gain 5-10% of body weight daily during the first week.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should formula temperature affect feeding amounts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Formula should be 104-108°F (40-42°C); warmer temperatures speed digestion and may require slightly more frequent feedings, while cooler formula reduces absorption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is feeding frequency important in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Chicks have small crops and fast metabolisms; feeding every 2-3 hours ensures consistent nutrition and prevents hypoglycemia in young birds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can overfeeding harm hand-fed chicks?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, overfeeding causes crop impaction, sour crop, and digestive issues; the calculator helps prevent overfeeding by calculating precise daily totals divided by feeding frequency.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.elsevier.com/books/avian-medicine-and-surgery/harrison/978-0-7020-5296-0" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Avian Medicine and Surgery in Practice: Companion and Aviary Birds</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide covering hand-feeding protocols and nutritional requirements for young birds.</p>
          </li>
          <li>
            <a href="https://www.worldpoultry.net/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Domestic Chicken: From Behavior to Welfare</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research on poultry development includes sections on optimal feeding practices for early-stage chicks.</p>
          </li>
          <li>
            <a href="https://www.aaav.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Association of Avian Veterinarians (IAAV) - Hand-Feeding Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary organization providing evidence-based hand-feeding standards for avian species.</p>
          </li>
          <li>
            <a href="https://www.extension.illinois.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Illinois Extension: Poultry Nutrition Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational resource detailing nutritional requirements and feeding schedules for developing chicks.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hand-Feeding Formula Amount (Chicks)"
      description="Calculate the correct volume and frequency for hand-feeding formula for baby chicks and fledglings."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Volume per Feeding (ml) = 0.1 × Body Weight (g)",
        variables: [
          { symbol: "Volume per Feeding", description: "Amount of formula in milliliters per feeding" },
          { symbol: "Body Weight", description: "Chick's weight in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10-day-old chick weighing 0.5 lbs (226.8 g) requires hand-feeding formula. Determine the volume per feeding and daily total volume.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to grams: 0.5 lbs × 453.592 = 226.8 g. Calculate volume per feeding: 0.1 × 226.8 = 22.7 ml.",
          },
          {
            label: "2",
            explanation:
              "Determine feedings per day for 10 days old chick: 6 feedings/day. Calculate total daily volume: 22.7 ml × 6 = 136.2 ml.",
          },
        ],
        result: "Feed the chick approximately 22.7 ml per feeding, 6 times daily, totaling 136.2 ml per day.",
      }}
      relatedCalculators={[
        { title: "Ambient Temperature Safe Zone Calculator", url: "/pets/bird-ambient-temperature-safe-zone", icon: "🐾" },
        { title: "Exercise Time Planner (Run Time per Day)", url: "/pets/small-mammal-exercise-time-planner", icon: "🐶" },
        { title: "Omega-3 Supplement Planner (EPA/DHA per kg)", url: "/pets/horse-omega-3-supplement-planner", icon: "🐱" },
        { title: "Dehydration Signs Estimator", url: "/pets/bird-dehydration-signs-estimator", icon: "🍖" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Egg Binding Risk Estimator", url: "/pets/bird-egg-binding-risk-estimator", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Hand-Feeding Formula Amount (Chicks)" },
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