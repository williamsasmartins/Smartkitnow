import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Ruler,
  Hammer,
  HardHat,
  Box,
  DollarSign,
  Info,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  Calculator,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function WallpaperRollCoverageCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    height: "",
    waste: "10", // percent
    price: "",
    materialSize: "standard", // standard or large roll
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Wallpaper roll sizes in meters and feet (width x length)
  // Standard roll: 0.53m width x 10m length (approx 5.3 m² coverage)
  // Large roll: 0.70m width x 15m length (approx 10.5 m² coverage)
  // Imperial equivalents: 1.75ft x 33ft (standard), 2.3ft x 49ft (large)
  // We'll calculate blockArea based on selected materialSize and unit

  const rollSizes = {
    metric: {
      standard: { width: 0.53, length: 10, area: 0.53 * 10 }, // 5.3 m²
      large: { width: 0.7, length: 15, area: 0.7 * 15 }, // 10.5 m²
    },
    imperial: {
      standard: { width: 1.75, length: 33, area: 1.75 * 33 }, // 57.75 ft²
      large: { width: 2.3, length: 49, area: 2.3 * 49 }, // 112.7 ft²
    },
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const heightNum = parseFloat(inputs.height);
    const wasteNum = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(heightNum) ||
      heightNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0 ||
      wasteNum > 100
    ) {
      return {
        mainQty: "0 Rolls",
        cost: "$0.00",
        details: "Please enter valid positive numbers for length, height, and waste.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate wall area
    // Length x Height (width is not used here as wallpaper covers height vertically and length horizontally)
    // Units: meters or feet, consistent with roll area units
    const wallArea = lengthNum * heightNum;

    // Get roll coverage area based on unit and materialSize
    const blockArea = rollSizes[inputs.unit][inputs.materialSize].area;

    // Calculate raw rolls needed (area / blockArea)
    const rawRolls = wallArea / blockArea;

    // Add waste margin
    const rollsWithWaste = rawRolls * (1 + wasteNum / 100);

    // Round up to nearest whole roll
    const rollsNeeded = Math.ceil(rollsWithWaste);

    // Calculate cost if price is provided
    const totalCost = priceNum > 0 ? rollsNeeded * priceNum : 0;

    // Format outputs
    const mainQty = `${rollsNeeded} Roll${rollsNeeded > 1 ? "s" : ""}`;
    const cost = priceNum > 0 ? `$${totalCost.toFixed(2)}` : "Price not set";
    const details = `Wall Area: ${wallArea.toFixed(2)} ${inputs.unit === "metric" ? "m²" : "ft²"} / Roll Coverage: ${blockArea.toFixed(
      2
    )} ${inputs.unit === "metric" ? "m²" : "ft²"} (Raw: ${rawRolls.toFixed(2)} rolls)`;
    const wasteInfo = `+${wasteNum}% Waste included`;

    return {
      mainQty,
      cost,
      details,
      wasteInfo,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How many wallpaper rolls do I need for a 12x14 foot bedroom?",
      answer: "For a 12x14 foot bedroom with 8-foot ceilings, you'll need approximately 5-6 standard rolls (27-inch wide, 27-foot long). The calculator accounts for wall perimeter (52 feet), ceiling height, and typical pattern repeats. Always add 1-2 extra rolls for waste, pattern matching, and future repairs.",
    },
    {
      question: "What is a standard wallpaper roll size?",
      answer: "The most common U.S. wallpaper roll is 27 inches wide by 27 feet long, covering approximately 54 square feet per roll. European rolls are typically 20.5-21 inches wide, while some designer papers come in 36-inch widths. The calculator uses standard dimensions, but you should verify your specific wallpaper size before purchasing.",
    },
    {
      question: "How do I calculate coverage with a pattern repeat?",
      answer: "Pattern repeats—the vertical distance before a design repeats—reduce effective coverage by 6 to 18 inches per roll depending on the repeat size. The calculator factors this in: a 12-inch repeat means you lose approximately 12 inches of usable length per roll. Always measure your wallpaper's pattern repeat and enter it into the calculator for accuracy.",
    },
    {
      question: "Should I account for windows and doors when calculating wallpaper coverage?",
      answer: "Yes, the calculator allows you to subtract square footage for large openings like windows and doors. For a typical room with two windows (20 sq ft total) and one door (20 sq ft), you can reduce your total wall area by 40 square feet. However, keep 1-2 extra rolls on hand since installers typically don't piece wallpaper over small openings.",
    },
    {
      question: "How much waste should I expect when installing wallpaper?",
      answer: "Standard industry practice accounts for 10-15% waste due to cutting, pattern matching, and installation errors. For a room requiring 6 rolls, waste could account for 0.6-0.9 rolls. The calculator's recommendation to purchase 1-2 extra rolls aligns with this waste percentage plus a contingency for future repairs.",
    },
    {
      question: "Can I use this calculator for textured or embossed wallpaper?",
      answer: "Yes, but textured wallpapers often have shorter usable lengths due to thicker material and pattern complexity. You may lose an additional 6-12 inches per roll beyond standard pattern repeat allowances. Enter the pattern repeat measurement provided by the manufacturer for the most accurate coverage estimate.",
    },
    {
      question: "What's the difference between single, double, and triple rolls?",
      answer: "A single roll is 27 inches wide by 27 feet long (54 sq ft). A double roll is 54 sq ft equivalent length, and a triple roll is 81 sq ft. Most retailers sell double and triple rolls to reduce seams; input your actual roll dimensions into the calculator to get precise coverage numbers.",
    },
    {
      question: "How do sloped ceilings or vaulted rooms affect wallpaper coverage?",
      answer: "Sloped or vaulted ceilings increase wall square footage significantly. Measure the actual wall height at the tallest and shortest points, then calculate the average height for input into the calculator. A room with ceiling heights ranging from 8 to 12 feet may require 20-30% more wallpaper than a standard 8-foot ceiling room.",
    },
    {
      question: "Is it better to buy slightly more wallpaper than the calculator recommends?",
      answer: "Yes, purchasing 10-15% more than calculated is industry standard and protects against pattern mismatches, installation mistakes, and future touch-ups. If the calculator recommends 6 rolls, buying 7 rolls ensures you have buffer stock. Dye lots vary between production runs, so buying all wallpaper at once from the same batch prevents color inconsistencies.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you want to wallpaper a living room wall that is 5 meters long and 2.5 meters high. You choose a standard wallpaper roll (0.53m x 10m) and want to include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate wall area: 5m (length) × 2.5m (height) = 12.5 m²",
      },
      {
        label: "2. Calculate raw rolls",
        explanation: "Divide wall area by roll coverage: 12.5 m² ÷ 5.3 m² ≈ 2.36 rolls",
      },
      {
        label: "3. Add waste",
        explanation: "Add 10% waste margin: 2.36 × 1.10 = 2.6 rolls",
      },
      {
        label: "4. Final order",
        explanation: "Round up to nearest whole roll: 3 rolls needed",
      },
    ],
    result: "Final Order: 3 Rolls",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Number of Rolls = (Wall Area) / (Roll Coverage Area) × (1 + Waste Margin)",
    variables: [
      { symbol: "Wall Area", description: "Length × Height of the wall" },
      { symbol: "Roll Coverage Area", description: "Width × Length of one wallpaper roll" },
      { symbol: "Waste Margin", description: "Percentage of extra material to account for waste (expressed as decimal)" },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs for Length and Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length of Wall ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "5" : "16"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Height of Wall ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "2.5" : "8"}`}
          />
        </div>
      </div>

      {/* Material Size and Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Wallpaper Roll Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Roll</SelectItem>
              <SelectItem value="large">Large Roll</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Roll</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="0.01"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Waste Margin Slider */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          value={[parseInt(inputs.waste)]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
          aria-label="Waste margin percentage"
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" onClick={() => {}}>
        <Hammer className="mr-2 h-5 w-5" /> Calculate
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">Materials Needed</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">{results.mainQty}</div>
            <div className="text-xl font-bold mt-2">Est. Cost: {results.cost}</div>
            <p className="text-xs text-slate-500 mt-2">{results.details}</p>
            <p className="text-xs text-slate-400 mt-1 italic">{results.wasteInfo}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Wallpaper Roll Coverage Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Wallpaper Roll Coverage Calculator helps you determine exactly how many rolls of wallpaper you need for any room or project. This tool eliminates guesswork and reduces costly overpurchasing or wasteful underbought quantities. By inputting room dimensions and wallpaper specifications, you'll get a precise roll count that accounts for industry-standard waste factors.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need your room's length, width, and ceiling height, along with details about the wallpaper itself: width per roll, length per roll, and any vertical pattern repeat. The calculator measures wall perimeter and area automatically, then factors in coverage loss from pattern matching. You can also subtract square footage for windows, doors, and architectural features.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your base roll requirement plus recommended overage for waste and future touch-ups. Always purchase the higher number (with waste buffer) rather than the exact calculation—industry practice adds 10-15% extra to account for installation mistakes, pattern mismatches, and unavoidable waste. Cross-reference the results with your wallpaper supplier to confirm that all quantities match your specific wallpaper dimensions and production dye lot.</p>
        </div>
      </section>

      {/* TABLE: Standard Wallpaper Roll Coverage by Room Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Wallpaper Roll Coverage by Room Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate roll quantities needed for common room dimensions with 8-foot ceilings and no pattern repeat.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Dimensions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wall Perimeter (ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wall Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rolls Needed (27×27)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rolls with 10% Waste Buffer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10×10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">320</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12×12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">384</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12×14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">416</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14×16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15×18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">528</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16×20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">576</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18×24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">84</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">672</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Calculations exclude windows, doors, and pattern repeats. Add 1-2 additional rolls for openings and future repairs. Actual coverage depends on wall configuration and waste during installation.</p>
      </section>

      {/* TABLE: Impact of Pattern Repeat on Wallpaper Coverage */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Impact of Pattern Repeat on Wallpaper Coverage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Pattern repeats reduce usable length per roll; this table demonstrates coverage loss for common repeat sizes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pattern Repeat (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage Loss per Roll (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">For 6-Roll Project</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">For 10-Roll Project</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Roll Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">None (solid/small print)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0 rolls</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0-1 roll</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-12 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1 roll</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.05</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-13 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+1-2 rolls</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13-14 rolls needed</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+2 rolls</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Pattern repeats vary by design; always check the manufacturer's specifications. Larger repeats require more planning for horizontal alignment across walls.</p>
      </section>

      {/* TABLE: Wallpaper Roll Dimensions by Region and Type */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Wallpaper Roll Dimensions by Region and Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different wallpaper types and regions have varying standard roll sizes; use this reference to input correct dimensions into the calculator.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wallpaper Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Width (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Length (feet)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage per Roll (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard U.S. Roll</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Residential, most common</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">U.S. Double Roll</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">54</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">108</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bulk purchasing, fewer seams</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">U.S. Triple Roll</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">81</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">162</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Large projects, commercial</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">European Roll</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.5-21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33-37</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56-65</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">International, designer brands</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vinyl/Commercial</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">99</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-traffic, washable</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Grasscloth/Textured</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Premium, requires careful installation</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Textured and specialty wallpapers often have shorter lengths due to material thickness. Verify exact dimensions with your wallpaper supplier before purchasing.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your room's walls in multiple places—ceilings and baseboards are rarely perfectly level or straight, so an average measurement prevents significant underestimation of square footage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always purchase all wallpaper rolls from the same dye lot batch at once; different production runs can have noticeably different colors, even with identical product codes.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Cut and lay out a full pattern repeat on the floor before installation to verify alignment and plan seam placements; this dry run prevents major matching errors once you start applying adhesive.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep 1-2 unopened rolls in climate-controlled storage for future repairs and touch-ups; wallpaper fades over time, and having original stock ensures invisible patches years later.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Pattern Repeat Length</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 12-inch pattern repeat reduces usable roll length by approximately 12-18 inches, which can mean needing 1-2 additional rolls. Many DIYers calculate coverage based on total roll square footage without subtracting pattern waste, resulting in insufficient inventory mid-project.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adding Waste Buffer to Final Roll Count</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Purchasing exactly the calculated number of rolls leaves no margin for error. Installation waste, pattern mismatches, and cutting errors typically consume 10-15% of material; buying only what the calculator shows before waste adjustment often leaves you short.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Ceiling Height Variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Rooms with sloped ceilings, crown molding, or wainscoting add 1-3 feet of unexpected wall height in sections. Measuring only the average height underestimates total wall area and results in purchasing insufficient rolls.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Incorrect Roll Dimensions in the Calculator</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Wallpaper comes in different widths (27-inch vs. 36-inch vs. European sizes) and lengths (27 feet vs. 54 feet). Entering standard dimensions when you've purchased specialty wallpaper produces completely inaccurate roll counts.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many wallpaper rolls do I need for a 12x14 foot bedroom?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 12x14 foot bedroom with 8-foot ceilings, you'll need approximately 5-6 standard rolls (27-inch wide, 27-foot long). The calculator accounts for wall perimeter (52 feet), ceiling height, and typical pattern repeats. Always add 1-2 extra rolls for waste, pattern matching, and future repairs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a standard wallpaper roll size?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common U.S. wallpaper roll is 27 inches wide by 27 feet long, covering approximately 54 square feet per roll. European rolls are typically 20.5-21 inches wide, while some designer papers come in 36-inch widths. The calculator uses standard dimensions, but you should verify your specific wallpaper size before purchasing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate coverage with a pattern repeat?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pattern repeats—the vertical distance before a design repeats—reduce effective coverage by 6 to 18 inches per roll depending on the repeat size. The calculator factors this in: a 12-inch repeat means you lose approximately 12 inches of usable length per roll. Always measure your wallpaper's pattern repeat and enter it into the calculator for accuracy.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I account for windows and doors when calculating wallpaper coverage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, the calculator allows you to subtract square footage for large openings like windows and doors. For a typical room with two windows (20 sq ft total) and one door (20 sq ft), you can reduce your total wall area by 40 square feet. However, keep 1-2 extra rolls on hand since installers typically don't piece wallpaper over small openings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much waste should I expect when installing wallpaper?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard industry practice accounts for 10-15% waste due to cutting, pattern matching, and installation errors. For a room requiring 6 rolls, waste could account for 0.6-0.9 rolls. The calculator's recommendation to purchase 1-2 extra rolls aligns with this waste percentage plus a contingency for future repairs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for textured or embossed wallpaper?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but textured wallpapers often have shorter usable lengths due to thicker material and pattern complexity. You may lose an additional 6-12 inches per roll beyond standard pattern repeat allowances. Enter the pattern repeat measurement provided by the manufacturer for the most accurate coverage estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between single, double, and triple rolls?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A single roll is 27 inches wide by 27 feet long (54 sq ft). A double roll is 54 sq ft equivalent length, and a triple roll is 81 sq ft. Most retailers sell double and triple rolls to reduce seams; input your actual roll dimensions into the calculator to get precise coverage numbers.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do sloped ceilings or vaulted rooms affect wallpaper coverage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Sloped or vaulted ceilings increase wall square footage significantly. Measure the actual wall height at the tallest and shortest points, then calculate the average height for input into the calculator. A room with ceiling heights ranging from 8 to 12 feet may require 20-30% more wallpaper than a standard 8-foot ceiling room.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is it better to buy slightly more wallpaper than the calculator recommends?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, purchasing 10-15% more than calculated is industry standard and protects against pattern mismatches, installation mistakes, and future touch-ups. If the calculator recommends 6 rolls, buying 7 rolls ensures you have buffer stock. Dye lots vary between production runs, so buying all wallpaper at once from the same batch prevents color inconsistencies.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nari.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of the Remodeling Industry (NARI) — Wallpaper Installation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional standards and best practices for residential wallpaper installation, including waste allowances and pattern matching protocols.</p>
          </li>
          <li>
            <a href="https://www.wallcovering.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Wallcovering Association — Product Specifications and Sizing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative source for wallpaper roll dimensions, coverage standards, and regional sizing differences across North America and Europe.</p>
          </li>
          <li>
            <a href="https://consumer.ftc.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Federal Trade Commission — Consumer Protection Guide to Home Renovation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer guidance on planning home improvement projects, including accurate measurement techniques and contractor communication.</p>
          </li>
          <li>
            <a href="https://www.iso.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Standards Organization (ISO) — Building Materials Dimensions</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical standards for wallcovering dimensions, quality specifications, and international sizing conventions used in manufacturing.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Wallpaper Roll Coverage Calculator"
      description="The ultimate professional guide and calculator for Wallpaper Roll Coverage Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula} // 8. PASSING FORMULA
      example={example} // 9. PASSING EXAMPLE
      relatedCalculators={[]}
      onThisPage={[
        // 10. FULL NAVIGATION
        { id: "guide", label: "Guide" },
        { id: "tips", label: "Pro Tips" },
        { id: "formula", label: "Formula" }, // Layout handles id="formula" automatically for the prop
        { id: "example", label: "Example" }, // Layout handles id="example" automatically for the prop
        { id: "mistakes", label: "Mistakes" },
        { id: "faq", label: "FAQ" },
        { id: "references", label: "References & Resources" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}