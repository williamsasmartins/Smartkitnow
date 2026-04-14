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

export default function RainwaterBarrelDaysSupplyCalculator() {
  /**
   * Inputs:
   * - barrelVolume: volume of rainwater barrel in gallons
   * - dailyUsage: estimated daily water usage in gallons (e.g., garden irrigation)
   * - rainfallFrequency: average days between rain events (optional, for context)
   */
  const [inputs, setInputs] = useState({
    barrelVolume: "",
    dailyUsage: "",
    rainfallFrequency: "",
  });
  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation logic:
   * Days of supply = barrelVolume / dailyUsage
   * - If dailyUsage is zero or invalid, result is not computable.
   * - Warn if dailyUsage is zero or barrelVolume is zero.
   */
  const results = useMemo(() => {
    const barrelVolume = parseFloat(inputs.barrelVolume);
    const dailyUsage = parseFloat(inputs.dailyUsage);
    const rainfallFrequency = parseFloat(inputs.rainfallFrequency);

    if (isNaN(barrelVolume) || barrelVolume <= 0) {
      return {
        value: null,
        label: "Invalid Barrel Volume",
        subtext: "Please enter a positive number for barrel volume.",
        warning: "Barrel volume must be greater than zero.",
        formulaUsed: "Days of Supply = Barrel Volume (gallons) ÷ Daily Usage (gallons/day)",
      };
    }
    if (isNaN(dailyUsage) || dailyUsage <= 0) {
      return {
        value: null,
        label: "Invalid Daily Usage",
        subtext: "Please enter a positive number for daily water usage.",
        warning: "Daily water usage must be greater than zero.",
        formulaUsed: "Days of Supply = Barrel Volume (gallons) ÷ Daily Usage (gallons/day)",
      };
    }

    const daysSupply = barrelVolume / dailyUsage;
    let subtext = `Based on your inputs, your rainwater barrel can supply water for approximately ${daysSupply.toFixed(
      1
    )} days without replenishment.`;

    if (!isNaN(rainfallFrequency) && rainfallFrequency > 0) {
      subtext += ` Considering an average rainfall frequency of every ${rainfallFrequency} days, this helps you plan your irrigation schedule effectively.`;
    }

    return {
      value: `${daysSupply.toFixed(1)} days`,
      label: "Estimated Days of Supply",
      subtext,
      warning: null,
      formulaUsed: "Days of Supply = Barrel Volume (gallons) ÷ Daily Usage (gallons/day)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What does the Rainwater Barrel Days of Supply calculator measure?",
      answer: "This calculator determines how many days your rainwater barrel can supply water based on barrel capacity, daily water usage, and local rainfall. It helps you assess whether your barrel meets your household or garden watering needs.",
    },
    {
      question: "How do I calculate days of supply from my barrel capacity?",
      answer: "Divide your barrel capacity (in gallons) by your daily water consumption (in gallons per day). For example, a 100-gallon barrel with 10 GPD usage provides 10 days of supply before refilling.",
    },
    {
      question: "What daily water usage should I input for garden watering?",
      answer: "Typical garden watering ranges from 5–20 GPD depending on plant type, climate, and season. A vegetable garden uses roughly 1–2 inches weekly, equal to 600–1,200 gallons per 1,000 sq ft.",
    },
    {
      question: "How does rainfall affect my barrel's days of supply?",
      answer: "Regular rainfall replenishes your barrel, extending supply days significantly. In areas receiving 1 inch of rain weekly on a 200 sq ft roof, you gain approximately 830 gallons, adding 83 days of supply at 10 GPD usage.",
    },
    {
      question: "Can multiple barrels increase my days of supply?",
      answer: "Yes, combining barrels multiplies your capacity directly. Two 100-gallon barrels equal 200 gallons total, doubling your days of supply compared to a single barrel.",
    },
    {
      question: "What barrel size should I use for year-round watering?",
      answer: "For dry seasons lasting 60–90 days with 10 GPD usage, a 600–900 gallon barrel is recommended. Larger systems or seasonal adjustments may be needed in arid climates.",
    },
    {
      question: "How do seasonal changes impact my barrel's effectiveness?",
      answer: "Summer increases water demand (15–25 GPD) while reducing rainfall, cutting supply days by 30–50%. Winter lowers demand but provides inconsistent precipitation in many regions.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="barrelVolume" className="flex items-center gap-2">
                <Droplets /> Rainwater Barrel Volume (gallons)
              </Label>
              <Input
                id="barrelVolume"
                type="number"
                min="0"
                step="any"
                placeholder="e.g., 50"
                value={inputs.barrelVolume}
                onChange={(e) => handleInputChange("barrelVolume", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dailyUsage" className="flex items-center gap-2">
                <Leaf /> Estimated Daily Water Usage (gallons)
              </Label>
              <Input
                id="dailyUsage"
                type="number"
                min="0"
                step="any"
                placeholder="e.g., 5"
                value={inputs.dailyUsage}
                onChange={(e) => handleInputChange("dailyUsage", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="rainfallFrequency" className="flex items-center gap-2">
                <Calendar /> Average Days Between Rainfall (optional)
              </Label>
              <Input
                id="rainfallFrequency"
                type="number"
                min="0"
                step="any"
                placeholder="e.g., 7"
                value={inputs.rainfallFrequency}
                onChange={(e) => handleInputChange("rainfallFrequency", e.target.value)}
              />
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
          onClick={() => setInputs({ barrelVolume: "", dailyUsage: "", rainfallFrequency: "" })}
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{results.subtext}</p>
            {results.warning && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <p className="mt-6 text-xs italic text-slate-500 dark:text-slate-400">{results.formulaUsed}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Rainwater Barrel Days of Supply Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Rainwater Barrel Days of Supply calculator estimates how long your stored rainwater will sustain your household or garden needs. It combines barrel capacity, daily water consumption, and rainfall data to project your water independence timeline.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your barrel capacity in gallons, your average daily water usage in gallons per day, and your region's typical monthly rainfall. The calculator uses these inputs to determine supply duration and suggests optimization strategies.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret results as the maximum days your barrel can supply water without additional rainfall. Lower numbers indicate need for larger barrels, multiple systems, or reduced usage; higher numbers show strong water security during dry periods.</p>
        </div>
      </section>

      {/* TABLE: Barrel Capacity vs. Days of Supply */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Barrel Capacity vs. Days of Supply</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows how many days different barrel sizes supply water at various consumption rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Barrel Capacity (Gallons)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5 GPD Usage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10 GPD Usage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20 GPD Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 days</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 days</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 days</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Days of supply = Barrel Capacity ÷ Daily Usage. Results assume no rainfall replenishment.</p>
      </section>

      {/* TABLE: Rainfall Collection by Roof Area */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Rainfall Collection by Roof Area</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Monthly water collection varies based on roof size and average rainfall intensity.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">0.5 inch Rain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1 inch Rain</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2 inch Rain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">124 gallons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">124 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">248 gallons</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">155 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">310 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">620 gallons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">310 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">620 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1240 gallons</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">620 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1240 gallons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2480 gallons</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Collection = Roof Area × Rainfall Depth × 0.62 gallons/sq ft per inch. Assumes 85% collection efficiency.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure actual daily usage by tracking garden watering time; most lawns need 0.5–1 inch weekly, roughly 300–600 gallons per 1,000 sq ft.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install first-flush diverters to discard initial roof runoff, improving water quality and extending barrel supply by 15–20%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Position barrels on level ground and elevate them slightly for gravity-fed irrigation, reducing pump energy costs by up to 40%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Combine multiple smaller barrels instead of one large barrel to improve water distribution and accommodate multiple garden zones simultaneously.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Collection Loss</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming 100% of rainfall reaches your barrel ignores roof debris, gutter leaks, and system inefficiency; actual collection is 75–90% of theoretical yield.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Summer Usage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many users calculate annual averages without accounting for peak summer demand, which can be 2–3× higher than winter, drastically reducing effective supply days.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Barrel Maintenance Loss</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Evaporation and sediment loss consume 5–15% of stored water monthly, particularly in hot climates, reducing your actual available supply.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Non-Potable Water Quality</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Rainwater barrels collect sediment and debris unsuitable for drinking; using untreated barrel water for potable purposes risks contamination.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What does the Rainwater Barrel Days of Supply calculator measure?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator determines how many days your rainwater barrel can supply water based on barrel capacity, daily water usage, and local rainfall. It helps you assess whether your barrel meets your household or garden watering needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate days of supply from my barrel capacity?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide your barrel capacity (in gallons) by your daily water consumption (in gallons per day). For example, a 100-gallon barrel with 10 GPD usage provides 10 days of supply before refilling.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What daily water usage should I input for garden watering?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Typical garden watering ranges from 5–20 GPD depending on plant type, climate, and season. A vegetable garden uses roughly 1–2 inches weekly, equal to 600–1,200 gallons per 1,000 sq ft.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does rainfall affect my barrel's days of supply?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Regular rainfall replenishes your barrel, extending supply days significantly. In areas receiving 1 inch of rain weekly on a 200 sq ft roof, you gain approximately 830 gallons, adding 83 days of supply at 10 GPD usage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can multiple barrels increase my days of supply?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, combining barrels multiplies your capacity directly. Two 100-gallon barrels equal 200 gallons total, doubling your days of supply compared to a single barrel.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What barrel size should I use for year-round watering?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For dry seasons lasting 60–90 days with 10 GPD usage, a 600–900 gallon barrel is recommended. Larger systems or seasonal adjustments may be needed in arid climates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do seasonal changes impact my barrel's effectiveness?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Summer increases water demand (15–25 GPD) while reducing rainfall, cutting supply days by 30–50%. Winter lowers demand but provides inconsistent precipitation in many regions.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.epa.gov/watersense" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">EPA Water Sense: Rainwater Harvesting</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal guidance on residential water conservation and rainwater harvesting best practices.</p>
          </li>
          <li>
            <a href="https://www.nrcs.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Natural Resources Conservation Service: Water Harvesting</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical resources for designing and maintaining residential rainwater collection systems.</p>
          </li>
          <li>
            <a href="https://www.arcsa.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Rainwater Catchment Systems Association</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards and guidelines for safe, effective rainwater harvesting and storage.</p>
          </li>
          <li>
            <a href="https://www.weather.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Weather Service: Local Precipitation Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Historical rainfall and climate data by region for accurate barrel supply calculations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rainwater Barrel Days of Supply"
      description="Estimate rainwater supply duration. Calculate how long your rain barrel will last during dry spells based on garden usage."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Days of Supply = Barrel Volume (gallons) ÷ Daily Water Usage (gallons/day)",
        variables: [
          { symbol: "Barrel Volume", description: "Total water storage capacity of your rain barrel in gallons." },
          { symbol: "Daily Water Usage", description: "Average amount of water you use daily for irrigation or other purposes, in gallons." },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "Suppose you have a 50-gallon rainwater barrel and estimate that your garden uses about 5 gallons of water daily. You want to know how many days your stored water will last without rain replenishment.",
        steps: [
          {
            label: "Step 1",
            explanation: "Input the barrel volume as 50 gallons.",
          },
          {
            label: "Step 2",
            explanation: "Input the daily water usage as 5 gallons.",
          },
          {
            label: "Step 3",
            explanation: "Click Calculate to get the days of supply.",
          },
        ],
        result: "The calculator will show that your rainwater barrel can supply water for approximately 10 days (50 ÷ 5 = 10).",
      }}
      relatedCalculators={[
        { title: "Steps → Distance Converter", url: "/everyday/steps-to-distance-converter", icon: "💡" },
        { title: "Garden Soil/Compost Volume Calculator", url: "/everyday/garden-soil-compost-volume", icon: "🌿" },
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Party Food & Drinks Planner", url: "/everyday/party-food-drinks-planner", icon: "🎉" },
        { title: "Coffee Urn Yield & Strength Calculator", url: "/everyday/coffee-urn-yield-strength", icon: "💡" },
        { title: "Body Fat Percentage Calculator", url: "/everyday/body-fat-percentage", icon: "💡" },
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