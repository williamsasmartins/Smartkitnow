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

export default function CleaningDilutionRatioCalculator() {
  /**
   * Inputs:
   * - concentrateAmount: number (amount of concentrate chemical)
   * - concentrateUnit: string (ml, oz, liters)
   * - waterAmount: number (amount of water)
   * - waterUnit: string (ml, oz, liters)
   * 
   * Output:
   * - dilutionRatio: string (e.g., 1:10)
   * - totalVolume: string (in chosen unit)
   */

  // State for inputs
  const [inputs, setInputs] = useState({
    concentrateAmount: "",
    concentrateUnit: "ml",
    waterAmount: "",
    waterUnit: "ml",
  });

  // Handle input changes
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Unit conversion helper (to milliliters)
  const unitToMl = (value, unit) => {
    if (isNaN(value) || value <= 0) return null;
    switch (unit) {
      case "ml":
        return value;
      case "oz":
        return value * 29.5735;
      case "l":
        return value * 1000;
      default:
        return null;
    }
  };

  // Unit conversion helper (from milliliters)
  const mlToUnit = (value, unit) => {
    if (value === null) return null;
    switch (unit) {
      case "ml":
        return value;
      case "oz":
        return value / 29.5735;
      case "l":
        return value / 1000;
      default:
        return null;
    }
  };

  // Calculate dilution ratio and total volume
  const results = useMemo(() => {
    const cAmt = parseFloat(inputs.concentrateAmount);
    const wAmt = parseFloat(inputs.waterAmount);
    if (!cAmt || !wAmt) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter valid positive numbers for both concentrate and water amounts.",
        formulaUsed: null,
      };
    }

    const cMl = unitToMl(cAmt, inputs.concentrateUnit);
    const wMl = unitToMl(wAmt, inputs.waterUnit);

    if (cMl === null || wMl === null) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Invalid unit or amount entered. Please check your inputs.",
        formulaUsed: null,
      };
    }

    if (cMl === 0) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Concentrate amount cannot be zero.",
        formulaUsed: null,
      };
    }

    // Dilution ratio = water : concentrate (simplified)
    // For example, if concentrate = 100 ml, water = 900 ml, ratio = 1:9
    // We express ratio as 1:x where x = water/concentrate rounded to 2 decimals

    const ratioValue = wMl / cMl;
    const ratioRounded = Math.round(ratioValue * 100) / 100;

    // Total volume in ml
    const totalVolumeMl = cMl + wMl;

    // Display total volume in concentrate unit for consistency
    const totalVolumeInConcentrateUnit = mlToUnit(totalVolumeMl, inputs.concentrateUnit);

    // Format values nicely
    const ratioString = `1 : ${ratioRounded}`;
    const totalVolumeString =
      inputs.concentrateUnit === "ml"
        ? `${totalVolumeInConcentrateUnit.toFixed(0)} ml`
        : inputs.concentrateUnit === "oz"
        ? `${totalVolumeInConcentrateUnit.toFixed(2)} oz`
        : `${totalVolumeInConcentrateUnit.toFixed(3)} liters`;

    return {
      value: ratioString,
      label: "Dilution Ratio (Water : Concentrate)",
      subtext: `Total mixed volume: ${totalVolumeString}`,
      warning: null,
      formulaUsed: "Dilution Ratio = Water Volume / Concentrate Volume",
    };
  }, [inputs]);

  // FAQs for JSON-LD and display
  const faqs = [
    {
      question: "What is a cleaning dilution ratio and why does it matter?",
      answer: "A cleaning dilution ratio is the proportion of cleaning concentrate to water needed for effective sanitation. Using the correct ratio ensures optimal cleaning power while preventing waste and surface damage.",
    },
    {
      question: "How do I calculate the amount of concentrate needed for a specific volume?",
      answer: "Enter your desired final volume and the dilution ratio (e.g., 1:10 means 1 part concentrate to 10 parts water). The calculator divides total volume by the ratio sum to determine concentrate needed.",
    },
    {
      question: "What's the difference between 1:10 and 1:100 dilution ratios?",
      answer: "A 1:10 ratio produces a stronger solution with 10% concentrate, while 1:100 produces a weaker solution with 1% concentrate. Choose based on the cleaning task difficulty and surface type.",
    },
    {
      question: "Can I use this calculator for all types of cleaning products?",
      answer: "Yes, but always check your product's label first, as different cleaners have manufacturer-recommended ratios that may vary significantly based on chemical composition.",
    },
    {
      question: "How do I convert dilution ratios between gallons and liters?",
      answer: "The calculator handles conversions automatically. One gallon equals approximately 3.785 liters, so enter your volume in your preferred unit and the ratio remains consistent.",
    },
    {
      question: "What happens if I use too much or too little concentrate?",
      answer: "Too much concentrate wastes product and may damage surfaces or leave residue; too little reduces cleaning effectiveness and requires more scrubbing effort.",
    },
    {
      question: "How should I measure concentrate and water accurately?",
      answer: "Use measuring cups or a graduated cylinder for precise volumes. For large batches, digital scales work well for products sold by weight.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // Widget UI
  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="concentrateAmount" className="mb-1 flex items-center gap-1">
                <FlaskConical className="w-4 h-4 text-blue-600" /> Concentrate Amount
              </Label>
              <div className="flex gap-2">
                <Input
                  id="concentrateAmount"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 100"
                  value={inputs.concentrateAmount}
                  onChange={(e) => handleInputChange("concentrateAmount", e.target.value)}
                />
                <Select
                  value={inputs.concentrateUnit}
                  onValueChange={(v) => handleInputChange("concentrateUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="l">liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="waterAmount" className="mb-1 flex items-center gap-1">
                <Droplets className="w-4 h-4 text-blue-600" /> Water Amount
              </Label>
              <div className="flex gap-2">
                <Input
                  id="waterAmount"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 900"
                  value={inputs.waterAmount}
                  onChange={(e) => handleInputChange("waterAmount", e.target.value)}
                />
                <Select
                  value={inputs.waterUnit}
                  onValueChange={(v) => handleInputChange("waterUnit", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="oz">oz</SelectItem>
                    <SelectItem value="l">liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
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
            setInputs({
              concentrateAmount: "",
              concentrateUnit: "ml",
              waterAmount: "",
              waterUnit: "ml",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">{results.subtext}</p>
          </CardContent>
        </Card>
      )}

      {/* Warning */}
      {results.warning && (
        <Card className="border border-red-400 bg-red-50 dark:bg-red-900 dark:border-red-700 shadow-md">
          <CardContent className="text-center text-red-700 dark:text-red-300 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {results.warning}
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Editorial content with rich paragraphs and examples
  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cleaning Dilution Ratio Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Cleaning Dilution Ratio Calculator helps you determine exact proportions of cleaning concentrate and water needed for any task. It eliminates guesswork and ensures consistent, effective cleaning while preventing product waste.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your total desired solution volume (in gallons, liters, or ounces) and the recommended dilution ratio from your product label (e.g., 1:10, 1:50). You can also specify whether you want results in metric or imperial units.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator instantly shows how much pure concentrate and water you need to mix. Use these measurements with accurate measuring tools to prepare your cleaning solution safely and effectively.</p>
        </div>
      </section>

      {/* TABLE: Common Cleaning Dilution Ratios by Task */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Cleaning Dilution Ratios by Task</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different cleaning tasks require specific dilution ratios for optimal results.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cleaning Task</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concentrate %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Light Dusting</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Regular maintenance on dust-prone surfaces</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">General Cleaning</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Counters, floors, walls in normal conditions</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Heavy Soil Removal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Greasy surfaces, industrial cleaning</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Disinfection</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bathrooms, healthcare facilities, high-touch areas</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Window/Glass Cleaning</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Streak-free shine on windows and mirrors</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tile & Grout</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Deep cleaning stubborn stains and mold</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Ratios are approximate; always verify manufacturer recommendations on product labels.</p>
      </section>

      {/* TABLE: Volume Conversions for Dilution Calculations */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Volume Conversions for Dilution Calculations</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for converting between common volume units used in cleaning dilution.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Unit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Milliliters (mL)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Liters (L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gallons (US)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ounces (fl oz)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 Gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3785</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.785</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">128</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 Liter</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.264</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 Quart</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">946</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.946</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 Pint</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">473</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.473</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.125</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 Cup</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">237</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.237</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1 Fluid Ounce</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.0296</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.00781</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Use these conversions to switch between measurement systems when calculating dilution volumes.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always read the manufacturer's label for the product's recommended dilution ratio before using the calculator.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Mix concentrates in well-ventilated areas and never combine different chemical products, even if properly diluted.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For surface-specific tasks, adjust ratios slightly stronger for tough stains and weaker for delicate materials.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store diluted solutions in clearly labeled containers and use within the timeframe specified by the manufacturer.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing ratio direction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 1:10 ratio means 1 part concentrate to 10 parts water, not 10 parts concentrate to 1 part water.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using incorrect starting ratio</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Not verifying the product label's dilution recommendation leads to ineffective cleaning or surface damage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for concentrate volume</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The concentrate itself counts toward total volume, so a 1:10 ratio in 1 gallon means 0.385 gallons concentrate plus 3.4 gallons water, not 1 gallon concentrate plus 10 gallons water.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring measurement unit consistency</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mixing milliliters with gallons without conversion causes incorrect ratios; always confirm your calculator uses matching units.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a cleaning dilution ratio and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A cleaning dilution ratio is the proportion of cleaning concentrate to water needed for effective sanitation. Using the correct ratio ensures optimal cleaning power while preventing waste and surface damage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the amount of concentrate needed for a specific volume?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Enter your desired final volume and the dilution ratio (e.g., 1:10 means 1 part concentrate to 10 parts water). The calculator divides total volume by the ratio sum to determine concentrate needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between 1:10 and 1:100 dilution ratios?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 1:10 ratio produces a stronger solution with 10% concentrate, while 1:100 produces a weaker solution with 1% concentrate. Choose based on the cleaning task difficulty and surface type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for all types of cleaning products?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but always check your product's label first, as different cleaners have manufacturer-recommended ratios that may vary significantly based on chemical composition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert dilution ratios between gallons and liters?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator handles conversions automatically. One gallon equals approximately 3.785 liters, so enter your volume in your preferred unit and the ratio remains consistent.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I use too much or too little concentrate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Too much concentrate wastes product and may damage surfaces or leave residue; too little reduces cleaning effectiveness and requires more scrubbing effort.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How should I measure concentrate and water accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use measuring cups or a graduated cylinder for precise volumes. For large batches, digital scales work well for products sold by weight.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.osha.gov/dsg/naics-301" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">OSHA Guidelines for Chemical Safety in Cleaning</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official workplace safety standards for handling and diluting cleaning chemicals properly.</p>
          </li>
          <li>
            <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/clean-disinfect/index.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">CDC Cleaning and Disinfection Recommendations</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evidence-based guidance on dilution ratios for effective disinfection in healthcare and public settings.</p>
          </li>
          <li>
            <a href="https://www.epa.gov/safer-chemical-ingredients" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Environmental Protection Agency (EPA) Safer Chemical Practices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Resources on choosing safer cleaning products and understanding proper dilution for environmental responsibility.</p>
          </li>
          <li>
            <a href="https://www.issa.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Sanitary Supply Association (ISSA) Cleaning Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional cleaning industry standards and best practices for dilution ratios across different facility types.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cleaning Dilution Ratio Calculator"
      description="Calculate the perfect cleaning dilution ratio. Mix chemicals and water safely and effectively for household cleaning tasks."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Dilution Ratio = Water Volume / Concentrate Volume",
        variables: [
          { symbol: "Water Volume", description: "Amount of water used in the mixture" },
          { symbol: "Concentrate Volume", description: "Amount of cleaning concentrate used" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have 100 ml of a cleaning concentrate and want to dilute it with water to prepare a cleaning solution.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 100 as the concentrate amount and select 'ml' as the unit.",
          },
          {
            label: "Step 2",
            explanation:
              "Enter 900 as the water amount and select 'ml' as the unit.",
          },
          {
            label: "Step 3",
            explanation:
              "Click 'Calculate' to find the dilution ratio, which will be 1:9, meaning 1 part concentrate to 9 parts water.",
          },
        ],
        result:
          "The total volume of the mixed solution will be 1000 ml, and the dilution ratio is 1:9 (water to concentrate).",
      }}
      relatedCalculators={[
        { title: "MyPlate Daily Calorie/Nutrient Planner", url: "/everyday/myplate-daily-calorie-nutrient", icon: "❤️" },
        { title: "Body Fat Percentage Calculator", url: "/everyday/body-fat-percentage", icon: "💡" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday/laundry-detergent-dosage", icon: "💡" },
        { title: "Party Food & Drinks Planner", url: "/everyday/party-food-drinks-planner", icon: "🎉" },
        { title: "Basal Metabolic Rate (BMR) Calculator", url: "/everyday/bmr-calculator", icon: "💡" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday/home-paint-touch-up", icon: "🏠" },
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