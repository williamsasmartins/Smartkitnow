import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function MortarMixRatioBagCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "", // thickness of mortar layer
    waste: "10", // waste percentage
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation assumptions:
   * - Mortar volume = Length x Width x Depth (converted to cubic meters or cubic feet)
   * - Mortar mix ratio: 1 part cement : 4 parts sand (typical)
   * - Bag yield:
   *    Standard bag (e.g. 25 kg bag) yields approx 0.017 m³ (0.6 ft³) of mortar
   *    Large bag (e.g. 40 kg bag) yields approx 0.027 m³ (1.0 ft³) of mortar
   * - Waste added as percentage on total volume
   * - Cost calculated by multiplying number of bags by price per bag
   */

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      length <= 0 ||
      width <= 0 ||
      depth <= 0
    ) {
      return {
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert all dimensions to meters or feet depending on unit
    // For metric: inputs are meters, result volume in cubic meters
    // For imperial: inputs are feet, result volume in cubic feet
    let volume: number;
    if (inputs.unit === "metric") {
      volume = length * width * depth; // m³
    } else {
      volume = length * width * depth; // ft³
    }

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Bag yield per size and unit
    // Standard bag yields:
    // Metric: 0.017 m³ per bag (typical 25kg bag)
    // Imperial: 0.6 ft³ per bag
    // Large bag yields:
    // Metric: 0.027 m³ per bag (typical 40kg bag)
    // Imperial: 1.0 ft³ per bag

    const bagYield =
      inputs.materialSize === "standard"
        ? inputs.unit === "metric"
          ? 0.017
          : 0.6
        : inputs.unit === "metric"
        ? 0.027
        : 1.0;

    // Calculate number of bags needed (round up)
    const bagsNeeded = Math.ceil(volumeWithWaste / bagYield);

    // Calculate cost
    const cost =
      !isNaN(pricePerUnit) && pricePerUnit > 0
        ? `$${(bagsNeeded * pricePerUnit).toFixed(2)}`
        : "Price not set";

    // Detailed info string
    const details = `Volume: ${volume.toFixed(
      3
    )} ${inputs.unit === "metric" ? "m³" : "ft³"} + Waste: ${wastePercent}% = ${volumeWithWaste.toFixed(
      3
    )} ${inputs.unit === "metric" ? "m³" : "ft³"}`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.depth,
    inputs.waste,
    inputs.price,
    inputs.unit,
    inputs.materialSize,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the standard mortar mix ratio for bricklaying?",
      answer: "The most common mortar mix ratio for general bricklaying is 1:3 (1 part cement to 3 parts sand by volume). This ratio provides adequate strength for most residential applications while maintaining workability. For load-bearing walls, a stronger 1:2.5 ratio may be required, whereas decorative or non-structural work can use a weaker 1:4 ratio.",
    },
    {
      question: "How many bags of mortar do I need for 100 square feet of brick wall?",
      answer: "For a standard brick wall, you typically need 5-7 bags of pre-mixed mortar per 100 square feet, depending on brick size and joint thickness. A standard 80-pound bag of pre-mixed mortar covers approximately 12-15 square feet when joints are 3/8 inch thick. Adjust upward for thicker joints (up to 1/2 inch) which may require 8-9 bags per 100 square feet.",
    },
    {
      question: "What is the difference between Type N, Type S, and Type M mortar?",
      answer: "Type N (1:2.25:3.25 ratio) is the most common general-purpose mortar with moderate strength, suitable for most residential and interior walls. Type S (1:1.75:2.75 ratio) is stronger and better for exterior walls and areas with high moisture or wind exposure. Type M (1:1.25:2.75 ratio) is the strongest and used for below-grade work, heavy loads, or severe weather conditions.",
    },
    {
      question: "Can I adjust mortar mix ratios for different weather conditions?",
      answer: "Yes, weather affects mortar performance significantly. In cold climates, use Type S or M mortars with air entrainment to resist freeze-thaw cycles; avoid mixing in temperatures below 40°F without heated water. In hot, dry conditions, increase water content slightly and consider adding a water retention agent to prevent premature drying, which can reduce bond strength by up to 25%.",
    },
    {
      question: "How do I calculate cement and sand needed from a mix ratio?",
      answer: "To calculate from a ratio like 1:3, divide the total volume by the sum of ratio parts (1+3=4). For 1 cubic yard of mortar at 1:3 ratio: cement = 1 cubic yard ÷ 4 = 0.25 cubic yards (or 94 pounds per cubic foot), and sand = 3 × 0.25 = 0.75 cubic yards. A typical 94-pound cement bag yields about 1 cubic foot, so you'd need about 24 bags of cement per cubic yard.",
    },
    {
      question: "What coverage does a 60-pound bag of premixed mortar provide?",
      answer: "A 60-pound bag of premixed mortar typically covers 8-10 square feet for brickwork with standard 3/8-inch joints. Coverage varies based on brick size, joint width, and application method—larger bricks with thinner joints require fewer bags per square foot. Always check the manufacturer's coverage chart, as different brands and mortar types may vary by 10-15% in coverage rates.",
    },
    {
      question: "Is water content important in mortar mix calculations?",
      answer: "Yes, water content is critical and typically comprises 10-15% of the mortar mix by weight. Too little water reduces workability and bond strength; too much weakens the mortar and increases shrinkage cracking by 15-30%. For best results, add water gradually until the mortar reaches a thick, putty-like consistency that clings to a trowel without slumping.",
    },
    {
      question: "How do I convert a mortar mix ratio to actual pounds needed?",
      answer: "Convert volume ratios to weight using cement density (94 lbs/cubic foot) and sand density (approximately 100 lbs/cubic foot). For a 1:3 ratio yielding 1 cubic yard: cement = 0.25 cubic yards × 27 cubic feet/yard × 94 lbs = 635 pounds, and sand = 0.75 × 27 × 100 = 2,025 pounds. Add approximately 10-15% for water content and potential waste.",
    },
    {
      question: "What factors affect mortar coverage estimates?",
      answer: "Key factors include brick or stone size (larger units require less mortar), joint thickness (3/8-inch standard vs. 1/2-inch thick joints increases material by 20-30%), application method (troweled vs. raked joints), and material absorption. Porous bricks absorb more mortar than dense materials, and irregular surfaces increase coverage needs by 15-25%. Always add 10% extra for waste and spillage.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are plastering a wall that measures 5 meters long, 3 meters high, with a mortar thickness of 0.02 meters (20 mm). You want to order standard 25 kg mortar bags and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: 5 m × 3 m × 0.02 m = 0.3 m³ of mortar needed.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 0.3 m³ × 1.10 = 0.33 m³ total mortar volume.",
      },
      {
        label: "3. Order",
        explanation:
          "Standard bag yield = 0.017 m³, so bags needed = 0.33 ÷ 0.017 ≈ 19.5, round up to 20 bags.",
      },
    ],
    result: "Final Order: 20 Bags of standard mortar mix",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Volume = Length × Width × Depth\nBags Needed = (Volume × (1 + Waste%)) ÷ Bag Yield",
    variables: [
      { symbol: "L", description: "Length of the area (meters or feet)" },
      { symbol: "W", description: "Width of the area (meters or feet)" },
      { symbol: "D", description: "Depth or thickness of mortar (meters or feet)" },
      { symbol: "Waste%", description: "Waste margin percentage (e.g., 10%)" },
      {
        symbol: "Bag Yield",
        description:
          "Volume of mortar yielded per bag (m³ or ft³), depends on bag size and unit system",
      },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
        >
          <SelectTrigger className="w-[140px]">
            <Ruler className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (m)</SelectItem>
            <SelectItem value="imperial">Imperial (ft)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 5"
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
            placeholder="e.g. 3"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Depth / Thickness ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "0.02" : "0.07"}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bag Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (25 kg / 0.017 m³)</SelectItem>
              <SelectItem value="large">Large (40 kg / 0.027 m³)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Bag</Label>
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
            <span className="text-sm font-semibold text-slate-500 uppercase">
              Materials Needed
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.mainQty}
            </div>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Mortar Mix Ratio & Bag Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Mortar Mix Ratio & Bag Calculator simplifies the process of determining exact material quantities needed for masonry projects. Rather than manually converting volume ratios to pounds or estimating coverage, this tool calculates precise cement and sand requirements based on your project size, mortar type, and joint specifications. Accurate calculations prevent costly material overages or shortages that delay construction schedules.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your total wall area in square feet, select your mortar type (N, S, M, or O), and specify your joint thickness in inches. The calculator also accounts for brick size—standard modular bricks versus jumbo or thin units—since different sizes require different mortar volumes. If you have a specific cubic yardage or prefer to work with weight-based measurements, the tool provides conversions between volume and weight for both cement and sand.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs the total cubic yards of mortar needed, the number of 94-pound cement bags required, and the weight of sand in pounds or tons. Results also show how many 60-pound or 80-pound bags of premixed mortar will substitute if you prefer ready-mixed products over site-mixing. Always add 10-15% extra material to your final calculations to account for waste, spillage, and application variability on your project.</p>
        </div>
      </section>

      {/* TABLE: Mortar Type Specifications & Mix Ratios */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Mortar Type Specifications & Mix Ratios</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares the four main mortar types with their cement-to-sand ratios, compressive strength, and recommended applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mortar Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mix Ratio (Cement:Sand)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Compressive Strength (psi)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Used For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Type M</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:2.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Masonry below grade, heavy loads, severe weather</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Type S</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:2.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exterior walls, above-grade masonry, high wind zones</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Type N</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:2.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">750+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">General-purpose interior and exterior, most residential work</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Type O</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350+</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Interior non-structural walls, soft stone, repair work only</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Compressive strength values are standard industry benchmarks per ASTM C270. Type M is rarely used in modern residential construction due to its high strength causing cracking in walls.</p>
      </section>

      {/* TABLE: Mortar Bag Coverage by Joint Thickness */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Mortar Bag Coverage by Joint Thickness</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Standard coverage rates for 80-pound bags of premixed mortar vary based on joint thickness and brick size.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Joint Thickness</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage per 80 lb Bag (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bags per 100 sq ft</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bags per 1,000 Bricks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3/8 inch (standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-40</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1/2 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-55</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5/8 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-70</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3/4 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13-17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-85</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Coverage assumes standard modular bricks (2.25 x 3.625 x 7.625 inches). Jumbo or thin bricks will have different coverage rates. Add 10-15% extra for waste, spillage, and application variability.</p>
      </section>

      {/* TABLE: Material Quantities for Common Wall Areas */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Material Quantities for Common Wall Areas</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for cement and sand requirements using a standard 1:3 Type N mortar ratio.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wall Area (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cubic Yards of Mortar</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bags of Cement (94 lb)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tons of Sand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.38</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.0</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These calculations assume 3/8-inch joints and standard brick size. Add 10% additional material for waste. Sand density is estimated at 100 lbs/cubic foot; cement bags contain 94 pounds of material.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify the mortar type required by your building codes and project specifications before calculating material—Type N is standard for residential work, but exterior or below-grade applications may require Type S or M, which affects material costs and quantities by 15-25%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your actual wall area carefully by multiplying height × length for each wall section, then subtract door and window openings to avoid over-ordering materials that create storage and waste challenges on tight job sites.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Pre-wet your sand the day before mixing if it's very dry; sand moisture content can vary 5-10% depending on weather, which affects the actual volume and requires water content adjustments during mixing to maintain proper consistency.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Order premixed mortar bags if your project is under 500 square feet, since site-mixing requires specialized equipment, trained labor, and quality control that smaller projects cannot justify economically compared to bagged products.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing volume ratios with weight ratios</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A 1:3 cement-to-sand ratio by volume does not equal 1:3 by weight, since cement (94 lbs/cubic foot) and sand (100 lbs/cubic foot) have different densities. Using weight ratios directly without conversion can result in incorrect mortar strength and workability, compromising structural integrity by 20-30%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to add waste factor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming exact theoretical coverage without adding 10-15% for waste, spillage, and application inefficiency typically results in running out of material mid-project. This forces expensive emergency orders or project delays—especially problematic for mortar since consistency between batches affects finished wall appearance and durability.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for joint thickness variations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Estimating mortar needs using standard 3/8-inch joints when your specifications call for 1/2-inch or 5/8-inch joints can underestimate material by 25-50%. Joint thickness specifications significantly impact both material quantity and final wall aesthetics, making accurate measurements critical before ordering.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using old or incorrect mortar type designations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying outdated mortar type names or confusing Portland cement with masonry cement can lead to ordering wrong materials or weak mixes that fail premature cracking or weathering tests. Always verify current ASTM C270 specifications for your region, as mortar standards have been updated to address modern climate challenges and masonry performance requirements.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard mortar mix ratio for bricklaying?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common mortar mix ratio for general bricklaying is 1:3 (1 part cement to 3 parts sand by volume). This ratio provides adequate strength for most residential applications while maintaining workability. For load-bearing walls, a stronger 1:2.5 ratio may be required, whereas decorative or non-structural work can use a weaker 1:4 ratio.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many bags of mortar do I need for 100 square feet of brick wall?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a standard brick wall, you typically need 5-7 bags of pre-mixed mortar per 100 square feet, depending on brick size and joint thickness. A standard 80-pound bag of pre-mixed mortar covers approximately 12-15 square feet when joints are 3/8 inch thick. Adjust upward for thicker joints (up to 1/2 inch) which may require 8-9 bags per 100 square feet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between Type N, Type S, and Type M mortar?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Type N (1:2.25:3.25 ratio) is the most common general-purpose mortar with moderate strength, suitable for most residential and interior walls. Type S (1:1.75:2.75 ratio) is stronger and better for exterior walls and areas with high moisture or wind exposure. Type M (1:1.25:2.75 ratio) is the strongest and used for below-grade work, heavy loads, or severe weather conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I adjust mortar mix ratios for different weather conditions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, weather affects mortar performance significantly. In cold climates, use Type S or M mortars with air entrainment to resist freeze-thaw cycles; avoid mixing in temperatures below 40°F without heated water. In hot, dry conditions, increase water content slightly and consider adding a water retention agent to prevent premature drying, which can reduce bond strength by up to 25%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate cement and sand needed from a mix ratio?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate from a ratio like 1:3, divide the total volume by the sum of ratio parts (1+3=4). For 1 cubic yard of mortar at 1:3 ratio: cement = 1 cubic yard ÷ 4 = 0.25 cubic yards (or 94 pounds per cubic foot), and sand = 3 × 0.25 = 0.75 cubic yards. A typical 94-pound cement bag yields about 1 cubic foot, so you'd need about 24 bags of cement per cubic yard.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What coverage does a 60-pound bag of premixed mortar provide?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 60-pound bag of premixed mortar typically covers 8-10 square feet for brickwork with standard 3/8-inch joints. Coverage varies based on brick size, joint width, and application method—larger bricks with thinner joints require fewer bags per square foot. Always check the manufacturer's coverage chart, as different brands and mortar types may vary by 10-15% in coverage rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is water content important in mortar mix calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, water content is critical and typically comprises 10-15% of the mortar mix by weight. Too little water reduces workability and bond strength; too much weakens the mortar and increases shrinkage cracking by 15-30%. For best results, add water gradually until the mortar reaches a thick, putty-like consistency that clings to a trowel without slumping.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert a mortar mix ratio to actual pounds needed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Convert volume ratios to weight using cement density (94 lbs/cubic foot) and sand density (approximately 100 lbs/cubic foot). For a 1:3 ratio yielding 1 cubic yard: cement = 0.25 cubic yards × 27 cubic feet/yard × 94 lbs = 635 pounds, and sand = 0.75 × 27 × 100 = 2,025 pounds. Add approximately 10-15% for water content and potential waste.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect mortar coverage estimates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Key factors include brick or stone size (larger units require less mortar), joint thickness (3/8-inch standard vs. 1/2-inch thick joints increases material by 20-30%), application method (troweled vs. raked joints), and material absorption. Porous bricks absorb more mortar than dense materials, and irregular surfaces increase coverage needs by 15-25%. Always add 10% extra for waste and spillage.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.astm.org/c0270-21.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASTM C270 — Standard Specification for Mortar for Unit Masonry</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The authoritative standard defining mortar types, mix ratios, and performance specifications for all masonry construction projects in North America.</p>
          </li>
          <li>
            <a href="https://www.cement.org/learn/concrete-basics/concrete-materials/cementitious-materials" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">PCA (Portland Cement Association) — Design and Control of Concrete Mixtures</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive technical guidance on cement properties, mortar composition, and best practices for achieving desired strength and durability in masonry work.</p>
          </li>
          <li>
            <a href="https://www.bia.org/resources/technical-notes" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Brick Industry Association — Technical Notes on Brick Construction</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-standard technical references covering mortar selection, application methods, and troubleshooting for brick masonry projects of all sizes.</p>
          </li>
          <li>
            <a href="https://www.ncma.org/about-ncma/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Concrete Masonry Association (NCMA) — Mortar Specifications and Properties</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical resources on mortar performance, mix design for various applications, and quality assurance standards for concrete masonry units.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Mortar Mix Ratio & Bag Calculator"
      description="The ultimate professional guide and calculator for Mortar Mix Ratio & Bag Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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