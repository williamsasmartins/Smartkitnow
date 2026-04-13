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

export default function PlasterVolumeBagCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters, mm) or imperial (feet, inches)
    length: "",
    width: "",
    depth: "", // thickness of plaster layer
    waste: "10", // waste percentage
    price: "",
    materialSize: "standard", // standard or large bag size
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Constants for bag yields (volume coverage per bag in cubic meters or cubic feet)
  // Standard bag ~ 25 kg bag covers approx 0.015 m³ (metric) or 0.53 ft³ (imperial)
  // Large bag ~ 40 kg bag covers approx 0.025 m³ (metric) or 0.88 ft³ (imperial)
  const bagYields = {
    metric: {
      standard: 0.015, // cubic meters per bag
      large: 0.025,
    },
    imperial: {
      standard: 0.53, // cubic feet per bag
      large: 0.88,
    },
  };

  const results = useMemo(() => {
    // Parse inputs
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const depth = parseFloat(inputs.depth);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
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

    // Calculate volume in cubic meters or cubic feet
    // For metric: assume inputs in meters (if user inputs in mm, they must convert)
    // For imperial: inputs assumed in feet
    // Depth is thickness of plaster layer

    const volume = length * width * depth; // m³ or ft³

    // Add waste margin
    const volumeWithWaste = volume * (1 + wastePercent / 100);

    // Calculate number of bags needed (round up)
    const bagYield = bagYields[unit][materialSize];
    const bagsNeeded = Math.ceil(volumeWithWaste / bagYield);

    // Calculate cost if price per unit given
    const cost = !isNaN(pricePerUnit) && pricePerUnit > 0 ? (bagsNeeded * pricePerUnit).toFixed(2) : null;

    // Format results
    const mainQty = `${bagsNeeded} Bag${bagsNeeded !== 1 ? "s" : ""}`;
    const costStr = cost ? `$${cost}` : "N/A";

    // Details string
    const volumeStr =
      unit === "metric"
        ? `${volume.toFixed(3)} m³`
        : `${volume.toFixed(3)} ft³`;

    return {
      mainQty,
      cost: costStr,
      details: `Raw volume: ${volumeStr} | Waste margin: +${wastePercent}%`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How much plaster do I need for a 100 square meter wall?",
      answer: "For a 100 square meter wall with a standard plaster thickness of 12-15mm, you typically need between 1.2 to 1.5 cubic meters of plaster. Using a standard plaster density of 1,500-1,600 kg/m³, this translates to approximately 1,800-2,400 kg of plaster material, or roughly 36-48 standard 50kg bags.",
    },
    {
      question: "What is the standard plaster bag size and weight?",
      answer: "The most common plaster bag sizes are 40kg, 50kg, and 60kg, with 50kg bags being the industry standard in North America and Europe. A 50kg bag typically covers 8-12 square meters at a 12mm thickness, making it ideal for calculating material requirements for medium-sized projects.",
    },
    {
      question: "How do I calculate plaster volume for irregular surfaces?",
      answer: "For irregular surfaces, break the area into smaller geometric sections (rectangles, triangles) and calculate each separately using the formula: Volume = Length × Width × Thickness in meters. Sum all sections to get total volume, then account for a 10-15% waste factor on uneven or textured surfaces to ensure adequate material.",
    },
    {
      question: "What plaster thickness should I use for interior walls?",
      answer: "Interior walls typically require 12-15mm of plaster over a base coat, with 10mm for finish coats. Exterior walls or areas exposed to weather should use 15-20mm thickness for better durability. Thicker applications (20mm+) are needed for leveling severely uneven substrates.",
    },
    {
      question: "How many bags of plaster do I need for a 50 square meter ceiling?",
      answer: "For a 50 square meter ceiling at 12mm thickness, you need approximately 0.6 cubic meters of plaster material. Using 50kg standard bags with a coverage rate of 1.67m³ per bag, you'll require about 5-6 bags, accounting for a 10% waste factor on overhead application.",
    },
    {
      question: "What factors affect plaster coverage rates?",
      answer: "Plaster coverage rates vary based on substrate porosity (absorbent surfaces require more material), surface texture (rough surfaces need thicker application), application method (spray vs. hand application affects efficiency), and environmental conditions like temperature and humidity. A 50kg bag typically covers 8-12m² at 12mm, but coverage can drop to 6-8m² on highly porous substrates.",
    },
    {
      question: "Should I add a waste factor to my plaster estimate?",
      answer: "Yes, adding a 10-15% waste factor is industry standard to account for spillage, application inefficiency, and rework. For projects with complex geometry or experienced crews working inefficiently, increase the waste factor to 15-20%. This ensures you won't run short mid-project and minimizes costly delays.",
    },
    {
      question: "How does substrate type affect plaster material requirements?",
      answer: "Different substrates have different absorption rates: concrete blocks absorb more moisture and may require primer, drywall has moderate absorption, and metal lath or mesh surfaces can trap plaster, affecting coverage efficiency. Highly absorbent substrates may reduce coverage efficiency by 15-25%, requiring additional material compared to standard calculations.",
    },
    {
      question: "What is the typical cost per bag of plaster in 2025?",
      answer: "As of 2025, standard 50kg bags of general-purpose plaster range from $8-15 per bag depending on quality, brand, and regional availability. Specialty plasters (quick-set, fire-rated, or finishing grades) cost $12-25 per bag. Local labor and material inflation may affect prices, so verify current rates with local suppliers before finalizing project budgets.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are plastering a wall that measures 4 meters long, 3 meters high, with a plaster thickness of 0.02 meters (20 mm). You want to include a 10% waste margin and use standard size plaster bags.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate volume: Length × Height × Thickness = 4 × 3 × 0.02 = 0.24 m³",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 0.24 × 1.10 = 0.264 m³ total plaster volume",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total volume by bag yield (0.015 m³ per standard bag): 0.264 ÷ 0.015 = 17.6 bags, round up to 18 bags",
      },
    ],
    result: "Final Order: 18 standard size plaster bags",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Volume = Length × Width × Depth",
    variables: [
      { symbol: "L", description: "Length of the surface area" },
      { symbol: "W", description: "Width or Height of the surface area" },
      { symbol: "D", description: "Depth or Thickness of plaster layer" },
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Label>
            Width/Height ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
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
          <Label>
            Depth/Thickness ({inputs.unit === "metric" ? "meters" : "feet"})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder={inputs.unit === "metric" ? "0.02 (20 mm)" : "0.07 (in feet)"}
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
          </CardContent>
        </Card>
      )}
    </div>
  );

  const editorial = (
    <div className="space-y-12">

      {/* GUIDE */}
      <section id="guide" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Plaster Volume & Bag Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Plaster Volume &amp; Bag Estimator is a construction planning tool designed to calculate the exact amount of plaster material needed for wall, ceiling, or floor applications. This calculator eliminates guesswork from material procurement, helping you avoid costly shortages, excess waste, and budget overruns. Whether you're tackling a small residential repair or managing a large commercial project, accurate plaster estimates ensure efficient project execution.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, input three key values: the total surface area in square meters (or square feet), the desired plaster thickness in millimeters, and your chosen plaster bag size (typically 40kg, 50kg, or 60kg). You'll also need to specify the substrate type (concrete, drywall, brick, etc.) since different surfaces absorb plaster differently and affect coverage rates. The calculator automatically accounts for material density, standard bag weights, and application inefficiencies.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The results display total plaster volume in cubic meters, the number of bags required, and estimated material costs based on current market pricing. The calculator includes an adjustable waste factor (typically 10-15%) to account for spillage, patching, and application variability. Use the final bag count to order materials from suppliers, and reference the cost estimate for budget planning and contractor negotiations.</p>
        </div>
      </section>

      {/* TABLE: Plaster Coverage Rates by Thickness and Substrate Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Plaster Coverage Rates by Thickness and Substrate Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows typical coverage rates for standard 50kg plaster bags across common thicknesses and substrate materials.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Substrate Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">10mm Thickness</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">12mm Thickness</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">15mm Thickness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Concrete Block (Absorbent)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 m²</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Drywall (Moderate Absorption)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 m²</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Brick (Low Absorption)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-14 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 m²</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Metal Lath</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6 m²</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Primed Concrete</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">13-15 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-13 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-11 m²</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Coverage rates assume professional application. Rough or textured surfaces may reduce coverage by 10-20%. Always add 10-15% waste factor to final estimate.</p>
      </section>

      {/* TABLE: Plaster Volume Calculation Examples for Common Project Sizes */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Plaster Volume Calculation Examples for Common Project Sizes</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Quick reference guide showing material requirements for typical interior and exterior wall projects.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Project Area (m²)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">12mm Thickness Volume (m³)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">50kg Bags Needed (with 10% waste)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Estimated Material Cost ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">25 m² (small bedroom)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.30 m³</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$32-75</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">50 m² (large room)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.60 m³</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$64-150</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">100 m² (apartment interior)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.20 m³</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">16-20 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$128-300</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">250 m² (commercial space)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.00 m³</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40-50 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$320-750</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">500 m² (large renovation)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6.00 m³</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">80-100 bags</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$640-1,500</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs based on $8-15 per 50kg bag average pricing in 2025. Actual costs vary by region, material grade, and supplier. Add labor costs separately.</p>
      </section>

      {/* TABLE: Plaster Type Characteristics and Coverage Performance */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Plaster Type Characteristics and Coverage Performance</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Different plaster types offer varying coverage rates and are suited for different applications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Plaster Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage (50kg bag at 12mm)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Drying Time</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Use Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Gypsum Plaster (General Purpose)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-12 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Interior walls, ceilings, standard finishes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Lime Plaster</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-10 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-14 days</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Historic restoration, breathable finishes</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Cement Plaster</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">48-72 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Exterior surfaces, high-moisture areas</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Quick-Set Plaster (Fast Drying)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-11 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-6 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Rapid projects, minimal downtime</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Fire-Rated Plaster</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9 m²</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">24-48 hours</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Commercial buildings, fire safety requirements</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Coverage and drying times vary by ambient humidity, temperature, and substrate preparation. Follow manufacturer specifications for optimal results.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure wall areas twice and verify substrate conditions before calculating plaster requirements—uneven or deteriorated surfaces may require thicker applications (15-20mm vs. standard 12mm), significantly increasing material needs.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Order an extra 1-2 bags beyond your calculator estimate to account for mixing waste, touch-ups after drying, and unexpected surface repairs that emerge during the project.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Check supplier availability before ordering large quantities of specialty plasters (quick-set, fire-rated); standard gypsum plaster is always readily available but specialty types may require advance ordering.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider environmental conditions when timing your project—apply plaster when temperatures are 10-30°C and humidity is 30-80%, as extreme conditions slow drying and reduce coverage efficiency, potentially requiring additional material.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Substrate Absorption</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using standard coverage rates on highly absorbent substrates (bare concrete blocks, unprimed brick) results in underestimating material needs by 15-25%. Always adjust coverage downward for porous surfaces or pre-coat with primer to normalize absorption.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Including a Waste Factor</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Calculating exact theoretical coverage without adding 10-15% for waste and spillage leads to running short mid-project. Experienced contractors always build in waste buffer to avoid costly delays and material shortages.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Misidentifying Substrate Type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Confusing drywall with concrete block or metal lath leads to drastically inaccurate estimates, as these materials have 20-40% coverage rate differences. Verify substrate type visually or with suppliers before calculating requirements.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Incorrect Thickness Specifications</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Applying plaster thicker than necessary (20mm instead of recommended 12mm) wastes 40-70% more material than required. Consult building codes and professional guidelines to confirm appropriate thickness before estimating.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much plaster do I need for a 100 square meter wall?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 100 square meter wall with a standard plaster thickness of 12-15mm, you typically need between 1.2 to 1.5 cubic meters of plaster. Using a standard plaster density of 1,500-1,600 kg/m³, this translates to approximately 1,800-2,400 kg of plaster material, or roughly 36-48 standard 50kg bags.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard plaster bag size and weight?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common plaster bag sizes are 40kg, 50kg, and 60kg, with 50kg bags being the industry standard in North America and Europe. A 50kg bag typically covers 8-12 square meters at a 12mm thickness, making it ideal for calculating material requirements for medium-sized projects.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate plaster volume for irregular surfaces?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For irregular surfaces, break the area into smaller geometric sections (rectangles, triangles) and calculate each separately using the formula: Volume = Length × Width × Thickness in meters. Sum all sections to get total volume, then account for a 10-15% waste factor on uneven or textured surfaces to ensure adequate material.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What plaster thickness should I use for interior walls?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Interior walls typically require 12-15mm of plaster over a base coat, with 10mm for finish coats. Exterior walls or areas exposed to weather should use 15-20mm thickness for better durability. Thicker applications (20mm+) are needed for leveling severely uneven substrates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many bags of plaster do I need for a 50 square meter ceiling?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For a 50 square meter ceiling at 12mm thickness, you need approximately 0.6 cubic meters of plaster material. Using 50kg standard bags with a coverage rate of 1.67m³ per bag, you'll require about 5-6 bags, accounting for a 10% waste factor on overhead application.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What factors affect plaster coverage rates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Plaster coverage rates vary based on substrate porosity (absorbent surfaces require more material), surface texture (rough surfaces need thicker application), application method (spray vs. hand application affects efficiency), and environmental conditions like temperature and humidity. A 50kg bag typically covers 8-12m² at 12mm, but coverage can drop to 6-8m² on highly porous substrates.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I add a waste factor to my plaster estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, adding a 10-15% waste factor is industry standard to account for spillage, application inefficiency, and rework. For projects with complex geometry or experienced crews working inefficiently, increase the waste factor to 15-20%. This ensures you won't run short mid-project and minimizes costly delays.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How does substrate type affect plaster material requirements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Different substrates have different absorption rates: concrete blocks absorb more moisture and may require primer, drywall has moderate absorption, and metal lath or mesh surfaces can trap plaster, affecting coverage efficiency. Highly absorbent substrates may reduce coverage efficiency by 15-25%, requiring additional material compared to standard calculations.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the typical cost per bag of plaster in 2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">As of 2025, standard 50kg bags of general-purpose plaster range from $8-15 per bag depending on quality, brand, and regional availability. Specialty plasters (quick-set, fire-rated, or finishing grades) cost $12-25 per bag. Local labor and material inflation may affect prices, so verify current rates with local suppliers before finalizing project budgets.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.astm.org/c0011_c0011m-23.html" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASTM C11 – Standard Terminology Relating to Gypsum and Related Products</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official ASTM standards defining plaster types, properties, and application specifications used in construction industry.</p>
          </li>
          <li>
            <a href="https://www.gypsum.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Gypsum Association – GA-216 Application of Gypsum Plaster</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standard guidelines for gypsum plaster application, coverage rates, and material specifications.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/products-and-services/i-codes/2024-i-codes/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) – Section 2510: Gypsum Board and Plaster</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Building code requirements for plaster thickness, fire ratings, and installation standards across jurisdictions.</p>
          </li>
          <li>
            <a href="https://www.nist.gov/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NIST – Building and Fire Research Laboratory Construction Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Government research and standards for construction materials including plaster durability, coverage efficiency, and environmental performance.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Plaster Volume & Bag Estimator"
      description="The ultimate professional guide and calculator for Plaster Volume & Bag Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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