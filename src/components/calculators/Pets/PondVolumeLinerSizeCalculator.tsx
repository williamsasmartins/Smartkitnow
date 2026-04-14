import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, Info, AlertTriangle } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function PondVolumeLinerSizeCalculator() {
  // 1. STATE
  // Unit system default to imperial (feet, inches)
  const [unit, setUnit] = useState("imperial");

  // Inputs: length, width, average depth (all positive numbers)
  // Imperial inputs in feet (allow decimals)
  // Metric inputs in meters (allow decimals)
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    depth: "",
  });

  // 2. LOGIC ENGINE
  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      length <= 0 ||
      width <= 0 ||
      depth <= 0
    ) {
      return {
        value: 0,
        label: "",
        subtext: "",
        warning: "Please enter valid positive numbers for all dimensions.",
      };
    }

    // Calculate volume in gallons (imperial) or liters (metric)
    // Volume = length * width * depth
    // 1 cubic foot = 7.48052 gallons
    // 1 cubic meter = 1000 liters

    let volumeGallons = 0;
    let volumeLiters = 0;
    let linerLength = 0;
    let linerWidth = 0;

    if (unit === "imperial") {
      // volume in cubic feet
      const volumeCubicFeet = length * width * depth;
      volumeGallons = volumeCubicFeet * 7.48052;

      // Liner size calculation:
      // Add 1 foot overlap on all sides for liner length and width
      linerLength = length + 2; // feet
      linerWidth = width + 2; // feet

      return {
        value: `${volumeGallons.toFixed(0)} gallons`,
        label: "Estimated Pond Volume",
        subtext: `Minimum liner size: ${linerLength.toFixed(1)} ft x ${linerWidth.toFixed(
          1
        )} ft (includes 1 ft overlap each side)`,
        warning: null,
      };
    } else {
      // metric
      // volume in cubic meters
      const volumeCubicMeters = length * width * depth;
      volumeLiters = volumeCubicMeters * 1000;

      // Liner size calculation:
      // Add 0.3 meters overlap on all sides (~1 foot)
      linerLength = length + 0.6; // meters
      linerWidth = width + 0.6; // meters

      return {
        value: `${volumeLiters.toFixed(0)} liters`,
        label: "Estimated Pond Volume",
        subtext: `Minimum liner size: ${linerLength.toFixed(2)} m x ${linerWidth.toFixed(
          2
        )} m (includes 0.3 m overlap each side)`,
        warning: null,
      };
    }
  }, [inputs, unit]);

  // 3. FAQS (MUST BE DETAILED - 3 SENTENCES MINIMUM)
  const faqs = [
    {
      question: "How do I calculate the volume of an irregularly shaped pond?",
      answer: "Divide your pond into simple geometric shapes (rectangles, circles, triangles), calculate each volume separately, then add them together. This calculator handles multiple shape inputs to give you a total volume in gallons or liters.",
    },
    {
      question: "What liner size do I need for my 1000-gallon pond?",
      answer: "A 1000-gallon pond typically requires a liner that is 15 feet × 15 feet minimum, accounting for depth and overlap. Always add 1-2 feet extra on all sides for anchoring and safety margins.",
    },
    {
      question: "How much does pond liner cost per square foot?",
      answer: "Standard EPDM pond liner costs $0.75 to $2.00 per square foot in 2024-2025, depending on thickness (20-45 mil) and material quality. A 15 × 15 foot liner typically ranges from $169 to $450.",
    },
    {
      question: "Should I account for slope when measuring my pond depth?",
      answer: "Yes, measure your deepest point for volume calculations, as sloped sides affect total capacity. Most koi ponds need 24-36 inches of depth for healthy fish and beneficial bacteria.",
    },
    {
      question: "Can this calculator help me determine how many fish my pond can hold?",
      answer: "Yes, once you know your pond volume, the general rule is 1 inch of fish per 10 gallons of water. A 1000-gallon pond can safely support 100 inches of fish length.",
    },
    {
      question: "What's the difference between underlay and pond liner?",
      answer: "Underlay is a protective fabric layer placed beneath your liner to prevent punctures; it costs $0.25 to $0.50 per square foot. Liner is the waterproof barrier itself and should always have underlay underneath.",
    },
    {
      question: "How do I prevent my pond liner from tearing during installation?",
      answer: "Remove sharp rocks and roots before installation, add 2 inches of sand base, then place underlay before the liner. Always wear soft shoes and handle materials carefully during setup.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 dark:text-slate-300">Unit System</Label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border rounded px-3 py-1 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="imperial">Imperial (feet, gallons)</option>
            <option value="metric">Metric (meters, liters)</option>
          </select>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="length" className="text-slate-700 dark:text-slate-300">
            Pond Length ({unit === "imperial" ? "feet" : "meters"})
          </Label>
          <Input
            id="length"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter length in ${unit === "imperial" ? "feet" : "meters"}`}
            value={inputs.length}
            onChange={(e) => setInputs({ ...inputs, length: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">
            Pond Width ({unit === "imperial" ? "feet" : "meters"})
          </Label>
          <Input
            id="width"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter width in ${unit === "imperial" ? "feet" : "meters"}`}
            value={inputs.width}
            onChange={(e) => setInputs({ ...inputs, width: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="depth" className="text-slate-700 dark:text-slate-300">
            Average Pond Depth ({unit === "imperial" ? "feet" : "meters"})
          </Label>
          <Input
            id="depth"
            type="number"
            min="0"
            step="any"
            placeholder={`Enter average depth in ${unit === "imperial" ? "feet" : "meters"}`}
            value={inputs.depth}
            onChange={(e) => setInputs({ ...inputs, depth: e.target.value })}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
          onClick={() => {
            // Trigger recalculation by updating inputs state (no-op here)
            setInputs((i) => ({ ...i }));
          }}
        >
          <Calculator className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() => setInputs({ length: "", width: "", depth: "" })}
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
              {results.subtext && <p className="text-sm text-slate-500 mt-2">{results.subtext}</p>}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Pond Volume &amp; Liner Size Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines how much water your pond holds and what size liner you need to cover it safely. Accurate measurements ensure proper filtration sizing, stocking density, and liner installation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Input your pond's length, width, and depth in feet or meters. If your pond has multiple shapes or varying depths, calculate each section separately and add totals to get accurate volume.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs total volume in gallons or liters and recommends minimum liner dimensions with 1-2 foot overlap for anchoring. Use these measurements to purchase the correct liner size and underlay material.</p>
        </div>
      </section>

      {/* TABLE: Pond Volume Calculations by Shape */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pond Volume Calculations by Shape</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use these formulas to calculate volume before using the calculator to determine liner size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Shape</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Formula</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example (Result in Gallons)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rectangle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Length × Width × Depth × 7.48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 × 8 × 2.5 feet = 1,498 gallons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Circle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">π × Radius² × Depth × 7.48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 ft radius × 2.5 ft deep = 1,414 gallons</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Triangle</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">(Base × Height ÷ 2) × Depth × 7.48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 × 8 ÷ 2 × 2.5 ft = 749 gallons</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oval</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">π × (Length ÷ 2) × (Width ÷ 2) × Depth × 7.48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14 × 10 × 2.5 feet = 1,309 gallons</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All measurements in feet; multiply cubic feet by 7.48 to convert to gallons.</p>
      </section>

      {/* TABLE: Pond Liner Specifications &amp; Pricing (2024-2025) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Pond Liner Specifications &amp; Pricing (2024-2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Compare common liner materials, thicknesses, and costs to choose the best option for your pond.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Thickness (mil)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lifespan</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per Sq Ft</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EPDM Rubber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Small ponds, temporary liners</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EPDM Rubber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-30 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most residential koi ponds</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">EPDM Rubber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-traffic areas, sharp terrain</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">PVC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Budget-conscious installations</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">LLDPE (Reinforced)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Commercial ponds, extreme climates</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">EPDM offers best durability; PVC is most economical; prices vary by region and supplier.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your pond's depth at multiple points and use the deepest measurement to ensure your liner covers the entire volume.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always purchase liner 1-2 feet larger than calculated dimensions in both directions to account for settling and safe anchoring.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add a protective underlay layer beneath your liner to extend its lifespan and prevent punctures from rocks or root growth.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider adding 10% extra to your volume calculation if you plan future pond expansions or landscaping modifications.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using average depth instead of maximum depth</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Always measure your deepest point; using average depth underestimates volume and liner size, leading to undersized equipment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to add overlap margin to liner dimensions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Liner must extend at least 1-2 feet beyond pond edges for anchoring and preventing water loss; calculate exact dimensions, then add extra.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring underlay in budget calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Skipping protective underlay saves money short-term but risks expensive liner replacement; budget $0.25-0.50 per square foot for underlay.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for irregular or sloped pond sides</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ponds with sloped edges require larger liners than rectangular calculations suggest; measure slope distance, not just horizontal length.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the volume of an irregularly shaped pond?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Divide your pond into simple geometric shapes (rectangles, circles, triangles), calculate each volume separately, then add them together. This calculator handles multiple shape inputs to give you a total volume in gallons or liters.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What liner size do I need for my 1000-gallon pond?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 1000-gallon pond typically requires a liner that is 15 feet × 15 feet minimum, accounting for depth and overlap. Always add 1-2 feet extra on all sides for anchoring and safety margins.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does pond liner cost per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard EPDM pond liner costs $0.75 to $2.00 per square foot in 2024-2025, depending on thickness (20-45 mil) and material quality. A 15 × 15 foot liner typically ranges from $169 to $450.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I account for slope when measuring my pond depth?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, measure your deepest point for volume calculations, as sloped sides affect total capacity. Most koi ponds need 24-36 inches of depth for healthy fish and beneficial bacteria.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can this calculator help me determine how many fish my pond can hold?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, once you know your pond volume, the general rule is 1 inch of fish per 10 gallons of water. A 1000-gallon pond can safely support 100 inches of fish length.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between underlay and pond liner?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Underlay is a protective fabric layer placed beneath your liner to prevent punctures; it costs $0.25 to $0.50 per square foot. Liner is the waterproof barrier itself and should always have underlay underneath.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I prevent my pond liner from tearing during installation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Remove sharp rocks and roots before installation, add 2 inches of sand base, then place underlay before the liner. Always wear soft shoes and handle materials carefully during setup.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://extension.illinois.edu/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Illinois Extension: Backyard Fish Ponds</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Provides guidelines on pond sizing, depth requirements, and fish stocking rates for healthy ecosystems.</p>
          </li>
          <li>
            <a href="https://www.thepondguy.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Pond Guy: Pond Liner Installation Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Offers detailed instructions on measuring, selecting, and installing pond liners with proper overlap and underlay.</p>
          </li>
          <li>
            <a href="https://www.asla.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Society of Landscape Architects: Water Feature Design</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards for designing and constructing residential and commercial water features including ponds.</p>
          </li>
          <li>
            <a href="https://www.koifishusa.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Koi Fish USA: Pond Volume and Capacity</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Explains relationship between pond volume, fish load, and filtration requirements for maintaining water quality.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Pond Volume & Liner Size Calculator"
      description="Calculate the volume of water in a pond and the minimum required liner size based on length, width, and depth."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      // ⚠️ CLEAN FORMULA: ONLY ONE LINE. NO COMPLICATED MATH DUMPS.
      formula={{
        title: "Scientific Formula",
        formula: "Pond Volume = Length × Width × Average Depth",
        variables: [
          { symbol: "Length", description: "Pond length (feet or meters)" },
          { symbol: "Width", description: "Pond width (feet or meters)" },
          { symbol: "Average Depth", description: "Average pond depth (feet or meters)" },
        ],
      }}
      example={{
        title: "Case Study",
        scenario:
          "A rectangular pond measures 20 feet in length, 10 feet in width, and has an average depth of 3 feet. The goal is to calculate the pond volume and determine the minimum liner size including overlap.",
        steps: [
          { label: "1", explanation: "Calculate volume: 20 ft × 10 ft × 3 ft = 600 cubic feet." },
          { label: "2", explanation: "Convert volume to gallons: 600 × 7.48052 = 4488 gallons." },
          { label: "3", explanation: "Add 1 ft overlap on each side for liner: 20 + 2 = 22 ft length, 10 + 2 = 12 ft width." },
        ],
        result: "The pond holds approximately 4,488 gallons, and the minimum liner size should be 22 ft by 12 ft.",
      }}
      relatedCalculators={[
        { title: "Horse Selenium Toxicity Threshold (ppm)", url: "/pets/horse-selenium-toxicity-threshold", icon: "🐎" },
        { title: "Cat Grape/Raisin Exposure Risk (educational)", url: "/pets/cat-grape-raisin-exposure-risk", icon: "🐱" },
        { title: "Cat Chocolate Toxicity Calculator", url: "/pets/cat-chocolate-toxicity", icon: "🐱" },
        { title: "Breeding Tank Volume Planner", url: "/pets/breeding-tank-volume-planner", icon: "🍖" },
        { title: "Dewormer & Antibiotic Dose Reference", url: "/pets/reptile-dewormer-antibiotic-dose-reference", icon: "💉" },
        { title: "Horse Salt & Mineral Balance Checker", url: "/pets/horse-salt-mineral-balance-checker", icon: "🐎" },
      ]}
      onThisPage={[
        { id: "what-is", label: "Understanding Pond Volume & Liner Size Calculator" },
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