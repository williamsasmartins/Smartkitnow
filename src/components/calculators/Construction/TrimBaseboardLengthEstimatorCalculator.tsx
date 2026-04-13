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

export default function TrimBaseboardLengthEstimatorCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric (meters) or imperial (feet)
    length: "", // room perimeter length (m or ft)
    waste: "10", // waste percentage
    price: "", // price per unit length
    materialSize: "standard", // standard or large length per unit
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Conversion constants
  const METERS_TO_FEET = 3.28084;

  // Material sizes in meters and feet (length per unit piece)
  // Standard baseboard length: 2.4m (8ft), Large: 3.6m (12ft)
  const materialLengths = {
    metric: {
      standard: 2.4,
      large: 3.6,
    },
    imperial: {
      standard: 8,
      large: 12,
    },
  };

  const results = useMemo(() => {
    // Parse inputs
    const lengthRaw = parseFloat(inputs.length);
    const wastePercent = parseFloat(inputs.waste);
    const pricePerUnit = parseFloat(inputs.price);
    if (isNaN(lengthRaw) || lengthRaw <= 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter a valid length.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }
    if (isNaN(wastePercent) || wastePercent < 0) {
      return {
        mainQty: "0 Units",
        cost: "$0.00",
        details: "Please enter a valid waste percentage.",
        wasteInfo: `+${inputs.waste}% Waste included`,
      };
    }

    // Determine material length per unit based on unit system and size
    const unitSystem = inputs.unit === "imperial" ? "imperial" : "metric";
    const pieceLength = materialLengths[unitSystem][inputs.materialSize] || materialLengths[unitSystem].standard;

    // Total length needed including waste
    const totalLengthWithWaste = lengthRaw * (1 + wastePercent / 100);

    // Calculate number of units needed (round up)
    const unitsNeeded = Math.ceil(totalLengthWithWaste / pieceLength);

    // Calculate cost if price per unit is provided
    const totalCost = !isNaN(pricePerUnit) && pricePerUnit > 0 ? unitsNeeded * pricePerUnit : null;

    // Format results
    const mainQty = `${unitsNeeded} Unit${unitsNeeded !== 1 ? "s" : ""}`;
    const cost = totalCost !== null ? `$${totalCost.toFixed(2)}` : "N/A";
    const details = `Raw Length: ${lengthRaw.toFixed(2)} ${unitSystem === "metric" ? "m" : "ft"} × (1 + ${wastePercent}% waste) = ${totalLengthWithWaste.toFixed(
      2
    )} ${unitSystem === "metric" ? "m" : "ft"} total length needed. Each unit covers ${pieceLength} ${unitSystem === "metric" ? "m" : "ft"}.`;

    return {
      mainQty,
      cost,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "How do I measure my room dimensions accurately for the trim estimator?",
      answer: "Measure each wall at multiple points (top, middle, and bottom) using a 25-foot tape measure, as walls are often slightly uneven. Record measurements in feet and inches, then convert to decimal feet for the calculator (e.g., 12 feet 6 inches = 12.5 feet). For irregular rooms, break the space into rectangular sections and calculate each separately before combining totals.",
    },
    {
      question: "What's the difference between baseboard and trim in the calculator?",
      answer: "Baseboard runs along the bottom of walls where they meet the floor, typically 3.5 to 5.5 inches tall, while trim (or crown molding) runs along the top where walls meet the ceiling. The calculator treats them as separate linear measurements because baseboard requires floor-to-wall measurement and trim requires ceiling-to-wall measurement, each with different material costs and installation complexities.",
    },
    {
      question: "Should I add extra material for corners and waste?",
      answer: "Yes, add 10-15% additional material to account for cuts, miters, and installation waste. For a room requiring 100 linear feet of baseboard, purchase 110-115 linear feet. Corner pieces may require additional cuts, and door frames interrupt runs, so always round up your final estimate rather than down.",
    },
    {
      question: "How many linear feet of trim does an average bedroom need?",
      answer: "A typical 12 feet × 14 feet bedroom has perimeter of 52 linear feet for baseboard trim. Adding crown molding at the ceiling adds another 52 linear feet. Total material needed is approximately 104 linear feet before waste, or roughly 115-120 linear feet when accounting for a 10-15% buffer and corner joints.",
    },
    {
      question: "Do I need to subtract measurements for doorways and windows?",
      answer: "Yes, subtract the width of each doorway opening from your baseboard calculation, as trim stops at door frames. For windows, subtract only if trim does not wrap around the window sill—most designs do wrap, so measure around the window rather than subtracting it. The calculator should account for these interruptions in your final linear footage estimate.",
    },
    {
      question: "What's the average cost per linear foot for baseboard and trim in 2025?",
      answer: "Standard pine baseboard costs $0.50-$1.50 per linear foot, while primed MDF baseboard ranges $0.75-$2.00 per linear foot. Crown molding typically costs $1.00-$3.00 per linear foot for basic pine styles and $3.00-$8.00 per linear foot for hardwood options. Installation labor adds $1.00-$3.00 per linear foot depending on regional rates and complexity.",
    },
    {
      question: "How do I handle rooms with vaulted or sloped ceilings?",
      answer: "Measure crown molding along the sloped ceiling line using a flexible tape measure or laser distance tool, accounting for the actual distance traveled. Vaulted ceilings may require 20-30% more material than flat ceilings in the same square footage. Document the highest and lowest ceiling heights separately so the calculator can estimate the increased linear footage accurately.",
    },
    {
      question: "Can I use this calculator for multi-story homes?",
      answer: "Yes, calculate each floor separately and sum the totals. A 2-story home with identical floor plans would roughly double the material estimate, but account for variations—second-floor rooms may have different dimensions or sloped ceilings. Input each room's perimeter individually for accuracy, then aggregate the results by material type.",
    },
    {
      question: "What materials does the calculator help estimate for?",
      answer: "The estimator works for solid wood baseboard (pine, oak, maple), MDF or composite trim, PVC vinyl trim, and crown molding in various profiles. It calculates linear footage required, which then multiplies by per-foot material costs. Different profiles (colonial, ranch, craftsman, contemporary) have similar linear footage requirements but vary significantly in cost per foot.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are installing baseboards around a living room with a total perimeter of 25 feet. You want to order standard 8-foot baseboard pieces and include a 10% waste margin to account for cuts and mistakes.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Total perimeter length = 25 ft",
      },
      {
        label: "2. Waste",
        explanation: "Add 10% waste: 25 ft × 1.10 = 27.5 ft total length needed",
      },
      {
        label: "3. Order",
        explanation: "Divide total length by piece length: 27.5 ft ÷ 8 ft = 3.44 → round up to 4 units",
      },
    ],
    result: "Final Order: 4 units of 8-foot baseboard",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula: "Units Needed = ⌈ (Total Length × (1 + Waste %)) ÷ Piece Length ⌉",
    variables: [
      { symbol: "Total Length", description: "Total perimeter length of the area (meters or feet)" },
      { symbol: "Waste %", description: "Waste margin percentage expressed as a decimal (e.g., 0.10 for 10%)" },
      { symbol: "Piece Length", description: "Length of one baseboard or trim piece (meters or feet)" },
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
            <SelectItem value="metric">Metric (meters)</SelectItem>
            <SelectItem value="imperial">Imperial (feet)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Length Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Total Perimeter Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder={`Enter length in ${inputs.unit === "metric" ? "meters" : "feet"}`}
          />
        </div>

        {/* Material Size */}
        <div className="space-y-2">
          <Label>Material Size</Label>
          <Select value={inputs.materialSize} onValueChange={(v) => handleInputChange("materialSize", v)}>
            <SelectTrigger>
              <Box className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Size ({inputs.unit === "metric" ? "2.4 m" : "8 ft"})</SelectItem>
              <SelectItem value="large">Large Size ({inputs.unit === "metric" ? "3.6 m" : "12 ft"})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Waste & Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Waste Margin (%)</Label>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between font-semibold text-blue-600">{inputs.waste}%</div>
            <Slider
              value={[parseInt(inputs.waste) || 10]}
              min={0}
              max={25}
              step={1}
              onValueChange={(v) => handleInputChange("waste", v[0].toString())}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price per Unit ({inputs.unit === "metric" ? "per piece" : "per piece"})</Label>
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

      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg flex items-center justify-center gap-2"
        onClick={() => {}}
        type="button"
      >
        <Hammer className="h-5 w-5" /> Calculate
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Trim & Baseboard Length Estimator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Trim & Baseboard Length Estimator calculates the linear footage of trim and baseboard materials needed for interior walls in residential spaces. Accurate estimates prevent costly material shortages or excessive waste, helping you budget for both materials and labor while ensuring seamless, professional-looking installations throughout your home.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">To use this calculator, input your room dimensions (length and width in feet), specify which trim types you need (baseboard, crown molding, or both), and note any doorways or windows that interrupt the trim run. The calculator will compute total linear footage required and multiply by per-foot material costs if you provide unit pricing for your chosen materials.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Review the results to determine total linear footage needed, then add 10-15% as a waste buffer for cuts and mistakes. Use the cost estimates as a baseline for material purchasing and compare against quotes from local suppliers. The calculator's output guides both DIY projects and contractor discussions, ensuring transparency in material requirements and project scope.</p>
        </div>
      </section>

      {/* TABLE: Standard Baseboard & Trim Heights and Styles */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Standard Baseboard & Trim Heights and Styles</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Common baseboard and crown molding dimensions vary by architectural style and room type.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Style</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Baseboard Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Crown Molding Height</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Best Used In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Ranch</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3.25 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Casual modern homes</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Colonial</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">4.75 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Traditional or formal spaces</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Craftsman</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">5.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Arts and crafts or cottage style</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Contemporary</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">2.5 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">3 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Minimalist or modern interiors</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Victorian</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">8-12 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">6-8 inches</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Historic or ornate designs</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Heights are nominal measurements; actual dimensions vary by manufacturer. Taller trim costs more material per linear foot.</p>
      </section>

      {/* TABLE: Material Costs Per Linear Foot (2024-2025 Estimates) */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Material Costs Per Linear Foot (2024-2025 Estimates)</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Typical pricing for baseboard and trim materials before installation labor, varying by material type and quality.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Material Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Baseboard Cost/LF</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Crown Molding Cost/LF</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Labor Cost/LF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Pine (unprimed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.50–$1.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.75–$1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.00–$1.50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">MDF (primed)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$0.75–$1.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.00–$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.25–$2.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hardwood (Oak/Maple)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50–$3.50</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.50–$5.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50–$2.50</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">PVC Vinyl</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.00–$2.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.50–$3.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$1.00–$2.00</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">Hardwood Premium</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$3.00–$6.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$4.00–$8.00</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$2.00–$3.50</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Prices vary by region, supplier, and supplier volume discounts. Labor costs depend on local market rates and installation complexity (corners, cutouts, transitions).</p>
      </section>

      {/* TABLE: Linear Footage Estimates for Common Room Sizes */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Linear Footage Estimates for Common Room Sizes</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Approximate trim and baseboard material required for standard rectangular rooms, before 10-15% waste buffer.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Room Dimensions</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Perimeter (LF)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Baseboard Only (LF)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Baseboard + Crown (LF)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cost Range (Basic Materials)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">10' × 12'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">44</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$44–$132</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">12' × 14'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">52</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">104</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$52–$156</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">14' × 16'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">60</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">120</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$60–$180</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">16' × 20'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">72</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">144</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$72–$216</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">20' × 24'</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">88</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">176</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">$88–$264</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Costs shown use $0.50–$1.50/LF for baseboard and $0.75–$1.50/LF for crown molding. Actual costs vary by material quality and regional pricing. Does not include installation labor or waste buffer.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always measure twice and use decimal feet notation (12 feet 6 inches = 12.5 feet) to avoid calculation errors—misreading a single room by 1-2 feet compounds across the entire project.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Purchase trim in longer pieces (12-16 feet) rather than shorter lengths when possible; longer boards have fewer joints and create cleaner, more professional-looking installations with less visible seams.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Request material samples from your supplier in your chosen finish (primed, stained, or natural) to verify color match and profile before ordering bulk quantities, as different brands' 'colonial' baseboard may look noticeably different.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for ceiling height variations—rooms with 8-foot ceilings need different crown molding calculations than 9- or 10-foot ceilings; measure the actual distance your trim must travel, not just the horizontal perimeter.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Forgetting to subtract doorway widths</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Many projects overestimate baseboard by failing to subtract door frame openings (typically 3-4 feet per doorway). Each 3-foot door saved reduces material cost by $1.50–$6.00 in baseboard alone, compounding across multiple rooms.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Calculating only horizontal perimeter for crown molding in vaulted rooms</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Vaulted or cathedral ceilings require crown molding measured along the actual sloped surface, not the floor perimeter; using only horizontal distance underestimates material by 20-40% depending on slope angle.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not accounting for corner waste and miter cuts</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Every inside and outside corner requires careful angle cuts that often waste 6-12 inches of material; failing to budget 10-15% waste leads to material shortages before project completion.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Mixing measurement units inconsistently</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Entering some measurements in feet and others in feet-and-inches creates calculation errors; always convert to consistent decimal notation (12'6" = 12.5 feet) before inputting into the calculator.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I measure my room dimensions accurately for the trim estimator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure each wall at multiple points (top, middle, and bottom) using a 25-foot tape measure, as walls are often slightly uneven. Record measurements in feet and inches, then convert to decimal feet for the calculator (e.g., 12 feet 6 inches = 12.5 feet). For irregular rooms, break the space into rectangular sections and calculate each separately before combining totals.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the difference between baseboard and trim in the calculator?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Baseboard runs along the bottom of walls where they meet the floor, typically 3.5 to 5.5 inches tall, while trim (or crown molding) runs along the top where walls meet the ceiling. The calculator treats them as separate linear measurements because baseboard requires floor-to-wall measurement and trim requires ceiling-to-wall measurement, each with different material costs and installation complexities.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Should I add extra material for corners and waste?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, add 10-15% additional material to account for cuts, miters, and installation waste. For a room requiring 100 linear feet of baseboard, purchase 110-115 linear feet. Corner pieces may require additional cuts, and door frames interrupt runs, so always round up your final estimate rather than down.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How many linear feet of trim does an average bedroom need?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">A typical 12 feet × 14 feet bedroom has perimeter of 52 linear feet for baseboard trim. Adding crown molding at the ceiling adds another 52 linear feet. Total material needed is approximately 104 linear feet before waste, or roughly 115-120 linear feet when accounting for a 10-15% buffer and corner joints.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Do I need to subtract measurements for doorways and windows?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, subtract the width of each doorway opening from your baseboard calculation, as trim stops at door frames. For windows, subtract only if trim does not wrap around the window sill—most designs do wrap, so measure around the window rather than subtracting it. The calculator should account for these interruptions in your final linear footage estimate.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What's the average cost per linear foot for baseboard and trim in 2025?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard pine baseboard costs $0.50-$1.50 per linear foot, while primed MDF baseboard ranges $0.75-$2.00 per linear foot. Crown molding typically costs $1.00-$3.00 per linear foot for basic pine styles and $3.00-$8.00 per linear foot for hardwood options. Installation labor adds $1.00-$3.00 per linear foot depending on regional rates and complexity.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I handle rooms with vaulted or sloped ceilings?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Measure crown molding along the sloped ceiling line using a flexible tape measure or laser distance tool, accounting for the actual distance traveled. Vaulted ceilings may require 20-30% more material than flat ceilings in the same square footage. Document the highest and lowest ceiling heights separately so the calculator can estimate the increased linear footage accurately.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I use this calculator for multi-story homes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, calculate each floor separately and sum the totals. A 2-story home with identical floor plans would roughly double the material estimate, but account for variations—second-floor rooms may have different dimensions or sloped ceilings. Input each room's perimeter individually for accuracy, then aggregate the results by material type.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What materials does the calculator help estimate for?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The estimator works for solid wood baseboard (pine, oak, maple), MDF or composite trim, PVC vinyl trim, and crown molding in various profiles. It calculates linear footage required, which then multiplies by per-foot material costs. Different profiles (colonial, ranch, craftsman, contemporary) have similar linear footage requirements but vary significantly in cost per foot.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.nahb.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Association of Home Builders (NAHB) Construction Standards</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Industry standards for baseboard, trim, and crown molding installation practices and material specifications.</p>
          </li>
          <li>
            <a href="https://www.thespruce.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">The Spruce – Home Improvement and DIY Guide</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Comprehensive residential trim and baseboard selection, installation techniques, and cost estimation resources.</p>
          </li>
          <li>
            <a href="https://www.osha.gov/construction" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">U.S. Department of Labor – OSHA Construction Safety</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Safety guidelines and best practices for construction work including trim installation and material handling.</p>
          </li>
          <li>
            <a href="https://www.homeadvisor.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">HomeAdvisor Cost Guides for Trim Installation</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Up-to-date material and labor cost data for baseboard, trim, and crown molding installation by region.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Trim & Baseboard Length Estimator"
      description="The ultimate professional guide and calculator for Trim & Baseboard Length Estimator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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