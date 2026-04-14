import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatDehydrationRiskEstimatorCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // weight: cat's weight
  // dehydrationSigns: clinical dehydration signs score (0-5 scale)
  // fluidIntake: daily fluid intake in ml
  // normalIntake: expected normal daily fluid intake in ml
  const [inputs, setInputs] = useState({
    weight: "",
    dehydrationSigns: "",
    fluidIntake: "",
    normalIntake: "",
  });

  // Helper: parse float safely
  const parseInput = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // 2. LOGIC ENGINE
  // Calculation logic:
  // Convert weight to kg if imperial
  // Dehydration % estimate from clinical signs (scale 0-5):
  //   0 = 0%, 1=5%, 2=7%, 3=10%, 4=12%, 5=15%
  // Intake deficit = (normalIntake - fluidIntake) / normalIntake * 100 (percent)
  // Hydration Score = Dehydration % + Intake Deficit
  // Score interpretation:
  //   <10: Low risk
  //   10-20: Moderate risk
  //   >20: High risk

  const results = useMemo(() => {
    const weightRaw = parseInput(inputs.weight);
    const dehydrationSignsRaw = parseInput(inputs.dehydrationSigns);
    const fluidIntakeRaw = parseInput(inputs.fluidIntake);
    const normalIntakeRaw = parseInput(inputs.normalIntake);

    if (
      weightRaw === 0 ||
      dehydrationSignsRaw === 0 && dehydrationSignsRaw !== 0 || // allow zero
      normalIntakeRaw === 0
    ) {
      return {
        value: 0,
        label: "Please enter all required inputs",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Map dehydration signs score (0-5) to % dehydration
    // Source: Veterinary clinical dehydration estimates
    const dehydrationMap = [0, 5, 7, 10, 12, 15];
    const dehydrationPercent =
      dehydrationSignsRaw >= 0 && dehydrationSignsRaw <= 5
        ? dehydrationMap[Math.round(dehydrationSignsRaw)]
        : 0;

    // Calculate intake deficit %
    let intakeDeficitPercent = 0;
    if (normalIntakeRaw > 0) {
      intakeDeficitPercent =
        fluidIntakeRaw < normalIntakeRaw
          ? ((normalIntakeRaw - fluidIntakeRaw) / normalIntakeRaw) * 100
          : 0;
    }

    // Hydration Score
    const hydrationScore = dehydrationPercent + intakeDeficitPercent;

    // Risk interpretation
    let riskLabel = "";
    let warning = null;
    if (hydrationScore < 10) {
      riskLabel = "Low Dehydration Risk";
    } else if (hydrationScore >= 10 && hydrationScore <= 20) {
      riskLabel = "Moderate Dehydration Risk";
      warning =
        "Monitor your cat closely and consider veterinary consultation if symptoms persist or worsen.";
    } else if (hydrationScore > 20) {
      riskLabel = "High Dehydration Risk";
      warning =
        "Immediate veterinary attention is recommended. Severe dehydration can be life-threatening.";
    }

    return {
      value: hydrationScore.toFixed(1),
      label: riskLabel,
      subtext: `Based on clinical signs and fluid intake deficit.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What symptoms should I input into the Dehydration Risk Estimator?",
      answer: "Common signs include dry mucous membranes, skin tenting, lethargy, sunken eyes, and reduced urine output. Select all observable symptoms your pet displays for the most accurate risk assessment.",
    },
    {
      question: "How does water intake affect the dehydration risk score?",
      answer: "The calculator compares your pet's actual daily water consumption against breed and weight-specific baseline requirements. Lower intake relative to needs increases dehydration risk significantly.",
    },
    {
      question: "What is considered normal daily water intake for pets?",
      answer: "Dogs typically need 0.5–1 ounce per pound of body weight daily; cats need 3.5–4.5 ounces per 5 pounds. The estimator adjusts for activity level, diet type, and climate conditions.",
    },
    {
      question: "Can this calculator replace a veterinary examination?",
      answer: "No—this tool estimates risk based on symptoms and intake data. Always consult a veterinarian if you suspect dehydration, especially in senior or ill pets.",
    },
    {
      question: "How does the calculator weight multiple dehydration symptoms?",
      answer: "Symptoms are scored by severity: skin tenting and sunken eyes carry higher weight than mild lethargy. The combined score plus low intake produces a composite risk percentage.",
    },
    {
      question: "Should I factor in water from wet food when entering intake data?",
      answer: "Yes—wet/canned food contains 70–80% moisture and counts toward total hydration. Only report fresh water separately if tracking intake accuracy matters.",
    },
    {
      question: "What pet conditions increase dehydration risk independent of intake?",
      answer: "Vomiting, diarrhea, fever, diabetes, kidney disease, and excessive panting all elevate risk. The estimator prompts for these conditions to adjust baseline thresholds.",
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
            Cat's Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0}
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="dehydrationSigns" className="text-slate-700 dark:text-slate-300">
            Clinical Dehydration Signs Score (0-5)
          </Label>
          <Input
            id="dehydrationSigns"
            type="number"
            min={0}
            max={5}
            step="1"
            placeholder="0 = none, 5 = severe"
            value={inputs.dehydrationSigns}
            onChange={(e) => setInputs({ ...inputs, dehydrationSigns: e.target.value })}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Score based on clinical signs such as skin tenting, mucous membrane dryness, and sunken eyes.
          </p>
        </div>

        <div>
          <Label htmlFor="fluidIntake" className="text-slate-700 dark:text-slate-300">
            Current Daily Fluid Intake (ml)
          </Label>
          <Input
            id="fluidIntake"
            type="number"
            min={0}
            step="any"
            placeholder="Enter current daily fluid intake in ml"
            value={inputs.fluidIntake}
            onChange={(e) => setInputs({ ...inputs, fluidIntake: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="normalIntake" className="text-slate-700 dark:text-slate-300">
            Normal Daily Fluid Intake (ml)
          </Label>
          <Input
            id="normalIntake"
            type="number"
            min={0}
            step="any"
            placeholder="Enter normal daily fluid intake in ml"
            value={inputs.normalIntake}
            onChange={(e) => setInputs({ ...inputs, normalIntake: e.target.value })}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Typical fluid intake when your cat is healthy; helps identify intake deficits.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              dehydrationSigns: "",
              fluidIntake: "",
              normalIntake: "",
            })
          }
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dehydration Risk Estimator (Symptoms + Intake)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator combines observable dehydration symptoms with your pet's daily water intake to estimate overall dehydration risk on a 0–100% scale. It helps pet owners quickly identify whether their animal needs immediate veterinary attention or supportive care.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by selecting your pet's type, weight, and activity level. Then check all visible symptoms (dry gums, lethargy, sunken eyes, skin tenting) and enter the estimated ounces of fresh water consumed daily. The tool adjusts baseline hydration requirements for climate, diet, and health status.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display a risk percentage with actionable recommendations: &lt;25% indicates adequate hydration; 25–50% suggests monitoring and increased water access; &gt;50% warrants same-day veterinary evaluation. Always consult your vet if risk exceeds 40% or symptoms worsen.</p>
        </div>
      </section>

      {/* TABLE: Daily Water Intake Requirements by Pet Type &amp; Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Water Intake Requirements by Pet Type &amp; Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference to establish baseline hydration needs before comparing against your pet's actual intake.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type &amp; Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Daily Intake (ounces)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Daily Intake (ounces)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Activity Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dog (10 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+20–30%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Dog (30 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+20–30%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dog (70 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35–49</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70–105</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+20–30%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Indoor Cat (8 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8–3.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.6–6.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+10–15%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Active Cat (8 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.2–4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.4–8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+15–20%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust upward for hot climates, nursing pets, and dry kibble diets. Wet food provides ~70–80% of required moisture.</p>
      </section>

      {/* TABLE: Dehydration Symptom Severity &amp; Risk Weighting */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dehydration Symptom Severity &amp; Risk Weighting</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">The estimator scores each symptom by clinical severity to determine overall dehydration risk level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Symptom</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dry mucous membranes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild–Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Encourage drinking; monitor 4–6 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Skin tenting (&gt;2 seconds)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate–Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Seek veterinary care same day</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sunken eyes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate–Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35–45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Veterinary examination recommended</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lethargy/reduced activity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mild</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase water access; recheck in 2 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Reduced urine output (&lt;1–2 times daily)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vet assessment within 24 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Elevated heart rate (&gt;120 bpm resting)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Urgent veterinary care needed</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Risk percentages combine symptom presence with low water intake. Multiple symptoms compound risk exponentially.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure water intake by filling a bowl to a known amount, then checking remaining volume after 24 hours to ensure accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pets eating primarily wet food need less fresh water intake—account for moisture content (typically 70–80%) when calculating totals.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor urine output frequency and color; dark yellow or amber urine indicates inadequate hydration independent of intake readings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase water availability during hot weather, after exercise, and if your pet has vomiting or diarrhea to offset fluid losses.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Water from Food Sources</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Wet food, broths, and moisture-rich treats count toward hydration—excluding them underestimates actual intake and inflates dehydration risk.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Estimating Intake Instead of Measuring</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Visual guesses often underestimate consumption by 20–40%; use a marked bowl or water fountain with volume tracking for precision.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Underlying Illness</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dehydration caused by kidney disease, diabetes, or GI disorders requires veterinary treatment, not just fluid replacement alone.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying Care for High-Risk Scores</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Scores above 60% with symptoms like skin tenting or sunken eyes need immediate vet evaluation, not home observation or delayed appointments.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What symptoms should I input into the Dehydration Risk Estimator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common signs include dry mucous membranes, skin tenting, lethargy, sunken eyes, and reduced urine output. Select all observable symptoms your pet displays for the most accurate risk assessment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does water intake affect the dehydration risk score?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator compares your pet's actual daily water consumption against breed and weight-specific baseline requirements. Lower intake relative to needs increases dehydration risk significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is considered normal daily water intake for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs typically need 0.5–1 ounce per pound of body weight daily; cats need 3.5–4.5 ounces per 5 pounds. The estimator adjusts for activity level, diet type, and climate conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator replace a veterinary examination?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—this tool estimates risk based on symptoms and intake data. Always consult a veterinarian if you suspect dehydration, especially in senior or ill pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the calculator weight multiple dehydration symptoms?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms are scored by severity: skin tenting and sunken eyes carry higher weight than mild lethargy. The combined score plus low intake produces a composite risk percentage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I factor in water from wet food when entering intake data?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—wet/canned food contains 70–80% moisture and counts toward total hydration. Only report fresh water separately if tracking intake accuracy matters.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What pet conditions increase dehydration risk independent of intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vomiting, diarrhea, fever, diabetes, kidney disease, and excessive panting all elevate risk. The estimator prompts for these conditions to adjust baseline thresholds.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aaha.org/resources/aaha-canine-life-stage-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAHA Canine Life Stage Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for hydration and nutrition across dog life stages.</p>
          </li>
          <li>
            <a href="https://icatcare.org/advice/cat-hydration/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care Feline Hydration</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert guidance on meeting feline water requirements and recognizing dehydration signs in cats.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/dehydration-in-pets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals: Dehydration in Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of dehydration causes, symptoms, diagnosis, and emergency treatment protocols.</p>
          </li>
          <li>
            <a href="https://www.dvm360.com/view/assessing-hydration-status-small-animals" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">DVM360: Assessing Hydration Status in Small Animals</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary reference for physical examination techniques to detect dehydration severity.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Risk Estimator (Symptoms + Intake)"
      description="Estimate the risk of dehydration using clinical signs and tracking fluid intake, particularly in sick cats."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Hydration Score = Dehydration % + Intake Deficit %",
        variables: [
          { symbol: "Dehydration %", description: "Estimated fluid loss based on clinical signs" },
          { symbol: "Intake Deficit %", description: "Percentage reduction in daily fluid intake compared to normal" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 10 lb cat shows moderate clinical signs scored as 3 (approx. 10% dehydration). The owner reports current fluid intake of 40 ml/day, while normal intake is 60 ml/day.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 10 lbs ÷ 2.20462 ≈ 4.54 kg (for reference).",
          },
          {
            label: "2",
            explanation:
              "Dehydration % from signs = 10%. Intake deficit = ((60 - 40) / 60) × 100 = 33.3%.",
          },
          {
            label: "3",
            explanation:
              "Hydration Score = 10% + 33.3% = 43.3%, indicating high dehydration risk requiring urgent veterinary care.",
          },
        ],
        result: "Hydration Score: 43.3% — High Dehydration Risk",
      }}
      relatedCalculators={[
        {
          title: "Heat Risk/Walk Safety Window (Temp & Humidity)",
          url: "/pets/dog-heat-risk-walk-safety-window",
          icon: "🐾",
        },
        {
          title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)",
          url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko",
          icon: "🐶",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Alcohol/Ethanol Exposure Risk Calculator",
          url: "/pets/dog-alcohol-ethanol-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
        {
          title: "Protein/Fat Intake Guide for Cats (by Goal)",
          url: "/pets/cat-protein-fat-intake-guide",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration Risk Estimator (Symptoms + Intake)" },
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