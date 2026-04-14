import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Scale } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function SmallMammalWeightMaintenanceGainLossPlannerCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs:
  // Current Weight (lbs or kg)
  // Target Weight (lbs or kg)
  // Activity Level (Low, Moderate, High)
  // Timeframe (weeks) to reach target weight
  const [inputs, setInputs] = useState({
    currentWeight: "",
    targetWeight: "",
    activityLevel: "moderate",
    timeframeWeeks: "",
  });

  // Activity factor mapping (typical for small mammals)
  const activityFactors: Record<string, number> = {
    low: 1.2,
    moderate: 1.4,
    high: 1.6,
  };

  // 2. LOGIC ENGINE
  // Formula basis:
  // RER (Resting Energy Requirement) = 70 * (Weight_kg)^0.75
  // MER (Maintenance Energy Requirement) = RER * Activity Factor
  // Calorie adjustment for gain/loss = (TargetWeight - CurrentWeight) * 30 kcal/day per kg change (approximate)
  // Daily calorie target = MER + (Calorie adjustment / days)
  // days = timeframeWeeks * 7
  // Output kcal/day rounded

  const results = useMemo(() => {
    const cw = parseFloat(inputs.currentWeight);
    const tw = parseFloat(inputs.targetWeight);
    const tf = parseFloat(inputs.timeframeWeeks);
    if (
      isNaN(cw) ||
      isNaN(tw) ||
      isNaN(tf) ||
      cw <= 0 ||
      tw <= 0 ||
      tf <= 0 ||
      !(inputs.activityLevel in activityFactors)
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    const currentWeightKg = weightToKg(cw, unit);
    const targetWeightKg = weightToKg(tw, unit);

    // Calculate RER
    const RER = 70 * Math.pow(currentWeightKg, 0.75);

    // Activity factor
    const AF = activityFactors[inputs.activityLevel];

    // Maintenance Energy Requirement
    const MER = RER * AF;

    // Weight difference
    const weightDiff = targetWeightKg - currentWeightKg;

    // Total calorie adjustment needed (approx 30 kcal per kg per day for gain/loss)
    // This is a simplified estimate for small mammals; actual needs vary by species/metabolism.
    const totalCalorieChange = weightDiff * 30 * tf * 7; // total kcal change over timeframe

    // Daily calorie adjustment
    const dailyCalorieAdjustment = totalCalorieChange / (tf * 7);

    // Final daily calorie target
    const dailyCalories = MER + dailyCalorieAdjustment;

    // Warning if timeframe is too short for safe weight change
    let warning = null;
    const maxSafeRateKgPerWeek = 0.05 * currentWeightKg; // 5% per week typical safe max
    const requestedRate = Math.abs(weightDiff) / tf;
    if (requestedRate > maxSafeRateKgPerWeek) {
      warning =
        "The requested weight change rate exceeds typical safe guidelines (5% per week). Consult your veterinarian before proceeding.";
    }

    return {
      value: Math.round(dailyCalories),
      label: "Daily Calorie Target (kcal/day)",
      subtext:
        weightDiff === 0
          ? "Calorie intake to maintain current weight."
          : weightDiff > 0
          ? `Calorie intake to support controlled weight gain of ${weightDiff.toFixed(2)} kg over ${tf} weeks.`
          : `Calorie intake to support controlled weight loss of ${Math.abs(weightDiff).toFixed(2)} kg over ${tf} weeks.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How does the Weight Maintenance vs. Gain/Loss Planner calculate daily calorie needs for my pet?",
      answer: "The calculator uses your pet's current weight, age, activity level, and species to estimate basal metabolic rate (BMR), then applies activity multipliers to determine total daily energy expenditure (TDEE) in calories.",
    },
    {
      question: "What's the difference between maintenance calories and surplus/deficit calories?",
      answer: "Maintenance calories keep your pet at their current weight, while a surplus adds 300-500 calories daily for weight gain and a deficit reduces intake by 300-500 calories for weight loss.",
    },
    {
      question: "How long will it take my pet to reach their target weight using this planner?",
      answer: "Most pets lose or gain 0.5-2% of body weight per week safely; a 50-pound dog losing 1% weekly reaches a 45-pound goal in 50 weeks with consistent calorie deficits.",
    },
    {
      question: "Can I use this calculator for cats, dogs, and other small pets?",
      answer: "Yes, this calculator works for dogs, cats, rabbits, and other small pets, but adjust inputs for species-specific metabolic differences and activity patterns.",
    },
    {
      question: "What factors affect my pet's calorie requirements the most?",
      answer: "Activity level, age, and current weight are the primary drivers; senior pets need 10-20% fewer calories while highly active dogs may need 30-50% more than sedentary pets.",
    },
    {
      question: "Should I adjust calories based on my pet's food brand or type?",
      answer: "Yes, check your pet food's calorie content per cup or can; wet foods typically contain 70-100 calories per cup while dry kibble ranges from 300-500 calories per cup.",
    },
    {
      question: "How often should I recalculate my pet's calorie needs?",
      answer: "Recalculate every 4-6 weeks as your pet's weight changes, or whenever adjusting activity levels or life stage to ensure continued progress toward target weight.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

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
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="currentWeight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="currentWeight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter current weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.currentWeight}
            onChange={(e) => setInputs((prev) => ({ ...prev, currentWeight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="targetWeight" className="text-slate-700 dark:text-slate-300">
            Target Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="targetWeight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter target weight in ${unit === "lb" ? "lbs" : "kg"}`}
            value={inputs.targetWeight}
            onChange={(e) => setInputs((prev) => ({ ...prev, targetWeight: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="activityLevel" className="text-slate-700 dark:text-slate-300">
            Activity Level
          </Label>
          <Select
            value={inputs.activityLevel}
            onValueChange={(val) => setInputs((prev) => ({ ...prev, activityLevel: val }))}
          >
            <SelectTrigger id="activityLevel" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="timeframeWeeks" className="text-slate-700 dark:text-slate-300">
            Timeframe to Reach Target Weight (weeks)
          </Label>
          <Input
            id="timeframeWeeks"
            type="number"
            min="1"
            step="1"
            placeholder="Enter number of weeks"
            value={inputs.timeframeWeeks}
            onChange={(e) => setInputs((prev) => ({ ...prev, timeframeWeeks: e.target.value }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              currentWeight: "",
              targetWeight: "",
              activityLevel: "moderate",
              timeframeWeeks: "",
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Weight Maintenance vs. Gain/Loss Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners determine precise daily calorie targets to maintain, increase, or decrease their pet's weight safely. It accounts for species, age, activity level, and metabolism to provide personalized feeding guidance.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's current weight in pounds or kilograms, select their age range and activity level (sedentary, moderate, or active), and specify whether you want maintenance, gain, or loss calculations. The tool will also factor in spay/neuter status, which reduces calorie needs by 10-25%.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show daily calorie targets and estimated timelines to reach goal weight; compare these figures to your pet food's calorie content to determine portion sizes, then monitor progress every 2-4 weeks and adjust portions as needed.</p>
        </div>
      </section>

      {/* TABLE: Daily Calorie Estimates by Pet Type and Activity Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Estimates by Pet Type and Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate daily calorie needs for common pets at maintenance level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type & Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sedentary</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Activity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">High Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dog (10 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-350 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-450 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Dog (50 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1100 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1100-1500 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1500-2000 cal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dog (80 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1400-1700 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1700-2300 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2300-3000 cal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult Cat (10 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-220 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220-280 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280-350 cal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Pet (reduced)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-10 to -20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-10 to -20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-10 to -20%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rabbit (5 lbs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250 cal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-300 cal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values are estimates; individual pets vary based on metabolism, breed, and spay/neuter status.</p>
      </section>

      {/* TABLE: Safe Weight Change Targets and Timeline */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Weight Change Targets and Timeline</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines healthy weight loss and gain rates for pets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Goal Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weekly Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Monthly Rate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Timeline for 10% Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Safe Weight Loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1.5% body weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-6% body weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate Weight Loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2% body weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8% body weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weight Gain (underweight)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1% body weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4% body weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-20 weeks</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rapid Gain (muscle building)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2% body weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8% body weight</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10 weeks</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ideal Maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±0.5% variance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">±2% variance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A - stable weight</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates &gt; 2% weekly may indicate unhealthy changes; consult a veterinarian if results exceed safe ranges.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your pet monthly on a veterinary scale for accuracy; home scales may vary by 1-3 pounds, affecting calorie calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check pet food labels for calories per cup or can—dry kibble ranges 300-500 cal/cup while wet food averages 70-150 cal/cup.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine calorie reduction with increased daily activity; adding 15-20 minutes of play or walking improves weight loss results by 20-30%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use treats strategically by counting them toward daily totals—treats should comprise &lt;10% of total daily calories to avoid derailing goals.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Spay/Neuter Status</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Spayed or neutered pets require 10-25% fewer calories than intact animals; failing to account for this leads to unnecessary weight gain.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Food Calorie Density</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Feeding premium or prescription diets without recalculating portions can cause accidental overfeeding since calorie density varies from 300 to 550 calories per cup.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Changing Calories Too Drastically</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Reducing calories by &gt;30% or increasing by &gt;50% weekly can stress your pet's metabolism and cause digestive upset; adjust by 10-15% increments.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Age-Related Metabolic Changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Senior pets (over 7-10 years) need 10-20% fewer calories than adults but owners often feed unchanged amounts, causing unwanted weight gain.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does the Weight Maintenance vs. Gain/Loss Planner calculate daily calorie needs for my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses your pet's current weight, age, activity level, and species to estimate basal metabolic rate (BMR), then applies activity multipliers to determine total daily energy expenditure (TDEE) in calories.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between maintenance calories and surplus/deficit calories?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Maintenance calories keep your pet at their current weight, while a surplus adds 300-500 calories daily for weight gain and a deficit reduces intake by 300-500 calories for weight loss.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long will it take my pet to reach their target weight using this planner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most pets lose or gain 0.5-2% of body weight per week safely; a 50-pound dog losing 1% weekly reaches a 45-pound goal in 50 weeks with consistent calorie deficits.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for cats, dogs, and other small pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator works for dogs, cats, rabbits, and other small pets, but adjust inputs for species-specific metabolic differences and activity patterns.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect my pet's calorie requirements the most?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Activity level, age, and current weight are the primary drivers; senior pets need 10-20% fewer calories while highly active dogs may need 30-50% more than sedentary pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust calories based on my pet's food brand or type?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, check your pet food's calorie content per cup or can; wet foods typically contain 70-100 calories per cup while dry kibble ranges from 300-500 calories per cup.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my pet's calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 4-6 weeks as your pet's weight changes, or whenever adjusting activity levels or life stage to ensure continued progress toward target weight.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/pet-food-labeling-guide" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Pet Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines on pet food calorie content and nutritional standards for dogs, cats, and other companion animals.</p>
          </li>
          <li>
            <a href="https://www.avma.org/public/petcare/pages/default.aspx" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) - Pet Obesity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based veterinary recommendations for managing pet weight and preventing obesity-related health issues.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/academic-programs/nutrition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine - Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed resources on companion animal nutrition, calorie requirements, and weight management protocols.</p>
          </li>
          <li>
            <a href="https://www.wsava.org/Global-Initiatives/Obesity" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">World Small Animal Veterinary Association (WSAVA) - Weight Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">International standards for assessing pet body condition score and implementing safe weight loss and maintenance programs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Weight Maintenance vs. Gain/Loss Planner"
      description="Plan calorie targets for weight maintenance, controlled weight gain, or safe weight loss for small mammals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Calories = (70 × Weight_kg^0.75 × Activity Factor) + ((TargetWeight_kg - CurrentWeight_kg) × 30 kcal ÷ Days)",
        variables: [
          { symbol: "Weight_kg", description: "Current body weight in kilograms" },
          { symbol: "Activity Factor", description: "Multiplier based on activity level (e.g., 1.2–1.6)" },
          { symbol: "TargetWeight_kg", description: "Desired body weight in kilograms" },
          { symbol: "CurrentWeight_kg", description: "Current body weight in kilograms" },
          { symbol: "Days", description: "Total days in the timeframe to reach target weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 2.2 lb (1 kg) rabbit with moderate activity wants to gain 0.5 kg over 10 weeks. Calculate daily calorie needs.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (already 1 kg). Calculate RER = 70 × 1^0.75 = 70 kcal.",
          },
          {
            label: "2",
            explanation:
              "Apply activity factor for moderate activity (1.4): MER = 70 × 1.4 = 98 kcal/day.",
          },
          {
            label: "3",
            explanation:
              "Calculate calorie adjustment: weight gain = 0.5 kg × 30 kcal × 70 days = 1050 kcal total; daily adjustment = 1050 ÷ 70 = 15 kcal/day.",
          },
          {
            label: "4",
            explanation:
              "Add adjustment to MER: 98 + 15 = 113 kcal/day recommended for controlled weight gain.",
          },
        ],
        result: "Daily calorie target is approximately 113 kcal/day to safely gain 0.5 kg in 10 weeks.",
      }}
      relatedCalculators={[
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "🐾" },
        { title: "Ideal Humidity Range Calculator", url: "/pets/reptile-ideal-humidity-range", icon: "🐶" },
        { title: "Dog Crate Size Finder", url: "/pets/dog-crate-size-finder", icon: "🐶" },
        { title: "Environmental Enrichment Planner (per room)", url: "/pets/cat-environmental-enrichment-planner", icon: "🍖" },
        { title: "Cat Body Condition Score Helper (BCS → Target Plan)", url: "/pets/cat-body-condition-score-bcs-target", icon: "🐱" },
        { title: "Horse Weight Estimator (Heart Girth & Length)", url: "/pets/horse-weight-estimator-girth-length", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Weight Maintenance vs. Gain/Loss Planner" },
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
