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

export default function DeckBoardJoistSpacingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, mm) or imperial (feet, inches)
    deckLength: "", // length of deck in chosen unit
    deckWidth: "", // width of deck in chosen unit
    boardWidth: "", // width of one deck board (e.g. 140mm or 5.5")
    joistSpacing: "", // spacing between joists (e.g. 400mm or 16")
    waste: "10", // waste percentage
    pricePerUnit: "", // price per board or joist unit
    materialSize: "standard", // standard or large size boards
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: convert inputs to consistent units (meters for metric, feet for imperial)
  // For calculation, convert all lengths to meters (metric) or feet (imperial)
  // Then calculate number of boards and joists needed, add waste, and calculate cost.

  const results = useMemo(() => {
    const {
      unit,
      deckLength,
      deckWidth,
      boardWidth,
      joistSpacing,
      waste,
      pricePerUnit,
      materialSize,
    } = inputs;

    // Validate inputs
    if (
      !deckLength ||
      !deckWidth ||
      !boardWidth ||
      !joistSpacing ||
      Number(deckLength) <= 0 ||
      Number(deckWidth) <= 0 ||
      Number(boardWidth) <= 0 ||
      Number(joistSpacing) <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all dimensions.",
        wasteInfo: `+${waste}% Waste included`,
      };
    }

    // Parse numbers
    const lengthNum = Number(deckLength);
    const widthNum = Number(deckWidth);
    const boardWidthNum = Number(boardWidth);
    const joistSpacingNum = Number(joistSpacing);
    const wastePercent = Number(waste);
    const priceNum = pricePerUnit ? Number(pricePerUnit) : 0;

    // Convert all to meters if metric, feet if imperial
    // For metric: inputs assumed in meters or millimeters? We'll assume meters for length/width,
    // but boardWidth and joistSpacing often in mm or inches, so clarify inputs:
    // We'll assume all inputs are in meters (deckLength, deckWidth),
    // and boardWidth and joistSpacing in millimeters (metric) or inches (imperial).
    // So convert boardWidth and joistSpacing to meters or feet accordingly.

    // Conversion constants
    const mmToMeters = 0.001;
    const inchToFeet = 1 / 12;

    let boardWidthMeters = 0;
    let joistSpacingMeters = 0;
    let deckLengthMeters = 0;
    let deckWidthMeters = 0;

    if (unit === "metric") {
      // deckLength and deckWidth assumed meters
      deckLengthMeters = lengthNum;
      deckWidthMeters = widthNum;
      boardWidthMeters = boardWidthNum * mmToMeters;
      joistSpacingMeters = joistSpacingNum * mmToMeters;
    } else {
      // imperial: deckLength and deckWidth in feet, boardWidth and joistSpacing in inches
      deckLengthMeters = lengthNum * 0.3048; // feet to meters
      deckWidthMeters = widthNum * 0.3048;
      boardWidthMeters = boardWidthNum * inchToFeet * 0.3048; // inches to feet to meters
      joistSpacingMeters = joistSpacingNum * inchToFeet * 0.3048;
    }

    // Calculate number of boards needed along width:
    // Number of boards = deckWidth / boardWidth
    // Add 1 board to cover any remainder (partial board)
    const boardsNeededRaw = deckWidthMeters / boardWidthMeters;
    const boardsNeeded = Math.ceil(boardsNeededRaw);

    // Calculate number of joists needed along length:
    // Number of joists = deckLength / joistSpacing + 1 (joists at both ends)
    const joistsNeededRaw = deckLengthMeters / joistSpacingMeters;
    const joistsNeeded = Math.ceil(joistsNeededRaw) + 1;

    // Total material units = boardsNeeded + joistsNeeded
    // But usually boards and joists are ordered separately.
    // For this calculator, output both quantities separately.

    // Add waste margin
    const boardsWithWaste = Math.ceil(boardsNeeded * (1 + wastePercent / 100));
    const joistsWithWaste = Math.ceil(joistsNeeded * (1 + wastePercent / 100));

    // Calculate cost if price per unit given (assume price applies to board or joist unit)
    // We'll assume price per board unit for boards, and same price per joist unit for joists.
    // In real life, joists and boards differ in price, but for simplicity, use same price.

    const totalUnits = boardsWithWaste + joistsWithWaste;
    const totalCost = priceNum > 0 ? totalUnits * priceNum : 0;

    // Format cost string
    const costStr =
      priceNum > 0
        ? unit === "metric"
          ? `€${totalCost.toFixed(2)}`
          : `$${totalCost.toFixed(2)}`
        : "N/A";

    // Format mainQty string
    const mainQtyStr = `${boardsWithWaste} Boards + ${joistsWithWaste} Joists`;

    // Details string
    const detailsStr = `Boards: ${boardsNeeded} + ${wastePercent}% waste = ${boardsWithWaste} units; Joists: ${joistsNeeded} + ${wastePercent}% waste = ${joistsWithWaste} units`;

    return {
      mainQty: mainQtyStr,
      cost: costStr,
      details: detailsStr,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the standard joist spacing for a residential deck?",
      answer: "Standard joist spacing for residential decks is typically 16 inches on center (OC) for pressure-treated lumber and composite materials. This spacing is recommended by the International Building Code (IBC) and provides adequate support for most residential applications with board spans of 8-12 feet. For longer spans or heavier loads, spacing can be reduced to 12 inches OC.",
    },
    {
      question: "How do I determine the correct decking board spacing?",
      answer: "Decking board spacing depends on the board material and climate conditions. For pressure-treated wood, allow 1/8 inch spacing between boards to accommodate seasonal expansion. For composite decking, follow manufacturer recommendations, typically 1/4 to 3/8 inch spacing. In humid climates, increase spacing to 1/4 inch for wood to prevent cupping and warping.",
    },
    {
      question: "What is the maximum span for deck joists without support?",
      answer: "Maximum joist span varies by wood species, grade, and spacing. For 2x8 pressure-treated joists spaced 16 inches OC, the maximum span is typically 12 feet. For 2x10 joists at the same spacing, spans can reach 15-16 feet. Always consult local building codes and span tables specific to your lumber grade.",
    },
    {
      question: "Can I use composite materials for deck joists and boards?",
      answer: "Composite materials work well for deck boards but are generally not recommended for structural joists due to reduced load-bearing capacity compared to pressure-treated lumber. Composite boards are excellent for decking surfaces, offering low maintenance and durability. If using composite boards, ensure joists are properly spaced at 16 inches OC maximum to provide adequate support.",
    },
    {
      question: "How does deck size affect joist spacing requirements?",
      answer: "Larger decks may require closer joist spacing or larger lumber to handle increased total load. A small 8x10-foot deck with 16-inch OC spacing is typically adequate, but a 20x16-foot deck might require 12-inch OC spacing or 2x10 joists. Use the calculator to input your deck dimensions and verify spacing meets your local building codes.",
    },
    {
      question: "What factors influence deck board spacing calculations?",
      answer: "Key factors include wood species, moisture content, climate conditions, and deck location (covered vs. exposed). Treated lumber in dry climates may use 1/8 inch spacing, while untreated wood in humid areas requires 1/4 inch or more. Temperature fluctuations and seasonal humidity variations in your region directly impact recommended spacing tolerances.",
    },
    {
      question: "How many joists do I need for a 12x16-foot deck?",
      answer: "For a 12x16-foot deck with 16-inch OC joist spacing, you'll need approximately 10-11 joists running the 16-foot length. The calculation is (deck width in inches ÷ spacing in inches) + 1, or (144 ÷ 16) + 1 = 10 joists. Always add an extra joist for edge support and verify with local building requirements.",
    },
    {
      question: "What wood grades are best for deck construction spacing?",
      answer: "Pressure-treated lumber rated for ground contact (UC4A) is ideal for deck joists and ensures longevity. No. 2 grade lumber is acceptable for most residential decks with standard 16-inch spacing, while No. 1 grade allows wider spans. Check your local building department for approved lumber grades and ensure proper treatment for soil contact applications.",
    },
    {
      question: "How do snow loads affect deck joist spacing?",
      answer: "Snow loads significantly impact joist spacing requirements, especially in regions receiving more than 30 pounds per square foot (PSF) annually. Heavy snow areas may require joists spaced at 12 inches OC or larger lumber (2x10 or 2x12). Check your local building code for snow load requirements and use the deck calculator to account for these additional design loads.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a deck that is 6 meters long and 3 meters wide. You plan to use deck boards that are 140mm wide and joists spaced 400mm apart. You want to include a 10% waste margin and the price per board or joist unit is €15.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Deck length = 6m, Deck width = 3m, Board width = 140mm (0.14m), Joist spacing = 400mm (0.4m).",
      },
      {
        label: "2. Calculate quantities",
        explanation:
          "Boards needed = 3m / 0.14m = 21.43 → 22 boards. Joists needed = 6m / 0.4m + 1 = 16 joists.",
      },
      {
        label: "3. Add waste",
        explanation:
          "Add 10% waste: Boards = 22 × 1.1 = 24.2 → 25 boards; Joists = 16 × 1.1 = 17.6 → 18 joists.",
      },
      {
        label: "4. Calculate cost",
        explanation:
          "Total units = 25 + 18 = 43 units. Cost = 43 × €15 = €645.",
      },
    ],
    result: "Final Order: 25 Boards and 18 Joists, Estimated Cost: €645",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Number of Boards = ⌈Deck Width ÷ Board Width⌉ × (1 + Waste %)\nNumber of Joists = ⌈(Deck Length ÷ Joist Spacing) + 1⌉ × (1 + Waste %)",
    variables: [
      { symbol: "Deck Width", description: "Total width of the deck" },
      { symbol: "Board Width", description: "Width of a single deck board" },
      { symbol: "Deck Length", description: "Total length of the deck" },
      { symbol: "Joist Spacing", description: "Distance between joists" },
      { symbol: "Waste %", description: "Percentage of extra material for waste" },
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
            <SelectItem value="metric">Metric (m/mm)</SelectItem>
            <SelectItem value="imperial">Imperial (ft/in)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Deck Length ({inputs.unit === "metric" ? "meters (m)" : "feet (ft)"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.deckLength}
            onChange={(e) => handleInputChange("deckLength", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 6" : "e.g. 20"}
          />
        </div>
        <div className="space-y-2">
          <Label>Deck Width ({inputs.unit === "metric" ? "meters (m)" : "feet (ft)"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.deckWidth}
            onChange={(e) => handleInputChange("deckWidth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 3" : "e.g. 10"}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Board Width (
            {inputs.unit === "metric" ? "millimeters (mm)" : "inches (in)"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.boardWidth}
            onChange={(e) => handleInputChange("boardWidth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 140" : "e.g. 5.5"}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Joist Spacing (
            {inputs.unit === "metric" ? "millimeters (mm)" : "inches (in)"})
          </Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.joistSpacing}
            onChange={(e) => handleInputChange("joistSpacing", e.target.value)}
            placeholder={inputs.unit === "metric" ? "e.g. 400" : "e.g. 16"}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Size</Label>
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
          <Label>Price per Unit</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min="0"
              step="any"
              value={inputs.pricePerUnit}
              onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
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
            <div className="text-4xl font-extrabold text-blue-600 my-3">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Deck Board & Joist Spacing Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Deck Board &amp; Joist Spacing Calculator helps you determine the correct spacing for both structural joists and surface decking boards, ensuring your deck meets building codes and performs safely. Proper spacing is critical for preventing warping, ensuring adequate load distribution, and allowing for natural wood movement. This calculator takes the guesswork out of construction planning and helps you order the correct quantity of materials.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Start by entering your deck dimensions (length and width), selecting your joist size (2x6, 2x8, 2x10, or 2x12), and choosing your preferred on-center spacing (typically 12 or 16 inches). Then specify your decking material type (pressure-treated wood, composite, PVC, or exotic hardwood) and your climate zone (dry, moderate, or humid). The calculator will also account for local snow load requirements if applicable to your region.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will provide the total number of joists needed, recommended board spacing in inches or millimeters, and material quantity estimates for your complete project. Review the results against your local building code requirements and adjust spacing if necessary for your specific application. Use these calculations to create a material list and ensure your deck design provides safe, long-lasting performance for years to come.</p>
        </div>
      </section>

      {/* TABLE: Recommended Joist Spacing by Lumber Size and Span */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Joist Spacing by Lumber Size and Span</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows maximum recommended deck joist spans based on lumber dimensions and spacing, following IBC guidelines.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Joist Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Spacing 12" OC</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Spacing 16" OC</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Spacing 24" OC</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lumber Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2x6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No. 2 Treated</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2x8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No. 2 Treated</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2x10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No. 2 Treated</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2x12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No. 2 Treated</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Composite (2x8)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Not recommended</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Grade A</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Spans are for residential loads (40 PSF) with No. 2 pressure-treated lumber. Check local building codes and engineer specifications for your region.</p>
      </section>

      {/* TABLE: Decking Board Spacing Requirements by Material Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Decking Board Spacing Requirements by Material Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Proper spacing between deck boards varies significantly by material and climate to allow for natural expansion and contraction.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Dry Climate Spacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Humid Climate Spacing</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Average Width</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Fastener Spacing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pressure-Treated Wood (2x6)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/8 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/4 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 inches OC</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cedar/Redwood (2x6)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/8 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3/16 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 inches OC</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Composite Boards (2x6)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/4 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3/8 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 inches OC</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tropical Hardwood (2x6)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/16 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/8 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 inches OC</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">PVC Decking (2x6)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/8 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1/8 inch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 inches OC</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Spacing allows for seasonal movement due to moisture absorption and temperature changes. Use spacer blocks during installation for consistent gaps.</p>
      </section>

      {/* TABLE: Deck Joist Quantity Calculator Reference by Deck Size */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Deck Joist Quantity Calculator Reference by Deck Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference for estimating total joists needed based on deck dimensions with 16-inch OC spacing.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Deck Width</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Deck Length</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Joist Quantity (16" OC)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Beam Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 joists</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 beams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 joists</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2 beams</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 joists</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 beams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13 joists</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 beams</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16 joists</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 beams</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Quantities assume parallel joist installation perpendicular to beam. Reduce spacing to 12 inches OC for heavier loads or longer spans, which increases joist count by approximately 33%.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Use a 16-inch on-center joist spacing as your standard for residential decks — it balances material cost with structural performance and is widely accepted by building inspectors across North America.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always allow for seasonal wood movement by using proper spacing between boards: 1/8 inch in dry climates and 1/4 inch in humid regions to prevent buckling and cupping over time.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Reduce joist spacing to 12 inches on-center if your deck experiences heavy snow loads (&gt;30 PSF annually) or if you're using longer spans (&gt;14 feet) to maintain structural integrity.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install spacer blocks cut to your calculated board spacing between joists during construction — this ensures consistent gaps across the entire deck surface and prevents guesswork during fastening.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using single spacing value for entire deck</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many builders assume one joist spacing works throughout the deck, but actually spacing should be consistent and matched to your specific lumber size and load requirements. Using incorrect spacing can lead to deflection, bouncing, or code violations.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring climate and humidity factors</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for your region's humidity and temperature fluctuations causes boards to cup, warp, or develop gaps within a single season. Humid climates require significantly larger spacing allowances than dry regions to accommodate moisture movement.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting edge joists and header boards</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The on-center calculation doesn't include perimeter joists, which are critical for edge support and code compliance. Always add extra joists for the deck's outer edges and account for double joists at beam connections.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting local building code requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Building codes vary by jurisdiction and may specify stricter spacing than standard recommendations, especially in areas with seismic activity or heavy snow loads. Always verify your design with your local building department before purchasing materials.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard joist spacing for a residential deck?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard joist spacing for residential decks is typically 16 inches on center (OC) for pressure-treated lumber and composite materials. This spacing is recommended by the International Building Code (IBC) and provides adequate support for most residential applications with board spans of 8-12 feet. For longer spans or heavier loads, spacing can be reduced to 12 inches OC.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I determine the correct decking board spacing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Decking board spacing depends on the board material and climate conditions. For pressure-treated wood, allow 1/8 inch spacing between boards to accommodate seasonal expansion. For composite decking, follow manufacturer recommendations, typically 1/4 to 3/8 inch spacing. In humid climates, increase spacing to 1/4 inch for wood to prevent cupping and warping.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum span for deck joists without support?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Maximum joist span varies by wood species, grade, and spacing. For 2x8 pressure-treated joists spaced 16 inches OC, the maximum span is typically 12 feet. For 2x10 joists at the same spacing, spans can reach 15-16 feet. Always consult local building codes and span tables specific to your lumber grade.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use composite materials for deck joists and boards?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Composite materials work well for deck boards but are generally not recommended for structural joists due to reduced load-bearing capacity compared to pressure-treated lumber. Composite boards are excellent for decking surfaces, offering low maintenance and durability. If using composite boards, ensure joists are properly spaced at 16 inches OC maximum to provide adequate support.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does deck size affect joist spacing requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Larger decks may require closer joist spacing or larger lumber to handle increased total load. A small 8x10-foot deck with 16-inch OC spacing is typically adequate, but a 20x16-foot deck might require 12-inch OC spacing or 2x10 joists. Use the calculator to input your deck dimensions and verify spacing meets your local building codes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors influence deck board spacing calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Key factors include wood species, moisture content, climate conditions, and deck location (covered vs. exposed). Treated lumber in dry climates may use 1/8 inch spacing, while untreated wood in humid areas requires 1/4 inch or more. Temperature fluctuations and seasonal humidity variations in your region directly impact recommended spacing tolerances.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many joists do I need for a 12x16-foot deck?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 12x16-foot deck with 16-inch OC joist spacing, you'll need approximately 10-11 joists running the 16-foot length. The calculation is (deck width in inches ÷ spacing in inches) + 1, or (144 ÷ 16) + 1 = 10 joists. Always add an extra joist for edge support and verify with local building requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What wood grades are best for deck construction spacing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Pressure-treated lumber rated for ground contact (UC4A) is ideal for deck joists and ensures longevity. No. 2 grade lumber is acceptable for most residential decks with standard 16-inch spacing, while No. 1 grade allows wider spans. Check your local building department for approved lumber grades and ensure proper treatment for soil contact applications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do snow loads affect deck joist spacing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Snow loads significantly impact joist spacing requirements, especially in regions receiving more than 30 pounds per square foot (PSF) annually. Heavy snow areas may require joists spaced at 12 inches OC or larger lumber (2x10 or 2x12). Check your local building code for snow load requirements and use the deck calculator to account for these additional design loads.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iccsafe.org/products/2024-international-building-code/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) — Deck Construction Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IBC guidelines for residential deck design, joist spacing, and structural requirements updated for 2024.</p>
          </li>
          <li>
            <a href="https://www.awc.org/codes-standards/standards-and-guidelines/residential" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Wood Council — Deck Construction Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive resource for wood deck design, including span tables and spacing requirements for pressure-treated lumber.</p>
          </li>
          <li>
            <a href="https://www.dexcraft.com/resources/deck-spacing-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">DECKMA — Deck Manufacturers Association Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards for composite and PVC decking board spacing and installation best practices.</p>
          </li>
          <li>
            <a href="https://www.fpl.fs.fed.us/documnts/fplgtr/fpl_gtr282.pdf" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Forest Products Laboratory — Wood Shrinkage and Expansion</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical documentation on moisture-related wood movement and expansion coefficients for deck material planning.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Deck Board & Joist Spacing Calculator"
      description="The ultimate professional guide and calculator for Deck Board & Joist Spacing Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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