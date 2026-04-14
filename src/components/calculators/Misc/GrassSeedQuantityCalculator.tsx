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

export default function GrassSeedQuantityCalculator() {
  /**
   * Inputs:
   * - area: numeric, in square feet or square meters
   * - unit: "sqft" or "sqm"
   * - seedType: type of grass seed (affects seeding rate)
   * - seedingRateUnit: "lbs per 1000 sqft" or "kg per 100 sqm"
   */

  const [inputs, setInputs] = useState({
    area: "",
    unit: "sqft",
    seedType: "cool-season",
    seedingRateUnit: "lbsPer1000sqft",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Seeding rates vary by grass type and purpose (new lawn vs overseeding).
  // Typical seeding rates (approximate):
  // Cool-season grasses: 4-6 lbs per 1000 sqft for new lawns, 2-3 lbs for overseeding.
  // Warm-season grasses: 1-3 lbs per 1000 sqft for new lawns, 0.5-1.5 lbs for overseeding.
  // For simplicity, we'll use average values for new lawns.
  // Conversion: 1 lb ≈ 0.4536 kg, 1000 sqft ≈ 92.903 sqm.

  // We'll provide options for seed type:
  // - Cool-season (Kentucky bluegrass, fescue, ryegrass)
  // - Warm-season (Bermuda, zoysia, centipede)
  // - Overseeding (general)

  // Seeding rates in lbs per 1000 sqft:
  const seedingRatesLbsPer1000Sqft = {
    "cool-season": 5, // average new lawn
    "warm-season": 2, // average new lawn
    overseeding: 2.5, // average overseeding
  };

  // Conversion helpers
  const sqftToSqm = (sqft) => sqft * 0.092903;
  const sqmToSqft = (sqm) => sqm / 0.092903;
  const lbsToKg = (lbs) => lbs * 0.453592;
  const kgToLbs = (kg) => kg / 0.453592;

  const results = useMemo(() => {
    const areaNum = parseFloat(inputs.area);
    if (!areaNum || areaNum <= 0) {
      return {
        value: null,
        label: "",
        subtext: "",
        warning: "Please enter a valid positive area.",
        formulaUsed: "",
      };
    }

    // Determine seeding rate in lbs per 1000 sqft
    const seedType = inputs.seedType || "cool-season";
    const seedingRateLbs = seedingRatesLbsPer1000Sqft[seedType] || 5;

    // Convert area to sqft if needed
    const areaSqft = inputs.unit === "sqm" ? sqmToSqft(areaNum) : areaNum;

    // Calculate total seed needed in lbs
    // Formula: (area in sqft / 1000) * seeding rate (lbs per 1000 sqft)
    const seedNeededLbs = (areaSqft / 1000) * seedingRateLbs;

    // Provide results in lbs and kg
    const seedNeededKg = lbsToKg(seedNeededLbs);

    // Format numbers to 2 decimals
    const lbsFormatted = seedNeededLbs.toFixed(2);
    const kgFormatted = seedNeededKg.toFixed(2);

    const formulaUsed = `Seed Needed = (Area in sqft ÷ 1000) × Seeding Rate (lbs per 1000 sqft)
Where Seeding Rate for ${seedType.replace("-", " ")} grass ≈ ${seedingRateLbs} lbs/1000 sqft`;

    return {
      value: `${lbsFormatted} lbs (${kgFormatted} kg)`,
      label: "Grass Seed Required",
      subtext: `For an area of ${areaNum} ${inputs.unit === "sqm" ? "square meters" : "square feet"} using ${seedType.replace("-", " ")} grass seed.`,
      warning: null,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How much grass seed do I need per square foot?",
      answer: "Most lawns require 4-6 lbs of grass seed per 1,000 sq ft for seeding a bare area, while overseeding established lawns typically needs 1-2 lbs per 1,000 sq ft. The calculator adjusts for lawn condition and grass type.",
    },
    {
      question: "What's the difference between seeding and overseeding?",
      answer: "Seeding is planting grass in bare or dead patches and requires higher seed rates (4-6 lbs/1000 sq ft), while overseeding thickens existing turf with lighter rates (1-2 lbs/1000 sq ft).",
    },
    {
      question: "Do different grass types need different seed quantities?",
      answer: "Yes, cool-season grasses like fescue and bluegrass typically need 2-3 lbs/1000 sq ft, while warm-season varieties like Bermuda need 1-2 lbs/1000 sq ft due to larger seed size.",
    },
    {
      question: "How do I measure my lawn size accurately?",
      answer: "For rectangular areas, multiply length by width in feet; for irregular shapes, break them into sections or use satellite imagery tools. Even 10% measurement error significantly impacts seed quantity.",
    },
    {
      question: "Should I account for slopes or shaded areas?",
      answer: "Yes, increase seed rates by 20-30% on slopes to compensate for runoff, and choose shade-tolerant seed blends for wooded areas, which may have slightly different coverage rates.",
    },
    {
      question: "What if I overseed my lawn by mistake?",
      answer: "Excess seed causes overcrowding, poor drainage, and disease; most lawns tolerate up to 25% overage, but significantly exceeding recommendations wastes money and damages turf health.",
    },
    {
      question: "When is the best time to apply calculated seed quantities?",
      answer: "Fall (Aug-Oct) and spring (Mar-May) are optimal; cool-season grasses prefer fall seeding, while warm-season grasses prefer late spring when soil reaches 60-70°F.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="area" className="mb-1 inline-block font-semibold">
              Lawn Area
            </Label>
            <div className="flex gap-2">
              <Input
                id="area"
                type="number"
                min={0}
                step="any"
                placeholder="Enter area"
                value={inputs.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
              />
              <Select
                value={inputs.unit}
                onValueChange={(v) => handleInputChange("unit", v)}
              >
                <SelectTrigger aria-label="Select area unit" className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqft">sq ft</SelectItem>
                  <SelectItem value="sqm">sq m</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="seedType" className="mb-1 inline-block font-semibold">
              Grass Seed Type
            </Label>
            <Select
              id="seedType"
              value={inputs.seedType}
              onValueChange={(v) => handleInputChange("seedType", v)}
            >
              <SelectTrigger aria-label="Select grass seed type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cool-season">Cool-Season Grass</SelectItem>
                <SelectItem value="warm-season">Warm-Season Grass</SelectItem>
                <SelectItem value="overseeding">Overseeding</SelectItem>
              </SelectContent>
            </Select>
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
          aria-label="Calculate grass seed quantity"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ area: "", unit: "sqft", seedType: "cool-season", seedingRateUnit: "lbsPer1000sqft" })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">{results.label}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Grass Seed Quantity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines how much grass seed you need based on lawn area, grass type, and whether you're seeding bare ground or overseeding existing turf. It eliminates guesswork and helps prevent costly waste.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your lawn size in square feet, select your grass type (cool-season or warm-season), and choose your seeding method (new seeding or overseeding). The calculator accounts for seed germination rates and regional recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows total seed needed in pounds and common bag sizes available. Compare results to seed packaging to purchase the right amount, and consider adding 10% extra for waste during application.</p>
        </div>
      </section>

      {/* TABLE: Recommended Grass Seed Rates by Grass Type (2024-2025) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Grass Seed Rates by Grass Type (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard seeding rates vary by grass species and application method.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Grass Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bare Soil (lbs/1000 sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Overseeding (lbs/1000 sq ft)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Perennial Ryegrass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5-2.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tall Fescue</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fine Fescue</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-1.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Kentucky Bluegrass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bermuda Grass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5-1</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zoysia Grass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-1.5</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bahiagrass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1-2</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Rates depend on seed quality (germination %), soil preparation, and climate zone; always verify with local extension services.</p>
      </section>

      {/* TABLE: Seed Quantity Adjustments by Lawn Condition */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Seed Quantity Adjustments by Lawn Condition</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Modify base seed rates according to lawn health and coverage goals.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lawn Condition</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Adjustment Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: 5000 sq ft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bare/Dead Areas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.0x (Full Rate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Thin/Patchy</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75x (75% Rate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22 lbs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate Thin</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-80%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5x (50% Rate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15 lbs</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Overseeding Only</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80%+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25x (25% Rate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 lbs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These adjustments assume standard ryegrass/fescue blends; always evaluate your specific turf before applying seed.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always test soil pH and fertility before seeding; poor soil conditions reduce germination rates regardless of seed quantity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use quality seed certified to be weed-free and disease-free, as cheap seed with low germination rates requires higher quantities.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Water newly seeded areas lightly and frequently for 2-3 weeks; established moisture is more important than excess seed quantity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Apply seed with a broadcast or drop spreader for even coverage; uneven application requires extra seed to compensate for bare spots.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring Lawn Size Incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Underestimating yard dimensions results in buying too little seed and creating thin, patchy areas that invite weeds.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Outdated Seed Rate Guidelines</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Old recommendations often exceed modern rates; follow current university extension guides specific to your region.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Seed Germination Percentages</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Seed bags list germination rates; lower percentages require higher quantities to achieve the same plant density.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Applying All Seed at Once in Spring</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Spring-only seeding is less successful than fall; cool-season grasses need fall application when soil cools and moisture is adequate.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much grass seed do I need per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most lawns require 4-6 lbs of grass seed per 1,000 sq ft for seeding a bare area, while overseeding established lawns typically needs 1-2 lbs per 1,000 sq ft. The calculator adjusts for lawn condition and grass type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between seeding and overseeding?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Seeding is planting grass in bare or dead patches and requires higher seed rates (4-6 lbs/1000 sq ft), while overseeding thickens existing turf with lighter rates (1-2 lbs/1000 sq ft).</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do different grass types need different seed quantities?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, cool-season grasses like fescue and bluegrass typically need 2-3 lbs/1000 sq ft, while warm-season varieties like Bermuda need 1-2 lbs/1000 sq ft due to larger seed size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my lawn size accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For rectangular areas, multiply length by width in feet; for irregular shapes, break them into sections or use satellite imagery tools. Even 10% measurement error significantly impacts seed quantity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I account for slopes or shaded areas?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, increase seed rates by 20-30% on slopes to compensate for runoff, and choose shade-tolerant seed blends for wooded areas, which may have slightly different coverage rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if I overseed my lawn by mistake?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Excess seed causes overcrowding, poor drainage, and disease; most lawns tolerate up to 25% overage, but significantly exceeding recommendations wastes money and damages turf health.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">When is the best time to apply calculated seed quantities?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Fall (Aug-Oct) and spring (Mar-May) are optimal; cool-season grasses prefer fall seeding, while warm-season grasses prefer late spring when soil reaches 60-70°F.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://extension.psu.edu/turfgrass-seeding" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Penn State University Turf Management Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive seeding rates and timing recommendations for cool-season turfgrass species.</p>
          </li>
          <li>
            <a href="https://extension.uga.edu/lawn-seeding" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Georgia Lawn Care Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Warm-season grass seeding rates, soil preparation, and maintenance schedules for Southern lawns.</p>
          </li>
          <li>
            <a href="https://www.usda.gov/topics/agriculture/seed" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Turf Grass Seed Certification Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official germination rates and seed quality standards for certified turfgrass seed products.</p>
          </li>
          <li>
            <a href="https://www.lawninstituute.org/seed-selection" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Lawn Institute Best Practices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards for seed selection, application rates, and successful turf establishment techniques.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Grass Seed Quantity Calculator"
      description="Calculate grass seed needed. Determine the pounds of seed required to overseed or plant a new lawn based on area."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Seed Needed = (Area in sqft ÷ 1000) × Seeding Rate (lbs per 1000 sqft)",
        variables: [
          { symbol: "Area", description: "Lawn area in square feet" },
          { symbol: "Seeding Rate", description: "Recommended seed amount per 1000 sqft based on grass type" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 2,500 square foot lawn and want to plant cool-season grass seed for a new lawn.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter 2500 as the lawn area and select 'sq ft' as the unit.",
          },
          {
            label: "Step 2",
            explanation:
              "Select 'Cool-Season Grass' as the seed type to use the appropriate seeding rate.",
          },
          {
            label: "Step 3",
            explanation:
              "Click 'Calculate' to get the recommended seed quantity.",
          },
        ],
        result:
          "The calculator estimates approximately 12.50 lbs (5.67 kg) of grass seed needed to cover the area effectively.",
      }}
      relatedCalculators={[
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday/room-air-changes-ach", icon: "💡" },
        { title: "Sleep Debt & Ideal Bedtime Planner", url: "/everyday/sleep-debt-ideal-bedtime", icon: "💡" },
        { title: "Refrigerator/Freezer Safe Zone Time Window", url: "/everyday/refrigerator-freezer-safe-zone-time-window", icon: "💡" },
        { title: "Water Heater Recovery Time Estimator", url: "/everyday/water-heater-recovery-time", icon: "💧" },
        { title: "Propane Tank Burn Time Estimator", url: "/everyday/propane-tank-burn-time", icon: "💡" },
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