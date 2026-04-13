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

export default function ConcreteFootingFoundationCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "",
    rebarRows: "0",
    waste: "10",
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for bag yields (volume per bag in cubic meters or cubic feet)
  // Standard bag: 40 kg ~ 0.022 m3 (approx 0.78 ft3)
  // Large bag: 50 kg ~ 0.027 m3 (approx 0.95 ft3)
  const bagYieldMetric = {
    standard: 0.022,
    large: 0.027,
  };
  const bagYieldImperial = {
    standard: 0.78,
    large: 0.95,
  };

  const results = useMemo(() => {
    // Parse inputs
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const rebarRows = parseInt(inputs.rebarRows);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerBag = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(depth) ||
      length <= 0 ||
      width <= 0 ||
      depth <= 0
    ) {
      return {
        mainQty: "0 Bags",
        cost: "$0.00",
        details: "Please enter valid positive dimensions.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate volume (m3 or ft3)
    let volume = length * width * depth;

    // Add volume for rebar rows (assuming each rebar row adds 0.01 m3 or 0.35 ft3)
    // This is an approximation to account for extra concrete around rebar
    const rebarVolumeAddMetric = 0.01; // m3 per row
    const rebarVolumeAddImperial = 0.35; // ft3 per row
    if (rebarRows > 0) {
      volume +=
        unit === "metric"
          ? rebarRows * rebarVolumeAddMetric
          : rebarRows * rebarVolumeAddImperial;
    }

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Calculate bags needed
    const bagYield =
      unit === "metric"
        ? bagYieldMetric[materialSize]
        : bagYieldImperial[materialSize];
    const bagsNeeded = Math.ceil(volumeWithWaste / bagYield);

    // Calculate cost if price given
    const cost =
      !isNaN(pricePerBag) && pricePerBag > 0
        ? `$${(bagsNeeded * pricePerBag).toFixed(2)}`
        : "$0.00";

    // Details string
    const details = `Raw volume: ${volume.toFixed(
      3
    )} ${unit === "metric" ? "m³" : "ft³"} + Waste: ${wastePercent}%`;

    return {
      mainQty: `${bagsNeeded} Bags`,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [
    inputs.length,
    inputs.width,
    inputs.depth,
    inputs.rebarRows,
    inputs.waste,
    inputs.price,
    inputs.unit,
    inputs.materialSize,
  ]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How much concrete do I need for a standard residential foundation?",
      answer: "The amount depends on your foundation dimensions and depth. For a typical 2,000 sq ft single-story home with a 4-inch concrete slab foundation, you'll need approximately 30-35 cubic yards of concrete. A basement foundation for the same home requires 50-60 cubic yards. Use the calculator by entering your length, width, and depth in feet to get an accurate cubic yardage estimate for your specific project.",
    },
    {
      question: "What is the difference between a footing and a foundation?",
      answer: "A footing is the lowest structural element that distributes the building's weight into the soil, typically made of concrete and steel reinforcement. A foundation is the broader structure that rests on footings and supports the entire building above ground. Footings are generally narrower and deeper (12-48 inches wide, 24-48 inches deep), while foundations can be slabs, crawlspaces, or basements extending further horizontally.",
    },
    {
      question: "How deep should concrete footings be in my area?",
      answer: "Frost line depth varies by geographic location and determines minimum footing depth to prevent frost heave damage. Northern climates like Minnesota and Wisconsin require footings 48-60 inches deep, while southern states like Florida and Texas need only 12-24 inches. Check your local building codes or use the USDA frost line map to determine your area's requirements before calculating footing volume.",
    },
    {
      question: "How do I calculate concrete volume for an irregular-shaped foundation?",
      answer: "For L-shaped or other irregular foundations, break the area into rectangular sections and calculate each section separately. For example, an L-shaped foundation can be divided into two rectangles—calculate the volume for each, then add them together. The calculator supports multiple section inputs, allowing you to input each rectangular portion's dimensions individually for accurate total concrete requirements.",
    },
    {
      question: "What concrete strength do I need for residential footings?",
      answer: "Residential foundations typically require 3,000 PSI (pounds per square inch) concrete, which is the standard for most building codes. For heavy-load applications or freeze-thaw climates, 3,500-4,000 PSI concrete is recommended. Confirm your local building code requirements, as PSI specifications affect both concrete cost and long-term durability of your foundation.",
    },
    {
      question: "How much does concrete cost per cubic yard?",
      answer: "As of 2025, ready-mix concrete costs between $150-$200 per cubic yard for standard 3,000 PSI concrete, depending on location and market conditions. Rural areas may cost $120-$160, while major metropolitan areas can reach $200-$250 per cubic yard. Once you calculate total cubic yardage needed, multiply by your local price per yard to estimate total material cost for your project.",
    },
    {
      question: "How much rebar or wire mesh do I need for my concrete foundation?",
      answer: "Standard residential foundations typically require #4 rebar spaced 12-18 inches on center both ways, or 6x6 wire mesh with 10-gauge wires. For a 4-inch slab foundation of 2,000 sq ft, expect 8-12 tons of rebar or approximately 30-40 sheets of wire mesh. The calculator provides concrete volume; consult reinforcement tables or a structural engineer to determine exact reinforcement quantities for your specific design.",
    },
    {
      question: "What's the difference between a slab-on-grade and a basement foundation calculation?",
      answer: "A slab-on-grade is typically 4-6 inches thick and covers the entire building footprint, requiring less material than basement foundations. Basement foundations include walls (8-12 inches thick) extending 8-10 feet below grade plus a 4-6 inch floor slab, requiring significantly more concrete. For a 2,000 sq ft home, a slab requires 30-35 cubic yards while a basement requires 80-100+ cubic yards.",
    },
    {
      question: "How long does concrete take to cure before building on my foundation?",
      answer: "Concrete reaches 50% strength in 3-7 days and 90% strength in 14-28 days, depending on temperature and concrete mix design. For light framing, you can typically build after 7 days, but heavy loads should wait 28 days for full curing. Cold weather (below 50°F) significantly slows curing time, potentially doubling the timeline. Plan your construction schedule accordingly once your concrete is poured.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a concrete footing for a small shed foundation. You measure the footing to be 3 meters long, 0.5 meters wide, and 0.4 meters deep. You plan to use standard 40 kg concrete bags and want to include 2 rows of rebar for reinforcement. You also want to add a 10% waste margin to be safe.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: 3 m × 0.5 m × 0.4 m = 0.6 m³ of concrete needed.",
      },
      {
        label: "2. Add Rebar Volume",
        explanation:
          "Add volume for 2 rebar rows: 2 × 0.01 m³ = 0.02 m³. Total volume = 0.62 m³.",
      },
      {
        label: "3. Add Waste Margin",
        explanation:
          "Add 10% waste: 0.62 m³ × 1.10 = 0.682 m³ total concrete volume.",
      },
      {
        label: "4. Calculate Bags",
        explanation:
          "Each standard bag yields 0.022 m³. Bags needed = 0.682 ÷ 0.022 ≈ 31 bags.",
      },
    ],
    result: "Final Order: 31 Bags of standard 40 kg concrete mix.",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth + (Rebar Rows × Rebar Volume) + Waste Margin",
    variables: [
      { symbol: "L", description: "Length of the footing area" },
      { symbol: "W", description: "Width of the footing area" },
      { symbol: "D", description: "Depth or thickness of the footing" },
      {
        symbol: "R",
        description:
          "Number of rebar rows (each adds approx. 0.01 m³ or 0.35 ft³ of concrete)",
      },
      {
        symbol: "Waste",
        description:
          "Waste margin percentage added to total volume to account for spillage and errors",
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

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 3.0"
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
            placeholder="e.g. 0.5"
          />
        </div>
        <div className="space-y-2">
          <Label>Depth ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.4"
          />
        </div>
        <div className="space-y-2">
          <Label>Rebar Rows</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={inputs.rebarRows}
            onChange={(e) => handleInputChange("rebarRows", e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Bag Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard 40 kg</SelectItem>
              <SelectItem value="large">Large 50 kg</SelectItem>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Concrete Footing &amp; Foundation Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Concrete Footing &amp; Foundation Calculator helps you determine the exact amount of concrete needed for residential and commercial foundation projects. Accurate concrete volume calculations are essential for budgeting material costs, scheduling concrete deliveries, and ensuring you order the correct amount—too little creates costly delays and quality issues, while excess concrete is wasted expense. This calculator streamlines the planning process by converting your foundation dimensions into cubic yards, the standard measurement for ready-mix concrete ordering.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your foundation dimensions: length and width (in feet) for the overall footprint, and depth (in feet) for how deep your footings extend below grade. For slab foundations, enter the slab thickness (typically 4-6 inches). If your foundation is irregular or L-shaped, calculate each rectangular section separately and add the results together. The calculator also allows you to input the number of individual footings or piers and their dimensions if you're working with a pier-and-beam system.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display total cubic yards needed and, depending on the calculator version, may provide cost estimates based on current concrete pricing in your area. Once you have cubic yardage, multiply by your local ready-mix concrete price (typically $150-$200 per cubic yard in 2025) to estimate total material cost. Always add 5-10% extra to account for spillage, uneven subgrades, and rounding up to the nearest half-yard when ordering from concrete suppliers.</p>
        </div>
      </section>

      {/* TABLE: Concrete Foundation Requirements by Climate Zone */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Concrete Foundation Requirements by Climate Zone</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Frost line depth and concrete strength specifications vary significantly across U.S. climate zones and directly impact footing depth calculations.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Climate Zone</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Frost Line Depth (inches)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Concrete Strength</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Regional Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Deep Frost (Zone 1-2)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48-60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,500 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minnesota, Wisconsin, Michigan</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate Frost (Zone 3-4)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-48</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Ohio, Pennsylvania, New York</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Light Frost (Zone 5-6)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Virginia, Maryland, North Carolina</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Minimal Frost (Zone 7-8)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-24</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Georgia, South Carolina, Texas</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">No Frost (Zone 9-10)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0-12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,500 PSI</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Florida, Southern California, Hawaii</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Consult local building codes and the USDA frost line map before finalizing footing depth. Frost line depths may vary within zones based on soil composition and elevation.</p>
      </section>

      {/* TABLE: Concrete Volume Estimates for Common Residential Foundations */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Concrete Volume Estimates for Common Residential Foundations</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">These estimates show typical concrete quantities needed for standard residential foundation types based on 2,000 square foot home footprints.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Foundation Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Depth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Footing Size</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Cubic Yards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4-inch Slab-on-Grade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-35</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6-inch Slab-on-Grade</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">N/A</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">45-50</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Stem Wall + 4-inch Slab</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16x24 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50-60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Full Basement (8-foot depth)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">96 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24x48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">100-120</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Crawlspace Foundation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16x24 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60-75</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pier & Beam Foundation</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24x24 inches (per pier)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-25 (per pier)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actual requirements vary based on soil bearing capacity, local frost line depth, and structural design loads. Always verify with local building codes and engineer specifications.</p>
      </section>

      {/* TABLE: Concrete Material and Cost Breakdown (2025 Estimates) */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Concrete Material and Cost Breakdown (2025 Estimates)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Average material costs and pricing for concrete foundation projects vary by region and concrete specifications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Item</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Per Unit</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Quantity (2,000 sq ft home)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ready-Mix Concrete (3,000 PSI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$150-$200/cubic yard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 cubic yards</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,000-$8,000</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">#4 Rebar</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.65-$0.85/pound</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10,000 pounds</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6,500-$8,500</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6x6 Wire Mesh</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40-$50/sheet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35 sheets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,400-$1,750</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gravel/Subbase</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15-$25/ton</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 tons</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$225-$375</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Labor (if contracted)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45-$75/hour</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-300 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$9,000-$22,500</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs vary significantly by region, with major metropolitan areas typically 15-30% higher than rural areas. Obtain local quotes for accurate budgeting.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always check your local building code for minimum footing depth requirements before using the calculator—frost line depth varies dramatically by region, from 12 inches in Florida to 60 inches in Minnesota, and undersizing footings can lead to costly foundation failure.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for site conditions when ordering concrete: add 10% extra to your calculated volume if the subgrade is uneven, and request a smaller truck load (typically 10 cubic yards) if your property has limited access or tight spaces to prevent spillage and delivery issues.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Confirm concrete strength (PSI) requirements with your engineer or building department before ordering—most residential projects use 3,000 PSI, but freeze-thaw climates and heavy-load designs require 3,500-4,000 PSI, affecting both cost and performance.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Schedule your concrete pour during optimal weather conditions: temperatures between 50-85°F produce fastest curing, while cold weather (&lt;50°F) significantly extends cure time and may require additives, potentially increasing costs by 15-25%.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Footing Width</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many DIYers calculate only the slab thickness but forget that footings are typically 12-24 inches wider than the stem wall, requiring additional concrete volume. Always include footing width in your depth calculation to avoid underestimating material needs by 20-30%.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Measurements in Different Units Without Converting</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mixing feet and inches in your inputs causes significant calculation errors—convert everything to feet (or inches, then convert to feet) before inputting. A common mistake is entering footing width as 16 inches without converting to 1.33 feet, leading to underbidding by hundreds of dollars.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Neglecting Site-Specific Frost Line Depth</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using generic footing depths instead of your area's actual frost line requirement is a major mistake that can result in foundation failure within 5-10 years. Verify frost line depth with your local building department or soil engineer—it varies from 0 inches in southern states to 60+ inches in northern climates.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Calculating Only Horizontal Slab Area Without Vertical Wall Volume</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">For stem wall or basement foundations, overlooking the vertical concrete volume in foundation walls can underestimate total concrete needs by 40-60%. Ensure your calculator input includes both the slab thickness and the full height and thickness of any vertical foundation walls.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much concrete do I need for a standard residential foundation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The amount depends on your foundation dimensions and depth. For a typical 2,000 sq ft single-story home with a 4-inch concrete slab foundation, you'll need approximately 30-35 cubic yards of concrete. A basement foundation for the same home requires 50-60 cubic yards. Use the calculator by entering your length, width, and depth in feet to get an accurate cubic yardage estimate for your specific project.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between a footing and a foundation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A footing is the lowest structural element that distributes the building's weight into the soil, typically made of concrete and steel reinforcement. A foundation is the broader structure that rests on footings and supports the entire building above ground. Footings are generally narrower and deeper (12-48 inches wide, 24-48 inches deep), while foundations can be slabs, crawlspaces, or basements extending further horizontally.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How deep should concrete footings be in my area?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Frost line depth varies by geographic location and determines minimum footing depth to prevent frost heave damage. Northern climates like Minnesota and Wisconsin require footings 48-60 inches deep, while southern states like Florida and Texas need only 12-24 inches. Check your local building codes or use the USDA frost line map to determine your area's requirements before calculating footing volume.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate concrete volume for an irregular-shaped foundation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For L-shaped or other irregular foundations, break the area into rectangular sections and calculate each section separately. For example, an L-shaped foundation can be divided into two rectangles—calculate the volume for each, then add them together. The calculator supports multiple section inputs, allowing you to input each rectangular portion's dimensions individually for accurate total concrete requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What concrete strength do I need for residential footings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Residential foundations typically require 3,000 PSI (pounds per square inch) concrete, which is the standard for most building codes. For heavy-load applications or freeze-thaw climates, 3,500-4,000 PSI concrete is recommended. Confirm your local building code requirements, as PSI specifications affect both concrete cost and long-term durability of your foundation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does concrete cost per cubic yard?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2025, ready-mix concrete costs between $150-$200 per cubic yard for standard 3,000 PSI concrete, depending on location and market conditions. Rural areas may cost $120-$160, while major metropolitan areas can reach $200-$250 per cubic yard. Once you calculate total cubic yardage needed, multiply by your local price per yard to estimate total material cost for your project.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much rebar or wire mesh do I need for my concrete foundation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard residential foundations typically require #4 rebar spaced 12-18 inches on center both ways, or 6x6 wire mesh with 10-gauge wires. For a 4-inch slab foundation of 2,000 sq ft, expect 8-12 tons of rebar or approximately 30-40 sheets of wire mesh. The calculator provides concrete volume; consult reinforcement tables or a structural engineer to determine exact reinforcement quantities for your specific design.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between a slab-on-grade and a basement foundation calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A slab-on-grade is typically 4-6 inches thick and covers the entire building footprint, requiring less material than basement foundations. Basement foundations include walls (8-12 inches thick) extending 8-10 feet below grade plus a 4-6 inch floor slab, requiring significantly more concrete. For a 2,000 sq ft home, a slab requires 30-35 cubic yards while a basement requires 80-100+ cubic yards.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How long does concrete take to cure before building on my foundation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Concrete reaches 50% strength in 3-7 days and 90% strength in 14-28 days, depending on temperature and concrete mix design. For light framing, you can typically build after 7 days, but heavy loads should wait 28 days for full curing. Cold weather (below 50°F) significantly slows curing time, potentially doubling the timeline. Plan your construction schedule accordingly once your concrete is poured.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nist.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Building Foundation Design and Construction</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">NIST provides technical guidelines for foundation design, frost line research, and concrete performance standards used by building professionals.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ICC maintains comprehensive building codes including foundation depth, concrete strength, and reinforcement requirements that vary by geographic zone.</p>
          </li>
          <li>
            <a href="https://www.usda.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">USDA Frost Line Depth Map</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">USDA provides the national frost line depth map essential for determining minimum footing depths in your specific geographic location.</p>
          </li>
          <li>
            <a href="https://www.concrete.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">American Concrete Institute (ACI) Foundation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ACI publishes technical standards for concrete mix design, strength specifications (PSI ratings), and reinforcement placement for residential and commercial foundations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Concrete Footing & Foundation Calculator"
      description="The ultimate professional guide and calculator for Concrete Footing & Foundation Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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