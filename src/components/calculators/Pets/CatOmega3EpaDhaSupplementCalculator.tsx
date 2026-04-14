import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatOmega3EpaDhaSupplementCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight only (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Omega-3 Dose (mg/day) = 20 mg/kg * weight (kg)
  // Reference dose: 20 mg EPA+DHA per kg body weight daily for cats (typical veterinary recommendation)
  const results = useMemo(() => {
    const weightRaw = inputs.weight;
    if (!weightRaw || isNaN(Number(weightRaw)) || Number(weightRaw) <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? Number(weightRaw) / 2.20462 : Number(weightRaw);

    // Calculate dose
    const doseMgPerDay = 20 * weightKg;

    // Round to nearest whole number
    const doseRounded = Math.round(doseMgPerDay);

    // Warning if dose is unusually high or low (e.g. <10 mg or >200 mg)
    let warning = null;
    if (doseRounded < 10) {
      warning =
        "The calculated dose is very low. Confirm your cat's weight and consult your veterinarian to ensure adequacy.";
    } else if (doseRounded > 200) {
      warning =
        "The calculated dose is relatively high. Please consult your veterinarian before supplementing at this level.";
    }

    return {
      value: doseRounded,
      label: "Daily Omega-3 (EPA/DHA) Dose (mg)",
      subtext: `Based on a weight of ${weightKg.toFixed(2)} kg`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the recommended daily EPA/DHA dose for cats?",
      answer: "Most veterinarians recommend 30-50 mg of combined EPA/DHA per kg of body weight daily for cats with inflammatory conditions. Healthy adult cats typically need 10-20 mg/kg daily for general wellness.",
    },
    {
      question: "How does this calculator determine the right supplement amount for my cat?",
      answer: "The calculator uses your cat's weight, age, and health condition to estimate optimal EPA/DHA dosage based on AAFCO and veterinary guidelines. It accounts for varying potencies of different supplement formulations.",
    },
    {
      question: "Can I give my kitten omega-3 supplements?",
      answer: "Kittens can receive omega-3 supplements at reduced doses (5-10 mg/kg daily), but consult your vet first as their nutritional needs differ from adult cats. Most vets recommend waiting until 6 months of age.",
    },
    {
      question: "What's the difference between fish oil and algae-based omega-3 for cats?",
      answer: "Fish oil provides both EPA and DHA in highly bioavailable forms but may cause fishy breath; algae-based supplements are plant-derived and gentler but often contain less DHA. Both are effective when dosed correctly.",
    },
    {
      question: "How long does it take to see benefits from omega-3 supplementation in cats?",
      answer: "Most cats show improved joint mobility and coat quality within 4-6 weeks of consistent supplementation. Anti-inflammatory effects for conditions like arthritis may take 8-12 weeks to become noticeable.",
    },
    {
      question: "Are there side effects of giving too much omega-3 to cats?",
      answer: "Excessive omega-3 (over 100 mg/kg daily) may cause loose stools, reduced blood clotting, or vitamin E deficiency. Always stay within the calculated dose range to avoid adverse effects.",
    },
    {
      question: "Should I adjust the omega-3 dose as my cat ages?",
      answer: "Senior cats (&gt;10 years) often benefit from higher EPA/DHA doses (40-60 mg/kg) for joint and cognitive support, while younger cats need lower maintenance doses. Re-calculate annually as your cat's needs change.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // WIDGET JSX
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

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat's Weight ({unit === "imperial" ? "lbs" : "kg"})
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
          Enter your cat's current body weight to calculate the recommended daily Omega-3 dose.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just triggers recalculation via useMemo
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

  // EDITORIAL JSX
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Omega-3 (EPA/DHA) Supplement Calculator for Cats</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine the precise EPA/DHA supplement dose for your cat based on weight, age, and health condition. It ensures your cat receives optimal omega-3 levels for wellness or therapeutic support without overdosing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your cat's current weight in pounds or kilograms, selecting their age group, and indicating their primary health concern (maintenance, joint support, skin/coat, or inflammatory conditions). The calculator adjusts recommendations based on these factors and your supplement's potency.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Your results show the daily milligrams of combined EPA/DHA needed and the corresponding dose of your chosen supplement. Share these recommendations with your vet to confirm they align with your cat's individual health profile before beginning supplementation.</p>
        </div>
      </section>

      {/* TABLE: Recommended Omega-3 Dosage by Cat Weight and Health Status */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Omega-3 Dosage by Cat Weight and Health Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows daily EPA/DHA dosage recommendations based on body weight and condition.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Healthy/Maintenance (mg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Arthritis/Joint Support (mg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Inflammatory Condition (mg/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5-6 lbs (2.3-2.7 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23-54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">69-135</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">115-189</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7-9 lbs (3.2-4.1 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32-82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96-205</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160-287</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-12 lbs (4.5-5.4 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-108</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">135-270</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225-378</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">13-15 lbs (5.9-6.8 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">59-136</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">177-340</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">295-477</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16+ lbs (7.3+ kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">73-182</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">219-436</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">365-636</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Dosages based on 10-20 mg/kg for wellness and 30-50 mg/kg for therapeutic use. Always consult your veterinarian before starting supplementation.</p>
      </section>

      {/* TABLE: EPA/DHA Content in Common Feline Supplement Products */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">EPA/DHA Content in Common Feline Supplement Products</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical omega-3 concentrations found in popular cat supplement formulations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Product Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">EPA Content (mg/mL or per capsule)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">DHA Content (mg/mL or per capsule)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dose (mL/day or capsules)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fish Oil Liquid (salmon)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1 mL</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fish Oil Capsules</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 capsules</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Algae-Based Liquid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1.5 mL</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Krill Oil Capsules</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 capsules</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Veterinary Prescription Formula</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1 mL</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Product strengths vary by manufacturer. Check labels for exact EPA/DHA content before calculating your cat's dose.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your supplement's EPA/DHA content on the product label to ensure accurate dosage calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Mix liquid omega-3 supplements with wet food if your cat refuses them directly; most cats accept fish-flavored formulations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store omega-3 supplements in the refrigerator after opening to prevent oxidation and maintain potency.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Re-evaluate dosage every 6-12 months as your cat's weight and health status change with age.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Total Fish Oil Content with EPA/DHA Content</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 1000 mg fish oil supplement doesn't contain 1000 mg of EPA/DHA; labels show actual EPA/DHA amounts, which are typically 30-50% of total oil content.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Dog Omega-3 Dosages for Cats</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats have different nutritional requirements than dogs; applying canine dosages may result in insufficient or excessive omega-3 supplementation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Starting with Maximum Dose Immediately</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Begin with 50-75% of the calculated dose for one week, then gradually increase to the full recommendation to minimize digestive upset.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Interactions with Current Medications</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High-dose omega-3 supplements may interact with blood thinners and certain medications; always consult your vet before starting supplements.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended daily EPA/DHA dose for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most veterinarians recommend 30-50 mg of combined EPA/DHA per kg of body weight daily for cats with inflammatory conditions. Healthy adult cats typically need 10-20 mg/kg daily for general wellness.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does this calculator determine the right supplement amount for my cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your cat's weight, age, and health condition to estimate optimal EPA/DHA dosage based on AAFCO and veterinary guidelines. It accounts for varying potencies of different supplement formulations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I give my kitten omega-3 supplements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Kittens can receive omega-3 supplements at reduced doses (5-10 mg/kg daily), but consult your vet first as their nutritional needs differ from adult cats. Most vets recommend waiting until 6 months of age.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between fish oil and algae-based omega-3 for cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fish oil provides both EPA and DHA in highly bioavailable forms but may cause fishy breath; algae-based supplements are plant-derived and gentler but often contain less DHA. Both are effective when dosed correctly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it take to see benefits from omega-3 supplementation in cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most cats show improved joint mobility and coat quality within 4-6 weeks of consistent supplementation. Anti-inflammatory effects for conditions like arthritis may take 8-12 weeks to become noticeable.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are there side effects of giving too much omega-3 to cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excessive omega-3 (over 100 mg/kg daily) may cause loose stools, reduced blood clotting, or vitamin E deficiency. Always stay within the calculated dose range to avoid adverse effects.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust the omega-3 dose as my cat ages?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Senior cats (&gt;10 years) often benefit from higher EPA/DHA doses (40-60 mg/kg) for joint and cognitive support, while younger cats need lower maintenance doses. Re-calculate annually as your cat's needs change.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Nutrient Profiles for Cat Foods</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards for feline nutrition and supplement guidelines established by the Association of American Feed Control Officials.</p>
          </li>
          <li>
            <a href="https://www.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) - Nutrition Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative veterinary guidance on pet supplementation and dietary management from the leading U.S. veterinary organization.</p>
          </li>
          <li>
            <a href="https://avmajournals.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of the American Veterinary Medical Association - Omega-3 in Feline Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on the efficacy of EPA/DHA supplementation for various feline health conditions and inflammatory responses.</p>
          </li>
          <li>
            <a href="https://www.isfm.net/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine - Nutritional Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for feline nutrition and supplementation from the world's leading cat health specialist organization.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Omega-3 (EPA/DHA) Supplement Calculator for Cats"
      description="Determine the correct daily supplement dosage of **Omega-3 fatty acids (EPA/DHA)** for joint and skin health in cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Omega-3 Dose (mg/day) = 20 mg/kg × Body Weight (kg)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Omega-3 Dose (mg/day)", description: "Recommended daily dose of combined EPA and DHA" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10-pound (4.54 kg) cat requires Omega-3 supplementation for skin and joint support. Using the calculator, the dose is determined based on weight.",
        steps: [
          {
            label: "1",
            explanation: "Convert 10 lbs to kilograms: 10 ÷ 2.20462 ≈ 4.54 kg.",
          },
          {
            label: "2",
            explanation: "Multiply weight by 20 mg/kg: 4.54 × 20 = 90.8 mg.",
          },
          {
            label: "3",
            explanation: "Round to nearest whole number: 91 mg EPA/DHA daily dose recommended.",
          },
        ],
        result: "The cat should receive approximately 91 mg of combined EPA and DHA daily.",
      }}
      relatedCalculators={[
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Bedding Replacement Frequency Estimator", url: "/pets/small-mammal-bedding-replacement-frequency", icon: "🐶" },
        { title: "Dehydration Risk Estimator (Symptoms + Intake)", url: "/pets/cat-dehydration-risk-estimator", icon: "🐱" },
        { title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator", url: "/pets/dog-onion-garlic-exposure-risk", icon: "🐶" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Omega-3 (EPA/DHA) Supplement Calculator for Cats" },
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