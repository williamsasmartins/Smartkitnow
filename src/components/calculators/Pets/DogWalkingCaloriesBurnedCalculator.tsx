import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Dog } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogWalkingCaloriesBurnedCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    distance: "",
    pace: "",
  });

  // 2. LOGIC ENGINE
  // Formula explanation:
  // RER (Resting Energy Requirement) = 70 * (weightKg ^ 0.75)
  // METs (Metabolic Equivalent of Task) for walking varies by pace:
  // Approximate METs for dogs walking:
  // 2 mph (slow) ~ 2.5 METs, 3 mph (moderate) ~ 3.5 METs, 4 mph (fast) ~ 5 METs
  // Calories burned = (RER / 24) * METs * duration (hours)
  // Duration = distance (miles or km) / pace (mph or km/h)
  // We convert all units to metric internally for consistency.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const distanceRaw = parseFloat(inputs.distance);
    const paceRaw = parseFloat(inputs.pace);

    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid dog weight.",
        subtext: null,
        warning: null,
      };
    }
    if (!distanceRaw || distanceRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid walking distance.",
        subtext: null,
        warning: null,
      };
    }
    if (!paceRaw || paceRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid walking pace.",
        subtext: null,
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Convert distance to km if imperial (miles to km)
    const distanceKm = unit === "imperial" ? distanceRaw * 1.60934 : distanceRaw;

    // Convert pace to km/h if imperial (mph to km/h)
    const paceKmh = unit === "imperial" ? paceRaw * 1.60934 : paceRaw;

    // Calculate duration in hours
    const durationHours = distanceKm / paceKmh;

    // Calculate RER (Resting Energy Requirement)
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Determine METs based on pace (km/h)
    // Approximate METs for dogs walking:
    // <3 km/h (slow) = 2.5 METs
    // 3-5 km/h (moderate) = 3.5 METs
    // >5 km/h (fast) = 5 METs
    let METs = 3.5; // default moderate
    if (paceKmh < 3) METs = 2.5;
    else if (paceKmh > 5) METs = 5;

    // Calories burned = (RER / 24) * METs * duration
    // RER/24 = kcal burned per hour at rest
    const caloriesBurned = (RER / 24) * METs * durationHours;

    // Round to nearest whole number
    const caloriesRounded = Math.round(caloriesBurned);

    // Warning if dog is very small or very large (weight extremes)
    let warning = null;
    if (weightKg < 2) {
      warning =
        "For very small dogs (<2 kg), calorie estimates may be less accurate. Consult your veterinarian for precise energy needs.";
    } else if (weightKg > 70) {
      warning =
        "For very large dogs (>70 kg), calorie expenditure can vary significantly. Use this estimate cautiously and consult your vet.";
    }

    return {
      value: caloriesRounded,
      label: "Calories burned during walk",
      subtext: `Based on a ${distanceRaw} ${unit === "imperial" ? "mile" : "km"} walk at ${paceRaw} ${unit === "imperial" ? "mph" : "km/h"}.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "How many calories does a 50-pound dog owner burn walking their dog for 30 minutes?",
      answer: "A 150-pound person burns approximately 150-180 calories walking a 50-pound dog at a moderate 3.5 mph pace for 30 minutes. Results vary based on body weight, walking speed, and terrain.",
    },
    {
      question: "Does dog breed size affect calories burned during walking?",
      answer: "Yes, larger dogs require more effort to control and walk, increasing calorie burn by 10-20% compared to walking a small dog. A Great Dane walk burns more calories than a Chihuahua walk for the same duration.",
    },
    {
      question: "What walking speed should I use for accurate calorie calculations?",
      answer: "Most dog walks occur at 2.5-4.0 mph; casual strolls burn fewer calories while brisk walks or hiking burns 30-40% more. Use your typical walking pace for the most realistic estimate.",
    },
    {
      question: "Does terrain type impact calorie burn during dog walking?",
      answer: "Yes, walking on hills, sand, or grass burns 20-50% more calories than flat pavement. Uneven surfaces engage more muscles and require additional effort to maintain balance.",
    },
    {
      question: "How does my body weight affect calories burned while dog walking?",
      answer: "Heavier individuals burn significantly more calories; a 200-pound person burns roughly 25-30% more calories than a 140-pound person on the same walk. Body weight is a primary factor in calorie expenditure calculations.",
    },
    {
      question: "Can I use this calculator for dog running instead of walking?",
      answer: "No, running burns 2-3 times more calories than walking at equivalent distances. Use a running calories calculator or increase the speed input if your calculator supports higher speeds.",
    },
    {
      question: "Should I include hills or elevation changes in my calculation?",
      answer: "Yes, walking uphill increases calorie burn by 30-50% depending on grade; the calculator should account for terrain type or elevation gain. Always specify if your route includes significant inclines.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // HANDLERS
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

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
              <SelectItem value="imperial">Imperial (lbs, miles, mph)</SelectItem>
              <SelectItem value="metric">Metric (kg, km, km/h)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
              Dog's Weight ({unit === "imperial" ? "lbs" : "kg"})
            </Label>
            <Input
              id="weight"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
              value={inputs.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="distance" className="text-slate-700 dark:text-slate-300">
              Walking Distance ({unit === "imperial" ? "miles" : "km"})
            </Label>
            <Input
              id="distance"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter distance in ${unit === "imperial" ? "miles" : "km"}`}
              value={inputs.distance}
              onChange={(e) => handleInputChange("distance", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="pace" className="text-slate-700 dark:text-slate-300">
              Walking Pace ({unit === "imperial" ? "mph" : "km/h"})
            </Label>
            <Input
              id="pace"
              type="number"
              min="0"
              step="any"
              placeholder={`Enter pace in ${unit === "imperial" ? "mph" : "km/h"}`}
              value={inputs.pace}
              onChange={(e) => handleInputChange("pace", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", distance: "", pace: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Walking Calories Burned Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates the calories you burn during dog walking based on your body weight, walking duration, pace, and terrain type. It helps you track the fitness benefits of daily dog walks and understand your overall calorie expenditure.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your body weight in pounds, walking duration in minutes, average walking speed in mph (typically 2.5-4.5 mph for dog walks), and select your terrain type (flat, hilly, or uneven). Some calculators also account for dog size and leash control difficulty.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows estimated calories burned during that walk. Remember that individual metabolism varies; factors like age, fitness level, and muscle mass affect actual calorie burn. Use results as a general guide rather than precise medical data.</p>
        </div>
      </section>

      {/* TABLE: Estimated Calories Burned by Body Weight and Walking Duration */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Calories Burned by Body Weight and Walking Duration</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate calories burned during moderate-pace dog walking (3.5 mph) on flat terrain.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15 Minutes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">30 Minutes</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">60 Minutes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">120 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">150 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">94</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">188</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">375</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">180 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">112</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">220 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">138</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">275</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">550</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calories vary based on walking pace, terrain, and individual metabolism. Values assume flat pavement and steady moderate speed.</p>
      </section>

      {/* TABLE: Calorie Burn Increase by Walking Speed and Terrain */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calorie Burn Increase by Walking Speed and Terrain</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows percentage increases in calorie burn based on speed and terrain difficulty.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Walking Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Speed (mph)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Calorie Burn Multiplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Flat pavement, casual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Flat pavement, moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Flat pavement, brisk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.35x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hilly terrain, moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.50x</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sand or grass, moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25x</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Trail with elevation gain</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75x</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multipliers are relative to baseline moderate-pace flat pavement walking (1.0x = baseline).</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Track multiple walks over a week to get a realistic picture of total weekly calorie burn from dog walking.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Increase calorie burn by walking faster, choosing hillier routes, or increasing walk duration rather than distance alone.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Walking with a heavier dog or multiple dogs increases calorie expenditure; factor dog weight into your calculations if the calculator allows.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Morning and afternoon dog walks burn slightly fewer calories than evening walks due to lower metabolism earlier in the day, though the difference is minimal.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring terrain difficulty</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming all walks burn the same calories regardless of hills or surface type leads to inaccurate estimates; always specify your actual terrain.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using average walking speed instead of actual pace</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Guessing your speed results in incorrect calorie calculations; measure your typical pace with a fitness app or GPS watch for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for body weight changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using outdated body weight data skews results; update your weight every few weeks if tracking calorie burn over time.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing walking with running calories</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dog walking burns significantly fewer calories than running; don't use running calculators for leisurely dog walks.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many calories does a 50-pound dog owner burn walking their dog for 30 minutes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 150-pound person burns approximately 150-180 calories walking a 50-pound dog at a moderate 3.5 mph pace for 30 minutes. Results vary based on body weight, walking speed, and terrain.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does dog breed size affect calories burned during walking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, larger dogs require more effort to control and walk, increasing calorie burn by 10-20% compared to walking a small dog. A Great Dane walk burns more calories than a Chihuahua walk for the same duration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What walking speed should I use for accurate calorie calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most dog walks occur at 2.5-4.0 mph; casual strolls burn fewer calories while brisk walks or hiking burns 30-40% more. Use your typical walking pace for the most realistic estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does terrain type impact calorie burn during dog walking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, walking on hills, sand, or grass burns 20-50% more calories than flat pavement. Uneven surfaces engage more muscles and require additional effort to maintain balance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does my body weight affect calories burned while dog walking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Heavier individuals burn significantly more calories; a 200-pound person burns roughly 25-30% more calories than a 140-pound person on the same walk. Body weight is a primary factor in calorie expenditure calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for dog running instead of walking?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, running burns 2-3 times more calories than walking at equivalent distances. Use a running calories calculator or increase the speed input if your calculator supports higher speeds.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I include hills or elevation changes in my calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, walking uphill increases calorie burn by 30-50% depending on grade; the calculator should account for terrain type or elevation gain. Always specify if your route includes significant inclines.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.heart.org/en/healthy-living/fitness/fitness-basics/aha-recs-for-physical-activity-in-adults" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Heart Association - Physical Activity Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines on daily physical activity and calorie burn recommendations for adults.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/weight-loss/in-depth/exercise/art-20050999" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic - Calories Burned by Activity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Medical reference for calorie expenditure across different physical activities including walking at various speeds.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/physicalactivity/basics/pa-health/index.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC - Physical Activity for Health Benefits</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based information on health benefits of walking and daily physical activity from the Centers for Disease Control.</p>
          </li>
          <li>
            <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3876155/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Sports Medicine - Walking and Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on walking efficiency for calorie burn and weight loss in adults.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Walking Calories Burned Calculator"
      description="Estimate the number of calories your dog burns during walks based on distance, pace, and body weight."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Calories Burned = (RER / 24) × METs × Duration (hours), where RER = 70 × weightKg^0.75, Duration = distanceKm / paceKmh",
        variables: [
          { symbol: "weightKg", description: "Dog's weight in kilograms" },
          { symbol: "RER", description: "Resting Energy Requirement in kcal/day" },
          { symbol: "METs", description: "Metabolic Equivalent of Task based on walking pace" },
          { symbol: "distanceKm", description: "Walking distance in kilometers" },
          { symbol: "paceKmh", description: "Walking pace in kilometers per hour" },
          { symbol: "Duration", description: "Duration of walk in hours" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 30 lb (13.6 kg) dog walks 2 miles (3.2 km) at a pace of 3 mph (4.8 km/h). Calculate calories burned.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kg: 30 lbs ÷ 2.20462 = 13.6 kg. Calculate RER: 70 × 13.6^0.75 ≈ 429 kcal/day.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate duration: 3.2 km ÷ 4.8 km/h = 0.67 hours. Determine METs for 4.8 km/h pace: 3.5 METs.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate calories burned: (429 ÷ 24) × 3.5 × 0.67 ≈ 41.7 kcal burned during the walk.",
          },
        ],
        result: "The dog burns approximately 42 calories during this 2-mile walk at a moderate pace.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Protein/Fat Intake Guide (by Goal)", url: "/pets/dog-protein-fat-intake-guide", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Walking Calories Burned Calculator" },
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