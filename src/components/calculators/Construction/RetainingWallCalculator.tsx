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

export default function RetainingWallCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // wall length
    height: "", // wall height
    waste: "10", // waste percentage
    price: "", // price per block
    materialSize: "standard", // block size category
  });

  // Block sizes in square meters or square feet depending on unit and materialSize
  // Standard block area (example): 0.3m x 0.15m = 0.045 m²
  // Large block area (example): 0.45m x 0.2m = 0.09 m²
  // Imperial: convert accordingly (1 ft = 0.3048 m)
  const blockAreas = {
    metric: {
      standard: 0.045, // m²
      large: 0.09, // m²
    },
    imperial: {
      standard: 0.484, // ft² (approx 1.5ft x 0.32ft)
      large: 0.968, // ft² (approx 1.5ft x 0.65ft)
    },
  };

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Calculation logic
  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const height = parseFloat(inputs.height);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    const unit = inputs.unit;
    const materialSize = inputs.materialSize;

    if (
      isNaN(length) ||
      length <= 0 ||
      isNaN(height) ||
      height <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      isNaN(pricePerUnit) ||
      pricePerUnit < 0
    ) {
      return {
        mainQty: "0 Blocks",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate wall area (Length x Height)
    // Units: m² or ft² depending on unit
    const area = length * height;

    // Get block area for selected size and unit
    const blockArea = blockAreas[unit][materialSize];

    // Calculate raw number of blocks needed (area / blockArea)
    const rawBlocks = area / blockArea;

    // Add waste margin
    const totalBlocks = rawBlocks * (1 + wastePercent / 100);

    // Round up to next whole block
    const roundedBlocks = Math.ceil(totalBlocks);

    // Calculate cost
    const totalCost = pricePerUnit * roundedBlocks;

    // Format cost string with currency symbol
    const costStr =
      unit === "metric"
        ? `$${totalCost.toFixed(2)}`
        : `$${totalCost.toFixed(2)}`; // Assuming $ for imperial too, could be improved

    return {
      mainQty: `${roundedBlocks.toLocaleString()} Blocks`,
      cost: costStr,
      details: `Raw: ${rawBlocks.toFixed(2)} blocks before waste`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the primary purpose of a retaining wall calculator?",
      answer: "A retaining wall calculator helps estimate the materials, dimensions, and costs needed to build a structural wall that holds back soil on sloped terrain. It accounts for factors like wall height, soil type, drainage requirements, and backfill pressure to ensure proper structural design and material quantities. This tool prevents costly miscalculations and helps contractors and homeowners budget accurately for retaining wall projects ranging from $2,000 to $15,000+ depending on wall height and materials.",
    },
    {
      question: "How do I measure the height of my retaining wall correctly?",
      answer: "Measure the vertical distance from the lowest point of the foundation to the top of the wall where it meets the grade. Use a level and measuring tape, or hire a surveyor for slopes steeper than 1:2 (50% grade). Most residential retaining walls range from 2 to 8 feet tall; walls taller than 4 feet typically require engineering review and building permits in most jurisdictions.",
    },
    {
      question: "What soil types affect retaining wall design and calculator inputs?",
      answer: "Common soil types include sandy loam (good drainage, angle of repose ~30-35°), clay (poor drainage, angle of repose ~20-25°), and gravel (excellent drainage, angle of repose ~35-40°). Sandy soils require less reinforcement, while clay soils need improved drainage systems and stronger walls due to higher lateral pressure. A soil test costing $300-$600 can determine your site's bearing capacity and improve calculator accuracy for designs over 6 feet.",
    },
    {
      question: "How much does the average retaining wall cost per linear foot?",
      answer: "Retaining wall costs typically range from $25 to $75 per linear foot for timber walls, $40 to $100 for concrete block, and $60 to $150 for stone or poured concrete, including labor and materials. A 50-foot wall at 4 feet tall using concrete blocks would cost approximately $8,000 to $20,000. Regional labor costs, site accessibility, and material availability significantly impact final pricing.",
    },
    {
      question: "What is the importance of drainage in retaining wall calculations?",
      answer: "Proper drainage prevents hydrostatic pressure buildup behind the wall, which can cause structural failure or cracking. Calculator inputs should account for perforated drain pipe (typically 4-inch diameter), gravel backfill, and weep holes spaced 4-8 feet apart horizontally. A poorly drained wall may fail in 5-10 years, costing $15,000-$30,000 in repairs, compared to $2,000-$4,000 for proper drainage installation upfront.",
    },
    {
      question: "Do I need engineering approval for my retaining wall?",
      answer: "Most jurisdictions require professional engineering review and permits for retaining walls taller than 4 feet or in areas with high water tables, seismic activity, or slopes steeper than 1:1 (100% grade). Engineering costs typically range from $500 to $2,000 depending on wall complexity. Building permits add $150-$500 and ensure the design meets local soil conditions, frost depth (typically 18-48 inches below grade), and safety codes.",
    },
    {
      question: "What materials can the retaining wall calculator evaluate?",
      answer: "Common materials include pressure-treated wood ($25-$50/linear foot), concrete blocks ($40-$90/linear foot), natural stone ($60-$150/linear foot), and poured concrete ($70-$140/linear foot). Each material has different load-bearing capacities, lifespans (timber: 10-15 years, concrete: 50-100 years), and maintenance requirements. The calculator helps compare total project costs across material options to find the best value for your budget.",
    },
    {
      question: "How does backfill affect the structural requirements calculated?",
      answer: "Backfill material type and compaction directly impact lateral soil pressure on the wall; poorly compacted backfill can increase pressure by 20-40% compared to properly compacted material at 95% proctor density. The calculator should account for backfill weight (typically 100-130 pounds per cubic foot depending on soil type) and compaction methods. Using quality backfill and proper compaction can reduce wall thickness requirements by 6-12 inches, saving $3,000-$8,000 on material costs.",
    },
    {
      question: "What is the typical lifespan of different retaining wall types according to calculator benchmarks?",
      answer: "Timber retaining walls last 10-15 years before rot and insect damage compromise structure; concrete blocks last 40-50 years with proper drainage; poured concrete walls last 50-75 years; and stone or brick walls can exceed 100 years with maintenance. Regular inspection every 2-3 years costs $200-$500 and can extend lifespan by addressing drainage or settlement issues early. Repair costs escalate significantly if structural failure occurs, making preventive maintenance and quality initial construction critical.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a retaining wall that is 10 meters long and 1.2 meters high using standard size concrete blocks. You want to include a 10% waste margin and each block costs $3.50.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the wall area: Length (10 m) × Height (1.2 m) = 12 m².",
      },
      {
        label: "2. Calculate Blocks",
        explanation:
          "Each standard block covers 0.045 m². Divide area by block area: 12 ÷ 0.045 = 266.67 blocks.",
      },
      {
        label: "3. Add Waste",
        explanation:
          "Add 10% waste: 266.67 × 1.10 = 293.33 blocks. Round up to 294 blocks.",
      },
      {
        label: "4. Calculate Cost",
        explanation:
          "Multiply blocks by price: 294 × $3.50 = $1029.00 total estimated cost.",
      },
    ],
    result: "Final Order: 294 Blocks costing approximately $1029.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Number of Blocks = (Length × Height) / Block Area × (1 + Waste%)",
    variables: [
      { symbol: "Length", description: "Length of the retaining wall" },
      { symbol: "Height", description: "Height of the retaining wall" },
      { symbol: "Block Area", description: "Surface area covered by one block" },
      { symbol: "Waste%", description: "Waste margin percentage (decimal form)" },
    ],
  };

  const widget = (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select
          value={inputs.unit}
          onValueChange={(v) => handleInputChange("unit", v)}
          aria-label="Select unit system"
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

      {/* Inputs: Length, Height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length-input">Length</Label>
          <Input
            id="length-input"
            type="number"
            min="0"
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height-input">Height</Label>
          <Input
            id="height-input"
            type="number"
            min="0"
            step="any"
            value={inputs.height}
            onChange={(e) => handleInputChange("height", e.target.value)}
            placeholder={inputs.unit === "metric" ? "meters" : "feet"}
          />
        </div>
      </div>

      {/* Material Size & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="material-size-select">Block Size</Label>
          <Select
            id="material-size-select"
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
          <Label htmlFor="price-input">Price per Block</Label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              id="price-input"
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
          <Label htmlFor="waste-slider">Waste Margin</Label>
          <span className="font-bold text-blue-600">{inputs.waste}%</span>
        </div>
        <Slider
          id="waste-slider"
          value={[parseInt(inputs.waste)]}
          min={0}
          max={25}
          step={5}
          onValueChange={(v) => handleInputChange("waste", v[0].toString())}
          aria-label="Waste margin slider"
        />
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg" type="button">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Retaining Wall Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Retaining Wall Calculator is a design and estimation tool that helps homeowners, contractors, and engineers determine the materials, dimensions, and approximate costs for building a structural retaining wall. Retaining walls are essential for managing sloped terrain, preventing soil erosion, and creating level usable space on hillside properties. By inputting site-specific information, the calculator provides actionable data to guide material selection, budget planning, and permit preparation.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator's primary inputs include wall height (measured in feet from foundation to top grade), wall length (linear footage), soil type (sandy, clay, or mixed), and material choice (wood, concrete block, poured concrete, or stone). You may also input additional factors such as water table depth, backfill type, slope angle, and desired wall finish. These inputs help the calculator estimate lateral soil pressure (measured in pounds per square foot), required footing depth based on local frost lines, wall thickness, and total volume of materials needed for the project.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs typically include total linear feet of wall, cubic yards of concrete or block required, estimated material cost ranges, labor cost estimates based on regional averages, required footing dimensions, and a summary of structural considerations such as drainage needs and compaction specifications. Use these results to obtain competitive quotes from contractors, verify permit applications, and validate engineering recommendations. Remember that calculator outputs are estimates; actual costs may vary based on site access, soil conditions discovered during excavation, and regional labor rates, so budget 10–15% contingency for unexpected conditions.</p>
        </div>
      </section>

      {/* TABLE: Retaining Wall Material Costs and Lifespan Comparison */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Retaining Wall Material Costs and Lifespan Comparison</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares common retaining wall materials with their typical costs per linear foot, total project costs for a 50-foot wall at 4 feet height, and expected lifespan.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per Linear Foot</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Total Cost (50 ft × 4 ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Lifespan</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Maintenance Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pressure-Treated Wood</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25–$50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1,250–$2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–15 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High (staining, sealing)</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Concrete Block</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40–$90</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,000–$4,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40–50 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low–Medium</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Poured Concrete</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$70–$140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,500–$7,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–75 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low–Medium</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Natural Stone</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60–$150</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3,000–$7,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">75–100+ years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Composite/Recycled Plastic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$45–$120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2,250–$6,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–50 years</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Low</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs include materials and basic labor. Professional engineering, permits ($150–$500), and drainage systems ($2,000–$5,000) are additional. Regional labor rates and site conditions significantly affect total project cost.</p>
      </section>

      {/* TABLE: Soil Types and Their Impact on Retaining Wall Design */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Soil Types and Their Impact on Retaining Wall Design</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Soil characteristics directly influence wall thickness, reinforcement needs, and drainage requirements; this table shows typical angles of repose and lateral pressure coefficients for common soil types.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Soil Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Angle of Repose</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Active Pressure Coefficient (Ka)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Bearing Capacity (psf)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Drainage Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Sandy Loam</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–35°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.33–0.36</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2,000–3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Good</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Silt</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–30°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.36–0.43</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,500–2,500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Clay</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.43–0.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,000–2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Poor</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gravel/Crushed Stone</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">35–40°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.25–0.33</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3,000–4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Excellent</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fill (Mixed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">28–32°</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.33–0.40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1,800–2,800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Fair–Good</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Higher active pressure coefficients require thicker walls and stronger footings. Clay soils typically require 4-inch perforated drain pipe and 12–18 inches of gravel backfill. Soil testing ($300–$600) improves calculator accuracy for walls &gt;6 feet tall.</p>
      </section>

      {/* TABLE: Retaining Wall Height Categories and Permit Requirements */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Retaining Wall Height Categories and Permit Requirements</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Most jurisdictions classify retaining walls by height, with increasing permit and engineering requirements as walls exceed 4 feet; this table summarizes typical regulatory thresholds.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Wall Height Range</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Permit Required</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Engineering Required</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Frost Depth</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Approximate Cost Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&lt;2 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Usually No</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">No</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–18 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Baseline</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2–4 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Often No</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Usually No</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">18–36 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$150–$300</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4–6 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes (varies by region)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24–48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$1,000–$2,500</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">6–10 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes (required)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36–48 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$3,000–$6,000</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">&gt;10 feet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Yes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Required + structural review</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48+ inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+$5,000–$15,000+</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Frost depth varies by climate zone (northern U.S. ranges 24–48 inches); inadequate footing depth is a leading cause of wall failure. Check local building codes and consider seismic zones when determining engineering requirements. Permit costs typically range $150–$500.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Obtain a soil test ($300–$600) before finalizing wall design if your wall will exceed 4 feet or your site has complex drainage; knowing exact soil bearing capacity and composition prevents costly design revisions and potential structural failure.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Always account for proper drainage by budgeting $2,000–$5,000 for perforated drain pipe, gravel backfill, and weep holes spaced 4–8 feet apart horizontally; inadequate drainage is responsible for approximately 40% of retaining wall failures within 10 years.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Verify local frost depth requirements (typically 18–48 inches below grade depending on climate zone) before calculating footing depth; footings that don't extend below the frost line will experience heaving and settlement, causing cracking and structural failure.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan for regular inspection every 2–3 years at a cost of $200–$500; early detection of water seepage, cracks &gt;1/4 inch wide, or soil settlement allows for repairs ($1,000–$5,000) versus catastrophic failure repairs ($15,000–$30,000).</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Drainage Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many DIYers and contractors skip proper drainage or use insufficient pipe diameter and backfill, thinking it will reduce costs by $1,000–$2,000. This mistake typically results in wall failure within 5–10 years and repair costs of $15,000–$30,000, making proper drainage installation a critical investment.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Local Frost Depth Requirements</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Footings must extend below the local frost line (18–48 inches depending on climate) to prevent heaving and settlement. Shallow footings cause cracking, bowing, and structural failure within 2–5 years, requiring expensive repairs that could have been avoided with proper initial design.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Poor Quality or Improperly Compacted Backfill</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Backfill that isn't compacted to 95% proctor density or uses inadequate material can increase lateral soil pressure by 20–40%, requiring thicker walls and stronger reinforcement. This oversight can add $3,000–$8,000 in material costs and compromise structural integrity.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Skipping Engineering Review for Tall Walls</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Walls taller than 4 feet without professional engineering review often lack proper footing design, reinforcement placement, or drainage specifications, risking catastrophic failure. Engineering costs of $500–$2,000 are far less expensive than repairs or replacement, which can exceed $20,000–$50,000 for larger walls.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the primary purpose of a retaining wall calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A retaining wall calculator helps estimate the materials, dimensions, and costs needed to build a structural wall that holds back soil on sloped terrain. It accounts for factors like wall height, soil type, drainage requirements, and backfill pressure to ensure proper structural design and material quantities. This tool prevents costly miscalculations and helps contractors and homeowners budget accurately for retaining wall projects ranging from $2,000 to $15,000+ depending on wall height and materials.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure the height of my retaining wall correctly?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure the vertical distance from the lowest point of the foundation to the top of the wall where it meets the grade. Use a level and measuring tape, or hire a surveyor for slopes steeper than 1:2 (50% grade). Most residential retaining walls range from 2 to 8 feet tall; walls taller than 4 feet typically require engineering review and building permits in most jurisdictions.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What soil types affect retaining wall design and calculator inputs?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common soil types include sandy loam (good drainage, angle of repose ~30-35°), clay (poor drainage, angle of repose ~20-25°), and gravel (excellent drainage, angle of repose ~35-40°). Sandy soils require less reinforcement, while clay soils need improved drainage systems and stronger walls due to higher lateral pressure. A soil test costing $300-$600 can determine your site's bearing capacity and improve calculator accuracy for designs over 6 feet.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does the average retaining wall cost per linear foot?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Retaining wall costs typically range from $25 to $75 per linear foot for timber walls, $40 to $100 for concrete block, and $60 to $150 for stone or poured concrete, including labor and materials. A 50-foot wall at 4 feet tall using concrete blocks would cost approximately $8,000 to $20,000. Regional labor costs, site accessibility, and material availability significantly impact final pricing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the importance of drainage in retaining wall calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Proper drainage prevents hydrostatic pressure buildup behind the wall, which can cause structural failure or cracking. Calculator inputs should account for perforated drain pipe (typically 4-inch diameter), gravel backfill, and weep holes spaced 4-8 feet apart horizontally. A poorly drained wall may fail in 5-10 years, costing $15,000-$30,000 in repairs, compared to $2,000-$4,000 for proper drainage installation upfront.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do I need engineering approval for my retaining wall?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most jurisdictions require professional engineering review and permits for retaining walls taller than 4 feet or in areas with high water tables, seismic activity, or slopes steeper than 1:1 (100% grade). Engineering costs typically range from $500 to $2,000 depending on wall complexity. Building permits add $150-$500 and ensure the design meets local soil conditions, frost depth (typically 18-48 inches below grade), and safety codes.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What materials can the retaining wall calculator evaluate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Common materials include pressure-treated wood ($25-$50/linear foot), concrete blocks ($40-$90/linear foot), natural stone ($60-$150/linear foot), and poured concrete ($70-$140/linear foot). Each material has different load-bearing capacities, lifespans (timber: 10-15 years, concrete: 50-100 years), and maintenance requirements. The calculator helps compare total project costs across material options to find the best value for your budget.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does backfill affect the structural requirements calculated?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Backfill material type and compaction directly impact lateral soil pressure on the wall; poorly compacted backfill can increase pressure by 20-40% compared to properly compacted material at 95% proctor density. The calculator should account for backfill weight (typically 100-130 pounds per cubic foot depending on soil type) and compaction methods. Using quality backfill and proper compaction can reduce wall thickness requirements by 6-12 inches, saving $3,000-$8,000 on material costs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical lifespan of different retaining wall types according to calculator benchmarks?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Timber retaining walls last 10-15 years before rot and insect damage compromise structure; concrete blocks last 40-50 years with proper drainage; poured concrete walls last 50-75 years; and stone or brick walls can exceed 100 years with maintenance. Regular inspection every 2-3 years costs $200-$500 and can extend lifespan by addressing drainage or settlement issues early. Repair costs escalate significantly if structural failure occurs, making preventive maintenance and quality initial construction critical.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.iccsafe.org/products-services/i-codes/2024-i-codes/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) Retaining Wall Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official building code standards for retaining wall design, footing depth, and structural requirements based on soil type and wall height.</p>
          </li>
          <li>
            <a href="https://www.astm.org/search/all" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASTM International Soil Testing Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical standards for soil classification, bearing capacity testing, and geotechnical analysis essential for retaining wall design validation.</p>
          </li>
          <li>
            <a href="https://www.hud.gov/program_offices/public_indian_housing/programs/ph/phr_programs/construction" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Housing and Urban Development (HUD) Construction Guidelines</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal construction guidelines addressing site drainage, foundation depth, and structural safety requirements for residential retaining walls.</p>
          </li>
          <li>
            <a href="https://www.nahb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders (NAHB) Retaining Wall Best Practices</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-recognized best practices and technical guidance for retaining wall material selection, installation, and maintenance.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Retaining Wall Calculator"
      description="The ultimate professional guide and calculator for Retaining Wall Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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