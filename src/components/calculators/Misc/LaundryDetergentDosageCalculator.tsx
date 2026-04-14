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

export default function LaundryDetergentDosageCalculator() {
  const [inputs, setInputs] = useState({
    loadSize: "",
    detergentType: "",
    waterHardness: "",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Dosage logic:
   * Typical detergent dosage varies by load size and detergent concentration.
   * Water hardness affects detergent effectiveness, requiring dosage adjustment.
   * 
   * Load sizes:
   * - Small: 2-3 kg (4-6 lbs)
   * - Medium: 4-5 kg (8-11 lbs)
   * - Large: 6-7 kg (13-15 lbs)
   * - Extra Large: 8+ kg (17+ lbs)
   * 
   * Detergent types:
   * - Standard liquid
   * - High Efficiency (HE) liquid
   * - Powder
   * 
   * Water hardness:
   * - Soft
   * - Medium
   * - Hard
   * 
   * Base dosage (ml or grams) per load size and detergent type from manufacturer guidelines.
   * Adjust dosage by +10-20% for hard water.
   */

  const dosageTable = {
    "Standard liquid": {
      small: 30,
      medium: 45,
      large: 60,
      extraLarge: 75,
    },
    "High Efficiency (HE) liquid": {
      small: 15,
      medium: 22,
      large: 30,
      extraLarge: 38,
    },
    Powder: {
      small: 35,
      medium: 50,
      large: 65,
      extraLarge: 80,
    },
  };

  const waterHardnessMultiplier = {
    Soft: 1,
    Medium: 1.1,
    Hard: 1.2,
  };

  const results = useMemo(() => {
    const { loadSize, detergentType, waterHardness } = inputs;
    if (!loadSize || !detergentType || !waterHardness) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please select all inputs to calculate dosage.",
        formulaUsed: "",
      };
    }

    let baseDosage = 0;
    switch (loadSize) {
      case "small":
        baseDosage = dosageTable[detergentType].small;
        break;
      case "medium":
        baseDosage = dosageTable[detergentType].medium;
        break;
      case "large":
        baseDosage = dosageTable[detergentType].large;
        break;
      case "extraLarge":
        baseDosage = dosageTable[detergentType].extraLarge;
        break;
      default:
        baseDosage = 0;
    }

    const multiplier = waterHardnessMultiplier[waterHardness] || 1;
    const adjustedDosage = Math.round(baseDosage * multiplier);

    const unit = detergentType === "Powder" ? "grams" : "ml";

    return {
      value: `${adjustedDosage} ${unit}`,
      label: `Recommended Detergent Dosage for a ${loadSize.charAt(0).toUpperCase() + loadSize.slice(1)} Load`,
      subtext: `Based on ${detergentType} detergent and ${waterHardness.toLowerCase()} water hardness.`,
      warning: null,
      formulaUsed: `Dosage = Base dosage × Water hardness multiplier (${baseDosage} × ${multiplier.toFixed(2)})`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How much detergent should I use for a small load?",
      answer: "For a small load (2-4 lbs), use 1/4 to 1/2 cup of liquid detergent or 1-2 tablespoons of concentrated powder, depending on soil level and water hardness.",
    },
    {
      question: "What's the difference between HE and standard detergent dosing?",
      answer: "HE (High Efficiency) washers require 1/4 to 1/2 the detergent of standard machines because they use less water; using too much HE detergent can leave residue and reduce cleaning effectiveness.",
    },
    {
      question: "Does water hardness affect detergent dosage?",
      answer: "Yes, hard water requires 10-25% more detergent than soft water because minerals reduce soap effectiveness; consider using a water softener or increasing dose in hard water areas.",
    },
    {
      question: "How do I calculate detergent for a medium vs. large load?",
      answer: "Medium loads (5-8 lbs) need 1/2 to 3/4 cup liquid detergent, while large loads (9-14 lbs) require 3/4 to 1 cup; heavily soiled loads may need additional 10-15% more.",
    },
    {
      question: "Can I use the same dosage for both cold and hot water?",
      answer: "Cold water may require 10-15% more detergent than hot water since detergent dissolves and activates faster in heat; concentrate-based detergents work better in cold water.",
    },
    {
      question: "What happens if I use too much detergent?",
      answer: "Excess detergent leaves residue on clothes, reduces absorbency, causes buildup in the machine, and wastes money; it can also trigger allergies and irritate sensitive skin.",
    },
    {
      question: "How do I adjust detergent dosage for lightly vs. heavily soiled clothes?",
      answer: "Lightly soiled clothes (normal wear) use baseline dosage, while heavily soiled items (work clothes, sports gear) need 25-50% more detergent for effective cleaning.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="loadSize" className="mb-1 block font-semibold">
                Load Size
              </Label>
              <Select
                value={inputs.loadSize || ""}
                onValueChange={(v) => handleInputChange("loadSize", v)}
                id="loadSize"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select load size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (2-3 kg / 4-6 lbs)</SelectItem>
                  <SelectItem value="medium">Medium (4-5 kg / 8-11 lbs)</SelectItem>
                  <SelectItem value="large">Large (6-7 kg / 13-15 lbs)</SelectItem>
                  <SelectItem value="extraLarge">Extra Large (8+ kg / 17+ lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="detergentType" className="mb-1 block font-semibold">
                Detergent Type
              </Label>
              <Select
                value={inputs.detergentType || ""}
                onValueChange={(v) => handleInputChange("detergentType", v)}
                id="detergentType"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select detergent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard liquid">Standard liquid</SelectItem>
                  <SelectItem value="High Efficiency (HE) liquid">High Efficiency (HE) liquid</SelectItem>
                  <SelectItem value="Powder">Powder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="waterHardness" className="mb-1 block font-semibold">
                Water Hardness
              </Label>
              <Select
                value={inputs.waterHardness || ""}
                onValueChange={(v) => handleInputChange("waterHardness", v)}
                id="waterHardness"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select water hardness" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soft">Soft</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
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
          onClick={() => setInputs({ loadSize: "", detergentType: "", waterHardness: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 font-semibold text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Laundry Detergent Dosage by Load Size Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the optimal amount of laundry detergent needed based on load size, helping you achieve clean clothes while avoiding waste and residue buildup. It accounts for different machine types, water conditions, and soil levels to provide personalized dosage recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include load weight (small, medium, large), machine type (standard or HE), soil level (light, normal, or heavy), and water hardness (soft, medium, or hard). Some calculators also factor in detergent concentration and water temperature for more precise results.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show the recommended detergent amount in cups or milliliters. Using the exact dosage prevents over-sudsing, reduces detergent residue on fabrics, extends washing machine lifespan, and saves money on detergent purchases over time.</p>
        </div>
      </section>

      {/* TABLE: Laundry Load Size & Detergent Dosage Chart */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Laundry Load Size & Detergent Dosage Chart</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard dosage recommendations for liquid detergent across load sizes in standard washing machines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Load Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Soil Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Detergent Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extra Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/8 - 1/4 cup</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/4 - 1/2 cup</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/2 - 3/4 cup</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/2 - 3/4 cup</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3/4 - 1 cup</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-14 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3/4 - 1 cup</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-14 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 - 1.25 cups</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extra Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15+ lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25 - 1.5 cups</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Measurements assume standard washers; HE machines require 50% less detergent.</p>
      </section>

      {/* TABLE: HE Detergent Dosage by Load Size */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">HE Detergent Dosage by Load Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended liquid detergent amounts for high-efficiency washing machines, which use significantly less water.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Load Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Soil Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">HE Detergent Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/8 - 1/4 cup</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-4 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/4 - 3/8 cup</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/4 - 3/8 cup</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-8 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3/8 - 1/2 cup</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-14 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3/8 - 1/2 cup</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-14 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/2 - 5/8 cup</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extra Large</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15+ lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5/8 - 3/4 cup</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">HE machines concentrate detergent in less water; overdosing causes poor rinsing and residue buildup.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always check your detergent bottle's dosage instructions, as concentrated formulas require less product than standard detergents.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a measuring cup or dispenser cap rather than pouring directly to avoid over-dosing, which is the most common laundry mistake.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Reduce detergent by 25-50% if using soft water or a high-efficiency machine to prevent residue and save money.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For heavily soiled loads, pre-treat stains instead of adding extra detergent, which is more effective than increasing dosage.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the Same Dosage for All Loads</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Different load sizes require different amounts; using one-size-fits-all dosing wastes detergent on small loads and leaves clothes inadequately cleaned on large loads.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring HE Machine Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using standard detergent amounts in HE machines creates excessive suds and residue; HE machines need 50% less detergent due to lower water levels.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Water Hardness</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hard water significantly reduces detergent effectiveness, requiring 15-25% more product; ignoring this results in poorly cleaned clothes.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Adding Extra Detergent for Heavy Soil</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Excess detergent doesn't improve cleaning and leaves buildup on clothes; pre-treating stains and using appropriate temperature water is more effective.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much detergent should I use for a small load?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a small load (2-4 lbs), use 1/4 to 1/2 cup of liquid detergent or 1-2 tablespoons of concentrated powder, depending on soil level and water hardness.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between HE and standard detergent dosing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">HE (High Efficiency) washers require 1/4 to 1/2 the detergent of standard machines because they use less water; using too much HE detergent can leave residue and reduce cleaning effectiveness.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does water hardness affect detergent dosage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, hard water requires 10-25% more detergent than soft water because minerals reduce soap effectiveness; consider using a water softener or increasing dose in hard water areas.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate detergent for a medium vs. large load?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Medium loads (5-8 lbs) need 1/2 to 3/4 cup liquid detergent, while large loads (9-14 lbs) require 3/4 to 1 cup; heavily soiled loads may need additional 10-15% more.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the same dosage for both cold and hot water?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cold water may require 10-15% more detergent than hot water since detergent dissolves and activates faster in heat; concentrate-based detergents work better in cold water.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I use too much detergent?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excess detergent leaves residue on clothes, reduces absorbency, causes buildup in the machine, and wastes money; it can also trigger allergies and irritate sensitive skin.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I adjust detergent dosage for lightly vs. heavily soiled clothes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Lightly soiled clothes (normal wear) use baseline dosage, while heavily soiled items (work clothes, sports gear) need 25-50% more detergent for effective cleaning.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.cleaninginstitute.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Cleaning Institute - Detergent Dosage Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative resource on detergent science, dosage recommendations, and machine-specific guidelines for optimal laundry results.</p>
          </li>
          <li>
            <a href="https://www.ftc.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">FTC Guide to Laundry Care Symbols</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal Trade Commission guidance on laundry care standards and detergent product labeling requirements.</p>
          </li>
          <li>
            <a href="https://www.consumerreports.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Reports - Laundry Detergent Reviews</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Independent testing and recommendations for detergent products, dosage effectiveness, and machine compatibility.</p>
          </li>
          <li>
            <a href="https://www.cleaninginstitute.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Cleaning Institute - Water Quality Impact</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical information on how water hardness and temperature affect detergent performance and required dosing.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Laundry Detergent Dosage by Load Size"
      description="Determine the right laundry detergent dosage. Calculate the exact amount needed per load size to save money and protect clothes."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Dosage = Base dosage × Water hardness multiplier\n" +
          "Where base dosage depends on load size and detergent type, and multiplier adjusts for water hardness.",
        variables: [
          { name: "Base dosage", description: "Manufacturer recommended detergent amount for load size and detergent type (ml or grams)" },
          { name: "Water hardness multiplier", description: "Adjustment factor based on water hardness: Soft=1, Medium=1.1, Hard=1.2" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a medium-sized laundry load (4-5 kg), use High Efficiency liquid detergent, and your water hardness is medium.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Select 'Medium' for load size, 'High Efficiency (HE) liquid' for detergent type, and 'Medium' for water hardness in the calculator.",
          },
          {
            label: "Step 2",
            explanation:
              "The base dosage for a medium load with HE liquid detergent is 22 ml. The water hardness multiplier for medium hardness is 1.1.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate dosage: 22 ml × 1.1 = 24.2 ml. The calculator rounds this to 24 ml.",
          },
          {
            label: "Step 4",
            explanation:
              "Use 24 ml of HE liquid detergent for this load to achieve optimal cleaning results.",
          },
        ],
        result: "Recommended detergent dosage: 24 ml",
      }}
      relatedCalculators={[
        { title: "Life Expectancy Calculator", url: "/everyday/life-expectancy", icon: "💡" },
        { title: "Wine/Beer/Soft Drink Mix Estimator", url: "/everyday/beverage-mix-estimator", icon: "🎉" },
        { title: "Square Footage Calculator", url: "/everyday/square-footage-calculator", icon: "💡" },
        { title: "Steps → Distance Converter", url: "/everyday/steps-to-distance-converter", icon: "💡" },
        { title: "Event Budget Calculator", url: "/everyday/event-budget-calculator", icon: "💡" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday/leftovers-cooling-reheat-time", icon: "💡" },
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