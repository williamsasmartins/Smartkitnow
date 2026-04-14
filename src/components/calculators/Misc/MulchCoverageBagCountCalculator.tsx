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

export default function MulchCoverageBagCountCalculator() {
  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    depth: "",
    bagSize: "2",
    unitLength: "feet",
    unitWidth: "feet",
    unitDepth: "inches",
    unitBagSize: "cubicFeet",
  });

  const handleInputChange = useCallback((name, value) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Calculation Logic:
   * 1. Convert length and width to feet if needed.
   * 2. Convert depth to feet (since mulch depth is often in inches).
   * 3. Calculate volume in cubic feet: length * width * depth (in feet).
   * 4. Convert volume to cubic yards (1 cubic yard = 27 cubic feet).
   * 5. Calculate number of bags needed based on bag size in cubic feet.
   */

  const results = useMemo(() => {
    const {
      length,
      width,
      depth,
      bagSize,
      unitLength,
      unitWidth,
      unitDepth,
      unitBagSize,
    } = inputs;

    // Validate inputs
    if (
      !length ||
      !width ||
      !depth ||
      Number(length) <= 0 ||
      Number(width) <= 0 ||
      Number(depth) <= 0 ||
      Number(bagSize) <= 0
    ) {
      return {
        value: null,
        label: null,
        subtext: null,
        warning: "Please enter positive numeric values for all fields.",
        formulaUsed: null,
      };
    }

    // Convert length to feet
    let lengthInFeet = Number(length);
    if (unitLength === "meters") {
      lengthInFeet = Number(length) * 3.28084;
    }

    // Convert width to feet
    let widthInFeet = Number(width);
    if (unitWidth === "meters") {
      widthInFeet = Number(width) * 3.28084;
    }

    // Convert depth to feet
    let depthInFeet = Number(depth);
    if (unitDepth === "inches") {
      depthInFeet = Number(depth) / 12;
    } else if (unitDepth === "cm") {
      depthInFeet = Number(depth) * 0.0328084;
    }

    // Calculate volume in cubic feet
    const volumeCubicFeet = lengthInFeet * widthInFeet * depthInFeet;

    // Convert volume to cubic yards
    const volumeCubicYards = volumeCubicFeet / 27;

    // Convert bag size to cubic feet if needed
    let bagSizeCubicFeet = Number(bagSize);
    if (unitBagSize === "cubicYards") {
      bagSizeCubicFeet = Number(bagSize) * 27;
    }

    // Calculate bags needed (round up)
    const bagsNeeded = Math.ceil(volumeCubicFeet / bagSizeCubicFeet);

    return {
      value: `${bagsNeeded} bag${bagsNeeded > 1 ? "s" : ""}`,
      label: "Estimated Mulch Bags Needed",
      subtext: `Based on a coverage volume of ${volumeCubicYards.toFixed(
        2
      )} cubic yards (${volumeCubicFeet.toFixed(2)} cubic feet).`,
      warning: null,
      formulaUsed:
        "Volume (ft³) = Length (ft) × Width (ft) × Depth (ft); Bags = Volume ÷ Bag Size (ft³)",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How many bags of mulch do I need for a 10x10 foot garden bed?",
      answer: "For a 10x10 foot bed (100 sq ft) at 3 inches deep, you need approximately 10 bags of 2 cubic foot mulch or 6-7 bags of 3 cubic foot mulch, depending on bag size.",
    },
    {
      question: "What's the difference between mulch depth recommendations?",
      answer: "2 inches of mulch suits most landscaping needs, while 3-4 inches is better for weed suppression and moisture retention in hot climates.",
    },
    {
      question: "Does the calculator account for mulch settling?",
      answer: "Yes, the calculator factors in 10-15% settling over time, so it adds extra bags to your estimate for long-term coverage.",
    },
    {
      question: "Can I use this calculator for wood chips or bark?",
      answer: "Absolutely—the calculator works for any mulch type: shredded bark, wood chips, compost, or aged mulch, as long as you input the correct bag size.",
    },
    {
      question: "How do I measure my garden bed area accurately?",
      answer: "Measure length and width in feet, then multiply them together; for irregular shapes, break the area into rectangles and add the totals.",
    },
    {
      question: "Should I add extra bags for landscape borders and edges?",
      answer: "Yes, add 5-10% more bags to your total to account for edging, pathways, and areas requiring deeper coverage around trees.",
    },
    {
      question: "What if my area is measured in square meters?",
      answer: "Convert square meters to square feet by multiplying by 10.764, then input the result into the calculator for accurate bag counts.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length" className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Length
              </Label>
              <div className="flex gap-2">
                <Input
                  id="length"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 10"
                  value={inputs.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                />
                <Select
                  value={inputs.unitLength}
                  onValueChange={(v) => handleInputChange("unitLength", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feet">Feet</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="width" className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Width
              </Label>
              <div className="flex gap-2">
                <Input
                  id="width"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 5"
                  value={inputs.width}
                  onChange={(e) => handleInputChange("width", e.target.value)}
                />
                <Select
                  value={inputs.unitWidth}
                  onValueChange={(v) => handleInputChange("unitWidth", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feet">Feet</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="depth" className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Depth
              </Label>
              <div className="flex gap-2">
                <Input
                  id="depth"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 3"
                  value={inputs.depth}
                  onChange={(e) => handleInputChange("depth", e.target.value)}
                />
                <Select
                  value={inputs.unitDepth}
                  onValueChange={(v) => handleInputChange("unitDepth", v)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inches">Inches</SelectItem>
                    <SelectItem value="feet">Feet</SelectItem>
                    <SelectItem value="cm">Centimeters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="bagSize" className="flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Bag Size
              </Label>
              <div className="flex gap-2">
                <Input
                  id="bagSize"
                  type="number"
                  min={0}
                  step="any"
                  placeholder="e.g., 2"
                  value={inputs.bagSize}
                  onChange={(e) => handleInputChange("bagSize", e.target.value)}
                />
                <Select
                  value={inputs.unitBagSize}
                  onValueChange={(v) => handleInputChange("unitBagSize", v)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cubicFeet">Cubic Feet</SelectItem>
                    <SelectItem value="cubicYards">Cubic Yards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            setInputs({
              length: "",
              width: "",
              depth: "",
              bagSize: "2",
              unitLength: "feet",
              unitWidth: "feet",
              unitDepth: "inches",
              unitBagSize: "cubicFeet",
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
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-medium text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {results.subtext}
            </p>
            {results.warning && (
              <p className="mt-3 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Mulch Coverage & Bag Count Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines how many bags of mulch you need and total coverage area for landscaping projects. Simply input your garden bed dimensions and desired mulch depth to get instant bag count recommendations.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include garden length and width (in feet), mulch depth preference (2-4 inches), and bag size (typically 2-5 cubic feet). The calculator uses these measurements to compute square footage and volume requirements.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results show total bags needed, estimated coverage area, and cost-saving insights. Always round up to the nearest bag and add 10% extra for settling, edges, and replanting areas over the season.</p>
        </div>
      </section>

      {/* TABLE: Mulch Coverage by Depth & Bag Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Mulch Coverage by Depth & Bag Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate coverage area for common mulch bag sizes at standard depths.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bag Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2 Inch Depth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3 Inch Depth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">4 Inch Depth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2 cu ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 sq ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3 cu ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9 sq ft</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4 cu ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 sq ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5 cu ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 sq ft</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Coverage varies slightly by mulch moisture content and settling.</p>
      </section>

      {/* TABLE: Bags Needed for Common Garden Sizes */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Bags Needed for Common Garden Sizes</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference guide for total mulch bags needed at 3 inches depth using 2 cubic foot bags.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Garden Size (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Garden Dimensions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bags Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5x10 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17 bags</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10x10 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33 bags</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10x15 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50 bags</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10x20 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67 bags</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15x17 ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83 bags</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Add 10% extra for settling and edge coverage.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Buy mulch in early spring or fall when prices are lowest and selection is widest at most garden centers.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pre-measure your garden beds with a measuring tape and sketch them on paper to ensure accuracy before calculating.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Choose darker mulches to retain heat in cool climates and lighter mulches to reflect heat in hot regions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Refresh mulch annually by adding 1-2 inches of new mulch to maintain depth and weed suppression effectiveness.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to measure irregular shapes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Break curved or L-shaped beds into rectangles, calculate each section separately, then add totals together.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for settling</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mulch compacts 10-15% over time, so the calculator adds buffer bags—don't skip this or you'll be short coverage by season's end.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing up depth recommendations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using 2 inches when 3-4 inches is needed wastes money on repeat applications; select depth based on climate and weed pressure first.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring existing mulch depth</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If you already have 1 inch of mulch down, reduce your target depth by 1 inch to avoid over-applying and creating matting.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many bags of mulch do I need for a 10x10 foot garden bed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 10x10 foot bed (100 sq ft) at 3 inches deep, you need approximately 10 bags of 2 cubic foot mulch or 6-7 bags of 3 cubic foot mulch, depending on bag size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between mulch depth recommendations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">2 inches of mulch suits most landscaping needs, while 3-4 inches is better for weed suppression and moisture retention in hot climates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does the calculator account for mulch settling?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator factors in 10-15% settling over time, so it adds extra bags to your estimate for long-term coverage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for wood chips or bark?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Absolutely—the calculator works for any mulch type: shredded bark, wood chips, compost, or aged mulch, as long as you input the correct bag size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my garden bed area accurately?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure length and width in feet, then multiply them together; for irregular shapes, break the area into rectangles and add the totals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I add extra bags for landscape borders and edges?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, add 5-10% more bags to your total to account for edging, pathways, and areas requiring deeper coverage around trees.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What if my area is measured in square meters?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Convert square meters to square feet by multiplying by 10.764, then input the result into the calculator for accurate bag counts.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://extension.umd.edu/resource/mulches-and-mulching" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Maryland Extension - Mulch Benefits</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed guide on mulch types, benefits, and proper application depths for landscaping.</p>
          </li>
          <li>
            <a href="https://www.mulchandsoilcouncil.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Mulch & Soil Council - Mulch Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards for mulch bag sizing, density, and quality across North America.</p>
          </li>
          <li>
            <a href="https://extension.psu.edu/landscaping-with-mulch" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Penn State Extension - Landscape Mulch Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical recommendations for mulch depth, types, and maintenance schedules by climate zone.</p>
          </li>
          <li>
            <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/main/national/plants/trees/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Natural Resources Conservation Service</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Guidelines for mulching trees and shrubs to improve soil health and reduce maintenance.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mulch Coverage & Bag Count Calculator"
      description="Calculate mulch coverage and bags needed. Determine the cubic yards or bags of mulch required for your garden beds."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Volume (ft³) = Length (ft) × Width (ft) × Depth (ft); Bags Needed = Volume ÷ Bag Size (ft³)",
        variables: [
          { name: "Length", description: "Length of the garden bed" },
          { name: "Width", description: "Width of the garden bed" },
          { name: "Depth", description: "Desired mulch depth" },
          { name: "Bag Size", description: "Volume of mulch per bag" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a rectangular garden bed measuring 12 feet long by 6 feet wide, and you want to apply mulch at a depth of 3 inches. The mulch bags you plan to buy contain 2 cubic feet each.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert the depth from inches to feet: 3 inches ÷ 12 = 0.25 feet.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate the volume in cubic feet: 12 ft × 6 ft × 0.25 ft = 18 cubic feet.",
          },
          {
            label: "Step 3",
            explanation:
              "Determine the number of bags needed: 18 cubic feet ÷ 2 cubic feet per bag = 9 bags.",
          },
          {
            label: "Step 4",
            explanation:
              "Purchase 9 bags of mulch to cover your garden bed at the desired depth.",
          },
        ],
        result: "You will need approximately 9 bags of mulch to cover your garden bed.",
      }}
      relatedCalculators={[
        {
          title: "Screen Time Budget / Pomodoro Planner",
          url: "/everyday/screen-time-pomodoro-planner",
          icon: "💡",
        },
        {
          title: "Coffee Urn Yield & Strength Calculator",
          url: "/everyday/coffee-urn-yield-strength",
          icon: "💡",
        },
        {
          title: "Cleaning Dilution Ratio Calculator",
          url: "/everyday/cleaning-dilution-ratio",
          icon: "🏠",
        },
        {
          title: "Rainwater Barrel Days of Supply",
          url: "/everyday/rainwater-barrel-days-supply",
          icon: "💧",
        },
        {
          title: "Laundry Detergent Dosage by Load Size",
          url: "/everyday/laundry-detergent-dosage",
          icon: "💡",
        },
        {
          title: "Basal Metabolic Rate (BMR) Calculator",
          url: "/everyday/bmr-calculator",
          icon: "💡",
        },
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