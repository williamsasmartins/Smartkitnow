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

export default function RebarSpacingQuantityCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, mm) or imperial (feet, inches)
    length: "", // length of slab or beam
    width: "", // width of slab or beam
    depth: "", // thickness or height of slab or beam
    rebarSpacing: "", // spacing between rebars (cm or inches)
    rebarDiameter: "16", // diameter in mm or inches (default 16mm)
    waste: "10", // waste percentage
    price: "", // price per unit length of rebar
    materialSize: "standard", // standard or large rebar size (affects length per unit)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: convert input strings to numbers safely
  const toNumber = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  // Conversion constants
  const MM_TO_M = 0.001;
  const CM_TO_M = 0.01;
  const INCH_TO_FT = 1 / 12;
  const INCH_TO_M = 0.0254;

  // Calculate rebar quantity and length needed
  const results = useMemo(() => {
    // Parse inputs
    const length = toNumber(inputs.length);
    const width = toNumber(inputs.width);
    const depth = toNumber(inputs.depth);
    const spacing = toNumber(inputs.rebarSpacing);
    const wastePercent = toNumber(inputs.waste);
    const pricePerUnit = toNumber(inputs.price);
    const rebarDia = toNumber(inputs.rebarDiameter);

    if (length <= 0 || width <= 0 || spacing <= 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions and spacing.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert all dimensions to meters for calculation
    // Units: metric = meters/cm/mm; imperial = feet/inches
    let lengthM = length;
    let widthM = width;
    let spacingM = spacing;
    let rebarDiameterM = rebarDia * MM_TO_M; // diameter always in mm converted to meters

    if (inputs.unit === "imperial") {
      // length and width assumed feet, spacing inches
      lengthM = length * 0.3048; // feet to meters
      widthM = width * 0.3048; // feet to meters
      spacingM = spacing * INCH_TO_M; // inches to meters
      rebarDiameterM = rebarDia * INCH_TO_M; // inches to meters
    } else {
      // metric: length and width in meters, spacing in cm convert to meters
      spacingM = spacing * CM_TO_M;
    }

    // Calculate number of rebars needed in each direction
    // Rebars run lengthwise and crosswise spaced by spacingM
    // Number of rebars along width = width / spacing + 1 (for last bar)
    // Number of rebars along length = length / spacing + 1
    const numRebarsWidth = Math.floor(widthM / spacingM) + 1;
    const numRebarsLength = Math.floor(lengthM / spacingM) + 1;

    // Total length of rebar needed:
    // Longitudinal bars run lengthwise, each lengthM long, count = numRebarsWidth
    // Transverse bars run widthwise, each widthM long, count = numRebarsLength
    const totalLengthM = numRebarsWidth * lengthM + numRebarsLength * widthM;

    // Add waste margin
    const totalLengthWithWaste = totalLengthM * (1 + wastePercent / 100);

    // Determine standard rebar length based on materialSize
    // Standard rebar length usually 12m, large size 16m (example)
    const standardLength = inputs.materialSize === "large" ? 16 : 12;

    // Calculate number of rebar units (bars) needed, round up
    const barsNeeded = Math.ceil(totalLengthWithWaste / standardLength);

    // Calculate cost estimate if price per unit length is given
    // Price per unit assumed per meter of rebar
    const cost = pricePerUnit > 0 ? pricePerUnit * totalLengthWithWaste : 0;

    // Format outputs
    const mainQty = `${barsNeeded} Bars`;
    const costFormatted = `$${cost.toFixed(2)}`;
    const details = `Raw length: ${totalLengthM.toFixed(2)} m, with waste: ${totalLengthWithWaste.toFixed(
      2
    )} m`;
    const wasteInfo = `+${wastePercent}% Waste included`;

    return {
      mainQty,
      cost: costFormatted,
      details,
      wasteInfo,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the standard rebar spacing requirement for concrete slabs?",
      answer: "The standard rebar spacing for most concrete slabs is 12 inches on center (OC) in both directions, which provides adequate reinforcement for typical residential and light commercial applications. However, spacing can range from 6 inches OC for high-stress areas to 18 inches OC for lower-stress applications. Always consult local building codes and structural engineer specifications, as requirements vary based on slab thickness, concrete strength, and load conditions.",
    },
    {
      question: "How do I calculate the number of rebar pieces needed for my project?",
      answer: "To calculate rebar quantity, divide your total length (in the same direction) by the center-to-center spacing, then add 1 for the starting piece. For example, a 20-foot slab with 12-inch spacing requires (20 × 12 ÷ 12) + 1 = 21 pieces of rebar. Repeat this calculation for the perpendicular direction and multiply the two results to get the total number of intersecting rebar pieces needed.",
    },
    {
      question: "What spacing should I use for rebar in foundation walls?",
      answer: "Foundation walls typically use 12 inches OC vertical and 12-18 inches OC horizontal rebar spacing, depending on wall height and soil pressure. For walls taller than 8 feet or in high-pressure soil conditions, engineers often specify tighter spacing of 8-10 inches OC to improve strength and crack resistance. The calculator can adjust for these variables when you input your wall dimensions and local code requirements.",
    },
    {
      question: "How much weight does one piece of rebar add to my project estimate?",
      answer: "A standard #4 rebar (½-inch diameter) weighs approximately 0.668 pounds per linear foot, while #5 rebar weighs 1.043 pounds per foot, and #6 rebar weighs 1.502 pounds per foot. For a 20-foot-long #4 rebar piece, total weight is roughly 13.36 pounds. Knowing the total rebar quantity and diameter allows you to calculate material weight, which affects shipping costs and labor requirements.",
    },
    {
      question: "Can I use 18-inch spacing instead of 12-inch to save money?",
      answer: "While 18-inch spacing reduces material costs by approximately 33% compared to 12-inch spacing, it may violate building codes or compromise structural integrity for your specific application. Wider spacing is only acceptable for lower-load applications like non-structural slabs or light residential work, and must be approved by a structural engineer and local building department. Always prioritize code compliance and safety over material savings.",
    },
    {
      question: "What is the difference between #4, #5, and #6 rebar sizes?",
      answer: "Rebar sizes are designated by eighths of an inch: #4 rebar is ½-inch in diameter, #5 is ⅝-inch, and #6 is ¾-inch. Larger rebar provides greater load capacity and requires wider spacing, while smaller rebar accommodates tighter spacing and is better for congested concrete areas. Your structural plans will specify which size is required based on the stresses and spans in your project.",
    },
    {
      question: "How does concrete strength (PSI) affect rebar spacing requirements?",
      answer: "Higher concrete strength (PSI) allows for wider rebar spacing because the concrete itself can distribute loads more effectively. For example, 3,000 PSI concrete may allow 12-inch spacing, while 4,000 PSI concrete might permit 15-18 inch spacing for the same application. Conversely, lower-strength concrete (&lt;3,000 PSI) typically requires tighter spacing of 8-10 inches OC to ensure adequate reinforcement and crack control.",
    },
    {
      question: "What happens if I don't space rebar correctly?",
      answer: "Inadequate rebar spacing (&gt;18 inches OC for standard slabs) can result in wider cracks, reduced load capacity, and potential structural failure under stress. Overly tight spacing (&lt;6 inches OC) wastes material and may create congestion that prevents proper concrete consolidation, leading to voids and weak spots. The calculator ensures you meet code minimums while optimizing material efficiency.",
    },
    {
      question: "Do I need to account for lap lengths when calculating total rebar needed?",
      answer: "Yes, lap lengths (typically 40-50 times the bar diameter, or 20-25 inches for #4 rebar) must be added to your total rebar length requirement when pieces need to overlap for strength. If your slab is 30 feet long and requires a lap every 20 feet, you need to account for additional material beyond the base length. Advanced calculators include lap length fields to automatically adjust material quantities for overlapping pieces.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are reinforcing a concrete slab measuring 6 meters long by 4 meters wide with a rebar spacing of 20 cm. You want to calculate how many rebar bars you need, including a 10% waste margin, using standard 12-meter bars.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Length = 6 m, Width = 4 m, Rebar Spacing = 20 cm (0.2 m). Calculate number of bars along width and length.",
      },
      {
        label: "2. Calculate Total Length",
        explanation:
          "Number of bars widthwise = floor(4 / 0.2) + 1 = 21 bars, lengthwise = floor(6 / 0.2) + 1 = 31 bars. Total length = (21 × 6) + (31 × 4) = 126 + 124 = 250 m.",
      },
      {
        label: "3. Add Waste",
        explanation: "Add 10% waste: 250 m × 1.10 = 275 m total rebar length needed.",
      },
      {
        label: "4. Order Bars",
        explanation:
          "Divide total length by bar length: 275 m / 12 m = 22.92 → 23 bars needed to order.",
      },
    ],
    result: "Final Order: 23 standard 12-meter rebar bars",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Rebar Length = (Number of Bars Along Width × Length) + (Number of Bars Along Length × Width)",
    variables: [
      { symbol: "L", description: "Length of the slab or beam" },
      { symbol: "W", description: "Width of the slab or beam" },
      { symbol: "S", description: "Rebar spacing" },
      { symbol: "Nw", description: "Number of bars along width = floor(W / S) + 1" },
      { symbol: "Nl", description: "Number of bars along length = floor(L / S) + 1" },
      { symbol: "Waste", description: "Waste margin percentage added to total length" },
      { symbol: "BarLength", description: "Standard length of one rebar bar" },
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
            <SelectItem value="metric">Metric</SelectItem>
            <SelectItem value="imperial">Imperial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 6"
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth / Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="space-y-2">
          <Label>Rebar Spacing ({inputs.unit === "metric" ? "cm" : "inches"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.rebarSpacing}
            onChange={(e) => handleInputChange("rebarSpacing", e.target.value)}
            placeholder="e.g. 20"
          />
        </div>
        <div className="space-y-2">
          <Label>Rebar Diameter ({inputs.unit === "metric" ? "mm" : "inches"})</Label>
          <Select
            value={inputs.rebarDiameter}
            onValueChange={(v) => handleInputChange("rebarDiameter", v)}
          >
            <SelectTrigger>
              <HardHat className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {inputs.unit === "metric" ? (
                <>
                  <SelectItem value="10">10 mm</SelectItem>
                  <SelectItem value="12">12 mm</SelectItem>
                  <SelectItem value="16">16 mm</SelectItem>
                  <SelectItem value="20">20 mm</SelectItem>
                  <SelectItem value="25">25 mm</SelectItem>
                </>
              ) : (
                <>
                  <SelectItem value="0.375">3/8 inch</SelectItem>
                  <SelectItem value="0.5">1/2 inch</SelectItem>
                  <SelectItem value="0.625">5/8 inch</SelectItem>
                  <SelectItem value="0.75">3/4 inch</SelectItem>
                  <SelectItem value="1">1 inch</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Item Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size (12 m)</SelectItem>
              <SelectItem value="large">Large Size (16 m)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Meter</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="any"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

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
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Rebar Spacing & Quantity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Rebar Spacing & Quantity Calculator is an essential tool for construction professionals, engineers, and DIY builders who need to determine how much reinforcement steel is required for concrete projects. This calculator saves time, reduces material waste, and ensures compliance with building codes by automatically computing the number of rebar pieces needed based on your project dimensions and spacing requirements. Whether you're pouring a residential foundation, driveway, or commercial floor slab, accurate rebar calculations are critical for structural integrity and cost control.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll input your slab or structure length and width (in feet), select your preferred rebar size (#4, #5, #6, etc.), and specify the center-to-center spacing in inches. The calculator also allows you to account for lap lengths if your rebar pieces will overlap for added strength. These inputs directly determine how many individual rebar pieces you'll need and the total linear footage of material required for your project.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will output the total number of rebar pieces in each direction, the total linear feet of rebar needed, and often an estimated material weight and cost. Use these results to order materials from suppliers, estimate labor requirements, and verify that your spacing meets local building codes and structural engineer specifications. Always cross-reference the output with your project blueprints and local codes before purchasing or installing rebar.</p>
        </div>
      </section>

      {/* TABLE: Standard Rebar Sizes and Properties */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Rebar Sizes and Properties</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the common rebar sizes used in construction with their diameters, weights, and typical applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Rebar Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nominal Diameter (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight per Linear Foot (lbs)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">#3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.375</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.376</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Smaller slabs, lightweight applications</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">#4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.668</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard slabs, most residential work</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">#5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.043</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Thicker slabs, higher-load applications</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">#6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.502</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Foundations, heavy-duty slabs</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">#7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.875</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.044</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bridge decks, heavy commercial work</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">#8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.670</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Major structural elements, massive loads</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Weights are for Grade 60 rebar in standard conditions. Consult supplier specifications for exact weights.</p>
      </section>

      {/* TABLE: Recommended Rebar Spacing by Application */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Rebar Spacing by Application</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides standard spacing recommendations for different concrete applications according to common building codes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Application</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Spacing (inches OC)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Spacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Spacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Code Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential floor slabs (4-6 inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">ACI 318</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Foundation walls (8 feet tall)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">ACI 318</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Concrete beams</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">ACI 318</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Driveway slabs (4 inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Local Code</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Basement slabs-on-grade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">ACI 318</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Elevated slabs (&gt;6 inches)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Structural Plans</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Spacing requirements vary by jurisdiction and soil conditions. Always verify with local building codes and structural engineer specifications before construction.</p>
      </section>

      {/* TABLE: Material Cost and Quantity Comparison by Spacing */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Material Cost and Quantity Comparison by Spacing</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares total rebar quantity and estimated material costs for a 20×20-foot slab at different spacing intervals.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Spacing (inches OC)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Number of Bars Each Direction</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Intersections</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated #4 Rebar Length (feet)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Est. Material Cost (12"-spacing baseline)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1681</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">820</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">961</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">620</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">625</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">121%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">441</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">420</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">289</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">340</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">81%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">196</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Cost percentages are relative to 12-inch spacing baseline. Actual costs vary by region, rebar grade, and supplier pricing. This assumes 20-foot pieces and does not include lap lengths.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify spacing requirements with your local building department and structural engineer before using the calculator results—codes vary significantly by region, soil type, and application.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for lap lengths (typically 40-50 bar diameters) when overlapping rebar pieces; the calculator can add these automatically if you specify lap requirements.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use #4 rebar for most standard residential slabs; upgrading to #5 or #6 is only necessary for thicker slabs, heavier loads, or when structural plans specify.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Double-check your input dimensions (length × width in feet) before calculating—small errors in measurements result in significant material quantity discrepancies and cost overruns.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider tighter spacing (8-10 inches OC) for high-stress areas like support points, load-bearing walls, or locations near openings to improve structural performance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Round up your calculator results when ordering materials to account for breakage, waste, and field adjustments—typically add 5-10% to the computed quantity.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing inches and feet in measurements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering dimensions inconsistently (some in feet, some in inches) causes the calculator to produce wildly inaccurate results. Always convert all measurements to the same unit (typically feet) before entering them into the calculator.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring lap length requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Forgetting to account for lap lengths when rebar pieces overlap results in ordering insufficient material and creating weak joints. Standard lap lengths are 40-50 bar diameters (approximately 20-25 inches for #4 rebar), which must be added to your total rebar length.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using spacing wider than code allows</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Selecting 18-inch spacing without verifying it meets local codes can violate building regulations and create structural deficiencies. Always confirm maximum allowable spacing with your building department and structural engineer before finalizing quantities.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for existing obstacles or openings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to adjust rebar quantity for large openings (windows, doors, mechanical penetrations) results in ordering excess material that cannot be used. Subtract the dimensions of significant openings from your total slab area before calculating rebar needs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Selecting the wrong rebar grade or size</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using #3 rebar when #4 is required, or vice versa, compromises structural integrity or wastes material cost. Always reference structural plans or engineer specifications to confirm the correct rebar size before calculation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard rebar spacing requirement for concrete slabs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard rebar spacing for most concrete slabs is 12 inches on center (OC) in both directions, which provides adequate reinforcement for typical residential and light commercial applications. However, spacing can range from 6 inches OC for high-stress areas to 18 inches OC for lower-stress applications. Always consult local building codes and structural engineer specifications, as requirements vary based on slab thickness, concrete strength, and load conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the number of rebar pieces needed for my project?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate rebar quantity, divide your total length (in the same direction) by the center-to-center spacing, then add 1 for the starting piece. For example, a 20-foot slab with 12-inch spacing requires (20 × 12 ÷ 12) + 1 = 21 pieces of rebar. Repeat this calculation for the perpendicular direction and multiply the two results to get the total number of intersecting rebar pieces needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What spacing should I use for rebar in foundation walls?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Foundation walls typically use 12 inches OC vertical and 12-18 inches OC horizontal rebar spacing, depending on wall height and soil pressure. For walls taller than 8 feet or in high-pressure soil conditions, engineers often specify tighter spacing of 8-10 inches OC to improve strength and crack resistance. The calculator can adjust for these variables when you input your wall dimensions and local code requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much weight does one piece of rebar add to my project estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A standard #4 rebar (½-inch diameter) weighs approximately 0.668 pounds per linear foot, while #5 rebar weighs 1.043 pounds per foot, and #6 rebar weighs 1.502 pounds per foot. For a 20-foot-long #4 rebar piece, total weight is roughly 13.36 pounds. Knowing the total rebar quantity and diameter allows you to calculate material weight, which affects shipping costs and labor requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use 18-inch spacing instead of 12-inch to save money?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">While 18-inch spacing reduces material costs by approximately 33% compared to 12-inch spacing, it may violate building codes or compromise structural integrity for your specific application. Wider spacing is only acceptable for lower-load applications like non-structural slabs or light residential work, and must be approved by a structural engineer and local building department. Always prioritize code compliance and safety over material savings.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between #4, #5, and #6 rebar sizes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rebar sizes are designated by eighths of an inch: #4 rebar is ½-inch in diameter, #5 is ⅝-inch, and #6 is ¾-inch. Larger rebar provides greater load capacity and requires wider spacing, while smaller rebar accommodates tighter spacing and is better for congested concrete areas. Your structural plans will specify which size is required based on the stresses and spans in your project.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does concrete strength (PSI) affect rebar spacing requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Higher concrete strength (PSI) allows for wider rebar spacing because the concrete itself can distribute loads more effectively. For example, 3,000 PSI concrete may allow 12-inch spacing, while 4,000 PSI concrete might permit 15-18 inch spacing for the same application. Conversely, lower-strength concrete (&lt;3,000 PSI) typically requires tighter spacing of 8-10 inches OC to ensure adequate reinforcement and crack control.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I don't space rebar correctly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Inadequate rebar spacing (&gt;18 inches OC for standard slabs) can result in wider cracks, reduced load capacity, and potential structural failure under stress. Overly tight spacing (&lt;6 inches OC) wastes material and may create congestion that prevents proper concrete consolidation, leading to voids and weak spots. The calculator ensures you meet code minimums while optimizing material efficiency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do I need to account for lap lengths when calculating total rebar needed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, lap lengths (typically 40-50 times the bar diameter, or 20-25 inches for #4 rebar) must be added to your total rebar length requirement when pieces need to overlap for strength. If your slab is 30 feet long and requires a lap every 20 feet, you need to account for additional material beyond the base length. Advanced calculators include lap length fields to automatically adjust material quantities for overlapping pieces.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.concrete.org/standards/concrete-standards.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ACI 318: Building Code Requirements for Structural Concrete</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The authoritative standard for reinforced concrete design and construction, including rebar spacing and placement requirements.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/products-and-services/standards/icc-model-codes/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Code Council (ICC) – Building Codes</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Model building codes adopted by most U.S. jurisdictions that specify minimum rebar spacing and reinforcement requirements for concrete structures.</p>
          </li>
          <li>
            <a href="https://www.crsi.org/resources/publications-tools" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Concrete Reinforcing Steel Institute (CRSI) – Design Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry guidelines and technical resources for reinforcement steel selection, spacing, and installation in concrete construction.</p>
          </li>
          <li>
            <a href="https://www.osha.gov/construction" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">OSHA – Concrete and Rebar Safety Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Occupational safety and health requirements for handling, spacing, and installing rebar to prevent worker injuries on construction sites.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Rebar Spacing & Quantity Calculator"
      description="The ultimate professional guide and calculator for Rebar Spacing & Quantity Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "guide", label: "Guide" },
        { id: "tips", label: "Pro Tips" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
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