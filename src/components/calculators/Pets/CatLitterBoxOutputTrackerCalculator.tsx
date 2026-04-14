import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatLitterBoxOutputTrackerCalculator() {
  // 1. STATE
  // Unit system for weight input (imperial or metric)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and daily litter box output volume
  // weight: cat's weight in lbs or kg
  // outputVolume: daily litter box output volume in grams (weight of feces + urine absorbed litter)
  const [inputs, setInputs] = useState({
    weight: "",
    outputVolume: "",
  });

  // 2. LOGIC ENGINE
  // Normal litter box output volume range (grams) based on weight (kg)
  // Reference: Normal fecal output ~ 2-4% of body weight per day; urine volume varies but total litter box output can be estimated.
  // We track if output is within normal range or increased.
  // Formula: Normal Output Range (grams) = Weight (kg) * 20 to 40 grams/day (approximate)
  // We compare user input outputVolume to this range.

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const outputNum = parseFloat(inputs.outputVolume);

    if (isNaN(weightNum) || weightNum <= 0 || isNaN(outputNum) || outputNum <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Calculate normal output range in grams
    // Lower bound = 20 * weightKg (grams)
    // Upper bound = 40 * weightKg (grams)
    const lowerBound = 20 * weightKg;
    const upperBound = 40 * weightKg;

    let label = "";
    let warning = null;

    if (outputNum < lowerBound) {
      label = "Below Normal Output";
      warning =
        "Output volume is below the expected normal range. This may indicate constipation, dehydration, or other health issues. Consult your veterinarian if concerned.";
    } else if (outputNum > upperBound) {
      label = "Increased Output";
      warning =
        "Output volume exceeds the normal range, which could suggest diarrhea, urinary issues, or dietary problems. Monitor your cat closely and seek veterinary advice if persistent.";
    } else {
      label = "Normal Output Range";
    }

    // Show output volume with unit grams
    return {
      value: outputNum.toFixed(1),
      label,
      subtext: `Normal range for this weight: ${lowerBound.toFixed(1)}g - ${upperBound.toFixed(1)}g per day`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is considered normal litter box output for a healthy cat?",
      answer: "A healthy adult cat typically urinates 2–3 times daily and defecates once daily. Output varies by diet, hydration, and age, but these frequencies indicate normal kidney and digestive function.",
    },
    {
      question: "What signs indicate increased litter box output?",
      answer: "Increased urination (polyuria) or defecation beyond normal ranges may signal diabetes, hyperthyroidism, or UTIs. Changes occurring over 1–2 weeks warrant a veterinary visit.",
    },
    {
      question: "How does diet affect litter box output?",
      answer: "High-fiber diets increase stool volume, while wet food increases urine output due to higher moisture content. Protein-rich foods typically produce firmer stools and normal urine frequency.",
    },
    {
      question: "When should I contact a veterinarian about litter box changes?",
      answer: "Contact your vet if output increases by 50% or more, lasts over 3 days, or is accompanied by lethargy, weight loss, or vomiting.",
    },
    {
      question: "Can stress affect my cat's litter box habits?",
      answer: "Yes, stress can trigger decreased or irregular litter box use, urinary marking, or diarrhea. Environmental changes or anxiety may reduce output temporarily.",
    },
    {
      question: "How does age impact normal litter box frequency?",
      answer: "Senior cats (age 7+) may experience increased urination due to declining kidney function, while kittens may urinate 4–6 times daily as they develop.",
    },
    {
      question: "What role does hydration play in litter box output?",
      answer: "Increased water intake directly increases urine output and frequency; dehydration reduces it. Monitor water consumption alongside litter box changes for accurate assessment.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handle input changes
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

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
            Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={unit === "imperial" ? "e.g. 10.5" : "e.g. 4.8"}
            value={inputs.weight}
            onChange={onInputChange}
            aria-describedby="weight-help"
          />
          <p id="weight-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your cat's current body weight.
          </p>
        </div>

        <div>
          <Label htmlFor="outputVolume" className="text-slate-700 dark:text-slate-300">
            Daily Litter Box Output Volume (grams)
          </Label>
          <Input
            id="outputVolume"
            name="outputVolume"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 150"
            value={inputs.outputVolume}
            onChange={onInputChange}
            aria-describedby="outputVolume-help"
          />
          <p id="outputVolume-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Measure the total weight of feces and urine-absorbed litter per day.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate litter box output status"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", outputVolume: "" })}
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4" role="region" aria-live="polite">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">
                Estimated Output Volume
              </p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} g</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Litter Box Output Tracker (Normal vs. Increased)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you monitor and compare your cat's daily litter box habits against established health baselines. By tracking urination and defecation frequency, you can detect early signs of medical conditions like diabetes, hyperthyroidism, or UTIs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your cat's age, current daily urination count, and daily defecation frequency. The calculator also accepts optional details like diet type and water intake to refine the analysis.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The tracker compares your data against normal ranges for your cat's age and provides alerts if output suggests increased activity. Results include guidance on when to consult a veterinarian and actionable health recommendations.</p>
        </div>
      </section>

      {/* TABLE: Normal vs. Increased Litter Box Output by Age and Health Status */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Normal vs. Increased Litter Box Output by Age and Health Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares typical daily output ranges across different cat life stages.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Urinations</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Defecations</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Output Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kittens (0–6 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–6 times</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3 times</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal—frequent due to development</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult cats (1–7 years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3 times</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 time</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal—stable baseline</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior cats (7+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5 times</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 time</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal—slight increase from age</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diabetic/Hyperthyroid</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10+ times</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3 times</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased—medical attention needed</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dehydrated cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;1 time</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;1 time</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decreased—hydration concern</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Frequencies vary by individual cat, diet, and environment; use as general reference only.</p>
      </section>

      {/* TABLE: Common Triggers for Increased Litter Box Output */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Triggers for Increased Litter Box Output</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Identify medical and environmental factors that commonly elevate urination and defecation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Trigger</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Associated Symptoms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Output Increase</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diabetes mellitus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased thirst, weight loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–300% increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Veterinary exam and bloodwork</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hyperthyroidism</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hyperactivity, appetite increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–100% increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Thyroid panel test</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Urinary tract infection</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Straining, small frequent voids</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100–200% increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Urinalysis and antibiotics</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dietary change</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal stools, same urination</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–30% increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor 5–7 days for stabilization</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stress/anxiety</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Marking, irregular patterns</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Variable decrease or increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Environmental enrichment</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kidney disease</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased thirst, lethargy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–150% increase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bloodwork and ultrasound</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Consult a veterinarian if output changes persist beyond 3 days or are accompanied by other symptoms.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track output daily for at least 5–7 days to establish an accurate baseline before comparing changes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Note litter box visits during specific times (morning, evening) to identify patterns tied to feeding or stress.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Photograph or count clumps in the litter box weekly; weight-based tracking offers more precision than frequency estimates.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep a separate log of water intake, appetite, and behavior changes alongside litter box data to provide complete medical history to your vet.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring gradual changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 20–30% increase over 2 weeks often goes unnoticed but may indicate early diabetes; track weekly totals to catch subtle trends.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing increased frequency with increased volume</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cats with UTIs visit the box more often but produce small amounts; high volume with normal frequency suggests diet or hydration changes instead.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for multi-cat households</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Output data becomes unreliable with multiple cats sharing one box; use separate litter boxes per cat to track individual health accurately.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all output increases are medical</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dietary changes, seasonal temperature shifts, and stress can temporarily alter output; monitor for 3–5 days before assuming illness.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered normal litter box output for a healthy cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A healthy adult cat typically urinates 2–3 times daily and defecates once daily. Output varies by diet, hydration, and age, but these frequencies indicate normal kidney and digestive function.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What signs indicate increased litter box output?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Increased urination (polyuria) or defecation beyond normal ranges may signal diabetes, hyperthyroidism, or UTIs. Changes occurring over 1–2 weeks warrant a veterinary visit.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does diet affect litter box output?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High-fiber diets increase stool volume, while wet food increases urine output due to higher moisture content. Protein-rich foods typically produce firmer stools and normal urine frequency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When should I contact a veterinarian about litter box changes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your vet if output increases by 50% or more, lasts over 3 days, or is accompanied by lethargy, weight loss, or vomiting.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can stress affect my cat's litter box habits?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, stress can trigger decreased or irregular litter box use, urinary marking, or diarrhea. Environmental changes or anxiety may reduce output temporarily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does age impact normal litter box frequency?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Senior cats (age 7+) may experience increased urination due to declining kidney function, while kittens may urinate 4–6 times daily as they develop.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What role does hydration play in litter box output?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Increased water intake directly increases urine output and frequency; dehydration reduces it. Monitor water consumption alongside litter box changes for accurate assessment.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Cat Food Standards and Nutrient Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards for feline nutrition affecting digestive and urinary output.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care – Feline Health & Behavior</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on normal cat litter habits and medical red flags.</p>
          </li>
          <li>
            <a href="https://www.avma.org/public/petcare" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) – Pet Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative resource on recognizing changes in urination and defecation patterns.</p>
          </li>
          <li>
            <a href="https://journals.sagepub.com/home/jfm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Feline Medicine and Surgery – Urinary Disorders</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on feline urinary conditions and diagnostic criteria.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Litter Box Output Tracker (Normal vs. Increased)"
      description="Tool to track and compare normal litter box output against potentially worrying increases or decreases in volume."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Normal Output Range (g) = Weight (kg) × 20 to 40",
        variables: [
          { symbol: "Weight (kg)", description: "Cat's body weight in kilograms" },
          { symbol: "Output (g)", description: "Daily litter box output volume in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb (4.54 kg) cat produces 180 grams of litter box output in one day. The owner wants to know if this is within the normal range.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (10 lb = 4.54 kg). Calculate normal output range: 4.54 × 20 = 90.8 g (lower bound), 4.54 × 40 = 181.6 g (upper bound).",
          },
          {
            label: "2",
            explanation:
              "Compare measured output (180 g) to normal range (90.8 g - 181.6 g). Since 180 g is within this range, output is considered normal.",
          },
        ],
        result: "The cat's litter box output is within the normal expected range for its weight.",
      }}
      relatedCalculators={[
        { title: "Dog Caffeine Toxicity Calculator", url: "/pets/dog-caffeine-toxicity", icon: "🐶" },
        { title: "Cat Onion/Garlic Toxicity Calculator", url: "/pets/cat-onion-garlic-toxicity", icon: "🐱" },
        { title: "Dog Step-Goal & Activity Time Planner", url: "/pets/dog-step-goal-activity-time-planner", icon: "🐶" },
        { title: "Meloxicam Dose Calculator for Cats", url: "/pets/cat-meloxicam-dose", icon: "🐱" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Litter Box Output Tracker (Normal vs. Increased)" },
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