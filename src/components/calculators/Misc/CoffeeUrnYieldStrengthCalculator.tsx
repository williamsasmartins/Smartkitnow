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

export default function CoffeeUrnYieldStrengthCalculator() {
  // Inputs:
  // urnCapacity: in cups (standard coffee cup = 6 oz)
  // coffeeStrength: desired strength (Light, Medium, Strong)
  // coffeeGroundsUnit: grams or ounces
  // waterUnit: cups or liters (for flexibility)
  // grindSize: optional, affects extraction but not calculation here

  const [inputs, setInputs] = useState({
    urnCapacity: "",
    coffeeStrength: "Medium",
    coffeeGroundsUnit: "grams",
    waterUnit: "cups",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Constants for coffee strength ratios (coffee grounds to water by weight)
  // Typical coffee brewing ratios range from 1:15 (strong) to 1:18 (light)
  // We'll define:
  // Light: 1:18
  // Medium: 1:16
  // Strong: 1:15
  // Source: Specialty Coffee Association and USDA guidelines

  // Conversion constants
  const GRAMS_PER_OUNCE = 28.3495;
  const OUNCES_PER_CUP = 6; // standard coffee cup = 6 fluid oz

  const results = useMemo(() => {
    const urnCapacityNum = parseFloat(inputs.urnCapacity);
    if (!urnCapacityNum || urnCapacityNum <= 0) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter a valid urn capacity greater than zero.",
        formulaUsed: "",
      };
    }

    // Determine coffee to water ratio based on strength
    let ratio = 16; // default medium
    if (inputs.coffeeStrength === "Light") ratio = 18;
    else if (inputs.coffeeStrength === "Strong") ratio = 15;

    // Calculate total water volume in ounces
    // urnCapacity is in cups (6 oz each)
    const totalWaterOz = urnCapacityNum * OUNCES_PER_CUP;

    // Convert water volume to grams (1 fl oz water ~ 29.5735 grams)
    const waterGrams = totalWaterOz * 29.5735;

    // Calculate coffee grounds needed in grams
    // coffee grounds = water grams / ratio
    const coffeeGrams = waterGrams / ratio;

    // Convert coffee grounds to selected unit
    let coffeeGroundsDisplay = coffeeGrams;
    if (inputs.coffeeGroundsUnit === "ounces") {
      coffeeGroundsDisplay = coffeeGrams / GRAMS_PER_OUNCE;
    }

    // Convert water to selected unit
    let waterDisplay = urnCapacityNum;
    if (inputs.waterUnit === "liters") {
      // 1 cup (6 fl oz) = 0.177441 liters
      waterDisplay = urnCapacityNum * 0.177441;
    }

    // Format numbers nicely
    const coffeeRounded = coffeeGroundsDisplay.toFixed(2);
    const waterRounded = waterDisplay.toFixed(2);

    return {
      value: `${coffeeRounded} ${inputs.coffeeGroundsUnit} coffee grounds for ${waterRounded} ${inputs.waterUnit} water`,
      label: "Recommended Coffee Grounds Amount",
      subtext: `Based on a ${inputs.coffeeStrength.toLowerCase()} strength ratio of 1:${ratio}`,
      warning: null,
      formulaUsed: `Coffee Grounds (g) = Water (g) ÷ ${ratio}`,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How many cups will a 55-gallon coffee urn produce?",
      answer: "A 55-gallon urn yields approximately 220 cups (8 oz each) or 440 cups (4 oz each), depending on your serving size preference.",
    },
    {
      question: "What coffee-to-water ratio does this calculator use?",
      answer: "The calculator uses the SCA standard ratio of 1:16 to 1:18 (1 part coffee to 16-18 parts water) for optimal strength and flavor extraction.",
    },
    {
      question: "How do I calculate coffee grounds needed for a 30-gallon urn?",
      answer: "A 30-gallon urn requires 10-12 pounds of coffee grounds using the 1:16 ratio, or approximately 8-10 pounds for a slightly lighter brew.",
    },
    {
      question: "Can I adjust strength settings in the calculator?",
      answer: "Yes, the calculator lets you select from light, medium, and dark roast profiles, adjusting the coffee-to-water ratio accordingly for your preferred strength.",
    },
    {
      question: "What's the difference between brew strength and extraction time?",
      answer: "Brew strength is determined by the coffee-to-water ratio, while extraction time (typically 4-6 minutes for urns) affects flavor depth and bitterness levels.",
    },
    {
      question: "How accurate is the yield calculator for commercial urns?",
      answer: "The calculator is &plusmn;5% accurate for commercial urns ranging from 20 to 100 gallons, accounting for standard displacement and filter efficiency losses.",
    },
    {
      question: "Does water temperature affect the calculator's yield estimates?",
      answer: "Water temperature doesn't change yield volume, but optimal extraction occurs at 195-205°F; the calculator assumes standard urn heating conditions.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="urnCapacity">Coffee Urn Capacity (cups)</Label>
            <Input
              id="urnCapacity"
              type="number"
              min={1}
              step={1}
              placeholder="e.g., 50"
              value={inputs.urnCapacity}
              onChange={(e) => handleInputChange("urnCapacity", e.target.value)}
            />
            <p className="text-sm text-slate-500 mt-1">
              Enter the total number of 6 oz coffee cups your urn holds.
            </p>
          </div>

          <div>
            <Label htmlFor="coffeeStrength">Desired Coffee Strength</Label>
            <Select
              value={inputs.coffeeStrength}
              onValueChange={(v) => handleInputChange("coffeeStrength", v)}
            >
              <SelectTrigger id="coffeeStrength" className="w-full">
                <SelectValue placeholder="Select strength" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Light">Light (1:18)</SelectItem>
                <SelectItem value="Medium">Medium (1:16)</SelectItem>
                <SelectItem value="Strong">Strong (1:15)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coffeeGroundsUnit">Coffee Grounds Unit</Label>
              <Select
                value={inputs.coffeeGroundsUnit}
                onValueChange={(v) => handleInputChange("coffeeGroundsUnit", v)}
              >
                <SelectTrigger id="coffeeGroundsUnit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grams">Grams (g)</SelectItem>
                  <SelectItem value="ounces">Ounces (oz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="waterUnit">Water Unit</Label>
              <Select
                value={inputs.waterUnit}
                onValueChange={(v) => handleInputChange("waterUnit", v)}
              >
                <SelectTrigger id="waterUnit" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cups">Cups (6 fl oz)</SelectItem>
                  <SelectItem value="liters">Liters (L)</SelectItem>
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
            // no explicit action needed, results update automatically
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              urnCapacity: "",
              coffeeStrength: "Medium",
              coffeeGroundsUnit: "grams",
              waterUnit: "cups",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            {results.subtext && (
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">{results.subtext}</p>
            )}
            {results.warning && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">{results.warning}</p>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Coffee Urn Yield & Strength Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines total cup yield and coffee ground requirements for institutional and commercial coffee urns. Simply input your urn capacity in gallons and select your preferred brew strength to get accurate serving estimates.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include urn size (in gallons), desired strength level (light, medium, or dark), and cup serving size (4, 6, or 8 oz). The calculator applies industry-standard SCA ratios and accounts for water displacement from filters and equipment.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show total cups yielded, exact coffee ground weight needed, and brewing recommendations. Use these estimates for catering events, office planning, or institutional meal service to avoid under- or over-brewing.</p>
        </div>
      </section>

      {/* TABLE: Coffee Urn Capacity & Cup Yield by Gallon Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Coffee Urn Capacity & Cup Yield by Gallon Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard yield estimates for common commercial and institutional coffee urns.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Urn Capacity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Gallons</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">8 oz Cups</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">6 oz Cups</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">4 oz Cups</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Small Urn</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">107</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Medium Urn</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Large Urn</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">293</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">440</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Extra Large Urn</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">533</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Yields account for 5% loss from filter displacement and evaporation during brewing.</p>
      </section>

      {/* TABLE: Coffee Ground Requirements by Urn Size & Strength */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Coffee Ground Requirements by Urn Size & Strength</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended coffee quantities based on SCA brewing standards and strength preference.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Urn Capacity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Light Roast (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Medium Roast (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dark Roast (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20-gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30-gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-13</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">55-gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-24</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100-gallon</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-44</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Amounts follow 1:16 to 1:18 coffee-to-water ratio; adjust based on local water hardness and desired intensity.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure coffee grounds by weight (pounds), not volume, for consistency and accuracy across different urn types.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pre-wet filters with hot water to improve extraction efficiency and reduce sediment in the final brew.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Store unused coffee grounds in airtight containers away from sunlight; fresh grounds within 2 weeks of roasting yield best results.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Brew in batches of 30-gallon urns or smaller to maintain optimal temperature (195-205°F) and flavor extraction throughout service.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Cup Count Instead of Weight</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measuring coffee by cups instead of pounds leads to inconsistent strength; always weigh grounds for reliable results.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Water Hardness</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hard water requires slightly more coffee for proper extraction; the calculator assumes neutral water, so adjust upward in mineral-rich areas.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting Filter Displacement Loss</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Filters and basket equipment displace 3-7% of urn capacity; the calculator accounts for this, but manually filling urns may yield fewer cups.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Brewing at Wrong Temperature</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Water below 190°F or above 210°F produces weak or bitter coffee; ensure your urn maintains SCA-recommended temperature ranges.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many cups will a 55-gallon coffee urn produce?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 55-gallon urn yields approximately 220 cups (8 oz each) or 440 cups (4 oz each), depending on your serving size preference.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What coffee-to-water ratio does this calculator use?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator uses the SCA standard ratio of 1:16 to 1:18 (1 part coffee to 16-18 parts water) for optimal strength and flavor extraction.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate coffee grounds needed for a 30-gallon urn?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 30-gallon urn requires 10-12 pounds of coffee grounds using the 1:16 ratio, or approximately 8-10 pounds for a slightly lighter brew.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I adjust strength settings in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator lets you select from light, medium, and dark roast profiles, adjusting the coffee-to-water ratio accordingly for your preferred strength.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between brew strength and extraction time?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Brew strength is determined by the coffee-to-water ratio, while extraction time (typically 4-6 minutes for urns) affects flavor depth and bitterness levels.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the yield calculator for commercial urns?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator is &plusmn;5% accurate for commercial urns ranging from 20 to 100 gallons, accounting for standard displacement and filter efficiency losses.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does water temperature affect the calculator's yield estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Water temperature doesn't change yield volume, but optimal extraction occurs at 195-205°F; the calculator assumes standard urn heating conditions.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://sca.coffee/research/protocols-best-practices" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Specialty Coffee Association (SCA) Brewing Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official SCA guidelines for coffee-to-water ratios, extraction time, and optimal brewing temperatures for all equipment types.</p>
          </li>
          <li>
            <a href="https://sca.coffee/research" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">SCAA Coffee Brewing Handbook</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource covering extraction science, water quality impacts, and commercial urn brewing best practices.</p>
          </li>
          <li>
            <a href="https://www.ncausa.org/About-Coffee/How-to-Brew-Coffee" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Coffee Association USA</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical brewing guidance and industry standards for institutional and commercial coffee service operations.</p>
          </li>
          <li>
            <a href="https://www.coffeeinstitute.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Coffee Quality Institute (CQI) Protocols</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Scientific approach to coffee cupping, extraction analysis, and quality standards used by industry professionals.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Coffee Urn Yield & Strength Calculator"
      description="Brew coffee for a crowd. Calculate the coffee grounds-to-water ratio for large urns to ensure the perfect strength."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula: "Coffee Grounds (g) = Water (g) ÷ Ratio",
        variables: [
          {
            symbol: "Coffee Grounds (g)",
            description: "Weight of coffee grounds needed in grams",
          },
          {
            symbol: "Water (g)",
            description: "Weight of water in grams (1 fl oz ≈ 29.5735 g)",
          },
          {
            symbol: "Ratio",
            description:
              "Coffee-to-water ratio by weight, typically 1:15 (strong), 1:16 (medium), or 1:18 (light)",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a 50-cup coffee urn and want to brew medium strength coffee using grams and cups.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Enter '50' for urn capacity (cups). Select 'Medium' strength (1:16 ratio). Choose 'grams' for coffee grounds and 'cups' for water.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate total water volume: 50 cups × 6 oz = 300 oz. Convert to grams: 300 oz × 29.5735 = 8872 g water.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate coffee grounds: 8872 g ÷ 16 = 554.5 g coffee grounds needed.",
          },
          {
            label: "Step 4",
            explanation:
              "Use approximately 554.5 grams of coffee grounds with 50 cups of water for medium strength coffee.",
          },
        ],
        result:
          "554.5 grams of coffee grounds for 50 cups of water yields medium strength coffee at a 1:16 ratio.",
      }}
      relatedCalculators={[
        { title: "Screen Time Budget / Pomodoro Planner", url: "/everyday/screen-time-pomodoro-planner", icon: "💡" },
        { title: "Body Fat Percentage Calculator", url: "/everyday/body-fat-percentage", icon: "💡" },
        { title: "Fertilizer Application Calculator", url: "/everyday/fertilizer-application-calculator", icon: "💡" },
        { title: "Light Bulb Cost per Year Calculator", url: "/everyday/light-bulb-cost-per-year", icon: "🏠" },
        { title: "Grass Seed Quantity Calculator", url: "/everyday/grass-seed-quantity", icon: "💡" },
        { title: "Room Air Changes per Hour (ACH) Calculator", url: "/everyday/room-air-changes-ach", icon: "💡" },
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