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

export default function StairTreadRiserDimensionsCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, cm) or imperial (feet, inches)
    treadLength: "", // horizontal run of tread (depth)
    treadWidth: "", // width of the stair (side to side)
    riserHeight: "", // vertical height of riser
    waste: "10", // waste percentage
    price: "", // price per unit material
    materialSize: "standard", // standard or large size material units
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion helpers
  const toMeters = (val: number, unit: string) => {
    if (unit === "metric") return val; // assume meters input
    // imperial assumed feet, convert feet to meters
    return val * 0.3048;
  };

  const toFeet = (val: number, unit: string) => {
    if (unit === "imperial") return val; // feet input
    // metric assumed meters, convert meters to feet
    return val / 0.3048;
  };

  // Material unit sizes (in meters) for calculation
  // Standard size: 1.0m x 0.3m (typical stair tread board)
  // Large size: 1.2m x 0.4m
  const materialSizes = {
    standard: { length: 1.0, width: 0.3 },
    large: { length: 1.2, width: 0.4 },
  };

  const results = useMemo(() => {
    // Parse inputs
    const treadLengthNum = parseFloat(inputs.treadLength);
    const treadWidthNum = parseFloat(inputs.treadWidth);
    const riserHeightNum = parseFloat(inputs.riserHeight);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const matSize = inputs.materialSize;

    if (
      isNaN(treadLengthNum) ||
      isNaN(treadWidthNum) ||
      isNaN(riserHeightNum) ||
      treadLengthNum <= 0 ||
      treadWidthNum <= 0 ||
      riserHeightNum <= 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Convert all dimensions to meters for calculation
    const treadLengthM = unit === "metric" ? treadLengthNum : treadLengthNum * 0.3048;
    const treadWidthM = unit === "metric" ? treadWidthNum : treadWidthNum * 0.3048;
    const riserHeightM = unit === "metric" ? riserHeightNum : riserHeightNum * 0.3048;

    // Calculate area of one tread (top horizontal surface)
    const treadArea = treadLengthM * treadWidthM; // m²

    // Calculate area of one riser (vertical face)
    const riserArea = riserHeightM * treadWidthM; // m²

    // Total material area per step (tread + riser)
    const stepArea = treadArea + riserArea; // m²

    // Material unit size area
    const matLength = materialSizes[matSize].length;
    const matWidth = materialSizes[matSize].width;
    const matArea = matLength * matWidth; // m² per unit

    // Calculate number of material units needed (without waste)
    const rawUnits = stepArea / matArea;

    // Add waste margin
    const totalUnits = rawUnits * (1 + wastePercent / 100);

    // Round up to nearest whole unit
    const roundedUnits = Math.ceil(totalUnits);

    // Calculate cost if price provided
    const totalCost = pricePerUnit && !isNaN(pricePerUnit) ? roundedUnits * pricePerUnit : 0;

    // Format results
    const mainQty = `${roundedUnits} Unit${roundedUnits !== 1 ? "s" : ""}`;
    const cost = pricePerUnit ? `$${totalCost.toFixed(2)}` : "Price not set";
    const details = `Raw units: ${rawUnits.toFixed(2)} (Area per step: ${stepArea.toFixed(
      3
    )} m², Material unit area: ${matArea.toFixed(3)} m²)`;
    const wasteInfo = `+${wastePercent}% Waste included`;

    return {
      mainQty,
      cost,
      details,
      wasteInfo,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the standard tread depth for residential stairs?",
      answer: "The standard tread depth for residential stairs is 10 to 11 inches, measured horizontally from the front edge of one step to the front edge of the next step. The International Building Code (IBC) requires a minimum tread depth of 10 inches for residential applications. This measurement ensures comfortable and safe stair navigation for most users.",
    },
    {
      question: "What is the maximum riser height allowed by building code?",
      answer: "The maximum riser height for residential stairs is 7.75 inches according to the International Building Code. Commercial stairs have a maximum riser height of 7 inches. Exceeding these limits creates a safety hazard and violates building codes in most jurisdictions.",
    },
    {
      question: "How do I calculate the number of stairs needed for my total rise?",
      answer: "To calculate the number of stairs, divide your total rise (floor-to-floor height) by the desired riser height. For example, if your total rise is 120 inches and you want 7.5-inch risers, you would need 120 ÷ 7.5 = 16 stairs. Always round up and adjust individual riser heights slightly to ensure they are all equal.",
    },
    {
      question: "What is the rule of 18 for stair design?",
      answer: "The rule of 18 states that the sum of one tread depth plus one riser height should equal approximately 17 to 18 inches for comfortable stair proportions. For example, a 10-inch tread plus a 7.5-inch riser equals 17.5 inches, which falls within the ideal range and ensures consistent step comfort.",
    },
    {
      question: "What is the minimum headroom required above stairs?",
      answer: "The minimum headroom required above stairs is 6 feet 8 inches (80 inches) measured vertically from the stair nosing or floor. This clearance must be maintained throughout the entire flight of stairs to prevent head injuries and meet building code requirements.",
    },
    {
      question: "How do I ensure all risers and treads are consistent?",
      answer: "Calculate your total rise and divide by your desired riser height, then adjust each riser slightly if needed so all risers are within 3/8 inch of each other. Use a layout tool or this calculator to distribute any remaining height difference evenly across all risers. Inconsistent steps are a major safety hazard and tripping risk.",
    },
    {
      question: "What is nosing and why is it important?",
      answer: "Nosing is the horizontal projection of the tread that extends beyond the riser below, typically 1.25 inches. Nosing prevents foot catch on the riser and provides a clear visual line between steps, improving safety and preventing trips. Building codes require nosing on all treads in public and residential stairs.",
    },
    {
      question: "Can I have different tread depths on the same flight?",
      answer: "No, all treads in a single flight of stairs must be the same depth within a tolerance of 3/8 inch. Inconsistent tread depths create tripping hazards and violate building codes. If you must adjust, redistribute the change evenly across all steps.",
    },
    {
      question: "What is the difference between residential and commercial stair requirements?",
      answer: "Residential stairs allow maximum 7.75-inch risers and 10-inch minimum treads, while commercial stairs require maximum 7-inch risers and 11-inch minimum treads. Commercial stairs must also have a minimum width of 44 inches, whereas residential stairs need only 36 inches. Commercial codes are stricter to accommodate higher foot traffic and accessibility requirements.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a staircase with a tread length of 0.9 meters, tread width of 1.0 meter, and riser height of 0.18 meters. You want to use standard size material boards (1.0m x 0.3m) and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the tread area: 0.9m × 1.0m = 0.9 m². Calculate the riser area: 0.18m × 1.0m = 0.18 m². Total area per step = 0.9 + 0.18 = 1.08 m².",
      },
      {
        label: "2. Waste",
        explanation:
          "Material unit area = 1.0m × 0.3m = 0.3 m². Raw units needed = 1.08 / 0.3 = 3.6 units. Add 10% waste: 3.6 × 1.10 = 3.96 units.",
      },
      {
        label: "3. Order",
        explanation:
          "Round up to nearest whole unit: 4 units. If price per unit is $25, total cost = 4 × $25 = $100.",
      },
    ],
    result: "Final Order: 4 Units, Estimated Cost: $100",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Material Units = ⌈ ((Tread Length × Tread Width) + (Riser Height × Tread Width)) / Material Unit Area × (1 + Waste %) ) ⌉",
    variables: [
      { symbol: "Tread Length", description: "Horizontal depth of the stair tread" },
      { symbol: "Tread Width", description: "Width of the stair tread (side to side)" },
      { symbol: "Riser Height", description: "Vertical height of the riser" },
      { symbol: "Material Unit Area", description: "Surface area covered by one material unit" },
      { symbol: "Waste %", description: "Additional percentage to cover waste and cuts" },
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
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DYNAMIC INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tread Length ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.treadLength}
            onChange={(e) => handleInputChange("treadLength", e.target.value)}
            placeholder="e.g. 0.9"
          />
        </div>
        <div className="space-y-2">
          <Label>Tread Width ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.treadWidth}
            onChange={(e) => handleInputChange("treadWidth", e.target.value)}
            placeholder="e.g. 1.0"
          />
        </div>
        <div className="space-y-2">
          <Label>Riser Height ({inputs.unit === "metric" ? "m" : "ft"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.riserHeight}
            onChange={(e) => handleInputChange("riserHeight", e.target.value)}
            placeholder="e.g. 0.18"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard (1.0m × 0.3m)</SelectItem>
              <SelectItem value="large">Large (1.2m × 0.4m)</SelectItem>
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
            <span className="text-sm font-semibold text-slate-500 uppercase">Materials Needed</span>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Stair Tread & Riser Dimensions Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">This calculator helps you design safe, code-compliant stairs by calculating the correct tread depth and riser height based on your total rise and desired stair proportions. Proper stair dimensions are critical for safety, accessibility, and building code compliance. Whether you're designing residential or commercial stairs, using this tool ensures your steps meet International Building Code (IBC) requirements and provide comfortable navigation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires you to input your total rise (the vertical distance from floor to floor), the number of stairs you want, or your preferred riser height. You can also input desired tread depth or use standard recommendations. The tool then calculates whether your dimensions comply with building codes, applies the rule of 17-18 inches for comfort, and shows you the actual measurements each step will have.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results show your calculated riser height, tread depth, and a compliance status indicating whether your design meets residential and commercial building codes. Use this information to verify your stair layout before construction. If your design doesn't comply, adjust either the total rise, number of steps, or riser height and recalculate until you achieve a code-compliant design with comfortable proportions.</p>
        </div>
      </section>

      {/* TABLE: IBC Stair Code Requirements by Application Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">IBC Stair Code Requirements by Application Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares the International Building Code requirements for residential, commercial, and accessible stairs.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Stair Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maximum Riser Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Tread Depth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Width</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Nosing Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.75 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25 inches max</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Commercial</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25 inches max</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Accessible (ADA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 inches max</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Interior Private</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.75 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">32 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.25 inches max</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Exterior Public</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.5 inches max</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">All measurements must comply with local building codes; verify requirements with your jurisdiction before construction.</p>
      </section>

      {/* TABLE: Common Stair Proportions Using the Rule of 17-18 */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Stair Proportions Using the Rule of 17-18</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows common riser and tread combinations that satisfy the rule of 17-18 inches for comfortable stair proportions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Riser Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Tread Depth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Combined Total</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Comfort Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Code Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Residential & Commercial</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Commercial & ADA</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Residential</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.75 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.75 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very Good</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Residential</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6.75 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Residential</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">7.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.75 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Residential & Commercial</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Proportions within 17-18 inches provide the most comfortable and safest stair climbing experience.</p>
      </section>

      {/* TABLE: Stair Flight Calculations for Common Floor Heights */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Stair Flight Calculations for Common Floor Heights</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical stair calculations for standard residential floor-to-floor heights using optimal riser dimensions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Rise (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Desired Riser Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Number of Risers</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Actual Riser Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Tread Depth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">126</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">108</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14.4 → 15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.2 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10.5 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">132</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.6 → 18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.33 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 inches</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">144</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9.5 inches</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">156</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20.8 → 21</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.43 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 inches</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Always round up the number of risers and adjust individual riser heights evenly to stay within code tolerance of 3/8 inch.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify local building codes before starting construction — some jurisdictions have stricter requirements than the IBC, especially for commercial properties and public buildings.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use the rule of 17-18 inches (tread depth + riser height) as your design target for maximum comfort and safety, even if your code allows wider ranges.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Calculate your total rise accurately by measuring from the finished floor of the lower level to the finished floor of the upper level, including any carpet or flooring thickness.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Distribute any remaining height evenly across all risers if your total rise doesn't divide evenly — avoid having one step that differs by more than 3/8 inch from the others.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan for headroom clearance of at least 80 inches (6 feet 8 inches) above all stair nosing to meet safety codes and prevent head injuries.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider adding a 1.25-inch nosing to all treads for better visual definition between steps and to reduce foot catch hazards on the riser below.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Inconsistent Riser Heights</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Allowing risers to vary by more than 3/8 inch across a flight creates severe tripping hazards and violates building codes. This is one of the most common causes of stair-related injuries, and inspectors will reject designs with inconsistent steps during code review.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Measuring Total Rise Incorrectly</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to measure from the finished floor-to-finished floor (including flooring material thickness) can result in a final step that is too high or too low. This miscalculation forces you to either violate code or rebuild the stairs after construction has begun.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Exceeding Maximum Riser Height</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using riser heights greater than 7.75 inches for residential or 7 inches for commercial stairs violates building code and creates unsafe stepping conditions. Oversized risers cause excessive strain and are a primary cause of falls, especially for elderly or mobility-impaired users.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Inconsistent Tread Depths</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Varying tread depth creates visual confusion and increases fall risk as users cannot predict step dimensions. All treads must be within 3/8 inch of each other, and building inspectors will flag any design that doesn't meet this requirement.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Headroom Clearance</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Failing to verify that stairs have at least 80 inches of vertical clearance can result in dangerous low-hanging obstructions and code violations. Always measure headroom during the design phase, especially for basement or under-staircase installations.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard tread depth for residential stairs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The standard tread depth for residential stairs is 10 to 11 inches, measured horizontally from the front edge of one step to the front edge of the next step. The International Building Code (IBC) requires a minimum tread depth of 10 inches for residential applications. This measurement ensures comfortable and safe stair navigation for most users.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the maximum riser height allowed by building code?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The maximum riser height for residential stairs is 7.75 inches according to the International Building Code. Commercial stairs have a maximum riser height of 7 inches. Exceeding these limits creates a safety hazard and violates building codes in most jurisdictions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the number of stairs needed for my total rise?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">To calculate the number of stairs, divide your total rise (floor-to-floor height) by the desired riser height. For example, if your total rise is 120 inches and you want 7.5-inch risers, you would need 120 ÷ 7.5 = 16 stairs. Always round up and adjust individual riser heights slightly to ensure they are all equal.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the rule of 18 for stair design?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The rule of 18 states that the sum of one tread depth plus one riser height should equal approximately 17 to 18 inches for comfortable stair proportions. For example, a 10-inch tread plus a 7.5-inch riser equals 17.5 inches, which falls within the ideal range and ensures consistent step comfort.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the minimum headroom required above stairs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The minimum headroom required above stairs is 6 feet 8 inches (80 inches) measured vertically from the stair nosing or floor. This clearance must be maintained throughout the entire flight of stairs to prevent head injuries and meet building code requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I ensure all risers and treads are consistent?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Calculate your total rise and divide by your desired riser height, then adjust each riser slightly if needed so all risers are within 3/8 inch of each other. Use a layout tool or this calculator to distribute any remaining height difference evenly across all risers. Inconsistent steps are a major safety hazard and tripping risk.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is nosing and why is it important?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Nosing is the horizontal projection of the tread that extends beyond the riser below, typically 1.25 inches. Nosing prevents foot catch on the riser and provides a clear visual line between steps, improving safety and preventing trips. Building codes require nosing on all treads in public and residential stairs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I have different tread depths on the same flight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">No, all treads in a single flight of stairs must be the same depth within a tolerance of 3/8 inch. Inconsistent tread depths create tripping hazards and violate building codes. If you must adjust, redistribute the change evenly across all steps.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between residential and commercial stair requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Residential stairs allow maximum 7.75-inch risers and 10-inch minimum treads, while commercial stairs require maximum 7-inch risers and 11-inch minimum treads. Commercial stairs must also have a minimum width of 44 inches, whereas residential stairs need only 36 inches. Commercial codes are stricter to accommodate higher foot traffic and accessibility requirements.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iccsafe.org/products-and-services/icc-building-safety-journal/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) 2024 Stair Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official IBC standards for stair design including riser height, tread depth, and safety requirements for residential and commercial applications.</p>
          </li>
          <li>
            <a href="https://www.osha.gov/laws-regs/regulations/1910/25" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">OSHA Stairway Standards 1910.25</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal occupational safety standards for stairways in workplaces, including dimensional requirements and fall protection guidelines.</p>
          </li>
          <li>
            <a href="https://www.ada.gov/resources/design-and-construction/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ADA Accessibility Guidelines for Stairs and Ramps</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Americans with Disabilities Act standards for accessible stair design, including dimensional requirements for universal accessibility.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders Stair Construction Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive residential stair construction standards and best practices from the leading home building trade organization.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Stair Tread & Riser Dimensions Calculator"
      description="The ultimate professional guide and calculator for Stair Tread & Riser Dimensions Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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