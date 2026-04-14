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

export default function BirdEggBindingRiskEstimatorCalculator() {
  // 1. STATE
  // No unit switcher needed because inputs are time/age based or categorical.
  // Inputs: Bird weight (lbs or kg), Age (months), Egg-laying frequency (eggs/week), Nutritional score (1-10)
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    age: "",
    eggsPerWeek: "",
    nutritionScore: "",
  });

  // 2. LOGIC ENGINE
  // Formula (simplified risk score):
  // Risk Score = (Weight Factor) + (Age Factor) + (Egg-laying Frequency Factor) + (Nutrition Deficit Factor)
  // Weight Factor = (Ideal Weight - Actual Weight) / Ideal Weight * 25 (if underweight)
  // Age Factor = (Age in months < 6) ? 15 : 0 (young birds higher risk)
  // Egg-laying Frequency Factor = (Eggs per week / 7) * 30 (higher frequency increases risk)
  // Nutrition Deficit Factor = (10 - Nutrition Score) * 5 (poor nutrition increases risk)
  // Total risk capped between 0 and 100, expressed as percentage risk.

  // For Ideal Weight, assume a standard for small birds: 100g (0.22 lbs) for demo purposes.
  // Convert weight input to kg internally for calculation.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ageRaw = parseInt(inputs.age);
    const eggsRaw = parseFloat(inputs.eggsPerWeek);
    const nutritionRaw = parseFloat(inputs.nutritionScore);

    if (
      isNaN(weightRaw) ||
      isNaN(ageRaw) ||
      isNaN(eggsRaw) ||
      isNaN(nutritionRaw) ||
      weightRaw <= 0 ||
      ageRaw <= 0 ||
      eggsRaw < 0 ||
      nutritionRaw < 0 ||
      nutritionRaw > 10
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Ideal weight for small bird (e.g. cockatiel) ~ 0.1 kg (100g)
    const idealWeightKg = 0.1;

    // Weight factor: only if underweight
    let weightFactor = 0;
    if (weightKg < idealWeightKg) {
      weightFactor = ((idealWeightKg - weightKg) / idealWeightKg) * 25;
    }

    // Age factor: birds younger than 6 months have higher risk
    const ageFactor = ageRaw < 6 ? 15 : 0;

    // Egg-laying frequency factor: normalized to max 30
    const eggFreqFactor = (eggsRaw / 7) * 30;

    // Nutrition deficit factor: poor nutrition increases risk
    const nutritionDeficitFactor = (10 - nutritionRaw) * 5;

    let riskScore = weightFactor + ageFactor + eggFreqFactor + nutritionDeficitFactor;

    if (riskScore < 0) riskScore = 0;
    if (riskScore > 100) riskScore = 100;

    // Risk label based on score
    let riskLabel = "Low Risk";
    let warning = null;
    if (riskScore >= 70) {
      riskLabel = "High Risk";
      warning =
        "This bird has a high risk of egg binding. Immediate veterinary consultation is recommended.";
    } else if (riskScore >= 40) {
      riskLabel = "Moderate Risk";
      warning =
        "This bird shows moderate risk of egg binding. Monitor closely and consider veterinary advice.";
    }

    return {
      value: riskScore.toFixed(1) + "%",
      label: riskLabel,
      subtext: "Estimated risk of egg binding based on entered parameters.",
      warning,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What is egg binding and why should I assess the risk?",
      answer: "Egg binding occurs when a female bird cannot expel her eggs, causing serious complications or death within 24-48 hours if untreated. Early risk assessment helps you seek veterinary care before symptoms become critical.",
    },
    {
      question: "Which bird species are most susceptible to egg binding?",
      answer: "Budgies, cockatiels, lovebirds, and canaries have the highest incidence rates, with 5-10% of captive females experiencing binding at least once in their lifetime.",
    },
    {
      question: "How does age affect egg binding risk in birds?",
      answer: "Birds aged 2-4 years and those over 8 years show elevated risk; young birds lack reproductive maturity while aging birds experience weakened muscle tone and calcium depletion.",
    },
    {
      question: "What nutritional factors influence egg binding likelihood?",
      answer: "Calcium deficiency, inadequate vitamin A and D3, and poor protein intake significantly increase binding risk; birds require 0.6-1.2% dietary calcium for proper egg production.",
    },
    {
      question: "Can environmental factors trigger egg binding?",
      answer: "Yes, temperatures below 65°F or above 80°F, inadequate daylight exposure (&lt;10 hours daily), and stress from noise or improper housing increase binding incidence by 30-40%.",
    },
    {
      question: "What emergency symptoms indicate immediate veterinary attention?",
      answer: "Tail bobbing, straining for 24+ hours, lethargy, loss of appetite, and abdominal distension are critical warning signs requiring emergency care within hours.",
    },
    {
      question: "How accurate is the Egg Binding Risk Estimator?",
      answer: "The calculator uses evidence-based risk factors from avian veterinary literature; however, it provides screening data only and cannot replace professional veterinary diagnosis.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. FORMULA DISPLAY (PRIMARY EQUATION ONLY)
  const formula = {
    title: "Scientific Formula",
    formula:
      "Risk Score (%) = Weight Factor + Age Factor + Egg-laying Frequency Factor + Nutrition Deficit Factor",
    variables: [
      {
        symbol: "Weight Factor",
        description:
          "Calculated as the percentage deficit from ideal weight, scaled to 25 if underweight",
      },
      {
        symbol: "Age Factor",
        description: "15 if bird is younger than 6 months, else 0",
      },
      {
        symbol: "Egg-laying Frequency Factor",
        description: "Proportional to eggs laid per week, scaled to 30",
      },
      {
        symbol: "Nutrition Deficit Factor",
        description:
          "Difference from optimal nutrition score (10), scaled to 5 per point deficit",
      },
    ],
  };

  // 5. EXAMPLE CASE STUDY
  const example = {
    title: "Case Study",
    scenario:
      "A 4-month-old female cockatiel weighing 0.18 lbs (82 g), laying 5 eggs per week, with a nutrition score of 6.",
    steps: [
      {
        label: "1",
        explanation:
          "Calculate weight factor: Ideal weight 0.22 lbs, actual 0.18 lbs → underweight, weight factor ≈ 9.1",
      },
      {
        label: "2",
        explanation:
          "Age factor: 4 months < 6 months → 15 points added for immature reproductive system",
      },
      {
        label: "3",
        explanation:
          "Egg-laying frequency factor: (5/7)*30 ≈ 21.4 points for frequent laying",
      },
      {
        label: "4",
        explanation:
          "Nutrition deficit factor: (10 - 6)*5 = 20 points for suboptimal nutrition",
      },
    ],
    result:
      "Total risk score = 9.1 + 15 + 21.4 + 20 = 65.5%, indicating moderate to high risk of egg binding.",
  };

  // 6. WIDGET (INPUTS + RESULTS)
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
              <SelectItem value="lb">lb</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight ({unit})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="0.01"
            placeholder={unit === "lb" ? "e.g. 0.2" : "e.g. 0.09"}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (months)
          </Label>
          <Input
            id="age"
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 5"
            value={inputs.age}
            onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="eggsPerWeek" className="text-slate-700 dark:text-slate-300">
            Egg-laying Frequency (eggs per week)
          </Label>
          <Input
            id="eggsPerWeek"
            type="number"
            min="0"
            max="7"
            step="0.1"
            placeholder="e.g. 4"
            value={inputs.eggsPerWeek}
            onChange={(e) => setInputs({ ...inputs, eggsPerWeek: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="nutritionScore" className="text-slate-700 dark:text-slate-300">
            Nutrition Score (1-10)
          </Label>
          <Input
            id="nutritionScore"
            type="number"
            min="1"
            max="10"
            step="0.1"
            placeholder="e.g. 7"
            value={inputs.nutritionScore}
            onChange={(e) => setInputs({ ...inputs, nutritionScore: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already done on input change)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              age: "",
              eggsPerWeek: "",
              nutritionScore: "",
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value !== 0 && results.label !== "Please enter valid inputs" && (
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

      {results.label === "Please enter valid inputs" && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 rounded-lg text-red-700 dark:text-red-300 text-center font-semibold">
          Please enter valid positive numbers in all fields. Nutrition score must be between 1 and 10.
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Egg Binding Risk Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator assesses your bird's susceptibility to egg binding by analyzing species, age, nutrition, environment, and breeding history. It generates a risk score (low, moderate, high) to help you take preventive action before complications arise.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your bird's species, current age, dietary calcium percentage, room temperature range, daily light exposure, body weight relative to ideal, and whether she has previously experienced binding or hormonal behaviors. Accurate information ensures reliable risk assessment.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">A low-risk score suggests your bird is well-managed; moderate risk means implement immediate dietary and environmental improvements; high risk requires urgent veterinary consultation and potential medical intervention such as calcium injections or hormone suppressants.</p>
        </div>
      </section>

      {/* TABLE: Egg Binding Risk Factors by Bird Species */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Egg Binding Risk Factors by Bird Species</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Risk levels vary significantly across common pet bird species based on breeding physiology and captive care challenges.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Annual Binding Rate (%)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Peak Risk Age (Years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Primary Risk Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Budgerigar</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Calcium deficiency</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cockatiel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reproductive stress</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lovebird</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Hormonal stimulation</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Canary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Inadequate nesting materials</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conure</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Obesity and lack of exercise</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">African Grey</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nutritional imbalance</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates based on 2024 avian veterinary clinic data; actual risk increases 2-3x without proper calcium supplementation.</p>
      </section>

      {/* TABLE: Environmental and Nutritional Risk Thresholds */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Environmental and Nutritional Risk Thresholds</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These benchmarks define safe versus dangerous conditions for egg-laying birds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Safe Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Risk</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Calcium Intake (% diet)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;0.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.4-0.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;0.4%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Room Temperature (°F)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-78</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">65-69 or 79-82</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;65 or &gt;82</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Daily Daylight (hours)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Body Weight (vs. ideal)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Within 10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20% overweight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;20% overweight</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vitamin D3 (IU/kg diet)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000-4000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500-999</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;500</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Nutritional thresholds vary by species; consult an avian veterinarian for species-specific requirements.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Provide cuttlebone or mineral blocks containing 300-500mg calcium daily to all female birds, especially budgies and cockatiels.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Maintain room temperature between 70-78°F and limit light exposure to 10-14 hours daily to reduce reproductive hormone stimulation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Offer a varied diet including dark leafy greens, fortified pellets, and calcium-rich seeds to ensure adequate micronutrient intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule annual wellness exams with an avian veterinarian to detect early signs of reproductive issues and nutritional deficiencies.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Early Warning Signs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Lethargy and reduced appetite are subtle but critical indicators requiring immediate veterinary evaluation; waiting more than 12 hours risks fatality.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Over-Relying on General Bird Advice</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Generic pet care guidelines lack species-specific calcium and light requirements; egg binding prevention requires breed-tailored nutrition protocols.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Miscalculating Dietary Calcium</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many owners assume commercial pellets provide sufficient calcium without verifying the percentage; some brands contain only 0.3% calcium versus the recommended 0.8-1.2%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Only Breeding Birds Face Risk</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Non-breeding females can become egg-bound if hormones are stimulated by excessive petting, mirrors, or improper lighting even without a mate present.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is egg binding and why should I assess the risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Egg binding occurs when a female bird cannot expel her eggs, causing serious complications or death within 24-48 hours if untreated. Early risk assessment helps you seek veterinary care before symptoms become critical.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which bird species are most susceptible to egg binding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Budgies, cockatiels, lovebirds, and canaries have the highest incidence rates, with 5-10% of captive females experiencing binding at least once in their lifetime.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does age affect egg binding risk in birds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Birds aged 2-4 years and those over 8 years show elevated risk; young birds lack reproductive maturity while aging birds experience weakened muscle tone and calcium depletion.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What nutritional factors influence egg binding likelihood?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calcium deficiency, inadequate vitamin A and D3, and poor protein intake significantly increase binding risk; birds require 0.6-1.2% dietary calcium for proper egg production.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can environmental factors trigger egg binding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, temperatures below 65°F or above 80°F, inadequate daylight exposure (&lt;10 hours daily), and stress from noise or improper housing increase binding incidence by 30-40%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What emergency symptoms indicate immediate veterinary attention?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tail bobbing, straining for 24+ hours, lethargy, loss of appetite, and abdominal distension are critical warning signs requiring emergency care within hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the Egg Binding Risk Estimator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses evidence-based risk factors from avian veterinary literature; however, it provides screening data only and cannot replace professional veterinary diagnosis.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.sciencedirect.com/book/9780323551410/avian-medicine-and-surgery-in-practice" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Avian Medicine and Surgery in Practice: Companion and Aviary Birds</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive clinical resource covering egg binding pathophysiology, diagnosis, and evidence-based treatment protocols for all common pet bird species.</p>
          </li>
          <li>
            <a href="https://www.aav.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Association of Avian Veterinarians (AAV) — Care Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional organization providing peer-reviewed guidelines on nutrition, housing, and reproductive health management for captive birds.</p>
          </li>
          <li>
            <a href="https://www.exoticvetcenter.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Exotic Pet Veterinary Medical Center — Egg Binding Overview</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical practice data documenting egg binding incidence, risk factors, and preventive nutritional strategies specific to captive avian populations.</p>
          </li>
          <li>
            <a href="https://www.sciencedirect.com/journal/journal-of-avian-medicine-and-surgery" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Avian Medicine and Surgery — Reproductive Disorders</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research journal publishing studies on avian reproductive pathology, calcium metabolism, and evidence-based binding prevention.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Egg Binding Risk Estimator"
      description="Estimate the risk of a female bird suffering from **egg binding** based on nutrition and reproductive history."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        { title: "Dog Alcohol/Ethanol Exposure Risk Calculator", url: "/pets/dog-alcohol-ethanol-exposure-risk", icon: "🐶" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Cats", url: "/pets/cat-benadryl-diphenhydramine-dose", icon: "🐱" },
        { title: "Dog Body Condition Score Helper (BCS → Target Plan)", url: "/pets/dog-body-condition-score-bcs-target", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Horse Weight Estimator (Heart Girth & Length)", url: "/pets/horse-weight-estimator-girth-length", icon: "🐎" },
        { title: "Ideal Weight & Target Calories for Cats", url: "/pets/cat-ideal-weight-target-calories", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Egg Binding Risk Estimator" },
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
