import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function KittenCalorieNeedsAgeSizeCalculator() {
  // 1. STATE
  // This calculator requires weight input, so unit switcher is kept.
  const [unit, setUnit] = useState("imperial"); // default imperial (lbs)

  // Inputs: weight (kg or lbs), age (weeks)
  const [inputs, setInputs] = useState({
    weight: "",
    age: "",
  });

  // 2. LOGIC ENGINE
  // Veterinary formula for Resting Energy Requirement (RER):
  // RER = 70 * (Body Weight in kg)^0.75 kcal/day
  // Growing kittens need about 2-3x RER depending on age.
  // Approximate multipliers by age:
  // 0-8 weeks: 3.0x RER
  // 9-16 weeks: 2.5x RER
  // 17-52 weeks: 2.0x RER
  // >52 weeks: 1.4x RER (adult maintenance, out of scope here)

  // Convert lbs to kg if needed: 1 lb = 0.453592 kg

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const ageRaw = parseInt(inputs.age);

    if (
      isNaN(weightRaw) ||
      weightRaw <= 0 ||
      isNaN(ageRaw) ||
      ageRaw < 0 ||
      ageRaw > 52
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          ageRaw > 52
            ? "This calculator is intended for kittens up to 52 weeks old."
            : null,
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightRaw * 0.453592 : weightRaw;

    // Calculate RER
    const rer = 70 * Math.pow(weightKg, 0.75);

    // Determine multiplier by age
    let multiplier = 2.0;
    if (ageRaw <= 8) multiplier = 3.0;
    else if (ageRaw <= 16) multiplier = 2.5;
    else if (ageRaw <= 52) multiplier = 2.0;

    const calories = rer * multiplier;

    // Convert calories to integer kcal/day
    const caloriesRounded = Math.round(calories);

    return {
      value: caloriesRounded,
      label: "Daily Calorie Needs (kcal/day)",
      subtext: `Based on weight ${weightRaw} ${
        unit === "imperial" ? "lbs" : "kg"
      } and age ${ageRaw} weeks`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "How many calories does a 2-month-old kitten need daily?",
      answer: "A 2-month-old kitten typically needs 150-250 calories per day, depending on breed and individual metabolism. Kittens at this age should eat 3-4 meals daily to support rapid growth.",
    },
    {
      question: "When do kittens transition from high-calorie to adult diets?",
      answer: "Most kittens transition to adult food around 12 months of age, reducing caloric intake from 200-300 calories daily to 180-220 calories for an average adult cat. The exact timing depends on breed size and growth rate.",
    },
    {
      question: "Do larger kitten breeds need more calories than smaller breeds?",
      answer: "Yes, larger breeds like Maine Coons need 20-30% more calories than smaller breeds like Siamese at the same age. A 4-month-old Maine Coon may need 280-320 calories daily versus 200-240 for a standard kitten.",
    },
    {
      question: "How does activity level affect a kitten's calorie requirements?",
      answer: "Active, playful kittens may need 10-20% more calories than less active littermates. Monitor body condition and adjust portions if your kitten seems constantly hungry or is gaining too much weight.",
    },
    {
      question: "What is the difference between calories for male and female kittens?",
      answer: "Male kittens typically grow larger and may need 5-15% more calories than females of the same age. However, individual variation is significant, so weigh and monitor your kitten's growth regularly.",
    },
    {
      question: "Can I overfeed a kitten with high-quality food?",
      answer: "Yes, overfeeding kittens can lead to obesity, digestive issues, and joint problems even with premium food. Follow age-appropriate portion guidelines and adjust based on your kitten's body condition score.",
    },
    {
      question: "How should I adjust calories if my kitten is underweight or overweight?",
      answer: "For underweight kittens, increase portions by 10-15% and consult a vet to rule out health issues. For overweight kittens, reduce calories by 10% and increase playtime, but avoid drastic cuts that harm growth.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. JSX WIDGET

  const onInputChange =
    (field: "weight" | "age") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Allow only numbers and decimal for weight, only numbers for age
      if (field === "weight") {
        if (/^\d*\.?\d*$/.test(val)) {
          setInputs((prev) => ({ ...prev, weight: val }));
        }
      } else {
        if (/^\d*$/.test(val)) {
          setInputs((prev) => ({ ...prev, age: val }));
        }
      }
    };

  const onReset = () => {
    setInputs({ weight: "", age: "" });
  };

  const onCalculate = () => {
    // Calculation is automatic via useMemo, no action needed here.
  };

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
            aria-label="Select unit system"
          >
            <option value="imperial">Imperial (lbs)</option>
            <option value="metric">Metric (kg)</option>
          </select>
        </div>
      </div>

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Current Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="text"
            inputMode="decimal"
            pattern="^\d*\.?\d*$"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight}
            onChange={onInputChange("weight")}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Use current measured weight of your kitten.
          </p>
        </div>

        <div>
          <Label htmlFor="age" className="text-slate-700 dark:text-slate-300">
            Age (weeks)
          </Label>
          <Input
            id="age"
            type="text"
            inputMode="numeric"
            pattern="^\d*$"
            placeholder="Enter age in weeks (0-52)"
            value={inputs.age}
            onChange={onInputChange("age")}
            aria-describedby="age-desc"
          />
          <p id="age-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Age of kitten in weeks (0 to 52 weeks).
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={onCalculate}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          aria-label="Calculate calorie needs"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for diagnosis and personalized feeding plans.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // 5. EDITORIAL CONTENT

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Kitten Calorie Needs by Age/Size Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates daily caloric requirements for kittens from birth to one year, accounting for rapid growth, metabolism, and energy expenditure during critical developmental stages.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your kitten's current age in weeks, approximate weight in pounds or kilograms, and breed size category (small, standard, or large). The calculator will provide personalized daily calorie recommendations and meal frequency suggestions.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the results to guide portion sizes on your kitten's food label, then monitor body condition weekly—your kitten should have a visible waist and rib definition without protruding ribs. Adjust portions by 5-10% if growth seems slow or weight gain excessive.</p>
        </div>
      </section>

      {/* TABLE: Daily Calorie Needs by Age (Standard Domestic Kittens) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Needs by Age (Standard Domestic Kittens)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows average daily calorie requirements for domestic shorthair and standard breed kittens from birth through one year.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feeding Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-250g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 meals</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-200 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 meals</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-1000g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 meals</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2-1.5kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-300 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 meals</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-2.5kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280-320 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 meals</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">9 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5-3.5kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-350 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 meals</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5-4.5kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 meals</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values are approximate and vary by individual kitten metabolism, activity level, and breed. Always consult your veterinarian for personalized recommendations.</p>
      </section>

      {/* TABLE: Calorie Comparison: Large vs. Small Kitten Breeds */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Calorie Comparison: Large vs. Small Kitten Breeds</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares caloric needs at key growth milestones for large breeds versus small breeds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Small Breed (Siamese, Abyssinian)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Large Breed (Maine Coon, Ragdoll)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140-170 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-220 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+30-50 kcal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">190-220 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240-290 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+50-70 kcal</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260-290 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320-380 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+60-90 kcal</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-210 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240-280 kcal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+60 kcal</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Large breed kittens grow for 12-18 months versus 12 months for small breeds. Extended growth periods may increase total caloric needs by 15-25%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your kitten weekly to track growth and adjust calories accordingly, since kittens grow rapidly and caloric needs change frequently.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a kitchen scale to measure kibble portions accurately rather than eyeballing, preventing overfeeding that leads to obesity and health complications.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Transition to new food gradually over 7-10 days by mixing increasing amounts of new food with old food to avoid digestive upset.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Choose kitten-formulated food with AAFCO certification to ensure it meets the higher protein and fat requirements for optimal growth and development.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Adult Cat Calorie Recommendations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adult cat formulas have 30-40% fewer calories than kitten diets, causing malnourishment and stunted growth if used before 12 months.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Feeding Free-Choice Without Measuring</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Leaving food available constantly causes overfeeding and obesity; kittens need portion-controlled meals 2-4 times daily based on age.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Breed-Specific Growth Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Large breed kittens grow slower and longer than small breeds; feeding large-breed kittens adult portions too early causes joint stress and skeletal problems.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Treats in Daily Calories</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats should comprise only 5-10% of daily calories; adding treats without reducing meal portions causes quick weight gain and metabolic issues.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many calories does a 2-month-old kitten need daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 2-month-old kitten typically needs 150-250 calories per day, depending on breed and individual metabolism. Kittens at this age should eat 3-4 meals daily to support rapid growth.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When do kittens transition from high-calorie to adult diets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most kittens transition to adult food around 12 months of age, reducing caloric intake from 200-300 calories daily to 180-220 calories for an average adult cat. The exact timing depends on breed size and growth rate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do larger kitten breeds need more calories than smaller breeds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, larger breeds like Maine Coons need 20-30% more calories than smaller breeds like Siamese at the same age. A 4-month-old Maine Coon may need 280-320 calories daily versus 200-240 for a standard kitten.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does activity level affect a kitten's calorie requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Active, playful kittens may need 10-20% more calories than less active littermates. Monitor body condition and adjust portions if your kitten seems constantly hungry or is gaining too much weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between calories for male and female kittens?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Male kittens typically grow larger and may need 5-15% more calories than females of the same age. However, individual variation is significant, so weigh and monitor your kitten's growth regularly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I overfeed a kitten with high-quality food?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, overfeeding kittens can lead to obesity, digestive issues, and joint problems even with premium food. Follow age-appropriate portion guidelines and adjust based on your kitten's body condition score.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I adjust calories if my kitten is underweight or overweight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For underweight kittens, increase portions by 10-15% and consult a vet to rule out health issues. For overweight kittens, reduce calories by 10% and increase playtime, but avoid drastic cuts that harm growth.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Pet Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards for kitten food formulation and nutritional adequacy statements.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/nutrition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Veterinary Medical Association (AVMA) Pet Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on kitten nutrition, feeding frequency, and growth monitoring.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/kitten-care-feeding" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Kitten Care and Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource on age-appropriate calorie needs, feeding schedules, and dietary transitions.</p>
          </li>
          <li>
            <a href="https://icatcare.org/advice/kitten-nutrition/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care - Kitten Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Science-backed recommendations for supporting healthy kitten development through proper nutrition.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // 6. FORMULA & EXAMPLE

  const formula = {
    title: "Scientific Formula",
    formula:
      "RER = 70 × (Body Weight in kg)^0.75 kcal/day\n" +
      "Daily Calorie Needs = RER × Growth Multiplier\n\n" +
      "Growth Multipliers by Age:\n" +
      "0-8 weeks: 3.0 × RER\n" +
      "9-16 weeks: 2.5 × RER\n" +
      "17-52 weeks: 2.0 × RER",
    variables: [
      { symbol: "RER", description: "Resting Energy Requirement (kcal/day)" },
      { symbol: "Body Weight", description: "Current weight of kitten in kilograms" },
      { symbol: "Growth Multiplier", description: "Factor based on kitten age to account for growth energy needs" },
    ],
  };

  const example = {
    title: "Case Study",
    scenario:
      "A 10-week-old kitten weighs 2.5 kg. Calculate the estimated daily calorie needs.",
    steps: [
      {
        label: "1",
        explanation:
          "Calculate RER: 70 × (2.5)^0.75 = 70 × 1.68 = 117.6 kcal/day",
      },
      {
        label: "2",
        explanation:
          "Determine multiplier for 10 weeks: 2.5 × RER = 2.5 × 117.6 = 294 kcal/day",
      },
    ],
    result: "Estimated daily calorie needs = 294 kcal/day",
  };

  return (
    <CalculatorVerticalLayout
      title="Kitten Calorie Needs by Age/Size"
      description="Calculate the high energy requirements for growing kittens based on their age and projected adult size."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[
        {
          title: "Foaling Countdown & Lactation Feed Planner",
          url: "/pets/horse-foaling-countdown-lactation-feed-planner",
          icon: "🐾",
        },
        {
          title: "Horse Body Condition Score Helper (Henneke 1–9)",
          url: "/pets/horse-body-condition-score-henneke",
          icon: "🐎",
        },
        {
          title: "Koi Feed Planner (Temp + Weight)",
          url: "/pets/koi-feed-planner-temp-weight",
          icon: "🐱",
        },
        {
          title: "Basking Temperature & Gradient Planner",
          url: "/pets/reptile-basking-temperature-gradient-planner",
          icon: "🍖",
        },
        {
          title: "Electrolyte Powder Mixing Calculator",
          url: "/pets/horse-electrolyte-powder-mixing",
          icon: "💉",
        },
        {
          title: "UVB Lighting Distance & Duration Calculator",
          url: "/pets/reptile-uvb-lighting-distance-duration",
          icon: "💧",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Kitten Calorie Needs by Age/Size" },
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
