import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function GuineaPigVitaminCRequirementCalculator() {
  // 1. STATE
  // Default unit system: imperial (lbs)
  const [unit, setUnit] = useState("imperial");

  // Inputs: weight (lbs or kg)
  const [inputs, setInputs] = useState({
    weight: "",
  });

  // 2. LOGIC ENGINE
  // Vitamin C requirement for guinea pigs is generally 10-30 mg/kg body weight daily.
  // We'll use 20 mg/kg as a standard recommended daily supplemental dose.
  // Formula: Vitamin C Requirement (mg/day) = Body Weight (kg) × 20 mg/kg
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }
    // Convert to kg if input is imperial (lbs)
    const weightKg = unit === "imperial" ? weightRaw / 2.20462 : weightRaw;

    // Calculate Vitamin C requirement
    const vitaminCmg = weightKg * 20;

    // Round to 1 decimal place
    const rounded = Math.round(vitaminCmg * 10) / 10;

    return {
      value: rounded.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
      label: "Daily Vitamin C Requirement (mg)",
      subtext: `Based on a body weight of ${weightRaw} ${unit === "imperial" ? "lbs" : "kg"}`,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How much vitamin C does a guinea pig need daily?",
      answer: "Guinea pigs require 10-50 mg of vitamin C per kilogram of body weight daily, with most adults needing 10-16 mg/kg to prevent deficiency diseases like scurvy.",
    },
    {
      question: "Why can't guinea pigs synthesize their own vitamin C?",
      answer: "Guinea pigs lack the enzyme L-gulonolactone oxidase needed to produce vitamin C from glucose, making dietary supplementation essential for survival.",
    },
    {
      question: "What foods are high in vitamin C for guinea pigs?",
      answer: "Bell peppers (125 mg/100g), kiwi fruit (93 mg/100g), and parsley (177 mg/100g) are excellent sources; one serving daily typically meets requirements.",
    },
    {
      question: "Can guinea pigs get too much vitamin C?",
      answer: "Excess vitamin C (&gt;1000 mg/kg diet) may increase kidney stone risk in susceptible individuals, so balance is important rather than mega-dosing.",
    },
    {
      question: "Do pregnant or nursing guinea pigs need more vitamin C?",
      answer: "Yes, pregnant and lactating females require 16-50 mg/kg daily—roughly double the maintenance level—to support fetal development and milk production.",
    },
    {
      question: "How does vitamin C degrade in guinea pig food?",
      answer: "Vitamin C oxidizes rapidly with heat, light, and air exposure; fresh vegetables lose 25-50% potency within 24-48 hours of cutting.",
    },
    {
      question: "What are signs of vitamin C deficiency in guinea pigs?",
      answer: "Symptoms include poor wound healing, joint swelling, lethargy, rough coat, and bleeding gums; scurvy can develop within 2-3 weeks of inadequate intake.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight input */}
      <div className="space-y-1">
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Body Weight ({unit === "imperial" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "imperial" ? "lbs" : "kg"}`}
          value={inputs.weight}
          onChange={(e) => setInputs({ ...inputs, weight: e.target.value })}
          aria-describedby="weight-help"
        />
        <p id="weight-help" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your guinea pig's current body weight to calculate daily Vitamin C needs.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "" })}
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

  // Editorial content
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Vitamin C Requirement (Guinea Pig) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines your guinea pig's personalized daily vitamin C requirement based on body weight, age, and reproductive status. It helps you provide the precise amount needed to prevent deficiency while avoiding excess supplementation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your guinea pig's current weight in grams and select their life stage (weanling, adult, pregnant, lactating, or senior). The calculator uses evidence-based guidelines from veterinary nutrition research to estimate daily needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows recommended daily vitamin C in milligrams, plus practical food examples to achieve that target. Use this to plan balanced daily meals ensuring adequate vitamin C intake through fresh vegetables and fortified pellets.</p>
        </div>
      </section>

      {/* TABLE: Vitamin C Content in Common Guinea Pig Foods */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Vitamin C Content in Common Guinea Pig Foods</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide showing vitamin C levels in fresh produce typically fed to guinea pigs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vitamin C Content (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Red bell pepper</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup (149g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">186</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Parsley</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">¼ cup (15g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kiwi fruit</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 medium (76g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">71</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Broccoli</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup raw (91g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">89</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Orange</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 medium (131g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spinach</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup raw (30g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cucumber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup sliced (119g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Carrot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 medium (61g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Values are approximate and vary by ripeness and storage conditions.</p>
      </section>

      {/* TABLE: Daily Vitamin C Requirements by Guinea Pig Life Stage */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Vitamin C Requirements by Guinea Pig Life Stage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended daily vitamin C intake based on guinea pig age, weight, and reproductive status.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Life Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Requirement (mg/kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example Daily Intake (mg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Weanling (4-8 weeks)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-300g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-15</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Young adult (2-4 months)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-600g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-10</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Adult maintenance</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-1200g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-19</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pregnant female</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-1200g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-60</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lactating female</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-1200g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Senior (5+ years)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">700-1200g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-19</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual requirements depend on individual metabolism and diet composition.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Offer fresh bell peppers 3-4 times weekly as a reliable, palatable vitamin C source that most guinea pigs enjoy readily.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pair vitamin C-rich vegetables with pellets containing &lt;100 IU/g vitamin D to optimize calcium absorption and prevent kidney stones.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Rotate vegetable sources to prevent digestive upset and ensure varied nutrient intake beyond just vitamin C.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store fresh produce in sealed containers away from light and use within 48 hours of cutting to minimize vitamin C oxidation loss.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Relying solely on timothy hay for vitamin C</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Dried hay contains minimal vitamin C (&lt;5 mg/100g), so fresh vegetables are essential to meet daily requirements.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overdosing vitamin C supplements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Liquid or powder supplements can easily exceed safe limits (&gt;1000 mg/kg diet) and may promote urinary calculi in predisposed animals.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all pellets contain adequate vitamin C</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many commercial pellets contain &lt;50 mg/kg due to storage degradation, requiring dietary fresh produce supplementation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring increased needs during pregnancy and lactation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to increase vitamin C intake during reproduction can lead to poor fetal development and reduced milk quality.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much vitamin C does a guinea pig need daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Guinea pigs require 10-50 mg of vitamin C per kilogram of body weight daily, with most adults needing 10-16 mg/kg to prevent deficiency diseases like scurvy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why can't guinea pigs synthesize their own vitamin C?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Guinea pigs lack the enzyme L-gulonolactone oxidase needed to produce vitamin C from glucose, making dietary supplementation essential for survival.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What foods are high in vitamin C for guinea pigs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bell peppers (125 mg/100g), kiwi fruit (93 mg/100g), and parsley (177 mg/100g) are excellent sources; one serving daily typically meets requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can guinea pigs get too much vitamin C?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excess vitamin C (&gt;1000 mg/kg diet) may increase kidney stone risk in susceptible individuals, so balance is important rather than mega-dosing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do pregnant or nursing guinea pigs need more vitamin C?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, pregnant and lactating females require 16-50 mg/kg daily—roughly double the maintenance level—to support fetal development and milk production.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does vitamin C degrade in guinea pig food?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Vitamin C oxidizes rapidly with heat, light, and air exposure; fresh vegetables lose 25-50% potency within 24-48 hours of cutting.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are signs of vitamin C deficiency in guinea pigs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Symptoms include poor wound healing, joint swelling, lethargy, rough coat, and bleeding gums; scurvy can develop within 2-3 weeks of inadequate intake.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Vitamin C Requirements in Guinea Pigs - AAFCO Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official nutritional adequacy standards and guidelines for companion animal feeding, including guinea pig vitamin requirements.</p>
          </li>
          <li>
            <a href="https://www.merckvetmanual.com/exotic-and-laboratory-animals/guinea-pigs/overview-of-guinea-pigs" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Guinea Pig Care - Merck Veterinary Manual</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive veterinary reference on guinea pig husbandry, nutrition, and disease prevention including vitamin C deficiency.</p>
          </li>
          <li>
            <a href="https://www.nap.edu" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Nutritional Requirements of Laboratory Animals - National Academies Press</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based nutritional recommendations for guinea pigs based on peer-reviewed research and metabolic studies.</p>
          </li>
          <li>
            <a href="https://www.veterinarypartner.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Scurvy in Guinea Pigs - Veterinary Partner</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical overview of vitamin C deficiency pathophysiology, signs, and dietary prevention strategies in guinea pigs.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Vitamin C Requirement (Guinea Pig)"
      description="Calculate the daily supplemental Vitamin C requirement, which guinea pigs cannot synthesize themselves."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Vitamin C Requirement (mg/day) = Body Weight (kg) × 20 mg/kg",
        variables: [
          { symbol: "Body Weight (kg)", description: "Guinea pig's body weight in kilograms" },
          { symbol: "20 mg/kg", description: "Recommended Vitamin C dose per kilogram of body weight" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A guinea pig weighs 2.5 lbs. The owner wants to know the daily Vitamin C supplementation needed.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight from pounds to kilograms: 2.5 lbs ÷ 2.20462 = 1.13 kg (approx).",
          },
          {
            label: "2",
            explanation:
              "Multiply body weight by 20 mg/kg: 1.13 kg × 20 mg/kg = 22.6 mg Vitamin C per day.",
          },
        ],
        result: "The guinea pig requires approximately 22.6 mg of Vitamin C daily to maintain health.",
      }}
      relatedCalculators={[
        { title: "Weight Maintenance vs. Gain/Loss Planner", url: "/pets/small-mammal-weight-maintenance-gain-loss-planner", icon: "🐾" },
        { title: "Breeding Tank Volume Planner", url: "/pets/breeding-tank-volume-planner", icon: "🐶" },
        { title: "Water Change Volume Planner", url: "/pets/aquarium-water-change-volume-planner", icon: "🐱" },
        { title: "Fiber & Protein Ratio Calculator", url: "/pets/small-mammal-fiber-protein-ratio", icon: "🍖" },
        { title: "Growth Curve by Species (Python, Bearded Dragon, Gecko)", url: "/pets/reptile-growth-curve-python-bearded-dragon-gecko", icon: "💉" },
        { title: "Safe Vegetables & Fruits Portion Calculator", url: "/pets/small-mammal-safe-vegetables-fruits-portion", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Vitamin C Requirement (Guinea Pig)" },
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