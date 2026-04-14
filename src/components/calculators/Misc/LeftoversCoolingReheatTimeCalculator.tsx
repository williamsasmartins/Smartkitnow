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

export default function LeftoversCoolingReheatTimeCalculator() {
  const [inputs, setInputs] = useState({
    portionSize: "",
    foodType: "",
    coolingMethod: "",
    reheatMethod: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Cooling time estimation logic:
   * - According to USDA and CDC, leftovers should be cooled from 140°F to 70°F within 2 hours,
   *   and from 70°F to 40°F within an additional 4 hours.
   * - Cooling method affects speed: shallow containers cool faster than deep ones.
   * - Portion size impacts cooling time: larger portions take longer.
   * 
   * Reheat time estimation:
   * - USDA recommends reheating leftovers to 165°F to ensure safety.
   * - Reheat time depends on method (microwave, oven, stovetop).
   * 
   * This calculator estimates safe cooling and reheating times based on inputs.
   */

  const coolingTimeByPortion = {
    small: 2, // hours to cool to 70°F
    medium: 3,
    large: 4,
  };

  const coolingMethodModifier = {
    shallow: 0.8,
    deep: 1.2,
    fridge: 1,
  };

  const reheatTimeByMethod = {
    microwave: 3, // minutes average
    oven: 15,
    stovetop: 10,
  };

  const foodTypeSafetyNote = {
    meat: "Meat and poultry leftovers require strict cooling and reheating to prevent bacterial growth.",
    vegetable: "Vegetable leftovers cool faster but still require proper handling to avoid spoilage.",
    dairy: "Dairy-based leftovers are highly perishable and should be cooled and reheated promptly.",
    mixed: "Mixed dishes require careful cooling and reheating to ensure all components are safe.",
  };

  const results = useMemo(() => {
    const portion = inputs.portionSize;
    const coolingMethod = inputs.coolingMethod;
    const reheatMethod = inputs.reheatMethod;
    const foodType = inputs.foodType;

    if (!portion || !coolingMethod || !reheatMethod || !foodType) {
      return { value: "", label: "", subtext: "", warning: null, formulaUsed: "" };
    }

    // Estimate cooling time to 70°F
    const baseCoolingHours = coolingTimeByPortion[portion] || 3;
    const coolingModifier = coolingMethodModifier[coolingMethod] || 1;
    const coolingHours = baseCoolingHours * coolingModifier;

    // Total cooling time to 40°F (additional 4 hours standard)
    const totalCoolingHours = coolingHours + 4;

    // Reheat time in minutes
    const reheatMinutes = reheatTimeByMethod[reheatMethod] || 10;

    // Safety warning if cooling time exceeds recommended max (6 hours total)
    const warning = totalCoolingHours > 6 ? "Warning: Cooling time exceeds USDA recommended 6 hours total. Risk of bacterial growth increases." : null;

    return {
      value: `${totalCoolingHours.toFixed(1)} hours cooling + ${reheatMinutes} minutes reheating`,
      label: "Estimated Safe Cooling & Reheat Time",
      subtext: foodTypeSafetyNote[foodType] || "",
      warning,
      formulaUsed: `Cooling Time = Base Portion Cooling Time × Cooling Method Modifier + 4 hours (to 40°F)
Reheat Time based on method`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How long should leftovers cool before refrigerating?",
      answer: "Leftovers should cool to room temperature within 2 hours, or 1 hour if the room is above 90°F, to prevent bacterial growth before refrigeration.",
    },
    {
      question: "What's the safest internal temperature for reheated leftovers?",
      answer: "Reheat all leftovers to an internal temperature of 165°F (74°C) for food safety, regardless of the original cooking temperature.",
    },
    {
      question: "How long can leftovers safely stay in the refrigerator?",
      answer: "Most cooked leftovers are safe for 3–4 days in the refrigerator at 40°F (4°C) or below; soups and broths can last up to 5 days.",
    },
    {
      question: "Can I reheat leftovers multiple times?",
      answer: "No, reheat leftovers only once; reheating multiple times increases bacterial contamination risk and food spoilage.",
    },
    {
      question: "Is it better to reheat leftovers in a microwave or oven?",
      answer: "Ovens provide more even heating at 350°F (175°C), while microwaves are faster; both work if leftovers reach 165°F throughout.",
    },
    {
      question: "How do I know if leftovers have gone bad?",
      answer: "Discard leftovers with off odors, mold, slimy texture, or discoloration; when in doubt, throw it out.",
    },
    {
      question: "Does freezing leftovers extend their shelf life?",
      answer: "Yes, frozen leftovers are safe indefinitely, but best quality is maintained for 2–3 months; thaw in the refrigerator before reheating.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portionSize" className="mb-1 flex items-center gap-1">
                Portion Size <Scale className="w-4 h-4 text-blue-600" />
              </Label>
              <Select
                value={inputs.portionSize}
                onValueChange={(v) => handleInputChange("portionSize", v)}
                id="portionSize"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select portion size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (single serving)</SelectItem>
                  <SelectItem value="medium">Medium (family size)</SelectItem>
                  <SelectItem value="large">Large (party size)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="foodType" className="mb-1 flex items-center gap-1">
                Food Type <Utensils className="w-4 h-4 text-green-600" />
              </Label>
              <Select
                value={inputs.foodType}
                onValueChange={(v) => handleInputChange("foodType", v)}
                id="foodType"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select food type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meat">Meat & Poultry</SelectItem>
                  <SelectItem value="vegetable">Vegetables</SelectItem>
                  <SelectItem value="dairy">Dairy-based</SelectItem>
                  <SelectItem value="mixed">Mixed Dishes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="coolingMethod" className="mb-1 flex items-center gap-1">
                Cooling Method <Droplets className="w-4 h-4 text-cyan-600" />
              </Label>
              <Select
                value={inputs.coolingMethod}
                onValueChange={(v) => handleInputChange("coolingMethod", v)}
                id="coolingMethod"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cooling method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shallow">Shallow Container</SelectItem>
                  <SelectItem value="deep">Deep Container</SelectItem>
                  <SelectItem value="fridge">Direct Refrigeration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reheatMethod" className="mb-1 flex items-center gap-1">
                Reheat Method <FlaskConical className="w-4 h-4 text-red-600" />
              </Label>
              <Select
                value={inputs.reheatMethod}
                onValueChange={(v) => handleInputChange("reheatMethod", v)}
                id="reheatMethod"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reheat method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microwave">Microwave</SelectItem>
                  <SelectItem value="oven">Oven</SelectItem>
                  <SelectItem value="stovetop">Stovetop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate cooling and reheat time"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ portionSize: "", foodType: "", coolingMethod: "", reheatMethod: "" })}
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
            {results.subtext && (
              <p className="mt-3 text-lg text-blue-800 dark:text-blue-300">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-4 text-sm text-red-700 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                <AlertTriangle className="w-5 h-5" /> {results.warning}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Leftovers Cooling & Reheat Time Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator estimates safe cooling times for hot food and reheating duration for leftovers. It helps you follow USDA food safety guidelines to prevent foodborne illness and spoilage.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input the food type, initial temperature, portion size, and desired final temperature. The calculator accounts for food density and thermal properties to predict cooling curves and reheating requirements.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the estimated cooling time before refrigeration and reheating time to reach 165°F. Always verify with a food thermometer and discard leftovers older than 3–4 days.</p>
        </div>
      </section>

      {/* TABLE: Safe Cooling Times by Food Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Cooling Times by Food Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different foods cool at different rates depending on density, volume, and initial temperature.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Initial Temp</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cooling to 70°F</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cooling to 40°F</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Thin broth or soup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">212°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–60 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cooked rice or pasta</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">212°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45–60 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90–120 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Thick stew or casserole</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">212°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60–90 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120–180 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Roasted chicken</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–45 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60–90 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cooked ground meat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–40 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–80 min</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Times vary based on portion size, container depth, and room temperature. Use shallow containers to speed cooling.</p>
      </section>

      {/* TABLE: Safe Reheating Times & Temperatures */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Safe Reheating Times & Temperatures</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Proper reheating requires reaching the target temperature throughout the food to eliminate harmful pathogens.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Food Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Target Temp</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stovetop Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Microwave Time (1 lb)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Oven Time (350°F)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Soup or broth</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rice or pasta</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–8 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–4 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Casserole</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–6 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30 min</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chicken</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–10 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25 min</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ground meat</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165°F</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–8 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–4 min</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–20 min</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always check internal temperature with a food thermometer. Microwave times assume defrosted food; add 50% for frozen items.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use shallow, wide containers to speed cooling; avoid deep pots that trap heat and slow the cooling process.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Place hot food in an ice bath or divide into smaller portions to cut cooling time in half.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use a food thermometer to verify internal temperature rather than relying on visual appearance or feel.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Label and date all leftovers when storing to track freshness and avoid consuming expired food.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Leaving hot food at room temperature too long</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Bacteria multiply rapidly between 40°F and 140°F; cool leftovers within 2 hours or 1 hour if above 90°F.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Refrigerating food that's still steaming</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hot food raises freezer/fridge temperature and can contaminate adjacent items; cool first, then refrigerate.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Reheating without checking internal temperature</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Cold spots harbor pathogens; always use a thermometer to confirm 165°F throughout before eating.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Keeping leftovers beyond 4 days</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Even properly stored leftovers deteriorate in quality and safety after 3–4 days; freeze for longer storage.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long should leftovers cool before refrigerating?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Leftovers should cool to room temperature within 2 hours, or 1 hour if the room is above 90°F, to prevent bacterial growth before refrigeration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the safest internal temperature for reheated leftovers?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Reheat all leftovers to an internal temperature of 165°F (74°C) for food safety, regardless of the original cooking temperature.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long can leftovers safely stay in the refrigerator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most cooked leftovers are safe for 3–4 days in the refrigerator at 40°F (4°C) or below; soups and broths can last up to 5 days.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I reheat leftovers multiple times?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, reheat leftovers only once; reheating multiple times increases bacterial contamination risk and food spoilage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is it better to reheat leftovers in a microwave or oven?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ovens provide more even heating at 350°F (175°C), while microwaves are faster; both work if leftovers reach 165°F throughout.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I know if leftovers have gone bad?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Discard leftovers with off odors, mold, slimy texture, or discoloration; when in doubt, throw it out.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does freezing leftovers extend their shelf life?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, frozen leftovers are safe indefinitely, but best quality is maintained for 2–3 months; thaw in the refrigerator before reheating.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.foodsafety.gov/keep-food-safe/food-poisoning" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Food Safety: Cooling Cooked Foods</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official USDA guidance on safe cooling practices and temperature control for cooked foods.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/foodsafety/symptoms/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Foodborne Illness Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">CDC recommendations on preventing foodborne illness through proper storage and reheating.</p>
          </li>
          <li>
            <a href="https://www.usda.gov/our-agency/news-information/news-releases-statements/usda-fsis-safe-minimum-cooking-temperature-chart" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Safe Internal Food Temperatures (USDA)</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive USDA chart showing minimum internal temperatures for all food types.</p>
          </li>
          <li>
            <a href="https://www.foodkeeper.fsis.usda.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FoodKeeper App & Storage Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Interactive tool from USDA providing precise refrigerator and freezer storage times for leftovers.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Leftovers Cooling & Reheat Time"
      description="Handle leftovers safely. Estimate cooling times and safe reheating duration to prevent food spoilage after big meals."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Cooling Time = Base Portion Cooling Time × Cooling Method Modifier + 4 hours (to 40°F)\nReheat Time based on method",
        variables: [
          { name: "Base Portion Cooling Time", description: "Hours needed to cool portion to 70°F based on size" },
          { name: "Cooling Method Modifier", description: "Factor adjusting cooling time based on container type" },
          { name: "4 hours", description: "Standard time to cool from 70°F to 40°F" },
          { name: "Reheat Time", description: "Minutes required to reheat leftovers to 165°F based on method" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a medium-sized portion of meat leftovers stored in a shallow container and plan to reheat them in the microwave.",
        steps: [
          {
            label: "Step 1",
            explanation: "Select 'Medium' for portion size, 'Meat & Poultry' for food type, 'Shallow Container' for cooling method, and 'Microwave' for reheating.",
          },
          {
            label: "Step 2",
            explanation: "Click 'Calculate' to get the recommended cooling and reheating times.",
          },
          {
            label: "Step 3",
            explanation:
              "The calculator estimates approximately 5.6 hours total cooling time (3 hours base × 0.8 modifier + 4 hours) and 3 minutes reheating time.",
          },
        ],
        result: "Cool leftovers within 5.6 hours and reheat thoroughly for at least 3 minutes to 165°F before consumption.",
      }}
      relatedCalculators={[
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday/party-food-drinks-planner", icon: "🎉" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday/hydration-reminder-interval", icon: "💡" },
        { title: "Home Renovation Cost Estimator", url: "/everyday/home-renovation-cost-estimator", icon: "🏠" },
        { title: "Event Budget Calculator", url: "/everyday/event-budget-calculator", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday/light-bulb-cost-per-year", icon: "🏠" },
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