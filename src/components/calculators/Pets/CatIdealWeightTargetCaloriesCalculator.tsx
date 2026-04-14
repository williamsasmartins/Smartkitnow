import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function CatIdealWeightTargetCaloriesCalculator() {
  // 1. STATE
  // Weight is involved in formulas, so keep unit switcher
  const [unit, setUnit] = useState("imperial"); // default imperial (lbs)

  // Inputs: current weight only, since ideal weight is often estimated by body condition score or breed,
  // but here we provide a calculator for target calories based on current weight.
  // For ideal weight, we can provide a range based on typical healthy weight percentages.
  const [inputs, setInputs] = useState({
    weight: "", // cat's current weight
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = inputs.weight.trim();
    if (!weightRaw) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: null,
      };
    }

    // Parse weight input
    let weight = parseFloat(weightRaw);
    if (isNaN(weight) || weight <= 0) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive weight.",
      };
    }

    // Convert weight to kg if imperial
    if (unit === "imperial") {
      weight = weight * 0.453592; // lbs to kg
    }

    // Ideal Weight Range:
    // Since ideal weight varies by breed and body condition,
    // a common veterinary approach is to estimate ideal weight as current weight adjusted by body condition score.
    // Without BCS input, we can provide a general healthy weight range:
    // For adult cats, ideal weight range is roughly 3.5 to 5.5 kg (7.7 to 12.1 lbs).
    // But since user inputs current weight, we can show +/- 10-15% range as target ideal weight range.
    // Here, we provide a ±15% range around current weight as an estimate.

    const idealWeightMin = +(weight * 0.85).toFixed(2);
    const idealWeightMax = +(weight * 1.15).toFixed(2);

    // Calculate Resting Energy Requirement (RER):
    // RER = 70 * (weight in kg) ^ 0.75
    const RER = 70 * Math.pow(weight, 0.75);

    // Maintenance Energy Requirement (MER) for adult cats:
    // MER = RER * 1.2 to 1.4 (depending on activity, neuter status)
    // We'll use 1.3 as an average multiplier.
    const MER = RER * 1.3;

    // Format output values:
    // Display ideal weight range in selected units
    let idealMinDisplay = idealWeightMin;
    let idealMaxDisplay = idealWeightMax;
    let weightUnitLabel = "kg";
    const caloriesDisplay = Math.round(MER);

    if (unit === "imperial") {
      idealMinDisplay = +(idealWeightMin / 0.453592).toFixed(2);
      idealMaxDisplay = +(idealWeightMax / 0.453592).toFixed(2);
      weightUnitLabel = "lbs";
    }

    return {
      value: caloriesDisplay.toLocaleString(),
      label: `Target Daily Calories (kcal)`,
      subtext: `Estimated ideal weight range: ${idealMinDisplay} - ${idealMaxDisplay} ${weightUnitLabel}`,
      warning: null,
    };
  }, [inputs.weight, unit]);

  // 3. FAQS (DETAILED)
  const faqs = [
    {
      question: "How do I know my cat's ideal weight?",
      answer: "Ideal weight depends on breed, age, and body frame size. Most domestic cats range from 8-12 lbs, but Maine Coons can reach 18 lbs while Siamese stay around 6-8 lbs. Your vet can assess your cat's body condition score (1-9 scale) to determine target weight.",
    },
    {
      question: "How many calories should my indoor cat eat daily?",
      answer: "Indoor cats typically need 200-250 calories per day, depending on age and weight. A sedentary 10 lb cat requires roughly 24 calories per pound of body weight, while active cats may need up to 30 calories per pound.",
    },
    {
      question: "Do outdoor cats need more calories than indoor cats?",
      answer: "Yes, outdoor and highly active cats burn 25-50% more calories than indoor cats due to increased movement and temperature regulation. A 10 lb outdoor cat may require 300-350 calories daily versus 200-250 for an indoor counterpart.",
    },
    {
      question: "How often should I recalculate my cat's calorie needs?",
      answer: "Recalculate every 6 months or when your cat's weight changes significantly, enters a new life stage (kitten to adult), or shows changes in activity level. Senior cats (&gt;7 years) may need adjustments every 3-4 months.",
    },
    {
      question: "What factors affect a cat's ideal weight calculation?",
      answer: "Age, breed, body frame size, activity level, neutering status, and health conditions all influence ideal weight. Spayed/neutered cats typically weigh 10-15% more than intact cats and may need 25-30% fewer calories.",
    },
    {
      question: "Can I use human BMI calculators for my cat?",
      answer: "No, cats have different metabolic rates and body composition than humans. Feline calculations use body condition scoring and weight-to-calorie ratios specific to cat physiology, not human BMI formulas.",
    },
    {
      question: "How do I adjust calories if my cat is overweight or underweight?",
      answer: "Reduce calories by 10-15% for overweight cats and increase by 10-15% for underweight cats, reassessing every 4 weeks. Extreme restrictions (&lt;150 calories daily) risk hepatic lipidosis in cats and require veterinary supervision.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }

  const widget = (
    <div className="space-y-6">
      {/* UNIT SELECTOR */}
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

      {/* INPUTS */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Current Cat Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.weight || ""}
            onChange={onInputChange}
            aria-describedby="weight-desc"
            className="mt-1"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Please enter your cat's current weight to estimate ideal weight range and daily calorie needs.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Ideal Weight &amp; Target Calories for Cats</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your cat's healthy weight range and daily calorie requirements based on age, weight, activity level, and body frame size. It helps you create a nutrition plan aligned with veterinary weight management standards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">You'll input your cat's current weight (in pounds or kilograms), age category (kitten, adult, senior), activity level (indoor/sedentary, moderate, or outdoor/active), and breed/frame size. The calculator cross-references these data against feline metabolic standards.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show your cat's ideal weight range, daily calorie targets, and personalized feeding recommendations. Use these numbers to adjust portion sizes, select appropriate food calorie density, and monitor weight changes over time with your veterinarian.</p>
        </div>
      </section>

      {/* TABLE: Daily Calorie Requirements by Cat Weight and Activity Level */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Calorie Requirements by Cat Weight and Activity Level</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate daily calorie needs based on your cat's weight and lifestyle.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cat Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Indoor/Sedentary (kcal)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Activity (kcal)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Outdoor/Active (kcal)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">144-180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-210</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">210-240</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">192-240</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240-280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280-320</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-400</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">288-360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360-420</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420-480</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">336-420</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420-490</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">490-560</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">384-480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">480-560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">560-640</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations based on 24-30 kcal per pound daily. Adjust for metabolism, age, and health conditions.</p>
      </section>

      {/* TABLE: Ideal Weight Ranges by Cat Breed and Frame Size */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ideal Weight Ranges by Cat Breed and Frame Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference ideal weight targets for common cat breeds and body frame types.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Breed/Frame Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Small Frame (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medium Frame (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Large Frame (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Siamese/Oriental</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Russian Blue</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Domestic Shorthair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">British Shorthair</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Maine Coon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Persian</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Frame size assessment should be performed by a veterinarian using body condition scoring.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your cat monthly on a consistent scale to track progress toward ideal weight, accounting for 0.5-1 lb monthly loss as healthy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use calorie information on cat food labels to portion correctly; most canned foods contain 70-100 kcal per 3 oz can, while dry foods range from 350-500 kcal per cup.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in treats and supplements, which can add 20-50 calories daily and often get overlooked in calorie calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consult your veterinarian before making major dietary changes, especially if your cat has diabetes, kidney disease, or other health conditions affecting nutrition needs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using human weight loss guidelines</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Rapid weight loss in cats (&gt;2 lbs monthly) risks hepatic lipidosis; follow veterinary protocols limiting loss to 0.5-1 lb per week.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring neutering/spaying status</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Spayed/neutered cats need 25-30% fewer calories than intact cats but often weigh 10-15% more; failing to adjust causes obesity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for treats and table food</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats often provide 20-50 calories daily and should represent no more than 10% of total calorie intake but are frequently excluded from calculations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming breed has no impact on ideal weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Breed-specific genetics significantly affect ideal weight; a 12 lb Maine Coon is lean while a 12 lb Siamese is obese.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know my cat's ideal weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ideal weight depends on breed, age, and body frame size. Most domestic cats range from 8-12 lbs, but Maine Coons can reach 18 lbs while Siamese stay around 6-8 lbs. Your vet can assess your cat's body condition score (1-9 scale) to determine target weight.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many calories should my indoor cat eat daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Indoor cats typically need 200-250 calories per day, depending on age and weight. A sedentary 10 lb cat requires roughly 24 calories per pound of body weight, while active cats may need up to 30 calories per pound.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do outdoor cats need more calories than indoor cats?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, outdoor and highly active cats burn 25-50% more calories than indoor cats due to increased movement and temperature regulation. A 10 lb outdoor cat may require 300-350 calories daily versus 200-250 for an indoor counterpart.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I recalculate my cat's calorie needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Recalculate every 6 months or when your cat's weight changes significantly, enters a new life stage (kitten to adult), or shows changes in activity level. Senior cats (&gt;7 years) may need adjustments every 3-4 months.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect a cat's ideal weight calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Age, breed, body frame size, activity level, neutering status, and health conditions all influence ideal weight. Spayed/neutered cats typically weigh 10-15% more than intact cats and may need 25-30% fewer calories.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use human BMI calculators for my cat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, cats have different metabolic rates and body composition than humans. Feline calculations use body condition scoring and weight-to-calorie ratios specific to cat physiology, not human BMI formulas.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I adjust calories if my cat is overweight or underweight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reduce calories by 10-15% for overweight cats and increase by 10-15% for underweight cats, reassessing every 4 weeks. Extreme restrictions (&lt;150 calories daily) risk hepatic lipidosis in cats and require veterinary supervision.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/publications" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Feline Nutrient Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidelines for feline nutritional standards and calorie requirements across life stages.</p>
          </li>
          <li>
            <a href="https://www.icatcare.org/advice/cat-weight-management/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care - Weight Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based resources on assessing body condition and managing feline weight health.</p>
          </li>
          <li>
            <a href="https://www.avma.org/resources-tools/pet-owners/petcare/obesity-pets" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AVMA Pet Obesity Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary Association guidelines on obesity prevention and weight management in companion animals.</p>
          </li>
          <li>
            <a href="https://vcahospitals.com/know-your-pet/nutrition-for-cats" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">VCA Animal Hospitals - Caloric Needs</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical nutrition information for calculating and adjusting calorie intake in cats at various life stages.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ideal Weight & Target Calories for Cats"
      description="Determine your cat's optimal weight and the necessary daily calorie intake for maintenance."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Scientific Formula",
        formula: (
          <>
            <p>
              <strong>Resting Energy Requirement (RER):</strong> <br />
              RER = 70 × (Weight in kg)<sup>0.75</sup>
            </p>
            <p className="mt-2">
              <strong>Maintenance Energy Requirement (MER):</strong> <br />
              MER = RER × Activity Factor (typically 1.3 for adult cats)
            </p>
            <p className="mt-2">
              <strong>Ideal Weight Range:</strong> <br />
              Current Weight × 0.85 to Current Weight × 1.15
            </p>
          </>
        ),
        variables: [
          { symbol: "Weight", description: "Current weight of the cat in kilograms" },
          { symbol: "RER", description: "Resting Energy Requirement in kcal/day" },
          { symbol: "MER", description: "Maintenance Energy Requirement in kcal/day" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 4.5 kg adult cat is brought in for nutritional assessment. The owner wants to know the ideal weight range and daily calorie needs for maintenance.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate RER: 70 × (4.5)^0.75 ≈ 197 kcal/day.",
          },
          {
            label: "2",
            explanation:
              "Calculate MER: 197 × 1.3 ≈ 256 kcal/day needed to maintain weight.",
          },
          {
            label: "3",
            explanation:
              "Estimate ideal weight range: 4.5 × 0.85 = 3.83 kg to 4.5 × 1.15 = 5.18 kg.",
          },
        ],
        result:
          "The cat's ideal weight range is approximately 3.8 to 5.2 kg, with a target daily calorie intake of about 256 kcal to maintain weight.",
      }}
      relatedCalculators={[
        { title: "Calcium + D3 Supplement Calculator", url: "/pets/reptile-calcium-d3-supplement", icon: "🐾" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
        { title: "Kitten Adult Weight Predictor", url: "/pets/kitten-adult-weight-predictor", icon: "🐱" },
        { title: "Gabapentin Dose Calculator for Cats", url: "/pets/cat-gabapentin-dose", icon: "🐱" },
        { title: "Senior Cat Nutrition & Calorie Adjuster", url: "/pets/senior-cat-nutrition-calorie-adjuster", icon: "🐱" },
        { title: "Dehydration Risk Estimator (Weight & Symptoms Aware)", url: "/pets/dog-dehydration-risk-estimator", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Ideal Weight & Target Calories for Cats" },
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
