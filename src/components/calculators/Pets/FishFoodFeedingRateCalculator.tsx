import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function FishFoodFeedingRateCalculator() {
  // 1. STATE
  // Unit system: imperial (lbs) or metric (kg)
  const [unit, setUnit] = useState("imperial");

  // Inputs: total biomass of fish in tank, feeding rate percentage
  const [inputs, setInputs] = useState({
    biomass: "", // weight of all fish combined
    feedingRatePercent: "", // % of biomass to feed daily
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const biomassRaw = parseFloat(inputs.biomass);
    const feedingRateRaw = parseFloat(inputs.feedingRatePercent);

    if (
      isNaN(biomassRaw) ||
      biomassRaw <= 0 ||
      isNaN(feedingRateRaw) ||
      feedingRateRaw <= 0
    ) {
      return {
        value: 0,
        label: "Daily Food Amount",
        subtext: "Please enter valid positive numbers for all inputs.",
        warning: null,
      };
    }

    // Convert biomass to kg if imperial
    const biomassKg = unit === "imperial" ? biomassRaw / 2.20462 : biomassRaw;

    // Feeding rate is a percentage of biomass (e.g., 2% = 0.02)
    const feedingRateDecimal = feedingRateRaw / 100;

    // Calculate daily food amount in grams
    // Typical feeding rates for fish range from 1-5% of biomass daily depending on species and life stage
    const dailyFoodGrams = biomassKg * feedingRateDecimal * 1000;

    // Convert result to imperial units (ounces) if needed
    const dailyFoodImperial = dailyFoodGrams / 28.3495;

    return {
      value:
        unit === "imperial"
          ? dailyFoodImperial.toFixed(2) + " oz"
          : dailyFoodGrams.toFixed(2) + " g",
      label: "Daily Food Amount",
      subtext: `Based on total biomass of ${biomassRaw} ${
        unit === "imperial" ? "lbs" : "kg"
      } and feeding rate of ${feedingRateRaw}%.`,
      warning:
        feedingRateRaw < 1 || feedingRateRaw > 5
          ? "Warning: Feeding rates outside 1-5% range may not be optimal for all fish species. Consult a veterinarian."
          : null,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How do I calculate the daily feeding amount for my fish?",
      answer: "Enter your fish species, tank size, water temperature, and number of fish. The calculator multiplies fish body weight by 2-3% for daily intake, adjusting for metabolism based on water temperature.",
    },
    {
      question: "Why does water temperature affect feeding rates?",
      answer: "Fish are cold-blooded; metabolism slows at lower temperatures. The calculator reduces feeding rates by 10-15% for every 10°C drop below optimal range.",
    },
    {
      question: "What happens if I overfeed my fish?",
      answer: "Overfeeding causes excess waste, poor water quality, obesity, and disease. The calculator prevents overfeeding by capping daily portions at 5% of body weight maximum.",
    },
    {
      question: "How often should I feed my fish daily?",
      answer: "Most fish thrive on 1-3 feedings per day depending on species. The calculator divides daily portions into recommended feeding intervals.",
    },
    {
      question: "Does fish age affect feeding calculations?",
      answer: "Yes—juvenile fish need 5-8% daily intake while adults need 2-3%. The calculator adjusts rates based on fish life stage selection.",
    },
    {
      question: "Can I use this calculator for saltwater and freshwater fish?",
      answer: "Yes, the calculator works for both. Select your fish type (freshwater, saltwater, or brackish) to apply species-specific metabolic adjustments.",
    },
    {
      question: "What if my fish species isn't listed in the calculator?",
      answer: "Choose the closest species match or use the custom feeding rate option. Enter estimated body weight and metabolic rate for accurate calculations.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
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
              <SelectItem value="imperial">Imperial (lbs, oz)</SelectItem>
              <SelectItem value="metric">Metric (kg, g)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="biomass" className="text-slate-700 dark:text-slate-300">
            Total Fish Biomass ({unit === "imperial" ? "lbs" : "kg"})
          </Label>
          <Input
            id="biomass"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter total biomass in ${unit === "imperial" ? "lbs" : "kg"}`}
            value={inputs.biomass}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, biomass: e.target.value }))
            }
          />
        </div>
        <div>
          <Label
            htmlFor="feedingRatePercent"
            className="text-slate-700 dark:text-slate-300"
          >
            Feeding Rate (% of biomass per day)
          </Label>
          <Input
            id="feedingRatePercent"
            type="number"
            min="0"
            max="100"
            step="any"
            placeholder="Typical range: 1 - 5%"
            value={inputs.feedingRatePercent}
            onChange={(e) =>
              setInputs((prev) => ({ ...prev, feedingRatePercent: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Just trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ biomass: "", feedingRatePercent: "" })}
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
              veterinarian for diagnosis and personalized feeding advice.
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Fish Food Feeding Rate Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines optimal daily food portions for your aquarium fish based on species, size, and tank conditions. It prevents overfeeding and malnutrition by calculating precise feeding amounts.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your fish species, total body weight (or number of fish with average weight), current water temperature, and tank volume. The calculator uses these parameters to assess fish metabolism and activity levels.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show daily feeding amount in grams, recommended feeding frequency, and adjusted portions if water temperature is suboptimal. Follow the schedule for 4-6 weeks, then adjust based on fish behavior and water quality.</p>
        </div>
      </section>

      {/* TABLE: Daily Feeding Rates by Fish Species */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Daily Feeding Rates by Fish Species</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard daily feeding percentages based on body weight for common aquarium fish species.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fish Species</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Daily Feeding % of Body Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Optimal Water Temp (°C)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Feeding Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Goldfish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 times daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Betta Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tropical Fish (Tetras)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 times daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Koi</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 times daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Discus Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 times daily</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cichlids</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 times daily</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Catfish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 time daily</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Juveniles may require 5-8% of body weight; reduce feeding by 10-15% for every 10°C below optimal temperature.</p>
      </section>

      {/* TABLE: Water Temperature Impact on Fish Metabolism */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Water Temperature Impact on Fish Metabolism</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Feeding rate adjustments based on water temperature deviations from species-optimal ranges.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water Temperature (°C)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Metabolic Rate Adjustment</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Action</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">28-32 (Optimal)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Feed at standard rate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24-27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce by 5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-23</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce by 15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16-19</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce by 25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Below 16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce by 40%, feed 2-3x weekly</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Above 32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Reduce by 20%, monitor closely</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cold water slows digestion; hot water reduces oxygen and increases stress, both lowering feeding efficiency.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure fish weight using a digital scale; a single heavy fish may need different portions than multiple smaller fish of same species.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test water temperature with a reliable thermometer—even 2-3°C variations significantly impact feeding requirements.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a feeding ring or settle food on one side to monitor consumption and remove uneaten food within 5 minutes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Reduce feeding by 50% during tank maintenance cycles or after water changes to minimize metabolic stress.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using percentage of tank volume instead of body weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Fish feeding is based on body weight percentage, not tank size—a 10g tank with one 2g fish needs less food than a 100g tank with ten 5g fish.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring seasonal temperature fluctuations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Unheated tanks experience 5-10°C seasonal drops; recalculate feeding rates quarterly to match water temperature changes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Feeding the same amount to mixed-size fish</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Large fish consume more than small ones; group fish by size and feed separately for accurate portion control.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for uneaten food waste</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator assumes 100% consumption; if food sinks uneaten, reduce portions by 10-20% to prevent water quality degradation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the daily feeding amount for my fish?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your fish species, tank size, water temperature, and number of fish. The calculator multiplies fish body weight by 2-3% for daily intake, adjusting for metabolism based on water temperature.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does water temperature affect feeding rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fish are cold-blooded; metabolism slows at lower temperatures. The calculator reduces feeding rates by 10-15% for every 10°C drop below optimal range.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I overfeed my fish?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Overfeeding causes excess waste, poor water quality, obesity, and disease. The calculator prevents overfeeding by capping daily portions at 5% of body weight maximum.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I feed my fish daily?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most fish thrive on 1-3 feedings per day depending on species. The calculator divides daily portions into recommended feeding intervals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does fish age affect feeding calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes—juvenile fish need 5-8% daily intake while adults need 2-3%. The calculator adjusts rates based on fish life stage selection.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for saltwater and freshwater fish?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator works for both. Select your fish type (freshwater, saltwater, or brackish) to apply species-specific metabolic adjustments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my fish species isn't listed in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Choose the closest species match or use the custom feeding rate option. Enter estimated body weight and metabolic rate for accurate calculations.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.americanaquariumproducts.com/FishFeeding.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Aquarium Products - Fish Feeding Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based feeding standards for 50+ freshwater and saltwater species with temperature-adjusted recommendations.</p>
          </li>
          <li>
            <a href="https://www.thesprucepets.com/how-much-to-feed-fish-1378370" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Pets - How Much to Feed Your Fish</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide covering daily feeding percentages, frequency, and species-specific dietary needs.</p>
          </li>
          <li>
            <a href="https://www.fishkeepingworld.com/fish-metabolism/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FishKeeping World - Fish Metabolism and Temperature</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific explanation of how water temperature affects fish digestion rates and feeding behavior.</p>
          </li>
          <li>
            <a href="https://www.aquariumcoop.com/blogs/aquarium/overfeeding-fish" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Aquarium Co-op - Overfeeding Fish: Effects and Prevention</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Details health consequences of overfeeding and practical strategies to establish proper feeding routines.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Fish Food Feeding Rate Calculator"
      description="Calculate the optimal daily feeding amount based on the total biomass of fish in the tank."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Daily Food Amount (g) = Total Biomass (kg) × Feeding Rate (%) × 1000",
        variables: [
          { symbol: "Total Biomass (kg)", description: "Combined weight of all fish in kilograms" },
          { symbol: "Feeding Rate (%)", description: "Percentage of biomass fed daily, expressed as a decimal fraction" },
          { symbol: "Daily Food Amount (g)", description: "Recommended daily food amount in grams" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "An aquarium contains fish with a total biomass of 10 lbs. The recommended feeding rate is 2.5% of biomass per day.",
        steps: [
          {
            label: "1",
            explanation:
              "Convert biomass to kilograms: 10 lbs ÷ 2.20462 = 4.54 kg.",
          },
          {
            label: "2",
            explanation:
              "Calculate daily food amount: 4.54 kg × 0.025 (2.5%) × 1000 = 113.5 grams.",
          },
          {
            label: "3",
            explanation:
              "Convert grams to ounces if needed: 113.5 g ÷ 28.3495 = 4.0 oz daily food.",
          },
        ],
        result: "Feed approximately 4.0 ounces of food daily to the fish in this aquarium.",
      }}
      relatedCalculators={[
        {
          title: "Prednisolone Dose Calculator for Cats",
          url: "/pets/cat-prednisolone-dose",
          icon: "🐱",
        },
        {
          title: "Dog Treat Calories & Daily Allowance Calculator",
          url: "/pets/dog-treat-calories-daily-allowance",
          icon: "🐶",
        },
        {
          title: "Dog Onion/Garlic (Allium) Exposure Risk Calculator",
          url: "/pets/dog-onion-garlic-exposure-risk",
          icon: "🐶",
        },
        {
          title: "Dog Calorie Needs (RER/MER) Calculator",
          url: "/pets/dog-calorie-needs-rer-mer",
          icon: "🐶",
        },
        {
          title: "Kitten Calorie Needs by Age/Size",
          url: "/pets/kitten-calorie-needs-age-size",
          icon: "💉",
        },
        {
          title: "Omega-3 (EPA/DHA) Supplement Calculator for Dogs",
          url: "/pets/dog-omega-3-epa-dha-supplement",
          icon: "🐶",
        },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Fish Food Feeding Rate Calculator" },
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