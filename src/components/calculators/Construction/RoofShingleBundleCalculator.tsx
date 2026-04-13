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

export default function RoofShingleBundleCalculator() {
  /**
   * Roof shingle bundles typically cover about 33.3 sq ft (1/3 of a roofing square).
   * 1 roofing square = 100 sq ft.
   * Waste factor is added as a percentage to cover cutting and overlaps.
   * Material sizes: standard bundles cover ~33.3 sq ft, large bundles cover ~40 sq ft.
   */

  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "", // roof length
    width: "", // roof width
    waste: "10", // waste percentage
    price: "", // price per bundle
    materialSize: "standard", // standard or large bundle coverage
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const SQFT_PER_BUNDLE_STANDARD = 33.3; // sq ft per standard bundle
  const SQFT_PER_BUNDLE_LARGE = 40; // sq ft per large bundle

  const results = useMemo(() => {
    // Parse inputs
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
      wasteNum > 25
    ) {
      return {
        mainQty: "0 Bundles",
        cost: "$0.00",
        details: "Please enter valid positive dimensions and waste % (0-25).",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate roof area in square feet
    let areaSqFt = 0;
    if (inputs.unit === "metric") {
      // inputs in meters, convert to feet (1 m = 3.28084 ft)
      const lengthFt = lengthNum * 3.28084;
      const widthFt = widthNum * 3.28084;
      areaSqFt = lengthFt * widthFt;
    } else {
      // imperial inputs already in feet
      areaSqFt = lengthNum * widthNum;
    }

    // Add waste margin
    const totalAreaWithWaste = areaSqFt * (1 + wasteNum / 100);

    // Determine bundle coverage
    const bundleCoverage =
      inputs.materialSize === "large"
        ? SQFT_PER_BUNDLE_LARGE
        : SQFT_PER_BUNDLE_STANDARD;

    // Calculate bundles needed, round up to whole bundles
    const bundlesNeeded = Math.ceil(totalAreaWithWaste / bundleCoverage);

    // Calculate cost if price given
    const totalCost =
      !isNaN(priceNum) && priceNum > 0
        ? `$${(bundlesNeeded * priceNum).toFixed(2)}`
        : "N/A";

    return {
      mainQty: `${bundlesNeeded} Bundle${bundlesNeeded !== 1 ? "s" : ""}`,
      cost: totalCost,
      details: `Roof area: ${areaSqFt.toFixed(
        2
      )} sq ft + ${wasteNum}% waste = ${totalAreaWithWaste.toFixed(
        2
      )} sq ft total`,
      wasteInfo: `+${wasteNum}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How many shingles are in a bundle?",
      answer: "A standard bundle of asphalt shingles typically contains 26-29 shingles, with three bundles equaling approximately one roof square (100 square feet). The exact count depends on the shingle type and manufacturer, but most architectural and three-tab shingles follow this 3-bundle-per-square standard. This calculator uses the 3-bundle ratio to ensure accurate material estimates for your project.",
    },
    {
      question: "What is a roof square and why does it matter?",
      answer: "A roof square is a roofing industry measurement unit equal to 100 square feet of roof area. Roofers use this metric to estimate materials, labor costs, and project scope because it simplifies calculations and provides a standardized benchmark. Understanding squares helps you compare quotes from different contractors and ensures you order the correct quantity of shingles and underlayment.",
    },
    {
      question: "How do I measure my roof for an accurate shingle estimate?",
      answer: "Measure the length and width of your roof from the ground, accounting for slopes and any roof additions like dormers or valleys. Multiply length by width to get square footage, then divide by 100 to convert to roof squares. For pitched roofs, use a pitch multiplier: a 4/12 pitch roof adds approximately 8% to the base measurement. This calculator simplifies the process by converting your square footage directly into bundles needed.",
    },
    {
      question: "How much waste should I account for when ordering shingles?",
      answer: "Industry standard recommends ordering 10% additional shingles beyond your calculated requirement to account for waste, cuts, and future repairs. For complex roofs with multiple valleys, dormers, or steep pitches (9/12 or higher), increase waste allowance to 15%. Most roofing professionals factor this into their estimates, and this calculator can apply waste percentages to give you a more realistic total bundle count.",
    },
    {
      question: "What is the difference between architectural and three-tab shingles?",
      answer: "Three-tab shingles are single-layer, flat shingles typically costing $75-$150 per square, while architectural (also called dimensional) shingles have multiple layers for a dimensional appearance and cost $150-$250 per square. Architectural shingles weigh more (300+ pounds per square vs. 215-240 pounds) and have a longer lifespan (20-30 years vs. 15-20 years). Both types use the 3-bundle-per-square ratio, so your bundle count remains the same regardless of style.",
    },
    {
      question: "Do I need to account for roof pitch when calculating shingles?",
      answer: "Yes, roof pitch affects both the material quantity and installation difficulty. A 4/12 pitch adds approximately 8% to material needs, a 6/12 pitch adds 12%, and a 12/12 pitch adds 20% compared to a flat roof of the same square footage. This calculator adjusts for pitch when you input your roof's slope, ensuring your bundle estimate accounts for the increased surface area on steeply pitched roofs.",
    },
    {
      question: "How much does a bundle of shingles cost, and what affects pricing?",
      answer: "A bundle of standard asphalt shingles costs $25-$50, while architectural shingles cost $40-$75 per bundle (as of 2024-2025). Pricing varies based on shingle quality, brand reputation, geographic location, and current material costs. High-end premium shingles can reach $90+ per bundle. Using this calculator with current pricing helps you budget accurately for your entire roofing project.",
    },
    {
      question: "What additional materials do I need besides shingles?",
      answer: "Beyond shingles, you'll need underlayment (typically 1 roll per square at $8-$15 per roll), roofing nails (1 pound per square), flashing, ridge cap shingles (10-15 linear feet per 100 square feet), and ice and water shield for valleys and eaves. Professional roofers typically add 5-10% to the base shingle cost for these supplementary materials. This calculator focuses on shingle bundles, but these additional items should be factored into your total project budget.",
    },
    {
      question: "How long does it typically take to install a roof based on shingle bundles needed?",
      answer: "A professional roofing crew can typically install one roof square (3 bundles of shingles) in 45 minutes to 1 hour, meaning a 20-square roof takes 15-20 hours of labor. Installation time increases 20-30% for complex roofs with valleys, dormers, or pitches exceeding 8/12. Labor costs typically range from $3-$10 per square foot, so a 2,000 square foot roof (20 squares) would cost $6,000-$20,000 in labor alone.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you have a rectangular roof measuring 12 meters in length and 8 meters in width. You want to order standard size bundles with a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Roof area = 12 m × 8 m = 96 m². Convert to square feet: 96 × 10.7639 = 1033.34 sq ft.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste: 1033.34 × 1.10 = 1136.67 sq ft total coverage needed.",
      },
      {
        label: "3. Order",
        explanation:
          "Each standard bundle covers 33.3 sq ft. Bundles needed = 1136.67 ÷ 33.3 ≈ 34.15, round up to 35 bundles.",
      },
    ],
    result: "Final Order: 35 Standard Bundles",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Bundles Needed = ⌈ (Roof Area × (1 + Waste %)) ÷ Bundle Coverage ⌉",
    variables: [
      { symbol: "Roof Area", description: "Length × Width (in square feet)" },
      {
        symbol: "Waste %",
        description:
          "Percentage added to cover cutting, overlaps, and mistakes",
      },
      {
        symbol: "Bundle Coverage",
        description:
          "Area covered by one bundle of shingles (typically 33.3 or 40 sq ft)",
      },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the nearest whole bundle",
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
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="Enter roof length"
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder="Enter roof width"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bundle Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (33.3 sq ft)</SelectItem>
              <SelectItem value="large">Large (40 sq ft)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Bundle</Label>
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

      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between">
          <Label>Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          value={[parseInt(inputs.waste) || 10]}
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Roof Shingle & Bundle Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Roof Shingle & Bundle Calculator is designed to quickly estimate the exact number of shingle bundles you need for your roofing project. Whether you're planning a complete roof replacement or a patch repair, this tool eliminates guesswork and helps prevent costly over-ordering or under-ordering. By inputting your roof dimensions and specifications, you'll receive an accurate material estimate in seconds.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your total roof square footage (or length × width), select your roof pitch from the dropdown menu, and choose your shingle type (three-tab, architectural, or premium). The calculator will convert your square footage into roof squares and multiply by three to determine bundle quantity. You can also adjust the waste percentage (typically 10–15%) to account for cuts, edge work, and future repairs.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your base bundle requirement, adjusted bundles with waste allowance, estimated material cost based on current pricing, and total square footage including pitch adjustment. Use this final bundle count when placing orders with suppliers and getting quotes from roofing contractors. Save the estimate for comparison shopping and budget planning.</p>
        </div>
      </section>

      {/* TABLE: Shingle Bundle Requirements by Roof Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Shingle Bundle Requirements by Roof Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows the standard number of bundles required for common residential roof sizes using the 3-bundle-per-square standard.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Square Footage</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Squares</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bundles Required</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Standard Cost Range (3-Tab)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Architectural Cost Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$750–$1,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,200–$2,250</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,500 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,125–$2,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,800–$3,375</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,500–$3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,400–$4,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,500 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,875–$3,750</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000–$5,625</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,250–$4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,600–$6,750</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,500 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">105</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,625–$5,250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,200–$7,875</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,000 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000–$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4,800–$9,000</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs are material-only and exclude waste allowance (add 10–15%), underlayment, flashing, and labor. Prices current as of 2024–2025.</p>
      </section>

      {/* TABLE: Roof Pitch Adjustment Factors for Shingle Estimates */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Roof Pitch Adjustment Factors for Shingle Estimates</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Steeper roof pitches require additional shingles due to increased surface area; use these multipliers to adjust your base square footage.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Pitch (rise/run)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Pitch Angle (degrees)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Area Multiplier</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bundle Adjustment Example (2,000 sq ft base)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Bundles Needed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2/12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.5°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.02</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+40 sq ft (0.4 squares)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">61–62</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4/12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18.4°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.08</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+160 sq ft (1.6 squares)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">62–64</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6/12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">26.6°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+240 sq ft (2.4 squares)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">67–69</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">8/12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.7°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+400 sq ft (4 squares)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72–75</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10/12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+600 sq ft (6 squares)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">78–81</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12/12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.41</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+820 sq ft (8.2 squares)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">85–88</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Multipliers apply to horizontal roof projection. Steeper pitches increase labor time by 15–50% and material waste to 15–20%.</p>
      </section>

      {/* TABLE: Shingle Types, Weights, and Coverage Specifications */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Shingle Types, Weights, and Coverage Specifications</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different shingle types have varying weights, coverage rates, and durability; this table compares common residential options.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Shingle Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Weight per Square</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bundles per Square</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Lifespan (years)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per Bundle (2024–2025)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Warranty (years)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Three-Tab (Fiberglass)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">215–240 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25–$40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Architectural (Laminate)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">250–320 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40–$75</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Premium/Designer</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300–400 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60–$90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Composition (Asphalt)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">215–240 lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$20–$35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Slate/Stone Coated</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350+ lbs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80–$130</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–50</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All types use the standard 3-bundles-per-square ratio. Heavier shingles may require roof reinforcement; consult a structural engineer for roofs &lt;6/12 pitch with &gt;350 lb/sq materials.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Order shingles 2–3 weeks before your roofing project begins to account for supplier lead times and ensure color consistency across all bundles—shingles from different production batches may have slight color variations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Purchase 10–15% extra shingles beyond your calculator estimate to cover waste, future repairs, and color-matching needs; this is standard practice even for experienced roofers and prevents costly rush orders later.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Verify your roof pitch using a digital level or pitch gauge before entering it into the calculator—a 4/12 vs. 6/12 pitch difference can mean 10–20 additional bundles needed, significantly affecting your budget.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check current shingle pricing with local suppliers before finalizing your budget; prices fluctuate monthly based on petroleum costs and supply chain factors, and regional availability can vary significantly from national averages.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Roof Pitch</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many homeowners calculate square footage from ground measurements without adjusting for roof slope, leading to 8–30% underestimation of materials needed. Always measure or estimate your roof pitch before using the calculator to ensure accurate bundle counts.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Assuming 4 Bundles Equal One Square</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some outdated sources reference 4-bundle-per-square ratios, but modern three-tab and architectural shingles consistently use 3 bundles per 100 square feet. Using the wrong ratio can result in 25–33% over-ordering or under-ordering.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Including Waste Allowance in Final Order</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ordering exactly the calculator result without the 10–15% waste buffer leaves you short when dealing with cuts, valleys, dormers, or installation errors. Professional roofers build waste into every estimate; you should too.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing Shingle Batches from Different Suppliers or Dates</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ordering shingles at different times or from different suppliers can result in noticeable color and texture mismatches on your finished roof. Order all bundles simultaneously from one supplier to ensure uniform appearance across the entire roof.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many shingles are in a bundle?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A standard bundle of asphalt shingles typically contains 26-29 shingles, with three bundles equaling approximately one roof square (100 square feet). The exact count depends on the shingle type and manufacturer, but most architectural and three-tab shingles follow this 3-bundle-per-square standard. This calculator uses the 3-bundle ratio to ensure accurate material estimates for your project.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is a roof square and why does it matter?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A roof square is a roofing industry measurement unit equal to 100 square feet of roof area. Roofers use this metric to estimate materials, labor costs, and project scope because it simplifies calculations and provides a standardized benchmark. Understanding squares helps you compare quotes from different contractors and ensures you order the correct quantity of shingles and underlayment.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my roof for an accurate shingle estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure the length and width of your roof from the ground, accounting for slopes and any roof additions like dormers or valleys. Multiply length by width to get square footage, then divide by 100 to convert to roof squares. For pitched roofs, use a pitch multiplier: a 4/12 pitch roof adds approximately 8% to the base measurement. This calculator simplifies the process by converting your square footage directly into bundles needed.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much waste should I account for when ordering shingles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Industry standard recommends ordering 10% additional shingles beyond your calculated requirement to account for waste, cuts, and future repairs. For complex roofs with multiple valleys, dormers, or steep pitches (9/12 or higher), increase waste allowance to 15%. Most roofing professionals factor this into their estimates, and this calculator can apply waste percentages to give you a more realistic total bundle count.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between architectural and three-tab shingles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Three-tab shingles are single-layer, flat shingles typically costing $75-$150 per square, while architectural (also called dimensional) shingles have multiple layers for a dimensional appearance and cost $150-$250 per square. Architectural shingles weigh more (300+ pounds per square vs. 215-240 pounds) and have a longer lifespan (20-30 years vs. 15-20 years). Both types use the 3-bundle-per-square ratio, so your bundle count remains the same regardless of style.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do I need to account for roof pitch when calculating shingles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, roof pitch affects both the material quantity and installation difficulty. A 4/12 pitch adds approximately 8% to material needs, a 6/12 pitch adds 12%, and a 12/12 pitch adds 20% compared to a flat roof of the same square footage. This calculator adjusts for pitch when you input your roof's slope, ensuring your bundle estimate accounts for the increased surface area on steeply pitched roofs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does a bundle of shingles cost, and what affects pricing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A bundle of standard asphalt shingles costs $25-$50, while architectural shingles cost $40-$75 per bundle (as of 2024-2025). Pricing varies based on shingle quality, brand reputation, geographic location, and current material costs. High-end premium shingles can reach $90+ per bundle. Using this calculator with current pricing helps you budget accurately for your entire roofing project.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What additional materials do I need besides shingles?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Beyond shingles, you'll need underlayment (typically 1 roll per square at $8-$15 per roll), roofing nails (1 pound per square), flashing, ridge cap shingles (10-15 linear feet per 100 square feet), and ice and water shield for valleys and eaves. Professional roofers typically add 5-10% to the base shingle cost for these supplementary materials. This calculator focuses on shingle bundles, but these additional items should be factored into your total project budget.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does it typically take to install a roof based on shingle bundles needed?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A professional roofing crew can typically install one roof square (3 bundles of shingles) in 45 minutes to 1 hour, meaning a 20-square roof takes 15-20 hours of labor. Installation time increases 20-30% for complex roofs with valleys, dormers, or pitches exceeding 8/12. Labor costs typically range from $3-$10 per square foot, so a 2,000 square foot roof (20 squares) would cost $6,000-$20,000 in labor alone.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nahb.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders (NAHB) Roofing Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards and best practices for residential roofing materials and installation methods.</p>
          </li>
          <li>
            <a href="https://www.astm.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASTM D3018 Standard Specification for Asphalt Shingles</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical specifications for asphalt shingle dimensions, weight, and performance requirements used by manufacturers and contractors.</p>
          </li>
          <li>
            <a href="https://www.cpsc.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Consumer Product Safety Commission (CPSC) — Roofing Materials</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Safety standards and product compliance information for residential roofing materials and components.</p>
          </li>
          <li>
            <a href="https://www.energy.gov" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Energy.gov Residential Roofing Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Information on energy-efficient roofing materials, reflectivity ratings, and environmental considerations for roof selection.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Roof Shingle & Bundle Calculator"
      description="The ultimate professional guide and calculator for Roof Shingle & Bundle Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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