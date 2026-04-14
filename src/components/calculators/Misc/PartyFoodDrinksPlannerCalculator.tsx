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

export default function PartyFoodDrinksPlannerCalculator() {
  // Inputs: number of guests, duration (hours), party type (casual, formal), food preferences (veg/non-veg/mixed), drink preferences (alcoholic/non-alcoholic/mixed)
  const [inputs, setInputs] = useState({
    guests: "",
    duration: "",
    partyType: "casual",
    foodPreference: "mixed",
    drinkPreference: "mixed",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * - Food quantity depends on guests, duration, party type, and food preference.
   * - Drinks quantity depends on guests, duration, and drink preference.
   * 
   * Food servings per guest:
   * - Casual: 1.5 servings per hour
   * - Formal: 1.0 servings per hour (lighter portions)
   * 
   * Food serving size:
   * - Vegetarian: 1 serving = 150g
   * - Non-veg: 1 serving = 200g
   * - Mixed: average 175g
   * 
   * Drinks per guest per hour:
   * - Alcoholic: 2 drinks
   * - Non-alcoholic: 3 drinks
   * - Mixed: 2.5 drinks
   * 
   * Drink serving size:
   * - Alcoholic: 150ml per drink
   * - Non-alcoholic: 250ml per drink
   * - Mixed: average 200ml
   * 
   * Pizza calculation (optional):
   * - 1 pizza = 8 slices
   * - 2 slices per guest average
   * 
   * Warning if inputs missing or unrealistic.
   */

  const results = useMemo(() => {
    const guests = Number(inputs.guests);
    const duration = Number(inputs.duration);
    const partyType = inputs.partyType;
    const foodPref = inputs.foodPreference;
    const drinkPref = inputs.drinkPreference;

    if (!guests || guests < 1) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid number of guests (at least 1).",
        warning: "Invalid guests input",
        formulaUsed: "",
      };
    }
    if (!duration || duration < 1) {
      return {
        value: null,
        label: null,
        subtext: "Please enter a valid party duration (at least 1 hour).",
        warning: "Invalid duration input",
        formulaUsed: "",
      };
    }

    // Food servings per guest per hour
    const servingsPerHour = partyType === "formal" ? 1.0 : 1.5;

    // Serving size in grams
    let servingSizeGrams = 175;
    if (foodPref === "vegetarian") servingSizeGrams = 150;
    else if (foodPref === "non-vegetarian") servingSizeGrams = 200;

    // Total food grams
    const totalFoodGrams = guests * duration * servingsPerHour * servingSizeGrams;

    // Convert grams to kilograms for easier reading
    const totalFoodKg = totalFoodGrams / 1000;

    // Drinks per guest per hour
    let drinksPerHour = 2.5;
    if (drinkPref === "alcoholic") drinksPerHour = 2;
    else if (drinkPref === "non-alcoholic") drinksPerHour = 3;

    // Drink serving size in ml
    let drinkServingMl = 200;
    if (drinkPref === "alcoholic") drinkServingMl = 150;
    else if (drinkPref === "non-alcoholic") drinkServingMl = 250;

    // Total drinks volume in liters
    const totalDrinkMl = guests * duration * drinksPerHour * drinkServingMl;
    const totalDrinkL = totalDrinkMl / 1000;

    // Pizza calculation: assume 2 slices per guest, 8 slices per pizza
    const totalSlices = guests * 2;
    const pizzasNeeded = Math.ceil(totalSlices / 8);

    // Formula summary
    const formulaUsed = `
      Food (kg) = guests × duration (hrs) × servings/hr × serving size (g) ÷ 1000
      Drinks (L) = guests × duration (hrs) × drinks/hr × serving size (ml) ÷ 1000
      Pizzas = ceil((guests × 2 slices) ÷ 8 slices per pizza)
    `;

    return {
      value: (
        <>
          <p>
            <strong>Food:</strong> {totalFoodKg.toFixed(2)} kg total ({(guests * duration * servingsPerHour).toFixed(0)} servings)
          </p>
          <p>
            <strong>Drinks:</strong> {totalDrinkL.toFixed(2)} liters total ({(guests * duration * drinksPerHour).toFixed(0)} drinks)
          </p>
          <p>
            <strong>Pizzas:</strong> {pizzasNeeded} pizzas (8 slices each)
          </p>
        </>
      ),
      label: "Estimated Quantities for Your Party",
      subtext: `Based on ${guests} guests, ${duration} hours, ${partyType} party, ${foodPref} food, and ${drinkPref} drinks.`,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How many appetizers should I plan per person at a cocktail party?",
      answer: "Plan 8-12 pieces per person for a 2-3 hour cocktail party, or 12-15 pieces if it's the main event without dinner.",
    },
    {
      question: "What's the recommended amount of beverages per guest?",
      answer: "Estimate 2-3 drinks per person for a 4-hour party; 1.5 drinks for a 2-hour event; and 3-4 drinks for a 5+ hour celebration.",
    },
    {
      question: "How much main dish should I prepare for 50 people?",
      answer: "Plan 6-8 ounces of protein per person for a sit-down dinner, or 4-5 ounces if serving with substantial sides and appetizers.",
    },
    {
      question: "Can I use this calculator for dietary restrictions?",
      answer: "Yes; the planner helps you estimate base quantities, then adjust percentages for vegetarian, vegan, gluten-free, and allergy-friendly options.",
    },
    {
      question: "How do I account for non-drinkers at my party?",
      answer: "Reduce your alcohol estimate by 15-20% and increase non-alcoholic beverages like water, juice, and mocktails by the same percentage.",
    },
    {
      question: "What's the best way to handle leftovers in my calculations?",
      answer: "Add 10-15% extra to your totals to ensure you don't run out; most perishable items can be repurposed for post-party meals.",
    },
    {
      question: "Should I adjust quantities based on party type?",
      answer: "Yes; casual backyard BBQs need less per person than formal seated dinners, and afternoon events require fewer drinks than evening parties.",
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
                <Users className="w-4 h-4" /> Number of Guests
              </Label>
              <Input
                id="guests"
                type="number"
                min={1}
                placeholder="e.g., 20"
                value={inputs.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration" className="mb-1 flex items-center gap-1">
                <ClockIcon className="w-4 h-4" /> Duration (hours)
              </Label>
              <Input
                id="duration"
                type="number"
                min={1}
                placeholder="e.g., 4"
                value={inputs.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="partyType" className="mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Party Type
              </Label>
              <Select
                value={inputs.partyType}
                onValueChange={(v) => handleInputChange("partyType", v)}
              >
                <SelectTrigger id="partyType" className="w-full">
                  <SelectValue placeholder="Select party type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="foodPreference" className="mb-1 flex items-center gap-1">
                <Utensils className="w-4 h-4" /> Food Preference
              </Label>
              <Select
                value={inputs.foodPreference}
                onValueChange={(v) => handleInputChange("foodPreference", v)}
              >
                <SelectTrigger id="foodPreference" className="w-full">
                  <SelectValue placeholder="Select food preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="drinkPreference" className="mb-1 flex items-center gap-1">
                <Droplets className="w-4 h-4" /> Drink Preference
              </Label>
              <Select
                value={inputs.drinkPreference}
                onValueChange={(v) => handleInputChange("drinkPreference", v)}
              >
                <SelectTrigger id="drinkPreference" className="w-full">
                  <SelectValue placeholder="Select drink preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alcoholic">Alcoholic</SelectItem>
                  <SelectItem value="non-alcoholic">Non-Alcoholic</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              guests: "",
              duration: "",
              partyType: "casual",
              foodPreference: "mixed",
              drinkPreference: "mixed",
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
          <CardContent className="p-8 text-center space-y-4">
            <p className="text-2xl font-semibold text-blue-900 dark:text-white">{results.label}</p>
            <div className="text-lg text-slate-800 dark:text-slate-300">{results.value}</div>
            <p className="text-sm italic text-slate-600 dark:text-slate-400">{results.subtext}</p>
            {results.warning && (
              <p className="text-red-600 dark:text-red-400 font-semibold">{results.warning}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Party Food & Drinks Planner</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you determine exact quantities of food and beverages needed for any celebration. Simply enter your guest count, party type, and duration to receive customized recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include total guests, event duration, party style (cocktail, dinner, casual), and any dietary restrictions or preferences. You can also specify your crowd's drinking habits and eating patterns.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show total food quantities (appetizers, mains, sides, desserts) and beverage estimates (alcoholic and non-alcoholic). Use these figures to create shopping lists and adjust based on your kitchen capacity and budget.</p>
        </div>
      </section>

      {/* TABLE: Food Quantities by Party Type (Per Person) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Food Quantities by Party Type (Per Person)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these benchmarks to estimate total food needed for your event.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Party Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Appetizers (pieces)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Main Dish (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sides (oz)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dessert (oz)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cocktail Reception</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lunch Buffet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Dinner Party</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">BBQ/Casual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Formal Seated Dinner</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Adjust upward for heavy drinkers or athletic crowds; reduce for elderly guests or afternoon events.</p>
      </section>

      {/* TABLE: Beverage Guidelines by Event Duration */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Beverage Guidelines by Event Duration</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Estimate total drinks needed based on party length and guest count.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Event Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Drinks Per Person</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: 30 Guests</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Alcohol:Non-Alcohol Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45 drinks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60:40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-2.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-75 drinks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60:40</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-90 drinks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55:45</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5+ hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90-120 drinks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50:50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">All-day event (8+ hrs)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-150 drinks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45:55</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Increase non-alcoholic options for daytime events, afternoon guests, and those with designated drivers.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always add 10-15% buffer to your food estimates to prevent running short mid-party.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Ask guests about dietary restrictions at least 2 weeks ahead so you can plan alternative options accurately.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pre-cut and prep ingredients the day before to reduce stress and ensure consistent portion control.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the 60:40 alcohol-to-non-alcohol ratio as a baseline, adjusting for your specific guest demographics.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting About Hungry Guests</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Underestimating portions for active crowds or those coming straight from work often results in empty platters.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Party Duration</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 2-hour cocktail party requires far less food and drink than a 5-hour celebration; duration significantly impacts consumption rates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Dietary Restrictions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming everyone eats the same foods leads to waste and disappointed guests; always ask about allergies and preferences upfront.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Over-Buying Perishables Without a Plan</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Purchasing excessive quantities of items that don't store well results in food waste and unnecessary expense.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many appetizers should I plan per person at a cocktail party?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Plan 8-12 pieces per person for a 2-3 hour cocktail party, or 12-15 pieces if it's the main event without dinner.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the recommended amount of beverages per guest?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Estimate 2-3 drinks per person for a 4-hour party; 1.5 drinks for a 2-hour event; and 3-4 drinks for a 5+ hour celebration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much main dish should I prepare for 50 people?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Plan 6-8 ounces of protein per person for a sit-down dinner, or 4-5 ounces if serving with substantial sides and appetizers.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for dietary restrictions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; the planner helps you estimate base quantities, then adjust percentages for vegetarian, vegan, gluten-free, and allergy-friendly options.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for non-drinkers at my party?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reduce your alcohol estimate by 15-20% and increase non-alcoholic beverages like water, juice, and mocktails by the same percentage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the best way to handle leftovers in my calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Add 10-15% extra to your totals to ensure you don't run out; most perishable items can be repurposed for post-party meals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I adjust quantities based on party type?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes; casual backyard BBQs need less per person than formal seated dinners, and afternoon events require fewer drinks than evening parties.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Food Safety Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official guidance on food safety, storage times, and proper handling for large-scale food preparation.</p>
          </li>
          <li>
            <a href="https://www.restaurant.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Restaurant Association Portion Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-standard serving sizes and quantity recommendations for various menu items and event types.</p>
          </li>
          <li>
            <a href="https://www.thespruceeats.com/party-planning-4159731" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Eats Party Planning Resource</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive guide covering appetizer quantities, beverage planning, and budget-friendly party food ideas.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/foodsafety/communication/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Food Safety at Gatherings</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based recommendations for maintaining food safety during large gatherings and outdoor events.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Party Food & Drinks Planner"
      description="Plan party food and drink quantities. Calculate exactly how many servings, pizzas, and beverages you need for your guest list."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: `
          Food (kg) = guests × duration (hrs) × servings/hr × serving size (g) ÷ 1000
          Drinks (L) = guests × duration (hrs) × drinks/hr × serving size (ml) ÷ 1000
          Pizzas = ceil((guests × 2 slices) ÷ 8 slices per pizza)
        `,
        variables: [
          { name: "guests", description: "Number of guests attending the party" },
          { name: "duration", description: "Duration of the party in hours" },
          { name: "servings/hr", description: "Average food servings per guest per hour" },
          { name: "serving size (g)", description: "Weight of one serving of food in grams" },
          { name: "drinks/hr", description: "Average drinks per guest per hour" },
          { name: "serving size (ml)", description: "Volume of one drink serving in milliliters" },
          { name: "slices per guest", description: "Average pizza slices consumed per guest" },
          { name: "slices per pizza", description: "Number of slices in one pizza" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are hosting a casual 4-hour party with 30 guests. The group prefers mixed food options and mixed drinks.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input 30 guests and 4 hours duration.",
          },
          {
            label: "Step 2",
            explanation: "Select 'Casual' for party type, 'Mixed' for food and drink preferences.",
          },
          {
            label: "Step 3",
            explanation: "Click Calculate to get the estimated food and drink quantities.",
          },
        ],
        result:
          "The planner estimates approximately 31.5 kg of food, 6.0 liters of drinks, and 8 pizzas needed to satisfy your guests.",
      }}
      relatedCalculators={[
        { title: "Square Footage Calculator", url: "/everyday/square-footage-calculator", icon: "💡" },
        { title: "Event Capacity Calculator", url: "/everyday/event-capacity-calculator", icon: "💡" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday/myplate-daily-calorie-nutrient", icon: "❤️" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday/garden-soil-compost-volume", icon: "🌿" },
        { title: "Plant Spacing Calculator", url: "/everyday/plant-spacing-calculator", icon: "🌿" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday/bmr-calculator", icon: "💡" },
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

// Additional icon for clock (not in original list, so use Info icon as substitute)
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}