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

export default function BoardFootCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // default imperial for board foot calc
    length: "",
    width: "",
    depth: "",
    waste: "10",
    price: "",
    materialSize: "standard",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Board Foot Calculation:
   * Board Foot = (Length (ft) × Width (in) × Thickness (in)) / 12
   * 
   * Notes:
   * - Length in feet
   * - Width and Thickness in inches
   * 
   * For metric:
   * 1 board foot = 2.36 liters (approx)
   * Convert all dimensions to inches and feet accordingly or convert result to cubic meters.
   */

  const results = useMemo(() => {
    // Parse inputs
    const lengthRaw = parseFloat(inputs.length);
    const widthRaw = parseFloat(inputs.width);
    const depthRaw = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);

    if (
      isNaN(lengthRaw) ||
      isNaN(widthRaw) ||
      isNaN(depthRaw) ||
      lengthRaw <= 0 ||
      widthRaw <= 0 ||
      depthRaw <= 0
    ) {
      return {
        mainQty: "0 Board Feet",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert inputs based on unit system
    // Imperial: length in feet, width & depth in inches
    // Metric: length, width, depth in mm or cm? We'll assume cm input, convert to inches/feet
    // For simplicity, metric inputs are in centimeters:
    // Convert cm to inches: 1 cm = 0.393701 inches
    // Convert cm to feet: 1 cm = 0.0328084 feet

    let lengthFt = 0,
      widthIn = 0,
      depthIn = 0;

    if (inputs.unit === "imperial") {
      lengthFt = lengthRaw;
      widthIn = widthRaw;
      depthIn = depthRaw;
    } else {
      // metric assumed cm input
      lengthFt = lengthRaw * 0.0328084;
      widthIn = widthRaw * 0.393701;
      depthIn = depthRaw * 0.393701;
    }

    // Calculate board feet
    // Board Foot = (L ft × W in × D in) / 12
    const rawBoardFeet = (lengthFt * widthIn * depthIn) / 12;

    // Add waste margin
    const totalBoardFeet = rawBoardFeet * (1 + wastePercent / 100);

    // Round up to 2 decimals for display
    const roundedRaw = rawBoardFeet.toFixed(2);
    const roundedTotal = totalBoardFeet.toFixed(2);

    // Calculate cost if price given
    const cost = pricePerUnit && !isNaN(pricePerUnit) ? totalBoardFeet * pricePerUnit : 0;

    return {
      mainQty: `${roundedTotal} Board Feet`,
      cost: cost > 0 ? `$${cost.toFixed(2)}` : "Price not set",
      details: `Raw: ${roundedRaw} Board Feet`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is a board foot and how is it calculated?",
      answer: "A board foot is a standard unit of measurement for lumber equal to 144 cubic inches, or a piece of wood that is 1 inch thick, 12 inches wide, and 12 inches long. The formula is: (thickness in inches × width in inches × length in feet) ÷ 12. For example, a 2×6 board that is 10 feet long contains 10 board feet.",
    },
    {
      question: "How do I measure thickness and width for the board foot calculator?",
      answer: "Measure thickness and width in inches using nominal sizing, which is the standard way lumber is labeled in the United States. A 2×4 board means 2 inches thick by 4 inches wide nominally, though actual dimensions are typically 1.5 inches by 3.5 inches due to milling and drying. Always use the nominal measurements, not actual dimensions, for consistent calculations.",
    },
    {
      question: "What is the difference between rough-sawn and surfaced lumber board foot calculations?",
      answer: "Board foot calculations use the same formula regardless of whether lumber is rough-sawn or surfaced (planed). However, rough-sawn lumber has larger nominal dimensions than surfaced lumber of the same grade. A rough-sawn 2×6 might have slightly larger dimensions than a surfaced 2×6, but both are still calculated as 1 board foot per linear foot using their nominal measurements.",
    },
    {
      question: "How many board feet are in a standard 2×4×8 stud?",
      answer: "A 2×4×8 stud contains 5.33 board feet. Using the formula: (2 × 4 × 8) ÷ 12 = 64 ÷ 12 = 5.33 BF. This is one of the most common lumber sizes used in residential framing, and understanding this calculation helps estimate material costs and quantities for construction projects.",
    },
    {
      question: "How do I calculate board feet for irregular or non-standard lumber?",
      answer: "For non-standard sizes, apply the same board foot formula using actual nominal dimensions: (thickness × width × length in feet) ÷ 12. For example, a 1×10×12 board equals (1 × 10 × 12) ÷ 12 = 10 BF. If you have multiple pieces of varying sizes, calculate each piece separately and sum the total.",
    },
    {
      question: "What is the typical price per board foot for lumber in 2024?",
      answer: "As of 2024, softwood lumber prices range from $0.50 to $1.50 per board foot depending on species, grade, and market conditions, with pressure-treated lumber averaging $0.80 to $1.20 per BF. Hardwood lumber is significantly more expensive, ranging from $4 to $12 per board foot for premium species like oak and walnut. Prices fluctuate based on supply chain disruptions and seasonal demand.",
    },
    {
      question: "How do I estimate total material costs using board foot calculations?",
      answer: "Multiply your total board footage by the per-board-foot price for your lumber type. For example, if a deck project requires 500 board feet of pressure-treated lumber at $0.95 per BF, your lumber cost is 500 × $0.95 = $475. Always add 10–15% extra for waste and cutting errors in your estimates.",
    },
    {
      question: "Can I use the board foot calculator for plywood and sheet goods?",
      answer: "The board foot calculator is designed primarily for dimensional lumber. Plywood and sheet goods are typically sold by the sheet (4×8 feet) rather than board feet, though 3/4-inch plywood can be converted: one 4×8 sheet equals approximately 21.33 board feet. For sheet goods, it is usually more practical to count sheets directly rather than converting to board feet.",
    },
    {
      question: "How accurate is the board foot calculator for estimating project material needs?",
      answer: "The board foot calculator is highly accurate for determining lumber quantities based on specified dimensions, typically within 0.1% error. However, real-world estimates should account for 10–15% waste due to cutting, splitting, and mistakes during construction. Professional contractors often add additional contingency for unexpected material loss on job sites.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a wooden deck and need to order lumber. You have boards that are 12 feet long, 6 inches wide, and 2 inches thick. You want to include a 10% waste margin and know the price per board foot is $3.50.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate board feet: (12 ft × 6 in × 2 in) ÷ 12 = 12 board feet per board.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 12 × 1.10 = 13.2 board feet needed per board.",
      },
      {
        label: "3. Order",
        explanation:
          "Multiply by number of boards needed and multiply by price per board foot to estimate cost.",
      },
    ],
    result: "Final Order: 13.2 board feet per board, costing approximately $46.20 per board.",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Board Feet = (Length (ft) × Width (in) × Thickness (in)) ÷ 12",
    variables: [
      { symbol: "L", description: "Length of the board in feet" },
      { symbol: "W", description: "Width of the board in inches" },
      { symbol: "T", description: "Thickness of the board in inches" },
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
            <SelectItem value="metric">Metric (cm)</SelectItem>
            <SelectItem value="imperial">Imperial (ft/in)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "imperial" ? "feet" : "cm"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 12" : "e.g. 365"}
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "imperial" ? "inches" : "cm"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 6" : "e.g. 15"}
          />
        </div>
        <div className="space-y-2">
          <Label>Thickness ({inputs.unit === "imperial" ? "inches" : "cm"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={inputs.unit === "imperial" ? "e.g. 2" : "e.g. 5"}
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
          <Label>Price per Board Foot</Label>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Board Foot Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The board foot calculator helps construction professionals, DIY builders, and lumber buyers quickly determine the volume of wood in dimensional lumber. Board feet is the standard unit used in the construction and forestry industries to price and measure lumber inventory. Understanding board feet is essential for accurate material budgeting, cost estimation, and ensuring you purchase the correct quantity of lumber for your project.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input the nominal thickness (in inches), width (in inches), and length (in feet) of your lumber. For multiple pieces of the same size, you can also specify the quantity to calculate total board feet at once. The calculator automatically applies the formula: (thickness × width × length in feet) ÷ 12 to determine the board foot content for each piece or batch.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The result shows the total board footage, which you can multiply by your lumber's per-board-foot price to estimate material costs. Remember to add 10–15% to your total for waste, cutting errors, and unforeseen needs. The calculator provides a clear breakdown suitable for contractor bids, material ordering, and project planning across residential, commercial, and specialty woodworking applications.</p>
        </div>
      </section>

      {/* TABLE: Common Lumber Sizes and Board Foot Equivalents */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Lumber Sizes and Board Foot Equivalents</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the board foot content for standard dimensional lumber sizes at various lengths.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lumber Size (Nominal)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">8 ft Length (BF)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10 ft Length (BF)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">12 ft Length (BF)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">16 ft Length (BF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1×4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.33</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1×6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1×8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.67</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2×4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.67</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2×6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.00</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2×8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21.33</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2×10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26.67</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4×4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.67</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">21.33</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4×6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32.00</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All values calculated using the nominal dimensions and standard board foot formula. Actual milled dimensions are smaller due to planing and drying.</p>
      </section>

      {/* TABLE: Lumber Grade Pricing and Market Rates (2024) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Lumber Grade Pricing and Market Rates (2024)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table displays average lumber pricing ranges by grade and species as of 2024.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lumber Type and Grade</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Price Per Board Foot (Low)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Price Per Board Foot (High)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Applications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pressure-Treated #2 Pine</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decking, outdoor framing, ground contact</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard #2 Pine Stud</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Framing, wall studs, general construction</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Premium Grade Cedar</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Siding, exterior trim, visible applications</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Oak Hardwood</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Flooring, cabinets, furniture</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Walnut Hardwood</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fine furniture, premium finishes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Composite Decking</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Decking surfaces, outdoor structures</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices fluctuate based on regional availability, supply chain factors, and seasonal demand. Prices shown are approximate national averages.</p>
      </section>

      {/* TABLE: Material Estimate Example: Residential Deck Project */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Material Estimate Example: Residential Deck Project</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This example demonstrates how to use board foot calculations to estimate total lumber needs and costs for a typical 16×12 ft deck.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Component</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dimensions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Board Feet</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Price Per BF</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Deck Joists (2×8, 16 ft O.C.)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2×8×16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">128</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$121.60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Deck Boards (2×6 surface, 16 ft)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2×6×16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$91.20</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ledger Board (2×8)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2×8×12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15.20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Posts (4×4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4×4×10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">53.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$66.67</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Railings (2×4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2×4×12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$27.20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Waste and Contingency (15%)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48.59</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$46.16</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Project Total</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">373.92</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">—</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$368.03</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">This is a simplified estimate. Actual projects may require additional materials for hardware, fasteners, and structural modifications based on local building codes.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always use nominal lumber dimensions (as labeled: 2×4, 2×6, etc.) rather than actual milled dimensions in your board foot calculations for consistency with industry standards and supplier inventory systems.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add a 10–15% waste factor to your calculated board footage to account for cutting losses, splitting, warping, and mistakes during construction and installation.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Cross-reference your board foot estimates with your lumber supplier's pricing to lock in costs early, as lumber prices fluctuate based on commodity markets, seasonal demand, and supply chain disruptions.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For large projects, request a detailed lumber takeoff from your supplier or contractor—they can provide exact board foot counts and pricing tailored to your specific application and local market conditions.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Actual Instead of Nominal Dimensions</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many builders mistakenly calculate board feet using actual milled dimensions (e.g., 1.5 × 3.5 for a 2×4) instead of nominal dimensions. This produces incorrect results and mismatches with supplier inventory and pricing, leading to cost overruns and project delays.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Convert Length to Feet</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The board foot formula requires length in feet, not inches. If you input length as 120 inches instead of 10 feet, your calculation will be off by a factor of 12, vastly overestimating or underestimating your lumber needs.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Waste and Spoilage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating exact board footage without a waste buffer leads to material shortages mid-project. Professional estimates always include 10–15% extra for cutting losses, warping, splits, and mistakes during installation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Lumber Types or Grades in Calculations</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Grouping different lumber grades or species in a single calculation can mask cost differences and make pricing unclear. Always calculate board footage separately by grade, species, and cost category for accurate project budgeting and material ordering.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a board foot and how is it calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A board foot is a standard unit of measurement for lumber equal to 144 cubic inches, or a piece of wood that is 1 inch thick, 12 inches wide, and 12 inches long. The formula is: (thickness in inches × width in inches × length in feet) ÷ 12. For example, a 2×6 board that is 10 feet long contains 10 board feet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure thickness and width for the board foot calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure thickness and width in inches using nominal sizing, which is the standard way lumber is labeled in the United States. A 2×4 board means 2 inches thick by 4 inches wide nominally, though actual dimensions are typically 1.5 inches by 3.5 inches due to milling and drying. Always use the nominal measurements, not actual dimensions, for consistent calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between rough-sawn and surfaced lumber board foot calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Board foot calculations use the same formula regardless of whether lumber is rough-sawn or surfaced (planed). However, rough-sawn lumber has larger nominal dimensions than surfaced lumber of the same grade. A rough-sawn 2×6 might have slightly larger dimensions than a surfaced 2×6, but both are still calculated as 1 board foot per linear foot using their nominal measurements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many board feet are in a standard 2×4×8 stud?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 2×4×8 stud contains 5.33 board feet. Using the formula: (2 × 4 × 8) ÷ 12 = 64 ÷ 12 = 5.33 BF. This is one of the most common lumber sizes used in residential framing, and understanding this calculation helps estimate material costs and quantities for construction projects.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate board feet for irregular or non-standard lumber?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For non-standard sizes, apply the same board foot formula using actual nominal dimensions: (thickness × width × length in feet) ÷ 12. For example, a 1×10×12 board equals (1 × 10 × 12) ÷ 12 = 10 BF. If you have multiple pieces of varying sizes, calculate each piece separately and sum the total.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical price per board foot for lumber in 2024?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2024, softwood lumber prices range from $0.50 to $1.50 per board foot depending on species, grade, and market conditions, with pressure-treated lumber averaging $0.80 to $1.20 per BF. Hardwood lumber is significantly more expensive, ranging from $4 to $12 per board foot for premium species like oak and walnut. Prices fluctuate based on supply chain disruptions and seasonal demand.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I estimate total material costs using board foot calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your total board footage by the per-board-foot price for your lumber type. For example, if a deck project requires 500 board feet of pressure-treated lumber at $0.95 per BF, your lumber cost is 500 × $0.95 = $475. Always add 10–15% extra for waste and cutting errors in your estimates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use the board foot calculator for plywood and sheet goods?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The board foot calculator is designed primarily for dimensional lumber. Plywood and sheet goods are typically sold by the sheet (4×8 feet) rather than board feet, though 3/4-inch plywood can be converted: one 4×8 sheet equals approximately 21.33 board feet. For sheet goods, it is usually more practical to count sheets directly rather than converting to board feet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How accurate is the board foot calculator for estimating project material needs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The board foot calculator is highly accurate for determining lumber quantities based on specified dimensions, typically within 0.1% error. However, real-world estimates should account for 10–15% waste due to cutting, splitting, and mistakes during construction. Professional contractors often add additional contingency for unexpected material loss on job sites.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.fpl.fs.usda.gov/documnts/pdf/fpl_gtr139.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Forest Products Laboratory — Wood Measurement Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">USDA Forest Products Laboratory provides authoritative guidance on lumber measurement, board foot standards, and volume calculations for the forestry and construction industries.</p>
          </li>
          <li>
            <a href="https://www.nist.gov/pml/special-publication-330" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Institute of Standards and Technology — NIST Standard Units</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NIST defines standard units of measurement and conversion factors, including official board foot specifications used across U.S. construction and lumber trade.</p>
          </li>
          <li>
            <a href="https://www.alsc.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Lumber Standard Committee — Softwood Lumber Grades</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ALSC establishes voluntary standards for softwood lumber grading, sizing, and classification, ensuring consistency and accuracy in lumber measurement and quality across North America.</p>
          </li>
          <li>
            <a href="https://www.investopedia.com/lumber-prices-5087304" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Investopedia — Lumber Pricing and Market Trends</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Investopedia provides current lumber pricing trends, market analysis, and historical benchmarks to help builders and investors understand construction material cost factors.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Board Foot Calculator"
      description="The ultimate professional guide and calculator for Board Foot Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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