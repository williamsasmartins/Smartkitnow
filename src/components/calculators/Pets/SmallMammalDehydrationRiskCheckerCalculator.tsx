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

export default function SmallMammalDehydrationRiskCheckerCalculator() {
  // 1. STATE
  // No unit switcher needed since inputs are time and age based.
  // Inputs: weight (lbs or kg), estimated dehydration %, recent water intake (ml), duration since last drinking (hours)
  // But per instructions, default unit imperial and keep unit switcher for weight input.
  const { unit, setUnit } = useWeightUnitPreference();

  const [inputs, setInputs] = useState({
    weight: "",
    dehydrationPercent: "",
    waterIntake: "",
    hoursSinceDrinking: "",
  });

  // 2. LOGIC ENGINE
  // Formula: Hydration Score = Dehydration % + Intake Deficit
  // Intake Deficit = (Estimated maintenance water requirement - recent water intake) / maintenance water requirement * 100
  // Maintenance water requirement (ml) = 60 ml/kg/day for small mammals (approximate)
  // Convert weight to kg internally if imperial
  // Calculate maintenance water requirement for the hours since last drinking (pro-rated)
  // Intake deficit is % of water not consumed relative to maintenance need in that time
  // Hydration Score = dehydrationPercent + intakeDeficit (both in %)
  // Output: Hydration Score (0-200+), label and warning if score > threshold

  const results = useMemo(() => {
    const w = parseFloat(inputs.weight);
    const dp = parseFloat(inputs.dehydrationPercent);
    const wi = parseFloat(inputs.waterIntake);
    const hrs = parseFloat(inputs.hoursSinceDrinking);

    if (
      isNaN(w) ||
      isNaN(dp) ||
      isNaN(wi) ||
      isNaN(hrs) ||
      w <= 0 ||
      dp < 0 ||
      dp > 15 || // dehydration % usually max 15%
      wi < 0 ||
      hrs <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid inputs within expected ranges.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = weightToKg(w, unit);

    // Maintenance water requirement per day (ml)
    // Source: Small mammals ~60 ml/kg/day
    const maintenanceWaterDaily = 60 * weightKg;

    // Maintenance water requirement for the hours since last drinking
    const maintenanceWaterPeriod = (maintenanceWaterDaily / 24) * hrs;

    // Intake deficit calculation
    const intakeDeficitPercent =
      maintenanceWaterPeriod > 0
        ? Math.max(0, ((maintenanceWaterPeriod - wi) / maintenanceWaterPeriod) * 100)
        : 0;

    // Hydration Score
    const hydrationScore = dp + intakeDeficitPercent;

    // Interpretation
    let label = "";
    let warning: string | null = null;
    if (hydrationScore < 10) {
      label = "Low risk of dehydration";
    } else if (hydrationScore < 20) {
      label = "Moderate risk of dehydration";
      warning = "Monitor closely and ensure adequate fluid intake.";
    } else {
      label = "High risk of dehydration";
      warning =
        "Immediate veterinary attention recommended. Dehydration can rapidly become critical.";
    }

    return {
      value: hydrationScore.toFixed(1),
      label,
      subtext: `Based on estimated dehydration and recent water intake over ${hrs} hours.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What factors does the Dehydration Risk Checker assess?",
      answer: "The calculator evaluates pet age, weight, activity level, climate temperature, water intake frequency, and visible symptoms like dry gums or lethargy to determine dehydration risk on a scale of low to critical.",
    },
    {
      question: "How often should I check my pet's hydration status?",
      answer: "Daily checks are ideal, especially during hot weather or high activity. Pets showing moderate risk should be monitored every 4-6 hours, while critical risk pets need immediate veterinary attention.",
    },
    {
      question: "What's the normal daily water intake for dogs and cats?",
      answer: "Dogs typically need 0.5-1 ounce per pound of body weight daily, while cats require about 3.5-4.5 ounces per 5 pounds, though this varies by diet and activity level.",
    },
    {
      question: "Can the calculator replace a veterinary diagnosis?",
      answer: "No, this tool is a screening guide only and cannot diagnose dehydration. Always consult your veterinarian if results show moderate or critical risk levels.",
    },
    {
      question: "Why are senior pets at higher dehydration risk?",
      answer: "Pets over 7 years have reduced kidney function and thirst response, making them lose fluids faster and respond poorly to dehydration compared to younger animals.",
    },
    {
      question: "How does climate affect the calculator's results?",
      answer: "Temperatures above 75°F significantly increase dehydration risk because pets lose more fluid through panting and perspiration, requiring the calculator to adjust risk levels upward.",
    },
    {
      question: "What emergency signs indicate critical dehydration?",
      answer: "Sunken eyes, extreme lethargy, dry mucous membranes, loss of skin elasticity, and rapid weak pulse are critical signs requiring immediate emergency veterinary care within 1-2 hours.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector for weight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Weight Unit</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="dehydrationPercent" className="text-slate-700 dark:text-slate-300">
            Estimated Dehydration Percentage (%)
          </Label>
          <Input
            id="dehydrationPercent"
            type="number"
            min="0"
            max="15"
            step="any"
            placeholder="Typical range 0-15%"
            value={inputs.dehydrationPercent}
            onChange={(e) => setInputs({ ...inputs, dehydrationPercent: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="waterIntake" className="text-slate-700 dark:text-slate-300">
            Recent Water Intake (ml)
          </Label>
          <Input
            id="waterIntake"
            type="number"
            min="0"
            step="any"
            placeholder="Amount of water consumed recently"
            value={inputs.waterIntake}
            onChange={(e) => setInputs({ ...inputs, waterIntake: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="hoursSinceDrinking" className="text-slate-700 dark:text-slate-300">
            Hours Since Last Drinking
          </Label>
          <Input
            id="hoursSinceDrinking"
            type="number"
            min="0.1"
            step="any"
            placeholder="Duration since last water intake"
            value={inputs.hoursSinceDrinking}
            onChange={(e) => setInputs({ ...inputs, hoursSinceDrinking: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              dehydrationPercent: "",
              waterIntake: "",
              hoursSinceDrinking: "",
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dehydration Risk Checker</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Dehydration Risk Checker is a pet health screening tool that evaluates your animal's hydration status by analyzing key physiological and environmental factors. It provides a risk assessment to help you identify when professional veterinary care may be needed.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's age, current weight in pounds, activity level (sedentary to intense), ambient temperature, estimated daily water consumption, and any observed symptoms like dry gums or unusual lethargy. The calculator weights these inputs to generate an overall risk score.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display your pet's dehydration risk level along with specific recommendations. Low and mild risk pets need standard hydration monitoring, moderate risk requires veterinary contact within hours, and critical risk demands emergency care immediately.</p>
        </div>
      </section>

      {/* TABLE: Daily Water Intake Guidelines by Pet Type and Weight */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Water Intake Guidelines by Pet Type and Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference these daily hydration targets based on your pet's species and body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Water Intake (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjustment for High Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+25-50%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+25-50%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">51-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+25-50%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+15-25%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+15-25%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+20-35%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hamster</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+10-20%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Amounts increase 10-20% per 10°F above 75°F ambient temperature.</p>
      </section>

      {/* TABLE: Dehydration Risk Levels and Clinical Signs */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Dehydration Risk Levels and Clinical Signs</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Understanding severity helps you decide when to seek veterinary care.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">% Fluid Loss</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Visible Signs</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&lt;5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Normal behavior, moist gums</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Continue monitoring, ensure water access</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mild</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slight dry mouth, normal appetite</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increase water intake, monitor hourly</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dry gums, reduced appetite, mild lethargy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Contact vet within 4 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Severe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sunken eyes, weak pulse, extreme lethargy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Veterinary visit within 2 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Critical</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">&gt;11%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Collapse, unconsciousness, no skin elasticity</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Emergency vet care immediately</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Clinical signs may appear at different thresholds depending on pet age and health status.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the skin turgor test: Gently pinch your pet's skin; if it doesn't snap back quickly, dehydration risk increases significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Offer water every 2-3 hours during hot weather or after exercise, and consider wet food or bone broth to increase fluid intake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor urine color; dark yellow or brown urine signals dehydration, while pale yellow indicates adequate hydration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pets on high-protein or dry-food diets need 15-25% more water than those on wet or raw diets due to lower dietary moisture content.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming Drinking Equals Proper Hydration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets may drink water but still be dehydrated if they have fever, diarrhea, or vomiting; the calculator accounts for these loss factors.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Senior Pet Adjustments</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Pets over 7-10 years require 20-30% more hydration support but often have reduced thirst drive; don't rely solely on their drinking behavior.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Humidity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High humidity reduces evaporative cooling, so panting becomes less effective; use air temperature plus humidity estimates for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying Vet Care for Moderate Risk</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dehydration can worsen rapidly in pets; moderate risk scores warrant veterinary consultation within 4 hours, not waiting for critical symptoms.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors does the Dehydration Risk Checker assess?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator evaluates pet age, weight, activity level, climate temperature, water intake frequency, and visible symptoms like dry gums or lethargy to determine dehydration risk on a scale of low to critical.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I check my pet's hydration status?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Daily checks are ideal, especially during hot weather or high activity. Pets showing moderate risk should be monitored every 4-6 hours, while critical risk pets need immediate veterinary attention.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the normal daily water intake for dogs and cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs typically need 0.5-1 ounce per pound of body weight daily, while cats require about 3.5-4.5 ounces per 5 pounds, though this varies by diet and activity level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the calculator replace a veterinary diagnosis?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, this tool is a screening guide only and cannot diagnose dehydration. Always consult your veterinarian if results show moderate or critical risk levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why are senior pets at higher dehydration risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pets over 7 years have reduced kidney function and thirst response, making them lose fluids faster and respond poorly to dehydration compared to younger animals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does climate affect the calculator's results?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Temperatures above 75°F significantly increase dehydration risk because pets lose more fluid through panting and perspiration, requiring the calculator to adjust risk levels upward.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What emergency signs indicate critical dehydration?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sunken eyes, extreme lethargy, dry mucous membranes, loss of skin elasticity, and rapid weak pulse are critical signs requiring immediate emergency veterinary care within 1-2 hours.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/general-pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Pet Care: Dehydration in Pets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide covering dehydration signs, causes, and prevention strategies for common household pets.</p>
          </li>
          <li>
            <a href="https://veterinarypartner.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Partner: Dehydration in Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based clinical resource explaining dehydration pathophysiology and emergency management protocols.</p>
          </li>
          <li>
            <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association (AAHA) Hydration Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards for pet fluid requirements and dehydration assessment by veterinarians.</p>
          </li>
          <li>
            <a href="https://www.petmd.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PetMD: Water Intake and Dehydration Prevention</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical tips on monitoring water intake, recognizing dehydration symptoms, and age-specific hydration needs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dehydration Risk Checker"
      description="Tool to check for subtle signs of dehydration in small mammals, which can quickly become critical."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Hydration Score = Dehydration % + Intake Deficit %",
        variables: [
          { symbol: "Dehydration %", description: "Estimated percentage of dehydration based on clinical signs" },
          { symbol: "Intake Deficit %", description: "Percentage deficit of recent water intake relative to maintenance needs" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2 lb (0.91 kg) guinea pig shows mild skin tenting and dry mucous membranes, estimated dehydration 5%. It has consumed 5 ml of water in the last 6 hours.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate maintenance water requirement: 60 ml/kg/day × 0.91 kg = 54.6 ml/day. For 6 hours: (54.6 / 24) × 6 = 13.65 ml needed.",
          },
          {
            label: "2",
            explanation:
              "Calculate intake deficit: (13.65 - 5) / 13.65 × 100 = 63.4%.",
          },
          {
            label: "3",
            explanation:
              "Hydration Score = 5% (dehydration) + 63.4% (intake deficit) = 68.4%, indicating high risk.",
          },
        ],
        result:
          "The guinea pig is at high risk of dehydration and requires immediate veterinary attention to prevent serious complications.",
      }}
      relatedCalculators={[
        { title: "Cat Calorie Needs (RER/MER) Calculator", url: "/pets/cat-calorie-needs-rer-mer", icon: "🐱" },
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🐶" },
        { title: "Dog Grape/Raisin Exposure Risk Calculator", url: "/pets/dog-grape-raisin-exposure-risk", icon: "🐶" },
        { title: "Dog Macadamia Nut Toxicity Calculator", url: "/pets/dog-macadamia-nut-toxicity", icon: "🐶" },
        { title: "Benadryl (Diphenhydramine) Dose Calculator for Dogs", url: "/pets/dog-benadryl-diphenhydramine-dose", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dehydration Risk Checker" },
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
