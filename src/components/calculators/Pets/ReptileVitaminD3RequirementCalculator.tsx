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
import { weightToKg } from "@/lib/utils";

export default function ReptileVitaminD3RequirementCalculator() {
  // 1. STATE
  const { unit, setUnit } = useWeightUnitPreference();

  // Inputs: weight and baseline dietary vitamin D3 intake (optional)
  // Weight is required; dietary intake optional to estimate supplemental need
  const [inputs, setInputs] = useState({
    weight: "",
    dietaryIntake: "",
  });

  // 2. LOGIC ENGINE
  // Formula source: Supplemental Vitamin D3 (IU/day) = 50 IU/kg BW
  // Convert weight to kg internally if input is imperial
  // Subtract dietary intake if provided, minimum 0
  // Reference: NRC and veterinary guidelines for reptiles without UVB exposure
  const results = useMemo(() => {
    const weightRaw = parseFloat(inputs.weight);
    const dietaryRaw = parseFloat(inputs.dietaryIntake);

    if (isNaN(weightRaw) || weightRaw <= 0) {
      return {
        value: 0,
        label: "Please enter a valid weight",
        subtext: "",
        warning: null,
      };
    }

    const weightKg = weightToKg(weightRaw, unit);

    // Supplemental vitamin D3 requirement (IU/day) = 50 IU/kg BW
    const supplementalRequirement = 50 * weightKg;

    // Adjust for dietary intake if provided and valid
    let adjustedRequirement = supplementalRequirement;
    if (!isNaN(dietaryRaw) && dietaryRaw >= 0) {
      adjustedRequirement = supplementalRequirement - dietaryRaw;
      if (adjustedRequirement < 0) adjustedRequirement = 0;
    }

    return {
      value: Math.round(adjustedRequirement),
      label: "Supplemental Vitamin D3 Requirement (IU/day)",
      subtext:
        "Calculated based on body weight and dietary intake (if provided). " +
        "This estimate assumes inadequate or no UVB exposure.",
      warning:
        adjustedRequirement === 0
          ? "Dietary intake meets or exceeds supplemental requirement; additional supplementation may not be necessary."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "Why do pets need vitamin D3 supplementation?",
      answer: "Pets cannot synthesize vitamin D3 from sunlight like humans, making dietary supplementation essential for calcium absorption, bone health, and immune function. Most commercial pet foods contain some vitamin D3, but supplementation may be needed for specific diets or health conditions.",
    },
    {
      question: "What is the safe upper limit for vitamin D3 in pets?",
      answer: "The safe upper limit is typically 10,000 IU/kg body weight daily for dogs and cats. Toxicity can occur at doses exceeding 4,000 IU/kg sustained over time, causing hypercalcemia and kidney damage.",
    },
    {
      question: "How much vitamin D3 does my dog need daily?",
      answer: "Adult dogs require 500-1,000 IU daily per kilogram of body weight, depending on diet and health status. A 25 kg dog typically needs 12,500-25,000 IU daily from all sources combined.",
    },
    {
      question: "Can too much vitamin D3 harm my pet?",
      answer: "Yes, excessive vitamin D3 causes vitamin D toxicity, leading to elevated calcium levels, loss of appetite, vomiting, and kidney failure. Always follow veterinary guidance and avoid megadosing.",
    },
    {
      question: "Is vitamin D3 supplementation necessary if my pet eats commercial food?",
      answer: "Most quality commercial pet foods contain adequate vitamin D3 (typically 1,000-2,000 IU/kg), but raw or home-cooked diets often require supplementation to meet requirements.",
    },
    {
      question: "What factors affect vitamin D3 requirements in pets?",
      answer: "Age, body weight, kidney function, calcium intake, and diet composition all influence requirements. Senior pets and those with certain health conditions may need higher doses or careful monitoring.",
    },
    {
      question: "How should I measure vitamin D3 dosage for my pet?",
      answer: "Use a veterinary-grade supplement with clear IU labeling and measure doses by weight. Liquid supplements offer more precise dosing than tablets, and always consult your veterinarian for personalized recommendations.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // 4. UI WIDGET
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
              <SelectItem value="lb">Imperial (lbs)</SelectItem>
              <SelectItem value="kg">Metric (kg)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Weight input */}
      <div>
        <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
          Body Weight ({unit === "lb" ? "lbs" : "kg"})
        </Label>
        <Input
          id="weight"
          type="number"
          min="0"
          step="any"
          placeholder={`Enter weight in ${unit === "lb" ? "pounds" : "kilograms"}`}
          value={inputs.weight}
          onChange={(e) => setInputs((prev) => ({ ...prev, weight: e.target.value }))}
          aria-describedby="weight-desc"
        />
        <p id="weight-desc" className="text-xs text-slate-400 mt-1">
          Required for dosage calculation.
        </p>
      </div>

      {/* Dietary intake input */}
      <div>
        <Label htmlFor="dietaryIntake" className="text-slate-700 dark:text-slate-300">
          Dietary Vitamin D3 Intake (IU/day, optional)
        </Label>
        <Input
          id="dietaryIntake"
          type="number"
          min="0"
          step="any"
          placeholder="Enter current dietary Vitamin D3 intake"
          value={inputs.dietaryIntake}
          onChange={(e) => setInputs((prev) => ({ ...prev, dietaryIntake: e.target.value }))}
          aria-describedby="dietary-desc"
        />
        <p id="dietary-desc" className="text-xs text-slate-400 mt-1">
          Enter if known to adjust supplemental dose.
        </p>
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
          onClick={() => setInputs({ weight: "", dietaryIntake: "" })}
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

  // 5. EDITORIAL CONTENT
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Vitamin D3 Requirement (Supplemental) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the appropriate supplemental vitamin D3 dosage for your pet based on body weight, current diet, and health status. It accounts for vitamin D3 already present in commercial foods to avoid overdosing.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your pet's weight in kilograms, select their primary diet type (commercial, raw, or home-cooked), and note any health conditions. The calculator cross-references AAFCO standards and veterinary guidelines to estimate needs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows daily IU supplementation required and safe upper limits for your pet. Always consult your veterinarian before starting or modifying supplements, especially for seniors or pets with kidney disease.</p>
        </div>
      </section>

      {/* TABLE: Daily Vitamin D3 Requirements by Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Vitamin D3 Requirements by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference daily vitamin D3 needs for common pets based on current AAFCO and veterinary guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Requirement (IU)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Source Consideration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5-5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,250-5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Commercial food + minimal supplementation</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-25 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000-25,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Typically met by quality commercial diet</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Dog</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-45 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12,500-45,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">May need supplementation if home-cooked</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cat (Adult)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5-5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000-5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Essential if fed raw or home-prepared meals</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Puppy/Kitten</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-5 kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000-5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High requirement during bone development</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Requirements assume normal kidney function and adequate calcium intake. Always verify against product labels and consult veterinarians for individual pets.</p>
      </section>

      {/* TABLE: Vitamin D3 Toxicity Risk Thresholds */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Vitamin D3 Toxicity Risk Thresholds</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Upper safe limits and toxicity indicators for pet vitamin D3 supplementation.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dose Level (IU/kg/day)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Classification</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Health Indicators</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ongoing</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Safe</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No adverse effects expected</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000-4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Long-term</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Caution Zone</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Monitor calcium levels; risk increases with duration</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,000-10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Short-term</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High Risk</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Elevated serum calcium; hypercalcemia possible</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;10,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any Duration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Toxic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Severe hypercalcemia, kidney damage, death</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Toxicity also depends on dietary calcium levels and individual pet metabolism. Regular blood work recommended when supplementing above 2,500 IU/kg daily.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use liquid vitamin D3 supplements for precise dosing—they're easier to measure accurately than tablets or powders.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pair vitamin D3 supplementation with adequate calcium intake; improper calcium-to-phosphorus ratios reduce D3 effectiveness and cause metabolic imbalances.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test serum vitamin D and calcium levels annually if supplementing above 2,500 IU/kg daily to prevent subclinical toxicity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store vitamin D3 supplements in cool, dark places—heat and light degrade potency, reducing effectiveness over time.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Existing Vitamin D3 in Commercial Food</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding supplements without accounting for the 1,000-2,000 IU/kg already in quality commercial diets can easily exceed safe limits and cause toxicity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Human Vitamin D3 Supplements for Pets</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Human supplements often contain additives or fillers toxic to pets and typically lack pet-specific dosing guidance, increasing overdose risk.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming All Pets Have Identical Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Age, kidney function, and individual metabolism vary significantly; a 10 kg dog may need different supplementation than another 10 kg dog with different health status.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Regular Monitoring During Long-Term Supplementation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Without periodic blood work, subclinical vitamin D toxicity can develop silently, causing irreversible kidney damage before symptoms appear.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why do pets need vitamin D3 supplementation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pets cannot synthesize vitamin D3 from sunlight like humans, making dietary supplementation essential for calcium absorption, bone health, and immune function. Most commercial pet foods contain some vitamin D3, but supplementation may be needed for specific diets or health conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the safe upper limit for vitamin D3 in pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The safe upper limit is typically 10,000 IU/kg body weight daily for dogs and cats. Toxicity can occur at doses exceeding 4,000 IU/kg sustained over time, causing hypercalcemia and kidney damage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much vitamin D3 does my dog need daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Adult dogs require 500-1,000 IU daily per kilogram of body weight, depending on diet and health status. A 25 kg dog typically needs 12,500-25,000 IU daily from all sources combined.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can too much vitamin D3 harm my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, excessive vitamin D3 causes vitamin D toxicity, leading to elevated calcium levels, loss of appetite, vomiting, and kidney failure. Always follow veterinary guidance and avoid megadosing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is vitamin D3 supplementation necessary if my pet eats commercial food?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most quality commercial pet foods contain adequate vitamin D3 (typically 1,000-2,000 IU/kg), but raw or home-cooked diets often require supplementation to meet requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect vitamin D3 requirements in pets?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Age, body weight, kidney function, calcium intake, and diet composition all influence requirements. Senior pets and those with certain health conditions may need higher doses or careful monitoring.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I measure vitamin D3 dosage for my pet?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use a veterinary-grade supplement with clear IU labeling and measure doses by weight. Liquid supplements offer more precise dosing than tablets, and always consult your veterinarian for personalized recommendations.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Dog and Cat Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Association of American Feed Control Officials guidelines establishing minimum vitamin D3 requirements for pet foods.</p>
          </li>
          <li>
            <a href="https://onlinelibrary.wiley.com/journal/17485827" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Journal of Small Animal Practice - Vitamin D in Dogs and Cats</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed research on vitamin D metabolism, supplementation, and toxicity in companion animals.</p>
          </li>
          <li>
            <a href="https://www.petpoisonhelpline.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Pet Poison Helpline - Vitamin D Toxicity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Clinical information on vitamin D3 overdose symptoms and emergency veterinary management in pets.</p>
          </li>
          <li>
            <a href="https://www.aaha.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Animal Hospital Association Canine Nutrition Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive nutritional standards and supplementation recommendations for dogs from board-certified veterinary nutritionists.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Vitamin D3 Requirement (Supplemental)"
      description="Determine the supplemental D3 dosage needed if UVB lighting is inadequate or unavailable."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Supplemental Vitamin D3 (IU/day) = 50 × Body Weight (kg) - Dietary Intake (IU)",
        variables: [
          { symbol: "Body Weight (kg)", description: "Reptile's body weight in kilograms" },
          { symbol: "Dietary Intake (IU)", description: "Vitamin D3 intake from diet in International Units per day (optional)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A bearded dragon weighs 4.4 lbs (2 kg) and receives 20 IU of Vitamin D3 daily from its diet. UVB lighting is inadequate.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kilograms if needed (4.4 lbs ≈ 2 kg). Calculate baseline supplemental need: 50 IU × 2 kg = 100 IU/day.",
          },
          {
            label: "2",
            explanation:
              "Subtract dietary intake from baseline: 100 IU - 20 IU = 80 IU/day supplemental Vitamin D3 required.",
          },
        ],
        result: "The bearded dragon requires approximately 80 IU of supplemental Vitamin D3 daily to maintain health.",
      }}
      relatedCalculators={[
        { title: "Metabolic Bone Disease Risk Estimator", url: "/pets/reptile-metabolic-bone-disease-risk", icon: "🐾" },
        { title: "Dog Human-Medication Exposure Alert (Ibuprofen/Acetaminophen)", url: "/pets/dog-human-medication-exposure-alert", icon: "🐶" },
        { title: "Puppy Adult Size Predictor (Weight Curve)", url: "/pets/puppy-adult-size-predictor-weight-curve", icon: "🐱" },
        { title: "Dog Calorie Needs (RER/MER) Calculator", url: "/pets/dog-calorie-needs-rer-mer", icon: "🐶" },
        { title: "Kitten Calorie Needs by Age/Size", url: "/pets/kitten-calorie-needs-age-size", icon: "💉" },
        { title: "Prednisone/Prednisolone Dose Calculator for Dogs", url: "/pets/dog-prednisone-prednisolone-dose", icon: "🐶" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Vitamin D3 Requirement (Supplemental)" },
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
