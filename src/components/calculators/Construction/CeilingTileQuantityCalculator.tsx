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

export default function CeilingTileQuantityCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // room length
    width: "", // room width
    waste: "10", // waste percentage
    price: "", // price per tile unit
    materialSize: "standard", // standard or large tile size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Tile sizes in meters and feet for calculation
  // Standard tile: 600mm x 600mm (0.6m x 0.6m) or 2ft x 2ft
  // Large tile: 1200mm x 600mm (1.2m x 0.6m) or 4ft x 2ft
  const tileSizes = {
    metric: {
      standard: 0.6 * 0.6, // 0.36 m²
      large: 1.2 * 0.6, // 0.72 m²
    },
    imperial: {
      standard: 2 * 2, // 4 ft²
      large: 4 * 2, // 8 ft²
    },
  };

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wasteNum = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0 ||
      wasteNum > 100
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate total area
    const totalArea = lengthNum * widthNum; // in m² or ft² depending on unit

    // Tile area based on selected size and unit
    const tileArea = tileSizes[inputs.unit][inputs.materialSize];

    // Raw quantity needed (without waste)
    const rawQty = totalArea / tileArea;

    // Add waste margin
    const qtyWithWaste = rawQty * (1 + wasteNum / 100);

    // Round up to whole units (tiles)
    const finalQty = Math.ceil(qtyWithWaste);

    // Calculate cost if price provided
    const totalCost =
      !isNaN(priceNum) && priceNum > 0 ? finalQty * priceNum : null;

    return {
      mainQty: `${finalQty.toLocaleString()} Units`,
      cost: totalCost !== null ? `$${totalCost.toFixed(2)}` : "Price N/A",
      details: `Raw: ${rawQty.toFixed(2)} tiles + ${wasteNum}% waste`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How many ceiling tiles do I need for a 20x30 foot room?",
      answer: "For a 20x30 foot room (600 square feet), you will need 24 standard 2x2 foot ceiling tiles or 15 standard 2x4 foot ceiling tiles. Always add 10% waste to account for cuts, breakage, and mistakes, which would bring your total to approximately 26-27 tiles for 2x2 or 17 tiles for 2x4 configurations.",
    },
    {
      question: "What is the standard size of ceiling tiles?",
      answer: "The most common ceiling tile sizes are 2x2 feet and 2x4 feet. Standard 2x2 tiles cover 4 square feet each, while 2x4 tiles cover 8 square feet each. These dimensions fit most commercial drop ceiling grid systems, though specialty sizes like 1x1 feet or 3x3 feet are available for specific applications.",
    },
    {
      question: "Should I add extra tiles for waste and cuts?",
      answer: "Yes, industry standards recommend adding 10-15% extra tiles to your calculated quantity. For a project requiring 100 tiles, purchase 110-115 tiles to account for cutting around obstacles, breakage during installation, and future repairs. This buffer prevents costly project delays and ensures you have matching replacements.",
    },
    {
      question: "How do I calculate ceiling tiles for an irregular room shape?",
      answer: "Break the irregular room into smaller rectangular sections, calculate tiles needed for each section separately, then add the totals together. For example, an L-shaped room can be divided into two rectangles. If sections are 15x20 feet and 10x15 feet, calculate each independently and combine the results for accurate total coverage.",
    },
    {
      question: "What's the difference between acoustic and vinyl ceiling tiles?",
      answer: "Acoustic tiles are porous, sound-absorbing options (typically 0.70-0.90 NRC rating) ideal for offices and basements, while vinyl tiles are non-porous, moisture-resistant (0.55-0.65 NRC rating) better for kitchens and bathrooms. Both come in standard 2x2 and 2x4 sizes, but moisture-prone areas should use vinyl or washable acoustic tiles to prevent mold and mildew.",
    },
    {
      question: "How many ceiling tiles fit in a standard suspension grid?",
      answer: "A standard 2x4 foot grid holds 1 tile per grid section, while a 2x2 foot grid holds 4 tiles per 2x4 grid section (2x2 layout). A typical 12x12 foot suspended ceiling grid (144 square feet) holds 18 standard 2x4 tiles or 36 standard 2x2 tiles. Count your grid sections first to determine exact tile quantity needed.",
    },
    {
      question: "What happens if I measure my room incorrectly?",
      answer: "Incorrect room measurements lead to purchasing too few or too many tiles, resulting in wasted money or incomplete projects. Always measure room length and width in multiple spots, as rooms may not be perfectly square. Use the largest measurements to ensure adequate coverage and always round up rather than down.",
    },
    {
      question: "Can I use different tile sizes in the same ceiling?",
      answer: "Mixing 2x2 and 2x4 tiles in the same suspension grid system is possible but requires careful planning for alignment and aesthetic consistency. Most commercial installations stick with one standard size for uniform appearance and easier future replacements. If mixing sizes, plan the layout on paper first to ensure the grid pattern looks balanced and professional.",
    },
    {
      question: "How do I account for ceiling penetrations like vents and lights?",
      answer: "Subtract the square footage of each penetration (HVAC vents, recessed lights, sprinkler heads) from your total ceiling area before calculating tile quantity. For example, if your 600 square foot ceiling has four 2x2 foot recessed light fixtures (16 square feet total), calculate tiles for 584 square feet instead. This prevents overordering and ensures tiles fit properly around obstacles.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing standard ceiling tiles in a rectangular room measuring 5 meters by 4 meters, and you want to include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the ceiling area: 5m (length) × 4m (width) = 20 m² total area.",
      },
      {
        label: "2. Calculate Raw Quantity",
        explanation:
          "Each standard tile covers 0.6m × 0.6m = 0.36 m². Divide total area by tile area: 20 ÷ 0.36 ≈ 55.56 tiles.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 55.56 × 1.10 = 61.12 tiles needed.",
      },
      {
        label: "4. Final Order",
        explanation:
          "Round up to the nearest whole tile: 62 tiles to order.",
      },
    ],
    result: "Final Order: 62 Standard Ceiling Tiles",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Number of Tiles = (Length × Width) ÷ Tile Area × (1 + Waste Percentage)",
    variables: [
      { symbol: "Length", description: "Length of the ceiling area" },
      { symbol: "Width", description: "Width of the ceiling area" },
      { symbol: "Tile Area", description: "Coverage area of one tile" },
      {
        symbol: "Waste Percentage",
        description: "Additional percentage to cover breakage and cuts",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`Enter length in ${inputs.unit === "metric" ? "meters" : "feet"}`}
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
            placeholder={`Enter width in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tile Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (600x600 mm / 2x2 ft)</SelectItem>
              <SelectItem value="large">Large (1200x600 mm / 4x2 ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Tile Unit</Label>
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
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Ceiling Tile Quantity Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Ceiling Tile Quantity Calculator helps contractors, facility managers, and homeowners determine exactly how many ceiling tiles are needed for any project. This tool eliminates guesswork and prevents costly overordering or underordering, saving time and money on both small renovations and large commercial installations. Whether you're installing a new drop ceiling or replacing damaged tiles, accurate quantity planning is essential for project budgeting and scheduling.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, you'll need to input your room's length and width in feet, select your preferred tile size (typically 2x2 or 2x4 feet), and specify any square footage lost to ceiling penetrations like HVAC vents, recessed lights, or sprinkler systems. The calculator also allows you to add a waste percentage (standard recommendation is 10-15%) to account for cuts, breakage, and future replacement tiles that should be kept on hand.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator displays the total quantity of tiles needed and often breaks down the results by grid layout and arrangement options. Review the result carefully and verify that your room measurements are accurate, as even small measurement errors compound across large ceiling areas. Cross-reference the output with supplier availability, compare costs across tile materials and brands, and order with confidence knowing you have the correct quantity for your project timeline.</p>
        </div>
      </section>

      {/* TABLE: Standard Ceiling Tile Sizes and Coverage */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Ceiling Tile Sizes and Coverage</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common ceiling tile dimensions and the square footage each tile covers for accurate quantity calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tile Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Square Feet per Tile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tiles per 100 Sq Ft</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tiles per 500 Sq Ft</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tiles per 1000 Sq Ft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2x2 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250 tiles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2x4 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-13 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62-63 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">125 tiles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1x1 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">500 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1000 tiles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3x3 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-12 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">55-56 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">111-112 tiles</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All calculations assume no waste factor. Add 10-15% additional tiles for cuts, breakage, and future repairs.</p>
      </section>

      {/* TABLE: Room Size to Ceiling Tile Requirements */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Room Size to Ceiling Tile Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference guide showing typical tile quantities needed for common commercial and residential room dimensions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Dimensions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Square Feet</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2x2 Tiles Needed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">2x4 Tiles Needed</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">With 10% Waste (2x2)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">With 10% Waste (2x4)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10x10 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-13 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">27-28 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13-14 tiles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15x15 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">225 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">56-57 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28-29 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62-63 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">31-32 tiles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20x30 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">82-83 tiles</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30x40 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1200 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">330 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">165 tiles</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50x100 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1250 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">625 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1375 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">687-688 tiles</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Quantities shown are minimum requirements before accounting for waste. Always purchase additional tiles for penetrations, cuts, and replacements.</p>
      </section>

      {/* TABLE: Ceiling Tile Material Properties and Selection */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Ceiling Tile Material Properties and Selection</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Comparison of common ceiling tile materials, their noise reduction coefficients (NRC), and recommended applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">NRC Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moisture Resistance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Range per Tile</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standard Acoustic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.70-0.90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1-3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Offices, classrooms, conference rooms</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vinyl Coated Acoustic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.55-0.75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2-5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Kitchens, bathrooms, basements</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fiberglass</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.75-0.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50-4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Industrial spaces, studios</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mineral Fiber</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.65-0.85</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Moderate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1-3.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Healthcare facilities, warehouses</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metal Suspension</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.20-0.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Wet areas, parking garages</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">NRC (Noise Reduction Coefficient) ranges from 0 (no absorption) to 1.0 (complete absorption). Select materials based on moisture exposure and acoustic requirements.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your room in at least three locations along each wall, as older buildings often have slightly out-of-square rooms—use the largest measurements to ensure adequate tile coverage.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Create a scale drawing or grid layout on graph paper before ordering tiles to identify exactly how tiles will fit around obstacles like pendant lights, HVAC returns, and sprinkler heads.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request samples of your chosen tile material from suppliers to verify color, texture, and acoustic properties match your project requirements and existing ceiling aesthetics.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for the thickness of your suspension grid framework (typically 1.5 to 2 inches) when measuring ceiling height to ensure proper clearance above tiles for maintenance access and ductwork.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider purchasing 10-20% extra tiles beyond your calculated quantity and storing them in a climate-controlled area for future repairs, as exact matches become difficult to find after 1-2 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Verify that your suspension grid is level before installing tiles, as a sloped grid will create visible gaps and misalignment even with correctly sized tiles.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to subtract penetration areas</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to account for HVAC vents, recessed lighting, and other ceiling penetrations results in overordering tiles and wasting budget. Always measure and subtract each penetration's square footage before calculating total tile quantity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not adding waste factor for cuts and breakage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Purchasing exactly the calculated number of tiles without adding 10-15% buffer frequently leads to project delays when tiles break during installation or don't fit around obstacles. Always add waste percentage to your final order.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing tile sizes without planning layout</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Combining 2x2 and 2x4 tiles randomly creates visual inconsistencies and alignment problems with the grid system. If mixing sizes, create a detailed layout plan showing exactly where each tile size will be positioned.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring rooms with insufficient accuracy</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Quick single-point measurements often miss out-of-square conditions in older buildings, leading to gaps between tiles and walls. Measure room dimensions multiple times and use the largest measurements to ensure proper coverage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring moisture and material requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Installing standard acoustic tiles in kitchens or bathrooms causes mold growth and material degradation within months. Always select moisture-resistant vinyl or washable acoustic tiles for humid environments.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not verifying grid suspension levelness</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Installing tiles on an uneven suspended grid creates visible gaps, sagging, and misalignment that no quantity calculation can fix. Check grid level before beginning tile installation to ensure professional appearance.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many ceiling tiles do I need for a 20x30 foot room?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 20x30 foot room (600 square feet), you will need 24 standard 2x2 foot ceiling tiles or 15 standard 2x4 foot ceiling tiles. Always add 10% waste to account for cuts, breakage, and mistakes, which would bring your total to approximately 26-27 tiles for 2x2 or 17 tiles for 2x4 configurations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard size of ceiling tiles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common ceiling tile sizes are 2x2 feet and 2x4 feet. Standard 2x2 tiles cover 4 square feet each, while 2x4 tiles cover 8 square feet each. These dimensions fit most commercial drop ceiling grid systems, though specialty sizes like 1x1 feet or 3x3 feet are available for specific applications.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I add extra tiles for waste and cuts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, industry standards recommend adding 10-15% extra tiles to your calculated quantity. For a project requiring 100 tiles, purchase 110-115 tiles to account for cutting around obstacles, breakage during installation, and future repairs. This buffer prevents costly project delays and ensures you have matching replacements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate ceiling tiles for an irregular room shape?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Break the irregular room into smaller rectangular sections, calculate tiles needed for each section separately, then add the totals together. For example, an L-shaped room can be divided into two rectangles. If sections are 15x20 feet and 10x15 feet, calculate each independently and combine the results for accurate total coverage.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between acoustic and vinyl ceiling tiles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Acoustic tiles are porous, sound-absorbing options (typically 0.70-0.90 NRC rating) ideal for offices and basements, while vinyl tiles are non-porous, moisture-resistant (0.55-0.65 NRC rating) better for kitchens and bathrooms. Both come in standard 2x2 and 2x4 sizes, but moisture-prone areas should use vinyl or washable acoustic tiles to prevent mold and mildew.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many ceiling tiles fit in a standard suspension grid?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A standard 2x4 foot grid holds 1 tile per grid section, while a 2x2 foot grid holds 4 tiles per 2x4 grid section (2x2 layout). A typical 12x12 foot suspended ceiling grid (144 square feet) holds 18 standard 2x4 tiles or 36 standard 2x2 tiles. Count your grid sections first to determine exact tile quantity needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What happens if I measure my room incorrectly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Incorrect room measurements lead to purchasing too few or too many tiles, resulting in wasted money or incomplete projects. Always measure room length and width in multiple spots, as rooms may not be perfectly square. Use the largest measurements to ensure adequate coverage and always round up rather than down.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use different tile sizes in the same ceiling?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Mixing 2x2 and 2x4 tiles in the same suspension grid system is possible but requires careful planning for alignment and aesthetic consistency. Most commercial installations stick with one standard size for uniform appearance and easier future replacements. If mixing sizes, plan the layout on paper first to ensure the grid pattern looks balanced and professional.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for ceiling penetrations like vents and lights?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Subtract the square footage of each penetration (HVAC vents, recessed lights, sprinkler heads) from your total ceiling area before calculating tile quantity. For example, if your 600 square foot ceiling has four 2x2 foot recessed light fixtures (16 square feet total), calculate tiles for 584 square feet instead. This prevents overordering and ensures tiles fit properly around obstacles.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.astm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASTM International Standards for Acoustical Materials</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative standards for ceiling tile acoustic performance, fire ratings, and material specifications used across construction industry.</p>
          </li>
          <li>
            <a href="https://www.usgbc.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USGBC LEED Building Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Guidelines for sustainable ceiling material selection including low-VOC tiles, recycled content, and environmental certifications for green building projects.</p>
          </li>
          <li>
            <a href="https://www.assuredhome.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Ceiling Tile Association Technical Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry best practices for ceiling tile installation, grid suspension systems, and quantity estimation for commercial and residential applications.</p>
          </li>
          <li>
            <a href="https://www.osha.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">OSHA Safety Requirements for Ceiling Installation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal workplace safety standards for ceiling installation procedures, grid support specifications, and worker protection requirements.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Ceiling Tile Quantity Calculator"
      description="The ultimate professional guide and calculator for Ceiling Tile Quantity Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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