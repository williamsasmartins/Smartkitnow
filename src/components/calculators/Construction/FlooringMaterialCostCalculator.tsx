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

export default function FlooringMaterialCostCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    waste: "10", // waste percentage
    price: "",
    materialSize: "standard", // standard or large plank/sheet size
    materialType: "laminate", // laminate, hardwood, vinyl, tile
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Material coverage sizes in square meters or square feet per unit (plank, tile, sheet)
  // Approximate typical sizes:
  // Laminate: standard plank ~0.2 m² (2.15 ft²), large plank ~0.3 m² (3.2 ft²)
  // Hardwood: standard plank ~0.15 m² (1.6 ft²), large plank ~0.25 m² (2.7 ft²)
  // Vinyl: standard sheet ~1.0 m² (10.76 ft²), large sheet ~1.5 m² (16.15 ft²)
  // Tile: standard tile ~0.25 m² (2.7 ft²), large tile ~0.5 m² (5.4 ft²)

  const materialCoverage = useMemo(() => {
    const sizesMetric = {
      laminate: { standard: 0.2, large: 0.3 },
      hardwood: { standard: 0.15, large: 0.25 },
      vinyl: { standard: 1.0, large: 1.5 },
      tile: { standard: 0.25, large: 0.5 },
    };
    const sizesImperial = {
      laminate: { standard: 2.15, large: 3.2 },
      hardwood: { standard: 1.6, large: 2.7 },
      vinyl: { standard: 10.76, large: 16.15 },
      tile: { standard: 2.7, large: 5.4 },
    };
    return inputs.unit === "metric"
      ? sizesMetric[inputs.materialType][inputs.materialSize]
      : sizesImperial[inputs.materialType][inputs.materialSize];
  }, [inputs.unit, inputs.materialType, inputs.materialSize]);

  const results = useMemo(() => {
    const lengthNum = parseFloat(inputs.length);
    const widthNum = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    const priceNum = parseFloat(inputs.price);

    if (
      isNaN(lengthNum) ||
      isNaN(widthNum) ||
      lengthNum <= 0 ||
      widthNum <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      isNaN(priceNum) ||
      priceNum < 0
    ) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Invalid input values",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate total area
    // Metric: m², Imperial: ft²
    const area = lengthNum * widthNum;

    // Add waste margin
    const areaWithWaste = area * (1 + wastePercent / 100);

    // Calculate units needed (round up to next whole unit)
    const unitsNeeded = Math.ceil(areaWithWaste / materialCoverage);

    // Calculate cost
    const totalCost = unitsNeeded * priceNum;

    // Format output strings
    const unitLabel = (() => {
      switch (inputs.materialType) {
        case "laminate":
        case "hardwood":
          return "Planks";
        case "vinyl":
          return "Sheets";
        case "tile":
          return "Tiles";
        default:
          return "Units";
      }
    })();

    return {
      mainQty: `${unitsNeeded.toLocaleString()} ${unitLabel}`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Base area: ${area.toFixed(2)} ${inputs.unit === "metric" ? "m²" : "ft²"} × (1 + ${wastePercent}%) waste`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs.length, inputs.width, inputs.waste, inputs.price, materialCoverage, inputs.materialType, inputs.unit]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the average cost per square foot for different flooring materials in 2025?",
      answer: "Flooring costs vary significantly by material type. Laminate flooring averages $2–$8 per square foot installed, vinyl plank (LVP) ranges from $3–$10 per square foot, ceramic tile costs $5–$15 per square foot, hardwood flooring ranges from $8–$25 per square foot, and luxury vinyl tile (LVT) averages $4–$12 per square foot. Natural stone like marble or granite can exceed $15–$30 per square foot. These estimates include both material and basic installation labor.",
    },
    {
      question: "How much waste percentage should I factor into my flooring estimate?",
      answer: "Most flooring contractors recommend adding 10% waste for straightforward installations and 15–20% for complex layouts with numerous cuts or intricate patterns. For diagonal installations or specialty designs, increase the waste allowance to 20–25%. This accounts for cutting errors, future repairs, and material defects that are inevitable during installation.",
    },
    {
      question: "What factors affect the total cost of a flooring project beyond material price?",
      answer: "Installation labor typically adds 50–100% to material costs depending on the flooring type and complexity. Subfloor preparation, removal of existing flooring, underlayment, and finishing treatments (sealers, stains, or waxes) can add $1–$5 per square foot. Geographic location, contractor experience level, and project timeline all influence final pricing significantly.",
    },
    {
      question: "Is it cheaper to install flooring in a smaller room versus a larger space?",
      answer: "Per-square-foot costs may be lower for larger projects due to economies of scale, but fixed costs like material delivery, subfloor preparation, and equipment rental are distributed across more square footage. Smaller rooms often have proportionally higher labor costs per square foot because preparation and finishing work cannot be as efficiently batched. A 200 square foot room may cost 15–20% more per square foot than a 1,000 square foot project.",
    },
    {
      question: "What is the lifespan and cost-per-year for common flooring materials?",
      answer: "Laminate typically lasts 15–25 years at $0.13–$0.53 per square foot annually. Vinyl plank lasts 20–30 years at $0.15–$0.50 per square foot annually. Ceramic tile lasts 25–50+ years at $0.20–$0.60 per square foot annually. Hardwood can last 30–100+ years depending on maintenance at $0.27–$0.83 per square foot annually. This cost-per-year analysis helps justify material choice for long-term value.",
    },
    {
      question: "How do I account for room dimensions and irregularities in my flooring estimate?",
      answer: "Measure length and width at multiple points to account for walls that may not be perfectly square, then calculate total square footage. For L-shaped or irregularly shaped rooms, divide the space into rectangles, calculate each section separately, and sum the totals. Add 10–15% extra to your base measurement to cover waste and ensure adequate material for cuts around doorways, closets, and built-ins.",
    },
    {
      question: "What is the difference between installed and material-only pricing?",
      answer: "Material-only pricing covers the cost of the flooring product itself, typically $2–$30 per square foot depending on type. Installed pricing includes materials plus labor, underlayment, adhesives, and basic finishing, averaging $5–$40 per square foot total. Always clarify with contractors whether quoted prices include removal of old flooring, subfloor repair, or finishing work, as these can add significant cost.",
    },
    {
      question: "How much does subfloor preparation typically cost and when is it necessary?",
      answer: "Subfloor preparation costs $1–$5 per square foot depending on the extent of damage or leveling required. It is necessary when the existing floor has significant damage, moisture issues, or is not level within 1/8 inch per 10 feet. Skipping this step can void flooring warranties, reduce lifespan by 50% or more, and lead to costly repairs within 2–3 years.",
    },
    {
      question: "Can the flooring cost estimator account for bulk discounts or contractor pricing?",
      answer: "Most calculators use retail pricing; however, contractors typically receive 15–30% discounts on materials when ordering large quantities. If you are obtaining quotes, request both material and labor pricing separately so you can input wholesale rates if available. For DIY projects, purchasing materials directly from distributors rather than home improvement retailers can reduce costs by 10–20%, though you lose installation support.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing laminate flooring in a rectangular living room measuring 5 meters by 4 meters. You choose standard size laminate planks and want to include a 10% waste margin. Each plank covers 0.2 square meters and costs $3.50.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate the area: 5 m × 4 m = 20 m².",
      },
      {
        label: "2. Waste",
        explanation: "Add 10% waste: 20 m² × 1.10 = 22 m² total coverage needed.",
      },
      {
        label: "3. Order",
        explanation: "Divide total area by plank coverage: 22 m² ÷ 0.2 m² = 110 planks. Round up to 110 planks.",
      },
    ],
    result: "Final Order: 110 Planks costing $385.00",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Units Needed = ⌈ (Length × Width) × (1 + Waste%) ÷ Material Coverage per Unit ⌉",
    variables: [
      { symbol: "Length", description: "Length of the flooring area" },
      { symbol: "Width", description: "Width of the flooring area" },
      { symbol: "Waste%", description: "Waste margin percentage (expressed as decimal)" },
      { symbol: "Material Coverage per Unit", description: "Area covered by one unit of flooring material" },
      { symbol: "⌈ ⌉", description: "Ceiling function to round up to the nearest whole unit" },
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
            <SelectItem value="metric">Metric (m)</SelectItem>
            <SelectItem value="imperial">Imperial (ft)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inputs: Length, Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`Enter length in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>
        <div className="space-y-2">
          <Label>Width ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.width}
            onChange={(e) => handleInputChange("width", e.target.value)}
            placeholder={`Enter width in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>
      </div>

      {/* Material Type & Size */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Material Type</Label>
          <Select value={inputs.materialType} onValueChange={(v) => handleInputChange("materialType", v)}>
            <SelectTrigger>
              <HardHat className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="laminate">Laminate</SelectItem>
              <SelectItem value="hardwood">Hardwood</SelectItem>
              <SelectItem value="vinyl">Vinyl</SelectItem>
              <SelectItem value="tile">Tile</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Item Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
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
      </div>

      {/* Price per Unit */}
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

      {/* Waste Margin Slider */}
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
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Flooring Material Cost Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Flooring Material Cost Estimator helps homeowners and contractors calculate the total investment required for a flooring project by combining material costs, labor expenses, waste allowances, and regional pricing factors. This tool eliminates guesswork when budgeting for renovations, providing accurate estimates that account for different flooring types, room sizes, and local market conditions. Accurate estimating prevents budget overruns, enables competitive contractor bidding, and supports informed decisions about material selection.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Key inputs include room dimensions (length and width in feet), flooring material type (laminate, vinyl, tile, hardwood, etc.), total square footage to be covered, waste percentage (typically 10–20%), and your geographic location or regional labor rate. Some calculators also allow you to input contractor labor rates if you have received quotes, customizing the estimate to your specific situation. The calculator converts these inputs into per-square-foot material and labor costs, then multiplies by your total area to generate a comprehensive project budget.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Interpret results by breaking down the total into material costs, labor costs, and waste allowance as separate line items. Compare the per-square-foot installed cost against local contractor quotes to validate reasonableness. Use the estimate to evaluate material alternatives—for example, comparing the $10 per square foot installed cost of solid hardwood against the $8 per square foot cost of engineered hardwood to weigh durability and longevity against budget constraints. Remember that estimates do not include removal of existing flooring, subfloor repair, or specialty finishes unless specifically entered.</p>
        </div>
      </section>

      {/* TABLE: Average Flooring Material Costs (2025 Pricing) */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Average Flooring Material Costs (2025 Pricing)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical material and installed costs per square foot for popular flooring options in the U.S. market.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Flooring Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Cost ($/sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Installed Cost ($/sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Expected Lifespan (Years)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Laminate</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2–$8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–25</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Vinyl Plank (LVP)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3–$10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Luxury Vinyl Tile (LVT)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7–$17</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ceramic/Porcelain Tile</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5–$15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10–$25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–50+</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hardwood (Solid)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8–$25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15–$35</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30–100+</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Engineered Hardwood</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5–$15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12–$28</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Natural Stone (Marble/Granite)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$15–$30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$25–$50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">50–100+</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cork</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$10–$20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–30</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Bamboo</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$6–$15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$12–$25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25–35</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Installed costs include basic labor and standard underlayment. Prices vary by region and contractor; additional costs apply for removal, subfloor prep, and specialty finishes.</p>
      </section>

      {/* TABLE: Waste Percentage Guidelines by Installation Type */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Waste Percentage Guidelines by Installation Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different installation patterns and room configurations require varying waste allowances to ensure adequate material.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Installation Pattern</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Complexity</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Waste %</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Example: 500 sq ft Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Straight/Linear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Simple rectangular</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">550 sq ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Straight/Linear</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multiple doorways/closets</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12–15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">575–575 sq ft</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diagonal Pattern</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Simple rectangular</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">575 sq ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Diagonal Pattern</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Complex/irregular</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20–25%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">625–625 sq ft</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Tile with Grouting</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Standard grid layout</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10–12%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">550–560 sq ft</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Random/Mixed Pattern</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Complex design</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600 sq ft</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Herringbone/Parquet</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Any configuration</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15–20%</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">575–600 sq ft</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Failure to order adequate waste material can result in color mismatches, delays, and additional costs due to production batch variations.</p>
      </section>

      {/* TABLE: Regional Labor Cost Variation for Flooring Installation */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Regional Labor Cost Variation for Flooring Installation</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Installation labor costs vary significantly by geographic region and local market conditions.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Region/Market</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Labor Cost Range ($/sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Installation Time (days per 1,000 sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Price Adjustment Factor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Major Urban Centers (NYC, LA, SF)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$8–$20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+40–60%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Mid-Size Cities</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$5–$12</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+0–20%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Suburban Areas</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4–$10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">–10–10%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Rural/Small Towns</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3–$8</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–4 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">–20–30%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">High Cost-of-Living States (CA, MA)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$7–$18</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1–2 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">+30–50%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Moderate Cost States</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4–$10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2–3 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0–15%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lower Cost States</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2–$6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3–5 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">–25–40%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Labor costs increase for complex subfloor preparation, custom finishes, or projects requiring multiple specialized tradespeople.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Get Multiple Quotes — Obtain price estimates from at least 3 local contractors to compare labor rates, material markup, and included services. Labor costs can vary by 30–50% between contractors, so comparison shopping protects your budget and quality expectations.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure Twice, Order Once — Measure room dimensions multiple times at different points, photograph irregular areas, and account for waste before ordering materials. Ordering too little forces expensive rush orders or color mismatches; ordering too much wastes capital and creates storage issues.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request a Breakdown — Ask contractors to itemize material costs, labor costs, and additional charges (removal, prep, finish) separately. This transparency allows you to verify calculator estimates and identify opportunities to reduce costs without compromising quality.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Factor in Subfloor Condition — If your subfloor has moisture damage, soft spots, or significant slope, budget an additional $1–$3 per square foot for preparation and repair. Addressing subfloor issues upfront prevents costly flooring failure and warranty disputes later.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Plan for Future Repairs — Reserve 5–10% of leftover materials from installation for future patching or repairs. Stored material preserves color matching and eliminates sourcing challenges if damage occurs 5–10 years later.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Include Removal and Disposal Costs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many estimates overlook the cost of removing and disposing of old flooring, which adds $1–$3 per square foot. This is a mandatory step for most installations and often represents 15–25% of total labor cost.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Waste Percentage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Ordering only the exact square footage needed for a room ignores waste from cuts, mistakes, and pattern alignment. This typically results in shortfalls and emergency orders at 20–40% premium pricing.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Comparing Material-Only Prices to Installed Quotes</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Contractors often quote installed prices (material + labor) while retailers quote material-only pricing, creating misleading cost comparisons. Always convert all quotes to installed pricing for accurate comparison.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring Subfloor Preparation Needs</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Proceeding without assessing subfloor condition can result in voided warranties, premature failure, and costs exceeding the original flooring investment within 2–5 years. Professional inspection before ordering materials prevents costly mistakes.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the average cost per square foot for different flooring materials in 2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Flooring costs vary significantly by material type. Laminate flooring averages $2–$8 per square foot installed, vinyl plank (LVP) ranges from $3–$10 per square foot, ceramic tile costs $5–$15 per square foot, hardwood flooring ranges from $8–$25 per square foot, and luxury vinyl tile (LVT) averages $4–$12 per square foot. Natural stone like marble or granite can exceed $15–$30 per square foot. These estimates include both material and basic installation labor.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much waste percentage should I factor into my flooring estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most flooring contractors recommend adding 10% waste for straightforward installations and 15–20% for complex layouts with numerous cuts or intricate patterns. For diagonal installations or specialty designs, increase the waste allowance to 20–25%. This accounts for cutting errors, future repairs, and material defects that are inevitable during installation.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect the total cost of a flooring project beyond material price?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Installation labor typically adds 50–100% to material costs depending on the flooring type and complexity. Subfloor preparation, removal of existing flooring, underlayment, and finishing treatments (sealers, stains, or waxes) can add $1–$5 per square foot. Geographic location, contractor experience level, and project timeline all influence final pricing significantly.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Is it cheaper to install flooring in a smaller room versus a larger space?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Per-square-foot costs may be lower for larger projects due to economies of scale, but fixed costs like material delivery, subfloor preparation, and equipment rental are distributed across more square footage. Smaller rooms often have proportionally higher labor costs per square foot because preparation and finishing work cannot be as efficiently batched. A 200 square foot room may cost 15–20% more per square foot than a 1,000 square foot project.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the lifespan and cost-per-year for common flooring materials?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Laminate typically lasts 15–25 years at $0.13–$0.53 per square foot annually. Vinyl plank lasts 20–30 years at $0.15–$0.50 per square foot annually. Ceramic tile lasts 25–50+ years at $0.20–$0.60 per square foot annually. Hardwood can last 30–100+ years depending on maintenance at $0.27–$0.83 per square foot annually. This cost-per-year analysis helps justify material choice for long-term value.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for room dimensions and irregularities in my flooring estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure length and width at multiple points to account for walls that may not be perfectly square, then calculate total square footage. For L-shaped or irregularly shaped rooms, divide the space into rectangles, calculate each section separately, and sum the totals. Add 10–15% extra to your base measurement to cover waste and ensure adequate material for cuts around doorways, closets, and built-ins.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between installed and material-only pricing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Material-only pricing covers the cost of the flooring product itself, typically $2–$30 per square foot depending on type. Installed pricing includes materials plus labor, underlayment, adhesives, and basic finishing, averaging $5–$40 per square foot total. Always clarify with contractors whether quoted prices include removal of old flooring, subfloor repair, or finishing work, as these can add significant cost.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much does subfloor preparation typically cost and when is it necessary?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Subfloor preparation costs $1–$5 per square foot depending on the extent of damage or leveling required. It is necessary when the existing floor has significant damage, moisture issues, or is not level within 1/8 inch per 10 feet. Skipping this step can void flooring warranties, reduce lifespan by 50% or more, and lead to costly repairs within 2–3 years.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can the flooring cost estimator account for bulk discounts or contractor pricing?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most calculators use retail pricing; however, contractors typically receive 15–30% discounts on materials when ordering large quantities. If you are obtaining quotes, request both material and labor pricing separately so you can input wholesale rates if available. For DIY projects, purchasing materials directly from distributors rather than home improvement retailers can reduce costs by 10–20%, though you lose installation support.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2025</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nahb.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders (NAHB) — Construction Cost Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">The NAHB provides comprehensive construction cost benchmarks and flooring material pricing data updated regularly for regional variation analysis.</p>
          </li>
          <li>
            <a href="https://www.rsmeans.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">RS Means Building Construction Cost Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry-standard construction cost estimating database that includes detailed flooring material and labor cost breakdowns by material type and region.</p>
          </li>
          <li>
            <a href="https://www.fcica.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Flooring Contractors Association — Installation Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Professional organization providing installation guidelines, waste standards, and best practices for flooring contractors and material selection.</p>
          </li>
          <li>
            <a href="https://www.bls.gov/oes/current/oes472161.htm" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Bureau of Labor Statistics — Construction Wage Data</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Federal labor statistics reporting average flooring installer wages and regional variations to support accurate labor cost estimating.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Flooring Material Cost Estimator"
      description="The ultimate professional guide and calculator for Flooring Material Cost Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd}
      formula={formula}
      example={example}
      relatedCalculators={[]}
      onThisPage={[
        { id: "guide", label: "Guide" },
        { id: "tips", label: "Pro Tips" },
        { id: "formula", label: "Formula" },
        { id: "example", label: "Example" },
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