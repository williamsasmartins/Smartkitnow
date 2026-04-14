import { useState, useMemo, useCallback } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// ⚠️ FULL ICON IMPORT
import { Home, Heart, Utensils, Leaf, Calendar, DollarSign, Droplets, Activity, Moon, Sun, Users, Paintbrush, Wrench, Info, RotateCcw, AlertTriangle, FlaskConical, Scale, Waves, Zap, BookOpen, ExternalLink } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";
import { useWeightUnitPreference } from "@/hooks/useWeightUnitPreference";
import { convertWeight, formatNumberForInput, LB_PER_KG, weightToKg } from "@/lib/utils";

const CAFFEINE_MG_PER_UNIT = {
  coffee: 95, // average mg per 8 oz cup brewed coffee
  espresso: 63, // mg per 1 oz shot
  tea: 47, // mg per 8 oz cup black tea
  soda: 40, // mg per 12 oz can cola
  energyDrink: 80, // mg per 8.4 oz can
  chocolate: 12, // mg per 1 oz dark chocolate
};

export default function CaffeineMaxPerDayCalculator() {
  const { unit: preferredWeightUnit, setUnit: setPreferredWeightUnit } = useWeightUnitPreference();
  // Inputs: weight, unit (kg or lbs), optional age, pregnancy, health conditions
  const [inputs, setInputs] = useState(() => ({
    weight: "",
    weightUnit: preferredWeightUnit === "lb" ? "lbs" : "kg",
    age: "",
    pregnant: "no",
    healthCondition: "none",
    caffeineSources: {
      coffee: "",
      espresso: "",
      tea: "",
      soda: "",
      energyDrink: "",
      chocolate: "",
    },
  }));

  const handleInputChange = useCallback((name, value) => {
    if (name === "weightUnit") {
      const nextUnit = value === "lbs" ? "lbs" : "kg";
      setInputs((prev) => {
        const currentUnit = prev.weightUnit === "lbs" ? "lbs" : "kg";
        if (currentUnit === nextUnit) return prev;
        const num = parseFloat(prev.weight);
        const fromUnit = currentUnit === "lbs" ? "lb" : "kg";
        const toUnit = nextUnit === "lbs" ? "lb" : "kg";
        const nextWeight =
          !prev.weight || Number.isNaN(num) || num <= 0 ? prev.weight : formatNumberForInput(convertWeight(num, fromUnit, toUnit), 2);
        return { ...prev, weightUnit: nextUnit, weight: nextWeight };
      });
      setPreferredWeightUnit(nextUnit === "lbs" ? "lb" : "kg");
      return;
    }
    if (name.startsWith("caffeineSources.")) {
      const key = name.split(".")[1];
      setInputs((prev) => ({
        ...prev,
        caffeineSources: {
          ...prev.caffeineSources,
          [key]: value,
        },
      }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, [setPreferredWeightUnit]);

  // Calculation logic:
  // Step 1: Convert weight to kg if needed
  // Step 2: Calculate max recommended caffeine mg per day based on weight and health factors
  // Step 3: Sum current caffeine intake from sources
  // Step 4: Calculate remaining safe caffeine intake

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    if (!weightNum || weightNum <= 0) {
      return {
        value: null,
        label: "",
        subtext: "Please enter a valid body weight.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Convert weight to kg if input is in lbs
    const weightKg = weightToKg(weightNum, inputs.weightUnit === "lbs" ? "lb" : "kg");

    // Base max caffeine mg per kg body weight (general safe limit)
    // According to FDA and other sources, 3-5 mg/kg is safe for most adults.
    // We'll use 4 mg/kg as a balanced average.
    const baseMaxMg = weightKg * 4;

    // Adjust max caffeine for special conditions:
    // Pregnancy: max 200 mg/day recommended by ACOG
    // Adolescents: max 2.5 mg/kg recommended by American Academy of Pediatrics
    // Health conditions (e.g., heart issues): reduce by 25%
    let adjustedMaxMg = baseMaxMg;
    let warning = null;

    const ageNum = parseInt(inputs.age);
    if (!isNaN(ageNum) && ageNum > 0 && ageNum < 18) {
      adjustedMaxMg = weightKg * 2.5;
      warning = "As a minor, your recommended caffeine intake is lower.";
    }

    if (inputs.pregnant === "yes") {
      adjustedMaxMg = Math.min(adjustedMaxMg, 200);
      warning = "Pregnant individuals should limit caffeine to 200 mg per day.";
    }

    if (inputs.healthCondition === "heart") {
      adjustedMaxMg = adjustedMaxMg * 0.75;
      warning = "Due to heart conditions, caffeine intake should be reduced.";
    }

    // Sum current caffeine intake from sources
    const caffeineIntakeMg = Object.entries(inputs.caffeineSources).reduce((sum, [key, val]) => {
      const amount = parseFloat(val);
      if (!amount || amount <= 0) return sum;
      // For coffee, tea, soda, energyDrink, chocolate, amount is number of servings
      // Multiply by mg per serving
      return sum + amount * (CAFFEINE_MG_PER_UNIT[key] || 0);
    }, 0);

    const remainingMg = adjustedMaxMg - caffeineIntakeMg;

    return {
      value: `${adjustedMaxMg.toFixed(0)} mg`,
      label: "Maximum Recommended Caffeine Intake per Day",
      subtext: caffeineIntakeMg > 0
        ? `You have consumed approximately ${caffeineIntakeMg.toFixed(0)} mg caffeine. Remaining safe intake: ${remainingMg > 0 ? remainingMg.toFixed(0) + " mg" : "0 mg (limit reached or exceeded)"}`
        : "Enter your caffeine consumption to see remaining safe intake.",
      warning,
      formulaUsed:
        inputs.weightUnit === "lbs"
          ? `Max caffeine (mg) = Body weight (lb) × ${(4 / LB_PER_KG).toFixed(2)} mg/lb (adjusted for age, pregnancy, health)`
          : "Max caffeine (mg) = Body weight (kg) × 4 mg/kg (adjusted for age, pregnancy, health)",
      remainingMg: remainingMg > 0 ? remainingMg : 0,
      caffeineIntakeMg,
      adjustedMaxMg,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the recommended maximum daily caffeine intake?",
      answer: "The FDA recommends a maximum of 400 mg of caffeine per day for healthy adults, equivalent to about 4 cups of coffee. Pregnant women should limit intake to 200 mg or less daily.",
    },
    {
      question: "How does body weight affect caffeine tolerance?",
      answer: "Caffeine sensitivity is dose-dependent on body weight; heavier individuals typically tolerate more caffeine than lighter individuals at the same intake level. The calculator adjusts recommendations based on your weight for personalized guidance.",
    },
    {
      question: "Can this calculator help me with caffeine sensitivity?",
      answer: "Yes, the calculator accounts for individual factors like age, weight, and health conditions to estimate your personal caffeine threshold, which varies widely among individuals.",
    },
    {
      question: "Does pregnancy change my caffeine limit?",
      answer: "Pregnant women should reduce caffeine intake to 200 mg daily or less due to increased miscarriage risk, which the calculator adjusts for if pregnancy status is selected.",
    },
    {
      question: "How long does caffeine stay in your system?",
      answer: "Caffeine has a half-life of 3-7 hours, meaning it takes 5-10 hours to leave your system almost entirely, which affects how much you can safely consume throughout the day.",
    },
    {
      question: "What medications interact with caffeine?",
      answer: "Certain medications like some antidepressants, antibiotics, and heart medications can increase caffeine sensitivity, so consulting a doctor before using this calculator is recommended if you take medications.",
    },
    {
      question: "Why do some people need less caffeine than others?",
      answer: "Genetics, age, medications, liver function, and habitual caffeine use all affect how quickly your body metabolizes caffeine and your tolerance level.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight" className="mb-1 flex items-center gap-1">
                Body Weight
                <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  min={1}
                  step="any"
                  placeholder="Enter your weight"
                  value={inputs.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
                <Select
                  value={inputs.weightUnit}
                  onValueChange={(v) => handleInputChange("weightUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="age" className="mb-1 flex items-center gap-1">
                Age
                <Users className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="age"
                type="number"
                min={1}
                placeholder="Optional"
                value={inputs.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pregnant" className="mb-1 flex items-center gap-1">
                Pregnant?
                <Heart className="w-4 h-4 text-pink-600" />
              </Label>
              <Select
                id="pregnant"
                value={inputs.pregnant}
                onValueChange={(v) => handleInputChange("pregnant", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="healthCondition" className="mb-1 flex items-center gap-1">
                Health Condition
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </Label>
              <Select
                id="healthCondition"
                value={inputs.healthCondition}
                onValueChange={(v) => handleInputChange("healthCondition", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="heart">Heart Condition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> Enter Your Daily Caffeine Intake
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Input the number of servings you consume daily for each caffeine source.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(CAFFEINE_MG_PER_UNIT).map(([key, mg]) => (
                <div key={key}>
                  <Label htmlFor={`caffeine-${key}`} className="mb-1 capitalize">
                    {key === "energyDrink" ? "Energy Drink (8.4 oz)" : key === "espresso" ? "Espresso (1 oz shot)" : key === "chocolate" ? "Dark Chocolate (1 oz)" : key.charAt(0).toUpperCase() + key.slice(1) + (key === "soda" ? " (12 oz)" : " (8 oz)")}
                  </Label>
                  <Input
                    id={`caffeine-${key}`}
                    type="number"
                    min={0}
                    step="any"
                    placeholder="0"
                    value={inputs.caffeineSources[key]}
                    onChange={(e) => handleInputChange(`caffeineSources.${key}`, e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-0.5">{mg} mg per serving</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate maximum caffeine intake"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              weight: "",
              weightUnit: "kg",
              age: "",
              pregnant: "no",
              healthCondition: "none",
              caffeineSources: {
                coffee: "",
                espresso: "",
                tea: "",
                soda: "",
                energyDrink: "",
                chocolate: "",
              },
            })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Caffeine Max per Day Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your personalized daily caffeine limit based on FDA guidelines adjusted for your individual factors. It helps you safely manage caffeine consumption and avoid health risks like sleep disruption, anxiety, and cardiovascular issues.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your age, body weight, pregnancy status, and any relevant health conditions. The calculator uses these factors to estimate how your body metabolizes caffeine and sets a safe maximum for your daily intake.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review your personalized caffeine limit and cross-reference it with the beverage guide to track your daily consumption. If your limit is lower than 400 mg, follow your calculated threshold; if you exceed it, gradually reduce intake to avoid withdrawal headaches.</p>
        </div>
      </section>

      {/* TABLE: Caffeine Content in Common Beverages */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Caffeine Content in Common Beverages</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide showing typical caffeine amounts in popular drinks.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Beverage</th>
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
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 oz shot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">63-75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Black Tea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-70</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Green Tea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Energy Drink</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz can</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cola Soft Drink</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 oz can</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">34-46</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Decaffeinated Coffee</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hot Chocolate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-10</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values are approximate and vary by brand, brewing method, and product formulation.</p>
      </section>

      {/* TABLE: Daily Caffeine Limits by Population Group */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Caffeine Limits by Population Group</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended maximum daily caffeine intake varies by age and health status.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Population Group</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Daily Caffeine</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Consideration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Healthy Adults</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">FDA standard recommendation</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pregnant Women</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduces miscarriage risk</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Breastfeeding Women</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Limit infant caffeine exposure</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adolescents (12-18)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Developing bodies more sensitive</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Children (Under 12)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not recommended by pediatricians</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Individuals with Anxiety Disorders</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-100 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May worsen symptoms</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">People with Heart Conditions</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-200 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Consult cardiologist first</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Elderly Adults (65+)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 mg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased sensitivity and side effects</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Individual tolerance varies; consult healthcare providers for personalized limits.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Avoid caffeine after 2 PM to prevent sleep disruption, as it takes 5-10 hours to fully leave your system.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Gradually reduce caffeine intake instead of quitting abruptly to avoid withdrawal headaches and fatigue.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Monitor energy drinks and supplements for hidden caffeine content, as they often contain more than advertised.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your daily caffeine from all sources including coffee, tea, chocolate, and medications for accurate totals.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Hidden Caffeine Sources</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many foods and supplements contain caffeine not listed on labels, leading to accidental overconsumption above your calculated limit.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Individual Sensitivity Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using only the 400 mg FDA guideline without adjusting for personal factors like medications, anxiety, or poor sleep quality can exceed your safe threshold.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Caffeine Half-Life Timing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Consuming caffeine too late in the day can disrupt sleep even if the total daily amount is within your limit due to the 3-7 hour half-life.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Medication Interactions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Certain medications significantly increase caffeine sensitivity, making your calculated limit unsafe without medical consultation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the recommended maximum daily caffeine intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The FDA recommends a maximum of 400 mg of caffeine per day for healthy adults, equivalent to about 4 cups of coffee. Pregnant women should limit intake to 200 mg or less daily.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does body weight affect caffeine tolerance?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Caffeine sensitivity is dose-dependent on body weight; heavier individuals typically tolerate more caffeine than lighter individuals at the same intake level. The calculator adjusts recommendations based on your weight for personalized guidance.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me with caffeine sensitivity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator accounts for individual factors like age, weight, and health conditions to estimate your personal caffeine threshold, which varies widely among individuals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does pregnancy change my caffeine limit?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pregnant women should reduce caffeine intake to 200 mg daily or less due to increased miscarriage risk, which the calculator adjusts for if pregnancy status is selected.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does caffeine stay in your system?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Caffeine has a half-life of 3-7 hours, meaning it takes 5-10 hours to leave your system almost entirely, which affects how much you can safely consume throughout the day.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What medications interact with caffeine?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Certain medications like some antidepressants, antibiotics, and heart medications can increase caffeine sensitivity, so consulting a doctor before using this calculator is recommended if you take medications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do some people need less caffeine than others?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Genetics, age, medications, liver function, and habitual caffeine use all affect how quickly your body metabolizes caffeine and your tolerance level.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fda.gov/consumers/consumer-updates/spilled-beans-how-much-caffeine-too-much" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FDA Guidance on Caffeine Consumption</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official FDA guidance recommending 400 mg daily maximum for healthy adults with safety information.</p>
          </li>
          <li>
            <a href="https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2010/08/moderate-caffeine-consumption-during-pregnancy" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American College of Obstetricians and Gynecologists - Caffeine in Pregnancy</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical guidance limiting caffeine to 200 mg daily during pregnancy to reduce miscarriage risk.</p>
          </li>
          <li>
            <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIH Study on Caffeine Metabolism and Genetics</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research demonstrating genetic variations affecting how individuals metabolize caffeine differently.</p>
          </li>
          <li>
            <a href="https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/caffeine/art-20045431" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Mayo Clinic - Caffeine Health Effects</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive overview of caffeine's effects on sleep, anxiety, heart health, and safe consumption limits.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Caffeine Max per Day Calculator"
      description="Monitor your caffeine intake. Calculate your daily limit based on body weight to enjoy coffee safely without the jitters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Max caffeine (mg) = Body weight (kg) × 4 mg/kg (adjusted for age, pregnancy, and health conditions)",
        variables: [
          { symbol: "Body weight (kg)", description: "Your weight in kilograms" },
          { symbol: "4 mg/kg", description: "General safe caffeine limit per kilogram of body weight" },
          { symbol: "Adjustments", description: "Reductions based on age, pregnancy, and health conditions" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "A 70 kg healthy adult wants to know their maximum caffeine intake and how much caffeine they have left after drinking 2 cups of coffee and 1 energy drink.",
        steps: [
          {
            label: "Step 1",
            explanation: "Calculate base max caffeine: 70 kg × 4 mg/kg = 280 mg",
          },
          {
            label: "Step 2",
            explanation: "Calculate caffeine consumed: (2 cups coffee × 95 mg) + (1 energy drink × 80 mg) = 270 mg",
          },
          {
            label: "Step 3",
            explanation: "Calculate remaining safe intake: 280 mg - 270 mg = 10 mg",
          },
        ],
        result: "The user can safely consume up to 280 mg caffeine per day and has about 10 mg remaining after current intake.",
      }}
      relatedCalculators={[
        { title: "Grass Seed Quantity Calculator", url: "/everyday/grass-seed-quantity", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday/event-budget-calculator", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Square Footage Calculator", url: "/everyday/square-footage-calculator", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday/buffet-pan-capacity-count", icon: "💡" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Safe Daily Limit" },
        { id: "caffeine-table", label: "Caffeine by Beverage" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}
