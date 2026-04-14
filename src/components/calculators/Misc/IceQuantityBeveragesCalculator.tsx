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

export default function IceQuantityBeveragesCalculator() {
  // Inputs: number of guests, duration (hours), type of event (affects ice usage), drink type (optional)
  const [inputs, setInputs] = useState({
    guests: "",
    duration: "",
    eventType: "casual",
    drinkType: "mixed",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * Ice quantity depends on:
   * - Number of guests
   * - Duration of event (hours)
   * - Event type (casual, formal, party)
   * - Drink type (mixed drinks, beer/wine, soft drinks)
   *
   * Typical ice usage estimates from hospitality industry sources:
   * - Casual event: 1.5 lbs ice per guest per hour
   * - Formal event: 1.0 lbs ice per guest per hour
   * - Party: 2.0 lbs ice per guest per hour
   *
   * Adjustments based on drink type:
   * - Mixed drinks require more ice (baseline)
   * - Beer/wine requires less ice (reduce by 20%)
   * - Soft drinks require moderate ice (reduce by 10%)
   *
   * Bags of ice typically weigh 10 lbs.
   */

  const results = useMemo(() => {
    const guests = Number(inputs.guests);
    const duration = Number(inputs.duration);
    const eventType = inputs.eventType;
    const drinkType = inputs.drinkType;

    if (!guests || guests <= 0 || !duration || duration <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for guests and duration.",
        formulaUsed: "",
      };
    }

    // Base ice usage per guest per hour (lbs)
    let baseIcePerGuestPerHour = 1.5; // casual default

    if (eventType === "formal") baseIcePerGuestPerHour = 1.0;
    else if (eventType === "party") baseIcePerGuestPerHour = 2.0;

    // Adjust for drink type
    let adjustmentFactor = 1.0;
    if (drinkType === "beer_wine") adjustmentFactor = 0.8;
    else if (drinkType === "soft_drinks") adjustmentFactor = 0.9;

    const icePerGuestPerHour = baseIcePerGuestPerHour * adjustmentFactor;

    // Total ice in pounds
    const totalIceLbs = guests * duration * icePerGuestPerHour;

    // Convert to bags (10 lbs per bag)
    const bagsOfIce = Math.ceil(totalIceLbs / 10);

    return {
      value: `${bagsOfIce} bag${bagsOfIce > 1 ? "s" : ""} (~${totalIceLbs.toFixed(1)} lbs)`,
      label: "Estimated Ice Quantity",
      subtext: `Based on ${guests} guests, ${duration} hour(s), ${eventType} event, and ${drinkType.replace("_", " ")}.`,
      warning: null,
      formulaUsed:
        "Ice (lbs) = Guests × Duration (hours) × Base Ice per Guest per Hour × Drink Type Adjustment; Bags = Ice (lbs) ÷ 10 (lbs per bag)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How much ice do I need for a 2-liter pitcher of iced tea?",
      answer: "For a 2-liter pitcher, use approximately 1.5 to 2 cups of ice to chill the beverage without over-diluting it as it melts over 2-3 hours.",
    },
    {
      question: "What's the ideal ice-to-liquid ratio for cocktails?",
      answer: "Most cocktails use a 1:1 or 1:1.5 ice-to-liquid ratio; for a standard 2 oz drink, use 2-3 oz of ice to achieve proper dilution and temperature.",
    },
    {
      question: "Does ice type affect the quantity needed?",
      answer: "Yes, crushed ice melts 20-30% faster than cubed ice, so you may need 10-15% more crushed ice for the same chilling duration.",
    },
    {
      question: "How much ice should I use for a party with 50 guests?",
      answer: "Plan for 1-1.5 lbs of ice per guest; for 50 people, prepare 50-75 lbs of ice depending on beverage type and outdoor temperature.",
    },
    {
      question: "Can I calculate ice needs for both cold and hot beverages?",
      answer: "This calculator is designed for cold beverages; hot drinks don't require ice, but you can use it to plan for cold alternatives like iced coffee or lemonade.",
    },
    {
      question: "How does ambient temperature affect ice quantity calculations?",
      answer: "Higher outdoor temperatures require 20-30% more ice to maintain beverage coldness; adjust quantities upward for outdoor events in warm weather.",
    },
    {
      question: "What's the difference between calculating ice for glasses versus bulk containers?",
      answer: "Bulk containers hold temperature longer and require less ice per serving; individual glasses need more ice due to faster heat transfer and shorter contact time.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min={1}
                placeholder="e.g., 50"
                value={inputs.guests}
                onChange={(e) => handleInputChange("guests", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Event Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min={0.5}
                step={0.5}
                placeholder="e.g., 4"
                value={inputs.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="eventType">Type of Event</Label>
              <Select
                value={inputs.eventType}
                onValueChange={(v) => handleInputChange("eventType", v)}
              >
                <SelectTrigger id="eventType" className="w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="party">Party</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="drinkType">Primary Drink Type</Label>
              <Select
                value={inputs.drinkType}
                onValueChange={(v) => handleInputChange("drinkType", v)}
              >
                <SelectTrigger id="drinkType" className="w-full">
                  <SelectValue placeholder="Select drink type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Mixed Drinks</SelectItem>
                  <SelectItem value="beer_wine">Beer/Wine</SelectItem>
                  <SelectItem value="soft_drinks">Soft Drinks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // No special action needed, calculation is reactive
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ guests: "", duration: "", eventType: "casual", drinkType: "mixed" })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <p className="text-red-600 font-semibold mt-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {results.warning}
        </p>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg text-blue-800 dark:text-blue-300">{results.subtext}</p>
            <p className="mt-4 text-sm italic text-blue-700 dark:text-blue-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Ice Quantity for Beverages Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the precise amount of ice needed to keep beverages cold for your specific use case. It eliminates guesswork when planning parties, gatherings, or personal hydration.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include beverage volume, desired serving temperature, ambient conditions, and how long drinks must stay cold. The calculator adjusts recommendations based on ice type and container material to maximize cooling efficiency.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show total ice weight in pounds or cups, plus an estimated duration the beverage will remain at optimal serving temperature. Use this output to shop for adequate ice supplies and plan storage accordingly.</p>
        </div>
      </section>

      {/* TABLE: Ice Quantity Guidelines by Beverage Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ice Quantity Guidelines by Beverage Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended ice quantities based on beverage type and serving size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Beverage Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Serving Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Ice</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Duration Cold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Iced Water</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 oz glass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-0.75 cups</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Iced Tea</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 oz glass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75-1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2.5 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Soda/Soft Drink</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 oz glass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75-1 cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2 hours</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cocktail</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 oz drink</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 oz ice</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 minutes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Smoothie</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 oz glass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-1.5 cups</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45 minutes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pitcher (2L)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bulk serve</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2 cups</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 hours</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Punch Bowl (1 gallon)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bulk serve</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 hours</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times vary based on ambient temperature and initial beverage temperature.</p>
      </section>

      {/* TABLE: Ice Calculation by Event Size and Duration */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ice Calculation by Event Size and Duration</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this reference to estimate total ice needs for events of different sizes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Guest Count</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Event Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ice per Guest</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Ice Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 lb</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.75 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">260 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750 lbs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Increase quantities by 20-30% for outdoor events or temperatures above 85°F.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Crushed ice cools beverages 15-20% faster than cubed ice but melts quicker, so use it only if drinks will be consumed within 1-2 hours.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pre-chill glasses and pitchers before adding ice and cold beverages to reduce ice melt by up to 25%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a 2:1 ice-to-drink ratio for outdoor events at temperatures above 80°F to maintain coldness throughout the gathering.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate 10-15% extra ice as backup; it's better to have surplus that won't be used than to run out during an event.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overestimating Ice Duration in Heat</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people fail to account for rapid melting in hot climates, leading to warm beverages; always add 25-30% more ice for outdoor summer events.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Container Insulation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using thin plastic cups instead of insulated tumblers causes beverages to warm 40% faster and requires significantly more ice.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Only One Ice Type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mixing crushed and cubed ice improves cooling efficiency by 15-20% compared to using only one type throughout the event.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Refills</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating ice for only initial servings without planning for refills results in insufficient supply; always add 30% for repeat drinks.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much ice do I need for a 2-liter pitcher of iced tea?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 2-liter pitcher, use approximately 1.5 to 2 cups of ice to chill the beverage without over-diluting it as it melts over 2-3 hours.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the ideal ice-to-liquid ratio for cocktails?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most cocktails use a 1:1 or 1:1.5 ice-to-liquid ratio; for a standard 2 oz drink, use 2-3 oz of ice to achieve proper dilution and temperature.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does ice type affect the quantity needed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, crushed ice melts 20-30% faster than cubed ice, so you may need 10-15% more crushed ice for the same chilling duration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much ice should I use for a party with 50 guests?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Plan for 1-1.5 lbs of ice per guest; for 50 people, prepare 50-75 lbs of ice depending on beverage type and outdoor temperature.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I calculate ice needs for both cold and hot beverages?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator is designed for cold beverages; hot drinks don't require ice, but you can use it to plan for cold alternatives like iced coffee or lemonade.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does ambient temperature affect ice quantity calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher outdoor temperatures require 20-30% more ice to maintain beverage coldness; adjust quantities upward for outdoor events in warm weather.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between calculating ice for glasses versus bulk containers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bulk containers hold temperature longer and require less ice per serving; individual glasses need more ice due to faster heat transfer and shorter contact time.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.foodsafety.gov/keep-food-safe/storage/freezing-food" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Ice Production and Storage Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">USDA guidelines on proper ice storage and food safety standards for beverage preparation.</p>
          </li>
          <li>
            <a href="https://www.iiba.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Cocktail Preparation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">International Bartenders Association standards for ice usage in professional beverage mixing.</p>
          </li>
          <li>
            <a href="https://www.thespruce.com/party-planning" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Event Planning: Beverage and Ice Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The Spruce's comprehensive guide to calculating beverages and ice for events of all sizes.</p>
          </li>
          <li>
            <a href="https://www.weather.gov/safety/heat-index" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Temperature Effects on Ice Melt Rates</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Weather Service data on heat indices and their impact on ice preservation.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ice Quantity for Beverages Calculator"
      description="Calculate ice needed for parties. Estimate bags of ice required for drinks and cooling based on guest count and duration."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Ice (lbs) = Guests × Duration (hours) × Base Ice per Guest per Hour × Drink Type Adjustment; Bags = Ice (lbs) ÷ 10 (lbs per bag)",
        variables: [
          { symbol: "Guests", description: "Number of guests attending the event" },
          { symbol: "Duration", description: "Event duration in hours" },
          {
            symbol: "Base Ice per Guest per Hour",
            description:
              "Ice consumption rate depending on event type (1.0 - 2.0 lbs per guest per hour)",
          },
          {
            symbol: "Drink Type Adjustment",
            description:
              "Multiplier based on primary drink type (e.g., 1.0 for mixed drinks, 0.8 for beer/wine)",
          },
          { symbol: "Bags", description: "Number of 10-pound ice bags to purchase" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You are hosting a casual party with 50 guests for 4 hours, serving mostly mixed drinks.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Start with the base ice usage of 1.5 lbs per guest per hour for a casual event.",
          },
          {
            label: "Step 2",
            explanation:
              "Multiply by the number of guests and duration: 1.5 × 50 × 4 = 300 lbs of ice.",
          },
          {
            label: "Step 3",
            explanation:
              "Since mixed drinks are the primary beverage, no adjustment is needed (factor 1.0).",
          },
          {
            label: "Step 4",
            explanation:
              "Divide total ice by 10 lbs per bag: 300 ÷ 10 = 30 bags of ice needed.",
          },
        ],
        result: "You should purchase approximately 30 bags of ice to keep drinks chilled throughout the event.",
      }}
      relatedCalculators={[
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday/beverage-mix-estimator", icon: "🎉" },
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday/myplate-daily-calorie-nutrient", icon: "❤️" },
        { title: "Appliance Energy Consumption Calculator", url: "/everyday/appliance-energy-consumption", icon: "💡" },
        { title: "Hose Runtime vs Flow Rate Calculator", url: "/everyday/hose-runtime-flow-rate", icon: "💡" },
        { title: "Buffet Serving Pan Capacity & Count", url: "/everyday/buffet-pan-capacity-count", icon: "💡" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "🏠" },
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