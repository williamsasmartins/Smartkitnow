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

export default function GardenSoilCompostVolumeCalculator() {
  /**
   * Inputs:
   * - length (ft)
   * - width (ft)
   * - depth (inches)
   * - material type (soil, compost, mix)
   * 
   * Output:
   * - volume in cubic feet and cubic yards
   * - weight estimate (optional, based on material density)
   */

  const [inputs, setInputs] = useState({
    length: "",
    width: "",
    depth: "",
    material: "soil",
  });

  const handleInputChange = useCallback((name, value) => {
    // Allow only numbers and decimal points for numeric inputs
    if (["length", "width", "depth"].includes(name)) {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setInputs((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  /**
   * Material densities (approximate, in lbs per cubic foot):
   * - Topsoil: 75 lbs/ft³
   * - Compost: 40 lbs/ft³
   * - Mix (50/50): 57.5 lbs/ft³
   * 
   * Volume formula:
   * Volume (ft³) = length (ft) * width (ft) * depth (ft)
   * Depth input is in inches, convert to feet by dividing by 12.
   * 
   * Convert cubic feet to cubic yards:
   * 1 cubic yard = 27 cubic feet
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depthInches = parseFloat(inputs.depth);
    const material = inputs.material;

    if (
      isNaN(length) ||
      length <= 0 ||
      isNaN(width) ||
      width <= 0 ||
      isNaN(depthInches) ||
      depthInches <= 0
    ) {
      return {
        value: null,
        label: "",
        subtext: null,
        warning: "Please enter valid positive numbers for all dimensions.",
        formulaUsed: "",
      };
    }

    const depthFeet = depthInches / 12;
    const volumeCubicFeet = length * width * depthFeet;
    const volumeCubicYards = volumeCubicFeet / 27;

    // Material densities in lbs/ft³
    const densities = {
      soil: 75,
      compost: 40,
      mix: 57.5,
    };

    const density = densities[material] || densities.soil;
    const weightLbs = volumeCubicFeet * density;

    return {
      value: `${volumeCubicFeet.toFixed(2)} ft³ (${volumeCubicYards.toFixed(2)} yd³)`,
      label: `Estimated Volume of ${material === "soil" ? "Topsoil" : material === "compost" ? "Compost" : "Soil/Compost Mix"}`,
      subtext: `Approximate weight: ${weightLbs.toFixed(0)} lbs`,
      warning: null,
      formulaUsed:
        "Volume (ft³) = Length (ft) × Width (ft) × Depth (ft); Depth (ft) = Depth (in) ÷ 12",
    };
  }, [inputs]);

  const faqs = [
    {
      question: "How do I calculate soil volume for a raised bed?",
      answer: "Measure the length, width, and depth of your raised bed in feet, then enter these dimensions into the calculator. It will instantly convert to cubic feet or cubic yards needed.",
    },
    {
      question: "What's the difference between garden soil and compost?",
      answer: "Garden soil is mineral-based with nutrients, while compost is decomposed organic matter rich in beneficial microbes. Most gardeners blend 50-70% soil with 30-50% compost for optimal results.",
    },
    {
      question: "How much does a cubic yard of garden soil weigh?",
      answer: "A cubic yard of dry garden soil weighs approximately 1,300-1,500 lbs, while wet soil can weigh 1,600-2,000 lbs depending on moisture and composition.",
    },
    {
      question: "Can I use this calculator for container gardening?",
      answer: "Yes, simply measure your container's length, width, and depth in inches or feet, and the calculator will compute the exact volume needed to fill it.",
    },
    {
      question: "How do I convert cubic feet to bags of soil?",
      answer: "Standard soil bags are typically 2 cubic feet. Divide your total cubic feet by 2 to get the number of bags needed, accounting for settling.",
    },
    {
      question: "Should I account for soil settling when ordering?",
      answer: "Yes, add 10-15% extra to your calculated volume since soil settles over time, especially in the first few weeks after planting.",
    },
    {
      question: "What measurements do I need for an irregularly shaped garden bed?",
      answer: "Break irregular shapes into smaller rectangles, calculate each section separately, then add the volumes together for a total amount needed.",
    }
  ];

  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="length" className="mb-1 flex items-center gap-1">
              Length (feet) <Scale className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="length"
              type="text"
              placeholder="e.g., 10"
              value={inputs.length}
              onChange={(e) => handleInputChange("length", e.target.value)}
              aria-describedby="length-desc"
            />
            <p id="length-desc" className="text-xs text-slate-500 mt-1">
              Enter the length of your garden bed in feet.
            </p>
          </div>

          <div>
            <Label htmlFor="width" className="mb-1 flex items-center gap-1">
              Width (feet) <Scale className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="width"
              type="text"
              placeholder="e.g., 4"
              value={inputs.width}
              onChange={(e) => handleInputChange("width", e.target.value)}
              aria-describedby="width-desc"
            />
            <p id="width-desc" className="text-xs text-slate-500 mt-1">
              Enter the width of your garden bed in feet.
            </p>
          </div>

          <div>
            <Label htmlFor="depth" className="mb-1 flex items-center gap-1">
              Depth (inches) <Scale className="w-4 h-4 text-green-600" />
            </Label>
            <Input
              id="depth"
              type="text"
              placeholder="e.g., 6"
              value={inputs.depth}
              onChange={(e) => handleInputChange("depth", e.target.value)}
              aria-describedby="depth-desc"
            />
            <p id="depth-desc" className="text-xs text-slate-500 mt-1">
              Enter the desired depth of soil or compost in inches.
            </p>
          </div>

          <div>
            <Label htmlFor="material" className="mb-1 flex items-center gap-1">
              Material Type <Leaf className="w-4 h-4 text-green-600" />
            </Label>
            <Select
              value={inputs.material}
              onValueChange={(v) => handleInputChange("material", v)}
              id="material"
              aria-describedby="material-desc"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soil">Topsoil</SelectItem>
                <SelectItem value="compost">Compost</SelectItem>
                <SelectItem value="mix">50/50 Soil & Compost Mix</SelectItem>
              </SelectContent>
            </Select>
            <p id="material-desc" className="text-xs text-slate-500 mt-1">
              Choose the type of material you plan to use.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          onClick={() => {}}
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          aria-label="Calculate volume"
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({ length: "", width: "", depth: "", material: "soil" })
          }
          className="flex-1 h-11"
          aria-label="Reset inputs"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {results.warning && (
        <Card className="bg-red-50 border-red-300 text-red-700">
          <CardContent className="p-4 text-center font-semibold">
            <AlertTriangle className="inline-block mr-2 w-5 h-5 align-text-bottom" />
            {results.warning}
          </CardContent>
        </Card>
      )}

      {results.value && !results.warning && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">
              {results.value}
            </p>
            <p className="mt-2 text-lg font-semibold text-blue-800 dark:text-blue-300">
              {results.label}
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {results.subtext}
            </p>
            <p className="mt-4 text-xs italic text-slate-600 dark:text-slate-400">
              Formula used: {results.formulaUsed}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Garden Soil/Compost Volume Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator determines the exact volume of garden soil or compost needed to fill raised beds, containers, or garden plots. Simply input your garden dimensions and the tool computes cubic feet, cubic yards, and bag quantities instantly.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter the length, width, and depth of your garden area in either feet or inches. The calculator accepts multiple beds, allowing you to add sections separately for complex garden layouts.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Results display total volume needed in cubic feet and cubic yards, plus the number of standard 2-cubic-foot bags required. Always add 10-15% extra for settling, and double-check soil density if ordering by weight rather than volume.</p>
        </div>
      </section>

      {/* TABLE: Common Garden Bed Dimensions &amp; Soil Requirements */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Garden Bed Dimensions &amp; Soil Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference guide showing standard raised bed sizes and their soil volume needs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bed Dimensions (L×W×H)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Volume (Cu. Ft.)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Volume (Cu. Yds.)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bags of Soil (2 cu. ft.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4×4×12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4×8×12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8×8×12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">64</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4×4×18 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4×8×18 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8×8×18 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Add 10-15% for settling. Prices vary by region and soil type.</p>
      </section>

      {/* TABLE: Soil Density &amp; Weight per Volume */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Soil Density &amp; Weight per Volume</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Soil weight varies based on composition, moisture, and compaction.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Soil Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight per Cu. Yard (Dry)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight per Cu. Yard (Wet)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Density (lbs/cu. ft.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Garden Soil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,300-1,500 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,600-2,000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48-55</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Compost</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-1,000 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,100-1,400 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-37</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Potting Mix</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600-800 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900-1,100 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Clay Soil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,600-1,700 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000-2,200 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">59-63</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sandy Soil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,200-1,300 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,400-1,600 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44-48</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Wet weights include typical soil moisture content. Actual values depend on organic matter percentage.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure twice to avoid ordering too little soil, which disrupts planting schedules and increases per-unit costs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Order soil from local suppliers to reduce delivery fees, which can exceed product costs for large volumes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Blend 60-70% garden soil with 30-40% compost for nutrient-rich growing medium that retains moisture.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for seasonal differences: wet soil in spring is heavier, while dry soil in summer may settle faster.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Add Settling Buffer</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Soil compacts significantly after watering; failing to add 10-15% extra leaves you short for proper planting depth.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Up Cubic Feet and Cubic Yards</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">One cubic yard equals 27 cubic feet; ordering 4 cubic yards thinking it's cubic feet results in ordering 27× more soil than needed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Interior Bed Measurements Instead of Total Depth</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Measure total bed height including any lip or rim, not just the soil depth, to avoid underestimating volume needed.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Soil Weight Limits for Structures</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Wet compost weighs up to 1,400 lbs per cubic yard; lightweight decks or containers may not support this load safely.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate soil volume for a raised bed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure the length, width, and depth of your raised bed in feet, then enter these dimensions into the calculator. It will instantly convert to cubic feet or cubic yards needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between garden soil and compost?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Garden soil is mineral-based with nutrients, while compost is decomposed organic matter rich in beneficial microbes. Most gardeners blend 50-70% soil with 30-50% compost for optimal results.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does a cubic yard of garden soil weigh?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A cubic yard of dry garden soil weighs approximately 1,300-1,500 lbs, while wet soil can weigh 1,600-2,000 lbs depending on moisture and composition.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for container gardening?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, simply measure your container's length, width, and depth in inches or feet, and the calculator will compute the exact volume needed to fill it.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert cubic feet to bags of soil?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard soil bags are typically 2 cubic feet. Divide your total cubic feet by 2 to get the number of bags needed, accounting for settling.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I account for soil settling when ordering?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, add 10-15% extra to your calculated volume since soil settles over time, especially in the first few weeks after planting.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What measurements do I need for an irregularly shaped garden bed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Break irregular shapes into smaller rectangles, calculate each section separately, then add the volumes together for a total amount needed.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://extension.umn.edu/garden-yard-and-landscape/soil" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Minnesota Extension: Garden Soil Management</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-based guide on soil composition, testing, and amendment recommendations for home gardens.</p>
          </li>
          <li>
            <a href="https://www.nrcs.usda.gov/conservation-basics/natural-resource-concerns/soil" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Natural Resources Conservation Service: Soil Health</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal resource explaining soil properties, organic matter benefits, and sustainable garden practices.</p>
          </li>
          <li>
            <a href="https://extension.psu.edu/growing-plants-in-containers" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Penn State College of Agricultural Sciences: Container Gardening</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Detailed guide on soil mixes, container sizes, and volume calculations for successful container gardening.</p>
          </li>
          <li>
            <a href="https://extension.oregonstate.edu/ask-expert/featured/how-deep-should-my-raised-bed-be" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Oregon State University: Raised Bed Gardening</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Expert recommendations for raised bed depth, soil selection, and amendments based on crop types.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Garden Soil/Compost Volume Calculator"
      description="Calculate soil volume for raised beds. Find out exactly how much topsoil or compost you need to fill your garden planters."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Volume (ft³) = Length (ft) × Width (ft) × Depth (ft); Depth (ft) = Depth (in) ÷ 12",
        variables: [
          { symbol: "Length", description: "Length of the garden bed in feet" },
          { symbol: "Width", description: "Width of the garden bed in feet" },
          {
            symbol: "Depth",
            description: "Depth of soil or compost in feet (converted from inches)",
          },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a raised garden bed that measures 8 feet long, 3 feet wide, and you want to fill it with 6 inches of compost.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert depth from inches to feet: 6 inches ÷ 12 = 0.5 feet.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate volume in cubic feet: 8 ft × 3 ft × 0.5 ft = 12 cubic feet.",
          },
          {
            label: "Step 3",
            explanation:
              "Convert cubic feet to cubic yards: 12 ÷ 27 ≈ 0.44 cubic yards.",
          },
          {
            label: "Step 4",
            explanation:
              "Estimate weight using compost density (40 lbs/ft³): 12 × 40 = 480 lbs.",
          },
        ],
        result:
          "You will need approximately 12 cubic feet (0.44 cubic yards) of compost weighing about 480 pounds to fill your garden bed.",
      }}
      relatedCalculators={[
        {
          title: "Wine/Beer/Soft Drink Mix Estimator",
          url: "/everyday/beverage-mix-estimator",
          icon: "🎉",
        },
        {
          title: "Light Bulb Cost per Year Calculator",
          url: "/everyday/light-bulb-cost-per-year",
          icon: "🏠",
        },
        {
          title: "Rainwater Barrel Days of Supply",
          url: "/everyday/rainwater-barrel-days-supply",
          icon: "💧",
        },
        {
          title: "Cleaning Dilution Ratio Calculator",
          url: "/everyday/cleaning-dilution-ratio",
          icon: "🏠",
        },
        {
          title: "Basal Metabolic Rate (BMR) Calculator",
          url: "/everyday/bmr-calculator",
          icon: "💡",
        },
        {
          title: "Planting Calendar & Frost Date Finder",
          url: "/everyday/planting-calendar-frost-date",
          icon: "🌿",
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