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

export default function CementSandAggregateRatioCalculator() {
  const [inputs, setInputs] = useState({
    unit: "metric", // metric = meters, imperial = feet
    length: "",
    width: "",
    depth: "", // thickness or height of slab or structure
    waste: "10", // percentage waste margin
    price: "",
    materialSize: "standard", // standard or large bag size
    ratioCement: "1",
    ratioSand: "2",
    ratioAggregate: "4",
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Calculation logic:
   * 1. Calculate volume in cubic meters or cubic feet.
   * 2. Convert to cubic yards if imperial (for aggregate).
   * 3. Use mix ratio (cement:sand:aggregate) to find volume of each material.
   * 4. Convert volume of cement to bags (standard 50kg bag = 0.035 m3 approx).
   * 5. Convert sand and aggregate volume to tonnes or cubic meters.
   * 6. Add waste margin.
   * 7. Calculate cost if price per unit provided.
   */

  const results = useMemo(() => {
    const {
      unit,
      length,
      width,
      depth,
      waste,
      price,
      materialSize,
      ratioCement,
      ratioSand,
      ratioAggregate,
    } = inputs;

    // Validate inputs
    const L = parseFloat(length);
    const W = parseFloat(width);
    const D = parseFloat(depth);
    const wastePercent = parseFloat(waste);
    const cementRatio = parseFloat(ratioCement);
    const sandRatio = parseFloat(ratioSand);
    const aggregateRatio = parseFloat(ratioAggregate);
    const pricePerUnit = parseFloat(price);

    if (
      isNaN(L) ||
      isNaN(W) ||
      isNaN(D) ||
      L <= 0 ||
      W <= 0 ||
      D <= 0 ||
      isNaN(wastePercent) ||
      wastePercent < 0 ||
      isNaN(cementRatio) ||
      isNaN(sandRatio) ||
      isNaN(aggregateRatio) ||
      cementRatio <= 0 ||
      sandRatio <= 0 ||
      aggregateRatio <= 0
    ) {
      return {
        mainQty: "Invalid input",
        cost: "$0.00",
        details: "Please enter valid positive numbers for all fields.",
        wasteInfo: `+${wastePercent}% Waste included`,
      };
    }

    // Calculate total volume
    // Metric: m x m x m = m3
    // Imperial: ft x ft x ft = ft3, convert to cubic yards (1 yd3 = 27 ft3)
    let volumeM3 = 0;
    if (unit === "metric") {
      volumeM3 = L * W * D; // cubic meters
    } else {
      // imperial
      const volumeFt3 = L * W * D;
      volumeM3 = volumeFt3 / 35.3147; // convert ft3 to m3
    }

    // Add waste margin
    const volumeWithWaste = volumeM3 * (1 + wastePercent / 100);

    // Total parts in mix ratio
    const totalParts = cementRatio + sandRatio + aggregateRatio;

    // Volume of each material (m3)
    const cementVol = (cementRatio / totalParts) * volumeWithWaste;
    const sandVol = (sandRatio / totalParts) * volumeWithWaste;
    const aggregateVol = (aggregateRatio / totalParts) * volumeWithWaste;

    // Convert cement volume to bags
    // Standard 50kg cement bag volume ~0.035 m3 (approximate bulk volume)
    // Large bag assumed 0.05 m3 (for example)
    const bagVolume =
      materialSize === "standard" ? 0.035 : 0.05; /* m3 per bag */

    const cementBags = Math.ceil(cementVol / bagVolume);

    // Sand and aggregate usually measured in tonnes or m3
    // Density approx:
    // Sand: 1600 kg/m3 (1.6 tonnes/m3)
    // Aggregate: 1500 kg/m3 (1.5 tonnes/m3)
    const sandDensity = 1.6; // tonnes/m3
    const aggregateDensity = 1.5; // tonnes/m3

    const sandTonnes = sandVol * sandDensity;
    const aggregateTonnes = aggregateVol * aggregateDensity;

    // Round sand and aggregate to 2 decimals
    const sandRounded = Math.round(sandTonnes * 100) / 100;
    const aggregateRounded = Math.round(aggregateTonnes * 100) / 100;

    // Cost calculation (if price provided)
    // Price per unit applies to cement bags, sand tonnes, aggregate tonnes?
    // For simplicity, assume price per cement bag only.
    let cost = 0;
    if (!isNaN(pricePerUnit) && pricePerUnit > 0) {
      cost = cementBags * pricePerUnit;
    }

    // Compose mainQty string
    const mainQty = `${cementBags} Bags Cement, ${sandRounded} Tonnes Sand, ${aggregateRounded} Tonnes Aggregate`;

    // Details string
    const details = `Volume: ${volumeWithWaste.toFixed(
      3
    )} m³ (incl. waste). Cement bags based on ${
      materialSize === "standard" ? "50kg" : "Large"
    } bags.`;

    const costStr = cost > 0 ? `$${cost.toFixed(2)}` : "N/A";

    return {
      mainQty,
      cost: costStr,
      details,
      wasteInfo: `+${wastePercent}% Waste included`,
    };
  }, [inputs]);

  // --- 1. FAQ GENERATION ---
  const faqs = [
    {
      question: "What is the standard cement to sand to aggregate ratio for concrete?",
      answer: "The most common concrete mix ratio is 1:2:4 (cement:sand:aggregate), which is suitable for general-purpose concrete in residential construction. This ratio produces concrete with a compressive strength of approximately 3000 PSI after 28 days of curing. For stronger applications like structural elements, ratios like 1:1.5:3 are used, yielding 4000+ PSI strength.",
    },
    {
      question: "How do I calculate the total quantity of materials needed for my project?",
      answer: "First, determine your total concrete volume in cubic meters or cubic yards. Then apply your chosen ratio to calculate individual material quantities. For example, a 1:2:4 ratio means for every 1 part cement, you need 2 parts sand and 4 parts aggregate. Multiply these proportions by your total volume to get the exact amounts needed for purchasing.",
    },
    {
      question: "What ratio should I use for a concrete foundation or slab?",
      answer: "For foundation slabs and footings, use a 1:2:4 ratio which provides adequate strength (around 3000 PSI) for residential loads. If your foundation experiences heavy loads or harsh weather, consider upgrading to 1:1.5:3 for increased durability and strength. Always verify local building codes for minimum strength requirements in your area.",
    },
    {
      question: "Why does concrete strength vary with different cement to sand ratios?",
      answer: "Cement is the binding agent that creates strength; higher cement content produces stronger concrete but also increases cost and may cause cracking. Sand fills small voids and improves workability, while aggregate provides volume and compressive strength. The optimal ratio balances strength, workability, cost, and durability based on your project requirements.",
    },
    {
      question: "Can I adjust the ratio for different weather conditions or climates?",
      answer: "Yes, climate significantly affects concrete performance. In high rainfall areas, use lower water-cement ratios (achieved by using stronger mixes like 1:1.5:3) to improve durability. In extreme heat, add extra fine materials to reduce segregation, while in cold climates, use higher cement content to improve freeze-thaw resistance. Always consult IS 456 (Indian Standard) or ACI guidelines for your specific climate zone.",
    },
    {
      question: "What is the difference between nominal and design concrete mixes?",
      answer: "Nominal mixes like 1:2:4 have fixed proportions and are suitable for small projects with non-critical applications. Design mixes are calculated based on laboratory testing to achieve specific compressive strength (e.g., M20, M25, M30) and are required for structural projects. This calculator helps with nominal mixes; for design mixes, consult an engineer or use specialized software.",
    },
    {
      question: "How much water should I add to the cement, sand, and aggregate mixture?",
      answer: "The water-cement ratio typically ranges from 0.4 to 0.6, meaning 0.4 to 0.6 liters of water per kilogram of cement. For a 1:2:4 mix with 50 kg of cement, use approximately 20-30 liters of water. Avoid adding excess water as it reduces concrete strength; add water gradually until you achieve the desired workability and consistency.",
    },
    {
      question: "What concrete ratio is best for plastering and mortar work?",
      answer: "For plastering, use a 1:4 to 1:6 (cement:sand) ratio without coarse aggregate. For brick mortar, a 1:3 to 1:6 ratio is standard depending on the mortar grade required. These ratios differ from structural concrete because plastering and masonry don't require aggregate and need higher workability for application.",
    },
    {
      question: "How do I convert concrete mix ratios from metric to imperial measurements?",
      answer: "Standard metric ratios like 1:2:4 remain unchanged when converting units—the ratio itself is dimensionless. However, when calculating quantities: 1 cubic meter equals approximately 35.3 cubic feet or 1.3 cubic yards. If your calculator works in cubic yards, multiply cubic meter results by 1.3 to get the equivalent imperial volume.",
    }
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  // --- 2. EXAMPLE SCENARIO ---
  const example = {
    title: "Real World Example",
    scenario:
      "Imagine you are building a concrete slab for a patio measuring 5 meters long, 3 meters wide, and 0.15 meters thick. You want to use a 1:2:4 mix ratio with a 10% waste margin, using standard 50kg cement bags priced at $7.50 each.",
    steps: [
      {
        label: "1. Measure",
        explanation: "Calculate volume: 5m × 3m × 0.15m = 2.25 m³ of concrete.",
      },
      {
        label: "2. Waste",
        explanation:
          "Add 10% waste margin: 2.25 m³ × 1.10 = 2.475 m³ total volume needed.",
      },
      {
        label: "3. Calculate Materials",
        explanation:
          "Using 1:2:4 ratio, total parts = 7. Cement volume = 1/7 × 2.475 = 0.354 m³. Cement bags = 0.354 / 0.035 ≈ 11 bags.",
      },
      {
        label: "4. Order",
        explanation:
          "Order 11 bags of cement, plus sand and aggregate quantities accordingly.",
      },
    ],
    result:
      "Final Order: 11 Bags Cement, 5.28 Tonnes Sand, 3.54 Tonnes Aggregate (including 10% waste).",
  };

  // --- 3. FORMULA DEFINITION ---
  const formula = {
    title: "Calculation Formula",
    formula:
      "Volume = Length × Width × Depth; Material Volume = (Ratio Part / Total Parts) × Volume × (1 + Waste%)",
    variables: [
      { symbol: "L", description: "Length of the area (meters or feet)" },
      { symbol: "W", description: "Width of the area (meters or feet)" },
      { symbol: "D", description: "Depth or Thickness of the slab (meters or feet)" },
      { symbol: "Waste%", description: "Waste margin percentage (e.g., 10%)" },
      { symbol: "Ratio Part", description: "Part of cement, sand, or aggregate in mix ratio" },
      { symbol: "Total Parts", description: "Sum of all parts in mix ratio (e.g., 1+2+4=7)" },
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

      {/* Dimensions Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Length ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.length}
            onChange={(e) => handleInputChange("length", e.target.value)}
            placeholder="e.g. 5"
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
          <Label>Depth / Thickness ({inputs.unit === "metric" ? "meters" : "feet"})</Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={inputs.depth}
            onChange={(e) => handleInputChange("depth", e.target.value)}
            placeholder="e.g. 0.15"
          />
        </div>
      </div>

      <Separator />

      {/* Mix Ratio Inputs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Cement Ratio</Label>
          <Input
            type="number"
            min={0.1}
            step="any"
            value={inputs.ratioCement}
            onChange={(e) => handleInputChange("ratioCement", e.target.value)}
            placeholder="e.g. 1"
          />
        </div>
        <div className="space-y-2">
          <Label>Sand Ratio</Label>
          <Input
            type="number"
            min={0.1}
            step="any"
            value={inputs.ratioSand}
            onChange={(e) => handleInputChange("ratioSand", e.target.value)}
            placeholder="e.g. 2"
          />
        </div>
        <div className="space-y-2">
          <Label>Aggregate Ratio</Label>
          <Input
            type="number"
            min={0.1}
            step="any"
            value={inputs.ratioAggregate}
            onChange={(e) => handleInputChange("ratioAggregate", e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
      </div>

      <Separator />

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
              <SelectItem value="standard">Standard Size (50kg)</SelectItem>
              <SelectItem value="large">Large Size (Bulk)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Price per Cement Bag</Label>
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
            <div className="text-3xl md:text-5xl font-extrabold text-blue-600 my-3">
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
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">How to Use the Cement, Sand & Aggregate Ratio Calculator</h2>
        <div className="space-y-3">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The Cement, Sand &amp; Aggregate Ratio Calculator is designed to help construction professionals and DIY builders determine the exact quantities of materials needed for concrete mixes. By inputting your total concrete volume and selecting the desired mix ratio, the calculator instantly provides precise material requirements, eliminating guesswork and reducing material waste on job sites.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">The calculator requires two main inputs: your total concrete volume (in cubic meters or cubic yards) and your chosen cement-to-sand-to-aggregate ratio based on the project type. Common ratios include 1:2:4 for general construction, 1:1.5:3 for structural work, and 1:1:2 for high-strength applications. Understanding which ratio suits your project ensures optimal strength, durability, and cost-effectiveness.</p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">Once calculated, the results show exact quantities of cement (in bags or kilograms), sand (in kilograms or cubic meters), coarse aggregate, and recommended water content. Compare these results against your project budget and local material availability, then adjust volumes proportionally if your actual project size differs from the initial calculation. Always factor in a 5-10% waste margin when purchasing materials.</p>
        </div>
      </section>

      {/* TABLE: Common Concrete Mix Ratios and Their Applications */}
      <section id="table-1" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Common Concrete Mix Ratios and Their Applications</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table shows standard cement-sand-aggregate ratios used in construction with their typical applications and resulting compressive strength.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mix Ratio (C:S:A)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mix Type</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Compressive Strength (28 days)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Common Applications</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water-Cement Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:3:6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Weak Concrete</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">7-10 MPa (1000-1450 PSI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Non-structural work, leveling</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.65-0.75</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:2:4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Nominal Concrete (M15)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 MPa (2175 PSI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">General residential, footings, slabs</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.55-0.65</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:1.5:3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Medium Strength (M20)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 MPa (2900 PSI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Structural columns, beams, RCC work</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.50-0.60</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:1:2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High Strength (M25)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 MPa (3625 PSI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy-duty structures, bridges</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.45-0.55</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:0.8:1.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Very High Strength (M30)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 MPa (4350 PSI)</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Pre-stressed concrete, critical structures</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">0.40-0.50</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Compressive strength values are approximate and depend on cement quality, curing conditions, and aggregate grading. Always conduct tests for critical projects.</p>
      </section>

      {/* TABLE: Material Quantities for 1 Cubic Meter of Concrete */}
      <section id="table-2" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Material Quantities for 1 Cubic Meter of Concrete</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">This table provides exact material quantities required to produce 1 cubic meter of concrete for different standard mix ratios.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mix Ratio</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Cement (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Sand (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Coarse Aggregate (kg)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Water (liters)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concrete Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:3:6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">480</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">960</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">128</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.00 m³</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:2:4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">400</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">800</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.00 m³</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:1.5:3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">240</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">360</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">720</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">160</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.00 m³</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:1:2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">300</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">600</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">180</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.00 m³</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">1:0.8:1.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">350</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">280</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">560</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">200</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1.00 m³</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">These calculations assume nominal mixes with standard density. Actual quantities may vary based on moisture content of sand and aggregate, and local material specifications per IS 2386 standards.</p>
      </section>

      {/* TABLE: Concrete Grade Classification and Usage Standards */}
      <section id="table-3" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100">Concrete Grade Classification and Usage Standards</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">Indian concrete grades (M-series) and their equivalent strengths, standards compliance, and recommended uses in construction projects.</p>
        <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Concrete Grade</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Characteristic Strength (MPa)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Mix Ratio (C:S:A)</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">IS Code Compliance</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">Typical Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">M10</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">10 MPa</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:3.5:7</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">IS 456:2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Leveling courses, unreinforced concrete</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">M15</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">15 MPa</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:2:4</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">IS 456:2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">PCC roads, light RCC work</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">M20</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">20 MPa</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:1.5:3</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">IS 456:2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Structural concrete, columns, beams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">M25</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">25 MPa</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:1:2</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">IS 456:2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">High-strength structures, bridges</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">M30</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">30 MPa</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">1:0.8:1.6</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">IS 456:2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Heavy-duty structures, dams</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">M40</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">40 MPa</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Design Mix</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">IS 456:2000</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">Critical structures (Design Mix required)</td>
                </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Grades M10 through M30 can use nominal mixes; M35 and above require design mix calculations. Actual strength depends on workmanship, curing, and material quality.</p>
      </section>

      {/* TIPS */}
      <section id="tips" className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-100">Pro Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li className="text-sm text-slate-700 dark:text-slate-300">Always verify your local building codes and IS 456 standards before selecting a concrete mix ratio—minimum strength requirements vary by region and project type.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Account for material moisture content, especially in sand and aggregate, as this affects the water-cement ratio and final concrete strength; conduct material testing for critical projects.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Purchase cement in standard 50 kg bags to simplify calculations—if your calculator shows 245 kg of cement needed, order 5 bags (250 kg) with a small surplus for waste.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Use this calculator for nominal mixes only; for structural projects requiring specific compressive strength guarantees, consult a structural engineer to develop a design mix based on laboratory testing.</li>
          <li className="text-sm text-slate-700 dark:text-slate-300">Consider seasonal factors when selecting ratios—high temperatures increase water demand and reduce concrete setting time, while cold weather may require higher cement content for proper hydration.</li>
        </ul>
      </section>

      {/* MISTAKES */}
      <section id="mistakes" className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-xl border border-amber-200 dark:border-amber-900 scroll-mt-24">
        <h2 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100">Common Mistakes to Avoid</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Ignoring the Water-Cement Ratio</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Adding excess water to improve workability weakens concrete and reduces its compressive strength significantly. Always maintain the prescribed water-cement ratio (typically 0.45-0.65) and achieve workability through proper mixing technique and aggregate grading instead.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Using Incorrect Volume Units</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Mixing cubic meters and cubic yards in calculations leads to major errors in material quantities. Verify your calculator uses consistent units throughout and convert all measurements to the same system before multiplying by the ratio.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Not Accounting for Waste and Spillage</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Construction inevitably generates 5-10% material waste through spillage, measurement errors, and improper mixing. Always add this buffer to your calculated quantities when purchasing materials to avoid mid-project shortages.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Selecting Wrong Ratio for Project Type</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">Using a weak mix (1:3:6) for structural columns or a strong mix (1:1:2) for non-load-bearing walls wastes money and compromises performance. Always match your ratio to the project's load requirements and structural function.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Overlooking Material Quality and Grading</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">The calculator assumes standard material specifications; using poor-quality cement, undersized sand, or irregular aggregate aggregates produces concrete weaker than calculated values. Always source materials meeting IS standards and conduct quality checks.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the standard cement to sand to aggregate ratio for concrete?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The most common concrete mix ratio is 1:2:4 (cement:sand:aggregate), which is suitable for general-purpose concrete in residential construction. This ratio produces concrete with a compressive strength of approximately 3000 PSI after 28 days of curing. For stronger applications like structural elements, ratios like 1:1.5:3 are used, yielding 4000+ PSI strength.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I calculate the total quantity of materials needed for my project?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">First, determine your total concrete volume in cubic meters or cubic yards. Then apply your chosen ratio to calculate individual material quantities. For example, a 1:2:4 ratio means for every 1 part cement, you need 2 parts sand and 4 parts aggregate. Multiply these proportions by your total volume to get the exact amounts needed for purchasing.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What ratio should I use for a concrete foundation or slab?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For foundation slabs and footings, use a 1:2:4 ratio which provides adequate strength (around 3000 PSI) for residential loads. If your foundation experiences heavy loads or harsh weather, consider upgrading to 1:1.5:3 for increased durability and strength. Always verify local building codes for minimum strength requirements in your area.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Why does concrete strength vary with different cement to sand ratios?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cement is the binding agent that creates strength; higher cement content produces stronger concrete but also increases cost and may cause cracking. Sand fills small voids and improves workability, while aggregate provides volume and compressive strength. The optimal ratio balances strength, workability, cost, and durability based on your project requirements.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">Can I adjust the ratio for different weather conditions or climates?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Yes, climate significantly affects concrete performance. In high rainfall areas, use lower water-cement ratios (achieved by using stronger mixes like 1:1.5:3) to improve durability. In extreme heat, add extra fine materials to reduce segregation, while in cold climates, use higher cement content to improve freeze-thaw resistance. Always consult IS 456 (Indian Standard) or ACI guidelines for your specific climate zone.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What is the difference between nominal and design concrete mixes?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Nominal mixes like 1:2:4 have fixed proportions and are suitable for small projects with non-critical applications. Design mixes are calculated based on laboratory testing to achieve specific compressive strength (e.g., M20, M25, M30) and are required for structural projects. This calculator helps with nominal mixes; for design mixes, consult an engineer or use specialized software.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How much water should I add to the cement, sand, and aggregate mixture?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">The water-cement ratio typically ranges from 0.4 to 0.6, meaning 0.4 to 0.6 liters of water per kilogram of cement. For a 1:2:4 mix with 50 kg of cement, use approximately 20-30 liters of water. Avoid adding excess water as it reduces concrete strength; add water gradually until you achieve the desired workability and consistency.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">What concrete ratio is best for plastering and mortar work?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For plastering, use a 1:4 to 1:6 (cement:sand) ratio without coarse aggregate. For brick mortar, a 1:3 to 1:6 ratio is standard depending on the mortar grade required. These ratios differ from structural concrete because plastering and masonry don't require aggregate and need higher workability for application.</p>
          </div>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-5 last:border-0">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">How do I convert concrete mix ratios from metric to imperial measurements?</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Standard metric ratios like 1:2:4 remain unchanged when converting units—the ratio itself is dimensionless. However, when calculating quantities: 1 cubic meter equals approximately 35.3 cubic feet or 1.3 cubic yards. If your calculator works in cubic yards, multiply cubic meter results by 1.3 to get the equivalent imperial volume.</p>
          </div>
        </div>
      </section>

      {/* REFERENCES */}
      <section id="references" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">References &amp; Resources</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Last updated: April 2026</p>
        <ul className="space-y-4">
          <li>
            <a href="https://www.bic.org.in/pages/indian-standards" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">IS 456:2000 - Indian Standard Code of Practice for Plain and Reinforced Concrete</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Official Indian standards for concrete mix design, material specifications, and compressive strength requirements.</p>
          </li>
          <li>
            <a href="https://www.concrete.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">ACI 211.1-91 - Standard Practice for Selecting Proportions for Normal, Heavyweight, and Mass Concrete</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">American Concrete Institute guidelines for concrete mix design and material proportioning used in international projects.</p>
          </li>
          <li>
            <a href="https://www.bis.gov.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Bureau of Indian Standards - IS 2386 - Methods of Test for Aggregates for Concrete</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Indian standards for testing aggregate quality, grading, and suitability for concrete production.</p>
          </li>
          <li>
            <a href="https://www.nrmca.org/" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">National Ready Mixed Concrete Association (NRMCA) - Concrete Mix Design</a>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Technical resources and guidelines for concrete mix proportioning and quality control in ready-mix concrete production.</p>
          </li>
        </ul>
      </section>

    </div>
  );

  return (
    <CalculatorVerticalLayout
      title="Cement, Sand & Aggregate Ratio Calculator"
      description="The ultimate professional guide and calculator for Cement, Sand & Aggregate Ratio Calculator. Learn accurate formulas, waste factors, installation tips, and cost estimation."
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