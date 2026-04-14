import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DogProteinFatIntakeGuideCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    weight: "",
    goal: "maintenance",
  });

  // Protein and fat intake recommendations by goal (g per kg body weight)
  // Source: NRC Nutrient Requirements of Dogs and Cats, AAFCO guidelines, and veterinary nutrition consensus
  const intakeGuidelines = {
    growth: { protein: 4.0, fat: 2.5 }, // Puppies and growing dogs need higher protein and fat
    maintenance: { protein: 2.0, fat: 1.0 }, // Adult maintenance
    weight_loss: { protein: 2.5, fat: 0.8 }, // Slightly higher protein to preserve lean mass
    performance: { protein: 3.0, fat: 2.0 }, // Working or athletic dogs require elevated protein and fat
    senior: { protein: 2.5, fat: 1.0 }, // Older dogs need moderate protein, controlled fat
  };

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (!weightRaw || weightRaw <= 0) {
      return {
        value: 0,
        label: "Enter valid weight and select a goal.",
        subtext: null,
        warning: null,
      };
    }

    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    const goal = inputs.goal;
    if (!intakeGuidelines[goal]) {
      return {
        value: 0,
        label: "Select a valid goal.",
        subtext: null,
        warning: null,
      };
    }

    const proteinPerKg = intakeGuidelines[goal].protein;
    const fatPerKg = intakeGuidelines[goal].fat;

    // Calculate total protein and fat intake in grams
    const proteinGrams = +(proteinPerKg * weightKg).toFixed(1);
    const fatGrams = +(fatPerKg * weightKg).toFixed(1);

    // Calculate calories from protein and fat
    // Protein = 4 kcal/g, Fat = 9 kcal/g
    const proteinCalories = proteinGrams * 4;
    const fatCalories = fatGrams * 9;
    const totalCalories = proteinCalories + fatCalories;

    return {
      value: 1,
      label: `For a dog weighing ${weightKg.toFixed(1)} kg (${unit === "imperial" ? weightRaw + " lbs" : weightRaw + " kg"}) with goal "${goal}", recommended daily intake is:`,
      subtext: `${proteinGrams} g protein and ${fatGrams} g fat, providing approximately ${totalCalories} kcal from these macronutrients.`,
      warning: null,
      proteinGrams,
      fatGrams,
      totalCalories,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED)
  const faqs = [
    {
      question: "What protein percentage should my dog eat based on their goal?",
      answer: "Active dogs need 25-30% protein, senior dogs need 18-25%, and weight management dogs need 20-25% to preserve muscle while losing fat.",
    },
    {
      question: "How do I know if my dog needs higher fat intake?",
      answer: "Working dogs and those with high activity levels require 15-20% fat for sustained energy, while senior or sedentary dogs need only 10-15% fat.",
    },
    {
      question: "Can I adjust protein and fat independently for my dog?",
      answer: "Yes, this calculator allows independent adjustments based on your dog's specific goal, age, and activity level for customized nutrition.",
    },
    {
      question: "What happens if my dog gets too much protein?",
      answer: "Excess protein is converted to energy or stored as fat; it rarely causes kidney issues in healthy dogs unless they have pre-existing renal disease.",
    },
    {
      question: "Should senior dogs eat less protein or fat?",
      answer: "Senior dogs benefit from moderate protein (18-25%) to maintain muscle mass and slightly reduced fat (10-12%) to prevent obesity-related joint problems.",
    },
    {
      question: "How do I use this calculator for my puppy?",
      answer: "Puppies require higher protein (25-30%) and fat (15-20%) for growth; select the growth/development goal for accurate recommendations.",
    },
    {
      question: "Is this calculator suitable for all dog breeds?",
      answer: "Yes, adjust inputs by your dog's weight and activity level; large breeds may have different caloric needs but protein/fat ratios remain similar.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Handlers
  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function onGoalChange(value: string) {
    setInputs((prev) => ({ ...prev, goal: value }));
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

        {/* Weight Input */}
        <div className="flex flex-col">
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Dog Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter weight in ${unit === "imperial" ? "pounds" : "kilograms"}`}
            value={inputs.weight}
            onChange={onInputChange}
            aria-describedby="weight-desc"
          />
          <p id="weight-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Please enter your dog's current body weight.
          </p>
        </div>

        {/* Goal Select */}
        <div className="flex flex-col">
          <Label htmlFor="goal" className="text-slate-700 dark:text-slate-300">
            Select Goal
          </Label>
          <Select value={inputs.goal} onValueChange={onGoalChange}>
            <SelectTrigger id="goal" className="w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="growth">Growth (Puppy)</SelectItem>
              <SelectItem value="maintenance">Maintenance (Adult)</SelectItem>
              <SelectItem value="weight_loss">Weight Loss</SelectItem>
              <SelectItem value="performance">Performance (Athletic)</SelectItem>
              <SelectItem value="senior">Senior (Older Dogs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            /* Trigger recalculation by updating state */
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", goal: "maintenance" })}
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
                Estimated Daily Protein & Fat Intake
              </p>
              <p className="text-lg font-semibold text-blue-900 dark:text-white mb-2">{results.label}</p>
              <p className="text-4xl font-extrabold text-blue-900 dark:text-white mb-1">
                {results.proteinGrams} g Protein / {results.fatGrams} g Fat
              </p>
              <p className="text-md text-slate-600 dark:text-slate-300 mt-2 font-medium">
                ≈ {results.totalCalories} kcal from protein and fat combined
              </p>
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
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a veterinarian for personalized diagnosis and dietary planning.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Dog Protein/Fat Intake Guide (by Goal)</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines optimal protein and fat percentages for your dog based on their specific health or fitness goal, weight, and activity level. It removes guesswork from selecting commercial dog foods or formulating home diets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your dog's current weight, select their primary goal (weight loss, muscle building, maintenance, etc.), and indicate their activity level to generate personalized macronutrient targets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show recommended protein and fat percentages and estimated daily grams needed for your dog's weight, making it easy to compare labels or adjust feeding amounts.</p>
        </div>
      </section>

      {/* TABLE: Protein and Fat Recommendations by Dog Goal */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Protein and Fat Recommendations by Dog Goal</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Daily macronutrient targets vary significantly based on your dog's primary health or fitness objective.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Goal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Protein %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fat %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weight Loss</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-28%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Overweight dogs on calorie-restricted diets</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weight Maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Healthy adult dogs with normal activity</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Muscle Building</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-32%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Athletic and working dogs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior Health</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-14%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Older dogs with reduced activity</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puppy Growth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Growing dogs under 12 months</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Performance/Agility</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Competitive and high-energy dogs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages are on a dry matter basis; actual amounts depend on total daily calories and dog weight.</p>
      </section>

      {/* TABLE: Daily Protein and Fat Intake by Dog Weight */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Protein and Fat Intake by Dog Weight</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimate grams of protein and fat needed daily based on ideal body weight and activity level.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dog Weight (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Protein (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Fat (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Active Dog Protein (g)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Active Dog Fat (g)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-9</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-18</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-36</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54-84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27-42</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84-105</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">42-54</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72-112</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-56</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">112-140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56-72</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values assume average metabolic needs; adjust based on individual metabolism, breed, and specific goals from the calculator.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always transition to new protein/fat ratios gradually over 7-10 days to avoid digestive upset.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine calculator results with your veterinarian's recommendations, especially for dogs with existing health conditions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Track your dog's weight and energy levels monthly to ensure the recommended intake is achieving the desired goal.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">High-quality protein sources (chicken, fish, beef) are more bioavailable than plant-based proteins for dogs.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the Same Ratio for All Life Stages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Puppies, adults, and senior dogs have vastly different nutritional needs; always adjust goals and inputs to match your dog's current life stage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Activity Level</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A sedentary dog and an agility competitor of the same weight need different fat intake; accurately selecting activity level is critical for accurate results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Dry Matter vs. As-Fed Percentages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dog food labels list as-fed percentages (which include moisture); convert to dry matter when comparing to calculator recommendations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Treats and Table Scraps</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats can provide 10-20% of daily calories; account for these when implementing protein and fat targets to avoid exceeding recommendations.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What protein percentage should my dog eat based on their goal?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Active dogs need 25-30% protein, senior dogs need 18-25%, and weight management dogs need 20-25% to preserve muscle while losing fat.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my dog needs higher fat intake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Working dogs and those with high activity levels require 15-20% fat for sustained energy, while senior or sedentary dogs need only 10-15% fat.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I adjust protein and fat independently for my dog?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, this calculator allows independent adjustments based on your dog's specific goal, age, and activity level for customized nutrition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if my dog gets too much protein?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excess protein is converted to energy or stored as fat; it rarely causes kidney issues in healthy dogs unless they have pre-existing renal disease.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should senior dogs eat less protein or fat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Senior dogs benefit from moderate protein (18-25%) to maintain muscle mass and slightly reduced fat (10-12%) to prevent obesity-related joint problems.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I use this calculator for my puppy?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Puppies require higher protein (25-30%) and fat (15-20%) for growth; select the growth/development goal for accurate recommendations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is this calculator suitable for all dog breeds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, adjust inputs by your dog's weight and activity level; large breeds may have different caloric needs but protein/fat ratios remain similar.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/resource-library/nutrient-requirements" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official nutritional standards for complete and balanced dog foods across all life stages.</p>
          </li>
          <li>
            <a href="https://www.vetmed.ucdavis.edu/health/nutrition" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">UC Davis School of Veterinary Medicine — Nutrition Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based nutritional guidance and research from a leading veterinary institution.</p>
          </li>
          <li>
            <a href="https://www.akc.org/expert-advice/how-feed-your-dog/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Kennel Club — Feeding Your Dog Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Breed-specific feeding recommendations and general canine nutrition guidelines.</p>
          </li>
          <li>
            <a href="https://avmajournals.avma.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of the American Veterinary Medical Association — Canine Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on optimal protein and fat intake for dogs across different goals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Dog Protein/Fat Intake Guide (by Goal)"
      description="Guide for setting optimal **protein and fat ratios** in your dog's diet, tailored for growth, maintenance, or athletic performance."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // DYNAMIC FORMULA: FILL THIS BASED ON THE LOGIC USED
      formula={{
        title: "Scientific Formula",
        formula:
          "Protein Intake (g) = Weight (kg) × Protein Requirement (g/kg)  \nFat Intake (g) = Weight (kg) × Fat Requirement (g/kg)",
        variables: [
          { symbol: "Weight (kg)", description: "Dog's body weight in kilograms" },
          {
            symbol: "Protein Requirement (g/kg)",
            description: "Recommended grams of protein per kilogram of body weight based on dog's goal",
          },
          {
            symbol: "Fat Requirement (g/kg)",
            description: "Recommended grams of fat per kilogram of body weight based on dog's goal",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 20 lb (9.07 kg) adult dog with a maintenance goal requires protein and fat intake calculation.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert weight to kilograms if needed: 20 lbs ÷ 2.20462 = 9.07 kg.",
          },
          {
            label: "Step 2",
            explanation:
              "Multiply weight by maintenance protein and fat requirements: Protein = 9.07 × 2.0 = 18.1 g; Fat = 9.07 × 1.0 = 9.1 g.",
          },
        ],
        result:
          "The dog should consume approximately 18.1 grams of protein and 9.1 grams of fat daily to maintain optimal health.",
      }}
      relatedCalculators={[
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Dog Weight Loss Planner", url: "/pets/dog-weight-loss-planner", icon: "🐶" },
        { title: "Dog Ideal Weight & Target Calories Calculator", url: "/pets/dog-ideal-weight-target-calories", icon: "🐶" },
        { title: "Dog Treat Calories & Daily Allowance Calculator", url: "/pets/dog-treat-calories-daily-allowance", icon: "🐶" },
        { title: "Puppy Calorie Needs by Age/Breed Size Calculator", url: "/pets/puppy-calorie-needs-age-breed-size", icon: "💉" },
        { title: "Dog Daily Water Intake Checker", url: "/pets/dog-daily-water-intake-checker", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Dog Protein/Fat Intake Guide (by Goal)" },
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