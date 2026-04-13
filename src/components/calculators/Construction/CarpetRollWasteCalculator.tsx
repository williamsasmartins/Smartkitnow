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

export default function CarpetRollWasteCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // length of the room/area
    width: "", // width of the room/area
    rollWidth: "4", // width of carpet roll (meters or feet)
    waste: "10", // waste percentage
    price: "", // price per roll unit
    materialSize: "standard", // standard or large roll size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const toMeters = (val: number) =>
    inputs.unit === "imperial" ? val * 0.3048 : val;
  const toFeet = (val: number) =>
    inputs.unit === "metric" ? val / 0.3048 : val;

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const rollWidthNum = parseFloat(inputs.rollWidth);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(rollWidthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      rollWidthNum <= 0
    ) {
      return {
        mainQty: "0 Rolls",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert all to meters internally for calculation
    const lengthM = toMeters(lengthNum);
    const widthM = toMeters(widthNum);
    const rollWidthM = toMeters(rollWidthNum);

    // Calculate total carpet length needed (in meters)
    // Carpet is sold in rolls of fixed width (rollWidthM)
    // We calculate how many strips of rollWidth are needed to cover width
    // Then multiply strips by length to get total length of carpet needed
    const stripsNeeded = Math.ceil(widthM / rollWidthM);
    const totalLengthNeeded = stripsNeeded * lengthM;

    // Add waste margin
    const totalLengthWithWaste =
      totalLengthNeeded * (1 + wastePercent / 100);

    // Rolls needed (round up)
    // Each roll is sold in fixed length units (standard or large)
    // We'll define standard roll length:
    // Standard roll length: 25 meters (metric) or 82 feet (imperial)
    // Large roll length: 30 meters (metric) or 98 feet (imperial)
    const standardRollLengthM = inputs.materialSize === "standard" ? 25 : 30;

    // Rolls needed
    const rollsNeeded = Math.ceil(totalLengthWithWaste / standardRollLengthM);

    // Cost calculation
    const totalCost =
      !isNaN(priceNum) && priceNum > 0
        ? rollsNeeded * priceNum
        : 0;

    // Format outputs
    const unitLabel = inputs.unit === "metric" ? "meters" : "feet";
    const rollLengthLabel =
      inputs.unit === "metric"
        ? `${standardRollLengthM} meters`
        : `${Math.round(standardRollLengthM / 0.3048)} feet`;

    return {
      mainQty: `${rollsNeeded} Roll${rollsNeeded > 1 ? "s" : ""}`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Total carpet length needed: ${totalLengthNeeded.toFixed(
        2
      )} ${unitLabel} (without waste). Roll length: ${rollLengthLabel}.`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.rollWidth,
    inputs.waste,
    inputs.price,
    inputs.materialSize,
    inputs.unit,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is waste factor and why does it matter in carpet installation?",
      answer: "Waste factor is the percentage of carpet material lost during cutting, fitting, and seaming—typically ranging from 10% to 20% depending on room shape and layout. Underestimating waste can result in running short of material mid-installation, requiring costly rush orders or visible seams in finished areas. The calculator automatically accounts for this buffer to ensure you order sufficient yardage from the start.",
    },
    {
      question: "How do I measure a room with irregular shapes for carpet ordering?",
      answer: "Break irregular rooms into rectangular sections, measure each section separately (length × width), then add all sections together for total square footage. For angled walls or alcoves, measure the longest points and round up to the nearest foot to ensure adequate coverage. Input this total square footage into the calculator along with your waste factor percentage to get accurate roll requirements.",
    },
    {
      question: "What's the standard carpet roll width and how does it affect my order?",
      answer: "Standard carpet rolls come in widths of 12 feet and 15 feet, with 12-foot widths being most common in North America. Wider rolls (15 feet) reduce seaming requirements and waste in larger installations but may be less cost-effective for small rooms under 200 square feet. The calculator helps you determine the most efficient roll width for your project dimensions and layout.",
    },
    {
      question: "How much waste should I budget for a room with multiple obstacles like pillars or built-ins?",
      answer: "Rooms with multiple obstacles (pillars, fireplaces, built-in shelving) typically require 15% to 25% waste factor instead of the standard 10% to 15%. Each obstacle requires additional cuts and fitting, increasing scrap material. Use the higher waste percentage in the calculator when dealing with complex layouts to avoid material shortages.",
    },
    {
      question: "Can I use the same waste factor percentage for basement and above-ground installations?",
      answer: "Basement installations should use a slightly higher waste factor (15% to 20%) due to moisture considerations and potential subfloor unevenness requiring more fitting adjustments. Above-ground rooms with stable subfloors can use the standard 10% to 15% waste factor. The calculator allows you to adjust waste percentages based on installation location and subfloor conditions.",
    },
    {
      question: "What's the difference between linear yards and square yards when ordering carpet rolls?",
      answer: "Square yards measure area (length × width ÷ 9), while linear yards measure length at a specific roll width—for a 12-foot roll, divide square footage by 12 to get linear feet, then divide by 3 for linear yards. Most carpet retailers quote pricing in linear or square yards, so understanding the conversion is critical for accurate cost estimation. The calculator converts square footage into both measurements to match your supplier's quotes.",
    },
    {
      question: "How does seaming location affect waste calculation in large installations?",
      answer: "Professional installers plan seams to fall in low-traffic areas and align with room architecture, which may increase waste by 5% to 10% depending on seam placement strategy. Avoiding seams in high-traffic zones like doorways or main walkways requires more precise cutting and potentially longer roll lengths. Input your seam plan and layout preferences into the calculator to get accurate waste estimates for your specific installation design.",
    },
    {
      question: "What waste percentage should I use for stairs when calculating total carpet needs?",
      answer: "Staircase installations typically require an additional 15% to 30% waste due to complex cuts for each tread and riser, plus potential pattern matching on visible areas. A single flight of 12 stairs can consume 20 to 40 linear feet of carpet depending on tread width and pattern considerations. Calculate stairs separately from main floor areas and add the results together in the final order quantity.",
    },
    {
      question: "How accurate is the calculator for commercial vs. residential carpet installations?",
      answer: "The calculator works for both, but commercial installations with high-traffic patterns and specific seaming requirements may need 12% to 18% waste factor versus residential 10% to 15%. Commercial spaces often have stricter aesthetic standards requiring more precise seam placement, increasing material loss. Adjust your waste factor inputs based on project type to get the most accurate commercial or residential estimates.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing carpet in a rectangular room measuring 6 meters by 5 meters. You have carpet rolls that are 4 meters wide and 25 meters long (standard size). You want to include a 10% waste margin and the price per roll is $150.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Room width is 5 m, roll width is 4 m, so you need 2 strips (ceil(5/4) = 2). Total length needed is 2 strips × 6 m length = 12 m.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste: 12 m × 1.10 = 13.2 m total carpet length needed.",
      },
      {
        label: "3. Order",
        explanation:
          "Each roll is 25 m long, so rolls needed = ceil(13.2 / 25) = 1 roll.",
      },
    ],
    result: "Final Order: 1 Roll, Estimated Cost: $150.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Rolls Needed = ⎡ (Ceil(Room Width / Roll Width) × Room Length × (1 + Waste %)) / Roll Length ⎤",
    variables: [
      { symbol: "Room Width", description: "Width of the area to carpet" },
      { symbol: "Room Length", description: "Length of the area to carpet" },
      { symbol: "Roll Width", description: "Width of one carpet roll" },
      { symbol: "Waste %", description: "Waste margin percentage (e.g., 0.10 for 10%)" },
      { symbol: "Roll Length", description: "Length of one carpet roll" },
      { symbol: "⎡x⎤", description: "Ceiling function (round up to next integer)" },
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
          <Label>Length of Area</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Width of Area</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Carpet Roll Width</Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
            value={inputs.rollWidth}
            onChange={(e) => handleInputChange("rollWidth", e.target.value)}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Roll Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Roll (25 m / 82 ft)</SelectItem>
              <SelectItem value="large">Large Roll (30 m / 98 ft)</SelectItem>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Carpet Roll & Waste Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Carpet Roll & Waste Calculator helps construction professionals, installers, and homeowners determine the exact amount of carpet material needed for any flooring project. This tool eliminates guesswork by accounting for material waste during cutting, seaming, and fitting—factors that can add 10% to 25% to your base square footage. Accurate calculations prevent costly material shortages mid-installation and reduce excess waste that impacts project profitability.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your room dimensions (length and width in feet), select the carpet roll width available from your supplier (typically 12 or 15 feet), and enter your waste factor percentage based on room complexity. The waste factor accounts for seams, pattern matching, obstacles, and cutting losses; use 10-12% for simple rectangular rooms, 15-18% for rooms with multiple obstacles, and 20%+ for complex layouts with stairs or irregular shapes. You can also input seam locations and room obstacles to refine your waste estimate further.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs total square footage, linear footage needed, linear yards required (adjusted for roll width), and the final order quantity including waste allowance. Use this final quantity when contacting suppliers or placing material orders to ensure you have sufficient carpet for the complete installation. Round up to the nearest roll unit when ordering, and keep the waste-adjusted figure for budget estimation and cost per square foot calculations.</p>
        </div>
      </section>

      {/* TABLE: Standard Carpet Roll Widths and Waste Factors by Room Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Carpet Roll Widths and Waste Factors by Room Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows recommended waste factor percentages based on room complexity and standard roll widths available in the market.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Complexity Level</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Waste Factor</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Roll Width</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Simple rectangular room</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10% - 12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Room with 1-2 obstacles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13% - 15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 ft or 15 ft</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Room with 3+ obstacles, alcoves</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16% - 18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">L-shaped or irregular layout</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15% - 20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 ft</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Open concept with multiple zones</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18% - 22%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Basement with moisture issues</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15% - 20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 ft</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial high-traffic space</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12% - 18%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 ft or 15 ft</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Waste factors account for seaming, cutting, and fitting losses. Increase waste percentage for patterned carpets requiring alignment.</p>
      </section>

      {/* TABLE: Carpet Roll Coverage and Yardage Conversion Guide */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Carpet Roll Coverage and Yardage Conversion Guide</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Reference this table to convert square footage into linear yards for different roll widths and verify calculator output.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Size (Sq Ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">12 ft Roll Linear Feet</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">12 ft Roll Linear Yards</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15 ft Roll Linear Feet</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15 ft Roll Linear Yards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.2</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.7</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.9</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11.1</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.7</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">83.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27.8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.2</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">41.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100.0</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.3</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Add 10-20% waste factor to these base quantities before ordering. Multiply square footage by 1.1 to 1.2 for final order amount.</p>
      </section>

      {/* TABLE: Additional Waste Allowance for Special Installations */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Additional Waste Allowance for Special Installations</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These percentages represent additional waste beyond standard room waste factors for specialized carpet applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Installation Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Additional Waste Allowance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Key Consideration</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Recommended Waste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Patterned carpet with matching</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5% - 8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pattern alignment at seams</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15% - 25%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stair installation (per flight)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15% - 30%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Complex cuts per tread/riser</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25% - 35%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Curved walls or rounded corners</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8% - 12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Contoured cutting required</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18% - 27%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diagonal or border layout</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10% - 15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Angled cuts and seams</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20% - 30%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Seaming in traffic areas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5% - 10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Precision cutting for visibility</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15% - 25%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moisture mitigation underlayment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3% - 5%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Extra material for underlap</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13% - 20%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High-pile or textured fiber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5% - 8%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Increased cutting difficulty</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15% - 25%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Total recommended waste = base room waste + additional waste allowance. Always round final order UP to nearest roll or linear yard.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure twice and measure in multiple locations—walls are rarely perfectly straight, so take measurements at the top, middle, and bottom to identify variations that affect waste calculations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a waste factor of 15% minimum for any room with obstacles, and increase to 20% or higher if the room has irregular shapes, multiple seams required, or pattern-matched carpet that demands alignment.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">When ordering patterned carpet, add an extra 5-8% to your waste allowance beyond the standard waste factor to account for pattern alignment at seams, which often creates additional scrap material.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For large commercial installations, break the space into sections (different zones may have different seam plans), calculate waste for each section separately in the calculator, then sum the totals for accuracy.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Document your waste factor assumptions and calculator results—if the installation runs short or over budget, this documentation helps justify the quantities ordered and explains actual waste to the client.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider carpet roll width availability in your region—12-foot rolls are most common, but 15-foot rolls reduce seaming in larger spaces; verify supplier inventory before finalizing calculator inputs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for future repairs or future rooms—order an additional 5-10% beyond immediate project needs if client budget allows, since matching dye lots becomes difficult &gt;12 months after original purchase.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to include waste in the initial order</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ordering only the base square footage without adding waste factor (typically 10-20%) results in running short mid-installation, requiring expensive rush orders or visible seams as patches. Always multiply your room square footage by 1.1 to 1.2 (or higher for complex layouts) before placing the order.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using the same waste factor for all room types</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A simple rectangular bedroom may need only 10% waste, but a kitchen with multiple obstacles and seaming requirements needs 18-20%. Failing to adjust waste percentage for room complexity leads to either material shortages or excessive overage and wasted budget.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing linear yards with square yards</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Suppliers may quote pricing in either linear yards (length at roll width) or square yards (total area). Mixing these measurements when ordering results in incorrect quantities—a 12-foot roll requires dividing square footage by 12 for linear feet, not by 9 as you would for square yards.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for pattern matching in waste calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Patterned carpet requires additional waste for seam alignment, but many installers use standard waste percentages without adjusting for pattern repeat requirements. This typically costs an extra 5-8% in material waste, which should be factored into waste percentage inputs before calculating final order.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring only once or in one location</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Older homes or commercial spaces often have out-of-square rooms where walls vary by several inches in length. Measuring only once and missing these variations can cause the final installation to fall short or require excessive seaming adjustments and additional waste.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Rounding down instead of up on final order quantities</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">If the calculator shows 47.3 linear yards needed, rounding down to 47 yards may create a shortage if there are any minor measurement errors or installation complications. Always round UP to the next full roll or standard order unit to maintain a safety buffer.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is waste factor and why does it matter in carpet installation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Waste factor is the percentage of carpet material lost during cutting, fitting, and seaming—typically ranging from 10% to 20% depending on room shape and layout. Underestimating waste can result in running short of material mid-installation, requiring costly rush orders or visible seams in finished areas. The calculator automatically accounts for this buffer to ensure you order sufficient yardage from the start.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure a room with irregular shapes for carpet ordering?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Break irregular rooms into rectangular sections, measure each section separately (length × width), then add all sections together for total square footage. For angled walls or alcoves, measure the longest points and round up to the nearest foot to ensure adequate coverage. Input this total square footage into the calculator along with your waste factor percentage to get accurate roll requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the standard carpet roll width and how does it affect my order?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard carpet rolls come in widths of 12 feet and 15 feet, with 12-foot widths being most common in North America. Wider rolls (15 feet) reduce seaming requirements and waste in larger installations but may be less cost-effective for small rooms under 200 square feet. The calculator helps you determine the most efficient roll width for your project dimensions and layout.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much waste should I budget for a room with multiple obstacles like pillars or built-ins?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Rooms with multiple obstacles (pillars, fireplaces, built-in shelving) typically require 15% to 25% waste factor instead of the standard 10% to 15%. Each obstacle requires additional cuts and fitting, increasing scrap material. Use the higher waste percentage in the calculator when dealing with complex layouts to avoid material shortages.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the same waste factor percentage for basement and above-ground installations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Basement installations should use a slightly higher waste factor (15% to 20%) due to moisture considerations and potential subfloor unevenness requiring more fitting adjustments. Above-ground rooms with stable subfloors can use the standard 10% to 15% waste factor. The calculator allows you to adjust waste percentages based on installation location and subfloor conditions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between linear yards and square yards when ordering carpet rolls?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Square yards measure area (length × width ÷ 9), while linear yards measure length at a specific roll width—for a 12-foot roll, divide square footage by 12 to get linear feet, then divide by 3 for linear yards. Most carpet retailers quote pricing in linear or square yards, so understanding the conversion is critical for accurate cost estimation. The calculator converts square footage into both measurements to match your supplier's quotes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does seaming location affect waste calculation in large installations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Professional installers plan seams to fall in low-traffic areas and align with room architecture, which may increase waste by 5% to 10% depending on seam placement strategy. Avoiding seams in high-traffic zones like doorways or main walkways requires more precise cutting and potentially longer roll lengths. Input your seam plan and layout preferences into the calculator to get accurate waste estimates for your specific installation design.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What waste percentage should I use for stairs when calculating total carpet needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Staircase installations typically require an additional 15% to 30% waste due to complex cuts for each tread and riser, plus potential pattern matching on visible areas. A single flight of 12 stairs can consume 20 to 40 linear feet of carpet depending on tread width and pattern considerations. Calculate stairs separately from main floor areas and add the results together in the final order quantity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the calculator for commercial vs. residential carpet installations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The calculator works for both, but commercial installations with high-traffic patterns and specific seaming requirements may need 12% to 18% waste factor versus residential 10% to 15%. Commercial spaces often have stricter aesthetic standards requiring more precise seam placement, increasing material loss. Adjust your waste factor inputs based on project type to get the most accurate commercial or residential estimates.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.carpet-rug.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Carpet and Rug Institute Installation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards and best practices for carpet installation, including seaming, waste allowances, and professional installation guidelines.</p>
          </li>
          <li>
            <a href="https://www.nahb.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders Construction Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NAHB guidelines for residential flooring installation specifications and material requirements including carpet waste factors.</p>
          </li>
          <li>
            <a href="https://www.thespruce.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce Home Improvement: Carpet Installation Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Consumer-friendly guide covering carpet measurement, waste calculation, and installation planning for homeowners.</p>
          </li>
          <li>
            <a href="https://www.csinet.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Construction Specifications Institute (CSI) Flooring Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional construction specifications for commercial and residential carpet installation including materials, labor, and quality standards.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Carpet Roll & Waste Calculator"
      description="The ultimate professional guide and calculator for Carpet Roll & Waste Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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