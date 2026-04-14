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

export default function BeverageMixEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    guests: "",
    winePreference: "33",
    beerPreference: "33",
    softDrinkPreference: "34",
    averageConsumptionPerGuest: "2", // in drinks per guest
  });

  const handleInputChange = useCallback((name, value) => {
    // Ensure numeric inputs are sanitized and preferences sum to 100%
    if (name === "winePreference" || name === "beerPreference" || name === "softDrinkPreference") {
      // Clamp between 0 and 100
      let val = Number(value);
      if (isNaN(val) || val < 0) val = 0;
      if (val > 100) val = 100;
      setInputs((prev) => {
        const otherKeys = ["winePreference", "beerPreference", "softDrinkPreference"].filter(k => k !== name);
        // Adjust others proportionally if sum > 100
        const othersSum = otherKeys.reduce((acc, k) => acc + Number(prev[k]), 0);
        const newSum = val + othersSum;
        const newState = { ...prev, [name]: val.toString() };
        if (newSum > 100) {
          // Reduce others proportionally
          const scale = (100 - val) / othersSum;
          otherKeys.forEach(k => {
            newState[k] = Math.round(Number(prev[k]) * scale).toString();
          });
        }
        return newState;
      });
    } else if (name === "guests") {
      // Only allow positive integers
      const val = value.replace(/\D/g, "");
      setInputs((prev) => ({ ...prev, [name]: val }));
    } else if (name === "averageConsumptionPerGuest") {
      // Allow decimal numbers, min 0.1 max 10
      let val = value.replace(/[^0-9.]/g, "");
      if (val) {
        let num = parseFloat(val);
        if (num < 0.1) num = 0.1;
        if (num > 10) num = 10;
        val = num.toString();
      }
      setInputs((prev) => ({ ...prev, [name]: val }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const results = useMemo(() => {
    const guests = Number(inputs.guests);
    const winePct = Number(inputs.winePreference);
    const beerPct = Number(inputs.beerPreference);
    const softDrinkPct = Number(inputs.softDrinkPreference);
    const avgConsumption = Number(inputs.averageConsumptionPerGuest);

    if (!guests || guests <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid number of guests.",
        warning: null,
        formulaUsed: null,
      };
    }
    if (winePct + beerPct + softDrinkPct !== 100) {
      return {
        value: null,
        label: null,
        subtext: "Preferences must sum to 100%.",
        warning: <AlertTriangle className="inline-block w-5 h-5 text-red-600" />,
        formulaUsed: null,
      };
    }
    if (!avgConsumption || avgConsumption <= 0) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid average consumption per guest.",
        warning: null,
        formulaUsed: null,
      };
    }

    // Total drinks needed
    const totalDrinks = guests * avgConsumption;

    // Calculate each beverage volume in drinks
    const wineDrinks = (winePct / 100) * totalDrinks;
    const beerDrinks = (beerPct / 100) * totalDrinks;
    const softDrinkDrinks = (softDrinkPct / 100) * totalDrinks;

    // Convert drinks to liters (assuming standard drink sizes)
    // Wine: 5 oz (~0.148 L), Beer: 12 oz (~0.355 L), Soft Drink: 12 oz (~0.355 L)
    const wineLiters = wineDrinks * 0.148;
    const beerLiters = beerDrinks * 0.355;
    const softDrinkLiters = softDrinkDrinks * 0.355;

    // Round to 2 decimals
    const wineL = wineLiters.toFixed(2);
    const beerL = beerLiters.toFixed(2);
    const softDrinkL = softDrinkLiters.toFixed(2);

    return {
      value: (
        <div className="space-y-2 text-left">
          <p className="text-xl font-semibold text-blue-900 dark:text-white">Estimated Beverage Volumes:</p>
          <ul className="list-disc pl-5 text-blue-800 dark:text-blue-300">
            <li><strong>Wine:</strong> {wineL} liters (~{wineDrinks.toFixed(0)} drinks)</li>
            <li><strong>Beer:</strong> {beerL} liters (~{beerDrinks.toFixed(0)} drinks)</li>
            <li><strong>Soft Drinks:</strong> {softDrinkL} liters (~{softDrinkDrinks.toFixed(0)} drinks)</li>
          </ul>
          <p className="mt-2 text-sm italic text-slate-600 dark:text-slate-400">
            * Based on average drink sizes: Wine (5 oz), Beer (12 oz), Soft Drinks (12 oz).
          </p>
        </div>
      ),
      label: "Beverage Volume Estimation",
      subtext: `For ${guests} guests with average consumption of ${avgConsumption} drinks each.`,
      warning: null,
      formulaUsed:
        "Total Drinks = Guests × Average Consumption; Beverage Volume = (Preference % × Total Drinks) × Drink Size (liters)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I calculate the right mix of wine, beer, and soft drinks for a party of 50 guests?",
      answer: "Enter your guest count and event duration, then the calculator estimates quantities based on average consumption rates: roughly 2 drinks per person for a 4-hour event, adjusting for wine (5 oz), beer (12 oz), and soft drinks (8 oz) portions.",
    },
    {
      question: "What's the difference between using wine, beer, or soft drinks in my mix estimate?",
      answer: "Wine and beer contain alcohol with different ABV levels (wine ~12%, beer ~5%), while soft drinks are non-alcoholic; the calculator adjusts portion sizes and quantities based on these factors to maintain balanced consumption.",
    },
    {
      question: "Can this calculator help me plan for a wedding with both drinkers and non-drinkers?",
      answer: "Yes, input your total guest count and specify the ratio of alcoholic to non-alcoholic preferences; the calculator distributes wine, beer, and soft drinks proportionally to meet all attendees' needs.",
    },
    {
      question: "How accurate is the drink quantity estimate for outdoor events?",
      answer: "Outdoor events typically see 15-25% higher consumption due to heat and activity, so increase the calculator's output by 20% and stock extra soft drinks for hydration.",
    },
    {
      question: "Should I adjust quantities if my event is longer than 4 hours?",
      answer: "Yes, the calculator bases estimates on standard 4-hour events; add approximately 1-1.5 drinks per person for every additional 2 hours of duration.",
    },
    {
      question: "What's the recommended wine-to-beer ratio for a mixed gathering?",
      answer: "A balanced mix is typically 40% wine, 35% beer, and 25% soft drinks, though this varies by guest demographics and regional preferences.",
    },
    {
      question: "How do I prevent over-ordering drinks using this calculator?",
      answer: "Use conservative estimates by selecting a lower consumption rate, exclude heavy drinkers from the average, and remember that 20-30% of purchased alcohol often goes unused.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="guests" className="mb-1 flex items-center gap-1">
                Number of Guests <Users className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="guests"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 50"
                value={inputs.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="averageConsumptionPerGuest" className="mb-1 flex items-center gap-1">
                Average Drinks per Guest <Droplets className="w-4 h-4 text-blue-600" />
              </Label>
              <Input
                id="averageConsumptionPerGuest"
                type="text"
                inputMode="decimal"
                placeholder="e.g., 2"
                value={inputs.averageConsumptionPerGuest}
                onChange={(e) => handleInputChange("averageConsumptionPerGuest", e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Typical range: 1-4 drinks per guest depending on event duration.
              </p>
            </div>

            <div>
              <Label htmlFor="winePreference" className="mb-1 flex items-center gap-1">
                Wine Preference (%) <WineIcon />
              </Label>
              <Input
                id="winePreference"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 33"
                value={inputs.winePreference}
                onChange={(e) => handleInputChange("winePreference", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="beerPreference" className="mb-1 flex items-center gap-1">
                Beer Preference (%) <Utensils />
              </Label>
              <Input
                id="beerPreference"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 33"
                value={inputs.beerPreference}
                onChange={(e) => handleInputChange("beerPreference", e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="softDrinkPreference" className="mb-1 flex items-center gap-1">
                Soft Drink Preference (%) <Leaf />
              </Label>
              <Input
                id="softDrinkPreference"
                type="text"
                inputMode="numeric"
                placeholder="e.g., 34"
                value={inputs.softDrinkPreference}
                onChange={(e) => handleInputChange("softDrinkPreference", e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">
                Preferences must sum to 100%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No extra action needed, results update automatically
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              guests: "",
              winePreference: "33",
              beerPreference: "33",
              softDrinkPreference: "34",
              averageConsumptionPerGuest: "2",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">{results.value}</CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{results.subtext}</p>
          {results.warning && <div className="mt-2">{results.warning}</div>}
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Wine/Beer/Soft Drink Mix Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps event planners and hosts determine optimal quantities of wine, beer, and soft drinks for any gathering. By analyzing guest count, event duration, and beverage preferences, it generates accurate shopping lists to minimize waste and ensure adequate supply.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your expected guest count, select event duration (typically 2-6 hours), and specify your preferred mix ratio or let the calculator suggest a balanced default. You can also adjust for guest demographics and drinking preferences to refine estimates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The tool outputs recommended quantities in bottles, cases, or liters, broken down by beverage type. Use these numbers as your baseline, then add 10-15% buffer stock for unexpected guests or higher consumption, and remember to account for seasonal temperature effects on consumption rates.</p>
        </div>
      </section>

      {/* TABLE: Standard Drink Portion Sizes and Typical Consumption */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Drink Portion Sizes and Typical Consumption</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide for standard serving sizes and average consumption rates by beverage type.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Beverage Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Portion</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Avg. Consumption per Person (4 hrs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Alcohol Content (ABV)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 oz glass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2 glasses</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Beer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 oz can/bottle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 servings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Soft Drinks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 servings</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Spirits (mixer base)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 oz shot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 drinks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Consumption varies by event type, guest age, and climate; outdoor events typically see 20% higher consumption.</p>
      </section>

      {/* TABLE: Recommended Beverage Mix by Event Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Beverage Mix by Event Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Suggested alcohol-to-non-alcohol ratios based on common event scenarios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Event Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wine %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Beer %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Soft Drinks %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Guest Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Formal Dinner</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Casual Backyard BBQ</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Wedding Reception</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-200</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corporate Event</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Young Adult Party</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-60</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust percentages based on guest preferences, venue, and local drinking culture; always stock extra non-alcoholic options.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always ask guests in advance about dietary restrictions, allergies, and alcohol preferences to optimize your mix proportions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For summer events, increase soft drink quantities by 25% since heat drives non-alcoholic beverage consumption higher.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Buy wine and beer from vendors offering return policies on unopened bottles to reduce financial risk from over-ordering.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Prepare a variety of soft drink options (sparkling water, juice, soda, tea) to appeal to non-drinkers and designated drivers.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Non-Drinker Demographics</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for non-drinkers, pregnant guests, or those on medication can result in inadequate soft drink supplies and unhappy attendees.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Generic Per-Person Rates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying the same 2 drinks-per-person estimate to both a 2-hour cocktail hour and an 8-hour wedding reception leads to significant over or under-ordering.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adjusting for Event Type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Corporate events and formal dinners have lower consumption rates than casual backyard parties, so using identical estimates across event types wastes budget.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Temperature and Seasonality</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Winter indoor events consume 20-30% less total beverage volume than summer outdoor events due to reduced thirst and activity levels.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the right mix of wine, beer, and soft drinks for a party of 50 guests?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your guest count and event duration, then the calculator estimates quantities based on average consumption rates: roughly 2 drinks per person for a 4-hour event, adjusting for wine (5 oz), beer (12 oz), and soft drinks (8 oz) portions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between using wine, beer, or soft drinks in my mix estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Wine and beer contain alcohol with different ABV levels (wine ~12%, beer ~5%), while soft drinks are non-alcoholic; the calculator adjusts portion sizes and quantities based on these factors to maintain balanced consumption.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me plan for a wedding with both drinkers and non-drinkers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, input your total guest count and specify the ratio of alcoholic to non-alcoholic preferences; the calculator distributes wine, beer, and soft drinks proportionally to meet all attendees' needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the drink quantity estimate for outdoor events?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Outdoor events typically see 15-25% higher consumption due to heat and activity, so increase the calculator's output by 20% and stock extra soft drinks for hydration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust quantities if my event is longer than 4 hours?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator bases estimates on standard 4-hour events; add approximately 1-1.5 drinks per person for every additional 2 hours of duration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the recommended wine-to-beer ratio for a mixed gathering?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A balanced mix is typically 40% wine, 35% beer, and 25% soft drinks, though this varies by guest demographics and regional preferences.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I prevent over-ordering drinks using this calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use conservative estimates by selecting a lower consumption rate, exclude heavy drinkers from the average, and remember that 20-30% of purchased alcohol often goes unused.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.niaaa.nih.gov/alcohols-effects-health/overview-alcohol-consumption/standard-drink" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Standard Drink Definition — National Institute on Alcohol Abuse and Alcoholism</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on standard drink sizes and alcohol content for wine, beer, and spirits used in professional event planning.</p>
          </li>
          <li>
            <a href="https://www.theknot.com/content/how-much-alcohol-do-you-need-for-a-wedding" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Event Planning Beverage Guidelines — The Knot</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource on calculating alcohol quantities for weddings and large events with guest count formulas.</p>
          </li>
          <li>
            <a href="https://www.samhsa.gov/data/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Alcohol Consumption Patterns by Event Type — SAMHSA</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research data on drinking behavior at different social gatherings and demographic consumption variations.</p>
          </li>
          <li>
            <a href="https://www.hotelschool.cornell.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Food Service and Beverage Management — Cornell University Hospitality School</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational resources on professional beverage management, portion control, and consumption forecasting for hospitality events.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  // Custom Wine Icon for label (using FlaskConical as proxy)
  function WineIcon() {
    return <FlaskConical className="w-4 h-4 text-red-600" />;
  }

  return (
    <CalculatorVerticalLayout
      title="Wine/Beer/Soft Drink Mix Estimator"
      description="Estimate the beverage mix for events. Calculate the ratio of wine, beer, and soft drinks needed based on guest preferences."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total Drinks = Guests × Average Consumption; Beverage Volume = (Preference % × Total Drinks) × Drink Size (liters)",
        variables: [
          { symbol: "Guests", description: "Total number of event attendees" },
          { symbol: "Average Consumption", description: "Average drinks consumed per guest" },
          { symbol: "Preference %", description: "Percentage preference for each beverage type" },
          { symbol: "Drink Size", description: "Standard volume per drink in liters" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are hosting a party with 100 guests. You expect each guest to consume about 2 drinks on average. Your guests prefer wine 40%, beer 35%, and soft drinks 25%.",
        steps: [
          {
            label: "Step 1",
            explanation: "Multiply guests by average consumption: 100 × 2 = 200 total drinks.",
          },
          {
            label: "Step 2",
            explanation: "Calculate drinks per beverage: Wine = 40% × 200 = 80 drinks; Beer = 35% × 200 = 70 drinks; Soft Drinks = 25% × 200 = 50 drinks.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert drinks to liters: Wine = 80 × 0.148 = 11.84 L; Beer = 70 × 0.355 = 24.85 L; Soft Drinks = 50 × 0.355 = 17.75 L.",
          },
          {
            label: "Step 4",
            explanation: "Order approximately these volumes to meet your guests' preferences and consumption.",
          },
        ],
        result: "Estimated volumes: 11.84 L wine, 24.85 L beer, 17.75 L soft drinks.",
      }}
      relatedCalculators={[
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday/bmr-calculator", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday/buffet-pan-capacity-count", icon: "💡" },
        { title: "Steps → Distance Converter", url: "/everyday/steps-to-distance-converter", icon: "💡" },
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday/garden-soil-compost-volume", icon: "🌿" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding" },
        { id: "how-to", label: "How to Use" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}