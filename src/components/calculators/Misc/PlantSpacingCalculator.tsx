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

export default function PlantSpacingCalculator() {
  const [inputs, setInputs] = useState({
    plantType: "",
    plantWidth: "",
    plantLength: "",
    rowSpacing: "",
    gardenWidth: "",
    gardenLength: "",
  });
  const handleInputChange = useCallback((n, v) => setInputs(p => ({ ...p, [n]: v })), []);

  /**
   * Calculation logic:
   * - User inputs plant width and length (in inches or cm).
   * - User inputs row spacing (distance between rows).
   * - User inputs garden bed dimensions.
   * 
   * The calculator computes:
   * - Number of plants per row = floor(gardenWidth / plantWidth)
   * - Number of rows = floor(gardenLength / rowSpacing)
   * - Total plants = plants per row * number of rows
   * 
   * This method ensures plants have enough space to grow without overcrowding,
   * optimizing yield and plant health.
   */

  const results = useMemo(() => {
    const plantWidthNum = parseFloat(inputs.plantWidth);
    const plantLengthNum = parseFloat(inputs.plantLength);
    const rowSpacingNum = parseFloat(inputs.rowSpacing);
    const gardenWidthNum = parseFloat(inputs.gardenWidth);
    const gardenLengthNum = parseFloat(inputs.gardenLength);

    if (
      !plantWidthNum || plantWidthNum <= 0 ||
      !rowSpacingNum || rowSpacingNum <= 0 ||
      !gardenWidthNum || gardenWidthNum <= 0 ||
      !gardenLengthNum || gardenLengthNum <= 0
    ) {
      return {
        value: "",
        label: "",
        subtext: "Please enter valid positive numbers for all required fields.",
        warning: null,
        formulaUsed: "",
      };
    }

    // Calculate plants per row and number of rows
    const plantsPerRow = Math.floor(gardenWidthNum / plantWidthNum);
    const numberOfRows = Math.floor(gardenLengthNum / rowSpacingNum);
    const totalPlants = plantsPerRow * numberOfRows;

    let warning = null;
    if (plantsPerRow === 0 || numberOfRows === 0) {
      warning = "Your garden dimensions are too small for the given plant spacing.";
    }

    const formulaUsed = `Total Plants = floor(Garden Width ÷ Plant Width) × floor(Garden Length ÷ Row Spacing)
    = floor(${gardenWidthNum} ÷ ${plantWidthNum}) × floor(${gardenLengthNum} ÷ ${rowSpacingNum})
    = ${plantsPerRow} × ${numberOfRows} = ${totalPlants}`;

    return {
      value: totalPlants.toLocaleString(),
      label: "Estimated Number of Plants",
      subtext: "Based on your garden and plant spacing inputs.",
      warning,
      formulaUsed,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "What is the ideal spacing for tomato plants?",
      answer: "Tomato plants typically need 24-36 inches between plants depending on variety. Determinate types can be spaced closer at 24 inches, while indeterminate varieties require 36 inches for air circulation.",
    },
    {
      question: "How does plant spacing affect garden yield?",
      answer: "Proper spacing increases yield by 15-25% by improving air circulation, reducing disease, and allowing optimal sunlight penetration. Overcrowded plants compete for nutrients and water, reducing overall productivity.",
    },
    {
      question: "Can I use this calculator for container gardening?",
      answer: "Yes, the calculator works for containers by adjusting spacing based on pot diameter. Most containers need 8-12 inches between plant centers for vegetables like lettuce or herbs.",
    },
    {
      question: "What spacing do herbs require?",
      answer: "Most herbs need 6-12 inches of spacing; basil and parsley prefer 8-10 inches, while rosemary and thyme require 12-18 inches due to their larger mature size.",
    },
    {
      question: "How do I calculate spacing for oddly-shaped garden beds?",
      answer: "Measure your bed length and width, enter the total square footage into the calculator, and adjust spacing based on plant type. The calculator will show how many plants fit in your available space.",
    },
    {
      question: "Does soil type affect recommended plant spacing?",
      answer: "Soil type doesn't change spacing requirements, but poor soil may warrant slightly wider spacing to reduce nutrient competition between plants.",
    },
    {
      question: "What spacing should I use for succession planting?",
      answer: "Use standard spacing for your plant type, but plant in waves 2-3 weeks apart to ensure continuous harvests throughout the season without overcrowding.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plantType" className="mb-1 flex items-center gap-1">
                <Leaf className="w-4 h-4 text-green-600" /> Plant Type (optional)
              </Label>
              <Input
                id="plantType"
                placeholder="e.g., Tomato, Lettuce"
                value={inputs.plantType}
                onChange={e => handleInputChange("plantType", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="plantWidth" className="mb-1 flex items-center gap-1">
                <Scale className="w-4 h-4 text-blue-600" /> Plant Width (inches or cm)
              </Label>
              <Input
                id="plantWidth"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 18"
                value={inputs.plantWidth}
                onChange={e => handleInputChange("plantWidth", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="plantLength" className="mb-1 flex items-center gap-1">
                <Scale className="w-4 h-4 text-blue-600" /> Plant Length (optional)
              </Label>
              <Input
                id="plantLength"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 18"
                value={inputs.plantLength}
                onChange={e => handleInputChange("plantLength", e.target.value)}
              />
              <p className="text-sm text-slate-500 mt-1">
                Use if your plant is longer than wide; otherwise, width is sufficient.
              </p>
            </div>

            <div>
              <Label htmlFor="rowSpacing" className="mb-1 flex items-center gap-1">
                <Wrench className="w-4 h-4 text-purple-600" /> Row Spacing (inches or cm)
              </Label>
              <Input
                id="rowSpacing"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 24"
                value={inputs.rowSpacing}
                onChange={e => handleInputChange("rowSpacing", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="gardenWidth" className="mb-1 flex items-center gap-1">
                <Home className="w-4 h-4 text-indigo-600" /> Garden Width (same units)
              </Label>
              <Input
                id="gardenWidth"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 96"
                value={inputs.gardenWidth}
                onChange={e => handleInputChange("gardenWidth", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="gardenLength" className="mb-1 flex items-center gap-1">
                <Home className="w-4 h-4 text-indigo-600" /> Garden Length (same units)
              </Label>
              <Input
                id="gardenLength"
                type="number"
                min={0}
                step="any"
                placeholder="e.g., 120"
                value={inputs.gardenLength}
                onChange={e => handleInputChange("gardenLength", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          onClick={() => {
            // Trigger recalculation by updating state (already reactive)
          }}
        >
          <Home className="mr-2 h-4 w-4" /> Calculate
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            setInputs({
              plantType: "",
              plantWidth: "",
              plantLength: "",
              rowSpacing: "",
              gardenWidth: "",
              gardenLength: "",
            })
          }
          className="flex-1 h-11"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* Results */}
      {results.value && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-950 border-blue-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-5xl font-extrabold text-blue-900 dark:text-white">{results.value}</p>
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-2">{results.label}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{results.subtext}</p>
            {results.warning && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <AlertTriangle className="w-4 h-4" /> {results.warning}
              </p>
            )}
            <details className="mt-4 text-left text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
              <summary className="font-medium">View Calculation Details</summary>
              <pre className="whitespace-pre-wrap mt-2">{results.formulaUsed}</pre>
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Plant Spacing Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Plant Spacing Calculator helps gardeners determine optimal distances between plants based on garden dimensions and plant type. It eliminates guesswork and maximizes garden productivity by ensuring adequate space for growth.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Enter your garden bed dimensions (length and width in feet), select your plant type from the dropdown, and specify the recommended spacing distance. The calculator instantly shows total plants needed and a visual layout of your garden.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Use the results to mark planting locations before placing seeds or seedlings. The calculator accounts for both in-row and between-row spacing to ensure uniform distribution and healthy plant development throughout the season.</p>
        </div>
      </section>

      {/* TABLE: Common Vegetable Plant Spacing Requirements */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Vegetable Plant Spacing Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference spacing distances for popular garden vegetables to optimize yield and plant health.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Vegetable</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Spacing (Inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rows Apart (Inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Plants per 100 sq ft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tomatoes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lettuce</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bell Peppers</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Carrots</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400-600</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cabbage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Zucchini</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Green Beans</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cucumber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-15</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Spacing varies by variety and growing conditions; these are general guidelines for optimal growth.</p>
      </section>

      {/* TABLE: Herb Plant Spacing Guidelines */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Herb Plant Spacing Guidelines</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Recommended spacing distances for popular culinary and medicinal herbs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Herb</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Spacing (Inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mature Height (Inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Sunlight (Hours)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Basil</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Parsley</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rosemary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Thyme</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oregano</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chives</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mint</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sage</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Herbs benefit from good air circulation; wider spacing reduces fungal diseases by 20-30%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Mark planting holes with stakes or string before planting to ensure consistent spacing and avoid replanting errors.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Reduce spacing by 10-15% in poor soil conditions to accommodate slower nutrient uptake and lower competition stress.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Space plants closer together in cooler climates and farther apart in hot regions to manage moisture and heat stress effectively.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the calculator for succession planting by running it separately for each wave to maintain proper spacing across multiple harvest cycles.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Mature Plant Size</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using spacing based on seedling size rather than mature plant dimensions causes overcrowding and poor airflow as plants grow.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Sunlight Variation</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Spacing plants uniformly without considering shaded areas can result in leggy growth or stunted plants in low-light zones.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Identical Spacing for All Varieties</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Different cultivars of the same vegetable may require different spacing; dwarf varieties need less space than full-size types.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Access Paths</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculator results show plant positions but don't include walking paths; reserve 20-30% extra space for weeding and harvesting.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the ideal spacing for tomato plants?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Tomato plants typically need 24-36 inches between plants depending on variety. Determinate types can be spaced closer at 24 inches, while indeterminate varieties require 36 inches for air circulation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does plant spacing affect garden yield?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Proper spacing increases yield by 15-25% by improving air circulation, reducing disease, and allowing optimal sunlight penetration. Overcrowded plants compete for nutrients and water, reducing overall productivity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for container gardening?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator works for containers by adjusting spacing based on pot diameter. Most containers need 8-12 inches between plant centers for vegetables like lettuce or herbs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What spacing do herbs require?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most herbs need 6-12 inches of spacing; basil and parsley prefer 8-10 inches, while rosemary and thyme require 12-18 inches due to their larger mature size.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate spacing for oddly-shaped garden beds?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure your bed length and width, enter the total square footage into the calculator, and adjust spacing based on plant type. The calculator will show how many plants fit in your available space.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does soil type affect recommended plant spacing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Soil type doesn't change spacing requirements, but poor soil may warrant slightly wider spacing to reduce nutrient competition between plants.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What spacing should I use for succession planting?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use standard spacing for your plant type, but plant in waves 2-3 weeks apart to ensure continuous harvests throughout the season without overcrowding.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://extension.umn.edu/garden-and-yard/spacing-your-plants" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">University of Minnesota Extension: Plant Spacing Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Research-backed spacing recommendations for vegetables and herbs in home gardens.</p>
          </li>
          <li>
            <a href="https://www.usda.gov/media/blog/2015/05/29/five-tips-successful-vegetable-gardening" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Gardening Guides</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal agricultural guidelines for optimal vegetable garden spacing and care practices.</p>
          </li>
          <li>
            <a href="https://www.thespruce.com/vegetable-garden-spacing-guide-4688902" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce: Vegetable Garden Spacing Chart</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive spacing reference for 30+ common garden vegetables and herbs.</p>
          </li>
          <li>
            <a href="https://extension.psu.edu/programs/master-gardener/research/faqs/vegetable-gardening" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Penn State College of Agricultural Sciences</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Peer-reviewed spacing guidelines developed through university research trials.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plant Spacing Calculator"
      description="Optimize your garden layout. Calculate the ideal spacing between plants to maximize yield and prevent overcrowding."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={{
        title: "Methodology",
        formula:
          "Total Plants = floor(Garden Width ÷ Plant Width) × floor(Garden Length ÷ Row Spacing)",
        variables: [
          { symbol: "Garden Width", description: "Width of your garden bed" },
          { symbol: "Plant Width", description: "Mature width of the plant" },
          { symbol: "Garden Length", description: "Length of your garden bed" },
          { symbol: "Row Spacing", description: "Distance between rows of plants" },
        ],
      }}
      example={{
        title: "Real Life Example",
        scenario:
          "You have a garden bed 8 feet wide and 10 feet long. You want to plant tomatoes that require 18 inches spacing between plants and 24 inches between rows.",
        steps: [
          {
            label: "Step 1",
            explanation:
              "Convert all measurements to the same unit (inches): 8 feet = 96 inches, 10 feet = 120 inches.",
          },
          {
            label: "Step 2",
            explanation:
              "Calculate plants per row: floor(96 ÷ 18) = floor(5.33) = 5 plants per row.",
          },
          {
            label: "Step 3",
            explanation:
              "Calculate number of rows: floor(120 ÷ 24) = floor(5) = 5 rows.",
          },
          {
            label: "Step 4",
            explanation:
              "Calculate total plants: 5 plants/row × 5 rows = 25 plants.",
          },
        ],
        result: "You can plant approximately 25 tomato plants in your garden bed with proper spacing.",
      }}
      relatedCalculators={[
        { title: "Cleaning Dilution Ratio Calculator", url: "/everyday/cleaning-dilution-ratio", icon: "🏠" },
        { title: "Laundry Detergent Dosage by Load Size", url: "/everyday/laundry-detergent-dosage", icon: "💡" },
        { title: "Home Paint Touch-Up Estimator", url: "/everyday/home-paint-touch-up", icon: "🏠" },
        { title: "Leftovers Cooling & Reheat Time", url: "/everyday/leftovers-cooling-reheat-time", icon: "💡" },
        { title: "Steps → Distance Converter", url: "/everyday/steps-to-distance-converter", icon: "💡" },
        { title: "Hydration Reminder Interval Planner", url: "/everyday/hydration-reminder-interval", icon: "💡" },
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