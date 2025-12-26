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
      question: "What is the ideal joist spacing for deck construction?",
      answer:
        "The ideal joist spacing depends on the type of decking material and the load it must support. Common spacing is 16 inches (400mm) on center for wood decking, but composite materials may require closer spacing like 12 inches (300mm). Proper spacing ensures structural integrity and prevents sagging.",
    },
    {
      question:
        "Why is it important to include a waste margin when ordering deck boards and joists?",
      answer:
        "Including a waste margin accounts for cutting errors, damaged materials, and future repairs. Typically, a 10% waste factor is recommended to avoid shortages during installation, ensuring the project can be completed without delays or additional orders.",
    },
    {
      question:
        "How do I convert measurements between metric and imperial units for this calculator?",
      answer:
        "This calculator allows you to select metric or imperial units. When using metric, lengths should be entered in meters and widths/spacing in millimeters. For imperial, lengths are in feet and widths/spacing in inches. The calculator automatically converts these internally for accurate results.",
    },
    {
      question:
        "Can I use this calculator for different types of decking materials?",
      answer:
        "Yes, this calculator works for various decking materials such as wood, composite, or PVC. However, you should adjust the board width and joist spacing inputs according to the manufacturer's recommendations for each material to ensure safety and durability.",
    },
    {
      question:
        "How does board width affect the total number of boards needed?",
      answer:
        "Board width directly impacts how many boards are required to cover the deck width. Wider boards cover more area, reducing the total number needed, while narrower boards increase the quantity. Accurate board width input is essential for precise material estimation.",
    },
    {
      question:
        "What is the difference between standard and large material sizes in this calculator?",
      answer:
        "Standard and large sizes refer to typical dimensions of deck boards and joists. Standard sizes are common industry dimensions, while large sizes may be thicker or wider boards used for heavier loads or aesthetic preferences. Selecting the correct size helps estimate material quantities more accurately.",
    },
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
      {/* 4. GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Professional Guide: Deck Board
          & Joist Spacing Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            The Deck Board & Joist Spacing Calculator is an essential tool for
            construction professionals and DIY enthusiasts planning a deck build.
            It helps determine the precise number of deck boards and joists required
            based on your deck's dimensions and material specifications.
          </p>
          <p>
            Precision in calculating board and joist quantities is crucial to avoid
            costly material shortages or excessive waste. Proper spacing ensures
            structural integrity, safety, and longevity of your deck.
          </p>
          <p>
            Different materials such as wood, composite, or PVC decking have varying
            recommended board widths and joist spacing. This calculator allows you
            to input these values to tailor calculations to your specific project.
          </p>
          <p>
            Additionally, the calculator factors in a waste margin to accommodate
            cutting errors, defects, and future repairs, helping you order the right
            amount of materials without overspending.
          </p>
        </div>
      </section>

      {/* 5. TIPS / DID YOU KNOW */}
      <section
        id="tips"
        className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <Lightbulb className="w-5 h-5 text-yellow-500" /> Pro Tips & Curiosities
        </h3>
        <ul className="space-y-2 list-disc pl-5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            <strong>Tip:</strong> Always measure twice and consider the thickness of
            decking boards when calculating total deck width to avoid gaps.
          </li>
          <li>
            <strong>Did You Know?</strong> Joist spacing affects not only strength
            but also the feel of the deck underfoot; closer joists reduce board
            flex.
          </li>
          <li>
            <strong>Contractor Secret:</strong> Ordering slightly more material than
            calculated can save time and money by preventing last-minute trips to
            the supplier.
          </li>
        </ul>
      </section>

      {/* 6. MISTAKES */}
      <section
        id="mistakes"
        className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900"
      >
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Incorrect Unit Conversion:</strong> Mixing metric and imperial
            units without proper conversion can lead to significant material
            miscalculations.
          </p>
          <p>
            <strong>2. Ignoring Waste Margin:</strong> Not including a waste factor
            often results in insufficient materials, causing project delays and
            extra costs.
          </p>
          <p>
            <strong>3. Overlooking Board Thickness:</strong> Failing to account for
            board thickness when measuring deck width can cause gaps or overlaps.
          </p>
          <p>
            <strong>4. Assuming Uniform Joist Spacing:</strong> Joist spacing should
            follow manufacturer guidelines and local building codes for safety.
          </p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-500" /> Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0"
            >
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
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
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}