import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function BirdSeedToPelletConversionPlannerCalculator() {
  // 1. STATE
  // Unit system needed for weight inputs
  const [unit, setUnit] = useState("imperial");

  // Inputs: Bird weight, current % seed diet, target % pellet diet, conversion duration (weeks)
  const [inputs, setInputs] = useState({
    weight: "",
    currentSeedPercent: "",
    targetPelletPercent: "",
    durationWeeks: "",
  });

  // 2. LOGIC ENGINE
  // Formula logic:
  // Daily pellet increase per week (%) = (Target Pellet % - (100 - Current Seed %)) / Duration (weeks)
  // This gives a gradual weekly increase in pellet % replacing seed %
  // Result: Weekly pellet % increment to plan conversion

  const results = useMemo(() => {
    const weightNum = parseFloat(inputs.weight);
    const currentSeedNum = parseFloat(inputs.currentSeedPercent);
    const targetPelletNum = parseFloat(inputs.targetPelletPercent);
    const durationNum = parseFloat(inputs.durationWeeks);

    if (
      isNaN(weightNum) ||
      isNaN(currentSeedNum) ||
      isNaN(targetPelletNum) ||
      isNaN(durationNum) ||
      weightNum <= 0 ||
      currentSeedNum < 0 ||
      currentSeedNum > 100 ||
      targetPelletNum < 0 ||
      targetPelletNum > 100 ||
      durationNum <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input values",
        subtext: "Please enter valid positive numbers within range.",
        warning: "Ensure percentages are between 0 and 100 and duration is positive.",
      };
    }

    // Calculate weekly pellet increase %
    // Current pellet % = 100 - currentSeedPercent
    const currentPelletPercent = 100 - currentSeedNum;
    if (targetPelletNum < currentPelletPercent) {
      return {
        value: 0,
        label: "Target pellet % must be higher than current pellet %",
        subtext: "Conversion should increase pellet proportion gradually.",
        warning: "Target pellet % should exceed current pellet % for conversion.",
      };
    }

    const weeklyPelletIncrease = (targetPelletNum - currentPelletPercent) / durationNum;

    // Round to 2 decimals
    const weeklyIncreaseRounded = Math.round(weeklyPelletIncrease * 100) / 100;

    return {
      value: weeklyIncreaseRounded,
      label: "Weekly Pellet Increase (%)",
      subtext: `Increase pellet proportion by this percent each week over ${durationNum} weeks.`,
      warning: null,
    };
  }, [inputs]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How many pellets equal one seed portion for small birds?",
      answer: "Typically, 1 tablespoon of seeds converts to approximately 2-3 tablespoons of pellets due to pellet density and water content differences.",
    },
    {
      question: "Why should I convert seeds to pellets for my pet bird?",
      answer: "Pellets provide balanced nutrition with consistent vitamin and mineral content, whereas seeds are high in fat and lack essential nutrients like calcium and vitamin A.",
    },
    {
      question: "Can I use this calculator for all bird species?",
      answer: "This calculator works best for small to medium parrots, finches, and canaries; large macaws and specialized species may need species-specific adjustments.",
    },
    {
      question: "How long does a seed-to-pellet dietary transition typically take?",
      answer: "A gradual 4-6 week transition mixing increasing pellet ratios prevents digestive upset and encourages acceptance of the new diet.",
    },
    {
      question: "What conversion ratio should I use for sunflower seeds versus pellets?",
      answer: "Sunflower seeds convert at approximately 1:2.5 ratio (1 cup seeds ≈ 2.5 cups pellets) due to higher oil content and lower water density.",
    },
    {
      question: "Do different pellet brands require different conversion amounts?",
      answer: "Yes, pellet density varies by brand; premium pellets may require 10-15% less volume than budget brands to deliver equivalent nutrition.",
    },
    {
      question: "How do I account for treats when converting seed portions to pellets?",
      answer: "Treats should comprise no more than 10% of daily calories; subtract treat calories before calculating required pellet portions using this converter.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. HANDLERS
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
              <SelectItem value="imperial">Imperial (lbs)</SelectItem>
              <SelectItem value="metric">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Bird Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            name="weight"
            type="text"
            inputMode="decimal"
            value={inputs.weight}
            onChange={handleInputChange}
            placeholder={unit === "imperial" ? "e.g. 1.5" : "e.g. 0.68"}
          />
        </div>
        <div>
          <Label htmlFor="currentSeedPercent" className="text-slate-700 dark:text-slate-300">
            Current Seed Diet Percentage (%)
          </Label>
          <Input
            id="currentSeedPercent"
            name="currentSeedPercent"
            type="text"
            inputMode="decimal"
            value={inputs.currentSeedPercent}
            onChange={handleInputChange}
            placeholder="e.g. 80"
          />
        </div>
        <div>
          <Label htmlFor="targetPelletPercent" className="text-slate-700 dark:text-slate-300">
            Target Pellet Diet Percentage (%)
          </Label>
          <Input
            id="targetPelletPercent"
            name="targetPelletPercent"
            type="text"
            inputMode="decimal"
            value={inputs.targetPelletPercent}
            onChange={handleInputChange}
            placeholder="e.g. 80"
          />
        </div>
        <div>
          <Label htmlFor="durationWeeks" className="text-slate-700 dark:text-slate-300">
            Conversion Duration (weeks)
          </Label>
          <Input
            id="durationWeeks"
            name="durationWeeks"
            type="text"
            inputMode="decimal"
            value={inputs.durationWeeks}
            onChange={handleInputChange}
            placeholder="e.g. 6"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation (already reactive)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ weight: "", currentSeedPercent: "", targetPelletPercent: "", durationWeeks: "" })}
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
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider">Estimated Result</p>
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}%</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Seed-to-Pellet Conversion Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator converts your bird's current seed portions into nutritionally equivalent pellet amounts, accounting for differences in density, water content, and caloric concentration between seed and pellet diets.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your bird species, current daily seed consumption (in cups or tablespoons), and preferred pellet brand to receive customized conversion ratios that maintain consistent caloric and nutritional intake.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the recommended pellet portions and transition timeline, which guides you through a gradual dietary change over 4-6 weeks to prevent digestive stress while establishing healthier eating habits.</p>
        </div>
      </section>

      {/* TABLE: Seed-to-Pellet Conversion Ratios by Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Seed-to-Pellet Conversion Ratios by Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference standard conversion ratios for common seed types to premium pellets.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Seed Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Seed Volume</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pellet Equivalent</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Caloric Density</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sunflower Seeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 cups pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">487 kcal/cup</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Millet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8 cups pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">380 kcal/cup</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Safflower Seeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.2 cups pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">465 kcal/cup</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Niger/Nyjer Seeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.9 cups pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">450 kcal/cup</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mixed Seeds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.1 cups pellets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420 kcal/cup</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Conversion ratios based on premium pellet density; budget pellets may require 10-15% additional volume.</p>
      </section>

      {/* TABLE: Daily Pellet Requirements by Bird Species */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Pellet Requirements by Bird Species</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended daily pellet intake for common pet bird species.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Body Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Pellet Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approximate Daily Kcal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cockatiel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-120g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-120</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Parakeet (Budgie)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-40g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Finch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 tsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Conure</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-180g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-180</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Amazon Parrot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-350g</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-280</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Amounts vary by individual metabolism and activity level; adjust based on bird's weight and body condition.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Start the transition by replacing 25% of seeds with pellets weekly to allow your bird's digestive system to adapt gradually.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store pellets in airtight containers away from moisture and sunlight to maintain nutritional integrity and prevent mold growth.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your bird monthly during conversion to ensure it maintains healthy body weight as dietary macronutrient ratios change.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine pellets with fresh vegetables like leafy greens and carrots to supplement vitamin A that seeds provided but pellets may lack.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Cold Turkey Diet Switch</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Abruptly replacing all seeds with pellets causes digestive upset and may lead to hunger strikes; always transition gradually over weeks.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated Seed Portions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Seeds stored for &gt;6 months lose nutritional value and oils turn rancid, skewing conversion calculations; use fresh seeds as baseline.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Species-Specific Needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Large parrots require different pellet brands and portions than small finches; this calculator provides species adjustments for accuracy.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Treat Calories</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Treats and human food snacks add calories beyond pellet calculations; failing to adjust portions can cause obesity in sedentary pet birds.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many pellets equal one seed portion for small birds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Typically, 1 tablespoon of seeds converts to approximately 2-3 tablespoons of pellets due to pellet density and water content differences.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why should I convert seeds to pellets for my pet bird?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pellets provide balanced nutrition with consistent vitamin and mineral content, whereas seeds are high in fat and lack essential nutrients like calcium and vitamin A.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all bird species?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator works best for small to medium parrots, finches, and canaries; large macaws and specialized species may need species-specific adjustments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does a seed-to-pellet dietary transition typically take?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A gradual 4-6 week transition mixing increasing pellet ratios prevents digestive upset and encourages acceptance of the new diet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What conversion ratio should I use for sunflower seeds versus pellets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sunflower seeds convert at approximately 1:2.5 ratio (1 cup seeds ≈ 2.5 cups pellets) due to higher oil content and lower water density.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do different pellet brands require different conversion amounts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, pellet density varies by brand; premium pellets may require 10-15% less volume than budget brands to deliver equivalent nutrition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for treats when converting seed portions to pellets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Treats should comprise no more than 10% of daily calories; subtract treat calories before calculating required pellet portions using this converter.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Pet Food Nutrient Profiles for Birds</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official nutrient standards for commercial bird pellet formulations and dietary requirements.</p>
          </li>
          <li>
            <a href="https://www.vin.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Veterinary Information Network – Avian Nutrition</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based veterinary guidance on transitioning captive birds from seeds to pellets safely.</p>
          </li>
          <li>
            <a href="https://www.aav.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Association of Avian Veterinarians – Diet Resources</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional avian veterinary recommendations for optimal pellet selection and dietary planning.</p>
          </li>
          <li>
            <a href="https://www.birds.cornell.edu" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cornell Lab of Ornithology – Bird Diet Fact Sheets</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive reference data on nutritional composition and seed-to-pellet conversion science.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Seed-to-Pellet Conversion Planner"
      description="Plan a gradual conversion schedule from a seed-based diet to a healthier, complete pellet diet."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Weekly Pellet Increase (%) = (Target Pellet % - Current Pellet %) ÷ Duration (weeks)",
        variables: [
          { symbol: "Target Pellet %", description: "Desired pellet proportion in diet" },
          { symbol: "Current Pellet %", description: "Current pellet proportion in diet (100 - seed %)" },
          { symbol: "Duration (weeks)", description: "Number of weeks for conversion" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A parakeet currently eating 80% seed diet (20% pellets) weighing 1.5 lbs is planned to be converted to 80% pellet diet over 6 weeks.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate current pellet %: 100 - 80 = 20%. Target pellet % is 80%. Duration is 6 weeks.",
          },
          {
            label: "2",
            explanation:
              "Apply formula: (80 - 20) ÷ 6 = 10% weekly pellet increase.",
          },
          {
            label: "3",
            explanation:
              "Each week, increase pellet proportion by 10% while reducing seed proportion accordingly.",
          },
        ],
        result: "The bird’s diet should be adjusted weekly by increasing pellets by 10% to reach 80% pellets in 6 weeks.",
      }}
      relatedCalculators={[
        { title: "Dog Age in Human Years (Breed-Aware)", url: "/pets/dog-age-human-years-breed-aware", icon: "🐶" },
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Pond Volume & Liner Size Calculator", url: "/pets/pond-volume-liner-size", icon: "🐱" },
        { title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)", url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk", icon: "🍖" },
        { title: "Kitten Weaning Timeline & Feeding Amounts", url: "/pets/kitten-weaning-timeline-feeding-amounts", icon: "💉" },
        { title: "Cat Treat Calories & Daily Allowance", url: "/pets/cat-treat-calories-daily-allowance", icon: "🐱" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Seed-to-Pellet Conversion Planner" },
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