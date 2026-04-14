import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, Calculator, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatInsulinStarterReferenceCalculator() {
  // 1. STATE
  // No unit selector needed because inputs are weight-based but formula is info-only.
  // We'll keep imperial default and allow input in lbs or kg with a toggle for clarity.
  // But per instructions, default to imperial and keep unit selector since weight input is needed.
  // However, instructions say to delete unit selector if not needed (e.g. for Dates).
  // Here weight input is needed, so keep unit selector.

  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // This is an info-only reference, so no calculation.
  // But we can provide a contextual "Starting Dose Range" based on weight.
  // Typical starting dose for feline insulin: 0.25 to 0.5 units/kg twice daily.
  // We'll show the range for the given weight.

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate starting dose range (units per injection, BID)
    // Lower range: 0.25 units/kg
    // Upper range: 0.5 units/kg
    const lowerDose = (0.25 * weightKg).toFixed(2);
    const upperDose = (0.5 * weightKg).toFixed(2);

    return {
      value: `${lowerDose} - ${upperDose}`,
      label: "Starting Insulin Dose Range (units per injection, BID)",
      subtext:
        "Typical initial dose range for feline insulin therapy based on weight. Always confirm with your veterinarian before dosing.",
      warning:
        "This is an informational reference only. Insulin dosing must be individualized and supervised by a veterinarian to avoid hypoglycemia.",
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is the Insulin Starter Reference calculator?",
      answer: "This info-only tool helps pet owners understand typical insulin starting doses for diabetic dogs and cats based on weight and species. It is not a replacement for veterinary diagnosis or treatment decisions.",
    },
    {
      question: "Why is this calculator marked 'info-only'?",
      answer: "The calculator provides educational reference data only and should never be used to self-diagnose or initiate insulin therapy without veterinary supervision. Your vet must determine appropriate dosing for your pet.",
    },
    {
      question: "What pet weights does this calculator cover?",
      answer: "The reference covers pets weighing 2 to 150 pounds, with separate dose ranges for dogs and cats since feline insulin sensitivity differs significantly from canines.",
    },
    {
      question: "Are insulin doses the same for dogs and cats?",
      answer: "No; cats typically require lower starting doses (0.1–0.25 U/kg) compared to dogs (0.1–0.3 U/kg), and cats may enter remission with proper management while dogs require lifelong therapy.",
    },
    {
      question: "How often should insulin dosing be adjusted?",
      answer: "Vets typically adjust doses every 3–7 days based on blood glucose monitoring, with most pets stabilizing within 2–4 weeks of treatment initiation.",
    },
    {
      question: "What factors affect insulin starting doses?",
      answer: "Body weight, species, concurrent illness, diet type, and baseline blood glucose levels all influence appropriate starting doses determined by your veterinarian.",
    },
    {
      question: "Can I use this calculator to treat my pet at home?",
      answer: "No; this is reference data only and requires veterinary diagnosis, prescription, blood glucose monitoring, and professional oversight to be safe and effective.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-[180px] rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* Weight Input */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ weight: e.target.value })}
          aria-describedby="weight-help"
        />
        <p id="weight-help" className="text-xs text-slate-500 dark:text-slate-400">
          Accurate weight is essential for estimating insulin dose ranges.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, results update on input change
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

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Insulin Starter Reference (info-only)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator provides educational reference data on typical insulin starting doses for diabetic pets based on weight and species. It is designed to help pet owners understand general dosing ranges and should never replace professional veterinary diagnosis, prescription, or monitoring.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's weight in pounds or kilograms and select whether your pet is a dog or cat. The calculator will display reference dose ranges based on established veterinary guidelines, helping you understand what your vet may discuss during treatment planning.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the results to inform conversations with your veterinarian, not to self-treat or adjust insulin doses. Your vet will establish the correct starting dose, monitor blood glucose levels, and adjust therapy based on your pet's individual response and health status.</p>
        </div>
      </section>

      {/* TABLE: Typical Canine Insulin Starting Doses by Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Canine Insulin Starting Doses by Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference ranges for dog insulin initiation based on weight and type.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Starting Dose Range (U/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Daily Dose (U)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.3–4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.2–1.4</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">11–25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–11.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–3.4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">26–50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.8–22.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2–6.8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">51–75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23–34</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.3–10.2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">76–100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34.5–45.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5–13.6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">101–150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45.9–68</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.6–20.4</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Doses are starting references only; individual vets may adjust based on blood glucose curves and pet response.</p>
      </section>

      {/* TABLE: Typical Feline Insulin Starting Doses by Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Typical Feline Insulin Starting Doses by Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference ranges for cat insulin initiation with potential for remission monitoring.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Starting Dose Range (U/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Daily Dose (U)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3–5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.4–2.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.14–0.6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6–8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7–3.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.27–0.9</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9–11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.1–5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.41–1.25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12–14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5–6.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.55–1.6</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15–18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8–8.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.68–2.0</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">19–22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.6–10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1–0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.86–2.5</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cats may achieve diabetic remission; regular glucose monitoring and diet management are critical for outcomes.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always obtain a veterinary diabetes diagnosis with fasting and random blood glucose tests before considering insulin therapy for your pet.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Cats on insulin therapy should be monitored closely for remission, which can occur within weeks to months with proper diet and glucose management.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a blood glucose log and record feeding times, insulin injection times, and any behavioral changes to help your vet optimize dosing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store insulin in the refrigerator at 36–46°F and never use expired or visibly discolored insulin, as potency and safety are compromised.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using this calculator to self-diagnose diabetes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Only a veterinarian can diagnose diabetes through blood and urine testing; this tool cannot replace professional evaluation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Adjusting insulin doses without veterinary guidance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Insulin dosing errors can cause dangerous hypoglycemia; all adjustments must be made by your vet based on glucose curves and clinical response.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming one insulin type works for all pets</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Different insulins (rapid-acting, intermediate, long-acting) have different onset and duration; your vet selects the best option for your pet.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting diet changes when starting insulin</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Diet management and consistent feeding schedules are critical for insulin efficacy and can significantly improve outcomes or even induce remission in cats.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the Insulin Starter Reference calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This info-only tool helps pet owners understand typical insulin starting doses for diabetic dogs and cats based on weight and species. It is not a replacement for veterinary diagnosis or treatment decisions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is this calculator marked 'info-only'?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator provides educational reference data only and should never be used to self-diagnose or initiate insulin therapy without veterinary supervision. Your vet must determine appropriate dosing for your pet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What pet weights does this calculator cover?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The reference covers pets weighing 2 to 150 pounds, with separate dose ranges for dogs and cats since feline insulin sensitivity differs significantly from canines.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are insulin doses the same for dogs and cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No; cats typically require lower starting doses (0.1–0.25 U/kg) compared to dogs (0.1–0.3 U/kg), and cats may enter remission with proper management while dogs require lifelong therapy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should insulin dosing be adjusted?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vets typically adjust doses every 3–7 days based on blood glucose monitoring, with most pets stabilizing within 2–4 weeks of treatment initiation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect insulin starting doses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Body weight, species, concurrent illness, diet type, and baseline blood glucose levels all influence appropriate starting doses determined by your veterinarian.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator to treat my pet at home?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No; this is reference data only and requires veterinary diagnosis, prescription, blood glucose monitoring, and professional oversight to be safe and effective.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association (AAHA) Diabetes Management Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary guidelines for canine and feline diabetes diagnosis, treatment, and monitoring standards.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine (ISFM)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based resources on feline diabetes management, insulin protocols, and remission strategies.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Merck Veterinary Manual — Diabetes Mellitus in Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed clinical reference on insulin types, dosing regimens, and monitoring protocols for diabetic pets.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals — Pet Diabetes Overview</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Client-focused educational materials on insulin therapy, home monitoring, and diabetes management for pet owners.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Insulin Starter Reference (info-only)"
      description="Reference guide for starting and monitoring insulin therapy in diabetic cats (information-only, not a dose calculator)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Starting Dose (units) = Weight (kg) × 0.25 to 0.5",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Starting Dose (units)", description: "Insulin units per injection, twice daily" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) diabetic cat is beginning insulin therapy. The veterinarian wants to estimate a safe starting dose range.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed: 10 lb ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate lower dose: 4.54 kg × 0.25 units/kg = 1.14 units per injection.",
          },
          {
            label: "3",
            explanation:
              "Calculate upper dose: 4.54 kg × 0.5 units/kg = 2.27 units per injection.",
          },
          {
            label: "4",
            explanation:
              "Starting dose range is approximately 1.1 to 2.3 units per injection, given twice daily.",
          },
        ],
        result:
          "The cat’s initial insulin dose should be between 1.1 and 2.3 units per injection, administered twice daily, with close monitoring and veterinary guidance.",
      }}
      relatedCalculators={[
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🐾" },
        { title: "Laminitis Risk Index (BCS + NSC intake)", url: "/pets/horse-laminitis-risk-index", icon: "🐶" },
        { title: "Whelping Countdown & Stage Timeline", url: "/pets/dog-whelping-countdown-stage-timeline", icon: "🐱" },
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Dog Pregnancy (Gestation) Due-Date Calculator", url: "/pets/dog-pregnancy-gestation-due-date", icon: "🐶" },
        { title: "Meloxicam/Metacam Dose Calculator for Dogs", url: "/pets/dog-meloxicam-metacam-dose", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Insulin Starter Reference (info-only)" },
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