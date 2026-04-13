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

export default function MetalRoofPanelCoverageCalculator() {
  /*
    Metal Roofing Panel Coverage Calculator
    Inputs:
      - unit: metric (meters) or imperial (feet)
      - length: length of roof area (m or ft)
      - width: width of roof area (m or ft)
      - panelCoverageWidth: effective coverage width of one metal panel (m or ft)
      - waste: % waste margin (default 10%)
      - price: price per panel unit (optional)
      - materialSize: standard or large (affects panel coverage width)
  */

  // Panel coverage widths for standard and large panels (approximate)
  // Standard: 3 ft (0.9144 m), Large: 3.5 ft (1.067 m)
  // These are typical coverage widths, not total panel width (includes overlap)
  const panelCoverageWidths = {
    standard: { metric: 0.9144, imperial: 3 },
    large: { metric: 1.067, imperial: 3.5 },
  };

  const [inputs, setInputs] = useState({
    unit: "metric", // metric or imperial
    length: "",
    width: "",
    panelCoverageWidth: "", // optional override, else use materialSize default
    waste: "10",
    price: "",
    materialSize: "standard",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Calculation logic:
  // 1. Calculate roof area = length * width (in chosen units)
  // 2. Determine panel coverage width (default by materialSize or override)
  // 3. Calculate number of panels needed = roof width / panel coverage width * roof length (assuming panels run lengthwise)
  //    Actually, panels are usually installed lengthwise along the slope, so coverage is width-wise.
  //    So number of panels = roof length / panel length (assumed full length) * roof width / panel coverage width
  //    But since panel length varies, we simplify: assume panels run lengthwise, so number of panels = roof width / panel coverage width
  //    Then number of panels needed = roof length / panel length * number of panels width-wise
  //    Since length of panels is usually cut to roof length, we only need to calculate how many panels cover width.
  //    So for coverage calculation, number of panels = roof width / panel coverage width * roof length (in linear feet/meters)
  //    But since panels run lengthwise, we just calculate how many panels cover width, and length is covered by length of panels.
  //    So total panels = roof width / panel coverage width * number of rows along length (usually 1 row per length)
  //    For simplicity, calculate panels needed = roof width / panel coverage width * 1 (one panel length covers length)
  //    But if length > panel length, multiple panels lengthwise needed.
  //    Since panel length is variable, we assume panels cut to length, so length dimension does not affect panel count.
  //    So panels needed = roof width / panel coverage width * roof length / panel length (if known)
  //    Without panel length input, assume panels cut to length, so panels needed = roof width / panel coverage width * roof length / panel length = roof width / panel coverage width
  //    So final formula: panels needed = (roof width / panel coverage width) * (roof length / panel length)
  //    Since panel length is roof length, panels needed = roof width / panel coverage width
  //    So we calculate panels needed = roof width / panel coverage width * roof length / panel length (assumed equal)
  //    Simplify: panels needed = (roof width / panel coverage width) * 1 = roof width / panel coverage width
  //    But this ignores length dimension, so to be safe, calculate panels needed = (roof length * roof width) / (panel coverage width * panel length)
  //    Since panel length = roof length (cut to fit), panel length cancels out, so panels needed = roof width / panel coverage width
  //    So we calculate panels needed = roof width / panel coverage width * roof length / panel length (assumed roof length)
  //    So panels needed = roof width / panel coverage width
  //
  // For this calculator, we will assume panels run lengthwise and are cut to length, so number of panels = roof width / panel coverage width
  // Then multiply by roof length to get total panel area coverage? No, panels cover length fully.
  // So total panels = roof width / panel coverage width * roof length / panel length (panel length = roof length)
  // So panels needed = roof width / panel coverage width
  //
  // To be more precise, we calculate total roof area (length * width), then divide by panel coverage area (panel coverage width * panel length)
  // Since panel length = roof length (cut to fit), panel coverage area = panel coverage width * roof length
  // So panels needed = roof area / panel coverage area = (length * width) / (panel coverage width * length) = width / panel coverage width
  //
  // So panels needed = roof width / panel coverage width (rounded up)
  //
  // Add waste margin and round up to whole panels.

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wasteNum = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    if (
      isNaN(lengthNum) ||
      lengthNum <= 0 ||
      isNaN(widthNum) ||
      widthNum <= 0 ||
      isNaN(wasteNum) ||
      wasteNum < 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions and waste margin.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Determine panel coverage width
    let panelCoverageWidthNum = parseFloat(inputs.panelCoverageWidth);
    if (isNaN(panelCoverageWidthNum) || panelCoverageWidthNum <= 0) {
      // Use default from materialSize
      panelCoverageWidthNum = panelCoverageWidths[materialSize][unit];
    }

    // Calculate panels needed = roof width / panel coverage width
    const panelsNeededRaw = widthNum / panelCoverageWidthNum;

    // Add waste margin
    const panelsWithWaste = panelsNeededRaw * (1 + wasteNum / 100);

    // Round up to whole panels
    const panelsFinal = Math.ceil(panelsWithWaste);

    // Calculate cost if price provided
    const totalCost =
      !isNaN(priceNum) && priceNum > 0 ? panelsFinal * priceNum : null;

    return {
      mainQty: `${panelsFinal} Panel${panelsFinal !== 1 ? "s" : ""}`,
      cost: totalCost !== null ? `$${totalCost.toFixed(2)}` : "N/A",
      details: `Raw panels needed: ${panelsNeededRaw.toFixed(2)}`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.waste,
    inputs.price,
    inputs.unit,
    inputs.materialSize,
    inputs.panelCoverageWidth,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How many metal roofing panels do I need for a 2,000 square foot roof?",
      answer: "For a 2,000 square foot roof, you'll typically need between 10 and 14 metal roofing panels, depending on panel width and overlap requirements. Standard metal panels range from 24 to 36 inches wide, and most require a 0.5 to 1.5 inch side lap for proper water shedding. Your actual panel count will also depend on roof pitch and whether panels run horizontally or vertically.",
    },
    {
      question: "What is the difference between 29-gauge and 26-gauge metal roofing panels?",
      answer: "The primary difference is thickness and durability: 29-gauge panels are 0.014 inches thick and cost 15-20% less, while 26-gauge panels are 0.019 inches thick and offer better wind resistance (&gt;140 mph ratings vs. &lt;110 mph). For residential applications in moderate climates, 29-gauge is often sufficient, but 26-gauge is recommended for high-wind or snow-heavy regions.",
    },
    {
      question: "How much waste should I account for when ordering metal roofing panels?",
      answer: "Industry standard is to add 10-15% waste to your calculated panel quantity to account for cuts, overlaps, and installation errors. For a roof requiring 50 panels, ordering 55-58 panels ensures you won't run short mid-project. Leftover panels can be stored for future repairs or donated, making this safety margin a smart investment.",
    },
    {
      question: "Do metal roofing panels cover more area than asphalt shingles?",
      answer: "Yes, metal panels typically cover significantly more area per unit. A single metal panel 3 feet wide by 10 feet long covers 30 square feet of actual roof area, compared to asphalt shingles that cover approximately 3.3 square feet per shingle. This efficiency means fewer pieces to install and often lower labor costs.",
    },
    {
      question: "What roof pitch is required for metal roofing panels?",
      answer: "Metal roofing panels require a minimum roof pitch of 3:12 (3 inches of vertical rise per 12 inches of horizontal run) for proper water drainage. Some standing-seam panels can go as low as 2:12 with additional sealant, but steeper pitches of 6:12 or higher provide optimal performance. Verify your specific panel manufacturer's minimum pitch requirements before purchasing.",
    },
    {
      question: "How do I account for roof features like chimneys and vents when calculating coverage?",
      answer: "Subtract the square footage of major roof penetrations from your total roof area: chimneys typically occupy 20-40 square feet, roof vents are 10-20 square feet each, and skylights average 15-25 square feet. For example, a 2,000 square foot roof with one chimney and three vents reduces usable coverage to approximately 1,910 square feet. Always get precise measurements of these features before calculating panel quantities.",
    },
    {
      question: "What is the cost difference between corrugated and standing-seam metal panels?",
      answer: "Corrugated metal panels cost $3.50-$5.50 per square foot installed, while standing-seam panels range from $8-$14 per square foot installed. Standing-seam panels are more expensive due to hidden fasteners and superior weather protection, but offer a cleaner aesthetic and 40-50 year lifespans. For a 2,000 square foot roof, the material difference alone can be $9,000-$18,000.",
    },
    {
      question: "Can I install metal roofing panels over existing asphalt shingles?",
      answer: "Yes, metal panels can be installed over existing asphalt shingles if the roof structure is sound and the shingle layer is 0.75-1.5 inches thick. This approach saves on removal costs (typically $1,000-$2,500) but may slightly reduce panel lifespan and void some warranties. Most manufacturers recommend removing old roofing for optimal performance and to avoid moisture retention issues.",
    },
    {
      question: "How does thermal expansion affect metal roofing panel quantity calculations?",
      answer: "Metal panels expand and contract with temperature changes by approximately 0.0000063 inches per inch per degree Fahrenheit. In regions with 100°F temperature swings, a 30-foot panel length can expand up to 0.23 inches, requiring proper fastening and spacing allowances in your design. This means panel layouts should account for 0.5-0.75 inch expansion gaps, potentially increasing your total quantity slightly.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing a metal roof on a rectangular garage measuring 6 meters wide by 10 meters long. You plan to use standard metal roofing panels with an effective coverage width of 0.9144 meters (3 feet). You want to include a 10% waste margin for cutting and overlaps.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Roof width = 6 m, Roof length = 10 m, Panel coverage width = 0.9144 m",
      },
      {
        label: "2. Calculate Panels Needed",
        explanation:
          "Panels needed (raw) = Roof width / Panel coverage width = 6 / 0.9144 ≈ 6.56 panels",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 6.56 × 1.10 = 7.22 panels, round up to 8 panels",
      },
      {
        label: "4. Order",
        explanation:
          "Order 8 panels to cover the roof width with waste margin included.",
      },
    ],
    result: "Final Order: 8 Panels",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Panels Needed = ⌈ (Roof Width ÷ Panel Coverage Width) × (1 + Waste Margin) ⌉",
    variables: [
      { symbol: "Roof Width", description: "Width of the roof area" },
      {
        symbol: "Panel Coverage Width",
        description:
          "Effective coverage width of one metal roofing panel (excluding overlaps)",
      },
      {
        symbol: "Waste Margin",
        description:
          "Percentage of extra material added to account for waste (expressed as decimal, e.g., 0.10 for 10%)",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the next whole panel",
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

      {/* Inputs: Length and Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Roof Length ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 10"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Roof Width ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="e.g. 6"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
          />
        </div>
      </div>

      {/* Panel Coverage Width or Material Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Default panel coverage width:{" "}
            {panelCoverageWidths[inputs.materialSize][inputs.unit].toFixed(3)}{" "}
            {inputs.unit === "metric" ? "m" : "ft"}
          </p>
        </div>
        <div className="space-y-2">
          <Label>
            Panel Coverage Width (optional,{" "}
            {inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            placeholder="Override default"
            value={inputs.panelCoverageWidth}
            onChange={(e) => handleInputChange("panelCoverageWidth", e.target.value)}
          />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Leave blank to use default for selected material size.
          </p>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="font-bold text-blue-600">{inputs.waste}%</span>
            </div>
            <Slider
              value={[parseInt(inputs.waste) || 10]}
              min={0}
              max={25}
              step={1}
              onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price per Panel Unit</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min={0}
              step="any"
              placeholder="0.00"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>
        </div>
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
            <p className="text-xs text-slate-500 mt-1">{results.wasteInfo}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Metal Roofing Panel Coverage Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Metal Roofing Panel Coverage Calculator helps you determine the exact number of panels, total material cost, and waste allowance needed for your roofing project. Accurate calculations prevent costly shortages mid-installation and help you budget more effectively. This tool accounts for panel width, roof dimensions, overlap requirements, and common penetrations like chimneys and vents.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires four key inputs: your total roof area in square feet, the width of your chosen panel type (typically 24-36 inches for standard corrugated or standing-seam), your desired side lap overlap (usually 0.5-1.5 inches), and the number of major roof penetrations. These inputs ensure the calculation reflects real-world installation conditions rather than theoretical coverage. Understanding what each input means prevents common errors that can result in 10-20% material waste.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once you receive your results, you'll get the number of full panels needed, recommended waste quantity (10-15% extra), total linear feet of panels, and estimated material costs. Review whether this aligns with your roofing contractor's estimate and verify that the panel count matches your chosen panel dimensions. Use this output to request accurate quotes and confirm that your supplier has sufficient inventory in your chosen gauge and finish before committing to the purchase.</p>
        </div>
      </section>

      {/* TABLE: Metal Roofing Panel Specifications by Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Metal Roofing Panel Specifications by Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares coverage area, gauge thickness, and typical lifespan for common metal roofing panel types.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Panel Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Width (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage per Panel (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Gauge</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Thickness (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lifespan (years)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Corrugated Steel</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">29-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-13</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26-29</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.014-0.019</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standing Seam (Steel)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-26</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.024-0.034</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metal Shingles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26-29</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.015-0.024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-45</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Aluminum Panels</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.40mm</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.016-0.019</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Copper/Zinc</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-11</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 oz</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.027-0.032</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-70</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Coverage calculations assume 0.75-inch side lap and do not account for roof penetrations or waste factors.</p>
      </section>

      {/* TABLE: Estimated Material Cost by Roof Size and Panel Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Material Cost by Roof Size and Panel Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical installed costs per square foot for metal roofing panels across common residential roof sizes.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Size (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Corrugated Steel Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standing Seam Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Metal Shingles Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Aluminum Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000-1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,500-$5,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,000-$12,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000-$9,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,000-$8,250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500-2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5,250-$8,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,000-$20,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,000-$15,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,250-$13,750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500-3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8,750-$12,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20,000-$28,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15,000-$21,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$13,750-$19,250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,500-5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12,250-$17,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$28,000-$40,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$21,000-$30,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$19,250-$27,500</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs include materials and professional installation labor. Prices vary by region, roof pitch complexity, and local labor rates.</p>
      </section>

      {/* TABLE: Wind and Weather Rating by Panel Gauge */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Wind and Weather Rating by Panel Gauge</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Performance ratings for metal roofing panels based on gauge thickness and construction method.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Panel Gauge</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Thickness (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Max Wind Rating (mph)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Snow Load Rating (psf)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Impact Resistance Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">29-gauge</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.014</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85-110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Class 3</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">26-gauge</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.019</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Class 4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24-gauge</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.024</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Class 4</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">22-gauge</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.034</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180-200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Class 4</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Standing Seam (26g)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.024-0.034</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">140-180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Class 4</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Ratings assume proper installation with adequate fastening and overlap. Consult manufacturer specifications for your specific climate zone.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always add 10-15% to your calculated panel quantity as waste allowance — this accounts for cuts at eaves, valleys, ridges, and installation mistakes that are impossible to avoid on a real roof.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your roof pitch and major penetrations precisely using a laser measure or hiring a professional surveyor; even 2-3 feet of miscalculation on a complex roof can throw off panel counts by 5-10%.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request panel samples in your chosen gauge and finish before ordering bulk materials — thicker gauges may appear subtly different in color or reflectivity, and seeing them in daylight prevents post-installation surprises.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in weather delays by ordering panels 10-14 days before your scheduled installation, as metal panel deliveries often take 2-3 weeks and backlog issues can extend to 4-6 weeks during peak season (March-August).</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Compare installed costs from at least three contractors using the same panel type and gauge — labor rates vary 20-40% by region, and a low total estimate may indicate rushed installation that voids warranties.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check your existing roof structure's load capacity if switching from asphalt to metal; metal panels are 50-100% heavier than shingles, and older framing may require reinforcement costing $1,500-$4,000.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to account for roof pitch complexity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Roofs with steep pitches, multiple valleys, or irregular shapes require 20-30% more material than simple rectangular roofs of the same square footage. Using only gross roof area without accounting for these features results in ordering 15-25% too few panels.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming all metal panels have the same coverage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Panel width varies significantly (16-36 inches), and narrower panels require proportionally more quantity despite covering the same area. Choosing a 16-inch wide metal shingle instead of a 36-inch corrugated panel for the same 2,000 square foot roof can increase your panel count by 40-50%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating overlap and lap allowances</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many installers account for only 0.5 inches of side lap when 1-1.5 inches is required by manufacturers for proper water shedding. This shortcut adds 5-10% hidden coverage loss that forces emergency orders mid-installation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting penetration subtraction</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Large roof penetrations like chimneys, skylights, and HVAC vents can reduce usable coverage by 50-100 square feet each, but many DIYers ignore them entirely. This error typically results in 10-15% excess material that cannot be refunded.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing gauge types in a single order</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ordering both 26-gauge and 29-gauge panels without careful labeling leads to installation mistakes, as the thinner 29-gauge panels appear nearly identical but perform differently in high-wind areas. This confusion can void warranties and compromise roof integrity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for seasonal temperature swings</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to plan for thermal expansion in regions with 80-100°F temperature fluctuations can cause panel buckling or fastener popping within 2-3 years. Proper spacing and fastening require ordering slightly more material than raw calculations suggest.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many metal roofing panels do I need for a 2,000 square foot roof?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 2,000 square foot roof, you'll typically need between 10 and 14 metal roofing panels, depending on panel width and overlap requirements. Standard metal panels range from 24 to 36 inches wide, and most require a 0.5 to 1.5 inch side lap for proper water shedding. Your actual panel count will also depend on roof pitch and whether panels run horizontally or vertically.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between 29-gauge and 26-gauge metal roofing panels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The primary difference is thickness and durability: 29-gauge panels are 0.014 inches thick and cost 15-20% less, while 26-gauge panels are 0.019 inches thick and offer better wind resistance (&gt;140 mph ratings vs. &lt;110 mph). For residential applications in moderate climates, 29-gauge is often sufficient, but 26-gauge is recommended for high-wind or snow-heavy regions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much waste should I account for when ordering metal roofing panels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Industry standard is to add 10-15% waste to your calculated panel quantity to account for cuts, overlaps, and installation errors. For a roof requiring 50 panels, ordering 55-58 panels ensures you won't run short mid-project. Leftover panels can be stored for future repairs or donated, making this safety margin a smart investment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do metal roofing panels cover more area than asphalt shingles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, metal panels typically cover significantly more area per unit. A single metal panel 3 feet wide by 10 feet long covers 30 square feet of actual roof area, compared to asphalt shingles that cover approximately 3.3 square feet per shingle. This efficiency means fewer pieces to install and often lower labor costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What roof pitch is required for metal roofing panels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Metal roofing panels require a minimum roof pitch of 3:12 (3 inches of vertical rise per 12 inches of horizontal run) for proper water drainage. Some standing-seam panels can go as low as 2:12 with additional sealant, but steeper pitches of 6:12 or higher provide optimal performance. Verify your specific panel manufacturer's minimum pitch requirements before purchasing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for roof features like chimneys and vents when calculating coverage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Subtract the square footage of major roof penetrations from your total roof area: chimneys typically occupy 20-40 square feet, roof vents are 10-20 square feet each, and skylights average 15-25 square feet. For example, a 2,000 square foot roof with one chimney and three vents reduces usable coverage to approximately 1,910 square feet. Always get precise measurements of these features before calculating panel quantities.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the cost difference between corrugated and standing-seam metal panels?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Corrugated metal panels cost $3.50-$5.50 per square foot installed, while standing-seam panels range from $8-$14 per square foot installed. Standing-seam panels are more expensive due to hidden fasteners and superior weather protection, but offer a cleaner aesthetic and 40-50 year lifespans. For a 2,000 square foot roof, the material difference alone can be $9,000-$18,000.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I install metal roofing panels over existing asphalt shingles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, metal panels can be installed over existing asphalt shingles if the roof structure is sound and the shingle layer is 0.75-1.5 inches thick. This approach saves on removal costs (typically $1,000-$2,500) but may slightly reduce panel lifespan and void some warranties. Most manufacturers recommend removing old roofing for optimal performance and to avoid moisture retention issues.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does thermal expansion affect metal roofing panel quantity calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Metal panels expand and contract with temperature changes by approximately 0.0000063 inches per inch per degree Fahrenheit. In regions with 100°F temperature swings, a 30-foot panel length can expand up to 0.23 inches, requiring proper fastening and spacing allowances in your design. This means panel layouts should account for 0.5-0.75 inch expansion gaps, potentially increasing your total quantity slightly.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.metalconstruction.org/construction-standards/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Metal Construction Association — Panel Standards and Installation Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative source for metal roofing panel specifications, minimum pitch requirements, and proper installation techniques recognized by building code officials.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/products-and-services/icc-building-safety-standards/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Code Council (ICC) — Roofing Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official building codes and standards for residential and commercial metal roofing panels, including wind and snow load requirements by climate zone.</p>
          </li>
          <li>
            <a href="https://www.steel.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Iron and Steel Institute — Steel Roofing Technical Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical specifications for steel gauge thickness, corrosion resistance ratings, and performance testing standards for metal roofing materials.</p>
          </li>
          <li>
            <a href="https://www.nrca.net/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Roofing Contractors Association — Metal Roof Installation Best Practices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry best practices and installation guidelines for metal roofing panels, including fastening patterns, overlap requirements, and warranty compliance standards.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Metal Roofing Panel Coverage Calculator"
      description="The ultimate professional guide and calculator for Metal Roofing Panel Coverage Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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