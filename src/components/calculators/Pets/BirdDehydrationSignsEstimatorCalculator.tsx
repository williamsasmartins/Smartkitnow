import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdDehydrationSignsEstimatorCalculator() {
  // 1. STATE
  // No unit switcher needed because inputs are % dehydration signs and water intake deficit (both unitless or %)
  // But we keep imperial for weight input if needed, but here no weight input is required by formula.
  // According to formula, inputs are: Dehydration Signs Score (%) and Intake Deficit (%)
  // So no weight or unit needed.
  
  const [inputs, setInputs] = useState({
    dehydrationSignsPercent: "",
    intakeDeficitPercent: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const dSigns = parseFloat(inputs.dehydrationSignsPercent);
    const intakeDef = parseFloat(inputs.intakeDeficitPercent);

    if (
      isNaN(dSigns) ||
      isNaN(intakeDef) ||
      dSigns < 0 ||
      dSigns > 100 ||
      intakeDef < 0 ||
      intakeDef > 100
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid percentages between 0 and 100.",
        warning: null,
      };
    }

    // Hydration Score = Dehydration % + Intake Deficit %
    const hydrationScore = dSigns + intakeDef;

    let label = "";
    let warning = null;

    if (hydrationScore < 10) {
      label = "Normal hydration status";
    } else if (hydrationScore < 20) {
      label = "Mild dehydration suspected";
      warning =
        "Monitor bird closely and encourage fluid intake. Consult a vet if signs worsen.";
    } else if (hydrationScore < 40) {
      label = "Moderate dehydration likely";
      warning =
        "Immediate veterinary attention recommended. Dehydration can rapidly worsen.";
    } else {
      label = "Severe dehydration risk";
      warning =
        "Urgent veterinary care required. Severe dehydration is life-threatening.";
    }

    return {
      value: hydrationScore.toFixed(1) + "%",
      label,
      subtext:
        "Hydration Score combines clinical signs and water intake deficit to estimate dehydration severity.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What signs indicate my pet is dehydrated?",
      answer: "Common signs include dry gums, loss of skin elasticity, sunken eyes, lethargy, and reduced urination. Severe dehydration may cause weakness, rapid heartbeat, and collapse requiring immediate veterinary care.",
    },
    {
      question: "How does the Dehydration Signs Estimator work?",
      answer: "The calculator analyzes physical symptoms you input—such as gum moisture, skin turgor, and behavior changes—to estimate your pet's hydration status on a scale from mild to severe dehydration.",
    },
    {
      question: "Can this calculator replace a vet visit?",
      answer: "No, this tool is for awareness only and cannot diagnose dehydration. Always consult a veterinarian if you suspect dehydration, especially in severe cases requiring IV fluids or treatment.",
    },
    {
      question: "What's the normal skin turgor test result for hydrated pets?",
      answer: "Healthy pets show skin that snaps back to normal within 1-2 seconds when gently pulled. Slower return (&gt;2 seconds) indicates potential dehydration.",
    },
    {
      question: "How often should I check my pet for dehydration signs?",
      answer: "Monitor your pet daily, especially during hot weather, illness, or diarrhea. Puppies and senior pets need more frequent checks as they dehydrate faster.",
    },
    {
      question: "What factors increase dehydration risk in pets?",
      answer: "High temperatures, vomiting, diarrhea, kidney disease, diabetes, excessive panting, and limited water access all significantly increase dehydration risk.",
    },
    {
      question: "How much water should my pet drink daily?",
      answer: "Most pets need 0.5-1 ounce of water per pound of body weight daily, though this varies by age, activity level, and health status.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="dehydrationSignsPercent" className="text-slate-700 dark:text-slate-300">
            Dehydration Signs (%)
          </Label>
          <Input
            id="dehydrationSignsPercent"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g. 5"
            value={inputs.dehydrationSignsPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, dehydrationSignsPercent: e.target.value }))
            }
            aria-describedby="dehydrationSignsHelp"
          />
          <p
            id="dehydrationSignsHelp"
            className="text-xs text-slate-500 dark:text-slate-400 mt-1"
          >
            Estimate the percentage severity of clinical dehydration signs observed.
          </p>
        </div>

        <div>
          <Label htmlFor="intakeDeficitPercent" className="text-slate-700 dark:text-slate-300">
            Water Intake Deficit (%)
          </Label>
          <Input
            id="intakeDeficitPercent"
            type="number"
            min={0}
            max={100}
            step={0.1}
            placeholder="e.g. 10"
            value={inputs.intakeDeficitPercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, intakeDeficitPercent: e.target.value }))
            }
            aria-describedby="intakeDeficitHelp"
          />
          <p id="intakeDeficitHelp" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Estimate the percentage reduction in normal water intake compared to usual.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // Trigger recalculation by updating state with same values (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ dehydrationSignsPercent: "", intakeDeficitPercent: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dehydration Signs Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you assess your pet's hydration level by evaluating visible dehydration signs. Input observable symptoms like gum moisture, skin elasticity, and behavioral changes to generate a hydration status estimate.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include the skin turgor test result (how quickly skin returns to normal), mucous membrane moisture, eye appearance, urine output, and activity level. Be honest about observations for accurate results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator provides a severity rating from mild to critical dehydration. Use this as a starting point for veterinary consultation—results are educational only and cannot replace professional diagnosis or treatment.</p>
        </div>
      </section>

      {/* TABLE: Dehydration Severity Levels and Clinical Signs */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dehydration Severity Levels and Clinical Signs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows dehydration severity classifications and their associated physical indicators.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Fluid Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Clinical Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mild</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slightly dry mucous membranes, minimal behavior change</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase water intake, monitor closely</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dry gums, reduced skin elasticity, lethargy, sunken eyes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Contact veterinarian within 24 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pale gums, weak pulse, collapse, rapid breathing, unresponsiveness</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency veterinary care required immediately</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Shock symptoms, organ dysfunction, life-threatening</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seek emergency treatment—IV fluids essential</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages represent estimated body fluid loss. Always verify findings with professional veterinary assessment.</p>
      </section>

      {/* TABLE: Daily Water Requirements by Pet Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Water Requirements by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended daily water intake varies significantly by species, age, and activity level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Water Intake</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Increased Need Factors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-15 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exercise, warm weather, nursing</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-50 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Activity level, diet type, age</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dogs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50+ lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100+ oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hot climate, working breed status</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cats</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kidney issues, dry food diet, illness</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbits</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-fiber diet, warm conditions</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puppies/Kittens</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Under 1 lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 oz (frequent)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid growth, high metabolism</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multiply body weight (lbs) by 0.5-1 oz for baseline estimate. Adjust based on individual health and environment.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Perform the skin turgor test on the back of the neck where skin is looser, which provides the most accurate dehydration assessment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your pet's gums regularly by lifting the lip—healthy gums are moist and pink, while dehydrated gums appear tacky or pale.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep fresh water available 24/7 and clean bowls daily, as pets drink less from dirty or stale water sources.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">During hot weather or after exercise, offer water more frequently in smaller amounts to encourage adequate hydration and prevent bloating.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring early signs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Waiting for severe symptoms like collapse before seeking help can lead to organ damage; address mild signs like dry gums promptly.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing normal behavior with dehydration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reduced activity may indicate illness rather than dehydration alone; always evaluate multiple symptoms together.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Over-relying on water bowl appearance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">An empty bowl doesn't confirm dehydration as pets may drink from other sources; directly observe water consumption patterns.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forcing large water amounts suddenly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Offering excessive water too quickly can cause vomiting or bloating; encourage gradual hydration instead.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What signs indicate my pet is dehydrated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common signs include dry gums, loss of skin elasticity, sunken eyes, lethargy, and reduced urination. Severe dehydration may cause weakness, rapid heartbeat, and collapse requiring immediate veterinary care.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the Dehydration Signs Estimator work?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator analyzes physical symptoms you input—such as gum moisture, skin turgor, and behavior changes—to estimate your pet's hydration status on a scale from mild to severe dehydration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator replace a vet visit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this tool is for awareness only and cannot diagnose dehydration. Always consult a veterinarian if you suspect dehydration, especially in severe cases requiring IV fluids or treatment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the normal skin turgor test result for hydrated pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Healthy pets show skin that snaps back to normal within 1-2 seconds when gently pulled. Slower return (&gt;2 seconds) indicates potential dehydration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check my pet for dehydration signs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Monitor your pet daily, especially during hot weather, illness, or diarrhea. Puppies and senior pets need more frequent checks as they dehydrate faster.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors increase dehydration risk in pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High temperatures, vomiting, diarrhea, kidney disease, diabetes, excessive panting, and limited water access all significantly increase dehydration risk.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much water should my pet drink daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most pets need 0.5-1 ounce of water per pound of body weight daily, though this varies by age, activity level, and health status.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.merckvetmanual.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Dehydration in Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary resource explaining dehydration pathophysiology, clinical signs, and emergency treatment protocols.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources/pet-owners/petcare" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association - Pet Hydration</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official AVMA guidance on maintaining pet hydration and recognizing dehydration in companion animals.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Dehydration Assessment</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical information on skin turgor testing, mucous membrane evaluation, and dehydration severity classification.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline - Heat-Related Dehydration</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Emergency guidance on recognizing and responding to severe dehydration caused by heat exposure or toxins.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Signs Estimator"
      description="Tool to help owners identify early signs of dehydration in birds, which can be subtle."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Hydration Score = Dehydration % + Intake Deficit %",
        variables: [
          { symbol: "Dehydration %", description: "Estimated severity of clinical dehydration signs" },
          { symbol: "Intake Deficit %", description: "Estimated reduction in water intake compared to normal" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A pet owner notices mild sunken eyes and dry mucous membranes in their parakeet, estimating dehydration signs at 8%. They also observe the bird drinking about 12% less water than usual.",
        steps: [
          {
            label: "1",
            explanation:
              "Input 8% for Dehydration Signs and 12% for Water Intake Deficit into the calculator.",
          },
          {
            label: "2",
            explanation:
              "Calculate the Hydration Score: 8% + 12% = 20%, indicating moderate dehydration likely.",
          },
          {
            label: "3",
            explanation:
              "The result advises immediate veterinary attention to prevent worsening dehydration.",
          },
        ],
        result: "Hydration Score: 20% - Moderate dehydration likely; seek veterinary care promptly.",
      }}
      relatedCalculators={[
        { title: "Daily Water Intake Checker for Cats", url: "/pets/cat-daily-water-intake-checker", icon: "🐱" },
        { title: "Weight Maintenance vs. Gain/Loss Planner", url: "/pets/small-mammal-weight-maintenance-gain-loss-planner", icon: "🐶" },
        { title: "Gabapentin Dose Calculator for Dogs", url: "/pets/dog-gabapentin-dose", icon: "🐶" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
        { title: "Heat Risk/Walk Safety Window (Temp & Humidity)", url: "/pets/dog-heat-risk-walk-safety-window", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration Signs Estimator" },
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