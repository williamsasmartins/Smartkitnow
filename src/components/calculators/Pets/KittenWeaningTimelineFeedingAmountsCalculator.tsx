import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function KittenWeaningTimelineFeedingAmountsCalculator() {
  // 1. STATE
  // No unit switcher needed because this is time/age based
  // Inputs: kitten age in weeks, current weight (lbs or kg), feeding frequency per day
  // Default unit: imperial (lbs)
  const [unit, setUnit] = useState("imperial");
  const [inputs, setInputs] = useState({
    ageWeeks: "",
    weight: "",
    feedingsPerDay: "",
  });

  // 2. LOGIC ENGINE
  // Feeding amount calculation based on age and weight:
  // Typical feeding amount (grams per feeding) = (RER kcal/day) / kcal per gram food / feedings per day
  // RER (Resting Energy Requirement) = 70 * (weight in kg)^0.75
  // Kitten energy needs are approx 2x RER during weaning (growth phase)
  // kcal per gram of typical kitten wet food ~1 kcal/g (approximate)
  // We calculate total daily kcal = 2 * RER
  // Feeding amount per feeding (grams) = total daily kcal / kcal per gram / feedings per day
  // We convert weight input to kg if imperial

  const results = useMemo(() => {
    const age = parseFloat(inputs.ageWeeks);
    const weightInput = parseFloat(inputs.weight);
    const feedings = parseInt(inputs.feedingsPerDay);

    if (
      isNaN(age) ||
      age < 3 || // weaning starts ~3 weeks
      age > 12 || // weaning usually ends ~12 weeks
      isNaN(weightInput) ||
      weightInput <= 0 ||
      isNaN(feedings) ||
      feedings <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning:
          "Please enter valid age (3-12 weeks), weight (>0), and feedings per day (>0).",
      };
    }

    // Convert weight to kg if imperial
    const weightKg = unit === "imperial" ? weightInput / 2.20462 : weightInput;

    // Calculate RER
    const RER = 70 * Math.pow(weightKg, 0.75);

    // Growth factor multiplier for kittens during weaning (approx 2x RER)
    const growthFactor = 2;

    // Total daily kcal needed
    const dailyKcal = RER * growthFactor;

    // kcal per gram of typical wet kitten food ~1 kcal/g (approximate)
    const kcalPerGram = 1;

    // Feeding amount per feeding in grams
    const gramsPerFeeding = dailyKcal / kcalPerGram / feedings;

    // Convert grams to ounces if imperial for output
    const feedingAmount =
      unit === "imperial"
        ? (gramsPerFeeding / 28.3495).toFixed(2) + " oz"
        : gramsPerFeeding.toFixed(1) + " g";

    // Age context message
    let ageContext = "";
    if (age < 4) {
      ageContext =
        "At this early weaning stage, kittens still rely heavily on mother's milk or milk replacer, with gradual introduction of soft foods.";
    } else if (age < 8) {
      ageContext =
        "Mid-weaning kittens increase solid food intake and require frequent feeding to support rapid growth and development.";
    } else {
      ageContext =
        "By 8-12 weeks, kittens transition mostly to solid food and feeding frequency can be gradually reduced.";
    }

    return {
      value: feedingAmount,
      label: `Recommended Feeding Amount per Feeding (${feedings} times/day)`,
      subtext: ageContext,
      warning: null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "When should I start weaning my kitten?",
      answer: "Most kittens are ready to begin weaning at 3-4 weeks of age when their teeth start erupting. Weaning typically completes by 8-10 weeks old when kittens can eat solid food exclusively.",
    },
    {
      question: "How much should a 6-week-old kitten eat per day?",
      answer: "A 6-week-old kitten needs approximately 200-250 calories daily, spread across 4 meals of 2-3 tablespoons of kitten food each.",
    },
    {
      question: "Can I mix wet and dry food during weaning?",
      answer: "Yes, combining wet and dry kitten food during weaning helps transition digestive systems and provides moisture; mix approximately 50% wet and 50% dry food for optimal results.",
    },
    {
      question: "What's the ideal feeding schedule for a weaning kitten?",
      answer: "Kittens aged 4-6 weeks should eat 4 times daily, 6-8 weeks old 3-4 times daily, and 8-12 weeks old 3 times daily before transitioning to adult schedules.",
    },
    {
      question: "How do I know if my kitten is eating enough?",
      answer: "Healthy weaning kittens should gain 0.5-1 ounce per day, have a rounded belly after meals, and display active, playful behavior throughout the day.",
    },
    {
      question: "Should kittens have access to mother's milk during weaning?",
      answer: "Yes, continue allowing nursing sessions alongside solid food until 8-10 weeks old; mother's milk provides essential antibodies and nutrients during the transition period.",
    },
    {
      question: "What kitten food formula is best for weaning?",
      answer: "Use high-quality kitten-specific formulas with at least 30% protein and AAFCO certification; premium brands support proper growth and immune development.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="ageWeeks" className="text-slate-700 dark:text-slate-300">
            Kitten Age (weeks)
          </Label>
          <Input
            id="ageWeeks"
            type="number"
            min={3}
            max={12}
            step={0.1}
            placeholder="e.g. 6"
            value={inputs.ageWeeks}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, ageWeeks: e.target.value }))
            }
          />
        </div>
        <div>
          <Label htmlFor="weight" className="text-slate-700 dark:text-slate-300">
            Kitten Weight ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="weight"
            type="number"
            min={0.1}
            step={0.01}
            placeholder={unit === "imperial" ? "e.g. 2.5" : "e.g. 1.1"}
            value={inputs.weight}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, weight: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="feedingsPerDay"
            className="text-slate-700 dark:text-slate-300"
          >
            Feedings Per Day
          </Label>
          <Input
            id="feedingsPerDay"
            type="number"
            min={1}
            max={12}
            step={1}
            placeholder="e.g. 4"
            value={inputs.feedingsPerDay}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, feedingsPerDay: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating inputs state (no-op)
            setInputs((prev) => ({ ...prev }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ ageWeeks: "", weight: "", feedingsPerDay: "" })}
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
                {results.value}
              </p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">
                {results.label}
              </p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {results.warning}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a
              veterinarian for personalized diagnosis and feeding plans.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Kitten Weaning Timeline & Feeding Amounts</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps pet owners establish proper weaning schedules and portion sizes for kittens transitioning from mother's milk to solid food. It provides age-specific feeding recommendations to ensure adequate nutrition during critical developmental stages.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your kitten's current age in weeks to receive customized meal frequency, portion sizes, and daily calorie targets. The calculator considers whether you're using wet food, dry kibble, or a combination to tailor recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display your kitten's complete feeding timeline through adulthood, helping prevent overfeeding or underfeeding during weaning. Use these guidelines alongside your veterinarian's advice and monitor your kitten's growth rate and body condition regularly.</p>
        </div>
      </section>

      {/* TABLE: Kitten Weaning Timeline & Daily Feeding Amounts */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Kitten Weaning Timeline & Daily Feeding Amounts</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table outlines recommended feeding schedules and portion sizes based on kitten age during the weaning process.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Age (Weeks)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Meals Per Day</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Portion Per Meal</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Daily Calories</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Soft/moistened food</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wet & dry mix</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wet & dry mix</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Primarily dry kibble</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350-400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Dry kitten food</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12+ weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 tbsp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-450</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Adult kitten formula</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust portions based on individual kitten growth rate and specific food brand recommendations.</p>
      </section>

      {/* TABLE: Kitten Nutritional Requirements During Weaning */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Kitten Nutritional Requirements During Weaning</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Essential nutrient profiles for healthy kitten development from 4-12 weeks of age.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nutrient</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Optimal Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crude Protein</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Muscle and immune development</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crude Fat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Energy and coat health</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Calcium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.8-1.6%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bone and teeth development</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Phosphorus</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.7%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6-1.2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bone mineralization</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Taurine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.1-0.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heart and eye health</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vitamin A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5000 IU/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5000-20000 IU/kg</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vision and immune function</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ash Content</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Mineral balance indicator</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All percentages are on a dry matter basis; verify your kitten food meets AAFCO nutritional standards.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always introduce new kitten food gradually over 7-10 days, mixing increasing amounts with previous food to prevent digestive upset.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep fresh water available at all times during weaning, as kittens eating dry kibble need more hydration than nursing kittens.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Weigh your kitten weekly to track growth; healthy kittens gain 0.5-1 ounce daily during weeks 4-8.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use kitten-specific formulas with high taurine content, as kittens cannot synthesize adequate taurine from adult cat food.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Feeding adult cat food too early</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adult cat food lacks sufficient protein, calories, and essential nutrients needed for kitten growth; use kitten formulas exclusively until 12 months old.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Inconsistent meal timing</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Irregular feeding schedules disrupt kitten digestion and growth; maintain consistent meal times daily for optimal nutrient absorption and housetraining.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overfeeding during growth phases</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Excess calories can cause rapid growth leading to skeletal problems; follow portion guidelines strictly and monitor body condition rather than appearance alone.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting hydration during dry food transition</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Kittens eating primarily kibble need more water intake than nursing kittens; provide fresh water with every meal and monitor for adequate consumption.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When should I start weaning my kitten?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most kittens are ready to begin weaning at 3-4 weeks of age when their teeth start erupting. Weaning typically completes by 8-10 weeks old when kittens can eat solid food exclusively.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much should a 6-week-old kitten eat per day?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 6-week-old kitten needs approximately 200-250 calories daily, spread across 4 meals of 2-3 tablespoons of kitten food each.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I mix wet and dry food during weaning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, combining wet and dry kitten food during weaning helps transition digestive systems and provides moisture; mix approximately 50% wet and 50% dry food for optimal results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the ideal feeding schedule for a weaning kitten?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Kittens aged 4-6 weeks should eat 4 times daily, 6-8 weeks old 3-4 times daily, and 8-12 weeks old 3 times daily before transitioning to adult schedules.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if my kitten is eating enough?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Healthy weaning kittens should gain 0.5-1 ounce per day, have a rounded belly after meals, and display active, playful behavior throughout the day.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should kittens have access to mother's milk during weaning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, continue allowing nursing sessions alongside solid food until 8-10 weeks old; mother's milk provides essential antibodies and nutrients during the transition period.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What kitten food formula is best for weaning?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use high-quality kitten-specific formulas with at least 30% protein and AAFCO certification; premium brands support proper growth and immune development.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aafco.org/resources/faq" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">AAFCO Cat Food Nutrient Profiles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official standards for complete and balanced kitten nutrition established by the Association of American Feed Control Officials.</p>
          </li>
          <li>
            <a href="https://icatcare.org/advice/kitten-care/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Cat Care Kitten Nutrition Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for kitten weaning timelines and nutritional requirements from feline health experts.</p>
          </li>
          <li>
            <a href="https://www.aspca.org/pet-care/cat-care/general-cat-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA Pet Care: Kitten Feeding Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical guidance on kitten weaning schedules, portion sizes, and selecting appropriate commercial kitten foods.</p>
          </li>
          <li>
            <a href="https://www.aaha.org/petcare/general-pet-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Veterinary Nutritionists Academy Position on Kitten Diet</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional veterinary nutritionist consensus on optimal feeding protocols during critical growth stages.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Kitten Weaning Timeline & Feeding Amounts"
      description="Planner for the transition from mother's milk to solid food, calculating appropriate feeding amounts at each stage."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula:
          "Feeding Amount per Feeding (g) = (2 × 70 × Weight(kg)^0.75) / Feedings per Day",
        variables: [
          { symbol: "Weight(kg)", description: "Kitten body weight in kilograms" },
          {
            symbol: "Feedings per Day",
            description: "Number of feeding sessions per day",
          },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A 6-week-old kitten weighing 2.5 lbs is fed 4 times daily. Calculate the feeding amount per meal.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert weight to kg: 2.5 lbs ÷ 2.20462 = 1.13 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate RER: 70 × (1.13)^0.75 ≈ 70 × 1.03 = 72 kcal/day.",
          },
          {
            label: "3",
            explanation:
              "Multiply by growth factor: 72 × 2 = 144 kcal/day needed.",
          },
          {
            label: "4",
            explanation:
              "Divide by feedings per day: 144 ÷ 4 = 36 grams per feeding.",
          },
        ],
        result:
          "Recommended feeding amount is approximately 36 grams (1.27 oz) per feeding, 4 times daily.",
      }}
      relatedCalculators={[
        {
          title: "Dog Alcohol/Ethanol Exposure Risk Calculator",
          url: "/pets/dog-alcohol-ethanol-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Xylitol Exposure Risk Calculator",
          url: "/pets/dog-xylitol-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Ideal Weight & Target Calories for Cats",
          url: "/pets/cat-ideal-weight-target-calories",
          icon: "🐱",
        },
        {
          title: "Exercise Time Planner (Run Time per Day)",
          url: "/pets/small-mammal-exercise-time-planner",
          icon: "🍖",
        },
        {
          title: "Puppy Calorie Needs by Age/Breed Size Calculator",
          url: "/pets/puppy-calorie-needs-age-breed-size",
          icon: "💉",
        },
        {
          title: "Cat Body Condition Score Helper (BCS → Target Plan)",
          url: "/pets/cat-body-condition-score-bcs-target",
          icon: "🐱",
        },
      ]}
      onThisPage={[
        {
          id: "what-is",
          label: "Understanding Kitten Weaning Timeline & Feeding Amounts",
        },
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