import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function HorseDehydrationRiskEstimatorCalculator() {
  // 1. STATE
  // Unit system is imperial by default, but weight is not needed here.
  // Inputs: Skin Turgor Score (seconds), Mucous Membrane Capillary Refill Time (seconds)
  // Both are numeric inputs.

  const [inputs, setInputs] = useState({
    skinTurgorSeconds: "",
    mucousRefillSeconds: "",
  });

  // 2. LOGIC ENGINE
  // Dehydration risk scoring based on veterinary clinical signs:
  // Skin Turgor: Normal < 2 sec, Mild 2-4 sec, Moderate 4-6 sec, Severe >6 sec
  // Mucous Membrane Capillary Refill Time (CRT): Normal < 2 sec, Delayed > 2 sec
  // We assign points to each and sum for a risk score.
  // Risk Score = Skin Turgor Score + Mucous CRT Score
  // Skin Turgor Score: 0 (normal), 2 (mild), 4 (moderate), 6 (severe)
  // Mucous CRT Score: 0 (normal), 3 (delayed)
  // Total Risk Score max = 9
  // Interpretation:
  // 0-2: Low risk, 3-5: Moderate risk, 6-9: High risk dehydration

  const results = useMemo(() => {
    const st = parseFloat(inputs.skinTurgorSeconds);
    const muc = parseFloat(inputs.mucousRefillSeconds);

    if (isNaN(st) || isNaN(muc) || st < 0 || muc < 0) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid positive numbers for both inputs.",
        warning: null,
      };
    }

    // Skin Turgor Score
    let skinTurgorScore = 0;
    if (st < 2) skinTurgorScore = 0;
    else if (st >= 2 && st < 4) skinTurgorScore = 2;
    else if (st >= 4 && st < 6) skinTurgorScore = 4;
    else if (st >= 6) skinTurgorScore = 6;

    // Mucous Membrane CRT Score
    const mucousScore = muc <= 2 ? 0 : 3;

    const totalScore = skinTurgorScore + mucousScore;

    let label = "";
    let subtext = "";
    let warning = null;

    if (totalScore <= 2) {
      label = "Low Dehydration Risk";
      subtext = "Clinical signs suggest minimal dehydration. Monitor hydration status regularly.";
    } else if (totalScore <= 5) {
      label = "Moderate Dehydration Risk";
      subtext =
        "Signs indicate moderate dehydration. Consider fluid therapy and veterinary consultation.";
      warning =
        "Moderate dehydration can progress quickly; prompt intervention is advised.";
    } else {
      label = "High Dehydration Risk";
      subtext =
        "Severe clinical signs of dehydration detected. Immediate veterinary care is critical.";
      warning =
        "High risk dehydration is life-threatening and requires urgent medical attention.";
    }

    return {
      value: totalScore,
      label,
      subtext,
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is skin turgor and why does it matter for dehydration assessment?",
      answer: "Skin turgor is the elasticity of skin that returns to normal position after being gently pinched. Poor turgor indicates significant fluid loss and is a reliable sign of dehydration in pets, especially when combined with mucous membrane assessment.",
    },
    {
      question: "How do I properly check my pet's mucous membranes?",
      answer: "Gently lift your pet's lip to expose the gums, or check inside the mouth. Healthy mucous membranes are wet and pink; dry or tacky membranes suggest dehydration requiring immediate attention.",
    },
    {
      question: "What dehydration percentage does this calculator estimate?",
      answer: "This calculator estimates dehydration severity (mild, moderate, or severe) based on clinical signs. Mild is typically 5-8% fluid loss, moderate is 8-10%, and severe is &gt;10% requiring urgent veterinary care.",
    },
    {
      question: "Can skin turgor and mucous checks alone diagnose dehydration?",
      answer: "These checks are useful screening tools but should be combined with other signs like lethargy, urine output, and weight loss for a complete assessment; bloodwork may be needed for confirmation.",
    },
    {
      question: "How quickly can pet dehydration become life-threatening?",
      answer: "Severe dehydration (&gt;10% fluid loss) can cause organ failure and shock within hours, particularly in young kittens, puppies, and senior pets; seek veterinary care immediately if severe signs appear.",
    },
    {
      question: "What causes dehydration in pets most commonly?",
      answer: "Common causes include vomiting, diarrhea, excessive panting, fever, diabetes, kidney disease, and inadequate water intake due to illness or injury.",
    },
    {
      question: "Should I give my pet water if the estimator suggests severe dehydration?",
      answer: "For mild dehydration, increase water access gradually; for moderate to severe cases, seek veterinary care immediately as IV fluids may be necessary to safely rehydrate.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="skinTurgorSeconds" className="text-slate-700 dark:text-slate-300">
            Skin Turgor Return Time (seconds)
          </Label>
          <Input
            id="skinTurgorSeconds"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 3.5"
            value={inputs.skinTurgorSeconds}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, skinTurgorSeconds: e.target.value }))
            }
            aria-describedby="skinTurgorHelp"
          />
          <p id="skinTurgorHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time for skin to return to normal after pinch. Normal is under 2 seconds.
          </p>
        </div>

        <div>
          <Label htmlFor="mucousRefillSeconds" className="text-slate-700 dark:text-slate-300">
            Mucous Membrane Capillary Refill Time (seconds)
          </Label>
          <Input
            id="mucousRefillSeconds"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 2.5"
            value={inputs.mucousRefillSeconds}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, mucousRefillSeconds: e.target.value }))
            }
            aria-describedby="mucousRefillHelp"
          />
          <p id="mucousRefillHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Time for color to return after pressing gums. Normal is under 2 seconds.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already done on input change)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ skinTurgorSeconds: "", mucousRefillSeconds: "" })}
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
                Estimated Dehydration Risk Score
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dehydration Risk Estimator (Skin Turgor + Mucous Check)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you assess your pet's hydration status using two clinical indicators: skin turgor elasticity and mucous membrane appearance. It provides an estimated dehydration severity level to guide whether home care or veterinary attention is needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this tool, gently pinch skin on your pet's neck or shoulder and observe how quickly it returns to normal; simultaneously check mucous membrane color and moisture by lifting the gum or checking inside the mouth. Select the appropriate responses that best match your observations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator estimates dehydration severity (mild, moderate, or severe) based on your inputs. Use results as a screening tool only—always contact your veterinarian if your pet shows lethargy, loss of appetite, sunken eyes, or signs of shock, regardless of calculator results.</p>
        </div>
      </section>

      {/* TABLE: Dehydration Severity Classification by Clinical Signs */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dehydration Severity Classification by Clinical Signs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines dehydration severity levels based on skin turgor and mucous membrane findings.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Fluid Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Skin Turgor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mucous Membranes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mild</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Returns to normal in &lt;2 seconds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slightly dry but moist</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase water intake; monitor closely</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Returns to normal in 2-3 seconds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dry, tacky to touch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Veterinary visit within 24 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Remains tented &gt;3 seconds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very dry, pale or sticky</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency veterinary care immediately</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Clinical assessment should always be combined with veterinary examination for definitive diagnosis.</p>
      </section>

      {/* TABLE: Common Dehydration Causes and Risk Duration in Pets */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Dehydration Causes and Risk Duration in Pets</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical causes of pet dehydration and estimated timeline to clinical significance.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cause</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species Most Affected</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time to Mild Dehydration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Time to Severe Dehydration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vomiting/Diarrhea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs &amp; Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-24 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fever/Illness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs &amp; Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-36 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48-72 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Heat Stroke</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs (especially brachycephalic)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kidney Disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Older Cats &amp; Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Days to weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weeks to months</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diabetes Insipidus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dogs (rare)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-36 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-72 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Reduced Water Access</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">All pets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Timeline varies significantly based on pet age, size, underlying health conditions, and environmental factors.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Test skin turgor on areas with less fur, such as the inner thigh or behind the ear, for more accurate assessment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Perform mucous membrane checks in good lighting and compare color to your own gums to establish a baseline reference.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Dehydration assessment is most accurate when combined with other clinical signs like capillary refill time, urine color, and body temperature.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Elderly pets and those with elastic skin may show delayed skin turgor return even with mild dehydration, so use multiple indicators together.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying Only on Skin Turgor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Overweight or obese pets may have reduced skin elasticity unrelated to hydration, so always cross-check with mucous membrane assessment and other signs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Environmental Factors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ambient temperature, humidity, and recent exercise can affect skin turgor accuracy; assess your pet in a neutral environment when possible.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Wet Nose Means Adequate Hydration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A wet nose is not a reliable dehydration indicator; rely instead on mucous membrane moisture and skin turgor for accurate assessment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying Veterinary Care for Severe Cases</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Severe dehydration (&gt;10% fluid loss) requires emergency veterinary treatment within hours; do not wait for worsening symptoms before seeking care.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is skin turgor and why does it matter for dehydration assessment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Skin turgor is the elasticity of skin that returns to normal position after being gently pinched. Poor turgor indicates significant fluid loss and is a reliable sign of dehydration in pets, especially when combined with mucous membrane assessment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I properly check my pet's mucous membranes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Gently lift your pet's lip to expose the gums, or check inside the mouth. Healthy mucous membranes are wet and pink; dry or tacky membranes suggest dehydration requiring immediate attention.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What dehydration percentage does this calculator estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator estimates dehydration severity (mild, moderate, or severe) based on clinical signs. Mild is typically 5-8% fluid loss, moderate is 8-10%, and severe is &gt;10% requiring urgent veterinary care.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can skin turgor and mucous checks alone diagnose dehydration?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">These checks are useful screening tools but should be combined with other signs like lethargy, urine output, and weight loss for a complete assessment; bloodwork may be needed for confirmation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly can pet dehydration become life-threatening?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Severe dehydration (&gt;10% fluid loss) can cause organ failure and shock within hours, particularly in young kittens, puppies, and senior pets; seek veterinary care immediately if severe signs appear.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What causes dehydration in pets most commonly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common causes include vomiting, diarrhea, excessive panting, fever, diabetes, kidney disease, and inadequate water intake due to illness or injury.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I give my pet water if the estimator suggests severe dehydration?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For mild dehydration, increase water access gradually; for moderate to severe cases, seek veterinary care immediately as IV fluids may be necessary to safely rehydrate.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.merckvetmanual.com/emergency-medicine-and-critical-care/shock/fluid-therapy-and-shock-management" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Fluid Therapy and Shock Management in Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Merck Veterinary Manual provides comprehensive guidance on assessing and treating dehydration and shock in companion animals.</p>
          </li>
          <li>
            <a href="https://www.veterinarypartner.com/article/what-are-signs-dehydration-pets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Clinical Dehydration Assessment in Small Animals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">VeterinaryPartner explains clinical signs of dehydration including skin turgor and mucous membrane changes in dogs and cats.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/general-pet-care/dehydration-pets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Recognizing Signs of Dehydration in Companion Animals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASPCA provides pet owner guidance on identifying and responding to dehydration in household pets.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/petcare/healthy-pet/ask-aaha-vet" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Acute Vomiting and Diarrhea in Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Animal Hospital Association outlines causes and management of gastrointestinal illness leading to dehydration.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Risk Estimator (Skin Turgor + Mucous Check)"
      description="Assess dehydration risk using the skin pinch (turgor) test and capillary refill time (mucous checks)."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Dehydration Risk Score = Skin Turgor Score + Mucous Membrane CRT Score",
        variables: [
          { symbol: "Skin Turgor Score", description: "Points assigned based on skin turgor return time" },
          { symbol: "Mucous Membrane CRT Score", description: "Points assigned based on capillary refill time" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A horse presents with a skin turgor return time of 4.5 seconds and a mucous membrane capillary refill time of 3 seconds.",
        steps: [
          {
            label: "1",
            explanation:
              "Assign Skin Turgor Score: 4.5 seconds falls in moderate category, score = 4 points.",
          },
          {
            label: "2",
            explanation:
              "Assign Mucous Membrane CRT Score: 3 seconds is delayed, score = 3 points.",
          },
          {
            label: "3",
            explanation:
              "Calculate total risk score: 4 + 3 = 7 points indicating high dehydration risk.",
          },
        ],
        result:
          "The horse is at high risk of dehydration and requires immediate veterinary intervention and fluid therapy.",
      }}
      relatedCalculators={[
        {
          title: "Play Session Planner (Feather/Chase Time Targets)",
          url: "/pets/cat-play-session-planner",
          icon: "🐾",
        },
        {
          title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
          url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko",
          icon: "🐶",
        },
        {
          title: "Daily Calorie Needs by Body Weight",
          url: "/pets/bird-daily-calorie-needs-body-weight",
          icon: "🐱",
        },
        {
          title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)",
          url: "/pets/dog-human-medication-exposure-alert",
          icon: "🐶",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration Risk Estimator (Skin Turgor + Mucous Check)" },
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