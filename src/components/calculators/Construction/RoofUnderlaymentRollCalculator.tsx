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

export default function RoofUnderlaymentRollCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    waste: "10", // percent
    price: "",
    materialSize: "standard", // standard or large roll
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Calculate total roof area = length * width (in square meters or square feet)
   * 2. Add waste percentage
   * 3. Calculate number of rolls needed = total area / roll coverage area
   * 4. Round up to nearest whole roll
   * 5. Calculate cost = rolls * price per roll
   *
   * Roll coverage area depends on materialSize and unit system:
   * - Standard roll coverage:
   *    Metric: 1 roll covers 50 m² (typical)
   *    Imperial: 1 roll covers 540 ft² (approx 50 m²)
   * - Large roll coverage:
   *    Metric: 1 roll covers 75 m²
   *    Imperial: 1 roll covers 810 ft²
   */

  const rollCoverage = useMemo(() => {
    if (inputs.unit === "metric") {
      return inputs.materialSize === "standard" ? 50 : 75; // m²
    } else {
      return inputs.materialSize === "standard" ? 540 : 810; // ft²
    }
  }, [inputs.unit, inputs.materialSize]);

  const results = useMemo(() => {
    const length = parseFloat(inputs.length);
    const width = parseFloat(inputs.width);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);

    if (
      isNaN(length) ||
      length <= 0 ||
      isNaN(width) ||
      width <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      isNaN(pricePerUnit) ||
      pricePerUnit < 0
    ) {
      return {
        mainQty: "0 Rolls",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all inputs.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Calculate total area
    const totalArea = length * width; // m² or ft²

    // Add waste margin
    const totalAreaWithWaste = totalArea * (1 + wastePercent / 100);

    // Calculate rolls needed
    const rollsNeeded = Math.ceil(totalAreaWithWaste / rollCoverage);

    // Calculate cost
    const totalCost = rollsNeeded * pricePerUnit;

    return {
      mainQty: `${rollsNeeded} Roll${rollsNeeded !== 1 ? "s" : ""}`,
      cost: `$${totalCost.toFixed(2)}`,
      details: `Raw area: ${totalArea.toFixed(2)} ${
        inputs.unit === "metric" ? "m²" : "ft²"
      }, with waste: ${totalAreaWithWaste.toFixed(2)} ${
        inputs.unit === "metric" ? "m²" : "ft²"
      }`,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs, rollCoverage]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How many rolls of underlayment do I need for a 2,000 square foot roof?",
      answer: "Most standard underlayment rolls cover 400-437 square feet per roll. For a 2,000 square foot roof, you would need approximately 5-6 rolls, assuming standard 36-inch wide rolls that are 3-feet wide. Always add 10% extra for waste, overlaps, and cutting around penetrations, bringing your total to 5-7 rolls for this size roof.",
    },
    {
      question: "What is the standard overlap requirement for roof underlayment?",
      answer: "Building codes typically require a 4-6 inch horizontal overlap between underlayment rows and a 6-12 inch overlap at seams and valleys. This overlap is critical for proper water shedding and prevents water from running under the material during heavy rain or ice dams. Always consult your local building code, as requirements vary by region and roof pitch.",
    },
    {
      question: "How do I account for roof pitch in my underlayment calculation?",
      answer: "Steeper roof pitches require more material due to increased waste from cutting and overlapping. A 4/12 to 6/12 pitch (moderate slope) typically needs 5-10% additional material, while pitches steeper than 8/12 may require 15-20% extra. Your calculator should adjust for slope angle, but when in doubt, add an extra roll to your estimate.",
    },
    {
      question: "What types of underlayment require different roll calculations?",
      answer: "Asphalt-saturated felt (15 lb or 30 lb) comes in rolls of approximately 400 square feet, while synthetic underlayment rolls often cover 437 or 500 square feet. Ice and water shield rolls are typically much smaller at 200-300 square feet per roll. Check your specific product's coverage rate before ordering, as dimensions vary significantly between manufacturers.",
    },
    {
      question: "How much underlayment waste should I budget for?",
      answer: "Industry standards recommend budgeting 10-15% waste for typical roofs with simple designs. Complex roofs with multiple valleys, skylights, and chimneys may require 20-25% additional material. Accounting for waste in your estimate prevents mid-project shortages and is one of the most common reasons homeowners underestimate material needs.",
    },
    {
      question: "Do I need different underlayment for valleys and eaves?",
      answer: "Yes, many building codes require ice and water shield (a self-adhering membrane) in valleys, along eaves, and at roof penetrations, while the rest of the roof may use standard asphalt-felt or synthetic underlayment. Ice and water shield costs 2-3 times more than standard underlayment but covers smaller areas (typically 200-300 sq ft per roll). Factor both materials separately in your estimate.",
    },
    {
      question: "What is the difference between felt and synthetic underlayment coverage?",
      answer: "Traditional asphalt-saturated felt rolls cover approximately 400 square feet per 3-foot wide roll, while synthetic underlayment typically covers 437-500 square feet per roll depending on the manufacturer. Synthetic underlayment is lighter, more durable, and resists tearing during installation, making it the industry standard for modern roofing. Both require the same overlap calculations, but synthetic may reduce total rolls needed by 5-10%.",
    },
    {
      question: "How do roof penetrations affect my underlayment estimate?",
      answer: "Each roof penetration (chimney, vent, skylight) requires 4-8 additional linear feet of underlayment for proper wrapping and waterproofing. A roof with 5-6 penetrations typically needs an extra 0.5-1 full roll of material. The calculator should prompt you to enter penetration counts or add 10-15% to your base estimate if your roof has multiple features.",
    },
    {
      question: "What's the cost difference between ordering 10% extra versus running short?",
      answer: "A single roll of asphalt felt costs $40-60, while synthetic underlayment runs $60-100 per roll. Running short requires an emergency reorder costing 20-30% more due to expedited shipping and potential labor delays at $60-80 per hour. Budgeting an extra $50-150 upfront for waste is always more economical than project delays or partial installation completion.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are estimating roof underlayment rolls for a rectangular roof measuring 12 meters in length and 8 meters in width. You choose a standard roll size and want to include a 10% waste margin.",
    steps: [
      {
        label: "1. Measure",
        explanation:
          "Calculate the roof area: 12 m × 8 m = 96 m² total area.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 96 m² × 1.10 = 105.6 m² total coverage needed.",
      },
      {
        label: "3. Order",
        explanation:
          "Divide total coverage by roll coverage (standard roll covers 50 m²): 105.6 ÷ 50 = 2.112 rolls. Round up to 3 rolls.",
      },
    ],
    result: "Final Order: 3 Rolls",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Number of Rolls = ⌈ (Length × Width × (1 + Waste% / 100)) ÷ Roll Coverage Area ⌉",
    variables: [
      { symbol: "Length", description: "Length of the roof area" },
      { symbol: "Width", description: "Width of the roof area" },
      { symbol: "Waste%", description: "Waste margin percentage" },
      { symbol: "Roll Coverage Area", description: "Coverage area per roll" },
      {
        symbol: "⌈ ⌉",
        description: "Ceiling function to round up to the nearest whole roll",
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
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 12"
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
            placeholder="e.g. 8"
          />
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Roll Size</Label>
          <Select
            value={inputs.materialSize}
            onValueChange={(v) => handleInputChange("materialSize", v)}
          >
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Roll</SelectItem>
              <SelectItem value="large">Large Roll</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Roll</Label>
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Roof Underlayment Roll Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Roof Underlayment Roll Estimator is a tool designed to calculate the precise number of underlayment rolls needed for your roofing project based on roof size, pitch, and configuration. Accurate estimation prevents costly material shortages mid-project and helps budget for labor efficiency. Whether you're using traditional asphalt felt or modern synthetic underlayment, this calculator ensures you order the right amount the first time.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use the calculator, input your roof's total square footage, average pitch (slope angle), and the type of underlayment you've selected. You'll also need to specify the number of roof penetrations (chimneys, vents, skylights) and whether your roof includes valleys or other complex features. These inputs directly affect material requirements because steeper pitches and additional features create more cutting waste and require larger overlaps for proper water shedding.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator outputs the number of rolls needed, plus a waste allowance (typically 10-15%) automatically applied to account for overlaps, cutting, and installation losses. Review the total roll count and multiply by the cost per roll to determine your material budget. If your roof has multiple valleys, ice dams are a concern, or you live in a high-snow climate, consider ordering extra ice and water shield rolls in addition to the base underlayment estimate.</p>
        </div>
      </section>

      {/* TABLE: Underlayment Coverage and Specifications by Type */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Underlayment Coverage and Specifications by Type</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table compares standard underlayment products, their typical coverage rates, and cost ranges to help you estimate material needs accurately.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Underlayment Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coverage per Roll (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roll Width</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost per Roll (2024)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Lifespan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">15 lb Asphalt-Saturated Felt</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$40-50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">30 lb Asphalt-Saturated Felt</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$55-70</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-25 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Synthetic Underlayment</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">437-500</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">39-40 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60-100</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25-50 years</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ice and Water Shield</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200-300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">36-40 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$90-140</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20-30 years</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Non-Bitumen Synthetic</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">437</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$75-110</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30-40 years</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices vary by region and manufacturer; synthetic products offer longer lifespan but higher upfront cost.</p>
      </section>

      {/* TABLE: Estimated Underlayment Rolls by Roof Size and Pitch */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Estimated Underlayment Rolls by Roof Size and Pitch</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Use this table to estimate the number of rolls needed based on total roof square footage and roof pitch before applying waste factors.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Roof Size (sq ft)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Moderate Pitch (4/12-6/12)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Steep Pitch (8/12-10/12)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Very Steep Pitch (&gt;12/12)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Add Waste Factor (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3-4 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-5 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">2,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5-6 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-7 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-9 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10-15%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">3,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-8 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-10 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-12 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18%</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">4,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">9-10 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-13 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18%</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">5,000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">11-13 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">14-16 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">17-20 rolls</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15-20%</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Waste factors increase with roof complexity; add 5% for each major penetration or valley.</p>
      </section>

      {/* TABLE: Overlap Requirements and Installation Standards */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Overlap Requirements and Installation Standards</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Proper overlap is critical for roof performance; this table outlines standard overlap measurements required by building codes and manufacturer specifications.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Installation Feature</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Minimum Overlap</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Recommended Overlap</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Building Code Reference</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water Shedding Direction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Horizontal Rows (Standard)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Most State Building Codes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Downslope</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">End Seams</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">ASTM D226 Standard</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Downslope</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Valleys and Ridge Lines</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6 inches each side</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12 inches each side</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">NFPA 241 and IBC</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Bidirectional</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ice and Water Shield</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2-3 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4-6 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Manufacturer Spec</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Downslope</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Around Roof Penetrations</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">12-18 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">State-Specific Codes</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Multidirectional wrap</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Steeper pitches may require larger overlaps; always follow local jurisdiction requirements and manufacturer guidelines.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Measure your roof in sections rather than estimating total square footage — break it into rectangles, triangles, and account for overhangs separately for maximum accuracy in your calculator input.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Order underlayment from a single manufacturer batch whenever possible to ensure color consistency and identical overlap specifications across all rolls, reducing installation complications.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Install underlayment in cool weather (below 75°F) when possible; hot weather can cause synthetic materials to stretch, leading to wrinkles and improper overlap once temperatures cool.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Keep 2-3 extra rolls on hand after project completion for future repairs and maintenance; underlayment is perishable and becomes harder to match after 5+ years.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to Account for Roof Pitch</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many DIYers calculate underlayment based on square footage alone, ignoring that steeper pitches require significantly more material due to waste and larger overlaps. A 12/12 pitch roof requires 15-20% more underlayment than a 4/12 pitch roof of the same square footage.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Underestimating Penetration Impact</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Each roof penetration requires 4-8 linear feet of additional underlayment for proper wrapping and waterproofing. Roofs with 6+ penetrations can require an extra full roll; many estimators overlook this entirely, leading to shortages.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Only Felt Under Ice and Water Shield Areas</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Some contractors fail to budget ice and water shield separately from standard underlayment. Ice and water shield costs 2-3 times more and covers smaller areas (200-300 sq ft vs 400+ sq ft), requiring a distinct line-item calculation.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Adding Waste Buffer</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Estimating exactly the square footage needed without waste allowance virtually guarantees mid-project shortages. Industry standard is 10-15% waste; complex roofs may need 20%. Cutting corners on waste estimates costs far more in delays than the $50-100 extra roll.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many rolls of underlayment do I need for a 2,000 square foot roof?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Most standard underlayment rolls cover 400-437 square feet per roll. For a 2,000 square foot roof, you would need approximately 5-6 rolls, assuming standard 36-inch wide rolls that are 3-feet wide. Always add 10% extra for waste, overlaps, and cutting around penetrations, bringing your total to 5-7 rolls for this size roof.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard overlap requirement for roof underlayment?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Building codes typically require a 4-6 inch horizontal overlap between underlayment rows and a 6-12 inch overlap at seams and valleys. This overlap is critical for proper water shedding and prevents water from running under the material during heavy rain or ice dams. Always consult your local building code, as requirements vary by region and roof pitch.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I account for roof pitch in my underlayment calculation?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Steeper roof pitches require more material due to increased waste from cutting and overlapping. A 4/12 to 6/12 pitch (moderate slope) typically needs 5-10% additional material, while pitches steeper than 8/12 may require 15-20% extra. Your calculator should adjust for slope angle, but when in doubt, add an extra roll to your estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What types of underlayment require different roll calculations?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Asphalt-saturated felt (15 lb or 30 lb) comes in rolls of approximately 400 square feet, while synthetic underlayment rolls often cover 437 or 500 square feet. Ice and water shield rolls are typically much smaller at 200-300 square feet per roll. Check your specific product's coverage rate before ordering, as dimensions vary significantly between manufacturers.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much underlayment waste should I budget for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Industry standards recommend budgeting 10-15% waste for typical roofs with simple designs. Complex roofs with multiple valleys, skylights, and chimneys may require 20-25% additional material. Accounting for waste in your estimate prevents mid-project shortages and is one of the most common reasons homeowners underestimate material needs.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do I need different underlayment for valleys and eaves?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, many building codes require ice and water shield (a self-adhering membrane) in valleys, along eaves, and at roof penetrations, while the rest of the roof may use standard asphalt-felt or synthetic underlayment. Ice and water shield costs 2-3 times more than standard underlayment but covers smaller areas (typically 200-300 sq ft per roll). Factor both materials separately in your estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between felt and synthetic underlayment coverage?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Traditional asphalt-saturated felt rolls cover approximately 400 square feet per 3-foot wide roll, while synthetic underlayment typically covers 437-500 square feet per roll depending on the manufacturer. Synthetic underlayment is lighter, more durable, and resists tearing during installation, making it the industry standard for modern roofing. Both require the same overlap calculations, but synthetic may reduce total rolls needed by 5-10%.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do roof penetrations affect my underlayment estimate?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Each roof penetration (chimney, vent, skylight) requires 4-8 additional linear feet of underlayment for proper wrapping and waterproofing. A roof with 5-6 penetrations typically needs an extra 0.5-1 full roll of material. The calculator should prompt you to enter penetration counts or add 10-15% to your base estimate if your roof has multiple features.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the cost difference between ordering 10% extra versus running short?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A single roll of asphalt felt costs $40-60, while synthetic underlayment runs $60-100 per roll. Running short requires an emergency reorder costing 20-30% more due to expedited shipping and potential labor delays at $60-80 per hour. Budgeting an extra $50-150 upfront for waste is always more economical than project delays or partial installation completion.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nfpa.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">NFPA 241: Standard for Safeguarding Construction, Demolition and Maintenance Operations Against Fire and Explosion</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">National Fire Protection Association standards for roof underlayment installation and overlap requirements in construction.</p>
          </li>
          <li>
            <a href="https://www.iccsafe.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">International Building Code (IBC) Roofing Requirements</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ICC provides model building codes adopted by most states; includes specific underlayment specifications, overlap minimums, and installation standards.</p>
          </li>
          <li>
            <a href="https://www.astm.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ASTM D226 - Standard Specification for Asphalt-Saturated Organic Felt</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">ASTM International standards defining underlayment material specifications, coverage rates, and performance benchmarks for asphalt felt products.</p>
          </li>
          <li>
            <a href="https://www.gaf.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">GAF Roofing Underlayment Installation Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Leading roofing manufacturer guidance on underlayment types, coverage calculations, overlap requirements, and best practices for residential installations.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Roof Underlayment Roll Estimator"
      description="The ultimate professional guide and calculator for Roof Underlayment Roll Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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