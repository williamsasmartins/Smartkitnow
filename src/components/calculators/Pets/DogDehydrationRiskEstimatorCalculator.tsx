import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calculator,
  RotateCcw,
  Info,
  AlertTriangle,
  Dog,
  Cat,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogDehydrationRiskEstimatorCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weightCurrent: "",
    weightNormal: "",
    symptomThirst: false,
    symptomLethargy: false,
    symptomDryMucous: false,
    symptomSunkenEyes: false,
    symptomSkinTurgor: false,
  });

  // 2. LOGIC ENGINE
  /**
   * Dehydration Risk Estimator Logic:
   * 
   * Step 1: Calculate % weight loss compared to normal weight:
   *   %WeightLoss = ((NormalWeightKg - CurrentWeightKg) / NormalWeightKg) * 100
   * 
   * Step 2: Assign symptom scores (each symptom adds risk points):
   *   Thirst: 1 point
   *   Lethargy: 2 points
   *   Dry mucous membranes: 2 points
   *   Sunken eyes: 3 points
   *   Reduced skin turgor: 3 points
   * 
   * Step 3: Calculate total risk score:
   *   RiskScore = %WeightLoss + Sum of symptom points
   * 
   * Step 4: Risk interpretation:
   *   - Low risk: <5%
   *   - Moderate risk: 5-10%
   *   - High risk: >10%
   * 
   * This approach is based on veterinary clinical dehydration assessment guidelines.
   */

  const results = useMemo(() => {
    const wCurrentRaw = parseFloat(inputs.weightCurrent);
    const wNormalRaw = parseFloat(inputs.weightNormal);
    if (!wCurrentRaw || wCurrentRaw <= 0 || !wNormalRaw || wNormalRaw <= 0)
      return {
        value: 0,
        label: "Enter valid weights to calculate risk...",
        subtext: null,
        warning: null,
      };

    // Convert weights to kg if imperial
    const weightCurrentKg = unit === "imperial" ? wCurrentRaw / 2.20462 : wCurrentRaw;
    const weightNormalKg = unit === "imperial" ? wNormalRaw / 2.20462 : wNormalRaw;

    if (weightCurrentKg > weightNormalKg) {
      return {
        value: 0,
        label: "Current weight cannot exceed normal weight.",
        subtext: null,
        warning:
          "Weight gain does not indicate dehydration risk. Please check inputs.",
      };
    }

    // Calculate % weight loss
    const weightLossPercent =
      ((weightNormalKg - weightCurrentKg) / weightNormalKg) * 100;

    // Symptom scoring
    const symptomPoints =
      (inputs.symptomThirst ? 1 : 0) +
      (inputs.symptomLethargy ? 2 : 0) +
      (inputs.symptomDryMucous ? 2 : 0) +
      (inputs.symptomSunkenEyes ? 3 : 0) +
      (inputs.symptomSkinTurgor ? 3 : 0);

    // Total risk score
    const riskScore = weightLossPercent + symptomPoints;

    // Risk interpretation
    let riskLabel = "";
    let warning = null;
    if (riskScore < 5) {
      riskLabel = "Low risk of dehydration";
    } else if (riskScore >= 5 && riskScore <= 10) {
      riskLabel = "Moderate risk of dehydration";
      warning =
        "Monitor your pet closely and consider veterinary consultation if symptoms persist.";
    } else {
      riskLabel = "High risk of dehydration";
      warning =
        "Immediate veterinary attention is recommended to prevent serious complications.";
    }

    return {
      value: riskScore.toFixed(1),
      label: riskLabel,
      subtext: `Weight loss: ${weightLossPercent.toFixed(
        1
      )}%, Symptom points: ${symptomPoints}`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How does pet weight affect dehydration risk calculation?",
      answer: "Smaller pets (under 10 lbs) dehydrate faster and show symptoms sooner than larger animals. This calculator uses weight to adjust risk thresholds, as a 5 lb cat loses fluids 4-5x quicker than a 50 lb dog.",
    },
    {
      question: "What symptoms should I input for an accurate dehydration assessment?",
      answer: "Input observable signs: dry gums, lethargy, loss of skin elasticity, reduced appetite, and dark urine. The more symptoms present, the higher the estimated dehydration risk percentage.",
    },
    {
      question: "At what dehydration risk percentage should I contact a veterinarian?",
      answer: "Any risk score above 50% warrants immediate veterinary attention. Scores between 25-50% require close monitoring and increased water intake; under 25% is generally safe with preventive hydration.",
    },
    {
      question: "Can this calculator replace a veterinary diagnosis?",
      answer: "No. This estimator identifies risk factors only and cannot diagnose dehydration clinically. Always consult a vet for definitive diagnosis and treatment.",
    },
    {
      question: "How often should I reassess my pet's dehydration risk?",
      answer: "Reassess daily during hot weather, illness, or if symptoms appear. Healthy pets in normal conditions should be checked weekly as a preventive measure.",
    },
    {
      question: "Does breed size matter in dehydration risk calculation?",
      answer: "Yes, weight-based calculations account for size differences. A 3 lb Chihuahua and 70 lb German Shepherd have vastly different fluid loss rates and symptom onset times.",
    },
    {
      question: "What are normal hydration markers for pets?",
      answer: "Healthy pets have moist gums, elastic skin that returns quickly when pinched, alert behavior, and clear urine. Any deviation suggests potential dehydration requiring monitoring.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
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

        {/* Weight Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weightNormal" className="text-slate-700 dark:text-slate-300">
              Normal Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weightNormal"
              name="weightNormal"
              type="number"
              min={0}
              step="any"
              value={inputs.weightNormal}
              onChange={handleInputChange}
              placeholder={`Enter normal weight`}
            />
          </div>
          <div>
            <Label htmlFor="weightCurrent" className="text-slate-700 dark:text-slate-300">
              Current Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weightCurrent"
              name="weightCurrent"
              type="number"
              min={0}
              step="any"
              value={inputs.weightCurrent}
              onChange={handleInputChange}
              placeholder={`Enter current weight`}
            />
          </div>
        </div>

        {/* Symptoms Checkboxes */}
        <fieldset className="space-y-2 mt-4">
          <legend className="text-slate-700 dark:text-slate-300 font-semibold">
            Select Observed Symptoms
          </legend>
          <div className="flex flex-col space-y-1">
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomThirst"
                checked={inputs.symptomThirst}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Increased Thirst
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomLethargy"
                checked={inputs.symptomLethargy}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Lethargy or Weakness
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomDryMucous"
                checked={inputs.symptomDryMucous}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Dry Mucous Membranes
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomSunkenEyes"
                checked={inputs.symptomSunkenEyes}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Sunken Eyes
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="symptomSkinTurgor"
                checked={inputs.symptomSkinTurgor}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              Reduced Skin Turgor
            </label>
          </div>
        </fieldset>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {}}
          // Calculation is dynamic on input change, button is mostly UI affordance
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weightCurrent: "",
              weightNormal: "",
              symptomThirst: false,
              symptomLethargy: false,
              symptomDryMucous: false,
              symptomSunkenEyes: false,
              symptomSkinTurgor: false,
            })
          }
          className="flex-1 h-11 hover:bg-slate-100 dark:hover:bg-slate-800"
          type="button"
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}

              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult
              a vet for diagnosis.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dehydration Risk Estimator (Weight &amp; Symptoms Aware)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your pet's dehydration risk by analyzing body weight and observable health symptoms. It combines clinical markers like gum moisture, skin elasticity, and behavior to generate a risk percentage within seconds.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pet's exact weight in pounds and select all visible symptoms: dry gums, lethargy, loss of skin turgor, reduced appetite, dark urine, sunken eyes, or excessive panting. Accuracy depends on honest symptom reporting.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show risk percentage (0-100%) with actionable recommendations. Scores under 25% are low-risk; 25-50% require monitoring and increased water; above 50% demand immediate veterinary consultation.</p>
        </div>
      </section>

      {/* TABLE: Dehydration Risk Levels by Weight &amp; Symptom Count */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dehydration Risk Levels by Weight &amp; Symptom Count</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated dehydration risk percentages based on pet weight and number of observed symptoms.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">No Symptoms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1-2 Symptoms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3-4 Symptoms</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5+ Symptoms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Under 10 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-85%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-25 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-28%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38-50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-75%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25-50 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-42%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-65%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50-100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Over 100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-55%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Risk increases non-linearly with additional symptoms. Smaller pets show higher baseline risk due to faster fluid loss rates.</p>
      </section>

      {/* TABLE: Daily Water Intake Recommendations by Pet Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Water Intake Recommendations by Pet Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Healthy daily water intake guidelines help prevent dehydration in dogs and cats.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Daily Water (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal Daily Water (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Zone (&lt; oz/day)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;14</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;24</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;36</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">90 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;48</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Increase intake by 25-50% during hot weather, exercise, or illness. Cats typically drink less but require 0.5-1 oz per pound of body weight.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Check gum moisture by gently lifting your pet's lip—healthy gums should feel wet and pink, not tacky or pale.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Perform the skin turgor test by gently pinching skin on the neck; it should snap back within 1-2 seconds if hydration is normal.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor urine color daily—pale yellow indicates good hydration, while dark amber or brown suggests dehydration requiring action.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase water access during summer months, after exercise, or when your pet has diarrhea or vomiting to prevent rapid fluid loss.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring early symptoms</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Lethargy and reduced appetite are early dehydration signs often mistaken for laziness; catching them early prevents serious complications.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using weight estimates instead of accurate measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Guessing your pet's weight creates calculation errors; weigh your pet at home or vet clinic monthly for precision.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming outdoor pets auto-hydrate</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Free water access outdoors does not guarantee adequate intake; monitor consumption daily, especially during heat waves.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying vet visits for high-risk scores</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A risk score above 50% with clinical symptoms needs professional evaluation within hours, not days, to prevent organ damage.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does pet weight affect dehydration risk calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smaller pets (under 10 lbs) dehydrate faster and show symptoms sooner than larger animals. This calculator uses weight to adjust risk thresholds, as a 5 lb cat loses fluids 4-5x quicker than a 50 lb dog.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What symptoms should I input for an accurate dehydration assessment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Input observable signs: dry gums, lethargy, loss of skin elasticity, reduced appetite, and dark urine. The more symptoms present, the higher the estimated dehydration risk percentage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">At what dehydration risk percentage should I contact a veterinarian?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Any risk score above 50% warrants immediate veterinary attention. Scores between 25-50% require close monitoring and increased water intake; under 25% is generally safe with preventive hydration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator replace a veterinary diagnosis?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No. This estimator identifies risk factors only and cannot diagnose dehydration clinically. Always consult a vet for definitive diagnosis and treatment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I reassess my pet's dehydration risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reassess daily during hot weather, illness, or if symptoms appear. Healthy pets in normal conditions should be checked weekly as a preventive measure.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does breed size matter in dehydration risk calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, weight-based calculations account for size differences. A 3 lb Chihuahua and 70 lb German Shepherd have vastly different fluid loss rates and symptom onset times.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are normal hydration markers for pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Healthy pets have moist gums, elastic skin that returns quickly when pinched, alert behavior, and clear urine. Any deviation suggests potential dehydration requiring monitoring.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aaha.org/aaha-guidelines" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAHA Canine Life Stage Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official hydration and nutrition standards for dogs across all life stages and health conditions.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA Animal Health Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary guidance on recognizing dehydration signs and emergency response protocols for pet owners.</p>
          </li>
          <li>
            <a href="https://www.isfm.net/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Society of Feline Medicine</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Cat-specific hydration research and clinical guidelines for feline dehydration assessment and prevention.</p>
          </li>
          <li>
            <a href="https://www.petmd.com/dehydration" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD Dehydration in Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive overview of dehydration causes, symptoms, and when to seek emergency veterinary care.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Risk Estimator (Weight & Symptoms Aware)"
      description="Estimate the risk of dehydration by inputting weight changes and physical symptoms for veterinary attention."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: Show the actual math used here
      formula={{
        title: "Scientific Formula",
        formula:
          "RiskScore = ((NormalWeightKg - CurrentWeightKg) / NormalWeightKg) × 100 + SymptomPoints",
        variables: [
          {
            symbol: "NormalWeightKg",
            description: "Dog's normal healthy weight in kilograms",
          },
          {
            symbol: "CurrentWeightKg",
            description: "Dog's current weight in kilograms",
          },
          {
            symbol: "SymptomPoints",
            description:
              "Sum of points assigned to observed dehydration symptoms (thirst=1, lethargy=2, dry mucous=2, sunken eyes=3, skin turgor=3)",
          },
          {
            symbol: "RiskScore",
            description:
              "Overall dehydration risk score combining weight loss percentage and symptom severity",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 kg dog normally weighs 20 kg but currently weighs 18 kg. The owner observes increased thirst, dry mucous membranes, and sunken eyes.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Calculate weight loss percentage: ((20 - 18) / 20) × 100 = 10%",
          },
          {
            label: "Step 2",
            explanation:
              "Assign symptom points: thirst (1) + dry mucous (2) + sunken eyes (3) = 6 points",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate total risk score: 10 + 6 = 16, indicating high dehydration risk",
          },
        ],
        result:
          "The dog is at high risk of dehydration and requires immediate veterinary attention.",
      }}
      relatedCalculators={[
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Dog Weight Loss Planner",
          url: "/pets/dog-weight-loss-planner",
          icon: "🐶",
        },
        {
          title: "Dog Ideal Weight & Target Calories Calculator",
          url: "/pets/dog-ideal-weight-target-calories",
          icon: "🐶",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Dog Protein/Fat Intake Guide (by Goal)",
          url: "/pets/dog-protein-fat-intake-guide",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Dehydration Risk Estimator (Weight & Symptoms Aware)",
        },
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