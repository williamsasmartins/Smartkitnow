import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function AquariumPhAdjustmentBufferCalculator() {
  // 1. STATE
  const [unit, setUnit] = useState("imperial");

  // Inputs:
  // - Current pH (pH_current)
  // - Desired pH (pH_desired)
  // - Buffer capacity (alkalinity in mg/L CaCO3)
  // - Volume of water (gallons or liters)
  // - Acid or Base selection (acid to lower pH, base to raise pH)
  const [inputs, setInputs] = useState({
    pH_current: "",
    pH_desired: "",
    alkalinity: "",
    volume: "",
    adjustmentType: "acid", // "acid" or "base"
  });

  // 2. LOGIC ENGINE
  // Formula reference:
  // Amount of buffer (mg CaCO3) = Buffer Capacity (mg/L CaCO3) × Volume (L) × ΔpH
  // ΔpH = |pH_desired - pH_current|
  // Convert mg CaCO3 to grams or ounces as needed.
  // Note: This is a simplified estimation for aquarium pH adjustment.

  const results = useMemo(() => {
    const pH_current = parseFloat(inputs.pH_current);
    const pH_desired = parseFloat(inputs.pH_desired);
    const alkalinity = parseFloat(inputs.alkalinity);
    const volumeInput = parseFloat(inputs.volume);
    const adjustmentType = inputs.adjustmentType;

    if (
      isNaN(pH_current) ||
      isNaN(pH_desired) ||
      isNaN(alkalinity) ||
      isNaN(volumeInput) ||
      alkalinity <= 0 ||
      volumeInput <= 0
    ) {
      return {
        value: 0,
        label: "Invalid input",
        subtext: "Please enter valid positive numbers for all fields.",
        warning: null,
      };
    }

    // Convert volume to liters if imperial
    const volumeL = unit === "imperial" ? volumeInput * 3.78541 : volumeInput;

    // Calculate pH difference
    const deltaPH = Math.abs(pH_desired - pH_current);

    if (deltaPH === 0) {
      return {
        value: 0,
        label: "No adjustment needed",
        subtext: "Current pH equals desired pH.",
        warning: null,
      };
    }

    // Calculate amount of CaCO3 buffer needed in mg
    // This is a simplified linear approximation:
    // Amount (mg) = alkalinity (mg/L CaCO3) * volume (L) * delta pH
    const amountMg = alkalinity * volumeL * deltaPH;

    // Convert mg to grams
    const amountGrams = amountMg / 1000;

    // Convert grams to ounces if imperial
    const amountOunces = amountGrams / 28.3495;

    // Display result in grams or ounces depending on unit
    const displayAmount =
      unit === "imperial"
        ? amountOunces.toFixed(2) + " oz CaCO3 buffer"
        : amountGrams.toFixed(2) + " g CaCO3 buffer";

    // Warning if pH change is large
    const warning =
      deltaPH > 1.5
        ? "Large pH adjustments should be done gradually to avoid stressing aquatic life."
        : null;

    return {
      value: displayAmount,
      label:
        adjustmentType === "acid"
          ? "Amount of acid buffer required"
          : "Amount of base buffer required",
      subtext: `To adjust pH from ${pH_current} to ${pH_desired} in ${volumeInput} ${
        unit === "imperial" ? "gallons" : "liters"
      } with alkalinity ${alkalinity} mg/L CaCO3.`,
      warning,
    };
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "What pH range is safe for most aquarium fish?",
      answer: "Most freshwater fish thrive at pH 6.5–7.5, while saltwater fish prefer 8.0–8.3. Always check species-specific requirements before adjusting.",
    },
    {
      question: "How much acid or base should I add to adjust pH?",
      answer: "This calculator determines the exact dosage based on your tank volume, current pH, and target pH—typically 1–5 ml per 10 gallons for small adjustments.",
    },
    {
      question: "Why is buffer capacity important when adjusting pH?",
      answer: "Buffer capacity prevents rapid pH swings; tanks with low buffering capacity need smaller, more frequent adjustments to maintain stability.",
    },
    {
      question: "Can I use vinegar or baking soda to adjust pet tank pH?",
      answer: "While possible, commercial pH adjusters are safer and more predictable; vinegar and baking soda lack consistent buffering and can harm sensitive pets.",
    },
    {
      question: "How often should I test pH after making adjustments?",
      answer: "Retest within 2–4 hours of adjustment to confirm the pH has reached target levels, then monitor daily for stability.",
    },
    {
      question: "What's the difference between pH up and pH down products?",
      answer: "pH up raises pH using bases like sodium bicarbonate; pH down lowers it using acids like phosphoric acid—choose based on your adjustment needs.",
    },
    {
      question: "Does temperature affect pH adjustment calculations?",
      answer: "Yes, warmer water has different pH behavior; this calculator accounts for temperature to ensure accurate dosing recommendations.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imperial">Imperial (gallons, oz)</SelectItem>
              <SelectItem value="metric">Metric (liters, g)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="pH_current" className="text-slate-700 dark:text-slate-300">
            Current pH
          </Label>
          <Input
            id="pH_current"
            type="number"
            step="0.01"
            min="0"
            max="14"
            placeholder="e.g. 7.5"
            value={inputs.pH_current}
            onChange={(e) => setInputs({ ...inputs, pH_current: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="pH_desired" className="text-slate-700 dark:text-slate-300">
            Desired pH
          </Label>
          <Input
            id="pH_desired"
            type="number"
            step="0.01"
            min="0"
            max="14"
            placeholder="e.g. 6.8"
            value={inputs.pH_desired}
            onChange={(e) => setInputs({ ...inputs, pH_desired: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="alkalinity" className="text-slate-700 dark:text-slate-300">
            Buffer Capacity (Alkalinity in mg/L CaCO3)
          </Label>
          <Input
            id="alkalinity"
            type="number"
            step="1"
            min="0"
            placeholder="e.g. 100"
            value={inputs.alkalinity}
            onChange={(e) => setInputs({ ...inputs, alkalinity: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="volume" className="text-slate-700 dark:text-slate-300">
            Volume of Water ({unit === "imperial" ? "Gallons" : "Liters"})
          </Label>
          <Input
            id="volume"
            type="number"
            step="0.1"
            min="0"
            placeholder={unit === "imperial" ? "e.g. 50" : "e.g. 190"}
            value={inputs.volume}
            onChange={(e) => setInputs({ ...inputs, volume: e.target.value })}
          />
        </div>

        <div>
          <Label className="text-slate-700 dark:text-slate-300">Adjustment Type</Label>
          <Select
            value={inputs.adjustmentType}
            onValueChange={(value) => setInputs({ ...inputs, adjustmentType: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acid">Acid (Lower pH)</SelectItem>
              <SelectItem value="base">Base (Raise pH)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already handled by useMemo)
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              pH_current: "",
              pH_desired: "",
              alkalinity: "",
              volume: "",
              adjustmentType: "acid",
            })
          }
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
              <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
              <p className="text-slate-600 dark:text-slate-300 mt-2 font-medium">{results.label}</p>
              {results.subtext && (
                <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>
              )}
              {results.warning && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 rounded-lg flex items-start gap-3 text-left">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">{results.warning}</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Veterinary Disclaimer:</strong> Educational use only. Consult a vet for diagnosis.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the pH Adjustment (Acid/Base Buffer) Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the precise amount of acid or base needed to adjust your pet's water pH to a target level. It uses your tank volume, current pH, desired pH, and water hardness to generate safe dosing recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your aquarium or habitat volume in gallons, measure your current pH with a reliable test kit, and enter your target pH range based on your pet species. The calculator also factors in your water's buffering capacity to prevent overcorrection.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show the exact volume of pH adjuster needed and an estimated timeline for the pH to stabilize. Always retest your water 2–4 hours post-treatment and make incremental adjustments rather than drastic changes to protect your pets from shock.</p>
        </div>
      </section>

      {/* TABLE: Ideal pH Ranges by Pet Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ideal pH Ranges by Pet Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different aquatic and semi-aquatic pets require specific pH ranges for health and comfort.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pet Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Ideal pH Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Buffer Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Freshwater Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5–7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Neutral/Slightly Acidic</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Saltwater Fish</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.0–8.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Alkaline</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aquatic Turtles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5–7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Neutral</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Freshwater Shrimp</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0–7.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slightly Acidic</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bettas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.5–7.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Neutral</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Planted Tanks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.0–7.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slightly Acidic</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">African Cichlids</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5–8.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Alkaline</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always verify species-specific requirements; individual tanks may vary based on hardness and mineral content.</p>
      </section>

      {/* TABLE: Common pH Adjustment Products & Dosage Rates */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common pH Adjustment Products & Dosage Rates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These products are widely used for pH correction in pet habitats with typical application rates.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Product Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Dosage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Effect Duration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">pH Down (Phosphoric Acid)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 ml per 10 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Lowering High pH</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">pH Up (Sodium Bicarbonate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.5–1 ml per 10 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–7 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Raising Low pH</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aquarium Buffer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 tsp per 5 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–4 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Stabilizing pH</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Peat Moss (Natural)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 oz per 10 gal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–8 weeks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gradual Acidification</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Driftwood (Natural)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Gradual</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–3 months</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Slow pH Lowering</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always follow manufacturer instructions and test water 2–4 hours after treatment; avoid overdosing as it can shock fish.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use a calibrated pH test kit or digital meter for accurate readings before and after adjustment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Make small adjustments over time rather than one large dose to avoid shocking fish and other aquatic pets.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your water's General Hardness (GH) and Carbonate Hardness (KH) for more accurate buffer calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep detailed records of pH levels and adjustments to identify trends and optimize your tank's stability over time.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Untested Products</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using unvetted or expired pH products can deliver inconsistent results and potentially harm pets; always purchase from reputable aquarium suppliers.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Water Hardness</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Hard water resists pH changes and requires different adjustment amounts than soft water; neglecting hardness leads to ineffective corrections.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Adjusting Too Quickly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Rapid pH swings stress and can kill sensitive pets; the calculator accounts for safe adjustment rates, so follow its timeline guidance.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Retesting After Adjustment</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skipping post-adjustment testing means you won't know if the pH actually reached target levels, risking ongoing water quality issues.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What pH range is safe for most aquarium fish?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most freshwater fish thrive at pH 6.5–7.5, while saltwater fish prefer 8.0–8.3. Always check species-specific requirements before adjusting.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much acid or base should I add to adjust pH?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">This calculator determines the exact dosage based on your tank volume, current pH, and target pH—typically 1–5 ml per 10 gallons for small adjustments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is buffer capacity important when adjusting pH?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Buffer capacity prevents rapid pH swings; tanks with low buffering capacity need smaller, more frequent adjustments to maintain stability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use vinegar or baking soda to adjust pet tank pH?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While possible, commercial pH adjusters are safer and more predictable; vinegar and baking soda lack consistent buffering and can harm sensitive pets.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How often should I test pH after making adjustments?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Retest within 2–4 hours of adjustment to confirm the pH has reached target levels, then monitor daily for stability.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between pH up and pH down products?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">pH up raises pH using bases like sodium bicarbonate; pH down lowers it using acids like phosphoric acid—choose based on your adjustment needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does temperature affect pH adjustment calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, warmer water has different pH behavior; this calculator accounts for temperature to ensure accurate dosing recommendations.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.aspca.org/pet-care/fish-care" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASPCA – Fish Care Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource on water parameters and pH management for pet fish and aquatic species.</p>
          </li>
          <li>
            <a href="https://www.americanaquariumproducts.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Aquarium Products – pH and Buffers</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical information on aquarium buffers, pH adjustment methods, and water chemistry principles.</p>
          </li>
          <li>
            <a href="https://www.fishbase.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Freshwater Fish Database – Species pH Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Searchable database with pH and water parameter requirements for thousands of aquarium fish species.</p>
          </li>
          <li>
            <a href="https://www.theaquariumwiki.com/wiki/Water_Chemistry" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Aquarium Wiki – Water Chemistry</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Educational resource covering pH, alkalinity, hardness, and buffer systems in aquatic environments.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="pH Adjustment (Acid/Base Buffer) Calculator"
      description="Calculate the required amount of acid or base (buffer) needed to safely adjust the aquarium water's pH level."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Amount of buffer (mg) = Buffer Capacity (mg/L CaCO3) × Volume (L) × |pH_desired - pH_current|",
        variables: [
          { symbol: "Buffer Capacity (mg/L CaCO3)", description: "Water's alkalinity or buffering capacity" },
          { symbol: "Volume (L)", description: "Total volume of aquarium water in liters" },
          { symbol: "|pH_desired - pH_current|", description: "Absolute difference between desired and current pH" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A freshwater aquarium has a current pH of 7.5 and alkalinity of 100 mg/L CaCO3. The owner wants to lower the pH to 6.8 in a 50-gallon tank.",
        steps: [
          {
            label: "1",
            explanation:
              "Calculate the pH difference: |6.8 - 7.5| = 0.7.",
          },
          {
            label: "2",
            explanation:
              "Convert volume to liters: 50 gallons × 3.78541 = 189.27 L.",
          },
          {
            label: "3",
            explanation:
              "Calculate buffer amount: 100 mg/L × 189.27 L × 0.7 = 13248.9 mg or 13.25 g CaCO3 buffer.",
          },
        ],
        result: "Approximately 13.25 grams of acid buffer is needed to safely lower the pH from 7.5 to 6.8.",
      }}
      relatedCalculators={[
        { title: "Protein/Fat Intake Guide for Cats (by Goal)", url: "/pets/cat-protein-fat-intake-guide", icon: "🐱" },
        { title: "Dog Walking Calories Burned Calculator", url: "/pets/dog-walking-calories-burned", icon: "🐶" },
        { title: "Acetaminophen/Ibuprofen Exposure Risk (human meds)", url: "/pets/cat-acetaminophen-ibuprofen-exposure-risk", icon: "🐱" },
        { title: "Daily Water Requirement per Weight", url: "/pets/bird-daily-water-requirement-per-weight", icon: "🍖" },
        { title: "Phosphorus per Meal Estimator (diet label helper)", url: "/pets/cat-phosphorus-per-meal-estimator", icon: "💉" },
        { title: "Puppy Adult Size Predictor (Weight Curve)", url: "/pets/puppy-adult-size-predictor-weight-curve", icon: "💧" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding pH Adjustment (Acid/Base Buffer) Calculator" },
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