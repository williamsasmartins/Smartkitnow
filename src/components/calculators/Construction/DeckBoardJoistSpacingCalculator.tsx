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
  Truck,
} from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function DeckBoardJoistSpacingCalculator() {
  const [inputs, setInputs] = useState({
    unit: "imperial", // default to imperial (feet)
    deckLength: "", // length of deck in feet/meters
    deckWidth: "", // width of deck in feet/meters
    boardWidth: "5.5", // width of deck board in inches (default 5.5" for 2x6 nominal)
    boardThickness: "1.5", // thickness of deck board in inches (nominal 2x6 = 1.5")
    joistSpacing: "16", // joist spacing in inches (default 16")
    waste: "10", // waste percentage
    pricePerBoard: "", // price per board (bundle or piece)
    boardLength: "8", // length of each board in feet (default 8 ft)
    boardUnit: "piece", // purchase unit: piece or bundle
    boardsPerBundle: "5", // number of boards per bundle (default 5)
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Helper to convert feet to inches or meters to cm
  const toInches = (val: number, unit: string) =>
    unit === "imperial" ? val : val * 39.3701;

  const toFeet = (val: number, unit: string) =>
    unit === "imperial" ? val : val * 3.28084;

  // Convert inches to feet
  const inchesToFeet = (inches: number) => inches / 12;

  // Round up helper
  const roundUp = (num: number) => Math.ceil(num);

  const results = useMemo(() => {
    // Parse inputs safely
    const deckLengthNum = parseFloat(inputs.deckLength);
    const deckWidthNum = parseFloat(inputs.deckWidth);
    const boardWidthIn = parseFloat(inputs.boardWidth);
    const boardThicknessIn = parseFloat(inputs.boardThickness);
    const joistSpacingIn = parseFloat(inputs.joistSpacing);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.pricePerBoard);
    const boardLengthFt = parseFloat(inputs.boardLength);
    const boardsPerBundle = parseInt(inputs.boardsPerBundle, 10);
    const unit = inputs.unit;
    const boardUnit = inputs.boardUnit;

    if (
      !deckLengthNum ||
      !deckWidthNum ||
      !boardWidthIn ||
      !boardThicknessIn ||
      !joistSpacingIn ||
      !pricePerUnit ||
      !boardLengthFt
    )
      return null;

    // Convert deck dimensions to inches for calculation
    const deckLengthIn = toInches(deckLengthNum, unit);
    const deckWidthIn = toInches(deckWidthNum, unit);

    // 1. Calculate number of joists needed:
    // Joists run perpendicular to deck boards, spaced at joistSpacingIn inches.
    // Number of joists = (deckWidth / joistSpacing) + 1 (for starting edge)
    const joistCount = roundUp(deckWidthIn / joistSpacingIn) + 1;

    // 2. Calculate number of deck boards needed:
    // Boards run parallel to joists, so number of boards = deckLength / board width
    // But boards are sold in lengths, so calculate linear feet of decking needed:
    // Total linear feet of decking = (deckWidth in feet) / (board width in feet) * deckLength in feet
    // Actually, better to calculate boards along deck width:
    // Number of boards = deckWidth / board width (in inches)
    // Each board length covers deck length, so number of boards needed = boards across width

    // Convert board width inches to feet
    const boardWidthFt = boardWidthIn / 12;

    // Number of boards needed across deck width (boards run lengthwise)
    const boardsNeeded = deckWidthIn / boardWidthIn;

    // Total linear feet of decking = boardsNeeded * deckLength (in feet)
    const totalLinearFeet = boardsNeeded * deckLengthNum;

    // Number of boards needed = total linear feet / board length (ft)
    const boardsCountRaw = totalLinearFeet / boardLengthFt;

    // Add waste factor
    const boardsCountWithWaste = boardsCountRaw * (1 + wastePercent / 100);

    // Final boards count rounded up
    const boardsCountFinal = roundUp(boardsCountWithWaste);

    // Calculate bundles or pieces needed
    let purchaseUnits = 0;
    let purchaseUnitLabel = "";
    if (boardUnit === "bundle") {
      purchaseUnits = roundUp(boardsCountFinal / boardsPerBundle);
      purchaseUnitLabel = `Bundles (${boardsPerBundle} boards each)`;
    } else {
      purchaseUnits = boardsCountFinal;
      purchaseUnitLabel = "Boards (pieces)";
    }

    // Total cost
    const totalCost = purchaseUnits * pricePerUnit;

    // Feedback message based on deck size
    let feedback = "";
    if (deckLengthNum * deckWidthNum < 50) {
      feedback = "Perfect for a small deck or balcony.";
    } else if (deckLengthNum * deckWidthNum < 200) {
      feedback = "Suitable for a medium-sized deck.";
    } else {
      feedback = "Large deck project - double check measurements.";
    }

    return {
      qty: `${purchaseUnits.toLocaleString()} ${purchaseUnitLabel}`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Deck Size: ${deckLengthNum} x ${deckWidthNum} ${
        unit === "imperial" ? "ft" : "m"
      }, Boards Needed (with waste): ${boardsCountFinal.toLocaleString()}`,
      wasteInfo: `+${wastePercent}% Waste included (for cuts, errors, and defects)`,
      feedback,
      joistCount,
    };
  }, [inputs]);

  const faqs = [
    {
      question: "Does this calculator include joist quantity?",
      answer:
        "Yes, it calculates the number of joists needed based on your deck width and joist spacing.",
    },
    {
      question: "Why do I need to add waste/overage percentage?",
      answer:
        "Waste accounts for cuts, mistakes, damaged boards, and off-cuts that can't be reused, ensuring you don't run short.",
    },
    {
      question: "Can I use different board widths or lengths?",
      answer:
        "Absolutely! You can input your actual board width and length to get accurate material estimates.",
    },
    {
      question: "How do I measure joist spacing?",
      answer:
        "Measure the distance between the centers of two adjacent joists. Common spacing is 16 inches on center.",
    },
    {
      question: "Does this calculator consider gaps between deck boards?",
      answer:
        "No, this calculator assumes tight board placement. For gaps, you may want to slightly increase waste percentage.",
    },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
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
            <SelectItem value="metric">Metric (Meters)</SelectItem>
            <SelectItem value="imperial">Imperial (Feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dimensions Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Deck Length ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={inputs.deckLength}
            onChange={(e) => handleInputChange("deckLength", e.target.value)}
            placeholder="e.g. 12"
          />
        </div>
        <div className="space-y-2">
          <Label>Deck Width ({inputs.unit === "imperial" ? "ft" : "m"})</Label>
          <Input
            type="number"
            min={0}
            step="0.01"
            value={inputs.deckWidth}
            onChange={(e) => handleInputChange("deckWidth", e.target.value)}
            placeholder="e.g. 10"
          />
        </div>
        <div className="space-y-2">
          <Label>Deck Board Width (inches)</Label>
          <Input
            type="number"
            min={0}
            step="0.1"
            value={inputs.boardWidth}
            onChange={(e) => handleInputChange("boardWidth", e.target.value)}
            placeholder="e.g. 5.5"
          />
        </div>
        <div className="space-y-2">
          <Label>Deck Board Thickness (inches)</Label>
          <Input
            type="number"
            min={0}
            step="0.1"
            value={inputs.boardThickness}
            onChange={(e) => handleInputChange("boardThickness", e.target.value)}
            placeholder="e.g. 1.5"
          />
        </div>
        <div className="space-y-2">
          <Label>Joist Spacing (inches)</Label>
          <Input
            type="number"
            min={0}
            step="0.5"
            value={inputs.joistSpacing}
            onChange={(e) => handleInputChange("joistSpacing", e.target.value)}
            placeholder="e.g. 16"
          />
        </div>
        <div className="space-y-2">
          <Label>Deck Board Length (ft)</Label>
          <Input
            type="number"
            min={0}
            step="0.5"
            value={inputs.boardLength}
            onChange={(e) => handleInputChange("boardLength", e.target.value)}
            placeholder="e.g. 8"
          />
        </div>
      </div>

      {/* Material Settings (Size & Price) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Purchase Unit</Label>
          <Select
            value={inputs.boardUnit}
            onValueChange={(v) => handleInputChange("boardUnit", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="piece">Piece (Individual Board)</SelectItem>
              <SelectItem value="bundle">Bundle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {inputs.boardUnit === "bundle" && (
          <div className="space-y-2">
            <Label>Boards per Bundle</Label>
            <Input
              type="number"
              min={1}
              step={1}
              value={inputs.boardsPerBundle}
              onChange={(e) => handleInputChange("boardsPerBundle", e.target.value)}
              placeholder="e.g. 5"
            />
          </div>
        )}
        <div className="space-y-2">
          <Label>Price per {inputs.boardUnit === "bundle" ? "Bundle" : "Board"}</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="0.01"
              value={inputs.pricePerBoard}
              onChange={(e) => handleInputChange("pricePerBoard", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Waste Slider */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste / Overage Factor</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          value={[parseInt(inputs.waste)]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
        />
        <p className="text-xs text-slate-500">
          Accounts for spills, cuts, and errors. Industry standard is 10%.
        </p>
      </div>

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
        onClick={() => {}}
      >
        <Hammer className="mr-2 h-5 w-5" /> Calculate Materials
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase">
              You Need To Buy
            </span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.qty}
            </div>
            <div className="text-xl font-medium text-slate-700 dark:text-slate-300">
              Est. Cost: {results.cost}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center">
                <Info className="w-3 h-3 mr-1" /> {results.details}
              </span>
              <span className="flex items-center text-amber-600">
                <Truck className="w-3 h-3 mr-1" /> {results.wasteInfo}
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Joists Needed: <strong>{results.joistCount}</strong>
            </div>
            <div className="mt-2 font-semibold text-blue-700 dark:text-blue-400">
              {results.feedback}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-10">
      <section id="how-to">
        <h2 className="text-2xl font-bold mb-4">How to Calculate for Deck Board & Joist Spacing</h2>
        <div className="prose prose-slate dark:prose-invert">
          <p>
            Accurate estimation saves money and time. Follow these steps to measure your deck and calculate materials:
          </p>
          <ol>
            <li>
              <strong>Measure Deck Length and Width:</strong> Use a tape measure to get the overall length and width of your deck area in feet or meters.
            </li>
            <li>
              <strong>Determine Deck Board Size:</strong> Identify the nominal width and thickness of your deck boards (e.g., 5.5" wide for 2x6 boards).
            </li>
            <li>
              <strong>Choose Board Length:</strong> Select the length of boards you plan to purchase (commonly 8, 10, or 12 feet).
            </li>
            <li>
              <strong>Measure Joist Spacing:</strong> Measure the distance between joists (usually 16" or 24" on center).
            </li>
            <li>
              <strong>Input Waste Factor:</strong> Add a waste percentage (typically 10%) to cover cuts, mistakes, and damaged boards.
            </li>
            <li>
              <strong>Enter Price and Purchase Unit:</strong> Input the price per board or bundle and specify how many boards come in a bundle.
            </li>
            <li>
              <strong>Calculate:</strong> The calculator will estimate the number of boards and joists needed, including waste, and provide a total cost estimate.
            </li>
          </ol>
        </div>
      </section>

      <section
        id="tips"
        className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900"
      >
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-800 dark:text-blue-200">
          <HardHat className="w-5 h-5" /> Professional Tips
        </h3>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          • Always measure twice and cut once to minimize waste. <br />
          • Use pressure-treated or composite boards for longer deck life. <br />
          • Joist spacing affects deck board thickness choice; 16" spacing suits 5/4 or 2x6 boards, 24" spacing may require thicker boards. <br />
          • Leave a small gap (~1/8") between deck boards for drainage and expansion. Increase waste factor if you plan gaps. <br />
          • Bundles often contain extra boards; confirm exact count with supplier to avoid shortages.
        </p>
      </section>

      <section id="faq">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b pb-4">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Deck Board & Joist Spacing Calculator"
      description="Calculate deck board quantity, joist count, and material cost with waste factor."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[]}
      onThisPage={[
        { id: "how-to", label: "How to Measure" },
        { id: "tips", label: "Pro Tips" },
        { id: "faq", label: "FAQ" },
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}