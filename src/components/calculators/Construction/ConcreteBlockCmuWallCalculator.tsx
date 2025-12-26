import { useState, useMemo } from "react";
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Ruler, Hammer, HardHat, Box, DollarSign, RotateCcw, Info, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import useFaqJsonLd from "@/hooks/useFaqJsonLd";

export default function ConcreteBlockCmuWallCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric",
    length: "",
    height: "",
    thickness: "",
    waste: "10",
    price: "",
    materialSize: "standard"
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Validate inputs.
   * 2. Calculate wall volume = length * height * thickness.
   * 3. Calculate number of blocks needed based on block size.
   * 4. Add waste percentage.
   * 5. Calculate total cost.
   * 6. Support metric and imperial units.
   */

  // Block sizes in meters and feet (nominal dimensions including mortar joint allowance)
  // Standard CMU block nominal size: 16" x 8" x 8" (length x height x thickness)
  // Large block example: 20" x 8" x 8"
  // Convert inches to meters: 1 inch = 0.0254 m
  const blockSizes = {
    metric: {
      standard: { length: 0.4064, height: 0.2032, thickness: 0.2032 }, // 16"x8"x8" in meters
      large: { length: 0.508, height: 0.2032, thickness: 0.2032 } // 20"x8"x8" in meters
    },
    imperial: {
      standard: { length: 16, height: 8, thickness: 8 }, // inches
      large: { length: 20, height: 8, thickness: 8 } // inches
    }
  };

  // Convert inches to feet for imperial block sizes (since user inputs feet)
  // 1 foot = 12 inches
  function inchesToFeet(inches: number) {
    return inches / 12;
  }

  const results = useMemo(() => {
    // Parse inputs
    const length = parseFloat(inputs.length);
    const height = parseFloat(inputs.height);
    const thickness = parseFloat(inputs.thickness);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    // Validate inputs
    if (
      isNaN(length) || length <= 0 ||
      isNaN(height) || height <= 0 ||
      isNaN(thickness) || thickness <= 0 ||
      isNaN(wastePercent) || wastePercent < 0 ||
      isNaN(pricePerUnit) || pricePerUnit < 0
    ) {
      return {
        qty: "0",
        unitLabel: "Blocks",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all fields.",
        wasteInfo: "",
        recommendation: "Ensure all inputs are positive numbers to get accurate estimates."
      };
    }

    // Get block nominal dimensions based on unit and material size
    let blockLength: number, blockHeight: number, blockThickness: number;

    if (unit === "metric") {
      const block = blockSizes.metric[materialSize];
      blockLength = block.length;
      blockHeight = block.height;
      blockThickness = block.thickness;
    } else {
      // imperial units: convert block sizes from inches to feet
      const block = blockSizes.imperial[materialSize];
      blockLength = inchesToFeet(block.length);
      blockHeight = inchesToFeet(block.height);
      blockThickness = inchesToFeet(block.thickness);
    }

    // Calculate wall volume (length * height * thickness)
    // Units: meters or feet
    const wallVolume = length * height * thickness;

    // Calculate block volume
    const blockVolume = blockLength * blockHeight * blockThickness;

    // Calculate number of blocks needed (wall volume / block volume)
    // This assumes full blocks with no openings or mortar gaps accounted separately.
    // Mortar joints are included in nominal block size.
    let blocksNeeded = wallVolume / blockVolume;

    // Add waste factor for cuts, breakage, and spillage
    const wasteMultiplier = 1 + wastePercent / 100;
    const blocksWithWaste = blocksNeeded * wasteMultiplier;

    // Round up to nearest whole block
    const totalBlocks = Math.ceil(blocksWithWaste);

    // Calculate total cost
    const totalCost = pricePerUnit * totalBlocks;

    // Format cost string with currency symbol
    const currencySymbol = "$"; // Could be enhanced to support currency input
    const costFormatted = `${currencySymbol}${totalCost.toFixed(2)}`;

    // Details string with raw volume and block count before waste
    const lengthUnit = unit === "metric" ? "m" : "ft";
    const volumeUnit = unit === "metric" ? "m³" : "ft³";

    const details = `Wall Volume: ${wallVolume.toFixed(3)} ${volumeUnit}, Block Volume: ${blockVolume.toFixed(4)} ${volumeUnit}, Blocks (no waste): ${Math.ceil(blocksNeeded)}`;

    const wasteInfo = `Includes ${wastePercent}% waste allowance for cuts, breakage, and spillage.`;

    const recommendation = "Purchase 1-2 extra blocks beyond the calculated amount to cover unexpected damages or future repairs.";

    return {
      qty: totalBlocks.toString(),
      unitLabel: "Blocks",
      cost: costFormatted,
      details,
      wasteInfo,
      recommendation
    };
  }, [inputs]);

  // 💡 RICH FAQ CONTENT GENERATION
  const faqs = [
    {
      question: "How do I accurately calculate the number of concrete blocks needed for my wall?",
      answer:
        "Accurate calculation requires measuring the wall's length, height, and thickness precisely, then dividing the wall volume by the nominal volume of a single block. Industry standards include the mortar joint in block dimensions, so using nominal sizes ensures correct estimates. Additionally, always add a waste factor to account for cuts, breakage, and spillage, which are common on construction sites."
    },
    {
      question: "How does the waste factor affect my project?",
      answer:
        "Waste factor is crucial because materials are rarely installed perfectly. For Concrete Block (CMU) walls, you often lose material due to cutting ends, breakage during transport, or application errors. Professionals typically recommend 10% for standard areas and up to 20% for complex layouts, ensuring you have enough blocks without excessive over-ordering."
    },
    {
      question: "What are common mistakes when estimating concrete block quantities?",
      answer:
        "A frequent mistake is measuring only wall-to-wall dimensions without subtracting openings like doors and windows, leading to over-ordering. Another is neglecting the thickness of mortar joints or using actual block sizes instead of nominal sizes, which include mortar space. To avoid these, always measure carefully, include mortar thickness, and subtract openings from total wall area."
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const widget = (
    <div className="space-y-6">
      {/* Unit Selector */}
      <div className="flex justify-end">
        <Select value={inputs.unit} onValueChange={(v) => handleInputChange("unit", v)}>
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

      {/* Main Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "5.5" : "18"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Height ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "2.4" : "8"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.thickness}
            onChange={(e) => handleInputChange("thickness", e.target.value)}
            placeholder={`e.g. ${inputs.unit === "metric" ? "0.2" : "0.67"}`}
          />
        </div>
      </div>

      {/* Material & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Block Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (16"x8"x8")</SelectItem>
              <SelectItem value="large">Large (20"x8"x8")</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Block</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              className="pl-8"
              type="number"
              min="0"
              step="0.01"
              value={inputs.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Waste Slider */}
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
        <p className="text-xs text-slate-500">
          <strong>Pro Tip:</strong> Use 5-10% for simple square walls, and 15-20% for walls with openings, corners, or irregular shapes.
        </p>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg">
        <Hammer className="mr-2 h-5 w-5" /> Calculate Materials
      </Button>

      {results && (
        <Card className="mt-6 bg-slate-50 dark:bg-slate-900 border-blue-200 dark:border-blue-900 shadow-md animate-in fade-in slide-in-from-bottom-2">
          <CardContent className="p-6 text-center">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Estimated Materials</span>
            <div className="text-5xl font-extrabold text-blue-600 my-3">
              {results.qty} <span className="text-2xl text-slate-400">{results.unitLabel}</span>
            </div>
            <div className="text-xl font-medium text-slate-700 dark:text-slate-300">Total Est. Cost: {results.cost}</div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400 text-left">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-500" /> <span>{results.details}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> <span>{results.wasteInfo}</span>
              </div>
            </div>
            <p className="mt-4 text-sm italic text-slate-500 bg-slate-100 dark:bg-slate-800 p-2 rounded">
              "{results.recommendation}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">
      {/* 1. COMPREHENSIVE GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-500" /> Complete Guide to Concrete Block (CMU) Wall Calculator
        </h2>
        <div className="prose prose-slate dark:prose-invert leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Calculating the correct quantity of concrete blocks, also known as Concrete Masonry Units (CMUs), is essential for building structurally sound and aesthetically pleasing walls. This calculation ensures that you order enough blocks to complete your project without costly delays or excess waste. Accurate estimation also helps maintain budget control and prevents under- or over-ordering, which can impact project timelines and costs.
          </p>
          <p>
            Concrete blocks are manufactured in standard sizes with nominal dimensions that include mortar joints, typically 16 inches long, 8 inches high, and 8 inches thick for standard blocks. The density and size of these blocks affect the total volume and weight of materials needed. Understanding these properties allows you to convert wall dimensions into the number of blocks required, factoring in mortar space and waste for a precise estimate.
          </p>
        </div>
      </section>

      {/* 2. STEP-BY-STEP MEASUREMENT */}
      <section id="how-to-measure" className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-indigo-500" /> How to Measure Correctly
        </h3>
        <ul className="space-y-3 text-slate-600 dark:text-slate-300">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">1</span>
            <span>
              <strong>Length & Height:</strong> Measure the full length and height of the wall from end to end and from the base to the top. For irregular walls, divide the wall into sections and measure each separately to ensure accuracy.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
            <span>
              <strong>Thickness:</strong> This is the width of the wall, usually the thickness of the block. Confirm this dimension as it affects volume and block count. Use a tape measure or laser device to verify thickness at multiple points.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
            <span>
              <strong>Subtract Openings:</strong> Deduct the area of doors, windows, and other permanent openings from your measurements. This prevents overestimating the number of blocks and reduces unnecessary costs.
            </span>
          </li>
        </ul>
      </section>

      {/* 3. COMMON MISTAKES (HIGH VALUE) */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5" /> Common Mistakes to Avoid
        </h3>
        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>
            <strong>1. Underestimating Waste:</strong> Many beginners order exactly the calculated amount of blocks, not accounting for cuts, breakage, or spillage. This often leads to shortages mid-project. Always include a waste margin of at least 10% to cover these inevitable losses.
          </p>
          <p>
            <strong>2. Ignoring Mortar Joint Thickness:</strong> Using actual block dimensions instead of nominal sizes that include mortar joints can cause underestimation. Mortar joints typically add about 3/8 inch (10 mm) to block dimensions, so always use nominal sizes for accurate calculations.
          </p>
          <p>
            <strong>3. Forgetting to Subtract Openings:</strong> Failing to subtract door and window openings inflates material estimates unnecessarily. Carefully measure and subtract these areas to avoid excess ordering and wasted budget.
          </p>
        </div>
      </section>

      {/* 4. DETAILED FAQ */}
      <section id="faq">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{faq.question}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Block (CMU) Wall Calculator"
      description="The ultimate guide and calculator for Concrete Block (CMU) Wall Calculator. Learn how to estimate materials, calculate costs, and avoid common mistakes in your project."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      relatedCalculators={[
        { title: "Concrete Calculator", url: "/construction/concrete-slab-volume", icon: "🏗️" },
        { title: "Flooring Calculator", url: "/construction/hardwood-plank-quantity", icon: "🪵" },
        { title: "Paint Calculator", url: "/construction/paint-coverage-gallons", icon: "🎨" }
      ]}
      onThisPage={[
        { id: "guide", label: "Complete Guide" },
        { id: "how-to-measure", label: "How to Measure" },
        { id: "mistakes", label: "Common Mistakes" },
        { id: "faq", label: "FAQ" }
      ]}
      showTopBanner
      showSidebar
      showBottomBanner
    />
  );
}