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
import { convertWeight, formatNumberForInput, weightToKg } from "@/lib/utils";

export default function DogCaffeineToxicityCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();
  const [inputs, setInputs] = useState({
    weight: "",
    caffeineMg: "",
  });

  // 2. LOGIC ENGINE
  // Toxic dose of caffeine in dogs is approximately 20 mg/kg body weight (lowest reported toxic dose).
  // Severe toxicity and fatality risk increases at doses > 40 mg/kg.
  // We calculate mg/kg = total caffeine ingested (mg) / weight (kg)
  // Then classify risk level based on mg/kg.

  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const caffeineRaw = parseFloat(inputs.caffeineMg);
    if (isNaN(weightRaw) || weightRaw <= 0 || isNaN(caffeineRaw) || caffeineRaw <= 0) {
      return { value: 0, label: "Enter valid weight and caffeine amount..." };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // mg/kg caffeine dose
    const doseMgPerKg = caffeineRaw / weightKg;

    // Risk classification
    let label = "";
    let warning = null;

    if (doseMgPerKg < 10) {
      label = "Low risk of caffeine toxicity";
    } else if (doseMgPerKg >= 10 && doseMgPerKg < 20) {
      label = "Mild toxicity possible; monitor closely";
      warning =
        "Mild symptoms such as restlessness or mild gastrointestinal upset may occur. Veterinary consultation recommended.";
    } else if (doseMgPerKg >= 20 && doseMgPerKg < 40) {
      label = "Moderate toxicity likely; seek veterinary care";
      warning =
        "Signs such as vomiting, diarrhea, increased heart rate, and tremors may develop. Immediate veterinary attention advised.";
    } else {
      label = "Severe toxicity/fatal risk; emergency veterinary care needed";
      warning =
        "High risk of seizures, arrhythmias, and death. This is a medical emergency; seek veterinary care immediately.";
    }

    return {
      value: doseMgPerKg.toFixed(2),
      label,
      subtext: `Based on a caffeine dose of ${caffeineRaw} mg and dog weight of ${weightKg.toFixed(2)} kg.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What caffeine dose is toxic to dogs?",
      answer: "Dogs typically show toxicity symptoms at 20 mg/kg of body weight, with severe toxicity occurring above 40 mg/kg. A 50-pound dog could experience serious effects from as little as 450 mg of caffeine.",
    },
    {
      question: "How does dog weight affect caffeine toxicity risk?",
      answer: "Smaller dogs have much lower toxicity thresholds than larger dogs. A 10-pound chihuahua is at risk from 90 mg of caffeine, while a 80-pound labrador needs 720 mg to reach the same toxicity level.",
    },
    {
      question: "Which common foods and drinks contain dangerous caffeine levels for dogs?",
      answer: "One cup of coffee contains 95-200 mg of caffeine, dark chocolate has 12-26 mg per ounce, and energy drinks can have 80-300 mg per serving—all potentially toxic depending on dog size.",
    },
    {
      question: "What are the early signs of caffeine toxicity in dogs?",
      answer: "Initial symptoms include restlessness, rapid heartbeat, tremors, and excessive thirst appearing within 30-60 minutes of ingestion; severe cases progress to seizures and cardiac arrhythmias.",
    },
    {
      question: "How quickly should I seek veterinary help after my dog consumes caffeine?",
      answer: "Contact your veterinarian immediately or call poison control if your dog ingested caffeine; treatment is most effective within 2-4 hours of consumption.",
    },
    {
      question: "Can this calculator predict exact outcomes for my dog?",
      answer: "This calculator estimates toxicity risk based on weight and caffeine amount, but individual sensitivity varies; it's a screening tool, not a diagnostic replacement for veterinary evaluation.",
    },
    {
      question: "Are some dog breeds more sensitive to caffeine than others?",
      answer: "While all dogs are caffeine-sensitive, breed differences are minimal; sensitivity depends more on individual metabolism, age, and overall health than breed type.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const widget = (
    <div className="space-y-6">
      {/* Unit Switcher */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select
            value={unit}
            onValueChange={(next) => {
              if (next !== "kg" && next !== "lb") return;
              const weightRaw = parseFloat(inputs.weight);
              if (Number.isFinite(weightRaw) && weightRaw > 0) {
                const nextWeight = convertWeight(weightRaw, unit, next);
                setInputs((prev) => ({ ...prev, weight: formatNumberForInput(nextWeight, 2) }));
              }
              setUnit(next);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Weight Input */}
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "lb" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={(e) => handleInputChange("weight", e.target.value)}
          />
        </div>

        {/* Caffeine Input */}
        <div>
          <Label htmlFor="caffeineMg" className="text-slate-700 dark:text-slate-300">
            Estimated Caffeine Ingested (mg)
          </Label>
          <Input
            id="caffeineMg"
            type="number"
            min="0"
            step="any"
            placeholder="Enter caffeine amount in milligrams"
            value={inputs.caffeineMg}
            onChange={(e) => handleInputChange("caffeineMg", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => setInputs((prev) => ({ ...prev }))}
          type="button"
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", caffeineMg: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value} mg/kg</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Caffeine Toxicity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates your dog's risk level based on accidental caffeine ingestion. Enter your dog's weight in pounds and the amount of caffeine consumed to receive a toxicity assessment and recommended action.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include your dog's current weight in pounds and the total milligrams of caffeine ingested. If you don't know the exact amount, use the reference table to estimate caffeine content from the food or beverage source.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results will indicate whether exposure is in the safe, mild, moderate, or severe toxicity range. Green results suggest monitoring at home; yellow warrants veterinary consultation; red indicates emergency veterinary care is needed immediately.</p>
        </div>
      </section>

      {/* TABLE: Caffeine Content in Common Human Foods and Beverages */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Caffeine Content in Common Human Foods and Beverages</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide showing typical caffeine amounts in products dogs commonly access.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Caffeine (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brewed Coffee</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">95-200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Espresso</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 shot (1 oz)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63-75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Black Tea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-70</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Iced Tea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 oz glass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dark Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 oz square</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-26</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Milk Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 oz square</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-15</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Energy Drink</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz can</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cola</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 oz can</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34-46</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Caffeine Pills</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Single tablet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Green Tea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values are approximate and vary by brand, brewing method, and preparation time.</p>
      </section>

      {/* TABLE: Caffeine Toxicity Thresholds by Dog Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Caffeine Toxicity Thresholds by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimated risk levels showing when caffeine becomes concerning based on body weight.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mild Symptoms (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Toxicity (mg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Severe Toxicity (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 lbs (2.3 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">185</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 lbs (4.5 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">370</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 lbs (11 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">925</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50 lbs (23 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1850</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75 lbs (34 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">675</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2775</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100 lbs (45 kg)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3700</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Mild symptoms appear around 20 mg/kg; moderate at 40 mg/kg; severe at &gt;80 mg/kg. Individual sensitivity varies.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep all coffee, tea, energy drinks, and chocolate in secure cabinets away from curious dogs to prevent accidental ingestion.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Be aware that some medications and diet pills contain caffeine—check labels before administering any human products to your dog.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">If your dog weighs under 20 pounds, even small amounts of coffee or strong tea can pose serious risk due to their low toxicity threshold.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor your dog for 6-12 hours after potential caffeine exposure and contact your vet immediately if tremors, rapid heartbeat, or restlessness develop.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming chocolate toxicity is the same as caffeine toxicity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Chocolate contains both caffeine and theobromine; use this calculator only for caffeine content, as chocolate requires separate theobromine toxicity assessment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring individual dog sensitivity variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies, senior dogs, and dogs with heart conditions are more susceptible to caffeine effects than the calculator's standard dosing predicts.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Delaying veterinary care based on mild symptom results</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even if results show mild toxicity risk, contact your vet if your dog exhibits any unusual symptoms; visible signs matter more than the calculator estimate.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating caffeine in decaffeinated products</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Decaf coffee still contains 2-10 mg per cup; only espresso decaf approaches zero caffeine, so never assume decaf is completely safe.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What caffeine dose is toxic to dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Dogs typically show toxicity symptoms at 20 mg/kg of body weight, with severe toxicity occurring above 40 mg/kg. A 50-pound dog could experience serious effects from as little as 450 mg of caffeine.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does dog weight affect caffeine toxicity risk?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Smaller dogs have much lower toxicity thresholds than larger dogs. A 10-pound chihuahua is at risk from 90 mg of caffeine, while a 80-pound labrador needs 720 mg to reach the same toxicity level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Which common foods and drinks contain dangerous caffeine levels for dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">One cup of coffee contains 95-200 mg of caffeine, dark chocolate has 12-26 mg per ounce, and energy drinks can have 80-300 mg per serving—all potentially toxic depending on dog size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are the early signs of caffeine toxicity in dogs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Initial symptoms include restlessness, rapid heartbeat, tremors, and excessive thirst appearing within 30-60 minutes of ingestion; severe cases progress to seizures and cardiac arrhythmias.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How quickly should I seek veterinary help after my dog consumes caffeine?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Contact your veterinarian immediately or call poison control if your dog ingested caffeine; treatment is most effective within 2-4 hours of consumption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator predict exact outcomes for my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator estimates toxicity risk based on weight and caffeine amount, but individual sensitivity varies; it's a screening tool, not a diagnostic replacement for veterinary evaluation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Are some dog breeds more sensitive to caffeine than others?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While all dogs are caffeine-sensitive, breed differences are minimal; sensitivity depends more on individual metabolism, age, and overall health than breed type.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/animal-poison-control" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Animal Poison Control Center</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official poison control resource providing emergency guidance and case management for pet caffeine exposure.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Veterinary toxicology experts offering 24/7 consulting on caffeine and other toxin exposures in dogs.</p>
          </li>
          <li>
            <a href="https://www.fda.gov/news-events/public-health-focus/caffeine-your-diet" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA: Caffeine in Foods and Dietary Supplements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FDA data on caffeine content in common foods, beverages, and supplements for reference.</p>
          </li>
          <li>
            <a href="https://www.vin.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Information Network (VIN): Methylxanthine Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed veterinary resource detailing mechanisms and treatment of caffeine and theobromine toxicity in dogs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Caffeine Toxicity Calculator"
      description="Estimate the toxic level risk from accidental ingestion of coffee, tea, or caffeine-containing products."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: mg/kg = total caffeine ingested (mg) ÷ dog weight (kg)
      formula={{
        title: "Scientific Formula",
        formula: "Dose (mg/kg) = Total Caffeine Ingested (mg) ÷ Dog Weight (kg)",
        variables: [
          { symbol: "Dose (mg/kg)", description: "Caffeine dose per kilogram of dog's body weight" },
          { symbol: "Total Caffeine Ingested (mg)", description: "Amount of caffeine consumed by the dog in milligrams" },
          { symbol: "Dog Weight (kg)", description: "Dog's body weight in kilograms" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 22-pound (10 kg) dog accidentally drinks a cup of coffee containing approximately 95 mg of caffeine. The owner wants to assess the toxicity risk.",
        steps: [
          {
            label: "Step 1",
            explanation: "Convert the dog's weight to kilograms if needed (22 lbs ÷ 2.20462 = 10 kg).",
          },
          {
            label: "Step 2",
            explanation: "Calculate the caffeine dose per kg: 95 mg ÷ 10 kg = 9.5 mg/kg.",
          },
          {
            label: "Step 3",
            explanation:
              "Compare the dose to toxicity thresholds: 9.5 mg/kg is below the mild toxicity threshold (10 mg/kg), indicating low risk but monitoring is advised.",
          },
        ],
        result: "The dog is at low risk of caffeine toxicity but should be observed for any symptoms. Veterinary consultation is recommended if symptoms develop.",
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
        { id: "what-is", label: "Understanding Dog Caffeine Toxicity Calculator" },
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
