import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle, Scale } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function KoiFeedPlannerTempWeightCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight and water temperature
  const [inputs, setInputs] = useState({
    weight: "", // lbs or kg depending on unit
    temperature: "", // °F or °C depending on unit
  });

  // 2. LOGIC ENGINE
  // Feeding rate (%) of body weight per day based on temperature (°C)
  // Source feeding rates (approximate):
  // <10°C: 0% (no feeding)
  // 10-15°C: 0.2%
  // 15-20°C: 0.5%
  // 20-25°C: 1.0%
  // >25°C: 1.5%
  // Convert weight to kg internally if imperial
  // Feed amount (grams) = weight_kg * feeding_rate (%) * 10 (to convert % to decimal and kg to g)
  // 1 kg = 1000 g, so feed (g) = weight_kg * feeding_rate * 10 (because feeding_rate is %)
  // Actually: feed (g) = weight_kg * feeding_rate * 10 = weight_kg * (feeding_rate/100) * 1000
  // Simplify: feed (g) = weight_kg * feeding_rate * 10

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const tempNum = parseFloat(inputs.temperature);

    if (isNaN(weightNum) || weightNum <= 0 || isNaN(tempNum)) {
      return {
        value: 0,
        label: "Please enter valid weight and temperature",
        subtext: "",
        warning: null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightNum / 2.20462 : weightNum;

    // Convert temperature to °C if imperial (°F)
    const tempC = unit === "imperial" ? (tempNum - 32) * (5 / 9) : tempNum;

    // Determine feeding rate based on tempC
    let feedingRate = 0;
    if (tempC < 10) feedingRate = 0;
    else if (tempC >= 10 && tempC < 15) feedingRate = 0.2;
    else if (tempC >= 15 && tempC < 20) feedingRate = 0.5;
    else if (tempC >= 20 && tempC < 25) feedingRate = 1.0;
    else if (tempC >= 25) feedingRate = 1.5;

    // Calculate feed amount in grams per day
    // feed (g) = weightKg * feedingRate (%) * 10
    const feedGrams = +(weightKg * feedingRate * 10).toFixed(2);

    // Convert feed grams to ounces if imperial
    const feedOunces = +(feedGrams / 28.3495).toFixed(2);

    return {
      value: unit === "imperial" ? feedOunces : feedGrams,
      label:
        unit === "imperial"
          ? "Feed Amount (oz/day)"
          : "Feed Amount (g/day)",
      subtext: `Based on water temperature of ${tempNum}°${unit === "imperial" ? "F" : "C"} and koi weight of ${weightNum} ${unit === "imperial" ? "lbs" : "kg"}.`,
      warning:
        feedingRate === 0
          ? "Water temperature is too low for feeding. Koi metabolism slows significantly below 10°C (50°F)."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How does water temperature affect koi feeding requirements?",
      answer: "Koi metabolism slows dramatically in cold water; at 50°F they need 50-75% less food than at 75°F, while below 50°F feeding should stop entirely to prevent digestive issues.",
    },
    {
      question: "What koi weight should I use in the calculator?",
      answer: "Use the actual body weight of your koi in pounds or kilograms; weigh them annually or estimate using length charts if direct measurement isn't possible.",
    },
    {
      question: "How often should I feed based on the planner's output?",
      answer: "The calculator provides daily quantities; split this into 2-4 feedings per day during warmer months, reducing frequency as temperature drops below 60°F.",
    },
    {
      question: "Can I feed the same amount year-round?",
      answer: "No—winter feeding must decrease significantly or stop; the temperature-based planner ensures you don't overfeed in cold months, which causes bloating and disease.",
    },
    {
      question: "What happens if I overfeed my koi?",
      answer: "Excess food decays in the pond, reducing water quality and causing ammonia spikes; overweight koi also develop health problems and shortened lifespans.",
    },
    {
      question: "Should I adjust portions for different koi sizes in the same pond?",
      answer: "Yes—larger koi consume more; use the planner for each size group or average weight, then distribute accordingly during feeding sessions.",
    },
    {
      question: "Does the planner account for plant-based vs. protein-heavy diets?",
      answer: "The calculator gives quantity estimates; adjust for diet type separately—protein-rich pellets may require smaller portions than plant-based feeds.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers for inputs
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
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
              <SelectItem value="imperial">Imperial (lbs, °F)</SelectItem>
              <SelectItem value="metric">Metric (kg, °C)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Koi Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={handleInputChange}
            aria-describedby="weight-desc"
          />
        </div>
        <div>
          <Label htmlFor="temperature" className="text-slate-700 dark:text-slate-300">
            Water Temperature ({unit === "imperial" ? "°F" : "°C"})
          </Label>
          <Input
            id="temperature"
            name="temperature"
            type="text"
            inputMode="decimal"
            placeholder={`Enter temperature in ${unit === "imperial" ? "°F" : "°C"}`}
            value={inputs.temperature}
            onChange={handleInputChange}
            aria-describedby="temp-desc"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (noop here)
            setInputs((prev) => ({ ...prev }));
          }}
          aria-label="Calculate feed amount"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", temperature: "" })}
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
                Estimated Feed Amount
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and feeding advice.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Koi Feed Planner (Temp + Weight)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Koi Feed Planner calculates optimal daily food portions for your koi based on two critical variables: current water temperature and individual koi body weight. This ensures your fish receive appropriate nutrition while preventing overfeeding, which degrades water quality and harms koi health.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter the current water temperature in your pond (in °F or °C) and the total weight of your koi in pounds or kilograms. The calculator adjusts feeding rates automatically—warmer water increases metabolic needs, while cooler water dramatically reduces them.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The output shows your daily recommended food quantity in grams or ounces, plus optimal feeding frequency for that temperature range. Divide this total among 2–4 feedings throughout the day during active seasons, and reduce or eliminate feeding entirely when water drops below 50°F.</p>
        </div>
      </section>

      {/* TABLE: Koi Daily Feeding Rates by Temperature */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Koi Daily Feeding Rates by Temperature</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended daily food portions as a percentage of body weight based on water temperature.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water Temperature (°F)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water Temperature (°C)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Feeding Rate (% of Body Weight)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feeding Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75–79</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24–26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–4 times daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">70–74</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21–23</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3 times daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">60–69</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 times daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50–59</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Once daily or skip days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Below 50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Below 10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Do not feed</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates assume healthy koi in stable conditions; adjust for individual metabolism and food quality.</p>
      </section>

      {/* TABLE: Estimated Daily Feeding Amounts for Common Koi Weights */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Daily Feeding Amounts for Common Koi Weights</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Sample daily food quantities in grams at optimal feeding temperature (75°F/24°C) based on 3.5% body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Koi Body Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Koi Body Weight (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Food at 75°F (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Food at 65°F (grams)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Food at 55°F (grams)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">71</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">107</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">143</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">71</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">214</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">107</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">286</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">143</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">71</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Amounts decrease proportionally with temperature drops; use weight in pounds or kilograms in the calculator.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor water temperature daily with a reliable thermometer; even a 5°F drop changes your koi's feeding needs significantly.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your koi annually (spring is ideal) to keep calculations accurate as they grow.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use high-quality koi pellets sized to your fish's mouth; smaller koi need 2–3mm pellets, larger fish handle 4–6mm.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always feed at the same time each day to establish routine; koi learn feeding schedules and respond better to consistent timing.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring seasonal temperature changes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many pond owners use summer feeding amounts year-round, causing dangerous overfeeding in fall and winter when metabolism slows.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using estimated weight instead of actual weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Guessing koi size leads to inaccurate portions; invest in a koi scale or use water displacement methods for precise measurements.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Feeding multiple times without reducing total daily amount</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Increasing frequency doesn't justify larger portions—total daily intake must match the planner's output regardless of meal count.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Continuing full feeding below 55°F</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cold-water koi cannot digest food efficiently; feeding when water is too cold causes constipation, bloating, and digestive disease.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does water temperature affect koi feeding requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Koi metabolism slows dramatically in cold water; at 50°F they need 50-75% less food than at 75°F, while below 50°F feeding should stop entirely to prevent digestive issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What koi weight should I use in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use the actual body weight of your koi in pounds or kilograms; weigh them annually or estimate using length charts if direct measurement isn't possible.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I feed based on the planner's output?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator provides daily quantities; split this into 2-4 feedings per day during warmer months, reducing frequency as temperature drops below 60°F.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I feed the same amount year-round?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No—winter feeding must decrease significantly or stop; the temperature-based planner ensures you don't overfeed in cold months, which causes bloating and disease.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I overfeed my koi?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excess food decays in the pond, reducing water quality and causing ammonia spikes; overweight koi also develop health problems and shortened lifespans.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust portions for different koi sizes in the same pond?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—larger koi consume more; use the planner for each size group or average weight, then distribute accordingly during feeding sessions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the planner account for plant-based vs. protein-heavy diets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator gives quantity estimates; adjust for diet type separately—protein-rich pellets may require smaller portions than plant-based feeds.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.koivet.com/articles/koi-nutrition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Koi Health and Nutrition Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary guidelines on koi dietary requirements and temperature-dependent feeding protocols.</p>
          </li>
          <li>
            <a href="https://www.extension.org/pages/28062/pond-fish-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pond Water Temperature and Fish Metabolism</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">University extension resource explaining how water temperature affects fish feeding and digestion rates.</p>
          </li>
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/koi-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Best Practices for Koi Pond Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide covering seasonal feeding schedules and water quality maintenance for koi ponds.</p>
          </li>
          <li>
            <a href="https://www.fisheries.noaa.gov/insight/feeding-fish-ponds" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Overfeeding in Ornamental Fish Ponds</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NOAA resource on the dangers of overfeeding and proper portion control in closed pond systems.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Koi Feed Planner (Temp + Weight)"
      description="Plan the optimal feeding rate for Koi fish based on their body weight and the current water temperature."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Feed Amount (g/day) = Weight (kg) × Feeding Rate (%) × 10",
        variables: [
          { symbol: "Weight (kg)", description: "Body weight of the koi fish in kilograms" },
          { symbol: "Feeding Rate (%)", description: "Daily feeding rate percentage based on water temperature" },
          { symbol: "Feed Amount (g/day)", description: "Recommended daily feed amount in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A koi fish weighs 4.4 lbs (2 kg) and the water temperature is 68°F (20°C). Determine the daily feed amount.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg if needed (4.4 lbs ≈ 2 kg). Determine feeding rate for 20°C, which is 1.0%.",
          },
          {
            label: "2",
            explanation:
              "Calculate feed amount: 2 kg × 1.0% × 10 = 20 grams per day.",
          },
          {
            label: "3",
            explanation:
              "Convert grams to ounces if using imperial units: 20 g ≈ 0.71 oz per day.",
          },
        ],
        result: "Feed the koi approximately 20 grams (0.71 ounces) of food daily at 20°C water temperature.",
      }}
      relatedCalculators={[
        { title: "Filter Flow Rate Calculator", url: "/pets/aquarium-filter-flow-rate", icon: "🐾" },
        { title: "Cephalexin Dose Calculator for Dogs", url: "/pets/dog-cephalexin-dose", icon: "🐶" },
        { title: "Essential Oils Exposure Risk (diffuser/dermal)", url: "/pets/cat-essential-oils-exposure-risk", icon: "🐱" },
        { title: "Shedding & Combing Time Planner", url: "/pets/cat-shedding-combing-time-planner", icon: "🍖" },
        { title: "Xylitol Exposure Risk for Cats (rare but educational)", url: "/pets/cat-xylitol-exposure-risk", icon: "🐱" },
        { title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs", url: "/pets/dog-omega-3-epa-dha-supplement", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Koi Feed Planner (Temp + Weight)" },
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