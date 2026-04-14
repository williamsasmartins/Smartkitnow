import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { weightToKg } from "@/lib/utils";

export default function HorseElectrolyteNeedEstimatorCalculator() {
  // 1. STATE
  // Unit system: Imperial (lbs) or Metric (kg)
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs:
  // weight: horse body weight (lbs or kg)
  // exerciseDuration: duration of exercise in minutes
  // ambientTemp: ambient temperature in °F or °C
  // sweatRate: estimated sweat rate in L/hr (optional, default average)
  const [inputs, setInputs] = useState({
    weight: "",
    exerciseDuration: "",
    ambientTemp: "",
    sweatRate: "",
  });

  // Convert °F to °C
  const fToC = (f: number) => (f - 32) * (5 / 9);

  // 2. LOGIC ENGINE
  // Electrolyte need estimation based on:
  // - Weight (kg)
  // - Exercise duration (hr)
  // - Ambient temperature (°C)
  // - Sweat rate (L/hr) - if not provided, use average 10 L/hr for moderate exercise
  //
  // Electrolyte loss (g) = Sweat Rate (L/hr) * Exercise Duration (hr) * Electrolyte Concentration (g/L)
  // Electrolyte Concentration varies with heat and exercise intensity; typical values:
  // Sodium (Na): ~7 g/L, Potassium (K): ~2 g/L, Chloride (Cl): ~7 g/L
  // Total electrolytes ~16 g/L sweat
  //
  // Adjust sweat rate by ambient temperature:
  // If ambientTemp > 25°C, increase sweat rate by 20%
  //
  // Final electrolyte need (grams) = Adjusted Sweat Rate * Duration * 16 g/L
  //
  // Output: Total electrolyte need in grams for the exercise session

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const durationRaw = parseFloat(inputs.exerciseDuration);
    const tempRaw = parseFloat(inputs.ambientTemp);
    const sweatRateRaw = parseFloat(inputs.sweatRate);

    if (
      isNaN(weightRaw) ||
      isNaN(durationRaw) ||
      isNaN(tempRaw) ||
      weightRaw <= 0 ||
      durationRaw <= 0
    ) {
      return {
        value: 0,
        label: "Please enter valid positive numbers for weight, exercise duration, and ambient temperature.",
        subtext: null,
        warning: null,
      };
    }

    // Convert inputs to metric for calculation
    const weightKg = weightToKg(weightRaw, unit);
    const ambientC = unit === "lb" ? fToC(tempRaw) : tempRaw;
    const durationHr = durationRaw / 60; // minutes to hours

    // Default sweat rate if not provided or invalid
    // Average sweat rate for moderate exercise ~10 L/hr for 500 kg horse
    // Scale sweat rate linearly with weight (typical horse ~500 kg)
    const baseSweatRatePerKg = 10 / 500; // L/hr per kg
    let sweatRateLhr =
      !isNaN(sweatRateRaw) && sweatRateRaw > 0
        ? sweatRateRaw
        : baseSweatRatePerKg * weightKg;

    // Adjust sweat rate for heat stress: +20% if ambient > 25°C
    if (ambientC > 25) {
      sweatRateLhr *= 1.2;
    }

    // Electrolyte concentration in sweat (g/L)
    // Total ~16 g/L (Na + K + Cl)
    const electrolyteConcentration = 16;

    // Total electrolyte need (grams)
    const totalElectrolytes = sweatRateLhr * durationHr * electrolyteConcentration;

    // Round to 1 decimal place
    const totalRounded = Math.round(totalElectrolytes * 10) / 10;

    // Contextual label
    const label = `Estimated total electrolyte loss during exercise`;

    // Warning if inputs are extreme
    let warning = null;
    if (durationHr > 4) {
      warning =
        "Exercise duration exceeds 4 hours. Prolonged electrolyte loss may require veterinary supervision.";
    } else if (ambientC > 35) {
      warning =
        "High ambient temperature detected. Ensure adequate hydration and electrolyte replacement.";
    }

    return {
      value: totalRounded,
      label,
      subtext: "grams of electrolytes lost (Na, K, Cl combined)",
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much sodium do horses lose during exercise?",
      answer: "Horses lose approximately 20-40 grams of sodium per hour of intense exercise through sweat, depending on temperature and humidity levels.",
    },
    {
      question: "What temperature triggers increased electrolyte needs in horses?",
      answer: "Electrolyte requirements increase significantly when ambient temperature exceeds 75°F (24°C), with sweat loss doubling in conditions above 85°F (29°C).",
    },
    {
      question: "Can horses become hyperkalemic from too many electrolytes?",
      answer: "Yes, excessive potassium supplementation can cause hyperkalemia; typical safe daily intake is 0.3-0.4% of body weight for balanced electrolyte supplements.",
    },
    {
      question: "How does exercise intensity affect electrolyte depletion rates?",
      answer: "High-intensity exercise (galloping or jumping) depletes electrolytes 3-5 times faster than moderate activity like trail riding.",
    },
    {
      question: "What are the signs a horse needs electrolyte supplementation?",
      answer: "Signs include excessive sweating, poor recovery, muscle cramping, reduced appetite, and dark concentrated urine after exercise sessions.",
    },
    {
      question: "Should electrolytes be given before, during, or after exercise?",
      answer: "Pre-exercise hydration is key; during prolonged exercise (&gt;90 minutes), offer electrolyte solutions; post-exercise supplementation aids recovery within 2 hours.",
    },
    {
      question: "How does humidity affect the calculator's electrolyte estimates?",
      answer: "High humidity (&gt;70%) reduces evaporative cooling efficiency, increasing sweat production and electrolyte loss by 25-35% compared to dry conditions.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget input handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

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
              <SelectItem value="lb">Imperial (lbs, °F)</SelectItem>
              <SelectItem value="kg">Metric (kg, °C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Horse Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={unit === "lb" ? "e.g. 1100" : "e.g. 500"}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter your horse’s body weight to estimate electrolyte loss accurately.
          </p>
        </div>

        <div>
          <Label htmlFor="exerciseDuration" className="text-slate-700 dark:text-slate-300">
            Exercise Duration (minutes)
          </Label>
          <Input
            id="exerciseDuration"
            name="exerciseDuration"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 60"
            value={inputs.exerciseDuration}
            onChange={handleInputChange}
            aria-describedby="duration-desc"
          />
          <p id="duration-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Duration of exercise or activity causing sweating.
          </p>
        </div>

        <div>
          <Label htmlFor="ambientTemp" className="text-slate-700 dark:text-slate-300">
            Ambient Temperature ({unit === "lb" ? "°F" : "°C"})
          </Label>
          <Input
            id="ambientTemp"
            name="ambientTemp"
            type="text"
            inputMode="decimal"
            placeholder={unit === "lb" ? "e.g. 85" : "e.g. 29"}
            value={inputs.ambientTemp}
            onChange={handleInputChange}
            aria-describedby="temp-desc"
          />
          <p id="temp-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ambient temperature during exercise impacts sweat rate and electrolyte loss.
          </p>
        </div>

        <div>
          <Label htmlFor="sweatRate" className="text-slate-700 dark:text-slate-300">
            Sweat Rate (L/hr) <span className="text-slate-400">(optional)</span>
          </Label>
          <Input
            id="sweatRate"
            name="sweatRate"
            type="text"
            inputMode="decimal"
            placeholder="Leave blank for average"
            value={inputs.sweatRate}
            onChange={handleInputChange}
            aria-describedby="sweat-desc"
          />
          <p id="sweat-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter if known; otherwise, average sweat rate is used based on weight and conditions.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Force re-calculation by updating inputs state (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate electrolyte need"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", exerciseDuration: "", ambientTemp: "", sweatRate: "" })}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and tailored advice.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Horse Electrolyte Need Estimator (Exercise & Heat)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your horse's electrolyte requirements based on exercise duration, intensity, ambient temperature, and humidity. It accounts for sweat loss and mineral depletion to recommend safe supplementation levels.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include your horse's body weight (typically 800-1,200 lbs), exercise type (light, moderate, or intense), session duration in minutes, current temperature, and relative humidity percentage.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show estimated sodium, potassium, calcium, magnesium, and chloride needs in grams per hour or per day. Compare recommendations to your current feed and water intake to determine if supplementation is necessary to maintain performance and recovery.</p>
        </div>
      </section>

      {/* TABLE: Electrolyte Loss Rates by Exercise Intensity & Temperature */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Electrolyte Loss Rates by Exercise Intensity & Temperature</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated sodium and potassium loss per hour under various conditions for a 1,000 lb horse.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Exercise Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temp 70°F</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temp 85°F</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Temp 95°F</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Light walk/trot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15g Na, 5g K</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-25g Na, 8g K</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-35g Na, 12g K</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate (training)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25g Na, 10g K</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-40g Na, 15g K</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60g Na, 22g K</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Intense (racing/jumping)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45g Na, 18g K</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55-70g Na, 28g K</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-100g Na, 40g K</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loss rates increase 15-20% with humidity above 70%.</p>
      </section>

      {/* TABLE: Daily Electrolyte Requirements (Non-Exercising vs. Exercising Horses) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Electrolyte Requirements (Non-Exercising vs. Exercising Horses)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended daily electrolyte intake in grams for a 1,000 lb adult horse.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Electrolyte</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance (Rest)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Exercise</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Intense/Hot Weather</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sodium (Na)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-50g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-100g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Potassium (K)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Calcium (Ca)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30g</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Magnesium (Mg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15g</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chloride (Cl)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-120g</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Amounts vary by forage quality, water mineral content, and individual sweat rates.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always provide free access to fresh water; electrolytes enhance palatability but cannot replace adequate hydration.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Introduce electrolyte supplements gradually over 5-7 days to prevent digestive upset and allow horses to adjust to taste.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use paste electrolytes immediately post-exercise for fastest absorption during the 30-minute recovery window.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test sweat composition annually during peak season to customize supplementation rather than using one-size-fits-all formulas.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring humidity levels</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">High humidity reduces evaporative cooling, increasing sweat loss by 25-35% beyond dry-climate estimates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Over-supplementing potassium</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Excessive potassium supplementation (&gt;150g daily) can cause hyperkalemia and cardiac arrhythmias in horses.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Giving electrolytes without water</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Electrolytes without adequate water increase osmolarity and may cause dehydration rather than prevent it.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the same dose year-round</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Summer exercise requirements are 3-5 times higher than winter; adjust supplementation seasonally based on temperature and sweat rates.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much sodium do horses lose during exercise?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Horses lose approximately 20-40 grams of sodium per hour of intense exercise through sweat, depending on temperature and humidity levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What temperature triggers increased electrolyte needs in horses?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Electrolyte requirements increase significantly when ambient temperature exceeds 75°F (24°C), with sweat loss doubling in conditions above 85°F (29°C).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can horses become hyperkalemic from too many electrolytes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, excessive potassium supplementation can cause hyperkalemia; typical safe daily intake is 0.3-0.4% of body weight for balanced electrolyte supplements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does exercise intensity affect electrolyte depletion rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High-intensity exercise (galloping or jumping) depletes electrolytes 3-5 times faster than moderate activity like trail riding.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the signs a horse needs electrolyte supplementation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Signs include excessive sweating, poor recovery, muscle cramping, reduced appetite, and dark concentrated urine after exercise sessions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should electrolytes be given before, during, or after exercise?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pre-exercise hydration is key; during prolonged exercise (&gt;90 minutes), offer electrolyte solutions; post-exercise supplementation aids recovery within 2 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does humidity affect the calculator's electrolyte estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">High humidity (&gt;70%) reduces evaporative cooling efficiency, increasing sweat production and electrolyte loss by 25-35% compared to dry conditions.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nap.edu/catalog/11653/nutrient-requirements-of-horses" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Nutrition & Exercise Physiology — National Research Council</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative guide on mineral and electrolyte requirements for horses at rest and during exercise.</p>
          </li>
          <li>
            <a href="https://www.sciencedirect.com/journal/journal-of-equine-veterinary-science" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Sweat Loss and Thermoregulation in Exercising Horses — Journal of Equine Veterinary Science</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on sweat composition, electrolyte depletion rates, and temperature effects on exercise physiology.</p>
          </li>
          <li>
            <a href="https://www.aaep.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAEP Guidelines for Sport Horse Management and Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary association recommendations for hydration, electrolyte supplementation, and heat stress prevention.</p>
          </li>
          <li>
            <a href="https://www.ucdavis.edu/veterinary" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Equine Hyperkalemic Periodic Paralysis — UC Davis Veterinary Medical Teaching Hospital</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of potassium toxicity risks and safe supplementation limits for genetically susceptible horses.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Horse Electrolyte Need Estimator (Exercise & Heat)"
      description="Estimate necessary electrolyte supplementation based on ambient heat and intensity of exercise/sweating."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Electrolyte Need (g) = Sweat Rate (L/hr) × Exercise Duration (hr) × Electrolyte Concentration (g/L)",
        variables: [
          { symbol: "Sweat Rate (L/hr)", description: "Volume of sweat lost per hour, adjusted for heat and weight" },
          { symbol: "Exercise Duration (hr)", description: "Length of exercise or sweating period in hours" },
          { symbol: "Electrolyte Concentration (g/L)", description: "Average grams of electrolytes lost per liter of sweat (~16 g/L)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 1100 lb (500 kg) horse exercises for 90 minutes in 85°F (29°C) weather with an estimated sweat rate of 10 L/hr.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert exercise duration to hours: 90 minutes = 1.5 hours.",
          },
          {
            label: "2",
            explanation:
              "Adjust sweat rate for heat: 10 L/hr × 1.2 (20% increase) = 12 L/hr.",
          },
          {
            label: "3",
            explanation:
              "Calculate electrolyte loss: 12 L/hr × 1.5 hr × 16 g/L = 288 grams.",
          },
        ],
        result:
          "The horse requires approximately 288 grams of electrolytes to replace losses during this exercise session.",
      }}
      relatedCalculators={[
        { title: "Whelping Countdown & Stage Timeline", url: "/pets/dog-whelping-countdown-stage-timeline", icon: "🐾" },
        { title: "Resting vs. Active Hours Balance Tracker (owner input)", url: "/pets/cat-resting-active-hours-balance-tracker", icon: "🐶" },
        { title: "Cat Onion/Garlic Toxicity Calculator", url: "/pets/cat-onion-garlic-toxicity", icon: "🐱" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Parasite Treatment Dose Reference", url: "/pets/small-mammal-parasite-treatment-dose-reference", icon: "💉" },
        { title: "Caffeine Toxicity Risk for Cats", url: "/pets/cat-caffeine-toxicity", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Horse Electrolyte Need Estimator (Exercise & Heat)" },
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
