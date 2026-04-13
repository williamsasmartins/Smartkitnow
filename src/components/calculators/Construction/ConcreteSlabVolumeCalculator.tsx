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

export default function ConcreteSlabVolumeCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "",
    width: "",
    depth: "",
    gravelBase: "0", // thickness of gravel base in same units as depth
    waste: "10", // percent waste margin
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for bag yields (volume per bag in cubic meters or cubic feet)
  // Standard bag sizes: 40 lb (0.0113 m³) and 60 lb (0.017 m³) approx
  // For imperial, convert accordingly
  const bagYields = {
    metric: {
      standard: 0.0113, // cubic meters per bag (40 lb bag)
      large: 0.017, // cubic meters per bag (60 lb bag)
    },
    imperial: {
      standard: 0.4, // cubic feet per bag (40 lb bag)
      large: 0.6, // cubic feet per bag (60 lb bag)
    },
  };

  // Convert inputs to numbers
  const lengthNum = parseFloat(inputs.length);
  const widthNum = parseFloat(inputs.width);
  const depthNum = parseFloat(inputs.depth);
  const gravelNum = parseFloat(inputs.gravelBase);
  const wastePercent = parseFloat(inputs.waste);
  const priceNum = parseFloat(inputs.price);
  const unit = inputs.unit;
  const materialSize = inputs.materialSize;

  const results = useMemo(() => {
    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      isNaN(depthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      depthNum <= 0
    ) {
      return {
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Total depth includes gravel base if any
    const totalDepth = depthNum + (isNaN(gravelNum) ? 0 : gravelNum);

    // Calculate volume of concrete slab (excluding gravel base)
    // Gravel base is not concrete, so volume for concrete is length * width * depth only
    const concreteVolume = lengthNum * widthNum * depthNum; // in m³ or ft³

    // Calculate gravel volume if gravel base > 0
    const gravelVolume =
      gravelNum > 0 ? lengthNum * widthNum * gravelNum : 0;

    // Add waste margin to concrete volume
    const concreteVolumeWithWaste =
      concreteVolume * (1 + wastePercent / 100);

    // Calculate number of bags needed
    const bagYield = bagYields[unit][materialSize]; // volume per bag

    const bagsNeeded = Math.ceil(concreteVolumeWithWaste / bagYield);

    // Calculate cost if price is provided
    const cost =
      !isNaN(priceNum) && priceNum > 0
        ? `$${(bagsNeeded * priceNum).toFixed(2)}`
        : "N/A";

    // Details string
    const details = `Concrete Volume: ${concreteVolume.toFixed(
      3
    )} ${unit === "metric" ? "m³" : "ft³"} | Gravel Base: ${gravelVolume.toFixed(
      3
    )} ${unit === "metric" ? "m³" : "ft³"} | Bags Needed: ${bagsNeeded}`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    lengthNum,
    widthNum,
    depthNum,
    gravelNum,
    wastePercent,
    priceNum,
    unit,
    materialSize,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How do I calculate the volume of a concrete slab?",
      answer: "Concrete slab volume is calculated by multiplying length × width × depth (thickness), all measured in the same units. For example, a slab that is 20 feet long, 15 feet wide, and 4 inches (0.33 feet) thick would have a volume of 20 × 15 × 0.33 = 99 cubic feet. This calculator automates the conversion and multiplication to give you results in cubic yards, cubic feet, or cubic meters.",
    },
    {
      question: "Why should I convert my measurements to cubic yards?",
      answer: "Concrete is typically sold by the cubic yard in North America, making cubic yards the standard unit for ordering ready-mix concrete. One cubic yard equals 27 cubic feet, so converting your slab dimensions to cubic yards helps you order the exact amount needed and avoid over- or under-ordering. A typical residential driveway slab (10 feet × 20 feet × 4 inches) requires approximately 2.5 cubic yards of concrete.",
    },
    {
      question: "What thickness should my concrete slab be?",
      answer: "Concrete slab thickness depends on its intended use: residential driveways typically require 4 inches, garage floors need 4–6 inches, warehouse floors require 6–8 inches, and sidewalks are generally 4 inches thick. Thicker slabs provide better load-bearing capacity and durability, especially in areas with heavy traffic or freeze-thaw cycles. Always check local building codes for minimum thickness requirements in your area.",
    },
    {
      question: "How much does concrete cost per cubic yard?",
      answer: "As of 2024–2025, ready-mix concrete typically costs between $150–$200 per cubic yard for standard concrete, though prices vary by region and concrete grade. Premium finishes, air-entrained concrete for freeze-thaw protection, or reinforced concrete can cost $200–$250 per cubic yard. A 2.5 cubic yard driveway slab could therefore cost between $375–$625 in material alone.",
    },
    {
      question: "Should I add extra concrete for waste and spillage?",
      answer: "Yes, it is standard practice to add 5–10% extra concrete to your calculated volume to account for spillage, uneven subgrades, and measurement errors. For example, if your slab requires 10 cubic yards, ordering 10.5–11 cubic yards ensures you have enough material to complete the job without stopping for additional deliveries. This small overage is more economical than running short during the pour.",
    },
    {
      question: "What is the difference between cubic feet and cubic yards?",
      answer: "One cubic yard contains 27 cubic feet. If your concrete slab volume is 99 cubic feet, that equals 99 ÷ 27 = 3.67 cubic yards. Understanding this conversion is essential because concrete contractors quote prices per cubic yard, while some homeowners measure their projects in cubic feet or linear dimensions.",
    },
    {
      question: "How do I account for sloped or uneven concrete slabs?",
      answer: "For sloped slabs (such as driveways with pitch for drainage), calculate the average depth by measuring the thickness at the high end and low end, then use the average in your volume formula. For example, if one end is 4 inches and the other is 6 inches, use 5 inches as your average thickness. The calculator assumes uniform thickness, so manual adjustment is required for significantly sloped surfaces.",
    },
    {
      question: "What are common errors when measuring for a concrete slab?",
      answer: "Common errors include measuring in different units (feet vs. inches) without proper conversion, forgetting to account for slab thickness, rounding down when calculating volume, and not adding waste allowance. Many people also miscalculate the depth by confusing finished grade elevation with actual slab thickness. Always double-check measurements and perform a sanity check: a standard 10×20×4-inch slab should yield approximately 2.5 cubic yards.",
    },
    {
      question: "How does concrete strength relate to slab thickness?",
      answer: "Concrete strength is measured in PSI (pounds per square inch), typically ranging from 3,000 PSI for standard use to 4,000 PSI for driveways and 5,000+ PSI for industrial applications. Thicker slabs distribute loads over a larger area, reducing stress per square inch, but strength is primarily determined by concrete mix design rather than thickness alone. A 4-inch slab with 3,500 PSI concrete is generally adequate for residential driveways under normal conditions.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a concrete slab for a small patio measuring 4 meters long, 3 meters wide, and 0.15 meters thick, with a 0.05 meter gravel base underneath. You want to order standard 40 lb concrete bags and include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the concrete volume: 4m (L) × 3m (W) × 0.15m (D) = 1.8 m³",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 1.8 m³ × 1.10 = 1.98 m³ total concrete needed",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total volume by bag yield (0.0113 m³ per standard bag): 1.98 ÷ 0.0113 ≈ 175 bags",
      },
    ],
    result: "Final Order: 175 Bags of concrete",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the slab area" },
      { symbol: "W", description: "Width of the slab area" },
      { symbol: "D", description: "Depth or thickness of the slab" },
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
            placeholder="e.g. 4"
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
            placeholder="e.g. 3"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth (Slab Thickness) ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.15"
          />
        </div>
        <div className="space-y-2">
          <Label>Gravel Base Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.gravelBase}
            onChange={(e) => handleInputChange("gravelBase", e.target.value)}
            placeholder="e.g. 0.05"
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
              <SelectItem value="standard">Standard Size (40 lb)</SelectItem>
              <SelectItem value="large">Large Size (60 lb)</SelectItem>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Concrete Slab Volume Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Concrete Slab Volume Calculator is designed to help homeowners, contractors, and DIY enthusiasts quickly determine how much concrete is needed for any slab project. Accurate volume calculations prevent costly over-ordering or frustrating supply shortages during a pour. Whether you're planning a small patio, a residential driveway, or a large warehouse floor, this tool converts your linear measurements into the cubic yards needed to order ready-mix concrete.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input three key measurements: the length and width of your slab in feet or meters, and the thickness (depth) in inches or centimeters. The calculator accepts decimal values, so you can enter precise measurements like 20.5 feet or 10.25 inches. Make sure all measurements are in the same unit system, and always measure thickness uniformly; if your slab slopes, use the average thickness between the high and low points.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator will display your result in cubic feet, cubic yards, and cubic meters. Cubic yards is the standard unit for ordering ready-mix concrete in North America, so pay special attention to that result. It's best practice to add 5–10% to your calculated volume to account for spillage, uneven subgrades, and measurement uncertainties. For example, if the calculator shows 10 cubic yards, order 10.5–11 cubic yards to ensure you don't run short during the pour.</p>
        </div>
      </section>

      {/* TABLE: Recommended Concrete Slab Thickness by Application */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Recommended Concrete Slab Thickness by Application</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows standard slab thickness recommendations for different construction applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Application</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Thickness</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical PSI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Load Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sidewalks</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000–3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pedestrian</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Residential Driveway</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500–4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Light vehicle</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Garage Floor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500–4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Vehicle &amp; storage</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Warehouse Floor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6–8 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,000–5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy equipment</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Parking Lot</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5–6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,000–4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Regular vehicle traffic</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Patio/Deck</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000–3,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pedestrian</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Industrial Floor</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8–12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5,000–6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very heavy loads</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Airport Runway</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–18 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4,500–5,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Aircraft landing</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Foundation Slab</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4–6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500–4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Structural support</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Thickness requirements may vary by local building codes, soil conditions, and climate. Always consult local regulations.</p>
      </section>

      {/* TABLE: Concrete Volume Conversion Reference Chart */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Concrete Volume Conversion Reference Chart</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table helps convert slab dimensions into volume measurements across different units.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Slab Dimensions (L × W × D)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cubic Feet</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cubic Yards</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cubic Meters</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approximate Weight (lbs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 ft × 10 ft × 4 in</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">33.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.23</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.95</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,968</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10 ft × 20 ft × 4 in</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">66.7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.47</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7,937</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 ft × 20 ft × 4 in</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">133.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.94</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.80</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15,873</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20 ft × 30 ft × 4 in</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.41</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23,810</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 ft × 25 ft × 6 in</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">187.5</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.94</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22,313</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12 ft × 40 ft × 5 in</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.41</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">23,810</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 ft × 25 ft × 4 in</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">208.3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7.72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.94</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24,790</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30 ft × 40 ft × 6 in</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">22.22</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17.01</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">71,429</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Weight assumes standard concrete at 150 lbs per cubic foot. Reinforced or air-entrained concrete may vary slightly. Use cubic yards for ordering ready-mix concrete.</p>
      </section>

      {/* TABLE: Regional Concrete Pricing &amp; Volume Estimates (2024–2025) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Regional Concrete Pricing &amp; Volume Estimates (2024–2025)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical ready-mix concrete costs and estimated pricing for common residential slab projects by region.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Price per Cubic Yard</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10×20 ft Driveway (2.47 CY) Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">20×20 ft Patio (4.94 CY) Cost</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Delivery Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Northeast (US)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$180–$220</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$444–$544</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$889–$1,087</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$150</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Midwest (US)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$140–$180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$346–$446</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$692–$892</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$50–$100</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">South (US)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$130–$170</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$321–$420</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$642–$840</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40–$80</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">West Coast (US)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$190–$250</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$469–$618</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$938–$1,235</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$200</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Canada (Alberta)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$160–$210</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$395–$519</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$790–$1,038</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75–$125</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Canada (Ontario)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$180–$230</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$444–$568</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$888–$1,136</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$100–$150</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices are approximate and vary by local market conditions, concrete grade, reinforcement, and order size. Premium finishes add 10–20% to base costs.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure slab thickness at multiple points along the length and width, especially on sloped surfaces; use the average thickness in your calculation to account for uneven subgrades.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Add 5–10% waste allowance to your calculated volume before ordering concrete; a small overage is far cheaper than stopping mid-pour to order additional material.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Double-check your unit conversions: 1 cubic yard = 27 cubic feet, and 4 inches = 0.33 feet; using a calculator for this step prevents costly errors.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Order your ready-mix concrete for a time when your subgrade is prepared, weather is favorable, and you have enough labor or equipment on-site to place and finish the concrete within the truck's delivery window (typically 90–120 minutes).</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Confusing slab thickness with subgrade depth</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many people measure from the top of the soil to finished grade, then use that as slab thickness. Only measure the actual concrete slab thickness (typically 4–6 inches), not the excavation depth or soil preparation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to convert inches to feet before calculating</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">A common error is calculating with mixed units, such as using feet for length/width but leaving thickness in inches. Always convert everything to the same unit (usually feet or meters) before multiplying to avoid off-by-order-of-magnitude errors.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Rounding down the volume to save money</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Underestimating concrete volume by rounding down leads to incomplete pours and costly delays. It's better to round up or add 5–10% waste allowance; unused concrete is far cheaper than a second truck delivery.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring slope or pitch when measuring thickness</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Sloped driveways and pitched floors have variable thickness. Measuring at only one end will give inaccurate results; measure at both the high and low points, then average them for a more realistic volume calculation.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the volume of a concrete slab?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete slab volume is calculated by multiplying length × width × depth (thickness), all measured in the same units. For example, a slab that is 20 feet long, 15 feet wide, and 4 inches (0.33 feet) thick would have a volume of 20 × 15 × 0.33 = 99 cubic feet. This calculator automates the conversion and multiplication to give you results in cubic yards, cubic feet, or cubic meters.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why should I convert my measurements to cubic yards?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete is typically sold by the cubic yard in North America, making cubic yards the standard unit for ordering ready-mix concrete. One cubic yard equals 27 cubic feet, so converting your slab dimensions to cubic yards helps you order the exact amount needed and avoid over- or under-ordering. A typical residential driveway slab (10 feet × 20 feet × 4 inches) requires approximately 2.5 cubic yards of concrete.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What thickness should my concrete slab be?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete slab thickness depends on its intended use: residential driveways typically require 4 inches, garage floors need 4–6 inches, warehouse floors require 6–8 inches, and sidewalks are generally 4 inches thick. Thicker slabs provide better load-bearing capacity and durability, especially in areas with heavy traffic or freeze-thaw cycles. Always check local building codes for minimum thickness requirements in your area.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does concrete cost per cubic yard?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2024–2025, ready-mix concrete typically costs between $150–$200 per cubic yard for standard concrete, though prices vary by region and concrete grade. Premium finishes, air-entrained concrete for freeze-thaw protection, or reinforced concrete can cost $200–$250 per cubic yard. A 2.5 cubic yard driveway slab could therefore cost between $375–$625 in material alone.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I add extra concrete for waste and spillage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, it is standard practice to add 5–10% extra concrete to your calculated volume to account for spillage, uneven subgrades, and measurement errors. For example, if your slab requires 10 cubic yards, ordering 10.5–11 cubic yards ensures you have enough material to complete the job without stopping for additional deliveries. This small overage is more economical than running short during the pour.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between cubic feet and cubic yards?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">One cubic yard contains 27 cubic feet. If your concrete slab volume is 99 cubic feet, that equals 99 ÷ 27 = 3.67 cubic yards. Understanding this conversion is essential because concrete contractors quote prices per cubic yard, while some homeowners measure their projects in cubic feet or linear dimensions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for sloped or uneven concrete slabs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For sloped slabs (such as driveways with pitch for drainage), calculate the average depth by measuring the thickness at the high end and low end, then use the average in your volume formula. For example, if one end is 4 inches and the other is 6 inches, use 5 inches as your average thickness. The calculator assumes uniform thickness, so manual adjustment is required for significantly sloped surfaces.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What are common errors when measuring for a concrete slab?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common errors include measuring in different units (feet vs. inches) without proper conversion, forgetting to account for slab thickness, rounding down when calculating volume, and not adding waste allowance. Many people also miscalculate the depth by confusing finished grade elevation with actual slab thickness. Always double-check measurements and perform a sanity check: a standard 10×20×4-inch slab should yield approximately 2.5 cubic yards.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does concrete strength relate to slab thickness?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete strength is measured in PSI (pounds per square inch), typically ranging from 3,000 PSI for standard use to 4,000 PSI for driveways and 5,000+ PSI for industrial applications. Thicker slabs distribute loads over a larger area, reducing stress per square inch, but strength is primarily determined by concrete mix design rather than thickness alone. A 4-inch slab with 3,500 PSI concrete is generally adequate for residential driveways under normal conditions.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.concrete.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Concrete Institute (ACI) — Guide to Concrete Floor and Slab Construction</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards and best practices for concrete slab design, thickness requirements, and quality specifications.</p>
          </li>
          <li>
            <a href="https://www.rmca.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Ready Mixed Concrete Association — Concrete Specifications and Pricing</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Authoritative source on ready-mix concrete standards, delivery procedures, and regional pricing trends.</p>
          </li>
          <li>
            <a href="https://www.gsa.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. General Services Administration — Concrete Slab Design Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal guidelines for concrete slab specifications, load requirements, and construction standards for public facilities.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) — Concrete and Reinforcement</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National model building code requirements for concrete slab thickness, strength grades, and structural specifications by application type.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Slab Volume Calculator"
      description="The ultimate professional guide and calculator for Concrete Slab Volume Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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