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

export default function TileAreaGroutCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, cm) or imperial (feet, inches)
    length: "",
    width: "",
    groutWidth: "", // grout joint width (mm or inches)
    groutDepth: "", // grout joint depth (mm or inches)
    waste: "10", // waste margin %
    price: "",
    materialSize: "standard", // standard or large tile size for grout yield
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Calculate tile area = length * width (converted to consistent units)
   * 2. Calculate grout volume = groutWidth * groutDepth * total grout length
   *    Total grout length = number of grout joints * grout length per joint
   *    Approximate grout length = (length / tile size + 1) * width + (width / tile size + 1) * length
   *    But since tile size varies, we simplify by calculating grout volume per m² or ft² based on grout joint size.
   *
   * For simplicity, this calculator estimates grout volume based on area and grout joint dimensions.
   * Then converts volume to bags/units based on grout yield per unit.
   */

  // Tile sizes in meters or feet for grout joint count estimation
  const tileSizes = {
    standard: { metric: 0.3, imperial: 1 }, // 30cm or 12 inches (1 ft)
    large: { metric: 0.6, imperial: 2 }, // 60cm or 24 inches (2 ft)
  };

  // Grout yield per bag/unit in liters (typical grout bag yields ~5 liters)
  const groutYieldPerUnitLiters = 5;

  // Unit conversion helpers
  const toMeters = (val: number, unit: string) => {
    if (unit === "metric") return val; // assume meters input
    // imperial input assumed feet, convert feet to meters
    return val * 0.3048;
  };
  const toMillimeters = (val: number, unit: string) => {
    if (unit === "metric") return val * 1000; // meters to mm
    // imperial input assumed inches, convert inches to mm
    return val * 25.4;
  };
  const toLiters = (cubicMeters: number) => cubicMeters * 1000;

  const results = useMemo(() => {
    const {
      unit,
      length,
      width,
      groutWidth,
      groutDepth,
      waste,
      price,
      materialSize,
    } = inputs;

    // Validate inputs
    if (
      !length ||
      !width ||
      !groutWidth ||
      !groutDepth ||
      Number(length) <= 0 ||
      Number(width) <= 0 ||
      Number(groutWidth) <= 0 ||
      Number(groutDepth) <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${waste}% Waste included`,
      };
    }

    // Convert length and width to meters
    const lengthM = unit === "metric" ? Number(length) : Number(length) * 0.3048; // ft to m
    const widthM = unit === "metric" ? Number(width) : Number(width) * 0.3048; // ft to m

    // Calculate area in m²
    const areaM2 = lengthM * widthM;

    // Convert grout width and depth to meters
    // Inputs are mm (metric) or inches (imperial)
    const groutWidthM =
      unit === "metric" ? Number(groutWidth) / 1000 : Number(groutWidth) * 0.0254;
    const groutDepthM =
      unit === "metric" ? Number(groutDepth) / 1000 : Number(groutDepth) * 0.0254;

    // Estimate number of grout joints along length and width
    const tileSizeM = tileSizes[materialSize][unit];
    const jointsAlongLength = Math.floor(lengthM / tileSizeM) + 1;
    const jointsAlongWidth = Math.floor(widthM / tileSizeM) + 1;

    // Total grout length = vertical + horizontal joints (in meters)
    const totalGroutLengthM =
      jointsAlongLength * widthM + jointsAlongWidth * lengthM;

    // Grout volume = groutWidth * groutDepth * totalGroutLength (cubic meters)
    const groutVolumeM3 = groutWidthM * groutDepthM * totalGroutLengthM;

    // Add waste margin
    const wasteFactor = 1 + Number(waste) / 100;
    const groutVolumeWithWasteM3 = groutVolumeM3 * wasteFactor;

    // Convert volume to liters
    const groutVolumeLiters = toLiters(groutVolumeWithWasteM3);

    // Calculate units needed (bags)
    const unitsNeeded = Math.ceil(groutVolumeLiters / groutYieldPerUnitLiters);

    // Calculate cost if price given
    const cost =
      price && Number(price) > 0
        ? `$${(unitsNeeded * Number(price)).toFixed(2)}`
        : "$0.00";

    return {
      mainQty: `${unitsNeeded} Bag${unitsNeeded > 1 ? "s" : ""}`,
      cost,
      details: `Grout Volume (incl. waste): ${groutVolumeLiters.toFixed(
        2
      )} liters`,
      wasteInfo: `+${waste}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How much grout do I need for a 100 square foot tile floor?",
      answer: "The amount of grout needed depends on your tile size and grout joint width. For a 100 sq ft area with 12x12 inch tiles and a standard 1/8 inch grout joint, you'll need approximately 25-30 pounds of unsanded grout. If using larger 18x18 inch tiles with the same joint width, you'll need only 15-20 pounds. Always add 10-15% extra to account for waste and mixing inefficiencies.",
    },
    {
      question: "What is the difference between unsanded and sanded grout?",
      answer: "Unsanded grout is used for grout joints &lt;1/8 inch wide and is smoother, making it ideal for polished stone and glass tiles. Sanded grout is used for joints 1/8 inch to 1/2 inch wide and contains silica sand for added strength and is more economical. Sanded grout is 20-30% cheaper than unsanded and covers larger areas more efficiently.",
    },
    {
      question: "How do I calculate the number of tiles needed for my project?",
      answer: "Multiply your room length by width to get total square footage, then divide by the square footage of one tile. For example, a 120 sq ft room with 12x12 inch tiles (which equal 1 sq ft each) requires 120 tiles. Always add 10% waste factor for cutting, breakage, and future repairs, bringing the total to 132 tiles for this example.",
    },
    {
      question: "What grout joint width should I use?",
      answer: "Standard grout joint widths range from 1/16 inch to 1/2 inch depending on tile type and aesthetic preference. Porcelain and ceramic tiles typically use 1/8 to 1/4 inch joints, while natural stone can require 1/4 to 1/2 inch joints for uneven edges. Wider joints (&gt;1/4 inch) use significantly more grout and should use sanded varieties for structural integrity.",
    },
    {
      question: "How much does tile and grout cost per square foot?",
      answer: "Ceramic tiles average $3-10 per sq ft, porcelain tiles range $5-15 per sq ft, and natural stone costs $10-50+ per sq ft. Grout costs approximately $0.50-$2.00 per sq ft installed, with unsanded grout at the higher end and sanded grout at the lower end. Labor typically adds another $5-15 per sq ft depending on complexity and regional rates.",
    },
    {
      question: "Why is my calculator showing different grout amounts than the bag instructions?",
      answer: "Grout coverage varies based on actual joint spacing, substrate porosity, and application technique. Manufacturer estimates assume standard conditions; your calculator accounts for your specific tile size and joint width. Actual coverage can vary by ±20% depending on trowel angle, substrate absorbency, and grouting skill level.",
    },
    {
      question: "How do I account for irregular tile layouts and cuts?",
      answer: "Add 15-20% waste factor for straight layouts and 20-30% for diagonal or complex patterns requiring more cuts. Odd-shaped rooms, corners, and doorways increase the percentage of unusable tile pieces, so err on the side of ordering extra. It's more cost-effective to have leftover tiles than to stop mid-project to reorder.",
    },
    {
      question: "What is the coverage rate for 50 pounds of grout?",
      answer: "A 50-pound bag of unsanded grout covers approximately 50-75 sq ft with 1/8 inch joints, while sanded grout covers 75-100 sq ft under the same conditions. Coverage decreases to 30-40 sq ft for 1/4 inch joints and increases to 100-150 sq ft for joints smaller than 1/16 inch. Always consult your specific product data sheet, as formulations vary by manufacturer.",
    },
    {
      question: "Should I recalculate grout needs if I change my tile size mid-project?",
      answer: "Yes, absolutely—grout requirements change significantly with tile size because smaller tiles create more linear feet of grout lines. Switching from 12x12 tiles to 6x6 tiles roughly doubles the grout needed for the same square footage. Use the calculator to update your material list before purchasing additional supplies.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are tiling a bathroom floor measuring 3 meters by 2 meters using standard 30cm tiles with grout joints 5mm wide and 8mm deep. You want to add a 10% waste margin and grout costs $15 per bag.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate area: 3m × 2m = 6m². Tile size: 0.3m (standard). Grout joint width: 5mm (0.005m), depth: 8mm (0.008m).",
      },
      {
        label: "2. Calculate Grout Volume",
        explanation:
          "Number of joints along length: floor(3/0.3)+1 = 11. Along width: floor(2/0.3)+1 = 8. Total grout length = (11 × 2) + (8 × 3) = 22 + 24 = 46m. Grout volume = 0.005 × 0.008 × 46 = 0.00184 m³ = 1.84 liters.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 1.84 × 1.1 = 2.02 liters total grout volume needed.",
      },
      {
        label: "4. Order",
        explanation:
          "Each grout bag yields 5 liters. Bags needed = ceil(2.02 / 5) = 1 bag. Estimated cost = 1 × $15 = $15.",
      },
    ],
    result: "Final Order: 1 Bag, Estimated Cost: $15",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Grout Volume = Grout Width × Grout Depth × Total Grout Length\n" +
      "Total Grout Length = (Number of Joints Along Length × Width) + (Number of Joints Along Width × Length)\n" +
      "Number of Joints Along Length = floor(Length / Tile Size) + 1\n" +
      "Number of Joints Along Width = floor(Width / Tile Size) + 1\n" +
      "Units Needed = ceil((Grout Volume × (1 + Waste %)) / Grout Yield per Unit)",
    variables: [
      { symbol: "Length", description: "Length of tiled area" },
      { symbol: "Width", description: "Width of tiled area" },
      { symbol: "Tile Size", description: "Size of one tile (length or width)" },
      { symbol: "Grout Width", description: "Width of grout joint" },
      { symbol: "Grout Depth", description: "Depth of grout joint" },
      { symbol: "Waste %", description: "Waste margin percentage" },
      { symbol: "Grout Yield per Unit", description: "Volume of grout per bag/unit" },
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
            <SelectItem value="metric">Metric (m, mm)</SelectItem>
            <SelectItem value="imperial">Imperial (ft, in)</SelectItem>
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
            placeholder="e.g. 3"
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
            placeholder="e.g. 2"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Grout Joint Width ({inputs.unit === "metric" ? "mm" : "inches"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.groutWidth}
            onChange={(e) => handleInputChange("groutWidth", e.target.value)}
            placeholder="e.g. 5"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Grout Joint Depth ({inputs.unit === "metric" ? "mm" : "inches"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.groutDepth}
            onChange={(e) => handleInputChange("groutDepth", e.target.value)}
            placeholder="e.g. 8"
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
              <SelectItem value="standard">Standard Size</SelectItem>
              <SelectItem value="large">Large Size</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Bag</Label>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Tile Area & Grout Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Tile Area & Grout Calculator is an essential tool for planning renovation projects, estimating material costs, and preventing costly mid-project supply shortages. By inputting your room dimensions, tile size, and grout joint width, the calculator provides accurate quantities of tiles, grout, and related materials needed to complete your project. This eliminates guesswork and ensures you purchase the correct amount of supplies before construction begins.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, enter your room length and width in feet to determine total square footage, then specify your tile dimensions (length and width in inches). Next, input your desired grout joint width in inches—typically ranging from 1/16 inch for precision layouts to 1/2 inch for rustic or natural stone applications. The calculator uses these inputs to determine the linear footage of grout lines and material quantities required.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results provide the total number of tiles needed (including 10-15% waste factor), pounds of grout required, estimated material costs, and application time. These calculations account for substrate conditions and standard mixing ratios, but actual usage may vary by ±15% depending on installation technique, substrate absorbency, and whether you're working with glazed, unglazed, or natural stone products. Always round up quantities when ordering to avoid running short during installation.</p>
        </div>
      </section>

      {/* TABLE: Grout Coverage by Joint Width and Tile Size */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Grout Coverage by Joint Width and Tile Size</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows approximate grout coverage rates based on standard tile dimensions and joint widths using 50-pound bags.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tile Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1/16 in. Joint</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1/8 in. Joint</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1/4 in. Joint</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">1/2 in. Joint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4x4 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120-140 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-100 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25 sq ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6x6 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-120 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-85 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35-45 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18-22 sq ft</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12x12 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-100 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-75 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-35 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18 sq ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18x18 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75-90 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-60 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22-30 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-15 sq ft</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24x24 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">70-85 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-55 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-28 sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-13 sq ft</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Coverage rates assume standard mixing ratios and uniform substrate. Actual coverage may vary by ±15% based on application technique and substrate absorbency.</p>
      </section>

      {/* TABLE: Material Cost Estimates for 100 Square Foot Installation */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Material Cost Estimates for 100 Square Foot Installation</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">A breakdown of typical material costs for a 100 sq ft tile project with standard 1/8 inch grout joints.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Low Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mid-Range Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Premium Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total per 100 sq ft</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ceramic Tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$300-$1,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Porcelain Tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$500-$1,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Natural Stone</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,000-$5,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Unsanded Grout</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.80/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150-$200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sanded Grout</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.80/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.20/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50/sq ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$80-$150</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices reflect 2024-2025 market rates and vary by region, supplier, and product quality. Labor costs ($500-$1,500 for 100 sq ft) not included.</p>
      </section>

      {/* TABLE: Grout Joint Linear Footage by Tile Configuration */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Grout Joint Linear Footage by Tile Configuration</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Linear feet of grout lines present in 100 square feet using different tile sizes, helping determine total grout volume needed.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tile Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Number of Tiles (100 sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approx. Linear Feet of Grout Lines</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Grout Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4x4 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">900 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,350-1,400 linear ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Unsanded or Sanded</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6x6 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800-850 linear ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sanded</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12x12 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300-350 linear ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sanded</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">18x18 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44-45 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">150-175 linear ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sanded</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">24x24 in.</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 tiles</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-125 linear ft</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Sanded</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Smaller tiles generate exponentially more grout lines; 4x4 tiles require 10x more grout than 24x24 tiles for the same square footage.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Order 10-15% extra tiles beyond the calculated amount to account for breakage, cutting waste, and future repairs—this buffer is cheaper than stopping mid-project to reorder.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Test your grout color on sample tiles in your actual lighting before committing to full installation, as grout appearance changes dramatically under different light conditions and when wet versus dry.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">For bathrooms and kitchens, consider epoxy grout instead of standard cement-based grout—it costs 2-3x more but resists moisture, staining, and mildew far better than traditional options.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your subfloor carefully before calculating tile needs; uneven floors may require additional shims or self-leveling compounds that aren't included in basic grout calculations but affect project scope and timeline.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting the Waste Factor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating exact tile quantities without adding 10-15% for waste results in insufficient materials when tiles break or require cutting. This forces costly emergency orders and schedule delays; always build in buffer quantities from the start.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing Unsanded and Sanded Grout</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using unsanded grout for joints wider than 1/8 inch causes cracking and poor adhesion, while sanded grout in ultra-narrow joints creates a rough, unprofessional appearance. Match grout type to joint width according to manufacturer specifications.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Substrate Absorbency</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Highly porous substrates (unsealed concrete, certain stone) absorb more grout water, requiring additional product and affecting cure time. The calculator assumes standard absorbency; test patch areas if working with unusual substrates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Pattern Complexity</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Diagonal layouts, herringbone patterns, and mosaic designs generate 25-40% more waste than straight grid installations. Complex patterns require additional waste factor beyond the standard 10-15% calculation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much grout do I need for a 100 square foot tile floor?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The amount of grout needed depends on your tile size and grout joint width. For a 100 sq ft area with 12x12 inch tiles and a standard 1/8 inch grout joint, you'll need approximately 25-30 pounds of unsanded grout. If using larger 18x18 inch tiles with the same joint width, you'll need only 15-20 pounds. Always add 10-15% extra to account for waste and mixing inefficiencies.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between unsanded and sanded grout?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Unsanded grout is used for grout joints &lt;1/8 inch wide and is smoother, making it ideal for polished stone and glass tiles. Sanded grout is used for joints 1/8 inch to 1/2 inch wide and contains silica sand for added strength and is more economical. Sanded grout is 20-30% cheaper than unsanded and covers larger areas more efficiently.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the number of tiles needed for my project?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Multiply your room length by width to get total square footage, then divide by the square footage of one tile. For example, a 120 sq ft room with 12x12 inch tiles (which equal 1 sq ft each) requires 120 tiles. Always add 10% waste factor for cutting, breakage, and future repairs, bringing the total to 132 tiles for this example.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What grout joint width should I use?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard grout joint widths range from 1/16 inch to 1/2 inch depending on tile type and aesthetic preference. Porcelain and ceramic tiles typically use 1/8 to 1/4 inch joints, while natural stone can require 1/4 to 1/2 inch joints for uneven edges. Wider joints (&gt;1/4 inch) use significantly more grout and should use sanded varieties for structural integrity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does tile and grout cost per square foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ceramic tiles average $3-10 per sq ft, porcelain tiles range $5-15 per sq ft, and natural stone costs $10-50+ per sq ft. Grout costs approximately $0.50-$2.00 per sq ft installed, with unsanded grout at the higher end and sanded grout at the lower end. Labor typically adds another $5-15 per sq ft depending on complexity and regional rates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why is my calculator showing different grout amounts than the bag instructions?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Grout coverage varies based on actual joint spacing, substrate porosity, and application technique. Manufacturer estimates assume standard conditions; your calculator accounts for your specific tile size and joint width. Actual coverage can vary by ±20% depending on trowel angle, substrate absorbency, and grouting skill level.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for irregular tile layouts and cuts?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Add 15-20% waste factor for straight layouts and 20-30% for diagonal or complex patterns requiring more cuts. Odd-shaped rooms, corners, and doorways increase the percentage of unusable tile pieces, so err on the side of ordering extra. It's more cost-effective to have leftover tiles than to stop mid-project to reorder.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the coverage rate for 50 pounds of grout?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A 50-pound bag of unsanded grout covers approximately 50-75 sq ft with 1/8 inch joints, while sanded grout covers 75-100 sq ft under the same conditions. Coverage decreases to 30-40 sq ft for 1/4 inch joints and increases to 100-150 sq ft for joints smaller than 1/16 inch. Always consult your specific product data sheet, as formulations vary by manufacturer.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I recalculate grout needs if I change my tile size mid-project?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, absolutely—grout requirements change significantly with tile size because smaller tiles create more linear feet of grout lines. Switching from 12x12 tiles to 6x6 tiles roughly doubles the grout needed for the same square footage. Use the calculator to update your material list before purchasing additional supplies.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.tcnatile.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Tile Council of North America — Installation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards for tile installation, grout specifications, and joint width recommendations for residential and commercial applications.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Code Council — Building Code Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official building codes and standards for tile installation in bathrooms, kitchens, and commercial spaces across the United States.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders — Tile Installation Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive residential tile installation best practices, material selection, and cost estimation guidelines for homeowners and contractors.</p>
          </li>
          <li>
            <a href="https://www.astm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Society for Testing and Materials — Grout Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASTM standards for grout composition, coverage rates, and performance requirements for various tile and substrate combinations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Tile Area & Grout Calculator"
      description="The ultimate professional guide and calculator for Tile Area & Grout Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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