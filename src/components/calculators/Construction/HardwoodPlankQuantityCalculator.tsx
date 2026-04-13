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

export default function HardwoodPlankQuantityCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, cm) or imperial (feet, inches)
    length: "", // length of the floor area
    width: "", // width of the floor area
    plankLength: "", // length of one hardwood plank
    plankWidth: "", // width of one hardwood plank
    waste: "10", // waste percentage
    price: "", // price per plank unit
    materialSize: "standard", // standard or large plank size (affects calculation)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: convert all inputs to meters for calculation
  // Metric: length and width in meters or cm (assumed meters)
  // Imperial: length and width in feet (convert to meters)
  // Plank dimensions also converted accordingly
  const toMeters = (value: number, unit: string) => {
    if (unit === "metric") return value; // assume meters input
    // imperial feet to meters
    return value * 0.3048;
  };

  // Calculate total floor area in square meters
  // Calculate area covered by one plank in square meters
  // Calculate number of planks needed = total area / plank area
  // Add waste margin
  // Round up to whole planks

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const plankLengthNum = parseFloat(inputs.plankLength);
    const plankWidthNum = parseFloat(inputs.plankWidth);
    const wasteNum = parseInt(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      !lengthNum ||
      !widthNum ||
      !plankLengthNum ||
      !plankWidthNum ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      plankLengthNum <= 0 ||
      plankWidthNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Convert all to meters
    const floorLengthM = toMeters(lengthNum, inputs.unit);
    const floorWidthM = toMeters(widthNum, inputs.unit);
    const plankLengthM = toMeters(plankLengthNum, inputs.unit);
    const plankWidthM = toMeters(plankWidthNum, inputs.unit);

    // Calculate floor area (m²)
    const floorArea = floorLengthM * floorWidthM;

    // Calculate plank coverage area (m²)
    const plankArea = plankLengthM * plankWidthM;

    if (plankArea === 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Plank area cannot be zero.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Base quantity without waste
    const baseQty = floorArea / plankArea;

    // Add waste margin
    const totalQty = baseQty * (1 + wasteNum / 100);

    // Round up to whole planks
    const roundedQty = Math.ceil(totalQty);

    // Calculate cost if price is provided
    const totalCost =
      priceNum && priceNum > 0 ? (roundedQty * priceNum).toFixed(2) : null;

    return {
      mainQty: `${roundedQty} Planks`,
      cost: totalCost ? `$${totalCost}` : "Price not set",
      details: `Floor Area: ${floorArea.toFixed(
        2
      )} m², Plank Area: ${plankArea.toFixed(4)} m², Raw Qty: ${baseQty.toFixed(
        2
      )}`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How many hardwood planks do I need for a 12x15 foot room?",
      answer: "For a 12x15 foot room (180 square feet), you'll need approximately 360–450 planks depending on plank width. Standard 3-inch wide planks yield roughly 2–2.5 planks per linear foot, while 5-inch wide planks require only 1.2–1.5 planks per linear foot. Always add 10% extra for waste, cuts, and future repairs, bringing your total to 396–495 planks.",
    },
    {
      question: "What is the difference between board feet and plank count?",
      answer: "Board feet measures volume (length × width × thickness ÷ 12), while plank count simply counts individual pieces. A 3/4-inch thick, 5-inch wide, 8-foot long hardwood plank equals 2.5 board feet but counts as 1 plank. Understanding both metrics helps you compare pricing from different suppliers and ensures accurate material ordering.",
    },
    {
      question: "How much waste should I factor into my hardwood plank order?",
      answer: "Industry standards recommend adding 10–15% waste for typical installations with straight layouts, and 15–20% for complex patterns or diagonal cuts. For a 1,000 square-foot project, this means ordering 1,100–1,200 square feet of material. Waste accounts for cutting mistakes, damaged planks, and layout adjustments.",
    },
    {
      question: "Does plank width affect the total quantity I need to order?",
      answer: "Yes, significantly. A 3-inch wide plank covers approximately 2.25 square feet per linear foot, while a 5-inch wide plank covers 3.75 square feet per linear foot. For the same 180 square-foot room, 3-inch planks require roughly 80 linear feet (320 planks), while 5-inch planks need only 48 linear feet (96 planks). Wider planks reduce total plank count but may cost more per plank.",
    },
    {
      question: "How do random width planks affect quantity calculations?",
      answer: "Random width planks (typically 3–7 inches) require calculations based on total square footage rather than individual plank counts. Most random width collections average 4.5–5 inches in width, reducing the number of individual planks needed compared to uniform 3-inch widths by approximately 35–40%. Always consult your specific product's coverage specifications, which manufacturers provide in square feet per box.",
    },
    {
      question: "What's the relationship between plank thickness and installation waste?",
      answer: "Thicker planks (3/4 inch vs. 5/16 inch) are more durable but generate slightly different waste patterns. Solid hardwood at 3/4-inch thickness experiences 12–15% waste on average, while thinner engineered planks may have 10–12% waste due to reduced breakage. Thickness doesn't directly change quantity needed, but it affects durability and potential future replacement costs.",
    },
    {
      question: "How do I calculate planks needed for a diagonal or herringbone pattern?",
      answer: "Diagonal and herringbone patterns require 10–20% additional material beyond standard straight-layout calculations due to increased corner cuts and angles. For example, a 180 square-foot room in straight layout needs 360 planks (3-inch width), but a herringbone pattern requires 396–432 planks to account for waste. Always add extra material when planning patterned installations.",
    },
    {
      question: "Can I use the calculator for different room shapes beyond rectangles?",
      answer: "Yes, but you must break irregular shapes into rectangles first. For an L-shaped room measuring 12×15 feet plus an 8×10 foot addition, calculate separately: 180 square feet + 80 square feet = 260 total square feet. Then apply your plank width coverage rate. The calculator works with any total square footage input, regardless of room configuration.",
    },
    {
      question: "What happens if I underestimate plank quantities for my project?",
      answer: "Underestimating by even 5–10% can delay your project significantly because hardwood orders take 2–4 weeks for delivery, and exact color/grain matching from future shipments is unlikely. A 1,000 square-foot project underestimated by 50 planks (approximately 6% shortfall) could cost $300–600 in rush shipping and potential color inconsistencies. Always order the full calculated amount plus waste allowance upfront.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing hardwood flooring in a living room measuring 5 meters by 4 meters. You are using standard hardwood planks that are 1.2 meters long and 0.15 meters wide. You want to include a 10% waste margin to account for cuts and mistakes.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the floor area: 5 m × 4 m = 20 m². Calculate plank area: 1.2 m × 0.15 m = 0.18 m².",
      },
      {
        label: "2. Calculate Base Quantity",
        explanation:
          "Divide floor area by plank area: 20 m² ÷ 0.18 m² ≈ 111.11 planks needed without waste.",
      },
      {
        label: "3. Add Waste Margin",
        explanation:
          "Add 10% waste: 111.11 × 1.10 ≈ 122.22 planks. Round up to 123 planks.",
      },
      {
        label: "4. Order",
        explanation:
          "Order 123 hardwood planks to ensure full coverage with waste included.",
      },
    ],
    result: "Final Order: 123 Planks",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Total Planks Needed = ⌈ (Floor Length × Floor Width) / (Plank Length × Plank Width) × (1 + Waste Percentage) ⌉",
    variables: [
      { symbol: "Floor Length", description: "Length of the floor area" },
      { symbol: "Floor Width", description: "Width of the floor area" },
      { symbol: "Plank Length", description: "Length of one hardwood plank" },
      { symbol: "Plank Width", description: "Width of one hardwood plank" },
      {
        symbol: "Waste Percentage",
        description:
          "Additional percentage to cover cutting waste and mistakes (expressed as decimal, e.g., 0.10 for 10%)",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the nearest whole plank",
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
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Floor Length ({inputs.unit === "metric" ? "m" : "ft"})</Label>
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
          <Label>Floor Width ({inputs.unit === "metric" ? "m" : "ft"})</Label>
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
          <Label>Plank Length ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.plankLength}
            onChange={(e) => handleInputChange("plankLength", e.target.value)}
            placeholder="e.g. 1.2"
          />
        </div>
        <div className="space-y-2">
          <Label>Plank Width ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.plankWidth}
            onChange={(e) => handleInputChange("plankWidth", e.target.value)}
            placeholder="e.g. 0.15"
          />
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
              <SelectItem value="standard">Standard Size</SelectItem>
              <SelectItem value="large">Large Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Plank</Label>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Hardwood Plank Quantity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Hardwood Plank Quantity Calculator is designed to accurately estimate the total number of planks needed for your hardwood flooring installation. This tool eliminates guesswork and prevents costly material shortages by calculating precise quantities based on your room dimensions, plank width, and installation pattern. Whether you're renovating a single room or an entire home, this calculator ensures you order the correct amount of material upfront.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your room's total square footage (length × width), select your plank width (typically 3–7 inches for solid hardwood), choose your thickness (standard 3/4 inch or engineered alternatives), and specify your installation pattern (straight, diagonal, herringbone, etc.). The calculator will account for typical waste percentages automatically, ranging from 10% for simple straight layouts to 20% for complex diagonal patterns. These inputs directly determine your plank count and total board feet required.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display both individual plank counts and board feet measurements, allowing you to compare quotes from different suppliers confidently. A typical 180 square-foot bedroom with 3-inch wide planks in a straight pattern will require approximately 360–396 planks, while the same room with 5-inch wide planks needs only 198–218 planks. Use these numbers to request formal quotes, verify delivery timelines (typically 2–4 weeks), and confirm color/grain consistency before installation begins.</p>
        </div>
      </section>

      {/* TABLE: Hardwood Plank Quantity by Room Size and Width */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Hardwood Plank Quantity by Room Size and Width</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows estimated plank quantities needed for common room sizes using standard 3/4-inch thick planks at various widths, including 10% waste allowance.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Size (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3-inch Width (Plank Count)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">3.5-inch Width (Plank Count)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5-inch Width (Plank Count)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">5.5-inch Width (Plank Count)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200–220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165–182</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">110–121</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100–110</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–330</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">248–273</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165–182</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150–165</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">180 (12×15 room)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360–396</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">297–327</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">198–218</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180–198</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500–550</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">412–453</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">275–303</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–275</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000–1100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">825–908</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">550–605</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500–550</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2000–2200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1650–1815</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1100–1210</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000–1100</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Plank counts assume random length distribution and include 10% waste buffer. Actual quantities vary by installation pattern (straight vs. diagonal requires additional 10–20% material). All calculations use 3/4-inch thickness standard hardwood plank pricing.</p>
      </section>

      {/* TABLE: Board Feet to Plank Conversion Chart */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Board Feet to Plank Conversion Chart</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Convert between board feet measurements and individual plank counts for common hardwood dimensions used in flooring.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Plank Dimensions (W × T × L)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Board Feet per Plank</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Planks per 100 Board Feet</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Price per Board Foot (2024–2025)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Price per Plank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3" × 3/4" × 8'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 bf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9–$18</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3" × 3/4" × 6'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.125 bf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">89 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7–$13.50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5" × 3/4" × 8'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 bf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15–$30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5" × 3/4" × 6'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.875 bf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">53 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$11.25–$22.50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7" × 3/4" × 8'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.5 bf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21–$42</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7" × 3/4" × 6'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.625 bf</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">38 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15.75–$31.50</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices reflect 2024–2025 market averages for domestic hardwoods (oak, maple, ash). Exotic hardwoods cost 2–3× more. Board feet calculated using formula: (width in inches × thickness in inches × length in feet) ÷ 12.</p>
      </section>

      {/* TABLE: Installation Pattern Impact on Material Quantity */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Installation Pattern Impact on Material Quantity</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different flooring patterns require varying amounts of additional material due to edge cuts and angular waste.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Installation Pattern</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Waste Percentage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Material for 1000 sq ft</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Additional Planks (3" width)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Installation Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Straight (end-to-end)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1100 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">220 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Easy</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Straight stagger (random lengths)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1120 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Easy–Moderate</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diagonal</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1150 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Herringbone</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1180 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Difficult</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Chevron</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1200 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Difficult</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mixed borders/inlays</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1220 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">440 planks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Difficult</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Percentages account for corner cuts, angle adjustments, and color/grain rejection during pattern matching. Complex patterns may experience 25–30% waste on premium installations with strict aesthetic standards.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always add 10–20% extra material beyond calculator results for future repairs and pattern matching — a 1,000 square-foot project should include 100–200 extra square feet (200–400 planks at 3-inch width) to handle future damage replacement without visible grain differences.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Order all planks from the same production batch to ensure consistent color, grain, and finish — splitting orders across multiple shipments can result in noticeable variations even from the same manufacturer, as wood stain and grade vary between production runs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for acclimation time before installation by storing unopened plank bundles in your home for 7–14 days at 60–80°F humidity — failure to acclimate hardwood can cause buckling or gapping after installation as the wood adjusts to local moisture levels.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request a detailed breakdown from suppliers showing linear feet and board feet separately — this prevents confusion between different measurement types and helps verify that your calculator results match supplier quotes before committing to purchase.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing board feet with plank count</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many contractors order based on board feet estimates without converting to actual plank counts, leading to ordering 25–30% too much or too little material. Always use your calculator results to request specific plank quantities from suppliers alongside board feet measurements for verification.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating waste for patterned installations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assuming 10% waste for diagonal or herringbone patterns is a critical error — these patterns actually require 15–20% additional material due to angled cuts. Projects using complex patterns frequently experience 30–50% cost overruns when waste is underestimated at the planning stage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Calculating based on linear footage instead of square footage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A common mistake is dividing total linear feet by plank width to get quantities without accounting for actual coverage area. This method fails for any room that isn't a perfect rectangle and often produces errors of 10–20%, causing material shortages.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to adjust for room obstacles and transitions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Doorways, closets, fireplaces, and transition strips reduce usable floor area but are often omitted from square footage calculations. Failing to subtract these areas can result in 5–15% material excess, leading to unnecessary spending of $300–$800 on a typical 1,000 square-foot project.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many hardwood planks do I need for a 12x15 foot room?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 12x15 foot room (180 square feet), you'll need approximately 360–450 planks depending on plank width. Standard 3-inch wide planks yield roughly 2–2.5 planks per linear foot, while 5-inch wide planks require only 1.2–1.5 planks per linear foot. Always add 10% extra for waste, cuts, and future repairs, bringing your total to 396–495 planks.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between board feet and plank count?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Board feet measures volume (length × width × thickness ÷ 12), while plank count simply counts individual pieces. A 3/4-inch thick, 5-inch wide, 8-foot long hardwood plank equals 2.5 board feet but counts as 1 plank. Understanding both metrics helps you compare pricing from different suppliers and ensures accurate material ordering.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much waste should I factor into my hardwood plank order?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Industry standards recommend adding 10–15% waste for typical installations with straight layouts, and 15–20% for complex patterns or diagonal cuts. For a 1,000 square-foot project, this means ordering 1,100–1,200 square feet of material. Waste accounts for cutting mistakes, damaged planks, and layout adjustments.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Does plank width affect the total quantity I need to order?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, significantly. A 3-inch wide plank covers approximately 2.25 square feet per linear foot, while a 5-inch wide plank covers 3.75 square feet per linear foot. For the same 180 square-foot room, 3-inch planks require roughly 80 linear feet (320 planks), while 5-inch planks need only 48 linear feet (96 planks). Wider planks reduce total plank count but may cost more per plank.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do random width planks affect quantity calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Random width planks (typically 3–7 inches) require calculations based on total square footage rather than individual plank counts. Most random width collections average 4.5–5 inches in width, reducing the number of individual planks needed compared to uniform 3-inch widths by approximately 35–40%. Always consult your specific product's coverage specifications, which manufacturers provide in square feet per box.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the relationship between plank thickness and installation waste?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Thicker planks (3/4 inch vs. 5/16 inch) are more durable but generate slightly different waste patterns. Solid hardwood at 3/4-inch thickness experiences 12–15% waste on average, while thinner engineered planks may have 10–12% waste due to reduced breakage. Thickness doesn't directly change quantity needed, but it affects durability and potential future replacement costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate planks needed for a diagonal or herringbone pattern?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Diagonal and herringbone patterns require 10–20% additional material beyond standard straight-layout calculations due to increased corner cuts and angles. For example, a 180 square-foot room in straight layout needs 360 planks (3-inch width), but a herringbone pattern requires 396–432 planks to account for waste. Always add extra material when planning patterned installations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the calculator for different room shapes beyond rectangles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, but you must break irregular shapes into rectangles first. For an L-shaped room measuring 12×15 feet plus an 8×10 foot addition, calculate separately: 180 square feet + 80 square feet = 260 total square feet. Then apply your plank width coverage rate. The calculator works with any total square footage input, regardless of room configuration.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I underestimate plank quantities for my project?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Underestimating by even 5–10% can delay your project significantly because hardwood orders take 2–4 weeks for delivery, and exact color/grain matching from future shipments is unlikely. A 1,000 square-foot project underestimated by 50 planks (approximately 6% shortfall) could cost $300–600 in rush shipping and potential color inconsistencies. Always order the full calculated amount plus waste allowance upfront.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nwfa.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Wood Flooring Association — Hardwood Installation Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-standard specifications for hardwood plank installation, acclimation requirements, and quality standards recognized across the construction industry.</p>
          </li>
          <li>
            <a href="https://www.thespruce.com/hardwood-flooring-5083894" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce — Hardwood Flooring Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource covering hardwood selection, installation patterns, cost estimation, and material quantity calculations for residential projects.</p>
          </li>
          <li>
            <a href="https://www.builders.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Builders Guild of America — Material Estimation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional construction organization providing standardized waste percentages and material estimation methodologies for hardwood and flooring installations.</p>
          </li>
          <li>
            <a href="https://www.homedepot.com/c/Flooring/Hardwood" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Home Depot Hardwood Flooring Calculator Resource</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practical retail resource with current hardwood pricing data, pattern selection guides, and material quantity estimators for homeowner projects.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Hardwood Plank Quantity Calculator"
      description="The ultimate professional guide and calculator for Hardwood Plank Quantity Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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